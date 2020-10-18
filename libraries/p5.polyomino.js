class Polyomino {
  /**
   * @param {Array} shape[rowIndex][columnIndex]
   */
  constructor(shape) {
    this._shape = shape;
  }

  set shape(shape) {
    this._shape = shape;
  }

  get shape() {
    return this._shape;
  }

  /**
   * Horizontal reflection
   */
  reflect() {
    this._shape.reverse();
  }

  /**
   * π/2 clockwise rotation
   */
  rotate() {
    // credit goes to Nitin Jadhav: https://github.com/nitinja
    // who wrote about it here: https://stackoverflow.com/questions/15170942/how-to-rotate-a-matrix-in-an-array-in-javascript/58668351#58668351
    this._shape = this._shape[0].map((v, index) => this._shape.map(row => row[index]).reverse());
  }

  /**
   * @param {Array} memory2D buffer[rows][cols] where empty cells are filled with 0
   * @param {number} x memory2D row index
   * @param {number} y memory2D column index
   * @throws 'To far down' and 'To far right' memory2D reading exceptions
   * @returns { Array, number } { buffer, memoryHitCounter } object literal
   */
  update(memory2D, x, y) {
    let memoryHitCounter = 0;
    // i. clone memory into buffer
    let buffer = memory2D.map(arr => { return arr.slice(); });
    // ii. fill in buffer with this polyomino
    for (let i = 0; i < this._shape.length; i++) {
      // (e1) Check if current polyomino cell is too far down
      if (buffer[x + i] === undefined) {
        throw new Error(`Too far down`);
      }
      for (let j = 0; j < this._shape[i].length; j++) {
        // (e2) Check if current polyomino cell is too far right
        if (buffer[x + i][y + j] === undefined) {
          throw new Error(`Too far right`);
        }
        // write only polyomino squares covering (i,j)
        if (this._shape[i][j]) {
          // check if returned buffer overrides memory2D
          if (buffer[x + i][y + j] !== 0) {
            memoryHitCounter++;
          }
          buffer[x + i][y + j] = this._shape[i][j];
        }
      }
    }
    // iii. return buffer and memory hit counter
    return { buffer, memoryHitCounter };
  }
}

// Details here:
// https://github.com/processing/p5.js/blob/main/contributor_docs/creating_libraries.md
(function () {
  p5.prototype.createPolyomino = function (shape) {
    return new Polyomino(shape);
  };

  p5.prototype.drawPolyomino = function (polyomino, row, col, LENGTH = 10, outlineWeight = 2, outline = 'magenta') {
    push();
    translate(row * LENGTH, col * LENGTH);
    stroke(outline);
    strokeWeight(outlineWeight);
    for (let i = 0; i < polyomino.shape.length; i++) {
      for (let j = 0; j < polyomino.shape[i].length; j++) {
        // handles both zero and empty (undefined) entries as well
        if (polyomino.shape[i][j]) {
          push();
          if (polyomino.shape[i][j] instanceof p5.Color) {
            fill(polyomino.shape[i][j]);
            rect(j * LENGTH, i * LENGTH, LENGTH, LENGTH);
          }
          else if (typeof polyomino.shape[i][j] === 'string') {
            textSize(LENGTH);
            text(polyomino.shape[i][j], j * LENGTH, i * LENGTH, LENGTH, LENGTH);
          }
          pop();
        }
      }
    }
    pop();
  }
})();