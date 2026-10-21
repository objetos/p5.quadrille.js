---
title: "drawing arrays"
weight: 15
---

`drawQuadrille` also renders a raw 1D or 2D JS array directly, wrapping it on the fly as a live [zero-copy](https://en.wikipedia.org/wiki/Zero-copy) **view**: a real quadrille that [aliases](https://en.wikipedia.org/wiki/Aliasing_%28computing%29) the array — reads and writes go through; nothing is copied or repaired. The call returns the view, with [mouseRow](../../../properties/read_only/mouse_row/)/[mouseCol](../../../properties/read_only/mouse_col/) live on it. The exact contract and limitations vs a full quadrille:

1. **Empty means `null` (or `undefined`)** — never `false`, `0`, or `''`: a `bool[][]` renders ✅/❎ and zeros render dark; filter at draw or normalize.
2. **Display is the only verb arrays get** — no algebra, queries, or transforms on raw arrays; adopt the returned view (aliases) or [createQuadrille](../../create_quadrille/) (copies, normalizes, owns) for the rest of the API.
3. **Aliasing is cell-deep, not shape-deep**: `fill`/`clear`/`replace`/flood on the view write through to the array, while `rotate`/`transpose`/`shift`/`sort` and resizing rebuild memory and silently detach the view.
4. **Nothing is normalized**: width is row 0's length — shorter rows render their missing tail empty, longer rows truncate, holes render empty.
5. **One small view object is allocated per call** (cell data is never copied) — fine at sketch scale.
6. **`mouseRow`/`mouseCol` are live on the instance the call just drew** — capture the return value each frame rather than keeping a stale one.

## Example

(click a cell to write `'🧱'` into the **raw array** — the next frame renders it live)\
```js
'use strict';
Quadrille.cellLength = 40;
let cells;
let view;

function setup() {
  createCanvas(8 * Quadrille.cellLength, 3 * Quadrille.cellLength);
  cells = [
    [0, 50, 100, 150, 200, 250, null, '🐁'],
    [true, false, null, '🧀', 'q', 255, 0, null],
    [null, 25, 75, 125, 175, 225, 250, '🦉']
  ];
}

function draw() {
  background('#138a72');
  view = drawQuadrille(cells); // the array call — returns the live view (point 6)
}

function mousePressed() {
  const row = view.mouseRow; // live on the view (point 6)
  const col = view.mouseCol;
  view.isValid(row, col) && (cells[row][col] = '🧱'); // array-side write shows through (point 3)
}
```

> **Note**
>
> Note how the `bool[][]` row renders ✅/❎ and the zeros render dark (point 1): emptiness is `null`, day one — not falsiness.

> **Note**
>
> The view **is** a quadrille, so `drawQuadrille(view)` also works — adopt it once and draw it to skip even the per-call view allocation (point 5). The array form is the entry sugar; the view is what you hold.

## Syntax

> `drawQuadrille(array, [{ params }])`

## Parameters

| Param    | Description                                                                                              |
|----------|----------------------------------------------------------------------------------------------------------|
| `array`  | Array: a raw 2D array (rows of arrays) or 1D array (wrapped as a single row) — aliased, never copied     |
| `params` | Object: the same optional rendering params `drawQuadrille` takes for a quadrille, [display functions](../display_fns/) included |
