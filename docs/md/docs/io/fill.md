# `fill()`

Fills quadrille cells with given `pattern`. Either current empty cells, a whole row, or a given cell.

# Syntax

> `fill(pattern)`

> `fill(row, pattern)`

> `fill(row, col, pattern)`

# Parameters

| <!-- --> | <!-- -->                                                                                                                                                            |
|----------|---------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| pattern  | [p5.Image](https://p5js.org/reference/#/p5.Image) \| [p5.Graphics](https://p5js.org/reference/#/p5.Graphics) \| [p5.Color](https://p5js.org/reference/#/p5.Color) \| array \| object \| string \| number |
| row      | Number: col number of the cell to be filled [\[0..height\]](/docs/props#height)                                                                                     |
| col      | Number: row number of the cell to be filled [\[0..width\]](/docs/props#width)                                                                                       |

> :ToCPrevNext