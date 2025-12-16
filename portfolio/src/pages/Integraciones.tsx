import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
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
  const [selectedApi, setSelectedApi] = useState<ApiDemo | null>(null)
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
      color: 'from-slate-500 to-slate-600',
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
      color: 'from-slate-500 to-slate-600',
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
      color: 'from-slate-500 to-slate-600',
      image: 'https://images.unsplash.com/photo-1455390582262-044cdead277a?w=400'
    },
    {
      id: 'quotes',
      title: 'Frases Inspiradoras',
      description: 'API de frases motivacionales e inspiradoras. Perfecto para aplicaciones de bienestar y productividad.',
      endpoint: 'https://api.quotable.io/quotes?limit=10',
      data: null,
      loading: false,
      error: null,
      icon: '💭',
      color: 'from-slate-500 to-slate-600',
      image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400'
    },
    {
      id: 'languages',
      title: 'API de Idiomas',
      description: 'API para obtener información sobre idiomas del mundo, códigos ISO, nombres nativos y más.',
      endpoint: 'https://restcountries.com/v3.1/all?fields=languages',
      data: null,
      loading: false,
      error: null,
      icon: '🌐',
      color: 'from-slate-500 to-slate-600',
      image: 'https://images.unsplash.com/photo-1526304640581-d334cdbbf45e?w=400'
    },
    {
      id: 'countries',
      title: 'Información de Países',
      description: 'API con datos completos de países del mundo. Información geográfica, demográfica y cultural.',
      endpoint: 'https://restcountries.com/v3.1/all?fields=name,capital,population,flags',
      data: null,
      loading: false,
      error: null,
      icon: '🌍',
      color: 'from-slate-500 to-slate-600',
      image: 'https://images.unsplash.com/photo-1526304640581-d334cdbbf45e?w=400'
    },
  ])

  const fetchData = async (demo: ApiDemo) => {
    setSelectedApi({ ...demo, loading: true, error: null })

    try {
      let response
      if (demo.id === 'posts') {
        response = await axios.get(demo.endpoint, { params: { _limit: 10 } })
      } else if (demo.id === 'countries') {
        response = await axios.get(demo.endpoint)
      } else if (demo.id === 'quotes') {
        // Arreglar API de frases con mejor manejo de errores
        response = await axios.get('https://api.quotable.io/quotes', { 
          params: { limit: 10 },
          timeout: 10000
        })
      } else if (demo.id === 'languages') {
        response = await axios.get('https://restcountries.com/v3.1/all?fields=name,languages,flags')
      } else {
        response = await axios.get(demo.endpoint, { timeout: 10000 })
      }
      
      setSelectedApi({ ...demo, data: response.data, loading: false })
    } catch (error: any) {
      const errorMessage = error.response?.data?.message || error.message || 'Error de red. Verifica tu conexión.'
      setSelectedApi({ ...demo, error: errorMessage, loading: false })
    }
  }

  const openModal = (demo: ApiDemo) => {
    setSelectedApi(demo)
    if (!demo.data && !demo.loading && !demo.error) {
      fetchData(demo)
    }
  }

  const renderProductData = (data: any) => {
    if (!Array.isArray(data) || data.length === 0) return null
    
    return (
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4 max-h-96 overflow-y-auto">
        {data.map((product: any) => (
          <div key={product.id} className="bg-white rounded-lg border border-gray-200 overflow-hidden hover:shadow-lg transition-shadow">
            <div className="h-32 bg-gray-100 flex items-center justify-center">
              <img 
                src={product.image} 
                alt={product.title}
                className="w-full h-full object-contain p-2"
                onError={(e) => {
                  const target = e.target as HTMLImageElement
                  target.src = 'https://via.placeholder.com/300x300?text=Producto'
                }}
              />
            </div>
            <div className="p-3">
              <h4 className="font-semibold text-sm mb-1 line-clamp-2">{product.title}</h4>
              <p className="text-primary-600 font-bold">${product.price}</p>
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
      <div className="grid md:grid-cols-2 gap-4 max-h-96 overflow-y-auto">
        {data.map((user: any) => (
          <div key={user.id} className="bg-white rounded-lg border border-gray-200 p-4 hover:shadow-lg transition-shadow">
            <div className="flex items-center mb-3">
              <div className="w-12 h-12 bg-gradient-to-br from-slate-400 to-slate-600 rounded-full flex items-center justify-center text-white font-bold text-lg mr-3">
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
                {user.company?.name || 'Sin empresa'}
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
      <div className="space-y-4 max-h-96 overflow-y-auto">
        {data.map((post: any) => (
          <div key={post.id} className="bg-white rounded-lg border border-gray-200 p-4 hover:shadow-lg transition-shadow">
            <h4 className="font-semibold text-lg mb-2">{post.title}</h4>
            <p className="text-gray-600 text-sm line-clamp-3">{post.body}</p>
            <div className="mt-3 flex items-center text-xs text-gray-500">
              <span className="mr-4">📝 Publicación #{post.id}</span>
              <span>👤 Usuario {post.userId}</span>
            </div>
          </div>
        ))}
      </div>
    )
  }

  const renderQuotesData = (data: any) => {
    // Manejar tanto results como array directo
    const quotes = data?.results || (Array.isArray(data) ? data : [])
    if (!Array.isArray(quotes) || quotes.length === 0) return null
    
    return (
      <div className="space-y-4 max-h-96 overflow-y-auto">
        {quotes.map((quote: any, index: number) => (
          <div key={index} className="bg-white rounded-lg border border-gray-200 p-4 hover:shadow-lg transition-shadow">
            <p className="text-gray-700 italic mb-2">"{quote.content || quote.text || quote.quote}"</p>
            <p className="text-sm text-gray-600 font-semibold">— {quote.author || 'Anónimo'}</p>
          </div>
        ))}
      </div>
    )
  }

  const renderLanguagesData = (data: any) => {
    if (!Array.isArray(data) || data.length === 0) return null
    
    // Extraer y procesar idiomas
    const languagesMap = new Map<string, { name: string; countries: string[] }>()
    
    data.forEach((country: any) => {
      if (country.languages) {
        Object.entries(country.languages).forEach(([code, name]: [string, any]) => {
          if (!languagesMap.has(code)) {
            languagesMap.set(code, { name, countries: [] })
          }
          if (country.name?.common) {
            languagesMap.get(code)!.countries.push(country.name.common)
          }
        })
      }
    })
    
    const languages = Array.from(languagesMap.entries()).slice(0, 15)
    
    return (
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4 max-h-96 overflow-y-auto">
        {languages.map(([code, info], index) => (
          <div key={index} className="bg-white rounded-lg border border-gray-200 p-4 hover:shadow-lg transition-shadow">
            <div className="flex items-center mb-3">
              <div className="w-10 h-10 bg-slate-600 rounded-full flex items-center justify-center text-white font-bold text-sm mr-3">
                {code.toUpperCase().slice(0, 2)}
              </div>
              <div>
                <h4 className="font-semibold">{info.name}</h4>
                <p className="text-xs text-gray-500">Código: {code}</p>
              </div>
            </div>
            <div className="text-xs text-gray-600">
              <p className="font-semibold mb-1">Países ({info.countries.length}):</p>
              <p className="line-clamp-2">{info.countries.slice(0, 3).join(', ')}...</p>
            </div>
          </div>
        ))}
      </div>
    )
  }

  const renderCountriesData = (data: any) => {
    if (!Array.isArray(data) || data.length === 0) return null
    
    return (
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4 max-h-96 overflow-y-auto">
        {data.slice(0, 12).map((country: any, index: number) => (
          <div key={index} className="bg-white rounded-lg border border-gray-200 p-4 hover:shadow-lg transition-shadow">
            <div className="flex items-center mb-3">
              <img 
                src={country.flags?.png || country.flags?.svg} 
                alt={country.name?.common}
                className="w-12 h-8 object-cover rounded mr-3"
                onError={(e) => {
                  const target = e.target as HTMLImageElement
                  target.style.display = 'none'
                }}
              />
              <h4 className="font-semibold">{country.name?.common}</h4>
            </div>
            <div className="space-y-1 text-sm text-gray-600">
              <p><span className="font-semibold">Capital:</span> {country.capital?.[0] || 'N/A'}</p>
              <p><span className="font-semibold">Población:</span> {country.population?.toLocaleString() || 'N/A'}</p>
            </div>
          </div>
        ))}
      </div>
    )
  }

  const renderModalContent = () => {
    if (!selectedApi) return null

    if (selectedApi.loading) {
      return (
        <div className="flex items-center justify-center py-20">
          <div className="text-center">
            <svg className="animate-spin h-12 w-12 text-primary-600 mx-auto mb-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
            <p className="text-gray-600">Cargando datos de la API...</p>
          </div>
        </div>
      )
    }

    if (selectedApi.error) {
      return (
        <div className="p-6 bg-red-50 border border-red-200 rounded-lg text-red-700">
          <p className="font-semibold mb-2">❌ Error al cargar la API</p>
          <p className="text-sm">{selectedApi.error}</p>
        </div>
      )
    }

    // Si es una capacidad de integración (sin endpoint)
    if (selectedApi.id?.startsWith('capability-')) {
      return (
        <div className="p-6">
          <div className="mb-6">
            <h3 className="text-xl font-bold mb-4">Detalles de la Capacidad</h3>
            <p className="text-gray-700 leading-relaxed">{selectedApi.description}</p>
          </div>
          <div className="bg-gray-50 rounded-lg p-4">
            <h4 className="font-semibold mb-2">Tecnologías relacionadas:</h4>
            <ul className="list-disc list-inside space-y-1 text-sm text-gray-600">
              <li>React / Vue / Angular</li>
              <li>Axios / Fetch API</li>
              <li>WebSockets / Socket.io</li>
              <li>JWT / OAuth 2.0</li>
              <li>Redis / Memcached</li>
            </ul>
          </div>
        </div>
      )
    }

    if (!selectedApi.data) {
      return (
        <div className="text-center py-20">
          <p className="text-gray-600 mb-4">Haz clic en "Cargar Datos" para obtener información de la API</p>
          <button
            onClick={() => fetchData(selectedApi)}
            className="btn-primary bg-slate-600 hover:bg-slate-700"
          >
            Cargar Datos
          </button>
        </div>
      )
    }

    return (
      <div>
        <div className="mb-6">
          {selectedApi.endpoint && (
            <div className="text-xs text-gray-500 font-mono bg-gray-100 p-3 rounded break-all mb-4">
              {selectedApi.endpoint}
            </div>
          )}
          <div className="text-sm font-semibold text-gray-700 flex items-center">
            <span className="mr-2">✅</span>
            Resultados ({Array.isArray(selectedApi.data) ? selectedApi.data.length : selectedApi.data?.results?.length || 1} elementos)
          </div>
        </div>
        
        {selectedApi.id === 'products' && renderProductData(selectedApi.data)}
        {selectedApi.id === 'users' && renderUserData(selectedApi.data)}
        {selectedApi.id === 'posts' && renderPostData(selectedApi.data)}
        {selectedApi.id === 'quotes' && renderQuotesData(selectedApi.data)}
        {selectedApi.id === 'languages' && renderLanguagesData(selectedApi.data)}
        {selectedApi.id === 'countries' && renderCountriesData(selectedApi.data)}
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
            <span className="block mt-2">Haz clic en cualquier API para ver los datos en detalle.</span>
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {demos.map((demo, index) => (
            <motion.div
              key={demo.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              whileHover={{ scale: 1.02, y: -5 }}
              className="card group hover:shadow-2xl transition-all duration-300 cursor-pointer border-2 border-transparent hover:border-primary-200"
              onClick={() => openModal(demo)}
            >
              <div className="w-full h-32 bg-gray-100 rounded-lg mb-4 overflow-hidden">
                <img 
                  src={demo.image || 'https://images.unsplash.com/photo-1558494949-ef010cbdcc31?w=400&h=300&fit=crop'} 
                  alt={demo.title}
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                  onError={(e) => {
                    const target = e.target as HTMLImageElement
                    target.src = 'https://via.placeholder.com/400x300?text=' + demo.title
                  }}
                />
              </div>
              
              <h3 className="text-xl font-bold mb-2 group-hover:text-primary-600 transition-colors">{demo.title}</h3>
              <p className="text-gray-600 text-sm mb-4 line-clamp-2">{demo.description}</p>
              
              <div className="text-xs text-gray-500 font-mono bg-gray-100 p-2 rounded mb-4 break-all line-clamp-1">
                {demo.endpoint}
              </div>

              <button
                className="w-full btn-primary text-sm bg-slate-600 hover:bg-slate-700 group-hover:scale-105 transition-transform"
              >
                Ver Detalles →
              </button>
            </motion.div>
          ))}
        </div>

        {/* Sección de Capacidades de Integración - Clickeable con Modal */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="mt-16"
        >
          <h2 className="text-3xl font-bold mb-6 text-center">Capacidades de Integración</h2>
          <p className="text-center text-gray-600 mb-8">Haz clic en cualquier capacidad para ver más detalles</p>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              {
                icon: '🔌',
                title: 'APIs RESTful',
                desc: 'Integración con APIs REST estándar de la industria',
                image: 'https://images.unsplash.com/photo-1558494949-ef010cbdcc31?w=400&h=300&fit=crop',
                details: 'Implementación de clientes HTTP robustos, manejo de estados de respuesta, validación de datos y transformación de respuestas.'
              },
              {
                icon: '📊',
                title: 'Datos en Tiempo Real',
                desc: 'Sincronización y actualización de datos en tiempo real',
                image: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=400&h=300&fit=crop',
                details: 'WebSockets, Server-Sent Events (SSE), polling inteligente y actualizaciones automáticas sin recargar la página.'
              },
              {
                icon: '🔒',
                title: 'Autenticación Segura',
                desc: 'Implementación de OAuth, JWT y API keys',
                image: 'https://images.unsplash.com/photo-1563013544-824ae1b704d3?w=400&h=300&fit=crop',
                details: 'OAuth 2.0, JWT tokens con refresh, API keys con rotación automática, y almacenamiento seguro de credenciales.'
              },
              {
                icon: '⚡',
                title: 'Optimización',
                desc: 'Caché, paginación y manejo eficiente de datos',
                image: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=400&h=300&fit=crop',
                details: 'Caché en memoria y localStorage, paginación inteligente, lazy loading, y compresión de respuestas.'
              },
              {
                icon: '🛡️',
                title: 'Manejo de Errores',
                desc: 'Gestión robusta de errores y fallbacks',
                image: 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=400&h=300&fit=crop',
                details: 'Retry automático, circuit breakers, fallbacks elegantes, logging estructurado y notificaciones de errores.'
              },
              {
                icon: '📱',
                title: 'Responsive',
                desc: 'Visualización adaptada a todos los dispositivos',
                image: 'https://images.unsplash.com/photo-1512941937669-90a1b58e7e9c?w=400&h=300&fit=crop',
                details: 'Diseño mobile-first, breakpoints personalizados, imágenes adaptativas y touch-friendly interfaces.'
              },
            ].map((feature, index) => (
              <motion.div
                key={index}
                whileHover={{ scale: 1.05, y: -5 }}
                onClick={() => setSelectedApi({
                  id: `capability-${index}`,
                  title: feature.title,
                  description: feature.details,
                  endpoint: '',
                  data: null,
                  loading: false,
                  error: null,
                  icon: feature.icon,
                  color: 'from-slate-500 to-slate-600',
                  image: feature.image
                })}
                className="bg-white rounded-lg p-4 hover:shadow-xl transition-all duration-300 cursor-pointer border border-gray-200 hover:border-gray-300"
              >
                <div className="w-full h-32 bg-gray-100 rounded-lg mb-3 overflow-hidden">
                  <img 
                    src={feature.image} 
                    alt={feature.title}
                    className="w-full h-full object-cover hover:scale-110 transition-transform duration-300"
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
              </motion.div>
            ))}
          </div>
        </motion.div>
      </motion.div>

      {/* Modal/Pop-up para mostrar detalles de la API */}
      <AnimatePresence>
        {selectedApi && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setSelectedApi(null)}
              className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4"
            >
              <motion.div
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.9, opacity: 0 }}
                onClick={(e) => e.stopPropagation()}
                className="bg-white rounded-xl shadow-2xl max-w-5xl w-full max-h-[90vh] overflow-hidden flex flex-col"
              >
                <div className="bg-gradient-to-r from-slate-700 to-slate-800 text-white p-6 flex justify-between items-center">
                  <div>
                    <h2 className="text-2xl font-bold flex items-center">
                      <span className="text-4xl mr-3">{selectedApi.icon}</span>
                      {selectedApi.title}
                    </h2>
                    <p className="text-white/90 mt-2">{selectedApi.description}</p>
                  </div>
                  <button
                    onClick={() => setSelectedApi(null)}
                    className="text-white hover:text-gray-200 text-3xl font-bold w-10 h-10 flex items-center justify-center rounded-full hover:bg-white/20 transition-colors"
                  >
                    ×
                  </button>
                </div>
                
                <div className="p-6 overflow-y-auto flex-1">
                  {renderModalContent()}
                </div>
              </motion.div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  )
}
