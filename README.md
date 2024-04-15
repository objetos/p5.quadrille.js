# p5.quadrille.js

[p5.js](https://p5js.org/) [quadrille](https://en.wikipedia.org/wiki/Square_tiling) open source library designed for implementing various [puzzle video games](https://en.wikipedia.org/wiki/Puzzle_video_game) and conducting visual computing experiments.

![Quadrille cells sorted by their luminance levels.](p5.quadrille.js.png)

In geometry, the square-tiling, square-tessellation or square-grid is a regular tiling of the Euclidean plane. [John Horton Conway](https://en.wikipedia.org/wiki/John_Horton_Conway) called it a quadrille.

The internal angle of the square is π/2 so four squares at a point make a full 2π angle. It is one of three regular tilings of the plane. The other two are the [triangular-tiling](https://en.wikipedia.org/wiki/Triangular_tiling) and the [hexagonal-tiling](https://en.wikipedia.org/wiki/Hexagonal_tiling).

The library comprises a `Quadrille` class and provides [p5 functions](https://objetos.github.io/p5.quadrille.js/docs/p5_functions/) to manipulate instances of it, even allowing to [customize the quadrille tiling](https://objetos.github.io/p5.quadrille.js/docs/p5_functions/draw_quadrille/#display-functions). The `Quadrille` class supports several read / write [properties](https://objetos.github.io/p5.quadrille.js/docs/properties/) and implements [geometry transformations](https://objetos.github.io/p5.quadrille.js/docs/geometry_transformations/), [boolean operators](https://objetos.github.io/p5.quadrille.js/docs/boolean_operators/) inspired by [constructive solid geometry](https://en.wikipedia.org/wiki/Constructive_solid_geometry), and [visual computing](https://objetos.github.io/p5.quadrille.js/docs/visual_computing/) methods such as image filtering using [convolution matrices](https://en.wikipedia.org/wiki/Kernel_%28image_processing%29) and [triangle rasterization](https://fgiesen.wordpress.com/2013/02/06/the-barycentric-conspirac/). It also implements several [immutable](https://objetos.github.io/p5.quadrille.js/docs/immutable_methods/) and [mutable](https://objetos.github.io/p5.quadrille.js/docs/mutable_methods/) methods, such as `clear`, `clone`, `fill`, `insert` and `replace` among others. It can be used as an interface to convert to / from other representations such as [arrays](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array), [images](https://p5js.org/reference/#/p5.Image) and [bitboards](https://en.wikipedia.org/wiki/Bitboard).

The library reference which illustrates most of its functionality is found along this site.

Contributions are welcome at the [GitHub library site](https://github.com/objetos/p5.quadrille.js).

# Releases

- [p5.quadrille.js](https://raw.githubusercontent.com/objetos/p5.quadrille.js/main/p5.quadrille.js)
- [CDN: p5.quadrille.js](https://cdn.jsdelivr.net/gh/objetos/p5.quadrille.js/p5.quadrille.js) and [p5.quadrille.min.js](https://cdn.jsdelivr.net/gh/objetos/p5.quadrille.js/p5.quadrille.min.js)
- [All Releases](https://github.com/objetos/p5.quadrille.js/releases)