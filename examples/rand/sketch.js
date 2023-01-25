const ROWS = 20;
const COLS = 10;
const LENGTH = 20;
var r, T, L;
var quadrille;
var col = 2, row = 2;
var c;

function setup() {
  createCanvas(COLS * LENGTH, ROWS * LENGTH);
  c = color('#007ACC');
  quadrille = createQuadrille([[color('cyan'), '👽'                  ],
                               [null,          '🤔',            '🙈' ],
                               [null,          color('#770811'),     ],
                               ['g',           'o',             'l'  ]
                              ]);
  // 178                            
  T = createQuadrille([[null, c, null],
                       [c,    c],
                       [null, c],
                      ]);
  // 2343
  L = createQuadrille([ [c],
                        [c],
                        [c],
                        [c, c, c],
                       ]);
  console.log(`L bitboard:`, L.toInt());
  console.log(`T bitboard:`, T.toInt());
  //r = createQuadrille(5, 8);
  r = createQuadrille(5, 8, 11, color('yellow'));
  //r = createQuadrille(3, 2343, '👽');
  //r = createQuadrille(3, 178, '👽');
}

function draw() {
  background('#060621');
  drawQuadrille(quadrille, {x: 2 * LENGTH, y: 12 * LENGTH, cellLength: LENGTH, outline: 'green'});
  drawQuadrille(r, {x: col * LENGTH, y: row * LENGTH, cellLength: LENGTH, outline: 'blue', board: true});
}

function keyPressed() {
  if (keyCode === UP_ARROW) {
    r.reflect();
  } else if (keyCode === DOWN_ARROW) {
    r.rotate();
  }
  if (key == 'c') {
    r.clear();
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
  if (key == 'r') {
    r.rand(7, color('red'));
  }
  if (key == 't') {
    //quadrille.rand();
    r.rand(15, color('green'));
  }
}

function debugQuadrille(quadrille) {
  console.log(quadrille.shape);
}
