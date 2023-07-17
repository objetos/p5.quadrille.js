'use strict';
let q1, q2, q3, quadrille;
let c1, c2, c3;
let eight;
let clear;
const p = 400 / 600;
const f = 0.5;
const w = 30;
let color1;
let color2;
let color3;

function setup() {
  const h = floor(w * p);
  Quadrille.CELL_LENGTH = 600 / w;
  createCanvas(w * Quadrille.CELL_LENGTH, h * Quadrille.CELL_LENGTH);
  c1 = color(random(255), random(255), random(255));
  c2 = color(random(255), random(255), random(255));
  c3 = color(random(255), random(255), random(255));
  q1 = createQuadrille(w, h, floor(w * h * f), c1);
  q2 = createQuadrille(w, h, floor(w * h * f), c2);
  q3 = createQuadrille(w, h, floor(w * h * f), c3);
  quadrille = Quadrille.OR(q1, Quadrille.OR(q2, q3));
  // suppress right-click context menu
  document.oncontextmenu = function () {
    return false;
  };
  color1 = color('red');
  color2 = color('lime');
  color3 = color('magenta');
  quadrille.fill(0, color1);
  quadrille.transpose().fill(1, color2).transpose();
  console.log(quadrille.isEmpty(-1, 0));
  console.log(quadrille.isEmpty(0, 0));
  console.log(quadrille.isNumber(0, 0));
  console.log(quadrille.isColor(0, 0));
  quadrille.fill(5, 5, 255);
  console.log(quadrille.isNumber(5, 5));
  quadrille.fill(7, 7, 'h');
  console.log(quadrille.isString(7, 7));
}

function draw() {
  background('orange');
  drawQuadrille(quadrille);
}

function mouseClicked() {
  const row = floor(mouseY / Quadrille.CELL_LENGTH);
  const col = floor(mouseX / Quadrille.CELL_LENGTH);
  /*
  let pattern = quadrille.read(row, col); 
  quadrille.replace(pattern, null);
  // */
  if (clear) {
    quadrille.clear(row, col, eight ? 8 : 4);
  }
  else {
    quadrille.fill(row, col, color(eight ? 'red' : 'blue'), eight ? 8 : 4);
  }
  return false;
}

function keyPressed() {
  if (key === 'c') {
    clear = !clear;
  }
  if (key === 'e' || key === 'f') {
    eight = !eight;
  }
  if (key === 'r') {
    quadrille.clear();
    quadrille.rand(7, color('cyan'));
  }
  if (key === 'n') {
    quadrille = Quadrille.NEG(quadrille, color('green'));
  }
  if (key === 'v') {
    visitQuadrille(quadrille,
      (quadrille, { row: row, col: col }) => {
        if (quadrille.isEmpty(row, col)) {
          quadrille.fill(row, col, 125);
        }
      }
    );
  }
  if (key === 'x') {
    visitQuadrille(quadrille, (quadrille, { row: row, col: col }) => quadrille.fill(row, col, color('yellow')), [125]);
  }
  if (key === 'y') {
    //cells: [color ('red')] // doesn't work since it needs references
    visitQuadrille(quadrille, (quadrille, { row: row, col: col }) => quadrille.fill(row, col, color3), [color1]);
  }
  if (key === 'z') {
    //cells: [color ('red')] // doesn't work since it needs references
    visitQuadrille(quadrille, (quadrille, { row: row, col: col }) => quadrille.fill(row, col, color('cyan')), [color2, color3, 'h']);
  }
}