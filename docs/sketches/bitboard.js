const ROWS = 20;
const COLS = 20;
const LENGTH = 20;
var quadrille;
var clone;

function setup() {
  createCanvas(COLS * LENGTH, ROWS * LENGTH);
  quadrille = createQuadrille(3, 58, color('red'));
  quadrille.reflect();
  clone = quadrille.clone();
  clone.reflect();
}

function draw() {
  background('#060621');
  drawQuadrille(quadrille, 2, 2, LENGTH, 2, 'green');
  drawQuadrille(clone, 2, 10, LENGTH, 0);
}
