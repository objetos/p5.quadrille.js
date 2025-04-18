'use strict';

import p5 from 'p5';

// TODOs
// i. isPolyomino()
// ii. perlin / simplex noise
// iii. sort() using 'webgl' mode, requires using fbos to speed up sample() (which currently only supports 'p2d' renderer)
// iv. screenRow and screenCol lacks webgl mode (would require p5.treegl)
// v. Decide mouseCornerX, mouseCornerY, screenCornerX() and screenCornerY()
class Quadrille {
  static VERSION = '3.0.0-beta.1';

  // STYLE

  /**
   * Default text color.
   */
  static _textColor = 'DodgerBlue';

  // Getter for textColor
  static get textColor() {
    return this._textColor;
  }

  // Setter for textColor with simplified type checking
  static set textColor(value) {
    this._textColor = typeof value === 'string' || this.isColor(value) ? value : this._textColor;
  }

  /**
   * Default text drawing zoom.
   */
  static _textZoom = 0.78; // TODO decide was 0.89 in p5-v1+

  // Getter for textZoom
  static get textZoom() {
    return this._textZoom;
  }

  // Setter for textZoom with type checking
  static set textZoom(value) {
    this._textZoom = (typeof value === 'number' && value > 0) ? value : this._textZoom;
  }

  /**
   * Default drawing outline.
   */
  static _outline = 'OrangeRed';

  // Getter for outline
  static get outline() {
    return this._outline;
  }

  // Setter for outline with type checking
  static set outline(value) {
    this._outline = typeof value === 'string' || this.isColor(value) ? value : this._outline;
  }

  /**
   * Default drawing outline weight.
   */
  static _outlineWeight = 2;

  // Getter for outlineWeight
  static get outlineWeight() {
    return this._outlineWeight;
  }

  // Setter for outlineWeight with type checking
  static set outlineWeight(value) {
    this._outlineWeight = (typeof value === 'number' && value >= 0) ? value : this._outlineWeight;
  }

  /**
   * Default drawing cell length.
   */
  static _cellLength = 100;

  // Getter for cellLength
  static get cellLength() {
    return this._cellLength;
  }

  // Setter for cellLength with type checking
  static set cellLength(value) {
    this._cellLength = (typeof value === 'number' && value > 0) ? value : this._cellLength;
  }

  /**
   * Default background used in sort.
   */
  static _background = 'white';

  // Getter for background
  static get background() {
    return this._background;
  }

  // Setter for background with type checking
  static set background(value) {
    this._background = typeof value === 'string' || this.isColor(value) ? value : this._background;
  }

  // chess specific stuff

  /**
  * Default chess dark squares.
  */
  static _darkSquare = '#D28C45'; // Wikipedia; '#769555' // chess.com

  // Getter for darkSquare
  static get darkSquare() {
    return this._darkSquare;
  }

  // Setter for darkSquare with type checking
  static set darkSquare(value) {
    this._darkSquare = typeof value === 'string' || this.isColor(value) ? value : this._darkSquare;
  }

  /**
   * Default chess light squares.
   */
  static _lightSquare = '#FDCDAA'; // Wikipedia; '#EBECCF' // chess.com

  // Getter for lightSquare
  static get lightSquare() {
    return this._lightSquare;
  }

  // Setter for lightSquare with type checking
  static set lightSquare(value) {
    this._lightSquare = typeof value === 'string' || this.isColor(value) ? value : this._lightSquare;
  }

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
   * Logical AND between two quadrilles.
   * @param {Quadrille} q1 First quadrille
   * @param {Quadrille} q2 Second quadrille
   * @param {number} row Relative row offset from q1
   * @param {number} col Relative column offset from q1
   * @returns {Quadrille} A new quadrille containing only cells filled in both q1 and q2
   */
  static and(q1, q2, row, col) {
    return this.merge(q1, q2, (a, b) => {
      if (this.isFilled(a) && this.isFilled(b)) {
        return a;
      }
    }, row, col);
  }

  /**
   * Logical OR between two quadrilles.
   * @param {Quadrille} q1 First quadrille
   * @param {Quadrille} q2 Second quadrille
   * @param {number} row Relative row offset from q1
   * @param {number} col Relative column offset from q1
   * @returns {Quadrille} A new quadrille containing cells filled in either q1 or q2
   */
  static or(q1, q2, row, col) {
    return this.merge(q1, q2, (a, b) => {
      if (this.isFilled(a)) {
        return a;
      }
      if (this.isFilled(b)) {
        return b;
      }
    }, row, col);
  }

  /**
   * Logical XOR between two quadrilles.
   * @param {Quadrille} q1 First quadrille
   * @param {Quadrille} q2 Second quadrille
   * @param {number} row Relative row offset from q1
   * @param {number} col Relative column offset from q1
   * @returns {Quadrille} A new quadrille containing cells filled in one, but not both, of q1 and q2
   */
  static xor(q1, q2, row, col) {
    return this.merge(q1, q2, (a, b) => {
      if (this.isFilled(a) && this.isEmpty(b)) {
        return a;
      }
      if (this.isEmpty(a) && this.isFilled(b)) {
        return b;
      }
    }, row, col);
  }

  /**
   * Logical difference (q1 minus q2) between two quadrilles.
   * @param {Quadrille} q1 First quadrille
   * @param {Quadrille} q2 Second quadrille
   * @param {number} row Relative row offset from q1
   * @param {number} col Relative column offset from q1
   * @returns {Quadrille} A new quadrille with cells filled in q1 but not in q2
   */
  static diff(q1, q2, row, col) {
    return this.merge(q1, q2, (a, b) => {
      if (this.isFilled(a) && this.isEmpty(b)) {
        return a;
      }
    }, row, col);
  }

  /**
   * Logical NEG of a quadrille: fills empty cells with a target value.
   * @param {Quadrille} q Input quadrille
   * @param {*} target Value to fill where the quadrille is empty
   * @returns {Quadrille} A new quadrille with empty cells filled and filled cells untouched
   */
  static neg(q, target) {
    const result = new Quadrille(this._p, q.width, q.height);
    this.isFilled(target) && q.visit(({ row, col }) => result.fill(row, col, target), this.isEmpty);
    return result;
  }

