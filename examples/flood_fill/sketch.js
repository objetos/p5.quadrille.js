'use strict';
let q1, q2, q3, quadrille;
let c1, c2, c3;
let eight;
let clear;
const p = 400 / 600;
const f = 0.5;
const w = 30;

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
    quadrille.rand(7, color('cyan')), color('green');
  }
  if (key === 'n') {
    quadrille = Quadrille.NEG(quadrille, color('green'));
  }
}