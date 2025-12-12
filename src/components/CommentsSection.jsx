import { motion } from 'framer-motion'
import { useState } from 'react'
import { MessageCircle, Heart, Reply, MoreHorizontal } from 'lucide-react'

// Comentarios específicos por artículo (MIXTOS: Español + Inglés)
const articleComments = {
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
