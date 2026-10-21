---
title: "row(row)"
weight: 2
symbol: row
---

Returns the specified row as a new `1 × width` quadrille — a shallow copy: cell values are **shared references** with the original. Returns `undefined` on an invalid `row`.

## Example

```js
'use strict';
Quadrille.cellLength = 30;
let quadrille, row, hint;
let lime, olive, yellow, fuchsia;

function setup() {
  createCanvas(300, 360);
  lime = color('lime');
  yellow = color('yellow');
  olive = color('olive');
  fuchsia = color('fuchsia');
  quadrille = createQuadrille(10, 10, 25, lime);
  quadrille.rand(20, olive).rand(30, yellow).fill(fuchsia);
  row = quadrille.row(0);
  hint = createQuadrille(10, 1);
}

function draw() {
  background('coral');
  drawQuadrille(quadrille, { outline: 'white', row: 0, col: 0 });
  drawQuadrille(hint, { outline: 'coral', row: quadrille.mouseRow });
  drawQuadrille(row, { outline: 'cyan', row: 11 });
}

function mouseMoved() {
  row = quadrille.row(quadrille.mouseRow) || row;
  return false;
}
```

## Syntax

> `row(row)`

## Parameters

| Param    | Description                                                                     |
|----------|---------------------------------------------------------------------------------|
| `row`    | Number: index of the row to extract [[0..height]](../../../properties/read_write/height/)       |
