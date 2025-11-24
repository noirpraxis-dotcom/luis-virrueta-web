import { useState } from 'react'
import Header from './components/Header'
import MobileMenu from './components/MobileMenu'
import ToggleButton from './components/ToggleButton'
import VideoBackground from './components/VideoBackground'

function App() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)

  const menuItems = [
    { name: 'Home', href: '#home' },
    { name: 'About', href: '#about' },
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

      {/* Contenido principal - con padding solo en desktop grande donde el header es visible */}
      <main className="relative z-0 lg:pt-22">
        {/* Video/Image Background */}
        <VideoBackground />
        
        {/* Aquí irá más contenido */}
      </main>
    </div>
  )
}

export default App
