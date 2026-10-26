---
title: "visit(callback, collection)"
weight: 3
symbol: visit
---

Iterates cells in **row-major** order and calls `callback({ row, col, value })` for each cell whose value is contained in `collection` (`Array` or `Set`). Reading and mutating the grid inside the callback is allowed.

## Example

(click to refill `q` with random emojis; monkey cells get highlighted)
```js
'use strict';

Quadrille.cellLength = 50;
let q, hint;

const monkeys = ['🙈', '🙉', '🙊', '🦧'];
const birds = ['🐍', '🦜', '🦚', '🐤'];
const emojis = [...monkeys, ...birds, '🐸', '🐯', '🐱', '🐶', '🐮'];

function setup() {
  createCanvas(8 * Quadrille.cellLength, 8 * Quadrille.cellLength);
  highlight();
}

function draw() {
  background('#DAF7A6');
  drawQuadrille(q);
  drawQuadrille(hint);
}

function mousePressed() {
  highlight();
}

function highlight() {
  q = createQuadrille(8, 8);
  // fill q with random emojis
  q.visit(({ row, col }) => q.fill(row, col, random(emojis)));
  hint = createQuadrille(8, 8);
  // mark monkey positions
  q.visit(({ row, col }) => hint.fill(row, col, color(0, 140)), monkeys);
}
```

> **Note**
>
> * The first loop fills all cells with random emojis using [visit(callback)](../visit/).
> * The second loop visits only monkey cells, marking them in a separate quadrille.
> * Membership is matched by **identity** (`===`) — for object values (colors, images), the collection must hold the **same instances** stored in the cells; the same story as strict [search](../../accessors/queries/search/) and the single-[value](../visit_value/) filter.

## Syntax

```js
visit(callback, collection)
```

## Parameters

| Param        | Description                                                                            |
| ------------ | ---------------------------------------------------------------------------------------|
| `callback` | Function called for each visited cell, receiving an object `{ row, col, value }`. Its return value is ignored |
| `collection` | An `Array` or `Set` of values. Only cells whose value is in the collection are visited |
