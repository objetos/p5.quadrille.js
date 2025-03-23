// test-npm-esm/vite.config.js
import { defineConfig } from 'vite'
import path from 'path'

export default defineConfig({
  resolve: {
    alias: {
      'p5': path.resolve(__dirname, '../node_modules/p5/lib/p5.esm.js')
    }
  }
})
