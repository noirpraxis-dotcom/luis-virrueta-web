// ─── EMAIL API SERVICE ──────────────────────────────────────────
// Cloudflare Worker: https://radiografia-worker.noirpraxis.workers.dev
// Configurar VITE_API_BASE_URL en .env

const WORKER_URL = 'https://radiografia-worker.noirpraxis.workers.dev'
const API_BASE = import.meta.env.DEV ? '' : WORKER_URL

/**
 * Send access email(s) after purchase
 * @param {Object} params
 * @param {string} params.purchaseId - Firestore purchase document ID
 * @param {string} params.type - 'descubre' | 'solo' | 'losdos'
 * @param {string[]} params.emails - Array of email addresses (1 for individual, 2 for pareja)
 * @param {string[]} params.tokens - Array of access tokens matching emails
 * @param {string} [params.buyerToken] - Buyer's token (for linking losdos pairs)
 * @param {string} [params.buyerEmail] - Buyer's email (for linking losdos pairs)
 */
export async function sendAccessEmails({ purchaseId, type, emails, tokens, buyerToken, buyerEmail }) {
  const res = await fetch(`${API_BASE}/api/send-access-email`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ purchaseId, type, emails, tokens, buyerToken, buyerEmail })
  })
  const data = await res.json().catch(() => ({}))
  if (!res.ok) throw new Error(data.errors?.[0]?.error || data.error || `Error ${res.status}`)
  return data
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
    body: JSON.stringify({ sessionId, siteOrigin: window.location.origin })
  })
  if (!res.ok) throw new Error('Error verificando pago')
  return res.json() // { type: 'individual'|'pareja', email: '...', amount: 349 }
}

/**
 * Save analysis results to KV so they can be retrieved from the "analysis ready" email link.
 * @param {Object} params
 * @param {string} params.token - Purchase access token (from URL ?token=)
 * @param {Object} params.analysis - Full analysis object returned by AI service
 */
export async function saveAnalysis({ token, analysis }) {
  const res = await fetch(`${API_BASE}/api/save-analysis`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ token, analysis })
  })
  if (!res.ok) {
    const data = await res.json().catch(() => ({}))
    throw new Error(data.error || `Error ${res.status}`)
  }
  return res.json()
}

/**
 * Send "analysis ready" email(s) with a direct link to the results page.
 * @param {Object} params
 * @param {string} params.token - Purchase access token
 * @param {string} params.type  - Product type: 'descubre' | 'solo' | 'losdos'
 * @param {string[]} params.emails - Email address(es) to notify
 */
export async function sendAnalysisEmail({ token, type, emails }) {
  const res = await fetch(`${API_BASE}/api/send-analysis-email`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ token, type, emails })
  })
  const data = await res.json().catch(() => ({}))
  if (!res.ok) throw new Error(data.errors?.[0]?.error || data.error || `Error ${res.status}`)
  return data
}

/**
 * Retrieve a stored analysis by purchase token (used when loading results from email link).
 * @param {string} token - Purchase access token
 * @returns {{ ok: true, analysis: Object } | { error: string }}
 */
export async function getAnalysis(token) {
  const res = await fetch(`${API_BASE}/api/get-analysis?token=${encodeURIComponent(token)}`)
  if (!res.ok) {
    const data = await res.json().catch(() => ({}))
    throw new Error(data.error || `Error ${res.status}`)
  }
  return res.json()
}

// ── Cross-analysis (losdos) endpoints ────────────────────────────────────────

/** Check if both partners have finished their questionnaires */
export async function checkCrossStatus(token) {
  const res = await fetch(`${API_BASE}/api/check-cross-status`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ token })
  })
  if (!res.ok) throw new Error('Error checking cross status')
  return res.json()
}

/** Mark this partner as done (called after individual analysis is saved) */
export async function markPartnerDone(token) {
  const res = await fetch(`${API_BASE}/api/mark-partner-done`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ token })
  })
  if (!res.ok) throw new Error('Error marking partner done')
  return res.json()
}

/** Save cross-analysis results to KV */
export async function saveCrossAnalysis({ token, pairId, analysis }) {
  const res = await fetch(`${API_BASE}/api/save-cross-analysis`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ token, pairId, analysis })
  })
  if (!res.ok) throw new Error('Error saving cross analysis')
  return res.json()
}

/** Send cross-analysis ready email to both partners */
export async function sendCrossAnalysisEmail({ pairId, token }) {
  const res = await fetch(`${API_BASE}/api/send-cross-analysis-email`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ pairId, token })
  })
  if (!res.ok) throw new Error('Error sending cross analysis email')
  return res.json()
}

/** Retrieve stored cross-analysis by pairId */
export async function getCrossAnalysis(pairId, token) {
  const res = await fetch(`${API_BASE}/api/get-cross-analysis?pairId=${encodeURIComponent(pairId)}&token=${encodeURIComponent(token)}`)
  if (!res.ok) throw new Error('Error retrieving cross analysis')
  return res.json()
}
