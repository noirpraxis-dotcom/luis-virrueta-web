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
  { id: 1, text: 'En conversaciones importantes sentimos que realmente nos escuchamos.', area: 'comunicacion', inverted: false },
  { id: 2, text: 'A veces las pequeñas cosas del día a día generan más tensión de la que deberían.', area: 'comunicacion', inverted: true },
  { id: 3, text: 'Cuando hay un desacuerdo, podemos hablar sin que la conversación se convierta en pelea.', area: 'comunicacion', inverted: false },
  // Intimidad (3)
  { id: 4, text: 'En ocasiones siento que vivimos más como compañeros de piso que como pareja.', area: 'intimidad', inverted: true },
  { id: 5, text: 'Hay momentos donde siento una conexión profunda con mi pareja sin necesidad de palabras.', area: 'intimidad', inverted: false },
  { id: 6, text: 'Me resulta fácil mostrar vulnerabilidad emocional frente a mi pareja.', area: 'intimidad', inverted: false },
  // Admiración (3)
  { id: 7, text: 'Cuando pienso en mi pareja, siento genuina admiración por quién es como persona.', area: 'admiracion', inverted: false },
  { id: 8, text: 'A veces siento que las cosas que hace mi pareja me irritan más de lo razonable.', area: 'admiracion', inverted: true },
  { id: 9, text: 'Me gusta contarle a otros las cosas buenas de mi pareja.', area: 'admiracion', inverted: false },
  // Conflicto (3)
  { id: 10, text: 'Hay temas que preferimos no tocar porque sabemos que terminarán mal.', area: 'conflicto', inverted: true },
  { id: 11, text: 'Siento que arrastramos discusiones del pasado que nunca terminamos de resolver.', area: 'conflicto', inverted: true },
  { id: 12, text: 'Cuando surgen problemas, tengo confianza de que encontraremos una solución juntos.', area: 'conflicto', inverted: false },
  // Proyecto de vida (3)
  { id: 13, text: 'Cuando imaginamos el futuro, sentimos que vamos en la misma dirección.', area: 'proyecto', inverted: false },
  { id: 14, text: 'Hay decisiones importantes en las que noto que tenemos visiones muy diferentes.', area: 'proyecto', inverted: true },
  { id: 15, text: 'Compartimos al menos una meta importante que nos entusiasma a ambos.', area: 'proyecto', inverted: false },
  // Seguridad emocional (2)
  { id: 16, text: 'En momentos importantes siento que mi pareja está de mi lado.', area: 'seguridad', inverted: false },
  { id: 17, text: 'A veces dudo si mi pareja realmente entiende lo que necesito emocionalmente.', area: 'seguridad', inverted: true },
  // Autonomía (3)
  { id: 18, text: 'Me siento cómodo siendo completamente yo mismo dentro de la relación.', area: 'autonomia', inverted: false },
  { id: 19, text: 'Siento que necesito pedir permiso o justificar mis decisiones personales.', area: 'autonomia', inverted: true },
  { id: 20, text: 'Podemos pasar tiempo separados sin que genere malestar o inseguridad.', area: 'autonomia', inverted: false },
  // Idealización (3)
  { id: 21, text: 'A veces siento que necesito a mi pareja para sentirme completo/a.', area: 'idealizacion', inverted: true },
  { id: 22, text: 'Reconozco que mi pareja tiene defectos importantes y los acepto sin intentar cambiarlos.', area: 'idealizacion', inverted: false },
  { id: 23, text: 'Espero que mi pareja llene vacíos que siento en mi propia vida.', area: 'idealizacion', inverted: true }
]

// ─── PREGUNTAS: DIAGNÓSTICO PREMIUM (40 preguntas, 5 por área) ───

