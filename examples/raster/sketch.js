const ROWS = 20;
const COLS = 20;
const LENGTH = 20;
let quadrille;
let v0x, v0y, v1x, v1y, v2x, v2y;

function setup() {
  createCanvas(COLS * LENGTH, ROWS * LENGTH);
  quadrille = createQuadrille(20,20);
  randomize();
}

function draw() {
  background('#060621');
  drawQuadrille(quadrille, 0, 0, LENGTH, 2, 'green', true);
  tri();
}

function tri() {
  push();
  stroke('cyan');
  strokeWeight(3);
  noFill();
  triangle(v0x*LENGTH + LENGTH/2, v0y*LENGTH + LENGTH/2, v1x*LENGTH + LENGTH/2, v1y*LENGTH + LENGTH/2, v2x*LENGTH + LENGTH/2, v2y*LENGTH + LENGTH/2);
  pop();
}

function keyPressed() {
  randomize();
  quadrille.clear();
  quadrille.rasterize(v0x, v0y, v1x, v1y, v2x, v2y, color('red'), color('green'), color('blue'));
}

function randomize() {
  v0x = int(random(0, COLS));
  v0y = int(random(0, ROWS));
  v1x = int(random(0, COLS));
  v1y = int(random(0, ROWS));
  v2x = int(random(0, COLS));
  v2y = int(random(0, ROWS));
}