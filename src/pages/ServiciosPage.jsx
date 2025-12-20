import { motion, useInView } from 'framer-motion'
import { useRef } from 'react'
import { useLanguage } from '../context/LanguageContext'
import SEOHead from '../components/SEOHead'
import { 
  Brain,
  Heart,
  Users,
  Check,
  ArrowRight,
  Sparkles,
  Zap,
  Eye,
  Briefcase,
  Mic
} from 'lucide-react'

const ServiciosPage = () => {
  const { t } = useLanguage()
  const heroRef = useRef(null)
  const isHeroInView = useInView(heroRef, { once: true, amount: 0.3 })
  const identityRef = useRef(null)
  const isIdentityInView = useInView(identityRef, { once: true, amount: 0.3 })

  const services = [
    // 1. CONSULTA INDIVIDUAL - Trabajo profundo psicoanalítico
    {
      id: 'consulta-individual',
      icon: Brain,
      key: 'individual',
      gradient: 'from-violet-500 to-violet-600'
    },
    // 2. CONSULTA DE PAREJA - Desmontaje de ilusiones
    {
      id: 'consulta-pareja',
      icon: Heart,
      key: 'pareja',
      gradient: 'from-pink-500 to-rose-600'
    },
    // 3. CONSULTA FAMILIAR - Atravesar patrones
    {
      id: 'consulta-familiar',
      icon: Users,
      key: 'familiar',
      gradient: 'from-cyan-500 to-blue-600'
    },
    // 4. CONSULTORÍA EMPRESARIAL PSICOANALÍTICA
    {
      id: 'consultoria-psicoanalitica',
      icon: Briefcase,
      key: 'consultoria',
      gradient: 'from-indigo-500 to-purple-600'
    },
    // 5. AUDIOS REPROGRAMABLES - Modificación estructural
    {
      id: 'audios-inconsciente',
      icon: Mic,
      key: 'audios',
      gradient: 'from-amber-500 to-orange-600'
    },
    // 6. LUXMANIA - Psicología aplicada a proyectos
    {
      id: 'luxmania-proyecto',
      icon: Sparkles,
      key: 'luxmania',
      gradient: 'from-fuchsia-500 to-pink-600',
      external: true
    }
  ]

  return (
    <div className="min-h-screen bg-gradient-to-b from-black via-zinc-950 to-black pt-20 lg:pt-28">
      <SEOHead 
        title="Servicios de Branding, Diseño Web y Apps Premium"
        description="Identidad de marca, logos, arquetipos de Jung, desarrollo web y apps, motion graphics, avatares IA. Psicología + Diseño + IA para marcas que conectan."
        image="/hero servicios.mp4"
        url="/servicios"
        type="website"
        tags={['branding', 'diseño web', 'apps', 'motion graphics', 'avatares IA', 'identidad de marca']}
      />
      
      {/* Hero Section - Estilo AboutPage/BlogPage */}
      <section ref={heroRef} className="relative pt-12 lg:pt-20 pb-40 lg:pb-56 px-6 lg:px-20 overflow-hidden">
        {/* Video de fondo */}
        <div className="absolute inset-0 -top-16 lg:-top-24 -bottom-80 lg:-bottom-96 overflow-hidden pointer-events-none z-0">
          <video
            autoPlay
            loop
            muted
            playsInline
            preload="auto"
            className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full object-cover opacity-60"
            style={{
              minWidth: '100vw',
              minHeight: '100%',
              objectFit: 'cover',
              objectPosition: 'center'
            }}
          >
            <source src="/servicios videos.mp4" type="video/mp4" />
          </video>
        </div>
        
        {/* Gradiente inferior que se mezcla con el contenido */}
        <div className="absolute inset-x-0 bottom-0 h-48 bg-gradient-to-t from-black/100 via-black/50 to-transparent z-[5] pointer-events-none" />

        <div className="relative max-w-6xl mx-auto z-10">
          {/* Título Hero - SERVICIOS */}
          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={isHeroInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 1 }}
            className="text-center mb-12"
          >
            <span
              className="text-6xl sm:text-7xl lg:text-8xl font-light text-white inline-block"
              style={{ 
                letterSpacing: '0.15em',
                textShadow: '0 0 60px rgba(255, 255, 255, 0.15), 0 10px 40px rgba(168, 85, 247, 0.1)'
              }}
            >
              SERVICIOS
            </span>
          </motion.h1>

          {/* Descripción encerrada */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={isHeroInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 1, delay: 0.2 }}
            className="flex justify-center mb-10"
          >
            <div className="inline-flex items-center gap-2 px-6 py-3 border border-white/20 rounded-full backdrop-blur-sm bg-white/5">
              <span className="text-sm sm:text-base font-light text-white/70 tracking-wide">
                Psicoanálisis · Transformación · Estructura
              </span>
            </div>
          </motion.div>
          
          {/* Conceptos clave */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={isHeroInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 1, delay: 0.4 }}
            className="flex flex-wrap items-center justify-center gap-8 mb-8"
          >
            {/* Inconsciente */}
            <motion.div 
              className="flex items-center gap-2"
              whileHover={{ scale: 1.05 }}
              transition={{ duration: 0.3 }}
            >
              <Brain className="w-5 h-5 text-white/40" strokeWidth={1.5} />
              <span className="text-base sm:text-lg font-light text-white tracking-wide">Inconsciente</span>
            </motion.div>

            {/* Separador minimalista */}
            <div className="w-px h-6 bg-white/20" />

            {/* Estructura */}
            <motion.div 
              className="flex items-center gap-2"
              whileHover={{ scale: 1.05 }}
              transition={{ duration: 0.3 }}
            >
              <Eye className="w-5 h-5 text-white/40" strokeWidth={1.5} />
              <span className="text-base sm:text-lg font-light text-white tracking-wide">Estructura</span>
            </motion.div>
          </motion.div>

          {/* Pregunta filosófica */}
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={isHeroInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 1, delay: 0.6 }}
            className="text-center text-base sm:text-lg lg:text-xl text-white/50 font-light italic leading-relaxed tracking-wide max-w-3xl mx-auto mb-12"
          >
            ¿Y si transformar no es cambiar lo que haces, sino comprender la estructura desde la que lo haces?
          </motion.p>

          {/* Línea decorativa */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={isHeroInView ? { opacity: 1 } : {}}
            transition={{ duration: 1, delay: 0.8 }}
            className="relative h-px mx-auto max-w-md overflow-hidden"
          >
            <motion.div
              initial={{ scaleX: 0 }}
              animate={isHeroInView ? { scaleX: 1 } : {}}
              transition={{ duration: 1.2, delay: 0.9, ease: [0.76, 0, 0.24, 1] }}
              className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent"
              style={{ transformOrigin: 'center' }}
            />
          </motion.div>
        </div>
      </section>

      {/* Quick Navigation - Hexagon Grid PREMIUM */}
      <section className="py-20 lg:py-32 px-6 lg:px-20 border-t border-white/10">
        <div className="max-w-7xl mx-auto">
          {/* Header mejorado */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="text-center mb-12"
          >
            {/* Badge superior */}
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="inline-flex items-center gap-2 px-4 py-2 border border-white/20 rounded-full bg-white/5 backdrop-blur-sm mb-8"
            >
              <Sparkles className="w-3 h-3 text-white/60" strokeWidth={1.5} />
              <span className="text-xs text-white/70 font-light uppercase tracking-[0.2em]">
                {t('servicesPage.hexGrid.badge')}
              </span>
            </motion.div>

            <h2 className="text-3xl lg:text-5xl font-light text-white mb-6 tracking-wide">
              {t('servicesPage.hexGrid.title')} <span className="italic font-normal">{t('servicesPage.hexGrid.titleItalic')}</span>
            </h2>
            <p className="text-white/60 text-sm lg:text-base font-extralight leading-relaxed tracking-wide max-w-2xl mx-auto mb-8">
              {t('servicesPage.hexGrid.description')}
            </p>

            {/* CTA WhatsApp - Ayuda personalizada */}
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.4 }}
              className="flex items-center justify-center gap-3 text-white/50 text-sm font-extralight"
            >
              <Brain className="w-4 h-4" strokeWidth={1.5} />
              <span>{t('servicesPage.hexGrid.helpQuestion')}</span>
              <a
                href={`https://wa.me/527228720520?text=${encodeURIComponent(t('servicesPage.hexGrid.helpWhatsapp'))}`}
                target="_blank"
                rel="noopener noreferrer"
                className="group relative inline-flex items-center gap-2 text-white hover:text-white transition-colors"
              >
                <span className="relative">
                  {t('servicesPage.hexGrid.helpAction')}
                  <span className="absolute -bottom-0.5 left-0 w-0 h-px bg-white transition-all duration-300 group-hover:w-full" />
                </span>
                <ArrowRight className="w-3 h-3 transition-transform duration-300 group-hover:translate-x-1" strokeWidth={1.5} />
              </a>
            </motion.div>
          </motion.div>

          {/* Hexagon Grid - SERVICIOS PSICOLÓGICOS */}
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6 lg:gap-8 mb-12">
            {[
              { id: 'individual', icon: Brain, titleKey: 'individual', color: 'from-violet-500 to-purple-600', target: 'consulta-individual' },
              { id: 'pareja', icon: Heart, titleKey: 'pareja', color: 'from-pink-500 to-rose-500', target: 'consulta-pareja' },
              { id: 'familiar', icon: Users, titleKey: 'familiar', color: 'from-cyan-400 to-blue-500', target: 'consulta-familiar' },
              { id: 'consultoria', icon: Briefcase, titleKey: 'consultoria', color: 'from-indigo-500 to-purple-500', target: 'consultoria-psicoanalitica' },
              { id: 'audios', icon: Mic, titleKey: 'audios', color: 'from-amber-400 to-orange-500', target: 'audios-inconsciente' },
              { id: 'luxmania', icon: Sparkles, titleKey: 'luxmania', color: 'from-fuchsia-400 to-pink-500', target: 'luxmania-proyecto' },
            ].map((item, i) => (
              <motion.button
                key={item.id}
                initial={{ opacity: 0, scale: 0.8 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: i * 0.05 }}
                whileHover={{ scale: 1.08, y: -8 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => {
                  const element = document.getElementById(item.target);
                  if (element) {
                    element.scrollIntoView({ behavior: 'smooth', block: 'center' });
                  }
                }}
                className="group relative flex flex-col items-center cursor-pointer"
              >
                {/* Hexagon Container - SOLO BORDES */}
                <div className="relative w-28 h-28 lg:w-32 lg:h-32 flex items-center justify-center">
                  {/* Hexagon OUTLINE ONLY con gradiente */}
                  <svg viewBox="0 0 100 100" className="absolute inset-0 w-full h-full">
                    <defs>
                      {/* Gradiente para el borde */}
                      <linearGradient id={`gradient-stroke-${item.id}`} x1="0%" y1="0%" x2="100%" y2="100%">
                        <stop offset="0%" stopColor="rgba(255,255,255,0.15)" />
                        <stop offset="50%" stopColor="rgba(255,255,255,0.3)" />
                        <stop offset="100%" stopColor="rgba(255,255,255,0.15)" />
                      </linearGradient>
                      {/* Gradiente para hover */}
                      <linearGradient id={`gradient-hover-${item.id}`} x1="0%" y1="0%" x2="100%" y2="100%">
                        <stop offset="0%" stopColor="rgba(255,255,255,0.4)" />
                        <stop offset="50%" stopColor="rgba(255,255,255,0.6)" />
                        <stop offset="100%" stopColor="rgba(255,255,255,0.4)" />
                      </linearGradient>
                    </defs>
                    
                    {/* Hexágono de fondo transparente con borde elegante */}
                    <polygon
                      points="50 1 95 25 95 75 50 99 5 75 5 25"
                      className="fill-none transition-all duration-500"
                      stroke={`url(#gradient-stroke-${item.id})`}
                      strokeWidth="1"
                      style={{
                        filter: 'drop-shadow(0 0 8px rgba(255,255,255,0.1))'
                      }}
                    />
                    
                    {/* Hexágono hover (aparece en hover) */}
                    <polygon
                      points="50 1 95 25 95 75 50 99 5 75 5 25"
                      className="fill-none opacity-0 group-hover:opacity-100 transition-all duration-500"
                      stroke={`url(#gradient-hover-${item.id})`}
                      strokeWidth="1.5"
                      style={{
                        filter: 'drop-shadow(0 0 20px rgba(255,255,255,0.3))'
                      }}
                    />
                  </svg>
                  
                  {/* Icon con color del gradiente */}
                  <item.icon 
                    className="relative z-10 w-9 h-9 lg:w-11 lg:h-11 text-white/70 group-hover:text-white transition-all duration-500 group-hover:scale-110 group-hover:rotate-3" 
                    strokeWidth={1.2} 
                  />
                  
                  {/* Glow effect sutil en hover - más grande */}
                  <div className={`absolute -inset-4 rounded-full bg-gradient-to-br ${item.color} opacity-0 blur-2xl group-hover:opacity-20 transition-all duration-500`} />
                  
                  {/* Punto luminoso giratorio en hover */}
                  <motion.div
                    className="absolute w-2 h-2 bg-white rounded-full opacity-0 group-hover:opacity-100"
                    style={{ top: '10%', left: '50%' }}
                    animate={{
                      rotate: 360,
                      scale: [1, 1.5, 1],
                    }}
                    transition={{
                      rotate: { duration: 3, repeat: Infinity, ease: "linear" },
                      scale: { duration: 1.5, repeat: Infinity, ease: "easeInOut" }
                    }}
                  />
                </div>

                {/* Text */}
                <div className="mt-5 text-center">
                  <h3 className="text-white/90 group-hover:text-white text-sm lg:text-base font-light tracking-[0.1em] mb-1.5 transition-colors duration-300">
                    {t(`servicesPage.hexGrid.hexagons.${item.titleKey}.title`)}
                  </h3>
                  <p className="text-white/30 group-hover:text-white/50 text-[10px] lg:text-xs font-extralight tracking-[0.15em] transition-colors duration-300">
                    {t(`servicesPage.hexGrid.hexagons.${item.titleKey}.subtitle`)}
                  </p>
                </div>
              </motion.button>
            ))}
          </div>

          {/* CTA Portafolio - Abajo de los hexágonos */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-center pt-8 border-t border-white/10"
          >
            <div className="flex items-center justify-center gap-3 text-white/40 text-sm font-extralight">
              <Eye className="w-4 h-4" strokeWidth={1.5} />
              <span>{t('servicesPage.hexGrid.portfolioQuestion')}</span>
              <a
                href="/portafolio"
                className="group relative inline-flex items-center gap-2 text-white/70 hover:text-white transition-colors"
              >
                <span className="relative">
                  {t('servicesPage.hexGrid.portfolioAction')}
                  <span className="absolute -bottom-0.5 left-0 w-0 h-px bg-white transition-all duration-300 group-hover:w-full" />
                </span>
                <ArrowRight className="w-3 h-3 transition-transform duration-300 group-hover:translate-x-1" strokeWidth={1.5} />
              </a>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Services Grid */}
      <section id="servicios-detalle" className="py-20 px-6 lg:px-20">
        <div className="max-w-7xl mx-auto space-y-32">
          {services.map((service, index) => (
            <ServiceDetail key={service.id} service={service} index={index} />
          ))}
        </div>
      </section>
    </div>
  )
}

