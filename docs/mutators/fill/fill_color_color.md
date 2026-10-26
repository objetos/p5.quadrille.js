---
title: "fill(color1, color2)"
weight: 4
symbol: fill
---

Fills **all** cells in the quadrille with a chessboard pattern using the given colors — `color1` for the light squares, `color2` for the dark — overwriting any current content (the custom-color sibling of [fill()](../fill_noargs/), which uses the global `Quadrille.lightSquare`/`Quadrille.darkSquare`).

## Example

(click or press any key to toggle between filling and clearing the quadrille)
```js
'use strict';
Quadrille.cellLength = 20;
let board = true;
let quadrille;

function setup() {
  createCanvas(400, 400);
  quadrille = createQuadrille(20, 20);
  quadrille.fill('cyan', 'red');  // create a chessboard pattern with given colors
}

function draw() {
  background('black');
  drawQuadrille(quadrille, { tileDisplay: board ? 0 : Quadrille.tileDisplay });
}

function mouseClicked() {
  board = !board;
  board ? quadrille.fill('cyan', 'red') : quadrille.clear();
}

function keyPressed() {
  board = !board;
  board ? quadrille.fill('cyan', 'red') : quadrille.clear();
}
```

## Syntax

> `fill(color1, color2)`

## Parameters

| Param  | Description                                                                                    |
|--------|------------------------------------------------------------------------------------------------|
| `color1` | [p5.Color](https://p5js.org/reference/#/p5.Color) \| String: The color used for the light squares of the chessboard pattern. Can be a `p5.Color` instance or an HTML color string (e.g., `'red'`, `'#ff0000'`, `'rgb(255,0,0)'`) |
| `color2` | [p5.Color](https://p5js.org/reference/#/p5.Color) \| String: The color used for the dark squares of the chessboard pattern. Can be a `p5.Color` instance or an HTML color string                                                |
