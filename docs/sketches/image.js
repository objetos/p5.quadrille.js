let quadrille;
let image;

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
    drawQuadrille(quadrille, {cellLength: 40 / scl, outlineWeight: 1.6 / scl, outline: color(random(255))});
  }
}