# p5.quadrille.js

[p5.js](https://p5js.org/) [quadrille](https://en.wikipedia.org/wiki/Square_tiling) library.

In geometry, the square-tiling, square-tessellation or square-grid is a regular tiling of the Euclidean plane. [John Horton Conway](https://en.wikipedia.org/wiki/John_Horton_Conway) called it a quadrille.

The internal angle of the square is 90 degrees so four squares at a point make a full 360 degrees. It is one of three regular tilings of the plane. The other two are the triangular-tiling and the hexagonal-tiling.

The library comprises a `Quadrille` class and provides the `createQuadrille` and `drawQuadrille` p5 functions. `Quadrille` implements geometry transformation and [constructive solid geometry](https://en.wikipedia.org/wiki/Constructive_solid_geometry)-like logical operators, and visual computing methods such as image filtering using [convolution matrices](https://en.wikipedia.org/wiki/Kernel_%28image_processing%29) and [triangle rasterization](https://fgiesen.wordpress.com/2013/02/06/the-barycentric-conspirac/). It also implements several memory management methods, such as `clear`, `clone`, `fill`, `insert` and `replace`. It can be used as an interface to convert to / from other representations such as [arrays](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array), [images](https://p5js.org/reference/#/p5.Image) and [bitboards](https://en.wikipedia.org/wiki/Bitboard).

The library reference and some examples are found at the [library site](https://objetos.github.io/p5.quadrille.js/).

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