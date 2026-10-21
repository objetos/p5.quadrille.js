---
title: "maze(value)"
weight: 5
symbol: maze
---

Clears the quadrille, then generates a [perfect maze](https://en.wikipedia.org/wiki/Maze_generation_algorithm) at the current dimensions, filling wall cells with `value` — the maze analogue of the zero-arg [fill()](../fill/fill_noargs/) chessboard. The generator is an iterative [randomized depth-first search](https://en.wikipedia.org/wiki/Maze_generation_algorithm#Iterative_implementation_%28with_explicit_stack%29) over the room lattice. Walls are filled cells and corridors are empty cells, so [reach](../../accessors/queries/reach/) and [path](../../accessors/queries/path/) work on the result out of the box. Rooms sit at even `(row, col)` indices, cell `(0, 0)` is always open, and the maze is borderless: the quadrille edge bounds it. Perfect means any two empty cells are joined by exactly one path, so no start or end cells are needed. Returns the quadrille (**chainable**).

## Example

(click to regenerate; press any key to toggle fat ⇄ thin)\
```js
'use strict';
Quadrille.cellLength = 30;
let board;
let wall;
let thin = false;
const THIN = {
  colorDisplay: Quadrille.thinWall, imageDisplay: Quadrille.thinWall,
  stringDisplay: Quadrille.thinWall, numberDisplay: Quadrille.thinWall,
  tileDisplay: null, outlineWeight: 7
};

function setup() {
  createCanvas(11 * Quadrille.cellLength, 15 * Quadrille.cellLength);
  wall = color('#0b332b');
  board = createQuadrille(11, 15).maze(wall);
}

function draw() {
  background('#138a72');
  drawQuadrille(board, thin ? { ...THIN, outline: '#0b332b' } : { outlineWeight: 0.5 });
}

function mousePressed() {
  board.maze(wall); // fresh level, one call
}

function keyPressed() {
  key.length === 1 && (thin = !thin); // fat ⇄ thin: a param swap
}
```

> **Note**
>
> Regeneration, restyling, and the fat ⇄ thin toggle never touch storage: walls stay whatever they are, and the thin look is a display swap at the draw site via [Quadrille.thinWall](../../p5_functions/draw_quadrille/thin_wall/) — installed as every display with `tileDisplay: null`, styled by the draw call's own [outline](../../p5_functions/draw_quadrille/outline/) and [outlineWeight](../../p5_functions/draw_quadrille/outline_weight/).

> **Warning**
>
> Odd dimensions are canonical. On even ones a warning is issued and the trailing even row/col — which holds no rooms — seals as a wall strip on that side.

> **Note**
>
> `value` goes through [fill](../fill/) internals, so the `Quadrille.factory` contract is honored: a plain function is stored as a display-contract wall drawing, whereas a factory-tagged one is evaluated per wall cell — e.g. `board.maze(Quadrille.factory(() => random(['🧱', '🪨'])))` yields varied wall tiles.

> **Note**
>
> **Recipes**
> - **Braiding:** `board.maze(wall).rand(k)` clears `k` random filled cells, turning a perfect maze into a loopy one.
> - **Level authoring:** `createQuadrille(w, h).maze(wall)` → [toBigInt](../../reformatter/to_bigint/) → ship the result as a `const` bitboard; decode via [createQuadrille(w, h, LEVEL, wall)](../../p5_functions/create_quadrille/create_quadrille_width_height_bigint_value/) with the **same dimensions and endianness**: a mismatched decode shifts the pattern.
> - **Pathfinding:** [reach](../../accessors/queries/reach/) and [path](../../accessors/queries/path/) treat any filled cell as an obstacle — no maze required.

> **Note**
>
> **Why depth-first and not Prim's**
>
> Any [spanning tree](https://en.wikipedia.org/wiki/Spanning_tree) of the room lattice is a perfect maze, so the generator's choice is one of **texture**, not of correctness. Measured over 400 seeds on an 11×15 board, classifying each room by how many of its four wall slots are carved:
>
> | generator | dead ends | corridors | junctions |
> |---|---|---|---|
> | randomized depth-first search (this) | 13.6% | 77.1% | 9.4% |
> | randomized [Prim's](https://en.wikipedia.org/wiki/Prim%27s_algorithm) | 32.5% | 42.4% | 25.1% |
>
> Depth-first carries a single frontier and backtracks only when stuck, so it lays long winding corridors and few decisions. Prim's grows from a randomly chosen frontier cell each step, so it spreads outward as a bushy tree — 2.4× the dead ends and barely half the pass-through corridors. [Kruskal's](https://en.wikipedia.org/wiki/Kruskal%27s_algorithm) differs again; Wilson's and Aldous–Broder sample spanning trees uniformly. Corridors read as a maze to a player where Prim's reads as a blob with holes, which is why `maze` runs the depth-first one.

> **Note**
>
> For deterministic (repeatable) mazes, explicitly call [randomSeed(seed)](https://p5js.org/reference/p5/randomSeed/) before `maze(value)`.

## Syntax

> `maze(value)`

## Parameters

| Param   | Description                                                                                                                                     |
|---------|-------------------------------------------------------------------------------------------------------------------------------------------------|
| `value` | Any: wall value — a literal (color, string, image, …), a display-contract function (stored as-is), or a `Quadrille.factory`-tagged function (evaluated per wall cell) |
