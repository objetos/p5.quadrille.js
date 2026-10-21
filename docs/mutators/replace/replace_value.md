---
title: "replace(value)"
weight: 1
symbol: replace
---

Replaces all **filled** cells in the quadrille with the specified `value` — empty cells are untouched: the exact complement of [fill(value)](../../fill/fill_value/), which touches only empties. Chained, they two-tone a board totally: `q.replace(red).fill(green)` turns every filled cell red and every empty cell green. Returns the quadrille (**chainable**).

## Example

(click or press any key to toggle between replacing cells and resetting)\
```js
'use strict';
Quadrille.cellLength = 40;
let quadrille;
let replaced = false;

function setup() {
  createCanvas(400, 400);
  reset();
}

function draw() {
  background('black');
  drawQuadrille(quadrille);
}

function mouseClicked() {
  replaced = !replaced;
  replaced ? quadrille.replace('🐛') : reset();
}

function keyPressed() {
  replaced = !replaced;
  replaced ? quadrille.replace('🙈') : reset();
}

function reset() {
  quadrille = createQuadrille(10, 10, 25, color('red'));
  quadrille.rand(25, color('lime')).rand(25, color('blue'));
}
```

> **Note**
>
> Like [fill(value)](../../fill/fill_value/), a non-factory `value` is stored as **one shared instance** across all replaced cells — see the identity note there: it is what makes the replaced region strict-[search](../../../accessors/queries/search/)able and floodable as one.

## Syntax

> `replace(value)`

## Parameters

| Param     | Description                                                                                                                                                        |
|-----------|--------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| `value`[^1] | Any: A valid JavaScript value                                                        |

[^1]: A plain function `value` is **stored, not called** — it becomes a per-cell display routine `({ row, col, options }) => { ... }` (see [`options`](../../../p5_functions/draw_quadrille/display_fns/)). To have a function **evaluated per cell** at replace time — a fresh object or a varied tile per cell — tag it: `Quadrille.factory(({ row, col }) => new Object(...))`.
