import { useState } from 'react'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import { HelmetProvider } from 'react-helmet-async'
import { LanguageProvider, useLanguage } from './context/LanguageContext'
import Header from './components/Header'
import MobileMenu from './components/MobileMenu'
import ToggleButton from './components/ToggleButton'
import HomePage from './pages/HomePage'
import PhilosophyPage from './pages/PhilosophyPage'
import ServiciosPage from './pages/ServiciosPage'
import IdentidadMarcaPage from './pages/IdentidadMarcaPage'
import ArquetiposPage from './pages/ArquetiposPage'
import AppsPremiumPage from './pages/AppsPremiumPage'
import ContenidoDigitalPage from './pages/ContenidoDigitalPage'
import AvataresIAPage from './pages/AvataresIAPage'
import ConsultoriaPsicologicaPage from './pages/ConsultoriaPsicologicaPage'
import AboutPage from './pages/AboutPage'
import PortafolioPage from './pages/PortafolioPage'
import BlogPage from './pages/BlogPage'
import BlogArticlePage from './pages/BlogArticlePage'
import InversionPage from './pages/InversionPage'
import ContactoPage from './pages/ContactoPage'
import PrivacyPolicyPage from './pages/PrivacyPolicyPage'
import TermsConditionsPage from './pages/TermsConditionsPage'
import CookiePolicyPage from './pages/CookiePolicyPage'
import CookieBanner from './components/CookieBanner'
import Footer from './components/Footer'
import WhatsAppButton from './components/WhatsAppButton'
import SmoothScroll from './components/SmoothScroll'
import ScrollToTop from './components/ScrollToTop'

const AppContent = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const { t } = useLanguage()

  const menuItems = [
    { name: 'Inicio', href: '/' },
    { name: 'Portafolio', href: '/portafolio' },
    { name: 'Servicios', href: '/servicios' },
    { name: 'Blog', href: '/blog' },
    { name: 'Sobre Mí', href: '/sobre-mi' },
    { name: 'Contacto', href: '/contacto' }
  ]

  return (
    <Router>
      <ScrollToTop />
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
              <PhilosophyPage />
            } />

            {/* Página Servicios: Overview de todos los servicios */}
            <Route path="/servicios" element={
              <ServiciosPage />
            } />

            {/* Páginas individuales de servicios */}
            <Route path="/servicios/identidad-marca" element={
              <IdentidadMarcaPage />
            } />

            {/* Página Arquetipos */}
            <Route path="/identidad-de-marca" element={
              <ArquetiposPage />
            } />

            <Route path="/servicios/apps-premium" element={
              <AppsPremiumPage />
            } />

            <Route path="/servicios/contenido-digital" element={
              <ContenidoDigitalPage />
            } />

            <Route path="/servicios/avatares-ia" element={
              <AvataresIAPage />
            } />

            <Route path="/servicios/consultoria-psicologica" element={
              <ConsultoriaPsicologicaPage />
            } />

            {/* Página Sobre Mí: Historia completa de Luis Virrueta */}
            <Route path="/sobre-mi" element={
              <AboutPage />
            } />

            {/* Página Portafolio: Casos de éxito */}
            <Route path="/portafolio" element={
              <PortafolioPage />
            } />

            {/* Página Blog: Artículos sobre diseño */}
            <Route path="/blog" element={
              <BlogPage />
            } />

            {/* Página individual de artículo del blog */}
            <Route path="/blog/:slug" element={
              <BlogArticlePage />
            } />

            {/* Página Inversión: Precios premium */}
            <Route path="/inversion" element={
              <InversionPage />
            } />

            {/* Página Contacto */}
            <Route path="/contacto" element={
              <ContactoPage />
            } />

            {/* Páginas Legales */}
            <Route path="/politica-privacidad" element={
              <PrivacyPolicyPage />
            } />

            <Route path="/terminos-condiciones" element={
              <TermsConditionsPage />
            } />

            <Route path="/politica-cookies" element={
              <CookiePolicyPage />
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
    <HelmetProvider>
      <LanguageProvider>
        <AppContent />
      </LanguageProvider>
    </HelmetProvider>
  )
}

export default App
