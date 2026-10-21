---
title: "createQuadrille(width, height, predicate, value)"
weight: 12
symbol: createQuadrille
---

Creates a quadrille of the specified size and fills each cell **only if** the given `predicate({ row, col })` returns true. The filled cells are assigned the provided `value`.

This method is ideal for generating patterns like diagonals, borders, checkerboards, or any logical layout based on cell position.

## Example

(fill the two diagonals with 🌀 symbols)
```js
'use strict';
Quadrille.cellLength = 50;
let q;

function setup() {
  createCanvas(8 * Quadrille.cellLength, 8 * Quadrille.cellLength);
  q = createQuadrille(8, 8, ({ row, col }) => row === col || row + col === 7, '🌀');
}

function draw() {
  background('beige');
  drawQuadrille(q);
}
```

## Syntax

> `createQuadrille(width, height, predicate, value)`

## Parameters

| Param       | Description                                                                       |
| ----------- | --------------------------------------------------------------------------------- |
| `width`     | Number: total number of columns in the quadrille                                  |
| `height`    | Number: total number of rows in the quadrille                                     |
| `predicate` | Function: receives `{ row, col }` and returns `true` if the cell should be filled |
| `value`[^1] | Any: the value to assign to matching cells. Can be a literal, function, or object |

[^1]: A plain function `value` is **stored, not called** — it becomes a per-cell display routine `({ row, col, options }) => { ... }` (see [`options`](../../draw_quadrille/display_fns/)). To have a function **evaluated per cell** at creation time — a fresh object or a varied tile per cell — tag it: `Quadrille.factory(({ row, col }) => new Object(...))`.
