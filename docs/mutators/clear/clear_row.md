---
title: "clear(row)"
weight: 3
symbol: clear
---

Clears an entire row in the quadrille, setting each cell in the row to empty (i.e., `null`).

## Example

(click on a row to clear it; press any key to reset)
```js
'use strict';
Quadrille.cellLength = 20;
let quadrille;

function setup() {
  createCanvas(400, 400);
  reset();
}

function draw() {
  background('black');
  drawQuadrille(quadrille);
}

function mouseClicked() {
  const row = quadrille.mouseRow;
  quadrille.clear(row);
}

function keyPressed() {
  reset();
}

function reset() {
  quadrille = createQuadrille(20, 20, 100, color('red'));
  quadrille.rand(100, color('lime')).rand(100, color('blue'));
}
```

## Syntax

> `clear(row)`

## Parameters

| Param     | Description                                                          |
|-----------|----------------------------------------------------------------------|
| `row`     | Number: The row index to clear [[0..height]](../../../properties/read_write/height/) |
