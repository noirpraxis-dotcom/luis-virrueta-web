import { useState, useRef } from 'react'
import { motion, useInView } from 'framer-motion'
import { useNavigate } from 'react-router-dom'
import {
  ArrowLeft, Clock, CheckCircle2, Tag, Loader2,
  Star, ChevronDown, ChevronUp, Shield, Zap,
  Heart, MessageCircle, Users, Eye, Lock, Brain, Quote
} from 'lucide-react'
import SEOHead from '../components/SEOHead'

const API_BASE = import.meta.env.VITE_API_BASE_URL || ''

const STRIPE_LINKS = {
  pareja: 'https://buy.stripe.com/8x23cvgDF03of793PP9AA08'
}

const PROMO_CODES = {
  individual: {
    'MENTELIBRE':  { label: '$500 MXN',   priceAmount: 500  },
    'VINCULOS650': { label: '$650 MXN',   priceAmount: 650  },
    'LUISPRAXIS':  { label: 'GRATIS',     priceAmount: 0    }
  },
  pareja: {
    'DOSPUERTAS':  { label: '$1,000 MXN', priceAmount: 1000 },
    'LUISPRAXIS':  { label: 'GRATIS',     priceAmount: 0    }
  }
}

const PAREJA_IMAGES = {
  conexion: [
    '/productos/consulta pareja/cONEXIÓN/0.jpg',
    '/productos/consulta pareja/cONEXIÓN/1.jpg',
    '/productos/consulta pareja/cONEXIÓN/2.jpg',
    '/productos/consulta pareja/cONEXIÓN/3.jpg',
    '/productos/consulta pareja/cONEXIÓN/4.jpg',
    '/productos/consulta pareja/cONEXIÓN/5.jpg'
  ],
  sesion: [
    '/productos/consulta pareja/imagenes pareja/1.jpg',
    '/productos/consulta pareja/imagenes pareja/2.jpg',
    '/productos/consulta pareja/imagenes pareja/3.jpg',
    '/productos/consulta pareja/imagenes pareja/4.jpg',
    '/productos/consulta pareja/imagenes pareja/5.jpg',
    '/productos/consulta pareja/imagenes pareja/6.jpg',
    '/productos/consulta pareja/imagenes pareja/7.jpg',
    '/productos/consulta pareja/imagenes pareja/8.jpg',
  ],
  patrones: [
    '/productos/consulta pareja/TRAUMA Y PATRONES/descarga - 2026-03-09T114026.738.jpg',
    '/productos/consulta pareja/TRAUMA Y PATRONES/descarga - 2026-03-09T114339.887.jpg',
    '/productos/consulta pareja/TRAUMA Y PATRONES/descarga - 2026-03-09T114838.359.jpg',
    '/productos/consulta pareja/TRAUMA Y PATRONES/descarga - 2026-03-09T115234.811.jpg',
    '/productos/consulta pareja/TRAUMA Y PATRONES/descarga - 2026-03-09T115335.554.jpg',
    '/productos/consulta pareja/TRAUMA Y PATRONES/descarga - 2026-03-09T115441.513.jpg',
    '/productos/consulta pareja/TRAUMA Y PATRONES/IMAGEN (2).jpg',
    '/productos/consulta pareja/TRAUMA Y PATRONES/IMAGEN (3).jpg',
    '/productos/consulta pareja/TRAUMA Y PATRONES/IMAGEN (4).jpg',
  ],
  video: '/productos/consulta pareja/VIDEO AMOR.mp4'
}

const INDIVIDUAL_IMAGES = {
  consulta: [
    '/productos/consulta individual/imagenes consulta/descarga - 2026-03-09T134637.679.jpg',
    '/productos/consulta individual/imagenes consulta/descarga - 2026-03-09T134644.527.jpg',
    '/productos/consulta individual/imagenes consulta/descarga - 2026-03-09T134658.040.jpg',
    '/productos/consulta individual/imagenes consulta/descarga - 2026-03-09T134821.193.jpg',
    '/productos/consulta individual/imagenes consulta/descarga - 2026-03-09T134855.466.jpg',
    '/productos/consulta individual/imagenes consulta/descarga - 2026-03-09T134946.693.jpg'
  ],
  inconsciente: [
    '/productos/consulta individual/imagenes traumas e inconsciente/descarga - 2026-03-09T133224.311.jpg',
    '/productos/consulta individual/imagenes traumas e inconsciente/descarga - 2026-03-09T133335.376.jpg',
    '/productos/consulta individual/imagenes traumas e inconsciente/descarga - 2026-03-09T133450.122.jpg',
    '/productos/consulta individual/imagenes traumas e inconsciente/descarga - 2026-03-09T133707.091.jpg',
    '/productos/consulta individual/imagenes traumas e inconsciente/descarga - 2026-03-09T133738.021.jpg',
    '/productos/consulta individual/imagenes traumas e inconsciente/descarga - 2026-03-09T133806.854.jpg',
    '/productos/consulta individual/imagenes traumas e inconsciente/descarga - 2026-03-09T133923.890.jpg',
    '/productos/consulta individual/imagenes traumas e inconsciente/descarga - 2026-03-09T134000.375.jpg',
    '/productos/consulta individual/imagenes traumas e inconsciente/descarga - 2026-03-09T134142.952.jpg',
    '/productos/consulta individual/imagenes traumas e inconsciente/descarga - 2026-03-09T134409.894.jpg',
    '/productos/consulta individual/imagenes traumas e inconsciente/descarga - 2026-03-09T134437.255.jpg'
  ]
}

