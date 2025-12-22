import { motion, AnimatePresence } from 'framer-motion'
import { useState, useRef, useEffect } from 'react'
import { Wrench, Calendar, Brain, Heart, Coffee } from 'lucide-react'

const ToolsMenu = () => {
  const [isOpen, setIsOpen] = useState(false)
  const menuRef = useRef(null)

  const tools = [
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
                  className="flex items-center gap-3 px-4 py-3 text-white/70 hover:text-white hover:bg-white/5 transition-all duration-200 border-b border-white/5 last:border-0"
                  onClick={() => setIsOpen(false)}
                >
                  <Icon className="w-4 h-4" strokeWidth={1.5} />
                  <span className="text-sm font-light">{tool.name}</span>
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
