import { motion } from 'framer-motion'
import { useInView } from 'framer-motion'
import { useRef } from 'react'
import { Check, Sparkles, Crown, Star, Camera, Palette, Smartphone, Mic, Brain, FileText } from 'lucide-react'

const LuxmaniaServices = () => {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, margin: "-100px" })

  const packages = [
    {
      name: "ESSENTIAL IDENTITY",
      tagline: "Tu marca nace",
      price: "Desde $2,500",
      icon: Star,
      features: [
        "Logo principal + 2 variaciones",
        "Paleta de colores psicológicamente estratégica",
        "Tipografías seleccionadas",
        "Guía de uso básica",
        "Sesión de análisis psicológico de tu cliente ideal"
      ],
      highlight: false
    },
    {
      name: "PROFESSIONAL PRESENCE",
      tagline: "Tu marca se establece",
      price: "Desde $6,500",
      icon: Sparkles,
      features: [
        "Todo lo de Essential +",
        "Página web profesional (5 secciones)",
        "Animación de logo",
        "50 mockups de marca",
        "Sesión de fotos básica (2 horas)",
        "Plantillas para redes sociales",
        "Sesión de estrategia de marca"
      ],
      highlight: true,
      badge: "Más Popular"
    },
    {
      name: "LUXURY EXPERIENCE",
      tagline: "Tu marca domina",
      price: "Inversión personalizada",
      icon: Crown,
      features: [
        "Todo lo de Professional +",
        "Web avanzada con funcionalidades especiales",
        "App móvil o web app personalizada",
        "Avatar IA de marca",
        "Audio branding (jingle + música)",
        "Sesión de fotos completa (6 horas)",
        "Video presentación de marca",
        "Consultoría psicológica continua (3 meses)"
      ],
      highlight: false
    }
  ]

  const individualServices = [
    { name: "Diseño de Logos", icon: Palette },
    { name: "Identidad Visual Completa", icon: Star },
    { name: "Páginas Web", icon: Smartphone },
    { name: "Aplicaciones Móviles/Web", icon: Smartphone },
    { name: "Sesiones de Fotos", icon: Camera },
    { name: "Animación de Logos", icon: Sparkles },
    { name: "Creación de Avatares IA", icon: Brain },
    { name: "Audio Branding", icon: Mic },
    { name: "Consultoría de Marca", icon: Brain },
    { name: "Material Impreso", icon: FileText }
  ]

  return (
    <section 
      id="servicios"
      ref={ref}
      className="relative bg-[#0A0A0A] py-24 lg:py-32 overflow-hidden"
    >
      {/* Background gradients */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-[#a855f7]/5 rounded-full blur-3xl" />
        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-[#d946ef]/5 rounded-full blur-3xl" />
      </div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-12">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8 }}
          className="text-center mb-20"
        >
          <motion.p
            initial={{ opacity: 0 }}
            animate={isInView ? { opacity: 1 } : {}}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="text-[#a855f7] text-sm sm:text-base font-mono uppercase tracking-widest mb-4"
          >
            Soluciones Integrales
          </motion.p>
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.8, delay: 0.3 }}
            className="text-4xl sm:text-5xl lg:text-6xl font-bold text-white mb-6 font-display"
          >
            Para marcas que quieren{' '}
            <span className="bg-gradient-to-r from-[#a855f7] to-[#d946ef] bg-clip-text text-transparent"
              trascender
            </span>
          </motion.h2>
          <motion.p
            initial={{ opacity: 0 }}
            animate={isInView ? { opacity: 1 } : {}}
            transition={{ duration: 0.8, delay: 0.5 }}
            className="text-white/60 text-lg lg:text-xl max-w-3xl mx-auto"
          >
            No vendemos servicios aislados. Creamos ecosistemas de marca.
            Desde el primer trazo hasta la última interacción con tu cliente.
          </motion.p>
        </motion.div>

        {/* Packages Grid */}
        <div className="grid md:grid-cols-3 gap-8 mb-24">
          {packages.map((pkg, index) => {
            const Icon = pkg.icon
            return (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                animate={isInView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.6, delay: 0.7 + index * 0.1 }}
                whileHover={{ y: -10, scale: 1.02 }}
                className="relative group"
              >
                {/* Badge */}
                {pkg.badge && (
                  <div className="absolute -top-4 left-1/2 -translate-x-1/2 z-10">
                    <span className="bg-[#a855f7] text-white text-xs font-bold px-4 py-1 rounded-full uppercase tracking-wide">
                      {pkg.badge}
                    </span>
                  </div>
                )}

                {/* Card */}
                <div className={`relative bg-[#1A1A1A] border ${pkg.highlight ? 'border-[#a855f7]/40' : 'border-white/10'} rounded-3xl p-8 h-full hover:border-white/30 transition-all duration-500`}>
                  {/* Icon */}
                  <div className="mb-6">
                    <div className="inline-flex p-4 rounded-2xl bg-gradient-to-br from-[#a855f7]/10 to-[#d946ef]/10">
                      <Icon className="w-8 h-8 text-[#a855f7]" strokeWidth={1.5} />
                    </div>
                  </div>

                  {/* Package Name */}
                  <h3 className="text-white text-2xl font-bold mb-2 font-display">
                    {pkg.name}
                  </h3>
                  <p className="text-white/50 text-sm italic mb-6">{pkg.tagline}</p>

                  {/* Price */}
                  <div className="mb-8">
                    <p className="text-[#d946ef] text-3xl font-bold">{pkg.price}</p>
                  </div>

                  {/* Features */}
                  <ul className="space-y-3 mb-8">
                    {pkg.features.map((feature, idx) => (
                      <li key={idx} className="flex items-start gap-3">
                        <Check className="w-5 h-5 text-[#a855f7] flex-shrink-0 mt-0.5" strokeWidth={2} />
                        <span className="text-white/70 text-sm">{feature}</span>
                      </li>
                    ))}
                  </ul>

                  {/* CTA Button */}
                  <motion.a
                    href="#contacto"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className={`block text-center py-3 rounded-full font-medium uppercase text-sm tracking-wide transition-all duration-300 ${
                      pkg.highlight 
                        ? 'bg-[#a855f7] text-white hover:bg-[#7c3aed] shadow-lg shadow-[#a855f7]/20' 
                        : 'bg-white/5 text-white hover:bg-white/10 border border-white/20'
                    }`}
                  >
                    Solicitar Info
                  </motion.a>
                </div>
              </motion.div>
            )
          })}
        </div>

        {/* Individual Services */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8, delay: 1.2 }}
          className="text-center"
        >
          <h3 className="text-white text-2xl lg:text-3xl font-bold mb-6 font-display">
            O construye tu solución{' '}
            <span className="text-[#d946ef]">a medida</span>
          </h3>
          <p className="text-white/60 mb-12 max-w-2xl mx-auto">
            También ofrecemos servicios individuales para complementar tu marca existente
          </p>

          {/* Services Grid */}
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
            {individualServices.map((service, index) => {
              const Icon = service.icon
              return (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={isInView ? { opacity: 1, scale: 1 } : {}}
                  transition={{ duration: 0.4, delay: 1.4 + index * 0.05 }}
                  whileHover={{ y: -5, scale: 1.05 }}
                  className="bg-[#1A1A1A] border border-white/10 rounded-2xl p-6 hover:border-[#a855f7]/40 transition-all duration-300 cursor-pointer"
                >
                  <Icon className="w-8 h-8 text-[#a855f7] mx-auto mb-3" strokeWidth={1.5} />
                  <p className="text-white/70 text-sm font-medium">{service.name}</p>
                </motion.div>
              )
            })}
          </div>
        </motion.div>

        {/* Bottom CTA */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8, delay: 1.8 }}
          className="text-center mt-16 p-8 bg-gradient-to-br from-[#1A1A1A] to-[#0A0A0A] border border-white/10 rounded-3xl"
        >
          <p className="text-white/60 text-lg mb-4">
            ¿No encuentras lo que buscas?
          </p>
          <p className="text-white text-xl mb-6">
            <span className="text-[#a855f7] font-semibold">Creamos soluciones personalizadas</span> para tus necesidades específicas
          </p>
          <motion.a
            href="#contacto"
            whileHover={{ scale: 1.05, y: -2 }}
            whileTap={{ scale: 0.95 }}
            className="inline-flex items-center gap-3 px-10 py-5 bg-[#d946ef] text-white rounded-full text-base font-bold tracking-wide uppercase hover:bg-[#c026d3] transition-all duration-300 shadow-lg shadow-[#d946ef]/20"
          >
            <span>Hablemos de tu Proyecto</span>
          </motion.a>
        </motion.div>
      </div>
    </section>
  )
}

export default LuxmaniaServices
