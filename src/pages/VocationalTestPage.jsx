import { motion, AnimatePresence } from 'framer-motion'
import { useState, useEffect, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import { Clock, CheckCircle, ArrowRight, ArrowLeft, Brain, Heart, Sparkles, TrendingUp, Users, Code, Palette, BookOpen, Briefcase, Target } from 'lucide-react'
import SEOHead from '../components/SEOHead'

const VocationalTestPage = () => {
  const navigate = useNavigate()
  const [stage, setStage] = useState('intro') // 'intro', 'test', 'results'
  const [currentQuestion, setCurrentQuestion] = useState(0)
  const [answers, setAnswers] = useState({})
  const [timeLeft, setTimeLeft] = useState(45 * 60) // 45 minutos en segundos
  const [isLocked, setIsLocked] = useState(false) // Temporalmente desbloqueado
  const [testStarted, setTestStarted] = useState(false)
  const [results, setResults] = useState(null)
  
  // Timer
  useEffect(() => {
    if (testStarted && stage === 'test' && timeLeft > 0) {
      const timer = setInterval(() => {
        setTimeLeft(prev => prev - 1)
      }, 1000)
      return () => clearInterval(timer)
    }
    if (timeLeft === 0) {
      calculateResults()
    }
  }, [testStarted, timeLeft, stage])
  
  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins}:${secs.toString().padStart(2, '0')}`
  }
  
  // Sistema de preguntas vocacionales profundas
  const questions = [
    // Bloque 1: Motivación intrínseca (10 preguntas)
    {
      id: 1,
      question: '¿Qué tipo de actividad te hace perder la noción del tiempo?',
      type: 'scale',
      dimension: 'motivation',
      options: [
        { text: 'Crear cosas nuevas con mis manos o digitalmente', value: 5, careers: ['creative', 'tech', 'design'] },
        { text: 'Ayudar a otros a resolver sus problemas', value: 5, careers: ['social', 'health', 'education'] },
        { text: 'Analizar datos, patrones y sistemas', value: 5, careers: ['science', 'tech', 'finance'] },
        { text: 'Organizar eventos, proyectos o equipos', value: 5, careers: ['business', 'admin', 'social'] },
        { text: 'Investigar temas que me apasionan', value: 5, careers: ['research', 'science', 'academic'] }
      ]
    },
    {
      id: 2,
      question: 'Cuando enfrentas un desafío complejo, ¿cuál es tu primera reacción?',
      type: 'scale',
      dimension: 'problem_solving',
      options: [
        { text: 'Dividirlo en partes pequeñas y resolverlo paso a paso', value: 5, careers: ['tech', 'engineering', 'science'] },
        { text: 'Buscar perspectivas de otras personas', value: 5, careers: ['social', 'business', 'education'] },
        { text: 'Visualizar diferentes escenarios y soluciones creativas', value: 5, careers: ['creative', 'design', 'architecture'] },
        { text: 'Investigar cómo otros lo han resuelto antes', value: 5, careers: ['research', 'academic', 'science'] },
        { text: 'Confiar en mi intuición y experiencia', value: 5, careers: ['business', 'arts', 'entrepreneurship'] }
      ]
    },
    {
      id: 3,
      question: '¿Qué te genera más satisfacción profunda?',
      type: 'scale',
      dimension: 'satisfaction',
      options: [
        { text: 'Ver el impacto positivo en la vida de las personas', value: 5, careers: ['health', 'social', 'education', 'psychology'] },
        { text: 'Crear algo hermoso o funcional que perdure', value: 5, careers: ['creative', 'design', 'architecture', 'arts'] },
        { text: 'Descubrir verdades o resolver misterios complejos', value: 5, careers: ['science', 'research', 'investigation'] },
        { text: 'Construir sistemas eficientes que funcionen', value: 5, careers: ['tech', 'engineering', 'business'] },
        { text: 'Lograr metas ambiciosas y superar límites', value: 5, careers: ['business', 'sports', 'entrepreneurship'] }
      ]
    },
    {
      id: 4,
      question: 'Si tuvieras un día libre sin responsabilidades, ¿qué harías?',
      type: 'scale',
      dimension: 'interests',
      options: [
        { text: 'Aprender algo nuevo (curso, libro, tutorial)', value: 5, careers: ['academic', 'tech', 'research'] },
        { text: 'Crear o construir algo (arte, código, manualidades)', value: 5, careers: ['creative', 'tech', 'design'] },
        { text: 'Pasar tiempo de calidad con personas cercanas', value: 5, careers: ['social', 'health', 'education'] },
        { text: 'Explorar la naturaleza o hacer deporte', value: 5, careers: ['sports', 'health', 'environment'] },
        { text: 'Trabajar en un proyecto personal apasionante', value: 5, careers: ['entrepreneurship', 'arts', 'research'] }
      ]
    },
    {
      id: 5,
      question: '¿Cómo prefieres trabajar en proyectos importantes?',
      type: 'scale',
      dimension: 'work_style',
      options: [
        { text: 'Solo, con total autonomía y control', value: 5, careers: ['tech', 'creative', 'research'] },
        { text: 'En equipo pequeño con roles claros', value: 5, careers: ['business', 'health', 'design'] },
        { text: 'Liderando y coordinando grupos grandes', value: 5, careers: ['business', 'admin', 'education'] },
        { text: 'Colaborando constantemente con otros', value: 5, careers: ['social', 'education', 'health'] },
        { text: 'Alternando entre trabajo individual y grupal', value: 5, careers: ['tech', 'science', 'business'] }
      ]
    },
    {
      id: 6,
      question: '¿Qué tipo de reconocimiento te motiva más?',
      type: 'scale',
      dimension: 'motivation',
      options: [
        { text: 'Saber que mi trabajo ayudó a alguien', value: 5, careers: ['health', 'social', 'education'] },
        { text: 'Ver mi trabajo publicado o exhibido', value: 5, careers: ['creative', 'arts', 'design'] },
        { text: 'Ser reconocido como experto en mi campo', value: 5, careers: ['science', 'research', 'academic'] },
        { text: 'Lograr resultados medibles y tangibles', value: 5, careers: ['business', 'tech', 'engineering'] },
        { text: 'No necesito reconocimiento externo', value: 3, careers: ['research', 'tech', 'arts'] }
      ]
    },
    {
      id: 7,
      question: 'Cuando lees o aprendes algo nuevo, ¿qué te atrae más?',
      type: 'scale',
      dimension: 'learning',
      options: [
        { text: 'Entender cómo funcionan las cosas en profundidad', value: 5, careers: ['science', 'tech', 'engineering'] },
        { text: 'Descubrir diferentes perspectivas humanas', value: 5, careers: ['social', 'psychology', 'humanities'] },
        { text: 'Aprender técnicas prácticas aplicables', value: 5, careers: ['business', 'health', 'trades'] },
        { text: 'Explorar teorías abstractas y conceptos complejos', value: 5, careers: ['academic', 'philosophy', 'research'] },
        { text: 'Encontrar inspiración para crear', value: 5, careers: ['creative', 'arts', 'design'] }
      ]
    },
    {
      id: 8,
      question: '¿Qué te causa más estrés o insatisfacción?',
      type: 'scale',
      dimension: 'values',
      options: [
        { text: 'No poder ayudar cuando alguien lo necesita', value: 5, careers: ['health', 'social', 'education'] },
        { text: 'Sentir que mi trabajo no es significativo', value: 5, careers: ['social', 'health', 'environment'] },
        { text: 'Estar en situaciones desorganizadas o caóticas', value: 5, careers: ['business', 'admin', 'engineering'] },
        { text: 'No tener libertad creativa o autonomía', value: 5, careers: ['creative', 'arts', 'entrepreneurship'] },
        { text: 'Hacer tareas repetitivas sin desafío intelectual', value: 5, careers: ['research', 'science', 'tech'] }
      ]
    },
    {
      id: 9,
      question: '¿Cuál de estas habilidades sientes que es más natural en ti?',
      type: 'scale',
      dimension: 'skills',
      options: [
        { text: 'Empatizar y entender emociones ajenas', value: 5, careers: ['health', 'psychology', 'social', 'education'] },
        { text: 'Pensar lógicamente y resolver problemas complejos', value: 5, careers: ['tech', 'science', 'engineering', 'finance'] },
        { text: 'Comunicar ideas de forma clara y persuasiva', value: 5, careers: ['business', 'education', 'media', 'law'] },
        { text: 'Crear cosas bellas o funcionalmente innovadoras', value: 5, careers: ['creative', 'design', 'architecture', 'arts'] },
        { text: 'Organizar, planificar y ejecutar eficientemente', value: 5, careers: ['business', 'admin', 'project-management'] }
      ]
    },
    {
      id: 10,
      question: 'Si pudieras cambiar algo en el mundo, ¿qué sería?',
      type: 'scale',
      dimension: 'values',
      options: [
        { text: 'Mejorar la salud y bienestar de las personas', value: 5, careers: ['health', 'medicine', 'nutrition', 'psychology'] },
        { text: 'Resolver problemas ambientales y sostenibilidad', value: 5, careers: ['environment', 'science', 'engineering'] },
        { text: 'Reducir desigualdades sociales y económicas', value: 5, careers: ['social', 'law', 'politics', 'education'] },
        { text: 'Avanzar el conocimiento y la tecnología', value: 5, careers: ['science', 'tech', 'research', 'engineering'] },
        { text: 'Hacer el mundo más bello e inspirador', value: 5, careers: ['arts', 'design', 'architecture', 'creative'] }
      ]
    },
    
    // Bloque 2: Estilo cognitivo (10 preguntas)
    {
      id: 11,
      question: '¿Cómo procesas mejor la información nueva?',
      type: 'scale',
      dimension: 'cognition',
      options: [
        { text: 'Viendo ejemplos visuales y diagramas', value: 5, careers: ['design', 'architecture', 'creative'] },
        { text: 'Leyendo y tomando notas detalladas', value: 5, careers: ['research', 'academic', 'law'] },
        { text: 'Discutiéndolo con otras personas', value: 5, careers: ['education', 'social', 'business'] },
        { text: 'Experimentando y probando yo mismo', value: 5, careers: ['tech', 'science', 'engineering'] },
        { text: 'Relacionándolo con experiencias previas', value: 5, careers: ['health', 'psychology', 'teaching'] }
      ]
    },
    {
      id: 12,
      question: 'Al tomar decisiones importantes, ¿qué pesa más?',
      type: 'scale',
      dimension: 'decision_making',
      options: [
        { text: 'Análisis racional de pros y contras', value: 5, careers: ['business', 'finance', 'engineering'] },
        { text: 'Cómo afectará a las personas involucradas', value: 5, careers: ['health', 'social', 'education'] },
        { text: 'Mi intuición y experiencia acumulada', value: 5, careers: ['entrepreneurship', 'arts', 'business'] },
        { text: 'Evidencia científica y datos objetivos', value: 5, careers: ['science', 'research', 'tech'] },
        { text: 'Mis valores y principios personales', value: 5, careers: ['psychology', 'social', 'humanities'] }
      ]
    },
    {
      id: 13,
      question: '¿Cuál es tu relación con la incertidumbre?',
      type: 'scale',
      dimension: 'tolerance',
      options: [
        { text: 'La evito, prefiero claridad y estructura', value: 5, careers: ['business', 'admin', 'finance'] },
        { text: 'Me genera ansiedad pero puedo manejarla', value: 4, careers: ['health', 'education', 'social'] },
        { text: 'Me resulta neutral, ni me atrae ni me incomoda', value: 3, careers: ['tech', 'science', 'engineering'] },
        { text: 'Me emociona, veo oportunidades', value: 5, careers: ['entrepreneurship', 'research', 'arts'] },
        { text: 'La busco activamente, me aburre lo predecible', value: 5, careers: ['creative', 'entrepreneurship', 'exploration'] }
      ]
    },
    {
      id: 14,
      question: '¿Cómo te relacionas con el fracaso?',
      type: 'scale',
      dimension: 'resilience',
      options: [
        { text: 'Me afecta profundamente, tardo en recuperarme', value: 2, careers: ['admin', 'support'] },
        { text: 'Me frustra pero aprendo de él', value: 4, careers: ['education', 'health', 'business'] },
        { text: 'Lo veo como feedback para mejorar', value: 5, careers: ['tech', 'science', 'entrepreneurship'] },
        { text: 'No le doy mucha importancia, sigo adelante', value: 4, careers: ['sales', 'business', 'sports'] },
        { text: 'Me motiva a intentar con más fuerza', value: 5, careers: ['entrepreneurship', 'research', 'competitive'] }
      ]
    },
    {
      id: 15,
      question: 'En un proyecto grupal, naturalmente tiendes a:',
      type: 'scale',
      dimension: 'team_role',
      options: [
        { text: 'Liderar y coordinar al equipo', value: 5, careers: ['business', 'admin', 'management'] },
        { text: 'Generar ideas creativas y soluciones', value: 5, careers: ['creative', 'design', 'innovation'] },
        { text: 'Ejecutar tareas con alta calidad técnica', value: 5, careers: ['tech', 'engineering', 'science'] },
        { text: 'Mediar conflictos y mantener armonía', value: 5, careers: ['social', 'psychology', 'HR'] },
        { text: 'Investigar y aportar información valiosa', value: 5, careers: ['research', 'academic', 'analysis'] }
      ]
    },
    {
      id: 16,
      question: '¿Qué tipo de ambiente de trabajo te permitiría prosperar?',
      type: 'scale',
      dimension: 'environment',
      options: [
        { text: 'Estructurado, con procesos claros y predecibles', value: 5, careers: ['admin', 'finance', 'operations'] },
        { text: 'Dinámico, con variedad y nuevos desafíos', value: 5, careers: ['entrepreneurship', 'consulting', 'media'] },
        { text: 'Colaborativo, con mucha interacción humana', value: 5, careers: ['social', 'education', 'health'] },
        { text: 'Tranquilo, que permita concentración profunda', value: 5, careers: ['research', 'tech', 'arts'] },
        { text: 'Flexible, con autonomía y libertad creativa', value: 5, careers: ['creative', 'tech', 'freelance'] }
      ]
    },
    {
      id: 17,
      question: '¿Cuál de estos escenarios futuros te atrae más?',
      type: 'scale',
      dimension: 'future_vision',
      options: [
        { text: 'Estabilidad económica y seguridad laboral', value: 4, careers: ['admin', 'government', 'education'] },
        { text: 'Alto impacto social y hacer diferencia', value: 5, careers: ['social', 'health', 'NGO'] },
        { text: 'Reconocimiento como experto en mi campo', value: 5, careers: ['academic', 'research', 'medicine'] },
        { text: 'Libertad para crear y expresarme', value: 5, careers: ['arts', 'creative', 'entrepreneurship'] },
        { text: 'Liderar proyectos importantes e innovadores', value: 5, careers: ['business', 'tech', 'entrepreneurship'] }
      ]
    },
    {
      id: 18,
      question: '¿Qué tan importante es para ti tener un horario flexible?',
      type: 'scale',
      dimension: 'lifestyle',
      options: [
        { text: 'No es importante, prefiero estructura', value: 2, careers: ['admin', 'operations', 'manufacturing'] },
        { text: 'Algo importante, aprecio cierta flexibilidad', value: 3, careers: ['education', 'health', 'business'] },
        { text: 'Muy importante, valoro autonomía de horario', value: 5, careers: ['tech', 'creative', 'freelance'] },
        { text: 'Crucial, no podría trabajar con horario fijo', value: 5, careers: ['entrepreneurship', 'arts', 'consulting'] },
        { text: 'Me adapto, no es factor decisivo', value: 3, careers: ['versatile', 'general'] }
      ]
    },
    {
      id: 19,
      question: 'Al aprender una nueva habilidad, ¿cuál es tu enfoque?',
      type: 'scale',
      dimension: 'learning_style',
      options: [
        { text: 'Seguir un curso estructurado paso a paso', value: 4, careers: ['education', 'health', 'trades'] },
        { text: 'Sumergirme y aprender haciendo', value: 5, careers: ['tech', 'entrepreneurship', 'creative'] },
        { text: 'Estudiar teoría profundamente primero', value: 5, careers: ['academic', 'science', 'research'] },
        { text: 'Buscar mentor o guía experimentado', value: 4, careers: ['health', 'trades', 'arts'] },
        { text: 'Experimentar libremente y descubrir', value: 5, careers: ['creative', 'research', 'innovation'] }
      ]
    },
    {
      id: 20,
      question: '¿Cómo manejas el estrés y la presión?',
      type: 'scale',
      dimension: 'stress',
      options: [
        { text: 'Me paralizo, necesito evitar situaciones de alta presión', value: 2, careers: ['support', 'library', 'research'] },
        { text: 'Puedo manejarlo ocasionalmente pero me desgasta', value: 3, careers: ['education', 'admin', 'health'] },
        { text: 'Lo manejo bien, parte normal del trabajo', value: 4, careers: ['business', 'health', 'teaching'] },
        { text: 'Me desempeño mejor bajo presión', value: 5, careers: ['emergency', 'finance', 'entrepreneurship'] },
        { text: 'Lo busco activamente, me da energía', value: 5, careers: ['entrepreneurship', 'sports', 'emergency'] }
      ]
    },

    // Bloque 3: Intereses específicos (10 preguntas)
    {
      id: 21,
      question: '¿Qué tipo de contenido consumes en tu tiempo libre?',
      type: 'scale',
      dimension: 'interests',
      options: [
        { text: 'Documentales científicos y educativos', value: 5, careers: ['science', 'research', 'academic'] },
        { text: 'Arte, diseño y contenido visual', value: 5, careers: ['creative', 'design', 'arts'] },
        { text: 'Noticias, política y temas sociales', value: 5, careers: ['law', 'politics', 'journalism'] },
        { text: 'Tecnología, innovación y tendencias', value: 5, careers: ['tech', 'business', 'entrepreneurship'] },
        { text: 'Psicología, desarrollo personal y filosofía', value: 5, careers: ['psychology', 'coaching', 'humanities'] }
      ]
    },
    {
      id: 22,
      question: 'Si pudieras pasar un día con un profesional, ¿cuál elegirías?',
      type: 'scale',
      dimension: 'role_models',
      options: [
        { text: 'Un científico en su laboratorio', value: 5, careers: ['science', 'research', 'medicine'] },
        { text: 'Un artista en su estudio creativo', value: 5, careers: ['arts', 'design', 'creative'] },
        { text: 'Un emprendedor construyendo su empresa', value: 5, careers: ['entrepreneurship', 'business', 'tech'] },
        { text: 'Un terapeuta en consulta con pacientes', value: 5, careers: ['psychology', 'health', 'counseling'] },
        { text: 'Un ingeniero resolviendo problemas técnicos', value: 5, careers: ['engineering', 'tech', 'construction'] }
      ]
    },
    {
      id: 23,
      question: '¿Qué actividad escolar disfrutabas más?',
      type: 'scale',
      dimension: 'academic_preference',
      options: [
        { text: 'Matemáticas y ciencias exactas', value: 5, careers: ['science', 'tech', 'engineering', 'finance'] },
        { text: 'Literatura, escritura y humanidades', value: 5, careers: ['humanities', 'writing', 'education'] },
        { text: 'Arte, música o expresión creativa', value: 5, careers: ['arts', 'design', 'creative', 'music'] },
        { text: 'Deportes, educación física', value: 5, careers: ['sports', 'health', 'fitness'] },
        { text: 'Ciencias sociales e historia', value: 5, careers: ['social', 'humanities', 'teaching'] }
      ]
    },
    {
      id: 24,
      question: '¿Qué tipo de problema te parece más interesante resolver?',
      type: 'scale',
      dimension: 'problem_type',
      options: [
        { text: 'Problemas técnicos con solución lógica', value: 5, careers: ['tech', 'engineering', 'science'] },
        { text: 'Desafíos humanos y emocionales', value: 5, careers: ['psychology', 'social', 'health'] },
        { text: 'Retos creativos sin respuesta correcta', value: 5, careers: ['creative', 'arts', 'design'] },
        { text: 'Problemas estratégicos de negocios', value: 5, careers: ['business', 'finance', 'consulting'] },
        { text: 'Misterios científicos sin resolver', value: 5, careers: ['research', 'science', 'academic'] }
      ]
    },
    {
      id: 25,
      question: '¿Qué habilidad te gustaría dominar en los próximos 5 años?',
      type: 'scale',
      dimension: 'aspiration',
      options: [
        { text: 'Programación avanzada o ingeniería', value: 5, careers: ['tech', 'software', 'engineering'] },
        { text: 'Terapia, coaching o psicología', value: 5, careers: ['psychology', 'coaching', 'counseling'] },
        { text: 'Diseño gráfico o artes visuales', value: 5, careers: ['design', 'arts', 'creative'] },
        { text: 'Liderazgo empresarial o emprendimiento', value: 5, careers: ['business', 'entrepreneurship', 'management'] },
        { text: 'Investigación científica avanzada', value: 5, careers: ['research', 'science', 'academic'] }
      ]
    },
    {
      id: 26,
      question: '¿Cómo defines el éxito profesional para ti?',
      type: 'scale',
      dimension: 'success_definition',
      options: [
        { text: 'Ayudar a muchas personas y generar impacto', value: 5, careers: ['social', 'health', 'education', 'NGO'] },
        { text: 'Ser reconocido como experto en mi campo', value: 5, careers: ['academic', 'research', 'medicine', 'law'] },
        { text: 'Crear algo original que perdure', value: 5, careers: ['arts', 'design', 'architecture', 'writing'] },
        { text: 'Lograr independencia financiera', value: 4, careers: ['business', 'finance', 'entrepreneurship'] },
        { text: 'Hacer descubrimientos que avancen el conocimiento', value: 5, careers: ['research', 'science', 'innovation'] }
      ]
    },
    {
      id: 27,
      question: '¿Qué aspecto del trabajo te motiva más a largo plazo?',
      type: 'scale',
      dimension: 'long_term_motivation',
      options: [
        { text: 'Crecimiento continuo y aprendizaje', value: 5, careers: ['tech', 'research', 'academic'] },
        { text: 'Construir relaciones significativas', value: 5, careers: ['social', 'education', 'health'] },
        { text: 'Libertad creativa y expresión personal', value: 5, careers: ['arts', 'creative', 'entrepreneurship'] },
        { text: 'Resolver desafíos cada vez más complejos', value: 5, careers: ['science', 'engineering', 'consulting'] },
        { text: 'Ver resultados tangibles de mi esfuerzo', value: 5, careers: ['business', 'trades', 'construction'] }
      ]
    },
    {
      id: 28,
      question: 'En un mundo ideal, ¿cuánto contacto directo con personas tendría tu trabajo?',
      type: 'scale',
      dimension: 'social_interaction',
      options: [
        { text: 'Mínimo, prefiero trabajar solo', value: 5, careers: ['tech', 'research', 'writing'] },
        { text: 'Ocasional, equilibrio entre soledad y socialización', value: 4, careers: ['science', 'design', 'business'] },
        { text: 'Regular, con colegas pero no constantemente', value: 3, careers: ['engineering', 'admin', 'finance'] },
        { text: 'Frecuente, interacción diaria con personas', value: 5, careers: ['education', 'sales', 'business'] },
        { text: 'Constante, todo el día trabajando con gente', value: 5, careers: ['health', 'social', 'hospitality'] }
      ]
    },
    {
      id: 29,
      question: '¿Cómo te sientes respecto a hablar en público?',
      type: 'scale',
      dimension: 'public_speaking',
      options: [
        { text: 'Me aterroriza, lo evito a toda costa', value: 1, careers: ['tech', 'research', 'data'] },
        { text: 'Me pone nervioso pero puedo hacerlo', value: 3, careers: ['science', 'health', 'admin'] },
        { text: 'Neutral, no me molesta ni me emociona', value: 3, careers: ['business', 'education', 'consulting'] },
        { text: 'Me gusta, disfruto presentar ideas', value: 5, careers: ['education', 'business', 'media'] },
        { text: 'Me encanta, me da energía', value: 5, careers: ['entertainment', 'politics', 'motivational'] }
      ]
    },
    {
      id: 30,
      question: 'Cuando algo te apasiona, ¿cuál es tu tendencia natural?',
      type: 'scale',
      dimension: 'passion_expression',
      options: [
        { text: 'Estudiarlo exhaustivamente hasta dominarlo', value: 5, careers: ['research', 'academic', 'expertise'] },
        { text: 'Compartirlo entusiastamente con otros', value: 5, careers: ['education', 'social', 'media'] },
        { text: 'Crear algo inspirado en ello', value: 5, careers: ['arts', 'creative', 'design'] },
        { text: 'Aplicarlo prácticamente para resolver problemas', value: 5, careers: ['tech', 'engineering', 'business'] },
        { text: 'Experimentar y explorar sus límites', value: 5, careers: ['research', 'innovation', 'science'] }
      ]
    }
  ]
  
  // Sistema de carreras con perfiles detallados
  const careerProfiles = {
    'psychology': {
      name: 'Psicología Clínica / Psicoanálisis',
      description: 'Explorar la psique humana, ayudar en procesos de transformación personal desde el inconsciente.',
      icon: Brain,
      color: 'from-purple-500 to-fuchsia-500',
      match: ['motivation', 'satisfaction', 'interests', 'skills'],
      salary: '$15,000 - $50,000 MXN/mes',
      growth: 'Alto',
      fields: ['Psicoterapia', 'Psicoanálisis', 'Psicología organizacional', 'Investigación']
    },
    'tech': {
      name: 'Tecnología y Programación',
      description: 'Crear soluciones digitales, desarrollar software y sistemas que resuelvan problemas.',
      icon: Code,
      color: 'from-cyan-500 to-blue-500',
      match: ['problem_solving', 'cognition', 'learning'],
      salary: '$20,000 - $80,000 MXN/mes',
      growth: 'Muy Alto',
      fields: ['Desarrollo Web', 'IA/ML', 'Ciberseguridad', 'DevOps']
    },
    'creative': {
      name: 'Artes Creativas y Diseño',
      description: 'Expresarte creativamente, diseñar experiencias visuales y crear contenido original.',
      icon: Palette,
      color: 'from-pink-500 to-rose-500',
      match: ['satisfaction', 'interests', 'cognition'],
      salary: '$12,000 - $60,000 MXN/mes',
      growth: 'Medio-Alto',
      fields: ['Diseño Gráfico', 'UX/UI', 'Ilustración', 'Animación']
    },
    'business': {
      name: 'Negocios y Emprendimiento',
      description: 'Liderar proyectos, crear empresas y generar valor económico con visión estratégica.',
      icon: Briefcase,
      color: 'from-amber-500 to-orange-500',
      match: ['decision_making', 'team_role', 'future_vision'],
      salary: '$18,000 - $100,000+ MXN/mes',
      growth: 'Muy Alto',
      fields: ['Emprendimiento', 'Consultoría', 'Marketing', 'Finanzas']
    },
    'health': {
      name: 'Salud y Medicina',
      description: 'Cuidar la salud física y mental, impactar directamente en el bienestar de las personas.',
      icon: Heart,
      color: 'from-red-500 to-pink-500',
      match: ['satisfaction', 'values', 'skills'],
      salary: '$20,000 - $80,000 MXN/mes',
      growth: 'Alto',
      fields: ['Medicina', 'Enfermería', 'Nutrición', 'Fisioterapia']
    },
    'science': {
      name: 'Ciencia e Investigación',
      description: 'Descubrir verdades, investigar fenómenos y expandir el conocimiento humano.',
      icon: Sparkles,
      color: 'from-indigo-500 to-purple-500',
      match: ['problem_solving', 'learning', 'cognition'],
      salary: '$15,000 - $60,000 MXN/mes',
      growth: 'Medio',
      fields: ['Investigación', 'Biotecnología', 'Química', 'Física']
    },
    'education': {
      name: 'Educación y Enseñanza',
      description: 'Transmitir conocimiento, formar personas y generar impacto en futuras generaciones.',
      icon: BookOpen,
      color: 'from-emerald-500 to-teal-500',
      match: ['motivation', 'satisfaction', 'social_interaction'],
      salary: '$12,000 - $40,000 MXN/mes',
      growth: 'Estable',
      fields: ['Docencia', 'Pedagogía', 'Capacitación corporativa', 'E-learning']
    },
    'social': {
      name: 'Trabajo Social y Humanidades',
      description: 'Generar cambio social, defender derechos y mejorar condiciones de vida.',
      icon: Users,
      color: 'from-green-500 to-emerald-500',
      match: ['values', 'satisfaction', 'motivation'],
      salary: '$10,000 - $35,000 MXN/mes',
      growth: 'Medio',
      fields: ['Trabajo Social', 'ONGs', 'Derechos Humanos', 'Antropología']
    },
    'engineering': {
      name: 'Ingeniería',
      description: 'Diseñar, construir y optimizar sistemas físicos y procesos complejos.',
      icon: Target,
      color: 'from-slate-500 to-zinc-500',
      match: ['problem_solving', 'cognition', 'skills'],
      salary: '$18,000 - $70,000 MXN/mes',
      growth: 'Alto',
      fields: ['Civil', 'Mecánica', 'Eléctrica', 'Industrial']
    },
    'entrepreneurship': {
      name: 'Emprendimiento e Innovación',
      description: 'Crear nuevas empresas, innovar y construir soluciones disruptivas.',
      icon: TrendingUp,
      color: 'from-violet-500 to-purple-500',
      match: ['tolerance', 'resilience', 'future_vision'],
      salary: 'Variable ($10,000 - $200,000+ MXN/mes)',
      growth: 'Muy Alto',
      fields: ['Startups', 'Innovación', 'Negocios digitales', 'Consultoría']
    }
  }
  
  const handleAnswer = (questionId, option) => {
    setAnswers(prev => ({
      ...prev,
      [questionId]: option
    }))
  }
  
  const nextQuestion = () => {
    if (currentQuestion < questions.length - 1) {
      setCurrentQuestion(prev => prev + 1)
    } else {
      calculateResults()
    }
  }
  
  const previousQuestion = () => {
    if (currentQuestion > 0) {
      setCurrentQuestion(prev => prev - 1)
    }
  }
  
  const calculateResults = () => {
    // Sistema sofisticado de puntuación
    const careerScores = {}
    
    // Inicializar scores
    Object.keys(careerProfiles).forEach(career => {
      careerScores[career] = 0
    })
    
    // Calcular puntos por respuesta
    Object.entries(answers).forEach(([questionId, answer]) => {
      answer.careers.forEach(career => {
        if (careerScores[career] !== undefined) {
          careerScores[career] += answer.value
        }
      })
    })
    
    // Normalizar y ordenar
    const totalAnswers = Object.keys(answers).length
    const normalizedScores = Object.entries(careerScores).map(([career, score]) => ({
      career,
      score,
      percentage: Math.min(Math.round((score / (totalAnswers * 5)) * 100), 100),
      profile: careerProfiles[career]
    })).sort((a, b) => b.score - a.score)
    
    setResults(normalizedScores)
    setStage('results')
  }
  
  const startTest = () => {
    if (isLocked) {
      // Aquí iría la lógica de pago
      alert('Funcionalidad de pago próximamente')
      return
    }
    setTestStarted(true)
    setStage('test')
  }
  
  const progress = ((currentQuestion + 1) / questions.length) * 100
  
  return (
    <div className="min-h-screen bg-[#0A0A0A] text-white">
      <SEOHead
        title="Test Vocacional - Luis Virrueta"
        description="Descubre tu vocación profesional con nuestro test psicológico profundo basado en psicoanálisis y ciencia vocacional."
      />
      
      <AnimatePresence mode="wait">
        {stage === 'intro' && (
          <motion.div
            key="intro"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="relative min-h-screen flex items-center justify-center px-6"
          >
            {/* Background effects */}
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
              <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-purple-600/10 rounded-full blur-3xl" />
              <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-fuchsia-600/10 rounded-full blur-3xl" />
            </div>
            
            <div className="relative max-w-4xl mx-auto text-center">
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ duration: 0.5 }}
                className="w-20 h-20 mx-auto mb-8 bg-gradient-to-br from-purple-500 to-fuchsia-500 rounded-full flex items-center justify-center"
              >
                <Brain className="w-10 h-10" />
              </motion.div>
              
              <motion.h1
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.2 }}
                className="text-5xl lg:text-7xl font-bold mb-6 bg-gradient-to-r from-purple-400 to-fuchsia-400 bg-clip-text text-transparent"
              >
                Test Vocacional Profundo
              </motion.h1>
              
              <motion.p
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.3 }}
                className="text-xl text-white/70 mb-12 max-w-2xl mx-auto leading-relaxed"
              >
                Un análisis psicológico completo que va más allá de preguntas superficiales. 
                30 preguntas diseñadas para descubrir tu verdadera vocación desde la estructura de tu deseo.
              </motion.p>
              
              <motion.div
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.4 }}
                className="grid md:grid-cols-3 gap-6 mb-12"
              >
                <div className="p-6 bg-white/5 border border-white/10 rounded-xl">
                  <Clock className="w-8 h-8 mx-auto mb-3 text-purple-400" />
                  <h3 className="font-bold mb-2">45 minutos</h3>
                  <p className="text-sm text-white/60">Tiempo límite para completar</p>
                </div>
                <div className="p-6 bg-white/5 border border-white/10 rounded-xl">
                  <CheckCircle className="w-8 h-8 mx-auto mb-3 text-fuchsia-400" />
                  <h3 className="font-bold mb-2">30 preguntas</h3>
                  <p className="text-sm text-white/60">Análisis multidimensional</p>
                </div>
                <div className="p-6 bg-white/5 border border-white/10 rounded-xl">
                  <Target className="w-8 h-8 mx-auto mb-3 text-cyan-400" />
                  <h3 className="font-bold mb-2">10 carreras</h3>
                  <p className="text-sm text-white/60">Perfiles vocacionales evaluados</p>
                </div>
              </motion.div>
              
              <motion.button
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.5 }}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={startTest}
                className="group relative px-12 py-6 bg-gradient-to-r from-purple-500 to-fuchsia-500 rounded-full font-bold text-lg overflow-hidden"
              >
                <span className="relative z-10 flex items-center gap-3">
                  Iniciar Test
                  <ArrowRight className="w-6 h-6 group-hover:translate-x-1 transition-transform" />
                </span>
              </motion.button>
              
              {isLocked && (
                <p className="mt-4 text-sm text-white/50">
                  * Test desbloqueado temporalmente para pruebas
                </p>
              )}
            </div>
          </motion.div>
        )}
        
        {stage === 'test' && (
          <motion.div
            key="test"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="relative min-h-screen py-20 px-6"
          >
            {/* Timer y Progress */}
            <div className="fixed top-0 left-0 right-0 z-50 bg-black/80 backdrop-blur-md border-b border-white/10">
              <div className="max-w-4xl mx-auto px-6 py-4">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <Clock className="w-5 h-5 text-purple-400" />
                    <span className="font-mono text-lg">{formatTime(timeLeft)}</span>
                  </div>
                  <span className="text-sm text-white/60">
                    Pregunta {currentQuestion + 1} de {questions.length}
                  </span>
                </div>
                <div className="h-2 bg-white/10 rounded-full overflow-hidden">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${progress}%` }}
                    transition={{ duration: 0.3 }}
                    className="h-full bg-gradient-to-r from-purple-500 to-fuchsia-500"
                  />
                </div>
              </div>
            </div>
            
            {/* Question */}
            <div className="max-w-4xl mx-auto pt-32">
              <AnimatePresence mode="wait">
                <motion.div
                  key={currentQuestion}
                  initial={{ opacity: 0, x: 100 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -100 }}
                  transition={{ duration: 0.3 }}
                  className="mb-12"
                >
                  <h2 className="text-3xl lg:text-4xl font-bold mb-8 leading-tight">
                    {questions[currentQuestion].question}
                  </h2>
                  
                  <div className="space-y-4">
                    {questions[currentQuestion].options.map((option, index) => (
                      <motion.button
                        key={index}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.1 }}
                        onClick={() => handleAnswer(questions[currentQuestion].id, option)}
                        className={`group w-full text-left p-6 rounded-xl border-2 transition-all duration-300 ${
                          answers[questions[currentQuestion].id] === option
                            ? 'border-purple-500 bg-purple-500/10'
                            : 'border-white/10 bg-white/5 hover:border-white/30'
                        }`}
                      >
                        <div className="flex items-center justify-between">
                          <span className="flex-1 text-lg">{option.text}</span>
                          {answers[questions[currentQuestion].id] === option && (
                            <CheckCircle className="w-6 h-6 text-purple-400" />
                          )}
                        </div>
                      </motion.button>
                    ))}
                  </div>
                </motion.div>
              </AnimatePresence>
              
              {/* Navigation */}
              <div className="flex items-center justify-between pt-8">
                <button
                  onClick={previousQuestion}
                  disabled={currentQuestion === 0}
                  className="flex items-center gap-2 px-6 py-3 rounded-full border border-white/20 disabled:opacity-30 disabled:cursor-not-allowed hover:border-white/40 transition-all"
                >
                  <ArrowLeft className="w-5 h-5" />
                  Anterior
                </button>
                
                <button
                  onClick={nextQuestion}
                  disabled={!answers[questions[currentQuestion].id]}
                  className="flex items-center gap-2 px-8 py-3 bg-gradient-to-r from-purple-500 to-fuchsia-500 rounded-full font-bold disabled:opacity-30 disabled:cursor-not-allowed hover:scale-105 transition-all"
                >
                  {currentQuestion === questions.length - 1 ? 'Ver Resultados' : 'Siguiente'}
                  <ArrowRight className="w-5 h-5" />
                </button>
              </div>
            </div>
          </motion.div>
        )}
        
        {stage === 'results' && results && (
          <motion.div
            key="results"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="relative min-h-screen py-20 px-6"
          >
            <div className="max-w-6xl mx-auto">
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ duration: 0.5 }}
                className="text-center mb-16"
              >
                <div className="w-20 h-20 mx-auto mb-6 bg-gradient-to-br from-purple-500 to-fuchsia-500 rounded-full flex items-center justify-center">
                  <CheckCircle className="w-10 h-10" />
                </div>
                <h1 className="text-5xl lg:text-6xl font-bold mb-4 bg-gradient-to-r from-purple-400 to-fuchsia-400 bg-clip-text text-transparent">
                  Tus Resultados
                </h1>
                <p className="text-xl text-white/70">
                  Análisis completo de tu perfil vocacional
                </p>
              </motion.div>
              
              {/* Top 5 Careers */}
              <div className="space-y-6 mb-12">
                {results.slice(0, 5).map((result, index) => {
                  const Icon = result.profile.icon
                  return (
                    <motion.div
                      key={result.career}
                      initial={{ opacity: 0, x: -50 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.1 }}
                      className="relative p-6 bg-white/5 border border-white/10 rounded-2xl hover:border-white/30 transition-all"
                    >
                      <div className="flex items-start gap-6">
                        <div className="flex-shrink-0">
                          <div className={`w-16 h-16 bg-gradient-to-br ${result.profile.color} rounded-xl flex items-center justify-center`}>
                            <Icon className="w-8 h-8" />
                          </div>
                        </div>
                        <div className="flex-1">
                          <div className="flex items-start justify-between mb-2">
                            <div>
                              <h3 className="text-2xl font-bold mb-1">{result.profile.name}</h3>
                              <p className="text-white/70">{result.profile.description}</p>
                            </div>
                            <div className="text-right">
                              <div className="text-3xl font-bold bg-gradient-to-r from-purple-400 to-fuchsia-400 bg-clip-text text-transparent">
                                {result.percentage}%
                              </div>
                              <div className="text-xs text-white/50">Compatibilidad</div>
                            </div>
                          </div>
                          
                          {/* Progress bar */}
                          <div className="h-2 bg-white/10 rounded-full overflow-hidden mb-4">
                            <motion.div
                              initial={{ width: 0 }}
                              animate={{ width: `${result.percentage}%` }}
                              transition={{ duration: 1, delay: index * 0.1 }}
                              className={`h-full bg-gradient-to-r ${result.profile.color}`}
                            />
                          </div>
                          
                          <div className="grid md:grid-cols-3 gap-4 text-sm">
                            <div>
                              <span className="text-white/50">Salario promedio:</span>
                              <div className="font-bold">{result.profile.salary}</div>
                            </div>
                            <div>
                              <span className="text-white/50">Crecimiento:</span>
                              <div className="font-bold">{result.profile.growth}</div>
                            </div>
                            <div>
                              <span className="text-white/50">Áreas:</span>
                              <div className="font-bold">{result.profile.fields.slice(0, 2).join(', ')}</div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  )
                })}
              </div>
              
              {/* CTA para consulta */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.6 }}
                className="p-8 bg-gradient-to-br from-purple-500/10 to-fuchsia-500/10 border border-purple-500/20 rounded-2xl text-center"
              >
                <h3 className="text-2xl font-bold mb-4">
                  ¿Necesitas ayuda para interpretar tus resultados?
                </h3>
                <p className="text-white/70 mb-6 max-w-2xl mx-auto">
                  Agenda una consulta personalizada para profundizar en tu perfil vocacional, 
                  explorar tus fortalezas y diseñar un plan de acción concreto hacia tu carrera ideal.
                </p>
                <a
                  href="https://wa.me/527228720520?text=Hola! Completé el test vocacional y me gustaría una consulta para interpretar mis resultados"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-3 px-8 py-4 bg-gradient-to-r from-purple-500 to-fuchsia-500 rounded-full font-bold hover:scale-105 transition-all"
                >
                  Agendar Consulta de Interpretación
                  <ArrowRight className="w-5 h-5" />
                </a>
              </motion.div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

export default VocationalTestPage
