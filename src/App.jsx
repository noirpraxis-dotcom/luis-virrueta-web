import { useState } from 'react'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import { LanguageProvider, useLanguage } from './context/LanguageContext'
import Header from './components/Header'
import MobileMenu from './components/MobileMenu'
import ToggleButton from './components/ToggleButton'
import HomePage from './pages/HomePage'
import PhilosophyPage from './pages/PhilosophyPage'
import PrivacyPolicyPage from './pages/PrivacyPolicyPage'
import TermsConditionsPage from './pages/TermsConditionsPage'
import CookiePolicyPage from './pages/CookiePolicyPage'
import CookieBanner from './components/CookieBanner'
import Footer from './components/Footer'
import WhatsAppButton from './components/WhatsAppButton'
import SmoothScroll from './components/SmoothScroll'
import CustomCursor from './components/CustomCursor'

const AppContent = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const { t } = useLanguage()

  const menuItems = [
    { name: 'Inicio', href: '/' },
    { name: 'Sobre Mí', href: '/about' },
    { 
      name: 'Servicios',
      nameShort: 'Servicios',
      href: '/servicios',
      subItems: [
        { name: 'Identidad de Marca', href: '/servicios/identidad-marca' },
        { name: 'Apps Premium', href: '/servicios/apps-premium' },
        { name: 'Contenido Digital', href: '/servicios/contenido-digital' },
        { name: 'Avatares IA', href: '/servicios/avatares-ia' },
        { name: 'Consultoría Psicológica', href: '/servicios/consultoria-psicologica' }
      ]
    },
    { name: 'Portafolio', href: '/portafolio' },
    { name: 'Inversión', href: '/inversion' },
    { name: 'Contacto', href: '/contacto' }
  ]

  return (
    <Router>
      <SmoothScroll>
        <CustomCursor />
        <div className="relative min-h-screen">
          {/* Desktop Header - visible en pantallas md y superiores */}
          <Header menuItems={menuItems} />

        {/* Toggle Button - visible en pantallas pequeñas y tablet */}
        <ToggleButton isOpen={isMenuOpen} onClick={() => setIsMenuOpen(!isMenuOpen)} />

        {/* Mobile Menu Fullscreen */}
        <MobileMenu 
          isOpen={isMenuOpen} 
          onClose={() => setIsMenuOpen(false)} 
          menuItems={menuItems} 
        />

        {/* Contenido principal con rutas */}
        <main className="relative z-0">
          <Routes>
            {/* Página Home: Video + Hero con "Ver más" */}
            <Route path="/" element={
              <div className="lg:pt-28">
                <HomePage />
              </div>
            } />
            
            {/* Página Philosophy: Manifiesto Ainimation - Psych × Design × AI */}
            <Route path="/about" element={
              <div className="lg:pt-28">
                <PhilosophyPage />
              </div>
            } />

            {/* Página Servicios: Overview de todos los servicios */}
            <Route path="/servicios" element={
              <div className="lg:pt-28">
                <div className="min-h-screen bg-black text-white flex items-center justify-center">
                  <h1 className="text-4xl font-display">Servicios - En construcción</h1>
                </div>
              </div>
            } />

            {/* Página Portafolio: Casos de éxito */}
            <Route path="/portafolio" element={
              <div className="lg:pt-28">
                <div className="min-h-screen bg-black text-white flex items-center justify-center">
                  <h1 className="text-4xl font-display">Portafolio - En construcción</h1>
                </div>
              </div>
            } />

            {/* Página Inversión: Precios premium */}
            <Route path="/inversion" element={
              <div className="lg:pt-28">
                <div className="min-h-screen bg-black text-white flex items-center justify-center">
                  <h1 className="text-4xl font-display">Inversión - En construcción</h1>
                </div>
              </div>
            } />

            {/* Página Contacto */}
            <Route path="/contacto" element={
              <div className="lg:pt-28">
                <div className="min-h-screen bg-black text-white flex items-center justify-center">
                  <h1 className="text-4xl font-display">Contacto - En construcción</h1>
                </div>
              </div>
            } />

            {/* Páginas Legales */}
            <Route path="/privacy-policy" element={
              <div className="lg:pt-28">
                <PrivacyPolicyPage />
              </div>
            } />

            <Route path="/terms-conditions" element={
              <div className="lg:pt-28">
                <TermsConditionsPage />
              </div>
            } />

            <Route path="/cookie-policy" element={
              <div className="lg:pt-28">
                <CookiePolicyPage />
              </div>
            } />
            
            {/* Aquí irán más rutas/páginas */}
          </Routes>
        </main>

        {/* Footer - aparece en todas las páginas */}
        <Footer />

        {/* Cookie Banner - aparece solo si no ha dado consentimiento */}
        <CookieBanner />

        {/* WhatsApp Button - flotante en todas las páginas */}
        <WhatsAppButton />
        </div>
      </SmoothScroll>
    </Router>
  )
}

function App() {
  return (
    <LanguageProvider>
      <AppContent />
    </LanguageProvider>
  )
}

export default App
