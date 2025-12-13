import { motion } from 'framer-motion'
import { useState } from 'react'
import { MessageCircle, Heart, Reply, MoreHorizontal } from 'lucide-react'

// Comentarios específicos por artículo (MIXTOS: Español + Inglés)
const articleComments = {
  'rebranding-vs-refresh-cuando-redisenar-marca-completa': [
    {
      id: 1,
      author: 'Andrea Morales',
      avatar: 'AM',
      date: 'Hace 2 horas',
      comment: 'El test de 10 preguntas me salvó de cometer un error de $500K. Respondí 3 "SÍ" = NO necesitaba rebranding completo. Solo refresh. Contraté agencia que insistía en rebranding total. Ahora sé que solo querían facturar más.',
      likes: 118,
      gradient: 'from-emerald-600 to-teal-500'
    },
    {
      id: 2,
      author: 'James Rodriguez',
      avatar: 'JR',
      date: '4 hours ago',
      comment: 'The GAP disaster case (reverted in 6 days, $100M loss) should be taught in every business school. "CEO is bored of current logo" is NOT a valid reason for rebranding. Data-driven decisions save millions.',
      likes: 106,
      gradient: 'from-blue-500 to-cyan-600'
    },
    {
      id: 3,
      author: 'Claudia Fernández',
      avatar: 'CF',
      date: 'Hace 5 horas',
      comment: 'Airbnb vs Mastercard comparison es PERFECTA. Airbnb necesitaba rebranding (cambio de posicionamiento fundamental). Mastercard necesitaba refresh (misma esencia, ejecución moderna). Ambos exitosos porque eligieron correcto. La diferencia es clara.',
      likes: 94,
      gradient: 'from-pink-500 to-rose-600'
    },
    {
      id: 4,
      author: 'Michael Thompson',
      avatar: 'MT',
      date: '8 hours ago',
      comment: 'The "3-5x cost multiplier" stat (rebranding vs refresh for same result) is brutal. We did refresh instead of full rebrand - $80K vs $400K quoted by agencies. Result: customers love it, sales +23%, brand recognition maintained. Smart decision.',
      likes: 89,
      gradient: 'from-orange-500 to-amber-600'
    },
    {
      id: 5,
      author: 'Isabella Romano',
      avatar: 'IR',
      date: 'Hace 10 horas',
      comment: 'Tropicana perdió 20% ventas ($30M) en 2 meses por reemplazar packaging icónico con diseño "premium" genérico. La lección: si tu packaging ES tu brand equity, refresh NO reemplaces. Solo moderniza lo que ya funciona.',
      likes: 82,
      gradient: 'from-green-500 to-emerald-600'
    },
    {
      id: 6,
      author: 'David Chen',
      avatar: 'DC',
      date: '1 day ago',
      comment: 'The 4-week refresh process vs 8-12 week rebranding timeline is super practical. We followed refresh roadmap exactly: week 1 audit, week 2 exploration, week 3 testing, week 4 implementation. Launched on schedule, zero issues.',
      likes: 77,
      gradient: 'from-indigo-600 to-purple-600'
    },
    {
      id: 7,
      author: 'Sofía Vargas',
      avatar: 'SV',
      date: 'Hace 1 día',
      comment: 'Las 5 reglas de oro del refresh exitoso (mantén signature intocable, evolución gradual, test antes de lanzar) son oro puro. Aplicamos todas y nuestro refresh fue invisible para 80% de audiencia pero 100% sienten que somos más modernos. Perfecto.',
      likes: 71,
      gradient: 'from-violet-500 to-fuchsia-600'
    },
    {
      id: 8,
      author: 'Alex Martinez',
      avatar: 'AM',
      date: '2 days ago',
      comment: 'Red flags section is crucial. "CEO is bored of logo" + "no budget for testing" + "launch everything same day" = recipe for disaster. If you see these signs, STOP the project immediately. Save your equity.',
      likes: 68,
      gradient: 'from-red-600 to-rose-600'
    }
  ],

  'branding-con-inteligencia-artificial-2025-guia-completa': [
    {
      id: 1,
      author: 'Diego Martínez',
      avatar: 'DM',
      date: 'Hace 1 hora',
      comment: 'Seguí el workflow completo de "Lumina Coffee" paso a paso. 8 horas después tengo identidad visual COMPLETA: logo, paleta, packaging mockups, Instagram templates. Costo total: $0 (planes que ya tenía). Esto es absolutamente revolucionario.',
      likes: 127,
      gradient: 'from-purple-600 to-fuchsia-500'
    },
    {
      id: 2,
      author: 'Sarah Williams',
      avatar: 'SW',
      date: '3 hours ago',
      comment: 'The "83% looks generic" stat hit HARD. I was exactly that person - beautiful Midjourney renders with zero strategy. Started over with Claude defining archetype FIRST, then Midjourney execution. Night and day difference.',
      likes: 104,
      gradient: 'from-blue-500 to-cyan-600'
    },
    {
      id: 3,
      author: 'Patricia Herrera',
      avatar: 'PH',
      date: 'Hace 4 horas',
      comment: 'El framework de 2 semanas (Semana 1 = estrategia 100% humana, Semana 2 = ejecución IA) es CLAVE. Antes saltaba directo a generar y todo lucía algorítmico. Ahora hago research + arquetipo primero. Mis clientes no pueden creer que es "hecho con IA".',
      likes: 98,
      gradient: 'from-pink-500 to-rose-600'
    },
    {
      id: 4,
      author: 'Marcus Chen',
      avatar: 'MC',
      date: '6 hours ago',
      comment: 'The Midjourney --sref trick for consistency is GOLD. Was generating 50 different styles and wondering why my brand looked schizophrenic. Now I generate 1 perfect image, copy sref code, use it everywhere. Brand coherence = 9/10.',
      likes: 91,
      gradient: 'from-orange-500 to-amber-600'
    },
    {
      id: 5,
      author: 'Lucía Fernández',
      avatar: 'LF',
      date: 'Hace 8 horas',
      comment: 'Error #3 (prompts genéricos) era exactamente mi problema. "Modern tech logo" → hexágono genérico #4,821. Ahora hago prompts de 100 palabras: arquetipo + emoción + estilo + referencias + QUÉ EVITAR. Resultados 10x mejores.',
      likes: 87,
      gradient: 'from-green-500 to-emerald-600'
    },
    {
      id: 6,
      author: 'Thomas Anderson',
      avatar: 'TA',
      date: '12 hours ago',
      comment: 'Stack tech recommendation ($115-160/mo vs $15K agency) is insane ROI. Subscribed to all: Perplexity, Claude Pro, Midjourney Standard, Ideogram, Runway, ElevenLabs. Created 3 client brands this month. Already paid for itself 20x over.',
      likes: 82,
      gradient: 'from-indigo-600 to-purple-600'
    },
    {
      id: 7,
      author: 'Valentina Rossi',
      avatar: 'VR',
      date: 'Hace 1 día',
      comment: 'El caso de Lumina Coffee con timeline exacto (30 min research, 45 min strategy, 2h moodboard...) es perfecto como blueprint. Lo usé para marca de yoga y funcionó IDÉNTICO. El proceso es replicable si sigues la estrategia.',
      likes: 76,
      gradient: 'from-violet-500 to-pink-600'
    },
    {
      id: 8,
      author: 'Alex Rivera',
      avatar: 'AR',
      date: '1 day ago',
      comment: 'The 2026 predictions (AI agents for end-to-end branding, real-time consistency enforcement) are coming FAST. Already seeing prototypes. This article is not just "current state" - it\'s preparing you for what\'s 6 months away. Essential reading.',
      likes: 73,
      gradient: 'from-cyan-500 to-blue-600'
    }
  ],

  'por-que-tu-logo-no-funciona-7-errores-neurociencia': [
    {
      id: 1,
      author: 'Carlos Ruiz',
      avatar: 'CR',
      date: 'Hace 2 horas',
      comment: 'Me destruiste. Mi logo tiene 5 colores + script complicado + gradiente + 8 elementos. Hice el test de 3 segundos con mi equipo: 0 de 10 lo reconocieron. Rediseño urgente incoming.',
      likes: 91,
      gradient: 'from-red-600 to-rose-500'
    },
    {
      id: 2,
      author: 'Emily Watson',
      avatar: 'EW',
      date: '4 hours ago',
      comment: 'The Instagram case study (12+ elements → 3 elements = 81% improvement in recognition) is mind-blowing. Applied the Rule of 3 to my startup logo. Went from complex tech geometric mess to clean icon. Night and day.',
      likes: 79,
      gradient: 'from-blue-500 to-indigo-600'
    },
    {
      id: 3,
      author: 'María González',
      avatar: 'MG',
      date: 'Hace 5 horas',
      comment: 'Error #2 (colores sin estrategia) es exactamente mi problema. Soy psicóloga y usé verde porque "calma". TODO el sector usa verde. Cero diferenciación. Gracias al análisis cromático cambié a púrpura (creatividad + confianza). Único en mi ciudad.',
      likes: 76,
      gradient: 'from-purple-500 to-pink-600'
    },
    {
      id: 4,
      author: 'James Mitchell',
      avatar: 'JM',
      date: '8 hours ago',
      comment: 'The FedEx case study (hidden arrow + B&W perfection) should be taught in every design school. Tested my logo in B&W - completely fell apart. Redesigned with tonal contrast >70%. Now works in embroidery, photocopies, everything.',
      likes: 68,
      gradient: 'from-orange-500 to-yellow-600'
    },
    {
      id: 5,
      author: 'Laura Fernández',
      avatar: 'LF',
      date: 'Hace 10 horas',
      comment: 'La checklist definitiva de 10 puntos es BRUTAL. Mi logo falló en 7/10 tests. Especialmente el test de favicon (ilegible) y el de metáfora (gimnasio con mancuerna literal). Ya contraté diseñador con tu artículo como brief.',
      likes: 64,
      gradient: 'from-green-500 to-emerald-600'
    },
    {
      id: 6,
      author: 'Thomas Schneider',
      avatar: 'TS',
      date: '1 day ago',
      comment: 'Error #4 (sin diferenciación) hit me hard. Put my law firm logo next to 5 competitors - IDENTICAL scales of justice + serif + blue/gray. Generic #427. Switching to abstract concept (shield + modern sans). Finally unique.',
      likes: 57,
      gradient: 'from-cyan-500 to-blue-600'
    },
    {
      id: 7,
      author: 'Valentina Torres',
      avatar: 'VT',
      date: 'Hace 1 día',
      comment: 'El caso Nike vs Puma (abstracción vs literalismo) explica perfectamente por qué swoosh es icónico y puma es... un puma. Mi marca de ropa deportiva tenía corredor literal. Cambié a concepto abstracto de movimiento. Mucho más flexible y memorable.',
      likes: 53,
      gradient: 'from-pink-500 to-red-600'
    },
    {
      id: 8,
      author: 'Ryan Cooper',
      avatar: 'RC',
      date: '2 days ago',
      comment: 'The neuroscience breakdown (400ms processing time, 7±2 chunks, working memory limits) makes this article SCIENTIFIC, not subjective. Did the 3-second test with 30 people - 4/30 recognized my logo. Ouch. Data doesn\'t lie.',
      likes: 49,
      gradient: 'from-indigo-600 to-purple-600'
    }
  ],

  '12-arquetipos-jung-branding-cual-elegir-marca': [
    {
      id: 1,
      author: 'Sofía Mendoza',
      avatar: 'SM',
      date: 'Hace 3 horas',
      comment: 'WOW. Llevaba 2 años sin entender POR QUÉ mi branding no conectaba. Soy fotógrafa y me di cuenta que intentaba ser Gobernante (exclusiva, cara) cuando mi esencia real es Creador. Game changer total.',
      likes: 83,
      gradient: 'from-amber-600 to-orange-500'
    },
    {
      id: 2,
      author: 'Michael Chen',
      avatar: 'MC',
      date: '5 hours ago',
      comment: 'The case study breakdown of Apple evolving from Rebel (1984) to Magician (2001+) is fascinating. Shows archetypes can evolve but need DECADES of consistency first. This article is a masterclass.',
      likes: 71,
      gradient: 'from-blue-500 to-cyan-500'
    },
    {
      id: 3,
      author: 'Isabella Romano',
      avatar: 'IR',
      date: 'Hace 6 horas',
      comment: 'El framework LUXMANIA de Color + Tipografía + Tono de Voz + Motion Graphics por arquetipo es oro puro. Ya rediseñé toda mi marca de cafetería siguiendo el arquetipo Inocente. Clientes dicen "se siente más auténtica".',
      likes: 68,
      gradient: 'from-pink-500 to-rose-600'
    },
    {
      id: 4,
      author: 'David Thompson',
      avatar: 'DT',
      date: '12 hours ago',
      comment: 'I\'m a brand strategist and have read DOZENS of archetype articles. This is the ONLY one that combines Jung theory + practical design implementation + real brand examples. The 4-week roadmap is actionable gold.',
      likes: 64,
      gradient: 'from-purple-600 to-indigo-600'
    },
    {
      id: 5,
      author: 'Ana Martínez',
      avatar: 'AM',
      date: 'Hace 1 día',
      comment: 'Error #1 (mezclar arquetipos incompatibles) explica TODO lo que estaba haciendo mal. Intentaba ser Héroe + Cuidador al mismo tiempo. Ahora soy 100% Cuidador y mis ventas de terapia aumentaron 40% en 2 meses.',
      likes: 59,
      gradient: 'from-green-500 to-emerald-600'
    },
    {
      id: 6,
      author: 'Lucas Silva',
      avatar: 'LS',
      date: 'Hace 1 día',
      comment: 'Los 12 arquetipos con paleta + tipografía + casos reales (Nike, Patagonia, Disney, Harley) es una educación completa de branding. Guardé este artículo como Biblia. Volveré cada vez que diseñe marca.',
      likes: 52,
      gradient: 'from-red-500 to-orange-600'
    },
    {
      id: 7,
      author: 'Emma Lindström',
      avatar: 'EL',
      date: '2 days ago',
      comment: 'The Patagonia case study (Explorer archetype + environmental consciousness) shows how authenticity = loyalty. "Don\'t Buy This Jacket" campaign is coherence at its peak. Inspiring for my sustainable brand.',
      likes: 48,
      gradient: 'from-teal-500 to-cyan-600'
    },
    {
      id: 8,
      author: 'Roberto Gómez',
      avatar: 'RG',
      date: 'Hace 2 días',
      comment: 'El análisis de Old Spice transformándose de marca de abuelos a Bufón millennial (+125% ventas en 1 año) demuestra el PODER de elegir el arquetipo correcto. Brutal caso de rebranding.',
      likes: 41,
      gradient: 'from-yellow-500 to-amber-600'
    }
  ],
  'mapa-completo-inteligencias-artificiales-2025-cual-usar': [
    {
      id: 1,
      author: 'Alejandro Torres',
      avatar: 'AT',
      date: 'Hace 2 horas',
      comment: 'Este es EL artículo sobre IAs que necesitaba. Cubrir 47 IAs organizadas por psicología de decisión en lugar de specs técnicas es GENIAL. La tabla comparativa de precios me ahorró semanas de research.',
      likes: 67,
      gradient: 'from-purple-600 to-pink-500'
    },
    {
      id: 2,
      author: 'Jessica Morgan',
      avatar: 'JM',
      date: '4 hours ago',
      comment: 'The "4 Essential Stacks" section is pure gold. I\'m a content creator and the Creator Stack (ChatGPT + Pika + DALL-E + ElevenLabs = $66/mo) is exactly what I needed. Already implemented.',
      likes: 59,
      gradient: 'from-cyan-500 to-blue-500'
    },
    {
      id: 3,
      author: 'Daniel Kovacs',
      avatar: 'DK',
      date: 'Hace 8 horas',
      comment: 'Como desarrollador, el Technical Stack (DeepSeek FREE + Claude Pro $20 + Stable Diffusion FREE = $20/mo) es perfecto. DeepSeek para código, Claude para arquitectura. Brillante.',
      likes: 52,
      gradient: 'from-emerald-500 to-teal-500'
    },
    {
      id: 4,
      author: 'Martina Rossi',
      avatar: 'MR',
      date: '1 day ago',
      comment: 'The psychological framework explaining Choice Overload, Zero-Price Effect, Social Proof and Identity Coherence is mind-blowing. Now I understand WHY I choose ChatGPT over objectively better free options.',
      likes: 48,
      gradient: 'from-violet-500 to-indigo-500'
    },
    {
      id: 5,
      author: 'Carlos Gutiérrez',
      avatar: 'CG',
      date: 'Hace 1 día',
      comment: 'La sección de casos de uso por industria (E-commerce, Agencias, Developers, Creators) me salvó. Soy community manager y el stack de Grok + Perplexity + ChatGPT está funcionando perfecto.',
      likes: 41,
      gradient: 'from-amber-500 to-orange-500'
    },
    {
      id: 6,
      author: 'Sophie Chen',
      avatar: 'SC',
      date: '2 days ago',
      comment: 'Finally someone explains video AIs properly! Sora vs Runway vs Pika vs HeyGen comparison is exactly what I needed. Started with Pika Pro for speed and it\'s amazing.',
      likes: 37,
      gradient: 'from-rose-500 to-pink-500'
    }
  ],
  'cloudflare-infraestructura-invisible-que-hace-tu-web-premium': [
    {
      id: 1,
      author: 'Diego Martínez',
      avatar: 'DM',
      date: 'Hace 3 horas',
      comment: 'Finalmente entendí qué es Cloudflare gracias a este artículo. Siempre me preguntaba por qué era gratis y cómo ganaban dinero. La explicación de la CDN es súper clara.',
      likes: 12,
      gradient: 'from-orange-500 to-amber-500'
    },
    {
      id: 2,
      author: 'Sarah Mitchell',
      avatar: 'SM',
      date: '5 hours ago',
      comment: 'Best explanation of Cloudflare I\'ve ever read. Implemented it on my e-commerce site and load times dropped from 3.2s to 0.8s. This should be mandatory for everyone.',
      likes: 28,
      gradient: 'from-cyan-500 to-blue-500'
    },
    {
      id: 3,
      author: 'Patricia Ruiz',
      avatar: 'PR',
      date: 'Hace 1 día',
      comment: 'La diferencia en mi sitio fue BRUTAL después de implementar Cloudflare. Ahora carga en menos de 1 segundo desde cualquier país. Increíble.',
      likes: 19,
      gradient: 'from-violet-500 to-indigo-500'
    }
  ],
  'tu-cerebro-no-busca-informacion-busca-sorpresa-minima-andy-clark': [
    {
      id: 1,
      author: 'Dr. Fernando Lagos',
      avatar: 'FL',
      date: 'Hace 1 día',
      comment: 'Como neurocientífico, confirmo que la teoría predictiva de Andy Clark es lo más revolucionario en décadas. Pero aplicarla a branding así es GENIAL. Nunca había visto este puente entre neurociencia y diseño.',
      likes: 45,
      gradient: 'from-violet-500 to-indigo-500'
    },
    {
      id: 2,
      author: 'Emma Thompson',
      avatar: 'ET',
      date: '1 day ago',
      comment: 'The Free Energy Principle applied to marketing is the smartest thing I\'ve read in years. Bought Andy Clark\'s book immediately after reading this. Mind = blown.',
      likes: 39,
      gradient: 'from-purple-500 to-fuchsia-500'
    },
    {
      id: 3,
      author: 'Camila Vega',
      avatar: 'CV',
      date: 'Hace 2 días',
      comment: 'Eso de la "sorpresa óptima 15-25%" me voló la cabeza. Ahora entiendo por qué mi rebranding fracasó: era demasiado radical. El cerebro lo rechazó porque generaba mucho error predictivo.',
      likes: 37,
      gradient: 'from-rose-500 to-pink-500'
    },
    {
      id: 4,
      author: 'James Wu',
      avatar: 'JW',
      date: '2 days ago',
      comment: 'As a UX designer, this changes everything. We\'ve been competing for attention when we should be competing to become the brain\'s default prediction. Revolutionary.',
      likes: 31,
      gradient: 'from-emerald-500 to-teal-500'
    }
  ],
  'tu-cerebro-decide-antes-que-tu-experimento-libet': [
    {
      id: 1,
      author: 'Ana Beltrán',
      avatar: 'AB',
      date: 'Hace 1 semana',
      comment: 'El experimento de Libet me dejó en shock. Literalmente mi cerebro decide 300ms ANTES de que yo "sienta" que decidí. Esto cambia todo en cómo hacer marketing.',
      likes: 42,
      gradient: 'from-rose-500 to-pink-500'
    },
    {
      id: 2,
      author: 'Michael Chen',
      avatar: 'MC',
      date: '1 week ago',
      comment: 'If 95% of decisions are unconscious, why do we keep making rational campaigns full of features and specs? This article should be required reading in every agency.',
      likes: 38,
      gradient: 'from-amber-500 to-orange-500'
    },
    {
      id: 3,
      author: 'Miguel Herrera',
      avatar: 'MH',
      date: 'Hace 1 semana',
      comment: 'Implementé diseños basados en decisiones inconscientes y las conversiones subieron 34% en 6 semanas. Libet tenía razón: el inconsciente decide primero.',
      likes: 29,
      gradient: 'from-cyan-500 to-blue-500'
    }
  ],
  'inteligencia-no-acumula-reorganiza-neurociencia-branding': [
    {
      id: 1,
      author: 'Sofía Morales',
      avatar: 'SM',
      date: 'Hace 2 semanas',
      comment: 'La conexión entre neuroplasticidad de Hebb y redes neuronales de IA es fascinante. Nunca había pensado que "las marcas memorables reorganizan, no acumulan". Me cambió la perspectiva total.',
      likes: 34,
      gradient: 'from-cyan-500 to-blue-500'
    },
    {
      id: 2,
      author: 'Dr. Rebecca Foster',
      avatar: 'RF',
      date: '2 weeks ago',
      comment: 'As a cognitive neuroscientist, I can confirm: Hebbian plasticity ("neurons that fire together, wire together") is exactly how memorable brands work. Brilliant application.',
      likes: 31,
      gradient: 'from-indigo-500 to-purple-500'
    },
    {
      id: 3,
      author: 'Eduardo Ramírez',
      avatar: 'ER',
      date: 'Hace 2 semanas',
      comment: 'Como desarrollador de IA, ver la comparación entre backpropagation de Hinton y cómo deberíamos diseñar marcas es brillante. Ambos sistemas aprenden reorganizando conexiones.',
      likes: 27,
      gradient: 'from-violet-500 to-fuchsia-500'
    }
  ],
  'que-ia-contratar-2025-comparativa-completa': [
    {
      id: 1,
      author: 'Laura Jiménez',
      avatar: 'LJ',
      date: 'Hace 3 semanas',
      comment: 'FINALMENTE una comparativa honesta de IAs sin hype. Yo uso ChatGPT para copy y Gemini para research. Cada una tiene su lugar. La tabla comparativa es oro puro.',
      likes: 51,
      gradient: 'from-indigo-500 to-purple-500'
    },
    {
      id: 2,
      author: 'David Park',
      avatar: 'DP',
      date: '3 weeks ago',
      comment: 'Got ChatGPT Plus and Claude Pro after reading this. The explanation of when to use each one based on use case saved me months of trial and error. Worth every penny.',
      likes: 43,
      gradient: 'from-emerald-500 to-teal-500'
    },
    {
      id: 3,
      author: 'Carlos Mendoza',
      avatar: 'CM',
      date: 'Hace 3 semanas',
      comment: 'Contraté ChatGPT Plus y Claude Pro después de leer esto. La explicación de cuándo usar cada uno según el caso de uso es exactamente lo que necesitaba.',
      likes: 38,
      gradient: 'from-cyan-500 to-blue-500'
    },
    {
      id: 4,
      author: 'Sophie Laurent',
      avatar: 'SL',
      date: '3 weeks ago',
      comment: 'Grok\'s real-time access to X data is incredible for trend analysis. Didn\'t know about this before. Changed my social media strategy completely.',
      likes: 27,
      gradient: 'from-violet-500 to-fuchsia-500'
    }
  ],
  'cliente-heroe-storybrand-framework': [
    {
      id: 1,
      author: 'Gabriela Navarro',
      avatar: 'GN',
      date: 'Hace 3 días',
      comment: 'El framework de Donald Miller cambió mi negocio. Dejé de hablar de "nosotros somos los mejores" y empecé a posicionar al cliente como el héroe. Las conversiones subieron 34% en 2 meses.',
      likes: 39,
      gradient: 'from-amber-500 to-orange-500'
    },
    {
      id: 2,
      author: 'Tom Harrison',
      avatar: 'TH',
      date: '3 days ago',
      comment: 'The Hero + Problem + Guide + Plan + Call to Action structure is perfect. Applied it to my landing page and bounce rate dropped from 68% to 23%. Brutal results.',
      likes: 35,
      gradient: 'from-rose-500 to-pink-500'
    },
    {
      id: 3,
      author: 'Andrés Castillo',
      avatar: 'AC',
      date: 'Hace 4 días',
      comment: 'La estructura StoryBrand funciona porque se alinea con cómo el cerebro procesa narrativas. No es marketing, es neurociencia aplicada.',
      likes: 28,
      gradient: 'from-cyan-500 to-blue-500'
    }
  ],
  'pre-suasion-cialdini-branding': [
    {
      id: 1,
      author: 'Valentina Ortiz',
      avatar: 'VO',
      date: 'Hace 3 días',
      comment: 'Pre-Suasión de Cialdini es mi biblia de marketing. La idea de que "lo que presentas ANTES del mensaje principal determina si lo aceptan" es devastadora. Cambié todo mi onboarding.',
      likes: 41,
      gradient: 'from-indigo-500 to-purple-500'
    },
    {
      id: 2,
      author: 'Marcus Johnson',
      avatar: 'MJ',
      date: '4 days ago',
      comment: 'Priming attention before delivering your message is genius. Now I understand why Apple shows the iPhone in creators\' hands before talking specs. Pre-suasion everywhere.',
      likes: 36,
      gradient: 'from-cyan-500 to-blue-500'
    },
    {
      id: 3,
      author: 'Ricardo Fuentes',
      avatar: 'RF',
      date: 'Hace 4 días',
      comment: 'El concepto de "priming atencional" explicado aquí es oro. Implementé pre-suasión en mi SaaS y los signups aumentaron 47% en 3 semanas.',
      likes: 31,
      gradient: 'from-emerald-500 to-teal-500'
    }
  ],
  'seis-armas-persuasion-cialdini': [
    {
      id: 1,
      author: 'Isabel Moreno',
      avatar: 'IM',
      date: 'Hace 4 días',
      comment: 'Las 6 armas de Cialdini (Reciprocidad, Compromiso, Prueba Social, Autoridad, Simpatía, Escasez) son LA base de cualquier estrategia de conversión. Este artículo las explica perfectamente.',
      likes: 48,
      gradient: 'from-rose-500 to-pink-500'
    },
    {
      id: 2,
      author: 'Daniel O\'Brien',
      avatar: 'DO',
      date: '5 days ago',
      comment: 'Implemented Scarcity and Social Proof on my SaaS. Signups increased 67% in 3 weeks. Not manipulation if you deliver real value. Cialdini was right about everything.',
      likes: 44,
      gradient: 'from-emerald-500 to-teal-500'
    },
    {
      id: 3,
      author: 'Jorge Ramírez',
      avatar: 'JR',
      date: 'Hace 5 días',
      comment: 'La clave es combinar las 6 armas de forma ética. No es manipulación si realmente hay valor. Mi conversión subió de 2.1% a 5.8% aplicando esto.',
      likes: 37,
      gradient: 'from-amber-500 to-orange-500'
    }
  ],
  'paralisis-eleccion-simplifica-oferta': [
    {
      id: 1,
      author: 'Carolina Méndez',
      avatar: 'CM',
      date: 'Hace 5 días',
      comment: 'El experimento de las mermeladas de Sheena Iyengar me cambió la vida. Tenía 12 planes de pricing. Los reduje a 3 y las conversiones se TRIPLICARON. Más opciones = menos decisión.',
      likes: 52,
      gradient: 'from-sky-500 to-blue-500'
    },
    {
      id: 2,
      author: 'Alex Turner',
      avatar: 'AT',
      date: '6 days ago',
      comment: 'The paradox of choice is real. Netflix gets it: shows 5-7 options max on screen despite having thousands. Less cognitive friction = more action. Applied this to my product lineup.',
      likes: 41,
      gradient: 'from-purple-500 to-fuchsia-500'
    },
    {
      id: 3,
      author: 'Alejandro Silva',
      avatar: 'AS',
      date: 'Hace 6 días',
      comment: 'Reduje mis opciones de 8 a 3 y las ventas subieron 124%. La paradoja de la elección no es teoría, es realidad comprobable.',
      likes: 35,
      gradient: 'from-emerald-500 to-teal-500'
    }
  ],
  // Comentarios genéricos mixtos para artículos sin comentarios específicos
  'default': [
    {
      id: 1,
      author: 'María González',
      avatar: 'MG',
      date: 'Hace 2 días',
      comment: 'Excelente artículo, Luis. La forma en que explicas conceptos complejos de una manera tan clara es brillante. Ya estoy implementando estas estrategias.',
      likes: 24,
      gradient: 'from-purple-500 to-fuchsia-500'
    },
    {
      id: 2,
      author: 'Jennifer Smith',
      avatar: 'JS',
      date: '3 days ago',
      comment: 'High-level content backed by solid research. Definitely going to dive deeper into this topic. Thanks for the insights!',
      likes: 19,
      gradient: 'from-cyan-500 to-blue-500'
    },
    {
      id: 3,
      author: 'Carlos Mendoza',
      avatar: 'CM',
      date: 'Hace 5 días',
      comment: 'Como psicólogo especializado en branding, puedo confirmar que todo lo que mencionas está respaldado por investigación sólida.',
      likes: 18,
      gradient: 'from-emerald-500 to-teal-500'
    },
    {
      id: 4,
      author: 'Ana Sofía Reyes',
      avatar: 'AR',
      date: 'Hace 1 semana',
      comment: 'Me encanta este enfoque Psych × Design × Tech. Es exactamente lo que hace falta en la industria.',
      likes: 31,
      gradient: 'from-amber-500 to-orange-500'
    }
  ]
}

