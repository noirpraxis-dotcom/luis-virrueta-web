import {
  collection, doc, addDoc, getDoc, getDocs, updateDoc, deleteDoc, setDoc,
  query, where, orderBy, limit, serverTimestamp
} from 'firebase/firestore'
import { db } from '../config/firebase'

// ============================================
// FUNCIONES PARA BLOG CMS (Firestore)
// ============================================

const BLOG_COLLECTION = 'blog_articles'
const VOTES_COLLECTION = 'laboratorio_votos'
const COMMENTS_COLLECTION = 'laboratorio_comentarios'

/**
 * Obtener todos los artículos del blog
 */
export async function getBlogArticles(onlyPublished = true, language = null) {
  try {
    const constraints = [orderBy('published_at', 'desc')]
    if (onlyPublished) constraints.push(where('is_published', '==', true))
    if (language) constraints.push(where('language', '==', language))

    const q = query(collection(db, BLOG_COLLECTION), ...constraints)
    const snap = await getDocs(q)
    return snap.docs.map(d => ({ id: d.id, ...d.data() }))
  } catch (err) {
    console.error('Error obteniendo artículos:', err)
    return []
  }
}

/**
 * Obtener un artículo por su slug
 */
export async function getBlogArticleBySlug(slug) {
  const q = query(collection(db, BLOG_COLLECTION), where('slug', '==', slug), limit(1))
  const snap = await getDocs(q)
  if (snap.empty) throw new Error('Artículo no encontrado')
  const d = snap.docs[0]
  return { id: d.id, ...d.data() }
}

/**
 * Crear nuevo artículo
 */
export async function createBlogArticle(articleData) {
  const now = new Date().toISOString()
  const docRef = await addDoc(collection(db, BLOG_COLLECTION), {
    ...articleData,
    created_at: now,
    updated_at: now
  })
  return { id: docRef.id, ...articleData, created_at: now, updated_at: now }
}

/**
 * Actualizar artículo existente
 */
export async function updateBlogArticle(id, updates) {
  const ref = doc(db, BLOG_COLLECTION, id)
  const data = { ...updates, updated_at: new Date().toISOString() }
  await updateDoc(ref, data)
  const snap = await getDoc(ref)
  return { id: snap.id, ...snap.data() }
}

/**
 * Eliminar artículo
 */
export async function deleteBlogArticle(id) {
  await deleteDoc(doc(db, BLOG_COLLECTION, id))
  return true
}

/**
 * Subir imagen — usa R2 CDN via Worker
 */
export async function uploadBlogImage(file) {
  const API = import.meta.env.VITE_API_BASE_URL
  const ADMIN_SECRET = import.meta.env.VITE_ADMIN_SECRET

  const formData = new FormData()
  formData.append('file', file)
  formData.append('path', `blog/${Date.now()}-${file.name}`)

  const res = await fetch(`${API}/media/upload`, {
    method: 'POST',
    headers: { 'X-Admin-Secret': ADMIN_SECRET },
    body: formData
  })

  if (!res.ok) throw new Error('Error subiendo imagen')
  const { url } = await res.json()
  return url
}

// ============================================
// FUNCIONES PARA LABORATORIO ÉTICO (Firestore)
// ============================================

/**
 * Obtener todos los votos de un dilema
 */
export async function getVotes(dilemaId) {
  try {
    const q = query(collection(db, VOTES_COLLECTION), where('dilema_id', '==', dilemaId))
    const snap = await getDocs(q)
    const counts = {}
    snap.docs.forEach(d => {
      const opcion = d.data().opcion
      counts[opcion] = (counts[opcion] || 0) + 1
    })
    return counts
  } catch (err) {
    console.error('Error obteniendo votos:', err)
    return {}
  }
}

/**
 * Registrar un voto
 */
export async function saveVote(dilemaId, opcionId, ipHash) {
  try {
    // Verificar si ya votó
    const q = query(
      collection(db, VOTES_COLLECTION),
      where('dilema_id', '==', dilemaId),
      where('ip_hash', '==', ipHash),
      limit(1)
    )
    const snap = await getDocs(q)
    if (!snap.empty) {
      return { success: false, message: 'Ya has votado en este dilema' }
    }

    await addDoc(collection(db, VOTES_COLLECTION), {
      dilema_id: dilemaId,
      opcion: opcionId,
      ip_hash: ipHash,
      created_at: serverTimestamp()
    })
    return { success: true }
  } catch (err) {
    console.error('Error guardando voto:', err)
    return { success: false, message: 'Error al guardar el voto' }
  }
}

/**
 * Guardar un comentario
 */
export async function saveComment(dilemaId, nombre, comentario, telefono = null) {
  try {
    await addDoc(collection(db, COMMENTS_COLLECTION), {
      dilema_id: dilemaId,
      nombre,
      comentario,
      telefono: telefono || null,
      created_at: serverTimestamp()
    })
    return { success: true }
  } catch (err) {
    console.error('Error guardando comentario:', err)
    return { success: false, message: 'Error al guardar el comentario' }
  }
}

/**
 * Obtener comentarios de un dilema
 */
export async function getComments(dilemaId) {
  try {
    const q = query(
      collection(db, COMMENTS_COLLECTION),
      where('dilema_id', '==', dilemaId),
      orderBy('created_at', 'desc'),
      limit(50)
    )
    const snap = await getDocs(q)
    return snap.docs.map(d => {
      const data = d.data()
      return {
        nombre: data.nombre,
        comentario: data.comentario,
        created_at: data.created_at?.toDate?.()?.toISOString() || data.created_at
      }
    })
  } catch (err) {
    console.error('Error obteniendo comentarios:', err)
    return []
  }
}
