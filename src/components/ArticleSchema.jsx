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
  const siteUrl = 'https://lux-mania.com'
  const fullUrl = url ? `${siteUrl}${url}` : siteUrl
  const fullImage = image ? `${siteUrl}${image}` : `${siteUrl}/og-default.jpg`

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
      "jobTitle": "Psicólogo, Diseñador & Developer",
      "description": "Especialista en Psych × Design × Tech"
    },
    "publisher": {
      "@type": "Organization",
      "name": "LUXMANIA",
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
      <script type="application/ld+json">
        {JSON.stringify(schema)}
      </script>
      <script type="application/ld+json">
        {JSON.stringify(breadcrumbSchema)}
      </script>
    </Helmet>
  )
}

export default ArticleSchema
