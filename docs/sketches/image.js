var scl = 0;
var inc = true;
var quadrille;
var image;

function preload() {
  image = loadImage('/p5.quadrille.js/docs/sketches/mahakala.jpg');
  color = color(random(255), random(255), random(255));
}

function setup() {
  createCanvas(800, 360);
  quadrille = createQuadrille(20 * (2 ** scl), image);
}

function draw() {
  background('#060621');
  drawQuadrille(quadrille, 0, 0, 40 / (2 ** scl), 1.6 / (2 ** scl), '#FBBC04');
  //if (frameCount)
}

function keyPressed() {
  if (inc && scl === 4 || !inc && scl === 0) {
    inc = !inc;
  }
  scl = inc ? scl + 1 : scl - 1;
  quadrille = createQuadrille(20 * (2 ** scl), image);
}