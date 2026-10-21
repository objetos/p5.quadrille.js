---
title: "Quadrille.outline"
weight: 2
symbol: outline
---

Defines the default outline color used for drawing the quadrille cells. The default value is `Quadrille.outline`, which is `'OrangeRed'`.

## Example

```js
'use strict';
// Set a common cell length of 40 pixels for all quadrilles
Quadrille.cellLength = 40;
// Set the global outline color (default is 'OrangeRed')
let q1, q2, q3, q4;
let localPicker, globalPicker;

function setup() {
  createCanvas(650, 330);
  q1 = createQuadrille(8, 4); // Quadrille with a local outline color
  q2 = createQuadrille(8, 4);
  q3 = createQuadrille(8, 4);
  q4 = createQuadrille(8, 4);
  // Local color picker for q1
  localPicker = createColorPicker('magenta');
  localPicker.position(10, 10);
  // Global color picker to control Quadrille.outline
  globalPicker = createColorPicker(Quadrille.outline);
  globalPicker.position(340, 10);
  globalPicker.input(() => Quadrille.outline = globalPicker.value());
}

function draw() {
  background('#FFC0CB');
  // Draw q1 with the outline color set by the local picker
  drawQuadrille(q1, { outline: localPicker.value() });
  // Draw q2, q3, and q4 using the global Quadrille.outline
  drawQuadrille(q2, { x: 330 });
  drawQuadrille(q3, { y: 170 });
  drawQuadrille(q4, { x: 330, y: 170 });
}
```

> **Note**
>
> - `q1` is drawn with an outline color controlled by the local picker (`localPicker`), initialized to `'magenta'`.
> - `q2`, `q3`, and `q4` use the global `Quadrille.outline`, which can be adjusted via the global picker (`globalPicker`).

## Syntax

> `Quadrille.outline`

## Parameters

| Param    | Description                                                                      |
|----------|----------------------------------------------------------------------------------|
| `outline`  | String \| [p5.Color](https://p5js.org/reference/#/p5.Color): Specifies the color used for drawing the quadrille outline. Default is `Quadrille.outline`, which is `'OrangeRed'` |
