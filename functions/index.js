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

app.use(cors({ origin: FRONTEND_URL }))
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

// ─── START ───────────────────────────────────────────────────────

app.listen(PORT, () => {
  console.log(`🚀 API running on port ${PORT}`)
})
