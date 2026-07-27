## What

<!-- One paragraph: what this PR does, and the issue it addresses (e.g. "Closes #12").
     Issue-first is the house workflow: open or claim an issue before the PR. -->

## Why

<!-- The design argument, briefly. If it touches the API surface, point at the
     relevant design/*.md entry — proposals go through the spec before code. -->

## How verified

<!-- Claims are verified computationally, not asserted. What did you run?
     e.g. `node testing/invariants.mjs` output, a testing/ page exercised,
     a sketch demonstrating the behavior. -->

## Checklist

- [ ] Read the relevant source before proposing (claims match `src/`, not assumptions)
- [ ] No recursion in new code; `console.warn` and proceed, never throw
- [ ] Mutators return `this`; names say *what*, not *how*
- [ ] `node testing/invariants.mjs` passes
- [ ] JSDoc for any public addition
- [ ] Added myself to `CONTRIBUTORS.md` (name, handle, contribution, blog/demo link)
