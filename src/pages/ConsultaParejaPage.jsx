import { motion, AnimatePresence } from 'framer-motion'
import { useState, useRef, useMemo, useCallback } from 'react'
import { useNavigate } from 'react-router-dom'
import { Heart, MessageCircle, Shield, Target, Users, Brain, ArrowRight, ArrowLeft, Check, Clock, FileText, Mail, Send, Download, Sparkles, Eye, Lock, Star, Activity, BarChart3, ChevronDown } from 'lucide-react'
import SEOHead from '../components/SEOHead'
import jsPDF from 'jspdf'

// ─── DATOS DEL TEST ───────────────────────────────────────────────

const AREAS = [
  { key: 'comunicacion', label: 'Comunicación', icon: MessageCircle, color: 'from-blue-400 to-cyan-400', desc: 'Cómo se entienden y resuelven conflictos.' },
  { key: 'intimidad', label: 'Intimidad', icon: Heart, color: 'from-pink-400 to-rose-400', desc: 'Conexión emocional y física.' },
  { key: 'admiracion', label: 'Admiración', icon: Star, color: 'from-amber-400 to-yellow-400', desc: 'Nivel de respeto y valoración mutua.' },
  { key: 'conflicto', label: 'Conflictos', icon: Activity, color: 'from-red-400 to-orange-400', desc: 'Problemas acumulados o evitados.' },
  { key: 'proyecto', label: 'Proyecto de vida', icon: Target, color: 'from-emerald-400 to-green-400', desc: 'Compatibilidad de metas.' },
  { key: 'seguridad', label: 'Seguridad emocional', icon: Shield, color: 'from-violet-400 to-purple-400', desc: 'Qué tan seguros se sienten juntos.' },
  { key: 'autonomia', label: 'Autonomía', icon: Users, color: 'from-indigo-400 to-blue-400', desc: 'Equilibrio entre cercanía e independencia.' }
]

// 20 preguntas psicológicamente diseñadas
// inverted = true → mayor puntaje = peor (se invierte al calcular)
const QUESTIONS = [
  // Comunicación (3 preguntas)
  { id: 1, text: 'En conversaciones importantes sentimos que realmente nos escuchamos.', area: 'comunicacion', inverted: false },
  { id: 2, text: 'A veces las pequeñas cosas del día a día generan más tensión de la que deberían.', area: 'comunicacion', inverted: true },
  { id: 3, text: 'Cuando hay un desacuerdo, podemos hablar sin que la conversación se convierta en pelea.', area: 'comunicacion', inverted: false },
  // Intimidad (3 preguntas)
  { id: 4, text: 'En ocasiones siento que vivimos más como compañeros de piso que como pareja.', area: 'intimidad', inverted: true },
  { id: 5, text: 'Hay momentos donde siento una conexión profunda con mi pareja sin necesidad de palabras.', area: 'intimidad', inverted: false },
  { id: 6, text: 'Me resulta fácil mostrar vulnerabilidad emocional frente a mi pareja.', area: 'intimidad', inverted: false },
  // Admiración (3 preguntas)
  { id: 7, text: 'Cuando pienso en mi pareja, siento genuina admiración por quién es como persona.', area: 'admiracion', inverted: false },
  { id: 8, text: 'A veces siento que las cosas que hace mi pareja me irritan más de lo razonable.', area: 'admiracion', inverted: true },
  { id: 9, text: 'Me gusta contarle a otros las cosas buenas de mi pareja.', area: 'admiracion', inverted: false },
  // Conflicto (3 preguntas)
  { id: 10, text: 'Hay temas que preferimos no tocar porque sabemos que terminarán mal.', area: 'conflicto', inverted: true },
  { id: 11, text: 'Siento que arrastramos discusiones del pasado que nunca terminamos de resolver.', area: 'conflicto', inverted: true },
  { id: 12, text: 'Cuando surgen problemas, tengo confianza de que encontraremos una solución juntos.', area: 'conflicto', inverted: false },
  // Proyecto de vida (3 preguntas)
  { id: 13, text: 'Cuando imaginamos el futuro, sentimos que vamos en la misma dirección.', area: 'proyecto', inverted: false },
  { id: 14, text: 'Hay decisiones importantes en las que noto que tenemos visiones muy diferentes.', area: 'proyecto', inverted: true },
  { id: 15, text: 'Compartimos al menos una meta importante que nos entusiasma a ambos.', area: 'proyecto', inverted: false },
  // Seguridad emocional (2 preguntas)
  { id: 16, text: 'En momentos importantes siento que mi pareja está de mi lado.', area: 'seguridad', inverted: false },
  { id: 17, text: 'A veces dudo si mi pareja realmente entiende lo que necesito emocionalmente.', area: 'seguridad', inverted: true },
  // Autonomía (3 preguntas)
  { id: 18, text: 'Me siento cómodo siendo completamente yo mismo dentro de la relación.', area: 'autonomia', inverted: false },
  { id: 19, text: 'Siento que necesito pedir permiso o justificar mis decisiones personales.', area: 'autonomia', inverted: true },
  { id: 20, text: 'Podemos pasar tiempo separados sin que genere malestar o inseguridad.', area: 'autonomia', inverted: false }
]

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

// ─── FUNCIONES DE CÁLCULO ─────────────────────────────────────────

