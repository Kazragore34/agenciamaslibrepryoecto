import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { useEffect } from 'react'

export default function Home() {
  useEffect(() => {
    console.log('🏠 ==========================================')
    console.log('🏠 HOME COMPONENT CARGADO - VERSIÓN MEJORADA')
    console.log('🏠 Build: index.Btof3l-3.js')
    console.log('🏠 Fecha:', new Date().toISOString())
    console.log('🏠 ==========================================')
    
    // INDICADOR VISUAL MUY OBVIO
    const indicator = document.createElement('div')
    indicator.id = 'build-indicator'
    indicator.style.cssText = `
      position: fixed;
      top: 0;
      left: 0;
      right: 0;
      background: #ff0000;
      color: white;
      padding: 20px;
      text-align: center;
      font-size: 24px;
      font-weight: bold;
      z-index: 99999;
      border: 5px solid yellow;
    `
    indicator.textContent = '✅ BUILD Btof3l-3 CARGADO - VERSIÓN MEJORADA CON ESTADÍSTICAS Y CTA'
    document.body.insertBefore(indicator, document.body.firstChild)
    
    setTimeout(() => {
      indicator.style.display = 'none'
    }, 10000)
    
    // Verificar que las secciones existen
    setTimeout(() => {
      const statsSection = document.querySelector('[data-section="estadisticas"]')
      const ctaSection = document.querySelector('[data-section="cta"]')
      console.log('📊 Sección Estadísticas encontrada:', !!statsSection)
      console.log('📢 Sección CTA encontrada:', !!ctaSection)
      
      if (!statsSection) {
        console.error('❌ ERROR: Sección de estadísticas NO encontrada en el DOM')
      }
      if (!ctaSection) {
        console.error('❌ ERROR: Sección CTA NO encontrada en el DOM')
      }
    }, 1000)
  }, [])

  return (
    <div className="min-h-screen">
      {/* BOTÓN DE PRUEBA MUY VISIBLE */}
      <div style={{
        position: 'fixed',
        top: '50%',
        left: '50%',
        transform: 'translate(-50%, -50%)',
        zIndex: 999999,
        background: 'red',
        color: 'white',
        padding: '30px 50px',
        fontSize: '32px',
        fontWeight: 'bold',
        border: '10px solid yellow',
        borderRadius: '20px',
        boxShadow: '0 0 50px rgba(255,0,0,0.8)',
        textAlign: 'center'
      }}>
        <div style={{ marginBottom: '20px' }}>
          ✅ BUILD Btof3l-3 FUNCIONANDO
        </div>
        <div style={{ fontSize: '18px' }}>
          Si ves este botón, los cambios SÍ se están aplicando
        </div>
        <button
          onClick={() => alert('✅ ¡FUNCIONA! El build nuevo está cargado correctamente')}
          style={{
            marginTop: '20px',
            padding: '15px 30px',
            fontSize: '20px',
            background: 'yellow',
            color: 'black',
            border: 'none',
            borderRadius: '10px',
            cursor: 'pointer',
            fontWeight: 'bold'
          }}
        >
          CLICK AQUÍ PARA VERIFICAR
        </button>
      </div>

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

      {/* Estadísticas - VERSIÓN MEJORADA */}
      <section 
        data-section="estadisticas"
        className="py-16 bg-white border-y border-gray-100"
        style={{ 
          border: '5px solid red',
          backgroundColor: '#fff5f5',
          padding: '40px 0'
        }}
      >
        <div style={{
          position: 'absolute',
          top: '10px',
          right: '10px',
          background: 'red',
          color: 'white',
          padding: '10px',
          fontSize: '14px',
          fontWeight: 'bold'
        }}>
          SECCIÓN ESTADÍSTICAS - BUILD BgctxsMH
        </div>
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

      {/* Servicios Destacados Mejorados */}
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
              desc: 'Tiendas online completas y funcionales con pasarelas de pago integradas',
              icon: '🛒',
              link: '/servicios',
              color: 'from-blue-500 to-blue-600'
            },
            { 
              title: 'Chatbots IA', 
              desc: 'Asistentes inteligentes para WhatsApp y web con integración n8n',
              icon: '💬',
              link: '/ia-demo',
              color: 'from-green-500 to-green-600'
            },
            { 
              title: 'Integraciones API', 
              desc: 'Conexión profesional con APIs externas para potenciar tu negocio',
              icon: '🔌',
              link: '/integraciones',
              color: 'from-purple-500 to-purple-600'
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
                <div className="card h-full hover:shadow-2xl transition-all duration-300 hover:-translate-y-2">
                  <div className={`w-16 h-16 rounded-xl bg-gradient-to-br ${service.color} flex items-center justify-center text-3xl mb-6 group-hover:scale-110 transition-transform`}>
                    {service.icon}
                  </div>
                  <h3 className="text-2xl font-bold mb-3 group-hover:text-primary-600 transition-colors">
                    {service.title}
                  </h3>
                  <p className="text-gray-600 leading-relaxed">{service.desc}</p>
                  <div className="mt-6 text-primary-600 font-semibold group-hover:translate-x-2 transition-transform inline-flex items-center">
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
      </section>

      {/* CTA Section - VERSIÓN MEJORADA */}
      <section 
        data-section="cta"
        className="bg-gradient-to-r from-primary-600 to-primary-700 text-white py-20"
        style={{ 
          border: '5px solid yellow',
          backgroundColor: '#15803d',
          position: 'relative'
        }}
      >
        <div style={{
          position: 'absolute',
          top: '10px',
          right: '10px',
          background: 'yellow',
          color: 'black',
          padding: '10px',
          fontSize: '14px',
          fontWeight: 'bold'
        }}>
          SECCIÓN CTA - BUILD BgctxsMH
        </div>
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
