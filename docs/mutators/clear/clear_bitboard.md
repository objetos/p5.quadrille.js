---
title: "clear(bitboard, littleEndian?)"
weight: 4
symbol: clear
---

Clears the cells of the quadrille according to a [bitboard](https://en.wikipedia.org/wiki/Bitboard) passed as a JavaScript `BigInt`. Each `1` bit in the binary representation corresponds to a cell to be cleared (set to `null`). The bitboard is read in row-major order, using big-endian by default.

> **Note**
>
> To use little-endian ordering instead, pass `true` as the second argument.

## Example

(click to toggle clearing the smiley pattern)
```js
'use strict';
Quadrille.cellLength = 50;

let quadrille;
let cleared = false;

const SMILEY = 0b0000000_0110110_0001000_0001000_0100010_0011100_0000000n;

function setup() {
  createCanvas(350, 350);
  quadrille = createQuadrille(7, 7);
  quadrille.fill(color('black')); // Fill entire board
}

function draw() {
  background('lemonchiffon');
  drawQuadrille(quadrille);
}

function mousePressed() {
  cleared ? quadrille.fill(color('black')) : quadrille.clear(SMILEY);
  cleared = !cleared;
}
```

> **Warning**
>
> The bitboard must be a **BigInt** (note the `n` suffix: `0b0011100n`). A plain Number is dispatched as [clear(row)](../clear_row/) instead — silently clearing a row, not a pattern.

## Syntax

> `clear(bitboard[, littleEndian])`

## Parameters

| Param          | Description                                                                                          |
| -------------- | ---------------------------------------------------------------------------------------------------- |
| `bitboard`     | BigInt: A bitboard whose binary `1` bits indicate the cells to clear                                 |
| `littleEndian` | Optional Boolean: If `true`, the bitboard is interpreted in little-endian order (default is `false`) |
