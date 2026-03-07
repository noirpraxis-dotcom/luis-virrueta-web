// ─── SERVICIO DE ANÁLISIS CON DEEPSEEK ────────────────────────────
// ⚠️ SEGURIDAD: En producción, mover esta llamada a un Supabase Edge Function
// o Cloudflare Worker para no exponer la API key en el navegador del cliente.
// Actualmente usa VITE_DEEPSEEK_API_KEY del archivo .env

const DEEPSEEK_API_URL = 'https://api.deepseek.com/chat/completions'

const SYSTEM_PROMPT = `Eres un psicólogo especialista en relaciones de pareja con enfoque profundo en dinámicas vinculares y patrones de comportamiento en el vínculo amoroso.

Tu tarea es generar un diagnóstico integral cruzando TRES fuentes de datos:

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

FUENTE PROYECTIVA — RESPUESTAS FLASH (10 preguntas sin filtro racional):
Frases completadas en segundos + elecciones forzadas. Aquí aparece lo inconsciente sin censura.
- Interpreta las frases completadas de forma proyectiva: el sujeto proyecta su mundo interno
- Las elecciones forzadas revelan la estructura real del vínculo (quién cede, qué prefiere, qué teme)
- Busca coherencia o contradicción con las otras dos fuentes
- SIEMPRE cita las frases completadas textualmente entre comillas en lecturaFlash

INSTRUCCIONES CRÍTICAS:
1. CITA PALABRAS EXACTAS: siempre que puedas, incluye frases literales de las respuestas entre comillas. Ej: «cuando dijiste "no sé cómo explicarlo pero algo cambió"...»
2. USA **NEGRITA**: marca con **dobles asteriscos** los conceptos clave y observaciones centrales para destacarlos visualmente.
3. LENGUAJE ACCESIBLE: cálido, humano, sin jerga técnica ni términos académicos. Escribe como un psicólogo que habla directamente con la persona, no como un manual clínico.
4. SÉ ESPECÍFICO: cada observación debe poder ser reconocida como "esto es exactamente lo que yo dije y lo que yo vivo".
5. APERTURA EMPÁTICA PRIMERO: lo primero que la persona leerá debe hacerla sentir profundamente comprendida — valida su experiencia, cita sus palabras, ve el ser humano antes que el patrón.

Para cada área del diagnóstico, explica POR QUÉ tiene esa puntuación citando evidencia concreta de las respuestas.

IMPORTANTE: Responde EXCLUSIVAMENTE en formato JSON válido con la estructura solicitada.`

