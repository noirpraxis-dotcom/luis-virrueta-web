import { motion, AnimatePresence } from 'framer-motion'
import { useState, useRef, useCallback, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  ArrowRight, ArrowLeft, Check, Sparkles, Mic, MicOff, Volume2, VolumeX,
  Loader2, ChevronDown, AlertTriangle, TrendingUp, TrendingDown, Star,
  Shield, Activity, Brain, Heart, Zap, Eye, Target, Users, Flame,
  CheckCircle, Download, PenLine, Send, MessageCircle, Lightbulb, Clock,
  Headphones, SkipForward, Anchor, Compass, Scale, Gift, Repeat
} from 'lucide-react'
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell, RadarChart as RechartRadar, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar } from 'recharts'
import SEOHead from '../components/SEOHead'
import jsPDF from 'jspdf'
import { analyzeRadiografiaPremium, generateFallbackAnalysis } from '../services/radiografiaPremiumService'
import { CACHED_PREVIEW_ANALYSIS } from '../data/cachedPreviewAnalysis'

// ─── 40 PREGUNTAS NARRATIVAS — 5 BLOQUES ────────────────────

const PREGUNTAS = [
  // BLOQUE 0 — Contexto personal y panorama general (Q1–Q5)
  {
    id: 'Q1', block: 'Contexto personal y panorama general',
    mainQuestion: 'Para empezar, cuéntame un poco sobre tu vida actualmente y en qué momento te encuentras hoy.',
    examples: ['¿A qué te dedicas o en qué estás enfocado actualmente?', '¿Cómo describirías el momento de vida en el que te encuentras ahora?', '¿Cuánto tiempo llevas en tu relación actual?', '¿Hay algo que esté pasando en tu vida que creas que impacta tu relación?']
  },
  {
    id: 'Q2', block: 'Contexto personal y panorama general',
    mainQuestion: 'Cuéntame la historia de tu relación desde el principio hasta hoy, como si estuvieras resumiendo el camino que han recorrido juntos.',
    examples: ['Cómo se conocieron', 'Cómo empezó la conexión entre ustedes', 'Qué momentos recuerdas como importantes', 'Qué etapas o cambios han vivido', 'Cómo ha evolucionado la relación con el tiempo']
  },
  {
    id: 'Q3', block: 'Contexto personal y panorama general',
    mainQuestion: 'Pensando en el presente, cuéntame cómo describirías tu relación actualmente y cómo sientes que están las cosas entre ustedes en este momento.',
    examples: ['Cómo te sientes en la relación actualmente', 'Qué cosas están funcionando bien entre ustedes', 'Qué cosas se han vuelto más difíciles', 'Qué ha cambiado con el tiempo']
  },
  {
    id: 'Q4', block: 'Contexto personal y panorama general',
    mainQuestion: 'Háblame de cómo es la vida cotidiana entre ustedes y cómo suelen relacionarse en el día a día.',
    examples: ['Cómo pasan el tiempo juntos normalmente', 'Cómo se cuidan o se apoyan mutuamente en el día a día', 'Cómo suelen comunicarse cuando necesitan algo del otro', 'Si sienten que se protegen mutuamente o si cada uno va por su lado']
  },
  {
    id: 'Q5', block: 'Contexto personal y panorama general',
    mainQuestion: 'Cuando miras todo lo que han vivido juntos hasta ahora, cuéntame qué sientes que han construido o desarrollado como pareja a lo largo del tiempo.',
    examples: ['Experiencias importantes que han vivido juntos', 'Cosas que sienten que han logrado como pareja', 'Aprendizajes que han tenido en la relación', 'Cómo ha influido esta relación en tu vida']
  },

  // BLOQUE 2 — Origen del vínculo y atracción inicial (Q6–Q10)
  {
    id: 'Q6', block: 'Origen del vínculo y atracción inicial',
    mainQuestion: 'Regresando al inicio de la relación, cuéntame qué fue lo que más te llamó la atención de tu pareja cuando empezaron a conocerse.',
    examples: ['Qué fue lo primero que te atrajo físicamente o emocionalmente', 'Qué cualidades o rasgos de personalidad te llamaban la atención', 'Qué despertó tu curiosidad, admiración o interés', 'Qué tenía esa persona que la hacía especial o diferente para ti']
  },
  {
    id: 'Q7', block: 'Expresión afectiva y lenguajes del amor',
    mainQuestion: 'Cuéntame cómo se demuestran cariño o amor entre ustedes en el día a día, y cómo te gusta a ti que te lo demuestren.',
    examples: ['Si se expresan más con palabras, con gestos, con tiempo juntos o con contacto físico', 'Cómo te gusta que te demuestren que te quieren', 'Cómo le demuestras tú a tu pareja que la quieres', 'Si hay diferencias en la forma en que cada uno expresa o necesita recibir amor']
  },
  {
    id: 'Q8', block: 'Origen del vínculo y atracción inicial',
    mainQuestion: 'Mirando la historia de la relación, cuéntame qué momentos o etapas recuerdas como especialmente importantes o significativas en el camino que han recorrido juntos.',
    examples: ['Momentos felices o significativos', 'Momentos difíciles que recuerdas', 'Etapas que cambiaron la relación', 'Situaciones que marcaron el vínculo']
  },
  {
    id: 'Q9', block: 'Origen del vínculo y atracción inicial',
    mainQuestion: 'Cuando la relación estaba comenzando, cuéntame cómo imaginabas que podría ser el futuro entre ustedes o hacia dónde sentías que podía ir la relación.',
    examples: ['Qué imaginabas que podría pasar entre ustedes', 'Qué esperabas de la relación en ese momento', 'Qué tipo de relación pensabas que podrían tener', 'Qué futuro imaginabas posible']
  },
  {
    id: 'Q10', block: 'Origen del vínculo y atracción inicial',
    mainQuestion: 'Pensando en lo que sentías por tu pareja en ese momento, cuéntame qué representaba esa persona para ti o qué sentías que encontrabas en esa relación.',
    examples: ['Qué significaba esa persona en tu vida', 'Qué te hacía sentir esa relación', 'Qué creías que esa persona aportaba a tu vida', 'Qué encontrabas en esa conexión']
  },

  // BLOQUE 3 — Historia emocional y patrones relacionales (Q11–Q20)
  {
    id: 'Q11', block: 'Historia emocional y patrones relacionales',
    mainQuestion: 'Ahora me gustaría que me cuentes un poco sobre el ambiente en el que creciste y cómo era la relación entre las personas que te criaron o las figuras importantes de tu infancia.',
    examples: ['Cómo se trataban entre ellos', 'Qué tipo de relación tenían', 'Cómo resolvían conflictos', 'Qué recuerdas de la dinámica entre ellos']
  },
  {
    id: 'Q12', block: 'Historia emocional y patrones relacionales',
    mainQuestion: 'Pensando en lo que viste o viviste mientras crecías, cuéntame qué ideas o creencias sobre el amor y las relaciones sientes que aprendiste en tu familia o en las relaciones que observabas a tu alrededor.',
    examples: ['Qué pensabas que era el amor', 'Qué creencias viste sobre las relaciones', 'Qué cosas aprendiste directa o indirectamente', 'Qué tipo de relación parecía "normal" para ti']
  },
  {
    id: 'Q13', block: 'Historia emocional y patrones relacionales',
    mainQuestion: 'Hoy que estás en una relación, cuéntame si hay algo de la forma en que se relacionaban las personas de tu familia que sientas que de alguna manera también aparece en tu forma de relacionarte con tu pareja.',
    examples: ['Comportamientos que reconoces repetir', 'Formas de reaccionar que te recuerdan a tu familia', 'Dinámicas que se parecen a lo que viste crecer', 'Cosas que te sorprende notar en ti mismo']
  },
  {
    id: 'Q14', block: 'Historia emocional y patrones relacionales',
    mainQuestion: 'Antes de esta relación, cuéntame cómo fueron tus relaciones importantes anteriores y qué cosas sientes que aprendiste de ellas.',
    examples: ['Experiencias que recuerdas de relaciones anteriores y qué aprendiste', 'Si sientes que hay patrones que se repiten entre relaciones', 'Dinámicas que reconoces que aparecen una y otra vez', 'Qué descubriste sobre lo que buscas o no buscas en una pareja']
  },
  {
    id: 'Q15', block: 'Identidad y autonomía dentro de la relación',
    mainQuestion: 'Dentro de tu relación, cuéntame qué tanto sientes que puedes ser tú mismo/a sin perder tu identidad o tus propios espacios.',
    examples: ['Si sientes que puedes expresar lo que piensas y sientes libremente', 'Si mantienes actividades, amistades o intereses propios fuera de la relación', 'Si alguna vez sientes que te adaptas demasiado para evitar conflicto', 'Qué tanto espacio personal necesitas y qué tanto sientes que tienes']
  },
  {
    id: 'Q16', block: 'Regulación emocional y equipo de pareja',
    mainQuestion: 'Cuéntame si sienten que funcionan como equipo cuando las cosas se ponen difíciles, o si cada uno tiende a manejar las cosas por su lado.',
    examples: ['Cómo se cuidan o protegen mutuamente en momentos de estrés', 'Si cuando uno está mal el otro lo nota y responde', 'Si sienten que se regulan emocionalmente juntos o cada uno por su cuenta', 'Si hay momentos en que uno necesita al otro y no lo encuentra disponible']
  },
  {
    id: 'Q17', block: 'Historia emocional y patrones relacionales',
    mainQuestion: 'En tu relación actual, cuéntame cómo suelen empezar los desacuerdos o discusiones cuando aparecen.',
    examples: ['Qué situaciones suelen generar conflicto', 'Cómo empieza normalmente una discusión', 'Qué suele ocurrir al principio del conflicto', 'Qué suele pasar entre ustedes cuando surge una diferencia']
  },
  {
    id: 'Q18', block: 'Historia emocional y patrones relacionales',
    mainQuestion: 'Cuando aparece un conflicto o una discusión en la relación, cuéntame cómo reaccionas tú normalmente en ese momento.',
    examples: ['Qué sueles sentir primero', 'Qué haces normalmente en ese momento', 'Cómo respondes frente a la discusión', 'Cómo manejas tus emociones cuando hay tensión']
  },
  {
    id: 'Q19', block: 'Historia emocional y patrones relacionales',
    mainQuestion: 'Cuando hay un desacuerdo o una discusión entre ustedes, cuéntame cómo suele reaccionar tu pareja.',
    examples: ['Cómo responde tu pareja al conflicto', 'Qué suele hacer o decir', 'Cómo maneja sus emociones en esos momentos', 'Qué suele ocurrir después de una discusión']
  },
  {
    id: 'Q20', block: 'Historia emocional y patrones relacionales',
    mainQuestion: 'Pensando en los conflictos que han tenido, cuéntame qué suele pasar después de una discusión o desacuerdo entre ustedes.',
    examples: ['Cómo termina normalmente una discusión', 'Si suelen hablar después del conflicto', 'Si alguien suele dar el primer paso para resolverlo', 'Qué pasa entre ustedes después de esos momentos']
  },

  // BLOQUE 4 — Deseo, intimidad y dinámica emocional (Q21–Q30)
  {
    id: 'Q21', block: 'Deseo, intimidad y dinámica emocional',
    mainQuestion: 'Cuéntame qué cosas de tu pareja siguen despertando atracción o deseo en ti hoy en día.',
    examples: ['Aspectos físicos que te siguen atrayendo', 'Formas de ser o actitudes que te generan deseo', 'Momentos en los que sientes atracción o erotismo', 'Situaciones que reactivan la atracción entre ustedes']
  },
  {
    id: 'Q22', block: 'Deseo, intimidad y dinámica emocional',
    mainQuestion: 'Cuéntame cómo describirías la cercanía emocional que existe entre ustedes actualmente.',
    examples: ['Momentos en los que se sienten conectados', 'Conversaciones o experiencias que los acercan', 'Situaciones en las que se sienten comprendidos', 'Momentos en que sienten distancia emocional']
  },
  {
    id: 'Q23', block: 'Deseo, intimidad y dinámica emocional',
    mainQuestion: 'Háblame de cómo se vive actualmente la intimidad física o sexual entre ustedes en la relación.',
    examples: ['Cómo se sienten en ese aspecto de la relación', 'Si sienten cercanía o distancia física', 'Si ambos parecen vivirlo de forma similar o diferente', 'Cómo ha cambiado con el tiempo']
  },
  {
    id: 'Q24', block: 'Deseo, intimidad y dinámica emocional',
    mainQuestion: 'Pensando en el tiempo que llevan juntos, cuéntame cómo ha cambiado el deseo o la atracción entre ustedes desde el inicio de la relación hasta hoy.',
    examples: ['Cómo era el deseo al inicio', 'Cómo lo percibes ahora', 'Qué situaciones han influido en esos cambios', 'Qué cosas parecen reactivar o disminuir el deseo']
  },
  {
    id: 'Q25', block: 'Deseo, intimidad y dinámica emocional',
    mainQuestion: 'Cuéntame qué cosas o situaciones suelen hacer que se sientan más cercanos o conectados dentro de la relación.',
    examples: ['Cómo suelen demostrarse cariño o amor en los momentos buenos', 'Si se conectan más con palabras, con gestos, con tiempo juntos o con contacto físico', 'Momentos en los que sienten que funcionan como equipo', 'Qué cosas hace tu pareja que te hacen sentir querido/a o valorado/a']
  },
  {
    id: 'Q26', block: 'Deseo, intimidad y dinámica emocional',
    mainQuestion: 'Cuéntame si hay momentos o situaciones en los que sientes más distancia entre ustedes dentro de la relación.',
    examples: ['Momentos en los que cada uno parece estar en su propio mundo', 'Situaciones que generan distancia emocional', 'Momentos en que la relación parece enfriarse', 'Circunstancias que los separan o desconectan']
  },
  {
    id: 'Q27', block: 'Deseo, intimidad y dinámica emocional',
    mainQuestion: 'Cuando tienen que tomar decisiones importantes dentro de la relación, cuéntame cómo suelen manejar esas situaciones entre ustedes.',
    examples: ['Cómo toman decisiones importantes', 'Cómo manejan las diferencias de opinión', 'Cómo llegan a acuerdos', 'Qué suele pasar cuando no están de acuerdo']
  },
  {
    id: 'Q28', block: 'Dinámicas de poder y equilibrio emocional',
    mainQuestion: 'Cuéntame si dentro de la relación sientes que hay un equilibrio en el poder y la influencia entre ustedes, o si alguno de los dos suele tener más peso.',
    examples: ['Si alguno suele ceder más que el otro en las decisiones o conflictos', 'Si hay resentimientos acumulados que no se han expresado abiertamente', 'Si alguna vez te has sentido menos escuchado/a o invisible en la relación', 'Si hay momentos de dominación o sumisión emocional entre ustedes']
  },
  {
    id: 'Q29', block: 'Deseo, intimidad y dinámica emocional',
    mainQuestion: 'Pensando en tu pareja, cuéntame qué crees que es importante para ella dentro de la relación o qué cosas parece esperar de ti.',
    examples: ['Qué cosas parece valorar más', 'Qué crees que espera de ti', 'Qué cosas parecen importantes para ella', 'Qué cosas le gustaría que fueran diferentes']
  },
  {
    id: 'Q30', block: 'Deseo, intimidad y dinámica emocional',
    mainQuestion: 'Ahora piensa en lo que tú esperas dentro de la relación y cuéntame qué cosas son importantes para ti.',
    examples: ['Qué tipo de muestras de amor o cariño necesitas para sentirte bien', 'Si necesitas más palabras, más presencia, más contacto o más acciones concretas', 'Qué tanto espacio personal necesitas dentro de la relación para sentirte tú mismo/a', 'Qué cosas te gustaría que fueran diferentes en cómo se demuestran amor']
  },

  // BLOQUE 5 — Futuro del vínculo y sentido (Q31–Q40)
  {
    id: 'Q31', block: 'Futuro del vínculo y sentido de la relación',
    mainQuestion: 'Pensando en todo lo que han vivido juntos, cuéntame qué significa hoy esta relación para ti dentro de tu vida.',
    examples: ['Qué lugar ocupa esta relación en tu vida y qué representa para ti', 'Qué te hace sentir que vale la pena seguir construyendo este vínculo', 'Cualidades de tu pareja que aprecias profundamente', 'Razones por las que sientes que esta relación es importante en tu vida']
  },
  {
    id: 'Q32', block: 'Futuro del vínculo y sentido de la relación',
    mainQuestion: 'Cuando piensas en el futuro, cuéntame cómo imaginas o visualizas la relación entre ustedes con el paso del tiempo.',
    examples: ['Cómo imaginas la relación en los próximos años', 'Qué cambios o mejoras te gustaría ver en la relación', 'Dinámicas que te gustaría fortalecer o transformar', 'Qué cosas te gustaría construir juntos hacia adelante']
  },
  {
    id: 'Q33', block: 'Seguridad emocional y expresión de amor',
    mainQuestion: 'Cuéntame qué cosas concretas hace tu pareja que te hacen sentir amado/a o seguro/a, y cuáles sientes que te faltan.',
    examples: ['Acciones específicas que te hacen sentir valorado/a y querido/a', 'Cosas que tu pareja hacía antes y que ya no hace', 'Qué necesitarías recibir más de tu pareja para sentirte seguro/a', 'Momentos en que te sientes realmente querido/a vs. momentos en que no']
  },
  {
    id: 'Q34', block: 'Futuro del vínculo y sentido de la relación',
    mainQuestion: 'Cuéntame si hay cosas dentro de la relación que a veces te generan dudas, preocupación o incertidumbre.',
    examples: ['Situaciones que te generan inquietud', 'Cosas que te hacen pensar o reflexionar sobre la relación', 'Aspectos que te gustaría que fueran diferentes', 'Momentos donde aparecen dudas']
  },
  {
    id: 'Q35', block: 'Futuro del vínculo y sentido de la relación',
    mainQuestion: 'Pensando en los momentos difíciles que han vivido como pareja, cuéntame cómo han logrado atravesarlos o qué suele ayudar a que la relación continúe después de esos momentos.',
    examples: ['Cómo superan momentos complicados', 'Qué ayuda a que se reconcilien', 'Qué fortalezas aparecen en la relación', 'Qué hace posible que sigan adelante']
  },
  {
    id: 'Q36', block: 'Novedad, rutina y deseo',
    mainQuestion: 'Cuéntame si sienten que la relación tiene momentos de novedad o sorpresa, o si se ha vuelto más predecible y rutinaria.',
    examples: ['Si hay espacio para la sorpresa o lo inesperado entre ustedes', 'Si extrañas la emoción o la aventura que sentían al principio', 'Si han buscado formas de romper la rutina juntos', 'Qué tanto la estabilidad les da paz vs. aburrimiento']
  },
  {
    id: 'Q37', block: 'Futuro del vínculo y sentido de la relación',
    mainQuestion: 'Si tuvieras que decir qué está buscando cada uno dentro de esta relación, cuéntame qué crees que busca tu pareja y qué crees que estás buscando tú.',
    examples: ['Qué parece necesitar o desear tu pareja en la relación', 'Qué crees que intenta encontrar contigo', 'Qué sientes que tú buscas dentro del vínculo', 'Qué necesidades profundas aparecen en la relación']
  },
  {
    id: 'Q38', block: 'Futuro del vínculo y sentido de la relación',
    mainQuestion: 'Pensando en todo lo que has contado hasta ahora, cuéntame qué crees que esta relación ha despertado o revelado en ti como persona.',
    examples: ['Aspectos de tu personalidad que han cambiado o se han desarrollado', 'Cosas que has descubierto sobre ti mismo/a gracias a esta relación', 'Aprendizajes profundos que han surgido en la relación', 'Partes de ti que se han transformado o que no conocías antes']
  },
  {
    id: 'Q39', block: 'Futuro del vínculo y sentido de la relación',
    mainQuestion: 'Si tuvieras que explicar qué hace única o particular tu relación con esta persona, cuéntame cómo la describirías.',
    examples: ['Qué hace diferente esta relación de otras', 'Qué tipo de conexión sienten', 'Qué rasgos definen su vínculo', 'Qué características hacen especial la relación']
  },
  {
    id: 'Q40', block: 'Futuro del vínculo y sentido de la relación',
    mainQuestion: 'Para terminar, cuéntame si hay algo importante sobre tu relación o sobre lo que estás viviendo en ella que sientas que todavía no has mencionado y que te gustaría compartir.',
    examples: ['Algo que consideres importante decir', 'Algo que sientas que ayuda a entender la relación', 'Algo que te gustaría expresar sobre el vínculo', 'Cualquier reflexión que sientas relevante']
  }
]

