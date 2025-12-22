import { motion, useInView } from 'framer-motion'
import { useRef } from 'react'
import { useParams, useNavigate, Link } from 'react-router-dom'
import { ArrowLeft, Clock, CheckCircle2, Star, Calendar } from 'lucide-react'
import SEOHead from '../components/SEOHead'

const StoreProductPage = () => {
  const { id } = useParams()
  const navigate = useNavigate()
  const heroRef = useRef(null)
  const isHeroInView = useInView(heroRef, { once: true, amount: 0.3 })
  const detailsRef = useRef(null)
  const isDetailsInView = useInView(detailsRef, { once: true, amount: 0.3 })

  const products = {
    1: {
      name: 'Sesión Individual',
      category: 'Psicoterapia',
      price: '$750 MXN',
      duration: '60 min',
      image: '/individual imagen.jpg',
      description: 'Sesión de psicoterapia individual donde trabajamos desde el inconsciente, no desde los síntomas. A través del método AION© identificamos los filtros que están creando tu realidad actual y comenzamos el proceso de transformación.',
      longDescription: 'Esta no es una sesión tradicional. No venimos a tapar síntomas ni a "sentirnos mejor". Venimos a atravesar lo que te sostiene atrapado. Trabajo desde el psicoanálisis, la neurociencia y la filosofía de la conciencia. Si buscas respuestas rápidas, este no es el espacio. Si buscas transformación real, bienvenido.',
      benefits: [
        'Trabajo profundo con el inconsciente',
        'Identificación de filtros limitantes',
        'Herramientas prácticas aplicables inmediatamente',
        'Enfoque integrativo (psicoanálisis + neurociencia)',
        'Sin protocolos fijos, cada sesión es única',
        'Seguimiento personalizado vía WhatsApp'
      ],
      includes: [
        'Sesión de 60 minutos por videollamada',
        'Ejercicios personalizados post-sesión',
        'Acceso a material complementario',
        'Seguimiento entre sesiones'
      ],
      gradient: 'from-violet-600/20 to-purple-600/20',
      borderGradient: 'from-violet-500 to-purple-500'
    },
    2: {
      name: 'Sesión de Pareja',
      category: 'Terapia de Pareja',
      price: '$1,500 MXN',
      duration: '90 min',
      image: '/pareja imagen.jpg',
      description: 'Terapia de pareja desde el psicoanálisis. No venimos a "mejorar la comunicación". Venimos a desmontar las ilusiones que sostienen el conflicto.',
      longDescription: 'Las parejas no pelean por lo que creen que pelean. Pelean por lo que proyectan en el otro. Trabajamos desde ahí: desde el inconsciente que cada uno trae, desde los filtros heredados, desde las fantasías no dichas. Si buscan consejos o técnicas, este no es el espacio. Si están listos para atravesar lo que los sostiene atrapados, bienvenidos.',
      benefits: [
        'Análisis profundo de dinámicas relacionales',
        'Identificación de proyecciones mutuas',
        'Trabajo con patrones repetitivos de conflicto',
        'Desarrollo de comunicación consciente',
        'Desmontaje de fantasías idealizadas',
        'Herramientas para sostener el vínculo desde lo real'
      ],
      includes: [
        'Sesión de 90 minutos por videollamada',
        'Ejercicios para trabajar en pareja',
        'Material complementario',
        'Seguimiento entre sesiones'
      ],
      gradient: 'from-pink-600/20 to-rose-600/20',
      borderGradient: 'from-pink-500 to-rose-500'
    },
    3: {
      name: 'Sesión Familiar',
      category: 'Terapia Familiar',
      price: '$1,750 MXN',
      duration: '90 min',
      image: '/familia imagen.jpg',
      description: 'Terapia familiar sistémica. Trabajamos los patrones transgeneracionales que se repiten sin que nadie los nombre.',
      longDescription: 'Las familias no son solo las personas que están. Son también las historias no dichas, los roles heredados, los mandatos silenciosos. Trabajamos desde ahí: desde lo que se transmite sin palabras, desde lo que nadie dijo pero todos sienten. No venimos a "llevarnos mejor". Venimos a atravesar lo que nos sostiene atrapados en dinámicas que no elegimos.',
      benefits: [
        'Análisis de dinámicas familiares inconscientes',
        'Identificación de patrones transgeneracionales',
        'Trabajo con roles y mandatos familiares',
        'Reestructuración de vínculos disfuncionales',
        'Comprensión de lealtades invisibles',
        'Herramientas para romper ciclos repetitivos'
      ],
      includes: [
        'Sesión de 90 minutos por videollamada',
        'Genograma familiar (si es necesario)',
        'Ejercicios para trabajar en familia',
        'Material complementario',
        'Seguimiento entre sesiones'
      ],
      gradient: 'from-cyan-600/20 to-blue-600/20',
      borderGradient: 'from-cyan-500 to-blue-500'
    },
    4: {
      name: 'Paquete 4 Sesiones',
      category: 'Proceso Terapéutico',
      price: 'Elige tu modalidad',
      duration: '4 sesiones',
      image: '/paquete 4 sesiones imagen.jpg',
      description: 'Paquete de 4 sesiones con 20% de descuento. Elige entre Individual, Pareja, Familiar o Empresarial. La transformación real requiere continuidad.',
      longDescription: 'Este paquete te permite trabajar con continuidad en la modalidad que necesites. Cada sesión construye sobre la anterior. No es acumulativo: es estructural. Cada encuentro desarma una capa más profunda. Con 20% de ahorro, inviertes en un proceso real, no en un parche.',
      packageOptions: [
        {
          type: 'Individual',
          originalPrice: '$3,000 MXN',
          discountedPrice: '$2,400 MXN',
          duration: '4 × 60 min',
          description: 'Proceso individual continuo. 20% de descuento.'
        },
        {
          type: 'Pareja',
          originalPrice: '$6,000 MXN',
          discountedPrice: '$4,800 MXN',
          duration: '4 × 90 min',
          description: 'Proceso de pareja profundo. 20% de descuento.'
        },
        {
          type: 'Familiar',
          originalPrice: '$7,000 MXN',
          discountedPrice: '$5,600 MXN',
          duration: '4 × 90 min',
          description: 'Proceso familiar sistémico. 20% de descuento.'
        },
        {
          type: 'Empresarial',
          originalPrice: '$10,000 MXN',
          discountedPrice: '$8,000 MXN',
          duration: '4 × 90 min',
          description: 'Proceso organizacional continuo. 20% de descuento.'
        }
      ],
      benefits: [
        'Ahorro del 20% en todas las modalidades',
        'Proceso terapéutico continuo y estructurado',
        'Transformación sostenida en el tiempo',
        'Programación flexible según tu disponibilidad',
        'Prioridad en agenda',
        'Acompañamiento entre sesiones'
      ],
      includes: [
        '4 sesiones en la modalidad elegida',
        'Ejercicios personalizados entre sesiones',
        'Material descargable exclusivo',
        'WhatsApp support',
        'Válido por 3 meses'
      ],
      gradient: 'from-fuchsia-600/20 to-pink-600/20',
      borderGradient: 'from-fuchsia-500 to-pink-500',
      popular: true,
      isPackage: true
    },
    5: {
      name: 'Consultoría Empresarial',
      category: 'Organizacional',
      price: '$2,500 MXN',
      duration: '90 min',
      image: '/empresa imagen.jpg',
      description: 'Psicología organizacional aplicada. Trabajamos el clima laboral desde el inconsciente colectivo. No es team building: es reestructuración de dinámicas.',
      longDescription: 'Las empresas no son máquinas. Son organismos vivos con dinámicas inconscientes. Trabajamos desde ahí: conflictos no expresados, jerarquías ocultas, comunicación rota. Si quieres un equipo que funcione de verdad, no eventos motivacionales, esto es lo que necesitas.',
      benefits: [
        'Análisis profundo del clima organizacional',
        'Identificación de dinámicas disfuncionales',
        'Estrategias de comunicación consciente',
        'Plan de acción estructurado y medible',
        'Sesiones de seguimiento opcionales',
        'Informe escrito post-consultoría'
      ],
      includes: [
        'Sesión de 90 minutos con el equipo',
        'Diagnóstico organizacional',
        'Plan de intervención personalizado',
        'Informe detallado en PDF',
        'Seguimiento trimestral opcional'
      ],
      gradient: 'from-indigo-600/20 to-purple-600/20',
      borderGradient: 'from-indigo-500 to-purple-500'
    },
    6: {
      name: 'Taller Método AION©',
      category: 'Desarrollo Personal',
      price: '$2,650 MXN',
      duration: '3 horas intensivas',
      image: '/taller aion imagen.jpg',
      description: 'Taller grupal donde aprenderás las bases completas del Método AION©. Identificarás tus filtros y aprenderás a transformarlos de forma autónoma.',
      longDescription: 'Este taller no es informativo: es experiencial. No saldrás con "conocimiento", saldrás con herramientas aplicadas. Trabajamos en vivo tus filtros, los desmontamos, y te llevas un mapa claro de tu proceso. Incluye comunidad privada para seguimiento.',
      benefits: [
        'Comprensión profunda de cómo se forman tus filtros',
        'Identificación de patrones limitantes específicos',
        'Herramientas prácticas de transformación',
        'Material descargable completo',
        'Acceso a comunidad privada',
        'Sesiones de seguimiento grupal mensuales'
      ],
      includes: [
        '3 horas de taller en vivo (online)',
        'Workbook digital del método AION©',
        'Ejercicios prácticos guiados',
        'Acceso a comunidad privada',
        'Grabación del taller',
        '1 sesión grupal de seguimiento'
      ],
      gradient: 'from-amber-600/20 to-orange-600/20',
      borderGradient: 'from-amber-500 to-orange-500'
    }
  }

  const product = products[id]

  if (!product) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl text-white mb-4">Producto no encontrado</h2>
          <Link to="/tienda" className="text-violet-400 hover:text-violet-300">
            Volver a la tienda
          </Link>
        </div>
      </div>
    )
  }

  const handleWhatsApp = () => {
    const message = `Hola! Me interesa el servicio: ${product.name} (${product.price}). Me gustaría saber más información.`
    const whatsappURL = `https://wa.me/527228720520?text=${encodeURIComponent(message)}`
    window.open(whatsappURL, '_blank')
  }

  return (
    <div className="min-h-screen bg-black pt-20 lg:pt-28">
      <SEOHead 
        title={`${product.name} - Luis Virrueta`}
        description={product.description}
        image={product.image}
        url={`/tienda/${id}`}
        type="product"
      />

      {/* Back button */}
      <div className="max-w-7xl mx-auto px-6 lg:px-20 py-8">
        <motion.button
          onClick={() => navigate('/tienda')}
          whileHover={{ x: -5 }}
          className="flex items-center gap-2 text-white/60 hover:text-white transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span className="text-sm font-light">Volver a servicios</span>
        </motion.button>
      </div>

      {/* Hero with Image */}
      <section ref={heroRef} className="relative px-6 lg:px-20 pb-20">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-start">
            
            {/* Image */}
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              animate={isHeroInView ? { opacity: 1, x: 0 } : {}}
              transition={{ duration: 0.8 }}
              className="relative aspect-[4/3] rounded-2xl overflow-hidden"
            >
              <img
                src={product.image}
                alt={product.name}
                className="absolute inset-0 w-full h-full object-cover"
              />
              <div className={`absolute inset-0 bg-gradient-to-t ${product.gradient} to-transparent opacity-40`} />
              
              {product.popular && (
                <div className="absolute top-6 right-6 px-4 py-2 bg-gradient-to-r from-violet-600 to-fuchsia-600 rounded-full">
                  <span className="text-sm font-light text-white">MÁS POPULAR</span>
                </div>
              )}
            </motion.div>

            {/* Info */}
            <motion.div
              initial={{ opacity: 0, x: 50 }}
              animate={isHeroInView ? { opacity: 1, x: 0 } : {}}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="space-y-6"
            >
              {/* Category */}
              <span className="text-sm font-light text-white/50 tracking-wider uppercase">
                {product.category}
              </span>

              {/* Title */}
              <h1 className="text-4xl lg:text-5xl font-light text-white">
                {product.name}
              </h1>

              {/* Duration & Price */}
              <div className="flex items-center gap-6">
                <div className="flex items-center gap-2">
                  <Clock className="w-5 h-5 text-white/50" />
                  <span className="text-white/70 font-light">{product.duration}</span>
                </div>
                <div className="text-3xl font-light text-white">
                  {product.price}
                </div>
              </div>

              {/* Description */}
              <p className="text-lg text-white/60 font-light leading-relaxed">
                {product.description}
              </p>

              {/* Package Options - Solo para producto 4 */}
              {product.isPackage && product.packageOptions && (
                <div className="space-y-4">
                  <h3 className="text-xl font-light text-white">Elige tu modalidad:</h3>
                  <div className="grid grid-cols-1 gap-4">
                    {product.packageOptions.map((option, index) => (
                      <motion.div
                        key={index}
                        initial={{ opacity: 0, y: 20 }}
                        animate={isHeroInView ? { opacity: 1, y: 0 } : {}}
                        transition={{ duration: 0.5, delay: 0.4 + index * 0.1 }}
                        className="p-4 bg-zinc-900/50 border border-white/10 rounded-xl hover:border-violet-500/50 transition-all"
                      >
                        <div className="flex items-center justify-between mb-2">
                          <h4 className="text-white font-light text-lg">{option.type}</h4>
                          <div className="flex items-center gap-2">
                            <span className="text-white/40 text-sm line-through">{option.originalPrice}</span>
                            <span className="text-violet-400 font-light text-xl">{option.discountedPrice}</span>
                          </div>
                        </div>
                        <div className="flex items-center justify-between text-sm">
                          <span className="text-white/50">{option.duration}</span>
                          <span className="text-green-400 font-light">20% off</span>
                        </div>
                        <p className="text-white/60 text-sm font-light mt-2">{option.description}</p>
                      </motion.div>
                    ))}
                  </div>
                </div>
              )}

              {/* CTA Button */}
              <motion.button
                onClick={handleWhatsApp}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="w-full px-8 py-5 bg-gradient-to-r from-violet-600 to-fuchsia-600 hover:from-violet-500 hover:to-fuchsia-500 text-white font-light rounded-lg transition-all duration-300 flex items-center justify-center gap-3"
              >
                <Calendar className="w-5 h-5" />
                <span className="tracking-wide">Agendar por WhatsApp</span>
              </motion.button>

              {/* Trust indicators */}
              <div className="flex items-center gap-6 pt-4">
                <div className="flex items-center gap-2">
                  <Star className="w-5 h-5 text-yellow-500 fill-yellow-500" />
                  <span className="text-white/70 font-light">5.0</span>
                </div>
                <span className="text-white/50 font-light text-sm">
                  Respuesta en menos de 24h
                </span>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Details Section */}
      <section ref={detailsRef} className="relative py-20 px-6 lg:px-20 bg-zinc-950/50">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            
            {/* Long Description */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={isDetailsInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.8 }}
              className="space-y-6"
            >
              <h2 className="text-2xl font-light text-white">
                ¿En qué consiste?
              </h2>
              <p className="text-white/60 font-light leading-relaxed">
                {product.longDescription}
              </p>

              {/* Benefits */}
              <div className="space-y-4 pt-6">
                <h3 className="text-xl font-light text-white">
                  Lo que obtienes:
                </h3>
                <div className="space-y-3">
                  {product.benefits.map((benefit, index) => (
                    <motion.div
                      key={index}
                      initial={{ opacity: 0, x: -20 }}
                      animate={isDetailsInView ? { opacity: 1, x: 0 } : {}}
                      transition={{ duration: 0.5, delay: index * 0.1 }}
                      className="flex items-start gap-3"
                    >
                      <CheckCircle2 className="w-5 h-5 text-violet-400 flex-shrink-0 mt-0.5" />
                      <span className="text-white/70 font-light">{benefit}</span>
                    </motion.div>
                  ))}
                </div>
              </div>
            </motion.div>

            {/* Includes */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={isDetailsInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="space-y-6"
            >
              <div className="p-8 bg-zinc-900/50 rounded-2xl border border-white/10">
                <h3 className="text-xl font-light text-white mb-6">
                  Incluye:
                </h3>
                <div className="space-y-3">
                  {product.includes.map((item, index) => (
                    <div key={index} className="flex items-start gap-3">
                      <CheckCircle2 className="w-5 h-5 text-emerald-400 flex-shrink-0 mt-0.5" />
                      <span className="text-white/70 font-light">{item}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Final CTA */}
              <div className="p-6 bg-gradient-to-br from-violet-600/10 to-fuchsia-600/10 rounded-2xl border border-violet-500/20">
                <p className="text-white/80 font-light leading-relaxed mb-4">
                  ¿Listo para comenzar? Agenda tu sesión ahora y recibe confirmación en menos de 24 horas.
                </p>
                <motion.button
                  onClick={handleWhatsApp}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className="w-full px-6 py-4 bg-white text-black font-light rounded-lg hover:bg-white/90 transition-colors"
                >
                  Contactar por WhatsApp
                </motion.button>
              </div>
            </motion.div>
          </div>
        </div>
      </section>
    </div>
  )
}

export default StoreProductPage
