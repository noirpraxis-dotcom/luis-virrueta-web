import { motion } from 'framer-motion'
import VideoBackground from './VideoBackground'

const Home = () => {
  return (
    <section id="home" className="relative min-h-screen">
      {/* Video/Image Background */}
      <VideoBackground />
      
      {/* Overlay con gradiente para mejor legibilidad */}
      <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-black/20 to-transparent" />
      
      {/* Contenido superpuesto - Preview About */}
      <div className="absolute inset-0 flex items-end justify-center pb-20 lg:pb-32">
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 0.5, ease: [0.76, 0, 0.24, 1] }}
          className="max-w-4xl mx-auto px-6 lg:px-12 text-center"
        >
          {/* Título elegante */}
          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 0.7 }}
            className="text-white text-5xl lg:text-7xl font-light tracking-[0.15em] mb-6"
            style={{ fontFamily: 'Gotham, sans-serif' }}
          >
            Zuzana Erdösová
          </motion.h1>

          {/* Línea decorativa */}
          <motion.div
            initial={{ scaleX: 0 }}
            animate={{ scaleX: 1 }}
            transition={{ duration: 1, delay: 0.9 }}
            className="h-px bg-gradient-to-r from-transparent via-white/60 to-transparent mx-auto w-64 mb-8"
          />

          {/* Fragmento resumido */}
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 1.1 }}
            className="text-white/90 text-lg lg:text-xl font-light leading-relaxed tracking-wide mb-10 max-w-3xl mx-auto backdrop-blur-sm bg-black/10 p-6 rounded-2xl"
            style={{ fontFamily: 'Gotham, sans-serif' }}
          >
            Certified Past Life Regression therapist, energy healer, and channeler of Ilyari. 
            Former university researcher with two doctorates exploring the intuitive and scientific aspects of energy healing.
          </motion.p>

          {/* Botón "Ver más" */}
          <motion.a
            href="#about"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 1.3 }}
            whileHover={{ scale: 1.05, y: -2 }}
            whileTap={{ scale: 0.95 }}
            className="inline-flex items-center gap-3 px-8 py-4 bg-white/10 backdrop-blur-md border border-white/30 rounded-full text-white text-sm tracking-[0.2em] uppercase font-light hover:bg-white/20 transition-all duration-300 shadow-2xl group"
            style={{ fontFamily: 'Gotham, sans-serif' }}
          >
            <span>Ver más</span>
            <motion.svg
              className="w-5 h-5"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              initial={{ x: 0 }}
              animate={{ x: [0, 5, 0] }}
              transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
            </motion.svg>
          </motion.a>

          {/* Indicador de scroll */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1, delay: 1.5 }}
            className="absolute bottom-8 left-1/2 -translate-x-1/2"
          >
            <motion.div
              animate={{ y: [0, 10, 0] }}
              transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
              className="w-6 h-10 border-2 border-white/40 rounded-full flex items-start justify-center p-2"
            >
              <motion.div
                animate={{ y: [0, 12, 0] }}
                transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
                className="w-1.5 h-1.5 bg-white/60 rounded-full"
              />
            </motion.div>
          </motion.div>
        </motion.div>
      </div>
    </section>
  )
}

export default Home
