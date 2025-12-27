import { motion, AnimatePresence } from 'framer-motion'
import { useState, useRef, useEffect } from 'react'
import { Wrench, Calendar, Target, Quote, Map, Scale, X } from 'lucide-react'
import { Link } from 'react-router-dom'

const ToolsMenu = ({ isMobile = false }) => {
  const [isOpen, setIsOpen] = useState(false)
  const menuRef = useRef(null)

  const tools = [
    { name: 'Test Vocacional', icon: Target, href: '/test-vocacional', highlight: true },
    { name: 'Frase del día', icon: Quote, href: '/frase-del-dia' },
    { name: 'Laboratorio Ético', icon: Scale, href: '/laboratorio-etico' },
    { name: 'Atlas de la Humanidad', icon: Map, href: '/atlas-humanidad' },
    { name: 'Dinámica de la semana', icon: Calendar, href: '/dinamica-del-dia' }
  ]

  useEffect(() => {
    if (!isMobile) {
      const handleClickOutside = (event) => {
        if (menuRef.current && !menuRef.current.contains(event.target)) {
          setIsOpen(false)
        }
      }

      document.addEventListener('mousedown', handleClickOutside)
      return () => document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [isMobile])

  // Versión móvil - Pantalla completa
  if (isMobile) {
    return (
      <>
        <motion.button
          onClick={() => setIsOpen(!isOpen)}
          whileHover={{ scale: 1.03 }}
          whileTap={{ scale: 0.97 }}
          className="w-full flex items-center justify-center gap-2 bg-gradient-to-r from-blue-600 to-cyan-600 text-white px-4 py-4 rounded-full text-sm font-medium tracking-[0.2em] transition-all duration-300 uppercase shadow-lg shadow-blue-500/30 border-2 border-blue-500 hover:border-white/30"
          style={{ fontFamily: 'Gotham, sans-serif' }}
        >
          <Wrench className="w-4 h-4" strokeWidth={2.5} />
          <span className="text-xs">Herramientas</span>
        </motion.button>

        <AnimatePresence>
          {isOpen && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-[60] flex items-center justify-center"
            >
              {/* Fondo sólido con difuminado elegante */}
              <div className="absolute inset-0 bg-gradient-to-br from-black via-gray-900 to-black opacity-98 backdrop-blur-2xl" />
              
              {/* Efectos decorativos */}
              <div className="absolute inset-0 overflow-hidden">
                <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-blue-600/10 rounded-full blur-[120px]" />
                <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-cyan-600/10 rounded-full blur-[120px]" />
              </div>

              {/* Botón cerrar */}
              <button
                onClick={() => setIsOpen(false)}
                className="absolute top-6 right-6 w-11 h-11 flex items-center justify-center rounded-xl bg-white/10 backdrop-blur-md border border-white/20 hover:border-white/40 transition-all z-20"
              >
                <X className="w-5 h-5 text-white" strokeWidth={2} />
              </button>

              {/* Contenido */}
              <div className="relative w-full max-w-md px-6 z-10">
                <motion.h2
                  initial={{ y: -20, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  className="text-2xl font-light text-white tracking-wide text-center mb-8"
                  style={{ fontFamily: 'Gotham, sans-serif' }}
                >
                  HERRAMIENTAS
                </motion.h2>

                <div className="space-y-3">
                  {tools.map((tool, index) => {
                    const Icon = tool.icon
                    return (
                      <motion.div
                        key={tool.name}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: index * 0.1 }}
                      >
                        <Link
                          to={tool.href}
                          onClick={() => setIsOpen(false)}
                          className="block"
                        >
                          <motion.div
                            whileHover={{ scale: 1.02, x: 8 }}
                            className={`flex items-center gap-4 px-6 py-5 rounded-2xl transition-all duration-300 ${
                              tool.highlight
                                ? 'bg-gradient-to-r from-purple-500/20 to-fuchsia-500/20 border-2 border-purple-500/40'
                                : 'bg-white/5 border border-white/10 hover:border-white/20'
                            }`}
                          >
                            <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                              tool.highlight ? 'bg-purple-500/30' : 'bg-white/10'
                            }`}>
                              <Icon className="w-5 h-5 text-white" strokeWidth={1.5} />
                            </div>
                            <span className="text-white text-base font-light tracking-wide flex-1">
                              {tool.name}
                            </span>
                            {tool.highlight && (
                              <span className="text-xs px-3 py-1 bg-purple-500/30 rounded-full text-purple-200">
                                Nuevo
                              </span>
                            )}
                          </motion.div>
                        </Link>
                      </motion.div>
                    )
                  })}
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </>
    )
  }

  // Versión desktop - Dropdown normal
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
