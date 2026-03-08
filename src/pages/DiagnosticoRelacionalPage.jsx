import { motion, AnimatePresence } from 'framer-motion'
import { useState, useRef, useMemo, useCallback, useEffect } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import {
  Heart, MessageCircle, Shield, Target, Users, Brain, ArrowRight, ArrowLeft,
  Check, CheckCircle, Clock, FileText, Mail, Send, Download, Sparkles, Eye,
  Lock, Star, Activity, BarChart3, Zap, Layers, CreditCard, Loader2, Tag,
  Mic, MicOff, TrendingUp, TrendingDown, AlertTriangle, Play, ChevronDown
} from 'lucide-react'
import SEOHead from '../components/SEOHead'
import jsPDF from 'jspdf'
import { analyzeDiagnostic } from '../services/diagnosticRelacionalService'

// ─── CUESTIONARIO: 34 PREGUNTAS EN 10 SECCIONES ────────────────────

const QUESTIONS = [
  // SECTION 1 — AUTOPERCEPCIÓN (Q1-Q3)
  { id: 'Q1', section: 'Autopercepción', text: 'Me describiría a mí mismo en una relación como alguien que...', sample: 'Soy alguien que da mucho emocionalmente pero a veces siento que no recibo lo mismo a cambio.' },
  { id: 'Q2', section: 'Autopercepción', text: 'Las personas que me conocen suelen decir que yo en las relaciones...', sample: 'Que soy muy entregado pero que a veces me pierdo en el otro y dejo de cuidarme.' },
  { id: 'Q3', section: 'Autopercepción', text: 'Cuando estoy en una relación, algo que me caracteriza emocionalmente es que...', sample: 'Me preocupo mucho por cómo se siente la otra persona, a veces más que por cómo me siento yo.' },

  // SECTION 2 — PERCEPCIÓN DE LA PAREJA (Q4-Q6)
  { id: 'Q4', section: 'Percepción de la pareja', text: 'Yo describiría a mi pareja como alguien que...', sample: 'Es fuerte, decidida, pero a veces se cierra emocionalmente cuando hay tensión.' },
  { id: 'Q5', section: 'Percepción de la pareja', text: 'Algo de mi pareja que influye mucho en cómo me siento es que...', sample: 'Cuando está de buenas, todo fluye. Pero cuando se distancia, siento que todo se derrumba.' },
  { id: 'Q6', section: 'Percepción de la pareja', text: 'Cuando pienso en mi pareja, lo primero que siento es...', sample: 'Ternura mezclada con algo de incertidumbre. Como que la amo pero no siempre sé en qué estamos.' },

  // SECTION 3 — ORIGEN DE LA RELACIÓN (Q7-Q8)
  { id: 'Q7', section: 'Origen de la relación', text: 'Me uní a mi pareja porque...', sample: 'Sentí que me veía de verdad. De una forma que nadie me había visto antes.' },
  { id: 'Q8', section: 'Origen de la relación', text: 'Con el tiempo me he dado cuenta de que mi pareja realmente...', sample: 'No es exactamente como la imaginaba al principio. Tiene sus propios miedos y limitaciones que no vi.' },

  // SECTION 4 — CONEXIÓN POSITIVA (Q9-Q11)
  { id: 'Q9', section: 'Conexión positiva', text: 'Cuando estamos bien juntos, yo me siento...', sample: 'En paz. Como si todo estuviera en su lugar y no necesitara nada más.' },
  { id: 'Q10', section: 'Conexión positiva', text: 'Cuando estamos bien juntos, siento que yo soy...', sample: 'Mi mejor versión. Más gracioso, más abierto, más yo.' },
  { id: 'Q11', section: 'Conexión positiva', text: 'Un momento reciente en el que me sentí muy conectado con mi pareja fue cuando...', sample: 'El otro día estábamos caminando sin rumbo y empezamos a hablar de cosas que nunca hablamos. Se sintió real.' },

  // SECTION 5 — NECESIDADES EMOCIONALES (Q12-Q14)
  { id: 'Q12', section: 'Necesidades emocionales', text: 'Para sentirme realmente amado dentro de una relación necesito...', sample: 'Que me busquen. Que no tenga que adivinar si le importo. Que me lo demuestre sin que yo pregunte.' },
  { id: 'Q13', section: 'Necesidades emocionales', text: 'Lo que más me hace sentir seguro emocionalmente en una relación es...', sample: 'Saber que puedo ser vulnerable sin que lo use en mi contra después.' },
  { id: 'Q14', section: 'Necesidades emocionales', text: 'Lo que más me hace sentir vulnerable dentro de una relación es...', sample: 'Cuando siento que dependo emocionalmente de alguien que podría irse en cualquier momento.' },

  // SECTION 6 — DISTANCIA Y APEGO (Q15-Q17)
  { id: 'Q15', section: 'Distancia y apego', text: 'Cuando mi pareja se aleja emocionalmente, yo suelo...', sample: 'Quedarme pensando qué hice mal. Reviso todo lo que dije buscando el error.' },
  { id: 'Q16', section: 'Distancia y apego', text: 'Cuando mi pareja busca más cercanía conmigo, yo tiendo a...', sample: 'Abrirme, pero a veces me asusto un poco. Como si tanta cercanía me pusiera nervioso.' },
  { id: 'Q17', section: 'Distancia y apego', text: 'Cuando empiezo a sentirme emocionalmente lejos de mi pareja normalmente es después de que...', sample: 'Hay un conflicto que no se resolvió y los dos pretendemos que no pasó nada.' },

  // SECTION 7 — DINÁMICA DE CONFLICTO (Q18-Q23)
  { id: 'Q18', section: 'Dinámica de conflicto', text: 'Cuando discutimos normalmente termino sintiéndome...', sample: 'Invisible. Como si no importara lo que digo.' },
  { id: 'Q19', section: 'Dinámica de conflicto', text: 'Cuando mi pareja se enoja conmigo mi primera reacción suele ser...', sample: 'Callarme. Esperar a que se le pase para poder hablar con calma.' },
  { id: 'Q20', section: 'Dinámica de conflicto', text: 'Cuando aparece un problema entre nosotros yo tiendo a...', sample: 'Intentar resolverlo rápido, a veces antes de entender realmente qué pasó.' },
  { id: 'Q21', section: 'Dinámica de conflicto', text: 'Cuando un desacuerdo comienza entre nosotros lo primero que suele pasar es que...', sample: 'Yo empiezo a explicar mi punto y ella se cierra. Y mientras más hablo, menos me escucha.' },
  { id: 'Q22', section: 'Dinámica de conflicto', text: 'Hay situaciones pequeñas que terminan convirtiéndose en discusiones más grandes de lo que deberían, por ejemplo...', sample: 'El otro día discutimos por quién debía lavar algo y terminamos hablando de todo lo que no se ha dicho en meses.' },
  { id: 'Q23', section: 'Dinámica de conflicto', text: 'Después de un conflicto fuerte, el silencio entre nosotros suele sentirse como...', sample: 'Pesado. Como si los dos estuviéramos esperando que el otro dé el primer paso.' },

  // SECTION 8 — APOYO EMOCIONAL (Q24)
  { id: 'Q24', section: 'Apoyo emocional', text: 'Cuando uno de los dos atraviesa un momento difícil, el otro normalmente responde...', sample: 'Ella se preocupa y quiere ayudar. Yo tiendo a darle espacio, pero ella necesita que la abrace y le diga que todo va a estar bien.' },

  // SECTION 9 — LO QUE NO SE DICE (Q25-Q30)
  { id: 'Q25', section: 'Lo que no se dice', text: 'Lo que más admiro de mi pareja es...', sample: 'Su fortaleza. Puede con todo. Aunque a veces la confundo con frialdad.' },
  { id: 'Q26', section: 'Lo que no se dice', text: 'Lo que más me cuesta aceptar de mi pareja es...', sample: 'Que a veces no me demuestra lo que siente y yo necesito esas señales para sentirme seguro.' },
  { id: 'Q27', section: 'Lo que no se dice', text: 'Hay cosas que nunca le he dicho a mi pareja, como por ejemplo...', sample: 'Que a veces me siento solo incluso cuando estamos juntos. No sé cómo decirlo sin que suene a reproche.' },
  { id: 'Q28', section: 'Lo que no se dice', text: 'Hay partes de mí que siento que mi pareja aún no conoce, como por ejemplo...', sample: 'Lo mucho que me esfuerzo por mantener todo en calma entre nosotros.' },
  { id: 'Q29', section: 'Lo que no se dice', text: 'Creo que hay cosas de mí que mi pareja desearía que cambiara, como por ejemplo...', sample: 'Que fuera más expresivo. Que le dijera lo que siento sin que tenga que sacármelo con preguntas.' },
  { id: 'Q30', section: 'Lo que no se dice', text: 'Hay cosas que siento que aporto a la relación y que a veces mi pareja no ve, como por ejemplo...', sample: 'La estabilidad. Siempre estoy ahí cuando necesita hablar, pero no sé si lo valora.' },

  // SECTION 10 — ESTRUCTURA PROFUNDA (Q31-Q34)
  { id: 'Q31', section: 'Estructura profunda', text: 'Si hay algo que siento que se repite una y otra vez entre nosotros es...', sample: 'Que uno se acerca y el otro se aleja. Nunca estamos los dos abiertos al mismo tiempo.' },
  { id: 'Q32', section: 'Estructura profunda', text: 'Nuestra relación funciona mejor cuando...', sample: 'No hay presión externa. Cuando somos solo nosotros dos sin estrés ni obligaciones.' },
  { id: 'Q33', section: 'Estructura profunda', text: 'Si esta relación terminara mañana, lo que más me dolería sería...', sample: 'Darme cuenta de que no dije todo lo que sentía cuando tuve la oportunidad.' },
  { id: 'Q34', section: 'Estructura profunda', text: 'Si esta relación mejorara mucho en los próximos meses, lo que sería diferente en el día a día sería...', sample: 'Hablaríamos más de lo que sentimos. Menos silencios incómodos y más complicidad real.' }
]

