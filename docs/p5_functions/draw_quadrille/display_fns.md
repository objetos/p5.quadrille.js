---
title: "display functions"
weight: 13
---

Display functions determine how quadrille cells are visually rendered based on their values. To disable a specific display function, assign it a value of `0` or `null`.

| Display Function  | Value Type | Default                                                                                                              |
|-------------------|------------|----------------------------------------------------------------------------------------------------------------------|
| `tileDisplay`     | All cells  | `Quadrille.tileDisplay`: Draws cell contours as square tiles                                                         |
| `booleanDisplay`  | Boolean    | `Quadrille.booleanDisplay`: Displays ✓ or ✗ depending on the boolean value                                             |
| `numberDisplay`   | Number     | `Quadrille.numberDisplay`: Renders numbers in cells as grayscale colors, clamped to the range [0..255]              |
| `bigintDisplay`   | BigInt     | `Quadrille.bigintDisplay`: Displays BigInt values using `numberDisplay`                                              |
| `stringDisplay`   | String     | `Quadrille.stringDisplay`: Displays strings in cells                                                                 |
| `colorDisplay`    | Color      | `Quadrille.colorDisplay`: Fills cells with specified [p5.Colors](https://p5js.org/reference/#/p5.Color)              |
| `imageDisplay`    | Image      | `Quadrille.imageDisplay`: Draws images in cells                                                                      |
| `functionDisplay` | Function   | `Quadrille.functionDisplay`: Executes a function to draw the cell, in both P2D and WEBGL (via a framebuffer in WEBGL)                          |
| `arrayDisplay`    | Array      | No static default. It must be explicitly defined if used                                                             |
| `objectDisplay`   | Object     | No static default. It must be explicitly defined if used                                                             |
| `symbolDisplay`   | Symbol     | No static default. It must be explicitly defined if used                                                             |

> **Note**
>
> **Display function parameters**
> The display functions receive an object with the following properties: `{` `quadrille`, [cellLength](../cell_length/), [outline](../outline/), [outlineWeight](../outline_weight/), [textColor](../text_color/), [textZoom](../text_zoom/), [textFont](../text_font/), [graphics](../graphics/), [origin](../origin/), `value`, `row`, `col`, `width`, `height`, [options](../options/) `}`.
> Here, `value` contains the cell content; `row` and `col` indicate the cell’s position; `width` and `height` refer to `quadrille.width` and `quadrille.height`. The [options](../options/) object supports custom parameters and is passed as the sole argument to functions in `functionDisplay`. By default, it includes `origin` (`CORNER` in `P2D`, `CENTER` in `WEBGL`) and the cell’s `row` and `col` coordinates.

> **Note**
>
> **Object fallback rendering**
> When no `objectDisplay` is specified, `drawQuadrille()` attempts to render objects using their `display` field, if defined. If `display` is a string, number, color, or image, the corresponding built-in renderer is used. If it is a function, it is called with the [options](../options/) object only, and with `this` bound to the object itself — so a one-line `display()` method can re-enter the API on its own value, e.g. a stored quadrille drawing itself via `drawQuadrille(this, { cellLength })`: the pattern behind quadrille-of-quadrilles nesting. Arrays are excluded from this mechanism and must be handled explicitly using `arrayDisplay`.

> **Note**
>
> **Shipped display function values**
> Beyond the per-type defaults above, the library ships [Quadrille.thinWall](../thin_wall/) — a value-agnostic display for the thin-wall maze look, installed per draw as any (or all) of the display params together with `tileDisplay: null`.

## Example

```js
'use strict';
let quadrille;
let circled;
let customTile; // Custom tile display for all quadrille cell contours
let customColor; // Custom display for quadrille color cells

function setup() {
  createCanvas(6 * Quadrille.cellLength, 4 * Quadrille.cellLength);
  circled = createCheckbox('circled', true)
    .position(10, 10)
    .style('color', 'magenta');
  customTile = ({ outline, outlineWeight, cellLength }) => {
    noFill();
    stroke(outline);
    strokeWeight(outlineWeight);
    ellipseMode(CORNER);
    circle(0, 0, cellLength);
  };
  customColor = ({ value, cellLength }) => {
    noStroke();
    fill(value);
    ellipseMode(CORNER);
    circle(0, 0, cellLength);
  };
  quadrille = createQuadrille(3, 58n, color('blue'));
}

function draw() {
  background('orange');
  let params = {
    x: mouseX,
    y: mouseY,
    tileDisplay: circled.checked() ? customTile : Quadrille.tileDisplay,
    colorDisplay: circled.checked() ? customColor : Quadrille.colorDisplay
  };
  drawQuadrille(quadrille, params);
}
```

> **Note**
>
> This example overrides the default square tiling by supplying JavaScript [arrow functions](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Functions/Arrow_functions) to `tileDisplay` and `colorDisplay`, causing each quadrille cell to render as a circle.

## Syntax

> `drawQuadrille(quadrille, {tileDisplay, numberDisplay, stringDisplay, colorDisplay, imageDisplay, functionDisplay, arrayDisplay, objectDisplay})`

## Parameters

| Param            | Description                                                                                                |
|------------------|------------------------------------------------------------------------------------------------------------|
| `tileDisplay`[^1]     | Function: Renders cell contours. Default is `Quadrille.tileDisplay`                                   |
| `booleanDisplay`      | Function: Renders boolean values in cells as ✓ or ✗. Default is `Quadrille.booleanDisplay`            |
| `numberDisplay`       | Function: Renders numbers in cells. Default is `Quadrille.numberDisplay`                              |
| `bigintDisplay`       | Function: Renders BigInt values using `numberDisplay`. Default is `Quadrille.bigintDisplay`           |
| `stringDisplay`       | Function: Renders strings in cells. Default is `Quadrille.stringDisplay`                              |
| `colorDisplay`        | Function: Renders colors in cells. Default is `Quadrille.colorDisplay`                                |
| `imageDisplay`        | Function: Renders images in cells. Default is `Quadrille.imageDisplay`                                |
| `functionDisplay`     | Function: Renders functions in cells, in both `P2D` and `WEBGL` (via a framebuffer in `WEBGL`). Default is `Quadrille.functionDisplay` |
| `arrayDisplay`        | Function: Renders cells filled with arrays. No static default provided                                |
| `objectDisplay`       | Function: Renders cells filled with objects. No static default provided                               |
| `symbolDisplay`       | Function: Renders cells filled with symbols. No static default provided                               |

[^1]: The `tileDisplay` function enables the implementation of [regular tilings](https://en.wikipedia.org/wiki/Euclidean_tilings_by_convex_regular_polygons#Regular_tilings) other than the default [square tiling](https://en.wikipedia.org/wiki/Square_tiling).
