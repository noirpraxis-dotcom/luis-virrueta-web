import Home from '../components/Home'
import Hero from '../components/Hero'
import LuisViruettaIntro from '../components/LuisViruettaIntro'
import LuxmaniaVideoSection from '../components/LuxmaniaVideoSection'
import AvatarWelcome from '../components/AvatarWelcome'
import BrandCTA from '../components/BrandCTA'
import IndividualServices from '../components/IndividualServices'
import ShowcaseCreations from '../components/ShowcaseCreations'
import WhyLuxmania from '../components/WhyLuxmania'
import LuxmaniaMethod from '../components/LuxmaniaMethod'
import LuxmaniaServices from '../components/LuxmaniaServices'
import AboutCreator from '../components/AboutCreator'
import Testimonials from '../components/Testimonials'

const HomePage = () => {
  return (
    <>
      {/* Video limpio de fondo */}
      <Home />
      
      {/* Luis Virrueta Intro: Compact elegant section - BEFORE Hero stats */}
      <LuisViruettaIntro />
      
      {/* Brand CTA: Llamado a acción principal - Construye tu marca */}
      <BrandCTA />
      
      {/* Luxmania Video Section: ¿Qué es Luxmania? Con video vertical */}
      <LuxmaniaVideoSection />
      
      {/* Individual Services: Servicios a medida en cuadros elegantes */}
      <IndividualServices />
      
      {/* Showcase Creations: Muestra de trabajos con videos */}
      <ShowcaseCreations />
      
      {/* Servicios y Paquetes: Essential, Professional, Luxury */}
      <LuxmaniaServices />
      
      {/* Avatar Welcome: Nuestros avatares te saludan */}
      <AvatarWelcome />
      
      {/* Hero: LUXMANIA - Branding con fundamento psicológico */}
      <Hero />
      
      {/* Por Qué LUXMANIA: El diferenciador psicológico */}
      <WhyLuxmania />
      
      {/* El Método LUXMANIA: Las 4 fases del proceso */}
      <LuxmaniaMethod />
      
      {/* Sobre Mí: Luis Virrueta - Psicólogo, Diseñador, Developer */}
      <AboutCreator />
      
      {/* Testimonios */}
      <Testimonials />
    </>
  )
}

export default HomePage
