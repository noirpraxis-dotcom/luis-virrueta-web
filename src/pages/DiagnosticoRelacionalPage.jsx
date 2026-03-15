import { motion, AnimatePresence } from 'framer-motion'
import { useState, useRef, useMemo, useCallback, useEffect } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import {
  Heart, MessageCircle, Shield, Target, Users, Brain, ArrowRight, ArrowLeft,
  Check, CheckCircle, Clock, FileText, Mail, Send, Download, Sparkles, Eye,
  Lock, Star, Activity, BarChart3, Zap, Layers, CreditCard, Loader2, Tag,
  Mic, MicOff, TrendingUp, TrendingDown, AlertTriangle, Play, ChevronDown,
  XCircle, Volume2, Gift, BookOpen, ChevronLeft, ChevronRight, Hourglass,
  Flame, Link2, Fingerprint, HeartHandshake, Puzzle, MessageSquare, Triangle,
  ScanEye, Magnet, Scale, Dna
} from 'lucide-react'
import SEOHead from '../components/SEOHead'
import jsPDF from 'jspdf'
import { analyzeDiagnostic } from '../services/diagnosticRelacionalService'
import { generateAccessToken, PRODUCT_LABELS, DATA_RETENTION_DAYS } from '../utils/accessToken'
import { sendAccessEmails, sendResultsEmail, verifyStripeSession } from '../services/emailApiService'
import { saveProgress, getProgress, savePurchase, saveResults } from '../services/firebaseAuthService'

// ─── CUESTIONARIO: 44 PREGUNTAS EN 18 BLOQUES ────────────────────

const QUESTIONS = [
  // Q0 — INTRODUCCIÓN (datos personales + primera impresión)
  { id: 'Q0', section: 'Introducción', text: 'Antes de empezar, cuéntame: ¿cómo te llamas, cuántos años tienes, cuánto tiempo llevan juntos como pareja, y en una frase, cómo describirías tu relación hoy?', sample: 'Soy Luis, tengo 32 años, llevamos 4 años juntos. Diría que estamos en un momento raro — hay amor pero también mucho desgaste.' },

  // BLOQUE 1 — HISTORIA DEL VÍNCULO (Narrativa relacional) — 3 preguntas
  { id: 'Q1', section: 'Historia del vínculo', text: '¿Cómo comenzó tu relación? Cuéntame cómo se conocieron y cómo fueron esos primeros momentos importantes.', sample: 'Nos conocimos en una fiesta. Hubo una conexión inmediata, como si ya nos conociéramos. A los dos meses ya estábamos viviendo juntos.' },
  { id: 'Q2', section: 'Historia del vínculo', text: 'Si tuvieras que contar la historia de tu relación como una película o un relato corto, ¿cómo sería? ¿En qué parte de la historia están ahora?', sample: 'Sería un drama romántico. Empezó con fuego, luego hubo una crisis fuerte, y ahora estamos en la parte donde los personajes deciden si siguen o no.' },
  { id: 'Q3', section: 'Historia del vínculo', text: 'Mirando hacia atrás desde el inicio hasta hoy, ¿qué momentos consideras los puntos clave que cambiaron la relación — para bien o para mal?', sample: 'Cuando nos mudamos juntos todo cambió para bien. Pero cuando perdí mi trabajo, empezamos a pelear por todo y nunca volvimos a ser iguales.' },

  // BLOQUE 2 — ADMIRACIÓN Y VALORACIÓN (Gottman) — 3 preguntas
  { id: 'Q4', section: 'Admiración y valoración', text: 'Piensa en un momento reciente en el que hayas sentido admiración o respeto por tu pareja. Describe qué ocurrió y por qué ese momento fue significativo para ti.', sample: 'Hace poco la vi resolver un problema con su familia con mucha calma. Me di cuenta de que es más fuerte de lo que yo creía.' },
  { id: 'Q5', section: 'Admiración y valoración', text: 'De todas las cualidades de tu pareja, ¿cuáles valoras más profundamente? No lo que hace, sino cómo es como persona. Cuéntame por qué esas cualidades son importantes para ti.', sample: 'Su honestidad. Nunca miente, aunque duela. Eso me hace confiar en ella aunque a veces me cueste escucharlo.' },
  { id: 'Q6', section: 'Admiración y valoración', text: '¿En qué momentos o situaciones sientes que te sientes especialmente orgulloso u orgullosa de tu pareja? Describe alguno.', sample: 'Cuando la veo con sus amigos. Es otra persona — más libre, más divertida. Me gusta verla así.' },

  // BLOQUE 3 — APEGO EMOCIONAL (Bowlby/Ainsworth) — 3 preguntas
  { id: 'Q7', section: 'Apego emocional', text: 'Cuando sientes que tu pareja está distante o menos conectada contigo — ya sea porque está ocupada, fría o simplemente no responde como esperas — ¿qué emociones aparecen dentro de ti y qué es lo primero que sueles hacer?', sample: 'Me da ansiedad. Empiezo a pensar qué hice mal. A veces la busco más, otras me cierro para protegerme.' },
  { id: 'Q8', section: 'Apego emocional', text: 'Cuando tú necesitas cercanía emocional — sentirte acompañado, escuchado o contenido — ¿cómo sueles buscarla dentro de la relación? ¿La pides directamente o haces algo para que suceda?', sample: 'Casi nunca la pido directamente. Más bien hago cosas para estar cerca — cocino, propongo ver algo juntos. Pero no digo "necesito que me abraces".' },
  { id: 'Q9', section: 'Apego emocional', text: 'Si la relación terminara por completo, ¿qué es lo que más sentirías que pierdes? No hablo de cosas prácticas, sino emocionalmente — ¿qué se iría contigo?', sample: 'Perdería la única persona que me conoce de verdad. Eso me aterra. No es que no pueda estar solo — es que con ella no tengo que fingir.' },

  // BLOQUE 4 — CONEXIÓN EMOCIONAL (Sue Johnson) — 3 preguntas
  { id: 'Q10', section: 'Conexión emocional', text: 'Describe un momento reciente en el que hayas sentido una conexión emocional profunda con tu pareja. ¿Qué estaban haciendo y cómo se sintió por dentro?', sample: 'Una noche nos quedamos hablando hasta las 3am sobre nuestros miedos. No había celulares, no había prisa. Me sentí visto de verdad.' },
  { id: 'Q11', section: 'Conexión emocional', text: '¿Qué tipo de situaciones o momentos hacen que te sientas emocionalmente más cerca de tu pareja? No lo general — piensa en algo específico que haya pasado.', sample: 'Cuando me cuenta algo que no le cuenta a nadie más. Cuando baja la guardia. Ahí siento que realmente confía en mí.' },
  { id: 'Q12', section: 'Conexión emocional', text: '¿Hay momentos en los que te sientes emocionalmente solo o sola dentro de la relación, aunque tu pareja esté ahí presente? Cuéntame cómo es eso para ti.', sample: 'Sí. A veces estamos en el mismo cuarto pero siento un muro invisible. Ella está en su teléfono y yo me siento transparente.' },

  // BLOQUE 5 — MANEJO DEL CONFLICTO (Gottman) — 3 preguntas
  { id: 'Q13', section: 'Manejo del conflicto', text: 'Describe cómo suele comenzar una discusión entre ustedes. ¿Quién dice qué primero, cómo escala, y cuál es el patrón que se repite?', sample: 'Ella hace un comentario que parece inofensivo pero tiene veneno. Yo me pongo a la defensiva. Ella sube el tono. Yo me callo. Siempre es igual.' },
  { id: 'Q14', section: 'Manejo del conflicto', text: '¿Qué ocurre normalmente durante esas discusiones? ¿Cómo reaccionas tú, cómo reacciona tu pareja, y cómo suele terminar la cosa?', sample: 'Yo intento explicar mi punto pero ella siente que la estoy atacando. Entonces se cierra. Y yo me quedo hablando solo. Termina en silencio.' },
  { id: 'Q15', section: 'Manejo del conflicto', text: 'Después de un conflicto fuerte, ¿cómo se reconstruye la relación entre ustedes? ¿Quién da el primer paso, cuánto tardan, y cómo se siente ese proceso de reconexión?', sample: 'Normalmente yo doy el primer paso al día siguiente. Ella tarda más. A veces pasan días sin hablar del tema y simplemente fingimos que no pasó.' },

  // BLOQUE 6 — INTIMIDAD EMOCIONAL — 3 preguntas
  { id: 'Q16', section: 'Intimidad emocional', text: '¿Qué partes de ti siente tu pareja que realmente conoce bien? Y por otro lado, ¿hay cosas importantes de ti que tu pareja no sabe o no entiende del todo?', sample: 'Ella conoce mis inseguridades, eso sí. Pero no sabe cuánto me afecta cuando me ignora. Eso nunca lo he dicho.' },
  { id: 'Q17', section: 'Intimidad emocional', text: '¿Qué partes de tu mundo emocional te cuesta compartir con tu pareja? ¿Hay temas, sentimientos o pensamientos que prefieres no mostrar?', sample: 'Me cuesta mostrar debilidad. Si estoy triste, lo escondo. No quiero que piense que soy frágil o que me va a perder el respeto.' },
  { id: 'Q18', section: 'Intimidad emocional', text: 'Describe un momento en el que te hayas sentido profundamente comprendido o comprendida por tu pareja. ¿Qué pasó y qué significó eso para ti?', sample: 'Cuando murió mi abuela, ella no dijo nada. Solo me abrazó y se quedó ahí. No necesité palabras. Eso fue todo.' },

  // BLOQUE 7 — DESEO Y ATRACCIÓN (Perel) — 3 preguntas
  { id: 'Q19', section: 'Deseo y atracción', text: '¿Qué fue lo que inicialmente despertó tu atracción hacia tu pareja? No solo lo físico — ¿qué te enganchó emocionalmente de esa persona?', sample: 'Su forma de reír. Cómo me miraba. Sentía que me deseaba de verdad, no solo como algo bonito sino como algo profundo.' },
  { id: 'Q20', section: 'Deseo y atracción', text: '¿Cómo describirías hoy el deseo y la atracción entre ustedes? ¿Ha cambiado desde el inicio de la relación? ¿En qué sentido?', sample: 'Cambió mucho. Antes era constante, casi urgente. Ahora es más tranquilo. A veces lo extraño, pero tampoco sé cómo recuperarlo.' },
  { id: 'Q21', section: 'Deseo y atracción', text: '¿Qué cosas ayudan — o ayudarían — a mantener viva la chispa, el deseo y la atracción en la relación? ¿Qué falta o qué les funciona?', sample: 'Cuando salimos solos, sin rutina, vuelve algo. Pero en el día a día se pierde. Creo que nos falta sorprendernos más.' },

  // BLOQUE 8 — PATRONES INCONSCIENTES (Hendrix) — 3 preguntas
  { id: 'Q22', section: 'Patrones inconscientes', text: 'Si miras tu historia amorosa pasada — relaciones anteriores o incluso la forma en que creciste — ¿ves patrones que se repiten también en esta relación?', sample: 'Siempre elijo personas emocionalmente distantes. Mi papá era así. Y aquí estoy de nuevo buscando que alguien frío me dé calor.' },
  { id: 'Q23', section: 'Patrones inconscientes', text: '¿Hay algo que se repite una y otra vez en los conflictos de tu relación? Un tema, una reacción, una dinámica que siempre vuelve, aunque cambien las circunstancias.', sample: 'Siempre termino sintiéndome el que pide disculpas. No importa quién empezó — siempre soy yo el que cede para que se arregle.' },
  { id: 'Q24', section: 'Patrones inconscientes', text: 'En los momentos más difíciles de la relación, ¿qué rol sientes que sueles ocupar? ¿Eres quien busca solucionar, quien se retira, quien explota, quien calla, quien cuida al otro?', sample: 'Soy el que intenta arreglar todo. El mediador. El que dice "está bien" aunque no esté bien. Es agotador.' },

  // BLOQUE 9 — DIFERENCIACIÓN (Schnarch) — 3 preguntas
  { id: 'Q25', section: 'Diferenciación', text: '¿Qué aspectos de tu identidad personal — quién eres tú como individuo — sientes que es importante mantener dentro de la relación, aunque a tu pareja no siempre le guste o lo entienda?', sample: 'Mi tiempo a solas. Necesito mis espacios, mis hobbies, mi mundo. Cuando lo pierdo, me pierdo yo.' },
  { id: 'Q26', section: 'Diferenciación', text: '¿En qué momentos sientes que necesitas más espacio personal dentro de la relación? ¿Cómo reacciona tu pareja cuando pides ese espacio o cuando te alejas un poco?', sample: 'Después de una pelea necesito estar solo. Pero ella lo interpreta como rechazo y se enoja más. Es un círculo.' },
  { id: 'Q27', section: 'Diferenciación', text: '¿Qué tan fácil o difícil es para ti mantener tu propia independencia emocional dentro de la relación? Es decir, estar bien contigo mismo(a) sin que eso dependa de cómo esté tu pareja.', sample: 'Me cuesta. Si ella está mal, yo estoy mal. Si ella está distante, yo me desmorono. Sé que no es sano pero no sé cómo cambiarlo.' },

  // BLOQUE 10 — LENGUAJES DEL AMOR (Chapman) — 2 preguntas
  { id: 'Q28', section: 'Lenguajes del amor', text: '¿Qué cosas concretas hace tu pareja que te hacen sentir amado, valorado o cuidado? Piensa en acciones específicas — no conceptos generales.', sample: 'Cuando me trae un café sin que se lo pida. Cuando me manda un mensaje random diciendo que me extraña. Esas pequeñas cosas.' },
  { id: 'Q29', section: 'Lenguajes del amor', text: '¿Cómo sueles tú expresar cariño o amor hacia tu pareja? ¿De qué formas le demuestras que te importa en el día a día?', sample: 'Le hago de comer, le resuelvo cosas, le doy su espacio. Pero ella dice que nunca le digo que la quiero con palabras. Y tiene razón.' },

  // BLOQUE 11 — REGULACIÓN EMOCIONAL (Tatkin) — 2 preguntas
  { id: 'Q30', section: 'Regulación emocional', text: 'Cuando uno de los dos está emocionalmente alterado — enojado, ansioso, triste — ¿cómo suele reaccionar el otro? ¿Se acerca para calmar, se aleja, intenta resolver, se engancha en la emoción?', sample: 'Si yo estoy mal, ella se aleja. No sabe qué hacer. Y si ella está mal, yo intento arreglarlo y eso la frustra más.' },
  { id: 'Q31', section: 'Regulación emocional', text: '¿Qué cosas ayudan a que la relación vuelva a sentirse estable y segura después de un momento difícil o una crisis emocional entre ustedes?', sample: 'El tiempo. Y a veces un gesto pequeño — una caricia, un "perdón" sincero. Pero a veces no hay nada que ayude y simplemente se pasa.' },

  // BLOQUE 12 — TRIÁNGULO DEL AMOR (Sternberg) — 2 preguntas
  { id: 'Q32', section: 'Estructura del amor', text: 'Si piensas en tu relación en tres dimensiones — la pasión física, la cercanía emocional y el compromiso a largo plazo — ¿cuál de las tres sientes que está más viva hoy y cuál sientes que se ha ido apagando?', sample: 'El compromiso sigue firme. La cercanía emocional va y viene. Pero la pasión... se apagó bastante. Y eso me preocupa.' },
  { id: 'Q33', section: 'Estructura del amor', text: '¿Cuál de estas tres dimensiones — pasión, cercanía emocional o compromiso — sientes que tu pareja vive de forma distinta a ti? ¿En cuál están más desalineados?', sample: 'Yo siento que ella está bien con el compromiso y ya. Pero a mí me falta la pasión y la cercanía. Creo que ella no lo nota.' },

  // BLOQUE 13 — NEUROBIOLOGÍA DEL AMOR (Fisher) — 2 preguntas
  { id: 'Q34', section: 'Neurobiología del amor', text: '¿Qué sensaciones físicas notas cuando estás cerca de tu pareja? ¿Calma, excitación, tensión, indiferencia, algo más? ¿Han cambiado esas sensaciones con el tiempo?', sample: 'Antes me daba mariposas. Ahora siento calma, a veces nada. Cuando peleamos, siento un nudo en el estómago que no se va en días.' },
  { id: 'Q35', section: 'Neurobiología del amor', text: '¿Hay momentos en los que sientes una necesidad casi física de estar con tu pareja — como una urgencia de cercanía, de tocarla, de estar juntos — o eso ya no te pasa como antes?', sample: 'Ya no me pasa como antes. A veces sí, después de pasar unos días separados, vuelve algo. Pero en el día a día, no.' },

  // BLOQUE 14 — APEGO APLICADO (Levine) — 2 preguntas
  { id: 'Q36', section: 'Apego aplicado', text: 'Cuando no sabes dónde está tu pareja, no te contesta el teléfono o tarda mucho en responder, ¿qué es lo primero que sientes y qué haces? Sé honesto o honesta.', sample: 'Empiezo a imaginar cosas. ¿Está enojada? ¿Le pasó algo? ¿Está con alguien? Sé que es irracional pero no puedo evitarlo. Le mando otro mensaje.' },
  { id: 'Q37', section: 'Apego aplicado', text: 'Cuando tu pareja quiere más cercanía, más tiempo juntos o más contacto emocional del que tú necesitas en ese momento, ¿cómo reaccionas por dentro y qué haces?', sample: 'Me siento un poco asfixiado. Necesito mi espacio. Pero no sé cómo decirlo sin que suene a rechazo, entonces me aguanto.' },

  // BLOQUE 15 — SATISFACCIÓN Y MANTENIMIENTO (Finkel) — 2 preguntas
  { id: 'Q38', section: 'Satisfacción y mantenimiento', text: 'Si tuvieras que ponerle una calificación del 1 al 10 a qué tan satisfecho o satisfecha te sientes hoy con tu relación, ¿cuál sería? Y sobre todo: ¿por qué esa cifra y no una más alta?', sample: 'Un 6. Porque hay amor pero falta profundidad. No es un 8 porque ya no me siento priorizado. Y no es un 4 porque seguimos eligiéndonos.' },
  { id: 'Q39', section: 'Satisfacción y mantenimiento', text: '¿Qué esfuerzos activos haces tú para cuidar la relación en el día a día? Y honestamente, ¿sientes que tu pareja hace lo mismo o hay un desequilibrio?', sample: 'Yo siento que hago más. Organizo citas, pregunto cómo está, cedo en peleas. Ella no tanto. Y cuando se lo digo, se ofende.' },

  // BLOQUE 16 — VISIÓN DEL FUTURO (Compromiso) — 3 preguntas
  { id: 'Q40', section: 'Visión del futuro', text: '¿Cómo imaginas tu relación dentro de cinco años si todo sigue como está ahora? ¿Y cómo la imaginas si las cosas mejoraran?', sample: 'Si sigue así, nos vamos a separar. Si mejora, me imagino viajando juntos, riendo otra vez, siendo equipo de verdad.' },
  { id: 'Q41', section: 'Visión del futuro', text: '¿Qué cambios concretos — no ideales, sino reales y posibles — ayudarían a que la relación se fortalezca entre ustedes?', sample: 'Hablar de lo que realmente sentimos sin que se convierta en pelea. Y que ella también ponga de su parte, no solo yo.' },
  { id: 'Q42', section: 'Visión del futuro', text: '¿Qué aspectos de la relación sientes que necesitan más cuidado y atención hacia el futuro? ¿Qué no quieres que se pierda?', sample: 'La complicidad. Eso que teníamos al principio. La sensación de que somos un equipo. No quiero que se pierda eso.' },

  // Q43 — CIERRE LIBRE
  { id: 'Q43', section: 'Cierre', text: '¿Hay algo importante sobre tu relación, sobre ti o sobre tu pareja que no te haya preguntado y que sientas que debería saber? Lo que sea.', sample: 'Que a pesar de todo, la amo. Y que tengo miedo de que eso no sea suficiente.' }
]

// Section metadata for progress display
const SECTIONS = [
  { name: 'Introducción', icon: Users, color: 'slate', count: 1 },
  { name: 'Historia del vínculo', icon: BookOpen, color: 'violet', count: 3 },
  { name: 'Admiración y valoración', icon: Star, color: 'amber', count: 3 },
  { name: 'Apego emocional', icon: Heart, color: 'rose', count: 3 },
  { name: 'Conexión emocional', icon: MessageCircle, color: 'blue', count: 3 },
  { name: 'Manejo del conflicto', icon: Activity, color: 'red', count: 3 },
  { name: 'Intimidad emocional', icon: Eye, color: 'fuchsia', count: 3 },
  { name: 'Deseo y atracción', icon: Zap, color: 'pink', count: 3 },
  { name: 'Patrones inconscientes', icon: Brain, color: 'purple', count: 3 },
  { name: 'Diferenciación', icon: Target, color: 'emerald', count: 3 },
  { name: 'Lenguajes del amor', icon: Gift, color: 'orange', count: 2 },
  { name: 'Regulación emocional', icon: Shield, color: 'cyan', count: 2 },
  { name: 'Estructura del amor', icon: Layers, color: 'indigo', count: 2 },
  { name: 'Neurobiología del amor', icon: Sparkles, color: 'teal', count: 2 },
  { name: 'Apego aplicado', icon: Lock, color: 'sky', count: 2 },
  { name: 'Satisfacción y mantenimiento', icon: BarChart3, color: 'lime', count: 2 },
  { name: 'Visión del futuro', icon: TrendingUp, color: 'yellow', count: 3 },
  { name: 'Cierre', icon: CheckCircle, color: 'green', count: 1 }
]

// ─── LABELS FOR SCORING ──────────────────────────────────────

// Composite scores (high-level relationship indicators)
const COMPOSITE_LABELS = {
  salud_relacional_global: { label: 'Salud Relacional Global', icon: Heart },
  sincronia_emocional: { label: 'Sincronía Emocional', icon: Shield },
  riesgo_ruptura: { label: 'Riesgo de Ruptura', icon: AlertTriangle, inverted: true },
  potencial_crecimiento: { label: 'Potencial de Crecimiento', icon: TrendingUp }
}

