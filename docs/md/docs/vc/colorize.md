# `colorize()`

Colorize a triangle, defined by vertices `(row0, col0)`, `(row1, col1)`, and `(row2, col2)`, using [barycentric coordinates](https://fgiesen.wordpress.com/2013/02/06/the-barycentric-conspirac/). Same as `this.rasterize(row0, col0, row1, col1, row2, col2, (pattern) => color(pattern), pattern0, pattern1, pattern2)`, see [rasterize()](/docs/vc/rasterize).

# Syntax

> `rasterize(row0, col0, row1, col1, row2, col2, pattern0, [pattern1], [pattern2])`

# Parameters

| <!-- --> | <!-- -->                                                                           |
|----------|------------------------------------------------------------------------------------|
| row0     | Number: vertex0 row coordinate                                                     |
| col0     | Number: vertex0 col coordinate                                                     |
| row1     | Number: vertex1 row coordinate                                                     |
| col1     | Number: vertex1 col coordinate                                                     |
| row2     | Number: vertex2 row coordinate                                                     |
| col2     | Number: vertex2 col coordinate                                                     |
| pattern0 | (3 or)4-length color array: vertex0 pattern to be interpolated                     |
| pattern1 | (3 or)4-length color array: vertex1 pattern to be interpolated default is pattern0 |
| pattern2 | (3 or)4-length color array: vertex2 pattern to be interpolated default is pattern0 |

> :ToCPrevNext