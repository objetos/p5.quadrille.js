'use strict';

class Quadrille {
  /**
   * Default background used in sort.
   */
  static BACKGROUND = 'black';

  /**
   * Default text drawing color.
   */
  static TEXT_COLOR = 'white';

  /**
   * Default text drawing zoom.
   */
  static TEXT_ZOOM = 0.89;

  /**
   * Default drawing outline.
   */
  static OUTLINE = 'grey';

  /**
   * Default drawing outline weight.
   */
  static OUTLINE_WEIGHT = 2;

  /**
   * Default drawing cell length.
   */
  static CELL_LENGTH = 100;

  /**
   * @param {Quadrille} quadrille1 
   * @param {Quadrille} quadrille2 
   * @param {number} row respect to quadrille1 origin
   * @param {number} col respect to quadrille1 origin
   * @returns {Quadrille} the smallest Quadrille obtained after applying a logic AND operation on the two given quadrilles.
   */
  static AND(quadrille1, quadrille2, row = 0, col = 0) {
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
  static OR(quadrille1, quadrille2, row = 0, col = 0) {
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
  static XOR(quadrille1, quadrille2, row = 0, col = 0) {
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
  static DIFF(quadrille1, quadrille2, row = 0, col = 0) {
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
   * @param {p5.Image | p5.Graphics | p5.Color | Array | object | string | number} pattern used to fill the returned quadrille.
   * @returns {Quadrille} the Quadrille obtained after applying a logic NEG operation on the given quadrille.
   */
  static NEG(quadrille, pattern) {
    if (pattern === null || pattern === undefined) return;
    let result = new Quadrille(quadrille.width, quadrille.height);
    for (let i = 0; i < quadrille.height; i++) {
      for (let j = 0; j < quadrille.width; j++) {
        if (quadrille._memory2D[i][j] === null || quadrille._memory2D[i][j] === undefined) {
          result._memory2D[i][j] = pattern;
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
  static OP(quadrille1, quadrille2, operator, row = 0, col = 0) {
    // i. create resulted quadrille
    let quadrille = new Quadrille(col < 0 ? Math.max(quadrille2.width, quadrille1.width - col) : Math.max(quadrille1.width, quadrille2.width + col),
      row < 0 ? Math.max(quadrille2.height, quadrille1.height - row) : Math.max(quadrille1.height, quadrille2.height + row));
    // ii. fill result with passed quadrilles
    for (let i = 0; i < quadrille.height; i++) {
      for (let j = 0; j < quadrille.width; j++) {
        let result = operator(quadrille1.read(row < 0 ? i + row : i, col < 0 ? j + col : j), quadrille2.read(row > 0 ? i - row : i, col > 0 ? j - col : j));
        if (result !== undefined) {
          quadrille._memory2D[i][j] = result;
        }
      }
    }
    // iii. return resulted quadrille
    return quadrille;
  }

  /**
   * Constructs either an empty or a filled quadrille:
   * 1. Pass string.
   * 2. Pass array or matrix of patterns (p5 colors, 4-length color arrays, strings and numbers).
   * 3. Pass width and string.
   * 4. Pass width and an array of patterns (p5 colors, 4-length color arrays, strings and numbers).
   * 5. Pass width and heigth to construct and empty quadrille (filled with null's).
   * 6. Pass width and image, to construct a quadrille filled image.
   * 7. Pass width, bitboard and pattern, to construct a quadrille filled with pattern from the given bitboard.
   * 8. Pass width, height, order and pattern, to construct a quadrille filled with pattern of the given order.
   * @see from
   * @see rand
   * @see order
   */
  constructor() {
    if (arguments.length === 1) {
      this.memory2D = arguments[0];
    }
    if (arguments.length === 2 && typeof arguments[0] === 'number') {
      if (typeof arguments[1] === 'string') {
        this._init1D([...arguments[1]], arguments[0]);
        return;
      }
      if (Array.isArray(arguments[1])) {
        this._init1D(arguments[1], arguments[0]);
        return;
      }
    }
    if (arguments.length === 2 && typeof arguments[0] === 'number' && typeof arguments[1] === 'number') {
      this._memory2D = Array(arguments[1]).fill().map(() => Array(arguments[0]).fill(null));
      return;
    }
    if (arguments.length === 2 && typeof arguments[0] === 'number' && typeof arguments[1] !== 'number') {
      this._memory2D = Array(Math.round(arguments[0] * arguments[1].height / arguments[1].width)).fill().map(() => Array(arguments[0]).fill(null));
      this.from(arguments[1]);
      return;
    }
    if (arguments.length === 3 && typeof arguments[0] === 'number' && typeof arguments[1] === 'number') {
      this._memory2D = Array(Math.ceil(arguments[1].toString(2).length / arguments[0])).fill().map(() => Array(arguments[0]).fill(null));
      this.from(arguments[1], arguments[2]);
      return;
    }
    if (arguments.length === 3 && typeof arguments[0] === 'number' && typeof arguments[1] !== 'number' && typeof arguments[2] === 'boolean') {
      this._memory2D = Array(Math.round(arguments[0] * arguments[1].height / arguments[1].width)).fill().map(() => Array(arguments[0]).fill(null));
      this.from(arguments[1], arguments[2]);
      return;
    }
    if (arguments.length === 4 && typeof arguments[0] === 'number' && typeof arguments[1] === 'number' && typeof arguments[2] === 'number') {
      this._memory2D = Array(arguments[1]).fill().map(() => Array(arguments[0]).fill(null));
      this.rand(arguments[2], arguments[3]);
      return;
    }
  }

  _init1D(memory1D, width = memory1D.length) {
    let height = Math.ceil(memory1D.length / width);
    this._memory2D = new Array(height);
    for (let i = 0; i < height; i++) {
      let start = width * i;
      let end = start + width;
      this._memory2D[i] = this._format(memory1D.slice(start, end), width);
    }
  }

  _format(memory1D, size) {
    for (let i = 0; i < memory1D.length; i++) {
      if (memory1D[i] === undefined) {
        memory1D[i] = null;
      }
    }
    if (memory1D.length < size) {
      return memory1D.concat(new Array(size - memory1D.length).fill(null));
    }
    return memory1D;
  }

  /**
   * Sets quadrille from 2D memory internal array representation.
   */
  set memory2D(memory) {
    if (typeof memory === 'string') {
      this._init1D([...memory]);
      return;
    }
    if (Array.isArray(memory)) {
      if (!Array.isArray(memory[0])) {
        this._init1D(memory);
        return;
      }
      let memory2D = memory.map(array => { return array.slice(); });
      let width;
      for (const entry of memory2D) {
        if (!Array.isArray(entry)) {
          throw new Error('Not 2D Array');
        }
        if (!width) {
          width = entry.length;
        }
        else if (width < entry.length) {
          width = entry.length;
        }
      }
      for (let i = 0; i < memory2D.length; i++) {
        memory2D[i] = this._format(memory2D[i], width);
      }
      this._memory2D = memory2D;
    }
  }

  /**
   * @returns {Array} Quadrille matrix (Array2D) representation.
   */
  get memory2D() {
    return this.clone()._memory2D;
  }

  /**
   * Sets quadrille width (number of columns).
   */
  set width(width) {
    this.transpose();
    this.height = width;
    this.transpose();
  }

  /**
   * @returns {number} quadrille width, i.e., number of columns.
   */
  get width() {
    return this._memory2D[0].length;
  }

  /**
   * Sets quadrille height (number of rows).
   */
  set height(height) {
    let rows = height - this.height;
    while (this.height !== height) {
      rows > 0 ? this.insert(this.height) : this.delete(this.height - 1);
    }
  }

  /**
   * @returns {number} quadrille height, i.e., number of rows.
   */
  get height() {
    return this._memory2D.length;
  }

  /**
   * @returns {number} width * height.
   */
  get size() {
    return this.width * this.height;
  }

  /**
   * @returns {number} Number of non-empty quadrille cells.
   */
  get order() {
    let result = 0;
    for (let i = 0; i < this.height; i++) {
      for (let j = 0; j < this.width; j++) {
        if (this._memory2D[i][j] !== null && this._memory2D[i][j] !== undefined) {
          result++;
        }
      }
    }
    return result;
  }

  /**
   * Converts image (p5.Image or p5.Graphics) or bitboard (integer) to quadrille. Forms:
   * 1. from(image, [coherence = false]); or,
   * 2. from(bitboard, pattern) where pattern may be either a p5.Image, p5.Graphics,
   * p5.Color, a 4-length color array, a string or a number.
   */
  from() {
    if (arguments.length === 0) {
      console.warn('from always expects params');
      return;
    }
    // a. image
    if (arguments[0] instanceof p5.Image || arguments[0] instanceof p5.Graphics) {
      let image = new p5.Image(arguments[0].width, arguments[0].height);
      image.copy(arguments[0], 0, 0, arguments[0].width, arguments[0].height, 0, 0, arguments[0].width, arguments[0].height);
      arguments.length === 1 ? this._pixelator2(image) : arguments[1] ? this._pixelator1(image) : this._pixelator2(image);
    }
    // b. bitboard, pattern
    if (arguments.length === 2 && typeof arguments[0] === 'number' && arguments[1] !== null && arguments[1] !== undefined) {
      let length = this.width * this.height;
      let bitboard = Math.abs(Math.round(arguments[0]));
      if (bitboard.toString(2).length > length) {
        throw new Error('Value is to high to fill quadrille');
      }
      for (let i = 0; i <= length - 1; i++) {
        if ((bitboard & (1 << length - 1 - i))) {
          this._memory2D[this._fromIndex(i).row][this._fromIndex(i).col] = arguments[1];
        }
      }
    }
    return this;
  }

  _pixelator1(image) {
    image.resize(this.width, this.height);
    image.loadPixels();
    for (let i = 0; i < image.pixels.length / 4; i++) {
      let r = image.pixels[4 * i];
      let g = image.pixels[4 * i + 1];
      let b = image.pixels[4 * i + 2];
      let a = image.pixels[4 * i + 3];
      let _ = this._fromIndex(i);
      this._memory2D[_.row][_.col] = color([r, g, b, a]);
    }
  }

  _pixelator2(image) {
    image.loadPixels();
    let r = Array(this.height).fill().map(() => Array(this.width).fill(null));
    let g = Array(this.height).fill().map(() => Array(this.width).fill(null));
    let b = Array(this.height).fill().map(() => Array(this.width).fill(null));
    let a = Array(this.height).fill().map(() => Array(this.width).fill(null));
    let t = Array(this.height).fill().map(() => Array(this.width).fill(null));
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
    for (let i = 0; i < this.height; i++) {
      for (let j = 0; j < this.width; j++) {
        this._memory2D[i][j] = color([r[i][j] / t[i][j], g[i][j] / t[i][j], b[i][j] / t[i][j], a[i][j] / t[i][j]]);
      }
    }
  }

  _fromIndex(index, width = this.width) {
    return { row: (index / width) | 0, col: index % width };
  }

  _toIndex(row, col, width = this.width) {
    return row * width + col;
  }

  /**
   * @returns {number} integer representation using big-endian and row-major ordering
   * of the quadrille entries.
   */
  toInt() {
    let result = 0;
    for (let i = 0; i < this.height; i++) {
      for (let j = 0; j < this.width; j++) {
        if (this._memory2D[i][j] !== null && this._memory2D[i][j] !== undefined) {
          result += Math.pow(2, this.width * (this.height - i) - (j + 1));
        }
      }
    }
    return result;
  }

  /**
   * @returns {Array} Quadrille representation.
   */
  toArray() {
    let memory2D = this.clone()._memory2D;
    let result = new Array();
    for (let i = 0; i < memory2D.length; i++) {
      result = result.concat(memory2D[i]);
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
      if (this._memory2D[row][j]) {
        result++;
      }
    }
    return result;
  }

  // TODO isPolyomino

  /**
   * Searches and replace patterns. Either:
   * 1. replace(pattern), replaces non empty cells with pattern.
   * 2. replace(pattern1, pattern2), searches pattern1 and replaces with pattern2,
   * pattern1 and pattern2 may be either a p5.Image, p5.Graphics, p5.Color,
   * a 4-length color array, a string or a number.
   */
  replace() {
    if (arguments.length === 1 && arguments[0] !== undefined) {
      for (let i = 0; i < this.height; i++) {
        for (let j = 0; j < this.width; j++) {
          if (this._memory2D[i][j] !== null && this._memory2D[i][j] !== undefined) {
            this._memory2D[i][j] = arguments[0];
          }
        }
      }
    }
    if (arguments.length === 2 && arguments[1] !== undefined) {
      for (let i = 0; i < this.height; i++) {
        for (let j = 0; j < this.width; j++) {
          if (this._memory2D[i][j] === arguments[0]) {
            this._memory2D[i][j] = arguments[1];
          }
        }
      }
    }
    return this;
  }

  /**
   * Clear quadrille cells (fill them with null's). Either:
   * 1. clear(), clears current filled cells;
   * 2. clear(row), clears row; or,
   * 3. clear(row, col), clears cell.
   * 4. clear(row, col, directions), flood clearing using (row, col) cell pattern.
   * 5. clear(row, col, border), flood clearing (including borders) using (row, col) cell pattern.
   * 6. clear(row, col, directions, border), flood clearing (including borders) using (row, col) cell pattern.
   */
  clear() {
    if (arguments.length === 0) {
      this._memory2D = this._memory2D.map(x => x.map(y => y = null));
    }
    if (arguments.length === 1 && typeof arguments[0] === 'number') {
      if (arguments[0] >= 0 && arguments[0] < this.height) {
        this._memory2D[arguments[0]].fill(null);
      }
    }
    if (arguments.length === 2 && typeof arguments[0] === 'number' && typeof arguments[1] === 'number') {
      if (arguments[0] >= 0 && arguments[0] < this.height && arguments[1] >= 0 && arguments[1] < this.width) {
        this._memory2D[arguments[0]][arguments[1]] = null;
      }
    }
    if (arguments.length === 3 && typeof arguments[0] === 'number' && typeof arguments[1] === 'number' &&
    typeof arguments[2] === 'number') {
      this._flood(arguments[0], arguments[1], this._memory2D[arguments[0]][arguments[1]], null, arguments[2]);
    }
    if (arguments.length === 3 && typeof arguments[0] === 'number' && typeof arguments[1] === 'number' &&
    typeof arguments[2] === 'boolean') {
      this._flood(arguments[0], arguments[1], this._memory2D[arguments[0]][arguments[1]], null, 4, arguments[2]);
    }
    if (arguments.length === 4 && typeof arguments[0] === 'number' && typeof arguments[1] === 'number' &&
    typeof arguments[2] === 'number' && typeof arguments[3] === 'boolean') {
      this._flood(arguments[0], arguments[1], this._memory2D[arguments[0]][arguments[1]], null, arguments[2], arguments[3]);
    }
    return this;
  }

  /**
   * Fills quadrille cells with given pattern. Either:
   * 1. fill(pattern), fills current empty cells;
   * 2. fill(row, pattern), fills row; or,
   * 3. fill(row, col, pattern), fills cell.
   * 4. fill(row, col, pattern, directions), flood filling without boder in the given number of directions,
   * using (row, col) cell pattern (either a p5.Image, a p5.Graphics, a p5.Color, a 4-length color array,
   * an object, a string or a number).
   * 5. fill(row, col, pattern, border), flood filling with (without) border in 4 directions using (row, col)
   * cell pattern (either a p5.Image, a p5.Graphics, a p5.Color, a 4-length color array, an object, a string or a number).
   * 6. fill(row, col, pattern, directions, border), flood filling with (without) border in the given number of directions
   * using (row, col) cell pattern (either a  p5.Image, a p5.Graphics, a p5.Color, a 4-length color array, an object,
   * a string or a number).
   */
  fill() {
    if (arguments.length === 1 && arguments[0] !== null && arguments[0] !== undefined) {
      for (let i = 0; i < this.height; i++) {
        for (let j = 0; j < this.width; j++) {
          if ((this._memory2D[i][j] === null || this._memory2D[i][j] === undefined)) {
            this._memory2D[i][j] = arguments[0];
          }
        }
      }
    }
    if (arguments.length === 2 && typeof arguments[0] === 'number' && arguments[1] !== null && arguments[1] !== undefined) {
      if (arguments[0] >= 0 && arguments[0] < this.height) {
        this._memory2D[arguments[0]].fill(arguments[1]);
      }
    }
    if (arguments.length === 3 && typeof arguments[0] === 'number' && typeof arguments[1] === 'number' &&
      arguments[2] !== null && arguments[2] !== undefined) {
      if (arguments[0] >= 0 && arguments[0] < this.height && arguments[1] >= 0 && arguments[1] < this.width) {
        this._memory2D[arguments[0]][arguments[1]] = arguments[2];
      }
    }
    if (arguments.length === 4 && typeof arguments[0] === 'number' && typeof arguments[1] === 'number' &&
      arguments[2] !== null && arguments[2] !== undefined && typeof arguments[3] === 'number') {
      this._flood(arguments[0], arguments[1], this._memory2D[arguments[0]][arguments[1]], arguments[2], arguments[3]);
    }
    if (arguments.length === 4 && typeof arguments[0] === 'number' && typeof arguments[1] === 'number' &&
      arguments[2] !== null && arguments[2] !== undefined && typeof arguments[3] === 'boolean') {
      this._flood(arguments[0], arguments[1], this._memory2D[arguments[0]][arguments[1]], arguments[2], 4, arguments[3]);
    }
    if (arguments.length === 5 && typeof arguments[0] === 'number' && typeof arguments[1] === 'number' &&
      arguments[2] !== null && arguments[2] !== undefined && typeof arguments[3] === 'number' && typeof arguments[4] === 'boolean') {
      this._flood(arguments[0], arguments[1], this._memory2D[arguments[0]][arguments[1]], arguments[2], arguments[3], arguments[4]);
    }
    return this;
  }

  _flood(row, col, pattern1, pattern2, directions = 4, border = false) {
    if (directions !== 4 && directions !== 8) {
      directions = 4;
      console.warn('using 4 directions, see: https://en.m.wikipedia.org/wiki/Flood_fill');
    }
    if (row >= 0 && row < this.height && col >= 0 && col < this.width && this._memory2D[row][col] !== pattern2) {
      if (this._memory2D[row][col] === pattern1) {
        this._memory2D[row][col] = pattern2;
        this._flood(row, col - 1, pattern1, pattern2, directions, border);
        this._flood(row - 1, col, pattern1, pattern2, directions, border);
        this._flood(row, col + 1, pattern1, pattern2, directions, border);
        this._flood(row + 1, col, pattern1, pattern2, directions, border);
        if (directions === 8) {
          this._flood(row - 1, col - 1, pattern1, pattern2, directions, border);
          this._flood(row - 1, col + 1, pattern1, pattern2, directions, border);
          this._flood(row + 1, col + 1, pattern1, pattern2, directions, border);
          this._flood(row + 1, col - 1, pattern1, pattern2, directions, border);
        }
      }
      if (border) {
        this._memory2D[row][col] = pattern2;
      }
    }
  }

  /**
   * @param {number} row 
   * @param {number} col 
   * @returns {p5.Image | p5.Graphics | p5.Color | Array | object | string | number} quadrille entry
   */
  read(row, col) {
    if (row >= 0 && row < this.height && col >= 0 && col < this.width) {
      return this._memory2D[row][col];
    }
  }

  /**
   * @param {number} row 
   * @param {number} col 
   * @param {number} dimension of ring
   * @returns Quadrille ring of neighbor cells centered at (row, col).
   */
  ring(row, col, dimension = 1) {
    let array1D = [];
    for (let i = row - dimension; i <= row + dimension; i++) {
      for (let j = col - dimension; j <= col + dimension; j++) {
        array1D.push(this.read(i, j));
      }
    }
    return new Quadrille(2 * dimension + 1, array1D);
  }

  /**
   * @param {number} row 
   * @param {number} col 
   * @returns {boolean} true if cell is empty
   */
  isEmpty(row, col) {
    return this.read(row, col) ? false : true;
  }

  /**
   * @param {number} row 
   * @param {number} col 
   * @returns {boolean} true if cell is filled
   */
  isFilled(row, col) {
    return this.read(row, col) ? true : false;
  }

  /**
   * @param {number} row 
   * @param {number} col 
   * @returns {boolean} true if cell has a number
   */
  isNumber(row, col) {
    return typeof this.read(row, col) === 'number' ? true : false;
  }

  /**
   * @param {number} row 
   * @param {number} col 
   * @returns {boolean} true if cell has a string
   */
  isString(row, col) {
    return typeof this.read(row, col) === 'string' ? true : false;
  }

  /**
   * @param {number} row 
   * @param {number} col 
   * @returns {boolean} true if cell has a color
   */
  isColor(row, col) {
    return this.read(row, col) instanceof p5.Color ? true : false;
  }

  /**
   * @param {number} row 
   * @param {number} col 
   * @returns {boolean} true if cell has an array
   */
  isArray(row, col) {
    return Array.isArray(this.read(row, col)) ? true : false;
  }

  /**
   * @param {number} row 
   * @param {number} col 
   * @returns {boolean} true if cell has an object
   */
  isObject(row, col) {
    return typeof this.read(row, col) === 'object' ? true : false;
  }

  /**
   * @param {number} row 
   * @param {number} col 
   * @returns {boolean} true if cell has an image
   */
  isImage(row, col) {
    return this.read(row, col) instanceof p5.Image || this.read(row, col) instanceof p5.Graphics ? true : false;
  }

  /**
   * Convolutes this quadrille against the quadrille kernel mask. kernel weights
   * may be encoded within the quadrille mask, both numerically or using colors.
   * Luma is used in the latter case to convert colors to weights. Forms:
   * 1. filter(mask) convolutes the whole quadrille or,
   * 2. filter(mask, i, j) convolutes the whole quadrille at i, j. Both i and j
   * should be greater or equal than the mask half_size which is computed as:
   * (mask.width - 1) / 2).
   * @params {Quadrille} nxn (n is odd) quadrille convolution kernel mask.
   * @param {number} row if 0 convolutes the whole quadrille
   * @param {number} col if 0 convolutes the whole quadrille
   */
  filter(mask, row = 0, col = 0) {
    if (mask.size % 2 === 1 && mask.width === mask.height && this.size >= mask.size) {
      let half_size = (mask.width - 1) / 2;
      if (row == 0 || col == 0) {
        for (let i = half_size; i < this.height - half_size; i++) {
          for (let j = half_size; j < this.width - half_size; j++) {
            this._conv(mask, i, j, half_size);
          }
        }
      }
      else {
        this._conv(mask, row, col, half_size);
      }
    }
    return this;
  }

  _conv(mask, row, col, cache_half_size = (mask.width - 1) / 2) {
    if (row >= cache_half_size && col >= cache_half_size &&
      row < this.height - cache_half_size && col < this.width - cache_half_size) {
      let r = 0;
      let g = 0;
      let b = 0;
      for (let imask = 0; imask < mask.height; imask++) {
        for (let jmask = 0; jmask < mask.width; jmask++) {
          let i = row + imask - cache_half_size;
          let j = col + jmask - cache_half_size;
          let neighbor = this._memory2D[i][j];
          let mask_value = mask._memory2D[imask][jmask];
          if ((neighbor instanceof p5.Color) && (typeof mask_value === 'number' || mask_value instanceof p5.Color)) {
            // luma coefficients are: 0.299, 0.587, 0.114, 0
            let weight = typeof mask_value === 'number' ? mask_value : 0.299 * red(mask_value) + 0.587 * green(mask_value) + 0.114 * blue(mask_value);
            r += red(neighbor) * weight;
            g += green(neighbor) * weight;
            b += blue(neighbor) * weight;
          }
        }
      }
      r = constrain(r, 0, 255);
      g = constrain(g, 0, 255);
      b = constrain(b, 0, 255);
      this._memory2D[row][col] = color(r, g, b);
    }
  }

  /**
   * Colorize the (row0, col0), (row1, col1), (row2, col2) triangle, according to
   * color0, color1 and color2 colors (either p5.Color, arrays or strings), respectively.
   */
  colorizeTriangle(row0, col0, row1, col1, row2, col2, color0, color1 = color0, color2 = color0) {
    this.rasterizeTriangle(row0, col0, row1, col1, row2, col2,
      // Shader which colorizes the (row0, col0), (row1, col1), (row2, col2) triangle, according to the
      // pattern0.xyza, pattern1.xyza and pattern2.xyza interpolated color vertex patterns, respectively.
      ({ pattern: xyza }) => color(xyza), [red(color0), green(color0), blue(color0), alpha(color0)],
      [red(color1), green(color1), blue(color1), alpha(color1)],
      [red(color2), green(color2), blue(color2), alpha(color2)]);
  }

  /**
   * Colorize quadrille according to upper-left corner color0, bottom-left corner color1,
   * upper-right corner color2, and bottom-right corner color3 colors.
   */
  colorize(color0, color1 = color0, color2 = color0, color3 = color0) {
    this.colorizeTriangle(0, 0, this.height - 1, 0, 0, this.width - 1, color0, color1, color2);
    this.colorizeTriangle(this.height - 1, 0, 0, this.width - 1, this.height - 1, this.width - 1, color1, color2, color3);
  }

  /**
   * Rasterize the (row0, col0), (row1, col1), (row2, col2) triangle
   * according to pattern0, pattern1 and pattern2 object vertex patterns (resp),
   * using (fragment) shader.
   */
  rasterizeTriangle(row0, col0, row1, col1, row2, col2, shader, pattern0, pattern1 = pattern0, pattern2 = pattern0) {
    if (Array.isArray(pattern0) && Array.isArray(pattern1) && Array.isArray(pattern2)) {
      for (let i = 0; i < this.height; i++) {
        for (let j = 0; j < this.width; j++) {
          let coords = this._barycentric_coords(i, j, row0, col0, row1, col1, row2, col2);
          // interpolate all pattern attributes for the current cell only if it is inside the triangle
          if (coords.w0 >= 0 && coords.w1 >= 0 && coords.w2 >= 0) {
            let length = Math.max(pattern0.length, pattern1.length, pattern2.length);
            let _pattern = new Array(length);
            for (let k = 0; k < _pattern.length; k++) {
              _pattern[k] = (pattern0[k] ?? 0) * coords.w0 + (pattern1[k] ?? 0) * coords.w1 + (pattern2[k] ?? 0) * coords.w2;
            }
            // call shader using the interpolated patterns to compute the current cell color
            let _shader = shader({ pattern: _pattern, row: i, col: j });
            if (_shader instanceof p5.Color) {
              this._memory2D[i][j] = _shader;
            }
          }
        }
      }
    }
    return this;
  }

  /**
   * Rasterize quadrille according to upper-left corner vertex pattern0,
   * bottom-left corner vertex pattern1, upper-right corner vertex pattern2,
   * and bottom-right corner vertex pattern3, using (fragment) shader.
   */
  rasterize(shader, pattern0, pattern1 = pattern0, pattern2 = pattern0, pattern3 = pattern0) {
    this.rasterizeTriangle(0, 0, this.height - 1, 0, 0, this.width - 1, shader, pattern0, pattern1, pattern2);
    this.rasterizeTriangle(this.height - 1, 0, 0, this.width - 1, this.height - 1, this.width - 1, shader, pattern1, pattern2, pattern3);
  }

  /**
   * Returns the (row0, col0), (row1, col1), (row2, col2) triangle
   * barycentric coordinates at (row, col) as the {w0, w1, w2} object literal.
   */
  _barycentric_coords(row, col, row0, col0, row1, col1, row2, col2) {
    let edges = this._edge_functions(row, col, row0, col0, row1, col1, row2, col2);
    let area = this._parallelogram_area(row0, col0, row1, col1, row2, col2);
    return { w0: edges.e12 / area, w1: edges.e20 / area, w2: edges.e01 / area };
  }

  /**
   * Returns the parallelogram signed area spawn by the
   * (row0, col0), (row1, col1), (row2, col2) triangle.
   */
  _parallelogram_area(row0, col0, row1, col1, row2, col2) {
    return (col1 - col0) * (row2 - row0) - (col2 - col0) * (row1 - row0);
  }

  /**
   * Returns the (row0, col0), (row1, col1), (row2, col2) triangle edge_functions
   * at (row, col) as the {e01, e12, e20} object literal.
   */
  _edge_functions(row, col, row0, col0, row1, col1, row2, col2) {
    let e01 = (row0 - row1) * col + (col1 - col0) * row + (col0 * row1 - row0 * col1);
    let e12 = (row1 - row2) * col + (col2 - col1) * row + (col1 * row2 - row1 * col2);
    let e20 = (row2 - row0) * col + (col0 - col2) * row + (col2 * row0 - row2 * col0);
    return { e01, e12, e20 };
  }

  // TODO perlin noise

  /**
   * Randomly fills quadrille with pattern up to order.
   * @param {number} order 
   * @param {p5.Image | p5.Graphics | p5.Color | Array | object | string | number} pattern 
   * @see order
   */
  rand(order, pattern) {
    if (pattern === null || pattern === undefined) return;
    order = Math.abs(order);
    if (order > this.size) {
      order = this.size;
    }
    let disorder = this.order;
    let counter = 0;
    while (counter < Math.abs(order - disorder)) {
      let _ = this._fromIndex(Math.floor(Math.random() * this.size));
      if (order > disorder ? !this._memory2D[_.row][_.col] : this._memory2D[_.row][_.col]) {
        this._memory2D[_.row][_.col] = order > disorder ? pattern : null;
        counter++;
      }
    }
    return this;
  }

  /**
   * Randomly re-arranges cell entries.
   */
  randomize() {
    let clone = this.clone();
    this.clear();
    for (let i = 0; i < clone.height; i++) {
      for (let j = 0; j < clone.width; j++) {
        if (clone._memory2D[i][j] !== null && clone._memory2D[i][j] !== undefined) {
          let _i, _j;
          do {
            _i = int(random(this.height));
            _j = int(random(this.width));
          }
          while (this._memory2D[_i][_j]);
          this._memory2D[_i][_j] = clone._memory2D[i][j];
        }
      }
    }
    return this;
  }

  /**
   * Inserts an empty row.
   * @param {number} row 
   */
  insert(row) {
    this._memory2D.splice(row, 0, Array(this.width).fill(null));
    return this;
  }

  /**
   * Deletes the given row.
   * @param {number} row 
   */
  delete(row) {
    if (this.height > 1 && row >= 0 && row < this.height) {
      this._memory2D.splice(row, 1);
    }
    return this;
  }

  /**
   * Horizontal reflection.
   */
  reflect() {
    this._memory2D.reverse();
    return this;
  }

  /**
   * Transpose the quadrille.
   */
  transpose() {
    // credit goes to Fawad Ghafoor
    // who wrote about it here: https://stackoverflow.com/questions/17428587/transposing-a-2d-array-in-javascript
    this._memory2D = this._memory2D[0].map((_, i) => this._memory2D.map(row => row[i]));
    return this;
  }

  /**
   * π/2 clockwise rotation.
   */
  rotate() {
    // credit goes to Nitin Jadhav: https://github.com/nitinja
    // who wrote about it here: https://stackoverflow.com/questions/15170942/how-to-rotate-a-matrix-in-an-array-in-javascript/58668351#58668351
    this._memory2D = this._memory2D[0].map((_, i) => this._memory2D.map(row => row[i]).reverse());
    return this;
  }

  /**
   * Returns a shallow copy of this quadrille. May be used in conjunction with
   * {@link reflect} and {@link rotate} to create different quadrille instances.
   */
  clone() {
    return new Quadrille(this._memory2D.map(array => { return array.slice(); }));
  }

  /**
   * Sort cells according to their coloring. Modes are: 'LUMA', 'AVG' and 'DISTANCE' (to a given target).
   */
  sort({
    mode = 'LUMA',
    target = this.OUTLINE,
    ascending = true,
    textColor = this.TEXT_COLOR,
    textZoom = this.TEXT_ZOOM,
    background = this.BACKGROUND,
    cellLength = this.width
  } = {}) {
    let memory1D = this.toArray();
    switch (mode) {
      case 'DISTANCE':
        memory1D.sort((cellA, cellB) => {
          let sa = Quadrille.sample({ cell: cellA, background: background, cellLength: cellLength, textColor: textColor, textZoom: textZoom });
          let sb = Quadrille.sample({ cell: cellB, background: background, cellLength: cellLength, textColor: textColor, textZoom: textZoom });
          let wa = Math.sqrt(Math.pow((sa.r / sa.total) - red(target), 2) + Math.pow((sa.g / sa.total) - green(target), 2) +
            Math.pow((sa.b / sa.total) - blue(target), 2) + Math.pow((sa.a / sa.total) - alpha(target), 2));
          let wb = Math.sqrt(Math.pow((sb.r / sb.total) - red(target), 2) + Math.pow((sb.g / sb.total) - green(target), 2) +
            Math.pow((sb.b / sb.total) - blue(target), 2) + Math.pow((sb.a / sb.total) - alpha(target), 2));
          return wa - wb;
        });
        break;
      case 'AVG':
        memory1D.sort((cellA, cellB) => {
          let sa = Quadrille.sample({ cell: cellA, background: background, cellLength: cellLength, textColor: textColor, textZoom: textZoom });
          let sb = Quadrille.sample({ cell: cellB, background: background, cellLength: cellLength, textColor: textColor, textZoom: textZoom });
          let wa = 0.333 * sa.r + 0.333 * sa.g + 0.333 * sa.b;
          let wb = 0.333 * sb.r + 0.333 * sb.g + 0.333 * sb.b;
          return wa - wb;
        });
        break;
      case 'LUMA':
      default:
        memory1D.sort((cellA, cellB) => {
          let sa = Quadrille.sample({ cell: cellA, background: background, cellLength: cellLength, textColor: textColor, textZoom: textZoom });
          let sb = Quadrille.sample({ cell: cellB, background: background, cellLength: cellLength, textColor: textColor, textZoom: textZoom });
          let wa = 0.299 * sa.r + 0.587 * sa.g + 0.114 * sa.b;
          let wb = 0.299 * sb.r + 0.587 * sb.g + 0.114 * sb.b;
          return wa - wb;
        });
        break;
    }
    this._init1D(memory1D = ascending ? memory1D : memory1D.reverse(), this.width);
    return this;
  }

  /**
   * Sample cell using background as the {r, g, b, a, total} object literal.
   */
  static sample({
    cell,
    imageDisplay = this.IMAGE,
    colorDisplay = this.COLOR,
    stringDisplay = this.STRING,
    numberDisplay = this.NUMBER,
    arrayDisplay,
    objectDisplay,
    background = this.BACKGROUND,
    cellLength = this.CELL_LENGTH,
    outlineWeight = this.OUTLINE_WEIGHT,
    outline = this.OUTLINE,
    textColor = this.TEXT_COLOR,
    textZoom = this.TEXT_ZOOM
  } = {}) {
    let r, g, b, a;
    let pg = createGraphics(cellLength, cellLength);
    pg.background(background);
    if (imageDisplay && (cell instanceof p5.Image || cell instanceof p5.Graphics)) {
      imageDisplay({ graphics: pg, cell: cell, outline: outline, outlineWeight: outlineWeight, cellLength: cellLength });
    }
    else if (colorDisplay && cell instanceof p5.Color) {
      colorDisplay({ graphics: pg, cell: cell, outline: outline, outlineWeight: outlineWeight, cellLength: cellLength });
    }
    else if (numberDisplay && typeof cell === 'number') {
      numberDisplay({ graphics: pg, cell: cell, outline: outline, outlineWeight: outlineWeight, cellLength: cellLength });
    }
    else if (stringDisplay && typeof cell === 'string') {
      stringDisplay({ graphics: pg, cell: cell, textColor: textColor, textZoom: textZoom, outline: outline, outlineWeight: outlineWeight, cellLength: cellLength });
    }
    else if (arrayDisplay && Array.isArray(cell)) {
      arrayDisplay({ graphics: pg, cell: cell, outline: outline, outlineWeight: outlineWeight, cellLength: cellLength });
    }
    else if (objectDisplay && typeof cell === 'object') {
      objectDisplay({ graphics: pg, cell: cell, outline: outline, outlineWeight: outlineWeight, cellLength: cellLength });
    }
    pg.loadPixels();
    r = g = b = a = 0;
    let total = pg.pixels.length / 4;
    for (let i = 0; i < total; i++) {
      r += pg.pixels[4 * i];
      g += pg.pixels[4 * i + 1];
      b += pg.pixels[4 * i + 2];
      a += pg.pixels[4 * i + 3];
    }
    pg.updatePixels();
    return { r, g, b, a, total };
  }

  /**
   * Number cell drawing.
   */
  static NUMBER({
    graphics,
    cell,
    cellLength = this.CELL_LENGTH
  } = {}) {
    Quadrille.COLOR({ graphics: graphics, cell: graphics.color(graphics.constrain(cell, 0, 255)), cellLength: cellLength });
  }

  /**
   * Color cell drawing.
   */
  static COLOR({
    graphics,
    cell,
    cellLength = this.CELL_LENGTH
  } = {}) {
    graphics.noStroke();
    graphics.fill(cell);
    graphics.rect(0, 0, cellLength, cellLength);
  }

  /**
   * Image cell drawing.
   */
  static IMAGE({
    graphics,
    cell,
    cellLength = this.CELL_LENGTH
  } = {}) {
    graphics.noStroke();
    graphics.image(cell, 0, 0, cellLength, cellLength);
  }

  /**
   * String cell drawing.
   */
  static STRING({
    graphics,
    cell,
    cellLength = this.CELL_LENGTH,
    textColor = this.TEXT_COLOR,
    textZoom = this.TEXT_ZOOM
  } = {}) {
    graphics.noStroke();
    graphics.fill(textColor);
    graphics.textSize(cellLength * textZoom / cell.length);
    graphics.textAlign(CENTER, CENTER);
    graphics.text(cell, 0, 0, cellLength, cellLength);
  }

  /**
   * Tesselation or tiling. Used by the drawQuadrille board property.
   */
  static TILE({
    graphics,
    cellLength = this.CELL_LENGTH,
    outline = this.OUTLINE,
    outlineWeight = this.OUTLINE_WEIGHT
  } = {}) {
    if (outlineWeight !== 0) {
      graphics.noFill();
      graphics.stroke(outline);
      graphics.strokeWeight(outlineWeight);
      graphics.rect(0, 0, cellLength, cellLength);
    }
  }
}

// Details here:
// https://github.com/processing/p5.js/blob/main/contributor_docs/creating_libraries.md
(function () {
  const INFO =
  {
    LIBRARY: 'p5.quadrille.js',
    VERSION: '2.0.0',
    HOMEPAGE: 'https://github.com/objetos/p5.quadrille.js'
  };

  console.log(INFO);

  p5.prototype.createQuadrille = function () {
    return new Quadrille(...arguments);
  }

  p5.prototype.drawQuadrille = function (quadrille, {
    graphics = this,
    x = 0,
    y = 0,
    tileDisplay = Quadrille.TILE,
    imageDisplay = Quadrille.IMAGE,
    colorDisplay = Quadrille.COLOR,
    stringDisplay = Quadrille.STRING,
    numberDisplay = Quadrille.NUMBER,
    arrayDisplay,
    objectDisplay,
    cellLength = Quadrille.CELL_LENGTH,
    outlineWeight = Quadrille.OUTLINE_WEIGHT,
    outline = Quadrille.OUTLINE,
    textColor = Quadrille.TEXT_COLOR,
    textZoom = Quadrille.TEXT_ZOOM
  } = {}) {
    graphics.push();
    graphics.translate(x, y);
    for (let i = 0; i < quadrille.height; i++) {
      for (let j = 0; j < quadrille.width; j++) {
        graphics.push();
        graphics.translate(j * cellLength, i * cellLength);
        let cell = quadrille._memory2D[i][j];
        if (imageDisplay && (cell instanceof p5.Image || cell instanceof p5.Graphics)) {
          imageDisplay({ graphics: graphics, cell: cell, outline: outline, outlineWeight: outlineWeight, cellLength: cellLength, row: i, col: j });
        }
        else if (colorDisplay && cell instanceof p5.Color) {
          colorDisplay({ graphics: graphics, cell: cell, outline: outline, outlineWeight: outlineWeight, cellLength: cellLength, row: i, col: j });
        }
        else if (numberDisplay && typeof cell === 'number') {
          numberDisplay({ graphics: graphics, cell: cell, outline: outline, outlineWeight: outlineWeight, cellLength: cellLength, row: i, col: j });
        }
        else if (stringDisplay && typeof cell === 'string') {
          stringDisplay({ graphics: graphics, cell: cell, textColor: textColor, textZoom: textZoom, outline: outline, outlineWeight: outlineWeight, cellLength: cellLength, row: i, col: j });
        }
        else if (arrayDisplay && Array.isArray(cell)) {
          arrayDisplay({ graphics: graphics, cell: cell, outline: outline, outlineWeight: outlineWeight, cellLength: cellLength, row: i, col: j });
        }
        else if (objectDisplay && typeof cell === 'object') {
          objectDisplay({ graphics: graphics, cell: cell, outline: outline, outlineWeight: outlineWeight, cellLength: cellLength, row: i, col: j });
        }
        if (tileDisplay) {
          tileDisplay({ graphics: graphics, outline: outline, outlineWeight: outlineWeight, cellLength: cellLength, row: i, col: j });
        }
        graphics.pop();
      }
    }
    graphics.pop();
  }

  p5.prototype.visitQuadrille = function (quadrille, fx, cells) {
    const _cells = new Set(cells);
    for (let i = 0; i < quadrille.height; i++) {
      for (let j = 0; j < quadrille.width; j++) {
        const cell = quadrille._memory2D[i][j];
        if (cells) {
          if (_cells.has(cell)) {
            fx(quadrille, { cell: cell, row: i, col: j });
          }
        }
        else {
          fx(quadrille, { cell: cell, row: i, col: j });
        }
      }
    }
  }
})();