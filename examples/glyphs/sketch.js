const ROWS = 20;
const COLS = 10;
const LENGTH = 20;
var t, T, L, Lbit, test;
var quadrille;
var clone;
var x = 2, y = 2;
var c;

function setup() {
  createCanvas(COLS * LENGTH, ROWS * LENGTH);
  c = color('#007ACC');
  quadrille = createQuadrille([[color('cyan'), '👽',             0    ],
                               [0,             '🤔',            '🙈' ],
                               [0,             color('#770811'), 0   ],
                               ['g',           'o',             'l'  ]
                              ]);
  T = createQuadrille([[0, c, 0],
                       [c, c, 0],
                       [0, c, 0],
                      ]);
  L = createQuadrille([ [c, 0, 0],
                        [c, 0, 0],
                        [c, 0, 0],
                        [c, c, c],
                       ]);
  t = createQuadrille(3, 3);
  console.log(t.width, t.height);
  t.from(154, '👽');
  //Lbit = createQuadrille(3, 4);
  //Lbit.from(2343, '👽');
  Lbit = createQuadrille(3, 2343, '👽');
  console.log('Lbit width: ', Lbit.width);
  console.log('Lbit height: ', Lbit.height);
  console.log('Lbit size: ', Lbit.size);
  console.log('L int: ', L.toInt());
  console.log('Lbit int: ', Lbit.toInt());
  quadrille.reflect();
  clone = quadrille.clone();
  clone.reflect();
  test = createQuadrille(4, int(random(1, 1048576)), color('#F0B25A'));

  let letter = 'b';

switch(letter) {
  case 'a':
  case 'A': 
    console.log("Alpha");  // Does not execute
    break;
  case 'b':
  case 'B': 
    console.log("Bravo");  // Prints "Bravo"
    break;
}
}

function draw() {
  background('#060621');
  drawQuadrille(quadrille, x, y, LENGTH, 2, 'green');
  //drawQuadrille(test, x, y, LENGTH, 2, 'green', true);
  //drawQuadrille(clone, 2, 8, LENGTH, 0);
  //drawQuadrille(L, 2, 12, LENGTH);
  //drawQuadrille(Lbit, 2, 12, LENGTH);
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
  if (key === 't') {
    test = createQuadrille(4, int(random(1, 1048576)), color('#F0B25A'));
  }
  if (key === 'd') {
    test.delete(test.height - 1);
  }
  if (key === 'p') {
    console.log(test.toInt());
  }
  if (key === 'r') {
    quadrille.randomize();
  }
}