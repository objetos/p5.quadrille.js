/**
 * @file Validator — the doclet table against the built bundle, and the pages
 * against the doclet table.
 * @module tools/docs/validator
 * @license GPL-3.0-only
 *
 * The part the Hugo site never had. `dist/p5.quadrille.js` is evaluated once
 * with a stub `p5` that records the addon, and every documented name is
 * looked for on `Quadrille` (static), on `Quadrille.prototype` (instance), or
 * on the object `registerAddon` filled (`createQuadrille`, `drawQuadrille`).
 * A documented name that exists nowhere is an error; a public name with no
 * doc block is a warning.
 *
 * Errors fail the build; warnings print and continue.
 */

import { readFileSync } from 'node:fs';

import { groupSlugs, navSlugs, p5RefUrl } from './config.js';
import { snake, slug, symbolOfTitle } from './pages.js';
import { shortcodeErrors } from './shortcode.js';

const VOCABULARY = new Set([
  'file', 'module', 'license', 'description', 'version', 'author',
  'function', 'memberof', 'name', 'param', 'returns', 'type',
  'constant', 'typedef', 'property', 'example', 'details',
  'instance', 'private', 'throws',
  'group', 'page', 'ignore',
]);

const SETUP_RE  = /(^|[^\w$])(?:async\s+)?function\s+setup\s*\(/;

// ── The built surface ───────────────────────────────────────────────────────

/**
 * Evaluate the IIFE build against a stub `p5`: `registerAddon` hands back the
 * function table the addon installs. Nothing else about p5 is needed — the
 * class body and the addon body only touch `p5` at draw time.
 * @param {string} bundlePath
 * @returns {{ Quadrille: Function, fn: Object, errors: string[] }}
 */
export function bundleSurface(bundlePath) {
  const errors = [];
  const fn = {};
  const stub = {
    RendererGL: class {},
    registerAddon(cb) { cb(stub, fn); },
  };
  let Quadrille = null;
  try {
    const code = readFileSync(bundlePath, 'utf8');
    // `var Quadrille = (function(){…})()` — hoisted in this function scope.
    Quadrille = new Function('p5', `${code}\nreturn typeof Quadrille === 'undefined' ? null : Quadrille;`)(stub);
  } catch (e) {
    errors.push(`bundle: evaluating ${bundlePath} failed — ${e.message}`);
  }
  if (!Quadrille) errors.push(`bundle: ${bundlePath} exports no Quadrille class`);
  return { Quadrille, fn, errors };
}

/** Every public member name of the class and of the addon table. */
function publicNames(Quadrille, fn) {
  const names = new Set();
  if (Quadrille) {
    for (const n of Object.getOwnPropertyNames(Quadrille)) {
      if (!n.startsWith('_') && n !== 'prototype' && n !== 'name' && n !== 'length') names.add(`Quadrille.${n}`);
    }
    for (const n of Object.getOwnPropertyNames(Quadrille.prototype)) {
      if (!n.startsWith('_') && n !== 'constructor') names.add(`Quadrille.prototype.${n}`);
    }
  }
  for (const n of Object.keys(fn)) names.add(`p5.${n}`);
  return names;
}

/**
 * The signature a function declares: its parameter names, whether it takes a
 * rest parameter, and whether any of them is destructured. Null when the list
 * cannot be read.
 * @param {Function} fn
 * @returns {{ names: string[], rest: boolean, destructured: boolean }|null}
 */
function signatureOf(fn) {
  const src = String(fn);
  const open = src.indexOf('(');
  if (open < 0) return null;
  let depth = 0, end = -1;
  for (let i = open; i < src.length; i++) {
    if (src[i] === '(') depth++;
    else if (src[i] === ')' && --depth === 0) { end = i; break; }
  }
  if (end < 0) return null;
  const inner = src.slice(open + 1, end).trim();
  if (!inner) return { names: [], rest: false, destructured: false };
  const names = [], parts = inner.split(',');
  let destructured = false, rest = false;
  for (const part of parts) {
    const t = part.trim().replace(/=.*$/s, '').trim();
    if (!t) continue;
    if (/^[[{]/.test(t)) { destructured = true; continue; }
    if (t.startsWith('...')) { rest = true; names.push(t.slice(3).trim()); }
    else names.push(t);
  }
  return { names, rest, destructured };
}

/** The function a doclet documents on one surface, when the build exposes one. */
function functionOn(surface, d, Quadrille, fn) {
  if (d.owner === 'p5') return fn?.[d.name] ?? null;
  if (!Quadrille) return null;
  const holder = surface === 'static' ? Quadrille : surface === 'instance' ? Quadrille.prototype : null;
  if (!holder) return null;
  const desc = Object.getOwnPropertyDescriptor(holder, d.name);
  if (desc?.set) return desc.set;      // an accessor's setter names its `value`
  if (typeof desc?.value === 'function') return desc.value;
  if (typeof desc?.get === 'function') return desc.get;
  return null;
}

/** Whether `owner.name` is on the surface the doclet claims. */
function resolves(d, Quadrille, fn) {
  const surfaces = d.surfaces ?? [];
  if (d.owner === 'p5') return typeof fn?.[d.name] === 'function';
  if (!Quadrille) return false;
  const onStatic   = Object.getOwnPropertyNames(Quadrille).includes(d.name) ||
                     Object.getOwnPropertyNames(Quadrille).includes(`_${d.name}`);
  const onInstance = Object.getOwnPropertyNames(Quadrille.prototype).includes(d.name);
  if (surfaces.includes('static') && onStatic) return true;
  if (surfaces.includes('instance') && onInstance) return true;
  return false;
}

// ── Doclets ─────────────────────────────────────────────────────────────────

function* fields(rows) {
  for (const r of rows) { yield r; yield* fields(r.children); }
}

/** @param {{doclets, blocks, modules}} parsed @param {{Quadrille, fn}} surface */
export function validateSources(parsed, surface) {
  const { doclets, blocks, modules } = parsed;
  const errors = [], warnings = [];
  const at   = (x) => `${x.file}:${x.line}`;
  const fail = (x, msg) => errors.push(`${at(x)}  ${msg}`);
  const warn = (x, msg) => warnings.push(`${at(x)}  ${msg}`);

  errors.push(...surface.errors);

  // Vocabulary — public blocks and module headers only.
  for (const b of blocks) {
    if (!b.public && !b.module) continue;
    for (const t of b.tags) {
      if (!VOCABULARY.has(t)) fail(b, `tag @${t} is outside the vocabulary`);
    }
  }

  for (const m of modules) {
    if (!m.license) fail(m, `@module ${m.name} carries no @license`);
  }

  // Names, owners, addresses.
  const seen = new Map();
  for (const d of doclets) {
    const key = `${d.owner}.${d.name}`;
    if (seen.has(key)) warn(d, `duplicate ${key} (first at ${seen.get(key)})`);
    else seen.set(key, at(d));

    if (d.via === 'name' || d.via === 'function') {
      if (!doclets.some((o) => o === d) || !d.owner) fail(d, `${d.name} has no @memberof`);
    }
    if (!d.ignore) {
      if (!d.group) fail(d, `${key} names no @group`);
      else if (!groupSlugs.has(d.group)) fail(d, `${key} names unknown @group ${d.group}`);
      if (!resolves(d, surface.Quadrille, surface.fn)) fail(d, `${key} does not exist on the built surface`);
      if (d.page && !/^[a-z0-9_]+(\/[a-z0-9_]+)*$/.test(d.page)) fail(d, `@page ${d.page} is not a docs path`);
    }
    for (const o of d.orphans) warn(d, `dotted @param ${o} has no parent parameter`);

    // Signatures, one per surface. The declared names are the surface's own —
    // `Quadrille.and(q1, q2, row, col)` and `q.and(other, row, col)` are two
    // lists on one doclet — and a doc block that names a parameter the code
    // dropped is the drift this pipeline exists to catch, invisible in the
    // rendered page. A destructured parameter carries its shape in the doc
    // block's dotted params, and a rest parameter absorbs whatever follows it:
    // both are compared as far as the code actually names something.
    for (const on of d.surfaces ?? ['instance']) {
      const declared = (d.surfaceParams?.[on] ?? d.params).map((prm) => prm.name);
      const sig = signatureOf(functionOn(on, d, surface.Quadrille, surface.fn) ?? signatureOf);
      if (!declared.length || !sig || sig.destructured) continue;
      const fixed = sig.rest ? sig.names.slice(0, -1) : sig.names;
      const mine = declared.slice(0, fixed.length);
      const extra = sig.rest ? declared.length >= fixed.length : declared.length === fixed.length;
      if (!extra || (fixed.length && mine.join() !== fixed.join())) {
        warn(d, `${on} @param (${declared.join(', ')}) but the code declares ` +
                `(${sig.names.join(', ')}${sig.rest ? ', …' : ''})`);
      }
    }
    d.examples.forEach((ex, i) => {
      if (!SETUP_RE.test(ex.code)) fail(d, `@example #${i + 1} of ${key} does not define setup()`);
    });
  }

  // Coverage, both directions. A public name with no block is a warning that
  // fails the release, never the build (a rename shows up here first).
  const documented = new Set(doclets.map((d) => (d.owner === 'p5' ? `p5.${d.name}` : `Quadrille.${d.name}`)));
  const ignored = new Set(doclets.filter((d) => d.ignore)
    .map((d) => (d.owner === 'p5' ? `p5.${d.name}` : `Quadrille.${d.name}`)));
  for (const name of publicNames(surface.Quadrille, surface.fn)) {
    if (documented.has(name) || ignored.has(name)) continue;
    // `Quadrille.x` and `Quadrille.prototype.x` are one surface.
    const bare = name.replace('Quadrille.prototype.', 'Quadrille.');
    if (!documented.has(bare) && !ignored.has(bare)) warnings.push(`surface  ${name} is public but has no doc block`);
  }

  return { errors, warnings };
}

// ── Uses ────────────────────────────────────────────────────────────────────

/**
 * The strict half: a name an example provably calls must be documented — by a
 * doclet for this library, by a gloss for p5.js and JavaScript. A used name
 * with neither is a page that promises a reference it does not have, and the
 * build refuses it rather than printing a hollow row.
 * @param {Object} uses from uses.js `siteUses`
 * @param {Object} terms from host-terms.js
 * @param {Map<string, Object>} docletsByName
 */
export function validateUses(uses, terms, docletsByName) {
  const errors = [], warnings = [];
  for (const [key, n] of [...uses.counts].sort((a, b) => b[1] - a[1])) {
    const [tier, name] = [key.slice(0, key.indexOf(':')), key.slice(key.indexOf(':') + 1)];
    if (tier === 'quadrille') {
      if (!docletsByName.has(name)) errors.push(`uses  ${name} is called by ${n} example(s) and has no doc block`);
      continue;
    }
    if (!terms[key]) {
      errors.push(`uses  ${key} is called by ${n} example(s) and has no gloss in tools/docs/host-terms.js`);
    }
  }
  const unused = Object.keys(terms).filter((k) => !uses.counts.has(k));
  if (unused.length) warnings.push(`uses  ${unused.join(' ')} glossed but used by no example`);
  return { errors, warnings };
}

/**
 * Pages against doclets, and the inventory of what the `pages` branch published.
 * @param {Object[]} pages
 * @param {Object} parsed
 * @param {{pages: string[], anchors: string[]}} inventory
 */
export function validatePages(pages, parsed, inventory) {
  const errors = [], warnings = [];
  const fail = (p, msg) => errors.push(`${p.file}  ${msg}`);
  const warn = (p, msg) => warnings.push(`${p.file}  ${msg}`);

  const byName = new Map(parsed.doclets.map((d) => [d.name, d]));
  const byPath = new Map(pages.map((p) => [p.path, p]));
  const titleAt = new Map();

  for (const p of pages) {
    if (!groupSlugs.has(p.group) && !navSlugs.has(p.group)) fail(p, `no such area: ${p.group}`);

    // An unbalanced fence swallows the rest of the page — including the
    // footnotes the renderer appends — so it is an error, never a warning.
    const fences = p.body.split('\n').filter((l) => /^ {0,3}(?:```|~~~)/.test(l)).length;
    if (fences % 2) fail(p, `${fences} code fence(s): one is never closed, and everything after it renders as code`);

    // A shortcode the renderer cannot resolve is a line of literal
    // `{{< … >}}` in the prose, so a typo fails the build rather than shipping.
    for (const { line, text } of shortcodeErrors(p.body)) {
      fail(p, `line ${line}: ${text} is not \`{{< youtube ID "caption" >}}\``);
    }
    if (!Number.isFinite(p.weight) || p.weight <= 0) warn(p, 'no positive weight — sibling order is undefined');

    // One anchor per title among siblings: the parent's child list must not
    // produce the same id twice.
    const key = `${p.parent}\u0000${slug(p.title)}`;
    if (titleAt.has(key)) fail(p, `title anchor ${slug(p.title)} already used by ${titleAt.get(key)}`);
    else titleAt.set(key, p.file);

    if (p.symbol && p.symbol !== 'none') {
      const d = byName.get(p.symbol);
      if (!d) fail(p, `symbol ${p.symbol} has no doc block`);
      else if (d.ignore) fail(p, `symbol ${p.symbol} is @ignore'd in ${d.file}:${d.line}`);
      else if (d.group !== p.group) fail(p, `symbol ${p.symbol} is @group ${d.group}, page is in ${p.group}`);
    } else if (!p.isIndex && p.symbol !== 'none' && symbolOfTitle(p.title) && byName.has(symbolOfTitle(p.title))) {
      // A page whose title names a documented surface but that does not claim
      // it: silent drift, which is what this pipeline exists to catch.
      warn(p, `title names ${symbolOfTitle(p.title)} but the page claims no symbol`);
    }

    // A page that no doclet addresses is fine (a supplement); a doclet whose
    // page is missing is not.
    for (const [, target] of p.body.matchAll(/\]\(\s*([^)\s]+)\s*\)/g)) {
      if (/^(https?:|mailto:|#)/.test(target)) continue;
      const [target0] = target.split('#');
      const path = target0.replace(/^\.\//, '').replace(/\/$/, '').replace(/\/index\.html$/, '');
      const abs = path.startsWith('/') ? path.slice(1) : resolveRel(p, path);
      if (abs === null) continue;
      if (!byPath.has(abs)) fail(p, `link target ${target} is not a page`);
    }
  }

  // Canonical page per doclet: `@page`, else `<group>/<snake(name)>`.
  for (const d of parsed.doclets) {
    if (d.ignore) continue;
    const want = d.page ?? (d.group ? `${d.group}/${snake(d.name)}` : null);
    if (!want) continue;
    const p = byPath.get(want);
    if (!p) fail(d, `${d.owner}.${d.name} renders on ${want}, which is not a page`);
    else if (p.symbol && p.symbol !== d.name) fail(d, `${want} claims ${p.symbol}, not ${d.name}`);
  }

  // Inventory: every path and anchor the `pages` branch published.
  if (inventory) {
    for (const path of inventory.pages ?? []) {
      if (byPath.has(path)) continue;
      warn({ file: 'inventory' }, `published path ${path} has no page — add a redirect`);
    }
    for (const anchor of inventory.anchors ?? []) {
      const [path, id] = anchor.split('#');
      const p = byPath.get(path);
      if (!p) continue;
      if (!pages.some((o) => o.parent === path && slug(o.title) === id)) {
        warn({ file: 'inventory' }, `published anchor ${anchor} is not a child anchor`);
      }
    }
  }

  return { errors, warnings };
}

/** Resolve a relative link from a page's URL directory to a docs-relative path. */
function resolveRel(page, target) {
  const parts = (page.path ? page.path.split('/') : []).concat(target.split('/'));
  const out = [];
  for (const part of parts) {
    if (part === '..') out.pop();
    else if (part && part !== '.') out.push(part);
  }
  return out.join('/');
}
