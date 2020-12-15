const ROWS = 20;
const COLS = 10;
const LENGTH = 20;
var quadrille;
var clone;
var x = 2, y = 2;

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
  drawQuadrille(quadrille, x, y, LENGTH, 2, 'green');
  drawQuadrille(clone, 2, 8, LENGTH, 0);
}

function keyPressed() {
  if (keyCode === UP_ARROW) {
    quadrille.reflect();
  } else if (keyCode === DOWN_ARROW) {
    quadrille.rotate();
  }
  if (key === 'a') {
    x = x > 0 ? x - 1 : x;
  }
  if (key === 's') {
    x = x < COLS - quadrille.width ? x + 1 : x;
  }
  if (key === 'w') {
    y = y > 0 ? y - 1 : y;
  }
  if (key === 'z') {
    y = y < ROWS - quadrille.height ? y + 1 : y;
  }
}

function debugQuadrille(quadrille) {
  console.log(quadrille.shape);
}