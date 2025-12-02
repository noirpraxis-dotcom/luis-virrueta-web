import { useState } from 'react'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import { LanguageProvider, useLanguage } from './context/LanguageContext'
import Header from './components/Header'
import MobileMenu from './components/MobileMenu'
import ToggleButton from './components/ToggleButton'
import HomePage from './pages/HomePage'
import PhilosophyPage from './pages/PhilosophyPage'
import ServiciosPage from './pages/ServiciosPage'
import IdentidadMarcaPage from './pages/IdentidadMarcaPage'
import AppsPremiumPage from './pages/AppsPremiumPage'
import ContenidoDigitalPage from './pages/ContenidoDigitalPage'
import AvataresIAPage from './pages/AvataresIAPage'
import ConsultoriaPsicologicaPage from './pages/ConsultoriaPsicologicaPage'
import PortafolioPage from './pages/PortafolioPage'
import InversionPage from './pages/InversionPage'
import ContactoPage from './pages/ContactoPage'
import PrivacyPolicyPage from './pages/PrivacyPolicyPage'
import TermsConditionsPage from './pages/TermsConditionsPage'
import CookiePolicyPage from './pages/CookiePolicyPage'
import CookieBanner from './components/CookieBanner'
import Footer from './components/Footer'
import WhatsAppButton from './components/WhatsAppButton'
import SmoothScroll from './components/SmoothScroll'

const AppContent = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const { t } = useLanguage()

  const menuItems = [
    { name: 'Inicio', href: '/' },
    { name: 'Método', href: '/#metodo' },
    { name: 'Servicios', href: '/#servicios' },
    { name: 'Portfolio', href: '/portafolio' },
    { name: 'Sobre Mí', href: '/#sobre-mi' },
    { name: 'Contacto', href: '/contacto' }
  ]

  return (
    <Router>
      <SmoothScroll>
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
              <HomePage />
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
                <ServiciosPage />
              </div>
            } />

            {/* Páginas individuales de servicios */}
            <Route path="/servicios/identidad-marca" element={
              <div className="lg:pt-28">
                <IdentidadMarcaPage />
              </div>
            } />

            <Route path="/servicios/apps-premium" element={
              <div className="lg:pt-28">
                <AppsPremiumPage />
              </div>
            } />

            <Route path="/servicios/contenido-digital" element={
              <div className="lg:pt-28">
                <ContenidoDigitalPage />
              </div>
            } />

            <Route path="/servicios/avatares-ia" element={
              <div className="lg:pt-28">
                <AvataresIAPage />
              </div>
            } />

            <Route path="/servicios/consultoria-psicologica" element={
              <div className="lg:pt-28">
                <ConsultoriaPsicologicaPage />
              </div>
            } />

            {/* Página Portafolio: Casos de éxito */}
            <Route path="/portafolio" element={
              <div className="lg:pt-28">
                <PortafolioPage />
              </div>
            } />

            {/* Página Inversión: Precios premium */}
            <Route path="/inversion" element={
              <div className="lg:pt-28">
                <InversionPage />
              </div>
            } />

            {/* Página Contacto */}
            <Route path="/contacto" element={
              <div className="lg:pt-28">
                <ContactoPage />
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
