import { motion, useInView } from 'framer-motion'
import { useMemo, useRef, useState, useEffect } from 'react'
import { Share2, Copy, CheckCircle, ChevronDown, Quote, ArrowLeft, Home, Lightbulb, HelpCircle, Coffee, MessageCircle } from 'lucide-react'
import { useNavigate } from 'react-router-dom'

const MEXICO_TZ = 'America/Mexico_City'
const CHANGE_HOUR_MX = 0 // Cambio a medianoche

const pad2 = (n) => String(n).padStart(2, '0')

const SOCIAL_PLATFORMS = [
  { id: 'whatsapp', name: 'WhatsApp', icon: MessageCircle },
  { id: 'facebook', name: 'Facebook', icon: Share2 },
  { id: 'linkedin', name: 'LinkedIn', icon: Share2 }
]

const getMexicoParts = (date = new Date()) => {
  const parts = new Intl.DateTimeFormat('en-CA', {
    timeZone: MEXICO_TZ,
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    hourCycle: 'h23'
  }).formatToParts(date)

  const get = (type) => parts.find((p) => p.type === type)?.value
  return {
    y: Number(get('year')),
    m: Number(get('month')),
    d: Number(get('day')),
    hour: Number(get('hour'))
  }
}

const toDateKey = (y, m, d) => `${y}-${pad2(m)}-${pad2(d)}`

const dayOfYear = (y, m, d) => {
  const start = Date.UTC(y, 0, 1)
  const cur = Date.UTC(y, m - 1, d)
  return Math.floor((cur - start) / 86400000) + 1
}

const clamp = (v, min, max) => Math.min(max, Math.max(min, v))

const isValidDateKey = (s) => /^\d{4}-\d{2}-\d{2}$/.test(String(s || ''))

const getEffectiveMexicoDateKey = () => {
  const { y, m, d, hour } = getMexicoParts()
  if (Number.isFinite(hour) && hour < CHANGE_HOUR_MX) {
    const utc = new Date(Date.UTC(y, m - 1, d))
    utc.setUTCDate(utc.getUTCDate() - 1)
    return toDateKey(utc.getUTCFullYear(), utc.getUTCMonth() + 1, utc.getUTCDate())
  }
  return toDateKey(y, m, d)
}

const parseDateKeyToParts = (key) => {
  const [yy, mm, dd] = String(key).split('-').map((x) => Number(x))
  return { y: yy, m: mm, d: dd }
}

const START_DATE_KEY = '2025-12-23'

const mod = (n, m) => ((n % m) + m) % m

const daysBetweenUtcDates = (a, b) => {
  const aUtc = Date.UTC(a.y, a.m - 1, a.d)
  const bUtc = Date.UTC(b.y, b.m - 1, b.d)
  return Math.floor((aUtc - bUtc) / 86400000)
}

