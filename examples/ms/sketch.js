'use strict';
let q, filter;
const p = 1, w = 30;
let h;

function setup() {
  h = floor(w * p);
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
  filter = Quadrille.NEG(q, color('red'));
  filter.fill(color('green'));
  // suppress right-click context menu
  document.oncontextmenu = function () {
    return false;
  };
}

function draw() {
  background('orange');
  drawQuadrille(q);
  drawQuadrille(Quadrille.NEG(Quadrille.NEG(filter, color('red')), color('magenta')), { outline: (color('lime')) });
}

function mouseClicked() {
  const row = floor(mouseY / Quadrille.CELL_LENGTH);
  const col = floor(mouseX / Quadrille.CELL_LENGTH);
  if (q.read(row, col) === '💣') {
    filter = createQuadrille(w, h);
    return;
  }
  q.isFilled(row, col) ? filter.clear(row, col) : filter.clear(row, col, true);
}