import axios from 'axios'

// Detectar si estamos en producción o desarrollo
const isProduction = window.location.hostname !== 'localhost' && window.location.hostname !== '127.0.0.1'

// URL del backend: usar variable de entorno o detectar automáticamente
// En producción, intenta usar el mismo dominio con /api o un subdominio api.*
const getApiUrl = () => {
  if (import.meta.env.VITE_API_URL) {
    return import.meta.env.VITE_API_URL
  }
  
  if (isProduction) {
    // Opción 1: Mismo dominio con /api (si el backend está en el mismo servidor)
    // Opción 2: Subdominio api.* (recomendado)
    const hostname = window.location.hostname
    const protocol = window.location.protocol
    
    // Si el dominio es portfolio.agenciamaslibre.com, intenta api.agenciamaslibre.com
    if (hostname.includes('portfolio.')) {
      const baseDomain = hostname.replace('portfolio.', '')
      return `${protocol}//api.${baseDomain}`
    }
    
    // Fallback: mismo dominio con /api
    return `${protocol}//${hostname}/api`
  }
  
  return 'http://localhost:3000'
}

const API_URL = getApiUrl()

export async function createRetellCall(): Promise<string> {
  try {
    const response = await axios.post(`${API_URL}/api/retell/create-call`, {}, {
      timeout: 10000,
      headers: {
        'Content-Type': 'application/json'
      }
    })
    return response.data.access_token
  } catch (error: any) {
    console.error('Error creating Retell call:', error)
    console.error('API URL intentada:', `${API_URL}/api/retell/create-call`)
    throw error
  }
}
