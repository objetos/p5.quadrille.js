# `rasterize()`

Rasterize a triangle, defined by vertices `(row0, col0)`, `(row1, col1)`, and `(row2, col2)`, using [barycentric coordinates](https://fgiesen.wordpress.com/2013/02/06/the-barycentric-conspirac/), e.g., [colorize()](/docs/vc/colorize).

# Syntax

> `rasterize(row0, col0, row1, col1, row2, col2, shader, pattern0, [pattern1], [pattern2])`

# Parameters

| <!-- --> | <!-- -->                                                                        |
|----------|---------------------------------------------------------------------------------|
| row0     | Number: vertex0 row coordinate                                                  |
| col0     | Number: vertex0 col coordinate                                                  |
| row1     | Number: vertex1 row coordinate                                                  |
| col1     | Number: vertex1 col coordinate                                                  |
| row2     | Number: vertex2 row coordinate                                                  |
| col2     | Number: vertex2 col coordinate                                                  |
| shader   | Function: taking the interpolated pattern array and returning the cell p5.Color |
| pattern0 | Array: vertex0 attributes to be interpolated                                    |
| pattern1 | Array: vertex0 attributes to be interpolated default is pattern0                |
| pattern2 | Array: vertex0 attributes to be interpolated default is pattern0                |

> :ToCPrevNext