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

const SITE_URL       = 'https://www.luisvirrueta.com'
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
  'Access-Control-Allow-Methods': 'GET,POST,OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type',
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

function getPromos(env) {
  try { return { ...BUILT_IN_PROMOS, ...JSON.parse(env.PROMO_CODES_JSON || '{}') } }
  catch { return BUILT_IN_PROMOS }
}

function getTypeLabel(type) {
  return { descubre: 'Individual', solo: 'Pareja — Solo', losdos: 'Pareja — Los Dos' }[type] || type
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
  const greetingTitle = safeName ? `Gracias, ${safeName}` : 'Gracias por tu compra'

  // Package-specific body text
  const bodyText = packageType === 'descubre'
    ? `<p style="margin:0 0 20px;font-size:15px;line-height:1.8;color:rgba(255,255,255,0.65);">Tu acceso al cuestionario de autoconocimiento ya está activo. Responde a tu ritmo — no hay respuestas correctas ni incorrectas, solo tu verdad.</p>`
    : packageType === 'losdos'
    ? `<p style="margin:0 0 20px;font-size:15px;line-height:1.8;color:rgba(255,255,255,0.65);">Tu acceso personal al cuestionario ya está activo. Tu pareja también recibirá su propio enlace. Cada uno responde por separado — cuando ambos terminen, recibirán un <strong style="color:rgba(255,255,255,0.85);font-weight:400;">análisis cruzado</strong> con la radiografía de la relación vista desde los dos lados.</p>`
    : `<p style="margin:0 0 20px;font-size:15px;line-height:1.8;color:rgba(255,255,255,0.65);">Tu acceso personal al cuestionario ya está activo. Usa el botón de abajo para comenzar cuando estés listo.</p>`

  // Package-specific analysis includes
  const includesItems = packageType === 'descubre'
    ? `<tr><td style="padding:4px 0;font-size:13px;color:rgba(255,255,255,0.5);">&mdash;&nbsp; 40 preguntas guiadas por voz</td></tr>
            <tr><td style="padding:4px 0;font-size:13px;color:rgba(255,255,255,0.5);">&mdash;&nbsp; 11 marcos psicológicos aplicados a tu caso</td></tr>
            <tr><td style="padding:4px 0;font-size:13px;color:rgba(255,255,255,0.5);">&mdash;&nbsp; Mapa profundo de tus patrones emocionales</td></tr>
            <tr><td style="padding:4px 0;font-size:13px;color:rgba(255,255,255,0.5);">&mdash;&nbsp; Autoanálisis de tus dinámicas inconscientes</td></tr>
            <tr><td style="padding:4px 0;font-size:13px;color:rgba(255,255,255,0.5);">&mdash;&nbsp; Reporte PDF para guardar o compartir</td></tr>`
    : packageType === 'losdos'
    ? `<tr><td style="padding:4px 0;font-size:13px;color:rgba(255,255,255,0.5);">&mdash;&nbsp; 40 preguntas guiadas por voz (cada uno)</td></tr>
            <tr><td style="padding:4px 0;font-size:13px;color:rgba(255,255,255,0.5);">&mdash;&nbsp; 11 marcos psicológicos aplicados a cada perspectiva</td></tr>
            <tr><td style="padding:4px 0;font-size:13px;color:rgba(255,255,255,0.5);">&mdash;&nbsp; Radiografía individual de cada uno</td></tr>
            <tr><td style="padding:4px 0;font-size:13px;color:rgba(255,255,255,0.5);">&mdash;&nbsp; Análisis cruzado comparativo de ambos</td></tr>
            <tr><td style="padding:4px 0;font-size:13px;color:rgba(255,255,255,0.5);">&mdash;&nbsp; Gráficas lado a lado de 12 dimensiones</td></tr>
            <tr><td style="padding:4px 0;font-size:13px;color:rgba(255,255,255,0.5);">&mdash;&nbsp; Reporte PDF para ambos</td></tr>`
    : `<tr><td style="padding:4px 0;font-size:13px;color:rgba(255,255,255,0.5);">&mdash;&nbsp; 40 preguntas guiadas por voz</td></tr>
            <tr><td style="padding:4px 0;font-size:13px;color:rgba(255,255,255,0.5);">&mdash;&nbsp; 11 marcos psicológicos aplicados a tu caso</td></tr>
            <tr><td style="padding:4px 0;font-size:13px;color:rgba(255,255,255,0.5);">&mdash;&nbsp; Mapa de 12 dimensiones de tu vínculo</td></tr>
            <tr><td style="padding:4px 0;font-size:13px;color:rgba(255,255,255,0.5);">&mdash;&nbsp; Autoanálisis de tus patrones inconscientes</td></tr>
            <tr><td style="padding:4px 0;font-size:13px;color:rgba(255,255,255,0.5);">&mdash;&nbsp; Reporte PDF para guardar o compartir</td></tr>`

  return `<!DOCTYPE html>
<html lang="es">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width,initial-scale=1">
  <title>Gracias por tu compra</title>
</head>
<body style="margin:0;padding:0;background:#080810;font-family:-apple-system,BlinkMacSystemFont,'Helvetica Neue',Helvetica,Arial,sans-serif;">

<table width="100%" cellpadding="0" cellspacing="0" style="background:#080810;">
<tr><td align="center" style="padding:48px 16px 40px;">

  <table width="560" cellpadding="0" cellspacing="0" style="max-width:560px;width:100%;">

    <!-- Logotipo / wordmark -->
    <tr><td align="center" style="padding-bottom:40px;">
      <p style="margin:0;font-size:11px;font-weight:600;letter-spacing:0.3em;text-transform:uppercase;color:rgba(167,139,250,0.7);">LUIS VIRRUETA</p>
    </td></tr>

    <!-- Separador sutil -->
    <tr><td style="padding-bottom:40px;">
      <div style="height:1px;background:linear-gradient(to right,transparent,rgba(124,58,237,0.4),transparent);"></div>
    </td></tr>

    <!-- Headline -->
    <tr><td align="center" style="padding-bottom:32px;">
      <h1 style="margin:0 0 12px;font-size:28px;font-weight:300;letter-spacing:-0.03em;color:#ffffff;line-height:1.2;">${greetingTitle}</h1>
      <p style="margin:0;font-size:13px;color:rgba(167,139,250,0.8);letter-spacing:0.05em;text-transform:uppercase;">${typeLabel}</p>
    </td></tr>

    <!-- Card principal -->
    <tr><td style="padding-bottom:16px;">
      <table width="100%" cellpadding="0" cellspacing="0" style="background:#0f0f1a;border:1px solid rgba(124,58,237,0.18);border-radius:20px;overflow:hidden;">
        <tr><td style="padding:40px 40px 32px;">
          ${bodyText}
          <p style="margin:0 0 32px;font-size:15px;line-height:1.8;color:rgba(255,255,255,0.65);"><strong style="color:rgba(255,255,255,0.85);font-weight:400;">¿Cerraste el navegador o cambiaste de dispositivo?</strong> No hay problema — este mismo enlace te lleva exactamente al punto donde lo dejaste. Guarda este correo; es tu acceso permanente.</p>

          <table width="100%" cellpadding="0" cellspacing="0" style="margin:0 0 28px;background:#111427;border:1px solid rgba(99,102,241,0.28);border-radius:14px;">
            <tr><td style="padding:14px 16px;font-size:13px;color:rgba(255,255,255,0.78);line-height:1.6;">
              <strong style="color:#ffffff;font-weight:600;">Resumen rápido</strong><br>
              <span style="color:rgba(255,255,255,0.68);">&#10003; Acceso activado inmediatamente</span><br>
              <span style="color:rgba(255,255,255,0.68);">&#10003; Puedes continuar en cualquier dispositivo</span><br>
              <span style="color:rgba(255,255,255,0.68);">&#10003; Conserva este correo como llave de entrada</span>
            </td></tr>
          </table>

          <table width="100%" cellpadding="0" cellspacing="0">
            <tr><td align="center">
              <a href="${accessUrl}" style="display:inline-block;padding:16px 48px;background:linear-gradient(135deg,#6d28d9,#9333ea);color:#ffffff;text-decoration:none;font-size:15px;font-weight:400;letter-spacing:0.02em;border-radius:12px;">Comenzar mi cuestionario &rarr;</a>
            </td></tr>
          </table>
        </td></tr>
      </table>
    </td></tr>

    <!-- Lo que incluye -->
    <tr><td style="padding-bottom:16px;">
      <table width="100%" cellpadding="0" cellspacing="0" style="background:#0f0f1a;border:1px solid rgba(255,255,255,0.05);border-radius:16px;">
        <tr><td style="padding:24px 32px;">
          <p style="margin:0 0 16px;font-size:10px;font-weight:600;letter-spacing:0.2em;text-transform:uppercase;color:rgba(255,255,255,0.3);">Tu análisis incluirá</p>
          <table cellpadding="0" cellspacing="0">
            ${includesItems}
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
      <p style="margin:0 0 6px;font-size:11px;color:rgba(255,255,255,0.2);line-height:1.7;">Este enlace es personal y no caduca. Guarda este correo.</p>
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
    : 'Tu radiografía psicológica<br>está lista'

  const bodyParagraphs = packageType === 'losdos'
    ? `<p style="margin:0 0 20px;font-size:15px;line-height:1.8;color:rgba(255,255,255,0.65);">El análisis de tus respuestas acaba de terminar. Tu radiografía individual ya está lista.</p>
          <p style="margin:0 0 32px;font-size:15px;line-height:1.8;color:rgba(255,255,255,0.65);">Cuando tu pareja también termine su cuestionario, recibirán ambos un <strong style="color:rgba(255,255,255,0.9);font-weight:400;">análisis cruzado</strong> — la radiografía de su relación vista desde los dos lados.</p>`
    : packageType === 'descubre'
    ? `<p style="margin:0 0 20px;font-size:15px;line-height:1.8;color:rgba(255,255,255,0.65);">Tu análisis de autoconocimiento acaba de terminar. Hay un espejo frente a ti — uno que no miente ni halaga. Solo revela.</p>
          <p style="margin:0 0 32px;font-size:15px;line-height:1.8;color:rgba(255,255,255,0.65);">Tu análisis profundo de <strong style="color:rgba(255,255,255,0.9);font-weight:400;">11 corrientes psicológicas simultáneas</strong> y tus patrones emocionales está esperándote.</p>`
    : `<p style="margin:0 0 20px;font-size:15px;line-height:1.8;color:rgba(255,255,255,0.65);">El análisis de tus respuestas acaba de terminar. Hay un espejo frente a ti — uno que no miente ni halaga. Solo revela.</p>
          <p style="margin:0 0 32px;font-size:15px;line-height:1.8;color:rgba(255,255,255,0.65);">Tu análisis profundo de <strong style="color:rgba(255,255,255,0.9);font-weight:400;">11 corrientes psicológicas simultáneas</strong> y 12 dimensiones relacionales está esperándote.</p>`
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

    <!-- Logotipo / wordmark -->
    <tr><td align="center" style="padding-bottom:40px;">
      <p style="margin:0;font-size:11px;font-weight:600;letter-spacing:0.3em;text-transform:uppercase;color:rgba(167,139,250,0.7);">LUIS VIRRUETA</p>
    </td></tr>

    <!-- Separador sutil -->
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
          <table width="100%" cellpadding="0" cellspacing="0">
            <tr><td align="center">
              <a href="${accessUrl}" style="display:inline-block;padding:16px 48px;background:linear-gradient(135deg,#6d28d9,#9333ea);color:#ffffff;text-decoration:none;font-size:15px;font-weight:400;letter-spacing:0.02em;border-radius:12px;">Ver mi radiografía &rarr;</a>
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
      <p style="margin:0 0 6px;font-size:11px;color:rgba(255,255,255,0.2);line-height:1.7;">Este enlace es personal. Caduca en 1 año.</p>
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
          <p style="margin:0 0 32px;font-size:15px;line-height:1.8;color:rgba(255,255,255,0.65);">Este reporte cruza las respuestas de los dos para revelar patrones compartidos, puntos ciegos, y la dinámica real de la relación — vista desde las dos perspectivas.</p>
          <table width="100%" cellpadding="0" cellspacing="0">
            <tr><td align="center">
              <a href="${accessUrl}" style="display:inline-block;padding:16px 48px;background:linear-gradient(135deg,#db2777,#9333ea);color:#ffffff;text-decoration:none;font-size:15px;font-weight:400;letter-spacing:0.02em;border-radius:12px;">Ver radiografía cruzada &rarr;</a>
            </td></tr>
          </table>
        </td></tr>
      </table>
    </td></tr>

    <tr><td style="padding:24px 0;">
      <div style="height:1px;background:linear-gradient(to right,transparent,rgba(255,255,255,0.06),transparent);"></div>
    </td></tr>

    <tr><td align="center">
      <p style="margin:0 0 6px;font-size:11px;color:rgba(255,255,255,0.2);line-height:1.7;">Este enlace es personal. Caduca en 1 año.</p>
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

  const promos = getPromos(env)
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
  const promos = getPromos(env)
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
  const { purchaseId, type, emails, tokens, buyerToken, buyerEmail } = await req.json()
  const errors = []
  const generatedTokens = []

  for (let i = 0; i < (emails || []).length; i++) {
    const email = emails[i]
    if (!email) continue
    const token     = tokens?.[i] || makeToken()
    generatedTokens.push(token)
    const accessUrl = `${RADIOGRAFIA_URL}?token=${token}&type=${type}&pid=${purchaseId}`
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
  const { pairId, token } = await req.json()
  if (!pairId) return json({ error: 'Missing pairId' }, 400)
  if (!env.PURCHASES) return json({ error: 'KV not configured' }, 500)

  const pairRaw = await env.PURCHASES.get(`pair:${pairId}`)
  if (!pairRaw) return json({ error: 'Pair not found' }, 404)

  const pair = JSON.parse(pairRaw)
  // Validate caller belongs to this pair
  if (token !== pair.token1 && token !== pair.token2) return json({ error: 'Unauthorized' }, 403)

  const emails = [pair.email1, pair.email2].filter(e => e && e.includes('@'))
  const errors = []

  for (const email of emails) {
    // Each partner gets their own link with their token (which will load cross-analysis section)
    const partnerToken = email === pair.email1 ? pair.token1 : pair.token2
    const accessUrl = `${RADIOGRAFIA_URL}?token=${partnerToken}&type=losdos&view=results&cross=${pairId}`
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
  if (!token || !emails?.length) return json({ error: 'Missing token or emails' }, 400)

  const typeLabel = getTypeLabel(type || 'solo')
  // All recipients get the same URL — the buyer token links to the shared analysis
  const accessUrl = `${RADIOGRAFIA_URL}?token=${token}&type=${type || 'solo'}&view=results`
  const errors = []

  for (const email of emails.filter(Boolean)) {
    try {
      await sendEmail(env, {
        to:      email,
        subject: (type || 'solo') === 'descubre' ? 'Tu radiografía de autoconocimiento está lista' : 'Tu radiografía psicológica está lista',
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
  const apiKey = env.DEEPSEEK_API_KEY
  if (!apiKey) return json({ error: 'DeepSeek API key not configured' }, 500)

  const body = await req.json()
  // Only allow the specific model and enforce limits
  const payload = {
    model: 'deepseek-chat',
    messages: body.messages,
    temperature: Math.min(body.temperature ?? 0.7, 1.5),
    max_tokens: Math.min(body.max_tokens ?? 8192, 16384),
    response_format: body.response_format || undefined,
  }

  const response = await fetch('https://api.deepseek.com/chat/completions', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${apiKey}` },
    body: JSON.stringify(payload),
  })

  const data = await response.text()
  return new Response(data, {
    status: response.status,
    headers: { 'Content-Type': 'application/json', ...CORS },
  })
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

