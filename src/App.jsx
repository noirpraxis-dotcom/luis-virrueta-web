import { useState, lazy, Suspense } from 'react'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import { HelmetProvider } from 'react-helmet-async'
import { LanguageProvider, useLanguage } from './context/LanguageContext'
import Header from './components/Header'
import MobileMenu from './components/MobileMenu'
import ToggleButton from './components/ToggleButton'
import HomePage from './pages/HomePage'
import CookieBanner from './components/CookieBanner'
import Footer from './components/Footer'
import WhatsAppButton from './components/WhatsAppButton'
import SmoothScroll from './components/SmoothScroll'
import ScrollToTop from './components/ScrollToTop'

// Lazy load pages
const PhilosophyPage = lazy(() => import('./pages/PhilosophyPage'))
const ServiciosPage = lazy(() => import('./pages/ServiciosPage'))
const IdentidadMarcaPage = lazy(() => import('./pages/IdentidadMarcaPage'))
const ArquetiposPage = lazy(() => import('./pages/ArquetiposPage'))
const AppsPremiumPage = lazy(() => import('./pages/AppsPremiumPage'))
const ContenidoDigitalPage = lazy(() => import('./pages/ContenidoDigitalPage'))
const AvataresIAPage = lazy(() => import('./pages/AvataresIAPage'))
const ConsultoriaPsicologicaPage = lazy(() => import('./pages/ConsultoriaPsicologicaPage'))
const AboutPage = lazy(() => import('./pages/AboutPage'))
const PortafolioPage = lazy(() => import('./pages/PortafolioPage'))
const BlogPage = lazy(() => import('./pages/BlogPage'))
const BlogArticlePage = lazy(() => import('./pages/BlogArticlePage'))
const InversionPage = lazy(() => import('./pages/InversionPage'))
const ContactoPage = lazy(() => import('./pages/ContactoPage'))
const PrivacyPolicyPage = lazy(() => import('./pages/PrivacyPolicyPage'))
const TermsConditionsPage = lazy(() => import('./pages/TermsConditionsPage'))
const CookiePolicyPage = lazy(() => import('./pages/CookiePolicyPage'))

// Loading component
const PageLoader = () => (
  <div className="min-h-screen flex items-center justify-center bg-[#0a0a0f]">
    <div className="text-center">
      <div className="w-16 h-16 border-4 border-purple-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
      <p className="text-gray-400">Cargando...</p>
    </div>
  </div>
)

const AppContent = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const { t } = useLanguage()

  const menuItems = [
    { name: t('menu.home'), href: '/' },
    { name: t('menu.portfolio'), href: '/portafolio' },
    { name: t('menu.services'), href: '/servicios' },
    { name: t('menu.blog'), href: '/blog' },
    { name: t('menu.about'), href: '/sobre-mi' },
    { name: t('menu.contact'), href: '/contacto' }
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
          <Suspense fallback={<PageLoader />}>
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
          </Suspense>
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
