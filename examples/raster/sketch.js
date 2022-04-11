const ROWS = 20;
const COLS = 20;
const LENGTH = 20;
let quadrille;
let row0, col0, row1, col1, row2, col2;

function setup() {
  createCanvas(COLS * LENGTH, ROWS * LENGTH);
  quadrille = createQuadrille(20, 20);
  //randomize();
  // highlevel call:
  //quadrille.colorizeTriangle(row0, col0, row1, col1, row2, col2, [255, 0, 0], [0, 255, 0], [0, 0, 255]);
  //quadrille.colorizeTriangle(row0, col0, row1, col1, row2, col2, 'red', 'green', 'blue');
  quadrille.colorize('red', 'green', 'blue', 'cyan');
}

function draw() {
  background('#060621');
  drawQuadrille(quadrille, { cellLength: LENGTH, outline: 'green', board: true });
  tri();
}

function tri() {
  push();
  stroke('cyan');
  strokeWeight(3);
  noFill();
  triangle(col0 * LENGTH + LENGTH / 2, row0 * LENGTH + LENGTH / 2, col1 * LENGTH + LENGTH / 2, row1 * LENGTH + LENGTH / 2, col2 * LENGTH + LENGTH / 2, row2 * LENGTH + LENGTH / 2);
  pop();
}

function keyPressed() {
  randomize();
  quadrille.clear();
  if (key === 'r') {
    // low level call:
    // [r, g, b, x, y]: rgb -> color components; x, y -> 2d normal
    quadrille.rasterizeTriangle(row0, col0, row1, col1, row2, col2, colorize_shader, [255, 0, 0, 7, 4], [0, 255, 0, -1, -10], [0, 0, 255, 5, 8]);
  }
  if (key === 's') {
    quadrille.rasterize(colorize_shader, [255, 0, 0, 7, 4], [0, 255, 0, -1, -10], [0, 0, 255, 5, 8], [255, 255, 0, -1, -10]);
  }
  /*
  if (key === 't') {
    quadrille.clear(5, 5);
    quadrille.fill(6, 6, color('cyan'));
  }
  */
}

// pretty similar to what p5.Quadrille.colorizeTriangle does
function colorize_shader({ pattern: mixin }) {
  let rgb = mixin.slice(0, 3);
  // debug 2d normal
  console.log(mixin.slice(3));
  // use interpolated color as is
  return color(rgb);
}

function randomize() {
  col0 = int(random(0, COLS));
  row0 = int(random(0, ROWS));
  col1 = int(random(0, COLS));
  row1 = int(random(0, ROWS));
  col2 = int(random(0, COLS));
  row2 = int(random(0, ROWS));
}