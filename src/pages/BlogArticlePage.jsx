import { motion, useInView } from 'framer-motion'
import { useRef } from 'react'
import { useParams, Link } from 'react-router-dom'
import { Calendar, Clock, ArrowLeft, User, Tag, Share2, BookmarkPlus, Eye, Brain, Zap, Sparkles } from 'lucide-react'
import ReadingProgressBar from '../components/ReadingProgressBar'
import ShareButtons from '../components/ShareButtons'
import CommentsSection from '../components/CommentsSection'
import RelatedArticles from '../components/RelatedArticles'
import NewsletterSignup from '../components/NewsletterSignup'
import TableOfContents from '../components/TableOfContents'
import ArticleSchema from '../components/ArticleSchema'
import { calculateReadTime, toISODate } from '../utils/blogHelpers'

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
    },
    'psicologia-color-branding-lujo': {
      title: 'La Psicología del Color en el Branding de Lujo',
      author: 'Luis Virrueta',
      date: '3 Dic 2025',
      readTime: '10 min',
      category: 'Psicología × Branding',
      tags: ['Color Theory', 'Luxury Branding', 'Psychology', 'Visual Identity'],
      gradient: 'from-emerald-500 to-teal-500',
      sections: [
        {
          type: 'intro',
          content: 'El color no es solo una elección estética, es un lenguaje emocional codificado en nuestra psique. Las marcas de lujo han dominado este arte durante décadas, utilizando paletas cromáticas específicas para comunicar exclusividad, sofisticación y aspiración. Descubre los secretos psicológicos detrás de cada tonalidad.'
        },
        {
          type: 'heading',
          title: 'El Código Cromático del Lujo',
          icon: Sparkles
        },
        {
          type: 'text',
          content: 'Las marcas premium no eligen colores al azar. Cada tonalidad ha sido meticulosamente seleccionada basándose en estudios psicológicos que revelan cómo los colores activan respuestas emocionales y cognitivas específicas. El negro de Chanel, el rojo de Cartier, el azul de Tiffany: todos cuentan una historia psicológica profunda.'
        },
        {
          type: 'subsection',
          number: '01',
          title: 'Negro: El Color de la Autoridad Absoluta',
          content: 'El negro es el color más utilizado en branding de lujo por razones psicológicas poderosas. Representa sofisticación, misterio y poder. Neurológicamente, el negro reduce el ruido visual y centra la atención en las formas, creando una percepción de precisión y control. Chanel, Prada, Louis Vuitton lo utilizan para comunicar autoridad indiscutible.',
          gradient: 'from-slate-700 to-zinc-900'
        },
        {
          type: 'subsection',
          number: '02',
          title: 'Dorado: La Psicología de la Exclusividad',
          content: 'El dorado activa las mismas áreas cerebrales asociadas con la recompensa y el placer. Históricamente vinculado a la realeza y lo divino, genera una respuesta inconsciente de aspiración y deseo. Rolex, Versace y Dior lo emplean estratégicamente para elevar la percepción de valor y exclusividad.',
          gradient: 'from-amber-500 to-yellow-600'
        },
        {
          type: 'subsection',
          number: '03',
          title: 'Blanco Puro: Minimalismo Maximalista',
          content: 'El blanco en branding de lujo comunica pureza, simplicidad y perfección. Psicológicamente crea espacio mental, reduce ansiedad cognitiva y permite que el producto hable por sí mismo. Apple ha maestreado este concepto: el blanco no es vacío, es claridad absoluta y confianza en la excelencia del diseño.',
          gradient: 'from-slate-50 to-zinc-100'
        },
        {
          type: 'heading',
          title: 'Colores Signature: Identidad Cromática Única',
          icon: Eye
        },
        {
          type: 'text',
          content: 'Las marcas de lujo más icónicas han logrado "apropiarse" de colores específicos. Tiffany Blue, Hermès Orange, Valentino Red: estos tonos se han convertido en activos intangibles valorados en millones. La psicología detrás de esto es el "anclaje cromático" - crear una asociación mental tan fuerte que el color por sí solo evoque la marca completa.'
        },
        {
          type: 'colorGrid',
          colors: [
            { name: 'Tiffany Blue', hex: '#0ABAB5', emotion: 'Exclusividad, Elegancia, Romance', brands: 'Tiffany & Co. - Identidad protegida legalmente' },
            { name: 'Hermès Orange', hex: '#FF7F32', emotion: 'Energía, Sofisticación, Alegría', brands: 'Hermès - Símbolo de artesanía premium' },
            { name: 'Valentino Red', hex: '#D4213D', emotion: 'Pasión, Poder, Audacia', brands: 'Valentino - El rojo del amor y la moda' },
            { name: 'Bottega Green', hex: '#2F5233', emotion: 'Naturaleza, Lujo Discreto, Calma', brands: 'Bottega Veneta - Elegancia sin logos' },
          ]
        },
        {
          type: 'heading',
          title: 'Contrastes Psicológicos: Negro sobre Blanco, Dorado sobre Negro',
          icon: Zap
        },
        {
          type: 'text',
          content: 'Los contrastes cromáticos generan tensión visual que el cerebro interpreta como "importante" y "premium". El contraste alto (negro sobre blanco, dorado sobre negro) activa el sistema atencional ventral, capturando inmediatamente la mirada y comunicando jerarquía. Las marcas de lujo explotan esta neurociencia visual para dominar la percepción del espectador.'
        },
        {
          type: 'heading',
          title: 'Aplicando la Psicología del Color a Tu Marca',
          icon: Brain
        },
        {
          type: 'list',
          items: [
            {
              title: 'Define la Emoción Central de Tu Marca',
              description: 'Antes de elegir colores, identifica la emoción primaria que quieres evocar: confianza, excitación, exclusividad, innovación. Cada color debe reforzar esta emoción consistentemente.'
            },
            {
              title: 'Contraste = Jerarquía Visual',
              description: 'Usa contrastes altos para elementos premium y bajos para elementos secundarios. El cerebro interpreta contraste como importancia.'
            },
            {
              title: 'Crea Tu Color Signature',
              description: 'Selecciona un tono único y úsalo consistentemente. Con el tiempo, este color se convertirá en sinónimo de tu marca.'
            },
            {
              title: 'Testea Respuestas Emocionales',
              description: 'Usa herramientas de neuromarketing para medir respuestas fisiológicas (dilatación pupilar, conductancia de piel) a diferentes paletas antes de decidir.'
            },
            {
              title: 'Contexto Cultural',
              description: 'Los colores tienen significados distintos en diferentes culturas. El blanco es luto en Asia, el rojo suerte en China. Adapta tu paleta según tu mercado objetivo.'
            },
          ]
        },
        {
          type: 'highlight',
          content: '"El color correcto puede aumentar el reconocimiento de marca hasta un 80% y influir en hasta el 85% de las decisiones de compra."',
          author: 'Instituto de Investigación del Color'
        },
        {
          type: 'conclusion',
          content: 'La psicología del color en el branding de lujo no es decoración, es estrategia pura. Cada tonalidad es una decisión informada por décadas de investigación en neurociencia, psicología cognitiva y comportamiento del consumidor. Al dominar este lenguaje cromático, tu marca no solo se verá premium, se sentirá premium en el nivel más profundo de la psique humana.'
        },
      ]
    },
    'tendencias-diseno-2025': {
      title: 'Tendencias de Diseño 2025: Minimalismo Maximalista',
      author: 'Luis Virrueta',
      date: '2 Dic 2025',
      readTime: '9 min',
      category: 'Tendencias × Diseño',
      tags: ['Trends 2025', 'Minimalism', 'Visual Design', 'Innovation'],
      gradient: 'from-violet-500 to-purple-500',
      sections: [
        {
          type: 'intro',
          content: 'El diseño en 2025 rompe todas las reglas que creíamos absolutas. Bienvenido al "Minimalismo Maximalista": una paradoja visual que fusiona la simplicidad estructural con riqueza sensorial, la claridad funcional con expresión emocional audaz. Esta no es una tendencia, es una revolución en cómo conceptualizamos el diseño mismo.'
        },
        {
          type: 'heading',
          title: 'La Paradoja que Define 2025',
          icon: Sparkles
        },
        {
          type: 'text',
          content: '¿Cómo puede algo ser minimalista y maximalista simultáneamente? La respuesta está en la estratificación: estructura simple + detalles ricos. Base funcional + expresión emocional. Menos elementos, pero cada uno con mayor profundidad, complejidad y propósito. Es el equilibrio perfecto entre el "menos es más" de Mies van der Rohe y el "more is more" de Memphis Group.'
        },
        {
          type: 'subsection',
          number: '01',
          title: 'Tipografía 3D Hiperreal',
          content: 'Las tipografías en 2025 cobran vida con texturas fotorrealistas: madera, metal, cristal, líquido. Tipografía que parece que puedes tocar. Software como Blender y Cinema 4D democratizan la creación de lettering 3D cinematográfico. No es solo texto, es escultura digital que comunica peso, materialidad y lujo.',
          gradient: 'from-purple-500 to-fuchsia-500'
        },
        {
          type: 'subsection',
          number: '02',
          title: 'Gradientes Holográficos Complejos',
          content: 'Los gradientes simples de dos colores murieron. 2025 trae gradientes de 5-7 tonalidades con transiciones no lineales, efectos de ruido, texturas grain y reflejos metálicos. Inspirados por displays holográficos y tecnología OLED, estos gradientes crean profundidad ilusoria y atmósferas envolventes.',
          gradient: 'from-cyan-400 via-purple-500 to-pink-500'
        },
        {
          type: 'subsection',
          number: '03',
          title: 'Animaciones Micro-Interactivas',
          content: 'Cada elemento responde al usuario con animaciones sutiles pero significativas. Hover states con física realista, transiciones que respetan momentum y gravedad, loading states que entretienen. Framer Motion, GSAP y Three.js llevan la interacción web a niveles cinematográficos. La interfaz se siente viva.',
          gradient: 'from-emerald-500 to-teal-500'
        },
        {
          type: 'subsection',
          number: '04',
          title: 'Espacios Negativos Dramatizados',
          content: 'El espacio en blanco ya no es pasivo, es dramático. Vacíos intencionales que crean tensión visual, que guían la mirada con autoridad, que dan respiro emocional. El espacio negativo comunica lujo, confianza y sofisticación. Menos elementos, más aire, más impacto.',
          gradient: 'from-slate-600 to-zinc-800'
        },
        {
          type: 'heading',
          title: 'IA Generativa como Co-Creadora',
          icon: Zap
        },
        {
          type: 'text',
          content: 'Midjourney, DALL-E, Stable Diffusion no son herramientas, son colaboradores creativos. En 2025, los diseñadores más vanguardistas trabajan en simbiosis con IA: generan 100 variaciones en minutos, exploran territorios estéticos imposibles, combinan estilos históricos de formas nunca vistas. La creatividad humana se amplifica exponencialmente.'
        },
        {
          type: 'list',
          items: [
            {
              title: 'Prompt Engineering como Habilidad Core',
              description: 'Saber escribir prompts efectivos es tan importante como saber usar Photoshop. Diseñadores que dominan prompt engineering pueden materializar visiones complejas en segundos.'
            },
            {
              title: 'Estética AI-Native',
              description: 'Surge una estética única generada por IA: texturas imposibles, perspectivas distorsionadas, fusiones de estilos, hiperdetalle onírico. Es el arte digital del siglo XXI.'
            },
            {
              title: 'Human-in-the-Loop Refinement',
              description: 'La IA propone, el humano curatea y refina. El resultado combina la capacidad generativa infinita de la máquina con el criterio estético y cultural del diseñador.'
            },
          ]
        },
        {
          type: 'heading',
          title: 'Dark Mode como Standard, No como Alternativa',
          icon: Eye
        },
        {
          type: 'text',
          content: 'El dark mode dejó de ser una opción para convertirse en el lienzo predeterminado del diseño premium. Psicológicamente comunica sofisticación, modernidad y cuidado visual. Los colores brillan más sobre negro, las imágenes pop, las animaciones resplandecen. Dark mode es el nuevo blanco.'
        },
        {
          type: 'heading',
          title: 'Implementa Estas Tendencias Hoy',
          icon: Brain
        },
        {
          type: 'list',
          items: [
            {
              title: 'Comienza con Estructura Minimalista',
              description: 'Grid limpio, jerarquía clara, espacios amplios. Esta es tu base sólida.'
            },
            {
              title: 'Añade Capas de Riqueza Visual',
              description: 'Gradientes complejos, tipografía 3D, texturas sutiles, animaciones micro. Pero cada capa debe tener propósito.'
            },
            {
              title: 'Experimenta con IA Generativa',
              description: 'Dedica 2 horas semanales a jugar con Midjourney o DALL-E. Expande tu vocabulario visual.'
            },
            {
              title: 'Prioriza Performance',
              description: 'Todo este maximalismo visual debe cargar rápido. Optimiza imágenes, usa lazy loading, implementa WebGL eficiente.'
            },
            {
              title: 'Diseña en Dark Mode Primero',
              description: 'Invierte el flujo tradicional. Diseña primero en dark, luego adapta a light si es necesario.'
            },
          ]
        },
        {
          type: 'highlight',
          content: '"El diseño del futuro no elige entre forma y función, entre arte y usabilidad. Los fusiona en una experiencia que es simultáneamente hermosa y útil, simple y rica, minimalista y maximalista."',
          author: 'Tendencias de Diseño 2025'
        },
        {
          type: 'conclusion',
          content: 'El Minimalismo Maximalista de 2025 representa la madurez del diseño digital. Hemos superado los extremos del skeumorfismo recargado y el flat design austero para encontrar un equilibrio sofisticado: estructuras limpias que permiten detalles ricos, funcionalidad clara que abraza la expresión emocional. Bienvenido a la nueva era del diseño consciente, donde cada pixel tiene propósito y cada espacio cuenta una historia.'
        },
      ]
    },
    'identidades-marca-memorables': {
      title: 'Creando Identidades de Marca Memorables',
      author: 'Luis Virrueta',
      date: '1 Dic 2025',
      readTime: '11 min',
      category: 'Branding × Estrategia',
      tags: ['Brand Identity', 'Strategy', 'Visual Systems', 'Psychology'],
      gradient: 'from-amber-500 to-orange-500',
      sections: [
        {
          type: 'intro',
          content: 'Una marca memorable no ocurre por accidente. Es el resultado de un sistema estratégico que combina psicología, diseño visual y narrativa coherente. En este artículo, desgloso el proceso completo para crear identidades de marca que no solo se ven increíbles, sino que resuenan emocionalmente y permanecen en la mente del consumidor durante años.'
        },
        {
          type: 'heading',
          title: 'Fase 1: Arquetipos Psicológicos - El ADN de Tu Marca',
          icon: Brain
        },
        {
          type: 'text',
          content: 'Toda marca memorable está fundamentada en un arquetipo psicológico. Carl Jung identificó 12 arquetipos universales que residen en el inconsciente colectivo humano: El Héroe, El Sabio, El Rebelde, El Creador, etc. Tu marca debe encarnar uno de estos arquetipos de manera consistente en cada punto de contacto.'
        },
        {
          type: 'subsection',
          number: '01',
          title: 'Identifica Tu Arquetipo Core',
          content: 'Nike es El Héroe (supera tus límites), Apple es El Creador (piensa diferente), Harley-Davidson es El Rebelde (rompe las reglas). Cada arquetipo tiene su propia paleta emocional, lenguaje visual y tono de voz. Definir tu arquetipo es el primer paso no negociable.',
          gradient: 'from-purple-500 to-fuchsia-500'
        },
        {
          type: 'subsection',
          number: '02',
          title: 'Traduce el Arquetipo a Lenguaje Visual',
          content: 'El Héroe usa tipografías bold, colores primarios fuertes, imágenes dinámicas. El Sabio prefiere serifas clásicas, azules profundos, composiciones simétricas. El Rebelde abraza asimetría, texturas rugosas, colores no convencionales. Tu sistema visual debe ser la expresión gráfica de tu arquetipo.',
          gradient: 'from-cyan-500 to-blue-500'
        },
        {
          type: 'heading',
          title: 'Fase 2: Sistema de Identidad Visual - Más Allá del Logo',
          icon: Sparkles
        },
        {
          type: 'text',
          content: 'Un logo es apenas el 10% de una identidad de marca. El verdadero poder está en el sistema completo: paleta de color, tipografías, fotografía, iconografía, texturas, motion graphics. Todos estos elementos deben trabajar en armonía para reforzar el arquetipo y crear reconocimiento instantáneo.'
        },
        {
          type: 'list',
          items: [
            {
              title: 'Logo System (No Solo un Logo)',
              description: 'Versión principal, versión secundaria, logo icon, logo monochrome, responsive logos para diferentes tamaños. Tu logo debe ser flexible sin perder identidad.'
            },
            {
              title: 'Paleta de Color Psicológicamente Estratégica',
              description: 'Colores primarios (2-3 max), colores secundarios, colores de acento. Cada color debe tener un propósito emocional y funcional específico.'
            },
            {
              title: 'Jerarquía Tipográfica Clara',
              description: 'Tipografía display para headlines, tipografía body para párrafos, tipografía UI para interfaces. Máximo 3 familias tipográficas para mantener cohesión.'
            },
            {
              title: 'Fotografía con Dirección de Arte',
              description: 'No cualquier foto sirve. Define tratamiento de color, composición, iluminación, mood. Tu fotografía debe ser reconocible como tuya instantáneamente.'
            },
            {
              title: 'Motion Design Language',
              description: 'Tipo de transiciones, timing, easing, física de las animaciones. El movimiento es parte de tu identidad tanto como el color.'
            },
          ]
        },
        {
          type: 'heading',
          title: 'Fase 3: Manual de Marca - La Biblia de Tu Identidad',
          icon: Eye
        },
        {
          type: 'text',
          content: 'El manual de marca es el documento sagrado que garantiza consistencia. Debe ser claro, visual, fácil de seguir. No solo especifica el "cómo", sino el "por qué" detrás de cada decisión de diseño. Un manual bien hecho permite que cualquier diseñador en cualquier parte del mundo ejecute tu identidad correctamente.'
        },
        {
          type: 'subsection',
          number: '01',
          title: 'Contenidos Esenciales del Manual',
          content: 'Historia y valores de la marca, arquetipo psicológico, sistema de logo con usos correctos e incorrectos, paleta de color con códigos Pantone/CMYK/RGB/HEX, tipografías con jerarquías, guidelines de fotografía, sistema de iconografía, templates de papelería, aplicaciones en medios digitales y físicos.',
          gradient: 'from-emerald-500 to-teal-500'
        },
        {
          type: 'heading',
          title: 'Fase 4: Puntos de Contacto - Omnipresencia Coherente',
          icon: Zap
        },
        {
          type: 'text',
          content: 'Una marca memorable aparece consistentemente en todos los puntos de contacto con el cliente: sitio web, redes sociales, packaging, tarjetas de presentación, email signatures, presentaciones, espacios físicos. Cada interacción refuerza la memoria de marca. La repetición coherente crea familiaridad, y la familiaridad genera confianza.'
        },
        {
          type: 'list',
          items: [
            {
              title: 'Digital Presence',
              description: 'Website, app móvil, perfiles de redes sociales, email marketing, ads digitales. Diseña templates que mantengan tu identidad mientras permiten flexibilidad creativa.'
            },
            {
              title: 'Print Materials',
              description: 'Tarjetas de presentación, papelería corporativa, brochures, packaging. El mundo físico aún importa, especialmente para marcas premium.'
            },
            {
              title: 'Environmental Branding',
              description: 'Si tienes espacios físicos (tienda, oficina, showroom), el diseño del espacio debe reflejar tu identidad. Señalización, murales, mobiliario, iluminación.'
            },
            {
              title: 'Merchandise & Swag',
              description: 'Ropa branded, accesorios, objetos promocionales. Estos son embajadores móviles de tu marca. Diseña merch que la gente realmente quiera usar.'
            },
          ]
        },
        {
          type: 'heading',
          title: 'Fase 5: Testing Psicológico - Validación Científica',
          icon: Brain
        },
        {
          type: 'text',
          content: 'No confíes solo en tu intuición. Valida tu identidad con testing real: pruebas A/B, eye-tracking, análisis de microexpresiones, encuestas de reconocimiento de marca. Los datos te revelarán si tu diseño realmente comunica lo que pretendes o si necesitas ajustes.'
        },
        {
          type: 'list',
          items: [
            {
              title: 'Test de Reconocimiento en 3 Segundos',
              description: 'Muestra tu logo/identidad por 3 segundos. ¿La gente puede recordarlo y describir la emoción que sintieron? Si no, simplifica.'
            },
            {
              title: 'Test de Asociación Emocional',
              description: 'Pregunta: "¿Qué 3 palabras te vienen a la mente al ver esta marca?" Si las palabras coinciden con tu arquetipo, éxito. Si no, ajusta.'
            },
            {
              title: 'Test de Diferenciación',
              description: 'Muestra tu identidad junto a 5 competidores. ¿Se destaca tu marca? ¿Es claramente diferente? La similitud es muerte en branding.'
            },
            {
              title: 'Test de Escalabilidad',
              description: 'Aplica tu identidad en 10 contextos diferentes (web, print, merchandising, etc.). ¿Se mantiene fuerte en todos? Si no, tu sistema necesita más flexibilidad.'
            },
          ]
        },
        {
          type: 'highlight',
          content: '"Una marca memorable es aquella que crea una red neural robusta en el cerebro del consumidor. Cada interacción fortalece esa red hasta que tu marca se convierte en instinto, no en elección consciente."',
          author: 'Neuromarketing Institute'
        },
        {
          type: 'conclusion',
          content: 'Crear una identidad de marca memorable es un acto de arquitectura psicológica. No estás diseñando un logo, estás construyendo un sistema de significados que residirá en la mente de tu audiencia. Arquetipo bien definido + sistema visual coherente + manual de marca detallado + puntos de contacto consistentes + validación científica = marca inolvidable. Este es el proceso, estos son los pasos. Ahora ve y construye marcas que trasciendan.'
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

  // Calcular tiempo de lectura dinámicamente
  const dynamicReadTime = calculateReadTime(article.sections)

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
      {/* Schema Markup para SEO */}
      <ArticleSchema 
        title={article.title}
        description={article.sections[0]?.content?.substring(0, 160)}
        image={article.heroImage || '/IMAGENES BLOG/1.jpg'}
        author={article.author}
        publishedTime={toISODate(article.date)}
        tags={article.tags}
        url={`https://luxmania.com/blog/${slug}`}
      />
      
      {/* Reading Progress Bar */}
      <ReadingProgressBar />
      
      {/* Table of Contents flotante */}
      <TableOfContents sections={article.sections} />

      {/* Hero Image si existe */}
      {article.heroImage && (
        <div className="relative w-full h-[60vh] lg:h-[70vh] overflow-hidden">
          <img 
            src={article.heroImage} 
            alt={article.title}
            className="absolute inset-0 w-full h-full object-cover"
          />
          {/* Overlay oscuro cinematográfico */}
          <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/40 to-black" />
          
          {/* Título sobre la imagen - solo para artículos con hero image */}
          <div className="absolute inset-0 flex items-end justify-center pb-16 px-6">
            <div className="max-w-4xl text-center">
              <motion.h1
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 1, delay: 0.3 }}
                className="text-4xl lg:text-6xl font-bold text-white leading-tight drop-shadow-2xl"
                style={{ letterSpacing: '0.02em', fontWeight: 300 }}
              >
                {article.title}
              </motion.h1>
            </div>
          </div>
        </div>
      )}

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

      {/* Share Buttons */}
      <ShareButtons title={article.title} url={`/blog/${slug}`} />

      {/* Newsletter Signup */}
      <NewsletterSignup />

      {/* Comments Section */}
      <CommentsSection articleTitle={article.title} />

      {/* Related Articles */}
      <RelatedArticles 
        currentSlug={slug} 
        allArticles={[
          {
            title: 'Neurociencia del Diseño: Por Qué Algunos Logos Son Inolvidables',
            slug: 'neurociencia-del-diseno',
            excerpt: 'La ciencia detrás de los logos icónicos y cómo aplicar estos principios neurológicos a tu marca.',
            image: '/IMAGENES BLOG/1.jpg',
            date: '15 Nov 2024',
            readTime: '12 min',
            gradient: 'from-pink-500/20 to-rose-500/20',
            borderGradient: 'from-pink-500 to-rose-500',
            rating: 4.9
          },
          {
            title: 'La IA Generativa en el Diseño: Del Prompt a la Emoción',
            slug: 'ia-generativa-diseno-emocion',
            excerpt: 'Cómo fusionar inteligencia artificial, diseño visual y psicología para crear experiencias que conectan emocionalmente.',
            image: '/IMAGENES BLOG/2.jpg',
            date: '22 Nov 2024',
            readTime: '14 min',
            gradient: 'from-purple-500/20 to-fuchsia-500/20',
            borderGradient: 'from-purple-500 to-fuchsia-500',
            rating: 5.0
          },
          {
            title: 'Interfaces que Leen tu Mente: UX Empático con Machine Learning',
            slug: 'interfaces-empaticas-machine-learning',
            excerpt: 'Descubre cómo el ML y la psicología del usuario se unen para crear interfaces que anticipan necesidades.',
            image: '/IMAGENES BLOG/3.jpg',
            date: '28 Nov 2024',
            readTime: '13 min',
            gradient: 'from-cyan-500/20 to-blue-500/20',
            borderGradient: 'from-cyan-500 to-blue-500',
            rating: 4.8
          },
          {
            title: 'La Psicología del Color en el Branding de Lujo',
            slug: 'psicologia-color-branding-lujo',
            excerpt: 'Descubre cómo las marcas premium utilizan la teoría del color para crear conexiones emocionales profundas.',
            image: '/IMAGENES BLOG/4.jpg',
            date: '3 Dic 2024',
            readTime: '10 min',
            gradient: 'from-emerald-500/20 to-teal-500/20',
            borderGradient: 'from-emerald-500 to-teal-500',
            rating: 4.7
          },
          {
            title: 'Tendencias de Diseño 2025: Minimalismo Maximalista',
            slug: 'tendencias-diseno-2025',
            excerpt: 'El nuevo paradigma que combina la simplicidad estructural con detalles ricos y experiencias sensoriales complejas.',
            image: '/IMAGENES BLOG/5.jpg',
            date: '5 Dic 2024',
            readTime: '9 min',
            gradient: 'from-violet-500/20 to-purple-500/20',
            borderGradient: 'from-violet-500 to-purple-500',
            rating: 4.9
          },
          {
            title: 'Creando Identidades de Marca Memorables',
            slug: 'identidades-marca-memorables',
            excerpt: 'Un sistema paso a paso para desarrollar marcas que resuenan emocionalmente y permanecen en la mente del consumidor.',
            image: '/IMAGENES BLOG/6.jpg',
            date: '7 Dic 2024',
            readTime: '11 min',
            gradient: 'from-amber-500/20 to-orange-500/20',
            borderGradient: 'from-amber-500 to-orange-500',
            rating: 5.0
          }
        ]} 
      />
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
        id={`section-${index}`}
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
