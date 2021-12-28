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
  static version = '0.9.2';

  /**
   * Default background used in sort.
   */
  static BACKGROUND = 'white';

  /**
   * Default drawing char color.
   */
  static CHAR_COLOR = 'cyan';

  /**
  * Default drawing number color.
  */
  static NUMBER_COLOR = 'orange';

  /**
   * Default drawing outline.
   */
  static OUTLINE = 'magenta';

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
   * @param {p5.Image | p5.Color  Array | string | number} pattern used to fill the returned quadrille.
   * @returns {Quadrille} the Quadrille obtained after applying a logic NEG operation on the given quadrille.
   */
  static NEG(quadrille, pattern) {
    let result = new Quadrille(quadrille.width, quadrille.height);
    for (let i = 0; i < quadrille.height; i++) {
      for (let j = 0; j < quadrille.width; j++) {
        if (!quadrille._memory2D[i][j]) {
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
    for (let i = 0; i < quadrille._memory2D.length; i++) {
      for (let j = 0; j < quadrille._memory2D[i].length; j++) {
        let result = operator(quadrille1.read(row < 0 ? i + row : i, col < 0 ? j + col : j), quadrille2.read(row > 0 ? i - row : i, col > 0 ? j - col : j));
        if (result) {
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
   * 2. Pass array or matrix of patterns (p5 colors, 4-length color arrays, chars, emojis and numbers).
   * 3. Pass width and string.
   * 4. Pass width and an array of patterns (p5 colors, 4-length color arrays, chars, emojis and numbers).
   * 5. Pass width and heigth to construct and empty quadrille (filled with 0's).
   * 6. Pass width and image, to construct a quadrille filled image.
   * 7. Pass width, bitboard and pattern, to construct a quadrille filled with pattern from the given bitboard.
   * 8. Pass width, height, order and pattern, to construct a quadrille filled with pattern of the given order.
   * @see from
   * @see rand
   * @see order
   */
  constructor() {
    if (arguments.length === 1) {
      if (typeof arguments[0] === 'string') {
        this._init1D([...arguments[0]]);
        return;
      }
      if (Array.isArray(arguments[0])) {
        if (!Array.isArray(arguments[0][0])) {
          this._init1D(arguments[0]);
          return;
        }
        let memory2D = arguments[0].map(array => { return array.slice(); });
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
        return;
      }
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
      this._memory2D = Array(arguments[1]).fill().map(() => Array(arguments[0]).fill(0));
      return;
    }
    if (arguments.length === 2 && typeof arguments[0] === 'number' && typeof arguments[1] !== 'number') {
      this._memory2D = Array(Math.round(arguments[0] * arguments[1].height / arguments[1].width)).fill().map(() => Array(arguments[0]).fill(0));
      this.from(arguments[1]);
      return;
    }
    if (arguments.length === 3 && typeof arguments[0] === 'number' && typeof arguments[1] === 'number') {
      this._memory2D = Array(Math.ceil(arguments[1].toString(2).length / arguments[0])).fill().map(() => Array(arguments[0]).fill(0));
      this.from(arguments[1], arguments[2]);
      return;
    }
    if (arguments.length === 4 && typeof arguments[0] === 'number' && typeof arguments[1] === 'number' && typeof arguments[2] === 'number') {
      this._memory2D = Array(arguments[1]).fill().map(() => Array(arguments[0]).fill(0));
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
      if (typeof memory1D[i] !== 'number' && typeof memory1D[i] !== 'string' && !Array.isArray(memory1D[i])
        && !(memory1D[i] instanceof p5.Color) && !(memory1D[i] instanceof p5.Image)) {
        memory1D[i] = 0;
      }
    }
    if (memory1D.length < size) {
      return memory1D.concat(new Array(size - memory1D.length).fill(0));
    }
    return memory1D;
  }

  /**
   * Converts image (p5.Image) or bitboard (integer) to quadrille. Forms:
   * 1. from(image); or,
   * 2. from(bitboard, pattern) where pattern may be either a p5.Image, p5.Color,
   * a 4-length color array, a string (emoji) or a number.
   */
  from() {
    if (arguments.length === 1 && arguments[0] instanceof p5.Image) {
      // a. image
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
        this._memory2D[_.row][_.col] = [r, g, b, a];
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
          this._memory2D[i][j] = [r[i][j] / t[i][j], g[i][j] / t[i][j], b[i][j] / t[i][j], a[i][j] / t[i][j]];
        }
      }
      // */
    }
    // b. bitboard, pattern
    if (arguments.length === 2 && typeof arguments[0] === 'number') {
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
        if (this._memory2D[i][j]) {
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
   * @returns {Array} Quadrille matrix (Array2D) representation.
   */
  toMatrix() {
    return this.clone()._memory2D;
  }

  // TODO toAscii()

  /**
   * @returns {number} quadrille width, i.e., number of columns.
   */
  get width() {
    return this._memory2D[0].length;
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
        if (this._memory2D[i][j]) {
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
      if (this._memory2D[row][j]) {
        result++;
      }
    }
    return result;
  }

  // TODO isPolyomino

  /**
   * Search pattern1 and replaces with pattern2, pattern1 and pattern2 may be
   * either a p5.Image, p5.Color, a 4-length color array, a string (emoji) or a number.
   */
  replace(pattern1, pattern2) {
    for (let i = 0; i < this.height; i++) {
      for (let j = 0; j < this.width; j++) {
        if (this._memory2D[i][j] === pattern1) {
          this._memory2D[i][j] = pattern2;
        }
      }
    }
  }

  /**
   * Fills quadrille cells with given pattern. Either:
   * 1. fill(pattern), fills current filled cells;
   * 2. fill(row, pattern), fills row; or,
   * 3. fill(row, col, pattern), fills cell.
   * pattern may be either a p5.Image, a p5.Color, a 4-length color array, a string (emoji) or a number.
   */
  fill() {
    if (arguments.length === 1) {
      for (let i = 0; i < this.height; i++) {
        for (let j = 0; j < this.width; j++) {
          if (this._memory2D[i][j]) {
            this._memory2D[i][j] = arguments[0];
          }
        }
      }
    }
    if (arguments.length === 2 && typeof arguments[0] === 'number') {
      if (arguments[0] >= 0 && arguments[0] < this.height) {
        this._memory2D[arguments[0]].fill(arguments[1]);
      }
    }
    if (arguments.length === 3 && typeof arguments[0] === 'number' && typeof arguments[1] === 'number') {
      if (arguments[0] >= 0 && arguments[0] < this.height && arguments[1] >= 0 && arguments[1] < this.width) {
        this._memory2D[arguments[0]][arguments[1]] = arguments[2];
      }
    }
  }

  /**
   * @param {number} row 
   * @param {number} col 
   * @returns {p5.Image | p5.Color | Array | string | number} quadrille entry
   */
  read(row, col) {
    if (row >= 0 && row < this.height && col >= 0 && col < this.width) {
      return this._memory2D[row][col];
    }
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
          let neighbour = this._memory2D[i][j];
          let mask_value = mask._memory2D[imask][jmask];
          if ((neighbour instanceof p5.Color || Array.isArray(neighbour)) &&
            typeof mask_value !== 'string' && !(mask_value instanceof p5.Image)) {
            // luma coefficients are: 0.299, 0.587, 0.114, 0
            let weight = typeof mask_value === 'number' ? mask_value : 0.299 * red(mask_value) + 0.587 * green(mask_value) + 0.114 * blue(mask_value);
            r += red(neighbour) * weight;
            g += green(neighbour) * weight;
            b += blue(neighbour) * weight;
          }
        }
      }
      r = constrain(r, 0, 255);
      g = constrain(g, 0, 255);
      b = constrain(b, 0, 255);
      //this._memory2D[row][col] = [r, g, b];
      this._memory2D[row][col] = color(r, g, b);
    }
  }

  /**
   * Rasterize the (row0, col0), (row1, col1), (row2, col2) triangle,
   * using pattern0, pattern1 and pattern2 vertex patterns, respectively.
   */
  rasterize(row0, col0, row1, col1, row2, col2, pattern0, pattern1 = pattern0, pattern2 = pattern0) {
    if ((pattern0 instanceof p5.Color || Array.isArray(pattern0)) &&
      (pattern1 instanceof p5.Color || Array.isArray(pattern1)) &&
      (pattern2 instanceof p5.Color || Array.isArray(pattern2))) {
      for (let i = 0; i < this.height; i++) {
        for (let j = 0; j < this.width; j++) {
          let coords = this._barycentric_coords(j, i, row0, col0, row1, col1, row2, col2);
          if (coords.w0 >= 0 && coords.w1 >= 0 && coords.w2 >= 0) {
            let r = red(pattern0) * coords.w0 + red(pattern1) * coords.w1 + red(pattern2) * coords.w2;
            let g = green(pattern0) * coords.w0 + green(pattern1) * coords.w1 + green(pattern2) * coords.w2;
            let b = blue(pattern0) * coords.w0 + blue(pattern1) * coords.w1 + blue(pattern2) * coords.w2;
            let a = alpha(pattern0) * coords.w0 + alpha(pattern1) * coords.w1 + alpha(pattern2) * coords.w2;
            //this._memory2D[i][j] = [r, g, b, a];
            this._memory2D[i][j] = color(r, g, b, a);
          }
        }
      }
    }
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
   * @param {p5.Image | p5.Color | Array | string | number} pattern 
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
      if (order > disorder ? !this._memory2D[_.row][_.col] : this._memory2D[_.row][_.col]) {
        this._memory2D[_.row][_.col] = order > disorder ? pattern : 0;
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
        if (clone._memory2D[i][j]) {
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
  }

  /**
   * Inserts an empty row.
   * @param {number} row 
   */
  insert(row) {
    this._memory2D.splice(row, 0, Array(this.width).fill(0));
  }

  /**
   * Deletes the given row.
   * @param {number} row 
   */
  delete(row) {
    if (this.height > 1 && row >= 0 && row < this.height) {
      this._memory2D.splice(row, 1);
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
      this._memory2D[arguments[0]].fill(0);
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
   * Returns a shallow copy of this quadrille. May be used in conjunction with
   * {@link reflect} and {@link rotate} to create different quadrille instances.
   */
  clone() {
    return new Quadrille(this._memory2D.map(array => { return array.slice(); }));
  }

  /**
   * Sort cells according to their coloring. Modes are: 'LUMA', 'AVG' and 'DISTANCE' (to a given target).
   */
  sort({ mode = 'LUMA', target = 'magenta', ascending = true, charColor = 'black', background = this.BACKGROUND, cellLength = this.width, numberColor = this.numberColor, min = 0, max = 0 } = {}) {
    let memory1D = this.toArray();
    switch (mode) {
      case 'DISTANCE':
        memory1D.sort((cellA, cellB) => {
          let sa = Quadrille.sample({ cell: cellA, background: background, cellLength: cellLength, charColor: charColor, numberColor: numberColor, min: min, max: max });
          let sb = Quadrille.sample({ cell: cellB, background: background, cellLength: cellLength, charColor: charColor, numberColor: numberColor, min: min, max: max });
          let wa = Math.sqrt(Math.pow((sa.r / sa.total) - red(target), 2) + Math.pow((sa.g / sa.total) - green(target), 2) +
            Math.pow((sa.b / sa.total) - blue(target), 2) + Math.pow((sa.a / sa.total) - alpha(target), 2));
          let wb = Math.sqrt(Math.pow((sb.r / sb.total) - red(target), 2) + Math.pow((sb.g / sb.total) - green(target), 2) +
            Math.pow((sb.b / sb.total) - blue(target), 2) + Math.pow((sb.a / sb.total) - alpha(target), 2));
          return wa - wb;
        });
        break;
      case 'AVG':
        memory1D.sort((cellA, cellB) => {
          let sa = Quadrille.sample({ cell: cellA, background: background, cellLength: cellLength, charColor: charColor, numberColor: numberColor, min: min, max: max });
          let sb = Quadrille.sample({ cell: cellB, background: background, cellLength: cellLength, charColor: charColor, numberColor: numberColor, min: min, max: max });
          let wa = 0.333 * sa.r + 0.333 * sa.g + 0.333 * sa.b;
          let wb = 0.333 * sb.r + 0.333 * sb.g + 0.333 * sb.b;
          return wa - wb;
        });
        break;
      case 'LUMA':
      default:
        memory1D.sort((cellA, cellB) => {
          let sa = Quadrille.sample({ cell: cellA, background: background, cellLength: cellLength, charColor: charColor, numberColor: numberColor, min: min, max: max });
          let sb = Quadrille.sample({ cell: cellB, background: background, cellLength: cellLength, charColor: charColor, numberColor: numberColor, min: min, max: max });
          let wa = 0.299 * sa.r + 0.587 * sa.g + 0.114 * sa.b;
          let wb = 0.299 * sb.r + 0.587 * sb.g + 0.114 * sb.b;
          return wa - wb;
        });
        break;
    }
    this._init1D(memory1D = ascending ? memory1D : memory1D.reverse(), this.width);
  }

  /**
   * Sample cell using background as the {r, g, b, a, total} object literal.
   */
  static sample({ cell, charColor = 'black', background = this.BACKGROUND, cellLength = this.CELL_LENGTH, numberColor = this.numberColor, min = 0, max = 0 } = {}) {
    let r, g, b, a;
    let pg = createGraphics(cellLength, cellLength);
    pg.background(background);
    if (cell instanceof p5.Color || Array.isArray(cell)) {
      Quadrille.COLOR({ graphics: pg, outlineWeight: 0, cell: cell, cellLength: cellLength });
    }
    else if (cell instanceof p5.Image) {
      Quadrille.IMAGE({ graphics: pg, outlineWeight: 0, cell: cell, cellLength: cellLength });
    }
    else if (typeof cell === 'string') {
      Quadrille.CHAR({ graphics: pg, charColor: charColor, outlineWeight: 0, cell: cell, cellLength: cellLength });
    }
    else if (typeof cell === 'number') {
      Quadrille.NUMBER({ graphics: pg, outlineWeight: 0, cell: cell, cellLength: cellLength, numberColor: numberColor, min: min, max: max });
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
   * Color cell drawing.
   */
  static COLOR({
    graphics,
    cell = color('red'),
    cellLength = this.CELL_LENGTH,
    outline = this.OUTLINE,
    outlineWeight = this.OUTLINE_WEIGHT
  } = {}) {
    graphics.push();
    graphics.stroke(outline);
    graphics.strokeWeight(outlineWeight);
    graphics.fill(cell);
    graphics.rect(0, 0, cellLength, cellLength);
    graphics.pop();
  }

  /**
   * Image cell drawing.
   */
  static IMAGE({
    graphics,
    cell = null,
    outline = this.OUTLINE,
    outlineWeight = this.OUTLINE_WEIGHT,
    cellLength = this.CELL_LENGTH
  } = {}) {
    if (cell) {
      graphics.push();
      graphics.image(cell, 0, 0, cellLength, cellLength);
      graphics.pop();
      if (outlineWeight !== 0) {
        graphics.push();
        graphics.noFill();
        graphics.stroke(outline);
        graphics.strokeWeight(outlineWeight);
        graphics.rect(0, 0, cellLength, cellLength);
        graphics.pop();
      }
    }
  }

  /**
   * Char cell drawing.
   */
  static CHAR({
    graphics,
    cell = '?',
    charColor = this.CHAR_COLOR,
    outline = this.OUTLINE,
    outlineWeight = this.OUTLINE_WEIGHT,
    cellLength = this.CELL_LENGTH
  } = {}) {
    graphics.push();
    graphics.noStroke();
    graphics.fill(charColor);
    graphics.textSize(cellLength);
    graphics.text(cell, 0, 0, cellLength, cellLength);
    graphics.pop();
    if (outlineWeight !== 0) {
      graphics.push();
      graphics.noFill();
      graphics.stroke(outline);
      graphics.strokeWeight(outlineWeight);
      graphics.rect(0, 0, cellLength, cellLength);
      graphics.pop();
    }
  }

  /**
   * Number cell drawing.
   */
  static NUMBER({
    graphics,
    cell = 0,
    outline = this.OUTLINE,
    outlineWeight = this.OUTLINE_WEIGHT,
    min = 0,
    max = 0,
    numberColor = this.NUMBER_COLOR,
    cellLength = this.CELL_LENGTH
  } = {}) {
    if (min < max) {
      graphics.push();
      graphics.colorMode(graphics.RGB, 255);
      graphics.fill(graphics.color(red(numberColor), green(numberColor), blue(numberColor), graphics.map(cell, min, max, 0, 255)));
      graphics.rect(0, 0, cellLength, cellLength);
      graphics.pop();
    }
    if (outlineWeight !== 0) {
      graphics.push();
      graphics.noFill();
      graphics.stroke(outline);
      graphics.strokeWeight(outlineWeight);
      graphics.rect(0, 0, cellLength, cellLength);
      graphics.pop();
    }
  }

  /**
   * Frame cell drawing. Used by the drawQuadrille board property.
   */
  static FRAME({
    graphics,
    outline = this.OUTLINE,
    outlineWeight = this.OUTLINE_WEIGHT,
    cellLength = this.CELL_LENGTH
  } = {}) {
    if (outlineWeight !== 0) {
      graphics.push();
      graphics.noFill();
      graphics.stroke(outline);
      graphics.strokeWeight(outlineWeight);
      graphics.rect(0, 0, cellLength, cellLength);
      graphics.pop();
    }
  }
}

// Details here:
// https://github.com/processing/p5.js/blob/main/contributor_docs/creating_libraries.md
(function () {
  p5.prototype.createQuadrille = function () {
    return new Quadrille(...arguments);
  }

  p5.prototype.drawQuadrille = function (quadrille,
    {
      graphics = this,
      pixelX = 0,
      pixelY = 0,
      row = 0,
      col = 0,
      cellLength = Quadrille.CELL_LENGTH,
      outlineWeight = Quadrille.OUTLINE_WEIGHT,
      outline = Quadrille.OUTLINE,
      charColor = Quadrille.CHAR_COLOR,
      board = false,
      numberColor = Quadrille.NUMBER_COLOR,
      min = 0,
      max = 0
    } = {}) {
    graphics.push();
    graphics.translate(pixelX > 0 ? pixelX : col * cellLength, pixelY > 0 ? pixelY : row * cellLength);
    for (let i = 0; i < quadrille._memory2D.length; i++) {
      for (let j = 0; j < quadrille._memory2D[i].length; j++) {
        graphics.push();
        graphics.translate(j * cellLength, i * cellLength);
        let cell = quadrille._memory2D[i][j];
        if (cell) {
          // Note that the Array.isArray(cell) condition should be rethought
          // once 3D Quadrilles appear.
          if (cell instanceof p5.Color || Array.isArray(cell)) {
            Quadrille.COLOR({ graphics: graphics, cell: cell, outline: outline, outlineWeight: outlineWeight, cellLength: cellLength });
          }
          else if (cell instanceof p5.Image) {
            Quadrille.IMAGE({ graphics: graphics, cell: cell, outline: outline, outlineWeight: outlineWeight, cellLength: cellLength });
          }
          else if (typeof cell === 'string') {
            Quadrille.CHAR({ graphics: graphics, cell: cell, charColor: charColor, outline: outline, outlineWeight: outlineWeight, cellLength: cellLength });
          }
          else if (typeof cell === 'number') {
            Quadrille.NUMBER({ graphics: graphics, cell: cell, outline: outline, outlineWeight: outlineWeight, numberColor: numberColor, min: min, max: max, cellLength: cellLength });
          }
        }
        else if (board) {
          Quadrille.FRAME({ graphics: graphics, outline: outline, outlineWeight: outlineWeight, cellLength: cellLength });
        }
        graphics.pop();
      }
    }
    graphics.pop();
  }
})();