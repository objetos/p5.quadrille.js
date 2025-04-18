// src/addon.js
import p5 from 'p5'
import Quadrille from './p5.quadrille.js'

p5.registerAddon((p5, fn) => {
  // factory: pass the p5 instance into your Quadrille constructor
  fn.createQuadrille = function(...args) {
    return new Quadrille(this, ...args)
  }

  // drawQuadrille: use `this` (the p5 instance) for all graphics calls
  fn.drawQuadrille = function(quadrille, {
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
    imageDisplay    = quadrille.constructor.imageDisplay,
    colorDisplay    = quadrille.constructor.colorDisplay,
    stringDisplay   = quadrille.constructor.stringDisplay,
    numberDisplay   = quadrille.constructor.numberDisplay,
    tileDisplay     = quadrille.constructor.tileDisplay,
    arrayDisplay    = quadrille.constructor.arrayDisplay,
    objectDisplay   = quadrille.constructor.objectDisplay,
    cellLength      = quadrille.constructor.cellLength,
    outlineWeight   = quadrille.constructor.outlineWeight,
    outline         = quadrille.constructor.outline,
    textColor       = quadrille.constructor.textColor,
    textZoom        = quadrille.constructor.textZoom
  } = {}) {
    // determine mode and origin
    quadrille._mode   = (graphics._renderer instanceof p5.RendererGL) ? 'webgl' : 'p2d'
    origin            ??= (quadrille._mode === 'webgl' ? 'center' : 'corner')
    quadrille._origin = origin
    options.origin    ??= origin
    // positioning
    quadrille._cellLength = cellLength
    quadrille._x          = x ?? (col != null ? col * cellLength : 0)
    quadrille._y          = y ?? (row != null ? row * cellLength : 0)
    quadrille._col        = Number.isInteger(col)
      ? col
      : Number.isInteger(quadrille._x / cellLength)
        ? quadrille._x / cellLength
        : undefined
    quadrille._row        = Number.isInteger(row)
      ? row
      : Number.isInteger(quadrille._y / cellLength)
        ? quadrille._y / cellLength
        : undefined
    // draw
    graphics.push()
    if (quadrille._mode === 'webgl') {
      if (origin === 'corner') graphics.translate(-graphics.width / 2, -graphics.height / 2)
    } else {
      if (origin === 'center') graphics.translate(graphics.width / 2, graphics.height / 2)
    }
    graphics.translate(quadrille._x, quadrille._y)
    quadrille.visit(({ row, col, value }) => {
      graphics.push()
      graphics.translate(col * cellLength, row * cellLength)
      options.row = row
      options.col = col
      const params = {
        quadrille,    graphics,    value,
        width:        quadrille.width, height: quadrille.height,
        row,          col,          outline,      outlineWeight,
        cellLength,   textColor,    textZoom,     textFont,
        origin,       options,      functionDisplay,
        imageDisplay, colorDisplay, stringDisplay,
        numberDisplay, arrayDisplay, objectDisplay,
        tileDisplay
      }
      quadrille.constructor._display(params)
      graphics.pop()
    }, filter)
    graphics.pop()
    return quadrille
  }
})

// only export the class
export default Quadrille
// export { Quadrille } // requires a src/iife-entry.js