#!/usr/bin/env node
/**
 * @file Docs generator entry — `npm run docs`: docs/ + src/ → site/.
 * @module tools/docs
 * @license GPL-3.0-only
 *
 * Pipeline: parse the doc blocks → load the pages → validate both against the
 * built bundle (errors fail the build, warnings print) → render → write
 * `site/` beside the IIFE bundle of the same commit, the static chrome
 * (assets/, fonts/, media/) and the redirect stubs. Run `npm run build` first.
 */

import {
  copyFileSync, cpSync, existsSync, mkdirSync, readFileSync, rmSync, writeFileSync,
} from 'node:fs';
import { createHash } from 'node:crypto';
import { readdirSync } from 'node:fs';
import { dirname, join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

import { paths, site, media, groups, p5globals } from './config.js';
import { parseSources } from './parser.js';
import { loadPages, snake } from './pages.js';
import { bundleSurface, validateSources, validatePages, validateUses } from './validator.js';
import { siteUses } from './uses.js';
import { areas, sections, terms, termHref, rules } from './host-terms.js';
import { render } from './renderer.js';

const root = resolve(dirname(fileURLToPath(import.meta.url)), '..', '..');
const at   = (p) => join(root, p);
const read = (p) => (existsSync(at(p)) ? readFileSync(at(p), 'utf8') : null);

function main() {
  const pkg    = JSON.parse(readFileSync(at(paths.pkg), 'utf8'));
  const readme = readFileSync(at(paths.readme), 'utf8');
  if (!existsSync(at(paths.bundle))) {
    console.error(`[docs] ${paths.bundle} not found — run \`npm run build\` first.`);
    process.exit(1);
  }

  // Parse and load.
  const parsed    = parseSources(at(paths.src));
  const pages     = loadPages(at(paths.docs));
  const surface   = bundleSurface(at(paths.bundle));
  const inventory = read(paths.inventory) ? JSON.parse(read(paths.inventory)) : null;
  const redirects = read(paths.redirects) ? JSON.parse(read(paths.redirects)) : null;

  // What the examples call, resolved to the three tiers the site documents.
  const globals = JSON.parse(readFileSync(at(p5globals), 'utf8'));
  const docletsByName = new Map(parsed.doclets.map((d) => [d.name, d]));
  const uses = siteUses(pages, {
    doclets: new Set(parsed.doclets.filter((d) => !d.ignore).map((d) => d.name)),
    globals, rules,
  });

  // Validate — errors fail the build, warnings print.
  const a = validateSources(parsed, surface);
  const b = validatePages(pages, parsed, inventory);
  const c = validateUses(uses, terms, docletsByName);
  const errors = [...a.errors, ...b.errors, ...c.errors];
  const warnings = [...a.warnings, ...b.warnings, ...c.warnings];
  for (const w of warnings) console.warn(`[docs] warn  ${w}`);
  for (const e of errors)   console.error(`[docs] error ${e}`);
  if (errors.length) {
    console.error(`[docs] ${errors.length} error(s) — site not written.`);
    process.exit(1);
  }

  // A build stamp over everything that ships: the bundle, the static chrome and
  // the pages. The site's own assets are cached by the browser and a `<script
  // src>` has no notion of a rebuild — the old Hugo site lost a day to exactly
  // this on iframe subresources — so every site-local asset URL carries it.
  const stamp = buildStamp(pages, at(paths.bundle), at(paths.static));

  // Render.
  const files = render(pages, parsed, {
    stamp, uses, terms, areas, sections, termHref, groups, docletsByName,
    pkg, readme, inventory, redirects,
    media,
    // `git+https://…` is a package-manager form a browser cannot open.
    source: `${pkg.repository.url.replace(/^git\+/, '').replace(/\.git$/, '')}/blob/main/`,
  });

  // Write site/ from scratch.
  const out = at(paths.site);
  rmSync(out, { recursive: true, force: true });
  mkdirSync(out, { recursive: true });
  for (const [file, html] of files) {
    mkdirSync(dirname(join(out, file)), { recursive: true });
    writeFileSync(join(out, file), html);
  }

  copyFileSync(at(paths.bundle), join(out, site.bundle));
  for (const asset of ['p5.quadrille.js.png']) {
    if (existsSync(at(asset))) copyFileSync(at(asset), join(out, asset));
  }
  if (existsSync(at(paths.static))) cpSync(at(paths.static), out, { recursive: true });

  // Every link the site emits, resolved on disk. A page nested four levels
  // down that links to a sibling with a site-root path reads correctly to the
  // generator and 404s in the browser, so this is checked against the files
  // rather than against the tables that produced them.
  const broken = [...linkCheck(out, files), ...indexCheck(files)];
  for (const e of broken) console.error(`[docs] error ${e}`);
  if (broken.length) {
    console.error(`[docs] ${broken.length} broken link(s) — site written but not shippable.`);
    process.exit(1);
  }

  const sketches = pages.reduce((n, p) => n + (p.body.match(/```js[\s\S]*?function setup\s*\(/g) ?? []).length, 0);
  const unclaimed = [...uses.unclaimed].sort((a, b) => b[1] - a[1]).slice(0, 8);
  console.log(`[docs] ${files.size} page(s), ${pages.length} docs/ page(s), ${parsed.doclets.length} doclet(s), ` +
              `${sketches} sketch(es), ${uses.counts.size} name(s) used by the examples, ` +
              `${warnings.length} warning(s) → ${paths.site}/`);
  if (unclaimed.length) {
    console.log(`[docs] note  ${uses.unclaimed.size} name(s) in fences belong to no tier ` +
                `(locals, or members of an unknown receiver): ` +
                `${unclaimed.map(([n, c]) => `${n}(${c})`).join(' ')}`);
  }
}

/**
 * A short hash of everything the build ships. Reads every file under `static`
 * (the media included, which is why it is a hash of sizes and names rather than
 * of the whole tree's bytes) plus the bundle and the pages' own text.
 * @param {Object[]} pages
 * @param {string} bundlePath
 * @param {string} staticDir
 * @returns {string} 8 hex characters
 */
function buildStamp(pages, bundlePath, staticDir) {
  const hash = createHash('sha1').update(readFileSync(bundlePath));
  const walk = (dir) => readdirSync(dir, { withFileTypes: true }).flatMap((e) =>
    e.isDirectory() ? walk(join(dir, e.name)) : [join(dir, e.name)]);
  for (const file of walk(staticDir).sort()) {
    hash.update(file);
    hash.update(String(statSyncOrZero(file)));
    if (/\.(css|js|json)$/.test(file)) hash.update(readFileSync(file));
  }
  for (const page of pages) hash.update(page.file).update(page.body);
  return hash.digest('hex').slice(0, 8);
}

const statSyncOrZero = (file) => { try { return readFileSync(file).length; } catch (_) { return 0; } };

/**
 * The search index's hrefs are site-root-relative and are never in the HTML, so
 * the link check cannot see them: every entry must name a page the build wrote.
 * @param {Map<string, string>} files
 * @returns {string[]}
 */
function indexCheck(files) {
  const problems = [];
  for (const [file, body] of files) {
    if (!file.endsWith('search.json')) continue;
    for (const entry of JSON.parse(body)) {
      const [page] = entry.h.split('#');
      if (!files.has(`${page}index.html`)) problems.push(`search.json  ${entry.t} → ${entry.h} is not a page`);
    }
  }
  return problems;
}

/**
 * Resolve every `href`/`src` the site emits, relative to the file that carries
 * it. Directory URLs resolve to their `index.html`; fragments and absolute
 * URLs are not this check's business.
 * @param {string} out absolute path of the written site
 * @param {Map<string, string>} files site-relative file → HTML
 * @returns {string[]} one line per broken reference
 */
function linkCheck(out, files) {
  const seen = new Set();
  const problems = [];
  for (const [file, html] of files) {
    for (const m of html.matchAll(/(?:href|src)="([^"]+)"/g)) {
      const target = m[1].replace(/&amp;/g, '&');
      if (/^(?:[a-z]+:|\/\/|#|data:|mailto:)/i.test(target)) continue;
      // `?v=<stamp>` is the cache-buster, not part of the path.
      const [pathPart] = target.split('#')[0].split('?');
      if (!pathPart) continue;
      const resolved = resolve(dirname(join(out, file)), pathPart);
      const fileTarget = pathPart.endsWith('/') || !/\.[a-z0-9]+$/i.test(pathPart)
        ? join(resolved, 'index.html') : resolved;
      if (existsSync(fileTarget)) continue;
      const key = `${file} → ${target}`;
      if (seen.has(key)) continue;
      seen.add(key);
      problems.push(`${file} links to ${target}, which is not there`);
    }
  }
  return problems;
}

main();
