import axios from 'axios'

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000'

export async function createRetellCall(): Promise<string> {
  try {
    const response = await axios.post(`${API_URL}/api/retell/create-call`)
    return response.data.access_token
  } catch (error) {
    console.error('Error creating Retell call:', error)
    throw error
  }
}
