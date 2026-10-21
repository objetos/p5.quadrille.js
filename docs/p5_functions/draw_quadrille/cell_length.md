---
title: "Quadrille.cellLength"
weight: 1
symbol: cellLength
---

Defines the drawing cell length for quadrilles in pixels. The default is `Quadrille.cellLength`, which is `100`.

## Example

```js
'use strict';
// Set the global cell length to a fixed value of 40 pixels (default is 100)
Quadrille.cellLength = 40;
let q1, q2, q3, q4;
let localSlider, globalSlider;

function setup() {
  createCanvas(650, 330);
  q1 = createQuadrille(8, 4); // Quadrille with a resizable cell length
  q2 = createQuadrille(8, 4);
  q3 = createQuadrille(8, 4);
  q4 = createQuadrille(8, 4);
  // Local slider to adjust the cell length for q1
  localSlider = createSlider(20, 40, 30, 1);
  localSlider.position(10, 10);
  // Global slider to set the global Quadrille.cellLength
  globalSlider = createSlider(20, 40, Quadrille.cellLength, 1);
  globalSlider.position(340, 10);
  globalSlider.input(() => Quadrille.cellLength = globalSlider.value());
}

function draw() {
  background('#DFFF00');
  // Draw q1 with a cell length controlled by the local slider
  drawQuadrille(q1, { cellLength: localSlider.value() });
  // Draw q2, q3, and q4 using the global Quadrille.cellLength
  drawQuadrille(q2, { x: 330 });
  drawQuadrille(q3, { y: 170 });
  drawQuadrille(q4, { x: 330, y: 170 });
}
```

> **Note**
>
> - `q1` is drawn with a cell length controlled by the local slider (`localSlider`), initialized to `30` pixels.
> - `q2`, `q3`, and `q4` use the global `Quadrille.cellLength` set by the global slider (`globalSlider`), which is initially `40` pixels.

## Syntax

> `drawQuadrille(quadrille, { cellLength })`

## Parameters

| Param      | Description                                                                                 |
|------------|---------------------------------------------------------------------------------------------|
| `cellLength` | Number: Specifies the cell length in pixels. The default is `Quadrille.cellLength`, which is `100` |
