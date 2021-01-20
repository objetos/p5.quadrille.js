const ROWS = 20;
const COLS = 10;
const LENGTH = 20;
var quadrille, other;
var board;
var x = 2, y = 2;

function setup() {
  createCanvas(COLS * LENGTH, ROWS * LENGTH);
  board = createBoard(COLS, ROWS);
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
  drawBoard(board, LENGTH);
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
    board = Quadrille.OR(board, quadrille, x, y);
  }
  if (key === 't') {
    board = Quadrille.AND(board, quadrille, x, y);
  }
  if (key === 'x') {
    board = Quadrille.XOR(board, quadrille, x, y);
  }
  if (key === 'd') {
    board = Quadrille.DIFF(board, quadrille, x, y);
  }
  if (key === 'p') {
    console.log('width', board.width);
    console.log('height', board.height);
    console.log('order', board.order);
    console.log('row magnitude', board.magnitude(2));
    console.log('equals', quadrille.equals(other));
  }
}