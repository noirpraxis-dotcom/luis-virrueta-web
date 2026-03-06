// ─── SERVICIO DE ANÁLISIS CON DEEPSEEK ────────────────────────────
// ⚠️ SEGURIDAD: En producción, mover esta llamada a un Supabase Edge Function
// o Cloudflare Worker para no exponer la API key en el navegador del cliente.
// Actualmente usa VITE_DEEPSEEK_API_KEY del archivo .env

const DEEPSEEK_API_URL = 'https://api.deepseek.com/chat/completions'

const SYSTEM_PROMPT = `Eres un psicólogo especialista en relaciones de pareja con enfoque profundo en dinámicas vinculares y patrones de comportamiento en el vínculo amoroso.

Tu tarea es generar un diagnóstico integral cruzando dos fuentes de datos:

FUENTE PRIMARIA — RESPUESTAS NARRATIVAS (15 preguntas conversacionales):
Son el corazón del diagnóstico. La persona habló libremente, revelando patrones sin darse cuenta. Extrae lo profundo de lo aparentemente cotidiano. Busca:
- Lo que la persona en verdad necesita vs. lo que dice querer
- Cómo percibe al otro: ¿lo ve como persona real o como lo que necesita que sea?
- Qué temas evita mencionar, qué minimiza, qué repite sin darse cuenta
- Señales de que carga algo que no ha podido decirle abiertamente a su pareja
- Patrones: ¿esta dinámica recuerda a algo que ya vivió antes?
- Equilibrio entre dar y recibir en la relación
- Si la persona se mantiene como individuo o se ha ido perdiendo dentro del vínculo
- Cómo habla del otro: con admiración, frustración, miedo, indiferencia, resignación

FUENTE CONFIRMATORIA — AFIRMACIONES CUANTITATIVAS (25 reactivos Likert):
Los datos corroboran o contradicen lo que la narrativa reveló. Cruza:
- Si la narrativa dice "todo está bien" pero los números muestran áreas débiles: detectar evasión o disociación
- Si la narrativa muestra sufrimiento pero los números son altos: posible minimización
- Si coinciden: mayor confianza en el patrón detectado

INSTRUCCIONES CRÍTICAS:
1. CITA PALABRAS EXACTAS: siempre que puedas, incluye frases literales de las respuestas entre comillas. Ej: «cuando dijiste "no sé cómo explicarlo pero algo cambió"...»
2. USA **NEGRITA**: marca con **dobles asteriscos** los conceptos clave y observaciones centrales para destacarlos visualmente.
3. LENGUAJE ACCESIBLE: cálido, humano, sin jerga técnica ni términos académicos. Escribe como un psicólogo que habla directamente con la persona, no como un manual clínico.
4. SÉ ESPECÍFICO: cada observación debe poder ser reconocida como "esto es exactamente lo que yo dije y lo que yo vivo".
5. APERTURA EMPÁTICA PRIMERO: lo primero que la persona leerá debe hacerla sentir profundamente comprendida — valida su experiencia, cita sus palabras, ve el ser humano antes que el patrón.

Para cada área del diagnóstico, explica POR QUÉ tiene esa puntuación citando evidencia concreta de las respuestas.

IMPORTANTE: Responde EXCLUSIVAMENTE en formato JSON válido con la estructura solicitada.`

