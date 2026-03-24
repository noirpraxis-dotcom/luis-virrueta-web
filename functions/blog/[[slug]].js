// Cloudflare Pages Function — OG meta tags for blog article shares
// Intercepts /blog/:slug requests from social media crawlers and serves
// proper OG meta tags so that shared links show the correct thumbnail,
// title, and description.

const WORKER_URL = 'https://radiografia-worker.noirpraxis.workers.dev'
const SITE_URL = 'https://luisvirrueta.com'
const DEFAULT_IMAGE = `${WORKER_URL}/media/products/portada.webp`

const CRAWLER_UA_PATTERN = /facebookexternalhit|Facebot|Twitterbot|LinkedInBot|WhatsApp|TelegramBot|Slackbot|Discordbot|Pinterest|Googlebot|bingbot|Applebot|Pinterestbot/i

export async function onRequest(context) {
  const { request, env } = context
  const ua = request.headers.get('user-agent') || ''

  // Only intercept for social media crawlers
  if (!CRAWLER_UA_PATTERN.test(ua)) {
    return env.ASSETS.fetch(request)
  }

  const url = new URL(request.url)
  const pathParts = url.pathname.replace(/^\/blog\//, '').split('/').filter(Boolean)
  const slug = pathParts[0] || ''

  if (!slug || slug === 'nuevo') {
    return env.ASSETS.fetch(request)
  }

  try {
    const metaRes = await fetch(`${WORKER_URL}/api/blog-meta?slug=${encodeURIComponent(slug)}`)
    if (!metaRes.ok) {
      return env.ASSETS.fetch(request)
    }

    const meta = await metaRes.json()
    if (!meta.title) {
      return env.ASSETS.fetch(request)
    }

    const title = meta.subtitle
      ? `${meta.title} — ${meta.subtitle} | Luis Virrueta`
      : `${meta.title} | Luis Virrueta`
    const description = (meta.description || '').slice(0, 200)
    const image = meta.image
      ? (meta.image.startsWith('http') ? meta.image : `${WORKER_URL}${meta.image}`)
      : DEFAULT_IMAGE
    const articleUrl = `${SITE_URL}/blog/${slug}`
    const tags = Array.isArray(meta.tags) ? meta.tags : []

    const html = `<!DOCTYPE html>
<html lang="es">
<head>
  <meta charset="UTF-8">
  <title>${escapeHtml(title)}</title>
  <meta name="description" content="${escapeHtml(description)}">
  <meta name="author" content="${escapeHtml(meta.author || 'Luis Virrueta')}">

  <meta property="og:type" content="article">
  <meta property="og:url" content="${articleUrl}">
  <meta property="og:title" content="${escapeHtml(title)}">
  <meta property="og:description" content="${escapeHtml(description)}">
  <meta property="og:image" content="${escapeHtml(image)}">
  <meta property="og:site_name" content="Luis Virrueta - Psicólogo · Psicoanalista">
  ${meta.published_at ? `<meta property="article:published_time" content="${escapeHtml(meta.published_at)}">` : ''}
  <meta property="article:author" content="${escapeHtml(meta.author || 'Luis Virrueta')}">
  ${tags.map(t => `<meta property="article:tag" content="${escapeHtml(t)}">`).join('\n  ')}

  <meta name="twitter:card" content="summary_large_image">
  <meta name="twitter:url" content="${articleUrl}">
  <meta name="twitter:title" content="${escapeHtml(title)}">
  <meta name="twitter:description" content="${escapeHtml(description)}">
  <meta name="twitter:image" content="${escapeHtml(image)}">

  <link rel="canonical" href="${articleUrl}">
  <meta http-equiv="refresh" content="0;url=${articleUrl}">
</head>
<body>
  <p>${escapeHtml(title)}</p>
</body>
</html>`

    return new Response(html, {
      headers: {
        'Content-Type': 'text/html; charset=utf-8',
        'Cache-Control': 'public, max-age=3600'
      }
    })
  } catch (err) {
    return env.ASSETS.fetch(request)
  }
}

function escapeHtml(str) {
  return String(str || '')
    .replace(/&/g, '&amp;')
    .replace(/"/g, '&quot;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
}
