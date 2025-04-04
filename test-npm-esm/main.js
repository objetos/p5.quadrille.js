import p5 from 'p5'
import Quadrille from 'p5.quadrille'

Quadrille.cellLength = 50
let q

const sketch = (p) => {
  p.setup = () => {
    p.createCanvas(400, 400)
    //q = p.createQuadrille()
    q = p.createQuadrille(8, 8)
    //q.fill(1, 1, p.color('red'))
    //q.fill(2, 2, 'white')
    //q.fill()
    // /*
    for (const { row, col } of q) {
      q.fill(row, col, p.color(p.random(255), p.random(255), p.random(255)));
    }
    // */
    /*
    for (const cell of q) {
      q.fill(cell.row, cell.col, p.color(p.random(255), p.random(255), p.random(255)));
    }
    // */
  }

  p.draw = () => {
    p.background('blue')
    p.drawQuadrille(q, { outline: 'grey' /*, outlineWeight: 0 */ })
  }

  p.mousePressed = () => {
    const row = q.mouseRow;
    const col = q.mouseCol;
    q.fill(row, col, p.color('yellow'));
  }

  p.keyPressed = () => {
    q.randomize();
  }
}

new p5(sketch)
