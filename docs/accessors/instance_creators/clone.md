---
title: "clone()"
weight: 1
symbol: clone
---

Returns a [shallow copy](https://en.wikipedia.org/wiki/Object_copying#Shallow_copy) of the quadrille.

## Example

(click on canvas and / or press any key)
```js
'use strict';
Quadrille.cellLength = 50;
let quadrille, twin;
let color1, color2;

function setup() {
  createCanvas(650, 300);
  color1 = color('lime');
  color2 = color('tomato');
  quadrille = createQuadrille(6, 6, 18, color1).rand(18, color2);
  twin = quadrille.clone();
}

function draw() {
  background('darkkhaki');
  drawQuadrille(quadrille, { outline: 'white' });
  drawQuadrille(twin, { outline: 'cyan', col: 7 });
}

function mouseClicked() {
  color1.setRed(random(255));
  color1.setGreen(random(255));
  color1.setBlue(random(255));
}

function keyPressed() {
  let color2Update = color(random(255), random(255), random(255));
  twin.replace(color2, color2Update);
  color2 = color2Update;
}
```

> **Note**
>
> **Shallow means cell values are shared references.** Clicking mutates the shared `color1` instance in place — both quadrilles change together, since their cells point at the same object. Pressing a key instead [replace](../../../mutators/replace/replace_value1_value2/)s `color2` in the **twin only** with a fresh instance — the original keeps the old one. Same identity story as [fill(value)](../../../mutators/fill/fill_value/) and strict [search](../../queries/search/).

## Syntax

> `clone()`
