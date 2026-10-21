---
title: "memory2D"
weight: 3
symbol: memory2D
---

Quadrille memory read-write property. Always returns a rectangular, matrix-like array where empty cells are filled with `null` (even if they were set as `undefined` — or left as holes — when `memory2D` was assigned).

## Example

(mouse click or press any key)
```js
'use strict';
let quadrille;
let img;

async function setup() {
  createCanvas(4 * Quadrille.cellLength, 4 * Quadrille.cellLength);
  img = await loadImage('/images/pola.jpg'); // Load an image
  quadrille = createQuadrille(4, 4); // Create a 4x4 Quadrille
}

function draw() {
  background('#6495ED'); // Light blue background
  drawQuadrille(quadrille); // Draw the Quadrille
}

function mouseClicked() {
  // Write new memory structure
  quadrille.memory2D = [
    [150, img], // Fill with numbers and image
    [null, '🫏'], // The null represents an empty cell
    [0, 70],
    ['🦂']
  ];
  // Read and log the clicked cell value
  console.log(quadrille.memory2D[quadrille.mouseRow][quadrille.mouseCol]);
}

function keyPressed() {
  // Write a different memory structure (1D converted to square)
  quadrille.memory2D = ['🫏', '🐍', '🦂', '🐵'];
  // Read and log the clicked row
  console.log(quadrille.memory2D[quadrille.mouseRow]);
}
```

## Syntax

> quadrille.memory2D = arr

> arr = quadrille.memory2D
