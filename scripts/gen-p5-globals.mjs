#!/usr/bin/env node
// gen-p5-globals.mjs — regenerate data/p5_globals.yaml from p5's OWN type
// declarations. Stage 18.
//
//   node scripts/gen-p5-globals.mjs            # uses P5_VERSION below
//   node scripts/gen-p5-globals.mjs 2.4.0      # or pass a version
//
// WHY THIS EXISTS. Three hand-maintained p5 lists in a row shipped with holes:
// first `sin`, `strokeWeight`, `deltaTime`, `floor` and `max` — four of them
// cited BY NAME in the chapters' own References sections — then
// `drawingContext`. A hand list is not a robust artifact. This one is derived
// from p5's `types/global.d.ts`, whose header reads "auto-generated from JSDoc
// documentation": the same JSDoc that builds p5js.org/reference. The list
// therefore cannot drift from the reference it links to, and it is pinned to
// the p5 version the book actually serves.
//
// KEEP P5_VERSION IN SYNC with $defver in layouts/shortcodes/p5.html. Bump p5,
// rerun this, commit the result — that is the whole maintenance story.
//
// URL SHAPE, verified not assumed: functions and constants both live at
// https://p5js.org/reference/p5/<name>/ (checked against CENTER, which
// resolves). CLASSES do not follow that shape, so they are emitted for the
// record but NOT consumed by layouts/partials/provenance/maps.html. Wire them
// up only after checking what a class page's URL actually is.

import { execSync } from 'node:child_process';
import { readFileSync, writeFileSync, mkdtempSync, rmSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';

const P5_VERSION = process.argv[2] || '2.3.2';

// Chroma tags these as keywords (kr), never nf/nx, so an identifier pass can
// never reach them. p5's casting functions are the notable casualty.
const KEYWORDS = new Set(['int', 'float', 'boolean', 'byte', 'char', 'new',
  'delete', 'class', 'this', 'function', 'return']);

// p5 v2 exports its shader DSL into the global surface. None of it appears in
// a sketch fence, and much of it is far too generic to link safely.
const SHADER_PREFIX = /^(vec|ivec|bvec|mat|uniform|varying|shared|sampler)/;
const SHADER_FNS = new Set(['dFdx', 'dFdy', 'fwidth', 'fract', 'discard',
  'smoothstep', 'inversesqrt', 'faceforward', 'refract', 'mix', 'step', 'clamp',
  'normalize', 'cross', 'dot', 'equal', 'notEqual', 'roundEven', 'sign', 'trunc',
  'exp2', 'log2', 'fma', 'distance', 'texture', 'compute', 'code', 'instanceID',
  'reflect',
  'instanceIndex', 'finalColor', 'getColor', 'getFinalColor', 'normal', 'model',
  'worldInputs', 'objectInputs', 'pixelInputs', 'cameraInputs', 'getWorldInputs',
  'getObjectInputs', 'getPixelInputs', 'getCameraInputs', 'getTexture',
  'buildColorShader', 'buildComputeShader', 'buildFilterShader',
  'buildMaterialShader', 'buildNormalShader', 'buildStrokeShader',
  'baseColorShader', 'baseComputeShader', 'baseFilterShader',
  'baseMaterialShader', 'baseNormalShader', 'baseStrokeShader', 'imageShader',
  'strokeShader', 'combineColors', 'filterColor']);

// Real p5 globals, but too generic to link on a bare occurrence. The member
// pass already protects `event.code` and `arr.set(...)` by masking dotted
// forms; these are the ones that would still misfire when used bare as an
// ordinary local. Removing a name from here is a decision to be argued, not a
// default — check the coverage report first.
const TOO_GENERIC = new Set(['set', 'get', 'copy', 'remove', 'close', 'write',
  'index', 'select', 'selectAll', 'print', 'save', 'str', 'bool', 'hex',
  'nf', 'nfc', 'nfp', 'nfs', 'loading', 'shuffle', 'blend']);

const tmp = mkdtempSync(join(tmpdir(), 'p5globals-'));
try {
  console.error(`installing p5@${P5_VERSION} …`);
  execSync(`npm install p5@${P5_VERSION} --prefix "${tmp}" --no-save --silent`,
    { stdio: ['ignore', 'ignore', 'inherit'] });

  const dts = readFileSync(join(tmp, 'node_modules/p5/types/global.d.ts'), 'utf8');
  if (!/auto-generated from JSDoc/i.test(dts)) {
    console.error('⚠ global.d.ts no longer declares itself auto-generated — ' +
      'check that p5 has not changed how it publishes its global surface.');
  }

  const names = new Set();
  for (const m of dts.matchAll(/^\s*(?:declare\s+)?function\s+([A-Za-z_$][\w$]*)\s*[(<]/gm)) names.add(m[1]);
  for (const m of dts.matchAll(/^\s*(?:declare\s+)?(?:const|let|var)\s+([A-Za-z_$][\w$]*)\s*:/gm)) names.add(m[1]);
  if (names.size < 200) throw new Error(`only ${names.size} names parsed — the d.ts shape changed, fix the patterns`);

  const all = [...names]
    .filter(n => !KEYWORDS.has(n) && !SHADER_PREFIX.test(n) && !SHADER_FNS.has(n) && !TOO_GENERIC.has(n))
    .sort();
  const constants = all.filter(n => /^[A-Z][A-Z0-9_]*$/.test(n));
  const classes   = all.filter(n => /^[A-Z]/.test(n) && !/^[A-Z][A-Z0-9_]*$/.test(n));
  const functions = all.filter(n => /^[a-z_$]/.test(n));

  // Cheap regression guard: names that were missing from the hand-built lists
  // and prompted this script. If any of them vanish, the parse broke.
  for (const n of ['sin', 'drawingContext', 'strokeWeight', 'deltaTime', 'floor', 'max']) {
    if (!functions.includes(n)) throw new Error(`expected global ${n} missing — parse is wrong`);
  }

  const list = a => a.map(n => `  - ${n}`).join('\n');
  writeFileSync('data/p5_globals.yaml',
`# GENERATED FILE — do not hand-edit.
#     node scripts/gen-p5-globals.mjs
#
# Derived from p5's own types/global.d.ts ("auto-generated from JSDoc
# documentation"), i.e. the same source that builds p5js.org/reference — so this
# cannot drift from the reference it links to.
#
# functions + constants both resolve at https://p5js.org/reference/p5/<name>/
# (verified against CENTER). CLASSES do not follow that shape and are recorded
# here but NOT consumed by maps.html.
#
# Dropped at generation, each for a stated reason — see the script:
#   · int/float/boolean/byte/char  — Chroma tags them kr, unreachable
#   · the shader DSL (vec*, mat*, uniform*, mix, step, clamp, …)
#   · names too generic to link bare (set, get, index, print, save, …)
p5_version: "${P5_VERSION}"
generated: "${new Date().toISOString().slice(0, 10)}"
counts: { functions: ${functions.length}, constants: ${constants.length}, classes: ${classes.length} }

functions:
${list(functions)}

constants:
${list(constants)}

# Recorded, not consumed. See the URL-shape note above.
classes:
${list(classes)}
`);
  console.error(`data/p5_globals.yaml written — ${functions.length} functions, ${constants.length} constants, ${classes.length} classes (unused)`);
} finally {
  rmSync(tmp, { recursive: true, force: true });
}
