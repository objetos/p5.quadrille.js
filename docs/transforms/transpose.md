---
title: "transpose()"
weight: 3
symbol: transpose
---

[Transposes](https://en.wikipedia.org/wiki/Transpose) the quadrille cells — rows become columns and vice versa, so dimensions swap on non-square quadrilles. Returns the quadrille (**chainable**).

## Example

(mouse click or press any key to `transpose` the quadrille)
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
  quadrille.transpose();
}

function keyPressed() {
  quadrille.transpose();
}
```

> **Note**
>
> `transpose()` is useful for performing column transformations using row commands. For instance, `q.transpose().row(col).transpose()` clones column `col`.

## Syntax

> `transpose()`
