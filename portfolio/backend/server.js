import express from 'express'
import cors from 'cors'
import dotenv from 'dotenv'

dotenv.config()

const app = express()
const PORT = process.env.PORT || 3000

// Middleware
app.use(cors({
  origin: process.env.FRONTEND_URL || '*', // En producción, especifica el dominio exacto
  credentials: true
}))
app.use(express.json())

// Inicializar cliente de Retell.ai usando import dinámico
let retellClient = null
const initRetell = async () => {
  try {
    // Usar import dinámico para módulos CommonJS
    const retellModule = await import('retell-sdk')
    // El módulo puede exportar RetellClient o default
    let Retell = null
    
    // Intentar diferentes formas de obtener el constructor
    // En Render aparece RetellClient, en local aparece default
    if (retellModule.RetellClient && typeof retellModule.RetellClient === 'function') {
      Retell = retellModule.RetellClient
      console.log('📦 Usando RetellClient como constructor')
    } else if (retellModule.default && typeof retellModule.default === 'function') {
      Retell = retellModule.default
      console.log('📦 Usando default como constructor')
    } else if (retellModule.Retell && typeof retellModule.Retell === 'function') {
      Retell = retellModule.Retell
      console.log('📦 Usando Retell como constructor')
    }
    
    if (!Retell) {
      console.error('❌ No se pudo encontrar el constructor Retell. Estructura del módulo:', Object.keys(retellModule))
      return
    }
    
    retellClient = new Retell({
      apiKey: process.env.RETELL_API_KEY || 'key_57585684f15a8c742487f38bdef5',
    })
    
    // Verificar que el cliente se inicializó correctamente
    console.log('✅ Retell.ai cliente inicializado')
    console.log('🔍 Estructura del cliente:', Object.keys(retellClient))
    console.log('📞 Tiene call?', !!retellClient.call)
    console.log('📞 Tipo de call:', typeof retellClient.call)
    
    // Verificar que call tiene los métodos necesarios
    if (retellClient.call) {
      console.log('📞 Métodos de call:', Object.keys(retellClient.call))
      console.log('📞 Tiene createWebCall?', typeof retellClient.call.createWebCall)
      console.log('📞 Tiene createCall?', typeof retellClient.call.createCall)
    } else {
      console.error('❌ El cliente no tiene la propiedad call')
    }
  } catch (error) {
    console.error('❌ Error inicializando Retell.ai:', error)
    console.error('Stack:', error.stack)
    // No lanzamos el error para que el servidor pueda iniciar sin Retell
  }
}

// Inicializar Retell al arrancar
initRetell()

// Endpoint para crear una llamada
app.post('/api/retell/create-call', async (req, res) => {
  try {
    // Si Retell no está inicializado, intentar inicializarlo ahora
    if (!retellClient) {
      await initRetell()
    }
    
    if (!retellClient) {
      throw new Error('Retell.ai no está disponible. Por favor, verifica la configuración.')
    }
    
    console.log('🔍 Cliente disponible. Propiedades:', Object.keys(retellClient))
    console.log('📞 retellClient.call existe?', !!retellClient.call)
    
    const agentId = process.env.RETELL_AGENT_ID || 'agent_b3d667fee19fd64018b0257518'
    
    // Intentar diferentes formas de crear la llamada
    let response
    if (retellClient.call && retellClient.call.createCall) {
      // Método estándar
      response = await retellClient.call.createCall({
        agentId: agentId,
        metadata: {
          userId: req.body.userId || 'anonymous',
          source: 'portfolio-demo'
        }
      })
    } else if (retellClient.call && retellClient.call.create) {
      // Método alternativo
      response = await retellClient.call.create({
        agentId: agentId,
        metadata: {
          userId: req.body.userId || 'anonymous',
          source: 'portfolio-demo'
        }
      })
    } else {
      // Usar directamente el módulo Call si está disponible
      const retellModule = await import('retell-sdk')
      if (retellModule.Call) {
        const Call = retellModule.Call
        response = await Call.create({
          agentId: agentId,
          metadata: {
            userId: req.body.userId || 'anonymous',
            source: 'portfolio-demo'
          }
        })
      } else {
        throw new Error('No se pudo encontrar el método para crear llamadas. Estructura del cliente: ' + JSON.stringify(Object.keys(retellClient)))
      }
    }

    // La respuesta de createWebCall tiene access_token directamente
    console.log('✅ Respuesta de Retell:', JSON.stringify(response, null, 2))
    
    res.json({
      access_token: response.access_token || response.call?.callId || response.callId || response.id,
      call_id: response.call_id || response.call?.callId || response.callId || response.id
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
