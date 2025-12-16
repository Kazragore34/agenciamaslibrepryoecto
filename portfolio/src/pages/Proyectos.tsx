import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

interface Proyecto {
  title: string
  description: string
  fullDescription: string
  tech: string[]
  image: string
  features: string[]
  results?: string
  demoUrl?: string
}

const proyectos: Proyecto[] = [
  {
    title: 'E-commerce Platform',
    description: 'Plataforma completa de comercio electrónico con múltiples vendedores',
    fullDescription: 'Desarrollo de una plataforma completa de e-commerce con sistema multi-vendedor, gestión de inventario en tiempo real, pasarelas de pago integradas (Stripe, PayPal), sistema de reviews y ratings, y panel de administración completo.',
    tech: ['React', 'Node.js', 'MongoDB', 'Stripe'],
    image: '🛒',
    features: [
      'Carrito de compras avanzado',
      'Sistema de pagos múltiples',
      'Gestión de inventario automática',
      'Panel de administración completo',
      'Sistema de reviews y ratings',
      'Multi-vendedor'
    ],
    results: 'Aumento del 250% en ventas online en los primeros 6 meses',
    demoUrl: '#'
  },
  {
    title: 'Chatbot WhatsApp',
    description: 'Bot inteligente para WhatsApp con integración n8n y respuestas automáticas',
    fullDescription: 'Chatbot inteligente para WhatsApp Business con integración completa a n8n para automatizaciones, respuestas contextuales usando IA, gestión de leads automática, y sistema de tickets para escalamiento a humanos.',
    tech: ['Node.js', 'n8n', 'WhatsApp API', 'OpenAI'],
    image: '💬',
    features: [
      'Respuestas automáticas inteligentes',
      'Integración completa con n8n',
      'Gestión automática de leads',
      'Escalamiento a agentes humanos',
      'Análisis de conversaciones',
      'Multi-idioma'
    ],
    results: 'Reducción del 70% en tiempo de respuesta y aumento del 40% en conversiones',
    demoUrl: '#'
  },
  {
    title: 'Landing Page High Conversion',
    description: 'Página de aterrizaje optimizada que aumentó conversiones en 300%',
    fullDescription: 'Landing page completamente optimizada para conversión con A/B testing integrado, formularios inteligentes, integración con Google Analytics 4, y diseño responsive que se adapta perfectamente a todos los dispositivos.',
    tech: ['React', 'Tailwind CSS', 'GA4', 'Vite'],
    image: '📄',
    features: [
      'Optimización SEO avanzada',
      'A/B Testing integrado',
      'Formularios inteligentes',
      'Analytics en tiempo real',
      'Diseño 100% responsive',
      'Carga ultra-rápida'
    ],
    results: 'Aumento del 300% en conversiones y reducción del 50% en tasa de rebote',
    demoUrl: '#'
  },
]

export default function Proyectos() {
  const [selectedProyecto, setSelectedProyecto] = useState<Proyecto | null>(null)

  return (
    <div className="container mx-auto px-4 py-16">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center mb-16"
      >
        <h1 className="text-4xl md:text-5xl font-bold mb-4">Proyectos Destacados</h1>
        <p className="text-xl text-gray-600 max-w-2xl mx-auto">
          Soluciones reales que han transformado negocios y generado resultados medibles
        </p>
      </motion.div>

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
        {proyectos.map((proyecto, index) => (
          <motion.div
            key={proyecto.title}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: index * 0.1 }}
            className="card group cursor-pointer hover:shadow-2xl transition-all duration-300 hover:-translate-y-2"
            onClick={() => setSelectedProyecto(proyecto)}
          >
            <div className="text-6xl mb-6 text-center group-hover:scale-110 transition-transform">
              {proyecto.image}
            </div>
            <h3 className="text-2xl font-bold mb-3 group-hover:text-primary-600 transition-colors">
              {proyecto.title}
            </h3>
            <p className="text-gray-600 mb-4">{proyecto.description}</p>
            <div className="flex flex-wrap gap-2 mb-4">
              {proyecto.tech.map((tech) => (
                <span
                  key={tech}
                  className="px-3 py-1 bg-primary-100 text-primary-700 rounded-full text-sm font-medium"
                >
                  {tech}
                </span>
              ))}
            </div>
            <div className="text-primary-600 font-semibold group-hover:translate-x-2 transition-transform inline-flex items-center">
              Ver detalles
              <svg className="w-5 h-5 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Modal de Detalles */}
      <AnimatePresence>
        {selectedProyecto && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4"
            onClick={() => setSelectedProyecto(null)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-white rounded-2xl max-w-3xl w-full max-h-[90vh] overflow-y-auto"
            >
              <div className="p-8">
                <div className="flex justify-between items-start mb-6">
                  <div>
                    <div className="text-6xl mb-4">{selectedProyecto.image}</div>
                    <h2 className="text-3xl font-bold mb-2">{selectedProyecto.title}</h2>
                    <p className="text-gray-600 text-lg">{selectedProyecto.description}</p>
                  </div>
                  <button
                    onClick={() => setSelectedProyecto(null)}
                    className="text-gray-400 hover:text-gray-600 text-3xl"
                  >
                    ×
                  </button>
                </div>

                <div className="mb-6">
                  <h3 className="text-xl font-semibold mb-3">Descripción Completa</h3>
                  <p className="text-gray-700 leading-relaxed">{selectedProyecto.fullDescription}</p>
                </div>

                <div className="mb-6">
                  <h3 className="text-xl font-semibold mb-3">Características Principales</h3>
                  <ul className="grid md:grid-cols-2 gap-2">
                    {selectedProyecto.features.map((feature, idx) => (
                      <li key={idx} className="flex items-center text-gray-700">
                        <svg className="w-5 h-5 text-primary-600 mr-2" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                        </svg>
                        {feature}
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="mb-6">
                  <h3 className="text-xl font-semibold mb-3">Tecnologías Utilizadas</h3>
                  <div className="flex flex-wrap gap-2">
                    {selectedProyecto.tech.map((tech) => (
                      <span
                        key={tech}
                        className="px-4 py-2 bg-primary-100 text-primary-700 rounded-lg font-medium"
                      >
                        {tech}
                      </span>
                    ))}
                  </div>
                </div>

                {selectedProyecto.results && (
                  <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-lg">
                    <h3 className="text-xl font-semibold mb-2 text-green-800">Resultados</h3>
                    <p className="text-green-700">{selectedProyecto.results}</p>
                  </div>
                )}

                <div className="flex gap-4">
                  {selectedProyecto.demoUrl && (
                    <a
                      href={selectedProyecto.demoUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="btn-primary"
                    >
                      Ver Demo
                    </a>
                  )}
                  <button
                    onClick={() => setSelectedProyecto(null)}
                    className="btn-secondary"
                  >
                    Cerrar
                  </button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
