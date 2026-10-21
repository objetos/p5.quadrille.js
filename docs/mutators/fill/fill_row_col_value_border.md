---
title: "fill(row, col, value, border)"
weight: 9
symbol: fill
---

Fills a specific cell and all connected cells **holding the same value as it** with `value` via [flood fill](https://en.wikipedia.org/wiki/Flood_fill); with `border = true`, the **rim** where the flood stops is filled too.

## Example

(click on any cell to perform flood fill with selected border option; press any key to reset)
```js
'use strict';
Quadrille.cellLength = 20;
let quadrille;
let mode;

function setup() {
  createCanvas(400, 400);
  mode = createSelect();
  mode.option('flood fill without border');
  mode.option('flood fill with border');
  mode.selected('flood fill without border');
  reset();
}

function draw() {
  background('black');
  drawQuadrille(quadrille);
}

function mouseClicked() {
  const row = quadrille.mouseRow;
  const col = quadrille.mouseCol;
  const border = mode.value() === 'flood fill with border';
  quadrille.fill(row, col, 255, border);
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
> **Connected means same value, and sameness is identity** (`===`) — see [clear(row, col, directions)](../../clear/clear_row_col_directions/) for the identity note and [clear(row, col, border)](../../clear/clear_row_col_border/) for the rim semantics; here the rim is **filled** with `value` instead of cleared.

## Syntax

> `fill(row, col, value, border)`

## Parameters

| Param     | Description                                                                                 |
|-----------|---------------------------------------------------------------------------------------------|
| `row`     | Number: row index of the cell to start filling [[0..height]](../../../properties/read_write/height/)        |
| `col`     | Number: column index of the cell to start filling [[0..width]](../../../properties/read_write/width/)       |
| `value`[^1] | Any: A valid JavaScript value                                                               |
| `border`  | Boolean: Specifies whether to include the border of the flood fill area. Default is `false` |

[^1]: A plain function `value` is **stored, not called** — it becomes a per-cell display routine `({ row, col, options }) => { ... }` (see [`options`](../../../p5_functions/draw_quadrille/display_fns/)). To have a function **evaluated per cell** at fill time — a fresh object or a varied tile per cell — tag it: `Quadrille.factory(({ row, col }) => new Object(...))`.
