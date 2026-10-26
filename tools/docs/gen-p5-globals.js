#!/usr/bin/env node
/**
 * @file Generates `data/p5-globals.json` — the p5.js names a sketch can call —
 * from p5's own type declarations.
 * @module tools/docs/gen-p5-globals
 * @license GPL-3.0-only
 *
 *     npm run docs:globals
 *
 * `node_modules/p5/types/global.d.ts` says in its own header that it is
 * "auto-generated from JSDoc documentation" — the same JSDoc that builds
 * p5js.org/reference — so this list cannot drift from the reference it points
 * at, and it is pinned to the version the examples load (`config.p5.version`).
 * A hand list is not a robust artifact: three in a row shipped with holes.
 *
 * Regenerate at a p5 bump, commit the result. The script refuses to run when
 * the installed p5 is not the pinned one, because the site would then document
 * a runtime it does not serve.
 *
 * Dropped at generation, each for a stated reason:
 *   · `int float boolean byte char` — p5's casting functions, spelled like
 *     language keywords; a sketch can call them and the reference documents
 *     them, so they are KEPT, but flagged `cast` so a page can say so.
 *   · the shader DSL (`vec*`, `mat*`, `uniform*`, `mix`, `step`, `texture`…):
 *     it belongs to `buildShader`, appears in no example, and several names
 *     (`texture`, `model`, `reflect`) collide with the ones that do.
 *   · `p5` itself and the block-listener members.
 */

import { readFileSync, writeFileSync, mkdirSync } from 'node:fs';
import { dirname, join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

import { p5 as pin, paths } from './config.js';

const root = resolve(dirname(fileURLToPath(import.meta.url)), '..', '..');
const at   = (p) => join(root, p);

/** The shader DSL, and the names it shares with the drawing API. */
const SHADER = /^(?:vec|ivec|bvec|mat|uniform|varying|shared|sampler)/;
const SHADER_FNS = new Set([
  'mix', 'step', 'smoothstep', 'clamp', 'fract', 'distance', 'dot', 'cross',
  'normalize', 'reflect', 'refract', 'faceforward', 'inversesqrt', 'dFdx', 'dFdy',
  'fwidth', 'discard', 'exp2', 'log2', 'roundEven', 'sign', 'trunc', 'fma',
  'texture', 'compute', 'code', 'instanceID', 'instanceIndex', 'finalColor',
  'getColor', 'getFinalColor', 'normal', 'model', 'worldInputs', 'objectInputs',
  'pixelInputs', 'cameraInputs', 'getWorldInputs', 'getObjectInputs',
  'getPixelInputs', 'getCameraInputs', 'getTexture', 'active', 'buildColorShader',
  'buildComputeShader', 'buildFilterShader', 'buildMaterialShader',
  'buildNormalShader', 'buildStrokeShader', 'baseColorShader',
  'baseComputeShader', 'baseFilterShader', 'baseMaterialShader',
  'baseNormalShader', 'baseStrokeShader', 'imageShader', 'strokeShader',
  'combineColors', 'filterColor',
]);

/** Names a sketch calls, not values it reads. */
const CASTS = new Set(['int', 'float', 'boolean', 'byte', 'char']);

const installed = JSON.parse(readFileSync(at('node_modules/p5/package.json'), 'utf8')).version;
if (installed !== pin.version) {
  console.error(`[globals] node_modules/p5 is ${installed}, config pins ${pin.version}.`);
  console.error('[globals] install the pinned p5, or advance the pin deliberately first.');
  process.exit(1);
}

const dts = readFileSync(at('node_modules/p5/types/global.d.ts'), 'utf8');
const lines = dts.split('\n');

const functions = [], constants = [], values = [], classes = [];
const seen = new Set();

for (const line of lines) {
  // `  createCanvas(…)` inside the global interface — a call.
  const fn = /^ {2}([A-Za-z_$][\w$]*)\s*\(/.exec(line);
  if (fn) {
    const name = fn[1];
    if (!seen.has(name) && !SHADER.test(name) && !SHADER_FNS.has(name) && name !== 'p5') {
      seen.add(name);
      functions.push(name);
    }
    continue;
  }
  // `CENTER: typeof P5.CENTER;` at column 0 — a constant; `mouseX: typeof
  // P5.mouseX;` in the same block — a value the sketch reads, which is not a
  // function and has no page shape of its own.
  const global = /^([A-Za-z_$][\w$]*): typeof P5\.\1;/.exec(line);
  if (global && !seen.has(global[1])) {
    seen.add(global[1]);
    (/^[A-Z][A-Z0-9_]*$/.test(global[1]) ? constants : values).push(global[1]);
  }
}

// Classes live in `declare namespace p5` (p5.d.ts), each on a page of its own.
for (const line of readFileSync(at('node_modules/p5/types/p5.d.ts'), 'utf8').split('\n')) {
  const cls = /^ {2}class ([A-Z][\w$]*)\s*\{/.exec(line);
  if (cls && !seen.has(cls[1])) { seen.add(`p5.${cls[1]}`); classes.push(cls[1]); }
}

for (const list of [functions, constants, values, classes]) list.sort();

const counts = {
  functions: functions.length, constants: constants.length,
  values: values.length, classes: classes.length,
};
writeFileSync(at('tools/docs/data/p5-globals.json'), `${JSON.stringify({
  pin: pin.version, generated_from: 'node_modules/p5/types/global.d.ts', counts,
  functions, constants, values, classes, casts: [...CASTS],
}, null, 2)}\n`);
mkdirSync(at('tools/docs/data'), { recursive: true });

console.log(`[globals] p5 ${pin.version}: ${counts.functions} function(s), ` +
            `${counts.constants} constant(s), ${counts.values} value(s), ${counts.classes} class(es) ` +
            '→ tools/docs/data/p5-globals.json');
