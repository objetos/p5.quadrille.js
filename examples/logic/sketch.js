const ROWS = 20;
const COLS = 20;
const LENGTH = 20;
var quadrille, other, result;
var x = 2, y = 2;

function setup() {
  createCanvas(COLS * LENGTH, ROWS * LENGTH);
  quadrille = createQuadrille([[color('cyan'), '👽', 0],
  [0, '🤔', '🙈'],
  [0, color('#770811'), 0],
  ['g', 'o', 'l']
  ]);
  other = createQuadrille([[0, 'k', 'g'],
  [0, '🤔', '🙈'],
  [0, color('#770811'), 0],
  ['g', 'o', 'l']
  ]);
}

function draw() {
  background('#060621');
  drawQuadrille(quadrille, x, y, LENGTH, 2, 'green');
}

function keyPressed() {
  if (keyCode === LEFT_ARROW) {
    quadrille.reflect();
  } else if (keyCode === RIGHT_ARROW) {
    quadrille.rotate();
  }
  if (key === 'a') {
    x--;
  }
  if (key === 's') {
    x++;
  }
  if (key === 'w') {
    y--;
  }
  if (key === 'z') {
    y++;
  }
  if (key === 'g') {
    glue(quadrille, y, x);
  }
  if (key === 't') {
    and(quadrille, y, x);
  }
  if (key === 'x') {
    xor(quadrille, y, x);
  }
  if (key === 'd') {
    diff(quadrille, y, x);
  }
  if (key === 'p') {
    console.log('width', quadrille.width);
    console.log('height', quadrille.height);
    console.log('order', quadrille.order);
    console.log('column order', quadrille.columnOrder(2));
    console.log('equals', quadrille.equals(other));
  }
}

function and(quadrille, row, col) {
  result = Quadrille.AND(quadrille, other, row, col);
}

function xor(quadrille, row, col) {
  result = Quadrille.XOR(quadrille, other, row, col);
}

function diff(quadrille, row, col) {
  result = Quadrille.DIFF(quadrille, other, row, col);
}