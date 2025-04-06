import p5 from 'p5'
import Quadrille from 'p5.quadrille'

const sketch = (p) => {
  Quadrille.cellLength = 50
  let q

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
    //q.fill(row, col, p.color('yellow'));
    q.clear(row, col);
  }

  p.keyPressed = () => {
    p.key === 'r' && q.randomize();
    //p.key === '1' && console.log([...q.cells(value => value != null)]);
    p.key === '1' && console.log([...q.cells(_ => _ != null)]);
    p.key === '2' && console.log([...q.cells({ value: v => v == null })]);
    p.key === '3' && console.log([...q.cells({ row: r => r === 1 })]);
    p.key === '4' && console.log([...q.cells({ col: c => c % 2, value: v => v === '#000' })]);
    p.key === '5' && console.log([...q.cells({ value: v => Quadrille.isEmpty(v) })]);
    p.key === '6' && console.log([...q.cells({ value: Quadrille.isEmpty })]);
    p.key === 'o' && console.log(q.order);
  }
}

new p5(sketch)