  /**
   * Merges two quadrilles by applying a binary logic operator to their overlapping cells.
   * @param {Quadrille} q1 First quadrille
   * @param {Quadrille} q2 Second quadrille
   * @param {Function} operator Function receiving two cell values and returning a result value
   * @param {number} row Relative row offset from q1 to q2
   * @param {number} col Relative column offset from q1 to q2
   * @returns {Quadrille} A new quadrille resulting from the logic combination of q1 and q2
   */
  static merge(q1, q2, operator, row, col) {
    const sameOrigin = q1._row !== undefined && q2._row !== undefined &&
      q1._cellLength !== undefined && q1._cellLength === q2._cellLength;
    row ??= sameOrigin ? q2._row - q1._row : 0;
    col ??= sameOrigin ? q2._col - q1._col : 0;
    const width = col < 0 ? Math.max(q2.width, q1.width - col) : Math.max(q1.width, q2.width + col);
    const height = row < 0 ? Math.max(q2.height, q1.height - row) : Math.max(q1.height, q2.height + row);
    const quadrille = new Quadrille(this._p, width, height);
    quadrille.visit(({ row: i, col: j }) => {
      const i1 = row < 0 ? i + row : i;
      const j1 = col < 0 ? j + col : j;
      const i2 = row > 0 ? i - row : i;
      const j2 = col > 0 ? j - col : j;
      const value1 = q1.read(i1, j1);
      const value2 = q2.read(i2, j2);
      quadrille.fill(i, j, operator(value1, value2));
    });
    return quadrille;
  }

  /**
   * Constructs either an empty or a filled quadrille:
   * 1. Pass no params.
   * 2. Pass width and height to construct and empty quadrille (filled with null's).
   * 3. Pass two colors (either p5.Color instances or HTML color strings) to construct an 8x8 chessboard pattern
   * using the specified colors for light and dark squares.
   * 4. Pass jagged array (of colors, images, graphics, arrays, objects, strings, numbers and null).
   * 5. Pass array (of colors, images, graphics arrays, objects, strings, numbers and null).
   * 6. Pass width and array (of colors, images, graphics arrays, objects, strings, numbers and null).
   * 7. Pass fen.
   * 8. Pass string.
   * 9. Pass width and string.
   * 10. Pass width and image, to construct a quadrille filled with image.
   * 11. Pass width, image and boolean, to construct a quadrille from pixalated image.
   * 12. Pass width, height, order and value, to construct a quadrille filled with value of the given order.
   * 13. Pass width, BigInt (or int) and value, to construct a quadrille filled with value from the given BigInt.
   * @see rand
   * @see order
   */
  constructor(p, ...args) {
    // TODO v3 experimental: needed for instance mode to work
    this._p = p;
    this._cellLength = this.constructor.cellLength;
    this._x = 0;
    this._y = 0;
    this._origin = 'corner';
    if (args.length === 0) {
      this._memory2D = Array(8).fill().map(() => Array(8).fill(null));
      this.visit(({ row, col }) => {
        const fill = (row + col) % 2 === 0
          ? this.constructor.lightSquare
          : this.constructor.darkSquare;
        this._memory2D[row][col] = this._p.color(fill);
      });
      return;
    }
    if (args.length === 1) {
      this.memory2D = args[0];
      return;
    }
    if (args.length === 2 &&
      (this.constructor.isColor(args[0]) || typeof args[0] === 'string') &&
      (this.constructor.isColor(args[1]) || typeof args[1] === 'string')) {
      this._memory2D = Array(8).fill().map(() => Array(8).fill(null));
      this.visit(({ row, col }) => {
        const fill = (row + col) % 2 === 0 ? args[0] : args[1];
        this._memory2D[row][col] = this._p.color(fill);
      });
      return;
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
      this._memory2D = Array(Math.round(args[0] * args[1].height / args[1].width))
        .fill().map(() => Array(args[0]).fill(null));
      this._fromImage(args[1]);
      return;
    }
    if (args.length === 3 && typeof args[0] === 'number' && typeof args[1] !== 'number' && typeof args[2] === 'boolean') {
      this._memory2D = Array(Math.round(args[0] * args[1].height / args[1].width))
        .fill().map(() => Array(args[0]).fill(null));
      this._fromImage(args[1], args[2]);
      return;
    }
    if (args.length === 3 && typeof args[0] === 'number' &&
      (typeof args[1] === 'number' || typeof args[1] === 'bigint')) {
      const rows = Number((BigInt(args[1].toString(2).length) + BigInt(args[0]) - 1n) / BigInt(args[0]));
      this._memory2D = Array(rows).fill().map(() => Array(args[0]).fill(null));
      this._fromBigInt(args[1], args[2]);
      return;
    }
    if (args.length === 4 &&
      typeof args[0] === 'number' &&
      typeof args[1] === 'number' &&
      typeof args[2] === 'number') {
      this._memory2D = Array(args[1]).fill().map(() => Array(args[0]).fill(null));
      this.rand(args[2], args[3]);
      return;
    }
  }

  _init1D(memory1D, width = memory1D.length) {
    const height = Math.ceil(memory1D.length / width);
    this._memory2D = Array.from({ length: height }, (_, i) => {
      const start = i * width;
      return this._format(memory1D.slice(start, start + width), width);
    });
  }

  _format(memory1D, size) {
    const cleaned = memory1D.map(v => v === undefined ? null : v);
    return cleaned.length < size
      ? cleaned.concat(new Array(size - cleaned.length).fill(null))
      : cleaned;
  }

