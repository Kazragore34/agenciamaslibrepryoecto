import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { useState } from 'react'

// Tecnologías principales para mostrar en el Home
const tecnologiasPrincipales = [
  { name: 'React', category: 'Frontend', logo: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/react/react-original.svg', color: 'bg-blue-50' },
  { name: 'TypeScript', category: 'Frontend', logo: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/typescript/typescript-original.svg', color: 'bg-blue-50' },
  { name: 'Tailwind CSS', category: 'Frontend', logo: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/tailwindcss/tailwindcss-plain.svg', color: 'bg-cyan-50' },
  { name: 'Node.js', category: 'Backend', logo: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/nodejs/nodejs-original.svg', color: 'bg-green-50' },
  { name: 'Express', category: 'Backend', logo: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/express/express-original.svg', color: 'bg-gray-50' },
  { name: 'MongoDB', category: 'Database', logo: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/mongodb/mongodb-original.svg', color: 'bg-green-50' },
  { name: 'Docker', category: 'DevOps', logo: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/docker/docker-original.svg', color: 'bg-blue-50' },
  { name: 'n8n', category: 'Automation', logo: 'https://avatars.githubusercontent.com/u/45487711?s=200&v=4', color: 'bg-purple-50' },
]

export default function Home() {
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null)

  return (
    <div className="min-h-screen">
      {/* Hero Section Mejorado */}
      <section className="relative overflow-hidden bg-gradient-to-br from-primary-50 via-white to-primary-50">
        <div className="container mx-auto px-4 py-24 md:py-32">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center max-w-4xl mx-auto"
          >
            <h1 className="text-5xl md:text-7xl font-bold text-gray-900 mb-6 leading-tight">
              Desarrollador Web
              <span className="block text-primary-600 mt-2">Profesional</span>
            </h1>
            <p className="text-xl md:text-2xl text-gray-600 mb-10 max-w-2xl mx-auto leading-relaxed">
              Transformo ideas en soluciones digitales modernas, escalables y con las últimas tecnologías.
              <span className="block mt-2 text-lg">E-commerce, Chatbots, Landing Pages y más.</span>
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link to="/servicios" className="btn-primary text-lg px-8 py-4">
                Ver Servicios
              </Link>
              <Link to="/proyectos" className="btn-secondary text-lg px-8 py-4">
                Ver Proyectos
              </Link>
              <Link to="/contacto" className="btn-outline text-lg px-8 py-4">
                Contactar
              </Link>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Estadísticas */}
      <section 
        data-section="estadisticas"
        className="py-16 bg-white border-y border-gray-100"
      >
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            {[
              { number: '50+', label: 'Proyectos Completados' },
              { number: '100%', label: 'Clientes Satisfechos' },
              { number: '24/7', label: 'Soporte Disponible' },
              { number: '5+', label: 'Años de Experiencia' },
            ].map((stat, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
              >
                <div className="text-4xl md:text-5xl font-bold text-primary-600 mb-2">{stat.number}</div>
                <div className="text-gray-600">{stat.label}</div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Servicios Destacados Mejorados con Hovers */}
      <section className="container mx-auto px-4 py-20">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl md:text-5xl font-bold mb-4">Servicios Principales</h2>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Soluciones completas para hacer crecer tu negocio digital
          </p>
        </motion.div>

        <div className="grid md:grid-cols-3 gap-8">
          {[
            { 
              title: 'E-commerce', 
              desc: 'Tiendas online completas y funcionales con pasarelas de pago integradas, gestión de inventario y panel administrativo.',
              icon: '🛒',
              link: '/demo/ecommerce',
              color: 'from-blue-500 to-blue-600',
              features: ['Carrito de compras', 'Pasarelas de pago', 'Panel admin', 'Gestión de inventario']
            },
            { 
              title: 'Chatbots IA', 
              desc: 'Asistentes inteligentes para WhatsApp y web con integración n8n, respuestas automáticas y atención 24/7.',
              icon: '💬',
              link: '/demo/chatbot',
              color: 'from-green-500 to-green-600',
              features: ['WhatsApp Business', 'IA conversacional', 'Automatización', 'Multi-canal']
            },
            { 
              title: 'Integraciones API', 
              desc: 'Conexión profesional con APIs externas para potenciar tu negocio y automatizar procesos.',
              icon: '🔌',
              link: '/integraciones',
              color: 'from-purple-500 to-purple-600',
              features: ['APIs RESTful', 'Webhooks', 'Autenticación segura', 'Datos en tiempo real']
            },
          ].map((service, index) => (
            <motion.div
              key={service.title}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              className="group"
            >
              <Link to={service.link || '#'}>
                <div className="card h-full hover:shadow-2xl transition-all duration-300 hover:-translate-y-2 border-2 border-transparent hover:border-primary-200">
                  <div className={`w-16 h-16 rounded-xl bg-gradient-to-br ${service.color} flex items-center justify-center text-3xl mb-6 group-hover:scale-110 group-hover:rotate-3 transition-all duration-300`}>
                    {service.icon}
                  </div>
                  <h3 className="text-2xl font-bold mb-3 group-hover:text-primary-600 transition-colors">
                    {service.title}
                  </h3>
                  <p className="text-gray-600 leading-relaxed mb-4">{service.desc}</p>
                  <ul className="space-y-2 mb-6">
                    {service.features?.map((feature, idx) => (
                      <li key={idx} className="flex items-center text-sm text-gray-600">
                        <svg className="w-4 h-4 text-primary-600 mr-2" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                        </svg>
                        {feature}
                      </li>
                    ))}
                  </ul>
                  <div className="mt-6 text-primary-600 font-semibold group-hover:translate-x-2 transition-transform inline-flex items-center">
                    Ver Demo
                    <svg className="w-5 h-5 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </div>
                </div>
              </Link>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Stack Tecnológico Integrado */}
      <section className="bg-gray-50 py-20">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <h2 className="text-4xl md:text-5xl font-bold mb-4">Stack Tecnológico</h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Tecnologías modernas y probadas que uso para crear soluciones de alta calidad
            </p>
          </motion.div>

          <div className="flex flex-wrap justify-center gap-3 mb-8">
            {Array.from(new Set(tecnologiasPrincipales.map(t => t.category))).map((category) => (
              <button
                key={category}
                onClick={() => setSelectedCategory(selectedCategory === category ? null : category)}
                className={`px-4 py-2 rounded-full font-medium transition-all duration-300 ${
                  selectedCategory === category
                    ? 'bg-primary-600 text-white shadow-lg scale-105'
                    : 'bg-white text-primary-700 hover:bg-primary-100'
                }`}
              >
                {category}
              </button>
            ))}
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-8 gap-6">
            {tecnologiasPrincipales
              .filter(tech => !selectedCategory || tech.category === selectedCategory)
              .map((tech, index) => (
                <motion.div
                  key={tech.name}
                  initial={{ opacity: 0, scale: 0.9 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.3, delay: index * 0.05 }}
                  whileHover={{ scale: 1.15, y: -5 }}
                  className="group"
                >
                  <div className={`card h-full ${tech.color} hover:shadow-xl transition-all duration-300 cursor-pointer flex flex-col items-center justify-center p-4 border-2 border-transparent hover:border-primary-300`}>
                    <div className="w-12 h-12 mb-3 flex items-center justify-center bg-white rounded-lg p-2 group-hover:scale-110 group-hover:rotate-6 transition-all duration-300">
                      <img
                        src={tech.logo}
                        alt={tech.name}
                        className="w-full h-full object-contain"
                        onError={(e) => {
                          const target = e.target as HTMLImageElement
                          target.style.display = 'none'
                          const parent = target.parentElement
                          if (parent) {
                            parent.innerHTML = `<div class="text-2xl font-bold text-gray-600">${tech.name.charAt(0)}</div>`
                          }
                        }}
                      />
                    </div>
                    <p className="font-semibold text-center text-sm text-gray-800 group-hover:text-primary-600 transition-colors">
                      {tech.name}
                    </p>
                  </div>
                </motion.div>
              ))}
          </div>

          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="text-center mt-12"
          >
            <Link to="/tecnologias" className="text-primary-600 font-semibold hover:text-primary-700 inline-flex items-center">
              Ver todas las tecnologías
              <svg className="w-5 h-5 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </Link>
          </motion.div>
        </div>
      </section>

      {/* Sección: Por qué elegirme */}
      <section className="container mx-auto px-4 py-20">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl md:text-5xl font-bold mb-4">¿Por qué elegirme?</h2>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Más que código, ofrezco soluciones que impulsan tu negocio
          </p>
        </motion.div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {[
            {
              icon: '⚡',
              title: 'Rendimiento Optimizado',
              desc: 'Código limpio y eficiente que garantiza velocidad y escalabilidad para tu proyecto.',
              color: 'from-yellow-400 to-orange-500'
            },
            {
              icon: '🔒',
              title: 'Seguridad Primero',
              desc: 'Implementación de mejores prácticas de seguridad para proteger tu negocio y datos.',
              color: 'from-red-400 to-pink-500'
            },
            {
              icon: '📈',
              title: 'Enfoque en Resultados',
              desc: 'No solo desarrollo, también te ayudo a alcanzar tus objetivos de negocio.',
              color: 'from-green-400 to-emerald-500'
            },
            {
              icon: '💬',
              title: 'Comunicación Clara',
              desc: 'Mantengo comunicación constante y transparente durante todo el proyecto.',
              color: 'from-blue-400 to-cyan-500'
            },
            {
              icon: '🎯',
              title: 'Solución a Medida',
              desc: 'Cada proyecto es único. Desarrollo soluciones personalizadas para tus necesidades.',
              color: 'from-purple-400 to-indigo-500'
            },
            {
              icon: '🚀',
              title: 'Entrega Rápida',
              desc: 'Metodologías ágiles que permiten ver resultados desde las primeras semanas.',
              color: 'from-pink-400 to-rose-500'
            },
          ].map((item, index) => (
            <motion.div
              key={item.title}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              whileHover={{ scale: 1.05, y: -5 }}
              className="group"
            >
              <div className="card h-full hover:shadow-2xl transition-all duration-300 border-2 border-transparent hover:border-primary-200">
                <div className={`w-16 h-16 rounded-xl bg-gradient-to-br ${item.color} flex items-center justify-center text-3xl mb-6 group-hover:scale-110 group-hover:rotate-3 transition-all duration-300`}>
                  {item.icon}
                </div>
                <h3 className="text-xl font-bold mb-3 group-hover:text-primary-600 transition-colors">
                  {item.title}
                </h3>
                <p className="text-gray-600 leading-relaxed">{item.desc}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Proceso de Trabajo */}
      <section className="bg-gradient-to-br from-primary-50 to-white py-20">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl md:text-5xl font-bold mb-4">Cómo Trabajamos</h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Un proceso claro y estructurado desde la idea hasta el lanzamiento
            </p>
          </motion.div>

          <div className="max-w-4xl mx-auto">
            {[
              { step: '01', title: 'Consulta Inicial', desc: 'Analizamos tus necesidades y objetivos para entender qué necesitas exactamente.' },
              { step: '02', title: 'Propuesta Personalizada', desc: 'Te presento una solución detallada con tiempos, costos y tecnologías a utilizar.' },
              { step: '03', title: 'Desarrollo Ágil', desc: 'Trabajamos en sprints con entregas parciales para que veas el progreso constantemente.' },
              { step: '04', title: 'Pruebas y Ajustes', desc: 'Realizamos pruebas exhaustivas y ajustamos según tu feedback antes del lanzamiento.' },
              { step: '05', title: 'Lanzamiento y Soporte', desc: 'Desplegamos tu proyecto y te brindo soporte continuo para asegurar su éxito.' },
            ].map((phase, index) => (
              <motion.div
                key={phase.step}
                initial={{ opacity: 0, x: index % 2 === 0 ? -50 : 50 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                className="flex items-start gap-6 mb-8 last:mb-0"
              >
                <div className="flex-shrink-0 w-16 h-16 bg-primary-600 text-white rounded-full flex items-center justify-center font-bold text-xl">
                  {phase.step}
                </div>
                <div className="flex-1">
                  <h3 className="text-2xl font-bold mb-2">{phase.title}</h3>
                  <p className="text-gray-600 leading-relaxed">{phase.desc}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section 
        data-section="cta"
        className="bg-gradient-to-r from-primary-600 to-primary-700 text-white py-20"
      >
        <div className="container mx-auto px-4 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <h2 className="text-4xl md:text-5xl font-bold mb-6">
              ¿Listo para llevar tu negocio al siguiente nivel?
            </h2>
            <p className="text-xl mb-8 text-primary-100 max-w-2xl mx-auto">
              Trabajemos juntos para crear la solución digital perfecta para tu empresa
            </p>
            <Link to="/contacto" className="inline-block bg-white text-primary-600 font-semibold px-8 py-4 rounded-lg hover:bg-gray-100 transition-colors">
              Comenzar Proyecto
            </Link>
          </motion.div>
        </div>
      </section>
    </div>
  )
}
