---
title: "fill(row, col, value, directions, border)"
weight: 10
symbol: fill
---

Fills a specific cell and all connected cells **holding the same value as it** with `value`, spreading in 4 or 8 `directions` via [flood fill](https://en.wikipedia.org/wiki/Flood_fill); with `border = true`, the **rim** where the flood stops is filled too. The full form of the flood-fill family.

## Example

(click on any cell to perform flood fill based on selected options; press any key to reset)
```js
'use strict';
Quadrille.cellLength = 20;
let quadrille;
let mode;

function setup() {
  createCanvas(400, 400);
  mode = createSelect();
  mode.option('flood fill 4-directions');
  mode.option('flood fill 4-directions border');
  mode.option('flood fill 8-directions');
  mode.option('flood fill 8-directions border');
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
  switch (mode.value()) {
    case 'flood fill 4-directions':
      quadrille.fill(row, col, 255, 4);
      break;
    case 'flood fill 4-directions border':
      quadrille.fill(row, col, 255, 4, true);
      break;
    case 'flood fill 8-directions':
      quadrille.fill(row, col, 255, 8);
      break;
    case 'flood fill 8-directions border':
      quadrille.fill(row, col, 255, 8, true);
      break;
  }
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
> **Connected means same value, and sameness is identity** (`===`) — see [fill(row, col, value, directions)](../fill_row_col_value_directions/) and [fill(row, col, value, border)](../fill_row_col_value_border/) for the identity and rim notes.

## Syntax

> `fill(row, col, value, directions, border)`

## Parameters

| Param        | Description                                                                                          |
|--------------|------------------------------------------------------------------------------------------------------|
| `row`        | Number: row index of the cell to start filling [[0..height]](../../../properties/read_write/height/)                 |
| `col`        | Number: column index of the cell to start filling [[0..width]](../../../properties/read_write/width/)                |
| `value`[^1]  | Any: A valid JavaScript value                                                                        |
| `directions` | Number: Number of directions for flood fill (4 or 8), default is 4                                   |
| `border`     | Boolean: Specifies whether to include the border of the flood fill area. Default is `false`          |

[^1]: A plain function `value` is **stored, not called** — it becomes a per-cell display routine `({ row, col, options }) => { ... }` (see [`options`](../../../p5_functions/draw_quadrille/display_fns/)). To have a function **evaluated per cell** at fill time — a fresh object or a varied tile per cell — tag it: `Quadrille.factory(({ row, col }) => new Object(...))`.
