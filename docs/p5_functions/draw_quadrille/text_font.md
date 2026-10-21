---
title: "textFont"
weight: 7
---

Defines the default font used for drawing the text in quadrille cells. The default is the current font set in p5.js.

## Example

```js
'use strict';
// Set a common cell length of 40 pixels for all quadrilles
Quadrille.cellLength = 40;
// Set a common cell text zoom of 0.78 for all quadrilles
Quadrille.textZoom = 0.78;
let q1, q2;
let notoFont;

async function setup() {
  createCanvas(650, 160);
  // Load the Noto Serif font
  notoFont = await loadFont('/fonts/noto_serif_italic.ttf');
  // Quadrille with the Noto Serif font
  // q1 = createQuadrille(8, 'cronopiofabulosaliteratatangente');
  q1 = createQuadrille(8, 'CRONOPIOFABULOSALITERATATANGENTE');
  q2 = q1.clone();
}

function draw() {
  background('#FFC0CB');
  // Draw q1 using the Noto Serif font
  drawQuadrille(q1, { textFont: notoFont });
  // Draw q2 using the default p5.js font
  drawQuadrille(q2, { x: 330 });
}
```

> **Note**
>
> - `q1` is drawn using the Noto Serif font loaded in the async `setup()` function.
> - `q2` uses the default font set by p5.js for rendering text in quadrille cells.

## Syntax

> `drawQuadrille(quadrille, { textFont })`

## Parameters

| Param     | Description                                                                                              |
|-----------|----------------------------------------------------------------------------------------------------------|
| `textFont` | [p5.Font](https://p5js.org/reference/#/p5.Font): Specifies the font used for rendering text in cells. Default is the current p5.js font |
