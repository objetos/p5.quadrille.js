/**
 * In geometry, the square-tiling, square-tessellation or square-grid is a
 * regular tiling of the Euclidean plane.
 *
 * John Horton Conway called it a quadrille.
 *
 * The internal angle of the square is 90 degrees so four squares at a point
 * make a full 360 degrees. It is one of three regular tilings of the plane.
 * The other two are the triangular-tiling and the hexagonal-tiling.
 *
 * Refer to the [wikipedia square tiling](https://en.wikipedia.org/wiki/Square_tiling)
 * article for details.
 */
class Quadrille {
  /**
   * Constructs either an empty or a filled quadrille:
   * 1. Pass width and heigth to construct and empty quadrille (filled with 0's).
   * 2. Pass a 2D array of p5 colors, chars, emojis and zeros (for empty cells)
   * to construct a filled quadrille. 
   */
  constructor() {
    if (arguments.length === 1 && Array.isArray(arguments[0])) {
      this._memory2D = arguments[0];
    }
    if (arguments.length === 2 && typeof arguments[0] === 'number' && typeof arguments[1] === 'number') {
      this._memory2D = Array(arguments[0]).fill().map(() => Array(arguments[1]).fill(0));
    }
  }

  /**
   * Returns a deep copy of this quadrille. May be used in conjunction with
   * {@link reflect} and {@link rotate} to create different quadrille instances.
   */
  clone() {
    return new Quadrille(this._memory2D.map(x => { return x.slice(); }));
  }
  
  /**
   * Sets all quadrille memory entries to 0.
   */
  clear() {
    this._memory2D = this._memory2D.map(x => x.map( y => y = 0));
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
   * Adds given quadrille to this quadrille at (x,y) and returns the resulted 
   * quadrille together with the number of memory collisions encountered.
   * 
   * This quadrille is not altered by a call to this method.
   * 
   * @param {Quadrille} quadrille buffer[rows][cols]
   * @param {number} x memory2D row index
   * @param {number} y memory2D column index
   * @throws 'To far down' and 'To far right' memory2D reading exceptions
   * @returns { Quadrille, number } { quadrille, memoryHitCounter } object literal
   */
  add(quadrille, x, y) {
    let memoryHitCounter = 0;
    // i. clone this quadrille
    let result = this.clone();
    // ii. fill cloned quadrille with passed quadrille
    for (let i = 0; i < quadrille.memory2D.length; i++) {
      // (e1) Check if current quadrille cell is too far down
      if (result.memory2D[x + i] === undefined) {
        throw new Error(`Too far down`);
      }
      for (let j = 0; j < quadrille.memory2D[i].length; j++) {
        // (e2) Check if current passed quadrille cell is too far right
        if (result.memory2D[x + i][y + j] === undefined) {
          throw new Error(`Too far right`);
        }
        // write only cloned quadrille cells covering (i,j)
        if (quadrille.memory2D[i][j]) {
          // update memory collisions counter if needed
          if (result.memory2D[x + i][y + j] !== 0) {
            memoryHitCounter++;
          }
          result.memory2D[x + i][y + j] = quadrille.memory2D[i][j];
        }
      }
    }
    // iii. return resulted quadrille and memory hit counter
    return { quadrille: result, memoryHitCounter };
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