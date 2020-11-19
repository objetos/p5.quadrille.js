const ROWS = 20;
const COLS = 20;
const LENGTH = 20;
var quadrille;
var clone;

function setup() {
  createCanvas(COLS * LENGTH, ROWS * LENGTH);
  quadrille = createQuadrille([[color('cyan'), '👽',             'a'    ],
                               [0,             '🤔',            '🙈' ],
                               [0,             color('#770811'), 0   ],
                               ['g',           'o',             'l'  ]
                              ]);
  quadrille.reflect();
  clone = quadrille.clone();
  quadrille.reflect();
}

function draw() {
  background('#859900');
  drawQuadrille(quadrille, 2, 2, LENGTH, 2, 'red');
  drawQuadrille(clone, 12, 2, LENGTH, 2, 'blue');
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