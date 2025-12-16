import { useState } from 'react'
import { motion } from 'framer-motion'
import { Link } from 'react-router-dom'

export default function DemoLanding() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    message: ''
  })
  const [submitted, setSubmitted] = useState(false)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setSubmitted(true)
    setTimeout(() => {
      setSubmitted(false)
      setFormData({ name: '', email: '', phone: '', message: '' })
    }, 3000)
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }))
  }

  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-br from-primary-600 via-primary-700 to-primary-800 text-white">
        <div className="absolute inset-0 bg-black opacity-10"></div>
        <div className="container mx-auto px-4 py-24 md:py-32 relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center max-w-4xl mx-auto"
          >
            <h1 className="text-5xl md:text-7xl font-bold mb-6 leading-tight">
              Transforma tu Negocio
              <span className="block text-primary-200 mt-2">Hoy Mismo</span>
            </h1>
            <p className="text-xl md:text-2xl mb-10 text-primary-100 max-w-2xl mx-auto">
              Soluciones digitales que aumentan tus conversiones en un 300%
              <span className="block mt-2 text-lg">Únete a más de 500 empresas exitosas</span>
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <a href="#formulario" className="btn-secondary bg-white text-primary-600 hover:bg-gray-100 text-lg px-8 py-4">
                Comenzar Ahora
              </a>
              <a href="#beneficios" className="btn-outline border-2 border-white text-white hover:bg-white hover:text-primary-600 text-lg px-8 py-4">
                Ver Beneficios
              </a>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Stats Section */}
      <section id="beneficios" className="py-16 bg-white border-y border-gray-100">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            {[
              { number: '300%', label: 'Aumento en Conversiones' },
              { number: '500+', label: 'Clientes Satisfechos' },
              { number: '24/7', label: 'Soporte Disponible' },
              { number: '98%', label: 'Tasa de Satisfacción' },
            ].map((stat, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
              >
                <div className="text-4xl md:text-5xl font-bold text-primary-600 mb-2">{stat.number}</div>
                <div className="text-gray-600">{stat.label}</div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="container mx-auto px-4 py-20">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl md:text-5xl font-bold mb-4">¿Por Qué Elegirnos?</h2>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Características que marcan la diferencia
          </p>
        </motion.div>

        <div className="grid md:grid-cols-3 gap-8">
          {[
            {
              icon: '⚡',
              title: 'Carga Ultra-Rápida',
              description: 'Optimizada para velocidad, carga en menos de 2 segundos'
            },
            {
              icon: '📱',
              title: '100% Responsive',
              description: 'Se adapta perfectamente a todos los dispositivos'
            },
            {
              icon: '📊',
              title: 'Analytics Integrado',
              description: 'Seguimiento completo de conversiones y métricas en tiempo real'
            },
          ].map((feature, index) => (
            <motion.div
              key={feature.title}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              className="text-center p-8 bg-gray-50 rounded-xl hover:shadow-lg transition-shadow"
            >
              <div className="text-5xl mb-4">{feature.icon}</div>
              <h3 className="text-2xl font-bold mb-3">{feature.title}</h3>
              <p className="text-gray-600">{feature.description}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Form Section */}
      <section id="formulario" className="bg-gradient-to-br from-primary-50 to-white py-20">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="max-w-2xl mx-auto bg-white rounded-2xl shadow-2xl p-8 md:p-12"
          >
            <h2 className="text-3xl md:text-4xl font-bold mb-4 text-center">
              Solicita tu Presupuesto Gratis
            </h2>
            <p className="text-gray-600 text-center mb-8">
              Completa el formulario y te contactaremos en menos de 24 horas
            </p>

            {submitted ? (
              <motion.div
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                className="text-center py-12"
              >
                <div className="text-6xl mb-4">✅</div>
                <h3 className="text-2xl font-bold text-green-600 mb-2">
                  ¡Formulario Enviado!
                </h3>
                <p className="text-gray-600">
                  Te contactaremos pronto
                </p>
              </motion.div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Nombre Completo
                  </label>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                    placeholder="Juan Pérez"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Email
                  </label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                    placeholder="juan@ejemplo.com"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Teléfono
                  </label>
                  <input
                    type="tel"
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                    placeholder="+34 600 000 000"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Mensaje
                  </label>
                  <textarea
                    name="message"
                    value={formData.message}
                    onChange={handleChange}
                    required
                    rows={4}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                    placeholder="Cuéntanos sobre tu proyecto..."
                  />
                </div>

                <button
                  type="submit"
                  className="w-full btn-primary py-4 text-lg font-semibold"
                >
                  Enviar Solicitud
                </button>
              </form>
            )}
          </motion.div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-gradient-to-r from-primary-600 to-primary-700 text-white py-20">
        <div className="container mx-auto px-4 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <h2 className="text-4xl md:text-5xl font-bold mb-6">
              ¿Listo para Aumentar tus Conversiones?
            </h2>
            <p className="text-xl mb-8 text-primary-100 max-w-2xl mx-auto">
              Esta landing page es una demostración de optimización para conversión
            </p>
            <Link to="/proyectos" className="inline-block bg-white text-primary-600 font-semibold px-8 py-4 rounded-lg hover:bg-gray-100 transition-colors">
              ← Volver a Proyectos
            </Link>
          </motion.div>
        </div>
      </section>
    </div>
  )
}
