# p5.quadrille.js

[p5.js](https://p5js.org/) [quadrille](https://en.wikipedia.org/wiki/Square_tiling) library.

- [p5 functions](#p5-functions)
  - [createQuadrille](#createquadrille)
  - [drawQuadrille](#drawquadrille)
- [Quadrille API](#quadrille-api)
  - [Properties](#properties)
  - [Methods](#methods)
    - [Conversion between representations](#conversion-between-representations)
    - [Geometry transformations](#geometry-transformations)
    - [I/O](#io)
    - [Visual Computing](#visual-computing)
  - [Static methods](#static-methods)
- [Installation](#installation)
- [vs-code \& vs-codium \& gitpod hacking instructions](#vs-code--vs-codium--gitpod-hacking-instructions)


**Observations**

1. All the properties
2. All the params defined below within `[` and `]` are optional.
3. The `pattern` parameter is either a number, color, image or string which defines how an individual quadrille cell is filled.

# p5 functions

## createQuadrille

[Polymorphic](https://en.wikipedia.org/wiki/Function_overloading) [p5.js](https://p5js.org/) ([overloaded](https://en.wikipedia.org/wiki/Function_overloading)) function that creates a `quadrille` whose individual cells may be defined as numbers (**note** that a zero define an empty cell (see also `filter`), 4-length color arrays, images (both, [p5.Image](https://p5js.org/reference/#/p5.Image) and [p5.Graphics](https://p5js.org/reference/#/p5.Graphics) instances), colors ([p5.Color](https://p5js.org/reference/#/p5.Color) instances) and strings.

1. `createQuadrille(`[`jagged_array`](https://en.wikipedia.org/wiki/Jagged_array)`)`
2. `createQuadrille(array)`
3. `createQuadrille(width, array)`
4. `createQuadrille(string)`
5. `createQuadrille(width, string)`
6. `createQuadrille(width, height)`
7. `createQuadrille(width, image, [coherence])`: `coherence` defines whether or not the quadrille filling algorithm should use spatial coherence.
8. `createQuadrille(width, `[`bitboard`](https://en.wikipedia.org/wiki/Bitboard)`, pattern)`
9. `createQuadrille(width, height, order, pattern)`

## drawQuadrille

`drawQuadrille(quadrille, [{[graphics], [pixelX], [pixelY], [row], [col], [tile], [contour], [cellLength], [outlineWeight], [outline], [textColor], [textZoom], [board], [numberColor], [min], [max]}])`

**Observations**

# Quadrille API

## [Properties](https://www.w3schools.com/js/js_object_accessors.asp)

1. `memory2D`: Array2D: quadrille memory read-write property.
2. `width` Number: quadrille width read-write property.
3. `height` Number: quadrille height read-write property.
4. `size` Number: read-only property that retrieves the quadrille width times the quadrille height.
5. `order` Number: read only property that retrieves the quadrille non-empty number of cells.

## Methods

### Conversion between representations

1. `from(image, [coherence])`, `from(`[`bitboard`](https://en.wikipedia.org/wiki/Bitboard)`, pattern)`: fills quadrille cells with given `image` or `[`bitboard`](https://en.wikipedia.org/wiki/Bitboard)` using `pattern`, resp.
2. `toArray()`: returns a [row-major order](https://en.wikipedia.org/wiki/Row-_and_column-major_order) array of the quadrille cells. The resulting array has `quadrille.width * quadrille.height` dimensions.
3. `toInt()`: returns the integer representation of the quadrille cells using [big-endian](https://en.wikipedia.org/wiki/Endianness) and [row-major ordering](https://en.wikipedia.org/wiki/Row-_and_column-major_order).
4. `toMatrix()`: returns a [row-major order](https://en.wikipedia.org/wiki/Row-_and_column-major_order) matrix of the quadrille cells. The resulting 2D array has `quadrille.width * quadrille.height` dimensions.

### Geometry transformations

1. `reflect()`; horizontal reflection of the quadrille cells.
2. `rotate()`: π/2 clockwise rotation of the quadrille cells.
3. `transpose()`: [transposes](https://en.wikipedia.org/wiki/Transpose) the quadrille cells.

### I/O

1. `clear()`, `clear(row)`, `clear(row, col)`: clears quadrille cells. Either all quadrille cells, a given `row` or a cell, resp.
2. `clone()`: returns a [shallow copy](https://en.wikipedia.org/wiki/Object_copying#Shallow_copy) of the quadrille.
3. `delete(row)`: deletes the given quadrille `row`.
4. `fill(pattern)`, `fill(row, pattern)`, `fill(row, col, pattern)`: fills quadrille cells with given `pattern`. Either current filled cells, a whole `row`, or a cell, resp.
5. `insert(row)`: inserts an empty `row` into the quadrille.
6. `magnitude(row)`: returns the number of non-empty cells of a given quadrille `row`.
7. `rand(order, pattern)`: fills the quadrille with `pattern` up to `order` (number of repeations), randomly adding or removing cells as necessary.
8. `randomize()`: randomly re-arranges the quadrille cells.
9. `read(row, col)`: returns the contents of the quadrille cell at `(row, col)`. Returns `undefined` if the cell doesn't exist.
10. `replace(pattern1, pattern2)`: searches `pattern1` quadrille cell ocurrences and replaces them with `pattern2`.

### Visual Computing

1. `colorize(color0, [color1], [color2], [color3])`: colorizes the quadrille according to upper-left corner `color0`, bottom-left corner `color1`, upper-right corner `color2`, and bottom-right corner `color3` colors.
2. `colorizeTriangle(row0, col0, row1, col1, row2, col2, color0, [color1], [color2])`: colorizes the triangle defined by vertices `(vertex0=) (row0, col0)`, `(vertex1=)(row1, col1)`, and `(vertex2=)(row2, col2)`, using [barycentric coordinates](https://fgiesen.wordpress.com/2013/02/06/the-barycentric-conspirac/) to interpolate `color0`, `color1` and `color2`. Implemented as:
    ```js
    colorizeTriangle(row0, col0, row1, col1, row2, col2, color0, color1 = color0, color2 = color0) {
      this.rasterizeTriangle(
        row0, col0, row1, col1, row2, col2,
        ({ pattern: xyza }) => color(xyza), // fragment shader colorizes (row0, col0), (row1, col1), (row2, col2) triangle
        // vertex attributes to be interpolated (each encoded as an array):
        [red(color0), green(color0), blue(color0), alpha(color0)], // vertex0 color
        [red(color1), green(color1), blue(color1), alpha(color1)], // vertex1 color
        [red(color2), green(color2), blue(color2), alpha(color2)] // vertex2 color
      );
    }
    ```
3. `filter(mask, [row, col])`: applies [convolution mask](https://en.wikipedia.org/wiki/Kernel_%28image_processing%29) filter either to the whole quadrille or at specific `(row, col)` cell.
4. `sort([{[mode], [target], [ascending], [textColor], [textZoom], [outline], [background], [numberColor], [min], [max]}])`: sorts quadrille cells according to their coloring. `mode` is either `LUMA`, `AVG`, or `DISTANCE` (default is `LUMA`), `target` a color and `ascending` a boolean. Remaining params defined as within the [`drawQuadrille`](#p5-functions) function.
5. `rasterize(shader, pattern0, [pattern1], [pattern2], [pattern3])`: rasterizes the quadrille according to upper-left corner vertex `pattern0`, bottom-left corner vertex `pattern1`, upper-right corner vertex `pattern2`, and bottom-right corner vertex `pattern3`,  using (fragment) `shader`.
6. `rasterizeTriangle(row0, col0, row1, col1, row2, col2, shader, pattern0, [pattern1], [pattern2])`: rasterizes the triangle defined by vertices `(row0, col0)`, `(row1, col1)`, and `(row2, col2)`, using [barycentric coordinates](https://fgiesen.wordpress.com/2013/02/06/the-barycentric-conspirac/). The user provided [software rendered](https://en.wikipedia.org/wiki/Software_rendering) [(fragment) shader](https://en.wikipedia.org/wiki/Shader) is a function parameterized with the object literal `{ pattern: interpolated_data_array, row: i, col: j }` and that should return a [p5.Color](https://p5js.org/reference/#/p5.Color).

## Static methods

1. `Quadrille.AND(quadrille1, quadrille2, [row], [col])`: returns the quadrille obtained from the *intersection* of the two given quadrilles.
2. `Quadrille.DIFF(quadrille1, quadrille2, [row], [col])`: returns the quadrille obtained from the *difference* of the two given quadrilles.
3. `Quadrille.NEG(quadrille, pattern)`: returns the quadrille obtained from clearing the `quadrille` filled cells and filling its empty cells with `pattern`.
4. `Quadrille.OP(quadrille1, quadrille2, operator, [row], [col])`: returns the quadrille obtained after applying the given logical operator between the two given quadrilles. This method is useful to implement the other _high-level_ logical operators. For instance the [AND](/docs/logic/and) operator is implemented as follows:
    ```js
    static AND(quadrille1, quadrille2, row=0, col=0) {
      return this.OP(quadrille1, quadrille2,
        (q1, q2) => {
          if (q1 && q2) {
            return q1;
          }
        },
        row, col);
    }
    ```
5. `Quadrille.OR(quadrille1, quadrille2, [row], [col])`: returns the quadrille obtained from the *union* of the two given quadrilles.
6. `Quadrille.XOR(quadrille1, quadrille2, [row], [col])`: returns the quadrille obtained from the *intersection* minus the *union* of the two given quadrilles.

# Installation

Link the `p5.quadrille.js` library into your HTML file, after you have linked in [p5.js](https://p5js.org/libraries/). For example:

```html | index.html
<!doctype html>
<html>
<head>
  <script src="p5.js"></script>
  <script src="p5.sound.js"></script>
  <script src=https://cdn.jsdelivr.net/gh/objetos/p5.quadrille.js/p5.quadrille.js></script>
  <script src="sketch.js"></script>
</head>
<body>
</body>
</html>
```

to include its minified version use:

```html
<script src=https://cdn.jsdelivr.net/gh/objetos/p5.quadrille.js/p5.quadrille.min.js></script>
```

instead.

# [vs-code](https://code.visualstudio.com/) & [vs-codium](https://vscodium.com/) & [gitpod](https://www.gitpod.io/) hacking instructions

To run and hack the testing [examples](https://github.com/objetos/p5.quadrille.js/blob/master/examples/):

1. Clone the repo (`git clone https://github.com/objetos/p5.quadrille.js`) and open it with your favorite editor.
2. Install the [p5-vscode extension](https://marketplace.visualstudio.com/items?itemName=samplavigne.p5-vscode).
3. Head over `examples/*/index.html` and press your editor `Go Live` button.