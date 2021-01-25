 /***************************************************************************************
 * p5.quadrille.js
 * Copyright (c) 2021 Universidad Nacional de Colombia
 * @author Jean Pierre Charalambos, https://github.com/objetos/p5.quadrille.js/
 * Released under the terms of the GPLv3, refer to: http://www.gnu.org/licenses/gpl.html
 * 
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
 ***************************************************************************************/

class Quadrille {
  /**
   * @param {Quadrille} quadrille1 
   * @param {Quadrille} quadrille2 
   * @param {number} row respect to quadrille1 origin
   * @param {number} col respect to quadrille1 origin
   * @returns {Quadrille} the smallest Quadrille obtained after applying a logic AND operation on the two given quadrilles.
   */
  static AND(quadrille1, quadrille2, row=0, col=0) {
    return this.OP(quadrille1, quadrille2,
      (q1, q2) => {
        if (q1 && q2) {
          return q1;
        }
      },
      row, col);
  }

  /**
   * @param {Quadrille} quadrille1 
   * @param {Quadrille} quadrille2 
   * @param {number} row respect to quadrille1 origin
   * @param {number} col respect to quadrille1 origin
   * @returns {Quadrille} the smallest Quadrille obtained after applying a logic OR operation on the two given quadrilles.
   */
  static OR(quadrille1, quadrille2, row=0, col=0) {
    return this.OP(quadrille1, quadrille2,
      (q1, q2) => {
        if (q1) {
          return q1;
        }
        if (q2) {
          return q2;
        }
      },
      row, col);
  }

  /**
   * @param {Quadrille} quadrille1 
   * @param {Quadrille} quadrille2 
   * @param {number} row respect to quadrille1 origin
   * @param {number} col respect to quadrille1 origin
   * @returns {Quadrille} the smallest Quadrille obtained after applying a logic XOR operation on the two given quadrilles.
   */
  static XOR(quadrille1, quadrille2, row=0, col=0) {
    return this.OP(quadrille1, quadrille2,
      (q1, q2) => {
        if (q1 && !q2) {
          return q1;
        }
        if (!q1 && q2) {
          return q2;
        }
      },
      row, col);
  }

  /**
   * @param {Quadrille} quadrille1 
   * @param {Quadrille} quadrille2 
   * @param {number} row respect to quadrille1 origin
   * @param {number} col respect to quadrille1 origin
   * @returns {Quadrille} the smallest Quadrille obtained after applying a logic DIFF operation on the two given quadrilles.
   */
  static DIFF(quadrille1, quadrille2, row=0, col=0) {
    return this.OP(quadrille1, quadrille2,
      (q1, q2) => {
        if (q1 && !q2) {
          return q1;
        }
      },
      row, col);
  }

  /**
   * @param {Quadrille} quadrille 
   * @param {p5.Color | string} pattern used to fille the returned quadrille.
   * @returns {Quadrille} the Quadrille obtained after applying a logic NEG operation on the given quadrille.
   */
  static NEG(quadrille, pattern) {
    let result = new Quadrille(quadrille.width, quadrille.height);
    for (let i = 0; i < quadrille.height; i++) {
      for (let j = 0; j < quadrille.width; j++) {
        if (!quadrille.memory2D[i][j]) {
          result.memory2D[i][j] = pattern;
        }
      }
    }
    return result;
  }

