#!/usr/bin/env node
/**
 * @file Pages migration — the `pages` branch's nine content repositories →
 * `docs/`, once.
 * @module tools/docs/migrate
 * @license GPL-3.0-only
 *
 *     node tools/docs/migrate.js ~/books/gbgs/.import
 *
 * The import directory holds the nine repositories the old site mounted under
 * `content/docs/` — `q_p5fx`, `q_props`, `q_bool`, `q_geom`, `q_immutable`,
 * `q_mutable`, `q_visual`, `q_conversion`, `q_iterators` — checked out at the
 * `pages` branch's last commit. This script converts every Markdown page in
 * them to its own file under `docs/`, at the path the old site served, and
 * writes `docs/inventory.json`: every path the branch published, plus the
 * child anchor each directory page has to answer for. Nothing is published
 * from the branch afterwards; this is the branch's content moving into the
 * repository that owns it.
 *
 * The conversion is mechanical and meant to be read, not trusted:
 *   - `{{< p5 >}}…{{< /p5 >}}` becomes a ```js fence — the sketch the site runs.
 *   - the `details` block that repeated the same sketch is dropped.
 *   - `{{< ref >}}`/`{{< relref >}}` becomes a relative link to the page named,
 *     resolved by basename (all 113 targets are unique in the tree).
 *   - `{{< youtube id >}}` becomes a link.
 *   - `> [!NOTE]` (and WARNING, TIP, IMPORTANT, CAUTION) becomes a bold label
 *     on the blockquote.
 *   - front matter keeps `title` and `weight`; `symbol` is added where the
 *     page documents one surface (`--symbols` prints the map it settled on).
 *
 * Prose is otherwise untouched: every one of these pages was read, run and
 * corrected across releases, and this script has no business rewriting it.
 */

import { existsSync, mkdirSync, readFileSync, readdirSync, writeFileSync } from 'node:fs';
import { basename, dirname, join, relative, resolve } from 'node:path';

import { paths } from './config.js';
import { snake, symbolOfTitle } from './pages.js';

/** The nine content repositories, in the order the old sidebar listed them. */
const repos = {
  q_p5fx:       'p5_functions',
  q_iterators:  'iterators',
  q_props:      'properties',
  q_immutable:  'accessors',
  q_mutable:    'mutators',
  q_bool:       'algebra',
  q_geom:       'transforms',
  q_visual:     'visual_algorithms',
  q_conversion: 'reformatter',
};

/**
 * Pages whose title does not name the surface they document. The draw-param
 * pages document a parameter, not a surface, so they claim none.
 */
const symbols = {
  cell_length:  'cellLength',
  outline:      'outline',
  outline_weight: 'outlineWeight',
  text_color:   'textColor',
  text_zoom:    'textZoom',
  thin_wall:    'thinWall',
  display_fns:  null,
  drawing_arrays: null,
  filter_prop:  null,
  graphics:     null,
  options:      null,
  origin:       null,
  row_col:      null,
  text_font:    null,
  x_y:          null,
};

/** Directory pages that document the one surface their children overload. */
/**
 * Pages that document a *parameter* rather than a surface, and say so: their
 * title names a surface (the draw param `filter` against the `filter` method),
 * so the front matter has to state that the page claims none.
 */
const noSymbol = new Set(['p5_functions/draw_quadrille/filter_prop']);

const folderSymbols = {
  'p5_functions/create_quadrille': 'createQuadrille',
  'p5_functions/draw_quadrille':   'drawQuadrille',
  'mutators/clear':   'clear',
  'mutators/fill':    'fill',
  'mutators/rand':    'rand',
  'mutators/replace': 'replace',
  'mutators/swap':    'swap',
  iterators:          'visit',
};

const KEY_RE = /^([A-Za-z_][\w-]*):\s*(.*)$/;

