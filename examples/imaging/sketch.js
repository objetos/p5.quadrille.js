const ROWS = 40;
const COLS = 40;
const LENGTH = 20;
var quadrille;
var image;

function preload() {
  image = loadImage('mahakala.jpg');
  //image = loadImage('abraham_lincoln.jpg');
}

function setup() {
  createCanvas(COLS * LENGTH, ROWS * LENGTH);
  console.log(image.width, image.height);
  quadrille = createQuadrille(160, image);
  console.log(Quadrille.version);
}

function draw() {
  background('#060621');
  //background(color([0, 255, 0]));
  drawQuadrille(quadrille, 0, 0, LENGTH / 4, 0, 'green');
}

function keyPressed() {
  if (keyCode === UP_ARROW) {
    quadrille.reflect();
  } else if (keyCode === DOWN_ARROW) {
    quadrille.rotate();
  }
}