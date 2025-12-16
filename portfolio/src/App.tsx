import { useEffect } from 'react'
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom'
import { ChatProvider } from './contexts/ChatContext'
import Header from './components/Header'
import ChatbotWidget from './components/ChatbotWidget'
import Home from './pages/Home'
import Servicios from './pages/Servicios'
import Proyectos from './pages/Proyectos'
import Tecnologias from './pages/Tecnologias'
import IADemo from './pages/IADemo'
import Integraciones from './pages/Integraciones'
import Contacto from './pages/Contacto'
import { trackPageView } from './utils/analytics'

function AppContent() {
  const location = useLocation()

  useEffect(() => {
    // Trackear cambio de página
    trackPageView(location.pathname)
  }, [location])

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/servicios" element={<Servicios />} />
        <Route path="/proyectos" element={<Proyectos />} />
        <Route path="/tecnologias" element={<Tecnologias />} />
        <Route path="/ia-demo" element={<IADemo />} />
        <Route path="/integraciones" element={<Integraciones />} />
        <Route path="/contacto" element={<Contacto />} />
      </Routes>
      {/* IAN está presente en todas las páginas, fuera del Router */}
      <ChatbotWidget />
    </div>
  )
}

function App() {
  return (
    <ChatProvider>
      <Router>
        <AppContent />
      </Router>
    </ChatProvider>
  )
}

export default App
