// Utilidad para calcular el tiempo de lectura basado en palabra count
export const calculateReadTime = (sections) => {
  // Promedio más realista para español en lectura de contenido denso
  const wordsPerMinute = 180

  const normalizeText = (value) => {
    if (!value) return ''
    const raw = String(value)
    return raw
      // Remover HTML
      .replace(/<[^>]*>/g, ' ')
      // Convertir links markdown a texto
      .replace(/\[(.*?)\]\((.*?)\)/g, '$1')
      // Remover markdown básico
      .replace(/[*_`~>#-]/g, ' ')
      // Normalizar espacios
      .replace(/\s+/g, ' ')
      .trim()
  }

  const countWords = (value) => {
    const text = normalizeText(value)
    if (!text) return 0
    const matches = text.match(/[\p{L}\p{N}]+/gu)
    return matches ? matches.length : 0
  }

  const addWords = (value) => countWords(value)

  let totalWords = 0
  const list = Array.isArray(sections) ? sections : []

  list.forEach((section) => {
    if (!section) return

    totalWords += addWords(section.title)
    totalWords += addWords(section.subtitle)
    totalWords += addWords(section.content)
    totalWords += addWords(section.author)

    if (Array.isArray(section.items)) {
      section.items.forEach((item) => {
        if (typeof item === 'string') {
          totalWords += addWords(item)
          return
        }
        totalWords += addWords(item?.title)
        totalWords += addWords(item?.description)
        totalWords += addWords(item?.content)
      })
    }

    if (Array.isArray(section.colors)) {
      section.colors.forEach((color) => {
        totalWords += addWords(color?.emotion)
        if (Array.isArray(color?.brands)) {
          color.brands.forEach((brand) => {
            totalWords += addWords(brand)
          })
        } else {
          totalWords += addWords(color?.brands)
        }
      })
    }
  })

  const minutes = Math.max(1, Math.ceil(totalWords / wordsPerMinute))
  return `${minutes} min`
}

// Convertir fecha a formato ISO para Schema
export const toISODate = (dateString) => {
  if (!dateString) return ''

  // Already ISO-like
  if (/^\d{4}-\d{2}-\d{2}T/.test(dateString)) return dateString
  if (/^\d{4}-\d{2}-\d{2}$/.test(dateString)) return `${dateString}T00:00:00Z`

  // Formato: "15 Nov 2024" -> "2024-11-15T00:00:00-06:00"
  const months = {
    'Ene': '01', 'Feb': '02', 'Mar': '03', 'Abr': '04',
    'May': '05', 'Jun': '06', 'Jul': '07', 'Ago': '08',
    'Sep': '09', 'Oct': '10', 'Nov': '11', 'Dic': '12'
  }

  const parts = dateString.split(' ')
  if (parts.length === 3) {
    const [day, month, year] = parts
    if (months[month]) {
      return `${year}-${months[month]}-${day.padStart(2, '0')}T00:00:00-06:00`
    }
  }

  // Fallback: let Date try to parse (handles en-US formats like "Dec 15, 2025")
  const parsed = new Date(dateString)
  if (!Number.isNaN(parsed.getTime())) {
    return parsed.toISOString()
  }

  return ''
}
