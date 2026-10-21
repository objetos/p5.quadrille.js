---
title: "shift(dRow, dCol, wrap)"
weight: 3
symbol: shift
---

Shifts cells by a **row/column offset**. Returns this quadrille (**chainable**).

* `dRow` moves **down** when positive; **up** when negative.
* `dCol` moves **right** when positive; **left** when negative.
* With `wrap` on (default) it **wraps around**; with `wrap` off it **slides**, leaving **empty cells** behind.

> **Note**
>
> For a **non-destructive static version**, call `Quadrille.shift(q, dRow, dCol, wrap)`.

## Example

(drag to shift; press any key to reset)
```js
'use strict';

let q;
let wrap;
let refCell;   // Cell where the mouse was first pressed (drag start anchor)
let lastCell;  // Cell from the *previous* drag step (for incremental delta)
Quadrille.outlineWeight = 1;
Quadrille.cellLength = 30;

function setup() {
  createCanvas(450, 300);
  reset();
  // Shift controls:
  wrap = createCheckbox('Wrap', true);
  wrap.position(10, 10);
  wrap.style('color', '#ddd');
}

function draw() {
  background(20);
  drawQuadrille(q);
}

function mousePressed() {
  const row = q.mouseRow;
  const col = q.mouseCol;
  if (q.isValid(row, col)) {
    refCell = { row, col };   // remember where drag started
    lastCell = { row, col };  // also initialize "previous" step here
  }
}

function mouseDragged() {
  if (!lastCell) return;
  const row = q.mouseRow;
  const col = q.mouseCol;
  if (q.isValid(row, col)) {
    // Compute delta relative to last drag step
    const dRow = row - lastCell.row;
    const dCol = col - lastCell.col;
    q.shift(dRow, dCol, wrap.checked());  // move incrementally
    lastCell = { row, col };              // update for the next step
  }
}

function mouseReleased() {
  // clear anchors after drag ends
  refCell = undefined;
  lastCell = undefined;
}

function keyPressed() {
  reset();
}

function reset() {
  // Random board so shift behavior is easy to see
  q = createQuadrille(15, 10)
    .rand(5, '🐲')
    .rand(5, '🦑')
    .rand(5, '🦜')
    .rand(5, '🐦')
    .rand(5, '🐞')
    .rand(5, '🍄');
  refCell = undefined;
  lastCell = undefined;
}
```

## Syntax

> `shift(dRow, dCol, [wrap = true])`

## Parameters

| Param  | Description                                                                                               |
| :----- | :-------------------------------------------------------------------------------------------------------- |
| `dRow` | **Number.** Rows to move: positive **down**, negative **up**                                              |
| `dCol` | **Number.** Columns to move: positive **right**, negative **left**                                        |
| `wrap` | **Boolean** (default `true`). When on, the grid wraps around; when off, it slides and leaves empty spaces |
