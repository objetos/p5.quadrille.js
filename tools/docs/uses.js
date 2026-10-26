/**
 * @file Uses — which API names a sketch calls, resolved to the three tiers the
 * site documents: this library, p5.js, and JavaScript.
 * @module tools/docs/uses
 * @license GPL-3.0-only
 *
 * Derivation, not inspection: every name below is one a fence provably calls or
 * reads, and a name that cannot be proved is left out rather than guessed.
 * Three rules keep it honest:
 *
 * 1. **A declared name is local.** `let fill`, a parameter, a destructured key,
 *    a catch binding — all shadow the ambient surface inside their sketch.
 * 2. **Bare reads and calls resolve p5-first.** `background()`, `fill()`,
 *    `sort()`, `width` are p5's before they are this library's; the library is
 *    reached only through `Quadrille.name`, the two addon calls, or a member
 *    call on a receiver proved to be a quadrille.
 * 3. **A member call needs a proved receiver.** `createQuadrille(…)` gives a
 *    quadrille, `createP(…)` a `p5.Element`, `= []` an array. `graphics.fill()`
 *    on anything else is nobody's claim.
 *
 * Output keys are qualified — `p5:createCanvas`, `quadrille:fill`,
 * `p5:Element.html`, `js:Array.map` — because `map`, `fill` and `value` name
 * different things at different tiers.
 */

/** Default rules when a caller passes none — the site always passes `rules`. */
const DEFAULTS = {
  receivers: {
    quadrille: ['createQuadrille'],
    element: ['createP', 'createDiv', 'createSpan', 'createSlider', 'createCheckbox',
      'createSelect', 'createRadio', 'createColorPicker', 'createButton', 'createImg',
      'createVideo', 'createAudio', 'createCapture', 'createFileInput', 'createA'],
    array: ['loadStrings', 'split'],
  },
  members: { element: [], array: [] },
  arrayLiteral: true,
  namespaces: [],
  jsCalls: [],
  exclude: [],
};

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
      const name = part.split('=')[0].trim().replace(/^[{[]/, '').replace(/[}\]]$/, '');
      declare(name);
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
function receivers(code, rules) {
  const kind = new Map();
  const assign = /\b([A-Za-z_$][\w$]*)\s*=\s*(?:await\s+)?([A-Za-z_$][\w$]*)\s*\(/g;
  for (const m of code.matchAll(assign)) {
    const [, variable, factory] = m;
    if (rules.receivers.quadrille.includes(factory) || factory === 'Quadrille') kind.set(variable, 'quadrille');
    else if (rules.receivers.element.includes(factory)) kind.set(variable, 'element');
    else if (rules.receivers.array.includes(factory)) kind.set(variable, 'array');
  }
  if (rules.arrayLiteral) {
    for (const m of code.matchAll(/\b([A-Za-z_$][\w$]*)\s*=\s*\[\s*[^\]]*\]/g)) {
      kind.set(m[1], kind.get(m[1]) ?? 'array');
    }
  }
  return kind;
}

/**
 * @param {string} code a ```js fence's contents
 * @param {{doclets: Set<string>, globals: Object, rules?: Object}} ctx
 * @returns {{used: Map<string, 'call'|'member'|'read'>, unclaimed: Set<string>}}
 */
export function usesOf(code, { doclets, globals, rules = DEFAULTS }) {
  const clean = scrub(code);
  const local = declarations(clean);
  const kind  = receivers(clean, rules);
  const p5Fn  = new Set(globals.functions);
  const p5Val = new Set([...globals.values, ...globals.constants]);
  const used = new Map();
  const unclaimed = new Set();
  const add = (key, how) => { if (!used.has(key)) used.set(key, how); };

  // `Quadrille.name` — the class's own static surface.
  for (const m of clean.matchAll(/\bQuadrille\s*\.\s*([A-Za-z_$][\w$]*)/g)) {
    if (doclets.has(m[1])) add(`quadrille:${m[1]}`, 'member');
  }

  // `receiver.member` — resolved only against a proved receiver class.
  for (const m of clean.matchAll(/([A-Za-z_$][\w$]*)\s*\.\s*([A-Za-z_$][\w$]*)/g)) {
    const [, receiver, member] = m;
    if (receiver === 'Quadrille') continue;
    const cls = kind.get(receiver);
    if (cls === 'quadrille' && doclets.has(member)) add(`quadrille:${member}`, 'member');
    else if (cls === 'element' && rules.members.element.includes(member)) add(`p5:Element.${member}`, 'member');
    else if (cls === 'array' && rules.members.array.includes(member)) add(`js:Array.${member}`, 'member');
    else if (rules.namespaces.includes(receiver)) add(`js:${receiver}.${member}`, 'member');
  }

  // Bare calls: p5 first, then this library's addon functions.
  for (const m of clean.matchAll(/(?<![\w$.])([A-Za-z_$][\w$]*)\s*\(/g)) {
    const name = m[1];
    if (LITERALS.has(name) || local.has(name) || rules.exclude.includes(name)) continue;
    if (p5Fn.has(name)) add(`p5:${name}`, 'call');
    else if (doclets.has(name)) add(`quadrille:${name}`, 'call');
    else if (rules.jsCalls.includes(name)) add(`js:${name}`, 'call');
    else if (name !== 'if' && name !== 'for' && name !== 'while' && name !== 'switch' && name !== 'catch') unclaimed.add(name);
  }

  // Bare reads: p5's globals (`key`, `mouseX`, `CENTER`, `WEBGL`) are the only
  // ones distinctive enough to claim without a call.
  for (const m of clean.matchAll(/(?<![\w$.])([A-Za-z_$][\w$]*)\b(?!\s*[.(])/g)) {
    const name = m[1];
    if (LITERALS.has(name) || local.has(name) || !p5Val.has(name) || rules.exclude.includes(name)) continue;
    add(`p5:${name}`, 'read');
  }

  return { used, unclaimed };
}

/**
 * The whole site's usage: every fence of every page, aggregated.
 * @param {{path: string, body: string}[]} pages
 * @param {{doclets: Set<string>, globals: Object}} ctx
 * @returns {{byPage: Map<string, Map<string, string>>, counts: Map<string, number>,
 *            perPage: Map<string, string[]>, unclaimed: Map<string, number>}}
 */
export function siteUses(pages, ctx) {
  const byPage = new Map();      // page path → key → how
  const counts = new Map();      // key → number of examples that use it
  const pages4 = new Map();      // key → pages
  const unclaimed = new Map();

  for (const page of pages) {
    const all = new Map();
    for (const m of page.body.matchAll(/```js\n([\s\S]*?)```/g)) {
      const { used, unclaimed: unknown } = usesOf(m[1], ctx);
      for (const [key, how] of used) {
        if (!all.has(key)) all.set(key, how);
        counts.set(key, (counts.get(key) ?? 0) + 1);
        if (!pages4.has(key)) pages4.set(key, new Set());
        pages4.get(key).add(page.path);
      }
      for (const name of unknown) unclaimed.set(name, (unclaimed.get(name) ?? 0) + 1);
    }
    if (all.size) byPage.set(page.path, all);
  }
  return { byPage, counts, pages: pages4, unclaimed };
}