const QUESTIONS_DETAILED = [
  // Comunicación (5)
  { id: 101, text: 'En conversaciones importantes sentimos que realmente nos escuchamos.', area: 'comunicacion', inverted: false },
  { id: 102, text: 'A veces las pequeñas cosas del día a día generan más tensión de la que deberían.', area: 'comunicacion', inverted: true },
  { id: 103, text: 'Cuando hay un desacuerdo, podemos hablar sin que la conversación se convierta en pelea.', area: 'comunicacion', inverted: false },
  { id: 105, text: 'Nos resulta fácil hablar de cómo nos sentimos sin temor a ser juzgados.', area: 'comunicacion', inverted: false },
  { id: 107, text: 'Después de una conversación difícil, sentimos que llegamos a un mejor lugar.', area: 'comunicacion', inverted: false },
  // Intimidad (5)
  { id: 201, text: 'En ocasiones siento que vivimos más como compañeros de piso que como pareja.', area: 'intimidad', inverted: true },
  { id: 202, text: 'Hay momentos donde siento una conexión profunda con mi pareja sin necesidad de palabras.', area: 'intimidad', inverted: false },
  { id: 203, text: 'Me resulta fácil mostrar vulnerabilidad emocional frente a mi pareja.', area: 'intimidad', inverted: false },
  { id: 204, text: 'Nuestros momentos de intimidad física reflejan la conexión emocional que tenemos.', area: 'intimidad', inverted: false },
  { id: 205, text: 'He dejado de compartir ciertos pensamientos o sentimientos con mi pareja.', area: 'intimidad', inverted: true },
  // Admiración (5)
  { id: 301, text: 'Cuando pienso en mi pareja, siento genuina admiración por quién es como persona.', area: 'admiracion', inverted: false },
  { id: 302, text: 'A veces siento que las cosas que hace mi pareja me irritan más de lo razonable.', area: 'admiracion', inverted: true },
  { id: 304, text: 'Reconozco y valoro los esfuerzos que mi pareja hace por la relación.', area: 'admiracion', inverted: false },
  { id: 305, text: 'En momentos de frustración, me es difícil recordar qué me atrajo de mi pareja.', area: 'admiracion', inverted: true },
  { id: 306, text: 'Admiro la forma en que mi pareja enfrenta los retos de la vida.', area: 'admiracion', inverted: false },
  // Conflicto (5)
  { id: 401, text: 'Hay temas que preferimos no tocar porque sabemos que terminarán mal.', area: 'conflicto', inverted: true },
  { id: 402, text: 'Siento que arrastramos discusiones del pasado que nunca terminamos de resolver.', area: 'conflicto', inverted: true },
  { id: 403, text: 'Cuando surgen problemas, tengo confianza de que encontraremos una solución juntos.', area: 'conflicto', inverted: false },
  { id: 404, text: 'Alguno de los dos tiende a cerrarse o alejarse cuando la tensión sube.', area: 'conflicto', inverted: true },
  { id: 406, text: 'Podemos reparar los daños después de una pelea sin que queden resentimientos.', area: 'conflicto', inverted: false },
  // Proyecto de vida (5)
  { id: 501, text: 'Cuando imaginamos el futuro, sentimos que vamos en la misma dirección.', area: 'proyecto', inverted: false },
  { id: 503, text: 'Compartimos al menos una meta importante que nos entusiasma a ambos.', area: 'proyecto', inverted: false },
  { id: 504, text: 'Hemos hablado con claridad sobre lo que esperamos de la relación a largo plazo.', area: 'proyecto', inverted: false },
  { id: 505, text: 'Siento que uno de los dos ha cambiado lo que quiere de la vida sin comunicarlo.', area: 'proyecto', inverted: true },
  { id: 506, text: 'Tomamos decisiones importantes de manera conjunta, considerando el impacto en ambos.', area: 'proyecto', inverted: false },
  // Seguridad emocional (5)
  { id: 601, text: 'En momentos importantes siento que mi pareja está de mi lado.', area: 'seguridad', inverted: false },
  { id: 602, text: 'A veces dudo si mi pareja realmente entiende lo que necesito emocionalmente.', area: 'seguridad', inverted: true },
  { id: 603, text: 'Me siento seguro/a de que mi pareja no haría algo que me lastimara a propósito.', area: 'seguridad', inverted: false },
  { id: 604, text: 'Cuando estoy pasando por algo difícil, mi pareja es la primera persona a la que acudo.', area: 'seguridad', inverted: false },
  { id: 606, text: 'Sé que puedo contar con mi pareja sin importar las circunstancias.', area: 'seguridad', inverted: false },
  // Autonomía (5)
  { id: 701, text: 'Me siento cómodo siendo completamente yo mismo dentro de la relación.', area: 'autonomia', inverted: false },
  { id: 702, text: 'Siento que necesito pedir permiso o justificar mis decisiones personales.', area: 'autonomia', inverted: true },
  { id: 703, text: 'Podemos pasar tiempo separados sin que genere malestar o inseguridad.', area: 'autonomia', inverted: false },
  { id: 705, text: 'Respetamos los espacios individuales del otro sin interpretarlo como distancia.', area: 'autonomia', inverted: false },
  { id: 706, text: 'A veces siento que pierdo mi identidad dentro de la relación.', area: 'autonomia', inverted: true },
  // Idealización (5)
  { id: 801, text: 'A veces siento que necesito a mi pareja para sentirme completo/a.', area: 'idealizacion', inverted: true },
  { id: 802, text: 'Reconozco que mi pareja tiene defectos importantes y los acepto sin intentar cambiarlos.', area: 'idealizacion', inverted: false },
  { id: 804, text: 'La imagen que tengo de mi pareja corresponde con quién es realmente, no con quién deseo que sea.', area: 'idealizacion', inverted: false },
  { id: 805, text: 'Si mi relación terminara mañana, sentiría que pierdo una parte esencial de mí mismo/a.', area: 'idealizacion', inverted: true },
  { id: 806, text: 'Amo a mi pareja por quién es, no por lo que representa o lo que me da.', area: 'idealizacion', inverted: false }
]

