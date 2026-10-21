---
title: "fill(row, value)"
weight: 5
symbol: fill
---

Fills an entire row in the quadrille with the specified `value`.

## Example

(click on a row to fill it with white; press any key to reset)
```js
'use strict';
Quadrille.cellLength = 20;
let quadrille;

function setup() {
  createCanvas(400, 400);
  reset();
}

function draw() {
  background('black');
  drawQuadrille(quadrille);
}

function mouseClicked() {
  const row = quadrille.mouseRow;
  quadrille.fill(row, 255);
}

function keyPressed() {
  reset();
}

function reset() {
  quadrille = createQuadrille(20, 20, 100, color('red'));
  quadrille.rand(100, color('lime')).rand(100, color('blue'));
}
```

## Syntax

> `fill(row, value)`

## Parameters

| Param     | Description                                                                     |
|-----------|---------------------------------------------------------------------------------|
| `row`     | Number: The row index to fill [[0..height]](../../../properties/read_write/height/)             |
| `value`[^1] | Any: A valid JavaScript value                                                   |

[^1]: A plain function `value` is **stored, not called** — it becomes a per-cell display routine `({ row, col, options }) => { ... }` (see [`options`](../../../p5_functions/draw_quadrille/display_fns/)). To have a function **evaluated per cell** at fill time — a fresh object or a varied tile per cell — tag it: `Quadrille.factory(({ row, col }) => new Object(...))`.
