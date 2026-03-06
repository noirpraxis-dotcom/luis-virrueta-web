import { createContext, useContext } from 'react'
import translationsES from '../translations/es.json'

const LanguageContext = createContext()

// Idioma único: español. No se soportan otros idiomas.
export const LanguageProvider = ({ children }) => {
  const currentLanguage = 'es'

  const t = (key) => {
    const keys = key.split('.')
    let value = translationsES
    for (const k of keys) {
      value = value?.[k]
    }
    return value || key
  }

  return (
    <LanguageContext.Provider value={{ currentLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  )
}

export const useLanguage = () => {
  const context = useContext(LanguageContext)
  if (!context) {
    throw new Error('useLanguage must be used within a LanguageProvider')
  }
  return context
}
