#!/usr/bin/env node
// check-fence-names.mjs — book identifiers that shadow a linked vocabulary.
// Stage 19. See STAGE_19_NAMING.md.
//
//   node scripts/check-fence-names.mjs
//
// WHAT THIS IS FOR. The provenance pass links three vocabularies: quadrille api
// symbols, p5 globals, and a few JS globals. When the BOOK declares an
// identifier with one of those names, the pass links it — correctly, by its own
// rules, and wrongly by any reader's. `Swapper.swap` linked to the quadrille
// mutator; `const line` and `const roll` went to p5. Every one was found by a
// human noticing. This replaces the noticing.
//
// ⚠ WORKLIST, NOT A GATE. Always exits 0. The declaration scanner is regex-based
// and therefore approximate; a false positive costs one line of output, and
// gating on an approximate scanner would cost trust.
//
// ── WHY IT SCANS TWO KINDS OF CODE, AND WHY THAT MATTERS ─────────────────────
//   ```js fences        — heroes and figurines. Chroma highlights these, so the
//                         provenance pass sees them and a collision MISLINKS.
//   {{< p5 >}} bodies   — inline sketches. These go into an iframe srcdoc and
//                         never reach Chroma, so a collision here is invisible
//                         to every grep against public/ — and still real code
//                         that a reader runs. Found 2026-08-06, when Play's
//                         `width - 4` produced no anchor and the absence was
//                         briefly mistaken for a linker bug.
//   static/gbg/*.js     — the sketches the shortcodes load. Must stay in sync
//                         with the fence that quotes them.
//
// ── WHY NO YAML LIBRARY, AND WHAT PROTECTS THE PARSE ─────────────────────────
// This repo is Hugo/Go and has no package.json; adding one for a lint would be
// a new subsystem, which is the shape of thing Stage 18 kept rejecting. So the
// two data files are read by a small indentation-aware list reader instead.
// A hand parser that silently reads nothing reports a clean bill — failure mode
// (b) that withdrew check-api-coverage.mjs — so it carries the same guard rails
// gen-p5-globals.mjs uses: minimum sizes, plus assertions on names that MUST be
// present. If the data files change shape, this throws instead of lying.
//
// ── THE ONLY ALLOWLIST IS quadrille.exclude, AND IT IS READ, NOT WRITTEN ─────
// `row`, `col`, `filter`, `sort`, `search`, `shift` are never linked in any
// tier, so shadowing them is harmless and is not reported. That list lives in
// data/provenance.yaml, where the decision was made. This script has no
// allowlist of its own — the thing that killed the previous coverage script.

import { readFileSync, readdirSync, statSync, existsSync } from 'node:fs';
import { join, relative } from 'node:path';

const ROOT = process.argv[2] ?? '.';
const P5 = join(ROOT, 'data/p5_globals.yaml');
const PROV = join(ROOT, 'data/provenance.yaml');
const CONTENT = join(ROOT, 'content');
const SKETCHES = [];  // no book sketch dirs on this reference host

for (const f of [P5, PROV]) {
  if (!existsSync(f)) {
    console.error(`missing ${f} — run from the site root, or pass it as argv[2]`);
    process.exit(2);
  }
}

// ── tiny YAML readers ───────────────────────────────────────────────────────
// Deliberately not a YAML parser. Two shapes only: a key whose value is a `- `
// list, and a key whose value is a block of `name: value` pairs. Comments and
// blank lines are skipped; a line at or left of the key's indent ends the block.
const lines = src => src.split('\n');

