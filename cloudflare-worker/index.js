/**
 * Radiografía de Pareja — Cloudflare Worker Backend
 * luisvirrueta.com
 *
 * Rutas:
 *   GET  /audio/*                          — Servir audio desde R2
 *   POST /api/create-radiografia-checkout  — Crea sesión Stripe Checkout
 *   POST /api/verify-payment               — Verifica sesión Stripe
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

// Códigos promo integrados. Añade más con la env var PROMO_CODES_JSON (JSON string).
const BUILT_IN_PROMOS = {
  LANZAMIENTO50: { discountPercent: 50, label: 'Lanzamiento -50%' },
  BETA100:       { free: true,          label: 'Acceso beta gratuito' },
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

// ── Coupon (crear en Stripe si no existe) ────────────────────────────────────
async function getOrCreateCoupon(env, code, percent, isTest = false) {
  try   { const c = await stripe(env, 'GET', `/coupons/${code}`, {}, isTest); return c.id }
  catch { const c = await stripe(env, 'POST', '/coupons', { id: code, percent_off: percent, duration: 'once', name: code }, isTest); return c.id }
}

// ── Email HTML ────────────────────────────────────────────────────────────────
// ── Email: purchase confirmation (sent right after payment) ──────────────────
function purchaseEmailHtml({ typeLabel, accessUrl }) {
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
      <h1 style="margin:0 0 12px;font-size:28px;font-weight:300;letter-spacing:-0.03em;color:#ffffff;line-height:1.2;">Gracias por tu compra</h1>
      <p style="margin:0;font-size:13px;color:rgba(167,139,250,0.8);letter-spacing:0.05em;text-transform:uppercase;">${typeLabel}</p>
    </td></tr>

    <!-- Card principal -->
    <tr><td style="padding-bottom:16px;">
      <table width="100%" cellpadding="0" cellspacing="0" style="background:#0f0f1a;border:1px solid rgba(124,58,237,0.18);border-radius:20px;overflow:hidden;">
        <tr><td style="padding:40px 40px 32px;">
          <p style="margin:0 0 20px;font-size:15px;line-height:1.8;color:rgba(255,255,255,0.65);">Tu acceso personal al cuestionario ya está activo. Usa el botón de abajo para comenzar cuando estés listo.</p>
          <p style="margin:0 0 32px;font-size:15px;line-height:1.8;color:rgba(255,255,255,0.65);"><strong style="color:rgba(255,255,255,0.85);font-weight:400;">¿Cerraste el navegador o cambiaste de dispositivo?</strong> No hay problema — este mismo enlace te lleva exactamente al punto donde lo dejaste. Guarda este correo; es tu acceso permanente.</p>
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
            <tr><td style="padding:4px 0;font-size:13px;color:rgba(255,255,255,0.5);">&mdash;&nbsp; 40 preguntas guiadas por voz</td></tr>
            <tr><td style="padding:4px 0;font-size:13px;color:rgba(255,255,255,0.5);">&mdash;&nbsp; 11 marcos psicológicos aplicados a tu caso</td></tr>
            <tr><td style="padding:4px 0;font-size:13px;color:rgba(255,255,255,0.5);">&mdash;&nbsp; Mapa de 12 dimensiones de tu vínculo</td></tr>
            <tr><td style="padding:4px 0;font-size:13px;color:rgba(255,255,255,0.5);">&mdash;&nbsp; Autoanálisis de tus patrones inconscientes</td></tr>
            <tr><td style="padding:4px 0;font-size:13px;color:rgba(255,255,255,0.5);">&mdash;&nbsp; Reporte PDF para guardar o compartir</td></tr>
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
function analysisEmailHtml({ typeLabel, accessUrl }) {
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
      <h1 style="margin:0 0 12px;font-size:28px;font-weight:300;letter-spacing:-0.03em;color:#ffffff;line-height:1.2;">Tu radiografía psicológica<br>está lista</h1>
      <p style="margin:0;font-size:13px;color:rgba(167,139,250,0.8);letter-spacing:0.05em;text-transform:uppercase;">${typeLabel}</p>
    </td></tr>

    <!-- Card principal -->
    <tr><td style="padding-bottom:16px;">
      <table width="100%" cellpadding="0" cellspacing="0" style="background:#0f0f1a;border:1px solid rgba(124,58,237,0.18);border-radius:20px;overflow:hidden;">
        <tr><td style="padding:40px 40px 32px;">
          <p style="margin:0 0 20px;font-size:15px;line-height:1.8;color:rgba(255,255,255,0.65);">El análisis de tus respuestas acaba de terminar. Hay un espejo frente a ti — uno que no miente ni halaga. Solo revela.</p>
          <p style="margin:0 0 32px;font-size:15px;line-height:1.8;color:rgba(255,255,255,0.65);">Tu análisis profundo de <strong style="color:rgba(255,255,255,0.9);font-weight:400;">11 corrientes psicológicas simultáneas</strong> y 12 dimensiones relacionales está esperándote.</p>
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
  const type    = session.metadata?.type || 'solo'

  // Send confirmation email on verify (runs once thanks to KV dedup).
  // This makes email delivery reliable in both test mode and live without
  // requiring a Stripe webhook to be configured.
  if (email && session.payment_status === 'paid' && env.PURCHASES) {
    const dedupKey = `email_sent:${sessionId}`
    const alreadySent = await env.PURCHASES.get(dedupKey)
    if (!alreadySent) {
      try {
        const { siteOrigin } = body
        const baseUrl = (isTest && siteOrigin) ? siteOrigin : SITE_URL
        const token     = makeToken()
        const accessUrl = `${baseUrl}/tienda/radiografia-premium?token=${token}&type=${type}&pid=${sessionId}`
        await sendEmail(env, {
          to:      email,
          subject: 'Tu acceso a la Radiografía Psicológica',
          html:    purchaseEmailHtml({ typeLabel: getTypeLabel(type), accessUrl }),
        })
        // Save purchase + mark email sent
        const purchase = JSON.stringify({ email, type, sessionId, token, createdAt: Date.now(), paid: true })
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

  return json({
    type,
    email,
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
  const { purchaseId, type, emails, tokens } = await req.json()
  const errors = []
  for (let i = 0; i < (emails || []).length; i++) {
    const email = emails[i]
    if (!email) continue
    const token     = tokens?.[i]
    const accessUrl = token
      ? `${RADIOGRAFIA_URL}?token=${token}&type=${type}&pid=${purchaseId}`
      : RADIOGRAFIA_URL
    try {
      await sendEmail(env, {
        to:      email,
        subject: 'Tu acceso a la Radiografía Psicológica',
        html:    purchaseEmailHtml({ typeLabel: getTypeLabel(type), accessUrl }),
      })
    } catch (e) {
      console.error(`Error enviando a ${email}:`, e.message)
      errors.push({ email, error: e.message })
    }
  }
  if (errors.length > 0 && errors.length === (emails || []).filter(Boolean).length) {
    return json({ ok: false, errors }, 500)
  }
  return json({ ok: true, errors: errors.length ? errors : undefined })
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
        subject: 'Tu radiografía psicológica está lista',
        html:    analysisEmailHtml({ typeLabel, accessUrl }),
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
    const type      = session.metadata?.type || 'solo'
    const sessionId = session.id
    const token     = makeToken()

    const purchase = JSON.stringify({ email, type, sessionId, token, createdAt: Date.now(), paid: true })
    if (env.PURCHASES) {
      await Promise.all([
        env.PURCHASES.put(`session:${sessionId}`, purchase, { expirationTtl: 86400 * 365 }),
        env.PURCHASES.put(`token:${token}`,        purchase, { expirationTtl: 86400 * 365 }),
      ])
    }

    if (email && env.RESEND_API_KEY) {
      const accessUrl = `${RADIOGRAFIA_URL}?token=${token}&type=${type}&pid=${sessionId}`
      await sendEmail(env, {
        to:      email,
        subject: 'Tu acceso a la Radiografía Psicológica',
        html:    purchaseEmailHtml({ typeLabel: getTypeLabel(type), accessUrl }),
      })
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

      if (method === 'GET' && pathname === '/api/get-analysis') return handleGetAnalysis(request, env)

      if (method === 'POST') {
        if (pathname === '/api/create-radiografia-checkout') return handleCreateCheckout(request, env)
        if (pathname === '/api/verify-payment')              return handleVerifyPayment(request, env)
        if (pathname === '/api/validate-radiografia-promo')  return handleValidatePromo(request, env)
        if (pathname === '/api/send-access-email')           return handleSendAccessEmail(request, env)
        if (pathname === '/api/save-analysis')               return handleSaveAnalysis(request, env)
        if (pathname === '/api/send-analysis-email')         return handleSendAnalysisEmail(request, env)
        if (pathname === '/webhook')                         return handleWebhook(request, env)
      }
      return json({ ok: true, worker: 'radiografia-worker', path: pathname })
    } catch (err) {
      console.error('Worker error:', err)
      return json({ error: err.message }, 500)
    }
  },
}
