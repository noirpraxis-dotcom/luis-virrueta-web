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

// Países hispanohablantes (TODOS)
const spanishSpeakingCountries = [
  'AR', // Argentina
  'BO', // Bolivia
  'CL', // Chile
  'CO', // Colombia
  'CR', // Costa Rica
  'CU', // Cuba
  'DO', // República Dominicana
  'EC', // Ecuador
  'SV', // El Salvador
  'GQ', // Guinea Ecuatorial
  'GT', // Guatemala
  'HN', // Honduras
  'MX', // México
  'NI', // Nicaragua
  'PA', // Panamá
  'PY', // Paraguay
  'PE', // Perú
  'PR', // Puerto Rico
  'ES', // España
  'UY', // Uruguay
  'VE', // Venezuela
  'US', // Estados Unidos (muchos hispanos)
]

// Función para detectar el idioma del navegador y región INTELIGENTE
const detectLanguage = () => {
  // Primero verificar si hay idioma guardado en localStorage
  const savedLanguage = localStorage.getItem('preferredLanguage')
  if (savedLanguage && ['en', 'es', 'cz'].includes(savedLanguage)) {
    return savedLanguage
  }

  // Detectar basado en la región del navegador
  const userLanguage = navigator.language || navigator.userLanguage
  const languageCode = userLanguage.split('-')[0]?.toLowerCase()
  const countryCode = userLanguage.split('-')[1]?.toUpperCase()
  
  console.log('🌍 Detección de idioma:', { userLanguage, languageCode, countryCode })
  
  // PRIORIDAD 1: República Checa (país tiene prioridad sobre idioma)
  if (countryCode === 'CZ') {
    console.log('✅ Detectado país CZ → Checo')
    return 'cz'
  }
  
  // PRIORIDAD 2: Idioma checo sin país especificado
  if (languageCode === 'cs') {
    console.log('✅ Detectado idioma cs → Checo')
    return 'cz'
  }
  
  // PRIORIDAD 3: Países hispanohablantes (solo si el país está en la lista)
  if (countryCode && spanishSpeakingCountries.includes(countryCode)) {
    console.log('✅ Detectado país hispano:', countryCode, '→ Español')
    return 'es'
  }
  
  // PRIORIDAD 4: Idioma español SOLO si no hay país o el país no se detectó
  if (languageCode === 'es' && !countryCode) {
    console.log('✅ Detectado idioma es sin país → Español')
    return 'es'
  }
  
  // Por defecto ESPAÑOL (idioma principal del sitio)
  console.log('✅ Default → Español')
  return 'es'
}

export const LanguageProvider = ({ children }) => {
  const [currentLanguage, setCurrentLanguage] = useState(() => {
    // Inicializar con el idioma guardado o detectado
    const savedLanguage = localStorage.getItem('preferredLanguage')
    if (savedLanguage && ['en', 'es', 'cz'].includes(savedLanguage)) {
      return savedLanguage
    }
    // Detectar automáticamente en primera carga
    return detectLanguage()
  })

  useEffect(() => {
    // Guardar el idioma detectado si no hay preferencia guardada
    const savedLanguage = localStorage.getItem('preferredLanguage')
    if (!savedLanguage) {
      localStorage.setItem('preferredLanguage', currentLanguage)
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
