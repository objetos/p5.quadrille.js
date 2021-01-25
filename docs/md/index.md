# p5.quadrille.js

[p5.js](https://p5js.org/) [quadrille](https://en.wikipedia.org/wiki/Square_tiling) library.

In geometry, the square-tiling, square-tessellation or square-grid is a regular tiling of the Euclidean plane. [John Horton Conway](https://en.wikipedia.org/wiki/John_Horton_Conway) called it a quadrille.

The internal angle of the square is 90 degrees so four squares at a point make a full 360 degrees. It is one of three regular tilings of the plane. The other two are the triangular-tiling and the hexagonal-tiling.

This library may be useful to implement all sorts of [tile matching video games](https://en.wikipedia.org/wiki/Tile-matching_video_game), such as [tetris](https://en.wikipedia.org/wiki/Tetris). The library comprises a single `Quadrille` class and its reference together with some [demos](/docs/demos) are found along this site.

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
