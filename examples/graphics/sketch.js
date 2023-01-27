'use strict';

const ROWS = 20;
const COLS = 10;
const LENGTH = 20;
var t, I, T, L, Lbit, test;
var quadrille;
var clone;
var col = 2, row = 2;
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
  quadrille = createQuadrille([[color('cyan'), '👽'   ],
                               [null,             '🤔',             c ],
                               [null,             color('#770811') ],
                               ['g',           'o',             'l'  ]
                              ]);
  // */
  let a = color('yellow');
  let b = color('blue');
  let r = color('red');
  quadrille = createQuadrille(2, [a,a,'g','o',i,i]);
  //quadrille = createQuadrille([[a,a],[b,b],[r,r]]);
  T = createQuadrille([[null, c, null],
                       [c, c],
                       [null, c],
                      ]);
  L = createQuadrille([ [c],
                        [c],
                        [c],
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
  I = createQuadrille([
    [null],
    [null, c, null, null],
    [null, c, null],
    [null, c, null],
    [null, c, null],
   ]);
}

function draw() {
  background('#060621');
  pg.background('magenta');
  drawQuadrille(quadrille, {graphics: pg, x: col * LENGTH, y: row * LENGTH, cellLength: LENGTH, outlineWeight: 2, outline: 'green'});
  //drawQuadrille(I, {graphics: pg, x:2 * LENGTH, y:12 * LENGTH, cellLength: LENGTH, outline:'blue'});
  image(pg, 0, 0);
}

function keyPressed() {
  if (keyCode === UP_ARROW) {
    quadrille.reflect();
  } else if (keyCode === DOWN_ARROW) {
    I.rotate();
  }
  if (key === 'a') {
    col = col > 0 ? col - 1 : col;
  }
  if (key === 's') {
    col = col < COLS - quadrille.width ? col + 1 : col;
  }
  if (key === 'w') {
    row = row > 0 ? row - 1 : row;
  }
  if (key === 'z') {
    row = row < ROWS - quadrille.height ? row + 1 : row;
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