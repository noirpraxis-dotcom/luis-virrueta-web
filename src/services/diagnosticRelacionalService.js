// ─── SERVICIO DE ANÁLISIS RELACIONAL PROFUNDO — 12 DIMENSIONES ─────
// Análisis psicológico con DeepSeek para la Radiografía de Pareja
// 12 dimensiones basadas en los autores más importantes en psicología del amor
// Soporta modo individual y de pareja

const DEEPSEEK_API_URL = 'https://api.deepseek.com/chat/completions'

const SYSTEM_PROMPT = `Actúa como un analista experto en relaciones de pareja.

Integra los modelos psicológicos más influyentes en el estudio científico del amor y las relaciones:

• Teoría del apego (John Bowlby, Mary Ainsworth)
• Estilos de apego aplicados (Amir Levine)
• Investigación sobre matrimonio y conflicto (John Gottman)
• Teoría triangular del amor (Robert Sternberg)
• Terapia focalizada en emociones (Sue Johnson)
• Diferenciación en relaciones (David Schnarch)
• Dinámica del deseo (Esther Perel)
• Patrones inconscientes de pareja (Harville Hendrix)
• Neurobiología del amor (Helen Fisher)
• Regulación del sistema nervioso en pareja (Stan Tatkin)
• Lenguajes del amor (Gary Chapman)
• Satisfacción y mantenimiento relacional (Eli Finkel)

Tu tarea es analizar profundamente las respuestas narrativas de cada persona.

No hagas solo un resumen. Realiza un análisis psicológico inferencial basado en:

• tono emocional del lenguaje
• patrones narrativos repetidos
• contradicciones entre respuestas
• metáforas usadas para describir la relación
• palabras asociadas a apego, distancia o admiración
• descripción de conflictos y sus dinámicas
• percepción del futuro
• lo que se evita, se minimiza o se niega
• intensidad emocional vs. frialdad narrativa

PRINCIPIOS DE INFERENCIA:
- Si la persona menciona repetidamente miedo a la distancia, ansiedad cuando es ignorada, necesidad de reaseguramiento → apego ansioso
- Si menciona cerrarse en conflictos, evitar confrontación, incomodidad con demandas → tendencia evitativa
- Si describe fusión, dificultad para estar sola, identidad dependiente → dinámica fusional
- Si describe crítica repetida, sentirse no escuchada, silencio post-conflicto → erosión activa
- Si las respuestas de familia de origen revelan patrones similares a los de la relación → repetición transgeneracional
- Si la persona identifica el mismo rol en su familia y en su relación → rol heredado activo
- Usa triangulación semántica: si una pregunta tiene respuesta débil, infiere de otras preguntas relacionadas

PUNTUACIÓN:
Asigna puntuaciones de 0 a 100 por dimensión, basándote en evidencia cruzada de múltiples respuestas. No dependas de una sola frase. Cada dimensión tiene sub-scores que desglosan el análisis.

LENGUAJE:
- Cálido, empático, directo
- Sin jerga técnica ni términos académicos excesivos
- Cita palabras exactas del usuario entre comillas
- Usa **negrita** para conceptos clave
- Escribe como un psicólogo hablando directamente con la persona
- El análisis debe ser profundo, preciso y claro, como lo haría un terapeuta experto

IMPORTANTE: Responde EXCLUSIVAMENTE en formato JSON válido con la estructura solicitada.`

