/**
 * @file Defines the Quadrille class — the core data structure of the p5.quadrille.js library.
 * @version 3.4.13
 * @author JP Charalambos
 * @license GPL-3.0-only
 *
 * @description
 * Grid-based teaching and rendering utility for p5.js.
 * This module defines the Quadrille class for cell storage and manipulation.
 * See https://objetos.github.io/docs/api/ for full usage and examples.
 */

'use strict';

import p5 from 'p5';

// TODOs
// i. isPolyomino()
// ii. perlin / simplex noise
// iii. sort() using 'webgl' mode, requires using fbos to speed up sample() (which currently only supports 'p2d' renderer)
// iv. screenRow and screenCol lacks webgl mode (would require p5.treegl)
// v. Decide mouseCornerX, mouseCornerY, screenCornerX() and screenCornerY()
class Quadrille {
  /**
   * Library version identifier.
   * @type {string}
   */
  static VERSION = '3.4.13';

  // Factory

  /**
   * Tags a function as a factory, meaning it should be executed during `fill`.
   * The function will be called with `{ row, col }` and must return a value
   * to be stored in the quadrille. Display functions (returning `undefined`)
   * should not use this. If a non-function is passed, it is returned as-is.
   * @param {*} fn - A function returning a value to fill cells with, or a direct value.
   * @returns {Function|*} The same function tagged with `._isFactory = true`, or the value itself.
   */
  static factory(fn) {
    this.isFunction(fn) && (fn._isFactory = true);
    return fn;
  }

  /**
   * Declares that a value is a shared singleton to be reused across cells. 
   * Unlike `Quadrille.factory(fn)`, this method is purely semantic and does
   * not modify the value. It clarifies that the same instance is intended
   * to be reused when passed to `fill()`, particularly for object values
   * like class instances.
   * This is useful for improving code readability and documenting intent.
   * @example
   * const elf = Quadrille.singleton(new Unit('Elf', 'blue', '🧝'));
   * game.fill(elf); // same object used in all cells
   * @param {*} value - A literal or object to share across multiple cells.
   * @returns {*} The same value, unmodified.
   */
  static singleton(value) {
    return value;
  }

  // STYLE

  /**
   * Default text color.
   * @type {string}
   */
  static _textColor = 'DodgerBlue';

  /**
   * Gets the current text color.
   * @returns {string}
   */
  static get textColor() {
    return this._textColor;
  }

  /**
   * Sets the text color used when rendering values.
   * Accepts any valid CSS string or p5 color.
   * @param {string|*} value
   */
  static set textColor(value) {
    this._textColor = typeof value === 'string' || this.isColor(value) ? value : this._textColor;
  }

  /**
   * Default text drawing zoom.
   * @type {number}
   */
  static _textZoom = 0.78;

  /**
   * Gets the current text zoom scale.
   * @returns {number}
   */
  static get textZoom() {
    return this._textZoom;
  }

  /**
   * Sets the text zoom scale. Must be a positive number.
   * @param {number} value
   */
  static set textZoom(value) {
    this._textZoom = (typeof value === 'number' && value > 0) ? value : this._textZoom;
  }

  /**
   * Default drawing outline.
   * @type {string}
   */
  static _outline = 'OrangeRed';

  /**
   * Gets the current outline color.
   * @returns {string}
   */
  static get outline() {
    return this._outline;
  }

  /**
   * Sets the outline color used to draw cells.
   * Accepts any valid CSS string or p5 color.
   * @param {string|*} value
   */
  static set outline(value) {
    this._outline = typeof value === 'string' || this.isColor(value) ? value : this._outline;
  }

  /**
   * Default drawing outline weight.
   * @type {number}
   */
  static _outlineWeight = 2;

  /**
   * Gets the current outline stroke weight.
   * @returns {number}
   */
  static get outlineWeight() {
    return this._outlineWeight;
  }

  /**
   * Sets the outline stroke weight. Must be a non-negative number.
   * @param {number} value
   */
  static set outlineWeight(value) {
    this._outlineWeight = (typeof value === 'number' && value >= 0) ? value : this._outlineWeight;
  }

  /**
   * Default drawing cell length.
   * @type {number}
   */
  static _cellLength = 100;

  /**
   * Gets the current cell size in pixels.
   * @returns {number}
   */
  static get cellLength() {
    return this._cellLength;
  }

  /**
   * Sets the cell size in pixels. Must be a positive number.
   * @param {number} value
   */
  static set cellLength(value) {
    this._cellLength = (typeof value === 'number' && value > 0) ? value : this._cellLength;
  }

  /**
   * Default background used in sort.
   * @type {string}
   */
  static _background = 'white';

  /**
   * Gets the background color used in sort().
   * @returns {string}
   */
  static get background() {
    return this._background;
  }

  /**
   * Sets the background color used in sort().
   * Accepts any valid CSS string or p5 color.
   * @param {string|*} value
   */
  static set background(value) {
    this._background = typeof value === 'string' || this.isColor(value) ? value : this._background;
  }

  // CHESS

  /**
   * Default chess dark squares.
   * @type {string}
   */
  static _darkSquare = '#D28C45'; // Wikipedia; '#769555' // chess.com

  /**
   * Gets the color for dark chessboard squares.
   * @returns {string}
   */
  static get darkSquare() {
    return this._darkSquare;
  }

  /**
   * Sets the color for dark chessboard squares.
   * @param {string|*} value
   */
  static set darkSquare(value) {
    this._darkSquare = typeof value === 'string' || this.isColor(value) ? value : this._darkSquare;
  }

  /**
   * Default chess light squares.
   * @type {string}
   */
  static _lightSquare = '#FDCDAA'; // Wikipedia; '#EBECCF' // chess.com

  /**
   * Gets the color for light chessboard squares.
   * @returns {string}
   */
  static get lightSquare() {
    return this._lightSquare;
  }

  /**
   * Sets the color for light chessboard squares.
   * @param {string|*} value
   */
  static set lightSquare(value) {
    this._lightSquare = typeof value === 'string' || this.isColor(value) ? value : this._lightSquare;
  }

  /**
   * Internal FEN → symbol map (Unicode, emoji, image, etc.).
   * @type {Map<string, *>}
   * @private
   */
  static _chessSymbols = new Map([
    ['K', '♔'], ['Q', '♕'], ['R', '♖'], ['B', '♗'], ['N', '♘'], ['P', '♙'],
    ['k', '♚'], ['q', '♛'], ['r', '♜'], ['b', '♝'], ['n', '♞'], ['p', '♟']
  ]);

  /**
   * Gets a copy of the FEN → symbol map.
   * @returns {Map<string, *>} Copy of internal chessSymbols map.
   */
  static get chessSymbols() {
    return new Map(this._chessSymbols);
  }

  /**
   * Updates entries in the FEN → symbol mapping.
   * Accepts either a plain object or a Map. Merges into the current map to support partial updates.
   * @param {Object<string, *>|Map<string, *>} symbols - Entries to merge into the FEN → symbol map.
   */
  static set chessSymbols(symbols) {
    if (symbols instanceof Map) {
      for (const [k, v] of symbols) this._chessSymbols.set(k, v);
    } else {
      for (const [k, v] of Object.entries(symbols)) this._chessSymbols.set(k, v);
    }
  }

  /**
   * Gets a reverse map from symbol to FEN key.
   * @returns {Map<*, string>} New reverse map (symbol → FEN)
   */
  static get chessKeys() {
    return new Map([...this._chessSymbols].map(([k, v]) => [v, k]));
  }

  /**
   * Returns the bit index (row-major).
   * Default is big-endian (MSB = top-left). Set `littleEndian = true` for LSB = top-left.
   * If the cell is out of bounds, logs a warning and returns `undefined`.
   * @param {number} row
   * @param {number} col
   * @param {number} [width=8]
   * @param {number} [height=8]
   * @param {boolean} [littleEndian=false]
   * @returns {number|undefined} The bit index, or undefined if out of bounds.
   */
  static bitIndex(row, col, width = 8, height = 8, littleEndian = false) {
    if (row < 0 || row >= height || col < 0 || col >= width) {
      const suggestions = [];
      row < 0 && suggestions.push(`height ≥ ${height - row}`);
      row >= height && suggestions.push(`height ≥ ${row + 1}`);
      col < 0 && suggestions.push(`width ≥ ${width - col}`);
      col >= width && suggestions.push(`width ≥ ${col + 1}`);
      console.warn(
        `Ignored out-of-bounds cell (${row}, ${col}) for quadrille size ${width}×${height}.` +
        (suggestions.length ? ` Suggested: ${suggestions.join(', ')}.` : '')
      );
      return;
    }
    const index = row * width + col;
    return littleEndian ? index : (width * height - 1 - index);
  }

