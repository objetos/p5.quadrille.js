> :Tabs
> > :Tab title=demo
> > 
> > > :P5 lib1=https://cdn.jsdelivr.net/gh/objetos/p5.quadrille.js/p5.quadrille.min.js, sketch=/docs/sketches/demo.js, width=800, height=400
>
> > :Tab title=keys (click on canvas before using them)
> >
> > | key | Action                                                                        |
> > |-----|-------------------------------------------------------------------------------|
> > | 1   | calls `createQuadrille(array2D)` to replace `quadrille`                       |
> > | 2   | calls `createQuadrille(width, bitboard, pattern)` to replace `quadrille`      |
> > | 3   | calls `createQuadrille(width, height, order, pattern)` to replace `quadrille` |
> > | f   | reflects `quadrille`                                                          |
> > | r   | rotates `quadrille`                                                           |
> > | t   | transposes `quadrille`                                                        |
> > | a   | moves `quadrille` to the left                                                 |
> > | s   | moves `quadrille` to the right                                                |
> > | w   | moves `quadrille` up                                                          |
> > | z   | moves `quadrille` down                                                        |
> > | u   | merges `quadrille` into `board` using the `Quadrille.OR` logical operator     |
> > | x   | merges `quadrille` into `board` using the `Quadrille.XOR` logical operator    |
> > | i   | merges `quadrille` into `board` using the `Quadrille.AND` logical operator    |
> > | d   | merges `quadrille` into `board` using the `Quadrille.DIFF` logical operator   |
> > | q   | toggle animation                                                              |
> > | c   | clears board                                                                  |

> :Collapse label=click to display the complete code
>
> ```js | demo.js
> const ROWS = 20;
> const COLS = 40;
> const LENGTH = 20;
> var board, quadrille;
> var x, y;
> var animate = true;
> 
> function setup() {
>   createCanvas(COLS * LENGTH, ROWS * LENGTH);
>   board = createQuadrille(COLS, ROWS);
>   quadrille = active(int(random(3)));
>   x = int(random(0, COLS - 4));
>   y = int(random(0, ROWS - 4));
> }
> 
> function draw() {
>   background('#2E0E36');
>   if ((frameCount % 30 === 0) && animate) {
>     operator('u');
>   }
>   drawQuadrille(board, 0, 0, LENGTH, 2, 'magenta', true);
>   drawQuadrille(quadrille, x, y, LENGTH, 2, '#1EB2A6', true);
> }
> 
> function keyPressed() {
>   if (key === 'c') {
>     board.clear();
>   }
>   if (key === '1') {
>     quadrille = active(1);
>   }
>   if (key === '2') {
>     quadrille = active(2);
>   }
>   if (key === '3') {
>     quadrille = active(3);
>   }
>   if (key === 'f') {
>     quadrille.reflect();
>   }
>   if (key === 'r') {
>     quadrille.rotate();
>   }
>   if (key === 't') {
>     quadrille.transpose();
>   }
>   if (key === 'w') {
>     y--;
>   }
>   if (key === 'z') {
>     y++;
>   }
>   if (key === 'a') {
>     x--;
>   }
>   if (key === 's') {
>     x++;
>   }
>   if (key === 'q') {
>     animate = !animate;
>   }
>   if (key === 'u' || key === 'x' || key === 'i' || key === 'd') {
>     operator(key);
>   }
> }
> 
> function operator(key) {
>   let clone = quadrille.clone();
>     clone.fill(color('#965695'));
>     board = key === 'u' ? Quadrille.OR(board, clone, y, x) :
>             key === 'x' ? Quadrille.XOR(board, clone, y, x) :
>             key === 'i' ? Quadrille.AND(board, clone, y, x) : Quadrille.DIFF(board, clone, y, x);
>     quadrille = active(int(random(3)));
>     x = int(random(0, COLS - 4));
>     y = int(random(0, ROWS - 4));
> }
> 
> function active(value) {
>   let c1 = color(random(255), random(255), random(255), 255);
>   let c2 = color(random(255), random(255), random(255), 255);
>   let c3 = color(random(255), random(255), random(255), 255);
>   switch (value) {
>     case 1:
>       return createQuadrille([[c1, c2,  0],
>                               [0,  c3,  c1],
>                               [0,  c1,  0],
>                               [c1, c2, c3]
>                              ]);
>     case 2:
>       return createQuadrille(4, int(random(1, 1048576)), c2);
>     default:
>       let w = int(random(2, 6));
>       let h = int(random(2, 6));
>       return createQuadrille(w, h, int(random(1, w * h)), c3);
>   }
> }
> ```

This demo displays two quadrilles: a static `board` and an interactive `quadrille` that can be geometrically transform and stick into the `board`.

