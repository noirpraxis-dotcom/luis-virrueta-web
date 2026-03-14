import { useEffect, useRef, useState } from 'react'
import { useSearchParams, Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { MessageCircle, CheckCircle2, ArrowRight, ShoppingCart, Calendar } from 'lucide-react'
import SEOHead from '../components/SEOHead'

const WORKER_URL = 'https://radiografia-worker.noirpraxis.workers.dev'
const API_BASE = import.meta.env.DEV ? '' : WORKER_URL

const ConsultaGraciasPage = () => {
  const [searchParams] = useSearchParams()
  const sessionId = searchParams.get('session_id')
  const type = searchParams.get('type') || 'individual'
  const isFree = searchParams.get('free') === 'true'
  const notifiedRef = useRef(false)

  const isPareja = type === 'pareja'
  const typeLabel = isPareja ? 'Consulta de Pareja' : 'Consulta Individual'

  const wpText = isPareja
    ? `Hola Luis, acabamos de comprar una Consulta de Pareja. Queremos coordinar la fecha y hora de nuestra sesión. 😊`
    : `Hola Luis, acabo de comprar una Consulta Individual. Me gustaría coordinar la fecha y hora. 😊`
  const wpUrl = `https://wa.me/527228720520?text=${encodeURIComponent(wpText)}`

  // Send notification to Luis once
  useEffect(() => {
    if (notifiedRef.current) return
    notifiedRef.current = true
    fetch(`${API_BASE}/api/notify-consulta-purchase`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ sessionId, type, free: isFree })
    }).catch(() => {})
  }, [])

  return (
    <div className="min-h-screen bg-black pt-20 lg:pt-28 flex items-center justify-center px-6 py-20">
      <SEOHead
        title={`¡Gracias por tu ${typeLabel}! — Luis Virrueta`}
        description="Tu consulta está confirmada. Contacta a Luis por WhatsApp para coordinar fecha y hora."
        url="/tienda/consulta-gracias"
      />

      <div className="max-w-lg mx-auto w-full space-y-12">

        {/* ── Check icon ─────────────────────────────────────── */}
        <motion.div
          initial={{ scale: 0.5, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.6, type: 'spring', stiffness: 200 }}
          className="flex justify-center"
        >
          <div className="w-24 h-24 rounded-full bg-emerald-500/15 border border-emerald-500/40 flex items-center justify-center">
            <CheckCircle2 className="w-12 h-12 text-emerald-400" />
          </div>
        </motion.div>

        {/* ── Title ──────────────────────────────────────────── */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.15 }}
          className="text-center space-y-4"
        >
          <h1 className="text-5xl lg:text-6xl font-light text-white">
            ¡Listo!
          </h1>
          <p className="text-xl text-white/60 font-light leading-relaxed">
            Tu <span className="text-white">{typeLabel}</span> está confirmada.
          </p>
          <p className="text-base text-white/40 font-light leading-relaxed max-w-sm mx-auto">
            {isPareja
              ? 'El siguiente paso es contactar a Luis por WhatsApp para elegir juntos la fecha y la hora de su sesión.'
              : 'El siguiente paso es contactar a Luis por WhatsApp para elegir la fecha y hora de tu sesión.'}
            {' '}Responde normalmente en menos de 24 horas.
          </p>
        </motion.div>

        {/* ── WhatsApp CTA ────────────────────────────────────── */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
        >
          <div className="p-6 bg-emerald-900/20 border border-emerald-500/30 rounded-2xl space-y-5">
            <div className="flex items-center justify-center gap-2 text-emerald-400">
              <Calendar className="w-5 h-5" />
              <span className="font-light text-sm tracking-widest uppercase">Siguiente paso</span>
            </div>

            <p className="text-center text-white/70 font-light text-sm leading-relaxed">
              {isPareja
                ? 'Uno de los dos toca el botón, le cuentan a Luis que ya compraron la sesión y coordinan el momento ideal para los dos.'
                : 'Toca el botón, cuéntale a Luis que ya compraste tu sesión y coordinen el mejor momento.'}
            </p>

            <motion.a
              href={wpUrl}
              target="_blank"
              rel="noopener noreferrer"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="flex w-full items-center justify-center gap-3 px-6 py-4 bg-emerald-500 hover:bg-emerald-400 text-white font-light rounded-xl transition-colors"
            >
              <MessageCircle className="w-5 h-5" />
              <span>Contactar a Luis por WhatsApp</span>
            </motion.a>
          </div>
        </motion.div>

        {/* ── Notes ───────────────────────────────────────────── */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.5 }}
          className="space-y-2 text-center text-sm text-white/30 font-light"
        >
          <p>Las sesiones son por videollamada. Luis te enviará el enlace al confirmar.</p>
          <p>Puedes comprar más sesiones sueltas en cualquier momento — sin contratos.</p>
        </motion.div>

        {/* ── Buy again / Back to store ────────────────────────── */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.65 }}
          className="flex flex-col sm:flex-row gap-4 justify-center"
        >
          <Link
            to={isPareja ? '/tienda/9' : '/tienda/8'}
            className="flex items-center justify-center gap-2 px-6 py-3 border border-white/20 rounded-xl text-white/60 hover:text-white hover:border-white/40 transition-colors font-light text-sm"
          >
            <ShoppingCart className="w-4 h-4" />
            <span>Comprar otra sesión</span>
          </Link>
          <Link
            to="/tienda"
            className="flex items-center justify-center gap-2 px-6 py-3 text-white/30 hover:text-white/60 transition-colors font-light text-sm"
          >
            <span>Ver todos los servicios</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </motion.div>
      </div>
    </div>
  )
}

export default ConsultaGraciasPage
