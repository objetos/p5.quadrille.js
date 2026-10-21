---
title: "isArray(row, col)"
weight: 11
symbol: isArray
---

Returns `true` if the cell found at `(row, col)` is an array and `false` otherwise.

## Syntax

> `isArray(row, col)`

## Parameters

| Param | Description                                                                       |
|-------|-----------------------------------------------------------------------------------|
| `row` | Number: row index of the cell to be read `∈` [[0..height]](../../../properties/read_write/height/)  |
| `col` | Number: column index of the cell to be read `∈` [[0..width]](../../../properties/read_write/width/) |

> **Note**
>
> Also available as the static method `Quadrille.isArray(value)`, which takes a `value` instead of a cell position.
