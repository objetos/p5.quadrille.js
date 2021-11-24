const ROWS = 20;
const COLS = 40;
const LENGTH = 20;
var board, quadrille;
var x, y;
var animate = true;
var al;

function preload() {
  al = loadImage('/p5.quadrille.js/docs/sketches/abraham_lincoln.jpg');
}

function setup() {
  createCanvas(COLS * LENGTH, ROWS * LENGTH);
  board = createQuadrille(COLS, ROWS);
  quadrille = active(int(random(3)));
  x = int(random(0, COLS - 4));
  y = int(random(0, ROWS - 4));
}

function draw() {
  background('#2E0E36');
  if ((frameCount % 30 === 0) && animate) {
    stick('u');
  }
  drawQuadrille(board, {cellLength: LENGTH, outline: 'magenta', board: true});
  drawQuadrille(quadrille, {x: x, y: y, cellLength: LENGTH, outline: '#1EB2A6', board: true});
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
  if (key === 'q') {
    animate = !animate;
  }
  if (key === 'u' || key === 'x' || key === 'i' || key === 'd') {
    stick(key);
  }
}

function stick(key) {
  let clone = quadrille.clone();
  clone.fill(color('#965695'));
  board = key === 'u' ? Quadrille.OR(board, clone, y, x) :
          key === 'x' ? Quadrille.XOR(board, clone, y, x) :
          key === 'i' ? Quadrille.AND(board, clone, y, x) :
                        Quadrille.DIFF(board, clone, y, x);
  quadrille = active(int(random(3)));
  x = int(random(0, COLS - 4));
  y = int(random(0, ROWS - 4));
}

function active(value) {
  let c1 = color(random(255), random(255), random(255), 255);
  let c2 = color(random(255), random(255), random(255), 255);
  let c3 = color(random(255), random(255), random(255), 255);
  switch (value) {
    case 1:
      return createQuadrille([[c1, 'g',  0],
                              [0,  'o', al],
                              [al, 'l',  0],
                              [c1, c2,  c3]
                             ]);
    case 2:
      return createQuadrille(4, int(random(1, 1048576)), c2);
    default:
      let w = int(random(2, 6));
      let h = int(random(2, 6));
      return createQuadrille(w, h, int(random(1, w * h)), c3);
  }
}