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

// ─── PREGUNTAS: DIAGNÓSTICO GRATUITO (15 preguntas, ~3 min) ──────
// Las 15 mejores del set premium — directas, claras, fáciles de responder.

const QUESTIONS_QUICK = [
  // Comunicación (2)
  { id: 101, text: 'Mi pareja y yo nos entendemos bien sin necesitar largas explicaciones.', area: 'comunicacion', inverted: false, sampleValue: 3 },
  { id: 102, text: 'Hay temas que prefiero no hablar con mi pareja porque sé que habrá conflicto.', area: 'comunicacion', inverted: true, sampleValue: 4 },
  // Intimidad (2)
  { id: 201, text: 'Me siento emocionalmente cerca de mi pareja en el día a día.', area: 'intimidad', inverted: false, sampleValue: 3 },
  { id: 203, text: 'El contacto físico con mi pareja sigue siendo natural y espontáneo.', area: 'intimidad', inverted: false, sampleValue: 3 },
  // Admiración (2)
  { id: 301, text: 'Cuando mi pareja logra algo, siento orgullo genuino por ella/él.', area: 'admiracion', inverted: false, sampleValue: 4 },
  { id: 302, text: 'A veces siento que estaría mejor con alguien que ve las cosas diferente.', area: 'admiracion', inverted: true, sampleValue: 3 },
  // Conflicto (2)
  { id: 401, text: 'Hay temas que hemos dejado de discutir porque nunca llevan a nada.', area: 'conflicto', inverted: true, sampleValue: 4 },
  { id: 403, text: 'Después de una pelea fuerte, entiendo mejor a mi pareja o algo de mí.', area: 'conflicto', inverted: false, sampleValue: 2 },
  // Proyecto de vida (1)
  { id: 501, text: 'Cuando imagino mi vida en 10 años, mi pareja está ahí.', area: 'proyecto', inverted: false, sampleValue: 3 },
  // Seguridad emocional (2)
  { id: 601, text: 'Puedo mostrarme vulnerable con mi pareja sin miedo a que lo use en mi contra.', area: 'seguridad', inverted: false, sampleValue: 2 },
  { id: 602, text: 'A veces cambio cómo actúo dependiendo de cómo creo que mi pareja va a reaccionar.', area: 'seguridad', inverted: true, sampleValue: 4 },
  // Autonomía (2)
  { id: 701, text: 'Me cuesta disfrutar algo si mi pareja no puede ser parte de ello.', area: 'autonomia', inverted: true, sampleValue: 4 },
  { id: 703, text: 'Noto que cuando estoy bien conmigo mismo/a, mi relación también funciona mejor.', area: 'autonomia', inverted: false, sampleValue: 3 },
  // Idealización (2)
  { id: 801, text: 'Si mi pareja cambiara mucho como persona, no sé si seguiría siendo la misma relación para mí.', area: 'idealizacion', inverted: true, sampleValue: 4 },
  { id: 804, text: 'A veces me pregunto si lo que siento es amor o miedo a estar solo/a.', area: 'idealizacion', inverted: true, sampleValue: 4 }
]

// ─── PREGUNTAS: DIAGNÓSTICO PREMIUM — CONFIRMATORIAS (25 preguntas, 3 por área) ───
// Directas y claras. Sin ambigüedad. La intención clínica está en la estructura, no en el enredo.

const QUESTIONS_DETAILED = [
  // Comunicación (3)
  { id: 101, text: 'Mi pareja y yo nos entendemos bien sin necesitar largas explicaciones.', area: 'comunicacion', inverted: false, sampleValue: 3 },
  { id: 102, text: 'Hay temas que prefiero no hablar con mi pareja porque sé que habrá conflicto.', area: 'comunicacion', inverted: true, sampleValue: 4 },
  { id: 103, text: 'Cuando tenemos una discusión, al final ambos entendemos qué pasó y por qué.', area: 'comunicacion', inverted: false, sampleValue: 2 },
  // Intimidad (3)
  { id: 201, text: 'Me siento emocionalmente cerca de mi pareja en el día a día.', area: 'intimidad', inverted: false, sampleValue: 3 },
  { id: 202, text: 'Hay cosas de lo que siento que prefiero no compartir con mi pareja.', area: 'intimidad', inverted: true, sampleValue: 4 },
  { id: 203, text: 'El contacto físico con mi pareja sigue siendo natural y espontáneo.', area: 'intimidad', inverted: false, sampleValue: 3 },
  // Admiración (3)
  { id: 301, text: 'Cuando mi pareja logra algo, siento orgullo genuino por ella/él.', area: 'admiracion', inverted: false, sampleValue: 4 },
  { id: 302, text: 'A veces siento que estaría mejor con alguien que ve las cosas diferente.', area: 'admiracion', inverted: true, sampleValue: 3 },
  { id: 303, text: 'Hay algo en mi pareja que sigue pareciéndome genuinamente único y valioso.', area: 'admiracion', inverted: false, sampleValue: 4 },
  // Conflicto (3)
  { id: 401, text: 'Hay temas que hemos dejado de discutir porque nunca llevan a nada.', area: 'conflicto', inverted: true, sampleValue: 4 },
  { id: 402, text: 'Cuando peleamos, reconozco el patrón porque ya ha pasado antes de la misma manera.', area: 'conflicto', inverted: true, sampleValue: 4 },
  { id: 403, text: 'Después de una pelea fuerte, entiendo mejor a mi pareja o algo de mí.', area: 'conflicto', inverted: false, sampleValue: 2 },
  // Proyecto de vida (3)
  { id: 501, text: 'Cuando imagino mi vida en 10 años, mi pareja está ahí.', area: 'proyecto', inverted: false, sampleValue: 3 },
  { id: 502, text: 'Lo que cada uno quiere para su vida encaja de forma natural.', area: 'proyecto', inverted: false, sampleValue: 3 },
  { id: 503, text: 'Hay cosas que quiero para mi vida y que prefiero no mencionar mucho en la relación.', area: 'proyecto', inverted: true, sampleValue: 3 },
  // Seguridad emocional (3)
  { id: 601, text: 'Puedo mostrarme vulnerable con mi pareja sin miedo a que lo use en mi contra.', area: 'seguridad', inverted: false, sampleValue: 2 },
  { id: 602, text: 'A veces cambio cómo actúo dependiendo de cómo creo que mi pareja va a reaccionar.', area: 'seguridad', inverted: true, sampleValue: 4 },
  { id: 603, text: 'Hay partes de mi historia que prefiero que mi pareja no conozca demasiado bien.', area: 'seguridad', inverted: true, sampleValue: 3 },
  // Autonomía (3)
  { id: 701, text: 'Me cuesta disfrutar algo si mi pareja no puede ser parte de ello.', area: 'autonomia', inverted: true, sampleValue: 4 },
  { id: 702, text: 'Tomo decisiones importantes para mí sin necesitar primero la aprobación de mi pareja.', area: 'autonomia', inverted: false, sampleValue: 3 },
  { id: 703, text: 'Noto que cuando estoy bien conmigo mismo/a, mi relación también funciona mejor.', area: 'autonomia', inverted: false, sampleValue: 3 },
  // Idealización (4 — área clave para análisis psicoanalítico)
  { id: 801, text: 'Si mi pareja cambiara mucho como persona, no sé si seguiría siendo la misma relación para mí.', area: 'idealizacion', inverted: true, sampleValue: 4 },
  { id: 802, text: 'Cuando algo me molesta de mi pareja, prefiero recordar los momentos buenos en lugar de abordarlo.', area: 'idealizacion', inverted: true, sampleValue: 3 },
  { id: 803, text: 'En los momentos difíciles, tengo claro por qué elegí a esta persona.', area: 'idealizacion', inverted: false, sampleValue: 3 },
  { id: 804, text: 'A veces me pregunto si lo que siento es amor o miedo a estar solo/a.', area: 'idealizacion', inverted: true, sampleValue: 4 }
]

// ─── PREGUNTAS ABIERTAS (Premium — corazón del diagnóstico) ───────────────
// Diseñadas para que la persona hable sin darse cuenta de lo que revela.
// Intención clínica real oculta bajo preguntas que suenan conversacionales.

