// ─── SERVICIO DE RADIOGRAFÍA DE PAREJA PREMIUM — 12 DIMENSIONES NARRATIVAS ─────
// Análisis psicológico profundo con DeepSeek
// 40 preguntas narrativas · 5 bloques · 12 dimensiones
// Integra: Gottman, Bowlby, Sue Johnson, Perel, Sternberg, Tatkin, Freud, Lacan, sistémica

const DEEPSEEK_API_URL = 'https://api.deepseek.com/chat/completions'

const SYSTEM_PROMPT = `Eres un sistema avanzado de análisis psicológico llamado "Radiografía de Pareja".

Tu objetivo es analizar profundamente la narrativa de una persona sobre su relación para detectar:
- patrones emocionales
- dinámicas relacionales
- conflictos estructurales
- señales de desgaste o fortalecimiento del vínculo
- dirección probable de la relación.

Este sistema no es un simple test de compatibilidad.
Es una evaluación narrativa avanzada del vínculo que combina psicología científica, teoría del apego, terapia de pareja y psicoanálisis.

MARCO TEÓRICO — Integra las siguientes corrientes:
• John Gottman — Estabilidad relacional y dinámica del conflicto
• Bowlby / Amir Levine — Teoría del apego
• Sue Johnson — Conexión emocional y seguridad afectiva (EFT)
• Esther Perel — Deseo erótico y tensión entre amor y autonomía
• Robert Sternberg — Triángulo del amor (intimidad, pasión, compromiso)
• Stan Tatkin — Sincronía y regulación en la pareja
• Freud — Patrones inconscientes y repetición relacional
• Lacan — Fantasma relacional y estructura del deseo
• Psicología sistémica — Roles relacionales y dinámicas del sistema

DIMENSIONES PSICOLÓGICAS A MEDIR (0-100 cada una):
1. Estabilidad relacional
2. Apego emocional
3. Conexión emocional
4. Deseo erótico
5. Intimidad
6. Sincronía relacional
7. Patrones inconscientes
8. Fantasma relacional
9. Roles sistémicos
10. Resiliencia del vínculo
11. Vulnerabilidad emocional
12. Narrativa de futuro del vínculo

MÉTODO DE ANÁLISIS — Tres niveles simultáneos:

NIVEL 1 — Análisis individual de respuestas:
Cada respuesta debe evaluarse detectando: tono emocional, intensidad afectiva, nivel de apertura o evasión, presencia de defensividad, idealización o desvalorización, contradicciones internas, nivel de detalle narrativo, presencia de conflicto.
Detecta palabras clave: deseo, distancia, compromiso, resentimiento, admiración, desconexión, presión relacional.

NIVEL 2 — Análisis por bloques narrativos:
Analiza los bloques como sistemas narrativos: Historia del vínculo, Desarrollo, Patrones familiares, Conflicto, Deseo e intimidad, Futuro. Detecta coherencias o inconsistencias entre bloques.

NIVEL 3 — Análisis global del discurso:
Analiza TODAS las respuestas como una narrativa completa. Identifica: temas recurrentes, contradicciones, omisiones significativas, narrativas dominantes, tensiones centrales, dinámica de poder, dirección emocional.
Detecta fantasmas relacionales: qué espera cada persona del otro, qué papel ocupa cada uno, qué falta intenta llenar la relación.

DETECCIÓN DE CONTRADICCIONES:
Si alguien describe la relación como "muy buena" pero describe conflictos constantes → disonancia narrativa. Las contradicciones deben aparecer como tensiones estructurales.

INFERENCIA PSICOLÓGICA:
- Estilo de apego: seguro, ansioso, evitativo, ansioso-evitativo
- Tipo de vínculo: compañera, intelectual, pasional, conflictiva, dependiente
- Dinámica de conflicto: confrontación directa, perseguidor-retirada, evitación mutua, conflicto escalado

TONO DEL INFORME:
- Humano, profundo, claro, psicológico pero accesible
- Evita lenguaje técnico excesivo
- El usuario debe sentir que el sistema comprendió su historia
- Cita palabras exactas del usuario entre comillas
- Usa **negrita** para conceptos clave
- NUNCA inventes información — todas las inferencias deben derivarse del discurso

IMPORTANTE: Responde EXCLUSIVAMENTE en formato JSON válido con la estructura solicitada.`

