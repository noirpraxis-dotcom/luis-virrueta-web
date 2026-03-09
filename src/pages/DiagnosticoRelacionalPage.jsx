import { motion, AnimatePresence } from 'framer-motion'
import { useState, useRef, useMemo, useCallback, useEffect } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import {
  Heart, MessageCircle, Shield, Target, Users, Brain, ArrowRight, ArrowLeft,
  Check, CheckCircle, Clock, FileText, Mail, Send, Download, Sparkles, Eye,
  Lock, Star, Activity, BarChart3, Zap, Layers, CreditCard, Loader2, Tag,
  Mic, MicOff, TrendingUp, TrendingDown, AlertTriangle, Play, ChevronDown,
  XCircle, Volume2, Gift, BookOpen
} from 'lucide-react'
import SEOHead from '../components/SEOHead'
import jsPDF from 'jspdf'
import { analyzeDiagnostic } from '../services/diagnosticRelacionalService'
import { generateAccessToken, PRODUCT_LABELS, DATA_RETENTION_DAYS } from '../utils/accessToken'
import { sendAccessEmails, sendResultsEmail, verifyStripeSession } from '../services/emailApiService'
import { saveProgress, getProgress, savePurchase, saveResults } from '../services/firebaseAuthService'

// ─── CUESTIONARIO: 45 PREGUNTAS EN 8 FASES ────────────────────

const QUESTIONS = [
  // PHASE 0 — IDENTIDAD Y PERCEPCIÓN DE LA RELACIÓN (9 preguntas)
  { id: 'Q1', section: 'Identidad y percepción', text: 'Me describiría a mí mismo(a) como alguien que...', sample: 'Soy alguien que da mucho emocionalmente pero a veces siento que no recibo lo mismo a cambio.' },
  { id: 'Q2', section: 'Identidad y percepción', text: 'Las personas que me conocen suelen decir que yo...', sample: 'Que soy muy entregado pero que a veces me pierdo en el otro y dejo de cuidarme.' },
  { id: 'Q3', section: 'Identidad y percepción', text: 'Yo describiría a mi pareja como...', sample: 'Es fuerte, decidida, pero a veces se cierra emocionalmente cuando hay tensión.' },
  { id: 'Q4', section: 'Identidad y percepción', text: 'Las personas suelen pensar de mi pareja que...', sample: 'Es muy segura de sí misma, pero en realidad tiene muchas inseguridades que nadie ve.' },
  { id: 'Q5', section: 'Identidad y percepción', text: 'Me junté con mi pareja porque...', sample: 'Sentí que me veía de verdad. De una forma que nadie me había visto antes.' },
  { id: 'Q6', section: 'Identidad y percepción', text: 'Con el tiempo me he dado cuenta de que mi pareja...', sample: 'No es exactamente como la imaginaba al principio. Tiene sus propios miedos y limitaciones que no vi.' },
  { id: 'Q7', section: 'Identidad y percepción', text: 'Algo de mi pareja que influye mucho en cómo me siento es que...', sample: 'Cuando está de buenas, todo fluye. Pero cuando se distancia, siento que todo se derrumba.' },
  { id: 'Q11', section: 'Identidad y percepción', text: 'Lo que más me cuesta aceptar de mi pareja es...', sample: 'Que a veces no me demuestra lo que siente y yo necesito esas señales para sentirme seguro.' },
  { id: 'Q14', section: 'Identidad y percepción', text: 'Lo que me llevaría a separarme de mi pareja sería...', sample: 'Sentir que no importo. Que se acabe esa sensación de que me elige cada día.' },

  // PHASE 1 — EXPERIENCIA EMOCIONAL (6 preguntas)
  { id: 'Q15', section: 'Experiencia emocional', text: 'Cuando estamos bien juntos, yo me siento...', sample: 'En paz. Como si todo estuviera en su lugar y no necesitara nada más.' },
  { id: 'Q16', section: 'Experiencia emocional', text: 'Cuando estamos bien juntos, yo soy...', sample: 'Mi mejor versión. Más gracioso, más abierto, más yo.' },
  { id: 'Q17', section: 'Experiencia emocional', text: 'Cuando mi pareja se aleja emocionalmente, yo...', sample: 'Me quedo pensando qué hice mal. Reviso todo lo que dije buscando el error.' },
  { id: 'Q18', section: 'Experiencia emocional', text: 'Cuando mi pareja busca acercarse más a mí, yo tiendo a...', sample: 'Abrirme, pero a veces me asusto un poco. Como si tanta cercanía me pusiera nervioso.' },
  { id: 'Q19', section: 'Experiencia emocional', text: 'Lo que más miedo me da dentro de esta relación es...', sample: 'Que un día se canse de mí. Que se dé cuenta de que no soy suficiente.' },
  { id: 'Q20', section: 'Experiencia emocional', text: 'Para sentirme realmente amado(a) en esta relación necesito...', sample: 'Que me busquen. Que no tenga que adivinar si le importo. Que me lo demuestre sin que yo pregunte.' },

  // PHASE 2 — NARRATIVA DE LA RELACIÓN (6 preguntas)
  { id: 'Q21', section: 'Narrativa de la relación', text: 'El amor debería ser ___ pero en mi relación es...', sample: 'Debería ser tranquilo y seguro, pero en mi relación a veces es una montaña rusa emocional.' },
  { id: 'Q22', section: 'Narrativa de la relación', text: 'Lo que más nos une como pareja es...', sample: 'Los momentos íntimos donde bajamos la guardia y simplemente somos nosotros.' },
  { id: 'Q23', section: 'Narrativa de la relación', text: 'Lo que más nos separa como pareja es...', sample: 'La forma en que manejamos los problemas. Yo quiero hablar y ella quiere esperar.' },
  { id: 'Q24', section: 'Narrativa de la relación', text: 'Si alguien observara nuestra relación desde fuera diría que...', sample: 'Somos una pareja estable, pero no se dan cuenta de lo que pasa cuando estamos solos.' },
  { id: 'Q25', section: 'Narrativa de la relación', text: 'Si nuestra relación fuera una historia, ahora estaría en la parte donde...', sample: 'Los personajes se están preguntando si quieren seguir o empezar algo nuevo.' },
  { id: 'Q26', section: 'Narrativa de la relación', text: 'Si tuviera que explicar por qué mi pareja y yo seguimos juntos, diría que...', sample: 'Porque debajo de todo, hay algo real que ninguno de los dos quiere perder.' },

  // PHASE 3 — DINÁMICA DE CONFLICTO (6 preguntas)
  { id: 'Q27', section: 'Dinámica de conflicto', text: 'Cuando discutimos, normalmente termino sintiéndome...', sample: 'Invisible. Como si no importara lo que digo.' },
  { id: 'Q28', section: 'Dinámica de conflicto', text: 'Después de una discusión yo suelo...', sample: 'Quedarme callado un rato. Necesito procesar antes de hablar de nuevo.' },
  { id: 'Q29', section: 'Dinámica de conflicto', text: 'Cuando mi pareja se enoja conmigo, mi primera reacción suele ser...', sample: 'Callarme. Esperar a que se le pase para poder hablar con calma.' },
  { id: 'Q30', section: 'Dinámica de conflicto', text: 'Cuando aparece un problema entre nosotros, yo tiendo a...', sample: 'Intentar resolverlo rápido, a veces antes de entender realmente qué pasó.' },
  { id: 'Q31', section: 'Dinámica de conflicto', text: 'Algo que suele pasar entre nosotros cuando las cosas se ponen difíciles es que...', sample: 'Yo empiezo a explicar mi punto y ella se cierra. Y mientras más hablo, menos me escucha.' },
  { id: 'Q32', section: 'Dinámica de conflicto', text: 'Cuando nuestra relación empieza a sentirse distante, normalmente es después de que...', sample: 'Hay un conflicto que no se resolvió y los dos pretendemos que no pasó nada.' },

  // PHASE 4 — PROYECCIÓN INCONSCIENTE (6 preguntas)
  { id: 'Q33', section: 'Proyección inconsciente', text: 'Lo que más me molesta de mi pareja es...', sample: 'Que a veces actúa como si nada importara cuando yo estoy mal.' },
  { id: 'Q34', section: 'Proyección inconsciente', text: 'Lo que más admiro de mi pareja es...', sample: 'Su fortaleza. Puede con todo. Aunque a veces la confundo con frialdad.' },
  { id: 'Q35', section: 'Proyección inconsciente', text: 'Lo que nunca le he dicho a mi pareja es...', sample: 'Que a veces me siento solo incluso cuando estamos juntos. No sé cómo decirlo sin que suene a reproche.' },
  { id: 'Q36', section: 'Proyección inconsciente', text: 'Hay partes de mí que mi pareja todavía no conoce, como por ejemplo...', sample: 'Lo mucho que me esfuerzo por mantener todo en calma entre nosotros.' },
  { id: 'Q37', section: 'Proyección inconsciente', text: 'Si pudiera cambiar una sola cosa de nosotros, sería...', sample: 'La forma en que nos quedamos callados después de un problema. Ese silencio pesa más que la pelea.' },
  { id: 'Q38', section: 'Proyección inconsciente', text: 'Lo que más extraño de nosotros es...', sample: 'Cuando nos reíamos de todo. Cuando no había tantas cosas no dichas entre nosotros.' },

  // PHASE 5 — FAMILIA DE ORIGEN (3 preguntas — NUEVA FASE)
  { id: 'Q46', section: 'Familia de origen', text: 'La relación de tus padres se parecía a la tuya en que...', sample: 'Mi papá era igual de distante que mi pareja. Y mi mamá era la que siempre buscaba que todo estuviera bien, como yo.' },
  { id: 'Q47', section: 'Familia de origen', text: 'Algo que aprendiste del amor viendo a tu familia fue...', sample: 'Que el amor duele. Que siempre vas a tener que aguantar cosas. Que si te quejas eres el problema.' },
  { id: 'Q48', section: 'Familia de origen', text: 'Un patrón de tu familia que reconoces en tu relación actual es...', sample: 'El silencio. En mi casa nadie hablaba de lo que sentía. Y en mi relación pasa lo mismo.' },

  // PHASE 6 — INTIMIDAD Y CONEXIÓN FÍSICA (5 preguntas — ampliada)
  { id: 'Q43', section: 'Intimidad y conexión', text: 'En nuestra intimidad física, yo me siento...', sample: 'A veces me siento muy conectada, pero otras es más mecánico. Como que falta ese deseo real, esa conexión más allá de lo físico.' },
  { id: 'Q44', section: 'Intimidad y conexión', text: 'Hay algo en nuestra vida sexual que me gustaría que fuera diferente, como...', sample: 'Me gustaría que fuera más espontáneo. Que no fuera siempre igual. Que hubiera más juego, más exploración.' },
  { id: 'Q45', section: 'Intimidad y conexión', text: 'Si pudiera expresar un deseo o fantasía sin ser juzgado(a), diría que...', sample: 'Me gustaría explorar cosas nuevas juntos. Pero me da miedo que piense algo raro o que se aleje.' },
  { id: 'Q49', section: 'Intimidad y conexión', text: 'Cuando hay cercanía física entre nosotros, emocionalmente yo...', sample: 'A veces me conecto de verdad, pero otras veces me siento lejos. Como si mi cuerpo estuviera ahí pero mi cabeza en otro lado.' },
  { id: 'Q50', section: 'Intimidad y conexión', text: 'Lo que más echo de menos de nuestra intimidad es...', sample: 'La espontaneidad. Antes nos buscábamos con ganas real. Ahora se siente como algo que toca hacer.' },

  // PHASE 7 — ESTRUCTURA PROFUNDA (4 preguntas)
  { id: 'Q39', section: 'Estructura profunda', text: 'Si esta relación terminara mañana, lo que más me dolería sería...', sample: 'Darme cuenta de que no dije todo lo que sentía cuando tuve la oportunidad.' },
  { id: 'Q40', section: 'Estructura profunda', text: 'Si hay algo que siento que se repite una y otra vez entre nosotros es...', sample: 'Que uno se acerca y el otro se aleja. Nunca estamos los dos abiertos al mismo tiempo.' },
  { id: 'Q41', section: 'Estructura profunda', text: 'Cuando nuestra relación está en su mejor momento es porque...', sample: 'No hay presión externa. Cuando somos solo nosotros dos sin estrés ni obligaciones.' },
  { id: 'Q42', section: 'Estructura profunda', text: 'Si esta relación cambiara profundamente mañana, lo primero que sentiría sería...', sample: 'Miedo y esperanza al mismo tiempo. Miedo de perder lo que conozco, esperanza de algo mejor.' }
]

