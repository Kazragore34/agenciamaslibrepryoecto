// Script para copiar archivos compilados a la raíz (para Hostinger)
import { copyFileSync, existsSync, cpSync, rmSync } from 'fs'
import { join } from 'path'

const distPath = './dist'
const rootPath = './'

console.log('\n📦 Copiando archivos para Hostinger...')

try {
  // Copiar index.html
  if (existsSync(join(distPath, 'index.html'))) {
    copyFileSync(join(distPath, 'index.html'), join(rootPath, 'index.html'))
    console.log('✅ index.html copiado a la raíz')
  } else {
    console.warn('⚠️  No se encontró dist/index.html')
    process.exit(1)
  }
  
  // Copiar carpeta assets
  if (existsSync(join(distPath, 'assets'))) {
    const assetsDest = join(rootPath, 'assets')
    
    // Eliminar assets anterior si existe
    if (existsSync(assetsDest)) {
      rmSync(assetsDest, { recursive: true, force: true })
    }
    
    cpSync(join(distPath, 'assets'), assetsDest, { recursive: true })
    console.log('✅ assets/ copiado a la raíz')
  } else {
    console.warn('⚠️  No se encontró dist/assets/')
    process.exit(1)
  }
  
  console.log('\n✅ Build completado y archivos listos para Hostinger')
  console.log('📤 Archivos en la raíz de portfolio/:')
  console.log('   - index.html (actualizado)')
  console.log('   - assets/ (JS y CSS compilados)')
  console.log('\n💡 Recuerda: Sube estos archivos a Hostinger vía Git/FTP\n')
} catch (error) {
  console.error('❌ Error copiando archivos:', error.message)
  process.exit(1)
}
