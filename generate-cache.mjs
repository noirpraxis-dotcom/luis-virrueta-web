// ─── Script para generar caché real de DeepSeek ───────────
// Uso: node generate-cache.mjs
// Requiere: Las 40 respuestas reales en REAL_ANSWERS abajo
// Genera: src/data/cachedPreviewAnalysis.js

import { readFileSync, writeFileSync } from 'fs'

const DEEPSEEK_API_URL = 'https://api.deepseek.com/chat/completions'
const API_KEY = 'sk-2e0294cf5d954607a75b7c6b31f7e54e'

// ─── RESPUESTAS REALES DE LUIS (34 AÑOS) ──────────────────
// IMPORTANTE: Pega aquí las 40 respuestas reales del usuario
const REAL_ANSWERS = {
  Q1: 'me llamo luis virrueta tengo treinta y cuatro años y actualmente estoy intentando construir un negocio para que funcione los próximos años y poder mejorar mi nivel económico describiría el momento de vida en el que me encuentro ahora como un tanto estresante porque he tenido más conflictos con mi pareja debido a ello pero necesito espacio para poder crecer y llevo en mi relación ocho años.',
  Q2: 'pues nos conocimos en un evento de música ambos tocábamos ella cantaba y yo tocaba pero en en esa ocasión ella todavía no estaba dentro de un grupo así es que empezamos a tocar juntos porque yo la invité a un grupo de folklore pero ella tenía pareja y yo también entonces de esta forma la conexión empezó porque yo la empecé a enseñar a tocar un instrumento llamado charango y desde allí empezamos a conectar momentos importantes en la vida recuerdo que ella me acompañaba cuando me independicé en mi vida cuando empecé a hacer mis propias cosas y me fui a vivir de casa de mis padres y inicié mi propio negocio siempre me ayudó a hacer todo esto he vivido muchas etapas con ella desde la etapa de más enamoramiento hasta la etapa de más pelea hemos vivido muchas cosas hemos viajado bastante hemos platicado muchísimo también son muchas cosas creo que hemos evolucionado en la vida y en la relación bien o actualmente vivimos en República Checa pero vivimos muchos años en México.',
  Q3: 'me siento presionado muchas veces porque vivimos en su país y no tengo la mejor economía siento que lo que está funcionando bien entre nosotros es que los dos miramos una vida libres económicamente y ella cree en mí las cosas que se han vuelto difíciles son el día a día porque ella exige determinadas cosas y yo no tengo tanto tiempo y prefiero hacer mis cosas para establecerme más y lo que ha cambiado con el tiempo es el distanciamiento muchas veces.',
  Q4: 'solemos salir una vez a la semana e ir a comer nos gusta platicar concientizar jugar juegos de mesa pero últimamente no lo hacemos tanto porque cada una está en sus propias cosas creo que en la cuestión de cuidados ha sido un poco complicado porque los dos somos alérgicos a que el otro nos pide porque cada quien está en sus cosas siento que solemos comunicarnos últimamente con mucho cuidado para que el otro no se enoje y siento que muchas veces cada uno va por su lado.',
  Q5: 'siento que hemos construido bastantes cosas por ejemplo un hogar también que nos hemos desarrollado en bastantes proyectos pero en lo personal yo me siento frenado porque muchos años era muy decidioso y no era comprometido con las cosas entonces eso es lo que nos ha generado roces la experiencias importantes que he vivido han sido tener un proyecto de música con ella y proyectos culturales de muchos tipos y festivales etcétera construcción de libros construcción de muchas cosas siento que con ella he logrado una estabilidad en conciencia creo que continuamente aprendemos de nuestro reflejo e intentamos ir madurando a través del otro en mi vida ha influido bastante porque me ha hecho un ser con más conciencia.',
  Q6: 'al principio me llamó mucho la atención que era extranjera y que era muy amable y muy inteligente me gustaba mucho como solía pensar a profundidad muchas cosas ya que era doctor en lingüística y yo estudiaba psicoanálisis si podíamos platicar de altas cosas pero también me atraía mucho su cuerpo creo que lo que le hacía diferente era que era extranjera y tenía ideas nuevas y además es una persona muy pensante como nunca la había visto.',
  Q7: 'fíjate que esta es una muy buena pregunta porque no los demostramos cuando cae la noche dándonos masajes pero hemos perdido la ternura y el acercamiento al otro como que estamos en defensivas sabes creo que no lo demostramos con palabras porque tendemos a intelectualizar y con contacto físico bueno a veces me gusta que me demuestren que me quieren escuchándome y estando presentes para mí yo lo demuestro a mi pareja que la quiero también cuando le hago masaje pero en general tengo pocos afectos hacia ella y creo que sí cada uno busca la forma diferente ya busca mucho contacto físico y yo contactor relacionar o racional.',
  Q8: 'momentos felices han sido poder vivir en Europa poder viajar juntos poder compartir muchas cosas de la vida aprendizajes momentos difíciles cuando los dos racionalizamos y nos ponemos tensos por fijarnos y ponernos necios defender cada uno su punto de vista también otro momento difícil es cuando ella me exige algo porque ella es como muy precisa y yo soy más libre en mi forma de pensar y las etapas que fueron cambiando la relación quizá fueron cuando ella se molestaba porque a mí me faltaba compromiso o de repente se tomaba todo muy en serio.',
  Q9: 'la verdad es que nunca lo pensé simplemente me dejaba fluir nunca fui a alguien que pensaba como en el futuro únicamente pensaba que podía disfrutar más con alguien platicando no imaginaba que pudiéramos estar porque ella tenía otra relación no esperaba nada de la relación.',
  Q10: 'sentía que encontraba mucha seguridad que encontraba mucha paz no la había vivido así reconocimiento también significaba ella para mí un todo quería que estuviera en mi vida que formará parte de ella me hacía sentir esa relación especial y aportaba a mi vida mucha claridad disciplina compromiso encontró en esa conexión reconocimiento.',
  Q11: 'crecí en un ambiente con mis padres considero yo que bueno me sentía contento en mi infancia pero al mismo tiempo con mucha exigencia por parte de mi madre y mi padre era muy burlón muchas veces muy criticona entonces crecí creo que con un súper yo muy fuerte pero al mismo tiempo por otro lado muy libre y sé que parece una contradicción pero la verdad es que eso es lo que siento me trataban bien pero creo que no me reconocían suficiente teníamos una relación cercana salíamos demasiado y platicaba mucho yo con mi padre y con mi madre tenía una relación más de disciplina resolvíamos los conflictos eh platicando recuerdo de su dinámica entre ellos que eran personas que solían pelear en un inicio como muchas discusiones pero al mismo tiempo de pronto eran muy amorosos.',
  Q12: 'siento que veía amor pero también discrepancias como opuestos pensaba que el amor era estar para el otro incondicionalmente vi que las relaciones se fomentaban a través de las discusiones completamente no sé que aprendí directa o indirectamente el tipo de relación que parecía normal para mí no lo sé.',
  Q13: 'sí ahorita que hacía el análisis pensaba en que con Susana suelo ser como muy burlón y me gusta mucho como de pronto aventar muchos sarcasmos y también mi padre lo hacía también racionalizar no lo sé hacer rabietas de pronto la falta de compromiso que tenía de mi padre y Susana se parece a mi madre porque tiene mucha disciplina como ella y es como dura y fría eso me sorprende notar.',
  Q14: 'tuve muchas relaciones muy caóticas en donde normalmente sufría mucho por mis parejas porque ellas eran perteneciendo a otros mundos yo crecí en un ambiente como muy cuidadoso bueno en amor y ellas no tenían familias muy rotas y ellas también estaban bastante rotas desde mi punto de vista entonces creo que aprendí de ellas que no quería eso siento que se repetían muchos patrones entre ellas siempre era como yo sufrir por ellas y estar en una búsqueda incansable para que duráramos más tiempo como si yo me pusiera como tapete pero en mi última relación se han roto la mayor parte de los tapetes y de los traumas.',
  Q15: 'creo que me gusta ser una persona altamente reconocida y que al conocerme tanto con mi pareja ya no existe tanto ese reconocimiento porque sabemos por dónde vamos cada uno entonces luego con otras personas me siento más no sé si más real pero más reconocido por supuesto que no puedo expresar libremente lo que pienso dentro de la relación porque muchas veces disparo triggers si mantengo muchas actividades y amistades por fuera de la relación a veces siento que me adaptó demasiado para evitar el conflicto necesito mucho espacio personal.',
  Q16: 'creo que funcionamos bien en equipo cuando estamos dispuestos a hacerlo y que las dos mentes combinadas funcionamos excelente cuando salimos de viaje solemos protegernos mutuamente cuando uno está mal el otro lo nota pero muchas veces no hace nada siento que cada uno se regula emocionalmente y sí siento que muchas veces no necesitamos al otro.',
  Q17: 'siento que frente a un tema de tener que resolver situaciones de la vida cotidiana pensar cuando comprar determinada cosa este ver que se acaba de vencer yo normalmente no estoy preocupado por ello en mi pareja así entonces de esas generan conflicto muy fuerte de hecho diría que es casi la base de todo las cuestiones de responsabilidad y las discusiones empiezan porque ella me empieza a decir y yo me molesto porque no me gusta que me estén como siento disturbios cuando me está molestando así como que empieza a sentir mucha presión siento que al principio del conflicto empiezo a estar a la defensiva y ella empieza como a gritar y cuando surge una diferencia creo que cada uno empieza de necio con sus puntos.',
  Q18: 'me siento evasivo quiero irme empiezo a sentir mucha desesperación e ir adentro de mí y yo creo que por eso no me quiero quedar para no mandarla al diablo entonces suelo normalmente o racionalizar y empezar a gritar fuertemente y a utilizar gestos como más fuertes.',
  Q19: 'creo que ella suene racional con gritos con mucho enojo tomándose lo demasiado en serio y siento que se ve tensa en todo su cuerpo empieza como alzar la voz y se le abren los ojos.',
  Q20: 'no me gusta estar peleado por lo que en general o la busco yo o ella me busca creo que yo tiendo a buscar más rápido porque si no no me siento conectado con mi trabajo y normalmente termina con que los dos como que nos separamos de Tajo y nos vamos si hablamos después de muy poco tiempo y después de hablarlo intentamos solucionarlo pero siento que queda cierto resentimiento.',
  Q21: 'Siento que hemos crecido en edad y que gran parte del deseo se ha ido. Quizá siento más amor que deseo. a veces cuando estamos conectados los dos, pero siento ternura, no sé si tanto deseo. son pocos los que siento atracción o erotismo. Lo que reactiva la atracción suele ser sentirme escuchado.',
  Q22: 'creo que los momentos en donde estamos conectados es cuando me siento escuchado con ella y ella también que nos relajamos que empezamos a cooperar en vez de competir cuando veo que no entra como en este pánico y se toma todo más ligero cuando yo colaboro siendo más responsable y ahí empezar a ver mucha cercanía emocional y la amo mucho.',
  Q23: 'no hay absolutamente llevamos mucho tiempo sin ellos me cuesta sentir excitación se siente raro el aspecto en la relación quizá más por ella que por mí yo he aprendido a satisfacerme solo se siente distancia física como que siento repulsión y ella sí me busca pero no sé como que yo tengo quizás ciertos traumas o no sé qué pasa al principio era muy conectado pero ahora ha sido muy difícil.',
  Q24: 'al inicio el deseo era mucho teníamos muchas relaciones sexuales en un solo día pero siempre he tenido un problema de que puedo acceder algo cuando es prohibido cuando es mío pierdo el interés y también creo que la frialdad de ella que se comporte como una madre lo que parece reactivar el deseo es cuando me siento escuchado y estamos conectados.',
  Q25: 'cuando estamos pensando como en proyectos cuando viajamos cuando caminamos al aire libre conectamos más con palabras en tu cuando sentimos que funcionamos como equipo porque tenemos una meta en común cuando sabemos que podemos contra el mundo me hace sentir querido que me siente escuchado.',
  Q26: 'sigue en general me distancio cuando me siento exigido que se me está exigiendo completamente eso me genera mucha distancia emocional o la relación se enfría cuando yo no estoy presente para ella en cuestión de compromiso y responsabilidad lo que nos separa o desconecta puede ser que tiendo yo a enfocarme por completo en algo y se me olvida todo lo demás y lo descuido ahí es donde se genera la distancia o cuando me en sí mismo mucho en algún tema solo ser muy obsesivo con las cosas.',
  Q27: 'el suelo tomar decisiones importantes cuando tenemos que pensar en el futuro y suele ser difícil porque cada uno tiene un punto de vista distinta y yo siempre me he resistido mucho a la autoridad o que me digan como tengo que hacer llegamos a acuerdos después de la pelea cuando nos reconciliamos y entonces yo propongo algo normalmente y cuando no estamos de acuerdo sabemos que pues aún así podemos continuar sin llegar a todos los acuerdos porque cada uno piensa distinto.',
  Q28: 'creo que muchas veces yo por mi carácter dominante pero también ella tiene carácter dominante entonces creo que depende hay días y días pero en general siento que yo puedo influir más porque a ella le cuesta más separarse de mí quizá que yo de ella.',
  Q29: 'creo que espera de mí que sea más responsable pero también cuando lo he mostrado pide más creo que valora mucho que sea independiente y más adulto eso.',
  Q30: 'si me pudiera ofrecer todo lo que pido pediría escuchar pero a veces es un tipo de escucha en donde no me importa tanto que diga el otro sino poder como que vaciar todas mis ideas porque en general estoy pensando bastantes cosas de distintos proyectos grandes que tengo y me gusta ser escuchado sin juicio necesito más presencia más contacto más que esté ahí.',
  Q31: 'a veces pienso si continuar o no pero al mismo tiempo hay una parte en mí que sabe que no hay una mujer con este nivel de conciencia en donde nunca es malintencionada sino que únicamente va pensando en las cosas desde un bienestar y más bien cuando reflexiona ya las cosas como que las va cambiando si sabe que daña al otro eso me gusta y eso significa para mí como poderme ver en un futuro tranquilo con una persona en donde yo me expanda hacia temas fuertes espirituales que he tenido ganas me hace sentir que vale la pena seguir construyendo su libertad no es tan juiciosa y eso me da libertad de hacer quien yo quiero ser aunque a veces no.',
  Q32: 'quiero una casa en méxico y otra en Chequia quiero estar viajando continuamente pasar tiempos con ella pasar tiempo solos viajando haciendo mis cosas que ella pueda cumplir sus sueños yo también los míos tener centros grandes de atención a conciencia sobre otras personas sos a centros espirituales holísticos con ella y me gustaría como que seamos muy exitosos en ellos.',
  Q33: 'me siento querido cuando se la escucha y cuando está presente para mí cuando me ayuda a resolver cosas antes estaba como incondicionalmente ayudándome a crecer pero hoy en día creo que se ha cansado necesitaría recibir más de mi pareja escuchar.',
  Q34: 'sí ver que en nuestras culturas de pronto nos alejan y ver a ella que a veces está incómoda con la forma en que me comporto respecto a la relación y la responsabilidades entonces a veces siento que está cansada y poder pensar que podría pensar perder vivir en Chequia sabes también por eso.',
  Q35: 'el nivel de conciencia que siempre vamos cambiando y somos flexibles y realmente creo que esto permite poder cambiar cualquier obstáculo y trabajar en cualquier cosa desde distintos ángulos porque no nos quedamos centrados solo en algo sabes ayuda que nos reconciliemos estar presentes y vulnerables que en general no lo hacemos.',
  Q36: 'se ha vuelto muy rutinaria porque hemos estado enfrascado en los proyectos pero también desde hace tiempo porque ya nos conocemos más y sabemos por dónde va a ir cada uno de hecho a veces hasta nos adelantamos en general no hay espacio para la sorpresa a menos que estamos en un punto vulnerable compartiendo más allá del ego extraño la aventura que sentía al principio sí.',
  Q37: 'creo que yo me gusta sentir apoyo y que haya alguien mientras yo puedo seguir construyendo mis cosas sin que me moleste tanto y creo que ella también y también creo que quizá en parte tiene que ver con la soledad cuyo pensar que no queremos estar solos pero también es una cuestión de conciencia de estar para el otro por conciencia sabes yo busco dentro del vínculo seguridad y creo que ella también.',
  Q38: 'ha revelado parte de donde crecí porque mi falta de compromiso se debe a un contexto que ha cambiado con el tiempo hoy me siento mejor más disciplinado que puedo enfocarme más en las cosas y eso me encanta y también tengo un nivel de conciencia que me permite tratar a todos los seres de una forma distinta sabes entonces esto es el máximo aprendizaje y también la parte espiritual tengo claro que siento diferente la vida cuando pienso en lo espiritual y eso lo comparto con ella.',
  Q39: 'creo que es una relación muy bella en cuestión de que los dos buscamos crecer altamente creativos y que podemos realmente trabajar en cualquier cosa para mejorarla entre nosotros y también en cómo nos relacionamos con nosotros a través de la conciencia.',
  Q40: 'que a veces tengo dudas porque extraño México y mi cultura y a veces en Chequia vivo pues con ella y en sus reglas y en su sistema de ella.'
}