function calculateScores(answers) {
  const areaScores = {}
  for (const area of AREAS) {
    const areaQuestions = QUESTIONS.filter(q => q.area === area.key)
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
  const vals = Object.values(areaScores)
  const avg = vals.reduce((a, b) => a + b, 0) / vals.length
  if (avg >= 3.8) return {
    key: 'solida',
    title: 'Relación Sólida',
    emoji: '🟢',
    color: 'from-emerald-500 to-green-500',
    textColor: 'text-emerald-400',
    description: 'Existe una base emocional estable, aunque siempre hay aspectos que pueden fortalecerse.',
    detail: 'Tu relación muestra indicadores saludables en la mayoría de las áreas evaluadas. Esto no significa que no existan desafíos, sino que cuentan con recursos emocionales sólidos para enfrentarlos.'
  }
  if (avg >= 3.0) return {
    key: 'desgaste',
    title: 'Relación en Desgaste',
    emoji: '🟠',
    color: 'from-amber-500 to-orange-500',
    textColor: 'text-amber-400',
    description: 'El vínculo existe, pero algunos patrones están debilitando la conexión.',
    detail: 'La relación conserva elementos positivos importantes, pero hay áreas donde el desgaste está afectando la calidad del vínculo. Identificar estos patrones a tiempo puede prevenir un deterioro mayor.'
  }
  if (avg >= 2.2) return {
    key: 'riesgo',
    title: 'Relación en Riesgo',
    emoji: '🔴',
    color: 'from-red-500 to-rose-500',
    textColor: 'text-red-400',
    description: 'Los conflictos acumulados están afectando seriamente la relación.',
    detail: 'Varios indicadores muestran que la relación está atravesando una etapa difícil. Los patrones actuales, si no se abordan, tienden a profundizarse con el tiempo. La buena noticia es que identificarlos es el primer paso para transformarlos.'
  }
  return {
    key: 'critica',
    title: 'Relación Crítica',
    emoji: '⚫',
    color: 'from-gray-500 to-zinc-500',
    textColor: 'text-gray-400',
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

  // Fortaleza
  if (strongest[1] >= 3.5) {
    parts.push(`Tu relación muestra una fortaleza notable en ${areaLabel(strongest[0])}, lo cual suele ser un factor protector importante para el vínculo.`)
  }

  // Debilidad principal combinada
  if (weakest[1] <= 2.5 && secondWeakest[1] <= 3.0) {
    parts.push(`Sin embargo, los niveles de ${areaLabel(weakest[0])} y ${areaLabel(secondWeakest[0])} sugieren patrones que podrían estar generando un distanciamiento progresivo si no se abordan.`)
  } else if (weakest[1] <= 2.5) {
    parts.push(`El área de ${areaLabel(weakest[0])} muestra indicadores que merecen atención. Este tipo de patrón, cuando no se trabaja, tiende a afectar otras áreas de la relación con el tiempo.`)
  }

  // Patrón comunicación-conflicto
  if (areaScores.comunicacion <= 3.0 && areaScores.conflicto <= 3.0) {
    parts.push('La combinación de dificultades en comunicación y conflicto acumulado es uno de los patrones más frecuentes en relaciones que se deterioran silenciosamente.')
  }

  // Intimidad baja con proyecto alto
  if (areaScores.intimidad <= 2.5 && areaScores.proyecto >= 3.5) {
    parts.push('Es interesante notar que comparten visión de futuro, pero la conexión emocional íntima necesita fortalecerse. Esto a menudo indica que la relación funciona bien en lo práctico pero necesita reconectar en lo emocional.')
  }

  // Autonomía muy baja
  if (areaScores.autonomia <= 2.0) {
    parts.push('Los indicadores de autonomía sugieren un posible patrón de dependencia emocional que vale la pena explorar con mayor profundidad profesional.')
  }

  if (parts.length === 0) {
    parts.push('Los resultados revelan un perfil con matices importantes que merecen explorarse en mayor profundidad. Cada relación es única, y comprender sus dinámicas específicas es clave para fortalecerla.')
  }

  return parts.join('\n\n')
}

// ─── GENERACIÓN DE PDF ────────────────────────────────────────────

function generatePDF(result, areaScores, interpretation, openQuestion) {
  const doc = new jsPDF()
  const pageWidth = doc.internal.pageSize.getWidth()
  const margin = 20

  // Header
  doc.setFillColor(10, 10, 15)
  doc.rect(0, 0, pageWidth, 45, 'F')
  doc.setTextColor(255, 255, 255)
  doc.setFontSize(22)
  doc.text('Informe de Diagnóstico de Relación', pageWidth / 2, 22, { align: 'center' })
  doc.setFontSize(10)
  doc.setTextColor(180, 180, 180)
  doc.text('Luis Virrueta — Psicólogo y Psicoanalista', pageWidth / 2, 32, { align: 'center' })
  doc.text(new Date().toLocaleDateString('es-MX', { year: 'numeric', month: 'long', day: 'numeric' }), pageWidth / 2, 38, { align: 'center' })

  let y = 55

  // Resultado principal
  doc.setTextColor(40, 40, 40)
  doc.setFontSize(16)
  doc.text(`Resultado: ${result.title}`, margin, y)
  y += 10
  doc.setFontSize(11)
  doc.setTextColor(80, 80, 80)
  const descLines = doc.splitTextToSize(result.description, pageWidth - margin * 2)
  doc.text(descLines, margin, y)
  y += descLines.length * 6 + 5
  const detailLines = doc.splitTextToSize(result.detail, pageWidth - margin * 2)
  doc.text(detailLines, margin, y)
  y += detailLines.length * 6 + 12

  // Perfil por áreas
  doc.setFontSize(14)
  doc.setTextColor(40, 40, 40)
  doc.text('Perfil Dinámico de Relación', margin, y)
  y += 10

  for (const area of AREAS) {
    const score = areaScores[area.key]
    const pct = getPercent(score)
    const level = getLevel(score)

    doc.setFontSize(10)
    doc.setTextColor(60, 60, 60)
    doc.text(`${area.label}: ${pct}% — ${level.label}`, margin, y)
    y += 5

    // Barra
    doc.setFillColor(230, 230, 230)
    doc.roundedRect(margin, y, pageWidth - margin * 2, 4, 2, 2, 'F')
    const barColor = pct >= 70 ? [52, 211, 153] : pct >= 40 ? [251, 191, 36] : [248, 113, 113]
    doc.setFillColor(...barColor)
    const barWidth = Math.max(2, ((pageWidth - margin * 2) * pct) / 100)
    doc.roundedRect(margin, y, barWidth, 4, 2, 2, 'F')
    y += 10

    if (y > 260) { doc.addPage(); y = 20 }
  }

  y += 5

  // Interpretación
  if (y > 220) { doc.addPage(); y = 20 }
  doc.setFontSize(14)
  doc.setTextColor(40, 40, 40)
  doc.text('Interpretación Psicológica', margin, y)
  y += 8
  doc.setFontSize(10)
  doc.setTextColor(80, 80, 80)
  const interpLines = doc.splitTextToSize(interpretation, pageWidth - margin * 2)
  doc.text(interpLines, margin, y)
  y += interpLines.length * 5 + 10

  // Áreas fuertes y débiles
  if (y > 230) { doc.addPage(); y = 20 }
  const sorted = Object.entries(areaScores).sort((a, b) => b[1] - a[1])
  const strong = sorted.filter(([, v]) => v >= 3.5).map(([k]) => AREAS.find(a => a.key === k)?.label)
  const weak = sorted.filter(([, v]) => v < 3.0).map(([k]) => AREAS.find(a => a.key === k)?.label)

  doc.setFontSize(12)
  doc.setTextColor(40, 40, 40)
  doc.text('Áreas Fuertes', margin, y)
  y += 7
  doc.setFontSize(10)
  doc.setTextColor(80, 80, 80)
  doc.text(strong.length > 0 ? strong.join(', ') : 'Todas las áreas tienen margen de mejora.', margin, y)
  y += 10

  doc.setFontSize(12)
  doc.setTextColor(40, 40, 40)
  doc.text('Áreas que Necesitan Atención', margin, y)
  y += 7
  doc.setFontSize(10)
  doc.setTextColor(80, 80, 80)
  doc.text(weak.length > 0 ? weak.join(', ') : 'Ningún área muestra niveles preocupantes.', margin, y)
  y += 12

  // Pregunta abierta
  if (openQuestion && openQuestion.trim()) {
    if (y > 240) { doc.addPage(); y = 20 }
    doc.setFontSize(12)
    doc.setTextColor(40, 40, 40)
    doc.text('Lo que más desearían mejorar:', margin, y)
    y += 7
    doc.setFontSize(10)
    doc.setTextColor(80, 80, 80)
    const oqLines = doc.splitTextToSize(`"${openQuestion.trim()}"`, pageWidth - margin * 2)
    doc.text(oqLines, margin, y)
    y += oqLines.length * 5 + 10
  }

  // Recomendaciones
  if (y > 220) { doc.addPage(); y = 20 }
  doc.setFontSize(14)
  doc.setTextColor(40, 40, 40)
  doc.text('Recomendaciones Iniciales', margin, y)
  y += 8
  doc.setFontSize(10)
  doc.setTextColor(80, 80, 80)
  const recs = [
    '1. Dediquen tiempo semanal exclusivo para hablar sin distracciones.',
    '2. Identifiquen los temas que evitan y comprométanse a abordarlos gradualmente.',
    '3. Practiquen la escucha activa: antes de responder, repitan lo que escucharon.',
    '4. Reconozcan verbalmente al menos una cosa positiva del otro cada día.',
    '5. Consideren una sesión profesional para profundizar en los patrones detectados.'
  ]
  for (const rec of recs) {
    const recLines = doc.splitTextToSize(rec, pageWidth - margin * 2)
    doc.text(recLines, margin, y)
    y += recLines.length * 5 + 3
  }

  // Footer / CTA
  if (y > 250) { doc.addPage(); y = 20 }
  y += 10
  doc.setFillColor(245, 245, 245)
  doc.roundedRect(margin, y, pageWidth - margin * 2, 30, 3, 3, 'F')
  doc.setFontSize(11)
  doc.setTextColor(60, 60, 60)
  doc.text('¿Te gustaría profundizar en estos resultados?', pageWidth / 2, y + 10, { align: 'center' })
  doc.setFontSize(10)
  doc.text('Agenda una sesión de diagnóstico de pareja con Luis Virrueta.', pageWidth / 2, y + 18, { align: 'center' })
  doc.text('luisvirrueta.com  ·  wa.me/527228720520', pageWidth / 2, y + 25, { align: 'center' })

  return doc
}

// ─── COMPONENTE PRINCIPAL ─────────────────────────────────────────

const ConsultaParejaPage = () => {
  const navigate = useNavigate()
  const [stage, setStage] = useState('hero') // hero | respondent | test | open-question | email | results | info
  const [respondent, setRespondent] = useState(null)
  const [currentQuestion, setCurrentQuestion] = useState(0)
  const [answers, setAnswers] = useState({})
  const [email, setEmail] = useState('')
  const [emailSubmitted, setEmailSubmitted] = useState(false)
  const [openQuestion, setOpenQuestion] = useState('')
  const [pdfGenerating, setPdfGenerating] = useState(false)
  const topRef = useRef(null)

  const scrollToTop = useCallback(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }, [])

  // Cálculos memoizados
  const areaScores = useMemo(() => calculateScores(answers), [answers])
  const result = useMemo(() => getOverallResult(areaScores), [areaScores])
  const interpretation = useMemo(() => generateInterpretation(areaScores), [areaScores])

  const progress = Math.round((Object.keys(answers).length / QUESTIONS.length) * 100)

  const handleAnswer = (value) => {
    const q = QUESTIONS[currentQuestion]
    setAnswers(prev => ({ ...prev, [q.id]: value }))
    if (currentQuestion < QUESTIONS.length - 1) {
      setTimeout(() => setCurrentQuestion(prev => prev + 1), 300)
    } else {
      setTimeout(() => {
        setStage('open-question')
        scrollToTop()
      }, 400)
    }
  }

  const handleDownloadPDF = async () => {
    setPdfGenerating(true)
    try {
      const doc = generatePDF(result, areaScores, interpretation, openQuestion)
      doc.save('Diagnostico-Relacion-LuisVirrueta.pdf')
    } finally {
      setPdfGenerating(false)
    }
  }

  const whatsappMessage = encodeURIComponent('Hola, acabo de realizar el diagnóstico de relación en tu página y me gustaría recibir más información sobre la consulta de pareja.')
  const whatsappAgendarMessage = encodeURIComponent('Hola, me gustaría agendar una sesión de diagnóstico de pareja.')

  // ─── RENDER ────────────────────────────────────────────────────

  return (
    <div ref={topRef} className="min-h-screen bg-[#0a0a0f]">
      <SEOHead
        title="Diagnóstico de Relación — Consulta de Pareja | Luis Virrueta"
        description="Descubre el estado real de tu relación con este diagnóstico psicológico gratuito. 20 preguntas, resultado personalizado y perfil dinámico de relación."
        url="/servicios/consulta-pareja"
        type="website"
        tags={['consulta de pareja', 'diagnóstico de relación', 'terapia de pareja', 'psicólogo', 'psicoanalista']}
      />

      <AnimatePresence mode="wait">
        {/* ═══════════════════════════════════════════════════════════
            STAGE: HERO
        ═══════════════════════════════════════════════════════════ */}
        {stage === 'hero' && (
          <motion.div
            key="hero"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="relative min-h-screen flex flex-col"
          >
            {/* Decorative orbs */}
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
              <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-pink-600/8 rounded-full blur-3xl" />
              <div className="absolute bottom-1/3 right-1/4 w-80 h-80 bg-rose-600/6 rounded-full blur-3xl" />
              <div className="absolute top-1/2 right-1/3 w-64 h-64 bg-violet-600/5 rounded-full blur-3xl" />
            </div>

            {/* Hero Content */}
            <div className="relative z-10 flex-1 flex flex-col items-center justify-center px-6 pt-28 lg:pt-36 pb-20">
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 1 }}
                className="text-center max-w-3xl mx-auto"
              >
                {/* Badge */}
                <motion.div
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.6, delay: 0.2 }}
                  className="inline-flex items-center gap-2 px-4 py-2 border border-pink-500/20 rounded-full bg-pink-500/5 backdrop-blur-sm mb-10"
                >
                  <Heart className="w-3.5 h-3.5 text-pink-400/70" strokeWidth={1.5} />
                  <span className="text-xs text-pink-300/70 font-light uppercase tracking-[0.2em]">Consulta de Pareja</span>
                </motion.div>

                {/* Title */}
                <h1 className="text-5xl sm:text-6xl lg:text-7xl font-light text-white mb-6 font-display tracking-wide leading-[1.1]">
                  Diagnóstico de{' '}
                  <span className="italic font-normal bg-gradient-to-r from-pink-400 via-rose-400 to-pink-300 bg-clip-text text-transparent">
                    Relación
                  </span>
                </h1>

                {/* Subtitle */}
                <motion.p
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.4 }}
                  className="text-lg lg:text-xl text-white/60 font-light leading-relaxed mb-10 tracking-wide"
                >
                  Descubre el estado real de tu relación en menos de 3 minutos.
                </motion.p>

                {/* Body text */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.6 }}
                  className="space-y-4 mb-12"
                >
                  <p className="text-base lg:text-lg text-white/50 font-extralight leading-relaxed">
                    Muchas relaciones no se rompen por falta de amor.
                  </p>
                  <p className="text-base lg:text-lg text-white/50 font-extralight leading-relaxed">
                    Se rompen por <span className="text-white/70 italic">patrones invisibles</span> que nadie les enseñó a detectar.
                  </p>
                  <p className="text-base lg:text-lg text-white/40 font-extralight leading-relaxed mt-6">
                    Este diagnóstico analiza áreas psicológicas clave para entender la dinámica real de tu relación.
                  </p>
                </motion.div>

                {/* CTA Button */}
                <motion.button
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.8 }}
                  whileHover={{ scale: 1.03 }}
                  whileTap={{ scale: 0.97 }}
                  onClick={() => { setStage('respondent'); scrollToTop() }}
                  className="group relative px-10 py-4 bg-gradient-to-r from-pink-500 to-rose-500 rounded-full text-white font-light text-sm uppercase tracking-[0.2em] overflow-hidden transition-shadow duration-300 hover:shadow-[0_0_40px_rgba(244,63,94,0.3)]"
                >
                  <span className="relative z-10 flex items-center gap-3">
                    COMENZAR DIAGNÓSTICO
                    <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
                  </span>
                  <div className="absolute inset-0 bg-gradient-to-r from-rose-600 to-pink-600 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                </motion.button>

                {/* Meta info */}
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 1 }}
                  className="flex items-center justify-center gap-6 mt-8 text-white/30 text-xs tracking-wider"
                >
                  <span className="flex items-center gap-1.5"><Clock className="w-3.5 h-3.5" /> 3 minutos</span>
                  <span className="w-px h-3 bg-white/20" />
                  <span className="flex items-center gap-1.5"><FileText className="w-3.5 h-3.5" /> 20 preguntas</span>
                  <span className="w-px h-3 bg-white/20" />
                  <span className="flex items-center gap-1.5"><BarChart3 className="w-3.5 h-3.5" /> diagnóstico personalizado</span>
                </motion.div>
              </motion.div>
            </div>

            {/* ─── SECCIÓN: QUÉ ANALIZA ─── */}
            <div className="relative z-10 px-6 lg:px-20 pb-32">
              <div className="max-w-5xl mx-auto">
                <motion.div
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.8 }}
                  className="text-center mb-16"
                >
                  <h2 className="text-3xl lg:text-4xl font-light text-white mb-4 font-display tracking-wide">
                    Qué analiza el <span className="italic font-normal">diagnóstico</span>
                  </h2>
                  <p className="text-white/40 text-sm font-extralight tracking-wide">7 áreas psicológicas fundamentales de tu relación</p>
                </motion.div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
                  {AREAS.map((area, i) => (
                    <motion.div
                      key={area.key}
                      initial={{ opacity: 0, y: 20 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      viewport={{ once: true }}
                      transition={{ duration: 0.5, delay: i * 0.07 }}
                      className="group relative p-6 border border-white/8 rounded-2xl bg-white/[0.02] backdrop-blur-sm hover:border-white/15 transition-all duration-500"
                    >
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
            STAGE: RESPONDENT SELECTION
        ═══════════════════════════════════════════════════════════ */}
        {stage === 'respondent' && (
          <motion.div
            key="respondent"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="min-h-screen flex items-center justify-center px-6 pt-28"
          >
            <div className="max-w-lg w-full text-center">
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.2 }}
                className="inline-flex items-center gap-2 px-4 py-2 border border-white/10 rounded-full bg-white/5 mb-8"
              >
                <Users className="w-3.5 h-3.5 text-white/50" strokeWidth={1.5} />
                <span className="text-xs text-white/50 font-light uppercase tracking-[0.15em]">Antes de comenzar</span>
              </motion.div>

              <h2 className="text-3xl lg:text-4xl font-light text-white mb-4 font-display tracking-wide">
                ¿Quién está respondiendo este diagnóstico?
              </h2>
              <p className="text-white/40 text-sm font-extralight mb-12">Esto nos ayuda a personalizar tu resultado.</p>

              <div className="space-y-4">
                {RESPONDENT_OPTIONS.map((opt, i) => (
                  <motion.button
                    key={opt.value}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.3 + i * 0.1 }}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => {
                      setRespondent(opt.value)
                      setStage('test')
                      scrollToTop()
                    }}
                    className="w-full group flex items-center gap-4 p-5 border border-white/10 rounded-2xl bg-white/[0.02] hover:border-pink-500/30 hover:bg-pink-500/[0.03] transition-all duration-300"
                  >
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
          <motion.div
            key="test"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="min-h-screen flex flex-col pt-24 lg:pt-28 pb-20 px-6"
          >
            {/* Progress bar */}
            <div className="fixed top-0 left-0 right-0 z-50 h-1 bg-white/5">
              <motion.div
                className="h-full bg-gradient-to-r from-pink-500 to-rose-400"
                initial={{ width: 0 }}
                animate={{ width: `${progress}%` }}
                transition={{ duration: 0.4, ease: 'easeOut' }}
              />
            </div>

            <div className="max-w-2xl mx-auto w-full flex-1 flex flex-col justify-center">
              {/* Question counter */}
              <div className="flex items-center justify-between mb-6">
                <span className="text-white/30 text-xs font-light tracking-wider">
                  PREGUNTA {currentQuestion + 1} DE {QUESTIONS.length}
                </span>
                <span className="text-white/20 text-xs font-light tracking-wider">
                  {progress}%
                </span>
              </div>

              {/* Question */}
              <AnimatePresence mode="wait">
                <motion.div
                  key={currentQuestion}
                  initial={{ opacity: 0, x: 30 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -30 }}
                  transition={{ duration: 0.3 }}
                >
                  {/* Area indicator */}
                  <div className="flex items-center gap-2 mb-6">
                    {(() => {
                      const area = AREAS.find(a => a.key === QUESTIONS[currentQuestion].area)
                      return area ? (
                        <div className="flex items-center gap-2 px-3 py-1 rounded-full border border-white/8 bg-white/[0.02]">
                          <area.icon className="w-3 h-3 text-white/40" strokeWidth={1.5} />
                          <span className="text-white/30 text-[10px] font-light uppercase tracking-[0.15em]">{area.label}</span>
                        </div>
                      ) : null
                    })()}
                  </div>

                  <h3 className="text-xl lg:text-2xl font-light text-white/90 leading-relaxed mb-10 tracking-wide font-display italic">
                    "{QUESTIONS[currentQuestion].text}"
                  </h3>

                  {/* Answer options */}
                  <div className="space-y-3">
                    {ANSWER_OPTIONS.map((opt, i) => {
                      const isSelected = answers[QUESTIONS[currentQuestion].id] === opt.value
                      return (
                        <motion.button
                          key={opt.value}
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: i * 0.05 }}
                          whileHover={{ scale: 1.01 }}
                          whileTap={{ scale: 0.99 }}
                          onClick={() => handleAnswer(opt.value)}
                          className={`w-full flex items-center gap-4 p-4 rounded-xl border transition-all duration-300 ${
                            isSelected
                              ? 'border-pink-500/50 bg-pink-500/10 text-white'
                              : 'border-white/8 bg-white/[0.02] text-white/60 hover:border-white/20 hover:bg-white/[0.04]'
                          }`}
                        >
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

              {/* Navigation */}
              <div className="flex items-center justify-between mt-10 pt-6 border-t border-white/5">
                <button
                  onClick={() => setCurrentQuestion(prev => Math.max(0, prev - 1))}
                  disabled={currentQuestion === 0}
                  className="flex items-center gap-2 text-white/30 hover:text-white/60 text-xs tracking-wider disabled:opacity-20 disabled:cursor-not-allowed transition-colors"
                >
                  <ArrowLeft className="w-3.5 h-3.5" /> ANTERIOR
                </button>

                {answers[QUESTIONS[currentQuestion]?.id] != null && currentQuestion < QUESTIONS.length - 1 && (
                  <button
                    onClick={() => setCurrentQuestion(prev => prev + 1)}
                    className="flex items-center gap-2 text-white/30 hover:text-white/60 text-xs tracking-wider transition-colors"
                  >
                    SIGUIENTE <ArrowRight className="w-3.5 h-3.5" />
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
          <motion.div
            key="open-question"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            className="min-h-screen flex items-center justify-center px-6 pt-28"
          >
            <div className="max-w-xl w-full text-center">
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="inline-flex items-center gap-2 px-4 py-2 border border-white/10 rounded-full bg-white/5 mb-8"
              >
                <Heart className="w-3.5 h-3.5 text-pink-400/50" strokeWidth={1.5} />
                <span className="text-xs text-white/50 font-light uppercase tracking-[0.15em]">Una última pregunta</span>
              </motion.div>

              <h2 className="text-2xl lg:text-3xl font-light text-white mb-4 font-display tracking-wide leading-relaxed">
                Si tu relación pudiera mejorar <span className="italic text-pink-300/80">una sola cosa</span>, ¿qué sería?
              </h2>
              <p className="text-white/30 text-sm font-extralight mb-10">Esta respuesta es opcional pero nos ayuda a entender mejor tu situación.</p>

              <textarea
                value={openQuestion}
                onChange={(e) => setOpenQuestion(e.target.value)}
                placeholder="Escribe libremente aquí..."
                maxLength={500}
                className="w-full h-32 p-5 bg-white/[0.03] border border-white/10 rounded-2xl text-white/80 text-sm font-light placeholder:text-white/20 focus:border-pink-500/30 focus:outline-none resize-none transition-colors"
              />

              <div className="flex items-center justify-center gap-4 mt-8">
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => { setStage('email'); scrollToTop() }}
                  className="px-8 py-3.5 bg-gradient-to-r from-pink-500 to-rose-500 rounded-full text-white font-light text-sm uppercase tracking-[0.15em] hover:shadow-[0_0_30px_rgba(244,63,94,0.25)] transition-shadow"
                >
                  Continuar
                </motion.button>
                <button
                  onClick={() => { setStage('email'); scrollToTop() }}
                  className="text-white/30 text-xs hover:text-white/50 tracking-wider transition-colors"
                >
                  OMITIR
                </button>
              </div>
            </div>
          </motion.div>
        )}

        {/* ═══════════════════════════════════════════════════════════
            STAGE: EMAIL CAPTURE
        ═══════════════════════════════════════════════════════════ */}
        {stage === 'email' && (
          <motion.div
            key="email"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            className="min-h-screen flex items-center justify-center px-6 pt-28"
          >
            <div className="max-w-md w-full text-center">
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ type: 'spring', stiffness: 200, delay: 0.1 }}
                className="w-16 h-16 mx-auto mb-8 rounded-full bg-gradient-to-br from-pink-500/20 to-rose-500/20 border border-pink-500/20 flex items-center justify-center"
              >
                <Lock className="w-7 h-7 text-pink-400/70" strokeWidth={1.5} />
              </motion.div>

              <h2 className="text-2xl lg:text-3xl font-light text-white mb-3 font-display tracking-wide">
                Tu diagnóstico está listo
              </h2>
              <p className="text-white/40 text-sm font-extralight mb-10 leading-relaxed">
                Introduce tu email para recibir tu diagnóstico completo con el perfil dinámico de tu relación.
              </p>

              <div className="relative mb-4">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-white/20" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="tu@email.com"
                  className="w-full pl-12 pr-4 py-4 bg-white/[0.03] border border-white/10 rounded-xl text-white/80 text-sm font-light placeholder:text-white/20 focus:border-pink-500/30 focus:outline-none transition-colors"
                />
              </div>

              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => {
                  setEmailSubmitted(true)
                  setStage('results')
                  scrollToTop()
                }}
                disabled={!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)}
                className="w-full py-4 bg-gradient-to-r from-pink-500 to-rose-500 rounded-xl text-white font-light text-sm uppercase tracking-[0.15em] disabled:opacity-30 disabled:cursor-not-allowed hover:shadow-[0_0_30px_rgba(244,63,94,0.25)] transition-all"
              >
                Ver mi diagnóstico
              </motion.button>

              <button
                onClick={() => { setStage('results'); scrollToTop() }}
                className="mt-4 text-white/20 text-xs hover:text-white/40 tracking-wider transition-colors"
              >
                CONTINUAR SIN EMAIL
              </button>
            </div>
          </motion.div>
        )}

        {/* ═══════════════════════════════════════════════════════════
            STAGE: RESULTS
        ═══════════════════════════════════════════════════════════ */}
        {stage === 'results' && (
          <motion.div
            key="results"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="min-h-screen pt-24 lg:pt-32 pb-20 px-6"
          >
            {/* Decorative orbs */}
            <div className="fixed inset-0 overflow-hidden pointer-events-none z-0">
              <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-pink-600/5 rounded-full blur-3xl" />
              <div className="absolute bottom-1/3 right-1/4 w-80 h-80 bg-violet-600/5 rounded-full blur-3xl" />
            </div>

            <div className="max-w-3xl mx-auto relative z-10">
              {/* ─── RESULTADO PRINCIPAL ─── */}
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8 }}
                className="text-center mb-16"
              >
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ type: 'spring', stiffness: 150, delay: 0.2 }}
                  className="text-5xl mb-6"
                >
                  {result.emoji}
                </motion.div>

                <div className="inline-flex items-center gap-2 px-4 py-1.5 border border-white/10 rounded-full bg-white/5 mb-6">
                  <span className="text-xs text-white/50 font-light uppercase tracking-[0.15em]">Resultado del diagnóstico</span>
                </div>

                <h2 className={`text-4xl lg:text-5xl font-light mb-6 font-display tracking-wide bg-gradient-to-r ${result.color} bg-clip-text text-transparent`}>
                  {result.title}
                </h2>

                <p className="text-white/60 text-base lg:text-lg font-light leading-relaxed max-w-xl mx-auto mb-4">
                  {result.description}
                </p>
                <p className="text-white/40 text-sm font-extralight leading-relaxed max-w-xl mx-auto">
                  {result.detail}
                </p>
              </motion.div>

              {/* ─── PERFIL DINÁMICO ─── */}
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
                className="mb-16"
              >
                <div className="flex items-center gap-3 mb-8">
                  <BarChart3 className="w-5 h-5 text-pink-400/60" strokeWidth={1.5} />
                  <h3 className="text-xl font-light text-white tracking-wide font-display">Perfil de tu relación</h3>
                </div>

                <div className="space-y-5">
                  {AREAS.map((area, i) => {
                    const score = areaScores[area.key]
                    const pct = getPercent(score)
                    const level = getLevel(score)
                    return (
                      <motion.div
                        key={area.key}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.5 + i * 0.08 }}
                        className="group"
                      >
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
                          <motion.div
                            initial={{ width: 0 }}
                            animate={{ width: `${pct}%` }}
                            transition={{ duration: 1, delay: 0.6 + i * 0.08, ease: 'easeOut' }}
                            className={`h-full rounded-full bg-gradient-to-r ${area.color}`}
                          />
                        </div>
                      </motion.div>
                    )
                  })}
                </div>
              </motion.div>

              {/* ─── INTERPRETACIÓN PSICOLÓGICA ─── */}
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.8 }}
                className="mb-16 p-8 border border-white/8 rounded-2xl bg-white/[0.02]"
              >
                <div className="flex items-center gap-3 mb-6">
                  <Brain className="w-5 h-5 text-violet-400/60" strokeWidth={1.5} />
                  <h3 className="text-lg font-light text-white tracking-wide font-display">Interpretación psicológica</h3>
                </div>
                {interpretation.split('\n\n').map((p, i) => (
                  <p key={i} className="text-white/50 text-sm font-extralight leading-[1.9] tracking-wide mb-4 last:mb-0">
                    {p}
                  </p>
                ))}
              </motion.div>

              {/* ─── RECOMENDACIÓN PROFESIONAL ─── */}
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 1 }}
                className="mb-16 p-8 border border-pink-500/15 rounded-2xl bg-gradient-to-br from-pink-500/[0.03] to-transparent"
              >
                <h3 className="text-lg font-light text-white mb-3 tracking-wide font-display">Recomendación profesional</h3>
                <p className="text-white/50 text-sm font-extralight leading-relaxed mb-6">
                  Los resultados sugieren que la relación podría beneficiarse mucho de una conversación guiada que permita identificar los patrones invisibles que están generando estos resultados.
                </p>
                <motion.a
                  href={`https://wa.me/527228720520?text=${whatsappAgendarMessage}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className="inline-flex items-center gap-3 px-8 py-3.5 bg-gradient-to-r from-pink-500 to-rose-500 rounded-full text-white font-light text-sm uppercase tracking-[0.15em] hover:shadow-[0_0_30px_rgba(244,63,94,0.25)] transition-shadow"
                >
                  Agendar sesión de diagnóstico <ArrowRight className="w-4 h-4" />
                </motion.a>
              </motion.div>

              {/* ─── BOTONES DE ACCIÓN ─── */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 1.2 }}
                className="flex flex-wrap items-center justify-center gap-4 mb-20"
              >
                {/* Download PDF */}
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={handleDownloadPDF}
                  disabled={pdfGenerating}
                  className="flex items-center gap-2.5 px-6 py-3 border border-white/15 rounded-full text-white/70 text-xs font-light uppercase tracking-[0.15em] hover:border-white/30 hover:text-white/90 transition-all disabled:opacity-40"
                >
                  <Download className="w-4 h-4" />
                  {pdfGenerating ? 'Generando...' : 'Descargar PDF'}
                </motion.button>

                {/* WhatsApp */}
                <motion.a
                  href={`https://wa.me/527228720520?text=${whatsappMessage}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className="flex items-center gap-2.5 px-6 py-3 border border-emerald-500/30 rounded-full text-emerald-400/80 text-xs font-light uppercase tracking-[0.15em] hover:border-emerald-400/50 hover:bg-emerald-500/5 transition-all"
                >
                  <Send className="w-4 h-4" />
                  Recibir por WhatsApp
                </motion.a>
              </motion.div>

              {/* ─── SECCIÓN QUÉ PUEDES HACER AHORA ─── */}
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                className="mb-20 text-center"
              >
                <h3 className="text-3xl lg:text-4xl font-light text-white mb-6 font-display tracking-wide">
                  Qué puedes hacer <span className="italic font-normal">ahora</span>
                </h3>
                <p className="text-white/50 text-sm lg:text-base font-extralight leading-[1.9] max-w-xl mx-auto mb-10">
                  Este diagnóstico revela patrones importantes que vale la pena explorar con mayor profundidad.
                  En una sesión profesional analizamos la dinámica de tu relación, identificamos los patrones invisibles
                  que están afectando el vínculo y construimos estrategias claras para transformarlos.
                </p>

                <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                  <motion.a
                    href={`https://wa.me/527228720520?text=${whatsappAgendarMessage}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    whileHover={{ scale: 1.03 }}
                    whileTap={{ scale: 0.97 }}
                    className="px-8 py-4 bg-gradient-to-r from-pink-500 to-rose-500 rounded-full text-white font-light text-xs uppercase tracking-[0.2em] hover:shadow-[0_0_40px_rgba(244,63,94,0.3)] transition-shadow"
                  >
                    Agendar Sesión de Diagnóstico de Pareja
                  </motion.a>
                  <button
                    onClick={() => { setStage('info'); scrollToTop() }}
                    className="px-6 py-3.5 border border-white/15 rounded-full text-white/60 font-light text-xs uppercase tracking-[0.15em] hover:border-white/30 hover:text-white/80 transition-all"
                  >
                    Conocer Cómo Funciona la Consulta
                  </button>
                </div>
              </motion.div>
            </div>
          </motion.div>
        )}

        {/* ═══════════════════════════════════════════════════════════
            STAGE: INFO (CÓMO FUNCIONA LA CONSULTA)
        ═══════════════════════════════════════════════════════════ */}
        {stage === 'info' && (
          <motion.div
            key="info"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="min-h-screen pt-24 lg:pt-32 pb-20 px-6"
          >
            <div className="max-w-2xl mx-auto">
              {/* Back button */}
              <button
                onClick={() => { setStage('results'); scrollToTop() }}
                className="flex items-center gap-2 text-white/30 hover:text-white/60 text-xs tracking-wider mb-12 transition-colors"
              >
                <ArrowLeft className="w-3.5 h-3.5" /> VOLVER A RESULTADOS
              </button>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="text-center mb-16"
              >
                <div className="inline-flex items-center gap-2 px-4 py-2 border border-pink-500/20 rounded-full bg-pink-500/5 mb-8">
                  <Heart className="w-3.5 h-3.5 text-pink-400/70" strokeWidth={1.5} />
                  <span className="text-xs text-pink-300/70 font-light uppercase tracking-[0.2em]">Consulta de Pareja</span>
                </div>

                <h2 className="text-3xl lg:text-4xl font-light text-white mb-4 font-display tracking-wide">
                  Cómo funciona la <span className="italic font-normal">consulta</span>
                </h2>
              </motion.div>

              {/* Features */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                className="p-8 border border-white/8 rounded-2xl bg-white/[0.02] mb-8"
              >
                <h3 className="text-white/90 text-sm font-light uppercase tracking-[0.2em] mb-8">Qué incluye la sesión</h3>
                <div className="space-y-5">
                  {[
                    'Análisis de dinámica de pareja',
                    'Identificación de patrones inconscientes',
                    'Herramientas prácticas de comunicación',
                    'Claridad sobre el futuro de la relación'
                  ].map((item, i) => (
                    <div key={i} className="flex items-start gap-3">
                      <Check className="w-4 h-4 text-pink-400/60 mt-0.5 flex-shrink-0" strokeWidth={2} />
                      <span className="text-white/60 text-sm font-light leading-relaxed">{item}</span>
                    </div>
                  ))}
                </div>
              </motion.div>

              {/* Details */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
                className="grid grid-cols-2 gap-4 mb-12"
              >
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

              {/* CTA */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 }}
                className="text-center"
              >
                <motion.a
                  href={`https://wa.me/527228720520?text=${whatsappAgendarMessage}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  whileHover={{ scale: 1.03 }}
                  whileTap={{ scale: 0.97 }}
                  className="inline-flex items-center gap-3 px-10 py-4 bg-gradient-to-r from-pink-500 to-rose-500 rounded-full text-white font-light text-sm uppercase tracking-[0.2em] hover:shadow-[0_0_40px_rgba(244,63,94,0.3)] transition-shadow"
                >
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
