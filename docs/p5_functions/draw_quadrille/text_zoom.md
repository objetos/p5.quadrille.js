---
title: "Quadrille.textZoom"
weight: 5
symbol: textZoom
---

Sets the glyph size for string cells, as a fraction of `cellLength`. The default is `Quadrille.textZoom`, which is `0.78` — a little under the full cell, so a glyph does not crowd the tile stroke.

Passing `textZoom` to `drawQuadrille` overrides the global default for that call only.

## Example

```js
'use strict';
Quadrille.cellLength = 40;
let q1, q2, q3, q4;
let localZoomSlider, globalZoomSlider;

function setup() {
  createCanvas(650, 290);
  q1 = createQuadrille(4, '🎃👻🦊🧀🍄🐭🧱🌊');
  q2 = createQuadrille(4, 'abcdefgh');
  q3 = createQuadrille(4, '⭐🔑💀🗝️🧭🕯️🪙🎲');
  q4 = createQuadrille(4, ['ab', 'cd', 'ef', 'gh', 'ij', 'kl', 'mn', 'op']);
  // Local: applies to q1 only, and wins over the global default
  localZoomSlider = createSlider(0.1, 1.4, 0.78, 0.01);
  localZoomSlider.position(10, 10);
  // Global: applies to everything drawn without an explicit textZoom
  globalZoomSlider = createSlider(0.1, 1.4, Quadrille.textZoom, 0.01);
  globalZoomSlider.position(340, 10);
  globalZoomSlider.input(() => Quadrille.textZoom = globalZoomSlider.value());
}

function draw() {
  background('#123');
  drawQuadrille(q1, { y: 50, textZoom: localZoomSlider.value() });
  drawQuadrille(q2, { x: 330, y: 50 });
  drawQuadrille(q3, { y: 160 });
  drawQuadrille(q4, { x: 330, y: 160 });
}
```

> **Note**
>
> Drag the **left** slider and only `q1` changes: a `textZoom` passed to `drawQuadrille` overrides the global default for that call. Drag the **right** one and `q2`, `q3` and `q4` follow it while `q1` stays put — an explicit value always wins.
>
> Push either past `1` and the glyph outgrows its cell. Nothing is clipped: string cells are drawn unboxed, so a glyph overflows into its neighbours rather than vanishing.

> **Warning**
>
> **A cell's glyph count is what divides the zoom, and it counts characters.**
>
> Compare `q4` against the others. A one-character cell draws at `cellLength × textZoom`; `q4` holds two characters per cell, so each is drawn at half that. This is what keeps a whole word inside its cell.
>
> An emoji counts as **one** character even though JavaScript stores most of them as two [UTF-16](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String) code units — `'🎃'.length` is `2`, yet it fills a cell exactly like `'a'`. `q3` mixes emoji that carry variation selectors, which are also folded into a single character.

## Syntax

> `drawQuadrille(quadrille, { textZoom })`

## Parameters

| Param     | Description                                                                            |
|-----------|----------------------------------------------------------------------------------------|
| `textZoom` | Number: glyph size as a fraction of `cellLength`. Defaults to `Quadrille.textZoom`, which is `0.78` |