// ─── DIMENSION LABELS ──────────────────────────────────────────

const DIMENSION_LABELS = {
  estabilidad_relacional: 'Estabilidad',
  apego_emocional: 'Apego',
  conexion_emocional: 'Conexión',
  deseo_erotico: 'Deseo',
  intimidad: 'Intimidad',
  sincronia_relacional: 'Sincronía',
  patrones_inconscientes: 'Patrones Inc.',
  fantasma_relacional: 'Fantasma Rel.',
  roles_sistemicos: 'Roles',
  resiliencia_vinculo: 'Resiliencia',
  vulnerabilidad_emocional: 'Vulnerabilidad',
  narrativa_futuro: 'Futuro'
}

const DIMENSION_COLORS = [
  '#818cf8', '#c084fc', '#f472b6', '#fb923c', '#fbbf24', '#34d399',
  '#22d3ee', '#60a5fa', '#a78bfa', '#e879f9', '#f87171', '#4ade80'
]

// ─── ElevenLabs voices (Latin Spanish) ────────────

const VOICE_LIST = [
  { id: 'EXAVITQu4vr4xnSDxMaL', name: 'Valentina', desc: 'Cálida y clara', initial: 'V', color: 'from-rose-500 to-pink-500', ring: 'ring-rose-400/20', border: 'border-rose-500/30', bg: 'bg-rose-500/10', text: 'text-rose-300' },
  { id: 'JBFqnCBsd6RMkjVDRZzb', name: 'Santiago', desc: 'Firme y profesional', initial: 'S', color: 'from-violet-500 to-indigo-500', ring: 'ring-violet-400/20', border: 'border-violet-500/30', bg: 'bg-violet-500/10', text: 'text-violet-300' },
  { id: 'onwK4e9ZLuTAKqWW03F9', name: 'Adrián', desc: 'Profundo y sereno', initial: 'A', color: 'from-blue-500 to-cyan-500', ring: 'ring-blue-400/20', border: 'border-blue-500/30', bg: 'bg-blue-500/10', text: 'text-blue-300' },
  { id: 'FGY2WhTYpPnrIDTdsKH5', name: 'Camila', desc: 'Ágil y expresiva', initial: 'C', color: 'from-fuchsia-500 to-purple-500', ring: 'ring-fuchsia-400/20', border: 'border-fuchsia-500/30', bg: 'bg-fuchsia-500/10', text: 'text-fuchsia-300' }
]

// ─── MicLevelBars (visual mic test feedback) ───────────────────
const MicLevelBars = ({ analyser }) => {
  const canvasRef = useRef(null)
  useEffect(() => {
    if (!analyser) return
    const data = new Uint8Array(analyser.frequencyBinCount)
    let raf
    const draw = () => {
      analyser.getByteFrequencyData(data)
      const canvas = canvasRef.current
      if (!canvas) return
      const ctx = canvas.getContext('2d')
      ctx.clearRect(0, 0, canvas.width, canvas.height)
      const bars = 20, w = canvas.width / bars
      for (let i = 0; i < bars; i++) {
        const v = data[i * 2] / 255
        const h = v * canvas.height
        ctx.fillStyle = v > 0.5 ? '#34d399' : v > 0.2 ? '#6ee7b7' : '#a7f3d0'
        ctx.fillRect(i * w + 1, canvas.height - h, w - 2, h)
      }
      raf = requestAnimationFrame(draw)
    }
    draw()
    return () => cancelAnimationFrame(raf)
  }, [analyser])
  return <canvas ref={canvasRef} width={200} height={40} className="mx-auto rounded-lg" />
}

// ─── RecordingBars (real analyser for recording indicator) ────────
const RecordingBars = ({ analyser }) => {
  const barsRef = useRef([])
  const rafRef = useRef(null)
  const [heights, setHeights] = useState([4, 6, 3, 5])
  useEffect(() => {
    if (!analyser) return
    const data = new Uint8Array(analyser.frequencyBinCount)
    const draw = () => {
      analyser.getByteFrequencyData(data)
      const step = Math.floor(data.length / 4)
      const h = [0, 1, 2, 3].map(i => {
        let sum = 0
        for (let j = i * step; j < (i + 1) * step; j++) sum += data[j]
        return Math.max(3, (sum / step / 255) * 24)
      })
      setHeights(h)
      rafRef.current = requestAnimationFrame(draw)
    }
    draw()
    return () => { if (rafRef.current) cancelAnimationFrame(rafRef.current) }
  }, [analyser])
  return (
    <div className="flex gap-1 items-end" style={{ height: 24 }}>
      {heights.map((h, i) => (
        <div key={i} className="w-1.5 rounded-full bg-red-500/60 transition-all duration-75"
          style={{ height: `${h}px`, opacity: 0.5 + (h / 24) * 0.5 }} />
      ))}
    </div>
  )
}

// ─── AutoanalisisRadial: D3-powered radial mind-map of 10 sections ────────
const AUTOANALISIS_SECTIONS = [
  { key: 'apertura_rapport', label: 'Rapport', icon: '💜', color: '#c084fc' },
  { key: 'forma_de_amar', label: 'Forma de amar', icon: '❤️', color: '#f472b6' },
  { key: 'lo_que_busca_en_el_otro', label: 'Lo que buscas', icon: '🔍', color: '#60a5fa' },
  { key: 'lo_que_reclama_afuera', label: 'Lo que reclamas', icon: '📣', color: '#fb923c' },
  { key: 'fantasma_relacional', label: 'Fantasma', icon: '👻', color: '#a78bfa' },
  { key: 'yo_ideal', label: 'Yo ideal', icon: '✨', color: '#fbbf24' },
  { key: 'mecanismos_defensa', label: 'Defensas', icon: '🛡️', color: '#34d399' },
  { key: 'tipo_pareja_que_repite', label: 'Patrón repetido', icon: '🔄', color: '#22d3ee' },
  { key: 'nucleo_del_patron', label: 'Núcleo', icon: '🎯', color: '#f87171' },
  { key: 'cierre_transformador', label: 'Transformación', icon: '🦋', color: '#e879f9' }
]

const AutoanalisisRadial = ({ data }) => {
  const present = AUTOANALISIS_SECTIONS.filter(s => data[s.key])
  const n = present.length
  if (n === 0) return null
  const cx = 200, cy = 200, r = 140
  const nodes = present.map((s, i) => {
    const angle = (i / n) * Math.PI * 2 - Math.PI / 2
    const textLen = (data[s.key] || '').length
    const nodeR = Math.max(18, Math.min(30, textLen / 20))
    return { ...s, x: cx + r * Math.cos(angle), y: cy + r * Math.sin(angle), nodeR, angle }
  })
  return (
    <div className="flex justify-center mb-6">
      <svg viewBox="0 0 400 400" className="w-full max-w-sm" style={{ filter: 'drop-shadow(0 0 20px rgba(139,92,246,0.08))' }}>
        {/* Connecting lines */}
        {nodes.map((node, i) => (
          <line key={`line-${i}`} x1={cx} y1={cy} x2={node.x} y2={node.y}
            stroke={node.color} strokeOpacity={0.15} strokeWidth={1.5} />
        ))}
        {/* Outer ring for context */}
        <circle cx={cx} cy={cy} r={r + 5} fill="none" stroke="rgba(255,255,255,0.04)" strokeWidth={1} strokeDasharray="4 4" />
        {/* Center node */}
        <circle cx={cx} cy={cy} r={32} fill="rgba(139,92,246,0.12)" stroke="rgba(139,92,246,0.3)" strokeWidth={1.5} />
        <text x={cx} y={cy - 6} textAnchor="middle" fill="rgba(255,255,255,0.7)" fontSize="10" fontWeight="500">Tu forma</text>
        <text x={cx} y={cy + 8} textAnchor="middle" fill="rgba(255,255,255,0.7)" fontSize="10" fontWeight="500">de amar</text>
        {/* Nodes */}
        {nodes.map((node, i) => (
          <g key={`node-${i}`}>
            <circle cx={node.x} cy={node.y} r={node.nodeR} fill={`${node.color}18`} stroke={`${node.color}40`} strokeWidth={1.5} />
            <text x={node.x} y={node.y + 1} textAnchor="middle" dominantBaseline="central" fontSize="14">{node.icon}</text>
            {/* Label outside the circle */}
            <text
              x={node.x + (node.x > cx ? node.nodeR + 6 : -(node.nodeR + 6))}
              y={node.y + 1}
              textAnchor={node.x > cx ? 'start' : node.x < cx - 5 ? 'end' : 'middle'}
              dominantBaseline="central"
              fill="rgba(255,255,255,0.5)" fontSize="9" fontWeight="400"
            >{node.label}</text>
          </g>
        ))}
      </svg>
    </div>
  )
}

// ─── Spotlight Onboarding Components ──────────────────────────────
const SpotlightCutout = ({ targetId }) => {
  const [rect, setRect] = useState(null)
  useEffect(() => {
    const el = document.getElementById(targetId)
    if (!el) return
    const update = () => {
      const r = el.getBoundingClientRect()
      setRect({ top: r.top - 8, left: r.left - 8, width: r.width + 16, height: r.height + 16 })
    }
    update()
    window.addEventListener('resize', update)
    window.addEventListener('scroll', update)
    return () => { window.removeEventListener('resize', update); window.removeEventListener('scroll', update) }
  }, [targetId])
  if (!rect) return null
  return (
    <div className="absolute pointer-events-none" style={{
      top: rect.top, left: rect.left, width: rect.width, height: rect.height,
      boxShadow: '0 0 0 9999px rgba(0,0,0,0.75)',
      borderRadius: '16px', zIndex: 51
    }} />
  )
}

const SpotlightTooltip = ({ targetId, onboardingStep, totalSteps, step, borderColor, bgCard, dotColor, onNext, onSkip }) => {
  const [pos, setPos] = useState(null)
  useEffect(() => {
    const el = document.getElementById(targetId)
    if (!el) return
    const update = () => {
      const r = el.getBoundingClientRect()
      setPos({ top: r.bottom + 16, left: Math.max(16, r.left + r.width / 2 - 160), width: 320 })
    }
    update()
    window.addEventListener('resize', update)
    window.addEventListener('scroll', update)
    return () => { window.removeEventListener('resize', update); window.removeEventListener('scroll', update) }
  }, [targetId])
  if (!pos) return null
  return (
    <motion.div
      key={onboardingStep}
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
      className={`fixed z-[52] pointer-events-auto p-5 rounded-2xl border ${borderColor} bg-gradient-to-br ${bgCard} to-zinc-900/98 shadow-2xl`}
      style={{ top: pos.top, left: pos.left, width: pos.width, maxWidth: 'calc(100vw - 32px)' }}
      onClick={e => e.stopPropagation()}>
      <h3 className="text-white text-base font-medium mb-2">{step.title}</h3>
      <p className="text-white/50 text-sm font-light leading-relaxed mb-4">{step.desc}</p>
      <div className="flex items-center justify-between">
        <div className="flex gap-2">
          {Array.from({ length: totalSteps }).map((_, i) => (
            <div key={i} className={`w-2 h-2 rounded-full transition-all ${i === onboardingStep ? `${dotColor} scale-125` : 'bg-white/15'}`} />
          ))}
        </div>
        <div className="flex items-center gap-3">
          <button onClick={onSkip} className="text-white/25 text-xs hover:text-white/50 transition-colors">Saltar</button>
          <motion.button onClick={onNext} whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}
            className="px-5 py-2 rounded-xl bg-gradient-to-r from-violet-600 to-fuchsia-600 text-white text-xs font-light shadow-lg shadow-violet-600/20">
            {onboardingStep < totalSteps - 1 ? 'Siguiente' : 'Comenzar'}
          </motion.button>
        </div>
      </div>
    </motion.div>
  )
}

// ─── DEMO RESPONSES (for testing) ────────────────────────────────

const DEMO_RESPONSES = {
  Q1: 'Me llamo Carlos, tengo 32 años, soy diseñador gráfico freelance. Llevo 4 años con mi pareja Ana. Estoy en un momento de mucha reflexión personal, buscando estabilidad.',
  Q2: 'Nos conocimos en una fiesta de amigos en común hace como 5 años. Al principio fue algo casual, nos caímos bien, empezamos a salir y poco a poco se fue haciendo más serio. Llevamos viviendo juntos dos años.',
  Q3: 'Actualmente la relación está en un momento complicado. Hay muchas discusiones por cosas pequeñas. Pero también hay momentos buenos donde sentimos que todo vale la pena.',
  Q4: 'En el día a día trabajamos los dos desde casa. Compartimos las comidas, a veces vemos series juntos. La comunicación es lo que más nos cuesta, a veces pasamos horas sin hablarnos después de una discusión.',
  Q5: 'Siento que hemos construido un hogar juntos, una rutina. También hemos aprendido a conocernos profundamente. La relación me ha enseñado mucho sobre mí mismo.',
  Q6: 'Lo que más me llamó la atención fue su inteligencia y su risa. Tenía una forma de ver la vida que me parecía fascinante, como muy libre y segura de sí misma.',
  Q7: 'Ella me demuestra cariño con palabras, me dice cosas bonitas y me escribe mensajes. Yo soy más de actos, le hago cosas, le cocino. A mí me gusta más el contacto físico, los abrazos. Ella prefiere que le diga cosas. A veces choca porque cada uno lo expresa diferente.',
  Q8: 'El primer viaje que hicimos juntos fue muy importante. También cuando decidimos vivir juntos. Y hubo una crisis fuerte hace un año que nos cambió mucho.',
  Q9: 'Al principio imaginaba que íbamos a ser una pareja muy unida, viajar mucho, crecer juntos profesionalmente. Veía un futuro largo.',
  Q10: 'Ella representaba estabilidad emocional para mí. Sentía que con ella podía ser yo mismo sin máscaras.',
  Q11: 'Mis padres tenían una relación complicada. Se querían pero discutían mucho. Mi mamá era más emocional y mi papá más distante.',
  Q12: 'Aprendí que el amor requiere sacrificio, que hay que aguantar. También que las discusiones son normales. No vi mucha expresión de cariño físico.',
  Q13: 'Sí, noto que a veces me distancio como hacía mi papá. Me cuesta expresar lo que siento y me refugio en el silencio.',
  Q14: 'Tuve una relación de 3 años antes que terminó porque yo era muy celoso. Aprendí que los celos destruyen todo.',
  Q15: 'Siento que puedo ser yo mismo en muchas cosas, pero hay temas donde me callo para no generar conflicto. Mantengo mis amigos pero a veces siento culpa por salir. Creo que me adapto más de lo que debería para mantener la paz.',
  Q16: 'Cuando las cosas están difíciles, cada uno tiende a manejar el estrés por su lado. Yo me encierro y ella busca a sus amigas. No siempre funciona como equipo, pero cuando uno está realmente mal, el otro sí responde.',
  Q17: 'Las discusiones empiezan por cosas pequeñas, como tareas del hogar o decisiones del día a día. Escala rápido.',
  Q18: 'Yo tiendo a callarme y alejarme. Me cuesta mucho discutir en el momento, prefiero pensar antes de hablar.',
  Q19: 'Ella se frustra porque yo me callo. Sube el tono, insiste en que yo hable. A veces llora de frustración.',
  Q20: 'Después de una discusión solemos pasar un rato sin hablarnos. Generalmente ella da el primer paso para reconciliarnos.',
  Q21: 'Me sigue atrayendo mucho su físico, su manera de moverse. Pero lo que más me atrae es cuando la veo apasionada por algo que le gusta.',
  Q22: 'Hay momentos de mucha conexión, sobre todo cuando hablamos de nuestros sueños o cuando viajamos juntos. Pero en la rutina es más difícil.',
  Q23: 'La intimidad física ha bajado un poco. Antes era más frecuente y más espontánea. Ahora se siente más como un esfuerzo.',
  Q24: 'Al inicio el deseo era muy fuerte, constante. Ahora hay altibajos. Después de discusiones es difícil reconectarse.',
  Q25: 'Los viajes nos acercan mucho. También cocinar juntos o cuando compartimos algo creativo.',
  Q26: 'La distancia aparece cuando hay mucho estrés laboral o después de conflictos. A veces siento que vivimos como roommates.',
  Q27: 'Las decisiones grandes las tomamos platicando, pero a veces siento que ella impone su punto de vista y yo cedo.',
  Q28: 'Siento que ella tiene más peso en las decisiones importantes, yo suelo ceder. Hay resentimientos que no he expresado, como sentir que mis opiniones pesan menos. A veces me siento invisible cuando ella ya decidió algo sin consultarme.',
  Q29: 'Creo que para ella es importante sentirse valorada y escuchada. Necesita que le demuestre que me importa con acciones.',
  Q30: 'Para mí es importante tener algo de espacio personal, sentir que somos equipo, y tener más momentos de diversión juntos.',
  Q31: 'Esta relación es muy importante para mí. Es donde me siento más yo, aunque también donde más vulnerable soy.',
  Q32: 'Imagino que si trabajamos en nuestra comunicación podemos tener un futuro muy sólido. Me gustaría formar una familia.',
  Q33: 'Me siento amado cuando ella me abraza sin razón, o cuando me pregunta cómo estoy de verdad. Antes me dejaba notas, ya no lo hace. Me faltaría más contacto físico y que me diga que está orgullosa de mí.',
  Q34: 'A veces me pregunto si somos compatibles a largo plazo. Las discusiones repetitivas me generan duda.',
  Q35: 'Lo que nos ha salvado es que los dos queremos estar juntos. Hay amor debajo de todo el conflicto.',
  Q36: 'La relación se ha vuelto bastante rutinaria. Ya no hay sorpresas, todo es predecible. Extraño la emoción del principio, las aventuras espontáneas. Hemos intentado romper la rutina pero siempre volvemos a lo mismo.',
  Q37: 'Creo que ella busca seguridad emocional y cercanía. Yo busco compañerismo y paz en la relación.',
  Q38: 'He descubierto que soy más sensible de lo que creía. También que tengo miedo al abandono.',
  Q39: 'Lo único de nuestra relación es la intensidad. Nos amamos mucho pero también nos hacemos daño. Es apasionada.',
  Q40: 'Creo que lo más importante es que ambos estamos aquí porque queremos mejorar. Eso dice mucho.'
}

// ─── ANÁLISIS ANIMATION TASKS ─────────────────────────────────────

const ANALYSIS_TASKS = [
  { id: 1, group: 'Lectura profunda', text: 'Leyendo tu narrativa completa…' },
  { id: 2, group: 'Lectura profunda', text: 'Procesando 40 respuestas y contexto emocional…' },
  { id: 3, group: 'Lectura profunda', text: 'Detectando temas recurrentes y contradicciones…' },
  { id: 4, group: 'Detección de patrones', text: 'Identificando tono relacional dominante…' },
  { id: 5, group: 'Detección de patrones', text: 'Infiriendo estilo de apego (Amir Levine)…' },
  { id: 6, group: 'Detección de patrones', text: 'Detectando lenguajes del amor (Chapman)…' },
  { id: 7, group: 'Detección de patrones', text: 'Analizando dinámicas de poder (Terrence Real)…' },
  { id: 8, group: 'Análisis por corriente', text: 'Evaluando los 4 jinetes de Gottman…' },
  { id: 9, group: 'Análisis por corriente', text: 'Aplicando teoría del vínculo (Sue Johnson)…' },
  { id: 10, group: 'Análisis por corriente', text: 'Analizando erotismo y deseo (Esther Perel)…' },
  { id: 11, group: 'Análisis por corriente', text: 'Evaluando regulación mutua (Tatkin)…' },
  { id: 12, group: 'Análisis por corriente', text: 'Midiendo triángulo del amor (Sternberg)…' },
  { id: 13, group: 'Análisis por corriente', text: 'Evaluando diferenciación (Schnarch)…' },
  { id: 14, group: 'Análisis por corriente', text: 'Interpretando desde el psicoanálisis (Freud + Lacan)…' },
  { id: 15, group: 'Análisis por corriente', text: 'Analizando imago relacional (Hendrix)…' },
  { id: 16, group: 'Síntesis final', text: 'Calculando 12 dimensiones psicológicas…' },
  { id: 17, group: 'Síntesis final', text: 'Extrayendo evidencia textual…' },
  { id: 18, group: 'Síntesis final', text: 'Estimando dirección probable del vínculo…' },
  { id: 19, group: 'Síntesis final', text: 'Generando visualizaciones…' },
  { id: 20, group: 'Síntesis final', text: 'Compilando informe final…' }
]

