import { motion, AnimatePresence } from 'framer-motion'
import { Link } from 'react-router-dom'
import { useState } from 'react'

const servicios = [
  {
    title: 'E-commerce',
    description: 'Tiendas online completas con carrito de compras, pasarelas de pago, gestión de inventario y más.',
    icon: '🛒',
    features: ['Carrito de compras', 'Pasarelas de pago', 'Gestión de inventario', 'Panel de administración'],
    color: 'from-blue-500 to-blue-600',
    link: '/proyectos',
  },
  {
    title: 'Chatbots',
    description: 'Asistentes de IA conversacionales para WhatsApp y web, con integración n8n para automatizaciones.',
    icon: '💬',
    features: ['WhatsApp Business', 'Chat web', 'Integración n8n', 'Respuestas inteligentes'],
    color: 'from-green-500 to-green-600',
    link: '/ia-demo',
  },
  {
    title: 'Landing Pages',
    description: 'Páginas de alta conversión optimizadas para SEO y diseñadas para convertir visitantes en clientes.',
    icon: '📄',
    features: ['Diseño responsive', 'Optimización SEO', 'Formularios de contacto', 'Analytics integrado'],
    color: 'from-purple-500 to-purple-600',
    link: '/proyectos',
  },
  {
    title: 'Plataformas con Login',
    description: 'Sistemas con autenticación segura, gestión de usuarios y áreas privadas personalizadas.',
    icon: '🔐',
    features: ['Autenticación JWT', 'Gestión de usuarios', 'Áreas privadas', 'Roles y permisos'],
    color: 'from-indigo-500 to-indigo-600',
    link: '/servicios',
  },
  {
    title: 'Gestión de Correo Automatizada',
    description: 'Automatización de emails con n8n, workflows personalizados y seguimiento de leads.',
    icon: '📧',
    features: ['Automatización n8n', 'Workflows personalizados', 'Seguimiento de leads', 'Templates personalizados'],
    color: 'from-pink-500 to-pink-600',
    link: '/servicios',
  },
  {
    title: 'Lead Scoring Predictivo',
    description: 'Sistema inteligente para calificar y priorizar leads basado en su comportamiento e interacciones.',
    icon: '📊',
    features: ['Análisis de comportamiento', 'Scoring automático', 'Priorización de leads', 'Reportes detallados'],
    color: 'from-orange-500 to-orange-600',
    link: '/servicios',
  },
  {
    title: 'Análisis de Seguimiento',
    description: 'Google Analytics 4 integrado con eventos personalizados y automatizaciones con n8n.',
    icon: '📈',
    features: ['Google Analytics 4', 'Eventos personalizados', 'Automatizaciones n8n', 'Dashboards personalizados'],
    color: 'from-teal-500 to-teal-600',
    link: '/servicios',
  },
]

