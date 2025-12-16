import { useState, useRef, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Link } from 'react-router-dom'

interface Message {
  id: number
  text: string
  sender: 'user' | 'bot'
  timestamp: Date
}

const botResponses = [
  {
    keywords: ['hola', 'hi', 'buenos días', 'buenas tardes'],
    response: '¡Hola! 👋 Soy IAN, tu asistente virtual. ¿En qué puedo ayudarte hoy?'
  },
  {
    keywords: ['precio', 'costo', 'cuánto cuesta', 'tarifa'],
    response: 'Nuestros servicios tienen precios personalizados según tus necesidades. ¿Te gustaría que te envíe más información?'
  },
  {
    keywords: ['servicio', 'qué ofrecen', 'qué hacen'],
    response: 'Ofrecemos desarrollo web, e-commerce, chatbots, landing pages y más. ¿Qué te interesa?'
  },
  {
    keywords: ['contacto', 'teléfono', 'email', 'correo'],
    response: 'Puedes contactarnos a través del formulario en la página de contacto o escribirme aquí mismo. ¿Qué prefieres?'
  },
  {
    keywords: ['tiempo', 'cuánto tarda', 'duración', 'plazo'],
    response: 'Los tiempos varían según el proyecto. Una landing page puede estar lista en 1-2 semanas, mientras que un e-commerce completo puede tomar 4-8 semanas.'
  },
  {
    keywords: ['gracias', 'thank you', 'muchas gracias'],
    response: '¡De nada! 😊 Estoy aquí para ayudarte. ¿Hay algo más en lo que pueda asistirte?'
  }
]

export default function DemoChatbot() {
  useEffect(() => {
    window.scrollTo(0, 0)
  }, [])

  const [messages, setMessages] = useState<Message[]>([
    {
      id: 1,
      text: '¡Hola! 👋 Soy IAN, tu asistente virtual. ¿En qué puedo ayudarte hoy?',
      sender: 'bot',
      timestamp: new Date()
    }
  ])
  const [input, setInput] = useState('')
  const [isTyping, setIsTyping] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  const findResponse = (userMessage: string): string => {
    const lowerMessage = userMessage.toLowerCase()
    for (const response of botResponses) {
      if (response.keywords.some(keyword => lowerMessage.includes(keyword))) {
        return response.response
      }
    }
    return 'Entiendo tu consulta. Déjame conectarte con un especialista que pueda ayudarte mejor. ¿Te parece bien?'
  }

  const handleSend = () => {
    if (!input.trim()) return

    const userMessage: Message = {
      id: messages.length + 1,
      text: input,
      sender: 'user',
      timestamp: new Date()
    }

    setMessages(prev => [...prev, userMessage])
    setInput('')
    setIsTyping(true)

    // Simular respuesta del bot
    setTimeout(() => {
      const botResponse: Message = {
        id: messages.length + 2,
        text: findResponse(input),
        sender: 'bot',
        timestamp: new Date()
      }
      setMessages(prev => [...prev, botResponse])
      setIsTyping(false)
    }, 1000 + Math.random() * 1000)
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSend()
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-50 via-white to-primary-50">
      {/* Header */}
      <header className="bg-white shadow-sm sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4">
          <Link to="/" className="text-2xl font-bold text-primary-600">
            Demo Chatbot IAN
          </Link>
        </div>
      </header>

      <div className="container mx-auto px-4 py-12">
        {/* Hero Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12"
        >
          <h1 className="text-4xl md:text-5xl font-bold mb-4">
            Chatbot Inteligente Demo
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Esta es una demostración de un chatbot con integración n8n, respuestas automáticas
            inteligentes y escalamiento a agentes humanos cuando es necesario.
          </p>
        </motion.div>

        {/* Chat Container */}
        <div className="max-w-4xl mx-auto">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white rounded-2xl shadow-2xl overflow-hidden"
          >
            {/* Chat Header */}
            <div className="bg-gradient-to-r from-primary-600 to-primary-700 text-white p-6">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center text-2xl">
                  💬
                </div>
                <div>
                  <h3 className="text-xl font-bold">IAN - Asistente Virtual</h3>
                  <p className="text-primary-100 text-sm">En línea • Responde instantáneamente</p>
                </div>
              </div>
            </div>

            {/* Messages */}
            <div className="h-96 overflow-y-auto p-6 bg-gray-50 space-y-4">
              {messages.map((message) => (
                <motion.div
                  key={message.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className={`flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                  <div
                    className={`max-w-[80%] rounded-2xl px-4 py-3 ${
                      message.sender === 'user'
                        ? 'bg-primary-600 text-white'
                        : 'bg-white text-gray-800 shadow-md'
                    }`}
                  >
                    <p className="whitespace-pre-wrap">{message.text}</p>
                    <p className={`text-xs mt-1 ${
                      message.sender === 'user' ? 'text-primary-100' : 'text-gray-500'
                    }`}>
                      {message.timestamp.toLocaleTimeString('es-ES', {
                        hour: '2-digit',
                        minute: '2-digit'
                      })}
                    </p>
                  </div>
                </motion.div>
              ))}

              {isTyping && (
                <div className="flex justify-start">
                  <div className="bg-white rounded-2xl px-4 py-3 shadow-md">
                    <div className="flex gap-1">
                      <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
                      <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></div>
                      <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
                    </div>
                  </div>
                </div>
              )}

              <div ref={messagesEndRef} />
            </div>

            {/* Input Area */}
            <div className="p-4 bg-white border-t">
              <div className="flex gap-2">
                <input
                  type="text"
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyPress={handleKeyPress}
                  placeholder="Escribe tu mensaje..."
                  className="flex-1 px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                />
                <button
                  onClick={handleSend}
                  disabled={!input.trim() || isTyping}
                  className="btn-primary px-6 py-3 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Enviar
                </button>
              </div>
              <p className="text-xs text-gray-500 mt-2 text-center">
                Presiona Enter para enviar
              </p>
            </div>
          </motion.div>

          {/* Features */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
            className="mt-8 bg-white rounded-xl shadow-md p-8"
          >
            <h3 className="text-2xl font-bold mb-6 text-center">Características de esta Demo</h3>
            <div className="grid md:grid-cols-3 gap-6">
              <div className="text-center">
                <div className="text-4xl mb-2">🤖</div>
                <h4 className="font-semibold mb-2">IA Integrada</h4>
                <p className="text-sm text-gray-600">Respuestas inteligentes basadas en contexto</p>
              </div>
              <div className="text-center">
                <div className="text-4xl mb-2">🔗</div>
                <h4 className="font-semibold mb-2">Integración n8n</h4>
                <p className="text-sm text-gray-600">Automatizaciones y flujos de trabajo personalizados</p>
              </div>
              <div className="text-center">
                <div className="text-4xl mb-2">👤</div>
                <h4 className="font-semibold mb-2">Escalamiento Humano</h4>
                <p className="text-sm text-gray-600">Transferencia automática a agentes cuando es necesario</p>
              </div>
            </div>
            <Link to="/proyectos" className="block text-center mt-6 btn-secondary">
              ← Volver a Proyectos
            </Link>
          </motion.div>
        </div>
      </div>
    </div>
  )
}