// 12 dimension labels (one per author/axis on radar)
const DIMENSION_LABELS = {
  apego: 'Apego (Bowlby)',
  interaccion_conflicto: 'Conflicto (Gottman)',
  estructura_amor: 'Amor (Sternberg)',
  vinculo_emocional: 'Vínculo (Johnson)',
  diferenciacion: 'Diferenciación (Schnarch)',
  deseo: 'Deseo (Perel)',
  patrones_inconscientes: 'Patrones (Hendrix)',
  neurobiologia_amor: 'Neuro (Fisher)',
  regulacion_emocional: 'Regulación (Tatkin)',
  apego_aplicado: 'Apego apl. (Levine)',
  lenguaje_amor: 'Lenguaje (Chapman)',
  satisfaccion_mantenimiento: 'Satisfacción (Finkel)'
}

const DIMENSION_COLORS = [
  '#8b5cf6', '#ef4444', '#6366f1', '#3b82f6', '#10b981', '#ec4899',
  '#a855f7', '#14b8a6', '#06b6d4', '#0ea5e9', '#f97316', '#84cc16'
]

// Sub-score labels for expandable detail
const SUB_SCORE_LABELS = {
  apego: {
    seguridad_base: { label: 'Seguridad de base' },
    miedo_abandono: { label: 'Miedo al abandono', inverted: true },
    busqueda_cercania: { label: 'Búsqueda de cercanía' }
  },
  interaccion_conflicto: {
    critica_desprecio: { label: 'Crítica/Desprecio', inverted: true },
    defensividad: { label: 'Defensividad', inverted: true },
    stonewalling: { label: 'Stonewalling', inverted: true },
    capacidad_reparacion: { label: 'Capacidad de reparación' }
  },
  estructura_amor: {
    pasion: { label: 'Pasión' },
    intimidad: { label: 'Intimidad' },
    compromiso: { label: 'Compromiso' }
  },
  deseo: {
    atraccion_actual: { label: 'Atracción actual' },
    espontaneidad_erotica: { label: 'Espontaneidad erótica' },
    misterio_novedad: { label: 'Misterio y novedad' }
  }
}

const ANALYSIS_TASK_GROUPS = [
  {
    label: 'Lectura relacional',
    color: 'violet',
    tasks: [
      { id: 1, text: 'Leyendo narrativa emocional y contexto de la relación…' },
      { id: 2, text: 'Detectando patrones de apego y regulación afectiva…' },
      { id: 3, text: 'Mapeando señales de vínculo, intimidad y distancia…' },
      { id: 4, text: 'Calculando equilibrio entre conexión y autonomía…' }
    ]
  },
  {
    label: 'Dinámicas de conflicto',
    color: 'blue',
    tasks: [
      { id: 5, text: 'Analizando estilo de discusión y escalada emocional…' },
      { id: 6, text: 'Estimando capacidad de reparación postconflicto…' },
      { id: 7, text: 'Identificando ciclos repetitivos de persecución-retirada…' },
      { id: 8, text: 'Evaluando riesgo de cronificación del conflicto…' }
    ]
  },
  {
    label: 'Compatibilidad profunda',
    color: 'fuchsia',
    tasks: [
      { id: 9, text: 'Comparando lenguajes del amor y necesidades implícitas…' },
      { id: 10, text: 'Integrando deseo, intimidad y compromiso de la díada…' },
      { id: 11, text: 'Evaluando fortalezas y recursos protectores de la pareja…' },
      { id: 12, text: 'Modelando proyección relacional a 90 días…' }
    ]
  },
  {
    label: 'Síntesis diagnóstica',
    color: 'pink',
    tasks: [
      { id: 13, text: 'Construyendo indicadores globales de salud relacional…' },
      { id: 14, text: 'Generando recomendaciones terapéuticas personalizadas…' },
      { id: 15, text: 'Clasificando tipo de relación y ciclos dominantes…' },
      { id: 16, text: 'Integrando todas las dimensiones en el diagnóstico final…' }
    ]
  }
]

const ALL_ANALYSIS_TASKS = ANALYSIS_TASK_GROUPS.flatMap(g => g.tasks)
const TASK_DURATIONS_MS = [6200, 6500, 6000, 7200, 6600, 6000, 7400, 6600, 5800, 7000, 6400, 7300, 6600, 8200, 6400, 7500]

const SAMPLE_ANALYSIS = {
  relationship_type: {
    label: 'Relacion con desgaste emocional acumulado',
    explanation: 'Existe vinculo y deseo de seguir, pero se repiten patrones que elevan la distancia emocional y desgastan la relacion.'
  },
  key_patterns: [
    { title: 'Ciclo persecucion-retirada', description: 'Uno busca acercamiento y el otro se cierra; el conflicto se repite sin reparacion.', severity: 'high' },
    { title: 'Critica y defensividad', description: 'Aparecen respuestas defensivas que bloquean conversaciones profundas.', severity: 'medium' }
  ],
  composite_scores: {
    salud_relacional_global: 46,
    sincronia_emocional: 39,
    riesgo_ruptura: 64,
    potencial_crecimiento: 73
  },
  dimension_scores: {
    apego: 44,
    interaccion_conflicto: 37,
    estructura_amor: 57,
    vinculo_emocional: 42,
    diferenciacion: 61,
    deseo: 41,
    patrones_inconscientes: 48,
    neurobiologia_amor: 50,
    regulacion_emocional: 43,
    apego_aplicado: 46,
    lenguaje_amor: 55,
    satisfaccion_mantenimiento: 45
  },
  sub_scores: {
    apego: { seguridad_base: 40, miedo_abandono: 69, busqueda_cercania: 64 },
    interaccion_conflicto: { critica_desprecio: 67, defensividad: 71, stonewalling: 56, capacidad_reparacion: 34 },
    estructura_amor: { pasion: 43, intimidad: 58, compromiso: 70 },
    deseo: { atraccion_actual: 44, espontaneidad_erotica: 36, misterio_novedad: 31 }
  },
  attachment_map: { style: 'Ansioso-evitativo', anxiety_level: 66, avoidance_level: 38 },
  dimension_narratives: {
    apego: 'Se observa necesidad alta de cercania con sensibilidad al silencio emocional.',
    interaccion_conflicto: 'El conflicto escala rapido y la reparacion llega tarde o no llega.',
    estructura_amor: 'Hay compromiso, pero intimidad y pasion necesitan trabajo consciente.',
    vinculo_emocional: 'La conexion aparece por momentos, pero no se sostiene.',
    diferenciacion: 'Hay recursos de autonomia, aunque bajo estres se pierde centro emocional.',
    deseo: 'El deseo se afecta por rutina, distancia y conversaciones pendientes.',
    patrones_inconscientes: 'Se repiten guiones antiguos de busqueda y evitacion.',
    neurobiologia_amor: 'Predomina familiaridad con baja novedad emocional.',
    regulacion_emocional: 'Falta co-regulacion en momentos de tension.',
    apego_aplicado: 'La distancia activa ansiedad y respuestas de control o sobrebusqueda.',
    lenguaje_amor: 'Hay desajuste entre como uno da amor y como el otro necesita recibirlo.',
    satisfaccion_mantenimiento: 'La relacion esta en punto de inflexion: aun recuperable con intervencion.'
  },
  empathic_opening: 'Tu historia no muestra una relacion perdida, muestra una relacion que necesita direccion. Hay base emocional para reconstruir si se trabaja con claridad.',
  individual_insights: {
    emotional_style: 'Estilo emocional intenso con alta necesidad de confirmacion afectiva.',
    attachment_patterns: 'Patron de apego ansioso con activacion ante distancia.',
    defense_mechanisms: 'Predomina defensividad cuando aparece sensacion de critica.',
    what_they_seek_in_love: 'Buscas seguridad emocional y cercania constante.',
    emotional_triggers: 'Silencio prolongado y mensajes ambiguos activan ansiedad relacional.',
    repeating_patterns: 'Se repite insistencia -> retiro -> distancia -> insistencia.',
    hidden_needs: 'Necesidad de reconocimiento y validacion emocional sostenida.',
    role_in_relationship: 'Rol frecuente de sostener la relacion aun con desgaste personal.',
    differentiation_profile: 'Buena autonomia funcional, baja autonomia bajo conflicto.'
  },
  couple_insights: {
    real_relationship_dynamic: 'La dinamica principal es persecucion-retirada.',
    unconscious_patterns: 'Ambos activan aprendizajes afectivos tempranos en conflicto.',
    conflict_and_defense: 'Aparecen critica, defensividad y desconexion tras discusiones.',
    distancing_dynamics: 'La distancia no es evento unico, es acumulativa.',
    attachment_and_support: 'El sistema de apoyo mutuo es inestable bajo estres.',
    strengths_of_the_relationship: 'Hay deseo de continuidad, historia compartida y compromiso.',
    love_languages_analysis: 'Existe desajuste entre expresion y recepcion del afecto.',
    global_relationship_diagnosis: 'Con cambios concretos, la relacion tiene alta probabilidad de mejora.'
  },
  dominant_cycles: [
    { name: 'Insistencia - Retiro - Distancia', explanation: 'Ciclo principal detectado en la mayoria de conflictos relevantes.' }
  ],
  activated_emotional_sensitivities: [
    { name: 'Miedo al abandono', description: 'Se activa ante senales de distancia o ambiguedad.' },
    { name: 'Hipervigilancia relacional', description: 'Se monitorea la relacion con tension sostenida.' }
  ],
  future_projection: {
    if_continues: 'Sin cambios, aumenta la desconexion y el desgaste emocional.',
    if_changes: 'Con intervencion y acuerdos claros, la vinculación puede fortalecerse.'
  },
  key_insight: 'El problema no es falta de amor: es falta de reparacion y coordinacion emocional.',
  recommendation: 'Prioriza conversaciones guiadas, reglas de conflicto y practicas de reparacion temprana.',
  session_work_items: [
    'Definir protocolo de reparacion postconflicto',
    'Alinear lenguajes del amor y necesidades primarias',
    'Reducir patrones de critica-defensividad con comunicacion estructurada'
  ]
}

// ─── STRIPE API ────────────────────────────────────────────────

// Cloudflare Worker — https://radiografia-worker.noirpraxis.workers.dev
const WORKER_URL = 'https://radiografia-worker.noirpraxis.workers.dev'
const API_BASE = import.meta.env.DEV ? '' : WORKER_URL
const AUDIO_BASE = import.meta.env.DEV ? '' : WORKER_URL

const PRODUCT_PRICE_DESCUBRE = 499
const PRODUCT_PRICE_SOLO = 499
const PRODUCT_PRICE_LOSDOS = 999
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
              El análisis narrativo de 44 respuestas en 12 dimensiones requiere unos momentos adicionales
            </p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

// ─── RADAR CHART SVG (multi-color with legend) ──────────────────────

function RadarChart({ scores }) {
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
    const p = getPoint(i, scores[k] || 0)
    return `${p.x},${p.y}`
  }).join(' ')

  return (
    <div>
      <svg viewBox="0 0 360 360" className="w-full max-w-sm mx-auto">
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
              fill={DIMENSION_COLORS[i]} fillOpacity={0.10}
              stroke={DIMENSION_COLORS[i]} strokeOpacity={0.25} strokeWidth={0.7}
            />
          )
        })}
        {/* Data outline */}
        <polygon points={polygon} fill="none" stroke="rgba(255,255,255,0.15)" strokeWidth={0.5} />
        {/* Data points with distinct colors */}
        {keys.map((k, i) => {
          const p = getPoint(i, scores[k] || 0)
          return <circle key={k} cx={p.x} cy={p.y} r={3} fill={DIMENSION_COLORS[i]} />
        })}
        {/* Labels with matching colors */}
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
      {/* Color-coded legend — 12 items in 3 columns */}
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-1.5 mt-4">
        {keys.map((key, i) => (
          <div key={key} className="flex items-center gap-1.5 p-1.5 rounded-lg border border-white/[0.04] bg-white/[0.01]">
            <div className="w-2 h-2 rounded-full flex-shrink-0" style={{ backgroundColor: DIMENSION_COLORS[i] }} />
            <span className="text-white/50 text-[10px] font-light flex-1 leading-tight">{labels[i]}</span>
            <span className="text-white/70 text-[10px] font-light tabular-nums">{scores[key] ?? 0}%</span>
          </div>
        ))}
      </div>
    </div>
  )
}

// ─── GAUGE CHART SVG (semi-circle arc) ──────────────────────────────

function GaugeChart({ value, label, color, inverted = false, icon }) {
  const clampedVal = Math.max(0, Math.min(100, value || 0))
  const displayColor = color || (inverted
    ? (clampedVal > 60 ? '#ef4444' : clampedVal > 40 ? '#f59e0b' : '#10b981')
    : (clampedVal >= 60 ? '#10b981' : clampedVal >= 40 ? '#f59e0b' : '#ef4444'))
  // Arc math: 180deg semi-circle, radius 80, center at (100, 95)
  const arcLength = Math.PI * 80 // ~251.3
  const filledLength = (clampedVal / 100) * arcLength

  return (
    <div className="flex flex-col items-center">
      <svg viewBox="0 0 200 115" className="w-full max-w-[180px]">
        {/* Background arc */}
        <path d="M 20 95 A 80 80 0 0 1 180 95" fill="none" stroke="rgba(255,255,255,0.06)" strokeWidth={14} strokeLinecap="round" />
        {/* Filled arc */}
        <path d="M 20 95 A 80 80 0 0 1 180 95" fill="none" stroke={displayColor} strokeWidth={14} strokeLinecap="round" strokeOpacity={0.6}
          strokeDasharray={`${filledLength} ${arcLength}`} />
        {/* Value text */}
        <text x="100" y="85" textAnchor="middle" fill="white" fontSize="30" fontWeight="300" opacity={0.85}>{clampedVal}%</text>
        <text x="100" y="108" textAnchor="middle" fill="rgba(255,255,255,0.35)" fontSize="9" fontWeight="300">
          {inverted ? (clampedVal > 60 ? 'Atención' : clampedVal > 40 ? 'Moderado' : 'Bajo') : (clampedVal >= 60 ? 'Saludable' : clampedVal >= 40 ? 'Moderado' : 'Atención')}
        </text>
      </svg>
      {label && (
        <div className="flex items-center gap-1.5 mt-1">
          {icon && <span className="text-sm">{icon}</span>}
          <span className="text-white/50 text-xs font-light text-center">{label}</span>
        </div>
      )}
    </div>
  )
}

// ─── CONFLICT SANKEY DIAGRAM (pure SVG) ─────────────────────────────

