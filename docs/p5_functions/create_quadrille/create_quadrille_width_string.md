---
title: "createQuadrille(width, string)"
weight: 9
symbol: createQuadrille
---

Creates a quadrille and fills its cells using the characters from the provided `string`. The number of columns is defined by `width`, and the characters are arranged across multiple rows if necessary.

## Example

```js
'use strict';
let quadrille;

function setup() {
  createCanvas(4 * Quadrille.cellLength, 2 * Quadrille.cellLength);
  quadrille = createQuadrille(4, 'hola 👾👽!');
}

function draw() {
  background('orange');
  drawQuadrille(quadrille);
}
```

> **Note**
>
> The `createQuadrille(width, string)` function allows you to control the number of columns (`width`) while filling the quadrille with the characters from the provided `string`. Characters will automatically overflow into additional rows as needed.

## Syntax

> `createQuadrille(width, string)`

## Parameters

| Param    | Description                                                    |
|----------|----------------------------------------------------------------|
| `width`  | Number: The total number of columns for the quadrille          |
| `string` | String: The string used to fill the quadrille cells. Each character occupies one cell |
