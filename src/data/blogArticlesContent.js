import { Brain, Zap, Sparkles, Award, Check, Shield, Eye } from 'lucide-react'

// Contenido completo de todos los artículos del blog en ES + EN
// Este archivo centraliza el contenido para facilitar mantenimiento y traducciones
export const getArticleContent = (slug, language = 'es') => {
  const content = blogArticlesContent[language]?.[slug]
  if (!content) {
    console.warn(`Article content not found for slug: ${slug}, language: ${language}`)
    return blogArticlesContent['es'][slug] || null // Fallback to Spanish
  }
  return content
}

const blogArticlesContent = {
  es: {
    // Artículo 1
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
    
    // Artículo 2
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
    }
  },
  
  en: {
    // Article 1
    'neurociencia-del-diseno': {
      title: 'Design Neuroscience: Why Some Logos Are Unforgettable',
      author: 'Luis Virrueta',
      date: 'Dec 6, 2025',
      readTime: '12 min',
      category: 'Psychology',
      tags: ['Neuroscience', 'Logo Design', 'Brand Recognition', 'Psychology'],
      gradient: 'from-pink-500 to-rose-500',
      sections: [
        {
          type: 'intro',
          content: 'In the world of branding, some logos transcend their basic identification function to become unforgettable cultural symbols. What makes us instantly recognize Nike\'s swoosh, Apple\'s apple, or McDonald\'s golden arches? The answer lies in design neuroscience.'
        },
        {
          type: 'heading',
          title: 'The Brain and Visual Recognition',
          icon: Brain
        },
        {
          type: 'text',
          content: 'Our brain processes images 60,000 times faster than text. The visual cortex, which represents approximately 30% of our cerebral cortex, is optimized to detect patterns, shapes, and colors instantly. Successful logos leverage this innate capability.'
        },
        {
          type: 'highlight',
          content: '"An effective logo must be processed by the brain in less than 400 milliseconds to create a memorable impact."',
          author: 'Visual Neuroimaging Studies'
        },
        {
          type: 'heading',
          title: 'The Three Neurological Pillars of the Perfect Logo',
          icon: Sparkles
        },
        {
          type: 'subsection',
          number: '01',
          title: 'Cognitive Simplicity',
          content: 'The human brain prefers simple shapes because they require less energy to process. The most memorable logos use between 1-3 key visual elements. This cognitive economy allows the brain to store and retrieve visual information more efficiently.',
          gradient: 'from-purple-500 to-fuchsia-500'
        },
        {
          type: 'subsection',
          number: '02',
          title: 'Emotional Activation',
          content: 'The amygdala, our emotional center, activates when we see logos we associate with positive experiences. Colors, curved vs angular shapes, and symmetry trigger specific emotional responses that are etched into our long-term memory.',
          gradient: 'from-cyan-500 to-blue-500'
        },
        {
          type: 'subsection',
          number: '03',
          title: 'Semantic Connection',
          content: 'The most powerful logos create bridges between the visual image and the brand concept in the hippocampus. This brain region, responsible for associative memory, links the symbol with meanings, values, and experiences, creating a robust neural network.',
          gradient: 'from-emerald-500 to-teal-500'
        },
        {
          type: 'heading',
          title: 'The Role of Color in Visual Memory',
          icon: Zap
        },
        {
          type: 'text',
          content: 'Colors activate different areas of the brain and generate measurable physiological responses. Red increases heart rate and creates urgency, blue reduces stress and conveys trust, while yellow stimulates dopamine and generates optimism.'
        },
        {
          type: 'colorGrid',
          colors: [
            { name: 'Red', hex: '#EF4444', emotion: 'Passion, Urgency, Energy', brands: 'Coca-Cola, Netflix, YouTube' },
            { name: 'Blue', hex: '#3B82F6', emotion: 'Trust, Calm, Professionalism', brands: 'Facebook, IBM, Samsung' },
            { name: 'Yellow', hex: '#FBBF24', emotion: 'Optimism, Creativity, Attention', brands: 'McDonald\'s, IKEA, Snapchat' },
            { name: 'Green', hex: '#10B981', emotion: 'Growth, Health, Nature', brands: 'Starbucks, Spotify, WhatsApp' },
          ]
        },
        {
          type: 'heading',
          title: 'Applying Neuroscience to Your Brand',
          icon: Eye
        },
        {
          type: 'list',
          items: [
            {
              title: '3-Second Test',
              description: 'Your logo should be recognizable in 3 seconds or less. If it takes longer, simplify.'
            },
            {
              title: 'Visual Consistency',
              description: 'Use the logo consistently across all touchpoints to strengthen neural connections.'
            },
            {
              title: 'Emotional Testing',
              description: 'Conduct A/B testing measuring emotional responses (microexpressions, pupil dilation) to different versions.'
            },
            {
              title: 'Long-Term Memory',
              description: 'Repeat logo exposure in positive contexts to create lasting associations in the hippocampus.'
            },
          ]
        },
        {
          type: 'conclusion',
          content: 'Design neuroscience reveals that creating a memorable logo is not art or magic, but applied science. By understanding how the brain processes, stores, and retrieves visual information, we can design symbols that not only look good, but are deeply engraved in our audience\'s minds.'
        },
      ]
    },
    
    // Article 2
    'ia-generativa-diseno-emocion': {
      title: 'Generative AI in Design: From Prompt to Emotion',
      author: 'Luis Virrueta',
      date: 'Dec 5, 2025',
      readTime: '14 min',
      category: 'Technology × Design',
      tags: ['AI', 'Generative Design', 'Emotional Design', 'Psychology'],
      gradient: 'from-purple-500 to-fuchsia-500',
      sections: [
        {
          type: 'intro',
          content: 'Generative artificial intelligence is revolutionizing graphic design, but the real magic happens when we understand the psychology behind each generated pixel. It\'s not just about creating beautiful images, but designing experiences that resonate emotionally with your audience.'
        },
        {
          type: 'heading',
          title: 'The Convergence of Three Worlds',
          icon: Sparkles
        },
        {
          type: 'text',
          content: 'We are witnessing a historic moment where AI technology, design principles, and psychological understanding of the user merge to create something completely new: generative design with emotional intelligence.'
        },
        {
          type: 'subsection',
          number: '01',
          title: 'Psychology of Prompt Engineering',
          content: 'Writing effective prompts requires understanding how AI interprets emotional language. Words like "cozy," "dynamic," or "sophisticated" activate different neural networks in models, generating results that evoke specific emotions in the observer.',
          gradient: 'from-purple-500 to-fuchsia-500'
        },
        {
          type: 'subsection',
          number: '02',
          title: 'Emotional Adaptive Design',
          content: 'Generative AIs can analyze emotional responses in real-time and adapt the design. This creates a feedback loop where design evolves based on psychological metrics like engagement, attention time, and emotional response.',
          gradient: 'from-cyan-500 to-blue-500'
        },
        {
          type: 'subsection',
          number: '03',
          title: 'Ethics of Automated Design',
          content: 'With great power comes great responsibility. We must consider the ethical implications of designs that can manipulate emotions. Transparency about AI use and respect for the user\'s emotional autonomy are fundamental.',
          gradient: 'from-emerald-500 to-teal-500'
        },
        {
          type: 'heading',
          title: 'Psych × Design × AI Workflow',
          icon: Brain
        },
        {
          type: 'list',
          items: [
            {
              title: 'Define the Target Emotion',
              description: 'Before writing a prompt, identify what specific emotion you want to evoke: trust, excitement, nostalgia, aspiration.'
            },
            {
              title: 'Psychologically Informed Prompt',
              description: 'Use language that combines visual elements with emotional states: "minimalist logo that conveys security and professionalism".'
            },
            {
              title: 'Iteration with Emotional A/B Testing',
              description: 'Use eye-tracking tools and microexpression analysis to validate if the design generates the desired emotion.'
            },
            {
              title: 'Human-in-the-Loop Refinement',
              description: 'AI proposes, human designer refines with cultural and emotional sensitivity that machines don\'t yet possess.'
            },
          ]
        },
        {
          type: 'conclusion',
          content: 'Generative AI doesn\'t replace the designer, it empowers them. By combining cutting-edge technology, timeless design principles, and deep psychological understanding, we create visual experiences that not only look incredible, but genuinely connect with people.'
        },
      ]
    }
  }
}

export default blogArticlesContent
