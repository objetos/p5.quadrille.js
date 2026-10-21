---
title: "Quadrille.lightSquare"
weight: 17
symbol: lightSquare
---

The color of the light squares of the default chessboard — the one `createQuadrille()` builds with no arguments, and the one `fill()` paints with no arguments. Any CSS string or value `color()` accepts.

## Example

```js
'use strict';

Quadrille.cellLength = 48;
Quadrille.lightSquare = '#EBECCF';   // chess.com's cream

let board;

function setup() {
  createCanvas(8 * Quadrille.cellLength, 8 * Quadrille.cellLength);
  board = createQuadrille();         // no arguments — the default chessboard
}

function draw() {
  drawQuadrille(board);
}
```

> **Note**
>
> The other half of the board is [`Quadrille.darkSquare`](../dark_square/). Set both at startup, before any quadrille is created: the colors are read at construction, not at draw time.
