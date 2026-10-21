---
title: "search(pattern, strict)"
weight: 3
symbol: search
---

Searches this quadrille for every placement of `pattern` and returns the matches as an array of `{row, col}` upper-left corners — empty on failure, uniformly, with no special cases to test for: the same return convention [path](../path/) follows. Check `hits.length` for success; index `hits[i].row` / `hits[i].col` to use a match.

What counts as a match depends on `strict`:

- **Non-strict** (default): a placement matches when this quadrille is **filled** wherever the `pattern` is filled — values are ignored, only the shape matters.
- **Strict**: the values must additionally be **the same instances** (`===`) — reference identity, not lookalikes.

```js
let shared;
let quadrille, pattern;

function setup() {
  shared = color('blue');           // one instance, stored once, used twice
  quadrille = createQuadrille([125, shared, 'hi']);
  pattern = createQuadrille([shared, 'hi']);
  quadrille.search(pattern, true);  // [{row: 0, col: 1}] — same 'blue' instance
  pattern = createQuadrille([color('blue'), 'hi']);
  quadrille.search(pattern, true);  // [] — a lookalike 'blue' is a different instance
  quadrille.search(pattern);        // [{row: 0, col: 0}, {row: 0, col: 1}] — non-strict: shape only
}
```

Primitives compare by value (`'hi' === 'hi'`), so strict mode bites on objects — colors, images, class instances: two calls to `color('blue')` produce two distinct instances that render identically yet never strict-match. Store a shared instance once (the `shared` variable above) when strict matching is the goal.

## Example

(click cells to edit pattern and quadrille; left / right arrow keys to move to next found hit)\
```js
'use strict';
const COLS = 20, ROWS = 14;
let grid, pattern, board, hint;
let col1 = 7, row1 = 1;
let col2 = 1, row2 = 6;
let colors;
let back, tomatoColor, limeColor, slateblueColor;
let hit = 0, hits;
let mode, strict;

function setup() {
  back = color('darkkhaki');
  tomatoColor = color('tomato');
  limeColor = color('lime');
  slateblueColor = color('slateblue');
  colors = {
    tomato: tomatoColor,
    lime: limeColor,
    slateblue: slateblueColor
  };
  Quadrille.cellLength = 30;
  createCanvas(COLS * Quadrille.cellLength, ROWS * Quadrille.cellLength);
  grid = createQuadrille(COLS, ROWS, COLS * ROWS, back);
  mode = createSelect();
  mode.option('tomato');
  mode.option('lime');
  mode.option('slateblue');
  mode.option('clear');
  mode.selected('clear');
  mode.position(10, height + 15);
  strict = createCheckbox('strict', false);
  strict.position(100, height + 15);
  strict.style('color', 'magenta');
  reset();
  update();
}

function draw() {
  drawQuadrille(grid, { outlineWeight: 0.5 });
  drawQuadrille(pattern, { col: col1, row: row1, outline: 'yellow' });
  drawQuadrille(board, { col: col2, row: row2, outline: 'magenta' });
  if (hits.length > 0) {
    hit = ((hit % hits.length) + hits.length) % hits.length;
    drawQuadrille(hint, {
      row: row2 + hits[hit].row,
      col: col2 + hits[hit].col, outline: 'yellow'
    });
  }
}

function keyPressed({ key, code }) {
  if (hits.length) {
    hit += (code === 'ArrowLeft') ? -1 : (code === 'ArrowRight') ? 1 : 0;
  }
  if (key === 'r' || key === 'R') {
    reset();
    update();
  }
}

function mouseClicked() {
  fillQuadrille(pattern);
  fillQuadrille(board);
  update();
}

function fillQuadrille(quadrille) {
  const row = quadrille.mouseRow;
  const col = quadrille.mouseCol;
  mode.value() === 'clear' ? quadrille.clear(row, col) :
    quadrille.fill(row, col, colors[mode.value()]);
}

function reset() {
  pattern = createQuadrille(int(random(4, 8)), int(random(2, 5)));
  pattern.rand(int(pattern.size * 0.3), tomatoColor);
  board = createQuadrille(18, 7);
  board.rand(30, tomatoColor).rand(30, limeColor).rand(30, slateblueColor);
}

function update() {
  hits = board.search(pattern, strict.checked());
  hint = pattern.clone();
  hint = Quadrille.not(hint, color(red(back), green(back), blue(back), 210));
}
```

> **Note**
>
> - The `reset` function initializes the `pattern` and `board` quadrilles with random sizes and colors. The `pattern` is smaller and random, while the `board` represents the larger search area, containing various colors. This setup is useful for generating new data sets to test the `search` functionality.
> - The `update` function recalculates the matches (stored in the `hits` array) between the `pattern` and the `board` quadrilles. It also creates a `hint` quadrille, which visually highlights the current `pattern` match during navigation. Without `update`, the application would not reflect changes after editing or randomizing quadrilles.

> **Note**
>
> In game code the `hits` array is the whole story: `hits.length` answers *did the pattern occur* (three-in-a-row, a tetromino, a formation), and each `{row, col}` corner places a response — highlight, capture, score — via [fill](../../../mutators/fill/) or a second quadrille drawn at that offset, as the example's `hint` does. [path](../path/) speaks the same dialect for movement: array in hand, empty means no.

## Syntax

> `search(pattern, [strict = false])`

## Parameters

| Param | Description                                                                                                      |
|-----------|------------------------------------------------------------------------------------------------------------------|
| `pattern` | Quadrille: pattern to be searched                                                                                |
| `strict`  | Boolean: If `false` (default), a match only requires filled cells wherever the pattern is filled (shape only); if `true`, values must also be identical instances (`===`) |
