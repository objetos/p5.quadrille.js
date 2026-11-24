A function handed to a fill now declares itself by what it returns. The release
also removes the two statics that used to do the declaring.

## What's new

### The library

- **The return value decides.** A function passed to `createQuadrille`, `fill`,
  `rand`, `replace` or `maze` is called once, in the first cell it lands in,
  with that cell's `{ row, col }`. Return a value and every cell holds one, a
  fresh one per cell; return nothing and the cell holds the function, drawn per
  cell at draw time. `null` leaves a cell empty. The verdict is cached per
  function.
- **The classifying call is contained.** It runs against a per-sketch scratch
  surface, so a display function paints nothing while being classified, and a
  call that produced no value leaves the sketch's style state and random stream
  exactly as it found them.
- **Removed:** `Quadrille.factory` and `Quadrille.singleton`. The return rule
  replaces both; `fill(value)` still stores one instance in every cell it
  reaches, which is all `singleton` ever named.
- `Quadrille.VERSION` reports 3.6.0. The npm package is published separately
  (`npm publish` at this tag); the release workflow deploys the API site only.

---

The documentation release that follows 3.5.1. The API pages carry their video
again, the signature strip prints each surface's own parameters, and the
library's behavior is unchanged.

## What's new

### The API site

- **A video shortcode.** `{{< youtube ID "caption" >}}` renders a 16:9 poster
  that links the watch page and becomes the privacy-enhanced player on click, so
  no page's `load` waits on YouTube and nothing reaches that host before the
  reader asks. A shortcode the renderer cannot resolve fails the build instead of
  shipping as literal text. `createQuadrille(FEN)` shows Capablanca–Marshall,
  1918 inside its note again.
- **One signature per surface.** A static helper and the instance method that
  delegates to it are one page with two parameter lists, and the validator
  compares each against its own function: the strip prints
  `Quadrille.and(q1, q2, row, col)` and `q.and(other, row, col)`, not the first
  list twice. `isFilled`, `bitIndex`, `shift` and `not` read correctly for the
  same reason.
- **A browser pass that clicks.** The check drives the poster to the player, so
  the upgrade is gated rather than promised.

### The library

- No behavior change. The bundle differs from 3.5.1 only in the names of five
  instance parameters: `and`, `or`, `xor`, `diff` and `merge` call the other
  quadrille `other` instead of `q`. Every call site is positional; the surface,
  the defaults and the results are unchanged.
- `Quadrille.VERSION` reports 3.5.2. The npm package is published separately
  (`npm publish` at this tag); the release workflow deploys the API site only.