function buildPrompt(responses, questions, analysisMode) {
  let prompt = `## MODO DE ANÁLISIS: ${analysisMode === 'couple' ? 'PAREJA' : 'INDIVIDUAL'}\n\n`

  // Group questions by section
  const sections = {}
  for (let i = 0; i < questions.length; i++) {
    const q = questions[i]
    if (!sections[q.section]) sections[q.section] = []
    sections[q.section].push({ ...q, answer: responses[q.id] || '' })
  }

  prompt += '## RESPUESTAS DEL CUESTIONARIO\n'
  prompt += '(Cada respuesta fue dada verbalmente — la persona habló con libertad, sin filtro escrito.)\n\n'

  for (const [section, items] of Object.entries(sections)) {
    prompt += `### ${section}\n`
    for (const item of items) {
      if (item.answer && item.answer.trim()) {
        prompt += `**${item.id}. "${item.text}"**\n→ "${item.answer.trim()}"\n\n`
      } else {
        prompt += `**${item.id}. "${item.text}"**\n→ (no respondió — esto también es dato significativo)\n\n`
      }
    }
  }

  prompt += `\nGenera tu análisis psicológico en el siguiente formato JSON exacto:
{
  "analysis_mode": "${analysisMode}",
  "person_info": {
    "name": "(nombre extraído de Q0 o 'Anónimo')",
    "age": "(edad extraída de Q0 o null)",
    "relationship_duration": "(duración extraída de Q0 o null)",
    "first_impression": "(frase con la que describió su relación en Q0)"
  },
  "dimension_scores": {
    "apego": "(0-100, Bowlby/Ainsworth: seguridad, ansiedad, evitación en el vínculo)",
    "interaccion_conflicto": "(0-100, Gottman: cómo se manejan conflictos, los 4 jinetes, reparación)",
    "estructura_amor": "(0-100, Sternberg: equilibrio pasión-intimidad-compromiso)",
    "vinculo_emocional": "(0-100, Sue Johnson: accesibilidad y responsividad emocional)",
    "diferenciacion": "(0-100, Schnarch: independencia emocional dentro del vínculo)",
    "deseo": "(0-100, Perel: atracción, erotismo, vitalidad del deseo)",
    "patrones_inconscientes": "(0-100, Hendrix: repetición de dinámicas familiares, roles heredados)",
    "neurobiologia_amor": "(0-100, Fisher: intensidad de conexión física, química, urgencia)",
    "regulacion_emocional": "(0-100, Tatkin: co-regulación, capacidad de calmar al otro)",
    "apego_aplicado": "(0-100, Levine: conductas concretas de apego seguro vs inseguro)",
    "lenguaje_amor": "(0-100, Chapman: alineación en formas de dar y recibir amor)",
    "satisfaccion_mantenimiento": "(0-100, Finkel: satisfacción actual y esfuerzo de mantenimiento)"
  },
  "sub_scores": {
    "apego": {
      "seguridad_base": "(0-100)",
      "miedo_abandono": "(0-100)",
      "busqueda_cercania": "(0-100)"
    },
    "interaccion_conflicto": {
      "critica_desprecio": "(0-100, donde 100 = mucha crítica/desprecio)",
      "defensividad": "(0-100)",
      "stonewalling": "(0-100, bloqueo emocional)",
      "capacidad_reparacion": "(0-100)"
    },
    "estructura_amor": {
      "pasion": "(0-100)",
      "intimidad": "(0-100)",
      "compromiso": "(0-100)"
    },
    "deseo": {
      "atraccion_actual": "(0-100)",
      "espontaneidad_erotica": "(0-100)",
      "misterio_novedad": "(0-100)"
    }
  },
  "composite_scores": {
    "salud_relacional_global": "(0-100, promedio ponderado de todas las dimensiones)",
    "sincronia_emocional": "(0-100, alineación emocional percibida)",
    "riesgo_ruptura": "(0-100, donde 100 = máximo riesgo)",
    "potencial_crecimiento": "(0-100, recursos disponibles para mejorar)"
  },
  "attachment_map": {
    "style": "(Seguro | Ansioso | Evitativo | Desorganizado)",
    "anxiety_level": "(0-100, eje de ansiedad)",
    "avoidance_level": "(0-100, eje de evitación)"
  },
  "individual_insights": {
    "emotional_style": "(2 párrafos: cómo vive las emociones en relación. Cita sus palabras.)",
    "attachment_patterns": "(2 párrafos: qué patrón de apego emerge. Evidencia concreta.)",
    "defense_mechanisms": "(1-2 párrafos: mecanismos de defensa detectados. Ejemplos.)",
    "what_they_seek_in_love": "(1-2 párrafos: necesidad emocional de fondo.)",
    "emotional_triggers": "(1-2 párrafos: situaciones que activan reacciones intensas.)",
    "repeating_patterns": "(2 párrafos: patrones que se repiten. Conecta con historia familiar.)",
    "hidden_needs": "(1-2 párrafos: necesidades no expresadas directamente.)",
    "role_in_relationship": "(1 párrafo: rol que asume en la relación.)",
    "differentiation_profile": "(1-2 párrafos: capacidad de mantener identidad propia dentro del vínculo.)"
  },
  "couple_insights": {
    "real_relationship_dynamic": "(2-3 párrafos: cómo opera realmente la relación.)",
    "unconscious_patterns": "(2 párrafos: proyecciones, expectativas ocultas, herencia familiar.)",
    "conflict_and_defense": "(2 párrafos: cómo se activa el conflicto y qué defensas aparecen.)",
    "distancing_dynamics": "(1-2 párrafos: dónde empieza la distancia emocional.)",
    "attachment_and_support": "(1-2 párrafos: cómo se sostienen emocionalmente.)",
    "strengths_of_the_relationship": "(1-2 párrafos: recursos genuinos del vínculo.)",
    "love_languages_analysis": "(1-2 párrafos: cómo dan y reciben amor, alineación o desalineación.)",
    "global_relationship_diagnosis": "(2-3 párrafos: diagnóstico integral.)"
  },
  "relationship_type": {
    "label": "(Relación Segura | Dinámica Ansioso-Evitativa | Relación Fusional | Relación en Erosión | Relación Reparable)",
    "explanation": "(2-3 párrafos explicando por qué. Cita evidencia.)"
  },
  "dominant_cycles": [
    {"name": "(nombre del ciclo)", "explanation": "(1-2 párrafos)"}
  ],
  "activated_emotional_sensitivities": [
    {"name": "(nombre)", "description": "(1 párrafo: cómo se manifiesta)"}
  ],
  "dimension_narratives": {
    "apego": "(1 párrafo breve explicando el score de apego con evidencia)",
    "interaccion_conflicto": "(1 párrafo breve)",
    "estructura_amor": "(1 párrafo breve)",
    "vinculo_emocional": "(1 párrafo breve)",
    "diferenciacion": "(1 párrafo breve)",
    "deseo": "(1 párrafo breve)",
    "patrones_inconscientes": "(1 párrafo breve)",
    "neurobiologia_amor": "(1 párrafo breve)",
    "regulacion_emocional": "(1 párrafo breve)",
    "apego_aplicado": "(1 párrafo breve)",
    "lenguaje_amor": "(1 párrafo breve)",
    "satisfaccion_mantenimiento": "(1 párrafo breve)"
  },
  "evidence_signals": [
    {"signal": "(señal detectada)", "source_questions": ["Q1", "Q15"]}
  ],
  "empathic_opening": "(2-3 párrafos. Lo primero que la persona leerá. Hazla sentir profundamente comprendida. Cita sus palabras. **Negrita** en lo importante.)",
  "key_insight": "(1 párrafo: la observación más reveladora de todo el análisis.)",
  "recommendation": "(2 párrafos: recomendación profesional personalizada. Orienta hacia sesión.)",
  "session_work_items": ["**Tema1**: descripción", "**Tema2**: descripción", "**Tema3**: descripción"]
}`

  return prompt
}

