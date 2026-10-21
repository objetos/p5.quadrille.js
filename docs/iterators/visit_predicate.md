---
title: "visit(callback, predicate)"
weight: 4
symbol: visit
---

Iterates cells in **row-major** order and calls `callback({ row, col, value })` for each cell where `predicate({ row, col, value })` returns `true`. Reading and mutating the grid inside the callback is allowed.

## Example

(move mouse to highlight `🐸` filled cells in the hovered col, and click to randomize `q`)\
```js
'use strict';
Quadrille.cellLength = 50;
let q, hint;

function setup() {
  createCanvas(8 * Quadrille.cellLength, 8 * Quadrille.cellLength);
  q = createQuadrille(8, 8).rand(15, '🐸').rand(15, '🐯').rand(15, '🐮');
  highlight();
}

function draw() {
  background('#D7BDE2');
  drawQuadrille(q);
  drawQuadrille(hint);
}

function mousePressed() {
  q.randomize();
  highlight();
}

function mouseMoved() {
  highlight();
}

function highlight() {
  hint = createQuadrille(8, 8);
  q.visit(
    ({ row, col }) => hint.fill(row, col, color(0, 140)),
    ({ value, col }) => value === '🐸' && col === q.mouseCol
  );
}
```

> **Note**
>
> * The `predicate` decides **which cells are visited** (e.g., only `🐸` in the current column).
> * The `callback` defines **what to do** with those visited cells (e.g., fill them with semi-transparent color).

## Syntax

```js
visit(callback, predicate)
```

## Parameters

| Param       | Description                                                                                                   |
| ----------- | ------------------------------------------------------------------------------------------------------------- |
| `callback`  | Function called for each visited cell, receiving an object `{ row, col, value }`. Its return value is ignored |
| `predicate` | A function `({ row, col, value }) => boolean`. Only cells for which the predicate returns `true` are visited  |
