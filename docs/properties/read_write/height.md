---
title: "height"
weight: 2
symbol: height
---

Quadrille height read-write property. Writing resizes in place: content is preserved, rows beyond the new height are dropped, and new rows come in empty.

## Example

(move the mouse to resize)
```js
'use strict';
Quadrille.cellLength = 50;
let quadrille;

function setup() {
  createCanvas(8 * Quadrille.cellLength, 8 * Quadrille.cellLength);
  quadrille = createQuadrille(8, 8);
}

function draw() {
  background('#6495ED');
  drawQuadrille(quadrille);
  // property read
  text('height: ' + quadrille.height, 20, 20);
}

function mouseMoved() {
  // property write
  quadrille.height = quadrille.mouseRow + 1;
}
```

## Syntax

> quadrille.height = number

> number = quadrille.height
