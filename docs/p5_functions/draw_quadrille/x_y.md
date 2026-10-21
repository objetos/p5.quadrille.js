---
title: "x & y"
weight: 8
---

The `x` and `y` parameters define the upper-left corner where the quadrille is drawn, in pixels.

## Example

(move the mouse to position `q`)\
```js
'use strict';
// q0 is the reference quadrille
let q0, q;

function setup() {
  createCanvas(6 * Quadrille.cellLength, 4 * Quadrille.cellLength);
  q0 = createQuadrille(6, 4);
  q = createQuadrille(3, 58n, color('blue'));
}

function draw() {
  background('orange');
  drawQuadrille(q0);
  drawQuadrille(q, { x: mouseX, y: mouseY, outline: 'lime' });
}
```

## Syntax

> `drawQuadrille(quadrille, { x, y })`

## Parameters

| Param | Description                                                 |
|-------|-------------------------------------------------------------|
| `x`   | Number: The x-coordinate of the upper-left corner in pixels |
| `y`   | Number: The y-coordinate of the upper-left corner in pixels |
