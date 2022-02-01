# `drawQuadrille()`

[p5.js](https://p5js.org/) function that draws a `quadrille`.

# Syntax

> `drawQuadrille(quadrille, [{[graphics], [pixelX], [pixelY], [row], [col], [cellLength], [outlineWeight], [outline], [charColor], [board], [numberColor], [min], [max]}])`

# Parameters

| <!-- -->      | <!-- -->                                                                                                |
|---------------|---------------------------------------------------------------------------------------------------------|
| quadrille     | Quadrille: `quadrille` to be drawn                                                                      |
| graphics      | [p5.Graphics](https://p5js.org/reference/#/p5.Graphics): renderer taget default is `this` (main canvas) |
| row           | Number: upper left quadrille row coordinate default is `0`                                              |
| col           | Number: upper left quadrille col coordinate default is `0`                                              |
| pixelX        | Number: upper left quadrille pixel x coordinate default is `0`. Takes higher precedence than `col`      |
| pixelY        | Number: upper left quadrille pixel y coordinate default is `0`. Takes higher precedence than `row`      |
| cellLength    | Number: edge length in pixels default is `10`                                                           |
| outlineWeight | Number: edge weight defaut is `2`. Use `0` to discard all edges                                         |
| outline       | [p5.Color](https://p5js.org/reference/#/p5.Color) representation: edge color default is `magenta`       |
| charColor     | [p5.Color](https://p5js.org/reference/#/p5.Color) representation: char color default is `cyan`          |
| board         | Boolean: draw all cell edges no matter some of them are empty default is `false`                        |
| numberColor   | [p5.Color](https://p5js.org/reference/#/p5.Color) representation: number color default is `orange`      |
| min           | Number: remap cell alpha when its entry is a number from [min, max] to [0, 255] number default is `0`   |
| max           | Number: remap cell alpha when its entry is a number from [min, max] to [0, 255] number default is `0`   |

> :ToCPrevNext