// Section metadata for progress display
const SECTIONS = [
  { name: 'Autopercepción', icon: Brain, color: 'violet', count: 3 },
  { name: 'Percepción de la pareja', icon: Eye, color: 'pink', count: 3 },
  { name: 'Origen de la relación', icon: Heart, color: 'rose', count: 2 },
  { name: 'Conexión positiva', icon: Sparkles, color: 'emerald', count: 3 },
  { name: 'Necesidades emocionales', icon: Shield, color: 'blue', count: 3 },
  { name: 'Distancia y apego', icon: Users, color: 'indigo', count: 3 },
  { name: 'Dinámica de conflicto', icon: Activity, color: 'red', count: 6 },
  { name: 'Apoyo emocional', icon: Heart, color: 'cyan', count: 1 },
  { name: 'Lo que no se dice', icon: MessageCircle, color: 'fuchsia', count: 6 },
  { name: 'Estructura profunda', icon: Layers, color: 'amber', count: 4 }
]

// ─── LABELS FOR SCORING ──────────────────────────────────────

const CORE_LABELS = {
  emotional_compatibility: { label: 'Compatibilidad Emocional', icon: Heart },
  relationship_stability: { label: 'Estabilidad Relacional', icon: Shield },
  emotional_erosion_risk: { label: 'Riesgo de Erosión', icon: AlertTriangle, inverted: true },
  reconnection_potential: { label: 'Potencial de Reconexión', icon: TrendingUp }
}

const RADAR_LABELS = {
  emotional_synchrony: 'Sincronía emocional',
  communication_clarity: 'Claridad comunicativa',
  emotional_safety: 'Seguridad emocional',
  conflict_management: 'Manejo de conflictos',
  relational_balance: 'Balance relacional',
  emotional_support: 'Apoyo emocional'
}

const PROFILE_LABELS = {
  idealization_level: { label: 'Nivel de idealización', inverted: true },
  friction_level: { label: 'Nivel de fricción', inverted: true },
  emotional_openness: { label: 'Apertura emocional' },
  accumulated_distance: { label: 'Distancia acumulada', inverted: true },
  repair_capacity: { label: 'Capacidad de reparación' },
  emotional_dependency: { label: 'Dependencia emocional', inverted: true },
  emotional_awareness_of_partner: { label: 'Conciencia emocional del otro' },
  power_balance: { label: 'Balance de poder' }
}

// ─── ANALYSIS ANIMATION TASKS ───────────────────────────────────────

const ANALYSIS_TASK_GROUPS = [
  {
    label: 'Procesando tus respuestas',
    color: 'violet',
    tasks: [
      { id: 1, text: 'Analizando tu estilo emocional y autopercepción…' },
      { id: 2, text: 'Detectando cómo ves a tu pareja y qué proyectas…' },
      { id: 3, text: 'Mapeando el origen y la evolución del vínculo…' },
      { id: 4, text: 'Evaluando la calidad de la conexión positiva…' },
    ]
  },
  {
    label: 'Detectando patrones de apego',
    color: 'blue',
    tasks: [
      { id: 5, text: 'Analizando necesidades emocionales profundas…' },
      { id: 6, text: 'Detectando dinámicas de distancia y cercanía…' },
      { id: 7, text: 'Identificando patrones de conflicto repetitivos…' },
      { id: 8, text: 'Evaluando capacidad de apoyo emocional mutuo…' },
    ]
  },
  {
    label: 'Leyendo entre líneas',
    color: 'fuchsia',
    tasks: [
      { id: 9, text: 'Analizando lo que no se dice en la relación…' },
      { id: 10, text: 'Detectando mecanismos de defensa activos…' },
      { id: 11, text: 'Identificando ciclos relacionales dominantes…' },
      { id: 12, text: 'Evaluando sensibilidades emocionales activadas…' },
    ]
  },
  {
    label: 'Construyendo tu diagnóstico',
    color: 'pink',
    tasks: [
      { id: 13, text: 'Calculando indicadores de compatibilidad…' },
      { id: 14, text: 'Generando perfil radar y barras de análisis…' },
      { id: 15, text: 'Clasificando tipo de relación dominante…' },
      { id: 16, text: 'Integrando todas las dimensiones del diagnóstico…' },
    ]
  }
]

const ALL_ANALYSIS_TASKS = ANALYSIS_TASK_GROUPS.flatMap(g => g.tasks)
const TASK_DURATIONS_MS = [5200, 5400, 4800, 6000, 5600, 5000, 6200, 5400, 4600, 5800, 5200, 6100, 5400, 7000, 5200, 6300]

// ─── DISCOUNT CODES ────────────────────────────────────────────────

const DISCOUNT_CODES = {
  'AMIGO30': { discount: 0.30, label: '30% de descuento' },
  'PAREJA25': { discount: 0.25, label: '25% de descuento' },
  'RELACION20': { discount: 0.20, label: '20% de descuento' },
  'LUISPRO': { discount: 1.0, label: 'Acceso gratuito (código profesional)' }
}

const PRODUCT_PRICE = 349

// ─── HELPER COMPONENTS ──────────────────────────────────────────────

function renderBold(text) {
  if (!text) return null
  return text.split(/\*\*(.*?)\*\*/g).map((part, i) =>
    i % 2 === 1 ? <strong key={i} className="font-semibold text-white/85">{part}</strong> : part
  )
}

function parseItemTitle(text) {
  if (!text) return { title: null, description: text }
  const match = text.match(/^\*\*(.+?)\*\*:?\s*(.*)$/s)
  if (match) return { title: match[1], description: match[2] }
  return { title: null, description: text }
}

function getLevelPct(pct) {
  if (pct <= 25) return { label: 'Muy bajo', color: 'text-red-400' }
  if (pct <= 45) return { label: 'Bajo', color: 'text-orange-400' }
  if (pct <= 65) return { label: 'Medio', color: 'text-yellow-400' }
  if (pct <= 80) return { label: 'Alto', color: 'text-emerald-400' }
  return { label: 'Muy alto', color: 'text-cyan-400' }
}

function getBarColor(pct, inverted) {
  const effectivePct = inverted ? (100 - pct) : pct
  if (effectivePct >= 60) return 'from-emerald-500 to-green-400'
  if (effectivePct >= 45) return 'from-amber-500 to-yellow-400'
  return 'from-red-500 to-orange-400'
}

// ─── ANALYZING PROGRESS ──────────────────────────────────────────

