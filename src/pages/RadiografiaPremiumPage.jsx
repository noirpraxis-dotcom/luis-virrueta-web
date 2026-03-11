import { motion, AnimatePresence } from 'framer-motion'
import { useState, useRef, useCallback, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  ArrowRight, ArrowLeft, Check, Sparkles, Mic, MicOff, Volume2, VolumeX,
  Loader2, ChevronDown, AlertTriangle, TrendingUp, TrendingDown, Star,
  Shield, Activity, Brain, Heart, Zap, Eye, Target, Users, Flame,
  CheckCircle, Download
} from 'lucide-react'
import SEOHead from '../components/SEOHead'
import jsPDF from 'jspdf'
import { analyzeRadiografiaPremium } from '../services/radiografiaPremiumService'

// ─── 40 PREGUNTAS NARRATIVAS — 5 BLOQUES ────────────────────

const PREGUNTAS = [
  // BLOQUE 0 — Contexto personal y panorama general (Q1–Q5)
  {
    id: 'Q1', block: 'Contexto personal y panorama general',
    mainQuestion: 'Para empezar, cuéntame un poco sobre ti y sobre tu vida actualmente, de forma que podamos entender quién eres y en qué momento de tu vida te encuentras hoy.',
    examples: ['¿Cómo te llamas?', '¿Cuántos años tienes?', '¿A qué te dedicas o en qué estás enfocado actualmente?', '¿Cómo describirías el momento de vida en el que te encuentras ahora?', '¿Cuánto tiempo llevas en tu relación actual?']
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
    examples: ['Cómo pasan el tiempo juntos normalmente', 'Qué tipo de momentos comparten', 'Cómo suelen comunicarse', 'Qué suele ocurrir entre ustedes en lo cotidiano']
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
    examples: ['Qué fue lo primero que te atrajo', 'Qué despertó tu curiosidad o interés', 'Qué sentiste cuando empezaron a conocerse', 'Qué tenía esa persona que la hacía especial para ti']
  },
  {
    id: 'Q7', block: 'Origen del vínculo y atracción inicial',
    mainQuestion: 'Pensando en los primeros momentos de la relación, cuéntame qué cualidades o formas de ser de tu pareja despertaban en ti admiración, interés o atracción.',
    examples: ['Rasgos de su personalidad que te llamaban la atención', 'Cosas que admirabas o valorabas', 'Formas de ser que te resultaban atractivas', 'Aspectos que te hacían sentir curiosidad o conexión']
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
    examples: ['Experiencias que recuerdas de relaciones anteriores', 'Qué aprendiste sobre ti mismo en esas relaciones', 'Qué cosas cambiaron en tu forma de amar', 'Qué descubriste sobre lo que buscas o no buscas en una pareja']
  },
  {
    id: 'Q15', block: 'Historia emocional y patrones relacionales',
    mainQuestion: 'Pensando en lo que has vivido en relaciones anteriores y en tu relación actual, cuéntame si sientes que hay cosas que se repiten o patrones que reconoces en tu forma de relacionarte.',
    examples: ['Situaciones que te parecen familiares', 'Formas de reaccionar que aparecen varias veces', 'Dinámicas que se repiten entre relaciones', 'Cosas que has descubierto sobre tu forma de amar']
  },
  {
    id: 'Q16', block: 'Historia emocional y patrones relacionales',
    mainQuestion: 'Cuando piensas en la forma en que te relacionas con tu pareja hoy, cuéntame qué cosas sientes que esta relación ha despertado o cambiado en ti.',
    examples: ['Aspectos de tu personalidad que han cambiado', 'Cosas que has descubierto sobre ti mismo', 'Aprendizajes que han surgido en la relación', 'Partes de ti que se han desarrollado o transformado']
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
    examples: ['Actividades que disfrutan juntos', 'Momentos que fortalecen el vínculo', 'Conversaciones importantes', 'Experiencias que los acercan']
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
    id: 'Q28', block: 'Deseo, intimidad y dinámica emocional',
    mainQuestion: 'Cuéntame si dentro de la relación aparecen expectativas o ideas sobre cómo debería ser la relación o cómo debería comportarse cada uno.',
    examples: ['Expectativas que han surgido entre ustedes', 'Cosas que uno espera del otro', 'Situaciones donde alguien siente presión', 'Diferencias en lo que cada uno imagina para la relación']
  },
  {
    id: 'Q29', block: 'Deseo, intimidad y dinámica emocional',
    mainQuestion: 'Pensando en tu pareja, cuéntame qué crees que es importante para ella dentro de la relación o qué cosas parece esperar de ti.',
    examples: ['Qué cosas parece valorar más', 'Qué crees que espera de ti', 'Qué cosas parecen importantes para ella', 'Qué cosas le gustaría que fueran diferentes']
  },
  {
    id: 'Q30', block: 'Deseo, intimidad y dinámica emocional',
    mainQuestion: 'Ahora piensa en lo que tú esperas dentro de la relación y cuéntame qué cosas son importantes para ti.',
    examples: ['Qué valoras más en la relación', 'Qué esperas de tu pareja', 'Qué cosas te hacen sentir bien dentro del vínculo', 'Qué cosas te gustaría que fueran diferentes']
  },

  // BLOQUE 5 — Futuro del vínculo y sentido (Q31–Q40)
  {
    id: 'Q31', block: 'Futuro del vínculo y sentido de la relación',
    mainQuestion: 'Pensando en todo lo que han vivido juntos, cuéntame qué significa hoy esta relación para ti dentro de tu vida.',
    examples: ['Qué lugar ocupa esta relación en tu vida', 'Qué representa tu pareja para ti actualmente', 'Qué valor tiene la relación para ti hoy', 'Cómo influye esta relación en tu vida']
  },
  {
    id: 'Q32', block: 'Futuro del vínculo y sentido de la relación',
    mainQuestion: 'Cuando piensas en el futuro, cuéntame cómo imaginas o visualizas la relación entre ustedes con el paso del tiempo.',
    examples: ['Cómo imaginas la relación en los próximos años', 'Qué tipo de vida imaginas juntos', 'Qué cosas te gustaría construir con tu pareja', 'Qué posibilidades ves hacia adelante']
  },
  {
    id: 'Q33', block: 'Futuro del vínculo y sentido de la relación',
    mainQuestion: 'Cuéntame qué cosas dentro de la relación te hacen sentir que vale la pena seguir construyendo este vínculo.',
    examples: ['Momentos que te hacen valorar la relación', 'Cualidades de tu pareja que aprecias', 'Experiencias que fortalecen el vínculo', 'Razones por las que sientes que esta relación es importante']
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
    id: 'Q36', block: 'Futuro del vínculo y sentido de la relación',
    mainQuestion: 'Si imaginas que la relación pudiera mejorar o evolucionar en el futuro, cuéntame qué cambios o transformaciones te gustaría ver.',
    examples: ['Cosas que te gustaría fortalecer en la relación', 'Dinámicas que te gustaría mejorar', 'Aspectos que quisieras desarrollar juntos', 'Formas en que la relación podría crecer']
  },
  {
    id: 'Q37', block: 'Futuro del vínculo y sentido de la relación',
    mainQuestion: 'Si tuvieras que decir qué está buscando cada uno dentro de esta relación, cuéntame qué crees que busca tu pareja y qué crees que estás buscando tú.',
    examples: ['Qué parece necesitar o desear tu pareja en la relación', 'Qué crees que intenta encontrar contigo', 'Qué sientes que tú buscas dentro del vínculo', 'Qué necesidades profundas aparecen en la relación']
  },
  {
    id: 'Q38', block: 'Futuro del vínculo y sentido de la relación',
    mainQuestion: 'Pensando en todo lo que has contado hasta ahora, cuéntame qué crees que esta relación ha despertado o revelado en ti como persona.',
    examples: ['Cosas que has descubierto sobre ti mismo', 'Aprendizajes que han surgido en la relación', 'Cambios personales que han ocurrido', 'Aspectos de tu personalidad que han emergido']
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

// ─── ElevenLabs voices ──────────────────────────────────────────

const VOICES = {
  female: { id: 'XB0fDUnXU5powFXDhCwa', name: 'Charlotte' },
  male: { id: 'onwK4e9ZLuTAKqWW03F9', name: 'Daniel' }
}

// ─── ANÁLISIS ANIMATION TASKS ─────────────────────────────────────

const ANALYSIS_TASKS = [
  { id: 1, text: 'Leyendo tu narrativa completa…' },
  { id: 2, text: 'Detectando temas recurrentes…' },
  { id: 3, text: 'Analizando contradicciones narrativas…' },
  { id: 4, text: 'Identificando tono relacional…' },
  { id: 5, text: 'Calculando 12 dimensiones psicológicas…' },
  { id: 6, text: 'Infiriendo estilo de apego…' },
  { id: 7, text: 'Detectando dinámica de conflicto…' },
  { id: 8, text: 'Analizando patrones inconscientes (Freud)…' },
  { id: 9, text: 'Identificando fantasma relacional (Lacan)…' },
  { id: 10, text: 'Estimando dirección probable del vínculo…' },
  { id: 11, text: 'Construyendo perfil relacional…' },
  { id: 12, text: 'Extrayendo evidencia textual…' },
  { id: 13, text: 'Generando visualizaciones…' },
  { id: 14, text: 'Compilando informe final…' }
]

// ─── HELPERS ──────────────────────────────────────────────────

function renderBold(text) {
  if (!text) return null
  return text.split(/\*\*(.*?)\*\*/g).map((part, i) =>
    i % 2 === 1 ? <strong key={i} className="font-semibold text-white/85">{part}</strong> : part
  )
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
  const cx = 180, cy = 180, r = 120

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
      <svg viewBox="0 0 360 360" className="w-full max-w-sm mx-auto">
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
          return <circle key={k} cx={p.x} cy={p.y} r={3} fill={DIMENSION_COLORS[i]} />
        })}
        {keys.map((_, i) => {
          const p = getPoint(i, 135)
          return (
            <text key={i} x={p.x} y={p.y} textAnchor="middle" dominantBaseline="middle"
              fill={DIMENSION_COLORS[i]} className="text-[6.5px] font-light" fillOpacity={0.85}>
              {labels[i]}
            </text>
          )
        })}
      </svg>
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-1.5 mt-4">
        {keys.map((key, i) => (
          <div key={key} className="flex items-center gap-1.5 p-1.5 rounded-lg border border-white/[0.04] bg-white/[0.01]">
            <div className="w-2 h-2 rounded-full flex-shrink-0" style={{ backgroundColor: DIMENSION_COLORS[i] }} />
            <span className="text-white/50 text-[10px] font-light flex-1 leading-tight">{labels[i]}</span>
            <span className="text-white/70 text-[10px] font-light tabular-nums">{dimensiones[key] ?? 0}%</span>
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

  // Stages: instructions | questionnaire | analyzing | results
  const [stage, setStage] = useState('instructions')
  const [currentQ, setCurrentQ] = useState(0)
  const [responses, setResponses] = useState({})
  const [voiceGender, setVoiceGender] = useState('female')

  // Audio
  const [audioPlaying, setAudioPlaying] = useState(false)
  const audioRef = useRef(null)
  const currentAudioRef = useRef(null)

  // Recording
  const [recording, setRecording] = useState(false)
  const [transcript, setTranscript] = useState('')
  const recognitionRef = useRef(null)

  // Analysis
  const [aiAnalysis, setAiAnalysis] = useState(null)
  const [analysisDone, setAnalysisDone] = useState(false)
  const [completedTasks, setCompletedTasks] = useState(0)
  const [pdfGenerating, setPdfGenerating] = useState(false)

  const question = PREGUNTAS[currentQ]
  const totalQ = PREGUNTAS.length
  const progress = ((currentQ + 1) / totalQ) * 100

  // ── Stop any currently playing audio ──
  const stopAudio = useCallback(() => {
    if (currentAudioRef.current) {
      currentAudioRef.current.pause()
      currentAudioRef.current.currentTime = 0
      currentAudioRef.current = null
    }
    setAudioPlaying(false)
  }, [])

  // ── Play question using ElevenLabs TTS ──
  const playQuestion = useCallback(async (text) => {
    stopAudio()
    const apiKey = import.meta.env.VITE_ELEVENLABS_API_KEY
    const voiceId = VOICES[voiceGender].id
    if (!apiKey) return
    try {
      setAudioPlaying(true)
      const res = await fetch(`https://api.elevenlabs.io/v1/text-to-speech/${voiceId}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'xi-api-key': apiKey },
        body: JSON.stringify({
          text,
          model_id: 'eleven_multilingual_v2',
          voice_settings: { stability: 0.5, similarity_boost: 0.75, style: 0.3 }
        })
      })
      if (!res.ok) { setAudioPlaying(false); return }
      const blob = await res.blob()
      const url = URL.createObjectURL(blob)
      const audio = new Audio(url)
      currentAudioRef.current = audio
      audio.onended = () => { setAudioPlaying(false); currentAudioRef.current = null }
      audio.play()
    } catch { setAudioPlaying(false) }
  }, [voiceGender, stopAudio])

  // ── Auto-play question when changing question ──
  useEffect(() => {
    if (stage === 'questionnaire' && question) {
      playQuestion(question.mainQuestion)
    }
    return () => stopAudio()
  }, [currentQ, stage]) // eslint-disable-line react-hooks/exhaustive-deps

  // ── Speech recognition ──
  const startRecording = useCallback(() => {
    stopAudio() // Stop audio if playing
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition
    if (!SpeechRecognition) return
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
    setRecording(false)
  }, [])

  // ── Save response and navigate ──
  const saveAndNext = useCallback(() => {
    if (transcript.trim()) {
      setResponses(prev => ({ ...prev, [question.id]: transcript.trim() }))
    }
    stopRecording()
    setTranscript('')
    if (currentQ < totalQ - 1) {
      setCurrentQ(prev => prev + 1)
    } else {
      // All questions done → run analysis
      const finalResponses = { ...responses }
      if (transcript.trim()) finalResponses[question.id] = transcript.trim()
      handleRunAnalysis(finalResponses)
    }
  }, [transcript, currentQ, totalQ, question, responses, stopRecording])

  const goBack = useCallback(() => {
    if (currentQ > 0) {
      if (transcript.trim()) {
        setResponses(prev => ({ ...prev, [question.id]: transcript.trim() }))
      }
      stopRecording()
      setCurrentQ(prev => prev - 1)
      const prevQ = PREGUNTAS[currentQ - 1]
      setTranscript(responses[prevQ.id] || '')
    }
  }, [currentQ, transcript, question, responses, stopRecording])

  // ── When entering a question, load saved transcript ──
  useEffect(() => {
    if (stage === 'questionnaire') {
      setTranscript(responses[question?.id] || '')
    }
  }, [currentQ, stage]) // eslint-disable-line react-hooks/exhaustive-deps

  // ── Run AI Analysis ──
  const handleRunAnalysis = useCallback(async (finalResponses) => {
    setStage('analyzing')
    setCompletedTasks(0)
    setAnalysisDone(false)

    // Start animation
    let taskIdx = 0
    const animInterval = setInterval(() => {
      taskIdx++
      setCompletedTasks(taskIdx)
      if (taskIdx >= ANALYSIS_TASKS.length) clearInterval(animInterval)
    }, 4500)

    try {
      const result = await analyzeRadiografiaPremium({ responses: finalResponses, questions: PREGUNTAS })
      setAiAnalysis(result)
      setAnalysisDone(true)
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
            className="min-h-screen flex items-center justify-center px-6 pt-24">
            <div className="max-w-lg w-full text-center space-y-8">
              <div>
                <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-violet-500/15 to-fuchsia-500/10 border border-violet-500/20 flex items-center justify-center mx-auto mb-4">
                  <Brain className="w-8 h-8 text-violet-400/60" strokeWidth={1.5} />
                </div>
                <h1 className="text-2xl lg:text-3xl font-light text-white mb-3">Radiografía de Pareja Premium</h1>
                <p className="text-white/40 text-sm font-light leading-relaxed">
                  Este es un análisis narrativo profundo de tu relación. 40 preguntas abiertas que exploran tu vínculo desde 12 dimensiones psicológicas.
                </p>
              </div>

              <div className="space-y-4">
                <p className="text-white/50 text-sm font-light">Elige la voz que te guiará</p>
                <div className="flex justify-center gap-4">
                  {[{ g: 'female', label: 'Charlotte (mujer)', icon: '👩' }, { g: 'male', label: 'Daniel (hombre)', icon: '👨' }].map(v => (
                    <button key={v.g} onClick={() => setVoiceGender(v.g)}
                      className={`flex items-center gap-2 px-5 py-3 rounded-xl border transition-all ${voiceGender === v.g
                        ? 'border-violet-500/30 bg-violet-500/10 text-violet-300/80'
                        : 'border-white/10 bg-white/[0.02] text-white/40 hover:border-white/20'}`}>
                      <span>{v.icon}</span>
                      <span className="text-sm font-light">{v.label}</span>
                    </button>
                  ))}
                </div>
              </div>

              <div className="space-y-3 text-left p-5 rounded-2xl border border-white/8 bg-white/[0.02]">
                <p className="text-white/60 text-sm font-light">📋 Cómo funciona:</p>
                <ul className="space-y-2 text-white/40 text-sm font-light">
                  <li className="flex items-start gap-2"><Check className="w-3.5 h-3.5 text-violet-400/60 flex-shrink-0 mt-0.5" strokeWidth={2} /> Escucharás cada pregunta en voz alta</li>
                  <li className="flex items-start gap-2"><Check className="w-3.5 h-3.5 text-violet-400/60 flex-shrink-0 mt-0.5" strokeWidth={2} /> Los ejemplos orientativos se muestran debajo (no se leen)</li>
                  <li className="flex items-start gap-2"><Check className="w-3.5 h-3.5 text-violet-400/60 flex-shrink-0 mt-0.5" strokeWidth={2} /> Presiona el micrófono para responder con tu voz</li>
                  <li className="flex items-start gap-2"><Check className="w-3.5 h-3.5 text-violet-400/60 flex-shrink-0 mt-0.5" strokeWidth={2} /> Si la voz está hablando, al dar clic al micrófono se detiene</li>
                  <li className="flex items-start gap-2"><Check className="w-3.5 h-3.5 text-violet-400/60 flex-shrink-0 mt-0.5" strokeWidth={2} /> La bocina junto a la pregunta te permite escucharla de nuevo</li>
                </ul>
              </div>

              <motion.button
                onClick={() => setStage('questionnaire')}
                whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}
                className="w-full py-4 rounded-xl bg-gradient-to-r from-violet-600 to-fuchsia-600 text-white font-light text-base hover:from-violet-500 hover:to-fuchsia-500 transition-all shadow-lg shadow-violet-600/20">
                Comenzar radiografía <ArrowRight className="inline w-4 h-4 ml-2" />
              </motion.button>
            </div>
          </motion.div>
        )}

        {/* ═══════════════════════════════════════════════════════
            STAGE: QUESTIONNAIRE
        ═══════════════════════════════════════════════════════ */}
        {stage === 'questionnaire' && question && (
          <motion.div key="questionnaire" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="min-h-screen pt-24 lg:pt-28 pb-20 px-6">
            <div className="max-w-2xl mx-auto">

              {/* Progress bar */}
              <div className="mb-6">
                <div className="flex justify-between mb-1.5">
                  <span className="text-white/30 text-xs font-light">{question.block}</span>
                  <span className="text-white/30 text-xs font-light">{currentQ + 1} / {totalQ}</span>
                </div>
                <div className="h-1 bg-white/5 rounded-full overflow-hidden">
                  <motion.div animate={{ width: `${progress}%` }} className="h-full bg-gradient-to-r from-violet-500 to-fuchsia-500 rounded-full" />
                </div>
              </div>

              {/* Main question + speaker button */}
              <div className="mb-6">
                <div className="flex items-start gap-3">
                  <div className="flex-1">
                    <p className="text-white/80 text-lg font-light leading-relaxed">{question.mainQuestion}</p>
                  </div>
                  <button
                    onClick={() => playQuestion(question.mainQuestion)}
                    className={`flex-shrink-0 w-10 h-10 rounded-xl border flex items-center justify-center transition-all ${audioPlaying
                      ? 'border-violet-500/30 bg-violet-500/10 text-violet-400/80'
                      : 'border-white/10 bg-white/[0.03] text-white/40 hover:text-white/60 hover:border-white/20'}`}>
                    {audioPlaying ? <VolumeX className="w-4 h-4" onClick={(e) => { e.stopPropagation(); stopAudio() }} /> : <Volume2 className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              {/* Examples (not read aloud) */}
              <div className="mb-8 p-4 rounded-xl border border-white/5 bg-white/[0.015]">
                <p className="text-white/30 text-xs font-light mb-2">Ejemplos que pueden orientar tu respuesta:</p>
                <ul className="space-y-1">
                  {question.examples.map((ex, i) => (
                    <li key={i} className="text-white/35 text-sm font-light flex items-start gap-2">
                      <span className="text-white/20 mt-0.5">•</span>
                      {ex}
                    </li>
                  ))}
                </ul>
                <p className="text-white/20 text-[11px] font-light mt-2 italic">Puedes añadir cualquier otro detalle que sientas importante.</p>
              </div>

              {/* Transcript area */}
              <div className="mb-6">
                <div className="min-h-[120px] p-4 rounded-xl border border-white/10 bg-white/[0.02]">
                  {transcript ? (
                    <p className="text-white/60 text-sm font-light leading-relaxed">{transcript}</p>
                  ) : (
                    <p className="text-white/20 text-sm font-light italic">Tu respuesta aparecerá aquí mientras hablas…</p>
                  )}
                </div>
              </div>

              {/* Microphone */}
              <div className="flex justify-center mb-8">
                <motion.button
                  onClick={recording ? stopRecording : startRecording}
                  whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}
                  className={`w-16 h-16 rounded-full flex items-center justify-center transition-all ${recording
                    ? 'bg-red-500/20 border-2 border-red-500/50 text-red-400 animate-pulse'
                    : 'bg-violet-500/10 border-2 border-violet-500/30 text-violet-400/70 hover:border-violet-500/50'}`}>
                  {recording ? <MicOff className="w-6 h-6" /> : <Mic className="w-6 h-6" />}
                </motion.button>
              </div>

              {recording && (
                <p className="text-center text-red-400/60 text-xs font-light mb-4 animate-pulse">
                  🔴 Grabando — habla con libertad. Presiona de nuevo para detener.
                </p>
              )}

              {/* Navigation */}
              <div className="flex justify-between">
                <button onClick={goBack} disabled={currentQ === 0}
                  className="flex items-center gap-2 text-white/30 hover:text-white/60 text-xs tracking-wider transition-colors disabled:opacity-20">
                  <ArrowLeft className="w-3.5 h-3.5" /> ANTERIOR
                </button>
                <button onClick={saveAndNext}
                  className="flex items-center gap-2 text-violet-300/60 hover:text-violet-300/90 text-xs tracking-wider transition-colors">
                  {currentQ < totalQ - 1 ? 'SIGUIENTE' : 'FINALIZAR'} <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>

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
                <p className="text-white/35 text-sm font-light">40 respuestas × 12 dimensiones × 9 corrientes psicológicas</p>
              </div>
              <div className="space-y-2">
                {ANALYSIS_TASKS.map((task, i) => {
                  const done = i < completedTasks
                  const active = i === completedTasks
                  return (
                    <motion.div key={task.id} animate={{ opacity: done || active ? 1 : 0.3 }}
                      className={`flex items-center gap-3 p-3 rounded-xl ${done ? 'bg-emerald-500/[0.04] border border-emerald-500/10' : active ? 'bg-violet-500/[0.04] border border-violet-500/15' : 'border border-white/5'}`}>
                      {done ? (
                        <Check className="w-4 h-4 text-emerald-400/70" strokeWidth={2.5} />
                      ) : active ? (
                        <Loader2 className="w-4 h-4 text-violet-400/60 animate-spin" />
                      ) : (
                        <div className="w-4 h-4 rounded-full bg-white/10" />
                      )}
                      <span className={`text-sm font-light ${done ? 'text-white/60' : active ? 'text-white/80' : 'text-white/25'}`}>{task.text}</span>
                    </motion.div>
                  )
                })}
              </div>
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
                <h1 className="text-3xl lg:text-4xl font-light text-white mb-3">Tu Radiografía de Pareja</h1>
                <p className="text-white/40 text-sm font-light">Análisis narrativo de 40 respuestas × 12 dimensiones psicológicas × 9 corrientes</p>
              </div>

              {/* ═══ 1. RADAR PSICOLÓGICO DEL VÍNCULO ═══ */}
              {aiAnalysis.dimensiones && (
                <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
                  <h2 className="text-xl font-light text-white/70 mb-2 text-center">Mapa Psicológico del Vínculo</h2>
                  <p className="text-white/30 text-xs font-light mb-6 text-center">Cada eje representa una dimensión psicológica diferente de tu relación</p>
                  <div className="p-6 rounded-2xl border border-white/8 bg-white/[0.02]">
                    <RadarChart dimensiones={aiAnalysis.dimensiones} />
                  </div>
                </motion.div>
              )}

              {/* ═══ 2. RADIOGRAFÍA INICIAL ═══ */}
              {aiAnalysis.radiografia_inicial && (
                <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
                  className="p-6 lg:p-8 rounded-2xl border border-violet-500/10 bg-gradient-to-br from-violet-500/[0.03] to-transparent relative overflow-hidden">
                  <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-violet-500/30 to-fuchsia-500/30" />
                  <h2 className="text-xl font-light text-white/70 mb-4">Radiografía Inicial de tu Relación</h2>
                  <div className="space-y-3">
                    {aiAnalysis.radiografia_inicial.split('\n\n').map((p, i) => (
                      <p key={i} className="text-white/55 text-sm font-light leading-relaxed">{renderBold(p)}</p>
                    ))}
                  </div>
                </motion.div>
              )}

              {/* ═══ 3. ESTADO ACTUAL — Bar chart ═══ */}
              {aiAnalysis.dimensiones && (
                <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
                  <h2 className="text-xl font-light text-white/70 mb-6 text-center">Estado Actual de la Relación</h2>
                  <div className="p-6 rounded-2xl border border-white/8 bg-white/[0.02]">
                    <div className="space-y-3">
                      {['estabilidad_relacional', 'conexion_emocional', 'deseo_erotico', 'sincronia_relacional', 'resiliencia_vinculo'].map(key => {
                        const val = aiAnalysis.dimensiones[key] ?? 0
                        return (
                          <div key={key}>
                            <div className="flex justify-between mb-1">
                              <span className="text-white/50 text-xs font-light">{DIMENSION_LABELS[key]}</span>
                              <span className="text-white/70 text-xs font-light">{val}%</span>
                            </div>
                            <div className="h-2.5 bg-white/5 rounded-full overflow-hidden">
                              <motion.div initial={{ width: 0 }} whileInView={{ width: `${val}%` }} viewport={{ once: true }}
                                className={`h-full bg-gradient-to-r ${getBarGradient(val)} rounded-full opacity-60`} />
                            </div>
                          </div>
                        )
                      })}
                    </div>
                  </div>
                </motion.div>
              )}

              {/* ═══ 4. DINÁMICA DEL CONFLICTO ═══ */}
              {aiAnalysis.dinamica_conflicto && (
                <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
                  <h2 className="text-xl font-light text-white/70 mb-6 text-center">⚡ Dinámica de Conflicto</h2>
                  <div className="p-6 rounded-2xl border border-white/8 bg-gradient-to-br from-orange-500/[0.02] to-transparent">
                    <div className="grid grid-cols-2 gap-4 mb-4">
                      <div className="p-4 rounded-xl border border-white/5 bg-white/[0.02] text-center">
                        <p className="text-2xl font-light text-white mb-1">{aiAnalysis.dinamica_conflicto.tendencia_conflicto ?? 0}%</p>
                        <p className="text-white/40 text-xs font-light">Tendencia al conflicto</p>
                      </div>
                      <div className="p-4 rounded-xl border border-white/5 bg-white/[0.02] text-center">
                        <p className="text-2xl font-light text-white mb-1">{aiAnalysis.dinamica_conflicto.capacidad_reparacion ?? 0}%</p>
                        <p className="text-white/40 text-xs font-light">Capacidad de reparación</p>
                      </div>
                    </div>
                    {aiAnalysis.dinamica_conflicto.reaccion_usuario && (
                      <div className="space-y-3 border-t border-white/5 pt-4">
                        <div>
                          <p className="text-white/50 text-xs font-light mb-1">Tu reacción al conflicto:</p>
                          <p className="text-white/45 text-sm font-light leading-relaxed">{renderBold(aiAnalysis.dinamica_conflicto.reaccion_usuario)}</p>
                        </div>
                        <div>
                          <p className="text-white/50 text-xs font-light mb-1">Reacción percibida de tu pareja:</p>
                          <p className="text-white/45 text-sm font-light leading-relaxed">{renderBold(aiAnalysis.dinamica_conflicto.reaccion_pareja)}</p>
                        </div>
                      </div>
                    )}
                  </div>
                </motion.div>
              )}

              {/* ═══ 5. ENERGÍA EMOCIONAL Y ERÓTICA ═══ */}
              {aiAnalysis.energia_vinculo && (
                <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
                  <h2 className="text-xl font-light text-white/70 mb-6 text-center">🔥 Energía Emocional y Erótica</h2>
                  <div className="p-6 rounded-2xl border border-white/8 bg-gradient-to-br from-pink-500/[0.02] to-transparent">
                    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                      {[
                        { key: 'atraccion_inicial', label: 'Atracción inicial' },
                        { key: 'atraccion_actual', label: 'Atracción actual' },
                        { key: 'intimidad_emocional', label: 'Intimidad emocional' },
                        { key: 'conexion_fisica', label: 'Conexión física' }
                      ].map(({ key, label }) => {
                        const val = aiAnalysis.energia_vinculo[key] ?? 0
                        return (
                          <div key={key} className="p-4 rounded-xl border border-white/5 bg-white/[0.02] text-center">
                            <p className={`text-2xl font-light ${getLevelColor(val)} mb-1`}>{val}%</p>
                            <p className="text-white/40 text-xs font-light">{label}</p>
                          </div>
                        )
                      })}
                    </div>
                  </div>
                </motion.div>
              )}

              {/* ═══ 6. DIRECCIÓN PROBABLE ═══ */}
              {aiAnalysis.direccion_probable && (
                <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
                  <h2 className="text-xl font-light text-white/70 mb-6 text-center">🔮 Dirección Probable de la Relación</h2>
                  <div className="p-6 rounded-2xl border border-white/8 bg-white/[0.02]">
                    <div className="grid grid-cols-3 gap-4">
                      <GaugeChart value={aiAnalysis.direccion_probable.estabilidad_futura} label="Estabilidad futura" />
                      <GaugeChart value={aiAnalysis.direccion_probable.riesgo_desgaste} label="Riesgo de desgaste" inverted />
                      <GaugeChart value={aiAnalysis.direccion_probable.potencial_reconexion} label="Potencial de reconexión" />
                    </div>
                  </div>
                </motion.div>
              )}

              {/* ═══ 7. TABLA DIAGNÓSTICA ═══ */}
              {aiAnalysis.tabla_diagnostica && (
                <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
                  <h2 className="text-xl font-light text-white/70 mb-6 text-center">📊 Diagnóstico Estructural</h2>
                  <div className="rounded-2xl border border-white/8 overflow-hidden">
                    <div className="grid grid-cols-3 gap-px bg-white/5 text-xs font-light">
                      <div className="bg-zinc-950 p-3 text-white/40">Dimensión</div>
                      <div className="bg-zinc-950 p-3 text-white/40 text-center">Nivel</div>
                      <div className="bg-zinc-950 p-3 text-white/40">Interpretación</div>
                    </div>
                    {aiAnalysis.tabla_diagnostica.map((row, i) => {
                      const levelColor = row.nivel?.toLowerCase().includes('alto') ? 'text-emerald-400' :
                        row.nivel?.toLowerCase().includes('bajo') ? 'text-red-400' : 'text-amber-400'
                      return (
                        <div key={i} className="grid grid-cols-3 gap-px bg-white/5">
                          <div className="bg-zinc-950 p-3 text-white/60 text-xs font-light">{row.dimension}</div>
                          <div className={`bg-zinc-950 p-3 text-xs font-light text-center ${levelColor}`}>{row.nivel}</div>
                          <div className="bg-zinc-950 p-3 text-white/45 text-xs font-light">{row.interpretacion}</div>
                        </div>
                      )
                    })}
                  </div>
                </motion.div>
              )}

              {/* ═══ 8. LECTURA PROFUNDA ═══ */}
              {aiAnalysis.analisis_profundo && (
                <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
                  <h2 className="text-xl font-light text-white/70 mb-6 text-center">🔍 Lectura Profunda del Vínculo</h2>
                  <div className="space-y-4">
                    {[
                      { key: 'narrativa_dominante', label: 'Narrativa dominante' },
                      { key: 'tensiones_estructurales', label: 'Tensiones estructurales' },
                      { key: 'evolucion_deseo', label: 'Evolución del deseo' },
                      { key: 'dinamica_emocional', label: 'Dinámica emocional' }
                    ].map(({ key, label }) => {
                      const text = aiAnalysis.analisis_profundo[key]
                      if (!text) return null
                      return (
                        <div key={key} className="p-5 rounded-2xl border border-white/8 bg-white/[0.02]">
                          <h3 className="text-white/60 text-sm font-light mb-2">{label}</h3>
                          <div className="space-y-2">
                            {text.split('\n\n').map((p, i) => (
                              <p key={i} className="text-white/45 text-sm font-light leading-relaxed">{renderBold(p)}</p>
                            ))}
                          </div>
                        </div>
                      )
                    })}
                  </div>
                </motion.div>
              )}

              {/* ═══ 9. LECTURA PSICOANALÍTICA ═══ */}
              {aiAnalysis.lectura_psicoanalitica && (
                <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
                  <h2 className="text-xl font-light text-white/70 mb-6 text-center">🧠 Lectura Psicoanalítica</h2>
                  <div className="space-y-4">
                    {[
                      { key: 'proyecciones_inconscientes', label: 'Proyecciones inconscientes (Freud)' },
                      { key: 'fantasma_relacional', label: 'Fantasma relacional (Lacan)' },
                      { key: 'roles_simbolicos', label: 'Roles simbólicos' }
                    ].map(({ key, label }) => {
                      const text = aiAnalysis.lectura_psicoanalitica[key]
                      if (!text) return null
                      return (
                        <div key={key} className="p-5 rounded-2xl border border-purple-500/10 bg-gradient-to-br from-purple-500/[0.02] to-transparent">
                          <h3 className="text-purple-300/60 text-sm font-light mb-2">{label}</h3>
                          <div className="space-y-2">
                            {text.split('\n\n').map((p, i) => (
                              <p key={i} className="text-white/45 text-sm font-light leading-relaxed">{renderBold(p)}</p>
                            ))}
                          </div>
                        </div>
                      )
                    })}
                  </div>
                </motion.div>
              )}

              {/* ═══ 10. FORTALEZAS ═══ */}
              {aiAnalysis.fortalezas?.length > 0 && (
                <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
                  <h2 className="text-xl font-light text-white/70 mb-6 text-center">💪 Fortalezas Detectadas</h2>
                  <div className="space-y-3">
                    {aiAnalysis.fortalezas.map((f, i) => (
                      <div key={i} className="p-4 rounded-xl border border-emerald-500/10 bg-emerald-500/[0.02] flex items-start gap-3">
                        <CheckCircle className="w-4 h-4 text-emerald-400/60 flex-shrink-0 mt-0.5" strokeWidth={1.5} />
                        <p className="text-white/55 text-sm font-light">{renderBold(f)}</p>
                      </div>
                    ))}
                  </div>
                </motion.div>
              )}

              {/* ═══ 11. SEÑALES DE RIESGO ═══ */}
              {aiAnalysis.riesgos?.length > 0 && (
                <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
                  <h2 className="text-xl font-light text-white/70 mb-6 text-center">⚠️ Señales de Riesgo</h2>
                  <div className="space-y-3">
                    {aiAnalysis.riesgos.map((r, i) => (
                      <div key={i} className="p-4 rounded-xl border border-red-500/10 bg-red-500/[0.02] flex items-start gap-3">
                        <AlertTriangle className="w-4 h-4 text-red-400/60 flex-shrink-0 mt-0.5" strokeWidth={1.5} />
                        <p className="text-white/55 text-sm font-light">{renderBold(r)}</p>
                      </div>
                    ))}
                  </div>
                </motion.div>
              )}

              {/* ═══ 12. SÍNTESIS FINAL ═══ */}
              {aiAnalysis.sintesis_final && (
                <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
                  className="p-6 lg:p-8 rounded-2xl border border-cyan-500/15 bg-gradient-to-br from-cyan-500/[0.03] to-transparent relative overflow-hidden">
                  <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-cyan-500/30 to-teal-500/30" />
                  <h2 className="text-xl font-light text-white/70 mb-4">Síntesis Final</h2>
                  <div className="space-y-4">
                    {[
                      { key: 'que_ocurre', label: '¿Qué está ocurriendo realmente?' },
                      { key: 'posibilidades_evolucion', label: '¿Qué posibilidades de evolución existen?' },
                      { key: 'factores_fortalecimiento', label: '¿Qué factores podrían fortalecer el vínculo?' }
                    ].map(({ key, label }) => {
                      const text = aiAnalysis.sintesis_final[key]
                      if (!text) return null
                      return (
                        <div key={key}>
                          <h3 className="text-cyan-300/60 text-sm font-light mb-2">{label}</h3>
                          <div className="space-y-2">
                            {text.split('\n\n').map((p, i) => (
                              <p key={i} className="text-white/50 text-sm font-light leading-relaxed">{renderBold(p)}</p>
                            ))}
                          </div>
                        </div>
                      )
                    })}
                  </div>
                </motion.div>
              )}

              {/* ═══ ACTIONS ═══ */}
              <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
                className="flex flex-col sm:flex-row items-center gap-4 justify-center pt-8 border-t border-white/5">
                <motion.button onClick={generatePDF} disabled={pdfGenerating}
                  whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}
                  className="flex items-center gap-2 px-6 py-3 rounded-xl border border-violet-500/20 bg-violet-500/10 text-violet-300/80 text-sm font-light hover:bg-violet-500/20 transition-all disabled:opacity-40">
                  {pdfGenerating ? <Loader2 className="w-4 h-4 animate-spin" /> : <Download className="w-4 h-4" />}
                  Descargar PDF
                </motion.button>
                <motion.button
                  onClick={() => window.open(`https://wa.me/527228720520?text=${encodeURIComponent('Hola, acabo de hacer la Radiografía de Pareja Premium y me gustaría agendar una sesión para profundizar.')}`, '_blank')}
                  whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}
                  className="flex items-center gap-2 px-6 py-3 rounded-xl bg-gradient-to-r from-violet-600 to-fuchsia-600 text-white text-sm font-light">
                  Agendar sesión profesional
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
