import { motion, useInView } from 'framer-motion'
import { useRef, useState } from 'react'
import { Play, Volume2, Sparkles } from 'lucide-react'

const LuxmaniaVideoSection = () => {
  const ref = useRef(null)
  const videoRef = useRef(null)
  const isInView = useInView(ref, { once: true, amount: 0.3 })
  const [isPlaying, setIsPlaying] = useState(false)

  const handlePlay = () => {
    if (videoRef.current) {
      videoRef.current.play()
      setIsPlaying(true)
    }
  }

  return (
    <div ref={ref} className="relative py-32 lg:py-40 px-6 lg:px-20 overflow-hidden bg-gradient-to-b from-black via-blue-950/20 to-black">
      {/* Background gradient orbs - Azules luminosos */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-[600px] h-[600px] bg-blue-600/20 rounded-full blur-3xl animate-pulse" />
        <div className="absolute top-1/2 right-1/3 w-[500px] h-[500px] bg-cyan-500/15 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }} />
        <div className="absolute bottom-1/4 left-1/3 w-[400px] h-[400px] bg-indigo-600/20 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '2s' }} />
      </div>

      <div className="relative max-w-7xl mx-auto">
        <div className="grid lg:grid-cols-2 gap-16 lg:gap-20 items-center">
          
          {/* Left: Copy minimalista y directo */}
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={isInView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 1 }}
            className="text-center lg:text-left space-y-8"
          >
            {/* Título: LUXMANIA grande arriba */}
            <div className="space-y-3">
              <motion.h2
                initial={{ opacity: 0, y: 20 }}
                animate={isInView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.8, delay: 0.2 }}
                className="text-7xl lg:text-8xl font-bold font-display tracking-tight relative"
              >
                <span className="text-white">LUX</span>
                <span className="relative inline-block">
                  {/* Capa 1 - Onda azul */}
                  <motion.span
                    animate={{
                      backgroundPosition: ['0% 0%', '100% 100%']
                    }}
                    transition={{
                      duration: 3,
                      repeat: Infinity,
                      ease: "linear"
                    }}
                    style={{
                      background: 'linear-gradient(135deg, transparent 0%, transparent 40%, #3b82f6 50%, transparent 60%, transparent 100%)',
                      backgroundSize: '200% 200%',
                      WebkitBackgroundClip: 'text',
                      backgroundClip: 'text',
                      WebkitTextFillColor: 'transparent',
                    }}
                    className="absolute inset-0"
                  >
                    MANIA
                  </motion.span>
                  
                  {/* Capa 2 - Onda fucsia */}
                  <motion.span
                    animate={{
                      backgroundPosition: ['0% 0%', '100% 100%']
                    }}
                    transition={{
                      duration: 4,
                      repeat: Infinity,
                      ease: "linear",
                      delay: 0.5
                    }}
                    style={{
                      background: 'linear-gradient(135deg, transparent 0%, transparent 40%, #d946ef 50%, transparent 60%, transparent 100%)',
                      backgroundSize: '200% 200%',
                      WebkitBackgroundClip: 'text',
                      backgroundClip: 'text',
                      WebkitTextFillColor: 'transparent',
                    }}
                    className="absolute inset-0"
                  >
                    MANIA
                  </motion.span>
                  
                  {/* Capa 3 - Onda morada */}
                  <motion.span
                    animate={{
                      backgroundPosition: ['0% 0%', '100% 100%']
                    }}
                    transition={{
                      duration: 5,
                      repeat: Infinity,
                      ease: "linear",
                      delay: 1
                    }}
                    style={{
                      background: 'linear-gradient(135deg, transparent 0%, transparent 40%, #a855f7 50%, transparent 60%, transparent 100%)',
                      backgroundSize: '200% 200%',
                      WebkitBackgroundClip: 'text',
                      backgroundClip: 'text',
                      WebkitTextFillColor: 'transparent',
                    }}
                    className="absolute inset-0"
                  >
                    MANIA
                  </motion.span>
                  
                  {/* Capa base - Morado */}
                  <span className="text-purple-500/40 relative">MANIA</span>
                </span>
              </motion.h2>

              {/* Pregunta más pequeña */}
              <motion.p
                initial={{ opacity: 0, y: 10 }}
                animate={isInView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.8, delay: 0.3 }}
                className="text-2xl lg:text-3xl text-white/60 font-light"
              >
                ¿Cómo construimos marcas?
              </motion.p>
            </div>

            {/* Mensaje central minimalista */}
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.8, delay: 0.4 }}
              className="text-lg lg:text-xl text-white/70 font-light leading-relaxed max-w-xl mx-auto lg:mx-0"
            >
              Diseñamos emociones. Creamos identidades visuales que se sienten antes de entenderse.
            </motion.p>

            {/* Puntos clave con iconos elegantes */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={isInView ? { opacity: 1 } : {}}
              transition={{ duration: 1, delay: 0.6 }}
              className="space-y-4 max-w-md mx-auto lg:mx-0"
            >
              <div className="flex items-start gap-3">
                <div className="mt-1.5 w-1.5 h-1.5 rounded-full bg-cyan-400 flex-shrink-0" />
                <p className="text-white/60 text-base font-light">Un color dirige la atención</p>
              </div>
              <div className="flex items-start gap-3">
                <div className="mt-1.5 w-1.5 h-1.5 rounded-full bg-blue-400 flex-shrink-0" />
                <p className="text-white/60 text-base font-light">Una forma despierta emociones</p>
              </div>
              <div className="flex items-start gap-3">
                <div className="mt-1.5 w-1.5 h-1.5 rounded-full bg-indigo-400 flex-shrink-0" />
                <p className="text-white/60 text-base font-light">El orden visual guía el deseo</p>
              </div>
            </motion.div>

            {/* Badges elegantes */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={isInView ? { opacity: 1 } : {}}
              transition={{ duration: 1, delay: 0.8 }}
              className="flex flex-wrap gap-3 justify-center lg:justify-start"
            >
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-blue-500/10 border border-blue-400/20 backdrop-blur-sm">
                <Sparkles className="w-4 h-4 text-blue-400" />
                <span className="text-sm text-blue-300/90 font-medium">Psicología + Diseño</span>
              </div>
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-cyan-500/10 border border-cyan-400/20 backdrop-blur-sm">
                <div className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse" />
                <span className="text-sm text-cyan-300/90 font-medium">Identidades con Alma</span>
              </div>
            </motion.div>
          </motion.div>

          {/* Right: Video 3:4 con marco premium */}
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            animate={isInView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 1, delay: 0.3 }}
            className="relative group"
          >
            {/* Container con fade out elegante */}
            <div className="relative aspect-[3/4] max-w-md mx-auto">
              {/* Video Container */}
              <div className="relative w-full h-full rounded-3xl overflow-hidden bg-black">
                {/* Video - usando iframe de YouTube en HD */}
                <iframe
                  ref={videoRef}
                  className="absolute inset-0 w-full h-full"
                  src={`https://www.youtube.com/embed/OUsF8K7G810?autoplay=${isPlaying ? 1 : 0}&controls=1&rel=0&modestbranding=1&enablejsapi=1&hd=1`}
                  title="Luxmania Video"
                  frameBorder="0"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                />

                {/* Animación de carga mientras el video inicia */}
                {isPlaying && (
                  <motion.div
                    initial={{ opacity: 1 }}
                    animate={{ opacity: 0 }}
                    transition={{ duration: 0.5, delay: 2 }}
                    className="absolute inset-0 bg-black flex flex-col items-center justify-center gap-6 z-[15] pointer-events-none"
                  >
                    {/* Cerebro animado */}
                    <div className="relative">
                      {/* Círculos pulsantes tipo cerebro */}
                      <motion.div
                        animate={{
                          scale: [1, 1.2, 1],
                          opacity: [0.3, 0.6, 0.3]
                        }}
                        transition={{
                          duration: 2,
                          repeat: Infinity,
                          ease: "easeInOut"
                        }}
                        className="absolute inset-0 w-20 h-20 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 blur-xl"
                      />
                      <motion.div
                        animate={{
                          rotate: 360
                        }}
                        transition={{
                          duration: 3,
                          repeat: Infinity,
                          ease: "linear"
                        }}
                        className="relative w-16 h-16"
                      >
                        <Sparkles className="w-16 h-16 text-cyan-400" />
                      </motion.div>
                    </div>
                    
                    {/* Texto Cargando */}
                    <motion.p
                      animate={{ opacity: [0.5, 1, 0.5] }}
                      transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
                      className="text-white/80 text-lg font-light tracking-wider"
                    >
                      Cargando...
                    </motion.p>
                  </motion.div>
                )}

              {/* Fade out elegante hacia negro en los bordes */}
              <div className="absolute inset-0 pointer-events-none z-[5]" style={{
                background: 'radial-gradient(ellipse 85% 85% at center, transparent 50%, rgba(0,0,0,0.4) 75%, rgba(0,0,0,0.8) 100%)'
              }} />

              {/* Overlay inicial con instrucciones - se puede cerrar al hacer click */}
              {!isPlaying && (
                <motion.div
                  initial={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.3 }}
                  onClick={() => setIsPlaying(true)}
                  className="absolute inset-0 bg-gradient-to-b from-black/70 via-black/50 to-black/70 backdrop-blur-sm flex flex-col items-center justify-center p-8 z-10 cursor-pointer"
                >
                  {/* Play Button */}
                  <motion.div
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.95 }}
                    className="mb-8 w-20 h-20 rounded-full bg-gradient-to-br from-blue-500 to-cyan-400 flex items-center justify-center shadow-lg shadow-blue-500/50"
                  >
                    <Play className="w-10 h-10 text-white ml-1" strokeWidth={2} fill="white" />
                  </motion.div>

                  {/* Mensaje elegante */}
                  <div className="text-center space-y-4">
                    <div className="flex items-center justify-center gap-3">
                      <Volume2 className="w-6 h-6 text-cyan-400 animate-pulse" />
                      <p className="text-white text-lg font-medium">
                        Sube el volumen
                      </p>
                    </div>
                    <p className="text-white/70 text-sm font-light max-w-xs">
                      Dale play para descubrir qué es Luxmania
                    </p>
                  </div>

                  {/* Indicador decorativo */}
                  <motion.div
                    animate={{
                      opacity: [0.3, 0.6, 0.3],
                    }}
                    transition={{
                      duration: 2,
                      repeat: Infinity,
                      ease: "easeInOut"
                    }}
                    className="absolute bottom-8 left-1/2 -translate-x-1/2"
                  >
                    <div className="flex gap-2">
                      <div className="w-2 h-2 rounded-full bg-cyan-400/60" />
                      <div className="w-2 h-2 rounded-full bg-blue-400/60" />
                      <div className="w-2 h-2 rounded-full bg-indigo-400/60" />
                    </div>
                  </motion.div>
                </motion.div>
              )}
              </div>

              {/* Glow effect azul sutil */}
              <div className="absolute -inset-4 bg-gradient-to-r from-blue-500/20 via-cyan-400/20 to-indigo-500/20 rounded-3xl blur-3xl opacity-40 group-hover:opacity-70 transition-opacity duration-500 -z-10" />
            </div>

            {/* Texto elegante debajo del video */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.8, delay: 1 }}
              className="mt-8 flex items-center justify-center gap-3"
            >
              <div className="w-1 h-1 rounded-full bg-cyan-400 animate-pulse" />
              <p className="text-white/60 text-sm font-light tracking-wide uppercase">
                Psicología × Diseño × Tecnología
              </p>
              <div className="w-1 h-1 rounded-full bg-blue-400 animate-pulse" style={{ animationDelay: '0.5s' }} />
            </motion.div>
          </motion.div>

        </div>
      </div>
    </div>
  )
}

export default LuxmaniaVideoSection
