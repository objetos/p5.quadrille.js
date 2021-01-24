# Properties

# `memory2d`

[Computed property](https://www.w3schools.com/js/js_object_accessors.asp) which references the 2D array used to create the `quadrille` instance.

# `width`

Read only property that retrieves the quadrille width.

# `height`

Read only property that retrieves the quadrille height.

# `size`

Read only property that retrieves the quadrille width times the quadrille height.

# `order`

Read only property that retrieves the quadrille non-empty number of cells. See also [magnitude()](/docs/io/magnitude).

# P5 instance mode

Use the *a*, *s*, *w* and *z* keys to move the quadrille:

> :P5 lib1=https://cdn.jsdelivr.net/gh/objetos/p5.quadrille.js/p5.quadrille.js, sketch=/docs/sketches/colors.js, width=400, height=400, version=1.1.8

The markdown of the above sketch looks like this:

```markdown
> :P5 lib1=https://cdn.jsdelivr.net/gh/objetos/p5.quadrille.js/p5.quadrille.js, sketch=/docs/sketches/colors.js, width=400, height=400, version=1.1.8
```

and the `colors.js` [p5 instance mode](https://github.com/processing/p5.js/wiki/Global-and-instance-mode) like this:

```js | colors.js
var myp5 = new p5((p) => {
  const ROWS = 20;
  const COLS = 20;
  const LENGTH = 20;
  var quadrille;
  var clone;
  var x = 2, y = 2;

  p.setup = function () {
    p.createCanvas(COLS * LENGTH, ROWS * LENGTH);
    quadrille = p.createQuadrille([[p.color('cyan'), '👽',               0    ],
                                   [0,               '🤔',              '🙈' ],
                                   [0,               p.color('#770811'), 0   ],
                                   ['g',             'o',                'l' ]
                                  ]);
    clone = quadrille.clone();
    clone.reflect();
  };

  p.draw = function () {
    p.background('#007ACC');
    p.drawQuadrille(quadrille, x, y, LENGTH, 2, 'green');
    p.drawQuadrille(clone, 12, 2, LENGTH, 0);
  };

  p.keyPressed = function () {
    if (p.keyCode === p.LEFT_ARROW) {
      quadrille.reflect();
    } else if (p.keyCode === p.RIGHT_ARROW) {
      quadrille.rotate();
    }
    if (p.key === 'a') {
      x = x > 0 ? x - 1 : x;
    }
    if (p.key === 's') {
      x = x < COLS - quadrille.width ? x + 1 : x;
    }
    if (p.key === 'w') {
      y = y > 0 ? y - 1 : y;
    }
    if (p.key === 'z') {
      y = y < ROWS - quadrille.height ? y + 1 : y;
    }
  };
}, "colors"); // --> the id should be the same file name
```

> :ToCPrevNext