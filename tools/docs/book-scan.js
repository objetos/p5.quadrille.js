#!/usr/bin/env node
/**
 * @file Chapter map drift — `node tools/docs/book-scan.js <book-repo>`.
 * @module tools/docs/book-scan
 * @license GPL-3.0-only
 *
 * The `@gbg` tags say which chapter teaches which surface, and the book changes
 * every term while the library does not. This re-derives the map from the
 * book's own chapters and reports the difference, both ways.
 *
 * Evidence only: `Quadrille.name`, `receiver.name(`, the two addon calls, and
 * a short list of property reads (`board.size`). A bare word is not evidence —
 * `width` is a draw param, `size` a local — and names the book's own provenance
 * tier excludes (`filter`, `sort`, `shift`, `row`, `col`) are never counted.
 *
 *     GBG_BOOK=~/books/gbgs/gbgs.gitlab.io node tools/docs/book-scan.js
 *
 * Exit 1 on drift, so a release run with the book checked out beside the
 * library cannot ship a stale map.
 */

import { readFileSync, readdirSync } from 'node:fs';
import { join } from 'node:path';

import { parseSources } from './parser.js';
import { paths } from './config.js';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = resolve(dirname(fileURLToPath(import.meta.url)), '..', '..');
const book = process.argv[2] ?? process.env.GBG_BOOK;
if (!book) {
  console.error('[scan] no book checkout: pass it as an argument or set GBG_BOOK');
  process.exit(2);
}

/** Never evidence: shared with Array, p5, or a draw param. */
const ambiguous = new Set(['filter', 'sort', 'shift', 'row', 'col', 'width', 'height']);
/** Properties read in member position are evidence; no other object carries them. */
const properties = new Set(['size', 'order', 'span', 'memory2D', 'mouseRow', 'mouseCol']);

const areas = ['mechanics', 'foundations', 'annexes'];

const found = new Map();
for (const area of areas) {
  let files;
  try { files = readdirSync(join(book, 'content', 'docs', area)); } catch (_) { continue; }
  for (const file of files.filter((f) => f.endsWith('.md') && !f.startsWith('_'))) {
    const chapter = `${area}/${file.replace(/\.md$/, '')}`;
    const text = readFileSync(join(book, 'content', 'docs', area, file), 'utf8');
    const code = [...text.matchAll(/```js\n([\s\S]*?)```/g)].map((m) => m[1])
      .concat([...text.matchAll(/\{\{<\s*p5[^>]*>\}\}\n([\s\S]*?)\n\{\{<\s*\/p5\s*>\}\}/g)].map((m) => m[1]))
      .join('\n');
    const seen = new Set();
    for (const m of code.matchAll(/\bQuadrille\.([A-Za-z_$][\w$]*)/g)) seen.add(m[1]);
    for (const m of code.matchAll(/\.([A-Za-z_$][\w$]*)\s*\(/g)) seen.add(m[1]);
    for (const m of code.matchAll(/\.([A-Za-z_$][\w$]*)\b(?!\s*\()/g)) if (properties.has(m[1])) seen.add(m[1]);
    for (const m of code.matchAll(/\b(createQuadrille|drawQuadrille)\s*\(/g)) seen.add(m[1]);
    for (const name of seen) {
      if (ambiguous.has(name)) continue;
      if (!found.has(name)) found.set(name, new Set());
      found.get(name).add(chapter);
    }
  }
}

const { doclets } = parseSources(join(root, paths.src));
const tagged = new Map(doclets.filter((d) => !d.ignore)
  .map((d) => [d.name, new Set(d.chapters)]));

let drift = 0;
const report = (name, msg) => { drift++; console.log(`[drift] ${name.padEnd(20)} ${msg}`); };

for (const [name, chapters] of [...found].sort()) {
  const have = tagged.get(name);
  if (!have) continue;                       // a surface the site does not publish
  const missing = [...chapters].filter((c) => !have.has(c)).sort();
  const stale   = [...have].filter((c) => !chapters.has(c)).sort();
  if (missing.length) report(name, `- @gbg ${missing.join(' @gbg ')}`);
  if (stale.length)   report(name, `+ @gbg ${stale.join(' @gbg ')} (no longer evidenced)`);
}
for (const [name, chapters] of [...tagged].sort()) {
  if (found.has(name) || !chapters.size) continue;
  report(name, `all tagged chapters unevidenced: ${[...chapters].join(' ')}`);
}

console.log(`[scan] ${found.size} surface(s) evidenced in ${areas.join('/')}, ${tagged.size} documented; ` +
            `${drift} drift(s)`);
process.exit(drift ? 1 : 0);
