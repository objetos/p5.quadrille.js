const ROWS = 20;
const COLS = 10;
const LENGTH = 20;
var quadrille;
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
    glue(quadrille, y, x, false);
  }
  if (key === 'v') {
    glue(quadrille, y, x);
  }
  console.log(board.order);
}

function glue(quadrille, row, col, validate = true) {
  if (validate) {
    try {
      let update = board.add(quadrille, row, col);
      if (update.memoryHitCounter === 0) {
        board = update.quadrille;
      }
    } catch (out_of_bounds) {
      console.log(out_of_bounds);
    }
  }
  else {
    board = board.add(quadrille, row, col).quadrille;
  }
}