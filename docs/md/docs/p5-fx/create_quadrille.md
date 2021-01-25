# `createQuadrille()`

Creates a `quadrille` which may be filled with any combination of zeros (for empty cells), [p5 colors](https://p5js.org/reference/#/p5.Color) and chars, including [emojis](https://emojipedia.org/).

# Syntax

> `createQuadrille(array2D)`

> `createQuadrille(width, height)`

> `createQuadrille(width, bitboard, pattern)`

> `createQuadrille(width, height, order, pattern)`

# Parameters

| <!-- --> | <!-- -->                                                                                                                                   |
|----------|--------------------------------------------------------------------------------------------------------------------------------------------|
| array2D  | 2D array: containing any combination of 0's (empty cells), [p5 colors](https://p5js.org/reference/#/p5.Color) and chars (1-length strings) |
| width    | Number: total number of columns                                                                                                            |
| height   | Number: total number of rows                                                                                                               |
| bitboard | Number: [bitboard](https://en.wikipedia.org/wiki/Bitboard) [big-endian](https://en.wikipedia.org/wiki/Endianness) integer representation   |
| order    | Number: total number of non-empty cells                                                                                                    |
| pattern  | [p5.Color](https://p5js.org/reference/#/p5.Color) | String | 0: pattern used to fill all the non-empty cells                               |

> :ToCPrevNext