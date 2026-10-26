---
title: "options"
weight: 14
---

The `options` parameter is the channel between the draw call and the code stored **inside** cells. A [display function](../display_fns/) passed as a draw param receives the whole params bag; a function *stored in a cell* — or an object cell's `display` method — receives `options` and nothing else. Whatever keys you put in it ride along untouched, and `drawQuadrille` adds three of its own: [`origin`](../origin/), plus the `row` and `col` of the cell being drawn.

That is the whole mechanism. A cell-stored function has no other way to learn where it is.

## Example

(move the mouse: horizontally sets the ring count, vertically the shade — both are custom `options` keys)
```js
'use strict';
// All 64 cells store the SAME function object. Each call learns its
// position from `options` — the only argument it is handed.
Quadrille.cellLength = 45;
let board;
const opts = { rings: 3, shade: 120 }; // custom keys, forwarded untouched

function setup() {
  createCanvas(8 * Quadrille.cellLength, 8 * Quadrille.cellLength);
  board = createQuadrille(8, 8).fill(bullseye);
}

function draw() {
  background('#0b1021');
  opts.rings = floor(map(mouseX, 0, width, 1, 5, true));
  opts.shade = floor(map(mouseY, 0, height, 0, 255, true));
  drawQuadrille(board, { options: opts, tileDisplay: null });
}

// A cell-stored function: `options` is its ONLY argument.
function bullseye(options) {
  const { row, col, rings, shade } = options;
  const side = Quadrille.cellLength;
  noFill();
  strokeWeight(2);
  // row and col are rewritten by drawQuadrille before every call
  stroke((row + col) % 2 ? shade : 255 - shade, 200, 255 - shade);
  for (let i = 1; i <= rings; i++) {
    circle(side / 2, side / 2, i * side / (rings + 1));
  }
}
```

> **Note**
>
> One function object fills all 64 cells, and every cell draws something different — because `row` and `col` arrive through `options`, not through a closure. `rings` and `shade` are keys the sketch invented; `drawQuadrille` neither reads nor validates them, it just forwards the object. Note the cell-local coordinate system: the origin is the cell's own upper-left corner, so `side / 2` is the cell's center, not the canvas's.

> **Warning**
>
> **It is one object, reused for every cell.** `drawQuadrille` writes `options.row` and `options.col` immediately before each display call, so the object you hand in is mutated 64 times per frame in the example above. Reading it during the call is correct; **keeping a reference is not** — after the draw, it reports the last cell visited:
>
> ```js
> let stash;
> function bullseye(options) {
>   stash = options;        // ⚠ same object every time
> }
> // after drawQuadrille on an 8x8 board: stash.row === 7, stash.col === 7
> ```
>
> Copy what you need instead — `const { row, col } = options;` — or spread it: `const here = { ...options };`

> **Warning**
>
> **`origin` is defaulted once, not per draw.** `drawQuadrille` fills it in with `??=`, so it is only written when absent. Omit `options` and each call gets a fresh object with the renderer's default (`CORNER` in `P2D`, `CENTER` in `WEBGL`). Hand in your *own* object and reuse it across a `P2D` canvas and a `WEBGL` buffer, and it keeps whichever origin it was first drawn under. Pass a fresh object per draw, or set `options.origin` explicitly, when you draw the same options to both.

## Object cells

When a cell holds an object with a `display` field and no [`objectDisplay`](../display_fns/) is supplied, the object is rendered through its own `display` — and if that is a function, it too is called with `options` as its only argument, with `this` bound to the object:

```js
const piece = {
  emoji: '🐉',
  display(options) {
    // `this` is the piece; `options` says where it is
    textAlign(CENTER, CENTER);
    textSize(Quadrille.cellLength * 0.7);
    text(this.emoji, Quadrille.cellLength / 2, Quadrille.cellLength / 2);
  }
};
```

The split is worth naming: **`this` carries what the cell *is*, `options` carries where it *is*.** Neither knows about the other, which is what lets one object be stored in many cells at once.

## Beyond drawQuadrille

The same `options` object threads through every render entry point — [`toImage`](../../../reformatter/to_image/), `sort` and `sample` all accept and forward it — so a cell function written for the canvas works unchanged when the board is saved to a file or sampled for sorting.

## Syntax

> `drawQuadrille(quadrille, { options })`

## Parameters

| Param     | Description                                                                                     |
|-----------|-------------------------------------------------------------------------------------------------|
| `options` | Object: forwarded, unmodified except for the three keys below, as the sole argument to functions stored in cells and to object cells' `display` methods. Default is a fresh `{}` per call |

Keys `drawQuadrille` writes into it:

| Key      | Description                                                                                                  |
|----------|----------------------------------------------------------------------------------------------------------------|
| `row`    | Number: row index of the cell being drawn. Overwritten before every display call                                |
| `col`    | Number: column index of the cell being drawn. Overwritten before every display call                             |
| [`origin`](../origin/) | Constant: `CORNER` or `CENTER`. Written only if absent (`??=`), so a supplied value is never overridden |
