import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import axios from 'axios'

interface ApiDemo {
  id: string
  title: string
  description: string
  endpoint: string
  data: any
  loading: boolean
  error: string | null
}

export default function Integraciones() {
  const [demos, setDemos] = useState<ApiDemo[]>([
    {
      id: 'products',
      title: 'Catálogo de Productos',
      description: 'Integración con API de productos para e-commerce',
      endpoint: 'https://fakestoreapi.com/products',
      data: null,
      loading: false,
      error: null,
    },
    {
      id: 'users',
      title: 'Gestión de Usuarios',
      description: 'API para administración de usuarios y perfiles',
      endpoint: 'https://jsonplaceholder.typicode.com/users',
      data: null,
      loading: false,
      error: null,
    },
    {
      id: 'posts',
      title: 'Sistema de Contenidos',
      description: 'API para gestión de posts y contenido dinámico',
      endpoint: 'https://jsonplaceholder.typicode.com/posts',
      data: null,
      loading: false,
      error: null,
    },
  ])

  const fetchData = async (demoId: string) => {
    const demo = demos.find(d => d.id === demoId)
    if (!demo) return

    setDemos(prev => prev.map(d => 
      d.id === demoId ? { ...d, loading: true, error: null } : d
    ))

    try {
      const response = await axios.get(demo.endpoint, {
        params: demo.id === 'posts' ? { _limit: 5 } : undefined
      })
      
      setDemos(prev => prev.map(d => 
        d.id === demoId 
          ? { ...d, data: response.data, loading: false }
          : d
      ))
    } catch (error: any) {
      setDemos(prev => prev.map(d => 
        d.id === demoId 
          ? { ...d, error: error.message, loading: false }
          : d
      ))
    }
  }

  return (
    <div className="container mx-auto px-4 py-16">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-6xl mx-auto"
      >
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold mb-4">Integraciones con APIs</h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Demostración de integraciones profesionales con APIs externas para e-commerce, 
            gestión de usuarios, contenido dinámico y más.
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {demos.map((demo, index) => (
            <motion.div
              key={demo.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              className="card group hover:scale-105 transition-transform duration-300"
            >
              <div className="mb-4">
                <h3 className="text-xl font-semibold mb-2">{demo.title}</h3>
                <p className="text-gray-600 text-sm mb-4">{demo.description}</p>
                <div className="text-xs text-gray-500 font-mono bg-gray-100 p-2 rounded mb-4 break-all">
                  {demo.endpoint}
                </div>
              </div>

              <button
                onClick={() => fetchData(demo.id)}
                disabled={demo.loading}
                className="w-full btn-primary text-sm disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {demo.loading ? 'Cargando...' : 'Probar API'}
              </button>

              {demo.error && (
                <div className="mt-4 p-3 bg-red-50 border border-red-200 rounded text-red-700 text-sm">
                  Error: {demo.error}
                </div>
              )}

              {demo.data && (
                <div className="mt-4 max-h-64 overflow-y-auto">
                  <div className="text-xs font-semibold text-gray-700 mb-2">
                    Resultado ({Array.isArray(demo.data) ? demo.data.length : 1} items):
                  </div>
                  <pre className="text-xs bg-gray-50 p-3 rounded overflow-x-auto">
                    {JSON.stringify(
                      Array.isArray(demo.data) 
                        ? demo.data.slice(0, 2) 
                        : demo.data,
                      null,
                      2
                    )}
                  </pre>
                </div>
              )}
            </motion.div>
          ))}
        </div>

        {/* Sección de características */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="mt-16 card"
        >
          <h2 className="text-2xl font-semibold mb-6">Capacidades de Integración</h2>
          <div className="grid md:grid-cols-2 gap-6">
            {[
              {
                icon: '🔌',
                title: 'APIs RESTful',
                desc: 'Integración con APIs REST estándar de la industria',
              },
              {
                icon: '📊',
                title: 'Datos en Tiempo Real',
                desc: 'Sincronización y actualización de datos en tiempo real',
              },
              {
                icon: '🔒',
                title: 'Autenticación Segura',
                desc: 'Implementación de OAuth, JWT y API keys',
              },
              {
                icon: '⚡',
                title: 'Optimización',
                desc: 'Caché, paginación y manejo eficiente de datos',
              },
              {
                icon: '🛡️',
                title: 'Manejo de Errores',
                desc: 'Gestión robusta de errores y fallbacks',
              },
              {
                icon: '📱',
                title: 'Responsive',
                desc: 'Visualización adaptada a todos los dispositivos',
              },
            ].map((feature, index) => (
              <div key={index} className="flex items-start space-x-3">
                <span className="text-2xl">{feature.icon}</span>
                <div>
                  <h3 className="font-semibold mb-1">{feature.title}</h3>
                  <p className="text-sm text-gray-600">{feature.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </motion.div>
      </motion.div>
    </div>
  )
}
