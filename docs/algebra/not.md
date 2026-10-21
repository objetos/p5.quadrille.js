---
title: "not(q, value)"
weight: 1
symbol: not
---

Returns a new quadrille by clearing `q` quadrille filled cells, and filling its empty cells with `value` (any data type instance but `undefined`).

## Example

(click on the canvas to toggle the globe)

```js
'use strict';
Quadrille.cellLength = 60;
let q;
let west;

function setup() {
  createCanvas(300, 240);
  q = createQuadrille(5, 4, 8, '🌏');
}

function draw() {
  background('purple');
  drawQuadrille(q);
}

function mouseClicked() {
  west = !west;
  q = Quadrille.not(q, west ? '🌎' : '🌏');
}
```

## Syntax

> `Quadrille.not(quadrille, value)`

## Parameters

| Param   | Description                                                                  |
|---------|------------------------------------------------------------------------------|
| `q`     | Quadrille: the quadrille to negate (clear filled cells and fill empty cells) |
| `value` | Any: the value used to fill empty cells                                      |
