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
   * Current library version.
   */
  static version = '0.1.2';

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
   * @param {p5.Image | p5.Color | string | Array} pattern used to fill the returned quadrille.
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
   * 1. Pass a 2D array of patterns (p5 colors, chars, emojis and 0's).
   * 2. Pass width and heigth to construct and empty quadrille (filled with 0's).
   * 3. Pass width and image, to construct a quadrille filled image.
   * 4. Pass width, bitboard and pattern, to construct a quadrille filled
   * with pattern from the given bitboard.
   * 5. Pass width, height, order and pattern, to construct a quadrille filled
   * with pattern of the given order.
   * @see from
   * @see rand
   * @see order
   */
  constructor() {
    if (arguments.length === 1 && Array.isArray(arguments[0])) {
      this._memory2D = arguments[0];
    }
    if (arguments.length === 2 && typeof arguments[0] === 'number' && typeof arguments[1] === 'number') {
      this._memory2D = Array(arguments[1]).fill().map(() => Array(arguments[0]).fill(0));
    }
    if (arguments.length === 2 && typeof arguments[0] === 'number' && typeof arguments[1] !== 'number') {
      this._memory2D = Array(Math.round(arguments[0] * arguments[1].height / arguments[1].width)).fill().map(() => Array(arguments[0]).fill(0));
      this.from(arguments[1]);
    }
    if (arguments.length === 3 && typeof arguments[0] === 'number' && typeof arguments[1] === 'number') {
      this._memory2D = Array(Math.ceil(arguments[1].toString(2).length / arguments[0])).fill().map(() => Array(arguments[0]).fill(0));
      this.from(arguments[1], arguments[2]);
    }
    if (arguments.length === 4 && typeof arguments[0] === 'number' && typeof arguments[1] === 'number' && typeof arguments[2] === 'number') {
      this._memory2D = Array(arguments[1]).fill().map(() => Array(arguments[0]).fill(0));
      this.rand(arguments[2], arguments[3]);
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
   * Same as width * height.
   */
  get size() {
    return this.width * this.height;
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

  // TODO isPolyomino

  /**
   * Search pattern1 and replaces with pattern2, pattern1 and pattern2 may be
   * either a p5.Image, p5.Color, a string (emoji) or a 4-length color array.
   */
  replace(pattern1, pattern2) {
    for (let i = 0; i < this.height; i++) {
      for (let j = 0; j < this.width; j++) {
        if (this.memory2D[i][j] === pattern1) {
          this.memory2D[i][j] = pattern2;
        }
      }
    }
  }

  /**
   * Fills quadrille cells with given pattern. Either:
   * 1. fill(pattern), fills current filled cells;
   * 2. fill(row, pattern), fills row; or,
   * 3. fill(row, col, pattern), fills cell.
   * pattern may be either a p5.Image, a p5.Color, a string (emoji) or a 4-length color array.
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
   * @returns {p5.Image | p5.Color | string | Array} quadrille entry
   */
  read(row, col) {
    if (row >= 0 && row < this.height && col >= 0 && col < this.width) {
      return this.memory2D[row][col];
    }
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

  // TODO toAscii()

  // TODO perlin noise

  /**
   * Randomly fills quadrille with pattern up to order.
   * @param {number} order 
   * @param {p5.Image | p5.Color | string | Array} pattern 
   * @see order
   */
  rand(order, pattern) {
    order = Math.abs(order);
    if (order > this.size) {
      order = this.size;
    }
    let disorder = this.order;
    let counter = 0;
    while (counter < Math.abs(order - disorder)) {
      let _ = this._fromIndex(Math.floor(Math.random() * this.size));
      if (order > disorder ? !this.memory2D[_.row][_.col] : this.memory2D[_.row][_.col]) {
        this.memory2D[_.row][_.col] = order > disorder ? pattern : 0;
        counter++;
      }
    }
  }

  /**
   * Randomly re-arranges cell entries.
   */
  randomize() {
    let clone = this.clone();
    this.clear();
    for (let i = 0; i < clone.height; i++) {
      for (let j = 0; j < clone.width; j++) {
        if (clone.memory2D[i][j]) {
          let _i, _j;
          do {
            _i = int(random(this.height));
            _j = int(random(this.width));
          }
          while(this.memory2D[_i][_j]); 
          this.memory2D[_i][_j] = clone.memory2D[i][j];
        }
      }
    }
  }

  /**
   * Converts image (p5.Image) or bitboard (integer) to quadrille. Forms:
   * 1. from(image); or,
   * 2. from(bitboard, pattern) where pattern may be either a p5.Image, p5.Color,
   * a string (emoji) or a 4-length color array.
   */
  from() {
    if (arguments.length === 1 && arguments[0] instanceof p5.Image) {
      /*
      // 1st method uses image.resize
      let image = new p5.Image(arguments[0].width, arguments[0].height);
      image.copy(arguments[0], 0, 0, arguments[0].width, arguments[0].height,
                               0, 0, arguments[0].width, arguments[0].height);
      image.resize(this.width, this.height);
      image.loadPixels();
      for (let i = 0; i < image.pixels.length / 4; i++) {
        let r = image.pixels[4 * i];
        let g = image.pixels[4 * i + 1];
        let b = image.pixels[4 * i + 2];
        let a = image.pixels[4 * i + 3];
        let _ = this._fromIndex(i);
        this.memory2D[_.row][_.col] = [r, g, b, a];
      }
      image.updatePixels();
      // */
      // /*
      // 2nd method seems to give better visual results
      let image = arguments[0];
      image.loadPixels();
      let r = Array(this.height).fill().map(() => Array(this.width).fill(0));
      let g = Array(this.height).fill().map(() => Array(this.width).fill(0));
      let b = Array(this.height).fill().map(() => Array(this.width).fill(0));
      let a = Array(this.height).fill().map(() => Array(this.width).fill(0));
      let t = Array(this.height).fill().map(() => Array(this.width).fill(0));
      for (let i = 0; i < image.pixels.length / 4; i++) {
        let _ = this._fromIndex(i, image.width);
        let _i = Math.floor(_.row * this.height / image.height);
        let _j = Math.floor(_.col * this.width / image.width);
        r[_i][_j] += image.pixels[4 * i];
        g[_i][_j] += image.pixels[4 * i + 1];
        b[_i][_j] += image.pixels[4 * i + 2];
        a[_i][_j] += image.pixels[4 * i + 3];
        t[_i][_j] += 1;
      }
      image.updatePixels();
      for (let i = 0; i < this.height; i++) {
        for (let j = 0; j < this.width; j++) {
          this.memory2D[i][j] = [r[i][j] / t[i][j], g[i][j] / t[i][j], b[i][j] / t[i][j], a[i][j] / t[i][j]];
        }
      }
      // */
    }
    if (arguments.length === 2 && typeof arguments[0] === 'number') {
      let length = this.width * this.height;
      let bitboard = Math.abs(Math.round(arguments[0]));
      if (bitboard.toString(2).length > length) {
        throw new Error(`Value is to high to fill quadrille`);
      }
      for (let i = 0; i <= length - 1; i++) {
        if ((bitboard & (1 << length - 1 - i))) {
          this.memory2D[this._fromIndex(i).row][this._fromIndex(i).col] = arguments[1];
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
   * Inserts an empty row.
   * @param {number} row 
   */
  insert(row) {
    this.memory2D.splice(row, 0, Array(this.width).fill(0));
  }

  /**
   * Deletes the given row.
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
}

// Details here:
// https://github.com/processing/p5.js/blob/main/contributor_docs/creating_libraries.md
(function () {
  p5.prototype.createQuadrille = function() {
    return new Quadrille(...arguments);
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
          // Note that the Array.isArray(quadrille.memory2D[i][j]) condition should be rethought
          // once 3D Quadrilles appear.
          if (quadrille.memory2D[i][j] instanceof p5.Color || Array.isArray(quadrille.memory2D[i][j])) {
            this.fill(quadrille.memory2D[i][j]);
            this.rect(j * LENGTH, i * LENGTH, LENGTH, LENGTH);
          }
          else if (quadrille.memory2D[i][j] instanceof p5.Image) {
            this.image(quadrille.memory2D[i][j], j * LENGTH, i * LENGTH, LENGTH, LENGTH);
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