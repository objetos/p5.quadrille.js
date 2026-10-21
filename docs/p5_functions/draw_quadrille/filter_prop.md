---
title: "filter"
symbol: none
weight: 10
---

Filters which cells to draw from a given quadrille `q`. It accepts the following types:

* **A value collection (`Array` or `Set`)**
  Draws only the cells whose values are included in the collection.
  [Example](#example-filtering-by-value-collection):
  `drawQuadrille(q, { filter: [tomato, skyblue] })`

* **A predicate function over the *cell* (`(cell) => boolean`)**
  The function receives `{ row, col, value }` and must return `true` to draw that cell.
  [Example](#example-filtering-by-predicate-value):
  `drawQuadrille(q, { filter: ({ value }) => brightness(value) < 50 })`

* **A single value** (anything that is neither a function nor a collection)
  Draws only the cells whose value matches it by identity (`===`):
  `drawQuadrille(q, { filter: tomato })`

> **Note**
>
> [Arrow functions](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Functions/Arrow_functions) offer a compact syntax. For instance, the predicate
>
> ```js
> function (cell) {
>   return brightness(cell.value) < 50;
> }
> ```
>
> becomes:
>
> ```js
> cell => brightness(cell.value) < 50;
> ```
>
> You can also destructure to focus only on what you need:
>
> ```js
> ({ value }) => brightness(value) < 50;
> ```

## Example: Filtering by Value Collection

(click on canvas and press any key to randomize `q`)
```js
'use strict';
Quadrille.cellLength = 20;
Quadrille.outline = '#FF00FF';
Quadrille.outlineWeight = 1;
let q;
let yellow, skyblue, tomato;
let yellowBox, blueBox, redBox;
let values = [];

function setup() {
  createCanvas(600, 400);
  yellow = color('lemonchiffon');
  skyblue = color('skyblue');
  tomato = color('tomato');
  q = createQuadrille(30, 20).rand(200, yellow).rand(200, skyblue).fill(tomato);
  yellowBox = createCheckbox('Yellow', true).position(10, 10).changed(update);
  blueBox = createCheckbox('Blue', true).position(10, 30).changed(update);
  redBox = createCheckbox('Red', false).position(10, 50).changed(update);
  update();
}

function draw() {
  background(255);
  drawQuadrille(q, { filter: values });
}

function update() {
  values = [];
  yellowBox.checked() && values.push(yellow);
  blueBox.checked() && values.push(skyblue);
  redBox.checked() && values.push(tomato);
}

function keyPressed() {
  q.randomize();
}
```

> **Note**
>
> The `values` array must contain references to the exact instances used to fill the quadrille.
> For example, if `q` was filled with the variable `yellow = color('lemonchiffon')`,
> then `values` must include that same variable, not a new `color('lemonchiffon')`.

## Example: Filtering by Predicate Value

(click on canvas and press any key to randomize `q`)
```js
'use strict';
Quadrille.cellLength = 20;
Quadrille.outline = '#FF00FF';
Quadrille.outlineWeight = 1;

let q;
let select;

const filters = {
  'All':    undefined,
  'Warm':   ({ value }) => red(value) > blue(value),
  'Dark':   ({ value }) => brightness(value) < 50,
  'Gothic': ({ value }) => saturation(value) < 20 && brightness(value) < 60
};

function setup() {
  createCanvas(600, 400);
  q = createQuadrille(30, 20);
  q.visit(({ row, col }) => q.fill(row, col,
                                   color(random(255), random(255), random(255))));
  select = createSelect().position(10, 10);
  for (const label in filters) select.option(label);
}

function draw() {
  background(255);
  drawQuadrille(q, { filter: filters[select.value()] });
}

function keyPressed() {
  q.randomize();
}
```

> **Note**
>
> The method [`q.visit(callback)`](../../../iterators/visit/) iterates over all cells in row-major order,
> invoking `callback({ row, col, value })` for each one.
> Use destructuring (e.g., `{ value }`) when you only need part of the cell.

> **Note**
>
> In JavaScript, `for...in` is used to iterate over *object keys*,
> typically for plain objects like `filters`:
>
> ```js
> for (const label in filters) {
>   select.option(label);
> }
> ```

## Example: Filtering by Predicate Value, Row, and Column

(click on canvas and press any key to randomize `q`)
```js
'use strict';
Quadrille.cellLength = 20;
Quadrille.outline = '#FF00FF';
Quadrille.outlineWeight = 1;

const COLS = 30, ROWS = 20;
let q;
let select;

const filters = {
  'All':          undefined,
  'Even Rows':    ({ row }) => row % 2 === 0,
  'Left Half':    ({ col }) => col < COLS / 2,
  'Cool & Right': ({ value, col }) => blue(value) > red(value) && col >= COLS / 2,
  'Top Warm':     ({ value, row }) => red(value) > blue(value) && row < ROWS / 2
};

function setup() {
  createCanvas(600, 400);
  q = createQuadrille(COLS, ROWS);
  q.visit(({ row, col }) => q.fill(row, col,
                                   color(random(255), random(255), random(255))));
  select = createSelect().position(10, 10);
  for (const label in filters) select.option(label);
}

function draw() {
  background(255);
  drawQuadrille(q, { filter: filters[select.value()] });
}

function keyPressed() {
  q.randomize();
}
```

## Syntax

> `drawQuadrille(quadrille, { filter })`

## Parameters

| Param    | Description                                                                                                                                                                                                                                                                    |
| -------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| `filter` | Specifies which cells to draw. All cells are drawn if omitted or `undefined`. It can be: <ul><li>a **value collection** (`Array` or `Set`) checked by identity (`===`) against `cell.value`</li><li>a **cell-predicate function** `({ row, col, value }) => boolean`</li><li>a **single value** (neither function nor collection), matched by identity (`===`) against `cell.value`</li></ul> |
