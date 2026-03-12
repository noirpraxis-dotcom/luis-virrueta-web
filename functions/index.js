import 'dotenv/config'
import express from 'express'
import cors from 'cors'
import Stripe from 'stripe'
import { Resend } from 'resend'
import admin from 'firebase-admin'
import { readFileSync } from 'fs'
import { accessEmailHtml, resultsEmailHtml } from './email-templates.js'

// ─── CONFIG ──────────────────────────────────────────────────────

const app = express()
const PORT = process.env.PORT || 3001
const FRONTEND_URL = process.env.FRONTEND_URL || 'http://localhost:5173'

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY)
const resend = new Resend(process.env.RESEND_API_KEY)
const FROM_EMAIL = process.env.RESEND_FROM_EMAIL || 'Termómetro de Pareja <hola@luisvirrueta.com>'
const NOTIFY_EMAIL = process.env.NOTIFY_EMAIL || 'hola@luisvirrueta.com'

// Initialize Firebase Admin (optional — skip if no service account)
let db = null
try {
  let serviceAccount
  if (process.env.FIREBASE_SERVICE_ACCOUNT_JSON) {
    serviceAccount = JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT_JSON)
  } else {
    const saPath = process.env.FIREBASE_SERVICE_ACCOUNT || './serviceAccountKey.json'
    serviceAccount = JSON.parse(readFileSync(saPath, 'utf-8'))
  }
  admin.initializeApp({ credential: admin.credential.cert(serviceAccount) })
  db = admin.firestore()
  console.log('✅ Firebase connected')
} catch (e) {
  console.warn('⚠️  Firebase not configured — progress saving disabled')
}

app.use(cors({
  origin: [FRONTEND_URL, 'http://localhost:3000', 'http://localhost:5173']
}))
app.use(express.json({ limit: '10mb' }))

// ─── ENDPOINT: Verify Stripe payment session ────────────────────

app.post('/api/verify-payment', async (req, res) => {
  try {
    const { sessionId } = req.body
    if (!sessionId) return res.status(400).json({ error: 'sessionId required' })

    const session = await stripe.checkout.sessions.retrieve(sessionId, {
      expand: ['line_items']
    })

    if (session.payment_status !== 'paid') {
      return res.status(400).json({ error: 'Payment not completed' })
    }

    // Detect product type from amount or metadata
    const amount = session.amount_total / 100 // cents to MXN
    let type = 'individual'
    if (amount >= 500) type = 'pareja'
    if (amount >= 1100) type = 'consulta'

    // Check metadata override
    if (session.metadata?.product_type) {
      type = session.metadata.product_type
    }

    res.json({
      type,
      email: session.customer_details?.email || '',
      amount,
      sessionId: session.id
    })
  } catch (err) {
    console.error('verify-payment error:', err.message)
    res.status(500).json({ error: 'Error verifying payment' })
  }
})

// ─── ENDPOINT: Send access emails ───────────────────────────────

app.post('/api/send-access-email', async (req, res) => {
  try {
    const { purchaseId, type, emails, tokens } = req.body
    if (!emails?.length || !tokens?.length) {
      return res.status(400).json({ error: 'emails and tokens required' })
    }

    const results = []

    for (let i = 0; i < emails.length; i++) {
      const email = emails[i]
      const token = tokens[i]
      const personLabel = type === 'pareja' ? `Persona ${i + 1}` : null
      const accessUrl = `${FRONTEND_URL}/tienda/diagnostico-relacional?token=${token}&type=${type}&pid=${purchaseId}`
      const continueUrl = `${FRONTEND_URL}/tienda/diagnostico-relacional?token=${token}&type=${type}&pid=${purchaseId}&resume=true`

      // Save token to Firestore (if available)
      if (db) {
        await db.collection('access_tokens').doc(token).set({
          purchaseId,
          email,
          type,
          personIndex: i,
          createdAt: admin.firestore.FieldValue.serverTimestamp(),
          expiresAt: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000), // 3 days
          used: false
        }).catch(e => console.warn('Firestore write failed:', e.message))
      }

      const { data, error } = await resend.emails.send({
        from: FROM_EMAIL,
        to: email,
        subject: type === 'pareja'
          ? `Tu acceso al Termómetro Inconsciente de Pareja (${personLabel})`
          : 'Tu acceso al Termómetro Inconsciente de Pareja',
        html: accessEmailHtml({ accessUrl, continueUrl, personLabel, type })
      })

      results.push({ email, success: !error, id: data?.id })
    }

    res.json({ success: true, results })
  } catch (err) {
    console.error('send-access-email error:', err.message)
    res.status(500).json({ error: 'Error sending emails' })
  }
})

