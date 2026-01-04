/**
 * Script de Migración de Blogs Existentes a Supabase
 * 
 * Este script toma los blogs del archivo blogArticlesContent.js
 * y los migra a la base de datos de Supabase
 * 
 * IMPORTANTE: 
 * - Ejecutar DESPUÉS de configurar Supabase
 * - Ejecutar UNA SOLA VEZ
 * - Hacer backup antes de ejecutar
 * 
 * USO:
 * node migrate-blogs-to-supabase.js
 */

import { createClient } from '@supabase/supabase-js'

// ============================================
// CONFIGURACIÓN
// ============================================

// Cargar variables de entorno
import dotenv from 'dotenv'
dotenv.config()

const isHelp = process.argv.includes('--help') || process.argv.includes('-h')
const isDryRun = process.argv.includes('--dry-run')

const supabaseUrl = process.env.VITE_SUPABASE_URL
const supabaseAnonKey = process.env.VITE_SUPABASE_ANON_KEY

// Para pasar RLS (escritura solo autenticado)
const adminEmail = process.env.SUPABASE_ADMIN_EMAIL
const adminPassword = process.env.SUPABASE_ADMIN_PASSWORD

let supabase = null

// ============================================
// DATOS DE BLOGS EXISTENTES (AUTOMÁTICO)
// ============================================

let existingBlogs = []

function loadBlogArticlesContent() {
  throw new Error('loadBlogArticlesContent() ahora es async; usa loadBlogArticlesContentAsync()')
}

async function loadBlogArticlesContentAsync() {
  const moduleUrl = new URL('./src/data/blogArticlesContent.js', import.meta.url)
  const mod = await import(moduleUrl.href)
  if (!mod?.default) {
    throw new Error('No se pudo importar el export default desde src/data/blogArticlesContent.js')
  }
  return mod.default
}

function toBlocksFromSections(sections = []) {
  const blocks = []
  let i = 0

  const pushBlock = (block) => {
    blocks.push({ id: `block-${Date.now()}-${i++}`, ...block })
  }

  for (const section of sections) {
    if (!section) continue

    switch (section.type) {
      case 'heading':
        pushBlock({ type: 'heading', level: 'h2', content: section.title || '' })
        break
      case 'text':
      case 'intro':
      case 'conclusion':
        pushBlock({ type: 'paragraph', content: section.content || '' })
        break
      case 'highlight':
        pushBlock({ type: 'highlight', content: section.content || '' })
        break
      case 'questions':
        if (section.title) pushBlock({ type: 'heading', level: 'h3', content: section.title })
        for (const item of section.items || []) {
          pushBlock({ type: 'list', content: String(item || '') })
        }
        break
      case 'list':
        if (section.title) pushBlock({ type: 'heading', level: 'h3', content: section.title })
        for (const item of section.items || []) {
          const line = item?.title
            ? `${item.title}${item.description ? `: ${item.description}` : ''}`
            : String(item?.description || '')
          if (line.trim()) pushBlock({ type: 'list', content: line })
        }
        break
      default:
        if (section.title) pushBlock({ type: 'heading', level: 'h3', content: section.title })
        if (section.content) pushBlock({ type: 'paragraph', content: String(section.content) })
        break
    }
  }

  return blocks.filter(b => (b.content || '').trim())
}

function buildExcerptFromSections(sections = []) {
  const firstText = sections.find(s => s && (s.type === 'intro' || s.type === 'text') && s.content)
  const raw = firstText?.content || ''
  const cleaned = raw.replace(/\s+/g, ' ').trim()
  return cleaned.length > 180 ? `${cleaned.slice(0, 177)}...` : cleaned
}

function parsePublishedAt(dateString, language) {
  if (!dateString) return null

  // EN like: "Dec 15, 2025"
  if (language === 'en') {
    const d = new Date(dateString)
    return Number.isNaN(d.getTime()) ? null : d.toISOString()
  }

  // ES like: "20 Dic 2025"
  const months = {
    ene: 0, feb: 1, mar: 2, abr: 3, may: 4, jun: 5,
    jul: 6, ago: 7, sep: 8, oct: 9, nov: 10, dic: 11
  }

  const parts = dateString.replace(/\./g, '').trim().split(/\s+/)
  if (parts.length < 3) return null
  const day = Number(parts[0])
  const month = months[String(parts[1]).toLowerCase().slice(0, 3)]
  const year = Number(parts[2])
  if (!Number.isFinite(day) || !Number.isFinite(month) || !Number.isFinite(year)) return null

  const d = new Date(Date.UTC(year, month, day, 0, 0, 0))
  return Number.isNaN(d.getTime()) ? null : d.toISOString()
}

