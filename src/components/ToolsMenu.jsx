import { motion, AnimatePresence } from 'framer-motion'
import { useState, useRef, useEffect } from 'react'
import { Wrench, Calendar, Brain, Heart, Coffee, Target, Quote, Map } from 'lucide-react'

const ToolsMenu = () => {
  const [isOpen, setIsOpen] = useState(false)
  const menuRef = useRef(null)

  const tools = [
    { name: 'Test Vocacional', icon: Target, href: '/test-vocacional', highlight: true },
    { name: 'Frase del día', icon: Quote, href: '/frase-del-dia' },
    { name: 'Atlas de la Humanidad', icon: Map, href: '/atlas-humanidad' },
    { name: 'Dinámica del día', icon: Calendar, href: '/dinamica-del-dia' },
    { name: 'Meditaciones', icon: Brain, href: '/meditaciones' },
    { name: 'Ejercicios', icon: Heart, href: '/ejercicios' },
    { name: 'Recursos', icon: Coffee, href: '/recursos' }
  ]

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setIsOpen(false)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  return (
    <div className="relative" ref={menuRef}>
      <motion.button
        onClick={() => setIsOpen(!isOpen)}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        className="relative flex items-center justify-center w-10 h-10 rounded-full border border-white/20 bg-white/5 backdrop-blur-sm hover:border-white/40 hover:bg-white/10 transition-all duration-300"
        aria-label="Abrir menú de herramientas"
      >
        <Wrench className="w-4 h-4 text-white/80" strokeWidth={1.5} />
      </motion.button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
            className="absolute right-0 mt-2 w-56 bg-black/95 backdrop-blur-xl border border-white/10 rounded-2xl overflow-hidden shadow-2xl z-50"
          >
            {tools.map((tool, index) => {
              const Icon = tool.icon
              return (
                <motion.a
                  key={tool.name}
                  href={tool.href}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.05 }}
                  className={`flex items-center gap-3 px-4 py-3 transition-all duration-200 border-b border-white/5 last:border-0 ${
                    tool.highlight 
                      ? 'bg-gradient-to-r from-purple-500/20 to-fuchsia-500/20 text-white hover:from-purple-500/30 hover:to-fuchsia-500/30' 
                      : 'text-white/70 hover:text-white hover:bg-white/5'
                  }`}
                  onClick={() => setIsOpen(false)}
                >
                  <Icon className="w-4 h-4" strokeWidth={1.5} />
                  <span className={`text-sm ${tool.highlight ? 'font-medium' : 'font-light'}`}>
                    {tool.name}
                  </span>
                  {tool.highlight && (
                    <span className="ml-auto text-xs px-2 py-0.5 bg-purple-500/30 rounded-full">
                      Nuevo
                    </span>
                  )}
                </motion.a>
              )
            })}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

export default ToolsMenu