// ─── ENDPOINT: Send results PDF email ───────────────────────────

app.post('/api/send-results-email', async (req, res) => {
  try {
    const { email, purchaseId, pdfBase64, productType, userName } = req.body
    if (!email || !pdfBase64) {
      return res.status(400).json({ error: 'email and pdfBase64 required' })
    }

    // Extract base64 data from data URI
    const base64Data = pdfBase64.replace(/^data:application\/pdf;[^,]+,/, '')

    const productLabels = { individual: 'Individual ($349)', pareja: 'Pareja ($549)', consulta: 'Consulta ($1,199)' }
    const fechaHora = new Date().toLocaleString('es-MX', { timeZone: 'America/Mexico_City' })

    // Send PDF to client
    const { data, error } = await resend.emails.send({
      from: FROM_EMAIL,
      to: email,
      subject: '🔬 Tu Diagnóstico Relacional — Resultados y PDF',
      html: resultsEmailHtml({ productType }),
      attachments: [{ filename: 'diagnostico-relacional.pdf', content: base64Data }]
    })

    if (error) {
      console.error('Resend error:', error)
      return res.status(500).json({ error: 'Error sending results email' })
    }

    // Send admin notification to Luis (without PDF to keep it light)
    await resend.emails.send({
      from: FROM_EMAIL,
      to: NOTIFY_EMAIL,
      subject: `📊 Nuevo diagnóstico completado — ${productLabels[productType] || productType}`,
      html: `
        <div style="font-family:sans-serif;max-width:500px;margin:0 auto;padding:24px;">
          <h2 style="color:#7c3aed;">✅ Diagnóstico completado</h2>
          <table style="width:100%;border-collapse:collapse;">
            <tr><td style="padding:8px;color:#666;">Fecha y hora</td><td style="padding:8px;font-weight:bold;">${fechaHora}</td></tr>
            <tr style="background:#f9f9f9;"><td style="padding:8px;color:#666;">Email del cliente</td><td style="padding:8px;font-weight:bold;">${email}</td></tr>
            <tr><td style="padding:8px;color:#666;">Nombre</td><td style="padding:8px;font-weight:bold;">${userName || 'No capturado'}</td></tr>
            <tr style="background:#f9f9f9;"><td style="padding:8px;color:#666;">Producto</td><td style="padding:8px;font-weight:bold;">${productLabels[productType] || productType}</td></tr>
            <tr><td style="padding:8px;color:#666;">ID de compra</td><td style="padding:8px;font-size:12px;color:#888;">${purchaseId || 'N/A'}</td></tr>
          </table>
          <p style="margin-top:16px;color:#888;font-size:13px;">El PDF ya fue enviado automáticamente al cliente.</p>
        </div>
      `
    }).catch(e => console.warn('Admin notify failed:', e.message))

    // Mark purchase as completed in Firestore (if available)
    if (db) {
      await db.collection('purchases').doc(purchaseId).update({
        completedAt: admin.firestore.FieldValue.serverTimestamp(),
        resultsSentAt: admin.firestore.FieldValue.serverTimestamp()
      }).catch(() => {})
    }

    res.json({ success: true, id: data?.id })
  } catch (err) {
    console.error('send-results-email error:', err.message)
    res.status(500).json({ error: 'Error sending results' })
  }
})

// ─── RADIOGRAFÍA: Promo codes ─────────────────────────────────────

const RADIOGRAFIA_PROMO_CODES = {
  'LUISPRO': { discount: 1.0, label: 'Acceso gratuito (código profesional)', appliesTo: ['descubre', 'solo', 'losdos'] }
}

const RADIOGRAFIA_PRICES = {
  descubre: { cents: 49900, name: 'Radiografía Individual', desc: 'Tu mapa de patrones amorosos' },
  solo:     { cents: 49900, name: 'Radiografía de Pareja (Solo)', desc: 'Análisis profundo de tu relación' },
  losdos:   { cents: 99900, name: 'Radiografía de Pareja (Los dos)', desc: '3 reportes: tuyo, suyo y cruzado' }
}

// ─── ENDPOINT: Create radiografía checkout session ────────────────

