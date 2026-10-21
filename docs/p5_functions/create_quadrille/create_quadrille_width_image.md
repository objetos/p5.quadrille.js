---
title: "createQuadrille(width, image)"
weight: 10
symbol: createQuadrille
---

Converts an `image` (a [p5.Image](https://p5js.org/reference/#/p5.Image), [p5.Graphics](https://p5js.org/reference/#/p5.Graphics)) or video [p5.MediaElement](https://p5js.org/reference/p5/p5.MediaElement/) into a quadrille with the specified number of columns (`width`), pixelating the image into cells.

## Example

```js
'use strict';
let ps;
let quadrille;

async function setup() {
  Quadrille.cellLength = 25;
  createCanvas(24 * Quadrille.cellLength, 24 * Quadrille.cellLength);
  ps = await loadImage('/images/pola.jpg');
  quadrille = createQuadrille(24, ps);
}

function draw() {
  background('orange');
  drawQuadrille(quadrille);
}
```

> **Note**
>
> `createQuadrille(width, image)` converts an image into a quadrille, with each cell representing a sub-image.

## Syntax

> `createQuadrille(width, image)`

## Parameters

| Param  | Description                                                                                         |
|--------|-----------------------------------------------------------------------------------------------------|
| `width`  | Number: The total number of columns for the quadrille                                               |
| `image`  | [p5.Image](https://p5js.org/reference/#/p5.Image), [p5.Graphics](https://p5js.org/reference/#/p5.Graphics) or video [p5.MediaElement](https://p5js.org/reference/p5/p5.MediaElement/): The image to be pixelated into the quadrille |
