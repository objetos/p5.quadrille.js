#!/usr/bin/env node
/**
 * @file Symbol → chapter map — `npm run map`.
 * @module tools/docs/map
 * @license GPL-3.0-only
 *
 * The `@gbg` tags in the doc blocks are the record; this prints them as JSON,
 * the shape an index or a tutor wants: `{ "fill": ["mechanics/behave", …] }`.
 * It reads the source, so it needs no checkout of the book and cannot skew
 * from the pages the same blocks render.
 */

import { join, dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

import { paths } from './config.js';
import { parseSources } from './parser.js';

const root = resolve(dirname(fileURLToPath(import.meta.url)), '..', '..');
const { doclets } = parseSources(join(root, paths.src));

const map = {};
for (const d of doclets) {
  if (d.ignore || !d.chapters.length) continue;
  map[d.name] = [...new Set(d.chapters)].sort();
}

const sorted = Object.fromEntries(Object.entries(map).sort(([a], [b]) => a.localeCompare(b)));
console.log(JSON.stringify(sorted, null, 2));

const chapters = new Set(Object.values(sorted).flat());
console.error(`[map] ${Object.keys(sorted).length} surface(s), ${chapters.size} chapter(s)`);
