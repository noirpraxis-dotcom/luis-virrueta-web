import Home from '../components/Home'
import Hero from '../components/Hero'
import AboutLuisSection from '../components/AboutLuisSection'
import AnimatedStats from '../components/AnimatedStats'
import ServicesOverview from '../components/ServicesOverview'
import Testimonials from '../components/Testimonials'

const HomePage = () => {
  return (
    <>
      {/* Video limpio de fondo */}
      <Home />
      
      {/* Hero: Nombre cinematográfico Ainimation con manifiesto */}
      <Hero />
      
      {/* Sobre Mí: Luis Virrueta - Formación y credenciales */}
      <AboutLuisSection />
      
      {/* Estadísticas Animadas: Números que impresionan */}
      <AnimatedStats />
      
      {/* Servicios Overview: 5 servicios principales */}
      <ServicesOverview />
      
      {/* Testimonios con carrusel (reutilizado) */}
      <Testimonials />
    </>
  )
}

export default HomePage