// ─── PREGUNTAS ABIERTAS (Premium — análisis de patrones inconscientes) ────
// Conversacionales, como si hablaras con un amigo. DeepSeek extrae los patrones.

const PHILOSOPHICAL_QUESTIONS = [
  { id: 'p1', text: 'Si le contaras a un amigo cercano lo que más te gusta de tu relación, ¿qué le dirías?' },
  { id: 'p2', text: '¿Hay algo que últimamente te cueste decirle a tu pareja? Cuéntamelo con confianza.' },
  { id: 'p3', text: 'Imagina que hoy despiertas y tu pareja ya no está. ¿Qué es lo primero que sentirías o pensarías?' },
  { id: 'p4', text: '¿Alguna vez has sentido que das más de lo que recibes? Cuéntame cómo es eso para ti.' },
  { id: 'p5', text: 'Si pudieras cambiar una sola cosa de cómo se llevan día a día, ¿qué cambiarías?' },
  { id: 'p6', text: '¿Qué es lo que más te cuesta aceptar de tu pareja — eso que a veces te frustra aunque la quieras?' },
  { id: 'p7', text: 'En tus propias palabras, ¿qué significa para ti estar bien en pareja?' }
]

// ─── MICRÓFONO (Web Speech API) ───────────────────────────────────

function MicButton({ onTranscript }) {
  const [listening, setListening] = useState(false)
  const recognitionRef = useRef(null)

  const toggle = useCallback(() => {
    if (listening) {
      recognitionRef.current?.stop()
      setListening(false)
      return
    }
    const SR = window.SpeechRecognition || window.webkitSpeechRecognition
    if (!SR) return
    const recognition = new SR()
    recognition.lang = 'es-MX'
    recognition.continuous = true
    recognition.interimResults = false
    recognition.onresult = (e) => {
      const last = e.results[e.results.length - 1]
      if (last.isFinal) onTranscript(last[0].transcript)
    }
    recognition.onerror = () => setListening(false)
    recognition.onend = () => setListening(false)
    recognitionRef.current = recognition
    recognition.start()
    setListening(true)
  }, [listening, onTranscript])

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
  { label: 'Procesando cuestionario', duration: 3000 },
  { label: 'Leyendo tus reflexiones', duration: 4000 },
  { label: 'Detectando patrones inconscientes', duration: 5000 },
  { label: 'Cruzando datos cuantitativos y cualitativos', duration: 4000 },
  { label: 'Preparando tu informe personalizado', duration: 3000 }
]

