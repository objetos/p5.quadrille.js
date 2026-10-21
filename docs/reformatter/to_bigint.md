---
title: "toBigInt(littleEndian?)"
weight: 2
symbol: toBigInt
---

Returns a [bitboard](https://en.wikipedia.org/wiki/Bitboard)—encoded as a JavaScript [BigInt](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/BigInt)—that represents the filled cells of the quadrille.

Each `1` bit marks a filled cell and `0` an empty one. Cells are encoded in **row-major** order, and by default, use **big-endian** layout (top-left cell is the most significant bit). Round-trips faithfully with [createQuadrille(width, height, bitboard, value)](../../p5_functions/create_quadrille/create_quadrille_width_height_bigint_value/) — the backbone of the `maze` → `toBigInt` → `const` level pipeline (see [maze](../../mutators/maze/)). The height-deriving [createQuadrille(width, bitboard, value)](../../p5_functions/create_quadrille/create_quadrille_width_bigint_value/) form infers rows from the bit length instead, so leading empty cells shorten the decode: whenever the whole top row is empty, a row drops and the pattern shifts. Pass both dimensions to decode stored levels — a maze's `(0, 0)` is always open, so its bitboard always starts with a `0` bit.

> **Note**
>
> Use `littleEndian = true` to reverse the bit order, so the top-left cell becomes the least significant bit. This is common in some chess engines and low-level systems.

## Syntax

> `toBigInt([littleEndian])`

## Parameters

| Param          | Description                                                                                     |
|----------------|-------------------------------------------------------------------------------------------------|
| `littleEndian` | Optional Boolean: If `true`, uses little-endian encoding (default is `false`, i.e., big-endian) |