function frontMatter(text) {
  const m = /^---\r?\n([\s\S]*?)\r?\n---\r?\n?/.exec(text);
  if (!m) return { data: {}, body: text };
  const data = {};
  for (const line of m[1].split('\n')) {
    const kv = KEY_RE.exec(line);
    if (kv) data[kv[1]] = kv[2].trim().replace(/^(['"])(.*)\1$/, '$2');
  }
  return { data, body: text.slice(m[0].length) };
}

function walk(dir) {
  return readdirSync(dir, { withFileTypes: true }).flatMap((e) =>
    e.isDirectory() ? walk(join(dir, e.name)) : [join(dir, e.name)]);
}

// ── The tree of the old site ────────────────────────────────────────────────

function readOldTree(importDir) {
  const pages = [];
  for (const [repo, group] of Object.entries(repos)) {
    for (const file of walk(join(importDir, repo)).filter((f) => f.endsWith('.md'))) {
      const rel = relative(join(importDir, repo), file).replace(/\\/g, '/');
      const isIndex = basename(rel) === '_index.md';
      const sub = isIndex ? rel.replace(/\/?_index\.md$/, '') : rel.replace(/\.md$/, '');
      const path = sub ? `${group}/${sub}` : group;
      const { data, body } = frontMatter(readFileSync(file, 'utf8'));
      pages.push({
        file, repo, group, path, isIndex,
        title: data.title ?? path,
        weight: Number(data.weight ?? 0),
        body,
      });
    }
  }
  // Every page's address, keyed by the name the old links used.
  const byBase = new Map();
  for (const p of pages) {
    const key = p.isIndex ? basename(p.path) : p.path.split('/').pop();
    if (byBase.has(key)) throw new Error(`two pages answer to ${key}`);
    byBase.set(key, p.path);
  }
  return { pages, byBase };
}

// ── Body conversion ─────────────────────────────────────────────────────────

const DETAILS_RE = /{{%\s*details[^%]*%}}[\s\S]*?{{%\s*\/details\s*%}}\n?/g;
const P5_RE = /\{\{<\s*p5[^>]*>\}\}[ \t]*\n([\s\S]*?)\n\{\{<\s*\/p5\s*>\}\}[ \t]*\n?/g;
const REF_RE = /\{\{<\s*(?:rel)?ref\s+"?([^">]+?)"?\s*>\}\}/g;
const YOUTUBE_RE = /{{<\s*youtube\s+([\w-]+)\s*>}}/g;
const ALERT_RE = /^>\s*\[!(NOTE|TIP|IMPORTANT|WARNING|CAUTION)\]\s*$/gm;

/** A path relative to `fromPath`'s URL directory, with the trailing slash. */
function href(fromPath, toPath) {
  const rel = relative(fromPath, toPath).replace(/\\/g, '/') || '.';
  return `${rel}/`;
}

function convert(p, byBase) {
  let body = p.body;
  const fail = (msg) => { throw new Error(`${p.path}: ${msg}`); };

  body = body.replace(DETAILS_RE, '');
  body = body.replace(P5_RE, (_, code) => `\`\`\`js\n${code.replace(/\s+$/, '')}\n\`\`\`\n`);
  // A `ref`/`relref` shortcode is always a link destination, written inside
  // the parentheses — so the URL replaces the shortcode and nothing else.
  body = body.replace(REF_RE, (_, target) => {
    const [name, anchor] = target.split('#');
    const to = byBase.get(name);
    if (!to) fail(`link target ${name} names no page`);
    return `${href(p.path, to)}${anchor ? `#${anchor}` : ''}`;
  });
  body = body.replace(YOUTUBE_RE, (_, id) => `https://www.youtube.com/watch?v=${id}`);
  body = body.replace(ALERT_RE, (_, kind) =>
    `> **${kind[0]}${kind.slice(1).toLowerCase()}**\n>`);
  body = stripHardBreaks(body);
  body = body.replace(/[ \t]+$/gm, '').replace(/\n{3,}/g, '\n\n').replace(/^\n+/, '').replace(/\n+$/, '');
  return `${body}\n`;
}

/**
 * A trailing backslash was a Markdown hard break, and its only reason was the
 * p5 shortcode that followed it. With the sketch a fenced block of its own the
 * break is meaningless and the backslash renders as text.
 */
function stripHardBreaks(text) {
  let fence = false;
  return text.split('\n').map((line) => {
    if (/^ {0,3}(?:```|~~~)/.test(line)) { fence = !fence; return line; }
    if (fence) return line;
    return line.replace(/(?<!\\)[ \t]*\\[ \t]*$/, '');
  }).join('\n');
}

// ── Entry ───────────────────────────────────────────────────────────────────

function main() {
  const importDir = resolve(process.argv[2] ?? '../.import');
  if (!existsSync(importDir)) {
    console.error(`[migrate] no such directory: ${importDir}`);
    process.exit(1);
  }
  if (process.argv.includes('--symbols')) process.argv.push('--print');

  const { pages, byBase } = readOldTree(importDir);
  const docletsByPath = new Map();
  const inventory = { pages: [], anchors: [] };
  const symbolAt = new Map();   // symbol → every page that claims it

  const out = [];
  for (const p of pages) {
    const name = p.path.split('/').pop();
    const claimed = p.isIndex
      ? folderSymbols[p.path] ?? null
      : (name in symbols ? symbols[name] : symbolOfTitle(p.title));
    const page = {
      path: p.path,
      isIndex: p.isIndex,
      symbol: claimed,
      front: [`title: ${JSON.stringify(p.title)}`],
      body: convert(p, byBase),
    };
    if (claimed) {
      if (!symbolAt.has(claimed)) symbolAt.set(claimed, []);
      symbolAt.get(claimed).push(p.path);
    }
    page.front.push(`weight: ${p.weight}`);
    if (claimed) page.front.push(`symbol: ${claimed}`);
    else if (noSymbol.has(p.path)) page.front.push('symbol: none');
    out.push(page);
    inventory.pages.push(p.path);
    docletsByPath.set(p.path, claimed);
  }

  // The child anchor every directory page has to answer for: the one the old
  // site's own hierarchy implied, `#createquadrillewidth-height`.
  for (const child of pages) {
    const parentPath = child.isIndex
      ? (child.path.includes('/') ? dirname(child.path) : '')
      : dirname(child.path);
    if (!parentPath || !inventory.pages.includes(parentPath)) continue;
    const slug = child.title.toLowerCase().replace(/[^\w\- ]+/g, '').replace(/ /g, '-');
    inventory.anchors.push(`${parentPath}#${slug}`);
  }

  // One canonical page per surface: the directory page when several pages
  // document the same surface, else the page itself.
  const canonical = {};
  for (const [symbol, list] of symbolAt) {
    const folder = list.find((path) => list.filter((o) => o.startsWith(`${path}/`)).length > 0);
    if (list.length > 1 && !folder) {
      console.error(`[migrate] ${symbol} has ${list.length} pages and no directory page: ${list.join(', ')}`);
    }
    canonical[symbol] = folder ?? list[0];
  }

  // Write the tree.
  for (const page of out) {
    const file = join(paths.docs, `${page.path}${page.isIndex ? '/_index' : ''}.md`);
    mkdirSync(dirname(file), { recursive: true });
    const front = `---\n${page.front.join('\n')}\n---\n\n`;
    writeFileSync(file, front + page.body);
  }
  writeFileSync(paths.inventory, `${JSON.stringify(inventory, null, 2)}\n`);
  writeFileSync(join(importDir, 'symbols.json'), `${JSON.stringify(canonical, null, 2)}\n`);

  const sketches = out.reduce((n, p) => n + (p.body.match(/```js\n[\s\S]*?function setup\s*\(/g) ?? []).length, 0);
  console.log(`[migrate] ${out.length} page(s), ${sketches} sketch(es), ${inventory.anchors.length} anchor(s) → ${paths.docs}/`);
  if (process.argv.includes('--print')) {
    for (const [symbol, path] of Object.entries(canonical).sort()) console.log(`  ${symbol.padEnd(20)} ${path}`);
  }
  const unclaimed = [...symbolAt].filter(([, list]) => list.length > 1);
  if (unclaimed.length) {
    console.log(`[migrate] surface(s) on several pages: ${unclaimed.map(([s, l]) => `${s} (${l.length})`).join(', ')}`);
  }
}

main();
