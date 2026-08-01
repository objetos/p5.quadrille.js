/**
 * @file Adds `createQuadrille` and `drawQuadrille` functions to the p5 prototype.
 * @version 3.5.0-rc.5
 * @author JP Charalambos
 * @license GPL-3.0-only
 *
 * @description
 * Prototype extensions for p5.js that support creating and rendering Quadrille instances.
 * drawQuadrille also renders raw JS arrays through a live zero-copy view; its docs
 * carry the numbered contract and limitations of the view vs a full Quadrille.
 * Part of the p5.quadrille.js library.
 * See https://objetos.github.io/docs/api/ for full usage and examples.
 */

'use strict';

import p5 from 'p5';
import Quadrille from './quadrille.js';

p5.registerAddon((p5, fn) => {
  /**
   * Creates a new Quadrille instance.
   * Supports all constructor forms documented in the API.
   * @function
   * @memberof p5
   * @name createQuadrille
   * @instance
   * @param {...*} args - Arguments forwarded to the Quadrille constructor.
   * @returns {Quadrille} The new Quadrille instance.
   */
  fn.createQuadrille = function (...args) {
    return new Quadrille(this, ...args);
  }

  /**
   * Draws the given Quadrille to the canvas or a p5.Graphics context.
   * Supports 2D and WEBGL modes, honoring origin conventions.
   *
   * Also accepts a raw 1D/2D JS array, wrapped on the fly as a live zero-copy
   * view. The view aliases the array. Exact contract and limitations vs a
   * full Quadrille (single source of truth — referenced by Quadrille._view):
   * 1. Empty means null (or undefined) — never false, 0, or '': a bool[][]
   *    renders ✅/❎ and zeros render dark; filter at draw or normalize.
   * 2. Display is the only verb arrays get — no algebra, queries, or
   *    transforms on raw arrays; adopt the returned view (aliases) or
   *    createQuadrille (copies, normalizes, owns) for the rest of the API.
   * 3. Aliasing is cell-deep, not shape-deep: fill/clear/replace/flood on
   *    the view write through to the array, while rotate/transpose/shift/
   *    sort and resizing rebuild memory and silently detach the view.
   * 4. Nothing is normalized: width is row 0's length — shorter rows render
   *    their missing tail empty, longer rows truncate, holes render empty.
   * 5. One small view object is allocated per call (cell data is never
   *    copied); hold the returned view and draw it for zero allocation.
   * 6. mouseRow/mouseCol are live on the instance this call just drew —
   *    capture the return value rather than wrapping fresh next frame.
   * @function
   * @memberof p5
   * @name drawQuadrille
   * @instance
   * @param {Quadrille|Array} quadrille - The Quadrille to render, or a raw 1D/2D
   * array wrapped on the fly as a live zero-copy view — the view aliases the
   * array (reads and writes go through; nothing is copied or repaired).
   * @param {Object} [params={}] - Optional rendering parameters.
   * @param {p5.Graphics} [params.graphics=this] - Target graphics buffer.
   * @param {number} [params.x] - Absolute X offset (pixels).
   * @param {number} [params.y] - Absolute Y offset (pixels).
   * @param {number} [params.row] - Starting row index.
   * @param {number} [params.col] - Starting column index.
   * @param {Function|Object|Set|Array|null} [params.filter] - Cell filter.
   * @param {p5.Font} [params.textFont] - Optional text font.
   * @param {string} [params.origin='corner'] - `'corner'` or `'center'`.
   * @param {Object} [params.options={}] - Optional config forwarded to shader/functions.
   * @param {Function} [params.functionDisplay]
   * @param {Function} [params.imageDisplay]
   * @param {Function} [params.colorDisplay]
   * @param {Function} [params.stringDisplay]
   * @param {Function} [params.numberDisplay]
   * @param {Function} [params.bigintDisplay]
   * @param {Function} [params.tileDisplay]
   * @param {Function} [params.arrayDisplay]
   * @param {Function} [params.objectDisplay]
   * @param {number} [params.cellLength]
   * @param {number} [params.outlineWeight]
   * @param {*} [params.outline]
   * @param {*} [params.textColor]
   * @param {number} [params.textZoom]
   * @returns {Quadrille} The rendered quadrille — for arrays, the view: a real
   * Quadrille aliasing the array, with mouseRow/mouseCol live after the call.
   */
  fn.drawQuadrille = function (quadrille, params = {}) {
    Array.isArray(quadrille) && (quadrille = Quadrille._view(this, quadrille)); // raw array → live zero-copy view
    let {
      graphics = this,
      x,
      y,
      row,
      col,
      filter,
      textFont,
      origin,
      options = {},
      functionDisplay = quadrille.constructor.functionDisplay,
      imageDisplay = quadrille.constructor.imageDisplay,
      colorDisplay = quadrille.constructor.colorDisplay,
      stringDisplay = quadrille.constructor.stringDisplay,
      numberDisplay = quadrille.constructor.numberDisplay,
      tileDisplay = quadrille.constructor.tileDisplay,
      booleanDisplay = quadrille.constructor.booleanDisplay,
      bigintDisplay = quadrille.constructor.bigintDisplay,
      symbolDisplay,
      arrayDisplay,
      objectDisplay,
      cellLength = quadrille.constructor.cellLength,
      outlineWeight = quadrille.constructor.outlineWeight,
      outline = quadrille.constructor.outline,
      textColor = quadrille.constructor.textColor,
      textZoom = quadrille.constructor.textZoom
    } = params;
    quadrille._mode = (graphics._renderer instanceof p5.RendererGL) ? 'webgl' : 'p2d';
    // Warn: here we align with p5 conventions
    // https://p5js.org/learn/getting-started-in-webgl-coords-and-transform.html
    origin ??= quadrille._mode === 'webgl' ? 'center' : 'corner';
    quadrille._origin = origin;
    options.origin ??= quadrille._mode === 'webgl' ? 'center' : 'corner'; // options.origin ??= origin; // other option
    quadrille._cellLength = cellLength;
    quadrille._x = (x ?? (col != null ? col * cellLength : 0));
    quadrille._y = (y ?? (row != null ? row * cellLength : 0));
    const qx = quadrille._x / cellLength;
    const qy = quadrille._y / cellLength;
    quadrille._col = Number.isInteger(col) ? col : Number.isInteger(qx) ? qx : undefined;
    quadrille._row = Number.isInteger(row) ? row : Number.isInteger(qy) ? qy : undefined;
    graphics.push();
    quadrille._mode === 'webgl' ? (origin === 'corner' && graphics.translate(-graphics.width / 2, -graphics.height / 2)) :
      (origin === 'center' && graphics.translate(graphics.width / 2, graphics.height / 2));
    graphics.translate(quadrille._x, quadrille._y);
    quadrille.visit(({ row, col, value }) => {
      graphics.push();
      graphics.translate(col * cellLength, row * cellLength);
      options.row = row;
      options.col = col;
      const params = {
        value, quadrille, graphics, options, origin, row, col,
        width: quadrille.width, height: quadrille.height, mode: quadrille._mode,
        outline, outlineWeight, cellLength, textColor, textZoom, textFont,
        functionDisplay, imageDisplay, colorDisplay, stringDisplay, booleanDisplay,
        numberDisplay, bigintDisplay, arrayDisplay, objectDisplay, tileDisplay, symbolDisplay
      };
      quadrille.constructor._display(params);
      graphics.pop();
    }, filter);
    graphics.pop();
    return quadrille;
  }
});

// Export default for ESM and IIFE
export default Quadrille;
// export { Quadrille } // requires a src/iife-entry.js
