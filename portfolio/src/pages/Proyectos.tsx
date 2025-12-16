import { motion } from 'framer-motion'

const proyectos = [
  {
    title: 'E-commerce Platform',
    description: 'Plataforma completa de comercio electrónico con múltiples vendedores',
    tech: ['React', 'Node.js', 'MongoDB', 'Stripe'],
    image: '🛒',
  },
  {
    title: 'Chatbot WhatsApp',
    description: 'Bot inteligente para WhatsApp con integración n8n y respuestas automáticas',
    tech: ['Node.js', 'n8n', 'WhatsApp API'],
    image: '💬',
  },
  {
    title: 'Landing Page High Conversion',
    description: 'Página de aterrizaje optimizada que aumentó conversiones en 300%',
    tech: ['React', 'Tailwind CSS', 'GA4'],
    image: '📄',
  },
]

export default function Proyectos() {
  return (
    <div className="container mx-auto px-4 py-16">
      <motion.h1
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-4xl font-bold text-center mb-12"
      >
        Proyectos
      </motion.h1>

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
        {proyectos.map((proyecto, index) => (
          <motion.div
            key={proyecto.title}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: index * 0.1 }}
            className="card group cursor-pointer hover:scale-105 transition-transform duration-300"
          >
            <div className="text-6xl mb-4 text-center">{proyecto.image}</div>
            <h3 className="text-2xl font-semibold mb-3">{proyecto.title}</h3>
            <p className="text-gray-600 mb-4">{proyecto.description}</p>
            <div className="flex flex-wrap gap-2">
              {proyecto.tech.map((tech) => (
                <span
                  key={tech}
                  className="px-3 py-1 bg-primary-100 text-primary-700 rounded-full text-sm"
                >
                  {tech}
                </span>
              ))}
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  )
}
