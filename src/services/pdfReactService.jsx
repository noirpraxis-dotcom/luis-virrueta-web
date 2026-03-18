// ─── Experimental @react-pdf/renderer PDF generator ───────────
// This is a proof of concept — does NOT support complex SVG charts.
// Generates a text-based PDF of the analysis with professional layout.

import React from 'react'
import { Document, Page, Text, View, StyleSheet, pdf, Font } from '@react-pdf/renderer'

// ── Styles ─────────────────────────────────────────────────────
const colors = {
  bg: '#0a0a12',
  cardBg: '#111120',
  accent: '#8b5cf6',
  accentLight: '#a78bfa',
  pink: '#ec4899',
  emerald: '#10b981',
  white: '#e2e8f0',
  muted: '#94a3b8',
  dim: '#64748b',
  border: '#1e1b4b'
}

const s = StyleSheet.create({
  page: { backgroundColor: colors.bg, padding: 40, fontFamily: 'Helvetica' },
  // Header
  headerBox: { textAlign: 'center', marginBottom: 30, paddingBottom: 20, borderBottomWidth: 1, borderBottomColor: colors.border },
  title: { fontSize: 22, color: colors.white, fontWeight: 300, marginBottom: 6 },
  subtitle: { fontSize: 9, color: colors.accent, letterSpacing: 3, textTransform: 'uppercase', marginBottom: 10 },
  profileInfo: { fontSize: 10, color: colors.muted, marginBottom: 2 },
  // Section
  section: { marginBottom: 20 },
  sectionTitle: { fontSize: 14, color: colors.white, fontWeight: 300, marginBottom: 8 },
  sectionLabel: { fontSize: 8, color: colors.accent, letterSpacing: 2, textTransform: 'uppercase', marginBottom: 4 },
  paragraph: { fontSize: 9.5, color: colors.muted, lineHeight: 1.6, marginBottom: 6 },
  // Card
  card: { backgroundColor: colors.cardBg, borderRadius: 8, padding: 16, marginBottom: 12, borderWidth: 0.5, borderColor: colors.border },
  cardTitle: { fontSize: 11, color: colors.accentLight, marginBottom: 6, fontWeight: 'bold' },
  cardSubtitle: { fontSize: 8, color: colors.dim, letterSpacing: 1.5, textTransform: 'uppercase', marginBottom: 6 },
  // Dimension bar
  dimRow: { flexDirection: 'row', alignItems: 'center', marginBottom: 5 },
  dimLabel: { fontSize: 8, color: colors.muted, width: 140 },
  dimBarBg: { flex: 1, height: 6, backgroundColor: '#1a1a2e', borderRadius: 3 },
  dimBarFill: { height: 6, borderRadius: 3, backgroundColor: colors.accent },
  dimValue: { fontSize: 8, color: colors.white, width: 30, textAlign: 'right' },
  // Table
  tableRow: { flexDirection: 'row', borderBottomWidth: 0.5, borderBottomColor: colors.border, paddingVertical: 4 },
  tableCell: { fontSize: 8, color: colors.muted, paddingHorizontal: 4 },
  tableCellBold: { fontSize: 8, color: colors.white, paddingHorizontal: 4, fontWeight: 'bold' },
  // List
  listItem: { flexDirection: 'row', marginBottom: 4 },
  bullet: { fontSize: 9, color: colors.accent, width: 12 },
  listText: { fontSize: 9, color: colors.muted, flex: 1, lineHeight: 1.5 },
  // Footer
  footer: { position: 'absolute', bottom: 20, left: 40, right: 40, textAlign: 'center' },
  footerText: { fontSize: 7, color: colors.dim },
  // Page number
  pageNumber: { position: 'absolute', bottom: 20, right: 40, fontSize: 7, color: colors.dim },
})

// ── Helpers ────────────────────────────────────────────────────
const cleanBold = (text) => {
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
  narrativa_futuro: 'Narrativa de futuro'
}

