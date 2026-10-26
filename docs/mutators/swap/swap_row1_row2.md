---
title: "swap(row1, row2)"
weight: 1
symbol: swap
---

Swaps the contents of `row1` and `row2` in the `quadrille`.

## Example

(click to select rows, press `s` to swap, or `r` to randomize)
```js
'use strict';

let quadrille, hint;
let images = [];
let row1 = 0, row2 = 4; // Default active rows
let activeRow = 1; // Indicates which row (1 or 2) is updated on a click

async function setup() {
  createCanvas(500, 500);

  // Load images
  for (let i = 1; i <= 25; i++) {
    images.push(await loadImage(`/paintings/p${i}.jpg`));
  }

  // Create the quadrilles
  quadrille = createQuadrille(5, images);
  hint = createQuadrille(5, 1); // For drawing row hints
}

function draw() {
  background('DeepSkyBlue');
  // Draw the quadrille
  drawQuadrille(quadrille, { outlineWeight: 1 });
  // Draw hints for the selected rows
  drawQuadrille(hint, { outline: 'magenta', row: row1 });
  drawQuadrille(hint, { outline: 'cyan', row: row2 });
}

function mousePressed() {
  const row = quadrille.mouseRow;
  if (quadrille.isValid(row, 0)) {
    // Update the active row
    activeRow === 1 ? (row1 = row) : (row2 = row);
    activeRow = activeRow === 1 ? 2 : 1; // Alternate active row
  }
}

function keyPressed() {
  if (key === 's') {
    quadrille.swap(row1, row2); // Swap the selected rows
  }
  if (key === 'r') {
    quadrille.randomize();
  }
}
```

## Syntax

> `swap(row1, row2)`

## Parameters

| Param     | Description                              |
|-----------|------------------------------------------|
| `row1`    | Number: Index of the first row to swap   |
| `row2`    | Number: Index of the second row to swap  |
