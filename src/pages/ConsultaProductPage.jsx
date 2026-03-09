import { useState, useRef } from 'react'
import { motion, useInView } from 'framer-motion'
import { useNavigate, Link } from 'react-router-dom'
import {
  ArrowLeft, Clock, CheckCircle2, Tag, Loader2,
  MessageCircle, Star, ChevronDown, ChevronUp, Shield, Zap
} from 'lucide-react'
import SEOHead from '../components/SEOHead'

const API_BASE = import.meta.env.VITE_API_BASE_URL || ''

// ── Promo codes (also validated server-side) ─────────────────────
const PROMO_CODES = {
  individual: {
    'MENTELIBRE':  { label: '$500 MXN',   priceAmount: 500  },
    'LUISPRAXIS':  { label: 'GRATIS',     priceAmount: 0    }
  },
  pareja: {
    'DOSPUERTAS':  { label: '$1,000 MXN', priceAmount: 1000 },
    'VINCULOS650': { label: '$650 MXN',   priceAmount: 650  },
    'LUISPRAXIS':  { label: 'GRATIS',     priceAmount: 0    }
  }
}

// ── Product content ──────────────────────────────────────────────
const PRODUCT_DATA = {
  individual: {
    id: 8,
    name: 'Consulta Individual',
    category: 'Sesión 1:1 con Luis',
    tagline: 'Una hora que puede cambiarlo todo.',
    duration: '60 min',
    regularPrice: 1200,
    regularPriceLabel: '$1,200 MXN',
    image: '/individual imagen.jpg',
    gradient: 'from-emerald-600/20 to-teal-600/20',
    badgeGradient: 'from-emerald-600 to-teal-600',
    ctaGradient: 'from-emerald-600 to-teal-600',
    ctaHoverGradient: 'from-emerald-500 to-teal-500',
    accentColor: 'text-emerald-400',
    borderAccent: 'border-emerald-500/20',
    bgAccent: 'from-emerald-600/10 to-teal-600/10',
    description:
      'No venimos a hablar de síntomas. Venimos a ver qué hay por debajo. ' +
      'A través del Método AION©, trabajo los filtros inconscientes que están moldeando tu realidad — ' +
      'y comenzamos a atravesarlos.',
    longDescription:
      'Esta no es una sesión de desahogo. Es una sesión de trabajo real. ' +
      'Pregunto lo que nadie pregunta. Escucho lo que no estás diciendo. ' +
      'En esa intersección aparece lo que necesita ser visto. ' +
      'No necesitas saber qué vas a decir — solo aparecer con lo que hay.',
    forWho: [
      'Algo no está bien y no encuentras cómo nombrarlo',
      'Sabes qué está pasando pero no cómo moverte',
      'Llevas tiempo dando vueltas al mismo asunto',
      'Buscas una perspectiva honesta, sin rodeos ni filtros'
    ],
    benefits: [
      '60 minutos por videollamada',
      'Trabajo desde el Método AION©',
      'Preguntas que van al fondo — sin protocolo',
      'Ejercicios personalizados si el proceso lo pide',
      'Acompañamiento post-sesión vía WhatsApp',
      'Sin compromisos — puedes comprar más cuando lo necesites'
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
    category: 'Sesión para dos',
    tagline: 'Para lo que solos no pueden atravesar.',
    duration: '90 min',
    regularPrice: 2000,
    regularPriceLabel: '$2,000 MXN',
    image: '/pareja imagen.jpg',
    gradient: 'from-rose-600/20 to-pink-600/20',
    badgeGradient: 'from-rose-600 to-pink-600',
    ctaGradient: 'from-rose-600 to-pink-600',
    ctaHoverGradient: 'from-rose-500 to-pink-500',
    accentColor: 'text-rose-400',
    borderAccent: 'border-rose-500/20',
    bgAccent: 'from-rose-600/10 to-pink-600/10',
    description:
      'Las parejas no pelean por lo que creen que pelean. ' +
      'Detrás de cada conflicto hay un patrón: heredado, proyectado, repetido sin que nadie lo nombre. ' +
      'En esta sesión empezamos a nombrarlo.',
    longDescription:
      'No vengo a arbitrar quién tiene razón. ' +
      'Vengo a señalar lo que está pasando realmente. ' +
      'Los escucho a los dos. Identifico lo que cada uno proyecta en el otro. ' +
      'Y les devuelvo algo que solos no podían ver. ' +
      'La claridad puede incomodar — pero es mejor que seguir girando en el mismo ciclo.',
    forWho: [
      'Sienten que algo se está desgastando sin saber por qué',
      'El mismo conflicto se repite en distintas formas',
      'Quieren entenderse de verdad, no solo "llevarse bien"',
      'Están en una encrucijada y necesitan claridad externa'
    ],
    benefits: [
      '90 minutos por videollamada',
      'Para dos personas — juntos en la sesión',
      'Análisis de dinámicas inconscientes de pareja',
      'Sin tomar partido — perspectiva honesta y directa',
      'Acompañamiento post-sesión vía WhatsApp',
      'Sin compromisos — repiten cuando lo necesiten'
    ],
    steps: [
      { n: '01', title: 'Realizan el pago', desc: 'Seguro con Stripe. Un solo pago para los dos.' },
      { n: '02', title: 'Aparece el botón de WhatsApp', desc: 'Se ponen en contacto con Luis para agendar.' },
      { n: '03', title: 'La sesión sucede', desc: 'Online, juntos. 90 minutos de trabajo real.' },
      { n: '04', title: 'Seguimiento', desc: 'Si algo emerge después, Luis les acompaña por WhatsApp.' }
    ]
  }
}

// ── Component ────────────────────────────────────────────────────
const ConsultaProductPage = ({ type }) => {
  const navigate = useNavigate()
  const heroRef = useRef(null)
  const isHeroInView = useInView(heroRef, { once: true, amount: 0.3 })
  const detailsRef = useRef(null)
  const isDetailsInView = useInView(detailsRef, { once: true, amount: 0.3 })

  const [promoInput, setPromoInput] = useState('')
  const [promoApplied, setPromoApplied] = useState(null)
  const [promoError, setPromoError] = useState('')
  const [loading, setLoading] = useState(false)
  const [showPromo, setShowPromo] = useState(false)

  const product = PRODUCT_DATA[type]
  const codes = PROMO_CODES[type]

  const currentPrice = promoApplied ? promoApplied.priceAmount : product.regularPrice
  const currentPriceLabel =
    promoApplied
      ? promoApplied.label
      : product.regularPriceLabel

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
    try {
      const res = await fetch(`${API_BASE}/api/create-consulta-checkout`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          type,
          promoCode: promoApplied?.code || undefined
        })
      })
      const data = await res.json()
      if (data.url) {
        window.location.href = data.url
      } else {
        setLoading(false)
      }
    } catch {
      setLoading(false)
    }
  }

  const ctaLabel =
    promoApplied?.priceAmount === 0
      ? 'Continuar sin costo →'
      : `Pagar ${currentPriceLabel} →`

  return (
    <div className="min-h-screen bg-black pt-20 lg:pt-28">
      <SEOHead
        title={`${product.name} — Luis Virrueta`}
        description={product.description}
        image={product.image}
        url={`/tienda/${product.id}`}
        type="product"
      />

      {/* Back */}
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

      {/* ── Hero ──────────────────────────────────────────────── */}
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
              <div className={`absolute inset-0 bg-gradient-to-t ${product.gradient} to-transparent opacity-50`} />
              <div className={`absolute top-6 right-6 px-4 py-2 bg-gradient-to-r ${product.badgeGradient} rounded-full`}>
                <span className="text-sm font-light text-white">NUEVO</span>
              </div>
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

              {/* Title + tagline */}
              <div className="space-y-2">
                <h1 className="text-4xl lg:text-5xl font-light text-white">
                  {product.name}
                </h1>
                <p className="text-xl text-white/40 font-light italic">
                  {product.tagline}
                </p>
              </div>

              {/* Duration + price */}
              <div className="flex items-center gap-6 flex-wrap">
                <div className="flex items-center gap-2">
                  <Clock className="w-5 h-5 text-white/50" />
                  <span className="text-white/70 font-light">{product.duration}</span>
                </div>
                {promoApplied ? (
                  <div className="flex items-center gap-3">
                    <span className="text-white/30 line-through text-2xl font-light">
                      {product.regularPriceLabel}
                    </span>
                    <span className={`text-3xl font-light ${product.accentColor}`}>
                      {currentPriceLabel}
                    </span>
                    <span className={`text-xs font-light px-2 py-1 rounded-full bg-white/10 ${product.accentColor}`}>
                      código aplicado
                    </span>
                  </div>
                ) : (
                  <div className="text-3xl font-light text-white">
                    {product.regularPriceLabel}
                  </div>
                )}
              </div>

              {/* Description */}
              <p className="text-lg text-white/60 font-light leading-relaxed">
                {product.description}
              </p>

              {/* Benefits */}
              <div className="space-y-2.5">
                {product.benefits.map((b, i) => (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, x: -20 }}
                    animate={isHeroInView ? { opacity: 1, x: 0 } : {}}
                    transition={{ duration: 0.5, delay: 0.3 + i * 0.08 }}
                    className="flex items-start gap-3"
                  >
                    <CheckCircle2 className={`w-5 h-5 flex-shrink-0 mt-0.5 ${product.accentColor}`} />
                    <span className="text-white/70 font-light">{b}</span>
                  </motion.div>
                ))}
              </div>

              {/* ── Promo code ─────────────────────────────────── */}
              <div className="border-t border-white/10 pt-6 space-y-3">
                <button
                  onClick={() => setShowPromo(!showPromo)}
                  className="flex items-center gap-2 text-white/50 hover:text-white/80 transition-colors text-sm font-light"
                >
                  <Tag className="w-4 h-4" />
                  <span>¿Tienes un código de descuento?</span>
                  {showPromo
                    ? <ChevronUp className="w-4 h-4" />
                    : <ChevronDown className="w-4 h-4" />}
                </button>

                {showPromo && (
                  <motion.div
                    initial={{ opacity: 0, y: -8 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.25 }}
                    className="space-y-2"
                  >
                    <div className="flex gap-2">
                      <input
                        type="text"
                        value={promoInput}
                        onChange={e => {
                          setPromoInput(e.target.value)
                          setPromoError('')
                        }}
                        placeholder="Ingresa tu código"
                        className="flex-1 px-4 py-3 bg-zinc-900 border border-white/20 rounded-lg text-white placeholder-white/30 font-light focus:outline-none focus:border-white/40 uppercase tracking-wider text-sm"
                        onKeyDown={e => e.key === 'Enter' && applyPromo()}
                      />
                      <button
                        onClick={applyPromo}
                        className="px-5 py-3 bg-zinc-800 hover:bg-zinc-700 text-white font-light rounded-lg transition-colors text-sm"
                      >
                        Aplicar
                      </button>
                    </div>
                    {promoError && (
                      <p className="text-red-400 text-sm font-light">{promoError}</p>
                    )}
                    {promoApplied && (
                      <div className={`flex items-center gap-2 text-sm font-light ${product.accentColor}`}>
                        <CheckCircle2 className="w-4 h-4" />
                        <span>
                          ¡Código <strong>{promoApplied.code}</strong> aplicado! Precio: <strong>{promoApplied.label}</strong>
                        </span>
                      </div>
                    )}
                  </motion.div>
                )}
              </div>

              {/* ── Main CTA ────────────────────────────────────── */}
              <motion.button
                onClick={handlePay}
                disabled={loading}
                whileHover={!loading ? { scale: 1.02 } : {}}
                whileTap={!loading ? { scale: 0.98 } : {}}
                className={`w-full px-8 py-5 bg-gradient-to-r ${product.ctaGradient} hover:${product.ctaHoverGradient} disabled:opacity-60 text-white font-light rounded-lg transition-all duration-300 flex items-center justify-center gap-3`}
              >
                {loading ? (
                  <>
                    <Loader2 className="w-5 h-5 animate-spin" />
                    <span>Redirigiendo al pago...</span>
                  </>
                ) : (
                  <span className="tracking-wide text-lg">{ctaLabel}</span>
                )}
              </motion.button>

              {/* Trust indicators */}
              <div className="flex items-center gap-6 pt-1">
                <div className="flex items-center gap-2">
                  <Star className="w-4 h-4 text-yellow-500 fill-yellow-500" />
                  <span className="text-white/60 font-light text-sm">5.0</span>
                </div>
                <div className="flex items-center gap-2">
                  <Shield className="w-4 h-4 text-white/40" />
                  <span className="text-white/40 font-light text-sm">Pago 100 % seguro · Stripe</span>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* ── Details ───────────────────────────────────────────── */}
      <section ref={detailsRef} className="relative py-20 px-6 lg:px-20 bg-zinc-950/50">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">

            {/* Long description + for who */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={isDetailsInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.8 }}
              className="space-y-10"
            >
              <div className="space-y-4">
                <h2 className="text-2xl font-light text-white">¿En qué consiste?</h2>
                <p className="text-white/60 font-light leading-relaxed">
                  {product.longDescription}
                </p>
              </div>

              <div className="space-y-4">
                <h3 className="text-xl font-light text-white">Esta sesión es para ti si:</h3>
                <div className="space-y-3">
                  {product.forWho.map((item, i) => (
                    <motion.div
                      key={i}
                      initial={{ opacity: 0, x: -20 }}
                      animate={isDetailsInView ? { opacity: 1, x: 0 } : {}}
                      transition={{ duration: 0.5, delay: i * 0.1 }}
                      className="flex items-start gap-3"
                    >
                      <div className={`w-1.5 h-1.5 rounded-full flex-shrink-0 mt-2.5 ${
                        type === 'individual' ? 'bg-emerald-400' : 'bg-rose-400'
                      }`} />
                      <span className="text-white/70 font-light">{item}</span>
                    </motion.div>
                  ))}
                </div>
              </div>
            </motion.div>

            {/* How it works + secondary CTA */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={isDetailsInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="space-y-6"
            >
              <div className="p-8 bg-zinc-900/50 rounded-2xl border border-white/10">
                <h3 className="text-xl font-light text-white mb-6">
                  <Zap className="w-5 h-5 inline-block mr-2 text-yellow-400" />
                  ¿Cómo funciona?
                </h3>
                <div className="space-y-6">
                  {product.steps.map((step, i) => (
                    <div key={i} className="flex gap-4">
                      <span className="text-2xl font-light text-white/20 w-10 flex-shrink-0">
                        {step.n}
                      </span>
                      <div>
                        <p className="font-light text-white">{step.title}</p>
                        <p className="text-sm font-light text-white/50 mt-0.5">{step.desc}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Secondary CTA card */}
              <div className={`p-6 bg-gradient-to-br ${product.bgAccent} rounded-2xl border ${product.borderAccent}`}>
                <p className="text-white/80 font-light leading-relaxed mb-4">
                  Después del pago te aparece el botón de WhatsApp para coordinar directamente con Luis.
                </p>
                <motion.button
                  onClick={handlePay}
                  disabled={loading}
                  whileHover={!loading ? { scale: 1.02 } : {}}
                  whileTap={!loading ? { scale: 0.98 } : {}}
                  className="w-full px-6 py-4 bg-white text-black font-light rounded-lg hover:bg-white/90 transition-colors disabled:opacity-60 flex items-center justify-center gap-2"
                >
                  {loading ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      <span>Procesando...</span>
                    </>
                  ) : (
                    <span>Reservar mi sesión — {currentPriceLabel}</span>
                  )}
                </motion.button>
              </div>

              {/* Extra note */}
              <p className="text-white/30 font-light text-sm text-center">
                Sin contratos ni compromisos. Compra sesiones sueltas cuando las necesites.
              </p>
            </motion.div>
          </div>
        </div>
      </section>
    </div>
  )
}

export default ConsultaProductPage
