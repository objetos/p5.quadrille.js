import p5 from 'p5';
import Quadrille from './p5.quadrille.js';

p5.registerAddon((p5, fn) => {
  fn.createQuadrille = function(...args) {
    return new Quadrille(this, ...args);
  }

  fn.drawQuadrille = function (quadrille, {
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
    arrayDisplay = quadrille.constructor.arrayDisplay,
    objectDisplay = quadrille.constructor.objectDisplay,
    cellLength = quadrille.constructor.cellLength,
    outlineWeight = quadrille.constructor.outlineWeight,
    outline = quadrille.constructor.outline,
    textColor = quadrille.constructor.textColor,
    textZoom = quadrille.constructor.textZoom
  } = {}) {
    quadrille._mode = (graphics._renderer instanceof p5.RendererGL) ? 'webgl' : 'p2d';
    // Warn: here we align with p5 conventions
    // https://p5js.org/learn/getting-started-in-webgl-coords-and-transform.html
    origin ??= quadrille._mode === 'webgl' ? 'center' : 'corner';
    quadrille._origin = origin;
    options.origin ??= quadrille._mode === 'webgl' ? 'center' : 'corner'; // options.origin ??= origin; // other option
    quadrille._cellLength = cellLength;
    quadrille._x = x ? x : col ? col * cellLength : 0;
    quadrille._y = y ? y : row ? row * cellLength : 0;
    quadrille._col = Number.isInteger(col) ? col : Number.isInteger(quadrille._x / cellLength) ? quadrille._x / cellLength : undefined;
    quadrille._row = Number.isInteger(row) ? row : Number.isInteger(quadrille._y / cellLength) ? quadrille._y / cellLength : undefined;
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
        quadrille, graphics, value, width: quadrille.width, height: quadrille.height,
        row, col, outline, outlineWeight, cellLength, textColor, textZoom, textFont, origin, options, functionDisplay,
        imageDisplay, colorDisplay, stringDisplay, numberDisplay, arrayDisplay, objectDisplay, tileDisplay
      };
      quadrille.constructor._display(params);
      graphics.pop();
    }, filter);

    graphics.pop();
    return quadrille;
  }

  fn.visitQuadrille = function (quadrille, callback, filter) {
    quadrille.visit(({ row, col }) => callback(row, col), filter);
  }
});

// Export default for ESM and IIFE
export default Quadrille;
// export { Quadrille } // requires a src/iife-entry.js