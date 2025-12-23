import { motion, useInView } from 'framer-motion'
import { useMemo, useRef, useState } from 'react'
import { Share2, Copy, CheckCircle, ArrowLeft, Home, Eye, Map, ChevronLeft, ChevronRight, Sparkles, Compass } from 'lucide-react'
import { useNavigate } from 'react-router-dom'

// Catálogo de imágenes del Atlas de la Humanidad
const ATLAS_IMAGES = [
  {
    id: '001',
    title: 'Partida sin ensayo',
    description: 'Como en el ajedrez, la vida parece regirse por reglas: estudiar, elegir, avanzar, ganar o perder. Sin embargo, el sujeto no ve el tablero completo. La venda representa lo real: ese punto donde el sentido falla y no hay garantía. Milan Kundera lo intuía al decir que la vida es un ensayo para una obra que nunca ocurre. Aquí, cada decisión es definitiva precisamente porque no puede probarse antes. El error no es elegir mal, sino creer que alguna vez se elige con certeza.',
    image: '/atlas de la humanidad/partida sin ensayo.png',
    color: '#4A5568', // gris azulado
    icon: Compass
  },
  {
    id: '002',
    title: 'Cómo no electrocutarse',
    description: 'En la imagen se observa a alguien en un estado de extrema cautela: el cuerpo inmóvil, la respiración contenida, la atención puesta en no cometer un solo error. No porque algo esté ocurriendo, sino porque podría ocurrir. Psíquicamente, esta escena representa a quienes viven en relaciones donde saben que el otro puede estallar en cualquier momento. Cada palabra, cada gesto, cada silencio se mide para no "activar" algo. El vínculo deja de ser encuentro y se convierte en supervivencia emocional.',
    image: '/atlas de la humanidad/como no electrocutarse.jpg',
    color: '#7C3AED', // púrpura eléctrico
    icon: Sparkles
  }
]

