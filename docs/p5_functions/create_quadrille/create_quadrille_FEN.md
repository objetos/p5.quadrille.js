---
title: "createQuadrille(FEN)"
weight: 7
symbol: createQuadrille
---

Creates a quadrille with the chess board position described by the given [FEN](https://en.wikipedia.org/wiki/Forsyth%E2%80%93Edwards_Notation).

## Example 1

```js
'use strict';
Quadrille.cellLength = 50;
Quadrille.tileDisplay = 0;
Quadrille.textColor = 'black';
const COLS = 8, ROWS = 8;
const FEN = '5rk1/1P3Bp1/R6p/8/6P1/2B1rQ2/2K3P1/6q1 b - - 0 36';
let board, fen;

function setup() {
  createCanvas(COLS * Quadrille.cellLength, ROWS * Quadrille.cellLength);
  board = createQuadrille();
  fen = createQuadrille(FEN);
}

function draw() {
  drawQuadrille(board);
  drawQuadrille(fen);
}
```

> **Note**
>
> **Capablanca vs Marshall, 1918 – The Birth of the Marshall Attack**
> This [iconic game](https://www.chessgames.com/perl/chessgame?gid=1095025), played in New York in 1918, marked the debut of the [Marshall Attack](https://en.wikipedia.org/wiki/Ruy_Lopez,_Marshall_Attack) in top-level play. [Frank Marshall](https://en.wikipedia.org/wiki/Frank_Marshall_(chess_player)) unveiled his long-prepared gambit against [José Raúl Capablanca](https://en.wikipedia.org/wiki/Jos%C3%A9_Ra%C3%BAl_Capablanca), sacrificing a pawn for dynamic counterplay in the [Ruy López](https://en.wikipedia.org/wiki/Ruy_Lopez). Despite the sharp attack, Capablanca defended flawlessly and won—cementing both the opening's legacy and his own positional brilliance.
>
> {{< youtube v7hc715hvVg "agadmator's Chess Channel — Marshall saved his famous weapon for 8 years" >}}

## Example 2: Custom Chess Symbols with Chess.com Colors

```js
'use strict';
Quadrille.cellLength = 50;
Quadrille.tileDisplay = 0;
Quadrille.textColor = 'blue';
// Set Chess.com board colors
Quadrille.lightSquare = '#EBECCF'; // Light square color
Quadrille.darkSquare = '#769555';  // Dark square color
const FEN = 'rnbqkbnr/pp1ppppp/8/2p5/4P3/5N2/PPPP1PPP/RNBQKB1R';
let board, fen;
let pola;

async function setup() {
  pola = await loadImage('/images/pola.jpg');
  // Set custom chess symbols
  Quadrille.chessSymbols = {
    K: '👑', Q: pola, N: '🐴',
    k: '🤴', q: '👸', n: '🦄'
  };
  createCanvas(8 * Quadrille.cellLength, 8 * Quadrille.cellLength);
  board = createQuadrille(); // Background layer with Chess.com colors
  fen = createQuadrille(FEN); // Foreground layer with custom symbols
}

function draw() {
  drawQuadrille(board);
  drawQuadrille(fen);
}
```

> **Note**
>
> **Custom Symbols and Colors**
> This example uses [chess.com](https://chess.com/) board colors and custom symbols such as emojis or images (any valid JavaScript value). You can assign a plain [object](https://www.w3schools.com/js/js_objects.asp) or [Map](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Map) to `Quadrille.chessSymbols` for partial updates, and reverse lookup is always available through the `Quadrille.chessKeys` getter.

> **Note**
>
> **Default Chess Symbols and Keys**
> By default, the following FEN → symbol pairs are used:
>
> ```js
> // Default chessSymbols (FEN → symbol)
> {
>   K: '♔', Q: '♕', R: '♖', B: '♗', N: '♘', P: '♙',
>   k: '♚', q: '♛', r: '♜', b: '♝', n: '♞', p: '♟'
> }
> ```
>
> You can update entries using a plain [object](https://www.w3schools.com/js/js_objects.asp) or [Map](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Map):
>
> ```js
> Quadrille.chessSymbols = { N: '🦄' };
> Quadrille.chessSymbols = new Map([['P', '🥚']]);
> ```
>
> Both `chessSymbols` and `chessKeys` are [Map](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Map) objects:
>
> ```js
> Quadrille.chessSymbols.get('K'); // '♔'
> Quadrille.chessKeys.get('♔');    // 'K'
> ```

## Syntax

> `createQuadrille(FEN)`

## Parameters

| Param | Description                                                                                                                             |
|-------|-----------------------------------------------------------------------------------------------------------------------------------------|
| `FEN` | String: A valid [Forsyth–Edwards Notation](https://en.wikipedia.org/wiki/Forsyth%E2%80%93Edwards_Notation) describing a board position |
