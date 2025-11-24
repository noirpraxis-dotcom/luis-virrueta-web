import { createContext, useContext, useState, useEffect } from 'react'
import translationsEN from '../translations/en.json'
import translationsES from '../translations/es.json'
import translationsCZ from '../translations/cz.json'

const LanguageContext = createContext()

const translations = {
  en: translationsEN,
  es: translationsES,
  cz: translationsCZ
}

// Países hispanohablantes
const spanishSpeakingCountries = [
  'AR', 'BO', 'CL', 'CO', 'CR', 'CU', 'DO', 'EC', 'SV', 'GT', 
  'HN', 'MX', 'NI', 'PA', 'PY', 'PE', 'PR', 'ES', 'UY', 'VE'
]

// Función para detectar el idioma del navegador y región
const detectLanguage = () => {
  // Primero verificar si hay idioma guardado en localStorage
  const savedLanguage = localStorage.getItem('preferredLanguage')
  if (savedLanguage && ['en', 'es', 'cz'].includes(savedLanguage)) {
    return savedLanguage
  }

  // Detectar basado en la región del navegador
  const userLanguage = navigator.language || navigator.userLanguage
  const countryCode = userLanguage.split('-')[1]?.toUpperCase()
  
  // República Checa
  if (countryCode === 'CZ' || userLanguage.startsWith('cs')) {
    return 'cz'
  }
  
  // Países hispanohablantes
  if (spanishSpeakingCountries.includes(countryCode) || userLanguage.startsWith('es')) {
    return 'es'
  }
  
  // Por defecto inglés (para tu trabajo actual y resto del mundo)
  return 'en'
}

export const LanguageProvider = ({ children }) => {
  const [currentLanguage, setCurrentLanguage] = useState('en') // Forzado a inglés inicialmente

  useEffect(() => {
    // Detectar idioma solo en primera carga si no hay preferencia guardada
    const savedLanguage = localStorage.getItem('preferredLanguage')
    if (!savedLanguage) {
      // Por ahora forzamos inglés, más adelante se puede activar la detección
      // const detectedLanguage = detectLanguage()
      // setCurrentLanguage(detectedLanguage)
      setCurrentLanguage('en')
    } else {
      setCurrentLanguage(savedLanguage)
    }
  }, [])

  const changeLanguage = (langCode) => {
    setCurrentLanguage(langCode)
    localStorage.setItem('preferredLanguage', langCode)
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
