import { motion } from 'framer-motion'

// Tecnologías con logos (usando URLs de CDN o nombres para búsqueda)
const tecnologias = [
  // Frontend
  { name: 'React', category: 'Frontend', logo: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/react/react-original.svg', color: 'bg-blue-50' },
  { name: 'TypeScript', category: 'Frontend', logo: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/typescript/typescript-original.svg', color: 'bg-blue-50' },
  { name: 'Tailwind CSS', category: 'Frontend', logo: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/tailwindcss/tailwindcss-plain.svg', color: 'bg-cyan-50' },
  { name: 'Vite', category: 'Frontend', logo: 'https://vitejs.dev/logo.svg', color: 'bg-purple-50' },
  
  // Backend
  { name: 'Node.js', category: 'Backend', logo: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/nodejs/nodejs-original.svg', color: 'bg-green-50' },
  { name: 'Express', category: 'Backend', logo: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/express/express-original.svg', color: 'bg-gray-50' },
  
  // Databases
  { name: 'MongoDB', category: 'Database', logo: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/mongodb/mongodb-original.svg', color: 'bg-green-50' },
  { name: 'PostgreSQL', category: 'Database', logo: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/postgresql/postgresql-original.svg', color: 'bg-blue-50' },
  
  // DevOps
  { name: 'Docker', category: 'DevOps', logo: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/docker/docker-original.svg', color: 'bg-blue-50' },
  { name: 'Git', category: 'DevOps', logo: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/git/git-original.svg', color: 'bg-orange-50' },
  
  // Automation & AI
  { name: 'n8n', category: 'Automation', logo: 'https://avatars.githubusercontent.com/u/45487711?s=200&v=4', color: 'bg-purple-50' },
  { name: 'Retell.ai', category: 'AI', logo: 'https://retell.ai/favicon.ico', color: 'bg-indigo-50' },
  
  // Analytics
  { name: 'Google Analytics', category: 'Analytics', logo: 'https://www.google.com/analytics/images/home/ga-icon.svg', color: 'bg-yellow-50' },
]

const categories = Array.from(new Set(tecnologias.map(t => t.category)))

export default function Tecnologias() {
  return (
    <div className="container mx-auto px-4 py-16">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center mb-16"
      >
        <h1 className="text-4xl md:text-5xl font-bold mb-4">Stack Tecnológico</h1>
        <p className="text-xl text-gray-600 max-w-2xl mx-auto">
          Tecnologías modernas y probadas que uso para crear soluciones de alta calidad
        </p>
      </motion.div>

      {/* Navegación rápida por categorías */}
      <div className="flex flex-wrap justify-center gap-3 mb-12">
        {categories.map((category) => (
          <a
            key={category}
            href={`#${category.toLowerCase()}`}
            className="px-4 py-2 bg-primary-100 text-primary-700 rounded-full font-medium hover:bg-primary-200 transition-colors"
          >
            {category}
          </a>
        ))}
      </div>

      {/* Grid de tecnologías por categoría */}
      <div className="space-y-16">
        {categories.map((category, catIndex) => {
          const categoryTechs = tecnologias.filter(t => t.category === category)
          
          return (
            <motion.section
              key={category}
              id={category.toLowerCase()}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: catIndex * 0.1 }}
              className="scroll-mt-20"
            >
              <h2 className="text-3xl font-bold mb-8 flex items-center">
                <span className="w-1 h-8 bg-primary-600 mr-4"></span>
                {category}
              </h2>
              
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-6">
                {categoryTechs.map((tech, index) => (
                  <motion.div
                    key={tech.name}
                    initial={{ opacity: 0, scale: 0.9 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.3, delay: index * 0.05 }}
                    whileHover={{ scale: 1.1, y: -5 }}
                    className="group"
                  >
                    <div className={`card h-full ${tech.color} hover:shadow-xl transition-all duration-300 cursor-pointer flex flex-col items-center justify-center p-6`}>
                      <div className="w-16 h-16 mb-4 flex items-center justify-center bg-white rounded-lg p-2 group-hover:scale-110 transition-transform">
                        <img
                          src={tech.logo}
                          alt={tech.name}
                          className="w-full h-full object-contain"
                          onError={(e) => {
                            // Fallback si la imagen no carga
                            const target = e.target as HTMLImageElement
                            target.style.display = 'none'
                            const parent = target.parentElement
                            if (parent) {
                              parent.innerHTML = `<div class="text-3xl font-bold text-gray-600">${tech.name.charAt(0)}</div>`
                            }
                          }}
                        />
                      </div>
                      <p className="font-semibold text-center text-gray-800 group-hover:text-primary-600 transition-colors">
                        {tech.name}
                      </p>
                    </div>
                  </motion.div>
                ))}
              </div>
            </motion.section>
          )
        })}
      </div>

      {/* Sección de experiencia */}
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className="mt-20 card bg-gradient-to-r from-primary-600 to-primary-700 text-white"
      >
        <div className="text-center">
          <h2 className="text-3xl font-bold mb-4">Experiencia Comprobada</h2>
          <p className="text-xl text-primary-100 mb-6 max-w-2xl mx-auto">
            Estas tecnologías no son solo herramientas que conozco, son soluciones que he implementado exitosamente en proyectos reales
          </p>
          <div className="grid md:grid-cols-3 gap-6 mt-8">
            {[
              { icon: '⚡', title: 'Rendimiento', desc: 'Optimización para velocidad y eficiencia' },
              { icon: '🔒', title: 'Seguridad', desc: 'Mejores prácticas de seguridad implementadas' },
              { icon: '📈', title: 'Escalabilidad', desc: 'Arquitecturas preparadas para crecer' },
            ].map((item, idx) => (
              <div key={idx} className="text-center">
                <div className="text-4xl mb-3">{item.icon}</div>
                <h3 className="font-bold text-lg mb-2">{item.title}</h3>
                <p className="text-primary-100">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </motion.div>
    </div>
  )
}
