# Flujo Completo del Prompt y la IA — Radiografía de Pareja Premium

> Documento técnico que explica cómo funciona la llamada a la IA, el flujo de datos, el prompt, tokens, tiempos y manejo de errores.

---

## 1. Flujo general (simplificado)

```
┌─────────────────────────────────────────────────────────────────┐
│  USUARIO                                                         │
│  Responde 40 preguntas por voz (o texto)                        │
│  → Se guardan en objeto `responses` (Q1-Q40)                    │
│  → Se guardan datos de perfil (nombre, edad, pareja)            │
└─────────────────────┬───────────────────────────────────────────┘
                      │
                      ▼
┌─────────────────────────────────────────────────────────────────┐
│  buildPrompt(responses, questions, profileData)                  │
│                                                                  │
│  1. Toma las 40 respuestas organizadas por bloque               │
│  2. Agrega datos del perfil (nombre, edad, fecha)               │
│  3. Agrega el esquema JSON de salida que DeepSeek debe seguir   │
│  4. Genera un string de ~3000-5000 palabras                     │
└─────────────────────┬───────────────────────────────────────────┘
                      │
                      ▼
┌─────────────────────────────────────────────────────────────────┐
│  analyzeRadiografiaPremium()                                     │
│                                                                  │
│  POST https://api.deepseek.com/chat/completions                 │
│                                                                  │
│  Headers:                                                        │
│    Authorization: Bearer {VITE_DEEPSEEK_API_KEY}                │
│    Content-Type: application/json                                │
│                                                                  │
│  Body:                                                           │
│    model: "deepseek-chat"                                       │
│    temperature: 0.7                                              │
│    max_tokens: 8192                                              │
│    response_format: { type: "json_object" }                     │
│    messages: [                                                   │
│      { role: "system", content: SYSTEM_PROMPT }  ← ~3000 tokens │
│      { role: "user", content: buildPrompt() }    ← ~4000 tokens │
│    ]                                                             │
│                                                                  │
│  ⏱ Tiempo promedio: 45-90 segundos                              │
│  💰 Costo estimado: ~$0.01-0.02 USD por llamada                │
│  🔄 Reintentos: 3 intentos con backoff exponencial (5s, 10s)   │
└─────────────────────┬───────────────────────────────────────────┘
                      │
                      ▼
┌─────────────────────────────────────────────────────────────────┐
│  RESPUESTA DE DEEPSEEK                                           │
│                                                                  │
│  → JSON con ~8000 tokens de salida                              │
│  → Se parsea con JSON.parse()                                   │
│  → Se valida que tenga campos esenciales                        │
│  → Se guarda en estado `aiAnalysis`                             │
│  → Se renderiza el reporte completo                             │
└─────────────────────────────────────────────────────────────────┘
```

---

## 2. Detalles técnicos

### Modelo
- **Nombre:** `deepseek-chat` (DeepSeek V3)
- **Proveedor:** DeepSeek (api.deepseek.com)
- **Contexto máximo:** 128K tokens
- **Precio input:** $0.14 / 1M tokens
- **Precio output:** $0.28 / 1M tokens

### Parámetros de la llamada
| Parámetro | Valor | Propósito |
|---|---|---|
| `model` | `deepseek-chat` | Modelo de lenguaje |
| `temperature` | `0.7` | Balance entre creatividad y consistencia |
| `max_tokens` | `8192` | Máximo de tokens en la respuesta |
| `response_format` | `{ type: "json_object" }` | Fuerza respuesta en JSON válido |

### Estimación de tokens
| Componente | Tokens aproximados |
|---|---|
| SYSTEM_PROMPT | ~3,000-3,500 |
| User prompt (40 respuestas + esquema) | ~3,500-5,000 |
| **Total input** | **~6,500-8,500** |
| **Respuesta (output)** | **~6,000-8,192** |
| **Total por llamada** | **~12,500-16,700** |

### Costo estimado por análisis
- Input: ~7,500 tokens × $0.14/1M = $0.00105
- Output: ~7,000 tokens × $0.28/1M = $0.00196
- **Total: ~$0.003-0.005 USD por análisis** (menos de medio centavo)

### Tiempo de respuesta
- **Mínimo observado:** ~30 segundos
- **Promedio:** ~45-90 segundos
- **Máximo antes de timeout:** 120 segundos
- El tiempo depende de la longitud de las respuestas del usuario y la carga del servidor de DeepSeek

---

## 3. El SYSTEM_PROMPT

El prompt de sistema tiene ~220 líneas y define:

### 3.1 Identidad del sistema
Se presenta como "Radiografía de Pareja" — un sistema avanzado de análisis psicológico.

### 3.2 Marco teórico (11 corrientes)
1. **Gottman** — Estabilidad relacional, 4 jinetes, ratio positivo/negativo
2. **Sue Johnson (EFT)** — Seguridad emocional, ciclos perseguidor-evitador
3. **Esther Perel** — Deseo y erotismo, tensión seguridad/aventura
4. **Amir Levine** — Estilos de apego adulto
5. **Harville Hendrix (Imago)** — Reparación inconsciente de heridas infantiles
6. **Stan Tatkin** — Sincronía emocional, co-regulación
7. **Gary Chapman** — Lenguajes del amor
8. **Robert Sternberg** — Triángulo del amor (intimidad, pasión, compromiso)
9. **David Schnarch** — Diferenciación del self
10. **Terrence Real** — Dinámicas de poder
11. **Freud + Lacan** — Inconsciente, repetición, fantasma relacional

