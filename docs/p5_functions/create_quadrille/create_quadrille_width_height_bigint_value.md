---
title: "createQuadrille(width, height, bitboard, value, littleEndian?)"
weight: 15
symbol: createQuadrille
---

Creates a quadrille by decoding a [bitboard](https://en.wikipedia.org/wiki/Bitboard)—passed as a JavaScript `BigInt`—into a fixed-size rectangular quadrille. Each bit in the bitboard determines whether a corresponding cell is filled (`1`) or empty (`0`). The number of columns is set by `width`, and the number of rows is explicitly set by `height`.

> **Note**
>
> This function lets you control both `width` and `height` directly, making it useful for placing bitboard-defined patterns into specific regions of a larger quadrille.

## Example 1 — Big-endian (default)

```js
'use strict';
let quadrille;

function setup() {
  createCanvas(300, 400);
  /*
  Bit pattern (MSB first), read row-major big-endian:
  |     |     |     |     → bits 11 10  9 = 0 0 0
  |     |  1  |     |     → bits  8  7  6 = 0 1 0
  |     |  1  |     |     → bits  5  4  3 = 0 1 0
  |     |  1  |  1  |     → bits  2  1  0 = 0 1 1
  Bit indices with values:
  (1)2⁰ + (1)2¹ + (1)2⁴ + (1)2⁷ = 1 + 2 + 16 + 128 = 147
  */
  quadrille = createQuadrille(3, 4, 147n, color('purple'));
}

function draw() {
  background('lime');
  drawQuadrille(quadrille);
}
```

> **Note**
>
> This bitboard places an **L shape** into a **3×4 quadrille** using **row-major, big-endian** order:
>
> * Bit **11** → cell (0,0) — top-left
> * Bit **0**  → cell (3,2) — bottom-right
>
> ```
> MSB (bit 11)
> ↓
> |     |     |     |
> |     |  1  |     |
> |     |  1  |     |
> |     |  1  |  1  |
> ↑
> LSB (bit 0)
> ```

## Example 2 — Little-endian

```js
'use strict';
let quadrille;

function setup() {
  createCanvas(300, 400);
  /*
  Little-endian: same bitboard, read in reverse order
  |  1  |  1  |     |     → bits 11 10  9 = 1 1 0
  |     |  1  |     |     → bits  8  7  6 = 0 1 0
  |     |  1  |     |     → bits  5  4  3 = 0 1 0
  |     |     |     |     → bits  2  1  0 = 0 0 0
  Bit indices with values:
  (1)2⁴ + (1)2⁷ + (1)2¹⁰ + (1)2¹¹ = 16 + 128 + 1024 + 2048 = 147
  */
  quadrille = createQuadrille(3, 4, 147n, color('purple'), true);
}

function draw() {
  background(250);
  drawQuadrille(quadrille);
}
```

> **Note**
>
> Same **bitboard** (`147n`) as before, but read in **row-major, little-endian** order:
>
> * Bit **0**  → cell (0,0) — top-left
> * Bit **11** → cell (3,2) — bottom-right
>
> This results in a **flipped L** shape:
>
> ```
> |  1  |  1  |     |
> |     |  1  |     |
> |     |  1  |     |
> |     |     |     |
> ```
>
> This layout matches **little-endian rank-file ordering** as used in engines like [Stockfish](https://github.com/official-stockfish/Stockfish).

> **Warning**
>
> The bitboard must be a **BigInt** (note the `n` suffix: `147n`). A plain Number is dispatched as [createQuadrille(width, height, order, value)](../create_quadrille_width_height_order_value/) instead — `createQuadrille(3, 4, 147, value)` **randomly fills** the board (`147` clamps to all 12 cells) rather than decoding a pattern.

## Syntax

> `createQuadrille(width, height, bitboard, value[, littleEndian])`

## Parameters

| Param          | Description                                                                                                        |
| -------------- | ------------------------------------------------------------------------------------------------------------------ |
| `width`        | Number: Number of columns in the quadrille                                                                         |
| `height`       | Number: Number of rows in the quadrille                                                                            |
| `bitboard`     | BigInt: A bitboard whose binary representation determines which cells are filled                                   |
| `value`[^1]    | Any: [valid JavaScript value](https://www.w3schools.com/js/js_datatypes.asp), with `null` representing empty cells |
| `littleEndian` | Optional Boolean: If `true`, reads the bitboard in little-endian order (default is `false`, big-endian)            |

[^1]: A plain function `value` is **stored, not called** — it becomes a per-cell display routine `({ row, col, options }) => { ... }` (see [`options`](../../draw_quadrille/display_fns/)). To have a function **evaluated per cell** at creation time — a fresh object or a varied tile per cell — tag it: `Quadrille.factory(({ row, col }) => new Object(...))`.
