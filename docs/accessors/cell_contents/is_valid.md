---
title: "isValid(row, col)"
weight: 2
symbol: isValid
---

Checks if the specified cell coordinates `(row, col)` lie within quadrille bounds, i.e., returns `true` if `row` `∈` [[0..height]](../../../properties/read_write/height/) and `col` `∈` [[0..width]](../../../properties/read_write/width/), and `false` otherwise. The bounds guard to lead with before any cell test — see the out-of-bounds note in [isEmpty](../is_empty/).

> **Note**
>
> To check bounds individually, you can call `quadrille.isValid(row, 0)` to test only if `row` is within bounds, or `quadrille.isValid(0, col)` to test only if `col` is within bounds.

## Syntax

> `isValid(row, col)`

## Parameters

| Param | Description                                    |
|-------|------------------------------------------------|
| `row` | Number: row index of the cell to be checked    |
| `col` | Number: column index of the cell to be checked |