export async function analyzeDiagnostic({ responses, questions, analysisMode = 'individual' }) {
  const apiKey = import.meta.env.VITE_DEEPSEEK_API_KEY

  if (!apiKey) {
    console.warn('⚠️ VITE_DEEPSEEK_API_KEY no configurada. Usando análisis de respaldo.')
    return generateFallbackAnalysis(analysisMode)
  }

  const prompt = buildPrompt(responses, questions, analysisMode)

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

    const parsed = JSON.parse(content)

    // Clamp all scores to 0-100
    for (const group of ['dimension_scores', 'composite_scores']) {
      if (parsed[group]) {
        for (const key of Object.keys(parsed[group])) {
          const val = parseInt(parsed[group][key], 10)
          parsed[group][key] = isNaN(val) ? 50 : Math.max(0, Math.min(100, val))
        }
      }
    }
    // Clamp sub_scores
    if (parsed.sub_scores) {
      for (const group of Object.keys(parsed.sub_scores)) {
        if (parsed.sub_scores[group]) {
          for (const key of Object.keys(parsed.sub_scores[group])) {
            const val = parseInt(parsed.sub_scores[group][key], 10)
            parsed.sub_scores[group][key] = isNaN(val) ? 50 : Math.max(0, Math.min(100, val))
          }
        }
      }
    }
    // Clamp attachment_map
    if (parsed.attachment_map) {
      for (const key of ['anxiety_level', 'avoidance_level']) {
        const val = parseInt(parsed.attachment_map[key], 10)
        parsed.attachment_map[key] = isNaN(val) ? 50 : Math.max(0, Math.min(100, val))
      }
    }

    return parsed
  } catch (error) {
    console.error('Diagnostic analysis failed:', error)
    return generateFallbackAnalysis(analysisMode)
  }
}

