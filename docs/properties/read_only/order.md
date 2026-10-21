---
title: "order"
weight: 4
symbol: order
---

Read-only property that retrieves the number of **filled** (non-empty) cells — the count the [createQuadrille(width, height, order, value)](../../../p5_functions/create_quadrille/create_quadrille_width_height_order_value/) `order` argument sets.

## Example

(mouse click to toggle video playback; press any key to change quadrille order & size)
```js
'use strict';
let destino; // Video variable
let quadrille;

async function setup() {
  createCanvas(400, 400);
  // Load video
  destino = await createVideo(['/videos/destino.webm']);
  destino.hide(); // Hide video controls
  quadrille = createQuadrille(8, 8, int(random(1, 64)), destino);
}

function draw() {
  background('black');
  drawQuadrille(quadrille, { cellLength: width / quadrille.width });
  fill('yellow');
  text('order: ' + quadrille.order + ', size: ' + quadrille.size, 20, 20);
}

function mouseClicked() {
  // Toggle video playback on mouse click
  destino.looping ? destino.pause() : destino.loop();
  destino.looping = !destino.looping;
}

function keyPressed() {
  const dim = int(random(1, 8));
  const cells = dim ** 2; // Equivalent to: cells = pow(dim, 2);
  const filled = int(random(1, cells));
  quadrille = createQuadrille(dim, dim, filled, destino);
}
```

## Syntax

> number = quadrille.order
