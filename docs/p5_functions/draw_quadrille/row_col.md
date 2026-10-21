---
title: "row & col"
weight: 9
---

The `row` and `col` parameters define the position of the upper-left corner where the quadrille is drawn, in row and column units.

## Example

(move the mouse to position `q`)
```js
'use strict';
// q0 is the reference quadrille
let q0, q;

function setup() {
  createCanvas(6 * Quadrille.cellLength, 4 * Quadrille.cellLength);
  q0 = createQuadrille(6, 4);
  q = createQuadrille(3, 58n, color('blue'));
}

function draw() {
  background('orange');
  drawQuadrille(q0);
  drawQuadrille(q, { row: q0.mouseRow, col: q0.mouseCol, outline: 'lime' });
}
```

> **Note**
>
> The [mouseRow](../../../properties/read_only/mouse_row/) and [mouseCol](../../../properties/read_only/mouse_col/) Quadrille properties are used to dynamically position the `q` quadrille based on the mouse location.

## Syntax

> `drawQuadrille(quadrille, { row, col })`

## Parameters

| Param | Description                                                   |
|-------|---------------------------------------------------------------|
| `row` | Number: The row position of the upper-left corner in units    |
| `col` | Number: The column position of the upper-left corner in units |
