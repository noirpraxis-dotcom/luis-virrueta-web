# Radiografía de Pareja Premium — Estructura Completa del Reporte

> Este documento detalla TODO lo que contiene el reporte final que recibe el usuario después de responder las 40 preguntas.

---

## Visión general

El reporte se divide en **4 grandes secciones** que se muestran en este orden:

```
┌──────────────────────────────────────────────────┐
│  HEADER — Nombre, edad, pareja, fecha            │
├──────────────────────────────────────────────────┤
│  PARTE 1 — TU RADIOGRAFÍA EMOCIONAL             │
│  "Primero, vamos contigo"                        │
│  (10 tarjetas de autoanálisis + gráficas)        │
├──────────────────────────────────────────────────┤
│  PARTE 2 — TU RELACIÓN DESDE 11 PERSPECTIVAS    │
│  "Ahora, tu relación analizada desde 11          │
│   corrientes psicológicas"                       │
│  (11 secciones de autor con gráficas)            │
├──────────────────────────────────────────────────┤
│  PARTE 3 — DIRECCIÓN Y BALANCE                   │
│  (Dirección probable + Fortalezas/Riesgos)       │
├──────────────────────────────────────────────────┤
│  PARTE 4 — TU SIGUIENTE PASO                     │
│  (Temas, técnicas, libros + CTAs)                │
└──────────────────────────────────────────────────┘
```

---

## PARTE 1 — Tu radiografía emocional

**Nombre en la UI:** "Tu radiografía emocional"
**Subtítulo:** "Primero, vamos contigo"
**Descripción:** Esta sección analiza quién eres TÚ cuando amas. No es sobre la relación — es sobre tus patrones, tus defensas, tu forma de amar.

### 10 Tarjetas de Autoanálisis

Cada tarjeta tiene: ícono, título, subtítulo, gradiente de color, gráfica SVG personalizada, y texto narrativo de 2-5 párrafos.

| # | Clave | Título visible | Subtítulo | Gráfica | Qué analiza |
|---|---|---|---|---|---|
| 1 | `apertura_rapport` | Apertura y rapport | Lo que percibimos de ti | *(sin gráfica)* | Primer contacto: reconoce la valentía del usuario, genera conexión, anticipa que el análisis será profundo |
| 2 | `forma_de_amar` | Tu forma de amar | Cómo amas y desde dónde | `DualBarsChart` (barras duales) | ¿Amas desde el miedo, la generosidad, el control? ¿Qué das? ¿Qué esperas? ¿Repites la forma de amar de tus padres? |
| 3 | `lo_que_busca_en_el_otro` | Lo que buscas en el otro | Lo que admiras revela lo que te falta | `PolarityScaleChart` (escalas de polaridad) | Cualidades que busca en el otro = espejo de carencias propias. Elección de pareja como reparación inconsciente |
| 4 | `lo_que_reclama_afuera` | Lo que reclamas afuera | Lo que pides afuera te pertenece adentro | `MirrorGraph` (espejo interno/externo) | Cada queja sobre la pareja = radiografía de una herida propia no atendida |
| 5 | `fantasma_relacional` | El fantasma relacional | La escena inconsciente que organiza tu deseo | `RelationalSceneChart` (escena relacional) | Qué "película" se repite en su cabeza sobre el amor. Rol simbólico que le asigna al otro |
| 6 | `yo_ideal` | Yo ideal vs. Yo real | La distancia entre quién crees ser y quién eres | `IdentityGapChart` (brecha de identidad) | Contradicciones: dice ser paciente pero explota. Dice comunicar bien pero evade |
| 7 | `mecanismos_defensa` | Mecanismos de defensa | Cómo te proteges cuando el vínculo duele | `DefenseRadarChart` (radar de defensas) | Racionalización, minimización, proyección, evitación, humor defensivo, negación |
| 8 | `tipo_pareja_que_repite` | El tipo de pareja que repite | Lo que eligen tus patrones, no tu voluntad | `RepetitionCycleChart` (ciclo de repetición) | Compulsión de repetición freudiana. ¿Siempre elige el mismo "tipo"? |
| 9 | `nucleo_del_patron` | El núcleo del patrón | La verdad que no habías visto | `OrbitalCoreChart` (núcleo orbital) | Síntesis clínica: LA FRASE que resume toda la estructura emocional |
| 10 | `cierre_transformador` | Cierre transformador | Tu mapa, tu siguiente paso | `BeforeAfterMap` (antes/después) | Mensaje personalizado: qué trabajo emocional le toca, qué dejar de buscar afuera, qué cultivar adentro |

### Gráficas del Autoanálisis

Cada gráfica se genera a partir de datos en `graficas_autoanalisis`:

