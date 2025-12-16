import axios from 'axios'

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000'

export async function sendMessageToIAN(message: string): Promise<string> {
  try {
    const sessionId = localStorage.getItem('ian_session_id') || ''
    
    const response = await axios.post(`${API_URL}/api/chat/send`, {
      message,
      sessionId,
    })

    return response.data.response || 'Lo siento, no pude procesar tu mensaje.'
  } catch (error) {
    console.error('Error sending message to IAN:', error)
    throw error
  }
}
