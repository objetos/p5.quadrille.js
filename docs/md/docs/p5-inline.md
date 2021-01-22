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