### 3.3 Dimensiones psicológicas (12)
Cada una medida en escala 0-100.

### 3.4 Método de análisis en 3 niveles
- **Nivel 1:** Análisis individual de cada respuesta
- **Nivel 2:** Análisis por bloques narrativos (5 bloques)
- **Nivel 3:** Análisis global del discurso completo

### 3.5 Instrucciones para el autoanálisis (10 secciones)
Instrucciones detalladas para cada una de las 10 secciones de "Tu radiografía emocional":
apertura_rapport, forma_de_amar, lo_que_busca_en_el_otro, lo_que_reclama_afuera, fantasma_relacional, yo_ideal, mecanismos_defensa, tipo_pareja_que_repite, nucleo_del_patron, cierre_transformador.

### 3.6 Estilo "Sherlock Holmes psicológico"
Cada interpretación debe escribirse como un detective que conecta pistas inconexas:
- Comienza con una observación aguda
- Conecta datos que el usuario no habría conectado
- Cierra con un insight revelador
- Empático pero incisivo

### 3.7 Reglas clave
- Cada autor se nutre de las respuestas crudas + el autoanálisis generado
- Indicadores en español, no técnicos
- Usar el nombre del usuario constantemente
- Citar sus palabras textuales entre comillas
- Negrita solo para nombres de conceptos clínicos

---

## 4. El buildPrompt() — Prompt del usuario

La función construye el prompt del usuario con esta estructura:

```
## RESPUESTAS DEL CUESTIONARIO NARRATIVO

### DATOS DEL USUARIO
- Nombre: Luis
- Edad: 34
- Nombre pareja: Susana
- Edad pareja: 36
- Fecha: 2026-03-14

### BLOQUE 1 — Contexto personal
**Q1: Para empezar, cuéntame un poco sobre tu vida...**
Respuesta: [texto del usuario]

**Q2: Cuéntame la historia de tu relación...**
Respuesta: [texto del usuario]

[... Q3-Q40 ...]

## ESTRUCTURA JSON DE SALIDA
{
  "autoanalisis_usuario": { ... 10 campos ... },
  "resumen_relacion": "string",
  "dimensiones": { ... 12 valores 0-100 ... },
  "diagnostico": { tipo_vinculo, estilo_apego, dinamica_conflicto, tono_relacional },
  "radiografia_inicial": "string",
  "analisis_profundo": { ... 4 sub-secciones ... },
  "lectura_psicoanalitica": { ... 3 sub-secciones ... },
  "dinamica_conflicto": { ... },
  "energia_vinculo": { ... },
  "direccion_probable": { ... },
  "fortalezas": [...],
  "riesgos": [...],
  "tabla_diagnostica": [...],
  "lecturas_por_enfoque": { ... 11 autores ... },
  "sintesis_final": { ... },
  "temas_para_consulta": [8 strings con formato **nombre**: desc],
  "tecnicas_recomendadas": [5-6 objetos {nombre, descripcion}],
  "libros_recomendados": [6 objetos {titulo, autor, razon, nivel}],
  "graficas_autoanalisis": { ... 11 estructuras de datos para gráficas ... }
}
```

---

## 5. Manejo de errores y reintentos

### Flujo de reintentos (ACTUALIZADO)
```
Intento 1 → ¿Éxito? → SÍ → Parsear JSON → Validar campos → Retornar
                        NO → Esperar 5 segundos
Intento 2 → ¿Éxito? → SÍ → Parsear JSON → Validar campos → Retornar
                        NO → Esperar 10 segundos
Intento 3 → ¿Éxito? → SÍ → Parsear JSON → Validar campos → Retornar
                        NO → ERROR VISIBLE al usuario
```

### Validación del JSON
Después de parsear la respuesta, se verifica que contenga:
- `autoanalisis_usuario` (la sección más importante)
- `lecturas_por_enfoque` (las 11 perspectivas)
- `dimensiones` (12 valores numéricos)

Si falta alguno de estos, se considera respuesta incompleta y se reintenta.

### ¿Qué pasa si fallan los 3 intentos?
Se muestra un error visible al usuario con la opción de reintentar. NO se muestra un análisis genérico silenciosamente — el usuario paga por datos reales.

---

## 6. Archivos involucrados

| Archivo | Propósito |
|---|---|
| `src/services/radiografiaPremiumService.js` | SYSTEM_PROMPT + buildPrompt() + llamada API + fallback |
| `src/data/cachedPreviewAnalysis.js` | Análisis cacheado para preview (Luis/Susana) |
| `src/pages/RadiografiaPremiumPage.jsx` | Componente principal: cuestionario + renderizado de resultados |
| `.env` → `VITE_DEEPSEEK_API_KEY` | API key de DeepSeek |

---

## 7. Flujo completo del usuario (de principio a fin)

```
1. Usuario compra acceso (Stripe) → recibe token/email
2. Accede a la página de Radiografía Premium
3. Selecciona voz guía (o sin voz)
4. Lee instrucciones
5. Completa datos personales + correo
6. Responde 40 preguntas (voz o texto, ~20-25 min)
7. Al terminar Q40 → Se lanza handleRunAnalysis()
8. Pantalla de "Analizando tu narrativa" (20 tareas animadas)
9. En paralelo: POST a DeepSeek API (~45-90 seg)
10. Respuesta recibida → JSON parseado → Estado aiAnalysis
11. Se renderiza el reporte completo (4 partes)
12. Usuario puede descargar PDF y/o compartir
```

---

*Documento técnico generado para referencia interna.*
