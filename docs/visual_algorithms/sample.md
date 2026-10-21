---
title: "sample({options})"
weight: 3
symbol: sample
---

Sample cell as the `{r, g, b, a, total}` object literal. Used by the [sort](../sort/) algorithm. For instance `LUMA` sorting is [implemented](https://github.com/objetos/p5.quadrille.js/blob/main/src/quadrille.js) as follows:

``` js
// excerpt from sort
let memory1D = this.toArray();
// ...
memory1D.sort((valueA, valueB) => {
  let sa = Quadrille.sample({ value: valueA, background,
                              cellLength, textColor, textZoom });
  let sb = Quadrille.sample({ value: valueB, background,
                              cellLength, textColor, textZoom });
  let wa = 0.299 * sa.r + 0.587 * sa.g + 0.114 * sa.b;
  let wb = 0.299 * sb.r + 0.587 * sb.g + 0.114 * sb.b;
  return wa - wb;
});
```

Use this method to implement other sorting criteria of the `quadrille` cells.

> **Warning**
>
> `sample` (like [sort](../sort/)) works in the default **P2D** renderer only — not in `WEBGL`.

## Syntax

> `sample([{value, imageDisplay, colorDisplay, booleanDisplay, numberDisplay, bigintDisplay, stringDisplay, symbolDisplay, arrayDisplay, objectDisplay, background, cellLength, outlineWeight, outline, textColor, textZoom}])`

## Parameters

| Param            | Description                                                                                                     |
|------------------|-----------------------------------------------------------------------------------------------------------------|
| `value`          | Any valid JavaScript value                                                                                      |
| `imageDisplay`   | Function: image filled cell drawing custom procedure. Default is [Quadrille.imageDisplay](../../p5_functions/draw_quadrille/display_fns/)   |
| `colorDisplay`   | Function: color filled cell drawing custom procedure. Default is [Quadrille.colorDisplay](../../p5_functions/draw_quadrille/display_fns/)   |
| `booleanDisplay` | Function: boolean filled cell drawing custom procedure. Default is [Quadrille.booleanDisplay](../../p5_functions/draw_quadrille/display_fns/) |
| `numberDisplay`  | Function: number filled cell drawing custom procedure. Default is [Quadrille.numberDisplay](../../p5_functions/draw_quadrille/display_fns/)   |
| `bigintDisplay`  | Function: bigint filled cell drawing custom procedure. Default is [Quadrille.bigintDisplay](../../p5_functions/draw_quadrille/display_fns/)   |
| `stringDisplay`  | Function: string filled cell drawing custom procedure. Default is [Quadrille.stringDisplay](../../p5_functions/draw_quadrille/display_fns/)   |
| `symbolDisplay`  | Function: symbol filled cell drawing custom procedure. No static default provided                                 |
| `arrayDisplay`   | Function: array filled cell drawing custom procedure. No static default provided                                 |
| `objectDisplay`  | Function: object filled cell drawing custom procedure. No static default provided                                |
| `background`     | [p5.Color](https://p5js.org/reference/#/p5.Color): background sampling default is `Quadrille.background`, which is set to `white` |
| `cellLength`     | Number: cell sampling length. Default is quadrille [width](../../properties/read_write/width/)                                 |
| `outlineWeight`  | Number: edge weight. Default is [Quadrille.outlineWeight](../../p5_functions/draw_quadrille/outline_weight/). Use `0` to discard all edges |
| `outline`        | [p5.Color](https://p5js.org/reference/#/p5.Color): edge color. Default is [Quadrille.outline](../../p5_functions/draw_quadrille/outline/)       |
| `textColor`      | [p5.Color](https://p5js.org/reference/#/p5.Color): text sampling color. Default is [Quadrille.textColor](../../p5_functions/draw_quadrille/text_color/) |
| `textZoom`       | Number: text zoom level. Default is [Quadrille.textZoom](../../p5_functions/draw_quadrille/text_zoom/)                               |
