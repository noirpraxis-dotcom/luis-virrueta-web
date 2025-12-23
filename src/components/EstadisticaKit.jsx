import { motion } from 'framer-motion'

const formatSeconds = (seconds) => {
  const mins = Math.floor(seconds / 60)
  const secs = seconds % 60
  return `${mins}:${secs.toString().padStart(2, '0')}`
}

const Bar = ({ percent, className }) => (
  <div className="h-2 bg-white/10 rounded-full overflow-hidden">
    <div className={`h-full ${className}`} style={{ width: `${percent}%` }} />
  </div>
)

const EstadisticaKit = ({
  title = 'Estadística',
  answeredCount,
  totalCount,
  timeSpentSeconds,
  timeExtensionsCount,
  timeExtensionsSeconds,
  clusters,
  axes,
  perQuestionTime,
  debug,
  debugLog
}) => {
  const avgPerQuestion = answeredCount ? Math.round((timeSpentSeconds ?? 0) / Math.max(1, answeredCount)) : 0
  const slowest = debug && perQuestionTime && typeof perQuestionTime === 'object'
    ? Object.entries(perQuestionTime)
        .map(([id, secs]) => ({ id, secs: Number(secs) || 0 }))
        .sort((a, b) => b.secs - a.secs)
        .slice(0, 5)
    : []

  return (
    <div className="w-full">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-bold">{title}</h3>
        {debug && (
          <span className="text-xs text-white/50">Modo prueba</span>
        )}
      </div>

      <div className="grid md:grid-cols-3 gap-4 mb-6">
        <div className="p-4 bg-white/5 border border-white/10 rounded-xl">
          <div className="text-xs text-white/50">Progreso</div>
          <div className="text-lg font-bold">{answeredCount}/{totalCount}</div>
        </div>
        <div className="p-4 bg-white/5 border border-white/10 rounded-xl">
          <div className="text-xs text-white/50">Tiempo usado</div>
          <div className="text-lg font-bold">{formatSeconds(timeSpentSeconds ?? 0)}</div>
          {debug && (
            <div className="text-xs text-white/50 mt-1">Promedio: {formatSeconds(avgPerQuestion)}/pregunta</div>
          )}
        </div>
        <div className="p-4 bg-white/5 border border-white/10 rounded-xl">
          <div className="text-xs text-white/50">Extensiones</div>
          <div className="text-lg font-bold">{timeExtensionsCount ?? 0} (+{formatSeconds(timeExtensionsSeconds ?? 0)})</div>
        </div>
      </div>

      {debug && slowest.length > 0 && (
        <div className="p-4 bg-white/5 border border-white/10 rounded-xl mb-6">
          <div className="text-sm font-semibold mb-3">Preguntas más lentas</div>
          <div className="space-y-2">
            {slowest.map((row) => (
              <div key={row.id} className="flex items-center justify-between text-xs">
                <span className="text-white/60">Q{row.id}</span>
                <span className="text-white/80 font-mono">{formatSeconds(row.secs)}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {Array.isArray(clusters) && clusters.length > 0 && (
        <div className="p-4 bg-white/5 border border-white/10 rounded-xl mb-6">
          <div className="text-sm font-semibold mb-3">Clústers</div>
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
        </div>
      )}

      {axes && (
        <div className="p-4 bg-white/5 border border-white/10 rounded-xl mb-6">
          <div className="text-sm font-semibold mb-3">Ejes</div>
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
          </div>
        </div>
      )}

      {debug && Array.isArray(debugLog) && debugLog.length > 0 && (
        <div className="p-4 bg-black/30 border border-white/10 rounded-xl">
          <div className="text-sm font-semibold mb-3">Log de puntuación (temporal)</div>
          <div className="max-h-56 overflow-auto space-y-2 pr-2">
            {debugLog.slice().reverse().slice(0, 30).map((row) => (
              <motion.div
                key={row.id}
                initial={{ opacity: 0, y: 6 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-xs text-white/70"
              >
                <span className="text-white/50">Q{row.questionId}:</span> {`${row.points >= 0 ? '+' : '-'}${Math.abs(row.points).toFixed(2)}`} → <span className="text-white/90">{row.target}</span>
                {row.reason ? <span className="text-white/50"> — {row.reason}</span> : null}
              </motion.div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}

export default EstadisticaKit
