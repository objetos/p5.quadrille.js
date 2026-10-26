#!/usr/bin/env node
/**
 * @file Browser pass — `node tools/docs/browser-check.mjs [base-url]`.
 * @module tools/docs/browser-check
 * @license GPL-3.0-only
 *
 * The one check the build cannot make. Everything the pipeline produces is
 * HTML, but the runner, the search and the sizing protocol are client code: a
 * page can be perfect in the file and broken in the browser, and did — the
 * search field built its result hrefs without the page's own prefix, which no
 * file-level gate could see.
 *
 * It drives a headless Chromium over the DevTools protocol (Node's built-in
 * WebSocket, no dependency), and reports, per page:
 *
 *   - console errors raised by the page or by a sketch's frame;
 *   - a sketch frame that never got sized (the p5 canvas would stay 1×1);
 *   - the search field, on a nested page: type a query, click the first hit,
 *     and require the landing page to be the one the query names.
 *
 * The site must be served first, since the search index is fetched:
 *
 *     npm run build && npm run docs
 *     python3 -m http.server -d site 8000
 *     node tools/docs/browser-check.mjs http://127.0.0.1:8000/
 *
 * `CHROME` names the binary (default `chromium`). Extensions are off: a
 * system-wide entry (`plasma-browser-integration`) would otherwise load its
 * native host, which aborts without a display. Exit 1 on any failure.
 */

import { spawn } from 'node:child_process';
import { mkdtempSync, rmSync } from 'node:fs';
import { createServer } from 'node:net';
import { tmpdir } from 'node:os';
import { join } from 'node:path';

const base = (process.argv[2] ?? 'http://127.0.0.1:8000/').replace(/\/$/, '');
const BIN = process.env.CHROME ?? 'chromium';

/** A port nobody holds: a fixed one would attach to whatever browser already owns it. */
const PORT = await new Promise((resolve) => {
  const probe = createServer();
  probe.listen(0, '127.0.0.1', () => {
    const { port } = probe.address();
    probe.close(() => resolve(port));
  });
});

/** Pages that exercise each shape: a sketch, a listing, a folder page, search. */
const checks = [
  { path: 'docs/properties/read_write/width/', sketch: true },
  { path: 'docs/mutators/rand/rand_times/', sketch: true, domText: true, uses: true },
  { path: 'docs/reference/host/', terms: 60 },
  { path: 'docs/reference/quadrille_surface/', terms: 40 },
  { path: 'docs/p5_functions/create_quadrille/create_quadrille_FEN/', sketch: true },
  { path: 'docs/algebra/merge/', sketch: true, footnotes: true },
  { path: 'docs/mutators/fill/', folder: true },
];

const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

const profile = mkdtempSync(join(tmpdir(), 'p5q-browser-'));
const browser = spawn(BIN, [
  '--headless=new', '--no-sandbox', '--disable-gpu', '--hide-scrollbars',
  // A throw-away profile must not fetch the system's Plasma integration
  // extension, and no native host should reach the session bus from here.
  '--disable-extensions',
  '--disable-extensions',
  `--remote-debugging-port=${PORT}`, `--user-data-dir=${profile}`,
  '--window-size=1400,1600', 'about:blank',
], { stdio: 'ignore' });

const stop = () => { try { browser.kill('SIGTERM'); } catch (_) {} rmSync(profile, { recursive: true, force: true }); };
browser.on('exit', (code) => {
  if (code !== null && code !== 0) console.error(`[check] the browser exited early (${code}) — is ${BIN} installed?`);
});
process.on('exit', stop);

async function pageTarget() {
  for (let i = 0; i < 40; i++) {
    try {
      const list = await (await fetch(`http://127.0.0.1:${PORT}/json/list`)).json();
      const page = list.find((t) => t.type === 'page');
      if (page) return page.webSocketDebuggerUrl;
    } catch (_) { /* not up yet */ }
    await sleep(250);
  }
  throw new Error('the browser did not expose a page target');
}

const ws = new WebSocket(await pageTarget());
await new Promise((r) => ws.addEventListener('open', r, { once: true }));

let id = 0;
const pending = new Map();
const consoleErrors = [];
ws.addEventListener('message', (e) => {
  const msg = JSON.parse(e.data);
  if (msg.id && pending.has(msg.id)) { pending.get(msg.id)(msg); pending.delete(msg.id); return; }
  if (msg.method === 'Runtime.exceptionThrown') {
    const d = msg.params.exceptionDetails;
    consoleErrors.push(d.exception?.description ?? d.text);
  }
  if (msg.method === 'Runtime.consoleAPICalled' && msg.params.type === 'error') {
    consoleErrors.push(msg.params.args.map((a) => a.value ?? a.description ?? '').join(' '));
  }
});

const send = (method, params = {}) => new Promise((resolve) => {
  const n = ++id;
  pending.set(n, resolve);
  ws.send(JSON.stringify({ id: n, method, params }));
});

/** Evaluate in the page; throws what the page threw. */
async function evaluate(expression) {
  const r = await send('Runtime.evaluate', { expression, awaitPromise: true, returnByValue: true });
  if (r.result?.exceptionDetails) {
    throw new Error(r.result.exceptionDetails.exception?.description ?? r.result.exceptionDetails.text);
  }
  return r.result?.result?.value;
}

await send('Page.enable');
await send('Runtime.enable');

const failures = [];
const fail = (page, msg) => { failures.push(`${page}  ${msg}`); };

