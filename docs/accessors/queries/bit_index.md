---
title: "bitIndex(row, col, littleEndian?)"
weight: 8
symbol: bitIndex
---

Returns the bit index of the cell at `(row, col)` when the quadrille is encoded into a [bitboard](https://en.wikipedia.org/wiki/Bitboard) using row-major ordering.
By default, the index follows **big-endian** layout, where the most significant bit (MSB) maps to the top-left cell.
Set `littleEndian` to `true` to reverse this mapping, placing the least significant bit (LSB) at the top-left instead.

> **Note**
>
> Example for a 2×3 quadrille:
>
> * **Big-endian** layout (default):
> ```
> | 5 | 4 | 3 |
> | 2 | 1 | 0 |
> ```
>
> * **Little-endian** layout:
> ```
> | 0 | 1 | 2 |
> | 3 | 4 | 5 |
> ```

## Syntax

> `bitIndex(row, col[, littleEndian])`

## Parameters

| Param          | Description                                                                                      |
|----------------|--------------------------------------------------------------------------------------------------|
| `row`          | Number: row index of the cell `∈` [[0..height]](../../../properties/read_write/height/)                            |
| `col`          | Number: column index of the cell `∈` [[0..width]](../../../properties/read_write/width/)                           |
| `littleEndian` | Optional Boolean: if `true`, bit index is computed using little-endian layout                    |

> **Note**
>
> Also available as the static method `Quadrille.bitIndex(row, col, width = 8, height = 8, littleEndian = false)`, which allows computing bit indices independently of any specific quadrille.
