---
title: "isObject(row, col)"
weight: 13
symbol: isObject
---

Returns `true` if the cell at `(row, col)` contains a value that qualifies as an object, excluding specific types such as [colors](../is_color/), [images](../is_image/), [arrays](../is_array/), or [functions](../is_function/), and `false` otherwise.

## Syntax

> `isObject(row, col)`

## Parameters

| Param | Description                                                                       |
|-------|-----------------------------------------------------------------------------------|
| `row` | Number: row index of the cell to be read `∈` [[0..height]](../../../properties/read_write/height/)  |
| `col` | Number: column index of the cell to be read `∈` [[0..width]](../../../properties/read_write/width/) |

> **Note**
>
> Also available as the static method `Quadrille.isObject(value)`, which takes a `value` instead of a cell position.
