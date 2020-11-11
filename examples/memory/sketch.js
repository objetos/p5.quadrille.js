const ROWS = 20;
const COLS = 10;
const LENGTH = 20;
var quadrille;
var board;

function setup() {
  createCanvas(COLS * LENGTH, ROWS * LENGTH);
  board = createBoard(ROWS, COLS);
  quadrille = createQuadrille([[color('cyan'), '👽',             0    ],
                               [0,             '🤔',            '🙈' ],
                               [0,             color('#770811'), 0   ],
                               ['g',           'o',             'l'  ]
                              ]);
  glue(quadrille, 2, 2);
}

function draw() {
  background('#060621');
  //drawQuadrille(quadrille, 0, 0, LENGTH);
  drawBoard(board, LENGTH);
}

function glue(quadrille, row, col) {
  let update = board.add(quadrille, row, col);
  if (update.memoryHitCounter === 0) {
    //board.memory2D = update.quadrille.memory2D;
    board = update.quadrille;
  }
}