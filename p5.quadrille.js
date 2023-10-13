'use strict';

class Quadrille {
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
   * Default background used in sort.
   */
  static BACKGROUND = 'black';

  /**
   * @param {Quadrille} quadrille1 
   * @param {Quadrille} quadrille2 
   * @param {number} row respect to quadrille1 origin
   * @param {number} col respect to quadrille1 origin
   * @returns {Quadrille} the smallest Quadrille obtained after applying a logic AND operation on the two given quadrilles.
   */
  static AND(quadrille1, quadrille2, row, col) {
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
  static OR(quadrille1, quadrille2, row, col) {
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
  static XOR(quadrille1, quadrille2, row, col) {
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
  static DIFF(quadrille1, quadrille2, row, col) {
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
   * @param {p5.Image | p5.Graphics | p5.Color | Array | object | string | number} value used to fill the returned quadrille.
   * @returns {Quadrille} the Quadrille obtained after applying a logic NEG operation on the given quadrille.
   */
  static NEG(quadrille, value) {
    if (value === undefined) return;
    let result = new Quadrille(quadrille.width, quadrille.height);
    visitQuadrille(quadrille, (row, col) => {
      if (quadrille.isEmpty(row, col)) {
        result.fill(row, col, value);
      }
    });
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
  static OP(quadrille1, quadrille2, operator, row, col) {
    row = row ?? ((quadrille1._row !== undefined && quadrille2._row !== undefined && quadrille1._cellLength !== undefined &&
      quadrille1._cellLength === quadrille2._cellLength) ? quadrille2._row - quadrille1._row : 0);
    col = col ?? ((quadrille1._col !== undefined && quadrille2._col !== undefined && quadrille1._cellLength !== undefined &&
      quadrille1._cellLength === quadrille2._cellLength) ? quadrille2._col - quadrille1._col : 0);
    // i. create resulted quadrille
    let quadrille = new Quadrille(col < 0 ? Math.max(quadrille2.width, quadrille1.width - col) : Math.max(quadrille1.width, quadrille2.width + col),
      row < 0 ? Math.max(quadrille2.height, quadrille1.height - row) : Math.max(quadrille1.height, quadrille2.height + row));
    // ii. fill result with passed quadrilles
    visitQuadrille(quadrille, (i, j) => quadrille.fill(i, j, operator(quadrille1.read(row < 0 ? i + row : i, col < 0 ? j + col : j), quadrille2.read(row > 0 ? i - row : i, col > 0 ? j - col : j))));
    // iii. return resulted quadrille
    return quadrille;
  }

  /**
   * Constructs either an empty or a filled quadrille:
   * 1. Pass string.
   * 2. Pass array or matrix (of colors, images, graphics, arrays, objects, strings, numbers and null).
   * 3. Pass width and string.
   * 4. Pass width and an array (of colors, images, graphics arrays, objects, strings, numbers and null).
   * 5. Pass width and heigth to construct and empty quadrille (filled with null's).
   * 6. Pass width and image, to construct a quadrille filled image.
   * 7. Pass width, bitboard and value, to construct a quadrille filled with value from the given bitboard.
   * 8. Pass width, height, order and value, to construct a quadrille filled with value of the given order.
   * @see from
   * @see rand
   * @see order
   */
  constructor(...args) {
    this._cellLength = Quadrille.CELL_LENGTH;
    this._x = 0;
    this._y = 0;
    if (args.length === 1) {
      this.memory2D = args[0];
    }
    if (args.length === 2 && typeof args[0] === 'number') {
      if (typeof args[1] === 'string') {
        this._init1D([...args[1]], args[0]);
        return;
      }
      if (Array.isArray(args[1])) {
        this._init1D(args[1], args[0]);
        return;
      }
    }
    if (args.length === 2 && typeof args[0] === 'number' && typeof args[1] === 'number') {
      this._memory2D = Array(args[1]).fill().map(() => Array(args[0]).fill(null));
      return;
    }
    if (args.length === 2 && typeof args[0] === 'number' && typeof args[1] !== 'number') {
      this._memory2D = Array(Math.round(args[0] * args[1].height / args[1].width)).fill().map(() => Array(args[0]).fill(null));
      this.from(args[1]);
      return;
    }
    if (args.length === 3 && typeof args[0] === 'number' && typeof args[1] === 'number') {
      this._memory2D = Array(Math.ceil(args[1].toString(2).length / args[0])).fill().map(() => Array(args[0]).fill(null));
      this.from(args[1], args[2]);
      return;
    }
    if (args.length === 3 && typeof args[0] === 'number' && typeof args[1] !== 'number' && typeof args[2] === 'boolean') {
      this._memory2D = Array(Math.round(args[0] * args[1].height / args[1].width)).fill().map(() => Array(args[0]).fill(null));
      this.from(args[1], args[2]);
      return;
    }
    if (args.length === 4 && typeof args[0] === 'number' && typeof args[1] === 'number' && typeof args[2] === 'number') {
      this._memory2D = Array(args[1]).fill().map(() => Array(args[0]).fill(null));
      this.rand(args[2], args[3]);
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
      let memory2D = memory.map(array => array.slice());
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
    return this.clone(false)._memory2D;
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
    visitQuadrille(this, (row, col) => {
      if (this.isFilled(row, col)) {
        result++;
      }
    });
    return result;
  }

  get mouseRow() {
    return this.screenRow(mouseY);
  }

  get mouseCol() {
    return this.screenCol(mouseX);
  }

  [Symbol.iterator]() {
    let row = 0;
    let col = 0;
    const memory2D = this._memory2D;
    return {
      next() {
        if (row < memory2D.length) {
          if (col < memory2D[row].length) {
            return { value: { value: memory2D[row][col], row, col: col++ }, done: false };
          } else {
            row++;
            col = 0;
            return this.next();
          }
        }
        return { done: true };
      }
    };
  }

  /**
   * Screen y coordinate to quadrille row
   * @param {number} pixelY 
   * @param {number} y quadrille y coordinate origin
   * @param {number} cellLength 
   * @returns quadrille row
   */
  screenRow(pixelY, y, cellLength) {
    y ??= this._y ? this._y : 0;
    cellLength ??= this._cellLength ? this._cellLength : Quadrille.CELL_LENGTH;
    return floor((pixelY - y) / cellLength);
  }

  /**
   * Screen x coordinate to quadrille col
   * @param {number} pixelX 
   * @param {number} x quadrille x coordinate origin
   * @param {number} cellLength 
   * @returns quadrille col
   */
  screenCol(pixelX, x, cellLength) {
    x ??= this._x ? this._x : 0;
    cellLength ??= this._cellLength ? this._cellLength : Quadrille.CELL_LENGTH;
    return floor((pixelX - x) / cellLength);
  }

  /**
   * Converts image (p5.Image or p5.Graphics) or bitboard (integer) to quadrille. Forms:
   * 1. from(image, [coherence]); or,
   * 2. from(bitboard, value) where value may be either a p5.Image, p5.Graphics,
   * p5.Color, a 4-length color array, a string, a number or null.
   */
  from(...args) {
    if (args.length === 0) {
      console.warn('from always expects params');
      return;
    }
    // a. image
    if (args[0] instanceof p5.Image || args[0] instanceof p5.Graphics) {
      let image = new p5.Image(args[0].width, args[0].height);
      image.copy(args[0], 0, 0, args[0].width, args[0].height, 0, 0, args[0].width, args[0].height);
      args.length === 1 ? this._images(image) : args[1] ? this._pixelator1(image) : this._pixelator2(image);
    }
    // b. bitboard, value
    if (args.length === 2 && typeof args[0] === 'number' && args[1] !== undefined) {
      let length = this.width * this.height;
      let bitboard = Math.abs(Math.round(args[0]));
      if (bitboard.toString(2).length > length) {
        throw new Error('Value is to high to fill quadrille');
      }
      for (let i = 0; i <= length - 1; i++) {
        if ((bitboard & (1 << length - 1 - i))) {
          this.fill(this._fromIndex(i).row, this._fromIndex(i).col, args[1]);
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
      this.fill(_.row, _.col, color([r, g, b, a]));
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
    visitQuadrille(this, (row, col) =>
      this.fill(row, col, color([r[row][col] / t[row][col], g[row][col] / t[row][col], b[row][col] / t[row][col], a[row][col] / t[row][col]]))
    );
  }

  _images(image) {
    const cellWidth = image.width / this.width;
    const cellHeight = image.height / this.height;
    visitQuadrille(this, (row, col) => this.fill(row, col, image.get(col * cellWidth, row * cellHeight, cellWidth, cellHeight)));
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
    visitQuadrille(this, (row, col) => {
      if (this.isFilled(row, col)) {
        result += Math.pow(2, this.width * (this.height - row) - (col + 1));
      }
    });
    return result;
  }

  /**
   * @returns {Array} Quadrille representation.
   */
  toArray() {
    let memory2D = this.clone(false)._memory2D;
    let result = new Array();
    for (let i = 0; i < memory2D.length; i++) {
      result = result.concat(memory2D[i]);
    }
    return result;
  }

  /**
   * Convert this quadrille to an image.
   * @param {String} filename png or jpg
   * @param {Object} params drawing params
   */
  toImage(filename, {
    values,
    tileDisplay = Quadrille.TILE,
    imageDisplay = Quadrille.IMAGE,
    colorDisplay = Quadrille.COLOR,
    stringDisplay = Quadrille.STRING,
    numberDisplay = Quadrille.NUMBER,
    arrayDisplay,
    objectDisplay,
    cellLength,
    outlineWeight = Quadrille.OUTLINE_WEIGHT,
    outline = Quadrille.OUTLINE,
    textColor = Quadrille.TEXT_COLOR,
    textZoom = Quadrille.TEXT_ZOOM
  } = {}) {
    cellLength ??= this._cellLength ? this._cellLength : Quadrille.CELL_LENGTH;
    const graphics = createGraphics(this.width * cellLength, this.height * cellLength);
    drawQuadrille(this, {
      graphics, values, tileDisplay, imageDisplay, colorDisplay, stringDisplay, numberDisplay,
      arrayDisplay, objectDisplay, cellLength, outlineWeight, outline, textColor, textZoom
    });
    save(graphics, filename);
  }

  /**
   * @param {number} row.
   * @returns {number} Number of non-empty quadrille cells at row.
   */
  magnitude(row) {
    let result = 0;
    for (let j = 0; j < this.width; j++) {
      if (this.read(row, j)) {
        result++;
      }
    }
    return result;
  }

  /**
   * Returns a shallow copy of this quadrille. May be used in conjunction with
   * {@link reflect} and {@link rotate} to create different quadrille instances.
   */
  clone(cache = true) {
    let clone = new Quadrille(this._memory2D.map(array => array.slice()));
    if (cache) {
      clone._cellLength = this._cellLength;
      clone._x = this._x;
      clone._y = this._y;
      clone._col = this._col;
      clone._row = this._row;
    }
    return clone;
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
   * @returns {p5.Image | p5.Graphics | p5.Color | Array | object | string | number} quadrille entry or undefined id (row, col) is out of bounds
   */
  read(row, col) {
    if (row >= 0 && row < this.height && col >= 0 && col < this.width) {
      return this._memory2D[row][col];
    }
  }

  // TODO isPolyomino

  /**
   * @param {number} row 
   * @param {number} col 
   * @returns {boolean} true if cell is empty
   */
  isEmpty(row, col) {
    return this.read(row, col) === null;
  }

  /**
   * @param {number} row 
   * @param {number} col 
   * @returns {boolean} true if cell is filled
   */
  isFilled(row, col) {
    return this.read(row, col) !== null && this.read(row, col) !== undefined;
  }

  /**
   * @param {number} row 
   * @param {number} col 
   * @returns {boolean} true if cell has a number
   */
  isNumber(row, col) {
    return typeof this.read(row, col) === 'number';
  }

  /**
   * @param {number} row 
   * @param {number} col 
   * @returns {boolean} true if cell has a string
   */
  isString(row, col) {
    return typeof this.read(row, col) === 'string';
  }

  /**
   * @param {number} row 
   * @param {number} col 
   * @returns {boolean} true if cell has a color
   */
  isColor(row, col) {
    return this.read(row, col) instanceof p5.Color;
  }

  /**
   * @param {number} row 
   * @param {number} col 
   * @returns {boolean} true if cell has an array
   */
  isArray(row, col) {
    return Array.isArray(this.read(row, col));
  }

  /**
   * @param {number} row 
   * @param {number} col 
   * @returns {boolean} true if cell has an object
   */
  isObject(row, col) {
    return typeof this.read(row, col) === 'object';
  }

  /**
   * @param {number} row 
   * @param {number} col 
   * @returns {boolean} true if cell has an image
   */
  isImage(row, col) {
    return this.read(row, col) instanceof p5.Image || this.read(row, col) instanceof p5.Graphics;
  }

  /**
   * Pattern searching.
   * @param {Quadrille} pattern 
   * @param {boolean} strict tells whether the algorithm requires values to match (besides filled cells)
   * @returns an array of { row, col } object literals hits whose length may be 0 (no hits found).
   */
  search(pattern, strict = false) {
    const hits = [];
    visitQuadrille(this, (row, col) =>
      Quadrille.OP(pattern, this, (q1, q2) => {
        if (q1 && (strict ? q2 !== q1 : !q2)) {
          return q1;
        }
      }, -row, -col).order === 0 && hits.push({ row, col }));
    return hits;
  }

  /**
   * Searches and replace values. Either:
   * 1. replace(value), replaces non empty cells with value.
   * 2. replace(value1, value2), searches value1 and replaces with value2,
   * value1 and value2 may be either a p5.Image, p5.Graphics, p5.Color,
   * a 4-length color array, a string or a number.
   */
  replace(...args) {
    if (args.length === 1 && args[0] !== undefined) {
      visitQuadrille(this, (row, col) => {
        if (this.isFilled(row, col)) {
          this.fill(row, col, args[0]);
        }
      });
    }
    if (args.length === 2 && args[0] !== undefined && args[1] !== undefined) {
      visitQuadrille(this, (row, col) => {
        if (this.read(row, col) === args[0]) {
          this.fill(row, col, args[1]);
        }
      });
    }
    return this;
  }

  /**
   * Clear quadrille cells (fill them with null's). Either:
   * 1. clear(), clears current filled cells;
   * 2. clear(row), clears row; or,
   * 3. clear(row, col), clears cell.
   * 4. clear(row, col, directions), flood clearing using (row, col) cell value.
   * 5. clear(row, col, border), flood clearing (including borders) using (row, col) cell value.
   * 6. clear(row, col, directions, border), flood clearing (including borders) using (row, col) cell value.
   */
  clear(...args) {
    if (args.length === 0) {
      this._memory2D = this._memory2D.map(x => x.map(y => y = null));
    }
    if (args.length === 1 && typeof args[0] === 'number') {
      if (args[0] >= 0 && args[0] < this.height) {
        this._memory2D[args[0]].fill(null);
      }
    }
    if (args.length === 2 && typeof args[0] === 'number' && typeof args[1] === 'number') {
      if (args[0] >= 0 && args[0] < this.height && args[1] >= 0 && args[1] < this.width) {
        this._memory2D[args[0]][args[1]] = null;
      }
    }
    if (args.length === 3 && typeof args[0] === 'number' && typeof args[1] === 'number' &&
      typeof args[2] === 'number') {
      if (args[0] >= 0 && args[0] < this.height && args[1] >= 0 && args[1] < this.width) {
        this._flood(args[0], args[1], this._memory2D[args[0]][args[1]], null, args[2]);
      }
    }
    if (args.length === 3 && typeof args[0] === 'number' && typeof args[1] === 'number' &&
      typeof args[2] === 'boolean') {
      if (args[0] >= 0 && args[0] < this.height && args[1] >= 0 && args[1] < this.width) {
        this._flood(args[0], args[1], this._memory2D[args[0]][args[1]], null, 4, args[2]);
      }
    }
    if (args.length === 4 && typeof args[0] === 'number' && typeof args[1] === 'number' &&
      typeof args[2] === 'number' && typeof args[3] === 'boolean') {
      if (args[0] >= 0 && args[0] < this.height && args[1] >= 0 && args[1] < this.width) {
        this._flood(args[0], args[1], this._memory2D[args[0]][args[1]], null, args[2], args[3]);
      }
    }
    return this;
  }

  /**
   * Fills quadrille cells with given value. Either:
   * 1. fill(value), fills current empty cells;
   * 2. fill(row, value), fills row; or,
   * 3. fill(row, col, value), fills cell.
   * 4. fill(row, col, value, directions), flood filling without boder in the given number of directions,
   * using (row, col) cell value (either a p5.Image, a p5.Graphics, a p5.Color, a 4-length color array,
   * an object, a string or a number).
   * 5. fill(row, col, value, border), flood filling with (without) border in 4 directions using (row, col)
   * cell value (either a p5.Image, a p5.Graphics, a p5.Color, a 4-length color array, an object, a string or a number).
   * 6. fill(row, col, value, directions, border), flood filling with (without) border in the given number of directions
   * using (row, col) cell value (either a  p5.Image, a p5.Graphics, a p5.Color, a 4-length color array, an object,
   * a string or a number).
   */
  fill(...args) {
    if (args.length === 1 && args[0] !== undefined) {
      visitQuadrille(this, (row, col) => {
        if (this.isEmpty(row, col)) {
          this._memory2D[row][col] = args[0];
        }
      });
    }
    if (args.length === 2 && typeof args[0] === 'number' && args[1] !== undefined) {
      if (args[0] >= 0 && args[0] < this.height) {
        this._memory2D[args[0]].fill(args[1]);
      }
    }
    if (args.length === 3 && typeof args[0] === 'number' && typeof args[1] === 'number' &&
      args[2] !== undefined) {
      if (args[0] >= 0 && args[0] < this.height && args[1] >= 0 && args[1] < this.width) {
        this._memory2D[args[0]][args[1]] = args[2];
      }
    }
    if (args.length === 4 && typeof args[0] === 'number' && typeof args[1] === 'number' &&
      args[2] !== undefined && typeof args[3] === 'number') {
      if (args[0] >= 0 && args[0] < this.height && args[1] >= 0 && args[1] < this.width) {
        this._flood(args[0], args[1], this._memory2D[args[0]][args[1]], args[2], args[3]);
      }
    }
    if (args.length === 4 && typeof args[0] === 'number' && typeof args[1] === 'number' &&
      args[2] !== undefined && typeof args[3] === 'boolean') {
      if (args[0] >= 0 && args[0] < this.height && args[1] >= 0 && args[1] < this.width) {
        this._flood(args[0], args[1], this._memory2D[args[0]][args[1]], args[2], 4, args[3]);
      }
    }
    if (args.length === 5 && typeof args[0] === 'number' && typeof args[1] === 'number' &&
      args[2] !== undefined && typeof args[3] === 'number' && typeof args[4] === 'boolean') {
      if (args[0] >= 0 && args[0] < this.height && args[1] >= 0 && args[1] < this.width) {
        this._flood(args[0], args[1], this._memory2D[args[0]][args[1]], args[2], args[3], args[4]);
      }
    }
    return this;
  }

  _flood(row, col, value1, value2, directions = 4, border = false) {
    if (directions !== 4 && directions !== 8) {
      console.warn(`flood fill is using 4 directions instead of ${directions}, see: https://en.m.wikipedia.org/wiki/Flood_fill`);
      directions = 4;
    }
    if (row >= 0 && row < this.height && col >= 0 && col < this.width && this._memory2D[row][col] !== value2) {
      if (this._memory2D[row][col] === value1) {
        this._memory2D[row][col] = value2;
        this._flood(row, col - 1, value1, value2, directions, border);
        this._flood(row - 1, col, value1, value2, directions, border);
        this._flood(row, col + 1, value1, value2, directions, border);
        this._flood(row + 1, col, value1, value2, directions, border);
        if (directions === 8) {
          this._flood(row - 1, col - 1, value1, value2, directions, border);
          this._flood(row - 1, col + 1, value1, value2, directions, border);
          this._flood(row + 1, col + 1, value1, value2, directions, border);
          this._flood(row + 1, col - 1, value1, value2, directions, border);
        }
      }
      if (border) {
        this._memory2D[row][col] = value2;
      }
    }
  }

  // TODO perlin noise

  /**
   * Randomly fills quadrille with value for the specified number of times.
   * @param {number} times 
   * @param {p5.Image | p5.Graphics | p5.Color | Array | object | string | number} value 
   */
  rand(times, value = null) {
    if (value === undefined) return;
    times = Math.abs(times);
    const maxTimes = value === null ? this.order : this.size - this.order;
    if (times > maxTimes) {
      times = maxTimes;
    }
    let counter = 0;
    while (counter < times) {
      let _ = this._fromIndex(Math.floor(Math.random() * this.size));
      if (value === null ? this.isFilled(_.row, _.col) : this.isEmpty(_.row, _.col)) {
        value === null ? this.clear(_.row, _.col) : this.fill(_.row, _.col, value);
        counter++;
      }
    }
    return this;
  }

  /**
   * Randomly re-arranges cell entries.
   */
  randomize() {
    let clone = this.clone(false);
    this.clear();
    visitQuadrille(clone, (row, col) => {
      if (clone.isFilled(row, col)) {
        let _row, _col;
        do {
          _row = int(random(this.height));
          _col = int(random(this.width));
        }
        while (this.isFilled(_row, _col));
        this.fill(_row, _col, clone.read(row, col));
      }
    });
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
    // credit goes to Fawad Ghafoorwho wrote about it here:
    // https://stackoverflow.com/questions/17428587/transposing-a-2d-array-in-javascript
    this._memory2D = this._memory2D[0].map((_, i) => this._memory2D.map(row => row[i]));
    return this;
  }

  /**
   * π/2 clockwise rotation.
   */
  rotate() {
    // credit goes to Nitin Jadhav: https://github.com/nitinja who wrote about it here:
    // https://stackoverflow.com/questions/15170942/how-to-rotate-a-matrix-in-an-array-in-javascript/58668351#58668351
    this._memory2D = this._memory2D[0].map((_, i) => this._memory2D.map(row => row[i]).reverse());
    return this;
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
   * @param {number} row if undefined convolutes the whole quadrille
   * @param {number} col if undefined convolutes the whole quadrille
   */
  filter(mask, row, col) {
    if (mask.size % 2 === 1 && mask.width === mask.height && this.size >= mask.size) {
      let half_size = (mask.width - 1) / 2;
      if (row === undefined || col === undefined) {
        visitQuadrille(this, (i, j) => {
          if (i >= half_size && i < this.height - half_size && j >= half_size && j < this.width - half_size) {
            this._conv(mask, i, j, half_size)
          }
        });
      }
      else if (row >= half_size && row < this.height - half_size && col >= half_size && col < this.width - half_size) {
        this._conv(mask, row, col, half_size);
      }
    }
    return this;
  }

  _conv(mask, row, col, cache_half_size = (mask.width - 1) / 2) {
    let r = 0;
    let g = 0;
    let b = 0;
    for (let imask = 0; imask < mask.height; imask++) {
      for (let jmask = 0; jmask < mask.width; jmask++) {
        let i = row + imask - cache_half_size;
        let j = col + jmask - cache_half_size;
        let neighbor = this.read(i, j);
        let mask_value = mask.read(imask, jmask);
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
    this.fill(row, col, color(r, g, b));
  }

  /**
   * Colorize the (row0, col0), (row1, col1), (row2, col2) triangle, according to
   * color0, color1 and color2 colors (either p5.Color, arrays or strings), respectively.
   */
  colorizeTriangle(row0, col0, row1, col1, row2, col2, color0, color1 = color0, color2 = color0) {
    this.rasterizeTriangle(row0, col0, row1, col1, row2, col2,
      // Shader which colorizes the (row0, col0), (row1, col1), (row2, col2) triangle, according to the
      // array0.xyza, array1.xyza and array2.xyza interpolated color vertex arrays, respectively.
      ({ array: xyza }) => color(xyza), [red(color0), green(color0), blue(color0), alpha(color0)],
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
   * according to array0, array1 and array2 object vertex data (resp),
   * using (fragment) shader.
   */
  rasterizeTriangle(row0, col0, row1, col1, row2, col2, shader, array0, array1 = array0, array2 = array0) {
    if (Array.isArray(array0) && Array.isArray(array1) && Array.isArray(array2)) {
      visitQuadrille(this, (row, col) => {
        let coords = this._barycentric_coords(row, col, row0, col0, row1, col1, row2, col2);
        // interpolate all array attributes for the current cell only if it is inside the triangle
        if (coords.w0 >= 0 && coords.w1 >= 0 && coords.w2 >= 0) {
          let length = Math.max(array0.length, array1.length, array2.length);
          let array = new Array(length);
          for (let k = 0; k < array.length; k++) {
            array[k] = (array0[k] ?? 0) * coords.w0 + (array1[k] ?? 0) * coords.w1 + (array2[k] ?? 0) * coords.w2;
          }
          // call shader using the interpolated arrays to compute the current cell contents
          this.fill(row, col, shader({ array, row, col }));
        }
      });
    }
    return this;
  }

  /**
   * Rasterize quadrille according to upper-left corner vertex array0,
   * bottom-left corner vertex array1, upper-right corner vertex array2,
   * and bottom-right corner vertex array3, using (fragment) shader.
   */
  rasterize(shader, array0, array1 = array0, array2 = array0, array3 = array0) {
    this.rasterizeTriangle(0, 0, this.height - 1, 0, 0, this.width - 1, shader, array0, array1, array2);
    this.rasterizeTriangle(this.height - 1, 0, 0, this.width - 1, this.height - 1, this.width - 1, shader, array1, array2, array3);
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
        memory1D.sort((valueA, valueB) => {
          let sa = Quadrille.sample({ value: valueA, background, cellLength, textColor, textZoom });
          let sb = Quadrille.sample({ value: valueB, background, cellLength, textColor, textZoom });
          let wa = Math.sqrt(Math.pow((sa.r / sa.total) - red(target), 2) + Math.pow((sa.g / sa.total) - green(target), 2) +
            Math.pow((sa.b / sa.total) - blue(target), 2) + Math.pow((sa.a / sa.total) - alpha(target), 2));
          let wb = Math.sqrt(Math.pow((sb.r / sb.total) - red(target), 2) + Math.pow((sb.g / sb.total) - green(target), 2) +
            Math.pow((sb.b / sb.total) - blue(target), 2) + Math.pow((sb.a / sb.total) - alpha(target), 2));
          return wa - wb;
        });
        break;
      case 'AVG':
        memory1D.sort((valueA, valueB) => {
          let sa = Quadrille.sample({ value: valueA, background, cellLength, textColor, textZoom });
          let sb = Quadrille.sample({ value: valueB, background, cellLength, textColor, textZoom });
          let wa = 0.333 * sa.r + 0.333 * sa.g + 0.333 * sa.b;
          let wb = 0.333 * sb.r + 0.333 * sb.g + 0.333 * sb.b;
          return wa - wb;
        });
        break;
      case 'LUMA':
      default:
        memory1D.sort((valueA, valueB) => {
          let sa = Quadrille.sample({ value: valueA, background, cellLength, textColor, textZoom });
          let sb = Quadrille.sample({ value: valueB, background, cellLength, textColor, textZoom });
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
    value,
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
    let graphics = createGraphics(cellLength, cellLength);
    graphics.background(background);
    if (imageDisplay && (value instanceof p5.Image || value instanceof p5.Graphics)) {
      imageDisplay({ graphics, value, outline, outlineWeight, cellLength });
    }
    else if (colorDisplay && value instanceof p5.Color) {
      colorDisplay({ graphics, value, outline, outlineWeight, cellLength });
    }
    else if (numberDisplay && typeof value === 'number') {
      numberDisplay({ graphics, value, outline, outlineWeight, cellLength });
    }
    else if (stringDisplay && typeof value === 'string') {
      stringDisplay({ graphics, value, textColor, textZoom, outline, outlineWeight, cellLength });
    }
    else if (arrayDisplay && Array.isArray(value)) {
      arrayDisplay({ graphics, value, outline, outlineWeight, cellLength });
    }
    else if (objectDisplay && typeof value === 'object') {
      objectDisplay({ graphics, value, outline, outlineWeight, cellLength });
    }
    graphics.loadPixels();
    r = g = b = a = 0;
    let total = graphics.pixels.length / 4;
    for (let i = 0; i < total; i++) {
      r += graphics.pixels[4 * i];
      g += graphics.pixels[4 * i + 1];
      b += graphics.pixels[4 * i + 2];
      a += graphics.pixels[4 * i + 3];
    }
    graphics.updatePixels();
    return { r, g, b, a, total };
  }

  /**
   * Number cell drawing.
   */
  static NUMBER({
    graphics,
    value,
    cellLength = this.CELL_LENGTH
  } = {}) {
    Quadrille.COLOR({ graphics, value: graphics.color(graphics.constrain(value, 0, 255)), cellLength });
  }

  /**
   * Color cell drawing.
   */
  static COLOR({
    graphics,
    value,
    cellLength = this.CELL_LENGTH
  } = {}) {
    graphics.noStroke();
    graphics.fill(value);
    graphics.rect(0, 0, cellLength, cellLength);
  }

  /**
   * Image cell drawing.
   */
  static IMAGE({
    graphics,
    value,
    cellLength = this.CELL_LENGTH
  } = {}) {
    graphics.noStroke();
    graphics.image(value, 0, 0, cellLength, cellLength);
  }

  /**
   * String cell drawing.
   */
  static STRING({
    graphics,
    value,
    cellLength = this.CELL_LENGTH,
    textColor = this.TEXT_COLOR,
    textZoom = this.TEXT_ZOOM
  } = {}) {
    graphics.noStroke();
    graphics.fill(textColor);
    graphics.textSize(cellLength * textZoom / value.length);
    graphics.textAlign(CENTER, CENTER);
    graphics.text(value, 0, 0, cellLength, cellLength);
  }

  /**
   * Tesselation or tiling. Used by the drawQuadrille board property.
   */
  static TILE({
    graphics,
    row = 0,
    col = 0,
    width = 1,
    height = 1,
    cellLength = this.CELL_LENGTH,
    outline = this.OUTLINE,
    outlineWeight = this.OUTLINE_WEIGHT
  } = {}) {
    if (outlineWeight !== 0) {
      // modes                _                    _                _                _
      // 0 (last row & col): |_| 1 (inner cells): |  2 (last row): |_ 3 (last col): | |
      const mode = row === height - 1 && col === width - 1 ? 0 :
        row < height - 1 && col < width - 1 ? 1 : row === height - 1 && col < width - 1 ? 2 : 3;
      graphics.noFill();
      graphics.stroke(outline);
      graphics.strokeWeight(outlineWeight);
      graphics.beginShape();
      if (mode === 2) graphics.vertex(cellLength, cellLength);
      graphics.vertex(0, cellLength);
      graphics.vertex(0, 0);
      graphics.vertex(cellLength, 0);
      if (mode === 0 || mode === 3) graphics.vertex(cellLength, cellLength);
      mode === 0 ? graphics.endShape(CLOSE) : graphics.endShape();
    }
  }
}

// Details here:
// https://github.com/processing/p5.js/blob/main/contributor_docs/creating_libraries.md
(function () {
  const INFO =
  {
    LIBRARY: 'p5.quadrille.js',
    VERSION: '1.5.0',
    HOMEPAGE: 'https://github.com/objetos/p5.quadrille.js'
  };

  console.log(INFO);

  p5.prototype.createQuadrille = function (...args) {
    return new Quadrille(...args);
  }

  p5.prototype.drawQuadrille = function (quadrille, {
    graphics = this,
    x,
    y,
    row,
    col,
    values,
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
    quadrille._cellLength = cellLength;
    quadrille._x = x ? x : col ? col * cellLength : 0;
    quadrille._y = y ? y : row ? row * cellLength : 0;
    quadrille._col = Number.isInteger(col) ? col : Number.isInteger(quadrille._x / cellLength) ? quadrille._x / cellLength : undefined;
    quadrille._row = Number.isInteger(row) ? row : Number.isInteger(quadrille._y / cellLength) ? quadrille._y / cellLength : undefined;
    graphics.push();
    graphics.translate(quadrille._x, quadrille._y);
    visitQuadrille(quadrille, (row, col) => {
      graphics.push();
      graphics.translate(col * cellLength, row * cellLength);
      let value = quadrille.read(row, col);
      const params = {
        quadrille, graphics, outline, outlineWeight, cellLength, textColor, textZoom, value, row, col,
        width: quadrille.width, height: quadrille.height
      };
      if (imageDisplay && (value instanceof p5.Image || value instanceof p5.Graphics)) {
        imageDisplay(params);
      }
      else if (colorDisplay && value instanceof p5.Color) {
        colorDisplay(params);
      }
      else if (numberDisplay && typeof value === 'number') {
        numberDisplay(params);
      }
      else if (stringDisplay && typeof value === 'string') {
        stringDisplay(params);
      }
      else if (arrayDisplay && Array.isArray(value)) {
        arrayDisplay(params);
      }
      else if (objectDisplay && typeof value === 'object') {
        objectDisplay(params);
      }
      if (tileDisplay) {
        tileDisplay(params);
      }
      graphics.pop();
    }, values);
    graphics.pop();
  }

  p5.prototype.visitQuadrille = function (quadrille, fx, values) {
    values = new Set(values);
    for (let row = 0; row < quadrille.height; row++) {
      for (let col = 0; col < quadrille.width; col++) {
        if (values.size ? values.has(quadrille.read(row, col)) : true) {
          fx(row, col);
        }
      }
    }
  }
})();