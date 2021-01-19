const ROWS = 20;
const COLS = 20;
const LENGTH = 20;
var q1, q2, q3;
var a2, a3;
var x1 = 2, y1 = 2;
var x2 = 8, y2 = 10;
var x3 = 0, y3 = 0;
var c1, c2;

function setup() {
  createCanvas(COLS * LENGTH, ROWS * LENGTH);
  c1 = color('cyan');
  c2 = color('yellow');
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
  drawQuadrille(q1, x1, y1, LENGTH, 2, 'green');
  drawQuadrille(q2, x2, y2, LENGTH, 2, 'blue');
  if (q3) {
    drawQuadrille(q3, x3, y3, LENGTH, 2, 'magenta'/*, 'cyan'*/);
    //drawQuadrille(q3, x3, y3, LENGTH, 2, 'magenta');
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
    x3 = y3 = 0;
    if (a3) {
      a3 = false;
    }
  }
  if (key === '1') {
    a2 = false;
    a3 = false;
  }
  if (key === '2') {
    a2 = true;
    a3 = false;
  }
  if (key === '3') {
    a2 = false;
    a3 = true;
  }
  if (key === 'a') {
    a2 ? x2-- : a3 ? x3-- : x1--;
  }
  if (key === 's') {
    a2 ? x2++ : a3 ? x3++ : x1++;
  }
  if (key === 'w') {
    a2 ? y2-- : a3 ? y3-- : y1--;
  }
  if (key === 'z') {
    a2 ? y2++ : a3 ? y3++ : y1++;
  }
  if (key === 'g') {
    q3 = Quadrille.OR(q1, q2, x2-x1, y2-y1);
  }
  if (key === 'p' && q3) {
    console.log('x3', x3, 'y3', y3, 'width', q3.width, 'height', q3.height, 'order', q3.order);
  }
  /*
  if (key === 't') {
    and(q1, y1, x1);
  }
  if (key === 'x') {
    xor(q1, y1, x1);
  }
  if (key === 'd') {
    diff(q1, y1, x1);
  }
  */
}

function or(quadrille, row, col) {
  q3 = Quadrille.OR(quadrille, q2, row, col);
}

function and(quadrille, row, col) {
  q3 = Quadrille.AND(quadrille, q2, row, col);
}

function xor(quadrille, row, col) {
  q3 = Quadrille.XOR(quadrille, q2, row, col);
}

function diff(quadrille, row, col) {
  q3 = Quadrille.DIFF(quadrille, q2, row, col);
}