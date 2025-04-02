import p5 from 'p5'
import Quadrille from 'p5.quadrille'

Quadrille.cellLength = 50
let q

const sketch = (p) => {
  p.setup = () => {
    p.createCanvas(400, 400)
    //q = p.createQuadrille()
    q = p.createQuadrille(8, 8)
    q.fill(1, 1, p.color('red'))
    //q.fill(2, 2, 'white')
    //q.fill()
  }

  p.draw = () => {
    p.background('blue')
    p.drawQuadrille(q, { outline: 'grey' /*, outlineWeight: 0 */ })
  }
}

new p5(sketch)
