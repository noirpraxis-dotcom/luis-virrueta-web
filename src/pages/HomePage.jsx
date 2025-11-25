import Home from '../components/Home'
import Hero from '../components/Hero'
import CallToActionSection from '../components/CallToActionSection'
import CountriesSection from '../components/CountriesSection'
import Testimonials from '../components/Testimonials'

const HomePage = () => {
  return (
    <>
      {/* Video limpio */}
      <Home />
      
      {/* Nombre cinematográfico con botón Ver más */}
      <Hero />
      
      {/* Call to Action: Work With Me & WhatsApp Contact */}
      <CallToActionSection />
      
      {/* Sección de países cinematográfica */}
      <CountriesSection />
      
      {/* Testimonios con carrusel */}
      <Testimonials />
    </>
  )
}

export default HomePage
