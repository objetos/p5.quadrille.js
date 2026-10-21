---
title: "reflect()"
weight: 1
symbol: reflect
---

Reflects the quadrille across its **horizontal axis** — top and bottom rows swap (a vertical flip). Returns the quadrille (**chainable**).

## Example

(mouse click or press any key to `reflect` the quadrille)
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
  quadrille.reflect();
}

function keyPressed() {
  quadrille.reflect();
}
```

## Syntax

> `reflect()`
