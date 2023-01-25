const ROWS = 30;
const COLS = 20;
const LENGTH = 20;
var H, other;
var b, c, d, e;

function setup() {
  createCanvas(COLS * LENGTH, ROWS * LENGTH);
  //c = color('#00FF00');
  b = 'a';
  c = '👽';
  d = color('#00FEFF');
  e = color(255, 0, 0, 255);
  H = createQuadrille([ [c, null, null, e],
                        [c, null, null, b],
                        [c, d, c, b],
                        [c, null, null, e],
                        [c, c, null, e],
                        [c, c, d, e],
                      ]);
  //other = createQuadrille(2, 3);
  //other = createQuadrille(4, 6);
  //other = createQuadrille(8, 12);
  //other.from(1258, color('blue'));
  other =  H.clone();
  other.replace('👽', color(255, 255, 0, 255));
}

function draw() {
  background('#060621');
  drawQuadrille(H, {col: 2, row: 2, cellLength: LENGTH});
  drawQuadrille(other, {col: 2, row: 10, cellLength: LENGTH, board: true});
}