---
title: "Cell Contents"
weight: 2
---

These methods focus on determining the **value** and **type** of cells at a specific `(row, col)` position:

- **[read(row, col)](read/):** Returns the content of the cell at the specified `row` and `col`.
- **[isValid(row, col)](is_valid/):** Checks if the specified cell at `row` and `col` lies within bounds.
- **[isEmpty(row, col)](is_empty/):** Checks if the specified cell at `row` and `col` is empty.
- **[isFilled(row, col)](is_filled/):** Checks if the specified cell at `row` and `col` contains non-empty content.
- **[isBoolean(row, col)](is_boolean/):** Determines if the specified cell at `row` and `col` contains a boolean.
- **[isNumber(row, col)](is_number/):** Determines if the specified cell at `row` and `col` contains a number.
- **[isBigInt(row, col)](is_bigint/):** Determines if the specified cell at `row` and `col` contains a bigint.
- **[isString(row, col)](is_string/):** Determines if the specified cell at `row` and `col` contains a string.
- **[isColor(row, col)](is_color/):** Checks if the specified cell at `row` and `col` contains a color.
- **[isImage(row, col)](is_image/):** Checks if the specified cell at `row` and `col` contains an image.
- **[isArray(row, col)](is_array/):** Determines if the specified cell at `row` and `col` contains an array.
- **[isFunction(row, col)](is_function/):** Determines if the specified cell at `row` and `col` contains a function.
- **[isObject(row, col)](is_object/):** Determines if the specified cell at `row` and `col` contains an object.
- **[isSymbol(row, col)](is_symbol/):** Determines if the specified cell at `row` and `col` contains a symbol.

## Example

(hover over a cell to view its contents)
```js
'use strict';

let ps; // Image variable
let quadrille;
let yellow, dodgerblue, tomato;
let value; // Checkbox for display toggle

async function setup() {
  createCanvas(6 * Quadrille.cellLength, 4 * Quadrille.cellLength);
  // Load image
  ps = await loadImage('/images/pola.jpg');
  yellow = color('yellow');
  dodgerblue = color('dodgerblue');
  tomato = color('tomato');
  // Quadrille containing cell functions and other content
  quadrille = createQuadrille([
    ['hi', 100, ps, pulse, 150n, { type:'Fiat', model:'500' }],
    [null, yellow, Symbol('id'), ':)'],
    [[0, 1], dodgerblue, true, 255, '😼'],
    [false, tomato, null, 185, '🐲', pulse]
  ]);
  // Method to determine cell type
  quadrille.cellType = function (row, col) {
    if (this.isImage(row, col)) return `image`;
    if (this.isBigInt(row, col)) return `bigint`;
    if (this.isBoolean(row, col)) return `boolean`;
    if (this.isNumber(row, col)) return `number`;
    if (this.isColor(row, col)) return `color`;
    if (this.isFunction(row, col)) return `function`;
    if (this.isObject(row, col)) return `object`;
    if (this.isString(row, col)) return `string`;
    if (this.isArray(row, col)) return `array`;
    if (this.isSymbol(row, col)) return `symbol`;
    if (this.isEmpty(row, col)) return `empty`;
  };
  // Method to determine cell value
  quadrille.cellValue = function (row, col) {
    return this.isFilled(row, col) ? this.read(row, col) : 'null';
  };
  // Create checkbox
  value = createCheckbox('Display Value', false); // Default to false
  value.position(10, height + 10); // Position checkbox
}

function draw() {
  background('black');
  // Draw q1
  drawQuadrille(quadrille);
  // Interactive cell details for quadrille
  displayCellDetails(quadrille);
}

function displayCellDetails(quadrille, offsetX = 0) {
  const row = quadrille.mouseRow;
  const col = quadrille.mouseCol;
  if (quadrille.isValid(row, col)) {
    const x = col * Quadrille.cellLength + offsetX + 5;
    const y = row * Quadrille.cellLength + 15;
    fill('magenta');
    const prefix = `cell(${row}, ${col}) ${value.checked() ? 'value' : 'type'}:`;
    const cellInfo = String(
      value.checked()
        ? quadrille.cellValue(row, col)
        : quadrille.cellType(row, col)
    );
    text(`${prefix}\n${cellInfo}`, x, y);
  }
}

function pulse() {
  const l = Quadrille.cellLength / 2;
  const radius = map(sin(frameCount * 0.1), -1, 1, 5, l);
  noStroke();
  fill('blue');
  circle(l, l, radius);
}
```

> **Note**
>
> - This example builds on the [createQuadrille(jagged_array)](../../p5_functions/create_quadrille/create_quadrille_jagged_array/#example) approach—check it out to understand the foundation.
> - **Dynamic Quadrille Methods**: The `cellType` and `cellValue` methods are appended to the `quadrille` object, allowing runtime customization without requiring subclasses. These methods leverage most of the cell content accessors discussed in this section (`is*` methods for type checking and `read(row, col)` for value retrieval, respectively).
> - **Positioning in `displayCellDetails`**: Text positioning dynamically accounts for canvas centering and padding; abstracting this logic can simplify reuse.
> - **Interactive Features**: A checkbox toggles between displaying cell `type` or `value`, while the `pulse` function provides animated cell feedback.
