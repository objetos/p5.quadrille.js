---
title: "Quadrille.chessSymbols"
weight: 18
symbol: chessSymbols
---

The FEN → symbol map a [FEN position](../../create_quadrille/create_quadrille_FEN/) is rendered with: one entry per piece letter, `K` `Q` `R` `B` `N` `P` for white and the same letters in lower case for black. The entry value is any cell value the library draws — a Unicode glyph, an emoji, a `p5.Image`, a color, a function.

The getter returns a **copy**, so mutating it changes nothing. The setter **merges**: assign an object or a `Map` holding only the entries to replace, and every other piece keeps its default. That makes per-theme skins a one-liner at startup.

## Example

```js
'use strict';

Quadrille.cellLength = 48;
const OPENING = 'rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR';

let board, position;

function setup() {
  createCanvas(8 * Quadrille.cellLength, 8 * Quadrille.cellLength);
  // Partial update: the entries not named here keep their defaults.
  Quadrille.chessSymbols = { k: '🤴', q: '👸', n: '🦄', p: '🐾' };
  board = createQuadrille();        // the chessboard underneath
  position = createQuadrille(OPENING);
}

function draw() {
  drawQuadrille(board);
  drawQuadrille(position);
}
```

> **Note**
>
> The reverse lookup is [`Quadrille.chessKeys`](../chess_keys/). Because the setter merges, a second assignment does not reset the first: restore a default by assigning that entry back, or reload the page.
