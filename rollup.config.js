import resolve from '@rollup/plugin-node-resolve'

const external = ['p5']

export default [
  // ESM build for npm / Vite
  {
    input: 'src/addon.js',
    external,
    output: {
      file: 'dist/p5.quadrille.esm.js',
      format: 'es',
      sourcemap: true
    },
    plugins: [resolve()]
  },
  // IIFE build for <script> / CDN
  {
    input: 'src/addon.js',
    external,
    output: {
      file: 'dist/p5.quadrille.js',
      format: 'iife',
      name: 'Quadrille',
      globals: { p5: 'p5' },
      exports: 'default',
      sourcemap: true
    },
    plugins: [resolve()]
  }
]
