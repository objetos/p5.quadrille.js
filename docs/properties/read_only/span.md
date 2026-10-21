---
title: "span"
weight: 5
symbol: span
---

Gets the smallest axis-aligned rectangle that contains all filled cells. Returns an object of the form `{ row, col, width, height }`, or `undefined` if the quadrille is entirely empty.

## Example

(mouse click to toggle emojis; press any key to randomize the quadrille)
```js
'use strict';

Quadrille.cellLength = 30;

let p, q;
let bounds;

function setup() {
  createCanvas(15 * Quadrille.cellLength, 10 * Quadrille.cellLength);
  q = createQuadrille(15, 10, 8, '😼');
  update();
}

function draw() {
  background('BlueViolet');
  drawQuadrille(q);
  bounds && drawQuadrille(p, { col: bounds.col, row: bounds.row, outline: 'yellow' });
}

function mouseClicked() {
  const row = q.mouseRow;
  const col = q.mouseCol;
  if (q.isValid(row, col)) {
    q.isFilled(row, col) ? q.clear(row, col) : q.fill(row, col, '🐦');
    update();
  }
}

function keyPressed() {
  q.randomize();
  update();
}

function update() {
  bounds = q.span;
  p = bounds && createQuadrille(bounds.width, bounds.height);
}
```

## Syntax

> `{ row, col, width, height } | undefined` = quadrille.span
