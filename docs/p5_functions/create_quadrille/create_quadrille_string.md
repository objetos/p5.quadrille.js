---
title: "createQuadrille(string)"
weight: 8
symbol: createQuadrille
---

Creates a quadrille and fills its cells using the characters from the provided `string` — one column per character, counted as Unicode code points, so an emoji like `👽` occupies a single cell (even though its UTF-16 `.length` is 2).

## Example

```js
'use strict';
let quadrille;

function setup() {
  createCanvas(6 * Quadrille.cellLength, Quadrille.cellLength);
  quadrille = createQuadrille('hola 👽');
}

function draw() {
  background('orange');
  drawQuadrille(quadrille);
}
```

> **Note**
>
> The `createQuadrille(string)` function fills a quadrille with each character of the provided string, where each column represents one character.

## Syntax

> `createQuadrille(string)`

## Parameters

| Param    | Description                                                    |
|----------|----------------------------------------------------------------|
| `string` | String: The string used to fill the quadrille cells. Each character (Unicode code point) occupies one cell |
