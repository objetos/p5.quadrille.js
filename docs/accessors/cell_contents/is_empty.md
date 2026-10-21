---
title: "isEmpty(row, col)"
weight: 3
symbol: isEmpty
---

Returns `true` if the cell found at `(row, col)` is empty and `false` otherwise. Empty means `== null` — which catches both `null` (the empty-cell value) **and** `undefined`. Since an out-of-bounds [read](../read/) returns `undefined`, **out-of-bounds positions count as empty too**. And since array input is normalized on entry — holes and explicit `undefined` become `null` — sparse arrays are welcome as quadrille sources; only **zero-copy array views** — raw arrays rendered by `drawQuadrille` — alias your memory untouched.

> **Warning**
>
> **Guard order matters in traversals.** Because out-of-bounds counts as empty, a BFS/DFS neighbor test of `isEmpty(r, c)` alone happily walks off the board. Lead with [isValid](../is_valid/): `isValid(r, c) && isEmpty(r, c)` — the pattern the built-in [reach](../../queries/reach/) and [path](../../queries/path/) queries follow.

## Syntax

> `isEmpty(row, col)`

## Parameters

| Param | Description                                                                       |
|-------|-----------------------------------------------------------------------------------|
| `row` | Number: row index of the cell to be read `∈` [[0..height]](../../../properties/read_write/height/)  |
| `col` | Number: column index of the cell to be read `∈` [[0..width]](../../../properties/read_write/width/) |

> **Note**
>
> Also available as the static method `Quadrille.isEmpty(value)`, which takes a `value` instead of a cell position.
