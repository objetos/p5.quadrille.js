/**
 * @file Sidebar search — filters the page index as you type.
 * @license GPL-3.0-only
 *
 * ES module on every page. The page's configuration is the
 * `application/json` block `#docs-config`: its `index` is the generator's search
 * index — one entry per documented name, per host name and per page — and its
 * `root` is this page's prefix to the site root, which the index's own hrefs are
 * written against. The index is fetched once, on the first keystroke, and the
 * typed text is matched against an entry's title, its kind and its first
 * sentence as a plain substring. Results replace the page tree while the field
 * is non-empty; Enter opens the first result, Esc clears.
 */

function readConfig() {
  const block = document.getElementById('docs-config');
  if (!block) return null;
  try {
    return JSON.parse(block.textContent);
  } catch (_) {
    return null;
  }
}

function start(config) {
  const field   = document.querySelector('.sidebar .search');
  const tree    = document.querySelector('#site-nav > ul');
  const results = document.querySelector('.sidebar .results');
  if (!field || !tree || !results) return;

  const root = config.root || './';
  let index = null, loading = null;

  function load() {
    if (index) return Promise.resolve(index);
    loading = loading || fetch(new URL(config.index, new URL(root, document.baseURI)))
      .then((r) => r.json())
      .then((list) => { index = list; return list; });
    return loading;
  }

  const clip = (s) => String(s).replace(/</g, '&lt;');

  /**
   * How well an entry answers `q`: the page named exactly first, then a title
   * that starts with it, then a title that contains it, then prose that does.
   * Without this a substring match on a summary ("sto-ring") outranks the page
   * actually called `ring`.
   */
  function score(e, q) {
    const t = e.t.toLowerCase();
    if (t === q) return 0;
    if (t.indexOf(q) === 0) return 1;
    if (t.indexOf(q) >= 0) return 2;
    return (e.s || '').toLowerCase().indexOf(q) >= 0 ? 3 : -1;
  }

  function show(list, q) {
    const hits = list
      .map((e) => [score(e, q), e])
      .filter((pair) => pair[0] >= 0)
      .sort((a, b) => a[0] - b[0])
      .slice(0, 40)
      .map((pair) => pair[1]);
    results.innerHTML = hits.length ? hits.map((e) =>
      `<li><a href="${root}${e.h}"><span class="name">${e.t}</span>` +
      `<span class="kind">${e.k}</span>` +
      (e.s ? `<span class="hint">${clip(e.s)}</span>` : '') + '</a></li>',
    ).join('') : '<li class="none">No match</li>';
    results.hidden = false;
    tree.hidden = true;
  }

  function clear() {
    results.hidden = true;
    results.innerHTML = '';
    tree.hidden = false;
  }

  field.addEventListener('input', () => {
    const q = field.value.trim().toLowerCase();
    if (!q) return clear();
    load().then((list) => { if (field.value.trim().toLowerCase() === q) show(list, q); });
  });
  field.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') { field.value = ''; clear(); }
    if (e.key === 'Enter') {
      const first = results.querySelector('a');
      if (first) window.location.href = first.getAttribute('href');
    }
  });
}

const config = readConfig();
if (config) start(config);