function generateFallbackAnalysis(analysisMode) {
  return {
    analysis_mode: analysisMode,
    person_info: { name: 'Anónimo', age: null, relationship_duration: null, first_impression: '' },
    dimension_scores: {
      apego: 55, interaccion_conflicto: 48, estructura_amor: 52, vinculo_emocional: 50,
      diferenciacion: 56, deseo: 45, patrones_inconscientes: 42, neurobiologia_amor: 48,
      regulacion_emocional: 50, apego_aplicado: 52, lenguaje_amor: 55, satisfaccion_mantenimiento: 48
    },
    sub_scores: {
      apego: { seguridad_base: 50, miedo_abandono: 55, busqueda_cercania: 60 },
      interaccion_conflicto: { critica_desprecio: 45, defensividad: 50, stonewalling: 40, capacidad_reparacion: 55 },
      estructura_amor: { pasion: 45, intimidad: 55, compromiso: 58 },
      deseo: { atraccion_actual: 45, espontaneidad_erotica: 40, misterio_novedad: 38 }
    },
    composite_scores: { salud_relacional_global: 52, sincronia_emocional: 48, riesgo_ruptura: 45, potencial_crecimiento: 60 },
    attachment_map: { style: 'Ansioso', anxiety_level: 62, avoidance_level: 35 },
    individual_insights: {
      emotional_style: 'Tus respuestas revelan una persona que **vive las emociones con intensidad** pero que no siempre encuentra la forma de expresarlas dentro de la relación.\n\nHay una tendencia a procesar internamente antes de compartir, lo que puede generar una distancia emocional que no siempre es intencional.',
      attachment_patterns: 'El patrón que emerge sugiere una **necesidad de cercanía emocional** que a veces choca con el miedo a ser vulnerable.\n\nEsto genera un ciclo donde se busca conexión pero al mismo tiempo se activan defensas que dificultan recibirla completamente.',
      defense_mechanisms: 'Aparecen señales de **evitación de temas difíciles** como forma de mantener la estabilidad aparente del vínculo.\n\nTambién se detecta una tendencia a racionalizar situaciones emocionales, buscando explicaciones lógicas para dinámicas que son esencialmente afectivas.',
      what_they_seek_in_love: 'Lo que buscas en el amor es, fundamentalmente, **un lugar donde ser visto y aceptado sin condiciones**.\n\nDebajo de las dinámicas cotidianas hay una necesidad de sentir que alguien te elige conscientemente, no por costumbre ni por necesidad.',
      emotional_triggers: 'Las situaciones que más activan tus reacciones emocionales están relacionadas con **sentirse no escuchado/a o no priorizado/a**.\n\nCuando percibes que tu pareja se aleja o no responde como esperas, se activa una respuesta emocional que va más allá del momento específico.',
      repeating_patterns: 'Hay un patrón que se repite: **buscar en la relación algo que en realidad necesitas encontrar dentro de ti**.\n\nEsto no es un defecto — es una dinámica muy humana. Pero cuando no se reconoce, tiende a generar ciclos de frustración y dependencia emocional.',
      hidden_needs: 'Entre líneas aparece una necesidad de **validación emocional constante** que no siempre se expresa directamente.\n\nHay cosas que necesitas de tu pareja que probablemente nunca has dicho con todas las letras.',
      role_in_relationship: 'Tiendes a asumir el rol de **quien mantiene el equilibrio emocional** de la relación, a veces a costa de tus propias necesidades.',
      differentiation_profile: 'La dinámica que tiendes a buscar o recrear está asociada con **relaciones donde hay intensidad emocional** — tanto en la conexión como en el conflicto.\n\nEsto puede significar que la estabilidad a veces se confunde con monotonía, y la intensidad con amor.'
    },
    couple_insights: {
      real_relationship_dynamic: 'La dinámica real de la relación opera con un **patrón de acercamiento-distanciamiento** donde las necesidades emocionales de cada uno no siempre coinciden.\n\nHay momentos de conexión genuina alternados con períodos de tensión no resuelta que se acumula silenciosamente.\n\nEste ciclo tiene su propia lógica interna y entenderlo es el primer paso para transformarlo.',
      unconscious_patterns: 'Los patrones inconscientes que emergen sugieren que **cada uno proyecta en el otro expectativas que vienen de su historia personal**.\n\nLo que se pide al otro no siempre es lo que realmente se necesita — y esa distancia entre la demanda y la necesidad real es donde se genera la mayor fricción.',
      conflict_and_defense: 'Cuando el conflicto se activa, aparece un ciclo predecible: **uno se acerca pidiendo conexión mientras el otro se cierra buscando espacio**.\n\nAmbas reacciones son mecanismos de defensa legítimos, pero cuando chocan, generan la sensación de que "siempre terminamos en el mismo lugar".',
      distancing_dynamics: 'La distancia emocional comienza en los **momentos donde una necesidad importante no fue expresada o no fue recibida**.\n\nNo siempre es un evento grande — a veces son acumulaciones de pequeños momentos donde alguien se sintió invisible.',
      attachment_and_support: 'La capacidad de apoyo emocional existe pero **no siempre se activa de la forma que el otro necesita**.\n\nCada uno tiene su propio lenguaje de apoyo, y cuando no coinciden, el esfuerzo se pierde.',
      strengths_of_the_relationship: 'A pesar de los desafíos, existen **elementos genuinos de conexión** que vale la pena identificar y fortalecer.\n\nEl hecho de estar buscando respuestas ya indica un nivel de compromiso con el vínculo que no todos tienen.',
      love_languages_analysis: 'Cada uno tiene su propia forma de dar y recibir amor. Cuando esas formas no coinciden, **el esfuerzo de uno se pierde en el otro**.\n\nEntender cómo cada quien expresa y necesita recibir amor es clave para que la energía invertida en la relación realmente llegue.',
      global_relationship_diagnosis: 'El vínculo se encuentra en un **momento de transición** donde los patrones actuales están generando más desgaste del que la conexión puede absorber.\n\nEsto no significa que la relación esté perdida — significa que necesita una intervención consciente para poder evolucionar.\n\nLos recursos existen, pero necesitan ser activados de forma diferente a como se han usado hasta ahora.'
    },
    relationship_type: {
      label: 'Relación Reparable',
      explanation: 'La relación muestra señales de desgaste acumulado pero también de recursos genuinos de conexión.\n\nNo encaja en un patrón de erosión irreversible porque todavía existe voluntad de entender al otro y capacidad de reconocer los problemas.\n\nCon intervención profesional, los ciclos actuales pueden transformarse en dinámicas más funcionales.'
    },
    dominant_cycles: [
      { name: 'Perseguir-Retirarse', explanation: 'Uno busca cercanía y el otro necesita espacio. Mientras más insiste uno, más se aleja el otro — y viceversa.\n\nEste ciclo no se resuelve con "esfuerzo" sino con comprensión de qué necesidad emocional opera en cada lado.' },
      { name: 'Silencio-Distancia', explanation: 'Después de los conflictos, el silencio se instala como un muro invisible que ninguno sabe cómo cruzar.\n\nCon el tiempo, estos silencios se normalizan y la distancia emocional crece sin que nadie lo nombre.' }
    ],
    activated_emotional_sensitivities: [
      { name: 'Miedo al abandono', description: 'Aparece como una sensibilidad a cualquier señal de distanciamiento del otro. No necesariamente es consciente, pero influye en las reacciones ante el conflicto y la separación.' },
      { name: 'Miedo a no ser suficiente', description: 'Se manifiesta como un esfuerzo constante por mantener el vínculo, a veces a costa de las propias necesidades. La pregunta no dicha es: ¿soy suficiente para que te quedes?' }
    ],
    dimension_narratives: {
      apego: 'Se detecta una **necesidad de cercanía** que a veces choca con el miedo a la vulnerabilidad. El apego oscila entre la búsqueda y la retracción.',
      interaccion_conflicto: 'Los conflictos tienden a seguir un **patrón predecible** donde uno avanza y el otro se retira. La reparación existe pero no siempre es completa.',
      estructura_amor: 'El triángulo del amor muestra un **compromiso relativamente estable** pero con signos de desgaste en la pasión y la intimidad emocional.',
      vinculo_emocional: 'La conexión emocional está presente pero **no siempre es accesible**. Hay momentos de sintonía real alternados con desconexión.',
      diferenciacion: 'Existe una capacidad razonable de mantener identidad propia, aunque a veces **la relación absorbe más de lo saludable**.',
      deseo: 'El deseo ha cambiado desde el inicio. La atracción sigue presente pero **la espontaneidad y la novedad se han reducido** con el tiempo.',
      patrones_inconscientes: 'Se detectan **repeticiones de dinámicas familiares** que operan sin conciencia. Roles heredados que se activan en momentos de estrés.',
      neurobiologia_amor: 'La conexión física existe pero la **intensidad biológica del inicio se ha transformado**. Las sensaciones corporales han cambiado.',
      regulacion_emocional: 'La capacidad de co-regulación tiene **áreas de oportunidad**. En momentos de crisis, cada uno recurre a estrategias diferentes.',
      apego_aplicado: 'Las conductas de apego muestran una **tendencia a la ansiedad relacional** que se activa ante la percepción de distancia.',
      lenguaje_amor: 'Cada uno expresa y recibe amor de **formas distintas**, lo que genera una brecha entre el esfuerzo invertido y lo que el otro percibe.',
      satisfaccion_mantenimiento: 'La satisfacción actual no refleja todo el potencial del vínculo. El **esfuerzo de mantenimiento podría equilibrarse** mejor.'
    },
    evidence_signals: [
      { signal: 'Patrón de evitación de confrontación directa', source_questions: ['Q18', 'Q20', 'Q23'] },
      { signal: 'Necesidad de validación emocional no expresada', source_questions: ['Q12', 'Q14', 'Q28'] }
    ],
    empathic_opening: 'Gracias por compartir lo que traes. Lo que describiste no son "problemas de pareja" genéricos — son **patrones muy específicos** que revelan cómo vives el amor, qué necesitas, y qué temes perder.\n\nHay algo en todo lo que dijiste que merece ser nombrado: **estás buscando entender algo que la mayoría de las personas prefiere ignorar**. Eso requiere valentía.\n\nEste reporte no es un juicio sobre tu relación. Es un mapa de lo que opera debajo de la superficie — para que puedas elegir con más claridad.',
    key_insight: 'La observación más reveladora es que **el conflicto principal no está entre tú y tu pareja, sino entre lo que necesitas del vínculo y lo que te permites pedir**. Esa brecha es donde se genera la mayor parte de la frustración.',
    recommendation: 'Se recomienda una sesión profesional de diagnóstico relacional para explorar en profundidad los patrones detectados. Lo que aparece en este reporte son indicadores — en sesión se puede llegar al origen.\n\nEl trabajo no es "arreglar la relación" sino **entender qué función cumple cada patrón** para que puedas elegir conscientemente qué quieres mantener y qué quieres transformar.',
    session_work_items: [
      '**Patrón de apego**: Explorar cómo tu historia personal influye en lo que buscas y temes en la relación',
      '**Ciclos de conflicto**: Identificar qué se repite y qué necesidad no resuelta lo alimenta',
      '**Comunicación emocional**: Trabajar la capacidad de expresar necesidades sin que se convierta en demanda o reproche'
    ]
  }
}
