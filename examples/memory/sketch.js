const ROWS = 20;
const COLS = 10;
const LENGTH = 20;
var quadrille, other;
var board;
var x = 2, y = 2;

function setup() {
  createCanvas(COLS * LENGTH, ROWS * LENGTH);
  board = createQuadrille(COLS, ROWS);
  quadrille = createQuadrille([[color('cyan'), '👽', 0],
  [null, '🤔', '🙈'],
  [null, color('#770811')],
  ['g', 'o', 'l']
  ]);
  other = createQuadrille([[null, 'k', 'g'],
  [null, '🤔', '🙈'],
  [null, color('#770811')],
  ['g', 'o', 'l']
  ]);
}

function draw() {
  background(/*'#060621'*/ '#007ACC');
  drawQuadrille(board, {cellLength: LENGTH, outline: 'blue', board: true});
  drawQuadrille(quadrille, {col: x, row: y, cellLength: LENGTH, outline: 'green'});
}

function keyPressed() {
  if (keyCode === LEFT_ARROW) {
    quadrille.reflect();
  }
  if (keyCode === RIGHT_ARROW) {
    quadrille.rotate();
  }
  if (keyCode === UP_ARROW) {
    quadrille.transpose();
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
    board = Quadrille.OR(board, quadrille, y, x);
  }
  if (key === 't') {
    board = Quadrille.AND(board, quadrille, y, x);
  }
  if (key === 'x') {
    board = Quadrille.XOR(board, quadrille, y, x);
  }
  if (key === 'd') {
    board = Quadrille.DIFF(board, quadrille, y, x);
  }
  if (key === 'p') {
    console.log('width', board.width);
    console.log('height', board.height);
    console.log('order', board.order);
    console.log('row magnitude', board.magnitude(2));
  }
}