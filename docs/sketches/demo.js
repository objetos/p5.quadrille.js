const ROWS = 20;
const COLS = 40;
const LENGTH = 20;
let board, quadrille;
let col, row;
let animate = true;
let al;

function preload() {
  al = loadImage('/p5.quadrille.js/docs/sketches/abraham_lincoln.jpg');
}

function setup() {
  createCanvas(COLS * LENGTH, ROWS * LENGTH);
  board = createQuadrille(COLS, ROWS);
  quadrille = active(int(random(5)));
  col = int(random(0, COLS - 4));
  row = int(random(0, ROWS - 4));
}

function draw() {
  background('#2E0E36');
  if ((frameCount % 30 === 0) && animate) {
    stick('u');
  }
  drawQuadrille(board, { cellLength: LENGTH, outline: 'magenta' });
  drawQuadrille(quadrille, { x: col * LENGTH, y: row * LENGTH, cellLength: LENGTH, outline: '#1EB2A6' });
}

function keyPressed() {
  if (key === 'c') {
    board.clear();
  }
  if (key === '1' || key === '2' || key === '3' || key === '4' || key === '5') {
    quadrille = active(parseInt(key));
  }
  if (key === 'u' || key === 'x' || key === 'i' || key === 'd') {
    stick(key);
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
  if (key === 'q') {
    animate = !animate;
  }
  row = key === 'w' ? row - 1 : key === 'z' ? row + 1 : row;
  col = key === 'a' ? col - 1 : key === 's' ? col + 1 : col;
}

function stick(key) {
  let clone = quadrille.clone();
  clone.replace(color('#965695'));
  board = key === 'u' ? Quadrille.OR(board, clone, row, col) :
          key === 'x' ? Quadrille.XOR(board, clone, row, col) :
          key === 'i' ? Quadrille.AND(board, clone, row, col) :
                        Quadrille.DIFF(board, clone, row, col);
  quadrille = active(int(random(5)));
  col = int(random(0, COLS - 4));
  row = int(random(0, ROWS - 4));
}

function active(value) {
  let c1 = color(random(255), random(255), random(255), 255);
  let c2 = color(random(255), random(255), random(255), 255);
  let c3 = color(random(255), random(255), random(255), 255);
  let e1 = '👽';
  switch (value) {
    case 1:
      return createQuadrille([[c1,   'g'],
                              [null, 'o', al],
                              [al,   'l'],
                              [e1,   c2,  c3]
                              ]);
    case 2:
      return createQuadrille(2, [c1, al, c3, e1, c2]);
    case 3:
      return createQuadrille(4, int(random(1, 1048576)), c2);
    case 4:
      return createQuadrille(5, 'hola mundo');
    default:
      let w = int(random(2, 6));
      let h = int(random(2, 6));
      return createQuadrille(w, h, int(random(1, w * h)), c3);
  }
}