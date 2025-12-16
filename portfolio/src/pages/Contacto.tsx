import { useState } from 'react'
import { motion } from 'framer-motion'

export default function Contacto() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    company: '',
    message: '',
    projectType: '',
  })
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitStatus, setSubmitStatus] = useState<'idle' | 'success' | 'error'>('idle')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)
    setSubmitStatus('idle')

    // Simular envío (aquí iría la llamada real al backend)
    setTimeout(() => {
      setIsSubmitting(false)
      setSubmitStatus('success')
      setFormData({ name: '', email: '', phone: '', company: '', message: '', projectType: '' })
    }, 1500)
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-white">
      <div className="container mx-auto px-4 py-16">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="max-w-6xl mx-auto"
        >
          {/* Header */}
          <div className="text-center mb-12">
            <h1 className="text-4xl md:text-5xl font-bold mb-4">Hablemos de tu Proyecto</h1>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Estoy listo para ayudarte a hacer realidad tu idea. Cuéntame sobre tu proyecto y te responderé lo antes posible.
            </p>
          </div>

          <div className="grid lg:grid-cols-3 gap-8">
            {/* Información de Contacto */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2 }}
              className="space-y-6"
            >
              <div className="card bg-gradient-to-br from-primary-600 to-primary-700 text-white">
                <h2 className="text-2xl font-bold mb-6">Información de Contacto</h2>
                
                <div className="space-y-4">
                  {[
                    { icon: '📧', label: 'Email', value: 'contacto@ejemplo.com', link: 'mailto:contacto@ejemplo.com' },
                    { icon: '📱', label: 'WhatsApp', value: '+34 600 000 000', link: 'https://wa.me/34600000000' },
                    { icon: '💼', label: 'LinkedIn', value: 'linkedin.com/in/tu-perfil', link: 'https://linkedin.com' },
                  ].map((contact, idx) => (
                    <a
                      key={idx}
                      href={contact.link}
                      target={contact.link.startsWith('http') ? '_blank' : undefined}
                      rel={contact.link.startsWith('http') ? 'noopener noreferrer' : undefined}
                      className="flex items-center p-4 bg-white bg-opacity-10 rounded-lg hover:bg-opacity-20 transition-all group"
                    >
                      <span className="text-3xl mr-4">{contact.icon}</span>
                      <div>
                        <div className="text-sm text-primary-100">{contact.label}</div>
                        <div className="font-semibold group-hover:translate-x-1 transition-transform">
                          {contact.value}
                        </div>
                      </div>
                    </a>
                  ))}
                </div>
              </div>

              <div className="card bg-white">
                <h3 className="font-bold text-lg mb-4">¿Por qué trabajar conmigo?</h3>
                <ul className="space-y-3">
                  {[
                    'Respuesta rápida (menos de 24h)',
                    'Comunicación clara y transparente',
                    'Presupuestos sin compromiso',
                    'Soporte post-entrega incluido',
                  ].map((item, idx) => (
                    <li key={idx} className="flex items-start">
                      <svg className="w-5 h-5 text-primary-600 mr-2 mt-0.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                      </svg>
                      <span className="text-gray-700">{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </motion.div>

            {/* Formulario */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="lg:col-span-2"
            >
              <form onSubmit={handleSubmit} className="card space-y-6">
                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <label htmlFor="name" className="block text-sm font-semibold text-gray-700 mb-2">
                      Nombre Completo *
                    </label>
                    <input
                      type="text"
                      id="name"
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      required
                      className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all"
                      placeholder="Tu nombre"
                    />
                  </div>

                  <div>
                    <label htmlFor="email" className="block text-sm font-semibold text-gray-700 mb-2">
                      Email *
                    </label>
                    <input
                      type="email"
                      id="email"
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      required
                      className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all"
                      placeholder="tu@email.com"
                    />
                  </div>
                </div>

                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <label htmlFor="phone" className="block text-sm font-semibold text-gray-700 mb-2">
                      Teléfono
                    </label>
                    <input
                      type="tel"
                      id="phone"
                      value={formData.phone}
                      onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                      className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all"
                      placeholder="+34 600 000 000"
                    />
                  </div>

                  <div>
                    <label htmlFor="company" className="block text-sm font-semibold text-gray-700 mb-2">
                      Empresa
                    </label>
                    <input
                      type="text"
                      id="company"
                      value={formData.company}
                      onChange={(e) => setFormData({ ...formData, company: e.target.value })}
                      className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all"
                      placeholder="Nombre de tu empresa"
                    />
                  </div>
                </div>

                <div>
                  <label htmlFor="projectType" className="block text-sm font-semibold text-gray-700 mb-2">
                    Tipo de Proyecto *
                  </label>
                  <select
                    id="projectType"
                    value={formData.projectType}
                    onChange={(e) => setFormData({ ...formData, projectType: e.target.value })}
                    required
                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all"
                  >
                    <option value="">Selecciona un tipo de proyecto</option>
                    <option value="ecommerce">E-commerce</option>
                    <option value="chatbot">Chatbot / IA</option>
                    <option value="landing">Landing Page</option>
                    <option value="platform">Plataforma Web</option>
                    <option value="integration">Integración API</option>
                    <option value="other">Otro</option>
                  </select>
                </div>

                <div>
                  <label htmlFor="message" className="block text-sm font-semibold text-gray-700 mb-2">
                    Cuéntame sobre tu Proyecto *
                  </label>
                  <textarea
                    id="message"
                    value={formData.message}
                    onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                    required
                    rows={6}
                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all resize-none"
                    placeholder="Describe tu proyecto, objetivos, presupuesto aproximado, timeline..."
                  />
                </div>

                {submitStatus === 'success' && (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="p-4 bg-green-50 border-2 border-green-200 rounded-lg"
                  >
                    <div className="flex items-center">
                      <svg className="w-6 h-6 text-green-600 mr-3" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                      </svg>
                      <div>
                        <div className="font-semibold text-green-800">¡Mensaje enviado correctamente!</div>
                        <div className="text-sm text-green-700">Te responderé en menos de 24 horas.</div>
                      </div>
                    </div>
                  </motion.div>
                )}

                {submitStatus === 'error' && (
                  <div className="p-4 bg-red-50 border-2 border-red-200 rounded-lg text-red-800">
                    <div className="font-semibold">Hubo un error al enviar el mensaje.</div>
                    <div className="text-sm mt-1">Por favor, intenta de nuevo o contáctame directamente por email.</div>
                  </div>
                )}

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full btn-primary text-lg py-4 disabled:opacity-50 disabled:cursor-not-allowed bg-gradient-to-r from-primary-600 to-primary-700 hover:from-primary-700 hover:to-primary-800"
                >
                  {isSubmitting ? (
                    <span className="flex items-center justify-center">
                      <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      Enviando...
                    </span>
                  ) : (
                    'Enviar Mensaje'
                  )}
                </button>
              </form>
            </motion.div>
          </div>
        </motion.div>
      </div>
    </div>
  )
}
