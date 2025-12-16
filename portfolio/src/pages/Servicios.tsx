import { motion } from 'framer-motion'
import { Link } from 'react-router-dom'

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
              <Link to={servicio.link}>
                <div className="card h-full hover:shadow-2xl transition-all duration-300 hover:-translate-y-2">
                  <div className={`w-20 h-20 rounded-xl bg-gradient-to-br ${servicio.color} flex items-center justify-center text-4xl mb-6 group-hover:scale-110 transition-transform shadow-lg`}>
                    {servicio.icon}
                  </div>
                  
                  <h3 className="text-2xl font-bold mb-3 group-hover:text-primary-600 transition-colors">
                    {servicio.title}
                  </h3>
                  
                  <p className="text-gray-600 mb-6 leading-relaxed">
                    {servicio.description}
                  </p>
                  
                  <div className="space-y-3 mb-6">
                    {servicio.features.map((feature, idx) => (
                      <div key={idx} className="flex items-center text-sm text-gray-700">
                        <svg className="w-5 h-5 text-primary-600 mr-3 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                        </svg>
                        <span>{feature}</span>
                      </div>
                    ))}
                  </div>
                  
                  <div className="text-primary-600 font-semibold group-hover:translate-x-2 transition-transform inline-flex items-center">
                    Saber más
                    <svg className="w-5 h-5 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </div>
                </div>
              </Link>
            </motion.div>
          ))}
        </div>

        {/* CTA Section */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mt-20 card bg-gradient-to-r from-primary-600 to-primary-700 text-white text-center"
        >
          <h2 className="text-3xl font-bold mb-4">¿Necesitas algo personalizado?</h2>
          <p className="text-xl text-primary-100 mb-8 max-w-2xl mx-auto">
            Cada proyecto es único. Hablemos sobre tus necesidades específicas y creemos la solución perfecta para ti.
          </p>
          <Link to="/contacto" className="inline-block bg-white text-primary-600 font-semibold px-8 py-4 rounded-lg hover:bg-gray-100 transition-colors">
            Contactar Ahora
          </Link>
        </motion.div>
      </div>
    </div>
  )
}
