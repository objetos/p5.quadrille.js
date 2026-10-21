---
title: "isNumber(row, col)"
weight: 6
symbol: isNumber
---

Returns `true` if the cell found at `(row, col)` has a number and `false` otherwise.

## Syntax

> `isNumber(row, col)`

## Parameters

| Param | Description                                                                       |
|-------|-----------------------------------------------------------------------------------|
| `row` | Number: row index of the cell to be read `∈` [[0..height]](../../../properties/read_write/height/)  |
| `col` | Number: column index of the cell to be read `∈` [[0..width]](../../../properties/read_write/width/) |

> **Note**
>
> Also available as the static method `Quadrille.isNumber(value)`, which takes a `value` instead of a cell position.