const AtlasHumanidadPage = () => {
  const navigate = useNavigate()
  const [currentIndex, setCurrentIndex] = useState(0)
  const [copied, setCopied] = useState(false)
  const [shared, setShared] = useState(false)
  const heroRef = useRef(null)
  const isHeroInView = useInView(heroRef, { once: true, amount: 0.3 })

  const currentImage = ATLAS_IMAGES[currentIndex]

  const handlePrevious = () => {
    setCurrentIndex((prev) => (prev - 1 + ATLAS_IMAGES.length) % ATLAS_IMAGES.length)
  }

  const handleNext = () => {
    setCurrentIndex((prev) => (prev + 1) % ATLAS_IMAGES.length)
  }

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(`${currentImage.title}\n\n${currentImage.description}`)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch (err) {
      console.error('Error al copiar:', err)
    }
  }

  const handleShare = async () => {
    const shareData = {
      title: `Atlas de la Humanidad - ${currentImage.title}`,
      text: currentImage.description,
      url: window.location.href
    }

    if (navigator.share) {
      try {
        await navigator.share(shareData)
        setShared(true)
        setTimeout(() => setShared(false), 2000)
      } catch (err) {
        if (err.name !== 'AbortError') {
          console.error('Error al compartir:', err)
        }
      }
    } else {
      handleCopy()
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-black via-[#0a0a0f] to-black text-white overflow-hidden">
      {/* Fondo atmosférico con partículas */}
      <div className="fixed inset-0 pointer-events-none z-0">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-gray-800/20 via-black to-black"></div>
        {[...Array(30)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-1 h-1 bg-white/20 rounded-full"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
            }}
            animate={{
              opacity: [0.2, 0.5, 0.2],
              scale: [1, 1.5, 1],
            }}
            transition={{
              duration: 3 + Math.random() * 2,
              repeat: Infinity,
              delay: Math.random() * 2,
            }}
          />
        ))}
      </div>

      {/* Header Navigation */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="relative z-50 pt-8 px-6 md:px-12 flex items-center justify-between"
      >
        <button
          onClick={() => navigate(-1)}
          className="group flex items-center gap-2 text-gray-400 hover:text-white transition-colors"
        >
          <ArrowLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
          <span className="text-sm font-light">Volver</span>
        </button>

        <button
          onClick={() => navigate('/')}
          className="group flex items-center gap-2 text-gray-400 hover:text-white transition-colors"
        >
          <Home className="w-5 h-5" />
          <span className="text-sm font-light">Inicio</span>
        </button>
      </motion.div>

      {/* Hero Section */}
      <motion.section
        ref={heroRef}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1 }}
        className="relative z-10 pt-12 pb-20 px-6 md:px-12"
      >
        <div className="max-w-7xl mx-auto">
          {/* Título Principal */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={isHeroInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.8 }}
            className="text-center mb-16"
          >
            <div className="flex items-center justify-center gap-4 mb-6">
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
              >
                <Map className="w-8 h-8 text-gray-400" />
              </motion.div>
              <h1 className="text-5xl md:text-7xl font-bold bg-gradient-to-r from-gray-200 via-gray-400 to-gray-600 bg-clip-text text-transparent tracking-tight">
                Atlas de la Humanidad
              </h1>
              <motion.div
                animate={{ rotate: -360 }}
                transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
              >
                <Eye className="w-8 h-8 text-gray-400" />
              </motion.div>
            </div>
            <p className="text-gray-400 text-lg md:text-xl font-light max-w-3xl mx-auto leading-relaxed">
              Una cartografía visual de la condición humana. Cada imagen es un territorio por descubrir,
              <br className="hidden md:block" />
              cada descripción, un mapa hacia lo que aún no sabemos que sabemos.
            </p>
          </motion.div>

          {/* Main Image Card */}
          <motion.div
            key={currentIndex}
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            transition={{ duration: 0.5 }}
            className="relative max-w-6xl mx-auto"
          >
            <div className="relative bg-gradient-to-br from-gray-900/50 to-black/50 backdrop-blur-sm rounded-3xl overflow-hidden border border-white/5 shadow-2xl">
              
              {/* Título arriba con ícono elegante */}
              <div className="relative p-8 md:p-12 pb-6 md:pb-8">
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2 }}
                  className="flex items-center justify-center gap-4"
                >
                  {/* Ícono izquierdo */}
                  <motion.div
                    animate={{ 
                      rotate: [0, 360],
                      scale: [1, 1.1, 1]
                    }}
                    transition={{ 
                      rotate: { duration: 20, repeat: Infinity, ease: "linear" },
                      scale: { duration: 3, repeat: Infinity, ease: "easeInOut" }
                    }}
                    className="relative"
                  >
                    {currentImage.icon && (
                      <currentImage.icon 
                        className="w-8 h-8 md:w-10 md:h-10 text-gray-400/60" 
                        strokeWidth={1.2}
                      />
                    )}
                  </motion.div>

                  {/* Línea decorativa izquierda */}
                  <div className="h-px w-12 md:w-20 bg-gradient-to-r from-transparent via-gray-600 to-gray-700"></div>

                  {/* Título */}
                  <h2 className="text-3xl md:text-5xl font-bold text-center bg-gradient-to-r from-white via-gray-300 to-gray-500 bg-clip-text text-transparent tracking-tight">
                    {currentImage.title}
                  </h2>

                  {/* Línea decorativa derecha */}
                  <div className="h-px w-12 md:w-20 bg-gradient-to-l from-transparent via-gray-600 to-gray-700"></div>

                  {/* Ícono derecho */}
                  <motion.div
                    animate={{ 
                      rotate: [0, -360],
                      scale: [1, 1.1, 1]
                    }}
                    transition={{ 
                      rotate: { duration: 20, repeat: Infinity, ease: "linear" },
                      scale: { duration: 3, repeat: Infinity, ease: "easeInOut", delay: 1.5 }
                    }}
                    className="relative"
                  >
                    {currentImage.icon && (
                      <currentImage.icon 
                        className="w-8 h-8 md:w-10 md:h-10 text-gray-400/60" 
                        strokeWidth={1.2}
                      />
                    )}
                  </motion.div>
                </motion.div>

                {/* Número de imagen con estilo premium */}
                {ATLAS_IMAGES.length > 1 && (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.4 }}
                    className="mt-4 text-center"
                  >
                    <span className="text-xs text-gray-500 tracking-[0.3em] uppercase font-light">
                      {String(currentIndex + 1).padStart(2, '0')} / {String(ATLAS_IMAGES.length).padStart(2, '0')}
                    </span>
                  </motion.div>
                )}
              </div>

              {/* Imagen Principal */}
              <div className="relative aspect-[16/10] overflow-hidden bg-black mx-8 md:mx-12 rounded-2xl border border-white/5">
                <motion.img
                  key={currentImage.id}
                  src={currentImage.image}
                  alt={currentImage.title}
                  className="w-full h-full object-cover"
                  initial={{ opacity: 0, scale: 1.05 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.8 }}
                />
                {/* Overlay gradient sutil */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent"></div>
                
                {/* Navigation Arrows - más elegantes */}
                {ATLAS_IMAGES.length > 1 && (
                  <>
                    <button
                      onClick={handlePrevious}
                      className="absolute left-4 top-1/2 -translate-y-1/2 w-12 h-12 md:w-14 md:h-14 rounded-full bg-black/70 backdrop-blur-md border border-white/20 flex items-center justify-center text-white hover:bg-black/90 hover:border-white/40 hover:scale-110 transition-all group shadow-xl"
                    >
                      <ChevronLeft className="w-6 h-6 group-hover:-translate-x-0.5 transition-transform" strokeWidth={1.5} />
                    </button>
                    <button
                      onClick={handleNext}
                      className="absolute right-4 top-1/2 -translate-y-1/2 w-12 h-12 md:w-14 md:h-14 rounded-full bg-black/70 backdrop-blur-md border border-white/20 flex items-center justify-center text-white hover:bg-black/90 hover:border-white/40 hover:scale-110 transition-all group shadow-xl"
                    >
                      <ChevronRight className="w-6 h-6 group-hover:translate-x-0.5 transition-transform" strokeWidth={1.5} />
                    </button>
                  </>
                )}
              </div>

              {/* Descripción abajo con diseño premium */}
              <div className="p-8 md:p-12 pt-8 md:pt-10">
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.5 }}
                  className="relative"
                >
                  {/* Línea decorativa superior */}
                  <div className="flex items-center justify-center mb-8">
                    <div className="h-px w-full max-w-2xl bg-gradient-to-r from-transparent via-gray-700 to-transparent"></div>
                  </div>

                  {/* Descripción con comillas elegantes */}
                  <div className="relative max-w-5xl mx-auto">
                    <div className="absolute -left-6 md:-left-8 -top-4 text-5xl md:text-7xl text-gray-700/20 font-serif leading-none">"</div>
                    <p className="text-gray-300 text-base md:text-lg leading-relaxed font-light text-justify px-4 md:px-8 relative z-10">
                      {currentImage.description}
                    </p>
                    <div className="absolute -right-6 md:-right-8 -bottom-4 text-5xl md:text-7xl text-gray-700/20 font-serif leading-none">"</div>
                  </div>

                  {/* Línea decorativa inferior */}
                  <div className="flex items-center justify-center mt-8">
                    <div className="h-px w-full max-w-2xl bg-gradient-to-r from-transparent via-gray-700 to-transparent"></div>
                  </div>
                </motion.div>

                {/* Action Buttons - Premium Design */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.6 }}
                  className="flex flex-wrap items-center justify-center gap-4 mt-12"
                >
                  <motion.button
                    onClick={handleCopy}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="group flex items-center gap-3 px-7 py-3.5 rounded-full bg-gradient-to-r from-white/5 to-white/10 hover:from-white/10 hover:to-white/15 border border-white/10 hover:border-white/25 transition-all backdrop-blur-md shadow-lg hover:shadow-xl"
                  >
                    {copied ? (
                      <>
                        <CheckCircle className="w-5 h-5 text-green-400" strokeWidth={2} />
                        <span className="text-sm font-medium text-green-400 tracking-wide">Copiado</span>
                      </>
                    ) : (
                      <>
                        <Copy className="w-5 h-5 text-gray-400 group-hover:text-white transition-colors" strokeWidth={1.5} />
                        <span className="text-sm font-light text-gray-400 group-hover:text-white transition-colors tracking-wide">
                          Copiar texto
                        </span>
                      </>
                    )}
                  </motion.button>

                  <motion.button
                    onClick={handleShare}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="group flex items-center gap-3 px-7 py-3.5 rounded-full bg-gradient-to-r from-gray-800/50 via-gray-700/50 to-gray-800/50 hover:from-gray-700/60 hover:via-gray-600/60 hover:to-gray-700/60 border border-white/15 hover:border-white/30 transition-all backdrop-blur-md shadow-lg hover:shadow-2xl"
                  >
                    {shared ? (
                      <>
                        <CheckCircle className="w-5 h-5 text-green-400" strokeWidth={2} />
                        <span className="text-sm font-medium text-green-400 tracking-wide">Compartido</span>
                      </>
                    ) : (
                      <>
                        <Share2 className="w-5 h-5 text-gray-300 group-hover:text-white transition-colors" strokeWidth={1.5} />
                        <span className="text-sm font-light text-gray-300 group-hover:text-white transition-colors tracking-wide">
                          Compartir
                        </span>
                      </>
                    )}
                  </motion.button>
                </motion.div>
              </div>
            </div>
          </motion.div>

          {/* Mystical Footer Message */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.8, duration: 1 }}
            className="text-center mt-16"
          >
            <p className="text-gray-500 text-sm font-light italic">
              Las imágenes dicen lo que las palabras callan. Las palabras nombran lo que las imágenes insinúan.
            </p>
          </motion.div>
        </div>
      </motion.section>
    </div>
  )
}

export default AtlasHumanidadPage
