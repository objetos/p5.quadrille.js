# `screenCol()`

Returns the quadrille col to which the screen space `pixelX` coordinate belong.

# Syntax

> `screenCol(pixelX)`

> `screenCol(pixelX, x, cellLength)`

# Parameters

| <!-- -->   | <!-- -->                                                                                                 |
|------------|----------------------------------------------------------------------------------------------------------|
| pixelX     | Number: screen space x-coord                                                                             |
| x          | Number: quadrille upper left corner x-coord. If not provided it's value is inferred from `drawQuadrille` |
| cellLength | Number: cell length. If not provided it's value is inferred from `drawQuadrille`                         |

> :ToCPrevNext