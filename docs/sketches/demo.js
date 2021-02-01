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
  if (key === 'e') {
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
  if (key === '0') {
    quadrille = active(0);
  }
  if (key === '1') {
    quadrille = active(1);
  }
  if (key === '2') {
    quadrille = active(2);
  }
}

function active(value) {
  switch (value) {
    case 0:
      return createQuadrille([['🙈', '🙉',    0],
                              [0,    '🙊', '🐵'],
                              [0,    '🙉',    0],
                              ['🙈', '🐒', '🙉']
                             ]);
    case 1:
      return createQuadrille(4, int(random(1, 1048576)), color('#F0B25A'));
    default:
      let w = int(random(2, 6));
      let h = int(random(2, 6));
      return createQuadrille(w, h, int(random(1, w * h)), color('#007ACC'));
  }
}

/*
function keyPressed() {
  if (keyCode === LEFT_ARROW) {
    q1.reflect();
  } else if (keyCode === RIGHT_ARROW) {
    q1.rotate();
  }
  if (key == 'c') {
    q3 = undefined;
  }
  if (key === '1') {
    a1 = true;
  }
  if (key === '2') {
    a1 = false;
  }
  if (key === 'a') {
    q3 ? x3-- : a1 ? x1-- : x2--;
  }
  if (key === 's') {
    q3 ? x3++ : a1 ? x1++ : x2++;
  }
  if (key === 'w') {
    q3 ? y3-- : a1 ? y1-- : y2--;
  }
  if (key === 'z') {
    q3 ? y3++ : a1 ? y1++ : y2++;
  }
  if (key === 'o') {
    q3 = Quadrille.OR(q1, q2, y2-y1, x2-x1);
    x3 = x1 < x2 ? x1 : x1 + x2-x1;
    y3 = y1 < y2 ? y1 : y1 + y2-y1;
  }
  if (key === 'n') {
    q3 = Quadrille.AND(q1, q2, y2-y1, x2-x1);
    x3 = x1 < x2 ? x1 : x1 + x2-x1;
    y3 = y1 < y2 ? y1 : y1 + y2-y1;
  }
  if (key === 'x') {
    q3 = Quadrille.XOR(q1, q2, y2-y1, x2-x1);
    x3 = x1 < x2 ? x1 : x1 + x2-x1;
    y3 = y1 < y2 ? y1 : y1 + y2-y1;
  }
  if (key === 'd') {
    q3 = Quadrille.DIFF(q1, q2, y2-y1, x2-x1);
    x3 = x1 < x2 ? x1 : x1 + x2-x1;
    y3 = y1 < y2 ? y1 : y1 + y2-y1;
  }
  if (key == 'm') {
    q1.clear(1);
  }
  if (key == 'i') {
    q1.insert(1);
  }
  if (key == 'f') {
    q1.fill(c3);
  }
  if (key == 'g') {
    q1.fill(2, c2);
  }
  if (key == 'h') {
    q1.fill(2, 1, '👽');
  }
  if (key == '-') {
    q1 = Quadrille.NEG(q1, color('green'));
  }
}
*/