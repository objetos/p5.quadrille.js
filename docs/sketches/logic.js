const ROWS = 10;
const COLS = 20;
const LENGTH = 40;
var q1, q2, q3;
var a1 = true;
var x1 = 4, y1 = 2;
var x2 = 14, y2 = 5;
var x3, y3;
var c1, c2, c3;

function setup() {
  createCanvas(COLS * LENGTH, ROWS * LENGTH);
  c1 = color('cyan');
  c2 = color('yellow');
  c3 = color('#FBBC04');
  q1 = createQuadrille([[c1, c1, 0],
                        [0,  c1, c1],
                        [0,  c1, 0],
                        [c1, c1, c1]
                       ]);
  q2 = createQuadrille([[0,  c2],
                        [c2, c2],
                        [0,  c2],
                        [c2, c2]
                       ]);
}

function draw() {
  background('#060621');
  if (q3) {
    drawQuadrille(q3, x3, y3, LENGTH, 2, 'magenta', true);
  }
  else {
    drawQuadrille(q1, x1, y1, LENGTH, 2, 'green', true);
    drawQuadrille(q2, x2, y2, LENGTH, 2, 'blue', true);
  }
}

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