function AnalyzingProgress({ isDone, onComplete }) {
  const [completedCount, setCompletedCount] = useState(0)
  const timeoutRef = useRef(null)
  const isDoneRef = useRef(isDone)
  isDoneRef.current = isDone
  const completedCountRef = useRef(0)
  const onCompleteRef = useRef(onComplete)
  onCompleteRef.current = onComplete
  const allTasksDoneRef = useRef(false)

  const tryComplete = useCallback(() => {
    if (allTasksDoneRef.current && isDoneRef.current) {
      timeoutRef.current = setTimeout(() => { onCompleteRef.current?.() }, 400)
    }
  }, [])

  const scheduleNext = useCallback(() => {
    const idx = completedCountRef.current
    if (idx >= ALL_ANALYSIS_TASKS.length) {
      allTasksDoneRef.current = true
      tryComplete()
      return
    }
    const delay = isDoneRef.current ? 160 : TASK_DURATIONS_MS[idx]
    timeoutRef.current = setTimeout(() => {
      completedCountRef.current = idx + 1
      setCompletedCount(idx + 1)
      scheduleNext()
    }, delay)
  }, [tryComplete])

  useEffect(() => {
    scheduleNext()
    return () => { if (timeoutRef.current) clearTimeout(timeoutRef.current) }
  }, [scheduleNext])

  useEffect(() => {
    if (!isDone) return
    if (timeoutRef.current) clearTimeout(timeoutRef.current)
    if (allTasksDoneRef.current) {
      timeoutRef.current = setTimeout(() => { onCompleteRef.current?.() }, 400)
      return
    }
    const fastDrain = () => {
      const idx = completedCountRef.current
      if (idx >= ALL_ANALYSIS_TASKS.length) {
        allTasksDoneRef.current = true
        timeoutRef.current = setTimeout(() => { onCompleteRef.current?.() }, 400)
        return
      }
      completedCountRef.current = idx + 1
      setCompletedCount(idx + 1)
      timeoutRef.current = setTimeout(fastDrain, 160)
    }
    timeoutRef.current = setTimeout(fastDrain, 250)
  }, [isDone])

  return (
    <div className="space-y-4 text-left">
      {ANALYSIS_TASK_GROUPS.map(group => {
        const firstIdx = ALL_ANALYSIS_TASKS.findIndex(t => t.id === group.tasks[0].id)
        const lastIdx = ALL_ANALYSIS_TASKS.findIndex(t => t.id === group.tasks[group.tasks.length - 1].id)
        const allGroupDone = completedCount > lastIdx
        const isGroupActive = !allGroupDone && completedCount >= firstIdx

        const colorStyles = {
          violet: { border: 'border-violet-500/15', label: 'text-violet-300/55', dot: 'bg-violet-400/70', spinner: 'border-t-violet-300/80 border-violet-400/20' },
          blue: { border: 'border-blue-500/15', label: 'text-blue-300/55', dot: 'bg-blue-400/70', spinner: 'border-t-blue-300/80 border-blue-400/20' },
          fuchsia: { border: 'border-fuchsia-500/15', label: 'text-fuchsia-300/55', dot: 'bg-fuchsia-400/70', spinner: 'border-t-fuchsia-300/80 border-fuchsia-400/20' },
          pink: { border: 'border-pink-500/15', label: 'text-pink-300/55', dot: 'bg-pink-400/70', spinner: 'border-t-pink-300/80 border-pink-400/20' },
        }
        const c = colorStyles[group.color]

        return (
          <motion.div key={group.label}
            initial={{ opacity: 0.4 }}
            animate={{ opacity: allGroupDone || isGroupActive ? 1 : 0.35 }}
            transition={{ duration: 0.4 }}
            className={`p-5 rounded-2xl border ${allGroupDone ? 'border-emerald-500/15 bg-emerald-500/[0.02]' : isGroupActive ? `${c.border} bg-white/[0.015]` : 'border-white/5 bg-transparent'}`}>
            <div className="flex items-center gap-2.5 mb-3">
              {allGroupDone ? (
                <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ type: 'spring', stiffness: 300 }}>
                  <Check className="w-3.5 h-3.5 text-emerald-400/70" strokeWidth={2.5} />
                </motion.div>
              ) : isGroupActive ? (
                <motion.div className={`w-2.5 h-2.5 rounded-full ${c.dot}`}
                  animate={{ scale: [1, 1.5, 1], opacity: [0.7, 1, 0.7] }} transition={{ duration: 1.2, repeat: Infinity }} />
              ) : (
                <div className="w-2.5 h-2.5 rounded-full bg-white/12" />
              )}
              <span className={`text-[10px] font-light uppercase tracking-[0.18em] ${allGroupDone ? 'text-emerald-400/60' : isGroupActive ? c.label : 'text-white/20'}`}>
                {group.label}
              </span>
            </div>
            <ul className="space-y-2">
              {group.tasks.map(task => {
                const taskGlobalIdx = ALL_ANALYSIS_TASKS.findIndex(t => t.id === task.id)
                const isTaskDone = taskGlobalIdx < completedCount
                const isTaskCurrent = taskGlobalIdx === completedCount
                return (
                  <motion.li key={task.id} animate={{ opacity: isTaskDone ? 1 : isTaskCurrent ? 0.9 : 0.3 }} transition={{ duration: 0.3 }} className="flex items-center gap-3">
                    <div className="flex-shrink-0 w-5 h-5 flex items-center justify-center">
                      {isTaskDone ? (
                        <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ type: 'spring', stiffness: 350, delay: 0.05 }}>
                          <Check className="w-3.5 h-3.5 text-emerald-400" strokeWidth={2.5} />
                        </motion.div>
                      ) : isTaskCurrent ? (
                        <motion.div className={`w-3.5 h-3.5 rounded-full border-2 ${c.spinner}`}
                          animate={{ rotate: 360 }} transition={{ duration: 0.9, repeat: Infinity, ease: 'linear' }} />
                      ) : (
                        <div className="w-2 h-2 rounded-full bg-white/12 mx-auto" />
                      )}
                    </div>
                    <span className={`text-sm font-light leading-snug ${isTaskDone ? 'text-white/65' : isTaskCurrent ? 'text-white/88' : 'text-white/28'}`}>
                      {task.text}
                    </span>
                  </motion.li>
                )
              })}
            </ul>
          </motion.div>
        )
      })}
    </div>
  )
}

// ─── RADAR CHART SVG ──────────────────────────────────────────────

function RadarChart({ scores }) {
  const keys = Object.keys(RADAR_LABELS)
  const labels = Object.values(RADAR_LABELS)
  const n = keys.length
  const cx = 150, cy = 150, r = 110

  const getPoint = (i, val) => {
    const angle = (Math.PI * 2 * i) / n - Math.PI / 2
    const dist = (val / 100) * r
    return { x: cx + dist * Math.cos(angle), y: cy + dist * Math.sin(angle) }
  }

  const polygon = keys.map((k, i) => {
    const p = getPoint(i, scores[k] || 0)
    return `${p.x},${p.y}`
  }).join(' ')

  return (
    <svg viewBox="0 0 300 300" className="w-full max-w-xs mx-auto">
      {/* Grid circles */}
      {[20, 40, 60, 80, 100].map(level => (
        <circle key={level} cx={cx} cy={cy} r={r * level / 100} fill="none" stroke="rgba(255,255,255,0.06)" strokeWidth={0.5} />
      ))}
      {/* Axis lines */}
      {keys.map((_, i) => {
        const p = getPoint(i, 100)
        return <line key={i} x1={cx} y1={cy} x2={p.x} y2={p.y} stroke="rgba(255,255,255,0.08)" strokeWidth={0.5} />
      })}
      {/* Data polygon */}
      <polygon points={polygon} fill="url(#radarGrad)" stroke="rgba(139,92,246,0.6)" strokeWidth={1.5} />
      <defs>
        <linearGradient id="radarGrad" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="rgba(139,92,246,0.25)" />
          <stop offset="100%" stopColor="rgba(217,70,239,0.15)" />
        </linearGradient>
      </defs>
      {/* Data points */}
      {keys.map((k, i) => {
        const p = getPoint(i, scores[k] || 0)
        return <circle key={k} cx={p.x} cy={p.y} r={3} fill="#a78bfa" />
      })}
      {/* Labels */}
      {keys.map((_, i) => {
        const p = getPoint(i, 125)
        return (
          <text key={i} x={p.x} y={p.y} textAnchor="middle" dominantBaseline="middle" className="fill-white/50 text-[8px] font-light">
            {labels[i]}
          </text>
        )
      })}
    </svg>
  )
}

// ─── MAIN COMPONENT ──────────────────────────────────────────────

