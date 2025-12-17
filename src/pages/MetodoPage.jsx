import { motion, useInView } from 'framer-motion'
import { useRef } from 'react'
import { Link } from 'react-router-dom'
import { Brain, Sparkles, ArrowRight, Zap, Users, Heart, TrendingUp, Activity, Infinity, Atom } from 'lucide-react'
import SEOHead from '../components/SEOHead'

const MetodoPage = () => {
  const heroRef = useRef(null)
  const isHeroInView = useInView(heroRef, { once: true, amount: 0.3 })
  const storyRef = useRef(null)
  const isStoryInView = useInView(storyRef, { once: true, amount: 0.1 })
  const scienceRef = useRef(null)
  const isScienceInView = useInView(scienceRef, { once: true, amount: 0.05 })

  const problemAreas = [
    {
      icon: Activity,
      title: 'Salud',
      problem: 'Síntomas físicos crónicos, enfermedades autoinmunes, dolor sin diagnóstico claro',
      science: 'Bruce Lipton (biólogo celular) demostró en su libro que las señales del entorno, filtradas por nuestras percepciones, alteran la expresión genética sin modificar el ADN. Joe Dispenza documenta en sus investigaciones cómo estados meditativos sostenidos regeneran tejidos y revierten condiciones crónicas al cambiar las señales electromagnéticas del corazón y cerebro.',
      ancestral: 'La medicina tradicional china (3000 años) identifica que el Shen (mente-espíritu) gobierna el Qi (energía vital) del cuerpo. Los Upanishads védicos enseñaban que como es en el cuerpo, es en el universo. Los curanderos mazatecos sabían que la enfermedad es el alma que perdió su camino.',
      reversible: 'Cuando la consciencia cambia su interpretación del entorno, el cuerpo altera su bioquímica en tiempo real',
      delay: 0.2
    },
    {
      icon: Heart,
      title: 'Relaciones',
      problem: 'Repetir los mismos conflictos con personas diferentes, atracción hacia dinámicas tóxicas',
      science: 'El Dr. Dan Siegel (neuropsiquiatra de UCLA) explica que los modelos internos de apego se forman en los primeros años y crean filtros neuronales que buscan inconscientemente lo familiar, aunque sea disfuncional. Sue Johnson (creadora de la Terapia Enfocada en Emociones) documenta que el 70% de los conflictos de pareja provienen de patrones inconscientes heredados, no de incompatibilidad real.',
      ancestral: 'Los sufíes persas enseñaban que no vemos a los demás como son, los vemos como somos nosotros. La filosofía Ubuntu africana establece que yo soy porque tú eres, reconociendo que nuestras relaciones son espejos de nuestra consciencia interna. Los toltecas hablaban del espejo humeante (tezcatlipoca): cada persona refleja aspectos no reconocidos de ti mismo.',
      reversible: 'Al volver consciente el filtro relacional interno, atraes dinámicas coherentes con tu nueva percepción',
      delay: 0.3
    },
    {
      icon: Brain,
      title: 'Emociones',
      problem: 'Ansiedad crónica, depresión recurrente, estados emocionales que no responden a tratamiento convencional',
      science: 'Candace Pert (neurocientífica) descubrió que las emociones son moléculas de información (neuropéptidos) que el cerebro secreta según cómo interpreta los eventos. Richard Davidson (neurocientífico de Wisconsin) demostró con neuroimagen que la práctica contemplativa reorganiza la corteza prefrontal, alterando permanentemente los umbrales emocionales. La psiconeuroinmunología confirma que pensamientos sostenidos modifican citoquinas inflamatorias.',
      ancestral: 'El Abhidharma budista (500 a.C.) clasificó 52 estados mentales y enseñó que todos surgen de la percepción errónea (vipallasa). Los estoicos romanos diferenciaban entre lo que ocurre (acontecimientos) y lo que pensamos sobre ello (juicios). Los chamanes shipibo-conibo del Amazonas identifican que las emociones atrapadas crean nudos energéticos (yoshin) que distorsionan la percepción.',
      reversible: 'Modificar el filtro interpretativo disuelve el patrón emocional en su origen neuroquímico',
      delay: 0.4
    },
    {
      icon: TrendingUp,
      title: 'Dinero',
      problem: 'Ciclos de escasez repetitivos, incapacidad de sostener abundancia, autosabotaje económico',
      science: 'Daniel Kahneman (Premio Nobel de Economía) demostró que el 90% de las decisiones financieras se basan en sesgos cognitivos inconscientes, no en análisis racional. Brad Klontz (psicólogo financiero) identifica guiones monetarios implícitos heredados familiarmente que operan como filtros automáticos. Robert Cialdini documenta cómo las creencias sobre el dinero actúan como profecías autocumplidas que alteran el comportamiento y los resultados.',
      ancestral: 'El Kybalión hermético (tradición egipcia) establece que el TODO es Mente y el Universo es mental, explicando que la riqueza externa refleja la riqueza interna percibida. La Kábala judía enseña que la Shefa (abundancia divina) fluye según el recipiente de consciencia (kli) que uno sostiene. Los Huna hawaianos sabían que el mana (poder vital) sigue al foco de atención: donde pones tu consciencia, ahí fluye la energía y los recursos.',
      reversible: 'La realidad financiera se reorganiza cuando el filtro de escasez colapsa hacia suficiencia',
      delay: 0.5
    }
  ]

  return (
    <>
      <SEOHead 
        title="El Método Aión | Luis Virrueta - Psicólogo"
        description="El método que integra sabiduría ancestral y ciencia contemporánea para transformar tu salud, relaciones, emociones y economía desde la raíz."
        image="/og-metodo.jpg"
        url="/metodo"
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
              <source src="/tiempo metodo.mp4" type="video/mp4" />
            </video>
          </div>
          
          {/* Gradiente inferior que se mezcla con el contenido */}
          <div className="absolute inset-x-0 bottom-0 h-48 bg-gradient-to-t from-black/100 via-black/50 to-transparent z-[5] pointer-events-none" />

          <div className="relative max-w-6xl mx-auto z-10">
            {/* Título Hero - AIÓN */}
            <motion.h1
              initial={{ opacity: 0, y: 30 }}
              animate={isHeroInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 1 }}
              className="text-center mb-12"
            >
              <span
                className="text-7xl sm:text-8xl lg:text-9xl font-extralight text-white inline-block"
                style={{ 
                  letterSpacing: '0.4em',
                  textShadow: '0 0 60px rgba(255, 255, 255, 0.15), 0 10px 40px rgba(168, 85, 247, 0.1)'
                }}
              >
                AIÓN
              </span>
            </motion.h1>

            {/* Descripción encerrada - El método que combina */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={isHeroInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 1, delay: 0.2 }}
              className="flex justify-center mb-10"
            >
              <div className="inline-flex items-center gap-2 px-6 py-3 border border-white/20 rounded-full backdrop-blur-sm bg-white/5">
                <span className="text-sm sm:text-base font-light text-white/70 tracking-wide">
                  El método que combina
                </span>
              </div>
            </motion.div>
            
            {/* Lo Ancestral y Lo Contemporáneo - Sin encerrar, en blanco, elegantes */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={isHeroInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 1, delay: 0.4 }}
              className="flex flex-wrap items-center justify-center gap-8 mb-8"
            >
              {/* Lo Ancestral - sin border */}
              <motion.div 
                className="flex items-center gap-2"
                whileHover={{ scale: 1.05 }}
                transition={{ duration: 0.3 }}
              >
                <Infinity className="w-5 h-5 text-white/40" strokeWidth={1.5} />
                <span className="text-base sm:text-lg font-light text-white tracking-wide">Lo Ancestral</span>
              </motion.div>

              {/* Separador minimalista */}
              <div className="w-px h-6 bg-white/20" />

              {/* Lo Contemporáneo - sin border */}
              <motion.div 
                className="flex items-center gap-2"
                whileHover={{ scale: 1.05 }}
                transition={{ duration: 0.3 }}
              >
                <Atom className="w-5 h-5 text-white/40" strokeWidth={1.5} />
                <span className="text-base sm:text-lg font-light text-white tracking-wide">Lo Contemporáneo</span>
              </motion.div>
            </motion.div>

            {/* Línea decorativa */}
            <motion.div
              initial={{ scaleX: 0 }}
              animate={isHeroInView ? { scaleX: 1 } : {}}
              transition={{ duration: 1.5, delay: 0.6 }}
              className="h-px bg-gradient-to-r from-transparent via-purple-500/30 to-transparent mx-auto w-64 sm:w-96"
            />
          </div>
        </section>

        {/* Story Section - Descubrimiento de Intersecciones Temporales */}
        <section ref={storyRef} className="relative py-20 lg:py-32 px-6 lg:px-20">
          <div className="max-w-4xl mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={isStoryInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 1 }}
              className="space-y-8"
            >
              {/* Párrafo introductorio - Contexto personal */}
              <p className="text-xl lg:text-2xl font-light text-white/80 leading-relaxed">
                Actualmente vivo en <span className="text-white/90 font-normal">Europa</span>.{' '}
                He trabajado con cientos de pacientes en <span className="text-purple-300 font-normal">México</span> y{' '}
                en distintas ciudades europeas, estudiando{' '}
                <span className="text-fuchsia-300">culturas ancestrales</span>,{' '}
                <span className="text-violet-300">tradiciones filosóficas</span> y{' '}
                <span className="text-white/90">lo más nuevo de la psicología contemporánea</span>.
              </p>

              <p className="text-xl lg:text-2xl font-light text-white/70 leading-relaxed">
                Y algo se volvió imposible de ignorar:{' '}
                <span className="text-white font-normal">intersecciones</span> que se repiten a través del tiempo.
              </p>

              <p className="text-xl lg:text-2xl font-light text-white/70 leading-relaxed">
                Lo que <span className="text-purple-300 font-normal">científicos contemporáneos</span> están descubriendo hoy,{' '}
                con microscopios electrónicos y aceleradores de partículas,{' '}
                <span className="text-white/90 font-normal">ya había sido descubierto</span> por{' '}
                <span className="text-fuchsia-300 font-normal">sabios ancestrales</span> a través de la contemplación profunda.{' '}
                <span className="italic text-white/80">Las mismas verdades, diferentes lenguajes, diferentes épocas</span>.
              </p>

              {/* Quote sobre tiempo no-lineal - Einstein */}
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={isStoryInView ? { opacity: 1, x: 0 } : {}}
                transition={{ duration: 1, delay: 0.4 }}
                className="relative pl-8 border-l-2 border-purple-500/50 py-6 my-10"
              >
                <p className="text-xl lg:text-2xl font-light italic text-white/70 leading-relaxed mb-4">
                  "El pasado, presente y futuro coexisten simultáneamente.
                  <br />
                  <span className="text-white/90">El tiempo es una ilusión persistente</span>."
                </p>
                <p className="text-sm text-purple-300 font-normal not-italic">— Albert Einstein</p>
              </motion.div>

              <p className="text-xl lg:text-2xl font-light text-white/70 leading-relaxed">
                El físico cuántico <span className="text-white/90 font-normal">Hugh Everett</span> propuso la teoría de los{' '}
                <span className="text-purple-300">universos múltiples</span> coexistiendo simultáneamente.{' '}
                Los <span className="text-fuchsia-300 font-normal">místicos védicos</span> lo llamaban{' '}
                <span className="italic text-white/90">"El Eterno Ahora"</span>.{' '}
                Los <span className="text-fuchsia-300 font-normal">griegos antiguos</span> lo personificaron en{' '}
                <span className="text-white font-normal">Aión</span>.
              </p>

              {/* Explicación del nombre AIÓN */}
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={isStoryInView ? { opacity: 1, scale: 1 } : {}}
                transition={{ duration: 1, delay: 0.6 }}
                className="my-12 p-8 lg:p-10 bg-gradient-to-br from-purple-900/40 to-fuchsia-900/40 backdrop-blur-xl border-2 border-purple-500/50 rounded-3xl"
              >
                <p className="text-lg lg:text-xl font-light text-white/80 leading-relaxed mb-4">
                  Por eso puse a este método el nombre <span className="text-transparent bg-gradient-to-r from-purple-300 to-fuchsia-300 bg-clip-text font-normal text-2xl">AIÓN</span>.
                </p>
                <p className="text-lg lg:text-xl font-light text-white/70 leading-relaxed">
                  En la <span className="text-purple-300">mitología y filosofía griega</span>,{' '}
                  <span className="text-white/90 font-normal">Aión</span> es la entidad que personifica el{' '}
                <span className="text-fuchsia-300">tiempo eterno, infinito y cíclico</span>, a diferencia de{' '}
                  <span className="text-white/80 italic">Cronos</span>, que representa el{' '}
                  <span className="text-white/70">tiempo lineal y medible</span>.
                </p>
                <p className="text-lg lg:text-xl font-light text-white/70 leading-relaxed mt-4">
                  Aión es el tiempo donde <span className="text-white/90">todo coexiste</span>.{' '}
                  Donde el conocimiento ancestral y la ciencia contemporánea{' '}
                  <span className="text-purple-300 italic">se encuentran en el mismo instante</span>.
                </p>
              </motion.div>

              {/* Divisor visual */}
              <motion.div
                initial={{ scaleX: 0 }}
                animate={isStoryInView ? { scaleX: 1 } : {}}
                transition={{ duration: 1, delay: 0.6 }}
                className="h-px bg-gradient-to-r from-transparent via-purple-500/50 to-transparent my-12"
              />

              {/* Primera persona directa - Autoridad filosófica */}
              <p className="text-2xl lg:text-3xl font-light text-white/90 leading-relaxed">
                Sabes algo que probablemente ya intuyes, pero que la cultura del diagnóstico te ha hecho olvidar...
              </p>

              <p className="text-xl lg:text-2xl font-light text-white/70 leading-relaxed">
                Cuando te dan un <span className="text-white/90">diagnóstico</span> (ya sea médico, psicológico o económico),{' '}
                la mente tiende a cerrarse alrededor de él como si fuera{' '}
                <span className="text-white font-normal">la única realidad posible</span>.{' '}
                Paradójicamente, la gente busca las <span className="text-purple-300">soluciones más complicadas</span>{' '}
                porque la razón ha aprendido a <span className="italic text-white/80">confundir complejidad con veracidad</span>.
              </p>

              <p className="text-xl lg:text-2xl font-light text-white/80 leading-relaxed">
                Pero, ¿y si el problema no es{' '}<span className="text-white font-normal italic">lo que te pasa</span>,{' '}
                sino <span className="text-purple-300 font-normal">cómo lo estás interpretando</span>?
              </p>

              {/* Ejemplo de la fiebre - metáfora profunda */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={isStoryInView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 1, delay: 0.8 }}
                className="relative p-8 bg-gradient-to-br from-purple-900/20 to-fuchsia-900/20 backdrop-blur-sm border border-purple-500/30 rounded-2xl my-10"
              >
                <p className="text-lg lg:text-xl font-light text-white/70 leading-relaxed">
                  Considera la <span className="text-purple-300 font-normal">fiebre</span>:{' '}
                  no es una enfermedad, es una <span className="text-white/90">respuesta inteligente del organismo</span>{' '}
                  elevando su temperatura para neutralizar patógenos.{' '}
                  Si solo suprimes el síntoma sin <span className="text-fuchsia-300">comprender su función</span>,{' '}
                  estás <span className="italic text-white/80">interrumpiendo el proceso de curación</span>.
                </p>
                <p className="text-lg lg:text-xl font-light text-white/80 leading-relaxed mt-4">
                  La <span className="text-white font-normal">ansiedad</span>, los{' '}
                  <span className="text-white font-normal">conflictos relacionales recurrentes</span>,{' '}
                  el <span className="text-white font-normal">estancamiento económico</span>,{' '}
                  todos operan bajo el mismo principio.{' '}
                  <span className="text-purple-300 font-normal italic">Son manifestaciones de un filtro inconsciente pidiendo ser reconocido</span>.
                </p>
              </motion.div>

              {/* Transición al descubrimiento científico - Con más profundidad */}
              <p className="text-2xl lg:text-3xl font-light text-white/90 leading-relaxed">
                Y fue entonces cuando la revelación se volvió innegable:
              </p>

              <p className="text-xl lg:text-2xl font-light text-white/70 leading-relaxed">
                La <span className="text-purple-300 font-normal">ciencia más rigurosa</span> de nuestra época\u2014{' '}
                <span className="text-white/90">epigenética molecular, física cuántica, neuropsicología afectiva, psicología económica</span>\u2014{' '}
                estaba llegando <span className="text-white font-normal">exactamente a las mismas conclusiones</span> que{' '}
                <span className="text-fuchsia-300 font-normal">Buda Gautama</span>,{' '}
                <span className="text-fuchsia-300 font-normal">los filósofos presocráticos</span> y{' '}
                <span className="text-fuchsia-300 font-normal">Hermes Trismegisto</span> habían alcanzado{' '}
                <span className="italic text-white/80">hace más de dos milenios</span>.
              </p>

              <p className="text-xl lg:text-2xl font-light text-white/70 leading-relaxed">
                <span className="text-white/90">Bruce Lipton</span> demostrando que las creencias alteran la expresión genética.{' '}
                <span className="text-white/90">Niels Bohr</span> confirmando que el observador modifica lo observado.{' '}
                <span className="text-white/90">Daniel Kahneman</span> revelando que los mercados se mueven por narrativas emocionales,{' '}
                no por datos objetivos.
              </p>

              {/* Quote final contundente */}
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={isStoryInView ? { opacity: 1, scale: 1 } : {}}
                transition={{ duration: 1, delay: 1 }}
                className="my-16 p-10 lg:p-14 bg-gradient-to-br from-purple-900/30 to-fuchsia-900/30 backdrop-blur-xl border-2 border-purple-500/40 rounded-3xl"
              >
                <p className="text-2xl lg:text-3xl font-light text-white/90 leading-relaxed text-center italic">
                  Los físicos cuánticos confirman lo que los místicos siempre supieron:
                  <br />
                  <span className="text-transparent bg-gradient-to-r from-purple-300 to-fuchsia-300 bg-clip-text font-normal not-italic">
                    la consciencia colapsa la realidad en el acto de observarla
                  </span>
                </p>
              </motion.div>

              <p className="text-xl lg:text-2xl font-light text-white/80 leading-relaxed">
                En el marco de <span className="text-purple-300 italic">Aión</span>,{' '}
                <span className="text-white font-normal">todo está sucediendo simultáneamente</span>.{' '}
                En este preciso instante, <span className="text-fuchsia-300">múltiples versiones de tu vida</span> coexisten:{' '}
                múltiples estados de salud, de relación, de economía, de consciencia.{' '}
                <span className="text-white font-normal">La que experimentas como "real"</span> es simplemente aquella hacia la que{' '}
                <span className="text-purple-300 italic">tu filtro inconsciente ha colapsado tu atención</span>.
              </p>

              <p className="text-xl lg:text-2xl font-light text-white/70 leading-relaxed">
                Hermes Trismegisto lo codificó en el <span className="italic text-fuchsia-300">Kybalión</span>:{' '}
                <span className="text-white/90">"Como es arriba, es abajo; como es adentro, es afuera"</span>.{' '}
                Buda lo enseñó de otra forma: <span className="text-white/90">"Somos lo que pensamos; todo lo que somos surge con nuestros pensamientos"</span>.{' '}
                Los griegos lo grabaron en el templo de Delfos: <span className="text-white/90">"Conócete a ti mismo"</span>.
              </p>

              <p className="text-2xl lg:text-3xl font-normal text-white/90 leading-relaxed mt-12">
                No estamos descubriendo nada nuevo.
                <br />
                <span className="bg-gradient-to-r from-purple-300 to-fuchsia-300 bg-clip-text text-transparent">
                  Estamos recordando lo que, en Aión, siempre hemos sabido.
                </span>
              </p>
            </motion.div>
          </div>
        </section>

        {/* Divisor elegante */}
        <div className="max-w-6xl mx-auto px-6 lg:px-20">
          <motion.div
            initial={{ scaleX: 0 }}
            animate={isStoryInView ? { scaleX: 1 } : {}}
            transition={{ duration: 1, delay: 1 }}
            className="h-px bg-gradient-to-r from-transparent via-purple-500/50 to-transparent mb-20"
          />
        </div>

        {/* Sección de Problemas - Ciencia + Ancestral */}
        <section ref={scienceRef} className="relative py-20 lg:py-32 px-6 lg:px-20">
          <div className="max-w-6xl mx-auto">
            {/* Introducción a los problemas */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={isScienceInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 1 }}
              className="text-center mb-20"
            >
              <h2 className="text-3xl lg:text-5xl font-light text-white mb-8 leading-tight">
                Por eso, si sufres de algún problema
                <br />
                <span className="bg-gradient-to-r from-purple-300 to-fuchsia-300 bg-clip-text text-transparent">
                  en estas áreas...
                </span>
              </h2>
              <p className="text-xl lg:text-2xl font-light text-white/70 leading-relaxed max-w-3xl mx-auto">
                <span className="text-white">Es posible transformarlo</span>. Y te lo demostraré con ciencia y sabiduría ancestral.
              </p>
            </motion.div>

            {/* Grid de áreas de problema */}
            <div className="space-y-12 lg:space-y-16">
              {problemAreas.map((area, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 40 }}
                  animate={isScienceInView ? { opacity: 1, y: 0 } : {}}
                  transition={{ duration: 0.8, delay: area.delay }}
                  className="group"
                >
                  <div className="relative p-8 lg:p-12 bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-xl border border-white/20 rounded-3xl hover:border-purple-500/40 transition-all duration-500">
                    <motion.div 
                      className="absolute inset-0 bg-gradient-to-br from-purple-500/0 to-fuchsia-500/0 group-hover:from-purple-500/5 group-hover:to-fuchsia-500/5 rounded-3xl transition-all duration-500"
                    />
                    
                    <div className="relative space-y-6">
                      {/* Header con icono y título */}
                      <div className="flex items-center gap-4 mb-6">
                        <div className="p-3 bg-purple-500/20 rounded-xl">
                          <area.icon className="w-7 h-7 text-purple-300" strokeWidth={1.5} />
                        </div>
                        <h3 className="text-2xl lg:text-3xl font-normal text-white">
                          {area.title}
                        </h3>
                      </div>

                      {/* El problema */}
                      <div className="pl-4 border-l-2 border-red-500/30">
                        <p className="text-sm uppercase tracking-wide text-red-400/60 mb-2">El Patrón</p>
                        <p className="text-lg lg:text-xl font-light text-white/80 italic">
                          {area.problem}
                        </p>
                      </div>

                      {/* La ciencia */}
                      <div className="pl-4 border-l-2 border-purple-500/50">
                        <p className="text-sm uppercase tracking-wide text-purple-400/80 mb-2">La Ciencia Contemporánea</p>
                        <p className="text-base lg:text-lg font-light text-white/70">
                          {area.science}
                        </p>
                      </div>

                      {/* Lo ancestral */}
                      <div className="pl-4 border-l-2 border-fuchsia-500/50">
                        <p className="text-sm uppercase tracking-wide text-fuchsia-400/80 mb-2">La Sabiduría Ancestral</p>
                        <p className="text-base lg:text-lg font-light text-white/70 italic">
                          {area.ancestral}
                        </p>
                      </div>

                      {/* La solución */}
                      <div className="pl-4 border-l-2 border-emerald-500/50 mt-8">
                        <p className="text-sm uppercase tracking-wide text-emerald-400/80 mb-2">Por lo tanto...</p>
                        <p className="text-lg lg:text-xl font-normal text-white">
                          ✓ {area.reversible}
                        </p>
                      </div>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* Sección Final - AIÓN */}
        <section className="relative py-20 lg:py-32 px-6 lg:px-20">
          <div className="max-w-5xl mx-auto">
            {/* Introducción a AIÓN */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={isScienceInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 1, delay: 0.8 }}
              className="text-center mb-16"
            >
              <p className="text-2xl lg:text-3xl font-light text-white/80 leading-relaxed mb-12">
                Cada área de tu vida refleja el <span className="text-white">filtro</span> con el que la miras.
                <br />
                <span className="text-white/90">Cuando cambias el filtro...</span>
                <br />
                <span className="text-purple-300 font-normal">todo se transforma</span>.
              </p>

              {/* Divisor */}
              <motion.div
                initial={{ scaleX: 0 }}
                animate={isScienceInView ? { scaleX: 1 } : {}}
                transition={{ duration: 1, delay: 1 }}
                className="h-px bg-gradient-to-r from-transparent via-purple-500/50 to-transparent mb-16"
              />

              {/* AIÓN título */}
              <motion.h2
                initial={{ opacity: 0, scale: 0.9 }}
                animate={isScienceInView ? { opacity: 1, scale: 1 } : {}}
                transition={{ duration: 1, delay: 1.2 }}
              >
                <motion.span
                  animate={{
                    textShadow: [
                      '0 0 20px rgba(168, 85, 247, 0.4)',
                      '0 0 40px rgba(217, 70, 239, 0.6)',
                      '0 0 20px rgba(168, 85, 247, 0.4)'
                    ]
                  }}
                  transition={{
                    duration: 3,
                    repeat: Infinity,
                    ease: "easeInOut"
                  }}
                  className="text-6xl lg:text-8xl font-light tracking-wider text-transparent bg-gradient-to-r from-purple-300 via-fuchsia-300 to-purple-300 bg-clip-text inline-block mb-8"
                >
                  AIÓN
                </motion.span>
              </motion.h2>

              <motion.p
                initial={{ opacity: 0 }}
                animate={isScienceInView ? { opacity: 1 } : {}}
                transition={{ duration: 1, delay: 1.4 }}
                className="text-xl lg:text-2xl font-light text-white/70 leading-relaxed max-w-3xl mx-auto mb-16"
              >
                Es el método que creé integrando <span className="text-purple-300">neurociencia</span>,{' '}
                <span className="text-fuchsia-300">psicoanálisis</span> y{' '}
                <span className="text-violet-300">sabiduría ancestral</span> para identificar qué filtros inconscientes están construyendo tu experiencia actual—y cómo{' '}
                <span className="text-white font-normal">transformarlos</span> para que todo cambie.
              </motion.p>
            </motion.div>

            {/* Box premium de teoría de filtros */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={isScienceInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 1, delay: 1.6 }}
              className="relative p-10 lg:p-14 bg-gradient-to-br from-purple-900/30 to-fuchsia-900/30 backdrop-blur-2xl border-2 border-purple-500/40 rounded-[2rem] overflow-hidden mb-16"
            >
              <div
                className="absolute inset-0 bg-gradient-to-br from-purple-500/20 via-fuchsia-500/20 to-violet-500/20 rounded-[2rem] animate-pulse-scale"
              />
              
              <div
                className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent animate-shimmer"
                style={{ width: '50%' }}
              />
              
              <div className="relative space-y-6">
                <p className="text-2xl lg:text-4xl font-light text-white/90 leading-relaxed">
                  Tu <span className="font-normal text-white">realidad</span> son tus{' '}
                  <span className="font-normal bg-gradient-to-r from-purple-300 to-fuchsia-300 bg-clip-text text-transparent">
                    filtros operando
                  </span>
                </p>
                
                <div className="h-px bg-gradient-to-r from-transparent via-purple-400/50 to-transparent" />
                
                <p className="text-xl lg:text-2xl font-light text-white/70 leading-relaxed">
                  La <span className="text-purple-300">salud</span>, las <span className="text-fuchsia-300">relaciones</span>,
                  las <span className="text-violet-300">emociones</span>, la <span className="text-purple-300">economía</span>...
                  <br className="hidden lg:block" />
                  <span className="text-white/90">Solo corresponden al filtro actual que sostienes</span>
                  <span className="text-white/50"> sin que te des cuenta</span>.
                </p>

                <div className="h-px bg-gradient-to-r from-transparent via-fuchsia-400/50 to-transparent" />

                <p className="text-xl lg:text-2xl font-normal text-white leading-relaxed">
                  Al cambiar los filtros, cambia <span className="italic">todo</span>.
                </p>
              </div>
            </motion.div>

            {/* CTA Final */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={isScienceInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.8, delay: 1.8 }}
              className="text-center"
            >
              <a
                href={`https://wa.me/420776711575?text=${encodeURIComponent('Hola Luis, quiero conocer Aión')}`}
                target="_blank"
                rel="noopener noreferrer"
                className="group relative inline-flex items-center gap-3 px-10 py-5 bg-gradient-to-r from-purple-600 via-fuchsia-600 to-purple-600 text-white rounded-full font-light text-lg overflow-hidden transition-all duration-500 hover:shadow-2xl hover:shadow-purple-500/50"
                style={{ backgroundSize: '200% 100%' }}
              >
                <div
                  className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent animate-shimmer-fast"
                  style={{ width: '50%' }}
                />
                
                <span className="relative z-10">Hablemos de Tu Situación</span>
                <motion.svg 
                  className="relative z-10 w-5 h-5"
                  fill="none" 
                  viewBox="0 0 24 24" 
                  stroke="currentColor" 
                  strokeWidth={2}
                  animate={{ x: [0, 5, 0] }}
                  transition={{ duration: 1.5, repeat: Infinity }}
                >
                  <path strokeLinecap="round" strokeLinejoin="round" d="M13 7l5 5m0 0l-5 5m5-5H6" />
                </motion.svg>
              </a>
            </motion.div>
          </div>
        </section>
      </div>
    </>
  )
}

export default MetodoPage
