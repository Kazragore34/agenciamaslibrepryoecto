import { readFileSync, writeFileSync } from 'fs'
import { join, dirname } from 'path'
import { fileURLToPath } from 'url'

const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)
const rootDir = join(__dirname, '..')

// Archivos donde está la versión
const files = [
  join(rootDir, 'src/pages/IADemo.tsx'),
  join(rootDir, 'src/components/RetellCallButton.tsx')
]

// Leer la versión actual
function getCurrentVersion() {
  const content = readFileSync(files[0], 'utf-8')
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
  
  files.forEach(file => {
    let content = readFileSync(file, 'utf-8')
    // Reemplazar cualquier versión existente
    content = content.replace(/v\d+\.\d+/g, versionString)
    writeFileSync(file, content, 'utf-8')
    console.log(`✅ ${file.split('/').pop()} actualizado`)
  })
  
  return versionString
}

// Ejecutar
const currentVersion = getCurrentVersion()
const newVersion = incrementVersion(currentVersion)
const versionString = updateVersion(newVersion)

console.log(`\n✅ Versión actualizada: ${versionString}\n`)
