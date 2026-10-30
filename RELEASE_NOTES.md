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
