---
title: "trim()"
weight: 5
symbol: trim
---

Returns a new quadrille trimmed to its minimal [span](../../../properties/read_only/span/) of filled cells. Returns `undefined` if the quadrille has no filled cells.

## Example

(press mouse or press keys to randomize chess pattern)
```js
'use strict';

Quadrille.cellLength = 40;
const COLS = 8, ROWS = 8;
let board, pattern, hint;
const r = Quadrille.chessSymbols.get('r');
const k = Quadrille.chessSymbols.get('k');
const N = Quadrille.chessSymbols.get('N');

function setup() {
  createCanvas(COLS* Quadrille.cellLength, ROWS * Quadrille.cellLength);
  board = createQuadrille();
  pattern = createQuadrille(8, 8);
  update();
}

function draw() {
  background('darkkhaki');
  drawQuadrille(board, { tileDisplay: 0 });
  drawQuadrille(pattern, { textColor: 'black', tileDisplay: 0 });
  drawQuadrille(hint, { tileDisplay: 0 });
}

function keyPressed() {
  update();
}

function mousePressed() {
  update();
}

function update() {
  pattern.clear().rand(1, r).rand(1, k).rand(1, N);
  const bounds = pattern.span;
  const trimmed = pattern.trim().fill(1);
  hint = Quadrille.or(createQuadrille(8, 8), trimmed, bounds.row, bounds.col);
  hint.not(color(0, 180));
}
```

## Syntax

> `trim()`
