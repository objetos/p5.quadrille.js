import commonjs from '@rollup/plugin-commonjs'
import resolve from '@rollup/plugin-node-resolve'

export default [
  // ESM for npm (p5 external)
  {
    input: 'p5.quadrille.js',
    output: {
      file: 'dist/p5.quadrille.esm.js',
      format: 'esm',
      exports: 'default'
    },
    external: ['p5'],
    plugins: [resolve(), commonjs()]
  },

  // IIFE for browsers (p5 global)
  {
    input: 'p5.quadrille.js',
    output: {
      file: 'dist/p5.quadrille.iife.js',
      format: 'iife',
      name: 'Quadrille',
      globals: {
        p5: 'p5'
      },
      exports: 'default'
    },
    external: ['p5'],
    plugins: [resolve(), commonjs()]
  }
]