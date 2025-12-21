import Home from '../components/Home'
import Hero from '../components/Hero'
import LuisViruettaIntro from '../components/LuisViruettaIntro'
import IndividualServices from '../components/IndividualServices'
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
      
      {/* Individual Services: Servicios psicológicos y consultoría */}
      <IndividualServices />
    </>
  )
}

export default HomePage
