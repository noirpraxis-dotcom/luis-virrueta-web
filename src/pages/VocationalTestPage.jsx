import { motion, AnimatePresence } from 'framer-motion'
import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { Clock, CheckCircle, ArrowRight, ArrowLeft, Brain, Heart, Sparkles, TrendingUp, Users, Code, Palette, BookOpen, Briefcase, Target, Home, AlertCircle, BarChart3, PieChart, Activity } from 'lucide-react'
import SEOHead from '../components/SEOHead'

const VocationalTestPage = ({ initialStage = 'intro' }) => {
  const navigate = useNavigate()
  const [stage, setStage] = useState(initialStage) // 'intro', 'test', 'results'
  const [currentQuestion, setCurrentQuestion] = useState(0)
  const [answers, setAnswers] = useState({})
  const [timeLeft, setTimeLeft] = useState(60 * 60) // 60 minutos en segundos
  const [isLocked, setIsLocked] = useState(false) // Temporalmente desbloqueado
  const [testStarted, setTestStarted] = useState(initialStage === 'test')
  const [results, setResults] = useState(null)
  const [insights, setInsights] = useState(null)
  const [showExitWarning, setShowExitWarning] = useState(false)
  
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

  const clamp = (value, min, max) => Math.min(max, Math.max(min, value))

  const balancePercent = (left, right) => {
    const total = left + right
    if (total <= 0) return 50
    return clamp(Math.round(50 + ((left - right) / total) * 50), 0, 100)
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
    },

    // Bloque 4: Deseo, valores y dirección (12 preguntas)
    {
      id: 31,
      question: 'Si el dinero estuviera resuelto por 2 años, ¿qué elegirías construir con tu tiempo?',
      type: 'scale',
      dimension: 'desire',
      options: [
        { text: 'Un proyecto creativo (arte, diseño, contenido, marca)', value: 5, careers: ['creative', 'design', 'arts', 'media', 'writing'] },
        { text: 'Un producto digital o sistema (software, automatización)', value: 5, careers: ['tech', 'software', 'data', 'engineering'] },
        { text: 'Una práctica de ayuda (terapia, acompañamiento, educación)', value: 5, careers: ['psychology', 'health', 'education', 'counseling'] },
        { text: 'Una iniciativa social/pública (comunidad, derechos, políticas)', value: 5, careers: ['social', 'law', 'politics', 'NGO'] },
        { text: 'Una empresa o servicio (ventas, operaciones, estrategia)', value: 5, careers: ['business', 'entrepreneurship', 'management', 'operations'] }
      ]
    },
    {
      id: 32,
      question: '¿Qué tipo de conversación te enciende por dentro?',
      type: 'scale',
      dimension: 'desire',
      options: [
        { text: 'Sobre ideas y teorías (por qué somos como somos)', value: 5, careers: ['psychology', 'humanities', 'philosophy', 'academic'] },
        { text: 'Sobre cómo mejorar procesos y resultados', value: 5, careers: ['business', 'operations', 'finance', 'engineering'] },
        { text: 'Sobre cómo funcionan los sistemas (código, ciencia, lógica)', value: 5, careers: ['tech', 'science', 'research', 'data'] },
        { text: 'Sobre estética, emoción y creación', value: 5, careers: ['creative', 'design', 'arts'] },
        { text: 'Sobre personas, vínculos y sociedad', value: 5, careers: ['social', 'education', 'health', 'psychology'] }
      ]
    },
    {
      id: 33,
      question: '¿Qué te cuesta más tolerar en un trabajo?',
      type: 'scale',
      dimension: 'constraints',
      options: [
        { text: 'Rutina rígida y poca autonomía', value: 5, careers: ['entrepreneurship', 'creative', 'freelance'] },
        { text: 'Conflictos humanos constantes sin propósito claro', value: 5, careers: ['tech', 'research', 'engineering'] },
        { text: 'Ambigüedad total sin criterios ni estructura', value: 5, careers: ['admin', 'finance', 'operations'] },
        { text: 'Presión por resultados sin ética o sentido', value: 5, careers: ['social', 'education', 'health'] },
        { text: 'Soledad extrema sin intercambio humano', value: 5, careers: ['education', 'social', 'health', 'business'] }
      ]
    },
    {
      id: 34,
      question: '¿Qué te mueve más: sentido, estética, poder, verdad o cuidado?',
      type: 'scale',
      dimension: 'values_core',
      options: [
        { text: 'Sentido/propósito (hacer algo significativo)', value: 5, careers: ['social', 'education', 'psychology'] },
        { text: 'Estética/creación (hacer algo bello)', value: 5, careers: ['creative', 'design', 'arts', 'architecture'] },
        { text: 'Poder/impacto (liderar y decidir)', value: 5, careers: ['business', 'management', 'entrepreneurship'] },
        { text: 'Verdad/conocimiento (comprender y demostrar)', value: 5, careers: ['science', 'research', 'academic'] },
        { text: 'Cuidado/salud (acompañar procesos y sanar)', value: 5, careers: ['health', 'psychology', 'counseling'] }
      ]
    },
    {
      id: 35,
      question: 'Si tu trabajo ideal fuera un escenario, ¿qué rol tendrías?',
      type: 'scale',
      dimension: 'role_identity',
      options: [
        { text: 'Arquitecto de sistemas (estructura y funcionamiento)', value: 5, careers: ['tech', 'engineering', 'operations'] },
        { text: 'Creador (forma, emoción y lenguaje)', value: 5, careers: ['creative', 'design', 'writing', 'arts'] },
        { text: 'Guía/terapeuta (escucha, intervención, transformación)', value: 5, careers: ['psychology', 'health', 'education'] },
        { text: 'Estratega (visión, negociación, mercado)', value: 5, careers: ['business', 'finance', 'consulting', 'sales'] },
        { text: 'Investigador (pregunta, hipótesis, evidencia)', value: 5, careers: ['science', 'research', 'academic', 'data'] }
      ]
    },
    {
      id: 36,
      question: '¿Qué te es más natural: persuadir, cuidar, crear, analizar o construir?',
      type: 'scale',
      dimension: 'natural_drive',
      options: [
        { text: 'Persuadir/negociar y mover decisiones', value: 5, careers: ['business', 'sales', 'management'] },
        { text: 'Cuidar/acompañar y sostener procesos humanos', value: 5, careers: ['health', 'psychology', 'education'] },
        { text: 'Crear/imaginar y traducirlo en forma', value: 5, careers: ['creative', 'design', 'arts'] },
        { text: 'Analizar/entender y explicar con rigor', value: 5, careers: ['science', 'research', 'academic'] },
        { text: 'Construir/hacer funcionar sistemas', value: 5, careers: ['tech', 'engineering', 'operations'] }
      ]
    },
    {
      id: 37,
      question: 'En un entorno nuevo, ¿qué buscas primero?',
      type: 'scale',
      dimension: 'orientation',
      options: [
        { text: 'Personas clave y dinámica del grupo', value: 5, careers: ['social', 'education', 'business'] },
        { text: 'Reglas, procesos y estructura', value: 5, careers: ['admin', 'operations', 'finance'] },
        { text: 'Datos, métricas y hechos', value: 5, careers: ['science', 'data', 'research'] },
        { text: 'Posibilidades creativas y estética', value: 5, careers: ['creative', 'design', 'arts'] },
        { text: 'Herramientas, sistemas y cómo optimizarlos', value: 5, careers: ['tech', 'engineering'] }
      ]
    },
    {
      id: 38,
      question: '¿Qué preferirías dominar antes: una habilidad humana o una técnica?',
      type: 'scale',
      dimension: 'preference_human_tech',
      options: [
        { text: 'Habilidad humana (escucha, liderazgo, enseñanza)', value: 5, careers: ['psychology', 'education', 'management'] },
        { text: 'Habilidad técnica (programar, diseñar, construir)', value: 5, careers: ['tech', 'creative', 'engineering'] },
        { text: 'Habilidad científica (método, investigación, laboratorio)', value: 5, careers: ['science', 'research', 'academic'] },
        { text: 'Habilidad comercial (vender, negociar, escalar)', value: 5, careers: ['business', 'sales', 'entrepreneurship'] },
        { text: 'Una mezcla equilibrada', value: 4, careers: ['business', 'tech', 'education'] }
      ]
    },
    {
      id: 39,
      question: '¿Qué tipo de éxito te da paz (no solo emoción)?',
      type: 'scale',
      dimension: 'peace_success',
      options: [
        { text: 'Ser útil y cercano para otros', value: 5, careers: ['health', 'education', 'social', 'psychology'] },
        { text: 'Hacer una obra/creación propia', value: 5, careers: ['creative', 'arts', 'design', 'writing'] },
        { text: 'Ser competente y respetado por rigor', value: 5, careers: ['science', 'research', 'engineering'] },
        { text: 'Lograr independencia y control de mis decisiones', value: 5, careers: ['business', 'entrepreneurship', 'finance'] },
        { text: 'Resolver problemas difíciles con elegancia', value: 5, careers: ['tech', 'engineering', 'science'] }
      ]
    },
    {
      id: 40,
      question: '¿Qué tan dispuesto estás a especializarte profundamente (años) en un campo?',
      type: 'scale',
      dimension: 'specialization',
      options: [
        { text: 'Mucho, me atrae la maestría', value: 5, careers: ['science', 'research', 'psychology', 'engineering'] },
        { text: 'Medio, prefiero ser generalista fuerte', value: 4, careers: ['business', 'tech', 'consulting'] },
        { text: 'Poco, prefiero variedad constante', value: 3, careers: ['creative', 'entrepreneurship', 'media'] },
        { text: 'Depende: si hay sentido, sí', value: 4, careers: ['health', 'education', 'social'] },
        { text: 'Me interesa más explorar que profundizar', value: 3, careers: ['entrepreneurship', 'creative', 'exploration'] }
      ]
    },
    {
      id: 41,
      question: '¿Qué tipo de problemas evitarías si pudieras elegir?',
      type: 'scale',
      dimension: 'avoidance',
      options: [
        { text: 'Problemas humanos/emocionales intensos', value: 5, careers: ['tech', 'engineering', 'finance'] },
        { text: 'Problemas abstractos sin aplicación práctica', value: 5, careers: ['business', 'sales', 'operations'] },
        { text: 'Problemas técnicos que requieren concentración prolongada', value: 5, careers: ['social', 'education', 'health'] },
        { text: 'Problemas estéticos sin criterios claros', value: 5, careers: ['science', 'engineering', 'admin'] },
        { text: 'Problemas de negociación y conflicto por poder', value: 5, careers: ['research', 'science', 'creative'] }
      ]
    },
    {
      id: 42,
      question: '¿Qué te da más energía en un día de trabajo?',
      type: 'scale',
      dimension: 'energy_source',
      options: [
        { text: 'Cerrar un acuerdo o mover una estrategia', value: 5, careers: ['business', 'sales', 'management'] },
        { text: 'Tener una conversación profunda y significativa', value: 5, careers: ['psychology', 'education', 'social'] },
        { text: 'Resolver un bug o un problema técnico complejo', value: 5, careers: ['tech', 'engineering', 'data'] },
        { text: 'Diseñar algo bello y funcional', value: 5, careers: ['creative', 'design'] },
        { text: 'Descubrir un patrón nuevo o una hipótesis sólida', value: 5, careers: ['science', 'research', 'academic'] }
      ]
    },

    // Bloque 5: Decisión y mundo real (12 preguntas)
    {
      id: 43,
      question: '¿Qué tanto te importa la estabilidad económica en la elección de carrera?',
      type: 'scale',
      dimension: 'economics',
      options: [
        { text: 'Muchísimo: es prioridad central', value: 5, careers: ['finance', 'business', 'admin'] },
        { text: 'Importa, pero no define todo', value: 4, careers: ['business', 'tech', 'health'] },
        { text: 'Me importa más el sentido que el dinero', value: 5, careers: ['social', 'education', 'psychology'] },
        { text: 'Me importa más la libertad que la estabilidad', value: 5, careers: ['entrepreneurship', 'creative', 'freelance'] },
        { text: 'Depende del momento de vida', value: 3, careers: ['versatile', 'general'] }
      ]
    },
    {
      id: 44,
      question: 'Cuando piensas en “trabajo”, ¿qué imagen aparece primero?',
      type: 'scale',
      dimension: 'work_image',
      options: [
        { text: 'Un espacio de creación y expresión', value: 5, careers: ['creative', 'design', 'arts'] },
        { text: 'Un espacio de servicio y cuidado', value: 5, careers: ['health', 'psychology', 'education'] },
        { text: 'Un espacio de análisis y método', value: 5, careers: ['science', 'research', 'academic'] },
        { text: 'Un espacio de estrategia y logro', value: 5, careers: ['business', 'management', 'entrepreneurship'] },
        { text: 'Un espacio de construcción técnica', value: 5, careers: ['tech', 'engineering'] }
      ]
    },
    {
      id: 45,
      question: '¿Qué te atrae más: profundidad, velocidad o visibilidad?',
      type: 'scale',
      dimension: 'tempo',
      options: [
        { text: 'Profundidad (entender a fondo)', value: 5, careers: ['research', 'science', 'psychology'] },
        { text: 'Velocidad (iterar y mover rápido)', value: 5, careers: ['tech', 'entrepreneurship', 'business'] },
        { text: 'Visibilidad (presentar y comunicar)', value: 5, careers: ['education', 'media', 'business'] },
        { text: 'Equilibrio según proyecto', value: 4, careers: ['consulting', 'management', 'tech'] },
        { text: 'Depende del equipo, no de mí', value: 3, careers: ['admin', 'operations'] }
      ]
    },
    {
      id: 46,
      question: '¿Cómo te llevas con vender (ideas, servicios, productos)?',
      type: 'scale',
      dimension: 'selling',
      options: [
        { text: 'Me gusta y se me da bien', value: 5, careers: ['sales', 'business', 'entrepreneurship'] },
        { text: 'Puedo hacerlo si es ético y útil', value: 4, careers: ['education', 'health', 'business'] },
        { text: 'Me incomoda; prefiero que hable el trabajo', value: 4, careers: ['research', 'tech', 'creative'] },
        { text: 'Lo evitaría si pudiera', value: 3, careers: ['science', 'engineering', 'support'] },
        { text: 'Depende del contexto', value: 3, careers: ['versatile', 'general'] }
      ]
    },
    {
      id: 47,
      question: '¿Qué tipo de responsabilidad prefieres cargar?',
      type: 'scale',
      dimension: 'responsibility',
      options: [
        { text: 'Responsabilidad técnica (que funcione)', value: 5, careers: ['tech', 'engineering', 'operations'] },
        { text: 'Responsabilidad humana (que el otro esté bien)', value: 5, careers: ['health', 'psychology', 'education'] },
        { text: 'Responsabilidad económica (resultado, presupuesto)', value: 5, careers: ['business', 'finance', 'management'] },
        { text: 'Responsabilidad creativa (forma, narrativa, estética)', value: 5, careers: ['creative', 'design', 'media'] },
        { text: 'Responsabilidad científica (evidencia y rigor)', value: 5, careers: ['science', 'research', 'academic'] }
      ]
    },
    {
      id: 48,
      question: '¿Qué tipo de feedback te ayuda más?',
      type: 'scale',
      dimension: 'feedback',
      options: [
        { text: 'Métricas y datos', value: 5, careers: ['data', 'science', 'business'] },
        { text: 'Observación cualitativa (lo que provocó en alguien)', value: 5, careers: ['psychology', 'education', 'creative'] },
        { text: 'Revisión técnica (calidad, estándares)', value: 5, careers: ['tech', 'engineering', 'science'] },
        { text: 'Reconocimiento público (audiencia, impacto)', value: 5, careers: ['media', 'business', 'arts'] },
        { text: 'Un mentor con criterio', value: 4, careers: ['research', 'health', 'trades'] }
      ]
    },
    {
      id: 49,
      question: '¿Qué te pesa más cuando eliges un camino?',
      type: 'scale',
      dimension: 'decision_weight',
      options: [
        { text: 'Seguridad y previsibilidad', value: 5, careers: ['admin', 'finance', 'operations'] },
        { text: 'Impacto humano', value: 5, careers: ['health', 'psychology', 'social'] },
        { text: 'Libertad y autonomía', value: 5, careers: ['entrepreneurship', 'creative', 'freelance'] },
        { text: 'Desafío intelectual', value: 5, careers: ['science', 'research', 'tech'] },
        { text: 'Posibilidad de liderazgo', value: 5, careers: ['business', 'management', 'entrepreneurship'] }
      ]
    },
    {
      id: 50,
      question: '¿Con qué te identificas más?',
      type: 'scale',
      dimension: 'identity_axis',
      options: [
        { text: 'Soy constructor de soluciones', value: 5, careers: ['tech', 'engineering', 'operations'] },
        { text: 'Soy intérprete de lo humano', value: 5, careers: ['psychology', 'humanities', 'education'] },
        { text: 'Soy creador de formas y experiencias', value: 5, careers: ['creative', 'design', 'arts'] },
        { text: 'Soy estratega de resultados', value: 5, careers: ['business', 'finance', 'management'] },
        { text: 'Soy buscador de verdad', value: 5, careers: ['science', 'research', 'academic'] }
      ]
    },
    {
      id: 51,
      question: '¿Qué tan importante es para ti trabajar con ética explícita?',
      type: 'scale',
      dimension: 'ethics',
      options: [
        { text: 'Es central; sin ética no puedo sostenerlo', value: 5, careers: ['health', 'psychology', 'social'] },
        { text: 'Importa; busco coherencia', value: 4, careers: ['education', 'business', 'science'] },
        { text: 'Depende del rol y del sistema', value: 3, careers: ['operations', 'admin', 'engineering'] },
        { text: 'No lo pienso tanto, priorizo resultados', value: 3, careers: ['business', 'sales', 'entrepreneurship'] },
        { text: 'Me guía más la evidencia y el método', value: 4, careers: ['science', 'research', 'tech'] }
      ]
    },
    {
      id: 52,
      question: 'Si hoy tuvieras que elegir una sola dirección para 12 meses, ¿cuál sería?',
      type: 'scale',
      dimension: '12_month_choice',
      options: [
        { text: 'Estudiar/entrenarme técnicamente (código, datos, ingeniería)', value: 5, careers: ['tech', 'data', 'engineering'] },
        { text: 'Entrenar una habilidad humana (terapia, enseñanza, liderazgo)', value: 5, careers: ['psychology', 'education', 'management'] },
        { text: 'Construir un portafolio creativo (diseño, contenido, arte)', value: 5, careers: ['creative', 'design', 'arts', 'media'] },
        { text: 'Escalar un proyecto de negocio (ventas, estrategia)', value: 5, careers: ['business', 'sales', 'entrepreneurship'] },
        { text: 'Entrar en investigación/metodología (ciencia, papers)', value: 5, careers: ['science', 'research', 'academic'] }
      ]
    },
    {
      id: 53,
      question: '¿Qué tanto disfrutas la precisión y el detalle?',
      type: 'scale',
      dimension: 'precision',
      options: [
        { text: 'Mucho, me calma y me ordena', value: 5, careers: ['engineering', 'finance', 'operations'] },
        { text: 'Me gusta si tiene sentido práctico', value: 4, careers: ['tech', 'business', 'health'] },
        { text: 'Me aburre; prefiero visión general', value: 3, careers: ['entrepreneurship', 'creative', 'management'] },
        { text: 'Depende: en arte sí, en burocracia no', value: 4, careers: ['creative', 'design', 'arts'] },
        { text: 'Prefiero exploración, no exactitud', value: 3, careers: ['exploration', 'media', 'arts'] }
      ]
    },
    {
      id: 54,
      question: 'Cuando te imaginas creciendo, ¿qué te entusiasma más?',
      type: 'scale',
      dimension: 'growth_direction',
      options: [
        { text: 'Ser referente técnico', value: 5, careers: ['tech', 'engineering', 'data'] },
        { text: 'Acompañar procesos humanos complejos', value: 5, careers: ['psychology', 'health', 'education'] },
        { text: 'Crear obras, marcas o experiencias', value: 5, careers: ['creative', 'design', 'arts'] },
        { text: 'Liderar equipos y proyectos grandes', value: 5, careers: ['business', 'management', 'entrepreneurship'] },
        { text: 'Investigar y producir conocimiento', value: 5, careers: ['science', 'research', 'academic'] }
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
    const dimensionWeights = {
      motivation: 1.2,
      satisfaction: 1.2,
      values: 1.15,
      values_core: 1.25,
      desire: 1.25,
      constraints: 1.1,
      work_style: 1.05,
      problem_solving: 1.1,
      learning: 1.05,
      cognition: 1.05,
      decision_making: 1.05,
      tolerance: 1.1,
      resilience: 1.1,
      stress: 1.1,
      social_interaction: 1.05
    }

    const normalizeTag = (tag) => (tag || '').toString().trim().toLowerCase()

    const tagToProfileKey = (rawTag) => {
      const tag = normalizeTag(rawTag)
      if (!tag) return null

      // Psicología / Humano
      if (['psychology', 'psicologia', 'counseling', 'therapy', 'terapia', 'coaching'].includes(tag)) return 'psychology'

      // Salud
      if (['health', 'medicine', 'medicina', 'nutrition', 'nutricion', 'emergency', 'fitness'].includes(tag)) return 'health'

      // Educación
      if (['education', 'teaching', 'docencia', 'e-learning', 'elearning', 'pedagogy', 'pedagogia'].includes(tag)) return 'education'

      // Ciencia / investigación
      if (['science', 'research', 'academic', 'investigation', 'lab', 'data', 'ia/ml', 'ai/ml'].includes(tag)) return 'science'

      // Tecnología
      if (['tech', 'software', 'programming', 'code', 'coding', 'cybersecurity', 'devops', 'web', 'product'].includes(tag)) return 'tech'

      // Ingeniería
      if (['engineering', 'construction', 'manufacturing', 'industrial', 'civil', 'electrical', 'mechanical'].includes(tag)) return 'engineering'

      // Creativo
      if (['creative', 'design', 'arts', 'art', 'music', 'writing', 'media', 'entertainment', 'architecture', 'ux/ui', 'ux', 'ui'].includes(tag)) return 'creative'

      // Negocios
      if (['business', 'finance', 'sales', 'marketing', 'consulting', 'management', 'operations', 'admin', 'project-management', 'hr'].includes(tag)) return 'business'

      // Emprendimiento
      if (['entrepreneurship', 'startup', 'startups', 'innovation', 'freelance'].includes(tag)) return 'entrepreneurship'

      // Derivaciones por proximidad (tags “sueltos”)
      if (['humanities', 'philosophy', 'social', 'ngo', 'law', 'politics', 'journalism', 'human-rights', 'rights'].includes(tag)) return 'social'
      if (['sports', 'hospitality', 'service'].includes(tag)) return 'business'

      return null
    }

    const profileToCluster = {
      psychology: 'Humano',
      health: 'Cuidado',
      education: 'Humano',
      social: 'Humano',
      creative: 'Creativo',
      tech: 'Sistemas',
      engineering: 'Sistemas',
      science: 'Analítico',
      business: 'Estrategia',
      entrepreneurship: 'Estrategia'
    }

    const clusters = {
      Humano: { label: 'Humano', icon: Users, color: 'from-purple-500 to-fuchsia-500' },
      Cuidado: { label: 'Cuidado', icon: Heart, color: 'from-pink-500 to-rose-500' },
      Creativo: { label: 'Creativo', icon: Palette, color: 'from-fuchsia-500 to-purple-500' },
      Sistemas: { label: 'Sistemas', icon: Code, color: 'from-cyan-500 to-blue-500' },
      Analítico: { label: 'Analítico', icon: Activity, color: 'from-indigo-500 to-purple-500' },
      Estrategia: { label: 'Estrategia', icon: TrendingUp, color: 'from-amber-500 to-orange-500' }
    }

    const careerScores = {}
    const clusterScores = {}
    Object.keys(careerProfiles).forEach(key => { careerScores[key] = 0 })
    Object.keys(clusters).forEach(key => { clusterScores[key] = 0 })

    let mappedTagsCount = 0
    let totalTagsCount = 0

    let peopleScore = 0
    let systemsScore = 0
    let creativeScore = 0
    let structureScore = 0
    let riskScore = 0
    let stabilityScore = 0

    const answered = Object.keys(answers).length
    if (answered === 0) return

    Object.entries(answers).forEach(([questionId, answer]) => {
      const question = questions.find(q => q.id === Number(questionId))
      const w = dimensionWeights[question?.dimension] ?? 1

      const value = Number(answer?.value ?? 0)
      const tags = Array.isArray(answer?.careers) ? answer.careers : []
      totalTagsCount += tags.length

      tags.forEach((tag) => {
        const profileKey = tagToProfileKey(tag)
        if (!profileKey) return
        mappedTagsCount += 1

        const points = value * w
        if (careerScores[profileKey] !== undefined) {
          careerScores[profileKey] += points
        }

        const clusterKey = profileToCluster[profileKey]
        if (clusterKey && clusterScores[clusterKey] !== undefined) {
          clusterScores[clusterKey] += points
        }

        // Ejes simples (orientativos)
        if (['psychology', 'health', 'education', 'social'].includes(profileKey)) peopleScore += points
        if (['tech', 'engineering', 'science'].includes(profileKey)) systemsScore += points
        if (['creative'].includes(profileKey)) creativeScore += points
        if (['business', 'engineering', 'science'].includes(profileKey)) structureScore += points
        if (['entrepreneurship', 'creative'].includes(profileKey)) riskScore += points
        if (['admin', 'finance', 'operations'].includes(normalizeTag(tag))) stabilityScore += points
      })
    })

    // Normalización: cada respuesta suele aportar ~3 tags (para evitar saturar a 100%)
    const denom = answered * 5 * 1.25 * 3
    const normalizedScores = Object.entries(careerScores)
      .map(([career, score]) => ({
        career,
        score,
        percentage: clamp(Math.round((score / denom) * 100), 0, 100),
        profile: careerProfiles[career]
      }))
      .sort((a, b) => b.score - a.score)

    const clusterMax = Math.max(1, ...Object.values(clusterScores))
    const clusterSummary = Object.entries(clusterScores)
      .map(([key, score]) => ({
        key,
        score,
        percentage: clamp(Math.round((score / clusterMax) * 100), 0, 100),
        meta: clusters[key]
      }))
      .sort((a, b) => b.score - a.score)

    setInsights({
      coverage: {
        mappedTagsCount,
        totalTagsCount
      },
      axes: {
        peopleVsSystems: balancePercent(peopleScore, systemsScore),
        creativityVsStructure: balancePercent(creativeScore, structureScore),
        riskVsStability: balancePercent(riskScore, stabilityScore)
      },
      clusters: clusterSummary
    })

    setResults(normalizedScores)
    setStage('results')
  }
  
  const startTest = () => {
    if (isLocked) {
      // Aquí iría la lógica de pago
      alert('Funcionalidad de pago próximamente')
      return
    }
    navigate('/test-vocacional/iniciar')
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
              {/* Timer (visible desde que aparece el botón de iniciar) */}
              <div className="fixed top-24 right-6 z-50 flex items-center gap-2 px-3 py-2 bg-black/70 backdrop-blur-md rounded-full border border-white/10">
                <Clock className="w-4 h-4 text-purple-400" />
                <span className="font-mono text-sm text-white/90">{formatTime(timeLeft)}</span>
              </div>
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
                54 preguntas diseñadas para aproximarte a tu dirección vocacional desde tu deseo, tus valores y tu estilo de decisión.
              </motion.p>
              
              <motion.div
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.4 }}
                className="grid md:grid-cols-3 gap-6 mb-12"
              >
                <div className="p-6 bg-white/5 border border-white/10 rounded-xl">
                  <Clock className="w-8 h-8 mx-auto mb-3 text-purple-400" />
                  <h3 className="font-bold mb-2">60 minutos</h3>
                  <p className="text-sm text-white/60">Tiempo límite para completar</p>
                </div>
                <div className="p-6 bg-white/5 border border-white/10 rounded-xl">
                  <CheckCircle className="w-8 h-8 mx-auto mb-3 text-fuchsia-400" />
                  <h3 className="font-bold mb-2">54 preguntas</h3>
                  <p className="text-sm text-white/60">Análisis multidimensional</p>
                </div>
                <div className="p-6 bg-white/5 border border-white/10 rounded-xl">
                  <Target className="w-8 h-8 mx-auto mb-3 text-cyan-400" />
                  <h3 className="font-bold mb-2">10 rutas</h3>
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
                  <button
                    type="button"
                    onClick={() => setShowExitWarning(true)}
                    className="flex items-center gap-2 px-3 py-2 rounded-full border border-white/10 bg-white/5 hover:border-white/30 transition-all"
                    aria-label="Salir del test"
                  >
                    <Home className="w-4 h-4 text-white/80" />
                    <span className="text-xs text-white/70 hidden sm:inline">Salir</span>
                  </button>

                  <span className="text-sm text-white/60">
                    Pregunta {currentQuestion + 1} de {questions.length}
                  </span>

                  <div className="flex items-center gap-2">
                    <Clock className="w-5 h-5 text-purple-400" />
                    <span className="font-mono text-lg">{formatTime(timeLeft)}</span>
                  </div>
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

            {/* Exit confirmation */}
            <AnimatePresence>
              {showExitWarning && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="fixed inset-0 z-[60] flex items-center justify-center px-6 bg-black/80"
                >
                  <motion.div
                    initial={{ y: 20, opacity: 0, scale: 0.98 }}
                    animate={{ y: 0, opacity: 1, scale: 1 }}
                    exit={{ y: 20, opacity: 0, scale: 0.98 }}
                    className="w-full max-w-md p-6 bg-[#0A0A0A] border border-white/10 rounded-2xl"
                  >
                    <div className="flex items-start gap-3 mb-4">
                      <div className="w-10 h-10 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center">
                        <AlertCircle className="w-5 h-5 text-fuchsia-400" />
                      </div>
                      <div>
                        <h3 className="text-lg font-bold">¿Salir del test?</h3>
                        <p className="text-sm text-white/60">
                          Si sales ahora, perderás tu progreso actual.
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center justify-end gap-3">
                      <button
                        type="button"
                        onClick={() => setShowExitWarning(false)}
                        className="px-4 py-2 rounded-full border border-white/15 bg-white/5 hover:border-white/30 transition-all"
                      >
                        Continuar
                      </button>
                      <button
                        type="button"
                        onClick={() => navigate('/')}
                        className="px-5 py-2 rounded-full bg-gradient-to-r from-purple-500 to-fuchsia-500 font-bold"
                      >
                        Salir
                      </button>
                    </div>
                  </motion.div>
                </motion.div>
              )}
            </AnimatePresence>
            
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

              {/* Insights / charts */}
              {insights && (
                <div className="grid lg:grid-cols-2 gap-6 mb-12">
                  <div className="p-6 bg-white/5 border border-white/10 rounded-2xl">
                    <div className="flex items-center gap-3 mb-6">
                      <div className="w-10 h-10 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center">
                        <BarChart3 className="w-5 h-5 text-purple-400" />
                      </div>
                      <div>
                        <h3 className="text-lg font-bold">Mapa de inclinaciones</h3>
                        <p className="text-sm text-white/60">Lectura orientativa por clúster</p>
                      </div>
                    </div>

                    <div className="space-y-4">
                      {insights.clusters.slice(0, 6).map((c) => {
                        const Icon = c.meta.icon
                        return (
                          <div key={c.key}>
                            <div className="flex items-center justify-between mb-2">
                              <div className="flex items-center gap-2 text-sm text-white/80">
                                <Icon className="w-4 h-4 text-white/70" />
                                <span className="font-medium">{c.meta.label}</span>
                              </div>
                              <span className="text-xs text-white/60">{c.percentage}%</span>
                            </div>
                            <div className="h-2 bg-white/10 rounded-full overflow-hidden">
                              <div
                                className={`h-full bg-gradient-to-r ${c.meta.color}`}
                                style={{ width: `${c.percentage}%` }}
                              />
                            </div>
                          </div>
                        )
                      })}
                    </div>
                  </div>

                  <div className="p-6 bg-white/5 border border-white/10 rounded-2xl">
                    <div className="flex items-center gap-3 mb-6">
                      <div className="w-10 h-10 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center">
                        <PieChart className="w-5 h-5 text-fuchsia-400" />
                      </div>
                      <div>
                        <h3 className="text-lg font-bold">Ejes de decisión</h3>
                        <p className="text-sm text-white/60">Lectura orientativa (no diagnóstica)</p>
                      </div>
                    </div>

                    <div className="space-y-6">
                      <div>
                        <div className="flex items-center justify-between text-sm mb-2">
                          <span className="text-white/70">Humano</span>
                          <span className="text-white/70">Sistemas</span>
                        </div>
                        <div className="h-2 bg-white/10 rounded-full overflow-hidden">
                          <div className="h-full bg-gradient-to-r from-purple-500 to-fuchsia-500" style={{ width: `${insights.axes.peopleVsSystems}%` }} />
                        </div>
                      </div>

                      <div>
                        <div className="flex items-center justify-between text-sm mb-2">
                          <span className="text-white/70">Creatividad</span>
                          <span className="text-white/70">Estructura</span>
                        </div>
                        <div className="h-2 bg-white/10 rounded-full overflow-hidden">
                          <div className="h-full bg-gradient-to-r from-fuchsia-500 to-purple-500" style={{ width: `${insights.axes.creativityVsStructure}%` }} />
                        </div>
                      </div>

                      <div>
                        <div className="flex items-center justify-between text-sm mb-2">
                          <span className="text-white/70">Riesgo</span>
                          <span className="text-white/70">Estabilidad</span>
                        </div>
                        <div className="h-2 bg-white/10 rounded-full overflow-hidden">
                          <div className="h-full bg-gradient-to-r from-amber-500 to-orange-500" style={{ width: `${insights.axes.riskVsStability}%` }} />
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}
              
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
