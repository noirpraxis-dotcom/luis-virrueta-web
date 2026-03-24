/**
 * Radiografía de Pareja — Cloudflare Worker Backend
 * luisvirrueta.com
 *
 * Rutas:
 *   GET  /audio/*                          — Servir audio desde R2
 *   POST /api/create-radiografia-checkout  — Crea sesión Stripe Checkout
 *   POST /api/verify-payment               — Verifica sesión Stripe (returns token)
 *   POST /api/validate-radiografia-promo   — Valida código promo
 *   POST /api/send-access-email            — Envía email de acceso + link pairs (losdos)
 *   POST /api/save-analysis                — Guarda análisis en KV
 *   POST /api/send-analysis-email          — Envía email "resultados listos"
 *   POST /api/check-cross-status           — Verifica si ambos terminaron (losdos)
 *   POST /api/mark-partner-done            — Marca partner como completado
 *   POST /api/save-cross-analysis          — Guarda análisis cruzado en KV
 *   POST /api/send-cross-analysis-email    — Envía email "cruzado listo"
 *   GET  /api/get-analysis                 — Recupera análisis por token
 *   GET  /api/get-cross-analysis           — Recupera análisis cruzado por pairId
 *   POST /webhook                          — Recibe eventos Stripe
 *   POST /api/validate-radiografia-promo   — Valida código promo
 *   POST /api/send-access-email            — Envía email de acceso (Resend)
 *   POST /webhook                          — Recibe eventos Stripe
 *   OPTIONS /*                             — CORS preflight
 *
 * Secrets (wrangler secret put):
 *   STRIPE_SECRET_KEY      sk_live_xxx
 *   STRIPE_WEBHOOK_SECRET  whsec_xxx
 *   RESEND_API_KEY         re_xxx
 *
 * Vars (wrangler.toml):
 *   PRICE_DESCUBRE / PRICE_SOLO / PRICE_LOSDOS  price_xxx
 *
 * R2 binding (wrangler.toml):
 *   AUDIO_BUCKET  — luisvirrueta-audio
 */

const SITE_URL       = 'https://luisvirrueta.com'
const RETURN_URL     = `${SITE_URL}/tienda/diagnostico-relacional`   // Stripe success redirect
const RADIOGRAFIA_URL = `${SITE_URL}/tienda/radiografia-premium`     // Email access link
const FROM_EMAIL     = 'Luis Virrueta <hola@luisvirrueta.com>'
const BASE_PRICES = { descubre: 499, solo: 499, losdos: 999 }

// Códigos promo integrados para Radiografía. Añade más con la env var PROMO_CODES_JSON.
const BUILT_IN_PROMOS = {
  LANZAMIENTO50: { discountPercent: 50, label: 'Lanzamiento -50%' },
  BETA100:       { free: true,          label: 'Acceso beta gratuito' },
}

// Códigos promo para Consultas. Almacenados solo en el Worker (no en el frontend).
const CONSULTA_PROMOS = {
  individual: {
    MENTELIBRE: { discountAmount: 200, finalPrice: 500, label: '$500 MXN — código MENTELIBRE aplicado' },
  },
  pareja: {
    DOSPUERTAS: { discountAmount: 250, finalPrice: 1000, label: '$1,000 MXN — código DOSPUERTAS aplicado' },
  },
}

// Precios base de consultas en centavos MXN
const CONSULTA_PRICES = { individual: 70000, pareja: 125000 }
const CONSULTA_NAMES  = {
  individual: 'Consulta Individual — Luis Virrueta · 60 min',
  pareja:     'Consulta de Pareja — Luis Virrueta · 90 min',
}

// ── CORS ─────────────────────────────────────────────────────────────────────
const CORS = {
  'Access-Control-Allow-Origin':  '*',
  'Access-Control-Allow-Methods': 'GET,POST,PUT,OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type,X-Admin-Secret',
}

function json(data, status = 200) {
  return new Response(JSON.stringify(data), {
    status,
    headers: { 'Content-Type': 'application/json', ...CORS },
  })
}

// ── Helpers de modo test/live ───────────────────────────────────────────────
function getStripeKey(env, isTest) {
  return isTest ? env.STRIPE_TEST_SECRET_KEY : env.STRIPE_SECRET_KEY
}
function getPriceId(env, type, isTest) {
  const suffix = isTest ? '_TEST' : ''
  return env[`PRICE_${type?.toUpperCase()}${suffix}`]
}

// ── Stripe REST (form-encoded) ────────────────────────────────────────────────
function flatten(obj, prefix = '') {
  return Object.entries(obj).reduce((out, [k, v]) => {
    const key = prefix ? `${prefix}[${k}]` : k
    if (Array.isArray(v)) {
      v.forEach((item, i) =>
        typeof item === 'object'
          ? Object.assign(out, flatten(item, `${key}[${i}]`))
          : (out[`${key}[${i}]`] = item)
      )
    } else if (v !== null && typeof v === 'object') {
      Object.assign(out, flatten(v, key))
    } else {
      out[key] = v
    }
    return out
  }, {})
}

async function stripe(env, method, path, params = {}, isTest = false) {
  let url = `https://api.stripe.com/v1${path}`
  const headers = {
    Authorization: `Bearer ${getStripeKey(env, isTest)}`,
    'Content-Type': 'application/x-www-form-urlencoded',
  }
  let body
  if (Object.keys(params).length) {
    const encoded = new URLSearchParams(flatten(params)).toString()
    if (method === 'GET') url += `?${encoded}`
    else body = encoded
  }
  const res  = await fetch(url, { method, headers, body })
  const data = await res.json()
  if (!res.ok) throw new Error(data.error?.message || `Stripe ${res.status}`)
  return data
}

