// ─── SERVICIO DE ANÁLISIS CON DEEPSEEK ────────────────────────────
// ⚠️ SEGURIDAD: En producción, mover esta llamada a un Supabase Edge Function
// o Cloudflare Worker para no exponer la API key en el navegador del cliente.
// Actualmente usa VITE_DEEPSEEK_API_KEY del archivo .env

const DEEPSEEK_API_URL = 'https://api.deepseek.com/chat/completions'

const SYSTEM_PROMPT = `Eres un psicoanalista experto con formación lacaniana, especializado en relaciones de pareja y dinámica vincular.

Tu tarea es analizar los resultados de un diagnóstico de relación que incluye:
1. Puntuaciones cuantitativas en 8 áreas psicológicas
2. Respuestas a preguntas filosóficas profundas sobre el amor, el deseo y la falta

Tu análisis debe:
- Detectar patrones de idealización (esperar que el otro te complete, proyectar cualidades fantaseadas)
- Distinguir entre necesidad y deseo genuino. Recordar que según Lacan, "amar es dar lo que no se tiene a quien no se es": el amor auténtico opera desde la falta asumida, no desde la demanda de completud.
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
  "idealizationLevel": "alto" o "medio" o "bajo",
  "idealizationScore": (número entero 0-100 donde 100 = máxima idealización problemática),
  "idealizationAnalysis": "(2-3 párrafos analizando el nivel de idealización detectado, con referencias a patrones específicos de las respuestas)",
  "needVsDesire": "(2 párrafos sobre la dinámica necesidad vs deseo en esta relación específica)",
  "completionSeeking": "(1-2 párrafos sobre si se busca completud en el otro y cómo se manifiesta)",
  "unconsciousPatterns": ["patrón 1", "patrón 2", "patrón 3"],
  "strengthsFound": ["fortaleza 1", "fortaleza 2"],
  "keyInsight": "(1 párrafo con la observación psicoanalítica más reveladora)",
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
  // Score alto = sano (poca idealización). Invertimos para display: bajo idealPct = alta idealización
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

  return {
    idealizationLevel: actualIdealLevel,
    idealizationScore: actualIdealScore,
    idealizationAnalysis: actualIdealLevel === 'alto'
      ? 'Los resultados sugieren un nivel significativo de idealización en la relación. Esto puede manifestarse como la expectativa de que la pareja complete aquello que se percibe como faltante en uno mismo. Desde una perspectiva psicoanalítica, esta dinámica revela una relación con la "falta" que busca resolverse en el otro, en lugar de ser reconocida como parte constitutiva del sujeto.\n\nLa idealización opera como un velo que impide ver al otro en su dimensión real. Cuando ese velo inevitablemente cae — y siempre cae — la desilusión puede ser devastadora, no porque el otro haya fallado, sino porque la imagen proyectada era insostenible desde el inicio.'
      : actualIdealLevel === 'medio'
        ? 'Se detecta un nivel moderado de idealización. Existe cierta tendencia a proyectar expectativas en la pareja, aunque también hay conciencia de que el otro es una persona real con sus propias limitaciones. El trabajo consistiría en distinguir más claramente entre lo que se desea y lo que se necesita.\n\nEste nivel de idealización es común y no necesariamente patológico, pero invita a preguntarse: ¿qué parte de lo que busco en mi pareja tiene que ver con ella, y qué parte tiene que ver con lo que me falta a mí?'
        : 'Los indicadores muestran un nivel saludable de aceptación del otro tal como es. La relación parece basarse más en la elección consciente que en la idealización, lo cual es un fundamento sólido para el vínculo.\n\nEsto sugiere una capacidad de sostener la falta sin depositarla en el otro, lo cual, desde la perspectiva lacaniana, es la base del amor genuino.',
    needVsDesire: 'La distinción entre necesitar y desear al otro es fundamental en toda relación. Cuando predomina la necesidad, el vínculo se convierte en dependencia disfrazada de amor; cuando predomina el deseo, el amor es una elección renovada que no busca completar sino acompañar.\n\nComo señala Lacan, el deseo siempre apunta más allá de cualquier objeto concreto. La pregunta no es si necesitas a tu pareja, sino si puedes estar sin ella y aún así elegirla.',
    completionSeeking: areaScores.idealizacion <= 3.0
      ? 'Se detectan indicios de búsqueda de completud en el otro. El sujeto siempre está marcado por una falta constitutiva que ninguna relación puede resolver. Reconocer esta falta no como un problema sino como aquello que posibilita el deseo genuino puede transformar radicalmente la experiencia vincular.\n\nBuscar que el otro te complete es, paradójicamente, la mejor manera de garantizar la frustración. Porque el otro también tiene su propia falta, y dos vacíos no suman plenitud.'
      : 'La relación muestra señales de madurez respecto a la aceptación de que el otro no es responsable de completar lo que falta. Esto permite un vínculo basado en el deseo más que en la carencia.',
    unconsciousPatterns: patterns,
    strengthsFound: strengths,
    keyInsight: 'El patrón general sugiere que la relación opera con dinámicas que merecen ser exploradas con mayor profundidad. Los números revelan tendencias; una conversación psicoanalítica revelaría su significado singular. La pregunta más importante no es "¿funciona esta relación?" sino "¿qué tipo de relación con el deseo opera en cada uno de ustedes?"',
    recommendation: 'Se recomienda una sesión profesional de diagnóstico de pareja para explorar en profundidad los patrones detectados. La sesión permite ir más allá de lo cuantitativo y trabajar con la experiencia subjetiva de cada uno, que es donde realmente operan los cambios.\n\nUn espacio psicoanalítico puede ayudar a distinguir entre lo que se demanda del otro (y que nunca será suficiente) y lo que genuinamente se desea construir juntos.',
    existentialReflection: 'Amar no es encontrar al otro perfecto, sino elegir al otro real — con su falta, con su misterio, con aquello que nunca terminaremos de conocer. El verdadero desafío del amor no es sostener la ilusión, sino sostener la verdad. Y la verdad es que nadie nos completa, nadie nos salva, nadie resuelve nuestra falta. Pero alguien, desde su propia incompletud, puede elegir caminar junto a la nuestra.'
  }
}