// Section metadata for progress display
const SECTIONS = [
  { name: 'Identidad y percepción', icon: Brain, color: 'violet', count: 9 },
  { name: 'Experiencia emocional', icon: Heart, color: 'rose', count: 6 },
  { name: 'Narrativa de la relación', icon: MessageCircle, color: 'blue', count: 6 },
  { name: 'Dinámica de conflicto', icon: Activity, color: 'red', count: 6 },
  { name: 'Proyección inconsciente', icon: Eye, color: 'fuchsia', count: 6 },
  { name: 'Familia de origen', icon: Users, color: 'orange', count: 3 },
  { name: 'Intimidad y conexión', icon: Heart, color: 'pink', count: 5 },
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

const RADAR_COLORS = ['#8b5cf6', '#3b82f6', '#10b981', '#f59e0b', '#ec4899', '#06b6d4']

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
      { id: 1, text: 'Analizando tu identidad y autopercepción relacional…' },
      { id: 2, text: 'Detectando cómo percibes a tu pareja y qué proyectas…' },
      { id: 3, text: 'Mapeando tu experiencia emocional en la relación…' },
      { id: 4, text: 'Evaluando la narrativa que construyes sobre el vínculo…' },
    ]
  },
  {
    label: 'Detectando patrones de apego',
    color: 'blue',
    tasks: [
      { id: 5, text: 'Analizando dinámicas de conflicto y reacción…' },
      { id: 6, text: 'Detectando proyecciones inconscientes…' },
      { id: 7, text: 'Identificando ciclos de distancia y cercanía…' },
      { id: 8, text: 'Evaluando capacidad de reparación emocional…' },
    ]
  },
  {
    label: 'Leyendo entre líneas',
    color: 'fuchsia',
    tasks: [
      { id: 9, text: 'Analizando lo que no se dice en la relación…' },
      { id: 10, text: 'Detectando mecanismos de defensa activos…' },
      { id: 11, text: 'Identificando sensibilidades emocionales profundas…' },
      { id: 12, text: 'Evaluando la estructura inconsciente del vínculo…' },
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
const TASK_DURATIONS_MS = [6200, 6500, 6000, 7200, 6600, 6000, 7400, 6600, 5800, 7000, 6400, 7300, 6600, 8200, 6400, 7500]

// ─── STRIPE PAYMENT LINKS ──────────────────────────────────────────

const STRIPE_LINKS = {
  individual: 'https://buy.stripe.com/28EfZh73503o5wzaed9AA03',
  pareja: 'https://buy.stripe.com/4gMfZh2MP5nIe35fyx9AA04',
  consulta: 'https://buy.stripe.com/9B64gz4UXeYigbdfyx9AA05'
}

// ─── DISCOUNT CODES ────────────────────────────────────────────────

const DISCOUNT_CODES = {
  'LUISPRO': { discount: 1.0, label: 'Acceso gratuito (código profesional)' }
}

const PRODUCT_PRICE_INDIVIDUAL = 349
const PRODUCT_PRICE_PAREJA = 549
const PRODUCT_PRICE_CONSULTA = 1199
const DEMO_QUESTION_LIMIT = 5

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

// ─── ANALYZING PROGRESS (with post-completion finalizing state) ──────

function AnalyzingProgress({ isDone, onComplete }) {
  const [completedCount, setCompletedCount] = useState(0)
  const [showFinalizing, setShowFinalizing] = useState(false)
  const timeoutRef = useRef(null)
  const isDoneRef = useRef(isDone)
  isDoneRef.current = isDone
  const completedCountRef = useRef(0)
  const onCompleteRef = useRef(onComplete)
  onCompleteRef.current = onComplete
  const allTasksDoneRef = useRef(false)

  const tryComplete = useCallback(() => {
    if (allTasksDoneRef.current && isDoneRef.current) {
      setShowFinalizing(false)
      timeoutRef.current = setTimeout(() => { onCompleteRef.current?.() }, 400)
    }
  }, [])

  const scheduleNext = useCallback(() => {
    const idx = completedCountRef.current
    if (idx >= ALL_ANALYSIS_TASKS.length) {
      allTasksDoneRef.current = true
      if (!isDoneRef.current) setShowFinalizing(true)
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
      setShowFinalizing(false)
      timeoutRef.current = setTimeout(() => { onCompleteRef.current?.() }, 400)
      return
    }
    const fastDrain = () => {
      const idx = completedCountRef.current
      if (idx >= ALL_ANALYSIS_TASKS.length) {
        allTasksDoneRef.current = true
        setShowFinalizing(false)
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

      {/* Post-completion: AI still processing */}
      <AnimatePresence>
        {showFinalizing && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -5 }}
            className="mt-2 p-5 rounded-2xl border border-violet-500/15 bg-violet-500/[0.03] text-center"
          >
            <motion.div
              animate={{ opacity: [0.5, 1, 0.5] }}
              transition={{ duration: 2, repeat: Infinity }}
              className="flex items-center justify-center gap-3"
            >
              <Loader2 className="w-4 h-4 text-violet-400/60 animate-spin" />
              <span className="text-violet-300/60 text-sm font-light">Finalizando tu diagnóstico profundo…</span>
            </motion.div>
            <p className="text-white/20 text-[10px] font-light mt-2">
              El análisis narrativo de 45 respuestas requiere unos momentos adicionales
            </p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

// ─── RADAR CHART SVG (multi-color with legend) ──────────────────────

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
    <div>
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
        {/* Colored segments from center to each edge */}
        {keys.map((k, i) => {
          const p1 = getPoint(i, scores[keys[i]] || 0)
          const p2 = getPoint((i + 1) % n, scores[keys[(i + 1) % n]] || 0)
          return (
            <polygon key={`seg-${i}`}
              points={`${cx},${cy} ${p1.x},${p1.y} ${p2.x},${p2.y}`}
              fill={RADAR_COLORS[i]} fillOpacity={0.12}
              stroke={RADAR_COLORS[i]} strokeOpacity={0.3} strokeWidth={0.8}
            />
          )
        })}
        {/* Data outline */}
        <polygon points={polygon} fill="none" stroke="rgba(255,255,255,0.15)" strokeWidth={0.5} />
        {/* Data points with distinct colors */}
        {keys.map((k, i) => {
          const p = getPoint(i, scores[k] || 0)
          return <circle key={k} cx={p.x} cy={p.y} r={3.5} fill={RADAR_COLORS[i]} />
        })}
        {/* Labels with matching colors */}
        {keys.map((_, i) => {
          const p = getPoint(i, 130)
          return (
            <text key={i} x={p.x} y={p.y} textAnchor="middle" dominantBaseline="middle"
              fill={RADAR_COLORS[i]} className="text-[8px] font-light" fillOpacity={0.85}>
              {labels[i]}
            </text>
          )
        })}
      </svg>
      {/* Color-coded legend */}
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 mt-4">
        {keys.map((key, i) => (
          <div key={key} className="flex items-center gap-2 p-2 rounded-lg border border-white/[0.04] bg-white/[0.01]">
            <div className="w-2.5 h-2.5 rounded-full flex-shrink-0" style={{ backgroundColor: RADAR_COLORS[i] }} />
            <span className="text-white/50 text-[11px] font-light flex-1">{labels[i]}</span>
            <span className="text-white/70 text-[11px] font-light tabular-nums">{scores[key] ?? 0}%</span>
          </div>
        ))}
      </div>
    </div>
  )
}

// ─── MAIN COMPONENT ──────────────────────────────────────────────

const DiagnosticoRelacionalPage = () => {
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()

  // Stages: hero | checkout | thankyou | instructions | questionnaire | email | analyzing | engagement | results
  const [stage, setStage] = useState('hero')
  const [isPurchased, setIsPurchased] = useState(false)
  const [purchaseType, setPurchaseType] = useState(null) // 'individual' | 'pareja' | 'demo'
  const [isDemo, setIsDemo] = useState(false)

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
  const [audioPlaying, setAudioPlaying] = useState(false)
  const recognitionRef = useRef(null)
  const audioRef = useRef(null)
  const currentQuestionRef = useRef(currentQuestion)
  currentQuestionRef.current = currentQuestion

  // AI analysis
  const [aiAnalysis, setAiAnalysis] = useState(null)
  const [aiLoading, setAiLoading] = useState(false)
  const [aiReady, setAiReady] = useState(false)
  const bgAnalysisRef = useRef(null)

  const [pdfGenerating, setPdfGenerating] = useState(false)
  const [expandedInsights, setExpandedInsights] = useState({})
  const toggleInsight = useCallback((key) => setExpandedInsights(prev => ({ ...prev, [key]: !prev[key] })), [])
  const [resumeDraft, setResumeDraft] = useState(null)
  const [showFreeGuide, setShowFreeGuide] = useState(false)

  // Smart email/token flow
  const [thankyouEmails, setThankyouEmails] = useState(['', ''])
  const [emailsSent, setEmailsSent] = useState(false)
  const [sendingEmails, setSendingEmails] = useState(false)
  const [purchaseId, setPurchaseId] = useState(null)
  const [accessToken, setAccessToken] = useState(null)
  const [verifyingPayment, setVerifyingPayment] = useState(false)
  const [autoSendingPdf, setAutoSendingPdf] = useState(false)
  const [pdfAutoSent, setPdfAutoSent] = useState(false)

  // Test/dev mode: URL param OR LUISPRO discount
  const isDevMode = searchParams.get('test') === 'true' || searchParams.get('demo') === 'true' || appliedDiscount?.discount === 1.0

  const scrollToTop = useCallback(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }, [])

  // Restore purchase from session OR handle Stripe redirect
  useEffect(() => {
    const sessionId = searchParams.get('session_id')
    // New: unified Stripe return with session_id — verify via backend
    if (sessionId && !purchaseId) {
      setVerifyingPayment(true)
      setStage('thankyou')
      verifyStripeSession(sessionId).then(data => {
        const type = data.type || 'individual'
        setIsPurchased(true)
        setPurchaseType(type)
        setPurchaseId(sessionId)
        sessionStorage.setItem('diagnostico_relacional_purchased', 'true')
        sessionStorage.setItem('diagnostico_relacional_type', type)
        sessionStorage.setItem('diagnostico_relacional_purchase_id', sessionId)
        if (data.email) setThankyouEmails([data.email, ''])
      }).catch(() => {
        // Fallback: still mark as purchased from type param
        const type = searchParams.get('type') || 'individual'
        setIsPurchased(true)
        setPurchaseType(type)
        setPurchaseId(sessionId)
        sessionStorage.setItem('diagnostico_relacional_purchased', 'true')
        sessionStorage.setItem('diagnostico_relacional_type', type)
      }).finally(() => setVerifyingPayment(false))
      return
    }
    // Legacy: old-style payment_success param
    if (searchParams.get('payment_success') === 'true') {
      setIsPurchased(true)
      const type = searchParams.get('type') || 'individual'
      setPurchaseType(type)
      sessionStorage.setItem('diagnostico_relacional_purchased', 'true')
      sessionStorage.setItem('diagnostico_relacional_type', type)
      setStage('thankyou')
      return
    }
    // Restore from session
    if (searchParams.get('purchased') === 'true' || sessionStorage.getItem('diagnostico_relacional_purchased') === 'true') {
      setIsPurchased(true)
      setPurchaseType(sessionStorage.getItem('diagnostico_relacional_type') || 'individual')
      setPurchaseId(sessionStorage.getItem('diagnostico_relacional_purchase_id') || null)
    }
    // Token-based access from email link
    const token = searchParams.get('token')
    if (token) {
      setAccessToken(token)
      setIsPurchased(true)
      const type = searchParams.get('type') || 'individual'
      setPurchaseType(type)
      sessionStorage.setItem('diagnostico_relacional_purchased', 'true')
      sessionStorage.setItem('diagnostico_relacional_type', type)
      // Check for saved progress
      const savedPurchaseId = searchParams.get('pid')
      if (savedPurchaseId) {
        setPurchaseId(savedPurchaseId)
        getProgress(savedPurchaseId).then(data => {
          if (data && data.currentQuestion > 0) {
            setResumeDraft({ question: data.currentQuestion, responses: data.responses })
          }
          setStage('instructions')
          scrollToTop()
        }).catch(() => {
          setStage('instructions')
          scrollToTop()
        })
      } else {
        setStage('instructions')
        scrollToTop()
      }
    }
  }, [searchParams, scrollToTop, purchaseId])

  // Start mic recording (used by auto-play flow and toggleMic)
  // Track whether user manually stopped recording
  const manualStopRef = useRef(false)

  const startRecordingFn = useCallback(() => {
    const SR = window.SpeechRecognition || window.webkitSpeechRecognition
    if (!SR) { setUiMode('text'); return }
    try { recognitionRef.current?.abort() } catch {}
    manualStopRef.current = false
    const recognition = new SR()
    recognition.lang = 'es-MX'
    recognition.continuous = true
    recognition.interimResults = true
    recognition.maxAlternatives = 1
    recognition.onresult = (e) => {
      let inter = ''
      for (let i = e.resultIndex; i < e.results.length; i++) {
        if (e.results[i].isFinal) {
          const transcript = e.results[i][0].transcript
          setResponses(prev => {
            const qId = QUESTIONS[currentQuestionRef.current]?.id
            if (!qId) return prev
            return { ...prev, [qId]: (prev[qId] || '') + ' ' + transcript }
          })
        } else {
          inter += e.results[i][0].transcript
        }
      }
      setInterim(inter)
    }
    recognition.onerror = (e) => {
      if (e.error === 'no-speech' || e.error === 'aborted') return // don't stop for these
      setRecording(false); setInterim('')
    }
    // Auto-restart if browser ends recognition unexpectedly (silence timeout)
    recognition.onend = () => {
      if (!manualStopRef.current) {
        try { recognition.start() } catch { setRecording(false); setInterim('') }
      } else {
        setRecording(false); setInterim('')
      }
    }
    recognitionRef.current = recognition
    recognition.start()
    setRecording(true)
  }, [])

  const startRecordingRef = useRef(startRecordingFn)
  startRecordingRef.current = startRecordingFn

  // Reset voice state + play question audio when question changes
  useEffect(() => {
    setInterim('')
    if (recognitionRef.current) { manualStopRef.current = true; try { recognitionRef.current.stop() } catch {} }
    setRecording(false)
    if (audioRef.current) { audioRef.current.pause(); audioRef.current = null }
    setAudioPlaying(false)

    // Play pre-recorded question audio
    if (uiMode === 'voice' && stage === 'questionnaire') {
      const qId = QUESTIONS[currentQuestion]?.id
      if (qId) {
        const audio = new Audio(`/audio/diagnostico/${qId}.mp3`)
        audioRef.current = audio
        setAudioPlaying(true)
        audio.onended = () => {
          setAudioPlaying(false)
          // Start mic immediately after audio ends — no delay
          startRecordingRef.current?.()
        }
        audio.onerror = () => setAudioPlaying(false)
        audio.play().catch(() => setAudioPlaying(false))
      }
    }
    return () => { if (audioRef.current) { audioRef.current.pause(); audioRef.current = null } }
  }, [currentQuestion, stage]) // eslint-disable-line react-hooks/exhaustive-deps

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
      manualStopRef.current = true
      recognitionRef.current?.stop()
      setRecording(false)
      setInterim('')
    } else {
      if (audioRef.current) { audioRef.current.pause(); audioRef.current = null; setAudioPlaying(false) }
      startRecordingFn()
    }
  }, [recording, startRecordingFn])

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

  const handlePurchase = useCallback((type) => {
    if (type === 'demo') {
      setIsDemo(true)
      setPurchaseType('demo')
      setStage('instructions')
      scrollToTop()
      return
    }
    if (type === 'free') {
      // LUISPRO code — full free access
      setIsPurchased(true)
      setPurchaseType('individual')
      sessionStorage.setItem('diagnostico_relacional_purchased', 'true')
      sessionStorage.setItem('diagnostico_relacional_type', 'individual')
      setStage('instructions')
      scrollToTop()
      return
    }
    // Stripe Payment Link — redirect to Stripe
    const link = type === 'pareja' ? STRIPE_LINKS.pareja : STRIPE_LINKS.individual
    window.location.href = link
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
    if (bgAnalysisRef.current) return
    setAiLoading(true)
    fireBackgroundAnalysis(responses)
  }, [scrollToTop, responses, fireBackgroundAnalysis])

  // ─── QUESTION NAVIGATION ──────────────────────────────────

  // No longer pre-fire early — wait for ALL 45 answers to ensure complete analysis
  // The analysis launches when user finishes the last question (in handleNext)

  const handleNext = useCallback(() => {
    // Demo mode: limit to DEMO_QUESTION_LIMIT questions
    if (isDemo && !isPurchased && currentQuestion >= DEMO_QUESTION_LIMIT - 1) {
      setStage('checkout')
      scrollToTop()
      return
    }
    // Save progress to Firestore (non-blocking)
    if (purchaseId) {
      saveProgress(purchaseId, {
        currentQuestion: currentQuestion + 1,
        responses,
        email: thankyouEmails[0] || email
      }).catch(() => { /* silent */ })
    }
    if (currentQuestion < QUESTIONS.length - 1) {
      setCurrentQuestion(prev => prev + 1)
      scrollToTop()
    } else {
      fireBackgroundAnalysis(responses)
      setStage('email')
      scrollToTop()
    }
  }, [currentQuestion, scrollToTop, responses, fireBackgroundAnalysis, isDemo, isPurchased, purchaseId, thankyouEmails, email])

  const handlePrev = useCallback(() => {
    if (currentQuestion > 0) {
      setCurrentQuestion(prev => prev - 1)
      scrollToTop()
    }
  }, [currentQuestion, scrollToTop])

  // Current section info
  const currentQ = QUESTIONS[currentQuestion]
  const currentSectionIdx = SECTIONS.findIndex(s => s.name === currentQ?.section)

  // PDF generation — comprehensive report with ALL diagnostic sections
  const generatePDF = useCallback(() => {
    if (!aiAnalysis) return
    setPdfGenerating(true)
    try {
      const doc = new jsPDF('p', 'mm', 'a4')
      const pw = doc.internal.pageSize.getWidth()
      const m = 15
      let y = 20
      const maxW = pw - m * 2
      const checkPage = (needed = 30) => { if (y > 270 - needed) { doc.addPage(); y = 20 } }
      const addTitle = (title) => { checkPage(20); doc.setFontSize(13); doc.setTextColor(40, 40, 40); doc.text(title, m, y); y += 8 }
      const addParagraph = (text) => {
        doc.setFontSize(9); doc.setTextColor(60, 60, 60)
        const lines = doc.splitTextToSize((text || '').replace(/\*\*/g, ''), maxW)
        for (const line of lines) { checkPage(6); doc.text(line, m, y); y += 4.5 }
        y += 3
      }

      // Header
      doc.setFontSize(20); doc.setTextColor(40, 40, 40)
      doc.text('Diagnóstico Relacional', pw / 2, y, { align: 'center' }); y += 6
      doc.setFontSize(9); doc.setTextColor(120, 120, 120)
      doc.text('Generado a partir de 45 respuestas en 8 fases psicológicas', pw / 2, y, { align: 'center' }); y += 12

      // Relationship type
      if (aiAnalysis.relationship_type) {
        addTitle('Tipo de Relación')
        doc.setFontSize(11); doc.setTextColor(80, 50, 120)
        doc.text(aiAnalysis.relationship_type.label || '', m, y); y += 7
        addParagraph(aiAnalysis.relationship_type.explanation)
      }

      // Core scores
      if (aiAnalysis.core_scores) {
        addTitle('Indicadores Principales')
        doc.setFontSize(10)
        for (const [key, meta] of Object.entries(CORE_LABELS)) {
          checkPage(8); const val = aiAnalysis.core_scores[key] ?? 0
          doc.setTextColor(60, 60, 60); doc.text(`${meta.label}: ${val}%`, m, y); y += 6
        }
        y += 4
      }

      // Radar scores
      if (aiAnalysis.radar_scores) {
        addTitle('Radar Relacional')
        doc.setFontSize(10)
        for (const [key, label] of Object.entries(RADAR_LABELS)) {
          checkPage(8); const val = aiAnalysis.radar_scores[key] ?? 0
          doc.setTextColor(60, 60, 60); doc.text(`${label}: ${val}%`, m, y); y += 6
        }
        y += 4
      }

      // Profile scores
      if (aiAnalysis.profile_scores) {
        addTitle('Perfil Emocional')
        doc.setFontSize(10)
        for (const [key, meta] of Object.entries(PROFILE_LABELS)) {
          checkPage(8); const val = aiAnalysis.profile_scores[key] ?? 0
          const healthPct = meta.inverted ? (100 - val) : val
          const badge = meta.inverted ? (healthPct >= 55 ? ' ✓' : ' ⚠') : ''
          doc.setTextColor(60, 60, 60); doc.text(`${meta.label}: ${val}%${badge}`, m, y); y += 6
        }
        y += 4
      }

      // Empathic opening
      if (aiAnalysis.empathic_opening) {
        addTitle('Lo que tu historia reveló')
        addParagraph(aiAnalysis.empathic_opening)
      }

      // Individual insights (9 sections)
      if (aiAnalysis.individual_insights) {
        doc.addPage(); y = 20
        doc.setFontSize(15); doc.setTextColor(40, 40, 40)
        doc.text('Tu Perfil Relacional', pw / 2, y, { align: 'center' }); y += 12
        const insightMap = [
          ['emotional_style', 'Estilo emocional'],
          ['attachment_patterns', 'Patrones de apego'],
          ['defense_mechanisms', 'Mecanismos de defensa'],
          ['what_they_seek_in_love', 'Lo que buscas en el amor'],
          ['emotional_triggers', 'Detonantes emocionales'],
          ['repeating_patterns', 'Patrones que se repiten'],
          ['hidden_needs', 'Necesidades ocultas'],
          ['role_in_relationship', 'Tu rol en la relación'],
          ['likely_relational_attractor', 'Atractor relacional']
        ]
        for (const [key, label] of insightMap) {
          const text = aiAnalysis.individual_insights[key]
          if (!text) continue
          checkPage(20); doc.setFontSize(11); doc.setTextColor(80, 50, 120)
          doc.text(label, m, y); y += 7
          addParagraph(text)
        }
      }

      // Couple insights (8 sections)
      if (aiAnalysis.couple_insights) {
        doc.addPage(); y = 20
        doc.setFontSize(15); doc.setTextColor(40, 40, 40)
        doc.text('Dinámica de Pareja', pw / 2, y, { align: 'center' }); y += 12
        const coupleMap = [
          ['real_relationship_dynamic', 'Dinámica real de la relación'],
          ['unconscious_patterns', 'Patrones inconscientes'],
          ['conflict_and_defense', 'Conflicto y defensa'],
          ['distancing_dynamics', 'Dinámica de distanciamiento'],
          ['attachment_and_support', 'Apego y apoyo'],
          ['strengths_of_the_relationship', 'Fortalezas de la relación'],
          ['critical_moments_of_the_bond', 'Momentos críticos del vínculo'],
          ['global_relationship_diagnosis', 'Diagnóstico global']
        ]
        for (const [key, label] of coupleMap) {
          const text = aiAnalysis.couple_insights[key]
          if (!text) continue
          checkPage(20); doc.setFontSize(11); doc.setTextColor(80, 50, 120)
          doc.text(label, m, y); y += 7
          addParagraph(text)
        }
      }

      // Dominant cycles
      if (aiAnalysis.dominant_cycles?.length > 0) {
        addTitle('Ciclos Relacionales Dominantes')
        for (const cycle of aiAnalysis.dominant_cycles) {
          checkPage(16); doc.setFontSize(10); doc.setTextColor(80, 60, 40)
          doc.text(`• ${cycle.name}`, m, y); y += 6
          addParagraph(cycle.explanation)
        }
      }

      // Emotional sensitivities
      if (aiAnalysis.activated_emotional_sensitivities?.length > 0) {
        addTitle('Sensibilidades Emocionales Activadas')
        for (const sens of aiAnalysis.activated_emotional_sensitivities) {
          checkPage(16); doc.setFontSize(10); doc.setTextColor(120, 40, 60)
          doc.text(`• ${sens.name}`, m, y); y += 6
          addParagraph(sens.description)
        }
      }

      // Key insight
      if (aiAnalysis.key_insight) {
        addTitle('Observación Clave')
        addParagraph(aiAnalysis.key_insight)
      }

      // Recommendation
      if (aiAnalysis.recommendation) {
        addTitle('Recomendación Profesional')
        addParagraph(aiAnalysis.recommendation)
      }

      // Session work items
      if (aiAnalysis.session_work_items?.length > 0) {
        addTitle('Temas para Sesión')
        doc.setFontSize(9); doc.setTextColor(60, 60, 60)
        aiAnalysis.session_work_items.forEach((item, i) => {
          checkPage(10)
          const clean = (item || '').replace(/\*\*/g, '')
          const lines = doc.splitTextToSize(`${i + 1}. ${clean}`, maxW)
          for (const line of lines) { checkPage(6); doc.text(line, m, y); y += 4.5 }
          y += 2
        })
      }

      // Footer
      checkPage(35); y += 8
      doc.setFillColor(245, 245, 245)
      doc.roundedRect(m, y, pw - m * 2, 24, 3, 3, 'F')
      doc.setFontSize(10); doc.setTextColor(60, 60, 60)
      doc.text('¿Te gustaría profundizar en estos resultados?', pw / 2, y + 8, { align: 'center' })
      doc.setFontSize(9)
      doc.text('Agenda una sesión con Luis Virrueta.', pw / 2, y + 15, { align: 'center' })
      doc.text('luisvirrueta.com  ·  wa.me/527228720520', pw / 2, y + 21, { align: 'center' })

      doc.save('diagnostico-relacional.pdf')
      // Return base64 for email sending
      return doc.output('datauristring')
    } finally {
      setPdfGenerating(false)
    }
  }, [aiAnalysis])

  // Auto-send PDF to email when analysis completes
  useEffect(() => {
    if (!aiReady || !aiAnalysis || pdfAutoSent || autoSendingPdf) return
    const recipientEmail = thankyouEmails[0] || email
    if (!recipientEmail?.includes('@') || !purchaseId) return
    setAutoSendingPdf(true)
    // Save results to Firestore
    saveResults(purchaseId, aiAnalysis).catch(() => {})
    // Generate PDF as base64 and send via email (without downloading)
    try {
      const doc = new jsPDF('p', 'mm', 'a4')
      const pw = doc.internal.pageSize.getWidth()
      const m = 15
      let y = 20
      const maxW = pw - m * 2
      const checkPage = (needed = 30) => { if (y > 270 - needed) { doc.addPage(); y = 20 } }
      const addTitle = (title) => { checkPage(20); doc.setFontSize(13); doc.setTextColor(40, 40, 40); doc.text(title, m, y); y += 8 }
      const addParagraph = (text) => {
        doc.setFontSize(9); doc.setTextColor(60, 60, 60)
        const lines = doc.splitTextToSize((text || '').replace(/\*\*/g, ''), maxW)
        for (const line of lines) { checkPage(6); doc.text(line, m, y); y += 4.5 }
        y += 3
      }
      doc.setFontSize(20); doc.setTextColor(40, 40, 40)
      doc.text('Diagnóstico Relacional', pw / 2, y, { align: 'center' }); y += 6
      doc.setFontSize(9); doc.setTextColor(120, 120, 120)
      doc.text('Generado a partir de 45 respuestas en 8 fases psicológicas', pw / 2, y, { align: 'center' }); y += 12
      if (aiAnalysis.relationship_type) {
        addTitle('Tipo de Relación')
        doc.setFontSize(11); doc.setTextColor(80, 50, 120)
        doc.text(aiAnalysis.relationship_type.label || '', m, y); y += 7
        addParagraph(aiAnalysis.relationship_type.explanation)
      }
      if (aiAnalysis.key_insight) { addTitle('Observación Clave'); addParagraph(aiAnalysis.key_insight) }
      if (aiAnalysis.recommendation) { addTitle('Recomendación Profesional'); addParagraph(aiAnalysis.recommendation) }
      checkPage(35); y += 8
      doc.setFillColor(245, 245, 245); doc.roundedRect(m, y, pw - m * 2, 24, 3, 3, 'F')
      doc.setFontSize(10); doc.setTextColor(60, 60, 60)
      doc.text('¿Te gustaría profundizar en estos resultados?', pw / 2, y + 8, { align: 'center' })
      doc.setFontSize(9)
      doc.text('Agenda una sesión con Luis Virrueta.', pw / 2, y + 15, { align: 'center' })
      doc.text('luisvirrueta.com  ·  wa.me/527228720520', pw / 2, y + 21, { align: 'center' })
      const pdfBase64 = doc.output('datauristring')
      const userName = responses[0] || ''
      sendResultsEmail({ email: recipientEmail, purchaseId, pdfBase64, productType: purchaseType, userName })
        .then(() => setPdfAutoSent(true))
        .catch(() => {})
        .finally(() => setAutoSendingPdf(false))
    } catch {
      setAutoSendingPdf(false)
    }
  }, [aiReady, aiAnalysis, pdfAutoSent, autoSendingPdf, thankyouEmails, email, purchaseId, purchaseType])

  // ─── RENDER ───────────────────────────────────────────────────

  return (
    <div className="min-h-screen bg-black text-white">
      <SEOHead
        title="Test de Pareja: Descubre los patrones invisibles de tu relación - Luis Virrueta"
        description="¿Sientes que algo no funciona pero no sabes qué? Habla por micrófono, nuestro algoritmo analiza tus patrones y recibes un reporte profundo con gráficas."
        url="/tienda/diagnostico-relacional"
      />

      <AnimatePresence mode="wait">

        {/* ═══════════════════════════════════════════════════════
            STAGE: HERO — Landing profesional
        ═══════════════════════════════════════════════════════ */}
        {stage === 'hero' && (
          <motion.div key="hero" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="min-h-screen">

            {/* ── VIDEO HEADER — full viewport cinematic ── */}
            <section className="relative h-screen min-h-[600px] flex items-center justify-center overflow-hidden">
              <video autoPlay loop muted playsInline preload="auto"
                className="absolute inset-0 w-full h-full object-cover opacity-45">
                <source src="/TEST PAREJA/TERMOMETRO AMOR.mp4" type="video/mp4" />
              </video>
              <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/30 to-black z-[3] pointer-events-none" />
              <div className="absolute inset-x-0 bottom-0 h-72 bg-gradient-to-t from-black via-black/80 to-transparent z-[5] pointer-events-none" />

              <div className="relative max-w-5xl mx-auto z-10 text-center px-6 lg:px-20">
                <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8 }}>
                  <div className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full border border-white/15 bg-white/[0.06] backdrop-blur-sm mb-8">
                    <Heart className="w-4 h-4 text-violet-400/70" strokeWidth={1.5} />
                    <span className="text-white/60 text-sm font-light uppercase tracking-[0.18em]">Diagnóstico psicológico de pareja</span>
                  </div>
                  <h1 className="text-5xl sm:text-6xl lg:text-7xl font-light text-white leading-[1.1] mb-6"
                    style={{ letterSpacing: '-0.01em', textShadow: '0 0 80px rgba(255,255,255,0.12), 0 10px 40px rgba(168,85,247,0.15)' }}>
                    Termómetro Inconsciente<br />
                    <span className="text-transparent bg-clip-text bg-gradient-to-r from-violet-400 via-fuchsia-400 to-pink-400">de Pareja</span>
                  </h1>
                  <p className="text-lg sm:text-xl lg:text-2xl text-white/55 font-light max-w-3xl mx-auto leading-relaxed mb-4">
                    ¿Sientes que algo cambió en tu relación pero no sabes qué?
                  </p>
                  <p className="text-base sm:text-lg text-white/35 font-light max-w-2xl mx-auto leading-relaxed mb-10">
                    Un test psicológico que escucha lo que no dices. Hablas por micrófono, el algoritmo detecta tus patrones inconscientes y recibes un reporte profesional con lo que realmente está pasando.
                  </p>
                  {/* Early CTA */}
                  <motion.button
                    onClick={() => { setStage('checkout'); scrollToTop() }}
                    whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}
                    className="px-10 py-5 rounded-xl bg-gradient-to-r from-violet-600 to-fuchsia-600 text-white font-light text-lg hover:from-violet-500 hover:to-fuchsia-500 transition-all shadow-lg shadow-violet-600/20">
                    Comenzar mi diagnóstico <ArrowRight className="inline w-5 h-5 ml-2" />
                  </motion.button>
                  {resumeDraft && (
                    <button onClick={restoreDraft} className="block mx-auto mt-4 text-violet-300/40 text-sm hover:text-violet-300/70 underline underline-offset-4 transition-colors">
                      Continuar diagnóstico en progreso
                    </button>
                  )}
                </motion.div>
              </div>
            </section>

            <div className="relative z-10 px-6 lg:px-20 -mt-20">
              <div className="max-w-5xl mx-auto space-y-24 lg:space-y-32">

              {/* ── ¿TE IDENTIFICAS? — luminous emoji cards + image ────── */}
              <motion.div initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
                className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
                <div>
                  <p className="text-white/40 text-sm uppercase tracking-[0.2em] mb-2">¿Te suena familiar?</p>
                  <h2 className="text-2xl lg:text-3xl font-light text-white/80 mb-8 leading-snug">Esto es lo que escuchamos<br />de personas como tú</h2>
                  <div className="space-y-3">
                    {[
                      { emoji: '💬', text: '"Siempre terminamos discutiendo por lo mismo"' },
                      { emoji: '🧊', text: '"Siento que mi pareja se aleja y no sé por qué"' },
                      { emoji: '💔', text: '"Doy mucho pero no siento que recibo lo mismo"' },
                      { emoji: '🤐', text: '"Después de pelear, nadie dice nada y todo queda ahí"' },
                      { emoji: '😶', text: '"A veces me pregunto si realmente nos conocemos"' },
                      { emoji: '😰', text: '"Me da miedo que un día se canse de mí"' }
                    ].map((item, i) => (
                      <motion.div key={i} initial={{ opacity: 0, x: -15 }} whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }} transition={{ delay: i * 0.08 }}
                        className="flex items-center gap-4 p-4 rounded-xl border border-white/[0.08] bg-white/[0.02] hover:bg-white/[0.05] hover:border-violet-500/15 transition-all group">
                        <div className="w-11 h-11 rounded-full bg-gradient-to-br from-violet-500/15 to-fuchsia-500/10 border border-violet-500/20 flex items-center justify-center flex-shrink-0 group-hover:shadow-[0_0_20px_rgba(139,92,246,0.15)] transition-shadow">
                          <span className="text-lg">{item.emoji}</span>
                        </div>
                        <span className="text-white/60 text-base font-light leading-snug">{item.text}</span>
                      </motion.div>
                    ))}
                  </div>
                  <p className="text-white/30 text-base font-light mt-6">Si algo de esto resuena, este test fue diseñado para ti.</p>
                </div>
                <div className="hidden lg:block">
                  <img src="/TEST PAREJA/IMAGEN (2).jpg" alt="Pareja" className="w-full rounded-2xl object-cover aspect-[4/5] opacity-80 shadow-2xl shadow-black/30" loading="lazy" />
                </div>
              </motion.div>

              {/* ── ¿QUÉ DESCUBRIRÁS? — with brain-scan image ─────── */}
              <motion.div initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
                className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
                <div className="hidden lg:block order-1 lg:order-none">
                  <img src="/TEST PAREJA/IMAGEN (3).jpg" alt="Análisis de pareja" className="w-full rounded-2xl object-cover aspect-[4/5] opacity-80 shadow-2xl shadow-black/30" loading="lazy" />
                </div>
                <div>
                  <p className="text-white/40 text-sm uppercase tracking-[0.2em] mb-2">Lo que el test revela</p>
                  <h2 className="text-2xl lg:text-3xl font-light text-white/80 mb-8 leading-snug">Patrones invisibles que<br />ningún test estándar detecta</h2>
                  <div className="space-y-3">
                    {[
                      { icon: Activity, text: 'Los ciclos emocionales que se repiten sin que lo notes', glow: 'from-red-500/15 to-rose-500/10' },
                      { icon: Shield, text: 'Tus mecanismos de defensa y los de tu pareja', glow: 'from-blue-500/15 to-cyan-500/10' },
                      { icon: Users, text: 'Tu estilo de apego: quién se acerca, quién se aleja y por qué', glow: 'from-emerald-500/15 to-teal-500/10' },
                      { icon: Eye, text: 'Necesidades ocultas que nunca has dicho en voz alta', glow: 'from-amber-500/15 to-yellow-500/10' },
                      { icon: Heart, text: 'Tu compatibilidad emocional real — no la que imaginas', glow: 'from-pink-500/15 to-rose-500/10' },
                      { icon: TrendingUp, text: 'Las fortalezas del vínculo y lo que se puede reparar', glow: 'from-violet-500/15 to-purple-500/10' }
                    ].map((b, i) => (
                      <motion.div key={i} initial={{ opacity: 0, x: 15 }} whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }} transition={{ delay: i * 0.08 }}
                        className="flex items-start gap-4 p-4 rounded-xl border border-white/[0.08] bg-white/[0.02] hover:bg-white/[0.04] transition-all group">
                        <div className={`w-11 h-11 rounded-xl bg-gradient-to-br ${b.glow} border border-white/10 flex items-center justify-center flex-shrink-0 group-hover:shadow-[0_0_24px_rgba(139,92,246,0.12)] transition-shadow`}>
                          <b.icon className="w-5 h-5 text-white/50" strokeWidth={1.5} />
                        </div>
                        <span className="text-white/60 text-base font-light leading-snug pt-2">{b.text}</span>
                      </motion.div>
                    ))}
                  </div>
                </div>
              </motion.div>

              {/* ── MID-PAGE CTA ────────────────────────────── */}
              <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
                className="text-center py-4">
                <motion.button
                  onClick={() => { setStage('checkout'); scrollToTop() }}
                  whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}
                  className="px-10 py-5 rounded-xl bg-gradient-to-r from-violet-600 to-fuchsia-600 text-white font-light text-lg hover:from-violet-500 hover:to-fuchsia-500 transition-all shadow-lg shadow-violet-600/20">
                  Quiero comenzar <ArrowRight className="inline w-5 h-5 ml-2" />
                </motion.button>
              </motion.div>

              {/* ── IMAGE GALLERY — professional grid ────────── */}
              <motion.div initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
                <p className="text-center text-white/40 text-sm uppercase tracking-[0.2em] mb-2">Conexión emocional</p>
                <h2 className="text-center text-2xl lg:text-3xl font-light text-white/70 mb-8">Cada relación tiene una historia invisible</h2>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 lg:gap-4">
                  {[4, 5, 6, 7, 8, 9].map(n => (
                    <div key={n} className="group overflow-hidden rounded-2xl aspect-[4/3] relative">
                      <img src={`/TEST PAREJA/IMAGEN (${n}).jpg`} alt={`Pareja ${n}`}
                        className="w-full h-full object-cover opacity-60 group-hover:opacity-85 group-hover:scale-105 transition-all duration-700" loading="lazy" />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                    </div>
                  ))}
                </div>
              </motion.div>

              {/* ── SIMULATED REPORT PREVIEW ─────────────── */}
              <motion.div initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
                <p className="text-center text-white/35 text-sm uppercase tracking-[0.2em] mb-6">Ejemplo de reporte generado</p>

                <div className="rounded-2xl border border-white/[0.08] bg-zinc-950/70 backdrop-blur-sm overflow-hidden">
                  {/* Report header */}
                  <div className="px-6 lg:px-8 pt-6 pb-4 border-b border-white/[0.06]">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-white/30 text-xs uppercase tracking-[0.2em] mb-1">Diagnóstico Relacional</p>
                        <p className="text-white/65 text-xl font-light">Relación con desconexión emocional progresiva</p>
                      </div>
                      <div className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-full border border-amber-500/20 bg-amber-500/[0.06]">
                        <AlertTriangle className="w-3.5 h-3.5 text-amber-400/70" strokeWidth={1.5} />
                        <span className="text-amber-300/60 text-xs font-light">Atención recomendada</span>
                      </div>
                    </div>
                  </div>

                  <div className="px-6 lg:px-8 py-6 space-y-6">
                    {/* Row: Radar + Core scores */}
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                      {/* Radar */}
                      <div className="p-5 rounded-xl border border-white/[0.05] bg-white/[0.01]">
                        <p className="text-white/35 text-xs uppercase tracking-wider mb-3">Radar relacional</p>
                        <svg viewBox="0 0 200 200" className="w-full max-w-[200px] mx-auto">
                          {[20, 40, 60, 80, 100].map(l => (
                            <circle key={l} cx={100} cy={100} r={l * 0.8} fill="none" stroke="rgba(255,255,255,0.04)" strokeWidth={0.5} />
                          ))}
                          {[0, 1, 2, 3, 4, 5].map(i => {
                            const angle = (Math.PI * 2 * i) / 6 - Math.PI / 2
                            return <line key={i} x1={100} y1={100} x2={100 + 80 * Math.cos(angle)} y2={100 + 80 * Math.sin(angle)} stroke="rgba(255,255,255,0.05)" strokeWidth={0.5} />
                          })}
                          <polygon points="148,58 140,125 108,155 58,148 60,95 92,55" fill="rgba(139,92,246,0.12)" stroke="rgba(139,92,246,0.35)" strokeWidth={1} />
                          {[
                            [148, 58], [140, 125], [108, 155], [58, 148], [60, 95], [92, 55]
                          ].map(([x, y], i) => (
                            <circle key={i} cx={x} cy={y} r={2.5} fill={RADAR_COLORS[i]} />
                          ))}
                          {[
                            { label: 'Sincronía', x: 155, y: 48 },
                            { label: 'Comunicación', x: 162, y: 130 },
                            { label: 'Seguridad', x: 108, y: 172 },
                            { label: 'Conflicto', x: 38, y: 160 },
                            { label: 'Balance', x: 30, y: 88 },
                            { label: 'Apoyo', x: 82, y: 42 }
                          ].map((l, i) => (
                            <text key={i} x={l.x} y={l.y} textAnchor="middle" fill={RADAR_COLORS[i]} className="text-[8px] font-light" fillOpacity={0.8}>{l.label}</text>
                          ))}
                        </svg>
                      </div>

                      {/* Core scores + profile bars */}
                      <div className="space-y-4">
                        <div className="p-5 rounded-xl border border-white/[0.05] bg-white/[0.01]">
                          <p className="text-white/35 text-xs uppercase tracking-wider mb-3">Indicadores principales</p>
                          <div className="space-y-3">
                            {[
                              { label: 'Compatibilidad emocional', val: 42, color: 'from-red-500 to-orange-400' },
                              { label: 'Estabilidad relacional', val: 38, color: 'from-red-500 to-orange-400' },
                              { label: 'Riesgo de erosión', val: 71, color: 'from-red-500 to-orange-400' },
                              { label: 'Potencial de reconexión', val: 58, color: 'from-amber-500 to-yellow-400' }
                            ].map((s, i) => (
                              <div key={i}>
                                <div className="flex justify-between text-sm mb-1">
                                  <span className="text-white/45 font-light">{s.label}</span>
                                  <span className="text-white/35 font-light tabular-nums">{s.val}%</span>
                                </div>
                                <div className="h-2 bg-white/[0.04] rounded-full overflow-hidden">
                                  <div className={`h-full bg-gradient-to-r ${s.color} rounded-full opacity-60`} style={{ width: `${s.val}%` }} />
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>

                        <div className="p-5 rounded-xl border border-white/[0.05] bg-white/[0.01]">
                          <p className="text-white/35 text-xs uppercase tracking-wider mb-3">Perfil emocional</p>
                          <div className="space-y-2.5">
                            {[
                              { label: 'Distancia acumulada', val: 74 },
                              { label: 'Dependencia emocional', val: 62 },
                              { label: 'Nivel de fricción', val: 68 },
                              { label: 'Capacidad de reparación', val: 35 }
                            ].map((s, i) => (
                              <div key={i} className="flex items-center gap-3">
                                <span className="text-white/40 text-sm font-light w-44 flex-shrink-0">{s.label}</span>
                                <div className="flex-1 h-1.5 bg-white/[0.04] rounded-full overflow-hidden">
                                  <div className="h-full bg-gradient-to-r from-violet-500/50 to-fuchsia-500/50 rounded-full" style={{ width: `${s.val}%` }} />
                                </div>
                                <span className="text-white/30 text-sm font-light tabular-nums w-10 text-right">{s.val}%</span>
                              </div>
                            ))}
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Simulated insight cards */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <div className="p-5 rounded-xl border border-rose-500/10 bg-rose-500/[0.02]">
                        <p className="text-rose-300/55 text-xs uppercase tracking-wider mb-2">Ciclo dominante detectado</p>
                        <p className="text-white/60 text-base font-light leading-relaxed">
                          Persecución — Retirada: Uno busca cercanía mientras el otro se aleja. Cuanto más insiste uno, más se cierra el otro.
                        </p>
                      </div>
                      <div className="p-5 rounded-xl border border-amber-500/10 bg-amber-500/[0.02]">
                        <p className="text-amber-300/55 text-xs uppercase tracking-wider mb-2">Sensibilidad emocional activa</p>
                        <p className="text-white/60 text-base font-light leading-relaxed">
                          Miedo al abandono emocional: La percepción de distancia se vive como rechazo, activando hipervigilancia afectiva.
                        </p>
                      </div>
                    </div>

                    {/* Blurred narrative preview */}
                    <div className="p-5 rounded-xl border border-white/[0.05] bg-white/[0.01]">
                      <p className="text-white/35 text-xs uppercase tracking-wider mb-3">Análisis narrativo</p>
                      <div className="space-y-2">
                        <p className="text-white/55 text-base font-light leading-relaxed">
                          Lo que tus respuestas revelan es un patrón donde la <strong className="text-white/70 font-medium">necesidad de cercanía emocional</strong> choca con un <strong className="text-white/70 font-medium">mecanismo de protección</strong> que se activa automáticamente ante la vulnerabilidad…
                        </p>
                        <p className="text-white/15 text-base font-light leading-relaxed blur-[4px] select-none">
                          Este ciclo genera una dinámica de aproximación y alejamiento que erosiona la seguridad emocional del vínculo. Cuando uno de los dos se acerca, el otro interpreta esa cercanía como una amenaza a su autonomía y se retrae, lo cual confirma el miedo original de abandono.
                        </p>
                      </div>
                      <p className="text-violet-300/35 text-sm font-light mt-3 text-center">El análisis completo se genera a partir de tus respuestas</p>
                    </div>
                  </div>
                </div>
              </motion.div>

              {/* ── ¿CÓMO FUNCIONA? — bigger professional cards ─────── */}
              <motion.div initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
                <p className="text-center text-white/40 text-sm uppercase tracking-[0.2em] mb-2">El proceso</p>
                <h2 className="text-center text-2xl lg:text-3xl font-light text-white/70 mb-10">Así funciona el diagnóstico</h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-5">
                  {[
                    { icon: Volume2, num: '1', title: 'Escuchas', desc: 'Cada pregunta se lee en voz alta. Solo relájate y escucha.' },
                    { icon: Mic, num: '2', title: 'Hablas', desc: 'Tu micrófono se activa automáticamente. Di lo que sientas, sin filtro.' },
                    { icon: Brain, num: '3', title: 'Analizamos', desc: 'El sistema detecta patrones inconscientes cruzando tus 45 respuestas.' },
                    { icon: BarChart3, num: '4', title: 'Tu reporte', desc: 'Radar emocional, barras de perfil, ciclos y análisis narrativo.' },
                    { icon: Download, num: '5', title: 'Descargas', desc: 'PDF profesional que puedes conservar o llevar a terapia.' }
                  ].map((step, i) => (
                    <motion.div key={i} initial={{ opacity: 0, y: 15 }} whileInView={{ opacity: 1, y: 0 }}
                      viewport={{ once: true }} transition={{ delay: i * 0.08 }}
                      className="p-6 rounded-2xl border border-white/[0.08] bg-white/[0.02] text-center hover:bg-white/[0.04] transition-colors">
                      <div className="w-12 h-12 rounded-full bg-gradient-to-br from-violet-500/15 to-fuchsia-500/10 border border-violet-500/20 flex items-center justify-center mx-auto mb-4">
                        <span className="text-violet-400/70 text-base font-light">{step.num}</span>
                      </div>
                      <step.icon className="w-7 h-7 text-violet-400/50 mx-auto mb-3" strokeWidth={1.5} />
                      <h3 className="text-white/80 text-base font-light mb-2">{step.title}</h3>
                      <p className="text-white/40 text-sm font-light leading-relaxed">{step.desc}</p>
                    </motion.div>
                  ))}
                </div>
              </motion.div>

              {/* ── FASES — stronger copy + image ─────────────────────── */}
              <motion.div initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
                className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
                <div>
                  <p className="text-white/40 text-sm uppercase tracking-[0.2em] mb-2">Las 8 dimensiones</p>
                  <h2 className="text-2xl lg:text-3xl font-light text-white/80 mb-3 leading-snug">No dejamos nada sin explorar</h2>
                  <p className="text-white/35 text-base font-light mb-8 leading-relaxed">Cada fase está diseñada para activar una capa diferente de tu relación — desde lo que proyectas hacia afuera hasta lo que heredaste de tu familia.</p>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {[
                      { emoji: '🪞', name: 'Percepción', desc: 'Cómo te ves, cómo ves a tu pareja y qué no coincide' },
                      { emoji: '💗', name: 'Emociones', desc: 'Qué sientes cuando están bien — y cuando todo se tensa' },
                      { emoji: '📖', name: 'Narrativa', desc: 'La historia que te cuentas sobre tu relación' },
                      { emoji: '⚡', name: 'Conflicto', desc: 'Cómo pelean, qué se activa y qué queda sin resolver' },
                      { emoji: '🔮', name: 'Inconsciente', desc: 'Lo que no dices, lo que proyectas y lo que evitas' },
                      { emoji: '🏠', name: 'Familia de origen', desc: 'Lo que aprendiste del amor en tu casa y lo que repites hoy' },
                      { emoji: '🔥', name: 'Intimidad', desc: 'Conexión física, deseo y vulnerabilidad sexual' },
                      { emoji: '🌊', name: 'Estructura', desc: 'Las bases del vínculo: qué lo sostiene o lo erosiona' }
                    ].map((s, i) => (
                      <motion.div key={i} initial={{ opacity: 0, y: 10 }} whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }} transition={{ delay: i * 0.06 }}
                        className="p-4 rounded-xl border border-white/[0.08] bg-white/[0.02] hover:bg-white/[0.04] transition-colors">
                        <div className="flex items-center gap-3 mb-2">
                          <div className="w-9 h-9 rounded-full bg-gradient-to-br from-violet-500/15 to-fuchsia-500/10 border border-violet-500/15 flex items-center justify-center flex-shrink-0">
                            <span className="text-base">{s.emoji}</span>
                          </div>
                          <h4 className="text-white/70 text-sm font-medium">{s.name}</h4>
                        </div>
                        <p className="text-white/40 text-sm font-light leading-snug pl-12">{s.desc}</p>
                      </motion.div>
                    ))}
                  </div>
                </div>
                <div className="hidden lg:block">
                  <img src="/TEST PAREJA/IMAGEN (10).jpg" alt="Fases del test" className="w-full rounded-2xl object-cover aspect-[4/5] opacity-80 shadow-2xl shadow-black/30" loading="lazy" />
                </div>
              </motion.div>

              {/* ── TESTIMONIALS — professional, with face avatars ── */}
              <motion.div initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
                <p className="text-center text-white/40 text-sm uppercase tracking-[0.2em] mb-2">Testimonios</p>
                <h2 className="text-center text-2xl lg:text-3xl font-light text-white/70 mb-10">Lo que dicen quienes ya lo vivieron</h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
                  {[
                    { name: 'Mariana L.', age: '32 años', rating: 5, text: 'Me hizo ver cosas que llevaba años evitando. Cuando vi el radar de compatibilidad fue como un espejo — todo encajaba. Terminé llorando pero sobre todo entendiendo por qué repito los mismos patrones. Lo llevé a mi siguiente sesión de terapia y fue muy útil para profundizar.', avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&h=100&fit=crop&crop=face' },
                    { name: 'Carlos & Andrea', age: '5 años juntos', rating: 5, text: 'Lo hicimos los dos por separado y luego comparamos reportes. Fue increíble ver las diferencias — lo que yo pensaba que estaba bien, para ella era un problema. Después tomamos una sesión con el psicólogo para que nos ayudara a interpretar todo y fue de las mejores decisiones que hemos tomado juntos.', avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop&crop=face' },
                    { name: 'Sofía R.', age: '28 años', rating: 5, text: 'No pensé que hablar por micrófono fuera a ser tan diferente a escribir. Cuando hablas van saliendo cosas que no tenías planeado decir. Las gráficas y el análisis son impresionantes — se siente como si un psicólogo te hubiera escuchado durante horas.', avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100&h=100&fit=crop&crop=face' },
                    { name: 'Roberto M.', age: '41 años', rating: 5, text: 'Lo que más me impactó fue ver el patrón de "persecución-retirada" que detectó. Es exactamente lo que hago: yo busco y ella se aleja, y mientras más busco, más se cierra. Nunca nadie me lo había explicado así de claro. Ahora estamos trabajándolo juntos en terapia de pareja.', avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop&crop=face' },
                    { name: 'Daniela & Jorge', age: '8 años juntos', rating: 5, text: 'Llevamos 8 años juntos y esto nos reveló dinámicas que ni en terapia habíamos nombrado. El psicólogo usó nuestros reportes como punto de partida para las sesiones y dijo que era el diagnóstico inicial más completo que había visto. Totalmente vale la inversión — especialmente el paquete de pareja.', avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=100&h=100&fit=crop&crop=face' },
                    { name: 'Valentina G.', age: '35 años', rating: 5, text: 'Lo hice sola porque mi pareja no quería. Aun así, el test detectó perfectamente la dinámica entre los dos. Me ayudó a entender mi parte del problema — que yo también contribuyo al ciclo. Después convencí a mi esposo de que lo hiciera y fue un antes y un después.', avatar: 'https://images.unsplash.com/photo-1489424731084-a5d8b219a5bb?w=100&h=100&fit=crop&crop=face' },
                    { name: 'Alejandro P.', age: '38 años', rating: 5, text: 'Yo era escéptico — pensé que era otro cuestionario de internet. Pero cuando vi mi reporte y leí "distancia acumulada: 74%" sentí un golpe en el estómago porque es exactamente lo que llevo sintiendo. Es como una radiografía emocional. Lo recomiendo a cualquier hombre que sienta que algo no está bien.', avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100&h=100&fit=crop&crop=face' },
                    { name: 'Laura & Miguel', age: '3 años juntos', rating: 5, text: 'Hicimos el test una noche cada uno y al día siguiente fuimos a sesión con Luis. Fue de las experiencias más intensas que hemos tenido — por fin pudimos hablar de cosas que teníamos atoradas desde hace meses. El test abre puertas que no sabías que existían.', avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&h=100&fit=crop&crop=face' },
                    { name: 'Fernanda D.', age: '29 años', rating: 5, text: 'Me encantó que cita tus propias palabras en el análisis. Lees algo y dices "sí, yo dije eso" — pero lo conecta con un patrón más grande que no veías. Es como tener un espejo psicológico. Ya se lo recomendé a tres amigas que están pasando por situaciones similares.', avatar: 'https://images.unsplash.com/photo-1531746020798-e6953c6e8e04?w=100&h=100&fit=crop&crop=face' }
                  ].map((t, i) => (
                    <motion.div key={i} initial={{ opacity: 0, y: 15 }} whileInView={{ opacity: 1, y: 0 }}
                      viewport={{ once: true }} transition={{ delay: i * 0.06 }}
                      className="p-6 rounded-2xl border border-white/[0.08] bg-white/[0.02] hover:bg-white/[0.04] transition-colors">
                      <div className="flex items-center gap-3 mb-4">
                        <img src={t.avatar} alt={t.name} className="w-11 h-11 rounded-full object-cover ring-2 ring-violet-500/20" loading="lazy" />
                        <div>
                          <p className="text-white/75 text-sm font-medium">{t.name}</p>
                          <div className="flex items-center gap-2">
                            <div className="flex gap-0.5">
                              {Array.from({ length: t.rating }).map((_, j) => (
                                <Star key={j} className="w-3 h-3 text-amber-400/80 fill-amber-400/80" />
                              ))}
                            </div>
                            <span className="text-white/25 text-xs font-light">{t.age}</span>
                          </div>
                        </div>
                      </div>
                      <p className="text-white/50 text-sm font-light leading-relaxed">"{t.text}"</p>
                    </motion.div>
                  ))}
                </div>
              </motion.div>

              {/* ── PRICING CTA ───────────────────────────── */}
              <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
                className="text-center pb-20">
                <p className="text-white/30 text-sm uppercase tracking-[0.15em] mb-8">Elige tu plan</p>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-5 max-w-4xl mx-auto">
                  {/* Guía Gratuita */}
                  <div className="p-8 rounded-2xl border border-emerald-500/20 bg-gradient-to-br from-emerald-500/[0.04] to-teal-500/[0.02] text-left relative overflow-hidden">
                    <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-emerald-500/40 to-teal-500/40" />
                    <div className="flex items-center gap-2 mb-2">
                      <p className="text-emerald-300/60 text-xs uppercase tracking-[0.15em]">Guía gratuita</p>
                      <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-500/15 border border-emerald-500/20 text-emerald-300/70">Gratis</span>
                    </div>
                    <p className="text-3xl font-light text-white mb-1">$0 <span className="text-lg text-white/35">MXN</span></p>
                    <p className="text-white/30 text-sm font-light mb-5">Descubre qué patrones repites sin darte cuenta</p>
                    <ul className="space-y-2 mb-6">
                      {['Los 5 patrones inconscientes más comunes', 'Señales de alerta que ignoras', 'Test rápido: ¿qué rol juegas en tu relación?', 'Acceso inmediato por email'].map((item, i) => (
                        <li key={i} className="flex items-start gap-2 text-white/45 text-sm font-light">
                          <Check className="w-3.5 h-3.5 text-emerald-400/60 flex-shrink-0 mt-0.5" strokeWidth={2} />
                          {item}
                        </li>
                      ))}
                    </ul>
                    <motion.button
                      onClick={() => setShowFreeGuide(true)}
                      whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}
                      className="w-full py-4 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 text-white font-light text-base hover:from-emerald-500 hover:to-teal-500 transition-all shadow-lg shadow-emerald-600/20">
                      Descargar gratis
                    </motion.button>
                  </div>
                  {/* Individual */}
                  <div className="p-8 rounded-2xl border border-white/[0.1] bg-zinc-950/60 text-left">
                    <p className="text-white/40 text-xs uppercase tracking-[0.15em] mb-2">Individual</p>
                    <p className="text-3xl font-light text-white mb-1">${PRODUCT_PRICE_INDIVIDUAL} <span className="text-lg text-white/35">MXN</span></p>
                    <p className="text-white/30 text-sm font-light mb-5">1 persona · 45 preguntas · Reporte PDF</p>
                    <ul className="space-y-2 mb-6">
                      {['Análisis de tus patrones de apego', 'Radar emocional + perfil completo', 'Ciclos inconscientes detectados', 'Recomendación profesional'].map((item, i) => (
                        <li key={i} className="flex items-start gap-2 text-white/45 text-sm font-light">
                          <Check className="w-3.5 h-3.5 text-violet-400/60 flex-shrink-0 mt-0.5" strokeWidth={2} />
                          {item}
                        </li>
                      ))}
                    </ul>
                    <motion.button
                      onClick={() => { setStage('checkout'); scrollToTop() }}
                      whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}
                      className="w-full py-4 rounded-xl bg-gradient-to-r from-violet-600 to-fuchsia-600 text-white font-light text-base hover:from-violet-500 hover:to-fuchsia-500 transition-all shadow-lg shadow-violet-600/20">
                      Comenzar
                    </motion.button>
                  </div>
                  {/* Pareja */}
                  <div className="p-8 rounded-2xl border border-violet-500/25 bg-gradient-to-br from-violet-500/[0.04] to-fuchsia-500/[0.02] text-left relative overflow-hidden">
                    <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-violet-500/50 to-fuchsia-500/50" />
                    <div className="flex items-center gap-2 mb-2">
                      <p className="text-violet-300/60 text-xs uppercase tracking-[0.15em]">Pareja</p>
                      <span className="text-[10px] px-2 py-0.5 rounded-full bg-violet-500/15 border border-violet-500/20 text-violet-300/70">Recomendado</span>
                    </div>
                    <p className="text-3xl font-light text-white mb-1">${PRODUCT_PRICE_PAREJA} <span className="text-lg text-white/35">MXN</span></p>
                    <p className="text-white/30 text-sm font-light mb-5">2 personas · 45 preguntas cada uno · 2 reportes</p>
                    <ul className="space-y-2 mb-6">
                      {['Todo lo del plan individual ×2', 'Cada uno responde por separado', 'Comparación de patrones cruzados', 'Ideal para llevar a terapia de pareja'].map((item, i) => (
                        <li key={i} className="flex items-start gap-2 text-white/45 text-sm font-light">
                          <Check className="w-3.5 h-3.5 text-violet-400/60 flex-shrink-0 mt-0.5" strokeWidth={2} />
                          {item}
                        </li>
                      ))}
                    </ul>
                    <motion.button
                      onClick={() => { setStage('checkout'); scrollToTop() }}
                      whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}
                      className="w-full py-4 rounded-xl bg-gradient-to-r from-violet-600 to-fuchsia-600 text-white font-light text-base hover:from-violet-500 hover:to-fuchsia-500 transition-all shadow-lg shadow-violet-600/20">
                      Comenzar en pareja
                    </motion.button>
                  </div>
                </div>
                {resumeDraft && (
                  <button onClick={restoreDraft} className="block mx-auto mt-6 text-violet-300/40 text-sm hover:text-violet-300/70 underline underline-offset-4 transition-colors">
                    Continuar diagnóstico en progreso
                  </button>
                )}
                <p className="text-white/20 text-xs font-light mt-5">Diseñado por Luis Virrueta · Psicólogo clínico</p>
              </motion.div>

              </div>
            </div>

          </motion.div>
        )}

        {/* ═══════════════════════════════════════════════════════
            STAGE: CHECKOUT — Stripe Payment Links
        ═══════════════════════════════════════════════════════ */}
        {stage === 'checkout' && (
          <motion.div key="checkout" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="min-h-screen flex items-center justify-center px-6 pt-32 pb-20">
            <div className="max-w-4xl w-full space-y-8">
              <div className="text-center">
                <CreditCard className="w-10 h-10 text-violet-400/50 mx-auto mb-4" />
                <h2 className="text-2xl font-light text-white mb-2">Elige tu plan</h2>
                <p className="text-white/40 text-sm font-light">45 preguntas · Análisis psicológico profundo · Reporte descargable</p>
              </div>

              {/* Pricing Cards */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
                {/* Guía Gratuita */}
                <div className="p-7 rounded-2xl border border-emerald-500/20 bg-gradient-to-br from-emerald-500/[0.04] to-teal-500/[0.02] space-y-5 relative overflow-hidden">
                  <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-emerald-500/40 to-teal-500/40" />
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <p className="text-emerald-300/60 text-xs uppercase tracking-[0.15em]">Guía gratuita</p>
                      <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-500/15 border border-emerald-500/20 text-emerald-300/70">Gratis</span>
                    </div>
                    <p className="text-3xl font-light text-white">$0 <span className="text-lg text-white/35">MXN</span></p>
                    <p className="text-white/30 text-sm font-light mt-1">Patrones que repites sin saberlo</p>
                  </div>
                  <ul className="space-y-2">
                    {['Los 5 patrones inconscientes más comunes', 'Señales de alerta que ignoras', 'Mini-test: tu rol en la relación', 'Acceso inmediato por email'].map((item, i) => (
                      <li key={i} className="flex items-start gap-2 text-white/45 text-sm font-light">
                        <Check className="w-3.5 h-3.5 text-emerald-400/60 flex-shrink-0 mt-0.5" strokeWidth={2} />
                        {item}
                      </li>
                    ))}
                  </ul>
                  <motion.button onClick={() => setShowFreeGuide(true)} whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}
                    className="w-full py-4 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 text-white font-light text-base hover:from-emerald-500 hover:to-teal-500 transition-all">
                    Descargar gratis
                  </motion.button>
                </div>

                {/* Individual */}
                <div className="p-7 rounded-2xl border border-white/10 bg-white/[0.02] space-y-5">
                  <div>
                    <p className="text-white/40 text-xs uppercase tracking-[0.15em] mb-1">Individual</p>
                    <p className="text-3xl font-light text-white">${PRODUCT_PRICE_INDIVIDUAL} <span className="text-lg text-white/35">MXN</span></p>
                    <p className="text-white/30 text-sm font-light mt-1">1 persona · Reporte completo</p>
                  </div>
                  <ul className="space-y-2">
                    {['45 preguntas psicoanalíticas', 'Radar + perfil emocional', 'Ciclos y sensibilidades', 'PDF descargable'].map((item, i) => (
                      <li key={i} className="flex items-start gap-2 text-white/45 text-sm font-light">
                        <Check className="w-3.5 h-3.5 text-emerald-400/60 flex-shrink-0 mt-0.5" strokeWidth={2} />
                        {item}
                      </li>
                    ))}
                  </ul>
                  <motion.button onClick={() => handlePurchase('individual')} whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}
                    className="w-full py-4 rounded-xl bg-gradient-to-r from-violet-600 to-fuchsia-600 text-white font-light text-base hover:from-violet-500 hover:to-fuchsia-500 transition-all">
                    Pagar ${PRODUCT_PRICE_INDIVIDUAL} MXN
                  </motion.button>
                </div>

                {/* Pareja */}
                <div className="p-7 rounded-2xl border border-violet-500/25 bg-gradient-to-br from-violet-500/[0.04] to-fuchsia-500/[0.02] space-y-5 relative overflow-hidden">
                  <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-violet-500/50 to-fuchsia-500/50" />
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <p className="text-violet-300/60 text-xs uppercase tracking-[0.15em]">Pareja</p>
                      <span className="text-[10px] px-2 py-0.5 rounded-full bg-violet-500/15 border border-violet-500/20 text-violet-300/70">Recomendado</span>
                    </div>
                    <p className="text-3xl font-light text-white">${PRODUCT_PRICE_PAREJA} <span className="text-lg text-white/35">MXN</span></p>
                    <p className="text-white/30 text-sm font-light mt-1">2 personas · 2 reportes</p>
                  </div>
                  <ul className="space-y-2">
                    {['Todo lo individual ×2', 'Cada uno responde por separado', 'Comparación cruzada de patrones', 'Ideal para terapia de pareja'].map((item, i) => (
                      <li key={i} className="flex items-start gap-2 text-white/45 text-sm font-light">
                        <Check className="w-3.5 h-3.5 text-emerald-400/60 flex-shrink-0 mt-0.5" strokeWidth={2} />
                        {item}
                      </li>
                    ))}
                  </ul>
                  <motion.button onClick={() => handlePurchase('pareja')} whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}
                    className="w-full py-4 rounded-xl bg-gradient-to-r from-violet-600 to-fuchsia-600 text-white font-light text-base hover:from-violet-500 hover:to-fuchsia-500 transition-all">
                    Pagar ${PRODUCT_PRICE_PAREJA} MXN
                  </motion.button>
                </div>
              </div>

              {/* Discount code */}
              <div className="p-5 rounded-2xl border border-white/10 bg-white/[0.02] space-y-3">
                <div className="flex items-center gap-2">
                  <Tag className="w-4 h-4 text-white/30" />
                  <span className="text-white/50 text-sm font-light">¿Tienes un código de acceso?</span>
                </div>
                <div className="flex gap-2">
                  <input
                    type="text" value={discountCode}
                    onChange={e => { setDiscountCode(e.target.value); setDiscountError('') }}
                    placeholder="Código"
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
                    className="flex items-center justify-between p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/20">
                    <div className="flex items-center gap-2">
                      <Check className="w-4 h-4 text-emerald-400" />
                      <span className="text-emerald-300 text-sm font-light">{appliedDiscount.label}</span>
                    </div>
                    <motion.button onClick={() => handlePurchase('free')} whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}
                      className="px-5 py-2 rounded-lg bg-emerald-500/20 text-emerald-300 text-sm font-light hover:bg-emerald-500/30 transition-colors">
                      Acceder gratis
                    </motion.button>
                  </motion.div>
                )}
              </div>

              {/* Demo option */}
              <div className="text-center space-y-2">
                <button onClick={() => handlePurchase('demo')}
                  className="text-violet-300/40 text-sm hover:text-violet-300/70 transition-colors underline underline-offset-4">
                  Probar demo gratuita ({DEMO_QUESTION_LIMIT} preguntas)
                </button>
                <br />
                <button onClick={() => { setStage('hero'); scrollToTop() }}
                  className="text-white/20 text-xs hover:text-white/40 transition-colors">
                  Volver
                </button>
              </div>
            </div>
          </motion.div>
        )}

        {/* ═══════════════════════════════════════════════════════
            STAGE: THANK YOU (post-Stripe payment)
        ═══════════════════════════════════════════════════════ */}
        {stage === 'thankyou' && (
          <motion.div key="thankyou" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="min-h-screen flex items-center justify-center px-6 pt-28 pb-20 relative">
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
              <div className="absolute top-1/3 left-1/4 w-96 h-96 bg-emerald-600/6 rounded-full blur-3xl animate-pulse" />
              <div className="absolute bottom-1/4 right-1/3 w-80 h-80 bg-violet-600/4 rounded-full blur-3xl animate-pulse" />
            </div>
            <div className="relative z-10 max-w-lg w-full space-y-8">

              {/* Confirmation icon */}
              <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ type: 'spring', stiffness: 200, delay: 0.2 }}
                className="text-center">
                <div className="mx-auto w-24 h-24 rounded-full bg-gradient-to-br from-emerald-400/20 to-violet-400/20 border border-emerald-400/25 flex items-center justify-center">
                  <CheckCircle className="w-12 h-12 text-emerald-400/80" strokeWidth={1.5} />
                </div>
              </motion.div>

              {/* Dynamic product message */}
              <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }}
                className="text-center">
                {verifyingPayment ? (
                  <>
                    <Loader2 className="w-6 h-6 text-violet-400/60 animate-spin mx-auto mb-3" />
                    <p className="text-white/40 text-sm font-light">Verificando tu pago...</p>
                  </>
                ) : (
                  <>
                    <h2 className="text-3xl lg:text-4xl font-light text-white mb-3">¡Gracias por tu compra!</h2>
                    <p className="text-white/50 text-lg font-light leading-relaxed mb-2">
                      Tu acceso al <span className="text-violet-300/80">Termómetro Inconsciente de Pareja</span>{' '}
                      — plan <span className="text-emerald-300/80">{PRODUCT_LABELS[purchaseType] || 'Individual'}</span> — está confirmado.
                    </p>
                  </>
                )}
              </motion.div>

              {/* ── CONSULTA: WhatsApp flow ── */}
              {purchaseType === 'consulta' && !verifyingPayment && (
                <motion.div initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.6 }}
                  className="space-y-5">
                  <div className="p-6 rounded-2xl border border-violet-500/20 bg-violet-500/[0.04] space-y-4 text-center">
                    <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-green-500/15 to-emerald-500/10 border border-green-500/20 flex items-center justify-center mx-auto">
                      <span className="text-2xl">💬</span>
                    </div>
                    <h3 className="text-xl font-light text-white">¡Tu consulta está reservada!</h3>
                    <p className="text-white/45 text-sm font-light leading-relaxed">
                      El siguiente paso es coordinar la fecha y hora de tu sesión con Luis. Da clic en el botón de abajo — llegarás directo a WhatsApp con un mensaje listo para enviar.
                    </p>
                    <motion.a
                      href={`https://wa.me/527228720520?text=${encodeURIComponent('Hola Luis, acabo de comprar una consulta psicológica en luisvirrueta.com. Me gustaría coordinar la fecha y hora de nuestra sesión. ¿Cuándo tienes disponibilidad?')}`}
                      target="_blank" rel="noopener noreferrer"
                      whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}
                      className="inline-flex items-center gap-2 px-8 py-4 rounded-xl bg-gradient-to-r from-green-600 to-emerald-600 text-white font-light text-base hover:from-green-500 hover:to-emerald-500 transition-all shadow-lg shadow-green-600/20">
                      <span className="text-lg">💬</span> Agendar por WhatsApp
                    </motion.a>
                    <p className="text-white/25 text-xs font-light">wa.me/527228720520</p>
                  </div>
                </motion.div>
              )}

              {/* Email collection — Individual / Pareja only */}
              {purchaseType !== 'consulta' && !emailsSent && !verifyingPayment && (
                <motion.div initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.6 }}
                  className="p-6 rounded-2xl border border-white/10 bg-white/[0.02] space-y-5">
                  <div className="text-center">
                    <Mail className="w-8 h-8 text-violet-400/50 mx-auto mb-3" />
                    <h3 className="text-xl font-light text-white mb-1">
                      {purchaseType === 'pareja' ? 'Introduce los emails de ambos' : 'Introduce tu email'}
                    </h3>
                    <p className="text-white/35 text-sm font-light">
                      {purchaseType === 'pareja'
                        ? 'Cada persona recibirá su propio enlace para tomar el test por separado.'
                        : 'Te enviaremos un enlace seguro para acceder a tu test y tus resultados.'}
                    </p>
                  </div>

                  <div className="space-y-3">
                    <div>
                      <label className="text-white/30 text-xs uppercase tracking-wider mb-1.5 block">
                        {purchaseType === 'pareja' ? 'Email — Persona 1' : 'Tu email'}
                      </label>
                      <input type="email" value={thankyouEmails[0]}
                        onChange={e => setThankyouEmails(prev => [e.target.value, prev[1]])}
                        placeholder="email@ejemplo.com"
                        className="w-full px-4 py-4 bg-white/[0.04] border border-white/10 rounded-xl text-white text-sm font-light placeholder:text-white/20 focus:border-violet-400/30 focus:outline-none transition-colors" />
                    </div>
                    {purchaseType === 'pareja' && (
                      <div>
                        <label className="text-white/30 text-xs uppercase tracking-wider mb-1.5 block">Email — Persona 2</label>
                        <input type="email" value={thankyouEmails[1]}
                          onChange={e => setThankyouEmails(prev => [prev[0], e.target.value])}
                          placeholder="email2@ejemplo.com"
                          className="w-full px-4 py-4 bg-white/[0.04] border border-white/10 rounded-xl text-white text-sm font-light placeholder:text-white/20 focus:border-violet-400/30 focus:outline-none transition-colors" />
                      </div>
                    )}
                  </div>

                  <motion.button
                    onClick={async () => {
                      const emails = purchaseType === 'pareja'
                        ? thankyouEmails.filter(e => e.includes('@'))
                        : [thankyouEmails[0]].filter(e => e.includes('@'))
                      if (emails.length === 0) return
                      setSendingEmails(true)
                      try {
                        const tokens = emails.map(() => generateAccessToken())
                        const pid = purchaseId || generateAccessToken()
                        setPurchaseId(pid)
                        sessionStorage.setItem('diagnostico_relacional_purchase_id', pid)
                        // Save purchase to Firestore
                        await savePurchase(pid, { type: purchaseType, email: emails[0], stripeSessionId: purchaseId }).catch(() => {})
                        // Send access emails via backend
                        await sendAccessEmails({ purchaseId: pid, type: purchaseType, emails, tokens }).catch(() => {})
                        setEmailsSent(true)
                        // Also store email for later use
                        setEmail(emails[0])
                        sessionStorage.setItem('diagnostico_guide_email', emails[0])
                      } finally {
                        setSendingEmails(false)
                      }
                    }}
                    disabled={sendingEmails || !thankyouEmails[0]?.includes('@') || (purchaseType === 'pareja' && !thankyouEmails[1]?.includes('@'))}
                    whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}
                    className="w-full py-4 rounded-xl bg-gradient-to-r from-violet-600 to-fuchsia-600 text-white font-light text-base hover:from-violet-500 hover:to-fuchsia-500 transition-all shadow-lg shadow-violet-600/20 disabled:opacity-40 disabled:cursor-not-allowed">
                    {sendingEmails ? (
                      <><Loader2 className="inline w-4 h-4 mr-2 animate-spin" /> Enviando...</>
                    ) : (
                      <><Send className="inline w-4 h-4 mr-2" /> Enviar acceso{purchaseType === 'pareja' ? ' a ambos' : ''}</>
                    )}
                  </motion.button>
                </motion.div>
              )}

              {/* Success: emails sent */}
              {emailsSent && (
                <motion.div initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }}
                  className="p-6 rounded-2xl border border-emerald-500/20 bg-emerald-500/[0.04] space-y-4">
                  <div className="flex items-center gap-3">
                    <Check className="w-5 h-5 text-emerald-400/80" />
                    <p className="text-emerald-300/80 text-base font-light">
                      {purchaseType === 'pareja'
                        ? `¡Enlace enviado a ${thankyouEmails[0]} y ${thankyouEmails[1]}!`
                        : `¡Enlace enviado a ${thankyouEmails[0]}!`}
                    </p>
                  </div>
                  <div className="space-y-2 text-white/40 text-sm font-light">
                    <p>📩 Revisa tu bandeja de entrada (y spam, por si acaso)</p>
                    <p>⏳ Tus datos se almacenarán por <strong className="text-white/60">{DATA_RETENTION_DAYS} días</strong> — descarga tu PDF al finalizar</p>
                    <p>🔄 Si cierras el navegador, puedes continuar desde el enlace del email</p>
                  </div>
                </motion.div>
              )}

              {/* CTA: Start now or wait for email — Individual / Pareja only */}
              {purchaseType !== 'consulta' && (
              <motion.div initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: emailsSent ? 0.3 : 0.8 }}
                className="text-center space-y-4">
                <motion.button
                  onClick={() => { setStage('instructions'); scrollToTop() }}
                  whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}
                  className="px-10 py-5 rounded-xl bg-gradient-to-r from-violet-600 to-fuchsia-600 text-white font-light text-lg hover:from-violet-500 hover:to-fuchsia-500 transition-all shadow-lg shadow-violet-600/20">
                  Comenzar mi diagnóstico ahora <ArrowRight className="inline w-5 h-5 ml-2" />
                </motion.button>
                <p className="text-white/20 text-xs font-light">
                  ~30 minutos · Habla por micrófono · Reporte completo al final
                </p>
                {emailsSent && (
                  <p className="text-white/25 text-xs font-light">
                    También puedes acceder después desde el enlace en tu email
                  </p>
                )}
              </motion.div>
              )}
            </div>
          </motion.div>
        )}

        {/* ═══════════════════════════════════════════════════════
            STAGE: INSTRUCTIONS
        ═══════════════════════════════════════════════════════ */}
        {stage === 'instructions' && (
          <motion.div key="instructions" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="min-h-screen flex items-center justify-center px-6 py-28">
            <div className="max-w-xl w-full space-y-10">
              <div className="text-center">
                <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-violet-500/15 to-fuchsia-500/10 border border-violet-500/20 flex items-center justify-center mx-auto mb-6">
                  <Mic className="w-9 h-9 text-violet-400/50" strokeWidth={1.5} />
                </div>
                <h2 className="text-3xl lg:text-4xl font-light text-white mb-4">Antes de empezar</h2>
                <p className="text-white/45 text-base lg:text-lg font-light leading-relaxed max-w-lg mx-auto">
                  Esto no es un cuestionario con opciones. Es una conversación contigo. Vas a escuchar frases y responder hablando — como platicarías con un psicólogo.
                </p>
              </div>
              <div className="space-y-3">
                {[
                  { icon: Volume2, title: 'Vas a escuchar una voz', desc: 'Cada pregunta se te lee en voz alta. Solo relájate y escucha.' },
                  { icon: Mic, title: 'Tu micrófono se activa solo', desc: 'Cuando termine la pregunta, habla libremente. Di lo primero que venga — no hay respuestas correctas.' },
                  { icon: Lock, title: 'Es 100% privado', desc: 'Nadie más ve tus respuestas. Tu audio no se graba — solo se convierte a texto en tu navegador.' },
                  { icon: Shield, title: 'No se juzga nada', desc: 'No hay respuestas buenas ni malas. Entre más honesto seas, más preciso será el diagnóstico.' },
                  { icon: Clock, title: 'Son ~25-30 minutos', desc: 'Busca un lugar tranquilo y sin interrupciones. Usa audífonos si puedes.' }
                ].map((item, i) => (
                  <motion.div key={i} initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.15 + i * 0.08 }}
                    className="flex items-start gap-4 p-5 rounded-xl border border-white/[0.08] bg-white/[0.02]">
                    <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-violet-500/10 to-fuchsia-500/5 border border-violet-500/15 flex items-center justify-center flex-shrink-0">
                      <item.icon className="w-5 h-5 text-violet-400/60" strokeWidth={1.5} />
                    </div>
                    <div>
                      <h4 className="text-white/75 text-base font-medium mb-1">{item.title}</h4>
                      <p className="text-white/40 text-sm font-light leading-relaxed">{item.desc}</p>
                    </div>
                  </motion.div>
                ))}
              </div>
              <div className="p-5 rounded-xl border border-violet-500/15 bg-violet-500/[0.04]">
                <p className="text-violet-300/50 text-sm font-light leading-relaxed">
                  💡 <strong className="text-violet-300/70">Tip:</strong> Si en algún momento prefieres escribir en vez de hablar, puedes cambiar de modo en cualquier momento. Pero hablar es más rápido y te permite ser más espontáneo — que es lo que queremos.
                </p>
              </div>
              <div className="text-center">
                <motion.button onClick={() => { setStage('questionnaire'); scrollToTop() }}
                  whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}
                  className="px-10 py-5 rounded-xl bg-gradient-to-r from-violet-600 to-fuchsia-600 text-white font-light text-lg shadow-lg shadow-violet-600/15">
                  Estoy listo(a) <ArrowRight className="inline w-5 h-5 ml-2" />
                </motion.button>
              </div>
            </div>
          </motion.div>
        )}

        {/* ═══════════════════════════════════════════════════════
            STAGE: QUESTIONNAIRE (45 voice-first questions)
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

                      {/* Audio playing indicator */}
                      {audioPlaying && (
                        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex flex-col items-center mb-4">
                          <div className="w-16 h-16 rounded-full border-2 border-violet-500/30 bg-violet-500/10 flex items-center justify-center mb-3">
                            <Volume2 className="w-7 h-7 text-violet-400/70" strokeWidth={1.5} />
                          </div>
                          <div className="flex items-center gap-1 h-6 mb-2">
                            {[0, 1, 2, 3, 4].map(i => (
                              <motion.div key={i} className="w-0.5 bg-violet-400/40 rounded-full"
                                animate={{ height: ['4px', '16px', '4px'] }}
                                transition={{ duration: 0.8, repeat: Infinity, delay: i * 0.15, ease: 'easeInOut' }} />
                            ))}
                          </div>
                          <p className="text-violet-300/45 text-sm font-light">Escucha la pregunta...</p>
                        </motion.div>
                      )}

                      {/* Mic area (hidden while audio plays) */}
                      {!audioPlaying && (
                        <>
                          {/* Mic button with reactive gradient effect */}
                          <div className="relative">
                            <motion.button type="button" onClick={toggleMic}
                              whileHover={recording ? {} : { scale: 1.06 }} whileTap={{ scale: 0.94 }}
                              className={`relative w-20 h-20 rounded-full border-2 flex items-center justify-center transition-all duration-300 ${
                                recording
                                  ? 'border-red-400/50 bg-red-500/15 text-red-300'
                                  : 'border-violet-500/40 bg-violet-500/10 text-violet-300 hover:border-violet-400/60 hover:bg-violet-500/20'
                              }`}>
                              {/* Reactive pulse — only when detecting speech (interim has content) */}
                              {recording && interim && (
                                <motion.div className="absolute inset-[-6px] rounded-full bg-gradient-to-br from-red-500/20 via-fuchsia-500/15 to-violet-500/20"
                                  animate={{ scale: [1, 1.15, 1], opacity: [0.6, 0.3, 0.6] }}
                                  transition={{ duration: 0.6, repeat: Infinity, ease: 'easeInOut' }} />
                              )}
                              {/* Static subtle ring when recording but NOT speaking */}
                              {recording && !interim && (
                                <motion.div className="absolute inset-[-4px] rounded-full border border-red-400/15"
                                  animate={{ opacity: [0.3, 0.6, 0.3] }}
                                  transition={{ duration: 2, repeat: Infinity }} />
                              )}
                              {recording ? <MicOff className="w-8 h-8 relative z-10" strokeWidth={1.5} /> : <Mic className="w-8 h-8" strokeWidth={1.5} />}
                            </motion.button>

                            {/* "Terminar y continuar" button — ALWAYS visible while recording */}
                            {recording && (
                              <motion.button
                                initial={{ opacity: 0, x: 10 }}
                                animate={{ opacity: 1, x: 0 }}
                                onClick={() => { manualStopRef.current = true; recognitionRef.current?.stop(); setRecording(false); setInterim(''); setTimeout(handleNext, 300) }}
                                className="absolute left-full ml-4 top-1/2 -translate-y-1/2 whitespace-nowrap flex items-center gap-2 px-4 py-2.5 rounded-full bg-gradient-to-r from-violet-500/80 to-fuchsia-500/80 text-white text-sm font-light hover:from-violet-500 hover:to-fuchsia-500 transition-all">
                                Siguiente <ArrowRight className="w-3.5 h-3.5" />
                              </motion.button>
                            )}
                          </div>

                          {/* Reactive wave bars — only animate when speech detected */}
                          {recording && (
                            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="mt-3">
                              <div className="flex items-center justify-center gap-1.5 h-8 mb-2">
                                {[0, 1, 2, 3, 4, 5, 6].map(i => (
                                  <motion.div key={i} className={`w-1 rounded-full ${interim ? 'bg-red-400/50' : 'bg-red-400/20'}`}
                                    animate={interim
                                      ? { height: ['4px', `${14 + (i % 3) * 6}px`, '4px'] }
                                      : { height: '4px' }
                                    }
                                    transition={interim
                                      ? { duration: 0.6 + (i % 2) * 0.3, repeat: Infinity, delay: i * 0.09, ease: 'easeInOut' }
                                      : { duration: 0.3 }
                                    } />
                                ))}
                              </div>
                              <p className={`text-sm font-light text-center ${interim ? 'text-red-300/50 animate-pulse' : 'text-white/25'}`}>
                                {interim ? 'Escuchando...' : 'Esperando tu voz...'}
                              </p>
                            </motion.div>
                          )}

                          {/* Response captured + Siguiente (when not recording) */}
                          {!recording && responses[currentQ?.id]?.trim() && (
                            <div className="flex items-center gap-4 mt-4">
                              <div className="flex items-center gap-1.5 text-emerald-400/60 text-sm font-light">
                                <Check className="w-3.5 h-3.5" /> Respuesta capturada
                              </div>
                              <motion.button whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}
                                onClick={handleNext}
                                className="flex items-center gap-2 px-5 py-2.5 rounded-full bg-gradient-to-r from-violet-500/80 to-fuchsia-500/80 text-white text-sm font-light hover:from-violet-500 hover:to-fuchsia-500 transition-all">
                                {currentQuestion < QUESTIONS.length - 1 ? 'Siguiente' : 'Continuar'}
                                <ArrowRight className="w-3.5 h-3.5" />
                              </motion.button>
                            </div>
                          )}

                          {/* Additional actions */}
                          {!recording && (
                            <div className="flex flex-wrap items-center justify-center gap-3 mt-5">
                              {responses[currentQ?.id]?.trim() && (
                                <button onClick={toggleMic}
                                  className="flex items-center gap-1.5 text-violet-300/40 text-xs hover:text-violet-300/70 transition-colors">
                                  <Mic className="w-3 h-3" /> Agregar más
                                </button>
                              )}
                              {!responses[currentQ?.id]?.trim() && (
                                <button onClick={handleNext}
                                  className="text-white/20 text-xs hover:text-white/40 tracking-wider transition-colors">
                                  OMITIR
                                </button>
                              )}
                              {isDevMode && currentQ?.sample && !responses[currentQ?.id]?.trim() && (
                                <button
                                  onClick={() => {
                                    setResponses(prev => ({ ...prev, [currentQ.id]: currentQ.sample }))
                                    setTimeout(handleNext, 350)
                                  }}
                                  className="flex items-center gap-1.5 text-amber-400/50 text-[10px] hover:text-amber-400/80 tracking-wider transition-colors border border-amber-400/20 rounded-full px-2.5 py-1 hover:border-amber-400/40">
                                  ► Muestra
                                </button>
                              )}
                              {isDevMode && (
                                <button
                                  onClick={() => {
                                    const filled = { ...responses }
                                    QUESTIONS.forEach(q => { if (!filled[q.id]?.trim()) filled[q.id] = q.sample })
                                    setResponses(filled)
                                    fireBackgroundAnalysis(filled)
                                    setStage('email')
                                    scrollToTop()
                                  }}
                                  className="flex items-center gap-1.5 text-orange-400/60 text-[10px] hover:text-orange-400/90 tracking-wider transition-colors border border-orange-400/25 rounded-full px-2.5 py-1 hover:border-orange-400/50">
                                  ⚡ Completar todo
                                </button>
                              )}
                              <button onClick={() => { if (audioRef.current) { audioRef.current.pause(); audioRef.current = null }; setAudioPlaying(false); setUiMode('text') }}
                                className="text-white/22 text-xs hover:text-white/50 transition-colors underline underline-offset-4">
                                Prefiero escribir
                              </button>
                            </div>
                          )}
                        </>
                      )}
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
                          {isDevMode && currentQ?.sample && !(responses[currentQ?.id] || '').trim() && (
                            <button
                              onClick={() => setResponses(prev => ({ ...prev, [currentQ.id]: currentQ.sample }))}
                              className="text-amber-400/50 text-[10px] hover:text-amber-400/80 transition-colors border border-amber-400/20 rounded-full px-2.5 py-1 hover:border-amber-400/40">
                              ► Muestra
                            </button>
                          )}
                          {isDevMode && (
                            <button
                              onClick={() => {
                                const filled = { ...responses }
                                QUESTIONS.forEach(q => { if (!filled[q.id]?.trim()) filled[q.id] = q.sample })
                                setResponses(filled)
                                fireBackgroundAnalysis(filled)
                                setStage('email')
                                scrollToTop()
                              }}
                              className="text-orange-400/60 text-[10px] hover:text-orange-400/90 transition-colors border border-orange-400/25 rounded-full px-2.5 py-1 hover:border-orange-400/50">
                              ⚡ Completar todo
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
                  Hemos cruzado tus 45 respuestas para construir un mapa completo de tu relación.
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
            STAGE: RESULTS — Premium redesign
        ═══════════════════════════════════════════════════════ */}
        {stage === 'results' && aiAnalysis && (
          <motion.div key="results" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="min-h-screen pt-24 lg:pt-28 pb-20 px-6">
            <div className="max-w-4xl mx-auto space-y-12">

              {/* Header */}
              <div className="text-center">
                <h1 className="text-3xl lg:text-4xl font-light text-white mb-3">🔬 Tu Diagnóstico Relacional</h1>
                <p className="text-white/40 text-sm font-light">Generado a partir de tus 45 respuestas en 8 fases psicológicas</p>
              </div>

              {/* ── RELATIONSHIP TYPE ── */}
              {aiAnalysis.relationship_type && (
                <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}
                  className="p-6 lg:p-8 rounded-2xl border border-violet-500/20 bg-gradient-to-br from-violet-500/5 to-fuchsia-500/5 relative overflow-hidden">
                  <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-violet-500/40 via-fuchsia-500/40 to-pink-500/40" />
                  <div className="flex items-center justify-center gap-3 mb-3">
                    <div className="w-8 h-8 rounded-lg bg-violet-500/15 border border-violet-500/20 flex items-center justify-center">
                      <Heart className="w-4 h-4 text-violet-400/60" strokeWidth={1.5} />
                    </div>
                    <p className="text-white/30 text-xs uppercase tracking-wider">Tipo de relación detectado</p>
                  </div>
                  <h2 className="text-2xl lg:text-3xl font-light text-white mb-5 text-center">{aiAnalysis.relationship_type.label}</h2>
                  {aiAnalysis.relationship_type.explanation && (
                    <div className="max-w-2xl mx-auto space-y-3">
                      {aiAnalysis.relationship_type.explanation.split('\n\n').map((p, i) => (
                        <div key={i} className="flex items-start gap-3 p-3 rounded-xl bg-white/[0.02] border border-white/[0.04]">
                          <span className="text-violet-400/50 mt-0.5 flex-shrink-0">•</span>
                          <p className="text-white/55 text-sm font-light leading-relaxed">{renderBold(p)}</p>
                        </div>
                      ))}
                    </div>
                  )}
                </motion.div>
              )}

              {/* ── CORE SCORES ── */}
              {aiAnalysis.core_scores && (
                <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
                  <h2 className="text-xl font-light text-white/70 mb-6 text-center">🎯 Indicadores Principales</h2>
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

              {/* ── RADAR CHART (colored) ── */}
              {aiAnalysis.radar_scores && (
                <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}>
                  <h2 className="text-xl font-light text-white/70 mb-6 text-center">📊 Radar Relacional</h2>
                  <div className="p-6 rounded-2xl border border-white/8 bg-white/[0.02]">
                    <RadarChart scores={aiAnalysis.radar_scores} />
                  </div>
                </motion.div>
              )}

              {/* ── PROFILE BARS (fixed: raw values + health indicators) ── */}
              {aiAnalysis.profile_scores && (
                <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }}>
                  <h2 className="text-xl font-light text-white/70 mb-6 text-center">📈 Perfil Emocional</h2>
                  <div className="space-y-4">
                    {Object.entries(PROFILE_LABELS).map(([key, meta]) => {
                      const val = aiAnalysis.profile_scores[key] ?? 0
                      const rawLevel = getLevelPct(val)
                      const healthPct = meta.inverted ? (100 - val) : val
                      const isHealthy = healthPct >= 55
                      return (
                        <div key={key} className="p-4 rounded-xl border border-white/8 bg-white/[0.02]">
                          <div className="flex items-center justify-between mb-2">
                            <div className="flex items-center gap-2">
                              <span className="text-white/55 text-sm font-light">{meta.label}</span>
                              {meta.inverted && (
                                <span className={`text-[9px] px-1.5 py-0.5 rounded-full border ${
                                  isHealthy
                                    ? 'bg-emerald-500/10 text-emerald-400/60 border-emerald-500/15'
                                    : 'bg-amber-500/10 text-amber-400/60 border-amber-500/15'
                                }`}>
                                  {isHealthy ? '✓ Saludable' : '⚠ Atención'}
                                </span>
                              )}
                            </div>
                            <span className={`text-xs font-light ${rawLevel.color}`}>{val}% · {rawLevel.label}</span>
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

              {/* ── EMPATHIC OPENING (structured with icons) ── */}
              {aiAnalysis.empathic_opening && (
                <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5 }}
                  className="p-6 lg:p-8 rounded-2xl border border-violet-500/10 bg-gradient-to-br from-violet-500/[0.03] to-transparent relative overflow-hidden">
                  <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-violet-500/30 to-fuchsia-500/30" />
                  <div className="flex items-center gap-3 mb-5">
                    <div className="w-10 h-10 rounded-xl bg-violet-500/10 border border-violet-500/20 flex items-center justify-center">
                      <Sparkles className="w-5 h-5 text-violet-400/50" strokeWidth={1.5} />
                    </div>
                    <h2 className="text-xl font-light text-white/70">✨ Lo que tu historia reveló</h2>
                  </div>
                  <div className="space-y-3">
                    {aiAnalysis.empathic_opening.split('\n\n').map((p, i) => {
                      const paragraphs = aiAnalysis.empathic_opening.split('\n\n')
                      const isFirst = i === 0
                      const isLast = i === paragraphs.length - 1
                      return (
                        <div key={i} className="flex items-start gap-3 p-3 rounded-xl bg-white/[0.02] border border-white/[0.04]">
                          {isFirst ? (
                            <CheckCircle className="w-4 h-4 text-emerald-400/60 flex-shrink-0 mt-0.5" strokeWidth={1.5} />
                          ) : isLast ? (
                            <Star className="w-4 h-4 text-violet-400/60 flex-shrink-0 mt-0.5" strokeWidth={1.5} />
                          ) : (
                            <AlertTriangle className="w-4 h-4 text-amber-400/50 flex-shrink-0 mt-0.5" strokeWidth={1.5} />
                          )}
                          <p className="text-white/55 text-sm font-light leading-relaxed">{renderBold(p)}</p>
                        </div>
                      )
                    })}
                  </div>
                </motion.div>
              )}

              {/* ── INDIVIDUAL INSIGHTS (premium cards) ── */}
              {aiAnalysis.individual_insights && (
                <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.6 }}>
                  <h2 className="text-xl font-light text-white/70 mb-6 text-center">🔍 Tu Perfil Relacional</h2>
                  <div className="space-y-4">
                    {[
                      { key: 'emotional_style', label: '🎭 Estilo emocional', icon: Heart, accent: 'violet' },
                      { key: 'attachment_patterns', label: '🔗 Patrones de apego', icon: Users, accent: 'blue' },
                      { key: 'defense_mechanisms', label: '🛡️ Mecanismos de defensa', icon: Shield, accent: 'amber' },
                      { key: 'what_they_seek_in_love', label: '💕 Lo que buscas en el amor', icon: Sparkles, accent: 'pink' },
                      { key: 'emotional_triggers', label: '⚡ Detonantes emocionales', icon: Zap, accent: 'red' },
                      { key: 'repeating_patterns', label: '🔄 Patrones que se repiten', icon: Activity, accent: 'fuchsia' },
                      { key: 'hidden_needs', label: '🔮 Necesidades ocultas', icon: Eye, accent: 'indigo' },
                      { key: 'role_in_relationship', label: '👤 Tu rol en la relación', icon: Target, accent: 'emerald' },
                      { key: 'likely_relational_attractor', label: '🧲 Atractor relacional', icon: Brain, accent: 'cyan' }
                    ].map(({ key, label, icon: Icon, accent }) => {
                      const text = aiAnalysis.individual_insights[key]
                      if (!text) return null
                      const accentClasses = {
                        violet: { bg: 'bg-violet-500/10', border: 'border-violet-500/15', line: 'from-violet-500/30 to-violet-400/10', icon: 'text-violet-400/60', dot: 'text-violet-400/40' },
                        blue: { bg: 'bg-blue-500/10', border: 'border-blue-500/15', line: 'from-blue-500/30 to-blue-400/10', icon: 'text-blue-400/60', dot: 'text-blue-400/40' },
                        amber: { bg: 'bg-amber-500/10', border: 'border-amber-500/15', line: 'from-amber-500/30 to-amber-400/10', icon: 'text-amber-400/60', dot: 'text-amber-400/40' },
                        pink: { bg: 'bg-pink-500/10', border: 'border-pink-500/15', line: 'from-pink-500/30 to-pink-400/10', icon: 'text-pink-400/60', dot: 'text-pink-400/40' },
                        red: { bg: 'bg-red-500/10', border: 'border-red-500/15', line: 'from-red-500/30 to-red-400/10', icon: 'text-red-400/60', dot: 'text-red-400/40' },
                        fuchsia: { bg: 'bg-fuchsia-500/10', border: 'border-fuchsia-500/15', line: 'from-fuchsia-500/30 to-fuchsia-400/10', icon: 'text-fuchsia-400/60', dot: 'text-fuchsia-400/40' },
                        indigo: { bg: 'bg-indigo-500/10', border: 'border-indigo-500/15', line: 'from-indigo-500/30 to-indigo-400/10', icon: 'text-indigo-400/60', dot: 'text-indigo-400/40' },
                        emerald: { bg: 'bg-emerald-500/10', border: 'border-emerald-500/15', line: 'from-emerald-500/30 to-emerald-400/10', icon: 'text-emerald-400/60', dot: 'text-emerald-400/40' },
                        cyan: { bg: 'bg-cyan-500/10', border: 'border-cyan-500/15', line: 'from-cyan-500/30 to-cyan-400/10', icon: 'text-cyan-400/60', dot: 'text-cyan-400/40' }
                      }
                      const a = accentClasses[accent]
                      const paragraphs = text.split('\n\n')
                      const isExpanded = expandedInsights[key]
                      const visibleParagraphs = isExpanded ? paragraphs : paragraphs.slice(0, 1)
                      return (
                        <div key={key} className="p-5 rounded-2xl border border-white/8 bg-gradient-to-br from-white/[0.02] to-transparent overflow-hidden relative cursor-pointer group"
                          onClick={() => toggleInsight(key)}>
                          <div className={`absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r ${a.line}`} />
                          <div className="flex items-center gap-3 mb-3">
                            <div className={`w-8 h-8 rounded-lg ${a.bg} border ${a.border} flex items-center justify-center`}>
                              <Icon className={`w-4 h-4 ${a.icon}`} strokeWidth={1.5} />
                            </div>
                            <h3 className="text-white/80 font-light flex-1">{label}</h3>
                            {paragraphs.length > 1 && (
                              <ChevronDown className={`w-4 h-4 text-white/30 transition-transform duration-300 ${isExpanded ? 'rotate-180' : ''}`} strokeWidth={1.5} />
                            )}
                          </div>
                          <div className="text-white/55 text-sm font-light leading-relaxed space-y-2">
                            {visibleParagraphs.map((p, i) => (
                              <div key={i} className="flex items-start gap-2">
                                <span className={`${a.dot} mt-1.5 text-[6px]`}>●</span>
                                <p>{renderBold(p)}</p>
                              </div>
                            ))}
                          </div>
                          {paragraphs.length > 1 && !isExpanded && (
                            <p className={`text-xs mt-2 ${a.icon} opacity-60`}>Toca para ver más →</p>
                          )}
                        </div>
                      )
                    })}
                  </div>
                </motion.div>
              )}

              {/* ── COUPLE INSIGHTS (premium) ── */}
              {aiAnalysis.couple_insights && (
                <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.7 }}>
                  <h2 className="text-xl font-light text-white/70 mb-6 text-center">👥 Dinámica de Pareja</h2>
                  <div className="space-y-4">
                    {[
                      { key: 'real_relationship_dynamic', label: '🔄 Dinámica real de la relación', icon: Activity, accent: 'violet' },
                      { key: 'unconscious_patterns', label: '🧩 Patrones inconscientes', icon: Brain, accent: 'indigo' },
                      { key: 'conflict_and_defense', label: '⚔️ Conflicto y defensa', icon: Shield, accent: 'red' },
                      { key: 'distancing_dynamics', label: '📏 Dinámica de distanciamiento', icon: TrendingDown, accent: 'amber' },
                      { key: 'attachment_and_support', label: '🤝 Apego y apoyo', icon: Heart, accent: 'emerald' },
                      { key: 'strengths_of_the_relationship', label: '💪 Fortalezas de la relación', icon: Star, accent: 'cyan' },
                      { key: 'critical_moments_of_the_bond', label: '⚡ Momentos críticos del vínculo', icon: Zap, accent: 'fuchsia' },
                      { key: 'global_relationship_diagnosis', label: '🩺 Diagnóstico global', icon: Target, accent: 'pink' }
                    ].map(({ key, label, icon: Icon, accent }) => {
                      const text = aiAnalysis.couple_insights[key]
                      if (!text) return null
                      const accentMap = {
                        violet: { bg: 'bg-violet-500/10', border: 'border-violet-500/15', line: 'from-violet-500/20 to-violet-400/10', icon: 'text-violet-400/60', dot: 'text-violet-400/30' },
                        indigo: { bg: 'bg-indigo-500/10', border: 'border-indigo-500/15', line: 'from-indigo-500/20 to-indigo-400/10', icon: 'text-indigo-400/60', dot: 'text-indigo-400/30' },
                        red: { bg: 'bg-red-500/10', border: 'border-red-500/15', line: 'from-red-500/20 to-red-400/10', icon: 'text-red-400/60', dot: 'text-red-400/30' },
                        amber: { bg: 'bg-amber-500/10', border: 'border-amber-500/15', line: 'from-amber-500/20 to-amber-400/10', icon: 'text-amber-400/60', dot: 'text-amber-400/30' },
                        emerald: { bg: 'bg-emerald-500/10', border: 'border-emerald-500/15', line: 'from-emerald-500/20 to-emerald-400/10', icon: 'text-emerald-400/60', dot: 'text-emerald-400/30' },
                        cyan: { bg: 'bg-cyan-500/10', border: 'border-cyan-500/15', line: 'from-cyan-500/20 to-cyan-400/10', icon: 'text-cyan-400/60', dot: 'text-cyan-400/30' },
                        fuchsia: { bg: 'bg-fuchsia-500/10', border: 'border-fuchsia-500/15', line: 'from-fuchsia-500/20 to-fuchsia-400/10', icon: 'text-fuchsia-400/60', dot: 'text-fuchsia-400/30' },
                        pink: { bg: 'bg-pink-500/10', border: 'border-pink-500/15', line: 'from-pink-500/20 to-pink-400/10', icon: 'text-pink-400/60', dot: 'text-pink-400/30' }
                      }
                      const a = accentMap[accent]
                      const paragraphs = text.split('\n\n')
                      const isExpanded = expandedInsights[`couple_${key}`]
                      const visibleParagraphs = isExpanded ? paragraphs : paragraphs.slice(0, 1)
                      return (
                        <div key={key} className="p-5 rounded-2xl border border-white/8 bg-gradient-to-br from-white/[0.02] to-transparent overflow-hidden relative cursor-pointer group"
                          onClick={() => toggleInsight(`couple_${key}`)}>
                          <div className={`absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r ${a.line}`} />
                          <div className="flex items-center gap-3 mb-3">
                            <div className={`w-8 h-8 rounded-lg ${a.bg} border ${a.border} flex items-center justify-center`}>
                              <Icon className={`w-4 h-4 ${a.icon}`} strokeWidth={1.5} />
                            </div>
                            <h3 className="text-white/80 font-light flex-1">{label}</h3>
                            {paragraphs.length > 1 && (
                              <ChevronDown className={`w-4 h-4 text-white/30 transition-transform duration-300 ${isExpanded ? 'rotate-180' : ''}`} strokeWidth={1.5} />
                            )}
                          </div>
                          <div className="text-white/55 text-sm font-light leading-relaxed space-y-2">
                            {visibleParagraphs.map((p, i) => (
                              <div key={i} className="flex items-start gap-2">
                                <span className={`${a.dot} mt-1.5 text-[6px]`}>●</span>
                                <p>{renderBold(p)}</p>
                              </div>
                            ))}
                          </div>
                          {paragraphs.length > 1 && !isExpanded && (
                            <p className={`text-xs mt-2 ${a.icon} opacity-60`}>Toca para ver más →</p>
                          )}
                        </div>
                      )
                    })}
                  </div>
                </motion.div>
              )}

              {/* ── DOMINANT CYCLES (premium) ── */}
              {aiAnalysis.dominant_cycles?.length > 0 && (
                <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.8 }}>
                  <h2 className="text-xl font-light text-white/70 mb-6 text-center">🔄 Ciclos Relacionales Dominantes</h2>
                  <div className="space-y-4">
                    {aiAnalysis.dominant_cycles.map((cycle, i) => (
                      <div key={i} className="p-5 rounded-2xl border border-amber-500/15 bg-gradient-to-br from-amber-500/[0.03] to-transparent relative overflow-hidden">
                        <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-amber-500/30 to-orange-500/30" />
                        {/* Cycle name as visual badge */}
                        <div className="flex items-center gap-3 mb-4">
                          <div className="w-10 h-10 rounded-xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center">
                            <span className="text-lg">🔁</span>
                          </div>
                          <div>
                            <h3 className="text-amber-300/80 font-medium">{cycle.name}</h3>
                            <p className="text-white/30 text-xs">Ciclo {i + 1} detectado</p>
                          </div>
                        </div>
                        {/* Visual cycle flow arrow */}
                        {cycle.name && (
                          <div className="flex items-center justify-center gap-2 mb-4 py-3 px-4 rounded-xl bg-amber-500/[0.05] border border-amber-500/10">
                            {cycle.name.split(/[-–→]/g).map((step, si, arr) => (
                              <span key={si} className="flex items-center gap-2">
                                <span className="text-amber-300/70 text-sm font-light">{step.trim()}</span>
                                {si < arr.length - 1 && <ArrowRight className="w-3.5 h-3.5 text-amber-400/40" />}
                              </span>
                            ))}
                            <ArrowRight className="w-3.5 h-3.5 text-amber-400/40" />
                            <span className="text-amber-400/50 text-[10px]">↻</span>
                          </div>
                        )}
                        <div className="text-white/55 text-sm font-light leading-relaxed space-y-2">
                          {(cycle.explanation || '').split('\n\n').map((p, j) => (
                            <div key={j} className="flex items-start gap-2">
                              <span className="text-amber-400/30 mt-1.5 text-[6px]">●</span>
                              <p>{renderBold(p)}</p>
                            </div>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                </motion.div>
              )}

              {/* ── EMOTIONAL SENSITIVITIES (premium) ── */}
              {aiAnalysis.activated_emotional_sensitivities?.length > 0 && (
                <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.9 }}>
                  <h2 className="text-xl font-light text-white/70 mb-6 text-center">💔 Sensibilidades Emocionales Activadas</h2>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {aiAnalysis.activated_emotional_sensitivities.map((sens, i) => {
                      const sensEmojis = ['😰', '😢', '😔', '🥺', '😶', '💫']
                      return (
                        <div key={i} className="p-5 rounded-2xl border border-rose-500/15 bg-gradient-to-br from-rose-500/[0.03] to-transparent relative overflow-hidden">
                          <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-rose-500/30 to-pink-500/30" />
                          <div className="flex items-center gap-3 mb-3">
                            <span className="text-xl">{sensEmojis[i % sensEmojis.length]}</span>
                            <h3 className="text-rose-300/80 font-light flex-1">{sens.name}</h3>
                          </div>
                          {/* Severity indicator */}
                          <div className="flex items-center gap-1.5 mb-3">
                            {[1, 2, 3].map(dot => (
                              <div key={dot} className={`w-2 h-2 rounded-full ${dot <= 2 ? 'bg-rose-400/50' : 'bg-white/10'}`} />
                            ))}
                            <span className="text-rose-400/40 text-[10px] ml-1">activada</span>
                          </div>
                          <p className="text-white/55 text-sm font-light leading-relaxed">{renderBold(sens.description)}</p>
                        </div>
                      )
                    })}
                  </div>
                </motion.div>
              )}

              {/* ── KEY INSIGHT (premium) ── */}
              {aiAnalysis.key_insight && (
                <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 1 }}
                  className="p-6 lg:p-8 rounded-2xl border border-cyan-500/15 bg-gradient-to-br from-cyan-500/[0.03] to-transparent relative overflow-hidden">
                  <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-cyan-500/30 to-teal-500/30" />
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-10 h-10 rounded-xl bg-cyan-500/10 border border-cyan-500/15 flex items-center justify-center">
                      <Zap className="w-5 h-5 text-cyan-400/50" strokeWidth={1.5} />
                    </div>
                    <h2 className="text-xl font-light text-white/70">💡 Observación Clave</h2>
                  </div>
                  <p className="text-white/60 text-sm font-light leading-relaxed">{renderBold(aiAnalysis.key_insight)}</p>
                </motion.div>
              )}

              {/* ── RECOMMENDATION (premium) ── */}
              {aiAnalysis.recommendation && (
                <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 1.1 }}
                  className="p-6 lg:p-8 rounded-2xl border border-emerald-500/15 bg-gradient-to-br from-emerald-500/[0.03] to-transparent relative overflow-hidden">
                  <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-emerald-500/30 to-green-500/30" />
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-10 h-10 rounded-xl bg-emerald-500/10 border border-emerald-500/15 flex items-center justify-center">
                      <Star className="w-5 h-5 text-emerald-400/50" strokeWidth={1.5} />
                    </div>
                    <h2 className="text-xl font-light text-white/70">🌟 Recomendación Profesional</h2>
                  </div>
                  <div className="text-white/60 text-sm font-light leading-relaxed space-y-3">
                    {aiAnalysis.recommendation.split('\n\n').map((p, i) => (
                      <div key={i} className="flex items-start gap-2">
                        <CheckCircle className="w-3.5 h-3.5 text-emerald-400/40 flex-shrink-0 mt-0.5" strokeWidth={1.5} />
                        <p>{renderBold(p)}</p>
                      </div>
                    ))}
                  </div>
                </motion.div>
              )}

              {/* ── SESSION WORK ITEMS (premium) ── */}
              {aiAnalysis.session_work_items?.length > 0 && (
                <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 1.2 }}>
                  <h2 className="text-xl font-light text-white/70 mb-6 text-center">📋 Temas para Sesión</h2>
                  <div className="space-y-3">
                    {aiAnalysis.session_work_items.map((item, i) => {
                      const { title, description } = parseItemTitle(item)
                      return (
                        <div key={i} className="p-4 rounded-xl border border-violet-500/10 bg-gradient-to-br from-violet-500/[0.02] to-transparent relative overflow-hidden flex items-start gap-3">
                          <div className="w-7 h-7 rounded-lg bg-violet-500/10 border border-violet-500/15 flex items-center justify-center flex-shrink-0 mt-0.5">
                            <span className="text-violet-400/60 text-xs font-light">{i + 1}</span>
                          </div>
                          <div>
                            {title && <p className="text-violet-300/80 font-medium text-sm mb-0.5">{title}</p>}
                            <p className="text-white/55 text-sm font-light">{description}</p>
                          </div>
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

              {/* ── CONSULTATION CTA — $1,199 ── */}
              <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 1.5 }}
                className="p-8 rounded-2xl border border-violet-500/20 bg-gradient-to-br from-violet-500/[0.06] to-fuchsia-500/[0.03] relative overflow-hidden">
                <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-violet-500/50 via-fuchsia-500/50 to-pink-500/50" />
                <div className="text-center space-y-4">
                  <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-violet-500/15 to-fuchsia-500/10 border border-violet-500/20 flex items-center justify-center mx-auto">
                    <Users className="w-7 h-7 text-violet-400/60" strokeWidth={1.5} />
                  </div>
                  <div>
                    <h3 className="text-xl font-light text-white mb-2">Lleva este diagnóstico a una sesión profesional</h3>
                    <p className="text-white/40 text-sm font-light leading-relaxed max-w-lg mx-auto">
                      Un psicólogo clínico interpreta tus resultados contigo en una sesión privada de 1 hora. No solo entenderás qué pasa — sabrás exactamente qué hacer con lo que descubriste.
                    </p>
                  </div>
                  <div className="flex flex-wrap items-center justify-center gap-3 text-white/35 text-xs font-light">
                    {['Sesión 1:1 con Luis Virrueta', 'Interpretación profunda de tu reporte', 'Plan de acción personalizado', 'Seguimiento post-sesión'].map((item, i) => (
                      <span key={i} className="flex items-center gap-1.5 px-3 py-1.5 rounded-full border border-white/[0.08] bg-white/[0.02]">
                        <Check className="w-3 h-3 text-violet-400/50" strokeWidth={2} />
                        {item}
                      </span>
                    ))}
                  </div>
                  <div className="pt-2 space-y-3">
                    <p className="text-2xl font-light text-white mb-1">${PRODUCT_PRICE_CONSULTA} <span className="text-base text-white/35">MXN</span></p>
                    <p className="text-white/35 text-xs font-light">Al completar el pago, recibirás un botón de WhatsApp para coordinar directamente con Luis la fecha y hora de tu sesión.</p>
                    <motion.a
                      href={STRIPE_LINKS.consulta}
                      target="_blank" rel="noopener noreferrer"
                      whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}
                      className="inline-flex items-center gap-2 px-8 py-4 rounded-xl bg-gradient-to-r from-violet-600 to-fuchsia-600 text-white font-light text-base hover:from-violet-500 hover:to-fuchsia-500 transition-all shadow-lg shadow-violet-600/20">
                      Agendar consulta psicológica <ArrowRight className="w-4 h-4" />
                    </motion.a>
                  </div>
                </div>
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

      {/* ═══════════════════════════════════════════════════════
          MODAL: FREE GUIDE — Email capture + mini-guide
      ═══════════════════════════════════════════════════════ */}
      <AnimatePresence>
        {showFreeGuide && (
          <motion.div key="free-guide-overlay" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center px-6 bg-black/80 backdrop-blur-sm"
            onClick={(e) => { if (e.target === e.currentTarget) setShowFreeGuide(false) }}>
            <motion.div initial={{ opacity: 0, scale: 0.95, y: 20 }} animate={{ opacity: 1, scale: 1, y: 0 }} exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="max-w-lg w-full rounded-2xl border border-emerald-500/20 bg-zinc-950 p-8 space-y-6 relative overflow-hidden">
              <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-emerald-500/50 to-teal-500/50" />
              <button onClick={() => setShowFreeGuide(false)} className="absolute top-4 right-4 text-white/30 hover:text-white/60 transition-colors">
                <XCircle className="w-5 h-5" />
              </button>
              <div className="text-center">
                <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-emerald-500/15 to-teal-500/10 border border-emerald-500/20 flex items-center justify-center mx-auto mb-4">
                  <BookOpen className="w-8 h-8 text-emerald-400/60" strokeWidth={1.5} />
                </div>
                <h3 className="text-2xl font-light text-white mb-2">Guía: Patrones Inconscientes de Pareja</h3>
                <p className="text-white/40 text-sm font-light leading-relaxed">
                  Descubre los 5 patrones que se repiten sin que te des cuenta — y cómo empiezan a sabotear tu relación antes de que lo notes.
                </p>
              </div>
              <div className="space-y-3">
                <div className="flex items-start gap-3 p-3 rounded-xl bg-white/[0.03]">
                  <Eye className="w-5 h-5 text-emerald-400/50 flex-shrink-0 mt-0.5" />
                  <div>
                    <p className="text-white/70 text-sm font-light">Los 5 ciclos que más se repiten</p>
                    <p className="text-white/30 text-xs font-light">Evitación, control, fusión, proyección y triangulación</p>
                  </div>
                </div>
                <div className="flex items-start gap-3 p-3 rounded-xl bg-white/[0.03]">
                  <AlertTriangle className="w-5 h-5 text-amber-400/50 flex-shrink-0 mt-0.5" />
                  <div>
                    <p className="text-white/70 text-sm font-light">Señales tempranas de desgaste</p>
                    <p className="text-white/30 text-xs font-light">Lo que parece normal pero no lo es</p>
                  </div>
                </div>
                <div className="flex items-start gap-3 p-3 rounded-xl bg-white/[0.03]">
                  <Brain className="w-5 h-5 text-violet-400/50 flex-shrink-0 mt-0.5" />
                  <div>
                    <p className="text-white/70 text-sm font-light">Mini-test: ¿Qué rol juegas tú?</p>
                    <p className="text-white/30 text-xs font-light">Identifica tu posición inconsciente en 3 preguntas</p>
                  </div>
                </div>
              </div>
              <div className="space-y-3">
                <input
                  type="email" value={email} onChange={e => setEmail(e.target.value)}
                  placeholder="Tu email para recibir la guía"
                  className="w-full px-4 py-4 bg-white/[0.04] border border-white/10 rounded-xl text-white text-sm font-light placeholder:text-white/25 focus:border-emerald-400/30 focus:outline-none transition-colors"
                />
                <motion.button
                  onClick={() => {
                    if (email.trim()) {
                      sessionStorage.setItem('diagnostico_guide_email', email)
                      setShowFreeGuide(false)
                      handlePurchase('demo')
                    }
                  }}
                  whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}
                  className="w-full py-4 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 text-white font-light text-base hover:from-emerald-500 hover:to-teal-500 transition-all shadow-lg shadow-emerald-600/20">
                  <Gift className="inline w-4 h-4 mr-2" /> Recibir guía gratuita
                </motion.button>
                <p className="text-white/20 text-xs text-center font-light">
                  Además podrás probar {DEMO_QUESTION_LIMIT} preguntas del diagnóstico completo
                </p>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

export default DiagnosticoRelacionalPage
