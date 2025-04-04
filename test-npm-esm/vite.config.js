import { defineConfig } from 'vite'
import path from 'path'

export default defineConfig({
  resolve: {
    alias: {
      'p5': path.resolve(__dirname, 'node_modules/p5/lib/p5.esm.js'),
      'p5.quadrille': path.resolve(__dirname, '../dist/p5.quadrille.esm.js')
    }
  }
})
