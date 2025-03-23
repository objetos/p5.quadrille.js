import p5 from 'p5'

const sketch = (p) => {
  p.setup = () => {
    p.createCanvas(400, 400)
  }

  p.draw = () => {
    p.background('skyblue')
  }
}

new p5(sketch)
