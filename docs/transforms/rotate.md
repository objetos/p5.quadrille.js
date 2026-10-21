---
title: "rotate()"
weight: 2
symbol: rotate
---

π/2 **clockwise** rotation of the quadrille cells; on a non-square quadrille, `width` and `height` swap. Returns the quadrille (**chainable**).

## Example

(mouse click or press any key to `rotate` the quadrille)
```js
'use strict';
let quadrille;

function setup() {
  createCanvas(4 * Quadrille.cellLength, 4 * Quadrille.cellLength);
  quadrille = createQuadrille(4, 4, 3, '🚀');
  quadrille.rand(4, '🐒');
}

function draw() {
  background('orange');
  drawQuadrille(quadrille);
}

function mouseClicked() {
  quadrille.rotate();
}

function keyPressed() {
  quadrille.rotate();
}
```

## Syntax

> `rotate()`
