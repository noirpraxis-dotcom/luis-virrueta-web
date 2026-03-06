// ─── SERVICIO DE ANÁLISIS CON DEEPSEEK ────────────────────────────
// ⚠️ SEGURIDAD: En producción, mover esta llamada a un Supabase Edge Function
// o Cloudflare Worker para no exponer la API key en el navegador del cliente.
// Actualmente usa VITE_DEEPSEEK_API_KEY del archivo .env

const DEEPSEEK_API_URL = 'https://api.deepseek.com/chat/completions'

const SYSTEM_PROMPT = `Eres un psicoanalista experto con formación lacaniana, especializado en relaciones de pareja y dinámica vincular.

Tu tarea es generar un DIAGNÓSTICO INTEGRAL cruzando dos fuentes de datos:

FUENTE PRIMARIA — NARRATIVA ABIERTA (15 preguntas conversacionales):
Las preguntas abiertas son el CORAZÓN del diagnóstico. La persona habló como si le platicara a un amigo, revelando patrones sin darse cuenta. Tu trabajo es extraer lo profundo de lo aparentemente simple. Busca:
- Estructura del deseo: ¿qué desea realmente esta persona? ¿Qué le falta?
- Idealización: describir al otro en términos absolutos/perfectos
- Dependencia disfrazada de amor ("sin él/ella no soy nada")
- Proyección: depositar en el otro lo que falta en uno
- Demanda imposible: pedir lo que nadie puede dar
- Mecanismos de defensa: racionalización, negación, evitación, intelectualización, humor defensivo
- Pérdida de autonomía: señales de que se ha desdibujado como individuo
- Patrones de repetición: recrear dinámicas de familia de origen
- Relación con la falta (Lacan: "amar es dar lo que no se tiene a quien no se es")
- Alexitimia/evitación: "no sé" como dato significativo — indica dificultad para conectar con emociones

FUENTE CONFIRMATORIA — DATOS CUANTITATIVOS (25 afirmaciones Likert):
Los datos cuantitativos CORROBORAN o CONTRADICEN lo que la narrativa reveló. Tu trabajo es cruzar:
- Si la narrativa dice "todo está bien" pero los números muestran áreas bajas → detectar defensa/negación
- Si la narrativa muestra sufrimiento pero los números son altos → posible racionalización o desconexión
- Si ambos coinciden → mayor confianza en el patrón detectado

Genera TRES LECTURAS SEPARADAS más correlaciones por área:

LECTURA 1 — ANÁLISIS NARRATIVO (fuente primaria): Qué revelan las palabras de la persona. Estructura del deseo, patrones inconscientes, mecanismos de defensa extraídos de sus respuestas conversacionales.

LECTURA 2 — PERFIL CUANTITATIVO (fuente confirmatoria): Qué dicen los números. Pero siempre en relación con la narrativa: "los datos corroboran que..." o "los datos contradicen lo que la persona expresó en..."

LECTURA 3 — LECTURA INTEGRAL (cruce): Donde ambas fuentes se encuentran. Coherencias, contradicciones reveladoras, la historia profunda que emerge al cruzar lo dicho con lo medido.

Principios:
- La narrativa es la fuente PRIMARIA, los datos son CONFIRMATORIOS
- Detectar patrones de idealización, necesidad vs. deseo, búsqueda de completud
- Identificar mecanismos de defensa específicos
- Señalar patrones inconscientes (demanda, goce, repetición)
- Resolver hacia la SUBJETIVIDAD, no hacia el diagnóstico frío
- Ser empático pero honesto, sin juicio moral
- Usar lenguaje accesible pero con profundidad psicoanalítica
- NO dar diagnósticos clínicos, esto es orientativo
- Para cada área del radar, explicar POR QUÉ tiene esa puntuación citando evidencia narrativa + cuantitativa

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
  const areaCorrelationsSchema = areaKeys.map(k => `"${k}": "(1-2 párrafos: por qué esta área tiene esta puntuación. Cita evidencia CONCRETA de las respuestas narrativas + datos cuantitativos. Ejemplo: 'En comunicación obtuviste 45% porque mencionaste que evitas ciertos temas, y los datos confirman...')"`).join(',\n    ')

  prompt += `\nGenera tu análisis psicoanalítico en el siguiente formato JSON exacto:
{
  "lecturaNarrativa": "(3-4 párrafos: análisis PROFUNDO de las respuestas narrativas. Esta es la lectura PRIMARIA. Extrae estructura del deseo, mecanismos de defensa, patrones de repetición, idealización, pérdida de autonomía. Referencia las respuestas específicas de la persona)",
  "lecturaCuestionario": "(2-3 párrafos: qué dicen los datos cuantitativos, SIEMPRE en relación con la narrativa. Usa frases como 'los datos corroboran que...', 'esto confirma lo que expresó cuando dijo...', o 'contradice lo que mencionó sobre...')",
  "lecturaIntegral": "(3-4 párrafos: cruce de ambas fuentes. Coherencias y contradicciones reveladoras. La historia profunda que emerge. Si la persona dijo 'todo está bien' pero los números muestran otra cosa, analiza la defensa)",
  "areaCorrelations": {
    ${areaCorrelationsSchema}
  },
  "idealizationLevel": "alto" o "medio" o "bajo",
  "idealizationScore": (número entero 0-100 donde 100 = máxima idealización problemática),
  "unconsciousPatterns": ["patrón 1", "patrón 2", "patrón 3", "patrón 4"],
  "defenseMechanisms": ["mecanismo de defensa 1 detectado con breve explicación", "mecanismo 2", "mecanismo 3"],
  "strengthsFound": ["fortaleza 1", "fortaleza 2", "fortaleza 3"],
  "riskAreas": ["área de riesgo 1 con breve explicación", "área de riesgo 2"],
  "keyInsight": "(1 párrafo con la observación psicoanalítica más reveladora — debe conectar narrativa con datos)",
  "recommendation": "(1-2 párrafos con recomendación profesional personalizada basada en lo que la persona contó)",
  "existentialReflection": "(1 párrafo poético/filosófico sobre el amor y el deseo en esta relación específica)"
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
        max_tokens: 5000,
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

  const patterns = []
  if (areaScores.comunicacion <= 2.5) patterns.push('Dificultad para expresar necesidades emocionales profundas')
  if (areaScores.intimidad <= 2.5) patterns.push('Distanciamiento emocional como mecanismo de protección')
  if (areaScores.conflicto <= 2.5) patterns.push('Evitación de conflictos que genera acumulación de resentimiento')
  if (areaScores.idealizacion <= 2.5) patterns.push('Tendencia a idealizar al otro como fuente de completud')
  if (areaScores.autonomia <= 2.5) patterns.push('Desdibujamiento de límites individuales dentro de la relación')
  if (areaScores.seguridad <= 2.5) patterns.push('Inseguridad vincular que genera demanda excesiva')
  if (patterns.length === 0) patterns.push('Patrones vinculares relativamente saludables con espacio para profundizar')

  const strengths = []
  if (areaScores.comunicacion >= 3.5) strengths.push('Capacidad de diálogo y escucha activa')
  if (areaScores.admiracion >= 3.5) strengths.push('Reconocimiento genuino del valor del otro')
  if (areaScores.proyecto >= 3.5) strengths.push('Visión compartida de futuro')
  if (areaScores.autonomia >= 3.5) strengths.push('Respeto por la individualidad dentro del vínculo')
  if (areaScores.idealizacion >= 3.5) strengths.push('Capacidad de amar al otro real, no al idealizado')
  if (strengths.length === 0) strengths.push('Disposición para explorar la relación a mayor profundidad')

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
    idealizationLevel: actualIdealLevel,
    idealizationScore: actualIdealScore,
    lecturaNarrativa: lecturaNarrativa,
    lecturaCuestionario,
    lecturaIntegral,
    areaCorrelations: Object.fromEntries(
      Object.entries(areaScores).map(([key, score]) => {
        const pct = Math.round(((score - 1) / 4) * 100)
        const name = areaNames[key]
        const msg = pct >= 60
          ? `${name} muestra un nivel saludable (${pct}%). Los datos cuantitativos sugieren que esta es un área de fortaleza en el vínculo.`
          : `${name} obtiene ${pct}%, lo cual indica patrones que merecen atención. En una sesión profesional se puede explorar qué opera debajo de estos indicadores.`
        return [key, msg]
      })
    ),
    unconsciousPatterns: patterns,
    defenseMechanisms: [
      areaScores.conflicto <= 2.5 ? 'Evitación: se eluden temas difíciles como mecanismo para mantener una falsa armonía' : null,
      areaScores.comunicacion <= 2.5 ? 'Supresión emocional: se callan sentimientos para no generar conflicto' : null,
      areaScores.idealizacion <= 2.5 ? 'Idealización: se mantiene una imagen fantaseada del otro para evitar la desilusión' : null,
      'Racionalización: se buscan explicaciones lógicas para justificar dinámicas emocionales'
    ].filter(Boolean).slice(0, 3),
    riskAreas: Object.entries(areaScores)
      .filter(([, s]) => s <= 2.5)
      .map(([key, s]) => `${areaNames[key]} (${Math.round(((s-1)/4)*100)}%): requiere atención profesional`),
    strengthsFound: strengths,
    keyInsight: 'El patrón general sugiere que la relación opera con dinámicas que merecen ser exploradas con mayor profundidad. Los números revelan tendencias; las reflexiones revelan deseos y temores. La sesión profesional es donde ambas dimensiones se encuentran y revelan su significado singular.',
    recommendation: 'Se recomienda una sesión profesional de diagnóstico de pareja para explorar en profundidad los patrones detectados. La sesión permite ir más allá de lo cuantitativo y trabajar con la experiencia subjetiva de cada uno, que es donde realmente operan los cambios.\n\nUn espacio psicoanalítico puede ayudar a distinguir entre lo que se demanda del otro (y que nunca será suficiente) y lo que genuinamente se desea construir juntos.',
    existentialReflection: 'Amar no es encontrar al otro perfecto, sino elegir al otro real — con su falta, con su misterio, con aquello que nunca terminaremos de conocer. El verdadero desafío del amor no es sostener la ilusión, sino sostener la verdad. Y la verdad es que nadie nos completa, nadie nos salva, nadie resuelve nuestra falta. Pero alguien, desde su propia incompletud, puede elegir caminar junto a la nuestra.'
  }
}