  _fromBigInt(...args) {
    const [input, value] = args;
    const length = this.width * this.height;
    if ((typeof input === 'number' || typeof input === 'bigint') && this.constructor.isFilled(value)) {
      const bigint = BigInt(input);
      if (bigint < 0n) {
        throw new Error('Value cannot be negative');
      }
      if (bigint.toString(2).length > length) {
        throw new Error('Value is too high to fill quadrille');
      }
      let index = 0;
      for (const { row, col } of this) {
        (bigint & (1n << BigInt(length - 1 - index))) && this.fill(row, col, value);
        index++;
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
    if (this.constructor.isImage(args[0])) {
      let src = args[0] instanceof p5.Framebuffer ? args[0].get() : args[0];
      if (src instanceof p5.MediaElement && src.elt instanceof HTMLVideoElement) {
        const video = src.elt;
        if (video.readyState < HTMLMediaElement.HAVE_CURRENT_DATA) {
          video.addEventListener('loadeddata', () => this._fromImage(...args)); // Retry once the video is loaded
          return;
        }
        src = new p5.Image(video.videoWidth, video.videoHeight);
        src.drawingContext.drawImage(video, 0, 0, video.videoWidth, video.videoHeight); // Draw video frame to p5.Image
      }
      const image = new p5.Image(src.width, src.height);
      image.copy(src, 0, 0, src.width, src.height, 0, 0, src.width, src.height);
      args.length === 1 ? this._images(image) : args[1] ? this._pixelator1(image) : this._pixelator2(image);
    }
  }

  _pixelator1(image) {
    image.resize(this.width, this.height);
    image.loadPixels();
    for (let i = 0; i < image.pixels.length / 4; i++) {
      const r = image.pixels[4 * i];
      const g = image.pixels[4 * i + 1];
      const b = image.pixels[4 * i + 2];
      const a = image.pixels[4 * i + 3];
      const _ = this._fromIndex(i);
      this.fill(_.row, _.col, this._p.color([r, g, b, a]));
    }
  }

  _pixelator2(image) {
    image.loadPixels();
    const r = Array(this.height).fill().map(() => Array(this.width).fill(0));
    const g = Array(this.height).fill().map(() => Array(this.width).fill(0));
    const b = Array(this.height).fill().map(() => Array(this.width).fill(0));
    const a = Array(this.height).fill().map(() => Array(this.width).fill(0));
    const t = Array(this.height).fill().map(() => Array(this.width).fill(0));
    for (let i = 0; i < image.pixels.length / 4; i++) {
      const _ = this._fromIndex(i, image.width);
      const _i = Math.floor(_.row * this.height / image.height);
      const _j = Math.floor(_.col * this.width / image.width);
      r[_i][_j] += image.pixels[4 * i];
      g[_i][_j] += image.pixels[4 * i + 1];
      b[_i][_j] += image.pixels[4 * i + 2];
      a[_i][_j] += image.pixels[4 * i + 3];
      t[_i][_j] += 1;
    }
    this.visit(({ row, col }) => {
      this.fill(row, col, this._p.color([
        r[row][col] / t[row][col],
        g[row][col] / t[row][col],
        b[row][col] / t[row][col],
        a[row][col] / t[row][col]
      ]));
    });
  }

  _images(image) {
    const cellWidth = image.width / this.width;
    const cellHeight = image.height / this.height;
    this.visit(({ row, col }) => this.fill(row, col, image.get(col * cellWidth, row * cellHeight, cellWidth, cellHeight)));
  }

  /**
   * Sets quadrille from 2D memory internal array representation.
   */
  set memory2D(memory) {
    // Case: FEN or flat string
    if (typeof memory === 'string') {
      const isFEN = memory.split('/').length - 1 === 7;
      isFEN ? this._fromFEN(memory) : this._init1D([...memory]);
      return;
    }
    // Case: 1D array
    if (Array.isArray(memory) && !Array.isArray(memory[0])) {
      this._init1D(memory);
      return;
    }
    // Case: 2D array
    if (Array.isArray(memory)) {
      const memory2D = memory.map(row => {
        if (!Array.isArray(row)) throw new Error('Not 2D Array');
        return row.slice(); // shallow copy
      });
      // Compute max row length
      const width = Math.max(...memory2D.map(row => row.length));
      // Normalize all rows
      this._memory2D = memory2D.map(row => this._format(row, width));
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
    height = Math.max(1, Math.abs(height));
    const rows = height - this.height;
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
    this.visit(() => result++, this.constructor.isFilled);
    return result;
    // also possible
    // return [...this.cells({ value: Quadrille.isFilled })].length;
  }

  get mouseRow() {
    return this.screenRow(this._p.mouseY);
  }

  get mouseCol() {
    return this.screenCol(this._p.mouseX);
  }

  /*
  get mouseCornerX() {
    return this.screenCornerX(this._p.mouseX);
  }

  get mouseCornerY() {
    return this.screenCornerY(this._p.mouseY);
  }

  screenCornerX(pixelX, x = this._x || 0, cellLength = this._cellLength || this.constructor.cellLength) {
    return this.screenCol(pixelX, x, cellLength) * cellLength + (this._origin === 'center' ? this._p.width / 2 : x);
  }

  screenCornerY(pixelY, y = this._y || 0, cellLength = this._cellLength || this.constructor.cellLength) {
    return this.screenRow(pixelY, y, cellLength) * cellLength + (this._origin === 'center' ? this._p.height / 2 : y);
  }
  // */

  /**
   * Converts a pixel Y coordinate to a quadrille row index.
   * @param {number} pixelY - The screen Y-coordinate in pixels.
   * @param {number} [y=this._y || 0] - The quadrille's Y-coordinate origin.
   * @param {number} [cellLength=this._cellLength || this.constructor.cellLength] - Length of each cell.
   * @returns {number} The row index corresponding to the pixel Y-coordinate.
   */
  screenRow(pixelY, y = this._y || 0, cellLength = this._cellLength || this.constructor.cellLength) {
    return this._p.floor((pixelY - (this._origin === 'center' ? this._p.height / 2 : y)) / cellLength);
  }

  /**
   * Converts a screen X-coordinate to a quadrille column index.
   * @param {number} pixelX - The screen X-coordinate in pixels.
   * @param {number} [x=this._x || 0] - The quadrille's X-coordinate origin.
   * @param {number} [cellLength=this._cellLength || this.constructor.cellLength] - Length of each cell.
   * @returns {number} - The corresponding quadrille column.
   */
  screenCol(pixelX, x = this._x || 0, cellLength = this._cellLength || this.constructor.cellLength) {
    return this._p.floor((pixelX - (this._origin === 'center' ? this._p.width / 2 : x)) / cellLength);
  }

  /**
   * Lazily iterates in row-major order (top to bottom, left to right) over all matching cells in the quadrille.
   *
   * The optional `filter` can be:
   * - `null` or omitted → yield all cells
   * - A `function(value)` → yield cells where the function returns `true`
   * - An `Array` or `Set` of values → yield cells whose value is in the set
   * - An object with optional `value`, `row`, and/or `col` predicates:
   *    {
   *      value: v => v === 1,
   *      row: r => r % 2 === 0,
   *      col: c => c < 4
   *    }
   *
   * @generator
   * @param {Array|Set|function|object|null} [filter=null] Filter for selecting cells
   * @yields {{ row: number, col: number, value: any }} Cell object with coordinates and value
   */
  *cells(filter = null) {
    const isFn = typeof filter === 'function';
    const isSet = filter && !isFn && !filter.value && !filter.row && !filter.col;
    const isObj = filter && typeof filter === 'object' && (filter.value || filter.row || filter.col);
    const set = isSet ? new Set(filter) : null;
    for (let row = 0; row < this._memory2D.length; row++) {
      const rowData = this._memory2D[row];
      for (let col = 0; col < rowData.length; col++) {
        const value = rowData[col];
        const match = !filter
          || (isFn && filter(value))
          || (isSet && set.has(value))
          || (isObj &&
            (!filter.value || filter.value(value)) &&
            (!filter.row || filter.row(row)) &&
            (!filter.col || filter.col(col)));
        if (match) yield { row, col, value };
      }
    }
  }

  /**
   * Default iterator for the quadrille.
   *
   * Allows iteration over all cells using `for...of`.
   * Equivalent to `this.cells()` with no filter.
   *
   * @generator
   * @returns {IterableIterator<{ row: number, col: number, value: any }>}
   */
  *[Symbol.iterator]() {
    yield* this.cells();
  }

  /**
   * Iterates over cells using `for...of`, calling the given function with each cell object.
   * @param {function({row:number, col:number, value:any}):void} callback
   * @param {Array|Set|function|object} [filter] Optional filter for selecting cells
   */
  visit(callback, filter) {
    for (const cell of this.cells(filter)) {
      callback(cell);
    }
  }

  /**
   * @param {number} row 
   * @returns row as a new quadrille
   */
  row(row) {
    if (this.isValid(row, 0)) {
      return new Quadrille(this._p, this._memory2D[row]);
    }
  }

  _fromIndex(index, width = this.width) {
    return { row: (index / width) | 0, col: index % width };
  }

  _toIndex(row, col, width = this.width) {
    return row * width + col;
  }

  /**
   * @returns {bigint} integer representation using big-endian and row-major ordering
   * of the quadrille cells.
   */
  toBigInt() {
    let result = 0n;
    this.visit(({ row, col }) => {
      result += 2n ** (BigInt(this.width) * BigInt(this.height - row) - (BigInt(col) + 1n));
    }, this.constructor.isFilled);
    return result;
  }

  /**
   * @returns {Array} Quadrille representation.
   */
  toArray() {
    return this._memory2D.flat(); // requires ES2019
    // TODO need to verify which ES version will p5-v2 support
    // return this.cells().map(({ value }) => value);
  }

  /**
   * Convert this quadrille to an image.
   * @param {String} filename png or jpg
   * @param {Object} params drawing params
   */
  toImage(filename, {
    values,
    textFont,
    origin = 'corner',
    options = {},
    tileDisplay = this.constructor.tileDisplay,
    functionDisplay = this.constructor.functionDisplay,
    imageDisplay = this.constructor.imageDisplay,
    colorDisplay = this.constructor.colorDisplay,
    stringDisplay = this.constructor.stringDisplay,
    numberDisplay = this.constructor.numberDisplay,
    arrayDisplay,
    objectDisplay,
    cellLength = this._cellLength || this.constructor.cellLength,
    outlineWeight = this.constructor.outlineWeight,
    outline = this.constructor.outline,
    textColor = this.constructor.textColor,
    textZoom = this.constructor.textZoom
  } = {}) {
    const graphics = this._p.createGraphics(this.width * cellLength, this.height * cellLength, this._mode);
    this._p.drawQuadrille(this, {
      graphics, values, tileDisplay, functionDisplay, imageDisplay, colorDisplay, stringDisplay,
      numberDisplay, arrayDisplay, objectDisplay, cellLength, outlineWeight, outline, textColor,
      textZoom, textFont, origin, options
    });
    this._p.save(graphics, filename);
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
        const value = this._memory2D[i][j];
        if (this.constructor.isEmpty(value)) {
          emptySquares++;
        } else {
          if (emptySquares > 0) {
            fen += emptySquares.toString();
            emptySquares = 0;
          }
          const fenKey = this.constructor.chessKeys[value];
          if (!fenKey) {
            console.warn(`Unrecognized piece ${value} at position ${i}, ${j}. FEN output may be incorrect.`);
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
    if (this.isValid(row, 0)) {
      for (let j = 0; j < this.width; j++) {
        this.isFilled(row, j) && result++;
      }
    }
    return result;
  }

  /**
   * Returns a shallow copy of this quadrille. May be used in conjunction with
   * {@link reflect} and {@link rotate} to create different quadrille instances.
   */
  clone(cache = true) {
    const clone = new Quadrille(this._p, this._memory2D.map(array => array.slice()));
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
    const array1D = [];
    for (let i = -dimension; i <= dimension; i++) {
      for (let j = -dimension; j <= dimension; j++) {
        array1D.push(this.read(row + i, col + j));
      }
    }
    return new Quadrille(this._p, 2 * dimension + 1, array1D);
  }

  /**
   * @param {number} row 
   * @param {number} col 
   * @returns {*} quadrille entry or undefined id (row, col) is out of bounds
   */
  read(row, col) {
    if (this.isValid(row, col)) {
      return this._memory2D[row][col];
    }
  }

  // Static "protected" methods

  // Although undefined is disallowed, isEmpty and isFilled use it for querying cells outside
  // quadrille bounds, also isFilled is logically equivalent to !isEmpty for consistency.

  /**
   * @param {number} row 
   * @param {number} col 
   * @returns {boolean} true if cell is within bounds
   */
  isValid(row, col) {
    return row >= 0 && row < this.height && col >= 0 && col < this.width;
  }

  static isEmpty(value) {
    return value == null;
  }

  static isFilled(value) {
    return value != null;
  }

  static isNumber(value) {
    return typeof value === 'number';
  }

  static isString(value) {
    return typeof value === 'string';
  }

  static isColor(value) {
    return value instanceof p5.Color;
  }

  static isFunction(value) {
    return typeof value === 'function';
  }

  static isImage(value) {
    return value instanceof p5.Image || (value instanceof p5.MediaElement && value.elt instanceof HTMLVideoElement) || value instanceof p5.Graphics || value instanceof p5.Framebuffer;
  }

  static isArray(value) {
    return Array.isArray(value);
  }

  static isObject(value) {
    return this.isFilled(value) &&
      !this.isColor(value) &&
      !this.isImage(value) &&
      !this.isArray(value) &&
      !this.isFunction(value) &&
      typeof value === 'object';
  }

  // Instance methods:

  /**
   * @param {number} row 
   * @param {number} col 
   * @returns {boolean} true if cell is empty
   */
  isEmpty(row, col) {
    return this.constructor.isEmpty(this.read(row, col));
  }

  /**
   * @param {number} row 
   * @param {number} col 
   * @returns {boolean} true if cell is filled
   */
  isFilled(row, col) {
    return this.constructor.isFilled(this.read(row, col));
  }

  /**
   * @param {number} row 
   * @param {number} col 
   * @returns {boolean} true if cell has a number
   */
  isNumber(row, col) {
    return this.constructor.isNumber(this.read(row, col));
  }

  /**
   * @param {number} row 
   * @param {number} col 
   * @returns {boolean} true if cell has a string
   */
  isString(row, col) {
    return this.constructor.isString(this.read(row, col));
  }

  /**
   * @param {number} row 
   * @param {number} col 
   * @returns {boolean} true if cell has a color
   */
  isColor(row, col) {
    return this.constructor.isColor(this.read(row, col));
  }

  /**
   * @param {number} row 
   * @param {number} col 
   * @returns {boolean} true if cell has an array
   */
  isArray(row, col) {
    return this.constructor.isArray(this.read(row, col));
  }

  /**
   * @param {number} row 
   * @param {number} col 
   * @returns {boolean} true if cell has an object
   */
  isObject(row, col) {
    return this.constructor.isObject(this.read(row, col));
  }

  /**
   * @param {number} row 
   * @param {number} col 
   * @returns {boolean} true if cell has an image
   */
  isImage(row, col) {
    return this.constructor.isImage(this.read(row, col));
  }

  /**
   * @param {number} row 
   * @param {number} col 
   * @returns {boolean} true if cell has a function
   */
  isFunction(row, col) {
    return this.constructor.isFunction(this.read(row, col));
  }

  /**
   * Pattern searching.
   * @param {Quadrille} pattern 
   * @param {boolean} strict tells whether the algorithm requires values to match (besides filled cells)
   * @returns an array of { row, col } object literals hits whose length may be 0 (no hits found).
   */
  search(pattern, strict = false) {
    const hits = [];
    this.visit(({ row, col }) =>
      this.constructor.merge(pattern, this, (q1, q2) => {
        if (this.constructor.isFilled(q1) && (strict ? q2 !== q1 : this.constructor.isEmpty(q2))) {
          return q1;
        }
      }, -row, -col).order === 0 && hits.push({ row, col }));
    return hits;
  }

  /**
   * Searches and replace values. Either:
   * 1. replace(value), replaces non empty cells with value.
   * 2. replace(value1, value2), searches value1 and replaces with value2
   */
  replace(...args) {
    args.length === 1 && this.visit(({ row, col }) => this.fill(row, col, args[0]), this.constructor.isFilled);
    args.length === 2 && this.visit(({ row, col }) => this.fill(row, col, args[1]), v => v === args[0]);
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
      this._memory2D = this._memory2D.map(row => row.map(cell => this._clearCell(cell)));
    }
    if (args.length === 1 && typeof args[0] === 'number') {
      if (this.isValid(args[0], 0)) {
        this._memory2D[args[0]] = this._memory2D[args[0]].map(cell => this._clearCell(cell));
      }
    }
    if (args.length === 2 && typeof args[0] === 'number' && typeof args[1] === 'number') {
      if (this.isValid(args[0], args[1])) {
        this._memory2D[args[0]][args[1]] = this._clearCell(this._memory2D[args[0]][args[1]]);
      }
    }
    if (args.length === 3 && typeof args[0] === 'number' && typeof args[1] === 'number' &&
      typeof args[2] === 'number') {
      if (this.isValid(args[0], args[1])) {
        this._flood(args[0], args[1], this._memory2D[args[0]][args[1]], null, args[2]);
      }
    }
    if (args.length === 3 && typeof args[0] === 'number' && typeof args[1] === 'number' &&
      typeof args[2] === 'boolean') {
      if (this.isValid(args[0], args[1])) {
        this._flood(args[0], args[1], this._memory2D[args[0]][args[1]], null, 4, args[2]);
      }
    }
    if (args.length === 4 && typeof args[0] === 'number' && typeof args[1] === 'number' &&
      typeof args[2] === 'number' && typeof args[3] === 'boolean') {
      if (this.isValid(args[0], args[1])) {
        this._flood(args[0], args[1], this._memory2D[args[0]][args[1]], null, args[2], args[3]);
      }
    }
    return this;
  }

  /**
   * Fills quadrille cells with given value. Either:
   * 1. fill(), chess board pattern filling of all cells.
   * 2. fill(value), fills current empty cells.
   * 3. fill(color1, color2), fills the entire quadrille with a chessboard pattern using the specified colors
   * (either p5.Color instances or HTML color strings).
   * 4. fill(row, value), fills row.
   * 5. fill(row, col, value), fills cell.
   * 6. fill(row, col, value, directions), flood filling without boder in the given number of directions,
   * using (row, col) cell value (either a p5.Image, a p5.Graphics, a p5.Color, a 4-length color array,
   * an object, a string or a number).
   * 7. fill(row, col, value, border), flood filling with (without) border in 4 directions using (row, col)
   * cell value (either a p5.Image, a p5.Graphics, a p5.Color, a 4-length color array, an object, a string or a number).
   * 8. fill(row, col, value, directions, border), flood filling with (without) border in the given number of directions
   * using (row, col) cell value (either a  p5.Image, a p5.Graphics, a p5.Color, a 4-length color array, an object,
   * a string or a number).
   */
  fill(...args) {
    if (args.length === 0) {
      this.visit(({ row, col }) => {
        this._memory2D[row][col] = this._clearCell(this._memory2D[row][col]);
        this._memory2D[row][col] = this._p.color((row + col) % 2 === 0 ? this.constructor.lightSquare : this.constructor.darkSquare);
      });
    }
    if (args.length === 1 && this.constructor.isFilled(args[0])) {
      this.visit(({ row, col }) => this._memory2D[row][col] = args[0], this.constructor.isEmpty);
    }
    if (args.length === 2 && (this.constructor.isColor(args[0]) || typeof args[0] === 'string') &&
      (this.constructor.isColor(args[1]) || typeof args[1] === 'string')) {
      this.visit(({ row, col }) => {
        this._memory2D[row][col] = this._clearCell(this._memory2D[row][col]);
        this._memory2D[row][col] = (row + col) % 2 === 0 ? this._p.color(args[0]) : this._p.color(args[1]);
      });
    }
    if (args.length === 2 && typeof args[0] === 'number') {
      if (this.isValid(args[0], 0)) {
        this._memory2D[args[0]] = this._memory2D[args[0]].map(cell => {
          cell = this._clearCell(cell);
          return args[1] === undefined ? null : args[1];
        });
      }
    }
    if (args.length === 3 && typeof args[0] === 'number' && typeof args[1] === 'number') {
      if (this.isValid(args[0], args[1])) {
        this._memory2D[args[0]][args[1]] = this._clearCell(this._memory2D[args[0]][args[1]]);
        this._memory2D[args[0]][args[1]] = args[2] === undefined ? null : args[2];
      }
    }
    if (args.length === 4 && typeof args[0] === 'number' && typeof args[1] === 'number' && typeof args[3] === 'number') {
      if (this.isValid(args[0], args[1])) {
        this._flood(args[0], args[1], this._memory2D[args[0]][args[1]], args[2] === undefined ? null : args[2], args[3]);
      }
    }
    if (args.length === 4 && typeof args[0] === 'number' && typeof args[1] === 'number' && typeof args[3] === 'boolean') {
      if (this.isValid(args[0], args[1])) {
        this._flood(args[0], args[1], this._memory2D[args[0]][args[1]], args[2] === undefined ? null : args[2], 4, args[3]);
      }
    }
    if (args.length === 5 && typeof args[0] === 'number' && typeof args[1] === 'number' && typeof args[3] === 'number' && typeof args[4] === 'boolean') {
      if (this.isValid(args[0], args[1])) {
        this._flood(args[0], args[1], this._memory2D[args[0]][args[1]], args[2] === undefined ? null : args[2], args[3], args[4]);
      }
    }
    return this;
  }

  _flood(row, col, value1, value2, directions = 4, border = false) {
    if (directions !== 4 && directions !== 8) {
      console.warn(`flood fill is using 4 directions instead of ${directions}, see: https://en.m.wikipedia.org/wiki/Flood_fill`);
      directions = 4;
    }
    if (this.isValid(row, col) && this._memory2D[row][col] !== value2) {
      if (this._memory2D[row][col] === value1) {
        this._memory2D[row][col] = this._clearCell(this._memory2D[row][col]);
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
        this._memory2D[row][col] = this._clearCell(this._memory2D[row][col]);
        this._memory2D[row][col] = value2;
      }
    }
  }

  _clearCell(value) {
    if (this.constructor.isFunction(value)) {
      value.fbo?.remove();
      value.fbo = undefined;
    }
    return null;
  }

  /**
   * Randomly clears or fills cells in the quadrille.
   *
   * - If `value` is `null`, clears `times` filled cells.
   * - If `value` is not `null`, fills `times` empty cells with `value`.
   *
   * Note: For deterministic behavior, call `randomSeed(seed)` explicitly before this method.
   *
   * @param {number} times - Number of cells to modify.
   * @param {*} [value=null] - Value to fill, or `null` to clear cells.
   * @returns {Quadrille} The modified quadrille (for chaining).
   */
  rand(times, value = null) {
    times = this._p.abs(times);
    const isFilling = this.constructor.isFilled(value);
    const max = isFilling ? this.size - this.order : this.order;
    times = this._p.min(times, max);
    let count = 0;
    while (count < times) {
      const index = this._p.int(this._p.random(this.size));
      const { row, col } = this._fromIndex(index);
      const shouldChange = isFilling ? this.isEmpty(row, col) : this.isFilled(row, col);
      if (shouldChange) {
        isFilling ? this.fill(row, col, value) : this.clear(row, col);
        count++;
      }
    }
    return this;
  }

  /**
   * Randomly rearranges filled cells in the quadrille.
   *
   * Note: For deterministic behavior, call `randomSeed(seed)` explicitly before this method.
   *
   * @returns {Quadrille} The modified quadrille (for chaining).
   */
  randomize() {
    const clone = this.clone(false);
    this.clear();
    clone.visit(({ value }) => {
      let row, col;
      do {
        const index = this._p.int(this._p.random(this.size));
        ({ row, col } = this._fromIndex(index));
      } while (this.isFilled(row, col));
      this.fill(row, col, value);
    }, this.constructor.isFilled);
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
    if (this.height > 1 && this.isValid(row, 0)) {
      this._memory2D.splice(row, 1);
    }
    return this;
  }

  /**
   * Swaps two rows or two cells in the quadrille.
   *
   * - `swap(row1, row2)` swaps two rows.
   * - `swap(row1, col1, row2, col2)` swaps two individual cells.
   *
   * @param  {...number} args - Either 2 or 4 integers.
   * @returns {Quadrille} The quadrille (for chaining).
   */
  swap(...args) {
    const isInteger = Number.isInteger;
    if (args.length === 2) {
      if (args.every(isInteger) && this.isValid(args[0], 0) && this.isValid(args[1], 0)) {
        const temp = this._memory2D[args[0]];
        this._memory2D[args[0]] = this._memory2D[args[1]];
        this._memory2D[args[1]] = temp;
      }
    } else if (args.length === 4) {
      if (args.every(isInteger) && this.isValid(args[0], args[1]) && this.isValid(args[2], args[3])) {
        const temp = this._memory2D[args[0]][args[1]];
        this._memory2D[args[0]][args[1]] = this._memory2D[args[2]][args[3]];
        this._memory2D[args[2]][args[3]] = temp;
      }
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
      const half_size = (mask.width - 1) / 2;
      if (row === undefined || col === undefined) {
        const source = this.clone();
        this.visit(
          ({ row, col }) => this._conv(mask, row, col, half_size, source),
          {
            row: r => r >= half_size && r < this.height - half_size,
            col: c => c >= half_size && c < this.width - half_size
          }
        );
      }
      else if (row >= half_size && row < this.height - half_size && col >= half_size && col < this.width - half_size) {
        this._conv(mask, row, col, half_size);
      }
    }
    return this;
  }

  _conv(mask, row, col, cache_half_size = (mask.width - 1) / 2, source = this) {
    let r = 0;
    let g = 0;
    let b = 0;
    let apply;
    for (let imask = 0; imask < mask.height; imask++) {
      for (let jmask = 0; jmask < mask.width; jmask++) {
        const i = row + imask - cache_half_size;
        const j = col + jmask - cache_half_size;
        const neighbor = source.read(i, j);
        let mask_value = mask.read(imask, jmask);
        if (this.constructor.isColor(neighbor) && (typeof mask_value === 'number' || this.constructor.isColor(mask_value))) {
          apply = true;
          const weight = typeof mask_value === 'number'
            ? mask_value
            : 0.299 * this._p.red(mask_value) + 0.587 * this._p.green(mask_value) + 0.114 * this._p.blue(mask_value);
          r += this._p.red(neighbor) * weight;
          g += this._p.green(neighbor) * weight;
          b += this._p.blue(neighbor) * weight;
        }
      }
    }
    if (apply) {
      r = this._p.constrain(r, 0, 255);
      g = this._p.constrain(g, 0, 255);
      b = this._p.constrain(b, 0, 255);
      this.fill(row, col, this._p.color(r, g, b));
    }
  }

  /**
   * Colorize the (row0, col0), (row1, col1), (row2, col2) triangle, according to
   * color0, color1 and color2 colors (either p5.Color, arrays or strings), respectively.
   */
  colorizeTriangle(row0, col0, row1, col1, row2, col2, color0, color1 = color0, color2 = color0) {
    this.rasterizeTriangle(row0, col0, row1, col1, row2, col2,
      ({ array: xyza }) => this._p.color(xyza),
      [this._p.red(color0), this._p.green(color0), this._p.blue(color0), this._p.alpha(color0)],
      [this._p.red(color1), this._p.green(color1), this._p.blue(color1), this._p.alpha(color1)],
      [this._p.red(color2), this._p.green(color2), this._p.blue(color2), this._p.alpha(color2)]
    );
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
      this.visit(({ row, col }) => {
        const coords = this._barycentric_coords(row, col, row0, col0, row1, col1, row2, col2);
        // interpolate all array attributes for the current cell only if it is inside the triangle
        if (coords.w0 >= 0 && coords.w1 >= 0 && coords.w2 >= 0) {
          const length = Math.max(array0.length, array1.length, array2.length);
          const array = new Array(length);
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
    const edges = this._edge_functions(row, col, row0, col0, row1, col1, row2, col2);
    const area = this._parallelogram_area(row0, col0, row1, col1, row2, col2);
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
    const e01 = (row0 - row1) * col + (col1 - col0) * row + (col0 * row1 - row0 * col1);
    const e12 = (row1 - row2) * col + (col2 - col1) * row + (col1 * row2 - row1 * col2);
    const e20 = (row2 - row0) * col + (col0 - col2) * row + (col2 * row0 - row2 * col0);
    return { e01, e12, e20 };
  }

  /**
   * Sort cells according to their coloring. Modes are: 'LUMA', 'AVG' and 'DISTANCE' (to a given target).
   */
  sort({
    mode = 'LUMA',
    target = this.constructor.outline,
    ascending = true,
    textColor = this.constructor.textColor,
    textZoom = this.constructor.textZoom,
    background = this.constructor.background,
    cellLength = this._p.int(this._p.max(this._p.width / this.width, this._p.height / this.height) / 10),
    outlineWeight = this.constructor.outlineWeight,
    outline = this.constructor.outline,
    textFont,
    origin = 'corner',
    options = {},
    imageDisplay = this.constructor.imageDisplay,
    colorDisplay = this.constructor.colorDisplay,
    stringDisplay = this.constructor.stringDisplay,
    numberDisplay = this.constructor.numberDisplay,
    arrayDisplay = this.constructor.arrayDisplay,
    objectDisplay = this.constructor.objectDisplay,
    functionDisplay = this.constructor.functionDisplay,
    tileDisplay = this.constructor.tileDisplay
  } = {}) {
    let memory1D = this.toArray();
    const params = {
      background, cellLength, textColor, textZoom, imageDisplay, colorDisplay, outline, textFont, origin, options,
      outlineWeight, stringDisplay, numberDisplay, arrayDisplay, objectDisplay, functionDisplay, tileDisplay,
      renderer: 'p2d' // renderer: this._mode // kills machine in webgl!
    };
    switch (mode) {
      case 'DISTANCE':
        memory1D.sort((valueA, valueB) => {
          params.value = valueA;
          const sa = this.constructor.sample({ ...params, value: valueA });
          const sb = this.constructor.sample({ ...params, value: valueB });
          const wa = Math.sqrt(
            Math.pow((sa.r / sa.total) - this._p.red(target), 2) +
            Math.pow((sa.g / sa.total) - this._p.green(target), 2) +
            Math.pow((sa.b / sa.total) - this._p.blue(target), 2) +
            Math.pow((sa.a / sa.total) - this._p.alpha(target), 2)
          );
          const wb = Math.sqrt(
            Math.pow((sb.r / sb.total) - this._p.red(target), 2) +
            Math.pow((sb.g / sb.total) - this._p.green(target), 2) +
            Math.pow((sb.b / sb.total) - this._p.blue(target), 2) +
            Math.pow((sb.a / sb.total) - this._p.alpha(target), 2)
          );
          return wa - wb;
        });
        break;
      case 'AVG':
        memory1D.sort((valueA, valueB) => {
          const sa = this.constructor.sample({ ...params, value: valueA });
          const sb = this.constructor.sample({ ...params, value: valueB });
          const wa = 0.333 * sa.r + 0.333 * sa.g + 0.333 * sa.b;
          const wb = 0.333 * sb.r + 0.333 * sb.g + 0.333 * sb.b;
          return wa - wb;
        });
        break;
      case 'LUMA':
      default:
        memory1D.sort((valueA, valueB) => {
          const sa = this.constructor.sample({ ...params, value: valueA });
          const sb = this.constructor.sample({ ...params, value: valueB });
          const wa = 0.299 * sa.r + 0.587 * sa.g + 0.114 * sa.b;
          const wb = 0.299 * sb.r + 0.587 * sb.g + 0.114 * sb.b;
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
    textFont,
    origin = 'corner',
    options = {},
    renderer = 'p2d',
    imageDisplay = this.constructor.imageDisplay,
    colorDisplay = this.constructor.colorDisplay,
    stringDisplay = this.constructor.stringDisplay,
    numberDisplay = this.constructor.numberDisplay,
    arrayDisplay = this.constructor.arrayDisplay,
    objectDisplay = this.constructor.objectDisplay,
    functionDisplay = this.constructor.functionDisplay,
    tileDisplay = this.constructor.tileDisplay,
    background = this.constructor.background,
    cellLength = this.constructor.cellLength,
    outlineWeight = this.constructor.outlineWeight,
    outline = this.constructor.outline,
    textColor = this.constructor.textColor,
    textZoom = this.constructor.textZoom
  } = {}) {
    const graphics = createGraphics(cellLength, cellLength, renderer);
    graphics.background(background);
    const params = {
      graphics, value, textColor, textZoom, outline, outlineWeight, cellLength, textFont, origin, options,
      imageDisplay, colorDisplay, stringDisplay, numberDisplay, arrayDisplay, objectDisplay, functionDisplay, tileDisplay
    };
    this._display(params);
    graphics.loadPixels();
    let r = 0, g = 0, b = 0, a = 0;
    const total = graphics.pixels.length / 4;
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
      { check: this.isFunction.bind(this), display: params.functionDisplay },
      { check: this.isImage.bind(this), display: params.imageDisplay },
      { check: this.isColor.bind(this), display: params.colorDisplay },
      { check: this.isNumber.bind(this), display: params.numberDisplay },
      { check: this.isString.bind(this), display: params.stringDisplay },
      { check: this.isArray.bind(this), display: params.arrayDisplay },
      { check: this.isObject.bind(this), display: params.objectDisplay }
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
   * Number cell drawing.
   */
  static numberDisplay({
    graphics,
    value,
    cellLength = this.cellLength
  } = {}) {
    // TODO p5v2 hack graphics.constrain failed (constrain may be statically implement)
    this.colorDisplay({ graphics, value: graphics.color(p5.prototype.constrain(value, 0, 255)), cellLength });
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

  static functionDisplay({
    graphics,
    options,
    value,
    cellLength = this.cellLength,
  } = {}) {
    const fbo = value.fbo ?? (value.fbo = graphics.createFramebuffer({ width: cellLength, height: cellLength }));
    const pg = fbo.graphics ?? (fbo.graphics = graphics);
    fbo.begin();
    pg._rendererState = pg.push();
    (options?.origin === 'corner' && pg.translate(-cellLength / 2, -cellLength / 2));
    value.call(pg, options);
    pg.pop(pg._rendererState);
    fbo.end();
    this.imageDisplay({ graphics, cellLength, value: fbo });
  }

  /**
   * Image cell drawing.
   */
  static imageDisplay({
    graphics,
    value,
    cellLength = this.cellLength
  } = {}) {
    const img = value instanceof p5.Framebuffer
      ? (value.graphics ||= graphics) !== graphics
        ? (console.debug('fbo reformat needed'), value.get())
        : value
      : value;
    graphics.noStroke();
    graphics.image(img, 0, 0, cellLength, cellLength);
  }

  /**
   * String cell drawing.
   */
  static stringDisplay({
    graphics,
    value,
    textFont,
    cellLength = this.cellLength,
    textColor = this.textColor,
    textZoom = this.textZoom
  } = {}) {
    textFont && graphics.textFont(textFont)
    graphics.noStroke();
    graphics.fill(textColor);
    graphics.textSize(cellLength * textZoom / value.length);
    graphics.textAlign('center', 'center');
    graphics.text(value, 0, 0, cellLength, cellLength);
  }

  /**
   * Tesselation or tiling.
   */
  static tileDisplay({
    graphics,
    cellLength = this.cellLength,
    outline = this.outline,
    outlineWeight = this.outlineWeight
  } = {}) {
    if (outlineWeight !== 0) {
      graphics.noFill();
      graphics.stroke(outline);
      graphics.strokeWeight(outlineWeight);
      graphics.quad(0, 0, cellLength, 0, cellLength, cellLength, 0, cellLength);
    }
  }
}

// Export the Quadrille class as the default export
export default Quadrille;