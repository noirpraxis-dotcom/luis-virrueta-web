import { motion, AnimatePresence } from 'framer-motion'
import { useState, useRef, useMemo, useCallback, useEffect } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import { Heart, MessageCircle, Shield, Target, Users, Brain, ArrowRight, ArrowLeft, Check, Clock, FileText, Mail, Send, Download, Sparkles, Eye, Lock, Star, Activity, BarChart3, Zap, Layers, CreditCard, Loader2, Tag, Mic, MicOff, TrendingUp, TrendingDown, AlertTriangle } from 'lucide-react'
import SEOHead from '../components/SEOHead'
import jsPDF from 'jspdf'
import { analyzeRelationship } from '../services/deepseekService'

// ─── DATOS DEL TEST ───────────────────────────────────────────────

const AREAS = [
  { key: 'comunicacion', label: 'Comunicación', icon: MessageCircle, color: 'from-blue-400 to-cyan-400', desc: 'Cómo se entienden y resuelven conflictos.' },
  { key: 'intimidad', label: 'Intimidad', icon: Heart, color: 'from-pink-400 to-rose-400', desc: 'Conexión emocional y física.' },
  { key: 'admiracion', label: 'Admiración', icon: Star, color: 'from-amber-400 to-yellow-400', desc: 'Nivel de respeto y valoración mutua.' },
  { key: 'conflicto', label: 'Conflictos', icon: Activity, color: 'from-red-400 to-orange-400', desc: 'Problemas acumulados o evitados.' },
  { key: 'proyecto', label: 'Proyecto de vida', icon: Target, color: 'from-emerald-400 to-green-400', desc: 'Compatibilidad de metas.' },
  { key: 'seguridad', label: 'Seguridad emocional', icon: Shield, color: 'from-violet-400 to-purple-400', desc: 'Qué tan seguros se sienten juntos.' },
  { key: 'autonomia', label: 'Autonomía', icon: Users, color: 'from-indigo-400 to-blue-400', desc: 'Equilibrio entre cercanía e independencia.' },
  { key: 'idealizacion', label: 'Idealización', icon: Eye, color: 'from-fuchsia-400 to-pink-400', desc: 'Grado de idealización y expectativas proyectadas en el otro.' }
]

// ─── PREGUNTAS: DIAGNÓSTICO GRATUITO (23 preguntas, ~3 min) ──────

const QUESTIONS_QUICK = [
  // Comunicación (3)
  { id: 1, text: 'Cuando hablamos de algo importante, siento que nos escuchamos de verdad.', area: 'comunicacion', inverted: false },
  { id: 2, text: 'Las cosas pequeñas del día a día terminan generando tensión entre nosotros.', area: 'comunicacion', inverted: true },
  { id: 3, text: 'Logramos hablar de nuestros desacuerdos sin que se convierta en pelea.', area: 'comunicacion', inverted: false },
  // Intimidad (3)
  { id: 4, text: 'Convivimos más como compañeros de cuarto que como pareja.', area: 'intimidad', inverted: true },
  { id: 5, text: 'Siento una conexión profunda con mi pareja, incluso sin necesidad de palabras.', area: 'intimidad', inverted: false },
  { id: 6, text: 'Me resulta fácil mostrarme vulnerable emocionalmente con mi pareja.', area: 'intimidad', inverted: false },
  // Admiración (3)
  { id: 7, text: 'Siento genuina admiración por la persona que es mi pareja.', area: 'admiracion', inverted: false },
  { id: 8, text: 'Lo que hace mi pareja me irrita más de lo que debería.', area: 'admiracion', inverted: true },
  { id: 9, text: 'Disfruto contarle a otros las cualidades de mi pareja.', area: 'admiracion', inverted: false },
  // Conflicto (3)
  { id: 10, text: 'Evitamos ciertos temas porque sabemos que terminarán en conflicto.', area: 'conflicto', inverted: true },
  { id: 11, text: 'Arrastramos discusiones del pasado que nunca terminamos de resolver.', area: 'conflicto', inverted: true },
  { id: 12, text: 'Confío en que cuando surja un problema, lo resolveremos juntos.', area: 'conflicto', inverted: false },
  // Proyecto de vida (3)
  { id: 13, text: 'Sentimos que vamos en la misma dirección cuando pensamos en el futuro.', area: 'proyecto', inverted: false },
  { id: 14, text: 'En decisiones importantes, noto que tenemos visiones muy diferentes.', area: 'proyecto', inverted: true },
  { id: 15, text: 'Tenemos metas en común que nos entusiasman a los dos.', area: 'proyecto', inverted: false },
  // Seguridad emocional (2)
  { id: 16, text: 'Siento que mi pareja está de mi lado cuando más lo necesito.', area: 'seguridad', inverted: false },
  { id: 17, text: 'Dudo que mi pareja entienda lo que realmente necesito emocionalmente.', area: 'seguridad', inverted: true },
  // Autonomía (3)
  { id: 18, text: 'Puedo ser completamente yo mismo/a dentro de la relación.', area: 'autonomia', inverted: false },
  { id: 19, text: 'Siento que necesito pedir permiso o justificar mis decisiones personales.', area: 'autonomia', inverted: true },
  { id: 20, text: 'Pasar tiempo separados no genera malestar ni inseguridad en nuestra relación.', area: 'autonomia', inverted: false },
  // Idealización (3)
  { id: 21, text: 'Necesito a mi pareja para sentirme completo/a como persona.', area: 'idealizacion', inverted: true },
  { id: 22, text: 'Acepto los defectos de mi pareja sin intentar cambiarlos.', area: 'idealizacion', inverted: false },
  { id: 23, text: 'Espero que mi pareja llene vacíos que siento en mi propia vida.', area: 'idealizacion', inverted: true }
]

// ─── PREGUNTAS: DIAGNÓSTICO PREMIUM — CONFIRMATORIAS (25 preguntas, 3 por área) ───
// Estas preguntas validan/corroboran lo que las preguntas abiertas ya revelaron.

const QUESTIONS_DETAILED = [
  // Comunicación (3)
  { id: 101, text: 'Cuando hablamos de algo importante, siento que nos escuchamos de verdad.', area: 'comunicacion', inverted: false },
  { id: 102, text: 'Las cosas pequeñas del día a día terminan generando tensión entre nosotros.', area: 'comunicacion', inverted: true },
  { id: 107, text: 'Después de una conversación difícil, siento que llegamos a un mejor lugar.', area: 'comunicacion', inverted: false },
  // Intimidad (3)
  { id: 201, text: 'Convivimos más como compañeros de cuarto que como pareja.', area: 'intimidad', inverted: true },
  { id: 202, text: 'Siento una conexión profunda con mi pareja, incluso sin necesidad de palabras.', area: 'intimidad', inverted: false },
  { id: 203, text: 'Me resulta fácil mostrarme vulnerable emocionalmente con mi pareja.', area: 'intimidad', inverted: false },
  // Admiración (3)
  { id: 301, text: 'Siento genuina admiración por la persona que es mi pareja.', area: 'admiracion', inverted: false },
  { id: 302, text: 'Lo que hace mi pareja me irrita más de lo que debería.', area: 'admiracion', inverted: true },
  { id: 306, text: 'Admiro cómo mi pareja enfrenta los retos de la vida.', area: 'admiracion', inverted: false },
  // Conflicto (3)
  { id: 401, text: 'Evitamos ciertos temas porque sabemos que terminarán en conflicto.', area: 'conflicto', inverted: true },
  { id: 402, text: 'Arrastramos discusiones del pasado que nunca terminamos de resolver.', area: 'conflicto', inverted: true },
  { id: 406, text: 'Después de una pelea, logramos reparar las cosas sin guardar rencor.', area: 'conflicto', inverted: false },
  // Proyecto de vida (3)
  { id: 501, text: 'Sentimos que vamos en la misma dirección cuando pensamos en el futuro.', area: 'proyecto', inverted: false },
  { id: 503, text: 'Tenemos metas en común que nos entusiasman a los dos.', area: 'proyecto', inverted: false },
  { id: 506, text: 'Las decisiones importantes las tomamos juntos, pensando en los dos.', area: 'proyecto', inverted: false },
  // Seguridad emocional (3)
  { id: 601, text: 'Siento que mi pareja está de mi lado cuando más lo necesito.', area: 'seguridad', inverted: false },
  { id: 602, text: 'Dudo que mi pareja entienda lo que realmente necesito emocionalmente.', area: 'seguridad', inverted: true },
  { id: 603, text: 'Confío en que mi pareja no haría algo que me lastimara a propósito.', area: 'seguridad', inverted: false },
  // Autonomía (3)
  { id: 701, text: 'Puedo ser completamente yo mismo/a dentro de la relación.', area: 'autonomia', inverted: false },
  { id: 702, text: 'Siento que necesito pedir permiso o justificar mis decisiones personales.', area: 'autonomia', inverted: true },
  { id: 706, text: 'Siento que pierdo parte de quien soy dentro de esta relación.', area: 'autonomia', inverted: true },
  // Idealización (4 — área clave para análisis psicoanalítico)
  { id: 801, text: 'Necesito a mi pareja para sentirme completo/a como persona.', area: 'idealizacion', inverted: true },
  { id: 802, text: 'Acepto los defectos de mi pareja sin intentar cambiarlos.', area: 'idealizacion', inverted: false },
  { id: 805, text: 'Si mi relación terminara, sentiría que pierdo una parte esencial de mí.', area: 'idealizacion', inverted: true },
  { id: 806, text: 'Lo que siento por mi pareja tiene que ver con quién es, no con lo que me da.', area: 'idealizacion', inverted: false }
]

// ─── PREGUNTAS ABIERTAS (Premium — corazón del diagnóstico) ───────────────
// Son la fuente PRIMARIA de análisis. Diseñadas para que la persona hable con libertad
// sin darse cuenta de lo que está revelando. DeepSeek extrae patrones inconscientes,
// mecanismos de defensa, estructura del deseo, idealización y pérdida de autonomía.

const PHILOSOPHICAL_QUESTIONS = [
  { id: 'p1', text: 'Cuéntame, ¿qué te trajo hasta aquí? ¿Qué fue lo que te hizo querer explorar cómo está tu relación?' },
  { id: 'p2', text: 'Si le contaras la historia de tu relación a alguien que no la conoce — desde el principio hasta hoy — ¿cómo se la contarías?' },
  { id: 'p3', text: '¿Qué es lo que más disfrutas de estar con tu pareja? Cuéntamelo como si le platicaras a un amigo cercano.' },
  { id: 'p4', text: '¿Cómo es un día normal entre ustedes? Desde que se levantan hasta que se van a dormir... platícame cómo fluye.' },
  { id: 'p5', text: '¿Hay algo que últimamente traes guardado y no has podido decirle a tu pareja? Aquí puedes soltarlo con confianza.' },
  { id: 'p6', text: 'Imagina que mañana despiertas y tu pareja ya no está. No se fue enojada, simplemente ya no está. ¿Qué es lo primero que sentirías?' },
  { id: 'p7', text: '¿Sientes que das y recibes en equilibrio, o hay algo que se siente desparejo? Cuéntame cómo lo vives tú.' },
  { id: 'p8', text: 'Cuando se pelean o tienen un desacuerdo fuerte, ¿qué pasa? Platícame la película completa: quién dice qué, quién se cierra, cómo termina.' },
  { id: 'p9', text: '¿Qué es lo que más te cuesta aceptar de tu pareja — eso que te mueve por dentro aunque la quieras mucho?' },
  { id: 'p10', text: '¿Qué necesitarías de tu pareja que sientes que hoy no estás recibiendo? No lo que "debería" ser, sino lo que tú realmente necesitas.' },
  { id: 'p11', text: '¿Tu relación se parece en algo a la de tus papás, o sientes que es completamente diferente? Cuéntame qué ves.' },
  { id: 'p12', text: '¿Sientes que sigues siendo tú mismo/a dentro de la relación, o hay partes de ti que se han ido quedando en el camino?' },
  { id: 'p13', text: 'En tus propias palabras — sin pensarlo mucho — ¿qué significa para ti estar bien en pareja?' },
  { id: 'p14', text: 'Si pudieras ver tu relación dentro de cinco años y todo hubiera salido bien, ¿qué sería diferente a hoy?' },
  { id: 'p15', text: '¿Hay algo más que sientas que es importante y que no te pregunté? Algo que traes y quieras soltar.' }
]

// ─── MICRÓFONO (Web Speech API) ───────────────────────────────────

function MicButton({ onTranscript, onInterim }) {
  const [listening, setListening] = useState(false)
  const recognitionRef = useRef(null)

  const toggle = useCallback(() => {
    if (listening) {
      recognitionRef.current?.stop()
      setListening(false)
      onInterim?.('')
      return
    }
    const SR = window.SpeechRecognition || window.webkitSpeechRecognition
    if (!SR) return
    const recognition = new SR()
    recognition.lang = 'es-MX'
    recognition.continuous = true
    recognition.interimResults = true
    recognition.onresult = (e) => {
      let interim = ''
      for (let i = e.resultIndex; i < e.results.length; i++) {
        if (e.results[i].isFinal) {
          onTranscript?.(e.results[i][0].transcript)
        } else {
          interim += e.results[i][0].transcript
        }
      }
      onInterim?.(interim)
    }
    recognition.onerror = () => { setListening(false); onInterim?.('') }
    recognition.onend = () => { setListening(false); onInterim?.('') }
    recognitionRef.current = recognition
    recognition.start()
    setListening(true)
  }, [listening, onTranscript, onInterim])

  return (
    <button type="button" onClick={toggle}
      className={`absolute top-4 right-4 p-2.5 rounded-xl border transition-all duration-300 ${
        listening
          ? 'border-red-400/40 bg-red-500/10 text-red-400/80 animate-pulse'
          : 'border-white/10 bg-white/[0.03] text-white/30 hover:text-white/60 hover:border-white/20'
      }`}
      title={listening ? 'Detener dictado' : 'Dictar con voz'}>
      {listening ? <MicOff className="w-4 h-4" /> : <Mic className="w-4 h-4" />}
    </button>
  )
}

// ─── BARRA DE PROGRESO DEL ANÁLISIS ───────────────────────────────

const ANALYSIS_STAGES = [
  { label: 'Leyendo tu narrativa personal', duration: 60000 },
  { label: 'Identificando patrones en tu historia', duration: 60000 },
  { label: 'Analizando los datos confirmatorios', duration: 60000 },
  { label: 'Cruzando narrativa con datos', duration: 90000 },
  { label: 'Preparando tu informe personalizado', duration: 90000 }
]

function AnalyzingProgress({ philosophicalAnswers, philosophicalQuestions }) {
  const [currentStage, setCurrentStage] = useState(0)
  const [pct, setPct] = useState(0)
  const [quote, setQuote] = useState(null)
  const elapsedRef = useRef(0)

  const pickQuote = useCallback(() => {
    const entries = Object.entries(philosophicalAnswers || {}).filter(([, v]) => v && v.trim().length > 25)
    if (!entries.length) return null
    const [idx, text] = entries[Math.floor(Math.random() * entries.length)]
    const q = philosophicalQuestions?.[parseInt(idx)]
    const snippet = text.trim().length > 72 ? text.trim().slice(0, 72) + '...' : text.trim()
    return { snippet, label: q?.text }
  }, [philosophicalAnswers, philosophicalQuestions])

  useEffect(() => {
    setQuote(pickQuote())
    const TICK = 500
    const TAU = 150000 // 150 s time constant — reaches ~82% at 5 min
    const MAX_PCT = 88
    const timer = setInterval(() => {
      elapsedRef.current += TICK
      const t = elapsedRef.current
      setPct(Math.round(MAX_PCT * (1 - Math.exp(-t / TAU))))
      let cumulative = 0
      for (let i = 0; i < ANALYSIS_STAGES.length; i++) {
        cumulative += ANALYSIS_STAGES[i].duration
        if (t < cumulative) { setCurrentStage(i); break }
        if (i === ANALYSIS_STAGES.length - 1) setCurrentStage(i)
      }
    }, TICK)
    const quoteTimer = setInterval(() => setQuote(pickQuote()), 18000)
    return () => { clearInterval(timer); clearInterval(quoteTimer) }
  }, [pickQuote])

  return (
    <div>
      <div className="h-2 bg-white/5 rounded-full overflow-hidden mb-3">
        <motion.div className="h-full rounded-full bg-gradient-to-r from-violet-500 to-pink-400"
          animate={{ width: `${pct}%` }} transition={{ duration: 0.5, ease: 'easeOut' }} />
      </div>
      <div className="flex items-center justify-between mb-4">
        <AnimatePresence mode="wait">
          <motion.span key={currentStage} initial={{ opacity: 0, y: 5 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -5 }}
            className="text-violet-300/50 text-xs font-light tracking-wide">
            {ANALYSIS_STAGES[currentStage].label}...
          </motion.span>
        </AnimatePresence>
        <span className="text-white/30 text-xs font-light tabular-nums">{pct}%</span>
      </div>
      {quote?.snippet && (
        <AnimatePresence mode="wait">
          <motion.div key={quote.snippet} initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
            transition={{ duration: 0.6 }}
            className="mt-3 p-4 rounded-xl border border-violet-500/10 bg-violet-500/[0.02] text-left">
            <p className="text-violet-300/35 text-[10px] font-light uppercase tracking-[0.12em] mb-1.5">Leyendo lo que compartiste</p>
            <p className="text-white/40 text-sm font-light italic leading-relaxed">&ldquo;{quote.snippet}&rdquo;</p>
          </motion.div>
        </AnimatePresence>
      )}
    </div>
  )
}