const TESTIMONIALS = [
  {
    name: 'Andrea M.',
    type: 'pareja',
    time: '4 meses en proceso',
    text: 'Llegamos pensando que el problema era la comunicación. Luis nos mostró que realmente estábamos repitiendo los patrones de nuestros padres. Fue incómodo pero transformador.',
    image: '/productos/consulta pareja/imagenes pareja/3.jpg'
  },
  {
    name: 'Carlos R.',
    type: 'individual',
    time: '6 sesiones',
    text: 'Pensé que necesitaba motivación. Lo que necesitaba era alguien que me hiciera las preguntas que yo no me atrevía a hacerme. En una hora entendí más que en años de terapia convencional.',
    image: '/productos/consulta individual/imagenes consulta/descarga - 2026-03-09T134637.679.jpg'
  },
  {
    name: 'Mariana y Javier',
    type: 'pareja',
    time: '3 meses en proceso',
    text: 'Llevamos 8 años juntos y sentíamos que ya no había nada que hacer. Luis no nos dio consejos — nos devolvió algo que no podíamos ver solos. Hoy seguimos juntos y con otra claridad.',
    image: '/productos/consulta pareja/cONEXIÓN/2.jpg'
  },
  {
    name: 'Diego L.',
    type: 'individual',
    time: '2 sesiones',
    text: 'No sabía ni por dónde empezar. Solo sabía que algo no estaba bien. Luis lo identificó en los primeros 15 minutos. No es magia — es alguien que realmente escucha lo que no dices.',
    image: '/productos/consulta individual/imagenes traumas e inconsciente/descarga - 2026-03-09T133335.376.jpg'
  },
  {
    name: 'Sofía y Andrés',
    type: 'pareja',
    time: '5 meses en proceso',
    text: 'La misma pelea, distinto disfraz. Así fue durante años. En la primera sesión Luis nombró exactamente el patrón que repetíamos. Fue como encender la luz en un cuarto oscuro.',
    image: '/productos/consulta pareja/cONEXIÓN/4.jpg'
  },
  {
    name: 'Valentina G.',
    type: 'individual',
    time: '8 sesiones',
    text: 'Llevaba años con ansiedad y no entendía de dónde venía. Con el Método AION© empecé a ver los filtros que estaban operando sin que yo lo supiera. Hoy no necesito estrategias para "controlar" nada.',
    image: '/productos/consulta individual/imagenes traumas e inconsciente/descarga - 2026-03-09T133707.091.jpg'
  },
  {
    name: 'Roberto y Ana',
    type: 'pareja',
    time: '2 meses en proceso',
    text: 'Veníamos de otra terapia de pareja donde nos enseñaban "técnicas de comunicación". Aquí fue distinto. Luis trabaja lo que pasa debajo. Eso cambió todo.',
    image: '/productos/consulta pareja/imagenes pareja/5.jpg'
  },
  {
    name: 'Fernanda T.',
    type: 'individual',
    time: '3 sesiones',
    text: 'Mi vida estaba "bien" pero yo no. Una sesión con Luis bastó para darme cuenta de que estaba viviendo una vida que no elegí. Duro pero necesario.',
    image: '/productos/consulta individual/imagenes consulta/descarga - 2026-03-09T134855.466.jpg'
  },
  {
    name: 'Alejandro P.',
    type: 'individual',
    time: '5 sesiones',
    text: 'Siempre fui "el fuerte" de la familia. Con el Método AION© descubrí que esa fortaleza era una armadura que no me dejaba sentir. Cuando la vi, dejó de controlarme.',
    image: '/productos/consulta individual/imagenes traumas e inconsciente/descarga - 2026-03-09T133923.890.jpg'
  },
  {
    name: 'Daniela S.',
    type: 'individual',
    time: '4 sesiones',
    text: 'Vine por un problema de pareja y terminé descubriendo que el problema era conmigo. Luis no juzga — solo ilumina lo que no puedes ver solo. Eso lo cambia todo.',
    image: '/productos/consulta individual/imagenes traumas e inconsciente/descarga - 2026-03-09T134142.952.jpg'
  },
  {
    name: 'Patricia y Luis E.',
    type: 'pareja',
    time: '6 meses en proceso',
    text: 'Pensamos que íbamos a terminar. La terapia con Luis fue lo único que nos permitió ver qué estaba pasando realmente. No es motivación — es claridad. Y eso es lo que salva una relación.',
    image: '/productos/consulta pareja/imagenes pareja/7.jpg'
  }
]

