# p5.polyomino.js

[p5.js](https://p5js.org/) library to play with [polyominos](https://en.wikipedia.org/wiki/Polyomino).

## Polyomino p5.js functions

A polyomino is created from a 2D array `shape` which may contain any combination of [p5 colors](https://p5js.org/reference/#/p5.Color), chars and [emojis](https://emojipedia.org/), using the `createPolyomino` command:

```js
const ROWS = 20;
const COLS = 10;
const LENGTH = 20;
var polyomino;

function setup() {
  createCanvas(COLS * LENGTH, ROWS * LENGTH);
  polyomino = createPolyomino([[color('cyan'), '👽',             0    ],
                               [0,             '🤔',            '🙈' ],
                               [0,             color('#770811'), 0   ],
                               ['g',           'o',             'l'  ]
                              ]);
}
```

note that the `polyomino.shape` [computed property](https://www.w3schools.com/js/js_object_accessors.asp) references the 2D array used to create the `polyomino` instance.

Use `drawPolyomino(polyomino, row, col)` to draw the polyomino:

```js
function draw() {
  background('#060621');
  // the last three params are optional and they set the polyomino
  // length, strokeWeight and stroke visual properties
  drawPolyomino(polyomino, 2, 4, LENGTH, 2, 'green');
}
```

See [this example](https://github.com/nakednous/p5.polyomino.js/blob/master/examples/glyphs/sketch.js).

## Polyomino methods

### `reflect()` and `rotate()`

```js
function keyPressed() {
  if (keyCode === UP_ARROW) {
    polyomino.reflect();
  } else if (keyCode === DOWN_ARROW) {
    polyomino.rotate();
  }
}
```

### `update(memory2D, x, y)`

[Tile-matching videogames](https://en.wikipedia.org/wiki/Tile-matching_video_game) instructions to come...