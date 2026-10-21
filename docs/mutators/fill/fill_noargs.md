---
title: "fill()"
weight: 1
symbol: fill
---

Fills all cells in the quadrille with a chessboard pattern.

## Example

```js
'use strict';
// Set the cell size (default is 100, changed to 20 here)
Quadrille.cellLength = 20;
// Disable the tile display algorithm
Quadrille.tileDisplay = 0;
let q1, q2;

function setup() {
  createCanvas(34 * Quadrille.cellLength, 16 * Quadrille.cellLength);
  // Create and fill the first quadrille
  q1 = createQuadrille(16, 16);
  q1.fill();
  // Set global colors for the chessboard pattern
  Quadrille.lightSquare = '#EBECCF'; // Light square color (chess.com)
  Quadrille.darkSquare = '#769555';  // Dark square color (chess.com)
  // Create and fill the second quadrille using method chaining
  q2 = createQuadrille(16, 16).fill();
}

function draw() {
  // Draw the first quadrille
  drawQuadrille(q1);
  // Draw the second quadrille with an x-offset of 330 pixels
  drawQuadrille(q2, { x: 330 });
}
```

## Syntax

> `fill()`

## Parameters

| Param                 | Description                                                                                             |
|-----------------------|---------------------------------------------------------------------------------------------------------|
| `Quadrille.lightSquare` | String \| [p5.Color](https://p5js.org/reference/#/p5.Color): Global color for the light squares. Accepts an HTML color string (e.g., `'red'`, `'#ff0000'`, `'rgb(255,0,0)'`) or a `p5.Color` instance. Default is `#FDCDAA` |
| `Quadrille.darkSquare`  | String \| [p5.Color](https://p5js.org/reference/#/p5.Color): Global color for the dark squares. Accepts an HTML color string or a `p5.Color` instance. Default is `#D28C45` |
