---
title: "screenCol(pixelX, x, cellLength)"
weight: 7
symbol: screenCol
---

Returns the quadrille col to which the screen space `pixelX` coordinate belong.

> **Warning**
>
> 1. `screenCol(pixelX, x, cellLength)` returns a value not constrain to lie in [0..[width](../../../properties/read_write/width/)].
> 2. If the quadrille is currently being drawn use the [mouseCol](../../../properties/read_only/mouse_col/) property instead.

## Syntax

> `screenCol(pixelX, [x], [cellLength])`

## Parameters

| Param  | Description                                                                                              |
|------------|----------------------------------------------------------------------------------------------------------|
| `pixelX`     | Number: screen space x-coord                                                                             |
| `x`          | Number: quadrille upper left corner x-coord. If not provided it's value is inferred from `drawQuadrille` |
| `cellLength` | Number: cell length. If not provided it's value is inferred from `drawQuadrille`                         |