function toImageUrl(imageField) {
  if (!imageField) return null
  if (imageField.startsWith('/')) return imageField
  return `/IMAGENES BLOG/${imageField}`
}

function buildExistingBlogsFromContent(blogArticlesContent) {
  const blogs = []
  const languages = Object.keys(blogArticlesContent)
  for (const language of languages) {
    const bySlug = blogArticlesContent[language] || {}
    for (const slug of Object.keys(bySlug)) {
      const a = bySlug[slug]
      if (!a?.title || !a?.sections) continue

      blogs.push({
        slug,
        title: a.title,
        subtitle: a.subtitle || '',
        excerpt: a.excerpt || buildExcerptFromSections(a.sections),
        category: a.category || 'philosophy',
        author: a.author || 'Luis Virrueta',
        tags: a.tags || [],
        read_time: a.readTime || a.read_time || '15 min',
        language,
        image_url: toImageUrl(a.image || a.heroImage || a.image_url),
        published_at: parsePublishedAt(a.date, language),
        sections: a.sections
      })
    }
  }
  return blogs
}

// ============================================
// FUNCIÓN DE MIGRACIÓN
// ============================================

async function migrateBlog(blog) {
  try {
    console.log(`\n📝 Migrando: ${blog.title}`)

    // Convertir contenido a formato de bloques (compatible con el CMS)
    const content = toBlocksFromSections(blog.sections)

    // Preparar datos para inserción
    const articleData = {
      slug: blog.slug,
      title: blog.title,
      subtitle: blog.subtitle || '',
      excerpt: blog.excerpt,
      content: content,
      author: blog.author,
      category: blog.category,
      tags: blog.tags,
      read_time: blog.read_time,
      language: blog.language,
      image_url: blog.image_url,
      is_published: true,
      published_at: blog.published_at,
      created_at: blog.published_at || new Date().toISOString(),
      updated_at: new Date().toISOString()
    }

    // Verificar si ya existe
    const { data: existing } = await supabase
      .from('blog_articles')
      .select('id')
      .eq('slug', blog.slug)
      .eq('language', blog.language)
      .single()

    if (existing) {
      console.log(`⚠️  Ya existe: ${blog.slug} (${blog.language}) - Saltando...`)
      return { status: 'skipped', blog: `${blog.slug}:${blog.language}` }
    }

    // Insertar en Supabase
    const { data, error } = await supabase
      .from('blog_articles')
      .insert([articleData])
      .select()

    if (error) {
      console.error(`❌ Error en ${blog.slug}:`, error.message)
      return { status: 'error', blog: blog.slug, error: error.message }
    }

    console.log(`✅ Migrado exitosamente: ${blog.slug}`)
    return { status: 'success', blog: `${blog.slug}:${blog.language}` }

  } catch (error) {
    console.error(`❌ Error procesando ${blog.slug}:`, error.message)
    return { status: 'error', blog: blog.slug, error: error.message }
  }
}

// ============================================
// EJECUTAR MIGRACIÓN
// ============================================

