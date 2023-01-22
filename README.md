# p5.quadrille.js

[p5.js](https://p5js.org/) [quadrille](https://en.wikipedia.org/wiki/Square_tiling) library.

- [p5.quadrille.js](#p5quadrillejs)
- [p5 functions](#p5-functions)
  - [createQuadrille](#createquadrille)
  - [drawQuadrille](#drawquadrille)
- [Quadrille properties](#quadrille-properties)
- [I/O](#io)
- [Boolean operators](#boolean-operators)
- [Geometry transformations](#geometry-transformations)
- [Conversion between representations](#conversion-between-representations)
- [Visual computing](#visual-computing)
- [Installation](#installation)
- [vs-code \& vs-codium \& gitpod hacking instructions](#vs-code--vs-codium--gitpod-hacking-instructions)

# p5 functions

## createQuadrille

[Polymorphic](https://en.wikipedia.org/wiki/Function_overloading) [p5.js](https://p5js.org/) function that creates a `quadrille` whose individual cells may be defined as numbers (**note** that a zero define an empty cell (see also `filter`), 4-length color arrays, images (both, [p5.Image](https://p5js.org/reference/#/p5.Image) and [p5.Graphics](https://p5js.org/reference/#/p5.Graphics) instances), colors ([p5.Color](https://p5js.org/reference/#/p5.Color) instances) and strings.

1. `createQuadrille(matrix)`
2. `createQuadrille(array)`
3. `createQuadrille(width, array)`
4. `createQuadrille(string)`
5. `createQuadrille(width, string)`
6. `createQuadrille(width, height)`
7. `createQuadrille(width, image, [coherence])`
8. `createQuadrille(width, bitboard, pattern)`
9. `createQuadrille(width, height, order, pattern)`

**Observations**

1. 

## drawQuadrille

`drawQuadrille(quadrille, [{[graphics], [pixelX], [pixelY], [row], [col], [tile], [contour], [cellLength], [outlineWeight], [outline], [textColor], [textZoom], [board], [numberColor], [min], [max]}])`

# Quadrille properties

1. `memory2D`: Array2D: quadrille memory read-write property.
2. `width` Number: quadrille width read-write property.
3. `height` Number: quadrille height read-write property.
4. `size` Number: Read-only property that retrieves the quadrille width times the quadrille height.
5. `order` Number: Read only property that retrieves the quadrille non-empty number of cells.

# I/O


# Boolean operators

# Geometry transformations

# Conversion between representations

# Visual computing

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