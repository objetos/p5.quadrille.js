'use strict';

let scl = 0;
let mask, mask_vis, quadrille, orig, conv;
let image;
let image_mode = true;
let objectDisplay;
let numberDisplay;

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
  mask = createQuadrille([[0.0625, 0.125, 0.0625],
  [0.125, 0.25, 0.125],
  [0.0625, 0.125, 0.0625]]);
  let o = {
    min: 0.0625,
    max: 0.25,
  }
  let o1 = Object.create(o);
  o1.val = 0.0625;
  let o2 = Object.create(o);
  o2.val = 0.125;
  let o3 = Object.create(o);
  o3.val = 0.25;
  mask_vis = createQuadrille(
    [[o1, o2, o1],
    [o2, o3, o2],
    [o1, o2, o1]]);
  // */
  /*
  mask = createQuadrille([ [ -1, -1, -1 ],
                           [ -1,  9, -1 ],
                           [ -1, -1, -1 ] ]); 
  // */
  let counter = 0;
  objectDisplay = ({ graphics: graphics, cell: cell, outline: outline, outlineWeight: outlineWeight, cellLength: cellLength, row: i, col: j }) => {
    graphics.fill(graphics.map(cell.val, cell.min, cell.max, 0, 255));
    graphics.rect(0, 0, cellLength, cellLength);
    //Quadrille.TILE({ graphics: graphics, outline: outline, outlineWeight: outlineWeight, cellLength: cellLength, row: i, col: j });
  }
  numberDisplay = ({ graphics: graphics, cell: cell, outline: outline, outlineWeight: outlineWeight, cellLength: cellLength, row: i, col: j }) => {
    let numberColor = 'blue';
    let min = 0.0625;
    let max = 0.25;
    graphics.colorMode(graphics.RGB, 255);
    graphics.fill(graphics.color(red(numberColor), green(numberColor), blue(numberColor), graphics.map(cell, min, max, 0, 255)));
    graphics.rect(0, 0, cellLength, cellLength);
    Quadrille.TILE({ graphics: graphics, outline: outline, outlineWeight: outlineWeight, cellLength: cellLength, row: i, col: j });
  }
  update();
}

function draw() {
  background('#060621');
  if (image_mode) {
    drawQuadrille(quadrille,
      {
        cellLength: 20 / (2 ** scl),
        outlineWeight: 1.6 / (2 ** scl),
        outline: quadrille === orig ? 'magenta' : 'cyan'
      });
  } else {
    /*
    drawQuadrille(mask_vis,
      {
        x: 150,
        y: 250,
        cellLength: 50,
        objectDisplay: objectDisplay
      });
      */
    drawQuadrille(mask,
      {
        x: 150,
        y: 250,
        cellLength: 50,
        numberDisplay: numberDisplay
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