import { motion, AnimatePresence } from 'framer-motion'
import { useState, useEffect } from 'react'

const CountriesSection = () => {
  const countries = [
    'United States',
    'Mexico',
    'Spain',
    'Germany',
    'France',
    'Italy',
    'Czech Republic',
    'United Kingdom',
    'Canada',
    'Brazil',
    'Argentina',
    'Australia',
    'Japan',
    'Netherlands',
    'Switzerland',
    'Austria',
    'Portugal',
    'Poland',
    'Sweden',
    'Norway'
  ]

  const [currentCountryIndex, setCurrentCountryIndex] = useState(0)

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentCountryIndex((prevIndex) => (prevIndex + 1) % countries.length)
    }, 2000) // Cambia cada 2 segundos

    return () => clearInterval(interval)
  }, [countries.length])

  return (
    <section className="relative min-h-screen bg-gradient-to-b from-black via-zinc-950 to-black flex items-center justify-center py-32 overflow-hidden">
      {/* Efectos decorativos sutiles */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <motion.div
          animate={{ 
            scale: [1, 1.2, 1],
            opacity: [0.02, 0.03, 0.02]
          }}
          transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
          className="absolute top-1/3 left-1/4 w-[500px] h-[500px] bg-amber-600 rounded-full blur-3xl"
        />
        <motion.div
          animate={{ 
            scale: [1, 1.3, 1],
            opacity: [0.01, 0.02, 0.01]
          }}
          transition={{ duration: 10, repeat: Infinity, ease: "easeInOut", delay: 2 }}
          className="absolute bottom-1/3 right-1/4 w-[600px] h-[600px] bg-amber-500 rounded-full blur-3xl"
        />
      </div>

      <div className="relative max-w-6xl mx-auto px-6 lg:px-12 text-center">
        {/* Texto principal - Primera línea */}
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1.5, ease: [0.76, 0, 0.24, 1] }}
          className="mb-6"
        >
          <h2 className="text-white text-4xl lg:text-6xl font-light tracking-[0.25em] leading-tight" style={{ fontFamily: 'Gotham, sans-serif' }}>
            I HAVE WORKED
          </h2>
        </motion.div>

        {/* Segunda línea */}
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1.5, delay: 0.2, ease: [0.76, 0, 0.24, 1] }}
          className="mb-16"
        >
          <h2 className="text-white text-4xl lg:text-6xl font-light tracking-[0.25em] leading-tight" style={{ fontFamily: 'Gotham, sans-serif' }}>
            WITH PEOPLE FROM
          </h2>
        </motion.div>

        {/* Línea decorativa antes del país */}
        <motion.div
          initial={{ scaleX: 0 }}
          animate={{ scaleX: 1 }}
          transition={{ duration: 1.5, delay: 0.4 }}
          className="h-px bg-gradient-to-r from-transparent via-amber-600/40 to-transparent mx-auto w-96 mb-12"
        />

        {/* País cambiante con animación */}
        <div className="relative h-32 flex items-center justify-center mb-12">
          <AnimatePresence mode="wait">
            <motion.div
              key={currentCountryIndex}
              initial={{ opacity: 0, y: 30, scale: 0.8 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -30, scale: 0.8 }}
              transition={{ duration: 0.6, ease: [0.76, 0, 0.24, 1] }}
              className="absolute"
            >
              <h3 className="text-amber-400 text-5xl lg:text-7xl font-light tracking-[0.2em]" style={{ fontFamily: 'Gotham, sans-serif' }}>
                {countries[currentCountryIndex]}
              </h3>
              
              {/* Efecto de brillo alrededor del país */}
              <motion.div
                animate={{ opacity: [0.3, 0.6, 0.3] }}
                transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
                className="absolute inset-0 bg-amber-600/10 blur-2xl -z-10"
              />
            </motion.div>
          </AnimatePresence>
        </div>

        {/* Línea decorativa después del país */}
        <motion.div
          initial={{ scaleX: 0 }}
          animate={{ scaleX: 1 }}
          transition={{ duration: 1.5, delay: 0.6 }}
          className="h-px bg-gradient-to-r from-transparent via-amber-600/40 to-transparent mx-auto w-96 mb-16"
        />

        {/* Pregunta final */}
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1.5, delay: 0.8, ease: [0.76, 0, 0.24, 1] }}
          className="mt-20"
        >
          <h2 className="text-white/90 text-3xl lg:text-5xl font-light tracking-[0.3em] italic" style={{ fontFamily: 'Gotham, sans-serif' }}>
            And where are you from?
          </h2>
        </motion.div>

        {/* Puntos decorativos */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 2, delay: 1.2 }}
          className="mt-16 flex justify-center gap-3"
        >
          {[...Array(5)].map((_, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, scale: 0 }}
              animate={{ opacity: 0.4, scale: 1 }}
              transition={{ duration: 0.5, delay: 1.2 + i * 0.1 }}
              className="w-2 h-2 bg-amber-600 rounded-full"
            />
          ))}
        </motion.div>
      </div>
    </section>
  )
}

export default CountriesSection
