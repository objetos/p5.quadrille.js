/**
 * @file Renderer — pages + doclets → static HTML.
 * @module tools/docs/renderer
 * @license GPL-3.0-only
 *
 * One page per Markdown file under `docs/`, written at
 * `docs/<path>/index.html` so the URL the old site published is the URL this
 * site serves. Every link the chrome makes is relative, so the site serves
 * unchanged under the `/p5.quadrille.js/` base path.
 *
 * What a page shows, in order: its title, the source-backed signature strip
 * when it documents a surface (`@page` says which page that is), its Markdown,
 * its children, and the previous/next pages. A ```js fence that defines
 * `setup()` runs in the example runner; any other fence is a listing.
 */

import { Marked } from 'marked';

import { p5, codemirror, site } from './config.js';
import { slug, snake } from './pages.js';

const SETUP_RE = /(^|[^\w$])(?:async\s+)?function\s+setup\s*\(/;

const esc = (s) => String(s).replace(/[&<>"']/g, (c) => (
  { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]
));

/** Sketches lifted out of the page being parsed: id → figure HTML. */
const lifted = new Map();

const marked = new Marked({
  gfm: true,
  renderer: {
    // Hugo's anchors, so a link written against the old site still lands.
    heading({ tokens, depth }) {
      const html = this.parser.parseInline(tokens);
      const text = this.parser.parseInline(tokens, this.parser.textRenderer);
      return `<h${depth} id="${slug(text)}">${html}</h${depth}>\n`;
    },
    // A fence that defines `setup()` is a sketch; anything else is a listing.
    code({ text, lang }) {
      if (lang?.startsWith('js') && SETUP_RE.test(text)) {
        const id = `sketch-${lifted.size}`;
        lifted.set(id, example(text, id));
        return `<p>@@${id}@@</p>\n`;
      }
      return `<pre><code class="lang-${esc(lang ?? '')}">${esc(text)}</code></pre>\n`;
    },
  },
});

// ── Addresses ───────────────────────────────────────────────────────────────

/** The site-relative URL of a docs page: `mutators/fill` → `docs/mutators/fill/`. */
const urlOf = (path) => `docs/${path}/`;

/** How many levels up a page sits from the site root (`docs/<path>/index.html`). */
const depthOf = (path) => (path ? path.split('/').length + 1 : 0);

/** A site-relative URL as seen from a page. */
const from = (page, url) => `${'../'.repeat(depthOf(page.path))}${url}`;

// ── The signature strip ─────────────────────────────────────────────────────

/** `(...)` from a doclet's params, variadics and optionals marked. */
function paramsOf(d) {
  return `(${d.params.map((prm) => {
    const name = prm.type?.startsWith('...') ? `...${prm.name}` : prm.name;
    return prm.optional ? `[${name}]` : name;
  }).join(', ')})`;
}

const type = (t) => (t ? `<code class="type">${esc(t)}</code>` : '');

/** One line per surface the doclet documents. */
function signatures(d) {
  const owner = d.owner === 'p5' ? 'p5' : 'Quadrille';
  const lines = [];
  for (const surface of d.surfaces ?? ['instance']) {
    if (surface === 'static') lines.push(`${owner}.${esc(d.name)}${d.kind === 'accessor' ? '' : esc(paramsOf(d))}`);
    else if (surface === 'instance') lines.push(`q.${esc(d.name)}${d.kind === 'accessor' ? '' : esc(paramsOf(d))}`);
    else if (surface === 'namespace') lines.push(`${owner}.${esc(d.name)}${esc(paramsOf(d))}`);
  }
  return lines.length ? lines : [`${owner}.${esc(d.name)}`];
}

function fieldRows(rows, depth = 0) {
  return rows.map((r) => `
        <tr class="depth-${depth}">
          <td><code>${esc(r.name)}</code>${r.optional ? ' <span class="opt">optional</span>' : ''}</td>
          <td>${type(r.type)}</td>
          <td>${r.default != null ? `<code>${esc(r.default)}</code>` : ''}</td>
          <td>${esc(r.description)}</td>
        </tr>${fieldRows(r.children, depth + 1)}`).join('');
}

/**
 * The source-backed part of a page: the signatures it documents, its return
 * type, a parameter table only where the page has none of its own, and the
 * line of source that implements it.
 */
function apiStrip(page, d, ctx) {
  if (!d) return '';
  const hasOwnTable = /^##\s+Parameters\b/m.test(page.body);
  const rows = d.params.length && !hasOwnTable ? `
      <details class="api-params">
        <summary>Parameters</summary>
        <table class="fields">
          <thead><tr><th>Param</th><th>Type</th><th>Default</th><th>Description</th></tr></thead>
          <tbody>${fieldRows(d.params)}
          </tbody>
        </table>
      </details>` : '';
  const ret = d.returns ? ` <span class="arrow">→</span> ${type(d.returns.type)}` : '';
  return `
      <aside class="api">
        ${signatures(d).map((s) => `<span class="sigline"><code class="sig">${s}</code>${ret}</span>`).join('\n        ')}
        ${rows}
        <a class="source" href="${ctx.source}#L${d.line}" title="the line that implements it">${esc(`${d.file}:${d.line}`)}</a>
      </aside>`;
}

// ── Examples ────────────────────────────────────────────────────────────────

function example(code, id) {
  return `
      <figure class="example" id="${esc(id)}">
        <div class="editor"><textarea class="source" spellcheck="false" aria-label="sketch source">${esc(code)}</textarea></div>
        <div class="stage" data-stage></div>
        <div class="toolbar">
          <button type="button" data-run>Run</button>
          <button type="button" data-reset>Reset</button>
          <span class="hint">edit, then run</span>
        </div>
      </figure>`;
}

/**
 * The page's Markdown, with every sketch lifted into a runner. A fence is a
 * sketch when it defines `setup()` — the same rule the doc-block validator
 * applies to `@example`.
 */
/**
 * Footnotes. The pages carry them (`[^1]` and a `[^1]: …` definition) and
 * marked has no footnote extension, so the definitions are lifted to a list at
 * the foot of the page and each reference becomes a link to it. Fenced code is
 * left alone.
 */
function footnotes(md) {
  const defs = [];
  const parts = md.split(/(```[\s\S]*?```)/g);
  const body = parts.map((seg, i) => {
    if (i % 2) return seg;
    return seg.replace(/^[ \t]*\[\^([^\]]+)\]:[ \t]*(.+)$/gm, (_, id, text) => {
      defs.push([id, text.trim()]);
      return '';
    });
  }).join('');
  if (!defs.length) return md;
  const linked = body.split(/(```[\s\S]*?```)/g).map((seg, i) => (i % 2 ? seg :
    seg.replace(/\[\^([^\]]+)\]/g, (_, id) =>
      `<sup class="fnref" id="fnref-${id}"><a href="#fn-${id}">${id}</a></sup>`))).join('');
  const list = defs.map(([id, text]) =>
    `<li id="fn-${id}">${marked.parseInline(text)} <a class="fnback" href="#fnref-${id}" aria-label="back">↩</a></li>`).join('\n');
  return `${linked}\n\n<section class="footnotes">\n<ol>\n${list}\n</ol>\n</section>\n`;
}

