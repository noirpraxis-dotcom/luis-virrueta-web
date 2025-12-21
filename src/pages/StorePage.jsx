import { motion, useInView } from 'framer-motion'
import { useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import { ShoppingCart, Sparkles, Clock, CheckCircle2, ArrowRight, Brain, Eye } from 'lucide-react'
import { useLanguage } from '../context/LanguageContext'
import SEOHead from '../components/SEOHead'

const StorePage = () => {
  const { t } = useLanguage()
  const heroRef = useRef(null)
  const isHeroInView = useInView(heroRef, { once: true, amount: 0.3 })
  const productsRef = useRef(null)
  const isProductsInView = useInView(productsRef, { once: true, amount: 0.2 })
  const navigate = useNavigate()

  const products = [
    {
      id: 1,
      name: 'Sesión Individual',
      category: 'Psicoterapia',
      price: '$1,200 MXN',
      duration: '60 min',
      image: 'https://images.unsplash.com/photo-1506126613408-eca07ce68773?w=800&h=1000&fit=crop',
      description: 'Sesión de psicoterapia individual. Trabajo profundo con el inconsciente a través del método AION©.',
      shortDesc: 'Transformación desde el inconsciente',
      benefits: [
        'Trabajo con filtros limitantes',
        'Herramientas prácticas',
        'Enfoque integrativo',
        'Seguimiento personalizado'
      ],
      gradient: 'from-violet-600/20 to-purple-600/20',
      borderGradient: 'from-violet-500 to-purple-500'
    },
    {
      id: 2,
      name: 'Paquete 4 Sesiones',
      category: 'Proceso Terapéutico',
      price: '$4,320 MXN',
      duration: '4 sesiones',
      image: 'https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?w=800&h=1000&fit=crop',
      description: 'Ahorra 10% con este paquete. Proceso de transformación continuo y profundo.',
      shortDesc: 'Proceso continuo con ahorro',
      benefits: [
        'Ahorro del 10%',
        'Seguimiento continuo',
        'Transformación sostenida',
        'Programación flexible'
      ],
      gradient: 'from-fuchsia-600/20 to-pink-600/20',
      borderGradient: 'from-fuchsia-500 to-pink-500',
      popular: true
    },
    {
      id: 3,
      name: 'Consultoría Empresarial',
      category: 'Organizacional',
      price: '$2,500 MXN',
      duration: '90 min',
      image: 'https://images.unsplash.com/photo-1499209974431-9dddcece7f88?w=800&h=1000&fit=crop',
      description: 'Psicología organizacional para equipos. Mejora el clima desde el inconsciente colectivo.',
      shortDesc: 'Transforma tu organización',
      benefits: [
        'Análisis organizacional',
        'Dinámicas grupales',
        'Plan de acción',
        'Seguimiento trimestral'
      ],
      gradient: 'from-cyan-600/20 to-blue-600/20',
      borderGradient: 'from-cyan-500 to-blue-500'
    },
    {
      id: 4,
      name: 'Taller Método AION©',
      category: 'Desarrollo Personal',
      price: '$3,000 MXN',
      duration: '3 horas',
      image: 'https://images.unsplash.com/photo-1518531933037-91b2f5f229cc?w=800&h=1000&fit=crop',
      description: 'Taller grupal del Método AION©. Aprende a identificar y transformar tus filtros.',
      shortDesc: 'Aprende el método completo',
      benefits: [
        'Comprende tus filtros',
        'Herramientas aplicables',
        'Material descargable',
        'Comunidad de práctica'
      ],
      gradient: 'from-amber-600/20 to-orange-600/20',
      borderGradient: 'from-amber-500 to-orange-500'
    },
    {
      id: 5,
      name: 'Programa 8 Semanas',
      category: 'Transformación Profunda',
      price: '$8,960 MXN',
      duration: '8 sesiones',
      image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=800&h=1000&fit=crop',
      description: 'Programa intensivo de transformación. Incluye sesiones semanales y acompañamiento.',
      shortDesc: 'Transformación sostenida',
      benefits: [
        'Acompañamiento continuo',
        'Ejercicios semanales',
        'WhatsApp support',
        'Comunidad privada'
      ],
      gradient: 'from-indigo-600/20 to-purple-600/20',
      borderGradient: 'from-indigo-500 to-purple-500'
    },
    {
      id: 6,
      name: 'Asesoría Profesional',
      category: 'Para Psicólogos',
      price: '$1,800 MXN',
      duration: '60 min',
      image: 'https://images.unsplash.com/photo-1450778869180-41d0601e046e?w=800&h=1000&fit=crop',
      description: 'Supervisión para psicólogos. Integra el método AION© en tu práctica profesional.',
      shortDesc: 'Supervisión y mentoría',
      benefits: [
        'Supervisión de casos',
        'Integración del método',
        'Desarrollo profesional',
        'Certificación disponible'
      ],
      gradient: 'from-emerald-600/20 to-teal-600/20',
      borderGradient: 'from-emerald-500 to-teal-500'
    }
  ]

  return (
    <div className="min-h-screen bg-black pt-20 lg:pt-28">
      <SEOHead 
        title="Tienda - Luis Virrueta | Servicios Psicológicos"
        description="Sesiones de psicoterapia, talleres del método AION©, consultoría organizacional y programas de transformación personal."
        image="/carrito de compra.mp4"
        url="/tienda"
        type="website"
        tags={['terapia', 'psicología', 'método AION', 'transformación personal', 'consultoría']}
      />
      
      {/* Hero Section - Estilo ServiciosPage/BlogPage */}
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
            <source src="/carrito de compra.mp4" type="video/mp4" />
          </video>
        </div>
        
        {/* Gradiente inferior */}
        <div className="absolute inset-x-0 bottom-0 h-48 bg-gradient-to-t from-black/100 via-black/50 to-transparent z-[5] pointer-events-none" />

        <div className="relative max-w-6xl mx-auto z-10">
          {/* Título Hero */}
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

          {/* Badge en óvalo */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={isHeroInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 1, delay: 0.2 }}
            className="flex justify-center mb-10"
          >
            <div className="inline-flex items-center gap-2 px-6 py-3 border border-white/20 rounded-full backdrop-blur-sm bg-white/5">
              <span className="text-sm sm:text-base font-light text-white/70 tracking-wide">
                Transformación · Psicoterapia · Desarrollo Personal
              </span>
            </div>
          </motion.div>
          
          {/* Dos palabras con íconos */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={isHeroInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 1, delay: 0.4 }}
            className="flex flex-wrap items-center justify-center gap-8 mb-8"
          >
            {/* Profesional */}
            <motion.div 
              className="flex items-center gap-2"
              whileHover={{ scale: 1.05 }}
              transition={{ duration: 0.3 }}
            >
              <Brain className="w-5 h-5 text-white/40" strokeWidth={1.5} />
              <span className="text-base sm:text-lg font-light text-white tracking-wide">Profesional</span>
            </motion.div>

            {/* Separador */}
            <div className="w-px h-6 bg-white/20" />

            {/* Transformador */}
            <motion.div 
              className="flex items-center gap-2"
              whileHover={{ scale: 1.05 }}
              transition={{ duration: 0.3 }}
            >
              <Eye className="w-5 h-5 text-white/40" strokeWidth={1.5} />
              <span className="text-base sm:text-lg font-light text-white tracking-wide">Transformador</span>
            </motion.div>
          </motion.div>

          {/* Pregunta filosófica */}
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={isHeroInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 1, delay: 0.6 }}
            className="text-center text-base sm:text-lg lg:text-xl text-white/50 font-light italic leading-relaxed tracking-wide max-w-3xl mx-auto mb-12"
          >
            ¿Qué servicio resuena con el proceso que necesitas atravesar ahora?
          </motion.p>
        </div>
      </section>

      {/* Products Grid */}
      <section ref={productsRef} className="relative py-20 lg:py-32 px-6 lg:px-20">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {products.map((product, index) => (
              <motion.div
                key={product.id}
                initial={{ opacity: 0, y: 50 }}
                animate={isProductsInView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                onClick={() => navigate(`/tienda/${product.id}`)}
                className="group relative bg-zinc-900/50 backdrop-blur-sm rounded-2xl overflow-hidden border border-white/10 hover:border-white/20 transition-all duration-500 cursor-pointer"
              >
                {/* Popular badge */}
                {product.popular && (
                  <div className="absolute top-4 right-4 z-10 px-3 py-1 bg-gradient-to-r from-violet-600 to-fuchsia-600 rounded-full">
                    <span className="text-xs font-light text-white tracking-wide">MÁS POPULAR</span>
                  </div>
                )}

                {/* Imagen */}
                <div className="relative aspect-[3/4] overflow-hidden">
                  <motion.img
                    src={product.image}
                    alt={product.name}
                    whileHover={{ scale: 1.05 }}
                    transition={{ duration: 0.6 }}
                    className="absolute inset-0 w-full h-full object-cover"
                  />
                  
                  {/* Overlay gradiente */}
                  <div className={`absolute inset-0 bg-gradient-to-t ${product.gradient} to-transparent opacity-60 group-hover:opacity-40 transition-opacity`} />
                  
                  {/* Duration badge */}
                  <div className="absolute bottom-4 left-4 flex items-center gap-2 px-3 py-2 bg-black/60 backdrop-blur-sm rounded-lg">
                    <Clock className="w-4 h-4 text-white/70" />
                    <span className="text-sm font-light text-white/90">{product.duration}</span>
                  </div>
                </div>

                {/* Content */}
                <div className="p-6 space-y-4">
                  {/* Category */}
                  <span className="text-xs font-light text-white/50 tracking-wider uppercase">{product.category}</span>
                  
                  {/* Name */}
                  <h3 className="text-xl font-light text-white group-hover:text-violet-300 transition-colors">
                    {product.name}
                  </h3>
                  
                  {/* Short desc */}
                  <p className="text-sm text-white/60 font-light leading-relaxed">
                    {product.shortDesc}
                  </p>

                  {/* Benefits preview */}
                  <div className="space-y-2">
                    {product.benefits.slice(0, 2).map((benefit, i) => (
                      <div key={i} className="flex items-center gap-2">
                        <CheckCircle2 className="w-4 h-4 text-violet-400 flex-shrink-0" />
                        <span className="text-xs text-white/50 font-light">{benefit}</span>
                      </div>
                    ))}
                  </div>

                  {/* Price & CTA */}
                  <div className="flex items-center justify-between pt-4 border-t border-white/10">
                    <span className="text-2xl font-light text-white">{product.price}</span>
                    <motion.div
                      whileHover={{ x: 5 }}
                      className="flex items-center gap-2 text-violet-400 group-hover:text-violet-300"
                    >
                      <span className="text-sm font-light">Ver más</span>
                      <ArrowRight className="w-4 h-4" />
                    </motion.div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
    </div>
  )
}

export default StorePage
