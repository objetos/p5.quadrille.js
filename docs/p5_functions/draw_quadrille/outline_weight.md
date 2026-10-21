---
title: "Quadrille.outlineWeight"
weight: 3
symbol: outlineWeight
---

Defines the default outline weight (stroke thickness) for drawing the quadrille cells. The default value is `Quadrille.outlineWeight`, which is `2`.

## Example

```js
'use strict';
// Set a common cell length of 40 pixels for all quadrilles
Quadrille.cellLength = 40;
let q1, q2, q3, q4;
let localSlider, globalSlider;

function setup() {
  createCanvas(650, 330);
  q1 = createQuadrille(8, 4); // Quadrille with a local outline weight
  q2 = createQuadrille(8, 4);
  q3 = createQuadrille(8, 4);
  q4 = createQuadrille(8, 4);
  // Slider to control q1's local outline weight
  localSlider = createSlider(1, 10, 5, 0.5);
  localSlider.position(10, 10);
  // Slider to control global Quadrille.outlineWeight
  globalSlider = createSlider(1, 10, Quadrille.outlineWeight, 0.5);
  globalSlider.position(340, 10);
  globalSlider.input(() => Quadrille.outlineWeight = globalSlider.value());
}

function draw() {
  background('lightblue');
  // Draw q1 with an outline weight controlled by the local slider
  drawQuadrille(q1, { outlineWeight: localSlider.value() });
  // Draw q2, q3, and q4 using the global Quadrille.outlineWeight
  drawQuadrille(q2, { x: 330 });
  drawQuadrille(q3, { y: 170 });
  drawQuadrille(q4, { x: 330, y: 170 });
}
```

> **Note**
>
> - `q1` is drawn with an outline weight controlled by the local slider (`localSlider`).
> - `q2`, `q3`, and `q4` use the global `Quadrille.outlineWeight`, which can be adjusted by the global slider (`globalSlider`).

## Syntax

> `drawQuadrille(quadrille, { outlineWeight })`

## Parameters

| Param         | Description                                                                            |
|---------------|----------------------------------------------------------------------------------------|
| `outlineWeight` | Number: Specifies the outline weight (stroke thickness). The default is `Quadrille.outlineWeight`, which is `2` |
