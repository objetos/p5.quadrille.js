---
title: "drawQuadrille(args)"
weight: 2
symbol: drawQuadrille
---

The `drawQuadrille` function is used to render a quadrille onto the canvas or a specified graphics buffer. It provides various parameters for customizing the appearance and behavior of the drawn quadrille, including cell dimensions, colors, and display styles. It also accepts a raw 1D/2D JS array, wrapped on the fly as a live zero-copy view — see [drawing arrays](drawing_arrays/).

By default, `drawQuadrille(quadrille)` is sufficient for most cases where no custom display parameters are needed, as it uses the quadrille's default properties for rendering. For more advanced use cases, `drawQuadrille(quadrille, { options })` allows you to specify optional display parameters, such as [cellLength](cell_length/), [outline](outline/), [textColor](text_color/), and more, to customize the rendering behavior.

## Configuration

The `drawQuadrille` function simplifies customization by using its `{ options }` [object literal](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/Object_initializer) parameter, leveraging [JavaScript object destructuring](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/Destructuring) to extract values directly. This approach makes function calls more readable, flexible, and maintainable, allowing you to configure only the parameters you need while relying on defaults for the rest.

### Example

```js
drawQuadrille(quadrille, {
  cellLength: 50,   // Custom size for each cell
  outline: 'blue',  // Edge color of the quadrille
  outlineWeight: 2, // Line thickness for the outline
  textColor: 'white', // Color for text inside cells
  textZoom: 0.5,    // Scale the text in cells
});
```

In this example, only these parameters are explicitly configured:
- **`cellLength`**: Specifies the size of each cell in pixels.
- **`outline`**: Sets the edge color of the quadrille.
- **`outlineWeight`**: Defines the thickness of the outline.
- **`textColor`**: Controls the color of any text rendered in the quadrille cells.
- **`textZoom`**: Scales the size of the text rendered in the cells.

The remaining parameters in the `{ options }` object use their default values, making it easier to adjust specific aspects of the quadrille's rendering without needing to pass every option explicitly.

> **Note**
>
> [JavaScript object destructuring](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/Destructuring) allows extracting values directly from objects, improving code clarity and ease of use. This approach provides several benefits:
>
> 1. **Clarity**: Parameters are grouped into a single, descriptive object, making function calls easier to read.
> 2. **Flexibility**: Only the parameters you need are specified, while defaults handle the rest.
> 3. **Order Independence**: Parameters are assigned based on their names, so their order doesn’t matter.
> 4. **Extensibility**: New parameters can be added without breaking existing function calls.

## Syntax

> drawQuadrille(quadrille, [{[[cellLength](cell_length/)], [[outline](outline/)], [[outlineWeight](outline_weight/)], [[textColor](text_color/)], [[textZoom](text_zoom/)], [[textFont](text_font/)], [[x](x_y/)], [[y](x_y/)], [[row](row_col/)], [[col](row_col/)], [[filter](filter_prop/)], [[graphics](graphics/)], [[origin](origin/)], [[options](options/)], [[tileDisplay](display_fns/)], [[stringDisplay](display_fns/)], [[numberDisplay](display_fns/)], [[bigintDisplay](display_fns/)], [[booleanDisplay](display_fns/)], [[colorDisplay](display_fns/)], [[imageDisplay](display_fns/)], [[functionDisplay](display_fns/)], [[arrayDisplay](display_fns/)], [[objectDisplay](display_fns/)], [[symbolDisplay](display_fns/)]}])

## Parameters