const PROFILE = { nombre: 'Luis', edad: '34', fecha: new Date().toLocaleDateString('es-MX', { year: 'numeric', month: 'long', day: 'numeric' }) }

// Read system prompt from service file
const serviceFile = readFileSync('src/services/radiografiaPremiumService.js', 'utf-8')
const systemPromptMatch = serviceFile.match(/const SYSTEM_PROMPT = `([\s\S]*?)`/)
if (!systemPromptMatch) { console.error('Could not extract SYSTEM_PROMPT'); process.exit(1) }
const SYSTEM_PROMPT = systemPromptMatch[1]

// Read questions from page file
const pageFile = readFileSync('src/pages/RadiografiaPremiumPage.jsx', 'utf-8')

// Simple extraction of question IDs, blocks, and mainQuestions
const questions = []
const qRegex = /id:\s*'(Q\d+)',\s*block:\s*'([^']*)',\s*mainQuestion:\s*'([^']*)'/g
let m
while ((m = qRegex.exec(pageFile)) !== null) {
  questions.push({ id: m[1], block: m[2], mainQuestion: m[3] })
}

// Also get examples
const fullQRegex = /\{\s*id:\s*'(Q\d+)',[^}]*examples:\s*\[([^\]]*)\]/g
const examplesMap = {}
while ((m = fullQRegex.exec(pageFile)) !== null) {
  const exArr = m[2].match(/'([^']*)'/g)?.map(s => s.replace(/'/g, '')) || []
  examplesMap[m[1]] = exArr
}
for (const q of questions) {
  q.examples = examplesMap[q.id] || []
}

