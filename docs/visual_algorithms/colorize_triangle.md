---
title: "colorizeTriangle(args)"
weight: 7
symbol: colorizeTriangle
---

Colorize the triangle defined by vertices `vertex0 (row0, col0)`, `vertex1 (row1, col1)`, and `vertex2 (row2, col2)`, using [barycentric coordinates](https://fgiesen.wordpress.com/2013/02/06/the-barycentric-conspirac/) to interpolate `color0`, `color1` and `color2`. Implemented as:

```js
colorizeTriangle(row0, col0, row1, col1, row2, col2,
                 color0, color1 = color0, color2 = color0) {
  this.rasterizeTriangle(
          row0, col0, row1, col1, row2, col2,
          // software "fragment shader" colorizes the
          // (row0, col0), (row1, col1), (row2, col2) triangle
          ({ array: xyza }) => color(xyza),
          // vertex attributes to be interpolated (each encoded as an array):
          // vertex0 color
          [red(color0), green(color0), blue(color0), alpha(color0)],
          // vertex1 color
          [red(color1), green(color1), blue(color1), alpha(color1)],
          // vertex2 color
          [red(color2), green(color2), blue(color2), alpha(color2)]
  );
}
```

Refer to [rasterizeTriangle()](../rasterize_triangle/) when in need to interpolate other vertex data.

## Example

(press any or mouse click)
```js
'use strict';
const ROWS = 20;
const COLS = 20;
const LENGTH = 20;
let quadrille;
let row0, col0, row1, col1, row2, col2;

function setup() {
  createCanvas(COLS * LENGTH, ROWS * LENGTH);
  quadrille = createQuadrille(20, 20);
  update();
}

function draw() {
  background(0);
  drawQuadrille(quadrille, { cellLength: LENGTH, outline: 'green' });
  hint();
}

function mouseClicked() {
  update();
}

function keyPressed() {
  update();
}

function update() {
  pickCorners();
  quadrille.clear();
  quadrille.colorizeTriangle(row0, col0, row1, col1, row2, col2,
                             [255, 0, 0], [0, 255, 0], [0, 0, 255]);
}

function hint() {
  push();
  stroke('cyan');
  strokeWeight(3);
  noFill();
  triangle(col0 * LENGTH + LENGTH / 2, row0 * LENGTH + LENGTH / 2,
           col1 * LENGTH + LENGTH / 2, row1 * LENGTH + LENGTH / 2,
           col2 * LENGTH + LENGTH / 2, row2 * LENGTH + LENGTH / 2);
  pop();
}

function pickCorners() {
  col0 = int(random(0, COLS));
  row0 = int(random(0, ROWS));
  col1 = int(random(0, COLS));
  row1 = int(random(0, ROWS));
  col2 = int(random(0, COLS));
  row2 = int(random(0, ROWS));
}
```

## Syntax

> `colorizeTriangle(row0, col0, row1, col1, row2, col2, color0, [color1], [color2])`

## Parameters

| Param     | Description                                                                                            |
|-----------|--------------------------------------------------------------------------------------------------------|
| `row0`    | Number: vertex0 row coordinate                                                                         |
| `col0`    | Number: vertex0 col coordinate                                                                         |
| `row1`    | Number: vertex1 row coordinate                                                                         |
| `col1`    | Number: vertex1 col coordinate                                                                         |
| `row2`    | Number: vertex2 row coordinate                                                                         |
| `col2`    | Number: vertex2 col coordinate                                                                         |
| `color0`  | [p5.Color](https://p5js.org/reference/#/p5.Color) : vertex0 color to be interpolated                   |
| `color1`  | [p5.Color](https://p5js.org/reference/#/p5.Color) : vertex1 color to be interpolated default is `color0` |
| `color2`  | [p5.Color](https://p5js.org/reference/#/p5.Color) : vertex2 color to be interpolated default is `color0` |
