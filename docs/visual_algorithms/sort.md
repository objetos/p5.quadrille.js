---
title: "sort({options})"
weight: 2
symbol: sort
---

Sort source cells according to their coloring.

> **Warning**
>
> `sort` (like [sample](../sample/)) works in the default **P2D** renderer only — not in `WEBGL`.

## Example

```js
'use strict';
Quadrille.background = 'black';
let ascending;
let source, target;
let array;

async function setup() {
  createCanvas(400, 900);
  array = [];
  for (let i = 1; i <= 13; i++) {
    array.push(await loadImage(`/paintings/p${i}.jpg`));
  }
  array.push(210);
  array.push('🐒');
  array.push(80);
  source = createQuadrille(4, array);
  target = source.clone();
  target.sort();
  ascending = createCheckbox('ascending', true);
  ascending.position(10, height / 2);
  ascending.style('color', 'yellow');
  ascending.input(() => target.sort( { ascending: ascending.checked() }));
}

function draw() {
  background(Quadrille.background);
  drawQuadrille(source);
  drawQuadrille(target, { row: 5 });
}
```

## Syntax

> `sort([{[mode], [target], [ascending], [textColor], [textZoom], [background], [cellLength], [tileDisplay], [imageDisplay], [colorDisplay], [stringDisplay], [numberDisplay], [booleanDisplay], [bigintDisplay], [symbolDisplay], [arrayDisplay], [objectDisplay]}])`

## Parameters

| Param            | Description                                                                                                                                  |
| ---------------- | -------------------------------------------------------------------------------------------------------------------------------------------- |
| `mode`           | String: Either `LUMA`, `AVG`, or `DISTANCE`; default is `LUMA`                                                                               |
| `target`         | [p5.Color](https://p5js.org/reference/#/p5.Color): target color for `DISTANCE` mode; default is [Quadrille.outline](../../p5_functions/draw_quadrille/outline/) |
| `ascending`      | Boolean: sort order; default is `true`                                                                                                       |
| `textColor`      | [p5.Color](https://p5js.org/reference/#/p5.Color): text sampling color; default is [Quadrille.textColor](../../p5_functions/draw_quadrille/text_color/)        |
| `textZoom`       | Number: text zoom level; default is [source.textZoom](../../p5_functions/draw_quadrille/text_zoom/)                                                            |
| `background`     | [p5.Color](https://p5js.org/reference/#/p5.Color): background sampling; default is `Quadrille.background`, which is set to `white`           |
| `cellLength`     | Number: cell sampling length; default is source [width](../../properties/read_write/width/)                                                               |
| `tileDisplay`    | Function: empty cell drawing procedure; default is [Quadrille.tileDisplay](../../p5_functions/draw_quadrille/display_fns/)                                     |
| `imageDisplay`   | Function: drawing procedure for image-filled cells; default is [Quadrille.imageDisplay](../../p5_functions/draw_quadrille/display_fns/)                        |
| `colorDisplay`   | Function: drawing procedure for color-filled cells; default is [Quadrille.colorDisplay](../../p5_functions/draw_quadrille/display_fns/)                        |
| `stringDisplay`  | Function: drawing procedure for string-filled cells; default is [Quadrille.stringDisplay](../../p5_functions/draw_quadrille/display_fns/)                      |
| `numberDisplay`  | Function: drawing procedure for number-filled cells; default is [Quadrille.numberDisplay](../../p5_functions/draw_quadrille/display_fns/)                      |
| `booleanDisplay` | Function: drawing procedure for boolean-filled cells; default is [Quadrille.booleanDisplay](../../p5_functions/draw_quadrille/display_fns/)                    |
| `bigintDisplay`  | Function: drawing procedure for BigInt-filled cells; default is [Quadrille.bigintDisplay](../../p5_functions/draw_quadrille/display_fns/)                      |
| `symbolDisplay`  | Function: drawing procedure for Symbol-filled cells (no default provided)                                                                    |
| `arrayDisplay`   | Function: drawing procedure for array-filled cells (no default provided)                                                                     |
| `objectDisplay`  | Function: drawing procedure for object-filled cells (no default provided)                                                                    |