function buildPrompt(areaLabels, philosophicalAnswers, philosophicalQuestions, flashAnswers, flashQuestions) {
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

  // FLASH PROJECTIVE DATA — second source
  if (flashQuestions && flashQuestions.length > 0 && flashAnswers && Object.keys(flashAnswers).length > 0) {
    prompt += '\n## FUENTE PROYECTIVA: RESPUESTAS FLASH\n'
    prompt += '(Respondidas en segundos, sin filtro racional. Aquí aparece lo inconsciente sin censura.)\n\n'

    const complete = flashQuestions.filter(q => q.type === 'complete')
    const choice = flashQuestions.filter(q => q.type === 'choice')

    if (complete.length > 0) {
      prompt += 'Completar frases:\n'
      for (const q of complete) {
        const answer = flashAnswers[q.id]
        if (answer && answer.trim()) {
          prompt += `- "${q.stem}..." → "${answer.trim()}"\n`
        } else {
          prompt += `- "${q.stem}..." → (no completó)\n`
        }
      }
      prompt += '\n'
    }

    if (choice.length > 0) {
      prompt += 'Elecciones:\n'
      for (const q of choice) {
        const answer = flashAnswers[q.id]
        prompt += `- ${q.text} → ${answer ? `"${answer}"` : '(no respondió)'}\n`
      }
      prompt += '\n'
    }
  }

  const areaKeys = Object.keys(areaLabels)
  const areaCorrelationsSchema = areaKeys.map(k => `"${k}": "(1-2 párrafos profundos. Explica POR QUÉ esta área tiene esa puntuación. CITA PALABRAS EXACTAS de las respuestas donde sea posible.)"`).join(',\n    ')
  const dimensionScoresSchema = areaKeys.map(k => `"${k}": "(número entero 0-100)"`).join(',\n    ')

  prompt += `\nGenera tu análisis psicológico en el siguiente formato JSON exacto:
{
  "dimensionScores": {
    ${dimensionScoresSchema}
  },
  "diagnosticoNarrado": "(2-3 párrafos. Captura el núcleo del conflicto. Habla directamente a la persona: cálido, íntimo, sin términos clínicos. CITA sus palabras exactas entre comillas. **Usa negrita** en frases importantes. Nunca uses el término diagnóstico.)",
  "aperturaEmpatica": "(2-3 párrafos. Haz que la persona se sienta profundamente escuchada ANTES de cualquier análisis. CITA sus palabras exactas en la primera frase. **Usa negrita** para conceptos importantes. Sin tecnicismos.)",
  "aperturaEmpaticaPuntos": [{"titulo": "Palabra o frase clave (3-6 palabras)", "texto": "1-2 oraciones explorando este hallazgo, citando palabras exactas."}, {"titulo": "Segundo hallazgo clave", "texto": "descripción..."}, {"titulo": "Tercer hallazgo", "texto": "descripción..."}, {"titulo": "Cuarto hallazgo (opcional)", "texto": "descripción..."}],
  "perfilIndividual": "(2 párrafos enfocados en LA PERSONA, no en la pareja. Qué patrones trae ELLA a la relación, qué busca en el otro que en realidad necesita encontrar en sí misma. Comienza con algo como 'Algo que aparece claramente en todo lo que compartiste es...' o 'Independientemente de cómo sea tu pareja...'. Cita sus palabras. **Usa negrita**. Sin tecnicismos.)",
  "perfilVinculo": "(2 párrafos sobre la DINÁMICA ENTRE LOS DOS. La interacción que emerge. Cómo se retroalimentan mutuamente estos patrones. Qué ciclo han creado juntos. Cita evidencia concreta de las respuestas. **Usa negrita**.)",
  "configuracionDeseo": "(1-2 párrafos en lenguaje muy accesible: qué tipo de amor/vínculo busca esta persona específica. Qué necesidad emocional fundamental opera detrás de su elección amorosa. Sin términos técnicos — es la lectura más personal y directa del análisis. Ej: 'Lo que buscas en una relación es...' o 'Debajo de lo que describes hay una necesidad de...')",
  "lecturaFlash": "(2 párrafos. Análisis de las respuestas proyectivas flash. Cita las frases completadas textualmente entre comillas. Interpreta las elecciones en contexto del perfil completo. Busca la coherencia o contradicción con lo que dijo en las narrativas. Ej: 'Lo primero que dijiste sin pensar fue \\"[frase]\\" — eso tiene más información de lo que parece...')",
  "lecturaNarrativa": "(3-4 párrafos: análisis PROFUNDO de las respuestas narrativas. Extrae patrones de comportamiento, tendencias relacionales, pérdida de autonomía. **Cita palabras exactas** entre comillas. **Usa negrita** para conceptos clave. Evita jerga técnica.)",
  "lecturaIntegral": "(3-4 párrafos: síntesis de ambas fuentes. La historia que emerge al cruzar lo dicho y lo proyectado. Escrito como recomendación profesional directa. **Usa negrita** en las observaciones más importantes. Cierra con una frase que oriente hacia la sesión.)",
  "areaCorrelations": {
    ${areaCorrelationsSchema}
  },
  "correlacionesPrincipales": ["(1-2 oraciones: la conexión más reveladora entre dos o más áreas. **Usa negrita** para nombres de áreas.)", "(segunda conexión importante)", "(tercera — opcional)"],
  "idealizationLevel": "alto" o "medio" o "bajo",
  "idealizationScore": (número entero 0-100 donde 100 = máxima idealización problemática),
  "idealizationExplanation": "(2 párrafos sobre POR QUÉ esta persona tiene ESTE nivel de idealización. Cita sus palabras exactas. NO genérico. Explica qué necesidad emocional opera detrás.)",
  "unconsciousPatterns": ["**PatrónClave**: descripción accesible y específica de cómo aparece en esta persona", "**Patrón2**: descripción", "**Patrón3**: descripción", "**Patrón4 (opcional)**: descripción"],
  "defenseMechanisms": ["**NombreMecanismo**: descripción de cómo aparece específicamente en esta persona", "**Mecanismo2**: descripción", "**Mecanismo3 (opcional)**: descripción"],
  "strengthsFound": ["**NombreFortaleza**: descripción específica basada en lo que la persona dijo", "**Fortaleza2**: descripción", "**Fortaleza3**: descripción"],
  "riskAreas": ["**ÁreaEnRiesgo**: explicación accesible de por qué representa un riesgo en este caso", "**Riesgo2**: descripción"],
  "keyInsight": "(1 párrafo con la observación más reveladora)",
  "recommendation": "(1-2 párrafos con recomendación profesional personalizada)",
  "sessionWorkItems": ["**TemaIndividual1**: descripción concreta y específica para sesión individual — basado en algo que ESTA persona dijo", "**Tema2**: descripción", "**Tema3**: descripción", "**Tema4 (opcional)**: descripción"],
  "sessionWorkItemsPareja": ["**TemaPareja1**: descripción concreta de lo que se trabajaría si la pareja viene junta", "**Tema2**: descripción", "**Tema3 (opcional)**: descripción"]
}`

  return prompt
}

