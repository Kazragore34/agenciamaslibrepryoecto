import express from 'express'
import cors from 'cors'
import pkg from 'retell-sdk'
import dotenv from 'dotenv'

const { Retell } = pkg

dotenv.config()

const app = express()
const PORT = process.env.PORT || 3000

// Middleware
app.use(cors({
  origin: process.env.FRONTEND_URL || '*', // En producción, especifica el dominio exacto
  credentials: true
}))
app.use(express.json())

// Inicializar cliente de Retell.ai
const retellClient = new Retell({
  apiKey: process.env.RETELL_API_KEY || 'key_57585684f15a8c742487f38bdef5',
})

// Endpoint para crear una llamada
app.post('/api/retell/create-call', async (req, res) => {
  try {
    const agentId = process.env.RETELL_AGENT_ID || 'agent_b3d667fee19fd64018b0257518'
    
    const response = await retellClient.call.createCall({
      agentId: agentId,
      metadata: {
        userId: req.body.userId || 'anonymous',
        source: 'portfolio-demo'
      }
    })

    res.json({
      access_token: response.call.callId,
      call_id: response.call.callId
    })
  } catch (error) {
    console.error('Error creating Retell call:', error)
    res.status(500).json({ 
      error: 'Error al crear la llamada',
      details: error.message 
    })
  }
})

// Endpoint para recibir webhooks de Retell.ai
app.post('/api/retell/webhook', async (req, res) => {
  const event = req.body
  
  switch (event.event) {
    case 'call_started':
      console.log('Llamada iniciada:', event.call_id)
      break
      
    case 'call_ended':
      console.log('Llamada finalizada:', event.call_id)
      break
      
    case 'conversation_started':
      console.log('Conversación iniciada:', event.call_id)
      break
      
    case 'conversation_ended':
      console.log('Conversación finalizada:', event.call_id)
      break
  }
  
  res.status(200).send('OK')
})

// Health check
app.get('/health', (req, res) => {
  res.json({ status: 'ok' })
})

app.listen(PORT, () => {
  console.log(`🚀 Servidor corriendo en puerto ${PORT}`)
  console.log(`📞 Retell.ai configurado con Agent ID: ${process.env.RETELL_AGENT_ID || 'agent_b3d667fee19fd64018b0257518'}`)
})