function bodyHtml(page, ctx) {
  lifted.clear();
  const tables = new Map();
  const body = page.body.replace(/<!--\s*uses:\s*(\w+)\s*-->\n?/g, (_, which) => {
    const id = `table-${which}`;
    tables.set(id, which === 'host' ? hostTables(page, ctx) : quadrilleTables(page, ctx));
    return `<p>@@${id}@@</p>\n`;
  });
  let html = marked.parse(footnotes(body));
  for (const [id, table] of tables) {
    html = html.replace(`<p>@@${id}@@</p>\n`, table).replace(`@@${id}@@`, table);
  }
  for (const [id, figure] of lifted) {
    html = html.replace(`<p>@@${id}@@</p>\n`, figure).replace(`@@${id}@@`, figure);
  }
  return html;
}

// ── Chrome ──────────────────────────────────────────────────────────────────

function navList(nodes, page, activePath) {
  return `<ul>${nodes.map((n) => {
    const href = from(page, urlOf(n.path));
    const current = n.path === activePath ? ' aria-current="page"' : '';
    const open = activePath.startsWith(`${n.path}/`) ? ' open' : '';
    if (!n.children.length) return `\n        <li><a href="${href}"${current}>${esc(n.title)}</a></li>`;
    return `\n        <li><details${open}><summary${current}><a href="${href}">${esc(n.title)}</a></summary>${navList(n.children, page, activePath)}</details></li>`;
  }).join('')}
      </ul>`;
}

