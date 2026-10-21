---
title: "width"
weight: 1
symbol: width
---

Quadrille width read-write property. Writing resizes in place: content is preserved, columns beyond the new width are dropped, and new columns come in empty.

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
  text('width: ' + quadrille.width, 20, 20);
}

function mouseMoved() {
  // property write
  quadrille.width = quadrille.mouseCol + 1;
}
```

## Syntax

> quadrille.width = number

> number = quadrille.width
