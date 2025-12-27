import { createClient } from '@supabase/supabase-js'

// Estas son las credenciales públicas de Supabase
// IMPORTANTE: Reemplaza estos valores con los de tu proyecto Supabase
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || 'https://tu-proyecto.supabase.co'
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || 'tu-clave-publica'

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

// Funciones helper para el Laboratorio Ético

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
