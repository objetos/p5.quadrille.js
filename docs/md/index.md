> :Tabs
> > :Tab title=mahakala
> > 
> > > :P5 lib1=https://cdn.jsdelivr.net/gh/objetos/p5.quadrille.js@0.4.1/p5.quadrille.min.js, sketch=/docs/sketches/image.js, width=800, height=360
>
> > :Tab title=code
> >
> > ```js | image.js
> > let quadrille;
> > let image;
> > 
> > function preload() {
> >   image = loadImage('/p5.quadrille.js/docs/sketches/mahakala.jpg');
> > }
> > 
> > function setup() {
> >   createCanvas(800, 360);
> > }
> > 
> > function draw() {
> >   if (frameCount % 200 === 0) {
> >     let scl = 2 ** int(random(4));
> >     quadrille = createQuadrille(20 * scl, image);
> >     drawQuadrille(quadrille, {cellLength: 40 / scl, outlineWeight: 1.6 / scl, outline: color(random(255))});
> >   }
> > }

# p5.quadrille.js

[p5.js](https://p5js.org/) [quadrille](https://en.wikipedia.org/wiki/Square_tiling) library.

In geometry, the square-tiling, square-tessellation or square-grid is a regular tiling of the Euclidean plane. [John Horton Conway](https://en.wikipedia.org/wiki/John_Horton_Conway) called it a quadrille.

The internal angle of the square is π/2 so four squares at a point make a full 2π angle. It is one of three regular tilings of the plane. The other two are the [triangular-tiling](https://en.wikipedia.org/wiki/Triangular_tiling) and the [hexagonal-tiling](https://en.wikipedia.org/wiki/Hexagonal_tiling).

The library comprises a `Quadrille` class and provides the [createQuadrille](/docs/p5-fx/create_quadrille) and [drawQuadrille](/docs/p5-fx/draw_quadrille) p5 functions. The `Quadrille` class implements geometry transformation and [constructive solid geometry](https://en.wikipedia.org/wiki/Constructive_solid_geometry)-like logical operators, and visual computing methods such as image filtering using [convolution matrices](https://en.wikipedia.org/wiki/Kernel_%28image_processing%29) and [triangle rasterization](https://fgiesen.wordpress.com/2013/02/06/the-barycentric-conspirac/). It also implements several memory management methods, such as [clear](/docs/io/clear), [clone](/docs/io/clone), [fill](/docs/io/fill), [insert](/docs/io/insert) and [replace](/docs/io/replace). It can be used as an interface to convert to / from other representations such as [arrays](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array), [images](https://p5js.org/reference/#/p5.Image) and [bitboards](https://en.wikipedia.org/wiki/Bitboard).

The library reference together with a [demo](/docs/demo) which illustrates most of its functionality, are found along this site.

# Releases

- [p5.quadrille.js](https://raw.githubusercontent.com/objetos/p5.quadrille.js/main/p5.quadrille.js)
- [CDN: p5.quadrille.js](https://cdn.jsdelivr.net/gh/objetos/p5.quadrille.js/p5.quadrille.js) and [p5.quadrille.min.js](https://cdn.jsdelivr.net/gh/objetos/p5.quadrille.js/p5.quadrille.min.js)
- [All Releases](https://github.com/objetos/p5.quadrille.js/releases)

> :ToCPrevNext