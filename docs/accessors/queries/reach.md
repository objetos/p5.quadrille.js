---
title: "reach(row, col, directions)"
weight: 4
symbol: reach
---

Returns the seed cell's reach as a **number-field quadrille** — `0` at the seed, steps-to-reach elsewhere, and empty where out of reach — computed as a [breadth-first](https://en.wikipedia.org/wiki/Breadth-first_search) wavefront over any quadrille: filled cells are obstacles, empty cells are passable. The field renders as gray levels for free, and one field serves any number of agents: compute it from the *target* and every agent descends it. Seeding on a filled or invalid cell yields a fully empty field — an agent cannot stand in a wall.

> **Note**
>
> The wavefront has a name and a paper. `reach` is the expansion half of [Lee's algorithm](https://en.wikipedia.org/wiki/Lee_algorithm), published in 1961 for routing wires on circuit boards; [path](../path/) is its backtrace half. It is exact for unit step cost, which is all a grid of passable and impassable cells has. [Dijkstra](https://en.wikipedia.org/wiki/Dijkstra%27s_algorithm) generalizes it to weighted edges and [A*](https://en.wikipedia.org/wiki/A*_search_algorithm) prunes it toward a single target with a heuristic — both give up the property that makes this call worth having, which is that the field answers **every** target at once.
>
> Lee, C. Y. (1961). *An Algorithm for Path Connections and Its Applications.* IRE Transactions on Electronic Computers **EC-10**(3), 346–365.

## Example

(move the mouse to seed the field; press **d** to toggle 4- and 8-direction; click to regenerate the maze)
```js
'use strict';
Quadrille.cellLength = 30;
let board;
let wall;
let dirs = 4;

function setup() {
  createCanvas(15 * Quadrille.cellLength, 11 * Quadrille.cellLength);
  wall = color('#0b332b');
  board = createQuadrille(15, 11).maze(wall);
}

function draw() {
  background('#138a72');
  const field = board.reach(board.mouseRow, board.mouseCol, dirs);
  drawQuadrille(field, {
    outlineWeight: 0,
    numberDisplay: ({ value, cellLength }) => {
      noStroke();
      fill(constrain(255 - 5 * value, 40, 255));
      rect(0, 0, cellLength, cellLength);
    }
  });
  drawQuadrille(board, { outlineWeight: 0.5 });
  noStroke();
  fill('magenta');
  text(`${dirs}-dir`, 6, 14);
}

function keyPressed({ key }) {
  if (key === 'd' || key === 'D') dirs = dirs === 4 ? 8 : 4;
}

function mousePressed() {
  board.maze(wall);
}
```

> **Note**
>
> The wavefront brightens toward the seed (`0` renders lightest under this `numberDisplay` override) and vanishes where it cannot go: hover a wall — or leave the board — and the field goes fully empty. Press **d** to flip between **4** and **8 directions** without moving the seed: with **8** the wave cuts corners, mirroring [flood fill](https://en.wikipedia.org/wiki/Flood_fill) semantics, so the same seed on the same maze reaches visibly farther; any other `directions` value warns and falls back to `4`.

> **Note**
>
> The override above is one line as a *derivation*: [heatMap(hot, cold)](../../instance_creators/heat_map/) returns the field as a color quadrille, ramped by its own maximum, which then draws with no display param at all. Keep the override when the ramp is doing something a scale cannot — gating on a scalar, say.

> **Note**
>
> `reach` is defined and meaningful on **any** quadrille, not only mazes: on a game board it is pathfinding distance around the pieces; on an empty quadrille it is plain grid distance. Its natural companion is [path](../path/), which descends the field.

> **Note**
>
> Emptiness is the field's failure signal, and it composes with the [read](../../cell_contents/read/) convention: `field.isEmpty(row, col)` reads as *out of reach* — including out-of-bounds cells, since an out-of-bounds `read` returns `undefined`, which counts as empty.

## Syntax

> `reach(row, col, [directions = 4])`

## Parameters

| Param        | Description                                                                                   |
|--------------|-----------------------------------------------------------------------------------------------|
| `row`        | Number: seed row index [[0..height]](../../../properties/read_write/height/)                                    |
| `col`        | Number: seed column index [[0..width]](../../../properties/read_write/width/)                                   |
| `directions` | Number: neighborhood, `4` (default) or `8` (corner-cutting); other values warn and fall back to `4` |
