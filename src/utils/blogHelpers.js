// Utilidad para calcular el tiempo de lectura basado en palabra count
export const calculateReadTime = (sections) => {
  // Promedio de palabras por minuto en español: 200-250
  const wordsPerMinute = 225
  
  // Contar palabras en todas las secciones
  let totalWords = 0
  
  sections.forEach(section => {
    if (section.content) {
      totalWords += section.content.split(/\s+/).length
    }
    if (section.title) {
      totalWords += section.title.split(/\s+/).length
    }
    if (section.items) {
      section.items.forEach(item => {
        if (item.title) totalWords += item.title.split(/\s+/).length
        if (item.description) totalWords += item.description.split(/\s+/).length
      })
    }
    if (section.colors) {
      section.colors.forEach(color => {
        if (color.emotion) totalWords += color.emotion.split(/\s+/).length
        if (color.brands) totalWords += color.brands.split(/\s+/).length
      })
    }
  })
  
  // Calcular minutos
  const minutes = Math.ceil(totalWords / wordsPerMinute)
  
  return `${minutes} min`
}

// Convertir fecha a formato ISO para Schema
export const toISODate = (dateString) => {
  // Formato: "15 Nov 2024" -> "2024-11-15T00:00:00-06:00"
  const months = {
    'Ene': '01', 'Feb': '02', 'Mar': '03', 'Abr': '04',
    'May': '05', 'Jun': '06', 'Jul': '07', 'Ago': '08',
    'Sep': '09', 'Oct': '10', 'Nov': '11', 'Dic': '12'
  }
  
  const [day, month, year] = dateString.split(' ')
  return `${year}-${months[month]}-${day.padStart(2, '0')}T00:00:00-06:00`
}
