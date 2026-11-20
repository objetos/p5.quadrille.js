/**
 * @file The API site's declaration — what this site states, and nothing it does.
 * @module tools/docs/docs.config
 * @license GPL-3.0-only
 *
 * `npm run docs` hands this object to `@nakednous/scholion/generator`, which
 * parses, validates, renders and writes the site. Add a field here to say
 * something; add a plugin to do something.
 *
 * Every version below is an exact pin. Advancing one is a deliberate edit
 * here, never an implicit `latest`.
 */

/**
 * p5 — loaded by every example's frame, and the version the peer range names.
 * `script` is the build a page's examples load; the pin is also the version the
 * host name list is generated from.
 */
const p5 = { version: '2.3.2', script: 'lib/p5.min.js' };

/**
 * The p5 addon host: `registerAddon` hands the addon the namespace and the
 * function table the sketch-level functions are installed on. Both are read
 * from the build, so `createQuadrille` and `drawQuadrille` are checked like
 * every other documented name.
 */
const p5AddonHost = {
  RendererGL: class {},
  registerAddon(install) {
    install(this, (this.fn = {}));
  },
};

export default {
  /** Repo-relative paths: the inputs a build reads and the builds it copies. */
  paths: {
    pkg: 'package.json',
    readme: 'README.md',
    readmeAssets: ['p5.quadrille.js.png'],   // the README's own relative image, served beside it
    src: 'src',
    bundle: 'dist/p5.quadrille.js',          // IIFE build of the same commit, read by every example
    static: 'tools/docs/static',             // copied verbatim into the site (assets/, fonts/, media/)
    site: 'site',
    inventory: 'docs/inventory.json',        // every path and anchor the old site published
    redirects: 'docs/redirects.json',        // a historical path → the page that answers it now
  },

  /** What the build writes, as the page names it. */
  outputs: {
    bundle: 'p5.quadrille.js',
    index: 'search.json',
    editor: 'assets',                                // the editor bundle, under its content-hashed name
    notices: 'assets/editor.LICENSES.txt',           // the bundled packages' notices, served beside it
  },

  /**
   * The pages are Markdown files: one page per file at its own address under
   * `docs/`, its front matter binding it to a documented name. The source line
   * the strip prints links into the repository at the same path.
   */
  carrier: {
    pages: {
      kind: 'markdown',
      dir: 'docs',
      source: 'https://github.com/objetos/p5.quadrille.js/blob/main/',
    },
  },

  /**
   * Publicity: a block above an `export`, above a member of the `Quadrille`
   * class, or carrying `@function`/`@constant`/`@typedef`. An `@ignore` block
   * stays out of the site and is exempt from coverage in both directions.
   */
  parse: {
    surface: false,
    members: 'Quadrille',
    ignore: 'keep',
    private: 'skip',
  },

  /**
   * Every example is a complete sketch that calls p5's globals directly: no
   * import, `function setup()` in each.
   */
  examples: { syntax: 'global', global: null, required: false, setup: true },

  /**
   * The build, evaluated once: the IIFE leaves `Quadrille` behind and installs
   * the two sketch-level functions on the host's table.
   */
  surface: { global: ['Quadrille', 'p5'], globals: { p5: p5AddonHost }, check: 'all' },

  /**
   * Where each owner lives in the build: `Quadrille` is the global the IIFE
   * leaves, `p5` is the table `registerAddon` fills on the host.
   */
  owners: {
    Quadrille: ['Quadrille', 'Quadrille.prototype'],   // the class's statics, and the instance methods
    p5:        'p5.fn',                                 // the table registerAddon fills
  },

  /** The owners a page puts first; a bare name several owners share resolves to the first. */
  ownerOrder: ['p5'],

  /** No owner is written as a prefix in a signature: the page's strip carries it. */
  namespaces: [],

  /** The pinned third-party build the examples load. */
  pins: { p5 },

  /**
   * Where a name in prose resolves to. This site's prose links its own pages by
   * hand, so the README and the doc blocks are rendered as written: nothing here
   * rewrites a bare name.
   */
  references: { readme: 'plain', packages: {}, externals: [], aliases: {} },

  /** The deployed address. */
  home: 'https://objetos.github.io/p5.quadrille.js/',

  /** The page's own scripts are ES modules; the shell hands them a JSON config block. */
  mode: 'esm',

  /**
   * One stylesheet, this site's own: the package's base states the shell the
   * module carriers render, and not yet the page carrier's markup — the tree's
   * navigation, the symbol strip, the child anchors, the host tables, the page's
   * foot, the video figure — nor a stage a sketch sizes itself. Taking it would
   * be a package change, not an override, and it waits for the base to carry
   * them.
   */
  shell: {
    // The rail's badge in place of the version line: on every page, and the
    // landing page keeps its space.
    badge: {
      src: 'https://img.shields.io/badge/dynamic/json?url=https://registry.npmjs.org/p5.quadrille&query=$.dist-tags.latest&label=npm&color=007e69',
      href: 'https://www.npmjs.com/package/p5.quadrille',
    },
    stylesheet: 'assets/style.css',
    favicon: [
      { sizes: '32x32', href: 'favicon-32.png' },      // a quadrille: a 3×3 grid, three cells set
      { sizes: '128x128', href: 'favicon-128.png' },
    ],
  },

  /**
   * Every site-local asset URL carries the build stamp: a rebuild has to
   * invalidate what the browser cached, or the new pages run the old client —
   * the sheet, the scripts and the index the page fetches, and the bundle the
   * frames load.
   */
  stamp: true,

  /**
   * The runner's contract: the page's config block, its `{tokens}` resolved by
   * the build — `{root}` (this page's prefix to the site root), `{bundle}`,
   * `{index}`, `{editor}`, `{pin:<name>:<field>}`. `media` names the
   * root-relative prefixes the examples were written with, which the runner
   * rewrites to the site's own; `video` is loaded only where a page carries a
   * video shortcode.
   */
  runner: {
    script: 'assets/runner.js',
    search: 'assets/search.js',
    chrome: 'assets/chrome.js',    // theme picker and collapsible navigation
    video: 'assets/video.js',      // a page that carries a video shortcode only
    config: {
      p5: '{pin:p5:script}',
      lib: '{bundle}?v={stamp}',
      root: '{root}',
      media: ['fonts', 'images', 'paintings', 'videos'],
      index: '{index}?v={stamp}',
      editor: '{editor}',
    },
  },

  /** The teaching structure: the areas the symbol table groups by, and the one area that is not one. */
  groups: [
    { slug: 'p5_functions',      title: 'p5 Functions' },
    { slug: 'iterators',         title: 'Iterators' },
    { slug: 'properties',        title: 'Properties' },
    { slug: 'accessors',         title: 'Accessors' },
    { slug: 'mutators',          title: 'Mutators' },
    { slug: 'algebra',           title: 'Algebra' },
    { slug: 'transforms',        title: 'Transforms' },
    { slug: 'visual_algorithms', title: 'Visual Algorithms' },
    { slug: 'reformatter',       title: 'Reformatter' },
  ],
  areas: [{ slug: 'reference', title: 'Reference' }],

  /** This site's own analysis: the host tables, the per-page block, and its strict gloss gate. */
  plugins: ['host'],
};