function shell({ page, title, body, ctx, examples }) {
  const cm = examples ? `
  <link rel="stylesheet" href="${codemirror.css}">
  ${codemirror.js.map((u) => `<script src="${u}"></script>`).join('\n  ')}` : '';
  const v = (url) => `${url}?v=${ctx.stamp}`;   // a reload after a rebuild gets the new file
  const cfg = {
    p5: p5.url,
    // The index's own hrefs are site-root-relative: a result opened from a page
    // nested four levels down needs this prefix to land where it points.
    root: from(page, ''),
    lib: v(from(page, site.bundle)),
    // Root-relative prefixes (`/paintings/`) the examples use, resolved from the
    // page to the site root — the iframe inherits this page's base URL.
    media: Object.fromEntries(ctx.media.map((dir) => [dir, from(page, `${dir}/`)])),
    index: v(from(page, site.index)),
  };
  return `<!doctype html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>${esc(title)} — ${esc(ctx.pkg.name)}</title>
  <link rel="stylesheet" href="${v(from(page, site.style))}">${cm}
  <script>window.quadrilleDocs = ${JSON.stringify(cfg)};</script>
  <script src="${v(from(page, site.runner))}" defer></script>
  <script src="${v(from(page, site.search))}" defer></script>
</head>
<body>
  <nav class="sidebar">
    <a class="brand" href="${from(page, 'index.html')}">${esc(ctx.pkg.name)}</a>
    <span class="version">v${esc(ctx.pkg.version)}</span>
    <input class="search" type="search" placeholder="Search…" aria-label="Search the API" autocomplete="off">
    ${navList(ctx.nav, page, page.path)}
    <ul class="results" hidden></ul>
  </nav>
  <main>
${body}
    <footer>${esc(ctx.pkg.name)} v${esc(ctx.pkg.version)} · ${esc(ctx.pkg.license ?? '')}</footer>
  </main>
</body>
</html>
`;
}

/** Children as headings, so each keeps the anchor the old site published. */
function childrenHtml(page, ctx) {
  const kids = ctx.childrenOf.get(page.path) ?? [];
  if (!kids.length) return '';
  return `
      <section class="children">
        <h2 class="children-title">${kids.length} ${kids.length === 1 ? 'page' : 'pages'}</h2>
        ${kids.map((k) => `
        <h3 id="${slug(k.title)}"><a href="${from(page, urlOf(k.path))}">${esc(k.title)}</a></h3>`).join('')}
      </section>`;
}

function prevNext(page, ctx) {
  const i = ctx.order.findIndex((p) => p.path === page.path);
  const back = i > 0 ? ctx.order[i - 1] : null;
  const fwd  = i >= 0 && i < ctx.order.length - 1 ? ctx.order[i + 1] : null;
  if (!back && !fwd) return '';
  return `
      <nav class="pager">
        ${back ? `<a class="back" href="${from(page, urlOf(back.path))}">← ${esc(back.title)}</a>` : '<span></span>'}
        ${fwd ? `<a class="fwd" href="${from(page, urlOf(fwd.path))}">${esc(fwd.title)} →</a>` : '<span></span>'}
      </nav>`;
}

// ── What the examples use ───────────────────────────────────────────────────
// Derived from the fences, never written by hand: `uses.js` resolves each name
// to a tier, `host-terms.js` glosses the two host tiers, and a name with no
// gloss fails the build. Pages opt in with `<!-- uses: host -->` or
// `<!-- uses: quadrille -->`; every page with a sketch also gets the compact
// block at its foot.

/** A name as the row of a table: linked when the tier has a page, else plain. */
function termLink(key, page, ctx) {
  const name = key.slice(key.indexOf(':') + 1).replace(/^Element\./, '');
  if (key.startsWith('quadrille:')) {
    const d = ctx.docletsByName.get(name);
    return d && !d.ignore ? `<a href="${from(page, urlOf(d.page ?? `${d.group}/${snake(d.name)}`))}"><code>${esc(name)}</code></a>`
      : `<code>${esc(name)}</code>`;
  }
  const href = ctx.termHref(key);
  return href ? `<a href="${href}"><code>${esc(name)}</code></a>` : `<code>${esc(name)}</code>`;
}

/**
 * A row's one-line description: the gloss for a host name, the doc block's own
 * first sentence for this library's — which is why that column needs no
 * authored prose of its own.
 */
function glossOf(key, ctx) {
  if (key.startsWith('quadrille:')) {
    const d = ctx.docletsByName.get(key.slice('quadrille:'.length));
    return d ? firstSentence(d.description) : '';
  }
  return ctx.terms[key]?.gloss ?? '';
}

/** Rows sorted by how many examples use them, then by name. */
function rowsFor(keys, page, ctx) {
  return [...keys].sort((a, b) => (ctx.uses.counts.get(b) ?? 0) - (ctx.uses.counts.get(a) ?? 0)
    || a.localeCompare(b));
}

