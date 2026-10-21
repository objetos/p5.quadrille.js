/**
 * @file Sidebar search — filters the page index as you type.
 * @license GPL-3.0-only
 *
 * Classic deferred script on every page. Loads the generator's index
 * (`window.quadrilleDocs.index`, one entry per page and per documented
 * surface: `{ t: title, h: href, k: kind, s: first sentence }`) once, on the
 * first keystroke, and matches the typed text against title, kind and the
 * first sentence as a plain substring. Results replace the page tree while the
 * field is non-empty; Enter opens the first result, Esc clears.
 */
(function () {
  'use strict';
  var cfg   = window.quadrilleDocs || {};
  var root  = cfg.root || '';
  var field = document.querySelector('.sidebar .search');
  var nav   = document.querySelector('.sidebar ul');
  var results = document.querySelector('.sidebar .results');
  if (!field || !nav || !results) return;

  var index = null, loading = null;
  function load() {
    if (index) return Promise.resolve(index);
    loading = loading || fetch(window.quadrilleDocs.index).then(function (r) { return r.json(); })
      .then(function (list) { index = list; return list; });
    return loading;
  }

  function clip(s) { return s.replace(/</g, '&lt;'); }

  /**
   * How well an entry answers `q`: the page named exactly first, then a title
   * that starts with it, then a title that contains it, then prose that does.
   * Without this a substring match on a summary ("sto-ring") outranks the page
   * actually called `ring`.
   */
  function score(e, q) {
    var t = e.t.toLowerCase();
    if (t === q) return 0;
    if (t.indexOf(q) === 0) return 1;
    if (t.indexOf(q) >= 0) return 2;
    return (e.s || '').toLowerCase().indexOf(q) >= 0 ? 3 : -1;
  }

  function show(list, q) {
    var hits = list
      .map(function (e) { return [score(e, q), e]; })
      .filter(function (pair) { return pair[0] >= 0; })
      .sort(function (a, b) { return a[0] - b[0]; })
      .slice(0, 40)
      .map(function (pair) { return pair[1]; });
    results.innerHTML = hits.length ? hits.map(function (e) {
      return '<li><a href="' + root + e.h + '"><span class="name">' + e.t + '</span>' +
        '<span class="kind">' + e.k + '</span>' +
        (e.s ? '<span class="hint">' + clip(e.s) + '</span>' : '') + '</a></li>';
    }).join('') : '<li class="none">No match</li>';
    results.hidden = false;
    nav.hidden = true;
  }

  function clear() {
    results.hidden = true;
    results.innerHTML = '';
    nav.hidden = false;
  }

  field.addEventListener('input', function () {
    var q = field.value.trim().toLowerCase();
    if (!q) return clear();
    load().then(function (list) { if (field.value.trim().toLowerCase() === q) show(list, q); });
  });
  field.addEventListener('keydown', function (e) {
    if (e.key === 'Escape') { field.value = ''; clear(); }
    if (e.key === 'Enter') {
      var first = results.querySelector('a');
      if (first) window.location.href = first.getAttribute('href');
    }
  });
})();
