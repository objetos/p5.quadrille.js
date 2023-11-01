'use strict';

class Quadrille {
  // STYLE 

  // TODOs
  // i. remove deprecated stuff
  // ii. prefer Quadrille.CONSTANT over this.CONSTANT ?

  /**
   * Default text color.
   */
  static textColor = 'DodgerBlue';

  /**
   * @deprecated Since version 2.0.0. Use {@link Quadrille.textColor} instead.
   */
  static get TEXT_COLOR() {
    console.warn('Deprecation Warning: TEXT_COLOR is deprecated. Please use textColor instead.');
    return Quadrille.textColor;
  }

  static set TEXT_COLOR(value) {
    Quadrille.textColor = value;
  }

  /**
   * Default text drawing zoom.
   */
  static textZoom = 0.89;

  /**
   * @deprecated Since version 2.0.0. Use {@link Quadrille.textZoom} instead.
   */
  static get TEXT_ZOOM() {
    console.warn('Deprecation Warning: TEXT_ZOOM is deprecated. Please use textZoom instead.');
    return Quadrille.textZoom;
  }

  static set TEXT_ZOOM(value) {
    Quadrille.textZoom = value;
  }

  /**
   * Default drawing outline.
   */
  static outline = 'OrangeRed';

  /**
   * @deprecated Since version 2.0.0. Use {@link Quadrille.outline} instead.
   */
  static get OUTLINE() {
    console.warn('Deprecation Warning: OUTLINE is deprecated. Please use outline instead.');
    return Quadrille.outline;
  }

  static set OUTLINE(value) {
    Quadrille.outline = value;
  }

  /**
   * Default drawing outline weight.
   */
  static outlineWeight = 2;

  /**
   * @deprecated Since version 2.0.0. Use {@link Quadrille.outlineWeight} instead.
   */
  static get OUTLINE_WEIGHT() {
    console.warn('Deprecation Warning: OUTLINE_WEIGHT is deprecated. Please use outlineWeight instead.');
    return Quadrille.outlineWeight;
  }

  static set OUTLINE_WEIGHT(value) {
    Quadrille.outlineWeight = value;
  }

  /**
   * Default drawing cell length.
   */
  static cellLength = 100;

  /**
   * @deprecated Since version 2.0.0. Use {@link Quadrille.cellLength} instead.
   */
  static get CELL_LENGTH() {
    console.warn('Deprecation Warning: CELL_LENGTH is deprecated. Please use cellLength instead.');
    return Quadrille.cellLength;
  }

  static set CELL_LENGTH(value) {
    Quadrille.cellLength = value;
  }

  /**
   * Default background used in sort.
   */
  static background = 'white';

  /**
   * @deprecated Since version 2.0.0. Use {@link Quadrille.background} instead.
   */
  static get BACKGROUND() {
    console.warn('Deprecation Warning: BACKGROUND is deprecated. Please use background instead.');
    return Quadrille.background;
  }

  static set BACKGROUND(value) {
    Quadrille.background = value;
  }

  // chess specific stuff

  /**
   * Default chess black squares.
   */
  static blackSquare = '#D28C45'; // wikipedia; '#769656' // chess.com

  /**
   * Default chess white squares.
   */
  static whiteSquare = '#FDCDAA'; // wikipedia; '#EEEED2' //chess.com

  static chessSymbols = {
    K: '♔', Q: '♕', R: '♖', B: '♗', N: '♘', P: '♙',
    k: '♚', q: '♛', r: '♜', b: '♝', n: '♞', p: '♟'
  };

  static chessKeys = Object.fromEntries(
    Object.entries(this.chessSymbols).map(([k, v]) => [v, k])
  );

  static setChessSymbols(chessSymbols) {
    this.chessSymbols = chessSymbols;
    this.chessKeys = Object.fromEntries(
      Object.entries(chessSymbols).map(([k, v]) => [v, k])
    );
  }

