const ROWS = 40;
const COLS = 40;
const LENGTH = 20;
var quadrille, i, I;
var x = 2, y = 2;
var c;
var img;

function preload() {
  img = loadImage('abraham_lincoln.jpg');
}

function setup() {
  createCanvas(COLS * LENGTH, ROWS * LENGTH);
  c = color('#007ACC');
  I = createQuadrille(20, 20);
  quadrille = createQuadrille([[color('cyan'), '👽',             [0, 0, 255]    ],
                               [0,             '🤔',            '🙈' ],
                               [0,             color('#770811'), 0   ],
                               ['g',           'o',             'l'  ]
                              ]);
  I.fromImage(img);
  i = createQuadrille(7, img);
  console.log(Quadrille.version);
}

function draw() {
  //background('#060621');
  background(color([0, 255, 0]));
  //drawQuadrille(quadrille, x, y, LENGTH, 2, 'green');
  drawQuadrille(i, x, y, LENGTH, 2, 'green');
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
