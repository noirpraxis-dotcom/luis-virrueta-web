import { createClient } from '@supabase/supabase-js'
import fs from 'fs/promises'
import path from 'path'
import sharp from 'sharp'
import dotenv from 'dotenv'

dotenv.config()

const supabaseUrl = process.env.VITE_SUPABASE_URL
const supabaseKey = process.env.VITE_SUPABASE_ANON_KEY
const adminEmail = process.env.SUPABASE_ADMIN_EMAIL
const adminPassword = process.env.SUPABASE_ADMIN_PASSWORD

const supabase = createClient(supabaseUrl, supabaseKey)

/**
 * Comprimir imagen con Sharp a ~100KB WebP
 */
async function compressImage(inputPath, maxSizeKB = 100) {
  let quality = 80
  let compressed = null
  let size = Infinity

  while (quality > 10 && size > maxSizeKB * 1024) {
    compressed = await sharp(inputPath)
      .resize(1200, 800, { fit: 'inside', withoutEnlargement: true })
      .webp({ quality })
      .toBuffer()
    
    size = compressed.length
    quality -= 5
  }

  return compressed
}

/**
 * Subir imagen a Supabase Storage
 */
async function uploadImage(fileName, buffer) {
  const webpName = fileName.replace(/\.(jpg|jpeg|png|webp)$/i, '.webp')
  
  // Verificar si ya existe
  const { data: existing } = await supabase.storage
    .from('blog-images')
    .list('', { search: webpName })
  
  if (existing && existing.length > 0) {
    console.log(`   ⏭️  Ya existe: ${webpName}`)
    const { data: { publicUrl } } = supabase.storage
      .from('blog-images')
      .getPublicUrl(webpName)
    return publicUrl
  }

  // Subir nueva imagen
  const { data, error } = await supabase.storage
    .from('blog-images')
    .upload(webpName, buffer, {
      contentType: 'image/webp',
      cacheControl: '3600',
      upsert: false
    })

  if (error) throw error

  const { data: { publicUrl } } = supabase.storage
    .from('blog-images')
    .getPublicUrl(webpName)

  return publicUrl
}

/**
 * Actualizar referencias de imágenes en blog_articles
 */
async function updateArticleImage(oldPath, newUrl) {
  // Extraer nombre base sin extensión para buscar coincidencias
  const baseName = path.basename(oldPath, path.extname(oldPath))
  
  // Buscar artículos que usen esta imagen (sin extension o con cualquier extension)
  const { data: articles, error } = await supabase
    .from('blog_articles')
    .select('id, image_url, slug')
    .or(`image_url.ilike.%${baseName}%`)
  
  if (error) {
    console.error(`   ⚠️  Error buscando artículos: ${error.message}`)
    return 0
  }

  if (!articles || articles.length === 0) {
    return 0
  }

  // Actualizar cada artículo
  let updated = 0
  for (const article of articles) {
    const { error: updateError } = await supabase
      .from('blog_articles')
      .update({ image_url: newUrl })
      .eq('id', article.id)
    
    if (!updateError) {
      console.log(`   ✅ Actualizado artículo: ${article.slug}`)
      updated++
    }
  }

  return updated
}

/**
 * Migrar todas las imágenes
 */
async function migrateAllImages() {
  console.log('\n🚀 Iniciando migración de imágenes a Supabase Storage\n')

  // Login admin
  console.log('🔐 Iniciando sesión admin...')
  const { error: authError } = await supabase.auth.signInWithPassword({
    email: adminEmail,
    password: adminPassword
  })

  if (authError) {
    console.error('❌ Error de autenticación:', authError.message)
    process.exit(1)
  }
  console.log('✅ Sesión iniciada\n')

  // Directorio de imágenes
  const imagesDir = path.join(process.cwd(), 'public', 'IMAGENES BLOG')
  
  try {
    const files = await fs.readdir(imagesDir)
    const imageFiles = files.filter(f => /\.(jpg|jpeg|png|webp)$/i.test(f))
    
    console.log(`📁 Encontradas ${imageFiles.length} imágenes\n`)

    let totalUploaded = 0
    let totalUpdated = 0
    let totalSkipped = 0
    let totalErrors = 0

    for (const [index, fileName] of imageFiles.entries()) {
      const num = index + 1
      console.log(`[${num}/${imageFiles.length}] 📸 Procesando: ${fileName}`)
      
      try {
        const filePath = path.join(imagesDir, fileName)
        const stats = await fs.stat(filePath)
        const originalSizeKB = (stats.size / 1024).toFixed(0)
        
        console.log(`   📦 Tamaño original: ${originalSizeKB} KB`)
        
        // Comprimir
        console.log(`   ⚙️  Comprimiendo...`)
        const compressed = await compressImage(filePath, 100)
        const compressedSizeKB = (compressed.length / 1024).toFixed(0)
        const reduction = Math.round((1 - compressed.length / stats.size) * 100)
        
        console.log(`   ✨ Comprimido: ${compressedSizeKB} KB (-${reduction}%)`)
        
        // Subir a Supabase
        console.log(`   ☁️  Subiendo a Supabase...`)
        const publicUrl = await uploadImage(fileName, compressed)
        
        if (publicUrl.includes('Ya existe')) {
          totalSkipped++
        } else {
          totalUploaded++
          console.log(`   ✅ Subido: ${publicUrl}`)
        }
        
        // Actualizar referencias en artículos
        const oldPath = `/IMAGENES BLOG/${fileName}`
        const articlesUpdated = await updateArticleImage(oldPath, publicUrl)
        totalUpdated += articlesUpdated
        
        console.log('') // Línea en blanco
      } catch (error) {
        console.error(`   ❌ Error: ${error.message}\n`)
        totalErrors++
      }
    }

    console.log('\n' + '='.repeat(60))
    console.log('📊 RESUMEN DE MIGRACIÓN')
    console.log('='.repeat(60))
    console.log(`Total imágenes procesadas:  ${imageFiles.length}`)
    console.log(`✅ Subidas nuevas:          ${totalUploaded}`)
    console.log(`⏭️  Ya existían:             ${totalSkipped}`)
    console.log(`❌ Errores:                 ${totalErrors}`)
    console.log(`📝 Artículos actualizados:  ${totalUpdated}`)
    console.log('='.repeat(60) + '\n')

  } catch (error) {
    console.error('❌ Error fatal:', error.message)
    process.exit(1)
  }

  // Logout
  await supabase.auth.signOut()
  console.log('✅ Migración completada\n')
}

// Ejecutar
migrateAllImages().catch(console.error)
