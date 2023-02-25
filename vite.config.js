import glsl from 'vite-plugin-glsl';
import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    vue(),
    glsl({
      exclude: undefined,                         // File paths/extensions to ignore
      include: /\.(glsl|wgsl|vert|frag|vs|fs)$/i, // File paths/extensions to import
      defaultExtension: 'glsl',                   // Shader suffix when no extension is specified
      warnDuplicatedImports: true,                // Warn if the same chunk was imported multiple times
      compress: false,                            // Compress the resulting shader code
      root: '/'                                   // Directory for root imports
    })
  ]
})
