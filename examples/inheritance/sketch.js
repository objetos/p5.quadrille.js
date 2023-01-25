const ROWS = 20;
const COLS = 10;
const LENGTH = 20;
let t, I, T, L, Lbit, test;
let quadrille;
let clone;
let col = 2, row = 2;
let c;

class Cuadricula extends Quadrille {
  constructor() {
    super(...arguments);
  }
}

function setup() {
  createCanvas(COLS * LENGTH, ROWS * LENGTH);
  c = color('red');
  quadrille = new Cuadricula([[color('cyan'), '👽'],
  [null, '🤔', c],
  [null, color('#770811')],
  ['g', 'o', 'l']
  ]);
  T = new Cuadricula([[null, c, null],
  [c, c],
  [null, c],
  ]);
  L = new Cuadricula([[c],
  [c],
  [c],
  [c, c, c],
  ]);
  t = new Cuadricula(3, 3);
  console.log(t.width, t.height);
  t.from(154, '👽');
  //Lbit = createQuadrille(3, 4);
  //Lbit.from(2343, '👽');
  Lbit = new Cuadricula(3, 2343, '👽');
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
    [null, c, null],
    [null, c],
    [null, c],
    [null, c],
  ]);
}

function draw() {
  background('#060621');
  drawQuadrille(quadrille, { x: col * LENGTH, y: row * LENGTH, cellLength: LENGTH, outlineWeight: 2, outline: 'green' });
  drawQuadrille(I, { x: 2 * LENGTH, y: 12 * LENGTH, cellLength: LENGTH, outline: 'blue', board: true });
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