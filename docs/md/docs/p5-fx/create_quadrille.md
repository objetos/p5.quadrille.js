# `createQuadrille()`

[p5.js](https://p5js.org/) function that creates a `quadrille` whose individual cells may be defined as numbers (**note** that a zero define an empty cell, see also [filter](/docs/cv/filter)), 4-length color arrays, images (both, [p5.Image](https://p5js.org/reference/#/p5.Image) and [p5.Graphics](https://p5js.org/reference/#/p5.Graphics) instances), colors ([p5.Color](https://p5js.org/reference/#/p5.Color) instances) and strings.

## Syntax

> `createQuadrille(matrix)`

> `createQuadrille(array)`

> `createQuadrille(width, array)`

> `createQuadrille(string)`

> `createQuadrille(width, string)`

> `createQuadrille(width, height)`

> `createQuadrille(width, image, [coherence])`

> `createQuadrille(width, bitboard, pattern)`

> `createQuadrille(width, height, order, pattern)`

## Parameters

| <!-- -->  | <!-- -->                                                                                                                                                                      |
|-----------|-------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| matrix    | 2D array: containing any combination of numbers (0's for empty cells), 4-length color arrays, [p5 colors](https://p5js.org/reference/#/p5.Color) and chars (1-length strings) |
| array     | array: containing any combination of numbers (0's for empty cells), 4-length color arrays, [p5 colors](https://p5js.org/reference/#/p5.Color) and chars (1-length strings)    |
| string    | String: containing any combination of chars                                                                                                                                   |
| width     | Number: total number of columns                                                                                                                                               |
| height    | Number: total number of rows                                                                                                                                                  |
| image     | [p5.Image](https://p5js.org/reference/#/p5.Image) instance                                                                                                                    |
| coherence | [boolean]: define whether or not to use spatial coherence to convert image default is false                                                                                   |
| bitboard  | Number: [bitboard](https://en.wikipedia.org/wiki/Bitboard) [big-endian](https://en.wikipedia.org/wiki/Endianness) integer representation                                      |
| order     | Number: total number of non-empty cells                                                                                                                                       |
| pattern   | [p5.Image](https://p5js.org/reference/#/p5.Image) \| [p5.Color](https://p5js.org/reference/#/p5.Color) \| 4-length color array \| 1-length string \| 0: empty cells           |

> :ToCPrevNext