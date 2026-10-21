---
title: "heatMap(hot, cold)"
weight: 6
symbol: heatMap
---

Returns this quadrille's numbers as a new **color** quadrille: `hot` at `0`, `cold` at the largest number present, [lerpColor](https://p5js.org/reference/p5/lerpColor) in between. Number cells map to colors; every other cell comes back empty, so a [reach](../../queries/reach/) field maps to exactly its reachable region — and keeps its numbers, since the result is a new quadrille.

## Example

(move the mouse to seed the field; click to regenerate the maze)\
```js
'use strict';
Quadrille.cellLength = 30;
let board;
let wall;

function setup() {
  createCanvas(15 * Quadrille.cellLength, 11 * Quadrille.cellLength);
  wall = color('#0b332b');
  board = createQuadrille(15, 11).maze(wall);
}

function draw() {
  background('#138a72');
  const field = board.reach(board.mouseRow, board.mouseCol);
  drawQuadrille(field.heatMap(color('yellow'), color('red')), { outlineWeight: 0 });
  drawQuadrille(board, { outlineWeight: 0.5 });
}

function mousePressed() {
  board.maze(wall);
}
```

> **Note**
>
> **The scale is the field's own maximum**, read per call — dimensions cannot supply it, since the same board runs a much longer distance through a maze than in the open. The ramp is anchored at `0`, not at the smallest number present: a quadrille whose numbers start at `1` never reaches full `hot`, and negatives clamp to it.

> **Note**
>
> Omitting `cold` uses the **hue complement** of `hot` (an achromatic `hot` inverts lightness instead: `heatMap(color(255))` runs white to black). Passing it is usually better — an analogous pair such as `heatMap(color('yellow'), color('red'))` reads as one gradient rather than two poles. A translucent `cold` turns the field into an overlay.

## Syntax

> `heatMap([hot], [cold])`

## Parameters

| Param  | Description                                                                                                                     |
|--------|---------------------------------------------------------------------------------------------------------------------------------|
| `hot`  | p5.Color \| String: color at `0`; default is [Quadrille.outline](../../../p5_functions/draw_quadrille/outline/) |
| `cold` | p5.Color \| String: color at the largest number; default is the hue complement of `hot`                                         |
