---
title: "insert(row)"
weight: 2
symbol: insert
---

Inserts an empty row into the quadrille.

## Example

(click any row; press any key to reset)\
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
  quadrille.insert(quadrille.mouseRow);
}

function keyPressed() {
  reset();
}

function reset() {
  quadrille = createQuadrille(20, 10, 50, color('red'));
  quadrille.rand(50, color('lime')).rand(50, color('blue'));
}
```

## Syntax

> `insert(row)`

## Parameters

| Param     | Description                                                                     |
|-----------|---------------------------------------------------------------------------------|
| `row`     | Number: number of the row to be inserted [[0..height]](../../properties/read_write/height/)] |
