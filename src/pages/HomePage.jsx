import Home from '../components/Home'
import Hero from '../components/Hero'
import LuisViruettaIntro from '../components/LuisViruettaIntro'
import LuxmaniaVideoSection from '../components/LuxmaniaVideoSection'
import AvatarWelcome from '../components/AvatarWelcome'
import BrandCTA from '../components/BrandCTA'
import IndividualServices from '../components/IndividualServices'
import WhyLuxmania from '../components/WhyLuxmania'

const HomePage = () => {
  return (
    <>
      {/* Video limpio de fondo */}
      <Home />
      
      {/* Luis Virrueta Intro: Compact elegant section - BEFORE Hero stats */}
      <LuisViruettaIntro />
      
      {/* Luxmania Video Section: ¿Qué es Luxmania? Con video - MOVIDO AQUÍ */}
      <LuxmaniaVideoSection />
      
      {/* Brand CTA: Llamado a acción principal - Construye tu marca */}
      <BrandCTA />
      
      {/* Por Qué LUXMANIA: El diferenciador psicológico */}
      <WhyLuxmania />
      
      {/* Individual Services: Servicios a medida en cuadros elegantes */}
      <IndividualServices />
    </>
  )
}

export default HomePage
