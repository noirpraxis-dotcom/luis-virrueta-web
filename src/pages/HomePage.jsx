import Home from '../components/Home'
import Hero from '../components/Hero'
import LuisViruettaIntro from '../components/LuisViruettaIntro'
import LuxmaniaVideoSection from '../components/LuxmaniaVideoSection'
import AvatarWelcome from '../components/AvatarWelcome'
import BrandCTA from '../components/BrandCTA'
import IndividualServices from '../components/IndividualServices'
import WhyLuxmania from '../components/WhyLuxmania'
import SEOHead from '../components/SEOHead'
import AionSection from '../components/AionSection'

const HomePage = () => {
  return (
    <>
      <SEOHead 
        title="Luis Virrueta | Psicólogo · Psicoanalista"
        description="Psicólogo especializado en branding estratégico con enfoque en el inconsciente. Fusiono psicología, diseño e IA para crear identidades de marca que conectan emocionalmente."
        image="/og-home.jpg"
        url="/"
        type="website"
        tags={['psicología', 'branding', 'inconsciente', 'diseño', 'arquetipos', 'psicoanálisis']}
      />
      
      {/* Video limpio de fondo */}
      <Home />
      
      {/* Aion Section: Tu realidad son tus filtros - Problema y solución */}
      <AionSection />
      
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
