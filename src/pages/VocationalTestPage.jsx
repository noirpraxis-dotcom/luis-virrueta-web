import { motion, AnimatePresence, useInView } from 'framer-motion'
import { useState, useEffect, useMemo, useRef } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import { Clock, CheckCircle, ArrowRight, ArrowLeft, Brain, Heart, Sparkles, TrendingUp, Users, Code, Palette, BookOpen, Briefcase, Target, Home, AlertCircle, BarChart3, PieChart, Activity } from 'lucide-react'
import SEOHead from '../components/SEOHead'
import EstadisticaKit from '../components/EstadisticaKit'
import TestKit from '../components/TestKit'

const VocationalTestPage = ({ initialStage = 'intro' }) => {
  const navigate = useNavigate()
  const location = useLocation()
  const [stage, setStage] = useState(initialStage) // 'intro', 'test', 'results'
  const [currentQuestion, setCurrentQuestion] = useState(0)
  const [answers, setAnswers] = useState({})
  const [timeLeft, setTimeLeft] = useState(90 * 60) // 90 minutos en segundos
  const [isLocked, setIsLocked] = useState(false) // Temporalmente desbloqueado
  const [testStarted, setTestStarted] = useState(initialStage === 'test')
  const [results, setResults] = useState(null)
  const [insights, setInsights] = useState(null)
  const [showExitWarning, setShowExitWarning] = useState(false)

  const [legalAccepted, setLegalAccepted] = useState(false)

  const [timeExtensionsCount, setTimeExtensionsCount] = useState(0)
  const [timeExtensionsSeconds, setTimeExtensionsSeconds] = useState(0)
  const [questionEnterAt, setQuestionEnterAt] = useState(null)
  const [perQuestionTime, setPerQuestionTime] = useState({})
  const [debugLog, setDebugLog] = useState([])
  const [lastChangeRows, setLastChangeRows] = useState([])
  const [rankHistory, setRankHistory] = useState([])
  const [followUpInjected, setFollowUpInjected] = useState(false)

  const [simulationReport, setSimulationReport] = useState(null)
  const [simulationRunning, setSimulationRunning] = useState(false)
  const [simulationBatchReport, setSimulationBatchReport] = useState(null)

  const debugEnabled = new URLSearchParams(location.search).get('debug') === '1'

  const heroRef = useRef(null)
  const isHeroInView = useInView(heroRef, { once: true, amount: 0.3 })

  useEffect(() => {
    if (initialStage === 'test') {
      setStage('test')
      setTestStarted(true)
      setQuestionEnterAt(Date.now())
    }
  }, [initialStage])
  
  // Timer
  useEffect(() => {
    if (testStarted && stage === 'test' && timeLeft > 0) {
      const timer = setInterval(() => {
        setTimeLeft(prev => prev - 1)
      }, 1000)
      return () => clearInterval(timer)
    }
    if (timeLeft === 0) {
      calculateResults()
    }
  }, [testStarted, timeLeft, stage])
  
  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins}:${secs.toString().padStart(2, '0')}`
  }

  const clamp = (value, min, max) => Math.min(max, Math.max(min, value))

  const balancePercent = (left, right) => {
    const total = left + right
    if (total <= 0) return 50
    return clamp(Math.round(50 + ((left - right) / total) * 50), 0, 100)
  }

  const computeRoleSuggestions = ({ axes, clusters: clusterSummary, dynamics }) => {
    const clamp01 = (v) => clamp(Number(v ?? 0), 0, 100)
    const peopleVsSystems = clamp01(axes?.peopleVsSystems ?? 50)
    const creativityVsStructure = clamp01(axes?.creativityVsStructure ?? 50)
    const riskVsStability = clamp01(axes?.riskVsStability ?? 50)

    const people = 100 - peopleVsSystems
    const systems = peopleVsSystems
    const creative = 100 - creativityVsStructure
    const structure = creativityVsStructure
    const risk = 100 - riskVsStability
    const stability = riskVsStability

    const desire = clamp01(dynamics?.desire ?? 0)
    const sustain = clamp01(dynamics?.structure ?? 0)

    const topCluster = Array.isArray(clusterSummary) ? (clusterSummary[0]?.key ?? null) : null
    const clusterBoost = (key) => (topCluster === key ? 12 : 0)

    const score = (...parts) => {
      const n = parts.length
      if (!n) return 0
      const s = parts.reduce((a, b) => a + (Number(b) || 0), 0) / n
      return clamp(Math.round(s), 0, 100)
    }

    const roles = [
      {
        key: 'emergency_response',
        label: 'Respuesta a emergencias y crisis',
        score: score(people, structure, risk, desire) + clusterBoost('Cuidado'),
        note: 'Alta exposición + impacto directo; requiere sostén emocional y estructura.'
      },
      {
        key: 'aviation_transport',
        label: 'Transporte y logística (sistemas críticos)',
        score: score(systems, structure, stability, desire) + clusterBoost('Sistemas'),
        note: 'Sistemas + protocolos + precisión; equilibrio entre rutina y responsabilidad.'
      },
      {
        key: 'security_defense',
        label: 'Seguridad, protección y orden',
        score: score(structure, stability, systems, desire) + clusterBoost('Sistemas'),
        note: 'Orden, reglas y jerarquía; útil si toleras carga y responsabilidad.'
      },
      {
        key: 'public_service',
        label: 'Servicio público y gestión institucional',
        score: score(structure, people, stability, desire) + clusterBoost('Humano'),
        note: 'Impacto social con procesos; conviene paciencia y claridad de límites.'
      },
      {
        key: 'field_engineering',
        label: 'Operación en campo y mantenimiento',
        score: score(systems, structure, stability, desire) + clusterBoost('Sistemas'),
        note: 'Resolver en el mundo real: protocolos, herramientas y ejecución.'
      },
      {
        key: 'entrepreneur_product',
        label: 'Emprendimiento / Producto (Crear, lanzar, iterar)',
        score: score(risk, structure, systems, desire) + clusterBoost('Estrategia'),
        note: 'Exploración con plan: visión + iteración. Sin estructura, se dispersa.'
      },
      {
        key: 'creative_direction',
        label: 'Dirección creativa y contenido',
        score: score(creative, people, risk, desire) + clusterBoost('Creativo'),
        note: 'Idea + estética + narrativa; funciona mejor con mínimo de estructura.'
      },
      {
        key: 'research_lab',
        label: 'Investigación y análisis',
        score: score(systems, structure, stability, desire) + clusterBoost('Analítico'),
        note: 'Curiosidad + rigor; requiere paciencia y método.'
      }
    ]

    return roles
      .map((r) => ({ ...r, score: clamp(Math.round(r.score), 0, 100) }))
      .sort((a, b) => b.score - a.score)
  }

  const startQuestionTimer = () => {
    setQuestionEnterAt(Date.now())
  }

  const stopQuestionTimer = (questionId) => {
    if (!questionEnterAt || !questionId) return
    const elapsed = Math.max(0, Math.floor((Date.now() - questionEnterAt) / 1000))
    setPerQuestionTime(prev => ({
      ...prev,
      [questionId]: (prev[questionId] || 0) + elapsed
    }))
  }

  const addTenMinutes = () => {
    setTimeLeft(prev => prev + 10 * 60)
    setTimeExtensionsCount(prev => prev + 1)
    setTimeExtensionsSeconds(prev => prev + 10 * 60)
  }

  const openWhatsApp = (message) => {
    const whatsappURL = `https://wa.me/527228720520?text=${encodeURIComponent(message)}`
    window.open(whatsappURL, '_blank')
  }
  
  const questionBlocks = {
    // 10 preguntas de encuadre (no “dan pista” directa)
    marco: [
      {
        id: 1001,
        question: 'Cuando tienes que decidir algo importante, ¿qué suele aparecer primero?',
        type: 'scale',
        dimension: 'decision_frame',
        options: [
          { text: 'Una presión interna por elegir “bien”', value: 5, careers: ['admin', 'finance', 'operations'] },
          { text: 'Una curiosidad genuina por explorar', value: 5, careers: ['research', 'science', 'creative'] },
          { text: 'La necesidad de no decepcionar a nadie', value: 5, careers: ['social', 'education', 'health'] },
          { text: 'La urgencia por resolverlo rápido', value: 4, careers: ['business', 'entrepreneurship', 'tech'] },
          { text: 'Una mezcla difícil de ordenar', value: 3, careers: ['versatile', 'general'] }
        ]
      },
      {
        id: 1002,
        question: '¿Qué suele pasar cuando finalmente eliges?',
        type: 'scale',
        dimension: 'after_choice',
        options: [
          { text: 'Siento alivio: “por fin está resuelto”', value: 4, careers: ['admin', 'operations', 'business'] },
          { text: 'Siento entusiasmo: “quiero moverme ya”', value: 5, careers: ['entrepreneurship', 'tech', 'creative'] },
          { text: 'Siento ambivalencia: “no sé si era esto”', value: 3, careers: ['psychology', 'humanities', 'research'] },
          { text: 'Siento culpa: “debí elegir otra cosa”', value: 2, careers: ['social', 'education', 'health'] },
          { text: 'Me da igual: lo sostengo por disciplina', value: 3, careers: ['engineering', 'operations', 'science'] }
        ]
      },
      {
        id: 1003,
        question: '¿Qué te resulta más difícil de soportar sostenidamente?',
        type: 'scale',
        dimension: 'tolerance_load',
        options: [
          { text: 'La presión emocional de otros', value: 5, careers: ['tech', 'engineering', 'finance'] },
          { text: 'La incertidumbre sin estructura', value: 5, careers: ['admin', 'finance', 'operations'] },
          { text: 'La rutina sin creación', value: 5, careers: ['creative', 'entrepreneurship', 'media'] },
          { text: 'La exposición pública constante', value: 5, careers: ['research', 'tech', 'science'] },
          { text: 'La competencia y conflicto por poder', value: 5, careers: ['research', 'science', 'creative'] }
        ]
      },
      {
        id: 1004,
        question: 'Si tuvieras que elegir una palabra para tu estilo de trabajo, sería:',
        type: 'scale',
        dimension: 'work_style_frame',
        options: [
          { text: 'Precisión', value: 5, careers: ['finance', 'engineering', 'operations'] },
          { text: 'Exploración', value: 5, careers: ['creative', 'research', 'entrepreneurship'] },
          { text: 'Cuidado', value: 5, careers: ['health', 'psychology', 'education'] },
          { text: 'Estrategia', value: 5, careers: ['business', 'consulting', 'management'] },
          { text: 'Construcción', value: 5, careers: ['tech', 'engineering', 'operations'] }
        ]
      },
      {
        id: 1005,
        question: '¿Qué tan fácil te resulta sostener una decisión a largo plazo?',
        type: 'scale',
        dimension: 'commitment',
        options: [
          { text: 'Muy difícil, me cuesta sostenerlo', value: 2, careers: ['exploration', 'creative', 'media'] },
          { text: 'Difícil, pero lo intento', value: 3, careers: ['education', 'health', 'business'] },
          { text: 'Intermedio, depende del sentido', value: 4, careers: ['psychology', 'humanities', 'research'] },
          { text: 'Fácil, si hay estructura', value: 4, careers: ['admin', 'operations', 'engineering'] },
          { text: 'Muy fácil, soy constante', value: 5, careers: ['science', 'engineering', 'tech'] }
        ]
      },
      {
        id: 1006,
        question: '¿Qué te pasa con la autoridad (padres, jefes, instituciones)?',
        type: 'scale',
        dimension: 'authority',
        options: [
          { text: 'Me ordena y me da claridad', value: 4, careers: ['admin', 'operations', 'government', 'public'] },
          { text: 'La cuestiono; necesito entender', value: 5, careers: ['science', 'research', 'tech'] },
          { text: 'Me pesa; prefiero autonomía', value: 5, careers: ['entrepreneurship', 'creative', 'freelance'] },
          { text: 'La tolero si es humana', value: 4, careers: ['education', 'health', 'social'] },
          { text: 'Me cuesta y me genera tensión', value: 3, careers: ['psychology', 'humanities', 'creative'] }
        ]
      },
      {
        id: 1007,
        question: '¿Qué te mueve más cuando nadie te está mirando?',
        type: 'scale',
        dimension: 'private_motive',
        options: [
          { text: 'Aprender y dominar', value: 5, careers: ['science', 'research', 'tech'] },
          { text: 'Crear y expresar', value: 5, careers: ['creative', 'design', 'arts'] },
          { text: 'Ayudar y sostener', value: 5, careers: ['health', 'education', 'psychology'] },
          { text: 'Ganar y crecer', value: 5, careers: ['business', 'finance', 'sales'] },
          { text: 'Explorar y cambiar', value: 5, careers: ['entrepreneurship', 'creative', 'exploration'] }
        ]
      },
      {
        id: 1008,
        question: '¿Cómo te llevas con equivocarte frente a otros?',
        type: 'scale',
        dimension: 'shame',
        options: [
          { text: 'Me afecta mucho; lo evito', value: 2, careers: ['admin', 'support', 'operations'] },
          { text: 'Me da nervio pero sigo', value: 3, careers: ['education', 'health', 'business'] },
          { text: 'Lo uso como aprendizaje', value: 5, careers: ['tech', 'science', 'entrepreneurship'] },
          { text: 'Me da igual, soy práctico', value: 4, careers: ['engineering', 'operations', 'business'] },
          { text: 'Depende de quién me vea', value: 3, careers: ['psychology', 'humanities', 'social'] }
        ]
      },
      {
        id: 1009,
        question: 'En general, ¿qué haces con tus ganas (deseo)?',
        type: 'scale',
        dimension: 'desire_relation',
        options: [
          { text: 'Las sigo: son una brújula', value: 5, careers: ['creative', 'entrepreneurship', 'research'] },
          { text: 'Las administro: las organizo', value: 4, careers: ['business', 'operations', 'engineering'] },
          { text: 'Las pospongo: primero obligaciones', value: 3, careers: ['admin', 'finance', 'education'] },
          { text: 'Las niego: no confío en ellas', value: 2, careers: ['support', 'operations', 'finance'] },
          { text: 'No sé: a veces aparecen y se van', value: 3, careers: ['psychology', 'humanities', 'creative'] }
        ]
      },
      {
        id: 1010,
        question: '¿Qué tan fácil te es decir “no” a expectativas externas?',
        type: 'scale',
        dimension: 'boundaries',
        options: [
          { text: 'Muy difícil', value: 2, careers: ['social', 'education', 'health'] },
          { text: 'Difícil', value: 3, careers: ['education', 'health', 'business'] },
          { text: 'Intermedio', value: 4, careers: ['psychology', 'humanities', 'research'] },
          { text: 'Fácil', value: 4, careers: ['tech', 'engineering', 'operations'] },
          { text: 'Muy fácil', value: 5, careers: ['entrepreneurship', 'creative', 'freelance'] }
        ]
      }
    ]
    ,
    // 15 preguntas: deseo / estructura (posición subjetiva)
    deseoEstructura: [
      {
        id: 1101,
        question: 'Cuando algo te entusiasma, ¿qué sueles hacer?',
        type: 'scale',
        dimension: 'desire_core',
        options: [
          { text: 'Me lanzo y aprendo en el camino', value: 5, careers: ['entrepreneurship', 'creative', 'tech'] },
          { text: 'Lo investigo hasta entenderlo bien', value: 5, careers: ['science', 'research', 'tech'] },
          { text: 'Lo pienso en función de otros (impacto humano)', value: 5, careers: ['psychology', 'education', 'social'] },
          { text: 'Lo organizo en un plan concreto', value: 5, careers: ['business', 'operations', 'engineering'] },
          { text: 'Me entusiasmo y luego se me apaga', value: 3, careers: ['creative', 'humanities'] }
        ]
      },
      {
        id: 1102,
        question: '¿Qué te cuesta más: elegir o sostener lo elegido?',
        type: 'scale',
        dimension: 'decision_vs_commitment',
        options: [
          { text: 'Elegir (se me abren demasiadas opciones)', value: 4, careers: ['creative', 'research', 'entrepreneurship'] },
          { text: 'Sostener (me gana la duda)', value: 3, careers: ['psychology', 'humanities', 'education'] },
          { text: 'Ambas por igual', value: 3, careers: ['humanities', 'social'] },
          { text: 'Ninguna: elijo y sostengo con facilidad', value: 5, careers: ['engineering', 'science', 'tech'] },
          { text: 'Depende del contexto y de quién esté alrededor', value: 3, careers: ['social', 'education', 'health'] }
        ]
      },
      {
        id: 1103,
        question: 'Cuando trabajas, ¿qué te “da piso”?',
        type: 'scale',
        dimension: 'structure_need',
        options: [
          { text: 'Reglas claras y objetivos medibles', value: 5, careers: ['operations', 'admin', 'finance'] },
          { text: 'Un problema interesante para resolver', value: 5, careers: ['tech', 'engineering'] },
          { text: 'Un vínculo o propósito humano', value: 5, careers: ['psychology', 'health', 'education'] },
          { text: 'Libertad para crear a mi modo', value: 5, careers: ['creative', 'design', 'media'] },
          { text: 'Autonomía para decidir y negociar', value: 5, careers: ['business', 'entrepreneurship', 'sales'] }
        ]
      },
      {
        id: 1104,
        question: '¿Cómo te llevas con el “deber ser”?',
        type: 'scale',
        dimension: 'superego_pressure',
        options: [
          { text: 'Me ordena: me ayuda a rendir', value: 4, careers: ['engineering', 'operations', 'science'] },
          { text: 'Me pesa: siento que nunca alcanza', value: 2, careers: ['education', 'social', 'psychology'] },
          { text: 'Lo desafío: necesito mi propio camino', value: 5, careers: ['entrepreneurship', 'creative'] },
          { text: 'Lo negocio: me adapto según convenga', value: 4, careers: ['business', 'sales', 'management'] },
          { text: 'No lo siento mucho; hago lo práctico', value: 4, careers: ['tech', 'operations', 'business'] }
        ]
      },
      {
        id: 1105,
        question: '¿Qué lugar ocupa el reconocimiento para ti?',
        type: 'scale',
        dimension: 'recognition',
        options: [
          { text: 'Es clave: me motiva', value: 4, careers: ['business', 'entrepreneurship', 'media'] },
          { text: 'Importa, pero no define mis decisiones', value: 4, careers: ['tech', 'science', 'engineering'] },
          { text: 'Me incomoda: prefiero discreción', value: 4, careers: ['research', 'science', 'tech'] },
          { text: 'Me afecta: si no me reconocen, me apago', value: 3, careers: ['creative', 'humanities', 'education'] },
          { text: 'Me interesa más el vínculo que el aplauso', value: 5, careers: ['psychology', 'health', 'social'] }
        ]
      },
      {
        id: 1106,
        question: '¿Qué te pasa con competir?',
        type: 'scale',
        dimension: 'competition',
        options: [
          { text: 'Me activa: me sube el rendimiento', value: 4, careers: ['sports', 'competitive', 'fitness'] },
          { text: 'Me estresa: prefiero cooperación', value: 4, careers: ['social', 'education', 'health'] },
          { text: 'Me da igual: me enfoco en el problema', value: 4, careers: ['tech', 'engineering'] },
          { text: 'Me inspira: competir creando algo mejor', value: 5, careers: ['creative', 'design', 'media'] },
          { text: 'Depende de la persona con la que compita', value: 3, careers: ['psychology', 'humanities'] }
        ]
      },
      {
        id: 1107,
        question: 'Si te piden “elige ya”, ¿qué sueles hacer?',
        type: 'scale',
        dimension: 'urgency_response',
        options: [
          { text: 'Elijo y luego ajusto', value: 5, careers: ['entrepreneurship', 'tech', 'business'] },
          { text: 'Pido información y tiempo', value: 5, careers: ['science', 'research', 'engineering'] },
          { text: 'Elijo lo que tranquiliza a otros', value: 3, careers: ['social', 'education', 'health'] },
          { text: 'Me paralizo; siento presión', value: 2, careers: ['humanities', 'psychology'] },
          { text: 'Hago una apuesta creativa', value: 5, careers: ['creative', 'design'] }
        ]
      },
      {
        id: 1108,
        question: '¿Qué te pasa con la incertidumbre?',
        type: 'scale',
        dimension: 'uncertainty',
        options: [
          { text: 'La tolero: es parte de crear', value: 5, careers: ['creative', 'entrepreneurship'] },
          { text: 'La tolero si puedo medir y probar', value: 5, careers: ['science', 'tech', 'engineering'] },
          { text: 'Me incomoda: necesito estructura', value: 5, careers: ['admin', 'operations', 'finance'] },
          { text: 'Me activa lo humano: leo el contexto', value: 5, careers: ['psychology', 'education', 'social'] },
          { text: 'Me agota: prefiero claridad', value: 4, careers: ['operations', 'admin'] }
        ]
      },
      {
        id: 1109,
        question: 'Cuando aprendes algo, ¿qué estilo te sirve más?',
        type: 'scale',
        dimension: 'learning_style',
        options: [
          { text: 'Practicar y construir', value: 5, careers: ['tech', 'engineering', 'operations'] },
          { text: 'Entender la teoría a fondo', value: 5, careers: ['science', 'research', 'academic'] },
          { text: 'Aprender con alguien (mentor, profesor)', value: 5, careers: ['education', 'health', 'social'] },
          { text: 'Explorar por cuenta propia', value: 4, careers: ['creative', 'entrepreneurship'] },
          { text: 'Me cuesta: me distraigo fácil', value: 2, careers: ['creative', 'humanities'] }
        ]
      },
      {
        id: 1110,
        question: '¿Qué te da más miedo al elegir carrera?',
        type: 'scale',
        dimension: 'fear',
        options: [
          { text: 'Equivocarme y perder tiempo', value: 4, careers: ['admin', 'operations', 'engineering'] },
          { text: 'No sentir sentido en lo que haga', value: 5, careers: ['psychology', 'humanities', 'education'] },
          { text: 'Quedar atrapado en una rutina', value: 5, careers: ['creative', 'entrepreneurship', 'media'] },
          { text: 'No estar a la altura (rendimiento)', value: 4, careers: ['science', 'tech', 'engineering'] },
          { text: 'Decepcionar a mi familia', value: 4, careers: ['social', 'education', 'health'] }
        ]
      },
      {
        id: 1111,
        question: '¿Qué te sucede con la exposición (hablar, mostrar, vender ideas)?',
        type: 'scale',
        dimension: 'exposure',
        options: [
          { text: 'Me gusta: conecto y convenzo', value: 5, careers: ['sales', 'business', 'entrepreneurship'] },
          { text: 'La tolero si es por un propósito', value: 4, careers: ['education', 'health', 'social'] },
          { text: 'Prefiero que hablen mis resultados', value: 4, careers: ['tech', 'engineering'] },
          { text: 'Me encanta si es creativo/estético', value: 5, careers: ['creative', 'media', 'design'] },
          { text: 'Me cuesta; me pongo nervioso', value: 2, careers: ['humanities', 'psychology'] }
        ]
      },
      {
        id: 1112,
        question: '¿Qué te “enciende” más: personas, ideas o cosas?',
        type: 'scale',
        dimension: 'object_relation',
        options: [
          { text: 'Personas y vínculos', value: 5, careers: ['psychology', 'social', 'education'] },
          { text: 'Ideas y modelos', value: 5, careers: ['science', 'research', 'academic'] },
          { text: 'Cosas y sistemas', value: 5, careers: ['tech', 'engineering', 'operations'] },
          { text: 'Estética y símbolos', value: 5, careers: ['creative', 'design', 'arts'] },
          { text: 'Proyectos y metas', value: 5, careers: ['business', 'management', 'entrepreneurship'] }
        ]
      },
      {
        id: 1113,
        question: 'Cuando algo te sale bien, ¿qué sueles pensar?',
        type: 'scale',
        dimension: 'success_attribution',
        options: [
          { text: 'Tuve método y disciplina', value: 5, careers: ['engineering', 'operations', 'science'] },
          { text: 'Tuve intuición y creatividad', value: 5, careers: ['creative', 'entrepreneurship'] },
          { text: 'Tuve buena lectura humana', value: 5, careers: ['psychology', 'education', 'social'] },
          { text: 'Tuve estrategia', value: 5, careers: ['business', 'sales', 'management'] },
          { text: 'Fue suerte (me cuesta atribuirlo a mí)', value: 2, careers: ['humanities', 'psychology'] }
        ]
      },
      {
        id: 1114,
        question: '¿Qué haces con tu frustración cuando algo no sale?',
        type: 'scale',
        dimension: 'frustration',
        options: [
          { text: 'La convierto en acción: ajusto y sigo', value: 5, careers: ['tech', 'engineering', 'entrepreneurship'] },
          { text: 'Me retiro y lo pienso', value: 4, careers: ['research', 'science', 'humanities'] },
          { text: 'Busco apoyo/hablo con alguien', value: 5, careers: ['psychology', 'education', 'health'] },
          { text: 'Me enfoco en ordenar y planear mejor', value: 5, careers: ['operations', 'admin', 'business'] },
          { text: 'Me bloqueo/evito', value: 2, careers: ['humanities', 'social'] }
        ]
      },
      {
        id: 1115,
        question: '¿Qué te gustaría que una carrera te permitiera sentir más seguido?',
        type: 'scale',
        dimension: 'desire_outcome',
        options: [
          { text: 'Sentido y profundidad', value: 5, careers: ['psychology', 'humanities', 'education'] },
          { text: 'Creación y expresión', value: 5, careers: ['creative', 'design', 'media'] },
          { text: 'Dominio y competencia', value: 5, careers: ['tech', 'science', 'engineering'] },
          { text: 'Impacto concreto y resultados', value: 5, careers: ['business', 'operations', 'entrepreneurship'] },
          { text: 'Cuidado y contribución', value: 5, careers: ['health', 'social', 'education'] }
        ]
      }
    ]
  }

  // Sistema de preguntas vocacionales profundas (core actual)
  const coreQuestions = [
    // Bloque 1: Motivación intrínseca (10 preguntas)
    {
      id: 1,
      question: '¿Qué tipo de actividad te hace perder la noción del tiempo?',
      type: 'scale',
      dimension: 'motivation',
      options: [
        { text: 'Crear cosas nuevas con mis manos o digitalmente', value: 5, careers: ['creative', 'tech', 'design'] },
        { text: 'Ayudar a otros a resolver sus problemas', value: 5, careers: ['social', 'health', 'education'] },
        { text: 'Analizar datos, patrones y sistemas', value: 5, careers: ['tech', 'data', 'finance'] },
        { text: 'Organizar eventos, proyectos o equipos', value: 5, careers: ['business', 'admin', 'social'] },
        { text: 'Investigar temas que me apasionan', value: 5, careers: ['research', 'science', 'academic'] }
      ]
    },
    {
      id: 2,
      question: 'Cuando enfrentas un desafío complejo, ¿cuál es tu primera reacción?',
      type: 'scale',
      dimension: 'problem_solving',
      options: [
        { text: 'Dividirlo en partes pequeñas y resolverlo paso a paso', value: 5, careers: ['tech', 'engineering'] },
        { text: 'Buscar perspectivas de otras personas', value: 5, careers: ['social', 'business', 'education'] },
        { text: 'Visualizar diferentes escenarios y soluciones creativas', value: 5, careers: ['creative', 'design', 'architecture'] },
        { text: 'Investigar cómo otros lo han resuelto antes', value: 5, careers: ['research', 'academic', 'science'] },
        { text: 'Confiar en mi intuición y experiencia', value: 5, careers: ['business', 'arts', 'entrepreneurship'] }
      ]
    },
    {
      id: 3,
      question: '¿Qué te genera más satisfacción profunda?',
      type: 'scale',
      dimension: 'satisfaction',
      options: [
        { text: 'Ver el impacto positivo en la vida de las personas', value: 5, careers: ['health', 'social', 'education', 'psychology'] },
        { text: 'Crear algo hermoso o funcional que perdure', value: 5, careers: ['creative', 'design', 'architecture', 'arts'] },
        { text: 'Descubrir verdades o resolver misterios complejos', value: 5, careers: ['science', 'research', 'investigation'] },
        { text: 'Construir sistemas eficientes que funcionen', value: 5, careers: ['tech', 'engineering', 'business'] },
        { text: 'Lograr metas ambiciosas y superar límites', value: 5, careers: ['sports', 'competitive'] }
      ]
    },
    {
      id: 4,
      question: 'Si tuvieras un día libre sin responsabilidades, ¿qué harías?',
      type: 'scale',
      dimension: 'interests',
      options: [
        { text: 'Aprender algo nuevo (curso, libro, tutorial)', value: 5, careers: ['tech', 'software'] },
        { text: 'Crear o construir algo (arte, código, manualidades)', value: 5, careers: ['creative', 'tech', 'design'] },
        { text: 'Pasar tiempo de calidad con personas cercanas', value: 5, careers: ['social', 'health', 'education'] },
        { text: 'Explorar la naturaleza o hacer deporte', value: 5, careers: ['sports', 'environment', 'ecology'] },
        { text: 'Trabajar en un proyecto personal apasionante', value: 5, careers: ['entrepreneurship', 'arts', 'research'] }
      ]
    },
    {
      id: 5,
      question: '¿Cómo prefieres trabajar en proyectos importantes?',
      type: 'scale',
      dimension: 'work_style',
      options: [
        { text: 'Solo, con total autonomía y control', value: 5, careers: ['tech', 'creative'] },
        { text: 'En equipo pequeño con roles claros', value: 5, careers: ['business', 'health', 'design'] },
        { text: 'Liderando y coordinando grupos grandes', value: 5, careers: ['business', 'admin', 'education'] },
        { text: 'Colaborando constantemente con otros', value: 5, careers: ['social', 'education', 'health'] },
        { text: 'Alternando entre trabajo individual y grupal', value: 5, careers: ['tech', 'business'] }
      ]
    },
    {
      id: 6,
      question: '¿Qué tipo de reconocimiento te motiva más?',
      type: 'scale',
      dimension: 'motivation',
      options: [
        { text: 'Saber que mi trabajo ayudó a alguien', value: 5, careers: ['health', 'social', 'education'] },
        { text: 'Ver mi trabajo publicado o exhibido', value: 5, careers: ['creative', 'arts', 'design'] },
        { text: 'Ser reconocido como experto en mi campo', value: 5, careers: ['science', 'research', 'academic'] },
        { text: 'Lograr resultados medibles y tangibles', value: 5, careers: ['business', 'tech', 'engineering'] },
        { text: 'No necesito reconocimiento externo', value: 3, careers: ['tech', 'arts'] }
      ]
    },
    {
      id: 7,
      question: 'Cuando lees o aprendes algo nuevo, ¿qué te atrae más?',
      type: 'scale',
      dimension: 'learning',
      options: [
        { text: 'Entender cómo funcionan las cosas en profundidad', value: 5, careers: ['tech', 'engineering'] },
        { text: 'Descubrir diferentes perspectivas humanas', value: 5, careers: ['social', 'psychology', 'humanities'] },
        { text: 'Aprender técnicas prácticas aplicables', value: 5, careers: ['business', 'health', 'trades'] },
        { text: 'Explorar teorías abstractas y conceptos complejos', value: 5, careers: ['academic', 'philosophy', 'research'] },
        { text: 'Encontrar inspiración para crear', value: 5, careers: ['creative', 'arts', 'design'] }
      ]
    },
    {
      id: 8,
      question: '¿Qué te causa más estrés o insatisfacción?',
      type: 'scale',
      dimension: 'values',
      options: [
        { text: 'No poder ayudar cuando alguien lo necesita', value: 5, careers: ['health', 'social', 'education'] },
        { text: 'Sentir que mi trabajo no es significativo', value: 5, careers: ['social', 'health', 'environment'] },
        { text: 'Estar en situaciones desorganizadas o caóticas', value: 5, careers: ['business', 'admin', 'engineering'] },
        { text: 'No tener libertad creativa o autonomía', value: 5, careers: ['creative', 'arts', 'entrepreneurship'] },
        { text: 'Hacer tareas repetitivas sin desafío intelectual', value: 5, careers: ['tech', 'engineering'] }
      ]
    },
    {
      id: 9,
      question: '¿Cuál de estas habilidades sientes que es más natural en ti?',
      type: 'scale',
      dimension: 'skills',
      options: [
        { text: 'Empatizar y entender emociones ajenas', value: 5, careers: ['health', 'psychology', 'social', 'education'] },
        { text: 'Pensar lógicamente y resolver problemas complejos', value: 5, careers: ['tech', 'engineering', 'finance'] },
        { text: 'Comunicar ideas de forma clara y persuasiva', value: 5, careers: ['business', 'education', 'media', 'law', 'public'] },
        { text: 'Crear cosas bellas o funcionalmente innovadoras', value: 5, careers: ['creative', 'design', 'architecture', 'arts'] },
        { text: 'Organizar, planificar y ejecutar eficientemente', value: 5, careers: ['business', 'admin', 'project-management'] }
      ]
    },
    {
      id: 10,
      question: 'Si pudieras cambiar algo en el mundo, ¿qué sería?',
      type: 'scale',
      dimension: 'values',
      options: [
        { text: 'Mejorar la salud y bienestar de las personas', value: 5, careers: ['health', 'medicine', 'nutrition', 'psychology'] },
        { text: 'Resolver problemas ambientales y sostenibilidad', value: 5, careers: ['environment', 'sustainability', 'climate'] },
        { text: 'Reducir desigualdades sociales y económicas', value: 5, careers: ['social', 'law', 'politics', 'education', 'public'] },
        { text: 'Avanzar el conocimiento y la tecnología', value: 5, careers: ['tech', 'engineering'] },
        { text: 'Hacer el mundo más bello e inspirador', value: 5, careers: ['arts', 'design', 'architecture', 'creative'] }
      ]
    },
    
    // Bloque 2: Estilo cognitivo (10 preguntas)
    {
      id: 11,
      question: '¿Cómo procesas mejor la información nueva?',
      type: 'scale',
      dimension: 'cognition',
      options: [
        { text: 'Viendo ejemplos visuales y diagramas', value: 5, careers: ['design', 'architecture', 'creative'] },
        { text: 'Leyendo y tomando notas detalladas', value: 5, careers: ['research', 'academic', 'law', 'public'] },
        { text: 'Discutiéndolo con otras personas', value: 5, careers: ['education', 'social', 'business'] },
        { text: 'Experimentando y probando yo mismo', value: 5, careers: ['tech', 'engineering'] },
        { text: 'Relacionándolo con experiencias previas', value: 5, careers: ['health', 'psychology', 'teaching'] }
      ]
    },
    {
      id: 12,
      question: 'Al tomar decisiones importantes, ¿qué pesa más?',
      type: 'scale',
      dimension: 'decision_making',
      options: [
        { text: 'Análisis racional de pros y contras', value: 5, careers: ['business', 'finance', 'engineering'] },
        { text: 'Cómo afectará a las personas involucradas', value: 5, careers: ['health', 'social', 'education'] },
        { text: 'Mi intuición y experiencia acumulada', value: 5, careers: ['entrepreneurship', 'arts', 'business'] },
        { text: 'Evidencia científica y datos objetivos', value: 5, careers: ['science', 'research'] },
        { text: 'Mis valores y principios personales', value: 5, careers: ['psychology', 'social', 'humanities'] }
      ]
    },
    {
      id: 13,
      question: '¿Cuál es tu relación con la incertidumbre?',
      type: 'scale',
      dimension: 'tolerance',
      options: [
        { text: 'La evito, prefiero claridad y estructura', value: 5, careers: ['business', 'admin', 'finance'] },
        { text: 'Me genera ansiedad pero puedo manejarla', value: 4, careers: ['health', 'education', 'social'] },
        { text: 'Me resulta neutral, ni me atrae ni me incomoda', value: 3, careers: ['tech', 'engineering'] },
        { text: 'Me emociona, veo oportunidades', value: 5, careers: ['entrepreneurship', 'research', 'arts'] },
        { text: 'La busco activamente, me aburre lo predecible', value: 5, careers: ['creative', 'entrepreneurship', 'exploration'] }
      ]
    },
    {
      id: 14,
      question: '¿Cómo te relacionas con el fracaso?',
      type: 'scale',
      dimension: 'resilience',
      options: [
        { text: 'Me afecta profundamente, tardo en recuperarme', value: 2, careers: ['admin', 'support'] },
        { text: 'Me frustra pero aprendo de él', value: 4, careers: ['education', 'health', 'business'] },
        { text: 'Lo veo como feedback para mejorar', value: 5, careers: ['tech', 'entrepreneurship'] },
        { text: 'No le doy mucha importancia, sigo adelante', value: 4, careers: ['sports', 'competitive'] },
        { text: 'Me motiva a intentar con más fuerza', value: 5, careers: ['entrepreneurship', 'research', 'competitive'] }
      ]
    },
    {
      id: 15,
      question: 'En un proyecto grupal, naturalmente tiendes a:',
      type: 'scale',
      dimension: 'team_role',
      options: [
        { text: 'Liderar y coordinar al equipo', value: 5, careers: ['business', 'admin', 'management'] },
        { text: 'Generar ideas creativas y soluciones', value: 5, careers: ['creative', 'design', 'innovation'] },
        { text: 'Ejecutar tareas con alta calidad técnica', value: 5, careers: ['tech', 'engineering'] },
        { text: 'Mediar conflictos y mantener armonía', value: 5, careers: ['social', 'psychology', 'HR'] },
        { text: 'Investigar y aportar información valiosa', value: 5, careers: ['research', 'academic', 'analysis'] }
      ]
    },
    {
      id: 16,
      question: '¿Qué tipo de ambiente de trabajo te permitiría prosperar?',
      type: 'scale',
      dimension: 'environment',
      options: [
        { text: 'Estructurado, con procesos claros y predecibles', value: 5, careers: ['admin', 'finance', 'operations'] },
        { text: 'Dinámico, con variedad y nuevos desafíos', value: 5, careers: ['entrepreneurship', 'consulting', 'media'] },
        { text: 'Colaborativo, con mucha interacción humana', value: 5, careers: ['social', 'education', 'health'] },
        { text: 'Tranquilo, que permita concentración profunda', value: 5, careers: ['tech', 'arts'] },
        { text: 'Flexible, con autonomía y libertad creativa', value: 5, careers: ['creative', 'tech', 'freelance'] }
      ]
    },
    {
      id: 17,
      question: '¿Cuál de estos escenarios futuros te atrae más?',
      type: 'scale',
      dimension: 'future_vision',
      options: [
        { text: 'Estabilidad económica y seguridad laboral', value: 4, careers: ['government', 'policy', 'public'] },
        { text: 'Alto impacto social y hacer diferencia', value: 5, careers: ['social', 'health', 'NGO'] },
        { text: 'Reconocimiento como experto en mi campo', value: 5, careers: ['academic', 'research', 'medicine'] },
        { text: 'Libertad para crear y expresarme', value: 5, careers: ['arts', 'creative', 'entrepreneurship'] },
        { text: 'Liderar proyectos importantes e innovadores', value: 5, careers: ['business', 'tech', 'entrepreneurship'] }
      ]
    },
    {
      id: 18,
      question: '¿Qué tan importante es para ti tener un horario flexible?',
      type: 'scale',
      dimension: 'lifestyle',
      options: [
        { text: 'No es importante, prefiero estructura', value: 2, careers: ['admin', 'operations', 'manufacturing'] },
        { text: 'Algo importante, aprecio cierta flexibilidad', value: 3, careers: ['education', 'health', 'business'] },
        { text: 'Muy importante, valoro autonomía de horario', value: 5, careers: ['tech', 'creative', 'freelance'] },
        { text: 'Crucial, no podría trabajar con horario fijo', value: 5, careers: ['entrepreneurship', 'arts', 'consulting'] },
        { text: 'Me adapto, no es factor decisivo', value: 3, careers: ['versatile', 'general'] }
      ]
    },
    {
      id: 19,
      question: 'Al aprender una nueva habilidad, ¿cuál es tu enfoque?',
      type: 'scale',
      dimension: 'learning_style',
      options: [
        { text: 'Seguir un curso estructurado paso a paso', value: 4, careers: ['education', 'health', 'trades'] },
        { text: 'Sumergirme y aprender haciendo', value: 5, careers: ['tech', 'entrepreneurship', 'creative'] },
        { text: 'Estudiar teoría profundamente primero', value: 5, careers: ['academic', 'science', 'research'] },
        { text: 'Buscar mentor o guía experimentado', value: 4, careers: ['health', 'trades', 'arts'] },
        { text: 'Experimentar libremente y descubrir', value: 5, careers: ['creative', 'research', 'innovation'] }
      ]
    },
    {
      id: 20,
      question: '¿Cómo manejas el estrés y la presión?',
      type: 'scale',
      dimension: 'stress',
      options: [
        { text: 'Me paralizo, necesito evitar situaciones de alta presión', value: 2, careers: ['support', 'library', 'research'] },
        { text: 'Puedo manejarlo ocasionalmente pero me desgasta', value: 3, careers: ['education', 'admin', 'health'] },
        { text: 'Lo manejo bien, parte normal del trabajo', value: 4, careers: ['business', 'health', 'teaching'] },
        { text: 'Me desempeño mejor bajo presión', value: 5, careers: ['emergency', 'finance', 'entrepreneurship'] },
        { text: 'Lo busco activamente, me da energía', value: 5, careers: ['sports', 'competitive'] }
      ]
    },

    // Bloque 3: Intereses específicos (10 preguntas)
    {
      id: 21,
      question: '¿Qué tipo de contenido consumes en tu tiempo libre?',
      type: 'scale',
      dimension: 'interests',
      options: [
        { text: 'Documentales científicos y de naturaleza (clima, ecosistemas)', value: 5, careers: ['science', 'research', 'academic', 'environment', 'climate'] },
        { text: 'Arte, diseño y contenido visual', value: 5, careers: ['creative', 'design', 'arts'] },
        { text: 'Noticias, política y temas sociales', value: 5, careers: ['law', 'politics', 'government', 'policy', 'public'] },
        { text: 'Tecnología, innovación y tendencias', value: 5, careers: ['tech', 'business', 'entrepreneurship'] },
        { text: 'Deportes, rendimiento y táctica (competencias, marcas)', value: 5, careers: ['sports', 'fitness', 'competitive'] }
      ]
    },
    {
      id: 22,
      question: 'Si pudieras pasar un día con un profesional, ¿cuál elegirías?',
      type: 'scale',
      dimension: 'role_models',
      options: [
        { text: 'Un científico en su laboratorio', value: 5, careers: ['science', 'research', 'medicine'] },
        { text: 'Un artista en su estudio creativo', value: 5, careers: ['arts', 'design', 'creative'] },
        { text: 'Un emprendedor construyendo su empresa', value: 5, careers: ['entrepreneurship', 'business', 'tech'] },
        { text: 'Un terapeuta en consulta con pacientes', value: 5, careers: ['psychology', 'health', 'counseling'] },
        { text: 'Un ingeniero resolviendo problemas técnicos', value: 5, careers: ['engineering', 'tech', 'construction'] }
      ]
    },
    {
      id: 23,
      question: '¿Qué actividad escolar disfrutabas más?',
      type: 'scale',
      dimension: 'academic_preference',
      options: [
        { text: 'Matemáticas y ciencias exactas', value: 5, careers: ['science', 'tech', 'engineering', 'finance'] },
        { text: 'Literatura, escritura y humanidades', value: 5, careers: ['humanities', 'writing', 'education'] },
        { text: 'Arte, música o expresión creativa', value: 5, careers: ['arts', 'design', 'creative', 'music'] },
        { text: 'Deportes, educación física', value: 5, careers: ['sports', 'fitness', 'competitive'] },
        { text: 'Ciencias sociales e historia', value: 5, careers: ['social', 'humanities', 'teaching'] }
      ]
    },
    {
      id: 24,
      question: '¿Qué tipo de problema te parece más interesante resolver?',
      type: 'scale',
      dimension: 'problem_type',
      options: [
        { text: 'Problemas técnicos con solución lógica', value: 5, careers: ['tech', 'engineering'] },
        { text: 'Desafíos humanos y emocionales', value: 5, careers: ['psychology', 'social', 'health'] },
        { text: 'Retos creativos sin respuesta correcta', value: 5, careers: ['creative', 'arts', 'design'] },
        { text: 'Problemas estratégicos de negocios', value: 5, careers: ['business', 'finance', 'consulting'] },
        { text: 'Misterios científicos sin resolver', value: 5, careers: ['research', 'science', 'academic'] }
      ]
    },
    {
      id: 25,
      question: '¿Qué habilidad te gustaría dominar en los próximos 5 años?',
      type: 'scale',
      dimension: 'aspiration',
      options: [
        { text: 'Programación avanzada o ingeniería', value: 5, careers: ['tech', 'software', 'engineering'] },
        { text: 'Terapia, coaching o psicología', value: 5, careers: ['psychology', 'coaching', 'counseling'] },
        { text: 'Diseño gráfico o artes visuales', value: 5, careers: ['design', 'arts', 'creative'] },
        { text: 'Liderazgo empresarial o emprendimiento', value: 5, careers: ['business', 'entrepreneurship', 'management'] },
        { text: 'Investigación científica avanzada', value: 5, careers: ['research', 'science', 'academic'] }
      ]
    },
    {
      id: 26,
      question: '¿Cómo defines el éxito profesional para ti?',
      type: 'scale',
      dimension: 'success_definition',
      options: [
        { text: 'Ayudar a muchas personas y generar impacto', value: 5, careers: ['social', 'health', 'education', 'NGO'] },
        { text: 'Ser reconocido como experto en mi campo', value: 5, careers: ['academic', 'research', 'medicine', 'law', 'public'] },
        { text: 'Crear algo original que perdure', value: 5, careers: ['arts', 'design', 'architecture', 'writing'] },
        { text: 'Lograr independencia financiera', value: 4, careers: ['business', 'finance', 'entrepreneurship'] },
        { text: 'Hacer descubrimientos que avancen el conocimiento', value: 5, careers: ['research', 'science', 'innovation'] }
      ]
    },
    {
      id: 27,
      question: '¿Qué aspecto del trabajo te motiva más a largo plazo?',
      type: 'scale',
      dimension: 'long_term_motivation',
      options: [
        { text: 'Crecimiento continuo y aprendizaje', value: 5, careers: ['tech', 'research', 'academic'] },
        { text: 'Construir relaciones significativas', value: 5, careers: ['social', 'education', 'health'] },
        { text: 'Libertad creativa y expresión personal', value: 5, careers: ['arts', 'creative', 'entrepreneurship'] },
        { text: 'Resolver desafíos cada vez más complejos', value: 5, careers: ['science', 'engineering', 'consulting'] },
        { text: 'Ver resultados tangibles de mi esfuerzo', value: 5, careers: ['business', 'trades', 'construction'] }
      ]
    },
    {
      id: 28,
      question: 'En un mundo ideal, ¿cuánto contacto directo con personas tendría tu trabajo?',
      type: 'scale',
      dimension: 'social_interaction',
      options: [
        { text: 'Mínimo, prefiero trabajar solo', value: 5, careers: ['tech', 'research', 'writing'] },
        { text: 'Ocasional, equilibrio entre soledad y socialización', value: 4, careers: ['science', 'design', 'business'] },
        { text: 'Regular, con colegas pero no constantemente', value: 3, careers: ['engineering', 'admin', 'finance'] },
        { text: 'Frecuente, interacción diaria con personas', value: 5, careers: ['education', 'sales', 'business'] },
        { text: 'Constante, todo el día trabajando con gente', value: 5, careers: ['health', 'social', 'hospitality'] }
      ]
    },
    {
      id: 29,
      question: '¿Cómo te sientes respecto a hablar en público?',
      type: 'scale',
      dimension: 'public_speaking',
      options: [
        { text: 'Me aterroriza, lo evito a toda costa', value: 1, careers: ['tech', 'research', 'data'] },
        { text: 'Me pone nervioso pero puedo hacerlo', value: 3, careers: ['science', 'health', 'admin'] },
        { text: 'Neutral, no me molesta ni me emociona', value: 3, careers: ['business', 'education', 'consulting'] },
        { text: 'Me gusta, disfruto presentar ideas', value: 5, careers: ['education', 'business', 'media'] },
        { text: 'Me encanta, me da energía', value: 5, careers: ['entertainment', 'politics', 'motivational', 'public'] }
      ]
    },
    {
      id: 30,
      question: 'Cuando algo te apasiona, ¿cuál es tu tendencia natural?',
      type: 'scale',
      dimension: 'passion_expression',
      options: [
        { text: 'Estudiarlo exhaustivamente hasta dominarlo', value: 5, careers: ['research', 'academic', 'expertise'] },
        { text: 'Compartirlo entusiastamente con otros', value: 5, careers: ['education', 'social', 'media'] },
        { text: 'Crear algo inspirado en ello', value: 5, careers: ['arts', 'creative', 'design'] },
        { text: 'Aplicarlo prácticamente para resolver problemas', value: 5, careers: ['tech', 'engineering', 'business'] },
        { text: 'Experimentar y explorar sus límites', value: 5, careers: ['research', 'innovation', 'science'] }
      ]
    },

    // Bloque 4: Deseo, valores y dirección (12 preguntas)
    {
      id: 31,
      question: 'Si el dinero estuviera resuelto por 2 años, ¿qué elegirías construir con tu tiempo?',
      type: 'scale',
      dimension: 'desire',
      options: [
        { text: 'Un proyecto creativo (arte, diseño, contenido, marca)', value: 5, careers: ['creative', 'design', 'arts', 'media', 'writing'] },
        { text: 'Un producto digital o sistema (software, automatización)', value: 5, careers: ['tech', 'software', 'data', 'engineering'] },
        { text: 'Una práctica de ayuda (terapia, acompañamiento, educación)', value: 5, careers: ['psychology', 'health', 'education', 'counseling'] },
        { text: 'Una iniciativa social/pública (comunidad, derechos, políticas)', value: 5, careers: ['public', 'law', 'rights', 'policy', 'government', 'politics'] },
        { text: 'Una empresa o servicio (ventas, operaciones, estrategia)', value: 5, careers: ['business', 'entrepreneurship', 'management', 'operations'] }
      ]
    },
    {
      id: 32,
      question: '¿Qué tipo de conversación te enciende por dentro?',
      type: 'scale',
      dimension: 'desire',
      options: [
        { text: 'Sobre ideas y teorías (por qué somos como somos)', value: 5, careers: ['psychology', 'humanities', 'philosophy', 'academic'] },
        { text: 'Sobre cómo mejorar procesos y resultados', value: 5, careers: ['business', 'operations', 'finance', 'engineering'] },
        { text: 'Sobre cómo funcionan los sistemas (código, ciencia, lógica)', value: 5, careers: ['tech', 'data', 'software'] },
        { text: 'Sobre estética, emoción y creación', value: 5, careers: ['creative', 'design', 'arts'] },
        { text: 'Sobre personas, vínculos y sociedad', value: 5, careers: ['social', 'education', 'health', 'psychology'] }
      ]
    },
    {
      id: 33,
      question: '¿Qué te cuesta más tolerar en un trabajo?',
      type: 'scale',
      dimension: 'constraints',
      options: [
        { text: 'Rutina rígida y poca autonomía', value: 5, careers: ['entrepreneurship', 'creative', 'freelance'] },
        { text: 'Conflictos humanos constantes sin propósito claro', value: 5, careers: ['tech', 'research', 'engineering'] },
        { text: 'Ambigüedad total sin criterios ni estructura', value: 5, careers: ['admin', 'finance', 'operations'] },
        { text: 'Presión por resultados sin ética o sentido', value: 5, careers: ['social', 'education', 'health'] },
        { text: 'Soledad extrema sin intercambio humano', value: 5, careers: ['education', 'social', 'health', 'business'] }
      ]
    },
    {
      id: 34,
      question: '¿Qué te mueve más: sentido, estética, poder, verdad o cuidado?',
      type: 'scale',
      dimension: 'values_core',
      options: [
        { text: 'Sentido/propósito (hacer algo significativo)', value: 5, careers: ['social', 'education', 'psychology'] },
        { text: 'Estética/creación (hacer algo bello)', value: 5, careers: ['creative', 'design', 'arts', 'architecture'] },
        { text: 'Poder/impacto (liderar y decidir)', value: 5, careers: ['business', 'management', 'entrepreneurship'] },
        { text: 'Verdad/conocimiento (comprender y demostrar)', value: 5, careers: ['science', 'research', 'academic'] },
        { text: 'Cuidado/salud (acompañar procesos y sanar)', value: 5, careers: ['health', 'psychology', 'counseling'] }
      ]
    },
    {
      id: 35,
      question: 'Si tu trabajo ideal fuera un escenario, ¿qué rol tendrías?',
      type: 'scale',
      dimension: 'role_identity',
      options: [
        { text: 'Arquitecto de sistemas (estructura y funcionamiento)', value: 5, careers: ['tech', 'engineering', 'operations'] },
        { text: 'Creador (forma, emoción y lenguaje)', value: 5, careers: ['creative', 'design', 'writing', 'arts'] },
        { text: 'Guía/terapeuta (escucha, intervención, transformación)', value: 5, careers: ['psychology', 'health', 'education'] },
        { text: 'Estratega (visión, negociación, mercado)', value: 5, careers: ['business', 'finance', 'consulting', 'sales'] },
        { text: 'Investigador (pregunta, hipótesis, evidencia)', value: 5, careers: ['science', 'research', 'academic', 'data'] }
      ]
    },
    {
      id: 36,
      question: '¿Qué te es más natural: persuadir, cuidar, crear, analizar o construir?',
      type: 'scale',
      dimension: 'natural_drive',
      options: [
        { text: 'Persuadir/negociar y mover decisiones', value: 5, careers: ['business', 'sales', 'management'] },
        { text: 'Cuidar/acompañar y sostener procesos humanos', value: 5, careers: ['health', 'psychology', 'education'] },
        { text: 'Crear/imaginar y traducirlo en forma', value: 5, careers: ['creative', 'design', 'arts'] },
        { text: 'Analizar/entender y explicar con rigor', value: 5, careers: ['science', 'research', 'academic'] },
        { text: 'Construir/hacer funcionar sistemas', value: 5, careers: ['tech', 'engineering', 'operations'] }
      ]
    },
    {
      id: 37,
      question: 'En un entorno nuevo, ¿qué buscas primero?',
      type: 'scale',
      dimension: 'orientation',
      options: [
        { text: 'Personas clave y dinámica del grupo', value: 5, careers: ['social', 'education', 'business'] },
        { text: 'Reglas, procesos y estructura', value: 5, careers: ['admin', 'operations', 'finance'] },
        { text: 'Datos, métricas y hechos', value: 5, careers: ['science', 'data', 'research'] },
        { text: 'Posibilidades creativas y estética', value: 5, careers: ['creative', 'design', 'arts'] },
        { text: 'Herramientas, sistemas y cómo optimizarlos', value: 5, careers: ['tech', 'engineering'] }
      ]
    },
    {
      id: 38,
      question: '¿Qué preferirías dominar antes: una habilidad humana o una técnica?',
      type: 'scale',
      dimension: 'preference_human_tech',
      options: [
        { text: 'Habilidad humana (escucha, liderazgo, enseñanza)', value: 5, careers: ['psychology', 'education', 'management'] },
        { text: 'Habilidad técnica (programar, diseñar, construir)', value: 5, careers: ['tech', 'creative', 'engineering'] },
        { text: 'Habilidad científica (método, investigación, laboratorio)', value: 5, careers: ['science', 'research', 'academic'] },
        { text: 'Habilidad comercial (vender, negociar, escalar)', value: 5, careers: ['business', 'sales', 'entrepreneurship'] },
        { text: 'Una mezcla equilibrada', value: 4, careers: ['business', 'tech', 'education'] }
      ]
    },
    {
      id: 39,
      question: '¿Qué tipo de éxito te da paz (no solo emoción)?',
      type: 'scale',
      dimension: 'peace_success',
      options: [
        { text: 'Ser útil y cercano para otros', value: 5, careers: ['health', 'education', 'social', 'psychology'] },
        { text: 'Hacer una obra/creación propia', value: 5, careers: ['creative', 'arts', 'design', 'writing'] },
        { text: 'Ser competente y respetado por rigor', value: 5, careers: ['science', 'research', 'engineering'] },
        { text: 'Lograr independencia y control de mis decisiones', value: 5, careers: ['business', 'entrepreneurship', 'finance'] },
        { text: 'Resolver problemas difíciles con elegancia', value: 5, careers: ['tech', 'engineering'] }
      ]
    },
    {
      id: 40,
      question: '¿Qué tan dispuesto estás a especializarte profundamente (años) en un campo?',
      type: 'scale',
      dimension: 'specialization',
      options: [
        { text: 'Mucho, me atrae la maestría', value: 5, careers: ['science', 'research', 'psychology', 'engineering'] },
        { text: 'Medio, prefiero ser generalista fuerte', value: 4, careers: ['business', 'tech', 'consulting'] },
        { text: 'Poco, prefiero variedad constante', value: 3, careers: ['creative', 'entrepreneurship', 'media'] },
        { text: 'Depende: si hay sentido, sí', value: 4, careers: ['health', 'education', 'social'] },
        { text: 'Me interesa más explorar que profundizar', value: 3, careers: ['entrepreneurship', 'creative', 'exploration'] }
      ]
    },
    {
      id: 41,
      question: '¿Qué tipo de problemas evitarías si pudieras elegir?',
      type: 'scale',
      dimension: 'avoidance',
      options: [
        { text: 'Problemas humanos/emocionales intensos', value: 5, careers: ['tech', 'engineering', 'finance'] },
        { text: 'Problemas abstractos sin aplicación práctica', value: 5, careers: ['business', 'sales', 'operations'] },
        { text: 'Problemas técnicos que requieren concentración prolongada', value: 5, careers: ['social', 'education', 'health'] },
        { text: 'Problemas estéticos sin criterios claros', value: 5, careers: ['science', 'engineering', 'admin'] },
        { text: 'Problemas de negociación y conflicto por poder', value: 5, careers: ['research', 'science', 'creative'] }
      ]
    },
    {
      id: 42,
      question: '¿Qué te da más energía en un día de trabajo?',
      type: 'scale',
      dimension: 'energy_source',
      options: [
        { text: 'Cerrar un acuerdo o mover una estrategia', value: 5, careers: ['business', 'sales', 'management'] },
        { text: 'Tener una conversación profunda y significativa', value: 5, careers: ['psychology', 'education', 'social'] },
        { text: 'Resolver un bug o un problema técnico complejo', value: 5, careers: ['tech', 'engineering', 'data'] },
        { text: 'Diseñar algo bello y funcional', value: 5, careers: ['creative', 'design'] },
        { text: 'Descubrir un patrón nuevo o una hipótesis sólida', value: 5, careers: ['science', 'research', 'academic'] }
      ]
    },

    // Bloque 5: Decisión y mundo real (12 preguntas)
    {
      id: 43,
      question: '¿Qué tanto te importa la estabilidad económica en la elección de carrera?',
      type: 'scale',
      dimension: 'economics',
      options: [
        { text: 'Muchísimo: es prioridad central', value: 5, careers: ['finance', 'business', 'admin'] },
        { text: 'Importa, pero no define todo', value: 4, careers: ['business', 'tech', 'health'] },
        { text: 'Me importa más el sentido que el dinero', value: 5, careers: ['social', 'education', 'psychology'] },
        { text: 'Me importa más la libertad que la estabilidad', value: 5, careers: ['entrepreneurship', 'creative', 'freelance'] },
        { text: 'Depende del momento de vida', value: 3, careers: ['versatile', 'general'] }
      ]
    },
    {
      id: 44,
      question: 'Cuando piensas en “trabajo”, ¿qué imagen aparece primero?',
      type: 'scale',
      dimension: 'work_image',
      options: [
        { text: 'Un espacio de creación y expresión', value: 5, careers: ['creative', 'design', 'arts'] },
        { text: 'Un espacio de servicio y cuidado', value: 5, careers: ['health', 'psychology', 'education'] },
        { text: 'Un espacio de análisis y método', value: 5, careers: ['science', 'research', 'academic'] },
        { text: 'Un espacio de estrategia y logro', value: 5, careers: ['business', 'management', 'entrepreneurship'] },
        { text: 'Un espacio de construcción técnica', value: 5, careers: ['tech', 'engineering'] }
      ]
    },
    {
      id: 45,
      question: '¿Qué te atrae más: profundidad, velocidad o visibilidad?',
      type: 'scale',
      dimension: 'tempo',
      options: [
        { text: 'Profundidad (entender a fondo)', value: 5, careers: ['research', 'science', 'psychology'] },
        { text: 'Velocidad (iterar y mover rápido)', value: 5, careers: ['tech', 'entrepreneurship', 'business'] },
        { text: 'Visibilidad (presentar y comunicar)', value: 5, careers: ['education', 'media', 'business'] },
        { text: 'Equilibrio según proyecto', value: 4, careers: ['consulting', 'management', 'tech'] },
        { text: 'Depende del equipo, no de mí', value: 3, careers: ['admin', 'operations'] }
      ]
    },
    {
      id: 46,
      question: '¿Cómo te llevas con vender (ideas, servicios, productos)?',
      type: 'scale',
      dimension: 'selling',
      options: [
        { text: 'Me gusta y se me da bien', value: 5, careers: ['sales', 'business', 'entrepreneurship'] },
        { text: 'Puedo hacerlo si es ético y útil', value: 4, careers: ['education', 'health', 'business'] },
        { text: 'Me incomoda; prefiero que hable el trabajo', value: 4, careers: ['research', 'tech', 'creative'] },
        { text: 'Lo evitaría si pudiera', value: 3, careers: ['science', 'engineering', 'support'] },
        { text: 'Depende del contexto', value: 3, careers: ['versatile', 'general'] }
      ]
    },
    {
      id: 47,
      question: '¿Qué tipo de responsabilidad prefieres cargar?',
      type: 'scale',
      dimension: 'responsibility',
      options: [
        { text: 'Responsabilidad técnica (que funcione)', value: 5, careers: ['tech', 'engineering', 'operations'] },
        { text: 'Responsabilidad humana (que el otro esté bien)', value: 5, careers: ['health', 'psychology', 'education'] },
        { text: 'Responsabilidad económica (resultado, presupuesto)', value: 5, careers: ['business', 'finance', 'management'] },
        { text: 'Responsabilidad creativa (forma, narrativa, estética)', value: 5, careers: ['creative', 'design', 'media'] },
        { text: 'Responsabilidad científica (evidencia y rigor)', value: 5, careers: ['science', 'research', 'academic'] }
      ]
    },
    {
      id: 48,
      question: '¿Qué tipo de feedback te ayuda más?',
      type: 'scale',
      dimension: 'feedback',
      options: [
        { text: 'Métricas y datos', value: 5, careers: ['data', 'tech', 'business'] },
        { text: 'Observación cualitativa (lo que provocó en alguien)', value: 5, careers: ['psychology', 'education', 'creative'] },
        { text: 'Revisión técnica (calidad, estándares)', value: 5, careers: ['tech', 'engineering'] },
        { text: 'Reconocimiento público (audiencia, impacto)', value: 5, careers: ['media', 'business', 'arts'] },
        { text: 'Un mentor con criterio', value: 4, careers: ['research', 'health', 'trades'] }
      ]
    },
    {
      id: 49,
      question: '¿Qué te pesa más cuando eliges un camino?',
      type: 'scale',
      dimension: 'decision_weight',
      options: [
        { text: 'Seguridad y previsibilidad', value: 5, careers: ['admin', 'finance', 'operations'] },
        { text: 'Impacto humano', value: 5, careers: ['health', 'psychology', 'social'] },
        { text: 'Libertad y autonomía', value: 5, careers: ['entrepreneurship', 'creative', 'freelance'] },
        { text: 'Desafío intelectual', value: 5, careers: ['tech', 'engineering'] },
        { text: 'Posibilidad de liderazgo', value: 5, careers: ['business', 'management', 'entrepreneurship'] }
      ]
    },
    {
      id: 50,
      question: '¿Con qué te identificas más?',
      type: 'scale',
      dimension: 'identity_axis',
      options: [
        { text: 'Soy constructor de soluciones', value: 5, careers: ['tech', 'engineering', 'operations'] },
        { text: 'Soy intérprete de lo humano', value: 5, careers: ['psychology', 'humanities', 'education'] },
        { text: 'Soy creador de formas y experiencias', value: 5, careers: ['creative', 'design', 'arts'] },
        { text: 'Soy estratega de resultados', value: 5, careers: ['business', 'finance', 'management'] },
        { text: 'Soy buscador de verdad', value: 5, careers: ['science', 'research', 'academic'] }
      ]
    },
    {
      id: 51,
      question: '¿Qué tan importante es para ti trabajar con ética explícita?',
      type: 'scale',
      dimension: 'ethics',
      options: [
        { text: 'Es central; sin ética no puedo sostenerlo', value: 5, careers: ['health', 'psychology', 'social'] },
        { text: 'Importa; busco coherencia', value: 4, careers: ['education', 'business', 'science'] },
        { text: 'Depende del rol y del sistema', value: 3, careers: ['operations', 'admin', 'engineering'] },
        { text: 'No lo pienso tanto, priorizo resultados', value: 3, careers: ['business', 'sales', 'entrepreneurship'] },
        { text: 'Me guía más la evidencia y el método', value: 4, careers: ['science', 'research'] }
      ]
    },
    {
      id: 52,
      question: 'Si hoy tuvieras que elegir una sola dirección para 12 meses, ¿cuál sería?',
      type: 'scale',
      dimension: '12_month_choice',
      options: [
        { text: 'Estudiar/entrenarme técnicamente (código, datos, ingeniería)', value: 5, careers: ['tech', 'data', 'engineering'] },
        { text: 'Entrenar una habilidad humana (terapia, enseñanza, liderazgo)', value: 5, careers: ['psychology', 'education', 'management'] },
        { text: 'Construir un portafolio creativo (diseño, contenido, arte)', value: 5, careers: ['creative', 'design', 'arts', 'media'] },
        { text: 'Escalar un proyecto de negocio (ventas, estrategia)', value: 5, careers: ['business', 'sales', 'entrepreneurship'] },
        { text: 'Entrar en investigación/metodología (ciencia, papers)', value: 5, careers: ['science', 'research', 'academic'] }
      ]
    },
    {
      id: 53,
      question: '¿Qué tanto disfrutas la precisión y el detalle?',
      type: 'scale',
      dimension: 'precision',
      options: [
        { text: 'Mucho, me calma y me ordena', value: 5, careers: ['engineering', 'finance', 'operations'] },
        { text: 'Me gusta si tiene sentido práctico', value: 4, careers: ['tech', 'business', 'health'] },
        { text: 'Me aburre; prefiero visión general', value: 3, careers: ['entrepreneurship', 'creative', 'management'] },
        { text: 'Depende: en arte sí, en burocracia no', value: 4, careers: ['creative', 'design', 'arts'] },
        { text: 'Prefiero exploración, no exactitud', value: 3, careers: ['exploration', 'media', 'arts'] }
      ]
    },
    {
      id: 54,
      question: 'Cuando te imaginas creciendo, ¿qué te entusiasma más?',
      type: 'scale',
      dimension: 'growth_direction',
      options: [
        { text: 'Ser referente técnico', value: 5, careers: ['tech', 'engineering', 'data'] },
        { text: 'Acompañar procesos humanos complejos', value: 5, careers: ['psychology', 'health', 'education'] },
        { text: 'Crear obras, marcas o experiencias', value: 5, careers: ['creative', 'design', 'arts'] },
        { text: 'Liderar equipos y proyectos grandes', value: 5, careers: ['business', 'management', 'entrepreneurship'] },
        { text: 'Investigar y producir conocimiento', value: 5, careers: ['science', 'research', 'academic'] }
      ]
    }
  ]

  const followUpsByCluster = {
    Creativo: [
      {
        id: 2001,
        question: 'Cuando creas, ¿qué te sostiene más?',
        type: 'scale',
        dimension: 'followup_creative',
        options: [
          { text: 'Concepto e idea (dirección)', value: 5, careers: ['design', 'creative', 'strategy'] },
          { text: 'Forma y estética (sensibilidad)', value: 5, careers: ['arts', 'design', 'creative'] },
          { text: 'Narrativa y lenguaje (mensaje)', value: 5, careers: ['writing', 'media'] },
          { text: 'Sistema y consistencia (método)', value: 4, careers: ['design', 'tech', 'branding'] },
          { text: 'Experimentación (juego)', value: 5, careers: ['arts', 'creative', 'innovation'] }
        ]
      }
      ,
      {
        id: 2002,
        question: '¿Qué te interesa más dominar en lo creativo?',
        type: 'scale',
        dimension: 'followup_creative',
        options: [
          { text: 'Diseño visual / composición', value: 5, careers: ['design', 'creative'] },
          { text: 'Narrativa / escritura / guion', value: 5, careers: ['writing', 'media'] },
          { text: 'Marca / identidad / estilo', value: 5, careers: ['branding', 'design', 'business'] },
          { text: 'Audio / música / ritmo', value: 5, careers: ['arts', 'media'] },
          { text: 'Experiencias digitales (UX)', value: 5, careers: ['ux', 'design', 'tech'] }
        ]
      },
      {
        id: 2003,
        question: '¿Qué tipo de proyecto te llama más?',
        type: 'scale',
        dimension: 'followup_creative',
        options: [
          { text: 'Campañas / contenido', value: 5, careers: ['media', 'marketing'] },
          { text: 'Producto / interfaz', value: 5, careers: ['design', 'ux', 'product'] },
          { text: 'Arte / exposición', value: 5, careers: ['arts', 'creative'] },
          { text: 'Dirección creativa', value: 5, careers: ['creative', 'management', 'branding'] },
          { text: 'Arquitectura / espacio', value: 5, careers: ['architecture', 'design', 'engineering'] }
        ]
      },
      {
        id: 2004,
        question: '¿Cómo prefieres trabajar creativamente?',
        type: 'scale',
        dimension: 'followup_creative',
        options: [
          { text: 'Solo, con inmersión', value: 4, careers: ['creative', 'arts'] },
          { text: 'En equipo, rebotando ideas', value: 5, careers: ['media', 'design', 'business'] },
          { text: 'Con un brief claro y límites', value: 5, careers: ['design', 'branding', 'operations'] },
          { text: 'Con libertad total', value: 5, careers: ['arts', 'creative'] },
          { text: 'Entre ciclos: crear/pausar/volver', value: 4, careers: ['creative', 'humanities'] }
        ]
      },
      {
        id: 2005,
        question: '¿Qué te cuesta más en lo creativo?',
        type: 'scale',
        dimension: 'followup_creative',
        options: [
          { text: 'Poner precio / vender', value: 4, careers: ['business', 'media'] },
          { text: 'Sostener rutina', value: 4, careers: ['operations', 'creative'] },
          { text: 'Elegir una dirección', value: 4, careers: ['creative', 'research'] },
          { text: 'Tolerar crítica', value: 4, careers: ['creative', 'media'] },
          { text: 'Terminar proyectos', value: 4, careers: ['operations', 'creative'] }
        ]
      },
      {
        id: 2006,
        question: '¿Qué te interesa más en diseño?',
        type: 'scale',
        dimension: 'followup_creative',
        options: [
          { text: 'Identidad / marca', value: 5, careers: ['branding', 'design'] },
          { text: 'Interfaces / apps', value: 5, careers: ['ux', 'ui', 'tech'] },
          { text: 'Ilustración', value: 5, careers: ['arts', 'design'] },
          { text: 'Animación / motion', value: 5, careers: ['media', 'design'] },
          { text: 'Diseño editorial', value: 5, careers: ['writing', 'design', 'media'] }
        ]
      },
      {
        id: 2007,
        question: '¿Qué tipo de estética te atrae más?',
        type: 'scale',
        dimension: 'followup_creative',
        options: [
          { text: 'Minimalista / ordenada', value: 4, careers: ['design', 'operations'] },
          { text: 'Expresiva / emocional', value: 5, careers: ['arts', 'creative'] },
          { text: 'Experimental', value: 5, careers: ['creative', 'innovation'] },
          { text: 'Funcional', value: 5, careers: ['ux', 'tech', 'design'] },
          { text: 'Clásica', value: 4, careers: ['design', 'branding'] }
        ]
      },
      {
        id: 2008,
        question: '¿Qué preferirías mejorar?',
        type: 'scale',
        dimension: 'followup_creative',
        options: [
          { text: 'Mi portafolio', value: 5, careers: ['design', 'creative'] },
          { text: 'Mi narrativa personal', value: 5, careers: ['writing', 'media'] },
          { text: 'Mis herramientas digitales', value: 5, careers: ['design', 'tech'] },
          { text: 'Mi método/constancia', value: 5, careers: ['operations', 'design'] },
          { text: 'Mi estilo propio', value: 5, careers: ['arts', 'creative'] }
        ]
      },
      {
        id: 2009,
        question: '¿Qué te atrae más del mundo creativo?',
        type: 'scale',
        dimension: 'followup_creative',
        options: [
          { text: 'Comunicar ideas', value: 5, careers: ['media', 'design'] },
          { text: 'Diseñar experiencias', value: 5, careers: ['ux', 'product', 'design'] },
          { text: 'Arte como exploración', value: 5, careers: ['arts', 'creative'] },
          { text: 'Construir marca', value: 5, careers: ['branding', 'business', 'design'] },
          { text: 'Estética aplicada a lo cotidiano', value: 5, careers: ['design', 'creative'] }
        ]
      },
      {
        id: 2010,
        question: 'Si tuvieras que elegir una “arena”, sería:',
        type: 'scale',
        dimension: 'followup_creative',
        options: [
          { text: 'Digital', value: 5, careers: ['ux', 'ui', 'media'] },
          { text: 'Editorial', value: 5, careers: ['writing', 'design', 'media'] },
          { text: 'Audiovisual', value: 5, careers: ['media'] },
          { text: 'Espacial', value: 5, careers: ['architecture', 'design'] },
          { text: 'Multidisciplinar', value: 4, careers: ['creative', 'innovation'] }
        ]
      }
    ],
    Cuidado: [
      {
        id: 2251,
        question: 'En cuidado/rendimiento, ¿qué te atrae más?',
        type: 'scale',
        dimension: 'followup_care',
        options: [
          { text: 'Salud clínica (diagnóstico, tratamiento)', value: 5, careers: ['health', 'medicine'] },
          { text: 'Nutrición y hábitos', value: 5, careers: ['health', 'nutrition'] },
          { text: 'Deporte y rendimiento', value: 5, careers: ['sports', 'fitness', 'competitive'] },
          { text: 'Prevención y bienestar', value: 5, careers: ['health'] },
          { text: 'Entrenamiento/planificación', value: 5, careers: ['sports', 'fitness', 'competitive'] }
        ]
      },
      {
        id: 2252,
        question: '¿Qué te motiva más en el cuerpo?',
        type: 'scale',
        dimension: 'followup_care',
        options: [
          { text: 'Recuperación y salud a largo plazo', value: 5, careers: ['health'] },
          { text: 'Mejora de rendimiento medible', value: 5, careers: ['sports', 'competitive'] },
          { text: 'Entender sistemas del cuerpo', value: 5, careers: ['health', 'science'] },
          { text: 'Rutinas y constancia', value: 4, careers: ['sports', 'operations'] },
          { text: 'Acompañar a otros (hábitos)', value: 5, careers: ['health', 'education'] }
        ]
      },
      {
        id: 2253,
        question: '¿Qué tipo de reto disfrutas más?',
        type: 'scale',
        dimension: 'followup_care',
        options: [
          { text: 'Casos concretos (resolver y cuidar)', value: 5, careers: ['health', 'emergency'] },
          { text: 'Competencia y superar marcas', value: 5, careers: ['sports', 'competitive'] },
          { text: 'Mejorar hábitos con disciplina', value: 4, careers: ['health', 'operations'] },
          { text: 'Entrenar técnica y constancia', value: 5, careers: ['sports', 'fitness', 'competitive'] },
          { text: 'Aprender nuevas metodologías', value: 4, careers: ['health', 'science'] }
        ]
      },
      {
        id: 2254,
        question: '¿Qué te interesa más estudiar?',
        type: 'scale',
        dimension: 'followup_care',
        options: [
          { text: 'Fisiología / anatomía', value: 5, careers: ['health', 'science'] },
          { text: 'Entrenamiento deportivo', value: 5, careers: ['sports'] },
          { text: 'Nutrición', value: 5, careers: ['nutrition', 'health'] },
          { text: 'Rehabilitación', value: 5, careers: ['health'] },
          { text: 'Psicología del rendimiento', value: 4, careers: ['sports', 'psychology'] }
        ]
      },
      {
        id: 2255,
        question: 'Si eliges una ruta de cuidado, preferirías:',
        type: 'scale',
        dimension: 'followup_care',
        options: [
          { text: 'Clínica (salud)', value: 5, careers: ['health', 'medicine'] },
          { text: 'Deporte (rendimiento)', value: 5, careers: ['sports'] },
          { text: 'Bienestar (hábitos)', value: 5, careers: ['health'] },
          { text: 'Emergencias', value: 5, careers: ['health', 'emergency'] },
          { text: 'Mixto', value: 4, careers: ['health', 'sports'] }
        ]
      },
      {
        id: 2256,
        question: 'En deporte, ¿qué te interesa más desarrollar?',
        type: 'scale',
        dimension: 'followup_care',
        options: [
          { text: 'Rendimiento (competir, marcas, métricas)', value: 5, careers: ['sports', 'competitive'] },
          { text: 'Fuerza y acondicionamiento', value: 5, careers: ['sports', 'fitness'] },
          { text: 'Táctica y estrategia de juego', value: 4, careers: ['sports', 'competitive'] },
          { text: 'Disciplina y constancia', value: 4, careers: ['sports', 'operations'] },
          { text: 'Recuperación y prevención', value: 3, careers: ['health'] }
        ]
      },
      {
        id: 2257,
        question: '¿Qué entorno deportivo disfrutas más?',
        type: 'scale',
        dimension: 'followup_care',
        options: [
          { text: 'Entrenar y mejorar día a día', value: 5, careers: ['sports', 'fitness'] },
          { text: 'Competencia (torneos, presión)', value: 5, careers: ['sports', 'competitive'] },
          { text: 'Trabajo en equipo', value: 4, careers: ['sports'] },
          { text: 'Datos y rendimiento (medir, comparar)', value: 4, careers: ['sports', 'data'] },
          { text: 'Recuperación y prevención', value: 3, careers: ['health'] }
        ]
      }
    ],
    Sistemas: [
      {
        id: 2101,
        question: '¿Qué tipo de problema técnico te atrae más?',
        type: 'scale',
        dimension: 'followup_systems',
        options: [
          { text: 'Automatizar y optimizar procesos', value: 5, careers: ['tech', 'operations', 'engineering'] },
          { text: 'Diseñar arquitectura y sistemas complejos', value: 5, careers: ['tech', 'engineering', 'software'] },
          { text: 'Datos: patrones, modelos, predicción', value: 5, careers: ['data', 'tech'] },
          { text: 'Seguridad y confiabilidad', value: 5, careers: ['cybersecurity', 'devops', 'tech'] },
          { text: 'Prototipar y construir rápido', value: 5, careers: ['tech', 'entrepreneurship', 'product'] }
        ]
      }
      ,
      {
        id: 2102,
        question: '¿Qué te atrae más: producto, infraestructura o datos?',
        type: 'scale',
        dimension: 'followup_systems',
        options: [
          { text: 'Producto (usuario, features)', value: 5, careers: ['product', 'tech', 'business'] },
          { text: 'Infraestructura (reliability)', value: 5, careers: ['devops', 'tech'] },
          { text: 'Datos (modelos, análisis)', value: 5, careers: ['data', 'tech'] },
          { text: 'Seguridad', value: 5, careers: ['cybersecurity', 'tech'] },
          { text: 'Automatización de procesos', value: 5, careers: ['automation', 'operations', 'tech'] }
        ]
      },
      {
        id: 2103,
        question: '¿Cómo te gusta validar que algo funciona?',
        type: 'scale',
        dimension: 'followup_systems',
        options: [
          { text: 'Con pruebas y métricas', value: 5, careers: ['tech', 'engineering'] },
          { text: 'Con usuarios reales', value: 5, careers: ['product', 'business', 'ux'] },
          { text: 'Con simulaciones', value: 5, careers: ['tech', 'engineering'] },
          { text: 'Con intuición y revisión', value: 3, careers: ['tech', 'creative'] },
          { text: 'Con checklist y procesos', value: 4, careers: ['operations', 'engineering'] }
        ]
      },
      {
        id: 2104,
        question: '¿Qué tipo de lógica te atrae más?',
        type: 'scale',
        dimension: 'followup_systems',
        options: [
          { text: 'Algoritmos / optimización', value: 5, careers: ['tech'] },
          { text: 'Arquitectura / sistemas', value: 5, careers: ['tech', 'engineering'] },
          { text: 'Redes / seguridad', value: 5, careers: ['cybersecurity', 'tech'] },
          { text: 'Automatización industrial', value: 5, careers: ['engineering', 'operations'] },
          { text: 'Interfaces (UX + lógica)', value: 5, careers: ['ux', 'tech', 'design'] }
        ]
      },
      {
        id: 2105,
        question: '¿Qué te frustra más?',
        type: 'scale',
        dimension: 'followup_systems',
        options: [
          { text: 'Ambigüedad sin criterios', value: 5, careers: ['engineering'] },
          { text: 'Procesos lentos', value: 4, careers: ['tech', 'entrepreneurship'] },
          { text: 'Errores repetidos', value: 5, careers: ['engineering', 'operations'] },
          { text: 'Falta de datos', value: 5, careers: ['data', 'tech'] },
          { text: 'Herramientas mal diseñadas', value: 5, careers: ['ux', 'tech'] }
        ]
      },
      {
        id: 2106,
        question: '¿Qué preferirías construir?',
        type: 'scale',
        dimension: 'followup_systems',
        options: [
          { text: 'Un producto digital', value: 5, careers: ['tech', 'product'] },
          { text: 'Una app con datos', value: 5, careers: ['data', 'tech'] },
          { text: 'Un sistema robusto', value: 5, careers: ['devops', 'tech'] },
          { text: 'Un proceso industrial', value: 5, careers: ['engineering', 'operations'] },
          { text: 'Una solución de seguridad', value: 5, careers: ['cybersecurity', 'tech'] }
        ]
      },
      {
        id: 2107,
        question: '¿Qué te atrae más aprender?',
        type: 'scale',
        dimension: 'followup_systems',
        options: [
          { text: 'Programación', value: 5, careers: ['tech'] },
          { text: 'Matemática aplicada', value: 5, careers: ['science', 'data'] },
          { text: 'Electrónica / física', value: 5, careers: ['engineering', 'science'] },
          { text: 'Procesos / operaciones', value: 5, careers: ['operations', 'engineering'] },
          { text: 'Diseño de producto', value: 5, careers: ['product', 'ux', 'tech'] }
        ]
      },
      {
        id: 2108,
        question: '¿Cómo te gusta trabajar?',
        type: 'scale',
        dimension: 'followup_systems',
        options: [
          { text: 'Con foco profundo', value: 4, careers: ['tech'] },
          { text: 'Con tickets y ejecución', value: 5, careers: ['operations', 'engineering'] },
          { text: 'Experimentando rápido', value: 5, careers: ['tech', 'entrepreneurship'] },
          { text: 'Con documentación clara', value: 5, careers: ['engineering'] },
          { text: 'Con colaboración producto/UX', value: 5, careers: ['product', 'ux', 'tech'] }
        ]
      },
      {
        id: 2109,
        question: '¿Qué te interesa más del mundo técnico?',
        type: 'scale',
        dimension: 'followup_systems',
        options: [
          { text: 'Crear herramientas', value: 5, careers: ['tech'] },
          { text: 'Resolver fallas', value: 5, careers: ['devops', 'engineering'] },
          { text: 'Proteger sistemas', value: 5, careers: ['cybersecurity', 'tech'] },
          { text: 'Comprender modelos', value: 5, careers: ['data', 'tech'] },
          { text: 'Optimizar procesos', value: 5, careers: ['operations', 'engineering'] }
        ]
      },
      {
        id: 2110,
        question: 'Si tuvieras que elegir una especialidad, sería:',
        type: 'scale',
        dimension: 'followup_systems',
        options: [
          { text: 'Software', value: 5, careers: ['software', 'tech'] },
          { text: 'Datos', value: 5, careers: ['data', 'tech'] },
          { text: 'Infra/DevOps', value: 5, careers: ['devops', 'tech'] },
          { text: 'Ingeniería', value: 5, careers: ['engineering'] },
          { text: 'Ciberseguridad', value: 5, careers: ['cybersecurity', 'tech'] }
        ]
      }
    ],
    Humano: [
      {
        id: 2201,
        question: 'En lo humano, ¿qué te interesa más trabajar?',
        type: 'scale',
        dimension: 'followup_human',
        options: [
          { text: 'Escucha y transformación subjetiva', value: 5, careers: ['psychology', 'counseling', 'humanities'] },
          { text: 'Enseñanza y formación', value: 5, careers: ['education', 'teaching', 'training'] },
          { text: 'Vínculos, mediación y comunidad', value: 5, careers: ['social', 'HR', 'NGO'] },
          { text: 'Salud y cuidado concreto', value: 5, careers: ['health', 'medicine', 'nutrition'] },
          { text: 'Liderazgo humano y cultura', value: 5, careers: ['management', 'HR', 'education'] }
        ]
      }
      ,
      {
        id: 2202,
        question: '¿Qué tipo de escucha te sale más natural?',
        type: 'scale',
        dimension: 'followup_human',
        options: [
          { text: 'Escucha profunda (subtexto)', value: 5, careers: ['psychology', 'humanities'] },
          { text: 'Escucha pedagógica (enseñar)', value: 5, careers: ['education', 'training'] },
          { text: 'Escucha práctica (resolver)', value: 4, careers: ['health', 'social'] },
          { text: 'Escucha estratégica (liderar)', value: 4, careers: ['management', 'HR'] },
          { text: 'Me cuesta escuchar mucho tiempo', value: 2, careers: ['tech', 'operations'] }
        ]
      },
      {
        id: 2203,
        question: '¿Qué te conmueve más?',
        type: 'scale',
        dimension: 'followup_human',
        options: [
          { text: 'El dolor subjetivo', value: 5, careers: ['psychology', 'health'] },
          { text: 'La injusticia social', value: 5, careers: ['law', 'politics', 'public', 'rights'] },
          { text: 'El crecimiento de otros', value: 5, careers: ['education', 'training'] },
          { text: 'El cuidado concreto', value: 5, careers: ['health', 'medicine'] },
          { text: 'Los vínculos y la cultura', value: 5, careers: ['HR', 'management', 'social'] }
        ]
      },
      {
        id: 2204,
        question: '¿Qué tipo de trabajo humano te atrae?',
        type: 'scale',
        dimension: 'followup_human',
        options: [
          { text: 'Uno a uno (profundidad)', value: 5, careers: ['psychology', 'counseling'] },
          { text: 'Grupos (formación)', value: 5, careers: ['education', 'training'] },
          { text: 'Comunidad (impacto)', value: 5, careers: ['social', 'NGO'] },
          { text: 'Institucional (política pública)', value: 5, careers: ['government', 'policy', 'public'] },
          { text: 'Organizaciones (cultura)', value: 5, careers: ['HR', 'management'] }
        ]
      },
      {
        id: 2205,
        question: '¿Qué te desgasta más?',
        type: 'scale',
        dimension: 'followup_human',
        options: [
          { text: 'Conflictos interpersonales', value: 4, careers: ['tech', 'science'] },
          { text: 'Falta de sentido', value: 5, careers: ['psychology', 'humanities'] },
          { text: 'Rutina sin contacto humano', value: 4, careers: ['social', 'education', 'health'] },
          { text: 'Exigencia emocional constante', value: 4, careers: ['health', 'psychology'] },
          { text: 'Papeleo/burocracia', value: 4, careers: ['education', 'social'] }
        ]
      },
      {
        id: 2206,
        question: '¿Qué te interesa más desarrollar?',
        type: 'scale',
        dimension: 'followup_human',
        options: [
          { text: 'Técnica clínica', value: 5, careers: ['psychology', 'health'] },
          { text: 'Didáctica', value: 5, careers: ['education'] },
          { text: 'Intervención social', value: 5, careers: ['social'] },
          { text: 'Liderazgo humano', value: 5, careers: ['management', 'HR'] },
          { text: 'Salud y cuidado', value: 5, careers: ['health', 'medicine'] }
        ]
      },
      {
        id: 2207,
        question: '¿Qué tipo de conversación disfrutas más?',
        type: 'scale',
        dimension: 'followup_human',
        options: [
          { text: 'Profunda (historia, deseo)', value: 5, careers: ['psychology', 'humanities'] },
          { text: 'Práctica (qué hacer)', value: 4, careers: ['health', 'social'] },
          { text: 'Formativa (aprender)', value: 5, careers: ['education'] },
          { text: 'Estratégica (decidir)', value: 4, careers: ['management', 'business'] },
          { text: 'Creativa (ideas)', value: 4, careers: ['creative', 'media'] }
        ]
      },
      {
        id: 2208,
        question: '¿Qué preferirías estudiar más?',
        type: 'scale',
        dimension: 'followup_human',
        options: [
          { text: 'Psicología/mente', value: 5, careers: ['psychology'] },
          { text: 'Salud/cuerpo', value: 5, careers: ['health', 'medicine'] },
          { text: 'Educación/aprendizaje', value: 5, careers: ['education'] },
          { text: 'Sociedad/política', value: 5, careers: ['politics', 'public', 'law'] },
          { text: 'Organizaciones/cultura', value: 5, careers: ['HR', 'management'] }
        ]
      },
      {
        id: 2209,
        question: '¿Qué te atrae más aportar?',
        type: 'scale',
        dimension: 'followup_human',
        options: [
          { text: 'Escucha y claridad', value: 5, careers: ['psychology'] },
          { text: 'Cuidado y contención', value: 5, careers: ['health'] },
          { text: 'Guía y formación', value: 5, careers: ['education'] },
          { text: 'Comunidad y derechos', value: 5, careers: ['public', 'rights', 'law'] },
          { text: 'Liderazgo humano', value: 5, careers: ['management', 'HR'] }
        ]
      },
      {
        id: 2210,
        question: 'Si eliges una ruta “humana”, preferirías:',
        type: 'scale',
        dimension: 'followup_human',
        options: [
          { text: 'Clínica', value: 5, careers: ['psychology', 'health'] },
          { text: 'Educación', value: 5, careers: ['education'] },
          { text: 'Trabajo social', value: 5, careers: ['social'] },
          { text: 'Cultura/organizaciones', value: 5, careers: ['HR', 'management'] },
          { text: 'Mixto', value: 4, careers: ['education', 'psychology'] }
        ]
      },
      {
        id: 2211,
        question: 'Si eliges servicio público/derecho, ¿qué te atrae más?',
        type: 'scale',
        dimension: 'followup_human',
        options: [
          { text: 'Justicia y derechos', value: 5, careers: ['public', 'law', 'rights'] },
          { text: 'Política pública y gobierno', value: 5, careers: ['public', 'policy', 'government'] },
          { text: 'Regulación y normas', value: 5, careers: ['public', 'law', 'policy'] },
          { text: 'Gestión pública (programas, implementación)', value: 5, careers: ['public', 'government', 'operations'] },
          { text: 'Acción comunitaria (territorio)', value: 4, careers: ['public', 'rights'] }
        ]
      },
      {
        id: 2212,
        question: '¿Qué tipo de impacto te interesa más desde lo público?',
        type: 'scale',
        dimension: 'followup_human',
        options: [
          { text: 'Derechos y acceso', value: 5, careers: ['public', 'rights', 'law'] },
          { text: 'Diseño de políticas', value: 5, careers: ['public', 'policy', 'government'] },
          { text: 'Resolución de conflictos', value: 4, careers: ['public', 'law'] },
          { text: 'Instituciones y procesos', value: 4, careers: ['public', 'government', 'operations'] },
          { text: 'Formación ciudadana', value: 4, careers: ['public', 'education', 'teaching'] }
        ]
      }
    ],
    Estrategia: [
      {
        id: 2301,
        question: '¿Qué parte de “negocio” te entusiasma más?',
        type: 'scale',
        dimension: 'followup_strategy',
        options: [
          { text: 'Estrategia y dirección', value: 5, careers: ['business', 'consulting', 'management'] },
          { text: 'Ventas y negociación', value: 5, careers: ['sales', 'business', 'entrepreneurship'] },
          { text: 'Finanzas y control', value: 5, careers: ['finance', 'admin', 'operations'] },
          { text: 'Marketing y posicionamiento', value: 5, careers: ['marketing', 'media', 'business'] },
          { text: 'Operaciones y ejecución', value: 5, careers: ['operations', 'management', 'admin'] }
        ]
      }
      ,
      {
        id: 2302,
        question: '¿Qué te gusta más decidir?',
        type: 'scale',
        dimension: 'followup_strategy',
        options: [
          { text: 'Prioridades y foco', value: 5, careers: ['management', 'consulting', 'business'] },
          { text: 'Precios y números', value: 5, careers: ['finance', 'business'] },
          { text: 'Cómo vender/negociar', value: 5, careers: ['sales', 'business'] },
          { text: 'Cómo posicionar (marketing)', value: 5, careers: ['marketing', 'media', 'business'] },
          { text: 'Cómo ejecutar (operaciones)', value: 5, careers: ['operations', 'admin'] }
        ]
      },
      {
        id: 2303,
        question: '¿Qué estilo de liderazgo te sale más natural?',
        type: 'scale',
        dimension: 'followup_strategy',
        options: [
          { text: 'Ordenar y ejecutar', value: 5, careers: ['operations', 'management'] },
          { text: 'Convencer y mover', value: 5, careers: ['sales', 'entrepreneurship'] },
          { text: 'Pensar estrategia', value: 5, careers: ['consulting', 'business'] },
          { text: 'Cuidar cultura humana', value: 4, careers: ['HR', 'management'] },
          { text: 'Innovar', value: 5, careers: ['entrepreneurship', 'innovation'] }
        ]
      },
      {
        id: 2304,
        question: '¿Qué te atrae más del “negocio”?',
        type: 'scale',
        dimension: 'followup_strategy',
        options: [
          { text: 'Estrategia y visión', value: 5, careers: ['consulting', 'management'] },
          { text: 'Ventas y mercado', value: 5, careers: ['sales', 'marketing'] },
          { text: 'Operación y sistemas', value: 5, careers: ['operations', 'admin'] },
          { text: 'Finanzas', value: 5, careers: ['finance'] },
          { text: 'Emprender', value: 5, careers: ['entrepreneurship'] }
        ]
      },
      {
        id: 2305,
        question: '¿Qué te estresa más?',
        type: 'scale',
        dimension: 'followup_strategy',
        options: [
          { text: 'No tener control del resultado', value: 4, careers: ['operations', 'finance'] },
          { text: 'No tener libertad', value: 4, careers: ['entrepreneurship', 'creative'] },
          { text: 'No tener claridad', value: 4, careers: ['consulting', 'business'] },
          { text: 'No tener vínculo humano', value: 3, careers: ['HR', 'management'] },
          { text: 'No tener datos', value: 4, careers: ['finance', 'science'] }
        ]
      },
      {
        id: 2306,
        question: '¿Qué preferirías mejorar?',
        type: 'scale',
        dimension: 'followup_strategy',
        options: [
          { text: 'Negociación', value: 5, careers: ['sales', 'business'] },
          { text: 'Estrategia', value: 5, careers: ['consulting', 'management'] },
          { text: 'Procesos', value: 5, careers: ['operations', 'admin'] },
          { text: 'Números', value: 5, careers: ['finance'] },
          { text: 'Innovación', value: 5, careers: ['entrepreneurship', 'innovation'] }
        ]
      },
      {
        id: 2307,
        question: '¿Cómo te gusta medir progreso?',
        type: 'scale',
        dimension: 'followup_strategy',
        options: [
          { text: 'KPIs', value: 5, careers: ['business', 'finance'] },
          { text: 'Objetivos claros', value: 5, careers: ['management', 'operations'] },
          { text: 'Clientes satisfechos', value: 5, careers: ['sales', 'marketing'] },
          { text: 'Impacto humano', value: 4, careers: ['HR', 'management'] },
          { text: 'Crecimiento del proyecto', value: 5, careers: ['entrepreneurship', 'business'] }
        ]
      },
      {
        id: 2308,
        question: '¿Qué prefieres construir?',
        type: 'scale',
        dimension: 'followup_strategy',
        options: [
          { text: 'Una empresa', value: 5, careers: ['entrepreneurship', 'business'] },
          { text: 'Un equipo', value: 5, careers: ['management', 'HR'] },
          { text: 'Un sistema operativo interno', value: 5, careers: ['operations', 'admin'] },
          { text: 'Un portafolio de clientes', value: 5, careers: ['sales', 'business'] },
          { text: 'Una estrategia de mercado', value: 5, careers: ['marketing', 'business'] }
        ]
      },
      {
        id: 2309,
        question: '¿Qué rol te llama más?',
        type: 'scale',
        dimension: 'followup_strategy',
        options: [
          { text: 'Consultor', value: 5, careers: ['consulting', 'business'] },
          { text: 'Gerente', value: 5, careers: ['management', 'operations'] },
          { text: 'Comercial', value: 5, careers: ['sales', 'business'] },
          { text: 'Finanzas', value: 5, careers: ['finance'] },
          { text: 'Emprendedor', value: 5, careers: ['entrepreneurship'] }
        ]
      },
      {
        id: 2310,
        question: 'Si tuvieras que elegir una ruta, sería:',
        type: 'scale',
        dimension: 'followup_strategy',
        options: [
          { text: 'Operaciones', value: 5, careers: ['operations', 'admin'] },
          { text: 'Marketing', value: 5, careers: ['marketing', 'media', 'business'] },
          { text: 'Ventas', value: 5, careers: ['sales', 'business'] },
          { text: 'Finanzas', value: 5, careers: ['finance'] },
          { text: 'Estrategia/consultoría', value: 5, careers: ['consulting', 'management'] }
        ]
      }
    ],
    Analítico: [
      {
        id: 2401,
        question: 'En investigación, ¿qué te atrae más?',
        type: 'scale',
        dimension: 'followup_analytic',
        options: [
          { text: 'Experimentación y método', value: 5, careers: ['science', 'research', 'lab'] },
          { text: 'Modelado y explicación', value: 5, careers: ['data', 'science', 'academic'] },
          { text: 'Lectura/escritura y teoría', value: 5, careers: ['academic', 'research', 'humanities'] },
          { text: 'Resolver problemas aplicados', value: 5, careers: ['engineering', 'science', 'consulting'] },
          { text: 'Descubrir patrones nuevos', value: 5, careers: ['research', 'science', 'data'] }
        ]
      }
      ,
      {
        id: 2402,
        question: '¿Qué te interesa medir más?',
        type: 'scale',
        dimension: 'followup_analytic',
        options: [
          { text: 'Datos y correlaciones', value: 5, careers: ['data', 'science'] },
          { text: 'Experimentos', value: 5, careers: ['science', 'lab'] },
          { text: 'Modelos teóricos', value: 5, careers: ['academic', 'research'] },
          { text: 'Problemas aplicados', value: 5, careers: ['engineering', 'consulting'] },
          { text: 'Patrones humanos', value: 4, careers: ['psychology', 'research'] }
        ]
      },
      {
        id: 2403,
        question: '¿Qué te gusta más leer?',
        type: 'scale',
        dimension: 'followup_analytic',
        options: [
          { text: 'Artículos científicos', value: 5, careers: ['science', 'research'] },
          { text: 'Libros y teoría', value: 5, careers: ['academic', 'humanities'] },
          { text: 'Casos y problemas', value: 5, careers: ['engineering', 'consulting'] },
          { text: 'Datos y reportes', value: 5, careers: ['data', 'finance'] },
          { text: 'Ensayos', value: 4, careers: ['humanities', 'research'] }
        ]
      },
      {
        id: 2404,
        question: '¿Qué te atrae más?',
        type: 'scale',
        dimension: 'followup_analytic',
        options: [
          { text: 'Laboratorio', value: 5, careers: ['science', 'lab'] },
          { text: 'Campo / observación', value: 5, careers: ['environment'] },
          { text: 'Modelos y ecuaciones', value: 5, careers: ['science', 'data'] },
          { text: 'Análisis de texto', value: 5, careers: ['academic', 'humanities'] },
          { text: 'Aplicación en industria', value: 5, careers: ['engineering', 'consulting'] }
        ]
      },
      {
        id: 2411,
        question: 'Si trabajaras en medio ambiente, ¿qué problema te atrae más?',
        type: 'scale',
        dimension: 'followup_analytic',
        options: [
          { text: 'Clima y emisiones', value: 5, careers: ['environment', 'climate', 'impact'] },
          { text: 'Conservación y biodiversidad', value: 5, careers: ['environment', 'ecology', 'conservation'] },
          { text: 'Energía y renovables', value: 5, careers: ['environment', 'energy', 'renewables'] },
          { text: 'Sostenibilidad en sistemas (medir y mejorar)', value: 5, careers: ['environment', 'sustainability', 'impact'] },
          { text: 'Investigación científica pura', value: 4, careers: ['science', 'research', 'academic'] }
        ]
      },
      {
        id: 2412,
        question: '¿Cómo prefieres aportar en sostenibilidad?',
        type: 'scale',
        dimension: 'followup_analytic',
        options: [
          { text: 'Campo y evaluación (observar/medir en sitio)', value: 5, careers: ['environment', 'conservation', 'impact'] },
          { text: 'Datos para impacto (métricas, monitoreo)', value: 5, careers: ['environment', 'impact', 'data'] },
          { text: 'Diseño de soluciones prácticas', value: 5, careers: ['environment', 'engineering', 'process'] },
          { text: 'Educación y cultura ambiental', value: 4, careers: ['environment', 'education', 'teaching'] },
          { text: 'Laboratorio / teoría', value: 4, careers: ['science', 'lab', 'research'] }
        ]
      },
      {
        id: 2405,
        question: '¿Qué te cuesta más?',
        type: 'scale',
        dimension: 'followup_analytic',
        options: [
          { text: 'Presentar resultados', value: 3, careers: ['research', 'science'] },
          { text: 'Tolerar ambigüedad', value: 3, careers: ['engineering', 'science'] },
          { text: 'Hacerlo sin método', value: 5, careers: ['science', 'research'] },
          { text: 'Seguir una rutina fija', value: 3, careers: ['research', 'humanities'] },
          { text: 'Trabajar con presión comercial', value: 3, careers: ['science', 'research'] }
        ]
      },
      {
        id: 2406,
        question: '¿Qué te interesa más aprender?',
        type: 'scale',
        dimension: 'followup_analytic',
        options: [
          { text: 'Estadística', value: 5, careers: ['data', 'science'] },
          { text: 'Método científico', value: 5, careers: ['science', 'research'] },
          { text: 'Filosofía/teoría', value: 5, careers: ['humanities', 'academic'] },
          { text: 'Optimización', value: 5, careers: ['engineering', 'science'] },
          { text: 'Modelos de decisión', value: 5, careers: ['data', 'business'] }
        ]
      },
      {
        id: 2407,
        question: '¿Qué prefieres producir?',
        type: 'scale',
        dimension: 'followup_analytic',
        options: [
          { text: 'Artículos', value: 5, careers: ['academic', 'research'] },
          { text: 'Modelos', value: 5, careers: ['data', 'science'] },
          { text: 'Prototipos', value: 5, careers: ['engineering', 'tech'] },
          { text: 'Reportes', value: 5, careers: ['finance', 'data'] },
          { text: 'Ensayos', value: 4, careers: ['humanities', 'academic'] }
        ]
      },
      {
        id: 2408,
        question: '¿Qué te motiva más?',
        type: 'scale',
        dimension: 'followup_analytic',
        options: [
          { text: 'Verdad / precisión', value: 5, careers: ['science', 'research'] },
          { text: 'Explicación / teoría', value: 5, careers: ['academic', 'humanities'] },
          { text: 'Predicción', value: 5, careers: ['data', 'science'] },
          { text: 'Aplicación', value: 5, careers: ['engineering', 'consulting'] },
          { text: 'Comprender personas', value: 4, careers: ['psychology', 'research'] }
        ]
      },
      {
        id: 2409,
        question: '¿Qué “ambiente” te atrae más?',
        type: 'scale',
        dimension: 'followup_analytic',
        options: [
          { text: 'Universidad', value: 5, careers: ['academic', 'research'] },
          { text: 'Laboratorio', value: 5, careers: ['science', 'lab'] },
          { text: 'Industria', value: 5, careers: ['engineering', 'consulting'] },
          { text: 'Datos en empresa', value: 5, careers: ['data', 'business'] },
          { text: 'Mixto', value: 4, careers: ['science', 'research'] }
        ]
      },
      {
        id: 2410,
        question: 'Si eliges una ruta analítica, sería:',
        type: 'scale',
        dimension: 'followup_analytic',
        options: [
          { text: 'Ciencia', value: 5, careers: ['science'] },
          { text: 'Investigación', value: 5, careers: ['research'] },
          { text: 'Datos', value: 5, careers: ['data'] },
          { text: 'Academia', value: 5, careers: ['academic'] },
          { text: 'Aplicación/ingeniería', value: 5, careers: ['engineering', 'consulting'] }
        ]
      }
    ]
  }

  const buildInitialQuestions = () => {
    return [
      ...questionBlocks.marco,
      ...questionBlocks.deseoEstructura,
      ...coreQuestions
    ]
  }

  const [questions, setQuestions] = useState(() => buildInitialQuestions())
  const [baseQuestionsCount] = useState(() => buildInitialQuestions().length)
  
  // Sistema de carreras con perfiles detallados
  const careerProfiles = {
    'psychology': {
      name: 'Psicología y Comportamiento',
      description: 'Comprender conducta, motivación y toma de decisiones; acompañar procesos de cambio sin asumir diagnóstico.',
      icon: Brain,
      color: 'from-purple-500 to-fuchsia-500',
      match: ['motivation', 'satisfaction', 'interests', 'skills'],
      fields: ['Orientación', 'Acompañamiento', 'Investigación', 'Recursos Humanos', 'Psicoeducación']
    },
    'tech': {
      name: 'Tecnología y Programación',
      description: 'Crear soluciones digitales, desarrollar software y sistemas que resuelvan problemas.',
      icon: Code,
      color: 'from-cyan-500 to-blue-500',
      match: ['problem_solving', 'cognition', 'learning'],
      fields: ['Desarrollo Web', 'Datos', 'Automatización', 'IA/ML', 'Ciberseguridad', 'DevOps']
    },
    'creative': {
      name: 'Artes Creativas y Diseño',
      description: 'Expresarte creativamente, diseñar experiencias visuales y crear contenido original.',
      icon: Palette,
      color: 'from-pink-500 to-rose-500',
      match: ['satisfaction', 'interests', 'cognition'],
      fields: ['Diseño Gráfico', 'UX/UI', 'Ilustración', 'Animación', 'Dirección de arte', 'Contenido']
    },
    'business': {
      name: 'Negocios y Emprendimiento',
      description: 'Liderar proyectos, crear empresas y generar valor económico con visión estratégica.',
      icon: Briefcase,
      color: 'from-amber-500 to-orange-500',
      match: ['decision_making', 'team_role', 'future_vision'],
      fields: ['Administración', 'Contabilidad/Finanzas', 'Marketing', 'Ventas', 'Consultoría', 'Operaciones']
    },
    'health': {
      name: 'Salud y Medicina',
      description: 'Cuidar la salud física y mental, impactar directamente en el bienestar de las personas.',
      icon: Heart,
      color: 'from-red-500 to-pink-500',
      match: ['satisfaction', 'values', 'skills'],
      fields: ['Medicina', 'Enfermería', 'Nutrición', 'Fisioterapia', 'Salud mental']
    },
    'science': {
      name: 'Ciencia e Investigación',
      description: 'Descubrir verdades, investigar fenómenos y expandir el conocimiento humano.',
      icon: Sparkles,
      color: 'from-indigo-500 to-purple-500',
      match: ['problem_solving', 'learning', 'cognition'],
      fields: ['Investigación', 'Biotecnología', 'Química', 'Física', 'Ciencia de datos']
    },
    'education': {
      name: 'Educación y Enseñanza',
      description: 'Transmitir conocimiento, formar personas y generar impacto en futuras generaciones.',
      icon: BookOpen,
      color: 'from-emerald-500 to-teal-500',
      match: ['motivation', 'satisfaction', 'social_interaction'],
      fields: ['Docencia', 'Pedagogía', 'Capacitación', 'E-learning', 'Mentoría']
    },
    'social': {
      name: 'Trabajo Social y Humanidades',
      description: 'Generar cambio social, defender derechos y mejorar condiciones de vida.',
      icon: Users,
      color: 'from-green-500 to-emerald-500',
      match: ['values', 'satisfaction', 'motivation'],
      fields: ['Trabajo Social', 'ONGs', 'Derechos Humanos', 'Antropología', 'Política pública', 'Comunicación social']
    },
    'engineering': {
      name: 'Ingeniería',
      description: 'Diseñar, construir y optimizar sistemas físicos y procesos complejos.',
      icon: Target,
      color: 'from-slate-500 to-zinc-500',
      match: ['problem_solving', 'cognition', 'skills'],
      fields: ['Civil', 'Mecánica', 'Eléctrica', 'Industrial', 'Procesos']
    },
    'entrepreneurship': {
      name: 'Emprendimiento e Innovación',
      description: 'Crear nuevas empresas, innovar y construir soluciones disruptivas.',
      icon: TrendingUp,
      color: 'from-violet-500 to-purple-500',
      match: ['tolerance', 'resilience', 'future_vision'],
      fields: ['Startups', 'Innovación', 'Negocios digitales', 'Producto', 'Consultoría']
    },
    'operations': {
      name: 'Operación, Logística y Ejecución',
      description: 'Organizar, ejecutar y sostener sistemas: procesos, calidad, gestión y operación diaria.',
      icon: BarChart3,
      color: 'from-slate-500 to-zinc-400',
      match: ['structure_need', 'work_style_frame', 'decision_making'],
      fields: ['Operaciones', 'Administración', 'Logística', 'Gestión de proyectos', 'Calidad', 'Soporte']
    },
    'media': {
      name: 'Comunicación y Medios',
      description: 'Comunicar, narrar y mover audiencias: contenido, voz pública, influencia y producción.',
      icon: PieChart,
      color: 'from-pink-500 to-fuchsia-500',
      match: ['social_interaction', 'recognition', 'values'],
      fields: ['Comunicación', 'Periodismo', 'Contenido', 'Audiovisual', 'Escritura', 'Presentación']
    },
    'public': {
      name: 'Derecho, Políticas y Servicio Público',
      description: 'Normas, instituciones y acuerdos: construir orden social y resolver conflictos con criterio.',
      icon: Users,
      color: 'from-emerald-500 to-teal-500',
      match: ['values', 'decision_making', 'social_interaction'],
      fields: ['Derecho', 'Política pública', 'Gobierno', 'Organismos', 'Derechos', 'Mediación']
    },
    'sports': {
      name: 'Deporte y Rendimiento',
      description: 'Disciplina, cuerpo y competencia: rendimiento, entrenamiento, hábitos y mejora continua.',
      icon: Activity,
      color: 'from-amber-500 to-orange-500',
      match: ['resilience', 'tolerance_load', 'commitment'],
      fields: ['Entrenamiento', 'Rendimiento', 'Educación física', 'Coaching deportivo', 'Gestión deportiva']
    },
    'environment': {
      name: 'Medio Ambiente y Sostenibilidad',
      description: 'Impacto y sistemas vivos: sostenibilidad, proyectos ambientales y soluciones prácticas.',
      icon: Sparkles,
      color: 'from-green-500 to-emerald-500',
      match: ['values', 'problem_solving', 'learning'],
      fields: ['Sostenibilidad', 'Energía', 'Impacto', 'Gestión ambiental', 'Ciencias ambientales']
    }
  }

  const dimensionWeights = {
    decision_frame: 1.15,
    after_choice: 1.15,
    tolerance_load: 1.2,
    work_style_frame: 1.1,
    commitment: 1.15,
    authority: 1.2,
    private_motive: 1.2,
    shame: 1.15,
    desire_relation: 1.25,
    boundaries: 1.2,

    desire_core: 1.25,
    decision_vs_commitment: 1.15,
    structure_need: 1.2,
    superego_pressure: 1.25,
    recognition: 1.15,
    competition: 1.1,
    urgency_response: 1.15,
    uncertainty: 1.2,
    learning_style: 1.1,
    fear: 1.2,
    exposure: 1.15,
    object_relation: 1.25,
    success_attribution: 1.15,
    frustration: 1.2,
    desire_outcome: 1.25,

    motivation: 1.2,
    satisfaction: 1.2,
    values: 1.15,
    values_core: 1.25,
    desire: 1.25,
    constraints: 1.1,
    work_style: 1.05,
    problem_solving: 1.1,
    learning: 1.05,
    cognition: 1.05,
    decision_making: 1.05,
    tolerance: 1.1,
    resilience: 1.1,
    stress: 1.1,
    social_interaction: 1.05,

    followup_creative: 1.15,
    followup_systems: 1.15,
    followup_human: 1.15,
    followup_strategy: 1.15,
    followup_analytic: 1.15,
    followup_care: 1.15
  }

  const normalizeTag = (tag) => (tag || '').toString().trim().toLowerCase()

  const tagToProfileKey = (rawTag) => {
    const tag = normalizeTag(rawTag)
    if (!tag) return null

    if (['psychology', 'psicologia', 'counseling', 'therapy', 'terapia', 'coaching', 'hr', 'humanities'].includes(tag)) return 'psychology'
    if (['health', 'medicine', 'medicina', 'nutrition', 'nutricion', 'emergency'].includes(tag)) return 'health'
    if (['education', 'teaching', 'docencia', 'e-learning', 'elearning', 'pedagogy', 'pedagogia', 'training', 'mentor'].includes(tag)) return 'education'
    if (['science', 'research', 'academic', 'investigation', 'lab', 'analysis'].includes(tag)) return 'science'
    if (['tech', 'software', 'programming', 'code', 'coding', 'cybersecurity', 'devops', 'web', 'product', 'automation', 'data', 'ia/ml', 'ai/ml'].includes(tag)) return 'tech'
    if (['engineering', 'construction', 'manufacturing', 'industrial', 'civil', 'electrical', 'mechanical', 'process'].includes(tag)) return 'engineering'
    if (['creative', 'design', 'arts', 'art', 'music', 'architecture', 'ux/ui', 'ux', 'ui'].includes(tag)) return 'creative'
    if (['media', 'writing', 'journalism', 'entertainment', 'motivational', 'communication', 'content', 'branding'].includes(tag)) return 'media'
    if (['operations', 'admin', 'project-management', 'support', 'logistics', 'quality', 'manufacturing', 'trades'].includes(tag)) return 'operations'
    if (['government', 'law', 'politics', 'human-rights', 'rights', 'policy', 'public'].includes(tag)) return 'public'
    if (['sports', 'competitive', 'fitness'].includes(tag)) return 'sports'
    if (['environment', 'sustainability', 'sostenibilidad', 'climate', 'clima', 'ecology', 'ecologia', 'renewables', 'renewable', 'energia', 'energy', 'impact', 'conservation', 'conservacion'].includes(tag)) return 'environment'

    if (['business', 'finance', 'sales', 'marketing', 'consulting', 'management'].includes(tag)) return 'business'
    if (['entrepreneurship', 'startup', 'startups', 'innovation', 'freelance', 'exploration'].includes(tag)) return 'entrepreneurship'
    if (['social', 'ngo', 'community'].includes(tag)) return 'social'

    return null
  }

  const profileToCluster = {
    psychology: 'Humano',
    health: 'Cuidado',
    education: 'Humano',
    social: 'Humano',
    public: 'Humano',
    creative: 'Creativo',
    media: 'Creativo',
    tech: 'Sistemas',
    engineering: 'Sistemas',
    operations: 'Sistemas',
    science: 'Analítico',
    business: 'Estrategia',
    entrepreneurship: 'Estrategia',
    sports: 'Cuidado',
    environment: 'Analítico'
  }

  const clusters = {
    Humano: { label: 'Humano', icon: Users, color: 'from-purple-500 to-fuchsia-500' },
    Cuidado: { label: 'Cuidado', icon: Heart, color: 'from-pink-500 to-rose-500' },
    Creativo: { label: 'Creativo', icon: Palette, color: 'from-fuchsia-500 to-purple-500' },
    Sistemas: { label: 'Sistemas', icon: Code, color: 'from-cyan-500 to-blue-500' },
    Analítico: { label: 'Analítico', icon: Activity, color: 'from-indigo-500 to-purple-500' },
    Estrategia: { label: 'Estrategia', icon: TrendingUp, color: 'from-amber-500 to-orange-500' }
  }

  const profilePointMultipliers = {
    science: 0.92,
    creative: 0.9,
    social: 0.92,
    health: 0.94,
    business: 0.96,
    entrepreneurship: 0.96,
    tech: 1.08,
    engineering: 1.06,
    media: 1.14,
    public: 1.2,
    sports: 1.27,
    environment: 1.4
  }

  const computeScores = (answersMap, questionList, weights = dimensionWeights, opts = {}) => {
    const includeDebug = Boolean(opts?.includeDebug)
    const careerScores = {}
    const careerEvidence = {}
    const clusterScores = {}
    Object.keys(careerProfiles).forEach(key => { careerScores[key] = 0 })
    Object.keys(careerProfiles).forEach(key => { careerEvidence[key] = 0 })
    Object.keys(clusters).forEach(key => { clusterScores[key] = 0 })

    const evidenceSeen = new Set()
    const dimensionTotals = {}
    const profileDimensionTotals = includeDebug ? {} : null
    let peopleScore = 0
    let systemsScore = 0
    let creativeScore = 0
    let structureScore = 0
    let riskScore = 0
    let stabilityScore = 0

    let desireDrive = 0
    let structureDrive = 0

    const answered = Object.keys(answersMap).length
    let totalTagsCount = 0
    let mappedTagsCount = 0

    Object.entries(answersMap).forEach(([questionId, answer]) => {
      const q = questionList.find(qq => qq.id === Number(questionId))
      const w = (weights?.[q?.dimension] ?? 1)
      const dim = (q?.dimension ?? '').toString()
      const isDesireDim = dim.startsWith('desire_') || ['desire_relation', 'desire_core', 'desire_outcome'].includes(dim)
      const isStructureDim = dim.includes('structure') || dim === 'structure_need'

      const selected = Array.isArray(answer) ? answer : [answer]
      const perPickFactor = selected.length > 1 ? 0.6 : 1

      selected.forEach((a) => {
        const value = Number(a?.value ?? 0)
        const basePoints = value * w * perPickFactor

        if (q?.dimension) {
          const k = q.dimension
          dimensionTotals[k] = (dimensionTotals[k] || 0) + basePoints
        }

        if (isDesireDim) desireDrive += basePoints
        if (isStructureDim) structureDrive += basePoints

        const tags = Array.isArray(a?.careers) ? a.careers : []
        totalTagsCount += tags.length

        tags.forEach((tag) => {
          const profileKey = tagToProfileKey(tag)
          if (!profileKey) return
          mappedTagsCount += 1

          const evidenceKey = `${questionId}:${profileKey}`
          if (!evidenceSeen.has(evidenceKey)) {
            evidenceSeen.add(evidenceKey)
            careerEvidence[profileKey] = (careerEvidence[profileKey] || 0) + 1
          }

          const points = basePoints * (profilePointMultipliers[profileKey] ?? 1)
          if (careerScores[profileKey] !== undefined) careerScores[profileKey] += points

          if (includeDebug) {
            const d = dim || 'n/a'
            if (!profileDimensionTotals[d]) profileDimensionTotals[d] = {}
            profileDimensionTotals[d][profileKey] = (profileDimensionTotals[d][profileKey] || 0) + points
          }

          const clusterKey = profileToCluster[profileKey]
          if (clusterKey && clusterScores[clusterKey] !== undefined) clusterScores[clusterKey] += points

          if (['psychology', 'health', 'education', 'social', 'public', 'sports'].includes(profileKey)) peopleScore += points
          if (['tech', 'engineering', 'science', 'operations', 'environment'].includes(profileKey)) systemsScore += points
          if (['creative', 'media'].includes(profileKey)) creativeScore += points
          if (['business', 'engineering', 'science', 'operations', 'public', 'environment'].includes(profileKey)) structureScore += points
          if (['entrepreneurship', 'creative', 'media', 'sports'].includes(profileKey)) riskScore += points
          if (['admin', 'finance', 'operations', 'government', 'law'].includes(normalizeTag(tag))) stabilityScore += points
        })
      })
    })

    const baseDenom = Math.max(1, answered * 5 * 1.25)
    const desireLevel = clamp(Math.round((desireDrive / baseDenom) * 100), 0, 100)
    const structureLevel = clamp(Math.round((structureDrive / baseDenom) * 100), 0, 100)

    const denom = Math.max(1, answered * 5 * 1.25 * 3)
    const rawScores = Object.entries(careerScores)
      .map(([career, score]) => ({
        career,
        score,
        percentage: clamp(Math.round((score / denom) * 100), 0, 100),
        profile: careerProfiles[career],
        evidence: Number(careerEvidence?.[career] ?? 0)
      }))
      .sort((a, b) => b.score - a.score)

    const provisionalScores = rawScores
      .map((r) => {
        const evidence = Number(r?.evidence ?? 0)
        const evidenceFactor = clamp(evidence / 6, 0.35, 1)
        const score = Number(r?.score ?? 0)
        const adjusted = score * evidenceFactor
        return { ...r, rawScore: score, score: adjusted }
      })
      .sort((a, b) => b.score - a.score)

    const clusterMax = Math.max(1, ...Object.values(clusterScores))
    const clusterSummary = Object.entries(clusterScores)
      .map(([key, score]) => ({
        key,
        score,
        percentage: clamp(Math.round((score / clusterMax) * 100), 0, 100),
        meta: clusters[key]
      }))
      .sort((a, b) => b.score - a.score)

    const desireDetail = {
      relation: clamp(Math.round(((dimensionTotals?.desire_relation ?? 0) / baseDenom) * 100), 0, 100),
      core: clamp(Math.round(((dimensionTotals?.desire_core ?? 0) / baseDenom) * 100), 0, 100),
      outcome: clamp(Math.round(((dimensionTotals?.desire_outcome ?? 0) / baseDenom) * 100), 0, 100),
      general: clamp(Math.round(((dimensionTotals?.desire ?? 0) / baseDenom) * 100), 0, 100),
      structureNeed: clamp(Math.round(((dimensionTotals?.structure_need ?? 0) / baseDenom) * 100), 0, 100)
    }

    const axes = {
      peopleVsSystems: balancePercent(peopleScore, systemsScore),
      creativityVsStructure: balancePercent(creativeScore, structureScore),
      riskVsStability: balancePercent(riskScore, stabilityScore)
    }

    const roles = computeRoleSuggestions({
      axes,
      clusters: clusterSummary,
      dynamics: { desire: desireLevel, structure: structureLevel }
    })

    return {
      results: rawScores,
      provisionalResults: provisionalScores,
      insights: {
        coverage: { mappedTagsCount, totalTagsCount },
        dynamics: {
          desire: desireLevel,
          structure: structureLevel,
          detail: desireDetail
        },
        axes,
        clusters: clusterSummary,
        roles,
        debug: includeDebug ? { profileDimensionTotals } : undefined
      }
    }
  }
  
  const handleAnswer = (questionId, option) => {
    const q = questions[currentQuestion]
    const allowDouble = q?.allowDouble === true

    const toArr = (v) => (Array.isArray(v) ? v : (v ? [v] : []))

    const existing = answers[questionId]
    const prevSelected = toArr(existing)
    let nextSelected = []

    if (!allowDouble) {
      nextSelected = [option]
    } else {
      const arr = toArr(existing)
      const alreadySelected = arr.includes(option)
      if (alreadySelected) {
        nextSelected = arr.filter(x => x !== option)
      } else {
        nextSelected = [...arr, option].slice(0, 2)
      }
    }

    const nextAnswers = { ...answers }
    if (nextSelected.length === 0) {
      delete nextAnswers[questionId]
    } else {
      nextAnswers[questionId] = nextSelected.length === 1 ? nextSelected[0] : nextSelected
    }

    setAnswers(nextAnswers)

    const w = (dimensionWeights?.[q?.dimension] ?? 1)
    const factorFor = (selected) => (Array.isArray(selected) && selected.length > 1 ? 0.6 : 1)
    const prevFactor = factorFor(prevSelected)
    const nextFactor = factorFor(nextSelected)

    const contribMapFor = (selected, factor) => {
      const map = new Map()
      ;(selected || []).forEach((opt) => {
        const value = Number(opt?.value ?? 0)
        const tags = Array.isArray(opt?.careers) ? opt.careers : []
        const optLabel = (opt?.text ?? '').toString().trim() || 'Opción'

        tags.forEach((tag) => {
          const profileKey = tagToProfileKey(tag)
          if (!profileKey) return
          const profileName = careerProfiles?.[profileKey]?.name ?? profileKey
          const points = value * w * factor
          const key = `${profileKey}::${optLabel}::${tag}`
          map.set(key, {
            profileName,
            points,
            optLabel,
            tag
          })
        })
      })
      return map
    }

    const prevMap = contribMapFor(prevSelected, prevFactor)
    const nextMap = contribMapFor(nextSelected, nextFactor)
    const keys = new Set([...prevMap.keys(), ...nextMap.keys()])

    const rows = []
    keys.forEach((key) => {
      const prev = prevMap.get(key)
      const next = nextMap.get(key)
      const prevPts = prev?.points ?? 0
      const nextPts = next?.points ?? 0
      const delta = nextPts - prevPts
      if (Math.abs(delta) < 1e-9) return

      const profileName = next?.profileName ?? prev?.profileName ?? 'Registro'
      const optLabel = next?.optLabel ?? prev?.optLabel
      const tag = next?.tag ?? prev?.tag

      let action = 'Ajuste'
      if (prev && !next) action = 'Quitado'
      else if (!prev && next) action = 'Seleccionado'
      else if (prev && next && prevFactor !== nextFactor) action = 'Ajuste (doble selección)'

      rows.push({
        id: `${Date.now()}-${Math.random()}`,
        questionId,
        target: profileName,
        points: delta,
        reason: `${action} · dim=${q?.dimension ?? 'n/a'} · w=${w.toFixed(2)} · f=${nextFactor.toFixed(2)} · opt=${optLabel} · tag=${tag}`
      })
    })

    setLastChangeRows(rows)
    if (debugEnabled && rows.length > 0) {
      setDebugLog(prev => ([...prev, ...rows]))
    }
  }
  
  const nextQuestion = () => {
    const currentId = questions[currentQuestion]?.id
    stopQuestionTimer(currentId)

    const shouldInjectFollowUp = !followUpInjected && currentQuestion === baseQuestionsCount - 1
    if (shouldInjectFollowUp) {
      const { insights: liveInsights } = computeScores(answers, questions)
      const topCluster = liveInsights?.clusters?.[0]?.key
      const follow = topCluster ? (followUpsByCluster[topCluster] || []) : []

      if (follow.length > 0) {
        const expanded = [...questions, ...follow.slice(0, 10)]
        setQuestions(expanded)
        setFollowUpInjected(true)
        setCurrentQuestion(prev => prev + 1)
        startQuestionTimer()
        return
      }
      setFollowUpInjected(true)
    }

    if (currentQuestion < questions.length - 1) {
      setCurrentQuestion(prev => prev + 1)
      startQuestionTimer()
    } else {
      calculateResults()
    }
  }
  
  const previousQuestion = () => {
    if (currentQuestion > 0) {
      const currentId = questions[currentQuestion]?.id
      stopQuestionTimer(currentId)
      setCurrentQuestion(prev => prev - 1)
      startQuestionTimer()
    }
  }
  
  const calculateResults = () => {
    const answered = Object.keys(answers).length
    if (answered === 0) return
    const computed = computeScores(answers, questions, dimensionWeights, { includeDebug: debugEnabled })
    setResults(computed.results)
    setInsights(computed.insights)
    setStage('results')
  }
  
  const startTest = () => {
    if (isLocked) {
      // Aquí iría la lógica de pago
      alert('Funcionalidad de pago próximamente')
      return
    }
    navigate('/test-vocacional/iniciar')
  }
  
  const progress = ((currentQuestion + 1) / questions.length) * 100

  const answeredCount = Object.keys(answers).length
  const timeSpentSeconds = (90 * 60) + timeExtensionsSeconds - timeLeft

  const liveComputed = useMemo(
    () => computeScores(answers, questions, dimensionWeights, { includeDebug: debugEnabled }),
    [answers, questions, debugEnabled]
  )

  const getArchetypes = () => ({
    business: {
      label: 'Negocios',
      preferProfiles: ['business', 'entrepreneurship', 'operations'],
      preferTags: ['finance', 'sales', 'marketing', 'management', 'consulting', 'admin', 'operations', 'project-management', 'product']
    },
    tech: {
      label: 'Tecnología',
      preferProfiles: ['tech', 'engineering', 'science'],
      preferTags: ['software', 'programming', 'coding', 'cybersecurity', 'devops', 'data', 'ai/ml', 'ia/ml', 'automation', 'engineering']
    },
    creative: {
      label: 'Creativo/Medios',
      preferProfiles: ['creative', 'media'],
      preferTags: ['design', 'ux', 'ui', 'branding', 'writing', 'media', 'journalism', 'content', 'entertainment', 'music', 'arts']
    },
    human: {
      label: 'Humano/Servicio',
      preferProfiles: ['psychology', 'education', 'social', 'public'],
      preferTags: ['psychology', 'counseling', 'education', 'teaching', 'ngo', 'community', 'law', 'politics', 'government', 'human-rights', 'rights']
    },
    care: {
      label: 'Cuidado/Salud',
      preferProfiles: ['health', 'sports'],
      preferTags: ['health', 'medicine', 'nutrition', 'fitness', 'emergency', 'sports']
    },
    analytic: {
      label: 'Analítico',
      preferProfiles: ['science', 'environment'],
      preferTags: ['science', 'research', 'investigation', 'lab', 'data', 'academic', 'environment']
    }
  })

  const simulateArchetype = async (archetypeKey, options = {}) => {
    const archetypes = getArchetypes()
    const preset = archetypes[archetypeKey] || archetypes.business

    const runs = Number(options?.runs ?? 30)
    const noiseProb = Number(options?.noiseProb ?? 0.14)
    const includeDebug = Boolean(options?.includeDebug)

    const scoreOption = (opt, noise = 0) => {
      const value = Number(opt?.value ?? 0)
      const tags = Array.isArray(opt?.careers) ? opt.careers : []
      if (tags.length === 0) return value

      let score = 0
      tags.forEach((t) => {
        const nt = normalizeTag(t)
        const pk = tagToProfileKey(nt)
        let mult = 1
        if (pk && preset.preferProfiles.includes(pk)) mult += 1.35
        if (preset.preferTags.includes(nt)) mult += 0.85
        if (pk) mult += 0.15
        score += value * mult
      })

      if (noise > 0) score += (Math.random() - 0.5) * noise
      return score
    }

    const pickForQuestion = (q, noisy = 0) => {
      const opts = Array.isArray(q?.options) ? q.options : []
      if (opts.length === 0) return null

      const scored = opts
        .map((opt) => ({ opt, s: scoreOption(opt, 0.001) }))
        .sort((a, b) => b.s - a.s)

      const pickIndex = (max) => {
        if (max <= 0) return 0
        if (Math.random() < noisy) return Math.min(1, max)
        return 0
      }

      if (q?.allowDouble === true) {
        const i0 = pickIndex(scored.length - 1)
        const i1 = Math.min(scored.length - 1, i0 === 0 ? 1 : 0)
        const a = scored[i0]?.opt
        const b = scored[i1]?.opt
        const picks = [a, b].filter(Boolean)
        return picks.length > 1 ? picks.slice(0, 2) : (picks[0] || null)
      }

      return scored[pickIndex(scored.length - 1)]?.opt || null
    }

    const buildAnswersForQuestions = (questionList, noisy = 0, seedAnswers = {}) => {
      const out = { ...(seedAnswers || {}) }
      ;(questionList || []).forEach((q) => {
        if (!q?.id) return
        if (out[q.id] !== undefined) return
        const picked = pickForQuestion(q, noisy)
        if (!picked) return
        out[q.id] = picked
      })
      return out
    }

    const simulateOnce = (noisy = 0, debug = false) => {
      const base = buildInitialQuestions()
      const baseAnswers = buildAnswersForQuestions(base, noisy)
      const baseComputed = computeScores(baseAnswers, base, dimensionWeights)
      const topCluster = baseComputed?.insights?.clusters?.[0]?.key
      const follow = topCluster ? (followUpsByCluster[topCluster] || []) : []
      const followSlice = Array.isArray(follow) ? follow.slice(0, 10) : []

      const fullQuestions = followSlice.length > 0 ? [...base, ...followSlice] : base
      const fullAnswers = buildAnswersForQuestions(fullQuestions, noisy, baseAnswers)
      return computeScores(fullAnswers, fullQuestions, dimensionWeights, { includeDebug: debug })
    }

    const computed = simulateOnce(0, includeDebug)
    const ranking = computed?.provisionalResults ?? computed?.results
    const top = Array.isArray(ranking) ? ranking[0] : null
    const topKey = top?.career ?? null

    const dimTotals = computed?.insights?.debug?.profileDimensionTotals
    const topDims = (() => {
      if (!topKey || !dimTotals) return []
      const rows = Object.entries(dimTotals)
        .map(([dim, perProfile]) => ({ dim, v: Number(perProfile?.[topKey] ?? 0) }))
        .sort((a, b) => b.v - a.v)
      return rows.slice(0, 8).filter(r => r.v > 0)
    })()

    const counts = {}
    for (let i = 0; i < runs; i += 1) {
      const r = simulateOnce(noiseProb, false)
      const rr = r?.provisionalResults ?? r?.results
      const winner = Array.isArray(rr) ? (rr[0]?.career ?? null) : null
      if (!winner) continue
      counts[winner] = (counts[winner] || 0) + 1
    }

    const stabilityTop = Object.entries(counts)
      .map(([k, v]) => ({ key: k, label: careerProfiles?.[k]?.name ?? k, pct: Math.round((v / runs) * 100) }))
      .sort((a, b) => b.pct - a.pct)
      .slice(0, 5)

    return {
      archetypeKey,
      archetypeLabel: preset.label,
      expectedProfiles: preset.preferProfiles,
      topKey,
      ranking: Array.isArray(ranking) ? ranking.slice(0, 8) : [],
      clusters: computed?.insights?.clusters ?? [],
      axes: computed?.insights?.axes ?? null,
      dynamics: computed?.insights?.dynamics ?? null,
      topDims,
      stabilityTop,
      params: { runs, noiseProb }
    }
  }

  const runArchetypeSimulation = async (archetypeKey) => {
    if (!debugEnabled) return
    setSimulationRunning(true)

    try {
      const report = await simulateArchetype(archetypeKey, { includeDebug: true })
      setSimulationReport(report)
    } finally {
      setSimulationRunning(false)
    }
  }

  const runAllArchetypeSimulations = async () => {
    if (!debugEnabled) return
    if (simulationRunning) return

    const cacheKey = 'vt_sim_batch_v1'
    try {
      const cachedRaw = window?.localStorage?.getItem(cacheKey)
      if (cachedRaw) {
        const cached = JSON.parse(cachedRaw)
        if (cached?.generatedAt && Array.isArray(cached?.items) && cached.items.length > 0) {
          setSimulationBatchReport(cached)
          // también pone el último como detalle
          const last = cached.items[cached.items.length - 1]
          if (last) setSimulationReport(last)
          return
        }
      }
    } catch {
      // ignore cache issues
    }

    setSimulationRunning(true)
    try {
      const archetypes = getArchetypes()
      const keys = Object.keys(archetypes)
      const items = []

      for (const key of keys) {
        // yield al event loop para no congelar
        // eslint-disable-next-line no-await-in-loop
        await new Promise((resolve) => setTimeout(resolve, 0))
        // eslint-disable-next-line no-await-in-loop
        const report = await simulateArchetype(key, { includeDebug: true, runs: 30, noiseProb: 0.14 })
        items.push(report)
        setSimulationReport(report)
      }

      const batch = { generatedAt: new Date().toISOString(), items }
      setSimulationBatchReport(batch)
      try {
        window?.localStorage?.setItem(cacheKey, JSON.stringify(batch))
      } catch {
        // ignore
      }
    } finally {
      setSimulationRunning(false)
    }
  }

  useEffect(() => {
    if (!debugEnabled) return
    // Autopiloto: corre una vez en debug para recolectar datos sin interacción.
    runAllArchetypeSimulations()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [debugEnabled])

  const liveRanking = liveComputed?.provisionalResults ?? liveComputed?.results
  const topRankKey = liveRanking?.[0]?.career ?? null
  const top5Signature = useMemo(() => {
    const top5 = Array.isArray(liveRanking)
      ? liveRanking.slice(0, 5).map(r => r.career).join('|')
      : ''
    return `${answeredCount}:${top5}`
  }, [answeredCount, liveRanking])

  useEffect(() => {
    if (stage !== 'test') return
    if (!answeredCount) return
    const top5 = Array.isArray(liveRanking)
      ? liveRanking.slice(0, 5).map(r => r.career)
      : []
    if (top5.length === 0) return

    setRankHistory((prev) => {
      const last = prev[prev.length - 1]
      const same = Array.isArray(last) && last.join('|') === top5.join('|')
      if (same) return prev
      const next = [...prev, top5]
      return next.slice(-12)
    })
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [top5Signature, stage])

  const stability = useMemo(() => {
    if (!Array.isArray(rankHistory) || rankHistory.length < 2) {
      return { score: 0, label: 'En construcción' }
    }

    const diffs = []
    for (let i = 1; i < rankHistory.length; i += 1) {
      const a = new Set(rankHistory[i - 1])
      const b = new Set(rankHistory[i])
      let changed = 0
      ;[...a].forEach((k) => { if (!b.has(k)) changed += 1 })
      ;[...b].forEach((k) => { if (!a.has(k)) changed += 1 })
      // cambiaron N elementos del top5, normalizamos a 0..1
      diffs.push(Math.min(1, changed / 5))
    }

    const windowed = diffs.slice(-6)
    const avgChange = windowed.reduce((s, v) => s + v, 0) / Math.max(1, windowed.length)
    const score = clamp(Math.round((1 - avgChange) * 100), 0, 100)
    const label = score >= 75 ? 'Estable' : score >= 55 ? 'En estabilización' : 'Volátil'
    return { score, label }
  }, [rankHistory])

  const confidence = useMemo(() => {
    const cov = liveComputed?.insights?.coverage
    const mapped = Number(cov?.mappedTagsCount ?? 0)
    const total = Number(cov?.totalTagsCount ?? 0)
    const coverageRatio = total > 0 ? mapped / total : 0

    // Reglas simples y defendibles (premium): no promete precisión científica.
    let level = 'Baja'
    if (answeredCount >= 26 && coverageRatio >= 0.6 && stability.score >= 70) level = 'Alta'
    else if (answeredCount >= 14 && coverageRatio >= 0.45 && stability.score >= 45) level = 'Media'

    const note = level === 'Alta'
      ? 'Tu perfil ya se estabilizó: úsalo como base.'
      : level === 'Media'
        ? 'Aún hay mezcla: léelo como hipótesis y mira tensiones.'
        : 'Falta señal o hay mezcla: termina el test para afinar.'

    return { level, note, coverageRatio }
  }, [answeredCount, liveComputed?.insights?.coverage, stability.score])
  
  return (
    <div className="min-h-screen bg-gradient-to-b from-black via-zinc-950 to-black text-white overflow-x-hidden">
      <SEOHead
        title="Test Vocacional - Luis Virrueta"
        description="Descubre tu vocación profesional con nuestro test psicológico profundo basado en psicoanálisis y ciencia vocacional."
      />
      
      <AnimatePresence mode="wait">
        {stage === 'intro' && (
          <motion.div
            key="intro"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="relative min-h-screen pt-20 lg:pt-28"
          >
            {/* Timer (visible desde que aparece el botón de iniciar) */}
            <div className="fixed top-28 md:top-32 right-6 z-[70] flex items-center gap-2 px-3 py-2 bg-black/70 backdrop-blur-md rounded-full border border-white/10">
              <Clock className="w-4 h-4 text-purple-400" />
              <span className="font-mono text-sm text-white/90">{formatTime(timeLeft)}</span>
            </div>

            {/* Hero (estilo Blog/Servicios) */}
            <section ref={heroRef} className="relative pt-12 lg:pt-20 pb-40 lg:pb-56 px-6 lg:px-20 overflow-hidden">
              <div className="absolute inset-0 -top-16 lg:-top-24 -bottom-80 lg:-bottom-96 overflow-hidden pointer-events-none z-0">
                <video
                  autoPlay
                  loop
                  muted
                  playsInline
                  preload="auto"
                  className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full object-cover opacity-60"
                  style={{
                    minWidth: '100vw',
                    minHeight: '100%',
                    objectFit: 'cover',
                    objectPosition: 'center'
                  }}
                >
                  <source src="/carrera profesional.mp4" type="video/mp4" />
                </video>
              </div>

              <div className="absolute inset-x-0 bottom-0 h-48 bg-gradient-to-t from-black/100 via-black/50 to-transparent z-[5] pointer-events-none" />

              <div className="relative max-w-6xl mx-auto z-10">
                <motion.h1
                  initial={{ opacity: 0, y: 30 }}
                  animate={isHeroInView ? { opacity: 1, y: 0 } : {}}
                  transition={{ duration: 1 }}
                  className="text-center mb-12"
                >
                  <span
                    className="text-5xl sm:text-6xl lg:text-7xl font-light text-white inline-block"
                    style={{
                      letterSpacing: '0.12em',
                      textShadow: '0 0 60px rgba(255, 255, 255, 0.15), 0 10px 40px rgba(168, 85, 247, 0.1)'
                    }}
                  >
                    TEST VOCACIONAL
                  </span>
                </motion.h1>

                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={isHeroInView ? { opacity: 1, y: 0 } : {}}
                  transition={{ duration: 1, delay: 0.2 }}
                  className="flex justify-center mb-10"
                >
                  <div className="inline-flex items-center gap-2 px-6 py-3 border border-white/20 rounded-full backdrop-blur-sm bg-white/5">
                    <span className="text-sm sm:text-base font-light text-white/70 tracking-wide">
                      Mapa Vocacional · Deseo · Estructura · Adaptativo
                    </span>
                  </div>
                </motion.div>

                {/* Sección de conceptos clave - diseño cinemático */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={isHeroInView ? { opacity: 1, y: 0 } : {}}
                  transition={{ duration: 1, delay: 0.4 }}
                  className="max-w-5xl mx-auto mb-8"
                >
                  <div className="grid md:grid-cols-2 gap-4">
                    <motion.div 
                      className="group relative overflow-hidden rounded-2xl border border-white/10 bg-gradient-to-br from-purple-500/10 via-transparent to-transparent backdrop-blur-sm p-8 hover:border-purple-500/30 transition-all duration-500"
                      whileHover={{ y: -4, scale: 1.02 }}
                      transition={{ duration: 0.4, ease: [0.23, 1, 0.32, 1] }}
                    >
                      <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-purple-500/20 to-transparent rounded-full blur-3xl group-hover:scale-150 transition-transform duration-700" />
                      <div className="relative z-10">
                        <Brain className="w-10 h-10 text-purple-400 mb-4 opacity-80 group-hover:opacity-100 group-hover:scale-110 transition-all duration-500" strokeWidth={1.5} />
                        <h3 className="text-2xl font-light text-white mb-2 tracking-wide">Deseo</h3>
                        <p className="text-sm text-white/60 leading-relaxed">Lo que realmente quieres, más allá del mandato externo</p>
                      </div>
                    </motion.div>

                    <motion.div 
                      className="group relative overflow-hidden rounded-2xl border border-white/10 bg-gradient-to-br from-fuchsia-500/10 via-transparent to-transparent backdrop-blur-sm p-8 hover:border-fuchsia-500/30 transition-all duration-500"
                      whileHover={{ y: -4, scale: 1.02 }}
                      transition={{ duration: 0.4, ease: [0.23, 1, 0.32, 1] }}
                    >
                      <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-fuchsia-500/20 to-transparent rounded-full blur-3xl group-hover:scale-150 transition-transform duration-700" />
                      <div className="relative z-10">
                        <Target className="w-10 h-10 text-fuchsia-400 mb-4 opacity-80 group-hover:opacity-100 group-hover:scale-110 transition-all duration-500" strokeWidth={1.5} />
                        <h3 className="text-2xl font-light text-white mb-2 tracking-wide">Dirección</h3>
                        <p className="text-sm text-white/60 leading-relaxed">La estructura desde la que tomas decisiones</p>
                      </div>
                    </motion.div>
                  </div>
                </motion.div>

                {/* Frase principal - diseño limpio y elegante */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={isHeroInView ? { opacity: 1, y: 0 } : {}}
                  transition={{ duration: 1, delay: 0.6 }}
                  className="relative max-w-4xl mx-auto mb-12"
                >
                  <div className="relative overflow-hidden rounded-3xl border border-white/10 bg-gradient-to-b from-white/[0.03] to-transparent backdrop-blur-md p-10 md:p-14">
                    <div className="absolute inset-0 bg-gradient-to-br from-purple-500/5 via-transparent to-fuchsia-500/5" />
                    <div className="absolute top-0 left-1/2 -translate-x-1/2 w-3/4 h-px bg-gradient-to-r from-transparent via-white/20 to-transparent" />
                    
                    <div className="relative z-10">
                      <div className="flex items-center justify-center gap-3 mb-6">
                        <div className="h-px w-12 bg-gradient-to-r from-transparent to-white/30" />
                        <Sparkles className="w-5 h-5 text-white/40" strokeWidth={1.5} />
                        <div className="h-px w-12 bg-gradient-to-l from-transparent to-white/30" />
                      </div>
                      
                      <p className="text-center text-xl md:text-2xl lg:text-3xl text-white/90 font-light italic leading-relaxed tracking-wide">
                        ¿Y si elegir no fuera encontrar <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 via-fuchsia-400 to-purple-400">"la carrera perfecta"</span>, sino leer la estructura desde la que eliges?
                      </p>
                      
                      <div className="flex items-center justify-center gap-3 mt-6">
                        <div className="h-px w-12 bg-gradient-to-r from-transparent to-white/30" />
                        <div className="w-1.5 h-1.5 rounded-full bg-white/40" />
                        <div className="h-px w-12 bg-gradient-to-l from-transparent to-white/30" />
                      </div>
                    </div>
                    
                    <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-3/4 h-px bg-gradient-to-r from-transparent via-white/20 to-transparent" />
                  </div>
                </motion.div>

                <motion.div
                  initial={{ opacity: 0 }}
                  animate={isHeroInView ? { opacity: 1 } : {}}
                  transition={{ duration: 1, delay: 0.8 }}
                  className="relative h-px mx-auto max-w-md overflow-hidden"
                >
                  <motion.div
                    initial={{ scaleX: 0 }}
                    animate={isHeroInView ? { scaleX: 1 } : {}}
                    transition={{ duration: 1.2, delay: 0.9, ease: [0.76, 0, 0.24, 1] }}
                    className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent"
                    style={{ transformOrigin: 'center' }}
                  />
                </motion.div>

              </div>
            </section>

            <section className="relative px-6 lg:px-20 pb-24">
              <div className="max-w-4xl mx-auto">
                <motion.p
                  initial={{ y: 20, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ delay: 0.15 }}
                  className="text-lg sm:text-xl text-white/70 mb-10 max-w-3xl mx-auto leading-relaxed text-center"
                >
                  Mucha gente elige una carrera “correcta” para otros, pero incorrecta para su deseo.
                  Eso puede sostenerse un tiempo, pero suele volver como cansancio, ansiedad o una sensación persistente de estar viviendo una vida ajena.
                </motion.p>

                <motion.div
                  initial={{ y: 20, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ delay: 0.25 }}
                  className="mb-10 p-6 bg-black/30 border border-white/10 rounded-2xl"
                >
                  <div className="flex items-start gap-3 mb-4">
                    <div className="w-10 h-10 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center">
                      <Sparkles className="w-5 h-5 text-white/70" />
                    </div>
                    <div>
                      <h2 className="text-lg font-bold">Qué se evalúa (en intersección)</h2>
                      <p className="text-sm text-white/60 leading-relaxed">
                        No es un test de “la carrera perfecta”. Es un mapa para entender <span className="text-white/80 font-semibold">por qué te atraen ciertas rutas</span> y <span className="text-white/80 font-semibold">cuáles puedes sostener</span> con más calma y claridad.
                      </p>
                    </div>
                  </div>

                  <div className="grid md:grid-cols-3 gap-4">
                    <div className="p-4 bg-white/5 border border-white/10 rounded-xl">
                      <div className="flex items-center gap-2 mb-2">
                        <Brain className="w-4 h-4 text-purple-400" />
                        <div className="text-sm font-semibold">Deseo</div>
                      </div>
                      <div className="text-xs text-white/70 leading-relaxed">
                        Lo que de verdad te interesa (no lo que “deberías” elegir).
                      </div>
                    </div>

                    <div className="p-4 bg-white/5 border border-white/10 rounded-xl">
                      <div className="flex items-center gap-2 mb-2">
                        <Target className="w-4 h-4 text-fuchsia-400" />
                        <div className="text-sm font-semibold">Estructura</div>
                      </div>
                      <div className="text-xs text-white/70 leading-relaxed">
                        Tu estilo para sostener rutina, orden, riesgo y estabilidad.
                      </div>
                    </div>

                    <div className="p-4 bg-white/5 border border-white/10 rounded-xl">
                      <div className="flex items-center gap-2 mb-2">
                        <Activity className="w-4 h-4 text-white/70" />
                        <div className="text-sm font-semibold">Marco de decisión</div>
                      </div>
                      <div className="text-xs text-white/70 leading-relaxed">
                        Cómo decides cuando hay presión, duda o expectativa externa.
                      </div>
                    </div>
                  </div>

                  <div className="mt-4 grid md:grid-cols-2 gap-4">
                    <div className="p-4 bg-white/5 border border-white/10 rounded-xl">
                      <div className="text-sm font-semibold mb-1">Bloque adaptativo</div>
                      <div className="text-xs text-white/70 leading-relaxed">
                        Al final se agregan 10 preguntas extra (según tu perfil) para afinar el resultado.
                      </div>
                    </div>
                    <div className="p-4 bg-white/5 border border-white/10 rounded-xl">
                      <div className="text-sm font-semibold mb-1">Para madres/padres</div>
                      <div className="text-xs text-white/70 leading-relaxed">
                        Entrega una lectura clara (no diagnóstica): inclinaciones, tensiones y siguientes pasos para decidir con menos ansiedad.
                      </div>
                    </div>
                  </div>
                </motion.div>

              <motion.div
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.35 }}
                className="grid lg:grid-cols-2 gap-6 mb-10 text-left"
              >
                <div className="p-6 bg-white/5 border border-white/10 rounded-2xl">
                  <div className="flex items-start gap-3">
                    <div className="w-10 h-10 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center">
                      <Brain className="w-5 h-5 text-purple-400" />
                    </div>
                    <div>
                      <h2 className="text-lg font-bold mb-2">Por qué existe este test</h2>
                      <ul className="space-y-2 text-sm text-white/70 leading-relaxed">
                        <li>• Para detectar cuando la elección se sostiene por mandato/miedo más que por deseo.</li>
                        <li>• Para leer la intersección deseo–estructura: lo que quieres vs. lo que puedes sostener sin romperte.</li>
                        <li>• Para volver la confusión un mapa: inclinaciones, tensiones y direcciones posibles (no una “sentencia”).</li>
                      </ul>
                    </div>
                  </div>
                </div>

                <div className="p-6 bg-white/5 border border-white/10 rounded-2xl">
                  <div className="flex items-start gap-3">
                    <div className="w-10 h-10 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center">
                      <Target className="w-5 h-5 text-fuchsia-400" />
                    </div>
                    <div>
                      <h2 className="text-lg font-bold mb-2">Qué vas a obtener</h2>
                      <ul className="space-y-2 text-sm text-white/70 leading-relaxed">
                        <li>• Un ranking orientativo de rutas vocacionales, con compatibilidad y explicación.</li>
                        <li>• Gráficas de clústers + ejes (humano/sistemas, creatividad/estructura, riesgo/estabilidad) en lectura simple.</li>
                        <li>• Señales de estilo de decisión (marco) + un bloque adaptativo para afinar el resultado.</li>
                        <li>• Un cierre práctico: qué investigar, qué probar y qué preguntas llevar a una sesión.</li>
                      </ul>
                    </div>
                  </div>
                </div>
              </motion.div>
              
              <motion.div
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.4 }}
                className="grid md:grid-cols-3 gap-6 mb-12"
              >
                <div className="p-6 bg-white/5 border border-white/10 rounded-xl">
                  <Clock className="w-8 h-8 mx-auto mb-3 text-purple-400" />
                  <h3 className="font-bold mb-2">90 minutos</h3>
                  <p className="text-sm text-white/60">Tiempo límite para completar</p>
                </div>
                <div className="p-6 bg-white/5 border border-white/10 rounded-xl">
                  <CheckCircle className="w-8 h-8 mx-auto mb-3 text-fuchsia-400" />
                  <h3 className="font-bold mb-2">80–90 preguntas</h3>
                  <p className="text-sm text-white/60">Incluye bloque adaptativo</p>
                </div>
                <div className="p-6 bg-white/5 border border-white/10 rounded-xl">
                  <Target className="w-8 h-8 mx-auto mb-3 text-cyan-400" />
                  <h3 className="font-bold mb-2">{Object.keys(careerProfiles).length} rutas</h3>
                  <p className="text-sm text-white/60">Con ejes + lectura orientativa</p>
                </div>
              </motion.div>

              <motion.div
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.45 }}
                className="max-w-3xl mx-auto mb-10 p-5 bg-black/30 border border-white/10 rounded-2xl text-left"
              >
                <div className="flex items-start gap-3">
                  <div className="w-10 h-10 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center">
                    <AlertCircle className="w-5 h-5 text-white/70" />
                  </div>
                  <div>
                    <h3 className="font-bold mb-1">Importante</h3>
                    <p className="text-sm text-white/70 leading-relaxed">
                      Este test es una herramienta de orientación (no es diagnóstico clínico ni “sentencia” definitiva).
                      Lo más valioso es cómo se lee: qué insiste, qué se repite, qué te entusiasma y qué te apaga.
                      Si quieres una evaluación más profunda, se puede trabajar en sesión.
                    </p>
                  </div>
                </div>
              </motion.div>
              
              <div id="instrucciones" className="mt-10 max-w-3xl mx-auto text-left">
                <div className="p-6 bg-white/5 border border-white/10 rounded-2xl">
                  <h3 className="text-lg font-bold mb-3">Instrucciones</h3>
                  <ul className="space-y-2 text-sm text-white/70 leading-relaxed">
                    <li>• Responde por tu tendencia real (no por “lo correcto”).</li>
                    <li>• Si dudas entre dos, elige la que te sale primero (la que tiene más cuerpo/afecto), no la que “conviene”.</li>
                    <li>• El test tiene tiempo límite; durante el test puedes sumar +10 minutos si lo necesitas.</li>
                    <li>• Algunas preguntas pueden permitir elegir hasta 2 opciones (cuando aparezca indicado).</li>
                    <li>• El test se adapta: después de las preguntas base se agregan 10 preguntas según tu clúster dominante.</li>
                    <li>• Cuando eliges 2 opciones, el sistema ajusta el peso de ambas (por eso en modo debug verás “Ajuste”).</li>
                    <li>• Modo desarrollador: abre con <span className="text-white/80 font-semibold">?debug=1</span> para ver en vivo qué suma/resta y por qué (por pregunta y por perfil).</li>
                    <li>• El resultado es orientativo; la lectura profunda puede hacerse en sesión.</li>
                  </ul>
                </div>
              </div>

              {debugEnabled ? (
                <div className="mt-6 max-w-3xl mx-auto text-left">
                  <div className="p-6 bg-white/5 border border-white/10 rounded-2xl">
                    <div className="flex items-center justify-between gap-4 mb-4">
                      <div>
                        <h3 className="text-lg font-bold">Simulador IA (debug)</h3>
                        <div className="text-xs text-white/60">
                          Ejecuta arquetipos para ver si el ranking coincide y qué tan estable es (con ruido).
                        </div>
                      </div>
                      <div className="text-xs text-white/50">{simulationRunning ? 'Simulando…' : 'Listo'}</div>
                    </div>

                    <div className="flex flex-wrap gap-2">
                      <button type="button" onClick={() => runArchetypeSimulation('business')} disabled={simulationRunning} className="px-3 py-2 rounded-xl bg-white/5 border border-white/10 text-xs hover:border-white/25 disabled:opacity-50">Negocios</button>
                      <button type="button" onClick={() => runArchetypeSimulation('tech')} disabled={simulationRunning} className="px-3 py-2 rounded-xl bg-white/5 border border-white/10 text-xs hover:border-white/25 disabled:opacity-50">Tecnología</button>
                      <button type="button" onClick={() => runArchetypeSimulation('creative')} disabled={simulationRunning} className="px-3 py-2 rounded-xl bg-white/5 border border-white/10 text-xs hover:border-white/25 disabled:opacity-50">Creativo/Medios</button>
                      <button type="button" onClick={() => runArchetypeSimulation('human')} disabled={simulationRunning} className="px-3 py-2 rounded-xl bg-white/5 border border-white/10 text-xs hover:border-white/25 disabled:opacity-50">Humano/Servicio</button>
                      <button type="button" onClick={() => runArchetypeSimulation('care')} disabled={simulationRunning} className="px-3 py-2 rounded-xl bg-white/5 border border-white/10 text-xs hover:border-white/25 disabled:opacity-50">Cuidado/Salud</button>
                      <button type="button" onClick={() => runArchetypeSimulation('analytic')} disabled={simulationRunning} className="px-3 py-2 rounded-xl bg-white/5 border border-white/10 text-xs hover:border-white/25 disabled:opacity-50">Analítico</button>
                      <button type="button" onClick={() => {
                        try { window?.localStorage?.removeItem('vt_sim_batch_v1') } catch { /* ignore */ }
                        setSimulationBatchReport(null)
                        runAllArchetypeSimulations()
                      }} disabled={simulationRunning} className="px-3 py-2 rounded-xl bg-black/30 border border-white/10 text-xs hover:border-white/25 disabled:opacity-50">Recalcular todo</button>
                    </div>

                    {simulationBatchReport?.generatedAt && Array.isArray(simulationBatchReport?.items) && simulationBatchReport.items.length > 0 ? (
                      <div className="mt-5 p-4 rounded-xl border border-white/10 bg-black/30">
                        <div className="flex items-center justify-between gap-3 mb-3">
                          <div className="text-xs font-semibold text-white/80">Reporte agregado</div>
                          <div className="text-[11px] text-white/45">{simulationBatchReport.generatedAt}</div>
                        </div>
                        <div className="space-y-2">
                          {simulationBatchReport.items.map((it) => {
                            const winnerPct = Number(it?.stabilityTop?.[0]?.pct ?? 0)
                            const winnerKey = it?.stabilityTop?.[0]?.key ?? it?.topKey
                            const winnerName = careerProfiles?.[winnerKey]?.name ?? it?.stabilityTop?.[0]?.label ?? winnerKey
                            const ok = Array.isArray(it?.expectedProfiles) && winnerKey ? it.expectedProfiles.includes(winnerKey) : false
                            return (
                              <button
                                key={it.archetypeKey}
                                type="button"
                                onClick={() => setSimulationReport(it)}
                                className="w-full text-left p-3 rounded-xl border border-white/10 bg-white/5 hover:border-white/25 transition-colors"
                              >
                                <div className="flex items-center justify-between gap-3">
                                  <div className="text-xs text-white/80 font-medium">{it.archetypeLabel}</div>
                                  <div className={`text-[11px] ${ok ? 'text-emerald-300' : 'text-amber-300'}`}>{ok ? 'Coincide' : 'Revisar'}</div>
                                </div>
                                <div className="flex items-center justify-between gap-3 mt-1">
                                  <div className="text-[11px] text-white/60">Top estable: <span className="text-white/85">{winnerName}</span></div>
                                  <div className="text-[11px] text-white/45">{winnerPct}%</div>
                                </div>
                              </button>
                            )
                          })}
                        </div>
                        <div className="text-[11px] text-white/45 mt-3">
                          Auto: ON en <span className="text-white/70 font-semibold">?debug=1</span>. Click en un renglón para ver detalle.
                        </div>
                      </div>
                    ) : null}

                    {simulationReport ? (
                      <div className="mt-5 space-y-4">
                        <div className="p-4 rounded-xl border border-white/10 bg-black/30">
                          <div className="text-sm font-semibold mb-1">Resultado · {simulationReport.archetypeLabel}</div>
                          <div className="text-xs text-white/70">
                            Top: <span className="text-white/90 font-semibold">{careerProfiles?.[simulationReport.topKey]?.name ?? simulationReport.topKey ?? '—'}</span>
                          </div>
                        </div>

                        {Array.isArray(simulationReport.ranking) && simulationReport.ranking.length > 0 ? (
                          <div className="grid md:grid-cols-2 gap-4">
                            <div className="p-4 rounded-xl border border-white/10 bg-white/5">
                              <div className="text-xs font-semibold text-white/80 mb-2">Top 8 (provisional)</div>
                              <div className="space-y-2">
                                {simulationReport.ranking.map((r) => (
                                  <div key={r.career} className="flex items-center justify-between gap-3">
                                    <div className="text-xs text-white/80">{r.profile?.name ?? r.career}</div>
                                    <div className="text-xs text-white/50">{Math.round(Number(r.percentage ?? 0))}%</div>
                                  </div>
                                ))}
                              </div>
                            </div>

                            <div className="p-4 rounded-xl border border-white/10 bg-white/5">
                              <div className="text-xs font-semibold text-white/80 mb-2">Estabilidad con ruido</div>
                              <div className="text-[11px] text-white/55 mb-2">{simulationReport.params?.runs} corridas · ruido {Math.round((simulationReport.params?.noiseProb ?? 0) * 100)}%</div>
                              <div className="space-y-2">
                                {(simulationReport.stabilityTop || []).map((x) => (
                                  <div key={x.key} className="flex items-center justify-between gap-3">
                                    <div className="text-xs text-white/80">{x.label}</div>
                                    <div className="text-xs text-white/50">{x.pct}%</div>
                                  </div>
                                ))}
                              </div>
                            </div>
                          </div>
                        ) : null}

                        {Array.isArray(simulationReport.topDims) && simulationReport.topDims.length > 0 ? (
                          <div className="p-4 rounded-xl border border-white/10 bg-white/5">
                            <div className="text-xs font-semibold text-white/80 mb-2">Qué está empujando el top (dimensiones)</div>
                            <div className="grid md:grid-cols-2 gap-2">
                              {simulationReport.topDims.map((d) => (
                                <div key={d.dim} className="flex items-center justify-between gap-3">
                                  <div className="text-xs text-white/70">{d.dim}</div>
                                  <div className="text-xs text-white/45">{Math.round(d.v)}</div>
                                </div>
                              ))}
                            </div>
                          </div>
                        ) : null}
                      </div>
                    ) : (
                      <div className="mt-4 text-xs text-white/55">Tip: empieza con “Negocios” para validar el test contra un perfil claro.</div>
                    )}
                  </div>
                </div>
              ) : null}

              <div className="mt-10 max-w-3xl mx-auto text-center">
                <button
                  onClick={startTest}
                  className="group relative px-12 py-6 bg-gradient-to-r from-purple-500 to-fuchsia-500 rounded-full font-bold text-lg overflow-hidden"
                >
                  <span className="relative z-10 flex items-center gap-3 justify-center">
                    Iniciar Mapa Vocacional
                    <ArrowRight className="w-6 h-6 group-hover:translate-x-1 transition-transform" />
                  </span>
                </button>

                <div className="mt-8 grid md:grid-cols-2 gap-6 text-left">
                  <div className="p-6 bg-white/5 border border-white/10 rounded-2xl">
                    <div className="flex items-start gap-3">
                      <div className="w-10 h-10 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center">
                        <CheckCircle className="w-5 h-5 text-purple-400" />
                      </div>
                      <div className="flex-1">
                        <h4 className="text-lg font-bold mb-2">Paquete 1 · Test</h4>
                        <ul className="space-y-2 text-sm text-white/70 leading-relaxed">
                          <li>• Acceso al test completo</li>
                          <li>• Resultados + gráficas</li>
                          <li>• Lectura orientativa para investigación personal</li>
                        </ul>
                        <button
                          type="button"
                          onClick={() => openWhatsApp('Hola, me interesa el Paquete 1 (Test Vocacional). ¿Me compartes precio y forma de pago?')}
                          disabled={!legalAccepted}
                          className={`mt-4 w-full px-5 py-3 rounded-full border border-white/15 bg-white/5 transition-all font-semibold ${legalAccepted ? 'hover:border-white/30' : 'opacity-50 cursor-not-allowed'}`}
                        >
                          Comprar Paquete 1
                        </button>
                      </div>
                    </div>
                  </div>

                  <div className="p-6 bg-white/5 border border-white/10 rounded-2xl">
                    <div className="flex items-start gap-3">
                      <div className="w-10 h-10 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center">
                        <Target className="w-5 h-5 text-fuchsia-400" />
                      </div>
                      <div className="flex-1">
                        <h4 className="text-lg font-bold mb-2">Paquete 2 · Test + Dirección profesional</h4>
                        <ul className="space-y-2 text-sm text-white/70 leading-relaxed">
                          <li>• Todo lo del Paquete 1</li>
                          <li>• Consulta para interpretar el resultado</li>
                          <li>• Dirección: opciones, plan y siguientes pasos</li>
                        </ul>
                        <button
                          type="button"
                          onClick={() => openWhatsApp('Hola, me interesa el Paquete 2 (Test + Dirección profesional). ¿Me compartes precio, disponibilidad y forma de pago?')}
                          disabled={!legalAccepted}
                          className={`mt-4 w-full px-5 py-3 rounded-full bg-gradient-to-r from-purple-500 to-fuchsia-500 font-bold ${legalAccepted ? '' : 'opacity-50 cursor-not-allowed'}`}
                        >
                          Comprar Paquete 2
                        </button>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="mt-5 max-w-3xl mx-auto text-left">
                  <label className="flex items-start gap-3 p-4 bg-white/5 border border-white/10 rounded-2xl">
                    <input
                      type="checkbox"
                      className="mt-1"
                      checked={legalAccepted}
                      onChange={(e) => setLegalAccepted(e.target.checked)}
                    />
                    <div className="text-sm text-white/70 leading-relaxed">
                      Acepto que este test es una herramienta de orientación (no diagnóstico) y que la interpretación profesional se enfoca en claridad, opciones y plan.
                      <div className="mt-2 text-sm">
                        <a className="text-white/80 underline hover:text-white" href="/terminos-condiciones" target="_blank" rel="noreferrer">Términos y condiciones</a>
                        <span className="text-white/40"> · </span>
                        <a className="text-white/80 underline hover:text-white" href="/politica-privacidad" target="_blank" rel="noreferrer">Política de privacidad</a>
                      </div>
                      <div className="mt-2 text-xs text-white/50">
                        Si eres menor de edad, realiza el test con tu madre/padre/tutor.
                      </div>
                    </div>
                  </label>
                </div>
              </div>
              
              {isLocked && (
                <p className="mt-4 text-sm text-white/50">
                  * Test desbloqueado temporalmente para pruebas
                </p>
              )}
              </div>
            </section>
          </motion.div>
        )}
        
        {stage === 'test' && (
          <motion.div
            key="test"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="relative min-h-screen py-20 px-6"
          >
            {/* Timer y Progress */}
            <div className="fixed top-0 left-0 right-0 z-50 bg-black/80 backdrop-blur-md border-b border-white/10">
              <div className="max-w-4xl mx-auto px-6 py-4">
                <div className="flex items-center justify-between mb-2">
                  <button
                    type="button"
                    onClick={() => setShowExitWarning(true)}
                    className="flex items-center gap-2 px-3 py-2 rounded-full border border-white/10 bg-white/5 hover:border-white/30 transition-all"
                    aria-label="Regresar a la página del test"
                  >
                    <ArrowLeft className="w-4 h-4 text-white/80" />
                    <span className="text-xs text-white/70 hidden sm:inline">Regresar</span>
                  </button>

                  <span className="text-sm text-white/60">
                    Pregunta {currentQuestion + 1} de {questions.length}
                  </span>

                  <div className="flex items-center gap-2">
                    <Clock className="w-5 h-5 text-purple-400" />
                    <span className="font-mono text-lg">{formatTime(timeLeft)}</span>
                    <button
                      type="button"
                      onClick={addTenMinutes}
                      className="ml-1 px-2.5 py-1 rounded-full border border-white/10 bg-white/5 hover:border-white/30 text-xs text-white/80 transition-all"
                      aria-label="Agregar 10 minutos"
                    >
                      +10m
                    </button>
                  </div>
                </div>
                <div className="h-2 bg-white/10 rounded-full overflow-hidden">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${progress}%` }}
                    transition={{ duration: 0.3 }}
                    className="h-full bg-gradient-to-r from-purple-500 to-fuchsia-500"
                  />
                </div>
              </div>
            </div>

            {/* Exit confirmation */}
            <AnimatePresence>
              {showExitWarning && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="fixed inset-0 z-[60] flex items-center justify-center px-6 bg-black/80"
                >
                  <motion.div
                    initial={{ y: 20, opacity: 0, scale: 0.98 }}
                    animate={{ y: 0, opacity: 1, scale: 1 }}
                    exit={{ y: 20, opacity: 0, scale: 0.98 }}
                    className="w-full max-w-md p-6 bg-[#0A0A0A] border border-white/10 rounded-2xl"
                  >
                    <div className="flex items-start gap-3 mb-4">
                      <div className="w-10 h-10 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center">
                        <AlertCircle className="w-5 h-5 text-fuchsia-400" />
                      </div>
                      <div>
                        <h3 className="text-lg font-bold">¿Regresar a la página del test?</h3>
                        <p className="text-sm text-white/60">
                          Si regresas ahora, perderás tu progreso actual.
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center justify-end gap-3">
                      <button
                        type="button"
                        onClick={() => setShowExitWarning(false)}
                        className="px-4 py-2 rounded-full border border-white/15 bg-white/5 hover:border-white/30 transition-all"
                      >
                        Continuar
                      </button>
                      <button
                        type="button"
                        onClick={() => navigate('/test-vocacional')}
                        className="px-5 py-2 rounded-full bg-gradient-to-r from-purple-500 to-fuchsia-500 font-bold"
                      >
                        Regresar
                      </button>
                    </div>
                  </motion.div>
                </motion.div>
              )}
            </AnimatePresence>
            
            {/* Question */}
            <div className="max-w-4xl mx-auto pt-32">
              <AnimatePresence mode="wait">
                <motion.div
                  key={currentQuestion}
                  initial={{ opacity: 0, x: 100 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -100 }}
                  transition={{ duration: 0.3 }}
                  className="mb-12"
                >
                  <h2 className="text-3xl lg:text-4xl font-bold mb-8 leading-tight">
                    {questions[currentQuestion].question}
                  </h2>

                  {questions[currentQuestion].allowDouble && (
                    <div className="mb-4 text-sm text-white/60">
                      Puedes elegir hasta <span className="text-white/80 font-semibold">2</span> opciones.
                    </div>
                  )}
                  
                  <div className="space-y-4">
                    {questions[currentQuestion].options.map((option, index) => (
                      <motion.button
                        key={index}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.1 }}
                        onClick={() => handleAnswer(questions[currentQuestion].id, option)}
                        className={`group w-full text-left p-6 rounded-xl border-2 transition-all duration-300 ${(() => {
                          const a = answers[questions[currentQuestion].id]
                          const selected = Array.isArray(a) ? a.includes(option) : a === option
                          return selected
                            ? 'border-purple-500 bg-purple-500/10'
                            : 'border-white/10 bg-white/5 hover:border-white/30'
                        })()}`}
                      >
                        <div className="flex items-center justify-between">
                          <span className="flex-1 text-lg">{option.text}</span>
                          {(() => {
                            const a = answers[questions[currentQuestion].id]
                            const selected = Array.isArray(a) ? a.includes(option) : a === option
                            return selected
                          })() && (
                            <CheckCircle className="w-6 h-6 text-purple-400" />
                          )}
                        </div>
                      </motion.button>
                    ))}
                  </div>

                </motion.div>
              </AnimatePresence>
              
              {/* Navigation */}
              <div className="flex items-center justify-between pt-8">
                <button
                  onClick={previousQuestion}
                  disabled={currentQuestion === 0}
                  className="flex items-center gap-2 px-6 py-3 rounded-full border border-white/20 disabled:opacity-30 disabled:cursor-not-allowed hover:border-white/40 transition-all"
                >
                  <ArrowLeft className="w-5 h-5" />
                  Anterior
                </button>
                
                <button
                  onClick={nextQuestion}
                  disabled={!answers[questions[currentQuestion].id] || (Array.isArray(answers[questions[currentQuestion].id]) && answers[questions[currentQuestion].id].length === 0)}
                  className="flex items-center gap-2 px-8 py-3 bg-gradient-to-r from-purple-500 to-fuchsia-500 rounded-full font-bold disabled:opacity-30 disabled:cursor-not-allowed hover:scale-105 transition-all"
                >
                  {currentQuestion === questions.length - 1 ? 'Ver Resultados' : 'Siguiente'}
                  <ArrowRight className="w-5 h-5" />
                </button>
              </div>

              <div className="mt-10">
                <TestKit
                  title="Evolución del perfil"
                  answeredCount={answeredCount}
                  coverage={liveComputed?.insights?.coverage}
                  ranking={liveRanking}
                  roles={liveComputed?.insights?.roles}
                  clusters={liveComputed?.insights?.clusters}
                  axes={liveComputed?.insights?.axes}
                  dynamics={liveComputed?.insights?.dynamics}
                  stability={stability}
                  confidence={confidence}
                  lastChange={lastChangeRows}
                />
              </div>
            </div>
          </motion.div>
        )}
        
        {stage === 'results' && results && (
          <motion.div
            key="results"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="relative min-h-screen py-20 px-6"
          >
            <div className="max-w-6xl mx-auto">
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ duration: 0.5 }}
                className="text-center mb-16"
              >
                <div className="w-20 h-20 mx-auto mb-6 bg-gradient-to-br from-purple-500 to-fuchsia-500 rounded-full flex items-center justify-center">
                  <CheckCircle className="w-10 h-10" />
                </div>
                <h1 className="text-5xl lg:text-6xl font-bold mb-4 bg-gradient-to-r from-purple-400 to-fuchsia-400 bg-clip-text text-transparent">
                  Tus Resultados
                </h1>
                <p className="text-xl text-white/70">
                  Análisis completo de tu perfil vocacional
                </p>
              </motion.div>
              
              {/* Top 5 Careers */}
              <div className="space-y-6 mb-12">
                {results.slice(0, 5).map((result, index) => {
                  const Icon = result.profile.icon
                  return (
                    <motion.div
                      key={result.career}
                      initial={{ opacity: 0, x: -50 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.1 }}
                      className="relative p-6 bg-white/5 border border-white/10 rounded-2xl hover:border-white/30 transition-all"
                    >
                      <div className="flex items-start gap-6">
                        <div className="flex-shrink-0">
                          <div className={`w-16 h-16 bg-gradient-to-br ${result.profile.color} rounded-xl flex items-center justify-center`}>
                            <Icon className="w-8 h-8" />
                          </div>
                        </div>
                        <div className="flex-1">
                          <div className="flex items-start justify-between mb-2">
                            <div>
                              <h3 className="text-2xl font-bold mb-1">{result.profile.name}</h3>
                              <p className="text-white/70">{result.profile.description}</p>
                            </div>
                            <div className="text-right">
                              <div className="text-3xl font-bold bg-gradient-to-r from-purple-400 to-fuchsia-400 bg-clip-text text-transparent">
                                {result.percentage}%
                              </div>
                              <div className="text-xs text-white/50">Compatibilidad</div>
                            </div>
                          </div>
                          
                          {/* Progress bar */}
                          <div className="h-2 bg-white/10 rounded-full overflow-hidden mb-4">
                            <motion.div
                              initial={{ width: 0 }}
                              animate={{ width: `${result.percentage}%` }}
                              transition={{ duration: 1, delay: index * 0.1 }}
                              className={`h-full bg-gradient-to-r ${result.profile.color}`}
                            />
                          </div>
                          
                          <div className="grid md:grid-cols-3 gap-4 text-sm">
                            <div>
                              <span className="text-white/50">Subrutas sugeridas:</span>
                              <div className="font-bold">{result.profile.fields.slice(0, 2).join(', ')}</div>
                            </div>
                            <div>
                              <span className="text-white/50">Otras opciones:</span>
                              <div className="font-bold">{result.profile.fields.slice(2, 4).join(', ')}</div>
                            </div>
                            <div>
                              <span className="text-white/50">Explorar:</span>
                              <div className="font-bold">{result.profile.fields.slice(4, 6).join(', ')}</div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  )
                })}
              </div>

              {/* Insights / charts */}
              {insights && (
                <div className="grid lg:grid-cols-2 gap-6 mb-12">
                  <div className="p-6 bg-white/5 border border-white/10 rounded-2xl">
                    <div className="flex items-center gap-3 mb-6">
                      <div className="w-10 h-10 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center">
                        <BarChart3 className="w-5 h-5 text-purple-400" />
                      </div>
                      <div>
                        <h3 className="text-lg font-bold">Mapa de inclinaciones</h3>
                        <p className="text-sm text-white/60">Lectura orientativa por clúster</p>
                      </div>
                    </div>

                    <div className="space-y-4">
                      {insights.clusters.slice(0, 6).map((c) => {
                        const Icon = c.meta.icon
                        return (
                          <div key={c.key}>
                            <div className="flex items-center justify-between mb-2">
                              <div className="flex items-center gap-2 text-sm text-white/80">
                                <Icon className="w-4 h-4 text-white/70" />
                                <span className="font-medium">{c.meta.label}</span>
                              </div>
                              <span className="text-xs text-white/60">{c.percentage}%</span>
                            </div>
                            <div className="h-2 bg-white/10 rounded-full overflow-hidden">
                              <div
                                className={`h-full bg-gradient-to-r ${c.meta.color}`}
                                style={{ width: `${c.percentage}%` }}
                              />
                            </div>
                          </div>
                        )
                      })}
                    </div>
                  </div>

                  <div className="p-6 bg-white/5 border border-white/10 rounded-2xl">
                    <div className="flex items-center gap-3 mb-6">
                      <div className="w-10 h-10 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center">
                        <PieChart className="w-5 h-5 text-fuchsia-400" />
                      </div>
                      <div>
                        <h3 className="text-lg font-bold">Ejes de decisión</h3>
                        <p className="text-sm text-white/60">Lectura orientativa (no diagnóstica)</p>
                      </div>
                    </div>

                    <div className="space-y-6">
                      <div>
                        <div className="flex items-center justify-between text-sm mb-2">
                          <span className="text-white/70">Humano</span>
                          <span className="text-white/70">Sistemas</span>
                        </div>
                        <div className="h-2 bg-white/10 rounded-full overflow-hidden">
                          <div className="h-full bg-gradient-to-r from-purple-500 to-fuchsia-500" style={{ width: `${insights.axes.peopleVsSystems}%` }} />
                        </div>
                      </div>

                      <div>
                        <div className="flex items-center justify-between text-sm mb-2">
                          <span className="text-white/70">Creatividad</span>
                          <span className="text-white/70">Estructura</span>
                        </div>
                        <div className="h-2 bg-white/10 rounded-full overflow-hidden">
                          <div className="h-full bg-gradient-to-r from-fuchsia-500 to-purple-500" style={{ width: `${insights.axes.creativityVsStructure}%` }} />
                        </div>
                      </div>

                      <div>
                        <div className="flex items-center justify-between text-sm mb-2">
                          <span className="text-white/70">Riesgo</span>
                          <span className="text-white/70">Estabilidad</span>
                        </div>
                        <div className="h-2 bg-white/10 rounded-full overflow-hidden">
                          <div className="h-full bg-gradient-to-r from-amber-500 to-orange-500" style={{ width: `${insights.axes.riskVsStability}%` }} />
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {insights && (
                <div className="p-8 bg-white/5 border border-white/10 rounded-2xl mb-12">
                  <EstadisticaKit
                    title="Estadística"
                    answeredCount={answeredCount}
                    totalCount={questions.length}
                    timeSpentSeconds={timeSpentSeconds}
                    timeExtensionsCount={timeExtensionsCount}
                    timeExtensionsSeconds={timeExtensionsSeconds}
                    clusters={insights.clusters}
                    axes={insights.axes}
                  />
                </div>
              )}
              
              {/* CTA para consulta */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.6 }}
                className="p-8 bg-gradient-to-br from-purple-500/10 to-fuchsia-500/10 border border-purple-500/20 rounded-2xl text-center"
              >
                <h3 className="text-2xl font-bold mb-4">
                  ¿Quieres interpretar esto a fondo?
                </h3>
                <p className="text-white/70 mb-6 max-w-2xl mx-auto">
                  Este resultado es un mapa inicial. En sesión podemos convertirlo en una evaluación más profunda:
                  ubicar tu conflicto central, tu estilo de elección, tus resistencias y un plan de acción realista
                  (formación, transiciones, decisiones y ansiedad asociada).
                </p>
                <a
                  href="https://wa.me/527228720520?text=Hola! Completé el test vocacional y me gustaría una consulta para interpretar mis resultados"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-3 px-8 py-4 bg-gradient-to-r from-purple-500 to-fuchsia-500 rounded-full font-bold hover:scale-105 transition-all"
                >
                  Agendar Sesión de Interpretación
                  <ArrowRight className="w-5 h-5" />
                </a>
              </motion.div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

export default VocationalTestPage
