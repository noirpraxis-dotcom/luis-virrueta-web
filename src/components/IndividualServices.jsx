import { motion } from 'framer-motion'
import { Link } from 'react-router-dom'
import { Users, Heart, Brain, Mic, Baby, ExternalLink, ArrowRight } from 'lucide-react'
import { useLanguage } from '../context/LanguageContext'

const IndividualServices = () => {
  const { t, currentLanguage } = useLanguage()
  
  const services = [
    { 
      name: currentLanguage === 'en' ? 'Individual Consultation' : 'Consulta Individual',
      description: currentLanguage === 'en' ? 'Deep psychological work from psychoanalysis' : 'Trabajo psicológico profundo desde el psicoanálisis',
      icon: Brain,
      color: "from-[#a855f7] to-[#7c3aed]"
    },
    { 
      name: currentLanguage === 'en' ? 'Couple Consultation' : 'Consulta de Pareja',
      description: currentLanguage === 'en' ? 'Explore unconscious dynamics in your relationship' : 'Explora las dinámicas inconscientes en tu relación',
      icon: Heart,
      color: "from-[#ec4899] to-[#db2777]"
    },
    { 
      name: currentLanguage === 'en' ? 'Psychological Consulting' : 'Consultoría Psicológica',
      description: currentLanguage === 'en' ? 'For teams, organizations and projects' : 'Para equipos, organizaciones y proyectos',
      icon: Users,
      color: "from-[#06b6d4] to-[#0891b2]"
    },
    { 
      name: currentLanguage === 'en' ? 'Unconscious Reprogramming Audios' : 'Audios Reprogramables del Inconsciente',
      description: currentLanguage === 'en' ? 'Personalized tools to transform your perception' : 'Herramientas personalizadas para transformar tu percepción',
      icon: Mic,
      color: "from-[#8b5cf6] to-[#7c3aed]"
    },
    { 
      name: currentLanguage === 'en' ? 'Apps for Children' : 'Aplicaciones para Niños',
      description: currentLanguage === 'en' ? 'Interactive tools for childhood development' : 'Herramientas interactivas para el desarrollo infantil',
      icon: Baby,
      color: "from-[#10b981] to-[#059669]"
    },
    { 
      name: 'LUXMANIA',
      description: currentLanguage === 'en' ? 'Premium branding and design projects' : 'Proyectos de branding y diseño premium',
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
            <span className="text-white">{currentLanguage === 'en' ? 'Services ' : 'Servicios '}</span>
            <span className="text-white italic" style={{ fontFamily: 'Playfair Display, Georgia, serif', fontWeight: 300 }}>
              {currentLanguage === 'en' ? 'tailored' : 'a tu medida'}
            </span>
          </motion.h2>

          <motion.p
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="text-white/50 text-xl lg:text-2xl max-w-2xl mx-auto font-light"
          >
            {currentLanguage === 'en' 
              ? 'Each process is designed to transform how you perceive and inhabit your reality'
              : 'Cada proceso está diseñado para transformar cómo percibes y habitas tu realidad'}
          </motion.p>
        </motion.div>

        {/* Services Grid - Hexágonos: 3 columnas responsive */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8 lg:gap-10">
          {services.map((service, index) => {
            const Icon = service.icon
            const isExternal = service.link
            const CardWrapper = isExternal ? 'a' : 'div'
            
            return (
              <motion.div
                key={index}
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                whileHover={{ 
                  y: -8, 
                  scale: 1.02,
                  transition: { duration: 0.3 }
                }}
                className="group relative"
              >
                {/* Card container - Más grande y espacioso */}
                <CardWrapper 
                  href={isExternal ? service.link : undefined}
                  target={isExternal ? "_blank" : undefined}
                  rel={isExternal ? "noopener noreferrer" : undefined}
                  className="relative block h-full bg-gradient-to-br from-[#1A1A1A] to-[#0d0d0d] border border-white/10 rounded-3xl p-8 lg:p-10 hover:border-white/30 transition-all duration-500"
                >
                  
                  {/* Animated glow on hover */}
                  <motion.div
                    className="absolute inset-0 rounded-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-500"
                    style={{
                      background: `radial-gradient(circle at 50% 50%, rgba(168, 85, 247, 0.15), transparent 70%)`
                    }}
                  />

                  {/* Icon with gradient background - Más grande */}
                  <motion.div
                    className={`relative mb-6 p-5 rounded-2xl bg-gradient-to-br ${service.color} opacity-90 group-hover:opacity-100 transition-opacity inline-block`}
                    whileHover={{ rotate: [0, -10, 10, -10, 0] }}
                    transition={{ duration: 0.5 }}
                  >
                    <Icon className="w-10 h-10 lg:w-12 lg:h-12 text-white" strokeWidth={1.5} />
                    
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

                  {/* Text content - Más espacioso */}
                  <div className="relative z-10">
                    <h3 className="text-white text-xl lg:text-2xl font-bold mb-3 group-hover:text-[#d946ef] transition-colors">
                      {service.name}
                    </h3>
                    <p className="text-white/50 text-base lg:text-lg font-light group-hover:text-white/70 transition-colors leading-relaxed">
                      {service.description}
                    </p>
                  </div>
                  
                  {/* External link icon */}
                  {isExternal && (
                    <div className="absolute top-6 right-6 text-white/30 group-hover:text-white/60 transition-colors">
                      <ArrowRight className="w-5 h-5" />
                    </div>
                  )}

                  {/* Bottom gradient line appears on hover */}
                  <motion.div
                    className={`absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r ${service.color} rounded-b-2xl lg:rounded-b-3xl`}
                    initial={{ scaleX: 0 }}
                    whileHover={{ scaleX: 1 }}
                    transition={{ duration: 0.3 }}
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
