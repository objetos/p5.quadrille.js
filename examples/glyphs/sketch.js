'use strict';

const ROWS = 20;
const COLS = 10;
const LENGTH = 20;
let t, I, T, L, Lbit, test;
let quadrille;
let clone;
let col = 2, row = 2;
let c;
let pg;

function setup() {
  createCanvas(COLS * LENGTH, ROWS * LENGTH);
  let str = 'g';
  let s = Quadrille.CELL_LENGTH * Quadrille.TEXT_ZOOM / str.length;
  pg = createGraphics(Quadrille.CELL_LENGTH, Quadrille.CELL_LENGTH);
  pg.noStroke();
  pg.fill('red');
  pg.textSize(s);
  pg.textAlign(CENTER, CENTER);
  pg.text(str, 0, 0, Quadrille.CELL_LENGTH, Quadrille.CELL_LENGTH);
  c = color('red');
  quadrille = createQuadrille([[color('cyan'), '👽', null],
  [null, '🤔', c],
  [null, color('#770811')],
  [pg, 'o', 'l']
  ]);
  T = createQuadrille([[null, c, null],
  [c, c, null],
  [null, c, null],
  ]);
  L = createQuadrille([[c],
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
  /*
  I = createQuadrille([
    [null, c, null],
    [null, c],
    [null, c],
    [null, c],
   ]);
   */
  I = createQuadrille([
    [null],
    [null, null, c, null, null, null],
    [null, null, c],
    [null, null, c],
    [null, null, c],
    [null],
  ]);
}

function draw() {
  background('#060621');
  drawQuadrille(quadrille, { x: col * LENGTH, y: row * LENGTH, cellLength: LENGTH, outlineWeight: 2, outline: 'green', textZoom: 0.6 });
  //drawQuadrille(I, { x: 2 * LENGTH, y: 12 * LENGTH, cellLength: LENGTH, outline: 'blue', board: true });
  drawQuadrille(test, { x: 2 * LENGTH, y: 12 * LENGTH, cellLength: LENGTH, outline: 'blue', board: true });
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