/**
 * @file The site's own analysis, as a plugin: what the examples call, resolved to
 * the three tiers this site documents — this library, p5.js and JavaScript — the
 * two reference pages' tables, and the block at the foot of every page that
 * carries a sketch.
 * @module tools/docs/plugins/host
 * @license GPL-3.0-only
 *
 * The package renders the pages; this file supplies the three blocks a page
 * cannot compute for itself. A page's prose asks for one with a directive —
 * `<!-- uses: host -->` or `<!-- uses: quadrille -->` — and every page that
 * carries a fence gets its own block at its foot. The strict half is the same
 * data: a name an example provably calls and this file does not gloss fails the
 * build, so the two reference pages cannot lag the snippets; what the analysis
 * cannot prove is a note, so a mis-parse is visible without being fatal.
 *
 * Derivation, not inspection: every name here is one a fence provably calls or
 * reads, and a name that cannot be proved is left out rather than guessed.
 * Three rules keep it honest:
 *
 * 1. **A declared name is local.** `let fill`, a parameter, a destructured key, a
 *    catch binding — all shadow the ambient surface inside their sketch.
 * 2. **Bare reads and calls resolve p5-first.** `background()`, `fill()`,
 *    `sort()`, `width` are p5's before they are this library's; the library is
 *    reached only through `Quadrille.name`, the two addon calls, or a member call
 *    on a receiver proved to be a quadrille.
 * 3. **A member call needs a proved receiver.** `createQuadrille(…)` gives a
 *    quadrille, `createP(…)` a `p5.Element`, `= []` an array.
 *
 * The p5 name list is generated from p5's own `types/global.d.ts` — the JSDoc
 * that also builds p5js.org/reference — at the pinned version, on every build:
 * the list cannot drift from the reference it links to, and a pin that moves
 * regenerates it. A hand list is not a robust artifact; three in a row shipped
 * with holes.
 */

