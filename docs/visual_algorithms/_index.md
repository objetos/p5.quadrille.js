---
title: "Visual Algorithms"
weight: 8
---

The **visual algorithms** suite comprises methods that manipulate and visually represent data within `quadrille` cells. Functions such as [filter](filter/) for image convolutions, [rasterize](rasterize/) for software-based barycentric interpolations, and [sort](sort/) for arranging cells based on visual criteria enable the creation of dynamic and interactive visualizations. These methods collectively transform the quadrille into an interactive canvas for illustrating and navigating visual computing concepts, offering an intuitive way to explore algorithms for rasterization, image processing, and data sorting.

> **Note**
>
> The methods in this section support [method chaining](https://en.wikipedia.org/wiki/Method_chaining). For example:
> ```javascript
> quadrille.filter(mask).rasterize(shader, array);
> ```
> is equivalent to:
> ```javascript
> quadrille.filter(mask);
> quadrille.rasterize(shader, array);
> ```
> This approach enhances readability and streamlines the application of multiple operations.

## Method Overview

- **[filter(mask)](filter/):** Applies a convolution filter to the quadrille using a specified `mask` for image processing operations.
- **[sort(comparator)](sort/):** Rearranges the quadrille’s cells based on visual criteria defined by a `comparator` function.
- **[sample()](sample/):** Samples the quadrille’s cells to create a new quadrille based on specified sampling criteria.
- **[rasterize(shader, array)](rasterize/):** Performs software-based barycentric interpolations, transforming the quadrille's cells based on the provided `shader` function and `array`.
- **[colorize(color0, color1, color2, color3)](colorize/):** Colors the entire `quadrille` by interpolating between the colors specified for each corner—`color0` (upper-left), `color1` (bottom-left), `color2` (upper-right), and `color3` (bottom-right).
- **[rasterizeTriangle(row0, col0, row1, col1, row2, col2, shader, array0, array1 = array0, array2 = array0)](rasterize_triangle/):** Rasterizes a triangle within the `quadrille` defined by the vertices at (`row0`, `col0`), (`row1`, `col1`), and (`row2`, `col2`). It utilizes barycentric coordinates to interpolate attributes specified in `array0`, `array1`, and `array2` across the triangle's surface. The `shader` function, parameterized with an object `{ array: interpolated_data_array, row: i, col: j }`, processes the interpolated data and returns a `p5.Color` for each cell within the triangle.
- **[colorizeTriangle(row0, col0, row1, col1, row2, col2, color0, color1 = color0, color2 = color0)](colorize_triangle/):** Colors the triangle within the `quadrille` defined by the vertices at (`row0`, `col0`), (`row1`, `col1`), and (`row2`, `col2`). It uses barycentric coordinates to interpolate between the specified colors—`color0`, `color1`, and `color2`—assigned to each vertex, creating a smooth gradient effect across the triangle.

The **visual algorithms** suite provides essential tools for working with rasterization, image filtering, sampling, and sorting, allowing you to manipulate cell content dynamically and create visually expressive quadrilles.
