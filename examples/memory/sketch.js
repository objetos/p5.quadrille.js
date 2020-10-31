const ROWS = 20;
const COLS = 10;
const LENGTH = 20;
var polyomino;
var tableau;

function setup() {
  createCanvas(COLS * LENGTH, ROWS * LENGTH);
  /*
  tableau = Array(ROWS);
  for (let i = 0; i < tableau.length; i++) {
    tableau[i] = Array(COLS);
    for (let j = 0; j < tableau[i].length; j++) {
      tableau[i][j] = 0;
    }
  }
  */
  tableau = createTableau(ROWS, COLS);
  polyomino = createQuadrille([[color('cyan'), '👽',             0    ],
                               [0,             '🤔',            '🙈' ],
                               [0,             color('#770811'), 0   ],
                               ['g',           'o',             'l'  ]
                              ]);
  tableau = polyomino.clone();
}

function draw() {
  background('#060621');
  //drawQuadrille(polyomino, 0, 0, LENGTH);
  //drawQuadrille(tableau, 0, 0, LENGTH);
  drawTableau(tableau, LENGTH);
}