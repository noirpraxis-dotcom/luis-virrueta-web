import { motion, useInView } from 'framer-motion'
import { useRef } from 'react'
import { Award, ArrowRight, Sparkles } from 'lucide-react'

const BrandingShowcase = () => {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, amount: 0.3 })

  return (
    <div ref={ref} className="relative py-20 lg:py-32 px-6 lg:px-20 overflow-hidden">
      {/* Background gradient orbs */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/2 left-1/3 w-96 h-96 bg-fuchsia-600/10 rounded-full blur-3xl" />
        <div className="absolute bottom-1/4 right-1/3 w-96 h-96 bg-purple-600/10 rounded-full blur-3xl" />
      </div>

      <div className="relative max-w-7xl mx-auto">
        {/* Header Section */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8 }}
          className="text-center mb-16"
        >
          {/* Ícono decorativo */}
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={isInView ? { opacity: 1, scale: 1 } : {}}
            transition={{ duration: 0.6 }}
            className="mb-6"
          >
            <div className="inline-block">
              <Award className="w-10 h-10 text-white/60 mx-auto" strokeWidth={1.2} />
            </div>
          </motion.div>

          {/* Título principal en blanco */}
          <h2 className="text-4xl lg:text-6xl font-bold mb-4 font-display text-white tracking-wide">
            Branding Completo
          </h2>

          {/* Subtítulo */}
          <p className="text-lg lg:text-xl text-white/50 max-w-2xl mx-auto font-light">
            Proyectos integrales de identidad de marca que van más allá del logotipo
          </p>

          {/* Línea decorativa */}
          <motion.div
            initial={{ scaleX: 0 }}
            animate={isInView ? { scaleX: 1 } : {}}
            transition={{ duration: 1, delay: 0.3 }}
            className="h-px bg-gradient-to-r from-transparent via-white/20 to-transparent mx-auto w-64 mt-6"
          />
        </motion.div>

        {/* Video Showcase */}
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 1, delay: 0.4 }}
          className="relative group"
        >
          {/* Video Container */}
          <div className="relative rounded-3xl overflow-hidden bg-zinc-950 border border-white/10">
            {/* Placeholder - Reemplazar con tu video */}
            <div className="relative aspect-video">
              <video
                autoPlay
                loop
                muted
                playsInline
                className="w-full h-full object-cover"
              >
                <source src="/branding-showcase.mp4" type="video/mp4" />
                {/* Fallback: Si no hay video, mostrar gradiente */}
              </video>
              
              {/* Fallback gradient si no hay video */}
              <div className="absolute inset-0 bg-gradient-to-br from-purple-900/20 via-fuchsia-900/20 to-pink-900/20 flex items-center justify-center">
                <div className="text-center">
                  <Sparkles className="w-16 h-16 text-white/30 mx-auto mb-4" />
                  <p className="text-white/40 text-sm font-mono">
                    Coloca tu video en: /public/branding-showcase.mp4
                  </p>
                </div>
              </div>
            </div>

            {/* Overlay gradient para dar profundidad */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/30 via-transparent to-transparent pointer-events-none" />

            {/* Badge flotante */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.8, delay: 0.8 }}
              className="absolute bottom-6 right-6 px-4 py-2 bg-white/10 backdrop-blur-xl border border-white/20 rounded-full"
            >
              <p className="text-white/90 text-sm font-medium">Proyectos Premium</p>
            </motion.div>
          </div>

          {/* Glow effect sutil */}
          <div className="absolute -inset-1 bg-gradient-to-r from-purple-600/20 via-fuchsia-600/20 to-purple-600/20 rounded-3xl blur-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 -z-10" />
        </motion.div>

        {/* Stats Grid */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8, delay: 0.6 }}
          className="grid grid-cols-2 lg:grid-cols-4 gap-6 mt-16"
        >
          {[
            { label: 'Manual de Marca', value: 'Completo' },
            { label: 'Papelería', value: 'Corporativa' },
            { label: 'Redes Sociales', value: 'Templates' },
            { label: 'Aplicaciones', value: 'Digitales' }
          ].map((stat, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.5, delay: 0.8 + i * 0.1 }}
              className="text-center p-6 bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl hover:bg-white/10 transition-all duration-300"
            >
              <p className="text-white/90 font-medium mb-2">{stat.value}</p>
              <p className="text-white/40 text-sm">{stat.label}</p>
            </motion.div>
          ))}
        </motion.div>

        {/* CTA Button */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8, delay: 1 }}
          className="text-center mt-12"
        >
          <motion.a
            href="#contacto"
            whileHover={{ scale: 1.05, y: -2 }}
            whileTap={{ scale: 0.98 }}
            className="inline-flex items-center gap-3 px-8 py-4 bg-white text-black font-medium rounded-full hover:bg-white/90 transition-all duration-300 shadow-lg shadow-white/20"
          >
            <span>Ver Proyectos Completos</span>
            <ArrowRight className="w-5 h-5" />
          </motion.a>
        </motion.div>
      </div>
    </div>
  )
}

export default BrandingShowcase
