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
  static AND(quadrille1, quadrille2, x=0, y=0) {
    return this.OP(quadrille1, quadrille2,
      (i1, j1, i2, j2) => {
        if (quadrille1.read(i1, j1) && quadrille2.read(i2, j2)) {
          return quadrille1.read(i1, j1);
        }
      },
      x, y);
  }

  static OR(quadrille1, quadrille2, x=0, y=0) {
    return this.OP(quadrille1, quadrille2,
      (i1, j1, i2, j2) => {
        if (quadrille1.read(i1, j1)) {
          return quadrille1.read(i1, j1);
        }
        if (quadrille2.read(i2, j2)) {
          return quadrille2.read(i2, j2);
        }
      },
      x, y);
  }

  static XOR(quadrille1, quadrille2, x=0, y=0) {
    return this.OP(quadrille1, quadrille2,
      (i1, j1, i2, j2) => {
        if (quadrille1.read(i1, j1) && !quadrille2.read(i2, j2)) {
          return quadrille1.read(i1, j1);
        }
        if (!quadrille1.read(i1, j1) && quadrille2.read(i2, j2)) {
          return quadrille2.read(i2, j2);
        }
      },
      x, y);
  }

  // TODO implement diff

  static OP(quadrille1, quadrille2, fx, x=0, y=0) {
    // i. create resulted quadrille
    let quadrille = new Quadrille(x < 0 ? Math.max(quadrille2.width,  quadrille1.width - x) : Math.max(quadrille1.width,  quadrille2.width + x),
                                  y < 0 ? Math.max(quadrille2.height, quadrille1.height - y) : Math.max(quadrille1.height, quadrille2.height + y));
    // ii. fill result with passed quadrilles
    for (let i = 0; i < quadrille.memory2D.length; i++) {
      for (let j = 0; j < quadrille.memory2D[i].length; j++) {
        let result = fx(x < 0 ? i + x : i, y < 0 ? j + y : j, x > 0 ? i - x : i, y > 0 ? j - y : j);
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

  write(i, j, pattern) {
    if (i >= 0 && i < this.height && j >= 0 && j < this.width) {
      this.memory2D[i][j] = pattern;
    }
  }

  read(i, j) {
    if (i >= 0 && i < this.height && j >= 0 && j < this.width) {
      return this.memory2D[i][j];
    }
    // return (i >= 0 && i < this.height && j >= 0 && j < this.width) ? this.memory2D[i][j] : undefined;
  }

  /**
   * @param {number} j column.
   * @returns {number} Number of non-empty queadrille cells at the jth column.
   */
  columnOrder(j) {
    let result = 0;
    for (let i = 0; i < this.height; i++) {
      if (this.memory2D[i][j]) {
        result++;
      }
    }
    return result;
  }

  /**
   * @param {number} i row.
   * @returns {number} Number of non-empty queadrille cells at the ith row.
   */
  rowOrder(i) {
    let result = 0;
    for (let j = 0; j < this.width; j++) {
      if (this.memory2D[i][j]) {
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
  get length() {
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
        this.memory2D[this.ij(i).i][this.ij(i).j] = fill;
      }
    }
  }

  ij(i, width = this.width) {
    return {i: (i / width) | 0, j: i % width};
  }

  index(row, col, width = this.width) {
    return row * width + col;
  }

  /**
   * Sets all quadrille memory entries to 0.
   */
  clear() {
    this._memory2D = this._memory2D.map(x => x.map( y => y = 0));
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
   * Returns a deep copy of this quadrille. May be used in conjunction with
   * {@link reflect} and {@link rotate} to create different quadrille instances.
   */
  clone() {
    return new Quadrille(this._memory2D.map(array => { return array.slice(); }));
  }
}

// Details here:
// https://github.com/processing/p5.js/blob/main/contributor_docs/creating_libraries.md
(function () {
  p5.prototype.createQuadrille = function() {
    if (arguments.length === 1 && Array.isArray(arguments[0])) {
      return new Quadrille(arguments[0]);
    }
    // TODO these two require instance mode testing
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

  p5.prototype.createBoard = function(width, height) {
    return new Quadrille(width, height);
  }

  p5.prototype.drawBoard = function(quadrille, LENGTH = 10, outlineWeight = 1, outline = this.color('#FBBC04'), fill = this.color('#859900')) {
    this.drawQuadrille(quadrille, 0, 0, LENGTH, outlineWeight, outline, fill);
  }

  p5.prototype.drawQuadrille = function(quadrille, row = 0, col = 0, LENGTH = 10, outlineWeight = 2, outline = 'magenta', fill = 'noColor') {
    this.push();
    this.translate(row * LENGTH, col * LENGTH);
    this.stroke(outline);
    this.strokeWeight(outlineWeight);
    for (let i = 0; i < quadrille.memory2D.length; i++) {
      for (let j = 0; j < quadrille.memory2D[i].length; j++) {
        // handles both zero and empty (undefined) entries as well
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
        else if (fill !== 'noColor') {
          this.fill(fill);
          this.rect(j * LENGTH, i * LENGTH, LENGTH, LENGTH);
        }
        this.pop();
      }
    }
    this.pop();
  }
})();