import 'dotenv/config'
import { createClient } from '@supabase/supabase-js'
import sharp from 'sharp'
import fs from 'node:fs'
import path from 'node:path'

const required = ['VITE_SUPABASE_URL', 'VITE_SUPABASE_ANON_KEY', 'SUPABASE_ADMIN_EMAIL', 'SUPABASE_ADMIN_PASSWORD']
const missing = required.filter((k) => !process.env[k])
if (missing.length) {
  console.error('❌ Faltan variables en .env:', missing.join(', '))
  process.exit(1)
}

const supabase = createClient(process.env.VITE_SUPABASE_URL, process.env.VITE_SUPABASE_ANON_KEY)

const TITLE = 'Lo que nadie está diciendo sobre la caída de Maduro: trauma colectivo, poder y mente humana'
const SUBTITLE = '(Psicoanálisis, filosofía y psicología del poder en la caída de un líder que sostuvo un orden simbólico entero)'

const ARTICLE = {
  language: 'es',
  category: 'psychoanalysis',
  author: 'Luis Virrueta',
  tags: ['Psicoanálisis', 'Filosofía', 'Psicología', 'Poder', 'Trauma colectivo', 'Venezuela'],
  title: TITLE,
  subtitle: SUBTITLE,
  excerpt:
    'La captura de Nicolás Maduro no es solo un acontecimiento político: es la caída de una estructura simbólica que sostenía el orden imaginario de un país, y con ella emerge el vacío y la desorientación del sujeto colectivo.'
}

