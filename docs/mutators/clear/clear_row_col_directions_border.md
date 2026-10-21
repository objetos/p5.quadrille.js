---
title: "clear(row, col, directions, border)"
weight: 8
symbol: clear
---

Clears a specific cell and all connected cells **holding the same value as it**, spreading in 4 or 8 `directions` via [flood fill](https://en.wikipedia.org/wiki/Flood_fill); with `border = true`, the **rim** where the flood stops is cleared too. The full form of the flood-clear family.

## Example

(click on any cell to perform flood fill based on selected options; press any key to reset)\
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
  switch(mode.value()) {
    case 'flood fill 4-directions':
      quadrille.clear(row, col, 4);
      break;
    case 'flood fill 4-directions border':
      quadrille.clear(row, col, 4, true);
      break;
    case 'flood fill 8-directions':
      quadrille.clear(row, col, 8);
      break;
    case 'flood fill 8-directions border':
      quadrille.clear(row, col, 8, true);
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
> **Connected means same value, and sameness is identity** (`===`) — see [clear(row, col, directions)](../clear_row_col_directions/) for the identity note and [clear(row, col, border)](../clear_row_col_border/) for the rim semantics.

## Syntax

> `clear(row, col, directions, border)`

## Parameters

| Param        | Description                                                                                 |
|--------------|---------------------------------------------------------------------------------------------|
| `row`        | Number: row index of the cell to start clearing [[0..height]](../../../properties/read_write/height/)       |
| `col`        | Number: column index of the cell to start clearing [[0..width]](../../../properties/read_write/width/)      |
| `directions` | Number: Number of directions for flood fill (4 or 8), default is 4                          |
| `border`     | Boolean: Specifies whether to include the border of the flood fill area. Default is `false` |
