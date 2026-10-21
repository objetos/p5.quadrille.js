---
title: "filter(args)"
weight: 1
symbol: filter
---

Apply [convolution mask](https://en.wikipedia.org/wiki/Kernel_%28image_processing%29) filter either to the whole quadrille or at specific `(row, col)` cell.

> **Note**
>
> Filtering requires **color-valued cells**, i.e., image-pixelated quadrilles as created by [createQuadrille(width, image)](../../p5_functions/create_quadrille/create_quadrille_width_image/) or [createQuadrille(width, image, coherence)](../../p5_functions/create_quadrille/create_quadrille_width_image_coherence/).

## Examples

### filter(mask)

(press **f** to toggle filtered image; **m** to toggle mask display; and, **s** to rescale image)
```js
'use strict';
let scl = 4;
let mask, quadrille, source, target;
let mandrill;
let ramp;
let displayMask;

function update() {
  const displaySource = !quadrille || quadrille === source;
  source = createQuadrille(2 ** scl, mandrill, false);
  target = source.clone();
  target.filter(mask);
  quadrille = displaySource ? source : target;
}

async function setup() {
  createCanvas(512, 512);
  mandrill = await loadImage('/images/mandrill.png');
  mask = createQuadrille([
    [1 / 256, 4 / 256, 6 / 256, 4 / 256, 1 / 256],
    [4 / 256, 16 / 256, 24 / 256, 16 / 256, 4 / 256],
    [6 / 256, 24 / 256, 36 / 256, 24 / 256, 6 / 256],
    [4 / 256, 16 / 256, 24 / 256, 16 / 256, 4 / 256],
    [1 / 256, 4 / 256, 6 / 256, 4 / 256, 1 / 256]]);
  ramp = ({ graphics, value, outline, outlineWeight, cellLength }) => {
    const weightColor = 'magenta';
    const lo = 0.0625;
    const hi = 0.25;
    colorMode(RGB, 255);
    fill(color(red(weightColor), green(weightColor), blue(weightColor),
               map(value, lo, hi, 0, 255)));
    rect(0, 0, cellLength, cellLength);
    Quadrille.tileDisplay({ graphics, outline, outlineWeight, cellLength });
  }
  update();
}

function draw() {
  background('#060621');
  if (displayMask) {
    drawQuadrille(mask, { cellLength: width / mask.width, outline: 'magenta',
                          numberDisplay: ramp });
  } else {
    drawQuadrille(quadrille,
                  { cellLength: 512 / (2 ** scl),
                    outlineWeight: 16 / (2 ** scl),
                    outline: quadrille === source ? 'magenta' : 'cyan' });
  }
}

function keyPressed() {
  if (key === 'f') {
    quadrille = quadrille === source ? target : source;
  }
  if (key === 'm') {
    displayMask = !displayMask;
  }
  if (key === 's') {
    scl = scl < 7 ? scl + 1 : 4;
    update();
  }
}
```

### filter(mask, row, col)

(mouse move to apply filter locally; press **r** to reset filtered image & **s** to rescale it)
```js
'use strict';
let scl = 4;
let mask, quadrille;
let mandrill;
let ramp;

async function setup() {
  createCanvas(512, 512);
  mandrill = await loadImage('/images/mandrill.png');
  mask = createQuadrille([
    [0.0625, 0.125, 0.0625],
    [0.125, 0.25, 0.125],
    [0.0625, 0.125, 0.0625]]);
  ramp = ({ graphics, value, outline, outlineWeight, cellLength }) => {
    const weightColor = 'magenta';
    const lo = 0.0625;
    const hi = 0.25;
    colorMode(RGB, 255);
    fill(color(red(weightColor), green(weightColor), blue(weightColor),
               map(value, lo, hi, 0, 255)));
    rect(0, 0, cellLength, cellLength);
    Quadrille.tileDisplay({ graphics, outline, outlineWeight, cellLength });
  }
  quadrille = createQuadrille(2 ** scl, mandrill, false);
}

function draw() {
  background('#060621');
  drawQuadrille(quadrille, { cellLength: 512 / (2 ** scl),
                             outlineWeight: 16 / (2 ** scl) });
  const halfSize = (mask.width - 1) / 2;
  drawQuadrille(mask, { col: quadrille.mouseCol - halfSize,
                        row: quadrille.mouseRow - halfSize,
                        cellLength: 512 / (2 ** scl),
                        outline: 'green',
                        numberDisplay: ramp });
}

function mouseMoved() {
  quadrille.filter(mask, quadrille.mouseRow, quadrille.mouseCol);
  return false;
}

function keyPressed() {
  if (key === 'r') {
    quadrille = createQuadrille(2 ** scl, mandrill);
  }
  if (key === 's') {
    scl = scl < 7 ? scl + 1 : 4;
    quadrille = createQuadrille(2 ** scl, mandrill);
  }
}
```

## Syntax

> `filter(mask, [row], [col])`

## Parameters

| Param     | Description                                                                                                                      |
|-----------|----------------------------------------------------------------------------------------------------------------------------------|
| `mask`    | Quadrille: quadrille of numbers representing the [convolution mask](https://en.wikipedia.org/wiki/Kernel_%28image_processing%29) |
| `row`     | Number: cell row coordinate, if `undefined` applies filter to the whole     quadrille                                            |
| `col`     | Number: cell col coordinate, if `undefined` applies filter to the whole     quadrille                                            |
