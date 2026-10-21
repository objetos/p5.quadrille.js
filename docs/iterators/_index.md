---
title: "Iterators"
weight: 2
symbol: visit
---

The `visit` method provides a single high-level mechanism to traverse a quadrille in **row-major** order (rows `0..height-1`, within each row columns `0..width-1`). The callback is invoked with `{ row, col, value }` and may read or mutate cells; its return value is ignored — traversal always runs to completion. Traversal can apply to **all cells** (empties included), or be restricted by a **single value** (matched by identity, `===`), a **collection** of allowed values, or a **predicate** function, encouraging a [declarative programming](https://en.wikipedia.org/wiki/Declarative_programming) approach.

## Manual Iteration Using Nested Loops

The [imperative programming](https://en.wikipedia.org/wiki/Imperative_programming) style for traversing a grid—often seen with 2D arrays or matrices—uses nested `for` loops:

```js
function callback(row, col, value) {
  /* callback body */
}

for (let row = 0; row < quadrille.height; row++) {
  for (let col = 0; col < quadrille.width; col++) {
    const value = quadrille.read(row, col);
    callback(row, col, value);
  }
}
```

While straightforward and likely familiar, this pattern is prone to [off-by-one](https://en.wikipedia.org/wiki/Off-by-one_error) and [indexing errors](https://en.wikipedia.org/wiki/Array_data_structure#Indexing), and requires additional logic for filtering. It remains a useful fallback, but the iterator methods are typically cleaner and safer.

## Method Overview

* [`visit(callback)`](visit/): iterates all cells in row-major order.
* [`visit(callback, value)`](visit_value/): iterates only cells holding exactly `value` (identity, `===`).
* [`visit(callback, collection)`](visit_collection/): iterates only cells whose value is in the given `Array` or `Set`.
* [`visit(callback, predicate)`](visit_predicate/): iterates only cells where the predicate function returns `true`.
