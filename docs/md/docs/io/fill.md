# `fill()`

Fills quadrille cells with given `pattern`. Either:

1. Current filled cells: `fill(pattern)`;
2. A whole row: `fill(row, pattern)`; or,
3. A given cell: `fill(row, col, pattern`.

# Syntax

> `fill(pattern)`

> `fill(row, pattern)`

> `fill(row, col, pattern`

# Parameters

| <!-- --> | <!-- -->                                                                       |
|----------|--------------------------------------------------------------------------------|
| pattern  | [p5.Color](https://p5js.org/reference/#/p5.Color) | String | 0: filled pattern |
| row      | Number: row number of the cell to be filled [0..[width](/docs/props#width)     |
| col      | Number: col number of the cell to be filled [0..[height](/docs/props#height)   |

> :ToCPrevNext