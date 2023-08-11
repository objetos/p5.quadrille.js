---
title: Introduction
type: docs
---

# p5.quadrille.js

[p5.js](https://p5js.org/) [quadrille](https://en.wikipedia.org/wiki/Square_tiling) library.

In geometry, the square-tiling, square-tessellation or square-grid is a regular tiling of the Euclidean plane. [John Horton Conway](https://en.wikipedia.org/wiki/John_Horton_Conway) called it a quadrille.

The internal angle of the square is π/2 so four squares at a point make a full 2π angle. It is one of three regular tilings of the plane. The other two are the [triangular-tiling](https://en.wikipedia.org/wiki/Triangular_tiling) and the [hexagonal-tiling](https://en.wikipedia.org/wiki/Hexagonal_tiling).

[boolean operators](/docs/boolean_operators/)

The library comprises a `Quadrille` class and provides the [createQuadrille](/docs/p5-fx/create_quadrille) and [drawQuadrille](/docs/p5-fx/draw_quadrille) p5 functions. The `Quadrille` class implements geometry transformation and [constructive solid geometry](https://en.wikipedia.org/wiki/Constructive_solid_geometry)-like logical operators, and visual computing methods such as image filtering using [convolution matrices](https://en.wikipedia.org/wiki/Kernel_%28image_processing%29) and [triangle rasterization](https://fgiesen.wordpress.com/2013/02/06/the-barycentric-conspirac/). It also implements several memory management methods, such as [clear](/docs/io/clear), [clone](/docs/io/clone), [fill](/docs/io/fill), [insert](/docs/io/insert), [replace](/docs/io/replace) and [sort](/docs/io/sort). It can be used as an interface to convert to / from other representations such as [arrays](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array), [images](https://p5js.org/reference/#/p5.Image) and [bitboards](https://en.wikipedia.org/wiki/Bitboard).

The library reference together with a [demo](/docs/demo) which illustrates most of its functionality, are found along this site.

# Releases

- [p5.quadrille.js](https://raw.githubusercontent.com/objetos/p5.quadrille.js/main/p5.quadrille.js)
- [CDN: p5.quadrille.js](https://cdn.jsdelivr.net/gh/objetos/p5.quadrille.js/p5.quadrille.js) and [p5.quadrille.min.js](https://cdn.jsdelivr.net/gh/objetos/p5.quadrille.js/p5.quadrille.min.js)
- [All Releases](https://github.com/objetos/p5.quadrille.js/releases)