import { readFileSync } from 'node:fs';
import { dirname, join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = resolve(dirname(fileURLToPath(import.meta.url)), '..', '..', '..');

// ── The addresses the carrier writes ────────────────────────────────────────
// A block spliced into a page writes the carrier's own relative addresses: the
// page's prefix to the site root, the page of a documented name, and the ids the
// two kinds of row carry. The build resolves every link on disk and the book
// resolves every deep URL, which is what proves these three rules.

/** The prefix from a page to the site root: `<docs>/<path>/index.html`. */
const at = (dir, path, page) => `${'../'.repeat(page.path.split('/').length + 1)}${dir}/${path}/`;

/** `memory2D` → `memory_2d`: the address a documented name's page is written at. */
const snake = (name) => String(name)
  .replace(/([a-z0-9])([A-Z])/g, '$1_$2')
  .replace(/([A-Z]+)([A-Z][a-z])/g, '$1_$2')
  .toLowerCase();

/** A heading's id, and a term row's id — the anchor a link lands on. */
const slug = (title) => String(title).toLowerCase().replace(/[^\w\- ]+/g, '').replace(/ /g, '-');

/** The tier this library's own names live in: the directive that renders them, and the keys they count under. */
const SELF = 'quadrille';

const esc = (s) => String(s).replace(/[&<>"']/g, (c) => (
  { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]
));

// ── The p5 name list, from p5's own declarations ────────────────────────────

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

/**
 * The names a sketch can call or read, from the installed p5's own type
 * declarations. The installed version must be the pinned one, because the site
 * would otherwise document a runtime it does not serve.
 * @param {{ version: string }} pin
 * @returns {{ functions: Set<string>, values: Set<string>, constants: Set<string> }}
 */
function p5Names(pin) {
  const installed = JSON.parse(readFileSync(join(ROOT, 'node_modules/p5/package.json'), 'utf8')).version;
  if (installed !== pin.version) {
    throw new Error(`node_modules/p5 is ${installed}, the declaration pins ${pin.version} — ` +
                    'install the pinned p5, or advance the pin deliberately first');
  }
  const functions = new Set(), constants = new Set(), values = new Set();
  const seen = new Set();
  for (const line of readFileSync(join(ROOT, 'node_modules/p5/types/global.d.ts'), 'utf8').split('\n')) {
    // `  createCanvas(…)` inside the global interface — a call.
    const fn = /^ {2}([A-Za-z_$][\w$]*)\s*\(/.exec(line);
    if (fn) {
      const name = fn[1];
      if (!seen.has(name) && !SHADER.test(name) && !SHADER_FNS.has(name) && name !== 'p5') {
        seen.add(name);
        functions.add(name);
      }
      continue;
    }
    // `CENTER: typeof P5.CENTER;` at column 0 — a constant; `mouseX: …` a value
    // the sketch reads, which is not a function and has no page shape of its own.
    const global = /^([A-Za-z_$][\w$]*): typeof P5\.\1;/.exec(line);
    if (global && !seen.has(global[1])) {
      seen.add(global[1]);
      (/^[A-Z][A-Z0-9_]*$/.test(global[1]) ? constants : values).add(global[1]);
    }
  }
  return { functions, values, constants };
}

// ── The tier rules ──────────────────────────────────────────────────────────

/**
 * The rules. `usesOf` reads these and nothing else: which factory hands back
 * which kind of object, which member names each kind answers to, and which names
 * are never evidence.
 */
const rules = {
  receivers: {
    quadrille: ['createQuadrille'],
    element: ['createP', 'createDiv', 'createSpan', 'createSlider', 'createCheckbox',
      'createSelect', 'createRadio', 'createColorPicker', 'createButton', 'createImg',
      'createVideo', 'createAudio', 'createCapture', 'createFileInput', 'createA'],
    array: ['loadStrings', 'split'],
  },
  members: {
    element: ['html', 'style', 'position', 'value', 'checked', 'changed', 'selected',
      'option', 'hide', 'show', 'size', 'attribute', 'remove', 'elt', 'id', 'class',
      'parent', 'child', 'addClass', 'removeClass', 'center', 'disable', 'enable',
      'input', 'mousePressed', 'mouseReleased', 'mouseOver', 'mouseOut'],
    array: ['map', 'filter', 'forEach', 'reduce', 'push', 'pop', 'shift', 'unshift',
      'slice', 'splice', 'join', 'concat', 'includes', 'indexOf', 'find', 'findIndex',
      'some', 'every', 'sort', 'reverse', 'fill', 'flat', 'flatMap', 'at', 'length'],
  },
  arrayLiteral: true,
  /** JavaScript namespaces whose members are documented one page each. */
  namespaces: ['Math', 'JSON', 'Object', 'console', 'Number', 'String', 'Array',
    'Date', 'Promise', 'Symbol', 'Map', 'Set'],
  /** JavaScript constructors and converters a sketch may call bare. */
  jsCalls: ['Array', 'Object', 'Number', 'String', 'Boolean', 'Symbol', 'Map', 'Set',
    'WeakMap', 'Promise', 'JSON', 'Math', 'RegExp', 'Date', 'parseInt', 'parseFloat',
    'isNaN', 'isFinite', 'structuredClone', 'console'],
  exclude: [],
};

/** The sections of the host page, in reading order. */
const sections = [
  { id: 'p5', title: 'p5.js' },
  { id: 'js', title: 'JavaScript' },
];

/** The areas inside them, in reading order. */
const areas = [
  { id: 'sketch',  section: 'p5', title: 'The sketch and its canvas' },
  { id: 'colour',  section: 'p5', title: 'Colour' },
  { id: 'shapes',  section: 'p5', title: 'Shapes and transforms' },
  { id: 'text',    section: 'p5', title: 'Text' },
  { id: 'media',   section: 'p5', title: 'Images, fonts and offscreen graphics' },
  { id: 'input',   section: 'p5', title: 'Input' },
  { id: 'dom',     section: 'p5', title: 'DOM controls' },
  { id: 'math',    section: 'p5', title: 'Maths and randomness' },
  { id: 'light',   section: 'p5', title: 'Lights and 3D' },
  { id: 'values',  section: 'p5', title: 'Constants' },
  { id: 'arrays',  section: 'js', title: 'Arrays' },
  { id: 'builtin', section: 'js', title: 'Built-in objects' },
  { id: 'console', section: 'js', title: 'The console' },
];

/**
 * One line per name, saying what the examples use it for: the reference pages'
 * content, and the strict half of the gate. Keys are qualified — `p5:createCanvas`,
 * `p5:Element.html`, `js:Array.push` — because `map`, `fill` and `value` mean
 * different things at different tiers. This library's own names are not here:
 * they resolve to their pages.
 */
const terms = {
  // ── p5.js: the sketch and its canvas ─────────────────────────────────────
  'p5:createCanvas': { area: 'sketch', gloss: 'makes the canvas the sketch draws into; the quadrille is laid out in its pixels' },
  'p5:frameCount':   { area: 'sketch', gloss: 'how many frames have been drawn; 0 inside setup()' },
  'p5:noLoop':       { area: 'sketch', gloss: 'draws one frame and stops; redraw() asks for another' },
  'p5:redraw':       { area: 'sketch', gloss: 'runs draw() once more after noLoop()' },
  'p5:width':        { area: 'sketch', gloss: 'the canvas width in pixels, read when the cell count is derived from it' },
  'p5:height':       { area: 'sketch', gloss: 'the canvas height in pixels' },

  // ── p5.js: colour ────────────────────────────────────────────────────────
  'p5:background':   { area: 'colour', gloss: 'paints the whole canvas — the backdrop an empty cell shows' },
  'p5:color':        { area: 'colour', gloss: 'makes a p5.Color from a CSS string or from channels under the current colorMode; a cell can hold one' },
  'p5:fill':         { area: 'colour', gloss: 'sets the fill colour of the shapes and text drawn after it' },
  'p5:noFill':       { area: 'colour', gloss: 'draws shapes with no fill, only their outline' },
  'p5:noStroke':     { area: 'colour', gloss: 'draws shapes with no outline' },
  'p5:stroke':       { area: 'colour', gloss: 'sets the outline colour' },
  'p5:strokeWeight': { area: 'colour', gloss: 'sets the outline width in pixels' },
  'p5:colorMode':    { area: 'colour', gloss: 'changes how colour numbers are read — RGB or HSB — and their range' },
  'p5:red':          { area: 'colour', gloss: 'a p5.Color’s red channel, as the examples compare or sort by it' },
  'p5:green':        { area: 'colour', gloss: 'a p5.Color’s green channel' },
  'p5:blue':         { area: 'colour', gloss: 'a p5.Color’s blue channel' },
  'p5:alpha':        { area: 'colour', gloss: 'a p5.Color’s opacity' },
  'p5:brightness':   { area: 'colour', gloss: 'a p5.Color’s brightness, under the current colorMode' },
  'p5:saturation':   { area: 'colour', gloss: 'a p5.Color’s saturation, under the current colorMode' },

  // ── p5.js: shapes and transforms ─────────────────────────────────────────
  'p5:rect':         { area: 'shapes', gloss: 'a rectangle from its corner (or its centre under rectMode)' },
  'p5:circle':       { area: 'shapes', gloss: 'a circle from its centre and diameter' },
  'p5:triangle':     { area: 'shapes', gloss: 'a triangle from three points' },
  'p5:ellipseMode':  { area: 'shapes', gloss: 'whether an ellipse’s coordinates are its centre (CENTER) or its corner' },
  'p5:image':        { area: 'shapes', gloss: 'draws a p5.Image scaled into the box it is given' },
  'p5:sphere':       { area: 'shapes', gloss: 'a 3D sphere, WEBGL only' },
  'p5:torus':        { area: 'shapes', gloss: 'a 3D torus, WEBGL only' },
  'p5:push':         { area: 'shapes', gloss: 'saves the transform and style state; drawQuadrille does it around every cell' },
  'p5:pop':          { area: 'shapes', gloss: 'restores what push() saved' },
  'p5:rotateX':      { area: 'shapes', gloss: 'rotates the geometry drawn after it about the x axis, WEBGL only' },
  'p5:rotateY':      { area: 'shapes', gloss: 'rotates the geometry drawn after it about the y axis, WEBGL only' },

  // ── p5.js: text ──────────────────────────────────────────────────────────
  'p5:text':         { area: 'text', gloss: 'draws a string with the current fill, size, font and alignment' },
  'p5:textSize':     { area: 'text', gloss: 'the glyph size in pixels' },
  'p5:textFont':     { area: 'text', gloss: 'the font text() uses — a loaded font or a CSS family' },
  'p5:textAlign':    { area: 'text', gloss: 'the horizontal and vertical anchor of text(); CENTER centres it in the cell' },
  'p5:loadFont':     { area: 'text', gloss: 'loads a font file asynchronously, to hand to textFont' },

  // ── p5.js: images, fonts, offscreen graphics ─────────────────────────────
  'p5:loadImage':    { area: 'media', gloss: 'loads an image asynchronously (await it); an image is a valid cell value' },
  'p5:createGraphics': { area: 'media', gloss: 'an offscreen p5.Graphics with its own canvas, which drawQuadrille can draw into' },
  'p5:createVideo':  { area: 'media', gloss: 'loads a video element, drawn where an image would go' },

  // ── p5.js: input ─────────────────────────────────────────────────────────
  'p5:key':          { area: 'input', gloss: 'the last key pressed, as a string; keyPressed() reads it' },
  'p5:mouseX':       { area: 'input', gloss: 'the pointer’s x in canvas pixels' },
  'p5:mouseY':       { area: 'input', gloss: 'the pointer’s y in canvas pixels' },
  'p5:mouseIsPressed': { area: 'input', gloss: 'true while a mouse button is down' },

  // ── p5.js: DOM controls ──────────────────────────────────────────────────
  'p5:createP':      { area: 'dom', gloss: 'appends a paragraph below the canvas; the examples print their state into it' },
  'p5:createCheckbox': { area: 'dom', gloss: 'a labelled checkbox; checked() reads it and changed() fires on a toggle' },
  'p5:createSelect': { area: 'dom', gloss: 'a dropdown; option() adds entries and selected()/value() read the choice' },
  'p5:createSlider': { area: 'dom', gloss: 'a range slider; value() reads the number it holds' },
  'p5:createColorPicker': { area: 'dom', gloss: 'a colour input; value() returns the chosen colour' },
  'p5:Element.html': { area: 'dom', gloss: 'sets the element’s inner HTML — how a sketch writes its state under the canvas' },
  'p5:Element.value': { area: 'dom', gloss: 'reads (or sets) a control’s value' },
  'p5:Element.position': { area: 'dom', gloss: 'places the element at (x, y) in the frame, usually under the canvas' },
  'p5:Element.checked': { area: 'dom', gloss: 'reads (or sets) a checkbox' },
  'p5:Element.changed': { area: 'dom', gloss: 'calls a function when the control’s value changes' },
  'p5:Element.selected': { area: 'dom', gloss: 'reads (or sets) the selected entry of a dropdown' },
  'p5:Element.option': { area: 'dom', gloss: 'adds an entry to a dropdown' },
  'p5:Element.input': { area: 'dom', gloss: 'calls a function on every keystroke in an input' },
  'p5:Element.style': { area: 'dom', gloss: 'sets a CSS property on the element' },
  'p5:Element.hide': { area: 'dom', gloss: 'hides the element' },

  // ── p5.js: maths and randomness ──────────────────────────────────────────
  'p5:random':       { area: 'math', gloss: 'a random number in [min, max); seedable with randomSeed' },
  'p5:map':          { area: 'math', gloss: 'rescales a value from one range into another' },
  'p5:constrain':    { area: 'math', gloss: 'clamps a value between two bounds' },
  'p5:floor':        { area: 'math', gloss: 'rounds down' },
  'p5:min':          { area: 'math', gloss: 'the smaller of two values' },
  'p5:sin':          { area: 'math', gloss: 'the sine of an angle in radians' },
  'p5:int':          { area: 'math', gloss: 'p5’s integer conversion: int(3.7) is 3' },

  // ── p5.js: lights and 3D ─────────────────────────────────────────────────
  'p5:ambientLight': { area: 'light', gloss: 'lights every surface equally, so no side is dark' },
  'p5:directionalLight': { area: 'light', gloss: 'a light coming from one direction, like the sun' },
  'p5:orbitControl': { area: 'light', gloss: 'lets the pointer orbit a WEBGL camera' },

  // ── p5.js: constants (no page of their own) ──────────────────────────────
  'p5:PI':           { area: 'values', gloss: 'π, 3.14159…' },
  'p5:CENTER':       { area: 'values', gloss: 'the mode value that makes a coordinate a centre — read by rectMode, ellipseMode and textAlign' },
  'p5:CORNER':       { area: 'values', gloss: 'the mode value that makes a coordinate a corner' },
  'p5:WEBGL':        { area: 'values', gloss: 'the 3D renderer, passed as createCanvas’s third argument' },
  'p5:RGB':          { area: 'values', gloss: 'the colour mode colorMode() switches to' },
  'p5:HSB':          { area: 'values', gloss: 'the hue/saturation/brightness colour mode' },

  // ── JavaScript ───────────────────────────────────────────────────────────
  'js:Array.push':   { area: 'arrays', gloss: 'appends to an array and returns its new length', href: 'https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/push' },
  'js:Math.abs':     { area: 'builtin', gloss: 'absolute value', href: 'https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Math/abs' },
  'js:Map':          { area: 'builtin', gloss: 'a keyed collection — one entry per key, iterated in insertion order', href: 'https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Map' },
  'js:String':       { area: 'builtin', gloss: 'converts a value to a string', href: 'https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String' },
  'js:Symbol':       { area: 'builtin', gloss: 'a unique, immutable key — a value type a cell can hold', href: 'https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Symbol' },
  'js:console.log':  { area: 'console', gloss: 'prints to the browser console, for what is easier to read there than on the canvas', href: 'https://developer.mozilla.org/en-US/docs/Web/API/console/log_static' },
};

/**
 * The address of a term, by the tier it belongs to. A p5 constant has none: the
 * reference documents it inside the function that takes it, so the page lists it
 * as a value and says so. A p5 function, value or cast has a page at
 * `reference/p5/<name>/`; a `p5.Element` method is documented on the class page.
 */
const termHref = (key, constants, reference) => {
  const [tier, name] = [key.slice(0, key.indexOf(':')), key.slice(key.indexOf(':') + 1)];
  if (tier === 'p5') {
    if (name.startsWith('Element.')) return `${reference}p5/p5.Element/`;
    return constants.has(name) ? null : `${reference}p5/${name}/`;
  }
  if (tier === 'js') return terms[key]?.href ?? null;
  return null;
};

// ── The reader ──────────────────────────────────────────────────────────────

/** Words that are never evidence: literals and keywords that look like names. */
const LITERALS = new Set(['true', 'false', 'null', 'undefined', 'this', 'new', 'typeof',
  'instanceof', 'in', 'of', 'await', 'async', 'return', 'function', 'class', 'super']);

/** Strip comments and string/template literals so their words are not names. */
function scrub(code) {
  return code
    .replace(/\/\*[\s\S]*?\*\//g, ' ')
    .replace(/(^|[^:])\/\/[^\n]*/g, '$1 ')
    .replace(/`(?:\\[\s\S]|[^`\\])*`/g, ' ')
    .replace(/'(?:\\[\s\S]|[^'\\\n])*'/g, ' ')
    .replace(/"(?:\\[\s\S]|[^"\\\n])*"/g, ' ');
}

/** Every name a sketch declares, so it can never be mistaken for an API name. */
function declarations(code) {
  const local = new Set();
  const declare = (name) => { if (/^[A-Za-z_$][\w$]*$/.test(name)) local.add(name); };

  for (const m of code.matchAll(/\b(?:let|const|var)\s+([^;\n]+)/g)) {
    for (const part of m[1].split(',')) {
      declare(part.split('=')[0].trim().replace(/^[{[]/, '').replace(/[}\]]$/, ''));
    }
  }
  for (const m of code.matchAll(/[{[]([^{}[\]]*)[}\]]\s*(?:=|,|\)|;|\s*=>)/g)) {
    for (const part of m[1].split(',')) declare(part.split(':').pop().trim().replace(/[=\s].*$/, ''));
  }
  for (const m of code.matchAll(/\bfunction\s+([A-Za-z_$][\w$]*)\s*\(([^)]*)\)/g)) {
    declare(m[1]);
    for (const part of m[2].split(',')) declare(part.split('=')[0].trim());
  }
  for (const m of code.matchAll(/\(([^)]*)\)\s*=>/g)) {
    for (const part of m[1].split(',')) declare(part.split('=')[0].trim());
  }
  for (const m of code.matchAll(/\bclass\s+([A-Za-z_$][\w$]*)/g)) declare(m[1]);
  for (const m of code.matchAll(/\bcatch\s*\(\s*([A-Za-z_$][\w$]*)/g)) declare(m[1]);
  for (const m of code.matchAll(/\b(?:for|of)\s*\(?\s*(?:const|let)\s+([A-Za-z_$][\w$]*)/g)) declare(m[1]);
  for (const m of code.matchAll(/\.\s*(?:forEach|map|filter|some|every)\s*\(\s*\(?\s*([A-Za-z_$][\w$]*)/g)) declare(m[1]);
  return local;
}

/** Which receiver class each variable holds, as far as the sketch proves it. */
function receivers(code) {
  const kind = new Map();
  for (const m of code.matchAll(/\b([A-Za-z_$][\w$]*)\s*=\s*(?:await\s+)?([A-Za-z_$][\w$]*)\s*\(/g)) {
    const [, variable, factory] = m;
    if (rules.receivers.quadrille.includes(factory) || factory === 'Quadrille') kind.set(variable, 'quadrille');
    else if (rules.receivers.element.includes(factory)) kind.set(variable, 'element');
    else if (rules.receivers.array.includes(factory)) kind.set(variable, 'array');
  }
  for (const m of code.matchAll(/\b([A-Za-z_$][\w$]*)\s*=\s*\[\s*[^\]]*\]/g)) {
    kind.set(m[1], kind.get(m[1]) ?? 'array');
  }
  return kind;
}

/**
 * @param {string} code  a ```js fence's contents
 * @param {{ doclets: Set<string>, globals: Object }} ctx
 * @returns {{ used: Map<string, 'call'|'member'|'read'>, unclaimed: Set<string> }}
 */
export function usesOf(code, { doclets, globals }) {
  const clean = scrub(code);
  const local = declarations(clean);
  const kind = receivers(clean);
  const p5Fn = globals.functions;
  const p5Val = new Set([...globals.values, ...globals.constants]);
  const used = new Map();
  const unclaimed = new Set();
  const add = (key, how) => { if (!used.has(key)) used.set(key, how); };

  for (const m of clean.matchAll(/\bQuadrille\s*\.\s*([A-Za-z_$][\w$]*)/g)) {
    if (doclets.has(m[1])) add(`quadrille:${m[1]}`, 'member');
  }

  for (const m of clean.matchAll(/([A-Za-z_$][\w$]*)\s*\.\s*([A-Za-z_$][\w$]*)/g)) {
    const [, receiver, member] = m;
    if (receiver === 'Quadrille') continue;
    const cls = kind.get(receiver);
    if (cls === 'quadrille' && doclets.has(member)) add(`quadrille:${member}`, 'member');
    else if (cls === 'element' && rules.members.element.includes(member)) add(`p5:Element.${member}`, 'member');
    else if (cls === 'array' && rules.members.array.includes(member)) add(`js:Array.${member}`, 'member');
    else if (rules.namespaces.includes(receiver)) add(`js:${receiver}.${member}`, 'member');
  }

  for (const m of clean.matchAll(/(?<![\w$.])([A-Za-z_$][\w$]*)\s*\(/g)) {
    const name = m[1];
    if (LITERALS.has(name) || local.has(name) || rules.exclude.includes(name)) continue;
    if (p5Fn.has(name)) add(`p5:${name}`, 'call');
    else if (doclets.has(name)) add(`quadrille:${name}`, 'call');
    else if (rules.jsCalls.includes(name)) add(`js:${name}`, 'call');
    else if (name !== 'if' && name !== 'for' && name !== 'while' && name !== 'switch' && name !== 'catch') unclaimed.add(name);
  }

  for (const m of clean.matchAll(/(?<![\w$.])([A-Za-z_$][\w$]*)\b(?!\s*[.(])/g)) {
    const name = m[1];
    if (LITERALS.has(name) || local.has(name) || !p5Val.has(name) || rules.exclude.includes(name)) continue;
    add(`p5:${name}`, 'read');
  }

  return { used, unclaimed };
}

/**
 * The whole site's usage: every fence of every page, aggregated.
 * @param {{ path: string, body: string }[]} pages
 */
function siteUses(pages, ctx) {
  const byPage = new Map();      // page path → key → how
  const counts = new Map();      // key → number of examples that use it
  const unclaimed = new Map();

  for (const page of pages) {
    const all = new Map();
    for (const m of page.body.matchAll(/```js\n([\s\S]*?)```/g)) {
      const { used, unclaimed: unknown } = usesOf(m[1], ctx);
      for (const [key] of used) {
        if (!all.has(key)) all.set(key, true);
        counts.set(key, (counts.get(key) ?? 0) + 1);
      }
      for (const name of unknown) unclaimed.set(name, (unclaimed.get(name) ?? 0) + 1);
    }
    if (all.size) byPage.set(page.path, all);
  }
  return { byPage, counts, unclaimed };
}

// ── The tables ──────────────────────────────────────────────────────────────

/** Rows sorted by how many examples use them, then by name. */
const rowsFor = (keys, counts) => [...keys].sort((a, b) => (counts.get(b) ?? 0) - (counts.get(a) ?? 0)
  || a.localeCompare(b));

/** A name as the row of a table: linked when the tier has a page, else plain. */
function termLink(key, site, name) {
  const bare = key.slice(key.indexOf(':') + 1).replace(/^Element\./, '');
  if (key.startsWith(SELF)) {
    const d = site.docletsByName.get(name);
    const code = esc(name);
    return d && !d.ignore
      ? `<a href="${at(site.dir, d.page ?? `${d.group}/${snake(d.name)}`, site.page)}"><code>${code}</code></a>`
      : `<code>${code}</code>`;
  }
  const href = termHref(key, site.constants, site.reference);
  return href ? `<a href="${href}"><code>${esc(bare)}</code></a>` : `<code>${esc(bare)}</code>`;
}

/**
 * A row's one-line description: the gloss for a host name, the doc block's own
 * first sentence for this library's — which is why that column needs no authored
 * prose of its own.
 */
function glossOf(key, site) {
  if (key.startsWith(SELF)) {
    const d = site.docletsByName.get(key.slice(SELF.length + 1));
    return d ? firstSentence(d.description) : '';
  }
  return terms[key]?.gloss ?? '';
}

/** The first sentence of a text, markdown stripped to plain text. */
function firstSentence(text) {
  const plain = (text || '').replace(/\[([^\]]*)\]\([^)]*\)/g, '$1')
    .replace(/[`*_]/g, '').replace(/\s+/g, ' ').trim();
  const m = /^(.+?[.!?])(\s|$)/.exec(plain);
  return m ? m[1] : plain.slice(0, 160);
}

function termsTable(rows, site, { name, gloss, count }) {
  return `
        <table class="terms">
          <thead><tr><th>${esc(name)}</th><th>${esc(gloss)}</th><th>${esc(count)}</th></tr></thead>
          <tbody>${rows.map((key) => {
            const bare = key.slice(key.indexOf(':') + 1);
            return `
            <tr id="${slug(bare)}">
              <td>${termLink(key, site, bare)}</td>
              <td>${esc(glossOf(key, site))}</td>
              <td class="count">${site.counts.get(key) ?? 0}</td>
            </tr>`;
          }).join('')}
          </tbody>
        </table>`;
}

/** `<!-- uses: host -->` — p5.js and JavaScript, by area. */
function hostTables(site) {
  const keys = [...site.counts.keys()].filter((k) => !k.startsWith(`${SELF}:`));
  return sections.map((section) => {
    const mine = keys.filter((k) => areas.find((a) => a.id === terms[k]?.area)?.section === section.id);
    return `
      <section class="terms-section">
        <h2 id="${esc(section.id)}">${esc(section.title)}</h2>
        ${areas.filter((a) => a.section === section.id).map((area) => {
          const areaKeys = mine.filter((k) => terms[k].area === area.id);
          if (!areaKeys.length) return '';
          return `
        <h3 id="${esc(area.id)}">${esc(area.title)}</h3>
        ${termsTable(rowsFor(areaKeys, site.counts), site, { name: 'Name', gloss: 'What the examples use it for', count: 'Examples' })}`;
        }).join('')}
      </section>`;
  }).join('');
}

/** `<!-- uses: quadrille -->` — this library's own surface, by teaching area. */
function quadrilleTables(site) {
  const keys = [...site.counts.keys()].filter((k) => k.startsWith(`${SELF}:`));
  const byArea = new Map();
  for (const key of keys) {
    const d = site.docletsByName.get(key.slice(SELF.length + 1));
    const area = d?.group ?? 'other';
    if (!byArea.has(area)) byArea.set(area, []);
    byArea.get(area).push(key);
  }
  return site.groups.filter((g) => byArea.has(g.slug)).map((g) => `
      <section class="terms-section">
        <h2 id="${esc(g.slug)}">${esc(g.title)}</h2>
        ${termsTable(rowsFor(byArea.get(g.slug), site.counts), site,
          { name: 'Surface', gloss: 'What it is', count: 'Examples' })}
      </section>`).join('');
}

/** The compact block at the foot of a page that carries sketches. */
function usesBlock(page, site) {
  const used = site.byPage.get(page.path);
  if (!used || !used.size) return '';
  const tiers = [
    [SELF, 'p5.quadrille'],
    ['p5', 'p5.js'],
    ['js', 'JavaScript'],
  ];
  return `
      <section class="uses">
        <details>
          <summary>What this page's examples use</summary>
          <dl>${tiers.map(([tier, label]) => {
            const keys = rowsFor([...used.keys()].filter((k) => k.startsWith(`${tier}:`)), site.counts);
            if (!keys.length) return '';
            return `
            <dt>${esc(label)}</dt>
            <dd>${keys.map((k) => termLink(k, site, k.slice(k.indexOf(':') + 1))).join(' ')}</dd>`;
          }).join('')}
          </dl>
          <p class="hint">Names the analysis can prove are called, and the line each one is documented on. Local variables and members of an unknown receiver are left out.</p>
        </details>
      </section>`;
}

// ── The analysis, once per build ────────────────────────────────────────────

const analysed = new WeakMap();

/**
 * The whole build's reading of the site: the tiers, the counts, and the blocks
 * the pages ask for.
 * @param {{ modules: Object[], doclets: Object[] }} parsed
 * @param {{ declaration: Object, pages: Object[] }} ctx
 */
function analyse(parsed, ctx) {
  if (analysed.has(parsed)) return analysed.get(parsed);
  const { declaration, pages } = ctx;
  const pin = declaration.pins.p5 ?? { version: '2.3.2' };
  const globals = p5Names(pin);
  const docletsByName = new Map(parsed.doclets.map((d) => [d.name, d]));
  const names = new Set(parsed.doclets.filter((d) => !d.ignore).map((d) => d.name));
  const { byPage, counts, unclaimed } = siteUses(pages, { doclets: names, globals });

  const site = {
    byPage, counts, unclaimed,
    docletsByName,
    dir: declaration.carrier.pages.dir,
    groups: declaration.groups ?? [],
    constants: globals.constants,
    reference: 'https://p5js.org/reference/',
    page: null,
  };
  const blocks = (page) => {
    const mine = { ...site, page };
    const out = {};
    for (const [, which] of page.body.matchAll(/<!--\s*uses:\s*(\w+)\s*-->/g)) {
      out[which] = which === 'host' ? hostTables(mine) : which === 'quadrille' ? quadrilleTables(mine) : '';
    }
    const foot = usesBlock(page, mine);
    if (foot) out.foot = foot;
    return out;
  };
  const result = { site, blocks, unclaimed };
  analysed.set(parsed, result);
  return result;
}

/** The host page's own address, and the entries its rows earn in the search index. */
function hostIndex(site, index) {
  const out = [];
  for (const key of site.counts.keys()) {
    if (key.startsWith(SELF)) continue;
    const bare = key.slice(key.indexOf(':') + 1);
    out.push({ t: bare, h: `${index}${slug(bare)}`, k: key.split(':')[0], s: terms[key]?.gloss ?? '' });
  }
  return out;
}

export default {
  name: 'host',

  /**
   * The blocks the pages ask for, the index entries the host's names earn, and
   * what the analysis could not place.
   * @param {{ modules: Object[], doclets: Object[] }} parsed
   * @param {{ declaration: Object, pages: Object[] }} ctx
   */
  data(parsed, ctx) {
    const { site, blocks, unclaimed } = analyse(parsed, ctx);
    const slots = {};
    let hostPage = null;
    for (const page of ctx.pages) {
      const pageSlots = blocks(page);
      if (Object.keys(pageSlots).length) slots[page.path] = pageSlots;
      if (page.body.includes('<!-- uses: host -->')) hostPage = page.path;
    }
    const index = hostPage ? hostIndex(site, `${site.dir}/${hostPage}/#`) : [];
    const notes = [];
    if (unclaimed.size) {
      const top = [...unclaimed].sort((a, b) => b[1] - a[1]).slice(0, 8);
      notes.push(`${unclaimed.size} name(s) in fences belong to no tier (locals, or members of an unknown ` +
                 `receiver): ${top.map(([n, c]) => `${n}(${c})`).join(' ')}`);
    }
    return { slots, index, notes };
  },

  /**
   * The strict half: a name an example provably calls must be documented — by a
   * doc block for this library, by a gloss for p5.js and JavaScript.
   * @param {{ modules: Object[], doclets: Object[] }} parsed
   * @param {{ declaration: Object, pages: Object[] }} ctx
   */
  validate(parsed, ctx) {
    const { site } = analyse(parsed, ctx);
    const errors = [], warnings = [];
    for (const [key, n] of [...site.counts].sort((a, b) => b[1] - a[1])) {
      const [tier, name] = [key.slice(0, key.indexOf(':')), key.slice(key.indexOf(':') + 1)];
      if (tier === SELF) {
        if (!site.docletsByName.has(name)) errors.push(`uses  ${name} is called by ${n} example(s) and has no doc block`);
        continue;
      }
      if (!terms[key]) errors.push(`uses  ${key} is called by ${n} example(s) and has no gloss in plugins/host.mjs`);
    }
    const unused = Object.keys(terms).filter((k) => !site.counts.has(k));
    if (unused.length) warnings.push(`uses  ${unused.join(' ')} glossed but used by no example`);
    return { errors, warnings };
  },
};
