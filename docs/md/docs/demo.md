> :Tabs
> > :Tab title=demo
> > 
> > > :P5 lib1=https://cdn.jsdelivr.net/gh/objetos/p5.quadrille.js/p5.quadrille.min.js, sketch=/docs/sketches/demo.js, width=800, height=400
>
> > :Tab title=keys (click on canvas before using them)
> >
> > | key | Action                                                                        |
> > |-----|-------------------------------------------------------------------------------|
> > | 1   | calls `createQuadrille(matrix)` to replace `quadrille`                        |
> > | 2   | calls `createQuadrille(width, array)` to replace `quadrille`                  |
> > | 3   | calls `createQuadrille(width, bitboard, pattern)` to replace `quadrille`      |
> > | 4   | calls `createQuadrille(width, height, order, pattern)` to replace `quadrille` |
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
> let board, quadrille;
> let x, y;
> let animate = true;
> let al;
>
> function preload() {
>   al = loadImage('/p5.quadrille.js/docs/sketches/abraham_lincoln.jpg');
> }
>
> function setup() {
>   createCanvas(COLS * LENGTH, ROWS * LENGTH);
>   board = createQuadrille(COLS, ROWS);
>   quadrille = active(int(random(4)));
>   x = int(random(0, COLS - 4));
>   y = int(random(0, ROWS - 4));
> }
> 
> function draw() {
>   background('#2E0E36');
>   if ((frameCount % 30 === 0) && animate) {
>     stick('u');
>   }
>   drawQuadrille(board, { cellLength: LENGTH, outline: 'magenta', board: true });
>   drawQuadrille(quadrille, { x: x, y: y, cellLength: LENGTH, outline: '#1EB2A6', board: true });
> }
> 
> function keyPressed() {
>   if (key === 'c') {
>     board.clear();
>   }
>   if (key === '1' || key === '2' || key === '3' || key === '4') {
>     quadrille = active(parseInt(key));
>   }
>   if (key === 'u' || key === 'x' || key === 'i' || key === 'd') {
>     stick(key);
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
>   if (key === 'q') {
>     animate = !animate;
>   }
>   y = key === 'w' ? y - 1 : key === 'z' ? y + 1 : y;
>   x = key === 'a' ? x - 1 : key === 's' ? x + 1 : x;
> }
> 
> function stick(key) {
>   let clone = quadrille.clone();
>   clone.fill(color('#965695'));
>   board = key === 'u' ? Quadrille.OR(board, clone, y, x) :
>           key === 'x' ? Quadrille.XOR(board, clone, y, x) :
>           key === 'i' ? Quadrille.AND(board, clone, y, x) :
>                         Quadrille.DIFF(board, clone, y, x);
>   quadrille = active(int(random(3)));
>   x = int(random(0, COLS - 4));
>   y = int(random(0, ROWS - 4));
> }
> 
> function active(value) {
>   let c1 = color(random(255), random(255), random(255), 255);
>   let c2 = color(random(255), random(255), random(255), 255);
>   let c3 = color(random(255), random(255), random(255), 255);
>   let e1 = '👽';
>   switch (value) {
>     case 1:
>       return createQuadrille([[c1, 'g'],
>                               [0,  'o', al],
>                               [al, 'l'],
>                               [e1, c2, c3]
>                               ]);
>     case 2:
>       return createQuadrille(2, [c1, al, c3, e1, c2]);
>     case 3:
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
/*!*/let board, quadrille; // --> Quadrille instances
let x, y;
let animate = true;

function setup() {
  createCanvas(COLS * LENGTH, ROWS * LENGTH);
/*!*/  board = createQuadrille(COLS, ROWS); // --> Creates empty quadrille
/*!*/  quadrille = active(int(random(4)));
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
    let e1 = '👽';
    case 1: // --> Creates a 3-width quadrille from (sparse) matrix
/*!*/      return createQuadrille([[c1, 'g'],
/*!*/                              [0,  'o', al],
/*!*/                              [al, 'l'],
/*!*/                              [c1, c2,  c3]
/*!*/                             ]);
    case 2: // --> Creates a 2-width quadrille from (5-length) array
/*!*/      return return createQuadrille(2, [c1, al, c3, e1, c2]);
    case 3: // --> Creates a 4-width quadrille from bitboard (random int) filled it with color
/*!*/      return createQuadrille(4, int(random(1, 1048576)), c2);
    default: // --> Creates a quadrille of random width, height and order
      let w = int(random(2, 6));
      let h = int(random(2, 6));
/*!*/      return createQuadrille(w, h, int(random(1, w * h)), c3);
  }
}
```

## Display

The introduced [p5.js](https://p5js.org/) [drawQuadrille](/docs/p5-fx/draw_quadrille) command is used to display both quadrilles:

```js | excerpt from demo.js
function draw() {
  background('#2E0E36');
  if ((frameCount % 30 === 0) && animate) {
    stick('u'); // --> the stick command is described below
  }
/*!*/  drawQuadrille(board, {cellLength: LENGTH, outline: 'magenta', board: true}); // --> draw board with edges at (0, 0)
/*!*/  drawQuadrille(quadrille, {x: x, y: y, cellLength: LENGTH, outline: '#1EB2A6', board: true}); // --> draw quadrille with edges at (x, y)
}
```

# Geometry transformations

The interactive `quadrille` may be translated by setting the `x`, `y` coordinates used to display it, and also [rotated](/docs/geom/rotate), [reflected](/docs/geom/reflect) and [transposed](/docs/geom/transpose):

```js | excerpt from demo.js
function keyPressed() {
  if (key === 'c') {
/*!*/    board.clear(); // --> clears all cells of the board quadrille
  }
  if (key === '1' || key === '2' || key === '3' || key === '4') {
/*!*/    quadrille = active(parseInt(key)); // --> quadrille creation on key
  }
  if (key === 'u' || key === 'x' || key === 'i' || key === 'd') {
/*!*/    stick(key); // --> the stick function is described below
  }
  if (key === 'f') {
/*!*/    quadrille.reflect(); // --> reflects quadrille
  }
  if (key === 'r') {
/*!*/    quadrille.rotate(); // --> rotates quadrille
  }
  if (key === 't') {
/*!*/    quadrille.transpose(); // --> transposes quadrille
  }
  if (key === 'q') {
/*!*/    animate = !animate; // --> toggles animation
  }
/*!*/  y = key === 'w' ? y - 1 : key === 'z' ? y + 1 : y; // --> quadrille vertical displacement
/*!*/  x = key === 'a' ? x - 1 : key === 's' ? x + 1 : x; // --> quadrille horizontal displacement
}
```

# Logical operators

The `stick` function adds the `quadrille` into the `board` by means of the static [Quadrille.OR](/docs/logic/or), [Quadrille.XOR](/docs/logic/xor), [Quadrille.AND](/docs/logic/and) and [Quadrille.DIFF](/docs/logic/diff) logical operators:

```js | excerpt from demo.js
function keyPressed() {
  if (key === 'u' || key === 'x' || key === 'i' || key === 'd') {
/*!*/    stick(key); // --> stick(key);
  }
  //...
}
```

 The `quadrille` is first [cloned](/docs/io/clone) and [filled](/docs/io/fill) to dim its color when stick it, and the `active` function is then called to start all over again:


```js | excerpt from demo.js
function stick(key) {
  let clone = quadrille.clone(); // --> performs a shallow copy of the quadrille
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
