'use strict';

const ROWS = 20;
const COLS = 40;
const LENGTH = 20;
let graphics;
let current, matrixCells, stringCells, arrayCells, bitboardCells, uniformCells, colorCells, numberCells;
let al;
let a1, a2, a3, a4, a5, a6, a7;
let f;
//let w;
let l;
let i;
let m;

function preload() {
  al = loadImage('al.jpg');
  a1 = loadImage('a1.jpg');
  a2 = loadImage('a2.png');
  a3 = loadImage('a3.jpg');
  a4 = loadImage('a4.jpg');
  a5 = loadImage('a5.jpg');
  a6 = loadImage('a6.png');
  a7 = loadImage('a7.jpg');
  f = loadImage('f.jpg');
  //w = loadImage('w.png');
  l = loadImage('l.jpg');
  i = loadImage('i.png');
  m = loadImage('m.png');
}

function setup() {
  let c1 = color(random(255), random(255), random(255), 255);
  let c2 = color(random(255), random(255), random(255), 255);
  let c3 = color(random(255), random(255), random(255), 255);
  let e1 = '🗣';
  createCanvas(COLS * LENGTH, ROWS * LENGTH);
  //Quadrille.cellLength = 500;
  graphics = createGraphics(Quadrille.cellLength, Quadrille.cellLength);
  colorCells = createQuadrille([color('red'), color('green'), color('blue'), color('cyan'), color('magenta'), color('yellow')/*, color(int(random(255)), int(random(255)), int(random(255)))*/]);
  matrixCells = createQuadrille([[c1, 'g'],
  [null, 'o', al],
  [al, 'l'],
  [e1, c2, c3]
  ]);
  stringCells = createQuadrille('!@#,$%^>.,i*');
  arrayCells = createQuadrille(5, [null, 'o', al, al, 'l', e1, c2, c3]);
  bitboardCells = createQuadrille(4, int(random(1, 1048576)), e1);
  let w = int(random(2, 6));
  let h = int(random(2, 6));
  //uniformCells = createQuadrille(w, h, int(random(1, w * h)), al);
  uniformCells = createQuadrille(/*3, */[al, a1, a2, a3, a4, a5, a6, a7, f, l, i, m]);
  numberCells = createQuadrille([0, 50, 100, 150, 200, 250]);
}

function draw() {
  background('#2E0E36');
  if (current) {
    drawQuadrille(current, { /*cellLength: LENGTH,*/ outline: 'magenta', cellLength: 40 });
  }
  else {
    //Quadrille.COLOR({ graphics: graphics, outline: 'blue', outlineWeight: 6/*, cellLength: Quadrille.CELL_LENGTH */});
    //Quadrille.IMAGE({ graphics: graphics, cell: al });
    //graphics.background('white');
    Quadrille.stringDisplay({ graphics: this, value: 'g', outline: 'black', outlineWeight: 3 });
    //Quadrille.NUMBER({ graphics: graphics, outlineWeight: 0, min: -1, max: 1 });
    //image(graphics, 0, 0);
    /*
    graphics.loadPixels();
    let r, g, b, a;
    r = g = b = a = 0;
    let total = graphics.pixels.length / 4;
    for (let i = 0; i < total; i++) {
      r += graphics.pixels[4 * i];
      g += graphics.pixels[4 * i + 1];
      b += graphics.pixels[4 * i + 2];
      a += graphics.pixels[4 * i + 3];
    }
    r /= total;
    g /= total;
    b /= total;
    a /= total;
    graphics.updatePixels();
    let wa = 0.299 * r + 0.587 * g + 0.114 * b;
    console.log('hey', wa);
    image(graphics, 0, 0);
    */
  }
}

function keyPressed() {
  if (key === 'a') {
    current = arrayCells;
  }
  if (key === 'b') {
    current = bitboardCells;
  }
  if (key === 'c') {
    current = colorCells;
  }
  if (key === 'm') {
    current = matrixCells;
  }
  if (key === 'n') {
    current = numberCells;
  }
  if (key === 's') {
    current = stringCells;
  }
  if (key === 'u') {
    current = uniformCells;
  }
  if (key === 'q') {
    current = null;
  }
  if (key === 'x') {
    //current.sort({ mode: 'DISTANCE', target: 'magenta'/*, ascending: false*/ });
    current.sort({ mode: 'LUMA', ascending: true });
  }
  if (key === 'r') {
    current.randomize();
  }
}
