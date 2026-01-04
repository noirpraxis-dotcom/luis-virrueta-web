import { createClient } from '@supabase/supabase-js'
import dotenv from 'dotenv'

dotenv.config()

const supabase = createClient(
  process.env.VITE_SUPABASE_URL,
  process.env.VITE_SUPABASE_ANON_KEY
)

async function checkArticles() {
  const { data, error } = await supabase
    .from('blog_articles')
    .select('id, title, slug, language, image_url, rating')
    .eq('language', 'es')
    .order('created_at', { ascending: false })

  if (error) {
    console.error('Error:', error)
    return
  }

  console.log('📊 Artículos en Supabase (ES):')
  console.log(JSON.stringify(data, null, 2))
}

checkArticles()