// ─── ENDPOINT: Validate radiografía promo code ───────────────────

app.post('/api/validate-radiografia-promo', (req, res) => {
  const { type, promoCode } = req.body
  if (!type || !RADIOGRAFIA_PRICES[type]) {
    return res.status(400).json({ error: 'Tipo no válido' })
  }
  if (!promoCode) {
    return res.status(400).json({ error: 'Código requerido' })
  }
  const code = String(promoCode).toUpperCase().trim()
  const promo = RADIOGRAFIA_PROMO_CODES[code]
  if (!promo || !promo.appliesTo.includes(type)) {
    return res.status(400).json({ error: 'Código inválido o no aplicable a este producto' })
  }
  const product = RADIOGRAFIA_PRICES[type]
  const originalCents = product.cents
  const finalCents = promo.discount === 1.0 ? 0 : Math.round(originalCents * (1 - promo.discount))
  res.json({
    label: promo.label,
    discount: promo.discount,
    discountPercent: Math.round(promo.discount * 100),
    originalPrice: originalCents / 100,
    finalPrice: finalCents / 100,
    free: finalCents === 0
  })
})

app.post('/api/create-radiografia-checkout', async (req, res) => {
  try {
    const { type, promoCode } = req.body
    if (!type || !RADIOGRAFIA_PRICES[type]) {
      return res.status(400).json({ error: 'type must be descubre, solo, or losdos' })
    }

    const product = RADIOGRAFIA_PRICES[type]
    let priceCents = product.cents
    let promoApplied = null

    if (promoCode) {
      const code = String(promoCode).toUpperCase().trim()
      const promo = RADIOGRAFIA_PROMO_CODES[code]
      if (!promo || !promo.appliesTo.includes(type)) {
        return res.status(400).json({ error: 'Código inválido o no aplicable a este producto' })
      }
      if (promo.discount === 1.0) {
        priceCents = 0
      } else {
        priceCents = Math.round(priceCents * (1 - promo.discount))
      }
      promoApplied = { code, label: promo.label }
    }

    // Free path — skip Stripe
    if (priceCents === 0) {
      return res.json({
        free: true,
        type,
        url: `${FRONTEND_URL}/tienda/radiografia-premium?free=true&type=${type}`
      })
    }

    const session = await stripe.checkout.sessions.create({
      mode: 'payment',
      line_items: [{
        price_data: {
          currency: 'mxn',
          product_data: {
            name: product.name,
            description: promoApplied
              ? `${product.desc} · Código: ${promoApplied.code}`
              : product.desc
          },
          unit_amount: priceCents
        },
        quantity: 1
      }],
      automatic_tax: { enabled: true },
      success_url: `${FRONTEND_URL}/tienda/diagnostico-relacional?session_id={CHECKOUT_SESSION_ID}&type=${type}`,
      cancel_url: `${FRONTEND_URL}/tienda/diagnostico-relacional`,
      metadata: {
        product_type: `radiografia_${type}`,
        promo_applied: promoApplied ? promoApplied.code : 'none'
      }
    })

    res.json({ url: session.url })
  } catch (err) {
    console.error('create-radiografia-checkout error:', err.message)
    res.status(500).json({ error: 'Error creating checkout session' })
  }
})

// ─── CONSULTA: Promo codes ────────────────────────────────────────

const CONSULTA_PROMO_CODES = {
  // Consulta Individual
  'MENTELIBRE':  { product: 'individual', priceCents: 50000,  label: '$500 MXN'   },
  'VINCULOS650': { product: 'individual', priceCents: 65000,  label: '$650 MXN'   },
  // Consulta de Pareja
  'DOSPUERTAS':  { product: 'pareja',     priceCents: 100000, label: '$1,000 MXN' },
  // Free (testing) — valid for both
  'LUISPRAXIS':  { product: 'both',       priceCents: 0,      label: 'GRATIS'     }
}

const CONSULTA_BASE_PRICES = {
  individual: 70000,  // $700 MXN in centavos
  pareja:     119900  // $1,199 MXN in centavos
}

// ─── ENDPOINT: Create consulta checkout session ───────────────────

