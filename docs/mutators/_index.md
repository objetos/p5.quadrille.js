---
title: "Mutators"
weight: 5
---

**Mutator methods** allow you to directly modify the state of the `quadrille` they are called upon. These transformations are persistent and update the `quadrille` instance **in-place**.

> **Note**
>
> Methods in this category support [method chaining](https://en.wikipedia.org/wiki/Method_chaining), enabling multiple modifications to be applied sequentially in a concise and readable manner.
>
> For example, the following chained call:
> ```javascript
> quadrille.clear().fill(5, '🐁').randomize();
> ```
> is functionally equivalent to:
> ```javascript
> quadrille.clear();
> quadrille.fill(5, '🐁');
> quadrille.randomize();
> ```

## Method Overview

- **[delete(row)](delete/):** Deletes the specified `row` from the `quadrille`.
- **[insert(row)](insert/):** Inserts an empty `row` into the `quadrille` at the specified position.
- **[shift(dRow, dCol, wrap)](shift/)**: Shifts cells in two dimensions by the row/column offset (dRow, dCol). With wrap on, offsets wrap around the edges.
- **[randomize()](randomize/):** Randomizes the current content of the `quadrille`, shuffling cell values.
- **[maze(value)](maze/):** Clears the `quadrille`, then generates a perfect maze at the current dimensions, filling wall cells with `value`.
- **[rand(args)](rand/):** Randomly populates or empties a specified number of cells in the quadrille.
- **[swap(args)](swap/):** Swaps content between two specified cells or rows as defined by `args`.
- **[replace(args)](replace/):** Replaces cell values in the `quadrille`, either targeting non-empty cells or swapping one value for another.
- **[clear(args)](clear/):** Clears content from the entire `quadrille` or specific cells, depending on `args`.
- **[fill(args)](fill/):** Fills the entire `quadrille` or specific cells with a specified value provided in `args`.

**Mutator methods** offer you a flexible approach to manipulating `quadrille` instances, enabling operations such as deletion, insertion, replacement, and randomization of cell content. With support for method chaining, these transformations can be combined seamlessly to perform complex modifications in a clear and concise manner.
