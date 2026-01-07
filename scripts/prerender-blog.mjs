import fs from 'node:fs/promises'
import path from 'node:path'

// IMPORTANT: Social scrapers (WhatsApp/Facebook/LinkedIn) usually do NOT execute JS.
// Cloudflare Pages will serve static HTML. This script generates:
//   dist/blog/<slug>/index.html
// with correct OG/Twitter meta tags per article.

import blogArticlesContent, { getArticleContent } from '../src/data/blogArticlesContent.js'

const SITE_URL = 'https://luisvirrueta.com'

const distDir = path.resolve('dist')
const indexPath = path.join(distDir, 'index.html')

const safeText = (value) => String(value || '').replace(/\s+/g, ' ').trim()

const resolveImagePath = (raw) => {
  if (!raw || typeof raw !== 'string') return '/portada.webp'
  const trimmed = raw.trim()
  if (!trimmed) return '/portada.webp'

  if (trimmed.startsWith('http://') || trimmed.startsWith('https://')) return trimmed
  if (trimmed.startsWith('/')) return encodeURI(trimmed)
  return encodeURI(`/IMAGENES BLOG/${trimmed}`)
}

const toAbsoluteUrl = (raw) => {
  if (!raw || typeof raw !== 'string') return SITE_URL
  const trimmed = raw.trim()
  if (!trimmed) return SITE_URL
  if (trimmed.startsWith('http://') || trimmed.startsWith('https://')) return trimmed
  return `${SITE_URL}${trimmed.startsWith('/') ? trimmed : `/${trimmed}`}`
}

const stripExistingMeta = (html) => {
  // Remove existing tags that could conflict with per-article meta
  const patterns = [
    /<title>[\s\S]*?<\/title>\s*/gi,
    /<meta\s+name="description"[^>]*>\s*/gi,
    /<meta\s+name="keywords"[^>]*>\s*/gi,
    /<meta\s+property="og:[^"]+"[^>]*>\s*/gi,
    /<meta\s+name="twitter:[^"]+"[^>]*>\s*/gi,
    /<link\s+rel="canonical"[^>]*>\s*/gi
  ]

  return patterns.reduce((acc, re) => acc.replace(re, ''), html)
}

const buildHeadMeta = ({ title, description, url, image, author, tags, publishedTime }) => {
  const fullUrl = toAbsoluteUrl(url)
  const fullImage = toAbsoluteUrl(image)
  const safeTitle = safeText(title)
  const safeDesc = safeText(description).slice(0, 160)
  const keywordList = Array.isArray(tags) ? tags.filter(Boolean).map(safeText) : []

  const articleTags = keywordList
    .map((tag) => `<meta property="article:tag" content="${tag.replace(/"/g, '&quot;')}" />`)
    .join('\n')

  return `
<title>${safeTitle.replace(/</g, '&lt;').replace(/>/g, '&gt;')}</title>
<meta name="description" content="${safeDesc.replace(/"/g, '&quot;')}" />
<meta name="author" content="${safeText(author).replace(/"/g, '&quot;')}" />
${keywordList.length ? `<meta name="keywords" content="${keywordList.join(', ').replace(/"/g, '&quot;')}" />` : ''}

<meta property="og:type" content="article" />
<meta property="og:url" content="${fullUrl}" />
<meta property="og:title" content="${safeTitle.replace(/"/g, '&quot;')}" />
<meta property="og:description" content="${safeDesc.replace(/"/g, '&quot;')}" />
<meta property="og:image" content="${fullImage}" />
<meta property="og:site_name" content="Luis Virrueta" />
${publishedTime ? `<meta property="article:published_time" content="${publishedTime}" />` : ''}
${author ? `<meta property="article:author" content="${safeText(author).replace(/"/g, '&quot;')}" />` : ''}
${articleTags}

<meta name="twitter:card" content="summary_large_image" />
<meta name="twitter:url" content="${fullUrl}" />
<meta name="twitter:title" content="${safeTitle.replace(/"/g, '&quot;')}" />
<meta name="twitter:description" content="${safeDesc.replace(/"/g, '&quot;')}" />
<meta name="twitter:image" content="${fullImage}" />
<meta name="twitter:creator" content="@luisvirrueta" />

<link rel="canonical" href="${fullUrl}" />
`.trim()
}

const main = async () => {
  const baseHtml = await fs.readFile(indexPath, 'utf8')
  const cleanBase = stripExistingMeta(baseHtml)

  const slugs = Object.keys(blogArticlesContent?.es || {})
  if (!slugs.length) {
    console.warn('[prerender-blog] No slugs found in blogArticlesContent.es')
    return
  }

  await Promise.all(
    slugs.map(async (slug) => {
      const article = getArticleContent(slug, 'es')
      if (!article) return

      const url = `/blog/${slug}`
      const image = resolveImagePath(article.heroImage || article.image)
      const description =
        safeText(article.metaDescription || article.extract || article.excerpt || article.sections?.[0]?.content || '') ||
        'Artículo de Luis Virrueta'

      const head = buildHeadMeta({
        title: `${safeText(article.title)} | Luis Virrueta`,
        description,
        url,
        image,
        author: article.author || 'Luis Virrueta',
        tags: article.tags || [],
        publishedTime: ''
      })

      const html = cleanBase.replace('</head>', `${head}\n</head>`)
      const outDir = path.join(distDir, 'blog', slug)
      await fs.mkdir(outDir, { recursive: true })
      await fs.writeFile(path.join(outDir, 'index.html'), html, 'utf8')
    })
  )

  console.log(`[prerender-blog] Generated ${slugs.length} blog HTML pages`) 
}

main().catch((err) => {
  console.error('[prerender-blog] Failed:', err)
  process.exitCode = 1
})