// ── Resend email ──────────────────────────────────────────────────────────────
async function sendEmail(env, { to, subject, html }) {
  if (!env.RESEND_API_KEY) throw new Error('RESEND_API_KEY no configurado en Worker')
  const res = await fetch('https://api.resend.com/emails', {
    method:  'POST',
    headers: {
      Authorization:  `Bearer ${env.RESEND_API_KEY}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ from: FROM_EMAIL, to: [to], subject, html }),
  })
  if (!res.ok) {
    const errText = await res.text()
    throw new Error(`Resend error (${res.status}): ${errText}`)
  }
}

// ── Stripe webhook signature ──────────────────────────────────────────────────
async function verifyWebhook(rawBody, sigHeader, secret) {
  const parts     = Object.fromEntries(sigHeader.split(',').map(p => p.split('=')))
  const signed    = `${parts.t}.${rawBody}`
  const key       = await crypto.subtle.importKey(
    'raw', new TextEncoder().encode(secret),
    { name: 'HMAC', hash: 'SHA-256' }, false, ['sign']
  )
  const mac       = await crypto.subtle.sign('HMAC', key, new TextEncoder().encode(signed))
  const computed  = [...new Uint8Array(mac)].map(b => b.toString(16).padStart(2, '0')).join('')
  return computed === parts.v1
}

// ── Helpers ───────────────────────────────────────────────────────────────────
function makeToken() {
  const buf = new Uint8Array(32)
  crypto.getRandomValues(buf)
  return [...buf].map(b => b.toString(16).padStart(2, '0')).join('')
}

// ── Firebase Admin (service account JWT → access token) ───
function base64url(buf) {
  return btoa(String.fromCharCode(...new Uint8Array(buf)))
    .replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '')
}

async function getFirebaseAccessToken(env) {
  if (!env.FIREBASE_SA_EMAIL || !env.FIREBASE_SA_KEY) throw new Error('Service account secrets not set')
  const now = Math.floor(Date.now() / 1000)
  const header = base64url(new TextEncoder().encode(JSON.stringify({ alg: 'RS256', typ: 'JWT' })))
  const payload = base64url(new TextEncoder().encode(JSON.stringify({
    iss: env.FIREBASE_SA_EMAIL,
    sub: env.FIREBASE_SA_EMAIL,
    aud: 'https://oauth2.googleapis.com/token',
    iat: now,
    exp: now + 3600,
    scope: 'https://www.googleapis.com/auth/identitytoolkit https://www.googleapis.com/auth/datastore',
  })))
  // Import PEM private key
  const pem = env.FIREBASE_SA_KEY.replace(/-----BEGIN PRIVATE KEY-----/, '').replace(/-----END PRIVATE KEY-----/, '').replace(/\s/g, '')
  const keyBuf = Uint8Array.from(atob(pem), c => c.charCodeAt(0))
  const key = await crypto.subtle.importKey('pkcs8', keyBuf, { name: 'RSASSA-PKCS1-v1_5', hash: 'SHA-256' }, false, ['sign'])
  const sig = base64url(await crypto.subtle.sign('RSASSA-PKCS1-v1_5', key, new TextEncoder().encode(`${header}.${payload}`)))
  const jwt = `${header}.${payload}.${sig}`
  // Exchange for access token
  const res = await fetch('https://oauth2.googleapis.com/token', {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: `grant_type=urn%3Aietf%3Aparams%3Aoauth%3Agrant-type%3Ajwt-bearer&assertion=${jwt}`,
  })
  const data = await res.json()
  if (!res.ok) throw new Error(`OAuth error: ${data.error_description || data.error}`)
  return data.access_token
}

async function handleDeleteAuthUser(request, env) {
  const { uid, adminSecret } = await request.json()
  if (adminSecret !== env.ADMIN_SECRET) return json({ error: 'Unauthorized' }, 401)
  if (!uid) return json({ error: 'UID requerido' }, 400)
  const accessToken = await getFirebaseAccessToken(env)
  const res = await fetch(`https://identitytoolkit.googleapis.com/v1/projects/diagnostico-emocional-7b8f7/accounts:delete`, {
    method: 'POST',
    headers: { Authorization: `Bearer ${accessToken}`, 'Content-Type': 'application/json' },
    body: JSON.stringify({ localId: uid }),
  })
  const data = await res.json()
  if (!res.ok && data.error?.message !== 'USER_NOT_FOUND') {
    throw new Error(data.error?.message || `Delete failed (${res.status})`)
  }
  return json({ ok: true })
}

function getPromos(env) {
  try { return { ...BUILT_IN_PROMOS, ...JSON.parse(env.PROMO_CODES_JSON || '{}') } }
  catch { return BUILT_IN_PROMOS }
}

async function getPromosWithKV(env) {
  const base = getPromos(env)
  if (!env.PURCHASES) return base
  try {
    const kvRaw = await env.PURCHASES.get('admin:promo_codes')
    if (kvRaw) Object.assign(base, JSON.parse(kvRaw))
  } catch {}
  return base
}

function getTypeLabel(type) {
  return { descubre: 'Individual', solo: 'Pareja — Solo', losdos: 'Pareja — Los Dos', cruzado: 'Análisis Cruzado' }[type] || type
}

function escapeHtml(value = '') {
  return String(value)
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
    .replaceAll("'", '&#39;')
}

// ── Coupon (crear en Stripe si no existe) ────────────────────────────────────
async function getOrCreateCoupon(env, code, percent, isTest = false) {
  try   { const c = await stripe(env, 'GET', `/coupons/${code}`, {}, isTest); return c.id }
  catch { const c = await stripe(env, 'POST', '/coupons', { id: code, percent_off: percent, duration: 'once', name: code }, isTest); return c.id }
}

// ── Email HTML ────────────────────────────────────────────────────────────────
// ── Email: purchase confirmation (sent right after payment) ──────────────────
function purchaseEmailHtml({ typeLabel, accessUrl, customerName = '', packageType = 'solo' }) {
  const safeName = escapeHtml(customerName).trim()
  const greetingName = safeName ? `<span style="color:#c4b5fd;">${safeName}</span>` : ''
  const greetingTitle = safeName ? `Gracias, ${greetingName}` : 'Gracias por tu compra'

  // Package name
  const productName = packageType === 'descubre'
    ? 'Radiografía Descubre'
    : packageType === 'losdos'
    ? 'Radiografía de Pareja — Los Dos'
    : 'Radiografía de Pareja — Solo'

  // Package-specific body text
  const bodyText = packageType === 'descubre'
    ? `<p style="margin:0 0 20px;font-size:15px;line-height:1.8;color:rgba(255,255,255,0.65);">Gracias por adquirir <strong style="color:rgba(255,255,255,0.9);font-weight:400;">${productName}</strong>. Este es el primer paso hacia una comprensión más profunda de tus patrones emocionales y relacionales.</p>
          <p style="margin:0 0 20px;font-size:15px;line-height:1.8;color:rgba(255,255,255,0.65);">Tu cuestionario ya está listo. Responde a tu ritmo — no hay respuestas correctas ni incorrectas, solo tu verdad.</p>`
    : packageType === 'losdos'
    ? `<p style="margin:0 0 20px;font-size:15px;line-height:1.8;color:rgba(255,255,255,0.65);">Gracias por adquirir <strong style="color:rgba(255,255,255,0.9);font-weight:400;">${productName}</strong>. Acabas de dar un paso que muy pocas parejas se atreven a dar: mirar su relación con honestidad y profundidad.</p>
          <p style="margin:0 0 20px;font-size:15px;line-height:1.8;color:rgba(255,255,255,0.65);">Cada uno responde su cuestionario por separado, desde su propia perspectiva. Tu pareja recibirá un correo con su enlace independiente.</p>
          <p style="margin:0 0 20px;font-size:15px;line-height:1.8;color:rgba(255,255,255,0.65);">Cuando ambos terminen, <strong style="color:rgba(255,255,255,0.9);font-weight:400;">quien compró la prueba</strong> podrá generar el <strong style="color:rgba(255,255,255,0.9);font-weight:400;">análisis cruzado</strong> desde la pestaña <em style="color:rgba(236,72,153,0.9);">"Análisis Cruzado"</em> dentro de sus resultados. Una vez generado, ambos podrán verlo.</p>`
    : `<p style="margin:0 0 20px;font-size:15px;line-height:1.8;color:rgba(255,255,255,0.65);">Gracias por adquirir <strong style="color:rgba(255,255,255,0.9);font-weight:400;">${productName}</strong>. Este es el primer paso para comprender qué está pasando realmente en tu relación — más allá de lo que se ve en la superficie.</p>
          <p style="margin:0 0 20px;font-size:15px;line-height:1.8;color:rgba(255,255,255,0.65);">Tu cuestionario ya está listo. Responde con honestidad — no hay respuestas correctas ni incorrectas.</p>`

  // Dashboard note
  const dashboardNote = `<table width="100%" cellpadding="0" cellspacing="0" style="margin:24px 0 0;background:rgba(139,92,246,0.06);border:1px solid rgba(139,92,246,0.18);border-radius:14px;">
            <tr><td style="padding:18px 20px;">
              <p style="margin:0 0 6px;font-size:13px;color:rgba(255,255,255,0.8);font-weight:500;">&#128204; ¿Cómo continuar?</p>
              <p style="margin:0;font-size:13px;line-height:1.7;color:rgba(255,255,255,0.55);">Regresa a la pantalla donde estabas para continuar tu cuestionario, o accede desde <strong style="color:rgba(255,255,255,0.75);font-weight:400;">tu dashboard</strong> en luisvirrueta.com/perfil — ahí siempre encontrarás tu progreso, tus resultados y la descarga en PDF.</p>
            </td></tr>
          </table>`

  // Analysis includes
  const includesContent = packageType === 'descubre'
    ? `&#127993; 40 preguntas guiadas por voz<br>&#128300; 11 marcos psicológicos aplicados a tu caso<br>&#127913; Mapa profundo de tus patrones emocionales<br>&#128202; Autoanálisis de tus dinámicas inconscientes<br>&#128196; Reporte completo en PDF`
    : packageType === 'losdos'
    ? `&#127993; 40 preguntas guiadas por voz (cada uno)<br>&#128300; 11 marcos psicológicos aplicados a cada perspectiva<br>&#127913; Radiografía individual para cada uno<br>&#128149; Análisis cruzado comparativo de ambos<br>&#128202; Gráficas lado a lado de 12 dimensiones<br>&#128196; Reporte PDF para ambos`
    : `&#127993; 40 preguntas guiadas por voz<br>&#128300; 11 marcos psicológicos aplicados a tu caso<br>&#127913; Mapa de 12 dimensiones de tu vínculo<br>&#128202; Autoanálisis de tus patrones inconscientes<br>&#128196; Reporte completo en PDF`

  return `<!DOCTYPE html>
<html lang="es">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width,initial-scale=1">
  <title>Confirmación de compra</title>
</head>
<body style="margin:0;padding:0;background:#080810;font-family:-apple-system,BlinkMacSystemFont,'Helvetica Neue',Helvetica,Arial,sans-serif;">

<table width="100%" cellpadding="0" cellspacing="0" style="background:#080810;">
<tr><td align="center" style="padding:48px 16px 40px;">

  <table width="560" cellpadding="0" cellspacing="0" style="max-width:560px;width:100%;">

    <!-- Logotipo -->
    <tr><td align="center" style="padding-bottom:32px;">
      <p style="margin:0;font-size:11px;font-weight:600;letter-spacing:0.3em;text-transform:uppercase;color:rgba(167,139,250,0.7);">LUIS VIRRUETA</p>
    </td></tr>

    <!-- Separador -->
    <tr><td style="padding-bottom:32px;">
      <div style="height:1px;background:linear-gradient(to right,transparent,rgba(124,58,237,0.4),transparent);"></div>
    </td></tr>

    <!-- Headline -->
    <tr><td align="center" style="padding-bottom:32px;">
      <h1 style="margin:0 0 12px;font-size:28px;font-weight:300;letter-spacing:-0.03em;color:#ffffff;line-height:1.3;">${greetingTitle}</h1>
      <p style="margin:0;font-size:13px;color:rgba(167,139,250,0.8);letter-spacing:0.05em;text-transform:uppercase;">${typeLabel}</p>
    </td></tr>

    <!-- Card principal -->
    <tr><td style="padding-bottom:16px;">
      <table width="100%" cellpadding="0" cellspacing="0" style="background:#0f0f1a;border:1px solid rgba(124,58,237,0.18);border-radius:20px;overflow:hidden;">
        <tr><td style="padding:36px 36px 32px;">
          ${bodyText}

          <!-- Qué incluye -->
          <table width="100%" cellpadding="0" cellspacing="0" style="margin:0 0 20px;background:#111427;border:1px solid rgba(99,102,241,0.22);border-radius:14px;">
            <tr><td style="padding:18px 20px;font-size:13px;color:rgba(255,255,255,0.6);line-height:2;">
              <strong style="color:#ffffff;font-weight:600;font-size:13px;letter-spacing:0.05em;text-transform:uppercase;">Tu análisis incluirá</strong><br><br>
              ${includesContent}
            </td></tr>
          </table>

          ${dashboardNote}
        </td></tr>
      </table>
    </td></tr>

    <!-- Separador -->
    <tr><td style="padding:24px 0;">
      <div style="height:1px;background:linear-gradient(to right,transparent,rgba(255,255,255,0.06),transparent);"></div>
    </td></tr>

    <!-- Footer -->
    <tr><td align="center">
      <p style="margin:0 0 6px;font-size:11px;color:rgba(255,255,255,0.2);line-height:1.7;">Conserva este correo como confirmación de tu compra.</p>
      <p style="margin:0;font-size:11px;color:rgba(255,255,255,0.15);">luisvirrueta.com &mdash; hola@luisvirrueta.com</p>
    </td></tr>

  </table>
</td></tr>
</table>

</body></html>`
}

// ── Email: analysis ready (sent after AI finishes generating results) ─────────
function analysisEmailHtml({ typeLabel, accessUrl, packageType = 'solo' }) {
  const headline = packageType === 'descubre'
    ? 'Tu radiografía de<br>autoconocimiento está lista'
    : packageType === 'cruzado'
    ? 'Tu radiografía cruzada<br>está lista'
    : 'Tu radiografía psicológica<br>está lista'

  const bodyParagraphs = packageType === 'cruzado'
    ? `<p style="margin:0 0 20px;font-size:15px;line-height:1.8;color:rgba(255,255,255,0.65);">El <strong style="color:rgba(255,255,255,0.9);font-weight:400;">análisis cruzado</strong> de su relación ya está listo — la radiografía vista desde los dos lados, con gráficas comparativas de 12 dimensiones.</p>
          <p style="margin:0 0 20px;font-size:15px;line-height:1.8;color:rgba(255,255,255,0.65);">Accede a tu dashboard para verlo. También puedes descargar el PDF desde ahí.</p>`
    : packageType === 'losdos'
    ? `<p style="margin:0 0 20px;font-size:15px;line-height:1.8;color:rgba(255,255,255,0.65);">Tu radiografía individual ya está lista. 11 corrientes psicológicas analizaron tus respuestas para revelarte lo que no se ve a simple vista.</p>
          <p style="margin:0 0 20px;font-size:15px;line-height:1.8;color:rgba(255,255,255,0.65);">Cuando ambos hayan completado su cuestionario, quien compró la prueba podrá generar el <strong style="color:rgba(255,255,255,0.9);font-weight:400;">análisis cruzado</strong> desde la pestaña <em style="color:rgba(236,72,153,0.9);">"Análisis Cruzado"</em> en sus resultados.</p>`
    : packageType === 'descubre'
    ? `<p style="margin:0 0 20px;font-size:15px;line-height:1.8;color:rgba(255,255,255,0.65);">Tu análisis de autoconocimiento acaba de terminar. Hay un espejo frente a ti — uno que no miente ni halaga. Solo revela.</p>
          <p style="margin:0 0 20px;font-size:15px;line-height:1.8;color:rgba(255,255,255,0.65);">Tu análisis profundo de <strong style="color:rgba(255,255,255,0.9);font-weight:400;">11 corrientes psicológicas simultáneas</strong> y tus patrones emocionales está esperándote.</p>`
    : `<p style="margin:0 0 20px;font-size:15px;line-height:1.8;color:rgba(255,255,255,0.65);">Tu radiografía acaba de terminar. Hay un espejo frente a ti — uno que no miente ni halaga. Solo revela.</p>
          <p style="margin:0 0 20px;font-size:15px;line-height:1.8;color:rgba(255,255,255,0.65);">Tu análisis profundo de <strong style="color:rgba(255,255,255,0.9);font-weight:400;">11 corrientes psicológicas simultáneas</strong> y 12 dimensiones relacionales está esperándote.</p>`

  return `<!DOCTYPE html>
<html lang="es">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width,initial-scale=1">
  <title>Tu radiografía está lista</title>
</head>
<body style="margin:0;padding:0;background:#080810;font-family:-apple-system,BlinkMacSystemFont,'Helvetica Neue',Helvetica,Arial,sans-serif;">

<table width="100%" cellpadding="0" cellspacing="0" style="background:#080810;">
<tr><td align="center" style="padding:48px 16px 40px;">

  <table width="560" cellpadding="0" cellspacing="0" style="max-width:560px;width:100%;">

    <!-- Logotipo -->
    <tr><td align="center" style="padding-bottom:40px;">
      <p style="margin:0;font-size:11px;font-weight:600;letter-spacing:0.3em;text-transform:uppercase;color:rgba(167,139,250,0.7);">LUIS VIRRUETA</p>
    </td></tr>

    <!-- Separador -->
    <tr><td style="padding-bottom:40px;">
      <div style="height:1px;background:linear-gradient(to right,transparent,rgba(124,58,237,0.4),transparent);"></div>
    </td></tr>

    <!-- Headline -->
    <tr><td align="center" style="padding-bottom:32px;">
      <h1 style="margin:0 0 12px;font-size:28px;font-weight:300;letter-spacing:-0.03em;color:#ffffff;line-height:1.2;">${headline}</h1>
      <p style="margin:0;font-size:13px;color:rgba(167,139,250,0.8);letter-spacing:0.05em;text-transform:uppercase;">${typeLabel}</p>
    </td></tr>

    <!-- Card principal -->
    <tr><td style="padding-bottom:16px;">
      <table width="100%" cellpadding="0" cellspacing="0" style="background:#0f0f1a;border:1px solid rgba(124,58,237,0.18);border-radius:20px;overflow:hidden;">
        <tr><td style="padding:40px 40px 32px;">
          ${bodyParagraphs}
          <table width="100%" cellpadding="0" cellspacing="0" style="margin:20px 0 0;background:rgba(139,92,246,0.06);border:1px solid rgba(139,92,246,0.18);border-radius:14px;">
            <tr><td style="padding:18px 20px;">
              <p style="margin:0 0 6px;font-size:13px;color:rgba(255,255,255,0.8);font-weight:500;">&#128204; ¿Cómo verlo?</p>
              <p style="margin:0;font-size:13px;line-height:1.7;color:rgba(255,255,255,0.55);">Ingresa a <strong style="color:rgba(255,255,255,0.75);font-weight:400;">tu dashboard</strong> en luisvirrueta.com/perfil para acceder a tus resultados y descargar tu reporte en PDF.</p>
            </td></tr>
          </table>
        </td></tr>
      </table>
    </td></tr>

    <!-- Separador -->
    <tr><td style="padding:24px 0;">
      <div style="height:1px;background:linear-gradient(to right,transparent,rgba(255,255,255,0.06),transparent);"></div>
    </td></tr>

    <!-- Footer -->
    <tr><td align="center">
      <p style="margin:0 0 6px;font-size:11px;color:rgba(255,255,255,0.2);line-height:1.7;">Tu reporte está guardado en tu cuenta. Accede cuando quieras.</p>
      <p style="margin:0;font-size:11px;color:rgba(255,255,255,0.15);">luisvirrueta.com &mdash; hola@luisvirrueta.com</p>
    </td></tr>

  </table>
</td></tr>
</table>

</body></html>`
}

// ── Email: cross-analysis ready (sent when both partners finish) ─────────────
function crossAnalysisEmailHtml({ accessUrl }) {
  return `<!DOCTYPE html>
<html lang="es">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width,initial-scale=1">
  <title>Tu radiografía cruzada está lista</title>
</head>
<body style="margin:0;padding:0;background:#080810;font-family:-apple-system,BlinkMacSystemFont,'Helvetica Neue',Helvetica,Arial,sans-serif;">

<table width="100%" cellpadding="0" cellspacing="0" style="background:#080810;">
<tr><td align="center" style="padding:48px 16px 40px;">

  <table width="560" cellpadding="0" cellspacing="0" style="max-width:560px;width:100%;">

    <tr><td align="center" style="padding-bottom:40px;">
      <p style="margin:0;font-size:11px;font-weight:600;letter-spacing:0.3em;text-transform:uppercase;color:rgba(167,139,250,0.7);">LUIS VIRRUETA</p>
    </td></tr>

    <tr><td style="padding-bottom:40px;">
      <div style="height:1px;background:linear-gradient(to right,transparent,rgba(236,72,153,0.5),transparent);"></div>
    </td></tr>

    <tr><td align="center" style="padding-bottom:32px;">
      <h1 style="margin:0 0 12px;font-size:28px;font-weight:300;letter-spacing:-0.03em;color:#ffffff;line-height:1.2;">La radiografía cruzada<br>de su relación está lista</h1>
      <p style="margin:0;font-size:13px;color:rgba(236,72,153,0.8);letter-spacing:0.05em;text-transform:uppercase;">Pareja &mdash; Los Dos</p>
    </td></tr>

    <tr><td style="padding-bottom:16px;">
      <table width="100%" cellpadding="0" cellspacing="0" style="background:#0f0f1a;border:1px solid rgba(236,72,153,0.18);border-radius:20px;overflow:hidden;">
        <tr><td style="padding:40px 40px 32px;">
          <p style="margin:0 0 20px;font-size:15px;line-height:1.8;color:rgba(255,255,255,0.65);">Los dos han completado su cuestionario. Ahora tienen algo que muy pocas parejas logran: <strong style="color:rgba(255,255,255,0.9);font-weight:400;">una fotografía cruzada de su vínculo</strong> a través de los ojos de ambos.</p>
          <p style="margin:0 0 20px;font-size:15px;line-height:1.8;color:rgba(255,255,255,0.65);">Este reporte cruza las respuestas de los dos para revelar patrones compartidos, puntos ciegos, y la dinámica real de la relación — vista desde las dos perspectivas.</p>
          <table width="100%" cellpadding="0" cellspacing="0" style="margin:8px 0 0;background:rgba(236,72,153,0.06);border:1px solid rgba(236,72,153,0.18);border-radius:14px;">
            <tr><td style="padding:18px 20px;">
              <p style="margin:0 0 6px;font-size:13px;color:rgba(255,255,255,0.8);font-weight:500;">&#128204; ¿Cómo verlo?</p>
              <p style="margin:0;font-size:13px;line-height:1.7;color:rgba(255,255,255,0.55);">Ingresa a <strong style="color:rgba(255,255,255,0.75);font-weight:400;">tu dashboard</strong> en luisvirrueta.com/perfil — ahí encontrarás tus resultados individuales, el análisis cruzado y la descarga en PDF.</p>
            </td></tr>
          </table>
        </td></tr>
      </table>
    </td></tr>

    <tr><td style="padding:24px 0;">
      <div style="height:1px;background:linear-gradient(to right,transparent,rgba(255,255,255,0.06),transparent);"></div>
    </td></tr>

    <tr><td align="center">
      <p style="margin:0 0 6px;font-size:11px;color:rgba(255,255,255,0.2);line-height:1.7;">Tu reporte está guardado en tu cuenta. Accede cuando quieras.</p>
      <p style="margin:0;font-size:11px;color:rgba(255,255,255,0.15);">luisvirrueta.com &mdash; hola@luisvirrueta.com</p>
    </td></tr>

  </table>
</td></tr>
</table>

</body></html>`
}

// Legacy alias so existing call sites keep working during migration
const emailHtml = purchaseEmailHtml

// ═══════════════════════════════════════════════════════════════════════════════
// HANDLERS
// ═══════════════════════════════════════════════════════════════════════════════

async function handleCreateCheckout(req, env) {
  const { type, promoCode, testMode } = await req.json()
  const isTest = testMode === true
  const priceId = getPriceId(env, type, isTest)
  if (!priceId) return json({ error: 'Producto no encontrado' }, 400)

  const promos = await getPromosWithKV(env)
  const promo  = promoCode ? promos[promoCode.toUpperCase()] : null

  // Promo 100% gratis — saltamos Stripe
  if (promo?.free) {
    const token = makeToken()
    await env.PURCHASES?.put(
      `token:${token}`,
      JSON.stringify({ type, email: '', createdAt: Date.now(), source: 'promo_free', isTest }),
      { expirationTtl: 86400 * 365 }
    )
    return json({ free: true, token, type })
  }

  const params = {
    mode:       'payment',
    line_items: [{ price: priceId, quantity: '1' }],
    success_url: `${isTest ? (req.headers.get('Origin') || 'http://localhost:3000') : SITE_URL}/tienda/diagnostico-relacional?session_id={CHECKOUT_SESSION_ID}&type=${type}`,
    cancel_url:  isTest ? `${req.headers.get('Origin') || 'http://localhost:3000'}/tienda/diagnostico-relacional` : RETURN_URL,
    metadata:   { type, testMode: isTest ? 'true' : 'false' },
  }

  if (promo?.discountPercent) {
    const couponId = await getOrCreateCoupon(env, promoCode.toUpperCase(), promo.discountPercent, isTest)
    params.discounts = [{ coupon: couponId }]
  }

  const session = await stripe(env, 'POST', '/checkout/sessions', params, isTest)
  return json({ url: session.url })
}

async function handleCreateCustomCheckout(req, env) {
  const { email, packageType, customPriceCents, productName, adminSecret } = await req.json()
  // Only allow admin (check shared secret)
  if (!adminSecret || adminSecret !== env.ADMIN_SECRET) {
    return json({ error: 'No autorizado' }, 403)
  }
  if (!email || !customPriceCents || customPriceCents < 100) {
    return json({ error: 'Email y precio (mín $1) requeridos' }, 400)
  }
  const type = packageType || 'solo'
  const label = productName || `Radiografía Psicológica — ${getTypeLabel(type)}`

  const params = {
    mode: 'payment',
    customer_email: email,
    line_items: [{
      price_data: {
        currency: 'mxn',
        product_data: { name: label },
        unit_amount: String(Math.round(customPriceCents)),
      },
      quantity: '1',
    }],
    success_url: `${SITE_URL}/tienda/diagnostico-relacional?session_id={CHECKOUT_SESSION_ID}&type=${type}`,
    cancel_url: RETURN_URL,
    metadata: { type, customPrice: 'true' },
  }

  const session = await stripe(env, 'POST', '/checkout/sessions', params, false)
  return json({ url: session.url, sessionId: session.id })
}

async function handleVerifyPayment(req, env) {
  const body = await req.json()
  const { sessionId } = body
  // Auto-detect test vs live by session_id prefix (cs_test_ vs cs_live_)
  const isTest = sessionId?.startsWith('cs_test_')
  const session = await stripe(env, 'GET', `/checkout/sessions/${sessionId}`, {}, isTest)
  const email   = session.customer_details?.email || session.customer_email || ''
  const name    = session.customer_details?.name || ''
  const type    = session.metadata?.type || 'solo'

  // Send confirmation email on verify (runs once thanks to KV dedup).
  // This makes email delivery reliable in both test mode and live without
  // requiring a Stripe webhook to be configured.
  if (email && session.payment_status === 'paid' && env.PURCHASES) {
    const dedupKey = `email_sent:${sessionId}`
    const alreadySent = await env.PURCHASES.get(dedupKey)
    if (!alreadySent) {
      try {
        const existingPurchaseRaw = await env.PURCHASES.get(`session:${sessionId}`)
        let existingToken = ''
        if (existingPurchaseRaw) {
          try {
            existingToken = JSON.parse(existingPurchaseRaw)?.token || ''
          } catch {}
        }

        const { siteOrigin } = body
        const baseUrl = (isTest && siteOrigin) ? siteOrigin : SITE_URL
        const token     = existingToken || makeToken()
        const accessUrl = `${baseUrl}/tienda/radiografia-premium?token=${token}&type=${type}&pid=${sessionId}`
        await sendEmail(env, {
          to:      email,
          subject: 'Tu acceso a la Radiografía Psicológica',
          html:    purchaseEmailHtml({ typeLabel: getTypeLabel(type), accessUrl, customerName: name, packageType: type }),
        })
        // Save purchase + mark email sent
        const purchase = JSON.stringify({ email, name, type, sessionId, token, createdAt: Date.now(), paid: true })
        await Promise.all([
          env.PURCHASES.put(`session:${sessionId}`, purchase, { expirationTtl: 86400 * 365 }),
          env.PURCHASES.put(`token:${token}`,        purchase, { expirationTtl: 86400 * 365 }),
          env.PURCHASES.put(dedupKey, '1', { expirationTtl: 86400 * 7 }),
        ])
      } catch (e) {
        // Non-fatal: email fail shouldn't block verification
        console.error('Verify email error:', e.message)
      }
    }
  }

  // Retrieve the token so the frontend can use it for save/send operations
  let purchaseToken = ''
  if (env.PURCHASES) {
    const purchaseRaw = await env.PURCHASES.get(`session:${sessionId}`)
    if (purchaseRaw) {
      try { purchaseToken = JSON.parse(purchaseRaw)?.token || '' } catch {}
    }
  }

  return json({
    type,
    email,
    token: purchaseToken,
    amount:   (session.amount_total || 0) / 100,
    paid:     session.payment_status === 'paid',
    isTest,
  })
}

async function handleValidatePromo(req, env) {
  const { promoCode, type } = await req.json()
  const promos = await getPromosWithKV(env)
  const promo  = promos[promoCode?.toUpperCase()]
  if (!promo) return json({ valid: false, error: 'Código no válido' })

  const originalPrice = BASE_PRICES[type] || 499
  if (promo.free) return json({ valid: true, free: true, label: promo.label, finalPrice: 0, discountPercent: 100 })

  return json({
    valid: true, free: false,
    label: promo.label,
    discountPercent: promo.discountPercent,
    finalPrice: Math.round(originalPrice * (1 - promo.discountPercent / 100)),
  })
}

async function handleSendAccessEmail(req, env) {
  const { purchaseId, type, emails, tokens, buyerToken, buyerEmail, profileData } = await req.json()

  // Dedup: prevent sending duplicate access emails for the same purchase + same recipients
  const validEmails = (emails || []).filter(Boolean).map(e => e.toLowerCase().trim()).sort()
  if (purchaseId && validEmails.length && env.PURCHASES) {
    const dedupKey = `email_sent:${purchaseId}:${validEmails.join(',')}`
    const already = await env.PURCHASES.get(dedupKey)
    if (already) {
      const prev = JSON.parse(already)
      return json({ ok: true, tokens: prev.tokens || [], dedup: true })
    }
  }

  const errors = []
  const generatedTokens = []

  for (let i = 0; i < (emails || []).length; i++) {
    const email = emails[i]
    if (!email) continue
    const token     = tokens?.[i] || makeToken()
    generatedTokens.push(token)
    // Link goes to dashboard — user is logged in and can continue from their profile
    const accessUrl = `${SITE_URL}/perfil`
    try {
      // Save token → purchase mapping so this token is valid for save-analysis
      if (env.PURCHASES) {
        const purchase = JSON.stringify({ email, type, sessionId: purchaseId, token, createdAt: Date.now(), paid: true })
        await env.PURCHASES.put(`token:${token}`, purchase, { expirationTtl: 86400 * 365 })
      }
      await sendEmail(env, {
        to:      email,
        subject: 'Tu acceso a la Radiografía Psicológica',
        html:    purchaseEmailHtml({ typeLabel: getTypeLabel(type), accessUrl, packageType: type }),
      })
    } catch (e) {
      console.error(`Error enviando a ${email}:`, e.message)
      errors.push({ email, error: e.message })
    }
  }

  // Save profile data for buyer token + generated tokens so it can be recovered on another device
  if (profileData && env.PURCHASES) {
    const profileStr = JSON.stringify(profileData)
    const profileTokens = [...new Set([buyerToken, ...generatedTokens].filter(Boolean))]
    await Promise.all(profileTokens.map(t =>
      env.PURCHASES.put(`profile:${t}`, profileStr, { expirationTtl: 86400 * 365 }).catch(() => {})
    ))
  }

  // For 'losdos': link buyer and partner tokens as a pair
  if (type === 'losdos' && buyerToken && generatedTokens.length > 0 && env.PURCHASES) {
    const partnerToken = generatedTokens[0]
    const pairId = `pair_${Date.now()}_${buyerToken.slice(0, 8)}`
    const pairData = JSON.stringify({
      pairId,
      token1: buyerToken,
      email1: buyerEmail || '',
      token2: partnerToken,
      email2: emails[0] || '',
      purchaseId,
      partner1_done: false,
      partner2_done: false,
      cross_analysis_done: false,
      createdAt: Date.now(),
    })
    await Promise.all([
      env.PURCHASES.put(`pair:${pairId}`, pairData, { expirationTtl: 86400 * 365 }),
      env.PURCHASES.put(`pair_by_token:${buyerToken}`, pairId, { expirationTtl: 86400 * 365 }),
      env.PURCHASES.put(`pair_by_token:${partnerToken}`, pairId, { expirationTtl: 86400 * 365 }),
    ])
  }

  if (errors.length > 0 && errors.length === (emails || []).filter(Boolean).length) {
    return json({ ok: false, errors }, 500)
  }

  // Save dedup marker (keyed by purchaseId + recipients so different email sets don't collide)
  if (purchaseId && validEmails.length && env.PURCHASES) {
    const dedupKey = `email_sent:${purchaseId}:${validEmails.join(',')}`
    await env.PURCHASES.put(dedupKey, JSON.stringify({ tokens: generatedTokens, sentAt: Date.now() }), { expirationTtl: 86400 * 7 }).catch(() => {})
  }

  return json({ ok: true, tokens: generatedTokens, errors: errors.length ? errors : undefined })
}

// ── Save analysis results to KV (called from frontend after AI finishes) ─────
async function handleSaveAnalysis(req, env) {
  const { token, analysis } = await req.json()
  if (!token || !analysis) return json({ error: 'Missing token or analysis' }, 400)
  if (!env.PURCHASES) return json({ error: 'KV not configured' }, 500)

  // Validate the token exists (security: only real purchase tokens can save)
  const existing = await env.PURCHASES.get(`token:${token}`)
  if (!existing && !token.startsWith('demo')) return json({ error: 'Invalid token' }, 403)

  await env.PURCHASES.put(
    `analysis:${token}`,
    JSON.stringify(analysis),
    { expirationTtl: 86400 * 365 }
  )
  return json({ ok: true })
}

// ── Retrieve stored analysis by token (called when loading results from email link) ──
async function handleGetAnalysis(req, env) {
  const token = new URL(req.url).searchParams.get('token')
  if (!token) return json({ error: 'Missing token' }, 400)
  if (!env.PURCHASES) return json({ error: 'KV not configured' }, 500)

  const raw = await env.PURCHASES.get(`analysis:${token}`)
  if (!raw) return json({ error: 'Not found' }, 404)

  try {
    return json({ ok: true, analysis: JSON.parse(raw) })
  } catch {
    return json({ error: 'Corrupt data' }, 500)
  }
}

// ── Save profile data to KV (called from frontend after purchase) ────────────
async function handleSaveProfile(req, env) {
  const { token, profileData } = await req.json()
  if (!token || !profileData) return json({ error: 'Missing token or profileData' }, 400)
  if (!env.PURCHASES) return json({ error: 'KV not configured' }, 500)

  const existing = await env.PURCHASES.get(`token:${token}`)
  if (!existing && !token.startsWith('demo')) return json({ error: 'Invalid token' }, 403)

  await env.PURCHASES.put(`profile:${token}`, JSON.stringify(profileData), { expirationTtl: 86400 * 365 })
  return json({ ok: true })
}

// ── Retrieve stored profile by token ─────────────────────────────────────────
async function handleGetProfile(req, env) {
  const token = new URL(req.url).searchParams.get('token')
  if (!token) return json({ error: 'Missing token' }, 400)
  if (!env.PURCHASES) return json({ error: 'KV not configured' }, 500)

  const raw = await env.PURCHASES.get(`profile:${token}`)
  if (!raw) return json({ error: 'Not found' }, 404)

  try {
    return json({ ok: true, profileData: JSON.parse(raw) })
  } catch {
    return json({ error: 'Corrupt data' }, 500)
  }
}

// ── Check cross-analysis status for 'losdos' pair ────────────────────────────
async function handleCheckCrossStatus(req, env) {
  const { token } = await req.json()
  if (!token) return json({ error: 'Missing token' }, 400)
  if (!env.PURCHASES) return json({ error: 'KV not configured' }, 500)

  const pairId = await env.PURCHASES.get(`pair_by_token:${token}`)
  if (!pairId) return json({ paired: false })

  const pairRaw = await env.PURCHASES.get(`pair:${pairId}`)
  if (!pairRaw) return json({ paired: false })

  const pair = JSON.parse(pairRaw)
  const isPartner1 = pair.token1 === token
  const myRole = isPartner1 ? 'partner1' : 'partner2'
  const otherRole = isPartner1 ? 'partner2' : 'partner1'
  const otherToken = isPartner1 ? pair.token2 : pair.token1
  const otherDone = pair[`${otherRole}_done`]

  // Check if other partner's analysis exists in KV
  let otherAnalysis = null
  if (otherDone) {
    const raw = await env.PURCHASES.get(`analysis:${otherToken}`)
    if (raw) {
      try { otherAnalysis = JSON.parse(raw) } catch {}
    }
  }

  return json({
    paired: true,
    pairId,
    myRole,
    myToken: token,
    otherToken,
    bothDone: pair.partner1_done && pair.partner2_done,
    otherDone,
    crossAnalysisDone: pair.cross_analysis_done || false,
    otherAnalysis,
  })
}

// ── Mark partner as done and update pair status ──────────────────────────────
async function handleMarkPartnerDone(req, env) {
  const { token } = await req.json()
  if (!token) return json({ error: 'Missing token' }, 400)
  if (!env.PURCHASES) return json({ error: 'KV not configured' }, 500)

  const pairId = await env.PURCHASES.get(`pair_by_token:${token}`)
  if (!pairId) return json({ ok: true, paired: false })

  const pairRaw = await env.PURCHASES.get(`pair:${pairId}`)
  if (!pairRaw) return json({ ok: true, paired: false })

  const pair = JSON.parse(pairRaw)
  const isPartner1 = pair.token1 === token

  if (isPartner1) pair.partner1_done = true
  else pair.partner2_done = true

  await env.PURCHASES.put(`pair:${pairId}`, JSON.stringify(pair), { expirationTtl: 86400 * 365 })

  return json({
    ok: true,
    paired: true,
    bothDone: pair.partner1_done && pair.partner2_done,
  })
}

// ── Save cross-analysis results ──────────────────────────────────────────────
async function handleSaveCrossAnalysis(req, env) {
  const { token, pairId, analysis } = await req.json()
  if (!pairId || !analysis) return json({ error: 'Missing pairId or analysis' }, 400)
  if (!env.PURCHASES) return json({ error: 'KV not configured' }, 500)

  // Validate the token belongs to this pair
  const storedPairId = await env.PURCHASES.get(`pair_by_token:${token}`)
  if (storedPairId !== pairId) return json({ error: 'Token does not belong to this pair' }, 403)

  await env.PURCHASES.put(
    `cross_analysis:${pairId}`,
    JSON.stringify(analysis),
    { expirationTtl: 86400 * 365 }
  )

  // Mark cross analysis as done
  const pairRaw = await env.PURCHASES.get(`pair:${pairId}`)
  if (pairRaw) {
    const pair = JSON.parse(pairRaw)
    pair.cross_analysis_done = true
    await env.PURCHASES.put(`pair:${pairId}`, JSON.stringify(pair), { expirationTtl: 86400 * 365 })
  }

  return json({ ok: true })
}

// ── Send cross-analysis ready email to both partners ─────────────────────────
async function handleSendCrossAnalysisEmail(req, env) {
  const { pairId, token, emails: directEmails } = await req.json()

  // New Firestore-based flow: emails passed directly
  if (directEmails && directEmails.length > 0) {
    const validEmails = directEmails.filter(e => e && e.includes('@'))
    const errors = []
    for (const email of validEmails) {
      const accessUrl = `${SITE_URL}/perfil`
      try {
        await sendEmail(env, {
          to: email,
          subject: 'Tu radiografía cruzada de pareja está lista',
          html: crossAnalysisEmailHtml({ accessUrl }),
        })
      } catch (e) {
        console.error(`Error enviando cross-analysis a ${email}:`, e.message)
        errors.push({ email, error: e.message })
      }
    }
    return json({ ok: true, errors: errors.length ? errors : undefined })
  }

  // Legacy KV-based flow (backward compat)
  if (!pairId) return json({ error: 'Missing pairId or emails' }, 400)
  if (!env.PURCHASES) return json({ error: 'KV not configured' }, 500)

  const pairRaw = await env.PURCHASES.get(`pair:${pairId}`)
  if (!pairRaw) return json({ error: 'Pair not found' }, 404)

  const pair = JSON.parse(pairRaw)
  if (token !== pair.token1 && token !== pair.token2) return json({ error: 'Unauthorized' }, 403)

  const emails = [pair.email1, pair.email2].filter(e => e && e.includes('@'))
  const errors = []

  for (const email of emails) {
    const accessUrl = `${SITE_URL}/perfil`
    try {
      await sendEmail(env, {
        to: email,
        subject: 'Tu radiografía cruzada de pareja está lista',
        html: crossAnalysisEmailHtml({ accessUrl }),
      })
    } catch (e) {
      console.error(`Error enviando cross-analysis a ${email}:`, e.message)
      errors.push({ email, error: e.message })
    }
  }

  return json({ ok: true, errors: errors.length ? errors : undefined })
}

// ── Retrieve stored cross-analysis by pairId ─────────────────────────────────
async function handleGetCrossAnalysis(req, env) {
  const url = new URL(req.url)
  const pairId = url.searchParams.get('pairId')
  const token = url.searchParams.get('token')
  if (!pairId || !token) return json({ error: 'Missing pairId or token' }, 400)
  if (!env.PURCHASES) return json({ error: 'KV not configured' }, 500)

  // Validate token belongs to pair
  const storedPairId = await env.PURCHASES.get(`pair_by_token:${token}`)
  if (storedPairId !== pairId) return json({ error: 'Unauthorized' }, 403)

  const raw = await env.PURCHASES.get(`cross_analysis:${pairId}`)
  if (!raw) return json({ error: 'Not found' }, 404)

  try {
    return json({ ok: true, analysis: JSON.parse(raw) })
  } catch {
    return json({ error: 'Corrupt data' }, 500)
  }
}

// ── Send "analysis ready" email(s) ────────────────────────────────────────────
async function handleSendAnalysisEmail(req, env) {
  const { token, type, emails } = await req.json()
  if (!emails?.length) return json({ error: 'Missing emails' }, 400)

  const typeLabel = getTypeLabel(type || 'solo')
  // If token is a real KV token, link directly to results; otherwise link to dashboard
  const accessUrl = (token && token !== 'firestore')
    ? `${RADIOGRAFIA_URL}?token=${token}&type=${type || 'solo'}&view=results`
    : `${SITE_URL}/perfil`
  const errors = []

  for (const email of emails.filter(Boolean)) {
    try {
      await sendEmail(env, {
        to:      email,
        subject: (type || 'solo') === 'descubre' ? 'Tu radiografía de autoconocimiento está lista' : (type || 'solo') === 'cruzado' ? 'Tu radiografía cruzada está lista' : 'Tu radiografía psicológica está lista',
        html:    analysisEmailHtml({ typeLabel, accessUrl, packageType: type || 'solo' }),
      })
    } catch (e) {
      console.error(`Error enviando análisis a ${email}:`, e.message)
      errors.push({ email, error: e.message })
    }
  }

  if (errors.length > 0 && errors.length === emails.filter(Boolean).length) {
    return json({ ok: false, errors }, 500)
  }
  return json({ ok: true, errors: errors.length ? errors : undefined })
}

// ── Send backup with filled questionnaire to admin ──────────────────────────
const ADMIN_EMAIL = 'luis.virrueta.contacto@gmail.com'

// ── Email: partner invitation (sent to partner for "losdos" package) ─────────
function partnerInviteEmailHtml({ buyerName, partnerName, registroUrl }) {
  const safeBuyer   = escapeHtml(buyerName).trim() || 'Tu pareja'
  const safePartner = escapeHtml(partnerName).trim()
  const greeting    = safePartner ? `Hola, ${safePartner}` : 'Hola'

  return `<!DOCTYPE html>
<html lang="es">
<head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>Te han invitado a la Radiografía de Pareja</title></head>
<body style="margin:0;padding:0;background:#080810;font-family:-apple-system,BlinkMacSystemFont,'Helvetica Neue',Helvetica,Arial,sans-serif;">
<table width="100%" cellpadding="0" cellspacing="0" style="background:#080810;">
<tr><td align="center" style="padding:48px 16px 40px;">
  <table width="560" cellpadding="0" cellspacing="0" style="max-width:560px;width:100%;">
    <tr><td align="center" style="padding-bottom:40px;">
      <p style="margin:0;font-size:11px;font-weight:600;letter-spacing:0.3em;text-transform:uppercase;color:rgba(167,139,250,0.7);">LUIS VIRRUETA</p>
    </td></tr>
    <tr><td style="padding-bottom:40px;">
      <div style="height:1px;background:linear-gradient(to right,transparent,rgba(236,72,153,0.5),transparent);"></div>
    </td></tr>
    <tr><td align="center" style="padding-bottom:32px;">
      <h1 style="margin:0 0 12px;font-size:28px;font-weight:300;letter-spacing:-0.03em;color:#ffffff;line-height:1.2;">${greeting}</h1>
      <p style="margin:0;font-size:13px;color:rgba(236,72,153,0.8);letter-spacing:0.05em;text-transform:uppercase;">Radiografía de Pareja — Los Dos</p>
    </td></tr>
    <tr><td style="padding-bottom:16px;">
      <table width="100%" cellpadding="0" cellspacing="0" style="background:#0f0f1a;border:1px solid rgba(236,72,153,0.18);border-radius:20px;overflow:hidden;">
        <tr><td style="padding:40px 40px 32px;">
          <p style="margin:0 0 20px;font-size:15px;line-height:1.8;color:rgba(255,255,255,0.65);"><strong style="color:rgba(255,255,255,0.9);font-weight:400;">${safeBuyer}</strong> quiere que descubran juntos lo que realmente está pasando en su relación. Te ha invitado a la <strong style="color:rgba(255,255,255,0.9);font-weight:400;">Radiografía de Pareja</strong> — un análisis profundo que cruza las respuestas de ambos a través de 11 corrientes psicológicas.</p>
          <p style="margin:0 0 20px;font-size:15px;line-height:1.8;color:rgba(255,255,255,0.65);">Cada uno responde por separado, desde su propia perspectiva. Cuando ambos terminen, <strong style="color:rgba(255,255,255,0.9);font-weight:400;">${safeBuyer}</strong> podrá generar el <strong style="color:rgba(255,255,255,0.9);font-weight:400;">análisis cruzado</strong> desde la pestaña <em style="color:rgba(236,72,153,0.9);">"Análisis Cruzado"</em> en sus resultados. Una vez generado, ambos podrán verlo.</p>
          <p style="margin:0 0 24px;font-size:15px;line-height:1.8;color:rgba(255,255,255,0.65);">Tu acceso ya está pagado. Solo necesitas crear tu cuenta para comenzar.</p>

          <table width="100%" cellpadding="0" cellspacing="0" style="margin:0 0 20px;background:rgba(236,72,153,0.05);border:1px solid rgba(236,72,153,0.15);border-radius:14px;">
            <tr><td style="padding:16px 18px;">
              <p style="margin:0 0 6px;font-size:13px;color:rgba(255,255,255,0.75);font-weight:500;">&#128204; Tu dashboard</p>
              <p style="margin:0;font-size:12px;line-height:1.7;color:rgba(255,255,255,0.5);">Una vez que crees tu cuenta, tu progreso y resultados siempre estarán disponibles en tu dashboard. Si ya tienes cuenta, el cuestionario aparecerá automáticamente ahí.</p>
            </td></tr>
          </table>

          <table width="100%" cellpadding="0" cellspacing="0">
            <tr><td align="center">
              <a href="${registroUrl}" style="display:inline-block;padding:16px 48px;background:linear-gradient(135deg,#db2777,#9333ea);color:#ffffff;text-decoration:none;font-size:15px;font-weight:400;letter-spacing:0.02em;border-radius:12px;">Crear mi cuenta y comenzar &rarr;</a>
            </td></tr>
          </table>
        </td></tr>
      </table>
    </td></tr>
    <tr><td style="padding:24px 0;">
      <div style="height:1px;background:linear-gradient(to right,transparent,rgba(255,255,255,0.06),transparent);"></div>
    </td></tr>
    <tr><td align="center">
      <p style="margin:0 0 6px;font-size:11px;color:rgba(255,255,255,0.2);line-height:1.7;">No necesitas pagar nada. Tu acceso fue cubierto por tu pareja.</p>
      <p style="margin:0;font-size:11px;color:rgba(255,255,255,0.15);">luisvirrueta.com &mdash; hola@luisvirrueta.com</p>
    </td></tr>
  </table>
</td></tr>
</table>
</body></html>`
}

async function handleSendPartnerInvite(req, env) {
  const { partnerEmail, partnerName, buyerName } = await req.json()
  if (!partnerEmail) return json({ error: 'Missing partnerEmail' }, 400)

  const registroUrl = `${SITE_URL}/registro?email=${encodeURIComponent(partnerEmail)}&invite=losdos&package=losdos`

  try {
    await sendEmail(env, {
      to:      partnerEmail,
      subject: `${escapeHtml(buyerName || 'Tu pareja').trim()} te invita a la Radiografía de Pareja`,
      html:    partnerInviteEmailHtml({ buyerName, partnerName, registroUrl }),
    })
    return json({ ok: true })
  } catch (e) {
    console.error('Partner invite email error:', e.message)
    return json({ ok: false, error: e.message }, 500)
  }
}

async function handleSendBackupEmail(req, env) {
  const { token, type, profileData, questions, responses } = await req.json()
  if (!token || !responses) return json({ error: 'Missing data' }, 400)

  const nombre = profileData?.nombre || 'Sin nombre'
  const edad   = profileData?.edad   || '?'
  const pareja = profileData?.pareja || ''
  const typeLabel = getTypeLabel(type || 'solo')

  // Build HTML table of questions + answers
  let rows = ''
  if (questions && Array.isArray(questions)) {
    for (const q of questions) {
      const answer = responses[q.id] || '(sin respuesta)'
      const safeQ = (q.mainQuestion || q.id).replace(/</g, '&lt;')
      const safeA = String(answer).replace(/</g, '&lt;').replace(/\n/g, '<br>')
      rows += `<tr style="border-bottom:1px solid #333">
        <td style="padding:10px;vertical-align:top;color:#a78bfa;font-weight:600;width:40%;font-size:14px">${q.id}. ${safeQ}</td>
        <td style="padding:10px;color:#e2e8f0;font-size:14px">${safeA}</td>
      </tr>`
    }
  } else {
    // Fallback: just list responses by key
    for (const [key, val] of Object.entries(responses)) {
      const safeA = String(val).replace(/</g, '&lt;').replace(/\n/g, '<br>')
      rows += `<tr style="border-bottom:1px solid #333">
        <td style="padding:10px;color:#a78bfa;font-weight:600">${key}</td>
        <td style="padding:10px;color:#e2e8f0">${safeA}</td>
      </tr>`
    }
  }

  const accessUrl = `${RADIOGRAFIA_URL}?token=${token}&type=${type || 'solo'}&view=results`

  const html = `<!DOCTYPE html><html><head><meta charset="UTF-8"></head>
<body style="background:#09090b;color:#e2e8f0;font-family:system-ui,sans-serif;padding:20px">
  <div style="max-width:700px;margin:0 auto">
    <h1 style="color:#a78bfa;font-size:22px;margin-bottom:4px">Respaldo: Cuestionario completado</h1>
    <p style="color:#9ca3af;margin-bottom:20px">${typeLabel} — Token: ${token.slice(0,12)}…</p>
    <table style="margin-bottom:16px;color:#e2e8f0;font-size:14px">
      <tr><td style="padding:4px 12px 4px 0;color:#9ca3af">Nombre:</td><td>${nombre}, ${edad} años</td></tr>
      ${pareja ? `<tr><td style="padding:4px 12px 4px 0;color:#9ca3af">Pareja:</td><td>${pareja}</td></tr>` : ''}
      <tr><td style="padding:4px 12px 4px 0;color:#9ca3af">Fecha:</td><td>${new Date().toISOString().slice(0,16).replace('T',' ')}</td></tr>
    </table>
    <p style="margin-bottom:8px"><a href="${accessUrl}" style="color:#a78bfa">Ver resultados →</a></p>
    <table style="width:100%;border-collapse:collapse;margin-top:16px;background:#111;border-radius:8px;overflow:hidden">
      <thead><tr style="background:#1e1b4b"><th style="padding:10px;text-align:left;color:#c4b5fd">Pregunta</th><th style="padding:10px;text-align:left;color:#c4b5fd">Respuesta</th></tr></thead>
      <tbody>${rows}</tbody>
    </table>
    <p style="color:#6b7280;font-size:12px;margin-top:20px">Este correo es un respaldo automático. Las respuestas también están guardadas en KV con el token.</p>
  </div>
</body></html>`

  try {
    await sendEmail(env, {
      to:      ADMIN_EMAIL,
      subject: `[Respaldo] Cuestionario ${typeLabel} — ${nombre}`,
      html,
    })
    return json({ ok: true })
  } catch (e) {
    console.error('Backup email error:', e.message)
    return json({ ok: false, error: e.message }, 500)
  }
}

// ── Crear sesión Stripe Checkout para Consultas ─────────────────────────────
async function handleCreateConsultaCheckout(req, env) {
  const { type, quantity = 1, promoCode, siteOrigin } = await req.json()
  const isTest = !!(siteOrigin && siteOrigin.includes('localhost'))

  const basePrice = CONSULTA_PRICES[type]
  if (!basePrice) return json({ error: 'Tipo de consulta inválido' }, 400)

  const qty       = Math.max(1, parseInt(quantity) || 1)
  const promo     = promoCode ? CONSULTA_PROMOS[type]?.[promoCode.toUpperCase()] : null
  const unitAmt   = promo ? promo.finalPrice * 100 : basePrice

  const origin    = siteOrigin || SITE_URL
  const params = {
    mode:         'payment',
    line_items:   [{ price_data: {
      currency:     'mxn',
      unit_amount:  String(unitAmt),
      product_data: { name: CONSULTA_NAMES[type] },
    }, quantity: String(qty) }],
    success_url:  `${origin}/tienda/consulta-gracias?type=${type}&session_id={CHECKOUT_SESSION_ID}`,
    cancel_url:   `${origin}/tienda/${type === 'pareja' ? '9' : '8'}`,
    metadata:     { type, quantity: String(qty) },
  }

  const session = await stripe(env, 'POST', '/checkout/sessions', params, isTest)
  return json({ url: session.url })
}

// ── Validar código promo de Consultas ─────────────────────────────────────────
async function handleValidateConsultaPromo(req, env) {
  const { type, promoCode } = await req.json()
  if (!type || !promoCode) return json({ valid: false })
  const code  = promoCode.toUpperCase().trim()
  const promo = CONSULTA_PROMOS[type]?.[code]
  if (!promo) return json({ valid: false, error: 'Código inválido' })
  return json({ valid: true, ...promo })
}

// ── Notificación de compra de Consulta ────────────────────────────────────────
async function handleNotifyConsulta(req, env) {
  // Fire-and-forget: si hay email configurado, notifica a Luis
  try {
    const { sessionId, type } = await req.json()
    if (env.RESEND_API_KEY && sessionId) {
      const label = type === 'pareja' ? 'Consulta de Pareja' : 'Consulta Individual'
      await sendEmail(env, {
        to:      'luisvirruetap@gmail.com',
        subject: `Nueva ${label} vendida`,
        html:    `<p>Se vendió una <strong>${label}</strong>.<br/>Session ID: ${sessionId}</p>`,
      })
    }
  } catch { /* non-critical */ }
  return json({ ok: true })
}

async function handleWebhook(req, env) {
  const rawBody = await req.text()
  const sig     = req.headers.get('stripe-signature')

  if (env.STRIPE_WEBHOOK_SECRET) {
    if (!sig) return json({ error: 'Missing signature' }, 400)
    const valid = await verifyWebhook(rawBody, sig, env.STRIPE_WEBHOOK_SECRET)
    if (!valid) return json({ error: 'Invalid signature' }, 400)
  }

  const event = JSON.parse(rawBody)
  if (event.type === 'checkout.session.completed') {
    const session   = event.data.object
    const email     = session.customer_details?.email || session.customer_email || ''
    const name      = session.customer_details?.name || ''
    const type      = session.metadata?.type || 'solo'
    const sessionId = session.id

    if (env.PURCHASES) {
      const dedupKey = `email_sent:${sessionId}`
      const alreadySent = await env.PURCHASES.get(dedupKey)

      const existingPurchaseRaw = await env.PURCHASES.get(`session:${sessionId}`)
      let token = ''
      if (existingPurchaseRaw) {
        try {
          token = JSON.parse(existingPurchaseRaw)?.token || ''
        } catch {}
      }
      if (!token) token = makeToken()

      const purchase = JSON.stringify({ email, name, type, sessionId, token, createdAt: Date.now(), paid: true })
      await Promise.all([
        env.PURCHASES.put(`session:${sessionId}`, purchase, { expirationTtl: 86400 * 365 }),
        env.PURCHASES.put(`token:${token}`,        purchase, { expirationTtl: 86400 * 365 }),
      ])

      if (!alreadySent && email && env.RESEND_API_KEY) {
        const accessUrl = `${RADIOGRAFIA_URL}?token=${token}&type=${type}&pid=${sessionId}`
        await sendEmail(env, {
          to:      email,
          subject: 'Tu acceso a la Radiografía Psicológica',
          html:    purchaseEmailHtml({ typeLabel: getTypeLabel(type), accessUrl, customerName: name, packageType: type }),
        })
        await env.PURCHASES.put(dedupKey, '1', { expirationTtl: 86400 * 7 })
      }
    }
  }

  return json({ received: true })
}

// ═══════════════════════════════════════════════════════════════════════════════
// AUDIO — Serve MP3 files from R2
// ═══════════════════════════════════════════════════════════════════════════════

async function handleAudio(request, env, pathname) {
  if (!env.AUDIO_BUCKET) {
    return new Response('Audio storage not configured', { status: 503, headers: CORS })
  }
  // pathname = '/audio/diagnostico/q1.mp3'  →  key = 'audio/diagnostico/q1.mp3'
  const key = pathname.slice(1)
  const obj = await env.AUDIO_BUCKET.get(key)
  if (!obj) {
    return new Response('Not found', { status: 404, headers: CORS })
  }
  return new Response(obj.body, {
    headers: {
      'Content-Type': 'audio/mpeg',
      'Cache-Control': 'public, max-age=31536000, immutable',
      'Accept-Ranges': 'bytes',
      ...CORS,
    },
  })
}

// ══ DEEPSEEK PROXY (protects API key) ═══════════════════════════════════════════════════════════

async function handleDeepSeekProxy(req, env) {
  try {
    const apiKey = env.DEEPSEEK_API_KEY
    if (!apiKey) return json({ error: 'DeepSeek API key not configured' }, 500)

    const body = await req.json()
    // Only allow the specific model and enforce limits
    const payload = {
      model: 'deepseek-chat',
      messages: body.messages,
      temperature: Math.min(body.temperature ?? 0.7, 1.5),
      max_tokens: Math.min(body.max_tokens ?? 8192, 8192),
      response_format: body.response_format || undefined,
    }

    const controller = new AbortController()
    const timeout = setTimeout(() => controller.abort(), 240000) // 4 min timeout

    const response = await fetch('https://api.deepseek.com/chat/completions', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${apiKey}` },
      body: JSON.stringify(payload),
      signal: controller.signal,
    })

    clearTimeout(timeout)

    const data = await response.text()
    return new Response(data, {
      status: response.status,
      headers: { 'Content-Type': 'application/json', ...CORS },
    })
  } catch (err) {
    console.error('DeepSeek proxy error:', err.message || err)
    const status = err.name === 'AbortError' ? 504 : 502
    return json({ error: err.name === 'AbortError' ? 'DeepSeek request timed out (4 min)' : (err.message || 'DeepSeek proxy failed') }, status)
  }
}

// ══ ELEVENLABS TTS PROXY (protects API key) ═════════════════════════════════════════════════

async function handleTTSProxy(req, env) {
  const apiKey = env.ELEVENLABS_API_KEY
  if (!apiKey) return json({ error: 'ElevenLabs API key not configured' }, 500)

  const { voice_id, text, model_id, voice_settings } = await req.json()
  if (!voice_id || !text) return json({ error: 'Missing voice_id or text' }, 400)

  const response = await fetch(`https://api.elevenlabs.io/v1/text-to-speech/${encodeURIComponent(voice_id)}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', 'xi-api-key': apiKey },
    body: JSON.stringify({
      text: text.slice(0, 5000),
      model_id: model_id || 'eleven_multilingual_v2',
      voice_settings: voice_settings || { stability: 0.35, similarity_boost: 0.85, style: 0.3, use_speaker_boost: true },
    }),
  })

  if (!response.ok) {
    const err = await response.text().catch(() => '')
    return new Response(err, { status: response.status, headers: CORS })
  }

  return new Response(response.body, {
    headers: { 'Content-Type': 'audio/mpeg', ...CORS },
  })
}

// ── Admin: manage promo codes in KV ──────────────────────────────────────────

async function handleCreatePromoCode(req, env) {
  const { code, discountPercent, free, label, adminSecret } = await req.json()
  if (!adminSecret || adminSecret !== env.ADMIN_SECRET) return json({ error: 'No autorizado' }, 403)
  if (!code || code.length < 2) return json({ error: 'Código requerido (mín 2 caracteres)' }, 400)

  const key = code.toUpperCase().trim()
  const kvRaw = await env.PURCHASES?.get('admin:promo_codes') || '{}'
  const codes = JSON.parse(kvRaw)
  codes[key] = {
    ...(free ? { free: true } : { discountPercent: Number(discountPercent) || 10 }),
    label: label || key,
    createdAt: Date.now(),
  }
  await env.PURCHASES?.put('admin:promo_codes', JSON.stringify(codes))
  return json({ ok: true, code: key, promo: codes[key] })
}

async function handleListPromoCodes(req, env) {
  const { adminSecret } = await req.json()
  if (!adminSecret || adminSecret !== env.ADMIN_SECRET) return json({ error: 'No autorizado' }, 403)
  const builtIn = getPromos(env)
  const kvRaw = await env.PURCHASES?.get('admin:promo_codes') || '{}'
  const custom = JSON.parse(kvRaw)
  return json({ builtIn, custom })
}

async function handleDeletePromoCode(req, env) {
  const { code, adminSecret } = await req.json()
  if (!adminSecret || adminSecret !== env.ADMIN_SECRET) return json({ error: 'No autorizado' }, 403)
  const kvRaw = await env.PURCHASES?.get('admin:promo_codes') || '{}'
  const codes = JSON.parse(kvRaw)
  delete codes[code?.toUpperCase()?.trim()]
  await env.PURCHASES?.put('admin:promo_codes', JSON.stringify(codes))
  return json({ ok: true })
}

// ── Media R2: upload, serve, list, delete ────────────────────────────────────

const MEDIA_CONTENT_TYPES = {
  mp4: 'video/mp4', webm: 'video/webm', mov: 'video/quicktime',
  jpg: 'image/jpeg', jpeg: 'image/jpeg', png: 'image/png', webp: 'image/webp',
  gif: 'image/gif', svg: 'image/svg+xml', avif: 'image/avif',
}

async function handleMediaUpload(req, env) {
  const url = new URL(req.url)
  const adminSecret = url.searchParams.get('secret') || req.headers.get('x-admin-secret')
  if (!adminSecret || adminSecret !== env.ADMIN_SECRET) return json({ error: 'No autorizado' }, 403)

  const folder = url.searchParams.get('folder') || 'misc'
  const filename = url.searchParams.get('filename')
  if (!filename) return json({ error: 'filename requerido' }, 400)

  // Sanitize: only allow safe chars in folder/filename
  const safeFolder = folder.replace(/[^a-zA-Z0-9_\-]/g, '')
  const safeFilename = filename.replace(/[^a-zA-Z0-9_\-\.]/g, '')
  const key = `${safeFolder}/${safeFilename}`
  const ext = safeFilename.split('.').pop()?.toLowerCase()
  const contentType = MEDIA_CONTENT_TYPES[ext] || 'application/octet-stream'

  await env.MEDIA_BUCKET.put(key, req.body, {
    httpMetadata: { contentType, cacheControl: 'public, max-age=31536000, immutable' },
  })

  return json({ ok: true, key, url: `/media/${key}`, contentType })
}

async function handleMediaServe(req, env, pathname) {
  const key = pathname.replace('/media/', '')
  if (!key) return json({ error: 'key requerido' }, 400)

  const object = await env.MEDIA_BUCKET.get(key)
  if (!object) return new Response('Not found', { status: 404, headers: CORS })

  const headers = new Headers(CORS)
  headers.set('Content-Type', object.httpMetadata?.contentType || 'application/octet-stream')
  headers.set('Cache-Control', 'public, max-age=31536000, immutable')
  headers.set('ETag', object.httpEtag)

  return new Response(object.body, { headers })
}

async function handleBlogMeta(req, env) {
  const url = new URL(req.url)
  const slug = url.searchParams.get('slug')
  if (!slug) return json({ error: 'slug requerido' }, 400)

  try {
    const token = await getFirebaseAccessToken(env)
    const queryUrl = `${FIRESTORE_BASE}:runQuery`
    const body = {
      structuredQuery: {
        from: [{ collectionId: 'blog_articles' }],
        where: {
          fieldFilter: {
            field: { fieldPath: 'slug' },
            op: 'EQUAL',
            value: { stringValue: slug }
          }
        },
        limit: 1
      }
    }
    const res = await fetch(queryUrl, {
      method: 'POST',
      headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' },
      body: JSON.stringify(body)
    })
    if (!res.ok) return json({ error: 'Firestore query failed' }, 500)
    const results = await res.json()
    const doc = results?.[0]?.document
    if (!doc) return json({ title: null, description: null, image: null })
    const article = firestoreDocToJson(doc)
    return json({
      title: article.title || '',
      subtitle: article.subtitle || '',
      description: article.excerpt || '',
      image: article.image_url || '',
      author: article.author || 'Luis Virrueta',
      category: article.category || '',
      published_at: article.published_at || '',
      tags: article.tags || []
    })
  } catch (err) {
    return json({ error: 'Error fetching blog meta' }, 500)
  }
}

async function handleMediaList(req, env) {
  const { folder, adminSecret } = await req.json()
  if (!adminSecret || adminSecret !== env.ADMIN_SECRET) return json({ error: 'No autorizado' }, 403)

  const prefix = folder ? `${folder}/` : ''
  const listed = await env.MEDIA_BUCKET.list({ prefix, limit: 500 })
  const files = listed.objects.map(o => ({
    key: o.key,
    size: o.size,
    uploaded: o.uploaded,
    url: `/media/${o.key}`,
  }))
  return json({ files, truncated: listed.truncated })
}

async function handleMediaDelete(req, env) {
  const { key, adminSecret } = await req.json()
  if (!adminSecret || adminSecret !== env.ADMIN_SECRET) return json({ error: 'No autorizado' }, 403)
  if (!key) return json({ error: 'key requerido' }, 400)
  await env.MEDIA_BUCKET.delete(key)
  return json({ ok: true })
}

// ── Email verification via 6-digit code ─────────────────────────────────────
function verificationEmailHtml(code, name) {
  const digits = String(code).split('')
  const safeName = name ? escapeHtml(name).trim() : ''
  const greeting = safeName ? `Bienvenido, <span style="color:#c4b5fd;">${safeName}</span>` : 'Bienvenido'
  const digitCells = digits.map(d =>
    `<td style="width:48px;height:56px;text-align:center;font-size:30px;font-weight:700;letter-spacing:0.05em;color:#fff;background:linear-gradient(135deg,rgba(99,102,241,0.25),rgba(139,92,246,0.18));border:1px solid rgba(139,92,246,0.35);border-radius:12px;">${d}</td>`
  ).join('<td style="width:6px;"></td>')
  return `<!DOCTYPE html>
<html lang="es">
<head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>Código de verificación</title></head>
<body style="margin:0;padding:0;background:#080810;font-family:-apple-system,BlinkMacSystemFont,'Helvetica Neue',Helvetica,Arial,sans-serif;">
<table width="100%" cellpadding="0" cellspacing="0" style="background:#080810;">
<tr><td align="center" style="padding:48px 16px 40px;">
  <table width="560" cellpadding="0" cellspacing="0" style="max-width:560px;width:100%;">
    <tr><td align="center" style="padding-bottom:32px;">
      <p style="margin:0;font-size:11px;font-weight:600;letter-spacing:0.3em;text-transform:uppercase;color:rgba(167,139,250,0.7);">LUIS VIRRUETA</p>
    </td></tr>
    <tr><td style="padding-bottom:32px;">
      <div style="height:1px;background:linear-gradient(90deg,transparent,rgba(167,139,250,0.3),transparent);"></div>
    </td></tr>
    <tr><td style="padding-bottom:28px;">
      <h1 style="margin:0 0 8px;font-size:26px;font-weight:300;color:#fff;text-align:center;line-height:1.3;">${greeting}</h1>
      <p style="margin:0;font-size:13px;color:rgba(255,255,255,0.35);text-align:center;letter-spacing:0.05em;text-transform:uppercase;">Verificación de cuenta</p>
    </td></tr>
    <tr><td style="padding-bottom:28px;">
      <table width="100%" cellpadding="0" cellspacing="0" style="background:#0f0f1a;border:1px solid rgba(124,58,237,0.18);border-radius:16px;">
        <tr><td style="padding:28px 24px;text-align:center;">
          <p style="margin:0 0 6px;font-size:14px;color:rgba(255,255,255,0.55);line-height:1.6;">Estás a un paso de acceder a tu radiografía.</p>
          <p style="margin:0 0 20px;font-size:14px;color:rgba(255,255,255,0.55);line-height:1.6;">Ingresa este código en la pantalla de verificación:</p>
          <table cellpadding="0" cellspacing="0" style="margin:0 auto;"><tr>${digitCells}</tr></table>
          <p style="margin:16px 0 0;font-size:12px;color:rgba(255,255,255,0.3);">Válido por 15 minutos</p>
        </td></tr>
      </table>
    </td></tr>
    <tr><td style="padding-bottom:28px;">
      <p style="margin:0;font-size:13px;line-height:1.6;color:rgba(255,255,255,0.35);text-align:center;">Si no solicitaste esta verificación, puedes ignorar este correo.</p>
    </td></tr>
    <tr><td style="padding-bottom:20px;">
      <div style="height:1px;background:linear-gradient(90deg,transparent,rgba(167,139,250,0.12),transparent);"></div>
    </td></tr>
    <tr><td align="center">
      <p style="margin:0;font-size:11px;color:rgba(255,255,255,0.2);">luisvirrueta.com</p>
    </td></tr>
  </table>
</td></tr>
</table>
</body></html>`
}

async function handleSendVerificationCode(request, env) {
  const { email, name } = await request.json()
  if (!email) return json({ error: 'Email requerido' }, 400)

  // Generate 6-digit code
  const code = String(Math.floor(100000 + Math.random() * 900000))

  // Store in KV with 15-minute TTL, keyed by email
  const kvKey = `verify:${email.toLowerCase().trim()}`
  await env.PURCHASES.put(kvKey, code, { expirationTtl: 900 })

  // Send email via Resend
  await sendEmail(env, {
    to: email,
    subject: `${code} — Código de verificación`,
    html: verificationEmailHtml(code, name || ''),
  })

  return json({ ok: true })
}

async function handleVerifyCode(request, env) {
  const { email, code } = await request.json()
  if (!email || !code) return json({ error: 'Email y código requeridos' }, 400)

  const kvKey = `verify:${email.toLowerCase().trim()}`
  const stored = await env.PURCHASES.get(kvKey)

  if (!stored) return json({ valid: false, error: 'Código expirado o no encontrado' })
  if (stored !== String(code).trim()) return json({ valid: false, error: 'Código incorrecto' })

  // Code matches — delete it so it can't be reused
  await env.PURCHASES.delete(kvKey)
  return json({ valid: true })
}

// ═══════════════════════════════════════════════════════════════════════════════
// FIRESTORE REST API HELPERS
// ═══════════════════════════════════════════════════════════════════════════════

const FIRESTORE_BASE = 'https://firestore.googleapis.com/v1/projects/diagnostico-emocional-7b8f7/databases/(default)/documents'

function jsonToFirestoreValue(val) {
  if (val === null || val === undefined) return { nullValue: null }
  if (typeof val === 'string') return { stringValue: val }
  if (typeof val === 'number') return Number.isInteger(val) ? { integerValue: String(val) } : { doubleValue: val }
  if (typeof val === 'boolean') return { booleanValue: val }
  if (Array.isArray(val)) return { arrayValue: { values: val.map(jsonToFirestoreValue) } }
  if (typeof val === 'object') {
    const fields = {}
    for (const [k, v] of Object.entries(val)) fields[k] = jsonToFirestoreValue(v)
    return { mapValue: { fields } }
  }
  return { stringValue: String(val) }
}

function firestoreValueToJson(val) {
  if (!val) return null
  if ('stringValue' in val) return val.stringValue
  if ('integerValue' in val) return Number(val.integerValue)
  if ('doubleValue' in val) return val.doubleValue
  if ('booleanValue' in val) return val.booleanValue
  if ('nullValue' in val) return null
  if ('timestampValue' in val) return val.timestampValue
  if ('arrayValue' in val) return (val.arrayValue.values || []).map(firestoreValueToJson)
  if ('mapValue' in val) {
    const obj = {}
    for (const [k, v] of Object.entries(val.mapValue.fields || {})) obj[k] = firestoreValueToJson(v)
    return obj
  }
  return null
}

function firestoreDocToJson(doc) {
  if (!doc || !doc.fields) return null
  const obj = {}
  for (const [k, v] of Object.entries(doc.fields)) obj[k] = firestoreValueToJson(v)
  return obj
}

async function firestoreGet(env, path) {
  const token = await getFirebaseAccessToken(env)
  const res = await fetch(`${FIRESTORE_BASE}/${path}`, {
    headers: { Authorization: `Bearer ${token}` }
  })
  if (!res.ok) {
    if (res.status === 404) return null
    throw new Error(`Firestore GET ${path}: ${res.status}`)
  }
  return firestoreDocToJson(await res.json())
}

async function firestoreUpdate(env, path, data) {
  const token = await getFirebaseAccessToken(env)
  const fields = {}
  for (const [k, v] of Object.entries(data)) {
    if (v === '__SERVER_TIMESTAMP__') {
      fields[k] = { timestampValue: new Date().toISOString() }
    } else {
      fields[k] = jsonToFirestoreValue(v)
    }
  }
  const fieldPaths = Object.keys(data).map(k => `updateMask.fieldPaths=${encodeURIComponent(k)}`).join('&')
  const res = await fetch(`${FIRESTORE_BASE}/${path}?${fieldPaths}`, {
    method: 'PATCH',
    headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' },
    body: JSON.stringify({ fields })
  })
  if (!res.ok) {
    const errText = await res.text()
    throw new Error(`Firestore PATCH ${path}: ${res.status} — ${errText}`)
  }
}

// ═══════════════════════════════════════════════════════════════════════════════
// SERVER-SIDE ANALYSIS GENERATION
// ═══════════════════════════════════════════════════════════════════════════════

function _delay(ms) { return new Promise(r => setTimeout(r, ms)) }

async function callDeepSeekDirect(env, systemPrompt, userPrompt, partName, maxTokens = 8192) {
  const maxRetries = 3
  for (let attempt = 1; attempt <= maxRetries; attempt++) {
    try {
      const res = await fetch('https://api.deepseek.com/chat/completions', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${env.DEEPSEEK_API_KEY}` },
        signal: AbortSignal.timeout(120000),
        body: JSON.stringify({
          model: 'deepseek-chat',
          messages: [
            { role: 'system', content: systemPrompt },
            { role: 'user', content: userPrompt }
          ],
          temperature: 0.7,
          max_tokens: maxTokens,
          response_format: { type: 'json_object' }
        })
      })
      if (!res.ok) {
        console.error(`DeepSeek [${partName}] error (${attempt}/${maxRetries}): ${res.status}`)
        if (attempt < maxRetries) { await _delay(attempt * 5000); continue }
        return null
      }
      const data = await res.json()
      const content = data.choices?.[0]?.message?.content
      if (!content) {
        if (attempt < maxRetries) { await _delay(attempt * 5000); continue }
        return null
      }
      console.log(`✅ [${partName}] completed (attempt ${attempt})`)
      return JSON.parse(content)
    } catch (err) {
      console.error(`[${partName}] error (${attempt}/${maxRetries}):`, err.message)
      if (attempt < maxRetries) { await _delay(attempt * 5000); continue }
      return null
    }
  }
  return null
}

function postProcessNames(analysis, profileData) {
  if (!analysis || !profileData?.nombre) return analysis
  let str = JSON.stringify(analysis)
  str = str.replace(/\[nombre\]/gi, profileData.nombre)
  if (profileData.nombrePareja) str = str.replace(/\[pareja\]/gi, profileData.nombrePareja)
  return JSON.parse(str)
}

function mergeIndividualParts(parts) {
  const [part1, part2, part3, part4] = parts
  if (!part1?.autoanalisis_usuario) return null
  const merged = {
    ...(part1 || {}),
    ...(part2 ? { analisis_profundo: part2.analisis_profundo, lectura_psicoanalitica: part2.lectura_psicoanalitica } : {}),
    ...(part3 ? {
      dinamica_conflicto: part3.dinamica_conflicto, energia_vinculo: part3.energia_vinculo,
      direccion_probable: part3.direccion_probable, fortalezas: part3.fortalezas,
      riesgos: part3.riesgos, tabla_diagnostica: part3.tabla_diagnostica, sintesis_final: part3.sintesis_final,
    } : {}),
    ...(part4 ? {
      temas_para_consulta: part4.temas_para_consulta, tecnicas_recomendadas: part4.tecnicas_recomendadas,
      libros_recomendados: part4.libros_recomendados, graficas_autoanalisis: part4.graficas_autoanalisis,
    } : {}),
    lecturas_por_enfoque: { ...(part2?.lecturas_por_enfoque || {}), ...(part3?.lecturas_por_enfoque || {}) },
  }
  if (merged.dimensiones) {
    for (const key of Object.keys(merged.dimensiones)) {
      merged.dimensiones[key] = Math.max(0, Math.min(100, Number(merged.dimensiones[key]) || 50))
    }
  }
  return merged
}

// ── Cross-analysis (server-side) ─────────────────────────────────────────────

// Admin-generate constants (condensed version of frontend prompts for server-side generation)
const ADMIN_SYSTEM_PROMPT = `Eres un sistema avanzado de análisis psicológico llamado "Radiografía de Pareja".
Tu objetivo es analizar profundamente la narrativa de una persona sobre su relación para detectar patrones emocionales, dinámicas relacionales, conflictos estructurales, señales de desgaste o fortalecimiento del vínculo, y dirección probable de la relación.
MARCO TEÓRICO — Integra 11 corrientes: Gottman, Sue Johnson (EFT), Esther Perel, Amir Levine, Harville Hendrix (Imago), Stan Tatkin, Gary Chapman, Robert Sternberg, David Schnarch, Terrence Real, Freud + Lacan.
DIMENSIONES PSICOLÓGICAS A MEDIR (0-100): estabilidad_relacional, apego_emocional, conexion_emocional, deseo_erotico, intimidad, sincronia_relacional, patrones_inconscientes, fantasma_relacional, roles_sistemicos, resiliencia_vinculo, vulnerabilidad_emocional, narrativa_futuro.
ESTILO: Sherlock Holmes psicológico — empático pero incisivo. Cita frases textuales del usuario entre comillas. Usa **negrita** solo para conceptos clave antes de dos puntos. USA EL NOMBRE DEL USUARIO constantemente. NUNCA inventes datos. Responde EXCLUSIVAMENTE en formato JSON válido.`

const ADMIN_PART_INSTRUCTIONS = [
  { name: 'Autoanálisis', maxTokens: 8192, instruction: `Analiza la narrativa y genera en JSON: autoanalisis_usuario (apertura_rapport, forma_de_amar, goce_repeticion, lo_que_busca_en_el_otro, lo_que_reclama_afuera, fantasma_relacional, yo_ideal, mecanismos_defensa, tipo_pareja_que_repite, nucleo_del_patron, cierre_transformador — cada uno 2-4 párrafos de prosa narrativa clínica), resumen_relacion (2-3 párrafos), dimensiones (12 dimensiones 0-100), diagnostico (tipo_vinculo, estilo_apego, dinamica_conflicto, tono_relacional), radiografia_inicial (2-3 párrafos). Cita al usuario. Estilo Sherlock Holmes psicológico.` },
  { name: 'Lecturas A', maxTokens: 8192, instruction: `Genera en JSON: analisis_profundo (narrativa_dominante, tensiones_estructurales, evolucion_deseo, dinamica_emocional), lectura_psicoanalitica (proyecciones_inconscientes, fantasma_relacional, roles_simbolicos), lecturas_por_enfoque para gottman (con jinetes, capacidad_reparacion, jinetes_detalle, patron_dominante, zona_riesgo, recurso_disponible), sue_johnson, perel, levine (con estilo_apego), hendrix, tatkin. Cada lectura: titulo, enfoque, interpretacion (3-4 párrafos citando al usuario), indicadores (frases claras en español), puntuacion (0-100).` },
  { name: 'Lecturas B', maxTokens: 8192, instruction: `Genera en JSON: lecturas_por_enfoque para chapman (con lenguaje_usuario, lenguaje_pareja), sternberg (con puntuacion_intimidad, puntuacion_pasion, puntuacion_compromiso), schnarch, real, freud_lacan (con interpretacion_freud, interpretacion_lacan). Cada lectura: titulo, enfoque, interpretacion (3-4 párrafos), indicadores, puntuacion. Más: dinamica_conflicto (tendencia_conflicto, reaccion_usuario, reaccion_pareja, capacidad_reparacion), energia_vinculo (4 métricas 0-100), direccion_probable (3 métricas), fortalezas (3), riesgos (3), tabla_diagnostica (12 filas), sintesis_final (que_ocurre, posibilidades_evolucion, factores_fortalecimiento).` },
  { name: 'Gráficas', maxTokens: 8192, instruction: `Genera en JSON: temas_para_consulta (8 temas personalizados), tecnicas_recomendadas (5-6 con nombre y descripcion), libros_recomendados (6 con titulo, autor, razon, nivel), graficas_autoanalisis (barras_resumen 6-8, polaridades 4-6, cuadrante_apego, espejo 3-5, escena_relacional, identity_gap, defensas 4-6, ciclo_repeticion 5, nucleo_orbital, before_after 4-6, goce_jouissance con posicion/escena/intensidades, timeline_relacion 3-5), cta_terapia_individual (titular, descripcion, 4 puntos), cta_terapia_pareja (titular, descripcion, 4 puntos).` },
]

const CROSS_SYSTEM = `Eres un sistema avanzado de análisis psicológico relacional llamado "Radiografía Cruzada de Pareja".
Tu objetivo es cruzar los resultados INDIVIDUALES de dos personas que están en la MISMA relación, revelando:
- Lo que ambos ven igual y lo que ven de forma radicalmente distinta
- Puntos ciegos de cada uno que el otro revela
- Dinámicas inconscientes complementarias o colisionantes
- La relación REAL vs la relación que cada uno cree tener
MARCO TEÓRICO — Mismas 11 corrientes del análisis individual pero ahora aplicadas AL CRUCE entre dos perspectivas.
ESTILO: Sherlock Holmes psicológico — conecta pistas de ambos lados, revela lo que ninguno puede ver por sí solo. Empático pero incisivo.
REGLAS:
- USA LOS NOMBRES DE AMBOS constantemente
- Cita frases textuales de AMBOS entre comillas
- Usa **negrita** solo para conceptos clave antes de dos puntos
- NUNCA inventes datos
Responde EXCLUSIVAMENTE en formato JSON válido.`

function buildCrossPromptServer(a1, a2, p1, p2) {
  const n1 = p1?.nombre || 'Participante 1', n2 = p2?.nombre || 'Participante 2'
  let p = `## RADIOGRAFÍA CRUZADA — ${n1} y ${n2}\n\nTienes los análisis INDIVIDUALES de dos personas en la MISMA relación.\nCruza ambas perspectivas para revelar la dinámica REAL.\n\n`
  p += `### ANÁLISIS DE ${n1.toUpperCase()}\n`
  if (a1.autoanalisis_usuario) { for (const [k, v] of Object.entries(a1.autoanalisis_usuario)) { if (typeof v === 'string') p += `- ${k}: ${v.slice(0, 500)}...\n` } }
  p += `\n**Dimensiones:** ${JSON.stringify(a1.dimensiones || {})}\n**Fortalezas:** ${JSON.stringify(a1.fortalezas || [])}\n**Riesgos:** ${JSON.stringify(a1.riesgos || [])}\n\n`
  p += `### ANÁLISIS DE ${n2.toUpperCase()}\n`
  if (a2.autoanalisis_usuario) { for (const [k, v] of Object.entries(a2.autoanalisis_usuario)) { if (typeof v === 'string') p += `- ${k}: ${v.slice(0, 500)}...\n` } }
  p += `\n**Dimensiones:** ${JSON.stringify(a2.dimensiones || {})}\n**Fortalezas:** ${JSON.stringify(a2.fortalezas || [])}\n**Riesgos:** ${JSON.stringify(a2.riesgos || [])}\n\n`
  return p
}

const CROSS_INSTR_A = `Genera la PRIMERA PARTE del análisis cruzado en JSON válido. Incluye: apertura, resumen_cruzado, dimensiones_cruzadas (12 dimensiones con p1/p2/interpretacion), puntos_ciegos (p1_no_ve, p2_no_ve), dinamica_real, convergencias, divergencias, y lecturas_cruzadas para: gottman, sue_johnson, perel, levine, hendrix, tatkin. Cada lectura: titulo, interpretacion (2-3 párrafos citando a AMBOS), indicadores (array), puntuacion (0-100).`

const CROSS_INSTR_B = `Genera la SEGUNDA PARTE del análisis cruzado en JSON válido. Incluye lecturas_cruzadas para: chapman, sternberg, schnarch, real, freud_lacan. Más analisis_profundo_cruzado (narrativa_dominante, tensiones_estructurales, evolucion_deseo_cruzada, dinamica_emocional_cruzada), lectura_psicoanalitica_cruzada (proyecciones_mutuas, fantasma_relacional_compartido, goce_compartido), dinamica_conflicto_cruzada (tendencia_conflicto_p1, tendencia_conflicto_p2, patron_dominante, capacidad_reparacion, ciclo_repeticion).`

const CROSS_INSTR_C = `Genera la TERCERA PARTE del análisis cruzado en JSON válido. Incluye: tabla_diagnostica_cruzada (12 filas con dimension, nivel_p1, nivel_p2, interpretacion_cruzada), energia_vinculo_cruzada, indice_sincronia_global (0-100), compatibilidad_corrientes (11 corrientes con score/nivel/resumen), brechas_criticas (3), mensaje_para_ambos (2-3 párrafos), pronostico_relacional (potencial, riesgo, direccion), temas_para_consulta_cruzada (8), tecnicas_recomendadas_cruzada (5-6), cta_terapia_pareja (titular, descripcion, puntos).`

function mergeCrossParts(partA, partB, partC, a1, a2, p1, p2) {
  const merged = { ...partA }
  if (partB) {
    if (partB.lecturas_cruzadas) merged.lecturas_cruzadas = { ...(merged.lecturas_cruzadas || {}), ...partB.lecturas_cruzadas }
    if (partB.analisis_profundo_cruzado) merged.analisis_profundo_cruzado = partB.analisis_profundo_cruzado
    if (partB.lectura_psicoanalitica_cruzada) merged.lectura_psicoanalitica_cruzada = partB.lectura_psicoanalitica_cruzada
    if (partB.dinamica_conflicto_cruzada) merged.dinamica_conflicto_cruzada = partB.dinamica_conflicto_cruzada
  }
  if (partC) {
    for (const k of ['tabla_diagnostica_cruzada','energia_vinculo_cruzada','indice_sincronia_global','compatibilidad_corrientes','brechas_criticas','mensaje_para_ambos','pronostico_relacional','temas_para_consulta_cruzada','tecnicas_recomendadas_cruzada','cta_terapia_pareja']) {
      if (partC[k] != null) merged[k] = partC[k]
    }
  }
  merged._individual = {
    p1: { nombre: p1?.nombre, dimensiones: a1.dimensiones },
    p2: { nombre: p2?.nombre, dimensiones: a2.dimensiones },
  }
  return merged
}

async function runCrossAnalysisFlow(env, uid, purchaseId, analysis, profileData) {
  try {
    const purchase = await firestoreGet(env, `users/${uid}/purchases/${purchaseId}`)
    if (!purchase?.partnerRef) { console.log('⏳ No partner linked'); return }
    const pUid = purchase.partnerRef.uid, pPid = purchase.partnerRef.purchaseId
    if (!pUid || !pPid) return
    const partnerPurchase = await firestoreGet(env, `users/${pUid}/purchases/${pPid}`)
    if (!partnerPurchase?.analysis) { console.log('⏳ Partner not done yet'); return }

    console.log('🔄 Both done — generating cross-analysis server-side...')
    const crossPrompt = buildCrossPromptServer(analysis, partnerPurchase.analysis, profileData, partnerPurchase.profileData)
    const [cA, cB, cC] = await Promise.all([
      callDeepSeekDirect(env, CROSS_SYSTEM, crossPrompt + '\n\n' + CROSS_INSTR_A, 'Cross-A', 10000),
      callDeepSeekDirect(env, CROSS_SYSTEM, crossPrompt + '\n\n' + CROSS_INSTR_B, 'Cross-B', 10000),
      callDeepSeekDirect(env, CROSS_SYSTEM, crossPrompt + '\n\n' + CROSS_INSTR_C, 'Cross-C', 10000),
    ])
    if (!cA) { console.error('❌ Cross Part A failed'); return }
    const crossRaw = mergeCrossParts(cA, cB, cC, analysis, partnerPurchase.analysis, profileData, partnerPurchase.profileData)
    const crossAnalysis = postProcessNames(crossRaw, profileData)

    await Promise.all([
      firestoreUpdate(env, `users/${uid}/purchases/${purchaseId}`, { crossAnalysis, crossAnalysisAddedAt: '__SERVER_TIMESTAMP__' }),
      firestoreUpdate(env, `users/${pUid}/purchases/${pPid}`, { crossAnalysis, crossAnalysisAddedAt: '__SERVER_TIMESTAMP__' }),
    ])
    console.log('✅ Cross-analysis saved to both purchases')

    const partnerProfile = await firestoreGet(env, `users/${pUid}`)
    const emails = [purchase.buyerEmail || '', partnerProfile?.email || partnerPurchase.partnerEmail || ''].filter(e => e.includes('@'))
    for (const em of emails) {
      await sendEmail(env, { to: em, subject: 'Tu radiografía cruzada de pareja está lista', html: crossAnalysisEmailHtml({ accessUrl: `${SITE_URL}/perfil` }) })
    }
    console.log(`📧 Cross email sent to ${emails.join(', ')}`)
  } catch (err) { console.error('❌ Cross-analysis error:', err) }
}

async function handleGenerateAnalysis(request, env, ctx) {
  const body = await request.json()
  const { uid, purchaseId, email, packageType, profileData, systemPrompt, basePrompt, partInstructions } = body
  if (!uid || !purchaseId || !partInstructions?.length || !systemPrompt || !basePrompt) {
    return json({ error: 'Missing required fields' }, 400)
  }

  // Save analysis request data to Firestore so retry always works
  try {
    await firestoreUpdate(env, `users/${uid}/purchases/${purchaseId}`, {
      status: 'analyzing',
      analysisRequest: { email, packageType, profileData, systemPrompt, basePrompt, partInstructions },
      updatedAt: '__SERVER_TIMESTAMP__',
    })
  } catch (e) {
    console.error('Failed to save analysis request:', e)
  }

  // Process in background — respond immediately so client doesn't timeout
  ctx.waitUntil(processAnalysisInBackground(env, body, ctx))
  return json({ ok: true, message: 'Analysis queued' })
}

async function processAnalysisInBackground(env, body, ctx) {
  const { uid, purchaseId, email, packageType, profileData, systemPrompt, basePrompt, partInstructions } = body
  try {
    console.log(`🚀 Server-side analysis for ${uid}/${purchaseId}`)
    const results = await Promise.all(
      partInstructions.map(p => callDeepSeekDirect(env, systemPrompt, basePrompt + '\n\n' + p.instruction, p.name, p.maxTokens || 8192))
    )
    const raw = mergeIndividualParts(results)
    if (!raw) {
      console.error('❌ Analysis failed — autoanálisis not generated')
      await firestoreUpdate(env, `users/${uid}/purchases/${purchaseId}`, { status: 'error', errorMessage: 'Analysis generation failed — DeepSeek returned empty results', updatedAt: '__SERVER_TIMESTAMP__' })
      return
    }
    const analysis = postProcessNames(raw, profileData)
    await firestoreUpdate(env, `users/${uid}/purchases/${purchaseId}`, { analysis, status: 'completed', completedAt: '__SERVER_TIMESTAMP__' })
    console.log(`✅ Analysis saved for ${uid}/${purchaseId}`)

    if (email) {
      const typeLabel = getTypeLabel(packageType || 'solo')
      await sendEmail(env, {
        to: email,
        subject: packageType === 'descubre' ? 'Tu mapa psicológico está listo' : 'Tu radiografía psicológica está lista',
        html: analysisEmailHtml({ typeLabel, accessUrl: `${SITE_URL}/perfil`, packageType: packageType || 'solo' }),
      })
      console.log(`📧 Email sent to ${email}`)
    }

    // Cross-analysis can run in background — it's optional and individually shorter
    if (packageType === 'losdos') {
      // Don't nest ctx.waitUntil inside another — just await it
      await runCrossAnalysisFlow(env, uid, purchaseId, analysis, profileData)
    }
  } catch (err) {
    console.error('❌ Server analysis error:', err)
    try { await firestoreUpdate(env, `users/${uid}/purchases/${purchaseId}`, { status: 'error', errorMessage: err.message, updatedAt: '__SERVER_TIMESTAMP__' }) } catch (e) {}
  }
}

// Retry endpoint — reads saved analysis request from Firestore purchase
async function handleRetryAnalysis(request, env, ctx) {
  const { uid, purchaseId } = await request.json()
  if (!uid || !purchaseId) return json({ error: 'Missing uid or purchaseId' }, 400)

  const purchase = await firestoreGet(env, `users/${uid}/purchases/${purchaseId}`)
  if (!purchase) return json({ error: 'Purchase not found' }, 404)

  // If already completed, no need to retry
  if (purchase.status === 'completed' && purchase.analysis) {
    return json({ ok: true, message: 'Analysis already completed' })
  }

  const req = purchase.analysisRequest
  if (!req || !req.partInstructions?.length || !req.systemPrompt || !req.basePrompt) {
    return json({ error: 'No saved analysis request data found. Cannot retry.' }, 400)
  }

  const body = { uid, purchaseId, ...req }
  await firestoreUpdate(env, `users/${uid}/purchases/${purchaseId}`, { status: 'analyzing', updatedAt: '__SERVER_TIMESTAMP__' })
  ctx.waitUntil(processAnalysisInBackground(env, body, ctx))
  return json({ ok: true, message: 'Retry queued' })
}

// Admin-triggered cross-analysis generation
async function handleAdminCrossAnalysis(request, env, ctx) {
  const { uid, purchaseId } = await request.json()
  if (!uid || !purchaseId) return json({ error: 'Missing uid or purchaseId' }, 400)
  const purchase = await firestoreGet(env, `users/${uid}/purchases/${purchaseId}`)
  if (!purchase) return json({ error: 'Purchase not found' }, 404)
  if (!purchase.analysis) return json({ error: 'Individual analysis not found for this user' }, 400)
  if (!purchase.partnerRef?.uid || !purchase.partnerRef?.purchaseId) return json({ error: 'No partner linked' }, 400)
  const partnerPurchase = await firestoreGet(env, `users/${purchase.partnerRef.uid}/purchases/${purchase.partnerRef.purchaseId}`)
  if (!partnerPurchase?.analysis) return json({ error: 'Partner individual analysis not found' }, 400)
  if (purchase.crossAnalysis) return json({ ok: true, message: 'Cross-analysis already exists' })

  ctx.waitUntil((async () => {
    try {
      console.log(`🔧 Admin cross-analysis for ${uid}/${purchaseId}`)
      const crossPrompt = buildCrossPromptServer(purchase.analysis, partnerPurchase.analysis, purchase.profileData, partnerPurchase.profileData)
      const [cA, cB, cC] = await Promise.all([
        callDeepSeekDirect(env, CROSS_SYSTEM, crossPrompt + '\n\n' + CROSS_INSTR_A, 'Cross-A', 10000),
        callDeepSeekDirect(env, CROSS_SYSTEM, crossPrompt + '\n\n' + CROSS_INSTR_B, 'Cross-B', 10000),
        callDeepSeekDirect(env, CROSS_SYSTEM, crossPrompt + '\n\n' + CROSS_INSTR_C, 'Cross-C', 10000),
      ])
      if (!cA) { console.error('❌ Admin cross Part A failed'); return }
      const crossRaw = mergeCrossParts(cA, cB, cC, purchase.analysis, partnerPurchase.analysis, purchase.profileData, partnerPurchase.profileData)
      const crossAnalysis = postProcessNames(crossRaw, purchase.profileData)
      const pUid = purchase.partnerRef.uid, pPid = purchase.partnerRef.purchaseId
      await Promise.all([
        firestoreUpdate(env, `users/${uid}/purchases/${purchaseId}`, { crossAnalysis, crossAnalysisAddedAt: '__SERVER_TIMESTAMP__' }),
        firestoreUpdate(env, `users/${pUid}/purchases/${pPid}`, { crossAnalysis, crossAnalysisAddedAt: '__SERVER_TIMESTAMP__' }),
      ])
      console.log('✅ Admin cross-analysis saved to both purchases')
      // Send email notification
      const partnerProfile = await firestoreGet(env, `users/${pUid}`)
      const emails = [purchase.buyerEmail || '', partnerProfile?.email || partnerPurchase.partnerEmail || ''].filter(e => e.includes('@'))
      for (const em of emails) {
        await sendEmail(env, { to: em, subject: 'Tu radiografía cruzada de pareja está lista', html: crossAnalysisEmailHtml({ accessUrl: `${SITE_URL}/perfil` }) })
      }
    } catch (err) { console.error('❌ Admin cross-analysis error:', err) }
  })())
  return json({ ok: true, message: 'Cross-analysis generation queued' })
}

// Admin-triggered individual analysis generation
// Reads purchase from Firestore, uses saved analysisRequest if available, otherwise builds prompt from responses
async function handleAdminGenerate(request, env, ctx) {
  const { uid, purchaseId } = await request.json()
  if (!uid || !purchaseId) return json({ error: 'Missing uid or purchaseId' }, 400)
  const purchase = await firestoreGet(env, `users/${uid}/purchases/${purchaseId}`)
  if (!purchase) return json({ error: 'Purchase not found' }, 404)

  // If analysisRequest exists (saved from original generation attempt), reuse it
  if (purchase.analysisRequest?.systemPrompt && purchase.analysisRequest?.basePrompt && purchase.analysisRequest?.partInstructions?.length) {
    const body = { uid, purchaseId, ...purchase.analysisRequest }
    await firestoreUpdate(env, `users/${uid}/purchases/${purchaseId}`, { status: 'analyzing', updatedAt: '__SERVER_TIMESTAMP__' })
    ctx.waitUntil(processAnalysisInBackground(env, body, ctx))
    return json({ ok: true, message: 'Analysis queued (using saved request)' })
  }

  // No saved request — check we have responses
  if (!purchase.responses || Object.keys(purchase.responses).length === 0) {
    return json({ error: 'No responses found in this purchase' }, 400)
  }

  // Build prompt server-side from stored data
  const profileData = purchase.profileData || {}
  const packageType = purchase.packageType || 'solo'
  const responses = purchase.responses
  const nombre = profileData.nombre || 'Usuario'

  let basePrompt = '## RESPUESTAS DEL CUESTIONARIO NARRATIVO — RADIOGRAFÍA DE PAREJA PREMIUM\n\n'
  if (packageType === 'descubre') {
    basePrompt += '### TIPO DE PAQUETE: INDIVIDUAL (Descifra tu forma de amar)\nEl usuario NO necesariamente tiene pareja actual. El enfoque principal es su PATRÓN DE AMOR.\n\n'
  } else if (packageType === 'losdos') {
    basePrompt += '### TIPO DE PAQUETE: PAREJA — LOS DOS (Reporte individual)\nEste es el reporte INDIVIDUAL de este participante dentro del paquete Los Dos.\n\n'
  }
  basePrompt += `### DATOS DEL USUARIO\n- Nombre: ${nombre}\n`
  if (profileData.edad) basePrompt += `- Edad: ${profileData.edad}\n`
  basePrompt += `\n(USA EL NOMBRE DEL USUARIO EN EL REPORTE para generar cercanía y rapport.)\n\n`
  basePrompt += '(Cada respuesta fue dada verbalmente — la persona habló con libertad, sin filtro escrito.)\n\n'

  for (let i = 1; i <= 40; i++) {
    const qid = `Q${i}`
    const answer = responses[qid]
    if (answer && typeof answer === 'string' && answer.trim()) {
      basePrompt += `**${qid}.**\n→ "${answer.trim()}"\n\n`
    } else {
      basePrompt += `**${qid}.**\n→ (no respondió — infiere desde el contexto global)\n\n`
    }
  }
  basePrompt += '\nRealiza el análisis psicológico completo siguiendo las 6 fases del sistema.\n'

  // Get user email for notification
  const userProfile = await firestoreGet(env, `users/${uid}`)
  const email = userProfile?.email || purchase.buyerEmail || ''

  // Use the same system prompt as the frontend
  const systemPrompt = ADMIN_SYSTEM_PROMPT
  const partInstructions = ADMIN_PART_INSTRUCTIONS

  const body = { uid, purchaseId, email, packageType, profileData, systemPrompt, basePrompt, partInstructions }

  // Save analysisRequest so future retries work
  await firestoreUpdate(env, `users/${uid}/purchases/${purchaseId}`, {
    status: 'analyzing',
    analysisRequest: { email, packageType, profileData, systemPrompt, basePrompt, partInstructions },
    updatedAt: '__SERVER_TIMESTAMP__',
  })

  ctx.waitUntil(processAnalysisInBackground(env, body, ctx))
  return json({ ok: true, message: 'Analysis generation queued' })
}

// ═══════════════════════════════════════════════════════════════════════════════
// ROUTER
// ═══════════════════════════════════════════════════════════════════════════════

export default {
  async fetch(request, env, ctx) {
    const { method } = request
    const { pathname } = new URL(request.url)

    if (method === 'OPTIONS') return new Response(null, { headers: CORS })

    try {
      // ── Audio from R2 (GET /audio/*) ──────────────────────────────
      if (method === 'GET' && pathname.startsWith('/audio/')) return handleAudio(request, env, pathname)

      // ── Media from R2 (GET /media/*) ──────────────────────────────
      if (method === 'GET' && pathname.startsWith('/media/')) return handleMediaServe(request, env, pathname)

      if (method === 'GET' && pathname === '/api/get-analysis')       return handleGetAnalysis(request, env)
      if (method === 'GET' && pathname === '/api/get-cross-analysis')  return handleGetCrossAnalysis(request, env)
      if (method === 'GET' && pathname === '/api/get-profile')         return handleGetProfile(request, env)
      if (method === 'GET' && pathname === '/api/blog-meta')           return handleBlogMeta(request, env)

      if (method === 'POST' || method === 'PUT') {
        if ((method === 'PUT' || method === 'POST') && pathname === '/api/media-upload') return handleMediaUpload(request, env)
        if (pathname === '/api/media-list')                          return handleMediaList(request, env)
        if (pathname === '/api/media-delete')                        return handleMediaDelete(request, env)
        if (pathname === '/api/create-radiografia-checkout') return handleCreateCheckout(request, env)
        if (pathname === '/api/create-custom-checkout')     return handleCreateCustomCheckout(request, env)
        if (pathname === '/api/create-promo-code')         return handleCreatePromoCode(request, env)
        if (pathname === '/api/list-promo-codes')           return handleListPromoCodes(request, env)
        if (pathname === '/api/delete-promo-code')          return handleDeletePromoCode(request, env)
        if (pathname === '/api/verify-payment')              return handleVerifyPayment(request, env)
        if (pathname === '/api/validate-radiografia-promo')  return handleValidatePromo(request, env)
        if (pathname === '/api/send-access-email')           return handleSendAccessEmail(request, env)
        if (pathname === '/api/save-analysis')               return handleSaveAnalysis(request, env)
        if (pathname === '/api/save-profile')                return handleSaveProfile(request, env)
        if (pathname === '/api/send-analysis-email')         return handleSendAnalysisEmail(request, env)
        if (pathname === '/api/send-backup-email')           return handleSendBackupEmail(request, env)
        if (pathname === '/api/send-partner-invite')         return handleSendPartnerInvite(request, env)
        if (pathname === '/api/check-cross-status')          return handleCheckCrossStatus(request, env)
        if (pathname === '/api/mark-partner-done')           return handleMarkPartnerDone(request, env)
        if (pathname === '/api/save-cross-analysis')         return handleSaveCrossAnalysis(request, env)
        if (pathname === '/api/send-cross-analysis-email')   return handleSendCrossAnalysisEmail(request, env)
        if (pathname === '/api/create-consulta-checkout')    return handleCreateConsultaCheckout(request, env)
        if (pathname === '/api/validate-consulta-promo')     return handleValidateConsultaPromo(request, env)
        if (pathname === '/api/notify-consulta-purchase')    return handleNotifyConsulta(request, env)
        if (pathname === '/api/send-verification-code')      return handleSendVerificationCode(request, env)
        if (pathname === '/api/verify-code')                 return handleVerifyCode(request, env)
        if (pathname === '/api/delete-auth-user')            return handleDeleteAuthUser(request, env)
        if (pathname === '/webhook')                         return handleWebhook(request, env)
        if (pathname === '/api/deepseek-proxy')               return handleDeepSeekProxy(request, env)
        if (pathname === '/api/generate-analysis')            return handleGenerateAnalysis(request, env, ctx)
        if (pathname === '/api/retry-analysis')               return handleRetryAnalysis(request, env, ctx)
        if (pathname === '/api/admin-cross-analysis')         return handleAdminCrossAnalysis(request, env, ctx)
        if (pathname === '/api/admin-generate')               return handleAdminGenerate(request, env, ctx)
        if (pathname === '/api/tts-proxy')                    return handleTTSProxy(request, env)
      }
      return json({ ok: true, worker: 'radiografia-worker', path: pathname })
    } catch (err) {
      console.error('Worker error:', err)
      return json({ error: err.message }, 500)
    }
  },
}