const PRODUCT_DATA = {
  individual: {
    id: 8,
    name: 'Consulta Individual',
    category: 'Sesión 1:1 con Luis Virrueta',
    tagline: 'Una hora que puede cambiarlo todo.',
    hook: 'No vienes a contarme qué te pasa. Vienes a ver qué hay debajo.',
    duration: '60 min',
    regularPrice: 700,
    regularPriceLabel: '$700 MXN',
    image: '/individual imagen.jpg',
    accentColor: 'text-emerald-400',
    accentBg: 'bg-emerald-500',
    borderAccent: 'border-emerald-500/30',
    bgAccent: 'from-emerald-600/10 to-teal-600/10',
    gradientFrom: 'from-emerald-600',
    gradientTo: 'to-teal-600',
    lightBg: 'bg-emerald-500/10',
    description:
      'A través del Método AION©, trabajo los filtros inconscientes que están moldeando tu realidad. ' +
      'No es una sesión de desahogo. Es una sesión donde algo se mueve.',
    longDescription:
      'Pregunto lo que nadie pregunta. Escucho lo que no estás diciendo. ' +
      'En esa intersección aparece lo que necesita ser visto. ' +
      'No necesitas saber qué vas a decir — solo aparecer con lo que hay.',
    forWho: [
      { icon: Eye, text: 'Algo no está bien y no encuentras cómo nombrarlo' },
      { icon: Zap, text: 'Sabes qué está pasando pero no cómo moverte de ahí' },
      { icon: Lock, text: 'Llevas tiempo dando vueltas al mismo punto' },
      { icon: MessageCircle, text: 'Buscas una perspectiva honesta, sin rodeos' }
    ],
    benefits: [
      '60 minutos por videollamada — sin relleno',
      'Método AION© — hecho para ir al fondo',
      'Preguntas que abren, no que clasifican',
      'Ejercicios si el proceso los pide',
      'Seguimiento post-sesión por WhatsApp',
      'Compra sesiones sueltas — sin compromisos'
    ],
    steps: [
      { n: '01', title: 'Realizas el pago', desc: 'Seguro con Stripe. En menos de un minuto.' },
      { n: '02', title: 'Aparece el botón de WhatsApp', desc: 'Te pones en contacto con Luis para elegir día y hora.' },
      { n: '03', title: 'La sesión sucede', desc: 'Online, sin protocolo. Una hora de trabajo real.' },
      { n: '04', title: 'Seguimiento', desc: 'Si algo emerge después, Luis te acompaña por WhatsApp.' }
    ]
  },
  pareja: {
    id: 9,
    name: 'Consulta de Pareja',
    category: 'Sesión para dos — con Luis Virrueta',
    tagline: 'Para lo que solos no pueden atravesar.',
    hook: 'Las parejas no pelean por lo que creen que pelean.',
    duration: '90 min',
    regularPrice: 1199,
    regularPriceLabel: '$1,199 MXN',
    image: '/productos/consulta pareja/cONEXIÓN/0.jpg',
    accentColor: 'text-rose-400',
    accentBg: 'bg-rose-500',
    borderAccent: 'border-rose-500/30',
    bgAccent: 'from-rose-600/10 to-pink-600/10',
    gradientFrom: 'from-rose-600',
    gradientTo: 'to-pink-600',
    lightBg: 'bg-rose-500/10',
    description:
      'Detrás de cada conflicto hay un patrón: heredado, proyectado, repetido sin que nadie lo nombre. ' +
      'En esta sesión empezamos a nombrarlo — juntos.',
    longDescription:
      'No vengo a arbitrar quién tiene razón. ' +
      'Vengo a señalar lo que está pasando realmente. ' +
      'Los escucho a los dos. Identifico lo que cada uno proyecta en el otro. ' +
      'Y les devuelvo algo que solos no podían ver.',
    forWho: [
      { icon: Heart, text: 'Sienten que algo se está desgastando sin saber por qué' },
      { icon: Zap, text: 'El mismo conflicto se repite con distintas formas' },
      { icon: Users, text: 'Quieren entenderse de verdad, no solo "llevarse bien"' },
      { icon: Eye, text: 'Están en una encrucijada y necesitan claridad' }
    ],
    benefits: [
      '90 minutos por videollamada — juntos',
      'Análisis de dinámicas inconscientes de pareja',
      'Sin tomar partido — perspectiva real y directa',
      'Se nombra lo que nadie está nombrando',
      'Seguimiento post-sesión por WhatsApp',
      'Compra sesiones sueltas — sin paquetes obligatorios'
    ],
    steps: [
      { n: '01', title: 'Realizan el pago', desc: 'Seguro con Stripe. Un solo pago para los dos.' },
      { n: '02', title: 'Aparece el botón de WhatsApp', desc: 'Se ponen en contacto con Luis para agendar.' },
      { n: '03', title: 'La sesión sucede', desc: 'Online, juntos. 90 minutos de trabajo real.' },
      { n: '04', title: 'Seguimiento', desc: 'Si algo emerge después, Luis les acompaña vía WhatsApp.' }
    ]
  }
}

