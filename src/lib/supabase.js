import {
  collection, doc, addDoc, getDoc, getDocs, updateDoc, deleteDoc, setDoc,
  query, where, orderBy, limit, serverTimestamp, arrayUnion, increment
} from 'firebase/firestore'
import { db } from '../config/firebase'

// ============================================
// FUNCIONES PARA BLOG CMS (Firestore)
// ============================================

const BLOG_COLLECTION = 'blog_articles'
const BLOG_META_DOC = 'blog_metadata'
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
 * Obtener categorías y tags globales guardados
 */
export async function getBlogMetadata() {
  try {
    const ref = doc(db, BLOG_META_DOC, 'global')
    const snap = await getDoc(ref)
    if (!snap.exists()) return { categories: [], tags: [] }
    const data = snap.data()
    return {
      categories: Array.isArray(data.categories) ? data.categories : [],
      tags: Array.isArray(data.tags) ? data.tags : []
    }
  } catch (err) {
    console.error('Error obteniendo blog metadata:', err)
    return { categories: [], tags: [] }
  }
}

/**
 * Guardar categorías y/o tags nuevos (merge con existentes)
 */
export async function saveBlogMetadata({ categories = [], tags = [] }) {
  try {
    const ref = doc(db, BLOG_META_DOC, 'global')
    const updates = {}
    if (categories.length) updates.categories = arrayUnion(...categories)
    if (tags.length) updates.tags = arrayUnion(...tags)
    if (Object.keys(updates).length === 0) return
    await setDoc(ref, updates, { merge: true })
  } catch (err) {
    console.error('Error guardando blog metadata:', err)
  }
}

/**
 * Subir imagen — usa R2 CDN via Worker
 */
