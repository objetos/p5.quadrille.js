The documentation release. The API site is now generated from source and
published from the tagged commit; the library itself is unchanged.

## What's new

### The API site

- **Generated, not hand-written.** Every page is built from the doc blocks in
  `src/` and the Markdown under `docs/` by `npm run docs`, so a documented
  signature is the signature the build evaluates, and a page that names a symbol
  the bundle does not export fails the build.
- **Runnable examples.** Every sketch on the site runs in place and can be
  edited and re-run; the static chrome and the bundle carry a build stamp, so a
  rebuild always reaches the browser.
- **One URL tree.** The pages keep the paths the previous site published, and
  `docs/redirects.json` keeps the historical paths reachable.
- **Built at the tag.** The site is deployed by the release workflow from the
  tagged commit — the same commit npm publishes — so the page and the package
  cannot skew.

### The library

- No behavior change. The built bundle is identical to 3.5.0 apart from
  comments and the version identifier.
