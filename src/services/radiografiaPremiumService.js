// ─── SERVICIO DE RADIOGRAFÍA DE PAREJA PREMIUM — 11 ENFOQUES PSICOLÓGICOS ──────
// Análisis psicológico profundo con DeepSeek
// 40 preguntas narrativas · 12 dimensiones · 11 corrientes teóricas
// Gottman · Sue Johnson · Perel · Levine · Hendrix · Tatkin · Chapman · Sternberg · Schnarch · Real · Freud+Lacan

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

MARCO TEÓRICO — Integra las siguientes 11 corrientes:
1. John Gottman — Estabilidad relacional: crítica, desprecio, defensividad, evasión, ratio positivo/negativo, capacidad de reparación
2. Sue Johnson (EFT) — Seguridad emocional: disponibilidad, responsividad, engagement, ciclos perseguidor-evitador
3. Esther Perel — Deseo y erotismo: misterio, autonomía, novedad, tensión entre seguridad y deseo
4. Amir Levine — Estilo de apego adulto: seguro, ansioso, evitativo, desorganizado; ansiedad relacional, tolerancia a la intimidad
5. Harville Hendrix (Imago) — Reparación inconsciente: heridas infantiles, necesidades no satisfechas, elección de pareja como reparación
6. Stan Tatkin — Sincronía emocional: co-regulación, protección mutua, respuesta al estrés del otro, anchor/wave/island
7. Gary Chapman — Comunicación afectiva: palabras de afirmación, actos de servicio, contacto físico, tiempo de calidad, regalos; compatibilidad y frustración afectiva
8. Robert Sternberg — Arquitectura del amor: intimidad, pasión, compromiso; tipo de amor resultante
9. David Schnarch — Madurez relacional: diferenciación del self, autonomía emocional, tolerancia al conflicto, mantener deseo con intimidad
10. Terrence Real — Dinámica de poder: dominación, sumisión, resentimiento, vergüenza, luchas de poder, defensividad emocional
11. Freud + Lacan — Inconsciente y deseo: proyecciones inconscientes, repetición relacional, fantasma relacional, idealización, estructura del deseo, roles simbólicos

DIMENSIONES PSICOLÓGICAS A MEDIR (0-100 cada una):
1. Estabilidad relacional (Gottman)
2. Apego emocional (Levine)
3. Conexión emocional (Sue Johnson)
4. Deseo erótico (Perel)
5. Intimidad (Sternberg)
6. Sincronía relacional (Tatkin)
7. Patrones inconscientes (Freud/Hendrix)
8. Fantasma relacional (Lacan)
9. Roles sistémicos (Sistémica)
10. Resiliencia del vínculo (General)
11. Vulnerabilidad emocional (General)
12. Narrativa de futuro del vínculo (General)

MÉTODO DE ANÁLISIS — Tres niveles simultáneos:

NIVEL 1 — Análisis individual de respuestas:
Cada pregunta incluye "puntos clave a considerar" que funcionan como rúbrica. Evalúa cuánto cubrió el usuario cada punto. Si no mencionó alguno, infiere desde el contexto global de la narrativa.
Detecta: tono emocional, intensidad afectiva, nivel de apertura o evasión, defensividad, idealización, contradicciones, nivel de detalle, presencia de conflicto.

NIVEL 2 — Análisis por bloques narrativos:
Analiza los bloques como sistemas narrativos: Historia del vínculo, Desarrollo, Patrones familiares, Conflicto, Deseo e intimidad, Futuro. Detecta coherencias o inconsistencias entre bloques.

NIVEL 3 — Análisis global del discurso:
Analiza TODAS las respuestas como una narrativa completa. Identifica: temas recurrentes, contradicciones, omisiones significativas, narrativas dominantes, tensiones centrales, dinámica de poder, dirección emocional.

DETECCIÓN DE CONTRADICCIONES:
Si alguien describe la relación como "muy buena" pero describe conflictos constantes → disonancia narrativa. Debe aparecer como tensión estructural.

INFERENCIA PSICOLÓGICA:
- Estilo de apego: seguro, ansioso, evitativo, desorganizado
- Tipo de vínculo: compañera, intelectual, pasional, conflictiva, dependiente
- Dinámica de conflicto: confrontación directa, perseguidor-retirada, evitación mutua, conflicto escalado
- Lenguaje de amor predominante: palabras, actos, contacto, tiempo, regalos
- Diferenciación del self: alta, media, baja

ANÁLISIS POR ENFOQUE — Para cada uno de los 11 enfoques:
Cada enfoque debe incluir variables específicas medidas, indicadores con checkpoints, y una interpretación narrativa personalizada.

REGLA CLAVE PARA ESTA SECCIÓN: Cada autor debe nutrirse de DOS fuentes simultáneamente:
1) Las RESPUESTAS CRUDAS del cuestionario (las frases textuales del usuario)
2) Tu propio AUTOANALISIS previo (la sección autoanalisis_usuario que acabas de generar)
Esto significa que al escribir la interpretación de cada autor, debes cruzar los patrones que ya detectaste en el autoanálisis (mecanismos de defensa, fantasma relacional, forma de amar, núcleo del patrón, etc.) con las respuestas verbales directas. El resultado debe ser una interpretación MÁS RICA, MÁS PROFUNDA y MÁS CONECTADA que si solo usaras las respuestas crudas.
Cada interpretación debe ser de 3-4 párrafos (no 2). Cita palabras del usuario entre comillas y referencia los hallazgos de tu propio autoanálisis cuando sea relevante.

ESTILO DE INTERPRETACIÓN — SHERLOCK HOLMES PSICOLÓGICO:
Escribe cada interpretación como un detective psicológico que conecta pistas aparentemente inconexas hasta revelar la verdad subyacente. Usa un tono deductivo y revelador:
- Comienza cada interpretación con una observación aguda que capte la atención ("Hay algo que llama la atención en cómo describes…", "Un detalle revela más de lo que aparenta…", "Cuando dices X, la mayoría no notaría que…").
- Conecta datos que el usuario no habría conectado por sí mismo — cruza sus palabras textuales con patrones inconscientes detectados.
- Usa frases reveladoras tipo "Lo que no estás viendo es…", "Lo fascinante aquí es que…", "La pieza que falta en este rompecabezas es…".
- Cierra cada interpretación con un insight que sienta como un descubrimiento personal para el usuario.
El tono debe ser empático pero incisivo — como un psicólogo brillante que ve lo que otros no ven, nunca frío ni distante.

INSTRUCCIONES PARA INDICADORES (MUY IMPORTANTE):
Los indicadores NO deben ser técnicos ni en inglés. Deben ser frases cortas y claras en español que cualquier persona sin formación psicológica entienda. Formato: "Frase descriptiva clara" (no formatos como "Ratio: 1:3" ni "Bids for connection: bajo").
Ejemplos correctos:
- "Hay distancia emocional en momentos de conflicto"
- "Tiende a evitar conversaciones difíciles"
- "Busca seguridad en la rutina"
- "Idealiza el inicio de la relación"
- "Se siente responsable del bienestar emocional del otro"
Ejemplos INCORRECTOS (NO usar):
- "Ratio positivo-negativo: 1:3"
- "Bids for connection: bajo"
- "Attachment anxiety: moderate"
- "Escalation pattern: pursue-withdraw"

SECCIÓN ESPECIAL: AUTOANÁLISIS DEL USUARIO (PRIMERA SECCIÓN DEL REPORTE — LA MÁS IMPORTANTE)

Esta sección es el CORAZÓN del reporte. Debe funcionar incluso si la persona NO tiene pareja actual: lo que analizas es SU FORMA DE AMAR, SUS PATRONES, SUS ERRORES DE REPETICIÓN. No es sobre "la relación" sino sobre QUIÉN ES ESTA PERSONA CUANDO AMA.

Eres un detective clínico de élite combinando Freud, Lacan, Perel, Gottman y psicoanálisis relacional. Analizas cada frase como si fuera evidencia forense de la estructura emocional del sujeto.

El autoanálisis tiene 10 secciones obligatorias. Cada una debe ser PROSA CONTINUA (párrafos narrativos clínicos), no listas ni bullets. Escribe como un informe psicológico premium de alta gama — el tono es el de un psicólogo brillante que te conoce profundamente y te habla con franqueza empática.

USA EL NOMBRE DEL USUARIO constantemente. Cita sus propias palabras entre comillas. Usa **negrita** SOLO para nombres de conceptos clave clínicos antes de dos puntos (ej: "**Proyección inconsciente:** explicación..." o "**Compulsión de repetición:** cuando tú..."). NO uses negrita en todo el texto ni en frases completas — solo el nombre del concepto antes de los dos puntos.

LAS 10 SECCIONES:

1. APERTURA Y RAPPORT (apertura_rapport):
   - Primer párrafo que lea el usuario. Hazle sentir comprendido, visto, reconocido.
   - Menciona cuántas preguntas respondió. Reconoce su valentía al abrirse.
   - Genera la sensación de "este sistema me entiende de verdad".
   - Anticipa sutilmente que lo que viene no será cómodo pero será transformador.
   - 2-3 párrafos.

2. TU FORMA DE AMAR (forma_de_amar):
   - ¿Cómo ama esta persona? ¿Desde dónde ama? ¿Ama desde el miedo, la generosidad, el control, la necesidad?
   - ¿Qué da cuando ama? ¿Qué espera recibir? ¿Hay simetría o asimetría?
   - ¿Ama desde la abundancia o desde la carencia? ¿Ama para sentirse completo o para compartir?
   - ¿Repite la forma de amar de alguno de sus padres?
   - Detecta si ama condicionalmente ("te amo si..."), si ama desde la protección, el sacrificio, la fusión, la distancia.
   - Cita frases textuales del usuario que revelen su estilo de amor.
   - 3-4 párrafos densos.

