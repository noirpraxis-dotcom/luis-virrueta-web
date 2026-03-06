// ─── SERVICIO DE ANÁLISIS CON DEEPSEEK ────────────────────────────
// ⚠️ SEGURIDAD: En producción, mover esta llamada a un Supabase Edge Function
// o Cloudflare Worker para no exponer la API key en el navegador del cliente.
// Actualmente usa VITE_DEEPSEEK_API_KEY del archivo .env

const DEEPSEEK_API_URL = 'https://api.deepseek.com/chat/completions'

const SYSTEM_PROMPT = `Eres un psicoanalista experto con formación lacaniana, especializado en relaciones de pareja y dinámica vincular.

Tu tarea es generar TRES LECTURAS SEPARADAS a partir de un diagnóstico de relación:

LECTURA 1 — PERFIL DEL CUESTIONARIO: Análisis de las puntuaciones cuantitativas en 8 áreas psicológicas. Interpreta qué revelan los números sobre la dinámica vincular real: áreas fuertes, áreas en riesgo, combinaciones problemáticas, y qué patrones se pueden inferir solo de los datos cuantitativos.

LECTURA 2 — PERFIL INCONSCIENTE: Análisis de las respuestas abiertas/filosóficas. Aquí es donde detectas los patrones profundos: idealización, necesidad vs. deseo, búsqueda de completud, proyección, demanda, goce, repetición. Recuerda que según Lacan, "amar es dar lo que no se tiene a quien no se es": el amor auténtico opera desde la falta asumida, no desde la demanda de completud.

LECTURA 3 — LECTURA INTEGRAL: Cruce de ambas fuentes. Conecta lo que dicen los números con lo que revelan las palabras. ¿Son coherentes o hay contradicciones reveladoras? ¿Qué historia emerge cuando se leen los datos junto con las reflexiones personales?

Principios:
- Detectar patrones de idealización (esperar que el otro te complete, proyectar cualidades fantaseadas)
- Distinguir entre necesidad y deseo genuino
- Identificar si se busca en el otro aquello que falta en uno mismo
- Señalar patrones inconscientes que operan en la relación (demanda, goce, repetición)
- Ser empático pero honesto, sin juicio moral
- Usar lenguaje accesible pero con profundidad psicoanalítica
- NO dar diagnósticos clínicos, esto es orientativo

IMPORTANTE: Responde EXCLUSIVAMENTE en formato JSON válido con la estructura solicitada.`

function buildPrompt(areaScores, areaLabels, philosophicalAnswers, philosophicalQuestions) {
  let prompt = '## RESULTADOS CUANTITATIVOS (escala 1-5, donde 5 es óptimo):\n\n'

  for (const [key, score] of Object.entries(areaScores)) {
    const label = areaLabels[key] || key
    const pct = Math.round(((score - 1) / 4) * 100)
    prompt += `- ${label}: ${score.toFixed(1)}/5 (${pct}%)\n`
  }

  prompt += '\n## RESPUESTAS A PREGUNTAS FILOSÓFICAS PROFUNDAS:\n\n'

  for (let i = 0; i < philosophicalQuestions.length; i++) {
    const answer = philosophicalAnswers[i]
    if (answer && answer.trim()) {
      prompt += `**Pregunta:** "${philosophicalQuestions[i].text}"\n**Respuesta:** "${answer.trim()}"\n\n`
    }
  }

  prompt += `\nGenera tu análisis psicoanalítico en el siguiente formato JSON exacto:
{
  "lecturaCuestionario": "(3-4 párrafos: análisis profundo de lo que revelan las puntuaciones cuantitativas. Interpreta cada área relevante, señala combinaciones problemáticas, identifica fortalezas y riesgos)",
  "lecturaInconsciente": "(3-4 párrafos: análisis de las respuestas filosóficas. Detecta los patrones de idealización, necesidad vs deseo, completud, proyección. Referencia las respuestas específicas del usuario)",
  "lecturaIntegral": "(3-4 párrafos: cruce de ambas fuentes. Conecta lo cuantitativo con lo cualitativo. Señala coherencias, contradicciones reveladoras, y la historia profunda que emerge al leer todo junto)",
  "idealizationLevel": "alto" o "medio" o "bajo",
  "idealizationScore": (número entero 0-100 donde 100 = máxima idealización problemática),
  "unconsciousPatterns": ["patrón 1", "patrón 2", "patrón 3", "patrón 4"],
  "strengthsFound": ["fortaleza 1", "fortaleza 2", "fortaleza 3"],
  "keyInsight": "(1 párrafo con la observación psicoanalítica más reveladora de todo el análisis)",
  "recommendation": "(1-2 párrafos con recomendación profesional personalizada)",
  "existentialReflection": "(1 párrafo poético/filosófico sobre el amor y el deseo en esta relación específica)"
}`

  return prompt
}