const PHRASES = [
  {
    id: '001',
    quote: 'Quien mira hacia afuera sueña; quien mira hacia adentro despierta.',
    author: 'Carl G. Jung',
    meaning: 'Lo externo da contenido; lo interno da dirección. Sin lectura de tus deseos y defensas, el mundo te empuja. Mirar hacia dentro no es encerrarte: es recuperar agencia.',
    questions: ['¿Qué estás proyectando en otros?', '¿Qué verdad interna estás evitando nombrar?']
  },
  {
    id: '002',
    quote: 'El tiempo no cura nada, solo te enseña a vivir con el dolor.',
    author: 'Anónimo',
    meaning: 'El tiempo no borra. Solo pone distancia. El dolor se integra, no se elimina. Aprendes a cargarlo, no a olvidarlo.',
    questions: ['¿Qué dolor esperas que el tiempo cure?', '¿Puedes aprender a vivir con él en lugar de esperar que desaparezca?']
  },
  {
    id: '003',
    quote: 'La Sombra es aquello que no queremos ser.',
    author: 'Carl G. Jung',
    meaning: 'Todo lo que niegas, lo proyectas. Lo que más te molesta de otros suele ser lo que más escondes de ti. Integrar la sombra no es volverse oscuro: es volverse completo.',
    questions: ['¿Qué te irrita profundamente en otros?', '¿Dónde podría estar esa cualidad escondida en ti?']
  },
  {
    id: '004',
    quote: 'La madurez no es la ausencia de trauma, sino la habilidad de no transmitirlo.',
    author: 'Anónimo',
    meaning: 'Todos llevamos heridas. La madurez no es estar curado, sino no herir desde tu herida. Es cortar la cadena de transmisión.',
    questions: ['¿Qué herida tuya hiere a otros?', '¿Cómo podrías contenerla en lugar de pasarla?']
  },
  {
    id: '005',
    quote: 'La neurosis es siempre un sustituto del sufrimiento legítimo.',
    author: 'Carl G. Jung',
    meaning: 'A veces preferimos un dolor indirecto, confuso, inmanejable, antes que enfrentar el dolor real que sí podemos nombrar. El síntoma es una defensa contra la verdad.',
    questions: ['¿Qué dolor estás evitando con tus síntomas?', '¿Qué verdad se volvería visible si dejaras de distraerte?']
  },
  {
    id: '006',
    quote: 'El síntoma es un compromiso entre el deseo y la defensa.',
    author: 'Jacques Lacan',
    meaning: 'Lo que te molesta de ti mismo no es solo un problema: es una solución fracasada. El síntoma intenta resolver algo que no sabes nombrar. Escucharlo es descifrarlo.',
    questions: ['¿Qué conflicto interno expresa tu síntoma?', '¿Qué deseo y qué prohibición chocan en él?']
  },
  {
    id: '007',
    quote: 'Hasta que lo inconsciente no se haga consciente, el subconsciente seguirá dirigiendo tu vida y tú lo llamarás destino.',
    author: 'Carl G. Jung',
    meaning: 'Lo que no ves, te gobierna. Lo llamas mala suerte, karma, destino. Pero es solo patrón invisible. Hacerlo consciente no garantiza control, pero al menos te devuelve elección.',
    questions: ['¿Qué patrón repetitivo culpas al destino?', '¿Qué papel juegas tú en esa repetición?']
  },
  {
    id: '008',
    quote: 'Donde hay voluntad, hay camino. Donde no hay voluntad, hay excusas.',
    author: 'Anónimo',
    meaning: 'La falta de recursos no es el problema. La falta de voluntad sí. Las excusas son voluntad invertida: energía usada para justificar la inacción.',
    questions: ['¿Qué excusa repites más?', '¿Qué voluntad falta debajo de esa excusa?']
  },
  {
    id: '009',
    quote: 'Amar es dar lo que no se tiene a alguien que no lo es.',
    author: 'Jacques Lacan',
    meaning: 'El amor no se basa en plenitud ni posesión. Amamos desde la falta, no desde la abundancia. Y el otro no es un objeto que completa: es un sujeto que permanece enigma.',
    questions: ['¿Qué esperas que el otro llene en ti?', '¿Puedes amar sin necesitar ser completado?']
  },
  {
    id: '010',
    quote: 'Lo que niegas te somete. Lo que aceptas te transforma.',
    author: 'Carl G. Jung',
    meaning: 'Resistir algo le da poder. Aceptarlo le quita carga. No se trata de rendirse, sino de integrar. Lo que aceptas puede cambiar; lo que niegas, te controla.',
    questions: ['¿Qué aspecto tuyo estás rechazando?', '¿Cómo sería aceptarlo sin justificarlo?']
  },
  {
    id: '011',
    quote: 'No hay relaciones rotas, solo personas rotas tratando de relacionarse.',
    author: 'Anónimo',
    meaning: 'El problema no es la relación: son las personas sin procesar. Dos heridas no resueltas no hacen una relación sana.',
    questions: ['¿Qué herida tuya está rompiendo tus relaciones?', '¿Puedes trabajar en ti antes de exigir al otro?']
  },
  {
    id: '012',
    quote: 'No hay relación sexual.',
    author: 'Jacques Lacan',
    meaning: 'Hombre y mujer hablan lenguajes inconscientes distintos. No hay complementariedad perfecta. El encuentro siempre es parcial, siempre es malentendido. Aceptarlo es madurar.',
    questions: ['¿Qué esperas del otro que nunca llegará?', '¿Puedes sostener el desencuentro sin huir?']
  },
  {
    id: '013',
    quote: 'La herida es el lugar por donde entra la luz.',
    author: 'Rumi',
    meaning: 'Lo que más duele suele ser lo que más transforma. La fractura permite entrada. No niegues el dolor: úsalo como puerta.',
    questions: ['¿Qué herida te sigue doliendo?', '¿Qué podría estar tratando de enseñarte?']
  },
  {
    id: '014',
    quote: 'Aquello a lo que te resistes, persiste.',
    author: 'Carl G. Jung',
    meaning: 'La resistencia alimenta lo que quieres evitar. Mientras pelees contra algo, le das energía. Aceptarlo no es aprobarlo: es dejar de luchar.',
    questions: ['¿Contra qué estás luchando internamente?', '¿Qué pasaría si dejaras de resistir?']
  },
  {
    id: '015',
    quote: 'El universo no te da lo que quieres, te da lo que necesitas para crecer.',
    author: 'Anónimo',
    meaning: 'Lo que llega no siempre es lo que pediste. Pero suele ser lo que necesitas. Confiar en el proceso es aceptar que hay una inteligencia mayor.',
    questions: ['¿Qué llegó que no querías?', '¿Qué te enseñó?']
  },
  {
    id: '016',
    quote: 'El sufrimiento es opcional, el dolor es inevitable.',
    author: 'Buda',
    meaning: 'El dolor viene solo; el sufrimiento lo añades tú con tu resistencia. Aceptar el dolor no es masoquismo: es dejar de pelear contra lo que ya es.',
    questions: ['¿Dónde estás resistiendo algo inevitable?', '¿Qué pasaría si aceptaras en lugar de luchar?']
  },
  {
    id: '017',
    quote: 'La única forma de dar sentido a la libertad es ejercerla.',
    author: 'Jean-Paul Sartre',
    meaning: 'Libertad no es concepto: es acto. No eres libre porque puedas elegir; eres libre cuando eliges. Y cada elección te define.',
    questions: ['¿Dónde finges no tener opciones?', '¿Qué elegirías si te sintieras libre de verdad?']
  },
  {
    id: '018',
    quote: 'La pregunta no es quién soy, sino qué deseo.',
    author: 'Jacques Lacan',
    meaning: 'La identidad es engañosa; el deseo, revelador. No preguntes qué eres: pregunta qué te mueve. La respuesta no estará en las palabras, sino en tus actos recurrentes.',
    questions: ['¿Hacia dónde se dirige tu energía sin que lo decidas?', '¿Qué revela eso sobre tu deseo real?']
  },
  {
    id: '019',
    quote: 'El presente es el único momento en el que puedes actuar.',
    author: 'Eckhart Tolle',
    meaning: 'El pasado ya no existe, el futuro aún no llega. Solo tienes ahora. Vivir en otro tiempo es fantasía. El poder está en este instante, no en el que vendrá.',
    questions: ['¿Cuánto tiempo pasas fuera del presente?', '¿Qué puedes hacer ahora mismo?']
  },
  {
    id: '020',
    quote: 'No eres una gota en el océano. Eres el océano entero en una gota.',
    author: 'Rumi',
    meaning: 'No eres pequeño. Eres la totalidad concentrada en forma singular. Cada persona contiene universos. Dejar de sentirte insignificante es un acto místico.',
    questions: ['¿Dónde te sientes pequeño e irrelevante?', '¿Puedes verte como parte del todo?']
  },
  {
    id: '021',
    quote: 'Lo que niegas en ti, lo encontrarás en el mundo.',
    author: 'Carl G. Jung',
    meaning: 'La proyección es inevitable. Si rechazas una parte tuya, la verás afuera y la atacarás. El mundo exterior es espejo del interior negado.',
    questions: ['¿Qué ves constantemente en otros que te molesta?', '¿Dónde vive eso en ti?']
  },
  {
    id: '022',
    quote: 'La gratitud convierte lo que tenemos en suficiente.',
    author: 'Anónimo',
    meaning: 'No es que tengas poco: es que no agradeces lo que hay. La gratitud cambia la percepción de escasez a abundancia.',
    questions: ['¿Qué das por hecho sin agradecer?', '¿Puedes ver abundancia donde ves falta?']
  },
  {
    id: '023',
    quote: 'No son las cosas las que nos perturban, sino la opinión que tenemos sobre ellas.',
    author: 'Epicteto',
    meaning: 'La experiencia no llega "pura": llega filtrada por interpretación. La misma escena puede ser herida o entrenamiento según el marco interno. La tarea no es negar lo real, sino ver con qué lente lo vuelves inevitable.',
    questions: ['¿Qué interpretación estás tratando como si fuera un hecho?', 'Si cambiaras el marco, ¿qué posibilidad aparecería?']
  },
  {
    id: '024',
    quote: 'El inconsciente es aquello que está obligado a repetirse mientras no se haga consciente.',
    author: 'Sigmund Freud',
    meaning: 'Lo que no miramos, lo actuamos. La repetición no es mala suerte: es síntoma. Mientras un patrón permanezca fuera de tu campo de visión, seguirá orquestando tu historia.',
    questions: ['¿Qué situación se repite en tu vida sin que sepas por qué?', '¿Qué no quieres ver de ti mismo?']
  },
  {
    id: '025',
    quote: 'Sólo se puede amar lo que se ha perdido.',
    author: 'Jacques Lacan',
    meaning: 'El amor nace de la ausencia, no de la posesión. Amamos lo que ya no tenemos o lo que nunca tuvimos del todo. La presencia absoluta mata el deseo; la falta lo sostiene.',
    questions: ['¿Qué extrañas aunque lo tengas presente?', '¿Amas lo que es o lo que imaginas?']
  },
  {
    id: '026',
    quote: 'La paz no llega cuando desaparece el dolor, sino cuando dejas de añadirle historia.',
    author: 'Buda',
    meaning: 'El dolor es una sensación; el sufrimiento es la narrativa que construyes encima. Cuando dejas de pelear con lo inevitable y sueltas la historia de “esto no debería estar pasando”, aparece espacio interno. No es resignación: es claridad.',
    questions: ['¿Qué historia estás contando sobre tu dolor?', '¿Qué cambia si solo observas lo que sientes sin discutir con ello?']
  },
  {
    id: '027',
    quote: 'No hay camino a la felicidad: la felicidad es el camino.',
    author: 'Lao Tzu',
    meaning: 'La felicidad no está al final de una meta. No llegarás a ella después de lograr algo. Está en cómo transitas. Si esperas ser feliz "cuando", nunca lo serás.',
    questions: ['¿Qué meta persigues creyendo que te hará feliz?', '¿Puedes ser feliz ahora, sin condiciones?']
  },
  {
    id: '028',
    quote: 'La existencia precede a la esencia.',
    author: 'Jean-Paul Sartre',
    meaning: 'No vienes “terminado”. Primero existes, luego te construyes con tus decisiones. La identidad no es una etiqueta fija: es una obra en proceso. Evitar elegir también es elegir, y te convierte en alguien por defecto.',
    questions: ['¿Qué parte de ti estás esperando “descubrir” en lugar de crear?', '¿Qué decisión concreta definiría quién quieres ser?']
  },
  {
    id: '029',
    quote: 'La compasión es la respuesta radical a todos los juicios.',
    author: 'Pema Chödrön',
    meaning: 'Juzgar es fácil. Comprender es difícil. La compasión no justifica, sino que humaniza. Ver al otro como alguien que sufre disuelve el juicio.',
    questions: ['¿A quién juzgas duramente?', '¿Qué sufrimiento invisible podría explicar su conducta?']
  },
  {
    id: '030',
    quote: 'El universo no está fuera de ti. Mira dentro de ti: todo lo que quieres ser, ya lo eres.',
    author: 'Rumi',
    meaning: 'Dejas de buscar afuera cuando descubres que ya lo tienes adentro. No te falta nada esencial. Solo claridad para verlo.',
    questions: ['¿Qué buscas en otros que podrías encontrar en ti?', '¿Cómo sería confiar en tu propia plenitud?']
  },
  {
    id: '031',
    quote: 'No hay ego en el ahora.',
    author: 'Eckhart Tolle',
    meaning: 'El ego vive de pasado y futuro. En el presente puro, no hay narrativa. Solo hay experiencia directa. El ahora disuelve la identidad fija.',
    questions: ['¿Cuánto de tu identidad es historia repetida?', '¿Quién serías sin tu pasado?']
  },
  {
    id: '032',
    quote: 'No busques ser perfecto, busca ser completo.',
    author: 'Carl G. Jung',
    meaning: 'La perfección es fantasía neurótica. La completud es integración de opuestos. Acepta tu luz y tu sombra: eso es ser completo.',
    questions: ['¿Qué partes tuyas rechazas por imperfectas?', '¿Puedes aceptarte completo en lugar de perfecto?']
  },
  {
    id: '033',
    quote: 'La vulnerabilidad es la cuna de la innovación, la creatividad y el cambio.',
    author: 'Brené Brown',
    meaning: 'Sin riesgo no hay creación. Mostrarte vulnerable es el único camino a lo nuevo. La armadura protege, pero también aísla.',
    questions: ['¿Dónde te proteges tanto que no creas nada?', '¿Puedes ser vulnerable aunque te dé miedo?']
  },
  {
    id: '034',
    quote: 'El amor propio no es egoísmo. Es el fundamento de toda relación sana.',
    author: 'Anónimo',
    meaning: 'No puedes dar lo que no tienes. Amarte no es vanidad: es condición. Solo quien se cuida puede cuidar sin resentimiento.',
    questions: ['¿Cómo te tratas a ti mismo?', '¿Te cuidas o te abandonas?']
  },
  {
    id: '035',
    quote: 'El silencio es una respuesta.',
    author: 'Proverbio',
    meaning: 'No todo merece palabras. A veces callar es más claro que hablar. El silencio también comunica.',
    questions: ['¿Dónde hablas de más?', '¿Qué dirías con tu silencio?']
  },
  {
    id: '036',
    quote: 'Nada grande se hace de repente.',
    author: 'Epicteto',
    meaning: 'Lo profundo casi siempre es gradual. El cambio real es más parecido a una reeducación de la atención que a un golpe de suerte. La paciencia no es pasividad: es método.',
    questions: ['¿Qué proceso estás queriendo resolver como evento?', '¿Qué repetición te daría 1% diario?']
  },
  {
    id: '037',
    quote: 'Conviértete en quien eres.',
    author: 'Friedrich Nietzsche',
    meaning: 'No se trata de inventarte, sino de reconocerte. Hay una diferencia entre fabricar una imagen y develar una estructura. Lo segundo requiere menos fantasía y más honestidad.',
    questions: ['¿Qué parte tuya conoces pero finges no ver?', '¿A quién estás interpretando en lugar de ser?']
  },
  {
    id: '038',
    quote: 'El ego no es amo en su propia casa.',
    author: 'Sigmund Freud',
    meaning: 'Crees que decides, pero gran parte de tu conducta responde a fuerzas que no controlas ni ves. Aceptar esto no es debilidad: es lucidez. La libertad empieza reconociendo la atadura.',
    questions: ['¿Qué decides sin saber por qué lo haces?', '¿Qué fuerza interna contradice tu voluntad consciente?']
  },
  {
    id: '039',
    quote: 'El símbolo mata la cosa.',
    author: 'Jacques Lacan',
    meaning: 'Cuando nombras algo, ya no es lo mismo. La palabra captura, fija, distancia. El lenguaje nos separa de lo real. Hablar es perder contacto directo; pero también es la única forma de compartir.',
    questions: ['¿Qué experiencia pierdes al intentar explicarla?', '¿Dónde prefieres el silencio al concepto?']
  },
  {
    id: '040',
    quote: 'Entre el estímulo y la respuesta hay un espacio. En ese espacio reside nuestra libertad.',
    author: 'Viktor Frankl',
    meaning: 'No eres tus impulsos automáticos. Hay un micro-instante donde puedes elegir. Ese espacio diminuto es todo tu poder. Ampliarlo es el trabajo de una vida.',
    questions: ['¿Dónde reaccionas sin pensar?', '¿Cómo podrías crear más espacio antes de actuar?']
  },
  {
    id: '041',
    quote: 'No podemos resolver problemas usando el mismo nivel de pensamiento que usamos cuando los creamos.',
    author: 'Albert Einstein',
    meaning: 'El problema y la solución no habitan el mismo plano. Si sigues pensando igual, seguirás obteniendo lo mismo. Cambiar de nivel requiere un salto, no un esfuerzo.',
    questions: ['¿Qué problema sigues atacando con la misma lógica?', '¿Desde qué nueva perspectiva podrías mirarlo?']
  },
  {
    id: '042',
    quote: 'El significado de la vida es encontrar tu don. El propósito de la vida es entregarlo.',
    author: 'Pablo Picasso',
    meaning: 'No basta con descubrir qué eres bueno haciendo. La plenitud llega al ofrecerlo. El don que guardas se pudre; el don que circulas, se multiplica.',
    questions: ['¿Cuál es tu don natural?', '¿A quién se lo estás negando?']
  },
  {
    id: '043',
    quote: 'La muerte no es lo opuesto a la vida, sino parte de ella.',
    author: 'Haruki Murakami',
    meaning: 'Negar la muerte es negar la vida. Aceptar la finitud no es resignación: es realismo que da peso a cada instante. La urgencia nace de saber que esto termina.',
    questions: ['¿Qué harías diferente si supieras que te queda poco tiempo?', '¿Qué estás posponiendo?']
  },
  {
    id: '044',
    quote: 'El problema no es el problema. El problema es tu actitud sobre el problema.',
    author: 'Jack Sparrow',
    meaning: 'Los hechos son neutrales; tu interpretación los carga. Cambiar la actitud no cambia el hecho, pero cambia tu relación con él. Y eso lo cambia todo.',
    questions: ['¿Qué problema sería menor si cambiaras tu actitud?', '¿Qué narrativa estás añadiendo al hecho puro?']
  },
  {
    id: '045',
    quote: 'Eres el cielo. Todo lo demás es solo el clima.',
    author: 'Pema Chödrön',
    meaning: 'Tus pensamientos, emociones y circunstancias son pasajeros. Tú no eres ninguno de ellos. Eres el espacio donde ocurren. Recordarlo te da estabilidad.',
    questions: ['¿Con qué pensamiento te estás identificando?', '¿Puedes observarlo sin ser él?']
  },
  {
    id: '046',
    quote: 'El silencio es la respuesta más fuerte.',
    author: 'Dalai Lama',
    meaning: 'No todo requiere palabras. A veces callar es más poderoso que argumentar. El silencio consciente es presencia; el silencio reactivo es ausencia.',
    questions: ['¿Dónde hablas de más por necesidad de control?', '¿Qué pasaría si guardaras silencio?']
  },
  {
    id: '047',
    quote: 'La ansiedad es la sensación de estar separado de la vida.',
    author: 'Alan Watts',
    meaning: 'Te angustias cuando te sientes fuera del flujo. La ansiedad no es enemigo: es señal de desconexión. Volver al presente es volver a la vida.',
    questions: ['¿En qué momento te sientes más ansioso?', '¿Qué te desconecta del presente?']
  },
  {
    id: '048',
    quote: 'Tu tarea no es buscar el amor, sino buscar y encontrar todas las barreras que has construido contra él.',
    author: 'Rumi',
    meaning: 'El amor ya está. Lo que falta es quitar los muros. No busques amor: quita miedo, juicio, control. El amor aparece cuando dejas de bloquearlo.',
    questions: ['¿Qué barreras levantas contra el amor?', '¿A qué le temes si te abres?']
  },
  {
    id: '049',
    quote: 'La libertad no es hacer lo que quieres, sino querer lo que haces.',
    author: 'Jean-Paul Sartre',
    meaning: 'Libertad no es ausencia de límites. Es apropiarte de tu elección. Puedes no elegir la circunstancia, pero sí tu actitud hacia ella.',
    questions: ['¿Dónde actúas como víctima de tu propia vida?', '¿Cómo podrías elegir activamente lo que ya haces?']
  },
  {
    id: '050',
    quote: 'El apego es la raíz del sufrimiento.',
    author: 'Buda',
    meaning: 'No sufres por perder algo. Sufres por aferrarte. El apego crea la ilusión de permanencia. Soltar no es perder: es aceptar el flujo.',
    questions: ['¿A qué te aferras?', '¿Qué perderías si lo soltaras?']
  },
  {
    id: '051',
    quote: 'El ego dice: cuando todo esté en orden, encontraré paz. El espíritu dice: encuentra paz y todo estará en orden.',
    author: 'Marianne Williamson',
    meaning: 'El ego busca control externo. El espíritu busca aceptación interna. La paz no llega después del orden: el orden llega después de la paz.',
    questions: ['¿Qué esperas que se ordene para estar en paz?', '¿Puedes estar en paz ahora, sin condiciones?']
  },
  {
    id: '052',
    quote: 'Conocer a otros es inteligencia. Conocerse a uno mismo es sabiduría.',
    author: 'Lao Tzu',
    meaning: 'Puedes estudiar el mundo y no entender nada de ti. La sabiduría no es externa: es autoconocimiento. Sin él, toda inteligencia es vacía.',
    questions: ['¿Cuánto tiempo dedicas a conocerte?', '¿Qué descubrirías si te miraras con honestidad?']
  },
  {
    id: '053',
    quote: 'No hay mayor tiranía que la que se ejerce en nombre de la salud y la virtud.',
    author: 'C.S. Lewis',
    meaning: 'El moralismo disfrazado de bien es opresión. Las peores crueldades se justifican con "es por tu bien". El amor real respeta la libertad.',
    questions: ['¿Dónde controlas en nombre del bien?', '¿Respetas la libertad del otro aunque te duela?']
  },
  {
    id: '054',
    quote: 'No existe el pasado ni el futuro. Solo existe el ahora, en diferentes formas.',
    author: 'Thích Nhất Hạnh',
    meaning: 'El pasado es ahora recordado. El futuro es ahora imaginado. Nunca sales del presente. Todo ocurre ahora.',
    questions: ['¿Dónde vives más: en el pasado o en el futuro?', '¿Puedes volver al ahora?']
  },
  {
    id: '055',
    quote: 'El cambio es la única constante.',
    author: 'Heráclito',
    meaning: 'Todo fluye, nada permanece. Aferrarte a lo que cambia es sufrir. Aceptar el cambio es fluir con la vida.',
    questions: ['¿A qué te aferras queriendo que no cambie?', '¿Puedes soltar y confiar en el flujo?']
  },
  {
    id: '056',
    quote: 'No eres tus pensamientos. Eres quien los observa.',
    author: 'Eckhart Tolle',
    meaning: 'Tus pensamientos pasan. Tú permaneces. No eres la voz en tu cabeza: eres el espacio donde esa voz ocurre.',
    questions: ['¿Con qué pensamiento te identificas ahora?', '¿Puedes observarlo sin ser él?']
  },
  {
    id: '057',
    quote: 'No necesitas ser extraordinario para ser valioso.',
    author: 'Brené Brown',
    meaning: 'Tu valor no depende de tus logros. Eres valioso por existir. La cultura del éxito te miente: no tienes que probar nada.',
    questions: ['¿Qué te hace sentir valioso?', '¿Puedes sentirte valioso sin logros?']
  },
  {
    id: '058',
    quote: 'Lo que niegas, te controla. Lo que aceptas, te libera.',
    author: 'Carl G. Jung',
    meaning: 'La negación da poder. Aceptar es soltar resistencia. No significa aprobar: significa dejar de luchar.',
    questions: ['¿Qué niegas constantemente?', '¿Qué pasaría si lo aceptaras?']
  },
  {
    id: '059',
    quote: 'La ansiedad es la emoción de vivir en el futuro. La depresión es la emoción de vivir en el pasado.',
    author: 'Anónimo',
    meaning: 'Ambas te sacan del presente. La ansiedad teme lo que vendrá. La depresión lamenta lo que fue. El presente es la única salida.',
    questions: ['¿Dónde vives más: futuro o pasado?', '¿Puedes regresar al ahora?']
  },
  {
    id: '060',
    quote: 'El que no arriesga, no gana. Pero el que arriesga sin pensar, pierde.',
    author: 'Proverbio',
    meaning: 'El riesgo es necesario, pero no el imprudente. La valentía no es inconsciencia. Es coraje calculado.',
    questions: ['¿Dónde evitas riesgos por miedo?', '¿Dónde arriesgas sin pensar?']
  },
  {
    id: '061',
    quote: 'El deseo es la esencia misma del hombre.',
    author: 'Baruch Spinoza',
    meaning: 'No deseas porque algo es valioso; algo se vuelve valioso porque lo deseas. El deseo no es defecto ni carencia: es motor. Negarlo no te eleva; entenderlo te libera.',
    questions: ['¿Qué deseo niegas por considerarlo "indigno"?', '¿Cómo cambiaría tu vida si lo aceptaras sin juzgarlo?']
  },
  {
    id: '062',
    quote: 'Todo lo que no se transforma se transfiere.',
    author: 'Michael Meade',
    meaning: 'El trauma no elaborado migra: a tus relaciones, a tu cuerpo, a tus hijos. No desaparece por ignorarlo. Solo cambia de forma hasta que alguien lo mire de frente.',
    questions: ['¿Qué dolor heredaste sin saberlo?', '¿Qué estás transmitiendo sin querer?']
  },
  {
    id: '063',
    quote: 'Donde estaba el Ello, debe advenir el Yo.',
    author: 'Sigmund Freud',
    meaning: 'El objetivo no es eliminar lo pulsional, sino hacerlo consciente. No se trata de ser puro, sino de ser responsable. Reconocer tus fuerzas oscuras es el primer acto de libertad.',
    questions: ['¿Qué impulso tuyo actúa sin permiso?', '¿Puedes reconocerlo sin castigarte?']
  },
  {
    id: '064',
    quote: 'El hombre es un animal suspendido en redes de significación que él mismo ha tejido.',
    author: 'Clifford Geertz',
    meaning: 'No vives en el mundo tal cual es, sino en el mundo tal como lo interpretas. Tus significados son tu jaula y tu libertad. Cambiar la red de sentido cambia tu realidad.',
    questions: ['¿Qué historia te cuentas sobre ti mismo?', '¿Qué pasaría si cambiaras esa narrativa?']
  },
  {
    id: '065',
    quote: 'La pregunta que uno hace determina la respuesta que obtendrá.',
    author: 'Ludwig Wittgenstein',
    meaning: 'Cada pregunta ya trae su respuesta implícita. Si preguntas "¿por qué me pasa esto?", asumes victimismo. Si preguntas "¿para qué me sirve esto?", asumes agencia.',
    questions: ['¿Qué preguntas te haces habitualmente?', '¿Cómo cambiaría tu experiencia si cambiaras la pregunta?']
  },
  {
    id: '066',
    quote: 'El verdadero viaje de descubrimiento no consiste en buscar nuevos paisajes, sino en tener nuevos ojos.',
    author: 'Marcel Proust',
    meaning: 'No necesitas cambiar de lugar; necesitas cambiar de mirada. Lo que ves depende de cómo miras. La misma vida puede ser prisión o revelación según tu lente.',
    questions: ['¿Qué situación familiar podrías ver de otra forma?', '¿Qué supuesto te impide ver lo evidente?']
  },
  {
    id: '067',
    quote: 'La gente olvida lo que dijiste, olvida lo que hiciste, pero nunca olvida cómo la hiciste sentir.',
    author: 'Maya Angelou',
    meaning: 'El contenido importa menos que la resonancia emocional. No se trata de ser correcto, sino de ser sentido. La huella profunda no es lógica: es afectiva.',
    questions: ['¿Cómo haces sentir a las personas cercanas?', '¿Qué quieres que recuerden de ti cuando te vayas?']
  },
  {
    id: '068',
    quote: 'No somos seres humanos teniendo una experiencia espiritual. Somos seres espirituales teniendo una experiencia humana.',
    author: 'Pierre Teilhard de Chardin',
    meaning: 'Invierte el orden: no eres cuerpo que busca alma, sino alma que habita cuerpo. Esta vida no es todo; es una de las formas posibles. Eso te quita peso y te da perspectiva.',
    questions: ['¿Qué cambiaría si vieras tu vida como una experiencia transitoria?', '¿Qué tomarías menos en serio?']
  },
  {
    id: '069',
    quote: 'El miedo es la emoción que aparece cuando lo importante está en juego.',
    author: 'Steven Pressfield',
    meaning: 'No temes lo irrelevante. El miedo señala valor. Si te da miedo, probablemente importa. No lo evites; úsalo como brújula.',
    questions: ['¿A qué le tienes miedo?', '¿Qué te dice ese miedo sobre lo que realmente quieres?']
  },
  {
    id: '070',
    quote: 'No puedes detener las olas, pero puedes aprender a surfear.',
    author: 'Jon Kabat-Zinn',
    meaning: 'La vida no para. Las emociones vienen y van. Intentar controlarlas es agotador. Mejor aprender a navegar sin resistir ni aferrarte.',
    questions: ['¿Qué emoción estás tratando de eliminar?', '¿Cómo sería solo acompañarla sin luchar?']
  },
  {
    id: '071',
    quote: 'No preguntes qué necesita el mundo. Pregunta qué te hace sentir vivo, y hazlo. Porque lo que el mundo necesita es gente que haya cobrado vida.',
    author: 'Howard Thurman',
    meaning: 'No te martirices en pos del deber. Tu energía plena es tu mejor contribución. Haz lo que te enciende: eso será más útil que cualquier sacrificio.',
    questions: ['¿Qué te hace sentir realmente vivo?', '¿Por qué no le das más espacio?']
  },
  {
    id: '072',
    quote: 'Sé tú el cambio que quieres ver en el mundo.',
    author: 'Gandhi',
    meaning: 'No esperes que otros cambien primero. Empieza por ti. Tu transformación personal irradia. No necesitas ser perfecto; necesitas ser coherente.',
    questions: ['¿Qué criticas en otros pero no cambias en ti?', '¿Dónde puedes empezar hoy?']
  },
  {
    id: '073',
    quote: 'La verdadera meditación no es sobre algo, sino el reconocimiento de que eres algo.',
    author: 'Krishnamurti',
    meaning: 'No medites para lograr algo. Medita para recordar lo que ya eres. La práctica no te construye; te revela.',
    questions: ['¿Qué esperas lograr meditando?', '¿Puedes simplemente ser sin buscar nada?']
  },
  {
    id: '074',
    quote: 'El perdón es la llave de la acción y la libertad.',
    author: 'Hannah Arendt',
    meaning: 'Mientras no perdones, estás atado al pasado. El perdón no es regalo para el otro; es liberación para ti. No es olvido: es soltar.',
    questions: ['¿A quién no has perdonado?', '¿Qué ganarías al soltar ese rencor?']
  },
  {
    id: '075',
    quote: 'El amor no es algo que haces, es algo que eres.',
    author: 'Dan Millman',
    meaning: 'Amar no es acción ni logro. Es estado. No se trata de hacer cosas amorosas, sino de habitar el amor como forma de ser.',
    questions: ['¿Cómo demuestras amor?', '¿Puedes simplemente ser amor sin probar nada?']
  },
  {
    id: '076',
    quote: 'La soledad no se cura con compañía, sino con presencia.',
    author: 'Thomas Merton',
    meaning: 'Puedes estar rodeado y sentirte vacío. La soledad existencial solo se disuelve cuando habitas tu propio ser. Estar contigo es la única cura real.',
    questions: ['¿Huyes de la soledad o la habitas?', '¿Qué encontrarías si te quedaras a solas contigo?']
  },
  {
    id: '077',
    quote: 'Entre el deseo y el objeto siempre hay una distancia insalvable.',
    author: 'Jacques Lacan',
    meaning: 'Nunca obtienes lo que crees que quieres. El objeto deseado nunca coincide con tu fantasía. Aceptar esta brecha es madurez; negarla es neurosis.',
    questions: ['¿Qué logro esperabas que te llenara y no lo hizo?', '¿Puedes desear sin necesitar poseer?']
  },
  {
    id: '078',
    quote: 'El trauma no es lo que te pasó, sino lo que quedó sin procesar.',
    author: 'Gabor Maté',
    meaning: 'El evento no es trauma en sí mismo. Lo es cuando no hubo espacio para sentirlo, nombrarlo, integrarlo. El trauma vive en lo no digerido.',
    questions: ['¿Qué experiencia guardaste sin procesar?', '¿Qué necesitarías para terminar de vivirla?']
  },
  {
    id: '079',
    quote: 'La depresión es ira congelada.',
    author: 'Tradicional psicoanalítico',
    meaning: 'Cuando no puedes expresar rabia, la diriges hacia adentro. La depresión es energía atascada. No es falta de fuerza: es fuerza mal dirigida.',
    questions: ['¿Con quién o qué no puedes estar enojado?', '¿Dónde has vuelto la rabia contra ti mismo?']
  },
  {
    id: '080',
    quote: 'El sufrimiento cesa cuando aceptas lo inevitable.',
    author: 'Séneca',
    meaning: 'No puedes cambiar lo que ya es. Luchar contra lo inevitable es agregar dolor al dolor. La aceptación no es resignación: es realismo que libera.',
    questions: ['¿Contra qué realidad sigues luchando?', '¿Qué pasaría si la aceptaras tal cual es?']
  },
  {
    id: '081',
    quote: 'El hombre es el único animal que tropieza dos veces con la misma piedra.',
    author: 'Proverbio español',
    meaning: 'La repetición compulsiva es humana. No aprendemos de una vez. Volvemos al mismo error hasta que algo en nosotros cambia de verdad.',
    questions: ['¿Qué error sigues repitiendo?', '¿Qué tendrías que cambiar en ti para no volver a tropezar?']
  },
  {
    id: '082',
    quote: 'La culpa es el residuo tóxico de una moral no examinada.',
    author: 'Tradición existencialista',
    meaning: 'Sientes culpa no por lo que hiciste, sino por haber roto un mandato que ni siquiera elegiste. Examinar esa moral es liberarte del juez interno.',
    questions: ['¿Por qué te sientes culpable?', '¿Esa moral es tuya o heredada?']
  },
  {
    id: '083',
    quote: 'Lo opuesto al amor no es el odio, sino la indiferencia.',
    author: 'Elie Wiesel',
    meaning: 'Odiar requiere energía, conexión, presencia. La indiferencia es ausencia total. Cuando ya no sientes nada, la relación murió.',
    questions: ['¿Hacia quién sientes indiferencia?', '¿Qué murió en esa relación?']
  },
  {
    id: '084',
    quote: 'El sentido de la vida no se encuentra, se crea.',
    author: 'Viktor Frankl',
    meaning: 'No hay un sentido preexistente esperándote. Lo construyes con tus elecciones, tus valores, tus actos. Cada decisión es una pincelada de sentido.',
    questions: ['¿Qué sentido estás creando con tus acciones?', '¿Tus días construyen o destruyen ese sentido?']
  },
  {
    id: '085',
    quote: 'El cuerpo lleva la cuenta de todo.',
    author: 'Bessel van der Kolk',
    meaning: 'Lo que no se procesa emocionalmente se archiva somáticamente. El cuerpo recuerda lo que la mente olvida. El síntoma físico es mensaje.',
    questions: ['¿Qué te dice tu cuerpo con sus síntomas?', '¿Qué emoción no procesada podría estar ahí?']
  },
  {
    id: '086',
    quote: 'El dolor es inevitable. El sufrimiento es opcional.',
    author: 'Haruki Murakami',
    meaning: 'El dolor viene con la vida. El sufrimiento es tu resistencia a ese dolor. Aceptar no elimina el dolor, pero sí el sufrimiento añadido.',
    questions: ['¿Dónde estás añadiendo sufrimiento a tu dolor?', '¿Puedes sentir el dolor sin la historia?']
  },
  {
    id: '087',
    quote: 'No juzgues cada día por la cosecha que recoges, sino por las semillas que plantas.',
    author: 'Robert Louis Stevenson',
    meaning: 'Los resultados llegan tarde. Lo que cuenta es la siembra diaria. No midas tu valor por lo visible hoy, sino por lo que estás construyendo.',
    questions: ['¿Qué semillas estás plantando hoy?', '¿Confías en el proceso aunque no veas resultados?']
  },
  {
    id: '088',
    quote: 'La verdad os hará libres, pero primero os hará miserables.',
    author: 'James A. Garfield',
    meaning: 'Ver la verdad duele antes de liberar. Rompe ilusiones, desmonta fantasías. La libertad tiene costo. Pero la mentira cuesta más.',
    questions: ['¿Qué verdad evitas porque duele?', '¿Cuánto te cuesta mantener la ilusión?']
  },
  {
    id: '089',
    quote: 'El carácter se forma en las tormentas del mundo.',
    author: 'Goethe',
    meaning: 'No creces en la comodidad. La adversidad revela y forja. Lo que sobrevive a la crisis es lo verdaderamente tuyo.',
    questions: ['¿Qué crisis reciente te transformó?', '¿Qué fortaleza descubriste en la tormenta?']
  },
  {
    id: '090',
    quote: 'La esperanza no es convicción de que algo saldrá bien, sino la certeza de que algo tiene sentido sin importar cómo salga.',
    author: 'Václav Havel',
    meaning: 'La esperanza madura no depende del resultado. Es confianza en el proceso mismo. Puedes perder y aun así no perder sentido.',
    questions: ['¿Tu esperanza depende de resultados?', '¿Puedes encontrar sentido en el fracaso?']
  },
  {
    id: '091',
    quote: 'La rabia es información. Te dice dónde están tus límites.',
    author: 'Lama Rod Owens',
    meaning: 'La rabia no es enemiga. Es señal de invasión. Alguien cruzó un límite. En lugar de suprimirla, escúchala: te enseña dónde poner el no.',
    questions: ['¿Qué te da rabia últimamente?', '¿Qué límite necesitas poner?']
  },
  {
    id: '092',
    quote: 'El sabio no es quien tiene todas las respuestas, sino quien hace las preguntas correctas.',
    author: 'Claude Lévi-Strauss',
    meaning: 'La sabiduría no es acumulación de respuestas. Es calidad de preguntas. Una buena pregunta abre; una mala respuesta cierra.',
    questions: ['¿Qué pregunta cambiaría tu perspectiva actual?', '¿Estás buscando respuestas o certezas?']
  },
  {
    id: '093',
    quote: 'No hay camino a la paz. La paz es el camino.',
    author: 'Mahatma Gandhi',
    meaning: 'La paz no está al final de una lucha. Está en la forma de transitar. Si peleas por la paz, ya la perdiste. La paz se practica, no se conquista.',
    questions: ['¿Cómo buscas la paz?', '¿Estás en paz con tu camino o solo con la meta?']
  },
  {
    id: '094',
    quote: 'La creatividad requiere el coraje de soltar certezas.',
    author: 'Erich Fromm',
    meaning: 'Crear es entrar a lo desconocido. Si ya sabes qué harás, no estás creando: estás ejecutando. La creatividad vive en la incertidumbre.',
    questions: ['¿Dónde necesitas más certeza antes de actuar?', '¿Puedes crear sin saber el resultado?']
  },
  {
    id: '095',
    quote: 'El maestro ha fallado más veces que el principiante lo ha intentado.',
    author: 'Stephen McCranie',
    meaning: 'El fracaso no es lo opuesto al éxito: es parte del proceso. El maestro fracasó mil veces, pero no dejó que eso lo detuviera.',
    questions: ['¿Cuántas veces has fallado en lo que importa?', '¿Qué te detiene después del fracaso?']
  },
  {
    id: '096',
    quote: 'La conciencia es el lugar donde el universo se conoce a sí mismo.',
    author: 'Alan Watts',
    meaning: 'No eres un observador externo. Eres el universo volviéndose consciente. Tu experiencia no es personal: es cósmica.',
    questions: ['¿Te sientes separado del universo?', '¿Qué cambiaría si te vieras como parte del todo?']
  },
  {
    id: '097',
    quote: 'El arte es la mentira que nos permite ver la verdad.',
    author: 'Pablo Picasso',
    meaning: 'La ficción revela más que el realismo. El arte no copia: interpreta, destila, amplifica. A veces una mentira bien contada dice más verdad que un hecho.',
    questions: ['¿Qué obra de arte te ha revelado algo sobre ti?', '¿Qué mentira necesitas para ver tu verdad?']
  },
  {
    id: '098',
    quote: 'La felicidad es una dirección, no un lugar.',
    author: 'Sydney J. Harris',
    meaning: 'No llegarás a la felicidad. La felicidad es cómo caminas, no dónde terminas. Es orientación, no destino.',
    questions: ['¿Hacia dónde apunta tu vida?', '¿Eres feliz en el camino o solo esperas serlo al llegar?']
  },
  {
    id: '099',
    quote: 'La mente es un excelente sirviente, pero un terrible amo.',
    author: 'Proverbio budista',
    meaning: 'La mente es herramienta, no identidad. Cuando te identificas con ella, te esclaviza. Cuando la observas, la usas.',
    questions: ['¿Tu mente te sirve o te domina?', '¿Puedes observar tus pensamientos sin ser ellos?']
  },
  {
    id: '100',
    quote: 'La comparación es el ladrón de la alegría.',
    author: 'Theodore Roosevelt',
    meaning: 'Mientras te compares, nunca serás suficiente. Siempre habrá alguien mejor. La alegría vive en la gratitud por lo que eres, no en la medida contra otros.',
    questions: ['¿Con quién te comparas constantemente?', '¿Qué perderías si dejaras de compararte?']
  },
  {
    id: '101',
    quote: 'El silencio es la respuesta a muchas cosas. Sonríe cuando quieran saber tu secreto. Camina cuando quieran conocer tu destino.',
    author: 'Rumi',
    meaning: 'No todo merece explicación. A veces la respuesta es no responder. El misterio protege lo sagrado.',
    questions: ['¿Dónde explicas de más?', '¿Qué protegerías si eligieras el silencio?']
  },
  {
    id: '102',
    quote: 'La oscuridad no puede expulsar a la oscuridad; solo la luz puede hacer eso.',
    author: 'Martin Luther King Jr.',
    meaning: 'No combatas el mal con más mal. No sanes el odio con odio. Solo lo opuesto transforma: amor contra odio, luz contra sombra.',
    questions: ['¿Dónde respondes con la misma energía que rechazas?', '¿Puedes responder con lo opuesto?']
  },
  {
    id: '103',
    quote: 'La vida es lo que pasa mientras estás ocupado haciendo otros planes.',
    author: 'John Lennon',
    meaning: 'Planeas el futuro y pierdes el presente. La vida no es lo que planeas: es lo que ocurre. Estar presente es más importante que estar preparado.',
    questions: ['¿Cuánto de tu vida pasa desapercibido?', '¿Qué estás perdiéndote mientras planeas?']
  },
  {
    id: '104',
    quote: 'El que tiene un porqué para vivir puede soportar casi cualquier cómo.',
    author: 'Friedrich Nietzsche',
    meaning: 'El sentido da fuerza. Si sabes para qué vives, aguantas lo que sea. Sin sentido, hasta lo fácil se vuelve insoportable.',
    questions: ['¿Cuál es tu porqué?', '¿Qué soportarías si tuvieras un sentido claro?']
  },
  {
    id: '105',
    quote: 'Lo importante no es lo que nos hace el destino, sino lo que nosotros hacemos de él.',
    author: 'Florence Nightingale',
    meaning: 'No controlas lo que llega. Controlas tu respuesta. Ahí está tu poder: no en lo externo, sino en cómo lo interpretas y actúas.',
    questions: ['¿Qué evento difícil estás interpretando de forma limitante?', '¿Cómo podrías responder diferente?']
  },
  {
    id: '106',
    quote: 'El dolor que no se transforma se transmite.',
    author: 'Richard Rohr',
    meaning: 'Si no procesas tu dolor, lo pasarás a otros. Tus hijos, tus parejas, tus equipos. El dolor no elaborado migra de generación en generación.',
    questions: ['¿Qué dolor heredaste?', '¿Qué dolor estás transmitiendo sin saberlo?']
  },
  {
    id: '107',
    quote: 'La vida no es un problema a resolver, sino una realidad a experimentar.',
    author: 'Søren Kierkegaard',
    meaning: 'Dejas de vivir cuando solo buscas soluciones. La vida no es acertijo: es experiencia. Estar presente es más importante que entenderlo todo.',
    questions: ['¿Dónde estás tratando de resolver en lugar de vivir?', '¿Puedes experimentar sin necesitar entender?']
  },
  {
    id: '108',
    quote: 'El hombre es condenado a ser libre.',
    author: 'Jean-Paul Sartre',
    meaning: 'No puedes escapar de tu libertad. Incluso no elegir es elegir. La libertad es peso, no solo privilegio. Asumirla es responsabilidad.',
    questions: ['¿Dónde finges no ser libre?', '¿Qué elección estás evitando hacer?']
  },
  {
    id: '109',
    quote: 'El sufrimiento es el residuo que queda cuando te resistes a lo que es.',
    author: 'Byron Katie',
    meaning: 'El dolor es real. El sufrimiento es tu lucha contra la realidad. Cuando aceptas lo que es, el sufrimiento cae. No elimina el dolor, pero sí la guerra interna.',
    questions: ['¿A qué realidad te resistes?', '¿Qué pasaría si la aceptaras tal cual es?']
  },
  {
    id: '110',
    quote: 'No puedes enseñar nada a un hombre, solo puedes ayudarle a descubrirlo dentro de sí mismo.',
    author: 'Galileo Galilei',
    meaning: 'El verdadero aprendizaje no es transferencia: es revelación. No puedes meter conocimiento en alguien. Solo puedes facilitar que lo descubra.',
    questions: ['¿Qué tratas de enseñar que nadie aprende?', '¿Cómo podrías facilitar que lo descubran?']
  },
  {
    id: '111',
    quote: 'El secreto de la existencia humana no solo está en vivir, sino en saber para qué se vive.',
    author: 'Fiódor Dostoyevski',
    meaning: 'Vivir sin sentido es sobrevivir. El sentido da dirección, propósito, peso a cada acto. Sin él, la vida es vacía aunque esté llena.',
    questions: ['¿Para qué vives?', '¿Tus acciones diarias reflejan ese para qué?']
  },
  {
    id: '112',
    quote: 'El único viaje imposible es el que nunca comienzas.',
    author: 'Tony Robbins',
    meaning: 'No hay garantía de éxito. Pero no empezar es garantía de fracaso. El único error irreversible es no intentar.',
    questions: ['¿Qué viaje no comienzas por miedo?', '¿Qué perderías si dieras el primer paso?']
  },
  {
    id: '113',
    quote: 'La integridad es hacer lo correcto aunque nadie te esté mirando.',
    author: 'C.S. Lewis',
    meaning: 'Tu carácter no es lo que muestras. Es lo que haces en privado. La integridad no necesita testigos: es coherencia interna.',
    questions: ['¿Qué haces diferente cuando nadie mira?', '¿Eres la misma persona en público y en privado?']
  },
  {
    id: '114',
    quote: 'El silencio es una fuente de gran fortaleza.',
    author: 'Lao Tzu',
    meaning: 'En el silencio no hay ego. No hay necesidad de probar, defender, explicar. El silencio da espacio para escuchar lo esencial.',
    questions: ['¿Cuándo fue la última vez que guardaste silencio completo?', '¿Qué escucharías si te callaras?']
  },
  {
    id: '115',
    quote: 'La verdadera generosidad hacia el futuro consiste en darlo todo al presente.',
    author: 'Albert Camus',
    meaning: 'No preparas el futuro acumulando. Lo preparas siendo pleno ahora. El presente bien vivido es la mejor inversión.',
    questions: ['¿Qué postergas para el futuro?', '¿Puedes darlo todo ahora?']
  },
  {
    id: '116',
    quote: 'El desapego no es no amar, es amar sin poseer.',
    author: 'Osho',
    meaning: 'Puedes amar sin aferrarte. El amor maduro no necesita control. Soltar no es dejar de amar: es amar con libertad.',
    questions: ['¿A quién amas queriendo poseer?', '¿Puedes amar dejando ir?']
  },
  {
    id: '117',
    quote: 'El verdadero conocimiento es conocer la extensión de la propia ignorancia.',
    author: 'Confucio',
    meaning: 'Saber que no sabes es sabiduría. El ignorante cree saber. El sabio reconoce sus límites. La humildad intelectual es el inicio del aprendizaje real.',
    questions: ['¿Dónde finges saber más de lo que sabes?', '¿Puedes admitir tu ignorancia?']
  },
  {
    id: '118',
    quote: 'La soledad se disfraza de independencia.',
    author: 'Esther Perel',
    meaning: 'A veces dices "no necesito a nadie" cuando en realidad tienes miedo a necesitar. La independencia defensiva es soledad disfrazada.',
    questions: ['¿Dónde finges no necesitar?', '¿Qué miedo esconde tu independencia?']
  },
  {
    id: '119',
    quote: 'El perdón no cambia el pasado, pero sí amplía el futuro.',
    author: 'Paul Boese',
    meaning: 'No perdonas para cambiar lo que fue. Perdonas para liberar lo que será. El rencor te ata; el perdón te abre.',
    questions: ['¿Qué futuro estás limitando por no perdonar?', '¿Qué se abriría si soltaras ese rencor?']
  },
  {
    id: '120',
    quote: 'La crisis es oportunidad con ropa de trabajo.',
    author: 'Proverbio chino',
    meaning: 'La crisis no es solo amenaza: es llamado. Rompe lo viejo para dar espacio a lo nuevo. La oportunidad viene disfrazada de problema.',
    questions: ['¿Qué crisis reciente te abrió una puerta?', '¿Puedes ver la oportunidad en el caos?']
  },
  {
    id: '121',
    quote: 'La raíz del sufrimiento es el deseo de que las cosas sean diferentes a como son.',
    author: 'Buda',
    meaning: 'Sufres cuando peleas con la realidad. Quieres que algo sea distinto y no lo es. Aceptar lo que es no es resignación: es paz.',
    questions: ['¿Qué realidad rechazas?', '¿Puedes aceptarla sin luchar?']
  },
  {
    id: '122',
    quote: 'El caos es un orden por descifrar.',
    author: 'José Saramago',
    meaning: 'Lo que parece caos suele tener patrón. No todo es azar. A veces solo falta perspectiva para ver el orden oculto.',
    questions: ['¿Qué caos vives ahora?', '¿Qué patrón podrías estar perdiendo?']
  },
  {
    id: '123',
    quote: 'El miedo es el precio de la imaginación.',
    author: 'Thomas Harris',
    meaning: 'Imaginas lo peor y lo sientes como real. El miedo no es realidad: es proyección. Cuanto más imaginas, más temes.',
    questions: ['¿Qué catástrofe imaginas que no ha pasado?', '¿Puedes volver al presente donde todo está bien?']
  },
  {
    id: '124',
    quote: 'La autenticidad es la práctica diaria de soltar lo que creemos que deberíamos ser y abrazar lo que somos.',
    author: 'Brené Brown',
    meaning: 'Ser auténtico no es un estado: es práctica. Cada día eliges: ser quien crees que debes o ser quien eres.',
    questions: ['¿Qué versión de ti estás interpretando?', '¿Puedes ser tú sin disculpas?']
  },
  {
    id: '125',
    quote: 'El presente es el único momento que tienes. Hazlo el momento principal de tu vida.',
    author: 'Eckhart Tolle',
    meaning: 'Vives siempre ahora. Nunca en otro tiempo. El pasado y futuro son mentales. Solo el ahora es real.',
    questions: ['¿Dónde estás mentalmente ahora?', '¿Puedes volver completamente al presente?']
  },
  {
    id: '126',
    quote: 'El mayor enemigo del conocimiento no es la ignorancia, sino la ilusión del conocimiento.',
    author: 'Stephen Hawking',
    meaning: 'Creer que sabes cierra el aprendizaje. La ignorancia se corrige; la arrogancia, no. El peligro no es no saber: es creer que sí.',
    questions: ['¿Dónde crees saber sin realmente saber?', '¿Puedes abrirte a aprender de nuevo?']
  },
  {
    id: '127',
    quote: 'No hay atajos para cualquier lugar al que valga la pena ir.',
    author: 'Beverly Sills',
    meaning: 'Lo valioso requiere tiempo, esfuerzo, paciencia. El atajo promete rapidez pero roba profundidad. El camino largo construye.',
    questions: ['¿Dónde buscas atajos?', '¿Qué estás evitando al no transitar el camino completo?']
  },
  {
    id: '128',
    quote: 'Si eliges el miedo, el mar se vuelve prisión; si eliges el rumbo, se vuelve camino.',
    author: 'Jack Sparrow',
    meaning: 'La realidad es la misma, pero tu postura cambia el mapa. Cuando reaccionas desde el miedo, todo se siente amenaza; cuando eliges dirección, incluso el caos se vuelve navegación. No controlas las olas, pero sí el timón.',
    questions: ['¿Qué emoción está sosteniendo tu “problema” hoy: miedo o rumbo?', '¿Cuál es el siguiente paso pequeño que te devuelve el timón?']
  },
  {
    id: '129',
    quote: 'La compasión no es una relación entre el sanador y el herido. Es una relación entre iguales.',
    author: 'Pema Chödrön',
    meaning: 'Compasión no es superioridad. Es reconocer que todos sufrimos. No ayudas desde arriba: acompañas desde el lado.',
    questions: ['¿A quién miras desde arriba?', '¿Puedes verlo como igual?']
  },
  {
    id: '130',
    quote: 'El mayor acto de rebeldía es ser tú mismo en un mundo que constantemente trata de convertirte en otra cosa.',
    author: 'Ralph Waldo Emerson',
    meaning: 'El mundo te moldea, te juzga, te exige. Ser tú mismo sin disculpas es revolución. La autenticidad es el acto más valiente.',
    questions: ['¿Dónde finges para encajar?', '¿Puedes ser tú aunque no te aprueben?']
  },
  {
    id: '131',
    quote: 'Lo que resistes, persiste y se fortalece.',
    author: 'Carl G. Jung',
    meaning: 'Pelear contra algo le da energía. Mientras resistes, lo alimentas. Soltar la resistencia es quitarle poder.',
    questions: ['¿Contra qué luchas internamente?', '¿Qué pasaría si dejaras de pelear?']
  },
  {
    id: '132',
    quote: 'El amor verdadero nace de la comprensión.',
    author: 'Thích Nhất Hạnh',
    meaning: 'No amas lo que idealizas. Amas lo que comprendes. El amor maduro ve lo real y aun así elige quedarse.',
    questions: ['¿Amas al otro tal como es?', '¿O amas la idea que tienes de él?']
  },
  {
    id: '133',
    quote: 'El éxito no es la clave de la felicidad. La felicidad es la clave del éxito.',
    author: 'Albert Schweitzer',
    meaning: 'No serás feliz después de lograr algo. Serás exitoso si eres feliz en el camino. La felicidad no es resultado: es causa.',
    questions: ['¿Qué logro persigues creyendo que te hará feliz?', '¿Puedes ser feliz ahora, antes del éxito?']
  },
  {
    id: '134',
    quote: 'La vida no es esperar a que pase la tormenta, es aprender a bailar bajo la lluvia.',
    author: 'Vivian Greene',
    meaning: 'Siempre habrá tormenta. Si esperas calma absoluta para vivir, nunca vivirás. La vida no es control: es adaptación.',
    questions: ['¿Qué estás posponiendo hasta que todo esté bien?', '¿Puedes bailar aunque llueva?']
  },
  {
    id: '135',
    quote: 'El ego busca problemas para resolver. El espíritu busca paz para habitar.',
    author: 'Marianne Williamson',
    meaning: 'El ego se mantiene vivo resolviendo. El espíritu descansa en el ser. No todo es problema a resolver: algunas cosas solo piden presencia.',
    questions: ['¿Dónde buscas problemas para sentirte útil?', '¿Puedes simplemente estar sin resolver nada?']
  },
  {
    id: '136',
    quote: 'No hay mayor carga que un gran potencial sin usar.',
    author: 'Charles Schulz',
    meaning: 'El talento sin acción es peso. El potencial no realizado es frustración acumulada. El don guardado se pudre.',
    questions: ['¿Qué potencial tuyo no estás usando?', '¿Qué te detiene de desplegarlo?']
  },
  {
    id: '137',
    quote: 'La paz comienza con una sonrisa.',
    author: 'Madre Teresa',
    meaning: 'No esperes gran gesto para sentir paz. Empieza micro: una sonrisa, una respiración. Lo pequeño acumula.',
    questions: ['¿Qué gesto pequeño podrías hacer hoy por paz?', '¿Esperas algo grande o puedes empezar simple?']
  },
  {
    id: '138',
    quote: 'La magia está en lo ordinario.',
    author: 'Anónimo',
    meaning: 'No necesitas eventos extraordinarios. Lo sagrado está en lo cotidiano. Despertar a la magia de lo simple es despertar.',
    questions: ['¿Qué cotidiano das por hecho?', '¿Puedes ver lo extraordinario en lo ordinario?']
  },
  {
    id: '139',
    quote: 'No existe el fracaso, solo retroalimentación.',
    author: 'Robert Allen',
    meaning: 'Fallar no es final. Es información. Cada error te dice qué ajustar. El único fracaso real es no aprender.',
    questions: ['¿Qué fracaso reciente te enseñó algo?', '¿Puedes verlo como aprendizaje?']
  },
  {
    id: '140',
    quote: 'El respeto hacia uno mismo guía nuestra moral. El respeto hacia otros guía nuestros modales.',
    author: 'Laurence Sterne',
    meaning: 'No puedes respetar a otros si no te respetas. La ética empieza adentro. Los modales son consecuencia del respeto interno.',
    questions: ['¿Te respetas a ti mismo?', '¿Cómo tratas a otros cuando no te ven?']
  },
  {
    id: '141',
    quote: 'La mejor venganza es una vida bien vivida.',
    author: 'Proverbio',
    meaning: 'No pelees con quien te hirió. Simplemente vive bien. Tu plenitud es la respuesta más poderosa.',
    questions: ['¿A quién quieres vengarte?', '¿Puedes soltar eso y simplemente vivir bien?']
  },
  {
    id: '142',
    quote: 'El único modo de hacer un gran trabajo es amar lo que haces.',
    author: 'Steve Jobs',
    meaning: 'La excelencia nace de la pasión. Si no amas lo que haces, solo cumples. El amor por el trabajo transforma el resultado.',
    questions: ['¿Amas lo que haces?', 'Si no, ¿qué tendrías que cambiar?']
  },
  {
    id: '143',
    quote: 'La riqueza no es tener muchas posesiones, sino tener pocas necesidades.',
    author: 'Epicteto',
    meaning: 'Eres libre cuando no necesitas mucho. La abundancia no está en acumular: está en soltar apegos.',
    questions: ['¿Qué posees que no necesitas?', '¿Cuánto necesitas realmente para ser feliz?']
  },
  {
    id: '144',
    quote: 'El cambio es inevitable. El crecimiento es opcional.',
    author: 'John Maxwell',
    meaning: 'El tiempo pasa, pero no garantiza madurez. Puedes cambiar sin crecer. Crecer es elección consciente.',
    questions: ['¿Estás cambiando o creciendo?', '¿Qué elección harías para crecer?']
  },
  {
    id: '145',
    quote: 'Lo importante no es lo que miras, sino lo que ves.',
    author: 'Henry David Thoreau',
    meaning: 'Dos personas miran lo mismo y ven distinto. La percepción no es pasiva: es creativa. Ver es interpretar.',
    questions: ['¿Qué estás viendo que otros no ven?', '¿Qué no ves que podrías estar mirando?']
  },
  {
    id: '146',
    quote: 'El coraje no es la ausencia de miedo, sino la decisión de que algo es más importante que el miedo.',
    author: 'Ambrose Redmoon',
    meaning: 'El valiente también teme. Pero actúa aunque tema. El coraje es acción a pesar del miedo, no ausencia de él.',
    questions: ['¿Qué es más importante que tu miedo?', '¿Puedes actuar aunque tengas miedo?']
  },
  {
    id: '147',
    quote: 'No hay nada permanente excepto el cambio.',
    author: 'Heráclito',
    meaning: 'Aferrarte a lo que cambia es sufrir. Todo fluye. La permanencia es ilusión. Fluir con el cambio es sabiduría.',
    questions: ['¿A qué te aferras que está cambiando?', '¿Puedes soltar y fluir?']
  },
  {
    id: '148',
    quote: 'La mente intuitiva es un don sagrado. La mente racional es un sirviente fiel.',
    author: 'Albert Einstein',
    meaning: 'La razón es útil, pero limitada. La intuición accede a lo que la lógica no alcanza. Honra ambos: úsalos según corresponda.',
    questions: ['¿Confías en tu intuición?', '¿Dónde tu razón te ciega?']
  },
  {
    id: '149',
    quote: 'El mundo rompe a todos, y después algunos son fuertes en los lugares rotos.',
    author: 'Ernest Hemingway',
    meaning: 'La fractura puede fortalecer. No eres más débil por haber sido roto. A veces el lugar quebrado es el más fuerte.',
    questions: ['¿Dónde te rompiste?', '¿Puedes ver fuerza en esa ruptura?']
  },
  {
    id: '150',
    quote: 'La felicidad no es algo hecho. Viene de tus propias acciones.',
    author: 'Dalai Lama',
    meaning: 'No esperes que te llegue. La felicidad se construye con actos diarios. Cada decisión es un ladrillo de felicidad o sufrimiento.',
    questions: ['¿Qué acciones diarias te hacen feliz?', '¿Estás construyendo felicidad o destruyéndola?']
  },
  {
    id: '151',
    quote: 'La disciplina es una forma amable de no traicionarte.',
    author: 'Tradición estoica',
    meaning: 'La disciplina no es castigo: es cuidado. Cuando sostienes un hábito, te pruebas que tu palabra interna vale. Eso reduce la ansiedad porque te vuelves confiable para ti.',
    questions: ['¿En qué te prometes cosas y luego te abandonas?', '¿Qué hábito pequeño te devolvería confianza?']
  },
  {
    id: '152',
    quote: 'Lo que llamas pereza a veces es miedo sin nombre.',
    author: 'Psicología profunda',
    meaning: 'La inercia suele protegerte de una pérdida: fracaso, crítica, exposición o éxito. Cuando nombras el miedo real, la energía regresa. Sin nombre, se vuelve niebla.',
    questions: ['¿Qué miedo podría estar escondido detrás de tu postergación?', '¿Qué pasaría si lo nombraras en voz alta?']
  },
  {
    id: '153',
    quote: 'El silencio no es vacío: es espacio para que aparezca lo real.',
    author: 'Tradición zen',
    meaning: 'Cuando bajas el ruido interno, la vida deja de ser teoría y vuelve a ser presencia. En el silencio, lo esencial se escucha sin esfuerzo. No se fabrica: se revela.',
    questions: ['¿Qué ruido usas para no sentir?', '¿Qué verdad aparece cuando te quedas quieto?']
  },
  {
    id: '154',
    quote: 'Eres responsable de tu vida incluso cuando no la elegiste así.',
    author: 'Filosofía existencial',
    meaning: 'No elegiste muchas condiciones, pero sí decides qué haces con ellas. La responsabilidad no es culpa: es poder. Recuperas agencia cuando dejas de esperar permiso.',
    questions: ['¿Qué parte de tu vida atribuyes solo a la suerte?', '¿Qué decisión concreta te devolvería poder hoy?']
  },
  {
    id: '155',
    quote: 'No es la emoción la que te rompe, es tu historia sobre ella.',
    author: 'Terapia cognitiva',
    meaning: 'Sentir es inevitable; interpretar es opcional. Cuando crees que la emoción significa peligro, la amplificas. Cuando la observas como señal, se regula.',
    questions: ['¿Qué emoción te asusta más?', '¿Qué historia le estás pegando encima?']
  },
  {
    id: '156',
    quote: 'Tu cerebro repite lo conocido, no lo sano.',
    author: 'Neurociencia',
    meaning: 'Lo familiar se siente seguro aunque duela. Por eso vuelves a patrones viejos: el sistema nervioso prefiere previsibilidad. La sanación requiere tolerar lo nuevo.',
    questions: ['¿Qué patrón repites por ser familiar?', '¿Qué novedad te incomoda pero te haría bien?']
  },
  {
    id: '157',
    quote: 'El amor crece donde el control se suelta.',
    author: 'Mística sufí',
    meaning: 'El control nace del miedo. Cuando sueltas el control, dejas espacio para confiar, escuchar y relacionarte con lo vivo. Amar es abrir la mano, no cerrar el puño.',
    questions: ['¿Dónde intentas controlar para no sufrir?', '¿Qué relación mejoraría si soltaras un poco?']
  },
  {
    id: '158',
    quote: 'Cuando fuerzas, pierdes; cuando fluyes, sostienes.',
    author: 'Taoísmo',
    meaning: 'Forzar consume y rompe. Fluir no es pasividad: es inteligencia que se adapta. La fuerza verdadera es la que no se exhibe; se administra.',
    questions: ['¿Qué estás forzando en tu vida?', '¿Cómo se vería un paso más suave pero constante?']
  },
  {
    id: '159',
    quote: 'La claridad no llega primero; llega después de actuar con honestidad.',
    author: 'Anónimo',
    meaning: 'Esperar claridad total suele ser una forma elegante de evitar. Cuando actúas alineado, el camino se ordena. La claridad es resultado, no requisito.',
    questions: ['¿Qué estás esperando entender para moverte?', '¿Qué acción honesta podrías hacer sin garantías?']
  },
  {
    id: '160',
    quote: 'La autoestima se construye con actos que te respetan.',
    author: 'Psicología humanista',
    meaning: 'No se trata de repetirte frases: se trata de tratarte bien en lo cotidiano. Tu mente cree lo que tu conducta demuestra. El respeto propio es práctica, no discurso.',
    questions: ['¿Qué conducta tuya te falta al respeto?', '¿Qué acto pequeño te honraría hoy?']
  },
  {
    id: '161',
    quote: 'La libertad es elegir tu respuesta, no controlar el resultado.',
    author: 'Tradición estoica',
    meaning: 'La paz aparece cuando inviertes energía en lo que sí depende de ti. Controlar el resultado es ansiedad; elegir tu respuesta es dignidad. Ahí vive tu fuerza.',
    questions: ['¿Qué resultado intentas controlar obsesivamente?', '¿Qué respuesta depende solo de ti?']
  },
  {
    id: '162',
    quote: 'La sombra no desaparece; se integra o se proyecta.',
    author: 'Psicología profunda',
    meaning: 'Lo que niegas busca salida por otro lado: juicio, envidia, superioridad o desprecio. Integrar no es justificar, es reconocer para dejar de actuar a ciegas.',
    questions: ['¿Qué parte tuya te cuesta admitir?', '¿En quién la proyectas más?']
  },
  {
    id: '163',
    quote: 'Si puedes estar presente con el dolor, el dolor se vuelve maestro.',
    author: 'Tradición zen',
    meaning: 'El dolor pide atención, no pelea. Cuando lo acompañas sin huir, deja de ser enemigo y se vuelve información. La presencia transforma la experiencia.',
    questions: ['¿Qué dolor estás evitando sentir?', '¿Cómo sería quedarte con él un minuto sin historia?']
  },
  {
    id: '164',
    quote: 'No elegir también es una elección con consecuencias.',
    author: 'Filosofía existencial',
    meaning: 'La indecisión no te deja neutral: te deja dirigido por la inercia. Cuando no eliges, alguien o algo elige por ti. Elegir es asumir el costo de vivir.',
    questions: ['¿Qué decisión llevas posponiendo?', '¿Qué costo oculto estás pagando por no elegir?']
  },
  {
    id: '165',
    quote: 'Tu mente busca pruebas; tu vida necesita dirección.',
    author: 'Terapia cognitiva',
    meaning: 'Puedes pasar años buscando certeza para moverte. Pero la dirección se define por valores, no por pruebas perfectas. Actuar con valores reduce la rumiación.',
    questions: ['¿Qué certeza estás exigiendo para avanzar?', '¿Qué valor podría guiarte hoy sin certeza?']
  },
  {
    id: '166',
    quote: 'Tu sistema nervioso confunde calma con peligro si solo conoció caos.',
    author: 'Neurociencia',
    meaning: 'La calma puede sentirse extraña cuando has vivido en alerta. Por eso buscas drama sin querer. Reentrenar el cuerpo para la calma es parte de sanar.',
    questions: ['¿Dónde te incomoda la calma?', '¿Qué práctica te ayudaría a tolerar tranquilidad?']
  },
  {
    id: '167',
    quote: 'Quien se ama no se abandona para ser aceptado.',
    author: 'Mística sufí',
    meaning: 'La pertenencia verdadera no exige traición interna. Si te abandonas para encajar, pagas con vacío. Amar es permanecer contigo incluso cuando tiemblas.',
    questions: ['¿Dónde te traicionas para encajar?', '¿Qué dirías si te eligieras primero?']
  },
  {
    id: '168',
    quote: 'Lo blando vence porque dura.',
    author: 'Taoísmo',
    meaning: 'Lo rígido se quiebra; lo flexible se adapta. La suavidad no es debilidad: es estrategia de supervivencia. La constancia suave cambia más que el golpe fuerte.',
    questions: ['¿Dónde estás siendo demasiado rígido?', '¿Qué flexibilidad te daría más paz y eficacia?']
  },
  {
    id: '169',
    quote: 'La paz no se encuentra: se practica.',
    author: 'Anónimo',
    meaning: 'La paz no es un evento futuro, es una forma de relacionarte con lo que pasa. Practicar paz es elegir respiración, límites y presencia cuando el caos te llama.',
    questions: ['¿Qué hábito te roba paz todos los días?', '¿Qué práctica mínima la recuperaría?']
  },
  {
    id: '170',
    quote: 'Tu valor no sube cuando logras; se revela cuando te cuidas.',
    author: 'Psicología humanista',
    meaning: 'No te vuelves digno por producir. Tu dignidad ya está; se vuelve visible cuando te tratas con respeto. Cuidarte es recordarte que importas.',
    questions: ['¿Qué crees que debes lograr para merecer amor?', '¿Cómo sería tratarte como alguien valioso hoy?']
  },
  {
    id: '171',
    quote: 'El hábito correcto hoy le quita poder al arrepentimiento mañana.',
    author: 'Tradición estoica',
    meaning: 'El arrepentimiento suele nacer de pequeñas omisiones repetidas. Hacer lo correcto en lo pequeño construye carácter. El carácter te sostiene cuando el ánimo falla.',
    questions: ['¿Qué pequeña omisión se está acumulando?', '¿Qué hábito simple corregiría el rumbo?']
  },
  {
    id: '172',
    quote: 'La compulsión intenta darte control donde hubo impotencia.',
    author: 'Psicología profunda',
    meaning: 'Cuando una herida deja sensación de impotencia, la mente busca rituales para sentir control. El problema es que el ritual se vuelve cárcel. Sanar es recuperar seguridad interna.',
    questions: ['¿Qué conducta repetitiva te calma por un momento?', '¿Qué herida de impotencia podría estar detrás?']
  },
  {
    id: '173',
    quote: 'Respira: la vida ocurre a esta velocidad.',
    author: 'Tradición zen',
    meaning: 'El cuerpo siempre vive en presente. La mente se adelanta o se atrasa. Volver a la respiración es volver a lo real, donde sí puedes actuar.',
    questions: ['¿Dónde se fue tu mente ahora mismo?', '¿Qué cambia si vuelves a tu respiración por 10 segundos?']
  },
  {
    id: '174',
    quote: 'Tu identidad no es un destino; es una responsabilidad en construcción.',
    author: 'Filosofía existencial',
    meaning: 'No eres una etiqueta fija. Eres un conjunto de elecciones sostenidas. Puedes reinventarte sin negar tu historia: cambiando lo que alimentas cada día.',
    questions: ['¿Qué etiqueta te limita?', '¿Qué elección diaria podría reescribirla?']
  },
  {
    id: '175',
    quote: 'No todo pensamiento merece tu atención completa.',
    author: 'Terapia cognitiva',
    meaning: 'Tu mente produce contenido constantemente, como una radio. Aprender a no creerle todo es higiene mental. La atención es tu recurso más caro.',
    questions: ['¿Qué pensamiento te roba más atención?', '¿Qué pasaría si lo dejaras pasar sin discutir con él?']
  },
  {
    id: '176',
    quote: 'La ansiedad es un cuerpo pidiendo seguridad, no una mente pidiendo más información.',
    author: 'Neurociencia',
    meaning: 'Investigar y pensar más no siempre calma. A veces lo que falta es regulación: sueño, comida, movimiento, respiración y vínculo. Calmar el cuerpo aclara la mente.',
    questions: ['¿Qué necesita tu cuerpo hoy para sentirse seguro?', '¿Qué hábito básico has descuidado?']
  },
  {
    id: '177',
    quote: 'La gratitud es humildad ante lo que ya sostiene tu vida.',
    author: 'Mística sufí',
    meaning: 'Agradecer no es negar el dolor. Es reconocer el soporte que ya existe: aire, cuerpo, alguien, un momento. Esa humildad ablanda el corazón y te devuelve suelo.',
    questions: ['¿Qué te sostiene que ya no miras?', '¿Qué cambia si lo agradeces hoy?']
  },
  {
    id: '178',
    quote: 'Si te adaptas sin darte cuenta, te pierdes sin ruido.',
    author: 'Taoísmo',
    meaning: 'Adaptarte es útil; adaptarte traicionándote es peligroso. Sin conciencia, la vida te moldea hasta que ya no sabes qué querías. La atención es tu ancla.',
    questions: ['¿En qué te adaptaste perdiéndote?', '¿Qué parte tuya necesitas recuperar?']
  },
  {
    id: '179',
    quote: 'No necesitas más tiempo; necesitas menos fuga.',
    author: 'Anónimo',
    meaning: 'La vida se va en escapes: scroll, preocupación, perfeccionismo, comparación. Recuperar tiempo es recuperar presencia. Menos fuga, más vida.',
    questions: ['¿Cuál es tu fuga favorita?', '¿Qué harías si recuperaras una hora diaria de presencia?']
  },
  {
    id: '180',
    quote: 'La ternura contigo es una decisión valiente.',
    author: 'Psicología humanista',
    meaning: 'Ser duro contigo parece disciplina, pero a menudo es miedo. La ternura no te vuelve débil: te vuelve sostenible. Nadie florece bajo insultos constantes.',
    questions: ['¿Cómo te hablas cuando fallas?', '¿Qué cambiaría si te hablaras como a alguien que amas?']
  },
  {
    id: '181',
    quote: 'No pidas paz a un día que construyes con prisa.',
    author: 'Tradición estoica',
    meaning: 'La paz es consecuencia de ritmo y prioridad. Si vives apurado por demostrar, la mente no descansa. Elegir ritmo es elegir vida.',
    questions: ['¿Qué te empuja a vivir con prisa?', '¿Qué una sola cosa podrías hacer más lento hoy?']
  },
  {
    id: '182',
    quote: 'La herida busca escenario; la conciencia busca salida.',
    author: 'Psicología profunda',
    meaning: 'Sin conciencia, repites la herida en nuevas personas y situaciones. Con conciencia, puedes interrumpir el guion. No se trata de culpar, sino de despertar.',
    questions: ['¿Qué guion repites en tus relaciones?', '¿Qué señal temprana podrías observar para detenerlo?']
  },
  {
    id: '183',
    quote: 'Lo simple se vuelve profundo cuando lo haces completo.',
    author: 'Tradición zen',
    meaning: 'Hacer una cosa completa es meditación. Comer, caminar, escuchar: si estás ahí, se vuelve profundo. La profundidad no está en lo raro, sino en la presencia.',
    questions: ['¿Qué haces a medias casi siempre?', '¿Cómo sería hacerlo completo una sola vez hoy?']
  },
  {
    id: '184',
    quote: 'Tus valores aparecen cuando nadie te obliga.',
    author: 'Filosofía existencial',
    meaning: 'Los valores no son declaraciones: son patrones. Se ven en lo que haces cuando podrías no hacerlo. Ahí se revela quién eres y qué sostienes.',
    questions: ['¿Qué haces cuando nadie te mira?', '¿Qué valor real se revela en tus actos?']
  },
  {
    id: '185',
    quote: 'La mente catastrófica habla en futuro; la realidad vive en ahora.',
    author: 'Terapia cognitiva',
    meaning: 'La catástrofe es imaginación con urgencia. Volver al ahora corta el combustible del miedo. Pregúntate: ¿qué es cierto aquí, hoy?',
    questions: ['¿Qué historia futura te está asustando?', '¿Qué evidencia tienes en el presente?']
  },
  {
    id: '186',
    quote: 'Regulación no es calma perfecta; es volver más rápido.',
    author: 'Neurociencia',
    meaning: 'No se trata de no caer en estrés, sino de recuperar equilibrio. Cada vez que vuelves, entrenas tu sistema. Volver es progreso.',
    questions: ['¿Qué te ayuda a volver cuando te desbordas?', '¿Qué práctica podrías repetir a diario para entrenarlo?']
  },
  {
    id: '187',
    quote: 'La devoción es atención sostenida a lo que amas.',
    author: 'Mística sufí',
    meaning: 'Amar no es sentir bonito; es cuidar lo importante con constancia. La devoción ordena tu vida porque decide dónde va tu energía. Lo amado se vuelve centro.',
    questions: ['¿Qué dices que amas pero no cuidas?', '¿Cómo se vería dedicarle atención real esta semana?']
  },
  {
    id: '188',
    quote: 'Cuando te alineas, el esfuerzo se vuelve dirección.',
    author: 'Taoísmo',
    meaning: 'No todo esfuerzo es avance. Alinearte con lo esencial hace que el mismo esfuerzo rinda más. La vida se simplifica cuando dejas de empujar contra ti.',
    questions: ['¿En qué estás empujando contra ti mismo?', '¿Qué decisión te alinearía con lo esencial?']
  },
  {
    id: '189',
    quote: 'No es tarde: es ahora.',
    author: 'Anónimo',
    meaning: 'El pensamiento de tarde suele ser vergüenza. El ahora es acción. La vida no se arregla en un salto; se reencamina con una decisión honesta repetida.',
    questions: ['¿Qué te dices que ya es tarde para hacer?', '¿Qué primer paso pequeño aún es posible hoy?']
  },
  {
    id: '190',
    quote: 'Ser fuerte también es pedir ayuda a tiempo.',
    author: 'Psicología humanista',
    meaning: 'La autosuficiencia extrema a veces es defensa. Pedir ayuda no te quita valor: te devuelve vínculo. El apoyo correcto reduce sufrimiento innecesario.',
    questions: ['¿Qué estás cargando solo por orgullo o miedo?', '¿A quién podrías pedir ayuda hoy?']
  },
  {
    id: '191',
    quote: 'Lo que depende de ti merece tu energía; lo demás, tu serenidad.',
    author: 'Tradición estoica',
    meaning: 'La serenidad no es indiferencia: es enfoque. Cuando distingues control de no control, dejas de desperdiciar vida. Esa distinción es libertad práctica.',
    questions: ['¿Qué no depende de ti y aun así te consume?', '¿Qué sí depende de ti y has descuidado?']
  },
  {
    id: '192',
    quote: 'La vergüenza te dice que eres malo; la culpa sana te dice que puedes mejorar.',
    author: 'Psicología profunda',
    meaning: 'La vergüenza paraliza porque ataca identidad. La culpa funcional guía conducta. Diferenciar ambas te permite reparar sin destruirte.',
    questions: ['¿Qué error estás convirtiendo en identidad?', '¿Qué reparación concreta sí está en tus manos?']
  },
  {
    id: '193',
    quote: 'Una respiración consciente puede salvar un día entero.',
    author: 'Tradición zen',
    meaning: 'No es magia: es fisiología y presencia. Una respiración cambia tu química y tu perspectiva. Cuando vuelves al cuerpo, el drama pierde volumen.',
    questions: ['¿Qué momento del día necesitas pausar?', '¿Puedes tomar tres respiraciones conscientes ahora mismo?']
  },
  {
    id: '194',
    quote: 'Si no eliges tu sentido, otro te lo asigna.',
    author: 'Filosofía existencial',
    meaning: 'La cultura, la familia o el miedo pueden elegir por ti. Elegir sentido es acto de madurez. No se trata de encontrar, sino de comprometerte.',
    questions: ['¿Quién está eligiendo tu sentido hoy?', '¿Qué sentido elegirías si nadie opinara?']
  },
  {
    id: '195',
    quote: 'Tu pensamiento favorito puede ser tu trampa favorita.',
    author: 'Terapia cognitiva',
    meaning: 'Hay ideas que te dan identidad y control, pero también te encierran. Cuestionarlas da miedo porque pierdes suelo. Pero a veces ese suelo era jaula.',
    questions: ['¿Qué idea sobre ti repites sin revisar?', '¿Qué posibilidad aparece si la sueltas?']
  },
  {
    id: '196',
    quote: 'El cuerpo aprende por repetición, no por intención.',
    author: 'Neurociencia',
    meaning: 'Querer no basta: entrenar sí. La repetición crea rutas nuevas y las vuelve automáticas. La constancia es una forma de neuroplasticidad aplicada.',
    questions: ['¿Qué quieres cambiar solo con intención?', '¿Qué repetición diaria lo entrenaría?']
  },
  {
    id: '197',
    quote: 'La belleza aparece cuando dejas de pedirle a la vida que sea otra.',
    author: 'Mística sufí',
    meaning: 'La belleza no siempre es cómoda. A veces es aceptación. Cuando te rindes a lo real, aparece una paz extraña y luminosa: la de no pelear más.',
    questions: ['¿Qué realidad sigues rechazando?', '¿Qué belleza podría haber si la aceptaras?']
  },
  {
    id: '198',
    quote: 'El río no discute con la roca: aprende la forma de pasar.',
    author: 'Taoísmo',
    meaning: 'Hay obstáculos que no se vencen con choque, sino con camino. La inteligencia flexible encuentra ruta sin perder esencia. Persistir no siempre es empujar.',
    questions: ['¿Qué roca estás intentando vencer a golpes?', '¿Qué ruta alternativa existe si te vuelves agua?']
  },
  {
    id: '199',
    quote: 'El descanso también es productividad cuando te devuelve presencia.',
    author: 'Anónimo',
    meaning: 'Descansar no es perder el tiempo: es recuperar capacidad. Sin descanso, el esfuerzo se vuelve torpe y reactivo. Descansar bien es pensar mejor.',
    questions: ['¿Qué parte de ti está agotada?', '¿Qué descanso real necesitas (no solo distracción)?']
  },
  {
    id: '200',
    quote: 'Tu vida interior merece el mismo cuidado que tu imagen.',
    author: 'Psicología humanista',
    meaning: 'Cuidar tu imagen sin cuidar tu interior crea disonancia y ansiedad. Cuando alineas interior y exterior, la vida se simplifica. Lo interno se siente en todo.',
    questions: ['¿Qué cuidas mucho hacia afuera?', '¿Qué necesitas cuidar por dentro con la misma dedicación?']
  },
  {
    id: '201',
    quote: 'Tu carácter se ve en lo que haces cuando no tienes ganas.',
    author: 'Tradición estoica',
    meaning: 'La emoción cambia; el carácter permanece. Elegir lo correcto sin ganas es músculo moral. No se trata de dureza, sino de coherencia.',
    questions: ['¿Qué hábito sueltas cuando baja la motivación?', '¿Qué mínimo sostendrías para ser coherente?']
  },
  {
    id: '202',
    quote: 'La idealización es una forma de no ver.',
    author: 'Psicología profunda',
    meaning: 'Idealizar te protege del dolor de lo real, pero también te impide amar de verdad. Ver es perder fantasía y ganar relación. La madurez empieza al mirar completo.',
    questions: ['¿A quién o qué idealizas hoy?', '¿Qué parte real estás evitando ver?']
  },
  {
    id: '203',
    quote: 'La mente se calma cuando el cuerpo se siente a salvo.',
    author: 'Tradición zen',
    meaning: 'El cuerpo es tu primer hogar. Si el hogar está en alerta, la mente no descansa. Presencia es enviarle al cuerpo el mensaje: aquí, ahora, estamos bien.',
    questions: ['¿Qué señal de seguridad necesita tu cuerpo hoy?', '¿Qué gesto simple podrías hacer para dársela?']
  },
  {
    id: '204',
    quote: 'Tu vida es tu argumento más honesto.',
    author: 'Filosofía existencial',
    meaning: 'Lo que haces habla más que lo que dices creer. La vida revela tus prioridades reales. Si quieres cambiar tu argumento, cambia tu práctica.',
    questions: ['¿Qué argumenta tu vida hoy sobre tus prioridades?', '¿Qué práctica cambiarías si quisieras otra vida?']
  },
  {
    id: '205',
    quote: 'Una creencia puede ser solo un hábito de atención.',
    author: 'Terapia cognitiva',
    meaning: 'A veces no es que la creencia sea verdadera, es que siempre miras el mismo ángulo. Cambiar atención cambia evidencia. Y cambiar evidencia cambia creencia.',
    questions: ['¿Qué evidencia buscas siempre?', '¿Qué evidencia alternativa podrías mirar por una semana?']
  },
  {
    id: '206',
    quote: 'Lo que no nombras se queda en el cuerpo.',
    author: 'Neurociencia',
    meaning: 'Nombrar una emoción reduce su intensidad. Poner palabras integra experiencia. Callar lo importante mantiene al cuerpo en carga y alerta.',
    questions: ['¿Qué emoción estás guardando sin nombrar?', '¿Cómo la nombrarías con una sola frase?']
  },
  {
    id: '207',
    quote: 'La compasión no excusa: comprende y abre camino.',
    author: 'Mística sufí',
    meaning: 'Comprender no es permitirlo todo; es ver el dolor detrás del acto. La compasión te da claridad sin odio. Y desde la claridad, eliges mejor.',
    questions: ['¿A quién te cuesta tener compasión?', '¿Qué sufrimiento podría estar detrás de su conducta?']
  },
  {
    id: '208',
    quote: 'Lo natural no es siempre fácil, pero sí es más sostenible.',
    author: 'Taoísmo',
    meaning: 'Lo sostenido respeta ritmo, descanso y límites. La vida sostenible parece lenta al ego, pero es profunda y real. Lo artificial quema; lo natural madura.',
    questions: ['¿Qué estás haciendo de forma poco sostenible?', '¿Qué ajuste haría tu vida más natural?']
  },
  {
    id: '209',
    quote: 'Tus límites enseñan a los demás cómo tratarte.',
    author: 'Anónimo',
    meaning: 'Los límites no son paredes: son instrucciones claras. Donde no hay límite, hay resentimiento. Un límite a tiempo evita una explosión después.',
    questions: ['¿Qué límite estás evitando poner?', '¿Qué resentimiento está creciendo por eso?']
  },
  {
    id: '210',
    quote: 'Sanar no es olvidar; es dejar de vivir desde esa herida.',
    author: 'Psicología humanista',
    meaning: 'La memoria puede quedar, pero el mando cambia de manos. Sanar es que la herida ya no tome el volante. Sigues recordando, pero ya no obedeces.',
    questions: ['¿Qué herida toma el volante en tu vida?', '¿Qué señal te avisa que estás reaccionando desde ella?']
  },
  {
    id: '211',
    quote: 'Acepta el clima, entrena tu timón.',
    author: 'Tradición estoica',
    meaning: 'No controlas el mar, pero sí tu dirección. La aceptación reduce pelea; el timón reduce deriva. Juntas, te dan dignidad ante lo inevitable.',
    questions: ['¿Qué clima estás peleando en lugar de aceptar?', '¿Qué decisión sería timón hoy?']
  },
  {
    id: '212',
    quote: 'La repetición no es mala suerte; es información no escuchada.',
    author: 'Psicología profunda',
    meaning: 'El patrón insiste hasta que aprendes. Si no escuchas, se repite con más volumen. La vida te enseña por insistencia cuando no aprende por atención.',
    questions: ['¿Qué patrón se repite en tu vida?', '¿Qué te está intentando enseñar?']
  },
  {
    id: '213',
    quote: 'Mira una cosa. Respira. Ya estás aquí.',
    author: 'Tradición zen',
    meaning: 'La mente corre para no sentir. Volver a una cosa simple te aterriza. Estar aquí no resuelve todo, pero te devuelve presencia para actuar mejor.',
    questions: ['¿Qué estás evitando sentir?', '¿Qué objeto puedes mirar ahora por 10 segundos en silencio?']
  },
  {
    id: '214',
    quote: 'Tu vida cambia cuando cambias lo que toleras.',
    author: 'Filosofía existencial',
    meaning: 'Tolerar es firmar contrato sin leer. Lo que toleras se vuelve norma. Cambiar tu vida empieza por no normalizar lo que te apaga.',
    questions: ['¿Qué toleras que te apaga?', '¿Qué límite o cambio sería coherente con tu dignidad?']
  },
  {
    id: '215',
    quote: 'No discutas con tu mente cansada.',
    author: 'Terapia cognitiva',
    meaning: 'Cuando estás agotado, la mente se vuelve extrema y oscura. No es el momento de decidir tu vida. Descansa, regula y luego piensa: cambia el resultado.',
    questions: ['¿Qué pensamiento oscuro aparece cuando estás cansado?', '¿Qué necesidad física te falta atender hoy?']
  },
  {
    id: '216',
    quote: 'Tu atención es tu vida en forma de horas.',
    author: 'Neurociencia',
    meaning: 'Donde pones atención, pones existencia. La atención construye identidad y destino por acumulación. Si cambias tu atención, cambias tu vida.',
    questions: ['¿En qué se va tu atención cada día?', '¿Qué merecería más de tu atención?']
  },
  {
    id: '217',
    quote: 'Suelta el juicio y verás más mundo.',
    author: 'Mística sufí',
    meaning: 'El juicio estrecha la mirada. Cuando sueltas juicio, aparece complejidad y humanidad. Ver más mundo te vuelve menos reactivo y más libre.',
    questions: ['¿Qué juicio repites con facilidad?', '¿Qué historia alternativa podría ser cierta?']
  },
  {
    id: '218',
    quote: 'El camino recto no siempre es el camino vivo.',
    author: 'Taoísmo',
    meaning: 'La vida no es línea: es curva. A veces el rodeo es la ruta correcta. Lo vivo se adapta; lo rígido se rompe por querer ir solo en línea recta.',
    questions: ['¿Qué rodeo estás rechazando por orgullo?', '¿Qué aprenderías si aceptaras el proceso?']
  },
  {
    id: '219',
    quote: 'La honestidad contigo mismo es el inicio de todo cambio.',
    author: 'Anónimo',
    meaning: 'Puedes decorar tu vida, pero no puedes engañar tu cuerpo y tu conciencia por mucho tiempo. La honestidad duele al inicio y libera después. Es el precio de la paz.',
    questions: ['¿Qué verdad evitas admitir?', '¿Qué cambiaría si la aceptaras hoy?']
  },
  {
    id: '220',
    quote: 'Ser vulnerable es dejar de actuar el personaje que te protege.',
    author: 'Psicología humanista',
    meaning: 'El personaje protege, pero también aísla. La vulnerabilidad abre vínculo y creatividad. No es exponerte sin cuidado: es mostrarte con verdad.',
    questions: ['¿Qué personaje interpretas para sentirte seguro?', '¿Con quién podrías bajar esa armadura?']
  },
  {
    id: '221',
    quote: 'Perder el control es a veces recuperar la vida.',
    author: 'Tradición estoica',
    meaning: 'Controlar todo te quita espontaneidad y descanso. Soltar lo imposible devuelve energía a lo posible. La serenidad crece donde sueltas la obsesión.',
    questions: ['¿Qué control te está costando paz?', '¿Qué podrías soltar hoy sin que el mundo se caiga?']
  },
  {
    id: '222',
    quote: 'Si no escuchas tu tristeza, la vida te la grita.',
    author: 'Psicología profunda',
    meaning: 'La tristeza ignorada se vuelve irritabilidad, apatía o vacío. Escucharla es permitir duelo y reajuste. La emoción no es enemiga: es guía.',
    questions: ['¿Qué tristeza has estado tapando?', '¿Qué duelo necesitas permitirte?']
  },
  {
    id: '223',
    quote: 'La mente no descansa en respuestas; descansa en presencia.',
    author: 'Tradición zen',
    meaning: 'Puedes tener mil respuestas y seguir inquieto. La inquietud baja cuando el cuerpo y la atención vuelven al momento. La presencia es descanso verdadero.',
    questions: ['¿Qué pregunta te obsesiona?', '¿Qué cambia si vuelves al cuerpo en lugar de buscar respuesta?']
  },
  {
    id: '224',
    quote: 'Si vives para agradar, vivirás para esconder.',
    author: 'Filosofía existencial',
    meaning: 'Agradar como prioridad te obliga a mentirte y a mentir. La libertad llega cuando eliges coherencia sobre aprobación. Ser auténtico cuesta, pero libera.',
    questions: ['¿A quién intentas agradar para sentir valor?', '¿Qué parte tuya escondes por miedo?']
  },
  {
    id: '225',
    quote: 'La mente ansiosa quiere resolver; el corazón necesita sentir.',
    author: 'Terapia cognitiva',
    meaning: 'Resolver no siempre sana. A veces lo que cura es permitir emoción sin explicación perfecta. Sentir completa la experiencia; controlar la fragmenta.',
    questions: ['¿Qué emoción intentas resolver en lugar de sentir?', '¿Cómo sería permitirla 30 segundos sin arreglarla?']
  },
  {
    id: '226',
    quote: 'Tu cuerpo es el primer lugar donde se ve la verdad.',
    author: 'Neurociencia',
    meaning: 'El cuerpo registra coherencia o contradicción antes que tu discurso. Tensión, nudo, cansancio: son datos. Escuchar al cuerpo evita decisiones contra ti.',
    questions: ['¿Qué te está diciendo tu cuerpo últimamente?', '¿Qué decisión estás tomando contra esa señal?']
  },
  {
    id: '227',
    quote: 'La paciencia es confianza aplicada al tiempo.',
    author: 'Mística sufí',
    meaning: 'La paciencia no es aguantar: es confiar sin cerrar el corazón. Cuando hay paciencia, hay profundidad. Cuando no, hay prisa y miedo disfrazado.',
    questions: ['¿Dónde te falta paciencia?', '¿Qué miedo se esconde detrás de tu prisa?']
  },
  {
    id: '228',
    quote: 'El equilibrio no se conquista una vez: se ajusta cada día.',
    author: 'Taoísmo',
    meaning: 'Equilibrio es práctica, no estado permanente. Ajustas como quien afina un instrumento. La vida cambia; tu ajuste también.',
    questions: ['¿Qué parte de tu vida está desbalanceada?', '¿Qué ajuste pequeño podrías hacer hoy?']
  },
  {
    id: '229',
    quote: 'Lo que haces en secreto construye tu destino en público.',
    author: 'Anónimo',
    meaning: 'Lo invisible se acumula y se vuelve visible. Tus hábitos secretos construyen tu energía, tu carácter y tu vida. El destino es la suma de lo cotidiano.',
    questions: ['¿Qué hábito secreto te está construyendo o destruyendo?', '¿Qué cambiarías si nadie pudiera verte?']
  },
  {
    id: '230',
    quote: 'La dignidad es tratarte como alguien que merece cuidado.',
    author: 'Psicología humanista',
    meaning: 'No es soberbia: es humanidad. La dignidad se ve en límites, descanso y respeto propio. Cuando te cuidas, el mundo aprende a cuidarte también.',
    questions: ['¿Dónde te tratas sin dignidad?', '¿Qué cuidado básico te estás negando?']
  },
  {
    id: '231',
    quote: 'El coraje cotidiano es hacer lo correcto sin aplausos.',
    author: 'Tradición estoica',
    meaning: 'La virtud real rara vez es espectacular. Es sobria y constante. Hacer lo correcto sin público construye una paz que ningún aplauso compra.',
    questions: ['¿Qué acto correcto haces sin reconocimiento?', '¿Qué paz te da esa coherencia?']
  },
  {
    id: '232',
    quote: 'Tu herida quiere justicia; tu alma quiere paz.',
    author: 'Psicología profunda',
    meaning: 'La herida busca compensación y control. El alma busca integración. No siempre obtendrás justicia perfecta; sí puedes elegir paz suficiente para vivir.',
    questions: ['¿Qué justicia sigues esperando para poder soltar?', '¿Qué paz podrías elegir aunque falte justicia?']
  },
  {
    id: '233',
    quote: 'La atención plena no elimina problemas; elimina ruido.',
    author: 'Tradición zen',
    meaning: 'Con ruido, todo parece enorme. Con atención, distingues lo esencial de lo accesorio. La vida no se vuelve perfecta: se vuelve clara.',
    questions: ['¿Qué ruido mental te cansa más?', '¿Qué pasa si lo observas sin seguirlo?']
  },
  {
    id: '234',
    quote: 'Vivir sin elegir es vivir prestado.',
    author: 'Filosofía existencial',
    meaning: 'Cuando no eliges, vives según guiones ajenos. Puede verse correcto por fuera y vacío por dentro. Elegir te devuelve autoría sobre tu vida.',
    questions: ['¿Qué guion ajeno estás viviendo?', '¿Qué elegirías si tu vida fuera tuya de verdad?']
  },
  {
    id: '235',
    quote: 'El pensamiento es útil, pero no es un hogar.',
    author: 'Terapia cognitiva',
    meaning: 'Pensar ayuda a planear, pero vivir solo en la cabeza te desconecta. Tu hogar es el cuerpo y el presente. Vuelve cuando te pierdas.',
    questions: ['¿Cuándo vives demasiado en tu cabeza?', '¿Qué te ayuda a volver al cuerpo?']
  },
  {
    id: '236',
    quote: 'Tu cerebro aprende seguridad en relación, no en soledad absoluta.',
    author: 'Neurociencia',
    meaning: 'El vínculo regula. Una mirada segura, una voz calmada, una presencia confiable: eso entrena tu sistema. No todo se sana solo; algunas cosas se sanan acompañadas.',
    questions: ['¿Con quién te sientes verdaderamente seguro?', '¿Qué vínculo necesitas fortalecer?']
  },
  {
    id: '237',
    quote: 'Donde hay entrega, el miedo pierde autoridad.',
    author: 'Mística sufí',
    meaning: 'Entregarte no es rendirte a lo malo; es rendirte a lo real. Cuando sueltas resistencia inútil, el miedo baja. La entrega te devuelve respiración y amplitud.',
    questions: ['¿Qué miedo gobierna una decisión tuya?', '¿Qué pasaría si te entregaras al proceso sin controlar todo?']
  },
  {
    id: '238',
    quote: 'La vida te enseña por contraste: escucha lo que te drena.',
    author: 'Taoísmo',
    meaning: 'Lo que te drena señala desalineación. No todo drenaje es malo, pero el crónico es mensaje. Escuchar tu energía es escuchar tu verdad.',
    questions: ['¿Qué te drena de forma constante?', '¿Qué ajuste haría tu vida más alineada?']
  },
  {
    id: '239',
    quote: 'Tu futuro se decide en lo que haces cuando nadie te empuja.',
    author: 'Anónimo',
    meaning: 'Cuando no hay presión externa, aparece tu dirección real. Ahí se construye el futuro: en hábitos elegidos, no en impulsos obligados.',
    questions: ['¿Qué haces cuando nadie te exige nada?', '¿Qué futuro está construyendo esa conducta?']
  },
  {
    id: '240',
    quote: 'El amor sano no se negocia con miedo.',
    author: 'Psicología humanista',
    meaning: 'El miedo negocia tu dignidad: cede, calla, aguanta. El amor sano cuida y respeta. Si para amar te pierdes, no es amor: es supervivencia.',
    questions: ['¿Qué aceptas por miedo a perder?', '¿Qué sería amor sano para ti hoy?']
  },
  {
    id: '241',
    quote: 'La serenidad es valentía sostenida.',
    author: 'Tradición estoica',
    meaning: 'Sereno no es anestesiado: es firme. La serenidad sostiene el peso sin dramatizarlo. Es valentía silenciosa.',
    questions: ['¿En qué situación podrías practicar serenidad hoy?', '¿Qué respuesta valiente pero tranquila sería posible?']
  },
  {
    id: '242',
    quote: 'Si no te hablas con verdad, tu vida se llena de síntomas.',
    author: 'Psicología profunda',
    meaning: 'El síntoma aparece cuando la verdad no encuentra palabras. El cuerpo y la conducta hablan por ti. Poner verdad en palabras reduce la necesidad de síntoma.',
    questions: ['¿Qué verdad estás evitando decirte?', '¿Qué síntoma o conducta podría estar hablando por ti?']
  },
  {
    id: '243',
    quote: 'El presente es suficiente para empezar.',
    author: 'Tradición zen',
    meaning: 'No necesitas tener todo resuelto para dar el primer paso. Necesitas estar aquí. El presente te da lo mínimo necesario: respiración, intención y un acto.',
    questions: ['¿Qué te falta para empezar, según tu mente?', '¿Qué sí tienes ahora mismo para dar el primer paso?']
  },
  {
    id: '244',
    quote: 'Ser libre es dejar de vivir como si tuvieras que justificar tu existencia.',
    author: 'Filosofía existencial',
    meaning: 'Justificarte todo el tiempo es vivir en juicio. La libertad aparece cuando eliges vivir desde valores, no desde defensa. Existir no requiere permiso.',
    questions: ['¿Dónde te sientes obligado a justificarte?', '¿Qué harías si no tuvieras que probar tu valor?']
  },
  {
    id: '245',
    quote: 'Cuestionar un pensamiento no lo destruye: te devuelve elección.',
    author: 'Terapia cognitiva',
    meaning: 'Cuestionar no es pelear contigo: es abrir opciones. Cuando tienes opciones, baja la ansiedad. La elección nace cuando deja de ser todo o nada.',
    questions: ['¿Qué pensamiento te atrapa en todo o nada?', '¿Qué alternativa más equilibrada podría ser cierta?']
  },
  {
    id: '246',
    quote: 'Tu cerebro premia lo inmediato, aunque te cueste lo importante.',
    author: 'Neurociencia',
    meaning: 'La recompensa inmediata tiene química fuerte. Por eso cuesta sostener lo valioso. Diseñar tu entorno reduce fricción y protege tu intención.',
    questions: ['¿Qué placer inmediato te está costando lo importante?', '¿Qué ajuste de entorno haría lo valioso más fácil?']
  },
  {
    id: '247',
    quote: 'La humildad abre puertas internas que el orgullo mantiene cerradas.',
    author: 'Mística sufí',
    meaning: 'La humildad no es rebajarte: es dejar de fingir. Cuando no necesitas tener razón todo el tiempo, puedes aprender y sanar. La humildad es libertad del ego.',
    questions: ['¿Dónde te aferras a tener razón?', '¿Qué podrías aprender si soltaras esa defensa?']
  },
  {
    id: '248',
    quote: 'El ritmo correcto te hace constante; el ritmo incorrecto te hace brillante y breve.',
    author: 'Taoísmo',
    meaning: 'Brillar sin sostener quema. El ritmo correcto se siente humilde, pero dura. La vida se construye con constancia, no con explosiones.',
    questions: ['¿En qué vas demasiado rápido?', '¿Qué ritmo te permitiría sostenerlo por meses?']
  },
  {
    id: '249',
    quote: 'Una vida alineada se siente simple, aunque no sea fácil.',
    author: 'Anónimo',
    meaning: 'Cuando hay alineación, hay menos negociación interna. Sigues enfrentando retos, pero con menos ruido y más dirección. La simplicidad es señal de coherencia.',
    questions: ['¿Dónde sientes negociación interna constante?', '¿Qué decisión simplificaría tu vida por alineación?']
  },
  {
    id: '250',
    quote: 'Tu crecimiento no necesita prisa; necesita verdad y constancia.',
    author: 'Psicología humanista',
    meaning: 'La prisa suele venir de comparación. La constancia viene de amor propio. Crecer es proceso: verdad para ver y constancia para sostener.',
    questions: ['¿Con quién te comparas que te mete prisa?', '¿Qué constancia amorosa podrías practicar sin comparación?']
  }
]

