# `screenRow()`

Returns the quadrille row to which the screen space `pixelY` coordinate belong.

# Syntax

> `screenRow(pixelY)`

> `screenRow(pixelY, y, cellLength)`

# Parameters

| <!-- -->   | <!-- -->                                                                                                 |
|------------|----------------------------------------------------------------------------------------------------------|
| pixelY     | Number: screen space y-coord                                                                             |
| y          | Number: quadrille upper left corner y-coord. If not provided it's value is inferred from `drawQuadrille` |
| cellLength | Number: cell length. If not provided it's value is inferred from `drawQuadrille`                         |

> :ToCPrevNext