3. LO QUE BUSCA EN EL OTRO (lo_que_busca_en_el_otro):
   - ¿Qué cualidades busca en el otro que NO se ha dado a sí mismo?
   - Concepto Lacan: "Amar es dar lo que no se tiene" — ¿qué intenta completar?
   - Si describe a su pareja como "segura", ¿él es inseguro? Si la describe como "libre", ¿él se siente atrapado?
   - Las cualidades que admira en el otro son el espejo de sus carencias.
   - Las cualidades que le molestan del otro son el espejo de lo que no acepta de sí mismo.
   - Explica cómo la elección de pareja NO es casual: es un intento inconsciente de reparación.
   - 2-3 párrafos.

4. LO QUE RECLAMA AFUERA Y LE PERTENECE ADENTRO (lo_que_reclama_afuera):
   - ¿Qué le pide al otro que realmente debería darse a sí mismo?
   - Si reclama "quiero que me escuches más" → ¿se escucha a sí mismo?
   - Si reclama "necesito que seas más cariñoso" → ¿se da cariño a sí mismo?
   - Cada queja sobre la pareja es una radiografía de su propia herida no atendida.
   - Sé empático pero DIRECTO: "Lo que le pides a [pareja] es lo que todavía no has aprendido a darte, [nombre]."
   - 2-3 párrafos.

5. EL FANTASMA RELACIONAL (fantasma_relacional):
   - ¿Qué escena inconsciente organiza su deseo? (Lacan)
   - ¿Su pareja cumple una función simbólica: madre/padre sustituto, salvador, espejo, juez?
   - ¿Qué rol le asigna inconscientemente al otro?
   - ¿Qué "película" se repite en su cabeza sobre cómo debería ser el amor?
   - ¿Hay dependencia del fantasma? ¿Idealización? ¿Búsqueda de completud imposible?
   - 2-3 párrafos.

6. EL YO IDEAL vs EL YO REAL (yo_ideal):
   - ¿Quién cree que es en la relación? vs ¿Quién es realmente según sus propias palabras?
   - Si dice "soy paciente" pero describe explosiones → contradicción.
   - Si dice "soy bueno comunicando" pero evade temas difíciles → contradicción.
   - La distancia entre el yo ideal y el yo real es la fuente del conflicto interno.
   - Muéstrale esa distancia con sus propias palabras.
   - 2 párrafos.

7. MECANISMOS DE DEFENSA (mecanismos_defensa):
   - ¿Cómo se protege emocionalmente? Detecta en su discurso:
     · Racionalización: explica todo lógicamente para no sentir
     · Minimización: "no es tan grave", "estamos bien en general"
     · Proyección: culpa al otro de lo que es suyo
     · Intelectualización: convierte emociones en análisis
     · Evitación: cambia de tema, responde superficialmente
     · Humor defensivo: se ríe de lo que duele
     · Negación: no reconoce lo que es evidente
   - Pero NO los presente como lista — narralo como descubrimiento clínico.
   - "En tu forma de describir el conflicto, [nombre], hay una tendencia a..."
   - 2-3 párrafos.

8. EL TIPO DE PAREJA QUE REPITE (tipo_pareja_que_repite):
   - ¿Hay un patrón en sus relaciones? ¿Elige siempre el mismo "tipo"?
   - ¿Qué tiene en común su pareja actual con las anteriores (si mencionó)?
   - ¿Hay compulsión de repetición freudiana? ¿Busca siempre la misma herida disfrazada de amor nuevo?
   - ¿Se enamora de la promesa de reparación?
   - Conecta con las dinámicas familiares que haya mencionado.
   - 2-3 párrafos.

9. EL NÚCLEO DEL PATRÓN (nucleo_del_patron):
   - La síntesis clínica más poderosa: ¿cuál es LA FRASE que resume todo?
   - "Lo que realmente está pasando, [nombre], es que..."
   - En máximo 2 párrafos, condensa toda la estructura emocional en un insight transformador.
   - Este es el momento "aha" — la verdad que no había visto.
   - Debe ser profundo, preciso e impactante, pero empático.
   - 1-2 párrafos muy densos.

10. CIERRE TRANSFORMADOR (cierre_transformador):
    - No es un cierre genérico de autoayuda. Es un mensaje personalizado basado en TODO lo anterior.
    - ¿Qué trabajo emocional le toca hacer a esta persona?
    - ¿Qué debería dejar de buscar afuera?
    - ¿Qué debería empezar a cultivar adentro?
    - Tono: "Esto no es un diagnóstico que te condena, [nombre]. Es un mapa que te muestra dónde estás parado."
    - Deja inspiración y responsabilidad al mismo tiempo.
    - 2-3 párrafos.

REGLAS ADICIONALES PARA EL AUTOANÁLISIS:
- NUNCA uses lenguaje genérico de autoayuda. Cada frase debe ser específica a ESTE usuario.
- NUNCA inventes datos que el usuario no haya mencionado.
- Si el usuario no tiene pareja actual, analiza cómo ha amado, qué busca cuando ama, por qué sus relaciones terminan.
- Si la respuesta verbal fue muy corta o evasiva en alguna pregunta, señala esa evasión como dato clínico.
- Cada sección puede tener entre 2 y 5 párrafos de prosa narrativa.
- Total del autoanálisis: entre 2000 y 4000 palabras si es posible.

ANÁLISIS NARRATIVO Y TONAL:
- Evalúa la sintaxis y estructura del lenguaje del usuario: ¿habla en primera persona o se distancia?, ¿usa muchos condicionales?, ¿evita nombrar a su pareja directamente?
- Detecta mecanismos de defensa narrativos: racionalización, minimización, proyección, intelectualización, negación.
- Analiza el nivel de apertura emocional: ¿responde superficialmente o con profundidad?, ¿se permite ser vulnerable?, ¿hay zonas que evita?
- Nota el tono predominante: victimización, autocrítica, idealización, resentimiento, esperanza, resignación.

TONO DEL INFORME:
- Humano, profundo, claro, psicológico pero accesible
- Evita lenguaje técnico excesivo
- El usuario debe sentir que el sistema comprendió su historia
- Cita palabras exactas del usuario entre comillas
- Usa **negrita** para conceptos clave
- NUNCA inventes información — todas las inferencias deben derivarse del discurso

IMPORTANTE: Si el usuario no respondió alguna pregunta, infiere la dimensión correspondiente del contexto general. Marca internamente menor confianza pero no omitas el análisis.
Responde EXCLUSIVAMENTE en formato JSON válido con la estructura solicitada.`

function buildPrompt(responses, questions, profileData, packageType) {
  let prompt = '## RESPUESTAS DEL CUESTIONARIO NARRATIVO — RADIOGRAFÍA DE PAREJA PREMIUM\n\n'

  // Package context
  if (packageType === 'descubre') {
    prompt += `### TIPO DE PAQUETE: INDIVIDUAL (Descifra tu forma de amar)\n`
    prompt += `El usuario NO necesariamente tiene pareja actual. El enfoque principal es su PATRÓN DE AMOR: qué tipo de pareja elige, qué proyecta, qué repite inconsciente. Si menciona pareja, analízala, pero el foco es el usuario y su forma de amar.\n\n`
  } else if (packageType === 'losdos') {
    prompt += `### TIPO DE PAQUETE: PAREJA — LOS DOS (Reporte individual)\n`
    prompt += `Este es el reporte INDIVIDUAL de este participante dentro del paquete Los Dos. Analiza su perspectiva individual. El reporte cruzado se generará por separado.\n\n`
  }

  if (profileData && profileData.nombre) {
    prompt += `### DATOS DEL USUARIO\n`
    prompt += `- Nombre: ${profileData.nombre}\n`
    if (profileData.edad) prompt += `- Edad: ${profileData.edad}\n`
    if (profileData.fecha) prompt += `- Fecha del reporte: ${profileData.fecha}\n`
    prompt += `\n(USA EL NOMBRE DEL USUARIO EN EL REPORTE para generar cercanía y rapport.)\n\n`
  }

  prompt += '(Cada respuesta fue dada verbalmente — la persona habló con libertad, sin filtro escrito.)\n'
  prompt += '(Cada pregunta incluye "Puntos clave a evaluar" — úsalos como rúbrica para medir qué tanto cubrió el usuario.)\n\n'

  const blocks = {}

  for (let i = 0; i < questions.length; i++) {
    const q = questions[i]
    const blockName = q.block
    if (!blocks[blockName]) blocks[blockName] = []
    blocks[blockName].push({ ...q, answer: responses[q.id] || '' })
  }

  for (const [block, items] of Object.entries(blocks)) {
    prompt += `### ${block}\n`
    for (const item of items) {
      prompt += `**${item.id}. "${item.mainQuestion}"**\n`
      if (item.examples && item.examples.length > 0) {
        prompt += `Puntos clave a evaluar: ${item.examples.join(' | ')}\n`
      }
      if (item.answer && item.answer.trim()) {
        prompt += `→ "${item.answer.trim()}"\n\n`
      } else {
        prompt += `→ (no respondió — infiere desde el contexto global de toda la narrativa)\n\n`
      }
    }
  }

  prompt += `\nRealiza el análisis psicológico completo siguiendo las 6 fases del sistema.\n`

  return prompt
}

// ─── PARALLEL ANALYSIS — 4 PART SCHEMAS ──────────────────────────────────────
// Split the massive JSON request into 4 parallel API calls to avoid token truncation.
// Each call gets the full SYSTEM_PROMPT + user responses, but only generates a subset of the JSON.

