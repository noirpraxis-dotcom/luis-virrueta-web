import { useState, useEffect, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { db } from '../config/firebase'
import { doc, getDoc, setDoc } from 'firebase/firestore'
import { motion, AnimatePresence } from 'framer-motion'
import {
  Search, Globe, FileText, Image, ArrowLeft, Save, CheckCircle,
  ExternalLink, Eye, Copy, AlertCircle, Loader2, Link2
} from 'lucide-react'

const SITE_URL = 'https://luisvirrueta.com'

// All pages available for SEO management
const PAGES = [
  { id: 'home', path: '/', name: 'Inicio', category: 'Principal' },
  { id: 'about', path: '/sobre-mi', name: 'Sobre Mí', category: 'Principal' },
  { id: 'metodo', path: '/metodo', name: 'El Método', category: 'Principal' },
  { id: 'metodo-fases', path: '/metodo/fases', name: 'Fases del Método', category: 'Principal' },
  { id: 'servicios', path: '/servicios', name: 'Servicios', category: 'Principal' },
  { id: 'contacto', path: '/contacto', name: 'Contacto', category: 'Principal' },
  { id: 'blog', path: '/blog', name: 'Blog', category: 'Contenido' },
  { id: 'frase', path: '/frase-del-dia', name: 'Frase del Día', category: 'Contenido' },
  { id: 'atlas', path: '/atlas-humanidad', name: 'Atlas de la Humanidad', category: 'Contenido' },
  { id: 'laboratorio', path: '/laboratorio-etico', name: 'Laboratorio Ético', category: 'Contenido' },
  { id: 'tienda', path: '/tienda', name: 'Tienda', category: 'Tienda' },
  { id: 'diagnostico', path: '/tienda/diagnostico-relacional', name: 'Diagnóstico Relacional', category: 'Tienda' },
  { id: 'radiografia', path: '/tienda/radiografia-premium', name: 'Radiografía Premium', category: 'Tienda' },
  { id: 'identidad-marca', path: '/servicios/identidad-marca', name: 'Identidad de Marca', category: 'Servicios' },
  { id: 'apps-premium', path: '/servicios/apps-premium', name: 'Apps Premium', category: 'Servicios' },
  { id: 'contenido-digital', path: '/servicios/contenido-digital', name: 'Contenido Digital', category: 'Servicios' },
  { id: 'avatares-ia', path: '/servicios/avatares-ia', name: 'Avatares IA', category: 'Servicios' },
  { id: 'consultoria', path: '/servicios/consultoria-psicologica', name: 'Consultoría Psicológica', category: 'Servicios' },
  { id: 'consulta-pareja', path: '/servicios/consulta-pareja', name: 'Consulta de Pareja', category: 'Servicios' },
]

const COLLECTION = 'seo_pages'

export default function AdminSEOPage() {
  const { isAdmin } = useAuth()
  const navigate = useNavigate()
  const [seoData, setSeoData] = useState({})
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [selectedPage, setSelectedPage] = useState(null)
  const [search, setSearch] = useState('')
  const [saveStatus, setSaveStatus] = useState('')
  const [editForm, setEditForm] = useState({})
  const [previewImage, setPreviewImage] = useState(null)
  const fileInputRef = useRef(null)

  useEffect(() => {
    if (!isAdmin) { navigate('/'); return }
    loadAllSEO()
  }, [isAdmin])

  const loadAllSEO = async () => {
    setLoading(true)
    try {
      const snap = await getDoc(doc(db, COLLECTION, 'all'))
      if (snap.exists()) setSeoData(snap.data())
    } catch (e) {
      console.error('Error loading SEO data:', e)
    }
    setLoading(false)
  }

  const selectPage = (page) => {
    setSelectedPage(page)
    const existing = seoData[page.id] || {}
    setEditForm({
      title: existing.title || '',
      description: existing.description || '',
      ogTitle: existing.ogTitle || '',
      ogDescription: existing.ogDescription || '',
      ogImage: existing.ogImage || '',
      slug: existing.slug || page.path,
      keywords: existing.keywords || '',
      canonical: existing.canonical || '',
    })
    setPreviewImage(existing.ogImage || null)
    setSaveStatus('')
  }

  const handleSave = async () => {
    if (!selectedPage) return
    setSaving(true)
    setSaveStatus('')
    try {
      const updated = { ...seoData, [selectedPage.id]: { ...editForm, updatedAt: new Date().toISOString() } }
      await setDoc(doc(db, COLLECTION, 'all'), updated, { merge: true })
      setSeoData(updated)
      setSaveStatus('saved')
      setTimeout(() => setSaveStatus(''), 3000)
    } catch (e) {
      console.error('Error saving SEO:', e)
      setSaveStatus('error')
    }
    setSaving(false)
  }

  const handleImageUrl = (url) => {
    setEditForm(prev => ({ ...prev, ogImage: url }))
    setPreviewImage(url)
  }

  const handleFileUpload = (file) => {
    if (!file) return
    const reader = new FileReader()
    reader.onload = (e) => {
      setPreviewImage(e.target.result)
      setEditForm(prev => ({ ...prev, ogImage: e.target.result }))
    }
    reader.readAsDataURL(file)
  }

  const copyUrl = (path) => {
    navigator.clipboard.writeText(`${SITE_URL}${path}`)
    setSaveStatus('copied')
    setTimeout(() => setSaveStatus(''), 2000)
  }

  if (!isAdmin) return null

  const filteredPages = PAGES.filter(p =>
    p.name.toLowerCase().includes(search.toLowerCase()) ||
    p.path.toLowerCase().includes(search.toLowerCase()) ||
    p.category.toLowerCase().includes(search.toLowerCase())
  )

  const categories = [...new Set(PAGES.map(p => p.category))]

  return (
    <div className="min-h-screen bg-[#0a0a0f] pt-24 pb-20 px-4 sm:px-6">
      <div className="max-w-6xl mx-auto">

        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <button onClick={() => navigate(-1)} className="inline-flex items-center gap-2 text-white/50 hover:text-white/70 text-sm mb-3 transition-colors">
              <ArrowLeft className="w-4 h-4" /> Volver
            </button>
            <h1 className="text-3xl font-light text-white">
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-teal-400">SEO</span> Manager
            </h1>
            <p className="text-white/50 text-sm font-light mt-1">Administra los metadatos de cada página para buscadores y redes sociales</p>
          </div>
          <div className="flex items-center gap-2">
            <Globe className="w-5 h-5 text-emerald-400/50" />
            <span className="text-white/40 text-sm font-light">{PAGES.length} páginas</span>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">

          {/* Sidebar: Page List */}
          <div className="lg:col-span-4 space-y-4">
            {/* Search */}
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/30" />
              <input
                type="text"
                value={search}
                onChange={e => setSearch(e.target.value)}
                placeholder="Buscar página..."
                className="w-full pl-10 pr-4 py-3 bg-white/[0.03] border border-white/10 rounded-xl text-white text-sm placeholder:text-white/25 focus:border-emerald-500/30 focus:outline-none transition-colors"
              />
            </div>

            {/* Pages grouped by category */}
            <div className="space-y-3 max-h-[70vh] overflow-y-auto pr-1">
              {categories.map(cat => {
                const catPages = filteredPages.filter(p => p.category === cat)
                if (catPages.length === 0) return null
                return (
                  <div key={cat}>
                    <p className="text-white/30 text-xs font-semibold uppercase tracking-wider mb-1.5 px-1">{cat}</p>
                    <div className="space-y-1">
                      {catPages.map(page => {
                        const hasSeo = !!seoData[page.id]
                        const isSelected = selectedPage?.id === page.id
                        return (
                          <button
                            key={page.id}
                            onClick={() => selectPage(page)}
                            className={`w-full text-left px-3 py-2.5 rounded-xl transition-all text-sm flex items-center justify-between group ${
                              isSelected
                                ? 'bg-emerald-500/15 border border-emerald-500/25 text-white'
                                : 'bg-white/[0.02] border border-transparent hover:border-white/10 hover:bg-white/[0.04] text-white/70 hover:text-white'
                            }`}
                          >
                            <div className="flex items-center gap-2 min-w-0">
                              <FileText className={`w-3.5 h-3.5 flex-shrink-0 ${isSelected ? 'text-emerald-400' : 'text-white/30'}`} strokeWidth={1.5} />
                              <span className="font-light truncate">{page.name}</span>
                            </div>
                            <div className="flex items-center gap-1.5 flex-shrink-0">
                              {hasSeo && <CheckCircle className="w-3 h-3 text-emerald-400/50" />}
                              <span className="text-[10px] text-white/20 group-hover:text-white/40 hidden sm:inline">{page.path}</span>
                            </div>
                          </button>
                        )
                      })}
                    </div>
                  </div>
                )
              })}
            </div>
          </div>

          {/* Main: Edit Panel */}
          <div className="lg:col-span-8">
            {loading ? (
              <div className="flex items-center justify-center py-32">
                <Loader2 className="w-6 h-6 text-emerald-400/50 animate-spin" />
              </div>
            ) : !selectedPage ? (
              <div className="flex flex-col items-center justify-center py-32 text-center">
                <Globe className="w-12 h-12 text-white/10 mb-4" />
                <p className="text-white/40 text-lg font-light">Selecciona una página para editar su SEO</p>
                <p className="text-white/20 text-sm font-light mt-1">Los cambios se guardan en Firestore y se aplican en tiempo real</p>
              </div>
            ) : (
              <motion.div
                key={selectedPage.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="space-y-6"
              >
                {/* Page header */}
                <div className="flex items-center justify-between">
                  <div>
                    <h2 className="text-xl font-light text-white">{selectedPage.name}</h2>
                    <div className="flex items-center gap-2 mt-1">
                      <button onClick={() => copyUrl(editForm.slug || selectedPage.path)} className="text-emerald-400/60 text-xs hover:text-emerald-400 transition-colors flex items-center gap-1">
                        <Link2 className="w-3 h-3" />
                        {SITE_URL}{editForm.slug || selectedPage.path}
                      </button>
                      <a href={`${SITE_URL}${selectedPage.path}`} target="_blank" rel="noopener noreferrer" className="text-white/30 hover:text-white/60 transition-colors">
                        <ExternalLink className="w-3 h-3" />
                      </a>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <AnimatePresence>
                      {saveStatus === 'saved' && (
                        <motion.span initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="text-emerald-400 text-xs flex items-center gap-1">
                          <CheckCircle className="w-3.5 h-3.5" /> Guardado
                        </motion.span>
                      )}
                      {saveStatus === 'error' && (
                        <motion.span initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="text-red-400 text-xs flex items-center gap-1">
                          <AlertCircle className="w-3.5 h-3.5" /> Error al guardar
                        </motion.span>
                      )}
                      {saveStatus === 'copied' && (
                        <motion.span initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="text-violet-400 text-xs flex items-center gap-1">
                          <Copy className="w-3.5 h-3.5" /> Copiada
                        </motion.span>
                      )}
                    </AnimatePresence>
                    <motion.button
                      onClick={handleSave}
                      disabled={saving}
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 text-white text-sm font-medium hover:from-emerald-500 hover:to-teal-500 transition-all shadow-lg shadow-emerald-600/15 disabled:opacity-50"
                    >
                      {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
                      Guardar
                    </motion.button>
                  </div>
                </div>

                {/* SEO Fields */}
                <div className="space-y-5">

                  {/* Slug */}
                  <div className="rounded-2xl border border-white/10 bg-white/[0.02] p-5 space-y-3">
                    <div className="flex items-center gap-2 mb-1">
                      <Link2 className="w-4 h-4 text-emerald-400/60" />
                      <span className="text-white/80 text-sm font-medium">URL (Slug)</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-white/30 text-sm">{SITE_URL}</span>
                      <input
                        value={editForm.slug || ''}
                        onChange={e => setEditForm(prev => ({ ...prev, slug: e.target.value }))}
                        placeholder={selectedPage.path}
                        className="flex-1 px-3 py-2 bg-white/[0.04] border border-white/10 rounded-lg text-white text-sm placeholder:text-white/20 focus:border-emerald-500/30 focus:outline-none"
                      />
                    </div>
                  </div>

                  {/* Title & Description */}
                  <div className="rounded-2xl border border-white/10 bg-white/[0.02] p-5 space-y-4">
                    <div className="flex items-center gap-2 mb-1">
                      <Search className="w-4 h-4 text-emerald-400/60" />
                      <span className="text-white/80 text-sm font-medium">Buscadores (Google)</span>
                    </div>
                    <div>
                      <label className="text-white/40 text-xs uppercase tracking-wider mb-1.5 block">Título SEO</label>
                      <input
                        value={editForm.title || ''}
                        onChange={e => setEditForm(prev => ({ ...prev, title: e.target.value }))}
                        placeholder="Título que aparece en Google..."
                        className="w-full px-4 py-2.5 bg-white/[0.04] border border-white/10 rounded-lg text-white text-sm placeholder:text-white/20 focus:border-emerald-500/30 focus:outline-none"
                      />
                      <p className="text-white/20 text-xs mt-1">{(editForm.title || '').length}/60 caracteres (recomendado)</p>
                    </div>
                    <div>
                      <label className="text-white/40 text-xs uppercase tracking-wider mb-1.5 block">Meta descripción</label>
                      <textarea
                        value={editForm.description || ''}
                        onChange={e => setEditForm(prev => ({ ...prev, description: e.target.value }))}
                        placeholder="Descripción que aparece bajo el título en Google..."
                        rows={3}
                        className="w-full px-4 py-2.5 bg-white/[0.04] border border-white/10 rounded-lg text-white text-sm placeholder:text-white/20 focus:border-emerald-500/30 focus:outline-none resize-none"
                      />
                      <p className="text-white/20 text-xs mt-1">{(editForm.description || '').length}/160 caracteres (recomendado)</p>
                    </div>
                    <div>
                      <label className="text-white/40 text-xs uppercase tracking-wider mb-1.5 block">Keywords</label>
                      <input
                        value={editForm.keywords || ''}
                        onChange={e => setEditForm(prev => ({ ...prev, keywords: e.target.value }))}
                        placeholder="psicología, pareja, relaciones, amor..."
                        className="w-full px-4 py-2.5 bg-white/[0.04] border border-white/10 rounded-lg text-white text-sm placeholder:text-white/20 focus:border-emerald-500/30 focus:outline-none"
                      />
                    </div>

                    {/* Google Preview */}
                    <div className="p-4 rounded-xl bg-white/[0.03] border border-white/5">
                      <p className="text-white/30 text-[10px] uppercase tracking-wider mb-2">Vista previa en Google</p>
                      <div>
                        <p className="text-blue-400 text-base truncate">{editForm.title || selectedPage.name + ' | Luis Virrueta'}</p>
                        <p className="text-emerald-400/80 text-xs truncate">{SITE_URL}{editForm.slug || selectedPage.path}</p>
                        <p className="text-white/50 text-sm mt-0.5 line-clamp-2">{editForm.description || 'Sin descripción definida'}</p>
                      </div>
                    </div>
                  </div>

                  {/* Open Graph (Social sharing) */}
                  <div className="rounded-2xl border border-white/10 bg-white/[0.02] p-5 space-y-4">
                    <div className="flex items-center gap-2 mb-1">
                      <Globe className="w-4 h-4 text-violet-400/60" />
                      <span className="text-white/80 text-sm font-medium">Redes Sociales (Open Graph)</span>
                    </div>
                    <div>
                      <label className="text-white/40 text-xs uppercase tracking-wider mb-1.5 block">Título OG</label>
                      <input
                        value={editForm.ogTitle || ''}
                        onChange={e => setEditForm(prev => ({ ...prev, ogTitle: e.target.value }))}
                        placeholder={editForm.title || 'Igual al título SEO si se deja vacío...'}
                        className="w-full px-4 py-2.5 bg-white/[0.04] border border-white/10 rounded-lg text-white text-sm placeholder:text-white/20 focus:border-violet-500/30 focus:outline-none"
                      />
                    </div>
                    <div>
                      <label className="text-white/40 text-xs uppercase tracking-wider mb-1.5 block">Descripción OG</label>
                      <textarea
                        value={editForm.ogDescription || ''}
                        onChange={e => setEditForm(prev => ({ ...prev, ogDescription: e.target.value }))}
                        placeholder={editForm.description || 'Igual a la meta descripción si se deja vacío...'}
                        rows={2}
                        className="w-full px-4 py-2.5 bg-white/[0.04] border border-white/10 rounded-lg text-white text-sm placeholder:text-white/20 focus:border-violet-500/30 focus:outline-none resize-none"
                      />
                    </div>
                    <div>
                      <label className="text-white/40 text-xs uppercase tracking-wider mb-1.5 block">Imagen OG (1200×630 recomendado)</label>
                      <div className="flex gap-2">
                        <input
                          value={editForm.ogImage || ''}
                          onChange={e => handleImageUrl(e.target.value)}
                          placeholder="https://... URL de imagen"
                          className="flex-1 px-4 py-2.5 bg-white/[0.04] border border-white/10 rounded-lg text-white text-sm placeholder:text-white/20 focus:border-violet-500/30 focus:outline-none"
                        />
                        <input ref={fileInputRef} type="file" accept="image/*" className="hidden" onChange={e => handleFileUpload(e.target.files?.[0])} />
                        <button
                          onClick={() => fileInputRef.current?.click()}
                          className="px-4 py-2.5 rounded-lg border border-white/10 bg-white/[0.04] text-white/60 hover:text-white hover:border-white/20 text-sm transition-colors flex items-center gap-1.5"
                        >
                          <Image className="w-4 h-4" />
                          Subir
                        </button>
                      </div>
                    </div>

                    {/* Image preview */}
                    {previewImage && (
                      <div className="rounded-xl overflow-hidden border border-white/10">
                        <img
                          src={previewImage}
                          alt="OG Preview"
                          className="w-full aspect-[1200/630] object-cover"
                          onError={() => setPreviewImage(null)}
                        />
                      </div>
                    )}

                    {/* Social share preview */}
                    <div className="p-4 rounded-xl bg-white/[0.03] border border-white/5">
                      <p className="text-white/30 text-[10px] uppercase tracking-wider mb-3">Vista previa al compartir</p>
                      <div className="rounded-xl overflow-hidden border border-white/10 bg-[#1a1a2e]">
                        {previewImage ? (
                          <img src={previewImage} alt="" className="w-full aspect-[1200/630] object-cover" />
                        ) : (
                          <div className="w-full aspect-[1200/630] bg-gradient-to-br from-violet-900/30 to-fuchsia-900/20 flex items-center justify-center">
                            <Image className="w-8 h-8 text-white/10" />
                          </div>
                        )}
                        <div className="p-3 border-t border-white/5">
                          <p className="text-white/30 text-[10px] uppercase">luisvirrueta.com</p>
                          <p className="text-white text-sm font-medium truncate">{editForm.ogTitle || editForm.title || selectedPage.name}</p>
                          <p className="text-white/50 text-xs truncate">{editForm.ogDescription || editForm.description || ''}</p>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Canonical URL */}
                  <div className="rounded-2xl border border-white/10 bg-white/[0.02] p-5">
                    <div className="flex items-center gap-2 mb-3">
                      <Link2 className="w-4 h-4 text-amber-400/60" />
                      <span className="text-white/80 text-sm font-medium">URL Canónica</span>
                      <span className="text-white/20 text-xs">(opcional)</span>
                    </div>
                    <input
                      value={editForm.canonical || ''}
                      onChange={e => setEditForm(prev => ({ ...prev, canonical: e.target.value }))}
                      placeholder={`${SITE_URL}${selectedPage.path}`}
                      className="w-full px-4 py-2.5 bg-white/[0.04] border border-white/10 rounded-lg text-white text-sm placeholder:text-white/20 focus:border-amber-500/30 focus:outline-none"
                    />
                  </div>

                </div>
              </motion.div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