function buildPrompt(areaScores, areaLabels, philosophicalAnswers, philosophicalQuestions, inconsistencies) {
  // NARRATIVE FIRST — primary source
  let prompt = '## FUENTE PRIMARIA: RESPUESTAS NARRATIVAS\n'
  prompt += '(La persona las contó "como si le platicara a un amigo". Aquí está la verdadera información.)\n\n'

  for (let i = 0; i < philosophicalQuestions.length; i++) {
    const answer = philosophicalAnswers[i]
    if (answer && answer.trim()) {
      prompt += `**Pregunta:** "${philosophicalQuestions[i].text}"\n**Respuesta:** "${answer.trim()}"\n\n`
    } else {
      prompt += `**Pregunta:** "${philosophicalQuestions[i].text}"\n**Respuesta:** (no contestó / omitió — esto también es dato significativo)\n\n`
    }
  }

  // QUANTITATIVE DATA — confirmatory source
  prompt += '\n## FUENTE CONFIRMATORIA: DATOS CUANTITATIVOS (escala 1-5, donde 5 es óptimo)\n\n'

  for (const [key, score] of Object.entries(areaScores)) {
    const label = areaLabels[key] || key
    const pct = Math.round(((score - 1) / 4) * 100)
    prompt += `- ${label}: ${score.toFixed(1)}/5 (${pct}%)\n`
  }

  if (inconsistencies && inconsistencies.length > 0) {
    prompt += '\n## INCONSISTENCIAS EN RESPUESTAS CUANTITATIVAS:\n\n'
    for (const inc of inconsistencies) {
      prompt += `⚠️ En ${inc.area} (significancia ${inc.significance}):\n`
      prompt += `  - "${inc.q1}" → respondió ${inc.q1_answer}/5\n`
      prompt += `  - "${inc.q2}" → respondió ${inc.q2_answer}/5\n`
      prompt += `  Estas respuestas se contradicen. Analiza qué revela esta contradicción.\n\n`
    }
  }

  const areaKeys = Object.keys(areaScores)
  const areaCorrelationsSchema = areaKeys.map(k => `"${k}": "(1-2 párrafos profundos. Explica POR QUÉ esta área tiene esa puntuación. CITA PALABRAS EXACTAS de las respuestas entre comillas. Ej: 'En comunicación obtuviste 45% — cuando dijiste \\"hay temas que simplemente no tocamos\\" quedó claro que existe un acuerdo silencioso de evitar ciertos conflictos que se sienten peligrosos. Los datos confirman...')"`).join(',\n    ')

  prompt += `\nGenera tu análisis psicológico en el siguiente formato JSON exacto:
{
  "diagnosticoNarrado": "(2-3 párrafos. Captura el núcleo del conflicto tal como apareció en sus respuestas. Habla directamente a la persona: cálido, íntimo, sin términos clínicos. CITA sus palabras exactas entre comillas. **Usa negrita** en las frases más importantes. Cierra con una oración que presenta lo que se desglosará a continuación. Nunca uses el término diagnóstico. Ejemplo: 'Hay algo que atraviesa todo lo que compartiste...' o 'Lo que describes tiene una lógica más profunda de lo que parece...')",
  "aperturaEmpatica": "(2-3 párrafos. Haz que la persona se sienta profundamente escuchada ANTES de cualquier análisis. CITA sus palabras exactas entre comillas en la primera propuesta. Ejemplo de inicio: 'Algo que compartiste resonó especialmente: cuando dijiste \\"[cita exacta]\\" había mucho más de lo que parece a primera vista...' Introduce la observación principal de forma cálida. **Usa negrita** para los conceptos más importantes. Sin tecnicismos. Este es lo primero que leerá.)",
  "aperturaEmpaticaPuntos": [{"titulo": "Palabra o frase clave (3-6 palabras)", "texto": "1-2 oraciones que exploran este hallazgo específico, citando las palabras exactas de la persona cuando sea posible."}, {"titulo": "Segundo hallazgo clave", "texto": "descripción..."}, {"titulo": "Tercer hallazgo", "texto": "descripción..."}, {"titulo": "Cuarto hallazgo (opcional)", "texto": "descripción..."}],
  "lecturaNarrativa": "(3-4 párrafos: análisis PROFUNDO de las respuestas narrativas. Extrae patrones de comportamiento, tendencias relacionales, pérdida de autonomía. **Cita palabras exactas** entre comillas donde sea posible. **Usa negrita** para conceptos clave. Evita jerga técnica.)",
  "lecturaCuestionario": "(2-3 párrafos: qué dicen los datos cuantitativos, SIEMPRE en relación con la narrativa. Usa frases como 'los datos corroboran que...', 'esto confirma lo que dijiste cuando mencionaste que...', o 'llama la atención que los números muestren algo distinto a lo que expresaste sobre...')",
  "lecturaIntegral": "(3-4 párrafos: síntesis de ambas fuentes. La historia que emerge al cruzar lo dicho con lo medido. Escrito como recomendación profesional directa hacia la persona. **Usa negrita** en las observaciones más importantes. Cierra con una frase que oriente hacia la sesión.)",
  "areaCorrelations": {
    ${areaCorrelationsSchema}
  },
  "correlacionesPrincipales": ["(1-2 oraciones: la conexión más reveladora entre dos o más áreas. **Usa negrita** para los nombres de áreas. Ej: 'La baja **Comunicación** y los **Conflictos acumulados** forman un ciclo cerrado...')", "(segunda conexión importante)", "(tercera — opcional)"],
  "idealizationLevel": "alto" o "medio" o "bajo",
  "idealizationScore": (número entero 0-100 donde 100 = máxima idealización problemática),
  "idealizationExplanation": "(2 párrafos específicos sobre POR QUÉ esta persona tiene ESTE nivel de idealización. Cita sus palabras exactas. NO genérico — basado enteramente en lo que esta persona respondió. Explica qué necesidad emocional opera detrás de esta dinámica.)",
  "unconsciousPatterns": ["**PatrónClave**: descripción accesible y específica de cómo aparece en esta persona según sus respuestas", "**Patrón2**: descripción", "**Patrón3**: descripción", "**Patrón4 (opcional)**: descripción"],
  "defenseMechanisms": ["**NombreMecanismo**: descripción de cómo aparece específicamente en esta persona según lo que dijo", "**Mecanismo2**: descripción", "**Mecanismo3 (opcional)**: descripción"],
  "strengthsFound": ["**NombreFortaleza**: descripción específica basada en lo que la persona dijo y demostró en sus respuestas", "**Fortaleza2**: descripción", "**Fortaleza3**: descripción"],
  "riskAreas": ["**ÁreaEnRiesgo**: explicación accesible y específica de por qué representa un riesgo en este caso concreto", "**Riesgo2**: descripción"],
  "keyInsight": "(1 párrafo con la observación más reveladora)",
  "recommendation": "(1-2 párrafos con recomendación profesional personalizada basada en lo que la persona contó)",
  "sessionWorkItems": ["**TemaIndividual1**: descripción concreta y específica para sesión individual — basado en algo que ESTA persona dijo, no genérico", "**Tema2**: descripción", "**Tema3**: descripción", "**Tema4 (opcional)**: descripción"],
  "sessionWorkItemsPareja": ["**TemaPareja1**: descripción concreta de lo que se trabajaría si la pareja viene junta — específico a la dinámica detectada", "**Tema2**: descripción", "**Tema3 (opcional)**: descripción"]
}`

  return prompt
}

