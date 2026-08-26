#!/usr/bin/env node
// provenance-report.mjs — what the provenance pass did NOT link, and which
// receivers appear in the docs.
//
//   hugo --gc --minify -d /tmp/post
//   node scripts/provenance-report.mjs /tmp/post
//
// This is a worklist for data/provenance.yaml, not a test. It never fails a
// build and has no opinion about what SHOULD be linked — it only reports what
// is there, ranked, so a decision can be made on evidence.
//
// TWO REPORTS:
//
//   UNLINKED   identifiers inside code fences that no tier claimed, by
//              frequency. A p5 or quadrille name near the top is a tier gap.
//              A sketch-local (board, cover, piece) is expected and fine.
//
//   RECEIVERS  names appearing immediately before a dot, by frequency. This is
//              the one that matters most: member position defaults to the
//              quadrille, so ANY p5.Graphics variable not listed in
//              p5.receivers has its calls silently linked to the wrong tier.
//              `pg` and `graphics` were both found that way — by a reader
//              noticing, which is exactly what this report replaces.
//
// WHY NO LIBRARY TYPES. An earlier draft also cross-checked the library's
// dist/quadrille.d.ts against the api pages, reporting undocumented symbols
// and orphan pages. Dropped, for three reasons: (a) once api pages are
// generated from JSDoc, "public symbol with no page" is impossible by
// construction, so the check has a known expiry; (b) it required the library
// checked out adjacent AND freshly built, a precondition that rots silently
// and reports a clean bill from a stale dist/; (c) createQuadrille and
// drawQuadrille live in addon.js, and the draw-param pages document params
// rather than symbols, so quieting the report needed a hand-maintained
// allowlist — inside a script meant to remove hand-maintained lists.
// For linking purposes the UNLINKED report already carries the signal: a
// quadrille symbol used in a fence with no page shows up here.

import { readFileSync, readdirSync, statSync, existsSync } from 'node:fs';
import { join } from 'node:path';

const ROOT = process.argv[2] ?? 'public';
if (!existsSync(ROOT)) {
  console.error(`no ${ROOT} — run hugo first, or pass the output directory`);
  process.exit(2);
}

const walk = (dir, out = []) => {
  for (const e of readdirSync(dir)) {
    const p = join(dir, e);
    if (statSync(p).isDirectory()) walk(p, out);
    else if (p.endsWith('.html')) out.push(p);
  }
  return out;
};

// Only look inside JS code blocks. The pass annotates ```js and ```javascript
// and nothing else, so counting identifiers from ```html / ```css / ```bash
// fences reports "unlinked" tokens that were never in scope — the first run of
// this script listed `text` and `fill` that way while every other p5 drawing
// function linked fine, which is what exposed the flaw.
//
// An identifier the pass linked is wrapped in <a class="pv-*">, so a bare nf/nx
// span inside a JS block is by definition something no tier claimed. Attribute
// quoting differs between `hugo` and `hugo --minify`, hence the optional quotes.
const JSBLOCK = /<code[^>]*data-lang=(?:"?)(?:js|javascript)(?:"?)[^>]*>([\s\S]*?)<\/code>/g;
const IDENT = /<span class=(?:"?)(?:nf|nx)(?:"?)>([A-Za-z_$][\w$]*)<\/span>/g;
const RECV = /<span class=(?:"?)(?:nf|nx)(?:"?)>([A-Za-z_$][\w$]*)(?:<\/a>)?<\/span><span class=(?:"?)p(?:"?)>\.<\/span>/g;

const unlinked = new Map();
const receivers = new Map();
const bump = (m, k) => m.set(k, (m.get(k) ?? 0) + 1);

let files = 0, blocks = 0;
for (const f of walk(ROOT)) {
  const html = readFileSync(f, 'utf8');
  if (!html.includes('chroma')) continue;
  let touched = false;
  for (const b of html.matchAll(JSBLOCK)) {
    blocks++; touched = true;
    for (const m of b[1].matchAll(IDENT)) bump(unlinked, m[1]);
    for (const m of b[1].matchAll(RECV)) bump(receivers, m[1]);
  }
  if (touched) files++;
}

const table = (m, n = 40) => [...m.entries()]
  .sort((a, b) => b[1] - a[1] || a[0].localeCompare(b[0]))
  .slice(0, n)
  .map(([k, v]) => `  ${String(v).padStart(5)}  ${k}`)
  .join('\n');

console.log(`scanned ${blocks} js code blocks across ${files} pages in ${ROOT}\n`);
console.log(`UNLINKED — identifiers no tier claimed (${unlinked.size} distinct)`);
console.log('  a p5 or quadrille name here is a tier gap; sketch-locals are expected\n');
console.log(table(unlinked));
console.log(`\nRECEIVERS — names before a dot (${receivers.size} distinct)`);
console.log('  any p5.Graphics variable here MUST be in p5.receivers, or its calls');
console.log('  link to the quadrille instead of p5\n');
console.log(table(receivers, 30));