const BLOCKS = [
  { type: 'heading', level: 'h1', content: TITLE },
  { type: 'paragraph', content: SUBTITLE },

  { type: 'heading', level: 'h2', content: 'I. El derrumbe del tótem: cuando el poder encarna una figura paterna' },
  { type: 'paragraph', content: 'La captura de Nicolás Maduro no es solo un acontecimiento político. Es la caída de una estructura simbólica que sostuvo, por años, el orden imaginario de un país. En términos psicoanalíticos, la figura del líder autoritario funciona como un tótem, una condensación de poder, ley, deseo y prohibición.' },
  { type: 'paragraph', content: 'Freud lo explica con brutal crudeza en Tótem y Tabú: el líder no solo gobierna instituciones, gobierna fantasmas, y cuando cae, no cae un hombre… cae un orden interno.' },
  { type: 'paragraph', content: 'Maduro no representaba solamente un gobierno; representaba para muchos la continuidad del “Padre del Estado”. Para otros, era el objeto de odio necesario para sostener identidad y resistencia.' },
  { type: 'paragraph', content: 'Lacan diría que ambos bandos estaban atravesados por el mismo mecanismo: el líder organiza el deseo. Al desaparecer, la sociedad queda expuesta a algo mucho peor que la opresión: queda expuesta al vacío.' },
  { type: 'paragraph', content: 'Vladimir Safatle sostiene que los regímenes autoritarios prosperan porque “administran angustia”. Cuando ese administrador cae, la angustia retorna en forma de desorientación. El sujeto colectivo queda suspendido entre dos experiencias psíquicas opuestas: alivio… y vértigo.' },
  { type: 'paragraph', content: 'Porque cuando el padre cae, lo prohibido queda sin estructura, lo permitido queda huérfano. Y eso no libera inmediatamente: desarma.' },
  { type: 'heading', level: 'h3', content: 'Preguntas psicoanalíticas incómodas' },
  { type: 'list', content: '¿Qué parte de ti necesitaba que Maduro fuera “el villano” o “el salvador” para poder sostener tu narrativa interna?' },
  { type: 'list', content: 'Si el líder se derrumba, ¿qué se derrumba también dentro de ti?' },
  { type: 'list', content: '¿Qué miedo aparece cuando ya no hay alguien “a quien culpar”?' },

  { type: 'heading', level: 'h2', content: 'II. Cuando el símbolo colapsa: el trauma no siempre es lo que duele… es lo que desorganiza' },
  { type: 'paragraph', content: 'Hannah Arendt decía que el poder no se rompe solo cuando se derrota… se rompe cuando deja de tener sentido. Y eso es lo que produce verdadero trauma colectivo: no el dolor, sino la desorganización del sentido.' },
  { type: 'paragraph', content: 'En psicología del trauma, Judith Herman explica que el trauma no surge únicamente del evento violento, sino del quiebre de las coordenadas de previsibilidad. Maduro era una coordenada, amada u odiada. Con su caída, ocurre una fractura traumática: el tiempo se descoloca, el futuro deja de tener textura, el presente se vuelve frágil.' },
  { type: 'paragraph', content: 'En términos lacanianos, el Nombre-del-Padre, es decir, la instancia simbólica que sostiene lo que “es” y “no es”, entra en crisis. Lo real, lo indomable, lo que no tiene nombre, emerge. Y con ello, la ansiedad.' },
  { type: 'paragraph', content: 'Foucault lo advertiría desde otro ángulo: donde el poder se desarma, el cuerpo social queda expuesto y busca urgentemente quién ocupará ese lugar. El vacío del poder no es un vacío… es un imán.' },
  { type: 'paragraph', content: 'Y ese imán duele. Porque el trauma no solo deja heridas: también deja preguntas imposibles.' },
  { type: 'heading', level: 'h3', content: 'Preguntas psicoanalíticas incómodas' },
  { type: 'list', content: '¿Qué estructura interna sostienes gracias a la existencia de un enemigo externo?' },
  { type: 'list', content: '¿Qué es más difícil de soportar: la opresión… o el vacío de no saber quién eres sin ella?' },
  { type: 'list', content: '¿Estamos preparados para la libertad o solamente para cambiar de amo?' },

  { type: 'heading', level: 'h2', content: 'III. El inconsciente político: el goce que no queremos aceptar' },
  { type: 'paragraph', content: 'Slavoj Žižek lo ha repetido hasta el cansancio: no odiamos solamente al tirano… disfrutamos inconscientemente del sistema que odiamos. Hay goce en el resentimiento. Hay placer en la indignación. Hay identidad en el sufrimiento.' },
  { type: 'paragraph', content: 'La caída de Maduro expone esa verdad obscena: miles celebran, otros tiemblan, pero muchos quedan desorientados porque su sujeto político se sostenía en la fricción con él. Lacan diría que el deseo necesita obstáculo. Cuando el obstáculo cae, el deseo se desnuda… y eso aterra.' },
  { type: 'paragraph', content: 'Byung-Chul Han añadiría que las sociedades actuales no toleran el vacío. Prefieren el malestar organizado antes que el desconcierto: preferimos el dolor conocido que la incertidumbre expansiva.' },
  { type: 'paragraph', content: 'Tal vez el problema no era solo el líder. Tal vez el problema era que habíamos aprendido a vivir psíquicamente alrededor de él.' },
  { type: 'heading', level: 'h3', content: 'Preguntas psicoanalíticas incómodas' },
  { type: 'list', content: '¿Qué parte de ti disfrutaba —en silencio— de la narrativa del dolor político?' },
  { type: 'list', content: 'Si la herida desaparece, ¿quién eres sin ella?' },
  { type: 'list', content: '¿Nos interesa realmente la justicia… o queremos mantener la identidad que produce el conflicto?' },

  { type: 'heading', level: 'h2', content: 'IV. ¿Quién será el padre ahora? — La ansiedad del reemplazo' },
  { type: 'paragraph', content: 'Tras la captura surge la gran pregunta política… pero también psicológica: ¿quién ocupa el lugar del poder?' },
  { type: 'paragraph', content: 'No es solo un debate de nombres. Es una pregunta estructural: el sujeto colectivo necesita un Otro que ordene.' },
  { type: 'paragraph', content: 'La filosofía de Nietzsche aparece aquí inevitable: cuando Dios muere, no nos libera… nos deja desamparados. Cuando el líder cae, no solo abre posibilidad… abre abismo.' },
  { type: 'paragraph', content: 'Y el abismo exige madurez subjetiva. Una madurez que pocas sociedades poseen.' },
  { type: 'heading', level: 'h3', content: 'Preguntas psicoanalíticas incómodas' },
  { type: 'list', content: '¿Estamos buscando un nuevo líder… o un nuevo sustituto del padre?' },
  { type: 'list', content: '¿Queremos democracia… o queremos un amo “justo”?' },
  { type: 'list', content: '¿Qué pasaría si por primera vez nadie viniera a salvarnos?' },

  { type: 'heading', level: 'h2', content: 'Conclusión' },
  { type: 'paragraph', content: 'La caída de Maduro es una fractura política, sí. Pero sobre todo es una fractura psíquica.' },
  { type: 'paragraph', content: 'Expone la relación entre poder y mente humana. Desnuda nuestra dependencia simbólica. Y revela que el verdadero reto no es derribar al líder…' },
  { type: 'paragraph', content: 'El verdadero reto es sostener la mirada frente a nuestra propia responsabilidad subjetiva sin esconderla detrás de una figura de poder.' },
  { type: 'paragraph', content: 'Tal vez la pregunta no es: “¿Quién gobernará Venezuela ahora?” Tal vez la pregunta real es: “¿Qué hará cada sujeto con el vacío que deja la caída de su tótem?” Y esa… esa es la única pregunta que verdaderamente duele.' }
]

function slugify(input) {
  return input
    .toLowerCase()
    .normalize('NFD')
    .replace(/\p{Diacritic}/gu, '')
    .replace(/[^a-z0-9\s-]/g, '')
    .trim()
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
}

