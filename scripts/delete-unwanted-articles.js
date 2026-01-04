import 'dotenv/config'
import { createClient } from '@supabase/supabase-js'

const required = [
  'VITE_SUPABASE_URL',
  'VITE_SUPABASE_ANON_KEY',
  'SUPABASE_ADMIN_EMAIL',
  'SUPABASE_ADMIN_PASSWORD'
]

const missing = required.filter((k) => !process.env[k])
if (missing.length) {
  console.error('❌ Faltan variables en .env:', missing.join(', '))
  process.exit(1)
}

const argv = process.argv.slice(2)
const yes = argv.includes('--yes')
const dryRun = argv.includes('--dry-run') || !yes

const extraSlugIndex = argv.findIndex((a) => a === '--slug')
const extraSlugs = []
if (extraSlugIndex >= 0) {
  const raw = argv[extraSlugIndex + 1]
  if (raw) {
    raw
      .split(',')
      .map((s) => s.trim())
      .filter(Boolean)
      .forEach((s) => extraSlugs.push(s))
  }
}

const slugsToDelete = Array.from(
  new Set(
    [
      // Design/branding legacy posts (ES/EN)
      'rebranding-vs-refresh-cuando-redisenar-marca-completa',
      'branding-con-inteligencia-artificial-2025-guia-completa',
      // Extra from CLI
      ...extraSlugs
    ].filter(Boolean)
  )
)

const supabase = createClient(process.env.VITE_SUPABASE_URL, process.env.VITE_SUPABASE_ANON_KEY)

async function adminLogin() {
  const { data, error } = await supabase.auth.signInWithPassword({
    email: process.env.SUPABASE_ADMIN_EMAIL,
    password: process.env.SUPABASE_ADMIN_PASSWORD
  })

  if (error || !data?.session) {
    throw new Error(error?.message || 'No se pudo iniciar sesión (sin sesión)')
  }
}

function looksLikeTestArticle(row) {
  const hay = `${row.title || ''} ${row.slug || ''}`.toLowerCase()
  return (
    hay.includes('articulo de prueba') ||
    hay.includes('artículo de prueba') ||
    hay.includes('test article') ||
    hay.includes('prueba') && hay.includes('articulo')
  )
}

async function fetchCandidates() {
  const { data, error } = await supabase
    .from('blog_articles')
    .select('id, title, slug, language, category, is_published, published_at, created_at')
    .order('created_at', { ascending: false })

  if (error) throw new Error(error.message)

  const rows = data || []
  const candidates = rows.filter((row) => {
    if (slugsToDelete.includes(row.slug)) return true
    if (looksLikeTestArticle(row)) return true
    return false
  })

  return candidates
}

async function deleteByIds(ids) {
  // Delete in chunks to avoid URL limits
  const chunkSize = 50
  let deletedCount = 0

  for (let i = 0; i < ids.length; i += chunkSize) {
    const chunk = ids.slice(i, i + chunkSize)
    const { error } = await supabase
      .from('blog_articles')
      .delete()
      .in('id', chunk)

    if (error) throw new Error(error.message)
    deletedCount += chunk.length
  }

  return deletedCount
}

async function main() {
  console.log('🔐 Login admin...')
  await adminLogin()
  console.log('✅ Login admin OK')

  console.log('🔎 Buscando candidatos a borrar...')
  const candidates = await fetchCandidates()

  if (!candidates.length) {
    console.log('✅ No encontré artículos que coincidan (slugs / pruebas).')
    return
  }

  console.log(`📋 Encontré ${candidates.length} artículo(s):`)
  console.log(
    JSON.stringify(
      candidates.map((r) => ({
        id: r.id,
        slug: r.slug,
        language: r.language,
        title: r.title,
        category: r.category,
        is_published: r.is_published,
        published_at: r.published_at,
        created_at: r.created_at
      })),
      null,
      2
    )
  )

  if (dryRun) {
    console.log('🧪 DRY RUN: no se borró nada.')
    console.log('   Para borrar de verdad ejecuta: node scripts/delete-unwanted-articles.js --yes')
    return
  }

  const ids = candidates.map((c) => c.id)
  console.log(`🗑️ Borrando ${ids.length} artículo(s)...`) 
  const deleted = await deleteByIds(ids)
  console.log(`✅ Borrados: ${deleted}`)
}

main().catch((err) => {
  console.error('❌ Error:', err.message || err)
  process.exit(1)
})
