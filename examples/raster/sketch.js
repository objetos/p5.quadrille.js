const ROWS = 20;
const COLS = 20;
const LENGTH = 20;
let quadrille;
let v0x, v0y, v1x, v1y, v2x, v2y;

function setup() {
  createCanvas(COLS * LENGTH, ROWS * LENGTH);
  quadrille = createQuadrille(20, 20);
  randomize();
  // highlevel call:
  quadrille.colorize(v0x, v0y, v1x, v1y, v2x, v2y, [255, 0, 0], [0, 255, 0], [0, 0, 255]);
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
  triangle(v0x * LENGTH + LENGTH / 2, v0y * LENGTH + LENGTH / 2, v1x * LENGTH + LENGTH / 2, v1y * LENGTH + LENGTH / 2, v2x * LENGTH + LENGTH / 2, v2y * LENGTH + LENGTH / 2);
  pop();
}

function keyPressed() {
  randomize();
  quadrille.clear();
  // low level call:
  // [r, g, b, x, y]: rgb -> color components; x, y -> 2d normal
  quadrille.rasterize(v0x, v0y, v1x, v1y, v2x, v2y, colorize_shader, [255, 0, 0, 7, 4], [0, 255, 0, -1, -10], [0, 0, 255, 5, 8]);
}

// pretty similar to what p5.Quadrille.colorize does
function colorize_shader(pattern) {
  let normal = pattern.slice(0, 3);
  // debug 2d normal
  console.log(pattern.slice(3));
  // use interpolated color as is
  return color(pattern.slice(0, 3));
}

function randomize() {
  v0x = int(random(0, COLS));
  v0y = int(random(0, ROWS));
  v1x = int(random(0, COLS));
  v1y = int(random(0, ROWS));
  v2x = int(random(0, COLS));
  v2y = int(random(0, ROWS));
}