| param       | description                                                                                           |
|-----------------|-------------------------------------------------------------------------------------------------------|
| `quadrille`       | Quadrille \| Array: The `quadrille` to be drawn — or a raw 1D/2D array, wrapped on the fly as a live zero-copy view (see [drawing arrays](drawing_arrays/)) |
| [`cellLength`](cell_length/) | Number: Edge length in pixels. Default is [`Quadrille.cellLength`](cell_length/)        |
| [`outline`](outline/) | [p5.Color](https://p5js.org/reference/#/p5.Color): Edge color. Default is [`Quadrille.outline`](outline/) |
| [`outlineWeight`](outline_weight/) | Number: Edge weight. Default is [`Quadrille.outlineWeight`](outline_weight/)            |
| [`textColor`](text_color/) | [p5.Color](https://p5js.org/reference/#/p5.Color): Text color. Default is [`Quadrille.textColor`](text_color/) |
| [`textZoom`](text_zoom/) | Number: Text zoom level. Default is [`Quadrille.textZoom`](text_zoom/)                   |
| [`textFont`](text_font/) | [p5.Font](https://p5js.org/reference/#/p5.Font): Specifies the font used for rendering text in cells. Default is the current p5.js font |
| [`x`](x_y/) | Number: Upper-left quadrille pixel `x`-coordinate. Default is `0`. Takes precedence over `col`          |
| [`y`](x_y/) | Number: Upper-left quadrille pixel `y`-coordinate. Default is `0`. Takes precedence over `row`          |
| [`row`](row_col/) | Number: Upper-left quadrille `row`. Default is `0`                                                      |
| [`col`](row_col/) | Number: Upper-left quadrille `column`. Default is `0`                                                   |
| [`filter`](filter_prop/) | Specifies which cells to draw. All cells are drawn if this parameter is omitted or `undefined`. It can be: <ul><li>a value collection (`Array` or `Set`)</li><li>a predicate function (`value => boolean`)</li><li>an object with optional `value`, `row`, and/or `col` predicates</li></ul> |
| [`graphics`](graphics/) | [p5.Graphics](https://p5js.org/reference/#/p5.Graphics): Renderer target. Default is `this` (main canvas) |
| [`origin`](origin/) | Constant: Defines the reference point for drawing the quadrille. `CORNER` aligns it to the top-left corner of the canvas (default in `P2D`), and `CENTER` aligns it to the center of the canvas (default in `WEBGL`) |
| [`options`](options/) | Object: Forwarded as the sole argument to functions stored in cells and to object cells' `display` methods, carrying `origin` plus the current cell's `row` and `col`. Default is a fresh `{}` per call |
| [`tileDisplay`](display_fns/)[^1] | Function: Renders cell contours. Default is `Quadrille.tileDisplay`                                   |
| [`stringDisplay`](display_fns/) | Function: Renders strings in cells. Default is `Quadrille.stringDisplay`                              |
| [`numberDisplay`](display_fns/) | Function: Renders numbers in cells as grayscale values. Default is `Quadrille.numberDisplay`          |
| [`bigintDisplay`](display_fns/) | Function: Renders BigInt values using `numberDisplay`. Default is `Quadrille.bigintDisplay`           |
| [`booleanDisplay`](display_fns/) | Function: Renders boolean values as ✅ or ❎. Default is `Quadrille.booleanDisplay`                    |
| [`colorDisplay`](display_fns/) | Function: Renders colors in cells. Default is `Quadrille.colorDisplay`                                |
| [`imageDisplay`](display_fns/) | Function: Renders images in cells. Default is `Quadrille.imageDisplay`                                |
| [`functionDisplay`](display_fns/) | Function: Renders functions in cells, in both `P2D` and `WEBGL` (via a framebuffer in `WEBGL`). Default is `Quadrille.functionDisplay` |
| [`arrayDisplay`](display_fns/) | Function: Renders cells filled with arrays. No static default provided                                |
| [`objectDisplay`](display_fns/) | Function: Renders cells filled with objects. No static default provided                               |
| [`symbolDisplay`](display_fns/) | Function: Renders cells filled with symbols. No static default provided                               |

[^1]: The `tileDisplay` parameter allows implementing other [regular tilings](https://en.wikipedia.org/wiki/Euclidean_tilings_by_convex_regular_polygons#Regular_tilings) beyond the default [square tiling](https://en.wikipedia.org/wiki/Square_tiling).
