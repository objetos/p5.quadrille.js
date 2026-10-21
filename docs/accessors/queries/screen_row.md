---
title: "screenRow(pixelY, y, cellLength)"
weight: 6
symbol: screenRow
---

Returns the quadrille row to which the screen space `pixelY` coordinate belong.

> **Warning**
>
> 1. `screenRow(pixelY, y, cellLength)` returns a value not constrain to lie in [0..[height](../../../properties/read_write/height/)].
> 2. If the quadrille is currently being drawn use the [mouseRow](../../../properties/read_only/mouse_row/) property instead.

## Syntax

> `screenRow(pixelY, [y], [cellLength])`

## Parameters

| Param  | Description                                                                                              |
|------------|----------------------------------------------------------------------------------------------------------|
| `pixelY`     | Number: screen space y-coord                                                                             |
| `y`          | Number: quadrille upper left corner y-coord. If not provided it's value is inferred from `drawQuadrille` |
| `cellLength` | Number: cell length. If not provided it's value is inferred from `drawQuadrille`                         |
