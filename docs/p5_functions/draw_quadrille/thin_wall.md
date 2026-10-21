---
title: "Quadrille.thinWall"
weight: 6
symbol: thinWall
---

A shipped **display function** for the thin-wall maze look — value-agnostic, passed per draw through the [display functions](../display_fns/) params and styled by the draw call's own [outline](../outline/) and [outlineWeight](../outline_weight/). Walls stay whatever they are in storage (colors, images, emojis, functions, …); thin is pure draw-site styling. Install it as *every* display and silence the tile so only the wall segments show:

```js
const THIN = {
  colorDisplay: Quadrille.thinWall, imageDisplay: Quadrille.thinWall,
  stringDisplay: Quadrille.thinWall, numberDisplay: Quadrille.thinWall,
  tileDisplay: null
};
drawQuadrille(board, { outlineWeight: 0.5 });          // fat
drawQuadrille(board, { ...THIN, outline: '#0b332b' }); // thin — same storage
```

Each wall cell reads its orientation from its own index parity: odd row + even col draws a horizontal segment, even row + odd col a vertical one, and odd-odd pillar cells draw nothing. Segments overshoot to the centers of their flanking pillar cells, so joints, corners, and tips form themselves at lattice points; at the quadrille's perimeter, where no pillar flanks, segments terminate flush with the edge. Works in `P2D` and `WEBGL`.

## Example

(same board drawn twice — fat left, thin right; click to regenerate, alternating the wall value: color ⇄ 🧱)\
```js
'use strict';
Quadrille.cellLength = 24;
let board;
let brick = false;
const THIN = {
  colorDisplay: Quadrille.thinWall, imageDisplay: Quadrille.thinWall,
  stringDisplay: Quadrille.thinWall, numberDisplay: Quadrille.thinWall,
  tileDisplay: null, outlineWeight: 6
};

function setup() {
  createCanvas(19 * Quadrille.cellLength, 9 * Quadrille.cellLength);
  board = createQuadrille(9, 9).maze(color('#0b332b'));
}

function draw() {
  background('#138a72');
  drawQuadrille(board, { outlineWeight: 0.5 });                                        // fat: storage as-is
  drawQuadrille(board, { ...THIN, outline: '#0b332b', x: 10 * Quadrille.cellLength }); // thin: same storage
}

function mousePressed() {
  brick = !brick;
  board.maze(brick ? '🧱' : color('#0b332b'));
}
```

> **Note**
>
> `Quadrille.thinWall` reads **no cell value** — that is why the fat rendering changes with the stored wall (color ⇄ 🧱) while the thin rendering does not. Restyling is a param change, never a storage mutation: [replace](../../../mutators/replace/) keeps its real job (recoloring stored content — the fat look follows it), and the thin look is restyled independently at the draw site. `tileDisplay: null` is an explicit opt-out honored by `drawQuadrille`; the same params contract is the customization path for your own wall skins.

> **Warning**
>
> **Convention-scoped.** `Quadrille.thinWall` is total on any quadrille but meaningful on lattice mazes at their natural origin: cropping or shifting by odd offsets flips parities (wrong orientations), and a wall placed on an even-even room slot draws nothing yet still blocks [reach](../../../accessors/queries/reach/) and [path](../../../accessors/queries/path/) — the render can lie about passability. The truthful fallback is always one omission away: drop the override and the fat rendering shows storage as-is. On mixed-content boards, scope it with the [filter](../filter_prop/) param, or keep walls and pieces as separate quadrilles composited per frame.

## Syntax

> `drawQuadrille(board, { colorDisplay: Quadrille.thinWall, imageDisplay: Quadrille.thinWall, stringDisplay: Quadrille.thinWall, numberDisplay: Quadrille.thinWall, tileDisplay: null })`

## Parameters

`Quadrille.thinWall` is not called directly: `drawQuadrille` invokes it per cell with the standard [display function parameters](../display_fns/), of which it reads:

| Param           | Description                                                                                      |
|-----------------|--------------------------------------------------------------------------------------------------|
| `graphics`      | [p5.Graphics](https://p5js.org/reference/#/p5.Graphics): rendering context                       |
| `row`, `col`    | Number: cell indices — their parity selects the segment orientation                              |
| `width`, `height` | Number: quadrille dimensions in cells, used to clamp segments flush at the perimeter (omitted in a manual call → segments simply overshoot) |
| [`cellLength`](../cell_length/)    | Number: cell size in pixels                                                                      |
| [`outline`](../outline/)       | Wall stroke color — the skin follows the draw call                                               |
| [`outlineWeight`](../outline_weight/) | Number: wall stroke weight. Default here is `cellLength / 4` (not `Quadrille.outlineWeight`)     |