  /**
   * Returns the cell position corresponding to a bit index.
   * Optionally supports little-endian (default: false) layout.
   * If the bit index is out of bounds, logs a warning.
   * @param {number|bigint} bitIndex - Bit index to convert.
   * @param {number} [width=8] - Number of columns in the quadrille.
   * @param {number} [height=8] - Number of rows in the quadrille.
   * @param {boolean} [littleEndian=false] - Whether to use little-endian ordering.
   * @returns {{row: number, col: number}|undefined} The cell position, or undefined if out of bounds.
   */
  static bitCell(bitIndex, width = 8, height = 8, littleEndian = false) {
    const maxIndex = width * height - 1;
    const raw = Number(bitIndex);
    if (raw < 0 || raw > maxIndex) {
      console.warn(`Ignored out-of-bounds bit index ${bitIndex} for quadrille size ${width}×${height}. Expected range: 0–${maxIndex}.`);
      return;
    }
    const index = littleEndian ? raw : maxIndex - raw;
    return {
      row: Math.floor(index / width),
      col: index % width
    };
  }

  // ALGEBRA

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
   * Merges two quadrilles by applying a binary operator to their overlapping cells.
   * Builds the result memory directly and returns a fresh Quadrille (no ctor call).
   * @param {Quadrille} q1
   * @param {Quadrille} q2
   * @param {(a: *, b: *) => *} operator
   * @param {number} [row]
   * @param {number} [col]
   * @returns {Quadrille}
   */
  static merge(q1, q2, operator, row, col) {
    const sameOrigin = q1._row !== undefined && q2._row !== undefined &&
      q1._cellLength !== undefined && q1._cellLength === q2._cellLength;
    row ??= sameOrigin ? q2._row - q1._row : 0;
    col ??= sameOrigin ? q2._col - q1._col : 0;
    const width = col < 0 ? Math.max(q2.width, q1.width - col) : Math.max(q1.width, q2.width + col);
    const height = row < 0 ? Math.max(q2.height, q1.height - row) : Math.max(q1.height, q2.height + row);
    const mem = this._allocNullMemory(height, width);
    for (let i = 0; i < height; i++) {
      const outRow = mem[i];
      const i1 = row < 0 ? i + row : i;
      const i2 = row > 0 ? i - row : i;
      for (let j = 0; j < width; j++) {
        const j1 = col < 0 ? j + col : j;
        const j2 = col > 0 ? j - col : j;
        const v1 = q1.read(i1, j1);
        const v2 = q2.read(i2, j2);
        const r = operator(v1, v2);
        outRow[j] = this.isFilled(r) ? r : null;
      }
    }
    return this._allocQ(q1, mem);
  }

  /**
   * Allocates a height×width 2D array filled with nulls (never undefined).
   * @param {number} h
   * @param {number} w
   * @returns {Array<Array<*>>}
   */
  static _allocNullMemory(h, w) {
    const mem = new Array(h);
    for (let i = 0; i < h; i++) {
      const row = new Array(w);
      for (let j = 0; j < w; j++) row[j] = null;
      mem[i] = row;
    }
    return mem;
  }

  /**
   * Allocates a Quadrille *without* calling the constructor, mirroring the
   * fresh defaults of `new Quadrille(p, ...)`.
   * Usage:
   *   _allocQ(from, h, w)   -> creates h×w null-padded memory
   *   _allocQ(from, mem2D)  -> wraps provided 2D array
   * Fresh defaults replicated:
   *   _p:          from._p
   *   _cellLength: from.constructor.cellLength
   *   _x:          0
   *   _y:          0
   *   _origin:     'corner'
   *   _row/_col:   left undefined
   * @param {Quadrille} from
   * @param {number|Array<Array<*>>} hOrMem
   * @param {number} [w]
   * @returns {Quadrille}
   */
  static _allocQ(from, hOrMem, w) {
    const ctor = from.constructor;
    const mem = Array.isArray(hOrMem) ? hOrMem : this._allocNullMemory(hOrMem, w);
    const q = Object.create(ctor.prototype);
    q._p = from._p;
    q._memory2D = mem;
    q._cellLength = ctor.cellLength;
    q._x = 0;
    q._y = 0;
    q._origin = 'corner';
    // _row/_col intentionally left undefined
    return q;
  }

  /**
   * Logical NOT of a quadrille (non-destructive).
   * Returns a new quadrille where filled/empty status is inverted.
   * @param {Quadrille} q Input quadrille
   * @param {*} target Value to fill where the quadrille is empty
   * @returns {Quadrille} A new quadrille with inverted filled/empty status
   */
  static not(q, target) {
    return q.clone().not(target);
  }

  /**
   * Returns a shifted copy of the given Quadrille.
   * Shifts all filled cells of `q` by (dRow, dCol) across the grid. 
   * - dRow > 0: shift down;   dRow < 0: shift up
   * - dCol > 0: shift right;  dCol < 0: shift left
   * - wrap = true (default): toroidal wrap-around
   * - wrap = false: clip at edges (cells falling outside are discarded)
   * This function is **non-destructive**: the input Quadrille remains unchanged.
   * @param {Quadrille} q - The Quadrille to shift.
   * @param {number} dRow - Vertical shift amount.
   * @param {number} dCol - Horizontal shift amount.
   * @param {boolean} [wrap=true] - Whether to wrap around the edges.
   * @returns {Quadrille} A new shifted Quadrille.
   */
  static shift(q, dRow, dCol, wrap = true) {
    return q.clone().shift(dRow, dCol, wrap);
  }

