---
title: "toImage(args)"
weight: 3
symbol: toImage
---

Returns a [p5.Image](https://p5js.org/reference/#/p5.Image) representation of this quadrille.

## Syntax

> `toImage(filename, [{[filter], [tileDisplay], [imageDisplay], [colorDisplay], [stringDisplay], [numberDisplay], [booleanDisplay], [bigintDisplay], [symbolDisplay], [arrayDisplay], [objectDisplay], [cellLength], [outlineWeight], [outline], [textColor], [textZoom]}])`

## Parameters

| Param            | Description                                                                                               |
|------------------|-----------------------------------------------------------------------------------------------------------|
| `filename`       | String: image name; `png` and `jpg` extensions are supported                                              |
| `tileDisplay`    | Function: empty cell drawing procedure; default is [Quadrille.tileDisplay](../../p5_functions/draw_quadrille/display_fns/)[^1]. Use `0`, `null`, or `undefined` to discard all edges |
| `imageDisplay`   | Function: drawing procedure for cells containing a [p5.Image](https://p5js.org/reference/#/p5.Image); default is [Quadrille.imageDisplay](../../p5_functions/draw_quadrille/display_fns/) |
| `colorDisplay`   | Function: drawing procedure for cells containing [p5.Color](https://p5js.org/reference/#/p5.Color); default is [Quadrille.colorDisplay](../../p5_functions/draw_quadrille/display_fns/) |
| `stringDisplay`  | Function: drawing procedure for string-filled cells; default is [Quadrille.stringDisplay](../../p5_functions/draw_quadrille/display_fns/) |
| `numberDisplay`  | Function: drawing procedure for number-filled cells; default is [Quadrille.numberDisplay](../../p5_functions/draw_quadrille/display_fns/) |
| `booleanDisplay` | Function: drawing procedure for boolean-filled cells; default is [Quadrille.booleanDisplay](../../p5_functions/draw_quadrille/display_fns/) |
| `bigintDisplay`  | Function: drawing procedure for BigInt-filled cells; default is [Quadrille.bigintDisplay](../../p5_functions/draw_quadrille/display_fns/) |
| `symbolDisplay`  | Function: drawing procedure for Symbol-filled cells (no default provided)                                  |
| `arrayDisplay`   | Function: drawing procedure for array-filled cells (no default provided)                                   |
| `objectDisplay`  | Function: drawing procedure for object-filled cells (no default provided)                                  |
| `filter`         | Function, Set, or Array: selects which cells to export; see [`iterators`](../../iterators/) for accepted filter types |
| `cellLength`     | Number: edge length in pixels; default is [Quadrille.cellLength](../../p5_functions/draw_quadrille/cell_length/)               |
| `outlineWeight`  | Number: edge weight; default is [Quadrille.outlineWeight](../../p5_functions/draw_quadrille/outline_weight/)                   |
| `outline`        | [p5.Color](https://p5js.org/reference/#/p5.Color): edge color; default is [Quadrille.outline](../../p5_functions/draw_quadrille/outline/) |
| `textColor`      | [p5.Color](https://p5js.org/reference/#/p5.Color): text color; default is [Quadrille.textColor](../../p5_functions/draw_quadrille/text_color/) |
| `textZoom`       | Number: text zoom level; default is [Quadrille.textZoom](../../p5_functions/draw_quadrille/text_zoom/)                         |

[^1]: This function allows implementing other [regular tilings](https://en.wikipedia.org/wiki/Euclidean_tilings_by_convex_regular_polygons#Regular_tilings) different from the default [square tiling](https://en.wikipedia.org/wiki/Square_tiling).
