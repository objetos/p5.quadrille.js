---
title: "fill(value)"
weight: 2
symbol: fill
---

Fills all **empty** cells in the quadrille with the specified `value` — filled cells are never overwritten (to re-value those, use [replace(value)](../../replace/replace_value/); to start over, [clear](../../clear/) first). Returns the quadrille (**chainable**).

## Example

(click or press a key to toggle between filling empty cells and resetting to random colors)
```js
'use strict';
Quadrille.cellLength = 20;
let quadrille;
let filled = false;

function setup() {
  createCanvas(400, 400);
  reset();
}

function draw() {
  background(0);
  drawQuadrille(quadrille);
}

function mouseClicked() {
  filled = !filled;
  filled ? quadrille.fill(255) : reset();
}

function keyPressed() {
  filled = !filled;
  filled ? quadrille.fill(255) : reset();
}

function reset() {
  quadrille = createQuadrille(20, 20, 100, color('red'));
  quadrille.rand(100, color('lime')).rand(100, color('blue'));
}
```

> **Note**
>
> Empty cells appear black because the background is set to black (`background(0)`), while the fill color is white (`fill(255)`).

> **Note**
>
> **One value, one instance.** A non-factory `value` is stored **as-is in every cell**: all cells filled by the call share the same instance. That single fact powers two idioms elsewhere in the API — strict [search](../../../accessors/queries/search/) matches across cells (`===`), and [flood fill](../fill_row_col_value_directions/)/[flood clear](../../clear/clear_row_col_directions/) treat them as one connected region, since the flood matches the start cell's value by identity. Per-cell instances instead — e.g. a fresh `color('green')` per cell via `Quadrille.factory` — would strict-match nothing and flood nowhere. When sharing is the point, `Quadrille.singleton(value)` names the intent in code: a pure identity function — the value passes through unmodified — that reads as the semantic mirror of `Quadrille.factory`.

## Syntax

> `fill(value)`

## Parameters

| Param     | Description                                                                                                                         |
|-----------|-------------------------------------------------------------------------------------------------------------------------------------|
| `value`[^1] | Any: A valid JavaScript value                                                        |

[^1]: A plain function `value` is **stored, not called** — it becomes a per-cell display routine, invoked with the `options` object **alone** — `({ row, col, origin }) => { ... }` — and with `this` bound to the drawing context (see [display functions](../../../p5_functions/draw_quadrille/display_fns/)). To have a function **evaluated per cell** at fill time — a fresh object or a varied tile per cell — tag it: `Quadrille.factory(({ row, col }) => new Object(...))`, which marks the function **in place** and returns that same function.
