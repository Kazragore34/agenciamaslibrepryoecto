// Sentry configuration (opcional, para monitoreo de errores)

const SENTRY_DSN = import.meta.env.VITE_SENTRY_DSN

export function initSentry() {
  if (!SENTRY_DSN) {
    console.warn('SENTRY_DSN not configured, skipping Sentry initialization')
    return
  }

  // En producción, aquí se inicializaría Sentry
  // import * as Sentry from "@sentry/react"
  // Sentry.init({ dsn: SENTRY_DSN, ... })
  
  console.log('Sentry would be initialized here in production')
}

export function captureException(error: Error, context?: Record<string, any>) {
  if (SENTRY_DSN) {
    // Sentry.captureException(error, { extra: context })
    console.error('Error captured (Sentry would log this):', error, context)
  } else {
    console.error('Error:', error, context)
  }
}