function computeReadTime(blocks) {
  const text = blocks.map((b) => b.content || '').join(' ')
  const words = text.trim().split(/\s+/).filter(Boolean).length
  const minutes = Math.max(1, Math.ceil(words / 225))
  return `${minutes} min`
}

async function compressToTargetWebp(inputPath, targetKB = 100) {
  const raw = fs.readFileSync(inputPath)
  const img = sharp(raw)
  const meta = await img.metadata()

  const maxWidth = 1200
  const resized = meta.width && meta.width > maxWidth ? img.resize({ width: maxWidth }) : img

  let quality = 80
  let out = await resized.webp({ quality }).toBuffer()

  while (out.length / 1024 > targetKB && quality > 30) {
    quality -= 8
    out = await resized.webp({ quality }).toBuffer()
  }

  return { buffer: out, quality, sizeKB: Math.round(out.length / 1024) }
}

function findDefaultImagePath() {
  const candidates = [
    path.join(process.cwd(), 'public', 'IMAGENES BLOG', 'ImágenesBlock'),
    path.join(process.cwd(), 'public', 'IMAGENES BLOG', 'ImagenesBlock'),
    path.join(process.cwd(), 'public', 'IMAGENES BLOG')
  ]

  for (const dir of candidates) {
    if (!fs.existsSync(dir)) continue
    const files = fs.readdirSync(dir)
    const hit = files.find((f) => /maduro/i.test(f))
    if (hit) return path.join(dir, hit)
  }

  return null
}

async function main() {
  const argv = process.argv.slice(2)
  const imageArgIndex = argv.findIndex((a) => a === '--image')
  const imagePath = imageArgIndex >= 0 ? argv[imageArgIndex + 1] : findDefaultImagePath()

  if (!imagePath || !fs.existsSync(imagePath)) {
    console.error('❌ No encuentro la imagen.')
    console.error('   Opción A: coloca un archivo que contenga "maduro" en public/IMAGENES BLOG/ (o subcarpeta ImágenesBlock)')
    console.error('   Opción B: ejecuta con: node scripts/publish-maduro-article.js --image "C:\\ruta\\a\\tu\\imagen.jpg"')
    process.exit(1)
  }

  // Login admin
  const { data: authData, error: authError } = await supabase.auth.signInWithPassword({
    email: process.env.SUPABASE_ADMIN_EMAIL,
    password: process.env.SUPABASE_ADMIN_PASSWORD
  })

  if (authError || !authData?.session) {
    console.error('❌ No se pudo iniciar sesión admin:', authError?.message || 'sin sesión')
    process.exit(1)
  }

  console.log('✅ Login admin OK')

  // Compress
  console.log('🖼️ Comprimiendo imagen...')
  const compressed = await compressToTargetWebp(imagePath, 100)
  console.log(`✅ Imagen comprimida ~${compressed.sizeKB}KB (quality=${compressed.quality})`) 

  // Upload
  console.log('☁️ Subiendo imagen a Supabase Storage...')
  const fileName = `blog-${Date.now()}-maduro.webp`
  const blob = new Blob([compressed.buffer], { type: 'image/webp' })

  const { error: uploadError } = await supabase.storage
    .from('blog-images')
    .upload(fileName, blob, { contentType: 'image/webp', upsert: false })

  if (uploadError) {
    console.error('❌ Error subiendo imagen:', uploadError.message)
    process.exit(1)
  }

  const { data: publicData } = supabase.storage.from('blog-images').getPublicUrl(fileName)
  const imageUrl = publicData?.publicUrl
  if (!imageUrl) {
    console.error('❌ No se pudo obtener URL pública de la imagen')
    process.exit(1)
  }

  console.log('✅ Imagen subida:', imageUrl)

  // Build article
  const slug = slugify(TITLE)
  const nowIso = new Date().toISOString()
  const readTime = computeReadTime(BLOCKS)

  const row = {
    slug,
    title: ARTICLE.title,
    subtitle: ARTICLE.subtitle,
    excerpt: ARTICLE.excerpt,
    content: BLOCKS.map((b, idx) => ({ id: `block-${Date.now()}-${idx}`, ...b })),
    author: ARTICLE.author,
    category: ARTICLE.category,
    tags: ARTICLE.tags,
    read_time: readTime,
    language: ARTICLE.language,
    image_url: imageUrl,
    is_published: true,
    published_at: nowIso,
    created_at: nowIso,
    updated_at: nowIso
  }

  console.log('📝 Insertando artículo en Supabase...')
  const { data, error } = await supabase
    .from('blog_articles')
    .upsert([row], { onConflict: 'slug,language' })
    .select('id, slug, language')
    .single()

  if (error) {
    console.error('❌ Error insertando:', error.message)
    process.exit(1)
  }

  console.log('✅ Artículo publicado:', `${data.slug} (${data.language})`) 
  console.log('➡️ Abre: /blog/' + slug)
}

await main()
