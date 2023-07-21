'use strict';
let q, mask;
const p = 1, w = 30;
let h;

function setup() {
  h = floor(w * p);
  Quadrille.CELL_LENGTH = 600 / w;
  createCanvas(w * Quadrille.CELL_LENGTH, h * Quadrille.CELL_LENGTH);
  q = createQuadrille(w, h, floor(w * h) * 0.1, '💣');
  let clone = q.clone();
  visitQuadrille(q,
    (row, col) => {
      if (q.isEmpty(row, col)) {
        let order = q.ring(row, col).order;
        if (order) {
          clone.fill(row, col, order.toString());
        }
      }
    }
  );
  q = clone;
  mask = Quadrille.NEG(q, color('red'));
  mask.fill(color('green'));
  // suppress right-click context menu
  document.oncontextmenu = function () {
    return false;
  };
}

function draw() {
  background('orange');
  drawQuadrille(q);
  drawQuadrille(Quadrille.NEG(Quadrille.NEG(mask, color('red')), color('magenta')), { outline: (color('lime')) });
}

function mouseClicked() {
  const row = floor(mouseY / Quadrille.CELL_LENGTH);
  const col = floor(mouseX / Quadrille.CELL_LENGTH);
  if (q.read(row, col) === '💣') {
    mask = createQuadrille(w, h);
    return;
  }
  q.isFilled(row, col) ? mask.clear(row, col) : mask.clear(row, col, true);
}