| Gráfica | Datos que usa | Qué muestra visualmente |
|---|---|---|
| `DualBarsChart` | `barras_resumen[]` — 6 dimensiones con valor 0-100 | Barras horizontales con colores: conexión emocional, estabilidad, deseo, apego, resiliencia, patrones inconscientes |
| `PolarityScaleChart` | `polaridades[]` — 5 ejes con valor 0-100 | Escalas de polaridad: conexión↔autonomía, entrega↔protección, reconocimiento↔autosuficiencia, idealización↔realismo, dependencia↔distancia |
| `AttachmentQuadrantChart` | `cuadrante_apego` — {ansiedad, evitacion} | Cuadrante cartesiano: Seguro / Ansioso / Evitativo / Desorganizado con punto del usuario |
| `MirrorGraph` | `espejo[]` — [{afuera, adentro}] | Lo que reclama afuera ↔ Lo que le pertenece adentro (espejo) |
| `RelationalSceneChart` | `escena_relacional` — {arriba, izq, der, abajo, centro} | Mapa de la escena inconsciente con 4 roles + centro |
| `IdentityGapChart` | `identity_gap` — {brecha, yo_ideal[], yo_real[]} | Barra de brecha (%) + tags de yo ideal vs yo real |
| `DefenseRadarChart` | `defensas[]` — [{nombre, valor}] | Radar pentagonal de mecanismos de defensa |
| `RepetitionCycleChart` | `ciclo_repeticion[]` — [strings] | Ciclo circular: etapas de repetición conectadas por flechas |
| `OrbitalCoreChart` | `nucleo_orbital` — {centro, fuerzas[]} | Núcleo central con fuerzas orbitales (tamaño = intensidad) |
| `BeforeAfterMap` | `before_after[]` — [{antes, despues}] | Mapa comparativo: estado actual → estado posible |
| `RelationshipTimeline` | `timeline_relacion[]` — [{etapa, subtexto}] | Timeline horizontal de la evolución de la relación |

---

## PARTE 2 — Tu relación desde 11 perspectivas

**Nombre en la UI:** "Tu relación analizada desde 11 corrientes psicológicas"
**Separador visible:** Sí, con indicación visual de que esta es la segunda parte

### 11 Secciones de Autor

Cada sección tiene: nombre del autor, enfoque, ícono, gráfica específica, indicadores, puntuación, e interpretación narrativa de 3-4 párrafos estilo "Sherlock Holmes psicológico".

| # | Autor | Enfoque | Gráfica | Qué mide específicamente |
|---|---|---|---|---|
| 1 | **John Gottman** | Estabilidad relacional y dinámica del conflicto | `GottmanHorsemenChart` (radar + barras de 4 jinetes) | Los 4 Jinetes del Apocalipsis (crítica, desprecio, defensividad, evasión), ratio positivo/negativo, capacidad de reparación, patrón dominante, zona de riesgo |
| 2 | **Robert Sternberg** | Triángulo del amor | `SternbergTriangleChart` (triángulo interactivo) | Intimidad (0-100), Pasión (0-100), Compromiso (0-100), tipo de amor resultante |
| 3 | **Amir Levine** | Estilo de apego adulto | Indicadores + `estilo_apego` | Ansiedad relacional, evitación, tolerancia a la intimidad, necesidad de seguridad, estilo: seguro/ansioso/evitativo/desorganizado |
| 4 | **Sue Johnson** | Seguridad emocional (EFT) | Indicadores textuales | Ciclo perseguidor-evitador, accesibilidad emocional, responsividad, engagement emocional |
| 5 | **Esther Perel** | Deseo erótico y tensión seguridad/aventura | Indicadores textuales | Erotismo vs domesticidad, autonomía, novedad, espacio psicológico |
| 6 | **Freud + Lacan** | Inconsciente relacional y estructura del deseo | `IcebergChart` (modelo iceberg) | Compulsión de repetición, proyección inconsciente, fantasma relacional, estructura del deseo. Tiene DOS interpretaciones: freudiana y lacaniana por separado |
| 7 | **Harville Hendrix** | Reparación inconsciente (Terapia Imago) | `HendrixImagoChart` (diagrama Imago) | Herida de reconocimiento, elección reparadora, proyección parental, espejo imago |
| 8 | **David Schnarch** | Madurez relacional y diferenciación del self | `SchnarchThermometerChart` (termómetro) | Diferenciación del self, autonomía emocional, tolerancia al conflicto, madurez relacional |
| 9 | **Stan Tatkin** | Sincronía emocional y regulación mutua | `TatkinSpeedometerChart` (velocímetro) | Co-regulación, protección mutua, respuesta al estrés, sincronía, tipo: anchor/wave/island |
| 10 | **Gary Chapman** | Lenguajes del amor y comunicación afectiva | `ChapmanArcsChart` (arcos de lenguajes) | Lenguaje del usuario, lenguaje de la pareja, compatibilidad, expresión afectiva |
| 11 | **Terrence Real** | Dinámicas de poder y equilibrio emocional | `RealBalanceChart` (balance relacional) | Lucha de poder, resentimiento acumulado, vergüenza, equilibrio de poder |

### Datos adicionales por autor

**Gottman** incluye datos extra:
- `jinetes`: {critica, desprecio, actitud_defensiva, evasion} (0-100 cada uno)
- `capacidad_reparacion` (0-100)
- `jinetes_detalle`: para cada jinete → {como_aparece, impacto}
- `patron_dominante`, `zona_riesgo`, `recurso_disponible`

