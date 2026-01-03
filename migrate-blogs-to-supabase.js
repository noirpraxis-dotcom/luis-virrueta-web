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
import * as fs from 'fs'
import * as path from 'path'

// ============================================
// CONFIGURACIÓN
// ============================================

// Cargar variables de entorno
import dotenv from 'dotenv'
dotenv.config()

const supabaseUrl = process.env.VITE_SUPABASE_URL
const supabaseKey = process.env.VITE_SUPABASE_ANON_KEY

if (!supabaseUrl || !supabaseKey) {
  console.error('❌ Error: Variables de entorno no configuradas')
  console.error('Asegúrate de tener VITE_SUPABASE_URL y VITE_SUPABASE_ANON_KEY en .env')
  process.exit(1)
}

const supabase = createClient(supabaseUrl, supabaseKey)

// ============================================
// DATOS DE BLOGS EXISTENTES
// ============================================

// Mapeo de tus blogs actuales
const existingBlogs = [
  {
    slug: 'sudoku',
    title: 'SU·DO·KU: El arte de pensar por descarte',
    subtitle: 'Por qué la vida no responde afirmando',
    excerpt: 'Por qué la vida no responde afirmando. ¿Y si el problema no fuera la falta de respuestas, sino la prisa por clausurarlas?',
    category: 'psychoanalysis',
    author: 'Luis Virrueta',
    tags: ['Pensamiento', 'Psicoanálisis', 'Filosofía', 'Vida', 'Vía Negativa', 'Lacan'],
    read_time: '15 min',
    language: 'es',
    image_url: '/IMAGENES BLOG/SUDOKU HUMANO.jpg',
    published_at: '2025-12-22T00:00:00Z'
  },
  {
    slug: 'puta-panico-usurpacion-terror-autonomia',
    title: 'P.U.T.A. (Pánico · Usurpación · Terror · Autonomía)',
    subtitle: 'El deseo que acusa, el goce que se esconde',
    excerpt: 'La palabra no describe al otro. Revela a quien necesita decirla para no sentir.',
    category: 'psychoanalysis',
    author: 'Luis Virrueta',
    tags: ['Psicoanálisis', 'Lacan', 'Freud', 'Žižek', 'Deseo', 'Goce', 'Represión', 'Proyección'],
    read_time: '19 min',
    language: 'es',
    image_url: '/IMAGENES BLOG/puta.jpg',
    published_at: '2025-12-22T00:00:00Z'
  },
  {
    slug: 'el-juego-que-nadie-confiesa-estar-jugando',
    title: 'El juego que nadie confiesa estar jugando',
    subtitle: 'Sobre la corrupción y el juego simbólico',
    excerpt: 'Llamar "corrupción" a algo es a veces solo una forma de no verte jugando.',
    category: 'philosophy',
    author: 'Luis Virrueta',
    tags: ['Moral', 'Ética', 'Lacan', 'Žižek', 'Lenguaje', 'Juego Simbólico', 'Responsabilidad', 'Espiritualidad'],
    read_time: '16 min',
    language: 'es',
    image_url: '/IMAGENES BLOG/ajedrez.jpg',
    published_at: '2025-12-18T00:00:00Z'
  },
  // ... Puedes agregar todos los demás blogs aquí
]

// ============================================
// FUNCIÓN DE MIGRACIÓN
// ============================================

async function migrateBlog(blog) {
  try {
    console.log(`\n📝 Migrando: ${blog.title}`)

    // Convertir contenido a formato de bloques
    // Nota: Aquí deberías adaptar según tu estructura actual
    const content = [
      {
        id: 'block-1',
        type: 'heading',
        level: 'h1',
        content: blog.title
      },
      {
        id: 'block-2',
        type: 'paragraph',
        content: blog.excerpt
      }
    ]

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
      created_at: blog.published_at,
      updated_at: new Date().toISOString()
    }

    // Verificar si ya existe
    const { data: existing } = await supabase
      .from('blog_articles')
      .select('id')
      .eq('slug', blog.slug)
      .single()

    if (existing) {
      console.log(`⚠️  Ya existe: ${blog.slug} - Saltando...`)
      return { status: 'skipped', blog: blog.slug }
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
    return { status: 'success', blog: blog.slug }

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

if (process.argv.includes('--help') || process.argv.includes('-h')) {
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

if (process.argv.includes('--dry-run')) {
  console.log('🔍 MODO DRY RUN (Simulación - No se guardará nada)\n')
  existingBlogs.forEach((blog, index) => {
    console.log(`${index + 1}. ${blog.title}`)
    console.log(`   Slug: ${blog.slug}`)
    console.log(`   Categoría: ${blog.category}`)
    console.log(`   Tags: ${blog.tags.join(', ')}`)
    console.log()
  })
  console.log(`\n📊 Total: ${existingBlogs.length} blogs`)
  console.log('\n💡 Para ejecutar la migración real, ejecuta sin --dry-run\n')
  process.exit(0)
}

// ============================================
// EJECUTAR
// ============================================

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
