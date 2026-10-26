/**
 * @file Example runner — an editable code box and a live p5 canvas per sketch,
 * with a viewport-driven iframe lifecycle.
 * @license GPL-3.0-only
 *
 * Classic deferred script on every page; no-op where there are no sketches.
 * Config arrives in `window.quadrilleDocs` ({ p5, lib, media, index }); markup
 * is the renderer's `figure.example` (`textarea.source`, `[data-stage]`,
 * `[data-run]`, `[data-reset]`).
 *
 * - Editor: CodeMirror 5 over the source textarea; the bare textarea is the
 *   fallback when CodeMirror is absent.
 * - Canvas: a same-origin `srcdoc` iframe, unsandboxed (the examples are the
 *   site's own code, the runner reaches into each frame to size it and to
 *   release its context, and p5's async loaders need the page's origin),
 *   assembled from p5 (CDN, pinned) + the site-local bundle + the box contents.
 *   `srcdoc` inherits the page's base URL, so the bundle resolves relatively.
 * - Media: the examples keep the root-relative paths the `pages` branch
 *   published (`/paintings/p7.jpg`, `/fonts/noto_sans.ttf`). On a site served
 *   under a base path those land on the host root, so the runner rewrites them
 *   to the site's own prefix before the sketch runs — the hosted copy of the
 *   old site did the same to its `srcdoc`.
 * - Sizing: a p5 canvas is not a fixed box. p5 makes a 100×100 canvas before
 *   `setup`, inserts a hidden 1×1 text-measurement canvas ahead of the real
 *   one, and `position()`s DOM controls against the initial containing block,
 *   so a frame must measure the maximum over **all** canvases *and* every body
 *   child's bounding box, and must keep observing after fonts and media land.
 *   All three are the `pages` shortcode's findings; this is the same protocol,
 *   measured from the parent because same-origin access makes the postMessage
 *   round trip unnecessary.
 * - Lifecycle: an IntersectionObserver mounts an iframe as its figure nears
 *   the viewport and unmounts it once far off-screen; at most LIVE_MAX live at
 *   once, least recently neared out first. Unmounting stops the sketch and
 *   loses its 2D/WebGL context explicitly — Chromium caps concurrent contexts.
 */

