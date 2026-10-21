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
import { dirname, join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

import { paths, site, media } from './config.js';
import { parseSources } from './parser.js';
import { loadPages } from './pages.js';
import { bundleSurface, validateSources, validatePages } from './validator.js';
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

  // Validate — errors fail the build, warnings print.
  const a = validateSources(parsed, surface);
  const b = validatePages(pages, parsed, inventory);
  const errors = [...a.errors, ...b.errors];
  const warnings = [...a.warnings, ...b.warnings];
  for (const w of warnings) console.warn(`[docs] warn  ${w}`);
  for (const e of errors)   console.error(`[docs] error ${e}`);
  if (errors.length) {
    console.error(`[docs] ${errors.length} error(s) — site not written.`);
    process.exit(1);
  }

  // Render.
  const files = render(pages, parsed, {
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
  console.log(`[docs] ${files.size} page(s), ${pages.length} docs/ page(s), ${parsed.doclets.length} doclet(s), ` +
              `${sketches} sketch(es), ${warnings.length} warning(s) → ${paths.site}/`);
}

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
      if (!files.has(`${entry.h}index.html`)) problems.push(`search.json  ${entry.t} → ${entry.h} is not a page`);
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
      const [pathPart] = target.split('#');
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