// ─── HELPERS ──────────────────────────────────────────────────

function renderBold(text) {
  if (!text) return null
  return text.split(/\*\*(.*?)\*\*/g).map((part, i) =>
    i % 2 === 1 ? <strong key={i} className="font-semibold text-white/85">{part}</strong> : part
  )
}

/* Strip bold markers — for autoanalisis sections (plain text, no negritas) */
function stripBold(text) {
  if (!text) return null
  return text.replace(/\*\*(.*?)\*\*/g, '$1')
}

function getLevelColor(val) {
  if (val >= 70) return 'text-emerald-400'
  if (val >= 45) return 'text-amber-400'
  return 'text-red-400'
}

function getBarGradient(val) {
  if (val >= 60) return 'from-emerald-500 to-green-400'
  if (val >= 40) return 'from-amber-500 to-yellow-400'
  return 'from-red-500 to-orange-400'
}

// ─── RADAR CHART ──────────────────────────────────────────────

function RadarChart({ dimensiones }) {
  const keys = Object.keys(DIMENSION_LABELS)
  const labels = Object.values(DIMENSION_LABELS)
  const n = keys.length
  const cx = 250, cy = 250, r = 170

  const getPoint = (i, val) => {
    const angle = (Math.PI * 2 * i) / n - Math.PI / 2
    const dist = (val / 100) * r
    return { x: cx + dist * Math.cos(angle), y: cy + dist * Math.sin(angle) }
  }

  const polygon = keys.map((k, i) => {
    const p = getPoint(i, dimensiones[k] || 0)
    return `${p.x},${p.y}`
  }).join(' ')

  return (
    <div>
      <svg viewBox="0 0 500 500" className="w-full max-w-lg mx-auto">
        {[20, 40, 60, 80, 100].map(level => (
          <circle key={level} cx={cx} cy={cy} r={r * level / 100} fill="none" stroke="rgba(255,255,255,0.06)" strokeWidth={0.5} />
        ))}
        {keys.map((_, i) => {
          const p = getPoint(i, 100)
          return <line key={i} x1={cx} y1={cy} x2={p.x} y2={p.y} stroke="rgba(255,255,255,0.08)" strokeWidth={0.5} />
        })}
        {keys.map((k, i) => {
          const p1 = getPoint(i, dimensiones[keys[i]] || 0)
          const p2 = getPoint((i + 1) % n, dimensiones[keys[(i + 1) % n]] || 0)
          return (
            <polygon key={`seg-${i}`}
              points={`${cx},${cy} ${p1.x},${p1.y} ${p2.x},${p2.y}`}
              fill={DIMENSION_COLORS[i]} fillOpacity={0.10}
              stroke={DIMENSION_COLORS[i]} strokeOpacity={0.25} strokeWidth={0.7}
            />
          )
        })}
        <polygon points={polygon} fill="none" stroke="rgba(255,255,255,0.15)" strokeWidth={0.5} />
        {keys.map((k, i) => {
          const p = getPoint(i, dimensiones[k] || 0)
          return <circle key={k} cx={p.x} cy={p.y} r={4} fill={DIMENSION_COLORS[i]} />
        })}
        {keys.map((_, i) => {
          const p = getPoint(i, 135)
          return (
            <text key={i} x={p.x} y={p.y} textAnchor="middle" dominantBaseline="middle"
              fill={DIMENSION_COLORS[i]} className="text-[9px] font-light" fillOpacity={0.9}>
              {labels[i]}
            </text>
          )
        })}
      </svg>
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 mt-5">
        {keys.map((key, i) => (
          <div key={key} className="flex items-center gap-2 p-2 rounded-lg border border-white/[0.06] bg-white/[0.02]">
            <div className="w-2.5 h-2.5 rounded-full flex-shrink-0" style={{ backgroundColor: DIMENSION_COLORS[i] }} />
            <span className="text-white/55 text-xs font-light flex-1 leading-tight">{labels[i]}</span>
            <span className="text-white/75 text-xs font-medium tabular-nums">{dimensiones[key] ?? 0}%</span>
          </div>
        ))}
      </div>
    </div>
  )
}

// ─── GAUGE CHART ──────────────────────────────────────────────

function GaugeChart({ value, label, inverted = false }) {
  const v = Math.max(0, Math.min(100, value || 0))
  const color = inverted
    ? (v > 60 ? '#ef4444' : v > 40 ? '#f59e0b' : '#10b981')
    : (v >= 60 ? '#10b981' : v >= 40 ? '#f59e0b' : '#ef4444')
  const arc = Math.PI * 80
  const filled = (v / 100) * arc
  return (
    <div className="flex flex-col items-center">
      <svg viewBox="0 0 200 115" className="w-full max-w-[160px]">
        <path d="M 20 95 A 80 80 0 0 1 180 95" fill="none" stroke="rgba(255,255,255,0.06)" strokeWidth={14} strokeLinecap="round" />
        <path d="M 20 95 A 80 80 0 0 1 180 95" fill="none" stroke={color} strokeWidth={14} strokeLinecap="round" strokeOpacity={0.6}
          strokeDasharray={`${filled} ${arc}`} />
        <text x="100" y="85" textAnchor="middle" fill="white" fontSize="28" fontWeight="300" opacity={0.85}>{v}%</text>
      </svg>
      {label && <span className="text-white/50 text-xs font-light text-center mt-1">{label}</span>}
    </div>
  )
}

// ─── MAIN COMPONENT ──────────────────────────────────────────────