// ═══════════════════════════════════════════════════════════════════════════════
// ROUTER
// ═══════════════════════════════════════════════════════════════════════════════

export default {
  async fetch(request, env) {
    const { method } = request
    const { pathname } = new URL(request.url)

    if (method === 'OPTIONS') return new Response(null, { headers: CORS })

    try {
      // ── Audio from R2 (GET /audio/*) ──────────────────────────────
      if (method === 'GET' && pathname.startsWith('/audio/')) return handleAudio(request, env, pathname)

      if (method === 'GET' && pathname === '/api/get-analysis')       return handleGetAnalysis(request, env)
      if (method === 'GET' && pathname === '/api/get-cross-analysis')  return handleGetCrossAnalysis(request, env)

      if (method === 'POST') {
        if (pathname === '/api/create-radiografia-checkout') return handleCreateCheckout(request, env)
        if (pathname === '/api/verify-payment')              return handleVerifyPayment(request, env)
        if (pathname === '/api/validate-radiografia-promo')  return handleValidatePromo(request, env)
        if (pathname === '/api/send-access-email')           return handleSendAccessEmail(request, env)
        if (pathname === '/api/save-analysis')               return handleSaveAnalysis(request, env)
        if (pathname === '/api/send-analysis-email')         return handleSendAnalysisEmail(request, env)
        if (pathname === '/api/check-cross-status')          return handleCheckCrossStatus(request, env)
        if (pathname === '/api/mark-partner-done')           return handleMarkPartnerDone(request, env)
        if (pathname === '/api/save-cross-analysis')         return handleSaveCrossAnalysis(request, env)
        if (pathname === '/api/send-cross-analysis-email')   return handleSendCrossAnalysisEmail(request, env)
        if (pathname === '/api/create-consulta-checkout')    return handleCreateConsultaCheckout(request, env)
        if (pathname === '/api/validate-consulta-promo')     return handleValidateConsultaPromo(request, env)
        if (pathname === '/api/notify-consulta-purchase')    return handleNotifyConsulta(request, env)
        if (pathname === '/webhook')                         return handleWebhook(request, env)
        if (pathname === '/api/deepseek-proxy')               return handleDeepSeekProxy(request, env)
        if (pathname === '/api/tts-proxy')                    return handleTTSProxy(request, env)
      }
      return json({ ok: true, worker: 'radiografia-worker', path: pathname })
    } catch (err) {
      console.error('Worker error:', err)
      return json({ error: err.message }, 500)
    }
  },
}