function AnalyzingProgress() {
  const [currentStage, setCurrentStage] = useState(0)
  const [pct, setPct] = useState(0)

  useEffect(() => {
    const totalDuration = ANALYSIS_STAGES.reduce((a, s) => a + s.duration, 0)
    let elapsed = 0
    const interval = setInterval(() => {
      elapsed += 100
      const rawPct = Math.min(95, (elapsed / totalDuration) * 100)
      setPct(Math.round(rawPct))
      let cumulative = 0
      for (let i = 0; i < ANALYSIS_STAGES.length; i++) {
        cumulative += ANALYSIS_STAGES[i].duration
        if (elapsed < cumulative) { setCurrentStage(i); break }
        if (i === ANALYSIS_STAGES.length - 1) setCurrentStage(i)
      }
    }, 100)
    return () => clearInterval(interval)
  }, [])

  return (
    <div>
      <div className="h-2 bg-white/5 rounded-full overflow-hidden mb-3">
        <motion.div className="h-full rounded-full bg-gradient-to-r from-violet-500 to-pink-400"
          animate={{ width: `${pct}%` }} transition={{ duration: 0.3, ease: 'easeOut' }} />
      </div>
      <div className="flex items-center justify-between">
        <AnimatePresence mode="wait">
          <motion.span key={currentStage} initial={{ opacity: 0, y: 5 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -5 }}
            className="text-violet-300/50 text-xs font-light tracking-wide">
            {ANALYSIS_STAGES[currentStage].label}...
          </motion.span>
        </AnimatePresence>
        <span className="text-white/30 text-xs font-light tabular-nums">{pct}%</span>
      </div>
    </div>
  )
}

// ─── OPCIONES ─────────────────────────────────────────────────────

const ANSWER_OPTIONS = [
  { label: 'Nunca', value: 1 },
  { label: 'Rara vez', value: 2 },
  { label: 'A veces', value: 3 },
  { label: 'Frecuentemente', value: 4 },
  { label: 'Siempre', value: 5 }
]

