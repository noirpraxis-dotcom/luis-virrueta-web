/**
 * Migrar blogs existentes a Firestore
 * USO: node migrate-blogs-to-firestore.mjs
 */

import dotenv from 'dotenv'
dotenv.config()

import { initializeApp } from 'firebase/app'
import { getFirestore, doc, setDoc, getDoc } from 'firebase/firestore'
import { getAuth, signInWithEmailAndPassword } from 'firebase/auth'

const firebaseConfig = {
  apiKey: process.env.VITE_FIREBASE_API_KEY,
  authDomain: process.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: process.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.VITE_FIREBASE_APP_ID
}

const app = initializeApp(firebaseConfig)
const db = getFirestore(app)
const auth = getAuth(app)

// Sign in as admin to have write access
console.log('🔐 Autenticando como admin...')
try {
  await signInWithEmailAndPassword(auth, 'luis.virrueta.contacto@gmail.com', process.argv[2] || '')
  console.log('✅ Autenticado\n')
} catch (e) {
  console.log('⚠️  Sin autenticación de admin - intentando escritura directa\n')
}

const COLLECTION = 'blog_articles'

// ─── Load blog content ───────────────────────────────────
const mod = await import('./src/data/blogArticlesContent.js')
const blogArticlesContent = mod.default

// ─── Load blog index for metadata ───────────────────────
const indexMod = await import('./src/data/blogIndex.js')
const blogIndex = indexMod.blogIndex || indexMod.default?.blogIndex || []

// Build metadata map from index
const indexBySlug = new Map()
for (const post of blogIndex) {
  if (post?.slug) indexBySlug.set(post.slug, post)
}

// ─── Helpers ─────────────────────────────────────────────

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
      case 'text': case 'intro': case 'conclusion':
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
            : String(item?.description || item || '')
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

function buildExcerpt(sections = []) {
  const firstText = sections.find(s => s && (s.type === 'intro' || s.type === 'text') && s.content)
  const raw = firstText?.content || ''
  const cleaned = raw.replace(/\s+/g, ' ').trim()
  return cleaned.length > 180 ? `${cleaned.slice(0, 177)}...` : cleaned
}

function parseDate(dateString, language) {
  if (!dateString) return null
  if (language === 'en') {
    const d = new Date(dateString)
    return Number.isNaN(d.getTime()) ? null : d.toISOString()
  }
  const months = { ene:0,feb:1,mar:2,abr:3,may:4,jun:5,jul:6,ago:7,sep:8,oct:9,nov:10,dic:11 }
  const parts = dateString.replace(/\./g, '').trim().split(/\s+/)
  if (parts.length < 3) return null
  const day = Number(parts[0]), month = months[String(parts[1]).toLowerCase().slice(0,3)], year = Number(parts[2])
  if (!Number.isFinite(day) || !Number.isFinite(month) || !Number.isFinite(year)) return null
  const d = new Date(Date.UTC(year, month, day))
  return Number.isNaN(d.getTime()) ? null : d.toISOString()
}

// ─── Build articles list ─────────────────────────────────

const articles = []
for (const language of Object.keys(blogArticlesContent)) {
  const bySlug = blogArticlesContent[language] || {}
  for (const slug of Object.keys(bySlug)) {
    const a = bySlug[slug]
    if (!a?.title || !a?.sections) continue

    const meta = indexBySlug.get(slug) || {}
    const content = toBlocksFromSections(a.sections)
    const published_at = parseDate(a.date || meta.date, language)

    articles.push({
      slug,
      title: a.title,
      subtitle: a.subtitle || '',
      excerpt: a.excerpt || buildExcerpt(a.sections),
      content,
      author: a.author || 'Luis Virrueta',
      category: a.category || meta.category || 'philosophy',
      accent: meta.accent || null,
      tags: a.tags || meta.tags || [],
      read_time: a.readTime || a.read_time || meta.readTime || '15 min',
      language,
      image_url: a.image || a.heroImage || meta.image || null,
      is_published: true,
      published_at: published_at || new Date().toISOString(),
      created_at: published_at || new Date().toISOString(),
      updated_at: new Date().toISOString(),
      rating: meta.rating || null,
      views: 0
    })
  }
}

console.log(`\n📊 Total artículos a migrar: ${articles.length}\n`)

// ─── Check existing and migrate ──────────────────────────

let success = 0, skipped = 0, errors = 0

for (const article of articles) {
  const docId = `${article.slug}__${article.language}`
  
  try {
    const docRef = doc(db, COLLECTION, docId)
    const existing = await getDoc(docRef)
    if (existing.exists()) {
      console.log(`⚠️  Ya existe: ${article.slug} (${article.language}) - Saltando`)
      skipped++
      continue
    }

    await setDoc(doc(db, COLLECTION, docId), article)
    console.log(`✅ ${article.slug} (${article.language})`)
    success++
  } catch (err) {
    console.error(`❌ ${article.slug}: ${err.message}`)
    errors++
  }
}

console.log(`\n${'='.repeat(50)}`)
console.log(`📊 RESUMEN: ✅ ${success} migrados | ⚠️ ${skipped} omitidos | ❌ ${errors} errores`)
console.log(`${'='.repeat(50)}\n`)

process.exit(errors > 0 ? 1 : 0)
