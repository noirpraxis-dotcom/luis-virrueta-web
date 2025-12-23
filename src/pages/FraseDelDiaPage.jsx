import { motion, useInView } from 'framer-motion'
import { useMemo, useRef, useState } from 'react'
import { Share2, Copy, CheckCircle } from 'lucide-react'

const MEXICO_TZ = 'America/Mexico_City'
const CHANGE_HOUR_MX = 6

const pad2 = (n) => String(n).padStart(2, '0')

const getMexicoParts = (date = new Date()) => {
  const parts = new Intl.DateTimeFormat('en-CA', {
    timeZone: MEXICO_TZ,
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    hourCycle: 'h23'
  }).formatToParts(date)

  const get = (type) => parts.find((p) => p.type === type)?.value
  return {
    y: Number(get('year')),
    m: Number(get('month')),
    d: Number(get('day')),
    hour: Number(get('hour'))
  }
}

const toDateKey = (y, m, d) => `${y}-${pad2(m)}-${pad2(d)}`

const dayOfYear = (y, m, d) => {
  const start = Date.UTC(y, 0, 1)
  const cur = Date.UTC(y, m - 1, d)
  return Math.floor((cur - start) / 86400000) + 1
}

const clamp = (v, min, max) => Math.min(max, Math.max(min, v))

const isValidDateKey = (s) => /^\d{4}-\d{2}-\d{2}$/.test(String(s || ''))

const getEffectiveMexicoDateKey = () => {
  const { y, m, d, hour } = getMexicoParts()
  if (Number.isFinite(hour) && hour < CHANGE_HOUR_MX) {
    const utc = new Date(Date.UTC(y, m - 1, d))
    utc.setUTCDate(utc.getUTCDate() - 1)
    return toDateKey(utc.getUTCFullYear(), utc.getUTCMonth() + 1, utc.getUTCDate())
  }
  return toDateKey(y, m, d)
}

const parseDateKeyToParts = (key) => {
  const [yy, mm, dd] = String(key).split('-').map((x) => Number(x))
  return { y: yy, m: mm, d: dd }
}

const PHRASES = [
  {
    id: '001',
    quote: 'No son las cosas las que nos perturban, sino la opinión que tenemos sobre ellas.',
    author: 'Epicteto',
    meaning:
      'La experiencia no llega "pura": llega filtrada por interpretación. La misma escena puede ser herida o entrenamiento según el marco interno. La tarea no es negar lo real, sino ver con qué lente lo vuelves inevitable.',
    questions: [
      '¿Qué interpretación estás tratando como si fuera un hecho?',
      'Si cambiaras el marco, ¿qué posibilidad aparecería?'
    ]
  },
  {
    id: '002',
    quote: 'La vida de un hombre es lo que sus pensamientos hacen de ella.',
    author: 'Marco Aurelio',
    meaning:
      'Tu vida no es solo lo que ocurre, sino la forma en que lo sostienes por dentro. El pensamiento no es un adorno: es arquitectura. Cambiar un hábito mental puede cambiar una década.',
    questions: ['¿Qué pensamiento te está diseñando en silencio?', '¿Qué hábito mental quieres dejar de alimentar?']
  },
  {
    id: '003',
    quote: 'El camino se hace al andar.',
    author: 'Antonio Machado',
    meaning:
      'A veces el sentido no se encuentra: se construye con acto y repetición. Esperar claridad perfecta suele ser otra forma de inmovilidad. Un paso real organiza más que mil planes imaginados.',
    questions: ['¿Qué paso mínimo sí puedes dar hoy?', '¿Qué estás esperando para sentirte "autorizado"?']
  },
  {
    id: '004',
    quote: 'Quien mira hacia afuera sueña; quien mira hacia adentro despierta.',
    author: 'Carl G. Jung',
    meaning:
      'Lo externo da contenido; lo interno da dirección. Sin lectura de tus deseos y defensas, el mundo te empuja. Mirar hacia dentro no es encerrarte: es recuperar agencia.',
    questions: ['¿Qué estás proyectando en otros?', '¿Qué verdad interna estás evitando nombrar?']
  },
  {
    id: '005',
    quote: 'Nada grande se hace de repente.',
    author: 'Epicteto',
    meaning:
      'Lo profundo casi siempre es gradual. El cambio real es más parecido a una reeducación de la atención que a un golpe de suerte. La paciencia no es pasividad: es método.',
    questions: ['¿Qué proceso estás queriendo resolver como evento?', '¿Qué repetición te daría 1% diario?']
  }
]