const ImageCollage = ({ images, className = '' }) => {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, amount: 0.2 })
  return (
    <div ref={ref} className={`grid grid-cols-3 gap-2 lg:gap-3 ${className}`}>
      {images.slice(0, 6).map((src, i) => (
        <motion.div
          key={i}
          initial={{ opacity: 0, scale: 0.9 }}
          animate={isInView ? { opacity: 1, scale: 1 } : {}}
          transition={{ duration: 0.5, delay: i * 0.08 }}
          className={`relative rounded-xl overflow-hidden ${
            i === 0 ? 'col-span-2 row-span-2 aspect-[4/3]' : 'aspect-[4/3]'
          }`}
        >
          <img src={src} alt="" className="absolute inset-0 w-full h-full object-cover" loading="lazy" />
          <div className="absolute inset-0 bg-black/10" />
        </motion.div>
      ))}
    </div>
  )
}

const TestimonialCard = ({ t, index, accentColor, lightBg }) => {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, amount: 0.3 })
  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 30 }}
      animate={isInView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.5, delay: index * 0.07 }}
      className="p-6 bg-zinc-900/60 border border-white/10 rounded-2xl hover:border-white/20 transition-colors flex flex-col"
    >
      <Quote className={`w-6 h-6 ${accentColor} opacity-40 mb-3 flex-shrink-0`} />
      <p className="text-white/70 font-light text-sm leading-relaxed flex-1">
        &ldquo;{t.text}&rdquo;
      </p>
      <div className="mt-4 pt-4 border-t border-white/10 flex items-center gap-3">
        {t.image ? (
          <div className="w-10 h-10 rounded-full overflow-hidden flex-shrink-0">
            <img src={t.image} alt="" className="w-full h-full object-cover" />
          </div>
        ) : (
          <div className={`w-10 h-10 rounded-full ${lightBg} flex items-center justify-center flex-shrink-0`}>
            <span className={`text-sm font-light ${accentColor}`}>{t.name[0]}</span>
          </div>
        )}
        <div>
          <p className="text-white text-sm font-light">{t.name}</p>
          <p className="text-white/40 text-xs font-light">{t.time}</p>
        </div>
      </div>
    </motion.div>
  )
}

