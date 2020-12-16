var myp5 = new p5((p) => {
  const ROWS = 20;
  const COLS = 20;
  const LENGTH = 20;
  var quadrille;
  var clone;
  var x = 2, y = 2;

  p.setup = function () {
    p.createCanvas(COLS * LENGTH, ROWS * LENGTH);
    quadrille = p.createQuadrille([[p.color('cyan'), '👽',               0    ],
                                   [0,               '🤔',              '🙈' ],
                                   [0,               p.color('#770811'), 0   ],
                                   ['g',             'o',                'l' ]
                                  ]);
    clone = quadrille.clone();
    clone.reflect();
  };

  p.draw = function () {
    p.background('#007ACC');
    p.drawQuadrille(quadrille, x, y, LENGTH, 2, 'green');
    p.drawQuadrille(clone, 12, 2, LENGTH, 0);
  };

  p.keyPressed = function () {
    if (p.keyCode === p.LEFT_ARROW) {
      quadrille.reflect();
    } else if (p.keyCode === p.RIGHT_ARROW) {
      quadrille.rotate();
    }
    if (p.key === 'a') {
      x = x > 0 ? x - 1 : x;
    }
    if (p.key === 's') {
      x = x < COLS - quadrille.width ? x + 1 : x;
    }
    if (p.key === 'w') {
      y = y > 0 ? y - 1 : y;
    }
    if (p.key === 'z') {
      y = y < ROWS - quadrille.height ? y + 1 : y;
    }
  };
}, "colors");