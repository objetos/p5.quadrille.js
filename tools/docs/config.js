/**
 * @file Docs generator configuration — pins, the teaching areas, and repo paths.
 * @module tools/docs/config
 * @license GPL-3.0-only
 *
 * Every version below is an exact pin. Advancing one is a deliberate edit
 * here, never an implicit `latest`.
 */

const CDN = 'https://cdn.jsdelivr.net/npm';

/**
 * p5 — loaded by every example iframe, and the version the peer range names.
 */
export const p5 = { version: '2.3.2' };
p5.url = `${CDN}/p5@${p5.version}/lib/p5.min.js`;
p5.reference = 'https://p5js.org/reference/';

/**
 * The p5 reference page of a `p5.`-prefixed name: `p5.createCanvas` →
 * reference/p5/createCanvas/, `p5.WEBGL` → reference/p5/WEBGL/, a class
 * `p5.Vector` → reference/p5/p5.Vector/. Null for anything else.
 */
export function p5RefUrl(name) {
  const m = /^p5\.(?:([A-Z][\w$]*)\.)?([\w$]+)$/.exec(name);
  if (!m) return null;
  const isClass = !m[1] && /^[A-Z][a-z]/.test(m[2]);
  return `${p5.reference}${m[1] ? 'p5.' + m[1] : 'p5'}/${isClass ? 'p5.' : ''}${m[2]}/`;
}

/** The text a `p5.`-prefixed link shows: the name without the prefix (`createCanvas`). */
export const p5RefText = (name) => name.replace(/^p5\./, '');

/**
 * The teaching areas, in navigation order — the old site's own order, so a
 * reader's habit and a URL keep matching. Each is a directory under `docs/`;
 * a surface renders on the page its `@page` names, or on
 * `<group>/<snake_case(name)>` when it names none.
 */
export const groups = [
  { slug: 'p5_functions',      title: 'p5 Functions' },
  { slug: 'iterators',         title: 'Iterators' },
  { slug: 'properties',        title: 'Properties' },
  { slug: 'accessors',         title: 'Accessors' },
  { slug: 'mutators',          title: 'Mutators' },
  { slug: 'algebra',           title: 'Algebra' },
  { slug: 'transforms',        title: 'Transforms' },
  { slug: 'visual_algorithms', title: 'Visual Algorithms' },
  { slug: 'reformatter',       title: 'Reformatter' },
];

/** The group slugs, for the validator. */
export const groupSlugs = new Set(groups.map((g) => g.slug));

/**
 * Navigation areas that are not teaching areas: the pages that describe the
 * surface the examples *call* rather than the surface this library defines.
 * They are pages like any other; they simply document other people's APIs.
 */
export const navAreas = [{ slug: 'reference', title: 'Reference' }];
export const navSlugs = new Set(navAreas.map((n) => n.slug));

/** The generated p5.js name list, for the tier rules. */
export const p5globals = 'tools/docs/data/p5-globals.json';

/**
 * CodeMirror 5 UMD — the example editor.
 */
export const codemirror = { version: '5.65.21' };
codemirror.css = `${CDN}/codemirror@${codemirror.version}/lib/codemirror.min.css`;
codemirror.js  = [
  `${CDN}/codemirror@${codemirror.version}/lib/codemirror.min.js`,
  `${CDN}/codemirror@${codemirror.version}/mode/javascript/javascript.min.js`,
];

/** Repo-relative paths (resolved against the package root by index.js). */
export const paths = {
  src:       'src',
  pkg:       'package.json',
  readme:    'README.md',
  docs:      'docs',                    // the pages: one Markdown file per page
  inventory: 'docs/inventory.json',     // every path and anchor the `pages` branch published
  redirects: 'docs/redirects.json',     // historical path → the page that answers it now
  bundle:    'dist/p5.quadrille.js',    // IIFE build of the same commit
  static:    'tools/docs/static',       // copied verbatim into site/ (assets/, fonts/, media/)
  site:      'site',
};

/** Site-local URLs the pages hand to the runner. */
export const site = {
  bundle: 'p5.quadrille.js',
  style:  'assets/style.css',
  runner: 'assets/runner.js',
  search: 'assets/search.js',
  video:  'assets/video.js',      // a page that carries a video shortcode only
  index:  'search.json',
};

/**
 * Root-relative prefixes the examples use for their media — `/paintings/p7.jpg`,
 * `/fonts/noto_sans.ttf` — and the directories the build copies them from, under
 * `paths.static`. The examples keep the paths the `pages` branch published; the
 * runner prefixes them with the site's base at run time (see static/assets/runner.js).
 */
export const media = ['fonts', 'images', 'paintings', 'videos'];   // no trailing slash
