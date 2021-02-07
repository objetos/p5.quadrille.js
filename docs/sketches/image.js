var quadrille;
var image;

function preload() {
  image = loadImage('/p5.quadrille.js/docs/sketches/mahakala.jpg');
}

function setup() {
  createCanvas(800, 360);
}

function draw() {
  if (frameCount % 200 === 0) {
    let scl = 2 ** int(random(4));
    quadrille = createQuadrille(20 * scl, image);
    drawQuadrille(quadrille, 0, 0, 40 / scl, 1.6 / scl, color(random(255)));
  }
}