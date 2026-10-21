---
title: "Quadrille.darkSquare"
weight: 16
symbol: darkSquare
---

The color of the dark squares of the default chessboard — the one `createQuadrille()` builds with no arguments, and the one `fill()` paints with no arguments. Any CSS string or value `color()` accepts; anything else leaves the previous color in place.

Read it back to build a second board in the same colors, or set it once at startup and let both constructors pick it up.

## Example

```js
'use strict';

Quadrille.cellLength = 48;
Quadrille.darkSquare = '#769555';   // chess.com's green

let board;

function setup() {
  createCanvas(8 * Quadrille.cellLength, 8 * Quadrille.cellLength);
  board = createQuadrille();        // no arguments — the default chessboard
}

function draw() {
  drawQuadrille(board);
}
```

> **Note**
>
> The other half of the board is [`Quadrille.lightSquare`](../light_square/); [FEN positions](../../create_quadrille/create_quadrille_FEN/) are drawn *over* a board built this way, which is why both colors are set before the position is created.