function renderBold(text) {
  if (!text) return null
  return text.split(/\*\*(.*?)\*\*/g).map((part, i) =>
    i % 2 === 1 ? <strong key={i} className="font-semibold text-white/85">{part}</strong> : part
  )
}

// Extrae {title, description} de items con formato "**Título**: descripción"
function parseItemTitle(text) {
  if (!text) return { title: null, description: text }
  const match = text.match(/^\*\*(.+?)\*\*:?\s*(.*)$/s)
  if (match) return { title: match[1], description: match[2] }
  return { title: null, description: text }
}

// ─── OPCIONES ─────────────────────────────────────────────────────

const ANSWER_OPTIONS = [
  { label: 'Nada cierto para mí', value: 1 },
  { label: 'Poco cierto', value: 2 },
  { label: 'Algo cierto', value: 3 },
  { label: 'Bastante cierto', value: 4 },
  { label: 'Totalmente cierto', value: 5 }
]

const RESPONDENT_OPTIONS = [
  { label: 'A solas', value: 'yo', desc: 'Estoy respondiendo desde mi perspectiva' },
  { label: 'Con mi pareja presente', value: 'pareja', desc: 'Mi pareja está aquí conmigo' },
  { label: 'Lo respondemos juntos', value: 'ambos', desc: 'Estamos contestando en equipo' }
]

// ─── CÓDIGOS DE DESCUENTO ─────────────────────────────────────────
// En producción, validar estos códigos del lado del servidor (Stripe Promotion Codes)

const DISCOUNT_CODES = {
  'AMIGO30': { discount: 0.30, label: '30% de descuento' },
  'PAREJA25': { discount: 0.25, label: '25% de descuento' },
  'RELACION20': { discount: 0.20, label: '20% de descuento' },
  'LUISPRO': { discount: 1.0, label: 'Acceso gratuito (código profesional)' }
}

const PREMIUM_PRICE = 249 // MXN

// ─── FUNCIONES DE CÁLCULO ─────────────────────────────────────────

// Pesos por área (áreas más críticas pesan más en el resultado general)
const AREA_WEIGHTS = {
  comunicacion: 1.3,
  conflicto: 1.2,
  seguridad: 1.15,
  intimidad: 1.05,
  autonomia: 1.0,
  admiracion: 0.95,
  idealizacion: 0.95,
  proyecto: 0.9
}

function calculateScores(answers, questions) {
  const areaScores = {}
  for (const area of AREAS) {
    const areaQuestions = questions.filter(q => q.area === area.key)
    let total = 0
    let count = 0
    for (const q of areaQuestions) {
      const raw = answers[q.id]
      if (raw == null) continue
      total += q.inverted ? (6 - raw) : raw
      count++
    }
    areaScores[area.key] = count > 0 ? total / count : 0
  }
  return areaScores
}

// Detección de inconsistencias entre respuestas
function detectInconsistencies(answers, questions) {
  const inconsistencies = []
  const byArea = {}
  for (const q of questions) {
    const raw = answers[q.id]
    if (raw == null) continue
    const adjusted = q.inverted ? (6 - raw) : raw
    if (!byArea[q.area]) byArea[q.area] = []
    byArea[q.area].push({ id: q.id, text: q.text, raw, adjusted, inverted: q.inverted })
  }
  for (const [area, items] of Object.entries(byArea)) {
    if (items.length < 2) continue
    for (let i = 0; i < items.length; i++) {
      for (let j = i + 1; j < items.length; j++) {
        const diff = Math.abs(items[i].adjusted - items[j].adjusted)
        if (diff >= 3) {
          const areaLabel = AREAS.find(a => a.key === area)?.label || area
          inconsistencies.push({
            area: areaLabel,
            q1: items[i].text,
            q1_answer: items[i].raw,
            q2: items[j].text,
            q2_answer: items[j].raw,
            significance: diff >= 4 ? 'alta' : 'moderada'
          })
        }
      }
    }
  }
  return inconsistencies
}

function getLevel(score) {
  if (score <= 1.5) return { label: 'Muy bajo', color: 'text-red-400' }
  if (score <= 2.5) return { label: 'Bajo', color: 'text-orange-400' }
  if (score <= 3.5) return { label: 'Medio', color: 'text-yellow-400' }
  if (score <= 4.2) return { label: 'Alto', color: 'text-emerald-400' }
  return { label: 'Muy alto', color: 'text-cyan-400' }
}

function getPercent(score) {
  return Math.round(((score - 1) / 4) * 100)
}

function getOverallResult(areaScores) {
  // Promedio ponderado: áreas más críticas pesan más
  let weightedSum = 0
  let totalWeight = 0
  for (const [key, score] of Object.entries(areaScores)) {
    const w = AREA_WEIGHTS[key] || 1.0
    weightedSum += score * w
    totalWeight += w
  }
  const avg = totalWeight > 0 ? weightedSum / totalWeight : 0
  if (avg >= 3.8) return {
    key: 'solida', title: 'Relación Sólida', emoji: '🟢',
    color: 'from-emerald-500 to-green-500', textColor: 'text-emerald-400',
    description: 'Existe una base emocional estable, aunque siempre hay aspectos que pueden fortalecerse.',
    detail: 'Tu relación muestra indicadores saludables en la mayoría de las áreas evaluadas. Esto no significa que no existan desafíos, sino que cuentan con recursos emocionales sólidos para enfrentarlos.'
  }
  if (avg >= 3.0) return {
    key: 'desgaste', title: 'Relación en Desgaste', emoji: '🟠',
    color: 'from-amber-500 to-orange-500', textColor: 'text-amber-400',
    description: 'El vínculo existe, pero algunos patrones están debilitando la conexión.',
    detail: 'La relación conserva elementos positivos importantes, pero hay áreas donde el desgaste está afectando la calidad del vínculo. Identificar estos patrones a tiempo puede prevenir un deterioro mayor.'
  }
  if (avg >= 2.2) return {
    key: 'riesgo', title: 'Relación en Riesgo', emoji: '🔴',
    color: 'from-red-500 to-rose-500', textColor: 'text-red-400',
    description: 'Los conflictos acumulados están afectando seriamente la relación.',
    detail: 'Varios indicadores muestran que la relación está atravesando una etapa difícil. Los patrones actuales, si no se abordan, tienden a profundizarse con el tiempo. La buena noticia es que identificarlos es el primer paso para transformarlos.'
  }
  return {
    key: 'critica', title: 'Relación Crítica', emoji: '⚫',
    color: 'from-gray-500 to-zinc-500', textColor: 'text-gray-400',
    description: 'Los patrones actuales pueden llevar a ruptura si no se intervienen.',
    detail: 'La relación muestra señales importantes de agotamiento en múltiples áreas. Esto no significa que no tenga solución, pero sí indica que se necesita intervención profesional para poder reconstruir el vínculo desde bases más sólidas.'
  }
}

function generateInterpretation(areaScores) {
  const sorted = Object.entries(areaScores).sort((a, b) => b[1] - a[1])
  const strongest = sorted[0]
  const weakest = sorted[sorted.length - 1]
  const secondWeakest = sorted[sorted.length - 2]
  const areaLabel = (key) => AREAS.find(a => a.key === key)?.label || key
  const parts = []

  if (strongest[1] >= 3.5) {
    parts.push(`Tu relación muestra una fortaleza notable en ${areaLabel(strongest[0])}, lo cual suele ser un factor protector importante para el vínculo.`)
  }
  if (weakest[1] <= 2.5 && secondWeakest[1] <= 3.0) {
    parts.push(`Sin embargo, los niveles de ${areaLabel(weakest[0])} y ${areaLabel(secondWeakest[0])} sugieren patrones que podrían estar generando un distanciamiento progresivo si no se abordan.`)
  } else if (weakest[1] <= 2.5) {
    parts.push(`El área de ${areaLabel(weakest[0])} muestra indicadores que merecen atención. Este tipo de patrón, cuando no se trabaja, tiende a afectar otras áreas de la relación con el tiempo.`)
  }
  if (areaScores.comunicacion <= 3.0 && areaScores.conflicto <= 3.0) {
    parts.push('La combinación de dificultades en comunicación y conflicto acumulado es uno de los patrones más frecuentes en relaciones que se deterioran silenciosamente.')
  }
  if (areaScores.intimidad <= 2.5 && areaScores.proyecto >= 3.5) {
    parts.push('Es interesante notar que comparten visión de futuro, pero la conexión emocional íntima necesita fortalecerse. Esto a menudo indica que la relación funciona bien en lo práctico pero necesita reconectar en lo emocional.')
  }
  if (areaScores.autonomia <= 2.0) {
    parts.push('Los indicadores de autonomía sugieren un posible patrón de dependencia emocional que vale la pena explorar con mayor profundidad profesional.')
  }
  if (areaScores.idealizacion <= 2.5) {
    parts.push('Los indicadores de idealización sugieren una tendencia significativa a proyectar en la pareja cualidades o expectativas que van más allá de quién es realmente. Este patrón, cuando no se reconoce, genera desilusión crónica y frustración repetitiva.')
  }
  if (areaScores.idealizacion <= 3.0 && areaScores.seguridad <= 3.0) {
    parts.push('La combinación de idealización elevada y seguridad emocional frágil sugiere un patrón donde se busca en el otro aquello que se necesita para sentirse completo. Desde una perspectiva psicoanalítica, esto apunta a una relación con la falta que merece ser explorada.')
  }
  if (parts.length === 0) {
    parts.push('Los resultados revelan un perfil con matices importantes que merecen explorarse en mayor profundidad. Cada relación es única, y comprender sus dinámicas específicas es clave para fortalecerla.')
  }
  return parts.join('\n\n')
}

// ─── RADAR CHART SVG ──────────────────────────────────────────────