const block = (src, key) => {
  const all = lines(src);
  const at = all.findIndex(l => new RegExp(`^(\\s*)${key}:\\s*(#.*)?$`).test(l));
  if (at < 0) return [];
  const indent = all[at].match(/^(\s*)/)[1].length;
  const out = [];
  for (let i = at + 1; i < all.length; i++) {
    const l = all[i];
    if (!l.trim() || /^\s*#/.test(l)) continue;
    if (l.match(/^(\s*)/)[1].length <= indent) break;
    out.push(l);
  }
  return out;
};

const list = (src, key) => block(src, key)
  .map(l => l.match(/^\s*-\s+(\S+)/))
  .filter(Boolean)
  .map(m => m[1]);

const mapKeys = (src, key) => block(src, key)
  .map(l => l.match(/^\s*([A-Za-z_$][\w$]*)\s*:/))
  .filter(Boolean)
  .map(m => m[1]);

const p5src = readFileSync(P5, 'utf8');
const provsrc = readFileSync(PROV, 'utf8');

const p5Functions = list(p5src, 'functions');
const p5Constants = list(p5src, 'constants');
const receivers = list(provsrc, 'receivers');
const excluded = new Set(list(provsrc, 'exclude'));
const extras = mapKeys(provsrc, 'extra');
const jsGlobals = list(provsrc, 'Global_Objects');

// ── guard rails: throw rather than report a clean bill from a broken parse ───
const must = (cond, msg) => { if (!cond) throw new Error(`parse guard: ${msg}`); };
must(p5Functions.length > 200, `only ${p5Functions.length} p5 functions parsed`);
must(p5Constants.length > 50, `only ${p5Constants.length} p5 constants parsed`);
must(['sin', 'fill', 'line', 'roll', 'width'].every(n => p5Functions.includes(n)),
  'a known p5 global is missing — the functions list did not parse');
must(p5Constants.includes('CENTER'), 'CENTER missing — constants did not parse');
must(['filter', 'row', 'col'].every(n => excluded.has(n)),
  'quadrille.exclude did not parse — every collision would be reported');
must(extras.includes('Quadrille'), 'quadrille.extra did not parse');
must(receivers.includes('pg'), 'p5.receivers did not parse');

// ── tier 3: api page symbols, derived exactly as maps.html derives them ─────
// front matter `symbol:` first, else title up to the first "(", trimmed,
// `Quadrille.` stripped; then filtered to bare-identifier shape, which is what
// drops the prose-titled and comma-titled pages on their own.
const walk = (dir, ext, out = []) => {
  if (!existsSync(dir)) return out;
  for (const e of readdirSync(dir)) {
    const p = join(dir, e);
    if (statSync(p).isDirectory()) walk(p, ext, out);
    else if (p.endsWith(ext)) out.push(p);
  }
  return out;
};

const apiSymbols = new Set();
for (const f of walk(join(CONTENT, 'docs'), '.md')) {
  const rel = relative(join(CONTENT, 'docs'), f)
    .replace(/\.md$/, '').replace(/\/_index$/, '');
  if (rel.split('/').length < 2) continue;          // grouping indexes
  const fm = readFileSync(f, 'utf8').split('---')[1] ?? '';
  const sym = (fm.match(/^symbol:\s*(.+)$/m)?.[1]
    ?? fm.match(/^title:\s*(.+)$/m)?.[1] ?? '')
    .trim().replace(/^["']|["']$/g, '').split('(')[0].trim()
    .replace(/^Quadrille\./, '');
  if (/^[A-Za-z_$][\w$]*$/.test(sym)) apiSymbols.add(sym);
}
must(apiSymbols.size > 40, `only ${apiSymbols.size} api symbols derived`);
must(apiSymbols.has('maze') && apiSymbols.has('swap'),
  'a known api symbol is missing — the title derivation broke');

// ── the vocabularies a book name must avoid ─────────────────────────────────
const vocab = new Map();                 // name -> tier label
const add = (n, tier) => {
  if (excluded.has(n)) return;           // never linked, so never a collision
  vocab.set(n, vocab.has(n) ? `${vocab.get(n)}+${tier}` : tier);
};
for (const n of apiSymbols) add(n, 'quadrille');
for (const n of extras) add(n, 'quadrille');
for (const n of p5Functions) add(n, 'p5');
for (const n of p5Constants) add(n, 'p5');
for (const n of jsGlobals) add(n, 'js');
const recvSet = new Set(receivers);

// ── TWO CATEGORIES THAT LOOK LIKE SHADOWS AND ARE NOT ──────────────────────
// Added after the first run, 2026-08-06, which reported 37 names of which the
// top eight were `setup`, `draw`, `keyPressed`, `mousePressed`, `mouseClicked`,
// `mouseMoved`, `mouseDragged`, `mouseReleased` — about 950 of ~1050 hits.
// None of those is a collision. The first cut treated "declares a name in the
// vocabulary" as always wrong; it is wrong only when the declaration MEANS
// something other than what the vocabulary means.
//
// 1. HOOKS. p5 calls these back. `function setup()` IS the contract, and the
//    link the pass emits on it is CORRECT. Suppressed only when the
//    declaration is a top-level `function` — `let mouseWheel = …` is still a
//    real shadow and still reported. Filtered against the generated p5 list, so
//    a hook p5 removes (v1's `preload`) drops out on its own rather than
//    warning forever.
//
// 2. CONTRACT PARAMS. The display-function params bag. Writing
//    `function bubble({ graphics, value, cellLength })` is destructuring a bag
//    whose key names the LIBRARY chose — exactly the argument N2 makes for
//    `row`/`col`, and the same conclusion: not renameable, so not a finding.
//    Suppressed only for `destructure` and `param` kinds; `let cellLength = …`
//    is a genuine shadow and still reported.
//
// ⚠ Both lists are facts about the LIBRARIES' contracts, not decisions about
// this book — which is why they live here and not in data/provenance.yaml,
// where the pass would read data it does not consume. The book's own decisions
// stay in `quadrille.exclude`, which this script reads and never writes.
const hooks = new Set(['setup', 'draw', 'windowResized',
  'mousePressed', 'mouseReleased', 'mouseClicked', 'mouseMoved', 'mouseDragged',
  'mouseWheel', 'doubleClicked',
  'keyPressed', 'keyReleased', 'keyTyped',
  'touchStarted', 'touchMoved', 'touchEnded',
  'deviceMoved', 'deviceTurned', 'deviceShaken'].filter(n => p5Functions.includes(n)));
must(hooks.size >= 10, `only ${hooks.size} p5 hooks survived the filter`);

const contractParams = new Set(['graphics', 'value', 'row', 'col', 'width',
  'height', 'cellLength', 'outline', 'outlineWeight', 'textColor', 'textZoom',
  'textFont', 'origin', 'options', 'quadrille',
  'colorDisplay', 'stringDisplay', 'numberDisplay', 'imageDisplay',
  'arrayDisplay', 'objectDisplay', 'functionDisplay', 'tileDisplay']);

const suppressed = (name, kind) =>
  (hooks.has(name) && kind === 'function') ? 'hook'
    : (contractParams.has(name) && (kind === 'destructure' || kind === 'param')) ? 'contract'
      : null;

// ── code extraction ─────────────────────────────────────────────────────────
// Returns [{ code, line }] — `line` is the 1-based line the snippet starts on,
// so a hit can be reported at its real position in the source file.
const FENCE = /^```(js|javascript)\s*$/;
const P5OPEN = /^\s*\{\{<\s*p5(\s[^>]*)?>\}\}\s*$/;
const P5CLOSE = /^\s*\{\{<\s*\/p5\s*>\}\}\s*$/;

function snippets(src) {
  const all = lines(src);
  const out = [];
  let start = -1, closer = null;
  for (let i = 0; i < all.length; i++) {
    if (start < 0) {
      if (FENCE.test(all[i])) { start = i + 1; closer = l => /^```\s*$/.test(l); }
      else if (P5OPEN.test(all[i]) && !all[i].includes('/>}}')) {
        start = i + 1; closer = l => P5CLOSE.test(l);
      }
    } else if (closer(all[i])) {
      out.push({ code: all.slice(start, i).join('\n'), line: start + 1 });
      start = -1;
    }
  }
  return out;
}