const RadiografiaPremiumPage = () => {
  const navigate = useNavigate()

  // Stages: instructions | profile | questionnaire | analyzing | results
  const [stage, setStage] = useState('instructions')
  const [currentQ, setCurrentQ] = useState(0)
  const [responses, setResponses] = useState({})
  const [selectedVoiceId, setSelectedVoiceId] = useState(VOICE_LIST[0].id)
  const [previewingVoiceId, setPreviewingVoiceId] = useState(null)

  // Profile — Question 0 (name, age, date, partner)
  const [profileData, setProfileData] = useState({ nombre: '', edad: '', nombrePareja: '', edadPareja: '', fecha: new Date().toLocaleDateString('es-MX', { year: 'numeric', month: 'long', day: 'numeric' }) })
  const [soundTestOk, setSoundTestOk] = useState(null)
  const [micTestOk, setMicTestOk] = useState(null)
  const [micAnalyser, setMicAnalyser] = useState(null)

  // Audio
  const [audioPlaying, setAudioPlaying] = useState(false)
  const audioRef = useRef(null)
  const currentAudioRef = useRef(null)
  const playGenerationRef = useRef(0)

  // Recording & Input
  const [recording, setRecording] = useState(false)
  const [transcript, setTranscript] = useState('')
  const [typingMode, setTypingMode] = useState(false)
  const [textInput, setTextInput] = useState('')
  const recognitionRef = useRef(null)
  const [recordingAnalyser, setRecordingAnalyser] = useState(null)
  const recordingStreamRef = useRef(null)

  // Analysis
  const [aiAnalysis, setAiAnalysis] = useState(null)
  const [analysisDone, setAnalysisDone] = useState(false)
  const [completedTasks, setCompletedTasks] = useState(0)
  const [pdfGenerating, setPdfGenerating] = useState(false)
  const [chartViewMode, setChartViewMode] = useState('radar')
  const [cachedAnalysis, setCachedAnalysis] = useState(null)
  const [showOnboarding, setShowOnboarding] = useState(false)
  const [onboardingStep, setOnboardingStep] = useState(0)

  // Email
  const [emailData, setEmailData] = useState({ emailUsuario: '', emailPareja: '' })

  const question = PREGUNTAS[currentQ]
  const totalQ = PREGUNTAS.length
  const progress = ((currentQ + 1) / totalQ) * 100

  // ── Restore saved progress from localStorage ──
  useEffect(() => {
    try {
      const saved = localStorage.getItem('radiografia_premium_progress')
      if (saved) {
        const data = JSON.parse(saved)
        if (data.responses && Object.keys(data.responses).length > 0) {
          setResponses(data.responses)
          if (data.currentQ != null) setCurrentQ(data.currentQ)
          if (data.profileData) setProfileData(prev => ({ ...prev, ...data.profileData }))
          if (data.stage === 'questionnaire') setStage('questionnaire')
        }
      }
    } catch { /* ignore corrupted data */ }
  }, [])

  // ── Save progress to localStorage on every change ──
  useEffect(() => {
    if (stage === 'questionnaire' && Object.keys(responses).length > 0) {
      localStorage.setItem('radiografia_premium_progress', JSON.stringify({
        responses, currentQ, profileData, stage: 'questionnaire'
      }))
    }
  }, [responses, currentQ, stage, profileData])

  // ── Stop any currently playing audio ──
  const stopAudio = useCallback(() => {
    if (currentAudioRef.current) {
      currentAudioRef.current.pause()
      currentAudioRef.current.currentTime = 0
      currentAudioRef.current = null
    }
    setAudioPlaying(false)
  }, [])

  // ── Voice ID → folder name mapping for static audio ──
  const VOICE_FOLDER = {
    'EXAVITQu4vr4xnSDxMaL': 'valentina',
    'JBFqnCBsd6RMkjVDRZzb': 'santiago',
    'onwK4e9ZLuTAKqWW03F9': 'adrian',
    'FGY2WhTYpPnrIDTdsKH5': 'camila'
  }

  // ── Play audio: static files first, ElevenLabs API as fallback ──
  const audioCache = useRef({})
  const playQuestion = useCallback(async (text, overrideVoiceId, onEndedCallback, staticId) => {
    stopAudio()
    const voiceId = overrideVoiceId || selectedVoiceId
    const thisGeneration = ++playGenerationRef.current
    try {
      setAudioPlaying(true)
      if (overrideVoiceId) setPreviewingVoiceId(overrideVoiceId)

      const cacheKey = `${voiceId}::${text.slice(0, 80)}`

      // Try static file first
      const voiceFolder = VOICE_FOLDER[voiceId]
      const currentQuestion = PREGUNTAS.find(q => q.mainQuestion === text)
      const isPreview = text.includes('soy ') && text.includes('acompañaré')
      const staticFile = voiceFolder && (staticId
        ? `/audio/premium/${voiceFolder}/${staticId}.mp3`
        : currentQuestion
        ? `/audio/premium/${voiceFolder}/${currentQuestion.id}.mp3`
        : isPreview ? `/audio/premium/${voiceFolder}/preview.mp3` : null)

      let audioUrl = null

      if (staticFile) {
        // Use static file
        const testRes = await fetch(staticFile, { method: 'HEAD' }).catch(() => null)
        if (testRes?.ok) {
          audioUrl = staticFile
        }
      }

      // Fallback to cache or API
      if (!audioUrl) {
        let blob = audioCache.current[cacheKey]
        if (!blob) {
          const apiKey = import.meta.env.VITE_ELEVENLABS_API_KEY
          if (!apiKey) { setAudioPlaying(false); setPreviewingVoiceId(null); return }
          const res = await fetch(`https://api.elevenlabs.io/v1/text-to-speech/${voiceId}`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json', 'xi-api-key': apiKey },
            body: JSON.stringify({
              text,
              model_id: 'eleven_multilingual_v2',
              voice_settings: { stability: 0.35, similarity_boost: 0.85, style: 0.3, use_speaker_boost: true }
            })
          })
          if (!res.ok) { setAudioPlaying(false); setPreviewingVoiceId(null); return }
          blob = await res.blob()
          audioCache.current[cacheKey] = blob
        }
        audioUrl = URL.createObjectURL(blob)
      }

      if (thisGeneration !== playGenerationRef.current) return

      const audio = new Audio(audioUrl)
      currentAudioRef.current = audio
      audio.onended = () => {
        setAudioPlaying(false)
        setPreviewingVoiceId(null)
        currentAudioRef.current = null
        if (onEndedCallback) onEndedCallback()
      }
      audio.play()
    } catch { setAudioPlaying(false); setPreviewingVoiceId(null) }
  }, [selectedVoiceId, stopAudio])

  // ── Preload next question audio (static files don't need preloading) ──
  const preloadAudio = useCallback(async (text) => {
    // Check if static file exists for this question — if so, no preload needed
    const voiceFolder = VOICE_FOLDER[selectedVoiceId]
    const q = PREGUNTAS.find(p => p.mainQuestion === text)
    if (voiceFolder && q) return // static files preload via browser cache

    const apiKey = import.meta.env.VITE_ELEVENLABS_API_KEY
    if (!apiKey) return
    const cacheKey = `${selectedVoiceId}::${text.slice(0, 80)}`
    if (audioCache.current[cacheKey]) return
    try {
      const res = await fetch(`https://api.elevenlabs.io/v1/text-to-speech/${selectedVoiceId}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'xi-api-key': apiKey },
        body: JSON.stringify({
          text,
          model_id: 'eleven_multilingual_v2',
          voice_settings: { stability: 0.35, similarity_boost: 0.85, style: 0.3, use_speaker_boost: true }
        })
      })
      if (res.ok) {
        const blob = await res.blob()
        audioCache.current[cacheKey] = blob
      }
    } catch {}
  }, [selectedVoiceId])

  // ── Auto-play question when changing question + auto-mic after audio ends ──
  useEffect(() => {
    if (stage === 'questionnaire' && question && !showOnboarding) {
      setTypingMode(false)
      playQuestion(question.mainQuestion, undefined, () => {
        // Auto-start mic after TTS ends (only if not already recording/typing)
        setTimeout(() => {
          const sr = window.SpeechRecognition || window.webkitSpeechRecognition
          if (sr && !typingMode) startRecording()
        }, 300)
      })
      // Preload next question
      if (currentQ < totalQ - 1) {
        const nextQ = PREGUNTAS[currentQ + 1]
        if (nextQ) preloadAudio(nextQ.mainQuestion)
      }
    }
    return () => stopAudio()
  }, [currentQ, stage, showOnboarding]) // eslint-disable-line react-hooks-exhaustive-deps

  // ── Spotlight narration: play TTS for each onboarding step ──
  useEffect(() => {
    if (!showOnboarding || stage !== 'questionnaire' || currentQ !== 0) return
    const NARRATIONS = [
      'Aquí verás la pregunta. Se lee en voz alta automáticamente. Solo relájate y escucha.',
      'Si te faltó algo, aquí tienes ideas para enriquecer tu respuesta.',
      'El micrófono se activa automáticamente. Habla con libertad. Cuando termines, toca Siguiente.'
    ]
    const text = NARRATIONS[onboardingStep]
    if (text) playQuestion(text)
    return () => stopAudio()
  }, [onboardingStep, showOnboarding]) // eslint-disable-line react-hooks-exhaustive-deps

  // ── Speech recognition ──
  const startRecording = useCallback(async () => {
    stopAudio() // Stop audio if playing
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition
    if (!SpeechRecognition) return
    // Get mic stream for real analyser
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true })
      recordingStreamRef.current = stream
      const audioCtx = new (window.AudioContext || window.webkitAudioContext)()
      const source = audioCtx.createMediaStreamSource(stream)
      const analyserNode = audioCtx.createAnalyser()
      analyserNode.fftSize = 256
      source.connect(analyserNode)
      setRecordingAnalyser(analyserNode)
    } catch { /* mic already granted via speech recognition */ }
    const recognition = new SpeechRecognition()
    recognition.lang = 'es-MX'
    recognition.continuous = true
    recognition.interimResults = true
    let finalText = transcript || ''
    recognition.onresult = (e) => {
      let interim = ''
      for (let i = e.resultIndex; i < e.results.length; i++) {
        if (e.results[i].isFinal) finalText += e.results[i][0].transcript + ' '
        else interim += e.results[i][0].transcript
      }
      setTranscript(finalText + interim)
    }
    recognition.onerror = () => { setRecording(false) }
    recognition.onend = () => { setRecording(false) }
    recognitionRef.current = recognition
    recognition.start()
    setRecording(true)
  }, [transcript, stopAudio])

  const stopRecording = useCallback(() => {
    if (recognitionRef.current) recognitionRef.current.stop()
    if (recordingStreamRef.current) {
      recordingStreamRef.current.getTracks().forEach(t => t.stop())
      recordingStreamRef.current = null
    }
    setRecordingAnalyser(null)
    setRecording(false)
  }, [])

  // ── Save response and navigate ──
  const currentText = typingMode ? textInput : transcript

  const saveAndNext = useCallback(() => {
    const finalText = typingMode ? textInput.trim() : transcript.trim()
    if (finalText) {
      setResponses(prev => ({ ...prev, [question.id]: finalText }))
    }
    stopRecording()
    setTranscript('')
    setTextInput('')
    setTypingMode(false)
    if (currentQ < totalQ - 1) {
      setCurrentQ(prev => prev + 1)
    } else {
      const finalResponses = { ...responses }
      if (finalText) finalResponses[question.id] = finalText
      handleRunAnalysis(finalResponses)
    }
  }, [textInput, transcript, typingMode, currentQ, totalQ, question, responses, stopRecording])

  const goBack = useCallback(() => {
    if (currentQ > 0) {
      const finalText = typingMode ? textInput.trim() : transcript.trim()
      if (finalText) {
        setResponses(prev => ({ ...prev, [question.id]: finalText }))
      }
      stopRecording()
      setCurrentQ(prev => prev - 1)
      const prevQ = PREGUNTAS[currentQ - 1]
      const prevVal = responses[prevQ.id] || ''
      setTranscript(prevVal)
      setTextInput(prevVal)
      setTypingMode(false)
    }
  }, [currentQ, textInput, transcript, typingMode, question, responses, stopRecording])

  // ── When entering a question, load saved transcript ──
  useEffect(() => {
    if (stage === 'questionnaire') {
      const saved = responses[question?.id] || ''
      setTranscript(saved)
      setTextInput(saved)
      setTypingMode(false)
    }
  }, [currentQ, stage]) // eslint-disable-line react-hooks/exhaustive-deps

  // ── Fill demo responses for testing ──
  const fillDemoResponses = useCallback(() => {
    setResponses({ ...DEMO_RESPONSES })
    setTranscript(DEMO_RESPONSES[question?.id] || '')
    setTextInput(DEMO_RESPONSES[question?.id] || '')
  }, [question])

  // ── Run AI Analysis ──
  const handleRunAnalysis = useCallback(async (finalResponses) => {
    // If we have a cached analysis (DEV mode), use it directly
    if (cachedAnalysis) {
      setAiAnalysis(cachedAnalysis)
      setStage('results')
      return
    }

    setStage('analyzing')
    setCompletedTasks(0)
    setAnalysisDone(false)

    // Start animation — 20 tasks, fast enough to finish within typical API time
    let taskIdx = 0
    const animInterval = setInterval(() => {
      taskIdx++
      setCompletedTasks(taskIdx)
      if (taskIdx >= ANALYSIS_TASKS.length) clearInterval(animInterval)
    }, 2800)

    try {
      const result = await analyzeRadiografiaPremium({ responses: finalResponses, questions: PREGUNTAS, profileData })
      setAiAnalysis(result)
      setCachedAnalysis(result) // Cache for DEV reuse
      setAnalysisDone(true)
      localStorage.removeItem('radiografia_premium_progress')
      // Save to localStorage for later DEV access
      try { localStorage.setItem('radiografia_cached_analysis', JSON.stringify(result)) } catch {}
    } catch (err) {
      console.error('Analysis failed:', err)
      setAnalysisDone(true)
    }
  }, [])

  // ── When both analysis and animation done → show results ──
  useEffect(() => {
    if (analysisDone && completedTasks >= ANALYSIS_TASKS.length && aiAnalysis) {
      const timer = setTimeout(() => setStage('results'), 800)
      return () => clearTimeout(timer)
    }
  }, [analysisDone, completedTasks, aiAnalysis])

  // ── Scroll to top on stage change ──
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }, [stage])

  // ── PDF ──
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
      const addTitle = (t) => { checkPage(20); doc.setFontSize(13); doc.setTextColor(40, 40, 40); doc.text(t, m, y); y += 8 }
      const addP = (text) => {
        doc.setFontSize(9); doc.setTextColor(60, 60, 60)
        const lines = doc.splitTextToSize((text || '').replace(/\*\*/g, ''), maxW)
        for (const line of lines) { checkPage(6); doc.text(line, m, y); y += 4.5 }
        y += 3
      }

      doc.setFontSize(20); doc.setTextColor(40, 40, 40)
      doc.text('Radiografía de Pareja Premium', pw / 2, y, { align: 'center' }); y += 8
      doc.setFontSize(9); doc.setTextColor(120, 120, 120)
      doc.text('40 preguntas narrativas · 12 dimensiones psicológicas · Análisis profundo', pw / 2, y, { align: 'center' }); y += 12

      if (aiAnalysis.radiografia_inicial) { addTitle('Radiografía Inicial'); addP(aiAnalysis.radiografia_inicial) }
      if (aiAnalysis.diagnostico) {
        addTitle('Diagnóstico')
        addP(`Tipo de vínculo: ${aiAnalysis.diagnostico.tipo_vinculo}`)
        addP(`Estilo de apego: ${aiAnalysis.diagnostico.estilo_apego}`)
        addP(`Dinámica de conflicto: ${aiAnalysis.diagnostico.dinamica_conflicto}`)
      }
      if (aiAnalysis.dimensiones) {
        addTitle('Dimensiones Psicológicas')
        for (const [key, label] of Object.entries(DIMENSION_LABELS)) {
          checkPage(8); doc.setTextColor(60, 60, 60); doc.text(`${label}: ${aiAnalysis.dimensiones[key] ?? 0}%`, m, y); y += 6
        }
        y += 4
      }
      if (aiAnalysis.analisis_profundo) {
        addTitle('Análisis Profundo')
        addP(aiAnalysis.analisis_profundo.narrativa_dominante)
        addP(aiAnalysis.analisis_profundo.tensiones_estructurales)
        addP(aiAnalysis.analisis_profundo.evolucion_deseo)
        addP(aiAnalysis.analisis_profundo.dinamica_emocional)
      }
      if (aiAnalysis.lectura_psicoanalitica) {
        doc.addPage(); y = 20
        addTitle('Lectura Psicoanalítica')
        addP(aiAnalysis.lectura_psicoanalitica.proyecciones_inconscientes)
        addP(aiAnalysis.lectura_psicoanalitica.fantasma_relacional)
        addP(aiAnalysis.lectura_psicoanalitica.roles_simbolicos)
      }
      if (aiAnalysis.fortalezas) { addTitle('Fortalezas'); aiAnalysis.fortalezas.forEach(f => addP(`• ${f}`)) }
      if (aiAnalysis.riesgos) { addTitle('Señales de Riesgo'); aiAnalysis.riesgos.forEach(r => addP(`• ${r}`)) }
      if (aiAnalysis.sintesis_final) {
        addTitle('Síntesis Final')
        addP(aiAnalysis.sintesis_final.que_ocurre)
        addP(aiAnalysis.sintesis_final.posibilidades_evolucion)
        addP(aiAnalysis.sintesis_final.factores_fortalecimiento)
      }
      checkPage(35); y += 8
      doc.setFillColor(245, 245, 245); doc.roundedRect(m, y, pw - m * 2, 20, 3, 3, 'F')
      doc.setFontSize(10); doc.setTextColor(60, 60, 60)
      doc.text('¿Te gustaría profundizar? Agenda una sesión en luisvirrueta.com', pw / 2, y + 12, { align: 'center' })

      doc.save('radiografia-pareja-premium.pdf')
    } finally { setPdfGenerating(false) }
  }, [aiAnalysis])

  return (
    <div className="min-h-screen bg-zinc-950">
      <SEOHead title="Radiografía de Pareja Premium — Luis Virrueta" description="Análisis narrativo profundo de tu relación: 40 preguntas · 12 dimensiones psicológicas" />

      <AnimatePresence mode="wait">

        {/* ═══════════════════════════════════════════════════════
            STAGE: INSTRUCTIONS — Selección de voz + inicio
        ═══════════════════════════════════════════════════════ */}
        {stage === 'instructions' && (
          <motion.div key="instructions" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="min-h-screen flex items-center justify-center px-6 pt-6 pb-12">
            <div className="max-w-xl w-full text-center space-y-8">

              {/* ── Header + tagline ── */}
              <div>
                <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-violet-500/15 to-fuchsia-500/10 border border-violet-500/20 flex items-center justify-center mx-auto mb-4">
                  <Brain className="w-8 h-8 text-violet-400/60" strokeWidth={1.5} />
                </div>
                <h1 className="text-2xl lg:text-3xl font-light text-white mb-2">Radiografía de Pareja Premium</h1>
                <p className="text-transparent bg-clip-text bg-gradient-to-r from-violet-400 to-fuchsia-400 text-sm font-medium tracking-wide mb-4">Descubre tu forma de amar</p>
                <p className="text-white/50 text-sm font-light leading-relaxed max-w-md mx-auto">
                  Un análisis narrativo profundo de tu relación a través de <strong className="text-white/70">40 preguntas abiertas</strong> que exploran tu vínculo desde <strong className="text-white/70">12 dimensiones psicológicas</strong>.
                </p>
              </div>

              {/* ── Voice selector: 4 circular cards, single toggle ── */}
              <div className="space-y-4">
                <p className="text-white/60 text-sm font-light flex items-center justify-center gap-2">
                  <Headphones className="w-4 h-4 text-violet-400/50" /> Elige la voz que te guiará
                </p>
                <div className="grid grid-cols-2 gap-3 max-w-sm mx-auto">
                  {VOICE_LIST.map(v => {
                    const isSelected = selectedVoiceId === v.id
                    const isPreviewing = previewingVoiceId === v.id && audioPlaying
                    return (
                      <button key={v.id}
                        onClick={() => {
                          stopAudio()
                          setSelectedVoiceId(v.id)
                          if (!isSelected || !audioPlaying) {
                            playQuestion(`Hola, soy ${v.name} y te acompañaré durante toda tu radiografía. Escucharás cada pregunta en mi voz.`, v.id)
                          }
                        }}
                        className={`relative flex flex-col items-center gap-2 py-4 px-3 rounded-2xl border transition-all duration-300 ${isSelected
                          ? `${v.border} ${v.bg} shadow-lg`
                          : 'border-white/8 bg-white/[0.02] hover:border-white/15 hover:bg-white/[0.04]'}`}>
                        <div className={`relative w-14 h-14 rounded-full bg-gradient-to-br ${v.color} flex items-center justify-center text-white font-semibold text-lg shadow-lg ${isPreviewing ? `ring-4 ${v.ring} animate-pulse` : ''}`}>
                          {v.initial}
                          {isSelected && (
                            <div className="absolute -bottom-0.5 -right-0.5 w-5 h-5 rounded-full bg-zinc-900 border-2 border-green-500 flex items-center justify-center">
                              <Check className="w-3 h-3 text-green-400" />
                            </div>
                          )}
                        </div>
                        <div className="text-center">
                          <span className={`text-sm font-medium block ${isSelected ? v.text : 'text-white/60'}`}>{v.name}</span>
                          <span className="text-[11px] text-white/35 font-light">{v.desc}</span>
                        </div>
                        {isPreviewing && (
                          <div className="absolute top-2 right-2">
                            <Volume2 className={`w-3.5 h-3.5 ${v.text} animate-pulse`} />
                          </div>
                        )}
                      </button>
                    )
                  })}
                </div>
                <p className="text-white/30 text-[11px] font-light">Toca una voz para seleccionarla y escuchar una prueba</p>
              </div>

              {/* ── Section 1: Prepara tu espacio ── */}
              <div className="space-y-3 text-left p-6 rounded-2xl border border-violet-500/10 bg-gradient-to-br from-violet-500/[0.04] to-transparent">
                <p className="text-violet-300/80 text-sm font-medium flex items-center gap-2">
                  <Headphones className="w-4 h-4 text-violet-400/50" /> Prepara tu espacio
                </p>
                <div className="h-px bg-white/5" />
                <ul className="space-y-2.5 text-white/55 text-sm font-light">
                  <li className="flex items-start gap-3">
                    <div className="w-1.5 h-1.5 rounded-full bg-violet-400/40 mt-2 flex-shrink-0" />
                    <span><strong className="text-white/70">Sube el volumen</strong> de tu dispositivo al máximo. Usa <strong className="text-white/70">audífonos</strong> para mayor privacidad.</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <div className="w-1.5 h-1.5 rounded-full bg-violet-400/40 mt-2 flex-shrink-0" />
                    <span>Busca un <strong className="text-white/70">lugar privado y tranquilo</strong> donde puedas hablar con libertad.</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <div className="w-1.5 h-1.5 rounded-full bg-violet-400/40 mt-2 flex-shrink-0" />
                    <span>Reserva unos <strong className="text-white/70">20–25 minutos</strong> sin interrupciones.</span>
                  </li>
                </ul>

                {/* ── Audio & Mic test ── */}
                <div className="mt-4 pt-4 border-t border-white/5 space-y-3">
                  <p className="text-violet-300/60 text-xs font-medium uppercase tracking-wider">Comprobación rápida</p>
                  <div className="flex flex-wrap gap-3">
                    {/* Sound test */}
                    <button
                      onClick={() => {
                        playQuestion('¿Me escuchas bien? Si puedes oírme con claridad, estamos listos para comenzar.', undefined, () => setSoundTestOk(true), 'sound-test')
                      }}
                      className={`flex items-center gap-2 px-4 py-2.5 rounded-xl border transition-all text-xs font-light ${
                        soundTestOk === true ? 'border-emerald-500/30 bg-emerald-500/10 text-emerald-300' :
                        soundTestOk === false ? 'border-red-500/30 bg-red-500/10 text-red-300' :
                        'border-white/15 bg-white/[0.03] text-white/50 hover:border-white/25 hover:text-white/70'}`}>
                      <Volume2 className="w-4 h-4" />
                      {soundTestOk === true ? '✓ Se escucha bien' : soundTestOk === false ? 'No se escuchó' : 'Probar sonido'}
                    </button>
                    {/* Mic test */}
                    <button
                      onClick={async () => {
                        try {
                          const stream = await navigator.mediaDevices.getUserMedia({ audio: true })
                          setMicTestOk(true)
                          // Show level bars for 2 seconds then cleanup
                          const ctx = new (window.AudioContext || window.webkitAudioContext)()
                          const src = ctx.createMediaStreamSource(stream)
                          const analyser = ctx.createAnalyser()
                          analyser.fftSize = 256
                          src.connect(analyser)
                          setMicAnalyser(analyser)
                          setTimeout(() => {
                            stream.getTracks().forEach(t => t.stop())
                            ctx.close()
                            setMicAnalyser(null)
                          }, 3000)
                        } catch { setMicTestOk(false) }
                      }}
                      className={`flex items-center gap-2 px-4 py-2.5 rounded-xl border transition-all text-xs font-light ${
                        micTestOk === true ? 'border-emerald-500/30 bg-emerald-500/10 text-emerald-300' :
                        micTestOk === false ? 'border-red-500/30 bg-red-500/10 text-red-300' :
                        'border-white/15 bg-white/[0.03] text-white/50 hover:border-white/25 hover:text-white/70'}`}>
                      <Mic className="w-4 h-4" />
                      {micTestOk === true ? '✓ Micrófono listo' : micTestOk === false ? 'Sin acceso al mic' : 'Probar micrófono'}
                    </button>
                  </div>
                  {/* Mic level bars */}
                  {micAnalyser && <MicLevelBars analyser={micAnalyser} />}
                </div>
              </div>

              {/* ── Section 2: Cómo funciona ── */}
              <div className="space-y-3 text-left p-6 rounded-2xl border border-white/10 bg-white/[0.02]">
                <p className="text-white/70 text-sm font-medium flex items-center gap-2">
                  <Lightbulb className="w-4 h-4 text-amber-400/60" /> ¿Cómo funciona?
                </p>
                <div className="h-px bg-white/8" />
                <ul className="space-y-3 text-white/55 text-sm font-light">
                  <li className="flex items-start gap-3">
                    <div className="w-6 h-6 rounded-lg bg-violet-500/10 border border-violet-500/20 flex items-center justify-center flex-shrink-0 mt-0.5">
                      <Volume2 className="w-3 h-3 text-violet-400/70" />
                    </div>
                    <span>Escucharás cada pregunta en voz alta. Al <strong className="text-white/70">terminar la voz, tu micrófono se activa automáticamente</strong> para que respondas de inmediato.</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <div className="w-6 h-6 rounded-lg bg-violet-500/10 border border-violet-500/20 flex items-center justify-center flex-shrink-0 mt-0.5">
                      <SkipForward className="w-3 h-3 text-violet-400/70" />
                    </div>
                    <span>Si no quieres esperar, pulsa <strong className="text-white/70">"Saltar"</strong> — se detiene la voz y tu micrófono se activa al instante.</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <div className="w-6 h-6 rounded-lg bg-violet-500/10 border border-violet-500/20 flex items-center justify-center flex-shrink-0 mt-0.5">
                      <Mic className="w-3 h-3 text-violet-400/70" />
                    </div>
                    <span>Responde con tu voz diciendo lo primero que te venga a la mente. Verás tu <strong className="text-white/70">transcripción al terminar</strong>, y puedes <strong className="text-white/70">regrabar</strong> si quieres.</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <div className="w-6 h-6 rounded-lg bg-violet-500/10 border border-violet-500/20 flex items-center justify-center flex-shrink-0 mt-0.5">
                      <PenLine className="w-3 h-3 text-violet-400/70" />
                    </div>
                    <span>¿Prefieres escribir? Debajo de los botones aparece un enlace <strong className="text-white/70">"Prefiero escribir"</strong> que abre un campo de texto.</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <div className="w-6 h-6 rounded-lg bg-violet-500/10 border border-violet-500/20 flex items-center justify-center flex-shrink-0 mt-0.5">
                      <Lightbulb className="w-3 h-3 text-violet-400/70" />
                    </div>
                    <span>Debajo de cada pregunta hay <strong className="text-white/70">ideas de apoyo</strong>: si sientes que te faltó algo, úsalas para completar tu respuesta.</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <div className="w-6 h-6 rounded-lg bg-violet-500/10 border border-violet-500/20 flex items-center justify-center flex-shrink-0 mt-0.5">
                      <ArrowRight className="w-3 h-3 text-violet-400/70" />
                    </div>
                    <span>Son <strong className="text-white/70">40 preguntas abiertas</strong> que cubren 12 dimensiones. No hay respuestas correctas ni incorrectas.</span>
                  </li>
                </ul>
              </div>

              {/* ── Section 3: Para mejores resultados ── */}
              <div className="space-y-3 text-left p-6 rounded-2xl border border-amber-500/10 bg-amber-500/[0.02]">
                <p className="text-amber-300/70 text-sm font-medium flex items-center gap-2">
                  <Sparkles className="w-4 h-4 text-amber-400/50" /> Para mejores resultados
                </p>
                <div className="h-px bg-white/5" />
                <ul className="space-y-2.5 text-white/50 text-sm font-light">
                  <li className="flex items-start gap-3">
                    <div className="w-1.5 h-1.5 rounded-full bg-amber-400/40 mt-2 flex-shrink-0" />
                    <span><strong className="text-white/65">Contesta lo primero que te venga a la mente.</strong> No te preocupes si sientes que te equivocas — lo que surge primero es lo que más te define.</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <div className="w-1.5 h-1.5 rounded-full bg-amber-400/40 mt-2 flex-shrink-0" />
                    <span><strong className="text-white/65">No analices demasiado.</strong> Esto no es un examen. Háblale como si fuera un psicólogo que escucha sin juzgar.</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <div className="w-1.5 h-1.5 rounded-full bg-amber-400/40 mt-2 flex-shrink-0" />
                    <span>Usar el <strong className="text-white/65">micrófono</strong> es más rápido y natural, pero escribir funciona igual de bien.</span>
                  </li>
                </ul>
              </div>

              <motion.button
                onClick={() => {
                  setStage('profile')
                  playQuestion('Te damos la bienvenida. Antes de iniciar, necesito conocer un par de datos tuyos muy rápidos. Escríbelos en los campos que aparecen a continuación y podremos comenzar.', undefined, null, 'welcome')
                }}
                whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}
                className="w-full py-4 rounded-xl bg-gradient-to-r from-violet-600 to-fuchsia-600 text-white font-light text-base hover:from-violet-500 hover:to-fuchsia-500 transition-all shadow-lg shadow-violet-600/20">
                Comenzar radiografía <ArrowRight className="inline w-4 h-4 ml-2" />
              </motion.button>
            </div>
          </motion.div>
        )}

        {/* ═══════════════════════════════════════════════════════
            STAGE: PROFILE — Pregunta 0 (datos personales)
        ═══════════════════════════════════════════════════════ */}
        {stage === 'profile' && (
          <motion.div key="profile" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="min-h-screen flex items-center justify-center px-6 pt-6 pb-12">
            <div className="max-w-lg w-full space-y-8">
              <div className="text-center">
                <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-violet-500/15 to-fuchsia-500/10 border border-violet-500/20 flex items-center justify-center mx-auto mb-4">
                  <Users className="w-7 h-7 text-violet-400/60" strokeWidth={1.5} />
                </div>
                <h2 className="text-xl lg:text-2xl font-light text-white mb-2">Antes de empezar</h2>
                <p className="text-white/50 text-sm font-light max-w-sm mx-auto">
                  Escribe tus datos separados por comas o completa cada campo. Estos datos aparecerán en tu reporte personalizado.
                </p>
              </div>

              <div className="space-y-4">
                {/* Tus datos */}
                <p className="text-violet-300/50 text-[10px] font-medium uppercase tracking-wider">Tus datos</p>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="text-white/50 text-xs font-medium uppercase tracking-wider mb-1.5 block">Tu nombre</label>
                    <input type="text" value={profileData.nombre}
                      autoFocus
                      onChange={(e) => setProfileData(p => ({ ...p, nombre: e.target.value }))}
                      onKeyDown={(e) => { if (e.key === 'Enter') document.getElementById('profile-edad')?.focus() }}
                      placeholder="Ej: Luis"
                      className="w-full px-4 py-3 rounded-xl border border-white/15 bg-white/[0.03] text-white/80 text-sm font-light placeholder:text-white/25 focus:border-violet-500/30 focus:outline-none transition-colors" />
                  </div>
                  <div>
                    <label className="text-white/50 text-xs font-medium uppercase tracking-wider mb-1.5 block">Tu edad</label>
                    <input type="text" id="profile-edad" value={profileData.edad}
                      onChange={(e) => setProfileData(p => ({ ...p, edad: e.target.value }))}
                      onKeyDown={(e) => { if (e.key === 'Enter') document.getElementById('profile-nombre-pareja')?.focus() }}
                      placeholder="Ej: 28"
                      className="w-full px-4 py-3 rounded-xl border border-white/15 bg-white/[0.03] text-white/80 text-sm font-light placeholder:text-white/25 focus:border-violet-500/30 focus:outline-none transition-colors" />
                  </div>
                </div>

                {/* Datos de tu pareja */}
                <p className="text-fuchsia-300/50 text-[10px] font-medium uppercase tracking-wider mt-2">Datos de tu pareja</p>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="text-white/50 text-xs font-medium uppercase tracking-wider mb-1.5 block">Nombre de tu pareja</label>
                    <input type="text" id="profile-nombre-pareja" value={profileData.nombrePareja}
                      onChange={(e) => setProfileData(p => ({ ...p, nombrePareja: e.target.value }))}
                      onKeyDown={(e) => { if (e.key === 'Enter') document.getElementById('profile-edad-pareja')?.focus() }}
                      placeholder="Ej: Susana"
                      className="w-full px-4 py-3 rounded-xl border border-white/15 bg-white/[0.03] text-white/80 text-sm font-light placeholder:text-white/25 focus:border-fuchsia-500/30 focus:outline-none transition-colors" />
                  </div>
                  <div>
                    <label className="text-white/50 text-xs font-medium uppercase tracking-wider mb-1.5 block">Edad de tu pareja</label>
                    <input type="text" id="profile-edad-pareja" value={profileData.edadPareja}
                      onChange={(e) => setProfileData(p => ({ ...p, edadPareja: e.target.value }))}
                      onKeyDown={(e) => { if (e.key === 'Enter' && profileData.nombre.trim() && profileData.edad.trim() && profileData.nombrePareja.trim() && profileData.edadPareja.trim()) setStage('email') }}
                      placeholder="Ej: 30"
                      className="w-full px-4 py-3 rounded-xl border border-white/15 bg-white/[0.03] text-white/80 text-sm font-light placeholder:text-white/25 focus:border-fuchsia-500/30 focus:outline-none transition-colors" />
                  </div>
                </div>
              </div>

              <motion.button
                onClick={() => { if (profileData.nombre.trim() && profileData.edad.trim() && profileData.nombrePareja.trim() && profileData.edadPareja.trim()) setStage('email') }}
                whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}
                disabled={!profileData.nombre.trim() || !profileData.edad.trim() || !profileData.nombrePareja.trim() || !profileData.edadPareja.trim()}
                className={`w-full py-4 rounded-xl text-white font-light text-base transition-all shadow-lg ${profileData.nombre.trim() && profileData.edad.trim() && profileData.nombrePareja.trim() && profileData.edadPareja.trim()
                  ? 'bg-gradient-to-r from-violet-600 to-fuchsia-600 hover:from-violet-500 hover:to-fuchsia-500 shadow-violet-600/20'
                  : 'bg-white/10 text-white/30 cursor-not-allowed shadow-none'}`}>
                Continuar <ArrowRight className="inline w-4 h-4 ml-2" />
              </motion.button>
            </div>
          </motion.div>
        )}

        {/* ═══════════════════════════════════════════════════════
            STAGE: EMAIL — Correos (con opción de saltar)
        ═══════════════════════════════════════════════════════ */}
        {stage === 'email' && (
          <motion.div key="email" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="min-h-screen flex items-center justify-center px-6 pt-6 pb-12">
            <div className="max-w-lg w-full space-y-8">
              <div className="text-center">
                <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-violet-500/15 to-fuchsia-500/10 border border-violet-500/20 flex items-center justify-center mx-auto mb-4">
                  <Send className="w-7 h-7 text-violet-400/60" strokeWidth={1.5} />
                </div>
                <h2 className="text-xl lg:text-2xl font-light text-white mb-2">Invitación por correo</h2>
                <p className="text-white/50 text-sm font-light max-w-sm mx-auto">
                  Al terminar, recibirás tu reporte completo por correo. Si deseas, también podemos enviar una invitación a tu pareja.
                </p>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="text-white/50 text-xs font-medium uppercase tracking-wider mb-1.5 block">Tu correo electrónico</label>
                  <input type="email" value={emailData.emailUsuario}
                    autoFocus
                    onChange={(e) => setEmailData(p => ({ ...p, emailUsuario: e.target.value }))}
                    placeholder="tu@correo.com"
                    className="w-full px-4 py-3 rounded-xl border border-white/15 bg-white/[0.03] text-white/80 text-sm font-light placeholder:text-white/25 focus:border-violet-500/30 focus:outline-none transition-colors" />
                </div>
                <div>
                  <label className="text-white/50 text-xs font-medium uppercase tracking-wider mb-1.5 block">Correo de tu pareja <span className="text-white/25">(opcional)</span></label>
                  <input type="email" value={emailData.emailPareja}
                    onChange={(e) => setEmailData(p => ({ ...p, emailPareja: e.target.value }))}
                    placeholder="pareja@correo.com"
                    className="w-full px-4 py-3 rounded-xl border border-white/15 bg-white/[0.03] text-white/80 text-sm font-light placeholder:text-white/25 focus:border-fuchsia-500/30 focus:outline-none transition-colors" />
                </div>
              </div>

              <div className="space-y-3">
                <motion.button
                  onClick={() => {
                    // Play personalized greeting then start questionnaire
                    const nombre = profileData.nombre.trim().split(' ')[0]
                    playQuestion(`Hola ${nombre}, vamos a comenzar tu radiografía. Escucha cada pregunta con atención y responde con lo primero que te venga a la mente.`)
                    setStage('questionnaire')
                  }}
                  whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}
                  className="w-full py-4 rounded-xl bg-gradient-to-r from-violet-600 to-fuchsia-600 text-white font-light text-base hover:from-violet-500 hover:to-fuchsia-500 transition-all shadow-lg shadow-violet-600/20">
                  Continuar <ArrowRight className="inline w-4 h-4 ml-2" />
                </motion.button>
                <button
                  onClick={() => {
                    const nombre = profileData.nombre.trim().split(' ')[0]
                    playQuestion(`Hola ${nombre}, vamos a comenzar tu radiografía. Escucha cada pregunta con atención y responde con lo primero que te venga a la mente.`)
                    setStage('questionnaire')
                  }}
                  className="w-full py-3 text-center text-white/35 text-sm font-light hover:text-white/55 transition-colors underline underline-offset-4 decoration-white/15">
                  Saltar y comenzar directamente
                </button>
              </div>
            </div>
          </motion.div>
        )}

        {/* ═══════════════════════════════════════════════════════
            STAGE: QUESTIONNAIRE
        ═══════════════════════════════════════════════════════ */}
        {stage === 'questionnaire' && question && (
          <motion.div key="questionnaire" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="min-h-screen pt-6 lg:pt-10 pb-20 px-6">
            <div className="max-w-2xl mx-auto">

              {/* Progress bar */}
              <div className="mb-8">
                <div className="text-center mb-2">
                  <span className="text-violet-300/70 text-xs font-medium uppercase tracking-wider block">{question.block}</span>
                  <span className="text-white/40 text-xs font-light">{currentQ + 1} de {totalQ}</span>
                </div>
                <div className="h-1.5 bg-white/10 rounded-full overflow-hidden">
                  <motion.div animate={{ width: `${progress}%` }} transition={{ duration: 0.4 }}
                    className="h-full bg-gradient-to-r from-violet-500 to-fuchsia-500 rounded-full" />
                </div>
              </div>

              {/* Main question — centered */}
              <div className="text-center mb-6">
                <div className="flex items-center justify-center gap-2 mb-3">
                  <span className="text-white/25 text-xs font-light">Pregunta {currentQ + 1}</span>
                  <button
                    onClick={() => {
                      if (recording) stopRecording()
                      playQuestion(question.mainQuestion, undefined, () => {
                        const sr = window.SpeechRecognition || window.webkitSpeechRecognition
                        if (sr && !typingMode) startRecording()
                      })
                    }}
                    className="h-7 px-3 rounded-lg border border-white/15 bg-white/[0.04] text-white/50 hover:text-white/70 hover:border-white/25 transition-all text-[10px] font-light inline-flex items-center gap-1.5"
                    title="Repetir audio">
                    <Volume2 className="w-3 h-3" /> Repetir
                  </button>
                  {audioPlaying && (
                    <button
                      onClick={() => {
                        stopAudio()
                        // Auto-start mic on "Saltar"
                        setTimeout(() => {
                          const sr = window.SpeechRecognition || window.webkitSpeechRecognition
                          if (sr && !typingMode) startRecording()
                        }, 300)
                      }}
                      className="h-7 px-3 rounded-lg border border-amber-500/20 bg-amber-500/[0.06] text-amber-300/70 hover:text-amber-300 transition-all text-[10px] font-light inline-flex items-center gap-1.5"
                      title="Saltar audio">
                      <SkipForward className="w-3 h-3" /> Saltar
                    </button>
                  )}
                </div>

              </div>

              {/* ── Card verde: Responde libremente + pregunta principal ── */}
              <div id="spotlight-question" className="mb-6">
                <div className="px-4 py-2.5 rounded-t-2xl bg-gradient-to-r from-emerald-500/15 via-teal-500/10 to-emerald-500/15 border border-b-0 border-emerald-500/15">
                  <p className="text-emerald-300/80 text-xs font-semibold uppercase tracking-widest text-center flex items-center justify-center gap-2">
                    <Heart className="w-3.5 h-3.5 text-emerald-400/60" />
                    Responde libremente — di lo primero que te venga a la mente
                  </p>
                </div>
                <div className="px-6 py-6 rounded-b-2xl border border-t-0 border-emerald-500/10 bg-emerald-500/[0.02]">
                  <p className="text-white/90 text-lg lg:text-xl font-light leading-relaxed text-center max-w-xl mx-auto">{question.mainQuestion}</p>
                </div>
              </div>

              {/* Examples — as completion prompts */}
              <div id="spotlight-examples" className="mb-8">
                <div className="px-4 py-2.5 rounded-t-2xl bg-gradient-to-r from-violet-500/15 via-fuchsia-500/10 to-violet-500/15 border border-b-0 border-violet-500/15">
                  <p className="text-violet-300/80 text-xs font-semibold uppercase tracking-widest text-center flex items-center justify-center gap-2">
                    <Lightbulb className="w-3.5 h-3.5 text-violet-400/60" />
                    Si te faltó algo, completa con estas ideas
                  </p>
                </div>
                <div className="px-5 py-4 rounded-b-2xl border border-t-0 border-white/10 bg-white/[0.02] space-y-2">
                  {question.examples.map((ex, i) => (
                    <div key={i} className="flex items-center justify-center gap-2 text-white/55 text-sm font-light">
                      <span className="text-violet-400/50">✦</span>
                      <span>{ex}</span>
                    </div>
                  ))}
                  <div className="h-px bg-white/5 mt-3 mb-2" />
                  <p className="text-white/40 text-xs font-light italic flex items-center justify-center gap-1.5">
                    <Sparkles className="w-3 h-3 text-violet-400/30" />
                    Puedes añadir cualquier otro detalle que sientas importante
                  </p>
                </div>
              </div>

              {/* ── Response area ── */}

              {/* While recording: show animated MicLevelBars indicator */}
              {recording && !typingMode && (
                <div className="mb-6 text-center">
                  <div className="inline-flex flex-col items-center gap-3 px-6 py-4 rounded-2xl border border-red-500/20 bg-red-500/[0.04]">
                    <MicLevelBars analyser={recordingAnalyser} />
                    <span className="text-red-300/70 text-sm font-light">Escuchando… habla con libertad</span>
                  </div>
                </div>
              )}

              {/* After stopping: show "Respuesta guardada" badge (user proceeds with Next button) */}
              {!recording && currentText.trim() && !typingMode && (
                <div className="mb-6 text-center">
                  <div className="inline-flex items-center gap-2 px-5 py-3 rounded-xl border border-emerald-500/20 bg-emerald-500/[0.05]">
                    <CheckCircle className="w-4 h-4 text-emerald-400/70" />
                    <span className="text-emerald-300/80 text-sm font-light">Respuesta guardada — toca Siguiente para avanzar</span>
                  </div>
                </div>
              )}

              {/* Typing mode: show previous recording read-only + textarea */}
              {typingMode && !recording && (
                <div className="mb-6 space-y-3">
                  {transcript.trim() && (
                    <div className="p-3 rounded-xl border border-white/8 bg-white/[0.02]">
                      <p className="text-white/30 text-[10px] font-medium uppercase tracking-wider mb-1">Lo que grabaste antes</p>
                      <p className="text-white/40 text-xs font-light leading-relaxed">{transcript}</p>
                    </div>
                  )}
                  <textarea
                    value={textInput}
                    onChange={(e) => setTextInput(e.target.value)}
                    placeholder="Escribe o complementa tu respuesta aquí…"
                    rows={4}
                    className="w-full p-4 rounded-xl border border-white/15 bg-white/[0.03] text-white/80 text-sm font-light placeholder:text-white/30 focus:border-violet-500/30 focus:outline-none resize-none transition-colors leading-relaxed"
                  />
                </div>
              )}

              {/* If no content and not recording and not typing: waiting state */}
              {!currentText.trim() && !recording && !typingMode && (
                <p className="text-center text-white/30 text-sm font-light mb-4 italic">
                  {audioPlaying ? 'Escucha la pregunta…' : 'Tu micrófono se activará en un momento'}
                </p>
              )}

              {/* ── Action buttons: Back | Mic | Next ── */}
              <div id="spotlight-actions" className="flex items-end justify-center gap-4 lg:gap-5 mb-4">
                {/* Back */}
                <motion.button onClick={goBack} disabled={currentQ === 0}
                  whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}
                  className="flex flex-col items-center gap-1">
                  <div className={`w-11 h-11 lg:w-12 lg:h-12 rounded-full flex items-center justify-center transition-all border-2 ${currentQ === 0 ? 'opacity-20 pointer-events-none' : ''} border-white/15 bg-white/[0.04] text-white/40 hover:border-white/25 hover:text-white/60`}>
                    <ArrowLeft className="w-4 h-4 lg:w-5 lg:h-5" />
                  </div>
                  <span className="text-[10px] font-light text-white/30">Anterior</span>
                </motion.button>

                {/* Mic */}
                <motion.button
                  onClick={() => { if (typingMode) setTypingMode(false); recording ? stopRecording() : startRecording() }}
                  whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}
                  className="flex flex-col items-center gap-1">
                  <div className={`w-16 h-16 lg:w-14 lg:h-14 rounded-full flex items-center justify-center transition-all ${recording
                    ? 'bg-red-500/20 border-2 border-red-500/50 text-red-400 animate-pulse'
                    : 'bg-gradient-to-br from-violet-500/20 to-fuchsia-500/15 border-2 border-violet-500/40 text-violet-400 shadow-lg shadow-violet-500/25 ring-4 ring-violet-400/10'}`}>
                    {recording ? <MicOff className="w-6 h-6 lg:w-5 lg:h-5" /> : <Mic className="w-6 h-6 lg:w-5 lg:h-5" />}
                  </div>
                  <span className={`text-[10px] font-light ${recording ? 'text-red-400/70' : 'text-violet-300/60'}`}>
                    {recording ? 'Detener' : 'Micrófono'}
                  </span>
                </motion.button>

                {/* Regrabar — always visible when recording or when there's content */}
                {(recording || currentText.trim()) && !typingMode && (
                  <motion.button
                    onClick={() => { stopAudio(); if (recording) stopRecording(); setTranscript(''); setTextInput(''); setTimeout(() => startRecording(), 200) }}
                    whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}
                    className="flex flex-col items-center gap-1">
                    <div className="w-11 h-11 lg:w-12 lg:h-12 rounded-full flex items-center justify-center transition-all border-2 border-amber-500/30 bg-amber-500/[0.08] text-amber-400/70 hover:border-amber-500/50 hover:text-amber-300">
                      <Repeat className="w-4 h-4 lg:w-5 lg:h-5" />
                    </div>
                    <span className="text-[10px] font-light text-amber-300/50">Regrabar</span>
                  </motion.button>
                )}

                {/* Next */}
                <motion.button onClick={saveAndNext}
                  whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}
                  className="flex flex-col items-center gap-1">
                  <div className={`w-11 h-11 lg:w-12 lg:h-12 rounded-full flex items-center justify-center transition-all border-2 ${currentText.trim()
                    ? 'bg-gradient-to-br from-violet-600 to-fuchsia-600 border-violet-500/50 text-white shadow-lg shadow-violet-500/25'
                    : 'border-white/15 bg-white/[0.04] text-white/40 hover:border-white/25'}`}>
                    {currentQ < totalQ - 1 ? <ArrowRight className="w-4 h-4 lg:w-5 lg:h-5" /> : <Check className="w-4 h-4 lg:w-5 lg:h-5" />}
                  </div>
                  <span className={`text-[10px] font-light ${currentText.trim() ? 'text-violet-300/60' : 'text-white/30'}`}>
                    {currentQ < totalQ - 1 ? 'Siguiente' : 'Finalizar'}
                  </span>
                </motion.button>
              </div>

              {/* "Prefiero escribir" link — below buttons (only when no saved response showing) */}
              {!typingMode && !recording && !currentText.trim() && (
                <p className="text-center mb-6">
                  <button
                    onClick={() => { setTypingMode(true); setTextInput(transcript || textInput) }}
                    className="text-white/30 text-xs font-light hover:text-white/55 transition-colors underline underline-offset-2 decoration-white/15 hover:decoration-white/30">
                    Prefiero escribir mi respuesta
                  </button>
                </p>
              )}
              {typingMode && (
                <p className="text-center mb-6">
                  <button
                    onClick={() => setTypingMode(false)}
                    className="text-white/30 text-xs font-light hover:text-white/55 transition-colors underline underline-offset-2 decoration-white/15 hover:decoration-white/30">
                    Volver al micrófono
                  </button>
                </p>
              )}

              {/* DEV: Quick actions */}
              {import.meta.env.DEV && (
                <div className="mt-8 pt-6 border-t border-white/5 flex flex-wrap gap-4 justify-center">
                  <button onClick={() => {
                    const demoText = DEMO_RESPONSES[question?.id] || ''
                    setTranscript(demoText)
                    setTextInput(demoText)
                    setResponses(prev => ({ ...prev, [question.id]: demoText }))
                  }}
                    className="flex flex-col items-center gap-1" title="Rellenar esta respuesta">
                    <div className="w-11 h-11 rounded-full border border-amber-500/25 bg-amber-500/10 flex items-center justify-center text-amber-300/70 hover:bg-amber-500/20 transition-colors">
                      <span className="text-base">🧪</span>
                    </div>
                    <span className="text-[9px] text-white/30">Rellenar</span>
                  </button>
                  <button onClick={() => { setResponses({ ...DEMO_RESPONSES }); setTimeout(() => handleRunAnalysis(DEMO_RESPONSES), 200) }}
                    className="flex flex-col items-center gap-1" title="Rellenar todo y lanzar análisis">
                    <div className="w-11 h-11 rounded-full border border-emerald-500/25 bg-emerald-500/10 flex items-center justify-center text-emerald-300/70 hover:bg-emerald-500/20 transition-colors">
                      <span className="text-base">🚀</span>
                    </div>
                    <span className="text-[9px] text-white/30">Lanzar</span>
                  </button>
                  <button onClick={() => {
                    if (CACHED_PREVIEW_ANALYSIS) {
                      setAiAnalysis(CACHED_PREVIEW_ANALYSIS)
                      setCachedAnalysis(CACHED_PREVIEW_ANALYSIS)
                      setStage('results')
                      return
                    }
                    const saved = localStorage.getItem('radiografia_cached_analysis')
                    if (saved) {
                      try {
                        const parsed = JSON.parse(saved)
                        setAiAnalysis(parsed)
                        setCachedAnalysis(parsed)
                        setStage('results')
                        return
                      } catch {}
                    }
                    setResponses({ ...DEMO_RESPONSES })
                    setTimeout(() => handleRunAnalysis(DEMO_RESPONSES), 200)
                  }}
                    className="flex flex-col items-center gap-1" title="Vista previa">
                    <div className="w-11 h-11 rounded-full border border-fuchsia-500/25 bg-fuchsia-500/10 flex items-center justify-center text-fuchsia-300/70 hover:bg-fuchsia-500/20 transition-colors">
                      <span className="text-base">⚡</span>
                    </div>
                    <span className="text-[9px] text-white/30">Preview</span>
                  </button>
                  {localStorage.getItem('radiografia_cached_analysis') && (
                    <button onClick={() => {
                      localStorage.removeItem('radiografia_cached_analysis')
                      setCachedAnalysis(null)
                      setResponses({ ...DEMO_RESPONSES })
                      setTimeout(() => handleRunAnalysis(DEMO_RESPONSES), 200)
                    }}
                      className="flex flex-col items-center gap-1" title="Borrar caché y relanzar">
                      <div className="w-11 h-11 rounded-full border border-red-500/25 bg-red-500/10 flex items-center justify-center text-red-300/70 hover:bg-red-500/20 transition-colors">
                        <span className="text-base">🔄</span>
                      </div>
                      <span className="text-[9px] text-white/30">Caché</span>
                    </button>
                  )}
                  <button onClick={() => setStage('instructions')}
                    className="flex flex-col items-center gap-1" title="Ir a Instrucciones">
                    <div className="w-11 h-11 rounded-full border border-violet-500/25 bg-violet-500/10 flex items-center justify-center text-violet-300/70 hover:bg-violet-500/20 transition-colors">
                      <span className="text-base">📋</span>
                    </div>
                    <span className="text-[9px] text-white/30">Instruc.</span>
                  </button>
                  <button onClick={() => navigate('/tienda/diagnostico-relacional')}
                    className="flex flex-col items-center gap-1" title="Ir a Landing">
                    <div className="w-11 h-11 rounded-full border border-cyan-500/25 bg-cyan-500/10 flex items-center justify-center text-cyan-300/70 hover:bg-cyan-500/20 transition-colors">
                      <span className="text-base">🏠</span>
                    </div>
                    <span className="text-[9px] text-white/30">Landing</span>
                  </button>
                </div>
              )}

            </div>
          </motion.div>
        )}

        {/* ═══════════════════════════════════════════════════════
            STAGE: ANALYZING
        ═══════════════════════════════════════════════════════ */}
        {stage === 'analyzing' && (
          <motion.div key="analyzing" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="min-h-screen flex items-center justify-center px-6">
            <div className="max-w-md w-full space-y-6">
              <div className="text-center mb-6">
                <Brain className="w-12 h-12 text-violet-400/40 mx-auto mb-4 animate-pulse" />
                <h2 className="text-xl font-light text-white mb-2">Analizando tu narrativa</h2>
                <p className="text-white/35 text-sm font-light">40 respuestas × 12 dimensiones × 11 corrientes psicológicas</p>
              </div>
              <div className="space-y-1.5">
                {ANALYSIS_TASKS.map((task, i, arr) => {
                  const done = i < completedTasks
                  const active = i === completedTasks
                  const showGroup = i === 0 || arr[i - 1].group !== task.group
                  return (
                    <div key={task.id}>
                      {showGroup && (
                        <p className={`text-[10px] uppercase tracking-widest font-medium mt-3 mb-1.5 px-3 ${done || active ? 'text-violet-400/50' : 'text-white/15'}`}>{task.group}</p>
                      )}
                      <motion.div animate={{ opacity: done || active ? 1 : 0.3 }}
                        className={`flex items-center gap-3 p-2.5 rounded-xl ${done ? 'bg-emerald-500/[0.04] border border-emerald-500/10' : active ? 'bg-violet-500/[0.04] border border-violet-500/15' : 'border border-white/5'}`}>
                        {done ? (
                          <Check className="w-4 h-4 text-emerald-400/70 shrink-0" strokeWidth={2.5} />
                        ) : active ? (
                          <Loader2 className="w-4 h-4 text-violet-400/60 animate-spin shrink-0" />
                        ) : (
                          <div className="w-4 h-4 rounded-full bg-white/10 shrink-0" />
                        )}
                        <span className={`text-sm font-light ${done ? 'text-white/60' : active ? 'text-white/80' : 'text-white/25'}`}>{task.text}</span>
                      </motion.div>
                    </div>
                  )
                })}
              </div>
              <div className="text-center pt-2">
                <p className="text-white/20 text-xs font-light">{completedTasks} de {ANALYSIS_TASKS.length} procesos completados</p>
              </div>
            </div>
          </motion.div>
        )}

        {/* ═══════════════════════════════════════════════════════
            STAGE: RESULTS
        ═══════════════════════════════════════════════════════ */}
        {stage === 'results' && aiAnalysis && (
          <motion.div key="results" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="min-h-screen pt-6 lg:pt-10 pb-20 px-6">
            <div className="max-w-4xl mx-auto space-y-12">

              {/* Header — Ultra Premium with profile data */}
              <div className="relative text-center py-8 mb-4">
                <div className="absolute inset-0 bg-gradient-to-b from-violet-500/[0.06] via-fuchsia-500/[0.03] to-transparent rounded-3xl" />
                <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,rgba(139,92,246,0.08),transparent_70%)]" />
                <div className="relative">
                  <motion.div initial={{ scale: 0.8, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} transition={{ duration: 0.6 }}
                    className="w-16 h-16 mx-auto mb-5 rounded-2xl bg-gradient-to-br from-violet-500/20 to-fuchsia-500/20 border border-violet-500/20 flex items-center justify-center shadow-lg shadow-violet-500/10">
                    <Brain className="w-8 h-8 text-violet-400/70" />
                  </motion.div>
                  <p className="text-transparent bg-clip-text bg-gradient-to-r from-violet-400 via-fuchsia-400 to-violet-400 text-xs font-bold uppercase tracking-[0.3em] mb-3">Reporte</p>
                  <h1 className="text-3xl lg:text-4xl font-light text-white mb-2">Tu Radiografía de Pareja</h1>
                  <p className="text-transparent bg-clip-text bg-gradient-to-r from-violet-400 to-fuchsia-400 text-sm font-medium tracking-wide mb-4">Tu perfil de amor según 11 teorías</p>

                  {/* Profile info bar */}
                  {profileData.nombre && (
                    <div className="flex flex-wrap items-center justify-center gap-3 mb-4">
                      <span className="px-3 py-1.5 rounded-full border border-white/10 bg-white/[0.04] text-white/60 text-xs font-medium">{profileData.nombre}{profileData.edad ? `, ${profileData.edad} años` : ''}</span>
                      {profileData.nombrePareja && (
                        <span className="px-3 py-1.5 rounded-full border border-fuchsia-500/15 bg-fuchsia-500/[0.04] text-fuchsia-300/60 text-xs font-medium">{profileData.nombrePareja}{profileData.edadPareja ? `, ${profileData.edadPareja} años` : ''}</span>
                      )}
                      <span className="px-3 py-1.5 rounded-full border border-white/10 bg-white/[0.04] text-white/40 text-xs font-light">{profileData.fecha}</span>
                    </div>
                  )}

                  <p className="text-white/40 text-sm font-light mb-6 max-w-lg mx-auto">Estas son las principales corrientes de la psicología del amor aplicadas a tu historia. Cada sección revela una dimensión distinta de tu forma de amar.</p>
                  <div className="flex flex-wrap items-center justify-center gap-3">
                    <span className="px-3 py-1.5 rounded-full border border-violet-500/15 bg-violet-500/[0.06] text-violet-300/60 text-xs font-medium">11 corrientes psicológicas</span>
                    <span className="px-3 py-1.5 rounded-full border border-fuchsia-500/15 bg-fuchsia-500/[0.06] text-fuchsia-300/60 text-xs font-medium">40 preguntas analizadas</span>
                    <span className="px-3 py-1.5 rounded-full border border-cyan-500/15 bg-cyan-500/[0.06] text-cyan-300/60 text-xs font-medium">12 dimensiones</span>
                  </div>
                </div>
              </div>

              {/* ═══ SECCIÓN 0: AUTOANÁLISIS — TU FORMA DE AMAR ═══ */}
              {aiAnalysis.autoanalisis_usuario && (
                <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
                  className="p-6 lg:p-8 rounded-2xl border border-fuchsia-500/15 bg-gradient-to-br from-fuchsia-500/[0.04] via-violet-500/[0.03] to-transparent relative overflow-hidden">
                  <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-fuchsia-500/40 via-violet-500/30 to-fuchsia-500/40" />
                  <div className="text-center mb-8">
                    <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-gradient-to-br from-fuchsia-500/20 to-violet-500/15 border border-fuchsia-500/25 mb-4">
                      <Heart className="w-7 h-7 text-fuchsia-400/80" />
                    </div>
                    <p className="text-fuchsia-300/40 text-[10px] font-bold uppercase tracking-[0.3em] mb-2">Reporte personalizado</p>
                    <h2 className="text-2xl lg:text-3xl font-light text-transparent bg-clip-text bg-gradient-to-r from-fuchsia-300 to-violet-300 tracking-wide">Tu forma de amar</h2>
                    <p className="text-white/35 text-sm font-light mt-2">El análisis más profundo de quién eres cuando amas</p>
                  </div>

                  {/* Radial mind-map with visualization toggle */}
                  {aiAnalysis.autoanalisis_usuario && (() => {
                    const dataAuto = aiAnalysis.autoanalisis_usuario
                    // Option A: Current radial layout
                    const RadialView = () => <AutoanalisisRadial data={dataAuto} />
                    // Option B: Force-directed network graph
                    const ForceView = () => {
                      const present = AUTOANALISIS_SECTIONS.filter(s => dataAuto[s.key])
                      const n = present.length
                      if (n === 0) return null
                      // Create connections between related nodes
                      const connections = [
                        [0, 1], [1, 2], [2, 3], [3, 4], [4, 5], [5, 6], [6, 7], [7, 8], [8, 9],
                        [0, 9], [1, 8], [2, 7], [4, 6], [1, 3], [5, 8]
                      ].filter(([a, b]) => a < n && b < n)
                      const cx = 220, cy = 220
                      // Organic layout with slight randomization
                      const nodesF = present.map((s, i) => {
                        const textLen = (dataAuto[s.key] || '').length
                        const nodeR = Math.max(22, Math.min(38, textLen / 15))
                        const angle = (i / n) * Math.PI * 2 - Math.PI / 2
                        const baseR = 120 + (i % 2) * 30
                        return { ...s, x: cx + baseR * Math.cos(angle), y: cy + baseR * Math.sin(angle), nodeR }
                      })
                      return (
                        <div className="flex justify-center mb-6">
                          <svg viewBox="0 0 440 440" className="w-full max-w-md" style={{ filter: 'drop-shadow(0 0 25px rgba(139,92,246,0.06))' }}>
                            {/* Connection lines */}
                            {connections.map(([a, b], i) => (
                              <line key={`c-${i}`} x1={nodesF[a].x} y1={nodesF[a].y} x2={nodesF[b].x} y2={nodesF[b].y}
                                stroke={nodesF[a].color} strokeOpacity={0.08} strokeWidth={1} />
                            ))}
                            {/* Center glow */}
                            <circle cx={cx} cy={cy} r={45} fill="rgba(139,92,246,0.06)" stroke="rgba(139,92,246,0.15)" strokeWidth={1} />
                            <text x={cx} y={cy - 10} textAnchor="middle" fill="rgba(255,255,255,0.6)" fontSize="11" fontWeight="500">Tu forma</text>
                            <text x={cx} y={cy + 5} textAnchor="middle" fill="rgba(255,255,255,0.6)" fontSize="11" fontWeight="500">de amar</text>
                            <text x={cx} y={cy + 20} textAnchor="middle" fill="rgba(255,255,255,0.25)" fontSize="8">Red de vínculos</text>
                            {/* Center connections */}
                            {nodesF.map((node, i) => (
                              <line key={`cl-${i}`} x1={cx} y1={cy} x2={node.x} y2={node.y}
                                stroke={node.color} strokeOpacity={0.12} strokeWidth={1.5} strokeDasharray="4 3" />
                            ))}
                            {/* Nodes */}
                            {nodesF.map((node, i) => (
                              <g key={`n-${i}`}>
                                <circle cx={node.x} cy={node.y} r={node.nodeR} fill={`${node.color}15`} stroke={`${node.color}40`} strokeWidth={2} />
                                <circle cx={node.x} cy={node.y} r={node.nodeR - 4} fill={`${node.color}08`} />
                                <text x={node.x} y={node.y - 2} textAnchor="middle" dominantBaseline="central" fontSize="16">{node.icon}</text>
                                <text
                                  x={node.x + (node.x > cx ? node.nodeR + 8 : -(node.nodeR + 8))}
                                  y={node.y + 1}
                                  textAnchor={node.x > cx ? 'start' : node.x < cx - 5 ? 'end' : 'middle'}
                                  dominantBaseline="central"
                                  fill="rgba(255,255,255,0.55)" fontSize="10" fontWeight="400"
                                >{node.label}</text>
                              </g>
                            ))}
                          </svg>
                        </div>
                      )
                    }
                    return (
                      <>
                        <div className="flex items-center justify-center gap-2 mb-4">
                          <button
                            className={`px-4 py-2 rounded-xl text-xs font-medium transition-all ${chartViewMode !== 'mindmap-force' ? 'bg-fuchsia-500/20 border border-fuchsia-500/30 text-fuchsia-300/80' : 'border border-white/8 bg-white/[0.02] text-white/35 hover:text-white/55'}`}
                            onClick={() => setChartViewMode('mindmap-radial')}>
                            ◎ Mapa radial
                          </button>
                          <button
                            className={`px-4 py-2 rounded-xl text-xs font-medium transition-all ${chartViewMode === 'mindmap-force' ? 'bg-violet-500/20 border border-violet-500/30 text-violet-300/80' : 'border border-white/8 bg-white/[0.02] text-white/35 hover:text-white/55'}`}
                            onClick={() => setChartViewMode('mindmap-force')}>
                            ◉ Red de vínculos
                          </button>
                        </div>
                        {chartViewMode === 'mindmap-force' ? <ForceView /> : <RadialView />}
                      </>
                    )
                  })()}

                  <div className="space-y-8">
                    {/* 1. Apertura y rapport */}
                    {aiAnalysis.autoanalisis_usuario.apertura_rapport && (
                      <div className="flex items-start gap-4 mb-2">
                        <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-fuchsia-500/20 to-violet-500/15 border border-fuchsia-500/20 flex items-center justify-center flex-shrink-0 mt-1">
                          <Heart className="w-5 h-5 text-fuchsia-400/70" />
                        </div>
                        <div className="space-y-3">
                          {aiAnalysis.autoanalisis_usuario.apertura_rapport.split('\n\n').map((p, i) => (
                            <p key={i} className="text-white/80 text-[15px] font-light leading-[1.8]">{stripBold(p)}</p>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* 2. Forma de amar */}
                    {aiAnalysis.autoanalisis_usuario.forma_de_amar && (
                      <div>
                        <p className="text-fuchsia-300/70 text-xs font-semibold uppercase tracking-wider mb-3 flex items-center gap-2">
                          <Flame className="w-4 h-4" /> Cómo amas y cómo esperas ser amado
                        </p>
                        <div className="space-y-3 pl-4 border-l-2 border-fuchsia-500/25">
                          {aiAnalysis.autoanalisis_usuario.forma_de_amar.split('\n\n').map((p, i) => (
                            <p key={i} className="text-white/75 text-[15px] font-light leading-[1.8]">{stripBold(p)}</p>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* 3. Lo que busca en el otro */}
                    {aiAnalysis.autoanalisis_usuario.lo_que_busca_en_el_otro && (
                      <div>
                        <p className="text-violet-300/70 text-xs font-semibold uppercase tracking-wider mb-3 flex items-center gap-2">
                          <Eye className="w-4 h-4" /> Lo que buscas en el otro
                        </p>
                        <div className="space-y-3 pl-4 border-l-2 border-violet-500/25">
                          {aiAnalysis.autoanalisis_usuario.lo_que_busca_en_el_otro.split('\n\n').map((p, i) => (
                            <p key={i} className="text-white/75 text-[15px] font-light leading-[1.8]">{stripBold(p)}</p>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* 4. Lo que reclama afuera */}
                    {aiAnalysis.autoanalisis_usuario.lo_que_reclama_afuera && (
                      <div>
                        <p className="text-rose-300/70 text-xs font-semibold uppercase tracking-wider mb-3 flex items-center gap-2">
                          <Compass className="w-4 h-4" /> Lo que reclamas afuera y te pertenece adentro
                        </p>
                        <div className="space-y-3 pl-4 border-l-2 border-rose-500/25">
                          {aiAnalysis.autoanalisis_usuario.lo_que_reclama_afuera.split('\n\n').map((p, i) => (
                            <p key={i} className="text-white/75 text-[15px] font-light leading-[1.8]">{stripBold(p)}</p>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* 5. Fantasma relacional */}
                    {aiAnalysis.autoanalisis_usuario.fantasma_relacional && (
                      <div>
                        <p className="text-purple-300/70 text-xs font-semibold uppercase tracking-wider mb-3 flex items-center gap-2">
                          <Anchor className="w-4 h-4" /> Tu fantasma relacional
                        </p>
                        <div className="space-y-3 pl-4 border-l-2 border-purple-500/25">
                          {aiAnalysis.autoanalisis_usuario.fantasma_relacional.split('\n\n').map((p, i) => (
                            <p key={i} className="text-white/75 text-[15px] font-light leading-[1.8]">{stripBold(p)}</p>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* 6. Yo ideal vs yo real */}
                    {aiAnalysis.autoanalisis_usuario.yo_ideal && (
                      <div>
                        <p className="text-cyan-300/70 text-xs font-semibold uppercase tracking-wider mb-3 flex items-center gap-2">
                          <Target className="w-4 h-4" /> Quién crees ser vs quién eres cuando amas
                        </p>
                        <div className="space-y-3 pl-4 border-l-2 border-cyan-500/25">
                          {aiAnalysis.autoanalisis_usuario.yo_ideal.split('\n\n').map((p, i) => (
                            <p key={i} className="text-white/75 text-[15px] font-light leading-[1.8]">{stripBold(p)}</p>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* 7. Mecanismos de defensa */}
                    {aiAnalysis.autoanalisis_usuario.mecanismos_defensa && (
                      <div>
                        <p className="text-amber-300/70 text-xs font-semibold uppercase tracking-wider mb-3 flex items-center gap-2">
                          <Shield className="w-4 h-4" /> Tus mecanismos de defensa
                        </p>
                        <div className="space-y-3 pl-4 border-l-2 border-amber-500/25">
                          {aiAnalysis.autoanalisis_usuario.mecanismos_defensa.split('\n\n').map((p, i) => (
                            <p key={i} className="text-white/75 text-[15px] font-light leading-[1.8]">{stripBold(p)}</p>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* 8. Tipo de pareja que repite */}
                    {aiAnalysis.autoanalisis_usuario.tipo_pareja_que_repite && (
                      <div>
                        <p className="text-orange-300/70 text-xs font-semibold uppercase tracking-wider mb-3 flex items-center gap-2">
                          <Repeat className="w-4 h-4" /> El tipo de pareja que repites
                        </p>
                        <div className="space-y-3 pl-4 border-l-2 border-orange-500/25">
                          {aiAnalysis.autoanalisis_usuario.tipo_pareja_que_repite.split('\n\n').map((p, i) => (
                            <p key={i} className="text-white/75 text-[15px] font-light leading-[1.8]">{stripBold(p)}</p>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* 9. Núcleo del patrón */}
                    {aiAnalysis.autoanalisis_usuario.nucleo_del_patron && (
                      <div className="mt-2 p-6 rounded-xl border border-fuchsia-500/20 bg-fuchsia-500/[0.06]">
                        <p className="text-fuchsia-300/80 text-xs font-semibold uppercase tracking-wider mb-3 flex items-center gap-2">
                          <Zap className="w-4 h-4" /> El núcleo de tu patrón
                        </p>
                        <div className="space-y-3">
                          {aiAnalysis.autoanalisis_usuario.nucleo_del_patron.split('\n\n').map((p, i) => (
                            <p key={i} className="text-white/80 text-[15px] font-light leading-[1.8]">{stripBold(p)}</p>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* 10. Cierre transformador */}
                    {aiAnalysis.autoanalisis_usuario.cierre_transformador && (
                      <div className="mt-2 p-6 rounded-xl border border-emerald-500/20 bg-emerald-500/[0.05]">
                        <p className="text-emerald-300/80 text-xs font-semibold uppercase tracking-wider mb-3 flex items-center gap-2">
                          <Sparkles className="w-4 h-4" /> Tu camino transformador
                        </p>
                        <div className="space-y-3">
                          {aiAnalysis.autoanalisis_usuario.cierre_transformador.split('\n\n').map((p, i) => (
                            <p key={i} className="text-white/75 text-[15px] font-light leading-[1.8]">{stripBold(p)}</p>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                </motion.div>
              )}

              {/* ═══ RAPPORT — BIENVENIDA EMPÁTICA ═══ */}
              <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
                className="p-6 lg:p-8 rounded-2xl border border-violet-500/15 bg-gradient-to-br from-violet-500/[0.04] via-fuchsia-500/[0.02] to-transparent relative overflow-hidden">
                <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-violet-500/40 via-fuchsia-500/30 to-violet-500/40" />
                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-violet-500/20 to-fuchsia-500/15 border border-violet-500/20 flex items-center justify-center flex-shrink-0 mt-1">
                    <Heart className="w-5 h-5 text-violet-400/70" />
                  </div>
                  <div className="space-y-3">
                    <h2 className="text-white/80 text-base font-medium">Gracias por compartir tu historia</h2>
                    <p className="text-white/50 text-sm font-light leading-relaxed">Lo que compartiste aquí es valioso y único. Este análisis está diseñado para ayudarte a comprender cómo amas, qué patrones se repiten en tu relación, y qué posibilidades de crecimiento existen.</p>
                    {aiAnalysis.radiografia_inicial && (
                      <div className="pt-3 border-t border-white/5">
                        <p className="text-white/35 text-xs font-medium uppercase tracking-wider mb-2">Lo que percibimos de tu relación</p>
                        <p className="text-white/50 text-sm font-light leading-relaxed italic">{renderBold(aiAnalysis.radiografia_inicial.split('\n\n')[0])}</p>
                      </div>
                    )}
                  </div>
                </div>
              </motion.div>

              {/* ═══ 1. ANÁLISIS POR ENFOQUE PSICOLÓGICO (11 corrientes) ═══ */}
              {aiAnalysis.lecturas_por_enfoque && (() => {
                const AUTHOR_CONFIG = [
                  { key: 'gottman', icon: Shield, border: 'border-blue-500/10', bg: 'from-blue-500/[0.02]', line: 'from-blue-500/20', iconBg: 'bg-blue-500/10 border-blue-500/15', iconColor: 'text-blue-400/60', barFill: '#3b82f6', radar: '#60a5fa' },
                  { key: 'sue_johnson', icon: Heart, border: 'border-rose-500/10', bg: 'from-rose-500/[0.02]', line: 'from-rose-500/20', iconBg: 'bg-rose-500/10 border-rose-500/15', iconColor: 'text-rose-400/60', barFill: '#f43f5e', radar: '#fb7185' },
                  { key: 'perel', icon: Flame, border: 'border-pink-500/10', bg: 'from-pink-500/[0.02]', line: 'from-pink-500/20', iconBg: 'bg-pink-500/10 border-pink-500/15', iconColor: 'text-pink-400/60', barFill: '#ec4899', radar: '#f472b6' },
                  { key: 'levine', icon: Anchor, border: 'border-amber-500/10', bg: 'from-amber-500/[0.02]', line: 'from-amber-500/20', iconBg: 'bg-amber-500/10 border-amber-500/15', iconColor: 'text-amber-400/60', barFill: '#f59e0b', radar: '#fbbf24' },
                  { key: 'hendrix', icon: Repeat, border: 'border-orange-500/10', bg: 'from-orange-500/[0.02]', line: 'from-orange-500/20', iconBg: 'bg-orange-500/10 border-orange-500/15', iconColor: 'text-orange-400/60', barFill: '#f97316', radar: '#fb923c' },
                  { key: 'tatkin', icon: Activity, border: 'border-teal-500/10', bg: 'from-teal-500/[0.02]', line: 'from-teal-500/20', iconBg: 'bg-teal-500/10 border-teal-500/15', iconColor: 'text-teal-400/60', barFill: '#14b8a6', radar: '#2dd4bf' },
                  { key: 'chapman', icon: Gift, border: 'border-red-500/10', bg: 'from-red-500/[0.02]', line: 'from-red-500/20', iconBg: 'bg-red-500/10 border-red-500/15', iconColor: 'text-red-400/60', barFill: '#ef4444', radar: '#f87171' },
                  { key: 'sternberg', icon: Star, border: 'border-violet-500/10', bg: 'from-violet-500/[0.02]', line: 'from-violet-500/20', iconBg: 'bg-violet-500/10 border-violet-500/15', iconColor: 'text-violet-400/60', barFill: '#8b5cf6', radar: '#a78bfa' },
                  { key: 'schnarch', icon: Compass, border: 'border-emerald-500/10', bg: 'from-emerald-500/[0.02]', line: 'from-emerald-500/20', iconBg: 'bg-emerald-500/10 border-emerald-500/15', iconColor: 'text-emerald-400/60', barFill: '#10b981', radar: '#34d399' },
                  { key: 'real', icon: Scale, border: 'border-cyan-500/10', bg: 'from-cyan-500/[0.02]', line: 'from-cyan-500/20', iconBg: 'bg-cyan-500/10 border-cyan-500/15', iconColor: 'text-cyan-400/60', barFill: '#06b6d4', radar: '#22d3ee' },
                  { key: 'freud_lacan', icon: Brain, border: 'border-purple-500/10', bg: 'from-purple-500/[0.02]', line: 'from-purple-500/20', iconBg: 'bg-purple-500/10 border-purple-500/15', iconColor: 'text-purple-400/60', barFill: '#a855f7', radar: '#c084fc' }
                ]
                const radarData = AUTHOR_CONFIG
                  .filter(a => aiAnalysis.lecturas_por_enfoque[a.key])
                  .map(a => ({
                    subject: (aiAnalysis.lecturas_por_enfoque[a.key].titulo || a.key).split('(')[0].split('–')[0].trim().split(' ').slice(0, 2).join(' '),
                    score: aiAnalysis.lecturas_por_enfoque[a.key].puntuacion ?? 50,
                    enfoque: aiAnalysis.lecturas_por_enfoque[a.key].enfoque || '',
                    fill: a.barFill,
                    fullMark: 100
                  }))
                return (
                <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
                  {/* ── Premium section divider ── */}
                  <div className="relative text-center py-10 mb-8">
                    <div className="absolute inset-0 bg-gradient-to-b from-violet-500/[0.04] via-fuchsia-500/[0.02] to-transparent rounded-3xl" />
                    <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-violet-500/30 to-transparent" />
                    <div className="relative">
                      <div className="inline-flex items-center justify-center w-12 h-12 rounded-2xl bg-gradient-to-br from-violet-500/20 to-fuchsia-500/15 border border-violet-500/25 mb-4">
                        <Brain className="w-6 h-6 text-violet-400/70" />
                      </div>
                      <p className="text-violet-300/40 text-[10px] font-bold uppercase tracking-[0.3em] mb-2">Sección Premium</p>
                      <h2 className="text-xl lg:text-2xl font-light text-transparent bg-clip-text bg-gradient-to-r from-violet-300 to-fuchsia-300 tracking-wide">Análisis por Enfoque Psicológico</h2>
                      <p className="text-white/35 text-sm font-light mt-2 max-w-md mx-auto">11 perspectivas teóricas que iluminan cada dimensión de tu vínculo</p>
                    </div>
                    <div className="absolute inset-x-0 bottom-0 h-px bg-gradient-to-r from-transparent via-violet-500/20 to-transparent" />
                  </div>

                  {/* ── 3 Selectable chart views — professional ── */}
                  {radarData.length > 0 && (
                    <div className="mb-10 p-6 lg:p-8 rounded-2xl border border-violet-500/10 bg-gradient-to-br from-violet-500/[0.03] via-fuchsia-500/[0.02] to-transparent relative overflow-hidden">
                      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(139,92,246,0.06),transparent_70%)]" />
                      <div className="relative">
                        <p className="text-white/50 text-xs font-medium uppercase tracking-wider mb-2 text-center">Mapa Integral de Corrientes</p>
                        <p className="text-white/30 text-[11px] font-light text-center mb-5">Elige la visualización que prefieras para explorar tu perfil</p>

                        {/* Chart selector tabs */}
                        <div className="flex items-center justify-center gap-2 mb-6">
                          {[
                            { id: 'radar', label: '◎ Radar' },
                            { id: 'bubbles', label: '◉ Burbujas' },
                            { id: 'bars', label: '▮ Barras' }
                          ].map(tab => (
                            <button key={tab.id} onClick={() => setChartViewMode(tab.id)}
                              className={`px-5 py-2.5 rounded-xl text-xs font-medium transition-all duration-300 ${chartViewMode === tab.id
                                ? 'bg-gradient-to-r from-violet-500/25 to-fuchsia-500/20 border border-violet-500/40 text-violet-200/90 shadow-lg shadow-violet-500/15'
                                : 'border border-white/8 bg-white/[0.02] text-white/35 hover:text-white/55 hover:border-white/15'}`}>
                              {tab.label}
                            </button>
                          ))}
                        </div>

                        {/* Chart: Radar view — with gradient fill + glow dots */}
                        {chartViewMode === 'radar' && (
                          <ResponsiveContainer width="100%" height={420}>
                            <RechartRadar cx="50%" cy="50%" outerRadius="78%" data={radarData}>
                              <defs>
                                <radialGradient id="radarAreaGrad" cx="50%" cy="50%" r="50%" fx="50%" fy="50%">
                                  <stop offset="0%" stopColor="rgba(139,92,246,0.35)" />
                                  <stop offset="100%" stopColor="rgba(139,92,246,0.05)" />
                                </radialGradient>
                                <filter id="glow">
                                  <feGaussianBlur stdDeviation="3" result="coloredBlur"/>
                                  <feMerge><feMergeNode in="coloredBlur"/><feMergeNode in="SourceGraphic"/></feMerge>
                                </filter>
                              </defs>
                              <PolarGrid stroke="rgba(255,255,255,0.06)" radialLines={false} />
                              <PolarAngleAxis dataKey="subject" tick={{ fill: 'rgba(255,255,255,0.55)', fontSize: 11, fontWeight: 400 }} />
                              <PolarRadiusAxis angle={90} domain={[0, 100]} tick={{ fill: 'rgba(255,255,255,0.12)', fontSize: 9 }} axisLine={false} />
                              <Radar name="Puntuación" dataKey="score" stroke="rgba(139,92,246,0.9)" fill="url(#radarAreaGrad)" strokeWidth={2.5}
                                dot={{ r: 5, fill: '#a78bfa', fillOpacity: 1, stroke: '#8b5cf6', strokeWidth: 2, filter: 'url(#glow)' }}
                                activeDot={{ r: 7, fill: '#c084fc', stroke: '#8b5cf6', strokeWidth: 2 }} />
                              <Tooltip
                                contentStyle={{ background: 'rgba(10,10,18,0.96)', border: '1px solid rgba(139,92,246,0.3)', borderRadius: '14px', fontSize: '13px', color: 'rgba(255,255,255,0.8)', boxShadow: '0 8px 32px rgba(139,92,246,0.15)' }}
                                formatter={(val) => [`${val}%`, 'Puntuación']}
                              />
                            </RechartRadar>
                          </ResponsiveContainer>
                        )}

                        {/* Chart: Bubbles view — D3-style packed circles */}
                        {chartViewMode === 'bubbles' && (
                          <div className="flex justify-center py-4">
                            <svg viewBox="0 0 420 420" className="w-full max-w-md" style={{ filter: 'drop-shadow(0 0 20px rgba(139,92,246,0.1))' }}>
                              {(() => {
                                const sorted = [...radarData].sort((a, b) => b.score - a.score)
                                const cx = 210, cy = 210
                                const positions = []
                                sorted.forEach((d, i) => {
                                  const radius = 18 + (d.score / 100) * 32
                                  let x, y, attempts = 0, placed = false
                                  if (i === 0) { x = cx; y = cy; placed = true }
                                  while (!placed && attempts < 200) {
                                    const angle = (i / sorted.length) * Math.PI * 2 + attempts * 0.3
                                    const dist = 50 + attempts * 3.5
                                    x = cx + dist * Math.cos(angle)
                                    y = cy + dist * Math.sin(angle)
                                    const overlap = positions.some(p => {
                                      const dx = x - p.x, dy = y - p.y
                                      return Math.sqrt(dx * dx + dy * dy) < radius + p.radius + 6
                                    })
                                    if (!overlap && x > radius + 5 && x < 420 - radius - 5 && y > radius + 5 && y < 420 - radius - 5) placed = true
                                    else attempts++
                                  }
                                  if (!placed) { x = cx + (i % 2 ? 1 : -1) * (40 + i * 20); y = cy + (i % 3 - 1) * 40 }
                                  positions.push({ ...d, x, y, radius })
                                })
                                return positions.map((d, i) => (
                                  <g key={i}>
                                    <circle cx={d.x} cy={d.y} r={d.radius}
                                      fill={`${d.fill}20`} stroke={`${d.fill}50`} strokeWidth={1.5} />
                                    <text x={d.x} y={d.y - 6} textAnchor="middle" fill="rgba(255,255,255,0.7)" fontSize={d.radius > 30 ? '10' : '9'} fontWeight="400">
                                      {d.subject}
                                    </text>
                                    <text x={d.x} y={d.y + 8} textAnchor="middle" fill={d.fill} fontSize="11" fontWeight="600">
                                      {d.score}%
                                    </text>
                                  </g>
                                ))
                              })()}
                            </svg>
                          </div>
                        )}

                        {/* Chart: Bars view — horizontal with individual gradients + score labels */}
                        {chartViewMode === 'bars' && (
                          <div>
                            <ResponsiveContainer width="100%" height={radarData.length * 44 + 20}>
                              <BarChart data={radarData} margin={{ top: 5, right: 40, left: 0, bottom: 5 }} layout="vertical" barCategoryGap="20%">
                                <defs>
                                  {AUTHOR_CONFIG.map((a, i) => (
                                    <linearGradient key={a.key} id={`barGrad${i}`} x1="0" y1="0" x2="1" y2="0">
                                      <stop offset="0%" stopColor={a.barFill} stopOpacity={0.9} />
                                      <stop offset="100%" stopColor={a.barFill} stopOpacity={0.4} />
                                    </linearGradient>
                                  ))}
                                </defs>
                                <XAxis type="number" domain={[0, 100]} tick={{ fill: 'rgba(255,255,255,0.15)', fontSize: 10 }} axisLine={false} tickLine={false} />
                                <YAxis dataKey="subject" type="category"
                                  tick={{ fill: 'rgba(255,255,255,0.55)', fontSize: 11, fontWeight: 400 }}
                                  axisLine={false} tickLine={false} width={115} />
                                <Tooltip
                                  content={({ active, payload }) => {
                                    if (!active || !payload?.[0]) return null
                                    const d = payload[0].payload
                                    return (
                                      <div style={{ background: 'rgba(10,10,18,0.96)', border: '1px solid rgba(255,255,255,0.12)', borderRadius: '14px', padding: '10px 14px', boxShadow: '0 8px 32px rgba(0,0,0,0.3)' }}>
                                        <p style={{ color: 'rgba(255,255,255,0.85)', fontSize: '13px', fontWeight: 500, margin: 0 }}>{d.subject} — {d.score}%</p>
                                        {d.enfoque && <p style={{ color: 'rgba(255,255,255,0.45)', fontSize: '11px', margin: '4px 0 0', maxWidth: '220px' }}>{d.enfoque}</p>}
                                      </div>
                                    )
                                  }}
                                  cursor={{ fill: 'rgba(255,255,255,0.02)', radius: 8 }}
                                />
                                <Bar dataKey="score" radius={[0, 10, 10, 0]} maxBarSize={22} label={{ position: 'right', fill: 'rgba(255,255,255,0.5)', fontSize: 11, fontWeight: 500, formatter: (v) => `${v}%` }}>
                                  {radarData.map((entry, i) => (
                                    <Cell key={i} fill={`url(#barGrad${i})`} />
                                  ))}
                                </Bar>
                              </BarChart>
                            </ResponsiveContainer>
                          </div>
                        )}
                      </div>
                    </div>
                  )}

                  {/* ── Individual author cards — full-width, structured ── */}
                  <div className="grid grid-cols-1 gap-6">
                    {AUTHOR_CONFIG.map(({ key, icon: Icon, border, bg, line, iconBg, iconColor, barFill }) => {
                      const data = aiAnalysis.lecturas_por_enfoque[key]
                      if (!data) return null
                      const score = data.puntuacion ?? 50
                      const barColor = score >= 60 ? 'bg-emerald-500' : score >= 40 ? 'bg-amber-500' : 'bg-red-500'
                      const isSternberg = key === 'sternberg'
                      const isFreudLacan = key === 'freud_lacan'
                      const isChapman = key === 'chapman'
                      const isLevine = key === 'levine'
                      const isGottman = key === 'gottman'
                      const displayTitle = isFreudLacan ? 'Psicoanálisis' : data.titulo
                      const displaySubtitle = isFreudLacan ? 'Fantasma relacional, mecanismos de defensa y patrones inconscientes' : data.enfoque

                      /* Bold-initial renderer: first sentence bold, rest normal */
                      const renderBoldInitial = (text) => {
                        if (!text) return null
                        const firstDot = text.indexOf('.')
                        if (firstDot > 0 && firstDot < 120) {
                          return <><strong className="text-white/65 font-semibold">{text.slice(0, firstDot + 1)}</strong>{' '}<span>{text.slice(firstDot + 1).trim()}</span></>
                        }
                        const words = text.split(' ')
                        if (words.length > 3) {
                          return <><strong className="text-white/65 font-semibold">{words.slice(0, 3).join(' ')}:</strong>{' '}<span>{words.slice(3).join(' ')}</span></>
                        }
                        return renderBold(text)
                      }

                      return (
                        <motion.div key={key}
                          initial={{ opacity: 0, y: 15 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
                          className={`p-6 md:p-8 rounded-2xl border ${border} bg-gradient-to-br ${bg} to-transparent relative overflow-hidden`}>
                          <div className={`absolute top-0 left-0 right-0 h-[1px] bg-gradient-to-r ${line} to-transparent`} />

                          {/* Header row: icon + title + score badge */}
                          <div className="flex items-start justify-between mb-5">
                            <div className="flex items-center gap-3">
                              <div className={`w-10 h-10 rounded-xl ${iconBg} border flex items-center justify-center`}>
                                <Icon className={`w-5 h-5 ${iconColor}`} strokeWidth={1.5} />
                              </div>
                              <div>
                                <h3 className="text-white/80 text-base font-semibold">{displayTitle}</h3>
                                <p className="text-white/35 text-xs font-light mt-0.5 max-w-md">{displaySubtitle}</p>
                              </div>
                            </div>
                            {!isSternberg && (
                              <div className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg border ${border} bg-white/[0.02]`}>
                                <div className={`w-2 h-2 rounded-full ${barColor}`} style={{ opacity: 0.8 }} />
                                <span className="text-white/65 text-sm font-semibold tabular-nums">{score}%</span>
                              </div>
                            )}
                          </div>

                          {/* Score bar — Sternberg triple, others single */}
                          {isSternberg ? (
                            <div className="grid grid-cols-3 gap-3 mb-5">
                              {[
                                { label: 'Intimidad', val: data.puntuacion_intimidad ?? 50 },
                                { label: 'Pasión', val: data.puntuacion_pasion ?? 50 },
                                { label: 'Compromiso', val: data.puntuacion_compromiso ?? 50 }
                              ].map(({ label, val }) => (
                                <div key={label} className="text-center">
                                  <p className="text-white/50 text-[11px] font-light mb-1.5">{label}</p>
                                  <div className="h-2 bg-white/[0.06] rounded-full overflow-hidden">
                                    <div className={`h-full rounded-full ${val >= 60 ? 'bg-emerald-500' : val >= 40 ? 'bg-amber-500' : 'bg-red-500'}`}
                                      style={{ width: `${val}%`, opacity: 0.7 }} />
                                  </div>
                                  <p className="text-white/60 text-xs font-semibold mt-1">{val}%</p>
                                </div>
                              ))}
                            </div>
                          ) : (
                            <div className="flex items-center gap-3 mb-5">
                              <div className="flex-1 h-2 bg-white/[0.06] rounded-full overflow-hidden">
                                <div className={`h-full rounded-full ${barColor}`} style={{ width: `${score}%`, opacity: 0.7 }} />
                              </div>
                            </div>
                          )}

                          {/* Specialized visualizations */}
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-5">
                            {/* Left column: special vis if any */}
                            {isGottman && data.indicadores && data.indicadores.length >= 4 && (
                              <div className="p-4 rounded-xl border border-blue-500/10 bg-blue-500/[0.03] space-y-2.5">
                                <p className="text-blue-300/60 text-[10px] font-medium uppercase tracking-wider">Los 4 jinetes</p>
                                {['Crítica', 'Desprecio', 'Actitud defensiva', 'Evasión'].map((jinete, idx) => (
                                  <div key={jinete} className="flex items-center gap-2">
                                    <span className="text-white/40 text-[11px] font-light w-28 text-right">{jinete}</span>
                                    <div className="flex-1 h-2 bg-white/[0.06] rounded-full overflow-hidden">
                                      <div className="h-full rounded-full bg-blue-500" style={{ width: `${Math.min(100, 20 + idx * 15 + (score > 50 ? 10 : 30))}%`, opacity: 0.5 }} />
                                    </div>
                                  </div>
                                ))}
                              </div>
                            )}

                            {isSternberg && (
                              <div className="flex justify-center items-center p-4 rounded-xl border border-violet-500/10 bg-violet-500/[0.03]">
                                <svg viewBox="0 0 200 180" className="w-44 h-40">
                                  <polygon points="100,15 15,165 185,165" fill="none" stroke="rgba(139,92,246,0.15)" strokeWidth="1.5" />
                                  <polygon
                                    points={`100,${15 + (100 - (data.puntuacion_intimidad ?? 50)) * 0.75} ${15 + (100 - (data.puntuacion_pasion ?? 50)) * 0.85},165 ${185 - (100 - (data.puntuacion_compromiso ?? 50)) * 0.85},165`}
                                    fill="rgba(139,92,246,0.12)" stroke="rgba(139,92,246,0.5)" strokeWidth="1.5" />
                                  <text x="100" y="10" textAnchor="middle" fill="rgba(255,255,255,0.4)" fontSize="9" fontWeight="300">Intimidad</text>
                                  <text x="5" y="178" textAnchor="start" fill="rgba(255,255,255,0.4)" fontSize="9" fontWeight="300">Pasión</text>
                                  <text x="195" y="178" textAnchor="end" fill="rgba(255,255,255,0.4)" fontSize="9" fontWeight="300">Compromiso</text>
                                </svg>
                              </div>
                            )}

                            {isChapman && (data.lenguaje_usuario || data.lenguaje_pareja) && (
                              <>
                                {data.lenguaje_usuario && (
                                  <div className="px-4 py-3 rounded-xl border border-red-500/10 bg-red-500/[0.04]">
                                    <p className="text-red-300/60 text-[10px] font-medium uppercase tracking-wider mb-1">Tu lenguaje de amor</p>
                                    <p className="text-white/65 text-sm font-light">{data.lenguaje_usuario}</p>
                                  </div>
                                )}
                                {data.lenguaje_pareja && (
                                  <div className="px-4 py-3 rounded-xl border border-red-500/10 bg-red-500/[0.04]">
                                    <p className="text-red-300/60 text-[10px] font-medium uppercase tracking-wider mb-1">Su lenguaje de amor</p>
                                    <p className="text-white/65 text-sm font-light">{data.lenguaje_pareja}</p>
                                  </div>
                                )}
                              </>
                            )}

                            {isLevine && data.estilo_apego && (
                              <div className="px-4 py-3 rounded-xl border border-amber-500/10 bg-amber-500/[0.04]">
                                <p className="text-amber-300/60 text-[10px] font-medium uppercase tracking-wider mb-1">Estilo de apego detectado</p>
                                <p className="text-white/65 text-sm font-medium">{data.estilo_apego}</p>
                              </div>
                            )}
                          </div>

                          {/* Indicadores — as badges */}
                          {data.indicadores && data.indicadores.length > 0 && (
                            <div className="mb-5">
                              <p className="text-white/40 text-[10px] font-medium uppercase tracking-wider mb-3">Puntos clave</p>
                              <div className="flex flex-wrap gap-2">
                                {data.indicadores.map((ind, i) => (
                                  <span key={i} className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-[13px] font-light border" style={{
                                    borderColor: `${barFill}25`,
                                    backgroundColor: `${barFill}08`,
                                    color: 'rgba(255,255,255,0.7)'
                                  }}>
                                    <span className="text-[6px]" style={{ color: barFill, opacity: 0.7 }}>●</span>
                                    {stripBold(ind)}
                                  </span>
                                ))}
                              </div>
                            </div>
                          )}

                          {/* Interpretación — clean readable text */}
                          <div className="pt-4 border-t border-white/5">
                            <p className="text-white/40 text-[10px] font-medium uppercase tracking-wider mb-3">Interpretación personalizada</p>
                            {isFreudLacan ? (
                              <div className="space-y-4">
                                {data.interpretacion_freud && (
                                  <div className="pl-4 border-l-2 border-purple-500/20">
                                    <p className="text-purple-300/50 text-[10px] font-medium uppercase tracking-wider mb-1.5">Lectura freudiana</p>
                                    <p className="text-white/70 text-[15px] font-light leading-[1.8]">{stripBold(data.interpretacion_freud)}</p>
                                  </div>
                                )}
                                {data.interpretacion_lacan && (
                                  <div className="pl-4 border-l-2 border-indigo-500/20">
                                    <p className="text-indigo-300/50 text-[10px] font-medium uppercase tracking-wider mb-1.5">Lectura lacaniana</p>
                                    <p className="text-white/70 text-[15px] font-light leading-[1.8]">{stripBold(data.interpretacion_lacan)}</p>
                                  </div>
                                )}
                                {data.interpretacion && !data.interpretacion_freud && (
                                  <div className="space-y-3">
                                    {data.interpretacion.split('\n\n').map((p, i) => (
                                      <p key={i} className="text-white/70 text-[15px] font-light leading-[1.8]">{stripBold(p)}</p>
                                    ))}
                                  </div>
                                )}
                              </div>
                            ) : (
                              <div className="space-y-3">
                                {(data.interpretacion || '').split('\n\n').map((p, i) => (
                                  <p key={i} className="text-white/70 text-[15px] font-light leading-[1.8]">{stripBold(p)}</p>
                                ))}
                              </div>
                            )}
                          </div>
                        </motion.div>
                      )
                    })}
                  </div>
                </motion.div>
                )
              })()}

              {/* ═══ 2. MAPA PSICOLÓGICO DEL VÍNCULO ═══ */}
              {aiAnalysis.dimensiones && (
                <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
                  <div className="relative text-center py-8 mb-6">
                    <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-white/15 to-transparent" />
                    <div className="inline-flex items-center justify-center w-10 h-10 rounded-xl bg-gradient-to-br from-violet-500/15 to-cyan-500/10 border border-violet-500/20 mb-3">
                      <Activity className="w-5 h-5 text-violet-400/60" />
                    </div>
                    <p className="text-white/30 text-[10px] font-bold uppercase tracking-[0.3em] mb-1">12 Dimensiones</p>
                    <h2 className="text-lg font-light text-transparent bg-clip-text bg-gradient-to-r from-violet-300 to-cyan-300">Mapa Psicológico del Vínculo</h2>
                  </div>
                  <div className="p-6 rounded-2xl border border-white/8 bg-white/[0.02]">
                    <RadarChart dimensiones={aiAnalysis.dimensiones} />

                    {/* ── Dimension breakdown (fused from Diagnóstico Estructural) ── */}
                    {aiAnalysis.tabla_diagnostica && (
                      <div className="mt-6 pt-6 border-t border-white/5 space-y-2">
                        {aiAnalysis.tabla_diagnostica.map((row, i) => {
                          const dimKey = Object.keys(DIMENSION_LABELS)[i]
                          const score = aiAnalysis.dimensiones[dimKey] ?? 50
                          const barColor = score >= 70 ? 'bg-emerald-500' : score >= 45 ? 'bg-amber-500' : 'bg-red-500'
                          return (
                            <div key={i} className="flex items-center gap-3 px-3 py-2.5 rounded-xl hover:bg-white/[0.02] transition-colors">
                              <div className="w-2.5 h-2.5 rounded-full flex-shrink-0" style={{ backgroundColor: DIMENSION_COLORS[i] }} />
                              <div className="flex-1 min-w-0">
                                <div className="flex items-center justify-between mb-1">
                                  <span className="text-white/65 text-xs font-medium">{row.dimension}</span>
                                  <span className="text-white/75 text-xs font-semibold tabular-nums ml-2">{score}%</span>
                                </div>
                                <div className="h-1.5 bg-white/[0.06] rounded-full overflow-hidden mb-1.5">
                                  <div className={`h-full rounded-full ${barColor} transition-all`} style={{ width: `${score}%`, opacity: 0.7 }} />
                                </div>
                                <p className="text-white/40 text-[11px] font-light leading-snug">{row.interpretacion}</p>
                              </div>
                            </div>
                          )
                        })}
                      </div>
                    )}
                  </div>
                </motion.div>
              )}

              {/* ═══ 4. DIRECCIÓN PROBABLE — Premium Gauges ═══ */}
              {aiAnalysis.direccion_probable && (
                <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
                  <div className="relative text-center py-8 mb-6">
                    <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-cyan-500/25 to-transparent" />
                    <div className="inline-flex items-center justify-center w-10 h-10 rounded-xl bg-gradient-to-br from-cyan-500/15 to-blue-500/10 border border-cyan-500/20 mb-3">
                      <TrendingUp className="w-5 h-5 text-cyan-400/60" />
                    </div>
                    <p className="text-cyan-300/40 text-[10px] font-bold uppercase tracking-[0.3em] mb-1">Proyección</p>
                    <h2 className="text-lg font-light text-transparent bg-clip-text bg-gradient-to-r from-cyan-300 to-blue-300">Dirección Probable del Vínculo</h2>
                  </div>
                  <div className="p-6 rounded-2xl border border-white/8 bg-white/[0.02]">
                    {/* Gauges row */}
                    <div className="grid grid-cols-3 gap-6 mb-6">
                      <GaugeChart value={aiAnalysis.direccion_probable.estabilidad_futura} label="Estabilidad futura" />
                      <GaugeChart value={aiAnalysis.direccion_probable.riesgo_desgaste} label="Riesgo de desgaste" inverted />
                      <GaugeChart value={aiAnalysis.direccion_probable.potencial_reconexion} label="Potencial de reconexión" />
                    </div>
                    {/* Interpretation text */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-4 border-t border-white/5">
                      {[
                        { val: aiAnalysis.direccion_probable.estabilidad_futura ?? 0, label: 'Estabilidad futura', text: val => val >= 60 ? 'El vínculo tiene bases sólidas para sostenerse en el tiempo.' : val >= 40 ? 'Hay elementos de estabilidad pero también zonas frágiles que requieren atención.' : 'La estabilidad del vínculo está comprometida y necesita trabajo activo.' },
                        { val: aiAnalysis.direccion_probable.riesgo_desgaste ?? 0, label: 'Riesgo de desgaste', text: val => val >= 60 ? 'Se detectan señales importantes de desgaste emocional acumulado.' : val >= 40 ? 'Existe un desgaste moderado que conviene atender antes de que escale.' : 'El nivel de desgaste es bajo, lo cual es un indicador positivo.' },
                        { val: aiAnalysis.direccion_probable.potencial_reconexion ?? 0, label: 'Potencial de reconexión', text: val => val >= 60 ? 'Hay un potencial significativo para reconectar y profundizar el vínculo.' : val >= 40 ? 'La reconexión es posible pero requerirá intención y esfuerzo de ambos.' : 'El potencial de reconexión es bajo — algo fundamental necesita cambiar primero.' }
                      ].map(({ val, label, text }) => (
                        <div key={label} className="text-center">
                          <p className="text-white/45 text-xs font-light leading-relaxed">{text(val)}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                </motion.div>
              )}

              {/* ═══ 5. FORTALEZAS Y RIESGOS — Side by side ═══ */}
              {(aiAnalysis.fortalezas?.length > 0 || aiAnalysis.riesgos?.length > 0) && (
                <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
                  <div className="relative text-center py-8 mb-6">
                    <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-emerald-500/20 to-transparent" />
                    <div className="flex items-center justify-center gap-3 mb-3">
                      <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-emerald-500/15 to-green-500/10 border border-emerald-500/20 flex items-center justify-center">
                        <Shield className="w-5 h-5 text-emerald-400/60" />
                      </div>
                    </div>
                    <p className="text-emerald-300/40 text-[10px] font-bold uppercase tracking-[0.3em] mb-1">Diagnóstico</p>
                    <h2 className="text-lg font-light text-transparent bg-clip-text bg-gradient-to-r from-emerald-300 to-cyan-300">Fortalezas y Señales de Riesgo</h2>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Fortalezas — left */}
                    <div className="space-y-3">
                      <p className="text-emerald-300/50 text-[10px] font-medium uppercase tracking-wider flex items-center gap-2">
                        <CheckCircle className="w-3.5 h-3.5" /> Fortalezas detectadas
                      </p>
                      {(aiAnalysis.fortalezas || []).map((f, i) => (
                        <div key={i} className="p-4 rounded-xl border border-emerald-500/10 bg-emerald-500/[0.02] flex items-start gap-3">
                          <div className="w-6 h-6 rounded-lg bg-emerald-500/10 border border-emerald-500/15 flex items-center justify-center flex-shrink-0 mt-0.5">
                            <CheckCircle className="w-3 h-3 text-emerald-400/60" strokeWidth={1.5} />
                          </div>
                          <p className="text-white/70 text-[14px] font-light leading-relaxed">{stripBold(f)}</p>
                        </div>
                      ))}
                    </div>
                    {/* Riesgos — right */}
                    <div className="space-y-3">
                      <p className="text-red-300/50 text-[10px] font-medium uppercase tracking-wider flex items-center gap-2">
                        <AlertTriangle className="w-3.5 h-3.5" /> Señales de riesgo
                      </p>
                      {(aiAnalysis.riesgos || []).map((r, i) => (
                        <div key={i} className="p-4 rounded-xl border border-red-500/10 bg-red-500/[0.02] flex items-start gap-3">
                          <div className="w-6 h-6 rounded-lg bg-red-500/10 border border-red-500/15 flex items-center justify-center flex-shrink-0 mt-0.5">
                            <AlertTriangle className="w-3 h-3 text-red-400/60" strokeWidth={1.5} />
                          </div>
                          <p className="text-white/70 text-[14px] font-light leading-relaxed">{stripBold(r)}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                </motion.div>
              )}

              {/* ═══ 6. TU SIGUIENTE PASO — CTA DINÁMICO ═══ */}
              <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
                className="p-6 lg:p-8 rounded-2xl border border-violet-500/15 bg-gradient-to-br from-violet-500/[0.04] via-fuchsia-500/[0.02] to-transparent relative overflow-hidden">
                <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-violet-500/30 via-fuchsia-500/20 to-violet-500/30" />
                <div className="text-center mb-6">
                  <div className="inline-flex items-center justify-center w-12 h-12 rounded-2xl bg-gradient-to-br from-violet-500/20 to-fuchsia-500/15 border border-violet-500/25 mb-4">
                    <Sparkles className="w-6 h-6 text-violet-400/70" />
                  </div>
                  <p className="text-violet-300/40 text-[10px] font-bold uppercase tracking-[0.3em] mb-2">Recomendación personalizada</p>
                  <h2 className="text-lg font-light text-white/80 mb-2">Tu siguiente paso</h2>
                  <p className="text-white/40 text-sm font-light max-w-md mx-auto">
                    {aiAnalysis.temas_para_consulta?.length > 0
                      ? 'Basándonos en lo que compartiste, estos son los temas que más impacto tendrían en sesión.'
                      : 'Estos son los patrones, raíces y dinámicas que exploraríamos en sesión para transformar tu vínculo.'}
                  </p>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
                  {aiAnalysis.temas_para_consulta?.length > 0
                    ? aiAnalysis.temas_para_consulta.map((tema, i) => {
                        const icons = [Eye, Anchor, Heart, Target, Compass, Brain]
                        const TemaIcon = icons[i % icons.length]
                        return (
                          <div key={i} className="p-4 rounded-xl border border-white/8 bg-white/[0.02] flex items-start gap-3">
                            <div className="w-8 h-8 rounded-lg bg-violet-500/10 border border-violet-500/15 flex items-center justify-center flex-shrink-0">
                              <TemaIcon className="w-4 h-4 text-violet-400/60" strokeWidth={1.5} />
                            </div>
                            <p className="text-white/65 text-sm font-light leading-relaxed pt-1">{tema}</p>
                          </div>
                        )
                      })
                    : [
                        { icon: Eye, label: 'Patrones inconscientes', desc: 'Identificar y desactivar los ciclos repetitivos en tus relaciones.' },
                        { icon: Anchor, label: 'Raíces familiares', desc: 'Explorar cómo tu historia familiar moldea tu forma de amar hoy.' },
                        { icon: Heart, label: 'Reconexión emocional', desc: 'Reconstruir la intimidad y la presencia emocional en el vínculo.' },
                        { icon: Target, label: 'Comunicación efectiva', desc: 'Transformar los conflictos en oportunidades de crecimiento.' }
                      ].map(({ icon: Icon, label, desc }) => (
                        <div key={label} className="p-4 rounded-xl border border-white/8 bg-white/[0.02] flex items-start gap-3">
                          <div className="w-8 h-8 rounded-lg bg-violet-500/10 border border-violet-500/15 flex items-center justify-center flex-shrink-0">
                            <Icon className="w-4 h-4 text-violet-400/60" strokeWidth={1.5} />
                          </div>
                          <div>
                            <h3 className="text-white/70 text-sm font-medium mb-1">{label}</h3>
                            <p className="text-white/45 text-[13px] font-light leading-relaxed">{desc}</p>
                          </div>
                        </div>
                      ))
                  }
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <motion.button
                    onClick={() => navigate('/tienda/consulta-individual')}
                    whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}
                    className="flex items-center justify-center gap-2 px-6 py-4 rounded-xl bg-gradient-to-r from-violet-600 to-fuchsia-600 text-white text-sm font-light shadow-lg shadow-violet-600/15 hover:from-violet-500 hover:to-fuchsia-500 transition-all">
                    <Users className="w-4 h-4" /> Terapia Individual
                  </motion.button>
                  <motion.button
                    onClick={() => navigate('/tienda/consulta-pareja')}
                    whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}
                    className="flex items-center justify-center gap-2 px-6 py-4 rounded-xl border border-violet-500/20 bg-violet-500/10 text-violet-300/80 text-sm font-light hover:bg-violet-500/20 transition-all">
                    <Heart className="w-4 h-4" /> Terapia de Pareja
                  </motion.button>
                </div>
              </motion.div>

              {/* ═══ ACTIONS ═══ */}
              <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
                className="flex flex-col sm:flex-row items-center gap-4 justify-center pt-8 border-t border-white/5">
                <motion.button onClick={generatePDF} disabled={pdfGenerating}
                  whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}
                  className="flex items-center gap-2 px-6 py-3 rounded-xl border border-violet-500/20 bg-violet-500/10 text-violet-300/80 text-sm font-light hover:bg-violet-500/20 transition-all disabled:opacity-40">
                  {pdfGenerating ? <Loader2 className="w-4 h-4 animate-spin" /> : <Download className="w-4 h-4" />}
                  Descargar PDF
                </motion.button>
              </motion.div>

              {/* Back */}
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

export default RadiografiaPremiumPage
