---
title: "clear(row, col, directions)"
weight: 6
symbol: clear
---

Clears a specific cell and all connected cells **holding the same value as it**, spreading in 4 or 8 `directions` via [flood fill](https://en.wikipedia.org/wiki/Flood_fill).

## Example

(click on any cell to perform flood fill based on selected directions; press any key to reset)
```js
'use strict';
Quadrille.cellLength = 20;
let quadrille;
let mode;

function setup() {
  createCanvas(400, 400);
  mode = createSelect();
  mode.option('flood fill 4-directions');
  mode.option('flood fill 8-directions');
  mode.selected('flood fill 4-directions');
  reset();
}

function draw() {
  background('black');
  drawQuadrille(quadrille);
}

function mouseClicked() {
  const row = quadrille.mouseRow;
  const col = quadrille.mouseCol;
  const directions = mode.value() === 'flood fill 4-directions' ? 4 : 8;
  quadrille.clear(row, col, directions);
}

function keyPressed() {
  reset();
}

function reset() {
  quadrille = createQuadrille(20, 20, 100, color('red'));
  quadrille.rand(100, color('lime')).rand(100, color('blue'));
}
```

> **Note**
>
> **Connected means same value, and sameness is identity.** The flood expands only through cells holding the start cell's exact value (`===`) and stops at anything else. Cells filled by one [fill(value)](../../fill/fill_value/) call share one instance and flood as one region; per-cell instances — e.g. a fresh `color('green')` per cell via `Quadrille.factory` — would stop the flood at every cell. Flood-clearing from an **empty** cell is a no-op: the region's value is already the cleared one.

## Syntax

> `clear(row, col, directions)`

## Parameters

| Param        | Description                                                                            |
|--------------|----------------------------------------------------------------------------------------|
| `row`        | Number: row index of the cell to start clearing [[0..height]](../../../properties/read_write/height/)  |
| `col`        | Number: column index of the cell to start clearing [[0..width]](../../../properties/read_write/width/) |
| `directions` | Number: Number of directions for flood fill (4 or 8), default is 4                     |
