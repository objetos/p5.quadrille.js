---
title: "clear(row, col, border)"
weight: 7
symbol: clear
---

Clears a specific cell and all connected cells **holding the same value as it** via [flood fill](https://en.wikipedia.org/wiki/Flood_fill); with `border = true`, the **rim** where the flood stops is cleared too.

## Example

(click on any cell to perform flood fill with selected border option; press any key to reset)\
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
  quadrille.clear(row, col, 4, border);
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
> **Connected means same value, and sameness is identity** (`===`) — see [clear(row, col, directions)](../clear_row_col_directions/). With `border = true`, the flood also clears the **rim**: the non-matching cells adjacent to the region, exactly where the expansion stops — the classic Minesweeper cascade, revealing the numbers that surround a cleared area.

## Syntax

> `clear(row, col, border)`

## Parameters

| Param     | Description                                                                                 |
|-----------|---------------------------------------------------------------------------------------------|
| `row`     | Number: row index of the cell to start clearing [[0..height]](../../../properties/read_write/height/)       |
| `col`     | Number: column index of the cell to start clearing [[0..width]](../../../properties/read_write/width/)      |
| `border`  | Boolean: Specifies whether to include the border of the flood fill area. Default is `false` |
