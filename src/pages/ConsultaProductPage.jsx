import { useState, useRef } from 'react'
import { motion, useInView } from 'framer-motion'
import { useNavigate } from 'react-router-dom'
import {
  ArrowLeft, Clock, CheckCircle2, Tag, Loader2,
  Star, ChevronDown, ChevronUp, Shield, Zap,
  Heart, MessageCircle, Users, Eye, Lock
} from 'lucide-react'
import SEOHead from '../components/SEOHead'

const API_BASE = import.meta.env.VITE_API_BASE_URL || ''

// ── Promo codes (also validated server-side) ─────────────────────
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

// ── IMAGES ────────────────────────────────────────────────────────
const PAREJA_IMAGES = {
  conexion: [
    '/productos/consulta pareja/cONEXI\u00d3N/0.jpg',
    '/productos/consulta pareja/cONEXI\u00d3N/1.jpg',
    '/productos/consulta pareja/cONEXI\u00d3N/2.jpg',
    '/productos/consulta pareja/cONEXI\u00d3N/3.jpg',
    '/productos/consulta pareja/cONEXI\u00d3N/4.jpg',
    '/productos/consulta pareja/cONEXI\u00d3N/5.jpg'
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

// ── Product content ──────────────────────────────────────────────
const PRODUCT_DATA = {
  individual: {
    id: 8,
    name: 'Consulta Individual',
    category: 'Sesi\u00f3n 1:1 con Luis Virrueta',
    tagline: 'Una hora que puede cambiarlo todo.',
    hook: 'No vienes a contarme qu\u00e9 te pasa. Vienes a ver qu\u00e9 hay debajo.',
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
      'A trav\u00e9s del M\u00e9todo AION\u00a9, trabajo los filtros inconscientes que est\u00e1n moldeando tu realidad. ' +
      'No es una sesi\u00f3n de desahogo. Es una sesi\u00f3n donde algo se mueve.',
    longDescription:
      'Pregunto lo que nadie pregunta. Escucho lo que no est\u00e1s diciendo. ' +
      'En esa intersecci\u00f3n aparece lo que necesita ser visto. ' +
      'No necesitas saber qu\u00e9 vas a decir \u2014 solo aparecer con lo que hay.',
    forWho: [
      { icon: Eye, text: 'Algo no est\u00e1 bien y no encuentras c\u00f3mo nombrarlo' },
      { icon: Zap, text: 'Sabes qu\u00e9 est\u00e1 pasando pero no c\u00f3mo moverte de ah\u00ed' },
      { icon: Lock, text: 'Llevas tiempo dando vueltas al mismo punto' },
      { icon: MessageCircle, text: 'Buscas una perspectiva honesta, sin rodeos' }
    ],
    benefits: [
      '60 minutos por videollamada \u2014 sin relleno',
      'M\u00e9todo AION\u00a9 \u2014 hecho para ir al fondo',
      'Preguntas que abren, no que clasifican',
      'Ejercicios si el proceso los pide',
      'Seguimiento post-sesi\u00f3n por WhatsApp',
      'Compra sesiones sueltas \u2014 sin compromisos'
    ],
    steps: [
      { n: '01', title: 'Realizas el pago', desc: 'Seguro con Stripe. En menos de un minuto.' },
      { n: '02', title: 'Aparece el bot\u00f3n de WhatsApp', desc: 'Te pones en contacto con Luis para elegir d\u00eda y hora.' },
      { n: '03', title: 'La sesi\u00f3n sucede', desc: 'Online, sin protocolo. Una hora de trabajo real.' },
      { n: '04', title: 'Seguimiento', desc: 'Si algo emerge despu\u00e9s, Luis te acompa\u00f1a por WhatsApp.' }
    ]
  },
  pareja: {
    id: 9,
    name: 'Consulta de Pareja',
    category: 'Sesi\u00f3n para dos \u2014 con Luis Virrueta',
    tagline: 'Para lo que solos no pueden atravesar.',
    hook: 'Las parejas no pelean por lo que creen que pelean.',
    duration: '90 min',
    regularPrice: 1199,
    regularPriceLabel: '$1,199 MXN',
    image: '/productos/consulta pareja/cONEXI\u00d3N/0.jpg',
    accentColor: 'text-rose-400',
    accentBg: 'bg-rose-500',
    borderAccent: 'border-rose-500/30',
    bgAccent: 'from-rose-600/10 to-pink-600/10',
    gradientFrom: 'from-rose-600',
    gradientTo: 'to-pink-600',
    lightBg: 'bg-rose-500/10',
    description:
      'Detr\u00e1s de cada conflicto hay un patr\u00f3n: heredado, proyectado, repetido sin que nadie lo nombre. ' +
      'En esta sesi\u00f3n empezamos a nombrarlo \u2014 juntos.',
    longDescription:
      'No vengo a arbitrar qui\u00e9n tiene raz\u00f3n. ' +
      'Vengo a se\u00f1alar lo que est\u00e1 pasando realmente. ' +
      'Los escucho a los dos. Identifico lo que cada uno proyecta en el otro. ' +
      'Y les devuelvo algo que solos no pod\u00edan ver.',
    forWho: [
      { icon: Heart, text: 'Sienten que algo se est\u00e1 desgastando sin saber por qu\u00e9' },
      { icon: Zap, text: 'El mismo conflicto se repite con distintas formas' },
      { icon: Users, text: 'Quieren entenderse de verdad, no solo "llevarse bien"' },
      { icon: Eye, text: 'Est\u00e1n en una encrucijada y necesitan claridad' }
    ],
    benefits: [
      '90 minutos por videollamada \u2014 juntos',
      'An\u00e1lisis de din\u00e1micas inconscientes de pareja',
      'Sin tomar partido \u2014 perspectiva real y directa',
      'Se nombra lo que nadie est\u00e1 nombrando',
      'Seguimiento post-sesi\u00f3n por WhatsApp',
      'Compra sesiones sueltas \u2014 sin paquetes obligatorios'
    ],
    steps: [
      { n: '01', title: 'Realizan el pago', desc: 'Seguro con Stripe. Un solo pago para los dos.' },
      { n: '02', title: 'Aparece el bot\u00f3n de WhatsApp', desc: 'Se ponen en contacto con Luis para agendar.' },
      { n: '03', title: 'La sesi\u00f3n sucede', desc: 'Online, juntos. 90 minutos de trabajo real.' },
      { n: '04', title: 'Seguimiento', desc: 'Si algo emerge despu\u00e9s, Luis les acompa\u00f1a v\u00eda WhatsApp.' }
    ]
  }
}

// ── Collage Component ────────────────────────────────────────────
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
          <img
            src={src}
            alt=""
            className="absolute inset-0 w-full h-full object-cover"
            loading="lazy"
          />
          <div className="absolute inset-0 bg-black/10" />
        </motion.div>
      ))}
    </div>
  )
}

