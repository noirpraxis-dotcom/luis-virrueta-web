import { motion, useInView } from 'framer-motion'
import { useRef } from 'react'
import { useParams, Link } from 'react-router-dom'
import { Calendar, Clock, ArrowLeft, User, Tag, Share2, BookmarkPlus, Eye, Brain, Zap, Sparkles } from 'lucide-react'

// Función para obtener el artículo basado en el slug
const getArticleBySlug = (slug) => {
  const articles = {
    'neurociencia-del-diseno': {
      title: 'Neurociencia del Diseño: Por Qué Algunos Logos Son Inolvidables',
      author: 'Luis Virrueta',
      date: '6 Dic 2025',
      readTime: '12 min',
      category: 'Psicología',
      tags: ['Neuroscience', 'Logo Design', 'Brand Recognition', 'Psychology'],
      gradient: 'from-pink-500 to-rose-500',
      sections: [
        {
          type: 'intro',
          content: 'En el mundo del branding, algunos logos trascienden su función básica de identificación para convertirse en símbolos culturales inolvidables. ¿Qué hace que reconozcamos instantáneamente el swoosh de Nike, la manzana de Apple o los arcos dorados de McDonald\'s? La respuesta está en la neurociencia del diseño.'
        },
        {
          type: 'heading',
          title: 'El Cerebro y el Reconocimiento Visual',
          icon: Brain
        },
        {
          type: 'text',
          content: 'Nuestro cerebro procesa imágenes 60,000 veces más rápido que el texto. El córtex visual, que representa aproximadamente el 30% de nuestra corteza cerebral, está optimizado para detectar patrones, formas y colores de manera instantánea. Los logos exitosos aprovechan esta capacidad innata.'
        },
        {
          type: 'highlight',
          content: '"Un logo efectivo debe ser procesado por el cerebro en menos de 400 milisegundos para crear un impacto memorable."',
          author: 'Estudios de Neuroimagen Visual'
        },
        {
          type: 'heading',
          title: 'Los Tres Pilares Neurológicos del Logo Perfecto',
          icon: Sparkles
        },
        {
          type: 'subsection',
          number: '01',
          title: 'Simplicidad Cognitiva',
          content: 'El cerebro humano prefiere formas simples porque requieren menos energía para procesar. Los logos más memorables utilizan entre 1-3 elementos visuales clave. Esta economía cognitiva permite que el cerebro almacene y recupere la información visual de manera más eficiente.',
          gradient: 'from-purple-500 to-fuchsia-500'
        },
        {
          type: 'subsection',
          number: '02',
          title: 'Activación Emocional',
          content: 'La amígdala, nuestro centro emocional, se activa cuando vemos logos que asociamos con experiencias positivas. Los colores, formas curvas vs angulares, y la simetría desencadenan respuestas emocionales específicas que quedan grabadas en nuestra memoria a largo plazo.',
          gradient: 'from-cyan-500 to-blue-500'
        },
        {
          type: 'subsection',
          number: '03',
          title: 'Conexión Semántica',
          content: 'Los logos más poderosos crean puentes entre la imagen visual y el concepto de marca en el hipocampo. Esta región cerebral, responsable de la memoria asociativa, vincula el símbolo con significados, valores y experiencias, creando una red neural robusta.',
          gradient: 'from-emerald-500 to-teal-500'
        },
        {
          type: 'heading',
          title: 'El Rol del Color en la Memoria Visual',
          icon: Zap
        },
        {
          type: 'text',
          content: 'Los colores activan diferentes áreas del cerebro y generan respuestas fisiológicas medibles. El rojo aumenta la frecuencia cardíaca y crea urgencia, el azul reduce el estrés y transmite confianza, mientras que el amarillo estimula la dopamina y genera optimismo.'
        },
        {
          type: 'colorGrid',
          colors: [
            { name: 'Rojo', hex: '#EF4444', emotion: 'Pasión, Urgencia, Energía', brands: 'Coca-Cola, Netflix, YouTube' },
            { name: 'Azul', hex: '#3B82F6', emotion: 'Confianza, Calma, Profesionalismo', brands: 'Facebook, IBM, Samsung' },
            { name: 'Amarillo', hex: '#FBBF24', emotion: 'Optimismo, Creatividad, Atención', brands: 'McDonald\'s, IKEA, Snapchat' },
            { name: 'Verde', hex: '#10B981', emotion: 'Crecimiento, Salud, Naturaleza', brands: 'Starbucks, Spotify, WhatsApp' },
          ]
        },
        {
          type: 'heading',
          title: 'Aplicando la Neurociencia a Tu Marca',
          icon: Eye
        },
        {
          type: 'list',
          items: [
            {
              title: 'Prueba de los 3 Segundos',
              description: 'Tu logo debe ser reconocible en 3 segundos o menos. Si requiere más tiempo, simplifica.'
            },
            {
              title: 'Coherencia Visual',
              description: 'Usa el logo consistentemente en todos los puntos de contacto para fortalecer las conexiones neuronales.'
            },
            {
              title: 'Testeo Emocional',
              description: 'Realiza pruebas A/B midiendo respuestas emocionales (microexpresiones, dilatación pupilar) a diferentes versiones.'
            },
            {
              title: 'Memoria a Largo Plazo',
              description: 'Repite la exposición del logo en contextos positivos para crear asociaciones duraderas en el hipocampo.'
            },
          ]
        },
        {
          type: 'conclusion',
          content: 'La neurociencia del diseño nos revela que crear un logo memorable no es arte o magia, sino ciencia aplicada. Al comprender cómo el cerebro procesa, almacena y recupera información visual, podemos diseñar símbolos que no solo se ven bien, sino que se graban profundamente en la mente de nuestra audiencia.'
        },
      ]
    },
    'ia-generativa-diseno-emocion': {
      title: 'La IA Generativa en el Diseño: Del Prompt a la Emoción',
      author: 'Luis Virrueta',
      date: '5 Dic 2025',
      readTime: '14 min',
      category: 'Tecnología × Diseño',
      tags: ['AI', 'Generative Design', 'Emotional Design', 'Psychology'],
      gradient: 'from-purple-500 to-fuchsia-500',
      sections: [
        {
          type: 'intro',
          content: 'La inteligencia artificial generativa está revolucionando el diseño gráfico, pero la verdadera magia ocurre cuando entendemos la psicología detrás de cada pixel generado. No se trata solo de crear imágenes hermosas, sino de diseñar experiencias que resuenen emocionalmente con tu audiencia.'
        },
        {
          type: 'heading',
          title: 'La Convergencia de Tres Mundos',
          icon: Sparkles
        },
        {
          type: 'text',
          content: 'Estamos presenciando un momento histórico donde la tecnología de IA, los principios del diseño y la comprensión psicológica del usuario se fusionan para crear algo completamente nuevo: diseño generativo con inteligencia emocional.'
        },
        {
          type: 'subsection',
          number: '01',
          title: 'Psicología del Prompt Engineering',
          content: 'Escribir prompts efectivos requiere entender cómo la IA interpreta el lenguaje emocional. Palabras como "acogedor", "dinámico" o "sofisticado" activan diferentes redes neuronales en los modelos, generando resultados que evocan emociones específicas en quien los observa.',
          gradient: 'from-purple-500 to-fuchsia-500'
        },
        {
          type: 'subsection',
          number: '02',
          title: 'Diseño Adaptativo Emocional',
          content: 'Las IAs generativas pueden analizar respuestas emocionales en tiempo real y adaptar el diseño. Esto crea un loop de retroalimentación donde el diseño evoluciona basándose en métricas psicológicas como engagement, tiempo de atención y respuesta emocional.',
          gradient: 'from-cyan-500 to-blue-500'
        },
        {
          type: 'subsection',
          number: '03',
          title: 'La Ética del Diseño Automatizado',
          content: 'Con gran poder viene gran responsabilidad. Debemos considerar las implicaciones éticas de diseños que pueden manipular emociones. La transparencia sobre el uso de IA y el respeto por la autonomía emocional del usuario son fundamentales.',
          gradient: 'from-emerald-500 to-teal-500'
        },
        {
          type: 'heading',
          title: 'Workflow Psych × Design × AI',
          icon: Brain
        },
        {
          type: 'list',
          items: [
            {
              title: 'Definir la Emoción Objetivo',
              description: 'Antes de escribir un prompt, identifica qué emoción específica quieres evocar: confianza, excitación, nostalgia, aspiración.'
            },
            {
              title: 'Prompt Psicológicamente Informado',
              description: 'Usa lenguaje que combine elementos visuales con estados emocionales: "logo minimalista que transmite seguridad y profesionalismo".'
            },
            {
              title: 'Iteración con Testing A/B Emocional',
              description: 'Usa herramientas de eye-tracking y análisis de microexpresiones para validar si el diseño genera la emoción deseada.'
            },
            {
              title: 'Refinamiento Human-in-the-Loop',
              description: 'La IA propone, el diseñador humano refina con sensibilidad cultural y emocional que las máquinas aún no poseen.'
            },
          ]
        },
        {
          type: 'conclusion',
          content: 'La IA generativa no reemplaza al diseñador, lo potencia. Al combinar tecnología de punta, principios de diseño atemporales y comprensión psicológica profunda, creamos experiencias visuales que no solo se ven increíbles, sino que conectan genuinamente con las personas.'
        },
      ]
    },
    'interfaces-empaticas-machine-learning': {
      title: 'Interfaces que Leen tu Mente: UX Empático con Machine Learning',
      author: 'Luis Virrueta',
      date: '4 Dic 2025',
      readTime: '13 min',
      category: 'UX × Tecnología',
      tags: ['Machine Learning', 'UX Design', 'User Psychology', 'Technology'],
      gradient: 'from-cyan-500 to-blue-500',
      sections: [
        {
          type: 'intro',
          content: 'Imagina una interfaz que se adapta a tu estado emocional, anticipa tus necesidades y ajusta su complejidad según tu nivel de estrés. Bienvenido al futuro del UX empático, donde Machine Learning y psicología del usuario crean experiencias verdaderamente personalizadas.'
        },
        {
          type: 'heading',
          title: 'La Nueva Era del Diseño Adaptativo',
          icon: Brain
        },
        {
          type: 'text',
          content: 'El diseño de interfaces tradicional asume que todos los usuarios son iguales. Pero la realidad es que cada persona interactúa con la tecnología de manera única, influenciada por su estado emocional, contexto y experiencia previa. El ML nos permite diseñar para esta complejidad.'
        },
        {
          type: 'highlight',
          content: '"Las interfaces empáticas no solo responden a clics, responden a emociones, patrones de comportamiento y contexto en tiempo real."',
          author: 'MIT Media Lab'
        },
        {
          type: 'heading',
          title: 'Los Cuatro Pilares del UX Empático',
          icon: Sparkles
        },
        {
          type: 'subsection',
          number: '01',
          title: 'Detección de Estado Emocional',
          content: 'Algoritmos de ML analizan velocidad de interacción, presión en la pantalla, tiempo de duda antes de hacer clic. Estos datos revelan frustración, confianza o confusión, permitiendo que la interfaz se adapte en tiempo real.',
          gradient: 'from-purple-500 to-fuchsia-500'
        },
        {
          type: 'subsection',
          number: '02',
          title: 'Predicción de Necesidades',
          content: 'Modelos predictivos aprenden patrones individuales de uso. Si el usuario siempre revisa su cuenta después de hacer una compra, la interfaz puede ofrecer esa información proactivamente, reduciendo carga cognitiva.',
          gradient: 'from-cyan-500 to-blue-500'
        },
        {
          type: 'subsection',
          number: '03',
          title: 'Adaptación de Complejidad',
          content: 'El ML puede detectar cuando un usuario está abrumado y simplificar la interfaz automáticamente, u ofrecer más opciones avanzadas a usuarios experimentados. La complejidad se ajusta al nivel de confort del usuario.',
          gradient: 'from-emerald-500 to-teal-500'
        },
        {
          type: 'subsection',
          number: '04',
          title: 'Feedback Contextual Inteligente',
          content: 'Los mensajes de error, confirmaciones y notificaciones se adaptan al tono y nivel de detalle que cada usuario prefiere, basándose en interacciones previas y estado emocional actual.',
          gradient: 'from-amber-500 to-orange-500'
        },
        {
          type: 'heading',
          title: 'Implementación Ética',
          icon: Eye
        },
        {
          type: 'text',
          content: 'Con gran poder predictivo viene la responsabilidad de respetar la privacidad y autonomía del usuario. La transparencia sobre qué datos se recopilan y cómo se usan es fundamental. El usuario siempre debe tener control sobre el nivel de personalización.'
        },
        {
          type: 'list',
          items: [
            {
              title: 'Consent Informed',
              description: 'Explica claramente qué datos emocionales y de comportamiento recopilas y por qué. El usuario debe poder opt-out en cualquier momento.'
            },
            {
              title: 'Transparencia Algorítmica',
              description: 'Ofrece insights sobre por qué la interfaz tomó ciertas decisiones adaptativas. "Simplificamos la vista porque detectamos que estabas explorando rápidamente".'
            },
            {
              title: 'Control de Usuario',
              description: 'Proporciona controles granulares para ajustar el nivel de adaptación. Algunos usuarios prefieren consistencia sobre personalización.'
            },
            {
              title: 'Testing Psicológico',
              description: 'Valida que las adaptaciones realmente mejoren la experiencia y no causen ansiedad o sensación de pérdida de control.'
            },
          ]
        },
        {
          type: 'conclusion',
          content: 'Las interfaces empáticas representan el futuro del diseño UX. Al fusionar Machine Learning con comprensión psicológica profunda, creamos experiencias digitales que no solo son funcionales, sino genuinamente humanas. La tecnología se vuelve invisible, y lo que queda es una conexión natural entre persona y herramienta.'
        },
      ]
    }
  }

  return articles[slug] || articles['neurociencia-del-diseno']
}

