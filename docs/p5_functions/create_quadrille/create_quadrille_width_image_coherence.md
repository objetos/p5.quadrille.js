---
title: "createQuadrille(width, image, coherence)"
weight: 11
symbol: createQuadrille
---

Converts an `image` (a [p5.Image](https://p5js.org/reference/#/p5.Image), [p5.Graphics](https://p5js.org/reference/#/p5.Graphics), or a video [p5.MediaElement](https://p5js.org/reference/p5/p5.MediaElement/)) into a pixelated quadrille. The `coherence` parameter **must be provided** to control spatial coherence; omitting it invokes [createQuadrille(width, image)](../create_quadrille_width_image/).

## Example

```js
'use strict';
let ps;
let quadrille;
let coherence;

async function setup() {
  Quadrille.cellLength = 25;
  createCanvas(24 * Quadrille.cellLength, 24 * Quadrille.cellLength);
  ps = await loadImage('/images/pola.jpg');
  // Initialize checkbox with a label
  coherence = createCheckbox('Coherence', false)
    .position(10, 10)
    .style('color', 'white')
    .changed(update);
  // Initial quadrille setup
  update();
}

function update() {
  // Toggle coherence based on checkbox state
  quadrille = createQuadrille(24, ps, coherence.checked());
}

function draw() {
  background('orange');
  drawQuadrille(quadrille);
}
```

## Syntax

> `createQuadrille(width, image, coherence)`

## Parameters

| Param       | Description                                                                                         |
|-------------|-----------------------------------------------------------------------------------------------------|
| `width`     | Number: The total number of columns for the quadrille                                               |
| `image`     | [p5.Image](https://p5js.org/reference/#/p5.Image), [p5.Graphics](https://p5js.org/reference/#/p5.Graphics), or [p5.MediaElement](https://p5js.org/reference/p5/p5.MediaElement/): The image to be pixelated into the quadrille |
| `coherence` | Boolean: Defines whether to preserve spatial coherence when converting the image. **Required**      |
