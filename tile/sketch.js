'use strict';

let q;
function setup() {
  //createCanvas(105, 105);
  createCanvas(605, 405);
  const COMMON = 0;
  const ROW = 1 << 0;
  const COL = 1 << 1;
  const OTHER = 1 << 2;
  //const RIGHT = 1 << 3;
  //const BOTTOM = 1 << 4;
  console.log(COMMON);
  console.log(ROW);
  console.log(COL);
  console.log(OTHER);
  //let mask = ROW | COL;
  let mask = OTHER | ROW | COL;
  if (ROW & mask) {
    console.log('ROW active')
  }
  if (COL & mask) {
    console.log('COL active')
  }
  if (OTHER & mask) {
    console.log('OTHER active')
  }
  q = createQuadrille(6, 4);
  //q = createQuadrille(1, 1);
}

function draw() {
  background('yellow');
  drawQuadrille(q);
  //Quadrille.TILE( { graphics: this, outlineWeight: 9, mode: 0 } );
}