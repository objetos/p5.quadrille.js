let scl = 0;
let mask, quadrille, orig, conv;
let image;

function update() {
  let c = quadrille == null ? false : quadrille === conv;
  //let c = false;
  orig = createQuadrille(40 * (2 ** scl), image);
  conv = orig.clone();
  conv.conv(mask);
  quadrille = orig;
  quadrille = c ? conv : orig;
}

function preload() {
  // 1024x438
  image = loadImage('mahakala.jpg');
  // 300x300
  //image = loadImage('abraham_lincoln.jpg');
}

function setup() {
  createCanvas(800, 800);
  mask = createQuadrille([[0.0625, 0.125, 0.0625],
                          [0.125,  0.25,  0.125],
                          [0.0625, 0.125, 0.0625]]);
  update();
}

function draw() {
  background('#060621');
  drawQuadrille(quadrille, 0, 0, 20 / (2 ** scl), 1.6 / (2 ** scl), quadrille === orig ? 'magenta' : 'cyan');
}

function keyPressed() {
  if (key === 's') {
    scl = scl < 3 ? scl + 1 : 0;
    update();
  }
  if (key === 'c') {
    quadrille = quadrille === orig ? conv : orig;
  }
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