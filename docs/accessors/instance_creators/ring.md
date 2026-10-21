---
title: "ring(row, col, dimension, wrap)"
weight: 4
symbol: ring
---

Returns a new quadrille representing the **square block of cells** of radius `dimension` centered at `(row, col)` — the **center cell included**. Sugar over [crop](../crop/): `crop(row - dimension, col - dimension, 2·dimension + 1, 2·dimension + 1, wrap)`. When `wrap` is `true`, indices wrap toroidally across borders; when `false` (default), out-of-bounds positions are treated as empty. The result has size `(2·dimension + 1) × (2·dimension + 1)`.

## Example

(click on canvas, move mouse and press keys **1** to **4**)
```js
'use strict';

Quadrille.cellLength = 20;
let quadrille, block, hint;
let dimension = 1;
let lime, olive, yellow, fuchsia;
let wrap;

function setup() {
  createCanvas(400, 200);
  lime = color('lime');
  yellow = color('yellow');
  olive = color('olive');
  fuchsia = color('fuchsia');
  quadrille = createQuadrille(10, 10, 25, lime);
  quadrille.rand(20, olive).rand(30, yellow).fill(fuchsia);
  hint = createQuadrille(dimension * 2 + 1, dimension * 2 + 1);
  wrap = createCheckbox(' wrap', false);
  wrap.position(400 - 70, 200 - 22);
  wrap.changed(() => update());
  update();
}

function draw() {
  background('coral');
  drawQuadrille(quadrille, { outline: 'white', row: 0, col: 0 });
  drawQuadrille(hint, { outline: 'cyan', row: quadrille.mouseRow - dimension,
                        col: quadrille.mouseCol - dimension });
  drawQuadrille(block, { outline: 'cyan', row: 0, col: 11 });
  text('dimension ' + dimension, 210, 195);
}

function mouseMoved() {
  update();
}

function keyPressed() {
  // convert string to number using +
  dimension = +key;
  dimension = constrain(dimension ||= 1, 1, 4);
  hint.width = hint.height = dimension * 2 + 1;
  update();
}

function update() {
  block = quadrille.ring(quadrille.mouseRow,
                         quadrille.mouseCol,
                         dimension,
                         wrap.checked());
}
```

> **Note**
>
> **The ring includes its center**, so on a filled center `ring(row, col).order` counts the center too. The Minesweeper counting idiom — `mines.ring(row, col).order` as the neighbor-mine count — works because it is computed only on **empty** centers; and since out-of-bounds pads as empty ([crop](../crop/) semantics, `wrap = false`), edge cells simply count fewer neighbors, no special-casing needed.

## Syntax

> `ring(row, col, [dimension = 1], [wrap = false])`

## Parameters

| Param       | Description                                                                   |
|-------------|-------------------------------------------------------------------------------|
| `row`       | Number: row index of the center cell [[0..height]](../../../properties/read_write/height/)      |
| `col`       | Number: column index of the center cell [[0..width]](../../../properties/read_write/width/)     |
| `dimension` | Number: radius (≥ 0); the result is `(2·dimension + 1)²`. Default is 1        |
| `wrap`      | Boolean: when `true`, indices wrap toroidally at borders; when `false` (default), out-of-bounds cells are taken as empty |