const pickPhraseByDateKey = (dateKey) => {
  const { y, m, d } = parseDateKeyToParts(dateKey)
  const doy = clamp(dayOfYear(y, m, d), 1, 366)
  // Mapea fechas a frases usando un inicio fijo:
  // 2025-12-23 => frase #001 (índice 0)
  const start = parseDateKeyToParts(START_DATE_KEY)
  const deltaDays = daysBetweenUtcDates({ y, m, d }, start)
  const idx = mod(deltaDays, PHRASES.length)
  return { phrase: PHRASES[idx], dayOfYear: doy }
}

const FraseDelDiaPage = () => {
  const navigate = useNavigate()
  const heroRef = useRef(null)
  const meaningRef = useRef(null)
  const donateRef = useRef(null)
  const isHeroInView = useInView(heroRef, { once: true, amount: 0.3 })

  const [lastAction, setLastAction] = useState(null)
  const [actionOk, setActionOk] = useState(false)
  const [customAmount, setCustomAmount] = useState('')
  const [shareOpen, setShareOpen] = useState(false)

  // Cerrar desplegable al hacer clic fuera
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (shareOpen && !event.target.closest('.share-dropdown-container')) {
        setShareOpen(false)
      }
    }
    
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [shareOpen])

  const dateKey = useMemo(() => {
    const params = new URLSearchParams(window.location.search)
    const q = params.get('date')
    if (isValidDateKey(q)) return q
    return getEffectiveMexicoDateKey()
  }, [])

  const { phrase, dayOfYear: doy } = useMemo(() => pickPhraseByDateKey(dateKey), [dateKey])

  const shareUrl = useMemo(() => {
    if (typeof window === 'undefined') return ''
    return `${window.location.origin}${window.location.pathname}?date=${encodeURIComponent(dateKey)}`
  }, [dateKey])

  const donationLinks = useMemo(
    () => ({
      20: import.meta.env.VITE_STRIPE_DONATE_20_URL,
      50: import.meta.env.VITE_STRIPE_DONATE_50_URL,
      100: import.meta.env.VITE_STRIPE_DONATE_100_URL,
      custom: import.meta.env.VITE_STRIPE_DONATE_CUSTOM_URL
    }),
    [],
  )

  const notifyOk = (action) => {
    setLastAction(action)
    setActionOk(true)
    window.setTimeout(() => {
      setActionOk(false)
      setLastAction(null)
    }, 1800)
  }

  const handleShare = async () => {
    const title = '1 frase x día'
    const shareText = `"${phrase.quote}" — ${phrase.author}\n\n¿Quieres saber qué significa? Presiona este link: ${shareUrl}`

    try {
      if (navigator?.share) {
        await navigator.share({ title, text: shareText, url: shareUrl })
        notifyOk('share')
        return
      }
    } catch {
      // ignore share cancellation
    }

    try {
      await navigator.clipboard.writeText(shareUrl)
      notifyOk('copy')
    } catch {
      // ignore
    }
  }

  const handleShareTo = (platform) => {
    const title = '1 frase x día'
    const shareText = `"${phrase.quote}" — ${phrase.author}\n\n¿Quieres saber qué significa? Entra a este enlace:`
    const encodedText = encodeURIComponent(shareText)
    const encodedUrl = encodeURIComponent(shareUrl)
    
    let url = ''
    
    switch (platform) {
      case 'whatsapp':
        url = `https://wa.me/?text=${encodedText}%20${encodedUrl}`
        break
      case 'facebook':
        url = `https://www.facebook.com/sharer/sharer.php?u=${encodedUrl}&quote=${encodedText}`
        break
      case 'linkedin':
        url = `https://www.linkedin.com/sharing/share-offsite/?url=${encodedUrl}`
        break
      default:
        return
    }
    
    window.open(url, '_blank', 'noopener,noreferrer')
    setShareOpen(false)
    notifyOk('share')
  }

  const handleCopyLink = async () => {
    try {
      await navigator.clipboard.writeText(shareUrl)
      notifyOk('copy')
    } catch {
      // ignore
    }
  }

  const handleDonate = (amount) => {
    let url
    if (amount === 'custom') {
      const n = Number(customAmount)
      if (!Number.isFinite(n) || n <= 0) return
      url = donationLinks.custom
      if (typeof url === 'string' && url.includes('{amount}')) {
        url = url.replace('{amount}', encodeURIComponent(String(Math.round(n))))
      }
    } else {
      url = donationLinks[amount]
    }

    if (!url) {
      window.alert('Falta configurar el link de donación (Stripe).')
      return
    }
    window.open(url, '_blank', 'noopener,noreferrer')
  }

  const scrollToMeaning = () => {
    meaningRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' })
  }

  const scrollToDonate = () => {
    donateRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' })
  }

  const handleWhatsAppDonate = () => {
    const message =
      'Hola Luis, quiero apoyar “1 frase × día” con una donación (la cantidad que yo quiera). ¿Me compartes la forma de pago?'
    const whatsappURL = `https://wa.me/527228720520?text=${encodeURIComponent(message)}`
    window.open(whatsappURL, '_blank', 'noopener,noreferrer')
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-black via-zinc-950 to-black text-white overflow-x-hidden">
      {/* Botón flotante discreto */}
      <button
        type="button"
        onClick={() => navigate('/')}
        className="fixed top-6 left-6 z-50 w-10 h-10 rounded-full border border-white/10 bg-black/40 backdrop-blur-md hover:border-white/30 hover:bg-black/60 transition-all flex items-center justify-center group"
        aria-label="Regresar a inicio"
      >
        <Home className="w-5 h-5 text-white/60 group-hover:text-white/90 transition-colors" strokeWidth={1.5} />
      </button>
      
      {/* Hero Section - Cinematográfico con video full */}
      <section ref={heroRef} className="relative min-h-screen flex items-center justify-center px-6 overflow-hidden">
        {/* Video Background */}
        <div className="absolute inset-0 overflow-hidden">
          <video
            autoPlay
            loop
            muted
            playsInline
            preload="auto"
            className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full object-cover opacity-60"
            style={{ minWidth: '100vw', minHeight: '100%', objectFit: 'cover', objectPosition: 'center' }}
          >
            <source src="/Frases.mp4" type="video/mp4" />
          </video>
          <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/40 to-black" />
        </div>

        {/* Contenido central */}
        <div className="relative z-10 w-full max-w-6xl mx-auto">
          {/* Título arriba del círculo - estilo ecuación matemática */}
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={isHeroInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="text-center mb-6"
          >
            <h1 className="text-4xl sm:text-5xl lg:text-6xl tracking-wide text-white flex items-center justify-center gap-3">
              <span className="font-semibold">1 frase</span>
              <motion.span 
                className="font-mono text-3xl sm:text-4xl lg:text-5xl inline-block"
                animate={{ 
                  rotate: [0, 0, 360, 360, 0],
                  color: [
                    'rgba(255, 255, 255, 0.5)',
                    'rgba(255, 255, 255, 0.5)',
                    'rgba(168, 85, 247, 0.8)',
                    'rgba(236, 72, 153, 0.8)',
                    'rgba(255, 255, 255, 0.5)',
                    'rgba(255, 255, 255, 0.5)'
                  ]
                }}
                transition={{
                  duration: 4,
                  times: [0, 0.2, 0.35, 0.5, 0.7, 1],
                  ease: [0.4, 0, 0.2, 1],
                  repeat: Infinity,
                  repeatDelay: 3
                }}
              >
                ×
              </motion.span>
              <span className="font-semibold">día</span>
            </h1>
            <p className="mt-3 text-xs sm:text-sm text-white/50 font-light">
              Se actualiza todos los días a las 00:00. Regresa mañana por una nueva.
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={isHeroInView ? { opacity: 1, scale: 1 } : {}}
            transition={{ duration: 1.2, ease: [0.22, 1, 0.36, 1] }}
            className="text-center space-y-4"
          >
            {/* Círculo con la frase - Diseño Google-like */}
            <div className="relative mx-auto" style={{ maxWidth: '700px' }}>
              {/* Círculo exterior decorativo */}
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 60, repeat: Infinity, ease: "linear" }}
                className="absolute inset-0 rounded-full"
                style={{
                  background: 'conic-gradient(from 0deg, transparent 0%, rgba(168, 85, 247, 0.3) 25%, transparent 50%, rgba(236, 72, 153, 0.3) 75%, transparent 100%)',
                  filter: 'blur(20px)',
                }}
              />
              
              {/* Contenedor principal - más transparente */}
              <div className="relative bg-black/20 backdrop-blur-md rounded-full border border-white/10 p-12 sm:p-16 lg:p-20">
                {/* Ícono de comillas decorativo */}
                <motion.div
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={isHeroInView ? { opacity: 1, scale: 1 } : {}}
                  transition={{ duration: 0.8, delay: 0.3 }}
                  className="absolute top-6 right-6 sm:top-8 sm:right-8"
                >
                  <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-gradient-to-br from-purple-500/20 to-pink-500/20 border border-purple-500/30 flex items-center justify-center">
                    <Quote className="w-5 h-5 sm:w-6 sm:h-6 text-purple-400" strokeWidth={1.5} />
                  </div>
                </motion.div>

                {/* La frase en el centro */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={isHeroInView ? { opacity: 1, y: 0 } : {}}
                  transition={{ duration: 1, delay: 0.5 }}
                  className="space-y-6"
                >
                  <p 
                    className="text-2xl sm:text-3xl lg:text-4xl font-light text-white leading-relaxed"
                    style={{ letterSpacing: '0.02em' }}
                  >
                    "{phrase.quote}"
                  </p>
                  <div className="h-px bg-gradient-to-r from-transparent via-white/20 to-transparent w-32 mx-auto" />
                  <p className="text-white/60 text-sm sm:text-base font-light italic">
                    {phrase.author}
                  </p>
                </motion.div>
              </div>
            </div>

            {/* Botón para ir a significado - elegante y animado */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={isHeroInView ? { opacity: 1 } : {}}
              transition={{ duration: 0.8, delay: 1.4 }}
              className="mt-8"
            >
              <motion.button
                onClick={scrollToMeaning}
                className="group relative px-6 py-3 rounded-full border border-white/10 bg-white/5 hover:bg-white/10 backdrop-blur-sm transition-all duration-300 overflow-hidden"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                {/* Brillo animado de fondo */}
                <motion.div
                  className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent"
                  animate={{
                    x: ['-100%', '100%']
                  }}
                  transition={{
                    duration: 3,
                    repeat: Infinity,
                    repeatDelay: 2,
                    ease: 'easeInOut'
                  }}
                />
                
                <div className="relative flex items-center gap-3">
                  <Lightbulb className="w-4 h-4 text-purple-400 group-hover:text-purple-300 transition-colors" strokeWidth={1.5} />
                  <span className="text-sm text-white/70 group-hover:text-white/90 font-light transition-colors">
                    Entender la frase
                  </span>
                  <motion.div
                    animate={{ y: [0, 4, 0] }}
                    transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
                  >
                    <ChevronDown className="w-4 h-4 text-white/40 group-hover:text-white/60 transition-colors" strokeWidth={1.5} />
                  </motion.div>
                </div>
              </motion.button>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Sección de Significado - Cinematográfica con layout en PC */}
      <section ref={meaningRef} className="relative py-12 lg:py-16 px-6 lg:px-20">
        <div className="max-w-6xl mx-auto">
          
          {/* Layout responsive: columnas en desktop, stack en mobile */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20">
            
            {/* Significado - Izquierda en PC */}
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 1 }}
              className="space-y-8"
            >
              <motion.h2
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.8, delay: 0.2 }}
                className="flex items-center gap-2 text-sm uppercase tracking-widest text-white/40 font-light mb-8"
              >
                <Lightbulb className="w-4 h-4" strokeWidth={1.5} />
                <span>Significado</span>
              </motion.h2>
              <motion.p
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.8, delay: 0.4 }}
                className="text-xl lg:text-2xl font-light text-white/80 leading-relaxed"
              >
                {phrase.meaning}
              </motion.p>
              
              {/* Metadata del día - más arriba */}
              <motion.div
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.8, delay: 0.6 }}
                className="pt-4 border-t border-white/10"
              >
                <div className="text-white/40 text-xs font-mono tracking-wider">
                  DÍA {String(doy).padStart(3, '0')} · {dateKey}
                </div>
              </motion.div>
            </motion.div>

            {/* Preguntas - Derecha en PC */}
            <motion.div
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 1 }}
              className="space-y-8"
            >
              <motion.h2
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.8, delay: 0.2 }}
                className="flex items-center gap-2 text-sm uppercase tracking-widest text-white/40 font-light mb-8"
              >
                <HelpCircle className="w-4 h-4" strokeWidth={1.5} />
                <span>Preguntas para reflexionar</span>
              </motion.h2>
              
              <div className="space-y-8">
                {phrase.questions.map((q, idx) => (
                  <motion.div
                    key={q}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.8, delay: 0.3 + idx * 0.15 }}
                    className="relative pl-12"
                  >
                    {/* Número */}
                    <div className="absolute left-0 top-1 w-8 h-8 rounded-full border border-white/20 flex items-center justify-center">
                      <span className="text-sm text-white/50 font-light">{idx + 1}</span>
                    </div>
                    {/* Pregunta */}
                    <p className="text-lg lg:text-xl text-white/70 font-light leading-relaxed">
                      {q}
                    </p>
                  </motion.div>
                ))}
              </div>

              {/* Acciones: compartir con desplegable + invítame un café */}
              <motion.div
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.8, delay: 1 }}
                className="mt-16 flex flex-col items-start gap-4"
              >
            <div className="flex items-center justify-start gap-4 flex-wrap">
              {/* Botón compartir con desplegable */}
              <div className="relative share-dropdown-container">
                <button
                  type="button"
                  onClick={() => setShareOpen(!shareOpen)}
                  className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-white/10 bg-white/5 hover:bg-white/10 text-xs text-white/70 hover:text-white/90 transition-all"
                >
                  {actionOk && lastAction === 'share' ? (
                    <>
                      <CheckCircle className="w-4 h-4" strokeWidth={1.5} />
                      <span>Compartido</span>
                    </>
                  ) : (
                    <>
                      <Share2 className="w-4 h-4" strokeWidth={1.5} />
                      <span>Compartir</span>
                      <ChevronDown className={`w-3 h-3 transition-transform ${shareOpen ? 'rotate-180' : ''}`} strokeWidth={1.5} />
                    </>
                  )}
                </button>

                {/* Desplegable de redes sociales */}
                {shareOpen && (
                  <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    className="absolute top-full mt-2 left-0 w-48 rounded-xl border border-white/10 bg-black/90 backdrop-blur-md shadow-xl z-50 overflow-hidden"
                  >
                    {SOCIAL_PLATFORMS.map((platform) => {
                      const Icon = platform.icon
                      return (
                        <button
                          key={platform.id}
                          type="button"
                          onClick={() => handleShareTo(platform.id)}
                          className="w-full flex items-center gap-3 px-4 py-3 text-xs text-white/70 hover:text-white/90 hover:bg-white/10 transition-all"
                        >
                          <Icon className="w-4 h-4" strokeWidth={1.5} />
                          <span>{platform.name}</span>
                        </button>
                      )
                    })}
                    <button
                      type="button"
                      onClick={handleCopyLink}
                      className="w-full flex items-center gap-3 px-4 py-3 text-xs text-white/70 hover:text-white/90 hover:bg-white/10 transition-all border-t border-white/5"
                    >
                      <Copy className="w-4 h-4" strokeWidth={1.5} />
                      <span>Copiar enlace</span>
                    </button>
                  </motion.div>
                )}
              </div>

              <button
                type="button"
                onClick={scrollToDonate}
                className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-emerald-500/30 bg-emerald-500/10 hover:bg-emerald-500/15 text-xs text-emerald-200/90 transition-all"
              >
                <Coffee className="w-4 h-4" strokeWidth={1.5} />
                <span>Invítame un café</span>
              </button>
            </div>

            <div className="text-[11px] text-white/35 font-light">
              Compartir también es una forma de integrarlo.
            </div>
          </motion.div>
            </motion.div>
          </div>

          {/* Invítame un café */}
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.9, delay: 1.1 }}
            className="mt-10"
          >
            <div ref={donateRef} className="max-w-4xl mx-auto rounded-3xl border border-white/10 bg-black/25 backdrop-blur-md p-7 sm:p-10">
              <div className="text-center">
                <div className="mx-auto w-12 h-12 rounded-full border border-white/10 bg-white/5 flex items-center justify-center">
                  <Coffee className="w-5 h-5 text-white/70" strokeWidth={1.5} />
                </div>
                <h3 className="mt-4 text-2xl sm:text-3xl font-light text-white/95 tracking-wide">Invítame un café</h3>
                <p className="mt-2 text-sm sm:text-base text-white/65 font-light leading-relaxed">
                  Si esto te sirve, puedes apoyar para que siga siendo un espacio gratuito. Funciona sin fines de lucro.
                </p>
              </div>

              <div className="mt-7 grid grid-cols-3 gap-3 sm:gap-5 max-w-3xl mx-auto">
                <button
                  type="button"
                  onClick={() => handleDonate(20)}
                  className="group relative h-32 sm:h-40 flex flex-col items-center justify-center rounded-xl border border-white/10 bg-white/5 hover:bg-white/10 hover:border-white/20 transition-all duration-300"
                >
                  <div className="text-[9px] sm:text-xs uppercase tracking-widest text-white/40 group-hover:text-white/60 transition-colors">Aporte</div>
                  <div className="mt-1 sm:mt-2 text-2xl sm:text-4xl text-white/90 font-light group-hover:text-white transition-colors">$20</div>
                  <div className="mt-0.5 sm:mt-1 text-[9px] sm:text-xs text-white/50 group-hover:text-white/70 transition-colors">MXN</div>
                </button>

                <button
                  type="button"
                  onClick={() => handleDonate(50)}
                  className="group relative h-32 sm:h-40 flex flex-col items-center justify-center rounded-xl border-2 border-emerald-500/40 bg-emerald-500/10 hover:bg-emerald-500/15 hover:border-emerald-500/60 transition-all duration-300 sm:scale-105"
                >
                  <div className="absolute top-1 right-1 sm:top-2 sm:right-2 text-[7px] sm:text-[9px] uppercase tracking-widest px-1.5 sm:px-2 py-0.5 rounded-full bg-emerald-500/20 border border-emerald-500/40 text-emerald-200/90">
                    Popular
                  </div>
                  <div className="text-[9px] sm:text-xs uppercase tracking-widest text-emerald-200/60 group-hover:text-emerald-200/80 transition-colors">Aporte</div>
                  <div className="mt-1 sm:mt-2 text-2xl sm:text-5xl text-white/95 font-light group-hover:text-white transition-colors">$50</div>
                  <div className="mt-0.5 sm:mt-1 text-[9px] sm:text-xs text-emerald-200/60 group-hover:text-emerald-200/80 transition-colors">MXN</div>
                </button>

                <button
                  type="button"
                  onClick={() => handleDonate(100)}
                  className="group relative h-32 sm:h-40 flex flex-col items-center justify-center rounded-xl border border-white/10 bg-white/5 hover:bg-white/10 hover:border-white/20 transition-all duration-300"
                >
                  <div className="text-[9px] sm:text-xs uppercase tracking-widest text-white/40 group-hover:text-white/60 transition-colors">Aporte</div>
                  <div className="mt-1 sm:mt-2 text-2xl sm:text-4xl text-white/90 font-light group-hover:text-white transition-colors">$100</div>
                  <div className="mt-0.5 sm:mt-1 text-[9px] sm:text-xs text-white/50 group-hover:text-white/70 transition-colors">MXN</div>
                </button>
              </div>

              <div className="mt-6 flex flex-col items-center gap-3">
                <button
                  type="button"
                  onClick={handleWhatsAppDonate}
                  className="inline-flex items-center gap-2 px-6 py-3.5 rounded-full border border-white/10 bg-white/5 hover:bg-white/10 hover:border-white/20 text-sm text-white/80 hover:text-white/95 transition-all duration-300"
                >
                  <MessageCircle className="w-4 h-4" strokeWidth={1.5} />
                  <span>Otra cantidad por WhatsApp</span>
                </button>
              </div>

              <div className="mt-4 text-center text-[11px] text-white/35 font-light">
                Pagos seguros con tarjeta mediante Stripe (se abre en una nueva pestaña).
              </div>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  )
}

export default FraseDelDiaPage