const CommentsSection = ({ articleTitle, articleSlug }) => {
  // Obtener comentarios específicos del artículo o usar los genéricos
  const articleSpecificComments = articleComments[articleSlug] || articleComments['default']
  const [comments] = useState(articleSpecificComments)
  const [likedComments, setLikedComments] = useState([])

  const handleLike = (commentId) => {
    if (likedComments.includes(commentId)) {
      setLikedComments(likedComments.filter(id => id !== commentId))
    } else {
      setLikedComments([...likedComments, commentId])
    }
  }

  return (
    <section className="relative py-16 px-6 lg:px-20">
      <div className="max-w-3xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="mb-12"
        >
          <div className="flex items-center gap-3 mb-3">
            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-purple-500/20 to-fuchsia-500/20 border border-white/10 flex items-center justify-center">
              <MessageCircle className="w-5 h-5 text-white" />
            </div>
            <h3 className="text-3xl lg:text-4xl font-bold text-white">
              Comentarios
            </h3>
          </div>
          <p className="text-white/60 text-sm">
            {comments.length} personas están participando en esta conversación
          </p>
        </motion.div>

        {/* Comments list */}
        <div className="space-y-6">
          {comments.map((comment, index) => (
            <motion.div
              key={comment.id}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              viewport={{ once: true, amount: 0.3 }}
              className="relative bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-6 hover:border-white/20 transition-all duration-300 group"
            >
              {/* Gradient accent on hover */}
              <div className={`absolute top-0 left-0 w-1 h-full bg-gradient-to-b ${comment.gradient} opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-l-2xl`} />
              
              <div className="flex gap-4">
                {/* Avatar */}
                <div className={`flex-shrink-0 w-12 h-12 rounded-full bg-gradient-to-br ${comment.gradient} flex items-center justify-center`}>
                  <span className="text-white font-bold text-sm">{comment.avatar}</span>
                </div>

                {/* Content */}
                <div className="flex-1 min-w-0">
                  {/* Author & Date */}
                  <div className="flex items-center justify-between mb-2">
                    <div>
                      <h4 className="text-white font-semibold text-sm">{comment.author}</h4>
                      <span className="text-white/40 text-xs">{comment.date}</span>
                    </div>
                    <button className="text-white/40 hover:text-white/60 transition-colors">
                      <MoreHorizontal className="w-4 h-4" />
                    </button>
                  </div>

                  {/* Comment text */}
                  <p className="text-white/70 text-sm leading-relaxed mb-4">
                    {comment.comment}
                  </p>

                  {/* Actions */}
                  <div className="flex items-center gap-4">
                    <motion.button
                      onClick={() => handleLike(comment.id)}
                      whileTap={{ scale: 0.95 }}
                      className={`flex items-center gap-2 px-3 py-1.5 rounded-full transition-all duration-300 ${
                        likedComments.includes(comment.id)
                          ? 'bg-rose-500/20 text-rose-400 border border-rose-500/30'
                          : 'bg-white/5 text-white/60 hover:text-white/80 border border-white/10 hover:border-white/20'
                      }`}
                    >
                      <Heart 
                        className="w-4 h-4" 
                        fill={likedComments.includes(comment.id) ? 'currentColor' : 'none'}
                      />
                      <span className="text-xs font-medium">
                        {comment.likes + (likedComments.includes(comment.id) ? 1 : 0)}
                      </span>
                    </motion.button>

                    <button className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/5 hover:bg-white/10 text-white/60 hover:text-white/80 border border-white/10 hover:border-white/20 transition-all duration-300">
                      <Reply className="w-4 h-4" />
                      <span className="text-xs font-medium">Responder</span>
                    </button>
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Add comment CTA */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.5 }}
          viewport={{ once: true }}
          className="mt-8 p-6 bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl"
        >
          <p className="text-white/70 text-center mb-4">
            ¿Tienes algo que agregar a la conversación?
          </p>
          <button className="w-full px-6 py-3 bg-gradient-to-r from-purple-500 to-fuchsia-500 hover:from-purple-600 hover:to-fuchsia-600 text-white font-medium rounded-full transition-all duration-300 shadow-lg shadow-purple-500/20">
            Unirse a la Discusión
          </button>
        </motion.div>
      </div>
    </section>
  )
}

export default CommentsSection
