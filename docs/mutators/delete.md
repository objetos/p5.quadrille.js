---
title: "delete(row)"
weight: 1
symbol: delete
---

Deletes a row from the quadrille.

## Example

(click on any cell; press any key to reset)
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
  quadrille.delete(quadrille.mouseRow);
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

> `delete(row)`

## Parameters

| Param     | Description                                                               |
|-----------|---------------------------------------------------------------------------|
| `row`     | Number: number of row to be deleted [[0..height]](../../properties/read_write/height/) |
