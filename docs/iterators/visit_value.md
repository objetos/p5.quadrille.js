---
title: "visit(callback, value)"
weight: 2
symbol: visit
---

Iterates cells in **row-major** order and calls `callback({ row, col, value })` only for cells holding exactly `value` — matched by **identity** (`===`), the same story as strict [search](../../accessors/queries/search/) and the [flood](../../mutators/clear/clear_row_col_directions/) operations. Reading and mutating the grid inside the callback is allowed.

## Example

(click to randomize `q`; every `🐸` cell gets highlighted)\
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
  background('#FADBD8');
  drawQuadrille(q);
  drawQuadrille(hint);
}

function mousePressed() {
  q.randomize();
  highlight();
}

function highlight() {
  hint = createQuadrille(8, 8);
  q.visit(({ row, col }) => hint.fill(row, col, color(0, 140)), '🐸');
}
```

> **Note**
>
> * The single `value` filter visits exactly the cells whose value `=== value`.
> * **Identity matters for objects:** cells filled from one shared `color('green')` instance are all visited when filtering by that instance, while per-cell `Quadrille.factory` instances would each need their own filter. Strings, numbers, and emojis compare by value, so `'🐸'` just works.
> * Functions and `Array`/`Set` values can't be single-value filters — they dispatch as [predicate](../visit_predicate/) and [collection](../visit_collection/) filters instead.

## Syntax

```js
visit(callback, value)
```

## Parameters

| Param      | Description                                                                                                   |
| ---------- | ------------------------------------------------------------------------------------------------------------- |
| `callback` | Function called for each visited cell, receiving an object `{ row, col, value }`. Its return value is ignored |
| `value`    | Any non-function, non-collection value: only cells holding exactly this value (`===`) are visited             |