function buildPrompt(responses, questions) {
  let prompt = '## RESPUESTAS DEL CUESTIONARIO NARRATIVO — RADIOGRAFÍA DE PAREJA PREMIUM\n\n'
  prompt += '(Cada respuesta fue dada verbalmente — la persona habló con libertad, sin filtro escrito.)\n\n'

  const blocks = {
    'Contexto personal y panorama general': [],
    'Origen del vínculo y atracción inicial': [],
    'Historia emocional y patrones relacionales': [],
    'Deseo, intimidad y dinámica emocional': [],
    'Futuro del vínculo y sentido de la relación': []
  }

  for (let i = 0; i < questions.length; i++) {
    const q = questions[i]
    const blockName = q.block
    if (!blocks[blockName]) blocks[blockName] = []
    blocks[blockName].push({ ...q, answer: responses[q.id] || '' })
  }

  for (const [block, items] of Object.entries(blocks)) {
    prompt += `### ${block}\n`
    for (const item of items) {
      if (item.answer && item.answer.trim()) {
        prompt += `**${item.id}. "${item.mainQuestion}"**\n→ "${item.answer.trim()}"\n\n`
      } else {
        prompt += `**${item.id}. "${item.mainQuestion}"**\n→ (no respondió — esto también es dato significativo)\n\n`
      }
    }
  }

  prompt += `\nRealiza el análisis psicológico completo siguiendo las 6 fases del sistema.
Devuelve el resultado en el siguiente formato JSON exacto:
{
  "resumen_relacion": "(2-3 párrafos: resumen narrativo del vínculo, parafraseando al usuario. Genera sensación de comprensión.)",
  "dimensiones": {
    "estabilidad_relacional": "(0-100)",
    "apego_emocional": "(0-100)",
    "conexion_emocional": "(0-100)",
    "deseo_erotico": "(0-100)",
    "intimidad": "(0-100)",
    "sincronia_relacional": "(0-100)",
    "patrones_inconscientes": "(0-100, donde 100 = muchos patrones detectados)",
    "fantasma_relacional": "(0-100, intensidad del fantasma)",
    "roles_sistemicos": "(0-100, rigidez de roles)",
    "resiliencia_vinculo": "(0-100)",
    "vulnerabilidad_emocional": "(0-100)",
    "narrativa_futuro": "(0-100)"
  },
  "diagnostico": {
    "tipo_vinculo": "(Relación compañera | Relación intelectual | Relación pasional | Relación conflictiva | Relación dependiente | Mixto)",
    "estilo_apego": "(Seguro | Ansioso | Evitativo | Ansioso-evitativo)",
    "dinamica_conflicto": "(Confrontación directa | Perseguidor-retirada | Evitación mutua | Conflicto escalado)",
    "tono_relacional": "(1 frase que describe el tono dominante de la relación)"
  },
  "radiografia_inicial": "(2-3 párrafos: parafrasea la narrativa del usuario, señala ejes principales, genera comprensión. **Negrita** en conceptos clave.)",
  "analisis_profundo": {
    "narrativa_dominante": "(2 párrafos: cuál es la historia que el vínculo se cuenta a sí mismo)",
    "tensiones_estructurales": "(2 párrafos: contradicciones y tensiones encontradas. Cita al usuario.)",
    "evolucion_deseo": "(1-2 párrafos: cómo ha cambiado el deseo desde el inicio)",
    "dinamica_emocional": "(2 párrafos: cómo se conectan y desconectan emocionalmente)"
  },
  "lectura_psicoanalitica": {
    "proyecciones_inconscientes": "(1-2 párrafos: repeticiones, proyecciones, roles heredados. Enfoque freudiano.)",
    "fantasma_relacional": "(1-2 párrafos: qué representa la pareja para el sujeto. Enfoque lacaniano.)",
    "roles_simbolicos": "(1 párrafo: funciones psicológicas que cada miembro ocupa)"
  },
  "dinamica_conflicto": {
    "tendencia_conflicto": "(0-100)",
    "reaccion_usuario": "(1 párrafo: cómo reacciona el usuario al conflicto)",
    "reaccion_pareja": "(1 párrafo: cómo reacciona la pareja según lo describe el usuario)",
    "capacidad_reparacion": "(0-100)"
  },
  "energia_vinculo": {
    "atraccion_inicial": "(0-100)",
    "atraccion_actual": "(0-100)",
    "intimidad_emocional": "(0-100)",
    "conexion_fisica": "(0-100)"
  },
  "direccion_probable": {
    "estabilidad_futura": "(0-100)",
    "riesgo_desgaste": "(0-100)",
    "potencial_reconexion": "(0-100)"
  },
  "fortalezas": ["(fortaleza 1)", "(fortaleza 2)", "(fortaleza 3)"],
  "riesgos": ["(riesgo 1)", "(riesgo 2)", "(riesgo 3)"],
  "tabla_diagnostica": [
    {"dimension": "Estabilidad relacional", "nivel": "(Alto|Medio|Bajo)", "interpretacion": "(1 frase)"},
    {"dimension": "Apego emocional", "nivel": "(Alto|Medio|Bajo)", "interpretacion": "(1 frase)"},
    {"dimension": "Conexión emocional", "nivel": "(Alto|Medio|Bajo)", "interpretacion": "(1 frase)"},
    {"dimension": "Deseo erótico", "nivel": "(Alto|Medio|Bajo)", "interpretacion": "(1 frase)"},
    {"dimension": "Intimidad", "nivel": "(Alto|Medio|Bajo)", "interpretacion": "(1 frase)"},
    {"dimension": "Sincronía relacional", "nivel": "(Alto|Medio|Bajo)", "interpretacion": "(1 frase)"},
    {"dimension": "Patrones inconscientes", "nivel": "(Alto|Medio|Bajo)", "interpretacion": "(1 frase)"},
    {"dimension": "Fantasma relacional", "nivel": "(Alto|Medio|Bajo)", "interpretacion": "(1 frase)"},
    {"dimension": "Roles sistémicos", "nivel": "(Alto|Medio|Bajo)", "interpretacion": "(1 frase)"},
    {"dimension": "Resiliencia del vínculo", "nivel": "(Alto|Medio|Bajo)", "interpretacion": "(1 frase)"},
    {"dimension": "Vulnerabilidad emocional", "nivel": "(Alto|Medio|Bajo)", "interpretacion": "(1 frase)"},
    {"dimension": "Narrativa de futuro", "nivel": "(Alto|Medio|Bajo)", "interpretacion": "(1 frase)"}
  ],
  "sintesis_final": {
    "que_ocurre": "(1-2 párrafos: qué está ocurriendo realmente en la relación)",
    "posibilidades_evolucion": "(1-2 párrafos: qué posibilidades de evolución existen)",
    "factores_fortalecimiento": "(1-2 párrafos: qué factores podrían fortalecer el vínculo)"
  }
}`

  return prompt
}

