import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  root: '.',
  build: {
    // Para Hostinger: generar en la raíz de portfolio (no en dist/)
    outDir: './',
    emptyOutDir: false, // No vaciar para no borrar src/, backend/, etc.
    rollupOptions: {
      output: {
        // Generar index.html en la raíz
        entryFileNames: 'assets/[name].[hash].js',
        chunkFileNames: 'assets/[name].[hash].js',
        assetFileNames: 'assets/[name].[hash].[ext]',
        manualChunks: {
          'react-vendor': ['react', 'react-dom', 'react-router-dom'],
          'framer-motion': ['framer-motion'],
        },
      },
      // Excluir archivos que no deben estar en el build
      external: [],
      input: {
        main: './index.html'
      }
    },
    minify: 'terser',
    terserOptions: {
      compress: {
        drop_console: false, // Mantener console.logs para debugging
      },
    },
  },
  server: {
    port: 5173,
    proxy: {
      '/api': {
        target: 'http://localhost:3000',
        changeOrigin: true,
      },
    },
  },
})
