import p5 from 'p5'
import Quadrille from 'p5.quadrille'

let q

const sketch = (p) => {
  p.setup = () => {
    p.createCanvas(400, 400)
    q = p.createQuadrille(4, 4)
    q.fill(1, 1, p.color('red'))
  }

  p.draw = () => {
    p.background('blue')
    p.drawQuadrille(q, {outline: 'grey'})
  }
}

new p5(sketch)
