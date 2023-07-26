# `clear()`

Sets quadrille cells to `null`. Either all quadrille cells, a given `row`, a given cell or a set of identical cells using [flood fill](https://en.m.wikipedia.org/wiki/Flood_fill).

# Syntax

> `clear()`

> `clear(row)`

> `clear(row, col)`

> `clear(row, col, directions)`

> `clear(row, col, border)`

> `clear(row, col, directions, border)`

# Parameters

| <!-- -->   | <!-- -->                                                                                             |
|------------|------------------------------------------------------------------------------------------------------|
| row        | Number: number of the row to be cleared [\[0..height\]](/docs/props#height)                          |
| col        | Number: row number of the cell to be filled [\[0..width\]](/docs/props#width)                        |
| directions | Number: 4 or 8 directions of flood fill default is 4                                                 |
| border     | Boolean: specifies whether to include the border of a clearing area in flood fill default is `false` |

> :ToCPrevNext