import { Helmet } from 'react-helmet-async'

const SEOHead = ({ 
  title, 
  description, 
  image, 
  url, 
  type = 'article',
  publishedTime,
  author = 'Luis Virrueta',
  tags = []
}) => {
  const siteUrl = 'https://luisvirrueta.com'
  const fullUrl = (() => {
    if (!url) return siteUrl
    if (typeof url !== 'string') return siteUrl
    const trimmed = url.trim()
    if (!trimmed) return siteUrl
    if (trimmed.startsWith('http://') || trimmed.startsWith('https://')) return trimmed
    return `${siteUrl}${trimmed.startsWith('/') ? trimmed : `/${trimmed}`}`
  })()

  const fullImage = (() => {
    if (!image) return `${siteUrl}/portada.webp`
    if (typeof image !== 'string') return `${siteUrl}/portada.webp`
    const trimmed = image.trim()
    if (!trimmed) return `${siteUrl}/portada.webp`
    if (trimmed.startsWith('http://') || trimmed.startsWith('https://')) return trimmed
    return `${siteUrl}${trimmed.startsWith('/') ? trimmed : `/${trimmed}`}`
  })()

  return (
    <Helmet>
      {/* Basic Meta Tags */}
      <title>{title}</title>
      <meta name="description" content={description} />
      <meta name="author" content={author} />
      {tags.length > 0 && <meta name="keywords" content={tags.join(', ')} />}

      {/* Open Graph / Facebook */}
      <meta property="og:type" content={type} />
      <meta property="og:url" content={fullUrl} />
      <meta property="og:title" content={title} />
      <meta property="og:description" content={description} />
      <meta property="og:image" content={fullImage} />
      <meta property="og:site_name" content="Luis Virrueta" />
      {publishedTime && <meta property="article:published_time" content={publishedTime} />}
      {author && <meta property="article:author" content={author} />}
      {tags.map((tag, i) => (
        <meta key={i} property="article:tag" content={tag} />
      ))}

      {/* Twitter */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:url" content={fullUrl} />
      <meta name="twitter:title" content={title} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:image" content={fullImage} />
      <meta name="twitter:creator" content="@luisvirrueta" />

      {/* Additional SEO */}
      <link rel="canonical" content={fullUrl} />
      <meta name="robots" content="index, follow" />
      <meta name="language" content="Spanish" />
      <meta name="revisit-after" content="7 days" />
    </Helmet>
  )
}

export default SEOHead
