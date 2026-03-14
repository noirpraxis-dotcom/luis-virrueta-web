// ─── ACCESS TOKEN UTILITY ──────────────────────────────────────
// Generates and validates secure tokens for email access links
// Tokens are stored in Firestore linked to a purchase

/**
 * Generate a cryptographically random access token
 */
export function generateAccessToken() {
  const array = new Uint8Array(24)
  crypto.getRandomValues(array)
  return Array.from(array, b => b.toString(16).padStart(2, '0')).join('')
}

/**
 * Product labels for display
 */
export const PRODUCT_LABELS = {
  individual: 'Individual',
  pareja: 'Pareja',
  consulta: 'Consulta Profesional',
  descubre: 'Descifra tu forma de amar',
  solo: 'Pareja — Solo',
  losdos: 'Pareja — Los dos'
}

/**
 * Data retention period in days
 */
export const DATA_RETENTION_DAYS = 3
