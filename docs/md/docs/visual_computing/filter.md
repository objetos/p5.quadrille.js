# `filter()`

Apply [convolution mask](https://en.wikipedia.org/wiki/Kernel_%28image_processing%29) filter either to the whole quadrille or at specific `(row, col)` cell.

# Syntax

> `filter(mask, [row], [col])`

# Parameters

| <!-- --> | <!-- -->                                                                              |
|----------|---------------------------------------------------------------------------------------|
| mask     | Quadrille: quadrille of numbers representing the convolution mask                     |
| row      | Number: cell row coordinate, default is 0 which applies filter to the whole quadrille |
| col      | Number: cell col coordinate, default is 0 which applies filter to the whole quadrille |

> :ToCPrevNext