const PHILOSOPHICAL_QUESTIONS = [
  { id: 'p1', text: 'Antes de empezar: descríbeme a tu pareja en tres palabras.', sample: 'Intensa, presente, complicada' },
  { id: 'p2', text: '¿Cómo supiste que esta persona era para ti? ¿Qué estaba pasando en tu vida en ese momento?', sample: 'La conocí cuando estaba en un momento muy solitario, después de una ruptura difícil. Algo cuadró de inmediato.' },
  { id: 'p3', text: '¿Cuál fue el primer momento en que algo se sintió... raro? No tiene que ser un conflicto grande.', sample: 'Cuando canceló algo importante para mí y no pareció importarle mucho. No fue grande, pero algo cambió.' },
  { id: 'p4', text: '¿Hay algo que haces diferente cuando tu pareja está triste o enojada contigo?', sample: 'Me quedo callado. Trato de no añadir más tensión y espero a que pase.' },
  { id: 'p5', text: 'Si le pidieras algo a tu pareja y no te lo pudiera dar, ¿qué sería eso? No lo más obvio, sino lo más honesto.', sample: 'Que me buscara de noche sin que yo tuviera que pedirlo.' },
  { id: 'p6', text: '¿Qué cosas de ti han cambiado desde que están juntos? Las que agradeces y las que no tanto.', sample: 'Me volví más reflexivo, pero también más ansioso. Perdí algo de ligereza que tenía antes.' },
  { id: 'p7', text: 'Cuéntame de un momento reciente en que te sentiste muy conectado/a con tu pareja. ¿Qué estaban haciendo?', sample: 'El domingo pasado. Cocinamos juntos en silencio y todo estaba tranquilo, del buen silencio.' },
  { id: 'p8', text: '¿Y uno en que te sentiste completamente solo/a estando con él/ella?', sample: 'En una cena con sus amigos. Estaba ahí pero me sentí completamente invisible para ella.' },
  { id: 'p9', text: 'Cuando imaginaste cómo sería tener pareja — antes de esta relación — ¿se parece a lo que tienes hoy?', sample: 'Para nada. Imaginé algo más calmado. Esto es más intenso y más confuso de lo que creía.' },
  { id: 'p10', text: '¿Hay algo que tu pareja hace que te mueve por dentro y no entiendes muy bien por qué te lo hace sentir?', sample: 'Cuando me corrige directamente frente a otros. Me molesta más de lo que debería.' },
  { id: 'p11', text: 'Si le preguntara a tu pareja cómo estás tú en esta relación, ¿qué crees que diría?', sample: 'Que la amo pero que a veces me cierro sin explicarle por qué.' },
  { id: 'p12', text: '¿Hay alguien de tu historia pasada con quien tu pareja se parezca en algo — en la forma de ser, no en lo físico?', sample: 'Sí. Mi madre también era muy directa y fría cuando algo no le gustaba.' },
  { id: 'p13', text: '¿Qué es lo más difícil de soltarte dentro de esta relación?', sample: 'El control. Necesito tener claridad de todo y en esta relación no siempre la tengo.' },
  { id: 'p14', text: 'Si mañana supieras que esta relación va a terminar, ¿cuál sería tu mayor miedo? No el más obvio, sino el más honesto.', sample: 'Que no vuelva a encontrar esta profundidad intelectual con alguien más.' },
  { id: 'p15', text: '¿Qué necesitarías saber de ti mismo/a para poder elegir mejor en esta relación?', sample: 'Por qué siempre elijo personas que de alguna forma no están del todo disponibles.' }
]

// ─── PREGUNTAS FLASH (Premium — proyectivas, sin filtro racional) ─────────
// 5 frases para completar + 5 elecciones forzadas.
// Respuestas en menos de 3 segundos: lo que sale sin pensar revela lo inconsciente.

const FLASH_QUESTIONS = [
  { id: 'f1', type: 'complete', stem: 'Cuando pienso en mi pareja, lo primero que siento es', sample: 'calma mezclada con algo de inquietud' },
  { id: 'f2', type: 'complete', stem: 'Lo que más me da miedo en esta relación es', sample: 'que se aburra de mí' },
  { id: 'f3', type: 'complete', stem: 'Cuando estamos bien juntos, yo soy', sample: 'más yo mismo/a' },
  { id: 'f4', type: 'complete', stem: 'Sin mi pareja, yo sería', sample: 'más libre pero más solo/a' },
  { id: 'f5', type: 'complete', stem: 'El amor debería ser ___, pero en mi relación es', sample: 'tranquilo, pero en mi relación es impredecible' },
  { id: 'f6', type: 'choice', text: '¿Quién cede más en esta relación?', options: ['Yo', 'Mi pareja', 'Los dos igual'] },
  { id: 'f7', type: 'choice', text: '¿Antes de esta relación eras...?', options: ['Más feliz', 'Igual de feliz', 'Menos feliz'] },
  { id: 'f8', type: 'choice', text: '¿Sientes que tu pareja te conoce de verdad?', options: ['Sí', 'En parte', 'No del todo'] },
  { id: 'f9', type: 'choice', text: '¿Prefieres que tu pareja te...?', options: ['Necesite', 'Elija'] },
  { id: 'f10', type: 'choice', text: '¿Estarías con tu pareja si supieras que nunca va a cambiar?', options: ['Sí', 'No sé', 'No'] }
]

