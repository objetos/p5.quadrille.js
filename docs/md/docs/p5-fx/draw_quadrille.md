# `drawQuadrille()`

[p5.js](https://p5js.org/) function that draws a `quadrille`.

# Syntax

> `drawQuadrille(quadrille, { [x], [y], [cellLength], [outlineWeight], [outline], [board], [min], [max], [alpha] })`

# Parameters

| <!-- -->      | <!-- -->                                                                                             |
|---------------|------------------------------------------------------------------------------------------------------|
| quadrille     | Quadrille: `quadrille` to be drawn                                                                   |
| x             | Number: upper left quadrille x coordinate default is `0`                                             |
| y             | Number: upper left quadrille y coordinate default is `0`                                             |
| cellLength    | Number: edge length in pixels default is `10`                                                        |
| outlineWeight | Number: edge weight defaut is `2`. Use `0` to discard all edges                                      |
| outline       | Number: edge color default is `magenta`                                                              |
| board         | Boolean: draw all cell edges no matter some of them are empty default is `false`                     |
| min           | Number: remap cell grey when its entry is a number from [min, max] to [0, 255] number default is `0` |
| max           | Number: remap cell grey when its entry is a number from [min, max] to [0, 255] number default is `0` |
| alpha         | Number: opacity used when quadrille cell entry is a number default is `255`                          |

> :ToCPrevNext