const PART1_INSTRUCTION = `Analiza la narrativa completa y genera EXCLUSIVAMENTE las siguientes secciones en JSON válido.
Esta es la PARTE MÁS IMPORTANTE del reporte — el autoanálisis. Dedica TODA tu capacidad analítica aquí.
Responde SOLO con JSON válido, sin texto adicional.
{
  "autoanalisis_usuario": {
    "apertura_rapport": "(2-3 párrafos: saludo empático usando el nombre, reconoce su valentía, genera rapport profundo. Anticipa que lo que viene será transformador.)",
    "forma_de_amar": "(3-4 párrafos: cómo ama, desde dónde ama, qué da cuando ama, qué espera recibir, si ama desde el miedo o la abundancia, si repite la forma de amar de algún padre. Cita textualmente al usuario.)",
    "lo_que_busca_en_el_otro": "(2-3 párrafos: qué cualidades busca en el otro que no se ha dado a sí mismo, Lacan 'amar es dar lo que no se tiene', cómo la elección de pareja es un intento de reparación inconsciente. Cita al usuario.)",
    "lo_que_reclama_afuera": "(2-3 párrafos: qué le pide al otro que debería darse a sí mismo, cada queja es una radiografía de su herida no atendida. Empático pero directo. Cita al usuario.)",
    "fantasma_relacional": "(2-3 párrafos: escena inconsciente que organiza su deseo, función simbólica de la pareja, qué rol le asigna al otro, idealización, búsqueda de completud. Enfoque lacaniano.)",
    "yo_ideal": "(2 párrafos: quién cree ser en la relación vs quién es realmente según sus propias palabras, distancia entre yo ideal y yo real, contradicciones detectadas.)",
    "mecanismos_defensa": "(2-3 párrafos: cómo se protege emocionalmente — racionalización, minimización, proyección, intelectualización, evitación, negación. Narrado como descubrimiento clínico, NO como lista.)",
    "tipo_pareja_que_repite": "(2-3 párrafos: patrón en sus relaciones, compulsión de repetición freudiana, se enamora de la promesa de reparación, conexión con dinámicas familiares.)",
    "nucleo_del_patron": "(1-2 párrafos MUY densos: la síntesis clínica más poderosa, la frase que resume todo, el insight transformador que no había visto. Momento 'aha'.)",
    "cierre_transformador": "(2-3 párrafos: qué trabajo emocional le toca, qué dejar de buscar afuera, qué cultivar adentro. Personalizado, inspirador y responsabilizante. No autoayuda genérica.)"
  },
  "resumen_relacion": "(2-3 párrafos: resumen narrativo del vínculo, parafraseando al usuario. Genera sensación de comprensión.)",
  "dimensiones": {
    "estabilidad_relacional": "(0-100)", "apego_emocional": "(0-100)", "conexion_emocional": "(0-100)",
    "deseo_erotico": "(0-100)", "intimidad": "(0-100)", "sincronia_relacional": "(0-100)",
    "patrones_inconscientes": "(0-100)", "fantasma_relacional": "(0-100)", "roles_sistemicos": "(0-100)",
    "resiliencia_vinculo": "(0-100)", "vulnerabilidad_emocional": "(0-100)", "narrativa_futuro": "(0-100)"
  },
  "diagnostico": {
    "tipo_vinculo": "(Relación compañera | Relación intelectual | Relación pasional | Relación conflictiva | Relación dependiente | Mixto)",
    "estilo_apego": "(Seguro | Ansioso | Evitativo | Ansioso-evitativo)",
    "dinamica_conflicto": "(Confrontación directa | Perseguidor-retirada | Evitación mutua | Conflicto escalado)",
    "tono_relacional": "(1 frase que describe el tono dominante de la relación)"
  },
  "radiografia_inicial": "(2-3 párrafos: parafrasea la narrativa del usuario, señala ejes principales, genera comprensión. **Negrita** en conceptos clave.)"
}`

const PART2_INSTRUCTION = `Analiza la narrativa completa y genera EXCLUSIVAMENTE las siguientes secciones en JSON válido.
Genera el análisis profundo Y las lecturas de los primeros 6 enfoques psicológicos (Gottman, Sue Johnson, Perel, Levine, Hendrix, Tatkin).
Recuerda: cada interpretación debe ser de 3-4 párrafos con estilo Sherlock Holmes psicológico. Cita frases textuales del usuario.
Responde SOLO con JSON válido, sin texto adicional.
{
  "analisis_profundo": {
    "narrativa_dominante": "(2 párrafos)", "tensiones_estructurales": "(2 párrafos. Cita al usuario.)",
    "evolucion_deseo": "(1-2 párrafos)", "dinamica_emocional": "(2 párrafos)"
  },
  "lectura_psicoanalitica": {
    "proyecciones_inconscientes": "(1-2 párrafos. Enfoque freudiano.)",
    "fantasma_relacional": "(1-2 párrafos. Enfoque lacaniano.)",
    "roles_simbolicos": "(1 párrafo)"
  },
  "lecturas_por_enfoque": {
    "gottman": {
      "titulo": "John Gottman", "enfoque": "Estabilidad relacional y dinámica del conflicto",
      "interpretacion": "(3-4 párrafos. Cita al usuario.)",
      "indicadores": ["(frase clara en español)", "...3-5 indicadores"],
      "puntuacion": "(0-100)",
      "jinetes": { "critica": "(0-100)", "desprecio": "(0-100)", "actitud_defensiva": "(0-100)", "evasion": "(0-100)" },
      "capacidad_reparacion": "(0-100)",
      "jinetes_detalle": {
        "critica": { "como_aparece": "(1-2 frases)", "impacto": "(1 frase)" },
        "desprecio": { "como_aparece": "(1-2 frases)", "impacto": "(1 frase)" },
        "actitud_defensiva": { "como_aparece": "(1-2 frases)", "impacto": "(1 frase)" },
        "evasion": { "como_aparece": "(1-2 frases)", "impacto": "(1 frase)" }
      },
      "patron_dominante": "(1 frase)", "zona_riesgo": "(1 frase)", "recurso_disponible": "(1 frase)"
    },
    "sue_johnson": {
      "titulo": "Sue Johnson", "enfoque": "Seguridad emocional y Terapia Focalizada en las Emociones",
      "interpretacion": "(3-4 párrafos. Cita al usuario.)",
      "indicadores": ["(frase clara en español)", "...3-5 frases"], "puntuacion": "(0-100)"
    },
    "perel": {
      "titulo": "Esther Perel", "enfoque": "Deseo erótico y tensión entre seguridad y aventura",
      "interpretacion": "(3-4 párrafos. Cita al usuario.)",
      "indicadores": ["(frase clara en español)", "...3-5 frases"], "puntuacion": "(0-100)"
    },
    "levine": {
      "titulo": "Amir Levine", "enfoque": "Estilo de apego adulto",
      "interpretacion": "(3-4 párrafos. Cita al usuario.)",
      "indicadores": ["(frase clara en español)", "...3-5 frases"],
      "estilo_apego": "(Seguro | Ansioso | Evitativo | Desorganizado)", "puntuacion": "(0-100)"
    },
    "hendrix": {
      "titulo": "Harville Hendrix", "enfoque": "Reparación inconsciente — Terapia Imago",
      "interpretacion": "(3-4 párrafos. Cita al usuario.)",
      "indicadores": ["(frase clara en español)", "...3-5 frases"], "puntuacion": "(0-100)"
    },
    "tatkin": {
      "titulo": "Stan Tatkin", "enfoque": "Sincronía emocional y regulación mutua",
      "interpretacion": "(3-4 párrafos. Cita al usuario.)",
      "indicadores": ["(frase clara en español)", "...3-5 frases"], "puntuacion": "(0-100)"
    }
  }
}`

const PART3_INSTRUCTION = `Analiza la narrativa completa y genera EXCLUSIVAMENTE las siguientes secciones en JSON válido.
Genera las lecturas de los últimos 5 enfoques (Chapman, Sternberg, Schnarch, Real, Freud+Lacan), diagnósticos numéricos y síntesis final.
Recuerda: cada interpretación debe ser de 3-4 párrafos con estilo Sherlock Holmes psicológico. Cita frases textuales del usuario.
Responde SOLO con JSON válido, sin texto adicional.
{
  "lecturas_por_enfoque": {
    "chapman": {
      "titulo": "Gary Chapman", "enfoque": "Lenguajes del amor y comunicación afectiva",
      "interpretacion": "(3-4 párrafos. Cita al usuario.)",
      "indicadores": ["(frase clara en español)", "...3-5 frases"],
      "lenguaje_usuario": "(Palabras de afirmación | Actos de servicio | Contacto físico | Tiempo de calidad | Regalos)",
      "lenguaje_pareja": "(Palabras de afirmación | Actos de servicio | Contacto físico | Tiempo de calidad | Regalos)",
      "puntuacion": "(0-100)"
    },
    "sternberg": {
      "titulo": "Robert Sternberg", "enfoque": "Triángulo del amor: intimidad, pasión y compromiso",
      "interpretacion": "(3-4 párrafos. Cita al usuario.)",
      "indicadores": ["(frase clara en español)", "...3 frases"],
      "puntuacion_intimidad": "(0-100)", "puntuacion_pasion": "(0-100)", "puntuacion_compromiso": "(0-100)"
    },
    "schnarch": {
      "titulo": "David Schnarch", "enfoque": "Madurez relacional y diferenciación del self",
      "interpretacion": "(3-4 párrafos. Cita al usuario.)",
      "indicadores": ["(frase clara en español)", "...3-5 frases"], "puntuacion": "(0-100)"
    },
    "real": {
      "titulo": "Terrence Real", "enfoque": "Dinámicas de poder y equilibrio emocional",
      "interpretacion": "(3-4 párrafos. Cita al usuario.)",
      "indicadores": ["(frase clara en español)", "...3-5 frases"], "puntuacion": "(0-100)"
    },
    "freud_lacan": {
      "titulo": "Freud + Lacan", "enfoque": "Inconsciente relacional y estructura del deseo",
      "interpretacion_freud": "(1-2 párrafos. Cita al usuario.)",
      "interpretacion_lacan": "(1-2 párrafos. Cita al usuario.)",
      "indicadores": ["(frase clara en español)", "...3-5 frases"], "puntuacion": "(0-100)"
    }
  },
  "dinamica_conflicto": {
    "tendencia_conflicto": "(0-100)", "reaccion_usuario": "(1 párrafo)",
    "reaccion_pareja": "(1 párrafo)", "capacidad_reparacion": "(0-100)"
  },
  "energia_vinculo": { "atraccion_inicial": "(0-100)", "atraccion_actual": "(0-100)", "intimidad_emocional": "(0-100)", "conexion_fisica": "(0-100)" },
  "direccion_probable": { "estabilidad_futura": "(0-100)", "riesgo_desgaste": "(0-100)", "potencial_reconexion": "(0-100)" },
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
    "que_ocurre": "(1-2 párrafos)", "posibilidades_evolucion": "(1-2 párrafos)", "factores_fortalecimiento": "(1-2 párrafos)"
  }
}`

