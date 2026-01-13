// Canonical index of legacy/hardcoded blog posts shown in the public Blog.
// This is intentionally separate from CMS/Supabase posts.

export const getLegacyBlogIndex = (language = 'es') => {
  const isEn = String(language || '').toLowerCase().startsWith('en')

  return [
    {
      id: 36,
      title: 'REINO ERUDITO',
      excerpt: 'A veces el conocimiento no nos libera; nos domestica. Nos volvemos guardianes del prestigio intelectual antes que amantes de la verdad. Este blog es una rebelión contra el “no estás listo todavía”.\n❓Pregunta: ¿Aprendemos para pensar… o para obedecer?',
      category: 'philosophy',
      author: 'Luis Virrueta',
      date: '07 Ene 2026',
      readTime: '16 min',
      gradient: 'from-emerald-600/20 via-teal-600/20 to-cyan-600/20',
      borderGradient: 'from-emerald-600 via-teal-600 to-cyan-600',
      tags: ['Filosofía', 'Psicoanálisis', 'Foucault', 'Adorno', 'Althusser', 'Gramsci', 'Byung-Chul Han', 'Hannah Arendt', 'Lacan', 'Deleuze', 'Nietzsche', 'Kierkegaard'],
      slug: 'reino-erudito',
      image: '/IMAGENES BLOG/REINO ERUDITO.jpg',
      rating: 4.9,
      featured: true,
      accent: 'emerald'
    },
    {
      id: 35,
      title: 'Fábrica de percepciones',
      excerpt: '¿Deseas lo que miras… o deseas la emoción que tu fantasía fabrica? ¿Qué parte de tu realidad es percepción, y qué parte es identidad imaginada? Este ensayo recorre mirada, deseo y el Otro para responderlo.',
      category: 'philosophy',
      author: 'Luis Virrueta',
      date: '07 Ene 2026',
      readTime: '15 min',
      gradient: 'from-indigo-600/20 via-purple-600/20 to-fuchsia-600/20',
      borderGradient: 'from-indigo-600 via-purple-600 to-fuchsia-600',
      tags: ['Psicoanálisis', 'Jacques Lacan', 'Sigmund Freud', 'Jean-Paul Sartre', 'Walter Benjamin', 'Mirada', 'Deseo', 'Percepción'],
      slug: 'fabrica-percepciones-identidades-imaginadas',
      image: '/blog-compressed/blog-22-fabrica.webp',
      rating: 4.9,
      featured: true
    },
    {
      id: 34,
      title: isEn ? 'SU·DO·KU: The art of thinking by elimination' : 'SU·DO·KU: El arte de pensar por descarte',
      excerpt: isEn
        ? 'What if thinking were elimination, not certainty? Sudoku becomes a map of negation, decision and the ethics of sustaining the question instead of “closing” it too fast.'
        : '¿Y si pensar fuera descartar, no “tener razón”? El Sudoku se vuelve un mapa de negación, decisión y la ética de sostener la pregunta en vez de cerrarla con prisa.',
      category: 'psychoanalysis',
      author: 'Luis Virrueta',
      date: '22 Dic 2025',
      readTime: '15 min',
      gradient: 'from-purple-500/20 to-fuchsia-500/20',
      borderGradient: 'from-purple-500 to-fuchsia-500',
      tags: isEn
        ? ['Psychoanalysis', 'Jacques Lacan', 'Thinking', 'Decision fatigue', 'Negation', 'Philosophy']
        : ['Psicoanálisis', 'Jacques Lacan', 'Pensamiento', 'Decisión', 'Vía negativa', 'Filosofía'],
      slug: 'sudoku',
      image: '/IMAGENES BLOG/SUDOKU HUMANO.jpg',
      rating: 5.0,
      featured: true
    },
    {
      id: 33,
      title: isEn ? 'P.U.T.A. (Panic · Usurpation · Terror · Autonomy)' : 'P.U.T.A. (Pánico · Usurpación · Terror · Autonomía)',
      excerpt: isEn
        ? 'Who does the insult describe: the woman, or the speaker? Panic, usurpation, terror and autonomy of desire—why the word works as a psychic shield.'
        : '¿A quién describe el insulto: a la mujer… o a quien lo pronuncia? Pánico, usurpación, terror y autonomía del deseo: por qué la palabra funciona como escudo psíquico.',
      category: 'psychoanalysis',
      author: 'Luis Virrueta',
      date: '22 Dic 2025',
      readTime: '19 min',
      gradient: 'from-red-600/20 to-pink-700/20',
      borderGradient: 'from-red-600 to-pink-700',
      tags: isEn
        ? ['Psychoanalysis', 'Jacques Lacan', 'Sigmund Freud', 'Slavoj Žižek', 'Desire', 'Jouissance', 'Projection']
        : ['Psicoanálisis', 'Jacques Lacan', 'Sigmund Freud', 'Slavoj Žižek', 'Deseo', 'Goce', 'Proyección'],
      slug: 'puta-panico-usurpacion-terror-autonomia',
      image: '/IMAGENES BLOG/puta.jpg',
      rating: 4.9,
      featured: true
    },
    {
      id: 32,
      title: isEn ? 'The Game No One Confesses to Playing' : 'El juego que nadie confiesa estar jugando',
      excerpt: isEn
        ? 'What do you gain when you call the world “corrupt”? And what do you lose by keeping your innocence intact? A piece on symbolic games, language and responsibility.'
        : '¿Qué ganas cuando llamas al mundo “corrupto”? ¿Y qué pierdes al preservar tu inocencia intacta? Un ensayo sobre juego simbólico, lenguaje y responsabilidad.',
      category: 'philosophy',
      author: 'Luis Virrueta',
      date: '18 Dic 2025',
      readTime: '16 min',
      gradient: 'from-slate-600/20 to-zinc-700/20',
      borderGradient: 'from-slate-600 to-zinc-700',
      tags: isEn
        ? ['Philosophy', 'Ethics', 'Jacques Lacan', 'Slavoj Žižek', 'Language', 'Responsibility', 'Symbolic order']
        : ['Filosofía', 'Ética', 'Jacques Lacan', 'Slavoj Žižek', 'Lenguaje', 'Responsabilidad', 'Orden simbólico'],
      slug: 'el-juego-que-nadie-confiesa-estar-jugando',
      image: '/IMAGENES BLOG/ajedrez.jpg',
      rating: 4.8,
      featured: true
    },
    {
      id: 31,
      title: isEn ? 'The Breaking of the Break' : 'La ruptura de la ruptura',
      excerpt: isEn
        ? 'Why does what saved you at first stop working later? When the old self breaks, what is actually beginning? A map of the “dark night” and the clarity that follows.'
        : '¿Por qué lo que te salvó al principio deja de funcionar después? Cuando el yo viejo se rompe, ¿qué es lo que realmente comienza? Un mapa de la “noche oscura” y su claridad.',
      category: 'consciousness',
      author: 'Luis Virrueta',
      date: '10 Dic 2025',
      readTime: '15 min',
      gradient: 'from-indigo-500/20 to-purple-600/20',
      borderGradient: 'from-indigo-500 to-purple-600',
      tags: isEn
        ? ['Consciousness', 'Dark night of the soul', 'Meditation', 'Presence', 'Spirituality', 'Transformation']
        : ['Conciencia', 'Noche oscura del alma', 'Meditación', 'Presencia', 'Transformación', 'Espiritualidad'],
      slug: 'la-ruptura-de-la-ruptura',
      image: '/IMAGENES BLOG/ruptura.jpg',
      rating: 4.9,
      featured: true
    },
    {
      id: 30,
      title: isEn ? "It Doesn't Hurt Because Something Breaks" : 'No duele porque algo se rompe, duele porque algo no puede romperse',
      excerpt: isEn
        ? "What if pain doesn't “go away” but takes over the whole world? What does it reveal about body, meaning and the Real? A phenomenological + psychoanalytic look."
        : '¿Y si el dolor no fuera algo que se quita, sino algo que ocupa todo el mundo? ¿Qué revela del cuerpo, el sentido y lo Real? Fenomenología + psicoanálisis para mirarlo de frente.',
      category: 'consciousness',
      author: 'Luis Virrueta',
      date: '28 Nov 2025',
      readTime: '17 min',
      gradient: 'from-red-500/20 to-orange-600/20',
      borderGradient: 'from-red-500 to-orange-600',
      tags: isEn
        ? ['Pain', 'Merleau-Ponty', 'Lacan', 'The Real', 'Body', 'Consciousness', 'Psychoanalysis', 'Phenomenology']
        : ['Dolor', 'Merleau-Ponty', 'Lacan', 'Lo Real', 'Cuerpo', 'Conciencia', 'Psicoanálisis', 'Fenomenología'],
      slug: 'no-duele-porque-algo-se-rompe',
      image: '/IMAGENES BLOG/no duele.jpg',
      rating: 4.7,
      featured: true
    },
    {
      id: 29,
      title: isEn ? 'Where Is the Body When Everything Works?' : '¿Dónde está el cuerpo cuando todo funciona?',
      excerpt: isEn
        ? 'Where is the body when everything works—and why does it appear only when it fails? A short entry into perception, attention and the invisible background that holds daily life.'
        : '¿Dónde está tu cuerpo cuando todo va bien… y por qué aparece cuando falla? Una entrada breve a percepción, atención y ese fondo invisible que sostiene tu vida diaria.',
      category: 'consciousness',
      author: 'Luis Virrueta',
      date: '15 Nov 2025',
      readTime: '14 min',
      gradient: 'from-purple-500/20 to-violet-600/20',
      borderGradient: 'from-purple-500 to-violet-600',
      tags: isEn
        ? ['Body', 'Perception', 'Merleau-Ponty', 'Lacan', 'Kybalion', 'Consciousness', 'Psychoanalysis']
        : ['Cuerpo', 'Percepción', 'Merleau-Ponty', 'Lacan', 'Kybalion', 'Conciencia', 'Psicoanálisis'],
      slug: 'donde-esta-el-cuerpo-cuando-todo-funciona',
      image: '/IMAGENES BLOG/gas.jpg',
      rating: 4.8,
      featured: true
    },
    {
      id: 28,
      title: isEn ? 'The Tearing of Unity' : 'El desgarro de la unidad',
      excerpt: isEn
        ? "What if love isn't “two halves becoming one”, but the tear inside unity? Desire, lack, and why union can hurt."
        : '¿Y si amar no fuera “hacerse uno”, sino sostener el desgarro dentro de la unidad? Deseo, falta y por qué la unión puede doler.',
      category: 'psychoanalysis',
      author: 'Luis Virrueta',
      date: '2 Nov 2025',
      readTime: '15 min',
      gradient: 'from-amber-500/20 to-rose-600/20',
      borderGradient: 'from-amber-500 to-rose-600',
      tags: isEn
        ? ['Love', 'Unity', 'Falling in Love', 'Lack', 'Psychoanalysis', 'Ontology', 'Relationship']
        : ['Amor', 'Unidad', 'Enamoramiento', 'Falta', 'Psicoanálisis', 'Ontología', 'Relación'],
      slug: 'el-desgarro-de-la-unidad',
      image: '/IMAGENES BLOG/desgarro.jpg',
      rating: 4.9,
      featured: true
    },
    {
      id: 27,
      title: isEn ? 'The Fish That Is Not Eaten' : 'El pez que no se come',
      excerpt: isEn
        ? 'Why does a bond sometimes need the object—but not the satisfaction? A fish is exchanged without being eaten: a metaphor for desire, listening, and the desire of the Other.'
        : '¿Por qué a veces el vínculo necesita el objeto… pero no la satisfacción? Un pez que se intercambia sin comerse: metáfora de deseo, escucha y deseo del Otro.',
      category: 'psychoanalysis',
      author: 'Luis Virrueta',
      date: '20 Oct 2025',
      readTime: '13 min',
      gradient: 'from-cyan-500/20 to-blue-600/20',
      borderGradient: 'from-cyan-500 to-blue-600',
      tags: isEn
        ? ['Žižek', 'Lacan', 'Bond', 'Listening', 'Relationships', 'Desire of the Other', 'Psychoanalysis']
        : ['Žižek', 'Lacan', 'Vínculo', 'Escucha', 'Relaciones', 'Deseo del Otro', 'Psicoanálisis'],
      slug: 'el-pez-que-no-se-come',
      image: '/IMAGENES BLOG/gaviota.jpg',
      rating: 4.8,
      featured: true
    },
    {
      id: 26,
      title: isEn ? 'Loving from the Wound' : 'Amar desde la herida',
      excerpt: isEn
        ? 'Love often starts where something hurts. What changes when you stop demanding the other repair your lack—and you assume your desire? What becomes possible then?'
        : 'El amor suele empezar donde algo duele. ¿Qué cambia cuando dejas de exigirle al otro que repare tu falta y asumes tu deseo? ¿Qué se vuelve posible entonces?',
      category: 'psychoanalysis',
      author: 'Luis Virrueta',
      date: '8 Oct 2025',
      readTime: '15 min',
      gradient: 'from-rose-500/20 to-red-600/20',
      borderGradient: 'from-rose-500 to-red-600',
      tags: isEn
        ? ['Love', 'Lacan', 'Lack', 'Desire', 'Bond', 'Constitutive Wound', 'Psychoanalysis']
        : ['Amor', 'Lacan', 'Falta', 'Deseo', 'Vínculo', 'Herida constitutiva', 'Psicoanálisis'],
      slug: 'amar-desde-la-herida',
      image: '/IMAGENES BLOG/herida.jpg',
      rating: 4.9,
      featured: true
    },
    {
      id: 25,
      title: isEn
        ? 'Being Free Is Not Choosing: It Is Not Being Able to Stop Repeating'
        : 'Ser libre no es elegir: es no poder dejar de repetir',
      excerpt: isEn
        ? "Are you free when you choose—or when you can't stop repeating? Freedom is where repetition becomes visible, and an act becomes possible."
        : '¿Eres libre cuando eliges… o cuando ya no puedes dejar de repetir? La libertad aparece cuando la repetición se vuelve visible y el acto se vuelve posible.',
      category: 'psychoanalysis',
      author: 'Luis Virrueta',
      date: '25 Sep 2025',
      readTime: '16 min',
      gradient: 'from-sky-500/20 to-indigo-600/20',
      borderGradient: 'from-sky-500 to-indigo-600',
      tags: isEn
        ? ['Freedom', 'Hegel', 'Lacan', 'Žižek', 'Symptom', 'Repetition', 'Subjective Act', 'Psychoanalysis']
        : ['Libertad', 'Hegel', 'Lacan', 'Žižek', 'Síntoma', 'Repetición', 'Acto subjetivo', 'Psicoanálisis'],
      slug: 'ser-libre-no-es-elegir-es-no-poder-dejar-de-repetir',
      image: '/IMAGENES BLOG/ser libres.jpg',
      rating: 4.7,
      featured: true
    },
    {
      id: 24,
      title: isEn ? 'I Used to Be Happy' : 'Antes era feliz',
      excerpt: isEn
        ? 'What “before” do you want to return to—if that before never existed? A psychoanalytic look at nostalgia, identity and the fantasy of a lost point zero.'
        : '¿A qué “antes” quieres volver… si ese antes nunca existió? Una lectura psicoanalítica sobre nostalgia, identidad y la fantasía de un punto cero perdido.',
      category: 'psychoanalysis',
      author: 'Luis Virrueta',
      date: '12 Sep 2025',
      readTime: '17 min',
      gradient: 'from-violet-500/20 to-purple-600/20',
      borderGradient: 'from-violet-500 to-purple-600',
      tags: isEn
        ? ['Psychoanalysis', 'Lacan', 'Nostalgia', 'Identity', 'Constitutive Wound', 'Point Zero', 'Subjectivity']
        : ['Psicoanálisis', 'Lacan', 'Nostalgia', 'Identidad', 'Herida constitutiva', 'Punto cero', 'Subjetividad'],
      slug: 'antes-era-feliz-el-punto-cero',
      image: '/IMAGENES BLOG/ANTES ERA 0.png',
      rating: 4.9,
      featured: true
    },
    {
      id: 23,
      title: isEn
        ? 'From the Dog Who Loves Me to the Void I Inhabit'
        : 'Del perro que me ama al vacío que me habita',
      excerpt: isEn
        ? "What does a love that doesn't demand—your dog's—show you about the void you inhabit? A piece on lack, presence and what you keep asking the Other to fill."
        : '¿Qué te muestra un amor que no exige —el de tu perro— sobre el vacío que habitas? Un texto sobre falta, presencia y eso que sigues pidiéndole al Otro que llene.',
      category: 'psychoanalysis',
      author: 'Luis Virrueta',
      date: '30 Ago 2025',
      readTime: '20 min',
      gradient: 'from-purple-500/20 to-fuchsia-600/20',
      borderGradient: 'from-purple-500 to-fuchsia-600',
      tags: isEn
        ? ['Lacan', 'Nisargadatta Maharaj', 'Simone Weil', 'Nietzsche', 'Existential Void', 'Psychoanalysis', 'Non-duality']
        : ['Lacan', 'Nisargadatta Maharaj', 'Simone Weil', 'Nietzsche', 'Vacío Existencial', 'Psicoanálisis', 'No-dualidad'],
      slug: 'del-perro-que-me-ama-al-vacio-que-me-habita',
      image: '/IMAGENES BLOG/PERRO.jpg',
      rating: 4.8,
      featured: true
    }
  ]
}
