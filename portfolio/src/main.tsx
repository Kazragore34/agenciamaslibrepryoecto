import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.tsx'
import './index.css'
import { logDebug, logError, checkEnvironment } from './utils/debug'

// Logs de debugging
console.log('🚀 ==========================================')
console.log('🚀 PORTFOLIO INICIANDO - BUILD C983AyZb')
console.log('🚀 ==========================================')
logDebug('🚀 Portfolio iniciando...')
logDebug('📍 URL:', window.location.href)
logDebug('⏰ Tiempo:', new Date().toISOString())
logDebug('🔧 Modo:', import.meta.env.MODE)
logDebug('📦 Base URL:', import.meta.env.BASE_URL)
console.log('📦 Script cargado:', document.currentScript?.src || 'N/A')

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
         console.log('⚛️  ==========================================')
         console.log('⚛️  RENDERIZANDO REACT - VERSIÓN MEJORADA')
         console.log('⚛️  Build: index.C983AyZb.js')
         console.log('⚛️  ==========================================')
         logDebug('⚛️  Renderizando React...')
         ReactDOM.createRoot(rootElement).render(
           <React.StrictMode>
             <App />
           </React.StrictMode>,
         )
         console.log('✅ React renderizado correctamente')
         logDebug('✅ React renderizado correctamente')
         
         // Verificar después de renderizar
         setTimeout(() => {
           const rootContent = rootElement.innerHTML
           console.log('📄 Contenido del root (primeros 500 chars):', rootContent.substring(0, 500))
           console.log('📏 Tamaño del contenido:', rootContent.length, 'caracteres')
           
           if (rootContent.includes('Estadísticas') || rootContent.includes('50+')) {
             console.log('✅ CONTENIDO MEJORADO DETECTADO EN EL DOM')
           } else {
             console.error('❌ ERROR: Contenido mejorado NO encontrado en el DOM')
             console.error('❌ El DOM contiene:', rootContent.substring(0, 200))
           }
         }, 2000)
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
