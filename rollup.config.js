import resolve from '@rollup/plugin-node-resolve'

const external = ['p5']

export default [
  // ✅ ESM build
  {
    input: 'src/p5.quadrille.js',
    external,
    output: {
      file: 'dist/p5.quadrille.esm.js',
      format: 'es',
      sourcemap: true
    },
    plugins: [resolve()]
  },

  // ✅ IIFE build (global mode for CDN)
  {
    input: 'src/p5.quadrille.js',
    external,
    output: {
      file: 'p5.quadrille.js',
      format: 'iife',
      // name: 'p5',        // ✅ Would expose as p5.Quadrille (attach to global p5)
      name: 'Quadrille',    // ✅ Exposes directly as global Quadrille
      globals: { p5: 'p5' },
      exports: 'default', // ✅ exposes as p5.Quadrille = default export
      sourcemap: true
    },
    plugins: [resolve()]
  }
]