# `drawQuadrille()`

[p5.js](https://p5js.org/) function that draws a `quadrille`.

# Syntax

> `drawQuadrille(quadrille, [{[graphics], [x], [y], [tileDisplay], [imageDisplay], [colorDisplay], [stringDisplay], [numberDisplay], [arrayDisplay], [objectDisplay], [cellLength], [outlineWeight], [outline], [textColor], [textZoom]}])`

# Parameters

| <!-- -->      | <!-- -->                                                                                                |
|---------------|---------------------------------------------------------------------------------------------------------|
| quadrille     | Quadrille: `quadrille` to be drawn                                                                      |
| graphics      | [p5.Graphics](https://p5js.org/reference/#/p5.Graphics): renderer taget default is `this` (main canvas) |
| tileDisplay   | Function: empty cell drawing custom procedure                                                           |
| imageDisplay  | Function: image filled cell drawing custom procedure                                                    |
| colorDisplay  | Function: color filled cell drawing custom procedure                                                    |
| stringDisplay | Function: string filled cell drawing custom procedure                                                   |
| numberDisplay | Function: number filled cell drawing custom procedure                                                   |
| arrayDisplay  | Function: array filled cell drawing custom procedure                                                    |
| objectDisplay | Function: object filled cell drawing custom procedure                                                   |
| x             | Number: upper left quadrille pixel x coordinate default is `0`.                                         |
| y             | Number: upper left quadrille pixel y coordinate default is `0`.                                         |
| cellLength    | Number: edge length in pixels default is `10`                                                           |
| outlineWeight | Number: edge weight defaut is `2`. Use `0` to discard all edges                                         |
| outline       | [p5.Color](https://p5js.org/reference/#/p5.Color) representation: edge color default is `magenta`       |
| textColor     | [p5.Color](https://p5js.org/reference/#/p5.Color) representation: text color default is `cyan`          |
| textZoom      | Number:: text zoom level default is `0.89`                                                              |

> :ToCPrevNext