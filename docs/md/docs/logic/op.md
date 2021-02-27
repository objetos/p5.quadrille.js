# `OP()`

Static method that returns the quadrille obtained after applying the given logical operator between the two given quadrilles. This method is useful to implement the other _high-level_ logical operators. For instance the [AND](/docs/logic/and) operator is implemented as follows:

```js | p5.quadrille.js
static AND(quadrille1, quadrille2, row=0, col=0) {
  return this.OP(quadrille1, quadrille2,
    (q1, q2) => {
      if (q1 && q2) {
        return q1;
      }
    },
    row, col);
}
```

# Syntax

> `Quadrille.OP(quadrille1, quadrille2, operator, [row], [col])`

# Parameters

| <!-- -->   | <!-- -->                                                                                               |
|------------|--------------------------------------------------------------------------------------------------------|
| quadrille1 | Quadrille: first quadrille                                                                             |
| quadrille2 | Quadrille: second quadrille                                                                            |
| operator   | Function: the function object defining the logical operator                                            |
| row        | Number: `quadrille2` to `quadrille1` vertical displacement default is 0. Negative values are allowed   |
| col        | Number: `quadrille2` to `quadrille1` horizontal displacement default is 0. Negative values are allowed |

> :ToCPrevNext