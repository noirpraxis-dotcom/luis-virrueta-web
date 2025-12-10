import { motion, useInView } from 'framer-motion'
import { useRef } from 'react'
import { useParams, Link } from 'react-router-dom'
import { Calendar, Clock, ArrowLeft, User, Tag, Share2, BookmarkPlus, Eye, Brain, Zap, Sparkles, Award, Check, Shield } from 'lucide-react'
import ReadingProgressBar from '../components/ReadingProgressBar'
import ShareButtons from '../components/ShareButtons'
import CommentsSection from '../components/CommentsSection'
import RelatedArticles from '../components/RelatedArticles'
import NewsletterSignup from '../components/NewsletterSignup'
import TableOfContents from '../components/TableOfContents'
import ArticleSchema from '../components/ArticleSchema'
import { calculateReadTime, toISODate } from '../utils/blogHelpers'
import { useLanguage } from '../context/LanguageContext'
import { getArticleContent } from '../data/blogArticlesContent'

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
    'cliente-heroe-storybrand-framework': {
      title: 'Tu Cliente es el Héroe, No Tu Marca: El Framework StoryBrand',
      author: 'Luis Virrueta',
      date: '9 Dic 2024',
      readTime: '16 min',
      category: 'Branding',
      tags: ['StoryBrand', 'Storytelling', 'Brand Strategy', 'Marketing'],
      gradient: 'from-amber-500 to-orange-500',
      sections: [
        {
          type: 'intro',
          content: 'Después de trabajar con cientos de marcas, Donald Miller descubrió algo revolucionario: las marcas más exitosas no hablan de sí mismas, hablan de ti. El StoryBrand Framework transforma la comunicación de marca aplicando los principios universales del storytelling para posicionar a tu cliente como el héroe de la historia, y a tu marca como el guía que lo lleva al éxito.'
        },
        {
          type: 'heading',
          title: 'El Problema de las Marcas que No Conectan',
          icon: Brain
        },
        {
          type: 'text',
          content: 'La mayoría de las marcas cometen el mismo error fatal: se posicionan como el héroe de su propia historia. Hablan de su trayectoria, sus logros, sus premios, sus productos innovadores. Pero el cerebro humano está programado para prestar atención a historias donde podemos vernos reflejados como protagonistas.'
        },
        {
          type: 'highlight',
          content: '"El cliente es el héroe. Tu marca es el guía. Si posicionas tu marca como el héroe, pierdes."',
          author: 'Donald Miller, Building a StoryBrand'
        },
        {
          type: 'heading',
          title: 'Los 7 Elementos del StoryBrand Framework',
          icon: Sparkles
        },
        {
          type: 'subsection',
          number: '01',
          title: 'Un Personaje (Tu Cliente)',
          content: 'El héroe de tu historia no eres tú, es tu cliente. Define claramente quién es, qué quiere, y cuál es su deseo fundamental. No vendas productos, vende transformaciones. Nike no vende zapatos, vende la versión atlética de ti mismo. Apple no vende computadoras, vende creatividad y simplicidad.',
          gradient: 'from-purple-500 to-fuchsia-500'
        },
        {
          type: 'subsection',
          number: '02',
          title: 'Tiene un Problema',
          content: 'Define el problema en tres niveles: Externo (el obstáculo tangible), Interno (cómo se siente respecto al problema), y Filosófico (por qué está mal que exista este problema). Tesla vende autos eléctricos (externo), pero realmente resuelve la culpa ambiental (interno) y la visión de un futuro sostenible (filosófico).',
          gradient: 'from-cyan-500 to-blue-500'
        },
        {
          type: 'subsection',
          number: '03',
          title: 'Y Encuentra un Guía',
          content: 'Aquí entras tú. Pero no como el héroe, sino como Yoda, Gandalf o Mr. Miyagi: el sabio mentor que ha estado donde está el héroe y conoce el camino. Demuestra empatía ("entiendo tu dolor") y autoridad ("he ayudado a otros como tú").',
          gradient: 'from-emerald-500 to-teal-500'
        },
        {
          type: 'subsection',
          number: '04',
          title: 'Quien Le Da un Plan',
          content: 'Los clientes necesitan claridad, no complejidad. Ofrece un plan simple de 3 pasos que elimine la confusión y el riesgo. Ejemplo: "1. Agenda una llamada. 2. Recibe tu estrategia personalizada. 3. Implementa y crece." La simplicidad genera confianza.',
          gradient: 'from-rose-500 to-pink-500'
        },
        {
          type: 'subsection',
          number: '05',
          title: 'Y Los Llama a la Acción',
          content: 'Dos tipos de call to action: Directo ("Compra ahora", "Agenda tu consulta") y de Transición ("Descarga la guía gratuita", "Mira el video"). La mayoría de visitantes no están listos para comprar hoy, pero sí para dar un paso pequeño. Ofrece ambos caminos.',
          gradient: 'from-violet-500 to-purple-500'
        },
        {
          type: 'subsection',
          number: '06',
          title: 'Que Los Ayuda a Evitar el Fracaso',
          content: 'Define claramente qué pasa si no actúan. No uses miedo manipulador, usa consecuencias reales y relevantes. "Sin una estrategia clara de marca, seguirás compitiendo solo por precio y perderás clientes con competidores mejor posicionados." El fracaso debe ser específico y creíble.',
          gradient: 'from-amber-500 to-orange-500'
        },
        {
          type: 'subsection',
          number: '07',
          title: 'Y Termina en Éxito',
          content: 'Pinta una imagen vívida del éxito. No solo "aumentarás ventas", sino "imagina cerrar 3 clientes ideales al mes sin perseguirlos, mientras construyes una marca que te posiciona como la única opción lógica." El éxito debe ser aspiracional, específico y emocionalmente resonante.',
          gradient: 'from-teal-500 to-cyan-500'
        },
        {
          type: 'heading',
          title: 'Aplicando StoryBrand a Tu Comunicación',
          icon: Zap
        },
        {
          type: 'text',
          content: 'El framework no es solo para tu página web. Es un filtro para toda tu comunicación: emails, posts sociales, presentaciones, publicidad. Cada mensaje debe pasar la prueba: ¿Estoy posicionando al cliente como héroe? ¿Estoy actuando como guía? ¿Ofrezco un plan claro?'
        },
        {
          type: 'list',
          items: [
            {
              title: 'Tu Encabezado Web',
              description: 'Debe responder en 5 segundos: ¿Qué ofreces? ¿Cómo hace mejor mi vida? ¿Qué debo hacer después? "Construye una marca que vende sola. Estrategia de branding psicológico que convierte. Agenda tu sesión gratuita."'
            },
            {
              title: 'Tu Pitch de Ventas',
              description: 'Empieza con el problema del cliente, no con tu historia. "¿Cansado de invertir en marketing sin resultados claros?" es infinitamente mejor que "Somos una agencia fundada en 2010..."'
            },
            {
              title: 'Tus Emails',
              description: 'Cada email debe mover al héroe (cliente) más cerca de su transformación. Comparte valor, historias de éxito, y siempre incluye un CTA claro.'
            },
            {
              title: 'Tu Contenido Social',
              description: 'Posts que cuentan historias donde tus clientes son protagonistas generan 10x más engagement que posts sobre tu marca.'
            },
          ]
        },
        {
          type: 'heading',
          title: 'El BrandScript: Tu Mapa de Historia',
          icon: Eye
        },
        {
          type: 'text',
          content: 'Donald Miller creó una herramienta llamada BrandScript: un documento de una página que responde los 7 elementos del framework para tu marca específica. Es la base de toda tu comunicación. Ejemplo simplificado:'
        },
        {
          type: 'colorGrid',
          colors: [
            { name: 'Personaje', hex: '#8B5CF6', emotion: 'Emprendedor creativo', brands: 'Quiere destacar con autenticidad' },
            { name: 'Problema', hex: '#EC4899', emotion: 'Marcas genéricas sin alma', brands: 'Se siente invisible en su mercado' },
            { name: 'Guía', hex: '#10B981', emotion: 'LUXMANIA como mentor', brands: 'Empatía + autoridad en branding' },
            { name: 'Plan', hex: '#F59E0B', emotion: '1.Sesión → 2.Estrategia → 3.Implementación', brands: '3 pasos claros y simples' },
          ]
        },
        {
          type: 'heading',
          title: 'Errores Comunes al Aplicar StoryBrand',
          icon: Brain
        },
        {
          type: 'list',
          items: [
            {
              title: 'Ser Demasiado Vago',
              description: '"Ayudamos empresas a crecer" no dice nada. "Ayudamos a coaches a llenar sus programas sin quemar su energía en redes sociales" es específico y resuena.'
            },
            {
              title: 'Múltiples Mensajes',
              description: 'Un mensaje confuso = ningún mensaje. Si ofreces 10 servicios, tu cliente no sabrá por dónde empezar. Prioriza.'
            },
            {
              title: 'Olvidar el Stakes (Lo que está en juego)',
              description: 'Si no hay consecuencias claras de no actuar, no hay urgencia. Pero deben ser reales, no manufacturadas.'
            },
            {
              title: 'Plan Complicado',
              description: 'Si tu plan tiene más de 4 pasos, es demasiado complejo. Simplifica o perderás al cliente.'
            },
          ]
        },
        {
          type: 'conclusion',
          content: 'El StoryBrand Framework es poderoso porque se alinea con cómo el cerebro humano está programado para procesar información: a través de historias. Cuando posicionas a tu cliente como el héroe y te posicionas como el guía sabio que conoce el camino, tu mensaje corta el ruido, genera confianza, y convierte. No vendas productos. Vende transformaciones. No seas el héroe. Sé el mentor que hace héroes.'
        },
      ]
    },
    'pre-suasion-cialdini-branding': {
      title: 'Pre-Suasión: Gana la Venta Antes de que Tu Cliente Sepa que Quiere Comprar',
      author: 'Luis Virrueta',
      date: '10 Dic 2024',
      readTime: '15 min',
      category: 'Branding × Psicología',
      tags: ['Pre-Suasion', 'Persuasion', 'Brand Strategy', 'Neuromarketing'],
      gradient: 'from-indigo-500 to-purple-500',
      sections: [
        {
          type: 'intro',
          content: 'Robert Cialdini, el padrino de la psicología de la persuasión, descubrió algo revolucionario: la venta no ocurre cuando presentas tu oferta. Ocurre en los segundos ANTES de presentarla. Pre-Suasión es el arte de preparar la mente de tu audiencia para que diga "sí" antes de que siquiera sepan que van a comprar. En branding, esto lo cambia todo.'
        },
        {
          type: 'heading',
          title: 'El Problema: Marcas que Llegan Demasiado Tarde',
          icon: Brain
        },
        {
          type: 'text',
          content: 'La mayoría de las marcas invierten todo su presupuesto en el momento de la venta: anuncios directos, CTAs agresivos, ofertas, descuentos. Pero Cialdini demostró que para cuando presentas tu oferta, la decisión de compra ya fue tomada (o rechazada) por el cerebro inconsciente del cliente.'
        },
        {
          type: 'highlight',
          content: '"El momento óptimo para influir en las personas no es durante el intento de cambiar sus mentes, sino antes de que intentes hacerlo. La pre-suasión consiste en optimizar el estado mental de la audiencia ANTES del mensaje."',
          author: 'Robert Cialdini, Pre-Suasion'
        },
        {
          type: 'heading',
          title: 'Qué es Pre-Suasión (Y Por Qué Es Branding Aplicado)',
          icon: Sparkles
        },
        {
          type: 'text',
          content: 'Pre-Suasión es el proceso de guiar la atención de tu audiencia hacia conceptos y emociones específicas ANTES de presentar tu marca o producto. No se trata de manipulación, sino de diseñar el contexto psicológico óptimo para que tu mensaje resuene.'
        },
        {
          type: 'text',
          content: 'En branding, esto significa que tu logo, colores, nombre, narrativa y puntos de contacto están trabajando 24/7 para pre-suadir a tu audiencia. Cuando finalmente te necesitan, ya están mentalmente alineados contigo.'
        },
        {
          type: 'heading',
          title: 'Los 3 Pilares de la Pre-Suasión en Branding',
          icon: Zap
        },
        {
          type: 'subsection',
          number: '01',
          title: 'Atención Privilegiada',
          content: 'Lo que captura la atención del cerebro se vuelve importante. Si tu branding consistentemente dirige la atención hacia ciertos valores (innovación, lujo, confianza), esos valores quedan asociados con tu marca incluso antes de la venta. Ejemplo: Apple dirige atención a simplicidad y creatividad en CADA punto de contacto. Cuando necesitas una laptop, esos valores ya están activos en tu mente.',
          gradient: 'from-indigo-500 to-purple-500'
        },
        {
          type: 'subsection',
          number: '02',
          title: 'Asociación Contextual',
          content: 'El cerebro asocia tu marca con el contexto donde la encuentra. Si tu branding aparece en contextos de éxito, lujo, o transformación, tu marca hereda esas asociaciones. Ejemplo: Rolex patrocina eventos de élite (tenis, golf, Fórmula 1). No venden relojes, venden el contexto de excelencia donde aparecen.',
          gradient: 'from-purple-500 to-fuchsia-500'
        },
        {
          type: 'subsection',
          number: '03',
          title: 'Momento de Receptividad',
          content: 'Hay momentos psicológicos donde la audiencia está más abierta a ciertos mensajes. Pre-Suasión identifica y aprovecha esos momentos. Ejemplo: Una marca de fitness que aparece en Enero (propósitos de año nuevo) está aprovechando un momento de receptividad masiva hacia cambio y salud.',
          gradient: 'from-fuchsia-500 to-pink-500'
        },
        {
          type: 'heading',
          title: 'Estrategias de Pre-Suasión para Tu Marca',
          icon: Eye
        },
        {
          type: 'list',
          items: [
            {
              title: '1. Diseña Tu "Opener" Psicológico',
              description: 'Antes de presentar tu marca/producto, introduce conceptos que activen los valores que quieres asociar. Si vendes consultoría de branding, no empieces con "somos expertos". Empieza con "¿Alguna vez sentiste que tu marca es invisible?" Ahora su cerebro está enfocado en el problema que resuelves.'
            },
            {
              title: '2. Cura el Entorno Visual',
              description: 'Todo lo que rodea tu marca comunica. Tu sitio web, redes, emails, presentaciones deben tener coherencia visual que refuerce tus valores. Si eres marca de lujo, hasta tus errores 404 deben respirar elegancia.'
            },
            {
              title: '3. Usa "Priming" Emocional',
              description: 'Introduce emociones positivas ANTES del mensaje de marca. Ejemplo: Una marca de viajes que muestra fotos de familias felices ANTES de mostrar paquetes turísticos está primando la emoción de felicidad familiar.'
            },
            {
              title: '4. Nombre y Tagline Estratégicos',
              description: 'Tu nombre y tagline son herramientas de pre-suasión permanentes. "Just Do It" de Nike pre-suade hacia acción. "Think Different" de Apple pre-suade hacia creatividad. Cada vez que alguien ve tu marca, esas palabras están trabajando.'
            },
            {
              title: '5. Storytelling como Pre-Suasión',
              description: 'Las historias pre-suaden porque activan emociones y valores antes de llegar al CTA. Si tu marca cuenta historias de transformación, cada historia prepara al cerebro para creer que tú eres el agente de transformación.'
            },
          ]
        },
        {
          type: 'heading',
          title: 'Casos Reales de Pre-Suasión en Branding',
          icon: Award
        },
        {
          type: 'text',
          content: 'Analicemos cómo marcas globales usan pre-suasión sin que te des cuenta:'
        },
        {
          type: 'colorGrid',
          colors: [
            { name: 'Tesla', hex: '#E82127', emotion: 'Pre-suasión: Futuro sostenible', brands: 'No venden autos, venden identidad de pionero tech-ecológico. Cada tweet de Elon pre-suade.' },
            { name: 'Starbucks', hex: '#00704A', emotion: 'Pre-suasión: Tercer lugar', brands: 'No venden café, venden el concepto de "tu lugar entre casa y trabajo". El ambiente pre-suade confort.' },
            { name: 'Airbnb', hex: '#FF5A5F', emotion: 'Pre-suasión: Pertenencia', brands: 'No rentan casas, pre-suaden con "belong anywhere". Cada foto de experiencia local activa deseo de pertenencia.' },
            { name: 'Patagonia', hex: '#1B4D3E', emotion: 'Pre-suasión: Activismo ambiental', brands: 'No venden ropa outdoor, pre-suaden con activismo. "Don\'t Buy This Jacket" es pre-suasión inversa genial.' },
          ]
        },
        {
          type: 'heading',
          title: 'Cómo Aplicar Pre-Suasión a Tu Estrategia de Marca',
          icon: Sparkles
        },
        {
          type: 'list',
          items: [
            {
              title: 'Paso 1: Identifica el Estado Mental Ideal',
              description: 'Pregúntate: ¿Qué necesita estar pensando/sintiendo mi cliente ideal para que mi oferta sea irresistible? Ejemplo: Si vendes coaching ejecutivo, el estado mental ideal es "Estoy estancado y necesito un mentor".'
            },
            {
              title: 'Paso 2: Diseña Puntos de Contacto que Activen Ese Estado',
              description: 'Todos tus contenidos (blog, redes, emails) deben activar sutilmente ese estado mental. Si el estado es "necesito mentor", tu contenido debe hablar de transformación personal, no de tu currículum.'
            },
            {
              title: 'Paso 3: Consistencia Obsesiva',
              description: 'Pre-Suasión solo funciona con repetición. Tu branding debe repetir los mismos valores, emociones y conceptos hasta que se vuelvan automáticos en la mente de tu audiencia.'
            },
            {
              title: 'Paso 4: Mide la Asociación',
              description: 'Pregunta a clientes potenciales: "¿Qué tres palabras asocias con nuestra marca?" Si las palabras coinciden con tus valores objetivo, la pre-suasión está funcionando.'
            },
          ]
        },
        {
          type: 'heading',
          title: 'Pre-Suasión vs. Persuasión: La Diferencia',
          icon: Brain
        },
        {
          type: 'text',
          content: 'Persuasión tradicional: "Compra mi producto porque tiene X, Y, Z características y está en oferta." Pre-Suasión: Semanas/meses antes, tu branding ya instaló en la mente del cliente que necesita exactamente X, Y, Z. Cuando finalmente presentas tu oferta, se siente como la respuesta obvia a una necesidad que ellos ya tenían (aunque tú la creaste).'
        },
        {
          type: 'conclusion',
          content: 'Pre-Suasión no es un hack, es branding estratégico en su máxima expresión. Las marcas más poderosas del mundo no convencen, pre-suaden. Cuando entiendes que la batalla por la mente de tu cliente se gana ANTES del mensaje de venta, tu enfoque de branding cambia por completo. No se trata de gritar más fuerte en el momento de la oferta. Se trata de susurrar constantemente los valores correctos hasta que tu marca sea la única respuesta lógica cuando el cliente esté listo para comprar.'
        },
      ]
    },
    'seis-armas-persuasion-cialdini': {
      title: 'Las 6 Armas de la Persuasión: Cómo Aplicarlas a Tu Marca',
      author: 'Luis Virrueta',
      date: '10 Dic 2024',
      readTime: '18 min',
      category: 'Branding × Psicología',
      tags: ['Influence', 'Persuasion', 'Psychology', 'Brand Strategy'],
      gradient: 'from-rose-500 to-pink-500',
      sections: [
        {
          type: 'intro',
          content: 'En 1984, Robert Cialdini publicó "Influence: The Psychology of Persuasion" y cambió para siempre cómo entendemos la toma de decisiones. Después de años infiltrado en organizaciones de ventas, sectas y marketers, descubrió 6 principios psicológicos universales que activan el "sí" automático en el cerebro humano. Estas no son técnicas de manipulación, son atajos mentales (heurísticas) que evolucionamos para sobrevivir. Las marcas más exitosas los usan conscientemente. Hoy los aplicas a tu branding.'
        },
        {
          type: 'heading',
          title: 'Las 6 Armas de la Persuasión',
          icon: Sparkles
        },
        {
          type: 'text',
          content: 'Antes de profundizar en cómo aplicarlas, aquí está el mapa completo de las 6 armas que Cialdini identificó:'
        },
        {
          type: 'colorGrid',
          colors: [
            { name: 'Reciprocidad', hex: '#10B981', emotion: 'Principio', brands: 'Cuando alguien nos da algo, sentimos deuda de devolver el favor. Es automático.' },
            { name: 'Compromiso', hex: '#3B82F6', emotion: 'Principio', brands: 'Una vez hacemos un compromiso público, sentimos presión de ser consistentes con él.' },
            { name: 'Prueba Social', hex: '#8B5CF6', emotion: 'Principio', brands: 'Vemos a otros hacer algo y asumimos que es correcto. Seguimos a la manada.' },
            { name: 'Autoridad', hex: '#F59E0B', emotion: 'Principio', brands: 'Obedecemos automáticamente a figuras de autoridad legítimas (o símbolos de autoridad).' },
            { name: 'Simpatía', hex: '#EC4899', emotion: 'Principio', brands: 'Decimos "sí" a personas que nos agradan. Belleza, similitud y elogios aumentan simpatía.' },
            { name: 'Escasez', hex: '#EF4444', emotion: 'Principio', brands: 'Valoramos más lo que es raro o está a punto de desaparecer. FOMO elevado a ciencia.' },
          ]
        },
        {
          type: 'heading',
          title: '1. Reciprocidad: El Poder de Dar Primero',
          icon: Sparkles
        },
        {
          type: 'text',
          content: 'El principio de reciprocidad es simple pero devastadoramente efectivo: cuando alguien nos da algo (un regalo, información, ayuda), sentimos una obligación inconsciente de devolver el favor. Esta obligación es tan fuerte que funciona incluso si no pedimos el regalo inicial.'
        },
        {
          type: 'subsection',
          number: '',
          title: 'Cómo aplicarlo a tu marca:',
          content: '',
          gradient: 'from-emerald-500 to-teal-500'
        },
        {
          type: 'list',
          items: [
            {
              title: 'Contenido Gratuito de Alto Valor',
              description: 'No des "muestras gratis", da regalos que resuelvan problemas reales. Ejemplo: LUXMANIA podría ofrecer un "Mini-Análisis de Arquetipo de Marca" gratuito. El cliente recibe valor real, siente reciprocidad, y cuando necesita branding completo, ya existe deuda psicológica.'
            },
            {
              title: 'Sorprende con lo Inesperado',
              description: 'La reciprocidad es más fuerte cuando el regalo es inesperado. Ejemplo: Una marca de joyería que envía una nota manuscrita + pequeño accesorio gratis con cada compra genera lealtad desproporcionada al costo del gesto.'
            },
            {
              title: 'Sé el Primero en Dar',
              description: 'No esperes a que el cliente compre para dar valor. Lead magnets, webinars gratuitos, consultas iniciales sin costo son herramientas de reciprocidad. Ejemplo: HubSpot regala herramientas CRM gratis. La reciprocidad los convierte en líderes de mercado.'
            },
          ]
        },
        {
          type: 'heading',
          title: '2. Compromiso y Consistencia: El Poder de los Pasos Pequeños',
          icon: Check
        },
        {
          type: 'text',
          content: 'Una vez hacemos un compromiso (especialmente público o escrito), sentimos presión interna para actuar de manera consistente con ese compromiso. Nuestro cerebro odia la disonancia cognitiva. Este principio explica por qué "probar" algo gratis suele llevar a compras: una vez dijiste "sí" al trial, inconscientemente quieres ser consistente y seguir diciendo "sí".'
        },
        {
          type: 'subsection',
          number: '',
          title: 'Cómo aplicarlo a tu marca:',
          content: '',
          gradient: 'from-blue-500 to-cyan-500'
        },
        {
          type: 'list',
          items: [
            {
              title: 'Micro-Compromisos Progresivos',
              description: 'No pidas la venta grande de entrada. Pide micro-sís: suscribirse al newsletter, descargar un PDF, ver un video. Cada "sí" pequeño hace más fácil el "sí" grande. Ejemplo: Amazon Prime empezó con trial de 30 días. Una vez pruebas, el compromiso interno te empuja a quedarte.'
            },
            {
              title: 'Hazlo Público',
              description: 'Los compromisos públicos son más poderosos. Ejemplo: Fitness brands que piden a usuarios postear su "Día 1" en redes sociales. El compromiso público los ata psicológicamente a continuar.'
            },
            {
              title: 'Escríbelo',
              description: 'Los compromisos escritos son más vinculantes mentalmente. Ejemplo: Una marca de coaching que hace que escribas tus objetivos en la primera sesión está usando consistencia. Tu cerebro luchará por cumplir lo que escribiste.'
            },
          ]
        },
        {
          type: 'heading',
          title: '3. Prueba Social: Si Todos Lo Hacen, Debe Estar Bien',
          icon: Eye
        },
        {
          type: 'text',
          content: 'Somos animales sociales. Cuando no estamos seguros de qué hacer, miramos qué están haciendo otros como nosotros. Si 1,000 personas compraron, debe ser bueno. Si nadie compró, debe ser malo. La prueba social es el principio más usado (y abusado) en marketing digital.'
        },
        {
          type: 'subsection',
          number: '',
          title: 'Cómo aplicarlo a tu marca:',
          content: '',
          gradient: 'from-purple-500 to-fuchsia-500'
        },
        {
          type: 'list',
          items: [
            {
              title: 'Testimonios Específicos',
              description: '"Excelente servicio" no funciona. "Luis transformó mi marca de invisible a referente en mi industria en 3 meses" sí funciona. Especificidad = credibilidad. Bonus: Usa foto, nombre completo, y empresa del testimonio.'
            },
            {
              title: 'Números que Impresionan',
              description: '"Más de 500 marcas confiaron en nosotros" es prueba social cuantificable. El cerebro reptiliano entiende números. Úsalos estratégicamente en tu web y redes.'
            },
            {
              title: 'User-Generated Content',
              description: 'Clientes reales usando tu producto/servicio es la prueba social más poderosa. Ejemplo: GoPro construyó un imperio con videos de usuarios. Airbnb muestra fotos reales de huéspedes. Es más creíble que cualquier anuncio.'
            },
            {
              title: 'Certificaciones y Asociaciones',
              description: 'Logos de medios donde apareciste, certificaciones, premios. "Como visto en Forbes, Entrepreneur, etc." Es prueba social de autoridad prestada.'
            },
          ]
        },
        {
          type: 'heading',
          title: '4. Autoridad: Obedecemos a Expertos (O Símbolos de Expertise)',
          icon: Award
        },
        {
          type: 'text',
          content: 'Experimentos de Milgram demostraron que obedecemos ciegamente a figuras de autoridad. En branding, no necesitas ser médico o profesor para activar este principio. Necesitas SÍMBOLOS de autoridad: títulos, uniformes, premios, apariciones en medios, lenguaje técnico.'
        },
        {
          type: 'subsection',
          number: '',
          title: 'Cómo aplicarlo a tu marca:',
          content: '',
          gradient: 'from-amber-500 to-orange-500'
        },
        {
          type: 'list',
          items: [
            {
              title: 'Demuestra Experiencia',
              description: '"15 años en la industria", "Trabajé con +200 marcas", "Certificado en X por Y universidad". No seas modesto. La autoridad no se asume, se comunica explícitamente.'
            },
            {
              title: 'Contenido Educativo Profundo',
              description: 'Blogs como este artículo establecen autoridad. Cuando das conocimiento sin pedir nada a cambio, te posicionas como experto. Tu blog es tu herramienta #1 de autoridad.'
            },
            {
              title: 'Apariciones y Colaboraciones',
              description: '"Speaker en TEDx", "Colaboré con [marca grande]", "Featured in [publicación reconocida]". Autoridad prestada es autoridad válida.'
            },
            {
              title: 'Antes/Después y Casos de Estudio',
              description: 'Mostrar resultados concretos es autoridad demostrada. Un portafolio con casos de éxito dice "sé lo que hago" sin que tengas que decirlo.'
            },
          ]
        },
        {
          type: 'heading',
          title: '5. Simpatía: Compramos de Quien Nos Cae Bien',
          icon: Sparkles
        },
        {
          type: 'text',
          content: 'Parece obvio, pero la ciencia lo confirma: es más probable que digamos "sí" a personas/marcas que nos agradan. La simpatía se construye con: atractivo físico (aplica a diseño de marca), similitud ("somos iguales"), elogios genuinos, cooperación (trabajar juntos hacia un objetivo común), y asociación con cosas que ya nos gustan.'
        },
        {
          type: 'subsection',
          number: '',
          title: 'Cómo aplicarlo a tu marca:',
          content: '',
          gradient: 'from-pink-500 to-rose-500'
        },
        {
          type: 'list',
          items: [
            {
              title: 'Humaniza Tu Marca',
              description: 'Muestra al equipo detrás de la marca. "About Us" con fotos, behind-the-scenes, stories personales. La gente compra de gente, no de logos anónimos. Ejemplo: LUXMANIA muestra a Luis Virrueta, su filosofía, su enfoque. Eso genera simpatía.'
            },
            {
              title: 'Encuentra Puntos en Común',
              description: '"También odio las marcas genéricas", "Yo también empecé sin presupuesto para branding". Similitud genera simpatía. Habla el lenguaje de tu cliente ideal y comparte sus frustraciones.'
            },
            {
              title: 'Elogia Sinceramente',
              description: 'Reconoce logros de tus clientes. "Me encanta tu enfoque de negocio" o "Tu visión es única" no son ventas, son construcción de simpatía. Cuando pides la venta después, ya hay conexión emocional.'
            },
            {
              title: 'Diseño Atractivo',
              description: 'La estética importa. Un sitio web feo genera rechazo inconsciente. Un sitio hermoso genera simpatía instantánea. Invierte en diseño premium, es inversión en simpatía automática.'
            },
          ]
        },
        {
          type: 'heading',
          title: '6. Escasez: Queremos Lo Que Está Por Acabarse',
          icon: Zap
        },
        {
          type: 'text',
          content: 'El miedo a perder es más fuerte que el deseo de ganar. Cuando algo es escaso (tiempo limitado, stock limitado, acceso exclusivo), nuestro cerebro entra en modo urgencia. Las oportunidades parecen más valiosas cuando su disponibilidad disminuye. Este es el principio detrás de FOMO (Fear Of Missing Out).'
        },
        {
          type: 'subsection',
          number: '',
          title: 'Cómo aplicarlo a tu marca:',
          content: '',
          gradient: 'from-red-500 to-orange-500'
        },
        {
          type: 'list',
          items: [
            {
              title: 'Cupos Limitados (Real, No Fake)',
              description: '"Solo tomo 5 proyectos de branding al mes" es escasez legítima si es verdad. El cerebro valora más lo que no está disponible para todos. Ejemplo: Rolex manufactura deliberadamente menos relojes de los que podría. Escasez = deseo.'
            },
            {
              title: 'Deadlines Reales',
              description: '"Oferta termina en 48 horas" solo funciona si es real. Mentir destruye confianza. Pero deadlines legítimos (fin de mes, cierre de inscripciones, lanzamiento limitado) activan urgencia verdadera.'
            },
            {
              title: 'Exclusividad',
              description: '"Acceso solo para miembros", "Early access para suscriptores". La exclusividad es escasez social. No todos pueden tenerlo, lo que lo hace más valioso. Ejemplo: Tesla empezó con lista de espera. La espera aumentó el deseo.'
            },
            {
              title: 'Contenido que Desaparece',
              description: 'Stories de Instagram, ofertas flash, contenido temporal. El hecho de que no estará ahí mañana lo hace más valioso hoy.'
            },
          ]
        },
        {
          type: 'heading',
          title: 'Combinando las 6 Armas: El Sistema de Influencia',
          icon: Brain
        },
        {
          type: 'text',
          content: 'Las armas son más poderosas cuando se combinan estratégicamente. Analicemos un embudo de branding completo usando las 6:'
        },
        {
          type: 'list',
          items: [
            {
              title: 'Etapa 1: Atracción (Reciprocidad + Autoridad)',
              description: 'Ofreces contenido educativo gratuito (blog, ebook, webinar) que resuelve problemas reales. Estableces autoridad demostrando expertise. El cliente siente reciprocidad.'
            },
            {
              title: 'Etapa 2: Engagement (Simpatía + Prueba Social)',
              description: 'Compartes tu historia, humanizas la marca, muestras similitud con tu audiencia. Presentas testimonios y casos de éxito. La simpatía y prueba social construyen confianza.'
            },
            {
              title: 'Etapa 3: Conversión (Compromiso + Escasez)',
              description: 'Pides micro-compromisos (agendar llamada, completar cuestionario). Introduces escasez real (cupos limitados, fecha de cierre). El compromiso previo hace más fácil el sí final, y la escasez acelera la decisión.'
            },
          ]
        },
        {
          type: 'heading',
          title: 'Ética y Persuasión: La Línea que No Debes Cruzar',
          icon: Shield
        },
        {
          type: 'text',
          content: 'Cialdini es claro: estos principios son poderosos porque apelan a atajos mentales legítimos. La diferencia entre persuasión ética y manipulación es simple:'
        },
        {
          type: 'text',
          content: '**Persuasión Ética**: Usas estos principios para ayudar al cliente a tomar una decisión que genuinamente los beneficia. Si tu producto/servicio entrega valor real, facilitar esa decisión es ético.'
        },
        {
          type: 'text',
          content: '**Manipulación**: Usas estos principios para engañar al cliente para que compre algo que no necesita o que no funciona. Escasez falsa, testimonios inventados, autoridad mentirosa = destrucción de confianza a largo plazo.'
        },
        {
          type: 'text',
          content: 'En LUXMANIA creemos que el branding debe ser persuasivo, no manipulador. Si tu marca entrega valor real, estas armas simplemente eliminan fricción en el camino del cliente hacia lo que ya necesita.'
        },
        {
          type: 'conclusion',
          content: 'Las 6 Armas de la Persuasión no son trucos baratos, son principios psicológicos universales que gobiernan la toma de decisiones humana. Cuando tu branding integra estos principios conscientemente, no estás manipulando, estás comunicando de manera alineada con cómo funciona el cerebro. Reciprocidad construye buena voluntad. Compromiso genera momentum. Prueba social reduce riesgo percibido. Autoridad genera confianza. Simpatía crea conexión. Escasez activa decisión. Juntos, transforman tu marca de "otra opción más" a "la única opción lógica".'
        },
      ]
    },
    'paralisis-eleccion-simplifica-oferta': {
      title: 'La Parálisis de la Elección: Por Qué Tu Menú de 20 Servicios Está Matando Tus Ventas',
      author: 'Luis Virrueta',
      date: '10 Dic 2024',
      readTime: '14 min',
      category: 'Branding × Psicología',
      tags: ['Choice Paradox', 'Psychology', 'Conversion', 'Strategy'],
      gradient: 'from-sky-500 to-blue-500',
      sections: [
        {
          type: 'intro',
          content: 'En el año 2000, los psicólogos Sheena Iyengar y Mark Lepper realizaron un experimento en un supermercado que cambiaría para siempre nuestra comprensión del comportamiento del consumidor. Montaron dos mesas de degustación de mermeladas: una con 24 variedades, otra con solo 6. El resultado fue devastador para la lógica tradicional del marketing: la mesa con menos opciones generó 10 VECES más ventas. Bienvenido a la Paradoja de la Elección, el fenómeno psicológico que explica por qué tu menú infinito de servicios está saboteando tus conversiones.'
        },
        {
          type: 'heading',
          title: 'El Experimento que Rompió el Marketing Tradicional',
          icon: Brain
        },
        {
          type: 'text',
          content: 'Durante décadas, el dogma del marketing fue simple: más opciones = más clientes satisfechos = más ventas. Si un cliente quiere chocolate, ofrece 30 sabores de chocolate. Lógico, ¿no? Barry Schwartz, en su libro "The Paradox of Choice" (2004), demostró que esta lógica es completamente errónea.'
        },
        {
          type: 'text',
          content: 'El experimento de las mermeladas reveló algo aterrador:'
        },
        {
          type: 'colorGrid',
          colors: [
            { name: '24 Opciones', hex: '#EF4444', emotion: 'Resultado', brands: '60% se detuvo a probar. Solo 3% compró.' },
            { name: '6 Opciones', hex: '#10B981', emotion: 'Resultado', brands: '40% se detuvo a probar. 30% compró (10X más conversión).' },
          ]
        },
        {
          type: 'text',
          content: 'Más opciones atrajeron MÁS tráfico (60% vs 40%), pero generaron MENOS ventas. La abundancia de elección no empoderó a los consumidores, los paralizó. Este fenómeno se llama **Parálisis por Análisis** (Analysis Paralysis), y está matando tu negocio.'
        },
        {
          type: 'heading',
          title: 'Por Qué Demasiadas Opciones Destruyen Conversiones',
          icon: Zap
        },
        {
          type: 'text',
          content: 'La psicología detrás de la paradoja es triple:'
        },
        {
          type: 'subsection',
          number: '01',
          title: 'Sobrecarga Cognitiva',
          content: 'Nuestro cerebro tiene capacidad limitada de procesamiento. Comparar 3 opciones es fácil. Comparar 20 es agotador. Cuando el esfuerzo mental supera la motivación, el cerebro opta por la salida más fácil: NO decidir. El cliente cierra tu web y "lo piensa" (spoiler: nunca regresa).',
          gradient: 'from-red-500 to-rose-500'
        },
        {
          type: 'subsection',
          number: '02',
          title: 'Miedo a la Decisión Incorrecta',
          content: 'Más opciones = más probabilidad de elegir mal. Con 24 mermeladas, si eliges una y resulta mediocre, piensas "debí elegir otra". Con 6, si eliges mal, "solo había 6, mala suerte". Más opciones aumentan el arrepentimiento anticipado, lo que paraliza la decisión.',
          gradient: 'from-orange-500 to-amber-500'
        },
        {
          type: 'subsection',
          number: '03',
          title: 'Costo de Oportunidad Psicológico',
          content: 'Cada opción que NO eliges es una renuncia. Con 3 opciones, renuncias a 2. Con 30, renuncias a 29. El dolor de renunciar a 29 alternativas es 14 veces mayor. Resultado: no elegir ninguna elimina el dolor.',
          gradient: 'from-yellow-500 to-lime-500'
        },
        {
          type: 'heading',
          title: 'Marcas que Dominan con Menos Opciones',
          icon: Award
        },
        {
          type: 'text',
          content: 'Las marcas más exitosas del mundo entienden esto intuitivamente:'
        },
        {
          type: 'colorGrid',
          colors: [
            { name: 'Apple', hex: '#000000', emotion: 'Estrategia', brands: '3 modelos de iPhone (estándar, Pro, Pro Max). Punto. Antes tenían el SE, 5C, 5S, 6, 6 Plus... era un caos. Simplificaron, ventas explotaron.' },
            { name: 'In-N-Out Burger', hex: '#E31837', emotion: 'Estrategia', brands: 'Menú de 4 items: hamburguesa, cheeseburger, double-double, papas, bebidas. McDonalds tiene 145+ items y genera menos lealtad.' },
            { name: 'Netflix (pre-2015)', hex: '#E50914', emotion: 'Estrategia', brands: '1 plan, 1 precio. Hoy tienen 3 planes y la gente sufre eligiendo. Antes: "¿Quieres Netflix? $9.99". Conversión inmediata.' },
            { name: 'Tesla Model 3', hex: '#CC0000', emotion: 'Estrategia', brands: 'Al lanzamiento: 2 versiones (Standard, Long Range). BMW Serie 3 tiene 12 variantes. Adivina quién vende más rápido.' },
          ]
        },
        {
          type: 'heading',
          title: 'Cómo Simplificar Tu Oferta Sin Perder Ventas',
          icon: Sparkles
        },
        {
          type: 'text',
          content: 'La simplificación estratégica no significa perder ingresos. Significa maximizar conversiones eliminando fricción. Aquí está el sistema:'
        },
        {
          type: 'subsection',
          number: '',
          title: '1. La Regla del 3',
          content: 'El cerebro humano procesa eficientemente hasta 3 opciones. Más de eso, comienza la sobrecarga. Estructura tu oferta en máximo 3 niveles: Básico, Intermedio, Premium. O Bronce, Plata, Oro. O Esencial, Pro, Elite. Tres es el número mágico.',
          gradient: 'from-blue-500 to-cyan-500'
        },
        {
          type: 'list',
          items: [
            {
              title: 'Ejemplo LUXMANIA',
              description: 'En lugar de "Diseño de logo, Branding completo, Rediseño, Consultoría, Estrategia de marca, Manual de marca, Arquetipo, Paleta de colores, Tipografía..." (cliente: 😵), ofrece: "Identidad Esencial" (logo + colores básicos), "Identidad Completa" (sistema visual total), "Identidad Premium" (todo + estrategia + consultoría). Cliente: "Ah, quiero la Completa". Conversión.'
            },
          ]
        },
        {
          type: 'subsection',
          number: '',
          title: '2. Opción Recomendada Destacada',
          content: 'Cuando eliminar opciones no es posible, DIRIGE la elección. Marca una opción como "Más Popular", "Recomendado", o "Mejor Valor". El 80% de clientes indecisos elegirá esa. Reduces la carga cognitiva sin reducir opciones.',
          gradient: 'from-purple-500 to-fuchsia-500'
        },
        {
          type: 'list',
          items: [
            {
              title: 'Ejemplo Hosting',
              description: 'Bluehost tiene 4 planes. El plan "Choice Plus" tiene una etiqueta amarilla gigante: "MOST POPULAR". ¿Casualidad que es el más vendido? No. Es arquitectura de decisión.'
            },
          ]
        },
        {
          type: 'subsection',
          number: '',
          title: '3. Cuestionario de Pre-Filtrado',
          content: 'Si tu oferta es compleja, no muestres todas las opciones. Haz 3 preguntas que filtren al cliente hacia la opción correcta. "¿Eres startup o empresa establecida?" → "¿Necesitas logo o rediseño?" → "¿Cuál es tu presupuesto?". Basado en respuestas, MUESTRA solo 1-2 opciones relevantes.',
          gradient: 'from-pink-500 to-rose-500'
        },
        {
          type: 'list',
          items: [
            {
              title: 'Ejemplo E-commerce',
              description: 'Warby Parker (lentes) te hace quiz: forma de cara, estilo preferido, color. Resultado: 5 modelos recomendados en lugar de 200. Conversión disparada.'
            },
          ]
        },
        {
          type: 'subsection',
          number: '',
          title: '4. Bundles Estratégicos',
          content: 'En lugar de vender 15 servicios individuales ("¿quiero A? ¿o B? ¿o A+C? ¿o...?"), crea paquetes predefinidos. "Paquete Startup" (logo + web básica + redes), "Paquete Growth" (branding + web + estrategia), "Paquete Enterprise" (todo + mantenimiento). El cliente elige el paquete, no 15 items.',
          gradient: 'from-emerald-500 to-teal-500'
        },
        {
          type: 'heading',
          title: 'El Caso Contrario: Cuando Más Opciones Funcionan',
          icon: Eye
        },
        {
          type: 'text',
          content: 'La paradoja tiene excepciones. Más opciones funcionan cuando:'
        },
        {
          type: 'list',
          items: [
            {
              title: '1. El Cliente Ya Sabe Qué Quiere',
              description: 'Amazon tiene millones de productos porque el cliente llega buscando "Audífonos Sony WH-1000XM5". No está descubriendo, está comprando. Si tu cliente es experto y sabe exactamente qué necesita, variedad ayuda. Si está explorando, variedad paraliza.'
            },
            {
              title: '2. La Decisión No Es Importante',
              description: 'Elegir entre 50 tipos de clips en una papelería no paraliza porque el costo de equivocarse es $1. Elegir entre 20 planes de branding paraliza porque el costo de equivocarse es $5,000 y 3 meses. Regla: Decisiones de alto riesgo → menos opciones. Decisiones triviales → opciones infinitas OK.'
            },
            {
              title: '3. La Variedad ES el Producto',
              description: 'Baskin Robbins vende "31 sabores" como identidad de marca. La variedad es el diferenciador. Si tu marca promete personalización infinita, las opciones son el valor. Pero entonces necesitas filtros y recomendaciones AI para navegar esa variedad.'
            },
          ]
        },
        {
          type: 'heading',
          title: 'Cómo Auditar Tu Menú de Servicios Hoy',
          icon: Check
        },
        {
          type: 'text',
          content: 'Haz este ejercicio ahora mismo:'
        },
        {
          type: 'list',
          items: [
            {
              title: '1. Lista Todas Tus Opciones',
              description: 'Escribe literalmente cada servicio/producto/paquete que ofreces. Si tienes más de 5, continúa.'
            },
            {
              title: '2. Mide el Tiempo de Decisión',
              description: 'Pregunta a 3 amigos: "¿Qué comprarías de mi oferta?". Si tardan más de 30 segundos o preguntan "¿Cuál es la diferencia entre X y Y?", tienes problema de parálisis.'
            },
            {
              title: '3. Identifica el 80/20',
              description: 'El 80% de tus ingresos vienen del 20% de tus servicios. Identifica esos top performers. Considera eliminar o esconder el resto.'
            },
            {
              title: '4. Pregunta: "¿Esto Simplifica o Complica?"',
              description: 'Cada opción nueva debe pasar esta prueba. "Agregar este paquete ¿hace más fácil o más difícil que el cliente elija?" Si complica, no lo agregues.'
            },
            {
              title: '5. Rediseña en 3 Niveles',
              description: 'Toma todo tu menú y agrúpalo forzosamente en 3 opciones. Nómbralas claramente (no "Plan A, B, C" sino "Essentials, Professional, Enterprise"). Destaca la del medio como recomendada.'
            },
          ]
        },
        {
          type: 'heading',
          title: 'La Psicología del Precio y la Paradoja',
          icon: Zap
        },
        {
          type: 'text',
          content: 'Un insight adicional: la paradoja también aplica a rangos de precio. Estudios muestran que 3 opciones de precio funcionan mejor que 2 o 4+, PERO la estructura importa:'
        },
        {
          type: 'colorGrid',
          colors: [
            { name: 'Opción 1: Básica', hex: '#94A3B8', emotion: 'Precio bajo', brands: 'Ancla de precio bajo. Pocos la compran, pero hace ver la del medio como "buen valor". Ejemplo: $500' },
            { name: 'Opción 2: Recomendada', hex: '#3B82F6', emotion: 'Precio medio', brands: 'Aquí quieres que compren. Es "no muy cara, no muy barata". Goldilocks zone. La marcas como "POPULAR". Ejemplo: $1,500' },
            { name: 'Opción 3: Premium', hex: '#FBBF24', emotion: 'Precio alto', brands: 'Ancla de precio alto. Algunos la compran (bonus), pero principalmente hace ver la del medio como "razonable". Ejemplo: $5,000' },
          ]
        },
        {
          type: 'text',
          content: 'Esta estructura (bajo-medio-alto) con énfasis en el medio genera 60-70% más conversiones que mostrar solo 2 opciones o 5+ opciones. Es el sweet spot de decisión.'
        },
        {
          type: 'heading',
          title: 'El Menú Oculto: Personalización Sin Parálisis',
          icon: Sparkles
        },
        {
          type: 'text',
          content: 'La estrategia avanzada: ofrece 3 paquetes públicos, pero menciona "¿Necesitas algo diferente? Contáctanos para personalización". Esto da:'
        },
        {
          type: 'list',
          items: [
            {
              title: 'Ventaja 1: Decisión Fácil para el 90%',
              description: 'La mayoría elige uno de los 3 paquetes sin fricción. Conversión rápida.'
            },
            {
              title: 'Ventaja 2: Flexibilidad para el 10%',
              description: 'Clientes con necesidades únicas pueden contactar. Este segmento ya está comprometido (mandó mensaje), entonces la complejidad no los espanta.'
            },
            {
              title: 'Ventaja 3: Percepción de Personalización',
              description: 'El cliente siente que puede tener justo lo que necesita, pero sin ver un menú abrumador de 40 opciones en tu homepage.'
            },
          ]
        },
        {
          type: 'text',
          content: 'Ejemplo: Tesla muestra 2 modelos en su web (Model 3, Model Y). Pero si llamas o vas a showroom, puedes personalizar colores, interiores, tech packages. La complejidad existe, pero está OCULTA hasta que el cliente demuestra interés serio.'
        },
        {
          type: 'heading',
          title: 'Test A/B: Prueba la Simplificación',
          icon: Brain
        },
        {
          type: 'text',
          content: 'Si tienes tráfico suficiente, haz este experimento:'
        },
        {
          type: 'list',
          items: [
            {
              title: 'Versión A (Control)',
              description: 'Tu página actual con todas tus opciones/servicios/paquetes (digamos 8-12 opciones).'
            },
            {
              title: 'Versión B (Simplificada)',
              description: 'Misma página pero muestra solo 3 opciones (tus top 3 más vendidos o estratégicamente elegidos). El resto lo mueves a una página secundaria "Ver más opciones".'
            },
            {
              title: 'Métrica a Medir',
              description: 'Tasa de conversión (clicks en CTA, formularios completados, ventas cerradas). Apuesta: Versión B gana por 20-40%.'
            },
          ]
        },
        {
          type: 'text',
          content: 'Empresas que han hecho este test reportan consistentemente aumentos de conversión entre 15% y 300% (!). El caso extremo fue Procter & Gamble eliminando 25% de sus variantes de Head & Shoulders: ventas AUMENTARON 10% porque los clientes dejaron de confundirse.'
        },
        {
          type: 'conclusion',
          content: 'La Paradoja de la Elección no es una teoría, es un hecho psicológico comprobado en miles de estudios. Más opciones NO empoderan a tu cliente, lo paralizan. La abundancia de elección crea ansiedad, arrepentimiento anticipado y sobrecarga cognitiva. El resultado: el cliente no compra nada. Las marcas que dominan sus mercados lo entienden: Apple, Netflix, In-N-Out, Tesla, todos simplifican radicalmente sus ofertas. Tu misión no es darle al cliente "todas las opciones posibles". Tu misión es eliminar la fricción entre su necesidad y tu solución. Y la fricción más grande no es el precio, es la complejidad de decidir. Audita tu menú hoy. Si tienes más de 5 opciones sin una jerarquía clara, estás dejando dinero sobre la mesa. Simplifícalo a 3. Marca una como recomendada. Observa cómo tus conversiones se disparan. Porque en branding, como en las mermeladas, menos es exponencialmente más.'
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
  const { currentLanguage, t } = useLanguage()
  const heroRef = useRef(null)
  const isHeroInView = useInView(heroRef, { once: true, amount: 0.3 })

  // Intentar obtener artículo traducido, si no existe usar el código original
  const translatedArticle = getArticleContent(slug, currentLanguage)
  console.log('🌐 Language:', currentLanguage, '| Slug:', slug, '| Found translation:', !!translatedArticle)
  const article = translatedArticle || getArticleBySlug(slug)

  if (!article) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-black via-zinc-950 to-black pt-28 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-4xl font-bold text-white mb-4">{t('blogArticles.common.notFound')}</h1>
          <Link to="/blog" className="text-cyan-400 hover:text-cyan-300">
            {t('blogArticles.common.backToBlog')}
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
              <span className="text-sm">{t('blogArticles.common.backToBlog')}</span>
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
              {t('blogArticles.common.share')}
            </button>
            <button className="px-4 py-2 bg-white/10 hover:bg-white/20 border border-white/20 rounded-full text-white text-sm flex items-center gap-2 transition-all">
              <BookmarkPlus className="w-4 h-4" />
              {t('blogArticles.common.save')}
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
                {t('blogArticles.common.readyForProject')}
              </h3>
              <p className="text-lg text-white/70 mb-8 max-w-2xl mx-auto">
                {t('blogArticles.common.applyPrinciples')}
              </p>
              <Link
                to="/contacto"
                className="inline-block px-8 py-4 bg-gradient-to-r from-pink-500 to-rose-500 text-white font-medium rounded-full hover:shadow-lg hover:shadow-pink-500/50 transition-all duration-300"
              >
                {t('blogArticles.common.startProject')}
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
