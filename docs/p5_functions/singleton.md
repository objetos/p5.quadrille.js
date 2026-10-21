---
title: "Quadrille.singleton"
weight: 5
symbol: singleton
---

Declares that one value is meant to be shared by every cell — the whole quadrille holds *the same instance*, not one copy per cell. The call changes nothing: it returns the value untouched, and exists to say so where a reader will look.

`fill(value)` already stores the very same reference in every cell it fills, so `Quadrille.singleton(v)` is a statement of intent rather than a transformation. That intent matters once the value is an object with state: a shared instance means a change made through one cell is visible through all of them, which is what a wall, a counter or a rule object usually wants.

## Example

```js
'use strict';

class Unit {
  constructor(emoji, color) {
    this.emoji = emoji;
    this.color = color;
  }
}

// One instance, shared by every cell the fill touches.
const elf = Quadrille.singleton(new Unit('🧝', '#1c7c68'));

let board;

function setup() {
  createCanvas(6 * Quadrille.cellLength, 4 * Quadrille.cellLength);
  board = createQuadrille(6, 4);
  board.fill(elf);
  // The same reference everywhere — this is the point of the declaration.
  console.assert(board.read(0, 0) === board.read(3, 5));
}

function draw() {
  background('white');
  drawQuadrille(board, {
    objectDisplay: ({ graphics, value, cellLength }) => {
      graphics.fill(value.color);
      graphics.rect(0, 0, cellLength, cellLength);
      graphics.textSize(cellLength * 0.55);
      graphics.textAlign(CENTER, CENTER);
      graphics.text(value.emoji, cellLength / 2, cellLength / 2);
    }
  });
}
```

> **Note**
>
> The opposite is [`Quadrille.factory`](../factory/): a function *run* per cell, so every cell receives its own value. A quadrille filled with a singleton is one object seen many times; a quadrille filled with a factory is many objects.
