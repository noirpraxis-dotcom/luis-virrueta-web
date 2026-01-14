import { motion, AnimatePresence } from 'framer-motion'
import { useState, useEffect } from 'react'
import { List, X } from 'lucide-react'

const TableOfContents = ({ sections, accentKey = 'purple', isOpen, onToggle }) => {
  const [activeSection, setActiveSection] = useState('')

  // Color map for different accent themes
  const colorMap = {
    purple: { from: '#a855f7', to: '#d946ef' },
    red: { from: '#f87171', to: '#ec4899' },
    emerald: { from: '#34d399', to: '#14b8a6' },
    amber: { from: '#fbbf24', to: '#f97316' },
    indigo: { from: '#818cf8', to: '#6366f1' },
    blue: { from: '#60a5fa', to: '#3b82f6' },
    cyan: { from: '#22d3ee', to: '#14b8a6' },
    pink: { from: '#f472b6', to: '#ec4899' },
    orange: { from: '#f97316', to: '#ef4444' },
    slate: { from: '#94a3b8', to: '#64748b' },
    lime: { from: '#84cc16', to: '#22c55e' },
    violet: { from: '#8b5cf6', to: '#a855f7' }
  }

  const colors = colorMap[accentKey] || colorMap.purple

  // Extraer solo los headings
  const headings = sections
    .filter(section => section.type === 'heading')
    .map((section, index) => ({
      id: `section-${index}`,
      title: section.title
    }))

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setActiveSection(entry.target.id)
          }
        })
      },
      { rootMargin: '-20% 0px -80% 0px' }
    )

    headings.forEach((heading) => {
      const element = document.getElementById(heading.id)
      if (element) observer.observe(element)
    })

    return () => observer.disconnect()
  }, [headings])

  const scrollToSection = (id) => {
    const element = document.getElementById(id)
    if (element) {
      const offset = 100 // Espacio desde el top
      const elementPosition = element.getBoundingClientRect().top
      const offsetPosition = elementPosition + window.pageYOffset - offset

      const lenis = window.__lenis
      if (lenis && typeof lenis.scrollTo === 'function') {
        lenis.scrollTo(offsetPosition, { duration: 0.9, easing: (t) => 1 - Math.pow(1 - t, 3) })
      } else {
        window.scrollTo({
          top: offsetPosition,
          behavior: 'smooth'
        })
      }
      if (onToggle) onToggle(false)
    }
  }

  if (headings.length === 0) return null

  return (
    <>
      {/* Toggle Button - Ahora controlado por ReadingProgressBar */}
      {/* <motion.button
        onClick={() => setIsOpen(!isOpen)}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        aria-label={isOpen ? "Cerrar tabla de contenidos" : "Abrir tabla de contenidos"}
        className="fixed z-40 w-11 h-11 rounded-full backdrop-blur-xl border border-white/20 items-center justify-center hover:border-white/40 transition-all duration-300 shadow-lg flex right-4 bottom-24 lg:right-6 lg:top-32 lg:bottom-auto"
        style={{
          background: `linear-gradient(to bottom right, ${colors.from}33, ${colors.to}33)`
        }}
      >
        {isOpen ? (
          <X className="w-5 h-5 text-white" />
        ) : (
          <List className="w-5 h-5 text-white" />
        )}
      </motion.button> */}

      {/* TOC Panel */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, x: 100 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 100 }}
            transition={{ duration: 0.3, ease: [0.76, 0, 0.24, 1] }}
            className="fixed z-40 max-h-[60vh] overflow-y-auto bg-black/90 backdrop-blur-xl border border-white/10 rounded-2xl p-6 shadow-2xl left-4 right-4 bottom-24 lg:left-auto lg:right-6 lg:top-48 lg:bottom-auto lg:w-80"
          >
            <h4 className="text-sm font-bold text-white/90 uppercase tracking-wider mb-4">
              Contenido
            </h4>
            <nav className="space-y-2">
              {headings.map((heading, index) => {
                const isActive = activeSection === heading.id
                return (
                  <motion.button
                    key={heading.id}
                    onClick={() => scrollToSection(heading.id)}
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.05 }}
                    className={`w-full text-left px-3 py-2 rounded-lg text-sm transition-all duration-300 border ${
                      isActive
                        ? 'text-white border-white/20'
                        : 'text-white/60 hover:text-white hover:bg-white/5 border-transparent'
                    }`}
                    style={isActive ? {
                      background: `linear-gradient(to right, ${colors.from}33, ${colors.to}33)`
                    } : {}}
                  >
                    <span className="flex items-start gap-2">
                      <span 
                        className="flex-shrink-0 w-1.5 h-1.5 rounded-full mt-1.5"
                        style={{
                          backgroundColor: isActive ? colors.to : 'rgba(255,255,255,0.3)'
                        }}
                      />
                      <span className="line-clamp-2">{heading.title}</span>
                    </span>
                  </motion.button>
                )
              })}
            </nav>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}

export default TableOfContents
