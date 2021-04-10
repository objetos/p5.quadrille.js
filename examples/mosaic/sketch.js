const ROWS = 10;
const COLS = 10;
const LENGTH = 40;
var quadrille;
var x = 2, y = 2;
var c;
var img1, img2;

function setup() {
  createCanvas(COLS * LENGTH, ROWS * LENGTH);
  c = color('#007ACC');
  img1 = loadImage('mahakala.jpg');
  img2 = loadImage('abraham_lincoln.jpg');

  quadrille = createQuadrille([[color('cyan'), '👽',            img2 ],
                               [0,             img1,            '🙈' ],
                               [0,             color('#770811'), 0   ],
                               ['g',           'o',             'l'  ]
                              ]);
}

function draw() {
  background('#FDF6E3');
  drawQuadrille(quadrille, x, y, LENGTH, 2, 'green');
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
  if (key === 'r') {
    quadrille.randomize();
  }
}