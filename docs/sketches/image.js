//var scl = 20;
var scl = 0;
var quadrille;
var image;

function preload() {
  image = loadImage('/p5.quadrille.js/docs/sketches/mahakala.jpg');
  //image = loadImage('abraham_lincoln.jpg');
}

function setup() {
  createCanvas(800, 342);
  //console.log(image.width, image.height);
  quadrille = createQuadrille(40 * (2 ** scl), image);
  //console.log(Quadrille.version);
}

function draw() {
  background('#060621');
  drawQuadrille(quadrille, 0, 0, 20 / (2 ** scl), 1.6 / (2 ** scl));
}

function keyPressed() {
  scl = scl < 3 ? scl + 1 : 0;
  quadrille = createQuadrille(40 * (2 ** scl), image);
  /*
  if (frameCount % 300 === 0) {
    scl = scl < 3 ? scl + 1 : 0;
    quadrille = createQuadrille(40 * (2 ** scl), image);
  }
  if (keyCode === UP_ARROW) {
    quadrille.reflect();
  } else if (keyCode === DOWN_ARROW) {
    quadrille.rotate();
  }
  */
}