const ROWS = 20;
const COLS = 20;
const LENGTH = 20;
var q1, q2, q3;
var a2, a3;
var col1 = 2, row1 = 2;
var col2 = 8, row2 = 10;
var col3 = 0, row3 = 0;
var c1, c2, c3;

function setup() {
  createCanvas(COLS * LENGTH, ROWS * LENGTH);
  c1 = color('cyan');
  c2 = color('yellow');
  c3 = color('#FBBC04');
  q1 = createQuadrille([[c1, c1],
                        [null,  c1, c1],
                        [null,  c1],
                        [c1, c1, c1]
                       ]);
  q2 = createQuadrille([[null,  c2],
                        [c2, c2],
                        [null,  c2],
                        [c2, c2]
                       ]);
}

function draw() {
  background('#060621');
  drawQuadrille(q1, {x: col1 * LENGTH, y: row1 * LENGTH, cellLength: LENGTH, outline: 'green', board: true});
  drawQuadrille(q2, {x: col2 * LENGTH, y: row2 * LENGTH, cellLength: LENGTH, outline: 'blue', board: true});
  if (q3) {
    drawQuadrille(q3, {x: col3 * LENGTH, y: row3 * LENGTH, cellLength: LENGTH, board: true});
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
    col3 = row3 = 0;
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
    a2 ? col2-- : a3 ? col3-- : col1--;
  }
  if (key === 's') {
    a2 ? col2++ : a3 ? col3++ : col1++;
  }
  if (key === 'w') {
    a2 ? row2-- : a3 ? row3-- : row1--;
  }
  if (key === 'z') {
    a2 ? row2++ : a3 ? row3++ : row1++;
  }
  if (key === 'o') {
    q3 = Quadrille.OR(q1, q2, row2-row1, col2-col1);
  }
  if (key === 'n') {
    q3 = Quadrille.AND(q1, q2, row2-row1, col2-col1);
  }
  if (key === 'x') {
    q3 = Quadrille.XOR(q1, q2, row2-row1, col2-col1);
  }
  if (key === 'd') {
    q3 = Quadrille.DIFF(q1, q2, row2-row1, col2-col1);
  }
  if (key == 'm') {
    q1.clear(1);
    console.log(q1.height);
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
  if (key == 'e') {
    console.log('before', q1.order);
    q1.clear();
    console.log(q1.height);
    console.log('after', q1.order);
  }
  if (key == '-') {
    q1 = Quadrille.NEG(q1, color('green'));
  }
  if (key === 'p' && q3) {
    console.log('y3', row3, 'x3', col3, 'width', q3.width, 'height', q3.height, 'order', q3.order);
  }
}