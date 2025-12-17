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
    console.log('📦 Módulo retell-sdk cargado. Keys:', Object.keys(retellModule))
    
    // El módulo exporta RetellClient o default como constructor
    // En Render aparece RetellClient, en local aparece default
    let Retell = null
    
    // Verificar qué tenemos disponible
    console.log('🔍 default existe?', !!retellModule.default)
    console.log('🔍 default type:', typeof retellModule.default)
    console.log('🔍 RetellClient existe?', !!retellModule.RetellClient)
    console.log('🔍 RetellClient type:', typeof retellModule.RetellClient)
    console.log('🔍 Retell existe?', !!retellModule.Retell)
    console.log('🔍 Retell type:', typeof retellModule.Retell)
    
    // Intentar usar default primero (funciona en local y debería funcionar en Render)
    if (retellModule.default && typeof retellModule.default === 'function') {
      Retell = retellModule.default
      console.log('📦 Usando default como constructor')
    } else if (retellModule.Retell && typeof retellModule.Retell === 'function') {
      Retell = retellModule.Retell
      console.log('📦 Usando Retell como constructor')
    } else if (retellModule.RetellClient && typeof retellModule.RetellClient === 'function') {
      Retell = retellModule.RetellClient
      console.log('📦 Usando RetellClient como constructor')
    } else {
      // Si nada funciona, intentar acceder a default de todas formas
      if (retellModule.default) {
        console.log('⚠️ default no es función, pero existe. Tipo:', typeof retellModule.default)
        // Puede ser que default sea un objeto con el constructor dentro
        if (retellModule.default.default && typeof retellModule.default.default === 'function') {
          Retell = retellModule.default.default
          console.log('📦 Usando default.default como constructor')
        } else {
          Retell = retellModule.default
          console.log('📦 Intentando usar default directamente aunque no sea función')
        }
      }
    }
    
    if (!Retell || typeof Retell !== 'function') {
      console.error('❌ No se pudo encontrar el constructor Retell.')
      console.error('📦 Estructura completa del módulo:', JSON.stringify(Object.keys(retellModule), null, 2))
      console.error('🔍 default:', retellModule.default)
      console.error('🔍 RetellClient:', retellModule.RetellClient)
      console.error('🔍 Retell:', retellModule.Retell)
      return
    }
    
    console.log('📦 Constructor encontrado:', Retell.name || 'Retell')
    
    // Crear el cliente con la API key
    const apiKey = process.env.RETELL_API_KEY || 'key_57585684f15a8c742487f38bdef5'
    console.log('🔑 Creando cliente con API key:', apiKey ? `${apiKey.substring(0, 10)}...` : 'NO CONFIGURADA')
    
    retellClient = new Retell({
      apiKey: apiKey,
    })
    
    // Esperar un momento para que el cliente se inicialice completamente
    await new Promise(resolve => setTimeout(resolve, 200))
    
    // Verificar que el cliente se inicializó correctamente
    console.log('✅ Retell.ai cliente creado')
    console.log('🔍 Estructura del cliente:', Object.keys(retellClient))
    console.log('📞 Tiene call?', !!retellClient.call)
    console.log('📞 Tiene Call?', !!retellClient.Call)
    console.log('📞 Tipo de call:', typeof retellClient.call)
    console.log('📞 Tipo de Call:', typeof retellClient.Call)
    
    // Verificar que call tiene los métodos necesarios
    if (retellClient.call) {
      console.log('📞 Métodos de call:', Object.keys(retellClient.call))
      console.log('📞 Tiene createWebCall?', typeof retellClient.call.createWebCall)
      console.log('📞 Tiene createCall?', typeof retellClient.call.createCall)
      console.log('✅ Retell.ai cliente inicializado correctamente con call')
    } else if (retellClient.Call) {
      console.log('📞 Call es una clase:', typeof retellClient.Call)
      console.log('📞 Métodos de Call:', Object.keys(retellClient.Call))
      console.log('✅ Retell.ai cliente inicializado correctamente con Call')
    } else {
      console.warn('⚠️ El cliente no tiene call ni Call')
      console.log('🔍 Propiedades disponibles:', Object.keys(retellClient))
      // Intentar acceder a call de otra forma
      if (retellClient['call']) {
        console.log('📞 call encontrado con bracket notation')
        retellClient.call = retellClient['call']
      }
      // Verificar si hay propiedades que contengan 'call' o 'Call'
      const callProps = Object.keys(retellClient).filter(key => 
        key.toLowerCase().includes('call')
      )
      if (callProps.length > 0) {
        console.log('📞 Propiedades relacionadas con call:', callProps)
      }
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
    console.log('📞 retellClient.Call existe?', !!retellClient.Call)
    
    const agentId = process.env.RETELL_AGENT_ID || 'agent_b3d667fee19fd64018b0257518'
    
    // Intentar diferentes formas de crear la llamada según la documentación oficial
    let response
    try {
      // Método 1: retellClient.call.createWebCall (método oficial según docs)
      if (retellClient.call && typeof retellClient.call.createWebCall === 'function') {
        console.log('📞 Usando retellClient.call.createWebCall')
        response = await retellClient.call.createWebCall({
          agent_id: agentId
        })
      }
      // Método 2: retellClient.call.createCall (método alternativo)
      else if (retellClient.call && typeof retellClient.call.createCall === 'function') {
        console.log('📞 Usando retellClient.call.createCall')
        response = await retellClient.call.createCall({
          agent_id: agentId,
          metadata: {
            userId: req.body.userId || 'anonymous',
            source: 'portfolio-demo'
          }
        })
      }
      // Método 3: retellClient.Call.createWebCall (acceso directo a la clase Call)
      else if (retellClient.Call && typeof retellClient.Call.createWebCall === 'function') {
        console.log('📞 Usando retellClient.Call.createWebCall')
        response = await retellClient.Call.createWebCall({
          agent_id: agentId
        })
      }
      // Método 4: Usar el módulo Call directamente
      else {
        console.log('📞 Intentando usar módulo Call directamente')
        const retellModule = await import('retell-sdk')
        
        // El módulo tiene Call como clase, pero necesita el cliente
        if (retellModule.Call && retellClient) {
          // Crear una instancia de Call usando el cliente
          const callInstance = new retellModule.Call(retellClient)
          if (callInstance && typeof callInstance.createWebCall === 'function') {
            console.log('📞 Usando Call instance createWebCall')
            response = await callInstance.createWebCall({
              agent_id: agentId
            })
          } else if (callInstance && typeof callInstance.create === 'function') {
            console.log('📞 Usando Call instance create')
            response = await callInstance.create({
              agent_id: agentId
            })
          } else {
            throw new Error('Call instance no tiene métodos createWebCall o create')
          }
        } else {
          throw new Error('No se pudo encontrar el método para crear llamadas. Cliente keys: ' + JSON.stringify(Object.keys(retellClient)) + ', Módulo keys: ' + JSON.stringify(Object.keys(retellModule || {})))
        }
      }
    } catch (callError) {
      console.error('❌ Error en método de creación de llamada:', callError)
      throw callError
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
