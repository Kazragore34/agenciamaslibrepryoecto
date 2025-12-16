import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Link } from 'react-router-dom'

interface Product {
  id: number
  name: string
  price: number
  image: string
  description: string
}

const products: Product[] = [
  {
    id: 1,
    name: 'Laptop Pro 15"',
    price: 1299.99,
    image: 'https://images.unsplash.com/photo-1496181133206-80ce9b88a853?w=400&h=400&fit=crop',
    description: 'Laptop profesional con procesador Intel i7, 16GB RAM, SSD 512GB'
  },
  {
    id: 2,
    name: 'Smartphone Ultra',
    price: 899.99,
    image: 'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=400&h=400&fit=crop',
    description: 'Smartphone con pantalla AMOLED 6.7", cámara 108MP, 256GB almacenamiento'
  },
  {
    id: 3,
    name: 'Auriculares Wireless',
    price: 199.99,
    image: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=400&h=400&fit=crop',
    description: 'Auriculares con cancelación de ruido activa, batería 30h'
  },
  {
    id: 4,
    name: 'Smartwatch Pro',
    price: 349.99,
    image: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=400&h=400&fit=crop',
    description: 'Reloj inteligente con GPS, monitor de salud, resistencia al agua'
  },
  {
    id: 5,
    name: 'Tablet Premium 12"',
    price: 749.99,
    image: 'https://images.unsplash.com/photo-1544244015-0df4b3ffc6b0?w=400&h=400&fit=crop',
    description: 'Tablet con pantalla Retina, procesador A15, 256GB almacenamiento'
  },
  {
    id: 6,
    name: 'Cámara Digital Pro',
    price: 1599.99,
    image: 'https://images.unsplash.com/photo-1606983340126-99ab4feaa64a?w=400&h=400&fit=crop',
    description: 'Cámara mirrorless 24MP, grabación 4K, lente intercambiable'
  },
  {
    id: 7,
    name: 'Altavoz Bluetooth',
    price: 129.99,
    image: 'https://images.unsplash.com/photo-1608043152269-423dbba4e7e1?w=400&h=400&fit=crop',
    description: 'Altavoz portátil con sonido 360°, batería 20h, resistencia al agua'
  },
  {
    id: 8,
    name: 'Teclado Mecánico',
    price: 149.99,
    image: 'https://images.unsplash.com/photo-1587829741301-dc798b83add3?w=400&h=400&fit=crop',
    description: 'Teclado gaming RGB, switches mecánicos, retroiluminado'
  },
  {
    id: 9,
    name: 'Monitor 4K 27"',
    price: 449.99,
    image: 'https://images.unsplash.com/photo-1527443224154-c4a3942d3acf?w=400&h=400&fit=crop',
    description: 'Monitor profesional 4K UHD, HDR10, 144Hz, FreeSync'
  },
  {
    id: 10,
    name: 'Mouse Inalámbrico',
    price: 79.99,
    image: 'https://images.unsplash.com/photo-1527814050087-3793815479db?w=400&h=400&fit=crop',
    description: 'Mouse ergonómico inalámbrico, 16000 DPI, batería recargable'
  },
  {
    id: 11,
    name: 'Webcam HD 1080p',
    price: 99.99,
    image: 'https://images.unsplash.com/photo-1587825147138-346b228a4b74?w=400&h=400&fit=crop',
    description: 'Webcam Full HD con micrófono integrado, enfoque automático'
  },
  {
    id: 12,
    name: 'Disco Duro Externo 2TB',
    price: 89.99,
    image: 'https://images.unsplash.com/photo-1591488320449-11f0e6c3f158?w=400&h=400&fit=crop',
    description: 'Disco duro externo USB 3.0, 2TB, diseño compacto y portátil'
  },
]