export async function analyzeRelationship({ areaScores, areaLabels, philosophicalAnswers, philosophicalQuestions, inconsistencies }) {
  const apiKey = import.meta.env.VITE_DEEPSEEK_API_KEY

  if (!apiKey) {
    console.warn('⚠️ VITE_DEEPSEEK_API_KEY no configurada. Usando análisis de respaldo.')
    return generateFallbackAnalysis(areaScores)
  }

  const prompt = buildPrompt(areaScores, areaLabels, philosophicalAnswers, philosophicalQuestions, inconsistencies)

  try {
    const response = await fetch(DEEPSEEK_API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`
      },
      body: JSON.stringify({
        model: 'deepseek-chat',
        messages: [
          { role: 'system', content: SYSTEM_PROMPT },
          { role: 'user', content: prompt }
        ],
        temperature: 0.7,
        max_tokens: 6000,
        response_format: { type: 'json_object' }
      })
    })

    if (!response.ok) {
      const errorText = await response.text()
      throw new Error(`DeepSeek API error: ${response.status} - ${errorText}`)
    }

    const data = await response.json()
    const content = data.choices?.[0]?.message?.content

    if (!content) throw new Error('No content in DeepSeek response')

    return JSON.parse(content)
  } catch (error) {
    console.error('DeepSeek analysis failed:', error)
    return generateFallbackAnalysis(areaScores)
  }
}

function generateFallbackAnalysis(areaScores) {
  const idealScore = areaScores.idealizacion || 3
  const idealPct = Math.round(((idealScore - 1) / 4) * 100)
  const actualIdealScore = 100 - idealPct
  const actualIdealLevel = idealPct <= 33 ? 'alto' : idealPct <= 66 ? 'medio' : 'bajo'

  const sessionItemsFallback = []
  if (areaScores.comunicacion <= 3.0) sessionItemsFallback.push('Explorar qué temas se evitan en la conversación y por qué esos temas se sienten peligrosos de abordar')
  if (areaScores.intimidad <= 3.0) sessionItemsFallback.push('Identificar en qué momento y por qué se fue interrumpiendo la conexión emocional profunda')
  if (areaScores.conflicto <= 2.5) sessionItemsFallback.push('Revisar los conflictos que siguen pendientes y el costo silencioso que tiene esa deuda no resuelta')
  if (areaScores.autonomia <= 3.0) sessionItemsFallback.push('Explorar cómo se mantiene (o se ha ido perdiendo) la identidad individual dentro de la relación')
  if (areaScores.seguridad <= 3.0) sessionItemsFallback.push('Trabajar en los patrones de confianza y seguridad emocional que sostienen el vínculo')
  if (sessionItemsFallback.length < 2) sessionItemsFallback.push('Profundizar en los patrones que operan por debajo de lo visible en esta relación')
  if (sessionItemsFallback.length < 3) sessionItemsFallback.push('Construir herramientas concretas para la comunicación en los momentos más difíciles')

  const patterns = []
  if (areaScores.comunicacion <= 2.5) patterns.push('**Evitación emocional**: dificultad para expresar necesidades profundas sin que se convierta en conflicto')
  if (areaScores.intimidad <= 2.5) patterns.push('**Distanciamiento reactivo**: alejamiento emocional como mecanismo de protección ante la vulnerabilidad')
  if (areaScores.conflicto <= 2.5) patterns.push('**Conflicto latente**: evitación de enfrentamientos que genera acumulación silenciosa de resentimiento')
  if (areaScores.idealizacion <= 2.5) patterns.push('**Expectativa proyectada**: se coloca en el otro una imagen idealizada que genera frustración recurrente')
  if (areaScores.autonomia <= 2.5) patterns.push('**Fusión vincular**: pérdida gradual de la identidad individual dentro de la relación')
  if (areaScores.seguridad <= 2.5) patterns.push('**Dependencia emocional**: búsqueda de seguridad en el otro que limita la autonomía personal')
  if (patterns.length === 0) patterns.push('**Patrones relacionales saludables**: el vínculo muestra recursos emocionales sólidos con espacio para profundizar')

  const strengths = []
  if (areaScores.comunicacion >= 3.5) strengths.push('**Diálogo activo**: capacidad de escucha y conversación genuina como base del vínculo')
  if (areaScores.admiracion >= 3.5) strengths.push('**Reconocimiento mutuo**: reconocimiento genuino del valor y las cualidades del otro')
  if (areaScores.proyecto >= 3.5) strengths.push('**Visión compartida**: proyecto y horizonte común que sostiene la dirección de la relación')
  if (areaScores.autonomia >= 3.5) strengths.push('**Individualidad respetada**: respeto por la identidad propia dentro del vínculo')
  if (areaScores.idealizacion >= 3.5) strengths.push('**Amor al otro real**: capacidad de amar al otro con su falta, no al otro idealizado')
  if (strengths.length === 0) strengths.push('**Disposición al trabajo**: apertura para explorar la relación a mayor profundidad')

  // Generar las lecturas basadas en reglas
  const areaNames = { comunicacion: 'Comunicación', intimidad: 'Intimidad', admiracion: 'Admiración', conflicto: 'Conflictos', proyecto: 'Proyecto de vida', seguridad: 'Seguridad emocional', autonomia: 'Autonomía', idealizacion: 'Idealización' }
  const sorted = Object.entries(areaScores).sort((a, b) => b[1] - a[1])
  const strongest = sorted[0]
  const weakest = sorted[sorted.length - 1]

  let lecturaNarrativa = 'No fue posible procesar las respuestas narrativas con la inteligencia artificial en este momento. Sin embargo, los datos cuantitativos nos permiten generar un perfil orientativo de la relación.\n\nLas respuestas abiertas que compartiste contienen información valiosa sobre tus patrones vinculares, mecanismos de defensa y estructura del deseo. En una sesión profesional, estos elementos se analizan en profundidad para revelar lo que opera debajo de lo consciente.'

  let lecturaCuestionario = `El área más sólida de la relación es ${areaNames[strongest[0]]} (${Math.round(((strongest[1]-1)/4)*100)}%), lo cual funciona como factor protector del vínculo. `
  if (weakest[1] <= 2.5) {
    lecturaCuestionario += `Sin embargo, ${areaNames[weakest[0]]} muestra indicadores preocupantes (${Math.round(((weakest[1]-1)/4)*100)}%) que sugieren un patrón que, de no abordarse, tiende a profundizarse con el tiempo.\n\n`
  } else {
    lecturaCuestionario += `Las áreas evaluadas muestran un perfil relativamente equilibrado, aunque siempre hay espacio para el crecimiento.\n\n`
  }
  if (areaScores.comunicacion <= 3.0 && areaScores.conflicto <= 3.0) {
    lecturaCuestionario += 'La combinación de dificultades en comunicación y conflicto acumulado es uno de los patrones más frecuentes en relaciones que se deterioran silenciosamente. Los temas no hablados no desaparecen: se transforman en distancia emocional.\n\n'
  }
  if (areaScores.intimidad <= 2.5 && areaScores.proyecto >= 3.5) {
    lecturaCuestionario += 'Es revelador que compartan visión de futuro pero la conexión íntima esté debilitada. Esto sugiere una relación que funciona bien en lo racional-práctico pero necesita reconectar en lo emocional-corporal.\n\n'
  }
  lecturaCuestionario += 'Los números son un punto de partida. Revelan tendencias y patrones, pero el significado profundo de cada respuesta solo emerge cuando se contextualiza dentro de la historia singular de cada pareja.'

  const lecturaIntegral = `Al cruzar los datos cuantitativos con las reflexiones personales, emerge un perfil más completo de la dinámica vincular. ${
    areaScores.idealizacion <= 2.5 && areaScores.seguridad <= 3.0
      ? 'La combinación de idealización elevada y seguridad emocional frágil es reveladora: sugiere un patrón donde se busca en el otro aquello que se necesita para sentirse seguro, creando un ciclo de dependencia y frustración.'
      : areaScores.comunicacion >= 3.5 && actualIdealLevel !== 'bajo'
        ? 'Es interesante que la comunicación sea relativamente funcional mientras persisten patrones de idealización. Esto sugiere que se puede hablar del vínculo, pero quizás no de lo que realmente opera debajo: la relación con la propia falta.'
        : 'Los números y las palabras cuentan historias complementarias que invitan a una exploración más profunda de los patrones vinculares.'
  }\n\nLo que emerge al integrar ambas lecturas es que los patrones detectados no son defectos a corregir, sino dinámicas a comprender. Cada relación construye su propio lenguaje inconsciente, y descifrarlo es el primer paso para transformarlo.\n\nLa pregunta más importante no es "¿funciona esta relación?" sino "¿qué tipo de relación con el deseo opera en cada uno de ustedes?" Los números muestran tendencias; las reflexiones muestran subjetividad. La sesión profesional es donde ambas dimensiones se encuentran y revelan su significado singular.`

  return {
    diagnosticoNarrado: 'Hay algo que se percibe con claridad entre todo lo que compartiste: **una relación que atraviesa un momento de tensión**, donde ciertas dinámicas llevan tiempo operando sin ser nombradas.\n\nLo que describes no es solo un conjunto de problemas a resolver — es un patrón vincular que tiene su propia lógica, su propio lenguaje. Y entenderlo cambia completamente la forma en que se puede intervenir.\n\nA continuación encontrarás un perfil detallado de lo que los datos y tu relato revelan juntos. Cada sección ilumina un aspecto distinto de lo que está ocurriendo en esta relación.',
    aperturaEmpatica: 'Gracias por compartir lo que traes. Aunque no fue posible generar el análisis completo con inteligencia artificial en este momento, lo que describes merece una exploración cuidadosa.\n\nLos patrones que surgen en tus respuestas — tanto en lo que compartiste como en lo que insinuaste sin profundizar — apuntan a dinámicas que vale la pena explorar con cuidado. **Cada relación tiene su propio lenguaje invisible**, y entenderlo es el primer paso para poder elegir de manera más consciente.\n\nEste perfil es una brújula, no un diagnóstico definitivo. Lo que leerás a continuación te dará un primer mapa de tu relación.',
    aperturaEmpaticaPuntos: [
      { titulo: 'Un vínculo bajo presión', texto: 'Las respuestas revelan patrones de tensión acumulada que operan por debajo de lo visible en esta relación.' },
      { titulo: 'Comunicación que necesita profundidad', texto: 'Hay temas que se evitan o se tratan de forma superficial, generando una distancia emocional progresiva.' },
      { titulo: 'Fortalezas reales que sostienen', texto: 'A pesar de los desafíos, existen elementos genuinos de conexión que vale la pena identificar y fortalecer.' }
    ],
    sessionWorkItems: sessionItemsFallback.slice(0, 4),
    sessionWorkItemsPareja: [
      'Mapear cómo cada uno percibe los conflictos no resueltos y qué impide abordarlos juntos',
      'Explorar qué necesita cada uno del otro y si esas necesidades han sido expresadas con claridad',
      'Identificar los patrones de comunicación que se activan en los momentos de mayor tensión'
    ],
    idealizationLevel: actualIdealLevel,
    idealizationScore: actualIdealScore,
    idealizationExplanation: `El nivel de idealización detectado refleja una tendencia a proyectar expectativas elevadas en la pareja o en la relación misma. Este patrón suele surgir cuando se busca en el otro una fuente de completud emocional.\n\nTrabajarlo en sesión permite distinguir entre el amor al otro real — con sus límites y su falta — y el amor al otro idealizado, que inevitablemente genera frustración crónica cuando la realidad no coincide con la imagen proyectada.`,
    lecturaNarrativa: lecturaNarrativa,
    lecturaCuestionario,
    lecturaIntegral,
    areaCorrelations: Object.fromEntries(
      Object.entries(areaScores).map(([key, score]) => {
        const pct = Math.round(((score - 1) / 4) * 100)
        const name = areaNames[key]
        const msg = pct >= 60
          ? `**${name}** muestra un nivel saludable (${pct}%). Los datos sugieren que esta es un área de fortaleza en el vínculo.`
          : `**${name}** obtiene ${pct}%, lo cual indica patrones que merecen atención. En una sesión se puede explorar qué opera detrás de estos indicadores.`
        return [key, msg]
      })
    ),
    correlacionesPrincipales: (() => {
      const s = Object.entries(areaScores).sort((a, b) => b[1] - a[1])
      const top = s[0]; const bot = s[s.length - 1]
      const insights = []
      if (areaScores.comunicacion <= 3.0 && areaScores.conflicto <= 3.0)
        insights.push(`La baja **Comunicación** (${getPercent(areaScores.comunicacion)}%) y los **Conflictos acumulados** (${getPercent(areaScores.conflicto)}%) forman un ciclo que, sin intervención, tiende a profundizarse.`)
      if (areaScores.intimidad <= 2.5 && areaScores.proyecto >= 3.5)
        insights.push(`Que compartan **Proyecto de vida** (${getPercent(areaScores.proyecto)}%) pero la **Intimidad** esté débil (${getPercent(areaScores.intimidad)}%) revela una relación que funciona en lo racional pero necesita reconectar en lo emocional.`)
      if (areaScores.idealizacion <= 2.5 && areaScores.seguridad <= 3.0)
        insights.push(`La alta **Idealización** combinada con baja **Seguridad emocional** (${getPercent(areaScores.seguridad)}%) sugiere que se busca en el otro aquello que se necesita para sentirse completo.`)
      if (insights.length === 0)
        insights.push(`**${areaNames[top[0]]}** (${getPercent(top[1])}%) actúa como factor protector, mientras que **${areaNames[bot[0]]}** (${getPercent(bot[1])}%) es el área que más requiere atención.`)
      return insights.slice(0, 3)
    })(),
    unconsciousPatterns: patterns,
    defenseMechanisms: [
      areaScores.conflicto <= 2.5 ? '**Evitación**: se eluden los temas difíciles como mecanismo para mantener una falsa armonía' : null,
      areaScores.comunicacion <= 2.5 ? '**Supresión emocional**: se callan sentimientos para no generar conflicto ni mostrar vulnerabilidad' : null,
      areaScores.idealizacion <= 2.5 ? '**Idealización**: se mantiene una imagen fantaseada del otro para evitar la desilusión' : null,
      '**Racionalización**: se buscan explicaciones lógicas para justificar dinámicas que son esencialmente emocionales'
    ].filter(Boolean).slice(0, 3),
    riskAreas: Object.entries(areaScores)
      .filter(([, s]) => s <= 2.5)
      .map(([key, s]) => `**${areaNames[key]}** (${Math.round(((s-1)/4)*100)}%): requiere exploración profesional prioritaria`),
    strengthsFound: strengths,
    keyInsight: 'El patrón general sugiere que la relación opera con dinámicas que merecen ser exploradas con mayor profundidad. Los números revelan tendencias; las reflexiones revelan deseos y temores. La sesión profesional es donde ambas dimensiones se encuentran y revelan su significado singular.',
    recommendation: 'Se recomienda una sesión profesional de diagnóstico de pareja para explorar en profundidad los patrones detectados. La sesión permite ir más allá de lo cuantitativo y trabajar con la experiencia subjetiva de cada uno, que es donde realmente operan los cambios.\n\nUn espacio psicoanalítico puede ayudar a distinguir entre lo que se demanda del otro (y que nunca será suficiente) y lo que genuinamente se desea construir juntos.',
    existentialReflection: 'Amar no es encontrar al otro perfecto, sino elegir al otro real — con su falta, con su misterio, con aquello que nunca terminaremos de conocer. El verdadero desafío del amor no es sostener la ilusión, sino sostener la verdad. Y la verdad es que nadie nos completa, nadie nos salva, nadie resuelve nuestra falta. Pero alguien, desde su propia incompletud, puede elegir caminar junto a la nuestra.'
  }
}
