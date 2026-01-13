import 'dotenv/config'
import { createClient } from '@supabase/supabase-js'

const sb = createClient(process.env.VITE_SUPABASE_URL, process.env.VITE_SUPABASE_ANON_KEY)

const { data, error } = await sb
  .from('blog_articles')
  .select('slug, title, content')
  .eq('slug', 'el-consuelo-del-castigo')
  .maybeSingle()

if (error) {
  console.error('Error:', error)
  process.exit(1)
}

if (!data) {
  console.log('❌ Artículo no encontrado')
  process.exit(0)
}

console.log('📄 Artículo:', data.title)
console.log('Bloques:', data.content?.length || 0)
console.log('')

const blocks = data.content || []
blocks.slice(0, 12).forEach((b, i) => {
  const raw = String(b?.content || '')
  const hasNbsp = raw.includes('\u00A0')
  const hasZw = /[\u200B\u200C\u200D\uFEFF]/.test(raw)
  const preview = raw.slice(0, 70).replace(/\n/g, ' ')
  
  if (hasNbsp || hasZw) {
    console.log(`⚠️  Block ${i} [${b?.type}]: NBSP=${hasNbsp}, ZW=${hasZw}`)
    console.log(`    "${preview}"`)
  } else {
    console.log(`✅ Block ${i} [${b?.type}]: clean`)
  }
})
