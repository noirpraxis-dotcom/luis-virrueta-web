// ─── @react-pdf/renderer — Professional PDF generator ─────────
// Compact layout: groups autoanalisis ~4 per page, renders lectura bars natively.
// No html2canvas dependency — pure text + native bars = instant PDF.

import React from 'react'
import { Document, Page, Text, View, StyleSheet, pdf } from '@react-pdf/renderer'

// ── Colors ─────────────────────────────────────────────────────
const C = {
  bg: '#0a0a12',
  cardBg: '#111120',
  accent: '#8b5cf6',
  accentLight: '#a78bfa',
  pink: '#ec4899',
  emerald: '#10b981',
  amber: '#f59e0b',
  white: '#e2e8f0',
  muted: '#94a3b8',
  dim: '#64748b',
  border: '#1e1b4b',
  coverBg: '#07070e',
  blue: '#60a5fa',
  indigo: '#818cf8',
  cyan: '#22d3ee',
  teal: '#14b8a6',
  orange: '#f97316',
  rose: '#fb7185',
  red: '#ef4444',
}

// ── Styles ─────────────────────────────────────────────────────
const s = StyleSheet.create({
  page: { backgroundColor: C.bg, padding: 40, paddingBottom: 50, fontFamily: 'Helvetica' },
  coverPage: { backgroundColor: C.coverBg, padding: 40, fontFamily: 'Helvetica', justifyContent: 'center', alignItems: 'center' },
  headerBox: { textAlign: 'center', marginBottom: 20, paddingBottom: 12, borderBottomWidth: 1, borderBottomColor: C.border },
  titleSmall: { fontSize: 16, color: C.white, fontWeight: 300, marginBottom: 4 },
  subtitle: { fontSize: 8, color: C.accent, letterSpacing: 3, textTransform: 'uppercase', marginBottom: 8 },
  section: { marginBottom: 12 },
  sectionLabel: { fontSize: 8, color: C.accent, letterSpacing: 2, textTransform: 'uppercase', marginBottom: 5 },
  paragraph: { fontSize: 9, color: C.muted, lineHeight: 1.6, marginBottom: 5 },
  paragraphSmall: { fontSize: 8.5, color: C.muted, lineHeight: 1.55, marginBottom: 4 },
  card: { backgroundColor: C.cardBg, borderRadius: 6, padding: 12, marginBottom: 8, borderWidth: 0.5, borderColor: C.border },
  cardTitle: { fontSize: 10, color: C.accentLight, marginBottom: 4, fontWeight: 'bold' },
  cardSubtitle: { fontSize: 7, color: C.dim, letterSpacing: 1.5, textTransform: 'uppercase', marginBottom: 5 },
  dimRow: { flexDirection: 'row', alignItems: 'center', marginBottom: 5 },
  dimLabel: { fontSize: 7.5, color: C.muted, width: 120 },
  dimBarBg: { flex: 1, height: 6, backgroundColor: '#1a1a2e', borderRadius: 3 },
  dimBarFill: { height: 6, borderRadius: 3, backgroundColor: C.accent },
  dimValue: { fontSize: 7.5, color: C.white, width: 28, textAlign: 'right' },
  listItem: { flexDirection: 'row', marginBottom: 4 },
  bullet: { fontSize: 8, color: C.accent, width: 12 },
  listText: { fontSize: 8.5, color: C.muted, flex: 1, lineHeight: 1.5 },
  divider: { height: 1, backgroundColor: C.border, marginVertical: 10 },
  pageNumber: { position: 'absolute', bottom: 20, right: 40, fontSize: 7, color: C.dim },
  footerBrand: { position: 'absolute', bottom: 20, left: 40, fontSize: 7, color: C.dim },
})

// ── Helpers ────────────────────────────────────────────────────
const clean = (text) => {
  if (!text) return ''
  return text.replace(/\*\*/g, '')
}

const DIMENSION_LABELS = {
  estabilidad_relacional: 'Estabilidad relacional',
  apego_emocional: 'Apego emocional',
  conexion_emocional: 'Conexión emocional',
  deseo_erotico: 'Deseo erótico',
  intimidad: 'Intimidad',
  sincronia_relacional: 'Sincronía relacional',
  patrones_inconscientes: 'Patrones inconscientes',
  fantasma_relacional: 'Fantasma relacional',
  roles_sistemicos: 'Roles sistémicos',
  resiliencia_vinculo: 'Resiliencia del vínculo',
  vulnerabilidad_emocional: 'Vulnerabilidad emocional',
  narrativa_futuro: 'Narrativa de futuro',
}

const AUTOANALISIS_SECTIONS = [
  { key: 'apertura_rapport', title: 'Tu radiografía inicial' },
  { key: 'forma_de_amar', title: 'Cómo amas' },
  { key: 'goce_repeticion', title: 'El goce que te ata' },
  { key: 'lo_que_busca_en_el_otro', title: 'Proyección inconsciente' },
  { key: 'lo_que_reclama_afuera', title: 'Espejo emocional' },
  { key: 'fantasma_relacional', title: 'Escena inconsciente' },
  { key: 'yo_ideal', title: 'Yo ideal vs yo real' },
  { key: 'mecanismos_defensa', title: 'Protección emocional' },
  { key: 'tipo_pareja_que_repite', title: 'Compulsión de repetición' },
  { key: 'nucleo_del_patron', title: 'Insight central' },
  { key: 'cierre_transformador', title: 'Dirección del cambio' },
]

const LECTURA_NAMES = {
  gottman: 'John Gottman',
  sternberg: 'Robert Sternberg',
  levine: 'Amir Levine',
  sue_johnson: 'Sue Johnson',
  perel: 'Esther Perel',
  freud_lacan: 'Freud & Lacan',
  hendrix: 'Harville Hendrix',
  schnarch: 'David Schnarch',
  tatkin: 'Stan Tatkin',
  chapman: 'Gary Chapman',
  real: 'Terry Real',
}

const LECTURA_ENFOQUES = {
  gottman: 'Regulación del conflicto',
  sternberg: 'El triángulo del amor',
  levine: 'Teoría del apego adulto',
  sue_johnson: 'Seguridad emocional y Terapia EFT',
  perel: 'Erotismo y deseo en la pareja',
  freud_lacan: 'Inconsciente relacional',
  hendrix: 'Terapia Imago',
  schnarch: 'Diferenciación del self',
  tatkin: 'Sincronía y regulación mutua',
  chapman: 'Los 5 lenguajes del amor',
  real: 'Dinámica relacional de poder',
}

// Reusable footer
const PageFooter = () => (
  <>
    <Text style={s.pageNumber} render={({ pageNumber, totalPages }) => `${pageNumber} / ${totalPages}`} fixed />
    <Text style={s.footerBrand} fixed>Luis Virrueta — Radiografía de Pareja</Text>
  </>
)

// Reusable score bar
const ScoreBar = ({ label, value, color }) => (
  <View style={s.dimRow}>
    <Text style={s.dimLabel}>{label}</Text>
    <View style={s.dimBarBg}>
      <View style={{ ...s.dimBarFill, width: `${Math.min(value || 0, 100)}%`, backgroundColor: color || C.accent }} />
    </View>
    <Text style={s.dimValue}>{value ?? 0}%</Text>
  </View>
)

