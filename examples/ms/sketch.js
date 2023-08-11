'use strict';
let board, mask;
let row, col;
const debug = false;
const p = 1, w = 30;
let h;

function setup() {
  h = floor(w * p);
  Quadrille.CELL_LENGTH = 600 / w;
  createCanvas(w * Quadrille.CELL_LENGTH, h * Quadrille.CELL_LENGTH);
  board = createQuadrille(w, h, floor(w * h) * 0.1, '💣');
  mask = board.clone();
  visitQuadrille(board,
    (row, col) => {
      if (board.isEmpty(row, col)) {
        let order = board.ring(row, col).order;
        if (order) {
          mask.fill(row, col, order.toString());
        }
      }
    }
  );
  board = mask.clone();
  mask.replace(color('green'));
  mask.fill(color('red'));
  // suppress right-click context menu
  document.oncontextmenu = function () {
    return false;
  };
}

function draw() {
  background('orange');
  drawQuadrille(board);
  drawQuadrille(debug ? mask : mask.clone().replace(color('magenta')), { outline: (color('lime')) });
}

function mouseClicked() {
  row = board.mouseRow;
  col = board.mouseCol;
  if (board.read(row, col) === '💣') {
    mask = createQuadrille(w, h);
    return;
  }
  board.isFilled(row, col) ? mask.clear(row, col) : mask.clear(row, col, true);
}