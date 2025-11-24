import Home from '../components/Home'
import Hero from '../components/Hero'
import CountriesSection from '../components/CountriesSection'

const HomePage = () => {
  return (
    <>
      {/* Video limpio */}
      <Home />
      
      {/* Nombre cinematográfico con botón Ver más */}
      <Hero />
      
      {/* Sección de países cinematográfica */}
      <CountriesSection />
    </>
  )
}

export default HomePage
