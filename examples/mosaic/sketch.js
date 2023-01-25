const ROWS = 10;
const COLS = 10;
const LENGTH = 40;
var quadrille;
var col = 2, row = 2;
var c;
var img1, img2;

function setup() {
  createCanvas(COLS * LENGTH, ROWS * LENGTH);
  c = color('#007ACC');
  img1 = loadImage('mahakala.jpg');
  img2 = loadImage('abraham_lincoln.jpg');

  quadrille = createQuadrille([[color('cyan'), '👽',            img2 ],
                               [null,          img1,            '🙈' ],
                               [null,          color('#770811')      ],
                               ['g',           'o',             'l'  ]
                              ]);
}

function draw() {
  background('#FDF6E3');
  drawQuadrille(quadrille, {x: col * LENGTH, y: row * LENGTH, cellLength: LENGTH, outline: 'green'});
}

function keyPressed() {
  if (keyCode === UP_ARROW) {
    quadrille.reflect();
  } else if (keyCode === DOWN_ARROW) {
    quadrille.rotate();
  }
  if (key === 'a') {
    col = col > 0 ? col - 1 : col;
  }
  if (key === 's') {
    col = col < COLS - quadrille.width ? col + 1 : col;
  }
  if (key === 'w') {
    row = row > 0 ? row - 1 : row;
  }
  if (key === 'z') {
    row = row < ROWS - quadrille.height ? row + 1 : row;
  }
  if (key === 'r') {
    quadrille.randomize();
  }
}