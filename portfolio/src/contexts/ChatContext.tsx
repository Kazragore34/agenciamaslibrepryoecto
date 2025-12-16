import { createContext, useContext, useState, useEffect, ReactNode } from 'react'
import { sendMessageToIAN } from '../services/n8nService'

export interface Message {
  id: string
  text: string
  sender: 'user' | 'ian'
  timestamp: Date
}

interface ChatContextType {
  messages: Message[]
  isOpen: boolean
  isLoading: boolean
  addMessage: (text: string, sender: 'user' | 'ian') => void
  sendMessage: (text: string) => Promise<void>
  toggleChat: () => void
  clearChat: () => void
}

const ChatContext = createContext<ChatContextType | undefined>(undefined)

const STORAGE_KEY = 'ian_chat_history'
const SESSION_KEY = 'ian_session_id'

export function ChatProvider({ children }: { children: ReactNode }) {
  const [messages, setMessages] = useState<Message[]>([])
  const [isOpen, setIsOpen] = useState(false)
  const [isLoading, setIsLoading] = useState(false)

  // Cargar historial desde localStorage al montar
  useEffect(() => {
    const savedMessages = localStorage.getItem(STORAGE_KEY)
    if (savedMessages) {
      try {
        const parsed = JSON.parse(savedMessages)
        setMessages(parsed.map((msg: any) => ({
          ...msg,
          timestamp: new Date(msg.timestamp)
        })))
      } catch (error) {
        console.error('Error loading chat history:', error)
      }
    }

    // Generar o recuperar sessionId
    let sessionId = localStorage.getItem(SESSION_KEY)
    if (!sessionId) {
      sessionId = `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
      localStorage.setItem(SESSION_KEY, sessionId)
    }
  }, [])

  // Guardar mensajes en localStorage cuando cambien
  useEffect(() => {
    if (messages.length > 0) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(messages))
    }
  }, [messages])

  const addMessage = (text: string, sender: 'user' | 'ian') => {
    const newMessage: Message = {
      id: `msg_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      text,
      sender,
      timestamp: new Date(),
    }
    setMessages(prev => [...prev, newMessage])
  }

  const sendMessage = async (text: string) => {
    // Agregar mensaje del usuario
    addMessage(text, 'user')
    
    // Enviar a IAN
    setIsLoading(true)
    try {
      const response = await sendMessageToIAN(text)
      addMessage(response, 'ian')
    } catch (error) {
      console.error('Error sending message:', error)
      addMessage('Lo siento, hubo un error al procesar tu mensaje. Por favor, intenta de nuevo.', 'ian')
    } finally {
      setIsLoading(false)
    }
  }

  const toggleChat = () => {
    setIsOpen(prev => !prev)
  }

  const clearChat = () => {
    setMessages([])
    localStorage.removeItem(STORAGE_KEY)
  }

  return (
    <ChatContext.Provider
      value={{
        messages,
        isOpen,
        isLoading,
        addMessage,
        sendMessage,
        toggleChat,
        clearChat,
      }}
    >
      {children}
    </ChatContext.Provider>
  )
}

export function useChat() {
  const context = useContext(ChatContext)
  if (context === undefined) {
    throw new Error('useChat must be used within a ChatProvider')
  }
  return context
}