const BlogArticlePage = () => {
  const { slug } = useParams()
  const heroRef = useRef(null)
  const isHeroInView = useInView(heroRef, { once: true, amount: 0.3 })

  const article = getArticleBySlug(slug)

  if (!article) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-black via-zinc-950 to-black pt-28 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-4xl font-bold text-white mb-4">Artículo no encontrado</h1>
          <Link to="/blog" className="text-cyan-400 hover:text-cyan-300">
            Volver al Blog
          </Link>
        </div>
      </div>
    )
  }

  const article_old = {
    title: 'Neurociencia del Diseño: Por Qué Algunos Logos Son Inolvidables',
    author: 'Luis Virrueta',
    date: '6 Dic 2025',
    readTime: '12 min',
    category: 'Psicología',
    tags: ['Neuroscience', 'Logo Design', 'Brand Recognition', 'Psychology'],
    gradient: 'from-pink-500 to-rose-500',
    
    sections: [
      {
        type: 'intro',
        content: 'En el mundo del branding, algunos logos trascienden su función básica de identificación para convertirse en símbolos culturales inolvidables. ¿Qué hace que reconozcamos instantáneamente el swoosh de Nike, la manzana de Apple o los arcos dorados de McDonald\'s? La respuesta está en la neurociencia del diseño.'
      },
      {
        type: 'heading',
        title: 'El Cerebro y el Reconocimiento Visual',
        icon: Brain
      },
      {
        type: 'text',
        content: 'Nuestro cerebro procesa imágenes 60,000 veces más rápido que el texto. El córtex visual, que representa aproximadamente el 30% de nuestra corteza cerebral, está optimizado para detectar patrones, formas y colores de manera instantánea. Los logos exitosos aprovechan esta capacidad innata.'
      },
      {
        type: 'highlight',
        content: '"Un logo efectivo debe ser procesado por el cerebro en menos de 400 milisegundos para crear un impacto memorable."',
        author: 'Estudios de Neuroimagen Visual'
      },
      {
        type: 'heading',
        title: 'Los Tres Pilares Neurológicos del Logo Perfecto',
        icon: Sparkles
      },
      {
        type: 'subsection',
        number: '01',
        title: 'Simplicidad Cognitiva',
        content: 'El cerebro humano prefiere formas simples porque requieren menos energía para procesar. Los logos más memorables utilizan entre 1-3 elementos visuales clave. Esta economía cognitiva permite que el cerebro almacene y recupere la información visual de manera más eficiente.',
        gradient: 'from-purple-500 to-fuchsia-500'
      },
      {
        type: 'subsection',
        number: '02',
        title: 'Activación Emocional',
        content: 'La amígdala, nuestro centro emocional, se activa cuando vemos logos que asociamos con experiencias positivas. Los colores, formas curvas vs angulares, y la simetría desencadenan respuestas emocionales específicas que quedan grabadas en nuestra memoria a largo plazo.',
        gradient: 'from-cyan-500 to-blue-500'
      },
      {
        type: 'subsection',
        number: '03',
        title: 'Conexión Semántica',
        content: 'Los logos más poderosos crean puentes entre la imagen visual y el concepto de marca en el hipocampo. Esta región cerebral, responsable de la memoria asociativa, vincula el símbolo con significados, valores y experiencias, creando una red neural robusta.',
        gradient: 'from-emerald-500 to-teal-500'
      },
      {
        type: 'heading',
        title: 'El Rol del Color en la Memoria Visual',
        icon: Zap
      },
      {
        type: 'text',
        content: 'Los colores activan diferentes áreas del cerebro y generan respuestas fisiológicas medibles. El rojo aumenta la frecuencia cardíaca y crea urgencia, el azul reduce el estrés y transmite confianza, mientras que el amarillo estimula la dopamina y genera optimismo.'
      },
      {
        type: 'colorGrid',
        colors: [
          { name: 'Rojo', hex: '#EF4444', emotion: 'Pasión, Urgencia, Energía', brands: 'Coca-Cola, Netflix, YouTube' },
          { name: 'Azul', hex: '#3B82F6', emotion: 'Confianza, Calma, Profesionalismo', brands: 'Facebook, IBM, Samsung' },
          { name: 'Amarillo', hex: '#FBBF24', emotion: 'Optimismo, Creatividad, Atención', brands: 'McDonald\'s, IKEA, Snapchat' },
          { name: 'Verde', hex: '#10B981', emotion: 'Crecimiento, Salud, Naturaleza', brands: 'Starbucks, Spotify, WhatsApp' },
        ]
      },
      {
        type: 'heading',
        title: 'Aplicando la Neurociencia a Tu Marca',
        icon: Eye
      },
      {
        type: 'list',
        items: [
          {
            title: 'Prueba de los 3 Segundos',
            description: 'Tu logo debe ser reconocible en 3 segundos o menos. Si requiere más tiempo, simplifica.'
          },
          {
            title: 'Coherencia Visual',
            description: 'Usa el logo consistentemente en todos los puntos de contacto para fortalecer las conexiones neuronales.'
          },
          {
            title: 'Testeo Emocional',
            description: 'Realiza pruebas A/B midiendo respuestas emocionales (microexpresiones, dilatación pupilar) a diferentes versiones.'
          },
          {
            title: 'Memoria a Largo Plazo',
            description: 'Repite la exposición del logo en contextos positivos para crear asociaciones duraderas en el hipocampo.'
          },
        ]
      },
      {
        type: 'conclusion',
        content: 'La neurociencia del diseño nos revela que crear un logo memorable no es arte o magia, sino ciencia aplicada. Al comprender cómo el cerebro procesa, almacena y recupera información visual, podemos diseñar símbolos que no solo se ven bien, sino que se graban profundamente en la mente de nuestra audiencia.'
      },
    ]
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-black via-zinc-950 to-black pt-28">
      {/* Hero Section */}
      <section ref={heroRef} className="relative py-20 lg:py-32 px-6 lg:px-20 overflow-hidden">
        {/* Background effects */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className={`absolute top-1/4 left-1/4 w-96 h-96 bg-gradient-to-br ${article.gradient}/10 rounded-full blur-3xl`} />
          <div className={`absolute bottom-1/4 right-1/4 w-96 h-96 bg-gradient-to-br ${article.gradient}/10 rounded-full blur-3xl`} />
        </div>

        <div className="relative z-10 max-w-4xl mx-auto">
          {/* Back button */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
          >
            <Link
              to="/blog"
              className="inline-flex items-center gap-2 text-white/60 hover:text-white transition-colors mb-8 group"
            >
              <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
              <span className="text-sm">Volver al Blog</span>
            </Link>
          </motion.div>

          {/* Category badge */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={isHeroInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="inline-block px-4 py-2 border border-white/20 rounded-full backdrop-blur-sm bg-white/5 mb-6"
          >
            <span className="text-xs lg:text-sm text-white/80 font-light tracking-wider uppercase">
              {article.category}
            </span>
          </motion.div>

          {/* Title */}
          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={isHeroInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 1, delay: 0.3 }}
            className="text-4xl lg:text-6xl font-bold text-white mb-8 leading-tight"
            style={{ letterSpacing: '0.02em', fontWeight: 300 }}
          >
            {article.title}
          </motion.h1>

          {/* Meta info */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={isHeroInView ? { opacity: 1 } : {}}
            transition={{ duration: 1, delay: 0.5 }}
            className="flex flex-wrap items-center gap-6 text-white/60 mb-8"
          >
            <div className="flex items-center gap-2">
              <User className="w-4 h-4" />
              <span className="text-sm">{article.author}</span>
            </div>
            <div className="flex items-center gap-2">
              <Calendar className="w-4 h-4" />
              <span className="text-sm">{article.date}</span>
            </div>
            <div className="flex items-center gap-2">
              <Clock className="w-4 h-4" />
              <span className="text-sm">{article.readTime}</span>
            </div>
          </motion.div>

          {/* Tags */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={isHeroInView ? { opacity: 1 } : {}}
            transition={{ duration: 1, delay: 0.6 }}
            className="flex flex-wrap gap-2 mb-8"
          >
            {article.tags.map((tag, i) => (
              <span
                key={i}
                className="px-3 py-1.5 text-xs bg-white/5 border border-white/10 rounded-full text-white/70 flex items-center gap-1.5"
              >
                <Tag className="w-3 h-3" />
                {tag}
              </span>
            ))}
          </motion.div>

          {/* Action buttons */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={isHeroInView ? { opacity: 1 } : {}}
            transition={{ duration: 1, delay: 0.7 }}
            className="flex gap-3"
          >
            <button className="px-4 py-2 bg-white/10 hover:bg-white/20 border border-white/20 rounded-full text-white text-sm flex items-center gap-2 transition-all">
              <Share2 className="w-4 h-4" />
              Compartir
            </button>
            <button className="px-4 py-2 bg-white/10 hover:bg-white/20 border border-white/20 rounded-full text-white text-sm flex items-center gap-2 transition-all">
              <BookmarkPlus className="w-4 h-4" />
              Guardar
            </button>
          </motion.div>
        </div>

        {/* Decorative line */}
        <motion.div
          initial={{ scaleX: 0 }}
          animate={isHeroInView ? { scaleX: 1 } : {}}
          transition={{ duration: 1.2, delay: 0.8 }}
          className="absolute bottom-0 left-1/2 -translate-x-1/2 h-px bg-gradient-to-r from-transparent via-white/30 to-transparent"
          style={{ width: '80%' }}
        />
      </section>

      {/* Article Content */}
      <section className="relative py-12 px-6 lg:px-20">
        <div className="max-w-3xl mx-auto">
          {article.sections.map((section, index) => (
            <ArticleSection key={index} section={section} index={index} />
          ))}
        </div>
      </section>

      {/* CTA Section */}
      <section className="relative py-20 px-6 lg:px-20">
        <div className="max-w-4xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="relative bg-gradient-to-br from-pink-500/10 to-rose-500/10 backdrop-blur-sm border border-white/10 rounded-3xl p-12 text-center overflow-hidden"
          >
            {/* Background gradient orb */}
            <div className="absolute top-0 right-0 w-64 h-64 bg-gradient-to-br from-pink-500/20 to-rose-500/20 rounded-full blur-3xl" />
            
            <div className="relative z-10">
              <h3 className="text-3xl lg:text-4xl font-bold text-white mb-4">
                ¿Listo para crear un logo inolvidable?
              </h3>
              <p className="text-lg text-white/70 mb-8 max-w-2xl mx-auto">
                Apliquemos los principios de neurociencia del diseño a tu marca
              </p>
              <Link
                to="/contacto"
                className="inline-block px-8 py-4 bg-gradient-to-r from-pink-500 to-rose-500 text-white font-medium rounded-full hover:shadow-lg hover:shadow-pink-500/50 transition-all duration-300"
              >
                Iniciar Proyecto
              </Link>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  )
}

const ArticleSection = ({ section, index }) => {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, amount: 0.3 })

  if (section.type === 'intro') {
    return (
      <motion.div
        ref={ref}
        initial={{ opacity: 0, y: 30 }}
        animate={isInView ? { opacity: 1, y: 0 } : {}}
        transition={{ duration: 0.8, delay: index * 0.1 }}
        className="mb-12"
      >
        <p className="text-xl lg:text-2xl text-white/80 leading-relaxed font-light italic">
          {section.content}
        </p>
      </motion.div>
    )
  }

  if (section.type === 'heading') {
    const Icon = section.icon
    return (
      <motion.div
        ref={ref}
        initial={{ opacity: 0, y: 30 }}
        animate={isInView ? { opacity: 1, y: 0 } : {}}
        transition={{ duration: 0.8, delay: index * 0.1 }}
        className="mb-8 mt-16"
      >
        <div className="flex items-center gap-3 mb-4">
          <div className="w-10 h-10 rounded-full bg-gradient-to-br from-pink-500/20 to-rose-500/20 border border-white/10 flex items-center justify-center">
            <Icon className="w-5 h-5 text-white" />
          </div>
          <h2 className="text-3xl lg:text-4xl font-bold text-white" style={{ fontWeight: 300 }}>
            {section.title}
          </h2>
        </div>
        <div className="h-px bg-gradient-to-r from-pink-500/50 to-transparent w-full" />
      </motion.div>
    )
  }

  if (section.type === 'text') {
    return (
      <motion.div
        ref={ref}
        initial={{ opacity: 0, y: 30 }}
        animate={isInView ? { opacity: 1, y: 0 } : {}}
        transition={{ duration: 0.8, delay: index * 0.1 }}
        className="mb-8"
      >
        <p className="text-lg text-white/70 leading-relaxed">
          {section.content}
        </p>
      </motion.div>
    )
  }

  if (section.type === 'highlight') {
    return (
      <motion.div
        ref={ref}
        initial={{ opacity: 0, scale: 0.95 }}
        animate={isInView ? { opacity: 1, scale: 1 } : {}}
        transition={{ duration: 0.8, delay: index * 0.1 }}
        className="my-12 relative"
      >
        <div className="relative bg-gradient-to-br from-pink-500/10 to-rose-500/10 backdrop-blur-sm border-l-4 border-pink-500 rounded-r-2xl p-8">
          <blockquote className="text-2xl text-white font-light italic leading-relaxed mb-4">
            {section.content}
          </blockquote>
          <cite className="text-sm text-white/60 not-italic">— {section.author}</cite>
        </div>
      </motion.div>
    )
  }

  if (section.type === 'subsection') {
    return (
      <motion.div
        ref={ref}
        initial={{ opacity: 0, x: -30 }}
        animate={isInView ? { opacity: 1, x: 0 } : {}}
        transition={{ duration: 0.8, delay: index * 0.1 }}
        className="mb-8"
      >
        <div className="relative bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-8 overflow-hidden group hover:border-white/30 transition-all">
          {/* Gradient orb */}
          <div className={`absolute top-0 right-0 w-32 h-32 bg-gradient-to-br ${section.gradient} opacity-20 rounded-full blur-2xl group-hover:opacity-30 transition-opacity`} />
          
          <div className="relative z-10">
            <div className="flex items-start gap-4 mb-4">
              <span className={`text-6xl font-bold bg-gradient-to-br ${section.gradient} bg-clip-text text-transparent opacity-50`}>
                {section.number}
              </span>
              <div className="flex-1 pt-2">
                <h3 className="text-2xl font-bold text-white mb-3">
                  {section.title}
                </h3>
                <p className="text-base text-white/70 leading-relaxed">
                  {section.content}
                </p>
              </div>
            </div>
          </div>
        </div>
      </motion.div>
    )
  }

  if (section.type === 'colorGrid') {
    return (
      <motion.div
        ref={ref}
        initial={{ opacity: 0, y: 30 }}
        animate={isInView ? { opacity: 1, y: 0 } : {}}
        transition={{ duration: 0.8, delay: index * 0.1 }}
        className="my-12"
      >
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {section.colors.map((color, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={isInView ? { opacity: 1, scale: 1 } : {}}
              transition={{ duration: 0.6, delay: index * 0.1 + i * 0.1 }}
              className="relative bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-6 overflow-hidden group hover:border-white/30 transition-all"
            >
              <div className="flex items-center gap-4 mb-4">
                <div
                  className="w-16 h-16 rounded-xl shadow-lg"
                  style={{ backgroundColor: color.hex }}
                />
                <div>
                  <h4 className="text-xl font-bold text-white">{color.name}</h4>
                  <p className="text-sm text-white/50">{color.hex}</p>
                </div>
              </div>
              <p className="text-sm text-white/70 mb-2">
                <span className="font-medium">Emoción:</span> {color.emotion}
              </p>
              <p className="text-xs text-white/50">
                <span className="font-medium">Marcas:</span> {color.brands}
              </p>
            </motion.div>
          ))}
        </div>
      </motion.div>
    )
  }

  if (section.type === 'list') {
    return (
      <motion.div
        ref={ref}
        initial={{ opacity: 0, y: 30 }}
        animate={isInView ? { opacity: 1, y: 0 } : {}}
        transition={{ duration: 0.8, delay: index * 0.1 }}
        className="my-12 space-y-6"
      >
        {section.items.map((item, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, x: -20 }}
            animate={isInView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.6, delay: index * 0.1 + i * 0.1 }}
            className="flex gap-4"
          >
            <div className="flex-shrink-0 w-8 h-8 rounded-full bg-gradient-to-br from-pink-500/20 to-rose-500/20 border border-white/20 flex items-center justify-center">
              <span className="text-sm font-bold text-white">{i + 1}</span>
            </div>
            <div className="flex-1">
              <h4 className="text-lg font-bold text-white mb-2">{item.title}</h4>
              <p className="text-base text-white/70 leading-relaxed">{item.description}</p>
            </div>
          </motion.div>
        ))}
      </motion.div>
    )
  }

  if (section.type === 'conclusion') {
    return (
      <motion.div
        ref={ref}
        initial={{ opacity: 0, y: 30 }}
        animate={isInView ? { opacity: 1, y: 0 } : {}}
        transition={{ duration: 0.8, delay: index * 0.1 }}
        className="mt-16 mb-12"
      >
        <div className="relative bg-gradient-to-br from-pink-500/5 to-rose-500/5 backdrop-blur-sm border border-white/10 rounded-2xl p-10">
          <div className="absolute top-4 left-4 w-12 h-12 bg-gradient-to-br from-pink-500/20 to-rose-500/20 rounded-full blur-xl" />
          <p className="relative text-xl text-white/80 leading-relaxed font-light">
            {section.content}
          </p>
        </div>
      </motion.div>
    )
  }

  return null
}

export default BlogArticlePage
