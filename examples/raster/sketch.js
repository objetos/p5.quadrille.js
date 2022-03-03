const ROWS = 20;
const COLS = 20;
const LENGTH = 20;
let quadrille;
let v0x, v0y, v1x, v1y, v2x, v2y;

function setup() {
  createCanvas(COLS * LENGTH, ROWS * LENGTH);
  quadrille = createQuadrille(20,20);
  randomize();
  let obj = {r: 255};
  console.log(obj.g);
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
  //quadrille.rasterize(v0x, v0y, v1x, v1y, v2x, v2y, {r: 255});
  quadrille.rasterize(v0x, v0y, v1x, v1y, v2x, v2y, {r: 255, g: 0, b: 0}, {r: 0, g: 255, b: 0}, {r: 0, g: 0, b: 255});
  //quadrille.rasterize(v0x, v0y, v1x, v1y, v2x, v2y, {r: 255, g: 0, b: 0});
}

function randomize() {
  v0x = int(random(0, COLS));
  v0y = int(random(0, ROWS));
  v1x = int(random(0, COLS));
  v1y = int(random(0, ROWS));
  v2x = int(random(0, COLS));
  v2y = int(random(0, ROWS));
}