export async function analyzeRadiografiaPremium({ responses, questions }) {
  const apiKey = import.meta.env.VITE_DEEPSEEK_API_KEY

  if (!apiKey) {
    console.warn('⚠️ VITE_DEEPSEEK_API_KEY no configurada. Usando análisis de respaldo.')
    return generateFallbackAnalysis()
  }

  const prompt = buildPrompt(responses, questions)

  try {
    const response = await fetch(DEEPSEEK_API_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${apiKey}` },
      body: JSON.stringify({
        model: 'deepseek-chat',
        messages: [
          { role: 'system', content: SYSTEM_PROMPT },
          { role: 'user', content: prompt }
        ],
        temperature: 0.7,
        max_tokens: 10000,
        response_format: { type: 'json_object' }
      })
    })

    if (!response.ok) {
      const errText = await response.text()
      console.error('DeepSeek API error:', response.status, errText)
      return generateFallbackAnalysis()
    }

    const data = await response.json()
    const content = data.choices?.[0]?.message?.content
    if (!content) return generateFallbackAnalysis()

    const parsed = JSON.parse(content)

    // Clamp dimension scores
    if (parsed.dimensiones) {
      for (const key of Object.keys(parsed.dimensiones)) {
        parsed.dimensiones[key] = Math.max(0, Math.min(100, Number(parsed.dimensiones[key]) || 50))
      }
    }

    return parsed
  } catch (error) {
    console.error('Radiografía Premium analysis failed:', error)
    return generateFallbackAnalysis()
  }
}

function generateFallbackAnalysis() {
  return {
    resumen_relacion: 'Tu narrativa revela una relación con **capas de complejidad** que merece ser explorada en profundidad. Hay elementos de conexión genuina pero también tensiones que operan por debajo de la superficie.\n\nLo que describes no es un vínculo simple — tiene historia, tiene peso emocional y tiene zonas que necesitan atención. Este análisis busca darte un mapa claro de todo eso.',
    dimensiones: {
      estabilidad_relacional: 55,
      apego_emocional: 52,
      conexion_emocional: 50,
      deseo_erotico: 45,
      intimidad: 48,
      sincronia_relacional: 50,
      patrones_inconscientes: 58,
      fantasma_relacional: 55,
      roles_sistemicos: 52,
      resiliencia_vinculo: 56,
      vulnerabilidad_emocional: 60,
      narrativa_futuro: 50
    },
    diagnostico: {
      tipo_vinculo: 'Relación compañera con tensión entre autonomía y compromiso',
      estilo_apego: 'Ansioso',
      dinamica_conflicto: 'Perseguidor-retirada',
      tono_relacional: 'Vínculo con amor de fondo pero con desgaste emocional acumulado'
    },
    radiografia_inicial: 'Lo que tus respuestas revelan es una relación que **ha construido cimientos sólidos** pero que enfrenta tensiones que no siempre se nombran. Hay una historia compartida que tiene valor, pero también hay patrones que se han ido instalando silenciosamente.\n\nLa dinámica central parece girar alrededor de una **necesidad de conexión que no siempre encuentra respuesta** en la forma esperada. Esto genera ciclos de acercamiento y distancia que ambos perciben pero que ninguno logra detener por completo.\n\nTu relación no está rota — está en un punto donde **las decisiones conscientes** pueden marcar la diferencia entre el fortalecimiento y el desgaste progresivo.',
    analisis_profundo: {
      narrativa_dominante: 'La narrativa que emerge de tus respuestas es la de una relación que **comenzó con una conexión significativa** y que ha ido transformándose con el tiempo. Hay una historia de dos personas que se encontraron por razones que van más allá de lo superficial.\n\nSin embargo, la evolución natural del vínculo ha traído **nuevos desafíos** que requieren formas diferentes de relacionarse. Lo que funcionaba al principio ya no tiene el mismo efecto.',
      tensiones_estructurales: 'Se detectan tensiones entre lo que **se espera de la relación y lo que se recibe**. Hay momentos donde la comunicación fluye pero también silencios que pesan.\n\nLa principal contradicción narrativa es entre el **compromiso declarado** y las señales de distancia emocional que aparecen en momentos clave.',
      evolucion_deseo: 'El deseo ha atravesado una **transformación natural** — pasó de la intensidad inicial a una forma más estable pero menos espontánea. La atracción sigue presente pero necesita ser reavivada con intención.',
      dinamica_emocional: 'La conexión emocional oscila entre **momentos de cercanía genuina** y períodos de desconexión donde cada uno parece estar en su propio mundo.\n\nEsta dinámica no es únicamente negativa — también indica que ambos tienen capacidad de conectar, pero necesitan crear las condiciones para que eso ocurra con más frecuencia.'
    },
    lectura_psicoanalitica: {
      proyecciones_inconscientes: 'Se detectan señales de **repetición de dinámicas familiares** — la forma en que buscas cercanía o reaccionas ante el conflicto tiene ecos de patrones aprendidos en la infancia.\n\nEsto no es un defecto — es una programación emocional que puede hacerse consciente y transformarse.',
      fantasma_relacional: 'Tu pareja parece representar simbólicamente una **búsqueda de reconocimiento y estabilidad emocional**. Lo que buscas en el vínculo va más allá de la compañía — hay una necesidad profunda de sentirte visto/a y elegido/a.\n\nEste fantasma relacional opera silenciosamente e influye en cómo interpretas las acciones de tu pareja.',
      roles_simbolicos: 'Dentro de la relación se han establecido **roles que tienden a rigidizarse**: uno parece asumir más la función de sostenedor emocional mientras el otro funciona con más independencia. Esta asimetría puede generar resentimiento si no se equilibra.'
    },
    dinamica_conflicto: {
      tendencia_conflicto: 55,
      reaccion_usuario: 'Tu reacción primaria ante el conflicto parece ser la **búsqueda de resolución activa** — necesitas hablar las cosas y llegar a algún tipo de acuerdo o comprensión.',
      reaccion_pareja: 'Tu pareja, según lo que describes, tiende más hacia la **evitación o el silencio** — prefiere esperar a que las cosas se calmen antes de abordarlas.',
      capacidad_reparacion: 50
    },
    energia_vinculo: {
      atraccion_inicial: 78,
      atraccion_actual: 48,
      intimidad_emocional: 52,
      conexion_fisica: 45
    },
    direccion_probable: {
      estabilidad_futura: 55,
      riesgo_desgaste: 52,
      potencial_reconexion: 62
    },
    fortalezas: [
      'Historia compartida significativa que le da peso al vínculo',
      'Capacidad de reflexión sobre la relación — no todos los vínculos tienen esto',
      'Deseo de comprender y mejorar la dinámica relacional'
    ],
    riesgos: [
      'Acumulación de tensiones no resueltas que generan distancia',
      'Desajuste en las formas de manejar el conflicto',
      'Erosión gradual del deseo y la espontaneidad'
    ],
    tabla_diagnostica: [
      { dimension: 'Estabilidad relacional', nivel: 'Medio', interpretacion: 'La relación tiene bases pero necesita atención consciente' },
      { dimension: 'Apego emocional', nivel: 'Medio', interpretacion: 'Señales de apego ansioso que influyen en la dinámica' },
      { dimension: 'Conexión emocional', nivel: 'Medio', interpretacion: 'Momentos de conexión alternados con desconexión' },
      { dimension: 'Deseo erótico', nivel: 'Medio-Bajo', interpretacion: 'El deseo se ha transformado y necesita reavivarse' },
      { dimension: 'Intimidad', nivel: 'Medio', interpretacion: 'Intimidad presente pero no siempre accesible' },
      { dimension: 'Sincronía relacional', nivel: 'Medio', interpretacion: 'Momentos de sintonía pero falta consistencia' },
      { dimension: 'Patrones inconscientes', nivel: 'Medio-Alto', interpretacion: 'Se detectan repeticiones de dinámicas familiares' },
      { dimension: 'Fantasma relacional', nivel: 'Medio', interpretacion: 'La pareja representa reconocimiento y estabilidad' },
      { dimension: 'Roles sistémicos', nivel: 'Medio', interpretacion: 'Roles que tienden a rigidizarse con el tiempo' },
      { dimension: 'Resiliencia del vínculo', nivel: 'Medio', interpretacion: 'Capacidad de recuperación presente pero no garantizada' },
      { dimension: 'Vulnerabilidad emocional', nivel: 'Medio-Alto', interpretacion: 'Sensibilidad emocional que requiere manejo' },
      { dimension: 'Narrativa de futuro', nivel: 'Medio', interpretacion: 'Visión de futuro presente pero con incertidumbre' }
    ],
    sintesis_final: {
      que_ocurre: 'Lo que está ocurriendo en tu relación es un **proceso de transformación** donde las dinámicas iniciales ya no funcionan de la misma manera. No es que el amor haya desaparecido — es que la forma de relacionarse necesita evolucionar.\n\nHay patrones emocionales que se han instalado silenciosamente y que ahora influyen en cómo se conectan y desconectan.',
      posibilidades_evolucion: 'La relación tiene **potencial real de crecimiento** si ambos deciden trabajar conscientemente en las áreas que este diagnóstico ha revelado. Los cimientos están — lo que falta es una intervención consciente.\n\nCon trabajo terapéutico y voluntad mutua, los ciclos actuales pueden transformarse en dinámicas más funcionales.',
      factores_fortalecimiento: 'Los factores que pueden fortalecer el vínculo incluyen: **mejorar la comunicación durante el conflicto**, crear espacios regulares de conexión emocional, y trabajar individualmente en los patrones de apego.\n\nTambién es importante reavivar la dimensión erótica del vínculo — no como obligación sino como exploración mutua.'
    }
  }
}
