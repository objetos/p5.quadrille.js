---
title: "graphics"
weight: 11
---

The `graphics` parameter renders quadrilles onto a custom [p5.Graphics](https://p5js.org/reference/#/p5.Graphics) buffer, enabling flexible compositing and advanced texturing.

## Example 1

(click and drag the canvas to move the quadrille graphics)\
```js
'use strict';
Quadrille.cellLength = 50;
let quadrille;
let pg;

function setup() {
  createCanvas(600, 400);
  // Create a quadrille and fill it with random emojis
  quadrille = createQuadrille(6, 4).rand(8, '🐉').rand(8, '🦄').fill('🦖');
  // Create a graphics object to render the quadrille
  pg = createGraphics(300, 200);
}

function draw() {
  background('#101010');
  // Draw the quadrille directly on the main canvas
  drawQuadrille(quadrille, { row: 2, col: 3 });
  // Draw the quadrille onto the graphics object
  drawQuadrille(quadrille, { graphics: pg });
  // Render the graphics object dynamically at the mouse position
  mouseIsPressed && image(pg, mouseX, mouseY);
}
```

> **Note**
>
> This example shows how to render a quadrille onto a `p5.Graphics` object, allowing it to be used as a dynamic image ([image()](https://p5js.org/reference/p5/image/)). The rendered graphics object can be moved independently of the main canvas, enabling layering and modular manipulation.

## Example 2

(click and drag to orbit; dynamic Game of Life pattern rendered as a 3D texture)\
```js
'use strict';
Quadrille.cellLength = 20;
let game, pattern;
let life;
let pg;

function setup() {
  // Initialize a quadrille for the Game of Life simulation
  game = createQuadrille(20, 20);
  life = color('lime');
  pattern = createQuadrille(3, 16252911n, life);
  game = Quadrille.or(game, pattern, 6, 8);
  // Set up a WEBGL canvas and a graphics object for texture rendering
  createCanvas(game.width * Quadrille.cellLength,
               game.height * Quadrille.cellLength,
               WEBGL);
  pg = createGraphics(game.width * Quadrille.cellLength,
                      game.height * Quadrille.cellLength, WEBGL);
  update();
}

function draw() {
  background('yellow');
  orbitControl(); // Enable mouse interaction for 3D view
  frameCount % 20 === 0 && update();
  noStroke();
  rotateY(PI);
  sphere(100); // Display a textured sphere
}

function update() {
  const next = game.clone();
  // Implement Game of Life rules
  game.visit(({row, col}) => {
              const count = game.ring(row, col).order;
              game.isFilled(row, col) ?
              (count < 3 || count > 4) && next.clear(row, col) :
              count === 3 && next.fill(row, col, life);
            });
  game = next;
  pg.background('blue');
  // Render the updated game state onto the graphics object
  drawQuadrille(game, { graphics: pg, outline: 'magenta', origin: CORNER });
  texture(pg); // Apply the graphics object as a texture
}
```

> **Note**
>
> This [example](https://www.sciencedirect.com/science/article/pii/S2352711024002097?ref=cra_js_challenge&fr=RR-1#sec2.3) highlights the use of a `p5.Graphics` object to render a quadrille and apply it as a 3D texture in a WEBGL environment. The quadrille represents a Game of Life simulation, with its updated state drawn onto the graphics object, decoupling the simulation from the main canvas for advanced visualization.

<!--
The **`WEBGL` mode** in **`p5.js`** has a **higher carbon footprint** due to its reliance on **GPU acceleration**, which consumes more energy. For applications that do not require 3D rendering, consider using **`PGraphics`** with **`P2D` mode** as a more **energy-efficient** and **sustainable** alternative.
-->

## Syntax

> `drawQuadrille(quadrille, { graphics })`

## Parameters

| Param    | Description                                                                                                |
|----------|------------------------------------------------------------------------------------------------------------|
| `graphics` | [p5.Graphics](https://p5js.org/reference/#/p5.Graphics): Renderer target. Defaults to `this` (main canvas) |
