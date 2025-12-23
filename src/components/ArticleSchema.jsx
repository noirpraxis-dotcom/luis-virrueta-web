import { Helmet } from 'react-helmet-async'

const ArticleSchema = ({ 
  title, 
  description, 
  image, 
  author = 'Luis Virrueta',
  publishedTime,
  modifiedTime,
  tags = [],
  url
}) => {
  const siteUrl = 'https://luisvirrueta.com'
  const fullUrl = url ? `${siteUrl}${url}` : siteUrl
  const fullImage = image ? (image.startsWith('http') ? image : `${siteUrl}${image}`) : `${siteUrl}/portada.webp`

  const schema = {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    "headline": title,
    "description": description,
    "image": [fullImage],
    "datePublished": publishedTime,
    "dateModified": modifiedTime || publishedTime,
    "author": {
      "@type": "Person",
      "name": author,
      "url": `${siteUrl}/sobre-mi`,
      "jobTitle": "Psicoanalista y Filósofo",
      "description": "Especialista en Psicoanálisis y Filosofía"
    },
    "publisher": {
      "@type": "Organization",
      "name": "Luis Virrueta",
      "url": siteUrl,
      "logo": {
        "@type": "ImageObject",
        "url": `${siteUrl}/logo.png`
      }
    },
    "mainEntityOfPage": {
      "@type": "WebPage",
      "@id": fullUrl
    },
    "keywords": tags.join(', '),
    "articleSection": tags[0] || "Diseño",
    "inLanguage": "es-MX",
    "isAccessibleForFree": "True",
    "isPartOf": {
      "@type": "Blog",
      "@id": `${siteUrl}/blog`
    }
  }

  // Si hay más de un autor
  if (Array.isArray(author)) {
    schema.author = author.map(name => ({
      "@type": "Person",
      "name": name
    }))
  }

  // BreadcrumbList Schema
  const breadcrumbSchema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    "itemListElement": [
      {
        "@type": "ListItem",
        "position": 1,
        "name": "Inicio",
        "item": siteUrl
      },
      {
        "@type": "ListItem",
        "position": 2,
        "name": "Blog",
        "item": `${siteUrl}/blog`
      },
      {
        "@type": "ListItem",
        "position": 3,
        "name": title,
        "item": fullUrl
      }
    ]
  }

  return (
    <Helmet>
      {/* Schema.org JSON-LD */}
      <script type="application/ld+json">
        {JSON.stringify(schema)}
      </script>
      <script type="application/ld+json">
        {JSON.stringify(breadcrumbSchema)}
      </script>
      
      {/* Open Graph Meta Tags para redes sociales */}
      <meta property="og:title" content={title} />
      <meta property="og:description" content={description} />
      <meta property="og:type" content="article" />
      <meta property="og:url" content={fullUrl} />
      <meta property="og:image" content={fullImage} />
      <meta property="og:image:width" content="1200" />
      <meta property="og:image:height" content="630" />
      <meta property="og:site_name" content="Luis Virrueta" />
      <meta property="article:author" content={author} />
      <meta property="article:published_time" content={publishedTime} />
      <meta property="article:modified_time" content={modifiedTime || publishedTime} />
      {tags.map(tag => (
        <meta key={tag} property="article:tag" content={tag} />
      ))}
      
      {/* Twitter Card Meta Tags */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={title} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:image" content={fullImage} />
      
      {/* WhatsApp específico */}
      <meta property="og:image:alt" content={title} />
    </Helmet>
  )
}

export default ArticleSchema
