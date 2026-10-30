/**
 * @file Shortcodes — the one inline shortcode a page may carry.
 * @module tools/docs/shortcode
 * @license GPL-3.0-only
 *
 * A page is Markdown, and Markdown cannot say "embed this video" without raw
 * HTML in the prose. The old Hugo site answered with `{{< youtube id >}}`; the
 * generated site answers with the same syntax, resolved here:
 *
 *     {{< youtube v7hc715hvVg >}}
 *     {{< youtube v7hc715hvVg "Capablanca vs Marshall, 1918" >}}
 *
 * The renderer prints a 16:9 `<figure>`: a thumbnail that links to the watch
 * page, upgraded to the privacy-enhanced player on click by `assets/video.js`.
 * A frame in the HTML would make every page's own `load` wait on YouTube, so
 * the player is the reader's request, not the page's. The caption is optional
 * and is the player's accessible title as well as the figure's visible line.
 *
 * The id is YouTube's own eleven characters. A shortcode that carries anything
 * else would render as literal text, which is the silent drift the site's
 * gates exist to refuse: `shortcodeErrors` fails the build, and `expand` leaves
 * the run alone rather than pretending to have resolved it.
 *
 * A fence is a listing, not prose: a shortcode inside one stays as written,
 * which is how a page documents the syntax.
 */

/** A well-formed shortcode: `{{< youtube ID >}}`, caption optional. */
const YOUTUBE_RE = /\{\{<\s*youtube\s+([A-Za-z0-9_-]{11})(?:\s+"([^"]*)")?\s*>\}\}/g;

/** Anything shortcode-shaped: a closed `{{< … >}}`, or a lone opener. */
const ANY_RE = /\{\{<[\s\S]*?>\}\}|\{\{[<%]/;

/** A line that opens or closes a code fence. */
const FENCE_RE = /^ {0,3}(?:```|~~~)/;

/**
 * Calls `fn(line)` for every line outside a code fence, and joins what it
 * returns — the walking rule `migrate.js` applies when it strips a hard break,
 * so a listing is never rewritten as prose.
 * @param {string} md
 * @param {(line: string) => string} fn
 * @returns {string}
 */
function onProse(md, fn) {
  let fenced = false;
  return md.split('\n').map((line) => {
    if (FENCE_RE.test(line)) { fenced = !fenced; return line; }
    return fenced ? line : fn(line);
  }).join('\n');
}

/**
 * The page's Markdown with every well-formed shortcode replaced by a
 * `@@video-N@@` placeholder, plus the videos it named.
 * @param {string} md
 * @returns {{ body: string, videos: { placeholder: string, id: string, caption: string|null }[] }}
 */
export function expand(md) {
  const videos = [];
  const body = onProse(md, (line) => line.replace(YOUTUBE_RE, (_, id, caption) => {
    const placeholder = `@@video-${videos.length}@@`;
    videos.push({ placeholder, id, caption: caption ?? null });
    return placeholder;
  }));
  return { body, videos };
}

/**
 * Every shortcode-shaped run that is not a well-formed one: an unknown name, a
 * mistyped or missing id, a `{{% … %}}` the old site left behind.
 * @param {string} md
 * @returns {{ line: number, text: string }[]} body-relative, 1-based
 */
export function shortcodeErrors(md) {
  const bad = [];
  let fenced = false;
  md.split('\n').forEach((line, i) => {
    if (FENCE_RE.test(line)) { fenced = !fenced; return; }
    if (fenced) return;
    if (ANY_RE.test(line.replace(YOUTUBE_RE, ''))) bad.push({ line: i + 1, text: line.trim() });
  });
  return bad;
}

/**
 * A page's text with every shortcode-shaped run dropped — for a summary that
 * has no business carrying the syntax.
 * @param {string} md
 * @returns {string}
 */
export const withoutShortcodes = (md) => md.replace(/\{\{<[\s\S]*?>\}\}/g, ' ');