function termsTable(rows, page, ctx, { name, gloss, count }) {
  return `
        <table class="terms">
          <thead><tr><th>${esc(name)}</th><th>${esc(gloss)}</th><th>${esc(count)}</th></tr></thead>
          <tbody>${rows.map((key) => {
            const bare = key.slice(key.indexOf(':') + 1);
            return `
            <tr id="${slug(bare)}">
              <td>${termLink(key, page, ctx)}</td>
              <td>${esc(glossOf(key, ctx))}</td>
              <td class="count">${ctx.uses.counts.get(key) ?? 0}</td>
            </tr>`;
          }).join('')}
          </tbody>
        </table>`;
}

/** `<!-- uses: host -->` — p5.js and JavaScript, by area. */
function hostTables(page, ctx) {
  const keys = [...ctx.uses.counts.keys()].filter((k) => !k.startsWith('quadrille:'));
  return ctx.sections.map((section) => {
    const mine = keys.filter((k) => ctx.areas.find((a) => a.id === ctx.terms[k]?.area)?.section === section.id);
    return `
      <section class="terms-section">
        <h2 id="${esc(section.id)}">${esc(section.title)}</h2>
        ${ctx.areas.filter((a) => a.section === section.id).map((area) => {
          const areaKeys = mine.filter((k) => ctx.terms[k].area === area.id);
          if (!areaKeys.length) return '';
          return `
        <h3 id="${esc(area.id)}">${esc(area.title)}</h3>
        ${termsTable(rowsFor(areaKeys, page, ctx), page, ctx, { name: 'Name', gloss: 'What the examples use it for', count: 'Examples' })}`;
        }).join('')}
      </section>`;
  }).join('');
}

/** `<!-- uses: quadrille -->` — this library's own surface, by teaching area. */
function quadrilleTables(page, ctx) {
  const keys = [...ctx.uses.counts.keys()].filter((k) => k.startsWith('quadrille:'));
  const byArea = new Map();
  for (const key of keys) {
    const d = ctx.docletsByName.get(key.slice('quadrille:'.length));
    const area = d?.group ?? 'other';
    if (!byArea.has(area)) byArea.set(area, []);
    byArea.get(area).push(key);
  }
  return ctx.groups.filter((g) => byArea.has(g.slug)).map((g) => `
      <section class="terms-section">
        <h2 id="${esc(g.slug)}">${esc(g.title)}</h2>
        ${termsTable(rowsFor(byArea.get(g.slug), page, ctx), page, ctx,
          { name: 'Surface', gloss: 'What it is', count: 'Examples' })}
      </section>`).join('');
}

/** The compact block at the foot of a page that carries sketches. */
function usesBlock(page, ctx) {
  const used = ctx.uses.byPage.get(page.path);
  if (!used || !used.size) return '';
  const tiers = [
    ['quadrille', 'p5.quadrille'],
    ['p5', 'p5.js'],
    ['js', 'JavaScript'],
  ];
  return `
      <section class="uses">
        <details>
          <summary>What this page's examples use</summary>
          <dl>${tiers.map(([tier, label]) => {
            const keys = rowsFor([...used.keys()].filter((k) => k.startsWith(`${tier}:`)), page, ctx);
            if (!keys.length) return '';
            return `
            <dt>${esc(label)}</dt>
            <dd>${keys.map((k) => termLink(k, page, ctx)).join(' ')}</dd>`;
          }).join('')}
          </dl>
          <p class="hint">Names the analysis can prove are called, and the line each one is documented on. Local variables and members of an unknown receiver are left out.</p>
        </details>
      </section>`;
}

// ── The tree ────────────────────────────────────────────────────────────────

/** Pages as a navigation tree: `_index` pages are the nodes, others the leaves. */
function buildTree(pages) {
  const byPath = new Map(pages.map((p) => [p.path, p]));
  const childrenOf = new Map();
  for (const p of pages) {
    if (!p.isIndex) continue;
    childrenOf.set(p.path, []);
  }
  for (const p of pages) {
    const kids = childrenOf.get(p.parent);
    if (kids) kids.push(p);
  }
  const sortKids = (list) => list
    .sort((a, b) => a.weight - b.weight || a.title.localeCompare(b.title))
    .map((k) => ({ path: k.path, title: k.title, children: sortKids(childrenOf.get(k.path) ?? []) }));
  const roots = pages.filter((p) => p.isIndex && p.parent === '')
    .sort((a, b) => a.weight - b.weight || a.title.localeCompare(b.title))
    .map((r) => ({ path: r.path, title: r.title, children: sortKids(childrenOf.get(r.path) ?? []) }));
  return { byPath, childrenOf, roots };
}

