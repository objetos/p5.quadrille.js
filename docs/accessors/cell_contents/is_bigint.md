---
title: "isBigInt(row, col)"
weight: 7
symbol: isBigInt
---

Returns `true` if the cell at `(row, col)` contains a bigint; otherwise, returns `false`.

## Syntax

> `isBigInt(row, col)`

## Parameters

| Param | Description                                                                       |
|-------|-----------------------------------------------------------------------------------|
| `row` | Number: row index of the cell to be read `∈` [[0..height]](../../../properties/read_write/height/)  |
| `col` | Number: column index of the cell to be read `∈` [[0..width]](../../../properties/read_write/width/) |

> **Note**
>
> Also available as the static method `Quadrille.isBigInt(value)`, which takes a `value` instead of a cell position.
