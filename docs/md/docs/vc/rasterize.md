# `rasterize()`

Rasterize quadrille according to upper-left corner vertex `pattern0`, bottom-left corner vertex `pattern1`, upper-right corner vertex `pattern2`, and bottom-right corner vertex `pattern3`,  using (fragment) `shader`. Call [rasterizeTriangle()](/docs/vc/rasterize_triangle) on the two non-overlapping triangles entirely covering the quadrille.

# Syntax

> `rasterize(shader, pattern0, [pattern1], [pattern2], [pattern3])`

# Parameters

| <!-- --> | <!-- -->                                                                                                  |
|----------|-----------------------------------------------------------------------------------------------------------|
| shader   | Function: taking `{ pattern: interpolated_data_array, row: i, col: j }` params and returning a `p5.Color` |
| pattern0 | Array: corner0 attributes to be interpolated                                                              |
| pattern1 | Array: corner1 attributes to be interpolated default is pattern0                                          |
| pattern2 | Array: corner2 attributes to be interpolated default is pattern0                                          |
| pattern3 | Array: corner3 attributes to be interpolated default is pattern0                                          |

> :ToCPrevNext