export async function analyzeRelationship({ areaScores, areaLabels, philosophicalAnswers, philosophicalQuestions }) {
  const apiKey = import.meta.env.VITE_DEEPSEEK_API_KEY

  if (!apiKey) {
    console.warn('⚠️ VITE_DEEPSEEK_API_KEY no configurada. Usando análisis de respaldo.')
    return generateFallbackAnalysis(areaScores)
  }

  const prompt = buildPrompt(areaScores, areaLabels, philosophicalAnswers, philosophicalQuestions)

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
        max_tokens: 2500,
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

  // Generar las 3 lecturas basadas en reglas
  const areaNames = { comunicacion: 'Comunicación', intimidad: 'Intimidad', admiracion: 'Admiración', conflicto: 'Conflictos', proyecto: 'Proyecto de vida', seguridad: 'Seguridad emocional', autonomia: 'Autonomía', idealizacion: 'Idealización' }
  const sorted = Object.entries(areaScores).sort((a, b) => b[1] - a[1])
  const strongest = sorted[0]
  const weakest = sorted[sorted.length - 1]

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

  let lecturaInconsciente = actualIdealLevel === 'alto'
    ? 'Las reflexiones filosóficas revelan un nivel significativo de idealización. Se percibe al otro como fuente de completud, como aquello que podría resolver una falta que, desde la perspectiva psicoanalítica, es constitutiva del sujeto. La idealización opera como un velo que impide ver al otro en su dimensión real.\n\nLa distinción entre necesidad y deseo es fundamental aquí. Cuando predomina la necesidad, el vínculo se convierte en dependencia disfrazada de amor. El verdadero acto de amor no es necesitar al otro, sino poder estar sin él y aún así elegirlo.\n\nSe detectan indicios de búsqueda de completud: la expectativa de que el otro llene vacíos que son anteriores a la relación misma. Reconocer esta falta no como un problema sino como aquello que posibilita el deseo genuino puede transformar radicalmente la experiencia vincular.'
    : actualIdealLevel === 'medio'
      ? 'Las respuestas revelan una tensión interesante entre la conciencia de que el otro es una persona real (con limitaciones) y una esperanza subterránea de que la relación resuelva algo más profundo. Este nivel de idealización es habitual y no necesariamente patológico.\n\nLa pregunta central que emerge es: ¿qué parte de lo que busco en mi pareja tiene que ver con ella, y qué parte tiene que ver con lo que me falta a mí? Esta distinción es la llave para transitar de una relación basada en la demanda a una basada en el deseo.\n\nExiste espacio para fortalecer la capacidad de sostener la falta sin depositarla en el otro, lo cual es la base del amor genuino según la perspectiva lacaniana.'
      : 'Las respuestas muestran una relación relativamente madura con la falta. Hay conciencia de que el otro no es responsable de completar lo que falta en uno mismo, lo cual es un fundamento sólido.\n\nEsto sugiere una capacidad de amar desde la elección consciente más que desde la necesidad, lo cual permite un vínculo más libre y menos cargado de demandas imposibles.\n\nEl trabajo futuro podría centrarse en profundizar esta conciencia y explorar los momentos donde, inevitablemente, la idealización reaparece — porque nunca desaparece del todo.'

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
    lecturaCuestionario,
    lecturaInconsciente,
    lecturaIntegral,
    unconsciousPatterns: patterns,
    strengthsFound: strengths,
    keyInsight: 'El patrón general sugiere que la relación opera con dinámicas que merecen ser exploradas con mayor profundidad. Los números revelan tendencias; las reflexiones revelan deseos y temores. La sesión profesional es donde ambas dimensiones se encuentran y revelan su significado singular.',
    recommendation: 'Se recomienda una sesión profesional de diagnóstico de pareja para explorar en profundidad los patrones detectados. La sesión permite ir más allá de lo cuantitativo y trabajar con la experiencia subjetiva de cada uno, que es donde realmente operan los cambios.\n\nUn espacio psicoanalítico puede ayudar a distinguir entre lo que se demanda del otro (y que nunca será suficiente) y lo que genuinamente se desea construir juntos.',
    existentialReflection: 'Amar no es encontrar al otro perfecto, sino elegir al otro real — con su falta, con su misterio, con aquello que nunca terminaremos de conocer. El verdadero desafío del amor no es sostener la ilusión, sino sostener la verdad. Y la verdad es que nadie nos completa, nadie nos salva, nadie resuelve nuestra falta. Pero alguien, desde su propia incompletud, puede elegir caminar junto a la nuestra.'
  }
}
