import { createClient } from '@supabase/supabase-js'

// Estas son las credenciales públicas de Supabase
// IMPORTANTE: Reemplaza estos valores con los de tu proyecto Supabase
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || 'https://tu-proyecto.supabase.co'
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || 'tu-clave-publica'

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

// ============================================
// FUNCIONES PARA BLOG CMS
// ============================================

/**
 * Obtener todos los artículos del blog (publicados y borradores)
 * @param {boolean} onlyPublished - Si solo quiere artículos publicados
 * @param {string} language - Filtrar por idioma (es/en)
 */
export async function getBlogArticles(onlyPublished = true, language = null) {
  let query = supabase
    .from('blog_articles')
    .select('*')
    .order('published_at', { ascending: false, nullsFirst: false })

  if (onlyPublished) {
    query = query.eq('is_published', true)
  }

  if (language) {
    query = query.eq('language', language)
  }

  const { data, error } = await query

  if (error) {
    console.error('Error obteniendo artículos:', error)
    throw error
  }

  return data
}

/**
 * Obtener un artículo por su slug
 */
export async function getBlogArticleBySlug(slug) {
  const { data, error } = await supabase
    .from('blog_articles')
    .select('*')
    .eq('slug', slug)
    .single()

  if (error) {
    console.error('Error obteniendo artículo:', error)
    throw error
  }

  return data
}

/**
 * Crear nuevo artículo
 */
export async function createBlogArticle(articleData) {
  const { data, error } = await supabase
    .from('blog_articles')
    .insert([{
      ...articleData,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    }])
    .select()
    .single()

  if (error) {
    console.error('Error creando artículo:', error)
    throw error
  }

  return data
}

/**
 * Actualizar artículo existente
 */
export async function updateBlogArticle(id, updates) {
  const { data, error } = await supabase
    .from('blog_articles')
    .update({
      ...updates,
      updated_at: new Date().toISOString()
    })
    .eq('id', id)
    .select()
    .single()

  if (error) {
    console.error('Error actualizando artículo:', error)
    throw error
  }

  return data
}

/**
 * Eliminar artículo
 */
export async function deleteBlogArticle(id) {
  const { error } = await supabase
    .from('blog_articles')
    .delete()
    .eq('id', id)

  if (error) {
    console.error('Error eliminando artículo:', error)
    throw error
  }

  return true
}

/**
 * Subir imagen al storage de Supabase
 */
export async function uploadBlogImage(file, folder = 'blog-images') {
  const fileName = `${Date.now()}-${file.name}`
  const filePath = `${folder}/${fileName}`

  const { data, error } = await supabase.storage
    .from('blog-images')
    .upload(filePath, file, {
      cacheControl: '3600',
      upsert: false
    })

  if (error) {
    console.error('Error subiendo imagen:', error)
    throw error
  }

  // Obtener URL pública
  const { data: { publicUrl } } = supabase.storage
    .from('blog-images')
    .getPublicUrl(filePath)

  return publicUrl
}

// ============================================
// FUNCIONES PARA LABORATORIO ÉTICO
// ============================================

/**
 * Obtener todos los votos de un dilema
 */
export async function getVotes(dilemaId) {
  const { data, error } = await supabase
    .from('laboratorio_votos')
    .select('opcion')
    .eq('dilema_id', dilemaId)

  if (error) {
    console.error('Error obteniendo votos:', error)
    return {}
  }

  // Contar votos por opción
  const counts = {}
  data.forEach(vote => {
    counts[vote.opcion] = (counts[vote.opcion] || 0) + 1
  })

  return counts
}

/**
 * Registrar un voto
 */
export async function saveVote(dilemaId, opcionId, ipHash) {
  // Primero verificar si ya votó
  const { data: existing } = await supabase
    .from('laboratorio_votos')
    .select('id')
    .eq('dilema_id', dilemaId)
    .eq('ip_hash', ipHash)
    .single()

  if (existing) {
    return { success: false, message: 'Ya has votado en este dilema' }
  }

  // Registrar el voto
  const { error } = await supabase
    .from('laboratorio_votos')
    .insert({
      dilema_id: dilemaId,
      opcion: opcionId,
      ip_hash: ipHash
    })

  if (error) {
    console.error('Error guardando voto:', error)
    return { success: false, message: 'Error al guardar el voto' }
  }

  return { success: true }
}

/**
 * Guardar un comentario
 */
export async function saveComment(dilemaId, nombre, comentario, telefono = null) {
  const { error } = await supabase
    .from('laboratorio_comentarios')
    .insert({
      dilema_id: dilemaId,
      nombre,
      comentario,
      telefono
    })

  if (error) {
    console.error('Error guardando comentario:', error)
    return { success: false, message: 'Error al guardar el comentario' }
  }

  return { success: true }
}

/**
 * Obtener comentarios de un dilema
 */
export async function getComments(dilemaId) {
  const { data, error } = await supabase
    .from('laboratorio_comentarios')
    .select('nombre, comentario, created_at')
    .eq('dilema_id', dilemaId)
    .order('created_at', { ascending: false })
    .limit(50)

  if (error) {
    console.error('Error obteniendo comentarios:', error)
    return []
  }

  return data || []
}
