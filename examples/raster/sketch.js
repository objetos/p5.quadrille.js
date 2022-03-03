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
  drawQuadrille(quadrille, {cellLength: LENGTH, outline: 'green', board: true});
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
  //quadrille.rasterize(v0x, v0y, v1x, v1y, v2x, v2y, color('red'), color('green'), color('blue'));
  //quadrille.rasterize(v0x, v0y, v1x, v1y, v2x, v2y, {r: 255}, {g: 255}, {b: 255});
  //quadrille.colorize(v0x, v0y, v1x, v1y, v2x, v2y, {r: 255});
  //quadrille.colorize(v0x, v0y, v1x, v1y, v2x, v2y, {r: 255, g: 0, b: 0, a: 255}, {r: 0, g: 255, b: 0, a: 255}, {r: 0, g: 0, b: 255, a: 255});
  //quadrille.colorize(v0x, v0y, v1x, v1y, v2x, v2y, {r: 255, a: 255}, {g: 255, a: 255}, {b: 255, a: 255});
  //quadrille.colorize(v0x, v0y, v1x, v1y, v2x, v2y, {r: 255}, {g: 255}, {b: 255});
  quadrille.rasterize(v0x, v0y, v1x, v1y, v2x, v2y, colorize_shader, {r: 255}, {g: 255}, {b: 255});
  //quadrille.rasterize(v0x, v0y, v1x, v1y, v2x, v2y, {r: 255, g: 0, b: 0});
}

function colorize_shader(pattern0, pattern1, pattern2) {
  let r = (pattern0.r ?? 0) + (pattern1.r ?? 0) + (pattern2.r ?? 0);
  let g = (pattern0.g ?? 0) + (pattern1.g ?? 0) + (pattern2.g ?? 0);
  let b = (pattern0.b ?? 0) + (pattern1.b ?? 0) + (pattern2.b ?? 0);
  let a = (pattern0.a ?? 255) + (pattern1.a ?? 255) + (pattern2.a ?? 255);
  return color(r, g, b, a);
}

function randomize() {
  v0x = int(random(0, COLS));
  v0y = int(random(0, ROWS));
  v1x = int(random(0, COLS));
  v1y = int(random(0, ROWS));
  v2x = int(random(0, COLS));
  v2y = int(random(0, ROWS));
}