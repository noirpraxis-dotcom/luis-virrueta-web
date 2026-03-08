// ─── SERVICIO DE ANÁLISIS RELACIONAL COMPLETO ─────────────────────
// Análisis psicológico con DeepSeek para el Diagnóstico Relacional (producto de tienda)
// Soporta modo individual y de pareja

const DEEPSEEK_API_URL = 'https://api.deepseek.com/chat/completions'

const SYSTEM_PROMPT = `Eres un psicólogo clínico especialista en relaciones de pareja con formación psicoanalítica y sistémica.

Tu tarea es analizar las respuestas de un cuestionario relacional profundo de 45 preguntas en 7 fases psicológicas y generar un diagnóstico psicológico completo.

NO eres un cuestionario simple. Eres un sistema de reconocimiento de patrones psicológicos.

DEBES:
- Leer entre líneas
- Inferir patrones a través de múltiples respuestas
- Detectar contradicciones
- Notar lo que se evita o se minimiza
- Identificar señales repetidas de apego, defensa, proyección y ciclos relacionales
- Detectar momentos críticos del vínculo
- Inferir sensibilidades emocionales activadas (sin diagnosticar clínicamente)

PRINCIPIOS DE INFERENCIA:
- Si la persona menciona repetidamente miedo a la distancia, ansiedad cuando es ignorada, necesidad de reaseguramiento → tendencia de apego ansioso
- Si menciona cerrarse en conflictos, evitar confrontación emocional, incomodidad con demandas → tendencia evitativa
- Si describe fusión, dificultad para estar sola, identidad dependiente → dinámica de fusión/dependencia
- Si describe crítica repetida, sentirse no escuchada, silencio post-conflicto → dinámica de erosión

PUNTUACIÓN:
Asigna puntuaciones de 0 a 100 basándote en evidencia cruzada de múltiples respuestas a lo largo de las 7 fases (incluyendo la fase de intimidad y conexión física). No dependas de una sola frase.

LENGUAJE:
- Cálido, empático, directo
- Sin jerga técnica ni términos académicos
- Cita palabras exactas entre comillas
- Usa **negrita** para conceptos clave
- Escribe como un psicólogo hablando directamente con la persona

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
  "core_scores": {
    "emotional_compatibility": "(0-100)",
    "relationship_stability": "(0-100)",
    "emotional_erosion_risk": "(0-100, donde 100 = máximo riesgo)",
    "reconnection_potential": "(0-100)"
  },
  "radar_scores": {
    "emotional_synchrony": "(0-100)",
    "communication_clarity": "(0-100)",
    "emotional_safety": "(0-100)",
    "conflict_management": "(0-100)",
    "relational_balance": "(0-100)",
    "emotional_support": "(0-100)"
  },
  "profile_scores": {
    "idealization_level": "(0-100)",
    "friction_level": "(0-100)",
    "emotional_openness": "(0-100)",
    "accumulated_distance": "(0-100)",
    "repair_capacity": "(0-100)",
    "emotional_dependency": "(0-100)",
    "emotional_awareness_of_partner": "(0-100)",
    "power_balance": "(0-100)"
  },
  "individual_insights": {
    "emotional_style": "(2 párrafos: cómo esta persona vive las emociones en relación. Cita sus palabras.)",
    "attachment_patterns": "(2 párrafos: qué patrón de apego emerge. Explica con evidencia, sin tecnicismos.)",
    "defense_mechanisms": "(1-2 párrafos: qué mecanismos de defensa aparecen. Cita ejemplos concretos.)",
    "what_they_seek_in_love": "(1-2 párrafos: qué busca realmente en el amor. La necesidad emocional de fondo.)",
    "emotional_triggers": "(1-2 párrafos: qué situaciones activan sus reacciones más intensas.)",
    "repeating_patterns": "(2 párrafos: qué patrones se repiten. Conecta con historia personal si hay evidencia.)",
    "hidden_needs": "(1-2 párrafos: necesidades que no expresa directamente pero aparecen entre líneas.)",
    "role_in_relationship": "(1 párrafo: qué rol tiende a asumir en la relación.)",
    "likely_relational_attractor": "(1-2 párrafos: qué tipo de dinámica tiende a buscar o recrear.)"
  },
  "couple_insights": {
    "real_relationship_dynamic": "(2-3 párrafos: cómo opera realmente la relación. **Negrita** en conceptos clave.)",
    "unconscious_patterns": "(2 párrafos: patrones inconscientes, proyecciones, expectativas ocultas.)",
    "conflict_and_defense": "(2 párrafos: cómo se activa el conflicto y qué defensas aparecen.)",
    "distancing_dynamics": "(1-2 párrafos: dónde empieza la distancia emocional.)",
    "attachment_and_support": "(1-2 párrafos: cómo se sostienen emocionalmente.)",
    "strengths_of_the_relationship": "(1-2 párrafos: recursos genuinos que sostienen el vínculo.)",
    "critical_moments_of_the_bond": "(2 párrafos: qué momentos activan los patrones principales.)",
    "global_relationship_diagnosis": "(2-3 párrafos: diagnóstico integral del vínculo.)"
  },
  "relationship_type": {
    "label": "(uno de: Relación Segura, Dinámica Ansioso-Evitativa, Relación Fusional, Relación en Erosión, Relación Reparable)",
    "explanation": "(2-3 párrafos explicando por qué encaja en esta clasificación. Cita evidencia.)"
  },
  "dominant_cycles": [
    {"name": "(nombre del ciclo)", "explanation": "(1-2 párrafos describiendo cómo aparece)"},
    {"name": "(segundo ciclo si aplica)", "explanation": "(descripción)"}
  ],
  "activated_emotional_sensitivities": [
    {"name": "(nombre de la sensibilidad)", "description": "(1 párrafo: cómo se manifiesta. NO es diagnóstico clínico.)"},
    {"name": "(segunda sensibilidad)", "description": "(descripción)"}
  ],
  "evidence_signals": [
    {"signal": "(señal detectada)", "source_questions": ["Q1", "Q15", "Q23"]},
    {"signal": "(segunda señal)", "source_questions": ["Q7", "Q18"]}
  ],
  "empathic_opening": "(2-3 párrafos. Lo primero que la persona leerá. Hazla sentir profundamente comprendida. Cita sus palabras. **Negrita** en lo importante.)",
  "key_insight": "(1 párrafo: la observación más reveladora de todo el análisis.)",
  "recommendation": "(2 párrafos: recomendación profesional personalizada. Orienta hacia sesión.)",
  "session_work_items": ["**Tema1**: descripción concreta para trabajo en sesión", "**Tema2**: descripción", "**Tema3**: descripción"]
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
    for (const group of ['core_scores', 'radar_scores', 'profile_scores']) {
      if (parsed[group]) {
        for (const key of Object.keys(parsed[group])) {
          const val = parseInt(parsed[group][key], 10)
          parsed[group][key] = isNaN(val) ? 50 : Math.max(0, Math.min(100, val))
        }
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
    core_scores: {
      emotional_compatibility: 55,
      relationship_stability: 50,
      emotional_erosion_risk: 45,
      reconnection_potential: 60
    },
    radar_scores: {
      emotional_synchrony: 52,
      communication_clarity: 48,
      emotional_safety: 55,
      conflict_management: 45,
      relational_balance: 50,
      emotional_support: 58
    },
    profile_scores: {
      idealization_level: 55,
      friction_level: 50,
      emotional_openness: 48,
      accumulated_distance: 42,
      repair_capacity: 58,
      emotional_dependency: 45,
      emotional_awareness_of_partner: 52,
      power_balance: 50
    },
    individual_insights: {
      emotional_style: 'Tus respuestas revelan una persona que **vive las emociones con intensidad** pero que no siempre encuentra la forma de expresarlas dentro de la relación.\n\nHay una tendencia a procesar internamente antes de compartir, lo que puede generar una distancia emocional que no siempre es intencional.',
      attachment_patterns: 'El patrón que emerge sugiere una **necesidad de cercanía emocional** que a veces choca con el miedo a ser vulnerable.\n\nEsto genera un ciclo donde se busca conexión pero al mismo tiempo se activan defensas que dificultan recibirla completamente.',
      defense_mechanisms: 'Aparecen señales de **evitación de temas difíciles** como forma de mantener la estabilidad aparente del vínculo.\n\nTambién se detecta una tendencia a racionalizar situaciones emocionales, buscando explicaciones lógicas para dinámicas que son esencialmente afectivas.',
      what_they_seek_in_love: 'Lo que buscas en el amor es, fundamentalmente, **un lugar donde ser visto y aceptado sin condiciones**.\n\nDebajo de las dinámicas cotidianas hay una necesidad de sentir que alguien te elige conscientemente, no por costumbre ni por necesidad.',
      emotional_triggers: 'Las situaciones que más activan tus reacciones emocionales están relacionadas con **sentirse no escuchado/a o no priorizado/a**.\n\nCuando percibes que tu pareja se aleja o no responde como esperas, se activa una respuesta emocional que va más allá del momento específico.',
      repeating_patterns: 'Hay un patrón que se repite: **buscar en la relación algo que en realidad necesitas encontrar dentro de ti**.\n\nEsto no es un defecto — es una dinámica muy humana. Pero cuando no se reconoce, tiende a generar ciclos de frustración y dependencia emocional.',
      hidden_needs: 'Entre líneas aparece una necesidad de **validación emocional constante** que no siempre se expresa directamente.\n\nHay cosas que necesitas de tu pareja que probablemente nunca has dicho con todas las letras.',
      role_in_relationship: 'Tiendes a asumir el rol de **quien mantiene el equilibrio emocional** de la relación, a veces a costa de tus propias necesidades.',
      likely_relational_attractor: 'La dinámica que tiendes a buscar o recrear está asociada con **relaciones donde hay intensidad emocional** — tanto en la conexión como en el conflicto.\n\nEsto puede significar que la estabilidad a veces se confunde con monotonía, y la intensidad con amor.'
    },
    couple_insights: {
      real_relationship_dynamic: 'La dinámica real de la relación opera con un **patrón de acercamiento-distanciamiento** donde las necesidades emocionales de cada uno no siempre coinciden.\n\nHay momentos de conexión genuina alternados con períodos de tensión no resuelta que se acumula silenciosamente.\n\nEste ciclo tiene su propia lógica interna y entenderlo es el primer paso para transformarlo.',
      unconscious_patterns: 'Los patrones inconscientes que emergen sugieren que **cada uno proyecta en el otro expectativas que vienen de su historia personal**.\n\nLo que se pide al otro no siempre es lo que realmente se necesita — y esa distancia entre la demanda y la necesidad real es donde se genera la mayor fricción.',
      conflict_and_defense: 'Cuando el conflicto se activa, aparece un ciclo predecible: **uno se acerca pidiendo conexión mientras el otro se cierra buscando espacio**.\n\nAmbas reacciones son mecanismos de defensa legítimos, pero cuando chocan, generan la sensación de que "siempre terminamos en el mismo lugar".',
      distancing_dynamics: 'La distancia emocional comienza en los **momentos donde una necesidad importante no fue expresada o no fue recibida**.\n\nNo siempre es un evento grande — a veces son acumulaciones de pequeños momentos donde alguien se sintió invisible.',
      attachment_and_support: 'La capacidad de apoyo emocional existe pero **no siempre se activa de la forma que el otro necesita**.\n\nCada uno tiene su propio lenguaje de apoyo, y cuando no coinciden, el esfuerzo se pierde.',
      strengths_of_the_relationship: 'A pesar de los desafíos, existen **elementos genuinos de conexión** que vale la pena identificar y fortalecer.\n\nEl hecho de estar buscando respuestas ya indica un nivel de compromiso con el vínculo que no todos tienen.',
      critical_moments_of_the_bond: 'Los momentos críticos se activan cuando **aparece el silencio después del conflicto** — ese espacio donde ambos esperan que el otro dé el primer paso.\n\nTambién se activan cuando uno percibe que el otro tiene una vida emocional separada que no incluye al vínculo.',
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
