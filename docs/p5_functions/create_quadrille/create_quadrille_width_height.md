---
title: "createQuadrille(width, height)"
weight: 3
symbol: createQuadrille
---

Creates an empty quadrille having `width` number of columns and `height` number of rows.

## Example

```js
'use strict';
// quadrille object declaration
let quadrille;

function setup() {
  // Quadrille.cellLength is a constant defining the quadrille
  // cell length default is: 100
  createCanvas(6 * Quadrille.cellLength, 4 * Quadrille.cellLength);
  // quadrille object initialization
  quadrille = createQuadrille(6, 4);
}

function draw() {
  background('violet');
  // to display the quadrille a call to drawQuadrille is needed
  drawQuadrille(quadrille);
}
```

> **Note**
>
> `createQuadrille(width, height)` creates an empty quadrille with the given dimensions. See [fill](../../../mutators/fill/) and [rand](../../../mutators/rand/) for ways to populate it.

## Syntax

> `createQuadrille(width, height)`

## Parameters

| Param    | Description                       |
|----------|-----------------------------------|
| `width`  | Number: total number of columns   |
| `height` | Number: total number of rows      |
