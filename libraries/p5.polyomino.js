/**
 * In geometry, the square-tiling, square-tessellation or square-grid is a
 * regular tiling of the Euclidean plane.
 *
 * John Horton Conway called it a quadrille.
 *
 * The internal angle of the square is 90 degrees so four squares at a point make a full 360 degrees.
 * It is one of three regular tilings of the plane. The other two are the triangular-tiling
 * and the hexagonal-tiling.
 *
 * See the [wikipedia square tiling](https://en.wikipedia.org/wiki/Square_tiling) article for details.
 */
class Quadrille {
  /**
   * @param {Array} memory[rowIndex][columnIndex] where empty cells are filled with 0
   */
  constructor() {
    if (arguments.length === 1 && Array.isArray(arguments[0])) {
      this._memory2D = arguments[0];
    }
    if (arguments.length === 2 && typeof arguments[0] === 'number' && typeof arguments[1] === 'number') {
      this._memory2D = Array(arguments[0]).fill().map(() => Array(arguments[1]).fill(0));
    }
  }

  clone() {
    return new Quadrille(this._memory2D.map(arr => { return arr.slice(); }));
  }

  debug() {
    console.log(this._memory2D);
  }

  log(entire = false) {
    for (let i = 0; i < this._memory2D.length; i++) {
      for (let j = 0; j < this._memory2D[i].length; j++) {
        if (this._memory2D[i][j] !== 0 || entire) {
          console.log(i, j, this._memory2D[i][j]);
        }
      }
    }
  }
  
  clear() {
    for (let i = 0; i < this._memory2D.length; i++) {
      for (let j = 0; j < this._memory2D[i].length; j++) {
        this._memory2D[i][j] = 0;
      }
    }
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

  glue(quadrille, row, col) {
    let clone = this.update(quadrille, row, col);
    if (clone.memoryHitCounter === 0) {
      this._memory2D = clone.quadrile.memory2D;
    }
  }

  /**
   * @param {Quadrille} quadrille buffer[rows][cols]
   * @param {number} x memory2D row index
   * @param {number} y memory2D column index
   * @throws 'To far down' and 'To far right' memory2D reading exceptions
   * @returns { Quadrille, number } { quadrille, memoryHitCounter } object literal
   */
  update(quadrille, x, y) {
    let memoryHitCounter = 0;
    // i. clone memory into buffer
    let clonedQuadrile = this.clone();
    // ii. fill in buffer with this polyomino
    for (let i = 0; i < quadrille.memory2D.length; i++) {
      // (e1) Check if current polyomino cell is too far down
      if (clonedQuadrile.memory2D[x + i] === undefined) {
        throw new Error(`Too far down`);
      }
      for (let j = 0; j < quadrille.memory2D[i].length; j++) {
        // (e2) Check if current polyomino cell is too far right
        if (clonedQuadrile.memory2D[x + i][y + j] === undefined) {
          throw new Error(`Too far right`);
        }
        // write only polyomino cells covering (i,j)
        if (quadrille.memory2D[i][j]) {
          // check if returned buffer overrides memory2D
          if (clonedQuadrile.memory2D[x + i][y + j] !== 0) {
            memoryHitCounter++;
          }
          clonedQuadrile.memory2D[x + i][y + j] = quadrille.memory2D[i][j];
        }
      }
    }
    // iii. return buffer and memory hit counter
    return { quadrile: clonedQuadrile, memoryHitCounter };
  }
}

// Details here:
// https://github.com/processing/p5.js/blob/main/contributor_docs/creating_libraries.md
(function () {
  p5.prototype.createQuadrille = function(shape) {
    return new Quadrille(shape);
  };

  p5.prototype.createTableau = function(width, height) {
    return new Quadrille(width, height);
  };

  p5.prototype.drawTableau = function(quadrille, LENGTH = 10, outlineWeight = 2, outline = 'magenta') {
    drawQuadrille(quadrille, 0, 0, LENGTH, outlineWeight, outline);
  }

  p5.prototype.drawQuadrille = function(quadrille, row = 0, col = 0, LENGTH = 10, outlineWeight = 2, outline = 'magenta') {
    push();
    translate(row * LENGTH, col * LENGTH);
    stroke(outline);
    strokeWeight(outlineWeight);
    for (let i = 0; i < quadrille.memory2D.length; i++) {
      for (let j = 0; j < quadrille.memory2D[i].length; j++) {
        // handles both zero and empty (undefined) entries as well
        if (quadrille.memory2D[i][j]) {
          push();
          if (quadrille.memory2D[i][j] instanceof p5.Color) {
            fill(quadrille.memory2D[i][j]);
            rect(j * LENGTH, i * LENGTH, LENGTH, LENGTH);
          }
          else if (typeof quadrille.memory2D[i][j] === 'string') {
            textSize(LENGTH);
            text(quadrille.memory2D[i][j], j * LENGTH, i * LENGTH, LENGTH, LENGTH);
          }
          pop();
        }
      }
    }
    pop();
  }
})();