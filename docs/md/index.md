add missing from image sketch here

# p5.quadrille.js

[p5.js](https://p5js.org/) [quadrille](https://en.wikipedia.org/wiki/Square_tiling) library.

In geometry, the square-tiling, square-tessellation or square-grid is a regular tiling of the Euclidean plane. [John Horton Conway](https://en.wikipedia.org/wiki/John_Horton_Conway) called it a quadrille.

The internal angle of the square is 90 degrees so four squares at a point make a full 360 degrees. It is one of three regular tilings of the plane. The other two are the triangular-tiling and the hexagonal-tiling.

The library comprises a `Quadrille` class and provides the [createQuadrille](/docs/p5-fx/create_quadrille) and [drawQuadrille](/docs/p5-fx/draw_quadrille) p5 functions. `Quadrille` implements geometry transformation and [constructive solid geometry](https://en.wikipedia.org/wiki/Constructive_solid_geometry)-like logical operators. It also implements several memory management methods, such as [clear](/docs/io/clear), [clone](/docs/io/clone), [fill](/docs/io/fill), and [insert](/docs/io/insert). It can be used as an interface to convert to / from other representations such as [arrays](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array), [images](https://p5js.org/reference/#/p5.Image) and [bitboards](https://en.wikipedia.org/wiki/Bitboard).

The library reference together with some demos are found along this site.

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

> :ToCPrevNext
