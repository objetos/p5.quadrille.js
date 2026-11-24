---
title: "fill(row, col, value)"
weight: 7
symbol: fill
---

Fills a specific cell in the quadrille with the specified `value`.

## Example

(click on any cell to fill it with white; press any key to reset)
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
  const col = quadrille.mouseCol;
  quadrille.fill(row, col, 255);
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

> `fill(row, col, value)`

## Parameters

| Param     | Description                                                                          |
|-----------|--------------------------------------------------------------------------------------|
| `row`     | Number: row number of the cell to fill [[0..height]](../../../properties/read_write/height/)         |
| `col`     | Number: column number of the cell to fill [[0..width]](../../../properties/read_write/width/)        |
| `value`[^1] | Any: A valid JavaScript value                                                        |

[^1]: A plain function `value` is **called once**, in the first cell it lands in, to find out what it is: if it **returns a value**, that value is the cell's content and the function is called once per cell — a fresh object or a varied tile per cell; if it **returns nothing**, the cell holds the function itself, a per-cell display routine drawn with the `options` object alone (see [`options`](../../../p5_functions/draw_quadrille/display_fns/)). Return `null` to leave a cell empty.
