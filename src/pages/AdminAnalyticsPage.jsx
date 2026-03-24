import { useState, useEffect, useMemo } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { getAnalyticsDaily, getAnalyticsRaw } from '../lib/supabase'
import { BarChart3, TrendingUp, Eye, Smartphone, Monitor, Globe, ArrowLeft, Calendar, Users, Clock } from 'lucide-react'
import { AreaChart, Area, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts'

const CHART_COLORS = ['#a855f7', '#ec4899', '#06b6d4', '#f59e0b', '#10b981', '#6366f1', '#ef4444', '#14b8a6']

export default function AdminAnalyticsPage() {
  const { user, isAdmin } = useAuth()
  const navigate = useNavigate()
  const [dailyData, setDailyData] = useState([])
  const [rawData, setRawData] = useState([])
  const [loading, setLoading] = useState(true)
  const [range, setRange] = useState(30)

  useEffect(() => {
    if (!isAdmin) { navigate('/'); return }
    loadData()
  }, [isAdmin, range])

  const loadData = async () => {
    setLoading(true)
    const [daily, raw] = await Promise.all([
      getAnalyticsDaily(range),
      getAnalyticsRaw(range, 5000)
    ])
    setDailyData(daily)
    setRawData(raw)
    setLoading(false)
  }

  // --- Computed metrics ---
  const totalViews = useMemo(() => rawData.length, [rawData])

  const uniqueDays = useMemo(() => {
    const days = new Set(rawData.map(r => r.date))
    return days.size
  }, [rawData])

  const avgPerDay = useMemo(() => {
    return uniqueDays > 0 ? Math.round(totalViews / uniqueDays) : 0
  }, [totalViews, uniqueDays])

  // Views per day chart data
  const viewsPerDay = useMemo(() => {
    const map = {}
    rawData.forEach(r => {
      map[r.date] = (map[r.date] || 0) + 1
    })
    const days = []
    const now = new Date()
    for (let i = range - 1; i >= 0; i--) {
      const d = new Date(now)
      d.setDate(d.getDate() - i)
      const key = d.toISOString().slice(0, 10)
      days.push({
        date: key,
        label: d.toLocaleDateString('es-MX', { day: 'numeric', month: 'short' }),
        views: map[key] || 0
      })
    }
    return days
  }, [rawData, range])

  // Top articles
  const topArticles = useMemo(() => {
    const map = {}
    rawData.forEach(r => {
      if (r.slug) {
        map[r.slug] = (map[r.slug] || 0) + 1
      }
    })
    return Object.entries(map)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 10)
      .map(([slug, views]) => ({ slug, views }))
  }, [rawData])

  // Device breakdown
  const deviceData = useMemo(() => {
    let mobile = 0, desktop = 0
    rawData.forEach(r => {
      if (r.is_mobile) mobile++
      else desktop++
    })
    return [
      { name: 'Móvil', value: mobile },
      { name: 'Desktop', value: desktop }
    ].filter(d => d.value > 0)
  }, [rawData])

  // Referrer sources
  const referrerData = useMemo(() => {
    const map = {}
    rawData.forEach(r => {
      let source = 'Directo'
      const ref = r.referrer || ''
      if (ref) {
        try {
          const url = new URL(ref)
          source = url.hostname.replace('www.', '')
        } catch {
          source = ref.slice(0, 30)
        }
      }
      map[source] = (map[source] || 0) + 1
    })
    return Object.entries(map)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 8)
      .map(([name, value]) => ({ name, value }))
  }, [rawData])

  // Language breakdown
  const languageData = useMemo(() => {
    const map = {}
    rawData.forEach(r => {
      const lang = (r.language || 'unknown').split('-')[0]
      map[lang] = (map[lang] || 0) + 1
    })
    return Object.entries(map)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 6)
      .map(([name, value]) => ({ name, value }))
  }, [rawData])

  // Screen resolution breakdown
  const screenData = useMemo(() => {
    const map = {}
    rawData.forEach(r => {
      if (r.screen) map[r.screen] = (map[r.screen] || 0) + 1
    })
    return Object.entries(map)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 6)
      .map(([name, value]) => ({ name, value }))
  }, [rawData])

  // Hourly distribution
  const hourlyData = useMemo(() => {
    const hours = new Array(24).fill(0)
    rawData.forEach(r => {
      if (r.timestamp) {
        const h = new Date(r.timestamp).getHours()
        if (Number.isFinite(h)) hours[h]++
      }
    })
    return hours.map((views, hour) => ({
      hour: `${String(hour).padStart(2, '0')}:00`,
      views
    }))
  }, [rawData])

  // Today's views
  const todayViews = useMemo(() => {
    const today = new Date().toISOString().slice(0, 10)
    return rawData.filter(r => r.date === today).length
  }, [rawData])

  if (!isAdmin) return null

  const CustomTooltip = ({ active, payload, label }) => {
    if (!active || !payload?.length) return null
    return (
      <div className="bg-zinc-900 border border-white/20 rounded-lg px-3 py-2 shadow-xl">
        <p className="text-white/60 text-xs mb-1">{label}</p>
        <p className="text-white font-semibold">{payload[0].value} visitas</p>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-[#0a0a0f] pt-24 pb-16 px-4">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-8 flex-wrap gap-4">
          <div className="flex items-center gap-4">
            <button onClick={() => navigate(-1)} className="text-gray-400 hover:text-white transition-colors">
              <ArrowLeft className="w-5 h-5" />
            </button>
            <div className="flex items-center gap-3">
              <BarChart3 className="w-6 h-6 text-purple-400" />
              <h1 className="text-2xl font-bold text-white">Analytics</h1>
            </div>
          </div>
          <div className="flex gap-2">
            {[7, 30, 90].map(d => (
              <button
                key={d}
                onClick={() => setRange(d)}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                  range === d
                    ? 'bg-purple-500/20 text-purple-300 ring-1 ring-purple-500/50'
                    : 'bg-white/5 text-gray-400 hover:bg-white/10'
                }`}
              >
                {d}d
              </button>
            ))}
          </div>
        </div>

        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
            {[1, 2, 3, 4].map(i => (
              <div key={i} className="bg-white/5 rounded-2xl p-6 animate-pulse h-28" />
            ))}
          </div>
        ) : (
          <>
            {/* KPI Cards */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
              <div className="bg-gradient-to-br from-purple-500/10 to-fuchsia-500/10 border border-purple-500/20 rounded-2xl p-5">
                <div className="flex items-center gap-2 text-purple-400 mb-2">
                  <Eye className="w-4 h-4" />
                  <span className="text-xs uppercase tracking-wider">Total visitas</span>
                </div>
                <p className="text-3xl font-bold text-white">{totalViews.toLocaleString()}</p>
                <p className="text-xs text-white/40 mt-1">últimos {range} días</p>
              </div>
              <div className="bg-gradient-to-br from-cyan-500/10 to-blue-500/10 border border-cyan-500/20 rounded-2xl p-5">
                <div className="flex items-center gap-2 text-cyan-400 mb-2">
                  <TrendingUp className="w-4 h-4" />
                  <span className="text-xs uppercase tracking-wider">Hoy</span>
                </div>
                <p className="text-3xl font-bold text-white">{todayViews.toLocaleString()}</p>
                <p className="text-xs text-white/40 mt-1">visitas hoy</p>
              </div>
              <div className="bg-gradient-to-br from-amber-500/10 to-orange-500/10 border border-amber-500/20 rounded-2xl p-5">
                <div className="flex items-center gap-2 text-amber-400 mb-2">
                  <Calendar className="w-4 h-4" />
                  <span className="text-xs uppercase tracking-wider">Promedio diario</span>
                </div>
                <p className="text-3xl font-bold text-white">{avgPerDay}</p>
                <p className="text-xs text-white/40 mt-1">visitas/día</p>
              </div>
              <div className="bg-gradient-to-br from-emerald-500/10 to-teal-500/10 border border-emerald-500/20 rounded-2xl p-5">
                <div className="flex items-center gap-2 text-emerald-400 mb-2">
                  <Users className="w-4 h-4" />
                  <span className="text-xs uppercase tracking-wider">Dispositivos</span>
                </div>
                <p className="text-3xl font-bold text-white">
                  {deviceData.find(d => d.name === 'Móvil')?.value || 0}
                  <span className="text-base text-white/40 font-normal"> móvil</span>
                </p>
                <p className="text-xs text-white/40 mt-1">{deviceData.find(d => d.name === 'Desktop')?.value || 0} desktop</p>
              </div>
            </div>

            {/* Main Chart - Views per day */}
            <div className="bg-white/[0.03] border border-white/10 rounded-2xl p-6 mb-6">
              <h2 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
                <TrendingUp className="w-5 h-5 text-purple-400" />
                Visitas por día
              </h2>
              <div className="h-72">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={viewsPerDay}>
                    <defs>
                      <linearGradient id="colorViews" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#a855f7" stopOpacity={0.3} />
                        <stop offset="95%" stopColor="#a855f7" stopOpacity={0} />
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
                    <XAxis dataKey="label" tick={{ fill: 'rgba(255,255,255,0.4)', fontSize: 11 }} axisLine={false} tickLine={false} />
                    <YAxis tick={{ fill: 'rgba(255,255,255,0.4)', fontSize: 11 }} axisLine={false} tickLine={false} allowDecimals={false} />
                    <Tooltip content={<CustomTooltip />} />
                    <Area type="monotone" dataKey="views" stroke="#a855f7" strokeWidth={2} fill="url(#colorViews)" />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
              {/* Top Articles */}
              <div className="bg-white/[0.03] border border-white/10 rounded-2xl p-6">
                <h2 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
                  <Eye className="w-5 h-5 text-cyan-400" />
                  Artículos más visitados
                </h2>
                {topArticles.length > 0 ? (
                  <div className="space-y-3">
                    {topArticles.map((item, i) => {
                      const maxViews = topArticles[0]?.views || 1
                      return (
                        <div key={item.slug} className="flex items-center gap-3">
                          <span className="text-xs text-white/30 w-5 text-right">{i + 1}</span>
                          <div className="flex-1 min-w-0">
                            <p className="text-sm text-white truncate">{item.slug}</p>
                            <div className="mt-1 h-1.5 bg-white/5 rounded-full overflow-hidden">
                              <div
                                className="h-full bg-gradient-to-r from-purple-500 to-cyan-500 rounded-full transition-all"
                                style={{ width: `${(item.views / maxViews) * 100}%` }}
                              />
                            </div>
                          </div>
                          <span className="text-sm font-medium text-white/70 whitespace-nowrap">{item.views}</span>
                        </div>
                      )
                    })}
                  </div>
                ) : (
                  <p className="text-white/30 text-sm">Sin datos aún</p>
                )}
              </div>

              {/* Hourly Distribution */}
              <div className="bg-white/[0.03] border border-white/10 rounded-2xl p-6">
                <h2 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
                  <Clock className="w-5 h-5 text-amber-400" />
                  Distribución por hora
                </h2>
                <div className="h-52">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={hourlyData}>
                      <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
                      <XAxis dataKey="hour" tick={{ fill: 'rgba(255,255,255,0.4)', fontSize: 9 }} axisLine={false} tickLine={false} interval={2} />
                      <YAxis tick={{ fill: 'rgba(255,255,255,0.4)', fontSize: 11 }} axisLine={false} tickLine={false} allowDecimals={false} />
                      <Tooltip content={<CustomTooltip />} />
                      <Bar dataKey="views" fill="#f59e0b" radius={[4, 4, 0, 0]} />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {/* Device Pie Chart */}
              <div className="bg-white/[0.03] border border-white/10 rounded-2xl p-6">
                <h2 className="text-sm font-semibold text-white mb-4 flex items-center gap-2">
                  <Smartphone className="w-4 h-4 text-emerald-400" />
                  Dispositivo
                </h2>
                {deviceData.length > 0 ? (
                  <div className="h-40">
                    <ResponsiveContainer width="100%" height="100%">
                      <PieChart>
                        <Pie data={deviceData} cx="50%" cy="50%" innerRadius={35} outerRadius={60} dataKey="value" label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}>
                          {deviceData.map((_, i) => (
                            <Cell key={i} fill={CHART_COLORS[i]} />
                          ))}
                        </Pie>
                        <Tooltip />
                      </PieChart>
                    </ResponsiveContainer>
                  </div>
                ) : <p className="text-white/30 text-sm text-center py-8">Sin datos</p>}
              </div>

              {/* Referrer Sources */}
              <div className="bg-white/[0.03] border border-white/10 rounded-2xl p-6">
                <h2 className="text-sm font-semibold text-white mb-4 flex items-center gap-2">
                  <Globe className="w-4 h-4 text-blue-400" />
                  Fuentes de tráfico
                </h2>
                {referrerData.length > 0 ? (
                  <div className="space-y-2">
                    {referrerData.map((item, i) => (
                      <div key={item.name} className="flex items-center justify-between">
                        <span className="text-xs text-white/60 truncate flex-1">{item.name}</span>
                        <span className="text-xs font-medium text-white/80 ml-2">{item.value}</span>
                      </div>
                    ))}
                  </div>
                ) : <p className="text-white/30 text-sm text-center py-8">Sin datos</p>}
              </div>

              {/* Screen Resolutions */}
              <div className="bg-white/[0.03] border border-white/10 rounded-2xl p-6">
                <h2 className="text-sm font-semibold text-white mb-4 flex items-center gap-2">
                  <Monitor className="w-4 h-4 text-fuchsia-400" />
                  Resoluciones
                </h2>
                {screenData.length > 0 ? (
                  <div className="space-y-2">
                    {screenData.map((item) => (
                      <div key={item.name} className="flex items-center justify-between">
                        <span className="text-xs text-white/60 font-mono">{item.name}</span>
                        <span className="text-xs font-medium text-white/80">{item.value}</span>
                      </div>
                    ))}
                  </div>
                ) : <p className="text-white/30 text-sm text-center py-8">Sin datos</p>}
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  )
}
