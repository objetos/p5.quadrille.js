# p5.quadrille.js

[p5.js](https://p5js.org/) [quadrille](https://en.wikipedia.org/wiki/Square_tiling) library.

- [p5.quadrille.js](#p5quadrillejs)
- [p5 functions](#p5-functions)
  - [createQuadrille](#createquadrille)
  - [drawQuadrille](#drawquadrille)
  - [visitQuadrille](#visitquadrille)
- [Quadrille API](#quadrille-api)
  - [Properties](#properties)
  - [Methods](#methods)
  - [Algebra](#algebra)
    - [Accessors](#accessors)
    - [Mutators](#mutators)
    - [Transforms](#transforms)
    - [Visual algorithms](#visual-algorithms)
    - [Reformatter](#reformatter)
- [Installation](#installation)
- [vs-code \& vs-codium \& gitpod hacking instructions](#vs-code--vs-codium--gitpod-hacking-instructions)

# p5 functions

## createQuadrille

[p5.js](https://p5js.org/) function that creates an empty or a filled `quadrille`.

1. `createQuadrille()`: Creates an 8x8 quadrille with a chessboard pattern.
2. `createQuadrille(FEN)`: Creates a quadrille with the chess board position described by the given [FEN](https://en.wikipedia.org/wiki/Forsyth%E2%80%93Edwards_Notation).
3. `createQuadrille(width, height)`: creates an empty quadrille having `width` number of columns and `height` number of rows.
4. `createQuadrille(`[`jagged_array`](https://en.wikipedia.org/wiki/Jagged_array)`)`: creates a quadrille and fills its cells taking the `jagged_array` items as source. Note that `null` `array` items represent empty quadrille cells.
5. `createQuadrille(array)`: creates a quadrille and fills its cells taking the `array` items as source. Note that `null` `array` items represent empty quadrille cells.
6. `createQuadrille(width, array)`: creates a quadrille and fills its cells taking the `array` items as source up to `width` number of columns. Observe that (one or) several quadrille rows may be created to include all the `array` items. Note that `null` `array` items represent empty quadrille cells. 
7. `createQuadrille(string)`: creates a quadrille and fills its cells taking `string` as source. The resulting number of quadrille `columns` matches that of the [string length](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String/length).
8. `createQuadrille(width, string)`: creates a quadrille and fills its cells taking `string` as source. Note that (one or) several quadrille rows may be created to include all the `string` characters.
9. `createQuadrille(width, image)`: Converts image (either a [p5.Image](https://p5js.org/reference/#/p5.Image) or a [p5.Graphics](https://p5js.org/reference/#/p5.Graphics)) into a quadrille.
10. `createQuadrille(width, image, coherence)`: Converts image (either a [p5.Image](https://p5js.org/reference/#/p5.Image) or a [p5.Graphics](https://p5js.org/reference/#/p5.Graphics)) into a pixelated quadrille.
11. `createQuadrille(width, height, order, pattern)`: creates a quadrille and fills its cells using `pattern` (any data type instance but `undefined` or `null`) which is randomly repeated `along` the quadrille up to `order` number of times.
12. `createQuadrille(width, `[`bigint`](https://www.w3schools.com/js/js_bigint.asp)`, pattern)`: Converts a bigint into a quadrille pattern, filling 1 (or on) bits with the specified value.

## drawQuadrille

[p5.js](https://p5js.org/) function that draws the quadrille at `(x, y)` screen position on the [`graphics`](https://p5js.org/reference/#/p5.Graphics) (which is the main [`canvas`](https://p5js.org/reference/#/p5/createCanvas) by default), using the display parameter values.

```js
drawQuadrille(quadrille, [{
  [graphics=this],
  [x=0],
  [y=0],
  [cellLength=Quadrille.cellLength],
  [outlineWeight=Quadrille.outlineWeight],
  [outline=Quadrille.outline],
  [textColor=Quadrille.textColor],
  [textZoom=Quadrille.textZoom],
  [tileDisplay=Quadrille.tile],
  [imageDisplay=Quadrille.image],
  [stringDisplay=Quadrille.string],
  [colorDisplay=Quadrille.color],
  [numberDisplay=Quadrille.number],
  [arrayDisplay],
  [objectDisplay]
  }])
```

**Observations**

1. The default display parameter values are defined as `textColor = 'DodgerBlue'`, `textZoom = 0.89`, `outline = 'OrangeRed'`, `outlineWeight = 2` and `cellLength = 100`.
2. To display cells populated with an `array` or an `object` you should provide implementations of the `arrayDisplay` and `objectDisplay` functions, respectively. Provide your own display functions to override the defaults (e.g., to display the quadrille using a [tiling](https://en.wikipedia.org/wiki/Tessellation) different than the square).
3. The display functions are parameterized as follows:
   * `tileDisplay`:  `{graphics: graphics, outline: outline, outlineWeight: outlineWeight, cellLength: cellLength, row: i, col: j}`.
   * `imageDisplay`, `colorDisplay`, `numberDisplay`, `arrayDisplay` and `objectDisplay`: `{graphics: graphics, cell: cell, outline: outline, outlineWeight: outlineWeight, cellLength: cellLength, row: i, col: j}`.
   * `stringDisplay`: `{graphics: graphics, cell: cell, textColor: textColor, textZoom: textZoom, outline: outline, outlineWeight: outlineWeight, cellLength: cellLength, row: i, col: j}`.

## visitQuadrille

[p5.js](https://p5js.org/) function that visits quadrille cells executing the `fx` function taking (row, col) params (which defines the quadrille visited cell position) either on all cells or those defined by the values array.

# Quadrille API

## [Properties](https://www.w3schools.com/js/js_object_accessors.asp)

1. `mouseRow` Number: Read-only property that retrieves the quadrille row under the current mouse position.
2. `mouseCol` Number: Read-only property that retrieves the quadrille col under the current mouse position.
3. `memory2D`: Array2D: quadrille memory read-write property.
4. `width` Number: quadrille width read-write property.
5. `height` Number: quadrille height read-write property.
6. `size` Number: read-only property that retrieves the quadrille width times the quadrille height.
7. `order` Number: read only property that retrieves the quadrille non-empty number of cells.

## Methods

## Algebra

The following operators are inspired by [CSG](https://en.wikipedia.org/wiki/Constructive_solid_geometry) as a high-level quadrille modelling technique.

1. `Quadrille.and(quadrille1, quadrille2, [row=0], [col=0])`: returns the quadrille obtained from the *intersection* of the two given quadrilles.
2. `Quadrille.diff(quadrille1, quadrille2, [row=0], [col=0])`: returns the quadrille obtained from the *difference* of the two given quadrilles.
3. `Quadrille.neg(quadrille, pattern)`: returns the quadrille obtained from clearing the `quadrille` filled cells and filling its empty cells with `pattern` (any data type instance but `undefined` or `null`).
4. `Quadrille.merge(quadrille1, quadrille2, operator, [row=0], [col=0])`: returns the quadrille obtained after applying the given logical operator between the two given quadrilles. This method is useful to implement the other _high-level_ logical operators. For instance the `and` operator is implemented as follows:
    ```js
    static and(quadrille1, quadrille2, row=0, col=0) {
      return this.merge(quadrille1, quadrille2,
        (q1, q2) => {
          if (q1 && q2) {
            return q1;
          }
        },
        row, col);
    }
    ```
5. `Quadrille.or(quadrille1, quadrille2, [row=0], [col=0])`: returns the quadrille obtained from the *union* of the two given quadrilles.
6. `Quadrille.xor(quadrille1, quadrille2, [row=0], [col=0])`: returns the quadrille obtained from the *intersection* minus the *union* of the two given quadrilles.

### Accessors

1. `clone()`: returns a [shallow copy](https://en.wikipedia.org/wiki/Object_copying#Shallow_copy) of the quadrille.
2. `isEmpty(row, col)`: returns `true` if cell found at `(row, col)` is empty and `false` otherwise.
3. `isFilled(row, col)`: returns `true` if cell found at `(row, col)` is filled and `false` otherwise.
4. `isNumber(row, col)`: returns `true` if cell found at `(row, col)` is a number and `false` otherwise.
5. `isColor(row, col)`: returns `true` if cell found at `(row, col)` is a color and `false` otherwise.
6. `isString(row, col)`: returns `true` if cell found at `(row, col)` is string and `false` otherwise.
7. `isImage(row, col)`: returns `true` if cell found at `(row, col)` is image and `false` otherwise.
8. `isArray(row, col)`: returns `true` if cell found at `(row, col)` is array and `false` otherwise.
9. `isObject(row, col)`: returns `true` if cell found at `(row, col)` is object and `false` otherwise.
10. `magnitude(row)`: returns the number of non-empty cells of a given quadrille `row`.
11. `read(row, col)`: returns the contents of the quadrille cell at `(row, col)`. Returns `undefined` if the cell doesn't exist.
12. `ring(row, col, [dimension=1])`: returns the ring of neighbor cells centered at (row, col) as a new quadrille.
13. `search(pattern, [strict])`: Searches for `pattern` within this quadrille and returns an array of `{row, col}` matches.

### Mutators

1. `clear()`, `clear(row)`, `clear(row, col)`: clears quadrille cells. Either all quadrille cells, a given `row` or a cell, resp.
2. `delete(row)`: deletes the given quadrille `row`.
3. `fill(pattern)`, `fill(row, pattern)`, `fill(row, col, pattern)`: fills quadrille cells with given `pattern` (any data type instance but `undefined` or `null`). Either current empty cells, a whole `row`, or a cell, respectively.
4. `insert(row)`: inserts an empty `row` into the quadrille.
5. `rand(order, pattern)`: fills the quadrille with `pattern` (any data type instance but `undefined` or `null`) up to `order` (number of repetitions), randomly adding or removing cells as necessary.
6. `randomize()`: randomly re-arranges the quadrille cells.
7.  `replace(pattern)`, `replace(pattern1, pattern2)`: either replaces non empty cells with `pattern` or searches `pattern1` cell occurrences and replaces them with `pattern2`, respectively. Both, `pattern1` and `pattern2` are any data type instances but `undefined` or `null`.

### Transforms

1. `reflect()`; horizontal reflection of the quadrille cells.
2. `rotate()`: π/2 clockwise rotation of the quadrille cells.
3. `transpose()`: [transposes](https://en.wikipedia.org/wiki/Transpose) the quadrille cells.

### Visual algorithms

1. `colorize(color0, [color1=color0], [color2=color0], [color3=color0])`: colorizes the quadrille according to upper-left corner `color0`, bottom-left corner `color1`, upper-right corner `color2`, and bottom-right corner `color3` colors.
2. `colorizeTriangle(row0, col0, row1, col1, row2, col2, color0, [color1=color0], [color2=color0])`: colorizes the triangle defined by vertices `(vertex0=) (row0, col0)`, `(vertex1=)(row1, col1)`, and `(vertex2=)(row2, col2)`, using [barycentric coordinates](https://fgiesen.wordpress.com/2013/02/06/the-barycentric-conspirac/) to interpolate `color0`, `color1` and `color2`. Implemented as:
    ```js
    colorizeTriangle(row0, col0, row1, col1, row2, col2, color0, color1=color0, color2=color0) {
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
3. `filter(mask, [row=0, col=0])`: applies [convolution mask](https://en.wikipedia.org/wiki/Kernel_%28image_processing%29) filter either to the whole quadrille or at specific `(row, col)` cell.
4. `sort([{[mode='LUMA'], [target='magenta'], [ascending=true], [textColor='black'], [textZoom=Quadrille.TEXT_ZOOM], [background=Quadrille.BACKGROUND], [cellLength=this.width], [numberColor=Quadrille.numberColor], [min=0], [max=0]}])`: sorts quadrille cells according to their coloring. Note that the `BACKGROUND` param is black, `mode` is either `'LUMA'`, `'AVG'`, or `'DISTANCE'`, `target` is a `p5.Color` instance and `ascending` is a boolean. Remaining params defined as within the [`drawQuadrille`](#p5-functions) function.
5. `rasterize(shader, pattern0, [pattern1=pattern0], [pattern2=pattern0], [pattern3=pattern0])`: rasterizes the quadrille according to upper-left corner vertex `pattern0`, bottom-left corner vertex `pattern1`, upper-right corner vertex `pattern2`, and bottom-right corner vertex `pattern3`,  using (fragment) `shader`.
6. `rasterizeTriangle(row0, col0, row1, col1, row2, col2, shader, pattern0, [pattern1=pattern0], [pattern2=pattern0])`: rasterizes the triangle defined by vertices `(row0, col0)`, `(row1, col1)`, and `(row2, col2)`, using [barycentric coordinates](https://fgiesen.wordpress.com/2013/02/06/the-barycentric-conspirac/). The user provided [software rendered](https://en.wikipedia.org/wiki/Software_rendering) [(fragment) shader](https://en.wikipedia.org/wiki/Shader) is a function parameterized with the object literal `{ pattern: interpolated_data_array, row: i, col: j }` and that should return a [p5.Color](https://p5js.org/reference/#/p5.Color).

### Reformatter

1. `toArray()`: returns a [row-major order](https://en.wikipedia.org/wiki/Row-_and_column-major_order) array of the quadrille cells. The resulting array has `quadrille.width * quadrille.height` dimensions.
2. `toBigInt()`: returns the [bigint](https://www.w3schools.com/js/js_bigint.asp) representation of the quadrille filled cells using [big-endian](https://en.wikipedia.org/wiki/Endianness) and [row-major ordering](https://en.wikipedia.org/wiki/Row-_and_column-major_order).
3. `toImage`: Returns a [p5.Image](https://p5js.org/reference/#/p5.Image) representation of this quadrille.
4. `toFEN`: Generates a string in Forsyth–Edwards Notation (FEN) representing the current position of the chess board.

# Installation

Link the `p5.quadrille.js` library into your HTML file, after you have linked in [p5.js](https://p5js.org/libraries/). For example:

```html | index.html
<!doctype html>
<html>
<head>
  <script src="p5.js"></script>
  <script src="p5.sound.js"></script>
  <script src="https://cdn.jsdelivr.net/gh/objetos/p5.quadrille.js/p5.quadrille.js"></script>
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

To run and hack the [demo](https://github.com/objetos/p5.quadrille.js/blob/master/demo/):

1. Clone the repo (`git clone https://github.com/objetos/p5.quadrille.js`) and open it with your favorite editor.
2. Install the [p5-vscode extension](https://marketplace.visualstudio.com/items?itemName=samplavigne.p5-vscode).
3. Head over `demo/index.html` and press your editor `Go Live` button.