const ConsultaProductPage = ({ type }) => {
  const navigate = useNavigate()
  const heroRef = useRef(null)
  const isHeroInView = useInView(heroRef, { once: true, amount: 0.2 })
  const forWhoRef = useRef(null)
  const isForWhoInView = useInView(forWhoRef, { once: true, amount: 0.2 })
  const stepsRef = useRef(null)
  const isStepsInView = useInView(stepsRef, { once: true, amount: 0.2 })
  const ctaRef = useRef(null)
  const isCtaInView = useInView(ctaRef, { once: true, amount: 0.3 })

  const [promoInput, setPromoInput] = useState('')
  const [promoApplied, setPromoApplied] = useState(null)
  const [promoError, setPromoError] = useState('')
  const [loading, setLoading] = useState(false)
  const [showPromo, setShowPromo] = useState(false)

  const product = PRODUCT_DATA[type]
  const codes = PROMO_CODES[type]
  const isPareja = type === 'pareja'
  const currentPriceLabel = promoApplied ? promoApplied.label : product.regularPriceLabel

  const relevantTestimonials = TESTIMONIALS.filter(
    t => t.type === type || t.type === 'both'
  ).slice(0, isPareja ? 9 : 6)

  const applyPromo = () => {
    const code = promoInput.toUpperCase().trim()
    const promo = codes[code]
    if (promo) {
      setPromoApplied({ code, ...promo })
      setPromoError('')
    } else {
      setPromoError('Código inválido o no aplica para este producto.')
      setPromoApplied(null)
    }
  }

  const handlePay = async () => {
    if (loading) return
    setLoading(true)
    if (promoApplied) {
      try {
        const res = await fetch(`${API_BASE}/api/create-consulta-checkout`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ type, promoCode: promoApplied.code })
        })
        const data = await res.json()
        if (data.url) { window.location.href = data.url; return }
      } catch { /* fall through */ }
      setLoading(false)
      return
    }
    const link = STRIPE_LINKS[type]
    if (link) {
      window.location.href = link
    } else {
      try {
        const res = await fetch(`${API_BASE}/api/create-consulta-checkout`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ type })
        })
        const data = await res.json()
        if (data.url) { window.location.href = data.url; return }
      } catch { /* fall through */ }
      setLoading(false)
    }
  }

  const ctaLabel = promoApplied?.priceAmount === 0
    ? 'Continuar sin costo →'
    : `Reservar sesión — ${currentPriceLabel}`

  const PayBlock = () => (
    <div className="space-y-4">
      <button onClick={() => setShowPromo(!showPromo)} className="flex items-center gap-2 text-white/40 hover:text-white/70 transition-colors text-sm font-light">
        <Tag className="w-4 h-4" />
        <span>{'¿'}Tienes un código de descuento?</span>
        {showPromo ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
      </button>
      {showPromo && (
        <motion.div initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }} className="space-y-2">
          <div className="flex gap-2">
            <input type="text" value={promoInput} onChange={e => { setPromoInput(e.target.value); setPromoError('') }}
              placeholder="Ingresa tu código"
              className="flex-1 px-4 py-3 bg-zinc-900 border border-white/20 rounded-lg text-white placeholder-white/30 font-light focus:outline-none focus:border-white/40 uppercase tracking-wider text-sm"
              onKeyDown={e => e.key === 'Enter' && applyPromo()} />
            <button onClick={applyPromo} className="px-5 py-3 bg-zinc-800 hover:bg-zinc-700 text-white font-light rounded-lg transition-colors text-sm">Aplicar</button>
          </div>
          {promoError && <p className="text-red-400 text-sm font-light">{promoError}</p>}
          {promoApplied && (
            <div className={`flex items-center gap-2 text-sm font-light ${product.accentColor}`}>
              <CheckCircle2 className="w-4 h-4" />
              <span>{'¡'}Código <strong>{promoApplied.code}</strong> aplicado! Precio: <strong>{promoApplied.label}</strong></span>
            </div>
          )}
        </motion.div>
      )}
      <div className="flex items-center gap-4 flex-wrap">
        {promoApplied ? (
          <>
            <span className="text-white/30 line-through text-2xl font-light">{product.regularPriceLabel}</span>
            <span className={`text-4xl font-light ${product.accentColor}`}>{currentPriceLabel}</span>
          </>
        ) : (
          <span className="text-4xl font-light text-white">{product.regularPriceLabel}</span>
        )}
        <div className="flex items-center gap-2 text-white/40">
          <Clock className="w-4 h-4" />
          <span className="font-light text-sm">{product.duration}</span>
        </div>
      </div>
      <motion.button onClick={handlePay} disabled={loading} whileHover={!loading ? { scale: 1.02 } : {}} whileTap={!loading ? { scale: 0.98 } : {}}
        className={`w-full px-8 py-5 bg-gradient-to-r ${product.gradientFrom} ${product.gradientTo} disabled:opacity-60 text-white font-light rounded-xl transition-all duration-300 flex items-center justify-center gap-3 text-lg`}>
        {loading ? (<><Loader2 className="w-5 h-5 animate-spin" /><span>Redirigiendo al pago...</span></>) : (<span className="tracking-wide">{ctaLabel}</span>)}
      </motion.button>
      <div className="flex items-center gap-4 justify-center pt-1">
        <div className="flex items-center gap-1.5">
          <Shield className="w-4 h-4 text-white/30" />
          <span className="text-white/30 font-light text-xs">Pago 100% seguro · Stripe</span>
        </div>
        <div className="flex items-center gap-1.5">
          <Lock className="w-4 h-4 text-white/30" />
          <span className="text-white/30 font-light text-xs">Sin contratos</span>
        </div>
      </div>
    </div>
  )

  return (
    <div className="min-h-screen bg-black pt-20 lg:pt-28">
      <SEOHead title={`${product.name} — Luis Virrueta`} description={product.description} image={product.image} url={`/tienda/${product.id}`} type="product" />

      <div className="max-w-7xl mx-auto px-6 lg:px-20 pt-8 pb-4">
        <motion.button onClick={() => navigate('/tienda')} whileHover={{ x: -5 }} className="flex items-center gap-2 text-white/60 hover:text-white transition-colors">
          <ArrowLeft className="w-4 h-4" />
          <span className="text-sm font-light">Volver a tienda</span>
        </motion.button>
      </div>

      {/* SECTION 1 — HERO */}
      <section ref={heroRef} className="relative px-6 lg:px-20 pb-16">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-16 items-center">
            <motion.div initial={{ opacity: 0, y: 40 }} animate={isHeroInView ? { opacity: 1, y: 0 } : {}} transition={{ duration: 0.8 }}>
              {isPareja ? (
                <div className="space-y-3">
                  <div className="relative aspect-[16/10] rounded-2xl overflow-hidden">
                    <img src={PAREJA_IMAGES.conexion[0]} alt="Conexión de pareja" className="absolute inset-0 w-full h-full object-cover" />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent" />
                  </div>
                  <div className="grid grid-cols-3 gap-2">
                    {PAREJA_IMAGES.conexion.slice(1, 4).map((src, i) => (
                      <div key={i} className="relative aspect-[4/3] rounded-xl overflow-hidden">
                        <img src={src} alt="" className="absolute inset-0 w-full h-full object-cover" loading="lazy" />
                      </div>
                    ))}
                  </div>
                </div>
              ) : (
                <div className="space-y-3">
                  <div className="relative aspect-[16/10] rounded-2xl overflow-hidden">
                    <img src={INDIVIDUAL_IMAGES.consulta[0]} alt="Consulta individual" className="absolute inset-0 w-full h-full object-cover" />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent" />
                  </div>
                  <div className="grid grid-cols-3 gap-2">
                    {INDIVIDUAL_IMAGES.consulta.slice(1, 4).map((src, i) => (
                      <div key={i} className="relative aspect-[4/3] rounded-xl overflow-hidden">
                        <img src={src} alt="" className="absolute inset-0 w-full h-full object-cover" loading="lazy" />
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </motion.div>
            <motion.div initial={{ opacity: 0, y: 40 }} animate={isHeroInView ? { opacity: 1, y: 0 } : {}} transition={{ duration: 0.8, delay: 0.15 }} className="space-y-6">
              <span className="text-sm font-light text-white/40 tracking-widest uppercase">{product.category}</span>
              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-light text-white leading-[1.1]">{product.name}</h1>
              <p className={`text-2xl font-light italic ${product.accentColor} leading-snug`}>{product.hook}</p>
              <p className="text-lg text-white/60 font-light leading-relaxed">{product.description}</p>
              <div className="flex flex-wrap gap-3">
                {product.benefits.slice(0, 3).map((b, i) => (
                  <span key={i} className={`inline-flex items-center gap-2 px-3 py-1.5 ${product.lightBg} rounded-full text-sm font-light ${product.accentColor}`}>
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    {b.split('—')[0].trim()}
                  </span>
                ))}
              </div>
              <PayBlock />
            </motion.div>
          </div>
        </div>
      </section>

      {/* SECTION 2 — SOBRE LUIS */}
      <section className="relative py-16 px-6 lg:px-20 bg-zinc-950/60">
        <div className="max-w-5xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-[280px_1fr] gap-10 lg:gap-14 items-center">
            <motion.div initial={{ opacity: 0, scale: 0.95 }} whileInView={{ opacity: 1, scale: 1 }} viewport={{ once: true }} transition={{ duration: 0.7 }} className="relative mx-auto md:mx-0">
              <div className="w-56 h-56 md:w-64 md:h-64 rounded-2xl overflow-hidden border border-white/10">
                <img src="/luxmania perfil.webp" alt="Luis Virrueta" className="w-full h-full object-cover" />
              </div>
              <div className={`absolute -bottom-3 -right-3 px-4 py-2 rounded-xl ${product.lightBg} border ${product.borderAccent}`}>
                <span className={`text-xs font-light ${product.accentColor}`}>Método AION©</span>
              </div>
            </motion.div>
            <motion.div initial={{ opacity: 0, y: 24 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.7, delay: 0.15 }} className="space-y-4">
              <h2 className="text-2xl lg:text-3xl font-light text-white">Luis Virrueta</h2>
              <p className="text-sm text-white/40 font-light tracking-wider uppercase">Psicólogo · Psicoanalista · Filósofo</p>
              <p className="text-white/60 font-light leading-relaxed">
                Me formé como psicólogo y me especialicé en psicoanálisis. Trabajo desde lo inconsciente
                — tanto lo que está reprimido como lo que opera sin que lo sepas. Desarrollo el Método
                AION©, que conecta psicología profunda, neurociencia y filosofía para modificar el marco
                desde el cual observas tu vida. No trabajo motivando ni reprogramando. Trabajo haciendo visible
                lo que estaba ahí pero nadie nombraba.
              </p>
              <div className="flex flex-wrap gap-4 pt-2">
                <div className="flex items-center gap-2">
                  <Brain className={`w-4 h-4 ${product.accentColor}`} />
                  <span className="text-white/50 text-sm font-light">Psicoanálisis e inconsciente</span>
                </div>
                <div className="flex items-center gap-2">
                  <Eye className={`w-4 h-4 ${product.accentColor}`} />
                  <span className="text-white/50 text-sm font-light">Filtros de percepción</span>
                </div>
                <div className="flex items-center gap-2">
                  <Zap className={`w-4 h-4 ${product.accentColor}`} />
                  <span className="text-white/50 text-sm font-light">Patrones inconscientes</span>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* SECTION 3 — PARA QUIÉN ES */}
      <section ref={forWhoRef} className="relative py-20 px-6 lg:px-20">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-start">
            <div className="space-y-8">
              <motion.div initial={{ opacity: 0, y: 30 }} animate={isForWhoInView ? { opacity: 1, y: 0 } : {}} transition={{ duration: 0.7 }} className="space-y-3">
                <h2 className="text-3xl lg:text-4xl font-light text-white">
                  {isPareja ? '¿Esto es para ustedes?' : '¿Esto es para ti?'}
                </h2>
                <p className="text-white/50 font-light leading-relaxed">{product.longDescription}</p>
              </motion.div>
              <div className="space-y-5">
                {product.forWho.map((item, i) => {
                  const Icon = item.icon
                  return (
                    <motion.div key={i} initial={{ opacity: 0, x: -20 }} animate={isForWhoInView ? { opacity: 1, x: 0 } : {}} transition={{ duration: 0.5, delay: i * 0.1 }} className="flex items-start gap-4">
                      <div className={`w-10 h-10 rounded-full ${product.lightBg} flex items-center justify-center flex-shrink-0`}>
                        <Icon className={`w-5 h-5 ${product.accentColor}`} />
                      </div>
                      <p className="text-white/70 font-light text-lg pt-1.5">{item.text}</p>
                    </motion.div>
                  )
                })}
              </div>
              <div className="pt-4 space-y-3">
                <h3 className="text-xl font-light text-white">Lo que incluye:</h3>
                {product.benefits.map((b, i) => (
                  <div key={i} className="flex items-start gap-3">
                    <CheckCircle2 className={`w-5 h-5 flex-shrink-0 mt-0.5 ${product.accentColor}`} />
                    <span className="text-white/60 font-light">{b}</span>
                  </div>
                ))}
              </div>
            </div>
            {isPareja ? (
              <motion.div initial={{ opacity: 0, y: 30 }} animate={isForWhoInView ? { opacity: 1, y: 0 } : {}} transition={{ duration: 0.8, delay: 0.2 }}>
                <ImageCollage images={PAREJA_IMAGES.sesion} />
              </motion.div>
            ) : (
              <motion.div initial={{ opacity: 0, y: 30 }} animate={isForWhoInView ? { opacity: 1, y: 0 } : {}} transition={{ duration: 0.8, delay: 0.2 }}>
                <ImageCollage images={INDIVIDUAL_IMAGES.consulta} />
              </motion.div>
            )}
          </div>
        </div>
      </section>

      {/* SECTION 4 — PATRONES / INCONSCIENTE COLLAGE */}
      <section className="relative py-16 px-6 lg:px-20 bg-zinc-950/40">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-center">
            <ImageCollage images={isPareja ? PAREJA_IMAGES.patrones : INDIVIDUAL_IMAGES.inconsciente} />
            <motion.div initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.7 }} className="space-y-6">
              <h2 className="text-3xl lg:text-4xl font-light text-white">
                {isPareja ? 'Lo que no se nombra, se repite' : 'Tu inconsciente dirige — hasta que lo ves'}
              </h2>
              <p className="text-lg text-white/50 font-light leading-relaxed">
                {isPareja
                  ? 'Muchas parejas llegan sintiéndose atrapadas en el mismo ciclo. La misma pelea, con distinto disfraz. Pero el patrón no es el problema — es la puerta.'
                  : 'Hay filtros que operan sin que lo sepas: cómo eliges, qué evitas, qué repites. No son defectos — son estructuras inconscientes que aprendiste antes de poder cuestionarlas.'}
              </p>
              <p className="text-lg text-white/50 font-light leading-relaxed">
                {isPareja
                  ? 'Cuando logras verlo, dejas de repetirlo. Eso es lo que hacemos en estos 90 minutos.'
                  : 'El Método AION© no trabaja sobre lo que te pasa. Trabaja sobre lo que hay debajo de lo que te pasa. Cuando lo ves, algo se mueve. Eso no se explica — se experimenta.'}
              </p>
              <div className={`p-5 rounded-xl ${product.lightBg} border ${product.borderAccent}`}>
                <p className={`font-light ${product.accentColor} text-sm leading-relaxed italic`}>
                  {isPareja
                    ? '\u201cLa claridad puede incomodar. Pero es mejor que seguir girando en el mismo ciclo.\u201d'
                    : '\u201cNo vengo a decirte lo que quieres escuchar. Vengo a mostrarte lo que necesitas ver.\u201d'}
                </p>
                <p className="text-white/40 font-light text-xs mt-2">— Luis Virrueta</p>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* SECTION 5 — HOW IT WORKS */}
      <section ref={stepsRef} className="relative py-20 px-6 lg:px-20">
        <div className="max-w-4xl mx-auto">
          <motion.h2 initial={{ opacity: 0, y: 20 }} animate={isStepsInView ? { opacity: 1, y: 0 } : {}} transition={{ duration: 0.6 }}
            className="text-3xl lg:text-4xl font-light text-white text-center mb-14">
            ¿Cómo funciona?
          </motion.h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            {product.steps.map((step, i) => (
              <motion.div key={i} initial={{ opacity: 0, y: 30 }} animate={isStepsInView ? { opacity: 1, y: 0 } : {}} transition={{ duration: 0.5, delay: i * 0.1 }}
                className="p-6 bg-zinc-900/50 border border-white/10 rounded-2xl hover:border-white/20 transition-colors">
                <span className={`text-3xl font-light ${product.accentColor} opacity-50`}>{step.n}</span>
                <h3 className="text-lg font-light text-white mt-2">{step.title}</h3>
                <p className="text-sm text-white/50 font-light mt-1">{step.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* SECTION 6 — TESTIMONIALS */}
      <section className="relative py-20 px-6 lg:px-20 bg-zinc-950/40">
        <div className="max-w-6xl mx-auto">
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.6 }} className="text-center space-y-3 mb-14">
            <h2 className="text-3xl lg:text-4xl font-light text-white">
              {isPareja ? 'Lo que dicen quienes ya pasaron por esto' : 'Lo que dicen quienes ya lo vivieron'}
            </h2>
            <p className="text-white/40 font-light max-w-xl mx-auto">Experiencias reales de personas que decidieron ver lo que estaba debajo.</p>
          </motion.div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {relevantTestimonials.map((t, i) => (
              <TestimonialCard key={i} t={t} index={i} accentColor={product.accentColor} lightBg={product.lightBg} />
            ))}
          </div>
        </div>
      </section>

      {/* SECTION 7 — FINAL CTA */}
      <section ref={ctaRef} className="relative py-20 px-6 lg:px-20 bg-zinc-950/60">
        <div className="max-w-2xl mx-auto">
          <motion.div initial={{ opacity: 0, y: 30 }} animate={isCtaInView ? { opacity: 1, y: 0 } : {}} transition={{ duration: 0.7 }} className="text-center space-y-6">
            <h2 className="text-3xl lg:text-4xl font-light text-white">
              {isPareja ? '¿Listos para ver lo que nadie les ha dicho?' : '¿Listo para ver lo que nadie te ha dicho?'}
            </h2>
            <p className="text-white/50 font-light leading-relaxed">
              {isPareja
                ? 'Un solo paso los separa de una perspectiva que puede cambiar todo. 90 minutos, sin filtros, sin protocolo.'
                : 'Un solo paso te separa de una perspectiva que puede cambiar todo. 60 minutos, sin filtros, sin protocolo.'}
            </p>
            <div className="flex items-center justify-center gap-3 py-2">
              {[...Array(5)].map((_, i) => (
                <Star key={i} className="w-5 h-5 text-yellow-500 fill-yellow-500" />
              ))}
            </div>
            <PayBlock />
            <p className="text-white/25 font-light text-sm pt-4">Sin contratos. Sin compromisos. Compra sesiones sueltas cuando lo necesites.</p>
          </motion.div>
        </div>
      </section>

      {/* SECTION 8 — CLOSING VISUAL */}
      <section className="relative py-16 px-6 lg:px-20">
        <div className="max-w-5xl mx-auto space-y-8">
          <motion.div initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.7 }} className="text-center space-y-3">
            <h2 className="text-3xl lg:text-4xl font-light text-white overflow-hidden">
              {(isPareja
                ? 'El amor se siente — pero los patrones se repiten'
                : 'Lo que no ves, te dirige — hasta que decides mirarlo'
              ).split(' ').map((word, wi) => (
                <motion.span key={wi} initial={{ opacity: 0, y: 28 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
                  transition={{ duration: 0.45, delay: 0.1 + wi * 0.055, ease: 'easeOut' }} className="inline-block mr-[0.28em]">
                  {word}
                </motion.span>
              ))}
            </h2>
            <motion.p initial={{ opacity: 0, y: 16 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.6, delay: 0.65 }}
              className="text-white/50 font-light max-w-2xl mx-auto">
              {isPareja
                ? 'La conexión entre dos personas es real. Pero los conflictos que se repiten también lo son. Esta sesión existe para nombrar lo que está pasando por debajo.'
                : 'Tus decisiones, relaciones y bloqueos tienen una lógica que no es la que crees. Esta sesión existe para hacer visible lo invisible — y que dejes de operarlo en automático.'}
            </motion.p>
          </motion.div>
          {isPareja ? (
            <motion.div initial={{ opacity: 0, scale: 0.96 }} whileInView={{ opacity: 1, scale: 1 }} viewport={{ once: true }} transition={{ duration: 0.7, delay: 0.1 }}
              className="relative aspect-video rounded-2xl overflow-hidden border border-white/10">
              <video autoPlay loop muted playsInline className="absolute inset-0 w-full h-full object-cover">
                <source src={PAREJA_IMAGES.video} type="video/mp4" />
              </video>
              <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent" />
            </motion.div>
          ) : (
            <motion.div initial={{ opacity: 0, scale: 0.96 }} whileInView={{ opacity: 1, scale: 1 }} viewport={{ once: true }} transition={{ duration: 0.7, delay: 0.1 }}
              className="grid grid-cols-2 md:grid-cols-4 gap-3">
              {INDIVIDUAL_IMAGES.inconsciente.slice(0, 8).map((src, i) => (
                <motion.div key={i} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: 0.1 + i * 0.06 }}
                  className={`relative rounded-xl overflow-hidden border border-white/10 ${i === 0 || i === 5 ? 'aspect-[3/4]' : 'aspect-[4/3]'}`}>
                  <img src={src} alt="" className="absolute inset-0 w-full h-full object-cover" loading="lazy" />
                  <div className="absolute inset-0 bg-black/20" />
                </motion.div>
              ))}
            </motion.div>
          )}
        </div>
      </section>
    </div>
  )
}

export default ConsultaProductPage