const ServiceDetail = ({ service, index }) => {
  const { t } = useLanguage()
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, amount: 0.2 })
  
  // Get service data from translations
  const serviceData = t(`servicesPage.services.${service.key}`)

  return (
    <div ref={ref} id={service.id} className="relative scroll-mt-32">
      <motion.div
        initial={{ opacity: 0, y: 50 }}
        animate={isInView ? { opacity: 1, y: 0 } : {}}
        transition={{ duration: 0.8 }}
        className="grid lg:grid-cols-[1.1fr_1fr] gap-16 items-start"
      >
        {/* Left: Info - Estilo premium */}
        <div className="space-y-10">
          {/* Icon + Title */}
          <div>
            {/* Icon con animación sutil */}
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={isInView ? { opacity: 1, scale: 1 } : {}}
              transition={{ duration: 0.6 }}
              className="inline-flex items-center gap-3 px-4 py-2 border border-white/20 rounded-full bg-white/5 backdrop-blur-sm mb-8"
            >
              <service.icon className="w-4 h-4 text-white/60" strokeWidth={1.5} />
              <span className="text-white/70 text-xs font-light uppercase tracking-[0.25em]">
                {serviceData.subtitle}
              </span>
            </motion.div>
            
            {/* Título grande y espaciado */}
            <h2 className="text-4xl lg:text-6xl font-light text-white mb-6 font-display tracking-[0.05em] leading-[1.1]">
              {serviceData.title}
            </h2>
            
            {/* Tagline con estilo italic minimalista */}
            <p className="text-lg lg:text-xl text-white/60 font-light italic leading-relaxed tracking-wide mb-8">
              {serviceData.tagline}
            </p>
          </div>

          {/* Description */}
          <p className="text-base lg:text-lg text-white/70 leading-[1.9] font-extralight tracking-wide">
            {serviceData.description}
          </p>

          {/* Duration + CTA combinados */}
          <div className="pt-4 space-y-6">
            {/* Duration */}
            <div className="flex items-baseline gap-3">
              <span className="text-white/40 text-xs uppercase tracking-[0.2em] font-light">{t('servicesPage.detailLabels.duration')}</span>
              <div className="h-px flex-1 bg-gradient-to-r from-white/20 to-transparent" />
              <span className="text-base lg:text-lg font-light text-white/90 tracking-wide">{serviceData.duration}</span>
            </div>

            {/* CTA - Personalizado según servicio */}
            {service.external ? (
              <motion.a
                href="https://lux-mania.com"
                target="_blank"
                rel="noopener noreferrer"
                initial={{ opacity: 0, y: 10 }}
                animate={isInView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.6, delay: 0.3 }}
                className="group relative inline-flex items-center gap-3 overflow-hidden"
              >
                {/* Línea animada */}
                <motion.div
                  className="h-px bg-white/60 transition-all duration-500 group-hover:w-24"
                  style={{ width: '48px' }}
                />
                
                {/* Texto del botón */}
                <span className="text-sm font-light text-white uppercase tracking-[0.25em] transition-all duration-300 group-hover:tracking-[0.3em]">
                  Ir a LUXMANIA
                </span>
                
                {/* Ícono con animación */}
                <motion.div
                  animate={{ x: [0, 5, 0] }}
                  transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
                >
                  <ArrowRight className="w-4 h-4 text-white/80" strokeWidth={1.5} />
                </motion.div>
              </motion.a>
            ) : (
              <motion.a
                href={`https://wa.me/527228720520?text=${encodeURIComponent(`Hola, me interesa ${serviceData.title}`)}`}
                target="_blank"
                rel="noopener noreferrer"
                initial={{ opacity: 0, y: 10 }}
                animate={isInView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.6, delay: 0.3 }}
                className="group relative inline-flex items-center gap-3 overflow-hidden"
              >
                {/* Línea animada */}
                <motion.div
                  className="h-px bg-white/60 transition-all duration-500 group-hover:w-24"
                  style={{ width: '48px' }}
                />
                
                {/* Texto del botón */}
                <span className="text-sm font-light text-white uppercase tracking-[0.25em] transition-all duration-300 group-hover:tracking-[0.3em]">
                  {service.key === 'individual' || service.key === 'pareja' || service.key === 'familiar' ? 'Iniciar Consulta' : service.key === 'consultoria' ? 'Consultar' : 'Iniciar Proceso'}
                </span>
                
                {/* Ícono con animación */}
                <motion.div
                  animate={{ x: [0, 5, 0] }}
                  transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
                >
                  <ArrowRight className="w-4 h-4 text-white/80" strokeWidth={1.5} />
                </motion.div>
              </motion.a>
            )}
          </div>
        </div>

        {/* Right: Features + Process - Minimalista (oculto para LUXMANIA) */}
        {!service.external && (
          <div className="space-y-8">
            {/* Features */}
            <div className="border border-white/10 rounded-2xl p-8 lg:p-10 bg-white/[0.02] backdrop-blur-sm">
              <h3 className="text-base font-light text-white/90 mb-8 uppercase tracking-[0.2em]">
                {t('servicesPage.detailLabels.whatIncludes')}
              </h3>
              <ul className="space-y-5">
                {serviceData.features.map((feature, i) => (
                  <motion.li
                    key={i}
                    initial={{ opacity: 0, x: -20 }}
                    animate={isInView ? { opacity: 1, x: 0 } : {}}
                    transition={{ duration: 0.5, delay: i * 0.05 }}
                    className="flex items-start gap-4 group"
                  >
                    {/* Punto minimalista que crece en hover */}
                    <div className="relative mt-2">
                      <div className="w-1 h-1 rounded-full bg-white/40 transition-all duration-300 group-hover:w-1.5 group-hover:h-1.5 group-hover:bg-white/70" />
                    </div>
                    <span className="text-sm font-light text-white/70 leading-[1.8] tracking-wide transition-colors duration-300 group-hover:text-white/90">
                      {feature}
                    </span>
                  </motion.li>
                ))}
              </ul>
            </div>

            {/* Process */}
            <div className="border border-white/10 rounded-2xl p-8 lg:p-10 bg-white/[0.02] backdrop-blur-sm">
              <h3 className="text-base font-light text-white/90 mb-8 uppercase tracking-[0.2em]">
                {t('servicesPage.detailLabels.process')}
              </h3>
              <ol className="space-y-5">
                {serviceData.process.map((step, i) => (
                  <motion.li
                    key={i}
                    initial={{ opacity: 0, x: -20 }}
                    animate={isInView ? { opacity: 1, x: 0 } : {}}
                    transition={{ duration: 0.5, delay: i * 0.07 }}
                    className="flex items-start gap-5 group"
                  >
                    {/* Número con tipografía minimalista */}
                    <span className="text-xs font-light text-white/30 flex-shrink-0 mt-1 tracking-wider transition-colors duration-300 group-hover:text-white/50 tabular-nums">
                      {String(i + 1).padStart(2, '0')}
                    </span>
                    <span className="text-sm font-light text-white/70 leading-[1.8] tracking-wide transition-colors duration-300 group-hover:text-white/90">
                      {step}
                    </span>
                  </motion.li>
                ))}
              </ol>
            </div>
          </div>
        )}
      </motion.div>
    </div>
  )
}

export default ServiciosPage
