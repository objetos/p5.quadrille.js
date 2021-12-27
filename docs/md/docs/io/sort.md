# `sort()`

Sort quadrille cells according to their coloring.

# Syntax

> `sort([{[mode], [target], [ascending], [charColor], [outline], [background]}])`

# Parameters

| <!-- -->   | <!-- -->                                                                                                  |
|------------|-----------------------------------------------------------------------------------------------------------|
| mode       | String: Either `LUMA`, `AVG`, or `DISTANCE` default is `LUMA`.                                            |
| target     | [p5.Color](https://p5js.org/reference/#/p5.Color) representation: `DISTANCE` mode target color            |
| ascending  | Boolean: sort cells ascending default is true.                                                            |
| charColor  | [p5.Color](https://p5js.org/reference/#/p5.Color) representation: char sampling color default is `black`  |
| background | [p5.Color](https://p5js.org/reference/#/p5.Color) representation: background sampling default is `white`  |
| cellLength | Number: cell sampling length default is quadrille [width](/docs/props#width)                              |

> :ToCPrevNext