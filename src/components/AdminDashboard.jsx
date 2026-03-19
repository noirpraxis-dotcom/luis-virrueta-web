import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { getAllUsers, subscribeToUsers, giftProduct, removeProduct, deleteUserAdmin, setUserTestMode } from '../services/firestoreService'
import { createCustomCheckout, createPromoCode, listPromoCodes, deletePromoCode } from '../services/emailApiService'
import { Users, Package, Download, ChevronDown, ChevronUp, Mail, Search, Gift, Trash2, Plus, AlertTriangle, CheckCircle, FileText, BarChart3, Link2, Copy, DollarSign, Tag, Percent, Code2, ExternalLink } from 'lucide-react'

const PRODUCT_OPTIONS = [
  { value: 'radiografia-pareja', label: 'Radiografía de Pareja' },
]
const PACKAGE_OPTIONS = [
  { value: 'descubre', label: 'Descubre (Individual)' },
  { value: 'solo', label: 'Solo (Pareja — tú)' },
  { value: 'losdos', label: 'Los Dos (Pareja — ambos)' },
]

export default function AdminDashboard() {
  const [users, setUsers] = useState([])
  const [loading, setLoading] = useState(true)
  const [expandedUser, setExpandedUser] = useState(null)
  const [searchQuery, setSearchQuery] = useState('')
  const [activeTab, setActiveTab] = useState('clients') // 'clients' | 'gift' | 'pricing' | 'promos' | 'dev'

  // Gift form state
  const [giftEmail, setGiftEmail] = useState('')
  const [giftProduct, setGiftProductState] = useState('radiografia-pareja')
  const [giftPackage, setGiftPackage] = useState('descubre')
  const [giftLoading, setGiftLoading] = useState(false)
  const [giftMessage, setGiftMessage] = useState(null) // { type: 'success' | 'error', text }

  // Remove product state
  const [removingId, setRemovingId] = useState(null)

  // Delete user state
  const [deletingUserId, setDeletingUserId] = useState(null)

  // Test mode toggle state
  const [togglingTestMode, setTogglingTestMode] = useState(null)

  // Custom pricing state
  const [pricingEmail, setPricingEmail] = useState('')
  const [pricingPackage, setPricingPackage] = useState('descubre')
  const [pricingAmount, setPricingAmount] = useState('')
  const [pricingLoading, setPricingLoading] = useState(false)
  const [pricingResult, setPricingResult] = useState(null) // { type, text, url? }
  const [copiedLink, setCopiedLink] = useState(false)

  // Promo codes state
  const [promoCode, setPromoCode] = useState('')
  const [promoDiscount, setPromoDiscount] = useState('')
  const [promoFree, setPromoFree] = useState(false)
  const [promoLabel, setPromoLabel] = useState('')
  const [promoLoading, setPromoLoading] = useState(false)
  const [promoMessage, setPromoMessage] = useState(null)
  const [promoList, setPromoList] = useState({ builtIn: {}, custom: {} })
  const [promoListLoaded, setPromoListLoaded] = useState(false)

  useEffect(() => {
    const unsubscribe = subscribeToUsers((data) => {
      setUsers(data)
      setLoading(false)
    })
    return () => unsubscribe()
  }, [])

  const loadUsers = async () => {
    try {
      const data = await getAllUsers()
      setUsers(data)
    } catch (err) {
      console.error('Error loading admin data:', err)
    } finally {
      setLoading(false)
    }
  }

  const ADMIN_EMAIL = 'luis.virrueta.contacto@gmail.com'

  const filteredUsers = users.filter(u =>
    u.email !== ADMIN_EMAIL && (
    !searchQuery ||
    (u.displayName || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
    (u.email || '').toLowerCase().includes(searchQuery.toLowerCase())
    )
  )

  const clientUsers = users.filter(u => u.email !== ADMIN_EMAIL)
  const totalPurchases = clientUsers.reduce((sum, u) => sum + (u.purchases?.length || 0), 0)
  const completedPurchases = clientUsers.reduce((sum, u) => sum + (u.purchases?.filter(p => p.status === 'completed').length || 0), 0)

  // Question texts for formatted download
  const QUESTION_MAP = {
    Q1: 'Para empezar, cuéntame un poco sobre tu vida actualmente y en qué momento te encuentras hoy.',
    Q2: 'Cuéntame la historia de tu relación desde el principio hasta hoy.',
    Q3: 'Cuéntame cómo describirías tu relación actualmente y cómo sientes que están las cosas.',
    Q4: 'Háblame de cómo es la vida cotidiana entre ustedes y cómo suelen relacionarse en el día a día.',
    Q5: 'Cuéntame qué sientes que han construido o desarrollado como pareja a lo largo del tiempo.',
    Q6: 'Cuéntame qué fue lo que más te llamó la atención de tu pareja cuando empezaron a conocerse.',
    Q7: 'Cuéntame cómo se demuestran cariño o amor entre ustedes en el día a día.',
    Q8: 'Cuéntame qué momentos o etapas recuerdas como especialmente importantes.',
    Q9: 'Cuéntame cómo imaginabas que podría ser el futuro entre ustedes.',
    Q10: 'Cuéntame qué representaba esa persona para ti o qué sentías que encontrabas en esa relación.',
    Q11: 'Cuéntame sobre el ambiente en el que creciste y cómo era la relación entre las personas que te criaron.',
    Q12: 'Cuéntame qué ideas o creencias sobre el amor sientes que aprendiste en tu familia.',
    Q13: 'Cuéntame si algo de tu familia aparece en tu forma de relacionarte con tu pareja.',
    Q14: 'Cuéntame cómo fueron tus relaciones importantes anteriores y qué aprendiste de ellas.',
    Q15: 'Cuéntame qué tanto sientes que puedes ser tú mismo/a sin perder tu identidad.',
    Q16: 'Cuéntame si sienten que funcionan como equipo cuando las cosas se ponen difíciles.',
    Q17: 'Cuéntame cómo suelen empezar los desacuerdos o discusiones.',
    Q18: 'Cuéntame cómo reaccionas tú normalmente cuando aparece un conflicto.',
    Q19: 'Cuéntame cómo suele reaccionar tu pareja ante un desacuerdo.',
    Q20: 'Cuéntame qué suele pasar después de una discusión o desacuerdo.',
    Q21: 'Cuéntame qué cosas de tu pareja siguen despertando atracción o deseo en ti.',
    Q22: 'Cuéntame cómo describirías la cercanía emocional que existe entre ustedes.',
    Q23: 'Háblame de cómo se vive actualmente la intimidad física o sexual entre ustedes.',
    Q24: 'Cuéntame cómo ha cambiado el deseo o la atracción desde el inicio hasta hoy.',
    Q25: 'Cuéntame qué cosas suelen hacer que se sientan más cercanos o conectados.',
    Q26: 'Cuéntame si hay momentos en los que sientes más distancia entre ustedes.',
    Q27: 'Cuéntame cómo suelen manejar las decisiones importantes.',
    Q28: 'Cuéntame si sientes que hay equilibrio en el poder y la influencia entre ustedes.',
    Q29: 'Cuéntame qué crees que es importante para tu pareja dentro de la relación.',
    Q30: 'Cuéntame qué cosas son importantes para ti dentro de la relación.',
    Q31: 'Cuéntame qué significa hoy esta relación para ti dentro de tu vida.',
    Q32: 'Cuéntame cómo imaginas la relación entre ustedes con el paso del tiempo.',
    Q33: 'Cuéntame qué cosas concretas te hacen sentir amado/a o seguro/a.',
    Q34: 'Cuéntame si hay cosas dentro de la relación que te generan dudas o incertidumbre.',
    Q35: 'Cuéntame cómo han logrado atravesar los momentos difíciles.',
    Q36: 'Cuéntame si sienten que la relación tiene momentos de novedad o se ha vuelto rutinaria.',
    Q37: 'Cuéntame qué crees que busca cada uno dentro de esta relación.',
    Q38: 'Cuéntame qué crees que esta relación ha despertado o revelado en ti como persona.',
    Q39: 'Cuéntame qué hace única o particular tu relación con esta persona.',
    Q40: 'Cuéntame si hay algo importante que todavía no has mencionado y te gustaría compartir.',
  }

  const BLOCK_MAP = {
    Q1: 'Contexto personal', Q2: 'Contexto personal', Q3: 'Contexto personal', Q4: 'Contexto personal', Q5: 'Contexto personal',
    Q6: 'Origen del vínculo', Q7: 'Expresión afectiva', Q8: 'Origen del vínculo', Q9: 'Origen del vínculo', Q10: 'Origen del vínculo',
    Q11: 'Historia emocional', Q12: 'Historia emocional', Q13: 'Historia emocional', Q14: 'Historia emocional',
    Q15: 'Identidad y autonomía', Q16: 'Regulación emocional', Q17: 'Patrones relacionales', Q18: 'Patrones relacionales', Q19: 'Patrones relacionales', Q20: 'Patrones relacionales',
    Q21: 'Deseo e intimidad', Q22: 'Deseo e intimidad', Q23: 'Deseo e intimidad', Q24: 'Deseo e intimidad', Q25: 'Deseo e intimidad',
    Q26: 'Deseo e intimidad', Q27: 'Deseo e intimidad', Q28: 'Dinámicas de poder', Q29: 'Deseo e intimidad', Q30: 'Deseo e intimidad',
    Q31: 'Futuro y sentido', Q32: 'Futuro y sentido', Q33: 'Seguridad emocional', Q34: 'Futuro y sentido', Q35: 'Futuro y sentido',
    Q36: 'Novedad y rutina', Q37: 'Futuro y sentido', Q38: 'Futuro y sentido', Q39: 'Futuro y sentido', Q40: 'Futuro y sentido',
  }

  const BLOCK_COLORS = {
    'Contexto personal': '#818cf8',
    'Origen del vínculo': '#c084fc',
    'Expresión afectiva': '#f472b6',
    'Historia emocional': '#fb923c',
    'Identidad y autonomía': '#fbbf24',
    'Regulación emocional': '#34d399',
    'Patrones relacionales': '#22d3ee',
    'Deseo e intimidad': '#60a5fa',
    'Dinámicas de poder': '#a78bfa',
    'Seguridad emocional': '#e879f9',
    'Novedad y rutina': '#f87171',
    'Futuro y sentido': '#4ade80',
  }

  const downloadPurchaseData = (user, purchase) => {
    const name = user.displayName || user.email || 'Usuario'
    const pkg = purchase.packageType || 'N/A'
    const progress = purchase.currentQuestion || 0
    const responses = purchase.responses || {}
    const profile = purchase.profileData || {}
    const answered = Object.keys(responses).length

    let questionsHtml = ''
    for (let i = 1; i <= 40; i++) {
      const qid = `Q${i}`
      const text = QUESTION_MAP[qid] || qid
      const block = BLOCK_MAP[qid] || ''
      const blockColor = BLOCK_COLORS[block] || '#666'
      const response = responses[qid]
      const hasResponse = response && (typeof response === 'string' ? response.trim() : true)
      const responseText = hasResponse ? (typeof response === 'string' ? response : JSON.stringify(response)) : '— Sin respuesta —'
      const bgColor = hasResponse ? '#1a1a2e' : '#111'
      const borderColor = hasResponse ? blockColor : '#333'
      const responseColor = hasResponse ? '#e2e8f0' : '#555'

      questionsHtml += `
        <div style="margin-bottom:16px;padding:14px 18px;background:${bgColor};border-left:4px solid ${borderColor};border-radius:8px;">
          <div style="display:flex;align-items:center;gap:10px;margin-bottom:6px;">
            <span style="background:${blockColor};color:#fff;font-size:11px;font-weight:700;padding:2px 8px;border-radius:12px;">${qid}</span>
            <span style="color:${blockColor};font-size:11px;font-weight:600;">${block}</span>
          </div>
          <p style="color:#a5b4fc;font-size:13px;font-weight:600;margin:0 0 8px 0;">${text}</p>
          <p style="color:${responseColor};font-size:13px;line-height:1.6;margin:0;white-space:pre-wrap;">${responseText.replace(/</g, '&lt;').replace(/>/g, '&gt;')}</p>
        </div>`
    }

    const profileHtml = profile.name || profile.email ? `
      <div style="background:#1a1a2e;border:1px solid #333;border-radius:12px;padding:16px 20px;margin-bottom:24px;">
        <h3 style="color:#a78bfa;font-size:14px;margin:0 0 10px 0;">Perfil del usuario</h3>
        ${profile.name ? `<p style="color:#ccc;font-size:12px;margin:4px 0;">Nombre: <strong style="color:#fff;">${profile.name}</strong></p>` : ''}
        ${profile.email ? `<p style="color:#ccc;font-size:12px;margin:4px 0;">Email: <strong style="color:#fff;">${profile.email}</strong></p>` : ''}
        ${profile.age ? `<p style="color:#ccc;font-size:12px;margin:4px 0;">Edad: <strong style="color:#fff;">${profile.age}</strong></p>` : ''}
        ${profile.gender ? `<p style="color:#ccc;font-size:12px;margin:4px 0;">Género: <strong style="color:#fff;">${profile.gender}</strong></p>` : ''}
      </div>` : ''

    const html = `<!DOCTYPE html>
<html lang="es"><head><meta charset="UTF-8"><title>Radiografía — ${name}</title>
<style>*{margin:0;padding:0;box-sizing:border-box}body{background:#0a0a1a;color:#e2e8f0;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,sans-serif;padding:40px;max-width:900px;margin:0 auto}
@media print{body{background:#fff;color:#222;padding:20px}div[style*="background:#1a1a2e"]{background:#f5f5ff!important}p{color:#222!important}}</style></head>
<body>
  <div style="text-align:center;margin-bottom:36px;">
    <h1 style="font-size:24px;color:#a78bfa;margin-bottom:4px;">Radiografía de Pareja</h1>
    <p style="color:#888;font-size:13px;">${name} — Paquete: ${pkg} — Progreso: ${progress}/40 (${answered} respondidas)</p>
    ${purchase.partnerEmail ? `<p style="color:#f472b6;font-size:12px;margin-top:4px;">Pareja: ${purchase.partnerEmail}</p>` : ''}
    <p style="color:#555;font-size:11px;margin-top:8px;">Generado: ${new Date().toLocaleDateString('es-MX', { year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit' })}</p>
  </div>
  ${profileHtml}
  <h2 style="color:#818cf8;font-size:16px;margin-bottom:16px;border-bottom:1px solid #222;padding-bottom:8px;">Preguntas y Respuestas</h2>
  ${questionsHtml}
</body></html>`

    const blob = new Blob([html], { type: 'text/html;charset=utf-8' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `${name.replace(/\s+/g, '-')}-radiografia-${purchase.id.slice(0, 6)}.html`
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)
  }

  const downloadAllUserData = (user) => {
    const data = JSON.stringify(user, null, 2)
    const blob = new Blob([data], { type: 'application/json' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `user-${user.displayName || user.email || user.id}.json`
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)
  }

  const handleGiftProduct = async () => {
    if (!giftEmail.includes('@')) {
      setGiftMessage({ type: 'error', text: 'Ingresa un email válido' })
      return
    }
    setGiftLoading(true)
    setGiftMessage(null)
    try {
      await giftProduct(giftEmail, giftProduct, giftPackage)
      setGiftMessage({ type: 'success', text: `Producto asignado a ${giftEmail}` })
      setGiftEmail('')
      await loadUsers() // Refresh
    } catch (err) {
      setGiftMessage({ type: 'error', text: err.message || 'Error al asignar producto' })
    } finally {
      setGiftLoading(false)
    }
  }

  const handleRemoveProduct = async (uid, purchaseId) => {
    if (!confirm('¿Seguro que quieres eliminar este producto del usuario?')) return
    setRemovingId(purchaseId)
    try {
      await removeProduct(uid, purchaseId)
      await loadUsers()
    } catch (err) {
      console.error('Error removing product:', err)
    } finally {
      setRemovingId(null)
    }
  }

  const handleDeleteUser = async (uid, displayName) => {
    if (!confirm(`¿Eliminar al usuario "${displayName || uid}"? Se borrarán todos sus datos y compras.`)) return
    setDeletingUserId(uid)
    try {
      await deleteUserAdmin(uid)
      await loadUsers()
    } catch (err) {
      console.error('Error deleting user:', err)
    } finally {
      setDeletingUserId(null)
    }
  }

  const handleToggleTestMode = async (uid, currentValue) => {
    setTogglingTestMode(uid)
    try {
      await setUserTestMode(uid, !currentValue)
      setUsers(prev => prev.map(u => u.id === uid ? { ...u, testMode: !currentValue } : u))
    } catch (err) {
      console.error('Error toggling test mode:', err)
    } finally {
      setTogglingTestMode(null)
    }
  }

  const handleCreatePricingLink = async () => {
    if (!pricingEmail.includes('@')) {
      setPricingResult({ type: 'error', text: 'Ingresa un email válido' })
      return
    }
    const amountNum = parseFloat(pricingAmount)
    if (!amountNum || amountNum < 1) {
      setPricingResult({ type: 'error', text: 'Ingresa un precio válido (mínimo $1 MXN)' })
      return
    }
    setPricingLoading(true)
    setPricingResult(null)
    setCopiedLink(false)
    try {
      const result = await createCustomCheckout({
        email: pricingEmail.trim(),
        packageType: pricingPackage,
        customPriceCents: Math.round(amountNum * 100),
        adminSecret: import.meta.env.VITE_ADMIN_SECRET,
      })
      setPricingResult({ type: 'success', text: `Enlace creado para ${pricingEmail}`, url: result.url })
    } catch (err) {
      setPricingResult({ type: 'error', text: err.message || 'Error al crear enlace' })
    } finally {
      setPricingLoading(false)
    }
  }

  const handleCopyLink = () => {
    if (pricingResult?.url) {
      navigator.clipboard.writeText(pricingResult.url)
      setCopiedLink(true)
      setTimeout(() => setCopiedLink(false), 2000)
    }
  }

  const loadPromos = async () => {
    try {
      const data = await listPromoCodes(import.meta.env.VITE_ADMIN_SECRET)
      setPromoList(data)
      setPromoListLoaded(true)
    } catch (err) {
      console.error('Error loading promo codes:', err)
    }
  }

  const handleCreatePromo = async () => {
    if (!promoCode || promoCode.length < 2) {
      setPromoMessage({ type: 'error', text: 'El código debe tener al menos 2 caracteres' })
      return
    }
    if (!promoFree && (!promoDiscount || Number(promoDiscount) < 1 || Number(promoDiscount) > 100)) {
      setPromoMessage({ type: 'error', text: 'Descuento debe ser entre 1% y 100%' })
      return
    }
    setPromoLoading(true)
    setPromoMessage(null)
    try {
      await createPromoCode({
        code: promoCode.trim(),
        discountPercent: promoFree ? 100 : Number(promoDiscount),
        free: promoFree,
        label: promoLabel || promoCode.toUpperCase(),
        adminSecret: import.meta.env.VITE_ADMIN_SECRET,
      })
      setPromoMessage({ type: 'success', text: `Código ${promoCode.toUpperCase()} creado` })
      setPromoCode('')
      setPromoDiscount('')
      setPromoLabel('')
      setPromoFree(false)
      await loadPromos()
    } catch (err) {
      setPromoMessage({ type: 'error', text: err.message || 'Error al crear código' })
    } finally {
      setPromoLoading(false)
    }
  }

  const handleDeletePromo = async (code) => {
    if (!confirm(`¿Eliminar código ${code}?`)) return
    try {
      await deletePromoCode({ code, adminSecret: import.meta.env.VITE_ADMIN_SECRET })
      await loadPromos()
    } catch (err) {
      console.error('Error deleting promo:', err)
    }
  }

  if (loading) {
    return (
      <div className="bg-amber-500/5 border border-amber-500/20 rounded-2xl p-8 text-center">
        <div className="w-8 h-8 border-2 border-amber-500 border-t-transparent rounded-full animate-spin mx-auto" />
        <p className="text-amber-300/60 text-xs mt-3">Cargando datos de admin...</p>
      </div>
    )
  }

  return (
    <div className="bg-amber-500/5 border border-amber-500/20 rounded-2xl p-5">
      <h3 className="text-amber-300 text-sm font-medium mb-4 flex items-center gap-2">
        <Users className="w-4 h-4" />
        Panel de Administrador
      </h3>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-3 mb-5">
        <div className="bg-black/30 rounded-xl p-3 text-center">
          <p className="text-2xl text-white font-light">{clientUsers.length}</p>
          <p className="text-[10px] text-gray-500 uppercase tracking-wider">Usuarios</p>
        </div>
        <div className="bg-black/30 rounded-xl p-3 text-center">
          <p className="text-2xl text-white font-light">{totalPurchases}</p>
          <p className="text-[10px] text-gray-500 uppercase tracking-wider">Compras</p>
        </div>
        <div className="bg-black/30 rounded-xl p-3 text-center">
          <p className="text-2xl text-white font-light">{completedPurchases}</p>
          <p className="text-[10px] text-gray-500 uppercase tracking-wider">Completados</p>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex gap-2 mb-4">
        <button onClick={() => setActiveTab('clients')}
          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs transition-all ${
            activeTab === 'clients' ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30' : 'bg-black/20 text-gray-500 border border-white/5 hover:text-gray-300'
          }`}>
          <Users className="w-3 h-3" /> Clientes
        </button>
        <button onClick={() => setActiveTab('gift')}
          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs transition-all ${
            activeTab === 'gift' ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30' : 'bg-black/20 text-gray-500 border border-white/5 hover:text-gray-300'
          }`}>
          <Gift className="w-3 h-3" /> Regalar producto
        </button>
        <button onClick={() => setActiveTab('pricing')}
          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs transition-all ${
            activeTab === 'pricing' ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30' : 'bg-black/20 text-gray-500 border border-white/5 hover:text-gray-300'
          }`}>
          <DollarSign className="w-3 h-3" /> Precio custom
        </button>
        <button onClick={() => { setActiveTab('promos'); if (!promoListLoaded) loadPromos() }}
          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs transition-all ${
            activeTab === 'promos' ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30' : 'bg-black/20 text-gray-500 border border-white/5 hover:text-gray-300'
          }`}>
          <Tag className="w-3 h-3" /> Códigos promo
        </button>
        <button onClick={() => setActiveTab('dev')}
          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs transition-all ${
            activeTab === 'dev' ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30' : 'bg-black/20 text-gray-500 border border-white/5 hover:text-gray-300'
          }`}>
          <Code2 className="w-3 h-3" /> Desarrollador
        </button>
      </div>

      {/* ─── TAB: CLIENTS ─── */}
      {activeTab === 'clients' && (
        <>
          <div className="relative mb-4">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
            <input type="text" placeholder="Buscar por nombre o email..."
              value={searchQuery} onChange={e => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 bg-black/30 border border-white/10 rounded-xl text-white text-sm placeholder-gray-500 focus:border-amber-500/30 focus:outline-none" />
          </div>

          <div className="space-y-2 max-h-[600px] overflow-y-auto">
            {filteredUsers.map(u => {
              const isExpanded = expandedUser === u.id
              return (
                <div key={u.id} className="bg-black/20 border border-white/5 rounded-xl overflow-hidden">
                  <button onClick={() => setExpandedUser(isExpanded ? null : u.id)}
                    className="w-full flex items-center justify-between px-4 py-3 text-left hover:bg-white/[0.02] transition-colors">
                    <div className="flex items-center gap-3 min-w-0">
                      <div className="w-8 h-8 rounded-full bg-purple-500/10 border border-purple-500/20 flex items-center justify-center flex-shrink-0">
                        <span className="text-xs text-purple-300">{(u.displayName || u.email || '?').charAt(0).toUpperCase()}</span>
                      </div>
                      <div className="min-w-0">
                        <p className="text-sm text-white truncate">{u.displayName || 'Sin nombre'}</p>
                        <p className="text-xs text-gray-500 truncate">{u.email}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2 flex-shrink-0">
                      {u.provider === 'google.com' ? (
                        <span className="text-[10px] px-1.5 py-0.5 rounded bg-blue-500/10 text-blue-400 border border-blue-500/20">Google</span>
                      ) : u.provider === 'password' ? (
                        <span className="text-[10px] px-1.5 py-0.5 rounded bg-purple-500/10 text-purple-400 border border-purple-500/20">Email</span>
                      ) : null}
                      {u.emailVerified ? (
                        <span className="text-[10px] px-1.5 py-0.5 rounded bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">Verificado</span>
                      ) : (
                        <span className="text-[10px] px-1.5 py-0.5 rounded bg-yellow-500/10 text-yellow-400 border border-yellow-500/20">No verificado</span>
                      )}
                      <span className="text-xs text-gray-500">{u.purchases?.length || 0} compras</span>
                      {isExpanded ? <ChevronUp className="w-4 h-4 text-gray-500" /> : <ChevronDown className="w-4 h-4 text-gray-500" />}
                    </div>
                  </button>

                  <AnimatePresence>
                    {isExpanded && (
                      <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }}
                        className="border-t border-white/5 overflow-hidden">
                        <div className="px-4 pb-4">
                          <div className="flex items-center gap-2 mt-3 mb-3">
                            <p className="text-[10px] text-gray-600 font-mono">UID: {u.id}</p>
                            <button onClick={() => downloadAllUserData(u)}
                              className="ml-auto flex items-center gap-1 text-xs text-amber-400 hover:text-amber-300 transition-colors">
                              <Download className="w-3 h-3" /> Todo
                            </button>
                          </div>

                          {/* Admin actions: test mode + delete */}
                          <div className="flex items-center gap-3 mb-3 p-2.5 rounded-lg bg-black/30 border border-white/5">
                            {/* Test mode toggle */}
                            <div className="flex items-center gap-2 flex-1">
                              <span className="text-[10px] text-gray-400">Modo prueba</span>
                              <button
                                onClick={() => handleToggleTestMode(u.id, u.testMode)}
                                disabled={togglingTestMode === u.id}
                                className={`relative w-9 h-5 rounded-full transition-colors flex-shrink-0 disabled:opacity-50 ${u.testMode ? 'bg-amber-500' : 'bg-white/15'}`}>
                                <span className={`absolute top-0.5 left-0.5 w-4 h-4 rounded-full bg-white shadow transition-transform ${u.testMode ? 'translate-x-4' : 'translate-x-0'}`} />
                              </button>
                              {u.testMode && <span className="text-[10px] text-amber-400">Activo</span>}
                            </div>
                            {/* Delete user — hide for admin's own account */}
                            {u.email !== 'luis.virrueta.contacto@gmail.com' && (
                            <button
                              onClick={() => handleDeleteUser(u.id, u.displayName || u.email)}
                              disabled={deletingUserId === u.id}
                              className="flex items-center gap-1 text-[10px] text-red-400/60 hover:text-red-300 transition-colors disabled:opacity-40">
                              <Trash2 className="w-3 h-3" />
                              {deletingUserId === u.id ? 'Eliminando...' : 'Eliminar usuario'}
                            </button>)}
                          </div>

                          {u.purchases?.length > 0 ? (
                            <div className="space-y-3">
                              {u.purchases.map(p => (
                                <div key={p.id} className="bg-white/[0.02] border border-white/5 rounded-lg p-3">
                                  {/* Header */}
                                  <div className="flex justify-between items-start mb-2">
                                    <div>
                                      <span className="text-xs text-white font-medium">{p.product}</span>
                                      <span className="text-xs text-gray-500 ml-2">— {p.packageType}</span>
                                      {p.source === 'gift' && (
                                        <span className="text-[10px] px-1.5 py-0.5 ml-2 rounded bg-amber-500/15 text-amber-300">regalo</span>
                                      )}
                                    </div>
                                    <span className={`text-[10px] px-2 py-0.5 rounded-full ${
                                      p.status === 'completed' ? 'bg-emerald-500/10 text-emerald-400' :
                                      p.status === 'in-progress' ? 'bg-blue-500/10 text-blue-400' :
                                      p.status === 'paid' ? 'bg-violet-500/10 text-violet-400' :
                                      'bg-gray-500/10 text-gray-400'
                                    }`}>{p.status}</span>
                                  </div>

                                  {/* Progress — always visible */}
                                  <div className="mb-2">
                                    <div className="flex justify-between text-[10px] text-gray-500 mb-0.5">
                                      <span>Pregunta {p.currentQuestion || 0}/40</span>
                                      <span>{Math.round(((p.currentQuestion || 0) / 40) * 100)}%</span>
                                    </div>
                                    <div className="h-1.5 bg-white/5 rounded-full overflow-hidden">
                                      <div className={`h-full rounded-full transition-all ${(p.currentQuestion || 0) >= 40 ? 'bg-gradient-to-r from-emerald-500 to-green-400' : 'bg-gradient-to-r from-purple-500 to-fuchsia-500'}`}
                                        style={{ width: `${((p.currentQuestion || 0) / 40) * 100}%` }} />
                                    </div>
                                    <div className="flex justify-between text-[9px] text-gray-600 mt-0.5">
                                      <span>{Object.keys(p.responses || {}).length} respuestas grabadas</span>
                                      {p.status === 'completed' && <span className="text-emerald-400">✓ Completado</span>}
                                    </div>
                                  </div>

                                  {/* Partner info */}
                                  {p.partnerEmail && (
                                    <p className="text-[10px] text-pink-400/60 mb-1 flex items-center gap-1">
                                      <Mail className="w-3 h-3" /> Pareja: {p.partnerEmail}
                                    </p>
                                  )}

                                  {/* Responses */}
                                  {p.responses && Object.keys(p.responses).length > 0 && (
                                    <details className="mt-2">
                                      <summary className="text-[10px] text-amber-400 cursor-pointer hover:text-amber-300 flex items-center gap-1">
                                        <FileText className="w-3 h-3" /> Ver respuestas ({Object.keys(p.responses).length})
                                      </summary>
                                      <div className="mt-1 space-y-1 max-h-48 overflow-auto bg-black/30 rounded p-2">
                                        {Object.entries(p.responses).map(([q, r]) => (
                                          <div key={q} className="text-[9px]">
                                            <span className="text-violet-300/60 font-medium">{q}:</span>
                                            <span className="text-gray-400 ml-1">{typeof r === 'string' ? r.slice(0, 200) : JSON.stringify(r).slice(0, 200)}</span>
                                          </div>
                                        ))}
                                      </div>
                                    </details>
                                  )}

                                  {/* Analysis */}
                                  {p.analysis && (
                                    <details className="mt-2">
                                      <summary className="text-[10px] text-emerald-400 cursor-pointer hover:text-emerald-300 flex items-center gap-1">
                                        <BarChart3 className="w-3 h-3" /> Ver análisis
                                      </summary>
                                      <pre className="mt-1 text-[9px] text-gray-500 max-h-48 overflow-auto bg-black/30 rounded p-2">
                                        {JSON.stringify(p.analysis, null, 2).slice(0, 5000)}
                                      </pre>
                                    </details>
                                  )}

                                  {p.crossAnalysis && (
                                    <p className="text-[10px] text-pink-400 mt-1">✓ Análisis cruzado</p>
                                  )}

                                  {/* Actions */}
                                  <div className="flex items-center gap-2 mt-2 pt-2 border-t border-white/5">
                                    <button onClick={() => downloadPurchaseData(u, p)}
                                      className="flex items-center gap-1 text-[10px] text-amber-400 hover:text-amber-300 transition-colors">
                                      <Download className="w-3 h-3" /> Descargar
                                    </button>
                                    {p.source === 'gift' && (
                                      <button onClick={() => handleRemoveProduct(u.id, p.id)}
                                        disabled={removingId === p.id}
                                        className="flex items-center gap-1 text-[10px] text-red-400 hover:text-red-300 transition-colors ml-auto disabled:opacity-40">
                                        <Trash2 className="w-3 h-3" /> {removingId === p.id ? 'Eliminando...' : 'Quitar'}
                                      </button>
                                    )}
                                  </div>
                                </div>
                              ))}
                            </div>
                          ) : (
                            <p className="text-xs text-gray-500 py-2">Sin compras</p>
                          )}
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              )
            })}
            {filteredUsers.length === 0 && (
              <p className="text-xs text-gray-500 text-center py-4">No se encontraron usuarios</p>
            )}
          </div>
        </>
      )}

      {/* ─── TAB: GIFT PRODUCTS ─── */}
      {activeTab === 'gift' && (
        <div className="space-y-4">
          <p className="text-gray-400 text-xs leading-relaxed">
            Asigna un producto a un usuario por su email. Si el usuario ya tiene cuenta, se le añadirá al dashboard. Si no, se creará una entrada pendiente que aparecerá cuando se registre con ese email.
          </p>

          <div className="bg-black/20 border border-white/5 rounded-xl p-4 space-y-3">
            <div>
              <label className="text-white/60 text-xs uppercase tracking-wider mb-1.5 block">Email del usuario</label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
                <input type="email" value={giftEmail} onChange={e => setGiftEmail(e.target.value)}
                  placeholder="usuario@email.com"
                  className="w-full pl-10 pr-4 py-2.5 bg-black/30 border border-white/10 rounded-xl text-white text-sm placeholder-gray-500 focus:border-amber-500/30 focus:outline-none" />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-white/60 text-xs uppercase tracking-wider mb-1.5 block">Producto</label>
                <select value={giftProduct} onChange={e => setGiftProductState(e.target.value)}
                  className="w-full px-3 py-2.5 bg-black/30 border border-white/10 rounded-xl text-white text-sm focus:border-amber-500/30 focus:outline-none">
                  {PRODUCT_OPTIONS.map(o => <option key={o.value} value={o.value}>{o.label}</option>)}
                </select>
              </div>
              <div>
                <label className="text-white/60 text-xs uppercase tracking-wider mb-1.5 block">Paquete</label>
                <select value={giftPackage} onChange={e => setGiftPackage(e.target.value)}
                  className="w-full px-3 py-2.5 bg-black/30 border border-white/10 rounded-xl text-white text-sm focus:border-amber-500/30 focus:outline-none">
                  {PACKAGE_OPTIONS.map(o => <option key={o.value} value={o.value}>{o.label}</option>)}
                </select>
              </div>
            </div>

            <button onClick={handleGiftProduct} disabled={giftLoading || !giftEmail.includes('@')}
              className="w-full flex items-center justify-center gap-2 py-2.5 rounded-xl bg-gradient-to-r from-amber-500 to-orange-500 text-zinc-900 text-sm font-medium hover:from-amber-400 hover:to-orange-400 transition-all disabled:opacity-40">
              {giftLoading ? <div className="w-4 h-4 border-2 border-zinc-900/30 border-t-zinc-900 rounded-full animate-spin" /> :
                <><Gift className="w-4 h-4" /> Asignar producto</>}
            </button>

            {giftMessage && (
              <div className={`flex items-center gap-2 px-3 py-2 rounded-lg text-xs ${
                giftMessage.type === 'success' ? 'bg-emerald-500/10 border border-emerald-500/20 text-emerald-300' :
                'bg-red-500/10 border border-red-500/20 text-red-300'
              }`}>
                {giftMessage.type === 'success' ? <CheckCircle className="w-3.5 h-3.5" /> : <AlertTriangle className="w-3.5 h-3.5" />}
                {giftMessage.text}
              </div>
            )}
          </div>

          {/* Quick list of gifted products across all users */}
          <div>
            <p className="text-amber-300/60 text-xs uppercase tracking-wider mb-2">Productos regalados</p>
            <div className="space-y-1 max-h-60 overflow-y-auto">
              {users.flatMap(u => (u.purchases || []).filter(p => p.source === 'gift').map(p => ({ ...p, userName: u.displayName || u.email, uid: u.id }))).length === 0 ? (
                <p className="text-xs text-gray-600 py-2">Ningún producto regalado aún</p>
              ) : (
                users.flatMap(u => (u.purchases || []).filter(p => p.source === 'gift').map(p => ({ ...p, userName: u.displayName || u.email, uid: u.id }))).map(p => (
                  <div key={p.id} className="flex items-center justify-between bg-black/20 border border-white/5 rounded-lg px-3 py-2">
                    <div>
                      <span className="text-xs text-white">{p.userName}</span>
                      <span className="text-[10px] text-gray-500 ml-2">{p.product} — {p.packageType}</span>
                    </div>
                    <button onClick={() => handleRemoveProduct(p.uid, p.id)}
                      disabled={removingId === p.id}
                      className="text-[10px] text-red-400 hover:text-red-300 transition-colors disabled:opacity-40">
                      {removingId === p.id ? '...' : <Trash2 className="w-3 h-3" />}
                    </button>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      )}

      {/* ─── TAB: CUSTOM PRICING ─── */}
      {activeTab === 'pricing' && (
        <div className="space-y-4">
          <p className="text-gray-400 text-xs leading-relaxed">
            Genera un enlace de pago con precio personalizado para un usuario. El enlace abrirá un checkout de Stripe con el monto indicado.
          </p>

          <div className="bg-black/20 border border-white/5 rounded-xl p-4 space-y-3">
            <div>
              <label className="text-white/60 text-xs uppercase tracking-wider mb-1.5 block">Email del cliente</label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
                <input type="email" value={pricingEmail} onChange={e => setPricingEmail(e.target.value)}
                  placeholder="cliente@email.com"
                  className="w-full pl-10 pr-4 py-2.5 bg-black/30 border border-white/10 rounded-xl text-white text-sm placeholder-gray-500 focus:border-amber-500/30 focus:outline-none" />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-white/60 text-xs uppercase tracking-wider mb-1.5 block">Paquete</label>
                <select value={pricingPackage} onChange={e => setPricingPackage(e.target.value)}
                  className="w-full px-3 py-2.5 bg-black/30 border border-white/10 rounded-xl text-white text-sm focus:border-amber-500/30 focus:outline-none">
                  {PACKAGE_OPTIONS.map(o => <option key={o.value} value={o.value}>{o.label}</option>)}
                </select>
              </div>
              <div>
                <label className="text-white/60 text-xs uppercase tracking-wider mb-1.5 block">Precio (MXN)</label>
                <div className="relative">
                  <DollarSign className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
                  <input type="number" min="1" step="1" value={pricingAmount} onChange={e => setPricingAmount(e.target.value)}
                    placeholder="299"
                    className="w-full pl-10 pr-4 py-2.5 bg-black/30 border border-white/10 rounded-xl text-white text-sm placeholder-gray-500 focus:border-amber-500/30 focus:outline-none" />
                </div>
              </div>
            </div>

            <div className="text-[10px] text-gray-500">
              Precios base: Descubre $499 · Solo $499 · Los Dos $999
            </div>

            <button onClick={handleCreatePricingLink} disabled={pricingLoading || !pricingEmail.includes('@') || !pricingAmount}
              className="w-full flex items-center justify-center gap-2 py-2.5 rounded-xl bg-gradient-to-r from-amber-500 to-orange-500 text-zinc-900 text-sm font-medium hover:from-amber-400 hover:to-orange-400 transition-all disabled:opacity-40">
              {pricingLoading ? <div className="w-4 h-4 border-2 border-zinc-900/30 border-t-zinc-900 rounded-full animate-spin" /> :
                <><Link2 className="w-4 h-4" /> Generar enlace de pago</>}
            </button>

            {pricingResult && (
              <div className={`px-3 py-2 rounded-lg text-xs ${
                pricingResult.type === 'success' ? 'bg-emerald-500/10 border border-emerald-500/20 text-emerald-300' :
                'bg-red-500/10 border border-red-500/20 text-red-300'
              }`}>
                <div className="flex items-center gap-2">
                  {pricingResult.type === 'success' ? <CheckCircle className="w-3.5 h-3.5 flex-shrink-0" /> : <AlertTriangle className="w-3.5 h-3.5 flex-shrink-0" />}
                  {pricingResult.text}
                </div>
                {pricingResult.url && (
                  <div className="mt-2 flex items-center gap-2">
                    <input type="text" readOnly value={pricingResult.url}
                      className="flex-1 px-2 py-1.5 bg-black/40 border border-white/10 rounded-lg text-[10px] text-gray-300 font-mono truncate" />
                    <button onClick={handleCopyLink}
                      className="flex items-center gap-1 px-2 py-1.5 bg-amber-500/20 text-amber-300 rounded-lg text-[10px] hover:bg-amber-500/30 transition-colors flex-shrink-0">
                      <Copy className="w-3 h-3" /> {copiedLink ? '¡Copiado!' : 'Copiar'}
                    </button>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      )}

      {/* ─── TAB: PROMO CODES ─── */}
      {activeTab === 'promos' && (
        <div className="space-y-4">
          <p className="text-gray-400 text-xs leading-relaxed">
            Crea códigos de descuento reutilizables. Los usuarios los aplican en el checkout antes de pagar.
          </p>

          <div className="bg-black/20 border border-white/5 rounded-xl p-4 space-y-3">
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-white/60 text-xs uppercase tracking-wider mb-1.5 block">Código</label>
                <input type="text" value={promoCode} onChange={e => setPromoCode(e.target.value.toUpperCase())}
                  placeholder="DESCUENTO20"
                  className="w-full px-3 py-2.5 bg-black/30 border border-white/10 rounded-xl text-white text-sm placeholder-gray-500 focus:border-amber-500/30 focus:outline-none font-mono" />
              </div>
              <div>
                <label className="text-white/60 text-xs uppercase tracking-wider mb-1.5 block">Etiqueta</label>
                <input type="text" value={promoLabel} onChange={e => setPromoLabel(e.target.value)}
                  placeholder="Promo verano -20%"
                  className="w-full px-3 py-2.5 bg-black/30 border border-white/10 rounded-xl text-white text-sm placeholder-gray-500 focus:border-amber-500/30 focus:outline-none" />
              </div>
            </div>

            <div className="flex items-center gap-4">
              <label className="flex items-center gap-2 cursor-pointer">
                <input type="checkbox" checked={promoFree} onChange={e => setPromoFree(e.target.checked)}
                  className="rounded border-white/20 bg-black/30 text-amber-500 focus:ring-amber-500/30" />
                <span className="text-xs text-gray-300">100% gratis</span>
              </label>
              {!promoFree && (
                <div className="flex items-center gap-2 flex-1">
                  <Percent className="w-4 h-4 text-gray-500" />
                  <input type="number" min="1" max="99" value={promoDiscount} onChange={e => setPromoDiscount(e.target.value)}
                    placeholder="20"
                    className="w-20 px-3 py-2 bg-black/30 border border-white/10 rounded-xl text-white text-sm placeholder-gray-500 focus:border-amber-500/30 focus:outline-none" />
                  <span className="text-xs text-gray-500">% descuento</span>
                </div>
              )}
            </div>

            <button onClick={handleCreatePromo} disabled={promoLoading || !promoCode}
              className="w-full flex items-center justify-center gap-2 py-2.5 rounded-xl bg-gradient-to-r from-amber-500 to-orange-500 text-zinc-900 text-sm font-medium hover:from-amber-400 hover:to-orange-400 transition-all disabled:opacity-40">
              {promoLoading ? <div className="w-4 h-4 border-2 border-zinc-900/30 border-t-zinc-900 rounded-full animate-spin" /> :
                <><Tag className="w-4 h-4" /> Crear código</>}
            </button>

            {promoMessage && (
              <div className={`flex items-center gap-2 px-3 py-2 rounded-lg text-xs ${
                promoMessage.type === 'success' ? 'bg-emerald-500/10 border border-emerald-500/20 text-emerald-300' :
                'bg-red-500/10 border border-red-500/20 text-red-300'
              }`}>
                {promoMessage.type === 'success' ? <CheckCircle className="w-3.5 h-3.5" /> : <AlertTriangle className="w-3.5 h-3.5" />}
                {promoMessage.text}
              </div>
            )}
          </div>

          {/* Existing promo codes */}
          <div>
            <p className="text-amber-300/60 text-xs uppercase tracking-wider mb-2">Códigos integrados</p>
            <div className="space-y-1">
              {Object.entries(promoList.builtIn || {}).map(([code, p]) => (
                <div key={code} className="flex items-center justify-between bg-black/20 border border-white/5 rounded-lg px-3 py-2">
                  <div className="flex items-center gap-2">
                    <span className="text-xs text-white font-mono">{code}</span>
                    <span className="text-[10px] text-gray-500">{p.label || (p.free ? '100% gratis' : `${p.discountPercent}% desc.`)}</span>
                  </div>
                  <span className="text-[10px] text-gray-600">fijo</span>
                </div>
              ))}
            </div>
          </div>

          <div>
            <p className="text-amber-300/60 text-xs uppercase tracking-wider mb-2">Códigos personalizados</p>
            <div className="space-y-1">
              {Object.keys(promoList.custom || {}).length === 0 ? (
                <p className="text-xs text-gray-600 py-2">Ningún código personalizado aún</p>
              ) : (
                Object.entries(promoList.custom).map(([code, p]) => (
                  <div key={code} className="flex items-center justify-between bg-black/20 border border-white/5 rounded-lg px-3 py-2">
                    <div className="flex items-center gap-2">
                      <span className="text-xs text-white font-mono">{code}</span>
                      <span className="text-[10px] text-gray-500">{p.label || (p.free ? '100% gratis' : `${p.discountPercent}% desc.`)}</span>
                    </div>
                    <button onClick={() => handleDeletePromo(code)}
                      className="text-[10px] text-red-400 hover:text-red-300 transition-colors">
                      <Trash2 className="w-3 h-3" />
                    </button>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      )}

      {/* ─── TAB: DEVELOPER TOOLS ─── */}
      {activeTab === 'dev' && (
        <div className="space-y-4">
          <h3 className="text-sm font-medium text-amber-300 flex items-center gap-2">
            <Code2 className="w-4 h-4" /> Herramientas de Desarrollador
          </h3>

          {/* Quick access links */}
          <div className="space-y-2">
            <p className="text-[10px] text-gray-500 uppercase tracking-wider">Accesos rápidos</p>
            <div className="grid grid-cols-2 gap-2">
              {[
                { label: 'Landing Radiografía', href: '/tienda/radiografia-pareja' },
                { label: 'Demo ventas (resultados)', href: '/tienda/radiografia-premium?demo=ventas' },
                { label: 'Test Descubre (gratis)', href: '/tienda/radiografia-premium?free=true&type=descubre&fromProfile=true' },
                { label: 'Test Solo (gratis)', href: '/tienda/radiografia-premium?free=true&type=solo&fromProfile=true' },
                { label: 'Test Los Dos (gratis)', href: '/tienda/radiografia-premium?free=true&type=losdos&fromProfile=true' },
                { label: 'Compra test mode', href: '/tienda/radiografia-pareja?test=true' },
              ].map(link => (
                <a key={link.href} href={link.href} target="_blank" rel="noopener noreferrer"
                  className="flex items-center gap-2 px-3 py-2.5 rounded-lg bg-black/30 border border-white/10 text-white/70 text-xs hover:text-white hover:border-amber-500/30 transition-all">
                  <ExternalLink className="w-3 h-3 text-amber-400/60" />
                  {link.label}
                </a>
              ))}
            </div>
          </div>

          {/* Test promo code */}
          <div className="space-y-2">
            <p className="text-[10px] text-gray-500 uppercase tracking-wider">Código de prueba</p>
            <div className="p-3 rounded-lg bg-black/30 border border-white/10 space-y-2">
              <p className="text-white/60 text-xs">Usa el código <span className="font-mono text-amber-300">BETA100</span> en checkout para acceder gratis (100% descuento).</p>
              <p className="text-white/60 text-xs">Código <span className="font-mono text-amber-300">LANZAMIENTO50</span> aplica 50% de descuento.</p>
            </div>
          </div>

          {/* System info */}
          <div className="space-y-2">
            <p className="text-[10px] text-gray-500 uppercase tracking-wider">Sistema</p>
            <div className="p-3 rounded-lg bg-black/30 border border-white/10 text-xs text-white/50 space-y-1">
              <p>Worker: radiografia-worker.noirpraxis.workers.dev</p>
              <p>Firebase: diagnostico-emocional-7b8f7</p>
              <p>Stripe: Modo {import.meta.env.DEV ? 'Test (dev)' : 'Live'}</p>
              <p>Usuarios: {users.length} | Compras: {totalPurchases}</p>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