const pickPhraseByDateKey = (dateKey) => {
  const { y, m, d } = parseDateKeyToParts(dateKey)
  const doy = clamp(dayOfYear(y, m, d), 1, 366)
  const idx = (doy - 1) % PHRASES.length
  return { phrase: PHRASES[idx], dayOfYear: doy }
}

const FraseDelDiaPage = () => {
  const heroRef = useRef(null)
  const isHeroInView = useInView(heroRef, { once: true, amount: 0.3 })

  const [copied, setCopied] = useState(false)

  const dateKey = useMemo(() => {
    const params = new URLSearchParams(window.location.search)
    const q = params.get('date')
    if (isValidDateKey(q)) return q
    return getEffectiveMexicoDateKey()
  }, [])

  const { phrase, dayOfYear: doy } = useMemo(() => pickPhraseByDateKey(dateKey), [dateKey])

  const shareUrl = useMemo(() => {
    if (typeof window === 'undefined') return ''
    return `${window.location.origin}${window.location.pathname}?date=${encodeURIComponent(dateKey)}`
  }, [dateKey])

  const handleShare = async () => {
    const title = 'Frase del día'
    const text = `${phrase.quote} — ${phrase.author}`

    try {
      if (navigator?.share) {
        await navigator.share({ title, text, url: shareUrl })
        return
      }
    } catch {
      // ignore share cancellation
    }

    try {
      await navigator.clipboard.writeText(shareUrl)
      setCopied(true)
      setTimeout(() => setCopied(false), 1800)
    } catch {
      // ignore
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-black via-zinc-950 to-black text-white overflow-x-hidden">
      {/* Hero Section - Cinematográfico con video full */}
      <section ref={heroRef} className="relative min-h-screen flex items-center justify-center px-6 overflow-hidden">
        {/* Video Background */}
        <div className="absolute inset-0 overflow-hidden">
          <video
            autoPlay
            loop
            muted
            playsInline
            preload="auto"
            className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full object-cover opacity-60"
            style={{ minWidth: '100vw', minHeight: '100%', objectFit: 'cover', objectPosition: 'center' }}
          >
            <source src="/Frases.mp4" type="video/mp4" />
          </video>
          <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/40 to-black" />
        </div>

        {/* Contenido central */}
        <div className="relative z-10 w-full max-w-6xl mx-auto">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={isHeroInView ? { opacity: 1, scale: 1 } : {}}
            transition={{ duration: 1.2, ease: [0.22, 1, 0.36, 1] }}
            className="text-center space-y-12"
          >
            {/* Círculo con la frase - Diseño Google-like */}
            <div className="relative mx-auto" style={{ maxWidth: '700px' }}>
              {/* Círculo exterior decorativo */}
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 60, repeat: Infinity, ease: "linear" }}
                className="absolute inset-0 rounded-full"
                style={{
                  background: 'conic-gradient(from 0deg, transparent 0%, rgba(168, 85, 247, 0.3) 25%, transparent 50%, rgba(236, 72, 153, 0.3) 75%, transparent 100%)',
                  filter: 'blur(20px)',
                }}
              />
              
              {/* Contenedor principal */}
              <div className="relative bg-black/60 backdrop-blur-xl rounded-full border border-white/10 p-12 sm:p-16 lg:p-20">
                {/* Día del año - arriba */}
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={isHeroInView ? { opacity: 1, y: 0 } : {}}
                  transition={{ duration: 0.8, delay: 0.3 }}
                  className="absolute top-8 left-1/2 -translate-x-1/2"
                >
                  <div className="text-white/40 text-xs font-mono tracking-wider">
                    DÍA {String(doy).padStart(3, '0')} · {dateKey}
                  </div>
                </motion.div>

                {/* La frase en el centro */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={isHeroInView ? { opacity: 1, y: 0 } : {}}
                  transition={{ duration: 1, delay: 0.5 }}
                  className="space-y-6"
                >
                  <p 
                    className="text-2xl sm:text-3xl lg:text-4xl font-light text-white leading-relaxed"
                    style={{ letterSpacing: '0.02em' }}
                  >
                    "{phrase.quote}"
                  </p>
                  <div className="h-px bg-gradient-to-r from-transparent via-white/20 to-transparent w-32 mx-auto" />
                  <p className="text-white/60 text-sm sm:text-base font-light italic">
                    {phrase.author}
                  </p>
                </motion.div>

                {/* Indicador de scroll abajo */}
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={isHeroInView ? { opacity: 1 } : {}}
                  transition={{ duration: 0.8, delay: 1 }}
                  className="absolute bottom-6 left-1/2 -translate-x-1/2"
                >
                  <motion.div
                    animate={{ y: [0, 8, 0] }}
                    transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
                    className="text-white/30 text-xs tracking-widest"
                  >
                    DESLIZA
                  </motion.div>
                </motion.div>
              </div>
            </div>

            {/* Botón de compartir discreto */}
            <motion.button
              initial={{ opacity: 0 }}
              animate={isHeroInView ? { opacity: 1 } : {}}
              transition={{ duration: 0.8, delay: 1.2 }}
              onClick={handleShare}
              className="inline-flex items-center gap-2 px-4 py-2 text-xs text-white/50 hover:text-white/80 transition-colors"
            >
              <Share2 className="w-4 h-4" strokeWidth={1.5} />
              <span>Compartir</span>
            </motion.button>
          </motion.div>
        </div>
      </section>

      {/* Sección de Significado - Cinematográfica */}
      <section className="relative py-24 lg:py-32 px-6 lg:px-20">
        <div className="max-w-4xl mx-auto">
          
          {/* Significado */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 1 }}
            className="mb-20"
          >
            <motion.h2
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="text-sm uppercase tracking-widest text-white/40 font-light mb-8 text-center"
            >
              Significado
            </motion.h2>
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, delay: 0.4 }}
              className="text-xl lg:text-2xl font-light text-white/80 leading-relaxed text-center max-w-3xl mx-auto"
            >
              {phrase.meaning}
            </motion.p>
          </motion.div>

          {/* Divisor */}
          <div className="h-px bg-gradient-to-r from-transparent via-white/10 to-transparent mb-20" />

          {/* Preguntas */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 1 }}
          >
            <motion.h2
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="text-sm uppercase tracking-widest text-white/40 font-light mb-12 text-center"
            >
              Preguntas para reflexionar
            </motion.h2>
            
            <div className="space-y-8">
              {phrase.questions.map((q, idx) => (
                <motion.div
                  key={q}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.8, delay: 0.3 + idx * 0.15 }}
                  className="relative pl-12"
                >
                  {/* Número */}
                  <div className="absolute left-0 top-1 w-8 h-8 rounded-full border border-white/20 flex items-center justify-center">
                    <span className="text-sm text-white/50 font-light">{idx + 1}</span>
                  </div>
                  {/* Pregunta */}
                  <p className="text-lg lg:text-xl text-white/70 font-light leading-relaxed">
                    {q}
                  </p>
                </motion.div>
              ))}
            </div>
          </motion.div>

          {/* Botón copiar enlace - discreto */}
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 1 }}
            className="mt-20 text-center"
          >
            <button
              type="button"
              onClick={async () => {
                try {
                  await navigator.clipboard.writeText(shareUrl)
                  setCopied(true)
                  setTimeout(() => setCopied(false), 1800)
                } catch {
                  // ignore
                }
              }}
              className="inline-flex items-center gap-2 text-xs text-white/40 hover:text-white/70 transition-colors"
            >
              {copied ? (
                <>
                  <CheckCircle className="w-4 h-4" strokeWidth={1.5} />
                  <span>Enlace copiado</span>
                </>
              ) : (
                <>
                  <Copy className="w-4 h-4" strokeWidth={1.5} />
                  <span>Copiar enlace de esta frase</span>
                </>
              )}
            </button>
          </motion.div>
        </div>
      </section>
    </div>
  )
}

export default FraseDelDiaPage
