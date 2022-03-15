# `rasterize()`

Rasterize a triangle, defined by vertices `(row0, col0)`, `(row1, col1)`, and `(row2, col2)`, using [barycentric coordinates](https://fgiesen.wordpress.com/2013/02/06/the-barycentric-conspirac/). The user provided [software rendered](https://en.wikipedia.org/wiki/Software_rendering) [(fragment) shader](https://en.wikipedia.org/wiki/Shader) is a function parameterized with the object literal `{ pattern: interpolated_data_array, row: i, col: j }` and that should return a [p5.Color](https://p5js.org/reference/#/p5.Color). Refer to the [colorize()](/docs/vc/colorize) method for an example.

# Syntax

> `rasterize(row0, col0, row1, col1, row2, col2, shader, pattern0, [pattern1], [pattern2])`

# Parameters

| <!-- --> | <!-- -->                                                                                                  |
|----------|-----------------------------------------------------------------------------------------------------------|
| row0     | Number: vertex0 row coordinate                                                                            |
| col0     | Number: vertex0 col coordinate                                                                            |
| row1     | Number: vertex1 row coordinate                                                                            |
| col1     | Number: vertex1 col coordinate                                                                            |
| row2     | Number: vertex2 row coordinate                                                                            |
| col2     | Number: vertex2 col coordinate                                                                            |
| shader   | Function: taking `{ pattern: interpolated_data_array, row: i, col: j }` params and returning a `p5.Color` |
| pattern0 | Array: vertex0 attributes to be interpolated                                                              |
| pattern1 | Array: vertex0 attributes to be interpolated default is pattern0                                          |
| pattern2 | Array: vertex0 attributes to be interpolated default is pattern0                                          |

> :ToCPrevNext