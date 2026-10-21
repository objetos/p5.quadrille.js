---
title: "merge(q1, q2, operator, row, col)"
weight: 6
symbol: merge
---

Static method that computes a new quadrille by applying a specified logical `operator` to each corresponding cell of two given quadrilles. This method serves as the foundation for higher-level logical operations, such as [or](../or/), [xor](../xor/), [and](../and/), and [diff](../diff/).

## Example 1: `and` operator

The `merge` method can be used to create higher-level logical operations. For instance, the [and](../and/) operation between two quadrilles can be implemented using `merge` to return a cell value only when both corresponding cells in `q1` and `q2` are non-empty.

```js
static and(q1, q2, row, col) {
  return this.merge(q1, q2,
                    (cell1, cell2) => cell1 && cell2 ? cell1 : null, row, col);
}
```

In this example, the `and` function checks each cell of `q1` and `q2`. If both cells are non-empty (i.e., non `null`), the result will contain the cell value from `q1`. If either cell is empty (i.e., `null`), the merged cell will also be empty.

## Example 2: `null` operator

This example implements the `null` operator (`() => null`), which produces a new quadrille with all empty cells. It demonstrates that the dimensions of the resulting quadrille span the minimum area required to cover both `q1` and `q2`.

(to move `q2` drag mouse or press **a**, **s**, **w**, **z** keys)

```js
'use strict';

const COLS = 15, ROWS = 10;
// q0 is defined as reference quadrille
let q0, q1, q2;
const col1 = 3, row1 = 4;
let col2 = 9, row2 = 3;
let opacity; // Slider for opacity
Quadrille.outlineWeight = 3;
Quadrille.cellLength = 30;

function setup() {
  createCanvas(COLS * Quadrille.cellLength, ROWS * Quadrille.cellLength);
  q0 = createQuadrille(COLS, ROWS, COLS * ROWS, color('darkkhaki'));
  q1 = createQuadrille(2, 3, 4, '👻');
  q2 = createQuadrille(3, 2, 4, '✈️');
  // Create a slider for opacity
  opacity = createSlider(0, 255, 35).position(10, height + 10);
}

function draw() {
  background(255); // Clear background
  drawQuadrille(q0, { outlineWeight: 0.5 });
  drawQuadrille(q1, { col: col1, row: row1, outline: 'yellow' });
  drawQuadrille(q2, { col: col2, row: row2, outline: 'magenta' });
  // The null operator is used to generate q3
  const q3 = Quadrille.merge(q1, q2, () => null);
  // Fill q3 with magenta and dynamic opacity
  q3.fill(color(255, 0, 255, opacity.value()));
  drawQuadrille(q3, { col: min(col1, col2), row: min(row1, row2),
                      outline: 'green', outlineWeight: 1 });
}

function mouseDragged() {
  if (mouseY > 300) return;
  row2 = q0.mouseRow;
  col2 = q0.mouseCol;
  return false; // Prevent scrolling
}

function keyPressed() {
  row2 = key === 'w' ? row2 - 1 : key === 'z' ? row2 + 1 : row2;
  col2 = key === 'a' ? col2 - 1 : key === 's' ? col2 + 1 : col2;
}
```

> **Note**
>
> **Offsets and the result's anchor.** When `row`/`col` are omitted, they're inferred from where each operand was **last drawn** (`row = row2 − row1`, `col = col2 − col1`; both operands drawn at cell-aligned positions, else `0`) — the same per-draw capture behind [mouseRow](../../properties/read_only/mouse_row/)/[mouseCol](../../properties/read_only/mouse_col/). The result spans the **union** of both operands and is anchored at the union's top-left corner — with a negative offset, `q2`'s cells land at the result's origin and `q1`'s shift down-right. That's why this example draws `q3` at `(min(row1, row2), min(col1, col2))`: re-aligning the result with the operands on screen.

## Syntax

> `Quadrille.merge(q1, q2, operator, [row], [col])`

## Parameters

| Param      | Description                                                                                   |
|------------|-----------------------------------------------------------------------------------------------|
| `q1`       | Quadrille: The first quadrille to merge                                                       |
| `q2`       | Quadrille: The second quadrille to merge                                                      |
| `operator` | Function: A function defining the logical operation for merging                               |
| `row`      | Number: The vertical displacement of `q2` relative to `q1`. Negative values are allowed[^1].  |
| `col`      | Number: The horizontal displacement of `q2` relative to `q1`. Negative values are allowed[^2].|

[^1]: Default is `row2 - row1` if both `q1` and `q2` are drawn, or `0` otherwise.
[^2]: Default is `col2 - col1` if both `q1` and `q2` are drawn, or `0` otherwise.