app.post('/api/create-consulta-checkout', async (req, res) => {
  try {
    const { type, promoCode } = req.body
    if (!type || !['individual', 'pareja'].includes(type)) {
      return res.status(400).json({ error: 'type must be individual or pareja' })
    }

    let priceCents = CONSULTA_BASE_PRICES[type]
    let promoApplied = null

    if (promoCode) {
      const code = String(promoCode).toUpperCase().trim()
      const promo = CONSULTA_PROMO_CODES[code]
      if (!promo || (promo.product !== type && promo.product !== 'both')) {
        return res.status(400).json({ error: 'Código inválido o no aplicable a este producto' })
      }
      priceCents = promo.priceCents
      promoApplied = { code, label: promo.label }
    }

    // Free path — skip Stripe, redirect directly to thank-you
    if (priceCents === 0) {
      return res.json({
        url: `${FRONTEND_URL}/tienda/consulta-gracias?type=${type}&free=true`
      })
    }

    const productName = type === 'individual'
      ? 'Consulta Individual — Luis Virrueta'
      : 'Consulta de Pareja — Luis Virrueta'

    const session = await stripe.checkout.sessions.create({
      mode: 'payment',
      line_items: [{
        price_data: {
          currency: 'mxn',
          product_data: {
            name: productName,
            description: promoApplied
              ? `Código aplicado: ${promoApplied.code} (${promoApplied.label})`
              : undefined
          },
          unit_amount: priceCents
        },
        quantity: 1
      }],
      success_url: `${FRONTEND_URL}/tienda/consulta-gracias?session_id={CHECKOUT_SESSION_ID}&type=${type}`,
      cancel_url: `${FRONTEND_URL}/tienda/${type === 'individual' ? '8' : '9'}`,
      metadata: {
        product_type: `consulta_${type}`,
        promo_applied: promoApplied ? promoApplied.code : 'none'
      }
    })

    res.json({ url: session.url })
  } catch (err) {
    console.error('create-consulta-checkout error:', err.message)
    res.status(500).json({ error: 'Error creating checkout session' })
  }
})

// ─── ENDPOINT: Notify Luis of consulta purchase ───────────────────

app.post('/api/notify-consulta-purchase', async (req, res) => {
  try {
    const { sessionId, type, free } = req.body
    const fechaHora = new Date().toLocaleString('es-MX', { timeZone: 'America/Mexico_City' })
    const typeLabel = type === 'pareja' ? 'Consulta de Pareja' : 'Consulta Individual'

    let clientEmail = 'N/A'
    let amount = free ? 'GRATIS (prueba)' : 'N/A'

    if (sessionId && !free) {
      try {
        const session = await stripe.checkout.sessions.retrieve(sessionId)
        clientEmail = session.customer_details?.email || 'N/A'
        amount = `$${(session.amount_total / 100).toLocaleString('es-MX')} MXN`
      } catch { /* silently ignore */ }
    }

    await resend.emails.send({
      from: FROM_EMAIL,
      to: NOTIFY_EMAIL,
      subject: `📅 Nueva ${typeLabel} — ${amount}`,
      html: `
        <div style="font-family:sans-serif;max-width:500px;margin:0 auto;padding:24px;">
          <h2 style="color:#16a34a;">📅 Nueva ${typeLabel}</h2>
          <table style="width:100%;border-collapse:collapse;">
            <tr>
              <td style="padding:8px;color:#666;">Fecha y hora</td>
              <td style="padding:8px;font-weight:bold;">${fechaHora}</td>
            </tr>
            <tr style="background:#f9f9f9;">
              <td style="padding:8px;color:#666;">Producto</td>
              <td style="padding:8px;font-weight:bold;">${typeLabel}</td>
            </tr>
            <tr>
              <td style="padding:8px;color:#666;">Email del cliente</td>
              <td style="padding:8px;font-weight:bold;">${clientEmail}</td>
            </tr>
            <tr style="background:#f9f9f9;">
              <td style="padding:8px;color:#666;">Monto pagado</td>
              <td style="padding:8px;font-weight:bold;">${amount}</td>
            </tr>
          </table>
          <p style="margin-top:16px;color:#888;font-size:13px;">
            El cliente ya recibió el botón de WhatsApp para contactarte.
          </p>
        </div>
      `
    }).catch(e => console.warn('Consulta notify failed:', e.message))

    res.json({ success: true })
  } catch (err) {
    console.error('notify-consulta-purchase error:', err.message)
    res.status(500).json({ error: 'Error sending notification' })
  }
})

// ─── START ───────────────────────────────────────────────────────

app.listen(PORT, () => {
  console.log(`🚀 API running on port ${PORT}`)
})
