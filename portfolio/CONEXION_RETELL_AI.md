# Guía de Conexión de Retell.ai a AI Demo

## Descripción General

Esta guía explica cómo conectar Retell.ai con la página de demostración de IA (`/ia-demo`) para permitir llamadas de voz en tiempo real con un agente de IA.

## Requisitos Previos

1. **Cuenta de Retell.ai**: Necesitas una cuenta activa en [Retell.ai](https://retell.ai)
2. **API Key de Retell.ai**: Obtén tu API key desde el dashboard de Retell.ai
3. **Backend configurado**: El backend debe estar corriendo y accesible

## Arquitectura de la Integración

```
Frontend (React) → Backend (Node.js/Express) → Retell.ai API
     ↓                      ↓                        ↓
RetellWebClient    createRetellCall()      Access Token
```

## Paso 1: Configurar Variables de Entorno

En tu archivo `.env` del backend, agrega:

```env
RETELL_API_KEY=tu_api_key_aqui
RETELL_AGENT_ID=tu_agent_id_aqui
```

## Paso 2: Instalar Dependencias

En el backend, instala el SDK de Retell.ai:

```bash
npm install retell-sdk
```

## Paso 3: Configurar el Backend

### 3.1 Crear el Endpoint de Creación de Llamadas

En tu archivo de rutas del backend (ej: `src/routes/retellRoutes.js`):

```javascript
const express = require('express')
const router = express.Router()
const { Retell } = require('retell-sdk')

const retellClient = new Retell({
  apiKey: process.env.RETELL_API_KEY,
})

// Endpoint para crear una llamada
router.post('/create-call', async (req, res) => {
  try {
    const response = await retellClient.call.createCall({
      agentId: process.env.RETELL_AGENT_ID,
      // Opcional: metadata adicional
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

module.exports = router
```

### 3.2 Configurar Webhooks (Opcional pero Recomendado)

Retell.ai puede enviar eventos a tu backend mediante webhooks:

```javascript
// Endpoint para recibir webhooks de Retell.ai
router.post('/webhook', async (req, res) => {
  const event = req.body
  
  switch (event.event) {
    case 'call_started':
      console.log('Llamada iniciada:', event.call_id)
      // Lógica cuando inicia la llamada
      break
      
    case 'call_ended':
      console.log('Llamada finalizada:', event.call_id)
      // Lógica cuando termina la llamada
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
```

**Configurar Webhook en Retell.ai Dashboard:**
1. Ve a Settings → Webhooks
2. Agrega la URL: `https://tu-dominio.com/api/retell/webhook`
3. Selecciona los eventos que quieres recibir

## Paso 4: Configurar el Frontend

### 4.1 Instalar el SDK del Cliente

```bash
npm install retell-client-js-sdk
```

### 4.2 Configurar el Servicio

El archivo `src/services/retellService.ts` ya está configurado:

```typescript
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
```

### 4.3 Usar el Componente

El componente `RetellCallButton` ya está implementado y listo para usar. Se encuentra en:
- `src/components/RetellCallButton.tsx`
- Se usa en `src/pages/IADemo.tsx`

## Paso 5: Configurar el Agente en Retell.ai

1. **Crear un Agente**:
   - Ve al dashboard de Retell.ai
   - Crea un nuevo agente
   - Configura el prompt del agente
   - Selecciona la voz y el idioma

2. **Obtener el Agent ID**:
   - Copia el Agent ID del dashboard
   - Agrégarlo a tu `.env` como `RETELL_AGENT_ID`

3. **Configurar el Prompt**:
   ```
   Eres un asistente virtual profesional y amigable. 
   Ayudas a los visitantes del portfolio a conocer los servicios disponibles.
   Responde de forma clara y concisa.
   ```

## Paso 6: Probar la Integración

1. **Iniciar el Backend**:
   ```bash
   cd portfolio/backend
   npm start
   ```

2. **Iniciar el Frontend**:
   ```bash
   cd portfolio
   npm run dev
   ```

3. **Probar la Llamada**:
   - Navega a `/ia-demo`
   - Haz clic en "TALK TO OUR AGENT"
   - Permite el acceso al micrófono
   - Habla con el agente

## Solución de Problemas

### Error: "No se recibió el token de acceso"
- Verifica que el backend esté corriendo
- Verifica que `VITE_API_URL` esté configurado correctamente
- Revisa los logs del backend para errores

### Error: "Permisos de micrófono requeridos"
- Asegúrate de permitir el acceso al micrófono en tu navegador
- En Chrome: Configuración → Privacidad → Permisos del sitio → Micrófono

### Error: "Network Error"
- Verifica la conexión a internet
- Verifica que Retell.ai esté accesible
- Revisa la consola del navegador para más detalles

### La llamada no inicia
- Verifica que el `RETELL_API_KEY` sea válido
- Verifica que el `RETELL_AGENT_ID` sea correcto
- Revisa los logs del backend

## Variables de Entorno Necesarias

### Backend (.env)
```env
RETELL_API_KEY=tu_api_key_de_retell
RETELL_AGENT_ID=tu_agent_id_de_retell
PORT=3000
NODE_ENV=production
```

### Frontend (.env)
```env
VITE_API_URL=https://tu-backend.com
```

## Estructura de Archivos

```
portfolio/
├── src/
│   ├── components/
│   │   └── RetellCallButton.tsx    # Componente del botón de llamada
│   ├── services/
│   │   └── retellService.ts        # Servicio para crear llamadas
│   └── pages/
│       └── IADemo.tsx               # Página de demo de IA
├── backend/
│   ├── src/
│   │   └── routes/
│   │       └── retellRoutes.js     # Rutas del backend
│   └── .env                         # Variables de entorno
└── CONEXION_RETELL_AI.md            # Este documento
```

## Recursos Adicionales

- [Documentación de Retell.ai](https://docs.retell.ai)
- [SDK de Retell.ai para Node.js](https://github.com/retellai/retell-sdk-nodejs)
- [SDK del Cliente Web](https://github.com/retellai/retell-client-js-sdk)

## Notas Importantes

1. **Seguridad**: Nunca expongas tu `RETELL_API_KEY` en el frontend. Siempre úsala solo en el backend.

2. **HTTPS**: Retell.ai requiere HTTPS en producción para acceder al micrófono.

3. **Límites**: Revisa los límites de tu plan de Retell.ai (llamadas por mes, duración, etc.)

4. **Costos**: Retell.ai cobra por minuto de llamada. Monitorea tu uso en el dashboard.

## Soporte

Si tienes problemas con la integración:
1. Revisa los logs del backend y frontend
2. Verifica la documentación de Retell.ai
3. Revisa la consola del navegador para errores
4. Contacta al soporte de Retell.ai si el problema persiste
