import Home from '../components/Home'
import Hero from '../components/Hero'
import LuisViruettaIntro from '../components/LuisViruettaIntro'
import AvatarWelcome from '../components/AvatarWelcome'
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
      
      {/* Hero: LUXMANIA - Branding con fundamento psicológico */}
      <Hero />
      
      {/* Video de Avatares: Welcome to LUXMANIA */}
      <AvatarWelcome />
      
      {/* Por Qué LUXMANIA: El diferenciador psicológico */}
      <WhyLuxmania />
      
      {/* El Método LUXMANIA: Las 4 fases del proceso */}
      <LuxmaniaMethod />
      
      {/* Servicios y Paquetes: Essential, Professional, Luxury */}
      <LuxmaniaServices />
      
      {/* Sobre Mí: Luis Virrueta - Psicólogo, Diseñador, Developer */}
      <AboutCreator />
      
      {/* Testimonios */}
      <Testimonials />
    </>
  )
}

export default HomePage
