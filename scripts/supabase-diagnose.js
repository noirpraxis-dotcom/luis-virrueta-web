import 'dotenv/config'
import { createClient } from '@supabase/supabase-js'

const required = ['VITE_SUPABASE_URL', 'VITE_SUPABASE_ANON_KEY']
const missing = required.filter((k) => !process.env[k])

if (missing.length) {
  console.error('❌ Faltan variables en .env:', missing.join(', '))
  process.exit(1)
}

const supabaseUrl = process.env.VITE_SUPABASE_URL
const supabaseAnonKey = process.env.VITE_SUPABASE_ANON_KEY

const adminEmail = process.env.SUPABASE_ADMIN_EMAIL
const adminPassword = process.env.SUPABASE_ADMIN_PASSWORD

const supabase = createClient(supabaseUrl, supabaseAnonKey)

const safe = (v) => (v == null ? '' : String(v))

function formatError(e) {
  const parts = []
  if (e?.name) parts.push(`${safe(e.name)}`)
  if (e?.message) parts.push(`${safe(e.message)}`)

  const cause = e?.cause
  if (cause) {
    const causeParts = []
    if (cause?.code) causeParts.push(`code=${safe(cause.code)}`)
    if (cause?.errno) causeParts.push(`errno=${safe(cause.errno)}`)
    if (cause?.syscall) causeParts.push(`syscall=${safe(cause.syscall)}`)
    if (cause?.hostname) causeParts.push(`hostname=${safe(cause.hostname)}`)
    if (cause?.message) causeParts.push(`message=${safe(cause.message)}`)
    if (causeParts.length) parts.push(`cause(${causeParts.join(', ')})`)
  }

  return parts.join(' | ') || 'error desconocido'
}

async function headCount(client, onlyPublished = false) {
  let q = client.from('blog_articles').select('id', { count: 'exact', head: true })
  if (onlyPublished) q = q.eq('is_published', true)
  const { count, error } = await q
  if (error) throw error
  return count ?? 0
}

async function fetchSome(client, limit = 10) {
  const { data, error } = await client
    .from('blog_articles')
    .select('id, slug, language, title, is_published, published_at, created_at')
    .order('published_at', { ascending: false, nullsFirst: false })
    .order('created_at', { ascending: false })
    .limit(limit)

  if (error) throw error
  return data || []
}

async function findDuplicates(client) {
  const { data, error } = await client
    .from('blog_articles')
    .select('slug, language')
    .limit(5000)

  if (error) throw error

  const map = new Map()
  for (const row of data || []) {
    const key = `${row.slug}:${row.language}`
    map.set(key, (map.get(key) || 0) + 1)
  }

  const dups = Array.from(map.entries())
    .filter(([, n]) => n > 1)
    .sort((a, b) => b[1] - a[1])

  return dups
}

async function main() {
  console.log('🔎 Diagnóstico Supabase (sin mostrar secretos)')

  // 1) Probar lectura anónima (RLS pública)
  try {
    const published = await headCount(supabase, true)
    console.log(`✅ Lectura pública OK. Artículos publicados visibles: ${published}`)
  } catch (e) {
    console.error('❌ Falló lectura pública. Revisa RLS/tabla/red:', formatError(e))
    process.exit(1)
  }

  // 2) Probar login admin (si hay creds)
  if (!adminEmail || !adminPassword) {
    console.log('⚠️ No hay SUPABASE_ADMIN_EMAIL/PASSWORD en .env; no puedo verificar modo admin.')
    console.log('   (No pegues credenciales aquí; ponlas en .env)')
    return
  }

  const { data: authData, error: authError } = await supabase.auth.signInWithPassword({
    email: adminEmail,
    password: adminPassword
  })

  if (authError || !authData?.session) {
    console.error('❌ Login admin falló:', safe(authError?.message || 'sin sesión'))
    console.error('   Asegúrate de haber creado el usuario en Supabase Auth (email/password).')
    process.exit(1)
  }

  console.log('✅ Login admin OK.')

  // 3) Leer todo (si existe policy admin select)
  try {
    const total = await headCount(supabase, false)
    console.log(`✅ Lectura admin OK. Total filas visibles (según RLS): ${total}`)

    const sample = await fetchSome(supabase, 10)
    console.log('📌 Muestra (máx 10):')
    for (const r of sample) {
      console.log(
        `- ${safe(r.language)} / ${safe(r.slug)} | published=${safe(r.is_published)} | ${safe(r.title)}`
      )
    }

    const dups = await findDuplicates(supabase)
    if (dups.length) {
      console.log('⚠️ Duplicados detectados por (slug, language):')
      dups.slice(0, 20).forEach(([k, n]) => console.log(`- ${k} x${n}`))
      console.log('   Si el índice UNIQUE (slug, language) no pudo crearse, tu SQL pudo haber fallado.')
    } else {
      console.log('✅ No se detectaron duplicados (slug, language) en lo visible por RLS.')
    }
  } catch (e) {
    console.error('❌ Falló lectura admin:', formatError(e))
    console.error('   Probable causa: falta la policy SELECT para authenticated.')
    console.error('   Solución: ejecuta el bloque "Admin puede leer todo" en supabase-schema.sql.')
    process.exit(1)
  }
}

await main()
