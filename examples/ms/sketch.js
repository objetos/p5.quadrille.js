'use strict';
let board, mask;
const p = 1, w = 30;
let h;

function setup() {
  h = floor(w * p);
  Quadrille.CELL_LENGTH = 600 / w;
  createCanvas(w * Quadrille.CELL_LENGTH, h * Quadrille.CELL_LENGTH);
  board = createQuadrille(w, h, floor(w * h) * 0.1, '💣');
  let clone = board.clone();
  visitQuadrille(board,
    (row, col) => {
      if (board.isEmpty(row, col)) {
        let order = board.ring(row, col).order;
        if (order) {
          clone.fill(row, col, order.toString());
        }
      }
    }
  );
  board = clone;
  mask = Quadrille.NEG(board, color('red'));
  mask.fill(color('green'));
  // suppress right-click context menu
  document.oncontextmenu = function () {
    return false;
  };
}

function draw() {
  background('orange');
  drawQuadrille(board);
  drawQuadrille(Quadrille.NEG(Quadrille.NEG(mask, color('red')), color('magenta')), { outline: (color('lime')) });
}

function mouseClicked() {
  const row = floor(mouseY / Quadrille.CELL_LENGTH);
  const col = floor(mouseX / Quadrille.CELL_LENGTH);
  if (board.read(row, col) === '💣') {
    mask = createQuadrille(w, h);
    return;
  }
  board.isFilled(row, col) ? mask.clear(row, col) : mask.clear(row, col, true);
}