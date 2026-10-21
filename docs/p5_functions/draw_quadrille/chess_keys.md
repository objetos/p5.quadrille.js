---
title: "Quadrille.chessKeys"
weight: 19
symbol: chessKeys
---

The reverse of [`Quadrille.chessSymbols`](../chess_symbols/): a new `Map` from the drawn value back to its FEN letter, so a cell can be asked what piece it holds without knowing the skin. Rebuilt on every read, from the current map — a custom symbol appears here as soon as it is assigned.

## Example

```js
'use strict';

function setup() {
  createCanvas(320, 320);
  textFont('monospace');
  noLoop();
}

function draw() {
  background('violet');
  fill('white');
  textSize(18);
  let y = 30;
  for (const [symbol, key] of Quadrille.chessKeys) {
    text(`${symbol}  →  ${key}`, 24, y);
    y += 22;
  }
}

function mousePressed() {
  Quadrille.chessSymbols = { q: '👸' };
  redraw();
}
```

> **Note**
>
> Click the sketch to see the reverse map follow the forward one: `👸` appears where `♛` was, because the getter rebuilds from the current symbols. A cell drawn with a custom symbol is read back with `Quadrille.chessKeys.get(value)`.
