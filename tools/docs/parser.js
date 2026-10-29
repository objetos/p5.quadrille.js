/**
 * @file Doc-block parser — src/*.js → module table + doclet table.
 * @module tools/docs/parser
 * @license GPL-3.0-only
 *
 * Public-symbol rule. A doc block is public iff:
 *   - it sits directly above an `export`, or
 *   - it sits above a member of the exported `Quadrille` class (indent two),
 *   - or it carries `@function name` / `@name` (validated to also carry
 *     `@memberof`), `@constant {T} NAME`, or `@typedef {T} Name`.
 * Every other block is internal and ignored. `@memberof` defaults to the
 * module; a class member's owner is `Quadrille`.
 *
 * Tags this pipeline adds to the shared vocabulary, all of them this site's
 * own and none of them rendered:
 *   - `@group <area>` — the teaching area (tools/docs/config.js `groups`). It
 *     names the navigation section and, with `@page`, the surface's address.
 *   - `@page <path>` — the page the surface renders on, relative to `docs/`
 *     and without its `.md`: `accessors/instance_creators/ring`. Absent, the
 *     page is `<group>/<snake_case(name)>`.
 *   - `@ignore` — deliberately absent from the site (a seam, or a surface
 *     whose page does not exist yet). Documented in source, skipped by the
 *     renderer, and exempt from the coverage check in both directions.
 *
 * Accessor pairs. A getter and its setter are one surface: the two blocks
 * merge into a single doclet carrying both descriptions, the getter's
 * `@returns` and the setter's `@param`.
 */

import { readdirSync, readFileSync } from 'node:fs';
import { join } from 'node:path';
import { parse } from 'comment-parser';

const EXPORT_RE = /^export\s+(?:default\s+)?(?:async\s+)?(function|class|const|let|var)\*?\s+([A-Za-z_$][\w$]*)/;
const MEMBER_RE = /^(static\s+)?(get\s+|set\s+)?(async\s+)?\*?\s*([A-Za-z_$][\w$]*)\s*[=(]/;

// ── Token reconstruction ────────────────────────────────────────────────────
// comment-parser tokenizes every tag line into name / type / description, so a
// tag whose payload is free text (@returns, @file, @detail) loses its first
// word into `name`. Rebuild from the raw tokens instead. With
// `spacing: 'preserve'` a continuation line's indentation lives in
// `postDelimiter` (one space past the `*` is the standard gutter).

/** Text after `@tag` (and after `{type}` on the first line), all lines. */
function tail(tag) {
  return tag.source.map((s, i) => {
    const k = s.tokens;
    if (i === 0) return k.name + k.postName + k.description;
    return k.postDelimiter.slice(1) + k.tag + k.postTag + k.name + k.postName +
           k.type + k.postType + k.description;
  }).join('\n').replace(/\s+$/, '');
}

/** Continuation lines only (everything after the tag's own line). */
function continuation(tag) {
  return tag.source.slice(1).map((s) => {
    const k = s.tokens;
    return k.postDelimiter.slice(1) + k.tag + k.postTag + k.name + k.postName +
           k.type + k.postType + k.description;
  }).join('\n').replace(/^\n+|\s+$/g, '');
}

/** Drop the blank lines an example carries at either end. */
function trimBlank(code) {
  const lines = code.split('\n');
  while (lines.length && !lines[0].trim()) lines.shift();
  while (lines.length && !lines[lines.length - 1].trim()) lines.pop();
  return lines.join('\n');
}

const CAPTION_RE = /^<caption>([\s\S]*?)<\/caption>\s*$/;

/**
 * An @example: optional `<caption>` as its first line (on the tag line or
 * the line after), code on the rest.
 */
function exampleOf(tag) {
  const k     = tag.source[0].tokens;
  const head  = (k.name + k.postName + k.type + k.postType + k.description).trim();
  const lines = (head ? [head] : []).concat(continuation(tag).split('\n'));
  const cap   = CAPTION_RE.exec(lines[0].trim());
  return {
    caption: cap ? cap[1].trim() : null,
    code:    trimBlank((cap ? lines.slice(1) : lines).join('\n')),
  };
}

/** A @param / @property row. */
function fieldOf(tag) {
  return {
    name:        tag.name,
    type:        tag.type,
    optional:    tag.optional,
    default:     tag.default ?? null,
    description: tag.description.trim(),
    children:    [],
  };
}

/**
 * Nest dotted names under their parent (`params.display` under `params`).
 * @returns {{ roots: Object[], orphans: string[] }}
 */
function groupDotted(rows) {
  const roots = [], byName = new Map(), orphans = [];
  for (const r of rows) {
    const dot = r.name.lastIndexOf('.');
    const parent = dot > 0 ? byName.get(r.name.slice(0, dot)) : null;
    if (dot > 0 && !parent) orphans.push(r.name);
    (parent ? parent.children : roots).push(r);
    byName.set(r.name, r);
  }
  return { roots, orphans };
}

/** First non-blank line at or after `from`, with its index. */
function nextCodeLine(lines, from) {
  for (let i = from; i < lines.length; i++) {
    const t = lines[i].trim();
    if (t && !t.startsWith('//') && !t.startsWith('/*') && !t.startsWith('*')) {
      return { index: i, text: lines[i] };
    }
  }
  return null;
}

/** The `[from, to]` line range of the top-level `class <name> { … }`, 0-based. */
function classRange(lines, name) {
  const start = lines.findIndex((l) => new RegExp(`^class\\s+${name}\\b`).test(l));
  if (start < 0) return null;
  for (let i = start + 1; i < lines.length; i++) if (/^}/.test(lines[i])) return [start, i];
  return null;
}

