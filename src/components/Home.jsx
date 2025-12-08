import { motion, useInView } from 'framer-motion'
import { useRef } from 'react'
import { Link } from 'react-router-dom'
import { ArrowRight, Sparkles } from 'lucide-react'

const Home = () => {
  const heroRef = useRef(null)
  const isHeroInView = useInView(heroRef, { once: true, amount: 0.3 })

  return (
    <section 
      ref={heroRef}
      id="home" 
      className="relative h-screen w-full overflow-hidden flex items-center justify-center"
    >
      {/* Video Background */}
      <video
        autoPlay
        loop
        muted
        playsInline
        className="absolute inset-0 w-full h-full object-cover"
      >
        <source src="/HERO HOME.mp4" type="video/mp4" />
      </video>

      {/* Overlay oscuro cinematográfico */}
      <div className="absolute inset-0 bg-gradient-to-b from-black/70 via-black/50 to-black" />

      {/* Orbs sutiles */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-purple-600/10 rounded-full blur-3xl" />
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-fuchsia-600/10 rounded-full blur-3xl" />
      </div>

      {/* Contenido Principal */}
      <div className="relative z-10 max-w-6xl mx-auto px-6 lg:px-20 text-center">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isHeroInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8 }}
          className="space-y-8"
        >
          {/* Badge superior */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={isHeroInView ? { opacity: 1, scale: 1 } : {}}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="inline-flex items-center gap-2 px-4 py-2 bg-white/5 backdrop-blur-sm border border-white/10 rounded-full"
          >
            <Sparkles className="w-4 h-4 text-purple-400" />
            <span className="text-sm text-white/90 font-light">Psicología × Diseño × Tecnología</span>
          </motion.div>

          {/* Título principal con efecto 3D */}
          <h1 className="text-5xl lg:text-8xl font-bold font-display leading-tight">
            <span className="block text-white drop-shadow-2xl" style={{ 
              textShadow: '0 0 80px rgba(168, 85, 247, 0.5), 0 0 40px rgba(217, 70, 239, 0.3)'
            }}>
              Construimos
            </span>
            <span className="block bg-gradient-to-r from-purple-400 via-fuchsia-500 to-purple-600 bg-clip-text text-transparent">
              Tu Marca
            </span>
          </h1>

          {/* Subtítulo elegante */}
          <p className="text-xl lg:text-2xl text-white/80 max-w-3xl mx-auto font-light leading-relaxed">
            Identidad de marca con fundamento psicológico.
            <br className="hidden lg:block" />
            Diseño que conecta, tecnología que convierte.
          </p>

          {/* Línea decorativa */}
          <div className="h-px bg-gradient-to-r from-transparent via-white/20 to-transparent w-80 mx-auto" />

          {/* Botones CTA */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={isHeroInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4"
          >
            {/* Botón principal */}
            <Link
              to="/servicios"
              className="group relative px-8 py-4 bg-white text-black font-semibold rounded-full overflow-hidden transition-all hover:scale-105 hover:shadow-2xl hover:shadow-purple-500/50"
            >
              <span className="relative z-10 flex items-center gap-2">
                Ver Servicios
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </span>
              <div className="absolute inset-0 bg-gradient-to-r from-purple-500 to-fuchsia-500 opacity-0 group-hover:opacity-100 transition-opacity" />
            </Link>

            {/* Botón secundario */}
            <Link
              to="/contacto"
              className="group px-8 py-4 bg-white/10 backdrop-blur-sm text-white font-semibold rounded-full border border-white/20 hover:bg-white/20 hover:border-white/40 transition-all hover:scale-105"
            >
              <span className="flex items-center gap-2">
                Agendar Consulta
                <Sparkles className="w-5 h-5" />
              </span>
            </Link>
          </motion.div>
        </motion.div>
      </div>

      {/* Scroll indicator */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.2 }}
        className="absolute bottom-8 left-1/2 -translate-x-1/2"
      >
        <motion.div
          animate={{ y: [0, 10, 0] }}
          transition={{ duration: 2, repeat: Infinity }}
          className="w-6 h-10 border-2 border-white/30 rounded-full flex items-start justify-center p-2"
        >
          <div className="w-1 h-2 bg-white/60 rounded-full" />
        </motion.div>
      </motion.div>
    </section>
  )
}

export default Home
