var myp5 = new p5((p) => {
  const ROWS = 20;
  const COLS = 20;
  const LENGTH = 20;
  var quadrille;
  var clone;

  p.setup = function () {
    p.createCanvas(COLS * LENGTH, ROWS * LENGTH);
    quadrille = p.createQuadrille([[p.color('cyan'), '👽',               0    ],
                                   [0,               '🤔',              '🙈' ],
                                   [0,               p.color('#770811'), 0   ],
                                   ['g',             'o',                'l' ]
                                  ]);
    quadrille.reflect();
    clone = quadrille.clone();
    quadrille.reflect();
  };

  p.draw = function () {
    p.background('#859900');
    p.drawQuadrille(quadrille, 2, 2, LENGTH, 2, 'green');
    p.drawQuadrille(clone, 12, 2, LENGTH, 0);
  };

  p.keyPressed = function () {
    if (p.keyCode === p.LEFT_ARROW) {
      quadrille.reflect();
    } else if (p.keyCode === p.RIGHT_ARROW) {
      quadrille.rotate();
    }
  };
}, "colors");