# `OR()`

Static method that returns the quadrille obtained from the *union* of the two given quadrilles.

# Syntax

> `Quadrille.OR(quadrille1, quadrille2, [row], [col])`

# Parameters

| <!-- -->   | <!-- -->                                                                                      |
|------------|-----------------------------------------------------------------------------------------------|
| quadrille1 | Quadrille: first quadrille                                                                    |
| quadrille2 | Quadrille: second quadrille                                                                   |
| row        | Number: `quadrille2` to `quadrille1` vertical displacement[^1]. Negative values are allowed   |
| col        | Number: `quadrille2` to `quadrille1` horizontal displacement[^1]. Negative values are allowed |

[^1]: Default `q2` displacement respect to `q1` is computed either as `col: col2 - col1` and `row = row2 - row1` if both `q1` and `q2` are drawn, or as `0` otherwise. 

> :ToCPrevNext