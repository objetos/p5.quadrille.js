'use strict';
/*
const ROWS = 20;
const COLS = 40;
const LENGTH = 20;
*/
const ROWS = 10;
const COLS = 20;
const LENGTH = 40;
let board, quadrille;
let col, row;
let animate = true;
// tesselation
let circled;
let tile, contour;
// patterns
let rectX, pg;
let al;
let c1, c2, c3;
let s1, s2, s3;

function preload() {
  al = loadImage('abraham_lincoln.jpg');
}

function setup() {
  createCanvas(COLS * LENGTH, ROWS * LENGTH);
  // patterns
  c1 = color(random(255), random(255), random(255));
  c2 = color(random(255), random(255), random(255));
  c3 = color(random(255), random(255), random(255));
  pg = createGraphics(LENGTH, LENGTH);
  s1 = 'gol';
  s2 = '👽';
  s3 = '?'
  // quadrilles
  board = createQuadrille(COLS, ROWS);
  quadrille = active(int(random(8)));
  // current position
  col = int(random(0, COLS - 4));
  row = int(random(0, ROWS - 4));
  // tesselation
  ///*
  tile = ({ cell: cell, outline: contour, cellLength: diameter }) => {
    if (cell instanceof p5.Image || cell instanceof p5.Graphics) {
      ///*
      let _al = new p5.Image(cell.width, cell.height);
      _al.copy(cell, 0, 0, cell.width, cell.height, 0, 0, cell.width, cell.height);
      let shape = createGraphics(cell.width, cell.height);
      shape.fill(0);
      shape.ellipseMode(CORNER);
      shape.ellipse(0, 0, cell.width, cell.height);
      _al.mask(shape);
      image(_al, 0, 0, diameter, diameter);
    }
    else {
      push();
      //cell instanceof p5.Image || cell instanceof p5.Graphics ? texture(al) : fill(contour);
      fill(contour);
      ellipseMode(CORNER);
      ellipse(0, 0, diameter, diameter);
      //circle(0, 0, diameter);
      pop();
    }
  };
  // */
  /*
  tile: () => {
    push();
    fill('blue');
    circle(0, 0, LENGTH);
    pop();
  },
  // */
  //tile: tile,
  ///*
  contour = ({ outline: outline, cellLength: diameter }) => {
    push();
    noFill();
    stroke(outline);
    ellipseMode(CORNER);
    ellipse(0, 0, diameter, diameter);
    //circle(0, 0, diameter);
    pop();
  };
  // */
  /*
  contour: () => {
    push();
    noFill();
    stroke('blue');
    circle(0, 0, LENGTH);
    pop();
  }
  // */
  //contour: contour
}

function draw() {
  background('#2E0E36');
  animatePG();
  if ((frameCount % 30 === 0) && animate) {
    stick('u');
  }
  drawQuadrille(board, { cellLength: LENGTH, outline: 'magenta', board: true, tile: circled ? tile : undefined, contour: circled ? contour : undefined });
  drawQuadrille(quadrille, { col: col, row: row, cellLength: LENGTH, outline: '#1EB2A6', board: true, tile: circled ? tile : undefined, contour: circled ? contour : undefined, textZoom: 0.5 });
}

function animatePG() {
  pg.background(200);
  pg.fill(random(255));
  pg.triangle(10, 17, 15, 5, 18, 18);
}

function keyPressed() {
  if (key === 'c') {
    board.clear();
  }
  let intKey = parseInt(key);
  if (intKey) {
    quadrille = active(intKey);
  }
  if (key === 'u' || key === 'x' || key === 'i' || key === 'd') {
    stick(key);
  }
  if (key === 'f') {
    quadrille.reflect();
  }
  if (key === 'r') {
    quadrille.rotate();
  }
  if (key === 't') {
    quadrille.transpose();
  }
  if (key === 'q') {
    animate = !animate;
  }
  if (key === 'o') {
    circled = !circled;
  }
  row = key === 'w' ? row - 1 : key === 'z' ? row + 1 : row;
  col = key === 'a' ? col - 1 : key === 's' ? col + 1 : col;
}

function stick(key) {
  let clone = quadrille.clone();
  clone.fill(color('#965695'));
  board = key === 'u' ?
    Quadrille.OR(board, clone, row, col) : key === 'x' ?
      Quadrille.XOR(board, clone, row, col) : key === 'i' ?
        Quadrille.AND(board, clone, row, col) : Quadrille.DIFF(board, clone, row, col);
  quadrille = active(int(random(5)));
  col = int(random(0, COLS - 4));
  row = int(random(0, ROWS - 4));
}

function active(value) {
  switch (value) {
    case 1:
    case 2:
      return createQuadrille(7, value === 1 ? al : pg);
    case 3:
    case 4:
      let w = int(random(2, 6));
      let h = int(random(2, 6));
      return createQuadrille(w, h, int(random(1, w * h)), value === 3 ? al : c1);
    case 5:
    case 6:
      return createQuadrille(4, int(random(1, 1048576)), value === 5 ? pg : s1 + s2);  
    case 7:
      return createQuadrille(5, s1 + s2 + s3);
    case 8:
      return createQuadrille([
        [c1, s3],
        [0, s2, pg],
        [al, s1],
        [s2, c2, c3]
      ]);
    default:
      return createQuadrille(2, [c1, al, pg, s1, c2]);
  }
}
