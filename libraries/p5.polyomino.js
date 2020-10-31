class Quadrille {
  /**
   * @param {Array} memory[rowIndex][columnIndex]
   */
  constructor(memory) {
    this._memory2D = memory;
  }

  set memory2D(memory) {
    this._memory2D = memory;
  }

  get memory2D() {
    return this._memory2D;
  }

  /**
   * Horizontal reflection
   */
  reflect() {
    this._memory2D.reverse();
  }

  /**
   * π/2 clockwise rotation
   */
  rotate() {
    // credit goes to Nitin Jadhav: https://github.com/nitinja
    // who wrote about it here: https://stackoverflow.com/questions/15170942/how-to-rotate-a-matrix-in-an-array-in-javascript/58668351#58668351
    this._memory2D = this._memory2D[0].map((v, index) => this._memory2D.map(row => row[index]).reverse());
  }

  /**
   * @param {Array} memory buffer[rows][cols] where empty cells are filled with 0
   * @param {number} x memory2D row index
   * @param {number} y memory2D column index
   * @throws 'To far down' and 'To far right' memory2D reading exceptions
   * @returns { Array, number } { buffer, memoryHitCounter } object literal
   */
  update(memory, x, y) {
    let memoryHitCounter = 0;
    // i. clone memory into buffer
    let buffer = memory.map(arr => { return arr.slice(); });
    // ii. fill in buffer with this polyomino
    for (let i = 0; i < this._memory2D.length; i++) {
      // (e1) Check if current polyomino cell is too far down
      if (buffer[x + i] === undefined) {
        throw new Error(`Too far down`);
      }
      for (let j = 0; j < this._memory2D[i].length; j++) {
        // (e2) Check if current polyomino cell is too far right
        if (buffer[x + i][y + j] === undefined) {
          throw new Error(`Too far right`);
        }
        // write only polyomino cells covering (i,j)
        if (this._memory2D[i][j]) {
          // check if returned buffer overrides memory2D
          if (buffer[x + i][y + j] !== 0) {
            memoryHitCounter++;
          }
          buffer[x + i][y + j] = this._memory2D[i][j];
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
  p5.prototype.createQuadrille = function (memory) {
    return new Quadrille(memory);
  };

  p5.prototype.drawQuadrille = function (polyomino, row, col, LENGTH = 10, outlineWeight = 2, outline = 'magenta') {
    push();
    translate(row * LENGTH, col * LENGTH);
    stroke(outline);
    strokeWeight(outlineWeight);
    for (let i = 0; i < polyomino.memory2D.length; i++) {
      for (let j = 0; j < polyomino.memory2D[i].length; j++) {
        // handles both zero and empty (undefined) entries as well
        if (polyomino.memory2D[i][j]) {
          push();
          if (polyomino.memory2D[i][j] instanceof p5.Color) {
            fill(polyomino.memory2D[i][j]);
            rect(j * LENGTH, i * LENGTH, LENGTH, LENGTH);
          }
          else if (typeof polyomino.memory2D[i][j] === 'string') {
            textSize(LENGTH);
            text(polyomino.memory2D[i][j], j * LENGTH, i * LENGTH, LENGTH, LENGTH);
          }
          pop();
        }
      }
    }
    pop();
  }
})();