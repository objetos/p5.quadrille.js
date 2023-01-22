# `colorizeTriangle()`

Colorize the triangle defined by vertices `(vertex0=) (row0, col0)`, `(vertex1=)(row1, col1)`, and `(vertex2=)(row2, col2)`, using [barycentric coordinates](https://fgiesen.wordpress.com/2013/02/06/the-barycentric-conspirac/) to interpolate `color0`, `color1` and `color2`. Implemented as:

```js
colorizeTriangle(row0, col0, row1, col1, row2, col2, color0, color1 = color0, color2 = color0) {
    this.rasterizeTriangle(
      row0, col0, row1, col1, row2, col2,
/*!*/      ({ pattern: xyza }) => color(xyza), // --> software "fragment shader" colorizes the (row0, col0), (row1, col1), (row2, col2) triangle
      // vertex attributes to be interpolated (each encoded as an array):
/*!*/      [red(color0), green(color0), blue(color0), alpha(color0)], // --> vertex0 color
/*!*/      [red(color1), green(color1), blue(color1), alpha(color1)], // --> vertex1 color
/*!*/      [red(color2), green(color2), blue(color2), alpha(color2)] // --> vertex2 color
    );
}
```
 
 Refer to [rasterizeTriangle()](/docs/vc/rasterize_triangle) when in need to interpolate other vertex data.

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