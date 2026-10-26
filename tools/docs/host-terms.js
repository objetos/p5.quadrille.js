/**
 * @file Host terms — the p5.js and JavaScript names the examples use, and the
 * rules that decide which name belongs to which tier.
 * @module tools/docs/host-terms
 * @license GPL-3.0-only
 *
 * Two jobs, both data:
 *
 * 1. **The tier rules** (`rules`). Which factory hands back which kind of
 *    object, which member names each kind answers to, and which names are never
 *    evidence. `uses.js` applies them; nothing here is applied by prose.
 * 2. **The glosses** (`terms`). One line per name, saying what the examples use
 *    it for — the reference pages' content, and the strict half of the build's
 *    gate: a name an example provably calls and this file does not gloss fails
 *    the build, so the two pages cannot lag the snippets.
 *
 * Keys are qualified — `p5:createCanvas`, `p5:Element.html`, `js:Array.push` —
 * because `map`, `fill` and `value` mean different things at different tiers.
 * This library's own names are not here: they resolve to their pages.
 *
 * The URL shapes were checked, not assumed: a p5 **function, value or cast** has
 * a page at `reference/p5/<name>/`; a p5 **constant** has none (it is documented
 * inside the function that takes it), so it is listed without a link; a
 * `p5.Element` **method** is documented on the class page, which is where its
 * link goes.
 */

import { readFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

import { p5 } from './config.js';

/** The generated p5 surface — which names are constants, and so have no page. */
const globals = JSON.parse(readFileSync(
  join(dirname(fileURLToPath(import.meta.url)), 'data', 'p5-globals.json'), 'utf8'));
const constants = new Set(globals.constants);

/** The sections of the host page, in reading order. */
export const areas = [
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

/** Section titles for the page's own headings. */
export const sections = [
  { id: 'p5', title: 'p5.js' },
  { id: 'js', title: 'JavaScript' },
];

/**
 * The tier rules. `uses.js` reads these and nothing else.
 */
export const rules = {
  /** A named factory hands back an object whose members are documented. */
  receivers: {
    quadrille: ['createQuadrille'],
    element: ['createP', 'createDiv', 'createSpan', 'createSlider', 'createCheckbox',
      'createSelect', 'createRadio', 'createColorPicker', 'createButton', 'createImg',
      'createVideo', 'createAudio', 'createCapture', 'createFileInput', 'createA'],
    array: ['loadStrings', 'split'],
  },
  /** Member names each receiver kind answers to. */
  members: {
    element: ['html', 'style', 'position', 'value', 'checked', 'changed', 'selected',
      'option', 'hide', 'show', 'size', 'attribute', 'remove', 'elt', 'id', 'class',
      'parent', 'child', 'addClass', 'removeClass', 'center', 'disable', 'enable',
      'input', 'mousePressed', 'mouseReleased', 'mouseOver', 'mouseOut'],
    array: ['map', 'filter', 'forEach', 'reduce', 'push', 'pop', 'shift', 'unshift',
      'slice', 'splice', 'join', 'concat', 'includes', 'indexOf', 'find', 'findIndex',
      'some', 'every', 'sort', 'reverse', 'fill', 'flat', 'flatMap', 'at', 'length'],
  },
  /** A variable assigned `[…]` holds an array. */
  arrayLiteral: true,
  /** JavaScript namespaces whose members are documented one page each. */
  namespaces: ['Math', 'JSON', 'Object', 'console', 'Number', 'String', 'Array',
    'Date', 'Promise', 'Symbol', 'Map', 'Set'],
  /** JavaScript constructors and converters a sketch may call bare. */
  jsCalls: ['Array', 'Object', 'Number', 'String', 'Boolean', 'Symbol', 'Map', 'Set',
    'WeakMap', 'Promise', 'JSON', 'Math', 'RegExp', 'Date', 'parseInt', 'parseFloat',
    'isNaN', 'isFinite', 'structuredClone', 'console'],
  /**
   * Never claimed, in any tier, in any position. `int` is p5's cast and also a
   * keyword Chroma tags; `value`, `position`, `row`, `col` are control members
   * and draw params far more often than they are anything documented.
   */
  exclude: [],
};

/**
 * One line per name. The `section` comes from `areas`, the link from
 * `termHref(key)` — so a gloss is the only thing written here.
 */
export const terms = {
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
  'js:console.assert': { area: 'console', gloss: 'prints only when the condition is false — a one-line invariant check', href: 'https://developer.mozilla.org/en-US/docs/Web/API/console/assert_static' },
};

/**
 * The address of a term, by the tier it belongs to. A p5 constant has none: the
 * reference documents it inside the function that takes it, so the page lists it
 * as a value and says so.
 * @param {string} key qualified name, e.g. `p5:createCanvas`
 * @returns {string|null}
 */
export function termHref(key) {
  const [tier, name] = [key.slice(0, key.indexOf(':')), key.slice(key.indexOf(':') + 1)];
  if (tier === 'p5') {
    if (name.startsWith('Element.')) return `${p5.reference}p5/p5.Element/`;
    return constants.has(name) ? null : `${p5.reference}p5/${name}/`;
  }
  if (tier === 'js') return terms[key]?.href ?? null;
  return null;
}
