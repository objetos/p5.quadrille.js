---
title: "magnitude(row)"
weight: 2
symbol: magnitude
---

Returns the number of non-empty cells of a given quadrille row.

## Example

```js
'use strict';
Quadrille.cellLength = 50;
let quadrille;

function setup() {
  createCanvas(8 * Quadrille.cellLength, 8 * Quadrille.cellLength);
  quadrille = createQuadrille(int(random(3, 9)), int(random(3, 9)));
  quadrille.rand(int(quadrille.size * 0.6), '🐍');
}

function draw() {
  background('#6495ED');
  drawQuadrille(quadrille);
  text(`magnitude(${quadrille.mouseRow}): ` +
        quadrille.magnitude(quadrille.mouseRow), 20, 20);
}
```

## Syntax

> `magnitude(row)`

## Parameters

| Param    | Description                                                                     |
|----------|---------------------------------------------------------------------------------|
| `row`    | Number: row whose filled cells are counted [[0..height]](../../../properties/read_write/height/) |
