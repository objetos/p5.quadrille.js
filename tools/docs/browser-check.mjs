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
 * `CHROME` names the binary (default `chromium`). Exit 1 on any failure.
 */

import { spawn } from 'node:child_process';
import { mkdtempSync, rmSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';

const base = (process.argv[2] ?? 'http://127.0.0.1:8000/').replace(/\/$/, '');
const BIN = process.env.CHROME ?? 'chromium';
const PORT = 9222;

/** Pages that exercise each shape: a sketch, a listing, a folder page, search. */
const checks = [
  { path: 'docs/properties/read_write/width/', sketch: true },
  { path: 'docs/p5_functions/create_quadrille/create_quadrille_FEN/', sketch: true },
  { path: 'docs/algebra/merge/', sketch: true, footnotes: true },
  { path: 'docs/mutators/fill/', folder: true },
];

const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

const profile = mkdtempSync(join(tmpdir(), 'p5q-browser-'));
const browser = spawn(BIN, [
  '--headless=new', '--no-sandbox', '--disable-gpu', '--hide-scrollbars',
  `--remote-debugging-port=${PORT}`, `--user-data-dir=${profile}`,
  '--window-size=1400,1600', 'about:blank',
], { stdio: 'ignore' });

const stop = () => { try { browser.kill('SIGTERM'); } catch (_) {} rmSync(profile, { recursive: true, force: true }); };
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
  }
  if (check.folder) {
    const kids = await evaluate(`document.querySelectorAll('.children h3').length`);
    if (!kids) fail(check.path, 'no child anchors on a directory page');
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