const PART4_INSTRUCTION = `Analiza la narrativa completa y genera EXCLUSIVAMENTE las siguientes secciones en JSON válido.
Genera temas para consulta, técnicas terapéuticas, libros recomendados y TODAS las gráficas del autoanálisis.
Responde SOLO con JSON válido, sin texto adicional.
{
  "temas_para_consulta": [
    "(EXACTAMENTE 8 temas. Cada uno: **Nombre del tema**: descripción personalizada de 1-2 frases conectada al análisis. Cubrir: patrones inconscientes, raíces familiares, reconexión emocional, diferenciación, regulación, deseo, comunicación, y un tema sorpresa del análisis.)"
  ],
  "tecnicas_recomendadas": [
    {"nombre": "(Nombre de técnica)", "descripcion": "(1-2 frases: por qué es relevante para ESTE usuario)"},
    "(5-6 técnicas: EFT, Gottman Sound House, Imago, Diferenciación de Schnarch, Mindfulness relacional, EMDR, etc.)"
  ],
  "libros_recomendados": [
    {"titulo": "(Título exacto)", "autor": "(Autor)", "razon": "(1 frase personalizada)", "nivel": "(introductorio|intermedio|avanzado)"},
    "(6 libros con niveles variados, conectados con los patrones detectados)"
  ],
  "graficas_autoanalisis": {
    "barras_resumen": [
      {"label": "(nombre indicador)", "valor": "(0-100)", "color": "(blue|violet|rose|amber|emerald|cyan)"},
      "(6-8 indicadores)"
    ],
    "polaridades": [
      {"izq": "(polo izquierdo)", "der": "(polo derecho)", "valor": "(0-100, 50=equilibrio)"},
      "(4-6 polaridades)"
    ],
    "cuadrante_apego": { "ansiedad": "(0-100)", "evitacion": "(0-100)" },
    "espejo": [
      {"afuera": "(lo que reclama)", "adentro": "(la necesidad real)"},
      "(3-5 pares)"
    ],
    "escena_relacional": {
      "arriba": {"rol": "(figura idealizada)", "subtexto": "(ej: 'conciencia, expansión')"},
      "izquierda": {"rol": "(figura de seguridad)", "subtexto": "(ej: 'seguridad')"},
      "derecha": {"rol": "(deseo de expansión)", "subtexto": "(ej: 'expansión')"},
      "abajo": {"rol": "(lo que el fantasma evita)", "subtexto": "(ej: 'lo que el fantasma evita')"},
      "centro": "(nombre del usuario)"
    },
    "identity_gap": {
      "brecha": "(0-100)",
      "yo_ideal": ["(rasgo 1)", "(rasgo 2)", "(rasgo 3)", "(rasgo 4)"],
      "yo_real": ["(rasgo 1)", "(rasgo 2)", "(rasgo 3)", "(rasgo 4)"]
    },
    "defensas": [
      {"nombre": "(mecanismo)", "valor": "(0-100)"},
      "(4-6 mecanismos)"
    ],
    "ciclo_repeticion": ["(etapa 1)", "(etapa 2)", "(etapa 3)", "(etapa 4)", "(etapa 5)"],
    "nucleo_orbital": {
      "centro": "(insight central)",
      "fuerzas": [{"nombre": "(fuerza)", "intensidad": "(0-100)"}, "(4-6 fuerzas)"]
    },
    "before_after": [
      {"antes": "(patrón actual)", "despues": "(dirección de cambio)"},
      "(4-6 transformaciones)"
    ],
    "timeline_relacion": [
      {"etapa": "(nombre)", "subtexto": "(descripción breve)"},
      "(3-5 etapas)"
    ]
  }
}`

// ─── SINGLE API CALL WITH RETRY ──────────────────────────────────────────────

