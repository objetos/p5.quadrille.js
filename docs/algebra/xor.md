---
title: "xor(q1, q2, row, col)"
weight: 3
symbol: xor
---

Returns a new quadrille containing all the filled cells from either the `q1` or `q2` quadrille, but not from both.

## Example

(to move `q2` drag mouse or press **a**, **s**, **w**, **z** keys)

```js
'use strict';
const COLS = 11, ROWS = 16;
// q0 is defined as reference quadrille
let q0, q1, q2;
const col1 = 2, row1 = 3;
let col2 = 6, row2 = 3;
const col3 = 2, row3 = 10;

function setup() {
  Quadrille.cellLength = 30;
  createCanvas(COLS * Quadrille.cellLength, ROWS * Quadrille.cellLength);
  q0 = createQuadrille(COLS, ROWS, COLS * ROWS, color('darkkhaki'));
  q1 = createQuadrille(2, 3, 4, '👻');
  q2 = createQuadrille(3, 2, 4, '✈️');
}

function draw() {
  drawQuadrille(q0, { outlineWeight: 0.5 });
  drawQuadrille(q1, { col: col1, row: row1, outline: 'yellow' });
  drawQuadrille(q2, { col: col2, row: row2, outline: 'magenta' });
  const q3 = Quadrille.xor(q1, q2);
  drawQuadrille(q3, { col: col3, row: row3, outline: 'green' });
  text('(row2: ' + row2 + ', col2: ' + col2 + ')', 10, 25);
}

function mouseDragged() {
  row2 = q0.mouseRow;
  col2 = q0.mouseCol;
  return false; // prevent scrolling
}

function keyPressed() {
  row2 = key === 'w' ? row2 - 1 : key === 'z' ? row2 + 1 : row2;
  col2 = key === 'a' ? col2 - 1 : key === 's' ? col2 + 1 : col2;
}
```

> **Note**
>
> Observe that the dimensions of the resulting `q3` quadrille **span the minimum area** required to cover both `q1` and `q2`. See [merge](../merge/).

> **Note**
>
> **This demo omits `row`/`col` on purpose.** When they're omitted, the offset is **inferred from where each operand was last drawn** — the same per-draw capture behind [mouseRow](../../properties/read_only/mouse_row/)/[mouseCol](../../properties/read_only/mouse_col/): `row = row2 − row1`, `col = col2 − col1` from the operands' last `drawQuadrille` cell positions (both operands drawn, at cell-aligned positions; otherwise the offset falls back to `0`). That's why dragging `q2` moves the overlap: each draw refreshes its captured position, and the algebra follows.

## Syntax

> `Quadrille.xor(q1, q2, [row], [col])`

## Parameters

| Param | Description                                                                                   |
|-------|-----------------------------------------------------------------------------------------------|
| `q1`  | Quadrille: first quadrille to merge                                                           |
| `q2`  | Quadrille: second quadrille to merge                                                          |
| `row` | Number: The vertical displacement of `q2` relative to `q1`[^1]. Negative values are allowed   |
| `col` | Number: The horizontal displacement of `q2` relative to `q1`[^2]. Negative values are allowed |

[^1]: Default is `row2 - row1` if both `q1` and `q2` are drawn, or `0` otherwise.
[^2]: Default is `col2 - col1` if both `q1` and `q2` are drawn, or `0` otherwise.
