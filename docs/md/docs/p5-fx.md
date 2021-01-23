# p5.js quadrille functions

# `createQuadrille(array2D)`

Creates a _filled_ quadrille from a 2D array which may contain any combination of [p5 colors](https://p5js.org/reference/#/p5.Color), chars, [emojis](https://emojipedia.org/) and zeros (for empty cells). [See the examples](#examples).

# `createQuadrille(width, height)`

Creates an initiallly empty quadrille, a _board_, having `width * height` cells. [See the examples](#examples).

# `drawQuadrille(quadrille, row, col)`

Draws the `quadrille` at `(row, col)`. [See the examples](#examples).

# P5 inline code

Create and manipulate some quadrilles.

> :P5 lib1=https://cdn.jsdelivr.net/gh/objetos/p5.quadrille.js/p5.quadrille.min.js, width=200, height=400
>
> const ROWS = 20;
> const COLS = 10;
> const LENGTH = 20;
> var quadrille;
> var clone;
> var x = 2, y = 2;
> 
> function setup() {
>   createCanvas(COLS * LENGTH, ROWS * LENGTH);
>   quadrille = createQuadrille([[color('cyan'), '👽',             0    ],
>                                [0,             '🤔',            '🙈' ],
>                                [0,             color('#770811'), 0   ],
>                                ['g',           'o',             'l'  ]
>                               ]);
>   quadrille.reflect();
>   clone = quadrille.clone();
>   clone.reflect();
> }
> 
> function draw() {
>   background('#060621');
>   drawQuadrille(quadrille, x, y, LENGTH, 2, 'green');
>   drawQuadrille(clone, 2, 8, LENGTH, 0);
> }

note that the above sketch code is included within the markdown itself like this:

```md
> :P5 lib1=https://cdn.jsdelivr.net/gh/objetos/p5.quadrille.js/p5.quadrille.min.js, width=200, height=400
>
> const ROWS = 20;
> const COLS = 10;
> const LENGTH = 20;
> var quadrille;
> var clone;
> var x = 2, y = 2;
> 
> function setup() {
>   createCanvas(COLS * LENGTH, ROWS * LENGTH);
>   quadrille = createQuadrille([[color('cyan'), '👽',             0    ],
>                                [0,             '🤔',            '🙈' ],
>                                [0,             color('#770811'), 0   ],
>                                ['g',           'o',             'l'  ]
>                               ]);
>   quadrille.reflect();
>   clone = quadrille.clone();
>   clone.reflect();
> }
> 
> function draw() {
>   background('#060621');
>   drawQuadrille(quadrille, x, y, LENGTH, 2, 'green');
>   drawQuadrille(clone, 2, 8, LENGTH, 0);
> }
```

> :ToCPrevNext