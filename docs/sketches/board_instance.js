var myp5 = new p5((p) => {
  const ROWS = 20;
  const COLS = 20;
  const LENGTH = 20;
  var quadrille;
  var board;
  var x = 2, y = 2;

  p.setup = function () {
    p.createCanvas(COLS * LENGTH, ROWS * LENGTH);
    board = p.createQuadrille(COLS, ROWS);
    quadrille = p.createQuadrille([[p.color('cyan'), '👽', 0],
    [0, '🤔', '🙈'],
    [0, p.color('#770811'), 0],
    ['g', 'o', 'l']
    ]);
  };

  p.draw = function () {
    p.background('#859900');
    p.drawQuadrille(board, 0, 0, LENGTH, 2, 'blue', true);
    p.drawQuadrille(quadrille, x, y, LENGTH, 2, 'magenta');
  };

  p.keyPressed = function () {
    if (p.keyCode === p.LEFT_ARROW) {
      quadrille.reflect();
    }
    if (p.keyCode === p.RIGHT_ARROW) {
      quadrille.rotate();
    }
    if (p.key === 'a') {
      x--;
    }
    if (p.key === 's') {
      x++;
    }
    if (p.key === 'w') {
      y--;
    }
    if (p.key === 'z') {
      y++;
    }
    if (p.key === 'g') {
      glue(quadrille, y, x, false);
    }
    if (p.key === 'v') {
      glue(quadrille, y, x);
    }
  };

  this.glue = function (quadrille, row, col, validate = true) {
    let update = Quadrille.OR(board, quadrille, row, col);
    if (validate) {
      if (update.order === board.order + quadrille.order && update.width === board.width && update.height === board.height) {
        board = update;
      }
    }
    else {
      board = update;
    }
  };
}, "board");