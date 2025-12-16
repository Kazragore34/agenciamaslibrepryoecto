import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.tsx'
import './index.css'
import { logDebug, logError, checkEnvironment } from './utils/debug'

// Logs de debugging
logDebug('🚀 Portfolio iniciando...')
logDebug('📍 URL:', window.location.href)
logDebug('⏰ Tiempo:', new Date().toISOString())
logDebug('🔧 Modo:', import.meta.env.MODE)
logDebug('📦 Base URL:', import.meta.env.BASE_URL)

// Verificar que el DOM está listo
const rootElement = document.getElementById('root')
if (!rootElement) {
  logError('❌ Error: No se encontró el elemento #root', null)
  document.body.innerHTML = `
    <div style="padding: 20px; text-align: center; font-family: Arial, sans-serif;">
      <h1>❌ Error de Carga</h1>
      <p>No se pudo encontrar el elemento #root.</p>
      <p>Verifica que index.html tenga: <code>&lt;div id="root"&gt;&lt;/div&gt;</code></p>
      <p><a href="/debug.html">Ver página de debug</a></p>
    </div>
  `
} else {
  logDebug('✅ Elemento root encontrado')
  
  // Verificar entorno y assets
  checkEnvironment()
  
  // Inicializar servicios de forma asíncrona para no bloquear el render
  setTimeout(() => {
    logDebug('📊 Inicializando servicios...')
    import('./utils/analytics').then(({ initAnalytics }) => {
      initAnalytics()
      logDebug('✅ Analytics inicializado')
    }).catch(err => logError('⚠️ Analytics no disponible', err))
    
    import('./utils/sentry').then(({ initSentry }) => {
      initSentry()
      logDebug('✅ Sentry inicializado')
    }).catch(err => logError('⚠️ Sentry no disponible', err))
  }, 0)

  try {
    logDebug('⚛️  Renderizando React...')
    ReactDOM.createRoot(rootElement).render(
      <React.StrictMode>
        <App />
      </React.StrictMode>,
    )
    logDebug('✅ React renderizado correctamente')
  } catch (error: any) {
    logError('❌ Error al renderizar React', error)
    rootElement.innerHTML = `
      <div style="padding: 20px; text-align: center; font-family: Arial, sans-serif;">
        <h1>❌ Error de Carga</h1>
        <p>Hubo un error al cargar la aplicación React.</p>
        <pre style="text-align: left; background: #f5f5f5; padding: 10px; border-radius: 4px; overflow-x: auto;">${error?.message || error}</pre>
        <p><a href="/debug.html">Ver página de debug</a></p>
        <p><a href="/test.html">Verificar servidor</a></p>
      </div>
    `
  }
}
