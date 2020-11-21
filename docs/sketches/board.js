var myp5 = new p5((p) => {
  const ROWS = 20;
  const COLS = 10;
  const LENGTH = 20;
  var quadrille;
  var board;
  var x = 2, y = 2;

  p.setup = function () {
    p.createCanvas(COLS * LENGTH, ROWS * LENGTH);
    board = p.createBoard(ROWS, COLS);
    quadrille = p.createQuadrille([[p.color('cyan'), '👽',                0   ],
                                   [0,               '🤔',               '🙈' ],
                                   [0,                p.color('#770811'), 0  ],
                                   ['g',              'o',                'l' ]
                                  ]);
  };

  p.draw = function () {
    p.background('#859900');
    p.drawBoard(board, LENGTH);
    p.drawQuadrille(quadrille, x, y, LENGTH, 2, 'green');
  };

  p.keyPressed = function () {
    if (p.keyCode === p.LEFT_ARROW) {
      quadrille.reflect();
    } else if (p.keyCode === p.RIGHT_ARROW) {
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
    if (validate) {
      try {
        let update = board.add(quadrille, row, col);
        if (update.memoryHitCounter === 0) {
          board = update.quadrille;
        }
      } catch (out_of_bounds) {
        console.log(out_of_bounds);
      }
    }
    else {
      board = board.add(quadrille, row, col).quadrille;
    }
  };
}, "board");