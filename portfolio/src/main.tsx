import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.tsx'
import './index.css'

// Logs de debugging
console.log('🚀 Portfolio iniciando...')
console.log('📍 URL:', window.location.href)
console.log('⏰ Tiempo:', new Date().toISOString())

// Verificar que el DOM está listo
const rootElement = document.getElementById('root')
if (!rootElement) {
  console.error('❌ Error: No se encontró el elemento #root')
  document.body.innerHTML = '<div style="padding: 20px; text-align: center;"><h1>Error de Carga</h1><p>No se pudo encontrar el elemento root. Verifica que index.html esté correcto.</p></div>'
} else {
  console.log('✅ Elemento root encontrado')
  
  // Inicializar servicios de forma asíncrona para no bloquear el render
  setTimeout(() => {
    console.log('📊 Inicializando servicios...')
    import('./utils/analytics').then(({ initAnalytics }) => {
      initAnalytics()
      console.log('✅ Analytics inicializado')
    }).catch(err => console.warn('⚠️ Analytics no disponible:', err))
    
    import('./utils/sentry').then(({ initSentry }) => {
      initSentry()
      console.log('✅ Sentry inicializado')
    }).catch(err => console.warn('⚠️ Sentry no disponible:', err))
  }, 0)

  try {
    console.log('⚛️  Renderizando React...')
    ReactDOM.createRoot(rootElement).render(
      <React.StrictMode>
        <App />
      </React.StrictMode>,
    )
    console.log('✅ React renderizado correctamente')
  } catch (error) {
    console.error('❌ Error al renderizar React:', error)
    rootElement.innerHTML = `
      <div style="padding: 20px; text-align: center;">
        <h1>Error de Carga</h1>
        <p>Hubo un error al cargar la aplicación.</p>
        <pre style="text-align: left; background: #f5f5f5; padding: 10px; border-radius: 4px;">${error}</pre>
        <p><a href="/debug.html">Ver página de debug</a></p>
      </div>
    `
  }
}