**Sternberg** incluye:
- `puntuacion_intimidad`, `puntuacion_pasion`, `puntuacion_compromiso` (0-100)

**Chapman** incluye:
- `lenguaje_usuario` (string), `lenguaje_pareja` (string)

**Levine** incluye:
- `estilo_apego` (string)

---

## Secciones intermedias (entre Parte 2 y Parte 4)

### Rapport / Radiografía Inicial
- **Cuándo aparece:** Después del autoanálisis, antes de las 11 perspectivas
- **Contenido:** `radiografia_inicial` — párrafo narrativo que resume la relación observada
- **Visual:** Timeline de la relación + texto con bold rendering

### Análisis Profundo
- `narrativa_dominante` — La historia que cuenta sobre su vínculo
- `tensiones_estructurales` — Contradicciones fundamentales en su discurso
- `evolucion_deseo` — Cómo ha cambiado el deseo desde el inicio
- `dinamica_emocional` — Cuándo se conectan y cuándo se desconectan

### Lectura Psicoanalítica
- `proyecciones_inconscientes` — Qué proyecta en su pareja
- `fantasma_relacional` — Qué escena organiza su deseo
- `roles_simbolicos` — Qué rol simbólico asigna cada uno

### Dinámica de Conflicto
- `tendencia_conflicto` (0-100)
- `reaccion_usuario` — Cómo reacciona al conflicto
- `reaccion_pareja` — Cómo reacciona la pareja
- `capacidad_reparacion` (0-100)

### Energía del Vínculo
- `atraccion_inicial` (0-100), `atraccion_actual` (0-100)
- `intimidad_emocional` (0-100), `conexion_fisica` (0-100)

---

## PARTE 3 — Dirección y Balance

### Dirección Probable
3 gauges circulares:
- `estabilidad_futura` (0-100) — ¿Qué tan estable será?
- `riesgo_desgaste` (0-100) — ¿Riesgo de deterioro?
- `potencial_reconexion` (0-100) — ¿Pueden reconectarse?

### Fortalezas y Riesgos
- `fortalezas[]` — Lista de fortalezas detectadas en la relación
- `riesgos[]` — Lista de señales de riesgo

### Tabla Diagnóstica
12 dimensiones medidas:
| Dimensión | Escala | Fuente teórica |
|---|---|---|
| Estabilidad relacional | 0-100 | Gottman |
| Apego emocional | 0-100 | Levine |
| Conexión emocional | 0-100 | Sue Johnson |
| Deseo erótico | 0-100 | Perel |
| Intimidad | 0-100 | Sternberg |
| Sincronía relacional | 0-100 | Tatkin |
| Patrones inconscientes | 0-100 | Freud/Hendrix |
| Fantasma relacional | 0-100 | Lacan |
| Roles sistémicos | 0-100 | Sistémica |
| Resiliencia del vínculo | 0-100 | General |
| Vulnerabilidad emocional | 0-100 | General |
| Narrativa de futuro | 0-100 | General |

### Síntesis Final
- `que_ocurre` — Lo que realmente está pasando
- `posibilidades_evolucion` — Caminos posibles
- `factores_fortalecimiento` — Qué necesitan para fortalecer el vínculo

---

## PARTE 4 — Tu Siguiente Paso

### Temas para Consulta (8 temas)
- Formato: `**Nombre del tema**: Descripción de por qué trabajarlo`
- Cubren: patrones inconscientes, raíces familiares, reconexión emocional, diferenciación del self, regulación emocional, deseo/erotismo, comunicación en conflicto, fantasma relacional

### Técnicas Terapéuticas (5-6 técnicas)
- Cada una con `nombre` + `descripcion` (1-2 frases)
- Ejemplos: Diálogo Imago, EFT, Diferenciación del Self, Mindfulness relacional, Ejercicios de reparación Gottman, Journaling psicoanalítico

### Lecturas Recomendadas (6 libros)
- Cada uno con `titulo`, `autor`, `razon`, `nivel` (introductorio/intermedio/avanzado)
- Tags de color por nivel: verde (introductorio), ámbar (intermedio), rosa (avanzado)

### CTAs (Llamadas a la acción)
- Botón: "Terapia Individual" → `/tienda/consulta-individual`
- Botón: "Terapia de Pareja" → `/tienda/consulta-pareja`

### Descargar PDF
- Botón al final que genera y descarga el reporte completo en PDF

---

## Resumen de métricas totales

| Métrica | Cantidad |
|---|---|
| Preguntas del cuestionario | 40 |
| Secciones de autoanálisis | 10 |
| Corrientes psicológicas | 11 |
| Dimensiones medidas (0-100) | 12 |
| Gráficas SVG personalizadas | ~22 (11 autoanálisis + 11 autores) |
| Temas para consulta | 8 |
| Técnicas recomendadas | 5-6 |
| Libros recomendados | 6 |
| Bloques del cuestionario | 5 |

---

*Documento generado para referencia interna. Radiografía de Pareja Premium — Luis Virrueta.*
