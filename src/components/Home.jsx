import { motion, useInView } from 'framer-motion'
import { useRef, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { ArrowRight, Brain, Palette, Code, Gem } from 'lucide-react'

const Home = () => {
  const heroRef = useRef(null)
  const videoRef = useRef(null)
  const isHeroInView = useInView(heroRef, { once: true, amount: 0.3 })

  // Loop reversible para el video
  useEffect(() => {
    const video = videoRef.current
    if (!video) return

    let direction = 1 // 1 = forward, -1 = reverse

    const handleTimeUpdate = () => {
      if (direction === 1 && video.currentTime >= video.duration - 0.1) {
        // Llegó al final, ir en reversa
        direction = -1
      } else if (direction === -1 && video.currentTime <= 0.1) {
        // Llegó al inicio, ir hacia adelante
        direction = 1
      }

      // Simular reversa cambiando la velocidad del tiempo
      if (direction === -1) {
        video.currentTime = Math.max(0, video.currentTime - 0.033) // ~30fps en reversa
      }
    }

    video.addEventListener('timeupdate', handleTimeUpdate)
    return () => video.removeEventListener('timeupdate', handleTimeUpdate)
  }, [])

  return (
    <section 
      ref={heroRef}
      id="home" 
      className="relative h-screen w-full overflow-hidden flex items-center justify-center"
    >
      {/* Video Background con loop reversible */}
      <video
        ref={videoRef}
        autoPlay
        muted
        playsInline
        className="absolute inset-0 w-full h-full object-cover"
      >
        <source src="/HERO HOME.mp4" type="video/mp4" />
      </video>

      {/* Overlay oscuro cinematográfico - Más transparente */}
      <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-black/30 to-black/60" />

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
          {/* Badge superior - Estilo Portafolio */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={isHeroInView ? { opacity: 1, scale: 1 } : {}}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="inline-flex items-center gap-3 px-6 py-3 border border-white/20 rounded-full backdrop-blur-sm bg-white/5 mb-4"
          >
            <Gem className="w-4 h-4 text-white/60" strokeWidth={1.5} />
            <span className="text-sm text-white/80 font-light tracking-wider uppercase">
              Identidad Visual con Fundamento
            </span>
          </motion.div>

          {/* Título principal con efecto 3D - Estilo Portafolio */}
          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={isHeroInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 1, delay: 0.2 }}
            className="font-display leading-tight mb-8"
          >
            {/* Construimos - más pequeño */}
            <span className="block text-white/70 text-2xl lg:text-4xl mb-3" style={{ fontWeight: 200, letterSpacing: '0.15em', textTransform: 'uppercase' }}>
              Construimos
            </span>
            
            {/* Tu Marca - grande con efecto 3D */}
            <span className="block text-6xl lg:text-9xl" style={{ 
              letterSpacing: '0.08em',
              fontWeight: 300,
              textTransform: 'uppercase'
            }}>
              <span className="relative inline-block">
                {/* T con degradado inclinada a la izquierda */}
                <span className="relative inline-block" style={{ transform: 'rotate(-8deg)', transformOrigin: 'center bottom', display: 'inline-block' }}>
                  <span className="absolute inset-0 bg-gradient-to-br from-purple-400 via-white to-white bg-clip-text text-transparent blur-sm" style={{ transform: 'translateY(-2px)' }}>T</span>
                  <span className="relative text-white">T</span>
                </span>
                {/* u Marc */}
                <span className="text-white">u Marc</span>
                {/* a con degradado inclinada a la derecha */}
                <span className="relative inline-block" style={{ transform: 'rotate(8deg)', transformOrigin: 'center bottom', display: 'inline-block' }}>
                  <span className="absolute inset-0 bg-gradient-to-tl from-cyan-400 via-white to-white bg-clip-text text-transparent blur-sm" style={{ transform: 'translateY(-2px)' }}>a</span>
                  <span className="relative text-white">a</span>
                </span>
              </span>
            </span>
          </motion.h1>

          {/* Fórmula con iconos - Estilo Portafolio */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={isHeroInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.8, delay: 0.3 }}
            className="flex items-center gap-3 lg:gap-4 flex-wrap justify-center mb-8"
          >
            {/* Psicología */}
            <div className="flex items-center gap-2">
              <Brain className="w-5 h-5 text-white/70" strokeWidth={1.5} />
              <span className="text-sm lg:text-base text-white/60 font-light tracking-wide">
                Psicología
              </span>
            </div>

            <span className="text-white/40 text-xs">+</span>

            {/* Diseño */}
            <div className="flex items-center gap-2">
              <Palette className="w-5 h-5 text-white/70" strokeWidth={1.5} />
              <span className="text-sm lg:text-base text-white/60 font-light tracking-wide">
                Diseño
              </span>
            </div>

            <span className="text-white/40 text-xs">+</span>

            {/* Tecnología */}
            <div className="flex items-center gap-2">
              <Code className="w-5 h-5 text-white/70" strokeWidth={1.5} />
              <span className="text-sm lg:text-base text-white/60 font-light tracking-wide">
                Tecnología
              </span>
            </div>
          </motion.div>

          {/* Línea decorativa animada */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={isHeroInView ? { opacity: 1 } : {}}
            transition={{ duration: 1, delay: 0.4 }}
            className="relative h-px mx-auto w-80 overflow-hidden mb-8"
          >
            <motion.div
              initial={{ scaleX: 0 }}
              animate={isHeroInView ? { scaleX: 1 } : {}}
              transition={{ duration: 1.2, delay: 0.5, ease: [0.76, 0, 0.24, 1] }}
              className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent"
              style={{ transformOrigin: 'center' }}
            />
          </motion.div>

          {/* Botones CTA - Mejorados */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={isHeroInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.8, delay: 0.6 }}
            className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4"
          >
            {/* Botón principal - Más elegante */}
            <Link
              to="/servicios"
              className="group relative px-10 py-5 bg-white text-black font-light rounded-full overflow-hidden transition-all duration-500 hover:scale-[1.02] hover:shadow-[0_20px_80px_rgba(255,255,255,0.3)]"
            >
              {/* Efecto shine continuo */}
              <motion.div
                animate={{
                  x: ['-100%', '200%']
                }}
                transition={{
                  duration: 3,
                  repeat: Infinity,
                  ease: "easeInOut",
                  repeatDelay: 1
                }}
                className="absolute inset-0 w-1/3 bg-gradient-to-r from-transparent via-white/40 to-transparent skew-x-12"
              />
              <span className="relative z-10 flex items-center gap-3 text-base tracking-wide">
                <span>Explorar Servicios</span>
                <svg className="w-5 h-5 group-hover:rotate-12 transition-transform duration-300" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
              </span>
            </Link>

            {/* Botón secundario - Más sutil */}
            <Link
              to="/contacto"
              className="group relative px-10 py-5 text-white font-light rounded-full border border-white/30 hover:border-white/60 transition-all duration-500 hover:scale-[1.02] overflow-hidden"
            >
              <div className="absolute inset-0 bg-white/5 backdrop-blur-sm transition-opacity duration-300 group-hover:bg-white/10" />
              <span className="relative z-10 flex items-center gap-3 text-base tracking-wide">
                <span>Agendar Consulta</span>
                <svg className="w-5 h-5 group-hover:rotate-12 transition-transform duration-300" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
              </span>
            </Link>
          </motion.div>
        </motion.div>
      </div>

      {/* Scroll indicator con texto */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.2 }}
        className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-3"
      >
        <motion.p
          animate={{ opacity: [0.5, 1, 0.5] }}
          transition={{ duration: 2, repeat: Infinity }}
          className="text-white/50 text-xs font-light tracking-widest uppercase"
        >
          Desliza para conocer más
        </motion.p>
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