  /**
   * @param {Quadrille} quadrille1 
   * @param {Quadrille} quadrille2 
   * @param {Function} operator function implementing the logic operator.
   * @param {number} row respect to quadrille1 origin
   * @param {number} col respect to quadrille1 origin
   * @returns {Quadrille} the smallest Quadrille obtained after applying the logic operator on the two given quadrilles.
   */
  static OP(quadrille1, quadrille2, operator, row=0, col=0) {
    // i. create resulted quadrille
    let quadrille = new Quadrille(col < 0 ? Math.max(quadrille2.width,  quadrille1.width - col) : Math.max(quadrille1.width,  quadrille2.width + col),
                                  row < 0 ? Math.max(quadrille2.height, quadrille1.height - row) : Math.max(quadrille1.height, quadrille2.height + row));
    // ii. fill result with passed quadrilles
    for (let i = 0; i < quadrille.memory2D.length; i++) {
      for (let j = 0; j < quadrille.memory2D[i].length; j++) {
        let result = operator(quadrille1.read(row < 0 ? i + row : i, col < 0 ? j + col : j), quadrille2.read(row > 0 ? i - row : i, col > 0 ? j - col : j));
        if (result) {
          quadrille.memory2D[i][j] = result;
        }
      }
    }
    // iii. return resulted quadrille
    return quadrille;
  }

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
      this._memory2D = Array(arguments[1]).fill().map(() => Array(arguments[0]).fill(0));
    }
  }

  set memory2D(memory) {
    this._memory2D = memory;
  }

  get memory2D() {
    return this._memory2D;
  }

  get width() {
    return this._memory2D[0] ? this._memory2D[0].length : 0;
  }

  get height() {
    return this._memory2D.length;
  }

  /**
   * Fills quadrille cells with given pattern. Either current filled cells (fill(pattern)),
   * a whole given row (fill(row, pattern)) or a given cell (fill(row, col, pattern).
   * Pattern may be either a p5.Color or a string.
   */
  fill() {
    if (arguments.length === 1) {
      for (let i = 0; i < this.height; i++) {
        for (let j = 0; j < this.width; j++) {
          if (this.memory2D[i][j]) {
            this.memory2D[i][j] = arguments[0];
          }
        }
      }
    }
    if (arguments.length === 2 && typeof arguments[0] === 'number') {
      if (arguments[0] >= 0 && arguments[0] < this.height) {
        this.memory2D[arguments[0]].fill(arguments[1]);
      }
    }
    if (arguments.length === 3 && typeof arguments[0] === 'number' && typeof arguments[1] === 'number') {
      if (arguments[0] >= 0 && arguments[0] < this.height && arguments[1] >= 0 && arguments[1] < this.width) {
        this.memory2D[arguments[0]][arguments[1]] = arguments[2];
      }
    }
  }

  /**
   * @param {number} row 
   * @param {number} col 
   * @param {p5.Color | string} quadrille entry
   */
  read(row, col) {
    if (row >= 0 && row < this.height && col >= 0 && col < this.width) {
      return this.memory2D[row][col];
    }
  }

  /**
   * @param {number} row.
   * @returns {number} Number of non-empty quadrille cells at row.
   */
  magnitude(row) {
    let result = 0;
    for (let j = 0; j < this.width; j++) {
      if (this.memory2D[row][j]) {
        result++;
      }
    }
    return result;
  }

  /**
   * @returns {number} Number of non-empty queadrille cells.
   */
  get order() {
    let result = 0;
    for (let i = 0; i < this.height; i++) {
      for (let j = 0; j < this.width; j++) {
        if (this.memory2D[i][j]) {
          result++;
        }
      }
    }
    return result;
  }

  /**
   * Same as width * height.
   */
  get size() {
    return this.width * this.height;
  }

  /**
   * @returns {number} Quadrille int representation using big-endian and row-major ordering
   * of the memory2D entries.
   */
  toInt() {
    let result = 0;
    for (let i = 0; i < this.height; i++) {
      for (let j = 0; j < this.width; j++) {
        if (this.memory2D[i][j]) {
          result += Math.pow(2, this.width * (this.height - i) - (j + 1));
        }
      }
    }
    return result;
  }

  /**
   * Fills the quadrille memory2D entries using big-endian and row-major ordering from the integer value.
   * @param {number} value 
   * @param {p5.Color | string} fill 
   * @throws 'Value is to high to fill quadrille' reading exception
   */
  fromInt(value, fill) {
    let length = this.width * this.height;
    if (value.toString(2).length > length) {
      throw new Error(`Value is to high to fill quadrille`);
    }
    for (let i = 0; i <= length - 1; i++) {
      if ((value & (1 << length - 1 - i))) {
        this.memory2D[this._fromIndex(i).row][this._fromIndex(i).col] = fill;
      }
    }
  }

  // TODO perlin noise is missed

  rand(order, pattern) {
    order = Math.abs(order);
    if (order > this.size) {
      order = this.size;
    }
    let _disorder = this.order;
    if (order > _disorder) {
      let counter = 0;
      while (counter < order - _disorder) {
        let _ = this._fromIndex(Math.floor(Math.random() * this.size));
        if (!this.memory2D[_.row][_.col]) {
          this.memory2D[_.row][_.col] = pattern;
          counter++;
        }
      }
    }
    if (order < _disorder) {
      let counter = 0;
      while (counter < _disorder - order) {
        let _ = this._fromIndex(Math.floor(Math.random() * this.size));
        if (this.memory2D[_.row][_.col]) {
          this.memory2D[_.row][_.col] = 0;
          counter++;
        }
      }
    }
  }

  _fromIndex(index, width = this.width) {
    return {row: (index / width) | 0, col: index % width};
  }

  _toIndex(row, col, width = this.width) {
    return row * width + col;
  }

  /**
   * 
   * @param {number} row 
   */
  insert(row) {
    this.memory2D.splice(row, 0, Array(this.width).fill(0));
  }

  /**
   * @param {number} row 
   */
  delete(row) {
    if (this.height > 1 && row >= 0 && row < this.height) {
      this.memory2D.splice(row, 1);
    }
  }

  /**
   * Fill this quadrille memory entries with 0's. Pass number to clear
   * only the given row. Pass no params to clear all the quadrille.
   */
  clear() {
    if (arguments.length === 0) {
      this._memory2D = this._memory2D.map(x => x.map(y => y = 0));
    }
    if (arguments.length === 1 && typeof arguments[0] === 'number') {
      this.memory2D[arguments[0]].fill(0);
    }
  }

  /**
   * Horizontal reflection.
   */
  reflect() {
    this._memory2D.reverse();
  }

  /**
   * Transpose the quadrille.
   */
  transpose() {
    // credit goes to Fawad Ghafoor
    // who wrote about it here: https://stackoverflow.com/questions/17428587/transposing-a-2d-array-in-javascript
    this._memory2D = this._memory2D[0].map((_, i) => this._memory2D.map(row => row[i]));
  }

  /**
   * π/2 clockwise rotation.
   */
  rotate() {
    // credit goes to Nitin Jadhav: https://github.com/nitinja
    // who wrote about it here: https://stackoverflow.com/questions/15170942/how-to-rotate-a-matrix-in-an-array-in-javascript/58668351#58668351
    this._memory2D = this._memory2D[0].map((_, i) => this._memory2D.map(row => row[i]).reverse());
  }

  /**
   * Returns a deep copy of this quadrille. May be used in conjunction with
   * {@link reflect} and {@link rotate} to create different quadrille instances.
   */
  clone() {
    return new Quadrille(this._memory2D.map(array => { return array.slice(); }));
  }

  /**
   * Tests for topological equality with other quadrille.
   * @param {Quadrille} other 
   */
  equals(other) {
    if (this.width !== other.width || this.height !== other.height) {
      return false;
    }
    for (let i = 0; i < this.memory2D.length; i++) {
      for (let j = 0; j < this.memory2D[i].length; j++) {
        if ((this.memory2D[i][j] && !other.memory2D[i][j]) || (!this.memory2D[i][j] && other.memory2D[i][j])) {
          return false;
        }
      }
    }
    return true;
  }
}

