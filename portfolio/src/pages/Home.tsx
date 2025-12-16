import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'

export default function Home() {
  return (
    <div>
      {/* Hero Section */}
      <section className="container mx-auto px-4 py-20 text-center">
        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-5xl md:text-6xl font-bold text-gray-900 mb-6"
        >
          Desarrollador Web
          <span className="text-primary-600"> Profesional</span>
        </motion.h1>
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto"
        >
          Creo soluciones web modernas, escalables y con las últimas tecnologías.
          E-commerce, Chatbots, Landing Pages y más.
        </motion.p>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="flex flex-col sm:flex-row gap-4 justify-center"
        >
          <Link to="/servicios" className="btn-primary">
            Ver Servicios
          </Link>
          <Link to="/contacto" className="btn-secondary">
            Contactar
          </Link>
        </motion.div>
      </section>

      {/* Servicios Destacados */}
      <section className="container mx-auto px-4 py-16">
        <h2 className="text-3xl font-bold text-center mb-12">Servicios Principales</h2>
        <div className="grid md:grid-cols-3 gap-8">
          {[
            { title: 'E-commerce', desc: 'Tiendas online completas y funcionales', link: '/servicios' },
            { title: 'Chatbots', desc: 'IA conversacional para WhatsApp y web', link: '/ia-demo' },
            { title: 'Integraciones API', desc: 'Conexión con APIs externas profesionales', link: '/integraciones' },
          ].map((service, index) => (
            <motion.div
              key={service.title}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              className="card cursor-pointer"
            >
              <Link to={service.link || '#'}>
                <h3 className="text-xl font-semibold mb-2 hover:text-primary-600 transition-colors">{service.title}</h3>
                <p className="text-gray-600">{service.desc}</p>
              </Link>
            </motion.div>
          ))}
        </div>
      </section>
    </div>
  )
}
