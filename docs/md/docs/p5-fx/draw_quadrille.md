# `drawQuadrille()`

[p5.js](https://p5js.org/) function that draws a `quadrille`.

# Syntax

> `drawQuadrille(quadrille, [{[pixelX], [pixelY], [row], [col], [cellLength], [outlineWeight], [outline], [charColor], [board], [min], [max], [alpha]}])`

# Parameters

| <!-- -->      | <!-- -->                                                                                                      |
|---------------|---------------------------------------------------------------------------------------------------------------|
| quadrille     | Quadrille: `quadrille` to be drawn                                                                            |
| row           | Number: upper left quadrille row coordinate default is `0`                                                    |
| col           | Number: upper left quadrille col coordinate default is `0`                                                    |
| pixelX        | Number: upper left quadrille pixel x coordinate default is `0`. Takes higher precedence than `col`            |
| pixelY        | Number: upper left quadrille pixel y coordinate default is `0`. Takes higher precedence than `row`            |
| cellLength    | Number: edge length in pixels default is `10`                                                                 |
| outlineWeight | Number: edge weight defaut is `2`. Use `0` to discard all edges                                               |
| outline       | [p5.Color](https://p5js.org/reference/#/p5.Color) representation: edge color default is `magenta`             |
| charColor     | [p5.Color](https://p5js.org/reference/#/p5.Color) representation: char color default is `cyan`                |
| board         | Boolean: draw all cell edges no matter some of them are empty default is `false`                              |
| min           | Number: remap cell grey when its entry is a number from [min, max] to [0, 255] number default is `0`          |
| max           | Number: remap cell grey when its entry is a number from [min, max] to [0, 255] number default is `0`          |
| alpha         | Number: opacity used when quadrille cell entry is a number default is `255`                                   |

> :ToCPrevNext