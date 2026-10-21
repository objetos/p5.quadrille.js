---
title: "size"
weight: 3
symbol: size
---

Read-only property that retrieves the quadrille width times the quadrille height.

## Example

(mouse click or press any key)
```js
'use strict';
Quadrille.cellLength = 50;
let quadrille;

function setup() {
  createCanvas(8 * Quadrille.cellLength, 8 * Quadrille.cellLength);
  quadrille = createQuadrille(int(random(1, 9)), int(random(1, 9)));
}

function draw() {
  background('#6495ED');
  drawQuadrille(quadrille);
  text('size: ' + quadrille.size, 20, 20);
}

function mouseClicked() {
  quadrille = createQuadrille(int(random(1, 9)), int(random(1, 9)));
}

function keyPressed() {
  quadrille = createQuadrille(int(random(1, 9)), int(random(1, 9)));
}
```

## Syntax

> number = quadrille.size
