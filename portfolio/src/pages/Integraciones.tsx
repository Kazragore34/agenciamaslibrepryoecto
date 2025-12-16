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
  icon: string
  color: string
  image?: string
}

export default function Integraciones() {
  const [demos, setDemos] = useState<ApiDemo[]>([
    {
      id: 'products',
      title: 'Catálogo de Productos',
      description: 'Integración con API de productos para e-commerce. Muestra productos reales con imágenes, precios y descripciones.',
      endpoint: 'https://fakestoreapi.com/products',
      data: null,
      loading: false,
      error: null,
      icon: '🛍️',
      color: 'from-blue-500 to-blue-600',
      image: 'https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?w=400'
    },
    {
      id: 'users',
      title: 'Gestión de Usuarios',
      description: 'API para administración de usuarios y perfiles. Gestiona información de clientes de forma profesional.',
      endpoint: 'https://jsonplaceholder.typicode.com/users',
      data: null,
      loading: false,
      error: null,
      icon: '👥',
      color: 'from-green-500 to-green-600',
      image: 'https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=400'
    },
    {
      id: 'posts',
      title: 'Sistema de Contenidos',
      description: 'API para gestión de posts y contenido dinámico. Perfecto para blogs y sistemas de noticias.',
      endpoint: 'https://jsonplaceholder.typicode.com/posts',
      data: null,
      loading: false,
      error: null,
      icon: '📝',
      color: 'from-purple-500 to-purple-600',
      image: 'https://images.unsplash.com/photo-1455390582262-044cdead277a?w=400'
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

  const renderProductData = (data: any) => {
    if (!Array.isArray(data) || data.length === 0) return null
    
    return (
      <div className="grid md:grid-cols-2 gap-4 mt-4">
        {data.slice(0, 4).map((product: any) => (
          <div key={product.id} className="bg-white rounded-lg border border-gray-200 overflow-hidden hover:shadow-lg transition-shadow">
            <div className="h-48 bg-gray-100 flex items-center justify-center">
              <img 
                src={product.image} 
                alt={product.title}
                className="w-full h-full object-contain p-4"
                onError={(e) => {
                  const target = e.target as HTMLImageElement
                  target.src = 'https://via.placeholder.com/300x300?text=Product'
                }}
              />
            </div>
            <div className="p-4">
              <h4 className="font-semibold text-sm mb-2 line-clamp-2">{product.title}</h4>
              <p className="text-primary-600 font-bold text-lg">${product.price}</p>
              <p className="text-xs text-gray-500 mt-1">⭐ {product.rating?.rate || 'N/A'}</p>
            </div>
          </div>
        ))}
      </div>
    )
  }

  const renderUserData = (data: any) => {
    if (!Array.isArray(data) || data.length === 0) return null
    
    return (
      <div className="grid md:grid-cols-2 gap-4 mt-4">
        {data.slice(0, 4).map((user: any) => (
          <div key={user.id} className="bg-white rounded-lg border border-gray-200 p-4 hover:shadow-lg transition-shadow">
            <div className="flex items-center mb-3">
              <div className="w-12 h-12 bg-gradient-to-br from-green-400 to-green-600 rounded-full flex items-center justify-center text-white font-bold text-lg mr-3">
                {user.name.charAt(0)}
              </div>
              <div>
                <h4 className="font-semibold">{user.name}</h4>
                <p className="text-sm text-gray-500">@{user.username}</p>
              </div>
            </div>
            <div className="space-y-1 text-sm">
              <p className="flex items-center text-gray-600">
                <span className="mr-2">📧</span>
                {user.email}
              </p>
              <p className="flex items-center text-gray-600">
                <span className="mr-2">🌐</span>
                {user.website}
              </p>
              <p className="flex items-center text-gray-600">
                <span className="mr-2">🏢</span>
                {user.company?.name}
              </p>
            </div>
          </div>
        ))}
      </div>
    )
  }

  const renderPostData = (data: any) => {
    if (!Array.isArray(data) || data.length === 0) return null
    
    return (
      <div className="space-y-4 mt-4">
        {data.map((post: any) => (
          <div key={post.id} className="bg-white rounded-lg border border-gray-200 p-4 hover:shadow-lg transition-shadow">
            <h4 className="font-semibold text-lg mb-2">{post.title}</h4>
            <p className="text-gray-600 text-sm line-clamp-3">{post.body}</p>
            <div className="mt-3 flex items-center text-xs text-gray-500">
              <span className="mr-4">📝 Post #{post.id}</span>
              <span>👤 Usuario {post.userId}</span>
            </div>
          </div>
        ))}
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-16">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-6xl mx-auto"
      >
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">Integraciones con APIs</h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Demostración visual de integraciones profesionales con APIs externas. 
            <span className="block mt-2">Verás los datos de forma clara y amigable, no solo código.</span>
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {demos.map((demo, index) => (
            <motion.div
              key={demo.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              className="card group hover:shadow-2xl transition-all duration-300 hover:-translate-y-2"
            >
              <div className={`w-full h-32 bg-gradient-to-br ${demo.color} rounded-lg mb-4 flex items-center justify-center text-5xl`}>
                {demo.icon}
              </div>
              
              <h3 className="text-xl font-bold mb-2">{demo.title}</h3>
              <p className="text-gray-600 text-sm mb-4">{demo.description}</p>
              
              <div className="text-xs text-gray-500 font-mono bg-gray-100 p-2 rounded mb-4 break-all">
                {demo.endpoint}
              </div>

              <button
                onClick={() => fetchData(demo.id)}
                disabled={demo.loading}
                className={`w-full btn-primary text-sm disabled:opacity-50 disabled:cursor-not-allowed bg-gradient-to-r ${demo.color}`}
              >
                {demo.loading ? (
                  <span className="flex items-center justify-center">
                    <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Cargando...
                  </span>
                ) : (
                  'Probar API'
                )}
              </button>

              {demo.error && (
                <div className="mt-4 p-3 bg-red-50 border border-red-200 rounded text-red-700 text-sm">
                  ❌ Error: {demo.error}
                </div>
              )}

              {demo.data && (
                <div className="mt-4">
                  <div className="text-sm font-semibold text-gray-700 mb-3 flex items-center">
                    <span className="mr-2">✅</span>
                    Resultados ({Array.isArray(demo.data) ? demo.data.length : 1} items)
                  </div>
                  
                  {demo.id === 'products' && renderProductData(demo.data)}
                  {demo.id === 'users' && renderUserData(demo.data)}
                  {demo.id === 'posts' && renderPostData(demo.data)}
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
          className="mt-16 card bg-gradient-to-br from-gray-50 to-gray-100"
        >
          <h2 className="text-2xl font-bold mb-6">Capacidades de Integración</h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              {
                icon: '🔌',
                title: 'APIs RESTful',
                desc: 'Integración con APIs REST estándar de la industria',
                image: 'https://images.unsplash.com/photo-1558494949-ef010cbdcc31?w=200'
              },
              {
                icon: '📊',
                title: 'Datos en Tiempo Real',
                desc: 'Sincronización y actualización de datos en tiempo real',
                image: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=200'
              },
              {
                icon: '🔒',
                title: 'Autenticación Segura',
                desc: 'Implementación de OAuth, JWT y API keys',
                image: 'https://images.unsplash.com/photo-1563013544-824ae1b704d3?w=200'
              },
              {
                icon: '⚡',
                title: 'Optimización',
                desc: 'Caché, paginación y manejo eficiente de datos',
                image: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=200'
              },
              {
                icon: '🛡️',
                title: 'Manejo de Errores',
                desc: 'Gestión robusta de errores y fallbacks',
                image: 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=200'
              },
              {
                icon: '📱',
                title: 'Responsive',
                desc: 'Visualización adaptada a todos los dispositivos',
                image: 'https://images.unsplash.com/photo-1512941937669-90a1b58e7e9c?w=200'
              },
            ].map((feature, index) => (
              <div key={index} className="bg-white rounded-lg p-4 hover:shadow-lg transition-shadow">
                <div className="w-full h-32 bg-gray-100 rounded-lg mb-3 overflow-hidden">
                  <img 
                    src={feature.image} 
                    alt={feature.title}
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      const target = e.target as HTMLImageElement
                      target.style.display = 'none'
                    }}
                  />
                </div>
                <div className="flex items-start space-x-3">
                  <span className="text-2xl">{feature.icon}</span>
                  <div>
                    <h3 className="font-bold mb-1">{feature.title}</h3>
                    <p className="text-sm text-gray-600">{feature.desc}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </motion.div>
      </motion.div>
    </div>
  )
}
