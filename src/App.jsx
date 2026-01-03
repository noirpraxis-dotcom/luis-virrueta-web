import { useState, lazy, Suspense } from 'react'
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom'
import { HelmetProvider } from 'react-helmet-async'
import { LanguageProvider, useLanguage } from './context/LanguageContext'
import { AuthProvider } from './context/AuthContext'
import Header from './components/Header'
import MobileMenu from './components/MobileMenu'
import ToggleButton from './components/ToggleButton'
import HomePage from './pages/HomePage'
import CookieBanner from './components/CookieBanner'
import Footer from './components/Footer'
import WhatsAppButton from './components/WhatsAppButton'
import SmoothScroll from './components/SmoothScroll'
import ScrollToTop from './components/ScrollToTop'
import GoogleAnalytics from './components/GoogleAnalytics'

// Lazy load pages
const PhilosophyPage = lazy(() => import('./pages/PhilosophyPage'))
const ServiciosPage = lazy(() => import('./pages/ServiciosPage'))
const IdentidadMarcaPage = lazy(() => import('./pages/IdentidadMarcaPage'))
const AppsPremiumPage = lazy(() => import('./pages/AppsPremiumPage'))
const ContenidoDigitalPage = lazy(() => import('./pages/ContenidoDigitalPage'))
const AvataresIAPage = lazy(() => import('./pages/AvataresIAPage'))
const ConsultoriaPsicologicaPage = lazy(() => import('./pages/ConsultoriaPsicologicaPage'))
const AboutPage = lazy(() => import('./pages/AboutPage'))
const MetodoPage = lazy(() => import('./pages/MetodoPage'))
const FasesPage = lazy(() => import('./pages/FasesPage'))
const BlogPage = lazy(() => import('./pages/BlogPage'))
const BlogArticlePage = lazy(() => import('./pages/BlogArticlePage'))
const InversionPage = lazy(() => import('./pages/InversionPage'))
const ContactoPage = lazy(() => import('./pages/ContactoPage'))
const StorePage = lazy(() => import('./pages/StorePage'))
const StoreProductPage = lazy(() => import('./pages/StoreProductPage'))
const PrivacyPolicyPage = lazy(() => import('./pages/PrivacyPolicyPage'))
const TermsConditionsPage = lazy(() => import('./pages/TermsConditionsPage'))
const CookiePolicyPage = lazy(() => import('./pages/CookiePolicyPage'))
const VocationalTestPage = lazy(() => import('./pages/VocationalTestPage'))
const FraseDelDiaPage = lazy(() => import('./pages/FraseDelDiaPage'))
const AtlasHumanidadPage = lazy(() => import('./pages/AtlasHumanidadPage'))
const LaboratorioEticoPage = lazy(() => import('./pages/LaboratorioEticoPage'))

// Loading component
const PageLoader = () => (
  <div className="min-h-screen flex items-center justify-center bg-[#0a0a0f]">
    <div className="text-center">
      <div className="w-16 h-16 border-4 border-purple-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
      <p className="text-gray-300">Cargando...</p>
    </div>
  </div>
)

const AppContent = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const { t } = useLanguage()

  const menuItems = [
    { name: t('menu.home'), href: '/' },
    { name: t('menu.metodo'), href: '/metodo' },
    { name: t('menu.services'), href: '/servicios' },
    { name: t('menu.blog'), href: '/blog' },
    { name: t('menu.about'), href: '/sobre-mi' },
    { name: t('menu.contact'), href: '/contacto' },
    { name: 'Tienda', href: '/tienda', special: true }
  ]

  const AppShell = () => {
    const location = useLocation()
    const hideGlobalHeader = location.pathname.startsWith('/test-vocacional/iniciar') || location.pathname === '/frase-del-dia' || location.pathname === '/atlas-humanidad' || location.pathname === '/laboratorio-etico'

    return (
      <div className="relative min-h-screen">
        {/* Desktop Header - visible en pantallas md y superiores, oculto cuando menu mobile está abierto */}
        {!hideGlobalHeader && !isMenuOpen && (
          <Header 
            menuItems={menuItems} 
            onMenuToggle={() => setIsMenuOpen(!isMenuOpen)}
            isMenuOpen={isMenuOpen}
          />
        )}

        {/* Mobile Menu Fullscreen */}
        {!hideGlobalHeader && (
          <MobileMenu 
            isOpen={isMenuOpen} 
            onClose={() => setIsMenuOpen(false)} 
            menuItems={menuItems} 
          />
        )}

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

              {/* Página El Método: Aión */}
              <Route path="/metodo" element={
                <MetodoPage />
              } />

              {/* Página Las Fases del Método */}
              <Route path="/metodo/fases" element={
                <FasesPage />
              } />

              {/* Página Blog: Artículos sobre diseño */}
              <Route path="/blog" element={
                <BlogPage />
              } />

              {/* Página individual de artículo del blog */}
              <Route path="/blog/:slug" element={
                <BlogArticlePage />
              } />

              {/* Test Vocacional */}
              <Route path="/test-vocacional" element={
                <VocationalTestPage key="vocational-landing" />
              } />
              <Route path="/test-vocacional/iniciar" element={
                <VocationalTestPage key="vocational-start" initialStage="test" />
              } />

              {/* Herramientas */}
              <Route path="/frase-del-dia" element={
                <FraseDelDiaPage />
              } />

              <Route path="/atlas-humanidad" element={
                <AtlasHumanidadPage />
              } />

              <Route path="/laboratorio-etico" element={
                <LaboratorioEticoPage />
              } />

              {/* Página Inversión: Precios premium */}
              <Route path="/inversion" element={
                <InversionPage />
              } />

              {/* Página Tienda: Productos y servicios */}
              <Route path="/tienda" element={
                <StorePage />
              } />

              {/* Página Detalle de Producto */}
              <Route path="/tienda/:id" element={
                <StoreProductPage />
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
    )
  }

  return (
    <Router>
      <GoogleAnalytics />
      <ScrollToTop />
      <SmoothScroll>
        <AppShell />
      </SmoothScroll>
    </Router>
  )
}

function App() {
  return (
    <HelmetProvider>
      <LanguageProvider>
        <AuthProvider>
          <AppContent />
        </AuthProvider>
      </LanguageProvider>
    </HelmetProvider>
  )
}

export default App