// ── Build native bars per lectura author ──────────────────────
const LecturaBars = ({ authorKey, data, energiaVinculo }) => {
  switch (authorKey) {
    case 'gottman':
      return (
        <View style={{ marginTop: 6 }}>
          <Text style={{ fontSize: 7, color: C.accent, marginBottom: 5, letterSpacing: 1 }}>LOS 4 JINETES DEL APOCALIPSIS</Text>
          {data.jinetes && (
            <>
              <ScoreBar label="Crítica" value={data.jinetes.critica} color={C.pink} />
              <ScoreBar label="Desprecio" value={data.jinetes.desprecio} color={C.pink} />
              <ScoreBar label="Actitud defensiva" value={data.jinetes.actitud_defensiva} color={C.pink} />
              <ScoreBar label="Evasión" value={data.jinetes.evasion} color={C.pink} />
            </>
          )}
          {data.capacidad_reparacion !== undefined && (
            <ScoreBar label="Capacidad de reparación" value={data.capacidad_reparacion} color={C.emerald} />
          )}
          {data.puntuacion !== undefined && <ScoreBar label="Puntuación global" value={data.puntuacion} />}
        </View>
      )
    case 'sternberg':
      return (
        <View style={{ marginTop: 6 }}>
          <Text style={{ fontSize: 7, color: C.accent, marginBottom: 5, letterSpacing: 1 }}>TRIÁNGULO DEL AMOR</Text>
          <ScoreBar label="Intimidad" value={data.puntuacion_intimidad} color={C.accentLight} />
          <ScoreBar label="Pasión" value={data.puntuacion_pasion} color={C.pink} />
          <ScoreBar label="Compromiso" value={data.puntuacion_compromiso} color={C.emerald} />
        </View>
      )
    case 'levine':
      return (
        <View style={{ marginTop: 6 }}>
          {data.estilo_apego && (
            <Text style={{ fontSize: 8, color: C.white, marginBottom: 4 }}>Estilo identificado: {data.estilo_apego}</Text>
          )}
          {data.puntuacion !== undefined && <ScoreBar label="Puntuación" value={data.puntuacion} />}
        </View>
      )
    case 'perel':
      return (
        <View style={{ marginTop: 6 }}>
          {energiaVinculo && (
            <>
              <Text style={{ fontSize: 7, color: C.accent, marginBottom: 5, letterSpacing: 1 }}>ENERGÍA DEL VÍNCULO</Text>
              <ScoreBar label="Atracción inicial" value={energiaVinculo.atraccion_inicial} color={C.pink} />
              <ScoreBar label="Atracción actual" value={energiaVinculo.atraccion_actual} color={C.rose} />
              <ScoreBar label="Intimidad emocional" value={energiaVinculo.intimidad_emocional} color={C.accentLight} />
              <ScoreBar label="Conexión física" value={energiaVinculo.conexion_fisica} color={C.amber} />
            </>
          )}
          {data.puntuacion !== undefined && <ScoreBar label="Puntuación" value={data.puntuacion} />}
        </View>
      )
    case 'schnarch':
      return (
        <View style={{ marginTop: 6 }}>
          <Text style={{ fontSize: 7, color: C.accent, marginBottom: 5, letterSpacing: 1 }}>DIFERENCIACIÓN VS FUSIÓN</Text>
          <ScoreBar label="Diferenciación" value={data.puntuacion} color={C.emerald} />
          <ScoreBar label="Fusión" value={data.puntuacion != null ? 100 - data.puntuacion : 50} color={C.pink} />
        </View>
      )
    case 'tatkin':
      return (
        <View style={{ marginTop: 6 }}>
          <Text style={{ fontSize: 7, color: C.accent, marginBottom: 5, letterSpacing: 1 }}>REGULACIÓN MUTUA</Text>
          <ScoreBar label="Nivel de regulación" value={data.puntuacion} color={data.puntuacion >= 60 ? C.emerald : data.puntuacion >= 35 ? C.amber : C.pink} />
        </View>
      )
    case 'chapman':
      return (
        <View style={{ marginTop: 6 }}>
          <Text style={{ fontSize: 7, color: C.accent, marginBottom: 5, letterSpacing: 1 }}>LENGUAJES DEL AMOR</Text>
          {data.lenguaje_usuario && (
            <Text style={{ fontSize: 8, color: C.white, marginBottom: 3 }}>Tu lenguaje: {data.lenguaje_usuario}</Text>
          )}
          {data.lenguaje_pareja && (
            <Text style={{ fontSize: 8, color: C.white, marginBottom: 4 }}>Pareja: {data.lenguaje_pareja}</Text>
          )}
          {data.tiempo_calidad !== undefined && <ScoreBar label="Tiempo de calidad" value={data.tiempo_calidad} color={C.blue} />}
          {data.actos_servicio !== undefined && <ScoreBar label="Actos de servicio" value={data.actos_servicio} color={C.emerald} />}
          {data.contacto_fisico !== undefined && <ScoreBar label="Contacto físico" value={data.contacto_fisico} color={C.pink} />}
          {data.palabras !== undefined && <ScoreBar label="Palabras de afirmación" value={data.palabras} color={C.amber} />}
          {data.regalos !== undefined && <ScoreBar label="Regalos" value={data.regalos} color={C.accentLight} />}
          {data.puntuacion !== undefined && <ScoreBar label="Compatibilidad" value={data.puntuacion} />}
        </View>
      )
    case 'real':
      return (
        <View style={{ marginTop: 6 }}>
          <Text style={{ fontSize: 7, color: C.accent, marginBottom: 5, letterSpacing: 1 }}>DINÁMICA DE PODER</Text>
          <ScoreBar label="Balance relacional" value={data.puntuacion} color={C.accent} />
          <ScoreBar label="Grandiosidad" value={data.puntuacion != null ? Math.max(0, 100 - data.puntuacion - 10) : 40} color={C.amber} />
          <ScoreBar label="Vergüenza" value={data.puntuacion != null ? Math.max(0, data.puntuacion - 10) : 40} color={C.pink} />
        </View>
      )
    default:
      // sue_johnson, freud_lacan, hendrix — just show puntuacion
      return data.puntuacion !== undefined ? (
        <View style={{ marginTop: 6 }}>
          <ScoreBar label="Puntuación" value={data.puntuacion} />
        </View>
      ) : null
  }
}