function ConflictSankeyChart({ conflictFlow }) {
  if (!conflictFlow?.nodes?.length || !conflictFlow?.links?.length) return null

  const nodes = conflictFlow.nodes
  const links = conflictFlow.links

  // Layout: nodes spread across columns (left to right)
  const colMap = { trigger: 0, reaction_a: 1, reaction_b: 1, escalation: 2, result: 3 }
  const colGroups = {}
  nodes.forEach(n => {
    const col = colMap[n.id] ?? 0
    if (!colGroups[col]) colGroups[col] = []
    colGroups[col].push(n)
  })

  const W = 600, H = 260, pad = 40, nodeW = 18
  const cols = Object.keys(colGroups).sort((a, b) => a - b)
  const colCount = cols.length

  // Position nodes
  const positions = {}
  cols.forEach((c, ci) => {
    const group = colGroups[c]
    const x = pad + (ci / (colCount - 1)) * (W - 2 * pad - nodeW)
    const totalH = H - 2 * pad
    const gap = group.length > 1 ? totalH / group.length : 0
    group.forEach((n, ni) => {
      const nodeH = Math.max(30, totalH / Math.max(group.length, 1) - 10)
      const y = pad + ni * gap + (gap - nodeH) / 2
      positions[n.id] = { x, y, w: nodeW, h: nodeH, label: n.label }
    })
  })

  const nodeColors = {
    trigger: '#f59e0b',
    reaction_a: '#ef4444',
    reaction_b: '#6366f1',
    escalation: '#ec4899',
    result: '#64748b'
  }

  return (
    <div className="overflow-x-auto">
      <svg viewBox={`0 0 ${W} ${H}`} className="w-full min-w-[500px]" style={{ maxHeight: 260 }}>
        {/* Links as curved paths */}
        {links.map((link, i) => {
          const src = positions[link.source]
          const tgt = positions[link.target]
          if (!src || !tgt) return null
          const x1 = src.x + src.w
          const y1 = src.y + src.h / 2
          const x2 = tgt.x
          const y2 = tgt.y + tgt.h / 2
          const mx = (x1 + x2) / 2
          const thickness = Math.max(2, (link.value / 100) * 12)
          return (
            <path key={i}
              d={`M ${x1} ${y1} C ${mx} ${y1}, ${mx} ${y2}, ${x2} ${y2}`}
              fill="none" stroke={nodeColors[link.source] || '#8b5cf6'} strokeWidth={thickness} strokeOpacity={0.25}
            />
          )
        })}
        {/* Nodes */}
        {nodes.map((n) => {
          const p = positions[n.id]
          if (!p) return null
          const color = nodeColors[n.id] || '#8b5cf6'
          return (
            <g key={n.id}>
              <rect x={p.x} y={p.y} width={p.w} height={p.h} rx={4} fill={color} fillOpacity={0.3} stroke={color} strokeOpacity={0.5} strokeWidth={1} />
              <text x={p.x + p.w + 6} y={p.y + p.h / 2} dominantBaseline="middle" fill="rgba(255,255,255,0.6)" className="text-[9px] font-light">
                {p.label}
              </text>
            </g>
          )
        })}
      </svg>
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

  // Per-card promo codes (Stripe checkout)
  const [cardPromoCodes, setCardPromoCodes] = useState({ descubre: '', solo: '', losdos: '' })
  const [cardPromoErrors, setCardPromoErrors] = useState({})
  const [cardPromoApplied, setCardPromoApplied] = useState({}) // { descubre: { label, discount }, ... }
  const [promoValidating, setPromoValidating] = useState(null) // 'descubre' | 'solo' | 'losdos' | null
  const [checkoutLoading, setCheckoutLoading] = useState(null)
  const [purchasingType, setPurchasingType] = useState(null)

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
  const [voiceGender, setVoiceGender] = useState('female') // 'female' = Charlotte MP3, 'male' = male MP3
  const recognitionRef = useRef(null)
  const audioRef = useRef(null)
  const profileAudioPlayedRef = useRef(false)
  const profileAudioBlobRef = useRef(null)
  const currentQuestionRef = useRef(currentQuestion)
  currentQuestionRef.current = currentQuestion

  // AI analysis
  const [aiAnalysis, setAiAnalysis] = useState(null)
  const [aiLoading, setAiLoading] = useState(false)
  const [aiReady, setAiReady] = useState(false)
  const bgAnalysisRef = useRef(null)

  const [pdfGenerating, setPdfGenerating] = useState(false)
  const [carouselIdx, setCarouselIdx] = useState(0)
  const [testimonialIdx, setTestimonialIdx] = useState(0)
  const testimonialRef = useRef(null)
  const [expandedInsights, setExpandedInsights] = useState({})
  const toggleInsight = useCallback((key) => setExpandedInsights(prev => ({ ...prev, [key]: !prev[key] })), [])
  const [resumeDraft, setResumeDraft] = useState(null)
  const [showFreeGuide, setShowFreeGuide] = useState(false)



  // Smart email/token flow
  const [thankyouEmails, setThankyouEmails] = useState(['', ''])
  const [thankYouProfile, setThankYouProfile] = useState({ nombre: '', edad: '', nombrePareja: '', edadPareja: '' })
  const [emailsSent, setEmailsSent] = useState(false)
  const [sendingEmails, setSendingEmails] = useState(false)
  const [emailSendError, setEmailSendError] = useState('')
  const [purchaseId, setPurchaseId] = useState(null)
  const [accessToken, setAccessToken] = useState(null)
  const [verifyingPayment, setVerifyingPayment] = useState(false)
  const [autoSendingPdf, setAutoSendingPdf] = useState(false)
  const [pdfAutoSent, setPdfAutoSent] = useState(false)

  // Test/dev mode: URL param
  const isDevMode = searchParams.get('test') === 'true' || searchParams.get('demo') === 'true'
  const [stripeTestMode, setStripeTestMode] = useState(false)

  // ─── PREVIEW MODE: ?preview=results → skip to results with sample data ───
  useEffect(() => {
    if (searchParams.get('preview') === 'results' && !aiAnalysis) {
      setAiAnalysis(SAMPLE_ANALYSIS)
      setStage('results')
    }
  }, [searchParams]) // eslint-disable-line react-hooks/exhaustive-deps

  const scrollToTop = useCallback(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }, [])

  const openReportSample = useCallback(() => {
    setAiAnalysis(SAMPLE_ANALYSIS)
    setStage('results')
    scrollToTop()
  }, [scrollToTop])

  // Restore purchase from session OR handle Stripe redirect
  useEffect(() => {
    const sessionId = searchParams.get('session_id')
    // New: unified Stripe return with session_id — verify via backend
    if (sessionId && !purchaseId) {
      setVerifyingPayment(true)
      setStage('thankyou')
      verifyStripeSession(sessionId).then(data => {
        // URL ?type= is authoritative for radiografía products (backend may prefix with 'radiografia_')
        const urlType = searchParams.get('type') || ''
        const radiografiaTypes = ['descubre', 'solo', 'losdos']
        const type = radiografiaTypes.includes(urlType) ? urlType : (data.type || urlType || 'solo')
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

  // Profile form intro audio — Valentina voice plays once when post-purchase form appears
  useEffect(() => {
    if (!purchaseId || emailsSent || profileAudioPlayedRef.current) return
    if (!['descubre', 'solo', 'losdos'].includes(purchaseType)) return
    profileAudioPlayedRef.current = true
    const playIntro = async () => {
      const staticUrl = `${AUDIO_BASE}/audio/diagnostico/intro-valentina.mp3`
      try {
        const head = await fetch(staticUrl, { method: 'HEAD' })
        if (head.ok) { new Audio(staticUrl).play().catch(() => {}); return }
      } catch {}
      const apiKey = import.meta.env.VITE_ELEVENLABS_API_KEY
      if (!apiKey) return
      if (profileAudioBlobRef.current) {
        new Audio(URL.createObjectURL(profileAudioBlobRef.current)).play().catch(() => {})
        return
      }
      try {
        const res = await fetch('https://api.elevenlabs.io/v1/text-to-speech/EXAVITQu4vr4xnSDxMaL', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json', 'xi-api-key': apiKey },
          body: JSON.stringify({
            text: 'Hola, ya casi terminas. Completa estos datos — te toman solo un segundo y hacen que tu análisis sea completamente personalizado.',
            model_id: 'eleven_multilingual_v2',
            voice_settings: { stability: 0.35, similarity_boost: 0.85, style: 0.3, use_speaker_boost: true }
          })
        })
        if (!res.ok) return
        const blob = await res.blob()
        profileAudioBlobRef.current = blob
        new Audio(URL.createObjectURL(blob)).play().catch(() => {})
      } catch {}
    }
    playIntro()
  }, [purchaseId, purchaseType, emailsSent])

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

    // Play question audio (female = Charlotte MP3, male = male MP3)
    if (uiMode === 'voice' && stage === 'questionnaire') {
      const q = QUESTIONS[currentQuestion]
      if (q) {
        const audioPath = voiceGender === 'male'
          ? `${AUDIO_BASE}/audio/diagnostico/male/${q.id}.mp3`
          : `${AUDIO_BASE}/audio/diagnostico/${q.id}.mp3`
        const audio = new Audio(audioPath)
        audioRef.current = audio
        setAudioPlaying(true)
        audio.onended = () => { setAudioPlaying(false); startRecordingRef.current?.() }
        audio.onerror = () => setAudioPlaying(false)
        audio.play().catch(() => setAudioPlaying(false))
      }
    }
    return () => {
      if (audioRef.current) { audioRef.current.pause(); audioRef.current = null }
    }
  }, [currentQuestion, stage, voiceGender]) // eslint-disable-line react-hooks/exhaustive-deps

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

  // ─── PROMO CODE VALIDATION ─────────────────────────────────
  const LOCAL_PROMO_CODES = {
    'LUISPRO': { discount: 1.0, label: 'Acceso gratuito (código profesional)', appliesTo: ['descubre', 'solo', 'losdos'] }
  }

  const handleApplyPromo = useCallback(async (type) => {
    const code = (cardPromoCodes[type] || '').trim().toUpperCase()
    if (!code) return
    setPromoValidating(type)
    setCardPromoErrors(p => ({ ...p, [type]: '' }))

    // Local validation first (works without API)
    const localPromo = LOCAL_PROMO_CODES[code]
    if (localPromo && localPromo.appliesTo.includes(type)) {
      const prices = { descubre: 499, solo: 499, losdos: 999 }
      const originalPrice = prices[type]
      const finalPrice = localPromo.discount === 1.0 ? 0 : Math.round(originalPrice * (1 - localPromo.discount))
      setCardPromoApplied(p => ({ ...p, [type]: {
        label: localPromo.label,
        discount: localPromo.discount,
        discountPercent: Math.round(localPromo.discount * 100),
        originalPrice,
        finalPrice,
        free: finalPrice === 0
      } }))
      setCardPromoErrors(p => ({ ...p, [type]: '' }))
      setPromoValidating(null)
      return
    }

    // Fallback: validate via API
    try {
      const resp = await fetch(`${API_BASE}/api/validate-radiografia-promo`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ type, promoCode: code })
      })
      const data = await resp.json()
      if (!resp.ok) {
        setCardPromoErrors(p => ({ ...p, [type]: data.error || 'Código no válido' }))
        setCardPromoApplied(p => ({ ...p, [type]: null }))
      } else {
        setCardPromoApplied(p => ({ ...p, [type]: data }))
        setCardPromoErrors(p => ({ ...p, [type]: '' }))
      }
    } catch {
      setCardPromoErrors(p => ({ ...p, [type]: 'Código no válido' }))
    }
    setPromoValidating(null)
  }, [cardPromoCodes])

  const handlePurchase = useCallback(async (type) => {
    if (type === 'demo') {
      setIsDemo(true)
      setPurchaseType('demo')
      setStage('instructions')
      scrollToTop()
      return
    }
    if (type === 'free') {
      // Promo code — full free access → go to premium test
      const freeType = purchasingType || 'solo'
      sessionStorage.setItem('diagnostico_relacional_purchased', 'true')
      sessionStorage.setItem('diagnostico_relacional_type', freeType)
      navigate(`/tienda/radiografia-premium?type=${freeType}&free=true`)
      return
    }
    // Dev/test mode: bypass Stripe entirely → go to premium test
    if (isDevMode) {
      sessionStorage.setItem('diagnostico_relacional_purchased', 'true')
      sessionStorage.setItem('diagnostico_relacional_type', type)
      navigate(`/tienda/radiografia-premium?type=${type}&test=true`)
      return
    }
    // If promo already applied and it's free — go to premium test
    if (cardPromoApplied[type]?.free) {
      sessionStorage.setItem('diagnostico_relacional_purchased', 'true')
      sessionStorage.setItem('diagnostico_relacional_type', type)
      navigate(`/tienda/radiografia-premium?type=${type}&free=true`)
      return
    }
    // Stripe Checkout API — call backend to create session
    setCheckoutLoading(type)
    try {
      const promoCode = cardPromoCodes[type] || ''
      const resp = await fetch(`${API_BASE}/api/create-radiografia-checkout`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ type, promoCode: promoCode.trim() || undefined, testMode: stripeTestMode })
      })
      const data = await resp.json()
      if (!resp.ok) {
        setCardPromoErrors(prev => ({ ...prev, [type]: data.error || 'Error al procesar' }))
        setCheckoutLoading(null)
        return
      }
      if (data.free) {
        // Server confirmed free access → go to premium test
        sessionStorage.setItem('diagnostico_relacional_purchased', 'true')
        sessionStorage.setItem('diagnostico_relacional_type', type)
        navigate(`/tienda/radiografia-premium?type=${type}&free=true`)
        setCheckoutLoading(null)
        return
      }
      // Redirect to Stripe Checkout
      window.location.href = data.url
    } catch {
      setCardPromoErrors(prev => ({ ...prev, [type]: 'Error de conexión' }))
      setCheckoutLoading(null)
    }
  }, [scrollToTop, cardPromoCodes, purchasingType, isDevMode, cardPromoApplied, stripeTestMode])

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

  // No longer pre-fire early — wait for ALL 44 answers to ensure complete analysis
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
      doc.text('Generado a partir de 44 respuestas en 18 bloques psicológicos — 12 dimensiones', pw / 2, y, { align: 'center' }); y += 12

      // Relationship type
      if (aiAnalysis.relationship_type) {
        addTitle('Tipo de Relación')
        doc.setFontSize(11); doc.setTextColor(80, 50, 120)
        doc.text(aiAnalysis.relationship_type.label || '', m, y); y += 7
        addParagraph(aiAnalysis.relationship_type.explanation)
      }

      // Key patterns
      if (aiAnalysis.key_patterns?.length > 0) {
        addTitle('Patrones Clave Detectados')
        for (const pattern of aiAnalysis.key_patterns) {
          checkPage(12); doc.setFontSize(10); doc.setTextColor(80, 50, 120)
          doc.text(`• ${pattern.title} [${pattern.severity}]`, m, y); y += 6
          addParagraph(pattern.description)
        }
      }

      // Composite scores
      if (aiAnalysis.composite_scores) {
        addTitle('Indicadores Compuestos')
        doc.setFontSize(10)
        for (const [key, meta] of Object.entries(COMPOSITE_LABELS)) {
          checkPage(8); const val = aiAnalysis.composite_scores[key] ?? 0
          doc.setTextColor(60, 60, 60); doc.text(`${meta.label}: ${val}%`, m, y); y += 6
        }
        y += 4
      }

      // 12 Dimension scores
      if (aiAnalysis.dimension_scores) {
        addTitle('Radar de 12 Dimensiones')
        doc.setFontSize(10)
        for (const [key, label] of Object.entries(DIMENSION_LABELS)) {
          checkPage(8); const val = aiAnalysis.dimension_scores[key] ?? 0
          doc.setTextColor(60, 60, 60); doc.text(`${label}: ${val}%`, m, y); y += 6
        }
        y += 4
      }

      // Attachment map
      if (aiAnalysis.attachment_map) {
        addTitle('Mapa de Apego')
        doc.setFontSize(10); doc.setTextColor(60, 60, 60)
        doc.text(`Estilo: ${aiAnalysis.attachment_map.style || 'No determinado'}`, m, y); y += 6
        doc.text(`Ansiedad: ${aiAnalysis.attachment_map.anxiety_level ?? 0}%  |  Evitación: ${aiAnalysis.attachment_map.avoidance_level ?? 0}%`, m, y); y += 8
      }

      // Sub-scores
      if (aiAnalysis.sub_scores) {
        addTitle('Desglose por Dimensión')
        doc.setFontSize(10)
        for (const [dimKey, subs] of Object.entries(SUB_SCORE_LABELS)) {
          const dimData = aiAnalysis.sub_scores[dimKey]
          if (!dimData) continue
          checkPage(14); doc.setFontSize(10); doc.setTextColor(80, 50, 120)
          doc.text(DIMENSION_LABELS[dimKey] || dimKey, m, y); y += 6
          for (const [subKey, meta] of Object.entries(subs)) {
            checkPage(8); const val = dimData[subKey] ?? 0
            doc.setTextColor(60, 60, 60); doc.text(`  ${meta.label}: ${val}%`, m, y); y += 5
          }
          y += 3
        }
      }

      // Dimension narratives
      if (aiAnalysis.dimension_narratives) {
        doc.addPage(); y = 20
        doc.setFontSize(15); doc.setTextColor(40, 40, 40)
        doc.text('Análisis por Dimensión', pw / 2, y, { align: 'center' }); y += 12
        for (const [key, text] of Object.entries(aiAnalysis.dimension_narratives)) {
          if (!text) continue
          const label = DIMENSION_LABELS[key] || key
          checkPage(20); doc.setFontSize(11); doc.setTextColor(80, 50, 120)
          doc.text(label, m, y); y += 7
          addParagraph(text)
        }
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
          ['differentiation_profile', 'Perfil de diferenciación']
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
          ['love_languages_analysis', 'Análisis de lenguajes del amor'],
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

      // Future projection
      if (aiAnalysis.future_projection) {
        addTitle('Proyección del Vínculo')
        checkPage(12); doc.setFontSize(10); doc.setTextColor(180, 60, 60)
        doc.text('Si los patrones continúan:', m, y); y += 6
        addParagraph(aiAnalysis.future_projection.if_continues)
        checkPage(12); doc.setFontSize(10); doc.setTextColor(40, 140, 80)
        doc.text('Si deciden trabajarlo:', m, y); y += 6
        addParagraph(aiAnalysis.future_projection.if_changes)
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
      doc.text('Generado a partir de 44 respuestas en 12 dimensiones psicológicas', pw / 2, y, { align: 'center' }); y += 12
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
      const userName = aiAnalysis?.person_info?.name || responses['Q0'] || ''
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
        title="Radiografía de Pareja: 12 Dimensiones Psicológicas Analizadas con IA - Luis Virrueta"
        description="44 preguntas por voz analizadas desde la perspectiva de 12 psicólogos (Bowlby, Gottman, Sternberg). Radar, mapa de apego, triángulo del amor y PDF clínico profesional."
        url="/tienda/diagnostico-relacional"
      />

      <AnimatePresence mode="wait">

        {/* ═══════════════════════════════════════════════════════
            STAGE: HERO — Landing profesional
        ═══════════════════════════════════════════════════════ */}
        {stage === 'hero' && (
          <motion.div key="hero" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="min-h-screen">

            {/* ── HERO — Split layout: texto + video ── */}
            <section className="relative min-h-screen flex items-center overflow-hidden pt-12 pb-16 lg:pt-16 lg:pb-20">
              <div className="absolute inset-0 bg-gradient-to-b from-black via-zinc-950 to-black z-0" />
              <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,rgba(139,92,246,0.06),transparent_60%)] z-[1]" />

              <div className="relative max-w-6xl mx-auto z-10 px-6 lg:px-12 w-full">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-center">
                  {/* Left — Copy */}
                  <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8 }}
                    className="order-2 lg:order-1 text-center lg:text-left">
                    <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-violet-500/20 bg-violet-500/[0.06] mb-6">
                      <Sparkles className="w-3.5 h-3.5 text-violet-400/70" strokeWidth={1.5} />
                      <span className="text-violet-300/70 text-xs font-light uppercase tracking-[0.15em]">Análisis clínico de relaciones</span>
                    </div>
                    <h1 className="text-4xl sm:text-5xl lg:text-6xl font-light text-white leading-[1.1] mb-5"
                      style={{ letterSpacing: '-0.01em', textShadow: '0 0 80px rgba(255,255,255,0.08), 0 10px 40px rgba(168,85,247,0.12)' }}>
                      Radiografía<br />
                      <span className="text-transparent bg-clip-text bg-gradient-to-r from-violet-400 via-fuchsia-400 to-pink-400">de Pareja</span>
                    </h1>
                    <p className="text-lg sm:text-xl text-white/70 font-light leading-relaxed mb-6 italic">
                      "Descubre lo que realmente está ocurriendo en tu relación."
                    </p>

                    {/* Key features with icons */}
                    <div className="space-y-3 mb-6">
                      <div className="flex items-start gap-3">
                        <div className="w-8 h-8 rounded-lg bg-violet-500/10 border border-violet-500/15 flex items-center justify-center flex-shrink-0 mt-0.5">
                          <Eye className="w-4 h-4 text-violet-400/70" strokeWidth={1.5} />
                        </div>
                        <p className="text-base sm:text-lg text-white/70 font-light leading-relaxed">
                          Detecta <strong className="text-white/90 font-medium">patrones invisibles</strong>, dinámicas emocionales y señales tempranas que revelan hacia dónde se dirige tu relación.
                        </p>
                      </div>
                      <div className="flex items-start gap-3">
                        <div className="w-8 h-8 rounded-lg bg-fuchsia-500/10 border border-fuchsia-500/15 flex items-center justify-center flex-shrink-0 mt-0.5">
                          <TrendingUp className="w-4 h-4 text-fuchsia-400/70" strokeWidth={1.5} />
                        </div>
                        <p className="text-base sm:text-lg text-white/70 font-light leading-relaxed">
                          Descubre <strong className="text-transparent bg-clip-text bg-gradient-to-r from-fuchsia-300 to-pink-300 font-medium">si aún estás a tiempo de cambiarlo</strong> — antes de que sea demasiado tarde.
                        </p>
                      </div>
                    </div>

                    <p className="text-white/65 text-base sm:text-lg font-light leading-relaxed mb-5">
                      Nuestro sistema integra <strong className="text-transparent bg-clip-text bg-gradient-to-r from-violet-300 to-fuchsia-300 font-medium">11 de las corrientes más influyentes</strong> de la psicología del amor y analiza tu relación desde múltiples dimensiones simultáneamente para revelar <em className="text-white/85 not-italic font-medium">patrones que los tests convencionales no pueden detectar</em>.
                    </p>

                    {/* Feature pills */}
                    <div className="flex flex-wrap justify-center lg:justify-start gap-2 mb-6">
                      {[
                        { icon: Clock, text: '~25 min' },
                        { icon: Brain, text: '11 corrientes' },
                        { icon: BarChart3, text: 'Gráficas + PDF' },
                        { icon: Shield, text: '100% privado' }
                      ].map((pill, i) => (
                        <span key={i} className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full border border-white/[0.08] bg-white/[0.03] text-white/55 text-xs font-light">
                          <pill.icon className="w-3.5 h-3.5 text-violet-400/60" strokeWidth={1.5} />
                          {pill.text}
                        </span>
                      ))}
                    </div>

                    <p className="text-base text-white/70 font-light leading-relaxed mb-6">
                      <strong className="text-white/90 font-medium">En los próximos 25 minutos</strong> podrás ver con claridad qué está pasando en tu relación.
                    </p>

                    <motion.button
                      onClick={() => { setStage('checkout'); scrollToTop() }}
                      whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}
                      className="px-7 sm:px-10 py-4 sm:py-5 rounded-xl bg-gradient-to-r from-violet-600 to-fuchsia-600 text-white font-light text-base sm:text-lg hover:from-violet-500 hover:to-fuchsia-500 transition-all shadow-lg shadow-violet-600/20 whitespace-nowrap">
                      Comenzar mi radiografía <ArrowRight className="inline w-5 h-5 ml-1.5" />
                    </motion.button>
                    {resumeDraft && (
                      <button onClick={restoreDraft} className="block mt-4 text-violet-300/40 text-sm hover:text-violet-300/70 underline underline-offset-4 transition-colors">
                        Continuar diagnóstico en progreso
                      </button>
                    )}
                  </motion.div>

                  {/* Right — Video */}
                  <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.9, delay: 0.2 }}
                    className="relative order-1 lg:order-2">
                    <div className="rounded-2xl overflow-hidden border border-white/[0.08] shadow-2xl shadow-violet-900/20 relative">
                      <div className="absolute inset-0 rounded-2xl ring-1 ring-inset ring-white/[0.06] z-10 pointer-events-none" />
                      <video autoPlay loop muted playsInline preload="auto"
                        className="w-full aspect-[4/3] object-cover">
                        <source src="/productos/radar de pareja/videos/radiografia.mp4" type="video/mp4" />
                      </video>
                    </div>
                    <div className="absolute -inset-4 bg-gradient-to-r from-violet-600/10 via-fuchsia-600/5 to-transparent rounded-3xl blur-2xl -z-10" />
                    {/* Complementary images — desktop 2×2 */}
                    <div className="hidden lg:grid grid-cols-2 gap-3 mt-4">
                      {[
                        '/productos/radar de pareja/videos/descarga - 2026-03-10T110453.071.jpg',
                        '/productos/radar de pareja/videos/descarga - 2026-03-10T110632.365.jpg',
                        '/productos/radar de pareja/videos/descarga - 2026-03-10T110652.870.jpg',
                        '/productos/radar de pareja/videos/descarga - 2026-03-10T115325.221.jpg'
                      ].map((src, i) => (
                        <div key={i} className="aspect-[16/9] rounded-lg overflow-hidden border border-white/[0.06]">
                          <img src={src} alt="" className="w-full h-full object-cover opacity-60 hover:opacity-80 transition-opacity" loading="lazy" />
                        </div>
                      ))}
                    </div>
                  </motion.div>
                  {/* Complementary images — mobile 2×2 */}
                  <div className="order-3 lg:hidden grid grid-cols-2 gap-2">
                    {[
                      '/productos/radar de pareja/videos/descarga - 2026-03-10T110453.071.jpg',
                      '/productos/radar de pareja/videos/descarga - 2026-03-10T110632.365.jpg',
                      '/productos/radar de pareja/videos/descarga - 2026-03-10T110652.870.jpg',
                      '/productos/radar de pareja/videos/descarga - 2026-03-10T115325.221.jpg'
                    ].map((src, i) => (
                      <div key={i} className="aspect-[16/9] rounded-lg overflow-hidden border border-white/[0.06]">
                        <img src={src} alt="" className="w-full h-full object-cover opacity-60" loading="lazy" />
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </section>

            {/* Section separator */}
            <div className="relative z-10 py-8 lg:py-12">
              <div className="max-w-6xl mx-auto px-6 lg:px-12">
                <div className="h-px bg-gradient-to-r from-transparent via-violet-500/15 to-transparent" />
              </div>
            </div>

            <div className="relative z-10 px-6 lg:px-12">
              <div className="max-w-6xl mx-auto space-y-24 lg:space-y-32">

              {/* ═══════════════════════════════════════════════════════
                  SECTION 1: LAS 12 DIMENSIONES PSICOLÓGICAS
              ═══════════════════════════════════════════════════════ */}
              <motion.div initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
                {/* Intro */}
                <div className="text-center mb-12">
                  <p className="text-white/50 text-sm uppercase tracking-[0.2em] mb-3">Nuestro sistema de análisis</p>
                  <h2 className="text-2xl sm:text-3xl lg:text-4xl font-light text-white/90 mb-5 leading-snug">
                    Las 11 corrientes psicológicas<br />que analizan tu relación
                  </h2>
                  <p className="text-white/60 text-lg font-light max-w-2xl mx-auto leading-relaxed">
                    La mayoría de las parejas <strong className="text-white/80 font-medium">nunca logra ver estos patrones</strong> hasta que el problema ya es evidente. Este análisis permite <strong className="text-white/80 font-medium">identificarlos antes</strong>.
                  </p>
                </div>

                {/* Top photos — 3 horizontal images */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mb-12">
                  {[
                    '/productos/radar de pareja/imagenes 12 psicologos/1a338099-8fd4-47e8-a4a5-086b916fd2a2.jpg',
                    '/productos/radar de pareja/imagenes 12 psicologos/2c970695-4438-4cc2-9a03-8086654f7008.jpg',
                    '/productos/radar de pareja/imagenes 12 psicologos/374629a4-00e3-40ba-8898-83748eab483e.jpg'
                  ].map((src, i) => (
                    <motion.div key={i} initial={{ opacity: 0, y: 12 }} whileInView={{ opacity: 1, y: 0 }}
                      viewport={{ once: true }} transition={{ delay: i * 0.08 }}
                      className="aspect-[16/9] sm:aspect-[16/9] rounded-xl overflow-hidden border border-white/[0.06] max-h-48 sm:max-h-none">
                      <img src={src} alt="" className="w-full h-full object-cover opacity-70 hover:opacity-85 transition-opacity" loading="lazy" />
                    </motion.div>
                  ))}
                </div>

                {/* Algorithm quote — prominent */}
                <div className="max-w-4xl mx-auto mb-14">
                  <div className="p-8 lg:p-10 rounded-2xl border border-violet-500/15 bg-gradient-to-br from-violet-500/[0.05] to-fuchsia-500/[0.02] relative overflow-hidden">
                    <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-violet-500/30 via-fuchsia-500/20 to-transparent" />
                    <div className="flex items-start gap-4">
                      <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-violet-500/15 to-fuchsia-500/10 border border-violet-500/20 flex items-center justify-center flex-shrink-0">
                        <Brain className="w-6 h-6 text-violet-400/60" strokeWidth={1.5} />
                      </div>
                      <div>
                        <p className="text-white/35 text-xs uppercase tracking-[0.2em] mb-3">Cómo funciona</p>
                        <p className="text-white/70 text-lg lg:text-xl font-light leading-relaxed">
                          "Nuestro algoritmo correlaciona los <strong className="text-white/90 font-medium">11 modelos psicológicos más influyentes</strong> en el estudio del amor, analizando múltiples dimensiones del vínculo para revelar <strong className="text-white/90 font-medium">patrones profundos</strong> que normalmente permanecen invisibles."
                        </p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* 12 Psychologists table — with icons & bigger text */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
                  {[
                    { name: '1. John Gottman', icon: Hourglass, desc: 'Detecta los patrones de interacción que predicen si una relación se fortalece o se deteriora con el tiempo.', color: 'border-rose-500/15 bg-rose-500/[0.03]', nameColor: 'text-rose-300/75', iconColor: 'text-rose-400/50' },
                    { name: '2. Sue Johnson', icon: HeartHandshake, desc: 'Analiza el nivel real de conexión emocional y seguridad afectiva entre ambos.', color: 'border-blue-500/15 bg-blue-500/[0.03]', nameColor: 'text-blue-300/75', iconColor: 'text-blue-400/50' },
                    { name: '3. Esther Perel', icon: Flame, desc: 'Evalúa el equilibrio entre cercanía, deseo y autonomía dentro de la relación.', color: 'border-amber-500/15 bg-amber-500/[0.03]', nameColor: 'text-amber-300/75', iconColor: 'text-amber-400/50' },
                    { name: '4. Amir Levine', icon: Link2, desc: 'Identifica los estilos de apego que influyen en cómo cada uno ama, se acerca o se distancia.', color: 'border-emerald-500/15 bg-emerald-500/[0.03]', nameColor: 'text-emerald-300/75', iconColor: 'text-emerald-400/50' },
                    { name: '5. Harville Hendrix', icon: Fingerprint, desc: 'Explora cómo las heridas emocionales del pasado influyen en la elección de pareja y los ciclos repetitivos.', color: 'border-purple-500/15 bg-purple-500/[0.03]', nameColor: 'text-purple-300/75', iconColor: 'text-purple-400/50' },
                    { name: '6. Stan Tatkin', icon: Puzzle, desc: 'Analiza el grado de sincronía emocional y cooperación dentro del vínculo.', color: 'border-cyan-500/15 bg-cyan-500/[0.03]', nameColor: 'text-cyan-300/75', iconColor: 'text-cyan-400/50' },
                    { name: '7. Gary Chapman', icon: MessageSquare, desc: 'Identifica cómo cada persona expresa y necesita recibir amor.', color: 'border-pink-500/15 bg-pink-500/[0.03]', nameColor: 'text-pink-300/75', iconColor: 'text-pink-400/50' },
                    { name: '8. Robert Sternberg', icon: Triangle, desc: 'Evalúa el equilibrio entre intimidad, pasión y compromiso.', color: 'border-red-500/15 bg-red-500/[0.03]', nameColor: 'text-red-300/75', iconColor: 'text-red-400/50' },
                    { name: '9. David Schnarch', icon: ScanEye, desc: 'Analiza el nivel de madurez emocional y diferenciación dentro de la pareja.', color: 'border-teal-500/15 bg-teal-500/[0.03]', nameColor: 'text-teal-300/75', iconColor: 'text-teal-400/50' },
                    { name: '10. Terrence Real', icon: Scale, desc: 'Detecta dinámicas de poder, roles ocultos y conflictos emocionales no resueltos.', color: 'border-orange-500/15 bg-orange-500/[0.03]', nameColor: 'text-orange-300/75', iconColor: 'text-orange-400/50' },
                    { name: '11. Psicoanálisis', icon: Brain, desc: 'Explora los patrones inconscientes, fantasmas relacionales y lo no dicho que opera en el vínculo.', color: 'border-violet-500/15 bg-violet-500/[0.03]', nameColor: 'text-violet-300/75', iconColor: 'text-violet-400/50' }
                  ].map((p, i) => (
                    <motion.div key={i} initial={{ opacity: 0, y: 12 }} whileInView={{ opacity: 1, y: 0 }}
                      viewport={{ once: true }} transition={{ delay: i * 0.04 }}
                      className={`rounded-xl border ${p.color} hover:bg-white/[0.04] transition-colors overflow-hidden`}>
                      <div className={`px-5 py-3 flex items-center justify-center sm:justify-start gap-3 border-b ${p.color.split(' ')[0]}`} style={{ background: `linear-gradient(135deg, ${p.color.includes('rose') ? 'rgba(244,63,94,0.06)' : p.color.includes('blue') ? 'rgba(59,130,246,0.06)' : p.color.includes('amber') ? 'rgba(245,158,11,0.06)' : p.color.includes('emerald') ? 'rgba(16,185,129,0.06)' : p.color.includes('purple') ? 'rgba(168,85,247,0.06)' : p.color.includes('cyan') ? 'rgba(6,182,212,0.06)' : p.color.includes('pink') ? 'rgba(236,72,153,0.06)' : p.color.includes('red') ? 'rgba(239,68,68,0.06)' : p.color.includes('teal') ? 'rgba(20,184,166,0.06)' : p.color.includes('orange') ? 'rgba(249,115,22,0.06)' : p.color.includes('violet') ? 'rgba(139,92,246,0.06)' : 'rgba(217,70,239,0.06)'}, transparent)` }}>
                        <div className="w-8 h-8 rounded-lg bg-white/[0.06] border border-white/[0.08] flex items-center justify-center flex-shrink-0">
                          <p.icon className={`w-4 h-4 ${p.iconColor}`} strokeWidth={1.5} />
                        </div>
                        <p className={`${p.nameColor} text-base font-medium`}>{p.name}</p>
                      </div>
                      <div className="px-5 py-4">
                        <p className="text-white/60 text-base font-light leading-relaxed text-center sm:text-left">{p.desc}</p>
                      </div>
                    </motion.div>
                  ))}
                </div>

                {/* Closing statement — emphasized */}
                <div className="mt-14 mb-14">
                  <div className="max-w-3xl mx-auto text-center">
                    <div className="h-px bg-gradient-to-r from-transparent via-violet-500/20 to-transparent mb-8" />
                    <p className="text-white/70 text-xl lg:text-2xl font-light leading-relaxed">
                      Cuando estas dimensiones se analizan juntas, es posible ver<br className="hidden sm:inline" /> <strong className="text-transparent bg-clip-text bg-gradient-to-r from-violet-400 to-fuchsia-400 font-medium">la arquitectura real de una relación.</strong>
                    </p>
                    <div className="h-px bg-gradient-to-r from-transparent via-violet-500/20 to-transparent mt-8" />
                  </div>
                </div>

                {/* Bottom photos — 4 horizontal images */}
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
                  {[
                    '/productos/radar de pareja/imagenes 12 psicologos/1eedb718-c8fe-4cbc-a33a-10cecad714fe.jpg',
                    '/productos/radar de pareja/imagenes 12 psicologos/descarga - 2026-03-10T121820.168.jpg',
                    '/productos/radar de pareja/imagenes 12 psicologos/f101da9f-0f74-4afc-bc07-2ae275384bbd.jpg',
                    '/productos/radar de pareja/imagenes 12 psicologos/fada3a35-4083-451d-939f-bf6f60a721d4.jpg'
                  ].map((src, i) => (
                    <motion.div key={i} initial={{ opacity: 0, y: 12 }} whileInView={{ opacity: 1, y: 0 }}
                      viewport={{ once: true }} transition={{ delay: i * 0.08 }}
                      className="aspect-[16/9] rounded-xl overflow-hidden border border-white/[0.06]">
                      <img src={src} alt="" className="w-full h-full object-cover opacity-65 hover:opacity-85 transition-opacity" loading="lazy" />
                    </motion.div>
                  ))}
                </div>
              </motion.div>

              {/* ═══════════════════════════════════════════════════════
                  SECTION 2: QUIÉN ESTÁ DETRÁS — Luis Virrueta (Autoridad)
              ═══════════════════════════════════════════════════════ */}
              <motion.div initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
                className="relative">
                <div className="p-8 lg:p-12 rounded-2xl border border-white/[0.08] bg-gradient-to-br from-violet-500/[0.03] to-transparent relative overflow-hidden">
                  <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-violet-500/30 via-fuchsia-500/30 to-pink-500/30" />
                  <div className="grid grid-cols-1 lg:grid-cols-[240px_1fr] gap-8 lg:gap-12 items-center">
                    <div className="mx-auto lg:mx-0">
                      <div className="w-48 h-48 lg:w-56 lg:h-56 rounded-2xl overflow-hidden border border-white/10 shadow-2xl shadow-violet-900/20">
                        <img src="/luxmania perfil.webp" alt="Luis Virrueta — Psicólogo clínico" className="w-full h-full object-cover" loading="lazy" />
                      </div>
                    </div>
                    <div className="text-center lg:text-left">
                      <p className="text-white/40 text-sm uppercase tracking-[0.2em] mb-2">El creador</p>
                      <h2 className="text-2xl lg:text-3xl font-light text-white mb-2">Luis Virrueta</h2>
                      <p className="text-violet-300/60 text-sm font-light tracking-wider uppercase mb-5">Psicólogo · Psicoanalista · Filósofo</p>
                      <p className="text-white/65 text-base font-light leading-relaxed mb-5">
                        <Target className="inline w-4 h-4 text-violet-400/60 mr-1 -mt-0.5" strokeWidth={1.5} />
                        Después de más de 10 años trabajando con parejas, diseñé un sistema que analiza tu relación desde la perspectiva de <strong className="text-transparent bg-clip-text bg-gradient-to-r from-violet-300 to-fuchsia-300 font-medium">los 11 psicólogos y escuelas más influyentes en relaciones de pareja</strong>. Los cuestionarios convencionales miden síntomas — este <em className="text-white/80">encuentra las causas</em>.
                      </p>
                      <p className="text-white/55 text-base font-light leading-relaxed mb-6">
                        <Eye className="inline w-4 h-4 text-fuchsia-400/60 mr-1 -mt-0.5" strokeWidth={1.5} />
                        El sistema cruza tus respuestas con las teorías de <strong className="text-white/70 font-medium">Bowlby</strong> (apego), <strong className="text-white/70 font-medium">Gottman</strong> (conflicto), <strong className="text-white/70 font-medium">Sternberg</strong> (amor), <strong className="text-white/70 font-medium">Perel</strong> (deseo), <strong className="text-white/70 font-medium">Johnson</strong> (conexión emocional) y <strong className="text-white/70 font-medium">7 especialistas más</strong> — <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-300 to-orange-300 font-medium">los referentes que realmente explican cómo funcionan las relaciones humanas</span>. No existe otro diagnóstico que haga esto.
                      </p>
                      <div className="flex flex-wrap justify-center lg:justify-start gap-3">
                        {[
                          { icon: Brain, text: 'Método AION©' },
                          { icon: Users, text: '11 corrientes referentes' },
                          { icon: Activity, text: '12 dimensiones simultáneas' }
                        ].map((tag, i) => (
                          <span key={i} className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full border border-violet-500/15 bg-violet-500/[0.06] text-violet-300/60 text-xs font-light">
                            <tag.icon className="w-3 h-3" strokeWidth={1.5} />
                            {tag.text}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>

              {/* CTA after Luis section */}
              <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
                className="text-center">
                <motion.button
                  onClick={() => { setStage('checkout'); scrollToTop() }}
                  whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}
                  className="px-8 sm:px-10 py-4 sm:py-5 rounded-xl bg-gradient-to-r from-violet-600 to-fuchsia-600 text-white font-light text-base sm:text-lg hover:from-violet-500 hover:to-fuchsia-500 transition-all shadow-lg shadow-violet-600/20 whitespace-nowrap">
                  Comenzar mi radiografía <ArrowRight className="inline w-5 h-5 ml-1.5" />
                </motion.button>
                <p className="text-white/30 text-xs font-light mt-3">44 preguntas · 12 dimensiones · 11 corrientes · Reporte descargable</p>
              </motion.div>

              {/* ═══════════════════════════════════════════════════════
                  SECTION 3: TESTIMONIOS
              ═══════════════════════════════════════════════════════ */}
              <motion.div initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
                <div className="text-center mb-10">
                  <p className="text-white/50 text-sm uppercase tracking-[0.2em] mb-2">Testimonios</p>
                  <h2 className="text-2xl lg:text-3xl font-light text-white/80 mb-4">Lo que dicen quienes ya lo vivieron</h2>
                  <p className="text-white/50 text-base font-light max-w-2xl mx-auto leading-relaxed">
                    Personas solteras que quieren entender sus patrones y parejas que buscan claridad descubren aquí lo que nunca habían logrado ver.<br />
                    Después del análisis, muchos deciden tomar una consulta para trabajar de forma más clara en lo que el diagnóstico revela.
                  </p>
                </div>
                <div className="hidden sm:grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
                  {[
                    { name: 'Valentina C.', initials: 'V', detail: '27 años · Individual', bg: 'from-pink-500/30 to-rose-500/20', text: 'Llevaba tres relaciones seguidas con el mismo tipo de persona: alguien emocionalmente no disponible.\nHice la radiografía individual y por primera vez vi el patrón con nombre: apego ansioso, búsqueda de validación, confusión entre intensidad e intimidad.\nTener el mapa escrito cambia algo. Ya no puedo decir que no lo sabía.' },
                    { name: 'Diego M.', initials: 'D', detail: '34 años · Individual', bg: 'from-amber-500/30 to-orange-500/20', text: 'Siempre encontraba alguna razón para terminar las cosas justo cuando se ponían bien.\nEl análisis individual lo llamó por su nombre: patrón evitativo, índice del 74%. Lo explicó desde cuatro corrientes distintas.\nFue incómodo leerlo. También fue lo más útil que he hecho por mí mismo en mucho tiempo.' },
                    { name: 'Mariana F.', initials: 'M', detail: '31 años · Pareja Solo', bg: 'from-violet-500/30 to-purple-500/20', text: 'Mi pareja no quería hacer ningún test. Hice la radiografía desde la modalidad “solo tú”.\nEl reporte describió nuestra dinámica con una precisión que me dejó sin palabras — ciclo de persecución y retirada, distancia emocional creciente.\nHubo partes que pude mostrarle como descripción, no como acusación. Eso abrió una conversación que llevábamos meses evitando.' },
                    { name: 'Rebeca S.', initials: 'R', detail: '29 años · Pareja Solo', bg: 'from-fuchsia-500/30 to-pink-500/20', text: 'Sabía que algo estaba pasando, pero mi pareja decía que todo estaba bien.\nHice la radiografía sola y el análisis fue claro: señales de conflicto evitado, distancia emocional creciente, patrones de Gottman que yo no había sabido nombrar.\nNo lo resolvió todo — pero me dio exactamente lo que necesitaba: claridad para tomar una decisión informada.' },
                    { name: 'Fernanda y Luis', initials: 'FL', detail: '8 años juntos · Los dos', bg: 'from-blue-500/30 to-cyan-500/20', text: 'Hicimos el test por separado, sin ver las respuestas del otro.\nEl reporte cruzado lo nombró mejor de lo que nosotros pudimos: persecución-retirada. Ella busca cercanía, él se cierra. Llevábamos años en ese ciclo sin nombre para esto.\nDespués tomamos una consulta de pareja con Luis y fue la primera vez que hablamos del tema sin que se convirtiera en pelea.' },
                    { name: 'Carlos y Sofía', initials: 'CS', detail: '2 años juntos · Los dos', bg: 'from-emerald-500/30 to-teal-500/20', text: 'Decidimos hacer el test antes de mudarnos juntos. Cada uno contestó por separado.\nEl reporte cruzado mostró una brecha en el componente de compromiso que los dos minimizábamos sin darnos cuenta.\nNo fue alarmante — sí fue honesto. Lo trabajamos antes de que se convirtiera en un problema real.' }
                  ].map((t, i) => (
                    <motion.div key={i} initial={{ opacity: 0, y: 15 }} whileInView={{ opacity: 1, y: 0 }}
                      viewport={{ once: true }} transition={{ delay: i * 0.06 }}
                      className="p-6 rounded-2xl border border-white/[0.08] bg-white/[0.02] hover:bg-white/[0.04] transition-colors">
                      <div className="flex items-center gap-3 mb-3">
                        <div className={`w-10 h-10 rounded-full bg-gradient-to-br ${t.bg} flex items-center justify-center`}>
                          <span className="text-white/80 text-xs font-medium">{t.initials}</span>
                        </div>
                        <div className="text-center sm:text-left">
                          <p className="text-white/75 text-sm font-medium">{t.name}</p>
                          <span className="text-white/25 text-xs font-light">{t.detail}</span>
                        </div>
                      </div>
                      <div className="flex justify-center sm:justify-start gap-0.5 mb-3">
                        {Array.from({ length: 5 }).map((_, j) => (
                          <Star key={j} className="w-3.5 h-3.5 text-amber-400/80 fill-amber-400/80" />
                        ))}
                      </div>
                      <p className="text-white/55 text-sm font-light leading-relaxed whitespace-pre-line text-center sm:text-left">"{t.text}"</p>
                    </motion.div>
                  ))}
                </div>
                {/* Mobile: swipeable carousel with arrows + dots */}
                <div className="sm:hidden">
                  <div className="relative">
                    {testimonialIdx > 0 && (
                      <button
                        onClick={() => {
                          const next = testimonialIdx - 1
                          setTestimonialIdx(next)
                          if (testimonialRef.current) {
                            testimonialRef.current.scrollTo({ left: next * (testimonialRef.current.scrollWidth / 6), behavior: 'smooth' })
                          }
                        }}
                        className="absolute left-1 top-1/2 -translate-y-1/2 z-10 w-9 h-9 flex items-center justify-center rounded-full bg-black/60 border border-white/20 text-white backdrop-blur-sm shadow-lg"
                      >
                        <ChevronLeft className="w-4 h-4" strokeWidth={2} />
                      </button>
                    )}
                    {testimonialIdx < 5 && (
                      <button
                        onClick={() => {
                          const next = testimonialIdx + 1
                          setTestimonialIdx(next)
                          if (testimonialRef.current) {
                            testimonialRef.current.scrollTo({ left: next * (testimonialRef.current.scrollWidth / 6), behavior: 'smooth' })
                          }
                        }}
                        className="absolute right-1 top-1/2 -translate-y-1/2 z-10 w-9 h-9 flex items-center justify-center rounded-full bg-black/60 border border-white/20 text-white backdrop-blur-sm shadow-lg"
                      >
                        <ChevronRight className="w-4 h-4" strokeWidth={2} />
                      </button>
                    )}
                    <div
                      ref={testimonialRef}
                      onScroll={(e) => {
                        const el = e.currentTarget
                        setTestimonialIdx(Math.min(5, Math.round(el.scrollLeft / (el.scrollWidth / 6))))
                      }}
                      className="flex overflow-x-auto snap-x snap-mandatory gap-4 pb-4 -mx-2 px-2 scrollbar-hide"
                      style={{ WebkitOverflowScrolling: 'touch' }}
                    >
                      {[
                        { name: 'Valentina C.', initials: 'V', detail: '27 años · Individual', bg: 'from-pink-500/30 to-rose-500/20', text: 'Llevaba tres relaciones seguidas con el mismo tipo de persona: alguien emocionalmente no disponible.\nHice la radiografía individual y por primera vez vi el patrón con nombre: apego ansioso, búsqueda de validación, confusión entre intensidad e intimidad.\nTener el mapa escrito cambia algo. Ya no puedo decir que no lo sabía.' },
                        { name: 'Diego M.', initials: 'D', detail: '34 años · Individual', bg: 'from-amber-500/30 to-orange-500/20', text: 'Siempre encontraba alguna razón para terminar las cosas justo cuando se ponían bien.\nEl análisis individual lo llamó por su nombre: patrón evitativo, índice del 74%. Lo explicó desde cuatro corrientes distintas.\nFue incómodo leerlo. También fue lo más útil que he hecho por mí mismo en mucho tiempo.' },
                        { name: 'Mariana F.', initials: 'M', detail: '31 años · Pareja Solo', bg: 'from-violet-500/30 to-purple-500/20', text: 'Mi pareja no quería hacer ningún test. Hice la radiografía desde la modalidad “solo tú”.\nEl reporte describió nuestra dinámica con una precisión que me dejó sin palabras — ciclo de persecución y retirada, distancia emocional creciente.\nHubo partes que pude mostrarle como descripción, no como acusación. Eso abrió una conversación que llevábamos meses evitando.' },
                        { name: 'Rebeca S.', initials: 'R', detail: '29 años · Pareja Solo', bg: 'from-fuchsia-500/30 to-pink-500/20', text: 'Sabía que algo estaba pasando, pero mi pareja decía que todo estaba bien.\nHice la radiografía sola y el análisis fue claro: señales de conflicto evitado, distancia emocional creciente, patrones de Gottman que yo no había sabido nombrar.\nNo lo resolvió todo — pero me dio exactamente lo que necesitaba: claridad para tomar una decisión informada.' },
                        { name: 'Fernanda y Luis', initials: 'FL', detail: '8 años juntos · Los dos', bg: 'from-blue-500/30 to-cyan-500/20', text: 'Hicimos el test por separado, sin ver las respuestas del otro.\nEl reporte cruzado lo nombró mejor de lo que nosotros pudimos: persecución-retirada. Ella busca cercanía, él se cierra. Llevábamos años en ese ciclo sin nombre para esto.\nDespués tomamos una consulta de pareja con Luis y fue la primera vez que hablamos del tema sin que se convirtiera en pelea.' },
                        { name: 'Carlos y Sofía', initials: 'CS', detail: '2 años juntos · Los dos', bg: 'from-emerald-500/30 to-teal-500/20', text: 'Decidimos hacer el test antes de mudarnos juntos. Cada uno contestó por separado.\nEl reporte cruzado mostró una brecha en el componente de compromiso que los dos minimizábamos sin darnos cuenta.\nNo fue alarmante — sí fue honesto. Lo trabajamos antes de que se convirtiera en un problema real.' }
                      ].map((t, i) => (
                        <div key={i} className="flex-shrink-0 w-[85vw] snap-center p-6 rounded-2xl border border-white/[0.08] bg-white/[0.02]">
                          <div className="flex items-center gap-3 mb-3">
                            <div className={`w-10 h-10 rounded-full bg-gradient-to-br ${t.bg} flex items-center justify-center`}>
                              <span className="text-white/80 text-xs font-medium">{t.initials}</span>
                            </div>
                            <div className="text-left">
                              <p className="text-white/75 text-sm font-medium">{t.name}</p>
                              <span className="text-white/25 text-xs font-light">{t.detail}</span>
                            </div>
                          </div>
                          <div className="flex justify-start gap-0.5 mb-3">
                            {Array.from({ length: 5 }).map((_, j) => (
                              <Star key={j} className="w-3.5 h-3.5 text-amber-400/80 fill-amber-400/80" />
                            ))}
                          </div>
                          <p className="text-white/55 text-sm font-light leading-relaxed whitespace-pre-line text-left">"{t.text}"</p>
                        </div>
                      ))}
                    </div>
                  </div>
                  {/* Dots */}
                  <div className="flex justify-center gap-2 mt-3">
                    {[0,1,2,3,4,5].map(i => (
                      <button
                        key={i}
                        onClick={() => {
                          setTestimonialIdx(i)
                          if (testimonialRef.current) {
                            testimonialRef.current.scrollTo({ left: i * (testimonialRef.current.scrollWidth / 6), behavior: 'smooth' })
                          }
                        }}
                        className={`rounded-full transition-all duration-300 ${
                          i === testimonialIdx ? 'w-5 h-1.5 bg-violet-400' : 'w-1.5 h-1.5 bg-white/25'
                        }`}
                      />
                    ))}
                  </div>
                </div>
                <p className="text-center text-white/45 text-base font-light italic mt-10 max-w-2xl mx-auto leading-relaxed">
                  "A veces la diferencia entre una relación que se desgasta y una que se transforma es simplemente entender qué está pasando realmente."
                </p>
              </motion.div>

              {/* ═══════════════════════════════════════════════════════
                  SECTION 5: Muestra del reporte — Sofía y Mateo
              ═══════════════════════════════════════════════════════ */}
              <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
                className="py-16">
                <div className="max-w-4xl mx-auto rounded-3xl border border-violet-500/20 bg-gradient-to-br from-violet-500/[0.08] via-[#0b0b14] to-cyan-500/[0.05] p-8 lg:p-10 text-center space-y-6 shadow-2xl shadow-violet-900/20">
                  <p className="text-violet-300/65 text-[11px] font-semibold uppercase tracking-[0.3em]">Demostracion del reporte final</p>
                  <h3 className="text-3xl lg:text-4xl font-light text-white">Mira como se entrega tu analisis</h3>
                  <p className="text-white/55 text-base lg:text-lg font-light max-w-2xl mx-auto">Vista real del formato final: portada, interpretacion clinica, graficas y recomendaciones personalizadas.</p>
                  <div className="flex flex-wrap items-center justify-center gap-2.5 text-[11px] text-white/45 font-light">
                    <span className="px-3 py-1 rounded-full border border-white/10 bg-white/[0.02]">Portada profesional</span>
                    <span className="px-3 py-1 rounded-full border border-white/10 bg-white/[0.02]">11 perspectivas psicologicas</span>
                    <span className="px-3 py-1 rounded-full border border-white/10 bg-white/[0.02]">Graficas + recomendaciones</span>
                  </div>
                  <motion.button
                    onClick={openReportSample}
                    whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.98 }}
                    className="inline-flex items-center gap-2 px-7 py-3.5 rounded-xl bg-gradient-to-r from-violet-600 to-fuchsia-600 text-white font-medium text-sm hover:from-violet-500 hover:to-fuchsia-500 transition-all shadow-lg shadow-violet-600/30">
                    <Eye className="w-4 h-4" strokeWidth={1.6} />
                    Ver demostracion del reporte
                  </motion.button>
                </div>
              </motion.div>

              {/* ═══════════════════════════════════════════════════════
                  SECTION 7: PRICING — Con copy de 12 psicólogos + garantía
              ═══════════════════════════════════════════════════════ */}
              <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
                className="text-center pb-20">
                <div className="max-w-4xl mx-auto mb-10 p-6 lg:p-8 rounded-2xl border border-violet-500/20 bg-gradient-to-r from-violet-600/[0.16] via-fuchsia-600/[0.12] to-cyan-600/[0.10]">
                  <p className="text-violet-200/80 text-sm uppercase tracking-[0.15em] mb-3">Elige tu radiografía</p>
                  <h2 className="text-3xl lg:text-4xl font-light text-white mb-3">¿Qué tipo de radiografía necesitas hoy?</h2>
                  <p className="text-white/80 text-lg font-light mb-2 max-w-2xl mx-auto">La respuesta a por qué amas como amas: descubre tus patrones inconscientes y qué está pasando realmente en tu vínculo.</p>
                  <p className="text-white/65 text-base font-light max-w-2xl mx-auto">Elige modalidad individual, pareja solo o los dos, y recibe un reporte claro para tomar decisiones con certeza.</p>
                </div>

                <div className="hidden sm:grid sm:grid-cols-3 gap-5 max-w-4xl mx-auto">
                  {/* Radiografía de tu forma de amar */}
                  <div className="rounded-2xl border border-white/[0.1] bg-zinc-950/60 text-left overflow-hidden">
                    <div className="py-4 px-8 bg-gradient-to-br from-amber-400 to-orange-500 min-h-[90px] flex flex-col justify-center">
                      <div className="flex items-center gap-2 mb-1.5">
                        <p className="text-zinc-900 text-xs uppercase tracking-[0.15em] font-bold">Individual — Sin pareja</p>
                        <span className="text-[9px] px-2 py-0.5 rounded-full bg-black/15 text-zinc-900 font-semibold">1 reporte</span>
                      </div>
                      <p className="text-zinc-900 text-sm font-bold leading-snug">Empieza por ti:<br/>entiende tu forma de amar.</p>
                    </div>
                    <div className="p-8 pt-5">
                    <p className="text-fuchsia-300/70 text-sm font-medium mb-3 hidden">x</p>
                    <div className="flex items-baseline gap-2 mb-1">
                      <span className="text-white/30 text-lg line-through">$999</span>
                      <p className="text-3xl font-light text-white">${PRODUCT_PRICE_DESCUBRE} <span className="text-lg text-white/35">MXN</span></p>
                    </div>
                    <p className="text-emerald-400/60 text-xs font-medium mb-1">-50% por lanzamiento</p>
                    <p className="text-white/65 text-sm font-light mb-5">Tu mapa de patrones amorosos · No necesitas tener pareja</p>
                    <ul className="space-y-2 mb-6">
                      {['Descubre por qué eliges siempre el mismo tipo de pareja', 'Mapa de tu estilo de apego y mecanismos de defensa', 'Radiografía de tus patrones inconscientes al amar', '40 preguntas guiadas por voz con IA', 'Análisis de 11 corrientes psicológicas sobre ti', 'Reporte PDF con gráficas y análisis descargable'].map((item, i) => (
                        <li key={i} className="flex items-start gap-2 text-white/65 text-sm font-light">
                          <Check className="w-3.5 h-3.5 text-violet-400/60 flex-shrink-0 mt-0.5" strokeWidth={2} />
                          {item}
                        </li>
                      ))}
                    </ul>
                    <motion.button
                      onClick={() => { setStage('checkout'); scrollToTop() }}
                      whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}
                      className="w-full py-4 rounded-xl bg-gradient-to-r from-amber-400 to-orange-500 text-zinc-900 font-semibold text-base hover:from-amber-300 hover:to-orange-400 transition-all shadow-lg shadow-amber-600/20">
                      Descubrir mi patrón
                    </motion.button>
                    </div>
                  </div>
                  {/* Radiografía de tu relación */}
                  <div>
                  <div className="rounded-2xl border border-violet-500/25 bg-gradient-to-br from-violet-500/[0.04] to-fuchsia-500/[0.02] text-left overflow-hidden">
                    <div className="py-4 px-8 bg-gradient-to-br from-violet-600 to-fuchsia-600 min-h-[90px] flex flex-col justify-center">
                      <div className="flex items-center gap-2 mb-1.5">
                        <p className="text-white text-xs uppercase tracking-[0.15em] font-bold">Pareja — Respondes tú</p>
                        <span className="text-[9px] px-2 py-0.5 rounded-full bg-white/20 text-white font-semibold">1 reporte</span>
                      </div>
                      <p className="text-white text-sm font-bold leading-snug">Tienes pareja, pero tú haces<br/>todo el análisis.</p>
                    </div>
                    <div className="p-8 pt-5">
                    <div className="flex items-baseline gap-2 mb-1">
                      <span className="text-white/30 text-lg line-through">$999</span>
                      <p className="text-3xl font-light text-white">${PRODUCT_PRICE_SOLO} <span className="text-lg text-white/35">MXN</span></p>
                    </div>
                    <p className="text-emerald-400/60 text-xs font-medium mb-1">-50% por lanzamiento</p>
                    <p className="text-white/65 text-sm font-light mb-5">Tú contestas · Análisis profundo de lo que está pasando en tu relación</p>
                    <ul className="space-y-2 mb-6">
                      {['Entiende qué dinámicas invisibles están desgastando tu relación', '40 preguntas guiadas por voz — tú contestas solo/a', 'Análisis de 11 corrientes psicológicas sobre tu caso', 'Diagnóstico de hacia dónde va tu relación si nada cambia', 'Autoanálisis: qué proyectas, qué repites, qué evitas', 'Reporte PDF profesional con radar y gráficas'].map((item, i) => (
                        <li key={i} className="flex items-start gap-2 text-white/65 text-sm font-light">
                          <Check className="w-3.5 h-3.5 text-violet-400/60 flex-shrink-0 mt-0.5" strokeWidth={2} />
                          {item}
                        </li>
                      ))}
                    </ul>
                    <motion.button
                      onClick={() => { setStage('checkout'); scrollToTop() }}
                      whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}
                      className="w-full py-4 rounded-xl bg-gradient-to-r from-violet-600 to-fuchsia-600 text-white font-light text-base hover:from-violet-500 hover:to-fuchsia-500 transition-all shadow-lg shadow-violet-600/20">
                      Radiografiar mi relación
                    </motion.button>
                    </div>
                  </div>
                  </div>
                  {/* Radiografía cruzada de pareja */}
                  <div className="rounded-2xl border border-cyan-500/25 bg-gradient-to-br from-cyan-500/[0.04] to-blue-500/[0.02] text-left overflow-hidden">
                    <div className="py-4 px-8 bg-gradient-to-br from-blue-500 to-cyan-500 min-h-[90px] flex flex-col justify-center">
                      <div className="flex items-center gap-2 mb-1.5">
                        <p className="text-white text-xs uppercase tracking-[0.15em] font-bold">Pareja — Responden los dos</p>
                        <span className="text-[9px] px-2 py-0.5 rounded-full bg-white/20 text-white font-semibold">3 reportes</span>
                      </div>
                      <p className="text-white text-sm font-bold leading-snug">Diagnóstico cruzado completo<br/>de ambos.</p>
                    </div>
                    <div className="p-8 pt-5">
                    <div className="flex items-baseline gap-2 mb-1">
                      <span className="text-white/30 text-lg line-through">$1,999</span>
                      <p className="text-3xl font-light text-white">${PRODUCT_PRICE_LOSDOS} <span className="text-lg text-white/35">MXN</span></p>
                    </div>
                    <p className="text-emerald-400/60 text-xs font-medium mb-1">-50% por lanzamiento</p>
                    <p className="text-white/65 text-sm font-light mb-5">Cada uno contesta por separado · 3 reportes: tuyo, suyo y cruzado</p>
                    <ul className="space-y-2 mb-6">
                      {['Cada uno contesta 40 preguntas por separado, en privado', 'Reporte individual para cada uno con su propio análisis', 'Reporte cruzado: dónde chocan y dónde se complementan', 'Diagnóstico de la dinámica invisible entre los dos', 'Comparación de estilos de apego y lenguajes del amor', 'El punto de partida ideal antes de terapia de pareja'].map((item, i) => (
                        <li key={i} className="flex items-start gap-2 text-white/65 text-sm font-light">
                          <Check className="w-3.5 h-3.5 text-cyan-400/60 flex-shrink-0 mt-0.5" strokeWidth={2} />
                          {item}
                        </li>
                      ))}
                    </ul>
                    <motion.button
                      onClick={() => { setStage('checkout'); scrollToTop() }}
                      whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}
                      className="w-full py-4 rounded-xl bg-gradient-to-r from-blue-500 to-cyan-500 text-white font-light text-base hover:from-blue-400 hover:to-cyan-400 transition-all shadow-lg shadow-cyan-600/20">
                      Empezar juntos
                    </motion.button>
                    </div>
                  </div>
                </div>

                {/* Mobile: stacked pricing cards */}
                <div className="sm:hidden flex flex-col gap-5 max-w-sm mx-auto">
                  {/* Radiografía de tu forma de amar — Mobile */}
                  <div className="rounded-2xl border border-white/[0.1] bg-zinc-950/60 text-left overflow-hidden">
                    <div className="py-4 px-7 bg-gradient-to-br from-amber-400 to-orange-500 min-h-[90px] flex flex-col justify-center">
                      <div className="flex items-center gap-2 mb-1.5">
                        <p className="text-zinc-900 text-xs uppercase tracking-[0.15em] font-bold">Individual — Sin pareja</p>
                        <span className="text-[9px] px-2 py-0.5 rounded-full bg-black/15 text-zinc-900 font-semibold">1 reporte</span>
                      </div>
                      <p className="text-zinc-900 text-sm font-bold leading-snug">Empieza por ti:<br/>entiende tu forma de amar.</p>
                    </div>
                    <div className="p-7 pt-5">
                    <div className="flex items-baseline gap-2 mb-1">
                      <span className="text-white/30 text-lg line-through">$999</span>
                      <p className="text-3xl font-light text-white">${PRODUCT_PRICE_DESCUBRE} <span className="text-lg text-white/35">MXN</span></p>
                    </div>
                    <p className="text-emerald-400/60 text-xs font-medium mb-1">-50% por lanzamiento</p>
                    <p className="text-white/65 text-sm font-light mb-5">Tu mapa de patrones amorosos · No necesitas tener pareja</p>
                    <ul className="space-y-2 mb-6">
                      {['Descubre por qué eliges siempre el mismo tipo de pareja', 'Mapa de tu estilo de apego y mecanismos de defensa', 'Radiografía de tus patrones inconscientes al amar', '40 preguntas guiadas por voz con IA', 'Análisis de 11 corrientes psicológicas sobre ti', 'Reporte PDF con gráficas y análisis descargable'].map((item, i) => (
                        <li key={i} className="flex items-start gap-2 text-white/65 text-sm font-light">
                          <Check className="w-3.5 h-3.5 text-violet-400/60 flex-shrink-0 mt-0.5" strokeWidth={2} />
                          {item}
                        </li>
                      ))}
                    </ul>
                    <motion.button onClick={() => { setStage('checkout'); scrollToTop() }} whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}
                      className="w-full py-4 rounded-xl bg-gradient-to-r from-amber-400 to-orange-500 text-zinc-900 font-semibold text-base">
                      Descubrir mi patrón
                    </motion.button>
                    </div>
                  </div>
                  {/* Pareja Solo — Mobile */}
                  <div>
                  <div className="rounded-2xl border border-violet-500/25 bg-gradient-to-br from-violet-500/[0.04] to-fuchsia-500/[0.02] text-left overflow-hidden">
                    <div className="py-4 px-7 bg-gradient-to-br from-violet-600 to-fuchsia-600 min-h-[90px] flex flex-col justify-center">
                      <div className="flex items-center gap-2 mb-1.5">
                        <p className="text-white text-xs uppercase tracking-[0.15em] font-bold">Pareja — Respondes tú</p>
                        <span className="text-[9px] px-2 py-0.5 rounded-full bg-white/20 text-white font-semibold">1 reporte</span>
                      </div>
                      <p className="text-white text-sm font-bold leading-snug">Tienes pareja, pero tú haces<br/>todo el análisis.</p>
                    </div>
                    <div className="p-7 pt-5">
                    <div className="flex items-baseline gap-2 mb-1">
                      <span className="text-white/30 text-lg line-through">$999</span>
                      <p className="text-3xl font-light text-white">${PRODUCT_PRICE_SOLO} <span className="text-lg text-white/35">MXN</span></p>
                    </div>
                    <p className="text-emerald-400/60 text-xs font-medium mb-1">-50% por lanzamiento</p>
                    <p className="text-white/65 text-sm font-light mb-5">Tú contestas · Análisis profundo de lo que está pasando en tu relación</p>
                    <ul className="space-y-2 mb-6">
                      {['Entiende qué dinámicas invisibles están desgastando tu relación', '40 preguntas guiadas por voz — tú contestas solo/a', 'Análisis de 11 corrientes psicológicas sobre tu caso', 'Diagnóstico de hacia dónde va tu relación si nada cambia', 'Autoanálisis: qué proyectas, qué repites, qué evitas', 'Reporte PDF profesional con radar y gráficas'].map((item, i) => (
                        <li key={i} className="flex items-start gap-2 text-white/65 text-sm font-light">
                          <Check className="w-3.5 h-3.5 text-violet-400/60 flex-shrink-0 mt-0.5" strokeWidth={2} />
                          {item}
                        </li>
                      ))}
                    </ul>
                    <motion.button onClick={() => { setStage('checkout'); scrollToTop() }} whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}
                      className="w-full py-4 rounded-xl bg-gradient-to-r from-violet-600 to-fuchsia-600 text-white font-light text-base">
                      Radiografiar mi relación
                    </motion.button>
                    </div>
                  </div>
                  </div>
                  {/* Pareja Los dos — Mobile */}
                  <div className="rounded-2xl border border-cyan-500/25 bg-gradient-to-br from-cyan-500/[0.04] to-blue-500/[0.02] text-left overflow-hidden">
                    <div className="py-4 px-7 bg-gradient-to-br from-blue-500 to-cyan-500 min-h-[90px] flex flex-col justify-center">
                      <div className="flex items-center gap-2 mb-1.5">
                        <p className="text-white text-xs uppercase tracking-[0.15em] font-bold">Pareja — Responden los dos</p>
                        <span className="text-[9px] px-2 py-0.5 rounded-full bg-white/20 text-white font-semibold">3 reportes</span>
                      </div>
                      <p className="text-white text-sm font-bold leading-snug">Diagnóstico cruzado completo<br/>de ambos.</p>
                    </div>
                    <div className="p-7 pt-5">
                    <div className="flex items-baseline gap-2 mb-1">
                      <span className="text-white/30 text-lg line-through">$1,999</span>
                      <p className="text-3xl font-light text-white">${PRODUCT_PRICE_LOSDOS} <span className="text-lg text-white/35">MXN</span></p>
                    </div>
                    <p className="text-emerald-400/60 text-xs font-medium mb-1">-50% por lanzamiento</p>
                    <p className="text-white/65 text-sm font-light mb-5">Cada uno contesta por separado · 3 reportes: tuyo, suyo y cruzado</p>
                    <ul className="space-y-2 mb-6">
                      {['Cada uno contesta 40 preguntas por separado, en privado', 'Reporte individual para cada uno con su propio análisis', 'Reporte cruzado: dónde chocan y dónde se complementan', 'Diagnóstico de la dinámica invisible entre los dos', 'Comparación de estilos de apego y lenguajes del amor', 'El punto de partida ideal antes de terapia de pareja'].map((item, i) => (
                        <li key={i} className="flex items-start gap-2 text-white/65 text-sm font-light">
                          <Check className="w-3.5 h-3.5 text-cyan-400/60 flex-shrink-0 mt-0.5" strokeWidth={2} />
                          {item}
                        </li>
                      ))}
                    </ul>
                    <motion.button onClick={() => { setStage('checkout'); scrollToTop() }} whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}
                      className="w-full py-4 rounded-xl bg-gradient-to-r from-blue-500 to-cyan-500 text-white font-light text-base">
                      Empezar juntos
                    </motion.button>
                    </div>
                  </div>
                </div>

                {/* Trust signals */}
                <div className="flex flex-wrap items-center justify-center gap-6 mt-8">
                  <div className="flex items-center gap-2 text-white/25 text-xs font-light">
                    <Shield className="w-4 h-4 text-emerald-400/40" strokeWidth={1.5} />
                    <span>Pago seguro con Stripe</span>
                  </div>
                  <div className="flex items-center gap-2 text-white/25 text-xs font-light">
                    <Lock className="w-4 h-4 text-violet-400/40" strokeWidth={1.5} />
                    <span>Tus respuestas son 100% privadas</span>
                  </div>
                  <div className="flex items-center gap-2 text-white/25 text-xs font-light">
                    <CheckCircle className="w-4 h-4 text-amber-400/40" strokeWidth={1.5} />
                    <span>Garantía de satisfacción</span>
                  </div>
                </div>

                {resumeDraft && (
                  <button onClick={restoreDraft} className="block mx-auto mt-6 text-violet-300/40 text-sm hover:text-violet-300/70 underline underline-offset-4 transition-colors">
                    Continuar diagnóstico en progreso
                  </button>
                )}
                <p className="text-white/20 text-xs font-light mt-5">12 dimensiones psicológicas · Bowlby, Gottman, Sternberg, Perel y 8 autores más</p>
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
            className="min-h-screen flex items-center justify-center px-6 pt-12 pb-20">
            <div className="max-w-4xl w-full space-y-8">
              <div className="text-center max-w-4xl mx-auto p-6 lg:p-8 rounded-2xl border border-violet-500/20 bg-gradient-to-r from-violet-600/[0.16] via-fuchsia-600/[0.12] to-cyan-600/[0.10]">
                <CreditCard className="w-10 h-10 text-violet-400/50 mx-auto mb-4" />
                <h2 className="text-3xl font-light text-white mb-2">¿Qué tipo de radiografía necesitas hoy?</h2>
                <p className="text-white/80 text-base font-light mb-1">La respuesta a por qué amas como amas: descubre tus patrones inconscientes y qué está pasando realmente en tu vínculo.</p>
                <p className="text-white/65 text-sm font-light">Elige modalidad individual, pareja solo o los dos, y recibe un reporte claro para tomar decisiones con certeza.</p>
              </div>

              {/* Pricing Cards with per-card promo codes */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
                {/* Radiografía Individual */}
                <div className="rounded-2xl border border-white/10 bg-zinc-950/60 overflow-hidden">
                  <div className="py-4 px-7 bg-gradient-to-br from-amber-400 to-orange-500 min-h-[90px] flex flex-col justify-center">
                    <div className="flex items-center gap-2 mb-1.5">
                      <p className="text-zinc-900 text-xs uppercase tracking-[0.15em] font-bold">Individual — Sin pareja</p>
                      <span className="text-[9px] px-2 py-0.5 rounded-full bg-black/15 text-zinc-900 font-semibold">1 reporte</span>
                    </div>
                    <p className="text-zinc-900 text-sm font-bold leading-snug">Empieza por ti:<br/>entiende tu forma de amar.</p>
                  </div>
                  <div className="p-7 pt-5 space-y-5">
                  <div>
                    <div className="flex items-baseline gap-2 mb-1">
                      <span className="text-white/30 text-lg line-through">$999</span>
                      <p className="text-3xl font-light text-white">${PRODUCT_PRICE_DESCUBRE} <span className="text-lg text-white/35">MXN</span></p>
                    </div>
                    <p className="text-emerald-400/60 text-xs font-medium mb-1">-50% por lanzamiento</p>
                    <p className="text-white/40 text-sm font-light">Tu mapa de patrones amorosos · No necesitas tener pareja</p>
                  </div>
                  <ul className="space-y-2">
                    {['Descubre por qué eliges siempre el mismo tipo de pareja', 'Mapa de tu estilo de apego y mecanismos de defensa', 'Radiografía de tus patrones inconscientes al amar', '40 preguntas guiadas por voz con IA', 'Análisis de 11 corrientes psicológicas sobre ti', 'Reporte PDF con gráficas y análisis descargable'].map((item, i) => (
                      <li key={i} className="flex items-start gap-2 text-white/50 text-sm font-light">
                        <Check className="w-3.5 h-3.5 text-emerald-400/60 flex-shrink-0 mt-0.5" strokeWidth={2} />
                        {item}
                      </li>
                    ))}
                  </ul>
                  <div className="relative">
                    <input type="text" value={cardPromoCodes.descubre}
                      onChange={e => { setCardPromoCodes(p => ({ ...p, descubre: e.target.value })); setCardPromoErrors(p => ({ ...p, descubre: '' })); setCardPromoApplied(p => ({ ...p, descubre: null })) }}
                      placeholder="Código promo"
                      className="w-full px-3 py-2 pr-20 bg-white/[0.04] border border-white/10 rounded-lg text-white text-xs font-light placeholder:text-white/20 focus:border-violet-400/30 focus:outline-none transition-colors" />
                    <button onClick={() => handleApplyPromo('descubre')}
                      disabled={!cardPromoCodes.descubre.trim() || promoValidating === 'descubre'}
                      className="absolute right-1 top-1 bottom-1 px-3 rounded-md bg-violet-600/80 hover:bg-violet-500/80 text-white text-[11px] font-medium transition-colors disabled:opacity-30 disabled:cursor-default">
                      {promoValidating === 'descubre' ? '...' : 'Aplicar'}
                    </button>
                  </div>
                  {cardPromoErrors.descubre && <p className="text-red-400/70 text-xs">{cardPromoErrors.descubre}</p>}
                  {cardPromoApplied.descubre && (
                    <div className="flex items-center gap-2 px-3 py-2 rounded-lg bg-emerald-500/[0.08] border border-emerald-500/20">
                      <CheckCircle className="w-3.5 h-3.5 text-emerald-400/70 flex-shrink-0" strokeWidth={2} />
                      <span className="text-emerald-300/80 text-xs font-light">{cardPromoApplied.descubre.label}{cardPromoApplied.descubre.free ? ' · Gratis' : ` · -${cardPromoApplied.descubre.discountPercent}%`}</span>
                    </div>
                  )}
                  <motion.button onClick={() => handlePurchase('descubre')} whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}
                    disabled={checkoutLoading === 'descubre'}
                    className="w-full py-4 rounded-xl bg-gradient-to-r from-amber-400 to-orange-500 text-zinc-900 font-semibold text-base hover:from-amber-300 hover:to-orange-400 transition-all shadow-lg shadow-amber-600/20 disabled:opacity-50">
                    {checkoutLoading === 'descubre' ? 'Procesando...' : cardPromoApplied.descubre?.free ? 'Acceder gratis' : `Pagar $${cardPromoApplied.descubre?.finalPrice ?? PRODUCT_PRICE_DESCUBRE} MXN`}
                  </motion.button>
                  </div>
                </div>

                {/* Pareja — Solo */}
                <div>
                <div className="rounded-2xl border border-violet-500/25 bg-gradient-to-br from-violet-500/[0.04] to-fuchsia-500/[0.02] overflow-hidden">
                  <div className="py-4 px-7 bg-gradient-to-br from-violet-600 to-fuchsia-600 min-h-[90px] flex flex-col justify-center">
                    <div className="flex items-center gap-2 mb-1.5">
                      <p className="text-white text-xs uppercase tracking-[0.15em] font-bold">Pareja — Respondes tú</p>
                      <span className="text-[9px] px-2 py-0.5 rounded-full bg-white/20 text-white font-semibold">1 reporte</span>
                    </div>
                    <p className="text-white text-sm font-bold leading-snug">Tienes pareja, pero tú haces<br/>todo el análisis.</p>
                  </div>
                  <div className="p-7 pt-5 space-y-5">
                  <div>
                    <div className="flex items-baseline gap-2 mb-1">
                      <span className="text-white/30 text-lg line-through">$999</span>
                      <p className="text-3xl font-light text-white">${PRODUCT_PRICE_SOLO} <span className="text-lg text-white/35">MXN</span></p>
                    </div>
                    <p className="text-emerald-400/60 text-xs font-medium mb-1">-50% por lanzamiento</p>
                    <p className="text-white/40 text-sm font-light">Tú contestas · Análisis profundo de lo que está pasando</p>
                  </div>
                  <ul className="space-y-2">
                    {['Entiende qué dinámicas invisibles están desgastando tu relación', '40 preguntas guiadas por voz — tú contestas solo/a', 'Análisis de 11 corrientes psicológicas sobre tu caso', 'Diagnóstico de hacia dónde va tu relación si nada cambia', 'Autoanálisis: qué proyectas, qué repites, qué evitas', 'Reporte PDF profesional con radar y gráficas'].map((item, i) => (
                      <li key={i} className="flex items-start gap-2 text-white/50 text-sm font-light">
                        <Check className="w-3.5 h-3.5 text-emerald-400/60 flex-shrink-0 mt-0.5" strokeWidth={2} />
                        {item}
                      </li>
                    ))}
                  </ul>
                  <div className="relative">
                    <input type="text" value={cardPromoCodes.solo}
                      onChange={e => { setCardPromoCodes(p => ({ ...p, solo: e.target.value })); setCardPromoErrors(p => ({ ...p, solo: '' })); setCardPromoApplied(p => ({ ...p, solo: null })) }}
                      placeholder="Código promo"
                      className="w-full px-3 py-2 pr-20 bg-white/[0.04] border border-white/10 rounded-lg text-white text-xs font-light placeholder:text-white/20 focus:border-violet-400/30 focus:outline-none transition-colors" />
                    <button onClick={() => handleApplyPromo('solo')}
                      disabled={!cardPromoCodes.solo.trim() || promoValidating === 'solo'}
                      className="absolute right-1 top-1 bottom-1 px-3 rounded-md bg-violet-600/80 hover:bg-violet-500/80 text-white text-[11px] font-medium transition-colors disabled:opacity-30 disabled:cursor-default">
                      {promoValidating === 'solo' ? '...' : 'Aplicar'}
                    </button>
                  </div>
                  {cardPromoErrors.solo && <p className="text-red-400/70 text-xs">{cardPromoErrors.solo}</p>}
                  {cardPromoApplied.solo && (
                    <div className="flex items-center gap-2 px-3 py-2 rounded-lg bg-emerald-500/[0.08] border border-emerald-500/20">
                      <CheckCircle className="w-3.5 h-3.5 text-emerald-400/70 flex-shrink-0" strokeWidth={2} />
                      <span className="text-emerald-300/80 text-xs font-light">{cardPromoApplied.solo.label}{cardPromoApplied.solo.free ? ' · Gratis' : ` · -${cardPromoApplied.solo.discountPercent}%`}</span>
                    </div>
                  )}
                  <motion.button onClick={() => handlePurchase('solo')} whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}
                    disabled={checkoutLoading === 'solo'}
                    className="w-full py-4 rounded-xl bg-gradient-to-r from-violet-600 to-fuchsia-600 text-white font-light text-base hover:from-violet-500 hover:to-fuchsia-500 transition-all shadow-lg shadow-violet-600/20 disabled:opacity-50">
                    {checkoutLoading === 'solo' ? 'Procesando...' : cardPromoApplied.solo?.free ? 'Acceder gratis' : `Pagar $${cardPromoApplied.solo?.finalPrice ?? PRODUCT_PRICE_SOLO} MXN`}
                  </motion.button>
                  </div>
                </div>
                </div>

                {/* Pareja — Los dos */}
                <div className="rounded-2xl border border-cyan-500/25 bg-gradient-to-br from-cyan-500/[0.04] to-blue-500/[0.02] overflow-hidden">
                  <div className="py-4 px-7 bg-gradient-to-br from-blue-500 to-cyan-500 min-h-[90px] flex flex-col justify-center">
                    <div className="flex items-center gap-2 mb-1.5">
                      <p className="text-white text-xs uppercase tracking-[0.15em] font-bold">Pareja — Responden los dos</p>
                      <span className="text-[9px] px-2 py-0.5 rounded-full bg-white/20 text-white font-semibold">3 reportes</span>
                    </div>
                    <p className="text-white text-sm font-bold leading-snug">Diagnóstico cruzado completo<br/>de ambos.</p>
                  </div>
                  <div className="p-7 pt-5 space-y-5">
                  <div>
                    <div className="flex items-baseline gap-2 mb-1">
                      <span className="text-white/30 text-lg line-through">$1,999</span>
                      <p className="text-3xl font-light text-white">${PRODUCT_PRICE_LOSDOS} <span className="text-lg text-white/35">MXN</span></p>
                    </div>
                    <p className="text-emerald-400/60 text-xs font-medium mb-1">-50% por lanzamiento</p>
                    <p className="text-white/40 text-sm font-light">Cada uno contesta por separado · 3 reportes: tuyo, suyo y cruzado</p>
                  </div>
                  <ul className="space-y-2">
                    {['Cada uno contesta 40 preguntas por separado, en privado', 'Reporte individual para cada uno con su propio análisis', 'Reporte cruzado: dónde chocan y dónde se complementan', 'Diagnóstico de la dinámica invisible entre los dos', 'Comparación de estilos de apego y lenguajes del amor', 'El punto de partida ideal antes de terapia de pareja'].map((item, i) => (
                      <li key={i} className="flex items-start gap-2 text-white/50 text-sm font-light">
                        <Check className="w-3.5 h-3.5 text-cyan-400/60 flex-shrink-0 mt-0.5" strokeWidth={2} />
                        {item}
                      </li>
                    ))}
                  </ul>
                  <div className="relative">
                    <input type="text" value={cardPromoCodes.losdos}
                      onChange={e => { setCardPromoCodes(p => ({ ...p, losdos: e.target.value })); setCardPromoErrors(p => ({ ...p, losdos: '' })); setCardPromoApplied(p => ({ ...p, losdos: null })) }}
                      placeholder="Código promo"
                      className="w-full px-3 py-2 pr-20 bg-white/[0.04] border border-white/10 rounded-lg text-white text-xs font-light placeholder:text-white/20 focus:border-violet-400/30 focus:outline-none transition-colors" />
                    <button onClick={() => handleApplyPromo('losdos')}
                      disabled={!cardPromoCodes.losdos.trim() || promoValidating === 'losdos'}
                      className="absolute right-1 top-1 bottom-1 px-3 rounded-md bg-cyan-600/80 hover:bg-cyan-500/80 text-white text-[11px] font-medium transition-colors disabled:opacity-30 disabled:cursor-default">
                      {promoValidating === 'losdos' ? '...' : 'Aplicar'}
                    </button>
                  </div>
                  {cardPromoErrors.losdos && <p className="text-red-400/70 text-xs">{cardPromoErrors.losdos}</p>}
                  {cardPromoApplied.losdos && (
                    <div className="flex items-center gap-2 px-3 py-2 rounded-lg bg-emerald-500/[0.08] border border-emerald-500/20">
                      <CheckCircle className="w-3.5 h-3.5 text-emerald-400/70 flex-shrink-0" strokeWidth={2} />
                      <span className="text-emerald-300/80 text-xs font-light">{cardPromoApplied.losdos.label}{cardPromoApplied.losdos.free ? ' · Gratis' : ` · -${cardPromoApplied.losdos.discountPercent}%`}</span>
                    </div>
                  )}
                  <motion.button onClick={() => handlePurchase('losdos')} whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}
                    disabled={checkoutLoading === 'losdos'}
                    className="w-full py-4 rounded-xl bg-gradient-to-r from-blue-500 to-cyan-500 text-white font-light text-base hover:from-blue-400 hover:to-cyan-400 transition-all shadow-lg shadow-cyan-600/20 disabled:opacity-50">
                    {checkoutLoading === 'losdos' ? 'Procesando...' : cardPromoApplied.losdos?.free ? 'Acceder gratis' : `Pagar $${cardPromoApplied.losdos?.finalPrice ?? PRODUCT_PRICE_LOSDOS} MXN`}
                  </motion.button>
                  </div>
                </div>
              </div>

              {/* Switch modo test + Volver */}
              <div className="space-y-3">
                <div className="p-4 rounded-xl border border-amber-500/20 bg-amber-500/[0.04] flex items-center justify-between gap-4">
                  <div>
                    <p className="text-amber-300/70 text-sm font-medium">Modo prueba</p>
                    <p className="text-amber-300/35 text-xs mt-0.5">
                      {stripeTestMode
                        ? 'Activo — tarjeta: 4242 4242 4242 4242 · 12/34 · 123'
                        : 'Desactivado — cobros reales'}
                    </p>
                  </div>
                  <button
                    onClick={() => setStripeTestMode(p => !p)}
                    className={`relative w-12 h-6 rounded-full transition-colors flex-shrink-0 ${
                      stripeTestMode ? 'bg-amber-500' : 'bg-white/15'
                    }`}>
                    <span className={`absolute top-0.5 left-0.5 w-5 h-5 rounded-full bg-white shadow transition-transform ${
                      stripeTestMode ? 'translate-x-6' : 'translate-x-0'
                    }`} />
                  </button>
                </div>
                <div className="text-center">
                  <button onClick={() => { setStage('hero'); scrollToTop() }}
                    className="text-white/20 text-xs hover:text-white/40 transition-colors">
                    Volver
                  </button>
                </div>
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
                      Tu acceso a la <span className="text-violet-300/80">Radiografía de Pareja</span>{' '}
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
                      {purchaseType === 'losdos'
                        ? 'Envía el test a tu pareja'
                        : purchaseType === 'pareja' ? 'Introduce los emails de ambos' : 'Introduce tu email'}
                    </h3>
                    <p className="text-white/35 text-sm font-light">
                      {purchaseType === 'losdos'
                        ? 'Tu pareja recibirá un enlace personalizado para tomar su propia versión del test en privado.'
                        : purchaseType === 'pareja'
                        ? 'Cada persona recibirá su propio enlace para tomar el test por separado.'
                        : 'Te enviaremos un enlace seguro para acceder a tu test y tus resultados.'}
                    </p>
                  </div>

                  <div className="space-y-3">
                    {purchaseType !== 'losdos' && (
                    <div>
                      <label className="text-white/30 text-xs uppercase tracking-wider mb-1.5 block">
                        {purchaseType === 'pareja' ? 'Email — Persona 1' : 'Tu email'}
                      </label>
                      <input type="email" value={thankyouEmails[0]}
                        onChange={e => setThankyouEmails(prev => [e.target.value, prev[1]])}
                        placeholder="email@ejemplo.com"
                        className="w-full px-4 py-4 bg-white/[0.04] border border-white/10 rounded-xl text-white text-sm font-light placeholder:text-white/20 focus:border-violet-400/30 focus:outline-none transition-colors" />
                    </div>
                    )}
                    {(purchaseType === 'pareja' || purchaseType === 'losdos') && (
                      <div>
                        <label className="text-white/30 text-xs uppercase tracking-wider mb-1.5 block">
                          {purchaseType === 'losdos' ? 'Email de tu pareja' : 'Email — Persona 2'}
                        </label>
                        <input type="email" value={thankyouEmails[1]}
                          onChange={e => setThankyouEmails(prev => [prev[0], e.target.value])}
                          placeholder={purchaseType === 'losdos' ? 'email@pareja.com' : 'email2@ejemplo.com'}
                          className="w-full px-4 py-4 bg-white/[0.04] border border-white/10 rounded-xl text-white text-sm font-light placeholder:text-white/20 focus:border-violet-400/30 focus:outline-none transition-colors" />
                        {purchaseType === 'losdos' && (
                          <p className="text-white/25 text-xs font-light mt-1.5">Le enviaremos un enlace único para que tome el test de forma independiente.</p>
                        )}
                      </div>
                    )}

                    {/* Nombre + edad — needed for the AI analysis personalisation */}
                    {['descubre', 'solo', 'losdos'].includes(purchaseType) && (
                      <>
                        <div className="flex items-center gap-3 py-1">
                          <div className="h-px flex-1 bg-white/[0.06]" />
                          <p className="text-white/35 text-xs uppercase tracking-[0.15em]">Personaliza tu análisis</p>
                          <div className="h-px flex-1 bg-white/[0.06]" />
                        </div>
                        <div className="grid grid-cols-2 gap-3">
                          <div>
                            <label className="text-white/50 text-xs uppercase tracking-wider mb-1.5 block">Tu nombre</label>
                            <input type="text" value={thankYouProfile.nombre}
                              onChange={e => setThankYouProfile(p => ({ ...p, nombre: e.target.value }))}
                              placeholder="Ej: Luis"
                              className="w-full px-4 py-4 bg-white/[0.04] border border-white/10 rounded-xl text-white text-sm font-light placeholder:text-white/20 focus:border-violet-400/30 focus:outline-none transition-colors" />
                          </div>
                          <div>
                            <label className="text-white/50 text-xs uppercase tracking-wider mb-1.5 block">Tu edad</label>
                            <input type="text" value={thankYouProfile.edad}
                              onChange={e => setThankYouProfile(p => ({ ...p, edad: e.target.value }))}
                              placeholder="Ej: 28"
                              className="w-full px-4 py-4 bg-white/[0.04] border border-white/10 rounded-xl text-white text-sm font-light placeholder:text-white/20 focus:border-violet-400/30 focus:outline-none transition-colors" />
                          </div>
                        </div>
                        {(purchaseType === 'solo' || purchaseType === 'losdos') && (
                          <div className="grid grid-cols-2 gap-3">
                            <div>
                              <label className="text-white/50 text-xs uppercase tracking-wider mb-1.5 block">Nombre de tu pareja</label>
                              <input type="text" value={thankYouProfile.nombrePareja}
                                onChange={e => setThankYouProfile(p => ({ ...p, nombrePareja: e.target.value }))}
                                placeholder="Ej: Susana"
                                className="w-full px-4 py-4 bg-white/[0.04] border border-white/10 rounded-xl text-white text-sm font-light placeholder:text-white/20 focus:border-fuchsia-400/30 focus:outline-none transition-colors" />
                            </div>
                            <div>
                              <label className="text-white/50 text-xs uppercase tracking-wider mb-1.5 block">Edad de tu pareja</label>
                              <input type="text" value={thankYouProfile.edadPareja}
                                onChange={e => setThankYouProfile(p => ({ ...p, edadPareja: e.target.value }))}
                                placeholder="Ej: 30"
                                className="w-full px-4 py-4 bg-white/[0.04] border border-white/10 rounded-xl text-white text-sm font-light placeholder:text-white/20 focus:border-fuchsia-400/30 focus:outline-none transition-colors" />
                            </div>
                          </div>
                        )}
                      </>
                    )}
                  </div>

                  <motion.button
                    onClick={async () => {
                      const emails = (purchaseType === 'pareja' || purchaseType === 'losdos')
                        ? thankyouEmails.filter(e => e.includes('@'))
                        : [thankyouEmails[0]].filter(e => e.includes('@'))
                      if (emails.length === 0) return
                      setSendingEmails(true)
                      setEmailSendError('')
                      try {
                        const tokens = emails.map(() => generateAccessToken())
                        const pid = purchaseId || generateAccessToken()
                        setPurchaseId(pid)
                        sessionStorage.setItem('diagnostico_relacional_purchase_id', pid)
                        // Save purchase to Firestore (fire-and-forget — Firebase may not be configured)
                        savePurchase(pid, { type: purchaseType, email: emails[0], stripeSessionId: purchaseId }).catch(() => {})
                        // Send access emails via backend
                        const result = await sendAccessEmails({ purchaseId: pid, type: purchaseType, emails, tokens })
                        if (result && result.ok === false) {
                          setEmailSendError(result.errors?.[0]?.error || 'No se pudo enviar el correo. Verifica la configuración de Resend.')
                        } else {
                          setEmailsSent(true)
                          // For losdos: immediately navigate after sending partner link
                          if (purchaseType === 'losdos') {
                            sessionStorage.setItem('radiografia_buyer_email', emails[0])
                            if (emails[1]) sessionStorage.setItem('radiografia_partner_email', emails[1])
                            sessionStorage.setItem('radiografia_nombre', thankYouProfile.nombre)
                            sessionStorage.setItem('radiografia_edad', thankYouProfile.edad)
                            sessionStorage.setItem('radiografia_nombre_pareja', thankYouProfile.nombrePareja)
                            sessionStorage.setItem('radiografia_edad_pareja', thankYouProfile.edadPareja)
                            navigate(`/tienda/radiografia-premium?type=${purchaseType}`)
                            scrollToTop()
                          }
                        }
                        // Also store email for later use
                        setEmail(emails[0])
                        sessionStorage.setItem('diagnostico_guide_email', emails[0])
                      } catch (err) {
                        setEmailSendError(`Error: ${err.message || 'No se pudo enviar el correo.'}`)
                      } finally {
                        setSendingEmails(false)
                      }
                    }}
                    disabled={sendingEmails || !thankyouEmails[0]?.includes('@') || ((purchaseType === 'pareja' || purchaseType === 'losdos') && !thankyouEmails[1]?.includes('@'))}
                    whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}
                    className="w-full py-4 rounded-xl bg-gradient-to-r from-violet-600 to-fuchsia-600 text-white font-light text-base hover:from-violet-500 hover:to-fuchsia-500 transition-all shadow-lg shadow-violet-600/20 disabled:opacity-40 disabled:cursor-not-allowed">
                    {sendingEmails ? (
                      <><Loader2 className="inline w-4 h-4 mr-2 animate-spin" /> Enviando...</>
                    ) : (
                      <><Send className="inline w-4 h-4 mr-2" /> {purchaseType === 'losdos' ? 'Enviar enlace y comenzar →' : purchaseType === 'pareja' ? 'Enviar acceso a ambos' : 'Enviar acceso'}</>
                    )}
                  </motion.button>
                  {emailSendError && (
                    <p className="text-red-400/80 text-xs text-center mt-2">{emailSendError}</p>
                  )}
                </motion.div>
              )}

              {/* Success: emails sent */}
              {emailsSent && (
                <motion.div initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }}
                  className="p-6 rounded-2xl border border-emerald-500/20 bg-emerald-500/[0.04] space-y-4">
                  <div className="flex items-center gap-3">
                    <Check className="w-5 h-5 text-emerald-400/80" />
                    <p className="text-emerald-300/80 text-base font-light">
                      {(purchaseType === 'pareja' || purchaseType === 'losdos')
                        ? purchaseType === 'losdos'
                          ? `¡Enlace enviado a ${thankyouEmails[1]}! Tu pareja puede empezar cuando quiera.`
                          : `¡Enlace enviado a ${thankyouEmails[0]} y ${thankyouEmails[1]}!`
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
                  onClick={() => {
                    if (['descubre', 'solo', 'losdos'].includes(purchaseType)) {
                      // Pass emails to RadiografiaPremiumPage so profile form is pre-filled
                      if (thankyouEmails[0]) sessionStorage.setItem('radiografia_buyer_email', thankyouEmails[0])
                      if (purchaseType === 'losdos' && thankyouEmails[1]) sessionStorage.setItem('radiografia_partner_email', thankyouEmails[1])
                      // Pass profile data so the profile stage can be skipped entirely
                      sessionStorage.setItem('radiografia_nombre', thankYouProfile.nombre)
                      sessionStorage.setItem('radiografia_edad', thankYouProfile.edad)
                      sessionStorage.setItem('radiografia_nombre_pareja', thankYouProfile.nombrePareja)
                      sessionStorage.setItem('radiografia_edad_pareja', thankYouProfile.edadPareja)
                      navigate(`/tienda/radiografia-premium?type=${purchaseType}`)
                    } else {
                      setStage('instructions')
                    }
                    scrollToTop()
                  }}
                  whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}
                  className="px-10 py-5 rounded-xl bg-gradient-to-r from-violet-600 to-fuchsia-600 text-white font-light text-lg hover:from-violet-500 hover:to-fuchsia-500 transition-all shadow-lg shadow-violet-600/20">
                  {['descubre', 'solo', 'losdos'].includes(purchaseType)
                    ? <>Comenzar mi Radiografía <ArrowRight className="inline w-5 h-5 ml-2" /></>
                    : <>Comenzar mi diagnóstico ahora <ArrowRight className="inline w-5 h-5 ml-2" /></>}
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

              {/* Voice gender selector */}
              <div className="flex flex-col items-center gap-3">
                <p className="text-white/40 text-sm font-light">Elige la voz que te acompañará:</p>
                <div className="flex items-center rounded-full border border-white/10 bg-white/[0.03] p-1">
                  <button onClick={() => setVoiceGender('female')}
                    className={`px-5 py-2 rounded-full text-sm font-light transition-all ${
                      voiceGender === 'female'
                        ? 'bg-fuchsia-500/20 text-fuchsia-300 border border-fuchsia-400/30'
                        : 'text-white/30 hover:text-white/50 border border-transparent'
                    }`}>
                    ♀ Voz femenina
                  </button>
                  <button onClick={() => setVoiceGender('male')}
                    className={`px-5 py-2 rounded-full text-sm font-light transition-all ${
                      voiceGender === 'male'
                        ? 'bg-blue-500/20 text-blue-300 border border-blue-400/30'
                        : 'text-white/30 hover:text-white/50 border border-transparent'
                    }`}>
                    ♂ Voz masculina
                  </button>
                </div>
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
            STAGE: QUESTIONNAIRE (44 voice-first questions)
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

                  <h3 className="text-2xl lg:text-3xl font-light text-white/90 leading-relaxed mb-8 tracking-wide font-display text-center">
                    {currentQ?.text}
                  </h3>

                  {/* VOICE MODE */}
                  {uiMode === 'voice' && (
                    <div className="flex flex-col items-center py-2">

                      {/* Voice gender indicator */}

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
                          <p className="text-violet-300/45 text-sm font-light">
                            {voiceGender === 'female' ? 'Escucha la pregunta...' : 'Escucha la pregunta...'}
                          </p>
                        </motion.div>
                      )}

                      {/* Mic area — always visible */}
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

                          {/* Additional actions — always visible */}
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
                  Hemos cruzado tus 44 respuestas en 12 dimensiones psicológicas para construir un mapa profundo de tu relación.
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
            STAGE: RESULTS — Dimension-by-Dimension Premium
        ═══════════════════════════════════════════════════════ */}
        {stage === 'results' && aiAnalysis && (
          <motion.div key="results" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="min-h-screen pt-24 lg:pt-28 pb-20 px-6">
            <div className="max-w-4xl mx-auto space-y-12">

              {/* Header */}
              <div className="text-center">
                <h1 className="text-3xl lg:text-4xl font-light text-white mb-3">Tu Radiografía de Pareja</h1>
                <p className="text-white/40 text-sm font-light">Análisis de 44 respuestas × 12 dimensiones psicológicas × 12 autores</p>
              </div>

              {/* ══════════════════════════════════════════════════════
                  PATRONES CLAVE DETECTADOS (first screen)
              ══════════════════════════════════════════════════════ */}
              {aiAnalysis.key_patterns?.length > 0 && (
                <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
                  <div className="text-center mb-6">
                    <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-amber-500/15 bg-amber-500/[0.04] mb-3">
                      <ScanEye className="w-4 h-4 text-amber-400/60" strokeWidth={1.5} />
                      <span className="text-amber-300/70 text-xs font-light uppercase tracking-wider">Hallazgos principales</span>
                    </div>
                    <h2 className="text-xl font-light text-white/70">Patrones Clave Detectados</h2>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {aiAnalysis.key_patterns.map((pattern, i) => {
                      const severityConfig = {
                        high: { border: 'border-red-500/20', bg: 'from-red-500/[0.05]', dot: 'bg-red-400', label: 'Alta prioridad', labelColor: 'text-red-400/70' },
                        medium: { border: 'border-amber-500/20', bg: 'from-amber-500/[0.04]', dot: 'bg-amber-400', label: 'Moderado', labelColor: 'text-amber-400/60' },
                        low: { border: 'border-blue-500/15', bg: 'from-blue-500/[0.03]', dot: 'bg-blue-400', label: 'A observar', labelColor: 'text-blue-400/60' }
                      }
                      const sev = severityConfig[pattern.severity] || severityConfig.medium
                      return (
                        <motion.div key={i} initial={{ opacity: 0, y: 15 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
                          transition={{ delay: i * 0.08 }}
                          className={`p-5 rounded-2xl border ${sev.border} bg-gradient-to-br ${sev.bg} to-transparent relative overflow-hidden`}>
                          <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-white/5 to-transparent" />
                          <div className="flex items-start gap-3">
                            <div className={`w-2 h-2 rounded-full ${sev.dot} mt-1.5 flex-shrink-0 opacity-60`} />
                            <div className="flex-1">
                              <div className="flex items-center gap-2 mb-1.5">
                                <h3 className="text-white/80 font-light text-sm">{pattern.title}</h3>
                              </div>
                              <p className="text-white/45 text-xs font-light leading-relaxed mb-2">{renderBold(pattern.description)}</p>
                              <span className={`text-[9px] font-light uppercase tracking-wider ${sev.labelColor}`}>{sev.label}</span>
                            </div>
                          </div>
                        </motion.div>
                      )
                    })}
                  </div>
                </motion.div>
              )}

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

              {/* ══════════════════════════════════════════════════════
                  ESTABILIDAD DEL VÍNCULO (Gauge Charts)
              ══════════════════════════════════════════════════════ */}
              {aiAnalysis.composite_scores && (
                <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
                  <h2 className="text-xl font-light text-white/70 mb-6 text-center">Estabilidad del Vínculo</h2>
                  <div className="p-6 rounded-2xl border border-white/8 bg-white/[0.02]">
                    <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
                      {Object.entries(COMPOSITE_LABELS).map(([key, meta]) => {
                        const val = aiAnalysis.composite_scores[key] ?? 0
                        return (
                          <GaugeChart
                            key={key}
                            value={val}
                            label={meta.label}
                            inverted={meta.inverted}
                            icon={key === 'salud_relacional_global' ? '💚' : key === 'sincronia_emocional' ? '🔄' : key === 'riesgo_ruptura' ? '⚠️' : '🌱'}
                          />
                        )
                      })}
                    </div>
                  </div>
                </motion.div>
              )}

              {/* ── RADAR OVERVIEW — all 12 dimensions at a glance ── */}
              {aiAnalysis.dimension_scores && (
                <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}>
                  <h2 className="text-xl font-light text-white/70 mb-6 text-center">Panorama: 12 Dimensiones</h2>
                  <div className="p-6 rounded-2xl border border-white/8 bg-white/[0.02]">
                    <RadarChart scores={aiAnalysis.dimension_scores} />
                    <p className="text-center text-white/25 text-xs font-light mt-4">Cada dimensión se detalla abajo con su propia gráfica y análisis</p>
                  </div>
                </motion.div>
              )}

              {/* ══════════════════════════════════════════════════════
                  12 DIMENSIONES — cada una con su tarjeta y gráfica
              ══════════════════════════════════════════════════════ */}
              <div>
                <h2 className="text-xl font-light text-white/70 mb-2 text-center">Las 12 Dimensiones de tu Relación</h2>
                <p className="text-white/30 text-sm font-light mb-8 text-center">Cada dimensión incluye su puntuación, una gráfica relevante y el análisis narrativo del autor</p>

                <div className="space-y-6">

                  {/* ── 1. APEGO (Bowlby) — gauge + sub-scores ── */}
                  {(() => {
                    const score = aiAnalysis.dimension_scores?.apego ?? 0
                    const subs = aiAnalysis.sub_scores?.apego
                    const narrative = aiAnalysis.dimension_narratives?.apego
                    return (
                      <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
                        className="p-6 rounded-2xl border border-white/8 bg-gradient-to-br from-violet-500/[0.03] to-transparent relative overflow-hidden">
                        <div className="absolute top-0 left-0 right-0 h-[2px]" style={{ background: `linear-gradient(to right, ${DIMENSION_COLORS[0]}40, transparent)` }} />
                        <div className="flex items-center gap-3 mb-4">
                          <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ backgroundColor: `${DIMENSION_COLORS[0]}15`, border: `1px solid ${DIMENSION_COLORS[0]}25` }}>
                            <span className="text-lg">🔗</span>
                          </div>
                          <div className="flex-1">
                            <h3 className="text-white/80 font-light">Apego (Bowlby)</h3>
                            <p className="text-white/30 text-xs font-light">Seguridad emocional y estilo de vínculo</p>
                          </div>
                          <div className="text-right">
                            <p className="text-2xl font-light text-white">{score}<span className="text-sm text-white/30">%</span></p>
                            <p className={`text-xs ${getLevelPct(score).color}`}>{getLevelPct(score).label}</p>
                          </div>
                        </div>
                        {/* Semi-circle gauge */}
                        <div className="flex justify-center mb-4">
                          <svg viewBox="0 0 200 110" className="w-48">
                            <path d="M 20 100 A 80 80 0 0 1 180 100" fill="none" stroke="rgba(255,255,255,0.06)" strokeWidth={12} strokeLinecap="round" />
                            <path d="M 20 100 A 80 80 0 0 1 180 100" fill="none" stroke={DIMENSION_COLORS[0]} strokeWidth={12} strokeLinecap="round" strokeOpacity={0.5}
                              strokeDasharray={`${(score / 100) * 251.3} 251.3`} />
                            <text x="100" y="95" textAnchor="middle" fill="white" fontSize="28" fontWeight="300" opacity={0.8}>{score}%</text>
                          </svg>
                        </div>
                        {subs && (
                          <div className="space-y-2 mb-4">
                            {Object.entries(SUB_SCORE_LABELS.apego || {}).map(([subKey, meta]) => {
                              const val = subs[subKey] ?? 0
                              return (
                                <div key={subKey}>
                                  <div className="flex justify-between mb-0.5">
                                    <span className="text-white/45 text-xs font-light">{meta.label}</span>
                                    <span className="text-white/30 text-xs">{val}%</span>
                                  </div>
                                  <div className="h-1.5 bg-white/5 rounded-full overflow-hidden">
                                    <motion.div initial={{ width: 0 }} whileInView={{ width: `${val}%` }} viewport={{ once: true }}
                                      className={`h-full bg-gradient-to-r ${getBarColor(val, meta.inverted)} rounded-full`} />
                                  </div>
                                </div>
                              )
                            })}
                          </div>
                        )}
                        {narrative && <p className="text-white/50 text-sm font-light leading-relaxed border-t border-white/5 pt-4">{renderBold(narrative)}</p>}
                      </motion.div>
                    )
                  })()}

                  {/* ── 2. CONFLICTO (Gottman) — 4 horsemen bars ── */}
                  {(() => {
                    const score = aiAnalysis.dimension_scores?.interaccion_conflicto ?? 0
                    const subs = aiAnalysis.sub_scores?.interaccion_conflicto
                    const narrative = aiAnalysis.dimension_narratives?.interaccion_conflicto
                    const horsemen = subs ? [
                      { label: 'Crítica/Desprecio', val: subs.critica_desprecio ?? 0, bad: true, emoji: '🗡️' },
                      { label: 'Defensividad', val: subs.defensividad ?? 0, bad: true, emoji: '🛡️' },
                      { label: 'Stonewalling', val: subs.stonewalling ?? 0, bad: true, emoji: '🧱' },
                      { label: 'Capacidad de reparación', val: subs.capacidad_reparacion ?? 0, bad: false, emoji: '🩹' }
                    ] : []
                    return (
                      <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
                        className="p-6 rounded-2xl border border-white/8 bg-gradient-to-br from-red-500/[0.03] to-transparent relative overflow-hidden">
                        <div className="absolute top-0 left-0 right-0 h-[2px]" style={{ background: `linear-gradient(to right, ${DIMENSION_COLORS[1]}40, transparent)` }} />
                        <div className="flex items-center gap-3 mb-4">
                          <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ backgroundColor: `${DIMENSION_COLORS[1]}15`, border: `1px solid ${DIMENSION_COLORS[1]}25` }}>
                            <span className="text-lg">⚡</span>
                          </div>
                          <div className="flex-1">
                            <h3 className="text-white/80 font-light">Interacción y Conflicto (Gottman)</h3>
                            <p className="text-white/30 text-xs font-light">Los 4 jinetes + capacidad de reparación</p>
                          </div>
                          <div className="text-right">
                            <p className="text-2xl font-light text-white">{score}<span className="text-sm text-white/30">%</span></p>
                            <p className={`text-xs ${getLevelPct(score).color}`}>{getLevelPct(score).label}</p>
                          </div>
                        </div>
                        {horsemen.length > 0 && (
                          <div className="grid grid-cols-2 gap-3 mb-4">
                            {horsemen.map((h, i) => (
                              <div key={i} className="p-3 rounded-xl border border-white/5 bg-white/[0.02]">
                                <div className="flex items-center gap-2 mb-2">
                                  <span className="text-sm">{h.emoji}</span>
                                  <span className="text-white/50 text-xs font-light">{h.label}</span>
                                </div>
                                <p className="text-xl font-light text-white mb-1">{h.val}%</p>
                                <div className="h-1.5 bg-white/5 rounded-full overflow-hidden">
                                  <motion.div initial={{ width: 0 }} whileInView={{ width: `${h.val}%` }} viewport={{ once: true }}
                                    className={`h-full bg-gradient-to-r ${getBarColor(h.val, h.bad)} rounded-full`} />
                                </div>
                                {h.bad && h.val > 55 && <p className="text-red-400/50 text-[9px] mt-1">⚠ Atención</p>}
                              </div>
                            ))}
                          </div>
                        )}
                        {narrative && <p className="text-white/50 text-sm font-light leading-relaxed border-t border-white/5 pt-4">{renderBold(narrative)}</p>}
                      </motion.div>
                    )
                  })()}

                  {/* ── 3. AMOR (Sternberg) — Triangle ── */}
                  {(() => {
                    const score = aiAnalysis.dimension_scores?.estructura_amor ?? 0
                    const subs = aiAnalysis.sub_scores?.estructura_amor
                    const narrative = aiAnalysis.dimension_narratives?.estructura_amor
                    const p = subs?.pasion ?? 50, n = subs?.intimidad ?? 50, c = subs?.compromiso ?? 50
                    const cx = 130, topY = 25, botY = 200, leftX = 30, rightX = 230
                    const total = (p + n + c) || 1
                    const dx = (n * cx + p * leftX + c * rightX) / total
                    const dy = (n * topY + p * botY + c * botY) / total
                    return (
                      <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
                        className="p-6 rounded-2xl border border-white/8 bg-gradient-to-br from-indigo-500/[0.03] to-transparent relative overflow-hidden">
                        <div className="absolute top-0 left-0 right-0 h-[2px]" style={{ background: `linear-gradient(to right, ${DIMENSION_COLORS[2]}40, transparent)` }} />
                        <div className="flex items-center gap-3 mb-4">
                          <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ backgroundColor: `${DIMENSION_COLORS[2]}15`, border: `1px solid ${DIMENSION_COLORS[2]}25` }}>
                            <span className="text-lg">△</span>
                          </div>
                          <div className="flex-1">
                            <h3 className="text-white/80 font-light">Estructura del Amor (Sternberg)</h3>
                            <p className="text-white/30 text-xs font-light">Pasión · Intimidad · Compromiso</p>
                          </div>
                          <div className="text-right">
                            <p className="text-2xl font-light text-white">{score}<span className="text-sm text-white/30">%</span></p>
                          </div>
                        </div>
                        <div className="flex flex-col lg:flex-row items-center gap-6">
                          <svg viewBox="0 0 260 230" className="w-full max-w-[260px] flex-shrink-0">
                            <polygon points={`${cx},${topY} ${leftX},${botY} ${rightX},${botY}`} fill="rgba(99,102,241,0.04)" stroke="rgba(255,255,255,0.08)" strokeWidth={0.8} />
                            <circle cx={dx} cy={dy} r={7} fill="rgba(99,102,241,0.5)" stroke="rgba(99,102,241,0.9)" strokeWidth={1.5} />
                            <circle cx={dx} cy={dy} r={14} fill="none" stroke="rgba(99,102,241,0.15)" strokeWidth={0.5} />
                            <text x={cx} y={topY - 8} textAnchor="middle" fill="rgba(59,130,246,0.7)" className="text-[9px] font-medium">Intimidad {n}%</text>
                            <text x={leftX - 2} y={botY + 16} textAnchor="middle" fill="rgba(236,72,153,0.7)" className="text-[9px] font-medium">Pasión {p}%</text>
                            <text x={rightX + 2} y={botY + 16} textAnchor="middle" fill="rgba(16,185,129,0.7)" className="text-[9px] font-medium">Compromiso {c}%</text>
                          </svg>
                          <div className="space-y-2 flex-1 w-full">
                            {[{ label: 'Pasión', val: p, color: 'from-pink-500 to-rose-400' }, { label: 'Intimidad', val: n, color: 'from-blue-500 to-indigo-400' }, { label: 'Compromiso', val: c, color: 'from-emerald-500 to-green-400' }].map((s, i) => (
                              <div key={i}>
                                <div className="flex justify-between mb-0.5"><span className="text-white/45 text-xs">{s.label}</span><span className="text-white/30 text-xs">{s.val}%</span></div>
                                <div className="h-2 bg-white/5 rounded-full overflow-hidden">
                                  <motion.div initial={{ width: 0 }} whileInView={{ width: `${s.val}%` }} viewport={{ once: true }}
                                    className={`h-full bg-gradient-to-r ${s.color} rounded-full opacity-60`} />
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>
                        {narrative && <p className="text-white/50 text-sm font-light leading-relaxed border-t border-white/5 pt-4 mt-4">{renderBold(narrative)}</p>}
                      </motion.div>
                    )
                  })()}

                  {/* ── 4. VÍNCULO EMOCIONAL (Johnson) — connection meter ── */}
                  {/* ── 5. DIFERENCIACIÓN (Schnarch) ── */}
                  {/* ── 6. DESEO (Perel) — sub-scores ── */}
                  {/* ── 7-12: remaining dimensions — each with score + narrative ── */}
                  {(() => {
                    const remainingDims = [
                      { key: 'vinculo_emocional', emoji: '❤️', idx: 3, subtitle: 'Ciclos de conexión y desconexión profunda' },
                      { key: 'diferenciacion', emoji: '🪞', idx: 4, subtitle: 'Identidad propia dentro de la relación' },
                      { key: 'deseo', emoji: '🔥', idx: 5, subtitle: 'Atracción, espontaneidad y novedad', hasSubs: true },
                      { key: 'patrones_inconscientes', emoji: '🔮', idx: 6, subtitle: 'Repeticiones de relaciones pasadas' },
                      { key: 'neurobiologia_amor', emoji: '🧬', idx: 7, subtitle: 'Sensaciones físicas y química del amor' },
                      { key: 'regulacion_emocional', emoji: '🛡️', idx: 8, subtitle: 'Cómo se calman o desregulan mutuamente' },
                      { key: 'apego_aplicado', emoji: '📎', idx: 9, subtitle: 'Reacciones ante la distancia' },
                      { key: 'lenguaje_amor', emoji: '💬', idx: 10, subtitle: 'Cómo expresas y necesitas recibir amor' },
                      { key: 'satisfaccion_mantenimiento', emoji: '📊', idx: 11, subtitle: 'Esfuerzo, equilibrio y satisfacción actual' }
                    ]
                    return remainingDims.map((dim) => {
                      const score = aiAnalysis.dimension_scores?.[dim.key] ?? 0
                      const narrative = aiAnalysis.dimension_narratives?.[dim.key]
                      const subs = dim.hasSubs ? aiAnalysis.sub_scores?.[dim.key] : null
                      const color = DIMENSION_COLORS[dim.idx]
                      const label = DIMENSION_LABELS[dim.key]
                      return (
                        <motion.div key={dim.key} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
                          className="p-6 rounded-2xl border border-white/8 bg-gradient-to-br from-white/[0.02] to-transparent relative overflow-hidden">
                          <div className="absolute top-0 left-0 right-0 h-[2px]" style={{ background: `linear-gradient(to right, ${color}40, transparent)` }} />
                          <div className="flex items-center gap-3 mb-4">
                            <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ backgroundColor: `${color}15`, border: `1px solid ${color}25` }}>
                              <span className="text-lg">{dim.emoji}</span>
                            </div>
                            <div className="flex-1">
                              <h3 className="text-white/80 font-light">{label}</h3>
                              <p className="text-white/30 text-xs font-light">{dim.subtitle}</p>
                            </div>
                            <div className="text-right">
                              <p className="text-2xl font-light text-white">{score}<span className="text-sm text-white/30">%</span></p>
                              <p className={`text-xs ${getLevelPct(score).color}`}>{getLevelPct(score).label}</p>
                            </div>
                          </div>
                          {/* Horizontal bar */}
                          <div className="h-3 bg-white/5 rounded-full overflow-hidden mb-4">
                            <motion.div initial={{ width: 0 }} whileInView={{ width: `${score}%` }} viewport={{ once: true }}
                              transition={{ duration: 0.8 }} className="h-full rounded-full opacity-60" style={{ background: `linear-gradient(to right, ${color}80, ${color}40)` }} />
                          </div>
                          {/* Sub-scores if available (deseo) */}
                          {subs && (
                            <div className="grid grid-cols-3 gap-3 mb-4">
                              {Object.entries(SUB_SCORE_LABELS[dim.key] || {}).map(([subKey, meta]) => {
                                const val = subs[subKey] ?? 0
                                return (
                                  <div key={subKey} className="p-2 rounded-lg border border-white/5 bg-white/[0.02] text-center">
                                    <p className="text-lg font-light text-white">{val}%</p>
                                    <p className="text-white/35 text-[10px] font-light">{meta.label}</p>
                                  </div>
                                )
                              })}
                            </div>
                          )}
                          {narrative && <p className="text-white/50 text-sm font-light leading-relaxed border-t border-white/5 pt-4">{renderBold(narrative)}</p>}
                        </motion.div>
                      )
                    })
                  })()}

                </div>
              </div>

              {/* ══════════════════════════════════════════════════════
                  MAPA DE APEGO (quadrant visualization)
              ══════════════════════════════════════════════════════ */}
              {aiAnalysis.attachment_map && (
                <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
                  <h2 className="text-xl font-light text-white/70 mb-6 text-center">🗺️ Tu Posición en el Mapa de Apego</h2>
                  <div className="p-6 rounded-2xl border border-white/8 bg-white/[0.02]">
                    <div className="flex flex-col items-center gap-4">
                      <div className="px-4 py-2 rounded-full border border-violet-500/20 bg-violet-500/[0.06]">
                        <span className="text-violet-300/80 text-sm font-light">Estilo: {aiAnalysis.attachment_map.style}</span>
                      </div>
                      <svg viewBox="0 0 220 220" className="w-full max-w-[280px]">
                        <rect x="10" y="10" width="100" height="100" fill="rgba(239,68,68,0.04)" rx="4" />
                        <rect x="110" y="10" width="100" height="100" fill="rgba(245,158,11,0.04)" rx="4" />
                        <rect x="10" y="110" width="100" height="100" fill="rgba(16,185,129,0.04)" rx="4" />
                        <rect x="110" y="110" width="100" height="100" fill="rgba(59,130,246,0.04)" rx="4" />
                        <line x1="110" y1="10" x2="110" y2="210" stroke="rgba(255,255,255,0.1)" strokeWidth={0.5} />
                        <line x1="10" y1="110" x2="210" y2="110" stroke="rgba(255,255,255,0.1)" strokeWidth={0.5} />
                        <text x="110" y="7" textAnchor="middle" fill="rgba(255,255,255,0.3)" className="text-[7px]">Alta evitación</text>
                        <text x="110" y="218" textAnchor="middle" fill="rgba(255,255,255,0.3)" className="text-[7px]">Baja evitación</text>
                        <text x="5" y="110" textAnchor="start" fill="rgba(255,255,255,0.3)" className="text-[7px]" transform="rotate(-90 5 110)">Alta ansiedad</text>
                        <text x="215" y="110" textAnchor="end" fill="rgba(255,255,255,0.3)" className="text-[7px]" transform="rotate(90 215 110)">Baja ansiedad</text>
                        <text x="60" y="60" textAnchor="middle" fill="rgba(239,68,68,0.4)" className="text-[7px]">Desorganizado</text>
                        <text x="160" y="60" textAnchor="middle" fill="rgba(245,158,11,0.4)" className="text-[7px]">Evitativo</text>
                        <text x="60" y="160" textAnchor="middle" fill="rgba(16,185,129,0.3)" className="text-[7px]">Ansioso</text>
                        <text x="160" y="160" textAnchor="middle" fill="rgba(59,130,246,0.3)" className="text-[7px]">Seguro</text>
                        <circle
                          cx={110 + ((aiAnalysis.attachment_map.avoidance_level ?? 50) - 50) * 2}
                          cy={110 - ((aiAnalysis.attachment_map.anxiety_level ?? 50) - 50) * 2}
                          r={6} fill="rgba(139,92,246,0.6)" stroke="rgba(139,92,246,0.9)" strokeWidth={1.5} />
                        <circle
                          cx={110 + ((aiAnalysis.attachment_map.avoidance_level ?? 50) - 50) * 2}
                          cy={110 - ((aiAnalysis.attachment_map.anxiety_level ?? 50) - 50) * 2}
                          r={12} fill="none" stroke="rgba(139,92,246,0.2)" strokeWidth={0.5} />
                      </svg>
                      <div className="flex gap-6 text-xs text-white/40 font-light">
                        <span>Ansiedad: {aiAnalysis.attachment_map.anxiety_level ?? 0}%</span>
                        <span>Evitación: {aiAnalysis.attachment_map.avoidance_level ?? 0}%</span>
                      </div>
                    </div>
                  </div>
                </motion.div>
              )}

              {/* ══════════════════════════════════════════════════════
                  DINÁMICA DE CONFLICTO (Sankey Flow)
              ══════════════════════════════════════════════════════ */}
              {aiAnalysis.conflict_flow && (
                <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
                  <h2 className="text-xl font-light text-white/70 mb-6 text-center">⚡ Dinámica de Conflicto</h2>
                  <div className="p-6 rounded-2xl border border-white/8 bg-gradient-to-br from-rose-500/[0.02] to-transparent">
                    <p className="text-white/35 text-xs font-light mb-4 text-center">Cómo fluye el conflicto en tu relación: desde el detonante hasta el resultado habitual</p>
                    <ConflictSankeyChart conflictFlow={aiAnalysis.conflict_flow} />
                  </div>
                </motion.div>
              )}

              {/* ══════════════════════════════════════════════════════
                  PROYECCIÓN DEL VÍNCULO (two scenarios)
              ══════════════════════════════════════════════════════ */}
              {aiAnalysis.future_projection && (
                <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
                  <h2 className="text-xl font-light text-white/70 mb-6 text-center">🔮 Proyección del Vínculo</h2>
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                    {/* Scenario: If continues */}
                    <div className="p-6 rounded-2xl border border-red-500/15 bg-gradient-to-br from-red-500/[0.03] to-transparent relative overflow-hidden">
                      <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-red-500/30 to-orange-500/30" />
                      <div className="flex items-center gap-3 mb-4">
                        <div className="w-10 h-10 rounded-xl bg-red-500/10 border border-red-500/15 flex items-center justify-center">
                          <TrendingDown className="w-5 h-5 text-red-400/50" strokeWidth={1.5} />
                        </div>
                        <div>
                          <h3 className="text-red-300/80 font-light text-sm">Si los patrones continúan</h3>
                          <p className="text-white/25 text-[10px] font-light">Sin intervención profesional</p>
                        </div>
                      </div>
                      <div className="space-y-2">
                        {(aiAnalysis.future_projection.if_continues || '').split('\n\n').map((p, i) => (
                          <p key={i} className="text-white/50 text-sm font-light leading-relaxed">{renderBold(p)}</p>
                        ))}
                      </div>
                    </div>
                    {/* Scenario: If changes */}
                    <div className="p-6 rounded-2xl border border-emerald-500/15 bg-gradient-to-br from-emerald-500/[0.03] to-transparent relative overflow-hidden">
                      <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-emerald-500/30 to-teal-500/30" />
                      <div className="flex items-center gap-3 mb-4">
                        <div className="w-10 h-10 rounded-xl bg-emerald-500/10 border border-emerald-500/15 flex items-center justify-center">
                          <TrendingUp className="w-5 h-5 text-emerald-400/50" strokeWidth={1.5} />
                        </div>
                        <div>
                          <h3 className="text-emerald-300/80 font-light text-sm">Si deciden trabajarlo</h3>
                          <p className="text-white/25 text-[10px] font-light">Con trabajo consciente o terapia</p>
                        </div>
                      </div>
                      <div className="space-y-2">
                        {(aiAnalysis.future_projection.if_changes || '').split('\n\n').map((p, i) => (
                          <p key={i} className="text-white/50 text-sm font-light leading-relaxed">{renderBold(p)}</p>
                        ))}
                      </div>
                    </div>
                  </div>
                </motion.div>
              )}

              {/* ══════════════════════════════════════════════════════
                  LO QUE TU HISTORIA REVELÓ (empathic opening)
              ══════════════════════════════════════════════════════ */}
              {aiAnalysis.empathic_opening && (
                <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
                  className="p-6 lg:p-8 rounded-2xl border border-violet-500/10 bg-gradient-to-br from-violet-500/[0.03] to-transparent relative overflow-hidden">
                  <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-violet-500/30 to-fuchsia-500/30" />
                  <div className="flex items-center gap-3 mb-5">
                    <div className="w-10 h-10 rounded-xl bg-violet-500/10 border border-violet-500/20 flex items-center justify-center">
                      <Sparkles className="w-5 h-5 text-violet-400/50" strokeWidth={1.5} />
                    </div>
                    <h2 className="text-xl font-light text-white/70">Lo que tu historia reveló</h2>
                  </div>
                  <div className="space-y-3">
                    {aiAnalysis.empathic_opening.split('\n\n').map((p, i) => {
                      const paragraphs = aiAnalysis.empathic_opening.split('\n\n')
                      const isFirst = i === 0, isLast = i === paragraphs.length - 1
                      return (
                        <div key={i} className="flex items-start gap-3 p-3 rounded-xl bg-white/[0.02] border border-white/[0.04]">
                          {isFirst ? <CheckCircle className="w-4 h-4 text-emerald-400/60 flex-shrink-0 mt-0.5" strokeWidth={1.5} /> :
                           isLast ? <Star className="w-4 h-4 text-violet-400/60 flex-shrink-0 mt-0.5" strokeWidth={1.5} /> :
                           <AlertTriangle className="w-4 h-4 text-amber-400/50 flex-shrink-0 mt-0.5" strokeWidth={1.5} />}
                          <p className="text-white/55 text-sm font-light leading-relaxed">{renderBold(p)}</p>
                        </div>
                      )
                    })}
                  </div>
                </motion.div>
              )}

              {/* ── INDIVIDUAL INSIGHTS (expandable) ── */}
              {aiAnalysis.individual_insights && (
                <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
                  <h2 className="text-xl font-light text-white/70 mb-6 text-center">Tu Perfil Relacional</h2>
                  <div className="space-y-3">
                    {[
                      { key: 'emotional_style', label: 'Estilo emocional', emoji: '🎭' },
                      { key: 'attachment_patterns', label: 'Patrones de apego', emoji: '🔗' },
                      { key: 'defense_mechanisms', label: 'Mecanismos de defensa', emoji: '🛡️' },
                      { key: 'what_they_seek_in_love', label: 'Lo que buscas en el amor', emoji: '💕' },
                      { key: 'emotional_triggers', label: 'Detonantes emocionales', emoji: '⚡' },
                      { key: 'repeating_patterns', label: 'Patrones que se repiten', emoji: '🔄' },
                      { key: 'hidden_needs', label: 'Necesidades ocultas', emoji: '🔮' },
                      { key: 'role_in_relationship', label: 'Tu rol en la relación', emoji: '👤' },
                      { key: 'differentiation_profile', label: 'Perfil de diferenciación', emoji: '🧲' }
                    ].map(({ key, label, emoji }) => {
                      const text = aiAnalysis.individual_insights[key]
                      if (!text) return null
                      const paragraphs = text.split('\n\n')
                      const isExpanded = expandedInsights[key]
                      return (
                        <div key={key} className="p-4 rounded-xl border border-white/8 bg-white/[0.02] cursor-pointer" onClick={() => toggleInsight(key)}>
                          <div className="flex items-center gap-3 mb-2">
                            <span className="text-base">{emoji}</span>
                            <h3 className="text-white/75 font-light text-sm flex-1">{label}</h3>
                            <ChevronDown className={`w-4 h-4 text-white/25 transition-transform ${isExpanded ? 'rotate-180' : ''}`} />
                          </div>
                          <div className="text-white/50 text-sm font-light leading-relaxed space-y-2">
                            {(isExpanded ? paragraphs : paragraphs.slice(0, 1)).map((p, i) => <p key={i}>{renderBold(p)}</p>)}
                          </div>
                          {!isExpanded && paragraphs.length > 1 && <p className="text-violet-400/40 text-xs mt-1">Ver más →</p>}
                        </div>
                      )
                    })}
                  </div>
                </motion.div>
              )}

              {/* ── COUPLE INSIGHTS (expandable) ── */}
              {aiAnalysis.couple_insights && (
                <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
                  <h2 className="text-xl font-light text-white/70 mb-6 text-center">Dinámica de Pareja</h2>
                  <div className="space-y-3">
                    {[
                      { key: 'real_relationship_dynamic', label: 'Dinámica real', emoji: '🔄' },
                      { key: 'unconscious_patterns', label: 'Patrones inconscientes', emoji: '🧩' },
                      { key: 'conflict_and_defense', label: 'Conflicto y defensa', emoji: '⚔️' },
                      { key: 'distancing_dynamics', label: 'Distanciamiento', emoji: '📏' },
                      { key: 'attachment_and_support', label: 'Apego y apoyo', emoji: '🤝' },
                      { key: 'strengths_of_the_relationship', label: 'Fortalezas', emoji: '💪' },
                      { key: 'love_languages_analysis', label: 'Lenguajes del amor', emoji: '💬' },
                      { key: 'global_relationship_diagnosis', label: 'Diagnóstico global', emoji: '🩺' }
                    ].map(({ key, label, emoji }) => {
                      const text = aiAnalysis.couple_insights[key]
                      if (!text) return null
                      const paragraphs = text.split('\n\n')
                      const ck = `couple_${key}`
                      const isExpanded = expandedInsights[ck]
                      return (
                        <div key={key} className="p-4 rounded-xl border border-white/8 bg-white/[0.02] cursor-pointer" onClick={() => toggleInsight(ck)}>
                          <div className="flex items-center gap-3 mb-2">
                            <span className="text-base">{emoji}</span>
                            <h3 className="text-white/75 font-light text-sm flex-1">{label}</h3>
                            <ChevronDown className={`w-4 h-4 text-white/25 transition-transform ${isExpanded ? 'rotate-180' : ''}`} />
                          </div>
                          <div className="text-white/50 text-sm font-light leading-relaxed space-y-2">
                            {(isExpanded ? paragraphs : paragraphs.slice(0, 1)).map((p, i) => <p key={i}>{renderBold(p)}</p>)}
                          </div>
                          {!isExpanded && paragraphs.length > 1 && <p className="text-violet-400/40 text-xs mt-1">Ver más →</p>}
                        </div>
                      )
                    })}
                  </div>
                </motion.div>
              )}

              {/* ── DOMINANT CYCLES ── */}
              {aiAnalysis.dominant_cycles?.length > 0 && (
                <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
                  <h2 className="text-xl font-light text-white/70 mb-6 text-center">🔄 Ciclos Relacionales Dominantes</h2>
                  <div className="space-y-4">
                    {aiAnalysis.dominant_cycles.map((cycle, i) => (
                      <div key={i} className="p-5 rounded-2xl border border-amber-500/15 bg-gradient-to-br from-amber-500/[0.03] to-transparent relative overflow-hidden">
                        <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-amber-500/30 to-orange-500/30" />
                        <div className="flex items-center gap-3 mb-3">
                          <span className="text-lg">🔁</span>
                          <h3 className="text-amber-300/80 font-light flex-1">{cycle.name}</h3>
                        </div>
                        {cycle.name && (
                          <div className="flex items-center justify-center gap-2 mb-4 py-3 px-4 rounded-xl bg-amber-500/[0.05] border border-amber-500/10 flex-wrap">
                            {cycle.name.split(/[-–→]/g).map((step, si, arr) => (
                              <span key={si} className="flex items-center gap-2">
                                <span className="text-amber-300/70 text-sm font-light">{step.trim()}</span>
                                {si < arr.length - 1 && <ArrowRight className="w-3.5 h-3.5 text-amber-400/40" />}
                              </span>
                            ))}
                            <span className="text-amber-400/50 text-[10px]">↻</span>
                          </div>
                        )}
                        <p className="text-white/55 text-sm font-light leading-relaxed">{renderBold(cycle.explanation)}</p>
                      </div>
                    ))}
                  </div>
                </motion.div>
              )}

              {/* ── EMOTIONAL SENSITIVITIES ── */}
              {aiAnalysis.activated_emotional_sensitivities?.length > 0 && (
                <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
                  <h2 className="text-xl font-light text-white/70 mb-6 text-center">Sensibilidades Emocionales Activadas</h2>
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                    {aiAnalysis.activated_emotional_sensitivities.map((sens, i) => (
                      <div key={i} className="p-5 rounded-2xl border border-rose-500/15 bg-gradient-to-br from-rose-500/[0.03] to-transparent">
                        <h3 className="text-rose-300/80 font-light mb-2">{sens.name}</h3>
                        <p className="text-white/50 text-sm font-light leading-relaxed">{renderBold(sens.description)}</p>
                      </div>
                    ))}
                  </div>
                </motion.div>
              )}

              {/* ── KEY INSIGHT ── */}
              {aiAnalysis.key_insight && (
                <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
                  className="p-6 lg:p-8 rounded-2xl border border-cyan-500/15 bg-gradient-to-br from-cyan-500/[0.03] to-transparent relative overflow-hidden">
                  <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-cyan-500/30 to-teal-500/30" />
                  <div className="flex items-center gap-3 mb-4">
                    <Zap className="w-6 h-6 text-cyan-400/50" strokeWidth={1.5} />
                    <h2 className="text-xl font-light text-white/70">Observación Clave</h2>
                  </div>
                  <p className="text-white/60 text-base font-light leading-relaxed">{renderBold(aiAnalysis.key_insight)}</p>
                </motion.div>
              )}

              {/* ── RECOMMENDATION ── */}
              {aiAnalysis.recommendation && (
                <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
                  className="p-6 lg:p-8 rounded-2xl border border-emerald-500/15 bg-gradient-to-br from-emerald-500/[0.03] to-transparent relative overflow-hidden">
                  <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-emerald-500/30 to-green-500/30" />
                  <div className="flex items-center gap-3 mb-4">
                    <Star className="w-6 h-6 text-emerald-400/50" strokeWidth={1.5} />
                    <h2 className="text-xl font-light text-white/70">Recomendación Profesional</h2>
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

              {/* ── SESSION WORK ITEMS (temas para terapia) ── */}
              {aiAnalysis.session_work_items?.length > 0 && (
                <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
                  <h2 className="text-xl font-light text-white/70 mb-6 text-center">Temas para Trabajar en Terapia</h2>
                  <div className="space-y-3">
                    {aiAnalysis.session_work_items.map((item, i) => {
                      const { title, description } = parseItemTitle(item)
                      return (
                        <div key={i} className="p-4 rounded-xl border border-violet-500/10 bg-violet-500/[0.02] flex items-start gap-3">
                          <div className="w-7 h-7 rounded-lg bg-violet-500/10 border border-violet-500/15 flex items-center justify-center flex-shrink-0 mt-0.5">
                            <span className="text-violet-400/60 text-xs">{i + 1}</span>
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

              {/* ── ACTIONS: PDF + WhatsApp ── */}
              <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
                className="flex flex-col sm:flex-row items-center gap-4 justify-center pt-8 border-t border-white/5">
                <motion.button onClick={generatePDF} disabled={pdfGenerating}
                  whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}
                  className="flex items-center gap-2 px-6 py-3 rounded-xl border border-violet-500/20 bg-violet-500/10 text-violet-300/80 text-sm font-light hover:bg-violet-500/20 transition-all disabled:opacity-40">
                  {pdfGenerating ? <Loader2 className="w-4 h-4 animate-spin" /> : <Download className="w-4 h-4" />}
                  Descargar PDF
                </motion.button>
                <motion.button
                  onClick={() => {
                    const msg = `Hola! Acabo de hacer la Radiografía de Pareja y me gustaría agendar una sesión para profundizar en mis resultados.`
                    window.open(`https://wa.me/527228720520?text=${encodeURIComponent(msg)}`, '_blank')
                  }}
                  whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}
                  className="flex items-center gap-2 px-6 py-3 rounded-xl bg-gradient-to-r from-violet-600 to-fuchsia-600 text-white text-sm font-light">
                  Agendar sesión profesional
                </motion.button>
              </motion.div>

              {/* ── CONSULTATION CTA — $1,199 ── */}
              <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
                className="p-8 rounded-2xl border border-violet-500/20 bg-gradient-to-br from-violet-500/[0.06] to-fuchsia-500/[0.03] relative overflow-hidden">
                <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-violet-500/50 via-fuchsia-500/50 to-pink-500/50" />
                <div className="text-center space-y-4">
                  <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-violet-500/15 to-fuchsia-500/10 border border-violet-500/20 flex items-center justify-center mx-auto">
                    <Users className="w-7 h-7 text-violet-400/60" strokeWidth={1.5} />
                  </div>
                  <div>
                    <h3 className="text-xl font-light text-white mb-2">Lleva este diagnóstico a una sesión profesional</h3>
                    <p className="text-white/40 text-sm font-light leading-relaxed max-w-lg mx-auto">
                      Un psicólogo clínico interpreta tus resultados contigo en una sesión privada de 1 hora.
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
