import { Link, useLocation } from 'react-router-dom'
import { motion } from 'framer-motion'

const navItems = [
  { path: '/', label: 'Inicio' },
  { path: '/servicios', label: 'Servicios' },
  { path: '/proyectos', label: 'Proyectos' },
  { path: '/tecnologias', label: 'Tecnologías' },
  { path: '/integraciones', label: 'APIs' },
  { path: '/ia-demo', label: 'IA Demo' },
  { path: '/contacto', label: 'Contacto' },
]

export default function Header() {
  const location = useLocation()

  return (
    <header className="bg-white shadow-sm sticky top-0 z-50">
      <nav className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          <Link to="/" className="text-2xl font-bold text-primary-600">
            Portfolio
          </Link>
          
          <div className="hidden md:flex items-center space-x-6">
            {navItems.map((item) => {
              const isActive = location.pathname === item.path
              return (
                <Link
                  key={item.path}
                  to={item.path}
                  className={`relative px-3 py-2 font-medium transition-colors ${
                    isActive ? 'text-primary-600' : 'text-gray-700 hover:text-primary-600'
                  }`}
                >
                  {item.label}
                  {isActive && (
                    <motion.div
                      className="absolute bottom-0 left-0 right-0 h-0.5 bg-primary-600"
                      layoutId="underline"
                    />
                  )}
                </Link>
              )
            })}
          </div>

          {/* Mobile menu button */}
          <button className="md:hidden text-gray-700">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>
        </div>
      </nav>
    </header>
  )
}
