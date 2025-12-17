import { motion, useInView } from 'framer-motion'
import { useRef } from 'react'
import { Link } from 'react-router-dom'
import { Infinity, Atom, ArrowLeft, CircleDot, Zap, Heart, RefreshCw } from 'lucide-react'
import SEOHead from '../components/SEOHead'

const FasesPage = () => {
  const heroRef = useRef(null)
  const isHeroInView = useInView(heroRef, { once: true, amount: 0.3 })
  
  const faseIRef = useRef(null)
  const isFaseIInView = useInView(faseIRef, { once: true, amount: 0.2 })
  
  const faseIIRef = useRef(null)
  const isFaseIIInView = useInView(faseIIRef, { once: true, amount: 0.2 })
  
  const faseIIIRef = useRef(null)
  const isFaseIIIInView = useInView(faseIIIRef, { once: true, amount: 0.2 })
  
  const faseIVRef = useRef(null)
  const isFaseIVInView = useInView(faseIVRef, { once: true, amount: 0.2 })

  return (
    <>
      <SEOHead 
        title="Las Cuatro Fases del Método AIÓN | Luis Virrueta"
        description="Descubre las cuatro fases del método AIÓN: del síntoma como ancla de realidad hasta la reorganización completa del marco vital."
        image="/og-metodo.jpg"
        url="/metodo/fases"
        type="website"
      />

      <div className="min-h-screen bg-gradient-to-b from-black via-zinc-950 to-black pt-20 lg:pt-28 overflow-hidden">
        {/* Hero Section con Video */}
        <section ref={heroRef} className="relative pt-12 lg:pt-20 pb-40 lg:pb-56 px-6 lg:px-20 overflow-hidden">
          {/* Video de fondo */}
          <div className="absolute inset-0 -top-16 lg:-top-24 -bottom-80 lg:-bottom-96 overflow-hidden pointer-events-none z-0">
            <video
              autoPlay
              loop
              muted
              playsInline
              preload="auto"
              className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full object-cover opacity-60"
              style={{
                minWidth: '100vw',
                minHeight: '100%',
                objectFit: 'cover',
                objectPosition: 'center'
              }}
            >
              <source src="/metodología fases.mp4" type="video/mp4" />
            </video>
          </div>
          
          {/* Gradiente inferior que se mezcla con el contenido */}
          <div className="absolute inset-x-0 bottom-0 h-48 bg-gradient-to-t from-black/100 via-black/50 to-transparent z-[5] pointer-events-none" />

          <div className="relative max-w-6xl mx-auto z-10">
            {/* Botón volver */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={isHeroInView ? { opacity: 1, x: 0 } : {}}
              transition={{ duration: 0.8 }}
              className="mb-12"
            >
              <Link
                to="/metodo"
                className="inline-flex items-center gap-2 text-white/60 hover:text-white/90 transition-colors text-sm"
              >
                <ArrowLeft className="w-4 h-4" strokeWidth={1.5} />
                <span className="font-light">Volver al Método</span>
              </Link>
            </motion.div>

            {/* Título Hero - Las Cuatro Fases */}
            <motion.h1
              initial={{ opacity: 0, y: 30 }}
              animate={isHeroInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 1 }}
              className="text-center mb-12"
            >
              <span
                className="text-6xl sm:text-7xl lg:text-8xl font-extralight text-white inline-block"
                style={{ 
                  letterSpacing: '0.4em',
                  textShadow: '0 0 60px rgba(255, 255, 255, 0.15), 0 10px 40px rgba(168, 85, 247, 0.1)'
                }}
              >
                LAS FASES
              </span>
            </motion.h1>

            {/* Descripción encerrada */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={isHeroInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 1, delay: 0.2 }}
              className="flex justify-center mb-10"
            >
              <div className="inline-flex items-center gap-2 px-6 py-3 border border-white/20 rounded-full backdrop-blur-sm bg-white/5">
                <span className="text-sm sm:text-base font-light text-white/70 tracking-wide">
                  Del síntoma a la reorganización vital
                </span>
              </div>
            </motion.div>
            
            {/* Conceptos clave */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={isHeroInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 1, delay: 0.4 }}
              className="flex flex-wrap items-center justify-center gap-8 mb-8"
            >
              <motion.div 
                className="flex items-center gap-2"
                whileHover={{ scale: 1.05 }}
                transition={{ duration: 0.3 }}
              >
                <CircleDot className="w-5 h-5 text-white/40" strokeWidth={1.5} />
                <span className="text-base sm:text-lg font-light text-white tracking-wide">Transformación</span>
              </motion.div>

              <div className="w-px h-6 bg-white/20" />

              <motion.div 
                className="flex items-center gap-2"
                whileHover={{ scale: 1.05 }}
                transition={{ duration: 0.3 }}
              >
                <RefreshCw className="w-5 h-5 text-white/40" strokeWidth={1.5} />
                <span className="text-base sm:text-lg font-light text-white tracking-wide">Reorganización</span>
              </motion.div>
            </motion.div>

            {/* Pregunta relacionada */}
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={isHeroInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 1, delay: 0.6 }}
              className="text-lg sm:text-xl text-white/60 text-center font-light italic mb-8"
            >
              ¿Qué sucede cuando tu síntoma deja de ser un problema y se convierte en una entrada?
            </motion.p>

            {/* Línea decorativa */}
            <motion.div
              initial={{ scaleX: 0 }}
              animate={isHeroInView ? { scaleX: 1 } : {}}
              transition={{ duration: 1.5, delay: 0.8 }}
              className="h-px bg-gradient-to-r from-transparent via-purple-500/30 to-transparent mx-auto w-64 sm:w-96"
            />
          </div>
        </section>

        {/* Fase I */}
        <section ref={faseIRef} className="relative py-20 lg:py-32 px-6 lg:px-20">
          <div className="max-w-4xl mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={isFaseIInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 1 }}
              className="space-y-8"
            >
              {/* Header de la fase */}
              <div className="relative mb-16">
                <motion.div
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={isFaseIInView ? { opacity: 1, scale: 1 } : {}}
                  transition={{ duration: 0.8 }}
                  className="flex items-center gap-4 mb-6"
                >
                  <div className="p-3 bg-purple-500/10 border border-purple-500/30 rounded-xl">
                    <CircleDot className="w-6 h-6 text-purple-400" strokeWidth={1.5} />
                  </div>
                  <div>
                    <h2 className="text-4xl lg:text-5xl font-light text-white mb-2">
                      Fase I
                    </h2>
                    <h3 className="text-2xl lg:text-3xl font-light text-transparent bg-gradient-to-r from-purple-400 to-fuchsia-400 bg-clip-text">
                      El síntoma como ancla de realidad
                    </h3>
                  </div>
                </motion.div>

                {/* Categorías */}
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={isFaseIInView ? { opacity: 1, y: 0 } : {}}
                  transition={{ duration: 0.8, delay: 0.2 }}
                  className="flex flex-wrap gap-2 text-sm text-white/50 font-light italic mb-8"
                >
                  <span>(economía,</span>
                  <span>salud,</span>
                  <span>ansiedad,</span>
                  <span>depresión,</span>
                  <span>vínculos afectivos,</span>
                  <span>repetición vital)</span>
                </motion.div>
              </div>

              {/* Contenido */}
              <p className="text-xl lg:text-2xl font-light text-white/80 leading-relaxed">
                Todo comienza con algo que duele o incomoda, pero que al mismo tiempo sostiene. Un síntoma no aparece por error. Aparece para conservar una realidad. Puede manifestarse en el cuerpo, en la ansiedad constante, en una depresión que inmoviliza, en dificultades económicas persistentes o en vínculos que se repiten. En todos los casos, su función es la misma: evitar que algo fundamental cambie.
              </p>

              <p className="text-xl lg:text-2xl font-light text-white/70 leading-relaxed">
                Mientras el síntoma existe, ciertas preguntas no se hacen, ciertas pérdidas no se atraviesan y ciertas transformaciones no se vuelven necesarias. El cuerpo, la emoción o la vida material cargan con ese peso para que el resto del mundo permanezca estable. Por eso el síntoma no es un enemigo: es una solución. Una solución costosa, pero eficaz. Es la forma más económica que has encontrado para no tener que perder una realidad completa.
              </p>

              {/* Quote destacado */}
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={isFaseIInView ? { opacity: 1, x: 0 } : {}}
                transition={{ duration: 1, delay: 0.4 }}
                className="relative pl-8 border-l-2 border-purple-500/50 py-6 my-10 bg-purple-900/10 rounded-r-2xl pr-6"
              >
                <p className="text-xl lg:text-2xl font-light italic text-white/80 leading-relaxed">
                  "El síntoma no es un enemigo: es una solución. Una solución costosa, pero eficaz."
                </p>
              </motion.div>
            </motion.div>
          </div>
        </section>

        {/* Divisor visual */}
        <div className="max-w-4xl mx-auto px-6">
          <div className="h-px bg-gradient-to-r from-transparent via-purple-500/30 to-transparent" />
        </div>

        {/* Fase II */}
        <section ref={faseIIRef} className="relative py-20 lg:py-32 px-6 lg:px-20">
          <div className="max-w-4xl mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={isFaseIIInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 1 }}
              className="space-y-8"
            >
              {/* Header de la fase */}
              <div className="relative mb-16">
                <motion.div
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={isFaseIIInView ? { opacity: 1, scale: 1 } : {}}
                  transition={{ duration: 0.8 }}
                  className="flex items-center gap-4 mb-6"
                >
                  <div className="p-3 bg-fuchsia-500/10 border border-fuchsia-500/30 rounded-xl">
                    <Zap className="w-6 h-6 text-fuchsia-400" strokeWidth={1.5} />
                  </div>
                  <div>
                    <h2 className="text-4xl lg:text-5xl font-light text-white mb-2">
                      Fase II
                    </h2>
                    <h3 className="text-2xl lg:text-3xl font-light text-transparent bg-gradient-to-r from-fuchsia-400 to-purple-400 bg-clip-text">
                      La alquimia del sostén
                    </h3>
                  </div>
                </motion.div>

                {/* Categorías */}
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={isFaseIIInView ? { opacity: 1, y: 0 } : {}}
                  transition={{ duration: 0.8, delay: 0.2 }}
                  className="flex flex-wrap gap-2 text-sm text-white/50 font-light italic mb-8"
                >
                  <span>(qué se da y qué se recibe,</span>
                  <span>intercambio invisible,</span>
                  <span>costo del equilibrio)</span>
                </motion.div>
              </div>

              {/* Contenido */}
              <p className="text-xl lg:text-2xl font-light text-white/80 leading-relaxed">
                En esta fase aparece una comprensión incómoda: aquello que parece quitarte algo, en realidad te lo está dando. El síntoma sostiene una identidad, una historia, una forma de pertenecer. A cambio, cobra en cuerpo, en deseo, en energía vital, en libertad emocional o material. Nada se sostiene sin precio.
              </p>

              <p className="text-xl lg:text-2xl font-light text-white/70 leading-relaxed">
                Aquí ocurre una alquimia silenciosa. Lo que entregas y lo que recibes no son opuestos: son la misma cosa. La ansiedad mantiene cierto tipo de vínculo. La carencia económica mantiene una narrativa sobre quién eres y qué puedes esperar de la vida. La enfermedad mantiene una coherencia interna. No porque lo elijas conscientemente, sino porque así se preserva el mundo tal como lo conoces.
              </p>

              <p className="text-xl lg:text-2xl font-light text-white/70 leading-relaxed">
                Cuando esto se vuelve visible, el síntoma deja de confundirse con tu identidad. Ya no es "yo soy así", sino "esto cumple una función". Y ese solo desplazamiento empieza a aflojar el marco que sostenía la realidad.
              </p>

              {/* Quote destacado */}
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={isFaseIIInView ? { opacity: 1, x: 0 } : {}}
                transition={{ duration: 1, delay: 0.4 }}
                className="relative pl-8 border-l-2 border-fuchsia-500/50 py-6 my-10 bg-fuchsia-900/10 rounded-r-2xl pr-6"
              >
                <p className="text-xl lg:text-2xl font-light italic text-white/80 leading-relaxed">
                  "Lo que entregas y lo que recibes no son opuestos: son la misma cosa."
                </p>
              </motion.div>
            </motion.div>
          </div>
        </section>

        {/* Divisor visual */}
        <div className="max-w-4xl mx-auto px-6">
          <div className="h-px bg-gradient-to-r from-transparent via-fuchsia-500/30 to-transparent" />
        </div>

        {/* Fase III */}
        <section ref={faseIIIRef} className="relative py-20 lg:py-32 px-6 lg:px-20">
          <div className="max-w-4xl mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={isFaseIIIInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 1 }}
              className="space-y-8"
            >
              {/* Header de la fase */}
              <div className="relative mb-16">
                <motion.div
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={isFaseIIIInView ? { opacity: 1, scale: 1 } : {}}
                  transition={{ duration: 0.8 }}
                  className="flex items-center gap-4 mb-6"
                >
                  <div className="p-3 bg-violet-500/10 border border-violet-500/30 rounded-xl">
                    <Heart className="w-6 h-6 text-violet-400" strokeWidth={1.5} />
                  </div>
                  <div>
                    <h2 className="text-4xl lg:text-5xl font-light text-white mb-2">
                      Fase III
                    </h2>
                    <h3 className="text-2xl lg:text-3xl font-light text-transparent bg-gradient-to-r from-violet-400 to-fuchsia-400 bg-clip-text">
                      La muerte funcional del ego
                    </h3>
                  </div>
                </motion.div>

                {/* Categorías */}
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={isFaseIIIInView ? { opacity: 1, y: 0 } : {}}
                  transition={{ duration: 0.8, delay: 0.2 }}
                  className="flex flex-wrap gap-2 text-sm text-white/50 font-light italic mb-8"
                >
                  <span>(pérdida de identidad,</span>
                  <span>caída de certezas,</span>
                  <span>duelo,</span>
                  <span>vacío,</span>
                  <span>entre-tiempo)</span>
                </motion.div>
              </div>

              {/* Contenido */}
              <p className="text-xl lg:text-2xl font-light text-white/80 leading-relaxed">
                Cuando el síntoma pierde su lugar central, no aparece alivio inmediato. Aparece vacío. La realidad que antes te sostenía comienza a perder su evidencia. No se revela como falsa, sino como perteneciente a otro tiempo. Lo que antes organizaba todo —ideas sobre ti, sobre los demás, sobre el mundo— empieza a desmoronarse.
              </p>

              <p className="text-xl lg:text-2xl font-light text-white/70 leading-relaxed">
                Esta fase duele porque no se trata de cambiar conductas, sino de dejar de ser quien eras para seguir sosteniendo ese sistema. Hay una pérdida real: de certezas, de relatos, de vínculos, de sentido. Es una muerte funcional del ego. El tiempo se vuelve extraño: el pasado ya no explica del todo el presente y el futuro todavía no tiene forma.
              </p>

              <p className="text-xl lg:text-2xl font-light text-white/70 leading-relaxed">
                Aquí muchos retroceden. Volver al síntoma es volver a una realidad conocida. Pero sostener este espacio, sin llenarlo rápido de sentido ni de promesas, permite que algo distinto empiece a emerger.
              </p>

              {/* Quote destacado */}
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={isFaseIIIInView ? { opacity: 1, x: 0 } : {}}
                transition={{ duration: 1, delay: 0.4 }}
                className="relative pl-8 border-l-2 border-violet-500/50 py-6 my-10 bg-violet-900/10 rounded-r-2xl pr-6"
              >
                <p className="text-xl lg:text-2xl font-light italic text-white/80 leading-relaxed">
                  "Hay una pérdida real: de certezas, de relatos, de vínculos, de sentido. Es una muerte funcional del ego."
                </p>
              </motion.div>
            </motion.div>
          </div>
        </section>

        {/* Divisor visual */}
        <div className="max-w-4xl mx-auto px-6">
          <div className="h-px bg-gradient-to-r from-transparent via-violet-500/30 to-transparent" />
        </div>

        {/* Fase IV */}
        <section ref={faseIVRef} className="relative py-20 lg:py-32 px-6 lg:px-20">
          <div className="max-w-4xl mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={isFaseIVInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 1 }}
              className="space-y-8"
            >
              {/* Header de la fase */}
              <div className="relative mb-16">
                <motion.div
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={isFaseIVInView ? { opacity: 1, scale: 1 } : {}}
                  transition={{ duration: 0.8 }}
                  className="flex items-center gap-4 mb-6"
                >
                  <div className="p-3 bg-emerald-500/10 border border-emerald-500/30 rounded-xl">
                    <RefreshCw className="w-6 h-6 text-emerald-400" strokeWidth={1.5} />
                  </div>
                  <div>
                    <h2 className="text-4xl lg:text-5xl font-light text-white mb-2">
                      Fase IV
                    </h2>
                    <h3 className="text-2xl lg:text-3xl font-light text-transparent bg-gradient-to-r from-emerald-400 to-purple-400 bg-clip-text">
                      Reorganización del marco y del tiempo
                    </h3>
                  </div>
                </motion.div>

                {/* Categorías */}
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={isFaseIVInView ? { opacity: 1, y: 0 } : {}}
                  transition={{ duration: 0.8, delay: 0.2 }}
                  className="flex flex-wrap gap-2 text-sm text-white/50 font-light italic mb-8"
                >
                  <span>(cuerpo,</span>
                  <span>salud,</span>
                  <span>economía,</span>
                  <span>relaciones,</span>
                  <span>deseo,</span>
                  <span>nueva coherencia vital)</span>
                </motion.div>
              </div>

              {/* Contenido */}
              <p className="text-xl lg:text-2xl font-light text-white/80 leading-relaxed">
                Cuando un nuevo marco comienza a tomar forma, no lo hace como una decisión voluntaria ni como una idea positiva. Aparece como una reorganización profunda del sistema. El cuerpo —que siempre fue el pergamino donde se escribía la verdad del viejo marco— empieza a responder de otra manera. No porque "se cure" algo aislado, sino porque ya no necesita seguir sosteniendo la antigua coherencia.
              </p>

              <p className="text-xl lg:text-2xl font-light text-white/70 leading-relaxed">
                La salud, las emociones, los vínculos y la economía comienzan a cambiar porque el sistema que los producía ha caído. Donde antes había una idea que organizaba todo —sobre quién eres, qué mereces, qué es posible— ahora hay otra forma de estar en el mundo. No se cambia el pasado; cambia desde dónde el pasado significa algo. Y al cambiar eso, es como si empezaras a habitar otra línea del tiempo.
              </p>

              <p className="text-xl lg:text-2xl font-light text-white/70 leading-relaxed">
                Nada de esto ocurre por magia. Ocurre porque lo que fue creado desde un marco puede deshacerse cuando ese marco deja de ser necesario. El cuerpo ya no tiene que hablar lo que la conciencia no podía escuchar. La vida ya no necesita repetir para sostenerse. Lo que emerge no es una versión ideal, sino una realidad más coherente con quien ahora eres.
              </p>

              {/* Quote destacado final */}
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={isFaseIVInView ? { opacity: 1, scale: 1 } : {}}
                transition={{ duration: 1, delay: 0.4 }}
                className="relative p-10 my-16 bg-gradient-to-br from-emerald-900/20 to-purple-900/20 backdrop-blur-xl border-2 border-emerald-500/30 rounded-3xl"
              >
                <p className="text-2xl lg:text-3xl font-light text-white/90 leading-relaxed text-center">
                  "Lo que emerge no es una versión ideal, sino una realidad más coherente con quien ahora eres."
                </p>
              </motion.div>
            </motion.div>
          </div>
        </section>

        {/* CTA Final */}
        <section className="relative py-20 lg:py-32 px-6 lg:px-20">
          <div className="max-w-3xl mx-auto text-center">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 1 }}
              className="space-y-8"
            >
              <h2 className="text-3xl lg:text-4xl font-light text-white leading-tight">
                ¿Listo para comenzar tu proceso?
              </h2>
              <Link
                to="/contacto"
                className="inline-flex items-center gap-3 px-10 py-5 bg-gradient-to-r from-purple-600 via-fuchsia-600 to-purple-600 text-white rounded-full font-light text-lg hover:shadow-2xl hover:shadow-purple-500/50 transition-all duration-500"
              >
                <span>Contáctame</span>
                <Zap className="w-5 h-5" strokeWidth={2} />
              </Link>
            </motion.div>
          </div>
        </section>
      </div>
    </>
  )
}

export default FasesPage
