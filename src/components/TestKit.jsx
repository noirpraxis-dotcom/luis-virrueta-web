import { motion } from 'framer-motion'

const Bar = ({ percent, className }) => (
  <div className="h-2 bg-white/10 rounded-full overflow-hidden">
    <div className={`h-full ${className}`} style={{ width: `${percent}%` }} />
  </div>
)

const formatDelta = (points) => {
  const v = Number(points) || 0
  return `${v >= 0 ? '+' : '-'}${Math.abs(v).toFixed(2)}`
}

const TestKit = ({
  title = 'En vivo',
  answeredCount,
  clusters,
  axes,
  dynamics,
  ranking,
  roles,
  coverage,
  stability,
  confidence,
  lastChange,
  maxChangeRows = 8
}) => {
  const grouped = Array.isArray(lastChange)
    ? Object.values(
        lastChange.reduce((acc, row) => {
          const key = (row?.target ?? 'Registro').toString()
          if (!acc[key]) {
            acc[key] = {
              id: key,
              questionId: row?.questionId,
              target: key,
              points: 0,
              count: 0
            }
          }
          acc[key].points += Number(row?.points ?? 0)
          acc[key].count += 1
          return acc
        }, {})
      )
        .sort((a, b) => Math.abs(b.points) - Math.abs(a.points))
        .slice(0, maxChangeRows)
    : []

  return (
    <div className="w-full">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-bold">{title}</h3>
        <span className="text-xs text-white/50">Actualización en tiempo real</span>
      </div>

      <div className="mb-4 grid md:grid-cols-3 gap-4">
        <div className="p-4 bg-white/5 border border-white/10 rounded-xl">
          <div className="text-xs text-white/50">Progreso</div>
          <div className="text-lg font-bold">{Number(answeredCount ?? 0)} respuestas</div>
          {coverage ? (
            <div className="text-xs text-white/50 mt-1">
              Cobertura: {coverage.mappedTagsCount ?? 0}/{coverage.totalTagsCount ?? 0}
            </div>
          ) : null}
        </div>

        <div className="p-4 bg-white/5 border border-white/10 rounded-xl">
          <div className="text-xs text-white/50">Confianza</div>
          <div className="text-lg font-bold">{confidence?.level ?? 'Baja'}</div>
          <div className="text-xs text-white/50 mt-1">{confidence?.note ?? 'Responde más preguntas para afinar.'}</div>
        </div>

        <div className="p-4 bg-white/5 border border-white/10 rounded-xl md:col-span-2">
          <div className="text-xs text-white/50 mb-2">Lectura rápida (provisional)</div>
          {axes ? (
            <div className="flex flex-wrap gap-2">
              <span className="px-3 py-1 rounded-full border border-white/10 bg-white/5 text-xs text-white/70">
                {axes.peopleVsSystems < 45 ? 'Más orientado a personas' : axes.peopleVsSystems > 55 ? 'Más orientado a sistemas' : 'Balance personas/sistemas'}
              </span>
              <span className="px-3 py-1 rounded-full border border-white/10 bg-white/5 text-xs text-white/70">
                {axes.creativityVsStructure < 45 ? 'Más creativo' : axes.creativityVsStructure > 55 ? 'Más estructurado' : 'Balance creatividad/estructura'}
              </span>
              <span className="px-3 py-1 rounded-full border border-white/10 bg-white/5 text-xs text-white/70">
                {axes.riskVsStability < 45 ? 'Más explorador (riesgo)' : axes.riskVsStability > 55 ? 'Más estable (seguridad)' : 'Balance riesgo/estabilidad'}
              </span>
              {stability ? (
                <span className="px-3 py-1 rounded-full border border-white/10 bg-white/5 text-xs text-white/70">
                  Estabilidad: {stability.label}
                </span>
              ) : null}
            </div>
          ) : (
            <div className="text-xs text-white/50">Responde algunas preguntas para activar la lectura.</div>
          )}
        </div>
      </div>

      <div className="mb-4 grid lg:grid-cols-2 gap-4">
        <div className="p-4 bg-white/5 border border-white/10 rounded-xl">
          <div className="text-sm font-semibold mb-3">Deseo × Estructura</div>
          {dynamics ? (
            <>
              <div className="grid grid-cols-2 gap-3">
                {(() => {
                  const desire = Number(dynamics?.desire ?? 0)
                  const structure = Number(dynamics?.structure ?? 0)
                  const desireHigh = desire >= 55
                  const structureHigh = structure >= 55

                  const activeKey = `${desireHigh ? 'H' : 'L'}-${structureHigh ? 'H' : 'L'}`
                  const cards = [
                    { key: 'H-H', title: 'Dirección con sostén', desc: 'Interés alto con capacidad de sostenerlo.' },
                    { key: 'H-L', title: 'Impulso exploratorio', desc: 'Interés alto; necesitas estructura para sostener.' },
                    { key: 'L-H', title: 'Elección por seguridad', desc: 'Sostén alto; revisa deseo real antes de elegir.' },
                    { key: 'L-L', title: 'Pausa decisional', desc: 'Conviene explorar y bajar presión antes de decidir.' }
                  ]
                  return cards.map((c) => (
                    <div
                      key={c.key}
                      className={`p-3 rounded-xl border ${c.key === activeKey ? 'border-white/30 bg-white/10' : 'border-white/10 bg-white/5'}`}
                    >
                      <div className="text-xs font-semibold text-white/90">{c.title}</div>
                      <div className="text-[11px] text-white/60 leading-relaxed mt-1">{c.desc}</div>
                    </div>
                  ))
                })()}
              </div>
              <div className="mt-3 grid md:grid-cols-2 gap-3">
                <div>
                  <div className="flex items-center justify-between text-xs mb-1">
                    <span className="text-white/60">Deseo</span>
                    <span className="text-white/50">{Number(dynamics?.desire ?? 0)}%</span>
                  </div>
                  <Bar percent={Number(dynamics?.desire ?? 0)} className="bg-gradient-to-r from-purple-500 to-fuchsia-500" />
                </div>
                <div>
                  <div className="flex items-center justify-between text-xs mb-1">
                    <span className="text-white/60">Estructura</span>
                    <span className="text-white/50">{Number(dynamics?.structure ?? 0)}%</span>
                  </div>
                  <Bar percent={Number(dynamics?.structure ?? 0)} className="bg-gradient-to-r from-fuchsia-500 to-purple-500" />
                </div>
              </div>

              {dynamics?.detail ? (
                <div className="mt-4">
                  <div className="text-xs text-white/60 mb-2">Deseo (detalle)</div>
                  <div className="space-y-3">
                    <div>
                      <div className="flex items-center justify-between text-xs mb-1">
                        <span className="text-white/60">Núcleo</span>
                        <span className="text-white/50">{Number(dynamics?.detail?.core ?? 0)}%</span>
                      </div>
                      <Bar percent={Number(dynamics?.detail?.core ?? 0)} className="bg-gradient-to-r from-purple-500 to-fuchsia-500" />
                    </div>
                    <div>
                      <div className="flex items-center justify-between text-xs mb-1">
                        <span className="text-white/60">Relación</span>
                        <span className="text-white/50">{Number(dynamics?.detail?.relation ?? 0)}%</span>
                      </div>
                      <Bar percent={Number(dynamics?.detail?.relation ?? 0)} className="bg-gradient-to-r from-purple-500 to-fuchsia-500" />
                    </div>
                    <div>
                      <div className="flex items-center justify-between text-xs mb-1">
                        <span className="text-white/60">Resultado</span>
                        <span className="text-white/50">{Number(dynamics?.detail?.outcome ?? 0)}%</span>
                      </div>
                      <Bar percent={Number(dynamics?.detail?.outcome ?? 0)} className="bg-gradient-to-r from-purple-500 to-fuchsia-500" />
                    </div>
                  </div>
                  <div className="text-[11px] text-white/45 mt-2">
                    Lectura rápida: si el Deseo total sube pero el detalle está bajo, suele indicar ambivalencia o respuestas mixtas.
                  </div>
                </div>
              ) : null}

              <div className="text-xs text-white/50 mt-3">
                No es bueno o malo: describe desde dónde eliges hoy.
              </div>
            </>
          ) : (
            <div className="text-xs text-white/50">Se activará conforme avances.</div>
          )}
        </div>

        <div className="p-4 bg-white/5 border border-white/10 rounded-xl">
          <div className="text-sm font-semibold mb-3">Tensiones principales</div>
          {axes ? (
            <div className="space-y-2 text-xs text-white/70">
              {(() => {
                const items = []
                const p = Number(axes.peopleVsSystems ?? 50)
                const c = Number(axes.creativityVsStructure ?? 50)
                const r = Number(axes.riskVsStability ?? 50)
                const desire = Number(dynamics?.desire ?? 0)
                const structure = Number(dynamics?.structure ?? 0)

                if (p > 62) items.push('Preferencia marcada por sistemas: cuidado con aislarte de lo humano si te importa impactar personas.')
                if (p < 38) items.push('Preferencia marcada por lo humano: cuidado con descartar rutas técnicas que sí podrías disfrutar.')
                if (c > 62) items.push('Estructura alta: gran sostén, pero vigila elegir solo por “lo seguro”.')
                if (c < 38) items.push('Creatividad alta: mucha chispa, pero te conviene estructura mínima para sostenerla.')
                if (r > 62) items.push('Búsqueda de estabilidad: te ayuda a sostener, pero puede frenar exploración.')
                if (r < 38) items.push('Exploración alta: te abre puertas, pero puede dispersarte sin dirección.')

                if (desire >= 60 && structure < 45) items.push('Deseo alto con estructura baja: el reto es convertir interés en plan.' )
                if (structure >= 60 && desire < 45) items.push('Estructura alta con deseo bajo: revisar si eliges por expectativa o por interés.' )

                const unique = Array.from(new Set(items))
                return unique.slice(0, 3).map((t) => (
                  <div key={t} className="p-3 rounded-xl border border-white/10 bg-white/5">
                    {t}
                  </div>
                ))
              })()}
              <div className="text-white/50">(Provisional: se afina conforme respondes.)</div>
            </div>
          ) : (
            <div className="text-xs text-white/50">Responde más para ver tensiones.</div>
          )}
        </div>
      </div>

      <div className="grid lg:grid-cols-3 gap-4">
        <div className="p-4 bg-white/5 border border-white/10 rounded-xl">
          <div className="text-sm font-semibold mb-3">Ranking provisional</div>
          {Array.isArray(ranking) && ranking.length > 0 ? (
            <div className="space-y-3">
              {(() => {
                const top = ranking[0]
                const max = Math.max(1, Number(top?.score ?? 0))
                return ranking.slice(0, 8).map((r) => {
                  const pct = Math.max(0, Math.min(100, Math.round((Number(r?.score ?? 0) / max) * 100)))
                  return (
                    <div key={r.career}>
                      <div className="flex items-center justify-between mb-1">
                        <div className="text-xs text-white/70 font-medium">{r.profile?.name ?? r.career}</div>
                        <div className="text-xs text-white/50">{pct}%</div>
                      </div>
                      {Number.isFinite(r?.evidence) ? (
                        <div className="text-[11px] text-white/45 mb-1">Evidencia: {Number(r?.evidence ?? 0)} señales</div>
                      ) : null}
                      <Bar percent={pct} className={`bg-gradient-to-r ${r.profile?.color ?? 'from-purple-500 to-fuchsia-500'}`} />
                    </div>
                  )
                })
              })()}

              {Array.isArray(roles) && roles.length > 0 ? (
                <div className="pt-3 mt-3 border-t border-white/10">
                  <div className="text-xs font-semibold text-white/80 mb-2">Otros rankings (campos derivados)</div>
                  <div className="space-y-2">
                    {roles.slice(0, 4).map((r) => (
                      <div key={r.key} className="p-3 rounded-xl border border-white/10 bg-white/5">
                        <div className="flex items-center justify-between gap-2">
                          <div className="text-xs text-white/80 font-medium">{r.label}</div>
                          <div className="text-xs text-white/50">{Number(r.score ?? 0)}%</div>
                        </div>
                        <div className="mt-2">
                          <Bar percent={Number(r.score ?? 0)} className="bg-gradient-to-r from-purple-500 to-fuchsia-500" />
                        </div>
                        {r.note ? <div className="text-[11px] text-white/50 mt-2">{r.note}</div> : null}
                      </div>
                    ))}
                  </div>
                  <div className="text-[11px] text-white/45 mt-2">
                    Estos campos se derivan de ejes + clústers (no son una lista exhaustiva de profesiones).
                  </div>
                </div>
              ) : null}
            </div>
          ) : (
            <div className="text-xs text-white/50">Se mostrará a medida que respondas.</div>
          )}
        </div>

        <div className="p-4 bg-white/5 border border-white/10 rounded-xl">
          <div className="text-sm font-semibold mb-3">Clústers</div>
          {Array.isArray(clusters) && clusters.length > 0 ? (
            <div className="space-y-3">
              {clusters.slice(0, 6).map((c) => (
                <div key={c.key}>
                  <div className="flex items-center justify-between mb-1">
                    <div className="text-xs text-white/70 font-medium">{c.meta?.label ?? c.key}</div>
                    <div className="text-xs text-white/50">{c.percentage}%</div>
                  </div>
                  <Bar percent={c.percentage} className={`bg-gradient-to-r ${c.meta?.color ?? 'from-purple-500 to-fuchsia-500'}`} />
                </div>
              ))}
            </div>
          ) : (
            <div className="text-xs text-white/50">Aún no hay suficientes respuestas.</div>
          )}
        </div>

        <div className="p-4 bg-white/5 border border-white/10 rounded-xl">
          <div className="text-sm font-semibold mb-3">Ejes</div>
          {axes ? (
            <div className="space-y-4">
              <div>
                <div className="flex items-center justify-between text-xs mb-1">
                  <span className="text-white/60">Humano</span>
                  <span className="text-white/60">Sistemas</span>
                </div>
                <Bar percent={axes.peopleVsSystems ?? 50} className="bg-gradient-to-r from-purple-500 to-fuchsia-500" />
              </div>
              <div>
                <div className="flex items-center justify-between text-xs mb-1">
                  <span className="text-white/60">Creatividad</span>
                  <span className="text-white/60">Estructura</span>
                </div>
                <Bar percent={axes.creativityVsStructure ?? 50} className="bg-gradient-to-r from-fuchsia-500 to-purple-500" />
              </div>
              <div>
                <div className="flex items-center justify-between text-xs mb-1">
                  <span className="text-white/60">Riesgo</span>
                  <span className="text-white/60">Estabilidad</span>
                </div>
                <Bar percent={axes.riskVsStability ?? 50} className="bg-gradient-to-r from-amber-500 to-orange-500" />
              </div>

              <div className="text-[11px] text-white/45">
                Cómo leerlos: 0–100 describe un continuo (izquierda vs derecha). ~50 significa balance.
              </div>
            </div>
          ) : (
            <div className="text-xs text-white/50">Aún no hay suficientes respuestas.</div>
          )}
        </div>
      </div>

      <div className="mt-4 p-4 bg-black/30 border border-white/10 rounded-xl">
        <div className="text-sm font-semibold mb-3">Lo que cambió con tu última respuesta</div>
        {grouped.length > 0 ? (
          <div className="space-y-2">
            {grouped.map((row) => (
              <motion.div
                key={row.id}
                initial={{ opacity: 0, y: 6 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-xs text-white/70"
              >
                <span className="text-white/50">Q{row.questionId}:</span> {formatDelta(row.points)} → <span className="text-white/90">{row.target}</span>
                <span className="text-white/50"> — {row.count} aportes</span>
              </motion.div>
            ))}
          </div>
        ) : (
          <div className="text-xs text-white/50">Responde una opción para ver el cambio en vivo.</div>
        )}
      </div>
    </div>
  )
}

export default TestKit