console.log(`Found ${questions.length} questions`)

// Check if answers are filled
const emptyCount = Object.values(REAL_ANSWERS).filter(v => !v.trim()).length
if (emptyCount > 0) {
  console.error(`\n⚠️  ${emptyCount} respuestas están vacías en REAL_ANSWERS.`)
  console.error('   Pega las 40 respuestas reales de Luis antes de ejecutar.\n')
  process.exit(1)
}

// Build prompt (same logic as buildPrompt in service)
let prompt = '## RESPUESTAS DEL CUESTIONARIO NARRATIVO — RADIOGRAFÍA DE PAREJA PREMIUM\n\n'
prompt += `### DATOS DEL USUARIO\n`
prompt += `- Nombre: ${PROFILE.nombre}\n`
prompt += `- Edad: ${PROFILE.edad}\n`
prompt += `- Fecha del reporte: ${PROFILE.fecha}\n`
prompt += `\n(USA EL NOMBRE DEL USUARIO EN EL REPORTE para generar cercanía y rapport.)\n\n`
prompt += '(Cada respuesta fue dada verbalmente — la persona habló con libertad, sin filtro escrito.)\n'
prompt += '(Cada pregunta incluye "Puntos clave a evaluar" — úsalos como rúbrica para medir qué tanto cubrió el usuario.)\n\n'

