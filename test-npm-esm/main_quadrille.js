import p5 from 'p5'
import Quadrille from '../dist/p5.quadrille.esm.js'

Quadrille.cellLength = 50 // optional: set cell size globally

let q

const sketch = (p) => {
  p.setup = () => {
    p.createCanvas(400, 400)
    q = p.createQuadrille(4, 4)
    q.fill(0, 0, 'white')
    q.fill(1, 1, p.color(255, 0, 0))
  }

  p.draw = () => {
    p.background('blue')
    p.drawQuadrille(q)
  }
}

new p5(sketch)
