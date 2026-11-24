---
title: "fill(predicate, value)"
weight: 3
symbol: fill
---

Fills cells matching a predicate condition with the specified `value`.

## Example

(move the mouse to fill empty cells in the current row with `🐉`; click to reset)
```js
'use strict';

Quadrille.cellLength = 40;
let quadrille;

function setup() {
  createCanvas(400, 400);
  reset();
}

function draw() {
  background('black');
  drawQuadrille(quadrille);
}

function mouseMoved() {
  quadrille.fill(({ row, col, value }) => row === quadrille.mouseRow && value === null, '🐉');
}

function mouseClicked() {
  reset();
}

function reset() {
  quadrille = createQuadrille(10, 10, 15, color('purple'));
  quadrille.rand(15, color('orange')).rand(15, color('yellow'));
}
```

## Syntax

> `fill(predicate, value)`

## Parameters

| Param       | Description                                                                               |
| ----------- | ----------------------------------------------------------------------------------------- |
| `predicate` | Function: A predicate function `({ row, col, value }) => boolean` selecting cells to fill |
| `value`[^1] | Any: A valid JavaScript value                                                             |

[^1]: A plain function `value` is **called once**, in the first cell it lands in, to find out what it is: if it **returns a value**, that value is the cell's content and the function is called once per cell — a fresh object or a varied tile per cell; if it **returns nothing**, the cell holds the function itself, a per-cell display routine drawn with the `options` object alone (see [`options`](../../../p5_functions/draw_quadrille/display_fns/)). Return `null` to leave a cell empty.
