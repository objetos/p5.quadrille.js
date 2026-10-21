---
title: "mouseRow"
weight: 1
symbol: mouseRow
---

Read-only property that retrieves the quadrille row under the current mouse position — computed against where this quadrille was **last drawn**.

> **Warning**
>
> 1. `mouseRow` is computed from the position and `cellLength` this quadrille was **last drawn** with — [drawQuadrille](../../../p5_functions/draw_quadrille/) captures them per call. Before any draw, origin defaults apply (`0, 0, Quadrille.cellLength`).
> 2. It isn't constrained to lie in [0..[height](../../read_write/height/)] — guard with [isValid](../../../accessors/cell_contents/is_valid/).
> 3. To query positions other than the last-drawn one, use [screenRow](../../../accessors/queries/screen_row/) instead.

## Example

```js
'use strict';
Quadrille.cellLength = 50;
let quadrille;

function setup() {
  createCanvas(8 * Quadrille.cellLength, 8 * Quadrille.cellLength);
  quadrille = createQuadrille(8, 4);
}

function draw() {
  background('#6495ED');
  drawQuadrille(quadrille);
  text('mouseRow: ' + quadrille.mouseRow, 20, 20);
}
```

## Syntax

> number = quadrille.mouseRow