  /**
   * @deprecated since version 2.0. Use `and` instead.
   */
  static AND() {
    console.warn('Warning: AND is deprecated! Use and instead.');
    return this.and(...arguments);
  }

  /**
   * @param {Quadrille} quadrille1 
   * @param {Quadrille} quadrille2 
   * @param {number} row respect to quadrille1 origin
   * @param {number} col respect to quadrille1 origin
   * @returns {Quadrille} the smallest Quadrille obtained after applying a logic and operation on the two given quadrilles.
   */
  static and(quadrille1, quadrille2, row, col) {
    return this.merge(quadrille1, quadrille2,
      (q1, q2) => {
        if (q1 && q2) {
          return q1;
        }
      },
      row, col);
  }

  /**
   * @deprecated since version 2.0. Use `or` instead.
   */
  static OR() {
    console.warn('Warning: OR is deprecated! Use or instead.');
    return this.or(...arguments);
  }

  /**
   * @param {Quadrille} quadrille1 
   * @param {Quadrille} quadrille2 
   * @param {number} row respect to quadrille1 origin
   * @param {number} col respect to quadrille1 origin
   * @returns {Quadrille} the smallest Quadrille obtained after applying a logic or operation on the two given quadrilles.
   */
  static or(quadrille1, quadrille2, row, col) {
    return this.merge(quadrille1, quadrille2,
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
   * @deprecated since version 2.0. Use `xor` instead.
   */
  static XOR() {
    console.warn('Warning: XOR is deprecated! Use xor instead.');
    return this.xor(...arguments);
  }

  /**
   * @param {Quadrille} quadrille1 
   * @param {Quadrille} quadrille2 
   * @param {number} row respect to quadrille1 origin
   * @param {number} col respect to quadrille1 origin
   * @returns {Quadrille} the smallest Quadrille obtained after applying a logic xor operation on the two given quadrilles.
   */
  static xor(quadrille1, quadrille2, row, col) {
    return this.merge(quadrille1, quadrille2,
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
   * @deprecated since version 2.0. Use `diff` instead.
   */
  static DIFF() {
    console.warn('Warning: DIFF is deprecated! Use diff instead.');
    return this.diff(...arguments);
  }

  /**
   * @param {Quadrille} quadrille1 
   * @param {Quadrille} quadrille2 
   * @param {number} row respect to quadrille1 origin
   * @param {number} col respect to quadrille1 origin
   * @returns {Quadrille} the smallest Quadrille obtained after applying a logic diff operation on the two given quadrilles.
   */
  static diff(quadrille1, quadrille2, row, col) {
    return this.merge(quadrille1, quadrille2,
      (q1, q2) => {
        if (q1 && !q2) {
          return q1;
        }
      },
      row, col);
  }

  /**
   * @deprecated since version 2.0. Use `neg` instead.
   */
  static NEG() {
    console.warn('Warning: NEG is deprecated! Use neg instead.');
    return this.neg(...arguments);
  }

  /**
   * @param {Quadrille} quadrille 
   * @param {p5.Image | p5.Graphics | p5.Color | Array | object | string | number} value used to fill the returned quadrille.
   * @returns {Quadrille} the Quadrille obtained after applying a logic neg operation on the given quadrille.
   */
  static neg(quadrille, value) {
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
   * @deprecated since version 2.0. Use `merge` instead.
   */
  static OP() {
    console.warn('Warning: OP is deprecated! Use merge instead.');
    return this.merge(...arguments);
  }

  /**
   * @param {Quadrille} quadrille1 
   * @param {Quadrille} quadrille2 
   * @param {Function} operator function implementing the logic operator.
   * @param {number} row respect to quadrille1 origin
   * @param {number} col respect to quadrille1 origin
   * @returns {Quadrille} the smallest Quadrille obtained after applying the logic operator on the two given quadrilles.
   */
  static merge(quadrille1, quadrille2, operator, row, col) {
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
   * 1. Pass no params.
   * 2. Pass width and height to construct and empty quadrille (filled with null's).
   * 3. Pass jagged array (of colors, images, graphics, arrays, objects, strings, numbers and null).
   * 4. Pass array (of colors, images, graphics arrays, objects, strings, numbers and null).
   * 5. Pass width and array (of colors, images, graphics arrays, objects, strings, numbers and null).
   * 6. Pass fen.
   * 7. Pass string.
   * 8. Pass width and string.
   * 9. Pass width and image, to construct a quadrille filled with image.
   * 10. Pass width, image and boolean, to construct a quadrille from pixalated image.
   * 11. Pass width, height, order and value, to construct a quadrille filled with value of the given order.
   * 12. Pass width, BigInt (or int) and value, to construct a quadrille filled with value from the given BigInt.
   * @see rand
   * @see order
   */
  constructor(...args) {
    this._cellLength = this.constructor.cellLength;
    this._x = 0;
    this._y = 0;
    if (args.length === 0) {
      this._memory2D = Array(8).fill().map(() => Array(8).fill(null));
      visitQuadrille(this, (row, col) => this._memory2D[row][col] = color((row + col) % 2 === 0 ? this.constructor.whiteSquare : this.constructor.blackSquare));
    }
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
      this._fromImage(args[1]);
      return;
    }
    if (args.length === 3 && typeof args[0] === 'number' && typeof args[1] !== 'number' && typeof args[2] === 'boolean') {
      this._memory2D = Array(Math.round(args[0] * args[1].height / args[1].width)).fill().map(() => Array(args[0]).fill(null));
      this._fromImage(args[1], args[2]);
      return;
    }
    if (args.length === 3 && typeof args[0] === 'number' && (typeof args[1] === 'number' || typeof args[1] === 'bigint')) {
      this._memory2D = Array(Number((BigInt(args[1].toString(2).length) + BigInt(args[0]) - 1n) / BigInt(args[0]))).fill().map(() => Array(args[0]).fill(null));
      this._fromBigInt(args[1], args[2]);
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

  _fromBigInt(...args) {
    if (args.length === 2 && (typeof args[0] === 'number' || typeof args[0] === 'bigint') && args[1] !== undefined) {
      let length = this.width * this.height;
      let bigint = BigInt(args[0]);
      if (bigint < 0) {
        throw new Error('Value cannot be negative');
      }
      if (bigint.toString(2).length > length) {
        throw new Error('Value is too high to fill quadrille');
      }
      for (let i = 0; i <= length - 1; i++) {
        if ((bigint & (1n << BigInt(length) - 1n - BigInt(i)))) {
          this.fill(this._fromIndex(i).row, this._fromIndex(i).col, args[1]);
        }
      }
    }
  }

  _fromFEN(...args) {
    if (typeof args[0] === 'string') {
      if (args[0].split('/').length - 1 === 7) {
        const [placement] = args[0].split(' ');
        this._memory2D = Array(8).fill().map(() => Array(8).fill(null));
        const rows = placement.split('/');
        for (let i = 0; i < 8; i++) {
          let col = 0;
          for (const char of rows[i]) {
            if (isNaN(char)) {
              this._memory2D[i][col] = this.constructor.chessSymbols[char];
              col++;
            } else {
              col += parseInt(char);
            }
          }
        }
      }
    }
  }

  _fromImage(...args) {
    if (args[0] instanceof p5.Image || args[0] instanceof p5.Graphics) {
      let image = new p5.Image(args[0].width, args[0].height);
      image.copy(args[0], 0, 0, args[0].width, args[0].height, 0, 0, args[0].width, args[0].height);
      args.length === 1 ? this._images(image) : args[1] ? this._pixelator1(image) : this._pixelator2(image);
    }
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

  /**
   * Sets quadrille from 2D memory internal array representation.
   */
  set memory2D(memory) {
    if (typeof memory === 'string') {
      memory.split('/').length - 1 === 7 ? this._fromFEN(memory) : this._init1D([...memory]);
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
   * @param {number} row 
   * @returns row as a new quadrille
   */
  row(row) {
    if (row >= 0 && row < this.height) {
      return new Quadrille(this._memory2D[row]);
    }
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
    cellLength ??= this._cellLength || this.constructor.cellLength;
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
    cellLength ??= this._cellLength || this.constructor.cellLength;
    return floor((pixelX - x) / cellLength);
  }

  _fromIndex(index, width = this.width) {
    return { row: (index / width) | 0, col: index % width };
  }

  _toIndex(row, col, width = this.width) {
    return row * width + col;
  }

  /**
   * @deprecated since version 2.0. Use `toBigInt` instead.
   */
  toInt() {
    console.warn('Warning: toInt is deprecated! Use toBigInt instead.');
    return this.toBigInt(...arguments);
  }

  /**
   * @returns {bigint} integer representation using big-endian and row-major ordering
   * of the quadrille entries.
   */
  toBigInt() {
    let result = 0n;
    visitQuadrille(this, (row, col) => {
      if (this.isFilled(row, col)) {
        result += 2n ** (BigInt(this.width) * BigInt(this.height - row) - (BigInt(col) + 1n));
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
    tileDisplay = this.constructor.tile,
    imageDisplay = this.constructor.image,
    colorDisplay = this.constructor.color,
    stringDisplay = this.constructor.string,
    numberDisplay = this.constructor.number,
    arrayDisplay,
    objectDisplay,
    cellLength,
    outlineWeight = this.constructor.outlineWeight,
    outline = this.constructor.outline,
    textColor = this.constructor.textColor,
    textZoom = this.constructor.textZoom
  } = {}) {
    cellLength ??= this._cellLength || this.constructor.cellLength;
    const graphics = createGraphics(this.width * cellLength, this.height * cellLength);
    drawQuadrille(this, {
      graphics, values, tileDisplay, imageDisplay, colorDisplay, stringDisplay, numberDisplay,
      arrayDisplay, objectDisplay, cellLength, outlineWeight, outline, textColor, textZoom
    });
    save(graphics, filename);
  }

  /**
   * @returns quadrille chess board position in FEN notation
   */
  toFEN() {
    if (this.width !== 8 || this.height !== 8) {
      console.warn('toFEN() only works on 8x8 chess boards');
      return;
    }
    let fen = '';
    for (let i = 0; i < 8; i++) {
      let emptySquares = 0;
      for (let j = 0; j < 8; j++) {
        if (this._memory2D[i][j] === null) {
          emptySquares++;
        } else {
          if (emptySquares > 0) {
            fen += emptySquares.toString();
            emptySquares = 0;
          }
          const fenKey = this.constructor.chessKeys[this._memory2D[i][j]];
          if (!fenKey) {
            console.warn(`Unrecognized piece ${this._memory2D[i][j]} at position ${i}, ${j}. FEN output may be incorrect.`);
            fen += '?'; // Placeholder for unrecognized pieces
          } else {
            fen += fenKey;
          }
        }
      }
      if (emptySquares > 0) {
        fen += emptySquares.toString();
      }
      if (i < 7) {
        fen += '/';
      }
    }
    return fen;
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

  // Static "protected" methods:
  // TODO can they be made mutually exclusive ?

  static _isEmpty(value) {
    return value === null;
  }

  static _isFilled(value) {
    return value !== null && value !== undefined;
  }

  static _isNumber(value) {
    return typeof value === 'number';
  }

  static _isString(value) {
    return typeof value === 'string';
  }

  static _isColor(value) {
    return value instanceof p5.Color;
  }

  static _isArray(value) {
    return Array.isArray(value);
  }

  static _isObject(value) {
    return value !== null && typeof value === 'object';
  }

  static _isImage(value) {
    return value instanceof p5.Image || value instanceof p5.Graphics;
  }

  // Instance methods:

  /**
   * @param {number} row 
   * @param {number} col 
   * @returns {boolean} true if cell is empty
   */
  isEmpty(row, col) {
    return this.constructor._isEmpty(this.read(row, col));
  }

  /**
   * @param {number} row 
   * @param {number} col 
   * @returns {boolean} true if cell is filled
   */
  isFilled(row, col) {
    return this.constructor._isFilled(this.read(row, col));
  }

  /**
   * @param {number} row 
   * @param {number} col 
   * @returns {boolean} true if cell has a number
   */
  isNumber(row, col) {
    return this.constructor._isNumber(this.read(row, col));
  }

  /**
   * @param {number} row 
   * @param {number} col 
   * @returns {boolean} true if cell has a string
   */
  isString(row, col) {
    return this.constructor._isString(this.read(row, col));
  }

  /**
   * @param {number} row 
   * @param {number} col 
   * @returns {boolean} true if cell has a color
   */
  isColor(row, col) {
    return this.constructor._isColor(this.read(row, col));
  }

  /**
   * @param {number} row 
   * @param {number} col 
   * @returns {boolean} true if cell has an array
   */
  isArray(row, col) {
    return this.constructor._isArray(this.read(row, col));
  }

  /**
   * @param {number} row 
   * @param {number} col 
   * @returns {boolean} true if cell has an object
   */
  isObject(row, col) {
    return this.constructor._isObject(this.read(row, col));
  }

  /**
   * @param {number} row 
   * @param {number} col 
   * @returns {boolean} true if cell has an image
   */
  isImage(row, col) {
    return this.constructor._isImage(this.read(row, col));
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
      this.constructor.merge(pattern, this, (q1, q2) => {
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
   * 1. fill(), chess board pattern filling of all cells.
   * 2. fill(value), fills current empty cells;
   * 3. fill(row, value), fills row; or,
   * 4. fill(row, col, value), fills cell.
   * 5. fill(row, col, value, directions), flood filling without boder in the given number of directions,
   * using (row, col) cell value (either a p5.Image, a p5.Graphics, a p5.Color, a 4-length color array,
   * an object, a string or a number).
   * 6. fill(row, col, value, border), flood filling with (without) border in 4 directions using (row, col)
   * cell value (either a p5.Image, a p5.Graphics, a p5.Color, a 4-length color array, an object, a string or a number).
   * 7. fill(row, col, value, directions, border), flood filling with (without) border in the given number of directions
   * using (row, col) cell value (either a  p5.Image, a p5.Graphics, a p5.Color, a 4-length color array, an object,
   * a string or a number).
   */
  fill(...args) {
    if (args.length === 0) {
      visitQuadrille(this, (row, col) =>
        this._memory2D[row][col] = color((row + col) % 2 === 0 ? this.constructor.whiteSquare : this.constructor.blackSquare));
    }
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
    let apply;
    for (let imask = 0; imask < mask.height; imask++) {
      for (let jmask = 0; jmask < mask.width; jmask++) {
        let i = row + imask - cache_half_size;
        let j = col + jmask - cache_half_size;
        let neighbor = this.read(i, j);
        let mask_value = mask.read(imask, jmask);
        if ((neighbor instanceof p5.Color) && (typeof mask_value === 'number' || mask_value instanceof p5.Color)) {
          apply = true;
          // luma coefficients are: 0.299, 0.587, 0.114, 0
          let weight = typeof mask_value === 'number' ? mask_value : 0.299 * red(mask_value) + 0.587 * green(mask_value) + 0.114 * blue(mask_value);
          r += red(neighbor) * weight;
          g += green(neighbor) * weight;
          b += blue(neighbor) * weight;
        }
      }
    }
    if (apply) {
      r = constrain(r, 0, 255);
      g = constrain(g, 0, 255);
      b = constrain(b, 0, 255);
      this.fill(row, col, color(r, g, b));
    }
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
    target = this.outline,
    ascending = true,
    textColor = this.textColor,
    textZoom = this.textZoom,
    background = this.background,
    cellLength = int(max(width / this.width, height / this.height) / 10),
    outlineWeight = this.outlineWeight,
    outline = this.outline,
    imageDisplay = this.imageDisplay,
    colorDisplay = this.colorDisplay,
    stringDisplay = this.stringDisplay,
    numberDisplay = this.numberDisplay,
    arrayDisplay = this.arrayDisplay,
    objectDisplay = this.objectDisplay,
    // TODO decide better (tile) params
    tileDisplay = 0,
  } = {}) {
    let memory1D = this.toArray();
    const params = {
      background, cellLength, textColor, textZoom, imageDisplay, colorDisplay, outline,
      outlineWeight, stringDisplay, numberDisplay, arrayDisplay, objectDisplay, tileDisplay
    };
    switch (mode) {
      case 'DISTANCE':
        memory1D.sort((valueA, valueB) => {
          params.value = valueA;
          let sa = this.constructor.sample({ ...params, value: valueA });
          let sb = this.constructor.sample({ ...params, value: valueB });
          let wa = Math.sqrt(Math.pow((sa.r / sa.total) - red(target), 2) + Math.pow((sa.g / sa.total) - green(target), 2) +
            Math.pow((sa.b / sa.total) - blue(target), 2) + Math.pow((sa.a / sa.total) - alpha(target), 2));
          let wb = Math.sqrt(Math.pow((sb.r / sb.total) - red(target), 2) + Math.pow((sb.g / sb.total) - green(target), 2) +
            Math.pow((sb.b / sb.total) - blue(target), 2) + Math.pow((sb.a / sb.total) - alpha(target), 2));
          return wa - wb;
        });
        break;
      case 'AVG':
        memory1D.sort((valueA, valueB) => {
          let sa = this.constructor.sample({ ...params, value: valueA });
          let sb = this.constructor.sample({ ...params, value: valueB });
          let wa = 0.333 * sa.r + 0.333 * sa.g + 0.333 * sa.b;
          let wb = 0.333 * sb.r + 0.333 * sb.g + 0.333 * sb.b;
          return wa - wb;
        });
        break;
      case 'LUMA':
      default:
        memory1D.sort((valueA, valueB) => {
          let sa = this.constructor.sample({ ...params, value: valueA });
          let sb = this.constructor.sample({ ...params, value: valueB });
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
    imageDisplay = this.imageDisplay,
    colorDisplay = this.colorDisplay,
    stringDisplay = this.stringDisplay,
    numberDisplay = this.numberDisplay,
    arrayDisplay = this.arrayDisplay,
    objectDisplay = this.objectDisplay,
    tileDisplay = this.tileDisplay,
    background = this.background,
    cellLength = this.cellLength,
    outlineWeight = this.outlineWeight,
    outline = this.outline,
    textColor = this.textColor,
    textZoom = this.textZoom
  } = {}) {
    const graphics = createGraphics(cellLength, cellLength);
    graphics.background(background);
    const params = {
      graphics, value, textColor, textZoom, outline, outlineWeight, cellLength,
      imageDisplay, colorDisplay, stringDisplay, numberDisplay, arrayDisplay, objectDisplay, tileDisplay
    };
    this._display(params);
    graphics.loadPixels();
    let r = 0, g = 0, b = 0, a = 0;
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

  static _display(params) {
    const handlers = [
      { check: this._isImage, display: params.imageDisplay },
      { check: this._isColor, display: params.colorDisplay },
      { check: this._isNumber, display: params.numberDisplay },
      { check: this._isString, display: params.stringDisplay },
      { check: this._isArray, display: params.arrayDisplay },
      { check: this._isObject, display: params.objectDisplay }
    ];
    for (const handler of handlers) {
      if (handler.check(params.value) && handler.display) {
        handler.display.call(this, params);
        break;
      }
    }
    if (params.tileDisplay) {
      params.tileDisplay.call(this, params);
    }
  }

  /**
   * @deprecated since version 2.0. Use `numberDisplay` instead.
   */
  static NUMBER() {
    console.warn('Warning: NUMBER is deprecated! Use numberDisplay instead.');
    this.numberDisplay(...arguments);
  }

  /**
   * Number cell drawing.
   */
  static numberDisplay({
    graphics,
    value,
    cellLength = this.cellLength
  } = {}) {
    this.colorDisplay({ graphics, value: graphics.color(graphics.constrain(value, 0, 255)), cellLength });
  }

  /**
   * @deprecated since version 2.0. Use `colorDisplay` instead.
   */
  static COLOR() {
    console.warn('Warning: COLOR is deprecated! Use colorDisplay instead.');
    this.colorDisplay(...arguments);
  }

  /**
   * Color cell drawing.
   */
  static colorDisplay({
    graphics,
    value,
    cellLength = this.cellLength
  } = {}) {
    graphics.noStroke();
    graphics.fill(value);
    graphics.rect(0, 0, cellLength, cellLength);
  }

  /**
   * @deprecated since version 2.0. Use `imageDisplay` instead.
   */
  static IMAGE() {
    console.warn('Warning: IMAGE is deprecated! Use imageDisplay instead.');
    this.imageDisplay(...arguments);
  }

  /**
   * Image cell drawing.
   */
  static imageDisplay({
    graphics,
    value,
    cellLength = this.cellLength
  } = {}) {
    graphics.noStroke();
    graphics.image(value, 0, 0, cellLength, cellLength);
  }

  /**
   * @deprecated since version 2.0. Use `stringDisplay` instead.
   */
  static STRING() {
    console.warn('Warning: STRING is deprecated! Use stringDisplay instead.');
    this.stringDisplay(...arguments);
  }

  /**
   * String cell drawing.
   */
  static stringDisplay({
    graphics,
    value,
    cellLength = this.cellLength,
    textColor = this.textColor,
    textZoom = this.textZoom
  } = {}) {
    graphics.noStroke();
    graphics.fill(textColor);
    graphics.textSize(cellLength * textZoom / value.length);
    graphics.textAlign(CENTER, CENTER);
    graphics.text(value, 0, 0, cellLength, cellLength);
  }

  /**
   * @deprecated since version 2.0. Use `tileDisplay` instead.
   */
  static TILE() {
    console.warn('Warning: TILE is deprecated! Use tileDisplay instead.');
    this.tileDisplay(...arguments);
  }

  /**
   * Tesselation or tiling. Used by the drawQuadrille board property.
   */
  static tileDisplay({
    graphics,
    row = 0,
    col = 0,
    width = 1,
    height = 1,
    cellLength = this.cellLength,
    outline = this.outline,
    outlineWeight = this.outlineWeight
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
    VERSION: '2.0.6',
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
    imageDisplay = quadrille.constructor.imageDisplay,
    colorDisplay = quadrille.constructor.colorDisplay,
    stringDisplay = quadrille.constructor.stringDisplay,
    numberDisplay = quadrille.constructor.numberDisplay,
    tileDisplay = quadrille.constructor.tileDisplay,
    arrayDisplay = quadrille.constructor.arrayDisplay,
    objectDisplay = quadrille.constructor.objectDisplay,
    cellLength = quadrille.constructor.cellLength,
    outlineWeight = quadrille.constructor.outlineWeight,
    outline = quadrille.constructor.outline,
    textColor = quadrille.constructor.textColor,
    textZoom = quadrille.constructor.textZoom
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
      const params = {
        quadrille, graphics, value: quadrille.read(row, col), width: quadrille.width, height: quadrille.height,
        row, col, outline, outlineWeight, cellLength, textColor, textZoom,
        imageDisplay, colorDisplay, stringDisplay, numberDisplay, arrayDisplay, objectDisplay, tileDisplay
      };
      quadrille.constructor._display(params);
      graphics.pop();
    }, values);
    graphics.pop();
  }

  p5.prototype.visitQuadrille = function (quadrille, fx, values) {
    values = new Set(values);
    for (let row = 0; row < quadrille.height; row++) {
      for (let col = 0; col < quadrille.width; col++) {
        if (values.size === 0 || values.has(quadrille.read(row, col))) {
          fx(row, col);
        }
      }
    }
  }
})();