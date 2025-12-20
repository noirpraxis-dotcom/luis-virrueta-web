import { motion } from 'framer-motion'
import { Link } from 'react-router-dom'
import { Users, Heart, Brain, Mic, Baby, ExternalLink, ArrowRight } from 'lucide-react'
import { useLanguage } from '../context/LanguageContext'

const IndividualServices = () => {
  const { t, currentLanguage } = useLanguage()
  
  const services = [
    { 
      name: currentLanguage === 'en' ? 'Individual Consultation' : 'Consulta Individual',
      description: currentLanguage === 'en' ? 'Deep work from psychoanalysis to explore the unconscious structure that shapes your reality' : 'Trabajo profundo desde el psicoanálisis para explorar la estructura inconsciente que da forma a tu realidad',
      icon: Brain,
      color: "from-[#a855f7] to-[#7c3aed]"
    },
    { 
      name: currentLanguage === 'en' ? 'Couple Consultation' : 'Consulta de Pareja',
      description: currentLanguage === 'en' ? 'Not to complete each other, but to dismantle the illusions that prevent the encounter' : 'No para completarse, sino para desmontar las ilusiones que impiden el encuentro',
      icon: Heart,
      color: "from-[#ec4899] to-[#db2777]"
    },
    { 
      name: currentLanguage === 'en' ? 'Family Consultation' : 'Consulta Familiar',
      description: currentLanguage === 'en' ? 'The patterns that repeat are not destiny, just structure not yet traversed' : 'Los patrones que se repiten no son destino, solo estructura aún no atravesada',
      icon: Users,
      color: "from-[#06b6d4] to-[#0891b2]"
    },
    { 
      name: currentLanguage === 'en' ? 'Psychoanalytic Consulting' : 'Consultoría Psicoanalítica',
      description: currentLanguage === 'en' ? 'For organizations that want to understand the unconscious that governs their dynamics' : 'Para organizaciones que quieren comprender el inconsciente que gobierna sus dinámicas',
      icon: Brain,
      color: "from-[#8b5cf6] to-[#7c3aed]"
    },
    { 
      name: currentLanguage === 'en' ? 'Unconscious Reprogramming Audios' : 'Audios Reprogramables del Inconsciente',
      description: currentLanguage === 'en' ? 'Not positive thinking, but a structural modification of how you perceive' : 'No pensamiento positivo, sino modificación estructural de cómo percibes',
      icon: Mic,
      color: "from-[#f59e0b] to-[#d97706]"
    },
    { 
      name: currentLanguage === 'en' ? 'Psychology Applied to Projects' : 'Psicología Aplicada a Proyectos',
      description: currentLanguage === 'en' ? 'Branding, design, and communication from the unconscious · LUXMANIA' : 'Branding, diseño y comunicación desde el inconsciente · LUXMANIA',
      icon: ExternalLink,
      color: "from-[#d946ef] to-[#c026d3]",
      link: 'https://luxmania.com'
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
            className="text-white/50 text-sm font-mono uppercase tracking-widest mb-4"
          >
            {currentLanguage === 'en' ? 'WHAT I OFFER' : 'LO QUE OFREZCO'}
          </motion.p>
          
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.3 }}
            className="text-5xl lg:text-7xl font-light mb-6 font-display tracking-tight"
          >
            <span className="text-white">{currentLanguage === 'en' ? 'Paths ' : 'Caminos '}</span>
            <span className="text-white italic" style={{ fontFamily: 'Playfair Display, Georgia, serif', fontWeight: 300 }}>
              {currentLanguage === 'en' ? 'through the structure' : 'por la estructura'}
            </span>
          </motion.h2>

          <motion.p
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="text-white/50 text-xl lg:text-2xl max-w-3xl mx-auto font-light leading-relaxed"
          >
            {currentLanguage === 'en' 
              ? 'Not methods to solve problems, but processes to transform the structure that produces them'
              : 'No son métodos para resolver problemas, sino procesos para transformar la estructura que los produce'}
          </motion.p>
        </motion.div>

        {/* Services Grid - Elegancia minimalista con espacio */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 md:gap-10 lg:gap-12 max-w-7xl mx-auto">
          {services.map((service, index) => {
            const Icon = service.icon
            const isExternal = service.link
            const CardWrapper = isExternal ? 'a' : 'div'
            
            return (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ 
                  duration: 0.6, 
                  delay: index * 0.08,
                  ease: [0.22, 1, 0.36, 1]
                }}
                whileHover={{ 
                  y: -10, 
                  scale: 1.02,
                  transition: { duration: 0.4, ease: "easeOut" }
                }}
                className="group relative flex"
              >
                {/* Card container - Rediseño elegante */}
                <CardWrapper 
                  href={isExternal ? service.link : undefined}
                  target={isExternal ? "_blank" : undefined}
                  rel={isExternal ? "noopener noreferrer" : undefined}
                  className="relative flex flex-col w-full h-full bg-gradient-to-b from-[#1A1A1A]/80 to-[#0d0d0d]/90 border border-white/5 rounded-2xl lg:rounded-3xl p-8 lg:p-10 hover:border-white/20 hover:shadow-2xl hover:shadow-white/5 transition-all duration-500 backdrop-blur-sm min-h-[300px]"
                >
                  
                  {/* Glow sutil en hover */}
                  <motion.div
                    className="absolute inset-0 rounded-2xl lg:rounded-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-700"
                    style={{
                      background: `radial-gradient(circle at 50% 0%, ${service.color.replace('from-', '').replace('to-', '').split(' ')[0]}, transparent 60%)`
                    }}
                  />

                  {/* Icon más refinado */}
                  <motion.div
                    className={`relative mb-6 w-14 h-14 lg:w-16 lg:h-16 rounded-xl bg-gradient-to-br ${service.color} flex items-center justify-center shadow-lg`}
                    whileHover={{ 
                      rotate: 5, 
                      scale: 1.1,
                      transition: { duration: 0.3 }
                    }}
                  >
                    <Icon className="w-7 h-7 lg:w-8 lg:h-8 text-white" strokeWidth={1.5} />
                    
                    {/* Brillo sutil en el icono */}
                    <motion.div
                      className="absolute inset-0 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500"
                      style={{
                        background: 'linear-gradient(135deg, rgba(255,255,255,0.2), transparent)',
                      }}
                    />
                  </motion.div>

                  {/* Content - Mejor espaciado y jerarquía */}
                  <div className="relative z-10 flex-1 flex flex-col justify-center">
                    <h3 className="text-white text-xl lg:text-2xl font-semibold mb-4 leading-snug tracking-tight">
                      {service.name}
                    </h3>
                    <p className="text-white/60 text-sm lg:text-base font-light leading-relaxed tracking-wide">
                      {service.description}
                    </p>
                  </div>
                  
                  {/* Indicador link externo */}
                  {isExternal && (
                    <div className="absolute top-6 right-6 text-white/20 group-hover:text-white/50 transition-all duration-300">
                      <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform duration-300" strokeWidth={1.5} />
                    </div>
                  )}

                  {/* Línea de acento inferior */}
                  <motion.div
                    className={`absolute bottom-0 left-0 right-0 h-0.5 bg-gradient-to-r ${service.color} rounded-b-2xl lg:rounded-b-3xl`}
                    initial={{ scaleX: 0 }}
                    whileHover={{ scaleX: 1 }}
                    transition={{ duration: 0.5, ease: "easeOut" }}
                  />
                </CardWrapper>
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
          <p className="text-white/60 text-base lg:text-lg mb-4">
            {currentLanguage === 'en' 
              ? 'Each path is unique. Each process, singular.' 
              : 'Cada camino es único. Cada proceso, singular.'}
          </p>
          <p className="text-white text-lg lg:text-xl mb-6">
            <span className="text-[#a855f7] font-semibold">
              {currentLanguage === 'en' ? 'Let\'s talk' : 'Hablemos'}
            </span> 
            {currentLanguage === 'en' 
              ? ' and design together what you need' 
              : ' y diseñemos juntos lo que necesitas'}
          </p>
          
          <motion.a
            href="https://wa.me/420776711575?text=Hola! Me gustaría explorar cómo podemos trabajar juntos"
            target="_blank"
            rel="noopener noreferrer"
            whileHover={{ scale: 1.05, y: -2 }}
            whileTap={{ scale: 0.98 }}
            className="group relative overflow-hidden inline-flex items-center gap-3 px-10 py-5 rounded-full backdrop-blur-sm"
          >
            {/* Gradiente animado BRILLANTE */}
            <motion.div
              animate={{
                backgroundPosition: ['0% 50%', '100% 50%', '0% 50%']
              }}
              transition={{
                duration: 5,
                repeat: Infinity,
                ease: "linear"
              }}
              className="absolute inset-0"
              style={{
                background: 'linear-gradient(135deg, #a855f7 0%, #3b82f6 25%, #8b5cf6 50%, #6366f1 75%, #a855f7 100%)',
                backgroundSize: '200% 200%',
                opacity: 0.6
              }}
            />

            {/* Shine effect brillante */}
            <motion.div
              animate={{
                backgroundPosition: ['-200% 0%', '200% 0%']
              }}
              transition={{
                duration: 3,
                repeat: Infinity,
                ease: "linear"
              }}
              className="absolute inset-0"
              style={{
                background: 'linear-gradient(90deg, transparent 0%, rgba(255,255,255,0.4) 50%, transparent 100%)',
                backgroundSize: '200% 100%'
              }}
            />

            {/* Glow exterior */}
            <motion.div
              animate={{
                opacity: [0.5, 0.8, 0.5],
                scale: [1, 1.2, 1]
              }}
              transition={{
                duration: 3,
                repeat: Infinity,
                ease: "easeInOut"
              }}
              className="absolute -inset-4 rounded-full blur-3xl"
              style={{
                background: 'linear-gradient(135deg, #a855f7, #3b82f6, #8b5cf6)',
                opacity: 0.6
              }}
            />

            <svg className="w-5 h-5 relative z-10 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
            </svg>
            <span className="relative z-10 text-white font-light text-lg tracking-wide">{t('home.servicesSection.cta')}</span>
          </motion.a>

          {/* Link a servicios completos */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="flex items-center justify-center gap-3 text-white/50 text-sm font-extralight mt-6"
          >
            <span>{t('home.servicesSection.exploreQuestion')}</span>
            <Link
              to="/servicios"
              className="group inline-flex items-center gap-2 text-white hover:text-white/90 transition-colors"
            >
              <span className="relative font-light">
                {t('home.servicesSection.viewAllServices')}
                <span className="absolute -bottom-0.5 left-0 w-0 h-px bg-white transition-all duration-300 group-hover:w-full" />
              </span>
              <ArrowRight className="w-3 h-3 transition-transform duration-300 group-hover:translate-x-1" strokeWidth={1.5} />
            </Link>
          </motion.div>
        </motion.div>
      </div>
    </section>
  )
}

export default IndividualServices
