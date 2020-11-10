const ROWS = 20;
const COLS = 10;
const LENGTH = 20;
//var emoji = [ '\u{1F984}' ];
//var a = '🙀';
//var a = '🤔';
var a = 'a';
//var emoji = 'o'; //Pick emojis here: https://emojipedia.org/
//var a = '#ff007d';
var b = '#229b32';
var c = '#007acc';
var d = '#b58900';
var e = '#770811';
var f = '#f40202';
var g = '#fdf6e3';

var A;
var B;
var C;
var D;

//var Z = new Polyomino([[a, b, c, 0], [0, d, e, f]]);
var Z;

function setup() {
  createCanvas(COLS * LENGTH, ROWS * LENGTH);

  A = color(a);
  B = color(b);
  C = color(c);
  D = color(d);

  //Z = new Polyomino([[a, b, c, 0], [0, d, e, f]]);
  /*
  Z = createPolyomino([[a, b, 0],
                       [0, c, d]
                      ]);
  */
  Z = createPolyomino([[a, B, 0],
                       [0, C, D]
                      ]);
}

function draw() {
  background('#060621');
  drawPolyomino(Z, 2, 4, LENGTH, 2, 'red');
}

function keyPressed() {
  if (keyCode === UP_ARROW) {
    Z.reflect();
  } else if (keyCode === DOWN_ARROW) {
    Z.rotate();
  }
}

function debugPolyomino(polyomino) {
  console.log(polyomino.shape);
}