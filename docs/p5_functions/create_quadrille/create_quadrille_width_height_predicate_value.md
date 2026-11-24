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

[^1]: A plain function `value` is **called once**, in the first cell it lands in, to find out what it is: if it **returns a value**, that value is the cell's content and the function is called once per cell — a fresh object or a varied tile per cell; if it **returns nothing**, the cell holds the function itself, a per-cell display routine drawn with the `options` object alone (see [`options`](../../draw_quadrille/display_fns/)). Return `null` to leave a cell empty.
