'use strict';
let q, filter, mask;
const p = 1;
const w = 30;
let debug;
let maskColor;

function setup() {
  maskColor = color('magenta');
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
  if (debug) {
    drawQuadrille(filter);
    return;
  }
  drawQuadrille(q);
  drawQuadrille(mask, { outline: color('lime') });
}

function mouseClicked() {
  const row = floor(mouseY / Quadrille.CELL_LENGTH);
  const col = floor(mouseX / Quadrille.CELL_LENGTH);
  q.isFilled(row, col) ? filter.clear(row, col) : filter.clear(row, col, true);
  mask = Quadrille.NEG(filter, maskColor);
  mask = Quadrille.NEG(mask, maskColor);
}

function keyPressed() {
  debug = !debug;
}