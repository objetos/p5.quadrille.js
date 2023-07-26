# `fill()`

Fills quadrille cells with given `pattern`. Either current empty cells, a whole row, a given cell or a set of identical cells using [flood fill](https://en.m.wikipedia.org/wiki/Flood_fill).

# Syntax

> `fill(pattern)`

> `fill(row, pattern)`

> `fill(row, col, pattern)`

> `fill(row, col, pattern, directions)`

> `fill(row, col, pattern, border)`

> `fill(row, col, pattern, directions, border)`

# Parameters

| <!-- --> | <!-- -->                                                                                                                                                            |
|----------|---------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| pattern  | [p5.Image](https://p5js.org/reference/#/p5.Image) \| [p5.Graphics](https://p5js.org/reference/#/p5.Graphics) \| [p5.Color](https://p5js.org/reference/#/p5.Color) \| array \| object \| string \| number |
| row      | Number: col number of the cell to be filled [\[0..height\]](/docs/props#height)                                                                                     |
| col      | Number: row number of the cell to be filled [\[0..width\]](/docs/props#width)                                                                                       |
| directions | Number: 4 or 8 directions of flood fill default is 4                                                |
| border     | Boolean: specifies whether to include the border of a filling area in flood fill default is `false` |

> :ToCPrevNext