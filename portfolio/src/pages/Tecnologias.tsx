import { motion } from 'framer-motion'

const tecnologias = [
  { name: 'React', category: 'Frontend' },
  { name: 'TypeScript', category: 'Language' },
  { name: 'Node.js', category: 'Backend' },
  { name: 'Express', category: 'Backend' },
  { name: 'Tailwind CSS', category: 'Styling' },
  { name: 'Vite', category: 'Build Tool' },
  { name: 'Docker', category: 'DevOps' },
  { name: 'MongoDB', category: 'Database' },
  { name: 'PostgreSQL', category: 'Database' },
  { name: 'n8n', category: 'Automation' },
  { name: 'Retell.ai', category: 'AI' },
  { name: 'Google Analytics', category: 'Analytics' },
]

export default function Tecnologias() {
  const categories = Array.from(new Set(tecnologias.map(t => t.category)))

  return (
    <div className="container mx-auto px-4 py-16">
      <motion.h1
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-4xl font-bold text-center mb-12"
      >
        Tecnologías
      </motion.h1>

      {categories.map((category, catIndex) => (
        <motion.div
          key={category}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: catIndex * 0.1 }}
          className="mb-12"
        >
          <h2 className="text-2xl font-semibold mb-6">{category}</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
            {tecnologias
              .filter(t => t.category === category)
              .map((tech, index) => (
                <motion.div
                  key={tech.name}
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.3, delay: index * 0.05 }}
                  className="card text-center hover:scale-110 transition-transform duration-300 cursor-pointer"
                >
                  <p className="font-medium">{tech.name}</p>
                </motion.div>
              ))}
          </div>
        </motion.div>
      ))}
    </div>
  )
}