const DiagnosticoRelacionalPage = () => {
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()

  // Stages: hero | checkout | instructions | questionnaire | email | analyzing | engagement | results
  const [stage, setStage] = useState('hero')
  const [isPurchased, setIsPurchased] = useState(false)

  // Discount
  const [discountCode, setDiscountCode] = useState('')
  const [appliedDiscount, setAppliedDiscount] = useState(null)
  const [discountError, setDiscountError] = useState('')

  // Questionnaire state
  const [currentQuestion, setCurrentQuestion] = useState(0)
  const [responses, setResponses] = useState({})
  const [email, setEmail] = useState('')
  const [emailSubmitted, setEmailSubmitted] = useState(false)

  // Voice state
  const [uiMode, setUiMode] = useState('voice')
  const [interim, setInterim] = useState('')
  const [recording, setRecording] = useState(false)
  const recognitionRef = useRef(null)

  // AI analysis
  const [aiAnalysis, setAiAnalysis] = useState(null)
  const [aiLoading, setAiLoading] = useState(false)
  const [aiReady, setAiReady] = useState(false)
  const bgAnalysisRef = useRef(null)

  const [pdfGenerating, setPdfGenerating] = useState(false)
  const [resumeDraft, setResumeDraft] = useState(null)

  // Test mode check
  const isTestMode = searchParams.get('test') === 'true' || searchParams.get('demo') === 'true'

  const finalPrice = appliedDiscount
    ? Math.round(PRODUCT_PRICE * (1 - appliedDiscount.discount))
    : PRODUCT_PRICE

  const scrollToTop = useCallback(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }, [])

  // Restore purchase from session
  useEffect(() => {
    if (searchParams.get('purchased') === 'true' || sessionStorage.getItem('diagnostico_relacional_purchased') === 'true') {
      setIsPurchased(true)
    }
  }, [searchParams])

  // Reset voice state when question changes
  useEffect(() => {
    setInterim('')
    if (recording) {
      recognitionRef.current?.stop()
      setRecording(false)
    }
  }, [currentQuestion]) // eslint-disable-line react-hooks/exhaustive-deps

  // Auto-save draft
  useEffect(() => {
    if (stage === 'hero' || stage === 'results' || stage === 'analyzing') return
    try {
      localStorage.setItem('diagnostico_relacional_draft', JSON.stringify({
        stage, currentQuestion, responses, email, isPurchased
      }))
    } catch { /* ignore */ }
  }, [stage, currentQuestion, responses, email, isPurchased])

  // Restore draft
  useEffect(() => {
    try {
      const raw = localStorage.getItem('diagnostico_relacional_draft')
      if (raw) {
        const draft = JSON.parse(raw)
        if (draft && draft.stage && draft.stage !== 'hero' && draft.stage !== 'results') {
          setResumeDraft(draft)
        }
      }
    } catch { /* ignore */ }
  }, [])

  const restoreDraft = useCallback(() => {
    if (!resumeDraft) return
    setStage(resumeDraft.stage)
    setCurrentQuestion(resumeDraft.currentQuestion || 0)
    setResponses(resumeDraft.responses || {})
    setEmail(resumeDraft.email || '')
    setIsPurchased(resumeDraft.isPurchased || false)
    setResumeDraft(null)
  }, [resumeDraft])

  // ─── VOICE TOGGLE ─────────────────────────────────────────

  const toggleMic = useCallback(() => {
    if (recording) {
      recognitionRef.current?.stop()
      setRecording(false)
      setInterim('')
      return
    }
    const SR = window.SpeechRecognition || window.webkitSpeechRecognition
    if (!SR) { setUiMode('text'); return }
    const recognition = new SR()
    recognition.lang = 'es-MX'
    recognition.continuous = true
    recognition.interimResults = true
    recognition.onresult = (e) => {
      let inter = ''
      for (let i = e.resultIndex; i < e.results.length; i++) {
        if (e.results[i].isFinal) {
          const transcript = e.results[i][0].transcript
          setResponses(prev => {
            const qId = QUESTIONS[currentQuestion]?.id
            if (!qId) return prev
            return { ...prev, [qId]: (prev[qId] || '') + ' ' + transcript }
          })
        } else {
          inter += e.results[i][0].transcript
        }
      }
      setInterim(inter)
    }
    recognition.onerror = () => { setRecording(false); setInterim('') }
    recognition.onend = () => { setRecording(false); setInterim('') }
    recognitionRef.current = recognition
    recognition.start()
    setRecording(true)
  }, [recording, currentQuestion])

  // ─── DISCOUNT HANDLING ─────────────────────────────────────

  const handleApplyDiscount = useCallback(() => {
    const code = discountCode.trim().toUpperCase()
    if (DISCOUNT_CODES[code]) {
      setAppliedDiscount(DISCOUNT_CODES[code])
      setDiscountError('')
    } else {
      setDiscountError('Código no válido')
      setAppliedDiscount(null)
    }
  }, [discountCode])

  const handlePurchase = useCallback(() => {
    // In production: trigger Stripe Checkout here
    setIsPurchased(true)
    sessionStorage.setItem('diagnostico_relacional_purchased', 'true')
    setStage('instructions')
    scrollToTop()
  }, [scrollToTop])

  // ─── FIRE BACKGROUND ANALYSIS ───────────────────────────────

  const fireBackgroundAnalysis = useCallback((latestResponses) => {
    if (bgAnalysisRef.current) return
    bgAnalysisRef.current = analyzeDiagnostic({
      responses: latestResponses,
      questions: QUESTIONS,
      analysisMode: 'individual'
    })
    bgAnalysisRef.current.then(result => {
      setAiAnalysis(result)
      setAiReady(true)
      setAiLoading(false)
    }).catch(() => {
      setAiLoading(false)
    })
  }, [])

  const handleRunAIAnalysis = useCallback(() => {
    setStage('analyzing')
    scrollToTop()
    if (bgAnalysisRef.current) return // already fired
    setAiLoading(true)
    fireBackgroundAnalysis(responses)
  }, [scrollToTop, responses, fireBackgroundAnalysis])

  // ─── QUESTION NAVIGATION ──────────────────────────────────

  const handleNext = useCallback(() => {
    if (currentQuestion < QUESTIONS.length - 1) {
      setCurrentQuestion(prev => prev + 1)
      scrollToTop()
    } else {
      // Last question — fire background analysis
      fireBackgroundAnalysis(responses)
      setStage('email')
      scrollToTop()
    }
  }, [currentQuestion, scrollToTop, responses, fireBackgroundAnalysis])

  const handlePrev = useCallback(() => {
    if (currentQuestion > 0) {
      setCurrentQuestion(prev => prev - 1)
      scrollToTop()
    }
  }, [currentQuestion, scrollToTop])

  // Current section info
  const currentQ = QUESTIONS[currentQuestion]
  const currentSectionIdx = SECTIONS.findIndex(s => s.name === currentQ?.section)

  // PDF generation
  const generatePDF = useCallback(() => {
    if (!aiAnalysis) return
    setPdfGenerating(true)
    try {
      const doc = new jsPDF('p', 'mm', 'a4')
      const pw = doc.internal.pageSize.getWidth()
      const m = 15
      let y = 20

      doc.setFontSize(20)
      doc.setTextColor(40, 40, 40)
      doc.text('Diagnóstico Relacional', pw / 2, y, { align: 'center' })
      y += 12

      // Core scores
      if (aiAnalysis.core_scores) {
        doc.setFontSize(13)
        doc.text('Indicadores Principales', m, y); y += 8
        doc.setFontSize(10)
        for (const [key, meta] of Object.entries(CORE_LABELS)) {
          const val = aiAnalysis.core_scores[key] ?? 0
          doc.text(`${meta.label}: ${val}%`, m, y); y += 6
        }
        y += 4
      }

      // Relationship type
      if (aiAnalysis.relationship_type) {
        doc.setFontSize(13)
        doc.text('Tipo de Relación', m, y); y += 8
        doc.setFontSize(10)
        doc.text(aiAnalysis.relationship_type.label || '', m, y); y += 6
        const expLines = doc.splitTextToSize(
          (aiAnalysis.relationship_type.explanation || '').replace(/\*\*/g, ''), pw - m * 2
        )
        doc.setFontSize(9)
        doc.text(expLines, m, y); y += expLines.length * 4.5 + 6
      }

      // Empathic opening
      if (aiAnalysis.empathic_opening) {
        if (y > 230) { doc.addPage(); y = 20 }
        doc.setFontSize(13)
        doc.text('Lo que tu historia reveló', m, y); y += 8
        doc.setFontSize(9)
        const eoLines = doc.splitTextToSize(aiAnalysis.empathic_opening.replace(/\*\*/g, ''), pw - m * 2)
        doc.text(eoLines, m, y); y += eoLines.length * 4.5 + 6
      }

      // Key insight
      if (aiAnalysis.key_insight) {
        if (y > 240) { doc.addPage(); y = 20 }
        doc.setFontSize(13)
        doc.text('Observación Clave', m, y); y += 8
        doc.setFontSize(9)
        const kiLines = doc.splitTextToSize(aiAnalysis.key_insight.replace(/\*\*/g, ''), pw - m * 2)
        doc.text(kiLines, m, y); y += kiLines.length * 4.5 + 6
      }

      // Recommendation
      if (aiAnalysis.recommendation) {
        if (y > 230) { doc.addPage(); y = 20 }
        doc.setFontSize(13)
        doc.text('Recomendación Profesional', m, y); y += 8
        doc.setFontSize(9)
        const recLines = doc.splitTextToSize(aiAnalysis.recommendation.replace(/\*\*/g, ''), pw - m * 2)
        doc.text(recLines, m, y); y += recLines.length * 4.5 + 6
      }

      // Footer
      if (y > 250) { doc.addPage(); y = 20 }
      y += 8
      doc.setFillColor(245, 245, 245)
      doc.roundedRect(m, y, pw - m * 2, 24, 3, 3, 'F')
      doc.setFontSize(10)
      doc.setTextColor(60, 60, 60)
      doc.text('¿Te gustaría profundizar en estos resultados?', pw / 2, y + 8, { align: 'center' })
      doc.setFontSize(9)
      doc.text('Agenda una sesión con Luis Virrueta.', pw / 2, y + 15, { align: 'center' })
      doc.text('luisvirrueta.com  ·  wa.me/527228720520', pw / 2, y + 21, { align: 'center' })

      doc.save('diagnostico-relacional.pdf')
    } finally {
      setPdfGenerating(false)
    }
  }, [aiAnalysis])

  // ─── RENDER ───────────────────────────────────────────────────

  return (
    <div className="min-h-screen bg-black text-white">
      <SEOHead
        title="Diagnóstico Relacional - Luis Virrueta"
        description="Diagnóstico psicológico profundo de tu relación con análisis por IA. 34 preguntas, respuestas por voz, reporte completo con gráficas."
        url="/tienda/diagnostico-relacional"
      />

      <AnimatePresence mode="wait">

        {/* ═══════════════════════════════════════════════════════
            STAGE: HERO — Landing del producto
        ═══════════════════════════════════════════════════════ */}
        {stage === 'hero' && (
          <motion.div key="hero" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="min-h-screen pt-24 lg:pt-28 pb-20 px-6 relative overflow-hidden">
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
              <div className="absolute top-1/4 left-1/4 w-[500px] h-[500px] bg-violet-600/8 rounded-full blur-3xl" />
              <div className="absolute bottom-1/4 right-1/4 w-[400px] h-[400px] bg-fuchsia-600/6 rounded-full blur-3xl" />
            </div>

            <div className="relative z-10 max-w-5xl mx-auto">
              {/* Title */}
              <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8 }}
                className="text-center mb-12">
                <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-violet-500/20 bg-violet-500/5 mb-6">
                  <Brain className="w-4 h-4 text-violet-400/60" />
                  <span className="text-violet-300/60 text-xs font-light uppercase tracking-wider">Diagnóstico con IA</span>
                </div>
                <h1 className="text-4xl sm:text-5xl lg:text-6xl font-light text-white leading-tight mb-6"
                  style={{ letterSpacing: '0.02em' }}>
                  Diagnóstico Relacional<br />
                  <span className="text-transparent bg-clip-text bg-gradient-to-r from-violet-400 to-fuchsia-400">Profundo</span>
                </h1>
                <p className="text-lg sm:text-xl text-white/50 font-light max-w-2xl mx-auto leading-relaxed">
                  34 preguntas por voz · Análisis psicológico con IA ·<br />
                  Reporte completo con gráficas radar, barras y perfil descargable
                </p>
              </motion.div>

              {/* Badges */}
              <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}
                className="flex flex-wrap justify-center gap-3 mb-12">
                {[
                  { icon: Clock, text: '~30 min' },
                  { icon: Mic, text: 'Responde con voz' },
                  { icon: BarChart3, text: '14+ indicadores' },
                  { icon: Download, text: 'PDF descargable' }
                ].map((b, i) => (
                  <div key={i} className="flex items-center gap-2 px-4 py-2 rounded-full border border-white/10 bg-white/[0.03]">
                    <b.icon className="w-3.5 h-3.5 text-white/40" strokeWidth={1.5} />
                    <span className="text-white/50 text-sm font-light">{b.text}</span>
                  </div>
                ))}
              </motion.div>

              {/* Report preview */}
              <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }}
                className="max-w-3xl mx-auto mb-16">
                <div className="rounded-2xl border border-white/10 bg-zinc-900/50 p-6 lg:p-8">
                  <p className="text-white/30 text-xs uppercase tracking-wider mb-4">Así se ve tu reporte</p>

                  {/* Mini radar + core scores preview */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                    {/* Radar preview */}
                    <div className="flex flex-col items-center">
                      <svg viewBox="0 0 200 200" className="w-40 h-40 opacity-60">
                        {[20, 40, 60, 80, 100].map(l => (
                          <circle key={l} cx={100} cy={100} r={l * 0.8} fill="none" stroke="rgba(255,255,255,0.06)" strokeWidth={0.5} />
                        ))}
                        <polygon points="145,60 155,115 130,160 70,160 45,115 55,60" fill="rgba(139,92,246,0.15)" stroke="rgba(139,92,246,0.4)" strokeWidth={1} />
                      </svg>
                      <p className="text-white/25 text-[10px] mt-2">Radar de 6 dimensiones</p>
                    </div>
                    {/* Core scores preview */}
                    <div className="space-y-3">
                      {[
                        { label: 'Compatibilidad', val: 72, color: 'from-emerald-500 to-green-400' },
                        { label: 'Estabilidad', val: 58, color: 'from-amber-500 to-yellow-400' },
                        { label: 'Riesgo de erosión', val: 35, color: 'from-red-500 to-orange-400' },
                        { label: 'Reconexión', val: 65, color: 'from-violet-500 to-fuchsia-400' }
                      ].map((s, i) => (
                        <div key={i}>
                          <div className="flex justify-between text-xs mb-1">
                            <span className="text-white/35 font-light">{s.label}</span>
                            <span className="text-white/25 font-light">{s.val}%</span>
                          </div>
                          <div className="h-1.5 bg-white/5 rounded-full overflow-hidden">
                            <div className={`h-full bg-gradient-to-r ${s.color} rounded-full opacity-50`} style={{ width: `${s.val}%` }} />
                          </div>
                        </div>
                      ))}
                      <p className="text-white/25 text-[10px] mt-2">4 indicadores principales</p>
                    </div>
                  </div>

                  {/* Blurred text preview */}
                  <div className="mt-6 p-4 rounded-xl bg-white/[0.02] border border-white/5">
                    <p className="text-white/10 text-sm font-light leading-relaxed blur-[3px] select-none">
                      Lo que tus respuestas revelan es un patrón donde la necesidad de cercanía emocional choca con el miedo a ser vulnerable. Este ciclo genera momentos de conexión genuina alternados con distancia...
                    </p>
                    <p className="text-white/30 text-xs font-light mt-2 text-center">Este contenido se genera a partir de TUS respuestas</p>
                  </div>
                </div>
              </motion.div>

              {/* 10 sections grid */}
              <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.6 }}
                className="max-w-4xl mx-auto mb-16">
                <h2 className="text-center text-white/35 text-sm uppercase tracking-wider mb-6">10 dimensiones que evaluamos</h2>
                <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
                  {SECTIONS.map((s, i) => {
                    const Icon = s.icon
                    return (
                      <div key={i} className="p-3 rounded-xl border border-white/8 bg-white/[0.02] text-center">
                        <Icon className="w-5 h-5 text-white/30 mx-auto mb-2" strokeWidth={1.5} />
                        <p className="text-white/50 text-xs font-light">{s.name}</p>
                      </div>
                    )
                  })}
                </div>
              </motion.div>

              {/* Pricing CTA */}
              <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.8 }}
                className="text-center">
                <div className="inline-block p-8 rounded-2xl border border-violet-500/20 bg-violet-500/5">
                  <p className="text-3xl font-light text-white mb-2">${PRODUCT_PRICE} <span className="text-lg text-white/40">MXN</span></p>
                  <p className="text-white/40 text-sm font-light mb-6">Acceso inmediato · Reporte descargable</p>
                  <motion.button
                    onClick={() => { setStage('checkout'); scrollToTop() }}
                    whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}
                    className="px-8 py-4 rounded-xl bg-gradient-to-r from-violet-600 to-fuchsia-600 text-white font-light text-lg hover:from-violet-500 hover:to-fuchsia-500 transition-all">
                    Comenzar diagnóstico
                  </motion.button>
                  {resumeDraft && (
                    <button onClick={restoreDraft} className="block mx-auto mt-4 text-violet-300/40 text-xs hover:text-violet-300/70 underline underline-offset-4 transition-colors">
                      Continuar diagnóstico en progreso
                    </button>
                  )}
                </div>
              </motion.div>
            </div>
          </motion.div>
        )}

        {/* ═══════════════════════════════════════════════════════
            STAGE: CHECKOUT
        ═══════════════════════════════════════════════════════ */}
        {stage === 'checkout' && (
          <motion.div key="checkout" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="min-h-screen flex items-center justify-center px-6 py-20">
            <div className="max-w-md w-full space-y-8">
              <div className="text-center">
                <CreditCard className="w-10 h-10 text-violet-400/50 mx-auto mb-4" />
                <h2 className="text-2xl font-light text-white mb-2">Accede a tu diagnóstico</h2>
                <p className="text-white/40 text-sm font-light">34 preguntas · Análisis con IA · Reporte descargable</p>
              </div>

              {/* Discount code */}
              <div className="p-6 rounded-2xl border border-white/10 bg-white/[0.02] space-y-4">
                <div className="flex items-center gap-2">
                  <Tag className="w-4 h-4 text-white/30" />
                  <span className="text-white/50 text-sm font-light">¿Tienes un código?</span>
                </div>
                <div className="flex gap-2">
                  <input
                    type="text" value={discountCode}
                    onChange={e => { setDiscountCode(e.target.value); setDiscountError('') }}
                    placeholder="Código de descuento"
                    className="flex-1 px-4 py-3 bg-white/[0.04] border border-white/10 rounded-xl text-white text-sm font-light placeholder:text-white/20 focus:border-violet-400/30 focus:outline-none transition-colors"
                  />
                  <button onClick={handleApplyDiscount}
                    className="px-4 py-3 bg-violet-500/15 border border-violet-500/20 rounded-xl text-violet-300/70 text-sm hover:bg-violet-500/25 transition-colors">
                    Aplicar
                  </button>
                </div>
                {discountError && <p className="text-red-400/70 text-xs">{discountError}</p>}
                {appliedDiscount && (
                  <motion.div initial={{ opacity: 0, y: -5 }} animate={{ opacity: 1, y: 0 }}
                    className="flex items-center gap-2 p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/20">
                    <Check className="w-4 h-4 text-emerald-400" />
                    <span className="text-emerald-300 text-sm font-light">{appliedDiscount.label}</span>
                  </motion.div>
                )}
              </div>

              {/* Price summary */}
              <div className="p-6 rounded-2xl border border-white/10 bg-white/[0.02]">
                <div className="flex items-center justify-between mb-4">
                  <span className="text-white/60 font-light">Diagnóstico Relacional</span>
                  <span className={`text-white/80 font-light ${appliedDiscount ? 'line-through text-white/30' : ''}`}>${PRODUCT_PRICE} MXN</span>
                </div>
                {appliedDiscount && (
                  <div className="flex items-center justify-between mb-4">
                    <span className="text-emerald-400/70 font-light text-sm">{appliedDiscount.label}</span>
                    <span className="text-emerald-400 font-light">-${PRODUCT_PRICE - finalPrice} MXN</span>
                  </div>
                )}
                <div className="flex items-center justify-between pt-4 border-t border-white/10">
                  <span className="text-white font-light">Total</span>
                  <span className="text-2xl font-light text-white">{finalPrice === 0 ? 'Gratis' : `$${finalPrice} MXN`}</span>
                </div>
              </div>

              {/* CTA */}
              <motion.button onClick={handlePurchase} whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}
                className="w-full py-4 rounded-xl bg-gradient-to-r from-violet-600 to-fuchsia-600 text-white font-light text-lg hover:from-violet-500 hover:to-fuchsia-500 transition-all">
                {finalPrice === 0 ? 'Acceder gratis' : `Pagar $${finalPrice} MXN`}
              </motion.button>

              <button onClick={() => { setStage('hero'); scrollToTop() }}
                className="block mx-auto text-white/25 text-xs hover:text-white/50 transition-colors">
                Volver
              </button>
            </div>
          </motion.div>
        )}

        {/* ═══════════════════════════════════════════════════════
            STAGE: INSTRUCTIONS
        ═══════════════════════════════════════════════════════ */}
        {stage === 'instructions' && (
          <motion.div key="instructions" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="min-h-screen flex items-center justify-center px-6 py-20">
            <div className="max-w-lg w-full text-center space-y-8">
              <motion.div initial={{ scale: 0.8 }} animate={{ scale: 1 }} transition={{ type: 'spring', stiffness: 200 }}>
                <Mic className="w-16 h-16 text-violet-400/40 mx-auto mb-4" />
              </motion.div>
              <h2 className="text-2xl lg:text-3xl font-light text-white">Antes de empezar</h2>
              <div className="space-y-4 text-left">
                {[
                  { icon: Mic, text: 'Responde con el micrófono (o escribe si prefieres)' },
                  { icon: Clock, text: '34 preguntas · ~30 minutos' },
                  { icon: Brain, text: 'No hay respuestas correctas — habla con libertad' },
                  { icon: Shield, text: 'Tus respuestas se procesan con IA y nunca se comparten' },
                  { icon: FileText, text: 'Al final recibirás un reporte completo descargable' }
                ].map((item, i) => (
                  <motion.div key={i} initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.2 + i * 0.1 }} className="flex items-start gap-4 p-4 rounded-xl border border-white/8 bg-white/[0.02]">
                    <item.icon className="w-5 h-5 text-violet-400/50 flex-shrink-0 mt-0.5" strokeWidth={1.5} />
                    <span className="text-white/60 font-light text-sm">{item.text}</span>
                  </motion.div>
                ))}
              </div>
              <motion.button onClick={() => { setStage('questionnaire'); scrollToTop() }}
                whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}
                className="px-8 py-4 rounded-xl bg-gradient-to-r from-violet-600 to-fuchsia-600 text-white font-light text-lg">
                Comenzar <ArrowRight className="inline w-5 h-5 ml-2" />
              </motion.button>
            </div>
          </motion.div>
        )}

        {/* ═══════════════════════════════════════════════════════
            STAGE: QUESTIONNAIRE (34 voice-first questions)
        ═══════════════════════════════════════════════════════ */}
        {stage === 'questionnaire' && (
          <motion.div key="questionnaire" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="min-h-screen flex flex-col pt-24 lg:pt-28 pb-20 px-6">
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
              <div className="absolute top-1/3 left-1/3 w-96 h-96 bg-violet-600/5 rounded-full blur-3xl" />
              <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-fuchsia-600/5 rounded-full blur-3xl" />
            </div>

            {/* Progress bar */}
            <div className="fixed top-0 left-0 right-0 z-50 h-1 bg-white/5">
              <motion.div className="h-full bg-gradient-to-r from-violet-500 to-fuchsia-400"
                initial={{ width: 0 }} animate={{ width: `${Math.round(((currentQuestion + 1) / QUESTIONS.length) * 100)}%` }}
                transition={{ duration: 0.4, ease: 'easeOut' }} />
            </div>

            <div className="max-w-2xl mx-auto w-full flex-1 flex flex-col justify-center relative z-10">
              {/* Section + counter */}
              <div className="flex flex-col items-center mb-6">
                <div className="flex items-center gap-2 px-3 py-1 rounded-full border border-violet-500/15 bg-violet-500/5 mb-2">
                  {currentSectionIdx >= 0 && (() => {
                    const Icon = SECTIONS[currentSectionIdx].icon
                    return <Icon className="w-3 h-3 text-violet-400/60" strokeWidth={1.5} />
                  })()}
                  <span className="text-violet-300/50 text-[10px] font-light uppercase tracking-[0.15em]">{currentQ?.section}</span>
                </div>
                <span className="text-white/25 text-sm font-light tracking-wider">
                  {currentQuestion + 1} / {QUESTIONS.length}
                </span>
              </div>

              <AnimatePresence mode="wait">
                <motion.div key={currentQuestion} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }} transition={{ duration: 0.4 }}>

                  <h3 className="text-2xl lg:text-3xl font-light text-white/90 leading-relaxed mb-8 tracking-wide font-display">
                    {currentQ?.text}
                  </h3>

                  {/* VOICE MODE */}
                  {uiMode === 'voice' && (
                    <div className="flex flex-col items-center py-2">
                      <motion.button type="button" onClick={toggleMic}
                        whileHover={{ scale: 1.06 }} whileTap={{ scale: 0.94 }}
                        className={`relative w-20 h-20 rounded-full border-2 flex items-center justify-center transition-all duration-300 mb-4 ${
                          recording
                            ? 'border-red-400/50 bg-red-500/15 text-red-300'
                            : 'border-violet-500/40 bg-violet-500/10 text-violet-300 hover:border-violet-400/60 hover:bg-violet-500/20'
                        }`}>
                        {recording && (
                          <motion.div className="absolute inset-0 rounded-full border border-red-400/20"
                            animate={{ scale: [1, 1.35, 1], opacity: [0.4, 0, 0.4] }}
                            transition={{ duration: 1.5, repeat: Infinity }} />
                        )}
                        {recording ? <MicOff className="w-8 h-8" strokeWidth={1.5} /> : <Mic className="w-8 h-8" strokeWidth={1.5} />}
                      </motion.button>

                      {!recording && !responses[currentQ?.id]?.trim() && (
                        <p className="text-white/35 text-sm font-light text-center mb-2">Toca el micrófono para hablar</p>
                      )}
                      {recording && (
                        <p className="text-red-300/60 text-sm font-light animate-pulse text-center mb-2">Escuchando... toca para pausar</p>
                      )}

                      {/* Live transcript */}
                      {(responses[currentQ?.id]?.trim() || interim) && (
                        <motion.div initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }}
                          className="w-full mt-4 p-5 rounded-2xl border border-white/8 bg-white/[0.02] text-left">
                          <p className="text-white/82 text-lg font-light leading-relaxed">
                            {responses[currentQ?.id] || ''}
                            {interim && <span className="text-white/30 italic"> {interim}</span>}
                          </p>
                        </motion.div>
                      )}

                      {/* Actions when text exists */}
                      {responses[currentQ?.id]?.trim() && !recording && (
                        <div className="flex items-center gap-3 mt-5">
                          <button onClick={toggleMic}
                            className="flex items-center gap-1.5 px-4 py-2 rounded-full border border-violet-500/20 text-violet-300/60 text-xs uppercase tracking-wider hover:border-violet-400/35 hover:text-violet-300/90 transition-all">
                            <Mic className="w-3 h-3" /> Agregar más
                          </button>
                          <motion.button whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}
                            onClick={handleNext}
                            className="flex items-center gap-2 px-5 py-2 rounded-full bg-gradient-to-r from-violet-500/80 to-fuchsia-500/80 text-white text-xs uppercase tracking-wider hover:from-violet-500 hover:to-fuchsia-500 transition-all">
                            {currentQuestion < QUESTIONS.length - 1 ? 'Siguiente' : 'Continuar'}
                            <ArrowRight className="w-3.5 h-3.5" />
                          </motion.button>
                        </div>
                      )}

                      {/* Skip & sample */}
                      {!responses[currentQ?.id]?.trim() && !recording && (
                        <div className="flex items-center gap-4 mt-4">
                          <button onClick={handleNext}
                            className="text-white/20 text-xs hover:text-white/40 tracking-wider transition-colors">
                            OMITIR
                          </button>
                          {isTestMode && currentQ?.sample && (
                            <button
                              onClick={() => {
                                setResponses(prev => ({ ...prev, [currentQ.id]: currentQ.sample }))
                                setTimeout(handleNext, 350)
                              }}
                              className="flex items-center gap-1.5 text-amber-400/50 text-[10px] hover:text-amber-400/80 tracking-wider transition-colors border border-amber-400/20 rounded-full px-2.5 py-1 hover:border-amber-400/40">
                              ► Muestra
                            </button>
                          )}
                        </div>
                      )}

                      <button onClick={() => setUiMode('text')}
                        className="mt-5 text-white/22 text-xs hover:text-white/50 transition-colors underline underline-offset-4">
                        Prefiero escribir
                      </button>
                    </div>
                  )}

                  {/* TEXT MODE */}
                  {uiMode === 'text' && (
                    <div>
                      <textarea
                        value={responses[currentQ?.id] || ''}
                        onChange={(e) => setResponses(prev => ({ ...prev, [currentQ.id]: e.target.value }))}
                        placeholder="Escribe aquí con libertad..."
                        maxLength={800}
                        className="w-full h-40 p-5 bg-white/[0.03] border border-violet-500/15 rounded-2xl text-white/85 text-base font-light placeholder:text-white/20 focus:border-violet-400/30 focus:outline-none resize-none transition-colors leading-relaxed"
                      />
                      <div className="flex items-center justify-between mt-2">
                        <div className="flex items-center gap-3">
                          <button onClick={() => setUiMode('voice')}
                            className="flex items-center gap-1.5 text-violet-300/40 text-xs hover:text-violet-300/70 transition-colors">
                            <Mic className="w-3 h-3" /> Usar micrófono
                          </button>
                          {isTestMode && currentQ?.sample && !(responses[currentQ?.id] || '').trim() && (
                            <button
                              onClick={() => setResponses(prev => ({ ...prev, [currentQ.id]: currentQ.sample }))}
                              className="text-amber-400/50 text-[10px] hover:text-amber-400/80 transition-colors border border-amber-400/20 rounded-full px-2.5 py-1 hover:border-amber-400/40">
                              ► Muestra
                            </button>
                          )}
                        </div>
                        <span className="text-white/15 text-[10px] font-extralight">
                          {(responses[currentQ?.id] || '').length}/800
                        </span>
                      </div>
                    </div>
                  )}
                </motion.div>
              </AnimatePresence>

              {/* Nav row */}
              <div className="flex items-center justify-between mt-8 pt-6 border-t border-white/5">
                <button onClick={handlePrev} disabled={currentQuestion === 0}
                  className="flex items-center gap-2 text-white/30 hover:text-white/60 text-xs tracking-wider disabled:opacity-20 disabled:cursor-not-allowed transition-colors">
                  <ArrowLeft className="w-3.5 h-3.5" /> ANTERIOR
                </button>
                {uiMode === 'text' && (
                  <button onClick={handleNext}
                    className="flex items-center gap-2 text-violet-300/60 hover:text-violet-300/90 text-xs tracking-wider transition-colors">
                    {currentQuestion < QUESTIONS.length - 1 ? 'SIGUIENTE' : 'CONTINUAR'}
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                )}
              </div>
            </div>
          </motion.div>
        )}

        {/* ═══════════════════════════════════════════════════════
            STAGE: EMAIL
        ═══════════════════════════════════════════════════════ */}
        {stage === 'email' && (
          <motion.div key="email" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="min-h-screen flex items-center justify-center px-6">
            <div className="max-w-md w-full text-center space-y-6">
              <Mail className="w-10 h-10 text-violet-400/40 mx-auto" />
              <h3 className="text-2xl font-light text-white">¿Dónde enviamos tu reporte?</h3>
              <p className="text-white/40 text-sm font-light">Tu diagnóstico incluye gráficas y análisis detallado</p>
              <input type="email" value={email} onChange={e => setEmail(e.target.value)}
                placeholder="tu@email.com"
                className="w-full px-5 py-4 bg-white/[0.04] border border-white/10 rounded-xl text-white text-center font-light placeholder:text-white/20 focus:border-violet-400/30 focus:outline-none transition-colors" />
              <div className="flex flex-col gap-3">
                <motion.button onClick={() => { setEmailSubmitted(true); handleRunAIAnalysis() }}
                  disabled={!email.includes('@')}
                  whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}
                  className="w-full py-4 rounded-xl bg-gradient-to-r from-violet-600 to-fuchsia-600 text-white font-light disabled:opacity-40 disabled:cursor-not-allowed">
                  <Send className="inline w-4 h-4 mr-2" /> Generar mi diagnóstico
                </motion.button>
                <button onClick={handleRunAIAnalysis}
                  className="text-white/25 text-xs hover:text-white/50 transition-colors">
                  Continuar sin email
                </button>
              </div>
            </div>
          </motion.div>
        )}

        {/* ═══════════════════════════════════════════════════════
            STAGE: ANALYZING (animated progress)
        ═══════════════════════════════════════════════════════ */}
        {stage === 'analyzing' && (
          <motion.div key="analyzing" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="min-h-screen flex items-center justify-center px-6 relative">
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
              <div className="absolute top-1/3 left-1/4 w-96 h-96 bg-violet-600/6 rounded-full blur-3xl animate-pulse" />
              <div className="absolute bottom-1/4 right-1/3 w-80 h-80 bg-fuchsia-600/4 rounded-full blur-3xl animate-pulse" />
            </div>
            <div className="relative z-10 max-w-md w-full">
              <div className="text-center mb-8">
                <Brain className="w-10 h-10 text-violet-400/40 mx-auto mb-3" />
                <h3 className="text-xl font-light text-white/80 mb-1">Analizando tu relación</h3>
                <p className="text-white/30 text-xs font-light">Esto puede tomar unos minutos</p>
              </div>
              <AnalyzingProgress isDone={aiReady} onComplete={() => { setStage('engagement'); scrollToTop() }} />
            </div>
          </motion.div>
        )}

        {/* ═══════════════════════════════════════════════════════
            STAGE: ENGAGEMENT (pre-results)
        ═══════════════════════════════════════════════════════ */}
        {stage === 'engagement' && (
          <motion.div key="engagement" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="min-h-screen flex items-center justify-center px-6 relative">
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
              <div className="absolute top-1/3 left-1/4 w-96 h-96 bg-emerald-600/5 rounded-full blur-3xl" />
            </div>
            <div className="relative z-10 max-w-md w-full text-center space-y-8">
              <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ type: 'spring', stiffness: 200 }}>
                <div className="mx-auto w-20 h-20 rounded-full bg-gradient-to-br from-emerald-400/15 to-violet-400/15 border border-emerald-400/20 flex items-center justify-center">
                  <CheckCircle className="w-10 h-10 text-emerald-400/70" strokeWidth={1.5} />
                </div>
              </motion.div>
              <div>
                <h3 className="text-2xl font-light text-white mb-3">Tu diagnóstico está listo</h3>
                <p className="text-white/40 text-sm font-light leading-relaxed">
                  Hemos cruzado tus 34 respuestas para construir un mapa completo de tu relación.
                </p>
              </div>
              <motion.button onClick={() => { setStage('results'); scrollToTop() }}
                whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}
                className="px-8 py-4 rounded-xl bg-gradient-to-r from-violet-600 to-fuchsia-600 text-white font-light text-lg">
                Ver mi diagnóstico <ArrowRight className="inline w-5 h-5 ml-2" />
              </motion.button>
            </div>
          </motion.div>
        )}

        {/* ═══════════════════════════════════════════════════════
            STAGE: RESULTS
        ═══════════════════════════════════════════════════════ */}
        {stage === 'results' && aiAnalysis && (
          <motion.div key="results" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="min-h-screen pt-24 lg:pt-28 pb-20 px-6">
            <div className="max-w-4xl mx-auto space-y-12">

              {/* Header */}
              <div className="text-center">
                <h1 className="text-3xl lg:text-4xl font-light text-white mb-3">Tu Diagnóstico Relacional</h1>
                <p className="text-white/40 text-sm font-light">Generado con inteligencia artificial a partir de tus 34 respuestas</p>
              </div>

              {/* Relationship Type */}
              {aiAnalysis.relationship_type && (
                <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}
                  className="p-6 lg:p-8 rounded-2xl border border-violet-500/20 bg-gradient-to-br from-violet-500/5 to-fuchsia-500/5 text-center">
                  <p className="text-white/30 text-xs uppercase tracking-wider mb-2">Tipo de relación detectado</p>
                  <h2 className="text-2xl lg:text-3xl font-light text-white mb-4">{aiAnalysis.relationship_type.label}</h2>
                  {aiAnalysis.relationship_type.explanation && (
                    <div className="text-white/55 text-sm font-light leading-relaxed max-w-2xl mx-auto space-y-3">
                      {aiAnalysis.relationship_type.explanation.split('\n\n').map((p, i) => (
                        <p key={i}>{renderBold(p)}</p>
                      ))}
                    </div>
                  )}
                </motion.div>
              )}

              {/* Core Scores */}
              {aiAnalysis.core_scores && (
                <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
                  <h2 className="text-xl font-light text-white/70 mb-6 text-center">Indicadores Principales</h2>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {Object.entries(CORE_LABELS).map(([key, meta]) => {
                      const val = aiAnalysis.core_scores[key] ?? 0
                      const level = getLevelPct(meta.inverted ? (100 - val) : val)
                      const Icon = meta.icon
                      return (
                        <div key={key} className="p-5 rounded-2xl border border-white/8 bg-white/[0.02]">
                          <div className="flex items-center gap-3 mb-3">
                            <Icon className="w-5 h-5 text-violet-400/50" strokeWidth={1.5} />
                            <span className="text-white/60 font-light text-sm">{meta.label}</span>
                          </div>
                          <div className="flex items-end justify-between mb-2">
                            <span className="text-3xl font-light text-white">{val}%</span>
                            <span className={`text-xs font-light ${level.color}`}>{level.label}</span>
                          </div>
                          <div className="h-2 bg-white/5 rounded-full overflow-hidden">
                            <motion.div initial={{ width: 0 }} animate={{ width: `${val}%` }} transition={{ duration: 1, delay: 0.3 }}
                              className={`h-full bg-gradient-to-r ${getBarColor(val, meta.inverted)} rounded-full`} />
                          </div>
                        </div>
                      )
                    })}
                  </div>
                </motion.div>
              )}

              {/* Radar Chart */}
              {aiAnalysis.radar_scores && (
                <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}>
                  <h2 className="text-xl font-light text-white/70 mb-6 text-center">Radar Relacional</h2>
                  <div className="p-6 rounded-2xl border border-white/8 bg-white/[0.02]">
                    <RadarChart scores={aiAnalysis.radar_scores} />
                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 mt-6">
                      {Object.entries(RADAR_LABELS).map(([key, label]) => {
                        const val = aiAnalysis.radar_scores[key] ?? 0
                        return (
                          <div key={key} className="text-center">
                            <p className="text-white/40 text-xs font-light mb-1">{label}</p>
                            <p className="text-white/80 text-lg font-light">{val}%</p>
                          </div>
                        )
                      })}
                    </div>
                  </div>
                </motion.div>
              )}

              {/* Profile Bars */}
              {aiAnalysis.profile_scores && (
                <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }}>
                  <h2 className="text-xl font-light text-white/70 mb-6 text-center">Perfil Emocional</h2>
                  <div className="space-y-4">
                    {Object.entries(PROFILE_LABELS).map(([key, meta]) => {
                      const val = aiAnalysis.profile_scores[key] ?? 0
                      const level = getLevelPct(meta.inverted ? (100 - val) : val)
                      return (
                        <div key={key} className="p-4 rounded-xl border border-white/8 bg-white/[0.02]">
                          <div className="flex items-center justify-between mb-2">
                            <span className="text-white/55 text-sm font-light">{meta.label}</span>
                            <span className={`text-xs font-light ${level.color}`}>{val}% · {level.label}</span>
                          </div>
                          <div className="h-1.5 bg-white/5 rounded-full overflow-hidden">
                            <motion.div initial={{ width: 0 }} animate={{ width: `${val}%` }} transition={{ duration: 0.8, delay: 0.2 }}
                              className={`h-full bg-gradient-to-r ${getBarColor(val, meta.inverted)} rounded-full`} />
                          </div>
                        </div>
                      )
                    })}
                  </div>
                </motion.div>
              )}

              {/* Empathic Opening */}
              {aiAnalysis.empathic_opening && (
                <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5 }}
                  className="p-6 lg:p-8 rounded-2xl border border-violet-500/10 bg-violet-500/[0.03]">
                  <h2 className="text-xl font-light text-white/70 mb-4">Lo que tu historia reveló</h2>
                  <div className="text-white/60 text-sm font-light leading-relaxed space-y-3">
                    {aiAnalysis.empathic_opening.split('\n\n').map((p, i) => (
                      <p key={i}>{renderBold(p)}</p>
                    ))}
                  </div>
                </motion.div>
              )}

              {/* Individual Insights */}
              {aiAnalysis.individual_insights && (
                <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.6 }}>
                  <h2 className="text-xl font-light text-white/70 mb-6 text-center">Tu Perfil Relacional</h2>
                  <div className="space-y-4">
                    {[
                      { key: 'emotional_style', label: 'Estilo emocional', icon: Heart },
                      { key: 'attachment_patterns', label: 'Patrones de apego', icon: Users },
                      { key: 'defense_mechanisms', label: 'Mecanismos de defensa', icon: Shield },
                      { key: 'what_they_seek_in_love', label: 'Lo que buscas en el amor', icon: Sparkles },
                      { key: 'emotional_triggers', label: 'Detonantes emocionales', icon: Zap },
                      { key: 'repeating_patterns', label: 'Patrones que se repiten', icon: Activity },
                      { key: 'hidden_needs', label: 'Necesidades ocultas', icon: Eye },
                      { key: 'role_in_relationship', label: 'Tu rol en la relación', icon: Target },
                      { key: 'likely_relational_attractor', label: 'Atractor relacional', icon: Brain }
                    ].map(({ key, label, icon: Icon }) => {
                      const text = aiAnalysis.individual_insights[key]
                      if (!text) return null
                      return (
                        <div key={key} className="p-5 rounded-2xl border border-white/8 bg-white/[0.02]">
                          <div className="flex items-center gap-3 mb-3">
                            <Icon className="w-5 h-5 text-violet-400/40" strokeWidth={1.5} />
                            <h3 className="text-white/70 font-light">{label}</h3>
                          </div>
                          <div className="text-white/55 text-sm font-light leading-relaxed space-y-2">
                            {text.split('\n\n').map((p, i) => (
                              <p key={i}>{renderBold(p)}</p>
                            ))}
                          </div>
                        </div>
                      )
                    })}
                  </div>
                </motion.div>
              )}

              {/* Couple Insights */}
              {aiAnalysis.couple_insights && (
                <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.7 }}>
                  <h2 className="text-xl font-light text-white/70 mb-6 text-center">Dinámica de Pareja</h2>
                  <div className="space-y-4">
                    {[
                      { key: 'real_relationship_dynamic', label: 'Dinámica real de la relación' },
                      { key: 'unconscious_patterns', label: 'Patrones inconscientes' },
                      { key: 'conflict_and_defense', label: 'Conflicto y defensa' },
                      { key: 'distancing_dynamics', label: 'Dinámica de distanciamiento' },
                      { key: 'attachment_and_support', label: 'Apego y apoyo' },
                      { key: 'strengths_of_the_relationship', label: 'Fortalezas de la relación' },
                      { key: 'critical_moments_of_the_bond', label: 'Momentos críticos del vínculo' },
                      { key: 'global_relationship_diagnosis', label: 'Diagnóstico global' }
                    ].map(({ key, label }) => {
                      const text = aiAnalysis.couple_insights[key]
                      if (!text) return null
                      return (
                        <div key={key} className="p-5 rounded-2xl border border-white/8 bg-white/[0.02]">
                          <h3 className="text-white/70 font-light mb-3">{label}</h3>
                          <div className="text-white/55 text-sm font-light leading-relaxed space-y-2">
                            {text.split('\n\n').map((p, i) => (
                              <p key={i}>{renderBold(p)}</p>
                            ))}
                          </div>
                        </div>
                      )
                    })}
                  </div>
                </motion.div>
              )}

              {/* Dominant Cycles */}
              {aiAnalysis.dominant_cycles?.length > 0 && (
                <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.8 }}>
                  <h2 className="text-xl font-light text-white/70 mb-6 text-center">Ciclos Relacionales Dominantes</h2>
                  <div className="space-y-4">
                    {aiAnalysis.dominant_cycles.map((cycle, i) => (
                      <div key={i} className="p-5 rounded-2xl border border-amber-500/15 bg-amber-500/[0.03]">
                        <h3 className="text-amber-300/80 font-light mb-3">{cycle.name}</h3>
                        <div className="text-white/55 text-sm font-light leading-relaxed space-y-2">
                          {(cycle.explanation || '').split('\n\n').map((p, j) => (
                            <p key={j}>{renderBold(p)}</p>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                </motion.div>
              )}

              {/* Emotional Sensitivities */}
              {aiAnalysis.activated_emotional_sensitivities?.length > 0 && (
                <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.9 }}>
                  <h2 className="text-xl font-light text-white/70 mb-6 text-center">Sensibilidades Emocionales Activadas</h2>
                  <div className="space-y-4">
                    {aiAnalysis.activated_emotional_sensitivities.map((sens, i) => (
                      <div key={i} className="p-5 rounded-2xl border border-rose-500/15 bg-rose-500/[0.03]">
                        <h3 className="text-rose-300/80 font-light mb-2">{sens.name}</h3>
                        <p className="text-white/55 text-sm font-light leading-relaxed">{renderBold(sens.description)}</p>
                      </div>
                    ))}
                  </div>
                </motion.div>
              )}

              {/* Key Insight */}
              {aiAnalysis.key_insight && (
                <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 1 }}
                  className="p-6 lg:p-8 rounded-2xl border border-cyan-500/15 bg-cyan-500/[0.03]">
                  <h2 className="text-xl font-light text-white/70 mb-4 flex items-center gap-3">
                    <Zap className="w-5 h-5 text-cyan-400/50" /> Observación Clave
                  </h2>
                  <p className="text-white/60 text-sm font-light leading-relaxed">{renderBold(aiAnalysis.key_insight)}</p>
                </motion.div>
              )}

              {/* Recommendation */}
              {aiAnalysis.recommendation && (
                <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 1.1 }}
                  className="p-6 lg:p-8 rounded-2xl border border-emerald-500/15 bg-emerald-500/[0.03]">
                  <h2 className="text-xl font-light text-white/70 mb-4">Recomendación Profesional</h2>
                  <div className="text-white/60 text-sm font-light leading-relaxed space-y-3">
                    {aiAnalysis.recommendation.split('\n\n').map((p, i) => (
                      <p key={i}>{renderBold(p)}</p>
                    ))}
                  </div>
                </motion.div>
              )}

              {/* Session Work Items */}
              {aiAnalysis.session_work_items?.length > 0 && (
                <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 1.2 }}>
                  <h2 className="text-xl font-light text-white/70 mb-6 text-center">Temas para Sesión</h2>
                  <div className="space-y-3">
                    {aiAnalysis.session_work_items.map((item, i) => {
                      const { title, description } = parseItemTitle(item)
                      return (
                        <div key={i} className="p-4 rounded-xl border border-violet-500/10 bg-violet-500/[0.02]">
                          {title && <p className="text-violet-300/70 font-medium text-sm mb-1">{title}</p>}
                          <p className="text-white/55 text-sm font-light">{description}</p>
                        </div>
                      )
                    })}
                  </div>
                </motion.div>
              )}

              {/* Actions: PDF + WhatsApp + Restart */}
              <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 1.3 }}
                className="flex flex-col sm:flex-row items-center gap-4 justify-center pt-8 border-t border-white/5">
                <motion.button onClick={generatePDF} disabled={pdfGenerating}
                  whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}
                  className="flex items-center gap-2 px-6 py-3 rounded-xl border border-violet-500/20 bg-violet-500/10 text-violet-300/80 text-sm font-light hover:bg-violet-500/20 transition-all disabled:opacity-40">
                  {pdfGenerating ? <Loader2 className="w-4 h-4 animate-spin" /> : <Download className="w-4 h-4" />}
                  Descargar PDF
                </motion.button>
                <motion.button
                  onClick={() => {
                    const msg = `Hola! Acabo de hacer el Diagnóstico Relacional y me gustaría agendar una sesión para profundizar en mis resultados.`
                    window.open(`https://wa.me/527228720520?text=${encodeURIComponent(msg)}`, '_blank')
                  }}
                  whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}
                  className="flex items-center gap-2 px-6 py-3 rounded-xl bg-gradient-to-r from-violet-600 to-fuchsia-600 text-white text-sm font-light">
                  Agendar sesión profesional
                </motion.button>
              </motion.div>

              {/* Back to store */}
              <div className="text-center pt-4">
                <button onClick={() => navigate('/tienda')}
                  className="text-white/25 text-xs hover:text-white/50 transition-colors underline underline-offset-4">
                  Volver a la tienda
                </button>
              </div>

            </div>
          </motion.div>
        )}

      </AnimatePresence>
    </div>
  )
}

export default DiagnosticoRelacionalPage