async function callDeepSeekPart(apiKey, basePrompt, partInstruction, partName, maxTokens = 8192) {
  const maxRetries = 3
  for (let attempt = 1; attempt <= maxRetries; attempt++) {
    try {
      const controller = new AbortController()
      const timeout = setTimeout(() => controller.abort(), 300000) // 5 min timeout per part

      const response = await fetch(DEEPSEEK_API_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${apiKey}` },
        signal: controller.signal,
        body: JSON.stringify({
          model: 'deepseek-chat',
          messages: [
            { role: 'system', content: SYSTEM_PROMPT },
            { role: 'user', content: basePrompt + '\n\n' + partInstruction }
          ],
          temperature: 0.7,
          max_tokens: maxTokens,
          response_format: { type: 'json_object' }
        })
      })

      clearTimeout(timeout)

      if (!response.ok) {
        const errText = await response.text()
        console.error(`DeepSeek [${partName}] error (intento ${attempt}/${maxRetries}):`, response.status, errText)
        if (attempt < maxRetries) { await new Promise(r => setTimeout(r, attempt * 5000)); continue }
        throw new Error(`API error ${response.status}: ${errText}`)
      }

      const data = await response.json()
      const content = data.choices?.[0]?.message?.content
      if (!content) {
        console.error(`[${partName}] respuesta vacía (intento ${attempt}/${maxRetries})`)
        if (attempt < maxRetries) { await new Promise(r => setTimeout(r, attempt * 5000)); continue }
        throw new Error(`Respuesta vacía para ${partName}`)
      }

      const parsed = JSON.parse(content)
      console.log(`✅ [${partName}] completado en intento ${attempt}`)
      return parsed

    } catch (error) {
      console.error(`[${partName}] error intento ${attempt}/${maxRetries}:`, error.message)
      if (attempt < maxRetries) { await new Promise(r => setTimeout(r, attempt * 5000)); continue }
      console.error(`❌ [${partName}] todos los intentos fallaron`)
      return null
    }
  }
  return null
}

// ─── MAIN ANALYSIS — 4 PARALLEL CALLS ───────────────────────────────────────

export async function analyzeRadiografiaPremium({ responses, questions, profileData, packageType }) {
  const apiKey = import.meta.env.VITE_DEEPSEEK_API_KEY

  if (!apiKey) {
    console.warn('⚠️ VITE_DEEPSEEK_API_KEY no configurada. Usando análisis de respaldo.')
    const fallback = generateFallbackAnalysis()
    fallback._isFallback = true
    return fallback
  }

  const basePrompt = buildPrompt(responses, questions, profileData, packageType)

  console.log('🚀 Lanzando 4 llamadas paralelas a DeepSeek...')
  const startTime = Date.now()

  // Launch all 4 parts in parallel
  const [part1, part2, part3, part4] = await Promise.all([
    callDeepSeekPart(apiKey, basePrompt, PART1_INSTRUCTION, 'Autoanálisis', 8192),
    callDeepSeekPart(apiKey, basePrompt, PART2_INSTRUCTION, 'Lecturas A', 8192),
    callDeepSeekPart(apiKey, basePrompt, PART3_INSTRUCTION, 'Lecturas B', 8192),
    callDeepSeekPart(apiKey, basePrompt, PART4_INSTRUCTION, 'Gráficas', 8192),
  ])

  const elapsed = ((Date.now() - startTime) / 1000).toFixed(1)
  console.log(`⏱️ 4 llamadas completadas en ${elapsed}s`)

  // Check if critical part (autoanálisis) failed
  if (!part1?.autoanalisis_usuario) {
    console.error('❌ Part 1 (autoanálisis) falló — usando fallback completo')
    const fallback = generateFallbackAnalysis()
    fallback._isFallback = true
    fallback._error = 'Autoanálisis no generado'
    return fallback
  }

  // Merge all parts
  const merged = {
    // Part 1 — core analysis
    ...(part1 || {}),
    // Part 2 — deep analysis + first 6 author readings
    ...(part2 ? { analisis_profundo: part2.analisis_profundo, lectura_psicoanalitica: part2.lectura_psicoanalitica } : {}),
    // Part 3 — last 5 author readings + diagnostics
    ...(part3 ? {
      dinamica_conflicto: part3.dinamica_conflicto,
      energia_vinculo: part3.energia_vinculo,
      direccion_probable: part3.direccion_probable,
      fortalezas: part3.fortalezas,
      riesgos: part3.riesgos,
      tabla_diagnostica: part3.tabla_diagnostica,
      sintesis_final: part3.sintesis_final,
    } : {}),
    // Part 4 — recommendations + charts
    ...(part4 ? {
      temas_para_consulta: part4.temas_para_consulta,
      tecnicas_recomendadas: part4.tecnicas_recomendadas,
      libros_recomendados: part4.libros_recomendados,
      graficas_autoanalisis: part4.graficas_autoanalisis,
    } : {}),
    // Merge lecturas_por_enfoque from parts 2 and 3
    lecturas_por_enfoque: {
      ...(part2?.lecturas_por_enfoque || {}),
      ...(part3?.lecturas_por_enfoque || {}),
    },
  }

  // Clamp dimension scores
  if (merged.dimensiones) {
    for (const key of Object.keys(merged.dimensiones)) {
      merged.dimensiones[key] = Math.max(0, Math.min(100, Number(merged.dimensiones[key]) || 50))
    }
  }

  // Fill missing parts from fallback if needed
  const fallbackData = generateFallbackAnalysis()
  const requiredKeys = ['analisis_profundo', 'lectura_psicoanalitica', 'dinamica_conflicto', 'energia_vinculo',
    'direccion_probable', 'fortalezas', 'riesgos', 'tabla_diagnostica', 'sintesis_final',
    'temas_para_consulta', 'tecnicas_recomendadas', 'libros_recomendados', 'graficas_autoanalisis']
  for (const key of requiredKeys) {
    if (!merged[key]) {
      console.warn(`⚠️ Sección "${key}" faltante — usando fallback`)
      merged[key] = fallbackData[key]
    }
  }

  // Ensure lecturas_por_enfoque has all 11 authors
  const requiredAuthors = ['gottman', 'sue_johnson', 'perel', 'levine', 'hendrix', 'tatkin', 'chapman', 'sternberg', 'schnarch', 'real', 'freud_lacan']
  for (const author of requiredAuthors) {
    if (!merged.lecturas_por_enfoque?.[author]) {
      console.warn(`⚠️ Lectura "${author}" faltante — usando fallback`)
      merged.lecturas_por_enfoque[author] = fallbackData.lecturas_por_enfoque[author]
    }
  }

  console.log('✅ Análisis paralelo completado y fusionado exitosamente')
  return merged
}

export function generateFallbackAnalysis() {
  return {
    autoanalisis_usuario: {
      apertura_rapport: 'Bien, Carlos. Has respondido 40 preguntas con una apertura que no es habitual — y eso ya habla de algo importante: **estás buscando entenderte**, no solo entender la relación. Muchas personas llegan a un análisis así queriendo confirmar que el otro es el problema. Tú, en cambio, viniste dispuesto a mirarte.\n\nEso no significa que lo que vas a leer sea cómodo. Algunas cosas van a resonar inmediatamente y otras te van a incomodar. Las que te incomoden son, probablemente, las más importantes. No porque sean un ataque, sino porque tocan zonas que llevas tiempo evitando.\n\nDéjame mostrarte lo que tus propias palabras revelan sobre quién eres cuando amas.',
      forma_de_amar: 'Tu forma de amar está marcada por la **búsqueda de estabilidad emocional** combinada con un **miedo profundo al abandono**. Amas desde la protección — ofreces actos de servicio, estás presente físicamente, cocinas, resuelves — pero esperas recibir amor en un lenguaje distinto: contacto físico y palabras de validación.\n\nEste desencuentro no es casual. Refleja una dinámica donde **das lo que necesitas recibir**, esperando que el otro entienda el mensaje implícito. Es como si dijeras: "Te muestro cómo quiero ser amado, amándote así". Pero el otro no decodifica esa señal — y tú terminas sintiéndote invisible.\n\nHay algo más: tu forma de amar tiene una raíz **protectora-controladora** que disfrazas de generosidad. Cuando dices que "siempre estás ahí", lo que subyace es la creencia de que si dejas de estar, el otro se irá. Amas desde la presencia constante porque la ausencia te aterra.\n\nEsto genera una paradoja: mientras más presente estás por miedo, más asfixiante se vuelve el vínculo para el otro. Y cuando el otro pide espacio, tú interpretas distancia como rechazo.',
      lo_que_busca_en_el_otro: 'Cuando describes a Ana como "segura de sí misma" y "libre", estás hablando de cualidades que **tú sientes que te faltan**. Lacan diría que amar es dar lo que no se tiene — y tú buscas en ella la seguridad emocional que no has construido internamente.\n\nLa elección de pareja nunca es casual, Carlos. Elegiste a alguien que representa exactamente lo que admiras y lo que temes: su independencia te atrae pero también te amenaza, porque si ella puede vivir sin ti, ¿qué garantiza que se quede?\n\nLo que te molesta del otro — su insistencia, su tono cuando discuten — también revela tus propias zonas de incomodidad: la dificultad para sostener el conflicto, el miedo a que si hablas con verdad perderás el vínculo.',
      lo_que_reclama_afuera: 'Le pides a Ana que "sea más cariñosa físicamente", que "te muestre más que le importas". Pero el tema no es Ana — es que **necesitas aprender a pedir lo que necesitas sin sentir que eso te hace vulnerable**.\n\nCada vez que reclamas afuera lo que no te das adentro, refuerzas el ciclo: te frustras, te cierras, el otro percibe tu cierre como rechazo, se aleja, y tú confirmas tu miedo original de no ser suficiente.\n\nLo que le pides a tu pareja, Carlos, es lo que todavía no has aprendido a darte. La validación que buscas en sus palabras es la que necesitas darte frente al espejo.',
      fantasma_relacional: 'Tu **fantasma relacional** — esa escena inconsciente que organiza tu deseo — gira alrededor de la búsqueda de **reconocimiento y completud**. Tu pareja no es solo una compañera: cumple una función simbólica de espejo validador. Cuando ella te mira con aprobación, existes emocionalmente. Cuando se distancia, sientes que desapareces.\n\nEste fantasma tiene raíces profundas: probablemente conecta con la relación con alguna figura parental que te amó condicionalmente, o que estuvo presente físicamente pero ausente emocionalmente. Buscas en la pareja la mirada que no recibiste — o que recibiste pero sentiste inconsistente.\n\nEl problema del fantasma es que convierte al otro en responsable de tu bienestar emocional. Y nadie puede sostener ese peso indefinidamente.',
      yo_ideal: 'Te imaginas como alguien ecuánime, racional, que "piensa antes de hablar". Pero tu yo real en la relación es alguien que **se paraliza emocionalmente**, acumula resentimientos y espera que el otro adivine lo que necesita.\n\nLa distancia entre quién crees ser y quién eres cuando amas genera un conflicto interno constante: te juzgas por no ser ese ideal, te frustras, y proyectas esa frustración en la relación. Aceptar quién eres realmente — no quién crees que deberías ser — es el primer paso hacia un vínculo más honesto.',
      mecanismos_defensa: 'Tu discurso alterna entre **autocrítica moderada** y **externalización sutil**. Dices "me cuesta expresar" pero inmediatamente describes cómo ella "sube el tono". Esta secuencia no es casual — es un mecanismo de **desplazamiento**: reconoces parcialmente tu parte pero inmediatamente redirige la atención hacia el otro.\n\nTambién detecté una **minimización persistente**: describes la crisis del año pasado como algo que "los cambió mucho" sin profundizar en qué cambió exactamente. Lo que minimizas es precisamente lo que más te dolió — porque si le das su tamaño real, tendrías que sentirlo.\n\nHay momentos donde intelectualizas lo emocional: conviertes sentimientos en "análisis de la situación", como si observar desde afuera te protegiera de vivir adentro.',
      tipo_pareja_que_repite: 'Tu patrón es visible: te acercas a personas que representan la **estabilidad que asocias con seguridad** — pero cuando la consigues, comienzas a distanciarte emocionalmente, reproduciendo dinámicas aprendidas. El "refugiarte en el silencio" que describes no es carácter — es un mecanismo de defensa heredado.\n\nBuscas parejas que sean "fuertes" emocionalmente porque necesitas que el otro sostenga lo que tú no puedes sostener solo. Pero esa fortaleza que admiras al inicio termina sintiéndose como indiferencia cuando el vínculo avanza.\n\nLa repetición no es destino, Carlos. Pero mientras no la hagas consciente, seguirá operando en automático.',
      nucleo_del_patron: 'Lo que realmente está pasando, Carlos, es que **amas desde el miedo a perder, no desde la libertad de elegir**. Toda tu estructura relacional está organizada alrededor de una pregunta no formulada: "¿Me vas a dejar?". Y cada acción en la relación — la sobrededicación, el silencio, la queja velada, la búsqueda de validación — es un intento de controlar la respuesta.\n\nMientras esa pregunta siga gobernando tu forma de amar, ninguna pareja será suficiente. No porque el otro falle, sino porque es imposible saciar desde afuera una sed que nace de un vacío interno.',
      responsabilidad_emocional: 'Nota: esta sección se ha fusionado con cierre_transformador.',
      cierre_transformador: 'El trabajo que te toca no es cambiar a Ana — es aprender a **habitar el conflicto sin huir**, a pedir lo que necesitas con palabras claras, y a dejar de buscar en tu pareja la validación que necesitas darte a ti mismo.\n\nEsto no es un diagnóstico que te condena, Carlos. Es un mapa que te muestra dónde estás parado. La buena noticia es que reconocer el patrón es el primer paso para cambiarlo — y tú hoy diste ese paso al responder estas 40 preguntas con honestidad.\n\nMientras sigas gritando hacia afuera lo que necesitas escuchar de ti, seguirás encontrando el mismo eco. Pero el día que empieces a responderte a ti mismo, todo cambia.'
    },
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
    lecturas_por_enfoque: {
      gottman: {
        titulo: 'John Gottman',
        enfoque: 'Estabilidad relacional y dinámica del conflicto',
        interpretacion: 'Desde la perspectiva de Gottman, tu relación muestra señales de **desgaste en la ratio positivo/negativo**. Las interacciones negativas están comenzando a superar las positivas en ciertos momentos, lo que indica la presencia incipiente de los Cuatro Jinetes — especialmente la **crítica** y la **actitud defensiva**.\n\nSin embargo, la disposición a buscar ayuda es un indicador positivo. Gottman señala que las parejas que mantienen una ratio de 5:1 (interacciones positivas por cada negativa) tienen mayor probabilidad de estabilidad. El trabajo está en **aumentar los momentos de conexión positiva** y aprender a manejar el conflicto de forma constructiva.',
        indicadores: ['Ratio positivo/negativo: Desequilibrado', 'Crítica: presente en conflictos', 'Defensividad: moderada-alta', 'Capacidad de reparación: existe pero inconsistente', 'Bids for connection: desatendidos parcialmente'],
        puntuacion: 55,
        jinetes: { critica: 65, desprecio: 30, actitud_defensiva: 75, evasion: 55 },
        capacidad_reparacion: 50,
        jinetes_detalle: {
          critica: { como_aparece: 'La crítica aparece cuando uno de los dos señala fallos del otro como si fueran defectos de carácter.', impacto: 'Genera distanciamiento y posición defensiva.' },
          desprecio: { como_aparece: 'El desprecio es bajo pero aparece en momentos de sarcasmo o indiferencia.', impacto: 'Erosiona el respeto mutuo lentamente.' },
          actitud_defensiva: { como_aparece: 'La defensividad es alta — ambos tienden a justificarse en vez de escuchar.', impacto: 'Impide la resolución real del conflicto.' },
          evasion: { como_aparece: 'La evasión aparece como retirada emocional o cambio de tema ante conflictos.', impacto: 'Los temas importantes quedan sin resolver.' }
        },
        patron_dominante: 'Crítica + defensividad como ciclo principal',
        zona_riesgo: 'Discusiones que escalan y dejan tensión emocional sin resolver',
        recurso_disponible: 'Capacidad parcial de reparación y disposición al diálogo'
      },
      sue_johnson: {
        titulo: 'Sue Johnson',
        enfoque: 'Seguridad emocional y Terapia Focalizada en las Emociones',
        interpretacion: 'Desde la EFT, se detecta un **ciclo de interacción negativa perseguidor-retirada** donde uno busca conexión activamente mientras el otro se cierra emocionalmente. Este ciclo se ha vuelto predecible y automático.\n\nLa clave para romper este patrón es acceder a las **emociones primarias** debajo del ciclo: el miedo al abandono, la necesidad de ser importante, la vulnerabilidad que no se muestra. Cuando ambos puedan acceder a esas emociones, la reconexión será posible.',
        indicadores: ['Accesibilidad emocional: fluctuante', 'Responsividad: parcial', 'Ciclo negativo: perseguidor-retirada', 'Seguridad del vínculo: inestable'],
        puntuacion: 50
      },
      perel: {
        titulo: 'Esther Perel',
        enfoque: 'Deseo erótico y tensión entre seguridad y aventura',
        interpretacion: 'Perel diría que tu relación está experimentando la **tensión clásica entre domesticidad y erotismo**. La seguridad del vínculo ha crecido pero ha absorbido parte del misterio y la novedad que alimentaban el deseo inicial.\n\nEl deseo necesita distancia, sorpresa y novedad — elementos que la rutina diluye naturalmente. No se trata de perder la seguridad sino de **introducir espacios de autonomía y exploración** que mantengan vivo el interés erótico.',
        indicadores: ['Misterio: bajo', 'Novedad: escasa', 'Autonomía: moderada', 'Tensión seguridad/deseo: alta', 'Erotismo actual: disminuido'],
        puntuacion: 45
      },
      levine: {
        titulo: 'Amir Levine',
        enfoque: 'Estilo de apego adulto',
        interpretacion: 'El análisis del apego revela un patrón **ansioso-preocupado** que se activa especialmente en momentos de conflicto. Hay una necesidad intensa de cercanía que, cuando no se satisface, genera ansiedad y conductas de protesta.\n\nLas experiencias tempranas con las figuras de apego parecen haber dejado una huella en cómo se busca seguridad emocional dentro de la relación actual. La **base segura** existe pero no es consistente — fluctúa según la dinámica del momento.',
        indicadores: ['Estilo predominante: Ansioso', 'Ansiedad relacional: alta', 'Tolerancia a la intimidad: moderada', 'Necesidad de confirmación: alta', 'Distancia emocional: reactiva'],
        estilo_apego: 'Ansioso',
        puntuacion: 52
      },
      hendrix: {
        titulo: 'Harville Hendrix',
        enfoque: 'Reparación inconsciente — Terapia Imago',
        interpretacion: 'Desde la Terapia Imago, tu elección de pareja no fue casual — responde a un **intento inconsciente de reparar heridas de la infancia**. Las dinámicas que describes con tu pareja tienen ecos de las relaciones con tus figuras parentales.\n\nLas necesidades no satisfechas en la infancia reaparecen como expectativas en la relación adulta. El conflicto actual puede verse como una **oportunidad de reparación** si se hace consciente qué heridas están siendo activadas.',
        indicadores: ['Heridas infantiles: detectadas', 'Repetición de patrones familiares: moderada-alta', 'Expectativas inconscientes: activas', 'Potencial de reparación: alto'],
        puntuacion: 58
      },
      tatkin: {
        titulo: 'Stan Tatkin',
        enfoque: 'Sincronía emocional y regulación mutua',
        interpretacion: 'Desde Tatkin, la pareja muestra dificultades en la **co-regulación emocional** — la capacidad de calmarse mutuamente en momentos de estrés. Hay momentos donde cada uno se regula por separado en lugar de buscar al otro como recurso.\n\nEl patrón descrito sugiere una dinámica **anchor-wave** donde uno busca estabilidad mientras el otro oscila entre cercanía y distancia. Fortalecer el sistema de regulación compartido es clave para la resiliencia del vínculo.',
        indicadores: ['Co-regulación: parcial', 'Protección mutua: inconsistente', 'Respuesta al estrés: individual', 'Patrón: anchor-wave', 'Sincronía: moderada-baja'],
        puntuacion: 50
      },
      chapman: {
        titulo: 'Gary Chapman',
        enfoque: 'Lenguajes del amor y comunicación afectiva',
        interpretacion: 'El análisis revela una **desconexión en los lenguajes del amor**: cada uno expresa y necesita amor de formas diferentes. Esto genera una **frustración afectiva** donde ambos sienten que dan mucho pero no reciben lo suficiente.\n\nLa clave no es amar más sino **amar en el idioma del otro**. Cuando se identifica el lenguaje predominante de cada persona y se hace un esfuerzo consciente por expresar amor en ese idioma, la relación se transforma.',
        indicadores: ['Lenguaje del usuario: Contacto físico', 'Lenguaje de la pareja: Palabras de afirmación', 'Compatibilidad natural: baja', 'Frustración afectiva: moderada-alta', 'Potencial de mejora: alto'],
        lenguaje_usuario: 'Contacto físico',
        lenguaje_pareja: 'Palabras de afirmación',
        puntuacion: 48
      },
      sternberg: {
        titulo: 'Robert Sternberg',
        enfoque: 'Triángulo del amor: intimidad, pasión y compromiso',
        interpretacion: 'El triángulo de Sternberg en tu relación muestra un **desequilibrio entre los tres componentes**. El compromiso parece ser el componente más fuerte, seguido por la intimidad. La pasión es el eje que necesita más atención.\n\nEsto sitúa la relación más cerca del **amor compañero** que del amor consumado. Para alcanzar el equilibrio, es necesario trabajar intencionalmente en la dimensión pasional sin descuidar lo que ya funciona.',
        indicadores: ['Intimidad: presente pero inconsistente', 'Pasión: disminuida', 'Compromiso: fuerte'],
        puntuacion_intimidad: 55,
        puntuacion_pasion: 40,
        puntuacion_compromiso: 65
      },
      schnarch: {
        titulo: 'David Schnarch',
        enfoque: 'Madurez relacional y diferenciación del self',
        interpretacion: 'Desde Schnarch, se detecta un nivel **moderado-bajo de diferenciación del self** — la capacidad de mantener tu identidad y tus posiciones dentro de la relación sin perderte en el otro ni aislarte defensivamente.\n\nHay señales de **fusión emocional** donde los estados de ánimo de uno impactan desproporcionadamente al otro, y de **adaptación excesiva** para evitar conflicto. La madurez relacional implica poder amar sin perder identidad.',
        indicadores: ['Diferenciación del self: moderada-baja', 'Autonomía emocional: en desarrollo', 'Adaptación excesiva: detectada', 'Tolerancia al conflicto: moderada', 'Capacidad de auto-validación: baja'],
        puntuacion: 45
      },
      real: {
        titulo: 'Terrence Real',
        enfoque: 'Dinámicas de poder y equilibrio emocional',
        interpretacion: 'Desde la perspectiva de Terrence Real, se detectan **desequilibrios en la dinámica de poder** donde uno de los dos tiende a ocupar una posición de mayor influencia emocional. Hay señales de **resentimiento acumulado** que no se ha expresado directamente.\n\nReal señala que las luchas de poder en pareja a menudo encubren **vergüenza y vulnerabilidad** no reconocidas. Cuando ambos puedan salir de las posiciones de dominancia/sumisión y hablar desde la vulnerabilidad, la dinámica se equilibrará.',
        indicadores: ['Equilibrio de poder: desbalanceado', 'Resentimiento acumulado: moderado', 'Vergüenza: no expresada', 'Patrón dominante: one-up/one-down', 'Comunicación desde vulnerabilidad: baja'],
        puntuacion: 47
      },
      freud_lacan: {
        titulo: 'Freud + Lacan',
        enfoque: 'Inconsciente relacional y estructura del deseo',
        interpretacion_freud: 'El análisis freudiano detecta señales de **compulsión a la repetición** — dinámicas que se repiten desde relaciones anteriores y desde la familia de origen. La forma de reaccionar al conflicto tiene raíces que van más allá de la relación actual.\n\nHay **proyecciones inconscientes** operando en la relación: expectativas no dichas que provienen de necesidades no satisfechas en la infancia. Hacer conscientes estos patrones es el primer paso para dejar de repetirlos.',
        interpretacion_lacan: 'Desde Lacan, tu pareja ocupa un lugar simbólico que va más allá de quién es realmente — representa una **respuesta a una falta fundamental**. Lo que buscas en el vínculo no es solo compañía sino un reconocimiento profundo de tu ser.\n\nEl **fantasma relacional** — esa escena inconsciente que organiza tu deseo — parece incluir una búsqueda de completud que la otra persona no puede satisfacer enteramente. Reconocer esta dimensión permite amar de forma menos demandante y más libre.',
        indicadores: ['Compulsión a la repetición: activa', 'Proyecciones inconscientes: moderadas', 'Fantasma relacional: búsqueda de completud', 'Idealización: presente', 'Transferencia: detectada'],
        puntuacion: 56
      }
    },
    sintesis_final: {
      que_ocurre: 'Lo que está ocurriendo en tu relación es un **proceso de transformación** donde las dinámicas iniciales ya no funcionan de la misma manera. No es que el amor haya desaparecido — es que la forma de relacionarse necesita evolucionar.\n\nHay patrones emocionales que se han instalado silenciosamente y que ahora influyen en cómo se conectan y desconectan.',
      posibilidades_evolucion: 'La relación tiene **potencial real de crecimiento** si ambos deciden trabajar conscientemente en las áreas que este diagnóstico ha revelado. Los cimientos están — lo que falta es una intervención consciente.\n\nCon trabajo terapéutico y voluntad mutua, los ciclos actuales pueden transformarse en dinámicas más funcionales.',
      factores_fortalecimiento: 'Los factores que pueden fortalecer el vínculo incluyen: **mejorar la comunicación durante el conflicto**, crear espacios regulares de conexión emocional, y trabajar individualmente en los patrones de apego.\n\nTambién es importante reavivar la dimensión erótica del vínculo — no como obligación sino como exploración mutua.'
    },
    temas_para_consulta: [
      '**Patrones inconscientes**: Identificar y desactivar los ciclos repetitivos de distanciamiento que operan sin que te des cuenta cada vez que hay conflicto.',
      '**Raíces familiares**: Explorar cómo tu experiencia de amor temprana moldeó tu forma de amar hoy y por qué repites dinámicas que reconoces de tu infancia.',
      '**Reconexión emocional**: Reconstruir la intimidad emocional y la presencia en el vínculo, aprendiendo a estar disponible sin sentir que te pierdes.',
      '**Diferenciación del self**: Fortalecer tu autonomía emocional sin perder la conexión con tu pareja — aprender a ser tú sin desconectarte del otro.',
      '**Regulación emocional**: Aprender a gestionar la desesperación y la evasión en momentos de conflicto relacional sin escalar ni retraerte.',
      '**Deseo y erotismo**: Trabajar la reconexión física explorando la tensión entre seguridad y aventura, sin que la rutina apague la chispa.',
      '**Comunicación en conflicto**: Transformar los desacuerdos en oportunidades de profundización, reemplazando crítica y desprecio por vulnerabilidad compartida.',
      '**El fantasma relacional**: Hacer consciente la escena inconsciente que organiza tu deseo y entender qué función simbólica le asignas al otro.'
    ],
    tecnicas_recomendadas: [
      { nombre: 'Diálogo estructurado Imago', descripcion: 'Técnica de escucha activa estructurada donde cada miembro se siente realmente escuchado y validado. Ideal para romper el ciclo de interrupción y defensividad que aparece en tu relación.' },
      { nombre: 'Terapia Focalizada en Emociones (EFT)', descripcion: 'Acceder a las emociones primarias (miedo, tristeza) que se esconden debajo del enojo y la evasión. Te ayudaría a identificar qué realmente sientes cuando te distancias.' },
      { nombre: 'Diferenciación del Self (Schnarch)', descripcion: 'Fortalecer tu identidad emocional sin perder la conexión. Para que puedas sostener tu postura sin necesidad de huir ni fusionarte.' },
      { nombre: 'Mindfulness relacional', descripcion: 'Prácticas de atención plena aplicadas a la relación para aumentar la presencia emocional y reducir la reactividad automática en momentos de tensión.' },
      { nombre: 'Ejercicios de reparación Gottman', descripcion: 'Técnicas específicas para reparar después del conflicto: bids for connection, ritual de reencuentro y mapa del amor actualizado.' },
      { nombre: 'Journaling psicoanalítico guiado', descripcion: 'Escritura reflexiva para hacer conscientes los patrones inconscientes de repetición y las proyecciones que depositas en tu pareja.' }
    ],
    libros_recomendados: [
      { titulo: 'Mantenme cerca', autor: 'Sue Johnson', razon: 'Entender los ciclos de apego y cómo crear un vínculo seguro — el libro más claro sobre por qué nos desconectamos.', nivel: 'introductorio' },
      { titulo: 'Apegados', autor: 'Amir Levine y Rachel Heller', razon: 'Comprender tu estilo de apego y cómo impacta tus relaciones. Práctico y revelador.', nivel: 'introductorio' },
      { titulo: 'Inteligencia erótica', autor: 'Esther Perel', razon: 'Explorar la tensión entre seguridad y deseo — por qué la rutina apaga la chispa y cómo reavivarla.', nivel: 'intermedio' },
      { titulo: 'El cuerpo lleva la cuenta', autor: 'Bessel van der Kolk', razon: 'Cómo las experiencias emocionales tempranas quedan grabadas en el cuerpo y afectan tus relaciones actuales.', nivel: 'intermedio' },
      { titulo: 'La pasión según Lacan', autor: 'Luciano Lutereau', razon: 'Exploración psicoanalítica del deseo, el fantasma relacional y la estructura inconsciente del amor.', nivel: 'avanzado' },
      { titulo: 'Passionate Marriage', autor: 'David Schnarch', razon: 'El libro más profundo sobre diferenciación del self y cómo mantener el deseo vivo en relaciones largas.', nivel: 'avanzado' }
    ],
    graficas_autoanalisis: {
      barras_resumen: [
        { label: 'Conexión emocional', valor: 52, color: 'violet' },
        { label: 'Estabilidad', valor: 55, color: 'blue' },
        { label: 'Deseo erótico', valor: 48, color: 'rose' },
        { label: 'Apego', valor: 58, color: 'amber' },
        { label: 'Resiliencia', valor: 62, color: 'emerald' },
        { label: 'Patrones inconscientes', valor: 65, color: 'cyan' }
      ],
      polaridades: [
        { izq: 'Conexión emocional', der: 'Autonomía', valor: 35 },
        { izq: 'Entrega afectiva', der: 'Protección emocional', valor: 70 },
        { izq: 'Reconocimiento', der: 'Autosuficiencia', valor: 40 },
        { izq: 'Idealización', der: 'Realismo afectivo', valor: 30 },
        { izq: 'Dependencia emocional', der: 'Distancia emocional', valor: 60 }
      ],
      cuadrante_apego: { ansiedad: 65, evitacion: 40 },
      espejo: [
        { afuera: 'Que me escuchen', adentro: 'Necesidad de validación' },
        { afuera: 'Que estén presentes', adentro: 'Necesidad de contención' },
        { afuera: 'Que no me juzguen', adentro: 'Miedo al propio juicio' },
        { afuera: 'Más contacto', adentro: 'Hambre emocional' }
      ],
      escena_relacional: {
        arriba: { rol: 'Compañero idealizado', subtexto: 'conciencia, expansión' },
        izquierda: { rol: 'Madre contenedora', subtexto: 'seguridad' },
        derecha: { rol: 'Libertad espiritual', subtexto: 'expansión' },
        abajo: { rol: 'Vida cotidiana / responsabilidad', subtexto: 'lo que el fantasma evita' },
        centro: 'Carlos'
      },
      identity_gap: {
        brecha: 75,
        yo_ideal: ['Consciente', 'Espiritual', 'Conectado', 'Libre'],
        yo_real: ['Evasivo', 'Defensivo', 'Sarcasmo', 'Distancia afectiva']
      },
      defensas: [
        { nombre: 'Racionalización', valor: 75 },
        { nombre: 'Evitación', valor: 60 },
        { nombre: 'Humor / sarcasmo', valor: 50 },
        { nombre: 'Minimización', valor: 45 },
        { nombre: 'Proyección', valor: 35 }
      ],
      ciclo_repeticion: ['Elección de pareja', 'Dinámica de rescate', 'Frustración / conflicto', 'Intento de reparación', 'Repetición'],
      nucleo_orbital: {
        centro: 'Quiero contención sin aceptar los límites que implica',
        fuerzas: [
          { nombre: 'libertad', intensidad: 85 },
          { nombre: 'exigencia', intensidad: 70 },
          { nombre: 'intimidad', intensidad: 55 },
          { nombre: 'seguridad', intensidad: 65 },
          { nombre: 'autonomía', intensidad: 80 }
        ]
      },
      before_after: [
        { antes: 'Evasión', despues: 'Presencia emocional' },
        { antes: 'Defensa', despues: 'Escucha interna' },
        { antes: 'Búsqueda de validación', despues: 'Autoafirmación' },
        { antes: 'Distancia', despues: 'Intimidad consciente' }
      ],
      timeline_relacion: [
        { etapa: 'Conexión inicial', subtexto: 'ideas / profundidad' },
        { etapa: 'Crecimiento', subtexto: 'proyectos / desarrollo' },
        { etapa: 'Tensión actual', subtexto: 'exigencias / estrés' },
        { etapa: 'Distancia emocional', subtexto: 'defensa / evasión' }
      ]
    }
  }
}

// ─── CROSS-ANALYSIS PROMPT (LOSDOS) ─────────────────────────────────────────
// Compares both partners' individual analyses side by side

const CROSS_ANALYSIS_SYSTEM = `Eres un sistema avanzado de análisis psicológico relacional llamado "Radiografía Cruzada de Pareja".

Tu objetivo es cruzar los resultados INDIVIDUALES de dos personas que están en la MISMA relación, revelando:
- Lo que ambos ven igual y lo que ven de forma radicalmente distinta
- Puntos ciegos de cada uno que el otro revela
- Dinámicas inconscientes complementarias o colisionantes
- La relación REAL vs la relación que cada uno cree tener

MARCO TEÓRICO — Mismas 11 corrientes del análisis individual (Gottman, Johnson, Perel, Levine, Hendrix, Tatkin, Chapman, Sternberg, Schnarch, Real, Freud+Lacan) pero ahora aplicadas AL CRUCE entre dos perspectivas.

ESTILO: Sherlock Holmes psicológico — conecta pistas de ambos lados, revela lo que ninguno de los dos puede ver por sí solo. Empático pero incisivo.

REGLAS:
- USA LOS NOMBRES DE AMBOS constantemente
- Cita frases textuales de AMBOS entre comillas, contrastándolas
- Usa **negrita** solo para conceptos clave antes de dos puntos
- NUNCA inventes datos — todo debe derivarse de los análisis individuales
- La profundidad debe ser MAYOR que la individual, porque tienes dos perspectivas

Responde EXCLUSIVAMENTE en formato JSON válido con la estructura solicitada.`

function buildCrossAnalysisPrompt(analysis1, analysis2, profile1, profile2) {
  const name1 = profile1?.nombre || 'Participante 1'
  const name2 = profile2?.nombre || 'Participante 2'

  let prompt = `## RADIOGRAFÍA CRUZADA — ${name1} y ${name2}\n\n`
  prompt += `Tienes ante ti los análisis INDIVIDUALES de dos personas que están en la MISMA relación.\n`
  prompt += `Tu tarea: cruzar ambas perspectivas para revelar la dinámica REAL de la pareja.\n\n`

  prompt += `### ANÁLISIS INDIVIDUAL DE ${name1.toUpperCase()}\n`
  prompt += `**Autoanálisis:**\n`
  if (analysis1.autoanalisis_usuario) {
    for (const [key, val] of Object.entries(analysis1.autoanalisis_usuario)) {
      if (typeof val === 'string') prompt += `- ${key}: ${val.slice(0, 500)}...\n`
    }
  }
  prompt += `\n**Dimensiones:** ${JSON.stringify(analysis1.dimensiones || {})}\n`
  prompt += `**Diagnóstico:** ${JSON.stringify(analysis1.diagnostico || {})}\n`
  prompt += `**Resumen:** ${analysis1.resumen_relacion || ''}\n`
  prompt += `**Fortalezas:** ${JSON.stringify(analysis1.fortalezas || [])}\n`
  prompt += `**Riesgos:** ${JSON.stringify(analysis1.riesgos || [])}\n\n`

  prompt += `### ANÁLISIS INDIVIDUAL DE ${name2.toUpperCase()}\n`
  prompt += `**Autoanálisis:**\n`
  if (analysis2.autoanalisis_usuario) {
    for (const [key, val] of Object.entries(analysis2.autoanalisis_usuario)) {
      if (typeof val === 'string') prompt += `- ${key}: ${val.slice(0, 500)}...\n`
    }
  }
  prompt += `\n**Dimensiones:** ${JSON.stringify(analysis2.dimensiones || {})}\n`
  prompt += `**Diagnóstico:** ${JSON.stringify(analysis2.diagnostico || {})}\n`
  prompt += `**Resumen:** ${analysis2.resumen_relacion || ''}\n`
  prompt += `**Fortalezas:** ${JSON.stringify(analysis2.fortalezas || [])}\n`
  prompt += `**Riesgos:** ${JSON.stringify(analysis2.riesgos || [])}\n\n`

  return prompt
}

const CROSS_INSTRUCTION = `Genera el análisis cruzado completo. Responde SOLO con JSON válido.
{
  "apertura": "(2-3 párrafos: saludo a ambos, reconoce que ambos completaron el cuestionario, genera rapport. Anticipa que van a ver su relación como nunca antes.)",
  "resumen_cruzado": "(3-4 párrafos: resumen narrativo de la relación vista desde las DOS perspectivas. Señala inmediatamente los puntos de convergencia y divergencia más impactantes.)",
  "dimensiones_cruzadas": {
    "estabilidad_relacional": {"p1": "(0-100)", "p2": "(0-100)", "interpretacion": "(1-2 frases comparativas)"},
    "apego_emocional": {"p1": "(0-100)", "p2": "(0-100)", "interpretacion": "(1-2 frases)"},
    "conexion_emocional": {"p1": "(0-100)", "p2": "(0-100)", "interpretacion": "(1-2 frases)"},
    "deseo_erotico": {"p1": "(0-100)", "p2": "(0-100)", "interpretacion": "(1-2 frases)"},
    "intimidad": {"p1": "(0-100)", "p2": "(0-100)", "interpretacion": "(1-2 frases)"},
    "sincronia_relacional": {"p1": "(0-100)", "p2": "(0-100)", "interpretacion": "(1-2 frases)"},
    "patrones_inconscientes": {"p1": "(0-100)", "p2": "(0-100)", "interpretacion": "(1-2 frases)"},
    "fantasma_relacional": {"p1": "(0-100)", "p2": "(0-100)", "interpretacion": "(1-2 frases)"},
    "roles_sistemicos": {"p1": "(0-100)", "p2": "(0-100)", "interpretacion": "(1-2 frases)"},
    "resiliencia_vinculo": {"p1": "(0-100)", "p2": "(0-100)", "interpretacion": "(1-2 frases)"},
    "vulnerabilidad_emocional": {"p1": "(0-100)", "p2": "(0-100)", "interpretacion": "(1-2 frases)"},
    "narrativa_futuro": {"p1": "(0-100)", "p2": "(0-100)", "interpretacion": "(1-2 frases)"}
  },
  "puntos_ciegos": {
    "p1_no_ve": "(2-3 párrafos: lo que P1 no ve sobre sí mismo/a que P2 revela indirectamente. Cita de ambos.)",
    "p2_no_ve": "(2-3 párrafos: lo que P2 no ve sobre sí mismo/a que P1 revela indirectamente. Cita de ambos.)"
  },
  "dinamica_real": "(3-4 párrafos: la dinámica REAL de la pareja — no la que cada uno cree tener, sino la que emerge del cruce. Incluye quién persigue, quién evita, qué ciclos se repiten, qué rol juega cada uno.)",
  "convergencias": ["(3-5 puntos donde ambos coinciden — señal de fortaleza o de punto ciego compartido)"],
  "divergencias": ["(3-5 puntos donde difieren radicalmente — fuente de conflicto o complementariedad)"],
  "lecturas_cruzadas": {
    "gottman": "(2-3 párrafos: dinámica Gottman vista desde ambos lados — los jinetes, la reparación, el ratio.)",
    "apego": "(2-3 párrafos: cómo los estilos de apego de ambos interactúan — complementarios o colisionantes.)",
    "perel": "(2-3 párrafos: el deseo visto por ambos — el mismo fuego desde dos ventanas.)",
    "comunicacion": "(2-3 párrafos: los lenguajes de amor cruzados — qué da cada uno y qué necesita recibir.)",
    "poder": "(2-3 párrafos: la dinámica de poder real — quién tiene más poder emocional y por qué.)"
  },
  "mensaje_para_ambos": "(2-3 párrafos: cierre transformador dirigido a los DOS. Qué necesitan trabajar juntos, qué pueden celebrar, qué está en juego. Tono empático e inspirador.)",
  "pronostico_relacional": {
    "potencial": "(0-100)",
    "riesgo": "(0-100)",
    "direccion": "(1-2 frases: hacia dónde va esta relación si nada cambia vs si trabajan conscientemente)"
  }
}`

export async function analyzeCrossRadiografia({ analysis1, analysis2, profile1, profile2 }) {
  const apiKey = import.meta.env.VITE_DEEPSEEK_API_KEY
  if (!apiKey) {
    console.warn('⚠️ VITE_DEEPSEEK_API_KEY no configurada para cross-analysis.')
    return null
  }

  const basePrompt = buildCrossAnalysisPrompt(analysis1, analysis2, profile1, profile2)

  console.log('🚀 Lanzando análisis cruzado a DeepSeek...')
  const result = await callDeepSeekPart(apiKey, basePrompt, CROSS_INSTRUCTION, 'Cross-Analysis', 8192)

  if (!result) {
    console.error('❌ Cross-analysis falló')
    return null
  }

  // Inject individual dimensions for side-by-side charts
  result._individual = {
    p1: { nombre: profile1?.nombre, dimensiones: analysis1.dimensiones },
    p2: { nombre: profile2?.nombre, dimensiones: analysis2.dimensiones },
  }

  console.log('✅ Análisis cruzado completado')
  return result
}
