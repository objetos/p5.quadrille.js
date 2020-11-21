const ROWS = 20;
const COLS = 10;
const LENGTH = 20;
var quadrille;
var clone;

function setup() {
  createCanvas(COLS * LENGTH, ROWS * LENGTH);
  quadrille = createQuadrille([[color('cyan'), '👽',             0    ],
                               [0,             '🤔',            '🙈' ],
                               [0,             color('#770811'), 0   ],
                               ['g',           'o',             'l'  ]
                              ]);
  quadrille.reflect();
  clone = quadrille.clone();
  clone.reflect();
}

function draw() {
  background('#060621');
  drawQuadrille(quadrille, 2, 2, LENGTH, 2, 'green');
  drawQuadrille(clone, 2, 8, LENGTH, 0);
}

function keyPressed() {
  if (keyCode === UP_ARROW) {
    quadrille.reflect();
  } else if (keyCode === DOWN_ARROW) {
    quadrille.rotate();
  }
}

function debugQuadrille(quadrille) {
  console.log(quadrille.shape);
}