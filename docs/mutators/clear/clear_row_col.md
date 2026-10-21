---
title: "clear(row, col)"
weight: 5
symbol: clear
---

Clears a specific cell in the quadrille, setting it to empty (i.e., `null`).

## Example

(click on any cell to clear it; press any key to reset)\
```js
'use strict';
Quadrille.cellLength = 20;
let quadrille;

function setup() {
  createCanvas(400, 400);
  reset();
}

function draw() {
  background('black');
  drawQuadrille(quadrille);
}

function mouseClicked() {
  const row = quadrille.mouseRow;
  const col = quadrille.mouseCol;
  quadrille.clear(row, col);
}

function keyPressed() {
  reset();
}

function reset() {
  quadrille = createQuadrille(20, 20, 100, color('red'));
  quadrille.rand(100, color('lime')).rand(100, color('blue'));
}
```

## Syntax

> `clear(row, col)`

## Parameters

| Param     | Description                                                                    |
|-----------|--------------------------------------------------------------------------------|
| `row`     | Number: row number of the cell to clear [[0..height]](../../../properties/read_write/height/)  |
| `col`     | Number: column number of the cell to clear [[0..width]](../../../properties/read_write/width/) |