const blocks = {}
for (const q of questions) {
  if (!blocks[q.block]) blocks[q.block] = []
  blocks[q.block].push({ ...q, answer: REAL_ANSWERS[q.id] || '' })
}

for (const [block, items] of Object.entries(blocks)) {
  prompt += `### ${block}\n`
  for (const item of items) {
    prompt += `**${item.id}. "${item.mainQuestion}"**\n`
    if (item.examples?.length > 0) {
      prompt += `Puntos clave a evaluar: ${item.examples.join(' | ')}\n`
    }
    if (item.answer?.trim()) {
      prompt += `→ "${item.answer.trim()}"\n\n`
    } else {
      prompt += `→ (no respondió — infiere desde el contexto global de toda la narrativa)\n\n`
    }
  }
}

// Add JSON schema instruction (read from service file)
const schemaMatch = serviceFile.match(/prompt \+= `\\nRealiza el análisis([\s\S]*?)}`/)
if (schemaMatch) {
  prompt += '\nRealiza el análisis' + schemaMatch[1] + '}'
} else {
  console.log('⚠️ Schema regex did not match — adding generic JSON instruction')
  prompt += '\nResponde EXCLUSIVAMENTE en formato JSON válido con toda la estructura solicitada en el system prompt.'
}

console.log(`\nPrompt length: ${prompt.length} chars`)
console.log(`System prompt length: ${SYSTEM_PROMPT.length} chars`)

