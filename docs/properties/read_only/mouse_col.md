---
title: "mouseCol"
weight: 2
symbol: mouseCol
---

Read-only property that retrieves the quadrille col under the current mouse position — computed against where this quadrille was **last drawn**.

> **Warning**
>
> 1. `mouseCol` is computed from the position and `cellLength` this quadrille was **last drawn** with — [drawQuadrille](../../../p5_functions/draw_quadrille/) captures them per call. Before any draw, origin defaults apply (`0, 0, Quadrille.cellLength`).
> 2. It isn't constrained to lie in [0..[width](../../read_write/width/)] — guard with [isValid](../../../accessors/cell_contents/is_valid/).
> 3. To query positions other than the last-drawn one, use [screenCol](../../../accessors/queries/screen_col/) instead.

## Example

```js
'use strict';
Quadrille.cellLength = 50;
let quadrille;

function setup() {
  createCanvas(8 * Quadrille.cellLength, 8 * Quadrille.cellLength);
  quadrille = createQuadrille(4, 8);
}

function draw() {
  background('#6495ED');
  drawQuadrille(quadrille);
  text('mouseCol: ' + quadrille.mouseCol, 20, 20);
}
```

## Syntax

> number = quadrille.mouseCol
