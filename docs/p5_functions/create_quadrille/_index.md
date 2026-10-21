---
title: "createQuadrille(args)"
weight: 1
symbol: createQuadrille
---

The `p5.createQuadrille` method is a [polymorphic](https://en.wikipedia.org/wiki/Ad_hoc_polymorphism) function that generates a [quadrille](https://en.wikipedia.org/wiki/Square_tiling) object. Each cell in a quadrille can hold any [valid JavaScript value](https://www.w3schools.com/js/js_datatypes.asp), such as `numbers`, `strings`, `arrays`, `objects`, `functions`, or `null` (representing an empty cell), including p5-specific types like [p5.Color](https://p5js.org/reference/p5/p5.Color), [p5.Image](https://p5js.org/reference/p5/p5.Image), and [p5.Graphics](https://p5js.org/reference/p5/p5.Graphics). If a cell is created with an `undefined` value — or left as a hole in a sparse array — it is automatically converted to `null` to ensure consistency.

The `p5.createQuadrille` function enforces a key [invariant](https://en.wikipedia.org/wiki/Invariant_(mathematics)#Invariants_in_computer_science): the created quadrille remains a square, matrix-like structure where all rows have the same number of columns, and empty cells are consistently represented as `null`. Drawing a quadrille will be covered separately in [another chapter](../draw_quadrille/).