// ── PDF Document Component ─────────────────────────────────────
const RadiografiaPDF = ({ analysis, profileData, crossAnalysis }) => {
  if (!analysis) return null
  const a = analysis
  const cross = crossAnalysis

  // Build autoanalisis entries that have content
  const autoEntries = AUTOANALISIS_SECTIONS.filter(
    (sec) => a.autoanalisis_usuario && a.autoanalisis_usuario[sec.key]
  )

  // Group autoanalisis in chunks of ~4 per page (compact style with break=avoid)
  const AUTO_GROUP_SIZE = 4
  const autoGroups = []
  for (let i = 0; i < autoEntries.length; i += AUTO_GROUP_SIZE) {
    autoGroups.push(autoEntries.slice(i, i + AUTO_GROUP_SIZE))
  }

  // Build lectura entries
  const lecturaEntries = a.lecturas_por_enfoque ? Object.entries(a.lecturas_por_enfoque) : []

  return (
    <Document>
      {/* ═══════════════════════════════════════════════════════
          COVER PAGE
      ═══════════════════════════════════════════════════════ */}
      <Page size="LETTER" style={s.coverPage}>
        <View style={{ textAlign: 'center', marginBottom: 80 }}>
          <Text style={{ fontSize: 9, color: C.accent, letterSpacing: 4, textTransform: 'uppercase', marginBottom: 20 }}>
            Reporte Completo
          </Text>
          <Text style={{ fontSize: 28, color: C.white, fontWeight: 300, marginBottom: 12 }}>
            Tu Radiografía de Pareja
          </Text>
          <View style={{ width: 60, height: 1, backgroundColor: C.accent, marginBottom: 20, alignSelf: 'center' }} />

          {profileData?.nombre && (
            <Text style={{ fontSize: 13, color: C.white, marginBottom: 4 }}>
              {profileData.nombre}{profileData.edad ? `, ${profileData.edad} años` : ''}
            </Text>
          )}
          {profileData?.nombrePareja && (
            <Text style={{ fontSize: 13, color: C.white, marginBottom: 4 }}>
              & {profileData.nombrePareja}{profileData.edadPareja ? `, ${profileData.edadPareja} años` : ''}
            </Text>
          )}
          {profileData?.tiempoRelacion && (
            <Text style={{ fontSize: 10, color: C.muted, marginTop: 6 }}>
              Tiempo de relación: {profileData.tiempoRelacion}
            </Text>
          )}

          <Text style={{ fontSize: 9, color: C.dim, marginTop: 24 }}>
            {new Date().toLocaleDateString('es-MX', { year: 'numeric', month: 'long', day: 'numeric' })}
          </Text>
        </View>

        <View style={{ position: 'absolute', bottom: 50, left: 40, right: 40, textAlign: 'center' }}>
          <Text style={{ fontSize: 10, color: C.muted, marginBottom: 4 }}>
            Lic. Luis Virrueta — Psicólogo Clínico
          </Text>
          <Text style={{ fontSize: 8, color: C.dim }}>
            Este reporte es confidencial y de uso exclusivo para la persona consultante.
          </Text>
        </View>
      </Page>

      {/* ═══════════════════════════════════════════════════════
          RESUMEN + DIAGNÓSTICO
      ═══════════════════════════════════════════════════════ */}
      <Page size="LETTER" style={s.page}>
        <View style={s.headerBox}>
          <Text style={s.subtitle}>Panorama General</Text>
          <Text style={s.titleSmall}>Resumen y Diagnóstico</Text>
        </View>

        {a.resumen_relacion && (
          <View style={s.section}>
            <Text style={s.sectionLabel}>Resumen de la relación</Text>
            <Text style={s.paragraph}>{clean(a.resumen_relacion)}</Text>
          </View>
        )}

        {a.diagnostico && (
          <View style={s.card}>
            <Text style={s.cardSubtitle}>Diagnóstico Relacional</Text>
            {a.diagnostico.tipo_vinculo && (
              <View style={{ marginBottom: 5 }}>
                <Text style={{ fontSize: 7.5, color: C.accent, marginBottom: 2 }}>Tipo de vínculo</Text>
                <Text style={s.paragraphSmall}>{clean(a.diagnostico.tipo_vinculo)}</Text>
              </View>
            )}
            {a.diagnostico.estilo_apego && (
              <View style={{ marginBottom: 5 }}>
                <Text style={{ fontSize: 7.5, color: C.accent, marginBottom: 2 }}>Estilo de apego</Text>
                <Text style={s.paragraphSmall}>{clean(a.diagnostico.estilo_apego)}</Text>
              </View>
            )}
            {a.diagnostico.dinamica_conflicto && (
              <View style={{ marginBottom: 5 }}>
                <Text style={{ fontSize: 7.5, color: C.accent, marginBottom: 2 }}>Dinámica de conflicto</Text>
                <Text style={s.paragraphSmall}>{clean(a.diagnostico.dinamica_conflicto)}</Text>
              </View>
            )}
            {a.diagnostico.tono_relacional && (
              <View style={{ marginBottom: 5 }}>
                <Text style={{ fontSize: 7.5, color: C.accent, marginBottom: 2 }}>Tono relacional</Text>
                <Text style={s.paragraphSmall}>{clean(a.diagnostico.tono_relacional)}</Text>
              </View>
            )}
          </View>
        )}

        {a.radiografia_inicial && (
          <View style={s.section}>
            <Text style={s.sectionLabel}>Lo que percibimos</Text>
            <Text style={s.paragraph}>{clean(a.radiografia_inicial)}</Text>
          </View>
        )}

        <PageFooter />
      </Page>

      {/* ═══════════════════════════════════════════════════════
          12 DIMENSIONES + DIRECCIÓN PROBABLE — Combined page
      ═══════════════════════════════════════════════════════ */}
      {(a.dimensiones || a.direccion_probable) && (
        <Page size="LETTER" style={s.page}>
          {a.dimensiones && (
            <>
              <View style={s.headerBox}>
                <Text style={s.subtitle}>Puntuaciones</Text>
                <Text style={s.titleSmall}>12 Dimensiones Psicológicas</Text>
              </View>

              <View style={{ marginBottom: 14 }}>
                {Object.entries(a.dimensiones).map(([key, value]) => (
                  <ScoreBar key={key} label={DIMENSION_LABELS[key] || key} value={value} />
                ))}
              </View>
            </>
          )}

          {a.direccion_probable && (
            <>
              <View style={s.divider} />
              <View style={{ marginBottom: 8 }}>
                <Text style={s.subtitle}>Pronóstico</Text>
                <Text style={{ fontSize: 13, color: C.white, fontWeight: 300, marginBottom: 8 }}>
                  Dirección Probable de la Relación
                </Text>
              </View>
              <View style={s.card}>
                <ScoreBar label="Estabilidad futura" value={a.direccion_probable.estabilidad_futura} color={C.emerald} />
                <ScoreBar label="Riesgo de desgaste" value={a.direccion_probable.riesgo_desgaste} color={C.pink} />
                <ScoreBar label="Potencial de reconexión" value={a.direccion_probable.potencial_reconexion} color={C.amber} />
              </View>
            </>
          )}

          <PageFooter />
        </Page>
      )}

      {/* ═══════════════════════════════════════════════════════
          AUTOANÁLISIS — Grouped ~4 per page
          Uses wrap=false so each card stays together;
          @react-pdf auto-breaks to next page if no room.
      ═══════════════════════════════════════════════════════ */}
      {autoGroups.map((group, gIdx) => (
        <Page key={`auto-group-${gIdx}`} size="LETTER" style={s.page} wrap>
          {gIdx === 0 && (
            <View style={s.headerBox}>
              <Text style={s.subtitle}>Parte 1</Text>
              <Text style={s.titleSmall}>Tu Radiografía Emocional</Text>
            </View>
          )}
          {gIdx > 0 && (
            <View style={{ marginBottom: 8 }}>
              <Text style={{ fontSize: 7, color: C.dim, letterSpacing: 2, textTransform: 'uppercase' }}>
                Autoanálisis · continuación
              </Text>
            </View>
          )}

          {group.map((sec) => (
            <View key={sec.key} style={s.card} wrap={false}>
              <Text style={s.cardSubtitle}>{sec.title}</Text>
              <Text style={s.paragraphSmall}>{clean(a.autoanalisis_usuario[sec.key])}</Text>
            </View>
          ))}

          <PageFooter />
        </Page>
      ))}

      {/* ═══════════════════════════════════════════════════════
          LECTURAS PSICOLÓGICAS — Each author with native bars
          Uses wrap={false} per card so it won't split mid-card.
      ═══════════════════════════════════════════════════════ */}
      {lecturaEntries.length > 0 && (
        <Page size="LETTER" style={s.page} wrap>
          <View style={s.headerBox}>
            <Text style={s.subtitle}>Parte 2</Text>
            <Text style={s.titleSmall}>11 Corrientes que Leen tu Relación</Text>
          </View>

          {lecturaEntries.map(([key, data], idx) => {
            const interp = data.interpretacion || data.interpretacion_freud || ''
            const interpLacan = data.interpretacion_lacan || ''

            return (
              <View key={`lect-${key}`} wrap={false} style={{ ...s.card, padding: 14, marginBottom: 10 }}>
                {/* Counter */}
                <Text style={{ fontSize: 6.5, color: C.dim, letterSpacing: 1, marginBottom: 3 }}>
                  {idx + 1} DE {lecturaEntries.length}
                </Text>

                {/* Author name + enfoque */}
                <Text style={{ fontSize: 12, color: C.accentLight, fontWeight: 'bold', marginBottom: 2 }}>
                  {data.titulo || LECTURA_NAMES[key] || key}
                </Text>
                <Text style={{ fontSize: 7.5, color: C.dim, marginBottom: 8, letterSpacing: 0.8 }}>
                  {data.enfoque || LECTURA_ENFOQUES[key] || ''}
                </Text>

                {/* Interpretation text */}
                <Text style={s.paragraphSmall}>{clean(interp)}</Text>

                {interpLacan && (
                  <View style={{ marginTop: 5 }}>
                    <Text style={{ fontSize: 7, color: C.accent, marginBottom: 3 }}>Lectura lacaniana</Text>
                    <Text style={s.paragraphSmall}>{clean(interpLacan)}</Text>
                  </View>
                )}

                {/* Native bars for this author */}
                <LecturaBars authorKey={key} data={data} energiaVinculo={a.energia_vinculo} />
              </View>
            )
          })}

          <PageFooter />
        </Page>
      )}

      {/* ═══════════════════════════════════════════════════════
          SÍNTESIS FINAL + FORTALEZAS Y RIESGOS — Same page
      ═══════════════════════════════════════════════════════ */}
      {(a.sintesis_final || a.fortalezas || a.riesgos) && (
        <Page size="LETTER" style={s.page} wrap>
          {a.sintesis_final && (
            <View wrap={false}>
              <View style={s.headerBox}>
                <Text style={s.subtitle}>Integración</Text>
                <Text style={s.titleSmall}>Síntesis Final</Text>
              </View>

              {a.sintesis_final.que_ocurre && (
                <View style={s.section}>
                  <Text style={s.sectionLabel}>¿Qué ocurre?</Text>
                  <Text style={s.paragraph}>{clean(a.sintesis_final.que_ocurre)}</Text>
                </View>
              )}
              {a.sintesis_final.por_que && (
                <View style={s.section}>
                  <Text style={s.sectionLabel}>¿Por qué?</Text>
                  <Text style={s.paragraph}>{clean(a.sintesis_final.por_que)}</Text>
                </View>
              )}
              {a.sintesis_final.que_sigue && (
                <View style={s.section}>
                  <Text style={s.sectionLabel}>¿Qué sigue?</Text>
                  <Text style={s.paragraph}>{clean(a.sintesis_final.que_sigue)}</Text>
                </View>
              )}
              {typeof a.sintesis_final === 'string' && (
                <View style={s.section}>
                  <Text style={s.paragraph}>{clean(a.sintesis_final)}</Text>
                </View>
              )}
            </View>
          )}

          {(a.fortalezas || a.riesgos) && (
            <View wrap={false}>
              <View style={s.divider} />
              <View style={{ marginBottom: 6 }}>
                <Text style={s.subtitle}>Balance</Text>
                <Text style={{ fontSize: 13, color: C.white, fontWeight: 300, marginBottom: 6 }}>Fortalezas y Riesgos</Text>
              </View>

              {a.fortalezas && (
                <View style={s.section}>
                  <Text style={s.sectionLabel}>Fortalezas del vínculo</Text>
                  {a.fortalezas.map((f, i) => (
                    <View key={i} style={s.listItem}>
                      <Text style={{ ...s.bullet, color: C.emerald }}>+</Text>
                      <Text style={s.listText}>{clean(f)}</Text>
                    </View>
                  ))}
                </View>
              )}

              {a.riesgos && (
                <View style={s.section}>
                  <Text style={s.sectionLabel}>Riesgos detectados</Text>
                  {a.riesgos.map((r, i) => (
                    <View key={i} style={s.listItem}>
                      <Text style={{ ...s.bullet, color: C.pink }}>!</Text>
                      <Text style={s.listText}>{clean(r)}</Text>
                    </View>
                  ))}
                </View>
              )}
            </View>
          )}

          <PageFooter />
        </Page>
      )}

      {/* ═══════════════════════════════════════════════════════
          TÉCNICAS RECOMENDADAS — Own page
      ═══════════════════════════════════════════════════════ */}
      {a.tecnicas_recomendadas?.length > 0 && (
        <Page size="LETTER" style={s.page} wrap>
          <View style={s.headerBox}>
            <Text style={s.subtitle}>Herramientas</Text>
            <Text style={s.titleSmall}>Técnicas Recomendadas</Text>
          </View>
          {a.tecnicas_recomendadas.map((t, i) => {
            const nombre = typeof t === 'string' ? t : (t.nombre || t.tecnica || t.titulo || '')
            const desc = typeof t === 'string' ? '' : (t.descripcion || t.explicacion || '')
            return (
              <View key={i} style={s.card} wrap={false}>
                <Text style={{ ...s.cardTitle, fontSize: 9 }}>{clean(nombre)}</Text>
                {desc && <Text style={s.paragraphSmall}>{clean(desc)}</Text>}
              </View>
            )
          })}
          <PageFooter />
        </Page>
      )}

      {/* ═══════════════════════════════════════════════════════
          LIBROS RECOMENDADOS — Own page
      ═══════════════════════════════════════════════════════ */}
      {a.libros_recomendados?.length > 0 && (
        <Page size="LETTER" style={s.page} wrap>
          <View style={s.headerBox}>
            <Text style={s.subtitle}>Lecturas</Text>
            <Text style={s.titleSmall}>Libros Recomendados</Text>
          </View>
          {a.libros_recomendados.map((l, i) => {
            if (typeof l === 'string') {
              return (
                <View key={i} style={s.listItem}>
                  <Text style={s.bullet}>•</Text>
                  <Text style={s.listText}>{clean(l)}</Text>
                </View>
              )
            }
            return (
              <View key={i} style={s.card} wrap={false}>
                <Text style={{ ...s.cardTitle, fontSize: 9 }}>{l.titulo || 'Libro'}</Text>
                {l.autor && <Text style={{ fontSize: 7.5, color: C.dim, marginBottom: 3 }}>{l.autor}</Text>}
                {l.razon && <Text style={s.paragraphSmall}>{clean(l.razon)}</Text>}
              </View>
            )
          })}
          <PageFooter />
        </Page>
      )}

      {/* ═══════════════════════════════════════════════════════
          TEMAS PARA CONSULTA
      ═══════════════════════════════════════════════════════ */}
      {a.temas_para_consulta?.length > 0 && (
        <Page size="LETTER" style={s.page}>
          <View style={s.headerBox}>
            <Text style={s.subtitle}>Tu Siguiente Paso</Text>
            <Text style={s.titleSmall}>Temas para Trabajar en Consulta</Text>
          </View>

          {a.temas_para_consulta.map((tema, i) => {
            const text = typeof tema === 'string' ? tema : (tema.tema || tema.titulo || tema.descripcion || '')
            return (
              <View key={i} style={s.listItem}>
                <Text style={s.bullet}>{i + 1}.</Text>
                <Text style={s.listText}>{clean(text)}</Text>
              </View>
            )
          })}

          <PageFooter />
        </Page>
      )}

      {/* ═══════════════════════════════════════════════════════
          ANÁLISIS CRUZADO
      ═══════════════════════════════════════════════════════ */}
      {cross && (
        <>
          <Page size="LETTER" style={s.coverPage}>
            <View style={{ textAlign: 'center' }}>
              <Text style={{ fontSize: 9, color: C.pink, letterSpacing: 4, textTransform: 'uppercase', marginBottom: 20 }}>
                Análisis Cruzado
              </Text>
              <Text style={{ fontSize: 22, color: C.white, fontWeight: 300, marginBottom: 12 }}>
                La perspectiva de ambos
              </Text>
              <View style={{ width: 60, height: 1, backgroundColor: C.pink, marginBottom: 20, alignSelf: 'center' }} />
              {cross._individual && (
                <Text style={{ fontSize: 12, color: C.muted }}>
                  {cross._individual.p1?.nombre || 'Persona 1'} & {cross._individual.p2?.nombre || 'Persona 2'}
                </Text>
              )}
            </View>
          </Page>

          {/* Cross: Resumen + Sincronía + Dinámica */}
          <Page size="LETTER" style={s.page} wrap>
            <View style={s.headerBox}>
              <Text style={{ ...s.subtitle, color: C.pink }}>Análisis Cruzado</Text>
              <Text style={s.titleSmall}>Resumen Cruzado</Text>
            </View>

            {cross.apertura && (
              <View style={s.section} wrap={false}>
                <Text style={s.sectionLabel}>Apertura</Text>
                <Text style={s.paragraph}>{clean(cross.apertura)}</Text>
              </View>
            )}

            {cross.resumen_cruzado && (
              <View style={s.section} wrap={false}>
                <Text style={s.sectionLabel}>Resumen</Text>
                <Text style={s.paragraph}>{clean(cross.resumen_cruzado)}</Text>
              </View>
            )}

            {cross.indice_sincronia_global !== undefined && (
              <View style={{ ...s.card, marginTop: 6 }} wrap={false}>
                <Text style={s.cardSubtitle}>Índice de sincronía global</Text>
                <ScoreBar label="Sincronía" value={cross.indice_sincronia_global} color={C.pink} />
              </View>
            )}

            {cross.dinamica_real && (
              <View style={s.section} wrap={false}>
                <Text style={s.sectionLabel}>Dinámica real</Text>
                <Text style={s.paragraph}>{clean(cross.dinamica_real)}</Text>
              </View>
            )}

            <PageFooter />
          </Page>

          {/* Cross: Dimensiones cruzadas — own page for proper spacing */}
          {cross.dimensiones_cruzadas && (
            <Page size="LETTER" style={s.page} wrap>
              <View style={s.headerBox}>
                <Text style={{ ...s.subtitle, color: C.pink }}>Análisis Cruzado</Text>
                <Text style={s.titleSmall}>Dimensiones Cruzadas</Text>
              </View>

              {Object.entries(cross.dimensiones_cruzadas).map(([key, val]) => (
                <View key={key} style={{ marginBottom: 10 }} wrap={false}>
                  <Text style={{ fontSize: 8.5, color: C.white, fontWeight: 'bold', marginBottom: 4 }}>
                    {DIMENSION_LABELS[key] || key}
                  </Text>
                  <ScoreBar label={cross._individual?.p1?.nombre || 'P1'} value={val.p1} color={C.accent} />
                  <ScoreBar label={cross._individual?.p2?.nombre || 'P2'} value={val.p2} color={C.pink} />
                  {val.interpretacion && (
                    <Text style={{ ...s.paragraphSmall, marginTop: 2 }}>{clean(val.interpretacion)}</Text>
                  )}
                </View>
              ))}

              <PageFooter />
            </Page>
          )}

          {/* Convergencias + Divergencias + Puntos ciegos */}
          {(cross.convergencias || cross.divergencias || cross.puntos_ciegos) && (
            <Page size="LETTER" style={s.page} wrap>
              {cross.convergencias && (
                <View style={s.section} wrap={false}>
                  <Text style={s.sectionLabel}>Convergencias</Text>
                  {cross.convergencias.map((c, i) => (
                    <View key={i} style={s.listItem}>
                      <Text style={{ ...s.bullet, color: C.emerald }}>+</Text>
                      <Text style={s.listText}>{clean(c)}</Text>
                    </View>
                  ))}
                </View>
              )}

              {cross.divergencias && (
                <View style={s.section} wrap={false}>
                  <Text style={s.sectionLabel}>Divergencias</Text>
                  {cross.divergencias.map((d, i) => (
                    <View key={i} style={s.listItem}>
                      <Text style={{ ...s.bullet, color: C.pink }}>!</Text>
                      <Text style={s.listText}>{clean(d)}</Text>
                    </View>
                  ))}
                </View>
              )}

              {cross.brechas_criticas?.length > 0 && (
                <View style={s.section} wrap={false}>
                  <Text style={s.sectionLabel}>Brechas críticas</Text>
                  {cross.brechas_criticas.map((b, i) => (
                    <View key={i} style={s.card}>
                      <Text style={{ ...s.cardTitle, fontSize: 8 }}>{b.dimension}</Text>
                      {b.diferencia !== undefined && (
                        <Text style={{ fontSize: 7.5, color: C.pink, marginBottom: 3 }}>Diferencia: {b.diferencia}%</Text>
                      )}
                      {b.interpretacion && <Text style={s.paragraphSmall}>{clean(b.interpretacion)}</Text>}
                    </View>
                  ))}
                </View>
              )}

              {cross.puntos_ciegos && (
                <View style={s.section} wrap={false}>
                  <Text style={s.sectionLabel}>Puntos ciegos</Text>
                  {cross.puntos_ciegos.p1_no_ve && (
                    <View style={s.card}>
                      <Text style={{ ...s.cardTitle, fontSize: 8 }}>
                        Lo que {cross._individual?.p1?.nombre || 'Persona 1'} no ve
                      </Text>
                      <Text style={s.paragraphSmall}>{clean(cross.puntos_ciegos.p1_no_ve)}</Text>
                    </View>
                  )}
                  {cross.puntos_ciegos.p2_no_ve && (
                    <View style={s.card}>
                      <Text style={{ ...s.cardTitle, fontSize: 8 }}>
                        Lo que {cross._individual?.p2?.nombre || 'Persona 2'} no ve
                      </Text>
                      <Text style={s.paragraphSmall}>{clean(cross.puntos_ciegos.p2_no_ve)}</Text>
                    </View>
                  )}
                </View>
              )}

              <PageFooter />
            </Page>
          )}

          {/* Análisis profundo + Pronóstico + Mensaje */}
          {(cross.analisis_profundo_cruzado || cross.lectura_psicoanalitica_cruzada || cross.pronostico_relacional || cross.mensaje_para_ambos) && (
            <Page size="LETTER" style={s.page} wrap>
              {cross.analisis_profundo_cruzado && (
                <View style={s.section} wrap={false}>
                  <Text style={s.sectionLabel}>Análisis profundo</Text>
                  {cross.analisis_profundo_cruzado.narrativa_dominante && (
                    <View style={{ marginBottom: 6 }}>
                      <Text style={{ fontSize: 7.5, color: C.accent, marginBottom: 2 }}>Narrativa dominante</Text>
                      <Text style={s.paragraphSmall}>{clean(cross.analisis_profundo_cruzado.narrativa_dominante)}</Text>
                    </View>
                  )}
                  {cross.analisis_profundo_cruzado.tensiones_estructurales && (
                    <View style={{ marginBottom: 6 }}>
                      <Text style={{ fontSize: 7.5, color: C.accent, marginBottom: 2 }}>Tensiones estructurales</Text>
                      <Text style={s.paragraphSmall}>{clean(cross.analisis_profundo_cruzado.tensiones_estructurales)}</Text>
                    </View>
                  )}
                  {cross.analisis_profundo_cruzado.evolucion_deseo_cruzada && (
                    <View style={{ marginBottom: 6 }}>
                      <Text style={{ fontSize: 7.5, color: C.accent, marginBottom: 2 }}>Evolución del deseo</Text>
                      <Text style={s.paragraphSmall}>{clean(cross.analisis_profundo_cruzado.evolucion_deseo_cruzada)}</Text>
                    </View>
                  )}
                  {cross.analisis_profundo_cruzado.dinamica_emocional_cruzada && (
                    <View style={{ marginBottom: 6 }}>
                      <Text style={{ fontSize: 7.5, color: C.accent, marginBottom: 2 }}>Dinámica emocional</Text>
                      <Text style={s.paragraphSmall}>{clean(cross.analisis_profundo_cruzado.dinamica_emocional_cruzada)}</Text>
                    </View>
                  )}
                </View>
              )}

              {cross.lectura_psicoanalitica_cruzada && (
                <View style={s.section} wrap={false}>
                  <Text style={s.sectionLabel}>Lectura psicoanalítica cruzada</Text>
                  {cross.lectura_psicoanalitica_cruzada.proyecciones_mutuas && (
                    <View style={{ marginBottom: 6 }}>
                      <Text style={{ fontSize: 7.5, color: C.accent, marginBottom: 2 }}>Proyecciones mutuas</Text>
                      <Text style={s.paragraphSmall}>{clean(cross.lectura_psicoanalitica_cruzada.proyecciones_mutuas)}</Text>
                    </View>
                  )}
                  {cross.lectura_psicoanalitica_cruzada.fantasma_relacional_compartido && (
                    <View style={{ marginBottom: 6 }}>
                      <Text style={{ fontSize: 7.5, color: C.accent, marginBottom: 2 }}>Fantasma relacional compartido</Text>
                      <Text style={s.paragraphSmall}>{clean(cross.lectura_psicoanalitica_cruzada.fantasma_relacional_compartido)}</Text>
                    </View>
                  )}
                  {cross.lectura_psicoanalitica_cruzada.goce_compartido && (
                    <View style={{ marginBottom: 6 }}>
                      <Text style={{ fontSize: 7.5, color: C.accent, marginBottom: 2 }}>Goce compartido</Text>
                      <Text style={s.paragraphSmall}>{clean(cross.lectura_psicoanalitica_cruzada.goce_compartido)}</Text>
                    </View>
                  )}
                </View>
              )}

              {cross.pronostico_relacional && (
                <View style={s.section} wrap={false}>
                  <Text style={s.sectionLabel}>Pronóstico relacional</Text>
                  <View style={s.card}>
                    {cross.pronostico_relacional.potencial !== undefined && (
                      <ScoreBar label="Potencial" value={cross.pronostico_relacional.potencial} color={C.emerald} />
                    )}
                    {cross.pronostico_relacional.riesgo !== undefined && (
                      <ScoreBar label="Riesgo" value={cross.pronostico_relacional.riesgo} color={C.pink} />
                    )}
                    {cross.pronostico_relacional.direccion && (
                      <Text style={{ ...s.paragraphSmall, marginTop: 4 }}>{clean(cross.pronostico_relacional.direccion)}</Text>
                    )}
                  </View>
                </View>
              )}

              {cross.mensaje_para_ambos && (
                <View style={{ ...s.card, borderColor: C.pink, marginTop: 6 }} wrap={false}>
                  <Text style={s.sectionLabel}>Mensaje para ambos</Text>
                  <Text style={s.paragraph}>{clean(cross.mensaje_para_ambos)}</Text>
                </View>
              )}

              <PageFooter />
            </Page>
          )}
        </>
      )}

      {/* ═══════════════════════════════════════════════════════
          CTA — CIERRE
      ═══════════════════════════════════════════════════════ */}
      <Page size="LETTER" style={s.coverPage}>
        <View style={{ textAlign: 'center' }}>
          <Text style={{ fontSize: 9, color: C.accent, letterSpacing: 4, textTransform: 'uppercase', marginBottom: 24 }}>
            Tu siguiente paso
          </Text>
          <Text style={{ fontSize: 22, color: C.white, fontWeight: 300, marginBottom: 8 }}>
            Este mapa revela el territorio
          </Text>
          <Text style={{ fontSize: 14, color: C.muted, fontWeight: 300, marginBottom: 30 }}>
            La consulta traza el camino.
          </Text>
          <View style={{ width: 60, height: 1, backgroundColor: C.accent, marginBottom: 30, alignSelf: 'center' }} />

          <Text style={{ fontSize: 12, color: C.white, marginBottom: 6 }}>
            Lic. Luis Virrueta — Psicólogo Clínico
          </Text>
          <Text style={{ fontSize: 10, color: C.muted, marginBottom: 4 }}>
            90 min · Online o presencial
          </Text>
          <Text style={{ fontSize: 11, color: C.accent, marginTop: 12 }}>
            wa.me/527228720520
          </Text>
        </View>
      </Page>
    </Document>
  )
}

