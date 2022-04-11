# `colorizeTriangle()`

Colorize a triangle, defined by vertices `(vertex0=) (row0, col0)`, `(vertex1=)(row1, col1)`, and `(vertex2=)(row2, col2)`, using [barycentric coordinates](https://fgiesen.wordpress.com/2013/02/06/the-barycentric-conspirac/) to interpolate `color0`, `color1` and `color2`. Implemented as:

```js
colorize(row0, col0, row1, col1, row2, col2, color0, color1 = color0, color2 = color0) {
    this.rasterize(row0, col0, row1, col1, row2, col2,
      // Shader which colorizes the (row0, col0), (row1, col1), (row2, col2) triangle, according to the
      // pattern0.xyza, pattern1.xyza and pattern2.xyza interpolated color vertex patterns, respectively.
      ({ pattern: xyza }) => color(xyza), [red(color0), green(color0), blue(color0), alpha(color0)],
                                          [red(color1), green(color1), blue(color1), alpha(color1)],
                                          [red(color2), green(color2), blue(color2), alpha(color2)]);
}
```
 
 Note that `({ pattern: xyza }) => color(xyza)` represents the fragment shader function in  [rasterize()](/docs/vc/rasterize).

# Syntax

> `colorizeTriangle(row0, col0, row1, col1, row2, col2, color0, [color1], [color2])`

# Parameters

| <!-- --> | <!-- -->                                                                                                                                            |
|----------|-----------------------------------------------------------------------------------------------------------------------------------------------------|
| row0     | Number: vertex0 row coordinate                                                                                                                      |
| col0     | Number: vertex0 col coordinate                                                                                                                      |
| row1     | Number: vertex1 row coordinate                                                                                                                      |
| col1     | Number: vertex1 col coordinate                                                                                                                      |
| row2     | Number: vertex2 row coordinate                                                                                                                      |
| col2     | Number: vertex2 col coordinate                                                                                                                      |
| color0   | [p5.Color](https://p5js.org/reference/#/p5.Color) \| 4-length color array \| 1-length string \|: vertex0 color to be interpolated                   |
| color1   | [p5.Color](https://p5js.org/reference/#/p5.Color) \| 4-length color array \| 1-length string \|: vertex1 color to be interpolated default is color0 |
| color2   | [p5.Color](https://p5js.org/reference/#/p5.Color) \| 4-length color array \| 1-length string \|: vertex2 color to be interpolated default is color0 |

> :ToCPrevNext