# p5.quadrille.js

[p5.js](https://p5js.org/) [quadrille](https://en.wikipedia.org/wiki/Square_tiling) library.

# Examples

Create a board and fill it with some quadrilles. Use the *a*, *s*, *w* and *z* keys to move the quadrille and *g* or *v* to stick it.

> :P5 lib1=https://cdn.jsdelivr.net/gh/objetos/p5.quadrille.js/p5.quadrille.min.js, sketch=/docs/sketches/board.js, width=400, height=400, sound=true

Display and run the above sketch with the following markdown:

```md
> :P5 lib1=https://cdn.jsdelivr.net/gh/objetos/p5.quadrille.js/p5.quadrille.min.js, sketch=/docs/sketches/board.js, width=400, height=400, sound=true
```

> :Collapse label=the board.js running in p5 global mode
> 
> ```md | board.js
> const ROWS = 20;
> const COLS = 20;
> const LENGTH = 20;
> var quadrille;
> var board;
> var x = 2, y = 2;
> 
> function setup() {
>   createCanvas(COLS * LENGTH, ROWS * LENGTH);
>   board = createQuadrille(COLS, ROWS);
>   quadrille = createQuadrille([[color('cyan'), '👽', 0],
>   [0, '🤔', '🙈'],
>   [0, color('#770811'), 0],
>   ['g', 'o', 'l']
>   ]);
> }
> 
> function draw() {
>   background('#060621');
>   drawQuadrille(board, 0, 0, LENGTH, 2, 'blue', true);
>   drawQuadrille(quadrille, x, y, LENGTH, 2, 'green');
> }
> 
> function keyPressed() {
>   if (keyCode === LEFT_ARROW) {
>     quadrille.reflect();
>   } else if (keyCode === RIGHT_ARROW) {
>     quadrille.rotate();
>   }
>   if (key === 'a') {
>     x--;
>   }
>   if (key === 's') {
>     x++;
>   }
>   if (key === 'w') {
>     y--;
>   }
>   if (key === 'z') {
>     y++;
>   }
>   if (key === 'g') {
>     glue(quadrille, y, x, false);
>   }
>   if (key === 'v') {
>     glue(quadrille, y, x);
>   }
> }
> 
> function glue(quadrille, row, col, validate = true) {
>   let update = Quadrille.OR(board, quadrille, row, col);
>   if (validate) {
>     if (update.order === board.order + quadrille.order &&
>         update.width === board.width && update.height === board.height) {
>       board = update;
>     }
>   }
>   else {
>     board = update;
>   }
> }
> ```

# TODOs

1. Implement a [static](https://en.wikipedia.org/wiki/Method_(computer_programming)#Static_methods) `polyomino(n)` method in order to retrieve a collection of the _n-degree_ [polyominoes](https://en.wikipedia.org/wiki/Polyomino). See also: [Algorithms for enumeration of fixed polyominoes](https://en.wikipedia.org/wiki/Polyomino#Algorithms_for_enumeration_of_fixed_polyominoes), [Counting polyominos: yet another attack](https://www.sciencedirect.com/science/article/pii/0012365X81902375?via%3Dihub) and [Free polyominoes enumeration @rosettacode](https://rosettacode.org/wiki/Free_polyominoes_enumeration). *Hints:*
   1. Study the [SageMath](https://www.sagemath.org/) [tiling solver](https://doc.sagemath.org/html/en/reference/combinat/sage/combinat/tiling.html) which may provide such functionality.
   2. Use a [SageCell](https://sagecell.sagemath.org/) to interface to SageMath from the web.
2. Implement other [2D tilings](https://en.wikipedia.org/wiki/Square_tiling) different then the quadrille. See also [tesselation](https://en.wikipedia.org/wiki/Tessellation).
3. Implement higher dimensional tilings which are referred to as [Honeycomb](https://en.wikipedia.org/wiki/Honeycomb_(geometry)) in the literature. See also [Wolfram](https://en.wikipedia.org/wiki/Wolfram_Language) [ArrayMesh](https://reference.wolfram.com/language/ref/ArrayMesh.html).
4. Improve this [web page](https://github.com/objetos/p5.quadrille.js/tree/pages):
   1. Improve the [codedoc](https://codedoc.cc/) [p5 component](https://github.com/objetos/p5.quadrille.js/tree/pages/.codedoc/components/p5) used to deploy the page.
   2. Customize the theme.

# [vs-code](https://code.visualstudio.com/) & [vs-codium](https://vscodium.com/) & [gitpod](https://www.gitpod.io/) hacking instructions

To run and hack the [glyphs example](https://github.com/objetos/p5.quadrille.js/blob/master/examples/glyphs/sketch.js):

1. Clone the repo (`git clone https://github.com/objetos/p5.quadrille.js`) and open it with your favorite editor.
2. Install the [p5-vscode extension](https://marketplace.visualstudio.com/items?itemName=samplavigne.p5-vscode).
3. Head over `examples/glyphs/index.html` and press your editor `Go Live` button.

> :ToCPrevNext
