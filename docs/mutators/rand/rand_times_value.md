---
title: "rand(times, value)"
weight: 1
symbol: rand
---

Randomly fills the quadrille with the specified `value` a given number of `times`.

## Example

(numeric keys define `times`; other keys define `value`)
```js
'use strict';
Quadrille.cellLength = 30;
let times = 5;
let value, values;
let quadrille;
let p;

function setup() {
  createCanvas(12 * Quadrille.cellLength, 12 * Quadrille.cellLength);
  values = ['👻', '✈️', color('cyan'), 125, '🐒', '🐍'];
  value = '🐒';
  quadrille = createQuadrille(12, 12, 14, value);
  p = createP();
  p.html(`mouse click fills ${times} time(s) with ${value}`);
  p.style('font-size', '16px');
  p.position(10, height);
}

function draw() {
  background('black');
  drawQuadrille(quadrille);
}

function mouseClicked() {
  quadrille.rand(times, value);
  quadrille.order === quadrille.width * quadrille.height &&
                      (quadrille = createQuadrille(12, 12, 14, value));
}

function keyPressed() {
  +key ? times = +key : value = random(values);
  p.html(`mouse click fills ${times} time(s) with ${value}`);
}
```

> **Note**
>
> For deterministic (repeatable) randomness, explicitly call [randomSeed(seed)](https://p5js.org/reference/p5/randomSeed/) before `rand(times, value)`.

## Syntax

> `rand(times, value)`

## Parameters

| Param     | Description                                                                                                                |
|-----------|----------------------------------------------------------------------------------------------------------------------------|
| `times`   | Number: number of cells to fill randomly                                             |
| `value`[^1] | Any: A valid JavaScript value                                                        |

[^1]: A plain function `value` is **stored, not called** — it becomes a per-cell display routine `({ row, col, options }) => { ... }` (see [`options`](../../../p5_functions/draw_quadrille/display_fns/)). To have a function **evaluated per cell** at fill time — a fresh object or a varied tile per cell — tag it: `Quadrille.factory(({ row, col }) => new Object(...))`.
