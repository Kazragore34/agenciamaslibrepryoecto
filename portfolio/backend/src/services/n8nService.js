import axios from 'axios'
import { logger } from '../utils/logger.js'

const N8N_WEBHOOK_URL = process.env.N8N_WEBHOOK_URL

export async function sendMessageToN8N(message, sessionId) {
  if (!N8N_WEBHOOK_URL) {
    // Modo desarrollo: respuesta mock
    logger.warn('N8N_WEBHOOK_URL no configurado, usando respuesta mock')
    return `Hola! Recibí tu mensaje: "${message}". Esta es una respuesta de prueba. Configura N8N_WEBHOOK_URL para conectar con tu workflow de n8n.`
  }

  try {
    const response = await axios.post(N8N_WEBHOOK_URL, {
      message,
      sessionId,
      timestamp: new Date().toISOString()
    }, {
      timeout: 10000 // 10 segundos timeout
    })

    logger.info('Message sent to n8n', { sessionId, messageLength: message.length })
    
    // n8n puede retornar la respuesta en diferentes formatos
    return response.data?.response || response.data?.text || response.data || 'Respuesta recibida de IAN'
  } catch (error) {
    logger.error('Error sending message to n8n:', {
      message: error.message,
      response: error.response?.data
    })
    throw new Error('Error al comunicarse con IAN. Por favor, intenta de nuevo.')
  }
}
