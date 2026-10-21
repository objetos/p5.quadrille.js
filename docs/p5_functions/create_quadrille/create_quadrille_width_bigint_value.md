---
title: "createQuadrille(width, bitboard, value, littleEndian?)"
weight: 14
symbol: createQuadrille
---

Creates a quadrille by decoding a [bitboard](https://en.wikipedia.org/wiki/Bitboard)—passed as a JavaScript `BigInt`—into a rectangular quadrille. Each bit in the bitboard determines whether a corresponding cell is filled (`1`) or empty (`0`). The number of columns is set by `width`, and rows are inferred as needed.

> **Note**
>
> The quadrille [height](../../../properties/read_write/height/) is inferred automatically as the minimum number of rows needed to fit all bits in the bitboard, using row-major, big-endian order by default.
> To **explicitly define** the [height](../../../properties/read_write/height/), call [`createQuadrille(width, height, bitboard, value[, littleEndian])`](../create_quadrille_width_height_bigint_value/).

## Example 1 — Big-endian (default)

```js
'use strict';
let quadrille;

function setup() {
  createCanvas(300, 200);
  /*
  | 5 | 4 | 3 |
  | 2 | 1 | 0 |
  (0)2⁰ + (1)2¹ + (0)2² + (1)2³ + (1)2⁴ + (1)2⁵ = 58
  */
  quadrille = createQuadrille(3, 58n, color('blue'));
}

function draw() {
  background('orange');
  drawQuadrille(quadrille);
}
```

> **Note**
>
> This example fills a quadrille using a **bitboard** (`58n` = `0b111010`) in **row-major, big-endian** order:
>
> * **Most significant bit** (2⁵) goes to **(0,0)** (top-left)
> * **Least significant bit** (2⁰) goes to **(1,2)** (bottom-right)
>
> ```
> | 5 | 4 | 3 |
> | 2 | 1 | 0 |
> (0)2⁰ + (1)2¹ + (0)2² + (1)2³ + (1)2⁴ + (1)2⁵ = 58
> ```

## Example 2 — Little-endian

```js
'use strict';
let quadrille;

function setup() {
  createCanvas(300, 200);
  /*
  | 0 | 1 | 2 |
  | 3 | 4 | 5 |
  (0)2⁰ + (1)2¹ + (0)2² + (1)2³ + (1)2⁴ + (1)2⁵ = 58
  */
  quadrille = createQuadrille(3, 58n, color('blue'), true); // littleEndian = true
}

function draw() {
  background('orange');
  drawQuadrille(quadrille);
}
```

> **Note**
>
> This example uses the same **bitboard** value (`58n`) but reads it in **row-major, little-endian** order:
>
> * **Least significant bit** (2⁰) goes to **(0,0)** (top-left)
> * **Most significant bit** (2⁵) goes to **(1,2)** (bottom-right)
>
> ```
> | 0 | 1 | 2 |
> | 3 | 4 | 5 |
> (0)2⁰ + (1)2¹ + (0)2² + (1)2³ + (1)2⁴ + (1)2⁵ = 58
> ```
>
> This layout is often used in chess engines such as [Stockfish](https://github.com/official-stockfish/Stockfish), which represent bitboards in little-endian rank-file order.

> **Note**
>
> To define different values in `createQuadrille(width, bigint, value)`, refer to [createQuadrille(jagged_array)](../create_quadrille_jagged_array/).

> **Warning**
>
> The bitboard must be a **BigInt** (note the `n` suffix: `58n`). A plain Number matches **no constructor overload** in this form — the quadrille is silently created without cell memory, and later calls on it fail.

## Syntax

> `createQuadrille(width, bitboard, value[, littleEndian])`

## Parameters

| Param          | Description                                                                                                          |
|----------------|----------------------------------------------------------------------------------------------------------------------|
| `width`        | Number: The total number of columns for the quadrille                                                               |
| `bitboard`     | BigInt: A bitboard whose binary representation will determine the filled cells in the quadrille                     |
| `value`[^1]    | Any: A [valid JavaScript value](https://www.w3schools.com/js/js_datatypes.asp), with `null` representing empty cells |
| `littleEndian` | Optional Boolean: If `true`, use little-endian bit ordering (default is `false`, i.e., big-endian)                  |

[^1]: A plain function `value` is **stored, not called** — it becomes a per-cell display routine `({ row, col, options }) => { ... }` (see [`options`](../../draw_quadrille/display_fns/)). To have a function **evaluated per cell** at creation time — a fresh object or a varied tile per cell — tag it: `Quadrille.factory(({ row, col }) => new Object(...))`.