(function () {
  'use strict';

  const cfg     = window.quadrilleDocs;
  const figures = document.querySelectorAll('figure.example');
  if (!cfg || !figures.length) return;

  const LIVE_MAX = 6;
  const NEAR     = '400px 0px';   // mount when the figure is within this margin of the viewport
  const FAR      = '1600px 0px';  // unmount once it is beyond this margin

  const attr = (s) => String(s).replace(/"/g, '&quot;');
  const esc  = (s) => String(s).replace(/<\/(script)/gi, '<\\/$1');

  /**
   * Root-relative media paths the examples were written with → the site's own.
   * `cfg.media` maps the directory name to its prefix from the page, because a
   * sketch's `/paintings/p7.jpg` is the host root's, not the site's.
   */
  function mediaPaths(code) {
    if (!cfg.media) return code;
    return code.replace(/(['"`])\/(fonts|images|paintings|videos)\//g, (all, q, dir) =>
      `${q}${cfg.media[dir] ?? `/${dir}/`}`);
  }

  /** The iframe document: pinned p5, site-local bundle, then the sketch. */
  function srcdoc(code) {
    return `<!doctype html>
<html><head><meta charset="utf-8">
<style>
html,body{margin:0;padding:0;overflow:hidden;background:#0a0a0e;color:#e4e6ea;
  font:13px/1.4 system-ui,-apple-system,"Segoe UI",Roboto,sans-serif}
canvas{display:block}
/* Nothing here may move the canvas: p5 v2 wraps it in a <main>, and any margin
   on that wrapper — or on the body — shows as a blank strip on the sketch's top
   and left edges. The body's text colour is what makes the elements p5's DOM
   helpers append (createP, createDiv …) readable on the stage's dark
   background; their position is the sketch's business, not the frame's. */
body > *{margin:0}
/* A control that flows after the canvas gets a hairline gap; one the sketch
   positioned itself is placed by its own coordinates, untouched. */
body > main + :not([style*="position: absolute"]){margin-top:4px}
</style>
<script src="${attr(cfg.p5)}"></script>
<script src="${attr(cfg.lib)}"></script>
</head><body>
<script>
${esc(mediaPaths(code))}
</script>
</body></html>`;
  }

  /** Stop the sketch and lose the drawing context, then drop the frame. */
  function dispose(frame) {
    stopSizing(frame);
    try {
      const w      = frame.contentWindow;
      const canvases = [...w.document.querySelectorAll('canvas')];
      if (typeof w.remove === 'function') w.remove();   // p5 global-mode remove()
      for (const canvas of canvases) {
        for (const kind of ['2d', 'webgl2', 'webgl']) {
          const ctx = canvas.getContext(kind);
          if (ctx) { ctx.getExtension?.('WEBGL_lose_context')?.loseContext(); break; }
        }
      }
    } catch (_) { /* the frame's document is already gone — removal has to do */ }
    frame.remove();
  }

  function editorOf(textarea, run) {
    if (!window.CodeMirror) return null;
    return window.CodeMirror.fromTextArea(textarea, {
      mode:           'javascript',
      lineNumbers:    true,
      indentUnit:     2,
      tabSize:        2,
      viewportMargin: Infinity,   // render every line — the box grows to fit the sketch
      lineWrapping:   true,       // a long sketch line wraps instead of scrolling sideways
      extraKeys:      { 'Ctrl-Enter': run, 'Cmd-Enter': run },
    });
  }

  // ── Sizing ────────────────────────────────────────────────────────────────
  // The parent measures its own frame: same-origin, so no protocol is needed.

  const sizing = new WeakMap();   // frame → {ro, interval}

  function stopSizing(frame) {
    const s = sizing.get(frame);
    if (!s) return;
    clearInterval(s.interval);
    clearTimeout(s.slow);
    s.ro?.disconnect();
    sizing.delete(frame);
  }

  /** The frame's content size, by all three measurements the shortcode needed. */
  function measure(frame) {
    const doc = frame.contentDocument;
    if (!doc) return null;
    let w = 0, h = 0;
    // Every canvas: a hidden 1×1 measurement canvas precedes the real one.
    const canvases = doc.querySelectorAll('canvas');
    for (const canvas of canvases) {
      // Laid-out box, not the border box: a padded body offsets the canvas, and
      // the frame has to include that offset or it clips the last few pixels.
      const r = canvas.getBoundingClientRect();
      w = Math.max(w, Math.ceil(r.right));
      h = Math.max(h, Math.ceil(r.bottom));
    }
    // And the flow: each child's own box, because `position()` lays controls out
    // against the initial containing block and scrollHeight ignores absolutely
    // positioned children.
    for (const el of doc.body.children) {
      const r = el.getBoundingClientRect();
      if (r.right > w) w = Math.ceil(r.right);
      if (r.bottom > h) h = Math.ceil(r.bottom);
    }
    // Only with no canvas is the document's own scroll size the only evidence —
    // and then it is also the frame's current size, which is why it is never
    // consulted beside a canvas: it would report the box, not the content.
    if (!canvases.length) {
      w = Math.max(w, doc.body.scrollWidth);
      h = Math.max(h, doc.body.scrollHeight);
    }
    return w > 0 && h > 0 ? { w, h } : null;
  }

  function size(frame) {
    const fit = measure(frame);
    if (!fit) return;
    const key = `${fit.w}x${fit.h}`;
    if (frame.dataset.size === key) return;
    frame.dataset.size = key;
    frame.style.width  = `${fit.w}px`;
    frame.style.height = `${fit.h}px`;
  }

  /** Keep measuring: a burst while fonts and media land, then a slow heartbeat. */
  function watchSizing(frame) {
    const doc = frame.contentDocument;
    const ro = window.ResizeObserver && doc?.body ? new ResizeObserver(() => size(frame)) : null;
    ro?.observe(doc.body);
    const fast = setInterval(() => size(frame), 120);
    const slow = setTimeout(() => {
      clearInterval(fast);
      const s = sizing.get(frame);
      if (s) s.interval = setInterval(() => size(frame), 1000);
    }, 6000);
    sizing.set(frame, { ro, interval: fast, slow });
  }

  // ── Lifecycle ─────────────────────────────────────────────────────────────

  const runners = new Map();   // figure → runner
  const live    = [];          // mounted runners, least recently neared first

  const code = (r) => (r.editor ? r.editor.getValue() : r.textarea.value);

  function unmount(r) {
    if (!r.frame) return;
    dispose(r.frame);
    r.frame = null;
    const i = live.indexOf(r);
    if (i >= 0) live.splice(i, 1);
  }

  function mount(r) {
    unmount(r);
    while (live.length >= LIVE_MAX) unmount(live[0]);
    const f = document.createElement('iframe');
    f.className = 'sketch';
    f.title     = r.title;
    f.dataset.size = '';
    f.style.width  = '1px';
    f.style.height = '1px';
    f.addEventListener('load', () => { size(f); watchSizing(f); });
    f.srcdoc = srcdoc(code(r));
    r.stage.replaceChildren(f);
    r.frame = f;
    live.push(r);
  }

  function touch(r) {
    const i = live.indexOf(r);
    if (i >= 0) live.push(...live.splice(i, 1));
  }

  const near = new IntersectionObserver((entries) => {
    for (const e of entries) {
      if (!e.isIntersecting) continue;
      const r = runners.get(e.target);
      r.frame ? touch(r) : mount(r);
    }
  }, { rootMargin: NEAR });

  const far = new IntersectionObserver((entries) => {
    for (const e of entries) {
      if (!e.isIntersecting) unmount(runners.get(e.target));
    }
  }, { rootMargin: FAR });

  // ── Wire every sketch ─────────────────────────────────────────────────────

  for (const figure of figures) {
    const textarea = figure.querySelector('textarea.source');
    const stage    = figure.querySelector('[data-stage]');
    if (!textarea || !stage) continue;

    const r = {
      figure, stage, textarea,
      source: textarea.value,
      title:  figure.querySelector('figcaption')?.textContent.trim() || figure.id,
      editor: null,
      frame:  null,
    };
    const run   = () => mount(r);
    const reset = () => (r.editor ? r.editor.setValue(r.source) : (textarea.value = r.source));

    r.editor = editorOf(textarea, run);
    figure.querySelector('[data-run]')?.addEventListener('click', run);
    figure.querySelector('[data-reset]')?.addEventListener('click', reset);

    runners.set(figure, r);
    near.observe(figure);
    far.observe(figure);
  }
})();
