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
    source: `${pkg.repository.url.replace(/\.git$/, '')}/blob/main/`,
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

  const sketches = pages.reduce((n, p) => n + (p.body.match(/```js[\s\S]*?function setup\s*\(/g) ?? []).length, 0);
  console.log(`[docs] ${files.size} page(s), ${pages.length} docs/ page(s), ${parsed.doclets.length} doclet(s), ` +
              `${sketches} sketch(es), ${warnings.length} warning(s) → ${paths.site}/`);
}

main();