function RadarChart({ data, size = 320 }) {
  const cx = size / 2
  const cy = size / 2
  const r = size * 0.32
  const n = data.length
  const step = (2 * Math.PI) / n

  const pt = (i, val) => {
    const a = step * i - Math.PI / 2
    const d = r * (val / 100)
    return [cx + d * Math.cos(a), cy + d * Math.sin(a)]
  }

  const labelPt = (i) => {
    const a = step * i - Math.PI / 2
    const d = r * 1.35
    return [cx + d * Math.cos(a), cy + d * Math.sin(a)]
  }

  const grid = [25, 50, 75, 100]
  const sorted = [...data].sort((a, b) => b.value - a.value)

  return (
    <div className="flex flex-col sm:flex-row items-center gap-6 sm:gap-8">
      <svg viewBox={`0 0 ${size} ${size}`} className="w-full max-w-[320px] flex-shrink-0">
        {grid.map(level => (
          <polygon key={level}
            points={data.map((_, i) => pt(i, level).join(',')).join(' ')}
            fill="none" stroke="rgba(255,255,255,0.06)" strokeWidth="0.5"
          />
        ))}
        {data.map((_, i) => (
          <line key={`ax-${i}`} x1={cx} y1={cy} x2={pt(i, 100)[0]} y2={pt(i, 100)[1]}
            stroke="rgba(255,255,255,0.04)" strokeWidth="0.5" />
        ))}
        <polygon
          points={data.map((d, i) => pt(i, d.value).join(',')).join(' ')}
          fill="rgba(236,72,153,0.12)" stroke="rgba(236,72,153,0.7)" strokeWidth="1.5"
        />
        {data.map((d, i) => (
          <circle key={`pt-${i}`} cx={pt(i, d.value)[0]} cy={pt(i, d.value)[1]} r="3.5"
            fill="rgb(236,72,153)" stroke="rgba(255,255,255,0.6)" strokeWidth="1" />
        ))}
        {data.map((d, i) => {
          const [lx, ly] = labelPt(i)
          return (
            <text key={`lb-${i}`} x={lx} y={ly} textAnchor="middle" dominantBaseline="middle"
              fill="rgba(255,255,255,0.45)" fontSize="8" fontFamily="Outfit, sans-serif" fontWeight="300">
              {d.label}
            </text>
          )
        })}
      </svg>
      <div className="flex-1 w-full sm:w-auto">
        <p className="text-white/25 text-[10px] font-light uppercase tracking-[0.18em] mb-3">Puntuaciones por área</p>
        <div className="space-y-3">
          {sorted.map((d, i) => (
            <div key={i} className="flex items-center gap-3">
              <div className={`w-1.5 h-1.5 rounded-full flex-shrink-0 ${d.value >= 60 ? 'bg-emerald-400/70' : d.value >= 40 ? 'bg-amber-400/70' : 'bg-red-400/60'}`} />
              <span className="text-white/55 text-xs font-light flex-1 leading-none">{d.label}</span>
              <span className={`text-xs font-light tabular-nums ${d.value >= 60 ? 'text-emerald-400' : d.value >= 40 ? 'text-amber-400' : 'text-red-400/80'}`}>{d.value}%</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

// ─── GENERACIÓN DE PDF ────────────────────────────────────────────

function generatePDF(result, areaScores, interpretation, openQuestion, isPremium, aiAnalysis) {
  const doc = new jsPDF()
  const pw = doc.internal.pageSize.getWidth()
  const m = 20
  const modeLabel = isPremium ? 'Diagnóstico Premium' : 'Diagnóstico Gratuito'

  doc.setFillColor(10, 10, 15)
  doc.rect(0, 0, pw, 50, 'F')
  doc.setTextColor(255, 255, 255)
  doc.setFontSize(22)
  doc.text('Informe de Diagnóstico de Relación', pw / 2, 18, { align: 'center' })
  doc.setFontSize(11)
  doc.setTextColor(220, 180, 220)
  doc.text(modeLabel, pw / 2, 28, { align: 'center' })
  doc.setFontSize(10)
  doc.setTextColor(180, 180, 180)
  doc.text('Luis Virrueta — Psicólogo y Psicoanalista', pw / 2, 36, { align: 'center' })
  doc.text(new Date().toLocaleDateString('es-MX', { year: 'numeric', month: 'long', day: 'numeric' }), pw / 2, 43, { align: 'center' })

  let y = 58

  doc.setTextColor(40, 40, 40)
  doc.setFontSize(16)
  doc.text(`Resultado: ${result.title}`, m, y)
  y += 8
  doc.setFontSize(10)
  doc.setTextColor(80, 80, 80)
  const descL = doc.splitTextToSize(result.description, pw - m * 2)
  doc.text(descL, m, y); y += descL.length * 5 + 4
  const detL = doc.splitTextToSize(result.detail, pw - m * 2)
  doc.text(detL, m, y); y += detL.length * 5 + 10

  doc.setFontSize(13)
  doc.setTextColor(40, 40, 40)
  doc.text('Perfil por Áreas', m, y); y += 8

  for (const area of AREAS) {
    const score = areaScores[area.key]
    const pct = getPercent(score)
    const level = getLevel(score)
    doc.setFontSize(9)
    doc.setTextColor(60, 60, 60)
    doc.text(`${area.label}: ${pct}% — ${level.label}`, m, y); y += 4
    doc.setFillColor(230, 230, 230)
    doc.roundedRect(m, y, pw - m * 2, 3.5, 1.5, 1.5, 'F')
    const bc = pct >= 70 ? [52, 211, 153] : pct >= 40 ? [251, 191, 36] : [248, 113, 113]
    doc.setFillColor(...bc)
    doc.roundedRect(m, y, Math.max(2, ((pw - m * 2) * pct) / 100), 3.5, 1.5, 1.5, 'F')
    y += 8
    if (y > 265) { doc.addPage(); y = 20 }
  }

  y += 5
  if (y > 220) { doc.addPage(); y = 20 }
  doc.setFontSize(13)
  doc.setTextColor(40, 40, 40)
  doc.text('Interpretación', m, y); y += 7
  doc.setFontSize(9)
  doc.setTextColor(80, 80, 80)
  const intL = doc.splitTextToSize(interpretation, pw - m * 2)
  doc.text(intL, m, y); y += intL.length * 4.5 + 8

  // Premium: AI analysis
  if (isPremium && aiAnalysis) {
    if (y > 180) { doc.addPage(); y = 20 }
    doc.setFontSize(13)
    doc.setTextColor(40, 40, 40)
    doc.text('Análisis Psicoanalítico Profundo', m, y); y += 8

    const sections = [
      { title: '— Análisis Narrativo (Fuente Primaria) —', text: aiAnalysis.lecturaNarrativa },
      { title: '— Perfil Cuantitativo (Fuente Confirmatoria) —', text: aiAnalysis.lecturaCuestionario },
      { title: '— Lectura Integral (Cruce) —', text: aiAnalysis.lecturaIntegral },
      { title: 'Insight Principal', text: aiAnalysis.keyInsight },
      { title: 'Reflexión Existencial', text: aiAnalysis.existentialReflection }
    ]

    for (const sec of sections) {
      if (!sec.text) continue
      if (y > 240) { doc.addPage(); y = 20 }
      doc.setFontSize(10)
      doc.setTextColor(60, 60, 60)
      doc.text(sec.title, m, y); y += 5
      doc.setFontSize(9)
      doc.setTextColor(80, 80, 80)
      const lines = doc.splitTextToSize(sec.text.replace(/\n/g, ' '), pw - m * 2)
      doc.text(lines, m, y); y += lines.length * 4.5 + 6
    }

    if (aiAnalysis.unconsciousPatterns?.length > 0) {
      if (y > 240) { doc.addPage(); y = 20 }
      doc.setFontSize(10)
      doc.setTextColor(60, 60, 60)
      doc.text('Patrones Inconscientes Detectados:', m, y); y += 5
      doc.setFontSize(9)
      doc.setTextColor(80, 80, 80)
      for (const p of aiAnalysis.unconsciousPatterns) {
        doc.text(`• ${p}`, m + 3, y); y += 4.5
        if (y > 270) { doc.addPage(); y = 20 }
      }
      y += 4
    }

    if (aiAnalysis.defenseMechanisms?.length > 0) {
      if (y > 240) { doc.addPage(); y = 20 }
      doc.setFontSize(10)
      doc.setTextColor(60, 60, 60)
      doc.text('Mecanismos de Defensa Detectados:', m, y); y += 5
      doc.setFontSize(9)
      doc.setTextColor(80, 80, 80)
      for (const d of aiAnalysis.defenseMechanisms) {
        const dl = doc.splitTextToSize(`• ${d}`, pw - m * 2 - 3)
        doc.text(dl, m + 3, y); y += dl.length * 4.5
        if (y > 270) { doc.addPage(); y = 20 }
      }
      y += 4
    }

    if (aiAnalysis.riskAreas?.length > 0) {
      if (y > 240) { doc.addPage(); y = 20 }
      doc.setFontSize(10)
      doc.setTextColor(60, 60, 60)
      doc.text('Áreas de Riesgo:', m, y); y += 5
      doc.setFontSize(9)
      doc.setTextColor(80, 80, 80)
      for (const r of aiAnalysis.riskAreas) {
        const rl = doc.splitTextToSize(`⚠ ${r}`, pw - m * 2 - 3)
        doc.text(rl, m + 3, y); y += rl.length * 4.5
        if (y > 270) { doc.addPage(); y = 20 }
      }
      y += 4
    }
  }

  // Open question
  if (openQuestion?.trim()) {
    if (y > 240) { doc.addPage(); y = 20 }
    doc.setFontSize(10)
    doc.setTextColor(40, 40, 40)
    doc.text('Lo que más desearían mejorar:', m, y); y += 6
    doc.setFontSize(9)
    doc.setTextColor(80, 80, 80)
    const oL = doc.splitTextToSize(`"${openQuestion.trim()}"`, pw - m * 2)
    doc.text(oL, m, y); y += oL.length * 4.5 + 8
  }

  // Recommendations
  if (y > 220) { doc.addPage(); y = 20 }
  doc.setFontSize(13)
  doc.setTextColor(40, 40, 40)
  doc.text('Recomendaciones Iniciales', m, y); y += 7
  doc.setFontSize(9)
  doc.setTextColor(80, 80, 80)
  const recs = [
    '1. Dediquen tiempo semanal exclusivo para hablar sin distracciones.',
    '2. Identifiquen los temas que evitan y comprométanse a abordarlos gradualmente.',
    '3. Practiquen la escucha activa: antes de responder, repitan lo que escucharon.',
    '4. Reconozcan verbalmente al menos una cosa positiva del otro cada día.',
    '5. Consideren una sesión profesional para profundizar en los patrones detectados.'
  ]
  for (const rec of recs) {
    const rl = doc.splitTextToSize(rec, pw - m * 2)
    doc.text(rl, m, y); y += rl.length * 4.5 + 2
  }

  // Footer CTA
  if (y > 250) { doc.addPage(); y = 20 }
  y += 8
  doc.setFillColor(245, 245, 245)
  doc.roundedRect(m, y, pw - m * 2, 28, 3, 3, 'F')
  doc.setFontSize(10)
  doc.setTextColor(60, 60, 60)
  doc.text('¿Te gustaría profundizar en estos resultados?', pw / 2, y + 9, { align: 'center' })
  doc.setFontSize(9)
  doc.text('Agenda una sesión de diagnóstico de pareja con Luis Virrueta.', pw / 2, y + 16, { align: 'center' })
  doc.text('luisvirrueta.com  ·  wa.me/527228720520', pw / 2, y + 23, { align: 'center' })

  return doc
}

// ─── COMPONENTE PRINCIPAL ─────────────────────────────────────────

const ConsultaParejaPage = () => {
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()

  // Stages: hero | mode-select | checkout | instructions | respondent | philosophical | test | open-question | email | analyzing | results | info
  // Premium flow: hero → mode-select → checkout → instructions → respondent → philosophical (15 open) → test (25 Likert) → email → analyzing → results
  // Free flow: hero → mode-select → respondent → test (23 Likert) → open-question → email → results
  const [stage, setStage] = useState('hero')
  const [mode, setMode] = useState(null) // 'free' | 'premium'
  const [isPremiumUnlocked, setIsPremiumUnlocked] = useState(false)
  const [respondent, setRespondent] = useState(null)
  const [currentQuestion, setCurrentQuestion] = useState(0)
  const [answers, setAnswers] = useState({})
  const [email, setEmail] = useState('')
  const [emailSubmitted, setEmailSubmitted] = useState(false)
  const [openQuestion, setOpenQuestion] = useState('')
  const [pdfGenerating, setPdfGenerating] = useState(false)

  // Discount
  const [discountCode, setDiscountCode] = useState('')
  const [appliedDiscount, setAppliedDiscount] = useState(null)
  const [discountError, setDiscountError] = useState('')

  // Philosophical answers (premium)
  const [currentPhilosophical, setCurrentPhilosophical] = useState(0)
  const [philosophicalAnswers, setPhilosophicalAnswers] = useState({})

  // AI analysis (premium)
  const [aiAnalysis, setAiAnalysis] = useState(null)
  const [aiLoading, setAiLoading] = useState(false)

  const topRef = useRef(null)

  // Voice UI state for philosophical questions
  const [philUIMode, setPhilUIMode] = useState('voice')
  const [philInterim, setPhilInterim] = useState('')
  const [philRecording, setPhilRecording] = useState(false)
  const philRecognitionRef = useRef(null)
  const [resumeDraft, setResumeDraft] = useState(null)

  const scrollToTop = useCallback(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }, [])

  // Check for Stripe callback (future)
  useEffect(() => {
    if (searchParams.get('premium') === 'success') {
      setIsPremiumUnlocked(true)
      setMode('premium')
      setStage('instructions')
    }
  }, [searchParams])

  // Restore premium from sessionStorage
  useEffect(() => {
    if (sessionStorage.getItem('diagnostico_premium') === 'true') {
      setIsPremiumUnlocked(true)
    }
  }, [])

  // Reset voice state when philosophical question changes
  useEffect(() => {
    setPhilInterim('')
    if (philRecording) {
      philRecognitionRef.current?.stop()
      setPhilRecording(false)
    }
  }, [currentPhilosophical]) // eslint-disable-line react-hooks/exhaustive-deps

  // localStorage auto-save (saves on every meaningful state change)
  useEffect(() => {
    if (stage === 'hero' || stage === 'results' || stage === 'analyzing') return
    try {
      localStorage.setItem('diagnostico_pareja_draft', JSON.stringify({
        stage, mode, answers, philosophicalAnswers, currentQuestion, currentPhilosophical, savedAt: Date.now()
      }))
    } catch {}
  }, [stage, mode, answers, philosophicalAnswers, currentQuestion, currentPhilosophical])

  // Clear draft on completion
  useEffect(() => {
    if (stage === 'results') {
      try { localStorage.removeItem('diagnostico_pareja_draft') } catch {}
    }
  }, [stage])

  // Load draft on mount
  useEffect(() => {
    try {
      const raw = localStorage.getItem('diagnostico_pareja_draft')
      if (!raw) return
      const draft = JSON.parse(raw)
      if (!draft.savedAt || Date.now() - draft.savedAt > 24 * 60 * 60 * 1000) return
      if (!draft.stage || draft.stage === 'hero' || draft.stage === 'results') return
      setResumeDraft(draft)
    } catch {}
  }, [])

  // Active questions based on mode
  const questions = mode === 'premium' ? QUESTIONS_DETAILED : QUESTIONS_QUICK

  // Calculations
  const areaScores = useMemo(() => calculateScores(answers, questions), [answers, questions])
  const result = useMemo(() => getOverallResult(areaScores), [areaScores])
  const interpretation = useMemo(() => generateInterpretation(areaScores), [areaScores])
  const progress = Math.round((Object.keys(answers).length / questions.length) * 100)

  // Discount logic
  const applyDiscount = () => {
    const code = discountCode.trim().toUpperCase()
    const found = DISCOUNT_CODES[code]
    if (found) {
      setAppliedDiscount({ code, ...found })
      setDiscountError('')
    } else {
      setAppliedDiscount(null)
      setDiscountError('Código no válido')
    }
  }

  const finalPrice = appliedDiscount
    ? Math.round(PREMIUM_PRICE * (1 - appliedDiscount.discount))
    : PREMIUM_PRICE

  const handleCheckoutComplete = () => {
    setIsPremiumUnlocked(true)
    sessionStorage.setItem('diagnostico_premium', 'true')
    setStage('instructions')
    scrollToTop()
  }

  const handleAnswer = (value) => {
    const q = questions[currentQuestion]
    setAnswers(prev => ({ ...prev, [q.id]: value }))
    if (currentQuestion < questions.length - 1) {
      setTimeout(() => setCurrentQuestion(prev => prev + 1), 300)
    } else {
      setTimeout(() => {
        if (mode === 'premium') {
          // Premium: open Qs already done → go to email/analyzing
          setStage('email')
        } else {
          setStage('open-question')
        }
        scrollToTop()
      }, 400)
    }
  }

  const handleRunAIAnalysis = async () => {
    setAiLoading(true)
    setStage('analyzing')
    scrollToTop()
    try {
      const areaLabels = {}
      for (const a of AREAS) areaLabels[a.key] = a.label
      const inconsistencies = detectInconsistencies(answers, questions)
      const result = await analyzeRelationship({
        areaScores,
        areaLabels,
        philosophicalAnswers,
        philosophicalQuestions: PHILOSOPHICAL_QUESTIONS,
        inconsistencies
      })
      setAiAnalysis(result)
    } catch (e) {
      console.error('AI analysis error:', e)
    }
    setAiLoading(false)
    setStage('results')
    scrollToTop()
  }

  const togglePhilMic = useCallback(() => {
    if (philRecording) {
      philRecognitionRef.current?.stop()
      setPhilRecording(false)
      setPhilInterim('')
      return
    }
    const SR = window.SpeechRecognition || window.webkitSpeechRecognition
    if (!SR) { setPhilUIMode('text'); return }
    const recognition = new SR()
    recognition.lang = 'es-MX'
    recognition.continuous = true
    recognition.interimResults = true
    recognition.onresult = (e) => {
      let interim = ''
      for (let i = e.resultIndex; i < e.results.length; i++) {
        if (e.results[i].isFinal) {
          const finalText = e.results[i][0].transcript
          setPhilosophicalAnswers(prev => ({
            ...prev,
            [currentPhilosophical]: (prev[currentPhilosophical] ? prev[currentPhilosophical] + ' ' : '') + finalText
          }))
          setPhilInterim('')
        } else {
          interim += e.results[i][0].transcript
        }
      }
      if (interim) setPhilInterim(interim)
    }
    recognition.onerror = () => { setPhilRecording(false); setPhilInterim('') }
    recognition.onend = () => { setPhilRecording(false); setPhilInterim('') }
    philRecognitionRef.current = recognition
    recognition.start()
    setPhilRecording(true)
  }, [philRecording, currentPhilosophical])

  const handleDownloadPDF = async () => {
    setPdfGenerating(true)
    try {
      const doc = generatePDF(result, areaScores, interpretation, openQuestion, isPremiumUnlocked, aiAnalysis)
      doc.save('Diagnostico-Relacion-LuisVirrueta.pdf')
    } finally {
      setPdfGenerating(false)
    }
  }

  const whatsappMessage = encodeURIComponent('Hola, acabo de realizar el diagnóstico de relación en tu página y me gustaría recibir más información sobre la consulta de pareja.')
  const whatsappAgendarMessage = encodeURIComponent('Hola, me gustaría agendar una sesión de diagnóstico de pareja.')
  const whatsappIndividualMessage = encodeURIComponent('Hola, me gustaría agendar una sesión individual de diagnóstico de relación.')
  const whatsappParejaMessage = encodeURIComponent('Hola, me gustaría agendar una sesión de diagnóstico de pareja para los dos.')

  // Areas for display (free hides idealización)
  const displayAreas = mode === 'premium' ? AREAS : AREAS.filter(a => a.key !== 'idealizacion')

  // ─── RENDER ────────────────────────────────────────────────────

  return (
    <div ref={topRef} className="min-h-screen bg-[#0a0a0f]">
      <SEOHead
        title="Diagnóstico de Relación — Consulta de Pareja | Luis Virrueta"
        description="Descubre el estado real de tu relación con un diagnóstico psicológico profesional. Versión gratuita y premium con análisis psicoanalítico profundo."
        url="/servicios/consulta-pareja"
        type="website"
        tags={['consulta de pareja', 'diagnóstico de relación', 'terapia de pareja', 'psicólogo', 'psicoanalista']}
      />

      <AnimatePresence mode="wait">

        {/* ═══════════════════════════════════════════════════════════
            STAGE: HERO
        ═══════════════════════════════════════════════════════════ */}
        {stage === 'hero' && (
          <motion.div key="hero" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="relative min-h-screen flex flex-col">
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
              <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-pink-600/8 rounded-full blur-3xl" />
              <div className="absolute bottom-1/3 right-1/4 w-80 h-80 bg-rose-600/6 rounded-full blur-3xl" />
              <div className="absolute top-1/2 right-1/3 w-64 h-64 bg-violet-600/5 rounded-full blur-3xl" />
            </div>

            <div className="relative z-10 flex-1 flex flex-col items-center justify-center px-6 pt-28 lg:pt-36 pb-20">
              <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 1 }} className="text-center max-w-3xl mx-auto">
                <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.6, delay: 0.2 }}
                  className="inline-flex items-center gap-2 px-4 py-2 border border-pink-500/20 rounded-full bg-pink-500/5 backdrop-blur-sm mb-10">
                  <Heart className="w-3.5 h-3.5 text-pink-400/70" strokeWidth={1.5} />
                  <span className="text-xs text-pink-300/70 font-light uppercase tracking-[0.2em]">Consulta de Pareja</span>
                </motion.div>

                <h1 className="text-5xl sm:text-6xl lg:text-7xl font-light text-white mb-6 font-display tracking-wide leading-[1.1]">
                  Diagnóstico de{' '}
                  <span className="italic font-normal bg-gradient-to-r from-pink-400 via-rose-400 to-pink-300 bg-clip-text text-transparent">Relación</span>
                </h1>

                <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.4 }}
                  className="text-lg lg:text-xl text-white/60 font-light leading-relaxed mb-10 tracking-wide">
                  Descubre el estado real de tu relación con un diagnóstico psicológico profesional.
                </motion.p>

                <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.6 }} className="space-y-4 mb-12">
                  <p className="text-base lg:text-lg text-white/50 font-extralight leading-relaxed">
                    Muchas relaciones no se rompen por falta de amor.
                  </p>
                  <p className="text-base lg:text-lg text-white/50 font-extralight leading-relaxed">
                    Se rompen por <span className="text-white/70 italic">patrones invisibles</span> que nadie les enseñó a detectar.
                  </p>
                  <p className="text-base lg:text-lg text-white/40 font-extralight leading-relaxed mt-6">
                    Este diagnóstico analiza áreas psicológicas clave — incluyendo idealización, necesidad y deseo — para entender la dinámica real de tu relación.
                  </p>
                </motion.div>

                <motion.button initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.8 }}
                  whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}
                  onClick={() => { setStage('mode-select'); scrollToTop() }}
                  className="group relative px-10 py-4 bg-gradient-to-r from-pink-500 to-rose-500 rounded-full text-white font-light text-sm uppercase tracking-[0.2em] overflow-hidden transition-shadow duration-300 hover:shadow-[0_0_40px_rgba(244,63,94,0.3)]">
                  <span className="relative z-10 flex items-center gap-3">
                    COMENZAR DIAGNÓSTICO <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
                  </span>
                  <div className="absolute inset-0 bg-gradient-to-r from-rose-600 to-pink-600 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                </motion.button>

                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 1 }}
                  className="flex items-center justify-center gap-6 mt-8 text-white/30 text-xs tracking-wider">
                  <span className="flex items-center gap-1.5"><Zap className="w-3.5 h-3.5" /> Gratuito + Premium</span>
                  <span className="w-px h-3 bg-white/20" />
                  <span className="flex items-center gap-1.5"><Brain className="w-3.5 h-3.5" /> Análisis profundo</span>
                  <span className="w-px h-3 bg-white/20" />
                  <span className="flex items-center gap-1.5"><BarChart3 className="w-3.5 h-3.5" /> Gráficas profesionales</span>
                </motion.div>

                {resumeDraft && (
                  <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 1.3 }}
                    className="mt-8 flex items-center justify-center gap-3">
                    <button
                      onClick={() => {
                        setStage(resumeDraft.stage)
                        setMode(resumeDraft.mode)
                        setAnswers(resumeDraft.answers || {})
                        setPhilosophicalAnswers(resumeDraft.philosophicalAnswers || {})
                        setCurrentQuestion(resumeDraft.currentQuestion || 0)
                        setCurrentPhilosophical(resumeDraft.currentPhilosophical || 0)
                        if (resumeDraft.mode === 'premium') setIsPremiumUnlocked(true)
                        setResumeDraft(null)
                      }}
                      className="flex items-center gap-2 px-4 py-2 rounded-full border border-violet-500/25 bg-violet-500/[0.06] text-violet-300/70 text-xs font-light hover:border-violet-400/40 hover:text-violet-300 transition-all">
                      <ArrowRight className="w-3 h-3" /> Continuar diagnóstico anterior
                    </button>
                    <button onClick={() => { try { localStorage.removeItem('diagnostico_pareja_draft') } catch {} setResumeDraft(null) }}
                      className="text-white/20 text-xs hover:text-white/40 transition-colors">
                      Descartar
                    </button>
                  </motion.div>
                )}
              </motion.div>
            </div>

            {/* Qué analiza */}
            <div className="relative z-10 px-6 lg:px-20 pb-32">
              <div className="max-w-5xl mx-auto">
                <motion.div initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.8 }} className="text-center mb-16">
                  <h2 className="text-3xl lg:text-4xl font-light text-white mb-4 font-display tracking-wide">
                    Qué analiza el <span className="italic font-normal">diagnóstico</span>
                  </h2>
                  <p className="text-white/40 text-sm font-extralight tracking-wide">8 áreas psicológicas fundamentales de tu relación</p>
                </motion.div>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
                  {AREAS.map((area, i) => (
                    <motion.div key={area.key} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
                      transition={{ duration: 0.5, delay: i * 0.07 }}
                      className="group relative p-6 border border-white/8 rounded-2xl bg-white/[0.02] backdrop-blur-sm hover:border-white/15 transition-all duration-500">
                      <div className={`inline-flex p-2.5 rounded-xl bg-gradient-to-br ${area.color} bg-opacity-10 mb-4`}>
                        <area.icon className="w-5 h-5 text-white/80" strokeWidth={1.5} />
                      </div>
                      <h3 className="text-white/90 text-sm font-light tracking-wide mb-2">{area.label}</h3>
                      <p className="text-white/40 text-xs font-extralight leading-relaxed">{area.desc}</p>
                      <div className={`absolute inset-0 rounded-2xl bg-gradient-to-br ${area.color} opacity-0 group-hover:opacity-[0.03] transition-opacity duration-500`} />
                    </motion.div>
                  ))}
                </div>
              </div>
            </div>
          </motion.div>
        )}

        {/* ═══════════════════════════════════════════════════════════
            STAGE: MODE SELECT (Gratuito vs Premium)
        ═══════════════════════════════════════════════════════════ */}
        {stage === 'mode-select' && (
          <motion.div key="mode-select" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }}
            className="min-h-screen flex items-center justify-center px-6 pt-28 pb-20">
            <div className="max-w-2xl w-full">
              <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 0.2 }} className="text-center mb-12">
                <div className="inline-flex items-center gap-2 px-4 py-2 border border-pink-500/20 rounded-full bg-pink-500/5 mb-8">
                  <Layers className="w-3.5 h-3.5 text-pink-400/70" strokeWidth={1.5} />
                  <span className="text-xs text-pink-300/70 font-light uppercase tracking-[0.2em]">Elige tu experiencia</span>
                </div>
                <h2 className="text-3xl lg:text-4xl font-light text-white mb-4 font-display tracking-wide">
                  ¿Qué nivel de <span className="italic font-normal text-pink-300/90">profundidad</span> buscas?
                </h2>
                <p className="text-white/40 text-sm font-extralight leading-relaxed max-w-md mx-auto">
                  El diagnóstico gratuito te da una radiografía clara. El premium te revela los patrones invisibles con análisis psicoanalítico.
                </p>
              </motion.div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                {/* Gratuito */}
                <motion.button initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}
                  whileHover={{ scale: 1.02, y: -4 }} whileTap={{ scale: 0.98 }}
                  onClick={() => { setMode('free'); setStage('respondent'); scrollToTop() }}
                  className="group relative p-8 border border-white/10 rounded-2xl bg-white/[0.02] hover:border-pink-500/30 hover:bg-pink-500/[0.03] transition-all duration-500 text-left overflow-hidden">
                  <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-pink-500/5 to-transparent rounded-bl-full" />
                  <div className="relative z-10">
                    <div className="inline-flex p-3 rounded-xl bg-gradient-to-br from-pink-400/10 to-rose-400/10 border border-pink-500/10 mb-5">
                      <Zap className="w-5 h-5 text-pink-400/80" strokeWidth={1.5} />
                    </div>
                    <h3 className="text-xl text-white/90 font-light tracking-wide mb-2 font-display">
                      Diagnóstico <span className="italic">Gratuito</span>
                    </h3>
                    <div className="flex items-center gap-3 mb-4">
                      <span className="flex items-center gap-1.5 text-white/40 text-xs"><Clock className="w-3 h-3" /> ~3 min</span>
                      <span className="w-px h-3 bg-white/10" />
                      <span className="flex items-center gap-1.5 text-white/40 text-xs"><FileText className="w-3 h-3" /> 23 preguntas</span>
                    </div>
                    <ul className="space-y-2 mb-5 text-white/35 text-xs font-extralight">
                      <li className="flex items-start gap-2"><Check className="w-3 h-3 text-pink-400/50 mt-0.5 flex-shrink-0" /> Resultado general de tu relación</li>
                      <li className="flex items-start gap-2"><Check className="w-3 h-3 text-pink-400/50 mt-0.5 flex-shrink-0" /> Perfil visual de 7 áreas</li>
                      <li className="flex items-start gap-2 opacity-40"><Lock className="w-3 h-3 mt-0.5 flex-shrink-0" /> Interpretación psicológica (bloqueada)</li>
                      <li className="flex items-start gap-2 opacity-40"><Lock className="w-3 h-3 mt-0.5 flex-shrink-0" /> Análisis de idealización (bloqueado)</li>
                    </ul>
                    <div className="flex items-center gap-2 text-pink-400/60 text-xs font-light group-hover:text-pink-400/90 transition-colors">
                      <span className="uppercase tracking-[0.15em]">Comenzar gratis</span>
                      <ArrowRight className="w-3.5 h-3.5 transition-transform group-hover:translate-x-1" />
                    </div>
                  </div>
                </motion.button>

                {/* Premium */}
                <motion.button initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }}
                  whileHover={{ scale: 1.02, y: -4 }} whileTap={{ scale: 0.98 }}
                  onClick={() => { setMode('premium'); setStage('checkout'); scrollToTop() }}
                  className="group relative p-8 pb-6 border border-violet-500/20 rounded-2xl bg-gradient-to-br from-violet-500/[0.03] to-pink-500/[0.02] hover:border-violet-400/40 transition-all duration-500 text-left overflow-hidden">
                  <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-violet-500/8 to-transparent rounded-bl-full" />
                  <div className="absolute top-4 right-4">
                    <span className="inline-flex items-center gap-1 px-2.5 py-1 bg-gradient-to-r from-violet-500/20 to-pink-500/20 border border-violet-400/20 rounded-full text-[10px] text-violet-300/80 font-light uppercase tracking-[0.15em]">
                      <Sparkles className="w-2.5 h-2.5" /> Premium
                    </span>
                  </div>
                  <div className="relative z-10">
                    <div className="inline-flex p-3 rounded-xl bg-gradient-to-br from-violet-400/10 to-purple-400/10 border border-violet-500/10 mb-5">
                      <Brain className="w-5 h-5 text-violet-400/80" strokeWidth={1.5} />
                    </div>
                    <h3 className="text-xl text-white/90 font-light tracking-wide mb-3 font-display">
                      Diagnóstico <span className="italic">Premium</span>
                    </h3>
                    <div className="flex items-center gap-3 mb-5">
                      <span className="flex items-center gap-1.5 text-white/40 text-xs"><Clock className="w-3 h-3" /> ~18 min</span>
                      <span className="w-px h-3 bg-white/10" />
                      <span className="text-violet-300/70 text-xs font-light">${PREMIUM_PRICE} MXN</span>
                    </div>
                    <ul className="space-y-2.5 mb-6 text-white/40 text-xs font-extralight">
                      <li className="flex items-start gap-2"><Check className="w-3 h-3 text-violet-400/50 mt-0.5 flex-shrink-0" /> 15 preguntas abiertas + 25 confirmatorias</li>
                      <li className="flex items-start gap-2"><Check className="w-3 h-3 text-violet-400/50 mt-0.5 flex-shrink-0" /> Gráfica radar de 8 dimensiones</li>
                      <li className="flex items-start gap-2"><Check className="w-3 h-3 text-violet-400/50 mt-0.5 flex-shrink-0" /> Correlación narrativa ↔ datos cuantitativos</li>
                      <li className="flex items-start gap-2"><Check className="w-3 h-3 text-violet-400/50 mt-0.5 flex-shrink-0" /> Patrones inconscientes y mecanismos de defensa</li>
                      <li className="flex items-start gap-2"><Check className="w-3 h-3 text-violet-400/50 mt-0.5 flex-shrink-0" /> Informe PDF profesional</li>
                    </ul>
                    <div className="flex items-center gap-2 text-violet-400/60 text-xs font-light group-hover:text-violet-400/90 transition-colors">
                      <span className="uppercase tracking-[0.15em]">Acceder</span>
                      <ArrowRight className="w-3.5 h-3.5 transition-transform group-hover:translate-x-1" />
                    </div>
                  </div>
                </motion.button>
              </div>
            </div>
          </motion.div>
        )}

        {/* ═══════════════════════════════════════════════════════════
            STAGE: CHECKOUT (Premium)
        ═══════════════════════════════════════════════════════════ */}
        {stage === 'checkout' && (
          <motion.div key="checkout" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
            className="min-h-screen flex items-center justify-center px-6 pt-28 pb-20">
            <div className="max-w-md w-full">
              <button onClick={() => { setStage('mode-select'); scrollToTop() }}
                className="flex items-center gap-2 text-white/30 hover:text-white/60 text-xs tracking-wider mb-8 transition-colors">
                <ArrowLeft className="w-3.5 h-3.5" /> CAMBIAR MODALIDAD
              </button>

              <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 0.1 }}
                className="p-8 border border-violet-500/20 rounded-2xl bg-gradient-to-br from-violet-500/[0.03] to-pink-500/[0.02]">

                <div className="flex items-center gap-3 mb-6">
                  <div className="p-2.5 rounded-xl bg-gradient-to-br from-violet-400/10 to-purple-400/10 border border-violet-500/10">
                    <Sparkles className="w-5 h-5 text-violet-400/80" strokeWidth={1.5} />
                  </div>
                  <div>
                    <h3 className="text-lg text-white/90 font-light tracking-wide font-display">Diagnóstico Premium</h3>
                    <p className="text-white/30 text-xs font-extralight">Análisis psicoanalítico profundo</p>
                  </div>
                </div>

                {/* Price */}
                <div className="flex items-baseline gap-3 mb-6">
                  {appliedDiscount ? (
                    <>
                      <span className="text-3xl text-white/90 font-light">${finalPrice} <span className="text-sm text-white/40">MXN</span></span>
                      <span className="text-lg text-white/30 line-through">${PREMIUM_PRICE}</span>
                      <span className="text-xs text-emerald-400/80 font-light px-2 py-0.5 bg-emerald-500/10 rounded-full">{appliedDiscount.label}</span>
                    </>
                  ) : (
                    <span className="text-3xl text-white/90 font-light">${PREMIUM_PRICE} <span className="text-sm text-white/40">MXN</span></span>
                  )}
                </div>

                {/* Features list */}
                <div className="space-y-2.5 mb-8">
                  {['Cuestionario psicológico profundo (61 preguntas)', 'Perfil de patrones inconscientes', 'Lectura psicoanalítica del cuestionario', 'Lectura integral: cruce de datos + reflexiones', 'Gráfica radar profesional de 8 dimensiones', 'Informe PDF profesional descargable'].map((feat, i) => (
                    <div key={i} className="flex items-start gap-2.5">
                      <Check className="w-3.5 h-3.5 text-violet-400/60 mt-0.5 flex-shrink-0" strokeWidth={2} />
                      <span className="text-white/50 text-xs font-light leading-relaxed">{feat}</span>
                    </div>
                  ))}
                </div>

                {/* Discount code */}
                <div className="mb-6">
                  <label className="text-white/30 text-xs font-light tracking-wider block mb-2">CÓDIGO DE DESCUENTO</label>
                  <div className="flex gap-2">
                    <div className="relative flex-1">
                      <Tag className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-white/20" />
                      <input
                        type="text"
                        value={discountCode}
                        onChange={(e) => { setDiscountCode(e.target.value); setDiscountError('') }}
                        placeholder="Ingresa tu código"
                        className="w-full pl-9 pr-3 py-3 bg-white/[0.03] border border-white/10 rounded-xl text-white/80 text-sm font-light placeholder:text-white/20 focus:border-violet-500/30 focus:outline-none transition-colors"
                      />
                    </div>
                    <button
                      onClick={applyDiscount}
                      disabled={!discountCode.trim()}
                      className="px-4 py-3 border border-violet-500/30 rounded-xl text-violet-300/70 text-xs font-light uppercase tracking-wider hover:bg-violet-500/10 disabled:opacity-30 transition-all">
                      Aplicar
                    </button>
                  </div>
                  {discountError && <p className="text-red-400/70 text-xs mt-2 font-extralight">{discountError}</p>}
                  {appliedDiscount && <p className="text-emerald-400/70 text-xs mt-2 font-extralight flex items-center gap-1"><Check className="w-3 h-3" /> {appliedDiscount.label}</p>}
                </div>

                {/* Pay button */}
                {appliedDiscount?.discount === 1.0 ? (
                  <motion.button whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}
                    onClick={handleCheckoutComplete}
                    className="w-full py-4 bg-gradient-to-r from-emerald-500 to-green-500 rounded-xl text-white font-light text-sm uppercase tracking-[0.15em] hover:shadow-[0_0_30px_rgba(52,211,153,0.25)] transition-shadow">
                    Acceder Gratis
                  </motion.button>
                ) : (
                  <motion.button whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}
                    onClick={handleCheckoutComplete}
                    className="w-full py-4 bg-gradient-to-r from-violet-500 to-pink-500 rounded-xl text-white font-light text-sm uppercase tracking-[0.15em] hover:shadow-[0_0_30px_rgba(139,92,246,0.25)] transition-shadow flex items-center justify-center gap-2">
                    <CreditCard className="w-4 h-4" />
                    {/* TODO: Integrar Stripe Checkout real aquí. Por ahora simula el pago. */}
                    {/* Para Stripe: npm install @stripe/stripe-js, crear checkout session vía Edge Function */}
                    Pagar ${finalPrice} MXN
                  </motion.button>
                )}

                <p className="text-center text-white/15 text-[10px] font-extralight mt-4 tracking-wide">
                  Pago seguro procesado por Stripe. Acceso inmediato tras la confirmación.
                </p>
              </motion.div>
            </div>
          </motion.div>
        )}

        {/* ═══════════════════════════════════════════════════════════
            STAGE: INSTRUCTIONS (Premium — antes de empezar)
        ═══════════════════════════════════════════════════════════ */}
        {stage === 'instructions' && (
          <motion.div key="instructions" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }}
            className="min-h-screen flex items-center justify-center px-6 pt-28">
            <div className="max-w-lg w-full">
              <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 0.2 }}
                className="text-center mb-10">
                <div className="inline-flex items-center gap-2 px-4 py-2 border border-violet-500/15 rounded-full bg-violet-500/5 mb-6">
                  <Brain className="w-3.5 h-3.5 text-violet-400/60" strokeWidth={1.5} />
                  <span className="text-xs text-violet-300/50 font-light uppercase tracking-[0.15em]">Antes de empezar</span>
                </div>
                <h2 className="text-3xl lg:text-4xl font-light text-white mb-4 font-display tracking-wide">
                  Cómo funciona este <span className="italic font-normal">diagnóstico</span>
                </h2>
              </motion.div>

              <div className="space-y-5 mb-10">
                <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.3 }}
                  className="flex items-start gap-4 p-5 border border-white/8 rounded-xl bg-white/[0.02]">
                  <div className="w-8 h-8 rounded-full bg-pink-500/10 border border-pink-500/20 flex items-center justify-center flex-shrink-0 mt-0.5">
                    <span className="text-pink-400/80 text-xs font-light">1</span>
                  </div>
                  <div>
                    <p className="text-white/80 text-sm font-light mb-1">Primero, unas preguntas para platicar</p>
                    <p className="text-white/40 text-xs font-extralight leading-relaxed">
                      Vamos a hacerte 15 preguntas abiertas. Contéstalas como si le platicaras a un amigo cercano — no hay respuestas correctas ni incorrectas. 
                      <span className="text-violet-300/60"> Entre más compartas, más preciso y profundo será tu análisis.</span>
                    </p>
                  </div>
                </motion.div>

                <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.4 }}
                  className="flex items-start gap-4 p-5 border border-white/8 rounded-xl bg-white/[0.02]">
                  <div className="w-8 h-8 rounded-full bg-violet-500/10 border border-violet-500/20 flex items-center justify-center flex-shrink-0 mt-0.5">
                    <span className="text-violet-400/80 text-xs font-light">2</span>
                  </div>
                  <div>
                    <p className="text-white/80 text-sm font-light mb-1">Después, unas afirmaciones rápidas</p>
                    <p className="text-white/40 text-xs font-extralight leading-relaxed">
                      25 frases cortas donde solo eliges qué tan cierto es cada una para ti. Esto nos ayuda a confirmar los patrones que ya nos contaste.
                    </p>
                  </div>
                </motion.div>

                <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.5 }}
                  className="flex items-start gap-4 p-5 border border-white/8 rounded-xl bg-white/[0.02]">
                  <div className="w-8 h-8 rounded-full bg-fuchsia-500/10 border border-fuchsia-500/20 flex items-center justify-center flex-shrink-0 mt-0.5">
                    <span className="text-fuchsia-400/80 text-xs font-light">3</span>
                  </div>
                  <div>
                    <p className="text-white/80 text-sm font-light mb-1">La IA cruza todo y genera tu diagnóstico</p>
                    <p className="text-white/40 text-xs font-extralight leading-relaxed">
                      Tu análisis cruza lo que nos platicaste con los datos cuantitativos para detectar patrones profundos, mecanismos de defensa y fortalezas reales.
                    </p>
                  </div>
                </motion.div>
              </div>

              <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.6 }}
                className="p-4 border border-violet-500/10 rounded-xl bg-violet-500/[0.02] mb-10">
                <div className="flex flex-wrap items-center justify-center gap-6 text-center">
                  <div className="flex items-center gap-2">
                    <Clock className="w-3.5 h-3.5 text-white/30" strokeWidth={1.5} />
                    <span className="text-white/40 text-xs font-light">~18 minutos</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Mic className="w-3.5 h-3.5 text-white/30" strokeWidth={1.5} />
                    <span className="text-white/40 text-xs font-light">Puedes dictar con voz</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Shield className="w-3.5 h-3.5 text-white/30" strokeWidth={1.5} />
                    <span className="text-white/40 text-xs font-light">"No sé" es válido</span>
                  </div>
                </div>
              </motion.div>

              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.7 }} className="text-center">
                <motion.button whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}
                  onClick={() => { setStage('respondent'); scrollToTop() }}
                  className="px-10 py-4 bg-gradient-to-r from-violet-500 to-pink-500 rounded-full text-white font-light text-sm uppercase tracking-[0.15em] hover:shadow-[0_0_30px_rgba(139,92,246,0.25)] transition-shadow">
                  Comenzar diagnóstico
                </motion.button>
              </motion.div>
            </div>
          </motion.div>
        )}

        {/* ═══════════════════════════════════════════════════════════
            STAGE: RESPONDENT SELECTION
        ═══════════════════════════════════════════════════════════ */}
        {stage === 'respondent' && (
          <motion.div key="respondent" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }}
            className="min-h-screen flex items-center justify-center px-6 pt-28">
            <div className="max-w-lg w-full text-center">
              <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 0.2 }}
                className="inline-flex items-center gap-2 px-4 py-2 border border-white/10 rounded-full bg-white/5 mb-8">
                <Users className="w-3.5 h-3.5 text-white/50" strokeWidth={1.5} />
                <span className="text-xs text-white/50 font-light uppercase tracking-[0.15em]">Antes de comenzar</span>
              </motion.div>

              <h2 className="text-3xl lg:text-4xl font-light text-white mb-4 font-display tracking-wide">
                ¿Estás respondiendo a solas o <span className="italic font-normal">acompañado/a</span>?
              </h2>
              <p className="text-white/40 text-sm font-extralight mb-12">Esto nos ayuda a personalizar tu resultado.</p>

              <div className="space-y-4">
                {RESPONDENT_OPTIONS.map((opt, i) => (
                  <motion.button key={opt.value} initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.3 + i * 0.1 }} whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}
                    onClick={() => { setRespondent(opt.value); setStage(mode === 'premium' ? 'philosophical' : 'test'); scrollToTop() }}
                    className="w-full group flex items-center gap-4 p-5 border border-white/10 rounded-2xl bg-white/[0.02] hover:border-pink-500/30 hover:bg-pink-500/[0.03] transition-all duration-300">
                    <div className="w-10 h-10 rounded-full border border-white/15 flex items-center justify-center group-hover:border-pink-400/40 transition-colors">
                      <span className="text-white/70 text-sm font-light">{opt.label.charAt(0)}</span>
                    </div>
                    <div className="text-left">
                      <span className="text-white/90 text-sm font-light block">{opt.label}</span>
                      <span className="text-white/30 text-xs font-extralight">{opt.desc}</span>
                    </div>
                    <ArrowRight className="w-4 h-4 text-white/20 ml-auto group-hover:text-pink-400/60 transition-all group-hover:translate-x-1" />
                  </motion.button>
                ))}
              </div>
            </div>
          </motion.div>
        )}

        {/* ═══════════════════════════════════════════════════════════
            STAGE: TEST
        ═══════════════════════════════════════════════════════════ */}
        {stage === 'test' && (
          <motion.div key="test" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="min-h-screen flex flex-col pt-24 lg:pt-28 pb-20 px-6">
            <div className="fixed top-0 left-0 right-0 z-50 h-1 bg-white/5">
              <motion.div className={`h-full bg-gradient-to-r ${mode === 'premium' ? 'from-violet-500 to-pink-400' : 'from-pink-500 to-rose-400'}`}
                initial={{ width: 0 }} animate={{ width: `${progress}%` }} transition={{ duration: 0.4, ease: 'easeOut' }} />
            </div>

            <div className="max-w-2xl mx-auto w-full flex-1 flex flex-col justify-center">
              {mode === 'premium' && currentQuestion === 0 && (
                <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
                  className="mb-6 p-4 border border-violet-500/10 rounded-xl bg-violet-500/[0.02]">
                  <p className="text-violet-200/60 text-xs font-light leading-relaxed">
                    Ahora unas afirmaciones rápidas para confirmar lo que nos contaste. Solo elige qué tan cierto es cada una para ti.
                  </p>
                </motion.div>
              )}
              <div className="flex items-center justify-between mb-6">
                <span className="text-white/30 text-xs font-light tracking-wider">
                  PREGUNTA {currentQuestion + 1} DE {questions.length}
                </span>
                <span className="text-white/20 text-xs font-light tracking-wider">{progress}%</span>
              </div>

              <AnimatePresence mode="wait">
                <motion.div key={currentQuestion} initial={{ opacity: 0, x: 30 }} animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -30 }} transition={{ duration: 0.3 }}>
                  <h3 className="text-xl lg:text-2xl font-light text-white/90 leading-relaxed mb-10 tracking-wide font-display italic">
                    &ldquo;{questions[currentQuestion].text}&rdquo;
                  </h3>

                  <div className="space-y-3">
                    {ANSWER_OPTIONS.map((opt, i) => {
                      const isSelected = answers[questions[currentQuestion].id] === opt.value
                      return (
                        <motion.button key={opt.value} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: i * 0.05 }} whileHover={{ scale: 1.01 }} whileTap={{ scale: 0.99 }}
                          onClick={() => handleAnswer(opt.value)}
                          className={`w-full flex items-center gap-4 p-4 rounded-xl border transition-all duration-300 ${
                            isSelected ? 'border-pink-500/50 bg-pink-500/10 text-white' : 'border-white/8 bg-white/[0.02] text-white/60 hover:border-white/20 hover:bg-white/[0.04]'
                          }`}>
                          <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center transition-colors ${
                            isSelected ? 'border-pink-400 bg-pink-500' : 'border-white/20'
                          }`}>
                            {isSelected && <Check className="w-3 h-3 text-white" strokeWidth={3} />}
                          </div>
                          <span className="text-sm font-light tracking-wide">{opt.label}</span>
                        </motion.button>
                      )
                    })}
                  </div>
                </motion.div>
              </AnimatePresence>

              <div className="flex items-center justify-between mt-10 pt-6 border-t border-white/5">
                <button onClick={() => setCurrentQuestion(prev => Math.max(0, prev - 1))} disabled={currentQuestion === 0}
                  className="flex items-center gap-2 text-white/30 hover:text-white/60 text-xs tracking-wider disabled:opacity-20 disabled:cursor-not-allowed transition-colors">
                  <ArrowLeft className="w-3.5 h-3.5" /> ANTERIOR
                </button>
                {answers[questions[currentQuestion]?.id] != null && currentQuestion < questions.length - 1 && (
                  <button onClick={() => setCurrentQuestion(prev => prev + 1)}
                    className="flex items-center gap-2 text-white/30 hover:text-white/60 text-xs tracking-wider transition-colors">
                    SIGUIENTE <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                )}
              </div>
            </div>
          </motion.div>
        )}

        {/* ═══════════════════════════════════════════════════════════
            STAGE: PHILOSOPHICAL QUESTIONS (Premium)
        ═══════════════════════════════════════════════════════════ */}
        {stage === 'philosophical' && (
          <motion.div key="philosophical" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="min-h-screen flex flex-col pt-24 lg:pt-28 pb-20 px-6">
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
              <div className="absolute top-1/3 left-1/3 w-96 h-96 bg-violet-600/5 rounded-full blur-3xl" />
              <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-fuchsia-600/5 rounded-full blur-3xl" />
            </div>

            <div className="fixed top-0 left-0 right-0 z-50 h-1 bg-white/5">
              <motion.div className="h-full bg-gradient-to-r from-violet-500 to-fuchsia-400"
                initial={{ width: 0 }} animate={{ width: `${Math.round(((currentPhilosophical + 1) / PHILOSOPHICAL_QUESTIONS.length) * 100)}%` }}
                transition={{ duration: 0.4, ease: 'easeOut' }} />
            </div>

            <div className="max-w-2xl mx-auto w-full flex-1 flex flex-col justify-center relative z-10">
              {currentPhilosophical === 0 && (
                <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
                  className="mb-8 p-5 border border-violet-500/15 rounded-xl bg-violet-500/[0.03]">
                  <p className="text-violet-200/70 text-base font-light leading-relaxed">
                    Cuéntamelo como si fuera un amigo — no hay respuestas correctas ni incorrectas.
                    <span className="text-violet-300/80 font-normal"> Entre más compartas, mejor será tu análisis.</span>{' '}
                    Puedes hablar o escribir, como prefieras.
                  </p>
                </motion.div>
              )}

              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-2 px-3 py-1 rounded-full border border-violet-500/15 bg-violet-500/5">
                  <Brain className="w-3 h-3 text-violet-400/60" strokeWidth={1.5} />
                  <span className="text-violet-300/50 text-[10px] font-light uppercase tracking-[0.15em]">Platícame de tu relación</span>
                </div>
                <span className="text-white/25 text-sm font-light tracking-wider">
                  {currentPhilosophical + 1} / {PHILOSOPHICAL_QUESTIONS.length}
                </span>
              </div>

              <AnimatePresence mode="wait">
                <motion.div key={currentPhilosophical} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }} transition={{ duration: 0.4 }}>

                  <h3 className="text-2xl lg:text-3xl font-light text-white/90 leading-relaxed mb-8 tracking-wide font-display">
                    {PHILOSOPHICAL_QUESTIONS[currentPhilosophical].text}
                  </h3>

                  {/* ── VOICE MODE ────────────────────────────── */}
                  {philUIMode === 'voice' && (
                    <div className="flex flex-col items-center py-2">
                      {/* Large centered mic button */}
                      <motion.button
                        type="button"
                        onClick={togglePhilMic}
                        whileHover={{ scale: 1.06 }}
                        whileTap={{ scale: 0.94 }}
                        className={`relative w-20 h-20 rounded-full border-2 flex items-center justify-center transition-all duration-300 mb-4 ${
                          philRecording
                            ? 'border-red-400/50 bg-red-500/15 text-red-300'
                            : 'border-violet-500/40 bg-violet-500/10 text-violet-300 hover:border-violet-400/60 hover:bg-violet-500/20'
                        }`}>
                        {philRecording && (
                          <motion.div className="absolute inset-0 rounded-full border border-red-400/20"
                            animate={{ scale: [1, 1.35, 1], opacity: [0.4, 0, 0.4] }}
                            transition={{ duration: 1.5, repeat: Infinity }} />
                        )}
                        {philRecording ? <MicOff className="w-8 h-8" strokeWidth={1.5} /> : <Mic className="w-8 h-8" strokeWidth={1.5} />}
                      </motion.button>

                      {/* Status label */}
                      {!philRecording && !philosophicalAnswers[currentPhilosophical]?.trim() && (
                        <p className="text-white/35 text-sm font-light text-center mb-2">Toca el micrófono para hablar</p>
                      )}
                      {philRecording && (
                        <p className="text-red-300/60 text-sm font-light animate-pulse text-center mb-2">
                          Escuchando... toca para pausar
                        </p>
                      )}

                      {/* Live transcript (confirmed + interim) */}
                      {(philosophicalAnswers[currentPhilosophical]?.trim() || philInterim) && (
                        <motion.div initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }}
                          className="w-full mt-4 p-5 rounded-2xl border border-white/8 bg-white/[0.02] text-left">
                          <p className="text-white/82 text-lg font-light leading-relaxed">
                            {philosophicalAnswers[currentPhilosophical] || ''}
                            {philInterim && <span className="text-white/30 italic"> {philInterim}</span>}
                          </p>
                        </motion.div>
                      )}

                      {/* Action buttons after having confirmed text */}
                      {philosophicalAnswers[currentPhilosophical]?.trim() && !philRecording && (
                        <div className="flex items-center gap-3 mt-5">
                          <button onClick={togglePhilMic}
                            className="flex items-center gap-1.5 px-4 py-2 rounded-full border border-violet-500/20 text-violet-300/60 text-xs uppercase tracking-wider hover:border-violet-400/35 hover:text-violet-300/90 transition-all">
                            <Mic className="w-3 h-3" /> Agregar más
                          </button>
                          <motion.button whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}
                            onClick={() => {
                              if (currentPhilosophical < PHILOSOPHICAL_QUESTIONS.length - 1) {
                                setCurrentPhilosophical(prev => prev + 1); scrollToTop()
                              } else { setStage('test'); scrollToTop() }
                            }}
                            className="flex items-center gap-2 px-5 py-2 rounded-full bg-gradient-to-r from-violet-500/80 to-fuchsia-500/80 text-white text-xs uppercase tracking-wider hover:from-violet-500 hover:to-fuchsia-500 transition-all">
                            {currentPhilosophical < PHILOSOPHICAL_QUESTIONS.length - 1 ? 'Siguiente' : 'Continuar'}
                            <ArrowRight className="w-3.5 h-3.5" />
                          </motion.button>
                        </div>
                      )}

                      {/* Skip (only when no text) */}
                      {!philosophicalAnswers[currentPhilosophical]?.trim() && !philRecording && (
                        <button onClick={() => {
                          if (currentPhilosophical < PHILOSOPHICAL_QUESTIONS.length - 1) {
                            setCurrentPhilosophical(prev => prev + 1)
                          } else { setStage('test'); scrollToTop() }
                        }}
                          className="mt-4 text-white/20 text-xs hover:text-white/40 tracking-wider transition-colors">
                          OMITIR
                        </button>
                      )}

                      {/* Fallback to text */}
                      <button onClick={() => setPhilUIMode('text')}
                        className="mt-5 text-white/22 text-xs hover:text-white/50 transition-colors underline underline-offset-4">
                        Prefiero escribir
                      </button>
                    </div>
                  )}

                  {/* ── TEXT MODE ────────────────────────────── */}
                  {philUIMode === 'text' && (
                    <div>
                      <textarea
                        value={philosophicalAnswers[currentPhilosophical] || ''}
                        onChange={(e) => setPhilosophicalAnswers(prev => ({ ...prev, [currentPhilosophical]: e.target.value }))}
                        placeholder="Escribe aquí con libertad..."
                        maxLength={800}
                        className="w-full h-40 p-5 bg-white/[0.03] border border-violet-500/15 rounded-2xl text-white/85 text-base font-light placeholder:text-white/20 focus:border-violet-400/30 focus:outline-none resize-none transition-colors leading-relaxed"
                      />
                      <div className="flex items-center justify-between mt-2">
                        <button onClick={() => setPhilUIMode('voice')}
                          className="flex items-center gap-1.5 text-violet-300/40 text-xs hover:text-violet-300/70 transition-colors">
                          <Mic className="w-3 h-3" /> Usar micrófono
                        </button>
                        <span className="text-white/15 text-[10px] font-extralight">
                          {(philosophicalAnswers[currentPhilosophical] || '').length}/800
                        </span>
                      </div>
                    </div>
                  )}
                </motion.div>
              </AnimatePresence>

              {/* Navigation row */}
              <div className="flex items-center justify-between mt-8 pt-6 border-t border-white/5">
                <button
                  onClick={() => { if (currentPhilosophical > 0) setCurrentPhilosophical(prev => prev - 1) }}
                  disabled={currentPhilosophical === 0}
                  className="flex items-center gap-2 text-white/30 hover:text-white/60 text-xs tracking-wider disabled:opacity-20 disabled:cursor-not-allowed transition-colors">
                  <ArrowLeft className="w-3.5 h-3.5" /> ANTERIOR
                </button>
                {philUIMode === 'text' && (
                  <button
                    onClick={() => {
                      if (currentPhilosophical < PHILOSOPHICAL_QUESTIONS.length - 1) {
                        setCurrentPhilosophical(prev => prev + 1)
                      } else { setStage('test'); scrollToTop() }
                    }}
                    className="flex items-center gap-2 text-violet-300/60 hover:text-violet-300/90 text-xs tracking-wider transition-colors">
                    {currentPhilosophical < PHILOSOPHICAL_QUESTIONS.length - 1 ? 'SIGUIENTE' : 'CONTINUAR'}
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                )}
              </div>
            </div>
          </motion.div>
        )}

        {/* ═══════════════════════════════════════════════════════════
            STAGE: OPEN QUESTION
        ═══════════════════════════════════════════════════════════ */}
        {stage === 'open-question' && (
          <motion.div key="open-question" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
            className="min-h-screen flex items-center justify-center px-6 pt-28">
            <div className="max-w-xl w-full text-center">
              <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }}
                className="inline-flex items-center gap-2 px-4 py-2 border border-white/10 rounded-full bg-white/5 mb-8">
                <Heart className="w-3.5 h-3.5 text-pink-400/50" strokeWidth={1.5} />
                <span className="text-xs text-white/50 font-light uppercase tracking-[0.15em]">Una última pregunta</span>
              </motion.div>

              <h2 className="text-2xl lg:text-3xl font-light text-white mb-4 font-display tracking-wide leading-relaxed">
                Si tu relación pudiera mejorar <span className="italic text-pink-300/80">una sola cosa</span>, ¿qué sería?
              </h2>
              <p className="text-white/30 text-sm font-extralight mb-10">Esta respuesta es opcional pero nos ayuda a entender mejor tu situación.</p>

              <textarea value={openQuestion} onChange={(e) => setOpenQuestion(e.target.value)}
                placeholder="Escribe libremente aquí..." maxLength={500}
                className="w-full h-32 p-5 bg-white/[0.03] border border-white/10 rounded-2xl text-white/80 text-sm font-light placeholder:text-white/20 focus:border-pink-500/30 focus:outline-none resize-none transition-colors" />

              <div className="flex items-center justify-center gap-4 mt-8">
                <motion.button whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}
                  onClick={() => { setStage('email'); scrollToTop() }}
                  className="px-8 py-3.5 bg-gradient-to-r from-pink-500 to-rose-500 rounded-full text-white font-light text-sm uppercase tracking-[0.15em] hover:shadow-[0_0_30px_rgba(244,63,94,0.25)] transition-shadow">
                  Continuar
                </motion.button>
                <button onClick={() => { setStage('email'); scrollToTop() }}
                  className="text-white/30 text-xs hover:text-white/50 tracking-wider transition-colors">OMITIR</button>
              </div>
            </div>
          </motion.div>
        )}

        {/* ═══════════════════════════════════════════════════════════
            STAGE: EMAIL CAPTURE
        ═══════════════════════════════════════════════════════════ */}
        {stage === 'email' && (
          <motion.div key="email" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
            className="min-h-screen flex items-center justify-center px-6 pt-28">
            <div className="max-w-md w-full text-center">
              <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ type: 'spring', stiffness: 200, delay: 0.1 }}
                className="w-16 h-16 mx-auto mb-8 rounded-full bg-gradient-to-br from-pink-500/20 to-rose-500/20 border border-pink-500/20 flex items-center justify-center">
                <Lock className="w-7 h-7 text-pink-400/70" strokeWidth={1.5} />
              </motion.div>

              <h2 className="text-2xl lg:text-3xl font-light text-white mb-3 font-display tracking-wide">Tu diagnóstico está listo</h2>
              <p className="text-white/40 text-sm font-extralight mb-10 leading-relaxed">
                Introduce tu email para recibir tu diagnóstico completo.
              </p>

              <div className="relative mb-4">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-white/20" />
                <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="tu@email.com"
                  className="w-full pl-12 pr-4 py-4 bg-white/[0.03] border border-white/10 rounded-xl text-white/80 text-sm font-light placeholder:text-white/20 focus:border-pink-500/30 focus:outline-none transition-colors" />
              </div>

              <motion.button whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}
                onClick={() => {
                  setEmailSubmitted(true)
                  if (mode === 'premium' && isPremiumUnlocked) {
                    handleRunAIAnalysis()
                  } else {
                    setStage('results'); scrollToTop()
                  }
                }}
                disabled={!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)}
                className="w-full py-4 bg-gradient-to-r from-pink-500 to-rose-500 rounded-xl text-white font-light text-sm uppercase tracking-[0.15em] disabled:opacity-30 disabled:cursor-not-allowed hover:shadow-[0_0_30px_rgba(244,63,94,0.25)] transition-all">
                Ver mi diagnóstico
              </motion.button>

              <button onClick={() => {
                if (mode === 'premium' && isPremiumUnlocked) {
                  handleRunAIAnalysis()
                } else {
                  setStage('results'); scrollToTop()
                }
              }}
                className="mt-4 text-white/20 text-xs hover:text-white/40 tracking-wider transition-colors">
                CONTINUAR SIN EMAIL
              </button>
            </div>
          </motion.div>
        )}

        {/* ═══════════════════════════════════════════════════════════
            STAGE: ANALYZING (Premium — IA working)
        ═══════════════════════════════════════════════════════════ */}
        {stage === 'analyzing' && (
          <motion.div key="analyzing" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="min-h-screen flex items-center justify-center px-6">
            <div className="max-w-md w-full text-center">
              <motion.div animate={{ rotate: 360 }} transition={{ duration: 2, repeat: Infinity, ease: 'linear' }} className="mx-auto mb-8">
                <Loader2 className="w-12 h-12 text-violet-400/60" strokeWidth={1.5} />
              </motion.div>
              <h2 className="text-2xl font-light text-white mb-4 font-display tracking-wide">Analizando tu relación</h2>
              <p className="text-white/50 text-sm font-light mb-2">Estamos procesando tu narrativa y cruzándola con los datos...</p>
              <p className="text-white/30 text-xs font-light mb-8">Correlacionando lo que nos contaste con las afirmaciones confirmatorias</p>

              {/* Progress bar with stages */}
              <AnalyzingProgress philosophicalAnswers={philosophicalAnswers} philosophicalQuestions={PHILOSOPHICAL_QUESTIONS} />
            </div>
          </motion.div>
        )}

        {/* ═══════════════════════════════════════════════════════════
            STAGE: RESULTS
        ═══════════════════════════════════════════════════════════ */}
        {stage === 'results' && (
          <motion.div key="results" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="min-h-screen pt-24 lg:pt-32 pb-20 px-6">
            <div className="fixed inset-0 overflow-hidden pointer-events-none z-0">
              <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-pink-600/5 rounded-full blur-3xl" />
              <div className="absolute bottom-1/3 right-1/4 w-80 h-80 bg-violet-600/5 rounded-full blur-3xl" />
            </div>

            <div className="max-w-3xl mx-auto relative z-10">
              {/* Result Header */}
              <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8 }} className="text-center mb-16">
                <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ type: 'spring', stiffness: 150, delay: 0.2 }}
                  className="text-4xl mb-5">{result.emoji}</motion.div>
                <div className="inline-flex items-center gap-2 px-4 py-1.5 border border-white/10 rounded-full bg-white/5 mb-4">
                  <span className="text-xs text-white/50 font-light uppercase tracking-[0.15em]">
                    {isPremiumUnlocked ? 'Diagnóstico Premium' : 'Diagnóstico Gratuito'}
                  </span>
                </div>
                <h2 className={`text-2xl lg:text-3xl font-light mb-8 font-display tracking-wide bg-gradient-to-r ${result.color} bg-clip-text text-transparent`}>
                  {result.title}
                </h2>
                {isPremiumUnlocked && aiAnalysis?.diagnosticoNarrado ? (
                  <div className="text-left max-w-2xl mx-auto">
                    {aiAnalysis.diagnosticoNarrado.split('\n\n').map((p, i) => (
                      <p key={i} className="text-white/68 text-base lg:text-[17px] font-light leading-[1.95] tracking-wide mb-5 last:mb-0">
                        {renderBold(p)}
                      </p>
                    ))}
                  </div>
                ) : (
                  <>
                    <p className="text-white/60 text-base lg:text-lg font-light leading-relaxed max-w-xl mx-auto mb-4">{result.description}</p>
                    <p className="text-white/50 text-sm font-light leading-relaxed max-w-xl mx-auto">{result.detail}</p>
                  </>
                )}
              </motion.div>

              {/* ─── APERTURA EMPÁTICA (Premium — first thing shown) ─── */}
              {isPremiumUnlocked && aiAnalysis?.aperturaEmpatica && (
                <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.25 }}
                  className="mb-10 p-8 border border-violet-500/20 rounded-2xl bg-gradient-to-br from-violet-500/[0.04] to-fuchsia-500/[0.02]">
                  <div className="flex items-center gap-3 mb-6">
                    <Heart className="w-5 h-5 text-violet-400/70" strokeWidth={1.5} />
                    <h3 className="text-lg font-semibold text-white tracking-wide font-display">Lo que tu historia reveló</h3>
                  </div>
                  {aiAnalysis.aperturaEmpaticaPuntos?.length > 0 ? (
                    <div className="space-y-5">
                      {aiAnalysis.aperturaEmpaticaPuntos.map((punto, i) => (
                        <div key={i} className="flex items-start gap-4">
                          <span className="w-1.5 h-1.5 rounded-full bg-violet-400/60 mt-2 flex-shrink-0" />
                          <div className="flex-1">
                            <span className="text-white/90 text-sm font-semibold tracking-wide">{punto.titulo}</span>
                            <span className="text-white/45 text-sm"> — </span>
                            <span className="text-white/65 text-sm font-light leading-relaxed">{renderBold(punto.texto)}</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    (aiAnalysis.aperturaEmpatica || '').split('\n\n').map((p, i) => (
                      <p key={i} className="text-white/72 text-base font-light leading-[1.95] tracking-wide mb-4 last:mb-0">
                        {renderBold(p)}
                      </p>
                    ))
                  )}
                </motion.div>
              )}

              {/* ─── RADAR CHART (Premium) ─── */}
              {isPremiumUnlocked && (
                <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}
                  className="mb-16 p-8 border border-violet-500/10 rounded-2xl bg-gradient-to-br from-violet-500/[0.02] to-transparent">
                  <div className="flex items-center gap-3 mb-6">
                    <BarChart3 className="w-5 h-5 text-violet-400/60" strokeWidth={1.5} />
                    <h3 className="text-lg font-light text-white tracking-wide font-display">Mapa de tu relación</h3>
                  </div>
                  <RadarChart data={AREAS.map(a => ({ label: a.label, value: getPercent(areaScores[a.key]) }))} />
                </motion.div>
              )}

              {/* ─── AREA BARS (clean — no inline correlations) ─── */}
              <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }} className="mb-4">
                <div className="flex items-center gap-3 mb-8">
                  <BarChart3 className="w-5 h-5 text-pink-400/60" strokeWidth={1.5} />
                  <h3 className="text-xl font-light text-white tracking-wide font-display">Perfil de tu relación</h3>
                </div>
                <div className="space-y-5">
                  {displayAreas.map((area, i) => {
                    const score = areaScores[area.key]
                    const pct = getPercent(score)
                    const level = getLevel(score)
                    return (
                      <motion.div key={area.key} initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.5 + i * 0.08 }}>
                        <div className="flex items-center justify-between mb-2">
                          <div className="flex items-center gap-2.5">
                            <area.icon className="w-4 h-4 text-white/40" strokeWidth={1.5} />
                            <span className="text-white/80 text-sm font-light tracking-wide">{area.label}</span>
                          </div>
                          <div className="flex items-center gap-3">
                            <span className={`text-xs font-light ${level.color}`}>{level.label}</span>
                            <span className="text-white/30 text-xs font-light tabular-nums">{pct}%</span>
                          </div>
                        </div>
                        <div className="h-2 bg-white/5 rounded-full overflow-hidden">
                          <motion.div initial={{ width: 0 }} animate={{ width: `${pct}%` }}
                            transition={{ duration: 1, delay: 0.6 + i * 0.08, ease: 'easeOut' }}
                            className={`h-full rounded-full bg-gradient-to-r ${area.color}`} />
                        </div>
                      </motion.div>
                    )
                  })}
                </div>

                {/* Correlaciones principales (Premium) */}
                {isPremiumUnlocked && aiAnalysis?.correlacionesPrincipales?.length > 0 && (
                  <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 1.2 }}
                    className="mt-8 pt-7 border-t border-white/6">
                    <p className="text-white/28 text-[10px] font-light uppercase tracking-[0.18em] mb-4">Conexiones detectadas</p>
                    <div className="space-y-3">
                      {aiAnalysis.correlacionesPrincipales.map((insight, i) => (
                        <div key={i} className="flex items-start gap-3 p-4 rounded-xl border border-white/5 bg-white/[0.01]">
                          <span className="w-1 h-1 rounded-full bg-pink-400/50 mt-2 flex-shrink-0" />
                          <p className="text-white/55 text-sm font-light leading-relaxed">{renderBold(insight)}</p>
                        </div>
                      ))}
                    </div>
                  </motion.div>
                )}
              </motion.div>

              {/* ─── IDEALIZATION GAUGE (Premium) ─── */}
              {isPremiumUnlocked && aiAnalysis && (
                <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.6 }}
                  className="mt-10 mb-4 p-8 border border-fuchsia-500/10 rounded-2xl bg-gradient-to-br from-fuchsia-500/[0.02] to-transparent">
                  <div className="flex items-center gap-3 mb-6">
                    <Eye className="w-5 h-5 text-fuchsia-400/60" strokeWidth={1.5} />
                    <h3 className="text-lg font-light text-white tracking-wide font-display">Nivel de Idealización</h3>
                  </div>
                  <div className="mb-4">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-white/50 text-xs font-light">Elección consciente</span>
                      <span className={`text-sm font-light ${
                        aiAnalysis.idealizationScore >= 66 ? 'text-red-400' : aiAnalysis.idealizationScore >= 33 ? 'text-amber-400' : 'text-emerald-400'
                      }`}>
                        {aiAnalysis.idealizationLevel === 'alto' ? 'Alta' : aiAnalysis.idealizationLevel === 'medio' ? 'Moderada' : 'Saludable'}
                      </span>
                      <span className="text-white/50 text-xs font-light">Idealización alta</span>
                    </div>
                    <div className="h-3 bg-white/5 rounded-full overflow-hidden">
                      <motion.div initial={{ width: 0 }} animate={{ width: `${aiAnalysis.idealizationScore}%` }}
                        transition={{ duration: 1.5, ease: 'easeOut' }}
                        className={`h-full rounded-full bg-gradient-to-r ${
                          aiAnalysis.idealizationScore >= 66 ? 'from-red-500 to-red-400' : aiAnalysis.idealizationScore >= 33 ? 'from-amber-500 to-yellow-400' : 'from-emerald-500 to-green-400'
                        }`} />
                    </div>
                    <div className="text-center mt-3">
                      <span className="text-white/30 text-lg font-light tabular-nums">{aiAnalysis.idealizationScore}%</span>
                    </div>
                  </div>
                  {aiAnalysis.idealizationExplanation && (
                    <div className="mt-6 pt-6 border-t border-white/6">
                      {aiAnalysis.idealizationExplanation.split('\n\n').map((p, i) => (
                        <p key={i} className="text-white/60 text-sm font-light leading-[1.9] mb-3 last:mb-0">{renderBold(p)}</p>
                      ))}
                    </div>
                  )}
                </motion.div>
              )}

              {/* ─── BALANCE DE LA RELACIÓN — visible para todos ─── */}
              <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.7 }}
                className="mt-10 mb-4 p-8 border border-white/8 rounded-2xl bg-white/[0.02]">
                <div className="flex items-center gap-3 mb-6">
                  <TrendingUp className="w-5 h-5 text-emerald-400/60" strokeWidth={1.5} />
                  <h3 className="text-lg font-light text-white tracking-wide font-display">Balance de la relación</h3>
                </div>
                <div className="space-y-3">
                  {AREAS.map(area => {
                    const score = areaScores[area.key]
                    const pct = getPercent(score)
                    const isStrength = pct >= 60
                    return (
                      <div key={area.key} className="flex items-center gap-3">
                        <span className="text-white/50 text-xs font-light w-28 text-right truncate">{area.label}</span>
                        <div className="flex-1 flex items-center">
                          <div className="w-1/2 flex justify-end">
                            {!isStrength && (
                              <div className="h-3 rounded-l-full bg-gradient-to-l from-red-500/60 to-red-500/20"
                                style={{ width: `${Math.max(5, (100 - pct))}%` }} />
                            )}
                          </div>
                          <div className="w-px h-5 bg-white/20 flex-shrink-0" />
                          <div className="w-1/2">
                            {isStrength && (
                              <div className="h-3 rounded-r-full bg-gradient-to-r from-emerald-500/60 to-emerald-500/20"
                                style={{ width: `${Math.max(5, pct)}%` }} />
                            )}
                          </div>
                        </div>
                        <span className="text-white/40 text-xs font-light w-10 tabular-nums">{pct}%</span>
                      </div>
                    )
                  })}
                  <div className="flex items-center gap-3 mt-2">
                    <span className="w-28" />
                    <div className="flex-1 flex items-center justify-between text-[10px] text-white/30 font-light">
                      <span>← Riesgo</span>
                      <span>Fortaleza →</span>
                    </div>
                    <span className="w-10" />
                  </div>
                </div>
              </motion.div>

              {/* ─── LOCKED PAYWALL (Free users) ─── */}
              {!isPremiumUnlocked && (
                <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.7 }} className="mb-16">
                  <div className="relative overflow-hidden rounded-2xl">
                    {/* Blurred preview */}
                    <div className="filter blur-sm opacity-40 pointer-events-none select-none">
                      <div className="p-8 border border-white/8 rounded-2xl bg-white/[0.02] space-y-6">
                        <div className="h-56 bg-gradient-to-br from-violet-500/5 to-pink-500/5 rounded-xl flex items-center justify-center">
                          <div className="w-48 h-48 rounded-full border border-white/10" />
                        </div>
                        <div className="space-y-3">
                          <div className="h-4 bg-white/5 rounded w-3/4" />
                          <div className="h-4 bg-white/5 rounded w-full" />
                          <div className="h-4 bg-white/5 rounded w-5/6" />
                          <div className="h-4 bg-white/5 rounded w-2/3" />
                        </div>
                      </div>
                    </div>
                    {/* Lock overlay */}
                    <div className="absolute inset-0 flex flex-col items-center justify-center bg-black/50 backdrop-blur-[2px] rounded-2xl">
                      <Lock className="w-8 h-8 text-white/30 mb-4" strokeWidth={1.5} />
                      <p className="text-white/70 text-sm font-light mb-1">Contenido Premium</p>
                      <p className="text-white/40 text-xs font-light mb-6 text-center max-w-xs px-4">
                        Gráfica radar, perfil de patrones inconscientes, lectura integral completa, informe PDF profesional y más
                      </p>
                      <motion.button whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}
                        onClick={() => { setMode('premium'); setStage('checkout'); scrollToTop() }}
                        className="px-8 py-3 bg-gradient-to-r from-violet-500 to-pink-500 rounded-full text-white text-xs font-light uppercase tracking-[0.15em] hover:shadow-[0_0_30px_rgba(139,92,246,0.3)] transition-shadow">
                        Desbloquear por ${PREMIUM_PRICE} MXN
                      </motion.button>
                    </div>
                  </div>
                </motion.div>
              )}

              {/* ─── PREMIUM ANALYSIS ─── */}
              {isPremiumUnlocked && aiAnalysis && (
                <>
                  {/* Patrones + Fortalezas (quick overview before deep readings) */}
                  <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.8 }}
                    className="grid grid-cols-1 sm:grid-cols-2 gap-5 mb-8">
                    <div className="p-6 border border-red-500/12 rounded-2xl bg-red-500/[0.02]">
                      <h4 className="text-red-300/60 text-[10px] font-light uppercase tracking-[0.18em] mb-5">Patrones Inconscientes</h4>
                      <ul className="space-y-4">
                        {(aiAnalysis.unconsciousPatterns || []).map((p, i) => {
                          const { title, description } = parseItemTitle(p)
                          return (
                            <li key={i} className="flex items-start gap-2.5">
                              <span className="w-1 h-1 rounded-full bg-red-400/50 mt-2 flex-shrink-0" />
                              <div>
                                {title && <span className="text-white/85 text-xs font-semibold block mb-0.5">{title}</span>}
                                <span className="text-white/50 text-xs font-light leading-relaxed">{description || p}</span>
                              </div>
                            </li>
                          )
                        })}
                      </ul>
                    </div>
                    <div className="p-6 border border-emerald-500/12 rounded-2xl bg-emerald-500/[0.02]">
                      <h4 className="text-emerald-300/60 text-[10px] font-light uppercase tracking-[0.18em] mb-5">Fortalezas Encontradas</h4>
                      <ul className="space-y-4">
                        {(aiAnalysis.strengthsFound || []).map((s, i) => {
                          const { title, description } = parseItemTitle(s)
                          return (
                            <li key={i} className="flex items-start gap-2.5">
                              <span className="w-1 h-1 rounded-full bg-emerald-400/50 mt-2 flex-shrink-0" />
                              <div>
                                {title && <span className="text-white/85 text-xs font-semibold block mb-0.5">{title}</span>}
                                <span className="text-white/50 text-xs font-light leading-relaxed">{description || s}</span>
                              </div>
                            </li>
                          )
                        })}
                      </ul>
                    </div>
                  </motion.div>

                  {/* Defense Mechanisms */}
                  {aiAnalysis.defenseMechanisms && aiAnalysis.defenseMechanisms.length > 0 && (
                    <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.85 }}
                      className="mb-8 p-8 border border-orange-500/10 rounded-2xl bg-gradient-to-br from-orange-500/[0.02] to-transparent">
                      <div className="flex items-center gap-3 mb-5">
                        <AlertTriangle className="w-5 h-5 text-orange-400/60" strokeWidth={1.5} />
                        <h3 className="text-lg font-light text-white tracking-wide font-display">Mecanismos de Defensa Detectados</h3>
                      </div>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        {aiAnalysis.defenseMechanisms.map((m, i) => {
                          const { title, description } = parseItemTitle(m)
                          return (
                            <div key={i} className="p-4 rounded-xl border border-orange-500/10 bg-orange-500/[0.02]">
                              {title && <p className="text-orange-300/80 text-xs font-semibold uppercase tracking-[0.1em] mb-1">{title}</p>}
                              <p className="text-white/55 text-xs font-light leading-relaxed">{description || m}</p>
                            </div>
                          )
                        })}
                      </div>
                    </motion.div>
                  )}

                  {/* Risk Areas */}
                  {aiAnalysis.riskAreas && aiAnalysis.riskAreas.length > 0 && (
                    <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.9 }}
                      className="mb-8 p-8 border border-red-500/10 rounded-2xl bg-gradient-to-br from-red-500/[0.02] to-transparent">
                      <div className="flex items-center gap-3 mb-5">
                        <TrendingDown className="w-5 h-5 text-red-400/60" strokeWidth={1.5} />
                        <h3 className="text-lg font-light text-white tracking-wide font-display">Áreas de Riesgo</h3>
                      </div>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        {aiAnalysis.riskAreas.map((r, i) => {
                          const { title, description } = parseItemTitle(r)
                          return (
                            <div key={i} className="p-4 rounded-xl border border-red-500/10 bg-red-500/[0.02]">
                              {title && <p className="text-red-300/80 text-xs font-semibold uppercase tracking-[0.1em] mb-1">{title}</p>}
                              <p className="text-white/55 text-xs font-light leading-relaxed">{description || renderBold(r)}</p>
                            </div>
                          )
                        })}
                      </div>
                    </motion.div>
                  )}

                  {/* LECTURA 1: Análisis de tu relato (PRIMARIA) */}
                  <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 1.0 }}
                    className="mb-8 p-8 border border-violet-500/10 rounded-2xl bg-gradient-to-br from-violet-500/[0.02] to-transparent">
                    <div className="flex items-center gap-3 mb-5">
                      <Eye className="w-5 h-5 text-violet-400/60" strokeWidth={1.5} />
                      <h3 className="text-lg font-semibold text-white tracking-wide font-display">Análisis de tu relato</h3>
                    </div>
                    {(aiAnalysis.lecturaNarrativa || '').split('\n\n').map((p, i) => (
                      <p key={i} className="text-white/65 text-sm font-light leading-[1.9] tracking-wide mb-4 last:mb-0">{renderBold(p)}</p>
                    ))}
                  </motion.div>

                  {/* LECTURA 2: Lo que los datos confirman (CONFIRMATORIA) */}
                  <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 1.1 }}
                    className="mb-8 p-8 border border-blue-500/10 rounded-2xl bg-gradient-to-br from-blue-500/[0.02] to-transparent">
                    <div className="flex items-center gap-3 mb-5">
                      <BarChart3 className="w-5 h-5 text-blue-400/60" strokeWidth={1.5} />
                      <h3 className="text-lg font-semibold text-white tracking-wide font-display">Lo que los datos confirman</h3>
                    </div>
                    {(aiAnalysis.lecturaCuestionario || '').split('\n\n').map((p, i) => (
                      <p key={i} className="text-white/65 text-sm font-light leading-[1.9] tracking-wide mb-4 last:mb-0">{renderBold(p)}</p>
                    ))}
                  </motion.div>

                  {/* LECTURA 3: Recomendación Profesional */}
                  <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 1.2 }}
                    className="mb-8 p-8 border border-pink-500/10 rounded-2xl bg-gradient-to-br from-pink-500/[0.02] to-fuchsia-500/[0.01]">
                    <div className="flex items-center gap-3 mb-5">
                      <Layers className="w-5 h-5 text-pink-400/60" strokeWidth={1.5} />
                      <h3 className="text-lg font-semibold text-white tracking-wide font-display">Recomendación Profesional</h3>
                    </div>
                    {(aiAnalysis.lecturaIntegral || '').split('\n\n').map((p, i) => (
                      <p key={i} className="text-white/65 text-sm font-light leading-[1.9] tracking-wide mb-4 last:mb-0">{renderBold(p)}</p>
                    ))}
                  </motion.div>

                  {/* SESSION WORK ITEMS — individual + pareja */}
                  {aiAnalysis.sessionWorkItems && aiAnalysis.sessionWorkItems.length > 0 && (
                    <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 1.3 }}
                      className="mb-10">
                      <div className="flex items-center gap-3 mb-6">
                        <Sparkles className="w-5 h-5 text-emerald-400/60" strokeWidth={1.5} />
                        <h3 className="text-lg font-semibold text-white tracking-wide font-display">Lo que trabajaremos en sesión</h3>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 mb-8">
                        {/* Individual */}
                        <div className="p-6 border border-emerald-500/15 rounded-2xl bg-gradient-to-br from-emerald-500/[0.03] to-transparent">
                          <p className="text-emerald-300/60 text-[10px] font-light uppercase tracking-[0.18em] mb-5">Si vienes tú solo/a</p>
                          <ul className="space-y-4">
                            {aiAnalysis.sessionWorkItems.map((item, i) => {
                              const { title, description } = parseItemTitle(item)
                              return (
                                <li key={i} className="flex items-start gap-3">
                                  <span className="w-5 h-5 rounded-full bg-emerald-500/20 border border-emerald-500/30 flex items-center justify-center flex-shrink-0 mt-0.5">
                                    <span className="text-emerald-400/80 text-[10px] font-medium">{i + 1}</span>
                                  </span>
                                  <div>
                                    {title && <span className="text-white/85 text-xs font-semibold block mb-0.5">{title}</span>}
                                    <span className="text-white/55 text-xs font-light leading-relaxed">{description || renderBold(item)}</span>
                                  </div>
                                </li>
                              )
                            })}
                          </ul>
                        </div>

                        {/* Pareja */}
                        <div className="p-6 border border-blue-500/15 rounded-2xl bg-gradient-to-br from-blue-500/[0.03] to-transparent">
                          <p className="text-blue-300/60 text-[10px] font-light uppercase tracking-[0.18em] mb-5">Si vienen como pareja</p>
                          <ul className="space-y-4">
                            {(aiAnalysis.sessionWorkItemsPareja || aiAnalysis.sessionWorkItems).map((item, i) => {
                              const { title, description } = parseItemTitle(item)
                              return (
                                <li key={i} className="flex items-start gap-3">
                                  <span className="w-5 h-5 rounded-full bg-blue-500/20 border border-blue-500/30 flex items-center justify-center flex-shrink-0 mt-0.5">
                                    <span className="text-blue-400/80 text-[10px] font-medium">{i + 1}</span>
                                  </span>
                                  <div>
                                    {title && <span className="text-white/85 text-xs font-semibold block mb-0.5">{title}</span>}
                                    <span className="text-white/55 text-xs font-light leading-relaxed">{description || renderBold(item)}</span>
                                  </div>
                                </li>
                              )
                            })}
                          </ul>
                        </div>
                      </div>

                      {/* Dos CTAs */}
                      <div className="flex flex-col sm:flex-row gap-4 justify-center">
                        <motion.a href={`https://wa.me/527228720520?text=${whatsappIndividualMessage}`} target="_blank" rel="noopener noreferrer"
                          whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}
                          className="inline-flex items-center justify-center gap-3 px-7 py-3.5 border border-emerald-500/30 rounded-full text-emerald-300/90 font-light text-xs uppercase tracking-[0.15em] hover:bg-emerald-500/8 hover:border-emerald-400/50 transition-all">
                          Agendar sesión individual <ArrowRight className="w-3.5 h-3.5" />
                        </motion.a>
                        <motion.a href={`https://wa.me/527228720520?text=${whatsappParejaMessage}`} target="_blank" rel="noopener noreferrer"
                          whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}
                          className="inline-flex items-center justify-center gap-3 px-7 py-3.5 bg-gradient-to-r from-pink-500 to-rose-500 rounded-full text-white font-light text-xs uppercase tracking-[0.15em] hover:shadow-[0_0_30px_rgba(244,63,94,0.25)] transition-shadow">
                          Agendar sesión de pareja <ArrowRight className="w-3.5 h-3.5" />
                        </motion.a>
                      </div>
                    </motion.div>
                  )}
                </>
              )}

              {/* ─── INTERPRETATION (only for free users) ─── */}
              {!isPremiumUnlocked && mode === 'free' && (
                <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.7 }}
                  className="mb-16 p-8 border border-white/8 rounded-2xl bg-white/[0.02]">
                  <div className="flex items-center gap-3 mb-6">
                    <Brain className="w-5 h-5 text-violet-400/60" strokeWidth={1.5} />
                    <h3 className="text-lg font-light text-white tracking-wide font-display">Interpretación psicológica</h3>
                  </div>
                  {interpretation.split('\n\n').map((p, i) => (
                    <p key={i} className="text-white/60 text-sm font-light leading-[1.9] tracking-wide mb-4 last:mb-0">{p}</p>
                  ))}
                </motion.div>
              )}

              {/* ─── PROFESSIONAL RECOMMENDATION (free users only) ─── */}
              {!isPremiumUnlocked && (
                <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.8 }}
                  className="mb-16 p-8 border border-pink-500/15 rounded-2xl bg-gradient-to-br from-pink-500/[0.03] to-transparent">
                  <h3 className="text-lg font-semibold text-white mb-3 tracking-wide font-display">Recomendación profesional</h3>
                  <p className="text-white/60 text-sm font-light leading-relaxed mb-6">
                    Los resultados sugieren que la relación podría beneficiarse mucho de una conversación guiada que permita identificar los patrones invisibles que están generando estos resultados.
                  </p>
                  <motion.a href={`https://wa.me/527228720520?text=${whatsappAgendarMessage}`} target="_blank" rel="noopener noreferrer"
                    whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}
                    className="inline-flex items-center gap-3 px-8 py-3.5 bg-gradient-to-r from-pink-500 to-rose-500 rounded-full text-white font-light text-sm uppercase tracking-[0.15em] hover:shadow-[0_0_30px_rgba(244,63,94,0.25)] transition-shadow">
                    Agendar sesión de diagnóstico <ArrowRight className="w-4 h-4" />
                  </motion.a>
                </motion.div>
              )}

              {/* ─── ACTION BUTTONS ─── */}
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: isPremiumUnlocked ? 1.3 : 0.9 }}
                className="flex flex-wrap items-center justify-center gap-4 mb-20">
                {isPremiumUnlocked && (
                  <motion.button whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}
                    onClick={handleDownloadPDF} disabled={pdfGenerating}
                    className="flex items-center gap-2.5 px-6 py-3 border border-white/15 rounded-full text-white/70 text-xs font-light uppercase tracking-[0.15em] hover:border-white/30 hover:text-white/90 transition-all disabled:opacity-40">
                    <Download className="w-4 h-4" />
                    {pdfGenerating ? 'Generando...' : 'Descargar PDF'}
                  </motion.button>
                )}
                <motion.a href={`https://wa.me/527228720520?text=${whatsappMessage}`} target="_blank" rel="noopener noreferrer"
                  whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}
                  className="flex items-center gap-2.5 px-6 py-3 border border-emerald-500/30 rounded-full text-emerald-400/80 text-xs font-light uppercase tracking-[0.15em] hover:border-emerald-400/50 hover:bg-emerald-500/5 transition-all">
                  <Send className="w-4 h-4" /> Recibir por WhatsApp
                </motion.a>
              </motion.div>

              {/* ─── QUÉ PUEDES HACER AHORA ─── */}
              <motion.div initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="mb-20 text-center">
                <h3 className="text-3xl lg:text-4xl font-light text-white mb-6 font-display tracking-wide">
                  Qué puedes hacer <span className="italic font-normal">ahora</span>
                </h3>
                <p className="text-white/60 text-sm lg:text-base font-light leading-[1.9] max-w-xl mx-auto mb-10">
                  Este diagnóstico revela patrones importantes que vale la pena explorar con mayor profundidad.
                  En una sesión profesional analizamos la dinámica real de tu relación, identificamos los patrones invisibles
                  y construimos estrategias claras para transformarlos.
                </p>
                <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                  <motion.a href={`https://wa.me/527228720520?text=${whatsappAgendarMessage}`} target="_blank" rel="noopener noreferrer"
                    whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}
                    className="px-8 py-4 bg-gradient-to-r from-pink-500 to-rose-500 rounded-full text-white font-light text-xs uppercase tracking-[0.2em] hover:shadow-[0_0_40px_rgba(244,63,94,0.3)] transition-shadow">
                    Agendar Sesión de Diagnóstico de Pareja
                  </motion.a>
                  <button onClick={() => { setStage('info'); scrollToTop() }}
                    className="px-6 py-3.5 border border-white/15 rounded-full text-white/60 font-light text-xs uppercase tracking-[0.15em] hover:border-white/30 hover:text-white/80 transition-all">
                    Conocer Cómo Funciona la Consulta
                  </button>
                </div>
              </motion.div>
            </div>
          </motion.div>
        )}

        {/* ═══════════════════════════════════════════════════════════
            STAGE: INFO
        ═══════════════════════════════════════════════════════════ */}
        {stage === 'info' && (
          <motion.div key="info" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="min-h-screen pt-24 lg:pt-32 pb-20 px-6">
            <div className="max-w-2xl mx-auto">
              <button onClick={() => { setStage('results'); scrollToTop() }}
                className="flex items-center gap-2 text-white/30 hover:text-white/60 text-xs tracking-wider mb-12 transition-colors">
                <ArrowLeft className="w-3.5 h-3.5" /> VOLVER A RESULTADOS
              </button>

              <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="text-center mb-16">
                <div className="inline-flex items-center gap-2 px-4 py-2 border border-pink-500/20 rounded-full bg-pink-500/5 mb-8">
                  <Heart className="w-3.5 h-3.5 text-pink-400/70" strokeWidth={1.5} />
                  <span className="text-xs text-pink-300/70 font-light uppercase tracking-[0.2em]">Consulta de Pareja</span>
                </div>
                <h2 className="text-3xl lg:text-4xl font-light text-white mb-4 font-display tracking-wide">
                  Cómo funciona la <span className="italic font-normal">consulta</span>
                </h2>
              </motion.div>

              <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}
                className="p-8 border border-white/8 rounded-2xl bg-white/[0.02] mb-6">
                <h3 className="text-white/90 text-sm font-light uppercase tracking-[0.2em] mb-8">Qué incluye la sesión</h3>
                <div className="space-y-5">
                  {[
                    { label: 'Análisis de dinámica de pareja', desc: 'Exploramos qué patrones vinculares operan en la relación y de dónde provienen.' },
                    { label: 'Lectura del diagnóstico juntos', desc: 'Revisamos los resultados de este cuestionario como punto de partida de la conversación.' },
                    { label: 'Identificación de patrones inconscientes', desc: 'Aquello que se repite sin que ninguno lo elija conscientemente — y que suele ser la clave del malestar.' },
                    { label: 'Espacio para lo que no se ha podido decir', desc: 'La sesión crea las condiciones para abordar lo que en el día a día se evita o se dice mal.' },
                    { label: 'Claridad sobre el camino a seguir', desc: 'Al finalizar, habrá mayor comprensión de qué está ocurriendo y qué tipo de trabajo puede ayudar.' }
                  ].map((item, i) => (
                    <div key={i} className="flex items-start gap-3">
                      <Check className="w-4 h-4 text-pink-400/60 mt-0.5 flex-shrink-0" strokeWidth={2} />
                      <div>
                        <span className="text-white/80 text-sm font-light">{item.label}</span>
                        <p className="text-white/40 text-xs font-light leading-relaxed mt-0.5">{item.desc}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </motion.div>

              <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.35 }}
                className="p-8 border border-violet-500/10 rounded-2xl bg-violet-500/[0.02] mb-6">
                <h3 className="text-white/90 text-sm font-light uppercase tracking-[0.2em] mb-6">Cómo trabajo</h3>
                <div className="space-y-4">
                  <p className="text-white/55 text-sm font-light leading-[1.9]">
                    Mi enfoque es <strong className="text-white/80 font-semibold">psicoanalítico y relacional</strong>. No doy consejos ni recetas. En cambio, ayudo a que cada persona — o cada pareja — pueda ver con mayor claridad lo que en la relación opera por debajo de lo consciente.
                  </p>
                  <p className="text-white/55 text-sm font-light leading-[1.9]">
                    La sesión de diagnóstico no es terapia — es un <strong className="text-white/80 font-semibold">espacio de exploración inicial</strong> donde tomamos distancia de la urgencia del conflicto para ver la estructura de lo que está ocurriendo.
                  </p>
                  <p className="text-white/55 text-sm font-light leading-[1.9]">
                    Puedes venir <strong className="text-white/80 font-semibold">solo/a o con tu pareja</strong>. Ambos formatos tienen valor: la perspectiva individual revela lo que a veces no se puede decir en pareja, y la sesión conjunta permite trabajar en tiempo real la dinámica del vínculo.
                  </p>
                </div>
              </motion.div>

              <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }}
                className="grid grid-cols-3 gap-4 mb-10">
                <div className="p-5 border border-white/8 rounded-2xl bg-white/[0.02] text-center">
                  <Clock className="w-5 h-5 text-white/30 mx-auto mb-3" strokeWidth={1.5} />
                  <span className="text-white/40 text-[10px] uppercase tracking-[0.15em] block mb-1">Duración</span>
                  <span className="text-white/80 text-base font-light">60 min</span>
                </div>
                <div className="p-5 border border-white/8 rounded-2xl bg-white/[0.02] text-center">
                  <Eye className="w-5 h-5 text-white/30 mx-auto mb-3" strokeWidth={1.5} />
                  <span className="text-white/40 text-[10px] uppercase tracking-[0.15em] block mb-1">Modalidad</span>
                  <span className="text-white/80 text-base font-light">Online</span>
                </div>
                <div className="p-5 border border-white/8 rounded-2xl bg-white/[0.02] text-center">
                  <Heart className="w-5 h-5 text-white/30 mx-auto mb-3" strokeWidth={1.5} />
                  <span className="text-white/40 text-[10px] uppercase tracking-[0.15em] block mb-1">Formato</span>
                  <span className="text-white/80 text-base font-light">Individual o pareja</span>
                </div>
              </motion.div>

              <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5 }} className="flex flex-col sm:flex-row gap-4 justify-center">
                <motion.a href={`https://wa.me/527228720520?text=${whatsappIndividualMessage}`} target="_blank" rel="noopener noreferrer"
                  whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}
                  className="inline-flex items-center justify-center gap-3 px-8 py-3.5 border border-white/20 rounded-full text-white/80 font-light text-xs uppercase tracking-[0.15em] hover:border-white/40 hover:bg-white/5 transition-all">
                  Agendar individual <ArrowRight className="w-3.5 h-3.5" />
                </motion.a>
                <motion.a href={`https://wa.me/527228720520?text=${whatsappParejaMessage}`} target="_blank" rel="noopener noreferrer"
                  whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}
                  className="inline-flex items-center justify-center gap-3 px-8 py-4 bg-gradient-to-r from-pink-500 to-rose-500 rounded-full text-white font-light text-sm uppercase tracking-[0.2em] hover:shadow-[0_0_40px_rgba(244,63,94,0.3)] transition-shadow">
                  Agendar en pareja <ArrowRight className="w-4 h-4" />
                </motion.a>
              </motion.div>
            </div>
          </motion.div>
        )}

      </AnimatePresence>
    </div>
  )
}

export default ConsultaParejaPage
