import { useState } from 'react'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import Header from './components/Header'
import MobileMenu from './components/MobileMenu'
import ToggleButton from './components/ToggleButton'
import HomePage from './pages/HomePage'
import AboutPage from './pages/AboutPage'

function App() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)

  const menuItems = [
    { name: 'Home', href: '/' },
    { name: 'About', href: '/about' },
    { 
      name: 'Healing sessions', 
      href: '#healing-sessions',
      subItems: [
        { name: 'Emotion, Body and Belief Code', href: '#emotion-body-belief' },
        { name: 'Past life regressions', href: '#past-life-regressions' },
        { name: 'Ilyari somatic transmissions', href: '#ilyari-somatic' },
        { name: 'Healing for animals', href: '#healing-animals' }
      ]
    },
    { name: 'Session prices', href: '#session-prices' },
    { name: 'Personal creation', href: '#personal-creation' },
    { 
      name: 'Store', 
      href: '#store',
      subItems: [
        { name: 'Courses', href: '#courses' }
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
            
            {/* Aquí irán más rutas/páginas */}
          </Routes>
        </main>
      </div>
    </Router>
  )
}

export default App
