---
title: "crop(row, col, width, height, wrap)"
weight: 3
symbol: crop
---

Returns the rectangular **region** anchored at `(row, col)` as a **new quadrille**.

* `width > 0` grows **right**, `width < 0` grows **left**.
* `height > 0` grows **down**, `height < 0` grows **up**.
* If either `width` or `height` is `0` (or non-finite), a warning is issued and `undefined` is returned.
* If `wrap` is `true`, indices wrap toroidally at the borders; when `false` (default), out-of-bounds area is taken as empty.
* Otherwise the result is always a quadrille of size `|width| × |height|`.

## Example

(click on canvas, move the mouse, and press the arrow keys)
```js
'use strict';

Quadrille.cellLength = 20;
let quadrille, cropped, hint;
let w = -3, h = 3;
let lime, olive, yellow, fuchsia;
let wrap;

function setup() {
  createCanvas(400, 200);
  lime = color('lime');
  yellow = color('yellow');
  olive = color('olive');
  fuchsia = color('fuchsia');
  quadrille = createQuadrille(10, 10, 25, lime);
  quadrille.rand(20, olive).rand(30, yellow).fill(fuchsia);
  wrap = createCheckbox(' wrap', false);
  wrap.position(400 - 70, 200 - 22);
  wrap.changed(() => update());
  update();
}

function draw() {
  background('coral');
  // Base quadrille (left)
  drawQuadrille(quadrille, { outline: 'white', row: 0, col: 0 });
  const row = quadrille.mouseRow;
  const col = quadrille.mouseCol;
  // Hint rectangle (only if defined)
  if (hint) {
    const absW = Math.abs(w), absH = Math.abs(h);
    const top  = (h >= 0 ? row : row - (absH - 1));
    const left = (w >= 0 ? col : col - (absW - 1));
    drawQuadrille(hint, { outline: 'cyan', row: top, col: left });
  }
  // Cropped preview on the right (only if defined)
  if (cropped) {
    drawQuadrille(cropped, { outline: 'cyan', row: 0, col: 11 });
  }
  noStroke();
  fill(0);
  text(`w ${w}  h ${h}`, 210, 195);
}

function mouseMoved() {
  update();
}

function keyPressed() {
  if (key === 'ArrowLeft')  w--;
  else if (key === 'ArrowRight') w++;
  else if (key === 'ArrowUp')    h--;
  else if (key === 'ArrowDown')  h++;
  update();
  return false; // prevent page scroll
}

function update() {
  const row = quadrille.mouseRow;
  const col = quadrille.mouseCol;
  // If either dimension is zero, skip drawing both hint and result
  if (w === 0 || h === 0) {
    hint = undefined;
    cropped = undefined;
    return;
  }
  // Keep the hint sized to |w| × |h|
  hint = createQuadrille(Math.abs(w), Math.abs(h));
  // Crop; region cells out of bounds are taken as empty (or wrapped)
  cropped = quadrille.crop(row, col, w, h, wrap.checked());
}
```

## Syntax

> `crop(row, col, width, height, [wrap = false])`

## Parameters

| Param    | Description                                                                  |
| -------- | ---------------------------------------------------------------------------- |
| `row`    | Number: anchor row (the starting cell’s row)                                 |
| `col`    | Number: anchor column (the starting cell’s column)                           |
| `width`  | Number: rectangle width; `> 0` to the right, `< 0` to the left; `0` disables |
| `height` | Number: rectangle height; `> 0` downward, `< 0` upward; `0` disables         |
| `wrap`   | Boolean: when `true` , indices wrap toroidally at borders; when `false` (default), out-of-bounds cells are taken as empty |
