import p5 from 'p5'
import Quadrille from 'p5.quadrille'

const sketch = (p) => {
  Quadrille.cellLength = 20
  let game, next, pattern;
  let life;

  p.setup = function () {
    game = p.createQuadrille(20, 20);
    life = p.color('lime');
    pattern = p.createQuadrille(3, 16252911n, life);
    game = Quadrille.or(game, pattern, 6, 8);
    p.createCanvas(game.width * Quadrille.cellLength, game.height * Quadrille.cellLength);
    p.frameRate(2);
  }

  p.draw = function () {
    p.background('blue');
    next = game.clone();
    //p.visitQuadrille(game, updateCell);
    for (const { row, col, value } of game) {
      const order = game.ring(row, col).order;
      if (Quadrille.isFilled(value)) {
        (order - 1 < 2 || order - 1 > 3) && next.clear(row, col);
      } else {
        (order === 3) && next.fill(row, col, life);
      }
    }
    game = next;
    p.drawQuadrille(game, { outline: p.color('magenta') });
  }

  function updateCell(row, col) {
    const order = game.ring(row, col).order;
    if (game.isFilled(row, col)) {
      if (order - 1 < 2 || order - 1 > 3) next.clear(row, col);
    } else {
      if (order === 3) next.fill(row, col, life);
    }
  }
}

new p5(sketch)