// Comments first, then strings. Order matters: an apostrophe inside a comment
// would otherwise open a string and swallow the rest of the file.
// ⚠ Known blind spots, stated rather than hidden: regex literals, escaped
// quotes inside strings, and template-literal interpolation. All produce noise
// at worst, which is why this is a worklist.
const strip = s => s
  .replace(/\/\*[\s\S]*?\*\//g, m => m.replace(/[^\n]/g, ' '))
  .replace(/\/\/[^\n]*/g, m => ' '.repeat(m.length))
  .replace(/(['"`])(?:\\.|(?!\1)[^\\\n])*\1/g, m => ' '.repeat(m.length));

// ── declaration sites ───────────────────────────────────────────────────────
// ⚠ WHAT THIS DOES NOT SEE: arrow-function parameters, object-literal keys,
// catch bindings, and getters/setters. Add a pattern when a real miss shows up,
// not by guessing ahead — the same policy p5.receivers is under.
const NOT_A_METHOD = new Set(['if', 'for', 'while', 'switch', 'catch', 'function',
  'return', 'else', 'do', 'try', 'class', 'constructor', 'super']);

function declarations(code) {
  const src = strip(code);
  const hits = [];                                   // { name, offset, kind }
  const push = (name, offset, kind) => hits.push({ name, offset, kind });

  for (const m of src.matchAll(/\b(?:const|let|var)\s+([A-Za-z_$][\w$]*)/g))
    push(m[1], m.index, 'let');
  // `const a = 1, b = 2` — the tail bindings
  for (const m of src.matchAll(/\b(?:const|let|var)\s+[^;=\n]*?,\s*([A-Za-z_$][\w$]*)\s*[=;,\n]/g))
    push(m[1], m.index, 'let');
  // `const [a, b] = …` and `const { a, b } = …`
  for (const m of src.matchAll(/\b(?:const|let|var)\s*[[{]([^\]}]*)[\]}]/g))
    for (const n of m[1].split(',').map(s => s.trim().split(':').pop().trim()))
      if (/^[A-Za-z_$][\w$]*$/.test(n)) push(n, m.index, 'destructure');
  for (const m of src.matchAll(/\bfunction\s+([A-Za-z_$][\w$]*)\s*\(([^)]*)\)/g)) {
    push(m[1], m.index, 'function');
    for (const n of m[2].split(',').map(s => s.trim()))
      if (/^[A-Za-z_$][\w$]*$/.test(n)) push(n, m.index, 'param');
  }
  for (const m of src.matchAll(/\bclass\s+([A-Za-z_$][\w$]*)/g))
    push(m[1], m.index, 'class');
  for (const m of src.matchAll(/\bthis\.([A-Za-z_$][\w$]*)\s*=[^=]/g))
    push(m[1], m.index, 'field');
  // class-body method: an identifier at the head of an indented line, followed
  // by a parameter list and an opening brace. This is the pattern that catches
  // `swap(other) {`.
  for (const m of src.matchAll(/^[ \t]{2,}([A-Za-z_$][\w$]*)\s*\([^)]*\)\s*\{/gm))
    if (!NOT_A_METHOD.has(m[1])) push(m[1], m.index, 'method');

  return hits;
}

// ── scan ────────────────────────────────────────────────────────────────────
const found = new Map();                 // name -> { tier, sites[] }
const muted = { hook: 0, contract: 0 };
const record = (name, tier, kind, file, line) => {
  if (!found.has(name)) found.set(name, { tier, sites: [] });
  found.get(name).sites.push({ file, line, kind });
};

function scan(file, code, baseLine, shown) {
  for (const d of declarations(code)) {
    const line = baseLine + code.slice(0, d.offset).split('\n').length - 1;
    const mute = suppressed(d.name, d.kind);
    if (mute) { muted[mute]++; continue; }
    if (vocab.has(d.name)) record(d.name, vocab.get(d.name), d.kind, shown, line);
    else if (recvSet.has(d.name)) record(d.name, 'RECEIVER', d.kind, shown, line);
  }
}

let files = 0, blocks = 0;
for (const f of walk(CONTENT, '.md')) {
  const shown = relative(ROOT, f);
  const src = readFileSync(f, 'utf8');
  let touched = false;
  for (const s of snippets(src)) { blocks++; touched = true; scan(f, s.code, s.line, shown); }
  if (touched) files++;
}
for (const dir of SKETCHES) {
  for (const f of walk(dir, '.js')) {
    files++; blocks++;
    scan(f, readFileSync(f, 'utf8'), 1, relative(ROOT, f));
  }
}

// ── report ──────────────────────────────────────────────────────────────────
// Host delta vs the hextra donor: this reference site has no book chapters —
// the whole content/docs tree is the api. static/gbg and static/sketches do
// not exist here; walk() on a missing dir is a no-op, so SKETCHES stays empty.
const AREAS = [
  ['content/docs', 'api']
];
const areaOf = p => (AREAS.find(([pre]) => p.startsWith(pre)) ?? [, 'other'])[1];

const rank = [...found.entries()]
  .sort((a, b) => b[1].sites.length - a[1].sites.length || a[0].localeCompare(b[0]));

console.log(`scanned ${blocks} code blocks across ${files} files`);
console.log(`vocabularies: ${apiSymbols.size + extras.length} quadrille · ` +
  `${p5Functions.length + p5Constants.length} p5 · ${jsGlobals.length} js · ` +
  `${excluded.size} excluded (never reported)`);
console.log(`not reported: ${muted.hook} p5 hook implementations · ` +
  `${muted.contract} display-contract destructurings — both are the contract, ` +
  `not a collision\n`);

const shadows = rank.filter(([, e]) => e.tier !== 'RECEIVER');
const recvHits = rank.filter(([, e]) => e.tier === 'RECEIVER');

if (!shadows.length) {
  console.log('SHADOWS — none. Every declared name is disjoint from all three tiers.\n');
} else {
  console.log(`SHADOWS — declared names that a tier will link (${shadows.length})`);
  console.log('  rename these, or argue the exception into quadrille.exclude\n');
  for (const [name, e] of shadows) {
    console.log(`  ${String(e.sites.length).padStart(4)}  ${name}  [${e.tier}]`);
    for (const s of e.sites.slice(0, 5))
      console.log(`          ${s.file}:${s.line}  (${s.kind})`);
    if (e.sites.length > 5) console.log(`          … ${e.sites.length - 5} more`);
  }
  console.log();

  // BY AREA answers the question a ranked list cannot: is the TEACHING PATH
  // clean? Foundations and Mechanics are the chapters a reader walks in order,
  // so a shadow there costs more than one in an api example.
  const byArea = new Map();
  for (const [name, e] of shadows) {
    for (const s of e.sites) {
      const a = areaOf(s.file);
      if (!byArea.has(a)) byArea.set(a, { names: new Set(), sites: 0 });
      byArea.get(a).names.add(name);
      byArea.get(a).sites++;
    }
  }
  console.log('BY AREA — where the shadows are');
  for (const [a, v] of [...byArea.entries()].sort((x, y) => y[1].sites - x[1].sites))
    console.log(`  ${String(v.sites).padStart(4)} sites  ${String(v.names.size).padStart(3)} names  ${a}`);
  for (const [, label] of AREAS)
    if (!byArea.has(label)) console.log(`     0 sites    0 names  ${label}  ✓`);
  console.log();
}

if (recvHits.length) {
  console.log(`RECEIVER SHADOWS — declared names listed in p5.receivers (${recvHits.length})`);
  console.log('  each needs one eyeball: FINE if the variable really is a');
  console.log('  p5.Graphics, a bug waiting if it is a quadrille — its dotted');
  console.log('  calls would link to p5. `layer` was exactly the second case.\n');
  for (const [name, e] of recvHits) {
    console.log(`  ${String(e.sites.length).padStart(4)}  ${name}`);
    for (const s of e.sites.slice(0, 5)) console.log(`          ${s.file}:${s.line}`);
    if (e.sites.length > 5) console.log(`          … ${e.sites.length - 5} more`);
  }
  console.log();
}
