---
title: "isString(row, col)"
weight: 8
symbol: isString
---

Returns `true` if the cell found at `(row, col)` is a string and `false` otherwise.

## Syntax

> `isString(row, col)`

## Parameters

| Param | Description                                                                       |
|-------|-----------------------------------------------------------------------------------|
| `row` | Number: row index of the cell to be read `∈` [[0..height]](../../../properties/read_write/height/)  |
| `col` | Number: column index of the cell to be read `∈` [[0..width]](../../../properties/read_write/width/) |

> **Note**
>
> Also available as the static method `Quadrille.isString(value)`, which takes a `value` instead of a cell position.
