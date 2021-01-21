const ROWS = 20;
const COLS = 10;
const LENGTH = 20;
var quadrille;
var board;
var x = 2, y = 2;

function setup() {
  createCanvas(COLS * LENGTH, ROWS * LENGTH);
  board = createQuadrille(COLS, ROWS);
  quadrille = createQuadrille([[color('cyan'), '👽', 0],
  [0, '🤔', '🙈'],
  [0, color('#770811'), 0],
  ['g', 'o', 'l']
  ]);
}

function draw() {
  background('#060621');
  drawQuadrille(board, 0, 0, LENGTH, 2, 'blue', true);
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
    glue(quadrille, y, x, false);
  }
  if (key === 'v') {
    glue(quadrille, y, x);
  }
}

function glue(quadrille, row, col, validate = true) {
  let update = Quadrille.OR(board, quadrille, row, col);
  if (validate) {
    if (update.order === board.order + quadrille.order && update.width === board.width && update.height === board.height) {
      board = update;
    }
  }
  else {
    board = update;
  }
}