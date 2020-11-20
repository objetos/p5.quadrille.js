var myp5 = new p5((p) => {
  const ROWS = 20;
  const COLS = 10;
  const LENGTH = 20;
  var quadrille;
  var board;

  p.setup = function () {
    p.createCanvas(COLS * LENGTH, ROWS * LENGTH);
    board = p.createBoard(ROWS, COLS);
    quadrille = p.createQuadrille([[p.color('cyan'), '👽',                0   ],
                                   [0,               '🤔',               '🙈' ],
                                   [0,                p.color('#770811'), 0  ],
                                   ['g',              'o',                'l' ]
                                  ]);
    this.glue(quadrille, 2, 2);    
  };

  p.draw = function () {
    p.background('#859900');
    //p.drawQuadrille(quadrille, 0, 0, LENGTH);
    p.drawBoard(board, LENGTH);    
  };

  p.keyPressed = function () {
    if (p.keyCode === p.UP_ARROW) {
      q.reflect();
    } else if (p.keyCode === p.DOWN_ARROW) {
      q.rotate();
    }
  };

  p.glue = function (quadrille, row, col) {
    let update = board.add(quadrille, row, col);
    if (update.memoryHitCounter === 0) {
      //board.memory2D = update.quadrille.memory2D;
      board = update.quadrille;
    }    
  };
}, "board");