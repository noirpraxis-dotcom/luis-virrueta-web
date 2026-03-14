// ─── EMAIL API SERVICE ──────────────────────────────────────────
// Cloudflare Worker: https://radiografia-worker.noirpraxis.workers.dev
// Configurar VITE_API_BASE_URL en .env

const WORKER_URL = 'https://radiografia-worker.noirpraxis.workers.dev'
const API_BASE = import.meta.env.VITE_API_BASE_URL || (import.meta.env.DEV ? '' : WORKER_URL)

/**
 * Send access email(s) after purchase
 * @param {Object} params
 * @param {string} params.purchaseId - Firestore purchase document ID
 * @param {string} params.type - 'individual' | 'pareja'
 * @param {string[]} params.emails - Array of email addresses (1 for individual, 2 for pareja)
 * @param {string[]} params.tokens - Array of access tokens matching emails
 */
export async function sendAccessEmails({ purchaseId, type, emails, tokens }) {
  const res = await fetch(`${API_BASE}/api/send-access-email`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ purchaseId, type, emails, tokens })
  })
  if (!res.ok) throw new Error('Error enviando emails')
  return res.json()
}

/**
 * Send PDF results email after analysis completes
 * @param {Object} params
 * @param {string} params.email - Recipient email
 * @param {string} params.purchaseId - Firestore purchase document ID
 * @param {string} params.pdfBase64 - Base64-encoded PDF
 * @param {string} params.productType - 'individual' | 'pareja'
 */
export async function sendResultsEmail({ email, purchaseId, pdfBase64, productType, userName }) {
  const res = await fetch(`${API_BASE}/api/send-results-email`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, purchaseId, pdfBase64, productType, userName })
  })
  if (!res.ok) throw new Error('Error enviando resultados')
  return res.json()
}

/**
 * Verify Stripe checkout session to detect product type
 * @param {string} sessionId - Stripe checkout session ID
 */
export async function verifyStripeSession(sessionId) {
  const res = await fetch(`${API_BASE}/api/verify-payment`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ sessionId })
  })
  if (!res.ok) throw new Error('Error verificando pago')
  return res.json() // { type: 'individual'|'pareja', email: '...', amount: 349 }
}