export async function analyzeRelationship({ areaLabels, philosophicalAnswers, philosophicalQuestions, flashAnswers, flashQuestions }) {
  const apiKey = import.meta.env.VITE_DEEPSEEK_API_KEY

  if (!apiKey) {
    console.warn('⚠️ VITE_DEEPSEEK_API_KEY no configurada. Usando análisis de respaldo.')
    return generateFallbackAnalysis()
  }

  const prompt = buildPrompt(areaLabels, philosophicalAnswers, philosophicalQuestions, flashAnswers || {}, flashQuestions || [])

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
        max_tokens: 8000,
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
    return generateFallbackAnalysis()
  }
}

function generateFallbackAnalysis() {
  const defaultScores = { comunicacion: 55, intimidad: 50, admiracion: 60, conflicto: 45, proyecto: 55, seguridad: 50, autonomia: 60, idealizacion: 45 }
  const areaNames = { comunicacion: 'Comunicación', intimidad: 'Intimidad', admiracion: 'Admiración', conflicto: 'Conflictos', proyecto: 'Proyecto de vida', seguridad: 'Seguridad emocional', autonomia: 'Autonomía', idealizacion: 'Idealización' }

  return {
    dimensionScores: defaultScores,
    diagnosticoNarrado: 'Hay algo que se percibe con claridad entre todo lo que compartiste: **una relación que atraviesa un momento de tensión**, donde ciertas dinámicas llevan tiempo operando sin ser nombradas.\n\nLo que describes no es solo un conjunto de problemas a resolver — es un patrón vincular que tiene su propia lógica, su propio lenguaje. Y entenderlo cambia completamente la forma en que se puede intervenir.',
    aperturaEmpatica: 'Gracias por compartir lo que traes. Aunque no fue posible generar el análisis completo con inteligencia artificial en este momento, lo que describes merece una exploración cuidadosa.\n\n**Cada relación tiene su propio lenguaje invisible**, y entenderlo es el primer paso para poder elegir de manera más consciente.\n\nEste perfil es una brújula, no un diagnóstico definitivo.',
    aperturaEmpaticaPuntos: [
      { titulo: 'Un vínculo bajo presión', texto: 'Las respuestas revelan patrones de tensión acumulada que operan por debajo de lo visible en esta relación.' },
      { titulo: 'Comunicación que necesita profundidad', texto: 'Hay temas que se evitan o se tratan de forma superficial, generando una distancia emocional progresiva.' },
      { titulo: 'Fortalezas reales que sostienen', texto: 'A pesar de los desafíos, existen elementos genuinos de conexión que vale la pena identificar y fortalecer.' }
    ],
    perfilIndividual: 'Independientemente de cómo sea tu pareja, lo que tus respuestas revelan es un patrón que tú traes a la relación: **una tendencia a buscar en el vínculo amoroso algo que va más allá del amor mismo**.\n\nEsto no es un defecto. Es una estructura muy humana. Pero cuando no se ve, suele generar ciclos difíciles de romper.',
    perfilVinculo: 'La dinámica entre los dos tiene su propia lógica. Lo que emerge es un **patrón relacional donde las necesidades emocionales de cada uno no siempre coinciden**, generando momentos de conexión genuina alternados con distancia o tensión.\n\nEste ciclo requiere entender qué función cumple cada uno en la dinámica del otro — y eso es exactamente lo que se explora en una sesión profesional.',
    configuracionDeseo: 'Lo que buscas en una relación es, fundamentalmente, **un lugar donde ser visto y elegido tal como eres**. Debajo de lo que describes hay una necesidad de amor que no ponga condiciones.\n\nLa pregunta que vale la pena explorar es: ¿en qué momento ese deseo de ser elegido se convierte en una dependencia de la validación del otro?',
    lecturaFlash: 'Las respuestas instantáneas confirman una parte de lo que ya aparecía en las preguntas abiertas: **hay una tensión entre lo que quieres que sea la relación y lo que la relación realmente es**.\n\nLas elecciones que hiciste apuntan hacia una estructura donde el miedo a la pérdida opera silenciosamente detrás de muchas decisiones cotidianas.',
    lecturaNarrativa: 'No fue posible procesar las respuestas narrativas con la inteligencia artificial en este momento.\n\nLas respuestas abiertas que compartiste contienen información valiosa sobre tus patrones vinculares, mecanismos de defensa y estructura del deseo. En una sesión profesional, estos elementos se analizan en profundidad.',
    lecturaIntegral: 'Los patrones detectados no son defectos a corregir, sino dinámicas a comprender. Cada relación construye su propio lenguaje inconsciente, y descifrarlo es el primer paso para transformarlo.\n\nLa pregunta más importante no es "¿funciona esta relación?" sino "¿qué tipo de relación con el deseo opera en cada uno de ustedes?" La sesión profesional es donde estas dimensiones se encuentran y revelan su significado singular.',
    sessionWorkItems: [
      'Explorar qué temas se evitan en la conversación y por qué se sienten peligrosos',
      'Identificar en qué momento se fue interrumpiendo la conexión emocional profunda',
      'Explorar cómo se mantiene (o se ha ido perdiendo) la identidad individual dentro de la relación'
    ],
    sessionWorkItemsPareja: [
      'Mapear cómo cada uno percibe los conflictos no resueltos y qué impide abordarlos juntos',
      'Explorar qué necesita cada uno del otro y si esas necesidades han sido expresadas con claridad',
      'Identificar los patrones de comunicación que se activan en los momentos de mayor tensión'
    ],
    idealizationLevel: 'medio',
    idealizationScore: 55,
    idealizationExplanation: 'El nivel de idealización detectado refleja una tendencia a proyectar expectativas elevadas en la pareja o en la relación misma.\n\nTrabajarlo en sesión permite distinguir entre el amor al otro real — con sus límites y su falta — y el amor al otro idealizado.',
    areaCorrelations: Object.fromEntries(
      Object.entries(defaultScores).map(([key, score]) => {
        const name = areaNames[key]
        const msg = score >= 60
          ? `**${name}** muestra un nivel saludable (${score}%). Los datos sugieren que esta es un área de fortaleza en el vínculo.`
          : `**${name}** obtiene ${score}%, lo cual indica patrones que merecen atención.`
        return [key, msg]
      })
    ),
    correlacionesPrincipales: [
      'La **Comunicación** y los **Conflictos** forman un ciclo que, sin intervención, tiende a profundizarse.',
      'La **Idealización** combinada con la **Seguridad emocional** sugiere que se busca en el otro aquello que se necesita para sentirse completo.'
    ],
    unconsciousPatterns: [
      '**Evitación emocional**: dificultad para expresar necesidades profundas sin que se convierta en conflicto',
      '**Conflicto latente**: evitación de enfrentamientos que genera acumulación silenciosa de resentimiento',
      '**Expectativa proyectada**: se coloca en el otro una imagen idealizada que genera frustración recurrente'
    ],
    defenseMechanisms: [
      '**Evitación**: se eluden los temas difíciles como mecanismo para mantener una falsa armonía',
      '**Racionalización**: se buscan explicaciones lógicas para justificar dinámicas que son esencialmente emocionales'
    ],
    riskAreas: [
      '**Conflictos** (45%): requiere exploración profesional prioritaria',
      '**Idealización** (45%): requiere exploración profesional prioritaria'
    ],
    strengthsFound: [
      '**Disposición al trabajo**: apertura para explorar la relación a mayor profundidad',
      '**Individualidad respetada**: respeto por la identidad propia dentro del vínculo'
    ],
    keyInsight: 'El patrón general sugiere que la relación opera con dinámicas que merecen ser exploradas con mayor profundidad.',
    recommendation: 'Se recomienda una sesión profesional de diagnóstico de pareja para explorar en profundidad los patrones detectados.\n\nUn espacio psicoanalítico puede ayudar a distinguir entre lo que se demanda del otro y lo que genuinamente se desea construir juntos.',
    existentialReflection: 'Amar no es encontrar al otro perfecto, sino elegir al otro real — con su falta, con su misterio, con aquello que nunca terminaremos de conocer. El verdadero desafío del amor no es sostener la ilusión, sino sostener la verdad.'
  }
}
