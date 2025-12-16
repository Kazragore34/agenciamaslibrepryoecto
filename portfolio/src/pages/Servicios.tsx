import { motion } from 'framer-motion'

const servicios = [
  {
    title: 'E-commerce',
    description: 'Tiendas online completas con carrito de compras, pasarelas de pago, gestión de inventario y más.',
    icon: '🛒',
    features: ['Carrito de compras', 'Pasarelas de pago', 'Gestión de inventario', 'Panel de administración'],
  },
  {
    title: 'Chatbots',
    description: 'Asistentes de IA conversacionales para WhatsApp y web, con integración n8n para automatizaciones.',
    icon: '💬',
    features: ['WhatsApp Business', 'Chat web', 'Integración n8n', 'Respuestas inteligentes'],
  },
  {
    title: 'Landing Pages',
    description: 'Páginas de alta conversión optimizadas para SEO y diseñadas para convertir visitantes en clientes.',
    icon: '📄',
    features: ['Diseño responsive', 'Optimización SEO', 'Formularios de contacto', 'Analytics integrado'],
  },
  {
    title: 'Plataformas con Login',
    description: 'Sistemas con autenticación segura, gestión de usuarios y áreas privadas personalizadas.',
    icon: '🔐',
    features: ['Autenticación JWT', 'Gestión de usuarios', 'Áreas privadas', 'Roles y permisos'],
  },
  {
    title: 'Gestión de Correo Automatizada',
    description: 'Automatización de emails con n8n, workflows personalizados y seguimiento de leads.',
    icon: '📧',
    features: ['Automatización n8n', 'Workflows personalizados', 'Seguimiento de leads', 'Templates personalizados'],
  },
  {
    title: 'Lead Scoring Predictivo',
    description: 'Sistema inteligente para calificar y priorizar leads basado en su comportamiento e interacciones.',
    icon: '📊',
    features: ['Análisis de comportamiento', 'Scoring automático', 'Priorización de leads', 'Reportes detallados'],
  },
  {
    title: 'Análisis de Seguimiento',
    description: 'Google Analytics 4 integrado con eventos personalizados y automatizaciones con n8n.',
    icon: '📈',
    features: ['Google Analytics 4', 'Eventos personalizados', 'Automatizaciones n8n', 'Dashboards personalizados'],
  },
]

export default function Servicios() {
  return (
    <div className="container mx-auto px-4 py-16">
      <motion.h1
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-4xl font-bold text-center mb-12"
      >
        Servicios
      </motion.h1>

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
        {servicios.map((servicio, index) => (
          <motion.div
            key={servicio.title}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: index * 0.1 }}
            className="card group hover:scale-105 transition-transform duration-300"
          >
            <div className="text-4xl mb-4">{servicio.icon}</div>
            <h3 className="text-2xl font-semibold mb-3">{servicio.title}</h3>
            <p className="text-gray-600 mb-4">{servicio.description}</p>
            <ul className="space-y-2">
              {servicio.features.map((feature) => (
                <li key={feature} className="flex items-center text-sm text-gray-700">
                  <svg className="w-4 h-4 text-primary-600 mr-2" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                  {feature}
                </li>
              ))}
            </ul>
          </motion.div>
        ))}
      </div>
    </div>
  )
}
