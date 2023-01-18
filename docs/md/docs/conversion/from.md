# `from()`

Converts other objects to a `quadrille`. Either an [image](https://p5js.org/reference/#/p5.Image), or 
a [bitboard](https://en.wikipedia.org/wiki/Bitboard) represented as a [big-endian](https://en.wikipedia.org/wiki/Endianness) and [row-major ordering](https://en.wikipedia.org/wiki/Row-_and_column-major_order) integer value.

# Syntax

> `from(image, [coherence])`

> `from(bitboard, pattern)`

# Parameters

| <!-- -->  | <!-- -->                                                                                                                                                            |
|-----------|---------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| image     | [p5.Image](https://p5js.org/reference/#/p5.Image)                                                                                                                   |
| coherence | [boolean]: define whether or not to use spatial coherence to convert image default is false                                                                         |
| bitboard  | number: integer bitboard value                                                                                                                                      |
| pattern   | [p5.Image](https://p5js.org/reference/#/p5.Image) \| [p5.Color](https://p5js.org/reference/#/p5.Color) \| 4-length color array \| 1-length string \| 0: empty cells |

> :ToCPrevNext