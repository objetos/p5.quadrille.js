---
title: "visit(callback)"
weight: 1
symbol: visit
---

Iterates **all cells** (empty ones included) in row-major order and calls `callback({ row, col, value })` for each. Reading and mutating the grid inside the callback is allowed.

## Example

(click to randomly refill `q` with `emojis`)
```js
'use strict';
Quadrille.cellLength = 50;
let q;
const emojis = ['🐸', '🐯', '🐱', '🐶', '🐮'];

function setup() {
  createCanvas(8 * Quadrille.cellLength, 8 * Quadrille.cellLength);
  q = createQuadrille(8, 8);
  update();
}

function draw() {
  background('#DAF7A6');
  drawQuadrille(q);
}

function mousePressed() {
  update();
}

function update() {
  q.visit(({ row, col }) => q.fill(row, col, random(emojis)));
}
```

> **Note**
>
> * All cells are visited in row-major order.
> * The `callback` decides what to do with each cell (e.g., refill with a random emoji).

## Syntax

```js
visit(callback)
```

## Parameters

| Param      | Description |
| ----------- | ----------- |
| `callback` | Function called for each visited cell, receiving an object `{ row, col, value }`. Its return value is ignored |