/** Every page in reading order: the tree, depth first. */
function readingOrder(nodes, out = []) {
  for (const n of nodes) {
    out.push(n.path);
    readingOrder(n.children, out);
  }
  return out;
}

// ── Entry ───────────────────────────────────────────────────────────────────

/**
 * @param {Object[]} pages from pages.js
 * @param {Object} parsed { modules, doclets }
 * @param {Object} ctx { pkg, readme, source, base, media, redirects }
 * @returns {Map<string, string>} site-relative file → HTML
 */
export function render(pages, parsed, ctx) {
  const { byPath, childrenOf, roots } = buildTree(pages);
  const order = readingOrder(roots).map((path) => byPath.get(path));
  const doclets = new Map(parsed.doclets.filter((d) => !d.ignore).map((d) => [d.name, d]));
  const canonical = new Map();
  for (const d of doclets.values()) {
    canonical.set(d.page ?? `${d.group}/${snake(d.name)}`, d);
  }
  ctx = { ...ctx, nav: roots, childrenOf, order };

  const files = new Map();
  const landing = { path: '', dir: '', title: 'README' };

  files.set('index.html', shell({
    page: landing, title: 'README', ctx, examples: false,
    body: `    <article class="readme">${marked.parse(ctx.readme)}</article>`,
  }));

  for (const p of pages) {
    const d = canonical.get(p.path) ?? null;
    const examples = /```js[\s\S]*?function setup\s*\(/.test(p.body);
    const body = `
    <article class="page">
      <h1>${esc(p.title)}</h1>${apiStrip(p, d, ctx)}
      <div class="prose">${bodyHtml(p, ctx)}</div>${childrenHtml(p, ctx)}${usesBlock(p, ctx)}${prevNext(p, ctx)}
    </article>`;
    files.set(`${urlOf(p.path)}index.html`, shell({
      page: p, title: p.title, ctx, examples, body,
    }));
  }

  // Stubs: a path the old site published that no page answers any more.
  for (const [gone, to] of Object.entries(ctx.redirects?.pages ?? {})) {
    const stand = { path: gone };
    files.set(`${urlOf(gone)}index.html`,
      stub(to ? from(stand, urlOf(to)) : from(stand, 'index.html'), from(stand, 'index.html')));
  }

  files.set(site.index, JSON.stringify(searchIndex(pages, doclets, ctx)));
  return files;
}

/** A meta-refresh stub, with a canonical link and a visible way out. */
function stub(target, home) {
  return `<!doctype html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <title>Moved</title>
  <link rel="canonical" href="${target}">
  <meta http-equiv="refresh" content="0; url=${target}">
</head>
<body>
  <p>This page moved. <a href="${target}">Continue</a> or <a href="${home}">start from the index</a>.</p>
</body>
</html>
`;
}

/** One entry per page, per surface and per host term: what the search looks through. */
function searchIndex(pages, doclets, ctx) {
  const out = [];
  for (const d of doclets.values()) {
    out.push({ t: d.name, h: urlOf(d.page ?? `${d.group}/${snake(d.name)}`), k: 'symbol', s: firstSentence(d.description) });
  }
  for (const key of ctx.uses.counts.keys()) {
    if (key.startsWith('quadrille:')) continue;
    const bare = key.slice(key.indexOf(':') + 1);
    out.push({
      t: bare, h: `${urlOf('reference/host')}#${slug(bare)}`, k: key.split(':')[0],
      s: ctx.terms[key]?.gloss ?? '',
    });
  }
  for (const p of pages) {
    out.push({ t: p.title, h: urlOf(p.path), k: p.isIndex ? 'section' : 'page', s: firstSentence(firstParagraph(p.body)) });
  }
  return out;
}

/** The first paragraph of a page's Markdown, shortcodes already resolved. */
function firstParagraph(md) {
  const withoutFences = md.replace(/```[\s\S]*?```/g, '');
  for (const block of withoutFences.split(/\n\s*\n/)) {
    const t = block.trim();
    if (!t || t.startsWith('#') || t.startsWith('>') || t.startsWith('|') || t.startsWith('-') || t.startsWith('*')) continue;
    return t;
  }
  return '';
}

function firstSentence(text) {
  const plain = (text || '').replace(/\[([^\]]*)\]\([^)]*\)/g, '$1').replace(/[`*_]/g, '').replace(/\s+/g, ' ').trim();
  const m = /^(.+?[.!?])(\s|$)/.exec(plain);
  return m ? m[1] : plain.slice(0, 160);
}
