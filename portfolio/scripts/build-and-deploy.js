import { execSync } from 'child_process'
import { readFileSync, writeFileSync, existsSync, rmSync } from 'fs'
import { join, dirname } from 'path'
import { fileURLToPath } from 'url'

const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)
const rootDir = join(__dirname, '..')

// Archivos donde está la versión
const versionFiles = [
  join(rootDir, 'src/pages/IADemo.tsx'),
  join(rootDir, 'src/components/RetellCallButton.tsx')
]

// Leer la versión actual
function getCurrentVersion() {
  const content = readFileSync(versionFiles[0], 'utf-8')
  const match = content.match(/v(\d+)\.(\d+)/)
  if (match) {
    return { major: parseInt(match[1]), minor: parseInt(match[2]) }
  }
  return { major: 0, minor: 0 }
}

// Incrementar versión
function incrementVersion(version) {
  return {
    major: version.major,
    minor: version.minor + 1
  }
}

// Actualizar versión en todos los archivos
function updateVersion(newVersion) {
  const versionString = `v${newVersion.major}.${newVersion.minor}`
  console.log(`📦 Actualizando versión a ${versionString}...`)
  
  versionFiles.forEach(file => {
    let content = readFileSync(file, 'utf-8')
    // Reemplazar cualquier versión existente
    content = content.replace(/v\d+\.\d+/g, versionString)
    writeFileSync(file, content, 'utf-8')
  })
  
  return versionString
}

// Resetear index.html a su forma básica
function resetIndexHtml() {
  const indexHtmlPath = join(rootDir, 'index.html')
  const basicHtml = `<!doctype html>
<html lang="es">
  <head>
    <meta charset="UTF-8" />
    <link rel="icon" type="image/svg+xml" href="/vite.svg" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
    <link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&display=swap" rel="stylesheet">
    <title>Portfolio - Desarrollador Web Profesional</title>
    <script type="module" src="/src/main.tsx"></script>
  </head>
  <body>
    <div id="root"></div>
  </body>
</html>`
  
  writeFileSync(indexHtmlPath, basicHtml, 'utf-8')
  console.log('✅ index.html reseteado a forma básica')
}

// Limpiar dist y assets
function cleanBuild() {
  const distPath = join(rootDir, 'dist')
  const assetsPath = join(rootDir, 'assets')
  
  if (existsSync(distPath)) {
    rmSync(distPath, { recursive: true, force: true })
    console.log('✅ dist/ limpiado')
  }
  
  if (existsSync(assetsPath)) {
    rmSync(assetsPath, { recursive: true, force: true })
    console.log('✅ assets/ limpiado')
  }
}

// Ejecutar build
function runBuild() {
  console.log('\n🔨 Ejecutando build...')
  try {
    execSync('npm run build:hostinger', { 
      cwd: rootDir, 
      stdio: 'inherit',
      shell: true 
    })
    console.log('✅ Build completado')
  } catch (error) {
    console.error('❌ Error en el build:', error.message)
    process.exit(1)
  }
}

// Hacer commit y push
function gitCommitAndPush(versionString) {
  console.log('\n📤 Haciendo commit y push...')
  try {
    // Ir al directorio raíz del proyecto (no portfolio/)
    const projectRoot = join(rootDir, '..')
    
    execSync('git add portfolio/', { 
      cwd: projectRoot, 
      stdio: 'inherit',
      shell: true 
    })
    
    execSync(`git commit -m "Build: Actualizar a ${versionString}"`, { 
      cwd: projectRoot, 
      stdio: 'inherit',
      shell: true 
    })
    
    execSync('git push', { 
      cwd: projectRoot, 
      stdio: 'inherit',
      shell: true 
    })
    
    console.log(`\n✅ Cambios subidos con versión ${versionString}`)
  } catch (error) {
    console.error('❌ Error en git:', error.message)
    process.exit(1)
  }
}

// Proceso completo
console.log('\n🚀 Iniciando build y deploy automático...\n')

// 1. Incrementar versión
const currentVersion = getCurrentVersion()
const newVersion = incrementVersion(currentVersion)
const versionString = updateVersion(newVersion)

// 2. Resetear index.html
resetIndexHtml()

// 3. Limpiar builds anteriores
cleanBuild()

// 4. Hacer build
runBuild()

// 5. Commit y push
gitCommitAndPush(versionString)

console.log(`\n✅ Proceso completado! Versión ${versionString} desplegada.\n`)