  /**
   * Constructs a new Quadrille instance with multiple supported initialization modes:
   * 1. No arguments → 8×8 chessboard with default colors.
   * 2. width, height → empty quadrille of given dimensions.
   * 3. two colors → 8×8 chessboard with custom light/dark colors.
   * 4. jagged or flat array → quadrille from array contents.
   * 5. width + array → array reshaped into rows.
   * 6. string → single-row from characters.
   * 7. width + string → reshaped string.
   * 8. width + image → visual content from image.
   * 9. width + image + boolean → image pixelation.
   * 10. width + height + predicate + value → fill by predicate.
   * 11. width + height + order + value → filled by order (random).
   * 12. width + bitboard + value [+ littleEndian] → bitboard pattern (auto height).
   * 13. width + height + bitboard + value [+ littleEndian] → bitboard pattern (explicit size).
   * Used internally by `p5.prototype.createQuadrille`.
   * @param {p5} p - The p5 instance.
   * @param {...any} args - Arguments to select construction mode.
   */
  constructor(p, ...args) {
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
    // Handle bigint cases early to avoid ambiguity with boolean third argument
    if (args.length === 3 &&
      typeof args[0] === 'number' &&
      typeof args[1] === 'bigint') {
      const bitLength = args[1].toString(2).length;
      const rows = Math.ceil(bitLength / args[0]);
      this._memory2D = Array(rows).fill().map(() => Array(args[0]).fill(null));
      this.fill(args[1], args[2]);
      return;
    }
    if (args.length === 4 &&
      typeof args[0] === 'number' &&
      typeof args[1] === 'bigint' &&
      typeof args[3] === 'boolean') {
      const bitLength = args[1].toString(2).length;
      const rows = Math.ceil(bitLength / args[0]);
      this._memory2D = Array(rows).fill().map(() => Array(args[0]).fill(null));
      this.fill(args[1], args[2], args[3]);
      return;
    }
    if (args.length === 3 && typeof args[0] === 'number' && typeof args[1] !== 'number' && typeof args[2] === 'boolean') {
      this._memory2D = Array(Math.round(args[0] * args[1].height / args[1].width))
        .fill().map(() => Array(args[0]).fill(null));
      this._fromImage(args[1], args[2]);
      return;
    }
    if (args.length === 4 &&
      typeof args[0] === 'number' && typeof args[1] === 'number' && typeof args[2] === 'function') {
      this._memory2D = Array(args[1]).fill().map(() => Array(args[0]).fill(null));
      this.fill(args[2], args[3]);
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
    // Case: width + height + bitboard + value [+ littleEndian]
    if (args.length === 4 &&
      typeof args[0] === 'number' &&
      typeof args[1] === 'number' &&
      typeof args[2] === 'bigint') {
      this._memory2D = Array(args[1]).fill().map(() => Array(args[0]).fill(null));
      this.fill(args[2], args[3]);
      return;
    }
    if (args.length === 5 &&
      typeof args[0] === 'number' &&
      typeof args[1] === 'number' &&
      typeof args[2] === 'bigint' &&
      typeof args[4] === 'boolean') {
      this._memory2D = Array(args[1]).fill().map(() => Array(args[0]).fill(null));
      this.fill(args[2], args[3], args[4]);
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
              this._memory2D[i][col] = this.constructor._chessSymbols.get(char);
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

  _fromIndex(index, width = this.width) {
    return { row: (index / width) | 0, col: index % width };
  }

  _toIndex(row, col, width = this.width) {
    return row * width + col;
  }

  /**
   * Returns the bit index of the given cell using the instance’s width and height.
   * Delegates to the static version.
   * @param {number} row - Row index of the cell.
   * @param {number} col - Column index of the cell.
   * @param {boolean} [littleEndian=false] - Whether to use little-endian ordering.
   * @returns {number|undefined} The bit index, or undefined if out of bounds.
   */
  bitIndex(row, col, littleEndian = false) {
    return this.constructor.bitIndex(row, col, this.width, this.height, littleEndian);
  }

  /**
   * Returns the cell position for a given bit index using the instance’s dimensions.
   * Delegates to the static version.
   * @param {number|bigint} bitIndex - Bit index to convert.
   * @param {boolean} [littleEndian=false] - Whether to use little-endian ordering.
   * @returns {{row: number, col: number}|undefined} The cell position, or undefined if out of bounds.
   */
  bitCell(bitIndex, littleEndian = false) {
    return this.constructor.bitCell(bitIndex, this.width, this.height, littleEndian);
  }

  // ITERATOR

  /**
   * Iterates over cells and calls the given function with each matching cell object,
   * in row-major order (row 0..height-1, within each row col 0..width-1).
   * The optional `filter` determines which cells are visited:
   * - `null`, `undefined` → all cells
   * - `Function({ row, col, value })` → cells where the predicate returns `true`
   * - `Array` / `Set` of values → cells whose value is contained in the collection
   * - single value (non-function, non-collection) → cells whose value === filter
   * Note: this function does NOT short-circuit; it always visits all eligible cells.
   * @param {(cell: { row: number, col: number, value: any }) => any} callback
   * @param {Array|Set|Function|*|null} [filter]
   * @returns {void}
   */
  visit(callback, filter) {
    const memory2D = this._memory2D;
    const height = this.height;
    const width = this.width;
    // Fast path: null / undefined → iterate all cells directly
    if (filter == null) {
      for (let row = 0; row < height; row++) {
        const rowData = memory2D[row];
        for (let col = 0; col < width; col++) {
          callback({ row, col, value: rowData[col] });
        }
      }
      return;
    }
    // Fast path: Array / Set membership
    if ((filter && typeof filter.has === 'function') || Array.isArray(filter)) {
      const values = Array.isArray(filter) ? new Set(filter) : filter;
      for (let row = 0; row < height; row++) {
        const rowData = memory2D[row];
        for (let col = 0; col < width; col++) {
          const value = rowData[col];
          if (values.has(value)) {
            callback({ row, col, value });
          }
        }
      }
      return;
    }
    // Predicate → evaluate inline
    if (typeof filter === 'function') {
      for (let row = 0; row < height; row++) {
        const rowData = memory2D[row];
        for (let col = 0; col < width; col++) {
          const cell = { row, col, value: rowData[col] };
          if (filter(cell)) {
            callback(cell);
          }
        }
      }
      return;
    }
    // Fast path: single value (strict identity; non-function)
    const needle = filter;
    for (let row = 0; row < height; row++) {
      const rowData = memory2D[row];
      for (let col = 0; col < width; col++) {
        const value = rowData[col];
        if (value === needle) {
          callback({ row, col, value });
        }
      }
    }
  }

  // PROPERTIES

  /**
   * Sets quadrille from 2D memory internal array representation.
   * Accepts either a 2D array, 1D array, FEN string, or flat string.
   * @param {Array|String} memory - Array or string used to set the internal memory.
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
   * Gets the internal 2D array representation of the quadrille.
   * @returns {Array<Array<*>>}
   */
  get memory2D() {
    return this.clone()._memory2D;
  }

  /**
   * Sets quadrille width (number of columns).
   * Triggers transposition hack to simulate column resizing.
   * @param {number} width
   */
  set width(width) {
    this.transpose();
    this.height = width;
    this.transpose();
  }

  /**
   * Gets quadrille width.
   * @returns {number} Number of columns.
   */
  get width() {
    return this._memory2D[0].length;
  }

  /**
   * Sets quadrille height (number of rows).
   * Resizes by inserting or deleting rows.
   * @param {number} height
   */
  set height(height) {
    height = Math.max(1, Math.abs(height));
    const rows = height - this.height;
    while (this.height !== height) {
      rows > 0 ? this.insert(this.height) : this.delete(this.height - 1);
    }
  }

  /**
   * Gets quadrille height.
   * @returns {number} Number of rows.
   */
  get height() {
    return this._memory2D.length;
  }

  /**
   * Gets total number of cells (width × height).
   * @returns {number}
   */
  get size() {
    return this.width * this.height;
  }

  /**
   * Gets number of filled cells in the quadrille.
   * @returns {number}
   */
  get order() {
    let result = 0;
    this.visit(() => result++, ({ value }) => this.constructor.isFilled(value));
    return result;
    // also possible
    // return [...this.cells(({ value }) => this.constructor.isFilled(value))].length;
  }

  /**
   * Gets the row index under the mouse.
   * @returns {number}
   */
  get mouseRow() {
    return this.screenRow(this._p.mouseY);
  }

  /**
   * Gets the column index under the mouse.
   * @returns {number}
   */
  get mouseCol() {
    return this.screenCol(this._p.mouseX);
  }

  /**
   * Gets the minimal axis-aligned span of filled cells.
   * Returns undefined if the quadrille has no filled cells.
   * @returns {{row:number, col:number, width:number, height:number}|undefined}
   */
  get span() {
    let minRow = this.height, maxRow = -1, minCol = this.width, maxCol = -1;
    this.visit(
      ({ row, col }) => {
        row < minRow && (minRow = row);
        row > maxRow && (maxRow = row);
        col < minCol && (minCol = col);
        col > maxCol && (maxCol = col);
      },
      ({ value }) => this.constructor.isFilled(value)
    );
    if (maxRow === -1) return; // fully empty
    return {
      row: minRow,
      col: minCol,
      width: maxCol - minCol + 1,
      height: maxRow - minRow + 1
    };
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

  // QUERIES

  /**
   * Counts the number of non-empty cells in the specified row.
   * @param {number} row - Row index.
   * @returns {number} Number of filled cells in the row.
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
   * Searches the quadrille for matches to a given pattern quadrille.
   * @param {Quadrille} pattern - The pattern to search for.
   * @param {boolean} [strict=false] - Whether values must match exactly, not just be filled.
   * @returns {Array<{ row: number, col: number }>} An array of match locations. Empty if no match.
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

  // CELL CONTENTS

  /**
   * Reads the value at the specified row and column.
   * @param {number} row
   * @param {number} col
   * @returns {*} Quadrille entry at (row, col), or `undefined` if out of bounds.
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
   * Checks if a given cell position is valid.
   * @param {number} row
   * @param {number} col
   * @returns {boolean} True if the cell is within bounds.
   */
  isValid(row, col) {
    return row >= 0 && row < this.height && col >= 0 && col < this.width;
  }

  /**
   * Determines whether a value is considered empty.
   * @param {*} value
   * @returns {boolean}
   */
  static isEmpty(value) {
    return value == null;
  }

  /**
   * Determines whether a value is considered filled.
   * @param {*} value
   * @returns {boolean}
   */
  static isFilled(value) {
    return value != null;
  }

  /**
   * Checks whether the given value is a boolean.
   * @param {*} value
   * @returns {boolean}
   */
  static isBoolean(value) {
    return typeof value === 'boolean';
  }

  /**
   * Checks whether the given value is a symbol.
   * @param {*} value
   * @returns {boolean}
   */
  static isSymbol(value) {
    return typeof value === 'symbol';
  }

  /**
   * Checks whether the given value is a number.
   * @param {*} value
   * @returns {boolean}
   */
  static isNumber(value) {
    return typeof value === 'number';
  }

  /**
   * Checks whether the given value is a BigInt.
   * @param {*} value
   * @returns {boolean}
   */
  static isBigInt(value) {
    return typeof value === 'bigint';
  }

  /**
   * Checks whether the given value is a string.
   * @param {*} value
   * @returns {boolean}
   */
  static isString(value) {
    return typeof value === 'string';
  }

  /**
   * Checks whether the given value is a p5.Color instance.
   * @param {*} value
   * @returns {boolean}
   */
  static isColor(value) {
    return value instanceof p5.Color;
  }

  /**
   * Checks whether the given value is a function.
   * @param {*} value
   * @returns {boolean}
   */
  static isFunction(value) {
    return typeof value === 'function';
  }

  /**
   * Checks whether the given value is a p5.Image, p5.Graphics, MediaElement (video), or Framebuffer.
   * @param {*} value
   * @returns {boolean}
   */
  static isImage(value) {
    return value instanceof p5.Image || (value instanceof p5.MediaElement && value.elt instanceof HTMLVideoElement) || value instanceof p5.Graphics || value instanceof p5.Framebuffer;
  }

  /**
   * Checks whether the given value is an array.
   * @param {*} value
   * @returns {boolean}
   */
  static isArray(value) {
    return Array.isArray(value);
  }

  /**
   * Checks whether the given value is a generic object (not a color, image, function, or array).
   * @param {*} value
   * @returns {boolean}
   */
  static isObject(value) {
    return this.isFilled(value) &&
      !this.isColor(value) &&
      !this.isImage(value) &&
      !this.isArray(value) &&
      !this.isFunction(value) &&
      typeof value === 'object';
  }

  // Instance methods

  /**
   * Checks whether the cell at (row, col) is empty.
   * @param {number} row
   * @param {number} col
   * @returns {boolean}
   */
  isEmpty(row, col) {
    return this.constructor.isEmpty(this.read(row, col));
  }

  /**
   * Checks whether the cell at (row, col) is filled.
   * @param {number} row
   * @param {number} col
   * @returns {boolean}
   */
  isFilled(row, col) {
    return this.constructor.isFilled(this.read(row, col));
  }

  /**
   * Checks whether the cell at (row, col) contains a boolean.
   * @param {number} row
   * @param {number} col
   * @returns {boolean}
   */
  isBoolean(row, col) {
    return this.constructor.isBoolean(this.read(row, col));
  }

  /**
   * Checks whether the cell at (row, col) contains a symbol.
   * @param {number} row
   * @param {number} col
   * @returns {boolean}
   */
  isSymbol(row, col) {
    return this.constructor.isSymbol(this.read(row, col));
  }

  /**
   * Checks whether the cell at (row, col) contains a number.
   * @param {number} row
   * @param {number} col
   * @returns {boolean}
   */
  isNumber(row, col) {
    return this.constructor.isNumber(this.read(row, col));
  }

  /**
   * Checks whether the cell at (row, col) contains a BigInt.
   * @param {number} row
   * @param {number} col
   * @returns {boolean}
   */
  isBigInt(row, col) {
    return this.constructor.isBigInt(this.read(row, col));
  }

  /**
   * Checks whether the cell at (row, col) contains a string.
   * @param {number} row
   * @param {number} col
   * @returns {boolean}
   */
  isString(row, col) {
    return this.constructor.isString(this.read(row, col));
  }

  /**
   * Checks whether the cell at (row, col) contains a color.
   * @param {number} row
   * @param {number} col
   * @returns {boolean}
   */
  isColor(row, col) {
    return this.constructor.isColor(this.read(row, col));
  }

  /**
   * Checks whether the cell at (row, col) contains an array.
   * @param {number} row
   * @param {number} col
   * @returns {boolean}
   */
  isArray(row, col) {
    return this.constructor.isArray(this.read(row, col));
  }

  /**
   * Checks whether the cell at (row, col) contains an object.
   * @param {number} row
   * @param {number} col
   * @returns {boolean}
   */
  isObject(row, col) {
    return this.constructor.isObject(this.read(row, col));
  }

  /**
   * Checks whether the cell at (row, col) contains an image or graphics object.
   * @param {number} row
   * @param {number} col
   * @returns {boolean}
   */
  isImage(row, col) {
    return this.constructor.isImage(this.read(row, col));
  }

  /**
   * Checks whether the cell at (row, col) contains a function.
   * @param {number} row
   * @param {number} col
   * @returns {boolean}
   */
  isFunction(row, col) {
    return this.constructor.isFunction(this.read(row, col));
  }

  // MUTATORS

  /**
   * Replaces cell values.
   * 1. `replace(value)` — replaces all filled cells with `value`.
   * 2. `replace(value1, value2)` — replaces occurrences of `value1` with `value2`.
   * @param {...*} args
   * @returns {Quadrille} The modified quadrille (for chaining).
   */
  replace(...args) {
    args.length === 1 && this.visit(({ row, col }) => this.fill(row, col, args[0]), ({ value }) => this.constructor.isFilled(value));
    args.length === 2 && this.visit(({ row, col }) => this.fill(row, col, args[1]), ({ value }) => value === args[0]);
    return this;
  }

  /**
   * Clears cell values in various ways:
   * 1. `clear()` — clears all filled cells.
   * 2. `clear(predicate)` — clears all cells for which the predicate returns true.
   * 3. `clear(row)` — clears a specific row.
   * 4. `clear(bitboard, littleEndian = false)` — clears filled cells based on a bitboard (as a BigInt); MSB corresponds to the top-left cell by default.
   * 5. `clear(row, col)` — clears a specific cell.
   * 6. `clear(row, col, directions)` — flood clears from a cell.
   * 7. `clear(row, col, border)` — flood clears from a cell with optional border clearing.
   * 8. `clear(row, col, directions, border)` — flood clears from a cell using given directions and border.
   * @param {...*} args
   * @returns {Quadrille} The modified quadrille (for chaining).
   */
  clear(...args) {
    if (args.length === 0) {
      this._memory2D = this._memory2D.map(row => row.map(cell => this._clearCell(cell)));
    }
    if (args.length === 1 && typeof args[0] === 'function') {
      this.visit(({ row, col, value }) => {
        this._memory2D[row][col] = this._clearCell(value);
      }, args[0]);
    }
    if (args.length === 1 && typeof args[0] === 'number') {
      if (this.isValid(args[0], 0)) {
        this._memory2D[args[0]] = this._memory2D[args[0]].map(cell => this._clearCell(cell));
      }
    }
    if ((args.length === 1 || args.length === 2) && typeof args[0] === 'bigint') {
      const bitboard = args[0];
      const littleEndian = args[1] === true;
      if (bitboard < 0n) {
        console.warn('Bitboard cannot be negative');
      }
      else {
        this.visit(({ row, col }) => {
          const bit = this.bitIndex(row, col, littleEndian);
          bitboard & 1n << BigInt(bit) && (this._memory2D[row][col] = this._clearCell(this._memory2D[row][col]));
        }, ({ value }) => this.constructor.isFilled(value));
        const totalBits = bitboard.toString(2).length;
        const maxBits = this.width * this.height;
        if (totalBits > maxBits) {
          console.warn(
            `Bitboard has ${totalBits} bits but quadrille holds only ${maxBits}. ` +
            `Increase quadrille width and/or height so that width * height ≥ ${totalBits}.`
          );
        }
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
   * Fills the quadrille using a variety of modes:
   * 1. `fill()` — fills all cells in chessboard pattern using default colors.
   * 2. `fill(value)` — fills all empty cells with a value or factory.
   * 3. `fill(predicate, value)` — fills matching cells with a value.
   * 4. `fill(color1, color2)` — fills chessboard with specified colors.
   * 5. `fill(row, value)` — fills a specific row.
   * 6. `fill(bitboard, value, littleEndian = false)` — fills empty cells based on a bitboard.
   * 7. `fill(row, col, value)` — fills a specific cell.
   * 8. `fill(row, col, value, directions)` — flood fill in directions.
   * 9. `fill(row, col, value, border)` — flood fill with/without border.
   * 10. `fill(row, col, value, directions, border)` — full flood fill.
   * @param {...*} args - Arguments as described above.
   * @returns {Quadrille} This quadrille (for chaining).
   */
  fill(...args) {
    if (args.length === 0) {
      this.visit(({ row, col }) => {
        this._memory2D[row][col] = this._clearCell(this._memory2D[row][col]);
        this._memory2D[row][col] = this._p.color((row + col) % 2 === 0
          ? this.constructor.lightSquare
          : this.constructor.darkSquare);
      });
    }
    if (args.length === 1 && this.constructor.isFilled(args[0])) {
      this.visit(({ row, col }) => {
        this._memory2D[row][col] = this._parseFn(args[0], row, col);
      }, ({ value }) => this.constructor.isEmpty(value));
    }
    if (args.length === 2 && typeof args[0] === 'function' && this.constructor.isFilled(args[1])) {
      const [predicate, value] = args;
      this.visit(({ row, col }) => {
        this._memory2D[row][col] = this._clearCell(this._memory2D[row][col]);
        this._memory2D[row][col] = this._parseFn(value, row, col);
      }, predicate);
    }
    if (args.length === 2 &&
      (this.constructor.isColor(args[0]) || typeof args[0] === 'string') &&
      (this.constructor.isColor(args[1]) || typeof args[1] === 'string')) {
      this.visit(({ row, col }) => {
        this._memory2D[row][col] = this._clearCell(this._memory2D[row][col]);
        this._memory2D[row][col] = (row + col) % 2 === 0
          ? this._p.color(args[0])
          : this._p.color(args[1]);
      });
    }
    if (args.length === 2 && typeof args[0] === 'number') {
      if (this.isValid(args[0], 0)) {
        const row = args[0];
        const value = args[1];
        this._memory2D[row] = this._memory2D[row].map((cell, col) => {
          cell = this._clearCell(cell);
          return value === undefined ? null : this._parseFn(value, row, col);
        });
      }
    }
    if ((args.length === 2 || args.length === 3) &&
      typeof args[0] === 'bigint' && this.constructor.isFilled(args[1])) {
      const bitboard = args[0];
      const value = args[1];
      const littleEndian = args[2] === true;
      if (bitboard < 0n) {
        console.warn('Bitboard cannot be negative');
      } else {
        this.visit(({ row, col }) => {
          const bit = this.bitIndex(row, col, littleEndian);
          if (bitboard & (1n << BigInt(bit))) {
            this._memory2D[row][col] = this._parseFn(value, row, col);
          }
        }, ({ value }) => this.constructor.isEmpty(value));
      }
      const totalBits = bitboard.toString(2).length;
      const maxBits = this.width * this.height;
      if (totalBits > maxBits) {
        console.warn(
          `Bitboard has ${totalBits} bits but quadrille holds only ${maxBits}. ` +
          `Increase quadrille width and/or height so that width * height ≥ ${totalBits}.`
        );
      }
    }
    if (args.length === 3 && typeof args[0] === 'number' && typeof args[1] === 'number') {
      if (this.isValid(args[0], args[1])) {
        const [row, col, value] = args;
        this._memory2D[row][col] = this._clearCell(this._memory2D[row][col]);
        this._memory2D[row][col] = value === undefined ? null : this._parseFn(value, row, col);
      }
    }
    if (args.length === 4 && typeof args[0] === 'number' && typeof args[1] === 'number' && typeof args[3] === 'number') {
      if (this.isValid(args[0], args[1])) {
        const [row, col, value, directions] = args;
        this._flood(row, col, this._memory2D[row][col],
          value === undefined ? null : this._parseFn(value, row, col), directions);
      }
    }
    if (args.length === 4 && typeof args[0] === 'number' && typeof args[1] === 'number' && typeof args[3] === 'boolean') {
      if (this.isValid(args[0], args[1])) {
        const [row, col, value, border] = args;
        this._flood(row, col, this._memory2D[row][col],
          value === undefined ? null : this._parseFn(value, row, col), 4, border);
      }
    }
    if (args.length === 5 && typeof args[0] === 'number' && typeof args[1] === 'number' &&
      typeof args[3] === 'number' && typeof args[4] === 'boolean') {
      if (this.isValid(args[0], args[1])) {
        const [row, col, value, directions, border] = args;
        this._flood(row, col, this._memory2D[row][col],
          value === undefined ? null : this._parseFn(value, row, col), directions, border);
      }
    }
    return this;
  }

  /**
   * Internal helper to evaluate a value for a given cell.
   * If the value is a function tagged with `._isFactory`, it is called
   * with `{ row, col }`. Otherwise, the value is returned as-is.
   * @param {*} value - A literal, display function, or factory function.
   * @param {number} row - Row index of the cell.
   * @param {number} col - Column index of the cell.
   * @returns {*} Evaluated cell content.
   */
  _parseFn(value, row, col) {
    return typeof value === 'function' && value._isFactory ? value({ row, col }) : value;
  }

  /**
   * Clears a cell value before writing a new one into the grid.
   * If the value is a function or object and contains an internal
   * framebuffer (`fbo`), the framebuffer is removed and the reference
   * is cleared to avoid memory leaks. This is used to manage retained
   * drawing resources for function-based or object-based displays.
   * @param {*} value - The current cell value to be cleared.
   * @returns {null} Always returns null as the cleared cell value.
   */
  _clearCell(value) {
    if (this.constructor.isFunction(value) || this.constructor.isObject(value)) {
      value.fbo?.remove();
      value.fbo = undefined;
    }
    return null;
  }

  /**
   * Recursive flood fill using value1 → value2 replacement.
   * Supports 4- or 8-directional movement and optional border fill.
   * @private
   */
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

  /**
   * Randomly clears or fills cells in the quadrille.
   * - If `value` is `null`, clears `times` filled cells.
   * - If `value` is not `null`, fills `times` empty cells with `value`.
   * Note: For deterministic behavior, call `randomSeed(seed)` explicitly before this method.
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
   * Note: For deterministic behavior, call `randomSeed(seed)` explicitly before this method.
   * @returns {Quadrille} The modified quadrille (for chaining).
   */
  randomize() {
    const clone = this.clone();
    this.clear();
    clone.visit(({ value }) => {
      let row, col;
      do {
        const index = this._p.int(this._p.random(this.size));
        ({ row, col } = this._fromIndex(index));
      } while (this.isFilled(row, col));
      this.fill(row, col, value);
    }, ({ value }) => this.constructor.isFilled(value));
    return this;
  }

  /**
   * Inserts an empty row at the given index.
   * @param {number} row - Index to insert the new row.
   * @returns {Quadrille} The modified quadrille (for chaining).
   */
  insert(row) {
    this._memory2D.splice(row, 0, Array(this.width).fill(null));
    return this;
  }

  /**
   * Deletes the row at the given index.
   * @param {number} row - Index of the row to delete.
   * @returns {Quadrille} The modified quadrille (for chaining).
   */
  delete(row) {
    if (this.height > 1 && this.isValid(row, 0)) {
      this._memory2D.splice(row, 1);
    }
    return this;
  }

  /**
   * Swaps two rows or two cells in the quadrille.
   * - `swap(row1, row2)` — swaps two rows.
   * - `swap(row1, col1, row2, col2)` — swaps two individual cells.
   * @param {...number} args - Either 2 or 4 integers.
   * @returns {Quadrille} The modified quadrille (for chaining).
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
   * Shifts all filled cells by (dRow, dCol) across the grid.
   *  - dRow > 0: down;   dRow < 0: up
   *  - dCol > 0: right;  dCol < 0: left
   * wrap=true (default): toroidal wrap; wrap=false: clip at edges.
   * @param {number} dRow
   * @param {number} dCol
   * @param {boolean} [wrap=true]
   * @returns {Quadrille} this
   */
  shift(dRow, dCol, wrap = true) {
    if (this.order === 0) return this;
    const w = this.width;
    const h = this.height;
    let ky = Number.isFinite(dRow) ? Math.trunc(dRow) : 0;
    let kx = Number.isFinite(dCol) ? Math.trunc(dCol) : 0;
    if (wrap) {
      ky = ((ky % h) + h) % h;
      kx = ((kx % w) + w) % w;
    }
    if (kx === 0 && ky === 0) return this;
    const src = this.toArray();
    const out = new Array(w * h).fill(null);
    if (wrap) {
      for (let i = 0; i < src.length; i++) {
        const v = src[i];
        if (this.constructor.isFilled(v)) {
          const { row, col } = this._fromIndex(i, w);
          const r2 = (row + ky) % h;
          const c2 = (col + kx) % w;
          out[this._toIndex(r2, c2, w)] = v;
        }
      }
    } else {
      for (let i = 0; i < src.length; i++) {
        const v = src[i];
        if (this.constructor.isFilled(v)) {
          const { row, col } = this._fromIndex(i, w);
          const r2 = row + ky;
          const c2 = col + kx;
          if (r2 >= 0 && r2 < h && c2 >= 0 && c2 < w) {
            out[this._toIndex(r2, c2, w)] = v;
          }
        }
      }
    }
    this._init1D(out, w);
    return this;
  }

  /**
   * Inverts filled/empty status in-place.
   * - Filled cells become empty (cleared).
   * - Empty cells get filled with `target`.
   * @param {*} target Value to place into previously-empty cells
   * @returns {Quadrille} this
   */
  not(target) {
    this.visit(({ row, col, value }) =>
      this.constructor.isFilled(value)
        ? this.clear(row, col)
        : this.fill(row, col, target)
    );
    return this;
  }

  /**
   * Logical AND between this quadrille and another.
   * @param {Quadrille} q Second quadrille
   * @param {number} row Relative row offset from this
   * @param {number} col Relative column offset from this
   * @returns {Quadrille} This quadrille containing only cells filled in both
   */
  and(q, row, col) {
    return this.merge(q, (a, b) => {
      if (this.constructor.isFilled(a) && this.constructor.isFilled(b)) {
        return a;
      }
    }, row, col);
  }

  /**
   * Logical OR between this quadrille and another.
   * @param {Quadrille} q Second quadrille
   * @param {number} row Relative row offset from this
   * @param {number} col Relative column offset from this
   * @returns {Quadrille} This quadrille containing cells filled in either
   */
  or(q, row, col) {
    return this.merge(q, (a, b) => {
      if (this.constructor.isFilled(a)) {
        return a;
      }
      if (this.constructor.isFilled(b)) {
        return b;
      }
    }, row, col);
  }

  /**
   * Logical XOR between this quadrille and another.
   * @param {Quadrille} q Second quadrille
   * @param {number} row Relative row offset from this
   * @param {number} col Relative column offset from this
   * @returns {Quadrille} This quadrille containing cells filled in one, but not both
   */
  xor(q, row, col) {
    return this.merge(q, (a, b) => {
      if (this.constructor.isFilled(a) && this.constructor.isEmpty(b)) {
        return a;
      }
      if (this.constructor.isEmpty(a) && this.constructor.isFilled(b)) {
        return b;
      }
    }, row, col);
  }

  /**
   * Logical difference (this minus q) between two quadrilles.
   * @param {Quadrille} q Second quadrille
   * @param {number} row Relative row offset from this
   * @param {number} col Relative column offset from this
   * @returns {Quadrille} This quadrille with cells filled in this but not in q
   */
  diff(q, row, col) {
    return this.merge(q, (a, b) => {
      if (this.constructor.isFilled(a) && this.constructor.isEmpty(b)) {
        return a;
      }
    }, row, col);
  }

  /**
   * Merges another quadrille into this one by applying a binary operator.
   * Uses an in-place fast path when dimensions match and there is no offset.
   * @param {Quadrille} q
   * @param {(a: *, b: *) => *} operator
   * @param {number} [row]
   * @param {number} [col]
   * @returns {Quadrille} this
   */
  merge(q, operator, row, col) {
    const sameOrigin = this._row !== undefined && q._row !== undefined &&
      this._cellLength !== undefined && this._cellLength === q._cellLength;
    row ??= sameOrigin ? q._row - this._row : 0;
    col ??= sameOrigin ? q._col - this._col : 0;
    const ctor = this.constructor;
    // Hot path: exact same size and no offset → safe in-place update
    if (row === 0 && col === 0 && this.width === q.width && this.height === q.height) {
      const H = this.height, W = this.width;
      const m0 = this._memory2D;
      const mQ = q._memory2D;
      for (let i = 0; i < H; i++) {
        const r0 = m0[i], rQ = mQ[i];
        for (let j = 0; j < W; j++) {
          const r = operator(r0[j], rQ[j]);
          r0[j] = ctor.isFilled(r) ? r : null;
        }
      }
      return this;
    }
    // General path: compute output bounds
    const width = col < 0 ? Math.max(q.width, this.width - col) : Math.max(this.width, q.width + col);
    const height = row < 0 ? Math.max(q.height, this.height - row) : Math.max(this.height, q.height + row);
    const H0 = this.height, W0 = this.width;
    const Hq = q.height, Wq = q.width;
    const rNeg = row < 0, rPos = row > 0;
    const cNeg = col < 0, cPos = col > 0;
    const mem = ctor._allocNullMemory(height, width);
    const m0 = this._memory2D, mQ = q._memory2D;
    for (let i = 0; i < height; i++) {
      const i1 = rNeg ? i + row : i;     // index into this
      const i2 = rPos ? i - row : i;     // index into q
      const outRow = mem[i];
      // cache source row pointers (or null) to skip row checks in inner loop
      const rowThis = (i1 >= 0 && i1 < H0) ? m0[i1] : null;
      const rowQ = (i2 >= 0 && i2 < Hq) ? mQ[i2] : null;
      for (let j = 0; j < width; j++) {
        const j1 = cNeg ? j + col : j;
        const j2 = cPos ? j - col : j;
        // Match read(...) semantics for inputs: OOB → undefined
        const v1 = rowThis && j1 >= 0 && j1 < W0 ? rowThis[j1] : undefined;
        const v2 = rowQ && j2 >= 0 && j2 < Wq ? rowQ[j2] : undefined;
        const r = operator(v1, v2);
        outRow[j] = ctor.isFilled(r) ? r : null;
      }
    }
    this._memory2D = mem;
    return this;
  }

  // TRANSFORMS

  /**
   * Horizontal reflection.
   * Reverses the order of the rows.
   * @returns {Quadrille} The modified quadrille (for chaining).
   */
  reflect() {
    this._memory2D.reverse();
    return this;
  }

  /**
   * Transposes the quadrille matrix (rows become columns).
   * @returns {Quadrille} The modified quadrille (for chaining).
   */
  transpose() {
    // credit goes to Fawad Ghafoorwho wrote about it here:
    // https://stackoverflow.com/questions/17428587/transposing-a-2d-array-in-javascript
    this._memory2D = this._memory2D[0].map((_, i) => this._memory2D.map(row => row[i]));
    return this;
  }

  /**
   * Rotates the quadrille 90 degrees clockwise.
   * @returns {Quadrille} The modified quadrille (for chaining).
   */
  rotate() {
    // credit goes to Nitin Jadhav: https://github.com/nitinja who wrote about it here:
    // https://stackoverflow.com/questions/15170942/how-to-rotate-a-matrix-in-an-array-in-javascript/58668351#58668351
    this._memory2D = this._memory2D[0].map((_, i) => this._memory2D.map(row => row[i]).reverse());
    return this;
  }

  // REFORMATTER

  /**
   * Returns a bitboard representation of the quadrille.
   * Only filled cells are considered.
   * Bits are ordered in **row-major** layout.
   * By default, the representation is **big-endian**: the top-left cell is the most significant bit.
   * To use **little-endian** encoding (bottom-right as most significant bit), pass `true`.
   * @param {boolean} [littleEndian=false] - If true, encodes using little-endian order.
   * @returns {bigint} Binary representation of the filled pattern.
   */
  toBigInt(littleEndian = false) {
    let result = 0n;
    const length = this.width * this.height;
    let index = 0;
    this.visit(({ row, col }) => {
      const bit = littleEndian ? index : length - 1 - index;
      this.constructor.isFilled(this.read(row, col)) && (result |= 1n << BigInt(bit));
      index++;
    })
    return result;
  }

  /**
   * Returns a flattened array representation of the quadrille.
   * @returns {Array<*>}
   */
  toArray() {
    return this._memory2D.flat();
  }

  /**
   * Saves a rendered image of the quadrille using the specified drawing parameters.
   * @param {string} filename - The output filename (PNG or JPG).
   * @param {Object} [params={}] - Rendering parameters.
   * @param {Array} [params.values] - Optional value set to control rendering.
   * @param {p5.Font} [params.textFont] - Font used for text rendering.
   * @param {string} [params.origin='corner'] - Origin mode: `'corner'` or `'center'`.
   * @param {Object} [params.options={}] - Additional display options.
   * @param {Function} [params.tileDisplay] - Function to draw tile-based values.
   * @param {Function} [params.functionDisplay] - Function to draw function-based values.
   * @param {Function} [params.imageDisplay] - Function to draw image-based values.
   * @param {Function} [params.colorDisplay] - Function to draw color values.
   * @param {Function} [params.stringDisplay] - Function to draw string values.
   * @param {Function} [params.numberDisplay] - Function to draw number values.
   * @param {Function} [params.bigintDisplay] - Function to draw bigint values.
   * @param {Function} [params.booleanDisplay] - Function to draw boolean values.
   * @param {Function} [params.symbolDisplay] - Function to draw symbol values.
   * @param {Function} [params.arrayDisplay] - Function to draw array values.
   * @param {Function} [params.objectDisplay] - Function to draw object values.
   * @param {number} [params.cellLength=this._cellLength] - Cell size in pixels.
   * @param {number} [params.outlineWeight] - Outline stroke weight.
   * @param {string|*} [params.outline] - Outline color.
   * @param {string|*} [params.textColor] - Text fill color.
   * @param {number} [params.textZoom] - Scale factor for text rendering.
   */
  toImage(filename, {
    filter,
    textFont,
    origin = 'corner',
    options = {},
    tileDisplay,
    functionDisplay,
    imageDisplay,
    colorDisplay,
    stringDisplay,
    numberDisplay,
    bigintDisplay,
    booleanDisplay,
    symbolDisplay,
    arrayDisplay,
    objectDisplay,
    cellLength = this._cellLength || this.constructor.cellLength,
    outlineWeight,
    outline,
    textColor,
    textZoom
  } = {}) {
    const graphics = this._p.createGraphics(this.width * cellLength, this.height * cellLength, this._mode);
    this._p.drawQuadrille(this, {
      graphics, filter, tileDisplay, functionDisplay, imageDisplay, colorDisplay,
      stringDisplay, numberDisplay, bigintDisplay, booleanDisplay, symbolDisplay,
      arrayDisplay, objectDisplay, cellLength, outlineWeight, outline,
      textColor, textZoom, textFont, origin, options
    });
    this._p.save(graphics, filename);
  }

  /**
   * Returns a FEN (Forsyth–Edwards Notation) string of the quadrille.
   * Only works on 8×8 boards.
   * Symbols not found in the chess map are replaced with '?'.
   * @returns {string|undefined}
   */
  toFEN() {
    if (this.width !== 8 || this.height !== 8) {
      console.warn('toFEN() only works on 8x8 chess boards');
      return;
    }
    const reverse = this.constructor.chessKeys;
    let fen = '';
    for (let i = 0; i < 8; i++) {
      let empty = 0;
      for (let j = 0; j < 8; j++) {
        const value = this._memory2D[i][j];
        if (this.constructor.isEmpty(value)) {
          empty++;
        } else {
          empty > 0 && (fen += empty, empty = 0);
          const key = reverse.get(value);
          fen += key ?? (console.warn(`Unrecognized piece ${value} at ${i}, ${j}`), '?');
        }
      }
      empty > 0 && (fen += empty);
      i < 7 && (fen += '/');
    }
    return fen;
  }

  // INSTANCE CREATORS

  /**
   * Returns a shallow copy of this quadrille.
   * @returns {Quadrille} A new Quadrille with the same content.
   */
  clone() {
    const H = this.height;
    const src = this._memory2D;
    const mem = new Array(H);
    for (let r = 0; r < H; r++) mem[r] = src[r].slice();
    const clone = Object.create(Quadrille.prototype);
    clone._p = this._p;
    clone._memory2D = mem;
    clone._cellLength = this._cellLength;
    clone._x = this._x;
    clone._y = this._y;
    clone._col = this._col;
    clone._row = this._row;
    clone._origin = this._origin;
    return clone;
  }

  /**
   * Crops a rectangular region. Positive/negative width/height control direction.
   * Optionally wraps indices.
   * @param {number} row
   * @param {number} col
   * @param {number} width
   * @param {number} height
   * @param {boolean} [wrap=false]
   * @returns {Quadrille|undefined}
   */
  crop(row, col, width, height, wrap = false) {
    if (!Number.isFinite(width) || !Number.isFinite(height) || width === 0 || height === 0) {
      console.warn('Quadrille.crop skipped: width/height must be finite and non-zero');
      return;
    }
    const w = Math.abs(width);
    const h = Math.abs(height);
    const startRow = height > 0 ? row : row - (h - 1);
    const startCol = width > 0 ? col : col - (w - 1);
    const H = this.height, W = this.width;
    const ctor = this.constructor;
    const mem = ctor._allocNullMemory(h, w);
    if (wrap) {
      const mod = (n, m) => ((n % m) + m) % m;
      for (let i = 0; i < h; i++) {
        const rr = mod(startRow + i, H);
        for (let j = 0; j < w; j++) {
          const cc = mod(startCol + j, W);
          const v = this.read(rr, cc);
          mem[i][j] = ctor.isFilled(v) ? v : null;
        }
      }
    } else {
      for (let i = 0; i < h; i++) {
        for (let j = 0; j < w; j++) {
          const v = this.read(startRow + i, startCol + j);
          mem[i][j] = ctor.isFilled(v) ? v : null;
        }
      }
    }
    return ctor._allocQ(this, mem);
  }

  /**
   * Returns a new quadrille trimmed to its minimal span of filled cells.
   * Returns undefined if the quadrille has no filled cells.
   * @returns {Quadrille|undefined}
   */
  trim() {
    const s = this.span;
    return s ? this.crop(s.row, s.col, s.width, s.height) : undefined;
  }

  /**
   * Creates a new square quadrille centered at (row, col) with side = 2*dimension+1.
   * @param {number} row
   * @param {number} col
   * @param {number} [dimension=1] Radius of the square (>= 0).
   * @param {boolean} [wrap=false] When true, indices wrap around grid bounds.
   * @returns {Quadrille|undefined}
   */
  ring(row, col, ...args) {
    const [a, b] = args;
    const dimension = (typeof b === 'number') ? b : (typeof a === 'number' ? a : 1);
    const wrap = (typeof b === 'boolean') ? b : (typeof a === 'boolean' ? a : false);
    if (!Number.isFinite(dimension) || dimension < 0) {
      console.warn('Quadrille.ring skipped: dimension must be finite and >= 0');
      return;
    }
    const size = 2 * dimension + 1;
    return this.crop(row - dimension, col - dimension, size, size, wrap);
  }

  /**
   * Extracts a single row as a new 1×W Quadrille.
   * @param {number} row
   * @returns {Quadrille|undefined}
   */
  row(row) {
    if (!this.isValid(row, 0)) return;
    const srcRow = this._memory2D[row];
    return this.constructor._allocQ(this, [srcRow.slice()]);
  }

  // VISUAL ALGORITHMS

  /**
   * Applies convolution using a quadrille kernel mask.
   * 1. `filter(mask)` — convolves entire quadrille.
   * 2. `filter(mask, row, col)` — convolves only at (row, col).
   * Kernel weights can be numeric or color-based (luma is used to convert colors).
   * @param {Quadrille} mask - An odd-sized square kernel quadrille.
   * @param {number} [row] - Row index to apply convolution.
   * @param {number} [col] - Column index to apply convolution.
   * @returns {Quadrille} The modified quadrille (for chaining).
   */
  filter(mask, row, col) {
    if (mask.size % 2 === 1 && mask.width === mask.height && this.size >= mask.size) {
      const half_size = (mask.width - 1) / 2;
      if (row === undefined || col === undefined) {
        const source = this.clone();
        this.visit(
          ({ row, col }) => this._conv(mask, row, col, half_size, source),
          ({ row, col }) =>
            row >= half_size && row < this.height - half_size &&
            col >= half_size && col < this.width - half_size
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
   * Colorizes a triangle defined by three corners using barycentric interpolation.
   * @param {number} row0
   * @param {number} col0
   * @param {number} row1
   * @param {number} col1
   * @param {number} row2
   * @param {number} col2
   * @param {*} color0 - Color for vertex 0 (p5.Color, array, or string).
   * @param {*} [color1=color0] - Color for vertex 1.
   * @param {*} [color2=color0] - Color for vertex 2.
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
   * Colorizes the quadrille using four corner colors, interpolated over two triangles.
   * @param {*} color0 - Upper-left corner color.
   * @param {*} [color1=color0] - Bottom-left corner color.
   * @param {*} [color2=color0] - Upper-right corner color.
   * @param {*} [color3=color0] - Bottom-right corner color.
   */
  colorize(color0, color1 = color0, color2 = color0, color3 = color0) {
    this.colorizeTriangle(0, 0, this.height - 1, 0, 0, this.width - 1, color0, color1, color2);
    this.colorizeTriangle(this.height - 1, 0, 0, this.width - 1, this.height - 1, this.width - 1, color1, color2, color3);
  }

  /**
   * Rasterizes a triangle using attribute interpolation and a fragment shader function.
   * @param {number} row0
   * @param {number} col0
   * @param {number} row1
   * @param {number} col1
   * @param {number} row2
   * @param {number} col2
   * @param {Function} shader - Function to apply per-cell, receives interpolated attributes.
   * @param {Array<number>} array0 - Attribute data for vertex 0.
   * @param {Array<number>} [array1=array0] - Attribute data for vertex 1.
   * @param {Array<number>} [array2=array0] - Attribute data for vertex 2.
   * @returns {Quadrille} The modified quadrille (for chaining).
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
   * Rasterizes the quadrille using four corner attribute arrays and a shader function.
   * @param {Function} shader - Function to apply per-cell.
   * @param {Array<number>} array0 - Upper-left corner attributes.
   * @param {Array<number>} [array1=array0] - Bottom-left corner attributes.
   * @param {Array<number>} [array2=array0] - Upper-right corner attributes.
   * @param {Array<number>} [array3=array0] - Bottom-right corner attributes.
   */
  rasterize(shader, array0, array1 = array0, array2 = array0, array3 = array0) {
    this.rasterizeTriangle(0, 0, this.height - 1, 0, 0, this.width - 1, shader, array0, array1, array2);
    this.rasterizeTriangle(this.height - 1, 0, 0, this.width - 1, this.height - 1, this.width - 1, shader, array1, array2, array3);
  }

  _barycentric_coords(row, col, row0, col0, row1, col1, row2, col2) {
    const edges = this._edge_functions(row, col, row0, col0, row1, col1, row2, col2);
    const area = this._parallelogram_area(row0, col0, row1, col1, row2, col2);
    return { w0: edges.e12 / area, w1: edges.e20 / area, w2: edges.e01 / area };
  }

  _parallelogram_area(row0, col0, row1, col1, row2, col2) {
    return (col1 - col0) * (row2 - row0) - (col2 - col0) * (row1 - row0);
  }

  _edge_functions(row, col, row0, col0, row1, col1, row2, col2) {
    const e01 = (row0 - row1) * col + (col1 - col0) * row + (col0 * row1 - row0 * col1);
    const e12 = (row1 - row2) * col + (col2 - col1) * row + (col1 * row2 - row1 * col2);
    const e20 = (row2 - row0) * col + (col0 - col2) * row + (col2 * row0 - row2 * col0);
    return { e01, e12, e20 };
  }

  /**
   * Sorts cells by color values.
   * Sorting `mode` options are:
   * - `'LUMA'` — weighted grayscale value (default).
   * - `'AVG'` — average of red, green, and blue channels.
   * - `'DISTANCE'` — Euclidean distance to a target color in RGBA space.
   * @param {Object} [params={}] - Sorting parameters.
   * @param {'LUMA'|'AVG'|'DISTANCE'} [params.mode='LUMA'] - Sorting strategy.
   * @param {*} [params.target] - Target color (for `'DISTANCE'` mode).
   * @param {boolean} [params.ascending=true] - Sort order.
   * @param {string|*} [params.textColor] - Text color.
   * @param {number} [params.textZoom] - Text scaling factor.
   * @param {string|*} [params.background] - Background color.
   * @param {number} [params.cellLength] - Cell size in pixels.
   * @param {number} [params.outlineWeight] - Stroke weight for cell outlines.
   * @param {string|*} [params.outline] - Outline color.
   * @param {p5.Font} [params.textFont] - Optional text font.
   * @param {string} [params.origin='corner'] - Origin mode.
   * @param {Object} [params.options={}] - Optional render config.
   * @param {Function} [params.imageDisplay]
   * @param {Function} [params.colorDisplay]
   * @param {Function} [params.stringDisplay]
   * @param {Function} [params.numberDisplay]
   * @param {Function} [params.bigintDisplay]
   * @param {Function} [params.booleanDisplay]
   * @param {Function} [params.symbolDisplay]
   * @param {Function} [params.arrayDisplay]
   * @param {Function} [params.objectDisplay]
   * @param {Function} [params.functionDisplay]
   * @param {Function} [params.tileDisplay]
   * @returns {Quadrille} The sorted quadrille (for chaining).
   */
  sort({
    mode = 'LUMA',
    target = this.constructor.outline,
    ascending = true,
    textColor,
    textZoom,
    background,
    cellLength = this._p.int(this._p.max(this._p.width / this.width, this._p.height / this.height) / 10),
    outlineWeight,
    outline,
    textFont,
    origin,
    options,
    imageDisplay,
    colorDisplay,
    stringDisplay,
    numberDisplay,
    bigintDisplay,
    booleanDisplay,
    symbolDisplay,
    arrayDisplay,
    objectDisplay,
    functionDisplay,
    tileDisplay
  } = {}) {
    let memory1D = this.toArray();
    const params = {
      background, cellLength, textColor, textZoom, imageDisplay, colorDisplay, outline, textFont, origin, options,
      outlineWeight, stringDisplay, numberDisplay, bigintDisplay, booleanDisplay,
      symbolDisplay, arrayDisplay, objectDisplay, functionDisplay, tileDisplay,
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
   * Renders a cell and returns its average RGBA values as a literal object.
   * @param {Object} [params={}] - Sampling parameters.
   * @param {*} params.value - Cell content to sample.
   * @param {p5.Font} [params.textFont]
   * @param {string} [params.origin='corner']
   * @param {Object} [params.options={}]
   * @param {'p2d'|'webgl'} [params.renderer='p2d']
   * @param {Function} [params.imageDisplay]
   * @param {Function} [params.colorDisplay]
   * @param {Function} [params.stringDisplay]
   * @param {Function} [params.numberDisplay]
   * @param {Function} [params.bigintDisplay]
   * @param {Function} [params.booleanDisplay]
   * @param {Function} [params.symbolDisplay]
   * @param {Function} [params.arrayDisplay]
   * @param {Function} [params.objectDisplay]
   * @param {Function} [params.functionDisplay]
   * @param {Function} [params.tileDisplay]
   * @param {string|*} [params.background]
   * @param {number} [params.cellLength]
   * @param {number} [params.outlineWeight]
   * @param {string|*} [params.outline]
   * @param {string|*} [params.textColor]
   * @param {number} [params.textZoom]
   * @returns {{ r: number, g: number, b: number, a: number, total: number }} Average color channels and sample size.
   */
  static sample({
    value,
    textFont,
    origin = 'corner',
    options = {},
    renderer = 'p2d',
    imageDisplay = this.imageDisplay,
    colorDisplay = this.colorDisplay,
    stringDisplay = this.stringDisplay,
    numberDisplay = this.numberDisplay,
    bigintDisplay = this.bigintDisplay,
    booleanDisplay = this.booleanDisplay,
    symbolDisplay,
    arrayDisplay,
    objectDisplay,
    functionDisplay = this.functionDisplay,
    tileDisplay = this.tileDisplay,
    background = this.background,
    cellLength = this.cellLength,
    outlineWeight = this.outlineWeight,
    outline = this.outline,
    textColor = this.textColor,
    textZoom = this.textZoom
  } = {}) {
    const graphics = createGraphics(cellLength, cellLength, renderer);
    graphics.background(background);
    const params = {
      graphics, value, textColor, textZoom, outline, outlineWeight, cellLength, textFont, origin, options,
      imageDisplay, colorDisplay, stringDisplay, numberDisplay, bigintDisplay, booleanDisplay,
      symbolDisplay, arrayDisplay, objectDisplay, functionDisplay, tileDisplay
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

  // HELPER RENDER FUNCTIONS

  static _display(params) {
    const { value, objectDisplay } = params;
    if (this.isObject(value) && objectDisplay === undefined && 'display' in value) {
      params._this = value;
      params.value = value.display;
    }
    const handlers = [
      { check: this.isFunction.bind(this), display: params.functionDisplay },
      { check: this.isImage.bind(this), display: params.imageDisplay },
      { check: this.isColor.bind(this), display: params.colorDisplay },
      { check: this.isNumber.bind(this), display: params.numberDisplay },
      { check: this.isBigInt.bind(this), display: params.bigintDisplay },
      { check: this.isString.bind(this), display: params.stringDisplay },
      { check: this.isBoolean.bind(this), display: params.booleanDisplay },
      { check: this.isSymbol.bind(this), display: params.symbolDisplay },
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
   * Renders a number value using its color equivalent.
   * @param {Object} params
   * @param {p5.Graphics} params.graphics - Rendering context.
   * @param {number} params.value - Numeric value to draw.
   * @param {number} [params.cellLength=this.cellLength] - Cell size in pixels.
   */
  static numberDisplay({
    graphics,
    value,
    cellLength = this.cellLength
  } = {}) {
    this.colorDisplay({ graphics, value: graphics.color(value), cellLength });
  }

  /**
   * Renders a BigInt value using numberDisplay after converting to Number.
   * @param {Object} params
   * @param {p5.Graphics} params.graphics - Rendering context.
   * @param {bigint} params.value - BigInt value to render.
   * @param {number} [params.cellLength=this.cellLength] - Cell size in pixels.
   * @param {*} [params.textColor=this.textColor] - Fill color for text.
   * @param {number} [params.textZoom=this.textZoom] - Text size scaling factor.
   */
  static bigintDisplay({
    graphics,
    value,
    cellLength = this.cellLength
  } = {}) {
    this.numberDisplay({
      graphics,
      value: Number(value),
      cellLength
    });
  }

  /**
   * Renders a color value by filling the cell.
   * @param {Object} params
   * @param {p5.Graphics} params.graphics - Rendering context.
   * @param {*} params.value - Fill color.
   * @param {number} [params.cellLength=this.cellLength] - Cell size in pixels.
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
   * Renders a function-based cell using an internal framebuffer in WEBGL mode.
   * Also serves as the fallback renderer for any object with a `display` function.
   * In `WEBGL` mode, rendering is performed into a framebuffer object (FBO),
   * and the result is drawn using `imageDisplay`. The drawing function is
   * invoked with `options` as its only parameter and `this` bound to the framebuffer's
   * `p5.Graphics` context (or the object if provided).
   * In `P2D` mode, the function is called directly with `options` and drawn to the main context.
   * @param {Object} params
   * @param {p5.Graphics} params.graphics - Rendering context.
   * @param {Object} params.options - Display options (e.g. origin).
   * @param {Function} params.value - Function that draws into the framebuffer.
   * @param {number} [params.cellLength=this.cellLength] - Cell size in pixels.
   */
  static functionDisplay({
    mode,
    graphics,
    options,
    value,
    cellLength = this.cellLength,
    _this
  } = {}) {
    if (mode === 'webgl') {
      const fbo = (_this ?? value).fbo ??= graphics.createFramebuffer({ width: cellLength, height: cellLength });
      const pg = fbo.graphics ?? (fbo.graphics = graphics);
      fbo.begin();
      pg.clear();
      pg._rendererState = pg.push();
      (options?.origin === 'corner' && pg.translate(-cellLength / 2, -cellLength / 2));
      value.call(_this ?? pg, options);
      pg.pop(pg._rendererState);
      fbo.end();
      this.imageDisplay({ graphics, cellLength, value: fbo });
    } else {
      graphics.push();
      (options?.origin === 'center' && graphics.translate(cellLength / 2, cellLength / 2));
      value.call(_this ?? graphics, options);
      graphics.pop();
    }
  }

  /**
   * Renders an image or framebuffer value.
   * @param {Object} params
   * @param {p5.Graphics} params.graphics - Rendering context.
   * @param {*} params.value - Image, p5.Graphics, or Framebuffer.
   * @param {number} [params.cellLength=this.cellLength] - Cell size in pixels.
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
   * Renders a boolean value centered in the cell using `stringDisplay`.
   * Displays ✅ for `true` and ❎ for `false`.
   * @param {Object} params
   * @param {p5.Graphics} params.graphics - Rendering context.
   * @param {boolean} params.value - Boolean value to render.
   * @param {p5.Font} [params.textFont] - Optional font.
   * @param {number} [params.cellLength=this.cellLength] - Cell size in pixels.
   * @param {*} [params.textColor=this.textColor] - Fill color for text.
   * @param {number} [params.textZoom=this.textZoom] - Text size scaling factor.
   */
  static booleanDisplay({
    graphics,
    value,
    textFont,
    cellLength = this.cellLength,
    textColor = this.textColor,
    textZoom = this.textZoom
  } = {}) {
    this.stringDisplay({
      graphics,
      value: value ? '✅' : '❎',
      textFont,
      cellLength,
      textColor,
      textZoom
    });
  }

  /**
   * Renders a string value centered in the cell.
   * @param {Object} params
   * @param {p5.Graphics} params.graphics - Rendering context.
   * @param {string} params.value - Text to render.
   * @param {p5.Font} [params.textFont] - Optional font.
   * @param {number} [params.cellLength=this.cellLength] - Cell size in pixels.
   * @param {*} [params.textColor=this.textColor] - Fill color for text.
   * @param {number} [params.textZoom=this.textZoom] - Text size scaling factor.
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
   * Draws the outline (tile) for a cell.
   * @param {Object} params
   * @param {p5.Graphics} params.graphics - Rendering context.
   * @param {number} [params.cellLength=this.cellLength] - Cell size in pixels.
   * @param {*} [params.outline=this.outline] - Outline color.
   * @param {number} [params.outlineWeight=this.outlineWeight] - Stroke weight.
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
