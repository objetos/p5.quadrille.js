# `fill()`

Fills quadrille cells with given `pattern`. Either current filled cells, a whole row, or a given cell.

# Syntax

> `fill(pattern)`

> `fill(row, pattern)`

> `fill(row, col, pattern)`

# Parameters

| <!-- --> | <!-- -->                                                                                                                                                            |
|----------|---------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| pattern  | [p5.Image](https://p5js.org/reference/#/p5.Image) \| [p5.Color](https://p5js.org/reference/#/p5.Color) \| 4-length color array \| 1-length string \| 0: empty cells |
| row      | Number: col number of the cell to be filled [\[0..height\]](/docs/props#height)                                                                                     |
| col      | Number: row number of the cell to be filled [\[0..width\]](/docs/props#width)                                                                                       |

> :ToCPrevNext