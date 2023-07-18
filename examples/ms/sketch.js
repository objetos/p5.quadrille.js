'use strict';
let q, filter, mask;
const p = 1;
const w = 30;
let mode = 0;
let maskColor;
let fillColor;

function setup() {
  maskColor = color(200);
  fillColor = color('blue');
  const h = floor(w * p);
  Quadrille.CELL_LENGTH = 600 / w;
  createCanvas(w * Quadrille.CELL_LENGTH, h * Quadrille.CELL_LENGTH);
  q = createQuadrille(w, h, floor(w * h) * 0.1, '💣');
  let clone = q.clone();
  visitQuadrille(q,
    (quadrille, { row: row, col: col }) => {
      if (quadrille.isEmpty(row, col)) {
        let order = quadrille.ring(row, col).order;
        if (order) {
          clone.fill(row, col, order.toString());
        }
      }
    }
  );
  q = clone;
  filter = q.clone();
  filter.fill(color('red'));
  mask = createQuadrille(w, h, w * h, maskColor);
  // suppress right-click context menu
  document.oncontextmenu = function () {
    return false;
  };
}

function draw() {
  background('orange');
  
  drawQuadrille(q);
  if (mode === 1) {
    drawQuadrille(filter);
  }
  if (mode === 2) {
    drawQuadrille(mask);
  }
}

function mouseClicked() {
  const row = floor(mouseY / Quadrille.CELL_LENGTH);
  const col = floor(mouseX / Quadrille.CELL_LENGTH);
  if (q.isFilled(row, col)) {
    mask.clear(row,col);
    return;
  }
  /*
  // option 1
  filter.fill(row, col, fillColor, true);
  visitQuadrille(mask,
    (quadrille, { row: row, col: col }) => {
      if (filter.isColor(row, col)) {
        quadrille.clear(row, col);
      }
    }
  );
  */
  // option 2
  filter.clear(row, col, true);
  visitQuadrille(mask,
    (quadrille, { row: row, col: col }) => {
      if (filter.isEmpty(row, col)) {
        quadrille.clear(row, col);
      }
    }
  );
}

function keyPressed() {
  mode = 0;
  mode = parseInt(key);
}