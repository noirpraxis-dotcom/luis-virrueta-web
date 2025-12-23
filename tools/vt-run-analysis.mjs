import fs from 'node:fs'
import path from 'node:path'
import vm from 'node:vm'

const ROOT = process.cwd()
const PAGE = path.join(ROOT, 'src', 'pages', 'VocationalTestPage.jsx')

const clamp = (v, min, max) => Math.min(max, Math.max(min, v))

function mulberry32(seed) {
  let t = seed >>> 0
  return function rng() {
    t += 0x6D2B79F5
    let x = t
    x = Math.imul(x ^ (x >>> 15), x | 1)
    x ^= x + Math.imul(x ^ (x >>> 7), x | 61)
    return ((x ^ (x >>> 14)) >>> 0) / 4294967296
  }
}

function stableSeedFromString(s) {
  const str = String(s ?? '')
  let h = 2166136261
  for (let i = 0; i < str.length; i += 1) {
    h ^= str.charCodeAt(i)
    h = Math.imul(h, 16777619)
  }
  return h >>> 0
}

function extractCoreFromPage(sourceText) {
  const src = String(sourceText || '').replace(/\r\n/g, '\n')

  // Extract from inside component function body.
  const start = src.indexOf('const VocationalTestPage')
  if (start < 0) throw new Error('Could not find "const VocationalTestPage"')

  // IMPORTANT: the first "{" after the const is the destructuring param ({ initialStage ... })
  // so we must find the "{" that opens the arrow function body (after "=>").
  const arrowIdx = src.indexOf('=>', start)
  if (arrowIdx < 0) throw new Error('Could not find arrow (=>) for VocationalTestPage')
  const openBraceIdx = src.indexOf('{', arrowIdx)
  if (openBraceIdx < 0) throw new Error('Could not find opening brace for VocationalTestPage body')

  // We cut the component body BEFORE the JSX return.
  // Pick the component-level return, which in this file is indented with exactly two spaces.
  const returnRe = /\n {2}return\s*\(\s*\n/
  const m = returnRe.exec(src.slice(openBraceIdx))
  if (!m || typeof m.index !== 'number') {
    throw new Error('Could not find the component JSX return marker "  return (" (two-space indent).')
  }
  const idx = openBraceIdx + m.index

  const body = src.slice(openBraceIdx + 1, idx)

  // Stubs: enough to execute the pre-return body without React runtime.
  const harness = `
    const globalThisRef = globalThis;

    const useState = (init) => {
      const v = (typeof init === 'function') ? init() : init;
      return [v, () => {}];
    };
    const useEffect = () => {};
    const useMemo = (fn) => fn();
    const useRef = () => ({ current: null });
    const useCallback = (fn) => fn;

    const useNavigate = () => (() => {});
    const useLocation = () => ({ search: '' });

    const useInView = () => true;

    // Stub icon components referenced in data objects
    const Clock=()=>null, CheckCircle=()=>null, ArrowRight=()=>null, ArrowLeft=()=>null, Brain=()=>null, Heart=()=>null, Sparkles=()=>null, TrendingUp=()=>null, Users=()=>null, Code=()=>null, Palette=()=>null, BookOpen=()=>null, Briefcase=()=>null, Target=()=>null, Home=()=>null, AlertCircle=()=>null, BarChart3=()=>null, PieChart=()=>null, Activity=()=>null;

    const VocationalTestPage = ({ initialStage = 'intro' } = {}) => {
      ${body}
      return {
        buildInitialQuestions,
        followUpsByCluster,
        computeScores,
        dimensionWeights,
        careerProfiles,
        tagToProfileKey,
        profileToCluster,
        clusters,
        normalizeTag
      };
    };

    globalThisRef.__VT_CORE__ = VocationalTestPage({ initialStage: 'intro' });
  `

  const context = {
    console,
    globalThis,
    URLSearchParams,
    window: undefined,
    document: undefined,
  }

  vm.runInNewContext(harness, context, { filename: 'vt-extract.vm.js' })
  if (!globalThis.__VT_CORE__) throw new Error('Extraction failed: __VT_CORE__ not set')
  return globalThis.__VT_CORE__
}

function getArchetypes() {
  return {
    business: {
      label: 'Negocios',
      expectedProfiles: ['business', 'entrepreneurship', 'operations'],
      strictExpectedTop: ['business', 'entrepreneurship'],
      preferProfiles: ['business', 'entrepreneurship', 'operations'],
      preferTags: ['finance', 'sales', 'marketing', 'management', 'consulting', 'admin', 'operations', 'project-management', 'product'],
    },
    tech: {
      label: 'Tecnología',
      expectedProfiles: ['tech', 'engineering'],
      strictExpectedTop: ['tech', 'engineering'],
      preferProfiles: ['tech', 'engineering'],
      preferTags: ['software', 'programming', 'coding', 'cybersecurity', 'devops', 'data', 'ai/ml', 'ia/ml', 'automation', 'engineering', 'product'],
    },
    creative: {
      label: 'Creativo/Medios',
      expectedProfiles: ['creative', 'media'],
      strictExpectedTop: ['creative', 'media'],
      preferProfiles: ['creative', 'media'],
      preferTags: ['design', 'ux', 'ui', 'branding', 'writing', 'media', 'journalism', 'content', 'entertainment', 'music', 'arts'],
    },
    human: {
      label: 'Humano/Servicio',
      expectedProfiles: ['psychology', 'education', 'social', 'public'],
      strictExpectedTop: ['psychology', 'education', 'public'],
      preferProfiles: ['psychology', 'education', 'social', 'public'],
      preferTags: ['psychology', 'counseling', 'education', 'teaching', 'ngo', 'community', 'law', 'politics', 'government', 'human-rights', 'rights'],
    },
    care: {
      label: 'Cuidado/Salud',
      expectedProfiles: ['health', 'sports'],
      strictExpectedTop: ['health', 'sports'],
      preferProfiles: ['health', 'sports'],
      preferTags: ['health', 'medicine', 'nutrition', 'fitness', 'emergency', 'sports'],
    },
    analytic: {
      label: 'Analítico',
      expectedProfiles: ['science', 'environment'],
      strictExpectedTop: ['science', 'environment'],
      preferProfiles: ['science', 'environment'],
      preferTags: ['science', 'research', 'investigation', 'lab', 'data', 'academic', 'environment'],
    },

    // Additional targeted archetypes (broader coverage)
    operations: {
      label: 'Operaciones/Logística',
      expectedProfiles: ['operations', 'engineering', 'business'],
      strictExpectedTop: ['operations'],
      preferProfiles: ['operations', 'engineering'],
      preferTags: ['operations', 'logistics', 'admin', 'quality', 'manufacturing', 'process', 'project-management', 'support'],
    },
    public: {
      label: 'Derecho/Servicio Público',
      expectedProfiles: ['public', 'social', 'education', 'psychology'],
      strictExpectedTop: ['public'],
      preferProfiles: ['public'],
      preferTags: ['law', 'government', 'policy', 'politics', 'rights', 'human-rights', 'public'],
    },
    environment: {
      label: 'Medio Ambiente',
      expectedProfiles: ['environment', 'science', 'engineering'],
      strictExpectedTop: ['environment'],
      preferProfiles: ['environment'],
      preferTags: ['environment', 'sustainability', 'climate', 'ecology', 'energy', 'renewables', 'conservation', 'impact'],
    },
    media: {
      label: 'Comunicación/Medios',
      expectedProfiles: ['media', 'creative'],
      strictExpectedTop: ['media'],
      preferProfiles: ['media'],
      preferTags: ['media', 'writing', 'journalism', 'content', 'communication', 'branding'],
    },
    sports: {
      label: 'Deporte/Rendimiento',
      expectedProfiles: ['sports', 'health'],
      strictExpectedTop: ['sports'],
      preferProfiles: ['sports'],
      preferTags: ['sports', 'fitness', 'competitive'],
    },
    education: {
      label: 'Educación',
      expectedProfiles: ['education', 'psychology', 'social'],
      strictExpectedTop: ['education'],
      preferProfiles: ['education'],
      preferTags: ['education', 'teaching', 'docencia', 'training', 'mentor', 'pedagogy', 'pedagogia'],
    },
  }
}

function runSimulationForArchetype(core, archetypeKey, options) {
  const archetypes = getArchetypes()
  const preset = archetypes[archetypeKey] || archetypes.business

  const runs = Number(options?.runs ?? 200)
  const noiseProb = Number(options?.noiseProb ?? 0.15)
  const partialAnswerRate = clamp(Number(options?.partialAnswerRate ?? 0), 0, 0.95)
  const seed = stableSeedFromString(`${options?.seed ?? 'vt'}:${archetypeKey}:${noiseProb}:${partialAnswerRate}`)
  const rand = mulberry32(seed)

  const scoreOption = (opt) => {
    const value = Number(opt?.value ?? 0)
    const tags = Array.isArray(opt?.careers) ? opt.careers : []
    if (tags.length === 0) return value

    let score = 0
    for (const t of tags) {
      const nt = core.normalizeTag(t)
      const pk = core.tagToProfileKey(nt)
      let mult = 1
      if (pk && preset.preferProfiles.includes(pk)) mult += 1.35
      if (preset.preferTags.includes(nt)) mult += 0.85
      if (pk) mult += 0.15
      score += value * mult
    }
    // tiny deterministic jitter
    score += (rand() - 0.5) * 1e-3
    return score
  }

  const pickForQuestion = (q) => {
    const opts = Array.isArray(q?.options) ? q.options : []
    if (opts.length === 0) return null

    const scored = opts
      .map((opt) => ({ opt, s: scoreOption(opt) }))
      .sort((a, b) => b.s - a.s)

    const pickIndex = (max) => {
      if (max <= 0) return 0
      if (rand() < noiseProb) return Math.min(1, max)
      return 0
    }

    if (q?.allowDouble === true) {
      const i0 = pickIndex(scored.length - 1)
      const i1 = Math.min(scored.length - 1, i0 === 0 ? 1 : 0)
      const a = scored[i0]?.opt
      const b = scored[i1]?.opt
      const picks = [a, b].filter(Boolean)
      return picks.length > 1 ? picks.slice(0, 2) : (picks[0] || null)
    }

    return scored[pickIndex(scored.length - 1)]?.opt || null
  }

  const buildAnswers = (questionList, seedAnswers = {}) => {
    const out = { ...(seedAnswers || {}) }
    for (const q of questionList || []) {
      if (!q?.id) continue
      if (out[q.id] !== undefined) continue
      if (partialAnswerRate > 0 && rand() < partialAnswerRate) continue
      const picked = pickForQuestion(q)
      if (!picked) continue
      out[q.id] = picked
    }
    return out
  }

  const simulateOnce = (includeDebug) => {
    const base = core.buildInitialQuestions()
    const baseAnswers = buildAnswers(base)
    const baseComputed = core.computeScores(baseAnswers, base, core.dimensionWeights, { includeDebug: false })
    const topCluster = baseComputed?.insights?.clusters?.[0]?.key
    const follow = topCluster ? (core.followUpsByCluster[topCluster] || []) : []
    const followSlice = Array.isArray(follow) ? follow.slice(0, 10) : []

    const fullQuestions = followSlice.length > 0 ? [...base, ...followSlice] : base
    const fullAnswers = buildAnswers(fullQuestions, baseAnswers)
    return core.computeScores(fullAnswers, fullQuestions, core.dimensionWeights, { includeDebug })
  }

  // One debug run to get dimension drivers for stable winner
  const debugComputed = simulateOnce(true)
  const ranking = debugComputed?.provisionalResults ?? debugComputed?.results
  const topKey = Array.isArray(ranking) ? (ranking[0]?.career ?? null) : null

  const top3 = Array.isArray(ranking) ? ranking.slice(0, 3).map(x => x?.career).filter(Boolean) : []

  const relaxedOk = topKey ? preset.expectedProfiles.includes(topKey) : false
  const strictSet = Array.isArray(preset.strictExpectedTop) ? preset.strictExpectedTop : []
  const strictOk = topKey ? (strictSet.length ? strictSet.includes(topKey) : relaxedOk) : false
  const top3Ok = top3.some(k => preset.expectedProfiles.includes(k))

  const dimTotals = debugComputed?.insights?.debug?.profileDimensionTotals
  const topDims = (() => {
    if (!topKey || !dimTotals) return []
    return Object.entries(dimTotals)
      .map(([dim, perProfile]) => ({ dim, v: Number(perProfile?.[topKey] ?? 0) }))
      .sort((a, b) => b.v - a.v)
      .slice(0, 10)
      .filter(x => x.v > 0)
  })()

  const counts = {}
  const clusterCounts = {}

  for (let i = 0; i < runs; i += 1) {
    const r = simulateOnce(false)
    const rr = r?.provisionalResults ?? r?.results
    const winner = Array.isArray(rr) ? (rr[0]?.career ?? null) : null
    const winnerCluster = r?.insights?.clusters?.[0]?.key ?? null
    if (winner) counts[winner] = (counts[winner] || 0) + 1
    if (winnerCluster) clusterCounts[winnerCluster] = (clusterCounts[winnerCluster] || 0) + 1
  }

  const topDist = Object.entries(counts)
    .map(([k, v]) => ({ key: k, label: core.careerProfiles?.[k]?.name ?? k, pct: Math.round((v / runs) * 100) }))
    .sort((a, b) => b.pct - a.pct)
    .slice(0, 8)

  const clusterDist = Object.entries(clusterCounts)
    .map(([k, v]) => ({ key: k, pct: Math.round((v / runs) * 100) }))
    .sort((a, b) => b.pct - a.pct)
    .slice(0, 6)

  const stableTop = topDist[0] || null
  const match = stableTop?.key ? preset.expectedProfiles.includes(stableTop.key) : false
  const strictMatch = stableTop?.key ? (strictSet.length ? strictSet.includes(stableTop.key) : match) : false

  return {
    archetypeKey,
    archetypeLabel: preset.label,
    expectedProfiles: preset.expectedProfiles,
    strictExpectedTop: preset.strictExpectedTop,
    stableTop,
    match,
    strictMatch,
    top3,
    top3Ok,
    relaxedOk,
    strictOk,
    topDist,
    clusterDist,
    topDims,
    params: { runs, noiseProb, partialAnswerRate, seed },
    snapshot: {
      axes: debugComputed?.insights?.axes ?? null,
      dynamics: debugComputed?.insights?.dynamics ?? null,
      clusters: debugComputed?.insights?.clusters ?? [],
    }
  }
}

function summarize(reports) {
  const byStatus = { ok: [], review: [], strictOk: [], strictReview: [] }
  for (const r of reports) {
    const strength = Number(r?.stableTop?.pct ?? 0)
    const ok = Boolean(r?.match) && strength >= 45
    const strictOk = Boolean(r?.strictMatch) && strength >= 45
    ;(ok ? byStatus.ok : byStatus.review).push({
      archetype: r.archetypeLabel,
      top: r?.stableTop?.label ?? '—',
      topPct: strength,
      expected: (r?.expectedProfiles || []).join(', '),
    })
    ;(strictOk ? byStatus.strictOk : byStatus.strictReview).push({
      archetype: r.archetypeLabel,
      top: r?.stableTop?.label ?? '—',
      topPct: strength,
      expected: (r?.strictExpectedTop || r?.expectedProfiles || []).join(', '),
    })
  }
  return byStatus
}

function toMarkdown(batch, summary) {
  const lines = []
  lines.push(`# Vocational Test · Auto Analysis (Riguroso)`)
  lines.push('')
  lines.push(`Generated: ${batch.generatedAt}`)
  lines.push(`Version: ${batch.version}`)
  lines.push('')

  if (batch.coverage?.byProfile) {
    const topProfiles = Object.entries(batch.coverage.byProfile)
      .map(([k, v]) => ({ k, v: Number(v || 0) }))
      .sort((a, b) => b.v - a.v)
      .slice(0, 12)
    lines.push('## Cobertura de Tags (diagnóstico)')
    lines.push('')
    lines.push(`Total tags en banco: ${batch.coverage.totalTags}`)
    lines.push(`Tags mapeados a perfiles: ${batch.coverage.mappedTags}`)
    lines.push(`Perfiles con tags: ${Object.keys(batch.coverage.byProfile).length}`)
    lines.push(`Top perfiles por ocurrencias: ${topProfiles.map(x => `${x.k}=${x.v}`).join(' · ')}`)
    lines.push('')
  }

  lines.push('## Resumen')
  lines.push('')
  lines.push(`OK (match y estabilidad >= 45%): ${summary.ok.length}`)
  for (const x of summary.ok) {
    lines.push(`- ${x.archetype}: ${x.top} (${x.topPct}%)`) 
  }
  lines.push('')
  lines.push(`STRICT OK (top estrictamente esperado y estabilidad >= 45%): ${summary.strictOk.length}`)
  for (const x of summary.strictOk) {
    lines.push(`- ${x.archetype}: ${x.top} (${x.topPct}%)`) 
  }
  lines.push('')
  lines.push(`Revisar: ${summary.review.length}`)
  for (const x of summary.review) {
    lines.push(`- ${x.archetype}: ${x.top} (${x.topPct}%) · esperado: ${x.expected}`)
  }
  lines.push('')
  lines.push(`STRICT Revisar: ${summary.strictReview.length}`)
  for (const x of summary.strictReview) {
    lines.push(`- ${x.archetype}: ${x.top} (${x.topPct}%) · esperado: ${x.expected}`)
  }

  lines.push('')
  lines.push('## Detalle por arquetipo')
  lines.push('')
  for (const r of batch.items) {
    lines.push(`### ${r.archetypeLabel}`)
    lines.push('')
    lines.push(`- Top estable: ${r?.stableTop?.label ?? '—'} (${r?.stableTop?.pct ?? 0}%)`) 
    lines.push(`- ¿Coincide (relajado)?: ${r.match ? 'Sí' : 'No'} (esperado: ${(r.expectedProfiles || []).join(', ')})`)
    lines.push(`- ¿Coincide (estricto)?: ${r.strictMatch ? 'Sí' : 'No'} (esperado: ${(r.strictExpectedTop || r.expectedProfiles || []).join(', ')})`)
    if (Array.isArray(r.top3) && r.top3.length) {
      lines.push(`- Top-3 contiene esperado?: ${r.top3Ok ? 'Sí' : 'No'} (top3: ${(r.top3 || []).join(', ')})`)
    }
    lines.push(`- Distribución top (hasta 8): ${(r.topDist || []).map(x => `${x.label} ${x.pct}%`).join(' · ')}`)
    lines.push(`- Clúster dominante (hasta 6): ${(r.clusterDist || []).map(x => `${x.key} ${x.pct}%`).join(' · ')}`)
    if (Array.isArray(r.topDims) && r.topDims.length) {
      lines.push(`- Dimensiones que más empujan al top: ${(r.topDims || []).slice(0, 8).map(d => `${d.dim}≈${Math.round(d.v)}`).join(' · ')}`)
    }
    lines.push(`- Parámetros: runs=${r?.params?.runs} · noise=${r?.params?.noiseProb} · partial=${r?.params?.partialAnswerRate}`)
    lines.push('')
  }

  return lines.join('\n')
}

function main() {
  const source = fs.readFileSync(PAGE, 'utf8')
  const core = extractCoreFromPage(source)

  const computeCoverage = () => {
    const byProfile = {}
    const byTag = {}
    let totalTags = 0
    let mappedTags = 0

    const addQuestionList = (qs) => {
      for (const q of qs || []) {
        const opts = Array.isArray(q?.options) ? q.options : []
        for (const opt of opts) {
          const tags = Array.isArray(opt?.careers) ? opt.careers : []
          for (const raw of tags) {
            totalTags += 1
            const t = core.normalizeTag(raw)
            if (t) byTag[t] = (byTag[t] || 0) + 1
            const pk = core.tagToProfileKey(raw)
            if (pk) {
              mappedTags += 1
              byProfile[pk] = (byProfile[pk] || 0) + 1
            }
          }
        }
      }
    }

    const base = core.buildInitialQuestions()
    addQuestionList(base)
    for (const list of Object.values(core.followUpsByCluster || {})) {
      addQuestionList(Array.isArray(list) ? list : [])
    }

    return { totalTags, mappedTags, byProfile, byTag }
  }

  const archetypes = getArchetypes()
  const keys = Object.keys(archetypes)

  // Scenario grid: more rigorous than a single run.
  const seeds = ['copilot-run-A', 'copilot-run-B']
  const noiseLevels = [0.05, 0.15, 0.3]
  const partialRates = [0, 0.2]

  const items = []
  for (const key of keys) {
    for (const seed of seeds) {
      for (const noiseProb of noiseLevels) {
        for (const partialAnswerRate of partialRates) {
          items.push(runSimulationForArchetype(core, key, { runs: 260, noiseProb, partialAnswerRate, seed }))
        }
      }
    }
  }

  const batch = { version: 'v2', generatedAt: new Date().toISOString(), coverage: computeCoverage(), items }
  const summary = summarize(items)

  const outDir = path.join(ROOT, 'tools', 'reports')
  fs.mkdirSync(outDir, { recursive: true })

  const jsonPath = path.join(outDir, 'vt-analysis-report.json')
  fs.writeFileSync(jsonPath, JSON.stringify({ ...batch, summary }, null, 2), 'utf8')

  const mdPath = path.join(outDir, 'vt-analysis-report.md')
  fs.writeFileSync(mdPath, toMarkdown(batch, summary), 'utf8')

  // Print a minimal console summary
  console.log('Report written:')
  console.log(' -', jsonPath)
  console.log(' -', mdPath)
  console.log('Summary:')
  console.log(' - OK:', summary.ok.length)
  console.log(' - Review:', summary.review.length)
  console.log(' - STRICT OK:', summary.strictOk.length)
  console.log(' - STRICT Review:', summary.strictReview.length)
  for (const r of summary.review) {
    console.log(`   * ${r.archetype}: ${r.top} (${r.topPct}%)`) 
  }
  for (const r of summary.strictReview.slice(0, 12)) {
    console.log(`   ! STRICT ${r.archetype}: ${r.top} (${r.topPct}%)`) 
  }
}

main()
