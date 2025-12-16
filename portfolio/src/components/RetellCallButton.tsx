import { useState, useEffect, useRef } from 'react'
import { motion } from 'framer-motion'
import { createRetellCall } from '../services/retellService'
import { RetellWebClient } from 'retell-client-js-sdk'

export default function RetellCallButton() {
  const [isCalling, setIsCalling] = useState(false)
  const [callStatus, setCallStatus] = useState<'idle' | 'connecting' | 'connected' | 'error'>('idle')
  const [errorMessage, setErrorMessage] = useState<string>('')
  const retellClientRef = useRef<RetellWebClient | null>(null)

  useEffect(() => {
    // Limpiar al desmontar
    return () => {
      if (retellClientRef.current) {
        retellClientRef.current.stopCall()
      }
    }
  }, [])

  const handleTestCall = async () => {
    try {
      setIsCalling(true)
      setCallStatus('connecting')
      setErrorMessage('')

      // Solicitar permisos de micrófono
      try {
        const stream = await navigator.mediaDevices.getUserMedia({ audio: true })
        stream.getTracks().forEach(track => track.stop())
      } catch (micError) {
        setCallStatus('error')
        setErrorMessage('Por favor, habilita los permisos del micrófono en tu navegador.')
        setIsCalling(false)
        return
      }

      // Crear llamada a través del backend
      const accessToken = await createRetellCall()

      if (!accessToken) {
        throw new Error('No se recibió el token de acceso')
      }

      // Inicializar RetellWebClient
      const retellClient = new RetellWebClient()
      retellClientRef.current = retellClient

      // Configurar event listeners
      retellClient.on('conversation-started', () => {
        setCallStatus('connected')
        setIsCalling(false)
      })

      retellClient.on('conversation-ended', () => {
        setCallStatus('idle')
        setIsCalling(false)
        retellClientRef.current = null
      })

      retellClient.on('error', (error: any) => {
        console.error('Retell error:', error)
        setCallStatus('error')
        setErrorMessage('Error en la llamada. Por favor, intenta de nuevo.')
        setIsCalling(false)
      })

      // Iniciar la llamada
      await retellClient.startCall({
        accessToken: accessToken,
      })

    } catch (error: any) {
      console.error('Error starting call:', error)
      setCallStatus('error')
      setErrorMessage(error.message || 'Error al iniciar la llamada. Por favor, intenta de nuevo.')
      setIsCalling(false)
    }
  }

  const handleStopCall = () => {
    if (retellClientRef.current) {
      retellClientRef.current.stopCall()
      setCallStatus('idle')
      setIsCalling(false)
      retellClientRef.current = null
    }
  }

  return (
    <div className="text-center space-y-4">
      {callStatus === 'idle' && (
        <motion.button
          onClick={handleTestCall}
          disabled={isCalling}
          className="bg-black text-white px-8 py-4 rounded-lg font-semibold flex items-center space-x-2 mx-auto disabled:opacity-50 disabled:cursor-not-allowed"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
            <path d="M2 3a1 1 0 011-1h2.153a1 1 0 01.986.836l.74 4.435a1 1 0 01-.54 1.06l-1.548.773a11.037 11.037 0 006.105 6.105l.774-1.548a1 1 0 011.059-.54l4.435.74a1 1 0 01.836.986V17a1 1 0 01-1 1h-2C7.82 18 2 12.18 2 5V3z" />
          </svg>
          <span>+ TALK TO OUR AGENT</span>
        </motion.button>
      )}

      {callStatus === 'connecting' && (
        <div className="space-y-2">
          <div className="flex items-center justify-center space-x-2">
            <div className="w-2 h-2 bg-primary-600 rounded-full animate-bounce"></div>
            <div className="w-2 h-2 bg-primary-600 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
            <div className="w-2 h-2 bg-primary-600 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
          </div>
          <p className="text-gray-600">Conectando...</p>
        </div>
      )}

      {callStatus === 'connected' && (
        <div className="space-y-4">
          <div className="flex items-center justify-center space-x-2">
            <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse"></div>
            <p className="text-green-600 font-medium">Llamada en curso</p>
          </div>
          <motion.button
            onClick={handleStopCall}
            className="bg-red-600 text-white px-6 py-2 rounded-lg hover:bg-red-700 transition-colors"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            Finalizar llamada
          </motion.button>
        </div>
      )}

      {callStatus === 'error' && (
        <div className="space-y-4">
          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
            <div className="flex items-start space-x-2">
              <svg className="w-5 h-5 text-yellow-600 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
              </svg>
              <div>
                <p className="text-yellow-800 font-medium">Permisos de micrófono requeridos</p>
                <p className="text-yellow-700 text-sm mt-1">
                  {errorMessage || 'Por favor, habilita los permisos del micrófono desde la configuración de tu navegador para usar esta función.'}
                </p>
              </div>
            </div>
          </div>
          <motion.button
            onClick={handleTestCall}
            className="bg-primary-600 text-white px-6 py-2 rounded-lg hover:bg-primary-700 transition-colors"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            Intentar de nuevo
          </motion.button>
        </div>
      )}
    </div>
  )
}
