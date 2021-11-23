let scl = 0;
let mask, quadrille, orig, conv;
let image;
let image_mode = true;

function update() {
  let c = quadrille == null ? false : quadrille === conv;
  //let c = false;
  orig = createQuadrille(40 * (2 ** scl), image);
  conv = orig.clone();
  conv.filter(mask);
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
  // /*
  mask = createQuadrille([[0.0625, 0.125, 0.0625],
                          [0.125,  0.25,  0.125],
                          [0.0625, 0.125, 0.0625]]);
  // */
  /*
  mask = createQuadrille([ [ -1, -1, -1 ],
                           [ -1,  9, -1 ],
                           [ -1, -1, -1 ] ]); 
  // */
  update();
}

function draw() {
  background('#060621');
  if (image_mode) {
    drawQuadrille(quadrille,
      {
        LENGTH: 20 / (2 ** scl),
        outlineWeight: 1.6 / (2 ** scl),
        outline: quadrille === orig ? 'magenta' : 'cyan'
      });
  } else {
    drawQuadrille(mask,
      {
        LENGTH: 50,
        min: 0.0625,
        max: 0.25,
        alpha: 255
      });
  }
}

function keyPressed() {
  if (key === 's') {
    scl = scl < 3 ? scl + 1 : 0;
    update();
  }
  if (key === 'c') {
    quadrille = quadrille === orig ? conv : orig;
  }
  if (key === 'i') {
    image_mode = !image_mode;
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