const ROWS = 20;
const COLS = 10;
const LENGTH = 20;
var polyomino;
var tableau;

function setup() {
  createCanvas(COLS * LENGTH, ROWS * LENGTH);
  tableau = Array(ROWS);
  for (let i = 0; i < tableau.length; i++) {
    tableau[i] = Array(COLS);
    for (let j = 0; j < tableau[i].length; j++) {
      tableau[i][j] = 0;
    }
  }
  polyomino = createPolyomino([[color('cyan'), '👽',             0    ],
                               [0,             '🤔',            '🙈' ],
                               [0,             color('#770811'), 0   ],
                               ['g',           'o',             'l'  ]
                              ]);
  glue(polyomino, 4, 2);
}

function draw() {
  background('#060621');
  drawTableau();
}

function drawTableau() {
  for (let i = 0; i < tableau.length; i++) {
    for (let j = 0; j < tableau[i].length; j++) {
      if (tableau[i][j] !== 0) {
        push();
        translate(j * LENGTH, i * LENGTH);
        if (tableau[i][j] instanceof p5.Color) {
          fill(tableau[i][j]);
          rect(0, 0, LENGTH, LENGTH);
        }
        else if (typeof tableau[i][j] === 'string') {
          stroke('red');
          textSize(LENGTH);
          text(tableau[i][j], 0, 0, LENGTH, LENGTH);
        }
        pop();
      }
    }
  }
}

function glue(polyomino, row, col) {
  tableau = polyomino.update(tableau, row, col).buffer;
}

function update(polyomino, row, col) {
  return polyomino.update(tableau, row, col);
}

function printTableau(entire = false) {
  printMatrix(tableau, entire);
}

function printMatrix(matrix, entire = false) {
  for (let i = 0; i < matrix.length; i++) {
    for (let j = 0; j < matrix[i].length; j++) {
      if (matrix[i][j] !== 0 || entire) {
        console.log(i, j, matrix[i][j]);
      }
    }
  }
}

function clearTableau() {
  for (let i = 0; i < tableau.length; i++) {
    for (let j = 0; j < tableau[i].length; j++) {
      tableau[i][j] = 0;
    }
  }
}

function debugPolyomino(polyomino) {
  console.log(polyomino.shape);
}