export default function DemoEcommerce() {
  const [cart, setCart] = useState<{ product: Product; quantity: number }[]>([])
  const [showCart, setShowCart] = useState(false)

  useEffect(() => {
    window.scrollTo(0, 0)
  }, [])

  const addToCart = (product: Product) => {
    setCart(prev => {
      const existing = prev.find(item => item.product.id === product.id)
      if (existing) {
        return prev.map(item =>
          item.product.id === product.id
            ? { ...item, quantity: item.quantity + 1 }
            : item
        )
      }
      return [...prev, { product, quantity: 1 }]
    })
    setShowCart(true)
  }

  const removeFromCart = (productId: number) => {
    setCart(prev => prev.filter(item => item.product.id !== productId))
  }

  const updateQuantity = (productId: number, quantity: number) => {
    if (quantity <= 0) {
      removeFromCart(productId)
      return
    }
    setCart(prev =>
      prev.map(item =>
        item.product.id === productId ? { ...item, quantity } : item
      )
    )
  }

  const total = cart.reduce((sum, item) => sum + item.product.price * item.quantity, 0)

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <Link to="/" className="text-2xl font-bold text-primary-600">
            Demo E-commerce
          </Link>
          <button
            onClick={() => setShowCart(!showCart)}
            className="relative btn-primary"
          >
            🛒 Carrito
            {cart.length > 0 && (
              <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full w-6 h-6 flex items-center justify-center">
                {cart.reduce((sum, item) => sum + item.quantity, 0)}
              </span>
            )}
          </button>
        </div>
      </header>

      <div className="container mx-auto px-4 py-12">
        {/* Hero Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12"
        >
          <h1 className="text-4xl md:text-5xl font-bold mb-4">
            Tienda Online Demo
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Esta es una demostración funcional de una plataforma e-commerce completa
            con carrito de compras, gestión de productos y pasarela de pago integrada.
          </p>
        </motion.div>

        {/* Productos - Responsive mejorado */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6 mb-12">
          {products.map((product, index) => (
            <motion.div
              key={product.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05 }}
              whileHover={{ y: -5, scale: 1.02 }}
              className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-xl transition-all duration-300 flex flex-col"
            >
              <div className="relative w-full h-48 sm:h-56 md:h-64 bg-gradient-to-br from-gray-100 to-gray-200 overflow-hidden">
                <img
                  src={product.image}
                  alt={product.name}
                  className="w-full h-full object-cover hover:scale-110 transition-transform duration-300"
                  onError={(e) => {
                    const target = e.target as HTMLImageElement
                    target.src = 'https://via.placeholder.com/400x400?text=Producto'
                  }}
                />
                <div className="absolute top-2 right-2 bg-primary-600 text-white px-2 py-1 rounded text-xs font-semibold">
                  Nuevo
                </div>
              </div>
              <div className="p-4 sm:p-6 flex flex-col flex-1">
                <h3 className="text-lg sm:text-xl font-bold mb-2 line-clamp-2">{product.name}</h3>
                <p className="text-gray-600 text-xs sm:text-sm mb-4 line-clamp-2 flex-1">{product.description}</p>
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 mt-auto">
                  <span className="text-xl sm:text-2xl font-bold text-primary-600">
                    ${product.price.toFixed(2)}
                  </span>
                  <button
                    onClick={() => addToCart(product)}
                    className="btn-primary px-4 py-2 text-sm sm:text-base w-full sm:w-auto"
                  >
                    Agregar al Carrito
                  </button>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Overlay para cerrar carrito en móvil */}
        {showCart && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setShowCart(false)}
            className="fixed inset-0 bg-black bg-opacity-50 z-40 md:hidden"
          />
        )}

        {/* Carrito Sidebar - Responsive mejorado */}
        {showCart && (
          <motion.div
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            className="fixed right-0 top-0 h-full w-full sm:w-96 bg-white shadow-2xl z-50 overflow-y-auto"
          >
            <div className="p-6">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold">Carrito de Compras</h2>
                <button
                  onClick={() => setShowCart(false)}
                  className="text-gray-400 hover:text-gray-600 text-2xl"
                >
                  ×
                </button>
              </div>

              {cart.length === 0 ? (
                <div className="text-center py-12">
                  <div className="text-6xl mb-4">🛒</div>
                  <p className="text-gray-600">Tu carrito está vacío</p>
                </div>
              ) : (
                <>
                  <div className="space-y-4 mb-6">
                    {cart.map(item => (
                      <div key={item.product.id} className="flex items-start sm:items-center gap-3 sm:gap-4 p-3 sm:p-4 bg-gray-50 rounded-lg">
                        <div className="w-16 h-16 sm:w-20 sm:h-20 flex-shrink-0 rounded-lg overflow-hidden bg-gray-200">
                          <img
                            src={item.product.image}
                            alt={item.product.name}
                            className="w-full h-full object-cover"
                            onError={(e) => {
                              const target = e.target as HTMLImageElement
                              target.src = 'https://via.placeholder.com/80x80?text=Producto'
                            }}
                          />
                        </div>
                        <div className="flex-1 min-w-0">
                          <h4 className="font-semibold text-sm sm:text-base line-clamp-2">{item.product.name}</h4>
                          <p className="text-xs sm:text-sm text-gray-600">${item.product.price.toFixed(2)}</p>
                        </div>
                        <div className="flex flex-col sm:flex-row items-center gap-2">
                          <div className="flex items-center gap-2">
                            <button
                              onClick={() => updateQuantity(item.product.id, item.quantity - 1)}
                              className="w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-gray-200 hover:bg-gray-300 flex items-center justify-center text-sm sm:text-base"
                            >
                              −
                            </button>
                            <span className="w-6 sm:w-8 text-center text-sm sm:text-base">{item.quantity}</span>
                            <button
                              onClick={() => updateQuantity(item.product.id, item.quantity + 1)}
                              className="w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-gray-200 hover:bg-gray-300 flex items-center justify-center text-sm sm:text-base"
                            >
                              +
                            </button>
                          </div>
                          <button
                            onClick={() => removeFromCart(item.product.id)}
                            className="text-red-500 hover:text-red-700 text-lg sm:text-xl"
                            aria-label="Eliminar"
                          >
                            🗑️
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>

                  <div className="border-t pt-4">
                    <div className="flex justify-between items-center mb-4">
                      <span className="text-lg font-semibold">Total:</span>
                      <span className="text-2xl font-bold text-primary-600">
                        ${total.toFixed(2)}
                      </span>
                    </div>
                    <button className="btn-primary w-full py-3 text-lg">
                      Proceder al Pago
                    </button>
                    <p className="text-xs text-gray-500 text-center mt-2">
                      (Demo - No se procesará ningún pago real)
                    </p>
                  </div>
                </>
              )}
            </div>
          </motion.div>
        )}

        {/* Info Section */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="bg-white rounded-xl shadow-md p-8 text-center"
        >
          <h3 className="text-2xl font-bold mb-4">Características de esta Demo</h3>
          <div className="grid md:grid-cols-3 gap-6 mt-6">
            <div>
              <div className="text-4xl mb-2">🛒</div>
              <h4 className="font-semibold mb-2">Carrito Inteligente</h4>
              <p className="text-sm text-gray-600">Gestión completa de productos y cantidades</p>
            </div>
            <div>
              <div className="text-4xl mb-2">💳</div>
              <h4 className="font-semibold mb-2">Pasarela de Pago</h4>
              <p className="text-sm text-gray-600">Integración con Stripe, PayPal y más</p>
            </div>
            <div>
              <div className="text-4xl mb-2">📊</div>
              <h4 className="font-semibold mb-2">Panel Admin</h4>
              <p className="text-sm text-gray-600">Gestión de inventario y pedidos en tiempo real</p>
            </div>
          </div>
          <Link to="/proyectos" className="inline-block mt-6 btn-secondary">
            ← Volver a Proyectos
          </Link>
        </motion.div>
      </div>
    </div>
  )
}