# Create & display

## Creation

Different forms of the introduced [p5.js](https://p5js.org/) [createQuadrille](/docs/p5-fx/create_quadrille) command are used to instantiate some quadrilles. Both the `board` and the `quadrille` (using the implemented `active` function) are created in the [setup](https://p5js.org/reference/#/p5/setup):

```js | excerpt from demo.js
const ROWS = 20;
const COLS = 40;
const LENGTH = 20;
/*!*/var board, quadrille; // --> Quadrille instances
var x, y;
var animate = true;

function setup() {
  createCanvas(COLS * LENGTH, ROWS * LENGTH);
/*!*/  board = createQuadrille(COLS, ROWS); // --> Creates empty quadrille
/*!*/  quadrille = active(int(random(3)));
  x = int(random(0, COLS - 6));
  y = int(random(0, ROWS - 6));
}
```

The `active` function switches among different quadrille constructors to return the quadrille instance that is to be displayed at a particular moment in time:

```js | excerpt from demo.js
function active(value) {
  switch (value) {
    let c1 = color(random(255), random(255), random(255), 255);
    let c2 = color(random(255), random(255), random(255), 255);
    let c3 = color(random(255), random(255), random(255), 255);
    case 1: // --> Creates quadrille from Array2D
/*!*/      return createQuadrille([[c1, c2,  0],
/*!*/                              [0,  c3,  c1],
/*!*/                              [0,  c1,  0],
/*!*/                              [c1, c2, c3]
/*!*/                             ]);
    case 2: // --> Creates a 4-width quadrille from bitboard (random int) filled it with color
/*!*/      return createQuadrille(4, int(random(1, 1048576)), c2);
    default:
      let w = int(random(2, 6));
      let h = int(random(2, 6));
/*!*/      return createQuadrille(w, h, int(random(1, w * h)), c3);
  }
}
```

## Display

The introduced [p5.js](https://p5js.org/) [createQuadrille](/docs/p5-fx/create_quadrille) command is used to display both quadrilles:

```js | excerpt from demo.js
function draw() {
  background('#2E0E36');
  if ((frameCount % 30 === 0) && animate) {
    operator('u'); // --> the operator command is described below
  }
/*!*/  drawQuadrille(board, 0, 0, LENGTH, 2, 'magenta', true); //
/*!*/  drawQuadrille(quadrille, x, y, LENGTH, 2, '#1EB2A6', true);
}
```

# Geometry transformations

The interactive `quadrille` may be translated by setting the `x`, `y` coordinates used to display it, and also[rotated](/docs/geom/rotate), [reflected](/docs/geom/reflect) and [transposed](/docs/geom/transpose):

```js | excerpt from demo.js
function keyPressed() {
  if (key === 'w') {  // --> Quadrille translation
    y--;
  }
  if (key === 'z') { // --> Quadrille translation
    y++;
  }
  if (key === 'a') { // --> Quadrille translation
    x--;
  }
  if (key === 's') { // --> Quadrille translation
    x++;
  }
  if (key === 'f') {
/*!*/    quadrille.reflect();
  }
  if (key === 'r') {
/*!*/    quadrille.rotate();
  }
  if (key === 't') {
/*!*/    quadrille.transpose();
  }
  //...
}
```

# Logical operators

The `operator` function is used to stick the `quadrille` into the `board` by means of the static [Quadrille.OR](/docs/logic/or), [Quadrille.XOR](/docs/logic/xor), [Quadrille.AND](/docs/logic/and) and [Quadrille.DIFF](/docs/logic/diff) logical operators:

```js | excerpt from demo.js
function keyPressed() {
  if (key === 'u' || key === 'x' || key === 'i' || key === 'd') {
/*!*/    operator(key); // --> operator(key);
  }
  //...
}
```

 The `quadrille` is first [cloned](/docs/io/clone) and [filled](/docs/io/fill) to dim its color when stick it, and the `active` function is then called to start all over again:


```js | excerpt from demo.js
function operator(key) {
  let clone = quadrille.clone(); // --> performs a deep copy of the quadrulle
  clone.fill(color('#965695')); // --> dim the cloned quadrille color
/*!*/  board = key === 'u' ? Quadrille.OR(board, clone, y, x) :
               key === 'x' ? Quadrille.XOR(board, clone, y, x) :
               key === 'i' ? Quadrille.AND(board, clone, y, x) :
                             Quadrille.DIFF(board, clone, y, x); // --> Quadrille static logic operators
  quadrille = active(int(random(3)));
  x = int(random(0, COLS - 6));
  y = int(random(0, ROWS - 6));
}
```

> :ToCPrevNext