---
title: "fill(row, col, value, directions)"
weight: 8
symbol: fill
---

Fills a specific cell and all connected cells **holding the same value as it** with `value`, spreading in 4 or 8 `directions` via [flood fill](https://en.wikipedia.org/wiki/Flood_fill) — flooding from an **empty** cell paints the connected empty region, the classic paint bucket.

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
  quadrille.fill(row, col, 255, directions);
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
> **Connected means same value, and sameness is identity** (`===`) — the flood spreads through cells matching the start cell's value and stops at anything else; see [clear(row, col, directions)](../../clear/clear_row_col_directions/) for the identity note in full. Filling a region with the value it already holds is a no-op.

## Syntax

> `fill(row, col, value, directions)`

## Parameters

| Param        | Description                                                                                 |
|--------------|---------------------------------------------------------------------------------------------|
| `row`        | Number: row index of the cell to start filling [[0..height]](../../../properties/read_write/height/)        |
| `col`        | Number: column index of the cell to start filling [[0..width]](../../../properties/read_write/width/)       |
| `value`[^1]  | Any: A valid JavaScript value                                                               |
| `directions` | Number: Number of directions for flood fill (4 or 8), default is 4                          |

[^1]: A plain function `value` is **stored, not called** — it becomes a per-cell display routine `({ row, col, options }) => { ... }` (see [`options`](../../../p5_functions/draw_quadrille/display_fns/)). To have a function **evaluated per cell** at fill time — a fresh object or a varied tile per cell — tag it: `Quadrille.factory(({ row, col }) => new Object(...))`.
