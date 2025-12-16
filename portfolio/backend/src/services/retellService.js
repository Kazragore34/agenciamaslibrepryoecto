import axios from 'axios'
import { logger } from '../utils/logger.js'

const RETELL_API_KEY = process.env.RETELL_API_KEY
const RETELL_AGENT_ID = process.env.RETELL_AGENT_ID
const RETELL_API_URL = 'https://api.retellai.com'

export async function createRetellCall() {
  if (!RETELL_API_KEY || !RETELL_AGENT_ID) {
    throw new Error('RETELL_API_KEY y RETELL_AGENT_ID deben estar configurados')
  }

  try {
    const response = await axios.post(
      `${RETELL_API_URL}/create-web-call`,
      {
        agent_id: RETELL_AGENT_ID,
        override_agent_config: {
          enable_web_call: true,
        }
      },
      {
        headers: {
          'Authorization': `Bearer ${RETELL_API_KEY}`,
          'Content-Type': 'application/json'
        }
      }
    )

    logger.info('Retell call created', { callId: response.data.call_id })
    return response.data.access_token
  } catch (error) {
    logger.error('Error creating Retell call:', error.response?.data || error.message)
    throw new Error('Error al crear la llamada de prueba')
  }
}

export async function handleRetellWebhook(eventData) {
  const { event, call } = eventData

  logger.info('Retell webhook event received', { event, callId: call?.call_id })

  switch (event) {
    case 'call_started':
      // Lógica para cuando inicia la llamada
      logger.info('Call started', { callId: call.call_id })
      break
    case 'call_ended':
      // Lógica para cuando termina la llamada
      logger.info('Call ended', { 
        callId: call.call_id,
        duration: call.duration,
        end_reason: call.end_reason
      })
      break
    case 'call_analyzed':
      // Lógica para análisis de la llamada
      logger.info('Call analyzed', { callId: call.call_id })
      break
    default:
      logger.info('Unknown event received', { event })
  }
}
