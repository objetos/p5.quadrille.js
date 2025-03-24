[![Read the Paper](https://img.shields.io/badge/Read%20the%20Paper-ScienceDirect-blue)](https://www.sciencedirect.com/science/article/pii/S2352711024002097?ref=cra_js_challenge&fr=RR-1)

# p5.quadrille.js

[p5.quadrille.js](https://github.com/objetos/p5.quadrille.js) is an open-source [p5.js](https://p5js.org/) library tailored for students, visual artists, and game designers. It supports the creation of [grid-based games](https://objetos.github.io/docs/intro/gbg/) and the exploration of visual algorithms.

![Quadrille cells sorted by their luminance levels.](p5.quadrille.js.png)

In geometry, the square-tiling, square-tessellation or square-grid is a regular tiling of the Euclidean plane. [John Horton Conway](https://en.wikipedia.org/wiki/John_Horton_Conway) called it a quadrille.

The internal angle of the square is π/2 so four squares at a point make a full 2π angle. It is one of three regular tilings of the plane. The other two are the [triangular-tiling](https://en.wikipedia.org/wiki/Triangular_tiling) and the [hexagonal-tiling](https://en.wikipedia.org/wiki/Hexagonal_tiling).

The library comprises a [Quadrille class](https://github.com/objetos/p5.quadrille.js/blob/19b7bf11f64fb5a5e400187bc3b2e29fb1bf71fe/p5.quadrille.js#L9) and provides [p5 functions](https://objetos.github.io/p5.quadrille.js/docs/p5_functions/) to manipulate instances of it, even allowing to [customize the quadrille tiling](https://objetos.github.io/p5.quadrille.js/docs/p5_functions/draw_quadrille/display_fns/). The `Quadrille` class supports several read / write [properties](https://objetos.github.io/p5.quadrille.js/docs/properties/) and implements [geometry transformations](https://objetos.github.io/p5.quadrille.js/docs/geometry_transformations/), [boolean operators](https://objetos.github.io/p5.quadrille.js/docs/boolean_operators/) inspired by [constructive solid geometry](https://en.wikipedia.org/wiki/Constructive_solid_geometry), and [visual computing](https://objetos.github.io/p5.quadrille.js/docs/visual_computing/) methods such as image filtering using [convolution matrices](https://en.wikipedia.org/wiki/Kernel_%28image_processing%29) and [triangle rasterization](https://fgiesen.wordpress.com/2013/02/06/the-barycentric-conspirac/). It also implements several [immutable](https://objetos.github.io/p5.quadrille.js/docs/immutable_methods/) and [mutable](https://objetos.github.io/p5.quadrille.js/docs/mutable_methods/) methods. It can be used as an interface to convert to / from other representations such as [arrays](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array), [images](https://p5js.org/reference/#/p5.Image), [bitboards](https://en.wikipedia.org/wiki/Bitboard) and [Forsyth–Edwards Notation (FEN)](https://en.wikipedia.org/wiki/Forsyth%E2%80%93Edwards_Notation) chess board positions.

The library reference which illustrates most of its functionality is found along this site.

Contributions are welcome at the [GitHub library site](https://github.com/objetos/p5.quadrille.js).

# Releases

- [p5.quadrille.js](https://raw.githubusercontent.com/objetos/p5.quadrille.js/main/p5.quadrille.js)
- [CDN: p5.quadrille.js](https://cdn.jsdelivr.net/gh/objetos/p5.quadrille.js/p5.quadrille.js) and [p5.quadrille.min.js](https://cdn.jsdelivr.net/gh/objetos/p5.quadrille.js/p5.quadrille.min.js)
- [All Releases](https://github.com/objetos/p5.quadrille.js/releases)