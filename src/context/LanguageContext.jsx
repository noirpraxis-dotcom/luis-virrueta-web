import { createContext, useContext, useState, useEffect } from 'react'
import translationsES from '../translations/es.json'

const LanguageContext = createContext()

const translations = {
  es: translationsES
}

// Función simplificada - siempre español
const detectLanguage = () => {
  return 'es'
}

export const LanguageProvider = ({ children }) => {
  const [currentLanguage, setCurrentLanguage] = useState('es')

  const changeLanguage = (langCode) => {
    setCurrentLanguage('es') // Siempre español
  }

  const t = (key) => {
    const keys = key.split('.')
    let value = translations[currentLanguage]
    
    for (const k of keys) {
      value = value?.[k]
    }
    
    return value || key
  }

  return (
    <LanguageContext.Provider value={{ 
      currentLanguage, 
      changeLanguage, 
      t,
      detectLanguage 
    }}>
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
