import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { copyFileSync, existsSync } from 'fs'
import { join } from 'path'

export default defineConfig({
  plugins: [
    react(),
    // Plugin personalizado para copiar archivos después del build
    {
      name: 'copy-to-root',
      closeBundle() {
        console.log('\n📦 Copiando archivos para Hostinger...')
        const distPath = './dist'
        const rootPath = './'
        
        try {
          // Copiar index.html
          if (existsSync(join(distPath, 'index.html'))) {
            copyFileSync(join(distPath, 'index.html'), join(rootPath, 'index.html'))
            console.log('✅ index.html copiado a la raíz')
          } else {
            console.warn('⚠️  No se encontró dist/index.html')
          }
          
          // Copiar carpeta assets usando Node.js (más compatible)
          if (existsSync(join(distPath, 'assets'))) {
            const { cpSync } = require('fs')
            const assetsDest = join(rootPath, 'assets')
            
            // Eliminar assets anterior si existe
            if (existsSync(assetsDest)) {
              const { rmSync } = require('fs')
              rmSync(assetsDest, { recursive: true, force: true })
            }
            
            cpSync(join(distPath, 'assets'), assetsDest, { recursive: true })
            console.log('✅ assets/ copiado a la raíz')
          } else {
            console.warn('⚠️  No se encontró dist/assets/')
          }
          
          console.log('\n✅ Build completado y archivos listos para Hostinger')
          console.log('📤 Archivos en la raíz de portfolio/:')
          console.log('   - index.html (actualizado)')
          console.log('   - assets/ (JS y CSS compilados)')
          console.log('\n💡 Recuerda: Sube estos archivos a Hostinger vía Git/FTP\n')
        } catch (error) {
          console.error('❌ Error copiando archivos:', error.message)
        }
      }
    }
  ],
  root: '.',
  build: {
    outDir: './dist',
    emptyOutDir: true,
    rollupOptions: {
      output: {
        entryFileNames: 'assets/[name].[hash].js',
        chunkFileNames: 'assets/[name].[hash].js',
        assetFileNames: 'assets/[name].[hash].[ext]',
        manualChunks: {
          'react-vendor': ['react', 'react-dom', 'react-router-dom'],
          'framer-motion': ['framer-motion'],
        },
      },
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