// ── Per-file parse ──────────────────────────────────────────────────────────

function parseFile(srcDir, file) {
  const text   = readFileSync(join(srcDir, file), 'utf8');
  const lines  = text.split('\n');
  const range  = classRange(lines, 'Quadrille');
  const result = { file, module: null, blocks: [], doclets: [] };

  for (const b of parse(text, { spacing: 'preserve' })) {
    const line  = b.source[0].number + 1;                     // 1-based
    const last  = b.source[b.source.length - 1].number;       // 0-based, inclusive
    const next  = nextCodeLine(lines, last + 1);
    const tagOf = (n) => b.tags.find((t) => t.tag === n) ?? null;
    const all   = (n) => b.tags.filter((t) => t.tag === n);

    const block = {
      file, line,
      tags:   b.tags.map((t) => t.tag),
      public: false,
      doclet: null,
    };
    result.blocks.push(block);

    // Module header — @file / @module / @license.
    const moduleTag = tagOf('module');
    if (moduleTag || tagOf('file')) {
      const desc = tagOf('description');
      block.module = {
        name:        moduleTag?.name ?? file.replace(/\.js$/, ''),
        file,
        line,
        title:       tagOf('file') ? tail(tagOf('file')).trim() : '',
        license:     tagOf('license')?.name ?? '',
        description: desc ? tail(desc).trim() : b.description.trim(),
      };
      if (!result.module) result.module = block.module;
      continue;
    }

    // Public? — an explicit name tag wins over inference.
    const nameTag = tagOf('name');
    const fnTag   = tagOf('function'), constTag = tagOf('constant'), tdTag = tagOf('typedef');
    const exp     = next ? EXPORT_RE.exec(next.text.trim()) : null;
    const member  = next && /^  \S/.test(next.text) && range &&
                    next.index > range[0] && next.index < range[1]
      ? MEMBER_RE.exec(next.text.trim()) : null;

    let via = null, name = null, kind = null, staticMember = false, accessor = null;
    if (nameTag)          { via = 'name';     name = nameTag.name; }
    else if (fnTag)       { via = 'function'; name = fnTag.name; }
    else if (constTag)    { via = 'constant'; name = constTag.name; }
    else if (tdTag)       { via = 'typedef';  name = tdTag.name; }
    else if (member)      {
      via = 'member'; name = member[4];
      staticMember = !!member[1];
      accessor = (member[2] ?? '').trim() || null;
    }
    else if (exp)         { via = 'export';  name = exp[2]; }
    if (!name) continue;

    const params = groupDotted(all('param').map(fieldOf));
    const props  = groupDotted(all('property').map(fieldOf));
    const ret    = tagOf('returns');
    const typeTag = tagOf('type');

    block.public = true;
    block.doclet = {
      kind:          via === 'member' ? (accessor ? `accessor:${accessor}` : staticMember ? 'static' : 'method')
                    : via === 'function' || via === 'export' ? 'function'
                    : via === 'name' ? 'function' : via,
      via,
      name,
      owner:         tagOf('memberof')?.name ?? (via === 'member' ? 'Quadrille' : null),
      module:        null,
      file, line,
      description:   b.description.trim() + (b.description.trim() ? '' : ''),
      detail:        tagOf('details') ? tail(tagOf('details')).trim() : '',
      params:        params.roots,
      properties:    props.roots,
      orphans:       [...params.orphans, ...props.orphans],
      returns:       ret ? { type: ret.type, description: tail(ret).trim() } : null,
      examples:      all('example').map(exampleOf),
      type:          typeTag?.type ?? constTag?.type ?? tdTag?.type ?? null,
      group:         tagOf('group')?.name ?? null,
      page:          tagOf('page') ? tail(tagOf('page')).trim() : null,
      ignore:        !!tagOf('ignore'),
      static:        staticMember,
      surfaces:      [via === 'member' ? (staticMember ? 'static' : 'instance') : 'namespace'],
      sigs:          [],
      explicitName:  fnTag?.name ?? nameTag?.name ?? null,
      exportName:    exp ? exp[2] : null,
    };
    result.doclets.push(block.doclet);
  }

  // ── One surface per name ──────────────────────────────────────────────────
  // A private member is not public surface, and neither is the constructor:
  // sketches construct through `p5.createQuadrille`. Both keep their blocks in
  // source and never reach the site.
  result.doclets = result.doclets.filter((d) => {
    if (d.name === 'constructor' || d.name.startsWith('_')) return false;
    return true;
  });

  // Accessor pairs are one surface: merge the setter block into the getter's.
  for (const d of result.doclets) {
    if (d.kind !== 'accessor:set') continue;
    const getter = result.doclets.find((o) => o !== d && o.name === d.name &&
      o.owner === d.owner && o.kind === 'accessor:get');
    if (!getter) { d.kind = 'accessor'; continue; }
    getter.description = [getter.description, d.description].filter(Boolean).join('\n\n');
    getter.params.push(...d.params);
    getter.params.push(...d.properties);
    getter.examples.push(...d.examples);
    getter.kind = 'accessor';
    getter.surfaces = [d.static ? 'static' : 'instance'];
    d.mergedInto = getter.name;
    d.kind = 'accessor:merged';
  }
  result.doclets = result.doclets.filter((d) => d.kind !== 'accessor:merged');
  for (const d of result.doclets) if (d.kind === 'accessor:get') d.kind = 'accessor';

  // A static helper and the instance method that delegates to it are one page:
  // `Quadrille.isFilled(value)` and `q.isFilled(row, col)`. Merge them, keeping
  // both signatures and both descriptions.
  const merged = [];
  for (const d of result.doclets) {
    const other = result.doclets.find((o) => o !== d && o.name === d.name &&
      o.owner === d.owner && o.kind !== d.kind && !o.mergedInto && o !== d);
    if (!other) { merged.push(d); continue; }
    if (d.mergedInto || other.mergedInto) continue;
    const [first, second] = d.surfaces[0] === 'static' ? [d, other] : [other, d];
    first.description = first.description === second.description ? first.description
      : [first.description, second.description].filter(Boolean).join('\n\n');
    first.surfaces = ['static', 'instance'];
    first.kind = 'surface';
    first.params = first.params.length ? first.params : second.params;
    first.returns ??= second.returns;
    second.mergedInto = first.name;
    merged.push(first);
  }
  result.doclets = merged;
  return result;
}

// ── Entry ───────────────────────────────────────────────────────────────────

/**
 * Parse every `*.js` under `srcDir`.
 * @param {string} srcDir
 * @returns {{ modules: Object[], doclets: Object[], blocks: Object[] }}
 */
export function parseSources(srcDir) {
  const files   = readdirSync(srcDir).filter((f) => f.endsWith('.js')).sort();
  const modules = [], doclets = [], blocks = [];

  for (const file of files) {
    const r = parseFile(srcDir, file);
    if (r.module) modules.push(r.module);
    blocks.push(...r.blocks);
    for (const d of r.doclets) {
      d.module = r.module?.name ?? null;
      d.owner ??= d.module;
      doclets.push(d);
    }
  }
  return { modules, doclets, blocks };
}
