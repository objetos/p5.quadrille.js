---
title: "createQuadrille(width, array)"
weight: 6
symbol: createQuadrille
---

The `createQuadrille(width, array)` function creates a **quadrille** with a specified number of columns (`width`) and fills its cells using items from the provided `array`. The items are arranged sequentially across the specified columns, creating one or more rows as needed. The array can contain any combination of [valid JavaScript values](https://www.w3schools.com/js/js_datatypes.asp), with `null` representing empty cells — holes and explicit `undefined` normalize to `null` on entry, and the last row pads with `null` if the array doesn't divide evenly.

## Example

```js
'use strict';
let sb; // Image variable
let quadrille;

async function setup() {
  createCanvas(3 * Quadrille.cellLength, 2 * Quadrille.cellLength);
  // Load image
  sb = await loadImage('/images/simon_bolivar_wedding.jpg');
  // Define the quadrille with diverse content
  quadrille = createQuadrille(3, ['hi', 100, null, sb, '🦜', color('red')]);
}

function draw() {
  background('#DAF7A6');
  drawQuadrille(quadrille); // Render the quadrille
}
```

> **Note**
>
> The `createQuadrille(width, array)` function lets you specify the number of columns (`width`) while filling the quadrille with items from the provided `array`. Items are arranged sequentially into rows, and any `null` values represent empty cells. For handling the values, refer to [createQuadrille(jagged_array)](../create_quadrille_jagged_array/).

## Syntax

> `createQuadrille(width, array)`

## Parameters

| Param | Description                                                                                                                      |
|-----------|--------------------------------------------------------------------------------------------------------------------------------------|
| `width`   | Number: The total number of columns for the quadrille                                                                               |
| `array`   | An array containing any combination of valid JavaScript values. Use `null` to represent empty cells (holes and `undefined` normalize to `null`) |
