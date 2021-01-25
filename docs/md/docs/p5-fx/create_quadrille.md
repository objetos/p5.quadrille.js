# `createQuadrille()`

Creates a `quadrille` which may be filled with any combination of zeros (for empty cells), [p5 colors](https://p5js.org/reference/#/p5.Color) and chars, including [emojis](https://emojipedia.org/).

# Syntax

> `createQuadrille(array2D)`

> `createQuadrille(width, height)`

> `createQuadrille(width, bitboard, pattern)`

> `createQuadrille(width, height, order, pattern)`

# Parameters

| <!-- --> | <!-- -->                                                                                                                                                                         |
|----------|----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| array2D  | 2D array which may contain any combination of zeros (for empty cells), [p5 colors](https://p5js.org/reference/#/p5.Color) and chars, including [emojis](https://emojipedia.org/) |
| width    | number of columns                                                                                                                                                                |
| height   | number of rows                                                                                                                                                                   |
| bitboard | a [bitboard](https://en.wikipedia.org/wiki/Bitboard) integer                                                                                                                     |
| order    | number of non-empty cells                                                                                                                                                        |
| pattern  | either a zero (for empty cells), a [p5 color](https://p5js.org/reference/#/p5.Color) or char which may be an [emoji](https://emojipedia.org/)                                    |