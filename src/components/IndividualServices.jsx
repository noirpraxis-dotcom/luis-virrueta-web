import { motion } from 'framer-motion'
import { Camera, Palette, Smartphone, Mic, Brain, FileText, Sparkles, Video, Code, Megaphone } from 'lucide-react'

const IndividualServices = () => {
  const services = [
    { 
      name: "Logo Design", 
      description: "Identidad memorable",
      icon: Palette,
      color: "from-[#a855f7] to-[#7c3aed]"
    },
    { 
      name: "Identidad Visual", 
      description: "Sistema completo",
      icon: Sparkles,
      color: "from-[#d946ef] to-[#c026d3]"
    },
    { 
      name: "Páginas Web", 
      description: "Sitios que convierten",
      icon: Code,
      color: "from-[#6366f1] to-[#4f46e5]"
    },
    { 
      name: "Apps Móviles", 
      description: "Experiencias fluidas",
      icon: Smartphone,
      color: "from-[#0ea5e9] to-[#0284c7]"
    },
    { 
      name: "Fotografía", 
      description: "Sesiones profesionales",
      icon: Camera,
      color: "from-[#ec4899] to-[#db2777]"
    },
    { 
      name: "Video Branding", 
      description: "Contenido visual",
      icon: Video,
      color: "from-[#8b5cf6] to-[#7c3aed]"
    },
    { 
      name: "Audio Branding", 
      description: "Identidad sonora",
      icon: Mic,
      color: "from-[#f97316] to-[#ea580c]"
    },
    { 
      name: "Avatares IA", 
      description: "Representación digital",
      icon: Brain,
      color: "from-[#10b981] to-[#059669]"
    },
    { 
      name: "Consultoría", 
      description: "Estrategia psicológica",
      icon: Brain,
      color: "from-[#a855f7] to-[#d946ef]"
    },
    { 
      name: "Marketing", 
      description: "Campañas efectivas",
      icon: Megaphone,
      color: "from-[#06b6d4] to-[#0891b2]"
    },
    { 
      name: "Material Impreso", 
      description: "Tangibles de lujo",
      icon: FileText,
      color: "from-[#d946ef] to-[#a855f7]"
    },
    { 
      name: "Animación", 
      description: "Logos en movimiento",
      icon: Sparkles,
      color: "from-[#6366f1] to-[#8b5cf6]"
    }
  ]

  return (
    <section className="relative bg-[#0A0A0A] py-16 lg:py-20 overflow-hidden">
      {/* Background gradients */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-1/3 left-1/4 w-96 h-96 bg-[#a855f7]/5 rounded-full blur-3xl" />
        <div className="absolute bottom-1/3 right-1/4 w-96 h-96 bg-[#d946ef]/5 rounded-full blur-3xl" />
      </div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-12">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="text-center mb-16"
        >
          <motion.p
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="text-[#a855f7] text-sm font-mono uppercase tracking-widest mb-4"
          >
            A tu medida
          </motion.p>
          
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.3 }}
            className="text-4xl lg:text-5xl font-bold mb-6"
          >
            <span className="text-white">Nuestros </span>
            <span className="bg-gradient-to-r from-[#a855f7] via-[#d946ef] to-[#a855f7] bg-clip-text text-transparent">
              Servicios
            </span>
          </motion.h2>

          <motion.p
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="text-white/60 text-lg lg:text-xl max-w-2xl mx-auto"
          >
            Arma tu paquete ideal. Todas las opciones para hacer crecer tu marca.
          </motion.p>
        </motion.div>

        {/* Services Grid - Cuadrados */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 lg:gap-6">
          {services.map((service, index) => {
            const Icon = service.icon
            return (
              <motion.div
                key={index}
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.05 }}
                whileHover={{ 
                  y: -8, 
                  scale: 1.05,
                  transition: { duration: 0.3 }
                }}
                className="group relative aspect-square"
              >
                {/* Card container */}
                <div className="relative h-full bg-gradient-to-br from-[#1A1A1A] to-[#0d0d0d] border border-white/10 rounded-2xl lg:rounded-3xl p-6 lg:p-8 hover:border-white/30 transition-all duration-500 flex flex-col items-center justify-center text-center">
                  
                  {/* Animated glow on hover */}
                  <motion.div
                    className="absolute inset-0 rounded-2xl lg:rounded-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-500"
                    style={{
                      background: `radial-gradient(circle at 50% 50%, rgba(168, 85, 247, 0.15), transparent 70%)`
                    }}
                  />

                  {/* Icon with gradient background */}
                  <motion.div
                    className={`relative mb-4 p-4 lg:p-5 rounded-2xl bg-gradient-to-br ${service.color} opacity-90 group-hover:opacity-100 transition-opacity`}
                    whileHover={{ rotate: [0, -10, 10, -10, 0] }}
                    transition={{ duration: 0.5 }}
                  >
                    <Icon className="w-6 h-6 lg:w-8 lg:h-8 text-white" strokeWidth={1.5} />
                    
                    {/* Shimmer effect */}
                    <motion.div
                      className="absolute inset-0 rounded-2xl"
                      style={{
                        background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.3), transparent)',
                        backgroundSize: '200% 100%'
                      }}
                      animate={{
                        backgroundPosition: ['-200% 0', '200% 0']
                      }}
                      transition={{
                        duration: 2,
                        repeat: Infinity,
                        repeatDelay: 3,
                        ease: "linear"
                      }}
                    />
                  </motion.div>

                  {/* Text content */}
                  <div className="relative z-10">
                    <h3 className="text-white text-base lg:text-lg font-bold mb-1 group-hover:text-[#d946ef] transition-colors">
                      {service.name}
                    </h3>
                    <p className="text-white/50 text-xs lg:text-sm font-light group-hover:text-white/70 transition-colors">
                      {service.description}
                    </p>
                  </div>

                  {/* Bottom gradient line appears on hover */}
                  <motion.div
                    className={`absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r ${service.color} rounded-b-2xl lg:rounded-b-3xl`}
                    initial={{ scaleX: 0 }}
                    whileHover={{ scaleX: 1 }}
                    transition={{ duration: 0.3 }}
                  />
                </div>
              </motion.div>
            )
          })}
        </div>

        {/* Bottom CTA */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, delay: 0.6 }}
          className="text-center mt-12 lg:mt-16"
        >
          <p className="text-white/60 text-base lg:text-lg mb-6">
            ¿No estás seguro qué necesitas?
          </p>
          
          <motion.a
            href="#contacto"
            whileHover={{ scale: 1.05, y: -2 }}
            whileTap={{ scale: 0.95 }}
            className="inline-flex items-center gap-3 px-8 lg:px-10 py-4 lg:py-5 bg-gradient-to-r from-[#a855f7] to-[#d946ef] text-white rounded-full text-base font-bold tracking-wide hover:shadow-2xl hover:shadow-[#a855f7]/30 transition-all duration-300 relative overflow-hidden group"
          >
            {/* Shine effect */}
            <motion.div
              className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent"
              style={{ backgroundSize: '200% 100%' }}
              animate={{
                backgroundPosition: ['-200% 0', '200% 0']
              }}
              transition={{
                duration: 2,
                repeat: Infinity,
                repeatDelay: 1,
                ease: "linear"
              }}
            />
            <span className="relative z-10">Agenda tu Consulta Gratuita</span>
          </motion.a>
        </motion.div>
      </div>
    </section>
  )
}

export default IndividualServices
