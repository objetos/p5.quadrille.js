---
title: "createQuadrille(array)"
weight: 5
symbol: createQuadrille
---

The `createQuadrille` function creates a **quadrille** and fills its cells using items from the `array` as the source. The array can contain any combination of [valid JavaScript values](https://www.w3schools.com/js/js_datatypes.asp), with `null` representing empty cells. Holes and explicit `undefined` entries are welcome too — `createQuadrille` copies the array and normalizes them to `null` on entry (raw arrays rendered by `drawQuadrille` are **zero-copy views** that instead alias your array untouched).

## Example

```js
'use strict';
let sb; // Image variable
let quadrille;

async function setup() {
  createCanvas(6 * Quadrille.cellLength, Quadrille.cellLength);
  // Load image
  sb = await loadImage('/images/simon_bolivar_wedding.jpg');
  // Define the quadrille with diverse content
  quadrille = createQuadrille(['hi', 100, null, sb, '🦜', color('red')]);
}

function draw() {
  background('#DAF7A6');
  drawQuadrille(quadrille); // Render the quadrille
}
```

> **Note**
>
> The `createQuadrille(array)` function lets you populate a quadrille with any valid JavaScript values, such as images, colors, and strings, provided in an `array`; for handling these values, see [createQuadrille(jagged_array)](../create_quadrille_jagged_array/).

## Syntax

> `createQuadrille(array)`

## Parameters

| Param | Description                                                                                                                                        |
|-------|----------------------------------------------------------------------------------------------------------------------------------------------------|
| `array` | An array containing any combination of valid JavaScript values. Use `null` to represent empty cells (holes and `undefined` normalize to `null`) |
