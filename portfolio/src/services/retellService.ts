import axios from 'axios'

// Detectar si estamos en producción o desarrollo
const isProduction = window.location.hostname !== 'localhost' && window.location.hostname !== '127.0.0.1'

// URL del backend: usar variable de entorno o detectar automáticamente
// En producción, intenta usar el mismo dominio con /api o un subdominio api.*
const getApiUrl = () => {
  // Prioridad 1: Variable de entorno (para desarrollo local o configuración específica)
  if (import.meta.env.VITE_API_URL) {
    return import.meta.env.VITE_API_URL
  }
  
  if (isProduction) {
    // Prioridad 2: URL del backend en Render (producción)
    return 'https://portfolio-backend-zob1.onrender.com'
  }
  
  // Desarrollo local
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