// ─── Split into 2 API calls (8192 token limit per response) ──────

async function callDeepSeek(systemContent, userContent, label) {
  console.log(`\n[${label}] Calling DeepSeek API...`)
  const body = {
    model: 'deepseek-chat',
    messages: [
      { role: 'system', content: systemContent },
      { role: 'user', content: userContent }
    ],
    temperature: 0.7,
    max_tokens: 8192,
    response_format: { type: 'json_object' }
  }
  const response = await fetch(DEEPSEEK_API_URL, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${API_KEY}` },
    body: JSON.stringify(body)
  })
  if (!response.ok) {
    const errText = await response.text()
    throw new Error(`API ${response.status}: ${errText}`)
  }
  const data = await response.json()
  const content = data.choices?.[0]?.message?.content
  const finishReason = data.choices?.[0]?.finish_reason
  console.log(`[${label}] Tokens: ${data.usage?.total_tokens || '?'}, finish: ${finishReason}, content: ${content?.length || 0} chars`)
  if (finishReason === 'length') {
    console.warn(`[${label}] ⚠️ Response truncated! Attempting JSON repair...`)
    // Try to repair truncated JSON by closing open strings/objects/arrays
    let repaired = content
    // Count unmatched braces/brackets
    let braces = 0, brackets = 0, inString = false, lastChar = ''
    for (const c of repaired) {
      if (c === '"' && lastChar !== '\\') inString = !inString
      if (!inString) {
        if (c === '{') braces++
        if (c === '}') braces--
        if (c === '[') brackets++
        if (c === ']') brackets--
      }
      lastChar = c
    }
    if (inString) repaired += '"'
    while (brackets > 0) { repaired += ']'; brackets-- }
    while (braces > 0) { repaired += '}'; braces-- }
    return JSON.parse(repaired)
  }
  return JSON.parse(content)
}

try {
  // CALL 1: Autoanalisis only
  const autoPrompt = prompt + `\n\nPARA ESTA LLAMADA, genera ÚNICAMENTE la sección "autoanalisis_usuario" con sus 10 subsecciones.
Responde en JSON con esta estructura exacta:
{
  "autoanalisis_usuario": {
    "apertura_rapport": "(2-3 párrafos)",
    "forma_de_amar": "(3-4 párrafos)",
    "lo_que_busca_en_el_otro": "(2-3 párrafos)",
    "lo_que_reclama_afuera": "(2-3 párrafos)",
    "fantasma_relacional": "(2-3 párrafos)",
    "yo_ideal": "(2 párrafos)",
    "mecanismos_defensa": "(2-3 párrafos)",
    "tipo_pareja_que_repite": "(2-3 párrafos)",
    "nucleo_del_patron": "(1-2 párrafos densos)",
    "cierre_transformador": "(2-3 párrafos)"
  }
}
USA EL NOMBRE "Luis" constantemente. Cita sus propias palabras entre comillas. Usa **negrita** para conceptos clave.`

  const autoResult = await callDeepSeek(SYSTEM_PROMPT, autoPrompt, 'AUTOANALISIS')

  // CALL 2: Everything else (dimensions, diagnostico, lecturas, etc)
  const restPrompt = prompt + `\n\nPARA ESTA LLAMADA, genera TODO EXCEPTO "autoanalisis_usuario" (que ya fue generado aparte).
Responde en JSON con esta estructura (SIN autoanalisis_usuario):
{
  "resumen_relacion": "(2-3 párrafos)",
  "dimensiones": { "estabilidad_relacional": 0-100, "apego_emocional": 0-100, "conexion_emocional": 0-100, "deseo_erotico": 0-100, "intimidad": 0-100, "sincronia_relacional": 0-100, "patrones_inconscientes": 0-100, "fantasma_relacional": 0-100, "roles_sistemicos": 0-100, "resiliencia_vinculo": 0-100, "vulnerabilidad_emocional": 0-100, "narrativa_futuro": 0-100 },
  "diagnostico": { "tipo_vinculo": "", "estilo_apego": "", "dinamica_conflicto": "", "tono_relacional": "" },
  "radiografia_inicial": "(2-3 párrafos)",
  "analisis_profundo": { "narrativa_dominante": "", "tensiones_estructurales": "", "evolucion_deseo": "", "dinamica_emocional": "" },
  "lectura_psicoanalitica": { "proyecciones_inconscientes": "", "fantasma_relacional": "", "roles_simbolicos": "" },
  "dinamica_conflicto": { "tendencia_conflicto": 0-100, "reaccion_usuario": "", "reaccion_pareja": "", "capacidad_reparacion": 0-100 },
  "energia_vinculo": { "atraccion_inicial": 0-100, "atraccion_actual": 0-100, "intimidad_emocional": 0-100, "conexion_fisica": 0-100 },
  "direccion_probable": { "estabilidad_futura": 0-100, "riesgo_desgaste": 0-100, "potencial_reconexion": 0-100 },
  "fortalezas": ["...", "...", "..."],
  "riesgos": ["...", "...", "..."],
  "tabla_diagnostica": [{"dimension":"","nivel":"","interpretacion":""}],
  "lecturas_por_enfoque": { para cada: gottman, sue_johnson, perel, levine, hendrix, tatkin, chapman, sternberg, schnarch, real, freud_lacan },
  "sintesis_final": { "que_ocurre": "", "posibilidades_evolucion": "", "factores_fortalecimiento": "" }
}
USA el nombre "Luis". Cita sus palabras entre comillas. Usa **negrita** para conceptos clave. Sé conciso pero profundo en las lecturas_por_enfoque (1 párrafo por enfoque para caber en el límite de tokens).`

  const restResult = await callDeepSeek(SYSTEM_PROMPT, restPrompt, 'RESTO')

  // Merge both results
  const merged = { ...restResult, autoanalisis_usuario: autoResult.autoanalisis_usuario }

  // Clamp dimension scores
  if (merged.dimensiones) {
    for (const key of Object.keys(merged.dimensiones)) {
      merged.dimensiones[key] = Math.max(0, Math.min(100, Number(merged.dimensiones[key]) || 50))
    }
  }

  // Write as JS module
  const output = `// ─── Cached DeepSeek analysis for preview mode ───────────
// Generated: ${new Date().toISOString()}
// Profile: Luis, 34 años
// This is a REAL DeepSeek response, not dummy data.

export const CACHED_PREVIEW_ANALYSIS = ${JSON.stringify(merged, null, 2)}
`

  writeFileSync('src/data/cachedPreviewAnalysis.js', output, 'utf-8')
  console.log('\n✅ Cache saved to src/data/cachedPreviewAnalysis.js')
  console.log(`   Response length: ${output.length} chars`)

} catch (err) {
  console.error('Failed:', err.message)
  process.exit(1)
}
