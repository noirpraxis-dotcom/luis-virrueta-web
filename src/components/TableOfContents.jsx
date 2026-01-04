import { motion, AnimatePresence } from 'framer-motion'
import { useState, useEffect } from 'react'
import { List, X } from 'lucide-react'

const TableOfContents = ({ sections }) => {
  const [isOpen, setIsOpen] = useState(false)
  const [activeSection, setActiveSection] = useState('')

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
      setIsOpen(false)
    }
  }

  if (headings.length === 0) return null

  return (
    <>
      {/* Toggle Button - Fixed on right side */}
      <motion.button
        onClick={() => setIsOpen(!isOpen)}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        aria-label={isOpen ? "Cerrar tabla de contenidos" : "Abrir tabla de contenidos"}
        className="fixed right-6 top-32 z-40 w-12 h-12 rounded-full bg-gradient-to-br from-purple-500/20 to-fuchsia-500/20 backdrop-blur-xl border border-white/20 items-center justify-center hover:border-white/40 transition-all duration-300 shadow-lg hidden lg:flex"
      >
        {isOpen ? (
          <X className="w-5 h-5 text-white" />
        ) : (
          <List className="w-5 h-5 text-white" />
        )}
      </motion.button>

      {/* TOC Panel */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, x: 100 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 100 }}
            transition={{ duration: 0.3, ease: [0.76, 0, 0.24, 1] }}
            className="fixed right-6 top-48 z-40 w-80 max-h-[60vh] overflow-y-auto bg-black/90 backdrop-blur-xl border border-white/10 rounded-2xl p-6 shadow-2xl hidden lg:block"
          >
            <h4 className="text-sm font-bold text-white/90 uppercase tracking-wider mb-4">
              Contenido
            </h4>
            <nav className="space-y-2">
              {headings.map((heading, index) => (
                <motion.button
                  key={heading.id}
                  onClick={() => scrollToSection(heading.id)}
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.05 }}
                  className={`w-full text-left px-3 py-2 rounded-lg text-sm transition-all duration-300 ${
                    activeSection === heading.id
                      ? 'bg-gradient-to-r from-purple-500/20 to-fuchsia-500/20 text-white border border-white/20'
                      : 'text-white/60 hover:text-white hover:bg-white/5'
                  }`}
                >
                  <span className="flex items-start gap-2">
                    <span className={`flex-shrink-0 w-1.5 h-1.5 rounded-full mt-1.5 ${
                      activeSection === heading.id ? 'bg-fuchsia-400' : 'bg-white/30'
                    }`} />
                    <span className="line-clamp-2">{heading.title}</span>
                  </span>
                </motion.button>
              ))}
            </nav>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}

export default TableOfContents
