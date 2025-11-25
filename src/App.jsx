import { useState } from 'react'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import { LanguageProvider, useLanguage } from './context/LanguageContext'
import Header from './components/Header'
import MobileMenu from './components/MobileMenu'
import ToggleButton from './components/ToggleButton'
import HomePage from './pages/HomePage'
import AboutPage from './pages/AboutPage'
import StorePage from './pages/StorePage'
import BooksPage from './pages/BooksPage'
import BookDetailPage from './pages/BookDetailPage'
import ProductDetailPage from './pages/ProductDetailPage'
import HealingSessionsPage from './pages/HealingSessionsPage'
import PersonalCreationPage from './pages/PersonalCreationPage'
import PricesPage from './pages/PricesPage'

const AppContent = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const { t } = useLanguage()

  const menuItems = [
    { name: t('menu.home'), href: '/' },
    { name: t('menu.about'), href: '/about' },
    { 
      name: 'Sessions',
      nameShort: 'Sessions',
      href: '/healing-sessions',
      subItems: [
        { name: t('menu.emotionCode'), href: '/healing-sessions#emotion-body-belief' },
        { name: t('menu.pastLife'), href: '/healing-sessions#past-life-regressions' },
        { name: t('menu.ilyari'), href: '/healing-sessions#ilyari-somatic' },
        { name: t('menu.animals'), href: '/healing-sessions#healing-animals' }
      ]
    },
    { name: 'Prices', href: '/prices' },
    { 
      name: 'Creation',
      nameShort: 'Creation',
      href: '/personal-creation',
      subItems: [
        { name: t('menu.books'), href: '/personal-creation#books' }
      ]
    },
    { 
      name: t('menu.store'), 
      href: '/store',
      subItems: [
        { name: t('menu.courses'), href: '/store#courses' },
        { name: t('menu.books'), href: '/personal-creation#books' }
      ]
    },
  ]

  return (
    <Router>
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
            
            {/* Página About: Independiente con fondo blanco elegante */}
            <Route path="/about" element={
              <div className="lg:pt-28">
                <AboutPage />
              </div>
            } />

            {/* Página Store: Tienda con productos */}
            <Route path="/store" element={
              <div className="lg:pt-28">
                <StorePage />
              </div>
            } />

            {/* Página Store: Detalle de producto individual */}
            <Route path="/store/:productId" element={
              <div className="lg:pt-28">
                <ProductDetailPage />
              </div>
            } />

            {/* Página Books: Biblioteca de libros */}
            <Route path="/books" element={
              <div className="lg:pt-28">
                <BooksPage />
              </div>
            } />

            {/* Página Book Detail: Detalle de libro con donación */}
            <Route path="/books/:bookId" element={
              <div className="lg:pt-28">
                <BookDetailPage />
              </div>
            } />

            {/* Página Healing Sessions: Todas las subsecciones en una página */}
            <Route path="/healing-sessions" element={
              <div className="lg:pt-28">
                <HealingSessionsPage />
              </div>
            } />

            {/* Página Prices: Precios de sesiones */}
            <Route path="/prices" element={
              <div className="lg:pt-28">
                <PricesPage />
              </div>
            } />

            {/* Página Personal Creation: Todas las subsecciones en una página */}
            <Route path="/personal-creation" element={
              <div className="lg:pt-28">
                <PersonalCreationPage />
              </div>
            } />
            
            {/* Aquí irán más rutas/páginas */}
          </Routes>
        </main>
      </div>
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
