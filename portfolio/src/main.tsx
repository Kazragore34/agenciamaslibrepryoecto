import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.tsx'
import './index.css'

// Inicializar servicios de forma asíncrona para no bloquear el render
setTimeout(() => {
  import('./utils/analytics').then(({ initAnalytics }) => initAnalytics())
  import('./utils/sentry').then(({ initSentry }) => initSentry())
}, 0)

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
)