export default function Servicios() {
  const [selectedService, setSelectedService] = useState<string | null>(null)

  const serviceDetails: Record<string, { title: string; description: string; features: string[]; image: string }> = {
    'Plataformas con Login': {
      title: 'Plataformas con Login',
      description: 'Sistemas completos de autenticación y autorización con gestión de usuarios, roles y permisos. Implementación de JWT, OAuth 2.0, y áreas privadas personalizadas.',
      features: [
        'Autenticación JWT segura',
        'Gestión completa de usuarios',
        'Áreas privadas personalizadas',
        'Sistema de roles y permisos',
        'Recuperación de contraseña',
        'Verificación de email',
        'Sesiones persistentes',
        'Protección de rutas'
      ],
      image: 'https://images.unsplash.com/photo-1563013544-824ae1b704d3?w=800&h=600&fit=crop'
    },
    'Gestión de Correo Automatizada': {
      title: 'Gestión de Correo Automatizada',
      description: 'Automatización completa de emails con n8n, workflows personalizados, seguimiento de leads y templates personalizados. Integración con múltiples proveedores de email.',
      features: [
        'Automatización con n8n',
        'Workflows personalizados',
        'Seguimiento de leads',
        'Templates personalizados',
        'Programación de emails',
        'A/B testing de emails',
        'Analytics de apertura',
        'Integración multi-proveedor'
      ],
      image: 'https://images.unsplash.com/photo-1498050108023-c5249f4df085?w=800&h=600&fit=crop'
    },
    'Lead Scoring Predictivo': {
      title: 'Lead Scoring Predictivo',
      description: 'Sistema inteligente para calificar y priorizar leads basado en su comportamiento, interacciones y datos demográficos. Machine Learning para predicción precisa.',
      features: [
        'Análisis de comportamiento',
        'Scoring automático',
        'Priorización de leads',
        'Reportes detallados',
        'Machine Learning integrado',
        'Segmentación inteligente',
        'Alertas automáticas',
        'Integración CRM'
      ],
      image: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=800&h=600&fit=crop'
    },
    'Análisis de Seguimiento': {
      title: 'Análisis de Seguimiento',
      description: 'Google Analytics 4 integrado con eventos personalizados, automatizaciones con n8n y dashboards personalizados. Tracking completo del comportamiento del usuario.',
      features: [
        'Google Analytics 4',
        'Eventos personalizados',
        'Automatizaciones n8n',
        'Dashboards personalizados',
        'Tracking de conversiones',
        'Análisis de embudo',
        'Reportes automáticos',
        'Integración con herramientas'
      ],
      image: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=800&h=600&fit=crop'
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-white">
      <div className="container mx-auto px-4 py-16">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-16"
        >
          <h1 className="text-4xl md:text-5xl font-bold mb-4">Servicios</h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Soluciones completas y personalizadas para hacer crecer tu negocio digital
          </p>
        </motion.div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {servicios.map((servicio, index) => (
            <motion.div
              key={servicio.title}
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              className="group"
            >
              {serviceDetails[servicio.title] ? (
                <div 
                  onClick={() => setSelectedService(servicio.title)}
                  className="card h-full hover:shadow-2xl transition-all duration-300 hover:-translate-y-2 cursor-pointer"
                >
              ) : (
                <Link to={servicio.link}>
                  <div className="card h-full hover:shadow-2xl transition-all duration-300 hover:-translate-y-2">
              )}
                  <div className={`w-20 h-20 rounded-xl bg-gradient-to-br ${servicio.color} flex items-center justify-center text-4xl mb-6 group-hover:scale-110 transition-transform shadow-lg`}>
                    {servicio.icon}
                  </div>
                  
                  <h3 className="text-2xl font-bold mb-3 group-hover:text-slate-700 transition-colors">
                    {servicio.title}
                  </h3>
                  
                  <p className="text-gray-600 mb-6 leading-relaxed">
                    {servicio.description}
                  </p>
                  
                  <div className="space-y-3 mb-6">
                    {servicio.features.map((feature, idx) => (
                      <div key={idx} className="flex items-center text-sm text-gray-700">
                        <svg className="w-5 h-5 text-slate-700 mr-3 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                        </svg>
                        <span>{feature}</span>
                      </div>
                    ))}
                  </div>
                  
                  <div className="text-slate-700 font-semibold group-hover:translate-x-2 transition-transform inline-flex items-center">
                    Saber más
                    <svg className="w-5 h-5 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </div>
                </div>
              {serviceDetails[servicio.title] ? null : </Link>}
            </motion.div>
          ))}
        </div>

        {/* Modal de Detalles del Servicio */}
        <AnimatePresence>
          {selectedService && serviceDetails[selectedService] && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setSelectedService(null)}
              className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4"
            >
              <motion.div
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.9, opacity: 0 }}
                onClick={(e) => e.stopPropagation()}
                className="bg-white rounded-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto"
              >
                <div className="relative">
                  <div className="w-full h-64 bg-gray-100 overflow-hidden">
                    <img 
                      src={serviceDetails[selectedService].image} 
                      alt={serviceDetails[selectedService].title}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <button
                    onClick={() => setSelectedService(null)}
                    className="absolute top-4 right-4 w-10 h-10 bg-white rounded-full flex items-center justify-center text-gray-600 hover:text-gray-800 shadow-lg"
                  >
                    ×
                  </button>
                </div>
                
                <div className="p-8">
                  <h2 className="text-3xl font-bold mb-4">{serviceDetails[selectedService].title}</h2>
                  <p className="text-gray-700 text-lg leading-relaxed mb-6">
                    {serviceDetails[selectedService].description}
                  </p>
                  
                  <h3 className="text-xl font-semibold mb-4">Características Principales</h3>
                  <div className="grid md:grid-cols-2 gap-3">
                    {serviceDetails[selectedService].features.map((feature, idx) => (
                      <div key={idx} className="flex items-center text-gray-700">
                        <svg className="w-5 h-5 text-slate-700 mr-3 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                        </svg>
                        <span>{feature}</span>
                      </div>
                    ))}
                  </div>
                  
                  <div className="mt-8 flex gap-4">
                    <Link
                      to="/contacto"
                      onClick={() => setSelectedService(null)}
                      className="btn-primary"
                    >
                      Solicitar Información
                    </Link>
                    <button
                      onClick={() => setSelectedService(null)}
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

        {/* CTA Section */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mt-20 card bg-gradient-to-r from-primary-600 to-primary-700 text-white text-center"
        >
          <h2 className="text-3xl font-bold mb-4">¿Necesitas algo personalizado?</h2>
          <p className="text-xl text-gray-200 mb-8 max-w-2xl mx-auto">
            Cada proyecto es único. Hablemos sobre tus necesidades específicas y creemos la solución perfecta para ti.
          </p>
          <Link to="/contacto" className="inline-block bg-white text-slate-700 font-semibold px-8 py-4 rounded-lg hover:bg-gray-100 transition-colors">
            Contactar Ahora
          </Link>
        </motion.div>
      </div>
    </div>
  )
}
