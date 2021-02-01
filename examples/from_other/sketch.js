const ROWS = 30;
const COLS = 20;
const LENGTH = 20;
var H, other;
var c, d, e;

function setup() {
  createCanvas(COLS * LENGTH, ROWS * LENGTH);
  c = color('#00FF00');
  d = color('#00FEFF');
  //c = '👽';
  e = [255, 0, 0, 255];
  H = createQuadrille([ [c, 0, 0, e],
                        [c, 0, 0, e],
                        [c, d, c, e],
                        [c, 0, 0, e],
                        [c, c, 0, e],
                        [c, c, d, e],
                      ]);
  other = createQuadrille(2, 3);
  //other = createQuadrille(4, 6);
  //other = createQuadrille(6, 7);
  //other.fromInt(1258, color('blue'));
  other.fromOther(H);
}

function draw() {
  background('#060621');
  drawQuadrille(H,     2, 2, LENGTH, 2);
  drawQuadrille(other, 2, 10, LENGTH, 2);
}