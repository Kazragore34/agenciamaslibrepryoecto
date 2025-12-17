import { motion } from 'framer-motion'
import RetellCallButton from '../components/RetellCallButton'

export default function IADemo() {
  return (
    <div className="container mx-auto px-4 py-16">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-4xl mx-auto"
      >
        <h1 className="text-4xl font-bold text-center mb-6">
          Demo de IA - Llamadas de Voz
        </h1>
        <p className="text-xl text-gray-600 text-center mb-12">
          Prueba nuestro agente de IA con llamadas de voz en tiempo real usando Retell.ai
        </p>

        <div className="card mb-8">
          <h2 className="text-2xl font-semibold mb-4">Instrucciones</h2>
          <ol className="list-decimal list-inside space-y-2 text-gray-700">
            <li>Haz clic en el botón "Test" para iniciar una llamada de prueba</li>
            <li>Permite el acceso al micrófono cuando tu navegador lo solicite</li>
            <li>Habla con el agente de IA y escucha sus respuestas</li>
            <li>La llamada se puede terminar en cualquier momento</li>
          </ol>
        </div>

        <div className="card text-center">
          <RetellCallButton />
        </div>

        <div className="mt-8 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
          <div className="flex items-start">
            <svg className="w-5 h-5 text-yellow-600 mr-2 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
            </svg>
            <p className="text-sm text-yellow-800">
              Por favor, habilita los permisos de micrófono desde la configuración de tu navegador para usar las funciones de voz.
            </p>
            <p className="text-xs text-yellow-600 mt-2">v0.2</p>
          </div>
        </div>
      </motion.div>
    </div>
  )
}