// Details here:
// https://github.com/processing/p5.js/blob/main/contributor_docs/creating_libraries.md
(function () {
  p5.prototype.createQuadrille = function() {
    if (arguments.length === 1 && Array.isArray(arguments[0])) {
      return new Quadrille(arguments[0]);
    }
    if (arguments.length === 2 && typeof arguments[0] === 'number' && typeof arguments[1] === 'number') {
      return new Quadrille(arguments[0], arguments[1]);
    }
    if (arguments.length === 3 && typeof arguments[0] === 'number' && typeof arguments[1] === 'number' &&
                                  typeof arguments[2] === 'number') {
      let quadrille = new Quadrille(arguments[0], arguments[1]);
      quadrille.fromInt(arguments[2], /*this.color('#FBBC04')*/ this.color(`blue`));
      return quadrille;
    }
    if (arguments.length === 4 && typeof arguments[0] === 'number' && typeof arguments[1] === 'number' &&
                                  typeof arguments[2] === 'number' /*&& typeof arguments[3] === 'number'*/) {
      let quadrille = new Quadrille(arguments[0], arguments[1]);
      quadrille.fromInt(arguments[2], arguments[3]);
      return quadrille;
    }
  }

  p5.prototype.drawQuadrille = function(quadrille, x = 0, y = 0, LENGTH = 10, outlineWeight = 2, outline = 'magenta', board = false) {
    this.push();
    this.translate(x * LENGTH, y * LENGTH);
    this.stroke(outline);
    this.strokeWeight(outlineWeight);
    for (let i = 0; i < quadrille.memory2D.length; i++) {
      for (let j = 0; j < quadrille.memory2D[i].length; j++) {
        this.push();
        if (quadrille.memory2D[i][j]) {
          if (quadrille.memory2D[i][j] instanceof p5.Color) {
            this.fill(quadrille.memory2D[i][j]);
            this.rect(j * LENGTH, i * LENGTH, LENGTH, LENGTH);
          }
          else if (typeof quadrille.memory2D[i][j] === 'string') {
            this.textSize(LENGTH);
            this.text(quadrille.memory2D[i][j], j * LENGTH, i * LENGTH, LENGTH, LENGTH);
            this.noFill();
            this.rect(j * LENGTH, i * LENGTH, LENGTH, LENGTH);
          }
        }
        else if (board) {
          this.noFill();
          this.rect(j * LENGTH, i * LENGTH, LENGTH, LENGTH);
        }
        this.pop();
      }
    }
    this.pop();
  }
})();