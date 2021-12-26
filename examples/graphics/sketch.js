const ROWS = 20;
const COLS = 10;
const LENGTH = 20;
var t, I, T, L, Lbit, test;
var quadrille;
var clone;
var x = 2, y = 2;
var c;
let pg;
let myFont;
let i;

function preload() {
  i = loadImage('abraham_lincoln.jpg');
  myFont = loadFont('inconsolata.ttf');
}

function setup() {
  createCanvas(COLS * LENGTH, ROWS * LENGTH);
  pg = createGraphics(COLS * LENGTH, ROWS * LENGTH, WEBGL);
  pg.textFont(myFont);
  //pg = createGraphics(COLS * LENGTH, ROWS * LENGTH);
  c = color('red');
  /*
  quadrille = createQuadrille([[color('cyan'), '👽',             0    ],
                               [0,             '🤔',             c ],
                               [0,             color('#770811'), 0   ],
                               ['g',           'o',             'l'  ]
                              ]);
  // */
  let a = color('yellow');
  let b = color('blue');
  let r = color('red');
  quadrille = createQuadrille(2, [a,a,'g','o',i,i]);
  //quadrille = createQuadrille([[a,a],[b,b],[r,r]]);
  T = createQuadrille([[0, c, 0],
                       [c, c, 0],
                       [0, c, 0],
                      ]);
  L = createQuadrille([ [c, 0, 0],
                        [c, 0, 0],
                        [c, 0, 0],
                        [c, c, c],
                       ]);
  t = createQuadrille(3, 3);
  console.log(t.width, t.height);
  t.from(154, '👽');
  //Lbit = createQuadrille(3, 4);
  //Lbit.from(2343, '👽');
  Lbit = createQuadrille(3, 2343, '👽');
  console.log('Lbit width: ', Lbit.width);
  console.log('Lbit height: ', Lbit.height);
  console.log('Lbit size: ', Lbit.size);
  console.log('L int: ', L.toInt());
  console.log('Lbit int: ', Lbit.toInt());
  quadrille.reflect();
  clone = quadrille.clone();
  clone.reflect();
  test = createQuadrille(4, int(random(1, 1048576)), color('#F0B25A'));
  c.setBlue(255);
  /*
  I = createQuadrille([
    [0, c, 0, 0],
    [0, c, 0, 0],
    [0, c, 0, 0],
    [0, c, 0, 0],
   ]);
   */
   I = createQuadrille([
    [0, 0, 0, 0, 0, 0],
    [0, 0, c, 0, 0, 0],
    [0, 0, c, 0, 0, 0],
    [0, 0, c, 0, 0, 0],
    [0, 0, c, 0, 0, 0],
    [0, 0, 0, 0, 0, 0],
   ]);
}

function draw() {
  background('#060621');
  pg.background('magenta');
  drawQuadrille(quadrille, {graphics: pg, col: x, row: y, cellLength: LENGTH, outlineWeight: 2, outline: 'green'});
  //drawQuadrille(I, {graphics: pg, col:2, row:12, cellLength: LENGTH, outline:'blue'});
  image(pg, 0, 0);
}

function keyPressed() {
  if (keyCode === UP_ARROW) {
    quadrille.reflect();
  } else if (keyCode === DOWN_ARROW) {
    I.rotate();
  }
  if (key === 'a') {
    x = x > 0 ? x - 1 : x;
  }
  if (key === 's') {
    x = x < COLS - quadrille.width ? x + 1 : x;
  }
  if (key === 'w') {
    y = y > 0 ? y - 1 : y;
  }
  if (key === 'z') {
    y = y < ROWS - quadrille.height ? y + 1 : y;
  }
  if (key === 't') {
    test = createQuadrille(4, int(random(1, 1048576)), color('#F0B25A'));
  }
  if (key === 'd') {
    test.delete(test.height - 1);
  }
  if (key === 'p') {
    console.log(I.toInt());
  }
  if (key === 'r') {
    quadrille.randomize();
  }
}