export async function uploadBlogImage(file) {
  const API = import.meta.env.VITE_API_BASE_URL
  const ADMIN_SECRET = import.meta.env.VITE_ADMIN_SECRET

  const ext = file.name?.split('.').pop()?.toLowerCase() || 'webp'
  const filename = `${Date.now()}.${ext}`
  const folder = 'blog'

  const res = await fetch(`${API}/api/media-upload?folder=${folder}&filename=${filename}`, {
    method: 'PUT',
    headers: {
      'X-Admin-Secret': ADMIN_SECRET,
      'Content-Type': file.type || 'image/webp'
    },
    body: file
  })

  if (!res.ok) throw new Error('Error subiendo imagen')
  const data = await res.json()
  // Return absolute URL
  return `${API}${data.url}`
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

// ============================================
// FUNCIONES PARA COMENTARIOS DE BLOG
// ============================================
const BLOG_COMMENTS_COLLECTION = 'blog_comments'

export async function addBlogComment({ slug, userId, userName, userPhoto, content, rating }) {
  try {
    const docRef = await addDoc(collection(db, BLOG_COMMENTS_COLLECTION), {
      slug,
      user_id: userId,
      user_name: userName,
      user_photo: userPhoto || null,
      content,
      rating: rating || 0,
      status: 'pending',
      created_at: serverTimestamp()
    })
    return { id: docRef.id }
  } catch (err) {
    console.error('Error agregando comentario:', err)
    return null
  }
}

export async function getBlogComments(slug, includeAll = false) {
  try {
    const constraints = [
      where('slug', '==', slug)
    ]
    if (!includeAll) {
      constraints.push(where('status', '==', 'approved'))
    }
    constraints.push(orderBy('created_at', 'desc'))
    constraints.push(limit(100))
    const q = query(collection(db, BLOG_COMMENTS_COLLECTION), ...constraints)
    const snap = await getDocs(q)
    return snap.docs.map(d => ({
      id: d.id,
      ...d.data(),
      created_at: d.data().created_at?.toDate?.()?.toISOString() || d.data().created_at
    }))
  } catch (err) {
    console.error('Error obteniendo comentarios del blog:', err)
    return []
  }
}

export async function moderateBlogComment(commentId, status) {
  try {
    await updateDoc(doc(db, BLOG_COMMENTS_COLLECTION, commentId), { status })
    return true
  } catch (err) {
    console.error('Error moderando comentario:', err)
    return false
  }
}

export async function deleteBlogComment(commentId) {
  try {
    await deleteDoc(doc(db, BLOG_COMMENTS_COLLECTION, commentId))
    return true
  } catch (err) {
    console.error('Error eliminando comentario:', err)
    return false
  }
}

export async function getAllBlogComments(statusFilter = null) {
  try {
    const constraints = [orderBy('created_at', 'desc'), limit(200)]
    if (statusFilter) {
      constraints.push(where('status', '==', statusFilter))
    }
    const q = query(collection(db, BLOG_COMMENTS_COLLECTION), ...constraints)
    const snap = await getDocs(q)
    return snap.docs.map(d => ({
      id: d.id,
      ...d.data(),
      created_at: d.data().created_at?.toDate?.()?.toISOString() || d.data().created_at
    }))
  } catch (err) {
    console.error('Error obteniendo todos los comentarios:', err)
    return []
  }
}

// ============================================
// FUNCIONES PARA ANALYTICS (Firestore)
// ============================================

const ANALYTICS_COLLECTION = 'page_views'
const ANALYTICS_DAILY_COLLECTION = 'analytics_daily'

/**
 * Registrar una visita de página
 */
export async function trackPageView({ path, slug = null, referrer = '', userAgent = '' }) {
  try {
    const now = new Date()
    const dateStr = now.toISOString().slice(0, 10)

    await addDoc(collection(db, ANALYTICS_COLLECTION), {
      path,
      slug,
      referrer: referrer || document.referrer || '',
      user_agent: userAgent || navigator.userAgent || '',
      language: navigator.language || '',
      screen: `${screen.width}x${screen.height}`,
      date: dateStr,
      timestamp: serverTimestamp(),
      is_mobile: /Mobile|Android|iPhone/i.test(navigator.userAgent)
    })

    // Incrementar contador diario agregado
    const dailyDocId = `${dateStr}_${(slug || path).replace(/[\/\.#]/g, '_')}`
    const dailyRef = doc(db, ANALYTICS_DAILY_COLLECTION, dailyDocId)
    try {
      await updateDoc(dailyRef, { views: increment(1) })
    } catch {
      await setDoc(dailyRef, { date: dateStr, path, slug, views: 1 })
    }
  } catch (err) {
    console.warn('Analytics track error:', err)
  }
}

/**
 * Obtener datos agregados diarios
 */
export async function getAnalyticsDaily(days = 30) {
  try {
    const since = new Date()
    since.setDate(since.getDate() - days)
    const sinceStr = since.toISOString().slice(0, 10)

    const q = query(
      collection(db, ANALYTICS_DAILY_COLLECTION),
      where('date', '>=', sinceStr),
      orderBy('date', 'asc')
    )
    const snap = await getDocs(q)
    return snap.docs.map(d => ({ id: d.id, ...d.data() }))
  } catch (err) {
    console.error('Error obteniendo analytics diarios:', err)
    return []
  }
}

/**
 * Obtener visitas individuales para análisis detallado
 */
export async function getAnalyticsRaw(days = 30, maxDocs = 2000) {
  try {
    const since = new Date()
    since.setDate(since.getDate() - days)
    const sinceStr = since.toISOString().slice(0, 10)

    const q = query(
      collection(db, ANALYTICS_COLLECTION),
      where('date', '>=', sinceStr),
      orderBy('date', 'desc'),
      limit(maxDocs)
    )
    const snap = await getDocs(q)
    return snap.docs.map(d => {
      const data = d.data()
      return {
        id: d.id,
        ...data,
        timestamp: data.timestamp?.toDate?.()?.toISOString() || data.timestamp
      }
    })
  } catch (err) {
    console.error('Error obteniendo analytics raw:', err)
    return []
  }
}
