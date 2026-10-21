---
title: "Quadrille.VERSION"
weight: 3
symbol: VERSION
---

The version string of the build the page is served with — the library's own `VERSION` static, not the p5 pin the sketch loaded. A bug report that names it says exactly which build produced the behaviour.

## Example

```js
'use strict';

function setup() {
  createCanvas(420, 120);
  textFont('monospace');
  noLoop();
}

function draw() {
  background('violet');
  fill('white');
  textSize(24);
  textAlign(CENTER, CENTER);
  text(`p5.quadrille ${Quadrille.VERSION}`, width / 2, height / 2);
}
```
