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
        title="Luis Virrueta | Psicoanalista y Filósofo"
        description="Exploro cómo interpretamos la realidad y por qué seguimos atrapados en patrones que no elegimos. Psicoanálisis, filosofía y transformación del inconsciente."
        image="/og-home.jpg"
        url="/"
        type="website"
        tags={['psicoanálisis', 'filosofía', 'inconsciente', 'percepción', 'transformación', 'ego']}
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