/** WCAG contrast ratio between two `rgb(…)` colours. */
function contrast(a, b) {
  const lum = (css) => {
    const [r, g, bl] = (css.match(/[\d.]+/g) ?? [0, 0, 0]).slice(0, 3).map(Number);
    const f = (c) => c / 255 <= 0.03928 ? c / 255 / 12.92 : ((c / 255 + 0.055) / 1.055) ** 2.4;
    return 0.2126 * f(r) + 0.7152 * f(g) + 0.0722 * f(bl);
  };
  const [la, lb] = [lum(a), lum(b)].sort((x, y) => y - x);
  return (la + 0.05) / (lb + 0.05);
}

for (const check of checks) {
  consoleErrors.length = 0;
  await send('Page.navigate', { url: `${base}/${check.path}` });
  await sleep(2500);
  if (await evaluate('document.readyState') !== 'complete') { fail(check.path, 'did not load'); continue; }

  // A frame that never got sized is a sketch the reader cannot see. The runner
  // mounts when a figure nears the viewport, so the check scrolls first and
  // then waits — the frame is created on intersection, not on load.
  if (check.sketch) {
    await evaluate(`document.querySelector('figure.example')?.scrollIntoView({ block: 'center' })`);
    let size = '';
    for (let i = 0; i < 16 && !size; i++) {
      await sleep(500);
      size = await evaluate(`document.querySelector('iframe.sketch')?.dataset.size || ''`);
    }
    if (!size) fail(check.path, 'sketch frame never mounted or never sized');

    // The canvas has to start at the frame's origin: a margin on p5's <main>
    // wrapper once showed as a blank strip along the sketch's top and left.
    const at = await evaluate(`(() => {
      const c = document.querySelector('iframe.sketch')?.contentDocument?.querySelector('canvas');
      if (!c) return null;
      const r = c.getBoundingClientRect();
      return [Math.round(r.left), Math.round(r.top)];
    })()`);
    if (!at) fail(check.path, 'no canvas in the frame');
    else if (at[0] !== 0 || at[1] !== 0) fail(check.path, `canvas starts at (${at.join(', ')}), not the frame's origin`);
  }
  if (check.folder) {
    const kids = await evaluate(`document.querySelectorAll('.children h3').length`);
    if (!kids) fail(check.path, 'no child anchors on a directory page');
  }
  // p5's DOM helpers (createP, createDiv) put text beside the canvas, on the
  // stage's own dark background: it has to be readable there.
  if (check.domText) {
    const info = await evaluate(`(() => {
      const f = document.querySelector('iframe.sketch');
      if (!f || !f.contentDocument) return null;
      const d = f.contentDocument;
      const el = [...d.body.children].find((e) => e.tagName !== 'CANVAS');
      if (!el) return null;
      const w = f.contentWindow;
      return { text: el.textContent.trim().slice(0, 40),
               color: w.getComputedStyle(el).color,
               bg: w.getComputedStyle(d.body).backgroundColor };
    })()`);
    if (!info) fail(check.path, 'no DOM text beside the canvas to check');
    else {
      const ratio = contrast(info.color, info.bg);
      if (!(ratio >= 4.5)) fail(check.path, `DOM text "${info.text}" is ${info.color} on ${info.bg} (contrast ${ratio.toFixed(1)}:1)`);
    }
  }
  // The generated tables: a page with a directive must carry its rows.
  if (check.terms) {
    const rows = await evaluate(`document.querySelectorAll('.terms tr[id]').length`);
    if (rows < check.terms) fail(check.path, `${rows} term row(s), expected at least ${check.terms}`);
  }
  // The per-page block at the foot of a page that carries sketches.
  if (check.uses) {
    const names = await evaluate(`document.querySelectorAll('.uses dd code').length`);
    if (!names) fail(check.path, 'no "what this page uses" block');
  }
  if (check.footnotes) {
    const notes = await evaluate(`document.querySelectorAll('.footnotes li').length`);
    if (!notes) fail(check.path, 'footnotes did not render');
  }
  for (const err of consoleErrors) fail(check.path, `console: ${err.split('\n')[0]}`);

  // The search: only from a nested page, where a missing prefix shows.
  if (check.path.includes('/width/')) {
    for (const [query, expected] of [['sort', 'docs/visual_algorithms/sort/'], ['ring', 'docs/accessors/instance_creators/ring/'], ['reach', 'docs/accessors/queries/reach/']]) {
      await evaluate(`(() => { const f = document.querySelector('.sidebar .search');
        f.focus(); f.value = ${JSON.stringify(query)};
        f.dispatchEvent(new Event('input', { bubbles: true })); })()`);
      await sleep(800);
      // The entry that names the page must be the first hit: a summary match
      // outranking a title is a search bug, not a test to relax.
      const hit = await evaluate(`(() => { const a = document.querySelector('.sidebar .results a');
        return a && a.href; })()`);
      if (!hit) { fail(check.path, `search "${query}" returned nothing`); continue; }
      if (!hit.includes(`/${expected}`)) fail(check.path, `search "${query}" → ${hit}, expected …/${expected}`);
      await evaluate(`document.querySelector('.sidebar .results a').click()`);
      await sleep(1200);
      const landed = await evaluate('location.pathname');
      if (!landed.includes(`/${expected}`)) fail(check.path, `search "${query}" landed on ${landed}`);
      await send('Page.navigate', { url: `${base}/${check.path}` });
      await sleep(1500);
    }
  }
}

ws.close();
if (failures.length) {
  for (const f of failures) console.error(`[check] ${f}`);
  console.error(`[check] ${failures.length} failure(s) against ${base}`);
  process.exit(1);
}
console.log(`[check] ${checks.length} page(s), search clicks and sketch frames: all good against ${base}`);
// The browser and its socket keep the loop alive; the report is complete.
stop();
process.exit(0);
