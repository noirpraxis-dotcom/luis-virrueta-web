import { useRef, useState } from 'react'
import { motion, useInView } from 'framer-motion'
import { Play, Volume2 } from 'lucide-react'
import { useLanguage } from '../context/LanguageContext'

const AvatarsSection = () => {
  const { t } = useLanguage()
  const ref = useRef(null)
  const videoRef = useRef(null)
  const isInView = useInView(ref, { once: true, amount: 0.3 })
  const [isPlaying, setIsPlaying] = useState(false)

  const handlePlay = () => {
    setIsPlaying(true)
  }

  return (
    <div ref={ref} className="relative overflow-hidden">
      {/* Background gradient orbs */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/3 left-1/3 w-96 h-96 bg-purple-600/10 rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-1/3 right-1/3 w-96 h-96 bg-fuchsia-600/10 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1.5s' }} />
      </div>

      <div className="relative max-w-4xl mx-auto">
        {/* Header elegante */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8 }}
          className="text-center mb-12"
        >
          {/* Subtítulo superior con borde */}
          <motion.p
            initial={{ opacity: 0, y: 10 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="inline-block text-xs uppercase tracking-[0.3em] text-white/70 font-light mb-6 px-4 py-2 border border-white/30 rounded-full"
          >
            {t('portfolio.avatars.badge')}
          </motion.p>

          {/* Título principal */}
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="text-4xl lg:text-6xl font-bold mb-6 font-display text-white"
            style={{
              letterSpacing: '0.05em',
              fontWeight: 300
            }}
          >
            {t('portfolio.avatars.title')}
          </motion.h2>

          {/* Subtítulo inferior - pregunta provocativa */}
          <motion.p
            initial={{ opacity: 0, y: 10 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="text-base lg:text-lg text-white/60 font-extralight italic max-w-2xl mx-auto"
            style={{ letterSpacing: '0.08em' }}
          >
            {t('portfolio.avatars.subtitle')}
          </motion.p>
        </motion.div>

        {/* Video Container - Vertical (9:16) */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={isInView ? { opacity: 1, scale: 1 } : {}}
          transition={{ duration: 1, delay: 0.3 }}
          className="relative max-w-[500px] mx-auto"
        >
          <div className="relative aspect-[3/4] rounded-3xl overflow-hidden bg-black">
            {/* Video - sin autoplay */}
            <iframe
              ref={videoRef}
              className="absolute inset-0 w-full h-full"
              src={`https://www.youtube.com/embed/XonEErWLLTA?autoplay=${isPlaying ? 1 : 0}&controls=1&rel=0&modestbranding=1&enablejsapi=1&hd=1&loop=1&playlist=XonEErWLLTA`}
              title="Avatares Digitales"
              frameBorder="0"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
            />

            {/* Overlay con botón de play - solo visible si no está reproduciendo */}
            {!isPlaying && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="absolute inset-0 z-20 flex flex-col items-center justify-center bg-gradient-to-b from-black/60 via-black/40 to-black/60 backdrop-blur-[2px]"
              >
                {/* Mensajes superiores */}
                <motion.div
                  initial={{ opacity: 0, y: -20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.8, delay: 0.3 }}
                  className="flex flex-col items-center gap-3 mb-8"
                >
                  <motion.div
                    animate={{ scale: [1, 1.1, 1] }}
                    transition={{ duration: 2, repeat: Infinity }}
                    className="flex items-center gap-2 text-purple-300"
                  >
                    <Volume2 className="w-5 h-5" />
                    <span className="text-sm font-light tracking-wider uppercase">Sube el volumen</span>
                  </motion.div>
                </motion.div>

                {/* Botón de Play */}
                <motion.button
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.5, delay: 0.5 }}
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={handlePlay}
                  className="relative"
                >
                  <div className="w-20 h-20 lg:w-24 lg:h-24 rounded-full bg-white/10 backdrop-blur-xl border border-white/20 flex items-center justify-center group hover:bg-white/20 transition-all duration-300">
                    <Play className="w-8 h-8 lg:w-10 lg:h-10 text-white fill-white ml-1" />
                  </div>
                </motion.button>

                {/* Mensaje inferior */}
                <motion.p
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.8, delay: 0.7 }}
                  className="mt-8 text-white/80 text-sm font-light tracking-wider text-center px-6"
                >
                  {t('portfolio.avatars.playMessage')} {t('portfolio.avatars.digitalAvatars')}
                </motion.p>
              </motion.div>
            )}
          </div>
        </motion.div>

        {/* Texto elegante debajo del video */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8, delay: 0.5 }}
          className="mt-12 text-center"
        >
          <p className="text-white/40 text-sm font-light tracking-wider uppercase">
            Identidades digitales con personalidad
          </p>
        </motion.div>
      </div>
    </div>
  )
}

export default AvatarsSection
