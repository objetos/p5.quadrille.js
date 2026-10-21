---
title: "rasterize(args)"
weight: 4
symbol: rasterize
---

Rasterize quadrille according to upper-left corner vertex `array0`, bottom-left corner vertex `array1`, upper-right corner vertex `array2`, and bottom-right corner vertex `array3`,  using (fragment) `shader`. Call [rasterizeTriangle()](../rasterize_triangle/) on the two non-overlapping triangles entirely covering the quadrille.

## Example

```js
'use strict';
const ROWS = 20;
const COLS = 20;
const LENGTH = 20;
let quadrille;

function setup() {
  createCanvas(COLS * LENGTH, ROWS * LENGTH);
  quadrille = createQuadrille(20, 20);
  // /*
  quadrille.rasterize(colorizeShader,
                      [255, 0, 0],
                      [0, 255, 0],
                      [0, 0, 255],
                      [255, 255, 0]);
  // */
  /*
  quadrille.rasterize(colorizeShader,
                      [255, 0, 0, 7, 4],
                      [0, 255, 0, -1, -10],
                      [0, 0, 255, 5, 8],
                      [255, 255, 0, -1, -10]);
  // */
}

function draw() {
  drawQuadrille(quadrille, { cellLength: LENGTH, outline: 'green' });
}

// /*
function colorizeShader({ array: rgb }) {
  return color(rgb);
}
// */

/*
// pretty similar to what p5.Quadrille.colorizeTriangle does
function colorizeShader({ array: mixin }) {
  let rgb = mixin.slice(0, 3);
  // debug 2d normal
  console.log(mixin.slice(3));
  // use interpolated color as is
  return color(rgb);
}
// */
```

## Syntax

> `rasterize(shader, array0, [array1], [array2], [array3])`

## Parameters

| Param     | Description                                                                                             |
|-----------|---------------------------------------------------------------------------------------------------------|
| `shader`  | Function: taking `{ array: interpolated_data_array, row: i, col: j }` params and returning a `p5.Color` |
| `array0`  | Array: corner0 attributes to be interpolated                                                            |
| `array1`  | Array: corner1 attributes to be interpolated default is `array0`                                        |
| `array2`  | Array: corner2 attributes to be interpolated default is `array0`                                        |
| `array3`  | Array: corner3 attributes to be interpolated default is `array0`                                        |
