# `visitQuadrille()`

[p5.js](https://p5js.org/) function that visits `quadrille` `cells` executing the `fx` function on each one of them.

## Syntax

> `createQuadrille(quadrille, fx)`

> `createQuadrille(quadrille, fx, cells)`

## Parameters

| <!-- -->      | <!-- -->                                                                           |
|---------------|------------------------------------------------------------------------------------|
| quadrille     | Quadrille: `quadrille` to be visited                                               |
| fx            | function: function of the form `fx(row, col)` to be executed on all visited cells  |
| cells         | array: cells to be visited. All cells are visited if this parameter is `undefined` |

> :ToCPrevNext