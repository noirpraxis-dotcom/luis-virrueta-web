import { motion } from 'framer-motion'
import { useInView } from 'framer-motion'
import { useRef } from 'react'

const PersonalPhotoSection = () => {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, amount: 0.3 })

  return (
    <section 
      ref={ref}
      className="relative min-h-screen bg-gradient-to-b from-black via-zinc-950 to-black flex items-center justify-center py-32 lg:py-40 overflow-hidden"
    >
      {/* Efectos decorativos artísticos */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={isInView ? { opacity: 0.04, scale: 1 } : {}}
          transition={{ duration: 3 }}
          className="absolute top-1/3 left-1/4 w-[500px] h-[500px] bg-amber-600 rounded-full blur-3xl"
        />
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={isInView ? { opacity: 0.03, scale: 1 } : {}}
          transition={{ duration: 3, delay: 0.5 }}
          className="absolute bottom-1/3 right-1/4 w-[400px] h-[400px] bg-stone-600 rounded-full blur-3xl"
        />
      </div>

      <div className="relative max-w-6xl mx-auto px-6 lg:px-12">
        <div className="flex flex-col items-center">
          {/* Imagen en círculo grande - Formato artístico */}
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={isInView ? { opacity: 1, scale: 1 } : {}}
            transition={{ duration: 1.5, ease: [0.76, 0, 0.24, 1] }}
            className="relative mb-16"
          >
            {/* Marco decorativo exterior */}
            <motion.div
              initial={{ rotate: 0 }}
              animate={isInView ? { rotate: 360 } : {}}
              transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
              className="absolute -inset-8 rounded-full border border-amber-600/20"
            />
            <motion.div
              initial={{ rotate: 0 }}
              animate={isInView ? { rotate: -360 } : {}}
              transition={{ duration: 25, repeat: Infinity, ease: "linear" }}
              className="absolute -inset-12 rounded-full border border-amber-600/10"
            />

            {/* Contenedor de la imagen */}
            <div className="relative w-80 h-80 lg:w-96 lg:h-96">
              {/* Sombra y glow */}
              <div className="absolute inset-0 bg-amber-600/20 rounded-full blur-2xl" />
              
              {/* Imagen circular */}
              <div className="relative w-full h-full rounded-full overflow-hidden border-4 border-amber-600/30 shadow-2xl">
                <img 
                  src="/portada 2.jpg" loading="lazy" 
                  alt="Zuzana Erdösová - Healing Work" 
                  className="w-full h-full object-cover"
                />
                
                {/* Overlay gradiente sutil */}
                <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-black/20" />
              </div>

              {/* Partículas decorativas */}
              {[...Array(4)].map((_, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, scale: 0 }}
                  animate={isInView ? { 
                    opacity: [0.3, 0.6, 0.3],
                    scale: [1, 1.5, 1],
                  } : {}}
                  transition={{ 
                    duration: 3,
                    delay: i * 0.5,
                    repeat: Infinity,
                    ease: "easeInOut"
                  }}
                  className="absolute w-2 h-2 bg-amber-600/60 rounded-full"
                  style={{
                    top: `${20 + i * 20}%`,
                    left: i % 2 === 0 ? '-8px' : 'auto',
                    right: i % 2 === 1 ? '-8px' : 'auto',
                  }}
                />
              ))}
            </div>
          </motion.div>

          {/* Texto o quote elegante (opcional - puedes personalizarlo) */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 1.2, delay: 0.8, ease: [0.76, 0, 0.24, 1] }}
            className="text-center max-w-3xl"
          >
            <p 
              className="text-white/80 text-2xl lg:text-3xl font-light leading-relaxed italic tracking-wide"
              style={{ fontFamily: 'Cormorant Garamond, serif' }}
            >
              "Every session is a journey to your authentic self, 
              <br />
              guided by light, wisdom, and compassion."
            </p>
            
            {/* Línea decorativa */}
            <motion.div
              initial={{ scaleX: 0 }}
              animate={isInView ? { scaleX: 1 } : {}}
              transition={{ duration: 1.5, delay: 1.2, ease: [0.76, 0, 0.24, 1] }}
              className="h-px bg-gradient-to-r from-transparent via-amber-600/40 to-transparent mx-auto w-64 mt-8"
            />
          </motion.div>

          {/* Elementos decorativos adicionales */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={isInView ? { opacity: 1 } : {}}
            transition={{ duration: 2, delay: 1.5 }}
            className="mt-12 flex justify-center gap-3"
          >
            {[...Array(3)].map((_, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, scale: 0 }}
                animate={isInView ? { opacity: 0.4, scale: 1 } : {}}
                transition={{ duration: 0.6, delay: 1.5 + i * 0.15 }}
                className="w-1.5 h-1.5 bg-amber-600 rounded-full"
              />
            ))}
          </motion.div>
        </div>
      </div>
    </section>
  )
}

export default PersonalPhotoSection
