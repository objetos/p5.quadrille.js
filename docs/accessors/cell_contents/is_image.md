---
title: "isImage(row, col)"
weight: 10
symbol: isImage
---

Returns `true` if the cell at `(row, col)` contains a valid image-related type such as an [image](https://p5js.org/reference/#/p5.Image), [graphics](https://p5js.org/reference/#/p5.Graphics), or [framebuffer](https://p5js.org/reference/#/p5.Framebuffer), or if it is a [video](https://p5js.org/reference/#/p5.MediaElement) element, and `false` otherwise.

## Syntax

> `isImage(row, col)`

## Parameters

| Param | Description                                                                       |
|-------|-----------------------------------------------------------------------------------|
| `row` | Number: row index of the cell to be read `∈` [[0..height]](../../../properties/read_write/height/)  |
| `col` | Number: column index of the cell to be read `∈` [[0..width]](../../../properties/read_write/width/) |

> **Note**
>
> Also available as the static method `Quadrille.isImage(value)`, which takes a `value` instead of a cell position.
