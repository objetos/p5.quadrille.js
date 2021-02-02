const ROWS = 20;
const COLS = 40;
const LENGTH = 20;
var board, quadrille;
var x, y;

function setup() {
  createCanvas(COLS * LENGTH, ROWS * LENGTH);
  board = createQuadrille(COLS, ROWS);
  quadrille = active(int(random(3)));
  x = int(random(0, COLS - 6));
  y = int(random(0, ROWS - 6));
}

function draw() {
  background('#2E0E36');
  drawQuadrille(board, 0, 0, LENGTH, 2, 'magenta', true);
  drawQuadrille(quadrille, x, y, LENGTH, 2, '#1EB2A6', true);
}

function keyPressed() {
  if (key === 'c') {
    board.clear();
  }
  if (key === '1') {
    quadrille = active(1);
  }
  if (key === '2') {
    quadrille = active(2);
  }
  if (key === '3') {
    quadrille = active(3);
  }
  if (key === 'f') {
    quadrille.reflect();
  }
  if (key === 'r') {
    quadrille.rotate();
  }
  if (key === 't') {
    quadrille.transpose();
  }
  if (key === 'w') {
    y--;
  }
  if (key === 'z') {
    y++;
  }
  if (key === 'a') {
    x--;
  }
  if (key === 's') {
    x++;
  }
  if (key === 'u') {
    operator(Quadrille.OR);
  }
  if (key === 'x') {
    operator(Quadrille.XOR);
  }
  if (key === 'i') {
    operator(Quadrille.AND);
  }
  if (key === 'd') {
    operator(Quadrille.DIFF);
  }
}

function operator(fx) {
  let clone = quadrille.clone();
    clone.fill(color('#965695'));
    board = fx(board, clone, y, x);
    quadrille = active(int(random(3)));
    x = int(random(0, COLS - 6));
    y = int(random(0, ROWS - 6));
}

function active(value) {
  switch (value) {
    case 1:
      return createQuadrille([['🙈', '🙉',    0],
                              [0,    '🙊', '🐵'],
                              [0,    '🙉',    0],
                              ['🙈', '🐒', '🙉']
                             ]);
    case 2:
      return createQuadrille(4, int(random(1, 1048576)), color('#F0B25A'));
    default:
      let w = int(random(2, 6));
      let h = int(random(2, 6));
      return createQuadrille(w, h, int(random(1, w * h)), color('#007ACC'));
  }
}