// ── Main Component ───────────────────────────────────────────────
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

  const applyPromo = () => {
    const code = promoInput.toUpperCase().trim()
    const promo = codes[code]
    if (promo) {
      setPromoApplied({ code, ...promo })
      setPromoError('')
    } else {
      setPromoError('C\u00f3digo inv\u00e1lido o no aplica para este producto.')
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
      ? 'Continuar sin costo \u2192'
      : `Reservar sesi\u00f3n \u2014 ${currentPriceLabel}`

  // ── Promo + CTA block (reused) ──────────────────────────────
  const PayBlock = () => (
    <div className="space-y-4">
      {/* Promo toggle */}
      <button
        onClick={() => setShowPromo(!showPromo)}
        className="flex items-center gap-2 text-white/40 hover:text-white/70 transition-colors text-sm font-light"
      >
        <Tag className="w-4 h-4" />
        <span>¿Tienes un código de descuento?</span>
        {showPromo ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
      </button>

      {showPromo && (
        <motion.div
          initial={{ opacity: 0, y: -8 }}
          animate={{ opacity: 1, y: 0 }}
          className="space-y-2"
        >
          <div className="flex gap-2">
            <input
              type="text"
              value={promoInput}
              onChange={e => { setPromoInput(e.target.value); setPromoError('') }}
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
          {promoError && <p className="text-red-400 text-sm font-light">{promoError}</p>}
          {promoApplied && (
            <div className={`flex items-center gap-2 text-sm font-light ${product.accentColor}`}>
              <CheckCircle2 className="w-4 h-4" />
              <span>¡Código <strong>{promoApplied.code}</strong> aplicado! Precio: <strong>{promoApplied.label}</strong></span>
            </div>
          )}
        </motion.div>
      )}

      {/* Price */}
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

      {/* CTA */}
      <motion.button
        onClick={handlePay}
        disabled={loading}
        whileHover={!loading ? { scale: 1.02 } : {}}
        whileTap={!loading ? { scale: 0.98 } : {}}
        className={`w-full px-8 py-5 bg-gradient-to-r ${product.gradientFrom} ${product.gradientTo} disabled:opacity-60 text-white font-light rounded-xl transition-all duration-300 flex items-center justify-center gap-3 text-lg`}
      >
        {loading ? (
          <><Loader2 className="w-5 h-5 animate-spin" /><span>Redirigiendo al pago...</span></>
        ) : (
          <span className="tracking-wide">{ctaLabel}</span>
        )}
      </motion.button>

      <div className="flex items-center gap-4 justify-center pt-1">
        <div className="flex items-center gap-1.5">
          <Shield className="w-4 h-4 text-white/30" />
          <span className="text-white/30 font-light text-xs">Pago 100% seguro \u00b7 Stripe</span>
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
      <SEOHead
        title={`${product.name} \u2014 Luis Virrueta`}
        description={product.description}
        image={product.image}
        url={`/tienda/${product.id}`}
        type="product"
      />

      {/* Back */}
      <div className="max-w-7xl mx-auto px-6 lg:px-20 pt-8 pb-4">
        <motion.button
          onClick={() => navigate('/tienda')}
          whileHover={{ x: -5 }}
          className="flex items-center gap-2 text-white/60 hover:text-white transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span className="text-sm font-light">Volver a tienda</span>
        </motion.button>
      </div>

      {/* ======== SECTION 1 \u2014 HERO ======== */}
      <section ref={heroRef} className="relative px-6 lg:px-20 pb-16">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-16 items-center">

            {/* Left \u2014 Visual */}
            <motion.div
              initial={{ opacity: 0, y: 40 }}
              animate={isHeroInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.8 }}
            >
              {isPareja ? (
                <div className="space-y-3">
                  <div className="relative aspect-[16/10] rounded-2xl overflow-hidden">
                    <img src={PAREJA_IMAGES.conexion[0]} alt="Conexi\u00f3n de pareja" className="absolute inset-0 w-full h-full object-cover" />
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
                <div className="relative aspect-[4/3] rounded-2xl overflow-hidden">
                  <img src={product.image} alt={product.name} className="absolute inset-0 w-full h-full object-cover" />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent" />
                </div>
              )}
            </motion.div>

            {/* Right \u2014 Copy */}
            <motion.div
              initial={{ opacity: 0, y: 40 }}
              animate={isHeroInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.8, delay: 0.15 }}
              className="space-y-6"
            >
              <span className="text-sm font-light text-white/40 tracking-widest uppercase">
                {product.category}
              </span>

              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-light text-white leading-[1.1]">
                {product.name}
              </h1>

              <p className={`text-2xl font-light italic ${product.accentColor} leading-snug`}>
                {product.hook}
              </p>

              <p className="text-lg text-white/60 font-light leading-relaxed">
                {product.description}
              </p>

              {/* Quick benefits pills */}
              <div className="flex flex-wrap gap-3">
                {product.benefits.slice(0, 3).map((b, i) => (
                  <span key={i} className={`inline-flex items-center gap-2 px-3 py-1.5 ${product.lightBg} rounded-full text-sm font-light ${product.accentColor}`}>
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    {b.split('\u2014')[0].trim()}
                  </span>
                ))}
              </div>

              <PayBlock />
            </motion.div>
          </div>
        </div>
      </section>

      {/* ======== SECTION 2 \u2014 VIDEO (pareja only) ======== */}
      {isPareja && (
        <section className="relative py-16 px-6 lg:px-20 bg-zinc-950/60">
          <div className="max-w-5xl mx-auto space-y-8">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.7 }}
              className="text-center space-y-3"
            >
              <h2 className="text-3xl lg:text-4xl font-light text-white overflow-hidden">
                {'El amor se siente — pero los patrones se repiten'
                  .split(' ')
                  .map((word, wi) => (
                    <motion.span
                      key={wi}
                      initial={{ opacity: 0, y: 28 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      viewport={{ once: true }}
                      transition={{ duration: 0.45, delay: 0.1 + wi * 0.055, ease: 'easeOut' }}
                      className="inline-block mr-[0.28em]"
                    >
                      {word}
                    </motion.span>
                  ))}
              </h2>
              <motion.p
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: 0.65 }}
                className="text-white/50 font-light max-w-2xl mx-auto"
              >
                La conexión entre dos personas es real. Pero los conflictos que se repiten también lo son.
                Esta sesión existe para nombrar lo que está pasando por debajo.
              </motion.p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, scale: 0.96 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.7, delay: 0.1 }}
              className="relative aspect-video rounded-2xl overflow-hidden border border-white/10"
            >
              <video
                autoPlay
                loop
                muted
                playsInline
                className="absolute inset-0 w-full h-full object-cover"
              >
                <source src={PAREJA_IMAGES.video} type="video/mp4" />
              </video>
              <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent" />
            </motion.div>
          </div>
        </section>
      )}

      {/* ======== SECTION 3 \u2014 "\u00bfPARA QUI\u00c9N ES?" ======== */}
      <section ref={forWhoRef} className="relative py-20 px-6 lg:px-20">
        <div className="max-w-7xl mx-auto">
          <div className={`grid grid-cols-1 ${isPareja ? 'lg:grid-cols-2' : 'lg:grid-cols-5'} gap-12 lg:gap-16 items-start`}>

            {/* Text side */}
            <div className={`space-y-8 ${isPareja ? '' : 'lg:col-span-3'}`}>
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={isForWhoInView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.7 }}
                className="space-y-3"
              >
                <h2 className="text-3xl lg:text-4xl font-light text-white">
                  {isPareja ? '\u00bfEsto es para ustedes?' : '\u00bfEsto es para ti?'}
                </h2>
                <p className="text-white/50 font-light leading-relaxed">
                  {product.longDescription}
                </p>
              </motion.div>

              <div className="space-y-5">
                {product.forWho.map((item, i) => {
                  const Icon = item.icon
                  return (
                    <motion.div
                      key={i}
                      initial={{ opacity: 0, x: -20 }}
                      animate={isForWhoInView ? { opacity: 1, x: 0 } : {}}
                      transition={{ duration: 0.5, delay: i * 0.1 }}
                      className="flex items-start gap-4"
                    >
                      <div className={`w-10 h-10 rounded-full ${product.lightBg} flex items-center justify-center flex-shrink-0`}>
                        <Icon className={`w-5 h-5 ${product.accentColor}`} />
                      </div>
                      <p className="text-white/70 font-light text-lg pt-1.5">{item.text}</p>
                    </motion.div>
                  )
                })}
              </div>

              {/* All benefits */}
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

            {/* Image collage / image */}
            {isPareja ? (
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={isForWhoInView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.8, delay: 0.2 }}
              >
                <ImageCollage images={PAREJA_IMAGES.sesion} />
              </motion.div>
            ) : (
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={isForWhoInView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.8, delay: 0.2 }}
                className="lg:col-span-2 relative aspect-[3/4] rounded-2xl overflow-hidden"
              >
                <img src="/individual imagen.jpg" alt="Sesi\u00f3n individual" className="absolute inset-0 w-full h-full object-cover" />
                <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
              </motion.div>
            )}
          </div>
        </div>
      </section>

      {/* ======== SECTION 4 \u2014 PATRONES COLLAGE (pareja only) ======== */}
      {isPareja && (
        <section className="relative py-16 px-6 lg:px-20 bg-zinc-950/40">
          <div className="max-w-7xl mx-auto">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-center">

              <ImageCollage images={PAREJA_IMAGES.patrones} />

              <motion.div
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.7 }}
                className="space-y-6"
              >
                <h2 className="text-3xl lg:text-4xl font-light text-white">
                  Lo que no se nombra, se repite
                </h2>
                <p className="text-lg text-white/50 font-light leading-relaxed">
                  Muchas parejas llegan sintiéndose atrapadas en el mismo ciclo. La misma pelea, con distinto disfraz.
                  Pero el patrón no es el problema — es la puerta.
                </p>
                <p className="text-lg text-white/50 font-light leading-relaxed">
                  Cuando logras verlo, dejas de repetirlo. Eso es lo que hacemos en estos 90 minutos.
                </p>
                <div className={`p-5 rounded-xl ${product.lightBg} border ${product.borderAccent}`}>
                  <p className={`font-light ${product.accentColor} text-sm leading-relaxed italic`}>
                    "La claridad puede incomodar. Pero es mejor que seguir girando en el mismo ciclo."
                  </p>
                  <p className="text-white/40 font-light text-xs mt-2">— Luis Virrueta</p>
                </div>
              </motion.div>
            </div>
          </div>
        </section>
      )}

      {/* ======== SECTION 5 \u2014 HOW IT WORKS ======== */}
      <section ref={stepsRef} className="relative py-20 px-6 lg:px-20">
        <div className="max-w-4xl mx-auto">
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            animate={isStepsInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6 }}
            className="text-3xl lg:text-4xl font-light text-white text-center mb-14"
          >
            ¿Cómo funciona?
          </motion.h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            {product.steps.map((step, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 30 }}
                animate={isStepsInView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.5, delay: i * 0.1 }}
                className="p-6 bg-zinc-900/50 border border-white/10 rounded-2xl hover:border-white/20 transition-colors"
              >
                <span className={`text-3xl font-light ${product.accentColor} opacity-50`}>{step.n}</span>
                <h3 className="text-lg font-light text-white mt-2">{step.title}</h3>
                <p className="text-sm text-white/50 font-light mt-1">{step.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ======== SECTION 6 \u2014 FINAL CTA ======== */}
      <section ref={ctaRef} className="relative py-20 px-6 lg:px-20 bg-zinc-950/60">
        <div className="max-w-2xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={isCtaInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.7 }}
            className="text-center space-y-6"
          >
            <h2 className="text-3xl lg:text-4xl font-light text-white">
              {isPareja
                ? '\u00bfListos para ver lo que nadie les ha dicho?'
                : '\u00bfListo para ver lo que nadie te ha dicho?'}
            </h2>
            <p className="text-white/50 font-light leading-relaxed">
              {isPareja
                ? 'Un solo paso los separa de una perspectiva que puede cambiar todo. 90 minutos, sin filtros, sin protocolo.'
                : 'Un solo paso te separa de una perspectiva que puede cambiar todo. 60 minutos, sin filtros, sin protocolo.'}
            </p>

            {/* Stars */}
            <div className="flex items-center justify-center gap-3 py-2">
              {[...Array(5)].map((_, i) => (
                <Star key={i} className="w-5 h-5 text-yellow-500 fill-yellow-500" />
              ))}
            </div>

            <PayBlock />

            <p className="text-white/25 font-light text-sm pt-4">
              Sin contratos. Sin compromisos. Compra sesiones sueltas cuando lo necesites.
            </p>
          </motion.div>
        </div>
      </section>
    </div>
  )
}

export default ConsultaProductPage
