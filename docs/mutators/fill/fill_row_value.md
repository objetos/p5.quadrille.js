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

[^1]: A plain function `value` is **called once**, in the first cell it lands in, to find out what it is: if it **returns a value**, that value is the cell's content and the function is called once per cell — a fresh object or a varied tile per cell; if it **returns nothing**, the cell holds the function itself, a per-cell display routine drawn with the `options` object alone (see [`options`](../../../p5_functions/draw_quadrille/display_fns/)). Return `null` to leave a cell empty.
