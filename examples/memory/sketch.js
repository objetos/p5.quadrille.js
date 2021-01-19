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
    glue(quadrille, y, x);
  }
  if (key === 't') {
    test(quadrille, y, x);
  }
  if (key === 'x') {
    xor(quadrille, y, x);
  }
  if (key === 'd') {
    diff(quadrille, y, x);
  }
  /*
  if (key === 'v') {
    glue(quadrille, y, x, false);
  }
  */
  console.log('order', board.order);
  console.log('column order', board.columnOrder(2));
}

function test(quadrille, row, col) {
  board = Quadrille.AND(board, quadrille, row, col);
}

function xor(quadrille, row, col) {
  board = Quadrille.XOR(board, quadrille, row, col);
}

function diff(quadrille, row, col) {
  board = Quadrille.DIFF(board, quadrille, row, col);
}

function glue(quadrille, row, col, validate = true) {
  board = Quadrille.OR(board, quadrille, row, col);
  /*
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
  */
}