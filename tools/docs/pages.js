/**
 * @file Pages loader — docs/**\/*.md → the page table the site is built from.
 * @module tools/docs/pages
 * @license GPL-3.0-only
 *
 * A page is a Markdown file under `docs/`. Its address is its path without
 * `.md`: `docs/mutators/fill/fill_value.md` → `mutators/fill/fill_value`, which
 * the renderer writes at `docs/mutators/fill/fill_value/index.html` so the URL
 * the old site published stays the URL this site serves. `_index.md` is its
 * directory's page.
 *
 * Front matter:
 *   title:  "fill(row, col, value)"   the page's title; also its anchor on the
 *                                     parent page, slugged the way Hugo did
 *   weight: 7                         order among siblings
 *   symbol: fill                      the surface this page documents, if any.
 *                                     Absent → a supplement page (a draw param,
 *                                     a listing, a walkthrough).
 *
 * The body is Markdown. A ```js fence that defines `setup()` is a sketch and
 * runs in the example runner; any other fence is a listing and renders as
 * code. Hugo shortcodes the nine content repositories used are resolved by the
 * renderer, which also checks that each target is a page that exists.
 */

import { readdirSync, readFileSync } from 'node:fs';
import { basename, join, relative } from 'node:path';

const KEY_RE = /^([A-Za-z_][\w-]*):\s*(.*)$/;

/** The front matter's flat `key: value` pairs, quotes stripped. */
function frontMatter(text) {
  const m = /^---\r?\n([\s\S]*?)\r?\n---\r?\n?/.exec(text);
  if (!m) return { data: {}, body: text };
  const data = {};
  for (const line of m[1].split('\n')) {
    const kv = KEY_RE.exec(line);
    if (!kv) continue;
    data[kv[1]] = kv[2].trim().replace(/^(['"])(.*)\1$/, '$2');
  }
  return { data, body: text.slice(m[0].length) };
}

/** `createQuadrille(width, height)` → `createQuadrille`; null when not a bare name. */
export function symbolOfTitle(title) {
  if (!title) return null;
  const head = title.split('(')[0].replace(/^Quadrille\./, '').trim();
  return /^[A-Za-z_$][\w$]*$/.test(head) ? head : null;
}

/** `memory2D` → `memory_2d`: the slug the old site's paths used. */
export const snake = (name) => name
  .replace(/([a-z0-9])([A-Z])/g, '$1_$2')
  .replace(/([A-Z]+)([A-Z][a-z])/g, '$1_$2')
  .toLowerCase();

/** The Hugo anchor a heading of this title produced: `createquadrillewidth-height`. */
export const slug = (title) => String(title).toLowerCase()
  .replace(/[^\w\- ]+/g, '').replace(/ /g, '-');

function walk(dir) {
  return readdirSync(dir, { withFileTypes: true }).flatMap((e) =>
    e.isDirectory() ? walk(join(dir, e.name)) : [join(dir, e.name)]);
}

/**
 * @param {string} docsDir
 * @returns {Object[]} pages, parents before their children
 */
export function loadPages(docsDir) {
  const pages = [];
  for (const file of walk(docsDir).filter((f) => f.endsWith('.md')).sort()) {
    const rel  = relative(docsDir, file).replace(/\\/g, '/');
    const dir  = rel.includes('/') ? rel.slice(0, rel.lastIndexOf('/')) : '';
    const isIndex = basename(rel) === '_index.md';
    const path = isIndex ? dir : rel.replace(/\.md$/, '');
    const { data, body } = frontMatter(readFileSync(file, 'utf8'));
    pages.push({
      file: rel,
      path,
      dir,
      isIndex,
      group: path.split('/')[0],
      parent: isIndex ? (dir.includes('/') ? dir.slice(0, dir.lastIndexOf('/')) : '') : dir,
      title: data.title ?? path.split('/').pop(),
      weight: Number(data.weight ?? 0),
      symbol: data.symbol ?? null,
      body,
    });
  }
  return pages;
}
