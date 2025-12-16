// Utilidades de debugging para producción

export function logDebug(message: string, data?: any) {
  const timestamp = new Date().toISOString()
  const logMessage = `[${timestamp}] ${message}`
  
  if (data) {
    console.log(logMessage, data)
  } else {
    console.log(logMessage)
  }
  
  // En desarrollo, también mostrar en pantalla
  if (import.meta.env.DEV) {
    const debugDiv = document.getElementById('debug-info')
    if (debugDiv) {
      debugDiv.innerHTML += `<div>${logMessage}</div>`
    }
  }
}

export function logError(message: string, error: any) {
  console.error(`[ERROR] ${message}`, error)
  
  // Enviar a servicio de monitoreo si está configurado
  if (import.meta.env.PROD) {
    // Aquí se podría enviar a Sentry u otro servicio
  }
}

export function checkEnvironment() {
  logDebug('🔍 Verificando entorno...')
  logDebug('📍 URL:', window.location.href)
  logDebug('🌐 Host:', window.location.host)
  logDebug('📁 Path:', window.location.pathname)
  logDebug('🔧 User Agent:', navigator.userAgent)
  
  // Verificar que los assets se cargan correctamente
  const scripts = document.querySelectorAll('script[type="module"]')
  logDebug('📜 Scripts module encontrados:', scripts.length)
  
  scripts.forEach((script, index) => {
    const src = script.getAttribute('src')
    logDebug(`   Script ${index + 1}:`, src)
    
    if (src) {
      // Verificar que el archivo existe
      fetch(src, { method: 'HEAD' })
        .then(response => {
          const contentType = response.headers.get('content-type')
          logDebug(`   ✅ ${src} - Content-Type: ${contentType}`)
          
          if (!contentType || !contentType.includes('javascript')) {
            logError(`   ❌ MIME type incorrecto para ${src}`, { contentType })
          }
        })
        .catch(error => {
          logError(`   ❌ Error cargando ${src}`, error)
        })
    }
  })
}