// ─── PERFILES MOCK (DEV) ──────────────────────────────────────────
const MOCK_PROFILES = [
  {
    name: '😰 Apego Ansioso',
    desc: 'Alta dependencia, miedo al abandono, idealización',
    philosophical: {
      0: 'Intensa, presente, complicada',
      1: 'La conocí cuando estaba pasando por un momento de mucha soledad después de una ruptura difícil. Sentí que llenó un vacío muy grande.',
      2: 'Creo que fue cuando empezó a contradecirme en cosas pequeñas que antes aceptaba. Nada grave, pero algo cambió.',
      3: 'Me pongo muy callado. Me retiro para que no se moleste más.',
      4: 'Que me escuche de verdad cuando estoy mal, sin darme consejos de inmediato.',
      5: 'Me he vuelto más ansioso. Antes era más independiente.',
      6: 'El fin de semana pasado vimos una película juntos y fue muy tranquilo y bonito.',
      7: 'En una cena familiar. Estaba ahí pero yo me sentí invisible para ella.',
      8: 'Pensé que sería más fácil. Que habría más complicidad.',
      9: 'Cuando se ríe de cierta manera. No sé por qué me afecta tanto.',
      10: 'Creo que diría que estoy bien pero que a veces me cierro.',
      11: 'Sí, en cómo evita los conflictos directo. Mi mamá hacía lo mismo.',
      12: 'El miedo a no volver a sentir esto con alguien más.',
      13: 'Quedarme solo otra vez.',
      14: 'Entender por qué me engancho tanto con personas que no están del todo disponibles.'
    },
    flash: { f1: 'ansiedad mezclada con ternura', f2: 'que se aburra de mí', f3: 'más yo mismo', f4: 'más libre pero más solo', f5: 'ser calma, pero en mi relación es incertidumbre', f6: 'Yo', f7: 'Igual de feliz', f8: 'En parte', f9: 'Elija', f10: 'No sé' },
    answers: { 101: 3, 102: 4, 103: 2, 201: 4, 202: 4, 203: 3, 301: 4, 302: 3, 303: 4, 401: 4, 402: 4, 403: 2, 501: 3, 502: 3, 503: 3, 601: 2, 602: 4, 603: 3, 701: 4, 702: 2, 703: 3, 801: 4, 802: 3, 803: 3, 804: 4 }
  },
  {
    name: '🧊 Evitativo',
    desc: 'Distancia emocional, hiperautonomía, intimidad baja',
    philosophical: {
      0: 'Estable. Funcional. No sé si eso es suficiente.',
      1: 'No recuerdo un momento exacto. Fue gradual, práctico. Coincidimos en muchas cosas.',
      2: 'No sabría ubicar un momento. Quizá cuando empezó a pedirme más cercanía de la que puedo dar.',
      3: 'Lo resuelvo solo, necesito estar tranquilo para pensar. Prefiero no hablar hasta que se me pase.',
      4: 'Honestamente, que me deje en paz cuando necesito mi espacio sin tomárselo personal.',
      5: 'Me he distanciado un poco. Pero creo que así funciono mejor.',
      6: 'No se me ocurre un momento especial reciente. Pero tampoco ha habido problemas graves.',
      7: 'Cuando insistió en que le contara algo personal y yo simplemente no quería hacerlo.',
      8: 'Pensé que sería más tranquilo. Menos demandante emocionalmente.',
      9: 'Nada en particular. Quizá cuando las cosas fluyen sin mucha complicación.',
      10: 'Diría que soy frío, pero yo creo que simplemente soy reservado.',
      11: 'Mi papá era igual. No hablaba de sus cosas y la casa funcionaba bien así.',
      12: 'Creo que a perder mi independencia. A que la relación me consuma.',
      13: 'Perderme a mí mismo en algo que se siente como una obligación constante.',
      14: 'Por qué me cuesta tanto conectar emocionalmente aunque sé que debería.'
    },
    flash: { f1: 'tranquilidad', f2: 'que me absorba', f3: 'igual que siempre', f4: 'más tranquilo', f5: 'algo sencillo, pero en mi relación es algo complicado', f6: 'Mi pareja', f7: 'Igual de feliz', f8: 'No del todo', f9: 'Elija', f10: 'Sí' },
    answers: { 101: 3, 102: 3, 103: 3, 201: 2, 202: 2, 203: 2, 301: 3, 302: 3, 303: 3, 401: 3, 402: 3, 403: 3, 501: 4, 502: 4, 503: 2, 601: 3, 602: 2, 603: 2, 701: 1, 702: 5, 703: 4, 801: 3, 802: 2, 803: 4, 804: 2 }
  },
  {
    name: '💚 Saludable con roces',
    desc: 'Buena base, conflictos normales, comunicación decente',
    philosophical: {
      0: 'Bonita. Imperfecta. Pero algo que elijo cada día.',
      1: 'Nos conocimos por amigos en común. Me gustó cómo me hacía reír y me sentí segura desde el inicio.',
      2: 'Cuando tuvimos nuestro primer desacuerdo fuerte sobre algo importante. Me di cuenta de que no estaba de acuerdo en todo.',
      3: 'Intento decir lo que me pasa aunque me cueste. A veces me tardo, pero lo digo.',
      4: 'Que me vea como soy ahora, no como era al principio.',
      5: 'Más paciente. También más consciente de mis propias limitaciones.',
      6: 'Ayer cocinamos juntos y nos estuvimos riendo de una tontería como media hora.',
      7: 'Cuando se olvidó de algo que para mí era importante. No fue adrede pero me dolió.',
      8: 'Pensé que nunca pelearíamos. Ahora sé que pelear bien es parte del proceso.',
      9: 'Cuando me abraza sin razón. Es como si todo estuviera en su lugar.',
      10: 'Que soy buena compañera pero a veces demasiado exigente.',
      11: 'Algo sí. Mi mamá era muy exigente con mi papá y yo a veces me veo haciéndolo.',
      12: 'A que la rutina mate lo que hemos construido.',
      13: 'Conformarme con algo que ya no crece.',
      14: 'Aprender a dejar de controlar todo para sentirme segura.'
    },
    flash: { f1: 'cariño y algo de costumbre', f2: 'que nos estanquemos', f3: 'más ligera y más graciosa', f4: 'más sola, pero capaz', f5: 'ser crecimiento, y en mi relación a veces lo es', f6: 'Los dos igual', f7: 'Igual de feliz', f8: 'Sí', f9: 'Elija', f10: 'Sí' },
    answers: { 101: 4, 102: 2, 103: 4, 201: 4, 202: 2, 203: 4, 301: 5, 302: 2, 303: 5, 401: 2, 402: 3, 403: 4, 501: 5, 502: 4, 503: 2, 601: 4, 602: 2, 603: 2, 701: 2, 702: 4, 703: 5, 801: 2, 802: 2, 803: 5, 804: 1 }
  },
  {
    name: '🔗 Codependiente',
    desc: 'Fusión, sin límites, pérdida de identidad',
    philosophical: {
      0: 'Es todo. Sin esta relación no sé quién soy.',
      1: 'Llegó cuando yo estaba destruida emocionalmente. Fue como un salvavidas. Le debo mucho.',
      2: 'Cuando me di cuenta de que ya no hacía nada sin consultarle primero. Pero tampoco es que me moleste.',
      3: 'Le pido perdón aunque no sepa qué hice mal. Lo importante es que no se enoje.',
      4: 'Que nunca me deje. Que siempre esté. Que sea mi todo.',
      5: 'Ya no sé dónde empieza mi pareja y dónde termino yo. Supongo que eso es amor.',
      6: 'Cada vez que estamos juntos es bueno. No me gusta cuando no está.',
      7: 'Cuando salió con sus amigos sin mí. No me dijo nada malo pero me sentí vacía.',
      8: 'Que seríamos inseparables. Y lo somos. Pero a veces se siente pesado.',
      9: 'Cuando me dice que me necesita. Eso me hace sentir que existo.',
      10: 'Que soy intensa. Pero yo creo que simplemente amo con todo.',
      11: 'Mi mamá vivía por mi papá. Cuando él se fue, ella se apagó. No quiero que eso me pase.',
      12: 'Que me deje. No sabría qué hacer conmigo misma.',
      13: 'Estar sola. Siempre. Sola de verdad.',
      14: 'Por qué necesito tanto a alguien para sentirme completa.'
    },
    flash: { f1: 'necesidad absoluta', f2: 'que me abandone', f3: 'nadie, me pierdo en el otro', f4: 'vacía, como si no existiera', f5: 'fusión total, y en mi relación lo es pero duele', f6: 'Yo', f7: 'Menos feliz', f8: 'Sí', f9: 'Necesite', f10: 'Sí' },
    answers: { 101: 4, 102: 4, 103: 3, 201: 5, 202: 4, 203: 5, 301: 5, 302: 1, 303: 5, 401: 4, 402: 4, 403: 2, 501: 5, 502: 4, 503: 1, 601: 3, 602: 5, 603: 4, 701: 5, 702: 1, 703: 2, 801: 5, 802: 5, 803: 5, 804: 5 }
  }
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

// ─── ANÁLISIS: LISTA DE TAREAS (estilo antivirus) ─────────────────

const ANALYSIS_TASK_GROUPS = [
  {
    label: 'Leyendo tu historia',
    color: 'violet',
    tasks: [
      { id: 1, text: 'Procesando lo que compartiste' },
      { id: 2, text: 'Detectando patrones de apego' },
      { id: 3, text: 'Analizando momentos clave que mencionaste' },
      { id: 4, text: 'Leyendo lo que está entre líneas' },
      { id: 5, text: 'Identificando mecanismos de defensa' },
    ]
  },
  {
    label: 'Analizando los datos',
    color: 'blue',
    tasks: [
      { id: 6, text: 'Calculando perfil por dimensión' },
      { id: 7, text: 'Buscando contradicciones y contrastes' },
      { id: 8, text: 'Ponderando áreas de mayor riesgo' },
      { id: 9, text: 'Confirmando lo que los números dicen' },
    ]
  },
  {
    label: 'Respuestas proyectivas',
    color: 'fuchsia',
    tasks: [
      { id: 10, text: 'Interpretando respuestas sin filtro racional' },
      { id: 11, text: 'Cruzando lo proyectivo con tu historia' },
    ]
  },
  {
    label: 'Construyendo tu diagnóstico',
    color: 'pink',
    tasks: [
      { id: 12, text: 'Construyendo el perfil del vínculo' },
      { id: 13, text: 'Redactando tu análisis personalizado' },
      { id: 14, text: 'Verificando coherencia del diagnóstico' },
      { id: 15, text: 'Preparando tu informe completo' },
    ]
  }
]

const ALL_ANALYSIS_TASKS = ANALYSIS_TASK_GROUPS.flatMap(g => g.tasks)
// Durations in ms for each task (normal pace ~90 seconds total)
const TASK_DURATIONS_MS = [4800, 5200, 4600, 6200, 5400, 4300, 5900, 5100, 4700, 5600, 5200, 6100, 7200, 5000, 6300]

function AnalyzingProgress({ isDone, onComplete }) {
  const [completedCount, setCompletedCount] = useState(0)
  const timeoutRef = useRef(null)
  const isDoneRef = useRef(isDone)
  isDoneRef.current = isDone
  const completedCountRef = useRef(0)
  const onCompleteRef = useRef(onComplete)
  onCompleteRef.current = onComplete

  const scheduleNext = useCallback(() => {
    const idx = completedCountRef.current
    if (idx >= ALL_ANALYSIS_TASKS.length) {
      timeoutRef.current = setTimeout(() => { onCompleteRef.current?.() }, 600)
      return
    }
    const delay = isDoneRef.current ? 160 : TASK_DURATIONS_MS[idx]
    timeoutRef.current = setTimeout(() => {
      completedCountRef.current = idx + 1
      setCompletedCount(idx + 1)
      scheduleNext()
    }, delay)
  }, [])

  useEffect(() => {
    scheduleNext()
    return () => { if (timeoutRef.current) clearTimeout(timeoutRef.current) }
  }, [scheduleNext])

  // When isDone becomes true — cancel current long timer and drain remaining tasks fast
  useEffect(() => {
    if (!isDone) return
    if (timeoutRef.current) clearTimeout(timeoutRef.current)
    const fastDrain = () => {
      const idx = completedCountRef.current
      if (idx >= ALL_ANALYSIS_TASKS.length) {
        timeoutRef.current = setTimeout(() => { onCompleteRef.current?.() }, 400)
        return
      }
      completedCountRef.current = idx + 1
      setCompletedCount(idx + 1)
      timeoutRef.current = setTimeout(fastDrain, 160)
    }
    timeoutRef.current = setTimeout(fastDrain, 250)
  }, [isDone])

  const currentIdx = completedCount // tasks 0..completedCount-1 are done; completedCount is the one running now

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
            {/* Group header */}
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
            {/* Tasks */}
            <ul className="space-y-2">
              {group.tasks.map(task => {
                const taskGlobalIdx = ALL_ANALYSIS_TASKS.findIndex(t => t.id === task.id)
                const isTaskDone = taskGlobalIdx < completedCount
                const isTaskCurrent = taskGlobalIdx === completedCount

                return (
                  <motion.li key={task.id}
                    animate={{ opacity: isTaskDone ? 1 : isTaskCurrent ? 0.9 : 0.3 }}
                    transition={{ duration: 0.3 }}
                    className="flex items-center gap-3">
                    <div className="flex-shrink-0 w-5 h-5 flex items-center justify-center">
                      {isTaskDone ? (
                        <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ type: 'spring', stiffness: 350, delay: 0.05 }}>
                          <Check className="w-3.5 h-3.5 text-emerald-400" strokeWidth={2.5} />
                        </motion.div>
                      ) : isTaskCurrent ? (
                        <motion.div
                          className={`w-3.5 h-3.5 rounded-full border-2 ${c.spinner}`}
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
  const score = Math.round(((avg - 1) / 4) * 100)
  if (avg >= 3.8) return {
    key: 'solida', title: 'Relación Sólida', emoji: '🟢', score,
    color: 'from-emerald-500 to-green-500', textColor: 'text-emerald-400',
    description: 'Existe una base emocional estable, aunque siempre hay aspectos que pueden fortalecerse.',
    detail: 'Tu relación muestra indicadores saludables en la mayoría de las áreas evaluadas. Esto no significa que no existan desafíos, sino que cuentan con recursos emocionales sólidos para enfrentarlos.'
  }
  if (avg >= 3.0) return {
    key: 'desgaste', title: 'Relación en Desgaste', emoji: '🟠', score,
    color: 'from-amber-500 to-orange-500', textColor: 'text-amber-400',
    description: 'El vínculo existe, pero algunos patrones están debilitando la conexión.',
    detail: 'La relación conserva elementos positivos importantes, pero hay áreas donde el desgaste está afectando la calidad del vínculo. Identificar estos patrones a tiempo puede prevenir un deterioro mayor.'
  }
  if (avg >= 2.2) return {
    key: 'riesgo', title: 'Relación en Riesgo', emoji: '🔴', score,
    color: 'from-red-500 to-rose-500', textColor: 'text-red-400',
    description: 'Los conflictos acumulados están afectando seriamente la relación.',
    detail: 'Varios indicadores muestran que la relación está atravesando una etapa difícil. Los patrones actuales, si no se abordan, tienden a profundizarse con el tiempo. La buena noticia es que identificarlos es el primer paso para transformarlos.'
  }
  return {
    key: 'critica', title: 'Relación Crítica', emoji: '⚫', score,
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

  // Flash answers (premium)
  const [currentFlash, setCurrentFlash] = useState(0)
  const [flashAnswers, setFlashAnswers] = useState({})

  // AI analysis (premium)
  const [aiAnalysis, setAiAnalysis] = useState(null)
  const [aiLoading, setAiLoading] = useState(false)
  const [aiReady, setAiReady] = useState(false)

  const topRef = useRef(null)

  // Voice UI state for philosophical questions
  const [philUIMode, setPhilUIMode] = useState('voice')
  const [philInterim, setPhilInterim] = useState('')
  const [philRecording, setPhilRecording] = useState(false)
  const philRecognitionRef = useRef(null)

  // Voice UI state for flash questions
  const [flashInterim, setFlashInterim] = useState('')
  const [flashRecording, setFlashRecording] = useState(false)
  const flashRecognitionRef = useRef(null)

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

  // Reset flash voice state when flash question changes
  useEffect(() => {
    setFlashInterim('')
    if (flashRecording) {
      flashRecognitionRef.current?.stop()
      setFlashRecording(false)
    }
  }, [currentFlash]) // eslint-disable-line react-hooks/exhaustive-deps

  // localStorage auto-save (saves on every meaningful state change)
  useEffect(() => {
    if (stage === 'hero' || stage === 'results' || stage === 'analyzing') return
    try {
      localStorage.setItem('diagnostico_pareja_draft', JSON.stringify({
        stage, mode, answers, philosophicalAnswers, flashAnswers, currentQuestion, currentPhilosophical, currentFlash, savedAt: Date.now()
      }))
    } catch {}
  }, [stage, mode, answers, philosophicalAnswers, flashAnswers, currentQuestion, currentPhilosophical, currentFlash])

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
          // Premium: last Likert → email capture
          setStage('email')
        } else {
          setStage('open-question')
        }
        scrollToTop()
      }, 400)
    }
  }

  const handleFlashAnswer = (flashId, value) => {
    setFlashAnswers(prev => ({ ...prev, [flashId]: value }))
    if (currentFlash < FLASH_QUESTIONS.length - 1) {
      setTimeout(() => { setCurrentFlash(prev => prev + 1); scrollToTop() }, 350)
    } else {
      setTimeout(() => { setStage('test'); scrollToTop() }, 400)
    }
  }

  const handleRunAIAnalysis = async () => {
    setAiLoading(true)
    setAiReady(false)
    setStage('analyzing')
    scrollToTop()
    try {
      const areaLabels = {}
      for (const a of AREAS) areaLabels[a.key] = a.label
      const inconsistencies = detectInconsistencies(answers, questions)
      if (import.meta.env.DEV) {
        console.log('[AI] Sending to DeepSeek:', {
          areaScores,
          philosophicalCount: Object.keys(philosophicalAnswers).length,
          flashCount: Object.keys(flashAnswers).length,
          answersCount: Object.keys(answers).length,
          inconsistencies: inconsistencies.length
        })
      }
      const result = await analyzeRelationship({
        areaScores,
        areaLabels,
        philosophicalAnswers,
        philosophicalQuestions: PHILOSOPHICAL_QUESTIONS,
        flashAnswers,
        flashQuestions: FLASH_QUESTIONS,
        inconsistencies
      })
      if (import.meta.env.DEV) console.log('[AI] Result keys:', Object.keys(result || {}))
      setAiAnalysis(result)
    } catch (e) {
      console.error('AI analysis error:', e)
      // Ensure fallback analysis is always set so results page renders premium sections
      const fallbackScores = calculateScores(answers, questions)
      setAiAnalysis({ diagnosticoNarrado: 'No fue posible conectar con la inteligencia artificial en este momento. A continuación se muestra un perfil basado en los datos cuantitativos.', aperturaEmpatica: 'Gracias por compartir. Aunque el análisis profundo no estuvo disponible, tus respuestas revelan patrones importantes.', areaCorrelations: Object.fromEntries(Object.entries(fallbackScores).map(([k, s]) => [k, `Puntuación: ${Math.round(((s-1)/4)*100)}%`])) })
    }
    setAiLoading(false)
    // Signal to AnalyzingProgress that AI is done; it will call onComplete to transition to results
    setAiReady(true)
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

  const toggleFlashMic = useCallback(() => {
    if (flashRecording) {
      flashRecognitionRef.current?.stop()
      setFlashRecording(false)
      setFlashInterim('')
      return
    }
    const SR = window.SpeechRecognition || window.webkitSpeechRecognition
    if (!SR) return
    const fq = FLASH_QUESTIONS[currentFlash]
    if (!fq || fq.type !== 'complete') return
    const recognition = new SR()
    recognition.lang = 'es-MX'
    recognition.continuous = true
    recognition.interimResults = true
    recognition.onresult = (e) => {
      let interim = ''
      for (let i = e.resultIndex; i < e.results.length; i++) {
        if (e.results[i].isFinal) {
          const finalText = e.results[i][0].transcript
          setFlashAnswers(prev => ({
            ...prev,
            [fq.id]: (prev[fq.id] ? prev[fq.id] + ' ' : '') + finalText
          }))
          setFlashInterim('')
        } else {
          interim += e.results[i][0].transcript
        }
      }
      if (interim) setFlashInterim(interim)
    }
    recognition.onerror = () => { setFlashRecording(false); setFlashInterim('') }
    recognition.onend = () => { setFlashRecording(false); setFlashInterim('') }
    flashRecognitionRef.current = recognition
    recognition.start()
    setFlashRecording(true)
  }, [flashRecording, currentFlash])

  // DEV: load a mock profile and call DeepSeek directly with profile data (no closure dependency)
  const loadMockProfile = useCallback(async (profile) => {
    setMode('premium')
    setIsPremiumUnlocked(true)
    setRespondent('yo')
    setPhilosophicalAnswers(profile.philosophical)
    setFlashAnswers(profile.flash)
    setAnswers(profile.answers)
    setStage('analyzing')
    setAiLoading(true)
    setAiReady(false)
    scrollToTop()

    // Compute scores directly from profile data (bypasses useMemo closure)
    const scores = calculateScores(profile.answers, QUESTIONS_DETAILED)

    try {
      const areaLabels = {}
      for (const a of AREAS) areaLabels[a.key] = a.label
      const inconsistencies = detectInconsistencies(profile.answers, QUESTIONS_DETAILED)

      if (import.meta.env.DEV) {
        console.log('[MOCK→AI] Sending to DeepSeek:', {
          scores,
          philosophicalCount: Object.keys(profile.philosophical).length,
          flashCount: Object.keys(profile.flash).length,
          answersCount: Object.keys(profile.answers).length,
          inconsistencies: inconsistencies.length
        })
      }

      const result = await analyzeRelationship({
        areaScores: scores,
        areaLabels,
        philosophicalAnswers: profile.philosophical,
        philosophicalQuestions: PHILOSOPHICAL_QUESTIONS,
        flashAnswers: profile.flash,
        flashQuestions: FLASH_QUESTIONS,
        inconsistencies
      })

      if (import.meta.env.DEV) console.log('[MOCK→AI] Result keys:', Object.keys(result || {}))
      setAiAnalysis(result)
    } catch (e) {
      console.error('[MOCK→AI] Error:', e)
    }
    setAiLoading(false)
    setAiReady(true)
  }, [scrollToTop])

  const handleDownloadPDF = async () => {
    setPdfGenerating(true)
    try {
      const doc = generatePDF(result, areaScores, interpretation, openQuestion, isPremiumUnlocked, aiAnalysis)
      doc.save('Diagnostico-Relacion-LuisVirrueta.pdf')
    } finally {
      setPdfGenerating(false)
    }
  }

  // Test mode: enables quick-fill sample answers per question
  const isTestMode = import.meta.env.DEV || new URLSearchParams(window.location.search).get('test') === 'true'

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
                        setFlashAnswers(resumeDraft.flashAnswers || {})
                        setCurrentQuestion(resumeDraft.currentQuestion || 0)
                        setCurrentPhilosophical(resumeDraft.currentPhilosophical || 0)
                        setCurrentFlash(resumeDraft.currentFlash || 0)
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
                      <span className="flex items-center gap-1.5 text-white/40 text-xs"><FileText className="w-3 h-3" /> 15 preguntas</span>
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
                      <span className="flex items-center gap-1.5 text-white/40 text-xs"><Clock className="w-3 h-3" /> ~20 min</span>
                      <span className="w-px h-3 bg-white/10" />
                      <span className="text-violet-300/70 text-xs font-light">${PREMIUM_PRICE} MXN</span>
                    </div>
                    <ul className="space-y-2.5 mb-6 text-white/40 text-xs font-extralight">
                      <li className="flex items-start gap-2"><Check className="w-3 h-3 text-violet-400/50 mt-0.5 flex-shrink-0" /> 15 preguntas abiertas + 25 confirmatorias + 10 proyectivas</li>
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
                    <p className="text-white/80 text-sm font-light mb-1">Después, reacciones rápidas y afirmaciones</p>
                    <p className="text-white/40 text-xs font-extralight leading-relaxed">
                      10 respuestas proyectivas para captar lo intuitivo, seguidas de 25 afirmaciones breves para confirmar los patrones.
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

              {/* DEV: Quick-fill with mock profiles for testing AI analysis */}
              {isTestMode && (
                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.9 }}
                  className="mt-8 relative">
                  <div className="text-center mb-3">
                    <span className="text-amber-400/40 text-[10px] uppercase tracking-[0.2em]">Test rápido — rellenar y analizar</span>
                  </div>
                  <div className="grid grid-cols-2 gap-2">
                    {MOCK_PROFILES.map((p, i) => (
                      <button key={i} onClick={() => loadMockProfile(p)}
                        className="flex flex-col items-start p-3 rounded-xl border border-amber-500/20 bg-amber-500/[0.03] hover:border-amber-400/40 hover:bg-amber-500/[0.07] transition-all text-left">
                        <span className="text-amber-300/80 text-xs font-light">{p.name}</span>
                        <span className="text-white/25 text-[10px] font-extralight leading-tight mt-0.5">{p.desc}</span>
                      </button>
                    ))}
                  </div>
                </motion.div>
              )}
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
                    &ldquo;{questions[currentQuestion]?.text ?? ''}&rdquo;
                  </h3>

                  <div className="space-y-3">
                    {ANSWER_OPTIONS.map((opt, i) => {
                      const isSelected = answers[questions[currentQuestion]?.id] === opt.value
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

              {/* Quick-fill test button for Likert */}
              {isTestMode && (
                <div className="mt-6 text-center">
                  <button
                    onClick={() => handleAnswer(questions[currentQuestion]?.sampleValue || 3)}
                    className="text-amber-400/45 text-[10px] hover:text-amber-400/75 tracking-wider transition-colors border border-amber-400/18 rounded-full px-3 py-1.5 hover:border-amber-400/35">
                    ► Respuesta de muestra
                  </button>
                </div>
              )}

              <div className="flex items-center justify-between mt-8 pt-6 border-t border-white/5">
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
                              } else { setStage('flash'); scrollToTop() }
                            }}
                            className="flex items-center gap-2 px-5 py-2 rounded-full bg-gradient-to-r from-violet-500/80 to-fuchsia-500/80 text-white text-xs uppercase tracking-wider hover:from-violet-500 hover:to-fuchsia-500 transition-all">
                            {currentPhilosophical < PHILOSOPHICAL_QUESTIONS.length - 1 ? 'Siguiente' : 'Continuar'}
                            <ArrowRight className="w-3.5 h-3.5" />
                          </motion.button>
                        </div>
                      )}

                      {/* Skip (only when no text) */}
                      {!philosophicalAnswers[currentPhilosophical]?.trim() && !philRecording && (
                        <div className="flex items-center gap-4 mt-4">
                          <button onClick={() => {
                            if (currentPhilosophical < PHILOSOPHICAL_QUESTIONS.length - 1) {
                              setCurrentPhilosophical(prev => prev + 1)
                            } else { setStage('flash'); scrollToTop() }
                          }}
                            className="text-white/20 text-xs hover:text-white/40 tracking-wider transition-colors">
                            OMITIR
                          </button>
                          {isTestMode && PHILOSOPHICAL_QUESTIONS[currentPhilosophical].sample && (
                            <button
                              onClick={() => {
                                const sample = PHILOSOPHICAL_QUESTIONS[currentPhilosophical].sample
                                setPhilosophicalAnswers(prev => ({ ...prev, [currentPhilosophical]: sample }))
                                setTimeout(() => {
                                  if (currentPhilosophical < PHILOSOPHICAL_QUESTIONS.length - 1) {
                                    setCurrentPhilosophical(prev => prev + 1); scrollToTop()
                                  } else { setStage('flash'); scrollToTop() }
                                }, 350)
                              }}
                              className="flex items-center gap-1.5 text-amber-400/50 text-[10px] hover:text-amber-400/80 tracking-wider transition-colors border border-amber-400/20 rounded-full px-2.5 py-1 hover:border-amber-400/40">
                              ► Muestra
                            </button>
                          )}
                        </div>
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
                        <div className="flex items-center gap-3">
                          <button onClick={() => setPhilUIMode('voice')}
                            className="flex items-center gap-1.5 text-violet-300/40 text-xs hover:text-violet-300/70 transition-colors">
                            <Mic className="w-3 h-3" /> Usar micrófono
                          </button>
                          {isTestMode && PHILOSOPHICAL_QUESTIONS[currentPhilosophical].sample && !(philosophicalAnswers[currentPhilosophical] || '').trim() && (
                            <button
                              onClick={() => {
                                setPhilosophicalAnswers(prev => ({ ...prev, [currentPhilosophical]: PHILOSOPHICAL_QUESTIONS[currentPhilosophical].sample }))
                              }}
                              className="text-amber-400/50 text-[10px] hover:text-amber-400/80 transition-colors border border-amber-400/20 rounded-full px-2.5 py-1 hover:border-amber-400/40">
                              ► Muestra
                            </button>
                          )}
                        </div>
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
                      } else { setStage('flash'); scrollToTop() }
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
            STAGE: FLASH QUESTIONS (Premium — proyectivas)
        ═══════════════════════════════════════════════════════════ */}
        {stage === 'flash' && (
          <motion.div key="flash" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="min-h-screen flex flex-col pt-24 lg:pt-28 pb-20 px-6">
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
              <div className="absolute top-1/3 left-1/3 w-96 h-96 bg-fuchsia-600/5 rounded-full blur-3xl" />
              <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-pink-600/5 rounded-full blur-3xl" />
            </div>

            <div className="fixed top-0 left-0 right-0 z-50 h-1 bg-white/5">
              <motion.div className="h-full bg-gradient-to-r from-fuchsia-500 to-pink-400"
                initial={{ width: 0 }} animate={{ width: `${Math.round(((currentFlash + 1) / FLASH_QUESTIONS.length) * 100)}%` }}
                transition={{ duration: 0.4, ease: 'easeOut' }} />
            </div>

            <div className="max-w-xl mx-auto w-full flex-1 flex flex-col justify-center relative z-10">
              {currentFlash === 0 && (
                <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
                  className="mb-8 p-5 border border-fuchsia-500/15 rounded-xl bg-fuchsia-500/[0.03]">
                  <p className="text-fuchsia-200/70 text-base font-light leading-relaxed">
                    Segunda ronda — <span className="text-fuchsia-300/90 font-normal">responde lo primero que se te venga.</span>{' '}
                    Sin pensarlo mucho. Eso es exactamente lo que buscamos.
                  </p>
                </motion.div>
              )}

              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-2 px-3 py-1 rounded-full border border-fuchsia-500/15 bg-fuchsia-500/5">
                  <Zap className="w-3 h-3 text-fuchsia-400/60" strokeWidth={1.5} />
                  <span className="text-fuchsia-300/50 text-[10px] font-light uppercase tracking-[0.15em]">Respuestas rápidas</span>
                </div>
                <span className="text-white/25 text-sm font-light tracking-wider">
                  {currentFlash + 1} / {FLASH_QUESTIONS.length}
                </span>
              </div>

              <AnimatePresence mode="wait">
                <motion.div key={currentFlash} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }} transition={{ duration: 0.35 }}>

                  {FLASH_QUESTIONS[currentFlash].type === 'complete' ? (
                    /* ── COMPLETAR FRASE ── */
                    <div>
                      <p className="text-white/40 text-[11px] font-light uppercase tracking-[0.18em] mb-4">Completa la frase</p>
                      <h3 className="text-2xl lg:text-3xl font-light text-white/90 leading-relaxed mb-6 tracking-wide font-display italic">
                        "{FLASH_QUESTIONS[currentFlash].stem}..."
                      </h3>

                      {/* Mic button for flash */}
                      <div className="flex items-center gap-3 mb-4">
                        <motion.button type="button" onClick={toggleFlashMic}
                          whileHover={{ scale: 1.06 }} whileTap={{ scale: 0.94 }}
                          className={`w-12 h-12 rounded-full border-2 flex items-center justify-center transition-all duration-300 flex-shrink-0 ${
                            flashRecording
                              ? 'border-red-400/50 bg-red-500/15 text-red-300'
                              : 'border-fuchsia-500/40 bg-fuchsia-500/10 text-fuchsia-300 hover:border-fuchsia-400/60 hover:bg-fuchsia-500/20'
                          }`}>
                          {flashRecording && (
                            <motion.div className="absolute inset-0 rounded-full border border-red-400/20"
                              animate={{ scale: [1, 1.35, 1], opacity: [0.4, 0, 0.4] }}
                              transition={{ duration: 1.5, repeat: Infinity }} />
                          )}
                          {flashRecording ? <MicOff className="w-5 h-5" strokeWidth={1.5} /> : <Mic className="w-5 h-5" strokeWidth={1.5} />}
                        </motion.button>
                        {flashRecording && (
                          <span className="text-red-300/60 text-xs font-light animate-pulse">Escuchando...</span>
                        )}
                        {!flashRecording && !(flashAnswers[FLASH_QUESTIONS[currentFlash].id] || '').trim() && (
                          <span className="text-white/25 text-xs font-light">Toca el mic o escribe</span>
                        )}
                      </div>

                      <textarea
                        key={`flash-input-${currentFlash}`}
                        autoFocus={!flashRecording}
                        value={(flashAnswers[FLASH_QUESTIONS[currentFlash].id] || '') + (flashInterim ? ' ' + flashInterim : '')}
                        onChange={(e) => { if (!flashRecording) setFlashAnswers(prev => ({ ...prev, [FLASH_QUESTIONS[currentFlash].id]: e.target.value })) }}
                        placeholder="Lo primero que se te venga..."
                        maxLength={200}
                        rows={2}
                        className="w-full p-4 bg-white/[0.03] border border-fuchsia-500/15 rounded-2xl text-white/85 text-base font-light placeholder:text-white/20 focus:border-fuchsia-400/30 focus:outline-none resize-none transition-colors leading-relaxed"
                      />
                      <div className="flex items-center justify-between mt-4">
                        <div className="flex items-center gap-3">
                          <button onClick={() => {
                            if (currentFlash < FLASH_QUESTIONS.length - 1) { setCurrentFlash(prev => prev + 1); scrollToTop() }
                            else { setStage('test'); scrollToTop() }
                          }} className="text-white/25 text-xs hover:text-white/45 tracking-wider transition-colors">
                            OMITIR
                          </button>
                          {isTestMode && FLASH_QUESTIONS[currentFlash].sample && !(flashAnswers[FLASH_QUESTIONS[currentFlash].id] || '').trim() && (
                            <button
                              onClick={() => setFlashAnswers(prev => ({ ...prev, [FLASH_QUESTIONS[currentFlash].id]: FLASH_QUESTIONS[currentFlash].sample }))}
                              className="text-amber-400/45 text-[10px] hover:text-amber-400/75 transition-colors border border-amber-400/18 rounded-full px-2.5 py-1 hover:border-amber-400/35">
                              ► Muestra
                            </button>
                          )}
                        </div>
                        {(flashAnswers[FLASH_QUESTIONS[currentFlash].id] || '').trim().length > 0 && !flashRecording && (
                          <motion.button initial={{ opacity: 0 }} animate={{ opacity: 1 }}
                            whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}
                            onClick={() => handleFlashAnswer(FLASH_QUESTIONS[currentFlash].id, flashAnswers[FLASH_QUESTIONS[currentFlash].id])}
                            className="flex items-center gap-2 px-5 py-2.5 rounded-full bg-gradient-to-r from-fuchsia-500/80 to-pink-500/80 text-white text-xs uppercase tracking-wider hover:from-fuchsia-500 hover:to-pink-500 transition-all">
                            Continuar <ArrowRight className="w-3.5 h-3.5" />
                          </motion.button>
                        )}
                      </div>
                    </div>
                  ) : (
                    /* ── ELECCIÓN FORZADA ── */
                    <div>
                      <p className="text-white/40 text-[11px] font-light uppercase tracking-[0.18em] mb-4">Elige una</p>
                      <h3 className="text-2xl lg:text-3xl font-light text-white/90 leading-relaxed mb-8 tracking-wide font-display">
                        {FLASH_QUESTIONS[currentFlash].text}
                      </h3>
                      <div className="flex flex-wrap gap-3 justify-center">
                        {FLASH_QUESTIONS[currentFlash].options.map((opt) => (
                          <motion.button key={opt}
                            whileHover={{ scale: 1.04 }} whileTap={{ scale: 0.96 }}
                            onClick={() => handleFlashAnswer(FLASH_QUESTIONS[currentFlash].id, opt)}
                            className="px-7 py-3.5 rounded-full border border-fuchsia-500/25 bg-fuchsia-500/[0.04] text-white/75 font-light text-sm hover:border-fuchsia-400/50 hover:bg-fuchsia-500/[0.10] hover:text-white transition-all">
                            {opt}
                          </motion.button>
                        ))}
                      </div>
                    </div>
                  )}
                </motion.div>
              </AnimatePresence>

              <div className="flex items-center justify-start mt-8 pt-6 border-t border-white/5">
                <button
                  onClick={() => setCurrentFlash(prev => Math.max(0, prev - 1))}
                  disabled={currentFlash === 0}
                  className="flex items-center gap-2 text-white/30 hover:text-white/60 text-xs tracking-wider disabled:opacity-20 disabled:cursor-not-allowed transition-colors">
                  <ArrowLeft className="w-3.5 h-3.5" /> ANTERIOR
                </button>
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
            className="min-h-screen flex items-center justify-center px-6 py-32">
            <div className="max-w-md w-full">
              <div className="text-center mb-10">
                <h2 className="text-2xl font-light text-white mb-3 font-display tracking-wide">Analizando tu relación</h2>
                <p className="text-white/40 text-sm font-light">Cruzando tu historia con los datos — esto puede tardar un poco.</p>
              </div>
              <AnalyzingProgress
                isDone={aiReady}
                onComplete={() => { setStage('results'); scrollToTop() }}
              />
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
              {/* ─── HEADER: Clean diagnostic title ─── */}
              {isPremiumUnlocked && aiAnalysis ? (
                <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7 }}
                  className="text-center mb-14">
                  <div className="inline-flex items-center gap-2 px-5 py-2 border border-white/8 rounded-full bg-white/[0.02] mb-5">
                    <Sparkles className="w-3.5 h-3.5 text-violet-400/50" strokeWidth={1.5} />
                    <span className="text-xs text-white/35 font-light uppercase tracking-[0.2em]">Diagnóstico Premium</span>
                  </div>
                  <h2 className={`text-3xl lg:text-4xl font-light mb-3 font-display tracking-wide bg-gradient-to-r ${result.color} bg-clip-text text-transparent`}>
                    {result.title}
                  </h2>
                  <p className="text-white/45 text-sm font-light leading-relaxed max-w-md mx-auto">{result.description}</p>
                </motion.div>
              ) : (
                /* Classic header for free users */
                <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8 }} className="text-center mb-16">
                  <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ type: 'spring', stiffness: 150, delay: 0.2 }}
                    className="text-4xl mb-5">{result.emoji}</motion.div>
                  <div className="inline-flex items-center gap-2 px-4 py-1.5 border border-white/10 rounded-full bg-white/5 mb-4">
                    <span className="text-xs text-white/50 font-light uppercase tracking-[0.15em]">Diagnóstico Gratuito</span>
                  </div>
                  <h2 className={`text-2xl lg:text-3xl font-light mb-8 font-display tracking-wide bg-gradient-to-r ${result.color} bg-clip-text text-transparent`}>
                    {result.title}
                  </h2>
                  <p className="text-white/60 text-base lg:text-lg font-light leading-relaxed max-w-xl mx-auto mb-4">{result.description}</p>
                  <p className="text-white/50 text-sm font-light leading-relaxed max-w-xl mx-auto">{result.detail}</p>
                </motion.div>
              )}

              {/* ─── RADAR CHART (Premium) — PRIMERO: mapa de la relación ─── */}
              {isPremiumUnlocked && (
                <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}
                  className="mb-10 p-8 border border-violet-500/10 rounded-2xl bg-gradient-to-br from-violet-500/[0.02] to-transparent">
                  <div className="flex items-center gap-3 mb-6">
                    <BarChart3 className="w-5 h-5 text-violet-400/60" strokeWidth={1.5} />
                    <h3 className="text-lg font-light text-white tracking-wide font-display">Mapa de tu relación</h3>
                  </div>
                  <RadarChart data={AREAS.map(a => ({ label: a.label, value: getPercent(areaScores[a.key]) }))} />
                </motion.div>
              )}

              {/* ─── AREA BARS (Perfil de la relación) ─── */}
              <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }} className="mb-4">
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
                        transition={{ delay: 0.4 + i * 0.08 }}>
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
                            transition={{ duration: 1, delay: 0.5 + i * 0.08, ease: 'easeOut' }}
                            className={`h-full rounded-full bg-gradient-to-r ${area.color}`} />
                        </div>
                      </motion.div>
                    )
                  })}
                </div>
              </motion.div>

              {/* ─── CONEXIONES DETECTADAS (Premium — sección propia, más prominente) ─── */}
              {isPremiumUnlocked && aiAnalysis?.correlacionesPrincipales?.length > 0 && (
                <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5 }}
                  className="mt-10 mb-4 p-8 border border-white/8 rounded-2xl bg-white/[0.02]">
                  <div className="flex items-center gap-3 mb-6">
                    <Layers className="w-5 h-5 text-amber-400/60" strokeWidth={1.5} />
                    <h3 className="text-lg font-light text-white tracking-wide font-display">Conexiones detectadas</h3>
                  </div>
                  <div className="space-y-4">
                    {aiAnalysis.correlacionesPrincipales.map((insight, i) => (
                      <div key={i} className="flex items-start gap-4 p-5 rounded-xl border border-amber-500/8 bg-amber-500/[0.02]">
                        <div className="w-6 h-6 rounded-full bg-amber-500/15 border border-amber-500/20 flex items-center justify-center flex-shrink-0 mt-0.5">
                          <span className="text-amber-400/80 text-[10px] font-medium">{i + 1}</span>
                        </div>
                        <p className="text-white/70 text-sm font-light leading-relaxed">{renderBold(insight)}</p>
                      </div>
                    ))}
                  </div>
                </motion.div>
              )}

              {/* ─── APERTURA EMPÁTICA (Premium — lo que tu historia reveló) ─── */}
              {isPremiumUnlocked && aiAnalysis?.aperturaEmpatica && (
                <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.55 }}
                  className="mt-10 mb-4 p-8 border border-violet-500/15 rounded-2xl bg-gradient-to-br from-violet-500/[0.03] to-fuchsia-500/[0.01]">
                  <div className="flex items-center gap-3 mb-6">
                    <Brain className="w-5 h-5 text-violet-400/60" strokeWidth={1.5} />
                    <h3 className="text-lg font-light text-white tracking-wide font-display">Lo que tu historia reveló</h3>
                  </div>
                  {aiAnalysis.aperturaEmpaticaPuntos?.length > 0 ? (
                    <div className="space-y-5">
                      {aiAnalysis.aperturaEmpaticaPuntos.map((punto, i) => (
                        <div key={i} className="flex items-start gap-4">
                          <span className="w-1.5 h-1.5 rounded-full bg-violet-400/60 mt-2 flex-shrink-0" />
                          <div className="flex-1">
                            <span className="text-white/85 text-sm font-semibold tracking-wide">{punto.titulo}</span>
                            <span className="text-white/40 text-sm"> — </span>
                            <span className="text-white/62 text-sm font-light leading-relaxed">{renderBold(punto.texto)}</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    (aiAnalysis.aperturaEmpatica || '').split('\n\n').map((p, i) => (
                      <p key={i} className="text-white/68 text-sm font-light leading-[1.9] tracking-wide mb-4 last:mb-0">
                        {renderBold(p)}
                      </p>
                    ))
                  )}
                </motion.div>
              )}

              {/* ─── PERFIL INDIVIDUAL + VÍNCULO (con bullet points + porcentajes) ─── */}
              {isPremiumUnlocked && aiAnalysis && (aiAnalysis.perfilIndividual || aiAnalysis.perfilVinculo) && (
                <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.58 }}
                  className="mt-10 mb-4 grid grid-cols-1 sm:grid-cols-2 gap-5">

                  {/* Tu perfil individual */}
                  {aiAnalysis.perfilIndividual && (
                    <div className="p-7 border border-violet-500/15 rounded-2xl bg-gradient-to-br from-violet-500/[0.04] to-transparent">
                      <div className="flex items-center gap-2 mb-5">
                        <Brain className="w-4 h-4 text-violet-400/60" strokeWidth={1.5} />
                        <h4 className="text-violet-300/60 text-[10px] font-light uppercase tracking-[0.18em]">Tu perfil individual</h4>
                      </div>
                      {/* Key area metrics */}
                      <div className="grid grid-cols-3 gap-2 mb-5">
                        {[
                          { area: 'autonomia', label: 'Autonomía' },
                          { area: 'seguridad', label: 'Seguridad' },
                          { area: 'idealizacion', label: 'Idealización' },
                        ].map(({ area, label }) => {
                          const pct = getPercent(areaScores[area])
                          const lvl = getLevel(areaScores[area])
                          return (
                            <div key={area} className="text-center p-2.5 rounded-xl bg-white/[0.02] border border-white/5">
                              <span className={`text-lg font-light tabular-nums block ${lvl.color}`}>{pct}%</span>
                              <span className="text-white/30 text-[9px] leading-tight block">{label}</span>
                            </div>
                          )
                        })}
                      </div>
                      {/* Bullet points from AI text */}
                      <ul className="space-y-3">
                        {aiAnalysis.perfilIndividual
                          .replace(/\*\*/g, '')
                          .split(/(?<=[.!?])\s+/)
                          .filter(s => s.trim().length > 20)
                          .slice(0, 5)
                          .map((sentence, i) => (
                            <li key={i} className="flex items-start gap-2.5">
                              <span className="w-1 h-1 rounded-full bg-violet-400/50 mt-2 flex-shrink-0" />
                              <span className="text-white/60 text-xs font-light leading-relaxed">{sentence.trim()}</span>
                            </li>
                          ))
                        }
                      </ul>
                    </div>
                  )}

                  {/* El vínculo */}
                  {aiAnalysis.perfilVinculo && (
                    <div className="p-7 border border-pink-500/15 rounded-2xl bg-gradient-to-br from-pink-500/[0.04] to-transparent">
                      <div className="flex items-center gap-2 mb-5">
                        <Heart className="w-4 h-4 text-pink-400/60" strokeWidth={1.5} />
                        <h4 className="text-pink-300/60 text-[10px] font-light uppercase tracking-[0.18em]">El vínculo</h4>
                      </div>
                      {/* Key area metrics */}
                      <div className="grid grid-cols-3 gap-2 mb-5">
                        {[
                          { area: 'comunicacion', label: 'Comm.' },
                          { area: 'intimidad', label: 'Intimidad' },
                          { area: 'conflicto', label: 'Conflictos' },
                        ].map(({ area, label }) => {
                          const pct = getPercent(areaScores[area])
                          const lvl = getLevel(areaScores[area])
                          return (
                            <div key={area} className="text-center p-2.5 rounded-xl bg-white/[0.02] border border-white/5">
                              <span className={`text-lg font-light tabular-nums block ${lvl.color}`}>{pct}%</span>
                              <span className="text-white/30 text-[9px] leading-tight block">{label}</span>
                            </div>
                          )
                        })}
                        <div className="col-span-3 text-center p-2.5 rounded-xl bg-white/[0.02] border border-white/5 mt-1">
                          <span className={`text-lg font-light tabular-nums ${result.score >= 60 ? 'text-emerald-400' : result.score >= 40 ? 'text-amber-400' : 'text-red-400'}`}>{result.score}%</span>
                          <span className="text-white/30 text-[9px] ml-2">índice general</span>
                        </div>
                      </div>
                      {/* Bullet points from AI text */}
                      <ul className="space-y-3">
                        {aiAnalysis.perfilVinculo
                          .replace(/\*\*/g, '')
                          .split(/(?<=[.!?])\s+/)
                          .filter(s => s.trim().length > 20)
                          .slice(0, 5)
                          .map((sentence, i) => (
                            <li key={i} className="flex items-start gap-2.5">
                              <span className="w-1 h-1 rounded-full bg-pink-400/50 mt-2 flex-shrink-0" />
                              <span className="text-white/60 text-xs font-light leading-relaxed">{sentence.trim()}</span>
                            </li>
                          ))
                        }
                      </ul>
                    </div>
                  )}
                </motion.div>
              )}

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

              {/* ─── CONFIGURACIÓN DEL DESEO (Premium) ─── */}
              {isPremiumUnlocked && aiAnalysis?.configuracionDeseo && (
                <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.65 }}
                  className="mt-10 mb-4 p-8 border border-pink-500/10 rounded-2xl bg-gradient-to-br from-pink-500/[0.02] to-transparent">
                  <div className="flex items-center gap-3 mb-5">
                    <Sparkles className="w-5 h-5 text-pink-400/60" strokeWidth={1.5} />
                    <h3 className="text-lg font-light text-white tracking-wide font-display">Lo que buscas en el amor</h3>
                  </div>
                  {aiAnalysis.configuracionDeseo.split('\n\n').map((p, i) => (
                    <p key={i} className="text-white/65 text-sm font-light leading-[1.9] tracking-wide mb-3 last:mb-0">{renderBold(p)}</p>
                  ))}
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

                  {/* LECTURA FLASH: Lo que respondiste sin pensar */}
                  {aiAnalysis.lecturaFlash && (
                    <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.95 }}
                      className="mb-8 p-8 border border-fuchsia-500/10 rounded-2xl bg-gradient-to-br from-fuchsia-500/[0.02] to-transparent">
                      <div className="flex items-center gap-3 mb-5">
                        <Zap className="w-5 h-5 text-fuchsia-400/60" strokeWidth={1.5} />
                        <h3 className="text-lg font-semibold text-white tracking-wide font-display">Lo que respondiste sin pensar</h3>
                      </div>
                      {aiAnalysis.lecturaFlash.split('\n\n').map((p, i) => (
                        <p key={i} className="text-white/65 text-sm font-light leading-[1.9] tracking-wide mb-4 last:mb-0">{renderBold(p)}</p>
                      ))}
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