// ── PDF Document Component ─────────────────────────────────────
const RadiografiaPDF = ({ analysis, profileData }) => {
  if (!analysis) return null
  const a = analysis

  return (
    <Document>
      {/* === PAGE 1: Header + Resumen + Dimensiones === */}
      <Page size="LETTER" style={s.page}>
        <View style={s.headerBox}>
          <Text style={s.subtitle}>Reporte</Text>
          <Text style={s.title}>Tu Radiografía de Pareja</Text>
          {profileData?.nombre && (
            <Text style={s.profileInfo}>
              {profileData.nombre}{profileData.edad ? `, ${profileData.edad} años` : ''}
              {profileData.nombrePareja ? ` & ${profileData.nombrePareja}` : ''}
              {profileData.edadPareja ? `, ${profileData.edadPareja} años` : ''}
            </Text>
          )}
          {profileData?.fecha && <Text style={{ ...s.profileInfo, fontSize: 8, color: colors.dim }}>{profileData.fecha}</Text>}
        </View>

        {/* Resumen */}
        {a.resumen_relacion && (
          <View style={s.section}>
            <Text style={s.sectionLabel}>Resumen de la relación</Text>
            <Text style={s.paragraph}>{cleanBold(a.resumen_relacion)}</Text>
          </View>
        )}

        {/* Diagnóstico */}
        {a.diagnostico && (
          <View style={s.card}>
            <Text style={s.cardSubtitle}>Diagnóstico</Text>
            {a.diagnostico.tipo_vinculo && <Text style={s.paragraph}>Tipo de vínculo: {a.diagnostico.tipo_vinculo}</Text>}
            {a.diagnostico.estilo_apego && <Text style={s.paragraph}>Estilo de apego: {a.diagnostico.estilo_apego}</Text>}
            {a.diagnostico.dinamica_conflicto && <Text style={s.paragraph}>Dinámica de conflicto: {a.diagnostico.dinamica_conflicto}</Text>}
            {a.diagnostico.tono_relacional && <Text style={s.paragraph}>Tono relacional: {cleanBold(a.diagnostico.tono_relacional)}</Text>}
          </View>
        )}

        {/* 12 Dimensiones */}
        {a.dimensiones && (
          <View style={s.section}>
            <Text style={s.sectionLabel}>12 Dimensiones Psicológicas</Text>
            {Object.entries(a.dimensiones).map(([key, value]) => (
              <View key={key} style={s.dimRow}>
                <Text style={s.dimLabel}>{DIMENSION_LABELS[key] || key}</Text>
                <View style={s.dimBarBg}>
                  <View style={{ ...s.dimBarFill, width: `${value}%` }} />
                </View>
                <Text style={s.dimValue}>{value}%</Text>
              </View>
            ))}
          </View>
        )}

        <Text style={s.pageNumber} render={({ pageNumber, totalPages }) => `${pageNumber} / ${totalPages}`} fixed />
      </Page>

      {/* === PAGE 2: Autoanálisis === */}
      {a.autoanalisis_usuario && (
        <Page size="LETTER" style={s.page}>
          <View style={s.section}>
            <Text style={s.sectionLabel}>Tu autoanálisis</Text>
            <Text style={s.sectionTitle}>Tu radiografía emocional</Text>
          </View>

          {a.autoanalisis_usuario.apertura_rapport && (
            <View style={s.section}>
              <Text style={s.cardSubtitle}>Apertura</Text>
              <Text style={s.paragraph}>{cleanBold(a.autoanalisis_usuario.apertura_rapport)}</Text>
            </View>
          )}

          {a.autoanalisis_usuario.forma_de_amar && (
            <View style={s.section}>
              <Text style={s.cardSubtitle}>Tu forma de amar</Text>
              <Text style={s.paragraph}>{cleanBold(a.autoanalisis_usuario.forma_de_amar)}</Text>
            </View>
          )}

          {a.autoanalisis_usuario.lo_que_busca_en_el_otro && (
            <View style={s.section}>
              <Text style={s.cardSubtitle}>Lo que buscas en el otro</Text>
              <Text style={s.paragraph}>{cleanBold(a.autoanalisis_usuario.lo_que_busca_en_el_otro)}</Text>
            </View>
          )}

          <Text style={s.pageNumber} render={({ pageNumber, totalPages }) => `${pageNumber} / ${totalPages}`} fixed />
        </Page>
      )}

      {/* === PAGE 3: Autoanálisis continued === */}
      {a.autoanalisis_usuario && (
        <Page size="LETTER" style={s.page}>
          {a.autoanalisis_usuario.lo_que_reclama_afuera && (
            <View style={s.section}>
              <Text style={s.cardSubtitle}>Lo que reclamas afuera</Text>
              <Text style={s.paragraph}>{cleanBold(a.autoanalisis_usuario.lo_que_reclama_afuera)}</Text>
            </View>
          )}

          {a.autoanalisis_usuario.fantasma_relacional && (
            <View style={s.section}>
              <Text style={s.cardSubtitle}>Tu fantasma relacional</Text>
              <Text style={s.paragraph}>{cleanBold(a.autoanalisis_usuario.fantasma_relacional)}</Text>
            </View>
          )}

          {a.autoanalisis_usuario.yo_ideal && (
            <View style={s.section}>
              <Text style={s.cardSubtitle}>Tu yo ideal vs tu yo real</Text>
              <Text style={s.paragraph}>{cleanBold(a.autoanalisis_usuario.yo_ideal)}</Text>
            </View>
          )}

          <Text style={s.pageNumber} render={({ pageNumber, totalPages }) => `${pageNumber} / ${totalPages}`} fixed />
        </Page>
      )}

      {/* === PAGE 4: Autoanálisis deep === */}
      {a.autoanalisis_usuario && (
        <Page size="LETTER" style={s.page}>
          {a.autoanalisis_usuario.mecanismos_defensa && (
            <View style={s.section}>
              <Text style={s.cardSubtitle}>Mecanismos de defensa</Text>
              <Text style={s.paragraph}>{cleanBold(a.autoanalisis_usuario.mecanismos_defensa)}</Text>
            </View>
          )}

          {a.autoanalisis_usuario.nucleo_del_patron && (
            <View style={s.section}>
              <Text style={s.cardSubtitle}>El núcleo de tu patrón</Text>
              <Text style={s.paragraph}>{cleanBold(a.autoanalisis_usuario.nucleo_del_patron)}</Text>
            </View>
          )}

          {a.autoanalisis_usuario.cierre_transformador && (
            <View style={s.section}>
              <Text style={s.cardSubtitle}>Cierre transformador</Text>
              <Text style={s.paragraph}>{cleanBold(a.autoanalisis_usuario.cierre_transformador)}</Text>
            </View>
          )}

          <Text style={s.pageNumber} render={({ pageNumber, totalPages }) => `${pageNumber} / ${totalPages}`} fixed />
        </Page>
      )}

      {/* === PAGE 5: Lecturas psicológicas === */}
      {a.lecturas_por_enfoque && (
        <Page size="LETTER" style={s.page}>
          <View style={s.section}>
            <Text style={s.sectionLabel}>Lecturas psicológicas</Text>
            <Text style={s.sectionTitle}>11 corrientes que leen tu relación</Text>
          </View>

          {Object.entries(a.lecturas_por_enfoque).slice(0, 4).map(([key, data]) => (
            <View key={key} style={s.card}>
              <Text style={s.cardTitle}>{data.titulo}</Text>
              <Text style={{ ...s.paragraph, fontSize: 8, color: colors.dim, marginBottom: 4 }}>{data.enfoque}</Text>
              <Text style={s.paragraph}>{cleanBold(data.interpretacion || '').substring(0, 400)}{(data.interpretacion?.length > 400) ? '...' : ''}</Text>
              {data.puntuacion !== undefined && (
                <View style={{ ...s.dimRow, marginTop: 4 }}>
                  <Text style={s.dimLabel}>Puntuación</Text>
                  <View style={s.dimBarBg}>
                    <View style={{ ...s.dimBarFill, width: `${data.puntuacion}%` }} />
                  </View>
                  <Text style={s.dimValue}>{data.puntuacion}%</Text>
                </View>
              )}
            </View>
          ))}

          <Text style={s.pageNumber} render={({ pageNumber, totalPages }) => `${pageNumber} / ${totalPages}`} fixed />
        </Page>
      )}

      {/* === PAGE 6: More readings === */}
      {a.lecturas_por_enfoque && Object.entries(a.lecturas_por_enfoque).length > 4 && (
        <Page size="LETTER" style={s.page}>
          {Object.entries(a.lecturas_por_enfoque).slice(4, 8).map(([key, data]) => (
            <View key={key} style={s.card}>
              <Text style={s.cardTitle}>{data.titulo}</Text>
              <Text style={{ ...s.paragraph, fontSize: 8, color: colors.dim, marginBottom: 4 }}>{data.enfoque}</Text>
              <Text style={s.paragraph}>{cleanBold(data.interpretacion || data.interpretacion_freud || '').substring(0, 400)}{((data.interpretacion || data.interpretacion_freud || '').length > 400) ? '...' : ''}</Text>
              {data.puntuacion !== undefined && (
                <View style={{ ...s.dimRow, marginTop: 4 }}>
                  <Text style={s.dimLabel}>Puntuación</Text>
                  <View style={s.dimBarBg}>
                    <View style={{ ...s.dimBarFill, width: `${data.puntuacion}%` }} />
                  </View>
                  <Text style={s.dimValue}>{data.puntuacion}%</Text>
                </View>
              )}
            </View>
          ))}

          <Text style={s.pageNumber} render={({ pageNumber, totalPages }) => `${pageNumber} / ${totalPages}`} fixed />
        </Page>
      )}

      {/* === PAGE 7: Remaining readings + Synthesis === */}
      {a.lecturas_por_enfoque && Object.entries(a.lecturas_por_enfoque).length > 8 && (
        <Page size="LETTER" style={s.page}>
          {Object.entries(a.lecturas_por_enfoque).slice(8).map(([key, data]) => (
            <View key={key} style={s.card}>
              <Text style={s.cardTitle}>{data.titulo}</Text>
              <Text style={{ ...s.paragraph, fontSize: 8, color: colors.dim, marginBottom: 4 }}>{data.enfoque}</Text>
              <Text style={s.paragraph}>{cleanBold(data.interpretacion || data.interpretacion_freud || '').substring(0, 400)}{((data.interpretacion || data.interpretacion_freud || '').length > 400) ? '...' : ''}</Text>
            </View>
          ))}

          {/* Synthesis */}
          {a.sintesis_final && (
            <View style={{ ...s.section, marginTop: 10 }}>
              <Text style={s.sectionLabel}>Síntesis final</Text>
              {a.sintesis_final.que_ocurre && <Text style={s.paragraph}>{cleanBold(a.sintesis_final.que_ocurre)}</Text>}
            </View>
          )}

          <Text style={s.pageNumber} render={({ pageNumber, totalPages }) => `${pageNumber} / ${totalPages}`} fixed />
        </Page>
      )}

      {/* === PAGE 8: Fortalezas + Riesgos + Técnicas + Libros === */}
      <Page size="LETTER" style={s.page}>
        {/* Fortalezas */}
        {a.fortalezas && (
          <View style={s.section}>
            <Text style={s.sectionLabel}>Fortalezas del vínculo</Text>
            {a.fortalezas.map((f, i) => (
              <View key={i} style={s.listItem}>
                <Text style={s.bullet}>•</Text>
                <Text style={s.listText}>{cleanBold(f)}</Text>
              </View>
            ))}
          </View>
        )}

        {/* Riesgos */}
        {a.riesgos && (
          <View style={s.section}>
            <Text style={s.sectionLabel}>Riesgos detectados</Text>
            {a.riesgos.map((r, i) => (
              <View key={i} style={s.listItem}>
                <Text style={{ ...s.bullet, color: colors.pink }}>•</Text>
                <Text style={s.listText}>{cleanBold(r)}</Text>
              </View>
            ))}
          </View>
        )}

        {/* Técnicas */}
        {a.tecnicas_recomendadas && (
          <View style={s.section}>
            <Text style={s.sectionLabel}>Técnicas recomendadas</Text>
            {a.tecnicas_recomendadas.map((t, i) => (
              <View key={i} style={s.card}>
                <Text style={{ ...s.cardTitle, fontSize: 10 }}>{t.nombre}</Text>
                <Text style={s.paragraph}>{cleanBold(t.descripcion)}</Text>
                {t.nivel && <Text style={{ ...s.paragraph, fontSize: 7, color: colors.dim }}>Nivel: {t.nivel}</Text>}
              </View>
            ))}
          </View>
        )}

        {/* Libros */}
        {a.libros_recomendados && (
          <View style={s.section}>
            <Text style={s.sectionLabel}>Lecturas recomendadas</Text>
            {a.libros_recomendados.map((l, i) => (
              <View key={i} style={s.listItem}>
                <Text style={s.bullet}>📖</Text>
                <Text style={s.listText}>
                  {l.titulo} — {l.autor}. {cleanBold(l.razon)}
                </Text>
              </View>
            ))}
          </View>
        )}

        {/* CTA */}
        <View style={{ ...s.card, backgroundColor: '#0f0f2a', borderColor: colors.accent, textAlign: 'center', marginTop: 10 }}>
          <Text style={{ ...s.sectionTitle, textAlign: 'center', marginBottom: 4 }}>Este mapa revela el territorio</Text>
          <Text style={{ ...s.paragraph, textAlign: 'center', marginBottom: 6 }}>La consulta traza el camino. Lic. Luis Virrueta · 90 min · Online o presencial</Text>
          <Text style={{ ...s.paragraph, textAlign: 'center', color: colors.accent }}>wa.me/527228720520</Text>
        </View>

        <Text style={s.pageNumber} render={({ pageNumber, totalPages }) => `${pageNumber} / ${totalPages}`} fixed />
      </Page>
    </Document>
  )
}

// ── Export function to generate and download PDF ────────────────
export async function generateReactPDF(analysis, profileData) {
  const blob = await pdf(<RadiografiaPDF analysis={analysis} profileData={profileData} />).toBlob()
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  const nombre = profileData?.nombre || 'Radiografia'
  a.href = url
  a.download = `Radiografia-${nombre}-React.pdf`
  document.body.appendChild(a)
  a.click()
  document.body.removeChild(a)
  URL.revokeObjectURL(url)
}