async function runMigration() {
  console.log('🚀 Iniciando migración de blogs...\n')

  console.log('🔐 Iniciando sesión en Supabase Auth...')
  const { data: authData, error: authError } = await supabase.auth.signInWithPassword({
    email: adminEmail,
    password: adminPassword
  })
  if (authError || !authData?.session) {
    console.error('❌ No se pudo iniciar sesión:', authError?.message || 'sin sesión')
    process.exit(1)
  }
  console.log('✅ Sesión iniciada.\n')

  console.log('📦 Cargando contenido existente desde src/data/blogArticlesContent.js...')
  const blogArticlesContent = await loadBlogArticlesContentAsync()
  existingBlogs = buildExistingBlogsFromContent(blogArticlesContent)
  console.log(`✅ Contenido cargado.\n`)

  console.log(`📊 Total de blogs a migrar: ${existingBlogs.length}\n`)

  const results = {
    success: [],
    skipped: [],
    errors: []
  }

  for (const blog of existingBlogs) {
    const result = await migrateBlog(blog)
    
    switch (result.status) {
      case 'success':
        results.success.push(result.blog)
        break
      case 'skipped':
        results.skipped.push(result.blog)
        break
      case 'error':
        results.errors.push({ blog: result.blog, error: result.error })
        break
    }

    // Pequeña pausa para no saturar la API
    await new Promise(resolve => setTimeout(resolve, 100))
  }

  // Mostrar resumen
  console.log('\n' + '='.repeat(50))
  console.log('📊 RESUMEN DE MIGRACIÓN')
  console.log('='.repeat(50))
  console.log(`\n✅ Exitosos: ${results.success.length}`)
  console.log(`⚠️  Omitidos: ${results.skipped.length}`)
  console.log(`❌ Errores: ${results.errors.length}`)

  if (results.success.length > 0) {
    console.log('\n✅ Blogs migrados exitosamente:')
    results.success.forEach(slug => console.log(`   - ${slug}`))
  }

  if (results.skipped.length > 0) {
    console.log('\n⚠️  Blogs omitidos (ya existían):')
    results.skipped.forEach(slug => console.log(`   - ${slug}`))
  }

  if (results.errors.length > 0) {
    console.log('\n❌ Errores encontrados:')
    results.errors.forEach(({ blog, error }) => {
      console.log(`   - ${blog}: ${error}`)
    })
  }

  console.log('\n' + '='.repeat(50))
  console.log('✅ Migración completada!')
  console.log('='.repeat(50) + '\n')
}

// ============================================
// COMANDO DE AYUDA
// ============================================

if (isHelp) {
  console.log(`
📚 Script de Migración de Blogs a Supabase

USO:
  node migrate-blogs-to-supabase.js              Ejecutar migración
  node migrate-blogs-to-supabase.js --help       Mostrar esta ayuda
  node migrate-blogs-to-supabase.js --dry-run    Simular sin guardar

REQUISITOS:
  1. Archivo .env configurado con credenciales de Supabase
  2. Tabla blog_articles creada en Supabase
  3. Node.js instalado

NOTAS:
  - Los blogs existentes (mismo slug) se omiten automáticamente
  - Se recomienda hacer un backup antes de ejecutar
  - El script puede ejecutarse múltiples veces de forma segura
  `)
  process.exit(0)
}

// ============================================
// DRY RUN (Simulación)
// ============================================

if (isDryRun) {
  console.log('🔍 MODO DRY RUN (Simulación - No se guardará nada)\n')
  try {
    const blogArticlesContent = await loadBlogArticlesContentAsync()
    existingBlogs = buildExistingBlogsFromContent(blogArticlesContent)

    existingBlogs.forEach((blog, index) => {
      console.log(`${index + 1}. ${blog.title}`)
      console.log(`   Slug: ${blog.slug}`)
      console.log(`   Idioma: ${blog.language}`)
      console.log(`   Categoría: ${blog.category}`)
      console.log(`   Tags: ${(blog.tags || []).join(', ')}`)
      console.log()
    })

    console.log(`\n📊 Total: ${existingBlogs.length} blogs`)
  } catch (err) {
    console.error('❌ Error en dry-run:', err.message)
    process.exit(1)
  }
  console.log('\n💡 Para ejecutar la migración real, ejecuta sin --dry-run\n')
  process.exit(0)
}

// ============================================
// EJECUTAR
// ============================================

if (!supabaseUrl || !supabaseAnonKey) {
  console.error('❌ Error: Variables de entorno no configuradas')
  console.error('Asegúrate de tener VITE_SUPABASE_URL y VITE_SUPABASE_ANON_KEY en .env')
  process.exit(1)
}

if (!adminEmail || !adminPassword) {
  console.error('❌ Error: Faltan credenciales de admin para Supabase Auth')
  console.error('Agrega SUPABASE_ADMIN_EMAIL y SUPABASE_ADMIN_PASSWORD a tu .env (solo local).')
  process.exit(1)
}

supabase = createClient(supabaseUrl, supabaseAnonKey)

// Verificar conexión a Supabase
console.log('🔌 Verificando conexión a Supabase...')
const { data, error } = await supabase.from('blog_articles').select('count', { count: 'exact', head: true })

if (error) {
  console.error('❌ Error conectando a Supabase:', error.message)
  console.error('\nVerifica:')
  console.error('1. Variables de entorno en .env')
  console.error('2. Tabla blog_articles existe en Supabase')
  console.error('3. Credenciales son correctas\n')
  process.exit(1)
}

console.log('✅ Conexión exitosa a Supabase\n')

// Ejecutar migración
await runMigration()
