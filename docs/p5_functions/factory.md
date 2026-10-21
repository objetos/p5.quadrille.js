---
title: "Quadrille.factory"
weight: 4
symbol: factory
---

Tags a function so that `fill` **runs** it once per cell and stores what it returns, instead of storing the function itself as that cell's [display routine](../draw_quadrille/display_fns/).

A function value in a quadrille is normally a display function: it is called at draw time with the cell's drawing parameters. A function that *produces* a value has no way to say so, and no amount of introspection can tell the two apart — so the tag is explicit. `Quadrille.factory(fn)` marks the function in place (`fn._isFactory = true`) and returns it; a non-function comes back unchanged.

## Example

```js
'use strict';

// A factory is run per cell, at fill time: the cell stores its RESULT.
const fruit = Quadrille.factory(({ row, col }) => ((row + col) % 2 === 0 ? '🍎' : '🍏'));

let board;

function setup() {
  createCanvas(8 * Quadrille.cellLength, 8 * Quadrille.cellLength);
  board = createQuadrille(8, 8);
  board.fill(fruit);
}

function draw() {
  background('beige');
  drawQuadrille(board, { outline: 'white', outlineWeight: 1 });
}
```

> **Note**
>
> The factory receives `{ row, col }` — enough to make a fresh object, a varied tile, or a value that depends on position. The same tag makes the `value` argument of `createQuadrille` and `fill` produce per-cell values; see [`createQuadrille(width, height, predicate, value)`](../create_quadrille/create_quadrille_width_height_predicate_value/) for the predicate form, which decides *which* cells are filled rather than *what* they hold.
