---
title: "isFilled(row, col)"
weight: 4
symbol: isFilled
---

Returns `true` if the cell found at `(row, col)` is filled and `false` otherwise. Filled means `!= null` — the exact complement of [isEmpty](../is_empty/): out-of-bounds positions [read](../read/) as `undefined` and thus count as **not** filled.

## Syntax

> `isFilled(row, col)`

## Parameters

| Param | Description                                                                       |
|-------|-----------------------------------------------------------------------------------|
| `row` | Number: row index of the cell to be read `∈` [[0..height]](../../../properties/read_write/height/)  |
| `col` | Number: column index of the cell to be read `∈` [[0..width]](../../../properties/read_write/width/) |

> **Note**
>
> Also available as the static method `Quadrille.isFilled(value)`, which takes a `value` instead of a cell position.
