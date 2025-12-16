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
  const url = `${API_URL}/api/retell/create-call`
  console.log('🔗 Intentando conectar a:', url)
  
  try {
    const response = await axios.post(url, {}, {
      timeout: 15000, // Aumentar timeout para plan gratis de Render
      headers: {
        'Content-Type': 'application/json'
      }
    })
    
    console.log('✅ Respuesta del backend:', response.data)
    
    if (!response.data || !response.data.access_token) {
      console.error('❌ Respuesta inválida del backend:', response.data)
      throw new Error('El backend no retornó un access_token válido')
    }
    
    return response.data.access_token
  } catch (error: any) {
    console.error('❌ Error creating Retell call:', error)
    console.error('📡 API URL intentada:', url)
    console.error('📊 Estado de respuesta:', error.response?.status)
    console.error('📄 Datos de respuesta:', error.response?.data)
    
    // Mejorar mensajes de error
    if (error.code === 'ECONNREFUSED' || error.message?.includes('Network Error')) {
      throw new Error('No se pudo conectar al backend. El servidor puede estar iniciando (plan gratis de Render tarda ~30s). Intenta de nuevo en unos segundos.')
    }
    
    if (error.response?.status === 500) {
      throw new Error(`Error del servidor: ${error.response?.data?.error || error.response?.data?.details || 'Error desconocido'}`)
    }
    
    if (error.response?.status === 404) {
      throw new Error('El endpoint del backend no fue encontrado. Verifica la configuración.')
    }
    
    throw new Error(error.response?.data?.error || error.response?.data?.details || error.message || 'Error al conectar con el servidor')
  }
}