// ── Helper: generate blob + trigger download ──────────────────
function downloadBlob(blob, filename) {
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = filename
  document.body.appendChild(a)
  a.click()
  document.body.removeChild(a)
  URL.revokeObjectURL(url)
}

// ── Full PDF (individual + cruzado combined) ───────────────────
export async function generateReactPDF(analysis, profileData, crossAnalysis) {
  const blob = await pdf(
    <RadiografiaPDF analysis={analysis} profileData={profileData} crossAnalysis={crossAnalysis} />
  ).toBlob()
  const nombre = profileData?.nombre || 'Radiografia'
  downloadBlob(blob, `Radiografia-${nombre}.pdf`)
}

// ── Individual PDF only (no cross-analysis) ────────────────────
export async function generateIndividualPDF(analysis, profileData) {
  const blob = await pdf(
    <RadiografiaPDF analysis={analysis} profileData={profileData} crossAnalysis={null} />
  ).toBlob()
  const nombre = profileData?.nombre || 'Radiografia'
  downloadBlob(blob, `Radiografia-Individual-${nombre}.pdf`)
}

// ── Cross-analysis PDF only ────────────────────────────────────
export async function generateCruzadoPDF(analysis, profileData, crossAnalysis) {
  if (!crossAnalysis) return
  const cross = crossAnalysis

  const blob = await pdf(
    <Document>
      {/* Cover */}
      <Page size="LETTER" style={s.coverPage}>
        <View style={{ textAlign: 'center', marginBottom: 80 }}>
          <Text style={{ fontSize: 9, color: C.pink, letterSpacing: 4, textTransform: 'uppercase', marginBottom: 20 }}>
            Radiografía Cruzada
          </Text>
          <Text style={{ fontSize: 28, color: C.white, fontWeight: 300, marginBottom: 12 }}>
            La perspectiva de ambos
          </Text>
          <View style={{ width: 60, height: 1, backgroundColor: C.pink, marginBottom: 20, alignSelf: 'center' }} />
          {cross._individual && (
            <Text style={{ fontSize: 13, color: C.muted }}>
              {cross._individual.p1?.nombre || 'Persona 1'} & {cross._individual.p2?.nombre || 'Persona 2'}
            </Text>
          )}
          <Text style={{ fontSize: 9, color: C.dim, marginTop: 24 }}>
            {new Date().toLocaleDateString('es-MX', { year: 'numeric', month: 'long', day: 'numeric' })}
          </Text>
        </View>
        <View style={{ position: 'absolute', bottom: 50, left: 40, right: 40, textAlign: 'center' }}>
          <Text style={{ fontSize: 10, color: C.muted, marginBottom: 4 }}>Lic. Luis Virrueta — Psicólogo Clínico</Text>
          <Text style={{ fontSize: 8, color: C.dim }}>Este reporte es confidencial y de uso exclusivo para la persona consultante.</Text>
        </View>
      </Page>

      {/* Resumen + Sincronía + Dinámica */}
      <Page size="LETTER" style={s.page} wrap>
        <View style={s.headerBox}>
          <Text style={{ ...s.subtitle, color: C.pink }}>Análisis Cruzado</Text>
          <Text style={s.titleSmall}>Resumen Cruzado</Text>
        </View>

        {cross.apertura && (
          <View style={s.section} wrap={false}>
            <Text style={s.sectionLabel}>Apertura</Text>
            <Text style={s.paragraph}>{clean(cross.apertura)}</Text>
          </View>
        )}

        {cross.resumen_cruzado && (
          <View style={s.section} wrap={false}>
            <Text style={s.sectionLabel}>Resumen</Text>
            <Text style={s.paragraph}>{clean(cross.resumen_cruzado)}</Text>
          </View>
        )}

        {cross.indice_sincronia_global !== undefined && (
          <View style={{ ...s.card, marginTop: 6 }} wrap={false}>
            <Text style={s.cardSubtitle}>Índice de sincronía global</Text>
            <ScoreBar label="Sincronía" value={cross.indice_sincronia_global} color={C.pink} />
          </View>
        )}

        {cross.dinamica_real && (
          <View style={s.section} wrap={false}>
            <Text style={s.sectionLabel}>Dinámica real</Text>
            <Text style={s.paragraph}>{clean(cross.dinamica_real)}</Text>
          </View>
        )}

        <PageFooter />
      </Page>

      {/* Dimensiones cruzadas — own page */}
      {cross.dimensiones_cruzadas && (
        <Page size="LETTER" style={s.page} wrap>
          <View style={s.headerBox}>
            <Text style={{ ...s.subtitle, color: C.pink }}>Análisis Cruzado</Text>
            <Text style={s.titleSmall}>Dimensiones Cruzadas</Text>
          </View>

          {Object.entries(cross.dimensiones_cruzadas).map(([key, val]) => (
            <View key={key} style={{ marginBottom: 10 }} wrap={false}>
              <Text style={{ fontSize: 8.5, color: C.white, fontWeight: 'bold', marginBottom: 4 }}>
                {DIMENSION_LABELS[key] || key}
              </Text>
              <ScoreBar label={cross._individual?.p1?.nombre || 'P1'} value={val.p1} color={C.accent} />
              <ScoreBar label={cross._individual?.p2?.nombre || 'P2'} value={val.p2} color={C.pink} />
              {val.interpretacion && (
                <Text style={{ ...s.paragraphSmall, marginTop: 2 }}>{clean(val.interpretacion)}</Text>
              )}
            </View>
          ))}

          <PageFooter />
        </Page>
      )}

      {/* Convergencias + Divergencias + Puntos ciegos */}
      {(cross.convergencias || cross.divergencias || cross.puntos_ciegos) && (
        <Page size="LETTER" style={s.page} wrap>
          {cross.convergencias && (
            <View style={s.section} wrap={false}>
              <Text style={s.sectionLabel}>Convergencias</Text>
              {cross.convergencias.map((c, i) => (
                <View key={i} style={s.listItem}>
                  <Text style={{ ...s.bullet, color: C.emerald }}>+</Text>
                  <Text style={s.listText}>{clean(c)}</Text>
                </View>
              ))}
            </View>
          )}

          {cross.divergencias && (
            <View style={s.section} wrap={false}>
              <Text style={s.sectionLabel}>Divergencias</Text>
              {cross.divergencias.map((d, i) => (
                <View key={i} style={s.listItem}>
                  <Text style={{ ...s.bullet, color: C.pink }}>!</Text>
                  <Text style={s.listText}>{clean(d)}</Text>
                </View>
              ))}
            </View>
          )}

          {cross.brechas_criticas?.length > 0 && (
            <View style={s.section} wrap={false}>
              <Text style={s.sectionLabel}>Brechas críticas</Text>
              {cross.brechas_criticas.map((b, i) => (
                <View key={i} style={s.card}>
                  <Text style={{ ...s.cardTitle, fontSize: 8 }}>{b.dimension}</Text>
                  {b.diferencia !== undefined && (
                    <Text style={{ fontSize: 7.5, color: C.pink, marginBottom: 3 }}>Diferencia: {b.diferencia}%</Text>
                  )}
                  {b.interpretacion && <Text style={s.paragraphSmall}>{clean(b.interpretacion)}</Text>}
                </View>
              ))}
            </View>
          )}

          {cross.puntos_ciegos && (
            <View style={s.section} wrap={false}>
              <Text style={s.sectionLabel}>Puntos ciegos</Text>
              {cross.puntos_ciegos.p1_no_ve && (
                <View style={s.card}>
                  <Text style={{ ...s.cardTitle, fontSize: 8 }}>
                    Lo que {cross._individual?.p1?.nombre || 'Persona 1'} no ve
                  </Text>
                  <Text style={s.paragraphSmall}>{clean(cross.puntos_ciegos.p1_no_ve)}</Text>
                </View>
              )}
              {cross.puntos_ciegos.p2_no_ve && (
                <View style={s.card}>
                  <Text style={{ ...s.cardTitle, fontSize: 8 }}>
                    Lo que {cross._individual?.p2?.nombre || 'Persona 2'} no ve
                  </Text>
                  <Text style={s.paragraphSmall}>{clean(cross.puntos_ciegos.p2_no_ve)}</Text>
                </View>
              )}
            </View>
          )}

          <PageFooter />
        </Page>
      )}

      {/* Análisis profundo + Pronóstico + Mensaje */}
      {(cross.analisis_profundo_cruzado || cross.lectura_psicoanalitica_cruzada || cross.pronostico_relacional || cross.mensaje_para_ambos) && (
        <Page size="LETTER" style={s.page} wrap>
          {cross.analisis_profundo_cruzado && (
            <View style={s.section} wrap={false}>
              <Text style={s.sectionLabel}>Análisis profundo</Text>
              {cross.analisis_profundo_cruzado.narrativa_dominante && (
                <View style={{ marginBottom: 6 }}>
                  <Text style={{ fontSize: 7.5, color: C.accent, marginBottom: 2 }}>Narrativa dominante</Text>
                  <Text style={s.paragraphSmall}>{clean(cross.analisis_profundo_cruzado.narrativa_dominante)}</Text>
                </View>
              )}
              {cross.analisis_profundo_cruzado.tensiones_estructurales && (
                <View style={{ marginBottom: 6 }}>
                  <Text style={{ fontSize: 7.5, color: C.accent, marginBottom: 2 }}>Tensiones estructurales</Text>
                  <Text style={s.paragraphSmall}>{clean(cross.analisis_profundo_cruzado.tensiones_estructurales)}</Text>
                </View>
              )}
              {cross.analisis_profundo_cruzado.evolucion_deseo_cruzada && (
                <View style={{ marginBottom: 6 }}>
                  <Text style={{ fontSize: 7.5, color: C.accent, marginBottom: 2 }}>Evolución del deseo</Text>
                  <Text style={s.paragraphSmall}>{clean(cross.analisis_profundo_cruzado.evolucion_deseo_cruzada)}</Text>
                </View>
              )}
              {cross.analisis_profundo_cruzado.dinamica_emocional_cruzada && (
                <View style={{ marginBottom: 6 }}>
                  <Text style={{ fontSize: 7.5, color: C.accent, marginBottom: 2 }}>Dinámica emocional</Text>
                  <Text style={s.paragraphSmall}>{clean(cross.analisis_profundo_cruzado.dinamica_emocional_cruzada)}</Text>
                </View>
              )}
            </View>
          )}

          {cross.lectura_psicoanalitica_cruzada && (
            <View style={s.section} wrap={false}>
              <Text style={s.sectionLabel}>Lectura psicoanalítica cruzada</Text>
              {cross.lectura_psicoanalitica_cruzada.proyecciones_mutuas && (
                <View style={{ marginBottom: 6 }}>
                  <Text style={{ fontSize: 7.5, color: C.accent, marginBottom: 2 }}>Proyecciones mutuas</Text>
                  <Text style={s.paragraphSmall}>{clean(cross.lectura_psicoanalitica_cruzada.proyecciones_mutuas)}</Text>
                </View>
              )}
              {cross.lectura_psicoanalitica_cruzada.fantasma_relacional_compartido && (
                <View style={{ marginBottom: 6 }}>
                  <Text style={{ fontSize: 7.5, color: C.accent, marginBottom: 2 }}>Fantasma relacional compartido</Text>
                  <Text style={s.paragraphSmall}>{clean(cross.lectura_psicoanalitica_cruzada.fantasma_relacional_compartido)}</Text>
                </View>
              )}
              {cross.lectura_psicoanalitica_cruzada.goce_compartido && (
                <View style={{ marginBottom: 6 }}>
                  <Text style={{ fontSize: 7.5, color: C.accent, marginBottom: 2 }}>Goce compartido</Text>
                  <Text style={s.paragraphSmall}>{clean(cross.lectura_psicoanalitica_cruzada.goce_compartido)}</Text>
                </View>
              )}
            </View>
          )}

          {cross.pronostico_relacional && (
            <View style={s.section} wrap={false}>
              <Text style={s.sectionLabel}>Pronóstico relacional</Text>
              <View style={s.card}>
                {cross.pronostico_relacional.potencial !== undefined && (
                  <ScoreBar label="Potencial" value={cross.pronostico_relacional.potencial} color={C.emerald} />
                )}
                {cross.pronostico_relacional.riesgo !== undefined && (
                  <ScoreBar label="Riesgo" value={cross.pronostico_relacional.riesgo} color={C.pink} />
                )}
                {cross.pronostico_relacional.direccion && (
                  <Text style={{ ...s.paragraphSmall, marginTop: 4 }}>{clean(cross.pronostico_relacional.direccion)}</Text>
                )}
              </View>
            </View>
          )}

          {cross.mensaje_para_ambos && (
            <View style={{ ...s.card, borderColor: C.pink, marginTop: 6 }} wrap={false}>
              <Text style={s.sectionLabel}>Mensaje para ambos</Text>
              <Text style={s.paragraph}>{clean(cross.mensaje_para_ambos)}</Text>
            </View>
          )}

          <PageFooter />
        </Page>
      )}

      {/* CTA */}
      <Page size="LETTER" style={s.coverPage}>
        <View style={{ textAlign: 'center' }}>
          <Text style={{ fontSize: 9, color: C.pink, letterSpacing: 4, textTransform: 'uppercase', marginBottom: 24 }}>
            Tu siguiente paso
          </Text>
          <Text style={{ fontSize: 22, color: C.white, fontWeight: 300, marginBottom: 8 }}>
            Este mapa revela el territorio
          </Text>
          <Text style={{ fontSize: 14, color: C.muted, fontWeight: 300, marginBottom: 30 }}>
            La consulta traza el camino.
          </Text>
          <View style={{ width: 60, height: 1, backgroundColor: C.pink, marginBottom: 30, alignSelf: 'center' }} />
          <Text style={{ fontSize: 12, color: C.white, marginBottom: 6 }}>Lic. Luis Virrueta — Psicólogo Clínico</Text>
          <Text style={{ fontSize: 10, color: C.muted, marginBottom: 4 }}>90 min · Online o presencial</Text>
          <Text style={{ fontSize: 11, color: C.pink, marginTop: 12 }}>wa.me/527228720520</Text>
        </View>
      </Page>
    </Document>
  ).toBlob()
  const nombre = profileData?.nombre || 'Radiografia'
  downloadBlob(blob, `Radiografia-Cruzada-${nombre}.pdf`)
}
