---
title: "isSymbol(row, col)"
weight: 14
symbol: isSymbol
---

Returns `true` if the cell at `(row, col)` contains a [symbol](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Symbol); otherwise, returns `false`.

## Syntax

> `isSymbol(row, col)`

## Parameters

| Param | Description                                                                       |
|-------|-----------------------------------------------------------------------------------|
| `row` | Number: row index of the cell to be read `∈` [[0..height]](../../../properties/read_write/height/)  |
| `col` | Number: column index of the cell to be read `∈` [[0..width]](../../../properties/read_write/width/) |

> **Note**
>
> Also available as the static method `Quadrille.isSymbol(value)`, which takes a `value` instead of a cell position.
