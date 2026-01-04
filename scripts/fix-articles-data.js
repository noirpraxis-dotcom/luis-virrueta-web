import { createClient } from '@supabase/supabase-js'
import dotenv from 'dotenv'

dotenv.config()

const supabase = createClient(
  process.env.VITE_SUPABASE_URL,
  process.env.VITE_SUPABASE_ANON_KEY
)

// Mapeo correcto: slug → { image, rating }
const articleData = {
  'sudoku': {
    image: 'SUDOKU HUMANO.webp',
    rating: 5.0
  },
  'puta-panico-usurpacion-terror-autonomia': {
    image: 'puta.webp',
    rating: 4.9
  },
  'el-juego-que-nadie-confiesa-estar-jugando': {
    image: 'ajedrez.webp',
    rating: 4.8
  },
  'la-ruptura-de-la-ruptura': {
    image: 'ruptura.webp',
    rating: 4.9
  },
  'no-duele-porque-algo-se-rompe': {
    image: 'no duele.webp',
    rating: 4.7
  },
  'donde-esta-el-cuerpo-cuando-todo-funciona': {
    image: 'gas.webp',
    rating: 4.8
  },
  'el-desgarro-de-la-unidad': {
    image: 'desgarro.webp',
    rating: 4.9
  },
  'el-pez-que-no-se-come': {
    image: 'gaviota.webp',
    rating: 4.7
  },
  'amar-desde-la-herida': {
    image: 'herida.webp',
    rating: 4.9
  },
  'ser-libre-no-es-elegir-es-no-poder-dejar-de-repetir': {
    image: 'ser libres.webp',
    rating: 4.8
  },
  'antes-era-feliz-el-punto-cero': {
    image: 'ANTES ERA 0.webp',
    rating: 4.9
  },
  'del-perro-que-me-ama-al-vacio-que-me-habita': {
    image: 'PERRO.webp',
    rating: 4.7
  },
  'trend-vs-keyword-gap-contenido-viral-no-construye-crecimiento': {
    image: '12 arquitipos.webp',
    rating: 4.8
  }
}

async function fixArticles() {
  console.log('🔧 Arreglando image_url y ratings en Supabase...\n')

  let fixed = 0
  let errors = 0

  for (const [slug, data] of Object.entries(articleData)) {
    try {
      const imageUrl = `https://fnfsozymwmqzjiwcrwib.supabase.co/storage/v1/object/public/blog-images/${data.image}`

      // Actualizar ambos idiomas
      for (const lang of ['es', 'en']) {
        const { data: article, error: fetchError } = await supabase
          .from('blog_articles')
          .select('id, title')
          .eq('slug', slug)
          .eq('language', lang)
          .maybeSingle()

        if (fetchError) {
          console.error(`❌ Error buscando ${slug} (${lang}):`, fetchError.message)
          errors++
          continue
        }

        if (!article) {
          console.log(`⏭️  No existe: ${slug} (${lang})`)
          continue
        }

        const { error: updateError } = await supabase
          .from('blog_articles')
          .update({
            image_url: imageUrl,
            rating: data.rating
          })
          .eq('id', article.id)

        if (updateError) {
          console.error(`❌ Error actualizando ${slug} (${lang}):`, updateError.message)
          errors++
          continue
        }

        console.log(`✅ Actualizado: ${article.title} (${lang}) → ${data.image}, rating: ${data.rating}`)
        fixed++
      }

    } catch (error) {
      console.error(`❌ Error con ${slug}:`, error.message)
      errors++
    }
  }

  console.log(`\n📊 Resultado:`)
  console.log(`   ✅ Actualizados: ${fixed}`)
  console.log(`   ❌ Errores: ${errors}`)
}

fixArticles()