const RESPONDENT_OPTIONS = [
  { label: 'Yo', value: 'yo', desc: 'Respondo desde mi perspectiva individual' },
  { label: 'Mi pareja', value: 'pareja', desc: 'Mi pareja lo está respondiendo' },
  { label: 'Ambos juntos', value: 'ambos', desc: 'Lo respondemos en equipo' }
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

function RadarChart({ data, size = 280 }) {
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

  return (
    <svg viewBox={`0 0 ${size} ${size}`} className="w-full max-w-[300px] mx-auto">
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
            fill="rgba(255,255,255,0.45)" fontSize="7.5" fontFamily="Outfit, sans-serif" fontWeight="300">
            {d.label}
          </text>
        )
      })}
    </svg>
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
      { title: '— Lectura del Cuestionario —', text: aiAnalysis.lecturaCuestionario },
      { title: '— Perfil Inconsciente —', text: aiAnalysis.lecturaInconsciente },
      { title: '— Lectura Integral —', text: aiAnalysis.lecturaIntegral },
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

  // Stages: hero | mode-select | checkout | respondent | test | open-question | philosophical | email | analyzing | results | info
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

  const scrollToTop = useCallback(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }, [])

  // Check for Stripe callback (future)
  useEffect(() => {
    if (searchParams.get('premium') === 'success') {
      setIsPremiumUnlocked(true)
      setMode('premium')
      setStage('respondent')
    }
  }, [searchParams])

  // Restore premium from sessionStorage
  useEffect(() => {
    if (sessionStorage.getItem('diagnostico_premium') === 'true') {
      setIsPremiumUnlocked(true)
    }
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
    setStage('respondent')
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
          setStage('philosophical')
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
                      <span className="flex items-center gap-1.5 text-white/40 text-xs"><Clock className="w-3 h-3" /> ~15-20 min</span>
                      <span className="w-px h-3 bg-white/10" />
                      <span className="text-violet-300/70 text-xs font-light">${PREMIUM_PRICE} MXN</span>
                    </div>
                    <ul className="space-y-2.5 mb-6 text-white/40 text-xs font-extralight">
                      <li className="flex items-start gap-2"><Check className="w-3 h-3 text-violet-400/50 mt-0.5 flex-shrink-0" /> Todo lo gratuito, desbloqueado</li>
                      <li className="flex items-start gap-2"><Check className="w-3 h-3 text-violet-400/50 mt-0.5 flex-shrink-0" /> Gráfica radar de 8 dimensiones</li>
                      <li className="flex items-start gap-2"><Check className="w-3 h-3 text-violet-400/50 mt-0.5 flex-shrink-0" /> Perfil de patrones inconscientes</li>
                      <li className="flex items-start gap-2"><Check className="w-3 h-3 text-violet-400/50 mt-0.5 flex-shrink-0" /> Lectura integral completa</li>
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
                ¿Quién está respondiendo este diagnóstico?
              </h2>
              <p className="text-white/40 text-sm font-extralight mb-12">Esto nos ayuda a personalizar tu resultado.</p>

              <div className="space-y-4">
                {RESPONDENT_OPTIONS.map((opt, i) => (
                  <motion.button key={opt.value} initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.3 + i * 0.1 }} whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}
                    onClick={() => { setRespondent(opt.value); setStage('test'); scrollToTop() }}
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
                  <p className="text-violet-200/70 text-sm font-light leading-relaxed">
                    Ahora viene la parte más personal. Cuéntamelo como si fuera un amigo — no necesitas tener la mejor ortografía, solo sé honesto/a. También puedes usar el micrófono para dictar.
                  </p>
                </motion.div>
              )}

              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2 px-3 py-1 rounded-full border border-violet-500/15 bg-violet-500/5">
                  <Brain className="w-3 h-3 text-violet-400/60" strokeWidth={1.5} />
                  <span className="text-violet-300/50 text-[10px] font-light uppercase tracking-[0.15em]">Reflexión personal</span>
                </div>
                <span className="text-white/25 text-xs font-light tracking-wider">
                  {currentPhilosophical + 1} / {PHILOSOPHICAL_QUESTIONS.length}
                </span>
              </div>

              <AnimatePresence mode="wait">
                <motion.div key={currentPhilosophical} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }} transition={{ duration: 0.4 }}>
                  <h3 className="text-xl lg:text-2xl font-light text-white/90 leading-relaxed mb-8 tracking-wide font-display">
                    {PHILOSOPHICAL_QUESTIONS[currentPhilosophical].text}
                  </h3>

                  <div className="relative">
                    <textarea
                      value={philosophicalAnswers[currentPhilosophical] || ''}
                      onChange={(e) => setPhilosophicalAnswers(prev => ({ ...prev, [currentPhilosophical]: e.target.value }))}
                      placeholder="Escribe aquí con libertad... no hay respuestas correctas ni incorrectas."
                      maxLength={800}
                      className="w-full h-36 p-5 pr-14 bg-white/[0.03] border border-violet-500/15 rounded-2xl text-white/80 text-sm font-light placeholder:text-white/20 focus:border-violet-400/30 focus:outline-none resize-none transition-colors"
                    />
                    {/* Microphone button — Web Speech API */}
                    {typeof window !== 'undefined' && ('SpeechRecognition' in window || 'webkitSpeechRecognition' in window) && (
                      <MicButton
                        onTranscript={(text) => setPhilosophicalAnswers(prev => ({
                          ...prev,
                          [currentPhilosophical]: (prev[currentPhilosophical] || '') + (prev[currentPhilosophical] ? ' ' : '') + text
                        }))}
                      />
                    )}
                  </div>
                  <p className="text-white/15 text-[10px] font-extralight mt-2 text-right">
                    {(philosophicalAnswers[currentPhilosophical] || '').length}/800
                  </p>
                </motion.div>
              </AnimatePresence>

              <div className="flex items-center justify-between mt-8 pt-6 border-t border-white/5">
                <button
                  onClick={() => { if (currentPhilosophical > 0) setCurrentPhilosophical(prev => prev - 1) }}
                  disabled={currentPhilosophical === 0}
                  className="flex items-center gap-2 text-white/30 hover:text-white/60 text-xs tracking-wider disabled:opacity-20 disabled:cursor-not-allowed transition-colors">
                  <ArrowLeft className="w-3.5 h-3.5" /> ANTERIOR
                </button>

                <div className="flex items-center gap-3">
                  {!philosophicalAnswers[currentPhilosophical]?.trim() && (
                    <button
                      onClick={() => {
                        if (currentPhilosophical < PHILOSOPHICAL_QUESTIONS.length - 1) {
                          setCurrentPhilosophical(prev => prev + 1)
                        } else {
                          setStage('open-question'); scrollToTop()
                        }
                      }}
                      className="text-white/20 text-xs hover:text-white/40 tracking-wider transition-colors">
                      OMITIR
                    </button>
                  )}
                  <button
                    onClick={() => {
                      if (currentPhilosophical < PHILOSOPHICAL_QUESTIONS.length - 1) {
                        setCurrentPhilosophical(prev => prev + 1)
                      } else {
                        setStage('open-question'); scrollToTop()
                      }
                    }}
                    className="flex items-center gap-2 text-violet-300/60 hover:text-violet-300/90 text-xs tracking-wider transition-colors">
                    {currentPhilosophical < PHILOSOPHICAL_QUESTIONS.length - 1 ? 'SIGUIENTE' : 'CONTINUAR'}
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
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
              <p className="text-white/50 text-sm font-light mb-2">Estamos procesando tus respuestas en profundidad...</p>
              <p className="text-white/30 text-xs font-light mb-8">Cruzando datos cuantitativos con tus reflexiones personales</p>

              {/* Progress bar with stages */}
              <AnalyzingProgress />
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
                  className="text-5xl mb-6">{result.emoji}</motion.div>
                <div className="inline-flex items-center gap-2 px-4 py-1.5 border border-white/10 rounded-full bg-white/5 mb-6">
                  <span className="text-xs text-white/50 font-light uppercase tracking-[0.15em]">
                    {isPremiumUnlocked ? 'Diagnóstico Premium' : 'Diagnóstico Gratuito'}
                  </span>
                </div>
                <h2 className={`text-4xl lg:text-5xl font-light mb-6 font-display tracking-wide bg-gradient-to-r ${result.color} bg-clip-text text-transparent`}>
                  {result.title}
                </h2>
                <p className="text-white/60 text-base lg:text-lg font-light leading-relaxed max-w-xl mx-auto mb-4">{result.description}</p>
                <p className="text-white/50 text-sm font-light leading-relaxed max-w-xl mx-auto">{result.detail}</p>
              </motion.div>

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

              {/* ─── AREA BARS ─── */}
              <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }} className="mb-16">
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
              </motion.div>

              {/* ─── IDEALIZATION GAUGE (Premium) ─── */}
              {isPremiumUnlocked && aiAnalysis && (
                <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.6 }}
                  className="mb-16 p-8 border border-fuchsia-500/10 rounded-2xl bg-gradient-to-br from-fuchsia-500/[0.02] to-transparent">
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
                </motion.div>
              )}

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
                  {/* Key Insight (first - the most impactful takeaway) */}
                  {aiAnalysis.keyInsight && (
                    <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.7 }}
                      className="mb-8 p-8 border border-amber-500/10 rounded-2xl bg-amber-500/[0.02]">
                      <h4 className="text-white/70 text-xs font-light uppercase tracking-[0.15em] mb-3">Insight Principal</h4>
                      <p className="text-white/60 text-base font-light leading-[1.9] tracking-wide italic">{aiAnalysis.keyInsight}</p>
                    </motion.div>
                  )}

                  {/* Patrones + Fortalezas (quick overview before deep readings) */}
                  <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.8 }}
                    className="grid grid-cols-1 sm:grid-cols-2 gap-5 mb-8">
                    <div className="p-6 border border-red-500/10 rounded-2xl bg-red-500/[0.02]">
                      <h4 className="text-white/70 text-xs font-light uppercase tracking-[0.15em] mb-4">Patrones Inconscientes</h4>
                      <ul className="space-y-2.5">
                        {(aiAnalysis.unconsciousPatterns || []).map((p, i) => (
                          <li key={i} className="flex items-start gap-2">
                            <span className="w-1 h-1 rounded-full bg-red-400/50 mt-2 flex-shrink-0" />
                            <span className="text-white/55 text-xs font-light leading-relaxed">{p}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                    <div className="p-6 border border-emerald-500/10 rounded-2xl bg-emerald-500/[0.02]">
                      <h4 className="text-white/70 text-xs font-light uppercase tracking-[0.15em] mb-4">Fortalezas Encontradas</h4>
                      <ul className="space-y-2.5">
                        {(aiAnalysis.strengthsFound || []).map((s, i) => (
                          <li key={i} className="flex items-start gap-2">
                            <span className="w-1 h-1 rounded-full bg-emerald-400/50 mt-2 flex-shrink-0" />
                            <span className="text-white/55 text-xs font-light leading-relaxed">{s}</span>
                          </li>
                        ))}
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
                        {aiAnalysis.defenseMechanisms.map((m, i) => (
                          <div key={i} className="flex items-start gap-3 p-3 rounded-xl border border-orange-500/8 bg-orange-500/[0.02]">
                            <span className="w-2 h-2 rounded-full bg-orange-400/40 mt-1.5 flex-shrink-0" />
                            <span className="text-white/55 text-sm font-light leading-relaxed">{m}</span>
                          </div>
                        ))}
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
                      <div className="space-y-3">
                        {aiAnalysis.riskAreas.map((r, i) => (
                          <div key={i} className="flex items-center gap-3 p-3 rounded-xl border border-red-500/8 bg-red-500/[0.02]">
                            <span className="w-2 h-2 rounded-full bg-red-400/50 flex-shrink-0" />
                            <span className="text-white/55 text-sm font-light leading-relaxed">{r}</span>
                          </div>
                        ))}
                      </div>
                    </motion.div>
                  )}

                  {/* Fortalezas vs Riesgos Chart */}
                  <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.95 }}
                    className="mb-8 p-8 border border-white/8 rounded-2xl bg-white/[0.02]">
                    <div className="flex items-center gap-3 mb-6">
                      <TrendingUp className="w-5 h-5 text-emerald-400/60" strokeWidth={1.5} />
                      <h3 className="text-lg font-light text-white tracking-wide font-display">Balance de la Relación</h3>
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

                  {/* LECTURA 1: Perfil del Cuestionario */}
                  <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 1.0 }}
                    className="mb-8 p-8 border border-blue-500/10 rounded-2xl bg-gradient-to-br from-blue-500/[0.02] to-transparent">
                    <div className="flex items-center gap-3 mb-2">
                      <BarChart3 className="w-5 h-5 text-blue-400/60" strokeWidth={1.5} />
                      <h3 className="text-lg font-light text-white tracking-wide font-display">Lectura del Cuestionario</h3>
                      <span className="text-[10px] text-blue-300/30 font-light px-2 py-0.5 border border-blue-500/10 rounded-full ml-auto">1 de 3</span>
                    </div>
                    <p className="text-white/40 text-xs font-light mb-6">Qué revelan los datos cuantitativos sobre tu dinámica vincular</p>
                    {(aiAnalysis.lecturaCuestionario || '').split('\n\n').map((p, i) => (
                      <p key={i} className="text-white/65 text-sm font-light leading-[1.9] tracking-wide mb-3">{p}</p>
                    ))}
                  </motion.div>

                  {/* LECTURA 2: Perfil Inconsciente */}
                  <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 1.1 }}
                    className="mb-8 p-8 border border-violet-500/10 rounded-2xl bg-gradient-to-br from-violet-500/[0.02] to-transparent">
                    <div className="flex items-center gap-3 mb-2">
                      <Eye className="w-5 h-5 text-violet-400/60" strokeWidth={1.5} />
                      <h3 className="text-lg font-light text-white tracking-wide font-display">Perfil Inconsciente</h3>
                      <span className="text-[10px] text-violet-300/30 font-light px-2 py-0.5 border border-violet-500/10 rounded-full ml-auto">2 de 3</span>
                    </div>
                    <p className="text-white/40 text-xs font-light mb-6">Patrones profundos detectados en tus reflexiones personales</p>
                    {(aiAnalysis.lecturaInconsciente || '').split('\n\n').map((p, i) => (
                      <p key={i} className="text-white/65 text-sm font-light leading-[1.9] tracking-wide mb-3">{p}</p>
                    ))}
                  </motion.div>

                  {/* LECTURA 3: Lectura Integral */}
                  <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 1.2 }}
                    className="mb-8 p-8 border border-pink-500/10 rounded-2xl bg-gradient-to-br from-pink-500/[0.02] to-fuchsia-500/[0.01]">
                    <div className="flex items-center gap-3 mb-2">
                      <Layers className="w-5 h-5 text-pink-400/60" strokeWidth={1.5} />
                      <h3 className="text-lg font-light text-white tracking-wide font-display">Lectura Integral</h3>
                      <span className="text-[10px] text-pink-300/30 font-light px-2 py-0.5 border border-pink-500/10 rounded-full ml-auto">3 de 3</span>
                    </div>
                    <p className="text-white/40 text-xs font-light mb-6">Cruce de datos cuantitativos con tus reflexiones: la historia completa</p>
                    {(aiAnalysis.lecturaIntegral || '').split('\n\n').map((p, i) => (
                      <p key={i} className="text-white/65 text-sm font-light leading-[1.9] tracking-wide mb-3">{p}</p>
                    ))}
                  </motion.div>

                  {/* Existential Reflection */}
                  {aiAnalysis.existentialReflection && (
                    <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 1.3 }}
                      className="mb-16 p-8 border border-white/5 rounded-2xl bg-white/[0.01] text-center">
                      <p className="text-white/45 text-base font-light leading-[2] tracking-wide italic font-display max-w-lg mx-auto">
                        &ldquo;{aiAnalysis.existentialReflection}&rdquo;
                      </p>
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

              {/* ─── PROFESSIONAL RECOMMENDATION ─── */}
              <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: isPremiumUnlocked ? 1.2 : 0.8 }}
                className="mb-16 p-8 border border-pink-500/15 rounded-2xl bg-gradient-to-br from-pink-500/[0.03] to-transparent">
                <h3 className="text-lg font-light text-white mb-3 tracking-wide font-display">Recomendación profesional</h3>
                <p className="text-white/60 text-sm font-light leading-relaxed mb-6">
                  {isPremiumUnlocked && aiAnalysis?.recommendation
                    ? aiAnalysis.recommendation.replace(/\n/g, ' ')
                    : 'Los resultados sugieren que la relación podría beneficiarse mucho de una conversación guiada que permita identificar los patrones invisibles que están generando estos resultados.'
                  }
                </p>
                <motion.a href={`https://wa.me/527228720520?text=${whatsappAgendarMessage}`} target="_blank" rel="noopener noreferrer"
                  whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}
                  className="inline-flex items-center gap-3 px-8 py-3.5 bg-gradient-to-r from-pink-500 to-rose-500 rounded-full text-white font-light text-sm uppercase tracking-[0.15em] hover:shadow-[0_0_30px_rgba(244,63,94,0.25)] transition-shadow">
                  Agendar sesión de diagnóstico <ArrowRight className="w-4 h-4" />
                </motion.a>
              </motion.div>

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
                className="p-8 border border-white/8 rounded-2xl bg-white/[0.02] mb-8">
                <h3 className="text-white/90 text-sm font-light uppercase tracking-[0.2em] mb-8">Qué incluye la sesión</h3>
                <div className="space-y-5">
                  {['Análisis de dinámica de pareja', 'Identificación de patrones inconscientes', 'Herramientas prácticas de comunicación', 'Claridad sobre el futuro de la relación'].map((item, i) => (
                    <div key={i} className="flex items-start gap-3">
                      <Check className="w-4 h-4 text-pink-400/60 mt-0.5 flex-shrink-0" strokeWidth={2} />
                      <span className="text-white/60 text-sm font-light leading-relaxed">{item}</span>
                    </div>
                  ))}
                </div>
              </motion.div>

              <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }}
                className="grid grid-cols-2 gap-4 mb-12">
                <div className="p-6 border border-white/8 rounded-2xl bg-white/[0.02] text-center">
                  <Clock className="w-5 h-5 text-white/30 mx-auto mb-3" strokeWidth={1.5} />
                  <span className="text-white/40 text-xs uppercase tracking-[0.15em] block mb-1">Duración</span>
                  <span className="text-white/80 text-lg font-light">60 minutos</span>
                </div>
                <div className="p-6 border border-white/8 rounded-2xl bg-white/[0.02] text-center">
                  <Eye className="w-5 h-5 text-white/30 mx-auto mb-3" strokeWidth={1.5} />
                  <span className="text-white/40 text-xs uppercase tracking-[0.15em] block mb-1">Modalidad</span>
                  <span className="text-white/80 text-lg font-light">Online</span>
                </div>
              </motion.div>

              <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5 }} className="text-center">
                <motion.a href={`https://wa.me/527228720520?text=${whatsappAgendarMessage}`} target="_blank" rel="noopener noreferrer"
                  whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}
                  className="inline-flex items-center gap-3 px-10 py-4 bg-gradient-to-r from-pink-500 to-rose-500 rounded-full text-white font-light text-sm uppercase tracking-[0.2em] hover:shadow-[0_0_40px_rgba(244,63,94,0.3)] transition-shadow">
                  AGENDAR SESIÓN <ArrowRight className="w-4 h-4" />
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
