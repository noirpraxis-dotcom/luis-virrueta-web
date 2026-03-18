// Cloudflare Pages Function — Proxy Firebase Auth handler
// This allows using a custom authDomain (luisvirrueta.com) instead of
// the default firebaseapp.com domain in Google OAuth screens.

const FIREBASE_AUTH_DOMAIN = 'diagnostico-emocional-7b8f7.firebaseapp.com'

export async function onRequest(context) {
  const url = new URL(context.request.url)
  const targetUrl = `https://${FIREBASE_AUTH_DOMAIN}${url.pathname}${url.search}`

  const headers = new Headers(context.request.headers)
  headers.set('Host', FIREBASE_AUTH_DOMAIN)
  // Remove headers that could cause issues with the proxy
  headers.delete('cf-connecting-ip')
  headers.delete('cf-ipcountry')
  headers.delete('cf-ray')
  headers.delete('cf-visitor')

  const init = {
    method: context.request.method,
    headers,
  }

  if (!['GET', 'HEAD'].includes(context.request.method)) {
    init.body = context.request.body
  }

  const response = await fetch(targetUrl, init)

  // Copy response headers but allow our domain
  const responseHeaders = new Headers(response.headers)
  responseHeaders.delete('x-frame-options')
  responseHeaders.set('Access-Control-Allow-Origin', url.origin)

  return new Response(response.body, {
    status: response.status,
    statusText: response.statusText,
    headers: responseHeaders,
  })
}
