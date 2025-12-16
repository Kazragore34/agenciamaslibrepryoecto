import { useState } from 'react'
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
    image: '💻',
    description: 'Laptop profesional con procesador Intel i7, 16GB RAM, SSD 512GB'
  },
  {
    id: 2,
    name: 'Smartphone Ultra',
    price: 899.99,
    image: '📱',
    description: 'Smartphone con pantalla AMOLED 6.7", cámara 108MP, 256GB almacenamiento'
  },
  {
    id: 3,
    name: 'Auriculares Wireless',
    price: 199.99,
    image: '🎧',
    description: 'Auriculares con cancelación de ruido activa, batería 30h'
  },
  {
    id: 4,
    name: 'Smartwatch Pro',
    price: 349.99,
    image: '⌚',
    description: 'Reloj inteligente con GPS, monitor de salud, resistencia al agua'
  },
]

export default function DemoEcommerce() {
  const [cart, setCart] = useState<{ product: Product; quantity: number }[]>([])
  const [showCart, setShowCart] = useState(false)

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

        {/* Productos */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          {products.map((product, index) => (
            <motion.div
              key={product.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-xl transition-shadow"
            >
              <div className="text-8xl text-center py-8 bg-gradient-to-br from-primary-50 to-primary-100">
                {product.image}
              </div>
              <div className="p-6">
                <h3 className="text-xl font-bold mb-2">{product.name}</h3>
                <p className="text-gray-600 text-sm mb-4">{product.description}</p>
                <div className="flex justify-between items-center">
                  <span className="text-2xl font-bold text-primary-600">
                    ${product.price.toFixed(2)}
                  </span>
                  <button
                    onClick={() => addToCart(product)}
                    className="btn-primary px-4 py-2"
                  >
                    Agregar
                  </button>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Carrito Sidebar */}
        {showCart && (
          <motion.div
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            className="fixed right-0 top-0 h-full w-full md:w-96 bg-white shadow-2xl z-50 overflow-y-auto"
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
                      <div key={item.product.id} className="flex items-center gap-4 p-4 bg-gray-50 rounded-lg">
                        <div className="text-4xl">{item.product.image}</div>
                        <div className="flex-1">
                          <h4 className="font-semibold">{item.product.name}</h4>
                          <p className="text-sm text-gray-600">${item.product.price.toFixed(2)}</p>
                        </div>
                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => updateQuantity(item.product.id, item.quantity - 1)}
                            className="w-8 h-8 rounded-full bg-gray-200 hover:bg-gray-300 flex items-center justify-center"
                          >
                            −
                          </button>
                          <span className="w-8 text-center">{item.quantity}</span>
                          <button
                            onClick={() => updateQuantity(item.product.id, item.quantity + 1)}
                            className="w-8 h-8 rounded-full bg-gray-200 hover:bg-gray-300 flex items-center justify-center"
                          >
                            +
                          </button>
                        </div>
                        <button
                          onClick={() => removeFromCart(item.product.id)}
                          className="text-red-500 hover:text-red-700"
                        >
                          🗑️
                        </button>
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
