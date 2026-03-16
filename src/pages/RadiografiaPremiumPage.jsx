import { motion, AnimatePresence } from 'framer-motion'
import { useState, useRef, useCallback, useEffect, lazy, Suspense } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  ArrowRight, ArrowLeft, Check, Sparkles, Mic, MicOff, Volume2, VolumeX,
  Loader2, ChevronDown, AlertTriangle, TrendingUp, TrendingDown, Star,
  Shield, Activity, Brain, Heart, Zap, Eye, Target, Users, Flame,
  CheckCircle, Download, PenLine, Send, MessageCircle, Lightbulb, Clock,
  Headphones, SkipForward, Anchor, Compass, Scale, Gift, Repeat, Play, Mail
} from 'lucide-react'
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell, RadarChart as RechartRadar, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar } from 'recharts'
import SEOHead from '../components/SEOHead'
import { analyzeRadiografiaPremium, generateFallbackAnalysis, analyzeCrossRadiografia } from '../services/radiografiaPremiumService'
import { CACHED_PREVIEW_ANALYSIS } from '../data/cachedPreviewAnalysis'
import { saveAnalysis, sendAnalysisEmail, sendBackupEmail, getAnalysis, checkCrossStatus, markPartnerDone, saveCrossAnalysis, sendCrossAnalysisEmail, getCrossAnalysis, getProfile } from '../services/emailApiService'

// ─── 40 PREGUNTAS NARRATIVAS — 5 BLOQUES ────────────────────

const PREGUNTAS = [
  // BLOQUE 0 — Contexto personal y panorama general (Q1–Q5)
  {
    id: 'Q1', block: 'Contexto personal y panorama general',
    mainQuestion: 'Para empezar, cuéntame un poco sobre tu vida actualmente y en qué momento te encuentras hoy.',
    examples: ['¿A qué te dedicas o en qué estás enfocado actualmente?', '¿Cómo describirías el momento de vida en el que te encuentras ahora?', '¿Cuánto tiempo llevas en tu relación actual?', '¿Hay algo que esté pasando en tu vida que creas que impacta tu relación?'],
    examples_descubre: ['¿A qué te dedicas o en qué estás enfocado actualmente?', '¿Cómo describirías el momento de vida en el que te encuentras ahora?', '¿Has tenido relaciones importantes que hayan marcado tu forma de ver el amor?', '¿Hay algo que esté pasando en tu vida que creas que impacta tu forma de relacionarte?']
  },
  {
    id: 'Q2', block: 'Contexto personal y panorama general',
    mainQuestion: 'Cuéntame la historia de tu relación desde el principio hasta hoy, como si estuvieras resumiendo el camino que han recorrido juntos.',
    examples: ['Cómo se conocieron', 'Cómo empezó la conexión entre ustedes', 'Qué momentos recuerdas como importantes', 'Qué etapas o cambios han vivido', 'Cómo ha evolucionado la relación con el tiempo'],
    mainQuestion_descubre: 'Cuéntame sobre tus relaciones pasadas más significativas, como si estuvieras resumiendo tu historia sentimental hasta hoy.',
    examples_descubre: ['Cuáles han sido tus relaciones más importantes', 'Cómo empezaron o terminaron', 'Qué momentos recuerdas como clave', 'Cómo ha sido tu camino sentimental en general']
  },
  {
    id: 'Q3', block: 'Contexto personal y panorama general',
    mainQuestion: 'Pensando en el presente, cuéntame cómo describirías tu relación actualmente y cómo sientes que están las cosas entre ustedes en este momento.',
    examples: ['Cómo te sientes en la relación actualmente', 'Qué cosas están funcionando bien entre ustedes', 'Qué cosas se han vuelto más difíciles', 'Qué ha cambiado con el tiempo'],
    mainQuestion_descubre: 'Pensando en tu vida sentimental hasta hoy, cuéntame cómo describirías tu situación actual y cómo te sientes respecto a las relaciones.',
    examples_descubre: ['Cómo te sientes en este momento respecto al amor', 'Qué has aprendido de tus experiencias pasadas', 'Qué cosas se te han hecho difíciles en tus relaciones', 'Cómo ha ido cambiando lo que buscas']
  },
  {
    id: 'Q4', block: 'Contexto personal y panorama general',
    mainQuestion: 'Háblame de cómo es la vida cotidiana entre ustedes y cómo suelen relacionarse en el día a día.',
    examples: ['Cómo pasan el tiempo juntos normalmente', 'Cómo se cuidan o se apoyan mutuamente en el día a día', 'Cómo suelen comunicarse cuando necesitan algo del otro', 'Si sienten que se protegen mutuamente o si cada uno va por su lado'],
    mainQuestion_descubre: 'Cuando has estado en pareja, cuéntame cómo ha sido tu forma de convivir en el día a día con esa persona.',
    examples_descubre: ['Cómo solías pasar el tiempo con tu pareja', 'Cómo te comunicabas cuando necesitabas algo', 'Si tendías a cuidar al otro o a ir más por tu lado', 'Cómo era tu rutina en pareja']
  },
  {
    id: 'Q5', block: 'Contexto personal y panorama general',
    mainQuestion: 'Cuando miras todo lo que han vivido juntos hasta ahora, cuéntame qué sientes que han construido o desarrollado como pareja a lo largo del tiempo.',
    examples: ['Experiencias importantes que han vivido juntos', 'Cosas que sienten que han logrado como pareja', 'Aprendizajes que han tenido en la relación', 'Cómo ha influido esta relación en tu vida'],
    mainQuestion_descubre: 'Mirando tus experiencias sentimentales en conjunto, cuéntame qué sientes que has construido o aprendido sobre ti mismo a lo largo del tiempo.',
    examples_descubre: ['Experiencias importantes que has vivido en pareja', 'Cosas que sientes que has logrado o aprendido', 'Cómo han influido esas relaciones en quien eres hoy', 'Qué te han dejado esas experiencias']
  },

  // BLOQUE 2 — Origen del vínculo y atracción inicial (Q6–Q10)
  {
    id: 'Q6', block: 'Origen del vínculo y atracción inicial',
    mainQuestion: 'Regresando al inicio de la relación, cuéntame qué fue lo que más te llamó la atención de tu pareja cuando empezaron a conocerse.',
    examples: ['Qué fue lo primero que te atrajo físicamente o emocionalmente', 'Qué cualidades o rasgos de personalidad te llamaban la atención', 'Qué despertó tu curiosidad, admiración o interés', 'Qué tenía esa persona que la hacía especial o diferente para ti'],
    mainQuestion_descubre: 'Pensando en las personas que te han atraído, cuéntame qué suele llamarte la atención al inicio de conocer a alguien.',
    examples_descubre: ['Qué te suele atraer físicamente o emocionalmente de alguien', 'Qué cualidades o rasgos te llaman más la atención', 'Qué despierta tu curiosidad o interés en una persona', 'Qué hace que alguien sea especial o diferente para ti']
  },
  {
    id: 'Q7', block: 'Expresión afectiva y lenguajes del amor',
    mainQuestion: 'Cuéntame cómo se demuestran cariño o amor entre ustedes en el día a día, y cómo te gusta a ti que te lo demuestren.',
    examples: ['Si se expresan más con palabras, con gestos, con tiempo juntos o con contacto físico', 'Cómo te gusta que te demuestren que te quieren', 'Cómo le demuestras tú a tu pareja que la quieres', 'Si hay diferencias en la forma en que cada uno expresa o necesita recibir amor'],
    mainQuestion_descubre: 'Cuéntame cómo sueles demostrar cariño o amor en una relación, y cómo te gusta que te lo demuestren a ti.',
    examples_descubre: ['Si te expresas más con palabras, gestos, tiempo o contacto físico', 'Cómo te gusta que te demuestren que te quieren', 'Cómo sueles demostrarle tú a la otra persona', 'Si has notado diferencias entre lo que necesitas y lo que das']
  },
  {
    id: 'Q8', block: 'Origen del vínculo y atracción inicial',
    mainQuestion: 'Mirando la historia de la relación, cuéntame qué momentos o etapas recuerdas como especialmente importantes o significativas en el camino que han recorrido juntos.',
    examples: ['Momentos felices o significativos', 'Momentos difíciles que recuerdas', 'Etapas que cambiaron la relación', 'Situaciones que marcaron el vínculo'],
    mainQuestion_descubre: 'Mirando tu historia sentimental, cuéntame qué momentos o etapas recuerdas como especialmente importantes o significativos.',
    examples_descubre: ['Momentos felices o significativos en tus relaciones', 'Momentos difíciles que recuerdas', 'Etapas que cambiaron tu forma de ver el amor', 'Situaciones que marcaron tus vínculos']
  },
  {
    id: 'Q9', block: 'Origen del vínculo y atracción inicial',
    mainQuestion: 'Cuando la relación estaba comenzando, cuéntame cómo imaginabas que podría ser el futuro entre ustedes o hacia dónde sentías que podía ir la relación.',
    examples: ['Qué imaginabas que podría pasar entre ustedes', 'Qué esperabas de la relación en ese momento', 'Qué tipo de relación pensabas que podrían tener', 'Qué futuro imaginabas posible'],
    mainQuestion_descubre: 'Cuando empezabas una relación, cuéntame cómo solías imaginar el futuro con esa persona o qué esperabas que pasara.',
    examples_descubre: ['Qué solías imaginar que podría pasar', 'Qué esperabas de esas relaciones', 'Qué tipo de relación pensabas que podrías tener', 'Qué futuro visualizabas']
  },
  {
    id: 'Q10', block: 'Origen del vínculo y atracción inicial',
    mainQuestion: 'Pensando en lo que sentías por tu pareja en ese momento, cuéntame qué representaba esa persona para ti o qué sentías que encontrabas en esa relación.',
    examples: ['Qué significaba esa persona en tu vida', 'Qué te hacía sentir esa relación', 'Qué creías que esa persona aportaba a tu vida', 'Qué encontrabas en esa conexión'],
    mainQuestion_descubre: 'Pensando en las personas que han sido importantes para ti, cuéntame qué solías encontrar en esos vínculos o qué representaban para ti.',
    examples_descubre: ['Qué significaban esas personas en tu vida', 'Qué te hacían sentir esas relaciones', 'Qué creías que aportaban a tu vida', 'Qué buscabas en esas conexiones']
  },

  // BLOQUE 3 — Historia emocional y patrones relacionales (Q11–Q20)
  {
    id: 'Q11', block: 'Historia emocional y patrones relacionales',
    mainQuestion: 'Ahora me gustaría que me cuentes un poco sobre el ambiente en el que creciste y cómo era la relación entre las personas que te criaron o las figuras importantes de tu infancia.',
    examples: ['Cómo se trataban entre ellos', 'Qué tipo de relación tenían', 'Cómo resolvían conflictos', 'Qué recuerdas de la dinámica entre ellos']
  },
  {
    id: 'Q12', block: 'Historia emocional y patrones relacionales',
    mainQuestion: 'Pensando en lo que viste o viviste mientras crecías, cuéntame qué ideas o creencias sobre el amor y las relaciones sientes que aprendiste en tu familia o en las relaciones que observabas a tu alrededor.',
    examples: ['Qué pensabas que era el amor', 'Qué creencias viste sobre las relaciones', 'Qué cosas aprendiste directa o indirectamente', 'Qué tipo de relación parecía "normal" para ti']
  },
  {
    id: 'Q13', block: 'Historia emocional y patrones relacionales',
    mainQuestion: 'Hoy que estás en una relación, cuéntame si hay algo de la forma en que se relacionaban las personas de tu familia que sientas que de alguna manera también aparece en tu forma de relacionarte con tu pareja.',
    examples: ['Comportamientos que reconoces repetir', 'Formas de reaccionar que te recuerdan a tu familia', 'Dinámicas que se parecen a lo que viste crecer', 'Cosas que te sorprende notar en ti mismo'],
    mainQuestion_descubre: 'Cuéntame si hay algo de la forma en que se relacionaban las personas de tu familia que sientas que aparece en tu forma de relacionarte en pareja.',
    examples_descubre: ['Comportamientos que reconoces repetir en tus relaciones', 'Formas de reaccionar que te recuerdan a tu familia', 'Dinámicas que se parecen a lo que viste crecer', 'Cosas que te sorprende notar en ti cuando estás con alguien']
  },
  {
    id: 'Q14', block: 'Historia emocional y patrones relacionales',
    mainQuestion: 'Antes de esta relación, cuéntame cómo fueron tus relaciones importantes anteriores y qué cosas sientes que aprendiste de ellas.',
    examples: ['Experiencias que recuerdas de relaciones anteriores y qué aprendiste', 'Si sientes que hay patrones que se repiten entre relaciones', 'Dinámicas que reconoces que aparecen una y otra vez', 'Qué descubriste sobre lo que buscas o no buscas en una pareja'],
    mainQuestion_descubre: 'Cuéntame cómo han sido tus relaciones importantes y qué cosas sientes que has aprendido de ellas.',
    examples_descubre: ['Experiencias que recuerdas de tus relaciones y qué aprendiste', 'Si sientes que hay patrones que se repiten entre relaciones', 'Dinámicas que reconoces que aparecen una y otra vez', 'Qué has descubierto sobre lo que buscas o no buscas en una pareja']
  },
  {
    id: 'Q15', block: 'Identidad y autonomía dentro de la relación',
    mainQuestion: 'Dentro de tu relación, cuéntame qué tanto sientes que puedes ser tú mismo/a sin perder tu identidad o tus propios espacios.',
    examples: ['Si sientes que puedes expresar lo que piensas y sientes libremente', 'Si mantienes actividades, amistades o intereses propios fuera de la relación', 'Si alguna vez sientes que te adaptas demasiado para evitar conflicto', 'Qué tanto espacio personal necesitas y qué tanto sientes que tienes'],
    mainQuestion_descubre: 'Cuando has estado en pareja, cuéntame qué tanto has sentido que puedes ser tú mismo/a sin perder tu identidad o tus propios espacios.',
    examples_descubre: ['Si sentías que podías expresarte libremente', 'Si mantenías tus actividades e intereses propios', 'Si te adaptabas demasiado para evitar conflicto', 'Qué tanto necesitas tu espacio personal en una relación']
  },
  {
    id: 'Q16', block: 'Regulación emocional y equipo de pareja',
    mainQuestion: 'Cuéntame si sienten que funcionan como equipo cuando las cosas se ponen difíciles, o si cada uno tiende a manejar las cosas por su lado.',
    examples: ['Cómo se cuidan o protegen mutuamente en momentos de estrés', 'Si cuando uno está mal el otro lo nota y responde', 'Si sienten que se regulan emocionalmente juntos o cada uno por su cuenta', 'Si hay momentos en que uno necesita al otro y no lo encuentra disponible'],
    mainQuestion_descubre: 'En tus relaciones pasadas, cuéntame si sentías que funcionaban como equipo cuando las cosas se ponían difíciles, o si cada uno manejaba las cosas por su lado.',
    examples_descubre: ['Cómo se cuidaban mutuamente en momentos difíciles', 'Si tu pareja notaba cuando estabas mal y respondía', 'Si regulaban sus emociones juntos o por separado', 'Si hubo momentos en que necesitabas al otro y no estaba disponible']
  },
  {
    id: 'Q17', block: 'Historia emocional y patrones relacionales',
    mainQuestion: 'En tu relación actual, cuéntame cómo suelen empezar los desacuerdos o discusiones cuando aparecen.',
    examples: ['Qué situaciones suelen generar conflicto', 'Cómo empieza normalmente una discusión', 'Qué suele ocurrir al principio del conflicto', 'Qué suele pasar entre ustedes cuando surge una diferencia'],
    mainQuestion_descubre: 'En tus relaciones pasadas, cuéntame cómo solían empezar los desacuerdos o discusiones cuando aparecían.',
    examples_descubre: ['Qué situaciones solían generar conflicto', 'Cómo empezaba normalmente una discusión', 'Qué solía ocurrir al principio del conflicto', 'Qué patrones reconoces que se repetían']
  },
  {
    id: 'Q18', block: 'Historia emocional y patrones relacionales',
    mainQuestion: 'Cuando aparece un conflicto o una discusión en la relación, cuéntame cómo reaccionas tú normalmente en ese momento.',
    examples: ['Qué sueles sentir primero', 'Qué haces normalmente en ese momento', 'Cómo respondes frente a la discusión', 'Cómo manejas tus emociones cuando hay tensión'],
    mainQuestion_descubre: 'Cuando aparece un conflicto o una discusión en tus relaciones, cuéntame cómo reaccionas tú normalmente en ese momento.',
    examples_descubre: ['Qué sueles sentir primero', 'Qué haces normalmente en ese momento', 'Cómo respondes frente a la discusión', 'Cómo manejas tus emociones cuando hay tensión en la relación']
  },
  {
    id: 'Q19', block: 'Historia emocional y patrones relacionales',
    mainQuestion: 'Cuando hay un desacuerdo o una discusión entre ustedes, cuéntame cómo suele reaccionar tu pareja.',
    examples: ['Cómo responde tu pareja al conflicto', 'Qué suele hacer o decir', 'Cómo maneja sus emociones en esos momentos', 'Qué suele ocurrir después de una discusión'],
    mainQuestion_descubre: 'En tus relaciones pasadas, cuéntame cómo solían reaccionar tus parejas al conflicto.',
    examples_descubre: ['Cómo respondían al conflicto normalmente', 'Qué solían hacer o decir', 'Cómo manejaban sus emociones en esos momentos', 'Si notas un patrón en la forma de reaccionar de tus parejas']
  },
  {
    id: 'Q20', block: 'Historia emocional y patrones relacionales',
    mainQuestion: 'Pensando en los conflictos que han tenido, cuéntame qué suele pasar después de una discusión o desacuerdo entre ustedes.',
    examples: ['Cómo termina normalmente una discusión', 'Si suelen hablar después del conflicto', 'Si alguien suele dar el primer paso para resolverlo', 'Qué pasa entre ustedes después de esos momentos'],
    mainQuestion_descubre: 'Pensando en los conflictos que has tenido en pareja, cuéntame qué solía pasar después de una discusión o desacuerdo.',
    examples_descubre: ['Cómo terminaban normalmente las discusiones', 'Si solías hablar después del conflicto', 'Quién solía dar el primer paso', 'Qué pasaba entre ustedes después de esos momentos']
  },

  // BLOQUE 4 — Deseo, intimidad y dinámica emocional (Q21–Q30)
  {
    id: 'Q21', block: 'Deseo, intimidad y dinámica emocional',
    mainQuestion: 'Cuéntame qué cosas de tu pareja siguen despertando atracción o deseo en ti hoy en día.',
    examples: ['Aspectos físicos que te siguen atrayendo', 'Formas de ser o actitudes que te generan deseo', 'Momentos en los que sientes atracción o erotismo', 'Situaciones que reactivan la atracción entre ustedes'],
    mainQuestion_descubre: 'Cuéntame qué cosas de una persona suelen despertarte atracción o deseo, y cómo has vivido eso en tus relaciones.',
    examples_descubre: ['Aspectos físicos que te suelen atraer', 'Formas de ser o actitudes que te generan deseo', 'Momentos en los que has sentido atracción fuerte', 'Qué hace que mantengas o pierdas el deseo con el tiempo']
  },
  {
    id: 'Q22', block: 'Deseo, intimidad y dinámica emocional',
    mainQuestion: 'Cuéntame cómo describirías la cercanía emocional que existe entre ustedes actualmente.',
    examples: ['Momentos en los que se sienten conectados', 'Conversaciones o experiencias que los acercan', 'Situaciones en las que se sienten comprendidos', 'Momentos en que sienten distancia emocional'],
    mainQuestion_descubre: 'Cuéntame cómo has vivido la cercanía emocional en tus relaciones y cómo describes esas conexiones.',
    examples_descubre: ['Momentos en los que te has sentido realmente conectado con alguien', 'Conversaciones o experiencias que te han acercado a otra persona', 'Si te has sentido comprendido en pareja', 'Momentos en que has sentido distancia emocional']
  },
  {
    id: 'Q23', block: 'Deseo, intimidad y dinámica emocional',
    mainQuestion: 'Háblame de cómo se vive actualmente la intimidad física o sexual entre ustedes en la relación.',
    examples: ['Cómo se sienten en ese aspecto de la relación', 'Si sienten cercanía o distancia física', 'Si ambos parecen vivirlo de forma similar o diferente', 'Cómo ha cambiado con el tiempo'],
    mainQuestion_descubre: 'Háblame de cómo has vivido la intimidad física o sexual en tus relaciones y qué papel juega para ti.',
    examples_descubre: ['Cómo te has sentido en ese aspecto de tus relaciones', 'Si has sentido cercanía o distancia física', 'Si tus parejas lo vivían de forma similar o diferente a ti', 'Cómo ha cambiado tu relación con la intimidad física']
  },
  {
    id: 'Q24', block: 'Deseo, intimidad y dinámica emocional',
    mainQuestion: 'Pensando en el tiempo que llevan juntos, cuéntame cómo ha cambiado el deseo o la atracción entre ustedes desde el inicio de la relación hasta hoy.',
    examples: ['Cómo era el deseo al inicio', 'Cómo lo percibes ahora', 'Qué situaciones han influido en esos cambios', 'Qué cosas parecen reactivar o disminuir el deseo'],
    mainQuestion_descubre: 'Pensando en tus relaciones, cuéntame cómo ha cambiado el deseo o la atracción a lo largo del tiempo en ellas.',
    examples_descubre: ['Cómo era el deseo al inicio de tus relaciones', 'Cómo evolucionaba con el tiempo', 'Qué situaciones hacían que cambiara', 'Qué cosas reactivaban o disminuían tu deseo']
  },
  {
    id: 'Q25', block: 'Deseo, intimidad y dinámica emocional',
    mainQuestion: 'Cuéntame qué cosas o situaciones suelen hacer que se sientan más cercanos o conectados dentro de la relación.',
    examples: ['Cómo suelen demostrarse cariño o amor en los momentos buenos', 'Si se conectan más con palabras, con gestos, con tiempo juntos o con contacto físico', 'Momentos en los que sienten que funcionan como equipo', 'Qué cosas hace tu pareja que te hacen sentir querido/a o valorado/a'],
    mainQuestion_descubre: 'Cuéntame qué cosas o situaciones suelen hacerte sentir más cercano o conectado con alguien en una relación.',
    examples_descubre: ['Cómo sueles demostrar cariño en los buenos momentos', 'Si te conectas más con palabras, gestos, tiempo o contacto físico', 'Momentos en que has sentido que funcionaban como equipo', 'Qué te hace sentir querido/a o valorado/a']
  },
  {
    id: 'Q26', block: 'Deseo, intimidad y dinámica emocional',
    mainQuestion: 'Cuéntame si hay momentos o situaciones en los que sientes más distancia entre ustedes dentro de la relación.',
    examples: ['Momentos en los que cada uno parece estar en su propio mundo', 'Situaciones que generan distancia emocional', 'Momentos en que la relación parece enfriarse', 'Circunstancias que los separan o desconectan'],
    mainQuestion_descubre: 'Cuéntame si hay momentos o situaciones en los que sueles sentir distancia emocional con la persona con la que estás.',
    examples_descubre: ['Momentos en los que sientes que cada uno está en su mundo', 'Situaciones que generan distancia emocional para ti', 'Cuándo sientes que una relación se enfría', 'Qué circunstancias te desconectan del otro']
  },
  {
    id: 'Q27', block: 'Deseo, intimidad y dinámica emocional',
    mainQuestion: 'Cuando tienen que tomar decisiones importantes dentro de la relación, cuéntame cómo suelen manejar esas situaciones entre ustedes.',
    examples: ['Cómo toman decisiones importantes', 'Cómo manejan las diferencias de opinión', 'Cómo llegan a acuerdos', 'Qué suele pasar cuando no están de acuerdo'],
    mainQuestion_descubre: 'Cuando has tenido que tomar decisiones importantes en pareja, cuéntame cómo solías manejar esas situaciones.',
    examples_descubre: ['Cómo tomabas decisiones importantes con tu pareja', 'Cómo manejabas las diferencias de opinión', 'Cómo llegaban a acuerdos', 'Qué pasaba cuando no estaban de acuerdo']
  },
  {
    id: 'Q28', block: 'Dinámicas de poder y equilibrio emocional',
    mainQuestion: 'Cuéntame si dentro de la relación sientes que hay un equilibrio en el poder y la influencia entre ustedes, o si alguno de los dos suele tener más peso.',
    examples: ['Si alguno suele ceder más que el otro en las decisiones o conflictos', 'Si hay resentimientos acumulados que no se han expresado abiertamente', 'Si alguna vez te has sentido menos escuchado/a o invisible en la relación', 'Si hay momentos de dominación o sumisión emocional entre ustedes'],
    mainQuestion_descubre: 'En tus relaciones pasadas, cuéntame si sentías que había equilibrio en el poder y la influencia, o si alguno de los dos solía tener más peso.',
    examples_descubre: ['Si solías ceder más que el otro en decisiones o conflictos', 'Si acumulabas resentimientos sin expresarlos', 'Si te has sentido menos escuchado/a o invisible', 'Si había dinámicas de dominación o sumisión emocional']
  },
  {
    id: 'Q29', block: 'Deseo, intimidad y dinámica emocional',
    mainQuestion: 'Pensando en tu pareja, cuéntame qué crees que es importante para ella dentro de la relación o qué cosas parece esperar de ti.',
    examples: ['Qué cosas parece valorar más', 'Qué crees que espera de ti', 'Qué cosas parecen importantes para ella', 'Qué cosas le gustaría que fueran diferentes'],
    mainQuestion_descubre: 'Pensando en tus parejas pasadas, cuéntame qué crees que era importante para ellas o qué esperaban de ti en la relación.',
    examples_descubre: ['Qué cosas valoraban más tus parejas', 'Qué crees que esperaban de ti', 'Qué cosas parecían importantes para ellas', 'Qué les hubiera gustado que fuera diferente']
  },
  {
    id: 'Q30', block: 'Deseo, intimidad y dinámica emocional',
    mainQuestion: 'Ahora piensa en lo que tú esperas dentro de la relación y cuéntame qué cosas son importantes para ti.',
    examples: ['Qué tipo de muestras de amor o cariño necesitas para sentirte bien', 'Si necesitas más palabras, más presencia, más contacto o más acciones concretas', 'Qué tanto espacio personal necesitas dentro de la relación para sentirte tú mismo/a', 'Qué cosas te gustaría que fueran diferentes en cómo se demuestran amor'],
    mainQuestion_descubre: 'Cuéntame qué es lo que necesitas y esperas de una relación, qué cosas son realmente importantes para ti.',
    examples_descubre: ['Qué tipo de muestras de amor necesitas para sentirte bien', 'Si necesitas más palabras, presencia, contacto o acciones concretas', 'Qué tanto espacio personal necesitas en una relación', 'Qué cosas te gustaría que fueran diferentes en tus vínculos']
  },

  // BLOQUE 5 — Futuro del vínculo y sentido (Q31–Q40)
  {
    id: 'Q31', block: 'Futuro del vínculo y sentido de la relación',
    mainQuestion: 'Pensando en todo lo que han vivido juntos, cuéntame qué significa hoy esta relación para ti dentro de tu vida.',
    examples: ['Qué lugar ocupa esta relación en tu vida y qué representa para ti', 'Qué te hace sentir que vale la pena seguir construyendo este vínculo', 'Cualidades de tu pareja que aprecias profundamente', 'Razones por las que sientes que esta relación es importante en tu vida'],
    mainQuestion_descubre: 'Pensando en todas tus experiencias sentimentales, cuéntame qué significan hoy las relaciones de pareja dentro de tu vida.',
    examples_descubre: ['Qué lugar ocupa el amor de pareja en tu vida', 'Qué te haría sentir que vale la pena construir un vínculo', 'Qué cualidades aprecias profundamente en una pareja', 'Qué hace que una relación sea importante para ti']
  },
  {
    id: 'Q32', block: 'Futuro del vínculo y sentido de la relación',
    mainQuestion: 'Cuando piensas en el futuro, cuéntame cómo imaginas o visualizas la relación entre ustedes con el paso del tiempo.',
    examples: ['Cómo imaginas la relación en los próximos años', 'Qué cambios o mejoras te gustaría ver en la relación', 'Dinámicas que te gustaría fortalecer o transformar', 'Qué cosas te gustaría construir juntos hacia adelante'],
    mainQuestion_descubre: 'Cuando piensas en el futuro, cuéntame cómo imaginas o visualizas tu vida sentimental con el paso del tiempo.',
    examples_descubre: ['Cómo imaginas tu vida de pareja en los próximos años', 'Qué cambios o mejoras te gustaría hacer en tu forma de relacionarte', 'Qué tipo de relación te gustaría construir', 'Qué te gustaría experimentar en el amor hacia adelante']
  },
  {
    id: 'Q33', block: 'Seguridad emocional y expresión de amor',
    mainQuestion: 'Cuéntame qué cosas concretas hace tu pareja que te hacen sentir amado/a o seguro/a, y cuáles sientes que te faltan.',
    examples: ['Acciones específicas que te hacen sentir valorado/a y querido/a', 'Cosas que tu pareja hacía antes y que ya no hace', 'Qué necesitarías recibir más de tu pareja para sentirte seguro/a', 'Momentos en que te sientes realmente querido/a vs. momentos en que no'],
    mainQuestion_descubre: 'Cuéntame qué cosas concretas te han hecho sentir amado/a o seguro/a en tus relaciones, y qué has sentido que te faltaba.',
    examples_descubre: ['Acciones específicas que te han hecho sentir valorado/a', 'Cosas que tus parejas hacían y que extrañas', 'Qué necesitarías recibir de alguien para sentirte seguro/a', 'Momentos en que te has sentido querido/a vs. momentos en que no']
  },
  {
    id: 'Q34', block: 'Futuro del vínculo y sentido de la relación',
    mainQuestion: 'Cuéntame si hay cosas dentro de la relación que a veces te generan dudas, preocupación o incertidumbre.',
    examples: ['Situaciones que te generan inquietud', 'Cosas que te hacen pensar o reflexionar sobre la relación', 'Aspectos que te gustaría que fueran diferentes', 'Momentos donde aparecen dudas'],
    mainQuestion_descubre: 'Cuéntame si hay cosas de tu vida sentimental que a veces te generan dudas, preocupación o incertidumbre.',
    examples_descubre: ['Situaciones que te generan inquietud sobre el amor', 'Cosas que te hacen pensar o reflexionar sobre tus relaciones', 'Aspectos que te gustaría cambiar cuando estás en pareja', 'Patrones emocionales que te preocupan']
  },
  {
    id: 'Q35', block: 'Futuro del vínculo y sentido de la relación',
    mainQuestion: 'Pensando en los momentos difíciles que han vivido como pareja, cuéntame cómo han logrado atravesarlos o qué suele ayudar a que la relación continúe después de esos momentos.',
    examples: ['Cómo superan momentos complicados', 'Qué ayuda a que se reconcilien', 'Qué fortalezas aparecen en la relación', 'Qué hace posible que sigan adelante'],
    mainQuestion_descubre: 'Pensando en los momentos difíciles que has vivido en tus relaciones, cuéntame cómo los has atravesado o qué suele ayudarte a seguir adelante.',
    examples_descubre: ['Cómo has superado momentos complicados en pareja', 'Qué te ha ayudado a reconciliarte o seguir adelante', 'Qué fortalezas reconoces en ti', 'Qué te hace resiliente en las relaciones']
  },
  {
    id: 'Q36', block: 'Novedad, rutina y deseo',
    mainQuestion: 'Cuéntame si sienten que la relación tiene momentos de novedad o sorpresa, o si se ha vuelto más predecible y rutinaria.',
    examples: ['Si hay espacio para la sorpresa o lo inesperado entre ustedes', 'Si extrañas la emoción o la aventura que sentían al principio', 'Si han buscado formas de romper la rutina juntos', 'Qué tanto la estabilidad les da paz vs. aburrimiento'],
    mainQuestion_descubre: 'Cuéntame cómo has vivido el balance entre novedad y rutina en tus relaciones pasadas.',
    examples_descubre: ['Si había espacio para la sorpresa en tus relaciones', 'Si extrañabas la emoción del principio conforme avanzaba la relación', 'Si buscabas formas de romper la rutina', 'Qué tanto la estabilidad te da paz vs. aburrimiento']
  },
  {
    id: 'Q37', block: 'Futuro del vínculo y sentido de la relación',
    mainQuestion: 'Si tuvieras que decir qué está buscando cada uno dentro de esta relación, cuéntame qué crees que busca tu pareja y qué crees que estás buscando tú.',
    examples: ['Qué parece necesitar o desear tu pareja en la relación', 'Qué crees que intenta encontrar contigo', 'Qué sientes que tú buscas dentro del vínculo', 'Qué necesidades profundas aparecen en la relación'],
    mainQuestion_descubre: 'Si tuvieras que decir qué estás buscando realmente en una relación, cuéntame qué crees que necesitas y qué tipo de persona crees que buscas.',
    examples_descubre: ['Qué necesitas realmente de una relación', 'Qué tipo de persona sientes que buscas', 'Qué necesidades profundas aparecen cuando te relacionas', 'Qué intentas encontrar en el amor']
  },
  {
    id: 'Q38', block: 'Futuro del vínculo y sentido de la relación',
    mainQuestion: 'Pensando en todo lo que has contado hasta ahora, cuéntame qué crees que esta relación ha despertado o revelado en ti como persona.',
    examples: ['Aspectos de tu personalidad que han cambiado o se han desarrollado', 'Cosas que has descubierto sobre ti mismo/a gracias a esta relación', 'Aprendizajes profundos que han surgido en la relación', 'Partes de ti que se han transformado o que no conocías antes'],
    mainQuestion_descubre: 'Pensando en todo lo que has contado hasta ahora, cuéntame qué crees que tus relaciones han despertado o revelado en ti como persona.',
    examples_descubre: ['Aspectos de tu personalidad que han cambiado o se han desarrollado', 'Cosas que has descubierto sobre ti mismo/a gracias a tus relaciones', 'Aprendizajes profundos que han surgido a lo largo de tu vida sentimental', 'Partes de ti que se han transformado o que no conocías antes']
  },
  {
    id: 'Q39', block: 'Futuro del vínculo y sentido de la relación',
    mainQuestion: 'Si tuvieras que explicar qué hace única o particular tu relación con esta persona, cuéntame cómo la describirías.',
    examples: ['Qué hace diferente esta relación de otras', 'Qué tipo de conexión sienten', 'Qué rasgos definen su vínculo', 'Qué características hacen especial la relación'],
    mainQuestion_descubre: 'Si tuvieras que explicar qué hace única tu forma de relacionarte, cuéntame cómo la describirías.',
    examples_descubre: ['Qué te hace diferente como pareja', 'Qué tipo de conexiones sueles crear', 'Qué rasgos definen tus vínculos', 'Qué hace especial tu forma de amar']
  },
  {
    id: 'Q40', block: 'Futuro del vínculo y sentido de la relación',
    mainQuestion: 'Para terminar, cuéntame si hay algo importante sobre tu relación o sobre lo que estás viviendo en ella que sientas que todavía no has mencionado y que te gustaría compartir.',
    examples: ['Algo que consideres importante decir', 'Algo que sientas que ayuda a entender la relación', 'Algo que te gustaría expresar sobre el vínculo', 'Cualquier reflexión que sientas relevante'],
    mainQuestion_descubre: 'Para terminar, cuéntame si hay algo importante sobre tu vida sentimental o sobre cómo te relacionas que sientas que todavía no has mencionado y que te gustaría compartir.',
    examples_descubre: ['Algo que consideres importante decir sobre cómo amas', 'Algo que sientas que ayuda a entender tu forma de relacionarte', 'Algo que te gustaría expresar sobre tu vida sentimental', 'Cualquier reflexión que sientas relevante']
  }
]

// ─── DIMENSION LABELS ──────────────────────────────────────────

const DIMENSION_LABELS = {
  estabilidad_relacional: 'Estabilidad',
  apego_emocional: 'Apego',
  conexion_emocional: 'Conexión',
  deseo_erotico: 'Deseo',
  intimidad: 'Intimidad',
  sincronia_relacional: 'Sincronía',
  patrones_inconscientes: 'Patrones Inc.',
  fantasma_relacional: 'Fantasma Rel.',
  roles_sistemicos: 'Roles',
  resiliencia_vinculo: 'Resiliencia',
  vulnerabilidad_emocional: 'Vulnerabilidad',
  narrativa_futuro: 'Futuro'
}

const DIMENSION_COLORS = [
  '#818cf8', '#c084fc', '#f472b6', '#fb923c', '#fbbf24', '#34d399',
  '#22d3ee', '#60a5fa', '#a78bfa', '#e879f9', '#f87171', '#4ade80'
]

// ─── ElevenLabs voices (Latin Spanish) ────────────

const WORKER_URL = 'https://radiografia-worker.noirpraxis.workers.dev'
// Audio files live on Cloudflare Pages (luisvirrueta.com/audio/...), not on the Worker/R2
const AUDIO_BASE = ''

const VOICE_LIST = [
  { id: 'EXAVITQu4vr4xnSDxMaL', name: 'Valentina', desc: 'Cálida y clara', initial: 'V', color: 'from-rose-500 to-pink-500', ring: 'ring-rose-400/20', border: 'border-rose-500/30', bg: 'bg-rose-500/10', text: 'text-rose-300' },
  { id: 'JBFqnCBsd6RMkjVDRZzb', name: 'Santiago', desc: 'Firme y profesional', initial: 'S', color: 'from-violet-500 to-indigo-500', ring: 'ring-violet-400/20', border: 'border-violet-500/30', bg: 'bg-violet-500/10', text: 'text-violet-300' },
  { id: 'onwK4e9ZLuTAKqWW03F9', name: 'Adrián', desc: 'Profundo y sereno', initial: 'A', color: 'from-blue-500 to-cyan-500', ring: 'ring-blue-400/20', border: 'border-blue-500/30', bg: 'bg-blue-500/10', text: 'text-blue-300' },
  { id: 'FGY2WhTYpPnrIDTdsKH5', name: 'Camila', desc: 'Ágil y expresiva', initial: 'C', color: 'from-fuchsia-500 to-purple-500', ring: 'ring-fuchsia-400/20', border: 'border-fuchsia-500/30', bg: 'bg-fuchsia-500/10', text: 'text-fuchsia-300' }
]

// ─── MicLevelBars (visual mic test feedback) ───────────────────
const MicLevelBars = ({ analyser }) => {
  const canvasRef = useRef(null)
  useEffect(() => {
    if (!analyser) return
    const data = new Uint8Array(analyser.frequencyBinCount)
    let raf
    const draw = () => {
      analyser.getByteFrequencyData(data)
      const canvas = canvasRef.current
      if (!canvas) return
      const ctx = canvas.getContext('2d')
      ctx.clearRect(0, 0, canvas.width, canvas.height)
      const bars = 20, w = canvas.width / bars
      for (let i = 0; i < bars; i++) {
        const v = data[i * 2] / 255
        const h = v * canvas.height
        ctx.fillStyle = v > 0.5 ? '#34d399' : v > 0.2 ? '#6ee7b7' : '#a7f3d0'
        ctx.fillRect(i * w + 1, canvas.height - h, w - 2, h)
      }
      raf = requestAnimationFrame(draw)
    }
    draw()
    return () => cancelAnimationFrame(raf)
  }, [analyser])
  return <canvas ref={canvasRef} width={200} height={40} className="mx-auto rounded-lg" />
}

// ─── RecordingBars (real analyser for recording indicator) ────────
const RecordingBars = ({ analyser }) => {
  const barsRef = useRef([])
  const rafRef = useRef(null)
  const [heights, setHeights] = useState([4, 6, 3, 5])
  useEffect(() => {
    if (!analyser) return
    const data = new Uint8Array(analyser.frequencyBinCount)
    const draw = () => {
      analyser.getByteFrequencyData(data)
      const step = Math.floor(data.length / 4)
      const h = [0, 1, 2, 3].map(i => {
        let sum = 0
        for (let j = i * step; j < (i + 1) * step; j++) sum += data[j]
        return Math.max(3, (sum / step / 255) * 24)
      })
      setHeights(h)
      rafRef.current = requestAnimationFrame(draw)
    }
    draw()
    return () => { if (rafRef.current) cancelAnimationFrame(rafRef.current) }
  }, [analyser])
  return (
    <div className="flex gap-1 items-end" style={{ height: 24 }}>
      {heights.map((h, i) => (
        <div key={i} className="w-1.5 rounded-full bg-red-500/60 transition-all duration-75"
          style={{ height: `${h}px`, opacity: 0.5 + (h / 24) * 0.5 }} />
      ))}
    </div>
  )
}

// ─── AutoanalisisRadial: D3-powered radial mind-map of 10 sections ────────
const AUTOANALISIS_SECTIONS = [
  { key: 'apertura_rapport', label: 'Rapport', icon: '💜', color: '#c084fc' },
  { key: 'forma_de_amar', label: 'Forma de amar', icon: '❤️', color: '#f472b6' },
  { key: 'goce_repeticion', label: 'Goce', icon: '🔥', color: '#ef4444' },
  { key: 'lo_que_busca_en_el_otro', label: 'Lo que buscas', icon: '🔍', color: '#60a5fa' },
  { key: 'lo_que_reclama_afuera', label: 'Lo que reclamas', icon: '📣', color: '#fb923c' },
  { key: 'fantasma_relacional', label: 'Fantasma', icon: '👻', color: '#a78bfa' },
  { key: 'yo_ideal', label: 'Yo ideal', icon: '✨', color: '#fbbf24' },
  { key: 'mecanismos_defensa', label: 'Defensas', icon: '🛡️', color: '#34d399' },
  { key: 'tipo_pareja_que_repite', label: 'Patrón repetido', icon: '🔄', color: '#22d3ee' },
  { key: 'nucleo_del_patron', label: 'Núcleo', icon: '🎯', color: '#f87171' },
  { key: 'cierre_transformador', label: 'Transformación', icon: '🦋', color: '#e879f9' }
]

const AutoanalisisRadial = ({ data }) => {
  const present = AUTOANALISIS_SECTIONS.filter(s => data[s.key])
  const n = present.length
  if (n === 0) return null
  const cx = 200, cy = 200, r = 140
  const nodes = present.map((s, i) => {
    const angle = (i / n) * Math.PI * 2 - Math.PI / 2
    const textLen = (data[s.key] || '').length
    const nodeR = Math.max(18, Math.min(30, textLen / 20))
    return { ...s, x: cx + r * Math.cos(angle), y: cy + r * Math.sin(angle), nodeR, angle }
  })
  return (
    <div className="flex justify-center mb-6">
      <svg viewBox="0 0 400 400" className="w-full max-w-sm" style={{ filter: 'drop-shadow(0 0 20px rgba(139,92,246,0.08))' }}>
        {/* Connecting lines */}
        {nodes.map((node, i) => (
          <line key={`line-${i}`} x1={cx} y1={cy} x2={node.x} y2={node.y}
            stroke={node.color} strokeOpacity={0.15} strokeWidth={1.5} />
        ))}
        {/* Outer ring for context */}
        <circle cx={cx} cy={cy} r={r + 5} fill="none" stroke="rgba(255,255,255,0.04)" strokeWidth={1} strokeDasharray="4 4" />
        {/* Center node */}
        <circle cx={cx} cy={cy} r={32} fill="rgba(139,92,246,0.12)" stroke="rgba(139,92,246,0.3)" strokeWidth={1.5} />
        <text x={cx} y={cy - 6} textAnchor="middle" fill="rgba(255,255,255,0.7)" fontSize="10" fontWeight="500">Tu forma</text>
        <text x={cx} y={cy + 8} textAnchor="middle" fill="rgba(255,255,255,0.7)" fontSize="10" fontWeight="500">de amar</text>
        {/* Nodes */}
        {nodes.map((node, i) => (
          <g key={`node-${i}`}>
            <circle cx={node.x} cy={node.y} r={node.nodeR} fill={`${node.color}18`} stroke={`${node.color}40`} strokeWidth={1.5} />
            <text x={node.x} y={node.y + 1} textAnchor="middle" dominantBaseline="central" fontSize="14">{node.icon}</text>
            {/* Label outside the circle */}
            <text
              x={node.x + (node.x > cx ? node.nodeR + 6 : -(node.nodeR + 6))}
              y={node.y + 1}
              textAnchor={node.x > cx ? 'start' : node.x < cx - 5 ? 'end' : 'middle'}
              dominantBaseline="central"
              fill="rgba(255,255,255,0.5)" fontSize="9" fontWeight="400"
            >{node.label}</text>
          </g>
        ))}
      </svg>
    </div>
  )
}

// ─── Spotlight Onboarding Components ──────────────────────────────
const SpotlightCutout = ({ targetId }) => {
  const [rect, setRect] = useState(null)
  useEffect(() => {
    const el = document.getElementById(targetId)
    if (!el) return
    const update = () => {
      const r = el.getBoundingClientRect()
      setRect({ top: r.top - 8, left: r.left - 8, width: r.width + 16, height: r.height + 16 })
    }
    update()
    window.addEventListener('resize', update)
    window.addEventListener('scroll', update)
    return () => { window.removeEventListener('resize', update); window.removeEventListener('scroll', update) }
  }, [targetId])
  if (!rect) return null
  return (
    <div className="absolute pointer-events-none" style={{
      top: rect.top, left: rect.left, width: rect.width, height: rect.height,
      boxShadow: '0 0 0 9999px rgba(0,0,0,0.75)',
      borderRadius: '16px', zIndex: 51
    }} />
  )
}

const SpotlightTooltip = ({ targetId, onboardingStep, totalSteps, step, borderColor, bgCard, dotColor, onNext, onSkip }) => {
  const [pos, setPos] = useState(null)
  useEffect(() => {
    const el = document.getElementById(targetId)
    if (!el) return
    const update = () => {
      const r = el.getBoundingClientRect()
      setPos({ top: r.bottom + 16, left: Math.max(16, r.left + r.width / 2 - 160), width: 320 })
    }
    update()
    window.addEventListener('resize', update)
    window.addEventListener('scroll', update)
    return () => { window.removeEventListener('resize', update); window.removeEventListener('scroll', update) }
  }, [targetId])
  if (!pos) return null
  return (
    <motion.div
      key={onboardingStep}
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
      className={`fixed z-[52] pointer-events-auto p-5 rounded-2xl border ${borderColor} bg-gradient-to-br ${bgCard} to-zinc-900/98 shadow-2xl`}
      style={{ top: pos.top, left: pos.left, width: pos.width, maxWidth: 'calc(100vw - 32px)' }}
      onClick={e => e.stopPropagation()}>
      <h3 className="text-white text-base font-medium mb-2">{step.title}</h3>
      <p className="text-white/50 text-sm font-light leading-relaxed mb-4">{step.desc}</p>
      <div className="flex items-center justify-between">
        <div className="flex gap-2">
          {Array.from({ length: totalSteps }).map((_, i) => (
            <div key={i} className={`w-2 h-2 rounded-full transition-all ${i === onboardingStep ? `${dotColor} scale-125` : 'bg-white/15'}`} />
          ))}
        </div>
        <div className="flex items-center gap-3">
          <button onClick={onSkip} className="text-white/50 text-xs hover:text-white/50 transition-colors">Saltar</button>
          <motion.button onClick={onNext} whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}
            className="px-5 py-2 rounded-xl bg-gradient-to-r from-violet-600 to-fuchsia-600 text-white text-xs font-light shadow-lg shadow-violet-600/20">
            {onboardingStep < totalSteps - 1 ? 'Siguiente' : 'Comenzar'}
          </motion.button>
        </div>
      </div>
    </motion.div>
  )
}

// ─── DEMO RESPONSES (for testing) ────────────────────────────────

// Demo: Carlos & Ana — solo package (relationship analysis)
const DEMO_RESPONSES = {
  Q1: 'Me llamo Carlos, tengo 32 años, soy diseñador gráfico freelance. Llevo 4 años con mi pareja Ana. Estoy en un momento de mucha reflexión personal, buscando estabilidad.',
  Q2: 'Nos conocimos en una fiesta de amigos en común hace como 5 años. Al principio fue algo casual, nos caímos bien, empezamos a salir y poco a poco se fue haciendo más serio. Llevamos viviendo juntos dos años.',
  Q3: 'Actualmente la relación está en un momento complicado. Hay muchas discusiones por cosas pequeñas. Pero también hay momentos buenos donde sentimos que todo vale la pena.',
  Q4: 'En el día a día trabajamos los dos desde casa. Compartimos las comidas, a veces vemos series juntos. La comunicación es lo que más nos cuesta, a veces pasamos horas sin hablarnos después de una discusión.',
  Q5: 'Siento que hemos construido un hogar juntos, una rutina. También hemos aprendido a conocernos profundamente. La relación me ha enseñado mucho sobre mí mismo.',
  Q6: 'Lo que más me llamó la atención fue su inteligencia y su risa. Tenía una forma de ver la vida que me parecía fascinante, como muy libre y segura de sí misma.',
  Q7: 'Ella me demuestra cariño con palabras, me dice cosas bonitas y me escribe mensajes. Yo soy más de actos, le hago cosas, le cocino. A mí me gusta más el contacto físico, los abrazos. Ella prefiere que le diga cosas. A veces choca porque cada uno lo expresa diferente.',
  Q8: 'El primer viaje que hicimos juntos fue muy importante. También cuando decidimos vivir juntos. Y hubo una crisis fuerte hace un año que nos cambió mucho.',
  Q9: 'Al principio imaginaba que íbamos a ser una pareja muy unida, viajar mucho, crecer juntos profesionalmente. Veía un futuro largo.',
  Q10: 'Ella representaba estabilidad emocional para mí. Sentía que con ella podía ser yo mismo sin máscaras.',
  Q11: 'Mis padres tenían una relación complicada. Se querían pero discutían mucho. Mi mamá era más emocional y mi papá más distante.',
  Q12: 'Aprendí que el amor requiere sacrificio, que hay que aguantar. También que las discusiones son normales. No vi mucha expresión de cariño físico.',
  Q13: 'Sí, noto que a veces me distancio como hacía mi papá. Me cuesta expresar lo que siento y me refugio en el silencio.',
  Q14: 'Tuve una relación de 3 años antes que terminó porque yo era muy celoso. Aprendí que los celos destruyen todo.',
  Q15: 'Siento que puedo ser yo mismo en muchas cosas, pero hay temas donde me callo para no generar conflicto. Mantengo mis amigos pero a veces siento culpa por salir. Creo que me adapto más de lo que debería para mantener la paz.',
  Q16: 'Cuando las cosas están difíciles, cada uno tiende a manejar el estrés por su lado. Yo me encierro y ella busca a sus amigas. No siempre funciona como equipo, pero cuando uno está realmente mal, el otro sí responde.',
  Q17: 'Las discusiones empiezan por cosas pequeñas, como tareas del hogar o decisiones del día a día. Escala rápido.',
  Q18: 'Yo tiendo a callarme y alejarme. Me cuesta mucho discutir en el momento, prefiero pensar antes de hablar.',
  Q19: 'Ella se frustra porque yo me callo. Sube el tono, insiste en que yo hable. A veces llora de frustración.',
  Q20: 'Después de una discusión solemos pasar un rato sin hablarnos. Generalmente ella da el primer paso para reconciliarnos.',
  Q21: 'Me sigue atrayendo mucho su físico, su manera de moverse. Pero lo que más me atrae es cuando la veo apasionada por algo que le gusta.',
  Q22: 'Hay momentos de mucha conexión, sobre todo cuando hablamos de nuestros sueños o cuando viajamos juntos. Pero en la rutina es más difícil.',
  Q23: 'La intimidad física ha bajado un poco. Antes era más frecuente y más espontánea. Ahora se siente más como un esfuerzo.',
  Q24: 'Al inicio el deseo era muy fuerte, constante. Ahora hay altibajos. Después de discusiones es difícil reconectarse.',
  Q25: 'Los viajes nos acercan mucho. También cocinar juntos o cuando compartimos algo creativo.',
  Q26: 'La distancia aparece cuando hay mucho estrés laboral o después de conflictos. A veces siento que vivimos como roommates.',
  Q27: 'Las decisiones grandes las tomamos platicando, pero a veces siento que ella impone su punto de vista y yo cedo.',
  Q28: 'Siento que ella tiene más peso en las decisiones importantes, yo suelo ceder. Hay resentimientos que no he expresado, como sentir que mis opiniones pesan menos. A veces me siento invisible cuando ella ya decidió algo sin consultarme.',
  Q29: 'Creo que para ella es importante sentirse valorada y escuchada. Necesita que le demuestre que me importa con acciones.',
  Q30: 'Para mí es importante tener algo de espacio personal, sentir que somos equipo, y tener más momentos de diversión juntos.',
  Q31: 'Esta relación es muy importante para mí. Es donde me siento más yo, aunque también donde más vulnerable soy.',
  Q32: 'Imagino que si trabajamos en nuestra comunicación podemos tener un futuro muy sólido. Me gustaría formar una familia.',
  Q33: 'Me siento amado cuando ella me abraza sin razón, o cuando me pregunta cómo estoy de verdad. Antes me dejaba notas, ya no lo hace. Me faltaría más contacto físico y que me diga que está orgullosa de mí.',
  Q34: 'A veces me pregunto si somos compatibles a largo plazo. Las discusiones repetitivas me generan duda.',
  Q35: 'Lo que nos ha salvado es que los dos queremos estar juntos. Hay amor debajo de todo el conflicto.',
  Q36: 'La relación se ha vuelto bastante rutinaria. Ya no hay sorpresas, todo es predecible. Extraño la emoción del principio, las aventuras espontáneas. Hemos intentado romper la rutina pero siempre volvemos a lo mismo.',
  Q37: 'Creo que ella busca seguridad emocional y cercanía. Yo busco compañerismo y paz en la relación.',
  Q38: 'He descubierto que soy más sensible de lo que creía. También que tengo miedo al abandono.',
  Q39: 'Lo único de nuestra relación es la intensidad. Nos amamos mucho pero también nos hacemos daño. Es apasionada.',
  Q40: 'Creo que lo más importante es que ambos estamos aquí porque queremos mejorar. Eso dice mucho.'
}

// Demo: Sofía — descubre package (self-discovery, no current partner)
const DEMO_RESPONSES_SOFIA = {
  Q1: 'Me llamo Sofía, tengo 28 años, soy psicóloga clínica. Actualmente estoy soltera, llevo un año sin relación formal. Estoy en un momento de mucho autoconocimiento.',
  Q2: 'Mi última relación duró 3 años, terminó hace un año. Antes de eso tuve dos relaciones cortas en la universidad. Siempre elijo hombres inteligentes y un poco emocionalmente distantes.',
  Q3: 'Actualmente me siento tranquila pero a veces extraño la compañía. Me cuestiono si estoy sola porque lo elijo o porque tengo miedo de repetir patrones.',
  Q4: 'Cuando estaba en pareja, el día a día era muy fusional al principio y luego se volvía distante. Yo cocinaba, planeaba todo, y él se dejaba llevar. Me convertía en la que sostenía todo.',
  Q5: 'He aprendido que soy fuerte, que puedo amar intensamente, pero también que tiendo a perderme en las relaciones. Cada relación me dejó algo valioso pero también heridas.',
  Q6: 'Me atraen hombres con algo misterioso, inteligentes, que me desafíen intelectualmente. El humor es fundamental. También me atrae cierta vulnerabilidad que solo yo puedo ver.',
  Q7: 'Demuestro cariño con palabras y tiempo de calidad. Me encanta escribir cartas, mensajes largos. Necesito recibir presencia física y que me elijan activamente cada día.',
  Q8: 'El momento más significativo fue cuando mi ex me dijo que me amaba por primera vez — sentí que por fin alguien me veía. Y el momento más doloroso fue cuando entendí que me amaba pero no podía darme lo que necesitaba.',
  Q9: 'Siempre imagino un futuro donde somos un equipo, donde hay conversaciones profundas y risas. Donde el amor es una elección diaria, no una obligación.',
  Q10: 'En mis parejas buscaba sentirme completa, sentir que alguien me elegía. Ahora entiendo que estaba buscando afuera lo que me faltaba adentro.',
  Q11: 'Mi mamá era muy cariñosa pero ansiosa. Mi papá viajaba mucho por trabajo, era amoroso cuando estaba pero estaba poco. Ellos se querían pero había mucha soledad en mi mamá.',
  Q12: 'Aprendí que el amor viene con ausencia. Que amar es esperar. Que quien te quiere puede no estar. Eso marcó mucho mi forma de relacionarme.',
  Q13: 'Sí, repito el patrón de mi mamá: me enamoro de hombres que están pero no están del todo. Y yo compenso dando más y más hasta que me agoto.',
  Q14: 'Tuve tres relaciones importantes. En todas fui la que daba más emocionalmente. En todas terminé sintiéndome invisible a pesar de dar todo.',
  Q15: 'Tiendo a fusionarme demasiado. Pierdo amistades, dejo hobbies, me vuelvo la relación. Cuando termina, tengo que reconstruirme desde cero.',
  Q16: 'En momentos difíciles yo buscaba hablar, resolver, entender. Mis parejas tendían a cerrarse, necesitar espacio. Eso me desesperaba.',
  Q17: 'Los conflictos solían ser por falta de presencia emocional. Yo sentía que no me priorizaban, ellos sentían que yo era demasiado intensa.',
  Q18: 'Cuando hay conflicto me vuelvo verbal, necesito resolver en el momento. Me cuesta dar espacio porque el silencio me recuerda a la ausencia de mi papá.',
  Q19: 'Mis parejas solían callarse, distanciarse, necesitar tiempo. Uno se iba literalmente de la casa. Otro se dormía. La evasión me enloquecía.',
  Q20: 'Las reconciliaciones eran intensas, a veces con sexo, a veces llorando juntos. Pero el tema de fondo nunca se resolvía.',
  Q21: 'Me atrae la conexión intelectual y la vulnerabilidad. Cuando alguien me muestra su lado frágil, me enamoro. También me atrae la ambición y la pasión por lo que hacen.',
  Q22: 'Me conectaba profundamente a través de conversaciones largas, de contacto físico, de planes juntos. Pero la conexión se perdía cuando sentía que yo era la única que la buscaba.',
  Q23: 'La intimidad física ha sido importante para mí pero siempre vinculada a la emocional. Sin conexión emocional, el sexo me parecía vacío.',
  Q24: 'El deseo era intenso al inicio, se mantenía mientras me sentía elegida. Se apagaba cuando sentía negligencia emocional.',
  Q25: 'Los viajes, las cenas a solas, las noches hablando hasta las 3am. Ahí me sentía viva y conectada.',
  Q26: 'La rutina, el trabajo, y sobre todo cuando sentía que él prefería estar en su celular que conmigo. La indiferencia me destruía.',
  Q27: 'Yo tendía a organizar, proponer, decidir. Ellos dejaban que yo llevara el timón. Parecía que yo tenía el poder pero en realidad estaba compensando su desinterés.',
  Q28: 'El poder emocional lo tenía quien menos invertía. Yo daba más y por eso me sentía más vulnerable. Hay resentimiento acumulado de sentir que siempre puse más.',
  Q29: 'Creo que buscaban una mujer fuerte que los cuidara sin pedirles demasiado. Alguien que los amara sin condiciones. Y yo les daba exactamente eso.',
  Q30: 'Necesito sentirme prioridad, no opción. Necesito palabras, presencia, y que me elijan con acciones, no solo con palabras. Necesito mi espacio pero también sentirme buscada.',
  Q31: 'Las relaciones han sido lo más importante y lo más doloroso de mi vida. Me definen de alguna forma, aunque estoy aprendiendo a no dejar que lo hagan.',
  Q32: 'Quiero una relación donde no tenga que perderme para amar. Donde el amor sea recíproco, sostenido, elegido. Donde pueda ser yo sin miedo.',
  Q33: 'Me sentía amada cuando me escribía sin que yo lo buscara, cuando me abrazaba al despertar, cuando hablaba de mí con orgullo. Me faltaba consistencia.',
  Q34: 'Me preocupa repetir el mismo patrón: elegir a alguien que no puede estar disponible emocionalmente y romperme intentando compensarlo.',
  Q35: 'He salido adelante gracias a terapia, amigas increíbles, y mi capacidad de reflexión. Siempre me levanto, pero cada vez cuesta más.',
  Q36: 'En mis relaciones la rutina mataba el deseo. Al principio todo era aventura, luego se volvía predecible. Yo intentaba mantener la chispa pero sola no podía.',
  Q37: 'Busco a alguien que esté emocionalmente presente, que me desafíe intelectualmente, que tenga su propia vida pero que me haga parte importante de ella.',
  Q38: 'He descubierto que mi mayor fortaleza es también mi debilidad: amo con todo, sin reservas, y eso me hace increíblemente vulnerable.',
  Q39: 'Mi forma de amar es intensa, generosa, a veces excesiva. Amo como si cada vez fuera la última. Eso intimida a algunos pero es lo más honesto que tengo.',
  Q40: 'Estoy aquí porque quiero romper el ciclo. Quiero entender por qué elijo lo que elijo y aprender a amarme primero antes de amar a alguien más.'
}

// ─── DEMO CROSS ANALYSIS DATA (for dev toolbar "LosDos" button) ───
const DEMO_CROSS_ANALYSIS = {
  apertura: 'Carlos y Ana respondieron las mismas 40 preguntas de forma independiente. Lo que surge al cruzar ambas perspectivas es un mapa emocional donde cada uno proyecta necesidades distintas sobre el mismo vínculo.\n\nMientras Carlos describe la relación desde la distancia reflexiva — un observador que analiza sin actuar —, Ana habla desde la urgencia emocional de quien siente que el tiempo se le escapa. Ambos se aman, pero lo hacen desde coordenadas distintas que rara vez se encuentran.',
  resumen_cruzado: 'La relación Carlos-Ana presenta una **asimetría fundamental**: Carlos busca paz y autonomía dentro del vínculo, mientras Ana busca cercanía e intensidad emocional. Lo que Carlos interpreta como "dar espacio", Ana lo vive como abandono. Lo que Ana interpreta como "mostrar interés", Carlos lo vive como presión.\n\nEsta dinámica perseguidor-retirada se ha calcificado en un patrón donde ambos confirman lo que más temen: Carlos se retira porque siente que nada de lo que hace es suficiente, y Ana persigue porque cada silencio le confirma que no es prioridad.',
  dimensiones_cruzadas: {
    estabilidad_relacional: { p1: 45, p2: 55, interpretacion: 'Carlos percibe menor estabilidad que Ana — él ve fracturas donde ella ve oportunidades de reparación.' },
    conexion_emocional: { p1: 40, p2: 65, interpretacion: 'Ana siente más conexión que Carlos, quien reporta distanciamiento emocional significativo.' },
    deseo_erotico: { p1: 35, p2: 50, interpretacion: 'Ambos notan una baja, pero Ana mantiene más deseo activo. Carlos lo ha desplazado hacia lo intelectual.' },
    sincronia_relacional: { p1: 30, p2: 45, interpretacion: 'Desincronización marcada: los ritmos emocionales de ambos no coinciden en momentos clave.' },
    vulnerabilidad_emocional: { p1: 25, p2: 70, interpretacion: 'La brecha más grande: Ana se expone emocionalmente, Carlos se protege. Esto genera un desequilibrio de poder invisible.' },
    narrativa_futuro: { p1: 50, p2: 60, interpretacion: 'Ambos imaginan un futuro juntos, pero Ana lo visualiza con más claridad y urgencia.' }
  },
  _individual: {
    p1: { nombre: 'Carlos', dimensiones: { estabilidad_relacional: 45, apego_emocional: 60, conexion_emocional: 40, deseo_erotico: 35, intimidad: 30, sincronia_relacional: 30, patrones_inconscientes: 80, fantasma_relacional: 70, roles_sistemicos: 65, resiliencia_vinculo: 55, vulnerabilidad_emocional: 25, narrativa_futuro: 50 } },
    p2: { nombre: 'Ana', dimensiones: { estabilidad_relacional: 55, apego_emocional: 75, conexion_emocional: 65, deseo_erotico: 50, intimidad: 55, sincronia_relacional: 45, patrones_inconscientes: 70, fantasma_relacional: 60, roles_sistemicos: 55, resiliencia_vinculo: 70, vulnerabilidad_emocional: 70, narrativa_futuro: 60 } }
  },
  puntos_ciegos: {
    p1_no_ve: 'Carlos no registra cuánto **daño hace su silencio**. Para él, retirarse es auto-regulación; para Ana, cada silencio es una puerta que se cierra. Tampoco ve que su "flexibilidad" (ceder para evitar conflicto) en realidad **acumula resentimiento** que luego explota en frialdad emocional.',
    p2_no_ve: 'Ana no ve que su **insistencia en hablar en el momento** es vivida por Carlos como un asalto emocional. Su necesidad de resolución inmediata reproduce la ansiedad de su madre, y su intensidad — aunque nace del amor — empuja a Carlos exactamente hacia donde ella no quiere que vaya: el silencio.'
  },
  dinamica_real: 'La dinámica real de esta pareja es un **loop de persecución y retirada** que se activa varias veces por semana. Ana detecta distancia → pide cercanía → Carlos se siente presionado → se retira → Ana interpreta rechazo → intensifica la demanda.\n\nEl problema no es que peleen — es que **reparan mal**. Las reconciliaciones son superficiales: se abrazan, ven una serie, pero el patrón subyacente nunca se nombra. Cada ciclo erosiona un poco más la confianza de ambos en que el otro puede darle lo que necesita.',
  convergencias: [
    'Ambos quieren estar juntos y ven futuro en la relación',
    'Reconocen que la comunicación es su mayor área de mejora',
    'Valoran la conexión intelectual y los momentos compartidos',
    'Los dos identifican patrones de sus familias de origen en su dinámica actual'
  ],
  divergencias: [
    'Carlos quiere más espacio; Ana quiere más cercanía',
    'Carlos maneja el conflicto con silencio; Ana necesita resolverlo de inmediato',
    'Ana expresa vulnerabilidad abiertamente; Carlos la evita activamente',
    'Carlos siente que da suficiente; Ana siente que nunca es suficiente'
  ],
  lecturas_cruzadas: {
    gottman: 'El **índice Gottman** de esta pareja muestra alta presencia de dos de los "jinetes del Apocalipsis": **defensividad** (Carlos) y **crítica** (Ana). Carlos responde a la demanda emocional de Ana levantando muros, lo que ella interpreta como desprecio. Ana responde a la evasión de Carlos con reclamos que él interpreta como ataque.\n\nLa ratio de interacciones positivas/negativas percibidas está por debajo del umbral 5:1, especialmente en la percepción de Carlos (3:1) vs la de Ana (4:1).',
    apego: 'Carlos presenta un estilo **evitativo** que se activa ante la demanda emocional. Ana presenta un estilo **ansioso** que se activa ante la percepción de distancia. Juntos forman la combinación clásica **ansioso-evitativo**: cuanto más persigue Ana, más se retira Carlos; cuanto más se retira Carlos, más ansiosa se vuelve Ana.\n\nNinguno de los dos es "el problema" — el sistema relacional que han construido es el que necesita intervención.',
    perel: 'Desde la perspectiva de Esther Perel, esta pareja ha **sacrificado el deseo en el altar de la seguridad**. Carlos busca previsibilidad (pero la encuentra aburrida). Ana busca intensidad emocional (pero la genera a través del conflicto, no del erotismo).\n\nEl deseo necesita misterio, y ambos se han vuelto demasiado predecibles el uno para el otro — pero por las razones equivocadas.',
    comunicacion: 'Los **lenguajes de amor** están cruzados: Carlos da en **actos de servicio** y necesita recibir **contacto físico**. Ana da en **palabras de afirmación** y necesita recibir **tiempo de calidad**.\n\nCada uno da lo que necesita recibir (no lo que el otro necesita), generando una sensación mutua de "doy mucho y recibo poco".',
    poder: 'El poder en esta relación es **paradójico**: Ana parece tener más poder porque es más vocal y directa. Pero el poder real lo tiene Carlos — quien se retira controla el ritmo emocional de la relación.\n\nEsta asimetría invisible genera resentimiento en ambos: Carlos siente que "ella siempre decide" (poder visible de Ana) mientras Ana siente que "nunca puedo llegar a él" (poder estructural de Carlos).'
  },
  mensaje_para_ambos: 'Carlos y Ana: lo que esta radiografía muestra no es una relación rota — es una relación que ha **outgrown sus herramientas de comunicación**. El amor está ahí (ambos lo dicen sin dudarlo), pero el sistema que han construido para manejarlo ya no funciona.\n\nCarlos: tu silencio no es neutralidad — es acción. Cada vez que te retiras, Ana recibe un mensaje que dice "no me importas". No es tu intención, pero es el efecto.\n\nAna: tu insistencia no es amor — es ansiedad disfrazada de cuidado. Cada vez que presionas para hablar en el momento, Carlos recibe un mensaje que dice "nunca haces nada bien".\n\nLa buena noticia: ambos quieren lo mismo (cercanía, equipo, futuro). Solo necesitan aprender a pedirlo de una forma que el otro pueda recibir.',
  pronostico_relacional: { potencial: 72, riesgo: 45, direccion: 'La relación tiene potencial significativo si logran romper el ciclo perseguidor-retirada y aprender a reparar de forma genuina. Sin intervención, el riesgo de distanciamiento irreversible es moderado.' }
}

// ─── ANÁLISIS ANIMATION TASKS ─────────────────────────────────────

const ANALYSIS_TASKS = [
  // Lectura profunda
  { id: 1, group: 'Lectura profunda', text: 'Leyendo tu narrativa completa…' },
  { id: 2, group: 'Lectura profunda', text: 'Procesando 40 respuestas y contexto emocional…' },
  { id: 3, group: 'Lectura profunda', text: 'Detectando temas recurrentes y contradicciones…' },
  { id: 4, group: 'Lectura profunda', text: 'Analizando tono emocional y nivel de apertura…' },
  { id: 5, group: 'Lectura profunda', text: 'Identificando omisiones significativas…' },
  // Autoanálisis del usuario
  { id: 6, group: 'Tu autoanálisis', text: 'Descifrando tu forma de amar…' },
  { id: 7, group: 'Tu autoanálisis', text: 'Identificando lo que buscas en el otro…' },
  { id: 8, group: 'Tu autoanálisis', text: 'Analizando lo que reclamas afuera…' },
  { id: 9, group: 'Tu autoanálisis', text: 'Mapeando tu fantasma relacional (Lacan)…' },
  { id: 10, group: 'Tu autoanálisis', text: 'Comparando tu yo ideal vs tu yo real…' },
  { id: 11, group: 'Tu autoanálisis', text: 'Detectando mecanismos de defensa…' },
  { id: 12, group: 'Tu autoanálisis', text: 'Rastreando el tipo de pareja que repites…' },
  { id: 13, group: 'Tu autoanálisis', text: 'Destilando el núcleo de tu patrón…' },
  // Detección de patrones
  { id: 14, group: 'Detección de patrones', text: 'Identificando tono relacional dominante…' },
  { id: 15, group: 'Detección de patrones', text: 'Infiriendo estilo de apego (Amir Levine)…' },
  { id: 16, group: 'Detección de patrones', text: 'Detectando lenguajes del amor (Chapman)…' },
  { id: 17, group: 'Detección de patrones', text: 'Analizando dinámicas de poder (Terrence Real)…' },
  { id: 18, group: 'Detección de patrones', text: 'Leyendo entre líneas de tu narrativa…' },
  // Análisis por corriente
  { id: 19, group: 'Análisis por corriente', text: 'Evaluando los 4 jinetes de Gottman…' },
  { id: 20, group: 'Análisis por corriente', text: 'Calculando ratio positivo/negativo…' },
  { id: 21, group: 'Análisis por corriente', text: 'Aplicando teoría del vínculo (Sue Johnson)…' },
  { id: 22, group: 'Análisis por corriente', text: 'Analizando erotismo y deseo (Esther Perel)…' },
  { id: 23, group: 'Análisis por corriente', text: 'Evaluando regulación mutua (Tatkin)…' },
  { id: 24, group: 'Análisis por corriente', text: 'Midiendo triángulo del amor (Sternberg)…' },
  { id: 25, group: 'Análisis por corriente', text: 'Evaluando diferenciación (Schnarch)…' },
  { id: 26, group: 'Análisis por corriente', text: 'Interpretando desde el psicoanálisis (Freud + Lacan)…' },
  { id: 27, group: 'Análisis por corriente', text: 'Analizando imago relacional (Hendrix)…' },
  { id: 28, group: 'Análisis por corriente', text: 'Cruzando hallazgos entre corrientes…' },
  // Construcción de gráficas
  { id: 29, group: 'Construcción de gráficas', text: 'Calculando 12 dimensiones psicológicas…' },
  { id: 30, group: 'Construcción de gráficas', text: 'Construyendo mapa de apego…' },
  { id: 31, group: 'Construcción de gráficas', text: 'Generando gráfica de polaridades…' },
  { id: 32, group: 'Construcción de gráficas', text: 'Midiendo brecha yo-ideal vs yo-real…' },
  { id: 33, group: 'Construcción de gráficas', text: 'Mapeando mecanismos de defensa…' },
  { id: 34, group: 'Construcción de gráficas', text: 'Trazando ciclo de repetición…' },
  { id: 35, group: 'Construcción de gráficas', text: 'Construyendo escena relacional…' },
  // Síntesis final
  { id: 36, group: 'Síntesis final', text: 'Extrayendo evidencia textual…' },
  { id: 37, group: 'Síntesis final', text: 'Estimando dirección probable del vínculo…' },
  { id: 38, group: 'Síntesis final', text: 'Seleccionando técnicas terapéuticas…' },
  { id: 39, group: 'Síntesis final', text: 'Eligiendo libros personalizados…' },
  { id: 40, group: 'Síntesis final', text: 'Compilando informe final…' },
]

// ─── HELPERS ──────────────────────────────────────────────────

function renderBold(text) {
  if (!text) return null
  return text.split(/\*\*(.*?)\*\*/g).map((part, i) =>
    i % 2 === 1 ? <strong key={i} className="font-semibold text-white/85">{part}</strong> : part
  )
}

/* Render bold markers — only concept names (text before colons) get <strong>, rest stays plain */
function renderConceptBold(text) {
  if (!text) return null
  return text.split(/\*\*(.*?)\*\*/g).map((part, i) =>
    i % 2 === 1
      ? <strong key={i} className="font-semibold text-white/90">{part}</strong>
      : part
  )
}

function getLevelColor(val) {
  if (val >= 70) return 'text-emerald-400'
  if (val >= 45) return 'text-amber-400'
  return 'text-red-400'
}

function getBarGradient(val) {
  if (val >= 60) return 'from-emerald-500 to-green-400'
  if (val >= 40) return 'from-amber-500 to-yellow-400'
  return 'from-red-500 to-orange-400'
}

// ─── RADAR CHART ──────────────────────────────────────────────

function RadarChart({ dimensiones }) {
  const keys = Object.keys(DIMENSION_LABELS)
  const labels = Object.values(DIMENSION_LABELS)
  const n = keys.length
  const cx = 250, cy = 250, r = 170

  const getPoint = (i, val) => {
    const angle = (Math.PI * 2 * i) / n - Math.PI / 2
    const dist = (val / 100) * r
    return { x: cx + dist * Math.cos(angle), y: cy + dist * Math.sin(angle) }
  }

  const polygon = keys.map((k, i) => {
    const p = getPoint(i, dimensiones[k] || 0)
    return `${p.x},${p.y}`
  }).join(' ')

  return (
    <div>
      <svg viewBox="0 0 500 500" className="w-full max-w-lg mx-auto">
        {[20, 40, 60, 80, 100].map(level => (
          <circle key={level} cx={cx} cy={cy} r={r * level / 100} fill="none" stroke="rgba(255,255,255,0.06)" strokeWidth={0.5} />
        ))}
        {keys.map((_, i) => {
          const p = getPoint(i, 100)
          return <line key={i} x1={cx} y1={cy} x2={p.x} y2={p.y} stroke="rgba(255,255,255,0.08)" strokeWidth={0.5} />
        })}
        {keys.map((k, i) => {
          const p1 = getPoint(i, dimensiones[keys[i]] || 0)
          const p2 = getPoint((i + 1) % n, dimensiones[keys[(i + 1) % n]] || 0)
          return (
            <polygon key={`seg-${i}`}
              points={`${cx},${cy} ${p1.x},${p1.y} ${p2.x},${p2.y}`}
              fill={DIMENSION_COLORS[i]} fillOpacity={0.10}
              stroke={DIMENSION_COLORS[i]} strokeOpacity={0.25} strokeWidth={0.7}
            />
          )
        })}
        <polygon points={polygon} fill="none" stroke="rgba(255,255,255,0.15)" strokeWidth={0.5} />
        {keys.map((k, i) => {
          const p = getPoint(i, dimensiones[k] || 0)
          return <circle key={k} cx={p.x} cy={p.y} r={4} fill={DIMENSION_COLORS[i]} />
        })}
        {keys.map((_, i) => {
          const p = getPoint(i, 135)
          return (
            <text key={i} x={p.x} y={p.y} textAnchor="middle" dominantBaseline="middle"
              fill={DIMENSION_COLORS[i]} className="text-[9px] font-light" fillOpacity={0.9}>
              {labels[i]}
            </text>
          )
        })}
      </svg>
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 mt-5">
        {keys.map((key, i) => (
          <div key={key} className="flex items-center gap-2 p-2 rounded-lg border border-white/[0.06] bg-white/[0.02]">
            <div className="w-2.5 h-2.5 rounded-full flex-shrink-0" style={{ backgroundColor: DIMENSION_COLORS[i] }} />
            <span className="text-white/55 text-xs font-light flex-1 leading-tight">{labels[i]}</span>
            <span className="text-white/75 text-xs font-medium tabular-nums">{dimensiones[key] ?? 0}%</span>
          </div>
        ))}
      </div>
    </div>
  )
}

// ─── GAUGE CHART ──────────────────────────────────────────────

function GaugeChart({ value, label, inverted = false }) {
  const v = Math.max(0, Math.min(100, value || 0))
  const color = inverted
    ? (v > 60 ? '#ef4444' : v > 40 ? '#f59e0b' : '#10b981')
    : (v >= 60 ? '#10b981' : v >= 40 ? '#f59e0b' : '#ef4444')
  const arc = Math.PI * 80
  const filled = (v / 100) * arc
  return (
    <div className="flex flex-col items-center">
      <svg viewBox="0 0 200 115" className="w-full max-w-[160px]">
        <path d="M 20 95 A 80 80 0 0 1 180 95" fill="none" stroke="rgba(255,255,255,0.06)" strokeWidth={14} strokeLinecap="round" />
        <path d="M 20 95 A 80 80 0 0 1 180 95" fill="none" stroke={color} strokeWidth={14} strokeLinecap="round" strokeOpacity={0.6}
          strokeDasharray={`${filled} ${arc}`} />
        <text x="100" y="85" textAnchor="middle" fill="white" fontSize="28" fontWeight="300" opacity={0.85}>{v}%</text>
      </svg>
      {label && <span className="text-white/50 text-xs font-light text-center mt-1">{label}</span>}
    </div>
  )
}

// ─── MIND MAP RADIAL — D3-style radial layout for 12 dimensions ──

function MindMapRadial({ dimensiones }) {
  const keys = Object.keys(DIMENSION_LABELS)
  const labels = Object.values(DIMENSION_LABELS)
  const n = keys.length
  const cx = 300, cy = 300

  // Define dimension correlations for connecting arcs
  const correlations = [
    ['apego_emocional', 'conexion_emocional'],
    ['conexion_emocional', 'intimidad'],
    ['deseo_erotico', 'intimidad'],
    ['patrones_inconscientes', 'fantasma_relacional'],
    ['fantasma_relacional', 'roles_sistemicos'],
    ['vulnerabilidad_emocional', 'apego_emocional'],
    ['resiliencia_vinculo', 'estabilidad_relacional'],
    ['sincronia_relacional', 'conexion_emocional'],
    ['narrativa_futuro', 'resiliencia_vinculo'],
    ['roles_sistemicos', 'sincronia_relacional'],
  ]

  const getPos = (i) => {
    const angle = (Math.PI * 2 * i) / n - Math.PI / 2
    const baseR = 160
    return { x: cx + baseR * Math.cos(angle), y: cy + baseR * Math.sin(angle), angle }
  }

  return (
    <div className="relative">
      <svg viewBox="0 0 600 600" className="w-full max-w-2xl mx-auto">
        <defs>
          <radialGradient id="mm-center-glow" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#8b5cf6" stopOpacity="0.15" />
            <stop offset="100%" stopColor="#8b5cf6" stopOpacity="0" />
          </radialGradient>
          {DIMENSION_COLORS.map((c, i) => (
            <radialGradient key={`dim-glow-${i}`} id={`dim-glow-${i}`} cx="50%" cy="50%" r="50%">
              <stop offset="0%" stopColor={c} stopOpacity="0.25" />
              <stop offset="100%" stopColor={c} stopOpacity="0" />
            </radialGradient>
          ))}
        </defs>

        {/* Background rings */}
        {[100, 160, 220].map(r => (
          <circle key={r} cx={cx} cy={cy} r={r} fill="none" stroke="rgba(255,255,255,0.03)" strokeWidth={0.5} strokeDasharray="4 6" />
        ))}

        {/* Correlation arcs — curved lines between related dimensions */}
        {correlations.map(([a, b], ci) => {
          const ai = keys.indexOf(a), bi = keys.indexOf(b)
          if (ai < 0 || bi < 0) return null
          const pa = getPos(ai), pb = getPos(bi)
          const strength = ((dimensiones[a] || 0) + (dimensiones[b] || 0)) / 200
          const midX = (pa.x + pb.x) / 2 + (cy - (pa.y + pb.y) / 2) * 0.25
          const midY = (pa.y + pb.y) / 2 + ((pa.x + pb.x) / 2 - cx) * 0.25
          return (
            <path key={`corr-${ci}`}
              d={`M ${pa.x} ${pa.y} Q ${midX} ${midY} ${pb.x} ${pb.y}`}
              fill="none" stroke={DIMENSION_COLORS[ai]} strokeOpacity={0.12 + strength * 0.15}
              strokeWidth={0.5 + strength * 1.5} strokeDasharray="3 4" />
          )
        })}

        {/* Spokes from center */}
        {keys.map((_, i) => {
          const p = getPos(i)
          const val = dimensiones[keys[i]] || 0
          const opacity = 0.06 + (val / 100) * 0.18
          return <line key={`spoke-${i}`} x1={cx} y1={cy} x2={p.x} y2={p.y}
            stroke={DIMENSION_COLORS[i]} strokeOpacity={opacity} strokeWidth={1 + (val / 100) * 1.5} />
        })}

        {/* Center node */}
        <circle cx={cx} cy={cy} r={50} fill="url(#mm-center-glow)" />
        <circle cx={cx} cy={cy} r={28} fill="rgba(139,92,246,0.08)" stroke="rgba(139,92,246,0.25)" strokeWidth={1.5} />
        <text x={cx} y={cy - 5} textAnchor="middle" fill="rgba(255,255,255,0.7)" className="text-[10px] font-medium">Tu</text>
        <text x={cx} y={cy + 8} textAnchor="middle" fill="rgba(255,255,255,0.5)" className="text-[8px] font-light">relación</text>

        {/* Dimension nodes */}
        {keys.map((k, i) => {
          const p = getPos(i)
          const val = dimensiones[k] || 0
          const nodeR = 22 + (val / 100) * 30
          const colorHex = DIMENSION_COLORS[i]
          return (
            <g key={k}>
              <circle cx={p.x} cy={p.y} r={nodeR + 15} fill={`url(#dim-glow-${i})`} />
              <circle cx={p.x} cy={p.y} r={nodeR}
                fill={`${colorHex}15`} stroke={colorHex} strokeOpacity={0.5} strokeWidth={2} />
              <text x={p.x} y={p.y + 1} textAnchor="middle" dominantBaseline="middle"
                fill={colorHex} className="text-[14px] font-bold" fillOpacity={0.95}>{val}</text>
              <text x={p.x} y={p.y + nodeR + 16} textAnchor="middle"
                fill={colorHex} className="text-[9px] font-medium" fillOpacity={0.8}>{labels[i]}</text>
            </g>
          )
        })}
      </svg>
    </div>
  )
}

// ─── DIMENSION NETWORK GRAPH — 3 spheres connected to 12 dimensions ──

function DimensionNetworkGraph({ dimensiones }) {
  const keys = Object.keys(DIMENSION_LABELS)
  const labels = Object.values(DIMENSION_LABELS)

  const clusters = {
    emocional: { dims: ['apego_emocional', 'conexion_emocional', 'vulnerabilidad_emocional', 'intimidad'], color: '#ec4899', label: 'Emocional', x: 120, y: 100 },
    estructural: { dims: ['estabilidad_relacional', 'sincronia_relacional', 'roles_sistemicos', 'resiliencia_vinculo'], color: '#6366f1', label: 'Estructural', x: 400, y: 100 },
    profundo: { dims: ['patrones_inconscientes', 'fantasma_relacional', 'deseo_erotico', 'narrativa_futuro'], color: '#a855f7', label: 'Profunda', x: 260, y: 280 }
  }

  // Position child nodes around each cluster center
  const nodePositions = []
  for (const [clusterKey, cluster] of Object.entries(clusters)) {
    cluster.dims.forEach((dk, di) => {
      const idx = keys.indexOf(dk)
      if (idx < 0) return
      const angle = ((di - 1.5) / 4) * Math.PI * 0.8 + (clusterKey === 'emocional' ? -Math.PI * 0.3 : clusterKey === 'estructural' ? Math.PI * 0.3 : Math.PI * 0.5)
      const dist = 95
      const nx = cluster.x + Math.cos(angle) * dist
      const ny = cluster.y + Math.sin(angle) * dist
      const val = dimensiones[dk] ?? 0
      const radius = 14 + (val / 100) * 14
      nodePositions.push({ idx, key: dk, label: labels[idx], val, x: nx, y: ny, radius, color: DIMENSION_COLORS[idx], clusterX: cluster.x, clusterY: cluster.y, clusterColor: cluster.color })
    })
  }

  return (
    <div>
      <svg viewBox="-10 -20 540 460" className="w-full max-w-xl mx-auto">
        <defs>
          <filter id="net-glow"><feGaussianBlur stdDeviation="3" result="blur" /><feMerge><feMergeNode in="blur" /><feMergeNode in="SourceGraphic" /></feMerge></filter>
        </defs>
        {/* Connections: cluster → dimension */}
        {nodePositions.map((n, i) => (
          <line key={`link-${i}`} x1={n.clusterX} y1={n.clusterY} x2={n.x} y2={n.y}
            stroke={n.clusterColor} strokeWidth={1 + (n.val / 100) * 2.5} strokeOpacity={0.15 + (n.val / 100) * 0.2} />
        ))}
        {/* Inter-cluster connections */}
        {Object.values(clusters).map((c1, i, arr) => {
          const c2 = arr[(i + 1) % arr.length]
          return <line key={`cc-${i}`} x1={c1.x} y1={c1.y} x2={c2.x} y2={c2.y} stroke="rgba(255,255,255,0.06)" strokeWidth="1" strokeDasharray="6 4" />
        })}
        {/* Cluster hubs */}
        {Object.values(clusters).map((c, i) => (
          <g key={`hub-${i}`}>
            <circle cx={c.x} cy={c.y} r={32} fill={`${c.color}15`} stroke={c.color} strokeWidth={2} strokeOpacity={0.5} filter="url(#net-glow)" />
            <circle cx={c.x} cy={c.y} r={24} fill={`${c.color}25`} />
            <text x={c.x} y={c.y + 1} textAnchor="middle" dominantBaseline="central" fill={c.color} className="text-[9px] font-bold" fillOpacity={0.9}>{c.label}</text>
          </g>
        ))}
        {/* Dimension nodes */}
        {nodePositions.map((n, i) => (
          <g key={`node-${i}`}>
            <circle cx={n.x} cy={n.y} r={n.radius} fill={`${n.color}20`} stroke={n.color} strokeWidth={1.5} strokeOpacity={0.6} />
            <text x={n.x} y={n.y - 1} textAnchor="middle" dominantBaseline="central" fill="rgba(255,255,255,0.95)" className="text-[10px] font-bold">{n.val}%</text>
            <text x={n.x} y={n.y + n.radius + 11} textAnchor="middle" fill="rgba(255,255,255,0.75)" className="text-[9px] font-medium">{n.label}</text>
          </g>
        ))}
      </svg>
    </div>
  )
}

// Layer mini-chart: Polar (for apego layer)
function PolarMiniChart({ data }) {
  if (!data?.puntuacion) return null
  const score = data.puntuacion ?? 50
  const apego = data.estilo_apego || 'No detectado'
  const styles = [
    { label: 'Seguro', color: '#10b981', icon: '🛡️' },
    { label: 'Ansioso', color: '#f59e0b', icon: '💓' },
    { label: 'Evitativo', color: '#6366f1', icon: '🚶' },
    { label: 'Desorganizado', color: '#ef4444', icon: '🌀' }
  ]
  const detected = styles.find(s => apego.toLowerCase().includes(s.label.toLowerCase())) || styles[0]
  return (
    <div className="flex flex-col items-center py-4 gap-4">
      <div className="flex items-center justify-center gap-3">
        {styles.map((st, i) => {
          const isActive = st.label === detected.label
          return (
            <div key={i} className={`flex flex-col items-center gap-1.5 px-3 py-2.5 rounded-xl transition-all ${isActive ? 'bg-white/[0.08] border border-white/15 scale-110' : 'opacity-35'}`}>
              <span className="text-lg">{st.icon}</span>
              <span className={`text-[9px] font-medium ${isActive ? 'text-white/90' : 'text-white/50'}`}>{st.label}</span>
              {isActive && <span className="text-[11px] font-bold" style={{ color: st.color }}>{score}%</span>}
            </div>
          )
        })}
      </div>
      <div className="w-full max-w-xs">
        <div className="h-2 rounded-full bg-white/[0.06] overflow-hidden">
          <div className="h-full rounded-full transition-all" style={{ width: `${score}%`, backgroundColor: detected.color, opacity: 0.7 }} />
        </div>
        <div className="flex justify-between mt-1">
          <span className="text-white/30 text-[8px]">0%</span>
          <span className="text-[10px] font-medium" style={{ color: detected.color }}>{apego}</span>
          <span className="text-white/30 text-[8px]">100%</span>
        </div>
      </div>
    </div>
  )
}

// Layer mini-chart: Lollipop (for erotismo layer)
function LollipopMiniChart({ data }) {
  const items = [
    { label: 'Atracción inicial', val: data?.atraccion_inicial ?? 0, color: '#f472b6' },
    { label: 'Atracción actual', val: data?.atraccion_actual ?? 0, color: '#ec4899' },
    { label: 'Intimidad emoc.', val: data?.intimidad_emocional ?? 0, color: '#a78bfa' },
    { label: 'Conexión física', val: data?.conexion_fisica ?? 0, color: '#fb923c' }
  ]
  return (
    <div className="py-4 px-2">
      <svg viewBox="0 0 400 160" className="w-full max-w-md mx-auto">
        {items.map((item, i) => {
          const y = 20 + i * 38
          const barW = (item.val / 100) * 260
          return (
            <g key={i}>
              <text x={0} y={y + 5} fill="rgba(255,255,255,0.45)" className="text-[10px] font-light">{item.label}</text>
              <line x1={120} y1={y} x2={120 + barW} y2={y} stroke={item.color} strokeWidth={2} strokeOpacity={0.4} />
              <circle cx={120 + barW} cy={y} r={8} fill={`${item.color}25`} stroke={item.color} strokeWidth={1.5} strokeOpacity={0.6} />
              <text x={120 + barW} y={y + 3.5} textAnchor="middle" fill={item.color} className="text-[9px] font-medium">{item.val}</text>
            </g>
          )
        })}
      </svg>
    </div>
  )
}

// ─── GOTTMAN: 4 Horsemen horizontal bars ─────────────────────────
function GottmanHorsemenChart({ data }) {
  const score = data?.puntuacion ?? 50
  const horsemen = [
    { label: 'Crítica', color: '#60a5fa', intensity: Math.min(100, 25 + (score > 50 ? 10 : 35)) },
    { label: 'Desprecio', color: '#3b82f6', intensity: Math.min(100, 15 + (score > 50 ? 5 : 45)) },
    { label: 'Actitud defensiva', color: '#818cf8', intensity: Math.min(100, 30 + (score > 50 ? 15 : 25)) },
    { label: 'Evasión', color: '#6366f1', intensity: Math.min(100, 20 + (score > 50 ? 8 : 40)) }
  ]
  // Use indicadores to derive real values if available
  if (data?.indicadores && data.indicadores.length >= 4) {
    data.indicadores.slice(0, 4).forEach((ind, i) => {
      const lower = (typeof ind === 'string' ? ind : '').toLowerCase()
      if (lower.includes('alto') || lower.includes('fuerte')) horsemen[i].intensity = 80
      else if (lower.includes('moderado') || lower.includes('medio')) horsemen[i].intensity = 50
      else if (lower.includes('bajo') || lower.includes('mínimo')) horsemen[i].intensity = 25
    })
  }
  return (
    <div className="py-4 px-2">
      <svg viewBox="0 0 400 200" className="w-full max-w-md mx-auto">
        {horsemen.map((h, i) => {
          const y = 20 + i * 46
          const barW = (h.intensity / 100) * 230
          const dangerZone = 150 // x position of danger threshold
          return (
            <g key={i}>
              <text x={0} y={y + 6} fill="rgba(255,255,255,0.7)" className="text-[12px] font-medium">{h.label}</text>
              <rect x={130} y={y - 6} width={230} height={12} rx={6} fill="rgba(255,255,255,0.04)" />
              <rect x={130} y={y - 6} width={barW} height={12} rx={6} fill={h.color} fillOpacity={0.5} />
              <line x1={dangerZone + 130} y1={y - 10} x2={dangerZone + 130} y2={y + 10} stroke="rgba(239,68,68,0.3)" strokeWidth={1} strokeDasharray="3 3" />
              <circle cx={130 + barW} cy={y} r={10} fill={`${h.color}30`} stroke={h.color} strokeWidth={1.5} strokeOpacity={0.7} />
              <text x={130 + barW} y={y + 3.5} textAnchor="middle" fill={h.color} className="text-[10px] font-bold">{h.intensity}</text>
            </g>
          )
        })}
        <text x={280} y={196} textAnchor="middle" fill="rgba(239,68,68,0.4)" className="text-[9px] font-light">zona de riesgo →</text>
      </svg>
    </div>
  )
}

// ─── STERNBERG: Enhanced Triangle SVG with filled area, grid & edge labels ──
function SternbergTriangleChart({ data }) {
  const intimidad = data?.puntuacion_intimidad ?? 50
  const pasion = data?.puntuacion_pasion ?? 50
  const compromiso = data?.puntuacion_compromiso ?? 50
  // Classify love type
  const loveType = intimidad >= 60 && pasion >= 60 && compromiso >= 60 ? 'Amor consumado'
    : intimidad >= 60 && pasion >= 60 ? 'Amor romántico'
    : intimidad >= 60 && compromiso >= 60 ? 'Amor compañero'
    : pasion >= 60 && compromiso >= 60 ? 'Amor fatuo'
    : intimidad >= 60 ? 'Cariño / Amistad' : pasion >= 60 ? 'Encaprichamiento' : compromiso >= 60 ? 'Amor vacío' : 'En desarrollo'
  // Triangle geometry
  const cx = 160, topY = 30, baseY = 270, leftX = 30, rightX = 290
  const top = [cx, topY], bl = [leftX, baseY], br = [rightX, baseY]
  // Inner triangle scaled by scores
  const lerp = (a, b, t) => a + (b - a) * t
  const s = (v) => 0.2 + (v / 100) * 0.8
  const iTop = [cx, lerp(baseY, topY, s(intimidad))]
  const iBl = [lerp(cx, leftX, s(pasion)), lerp(topY + (baseY - topY) * 0.5, baseY, s(pasion))]
  const iBr = [lerp(cx, rightX, s(compromiso)), lerp(topY + (baseY - topY) * 0.5, baseY, s(compromiso))]
  // Grid levels (25%, 50%, 75%)
  const gridLevels = [0.25, 0.5, 0.75]
  return (
    <div className="flex flex-col items-center py-4 gap-2">
      <svg viewBox="0 0 320 310" className="w-full max-w-xs">
        <defs>
          <radialGradient id="tri-fill-v2" cx="50%" cy="60%" r="60%">
            <stop offset="0%" stopColor="#a78bfa" stopOpacity="0.35" />
            <stop offset="60%" stopColor="#8b5cf6" stopOpacity="0.18" />
            <stop offset="100%" stopColor="#6d28d9" stopOpacity="0.06" />
          </radialGradient>
          <filter id="tri-glow">
            <feGaussianBlur stdDeviation="4" result="blur" />
            <feMerge><feMergeNode in="blur" /><feMergeNode in="SourceGraphic" /></feMerge>
          </filter>
        </defs>
        {/* Grid triangles */}
        {gridLevels.map((g, gi) => {
          const gTop = [cx, lerp(baseY, topY, g)]
          const gBl = [lerp(cx, leftX, g), lerp(topY + (baseY - topY) * 0.5, baseY, g)]
          const gBr = [lerp(cx, rightX, g), lerp(topY + (baseY - topY) * 0.5, baseY, g)]
          return <polygon key={gi} points={`${gTop[0]},${gTop[1]} ${gBl[0]},${gBl[1]} ${gBr[0]},${gBr[1]}`} fill="none" stroke="rgba(139,92,246,0.06)" strokeWidth="0.8" strokeDasharray="4 4" />
        })}
        {/* Outer triangle */}
        <polygon points={`${top[0]},${top[1]} ${bl[0]},${bl[1]} ${br[0]},${br[1]}`} fill="none" stroke="rgba(139,92,246,0.15)" strokeWidth="1.5" />
        {/* Filled inner triangle */}
        <polygon points={`${iTop[0]},${iTop[1]} ${iBl[0]},${iBl[1]} ${iBr[0]},${iBr[1]}`} fill="url(#tri-fill-v2)" stroke="rgba(139,92,246,0.6)" strokeWidth="2" filter="url(#tri-glow)" />
        {/* Connecting lines from inner to outer */}
        <line x1={iTop[0]} y1={iTop[1]} x2={top[0]} y2={top[1]} stroke="rgba(139,92,246,0.12)" strokeWidth="0.8" strokeDasharray="3 3" />
        <line x1={iBl[0]} y1={iBl[1]} x2={bl[0]} y2={bl[1]} stroke="rgba(236,72,153,0.12)" strokeWidth="0.8" strokeDasharray="3 3" />
        <line x1={iBr[0]} y1={iBr[1]} x2={br[0]} y2={br[1]} stroke="rgba(14,165,233,0.12)" strokeWidth="0.8" strokeDasharray="3 3" />
        {/* Edge labels (midpoints) */}
        <text x={(top[0] + bl[0]) / 2 - 18} y={(top[1] + bl[1]) / 2} fill="rgba(236,72,153,0.45)" className="text-[9px] font-light" transform={`rotate(-56, ${(top[0] + bl[0]) / 2 - 18}, ${(top[1] + bl[1]) / 2})`}>romanticismo</text>
        <text x={(top[0] + br[0]) / 2 + 18} y={(top[1] + br[1]) / 2} fill="rgba(14,165,233,0.45)" className="text-[9px] font-light" transform={`rotate(56, ${(top[0] + br[0]) / 2 + 18}, ${(top[1] + br[1]) / 2})`}>compañerismo</text>
        <text x={cx} y={baseY + 12} textAnchor="middle" fill="rgba(251,191,36,0.45)" className="text-[9px] font-light">fatuo</text>
        {/* Vertex labels */}
        <text x={cx} y={topY - 6} textAnchor="middle" fill="rgba(139,92,246,0.9)" className="text-[11px] font-semibold">Intimidad</text>
        <text x={leftX - 4} y={baseY + 14} textAnchor="start" fill="rgba(236,72,153,0.9)" className="text-[11px] font-semibold">Pasión</text>
        <text x={rightX + 4} y={baseY + 14} textAnchor="end" fill="rgba(14,165,233,0.9)" className="text-[11px] font-semibold">Compromiso</text>
        {/* Score badges */}
        <rect x={iTop[0] - 18} y={iTop[1] - 22} width="36" height="16" rx="8" fill="rgba(139,92,246,0.2)" stroke="rgba(139,92,246,0.4)" strokeWidth="0.8" />
        <text x={iTop[0]} y={iTop[1] - 11} textAnchor="middle" fill="rgba(255,255,255,0.9)" className="text-[10px] font-bold">{intimidad}%</text>
        <rect x={iBl[0] - 18} y={iBl[1] + 6} width="36" height="16" rx="8" fill="rgba(236,72,153,0.2)" stroke="rgba(236,72,153,0.4)" strokeWidth="0.8" />
        <text x={iBl[0]} y={iBl[1] + 17} textAnchor="middle" fill="rgba(255,255,255,0.9)" className="text-[10px] font-bold">{pasion}%</text>
        <rect x={iBr[0] - 18} y={iBr[1] + 6} width="36" height="16" rx="8" fill="rgba(14,165,233,0.2)" stroke="rgba(14,165,233,0.4)" strokeWidth="0.8" />
        <text x={iBr[0]} y={iBr[1] + 17} textAnchor="middle" fill="rgba(255,255,255,0.9)" className="text-[10px] font-bold">{compromiso}%</text>
        {/* Glowing dots at inner vertices */}
        <circle cx={iTop[0]} cy={iTop[1]} r={6} fill="#8b5cf6" fillOpacity={0.8} filter="url(#tri-glow)" />
        <circle cx={iBl[0]} cy={iBl[1]} r={6} fill="#ec4899" fillOpacity={0.8} filter="url(#tri-glow)" />
        <circle cx={iBr[0]} cy={iBr[1]} r={6} fill="#0ea5e9" fillOpacity={0.8} filter="url(#tri-glow)" />
      </svg>
      <p className="text-violet-300/60 text-[11px] font-medium">{loveType}</p>
    </div>
  )
}

// ─── SUE JOHNSON: Infinity Cycle SVG (perseguidor-distanciador) ──
function JohnsonCycleChart({ data }) {
  const score = data?.puntuacion ?? 50
  const cicloPhase = score >= 60 ? 'Reparación activa' : score >= 40 ? 'Ciclo en tensión' : 'Ciclo de rigidez'
  const cycleColor = score >= 60 ? '#10b981' : score >= 40 ? '#f59e0b' : '#ef4444'
  return (
    <div className="flex flex-col items-center py-4 gap-3">
      <svg viewBox="0 0 360 180" className="w-full max-w-sm">
        <defs>
          <linearGradient id="cycle-left" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#f43f5e" stopOpacity="0.4" />
            <stop offset="100%" stopColor="#f43f5e" stopOpacity="0.1" />
          </linearGradient>
          <linearGradient id="cycle-right" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#3b82f6" stopOpacity="0.1" />
            <stop offset="100%" stopColor="#3b82f6" stopOpacity="0.4" />
          </linearGradient>
        </defs>
        {/* Left loop — perseguidor */}
        <ellipse cx={120} cy={90} rx={80} ry={60} fill="none" stroke="#f43f5e" strokeWidth={2} strokeOpacity={0.3} strokeDasharray="6 4" />
        <ellipse cx={120} cy={90} rx={80} ry={60} fill="url(#cycle-left)" />
        {/* Right loop — distanciador */}
        <ellipse cx={240} cy={90} rx={80} ry={60} fill="none" stroke="#3b82f6" strokeWidth={2} strokeOpacity={0.3} strokeDasharray="6 4" />
        <ellipse cx={240} cy={90} rx={80} ry={60} fill="url(#cycle-right)" />
        {/* Center intersection */}
        <circle cx={180} cy={90} r={20} fill={`${cycleColor}20`} stroke={cycleColor} strokeWidth={2} strokeOpacity={0.6} />
        <text x={180} y={93} textAnchor="middle" fill={cycleColor} className="text-[9px] font-bold">{score}%</text>
        {/* Labels */}
        <text x={85} y={93} textAnchor="middle" fill="rgba(244,63,94,0.7)" className="text-[10px] font-medium">Perseguidor</text>
        <text x={275} y={93} textAnchor="middle" fill="rgba(59,130,246,0.7)" className="text-[10px] font-medium">Distanciador</text>
        {/* Arrows */}
        <path d="M 155 40 Q 180 30 205 40" fill="none" stroke="rgba(255,255,255,0.2)" strokeWidth={1.5} markerEnd="url(#arrowhead)" />
        <path d="M 205 140 Q 180 150 155 140" fill="none" stroke="rgba(255,255,255,0.2)" strokeWidth={1.5} markerEnd="url(#arrowhead)" />
        <defs><marker id="arrowhead" markerWidth="6" markerHeight="4" refX="5" refY="2" orient="auto"><path d="M 0 0 L 6 2 L 0 4" fill="rgba(255,255,255,0.3)" /></marker></defs>
      </svg>
      <div className="flex items-center gap-2">
        <div className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: cycleColor }} />
        <span className="text-white/65 text-xs font-medium">{cicloPhase}</span>
      </div>
    </div>
  )
}

// ─── FREUD/LACAN: Iceberg SVG ────────────────────────────────────
function IcebergChart({ data }) {
  const score = data?.puntuacion ?? 50
  const waterLine = 100 // y position of water surface
  return (
    <div className="flex justify-center py-4">
      <svg viewBox="0 0 300 280" className="w-full max-w-xs">
        <defs>
          <linearGradient id="ice-surface" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#a78bfa" stopOpacity="0.25" />
            <stop offset="100%" stopColor="#a78bfa" stopOpacity="0.08" />
          </linearGradient>
          <linearGradient id="ice-deep" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#7c3aed" stopOpacity="0.15" />
            <stop offset="100%" stopColor="#6d28d9" stopOpacity="0.35" />
          </linearGradient>
        </defs>
        {/* Water surface line */}
        <line x1={0} y1={waterLine} x2={300} y2={waterLine} stroke="rgba(96,165,250,0.25)" strokeWidth={1.5} strokeDasharray="8 4" />
        <text x={290} y={waterLine - 6} textAnchor="end" fill="rgba(96,165,250,0.6)" className="text-[9px] font-light">consciencia</text>
        {/* Above water — visible iceberg tip */}
        <polygon points="150,25 115,97 185,97" fill="url(#ice-surface)" stroke="rgba(167,139,250,0.4)" strokeWidth={1.5} />
        <text x={150} y={68} textAnchor="middle" fill="rgba(167,139,250,0.9)" className="text-[10px] font-medium">Conducta</text>
        <text x={150} y={82} textAnchor="middle" fill="rgba(255,255,255,0.55)" className="text-[9px] font-light">visible</text>
        {/* Below water — huge unconscious */}
        <polygon points="90,103 50,220 150,265 250,220 210,103" fill="url(#ice-deep)" stroke="rgba(124,58,237,0.3)" strokeWidth={1.5} />
        {/* Layers inside the deep iceberg */}
        <line x1={95} y1={140} x2={205} y2={140} stroke="rgba(255,255,255,0.08)" strokeWidth={0.5} />
        <text x={150} y={130} textAnchor="middle" fill="rgba(196,181,253,0.85)" className="text-[10px] font-medium">Preconsciente</text>
        <text x={150} y={143} textAnchor="middle" fill="rgba(255,255,255,0.5)" className="text-[9px] font-light">deseos parciales</text>
        <line x1={80} y1={180} x2={220} y2={180} stroke="rgba(255,255,255,0.08)" strokeWidth={0.5} />
        <text x={150} y={170} textAnchor="middle" fill="rgba(192,132,252,0.85)" className="text-[10px] font-medium">Inconsciente</text>
        <text x={150} y={183} textAnchor="middle" fill="rgba(255,255,255,0.5)" className="text-[9px] font-light">pulsiones / repetición</text>
        <text x={150} y={228} textAnchor="middle" fill="rgba(139,92,246,0.85)" className="text-[12px] font-bold">{score}%</text>
        <text x={150} y={245} textAnchor="middle" fill="rgba(255,255,255,0.5)" className="text-[9px] font-light">Profundidad del patrón</text>
      </svg>
    </div>
  )
}

// ─── HENDRIX: Imago Diagram (two overlapping circles) ────────────
function HendrixImagoChart({ data }) {
  const score = data?.puntuacion ?? 50
  const overlap = 20 + (score / 100) * 40 // more score = more overlap
  return (
    <div className="flex justify-center py-4">
      <svg viewBox="0 0 320 200" className="w-full max-w-sm">
        <defs>
          <radialGradient id="imago-left" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#f97316" stopOpacity="0.2" />
            <stop offset="100%" stopColor="#f97316" stopOpacity="0.04" />
          </radialGradient>
          <radialGradient id="imago-right" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#fb923c" stopOpacity="0.2" />
            <stop offset="100%" stopColor="#fb923c" stopOpacity="0.04" />
          </radialGradient>
        </defs>
        <circle cx={130 - overlap / 2} cy={100} r={70} fill="url(#imago-left)" stroke="#f97316" strokeWidth={1.5} strokeOpacity={0.3} />
        <circle cx={190 + overlap / 2} cy={100} r={70} fill="url(#imago-right)" stroke="#fb923c" strokeWidth={1.5} strokeOpacity={0.3} />
        {/* Overlap zone */}
        <text x={160} y={88} textAnchor="middle" fill="rgba(251,146,60,0.9)" className="text-[11px] font-bold">Imago</text>
        <text x={160} y={103} textAnchor="middle" fill="rgba(255,255,255,0.75)" className="text-[14px] font-bold">{score}%</text>
        <text x={160} y={118} textAnchor="middle" fill="rgba(255,255,255,0.5)" className="text-[9px] font-light">herida compartida</text>
        {/* Labels */}
        <text x={90 - overlap / 2} y={103} textAnchor="middle" fill="rgba(249,115,22,0.7)" className="text-[10px] font-medium">Tú</text>
        <text x={230 + overlap / 2} y={103} textAnchor="middle" fill="rgba(251,146,60,0.7)" className="text-[10px] font-medium">Pareja</text>
      </svg>
    </div>
  )
}

// ─── SCHNARCH: Differentiation Thermometer (dual bars) ───────────
function SchnarchThermometerChart({ data }) {
  const score = data?.puntuacion ?? 50
  const fusion = 100 - score
  const differentiation = score
  return (
    <div className="flex justify-center py-4 gap-8">
      {[{ label: 'Fusión', value: fusion, color: '#ef4444', colorLight: 'rgba(239,68,68,0.15)' },
        { label: 'Diferenciación', value: differentiation, color: '#10b981', colorLight: 'rgba(16,185,129,0.15)' }
      ].map((bar, i) => (
        <div key={i} className="flex flex-col items-center gap-2">
          <p className="text-white/65 text-[11px] font-medium">{bar.label}</p>
          <svg viewBox="0 0 40 160" className="w-12 h-40">
            <rect x={10} y={5} width={20} height={140} rx={10} fill="rgba(255,255,255,0.04)" stroke="rgba(255,255,255,0.08)" strokeWidth={1} />
            <rect x={10} y={5 + 140 * (1 - bar.value / 100)} width={20} height={140 * (bar.value / 100)} rx={10} fill={bar.colorLight} stroke={bar.color} strokeWidth={1.5} strokeOpacity={0.5} />
            <circle cx={20} cy={5 + 140 * (1 - bar.value / 100) + 10} r={6} fill={bar.color} fillOpacity={0.7} />
          </svg>
          <p style={{ color: bar.color }} className="text-sm font-bold opacity-80">{bar.value}%</p>
        </div>
      ))}
    </div>
  )
}

// ─── TATKIN: Regulation Speedometer (semi-gauge) ─────────────────
function TatkinSpeedometerChart({ data }) {
  const score = data?.puntuacion ?? 50
  const cx = 150, cy = 140, r = 100
  // 0% = leftmost (hyper), 50% = center (window), 100% = rightmost (hypo)
  // Map score: high = good regulation (center), low = dysregulated
  const regulationAngle = Math.PI + (score / 100) * Math.PI // 180° to 360°
  const needleX = cx + r * 0.75 * Math.cos(regulationAngle)
  const needleY = cy + r * 0.75 * Math.sin(regulationAngle)
  const zone = score >= 60 ? 'Ventana de tolerancia' : score >= 35 ? 'Activación moderada' : 'Hiperactivación'
  const zoneColor = score >= 60 ? '#10b981' : score >= 35 ? '#f59e0b' : '#ef4444'
  return (
    <div className="flex flex-col items-center py-4 gap-2">
      <svg viewBox="0 0 300 170" className="w-full max-w-xs">
        {/* Background arc zones */}
        <path d={`M ${cx - r} ${cy} A ${r} ${r} 0 0 1 ${cx - r * 0.5} ${cy - r * 0.866}`} fill="none" stroke="#ef4444" strokeWidth={16} strokeOpacity={0.15} strokeLinecap="round" />
        <path d={`M ${cx - r * 0.34} ${cy - r * 0.94} A ${r} ${r} 0 0 1 ${cx + r * 0.34} ${cy - r * 0.94}`} fill="none" stroke="#10b981" strokeWidth={16} strokeOpacity={0.15} strokeLinecap="round" />
        <path d={`M ${cx + r * 0.5} ${cy - r * 0.866} A ${r} ${r} 0 0 1 ${cx + r} ${cy}`} fill="none" stroke="#3b82f6" strokeWidth={16} strokeOpacity={0.15} strokeLinecap="round" />
        {/* Zone labels */}
        <text x={45} y={cy + 12} textAnchor="middle" fill="rgba(239,68,68,0.6)" className="text-[9px] font-light">Hiper</text>
        <text x={150} y={30} textAnchor="middle" fill="rgba(16,185,129,0.7)" className="text-[10px] font-medium">Regulado</text>
        <text x={255} y={cy + 12} textAnchor="middle" fill="rgba(59,130,246,0.6)" className="text-[9px] font-light">Hipo</text>
        {/* Needle */}
        <line x1={cx} y1={cy} x2={needleX} y2={needleY} stroke={zoneColor} strokeWidth={2.5} strokeOpacity={0.7} strokeLinecap="round" />
        <circle cx={cx} cy={cy} r={8} fill={zoneColor} fillOpacity={0.15} stroke={zoneColor} strokeWidth={2} strokeOpacity={0.5} />
        <text x={cx} y={cy + 3} textAnchor="middle" fill="rgba(255,255,255,0.85)" className="text-[10px] font-bold">{score}</text>
      </svg>
      <div className="flex items-center gap-2">
        <div className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: zoneColor }} />
        <span className="text-white/65 text-xs font-medium">{zone}</span>
      </div>
    </div>
  )
}

// ─── CHAPMAN: Pentagon Radar (5 love languages) ─────────────────
function ChapmanArcsChart({ data }) {
  const languages = [
    { label: 'Tiempo de calidad', key: 'tiempo_calidad', color: '#ef4444', shortLabel: 'Tiempo' },
    { label: 'Actos de servicio', key: 'actos_servicio', color: '#f97316', shortLabel: 'Servicio' },
    { label: 'Contacto físico', key: 'contacto_fisico', color: '#ec4899', shortLabel: 'Contacto' },
    { label: 'Palabras de afirmación', key: 'palabras', color: '#8b5cf6', shortLabel: 'Palabras' },
    { label: 'Regalos', key: 'regalos', color: '#f59e0b', shortLabel: 'Regalos' }
  ]
  const cx = 150, cy = 145, R = 95, n = 5
  const getPoint = (i, val) => {
    const angle = (Math.PI * 2 * i) / n - Math.PI / 2
    const dist = (val / 100) * R
    return [cx + Math.cos(angle) * dist, cy + Math.sin(angle) * dist]
  }
  const values = languages.map(l => data?.[l.key] ?? (data?.puntuacion ? Math.max(15, data.puntuacion + (languages.indexOf(l) - 2) * 10) : 50))
  const dataPoints = values.map((v, i) => getPoint(i, v))
  const polygonStr = dataPoints.map(p => p.join(',')).join(' ')
  // Grid levels
  const gridLevels = [25, 50, 75, 100]
  return (
    <div className="flex justify-center py-4">
      <svg viewBox="0 0 300 300" className="w-full max-w-xs">
        <defs>
          <radialGradient id="chap-fill" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#ec4899" stopOpacity="0.3" />
            <stop offset="100%" stopColor="#8b5cf6" stopOpacity="0.08" />
          </radialGradient>
        </defs>
        {/* Grid pentagons */}
        {gridLevels.map((lv, li) => {
          const pts = Array.from({ length: n }, (_, i) => getPoint(i, lv).join(',')).join(' ')
          return <polygon key={li} points={pts} fill="none" stroke="rgba(255,255,255,0.06)" strokeWidth="0.8" />
        })}
        {/* Axis lines */}
        {Array.from({ length: n }, (_, i) => {
          const [ex, ey] = getPoint(i, 100)
          return <line key={i} x1={cx} y1={cy} x2={ex} y2={ey} stroke="rgba(255,255,255,0.06)" strokeWidth="0.8" />
        })}
        {/* Filled data polygon */}
        <polygon points={polygonStr} fill="url(#chap-fill)" stroke="rgba(236,72,153,0.6)" strokeWidth="2" />
        {/* Data points + labels */}
        {languages.map((lang, i) => {
          const [px, py] = dataPoints[i]
          const [lx, ly] = getPoint(i, 118)
          return (
            <g key={i}>
              <circle cx={px} cy={py} r={5} fill={lang.color} fillOpacity={0.8} stroke={lang.color} strokeWidth={1} strokeOpacity={0.4} />
              <text x={lx} y={ly + 1} textAnchor="middle" dominantBaseline="central" fill={lang.color} className="text-[10px] font-medium" fillOpacity={0.9}>{lang.shortLabel}</text>
              <text x={px} y={py - 10} textAnchor="middle" fill="rgba(255,255,255,0.75)" className="text-[10px] font-bold">{values[i]}</text>
            </g>
          )
        })}
        <text x={cx} y={cy - 3} textAnchor="middle" fill="rgba(255,255,255,0.8)" className="text-[13px] font-bold">{data?.puntuacion ?? 50}%</text>
        <text x={cx} y={cy + 12} textAnchor="middle" fill="rgba(255,255,255,0.5)" className="text-[9px] font-light">compatibilidad</text>
      </svg>
    </div>
  )
}

// ─── TERRY REAL: Balance / Seesaw SVG ────────────────────────────
function RealBalanceChart({ data }) {
  const score = data?.puntuacion ?? 50
  // High score = balanced, low = tilted
  const tiltAngle = ((50 - score) / 50) * 15 // degrees
  return (
    <div className="flex flex-col items-center py-4 gap-2">
      <svg viewBox="0 0 300 180" className="w-full max-w-xs">
        {/* Fulcrum triangle */}
        <polygon points="150,160 140,180 160,180" fill="rgba(6,182,212,0.2)" stroke="rgba(6,182,212,0.4)" strokeWidth={1.5} />
        {/* Beam — rotates based on score */}
        <g transform={`rotate(${tiltAngle}, 150, 155)`}>
          <line x1={40} y1={155} x2={260} y2={155} stroke="rgba(6,182,212,0.5)" strokeWidth={3} strokeLinecap="round" />
          {/* Left plate — Grandiosidad */}
          <rect x={25} y={140} width={50} height={30} rx={6} fill="rgba(239,68,68,0.1)" stroke="rgba(239,68,68,0.3)" strokeWidth={1} />
          <text x={50} y={153} textAnchor="middle" fill="rgba(239,68,68,0.75)" className="text-[9px] font-medium">Grandiosidad</text>
          <text x={50} y={164} textAnchor="middle" fill="rgba(255,255,255,0.55)" className="text-[10px] font-bold">{Math.max(0, 100 - score - 10)}%</text>
          {/* Right plate — Vergüenza */}
          <rect x={225} y={140} width={50} height={30} rx={6} fill="rgba(59,130,246,0.1)" stroke="rgba(59,130,246,0.3)" strokeWidth={1} />
          <text x={250} y={153} textAnchor="middle" fill="rgba(59,130,246,0.75)" className="text-[9px] font-medium">Vergüenza</text>
          <text x={250} y={164} textAnchor="middle" fill="rgba(255,255,255,0.55)" className="text-[10px] font-bold">{Math.max(0, score - 10)}%</text>
        </g>
        {/* Center score */}
        <circle cx={150} cy={130} r={18} fill="rgba(6,182,212,0.1)" stroke="rgba(6,182,212,0.4)" strokeWidth={1.5} />
        <text x={150} y={133} textAnchor="middle" fill="rgba(6,182,212,0.9)" className="text-[11px] font-bold">{score}%</text>
        <text x={150} y={115} textAnchor="middle" fill="rgba(255,255,255,0.55)" className="text-[9px] font-light">Equilibrio relacional</text>
      </svg>
      <p className="text-white/55 text-xs font-light">{score >= 60 ? 'Buen equilibrio de poder' : score >= 40 ? 'Desequilibrio moderado' : 'Desequilibrio significativo'}</p>
    </div>
  )
}

// ─── NEW CARD CHARTS (data-driven from graficas_autoanalisis) ─────

// 1. DualBarsChart — horizontal bars summary (apertura_rapport)
function DualBarsChart({ data }) {
  if (!data?.length) return null
  const colorMap = { violet: '#8b5cf6', blue: '#3b82f6', rose: '#f43f5e', amber: '#f59e0b', emerald: '#10b981', cyan: '#06b6d4' }
  const h = data.length * 44 + 10
  return (
    <div className="py-4 px-2">
      <svg viewBox={`0 0 440 ${h}`} className="w-full max-w-md mx-auto">
        {data.map((item, i) => {
          const y = 14 + i * 44
          const c = colorMap[item.color] || '#8b5cf6'
          const barW = (item.valor / 100) * 210
          return (
            <g key={i}>
              <text x={0} y={y + 2} fill="rgba(255,255,255,0.7)" fontSize="13" fontWeight="300">{item.label}</text>
              <rect x={170} y={y - 9} width={210} height={16} rx={8} fill="rgba(255,255,255,0.04)" />
              <rect x={170} y={y - 9} width={barW} height={16} rx={8} fill={c} fillOpacity={0.45} />
              <text x={170 + barW + 10} y={y + 3} fill={c} fontSize="13" fontWeight="700">{item.valor}%</text>
            </g>
          )
        })}
      </svg>
    </div>
  )
}

// 2. PolarityScaleChart — horizontal polarity scales (forma_de_amar)
function PolarityScaleChart({ data }) {
  if (!data?.length) return null
  const colors = ['#a78bfa', '#f472b6', '#34d399', '#fbbf24', '#60a5fa']
  return (
    <div className="py-4 px-3 space-y-5">
      {data.map((item, i) => {
        const c = colors[i % colors.length]
        return (
          <div key={i}>
            <div className="flex justify-between mb-1.5">
              <span className="text-white/65 text-[13px] font-light">{item.izq}</span>
              <span className="text-white/65 text-[13px] font-light">{item.der}</span>
            </div>
            <div className="relative h-3 rounded-full bg-white/[0.06]">
              <div className="absolute top-1/2 -translate-y-1/2 w-4 h-4 rounded-full border-2 shadow-lg transition-all"
                style={{ left: `calc(${item.valor}% - 8px)`, backgroundColor: `${c}30`, borderColor: c, boxShadow: `0 0 8px ${c}40` }} />
            </div>
          </div>
        )
      })}
    </div>
  )
}

// 3. AttachmentQuadrantChart — 2D attachment quadrant (lo_que_busca_en_el_otro)
function AttachmentQuadrantChart({ data }) {
  if (!data) return null
  const { ansiedad, evitacion } = data
  const cx = 220, cy = 190, w = 300, h = 280
  const px = 70 + (evitacion / 100) * w
  const py = 40 + ((100 - ansiedad) / 100) * h
  return (
    <div className="flex justify-center py-4">
      <svg viewBox="0 0 440 390" className="w-full max-w-sm">
        {/* Background quadrants */}
        <rect x={70} y={40} width={150} height={140} fill="rgba(16,185,129,0.06)" rx={4} />
        <rect x={220} y={40} width={150} height={140} fill="rgba(245,158,11,0.06)" rx={4} />
        <rect x={70} y={180} width={150} height={140} fill="rgba(99,102,241,0.06)" rx={4} />
        <rect x={220} y={180} width={150} height={140} fill="rgba(239,68,68,0.06)" rx={4} />
        {/* Axis lines */}
        <line x1={70} y1={180} x2={370} y2={180} stroke="rgba(255,255,255,0.12)" strokeWidth={1} />
        <line x1={220} y1={40} x2={220} y2={320} stroke="rgba(255,255,255,0.12)" strokeWidth={1} />
        {/* Quadrant labels */}
        <text x={145} y={115} textAnchor="middle" fill="rgba(16,185,129,0.75)" fontSize="14" fontWeight="500">Ansioso</text>
        <text x={295} y={115} textAnchor="middle" fill="rgba(245,158,11,0.75)" fontSize="14" fontWeight="500">Desorganizado</text>
        <text x={145} y={255} textAnchor="middle" fill="rgba(99,102,241,0.75)" fontSize="14" fontWeight="500">Seguro</text>
        <text x={295} y={255} textAnchor="middle" fill="rgba(239,68,68,0.75)" fontSize="14" fontWeight="500">Evitativo</text>
        {/* Axis labels */}
        <text x={220} y={345} textAnchor="middle" fill="rgba(255,255,255,0.5)" fontSize="12" fontWeight="300">Evitación →</text>
        <text x={42} y={180} textAnchor="middle" fill="rgba(255,255,255,0.5)" fontSize="12" fontWeight="300" transform="rotate(-90,42,180)">Ansiedad →</text>
        {/* Data point */}
        <circle cx={px} cy={py} r={16} fill="rgba(139,92,246,0.15)" stroke="#8b5cf6" strokeWidth={2} />
        <circle cx={px} cy={py} r={6} fill="#8b5cf6" fillOpacity={0.9} />
        {/* Values */}
        <text x={px} y={py - 24} textAnchor="middle" fill="#8b5cf6" fontSize="13" fontWeight="700">A:{ansiedad} E:{evitacion}</text>
      </svg>
    </div>
  )
}

// 4. MirrorGraph — two columns AFUERA→ADENTRO (lo_que_reclama_afuera)
function MirrorGraph({ data }) {
  if (!data?.length) return null
  const colors = ['#fb923c', '#f472b6', '#a78bfa', '#34d399']
  return (
    <div className="py-4 px-3">
      <div className="flex justify-between mb-3 px-4">
        <span className="text-xs font-bold uppercase tracking-[0.2em] text-amber-400/70">Afuera</span>
        <span className="text-xs font-bold uppercase tracking-[0.2em] text-violet-400/70">Adentro</span>
      </div>
      <div className="space-y-3">
        {data.map((item, i) => {
          const c = colors[i % colors.length]
          return (
            <div key={i} className="flex items-center gap-2">
              <div className="flex-1 text-right p-3 rounded-lg border border-white/[0.06] bg-white/[0.02]">
                <span className="text-white/75 text-sm font-light">{item.afuera}</span>
              </div>
              <div className="flex-shrink-0 w-8 flex justify-center">
                <svg viewBox="0 0 30 12" className="w-7 h-3">
                  <line x1={0} y1={6} x2={22} y2={6} stroke={c} strokeWidth={1.5} strokeOpacity={0.5} />
                  <polygon points="22,2 30,6 22,10" fill={c} fillOpacity={0.6} />
                </svg>
              </div>
              <div className="flex-1 p-3 rounded-lg border border-white/[0.06] bg-white/[0.02]">
                <span className="text-white/75 text-sm font-light">{item.adentro}</span>
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}

// 5. RelationalSceneChart — cross with 4 roles + center (fantasma_relacional)
function RelationalSceneChart({ data }) {
  if (!data) return null
  return (
    <div className="flex justify-center py-4">
      <svg viewBox="0 0 440 400" className="w-full max-w-sm">
        {/* Cross lines */}
        <line x1={220} y1={50} x2={220} y2={340} stroke="rgba(255,255,255,0.08)" strokeWidth={1} strokeDasharray="4 4" />
        <line x1={40} y1={195} x2={400} y2={195} stroke="rgba(255,255,255,0.08)" strokeWidth={1} strokeDasharray="4 4" />
        {/* Center — persona */}
        <circle cx={220} cy={195} r={36} fill="rgba(192,132,252,0.12)" stroke="rgba(192,132,252,0.4)" strokeWidth={2} />
        <text x={220} y={192} textAnchor="middle" fill="rgba(255,255,255,0.85)" fontSize="14" fontWeight="700">{data.centro}</text>
        <text x={220} y={208} textAnchor="middle" fill="rgba(255,255,255,0.4)" fontSize="11" fontWeight="300">centro</text>
        {/* Arriba */}
        <rect x={120} y={8} width={200} height={52} rx={12} fill="rgba(139,92,246,0.08)" stroke="rgba(139,92,246,0.25)" strokeWidth={1} />
        <text x={220} y={30} textAnchor="middle" fill="rgba(139,92,246,0.85)" fontSize="13" fontWeight="500">{data.arriba?.rol}</text>
        <text x={220} y={48} textAnchor="middle" fill="rgba(255,255,255,0.45)" fontSize="11" fontWeight="300">{data.arriba?.subtexto}</text>
        {/* Abajo */}
        <rect x={120} y={310} width={200} height={52} rx={12} fill="rgba(239,68,68,0.08)" stroke="rgba(239,68,68,0.25)" strokeWidth={1} />
        <text x={220} y={332} textAnchor="middle" fill="rgba(239,68,68,0.75)" fontSize="13" fontWeight="500">{data.abajo?.rol}</text>
        <text x={220} y={350} textAnchor="middle" fill="rgba(255,255,255,0.45)" fontSize="11" fontWeight="300">{data.abajo?.subtexto}</text>
        {/* Izquierda */}
        <rect x={5} y={170} width={145} height={52} rx={12} fill="rgba(59,130,246,0.08)" stroke="rgba(59,130,246,0.25)" strokeWidth={1} />
        <text x={78} y={192} textAnchor="middle" fill="rgba(59,130,246,0.75)" fontSize="13" fontWeight="500">{data.izquierda?.rol}</text>
        <text x={78} y={210} textAnchor="middle" fill="rgba(255,255,255,0.45)" fontSize="11" fontWeight="300">{data.izquierda?.subtexto}</text>
        {/* Derecha */}
        <rect x={290} y={170} width={145} height={52} rx={12} fill="rgba(16,185,129,0.08)" stroke="rgba(16,185,129,0.25)" strokeWidth={1} />
        <text x={363} y={192} textAnchor="middle" fill="rgba(16,185,129,0.75)" fontSize="13" fontWeight="500">{data.derecha?.rol}</text>
        <text x={363} y={210} textAnchor="middle" fill="rgba(255,255,255,0.45)" fontSize="11" fontWeight="300">{data.derecha?.subtexto}</text>
      </svg>
    </div>
  )
}

// 6. IdentityGapChart — horizontal gap bar yo_ideal vs yo_real (yo_ideal)
function IdentityGapChart({ data }) {
  if (!data) return null
  const { brecha, yo_ideal, yo_real } = data
  return (
    <div className="py-4 px-3 space-y-5">
      {/* Gap bar */}
      <div className="text-center">
        <span className="text-white/50 text-xs font-light uppercase tracking-widest">Brecha identitaria</span>
        <div className="relative h-5 rounded-full bg-white/[0.06] mt-2 mx-4 overflow-hidden">
          <div className="absolute inset-y-0 left-0 rounded-full bg-gradient-to-r from-emerald-500/40 to-red-500/40" style={{ width: `${brecha}%` }} />
          <div className="absolute inset-y-0 left-0 flex items-center justify-center w-full">
            <span className="text-white/90 text-sm font-bold">{brecha}%</span>
          </div>
        </div>
      </div>
      {/* Two columns */}
      <div className="grid grid-cols-2 gap-3">
        <div className="p-4 rounded-xl border border-emerald-500/15 bg-emerald-500/[0.03]">
          <p className="text-emerald-400/80 text-xs font-bold uppercase tracking-wider mb-2">Yo ideal</p>
          {yo_ideal?.map((t, i) => (
            <p key={i} className="text-white/65 text-sm font-light leading-relaxed">• {t}</p>
          ))}
        </div>
        <div className="p-4 rounded-xl border border-red-500/15 bg-red-500/[0.03]">
          <p className="text-red-400/80 text-xs font-bold uppercase tracking-wider mb-2">Yo real</p>
          {yo_real?.map((t, i) => (
            <p key={i} className="text-white/65 text-sm font-light leading-relaxed">• {t}</p>
          ))}
        </div>
      </div>
    </div>
  )
}

// 7. DefenseRadarChart — pentagon radar for defenses (mecanismos_defensa)
function DefenseRadarChart({ data }) {
  if (!data?.length) return null
  const n = data.length
  const cx = 180, cy = 175, R = 110
  const getP = (i, v) => {
    const a = (Math.PI * 2 * i) / n - Math.PI / 2
    return [cx + Math.cos(a) * (v / 100) * R, cy + Math.sin(a) * (v / 100) * R]
  }
  const polyStr = data.map((d, i) => getP(i, d.valor).join(',')).join(' ')
  const colors = ['#f43f5e', '#f97316', '#eab308', '#22d3ee', '#8b5cf6']
  return (
    <div className="flex justify-center py-4">
      <svg viewBox="0 0 360 370" className="w-full max-w-sm">
        <defs>
          <radialGradient id="def-fill" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#f43f5e" stopOpacity="0.25" />
            <stop offset="100%" stopColor="#8b5cf6" stopOpacity="0.05" />
          </radialGradient>
        </defs>
        {/* Grid */}
        {[25, 50, 75, 100].map(lv => {
          const pts = Array.from({ length: n }, (_, i) => getP(i, lv).join(',')).join(' ')
          return <polygon key={lv} points={pts} fill="none" stroke="rgba(255,255,255,0.06)" strokeWidth="0.8" />
        })}
        {/* Axes */}
        {data.map((_, i) => {
          const [ex, ey] = getP(i, 100)
          return <line key={i} x1={cx} y1={cy} x2={ex} y2={ey} stroke="rgba(255,255,255,0.06)" strokeWidth="0.8" />
        })}
        {/* Data polygon */}
        <polygon points={polyStr} fill="url(#def-fill)" stroke="rgba(244,63,94,0.6)" strokeWidth="2" />
        {/* Points + labels */}
        {data.map((d, i) => {
          const [px, py] = getP(i, d.valor)
          const [lx, ly] = getP(i, 125)
          const c = colors[i % colors.length]
          return (
            <g key={i}>
              <circle cx={px} cy={py} r={6} fill={c} fillOpacity={0.8} />
              <text x={lx} y={ly + 1} textAnchor="middle" dominantBaseline="central" fill={c} fontSize="12" fontWeight="500" fillOpacity={0.9}>{d.nombre}</text>
              <text x={px} y={py - 12} textAnchor="middle" fill="rgba(255,255,255,0.8)" fontSize="12" fontWeight="700">{d.valor}</text>
            </g>
          )
        })}
      </svg>
    </div>
  )
}

// 8. RepetitionCycleChart — circular loop (tipo_pareja_que_repite)
function RepetitionCycleChart({ data }) {
  if (!data?.length) return null
  const n = data.length
  const cx = 210, cy = 200, r = 130
  const colors = ['#f43f5e', '#f97316', '#eab308', '#6366f1', '#8b5cf6']
  const nodes = data.map((label, i) => {
    const angle = (i / n) * Math.PI * 2 - Math.PI / 2
    return { label, x: cx + r * Math.cos(angle), y: cy + r * Math.sin(angle), angle }
  })
  return (
    <div className="flex justify-center py-4">
      <svg viewBox="0 0 420 400" className="w-full max-w-sm">
        {/* Orbit circle */}
        <circle cx={cx} cy={cy} r={r} fill="none" stroke="rgba(255,255,255,0.06)" strokeWidth={1.5} strokeDasharray="6 4" />
        {/* Curved arrows between nodes */}
        {nodes.map((node, i) => {
          const next = nodes[(i + 1) % n]
          const midAngle = ((i + 0.5) / n) * Math.PI * 2 - Math.PI / 2
          const ctrlR = r * 0.65
          const ctrlX = cx + ctrlR * Math.cos(midAngle)
          const ctrlY = cy + ctrlR * Math.sin(midAngle)
          return (
            <path key={`arc-${i}`}
              d={`M ${node.x} ${node.y} Q ${ctrlX} ${ctrlY} ${next.x} ${next.y}`}
              fill="none" stroke={colors[i % colors.length]} strokeWidth={1.5} strokeOpacity={0.3}
              markerEnd="url(#cycle-arrow)" />
          )
        })}
        <defs>
          <marker id="cycle-arrow" markerWidth="6" markerHeight="4" refX="5" refY="2" orient="auto">
            <path d="M 0 0 L 6 2 L 0 4" fill="rgba(255,255,255,0.4)" />
          </marker>
        </defs>
        {/* Nodes — full labels, no truncation */}
        {nodes.map((node, i) => {
          const c = colors[i % colors.length]
          const words = node.label.split(' ')
          const lines = []
          let cur = ''
          words.forEach(w => { if ((cur + ' ' + w).trim().length > 16) { lines.push(cur.trim()); cur = w } else cur = (cur + ' ' + w).trim() })
          if (cur) lines.push(cur)
          const nodeR = 28
          return (
            <g key={i}>
              <circle cx={node.x} cy={node.y} r={nodeR} fill={`${c}15`} stroke={c} strokeWidth={1.5} strokeOpacity={0.5} />
              {lines.slice(0, 3).map((l, li) => (
                <text key={li} x={node.x} y={node.y - ((lines.length - 1) * 6) + li * 13} textAnchor="middle" fill="rgba(255,255,255,0.85)" fontSize="11" fontWeight="500" dominantBaseline="central">{l}</text>
              ))}
            </g>
          )
        })}
        {/* Center label */}
        <text x={cx} y={cy - 6} textAnchor="middle" fill="rgba(255,255,255,0.55)" fontSize="13" fontWeight="500">Ciclo</text>
        <text x={cx} y={cy + 10} textAnchor="middle" fill="rgba(255,255,255,0.4)" fontSize="11" fontWeight="300">repetición</text>
      </svg>
    </div>
  )
}

// 9. OrbitalCoreChart — nucleus with orbiting forces (nucleo_del_patron)
function OrbitalCoreChart({ data }) {
  if (!data) return null
  const { centro, fuerzas } = data
  const cx = 220, cy = 210, orbitR = 130
  const colors = ['#8b5cf6', '#f43f5e', '#10b981', '#3b82f6', '#f59e0b']
  return (
    <div className="py-4">
      <svg viewBox="0 0 440 430" className="w-full max-w-md mx-auto">
        {/* Orbit ring */}
        <circle cx={cx} cy={cy} r={orbitR} fill="none" stroke="rgba(255,255,255,0.06)" strokeWidth={1} strokeDasharray="4 6" />
        <circle cx={cx} cy={cy} r={orbitR - 25} fill="none" stroke="rgba(255,255,255,0.03)" strokeWidth={0.5} />
        {/* Central nucleus */}
        <circle cx={cx} cy={cy} r={48} fill="rgba(139,92,246,0.1)" stroke="rgba(139,92,246,0.35)" strokeWidth={2} />
        {/* Center text — wrap long text */}
        {centro && (() => {
          const words = centro.split(' ')
          const lines = []
          let current = ''
          words.forEach(w => {
            if ((current + ' ' + w).length > 20) { lines.push(current.trim()); current = w }
            else current += ' ' + w
          })
          if (current.trim()) lines.push(current.trim())
          return lines.slice(0, 4).map((l, i) => (
            <text key={i} x={cx} y={cy - ((lines.length - 1) * 7) + i * 14} textAnchor="middle" fill="rgba(255,255,255,0.75)" fontSize="11" fontWeight="300">{l}</text>
          ))
        })()}
        {/* Orbiting forces */}
        {fuerzas?.map((f, i) => {
          const angle = (i / fuerzas.length) * Math.PI * 2 - Math.PI / 2
          const fx = cx + orbitR * Math.cos(angle)
          const fy = cy + orbitR * Math.sin(angle)
          const nodeR = 16 + (f.intensidad / 100) * 16
          const c = colors[i % colors.length]
          return (
            <g key={i}>
              <line x1={cx} y1={cy} x2={fx} y2={fy} stroke={c} strokeWidth={1 + (f.intensidad / 100) * 2} strokeOpacity={0.15} />
              <circle cx={fx} cy={fy} r={nodeR} fill={`${c}18`} stroke={c} strokeWidth={1.5} strokeOpacity={0.5} />
              <text x={fx} y={fy - 1} textAnchor="middle" dominantBaseline="central" fill="rgba(255,255,255,0.9)" fontSize="13" fontWeight="700">{f.intensidad}</text>
              <text x={fx} y={fy + nodeR + 14} textAnchor="middle" fill={c} fontSize="12" fontWeight="500" fillOpacity={0.85}>{f.nombre}</text>
            </g>
          )
        })}
      </svg>
    </div>
  )
}

// 10. BeforeAfterMap — two columns antes → despues (cierre_transformador)
function BeforeAfterMap({ data }) {
  if (!data?.length) return null
  return (
    <div className="py-4 px-3">
      <div className="flex justify-between mb-3 px-4">
        <span className="text-xs font-bold uppercase tracking-[0.2em] text-red-400/70">Patrón actual</span>
        <span className="text-xs font-bold uppercase tracking-[0.2em] text-emerald-400/70">Dirección de cambio</span>
      </div>
      <div className="space-y-3">
        {data.map((item, i) => (
          <div key={i} className="flex items-center gap-2">
            <div className="flex-1 text-right p-3 rounded-lg border border-red-500/10 bg-red-500/[0.03]">
              <span className="text-white/75 text-sm font-light">{item.antes}</span>
            </div>
            <div className="flex-shrink-0 w-8 flex justify-center">
              <svg viewBox="0 0 30 12" className="w-7 h-3">
                <line x1={0} y1={6} x2={22} y2={6} stroke="#10b981" strokeWidth={1.5} strokeOpacity={0.5} />
                <polygon points="22,2 30,6 22,10" fill="#10b981" fillOpacity={0.6} />
              </svg>
            </div>
            <div className="flex-1 p-3 rounded-lg border border-emerald-500/10 bg-emerald-500/[0.03]">
              <span className="text-white/75 text-sm font-light">{item.despues}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

// 11b. JouissanceChart — goce repetition pattern (goce_repeticion)
function JouissanceChart({ data }) {
  if (!data) return null
  const { posicion, escena, intensidades } = data
  if (!intensidades?.length) return null
  const cx = 200, cy = 200, maxR = 140
  const colors = ['#ef4444', '#f97316', '#eab308', '#a855f7', '#ec4899']
  const n = intensidades.length
  const points = intensidades.map((item, i) => {
    const angle = (i / n) * Math.PI * 2 - Math.PI / 2
    const r = (item.nivel / 100) * maxR
    return { ...item, x: cx + r * Math.cos(angle), y: cy + r * Math.sin(angle), lx: cx + (maxR + 30) * Math.cos(angle), ly: cy + (maxR + 30) * Math.sin(angle) }
  })
  const pathD = points.map((p, i) => `${i === 0 ? 'M' : 'L'} ${p.x} ${p.y}`).join(' ') + ' Z'
  return (
    <div className="py-4">
      <svg viewBox="0 0 400 430" className="w-full max-w-sm mx-auto">
        {/* Grid circles */}
        {[0.25, 0.5, 0.75, 1].map(f => (
          <circle key={f} cx={cx} cy={cy} r={maxR * f} fill="none" stroke="rgba(255,255,255,0.05)" strokeWidth={1} />
        ))}
        {/* Axis lines */}
        {points.map((p, i) => (
          <line key={i} x1={cx} y1={cy} x2={cx + maxR * Math.cos((i / n) * Math.PI * 2 - Math.PI / 2)} y2={cy + maxR * Math.sin((i / n) * Math.PI * 2 - Math.PI / 2)} stroke="rgba(255,255,255,0.06)" strokeWidth={1} />
        ))}
        {/* Area fill */}
        <path d={pathD} fill="rgba(239,68,68,0.08)" stroke="#ef4444" strokeWidth={2} strokeOpacity={0.5} />
        {/* Data points + labels */}
        {points.map((p, i) => {
          const c = colors[i % colors.length]
          return (
            <g key={i}>
              <circle cx={p.x} cy={p.y} r={5} fill={c} fillOpacity={0.8} stroke={c} strokeWidth={1.5} strokeOpacity={0.3} />
              <text x={p.lx} y={p.ly} textAnchor="middle" dominantBaseline="central" fill="rgba(255,255,255,0.75)" fontSize="11" fontWeight="400">{p.area}</text>
              <text x={p.x} y={p.y - 12} textAnchor="middle" fill={c} fontSize="12" fontWeight="700">{p.nivel}%</text>
            </g>
          )
        })}
        {/* Center */}
        <circle cx={cx} cy={cy} r={28} fill="rgba(239,68,68,0.1)" stroke="rgba(239,68,68,0.3)" strokeWidth={1.5} />
        <text x={cx} y={cy - 4} textAnchor="middle" fill="rgba(255,255,255,0.7)" fontSize="11" fontWeight="600">Goce</text>
        <text x={cx} y={cy + 10} textAnchor="middle" fill="rgba(255,255,255,0.4)" fontSize="9">repetición</text>
      </svg>
      {posicion && (
        <div className="text-center mt-2">
          <span className="text-xs font-bold uppercase tracking-[0.2em] text-red-400/70">Posición subjetiva: </span>
          <span className="text-white/70 text-sm font-light">{posicion}</span>
        </div>
      )}
      {escena && (
        <div className="text-center mt-1">
          <span className="text-xs font-bold uppercase tracking-[0.2em] text-orange-400/60">Escena gozosa: </span>
          <span className="text-white/60 text-xs font-light italic">{escena}</span>
        </div>
      )}
    </div>
  )
}

// 12. RelationshipTimeline — vertical timeline (for radiografia_inicial)
function RelationshipTimeline({ data }) {
  if (!data?.length) return null
  const colors = ['#8b5cf6', '#3b82f6', '#f59e0b', '#ef4444']
  return (
    <div className="py-4 px-4">
      <p className="text-xs font-bold uppercase tracking-[0.2em] text-violet-400/60 mb-4 text-center">Trayectoria de la relación</p>
      <div className="relative pl-7">
        {/* Vertical line */}
        <div className="absolute left-2.5 top-1 bottom-1 w-[2px] bg-gradient-to-b from-violet-500/30 via-blue-500/20 to-red-500/30 rounded-full" />
        {data.map((item, i) => {
          const c = colors[i % colors.length]
          return (
            <div key={i} className="relative mb-5 last:mb-0">
              <div className="absolute -left-4.5 top-1.5 w-3.5 h-3.5 rounded-full border-2" style={{ borderColor: c, backgroundColor: `${c}25` }} />
              <div className="pl-3">
                <p className="text-white/85 text-base font-medium">{item.etapa}</p>
                <p className="text-white/50 text-sm font-light">{item.subtexto}</p>
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}

// ─── MAIN COMPONENT ──────────────────────────────────────────────

const RadiografiaPremiumPage = () => {
  const navigate = useNavigate()

  // Package type: descubre | solo | losdos | demo
  const [packageType] = useState(() => {
    const params = new URLSearchParams(window.location.search)
    return params.get('type') || sessionStorage.getItem('diagnostico_relacional_type') || 'solo'
  })

  // Purchase token from URL — used for localStorage namespacing and API calls
  const [purchaseToken] = useState(() => new URLSearchParams(window.location.search).get('token') || '')

  // Cross-analysis data (losdos package)
  const [crossAnalysis, setCrossAnalysis] = useState(null)
  // Tab state for results: 'individual' or 'cruzado'
  const [resultTab, setResultTab] = useState('individual')

  // Payment gate — only allow access if paid, free promo, test/dev mode, or token link
  const [accessGranted] = useState(() => {
    if (import.meta.env.DEV) return true
    const params = new URLSearchParams(window.location.search)
    return (
      params.get('free') === 'true' ||
      params.get('test') === 'true' ||
      params.get('token') !== null ||
      sessionStorage.getItem('diagnostico_relacional_purchased') === 'true'
    )
  })

  // Stages: instructions | profile | questionnaire | analyzing | results
  const [stage, setStage] = useState('instructions')
  const [currentQ, setCurrentQ] = useState(0)
  const [responses, setResponses] = useState({})
  const [selectedVoiceId, setSelectedVoiceId] = useState(VOICE_LIST[0].id)
  const [previewingVoiceId, setPreviewingVoiceId] = useState(null)

  // Profile — Question 0 (name, age, date, partner)
  const [profileData, setProfileData] = useState({
    nombre:        sessionStorage.getItem('radiografia_nombre')         || '',
    edad:          sessionStorage.getItem('radiografia_edad')           || '',
    nombrePareja:  sessionStorage.getItem('radiografia_nombre_pareja')  || '',
    edadPareja:    sessionStorage.getItem('radiografia_edad_pareja')    || '',
    fecha: new Date().toLocaleDateString('es-MX', { year: 'numeric', month: 'long', day: 'numeric' })
  })
  const [soundTestOk, setSoundTestOk] = useState(null)
  const [micTestOk, setMicTestOk] = useState(null)
  const [micAnalyser, setMicAnalyser] = useState(null)

  // Audio
  const [audioPlaying, setAudioPlaying] = useState(false)
  const audioRef = useRef(null)
  const currentAudioRef = useRef(null)
  const playGenerationRef = useRef(0)
  const resultsRef = useRef(null)

  // Recording & Input
  const [recording, setRecording] = useState(false)
  const [transcript, setTranscript] = useState('')
  const [typingMode, setTypingMode] = useState(false)
  const [textInput, setTextInput] = useState('')
  const [showRegrabarModal, setShowRegrabarModal] = useState(false)
  const recognitionRef = useRef(null)
  const [recordingAnalyser, setRecordingAnalyser] = useState(null)
  const recordingStreamRef = useRef(null)

  // Analysis
  const [aiAnalysis, setAiAnalysis] = useState(null)
  const [analysisDone, setAnalysisDone] = useState(false)
  const [completedTasks, setCompletedTasks] = useState(0)
  const [pdfGenerating, setPdfGenerating] = useState(false)
  const [cachedAnalysis, setCachedAnalysis] = useState(null)
  const [showOnboarding, setShowOnboarding] = useState(false)
  const [onboardingStep, setOnboardingStep] = useState(0)

  // Email — pre-fill from sessionStorage if coming from purchase thankyou page
  const [emailData, setEmailData] = useState(() => {
    const buyerEmail = sessionStorage.getItem('radiografia_buyer_email') || ''
    const partnerEmail = sessionStorage.getItem('radiografia_partner_email') || ''
    return { emailUsuario: buyerEmail, emailPareja: partnerEmail }
  })

  // Shared sales demo loader used by DEV controls and URL-triggered sample mode.
  const loadSalesDemoAnalysis = useCallback(async () => {
    setProfileData({ nombre: 'Sofía', edad: '31', nombrePareja: 'Mateo', edadPareja: '34' })
    setEmailData(prev => ({ ...prev, emailUsuario: 'demo@ventas.com' }))

    try {
      const { CACHED_DEMO_ANALYSIS } = await import('../data/cachedDemoAnalysis')
      if (CACHED_DEMO_ANALYSIS) {
        setAiAnalysis(CACHED_DEMO_ANALYSIS)
        setCachedAnalysis(CACHED_DEMO_ANALYSIS)
        setStage('results')
        return
      }
    } catch {}

    // If no dedicated demo file exists, fallback to preview analysis.
    if (CACHED_PREVIEW_ANALYSIS) {
      setAiAnalysis(CACHED_PREVIEW_ANALYSIS)
      setCachedAnalysis(CACHED_PREVIEW_ANALYSIS)
      setStage('results')
    }
  }, [])

  // ── Load stored analysis when arriving via "analysis ready" email link ──
  useEffect(() => {
    if (import.meta.env.DEV) return
    const params = new URLSearchParams(window.location.search)
    if (params.get('view') !== 'results') return
    const token = params.get('token')
    if (!token) return

    // Load individual analysis
    getAnalysis(token)
      .then(data => {
        if (data?.analysis) {
          setAiAnalysis(data.analysis)
          setStage('results')
        }
      })
      .catch(() => {})

    // If cross-analysis link (?cross=pairId), also load cross-analysis
    const crossPairId = params.get('cross')
    if (crossPairId) {
      getCrossAnalysis(crossPairId, token)
        .then(data => {
          if (data?.analysis) {
            setCrossAnalysis(data.analysis)
            setResultTab('cruzado')
          }
        })
        .catch(() => {})
    } else {
      // Cross-analysis resilience: if no cross link yet, check if both partners are done
      // and trigger cross-analysis generation if needed
      checkCrossStatus(token)
        .then(async (crossStatus) => {
          if (!crossStatus?.bothDone) return
          // Check if cross-analysis already exists
          if (crossStatus.pairId) {
            try {
              const existing = await getCrossAnalysis(crossStatus.pairId, token)
              if (existing?.analysis) {
                setCrossAnalysis(existing.analysis)
                return
              }
            } catch {}
          }
          // Both done but no cross-analysis yet → generate it
          if (crossStatus.otherAnalysis) {
            try {
              const myAnalysis = await getAnalysis(token)
              if (!myAnalysis?.analysis) return
              const crossResult = await analyzeCrossRadiografia({
                analysis1: myAnalysis.analysis,
                analysis2: crossStatus.otherAnalysis,
                profile1: { nombre: 'Participante 1' },
                profile2: { nombre: 'Participante 2' },
              })
              if (crossResult && crossStatus.pairId) {
                await saveCrossAnalysis({ token, pairId: crossStatus.pairId, analysis: crossResult })
                setCrossAnalysis(crossResult)
                await sendCrossAnalysisEmail({ pairId: crossStatus.pairId, token })
              }
            } catch (e) { console.error('Cross-analysis resilience error:', e) }
          }
        })
        .catch(() => {})
    }

    // Recover profile data from KV if not in sessionStorage
    if (!sessionStorage.getItem('radiografia_nombre')) {
      getProfile(token)
        .then(p => {
          if (p) {
            setProfileData(prev => ({
              ...prev,
              nombre: p.nombre || prev.nombre,
              edad: p.edad || prev.edad,
              nombrePareja: p.nombrePareja || prev.nombrePareja,
              edadPareja: p.edadPareja || prev.edadPareja,
            }))
            if (p.email) setEmailData(prev => ({ ...prev, emailUsuario: p.email || prev.emailUsuario }))
            if (p.partnerEmail) setEmailData(prev => ({ ...prev, emailPareja: p.partnerEmail || prev.emailPareja }))
          }
        })
        .catch(() => {})
    }
  }, [])

  // ── Public sample mode: ?demo=ventas → open same sales demo as DEV button ──
  useEffect(() => {
    const params = new URLSearchParams(window.location.search)
    if (params.get('demo') === 'ventas') {
      loadSalesDemoAnalysis()
    }
  }, [loadSalesDemoAnalysis])

  const question = PREGUNTAS[currentQ]
  const isDescubre = packageType === 'descubre'
  const questionText = isDescubre && question?.mainQuestion_descubre ? question.mainQuestion_descubre : question?.mainQuestion
  const questionExamples = isDescubre && question?.examples_descubre ? question.examples_descubre : question?.examples
  const totalQ = PREGUNTAS.length
  const progress = ((currentQ + 1) / totalQ) * 100

  // ── Restore saved progress from localStorage (namespaced by token) ──
  useEffect(() => {
    try {
      const storageKey = purchaseToken ? `radiografia_premium_progress_${purchaseToken}` : 'radiografia_premium_progress'
      const saved = localStorage.getItem(storageKey)
      if (saved) {
        const data = JSON.parse(saved)
        if (data.responses && Object.keys(data.responses).length > 0) {
          setResponses(data.responses)
          if (data.currentQ != null) setCurrentQ(data.currentQ)
          if (data.profileData) setProfileData(prev => ({ ...prev, ...data.profileData }))
          if (data.stage === 'questionnaire') setStage('questionnaire')
        }
      }
    } catch { /* ignore corrupted data */ }
  }, [])

  // ── Save progress to localStorage on every change (namespaced by token) ──
  useEffect(() => {
    if (stage === 'questionnaire' && Object.keys(responses).length > 0) {
      const storageKey = purchaseToken ? `radiografia_premium_progress_${purchaseToken}` : 'radiografia_premium_progress'
      localStorage.setItem(storageKey, JSON.stringify({
        responses, currentQ, profileData, stage: 'questionnaire'
      }))
    }
  }, [responses, currentQ, stage, profileData])

  // ── Stop any currently playing audio ──
  const stopAudio = useCallback(() => {
    if (currentAudioRef.current) {
      currentAudioRef.current.pause()
      currentAudioRef.current.currentTime = 0
      currentAudioRef.current = null
    }
    setAudioPlaying(false)
  }, [])

  // ── Voice ID → folder name mapping for static audio ──
  const VOICE_FOLDER = {
    'EXAVITQu4vr4xnSDxMaL': 'valentina',
    'JBFqnCBsd6RMkjVDRZzb': 'santiago',
    'onwK4e9ZLuTAKqWW03F9': 'adrian',
    'FGY2WhTYpPnrIDTdsKH5': 'camila'
  }

  // ── Play audio: static files first, ElevenLabs API as fallback ──
  const audioCache = useRef({})
  const playQuestion = useCallback(async (text, overrideVoiceId, onEndedCallback, staticId) => {
    stopAudio()
    const voiceId = overrideVoiceId || selectedVoiceId
    const thisGeneration = ++playGenerationRef.current
    try {
      setAudioPlaying(true)
      if (overrideVoiceId) setPreviewingVoiceId(overrideVoiceId)

      const cacheKey = `${voiceId}::${staticId || (text && text.slice(0, 80))}`

      // Try static file first
      const voiceFolder = VOICE_FOLDER[voiceId]
      const currentQuestion = text && (PREGUNTAS.find(q => q.mainQuestion === text) || PREGUNTAS.find(q => q.mainQuestion_descubre === text))
      const isDescubreText = currentQuestion && currentQuestion.mainQuestion_descubre === text
      const isPreview = text && text.includes('soy ') && text.includes('acompañaré')
      const staticFile = voiceFolder && (staticId
        ? `${AUDIO_BASE}/audio/premium/${voiceFolder}/${staticId}.mp3`
        : currentQuestion
        ? `${AUDIO_BASE}/audio/premium/${voiceFolder}/${currentQuestion.id}${isDescubreText ? '_descubre' : ''}.mp3`
        : isPreview ? `${AUDIO_BASE}/audio/premium/${voiceFolder}/preview.mp3` : null)

      let audioUrl = null

      if (staticFile) {
        // Use static file
        const testRes = await fetch(staticFile, { method: 'HEAD' }).catch(() => null)
        if (testRes?.ok) {
          audioUrl = staticFile
        }
      }

      // Fallback to cache or API (only if we have text to synthesize)
      if (!audioUrl) {
        if (!text) { setAudioPlaying(false); setPreviewingVoiceId(null); if (onEndedCallback) onEndedCallback(); return }
        let blob = audioCache.current[cacheKey]
        if (!blob) {
          const res = await fetch(`${WORKER_URL}/api/tts-proxy`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              voice_id: voiceId,
              text,
              model_id: 'eleven_multilingual_v2',
              voice_settings: { stability: 0.35, similarity_boost: 0.85, style: 0.3, use_speaker_boost: true }
            })
          })
          if (!res.ok) { setAudioPlaying(false); setPreviewingVoiceId(null); return }
          blob = await res.blob()
          audioCache.current[cacheKey] = blob
        }
        audioUrl = URL.createObjectURL(blob)
      }

      if (thisGeneration !== playGenerationRef.current) return

      const audio = new Audio(audioUrl)
      currentAudioRef.current = audio
      audio.onended = () => {
        setAudioPlaying(false)
        setPreviewingVoiceId(null)
        currentAudioRef.current = null
        if (onEndedCallback) onEndedCallback()
      }
      audio.play()
    } catch { setAudioPlaying(false); setPreviewingVoiceId(null) }
  }, [selectedVoiceId, stopAudio])

  // ── Preload next question audio (static files don't need preloading) ──
  const preloadAudio = useCallback(async (text) => {
    // Check if static file exists for this question — if so, no preload needed
    const voiceFolder = VOICE_FOLDER[selectedVoiceId]
    const q = PREGUNTAS.find(p => p.mainQuestion === text) || PREGUNTAS.find(p => p.mainQuestion_descubre === text)
    if (voiceFolder && q) return // static files preload via browser cache

    const cacheKey = `${selectedVoiceId}::${text.slice(0, 80)}`
    if (audioCache.current[cacheKey]) return
    try {
      const res = await fetch(`${WORKER_URL}/api/tts-proxy`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          voice_id: selectedVoiceId,
          text,
          model_id: 'eleven_multilingual_v2',
          voice_settings: { stability: 0.35, similarity_boost: 0.85, style: 0.3, use_speaker_boost: true }
        })
      })
      if (res.ok) {
        const blob = await res.blob()
        audioCache.current[cacheKey] = blob
      }
    } catch {}
  }, [selectedVoiceId])

  // ── Track if greeting audio already played to avoid replaying on stage transition ──
  const greetingPlayedRef = useRef(false)

  // ── Auto-play question when changing question + auto-mic after audio ends ──
  useEffect(() => {
    if (stage === 'questionnaire' && question && !showOnboarding) {
      // Skip auto-play if greeting is still playing (just transitioned from email)
      if (greetingPlayedRef.current) {
        greetingPlayedRef.current = false
        return
      }
      setTypingMode(false)
      // If no voice selected, skip audio and go straight to mic
      if (!selectedVoiceId) {
        setTimeout(() => {
          const sr = window.SpeechRecognition || window.webkitSpeechRecognition
          if (sr) startRecording()
        }, 600)
        return
      }
      playQuestion(questionText, undefined, () => {
        // Auto-start mic after TTS ends (only if not already recording/typing)
        setTimeout(() => {
          const sr = window.SpeechRecognition || window.webkitSpeechRecognition
          if (sr && !typingMode) startRecording()
        }, 300)
      })
      // Preload next question
      if (currentQ < totalQ - 1) {
        const nextQ = PREGUNTAS[currentQ + 1]
        const nextText = isDescubre && nextQ?.mainQuestion_descubre ? nextQ.mainQuestion_descubre : nextQ?.mainQuestion
        if (nextText) preloadAudio(nextText)
      }
    }
    return () => stopAudio()
  }, [currentQ, stage, showOnboarding]) // eslint-disable-line react-hooks-exhaustive-deps

  // ── Spotlight narration: play TTS for each onboarding step ──
  useEffect(() => {
    if (!showOnboarding || stage !== 'questionnaire' || currentQ !== 0) return
    const NARRATIONS = [
      'Aquí verás la pregunta. Se lee en voz alta automáticamente. Solo relájate y escucha.',
      'Si te faltó algo, aquí tienes ideas para enriquecer tu respuesta.',
      'El micrófono se activa automáticamente. Habla con libertad. Cuando termines, toca Siguiente.'
    ]
    const text = NARRATIONS[onboardingStep]
    if (text) playQuestion(text)
    return () => stopAudio()
  }, [onboardingStep, showOnboarding]) // eslint-disable-line react-hooks-exhaustive-deps

  // ── Speech recognition ──
  const startRecording = useCallback(async () => {
    stopAudio() // Stop audio if playing
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition
    if (!SpeechRecognition) return
    // Get mic stream for real analyser
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true })
      recordingStreamRef.current = stream
      const audioCtx = new (window.AudioContext || window.webkitAudioContext)()
      const source = audioCtx.createMediaStreamSource(stream)
      const analyserNode = audioCtx.createAnalyser()
      analyserNode.fftSize = 256
      source.connect(analyserNode)
      setRecordingAnalyser(analyserNode)
    } catch { /* mic already granted via speech recognition */ }
    const recognition = new SpeechRecognition()
    recognition.lang = 'es-MX'
    recognition.continuous = true
    recognition.interimResults = true
    let finalText = transcript || ''
    recognition.onresult = (e) => {
      let interim = ''
      for (let i = e.resultIndex; i < e.results.length; i++) {
        if (e.results[i].isFinal) finalText += e.results[i][0].transcript + ' '
        else interim += e.results[i][0].transcript
      }
      setTranscript(finalText + interim)
    }
    recognition.onerror = () => { setRecording(false) }
    recognition.onend = () => { setRecording(false) }
    recognitionRef.current = recognition
    recognition.start()
    setRecording(true)
  }, [transcript, stopAudio])

  const stopRecording = useCallback(() => {
    if (recognitionRef.current) recognitionRef.current.stop()
    if (recordingStreamRef.current) {
      recordingStreamRef.current.getTracks().forEach(t => t.stop())
      recordingStreamRef.current = null
    }
    setRecordingAnalyser(null)
    setRecording(false)
  }, [])

  // ── Save response and navigate ──
  const currentText = typingMode ? textInput : transcript

  const saveAndNext = useCallback(() => {
    const finalText = typingMode ? textInput.trim() : transcript.trim()
    if (finalText) {
      setResponses(prev => ({ ...prev, [question.id]: finalText }))
    }
    stopRecording()
    setTranscript('')
    setTextInput('')
    setTypingMode(false)
    if (currentQ < totalQ - 1) {
      setCurrentQ(prev => prev + 1)
    } else {
      const finalResponses = { ...responses }
      if (finalText) finalResponses[question.id] = finalText
      handleRunAnalysis(finalResponses)
    }
  }, [textInput, transcript, typingMode, currentQ, totalQ, question, responses, stopRecording])

  const goBack = useCallback(() => {
    if (currentQ > 0) {
      const finalText = typingMode ? textInput.trim() : transcript.trim()
      if (finalText) {
        setResponses(prev => ({ ...prev, [question.id]: finalText }))
      }
      stopRecording()
      setCurrentQ(prev => prev - 1)
      const prevQ = PREGUNTAS[currentQ - 1]
      const prevVal = responses[prevQ.id] || ''
      setTranscript(prevVal)
      setTextInput(prevVal)
      setTypingMode(false)
    }
  }, [currentQ, textInput, transcript, typingMode, question, responses, stopRecording])

  // ── When entering a question, load saved transcript ──
  useEffect(() => {
    if (stage === 'questionnaire') {
      const saved = responses[question?.id] || ''
      setTranscript(saved)
      setTextInput(saved)
      setTypingMode(false)
    }
  }, [currentQ, stage]) // eslint-disable-line react-hooks/exhaustive-deps

  // ── Validation: can start questionnaire from profile? ──
  const needsPartnerData = packageType !== 'descubre'
  const prefilledFromPurchase = sessionStorage.getItem('radiografia_prefilled') === 'true'
  const canStartQuestionnaire = profileData.nombre.trim() && profileData.edad.trim() &&
    (!needsPartnerData || (profileData.nombrePareja.trim() && profileData.edadPareja.trim())) &&
    (emailData.emailUsuario.trim() || prefilledFromPurchase)

  // ── Start questionnaire from merged profile screen ──
  const startQuestionnaire = useCallback(() => {
    stopAudio()
    setStage('questionnaire')
  }, [stopAudio])

  // ── Fill demo responses for testing (all Q1-Q40, Carlos/Ana profile, jump to Q40) ──
  const fillDemoResponses = useCallback(() => {
    setResponses({ ...DEMO_RESPONSES })
    setProfileData({ nombre: 'Carlos', edad: '32', nombrePareja: 'Ana', edadPareja: '30' })
    setEmailData(prev => ({ ...prev, emailUsuario: 'demo@test.com' }))
    setCurrentQ(PREGUNTAS.length - 1) // jump to Q40
    const lastQ = PREGUNTAS[PREGUNTAS.length - 1]
    setTranscript(DEMO_RESPONSES[lastQ.id] || '')
    setTextInput(DEMO_RESPONSES[lastQ.id] || '')
  }, [])

  // ── Run AI Analysis ──
  const handleRunAnalysis = useCallback(async (finalResponses) => {
    // If we have a cached analysis (DEV mode), use it directly
    if (cachedAnalysis) {
      setAiAnalysis(cachedAnalysis)
      setStage('results')
      return
    }

    setStage('analyzing')
    setCompletedTasks(0)
    setAnalysisDone(false)

    // Start animation — 40 tasks × 4.5s ≈ 3 min, paced for parallel API
    let taskIdx = 0
    const animInterval = setInterval(() => {
      taskIdx++
      setCompletedTasks(taskIdx)
      if (taskIdx >= ANALYSIS_TASKS.length) clearInterval(animInterval)
    }, 4500)

    try {
      const result = await analyzeRadiografiaPremium({ responses: finalResponses, questions: PREGUNTAS, profileData, packageType })
      setAiAnalysis(result)
      setCachedAnalysis(result) // Cache for DEV reuse
      setAnalysisDone(true)
      const storageKey = purchaseToken ? `radiografia_premium_progress_${purchaseToken}` : 'radiografia_premium_progress'
      localStorage.removeItem(storageKey)
      // Save to localStorage for later DEV access
      try { localStorage.setItem('radiografia_cached_analysis', JSON.stringify(result)) } catch {}

      // Save results to KV + send "analysis ready" email (fire-and-forget, never blocks UI)
      if (!import.meta.env.DEV) {
        const urlParams = new URLSearchParams(window.location.search)
        const purchaseToken = urlParams.get('token')
        if (purchaseToken) {
          const type    = urlParams.get('type') || packageType
          const buyer   = sessionStorage.getItem('radiografia_buyer_email')   || ''
          const partner = sessionStorage.getItem('radiografia_partner_email') || ''
          const emails  = [buyer, partner].filter(e => e.includes('@'))
          saveAnalysis({ token: purchaseToken, analysis: result }).catch(() => {})
          sendBackupEmail({
            token: purchaseToken, type, profileData,
            questions: PREGUNTAS.map(q => ({ id: q.id, mainQuestion: q.mainQuestion })),
            responses: finalResponses
          }).catch(() => {})
          if (emails.length > 0) {
            sendAnalysisEmail({ token: purchaseToken, type, emails }).catch(() => {})
          }

          // Cross-analysis flow for "losdos" — fire-and-forget
          if (type === 'losdos') {
            ;(async () => {
              try {
                await markPartnerDone(purchaseToken)
                const crossStatus = await checkCrossStatus(purchaseToken)
                if (crossStatus?.bothDone && crossStatus.otherAnalysis) {
                  console.log('🔄 Ambos terminaron — generando análisis cruzado...')
                  const crossResult = await analyzeCrossRadiografia({
                    analysis1: result,
                    analysis2: crossStatus.otherAnalysis,
                    profile1: profileData,
                    profile2: { nombre: profileData.nombrePareja || 'Pareja' },
                  })
                  if (crossResult && crossStatus.pairId) {
                    await saveCrossAnalysis({ token: purchaseToken, pairId: crossStatus.pairId, analysis: crossResult })
                    setCrossAnalysis(crossResult)
                    await sendCrossAnalysisEmail({ pairId: crossStatus.pairId, token: purchaseToken })
                    console.log('✅ Análisis cruzado guardado y email enviado')
                  }
                } else {
                  console.log('⏳ Esperando a que la otra persona termine su cuestionario')
                }
              } catch (e) {
                console.error('Cross-analysis error (non-blocking):', e)
              }
            })()
          }
        }
      }
    } catch (err) {
      console.error('Analysis failed:', err)
      setAnalysisDone(true)
    }
  }, [])

  // ── When both analysis and animation done → show results ──
  useEffect(() => {
    if (analysisDone && completedTasks >= ANALYSIS_TASKS.length && aiAnalysis) {
      const timer = setTimeout(() => setStage('results'), 800)
      return () => clearTimeout(timer)
    }
  }, [analysisDone, completedTasks, aiAnalysis])

  // ── Scroll to top on stage change ──
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }, [stage])

  // ── Download — self-contained HTML clone (exact visual replica) ──
  const generatePDF = useCallback(async () => {
    if (!aiAnalysis || !resultsRef.current) return
    setPdfGenerating(true)
    try {
      const element = resultsRef.current

      // Helper: blob → data URI
      const blobToDataUri = blob => new Promise(resolve => {
        const r = new FileReader()
        r.onload = () => resolve(r.result)
        r.readAsDataURL(blob)
      })

      // Helper: embed external URLs inside CSS as data URIs (fonts, etc.)
      const embedCssUrls = async (css) => {
        const urlRe = /url\(["']?(https?:\/\/[^"')]+)["']?\)/g
        const matches = [...css.matchAll(urlRe)]
        const cache = new Map()
        for (const m of matches) {
          if (cache.has(m[1])) continue
          try {
            const res = await fetch(m[1])
            cache.set(m[1], await blobToDataUri(await res.blob()))
          } catch { cache.set(m[1], null) }
        }
        let result = css
        for (const [url, dataUri] of cache) {
          if (dataUri) result = result.replaceAll(url, dataUri)
        }
        return result
      }

      // 1. Collect ALL CSS — for cross-origin sheets (Google Fonts) embed font files
      const cssChunks = []
      for (const sheet of document.styleSheets) {
        try {
          cssChunks.push([...sheet.cssRules].map(r => r.cssText).join('\n'))
        } catch {
          if (sheet.href) {
            try {
              const raw = await (await fetch(sheet.href)).text()
              cssChunks.push(await embedCssUrls(raw))
            } catch {}
          }
        }
      }

      // 2. Clone the results DOM tree
      const clone = element.cloneNode(true)

      // 3. Remove interactive elements + download/email banners (not relevant offline)
      clone.querySelectorAll('button').forEach(b => b.remove())

      // 4. Fix framer-motion invisible sections: whileInView elements cloned with opacity:0
      clone.querySelectorAll('[style]').forEach(el => {
        el.style.removeProperty('opacity')
        el.style.removeProperty('transform')
      })

      // 5. Convert external <img> to inline data URIs (for offline viewing)
      const imgs = clone.querySelectorAll('img[src]')
      await Promise.all([...imgs].map(async img => {
        const src = img.getAttribute('src')
        if (!src || src.startsWith('data:')) return
        try {
          const absUrl = src.startsWith('http') ? src : new URL(src, window.location.origin).href
          img.setAttribute('src', await blobToDataUri(await (await fetch(absUrl, { mode: 'cors' })).blob()))
        } catch {}
      }))

      const nombre = profileData.nombre || 'Reporte'
      const pareja = profileData.nombrePareja || ''
      const titulo = pareja
        ? `Radiografía de Pareja — ${nombre} & ${pareja}`
        : `Radiografía de Pareja — ${nombre}`

      // Use the same Tailwind classes as the live page for pixel-perfect layout
      const htmlContent = `<!DOCTYPE html>
<html lang="es">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>${titulo}</title>
<style>
${cssChunks.join('\n')}
@media print { html, body { background: #09090b !important; -webkit-print-color-adjust: exact; print-color-adjust: exact; } }
</style>
</head>
<body class="min-h-screen bg-zinc-950">
<div class="min-h-screen pt-6 lg:pt-10 pb-20 px-6">
${clone.outerHTML}
</div>
</body>
</html>`

      const blob = new Blob([htmlContent], { type: 'text/html;charset=utf-8' })
      const url = URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = `radiografia-${nombre.toLowerCase().replace(/\s+/g, '-')}.html`
      document.body.appendChild(a)
      a.click()
      document.body.removeChild(a)
      URL.revokeObjectURL(url)
    } catch (err) {
      console.error('HTML generation error:', err)
    } finally { setPdfGenerating(false) }
  }, [aiAnalysis, profileData.nombre, profileData.nombrePareja])

  return (
    <div className="min-h-screen bg-zinc-950">
      <SEOHead title="Radiografía de Pareja Premium — Luis Virrueta" description="Análisis narrativo profundo de tu relación: 40 preguntas · 12 dimensiones psicológicas" />

      <AnimatePresence mode="wait">

        {/* ═══════════════════════════════════════════════════════
            STAGE: INSTRUCTIONS — Pantalla 1: Configuración (voz + comprobaciones)
        ═══════════════════════════════════════════════════════ */}
        {stage === 'instructions' && (
          <motion.div key="instructions" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="min-h-screen flex items-center justify-center px-6 pt-6 pb-12">
            <div className="max-w-xl w-full text-center space-y-8">

              {/* ── Header + tagline ── */}
              <div>
                <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-violet-500/15 to-fuchsia-500/10 border border-violet-500/20 flex items-center justify-center mx-auto mb-4">
                  <Brain className="w-8 h-8 text-violet-400/60" strokeWidth={1.5} />
                </div>
                <h1 className="text-2xl lg:text-3xl font-light text-white mb-2">Radiografía de Pareja Premium</h1>
                <p className="text-transparent bg-clip-text bg-gradient-to-r from-violet-400 to-fuchsia-400 text-sm font-medium tracking-wide mb-4">Descubre tu forma de amar</p>
                <p className="text-white/50 text-sm font-light leading-relaxed max-w-md mx-auto">
                  Un análisis narrativo profundo de tu relación a través de <strong className="text-white/70">40 preguntas abiertas</strong> que exploran tu vínculo desde <strong className="text-white/70">12 dimensiones psicológicas</strong>.
                </p>
              </div>

              {/* ── Step indicator ── */}
              <div className="flex items-center justify-center gap-3">
                <div className="flex items-center gap-2 px-4 py-2 rounded-full bg-violet-500/15 border border-violet-500/25">
                  <div className="w-5 h-5 rounded-full bg-violet-500 flex items-center justify-center text-white text-[10px] font-bold">1</div>
                  <span className="text-violet-300/80 text-xs font-medium">Configuración</span>
                </div>
                <div className="w-6 h-px bg-white/15" />
                <div className="flex items-center gap-2 px-4 py-2 rounded-full border border-white/8 bg-white/[0.02]">
                  <div className="w-5 h-5 rounded-full bg-white/10 flex items-center justify-center text-white/60 text-[10px] font-bold">2</div>
                  <span className="text-white/55 text-xs font-medium">Instrucciones</span>
                </div>
              </div>

              {/* ── Voice selector: 4 circular cards + no-voice option, single toggle ── */}
              <div className="space-y-4">
                <div className="text-center">
                  <p className="text-white/70 text-base font-light flex items-center justify-center gap-2 mb-1">
                    <Headphones className="w-4 h-4 text-violet-400/50" /> Elige la voz que te guiará
                  </p>
                  <p className="text-white/45 text-sm font-light">Toca una voz para seleccionarla y escuchar una prueba</p>
                </div>
                <div className="grid grid-cols-2 gap-3 max-w-sm mx-auto">
                  {VOICE_LIST.map(v => {
                    const isSelected = selectedVoiceId === v.id
                    const isPreviewing = previewingVoiceId === v.id && audioPlaying
                    return (
                      <button key={v.id}
                        onClick={() => {
                          stopAudio()
                          setSelectedVoiceId(v.id)
                          if (!isSelected || !audioPlaying) {
                            playQuestion(`Hola, soy ${v.name} y te acompañaré durante toda tu radiografía. Escucharás cada pregunta en mi voz.`, v.id)
                          }
                        }}
                        className={`relative flex flex-col items-center gap-2 py-4 px-3 rounded-2xl border transition-all duration-300 ${isSelected
                          ? `${v.border} ${v.bg} shadow-lg`
                          : 'border-white/8 bg-white/[0.02] hover:border-white/15 hover:bg-white/[0.04]'}`}>
                        <div className={`relative w-14 h-14 rounded-full bg-gradient-to-br ${v.color} flex items-center justify-center text-white font-semibold text-lg shadow-lg ${isPreviewing ? `ring-4 ${v.ring} animate-pulse` : ''}`}>
                          {v.initial}
                          {isSelected && (
                            <div className="absolute -bottom-0.5 -right-0.5 w-5 h-5 rounded-full bg-zinc-900 border-2 border-green-500 flex items-center justify-center">
                              <Check className="w-3 h-3 text-green-400" />
                            </div>
                          )}
                        </div>
                        <div className="text-center">
                          <span className={`text-sm font-medium block ${isSelected ? v.text : 'text-white/60'}`}>{v.name}</span>
                          <span className="text-xs text-white/50 font-light">{v.desc}</span>
                        </div>
                        {isPreviewing && (
                          <div className="absolute top-2 right-2">
                            <Volume2 className={`w-3.5 h-3.5 ${v.text} animate-pulse`} />
                          </div>
                        )}
                      </button>
                    )
                  })}
                </div>
                {/* Opción sin voz */}
                <div className="flex justify-center">
                  <button
                    onClick={() => { stopAudio(); setSelectedVoiceId(null) }}
                    className={`flex items-center gap-2 px-5 py-2.5 rounded-xl border transition-all text-sm font-light ${
                      selectedVoiceId === null
                        ? 'border-white/25 bg-white/[0.08] text-white/70'
                        : 'border-white/8 bg-white/[0.02] text-white/60 hover:border-white/15 hover:text-white/55'}`}>
                    <VolumeX className="w-4 h-4" />
                    {selectedVoiceId === null ? '✓ Sin voz guía' : 'Prefiero no tener voz guía'}
                  </button>
                </div>
              </div>

              {/* ── Comprobación de Audio y Micrófono ── */}
              <div className="space-y-4 p-6 rounded-2xl border border-violet-500/10 bg-gradient-to-br from-violet-500/[0.04] to-transparent">
                <p className="text-violet-300/80 text-base font-medium flex items-center justify-center gap-2">
                  <Headphones className="w-5 h-5 text-violet-400/50" /> Comprobación de audio y micrófono
                </p>
                <p className="text-white/60 text-sm font-light text-center">Asegúrate de que todo funciona antes de iniciar el test.</p>
                <div className="h-px bg-white/5" />

                <div className="flex flex-wrap gap-3 justify-center">
                  {/* Sound test */}
                  <button
                    onClick={() => {
                      playQuestion('¿Me escuchas bien? Si puedes oírme con claridad, estamos listos para comenzar.', undefined, () => setSoundTestOk(true), 'sound-test')
                    }}
                    className={`flex items-center gap-2 px-4 py-2.5 rounded-xl border transition-all text-xs font-light ${
                      soundTestOk === true ? 'border-emerald-500/30 bg-emerald-500/10 text-emerald-300' :
                      soundTestOk === false ? 'border-red-500/30 bg-red-500/10 text-red-300' :
                      'border-white/15 bg-white/[0.03] text-white/50 hover:border-white/25 hover:text-white/70'}`}>
                    <Volume2 className="w-4 h-4" />
                    {soundTestOk === true ? '✓ Se escucha bien' : soundTestOk === false ? 'No se escuchó' : 'Probar sonido'}
                  </button>
                  {/* Mic test */}
                  <button
                    onClick={async () => {
                      try {
                        const stream = await navigator.mediaDevices.getUserMedia({ audio: true })
                        setMicTestOk(true)
                        const ctx = new (window.AudioContext || window.webkitAudioContext)()
                        const src = ctx.createMediaStreamSource(stream)
                        const analyser = ctx.createAnalyser()
                        analyser.fftSize = 256
                        src.connect(analyser)
                        setMicAnalyser(analyser)
                        setTimeout(() => {
                          stream.getTracks().forEach(t => t.stop())
                          ctx.close()
                          setMicAnalyser(null)
                        }, 3000)
                      } catch { setMicTestOk(false) }
                    }}
                    className={`flex items-center gap-2 px-4 py-2.5 rounded-xl border transition-all text-xs font-light ${
                      micTestOk === true ? 'border-emerald-500/30 bg-emerald-500/10 text-emerald-300' :
                      micTestOk === false ? 'border-red-500/30 bg-red-500/10 text-red-300' :
                      'border-white/15 bg-white/[0.03] text-white/50 hover:border-white/25 hover:text-white/70'}`}>
                    <Mic className="w-4 h-4" />
                    {micTestOk === true ? '✓ Micrófono listo' : micTestOk === false ? 'Sin acceso al mic' : 'Probar micrófono'}
                  </button>
                </div>
                {micAnalyser && <MicLevelBars analyser={micAnalyser} />}
              </div>

              <motion.button
                onClick={() => setStage('how-it-works')}
                whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}
                className="w-full py-4 rounded-xl bg-gradient-to-r from-violet-600 to-fuchsia-600 text-white font-light text-base hover:from-violet-500 hover:to-fuchsia-500 transition-all shadow-lg shadow-violet-600/20">
                Siguiente: Instrucciones <ArrowRight className="inline w-4 h-4 ml-2" />
              </motion.button>
            </div>
          </motion.div>
        )}

        {/* ═══════════════════════════════════════════════════════
            STAGE: HOW-IT-WORKS — Pantalla 2: Instrucciones premium
        ═══════════════════════════════════════════════════════ */}
        {stage === 'how-it-works' && (
          <motion.div key="how-it-works" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="min-h-screen flex items-center justify-center px-6 pt-6 pb-12">
            <div className="max-w-xl w-full text-center space-y-8">

              {/* ── Step indicator ── */}
              <div className="flex items-center justify-center gap-3">
                <div className="flex items-center gap-2 px-4 py-2 rounded-full border border-white/8 bg-white/[0.02]">
                  <div className="w-5 h-5 rounded-full bg-emerald-500/60 flex items-center justify-center">
                    <Check className="w-3 h-3 text-white" />
                  </div>
                  <span className="text-white/60 text-xs font-medium">Configuración</span>
                </div>
                <div className="w-6 h-px bg-white/15" />
                <div className="flex items-center gap-2 px-4 py-2 rounded-full bg-violet-500/15 border border-violet-500/25">
                  <div className="w-5 h-5 rounded-full bg-violet-500 flex items-center justify-center text-white text-[10px] font-bold">2</div>
                  <span className="text-violet-300/80 text-xs font-medium">Instrucciones</span>
                </div>
              </div>

              {/* ── Header centrado y premium ── */}
              <div>
                <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-violet-500/15 to-fuchsia-500/10 border border-violet-500/20 flex items-center justify-center mx-auto mb-4">
                  <Headphones className="w-7 h-7 text-violet-400/60" strokeWidth={1.5} />
                </div>
                <h2 className="text-2xl lg:text-3xl font-light text-white mb-2">Prepara tu espacio</h2>
                <p className="text-white/55 text-sm font-light max-w-md mx-auto">Lee con calma cómo funciona antes de empezar.</p>
              </div>

              {/* ── Condiciones ideales ── */}
              <div className="p-5 rounded-2xl border border-violet-500/10 bg-gradient-to-br from-violet-500/[0.04] to-transparent">
                <div className="flex flex-wrap gap-4 justify-center text-white/60 text-sm font-light">
                  <span className="flex items-center gap-2">🎧 Usa audífonos</span>
                  <span className="flex items-center gap-2">🔇 Busca un lugar tranquilo</span>
                  <span className="flex items-center gap-2">⏱️ 20–25 minutos</span>
                </div>
              </div>

              {/* ── Instrucciones numeradas ── */}
              <div className="space-y-4">
                <p className="text-white/70 text-base font-medium text-center mb-2">Así funciona cada pregunta</p>

                {/* Paso 1 */}
                <div className="flex items-start gap-4">
                  <div className="w-8 h-8 rounded-full bg-violet-500/15 border border-violet-500/25 flex items-center justify-center flex-shrink-0 mt-0.5">
                    <span className="text-violet-300 text-sm font-bold">1</span>
                  </div>
                  <div>
                    <p className="text-white/80 text-sm font-medium mb-1">Se te leerá la pregunta en voz alta</p>
                    <p className="text-white/45 text-sm font-light">Puedes <strong className="text-white/60">saltar</strong> el audio o <strong className="text-white/60">repetirlo</strong> con los botones que verás junto a la pregunta.</p>
                  </div>
                </div>

                {/* Paso 2 */}
                <div className="flex items-start gap-4">
                  <div className="w-8 h-8 rounded-full bg-violet-500/15 border border-violet-500/25 flex items-center justify-center flex-shrink-0 mt-0.5">
                    <span className="text-violet-300 text-sm font-bold">2</span>
                  </div>
                  <div>
                    <p className="text-white/80 text-sm font-medium mb-1">Se activará el micrófono automáticamente</p>
                    <p className="text-white/45 text-sm font-light">Solo habla con naturalidad. Si prefieres escribir, toca "Prefiero escribir mi respuesta".</p>
                  </div>
                </div>

                {/* Paso 3 */}
                <div className="flex items-start gap-4">
                  <div className="w-8 h-8 rounded-full bg-emerald-500/15 border border-emerald-500/25 flex items-center justify-center flex-shrink-0 mt-0.5">
                    <span className="text-emerald-300 text-sm font-bold">3</span>
                  </div>
                  <div>
                    <p className="text-white/80 text-sm font-medium mb-1">Di lo primero que te venga a la mente</p>
                    <p className="text-white/45 text-sm font-light">Lee primero la <strong className="text-emerald-300/70">pregunta verde</strong> — es la pregunta principal. Responde con lo que sientas, sin pensarlo demasiado.</p>
                  </div>
                </div>

                {/* Paso 4 */}
                <div className="flex items-start gap-4">
                  <div className="w-8 h-8 rounded-full bg-fuchsia-500/15 border border-fuchsia-500/25 flex items-center justify-center flex-shrink-0 mt-0.5">
                    <span className="text-fuchsia-300 text-sm font-bold">4</span>
                  </div>
                  <div>
                    <p className="text-white/80 text-sm font-medium mb-1">Lee las preguntas violeta para completar</p>
                    <p className="text-white/45 text-sm font-light">Debajo de la pregunta verde verás <strong className="text-violet-300/70">ideas en violeta</strong> que te ayudan a profundizar tu respuesta. Son opcionales.</p>
                  </div>
                </div>

                {/* Paso 5 */}
                <div className="flex items-start gap-4">
                  <div className="w-8 h-8 rounded-full bg-amber-500/15 border border-amber-500/25 flex items-center justify-center flex-shrink-0 mt-0.5">
                    <span className="text-amber-300 text-sm font-bold">5</span>
                  </div>
                  <div>
                    <p className="text-white/80 text-sm font-medium mb-1">Puedes regrabar cualquier respuesta</p>
                    <p className="text-white/45 text-sm font-light">Si no quedaste conforme, simplemente toca <strong className="text-white/60">Regrabar</strong>. También puedes editar el texto transcrito antes de avanzar.</p>
                  </div>
                </div>

                {/* Paso 6 */}
                <div className="flex items-start gap-4">
                  <div className="w-8 h-8 rounded-full bg-teal-500/15 border border-teal-500/25 flex items-center justify-center flex-shrink-0 mt-0.5">
                    <span className="text-teal-300 text-sm font-bold">6</span>
                  </div>
                  <div>
                    <p className="text-white/80 text-sm font-medium mb-1">Tu progreso se guarda automáticamente</p>
                    <p className="text-white/45 text-sm font-light">Si cierras la ventana o pierdes conexión, al volver encontrarás todo donde lo dejaste.</p>
                  </div>
                </div>
              </div>

              {/* ── Mensaje de confianza ── */}
              <div className="p-4 rounded-xl bg-gradient-to-r from-emerald-500/[0.06] to-teal-500/[0.04] border border-emerald-500/15 text-center">
                <p className="text-emerald-300/80 text-sm font-light">
                  💬 Puedes hablar como si fuera tu mejor amigo, sin filtros. Lo que digas es solo para ti.
                </p>
              </div>

              {/* ── Navigation ── */}
              <div className="space-y-3">
                <motion.button
                  onClick={() => startQuestionnaire()}
                  whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}
                  className="w-full py-4 rounded-xl bg-gradient-to-r from-violet-600 to-fuchsia-600 text-white font-light text-base hover:from-violet-500 hover:to-fuchsia-500 transition-all shadow-lg shadow-violet-600/20">
                  Comenzar radiografía <ArrowRight className="inline w-4 h-4 ml-2" />
                </motion.button>
                <button onClick={() => setStage('instructions')}
                  className="w-full py-3 text-center text-white/60 text-sm font-light hover:text-white/55 transition-colors">
                  <ArrowLeft className="inline w-3.5 h-3.5 mr-1" /> Volver a configuración
                </button>
              </div>
            </div>
          </motion.div>
        )}

        {/* Profile stage removed — data collected in purchase screen */}

        {/* ═══════════════════════════════════════════════════════
            STAGE: QUESTIONNAIRE
        ═══════════════════════════════════════════════════════ */}
        {stage === 'questionnaire' && question && (
          <motion.div key="questionnaire" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="min-h-screen pt-6 lg:pt-10 pb-20 px-6">
            <div className="max-w-2xl mx-auto">

              {/* Progress bar */}
              <div className="mb-8">
                <div className="text-center mb-2">
                  <span className="text-violet-300/70 text-xs font-medium uppercase tracking-wider block">{question.block}</span>
                  <span className="text-white/60 text-xs font-light">{currentQ + 1} de {totalQ}</span>
                </div>
                <div className="h-1.5 bg-white/10 rounded-full overflow-hidden">
                  <motion.div animate={{ width: `${progress}%` }} transition={{ duration: 0.4 }}
                    className="h-full bg-gradient-to-r from-violet-500 to-fuchsia-500 rounded-full" />
                </div>
              </div>

              {/* Main question — centered */}
              <div className="text-center mb-6">
                <div className="flex items-center justify-center gap-2 mb-3">
                  <span className="text-white/50 text-xs font-light">Pregunta {currentQ + 1}</span>
                  <button
                    onClick={() => {
                      if (recording) stopRecording()
                      playQuestion(questionText, undefined, () => {
                        const sr = window.SpeechRecognition || window.webkitSpeechRecognition
                        if (sr && !typingMode) startRecording()
                      })
                    }}
                    className="h-7 px-3 rounded-lg border border-white/15 bg-white/[0.04] text-white/50 hover:text-white/70 hover:border-white/25 transition-all text-[10px] font-light inline-flex items-center gap-1.5"
                    title="Repetir audio">
                    <Volume2 className="w-3 h-3" /> Repetir
                  </button>
                  {audioPlaying && (
                    <button
                      onClick={() => {
                        stopAudio()
                        // Auto-start mic on "Saltar"
                        setTimeout(() => {
                          const sr = window.SpeechRecognition || window.webkitSpeechRecognition
                          if (sr && !typingMode) startRecording()
                        }, 300)
                      }}
                      className="h-7 px-3 rounded-lg border border-amber-500/20 bg-amber-500/[0.06] text-amber-300/70 hover:text-amber-300 transition-all text-[10px] font-light inline-flex items-center gap-1.5"
                      title="Saltar audio">
                      <SkipForward className="w-3 h-3" /> Saltar
                    </button>
                  )}
                </div>

              </div>

              {/* ── Card verde: Responde libremente + pregunta principal ── */}
              <div id="spotlight-question" className="mb-6">
                <div className="px-4 py-2.5 rounded-t-2xl bg-gradient-to-r from-emerald-500/15 via-teal-500/10 to-emerald-500/15 border border-b-0 border-emerald-500/15">
                  <p className="text-emerald-300/80 text-xs font-semibold uppercase tracking-widest text-center flex items-center justify-center gap-2">
                    <Heart className="w-3.5 h-3.5 text-emerald-400/60" />
                    Responde libremente — di lo primero que te venga a la mente
                  </p>
                </div>
                <div className="px-6 py-6 rounded-b-2xl border border-t-0 border-emerald-500/10 bg-emerald-500/[0.02]">
                  <p className="text-white/90 text-lg lg:text-xl font-light leading-relaxed text-center max-w-xl mx-auto">{questionText}</p>
                </div>
              </div>

              {/* Examples — as completion prompts */}
              <div id="spotlight-examples" className="mb-8">
                <div className="px-4 py-2.5 rounded-t-2xl bg-gradient-to-r from-violet-500/15 via-fuchsia-500/10 to-violet-500/15 border border-b-0 border-violet-500/15">
                  <p className="text-violet-300/80 text-xs font-semibold uppercase tracking-widest text-center flex items-center justify-center gap-2">
                    <Lightbulb className="w-3.5 h-3.5 text-violet-400/60" />
                    Si te faltó algo, completa con estas ideas
                  </p>
                </div>
                <div className="px-5 py-4 rounded-b-2xl border border-t-0 border-white/10 bg-white/[0.02] space-y-2">
                  {questionExamples.map((ex, i) => (
                    <div key={i} className="flex items-center justify-center gap-2 text-white/55 text-sm font-light">
                      <span className="text-violet-400/50">✦</span>
                      <span>{ex}</span>
                    </div>
                  ))}
                  <div className="h-px bg-white/5 mt-3 mb-2" />
                  <p className="text-white/60 text-xs font-light italic flex items-center justify-center gap-1.5">
                    <Sparkles className="w-3 h-3 text-violet-400/30" />
                    Puedes añadir cualquier otro detalle que sientas importante
                  </p>
                </div>
              </div>

              {/* ── Response area ── */}

              {/* While recording: show animated MicLevelBars indicator */}
              {recording && !typingMode && (
                <div className="mb-6 text-center">
                  <div className="inline-flex flex-col items-center gap-3 px-6 py-4 rounded-2xl border border-red-500/20 bg-red-500/[0.04]">
                    <MicLevelBars analyser={recordingAnalyser} />
                    <span className="text-red-300/70 text-sm font-light">Escuchando… habla con libertad</span>
                  </div>
                </div>
              )}

              {/* After stopping: show "Respuesta guardada" badge (user proceeds with Next button) */}
              {!recording && currentText.trim() && !typingMode && (
                <div className="mb-6 text-center">
                  <div className="inline-flex items-center gap-2 px-5 py-3 rounded-xl border border-emerald-500/20 bg-emerald-500/[0.05]">
                    <CheckCircle className="w-4 h-4 text-emerald-400/70" />
                    <span className="text-emerald-300/80 text-sm font-light">Respuesta guardada — toca Siguiente para avanzar</span>
                  </div>
                </div>
              )}

              {/* Typing mode: show previous recording read-only + textarea */}
              {typingMode && !recording && (
                <div className="mb-6 space-y-3">
                  {transcript.trim() && (
                    <div className="p-3 rounded-xl border border-white/8 bg-white/[0.02]">
                      <p className="text-white/55 text-[10px] font-medium uppercase tracking-wider mb-1">Lo que grabaste antes</p>
                      <p className="text-white/60 text-xs font-light leading-relaxed">{transcript}</p>
                    </div>
                  )}
                  <textarea
                    value={textInput}
                    onChange={(e) => setTextInput(e.target.value)}
                    placeholder="Escribe o complementa tu respuesta aquí…"
                    rows={4}
                    className="w-full p-4 rounded-xl border border-white/15 bg-white/[0.03] text-white/80 text-sm font-light placeholder:text-white/55 focus:border-violet-500/30 focus:outline-none resize-none transition-colors leading-relaxed"
                  />
                </div>
              )}

              {/* If no content and not recording and not typing: waiting state */}
              {!currentText.trim() && !recording && !typingMode && (
                <p className="text-center text-white/55 text-sm font-light mb-4 italic">
                  {audioPlaying ? 'Escucha la pregunta…' : 'Tu micrófono se activará en un momento'}
                </p>
              )}

              {/* ── Action buttons: Back | Mic | Next (3 buttons only, matching purple) ── */}
              <div id="spotlight-actions" className="flex items-end justify-center gap-5 lg:gap-6 mb-2">
                {/* Back — purple matching */}
                <motion.button onClick={goBack} disabled={currentQ === 0}
                  whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}
                  className="flex flex-col items-center gap-1.5">
                  <div className={`w-12 h-12 lg:w-13 lg:h-13 rounded-full flex items-center justify-center transition-all border-2 ${currentQ === 0 ? 'opacity-20 pointer-events-none border-white/10 bg-white/[0.02] text-white/50' : 'border-violet-500/30 bg-violet-500/[0.08] text-violet-300/70 hover:border-violet-500/50 hover:bg-violet-500/[0.12] hover:text-violet-300'}`}>
                    <ArrowLeft className="w-5 h-5" />
                  </div>
                  <span className="text-[10px] font-light text-violet-300/40">Anterior</span>
                </motion.button>

                {/* Mic — center, larger */}
                <motion.button
                  onClick={() => { if (typingMode) setTypingMode(false); recording ? stopRecording() : startRecording() }}
                  whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}
                  className="flex flex-col items-center gap-1.5">
                  <div className={`w-16 h-16 lg:w-[4.5rem] lg:h-[4.5rem] rounded-full flex items-center justify-center transition-all ${recording
                    ? 'bg-red-500/20 border-2 border-red-500/50 text-red-400 animate-pulse shadow-lg shadow-red-500/15'
                    : 'bg-gradient-to-br from-violet-500/20 to-fuchsia-500/15 border-2 border-violet-500/40 text-violet-400 shadow-lg shadow-violet-500/25 ring-4 ring-violet-400/10'}`}>
                    {recording ? <MicOff className="w-6 h-6" /> : <Mic className="w-6 h-6" />}
                  </div>
                  <span className={`text-[10px] font-light ${recording ? 'text-red-400/70' : 'text-violet-300/60'}`}>
                    {recording ? 'Grabando…' : 'Micrófono'}
                  </span>
                </motion.button>

                {/* Next — purple matching */}
                <motion.button onClick={saveAndNext}
                  whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}
                  className="flex flex-col items-center gap-1.5">
                  <div className={`w-12 h-12 lg:w-13 lg:h-13 rounded-full flex items-center justify-center transition-all border-2 ${currentText.trim()
                    ? 'bg-gradient-to-br from-violet-600 to-fuchsia-600 border-violet-500/50 text-white shadow-lg shadow-violet-500/25'
                    : 'border-violet-500/20 bg-violet-500/[0.05] text-violet-300/40 hover:border-violet-500/30 hover:text-violet-300/60'}`}>
                    {currentQ < totalQ - 1 ? <ArrowRight className="w-5 h-5" /> : <Check className="w-5 h-5" />}
                  </div>
                  <span className={`text-[10px] font-light ${currentText.trim() ? 'text-violet-300/60' : 'text-violet-300/30'}`}>
                    {currentQ < totalQ - 1 ? 'Siguiente' : 'Finalizar'}
                  </span>
                </motion.button>
              </div>

              {/* ── Small links below buttons: detener/regrabar when recording, prefiero escribir always ── */}
              <div className="text-center space-y-1.5 mb-6">
                {/* Detener & Regrabar links — visible when recording or has content */}
                {(recording || (currentText.trim() && !typingMode)) && (
                  <div className="flex items-center justify-center gap-3">
                    {recording && (
                      <button
                        onClick={stopRecording}
                        className="text-red-300/60 text-xs font-light hover:text-red-300/90 transition-colors underline underline-offset-2 decoration-red-300/20 hover:decoration-red-300/50">
                        Detener grabación
                      </button>
                    )}
                    {(recording || currentText.trim()) && !typingMode && (
                      <>
                        {recording && <span className="text-white/15">·</span>}
                        <button
                          onClick={() => setShowRegrabarModal(true)}
                          className="text-amber-300/50 text-xs font-light hover:text-amber-300/80 transition-colors underline underline-offset-2 decoration-amber-300/15 hover:decoration-amber-300/40">
                          Regrabar desde cero
                        </button>
                      </>
                    )}
                  </div>
                )}

                {/* Prefiero escribir — always visible */}
                {!typingMode ? (
                  <button
                    onClick={() => { if (recording) stopRecording(); setTypingMode(true); setTextInput(transcript || textInput) }}
                    className="text-white/55 text-xs font-light hover:text-white/55 transition-colors underline underline-offset-2 decoration-white/15 hover:decoration-white/30">
                    Prefiero escribir mi respuesta
                  </button>
                ) : (
                  <button
                    onClick={() => setTypingMode(false)}
                    className="text-white/55 text-xs font-light hover:text-white/55 transition-colors underline underline-offset-2 decoration-white/15 hover:decoration-white/30">
                    Volver al micrófono
                  </button>
                )}
              </div>

              {/* ── Regrabar confirmation modal ── */}
              {showRegrabarModal && (
                <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center px-6" onClick={() => setShowRegrabarModal(false)}>
                  <motion.div initial={{ scale: 0.95, opacity: 0 }} animate={{ scale: 1, opacity: 1 }}
                    className="bg-[#1a1a2e] border border-amber-500/20 rounded-2xl p-6 max-w-sm w-full shadow-2xl" onClick={e => e.stopPropagation()}>
                    <h3 className="text-white text-base font-medium mb-2">¿Regrabar esta respuesta?</h3>
                    <p className="text-white/55 text-sm font-light mb-5">Se borrará lo que llevas grabado en esta pregunta y el micrófono se activará de nuevo.</p>
                    <div className="flex gap-3">
                      <button onClick={() => setShowRegrabarModal(false)}
                        className="flex-1 py-2.5 rounded-xl border border-white/10 text-white/60 text-sm font-light hover:bg-white/5 transition-colors">
                        Cancelar
                      </button>
                      <button onClick={() => { setShowRegrabarModal(false); stopAudio(); if (recording) stopRecording(); setTranscript(''); setTextInput(''); setTimeout(() => startRecording(), 200) }}
                        className="flex-1 py-2.5 rounded-xl bg-amber-500/20 border border-amber-500/25 text-amber-300 text-sm font-light hover:bg-amber-500/30 transition-colors">
                        Sí, regrabar
                      </button>
                    </div>
                  </motion.div>
                </div>
              )}

              {/* DEV: Quick actions */}
              {import.meta.env.DEV && (
                <div className="mt-8 pt-6 border-t border-white/5">
                  <p className="text-white/50 text-[9px] font-medium uppercase tracking-wider text-center mb-3">Desarrollador</p>
                  <div className="flex flex-wrap gap-4 justify-center">
                  {/* 1. Landing */}
                  <button onClick={() => navigate('/tienda/diagnostico-relacional')}
                    className="flex flex-col items-center gap-1" title="Ir a Landing">
                    <div className="w-11 h-11 rounded-full border border-cyan-500/25 bg-cyan-500/10 flex items-center justify-center hover:bg-cyan-500/20 transition-colors">
                      <ArrowLeft className="w-4 h-4 text-cyan-300/70" />
                    </div>
                    <span className="text-[9px] text-white/55">Landing</span>
                  </button>
                  {/* 2. Instrucciones */}
                  <button onClick={() => setStage('instructions')}
                    className="flex flex-col items-center gap-1" title="Ir a Instrucciones">
                    <div className="w-11 h-11 rounded-full border border-violet-500/25 bg-violet-500/10 flex items-center justify-center hover:bg-violet-500/20 transition-colors">
                      <Lightbulb className="w-4 h-4 text-violet-300/70" />
                    </div>
                    <span className="text-[9px] text-white/55">Instruc.</span>
                  </button>
                  {/* 3. Rellenar TODO (Q1-Q40 + perfil Carlos/Ana → saltar a Q40) */}
                  <button onClick={() => {
                    fillDemoResponses()
                    if (stage !== 'questionnaire') setStage('questionnaire')
                  }}
                    className="flex flex-col items-center gap-1" title="Rellenar las 40 respuestas con Carlos/Ana y saltar a Q40">
                    <div className="w-11 h-11 rounded-full border border-amber-500/25 bg-amber-500/10 flex items-center justify-center hover:bg-amber-500/20 transition-colors">
                      <PenLine className="w-4 h-4 text-amber-300/70" />
                    </div>
                    <span className="text-[9px] text-white/55">Rellenar</span>
                  </button>
                  {/* 4. Test IA completo — fill + profile + call real API */}
                  <button onClick={() => {
                    const demoProfile = { nombre: 'Carlos', edad: '32', nombrePareja: 'Ana', edadPareja: '30' }
                    setProfileData(demoProfile)
                    setEmailData(prev => ({ ...prev, emailUsuario: 'demo@test.com' }))
                    setResponses({ ...DEMO_RESPONSES })
                    setCachedAnalysis(null) // force real API call
                    localStorage.removeItem('radiografia_cached_analysis')
                    setStage('analyzing')
                    setTimeout(() => handleRunAnalysis(DEMO_RESPONSES), 300)
                  }}
                    className="flex flex-col items-center gap-1" title="Rellenar todo y lanzar IA real">
                    <div className="w-11 h-11 rounded-full border border-emerald-500/25 bg-emerald-500/10 flex items-center justify-center hover:bg-emerald-500/20 transition-colors">
                      <Sparkles className="w-4 h-4 text-emerald-300/70" />
                    </div>
                    <span className="text-[9px] text-white/55">Test IA</span>
                  </button>
                  {/* 5. Preview (cached) */}
                  <button onClick={() => {
                    if (CACHED_PREVIEW_ANALYSIS) {
                      setAiAnalysis(CACHED_PREVIEW_ANALYSIS)
                      setCachedAnalysis(CACHED_PREVIEW_ANALYSIS)
                      setStage('results')
                      return
                    }
                    const saved = localStorage.getItem('radiografia_cached_analysis')
                    if (saved) {
                      try {
                        const parsed = JSON.parse(saved)
                        setAiAnalysis(parsed)
                        setCachedAnalysis(parsed)
                        setStage('results')
                        return
                      } catch {}
                    }
                    setResponses({ ...DEMO_RESPONSES })
                    setTimeout(() => handleRunAnalysis(DEMO_RESPONSES), 200)
                  }}
                    className="flex flex-col items-center gap-1" title="Vista previa de resultados">
                    <div className="w-11 h-11 rounded-full border border-fuchsia-500/25 bg-fuchsia-500/10 flex items-center justify-center hover:bg-fuchsia-500/20 transition-colors">
                      <Eye className="w-4 h-4 text-fuchsia-300/70" />
                    </div>
                    <span className="text-[9px] text-white/55">Preview</span>
                  </button>
                  {/* 6. Demo para ventas */}
                  <button onClick={loadSalesDemoAnalysis}
                    className="flex flex-col items-center gap-1" title="Demo para ventas (Sofía y Mateo)">
                    <div className="w-11 h-11 rounded-full border border-pink-500/25 bg-pink-500/10 flex items-center justify-center hover:bg-pink-500/20 transition-colors">
                      <Play className="w-4 h-4 text-pink-300/70" />
                    </div>
                    <span className="text-[9px] text-white/55">Demo</span>
                  </button>
                  {/* 7. Demo Sofía (descubre) — test AI with single person profile */}
                  <button onClick={() => {
                    const sofiaProfile = { nombre: 'Sofía', edad: '28', nombrePareja: '', edadPareja: '' }
                    // Override packageType via URL for this session
                    const url = new URL(window.location)
                    url.searchParams.set('type', 'descubre')
                    window.history.replaceState({}, '', url)
                    setProfileData(sofiaProfile)
                    setEmailData(prev => ({ ...prev, emailUsuario: 'sofia@test.com' }))
                    setResponses({ ...DEMO_RESPONSES_SOFIA })
                    setCachedAnalysis(null)
                    localStorage.removeItem('radiografia_cached_analysis')
                    setStage('analyzing')
                    setTimeout(() => handleRunAnalysis(DEMO_RESPONSES_SOFIA), 300)
                  }}
                    className="flex flex-col items-center gap-1" title="Demo Sofía — descubre (soltera, autoconocimiento)">
                    <div className="w-11 h-11 rounded-full border border-cyan-500/25 bg-cyan-500/10 flex items-center justify-center hover:bg-cyan-500/20 transition-colors">
                      <Compass className="w-4 h-4 text-cyan-300/70" />
                    </div>
                    <span className="text-[9px] text-white/55">Sofía</span>
                  </button>
                  {/* 8. LosDos — preview cross-analysis with demo data */}
                  <button onClick={() => {
                    const url = new URL(window.location)
                    url.searchParams.set('type', 'losdos')
                    window.history.replaceState({}, '', url)
                    setProfileData({ nombre: 'Carlos', edad: '32', nombrePareja: 'Ana', edadPareja: '30' })
                    setEmailData(prev => ({ ...prev, emailUsuario: 'carlos@test.com' }))
                    // Load individual analysis + cross analysis
                    if (CACHED_PREVIEW_ANALYSIS) {
                      setAiAnalysis(CACHED_PREVIEW_ANALYSIS)
                      setCachedAnalysis(CACHED_PREVIEW_ANALYSIS)
                    }
                    setCrossAnalysis(DEMO_CROSS_ANALYSIS)
                    setStage('results')
                  }}
                    className="flex flex-col items-center gap-1" title="Demo LosDos — análisis cruzado Carlos & Ana">
                    <div className="w-11 h-11 rounded-full border border-emerald-500/25 bg-emerald-500/10 flex items-center justify-center hover:bg-emerald-500/20 transition-colors">
                      <Users className="w-4 h-4 text-emerald-300/70" />
                    </div>
                    <span className="text-[9px] text-white/55">LosDos</span>
                  </button>
                  {/* 9. Borrar caché */}
                  {localStorage.getItem('radiografia_cached_analysis') && (
                    <button onClick={() => {
                      localStorage.removeItem('radiografia_cached_analysis')
                      setCachedAnalysis(null)
                      setResponses({ ...DEMO_RESPONSES })
                      setTimeout(() => handleRunAnalysis(DEMO_RESPONSES), 200)
                    }}
                      className="flex flex-col items-center gap-1" title="Borrar caché y relanzar">
                      <div className="w-11 h-11 rounded-full border border-red-500/25 bg-red-500/10 flex items-center justify-center hover:bg-red-500/20 transition-colors">
                        <Repeat className="w-4 h-4 text-red-300/70" />
                      </div>
                      <span className="text-[9px] text-white/55">Caché</span>
                    </button>
                  )}
                </div>
                </div>
              )}

            </div>
          </motion.div>
        )}

        {/* ═══════════════════════════════════════════════════════
            STAGE: ANALYZING
        ═══════════════════════════════════════════════════════ */}
        {stage === 'analyzing' && (
          <motion.div key="analyzing" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="min-h-screen flex items-center justify-center px-6">
            <div className="max-w-md w-full space-y-6">
              <div className="text-center mb-6">
                <Brain className="w-12 h-12 text-violet-400/40 mx-auto mb-4 animate-pulse" />
                <h2 className="text-xl font-light text-white mb-2">Analizando tu narrativa</h2>
                <p className="text-white/60 text-sm font-light">40 respuestas × 12 dimensiones × 11 corrientes psicológicas</p>
              </div>

              {/* Warning banner */}
              <div className="bg-amber-500/[0.07] border border-amber-500/15 rounded-xl px-4 py-3 text-center">
                <p className="text-amber-300/80 text-xs font-light">⏱️ Este proceso toma aproximadamente 3-5 minutos. No cierres ni recargues esta ventana.</p>
              </div>

              <div className="space-y-1.5 max-h-[50vh] overflow-y-auto pr-1 scrollbar-thin">
                {ANALYSIS_TASKS.map((task, i, arr) => {
                  const done = i < completedTasks
                  const active = i === completedTasks
                  const showGroup = i === 0 || arr[i - 1].group !== task.group
                  return (
                    <div key={task.id}>
                      {showGroup && (
                        <p className={`text-[10px] uppercase tracking-widest font-medium mt-3 mb-1.5 px-3 ${done || active ? 'text-violet-400/50' : 'text-white/15'}`}>{task.group}</p>
                      )}
                      <motion.div animate={{ opacity: done || active ? 1 : 0.3 }}
                        className={`flex items-center gap-3 p-2.5 rounded-xl ${done ? 'bg-emerald-500/[0.04] border border-emerald-500/10' : active ? 'bg-violet-500/[0.04] border border-violet-500/15' : 'border border-white/5'}`}>
                        {done ? (
                          <Check className="w-4 h-4 text-emerald-400/70 shrink-0" strokeWidth={2.5} />
                        ) : active ? (
                          <Loader2 className="w-4 h-4 text-violet-400/60 animate-spin shrink-0" />
                        ) : (
                          <div className="w-4 h-4 rounded-full bg-white/10 shrink-0" />
                        )}
                        <span className={`text-sm font-light ${done ? 'text-white/60' : active ? 'text-white/80' : 'text-white/50'}`}>{task.text}</span>
                      </motion.div>
                    </div>
                  )
                })}
              </div>
              <div className="text-center pt-2">
                <p className="text-white/50 text-xs font-light">{completedTasks} de {ANALYSIS_TASKS.length} procesos completados</p>
              </div>
            </div>
          </motion.div>
        )}

        {/* ═══════════════════════════════════════════════════════
            STAGE: RESULTS
        ═══════════════════════════════════════════════════════ */}
        {stage === 'results' && aiAnalysis && (
          <motion.div key="results" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="min-h-screen pt-6 lg:pt-10 pb-20 px-6">
            <div ref={resultsRef} className="max-w-4xl mx-auto space-y-12">

              {/* Header — Ultra Premium with profile data */}
              <div className="relative text-center py-8 mb-4">
                <div className="absolute inset-0 bg-gradient-to-b from-violet-500/[0.06] via-fuchsia-500/[0.03] to-transparent rounded-3xl" />
                <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,rgba(139,92,246,0.08),transparent_70%)]" />
                <div className="relative">
                  <motion.div initial={{ scale: 0.8, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} transition={{ duration: 0.6 }}
                    className="w-16 h-16 mx-auto mb-5 rounded-2xl bg-gradient-to-br from-violet-500/20 to-fuchsia-500/20 border border-violet-500/20 flex items-center justify-center shadow-lg shadow-violet-500/10">
                    <Brain className="w-8 h-8 text-violet-400/70" />
                  </motion.div>
                  <p className="text-transparent bg-clip-text bg-gradient-to-r from-violet-400 via-fuchsia-400 to-violet-400 text-xs font-bold uppercase tracking-[0.3em] mb-3">Reporte</p>
                  <h1 className="text-3xl lg:text-4xl font-light text-white mb-4">Tu Radiografía de Pareja</h1>

                  {/* Profile info — clean text style */}
                  {profileData.nombre && (
                    <div className="flex flex-wrap items-center justify-center gap-x-3 gap-y-1 mb-2">
                      <span className="text-transparent bg-clip-text bg-gradient-to-r from-fuchsia-400 to-violet-400 text-sm font-medium">{profileData.nombre}{profileData.edad ? `, ${profileData.edad} años` : ''}</span>
                      {profileData.nombrePareja && (
                        <>
                          <span className="text-white/55 text-sm">&</span>
                          <span className="text-transparent bg-clip-text bg-gradient-to-r from-pink-400 to-fuchsia-400 text-sm font-medium">{profileData.nombrePareja}{profileData.edadPareja ? `, ${profileData.edadPareja} años` : ''}</span>
                        </>
                      )}
                    </div>
                  )}
                  {profileData.fecha && (
                    <p className="text-white/45 text-xs font-light">{profileData.fecha}</p>
                  )}
                </div>
              </div>

              {/* ═══ BANNER: Email con resultados enviado ═══ */}
              {!import.meta.env.DEV && (
                <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5 }}
                  className="p-4 rounded-xl border border-emerald-500/20 bg-emerald-500/[0.06] mb-2">
                  <p className="text-emerald-300/90 text-sm font-light text-center flex items-center justify-center gap-2">
                    <Mail className="w-4 h-4 text-emerald-400/60" />
                    Tus resultados también llegarán a tu correo — guarda este enlace para acceder cuando quieras.
                    {packageType === 'losdos' && <span className="block text-emerald-200/60 text-xs mt-1">Cuando tu pareja también termine, recibirán ambos el análisis cruzado por email.</span>}
                  </p>
                </motion.div>
              )}

              {/* ═══ BANNER: Advertencia si el análisis es fallback ═══ */}
              {aiAnalysis._isFallback && (
                <div className="p-4 rounded-xl border border-amber-500/30 bg-amber-500/10 mb-6">
                  <p className="text-amber-300/90 text-sm font-medium flex items-center gap-2 mb-1">
                    <AlertTriangle className="w-4 h-4" /> Análisis de demostración
                  </p>
                  <p className="text-amber-200/60 text-xs font-light">
                    {aiAnalysis._error
                      ? `La IA no pudo generar tu análisis personalizado (${aiAnalysis._error}). Se muestra un ejemplo de referencia. Puedes reintentar el análisis.`
                      : 'Este es un análisis de ejemplo. Tu análisis personalizado se generará cuando la IA esté conectada.'}
                  </p>
                </div>
              )}

              {/* ═══ BANNER: Descargar resultados ═══ */}
              <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.7 }}
                className="p-5 rounded-xl border border-violet-500/20 bg-gradient-to-r from-violet-500/[0.06] to-fuchsia-500/[0.04] mb-2">
                <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
                  <div className="text-center sm:text-left">
                    <p className="text-white/80 text-sm font-light mb-1">Te recomendamos descargar tu radiografía</p>
                    <p className="text-white/40 text-xs font-light">Tu acceso a esta página es por tiempo limitado. Descarga tus resultados para conservarlos.</p>
                  </div>
                  <motion.button onClick={generatePDF} disabled={pdfGenerating}
                    whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}
                    className="flex-shrink-0 flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-violet-600/80 to-fuchsia-600/70 text-white text-sm font-light hover:from-violet-600 hover:to-fuchsia-600 transition-all disabled:opacity-40 shadow-lg shadow-violet-500/10">
                    {pdfGenerating ? <Loader2 className="w-4 h-4 animate-spin" /> : <Download className="w-4 h-4" />}
                    Descargar Radiografía
                  </motion.button>
                </div>
              </motion.div>

              {/* ═══ TABS: Individual / Cruzado (only when crossAnalysis available) ═══ */}
              {crossAnalysis && (
                <div className="flex items-center justify-center gap-2 py-2">
                  <button
                    onClick={() => setResultTab('individual')}
                    className={`px-5 py-2.5 rounded-xl text-sm font-light transition-all ${
                      resultTab === 'individual'
                        ? 'bg-gradient-to-r from-violet-600/80 to-fuchsia-600/70 text-white shadow-lg shadow-violet-500/15 border border-violet-500/30'
                        : 'text-white/45 border border-white/10 bg-white/[0.03] hover:bg-white/[0.06] hover:text-white/65'
                    }`}>
                    Tu Radiografía Individual
                  </button>
                  <button
                    onClick={() => setResultTab('cruzado')}
                    className={`px-5 py-2.5 rounded-xl text-sm font-light transition-all ${
                      resultTab === 'cruzado'
                        ? 'bg-gradient-to-r from-emerald-600/80 to-teal-600/70 text-white shadow-lg shadow-emerald-500/15 border border-emerald-500/30'
                        : 'text-white/45 border border-white/10 bg-white/[0.03] hover:bg-white/[0.06] hover:text-white/65'
                    }`}>
                    Radiografía Cruzada
                  </button>
                </div>
              )}

              {/* ═══ SEPARADOR PARTE 1 — PRIMERO, VAMOS CONTIGO ═══ */}
              {resultTab === 'individual' && (<>
              <div className="text-center mb-6">
                <p className="text-violet-400/50 text-xs font-bold uppercase tracking-[0.25em] mb-1">Parte 1</p>
                <p className="text-white/40 text-sm font-light">Primero, vamos contigo</p>
              </div>

              {/* ═══ SECCIÓN 0: AUTOANÁLISIS — TU RADIOGRAFÍA EMOCIONAL ═══ */}
              {aiAnalysis.autoanalisis_usuario && (
                <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
                  className="p-6 lg:p-8 rounded-2xl border border-fuchsia-500/15 bg-gradient-to-br from-fuchsia-500/[0.04] via-violet-500/[0.03] to-transparent relative overflow-hidden">
                  <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-fuchsia-500/40 via-violet-500/30 to-fuchsia-500/40" />
                  <div className="text-center mb-8">
                    <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-gradient-to-br from-fuchsia-500/20 to-violet-500/15 border border-fuchsia-500/25 mb-4">
                      <Heart className="w-7 h-7 text-fuchsia-400/80" />
                    </div>
                    <p className="text-fuchsia-300/60 text-[10px] font-bold uppercase tracking-[0.3em] mb-2">Reporte Psicológico</p>
                    <h2 className="text-2xl lg:text-3xl font-light text-transparent bg-clip-text bg-gradient-to-r from-fuchsia-300 to-violet-300 tracking-wide">Tu radiografía emocional</h2>
                    <p className="text-white/55 text-sm font-light mt-2 max-w-md mx-auto">Un análisis integral de tu personalidad amorosa basado en tus respuestas y 11 perspectivas psicológicas</p>
                  </div>

                  {/* Mind Map Radial + Sankey Diagram — replaces the old vertical list */}
                  {aiAnalysis.autoanalisis_usuario && (() => {
                    const dataAuto = aiAnalysis.autoanalisis_usuario
                    const present = AUTOANALISIS_SECTIONS.filter(s => dataAuto[s.key])
                    if (present.length === 0) return null
                    const dims = aiAnalysis.dimensiones || {}
                    return (
                      <div className="relative mb-10 space-y-10">
                        {/* Mind Map Radial */}
                        <div>
                          <p className="text-center text-white/60 text-sm font-medium uppercase tracking-widest mb-3">Mapa radial de dimensiones</p>
                          <MindMapRadial dimensiones={dims} />
                        </div>

                        {/* Sankey Diagram */}
                        <div>
                          <p className="text-center text-white/60 text-sm font-medium uppercase tracking-widest mb-3">Distribución de energía relacional</p>
                          <p className="text-center text-white/50 text-xs font-light mb-5 max-w-lg mx-auto">Este diagrama muestra cómo se distribuye la energía emocional de tu relación entre tres esferas fundamentales: la emocional, la estructural y la profunda. Cada flujo representa una dimensión analizada y su grosor es proporcional a la puntuación detectada.</p>
                          <DimensionNetworkGraph dimensiones={dims} />
                        </div>
                      </div>
                    )
                  })()}

                  <div className="space-y-8">
                    {/* Tarjetas del reporte personalizado — estilo autor: ícono centrado + gráfica del autor + texto */}
                    {(() => {
                      const REPORT_CARDS = [
                        { key: 'apertura_rapport', icon: MessageCircle, title: 'Tu radiografía inicial', subtitle: 'Inicio', gradient: 'from-indigo-500 via-violet-500 to-purple-500', border: 'border-indigo-500/20', iconBg: 'from-indigo-500/30 to-violet-500/20', accentColor: '#818cf8', chartType: null },
                        { key: 'forma_de_amar', icon: Heart, title: 'Cómo amas y cómo esperas ser amado', subtitle: 'Tu forma de amar', gradient: 'from-rose-500 via-pink-500 to-fuchsia-500', border: 'border-rose-500/20', iconBg: 'from-rose-500/30 to-pink-500/20', accentColor: '#f472b6', chartType: 'polaridades' },
                        { key: 'goce_repeticion', icon: Flame, title: 'El goce que te ata y te repites', subtitle: 'Tu goce', gradient: 'from-red-500 via-orange-500 to-amber-500', border: 'border-red-500/20', iconBg: 'from-red-500/30 to-orange-500/20', accentColor: '#ef4444', chartType: 'goce_jouissance' },
                        { key: 'lo_que_busca_en_el_otro', icon: Eye, title: 'Lo que buscas en el otro', subtitle: 'Proyección inconsciente', gradient: 'from-sky-500 via-blue-500 to-indigo-500', border: 'border-sky-500/20', iconBg: 'from-sky-500/30 to-blue-500/20', accentColor: '#38bdf8', chartType: 'cuadrante_apego' },
                        { key: 'lo_que_reclama_afuera', icon: Compass, title: 'Lo que reclamas afuera y te pertenece adentro', subtitle: 'Espejo emocional', gradient: 'from-amber-500 via-orange-500 to-red-500', border: 'border-amber-500/20', iconBg: 'from-amber-500/30 to-orange-500/20', accentColor: '#fb923c', chartType: 'espejo' },
                        { key: 'fantasma_relacional', icon: Anchor, title: 'Tu fantasma relacional', subtitle: 'Escena inconsciente', gradient: 'from-purple-500 via-fuchsia-500 to-pink-500', border: 'border-purple-500/20', iconBg: 'from-purple-500/30 to-fuchsia-500/20', accentColor: '#c084fc', chartType: 'escena_relacional' },
                        { key: 'yo_ideal', icon: Target, title: 'Quién crees ser vs quién eres cuando amas', subtitle: 'Yo ideal vs yo real', gradient: 'from-teal-500 via-emerald-500 to-green-500', border: 'border-teal-500/20', iconBg: 'from-teal-500/30 to-emerald-500/20', accentColor: '#34d399', chartType: 'identity_gap' },
                        { key: 'mecanismos_defensa', icon: Shield, title: 'Tus mecanismos de defensa', subtitle: 'Protección emocional', gradient: 'from-cyan-500 via-sky-500 to-blue-500', border: 'border-cyan-500/20', iconBg: 'from-cyan-500/30 to-sky-500/20', accentColor: '#22d3ee', chartType: 'defensas' },
                        { key: 'tipo_pareja_que_repite', icon: Repeat, title: 'El tipo de pareja que repites', subtitle: 'Compulsión de repetición', gradient: 'from-orange-500 via-amber-500 to-yellow-500', border: 'border-orange-500/20', iconBg: 'from-orange-500/30 to-amber-500/20', accentColor: '#fbbf24', chartType: 'ciclo_repeticion' },
                        { key: 'nucleo_del_patron', icon: Zap, title: 'El núcleo de tu patrón', subtitle: 'Insight central', gradient: 'from-fuchsia-500 via-purple-500 to-violet-500', border: 'border-fuchsia-500/20', iconBg: 'from-fuchsia-500/30 to-purple-500/20', accentColor: '#e879f9', chartType: 'nucleo_orbital' },
                        { key: 'cierre_transformador', icon: Sparkles, title: 'Tu camino transformador', subtitle: 'Dirección del cambio', gradient: 'from-emerald-500 via-teal-500 to-cyan-500', border: 'border-emerald-500/20', iconBg: 'from-emerald-500/30 to-teal-500/20', accentColor: '#2dd4bf', chartType: 'before_after' },
                      ]

                      // Map chartType to unique chart component from graficas_autoanalisis
                      const renderCardChart = (chartType) => {
                        const g = aiAnalysis.graficas_autoanalisis
                        if (!g) return null
                        switch (chartType) {
                          case 'barras_resumen': return g.barras_resumen ? <DualBarsChart data={g.barras_resumen} /> : null
                          case 'polaridades': return g.polaridades ? <PolarityScaleChart data={g.polaridades} /> : null
                          case 'cuadrante_apego': return g.cuadrante_apego ? <AttachmentQuadrantChart data={g.cuadrante_apego} /> : null
                          case 'espejo': return g.espejo ? <MirrorGraph data={g.espejo} /> : null
                          case 'escena_relacional': return g.escena_relacional ? <RelationalSceneChart data={g.escena_relacional} /> : null
                          case 'identity_gap': return g.identity_gap ? <IdentityGapChart data={g.identity_gap} /> : null
                          case 'defensas': return g.defensas ? <DefenseRadarChart data={g.defensas} /> : null
                          case 'ciclo_repeticion': return g.ciclo_repeticion ? <RepetitionCycleChart data={g.ciclo_repeticion} /> : null
                          case 'nucleo_orbital': return g.nucleo_orbital ? <OrbitalCoreChart data={g.nucleo_orbital} /> : null
                          case 'before_after': return g.before_after ? <BeforeAfterMap data={g.before_after} /> : null
                          case 'goce_jouissance': return g.goce_jouissance ? <JouissanceChart data={g.goce_jouissance} /> : null
                          default: return null
                        }
                      }

                      return REPORT_CARDS.map(({ key, icon: CardIcon, title, subtitle, gradient, border, iconBg, accentColor, chartType }, cardIdx) => {
                        const text = aiAnalysis.autoanalisis_usuario[key]
                        if (!text) return null
                        const chart = renderCardChart(chartType)
                        return (
                          <div key={key} className={`rounded-2xl overflow-hidden border ${border} bg-white/[0.02] backdrop-blur-sm`}>
                            {/* Header — centered author style */}
                            <div className="text-center py-6 px-5 relative">
                              <div className="absolute top-0 left-0 right-0 h-[2px]" style={{ background: `linear-gradient(to right, transparent, ${accentColor}60, transparent)` }} />
                              <div className={`inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-gradient-to-br ${iconBg} border border-white/15 mb-3 shadow-lg`}>
                                <CardIcon className="w-7 h-7 text-white/80" strokeWidth={1.5} />
                              </div>
                              <p className="text-[10px] font-bold uppercase tracking-[0.3em] mb-1.5" style={{ color: `${accentColor}99` }}>{subtitle}</p>
                              <h3 className={`text-lg font-light text-transparent bg-clip-text bg-gradient-to-r ${gradient} tracking-wide`}>{title}</h3>
                            </div>
                            {/* Chart */}
                            {chart && <div className="px-4 pb-2">{chart}</div>}
                            {/* Body */}
                            <div className="px-6 pb-6 space-y-3" style={{ background: 'linear-gradient(to bottom right, rgba(255,255,255,0.02), rgba(255,255,255,0.005))' }}>
                              {text.split('\n\n').map((p, i) => (
                                <p key={i} className="text-white/75 text-[15px] font-light leading-[1.8]">{renderConceptBold(p)}</p>
                              ))}
                            </div>
                          </div>
                        )
                      })
                    })()}
                  </div>
                </motion.div>
              )}

              {/* ═══ RAPPORT — BIENVENIDA EMPÁTICA — Tarjeta con header de color ═══ */}
              {aiAnalysis.radiografia_inicial && (
                <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
                  className="rounded-2xl overflow-hidden border border-indigo-500/15 bg-white/[0.02] backdrop-blur-sm">
                  <div className="bg-gradient-to-r from-indigo-600/90 to-violet-600/80 px-6 py-4 flex items-center gap-3">
                    <MessageCircle className="w-5 h-5 text-white/90" />
                    <h3 className="text-white font-semibold text-sm tracking-wide">Lo que percibimos de tu relación</h3>
                  </div>
                  <div className="p-6 space-y-3">
                    <p className="text-white/50 text-sm font-light leading-relaxed mb-4">Lo que compartiste aquí es valioso y único. Este análisis está diseñado para ayudarte a comprender cómo amas, qué patrones se repiten en tu relación, y qué posibilidades de crecimiento existen.</p>
                    {/* Timeline */}
                    {aiAnalysis.graficas_autoanalisis?.timeline_relacion && (
                      <RelationshipTimeline data={aiAnalysis.graficas_autoanalisis.timeline_relacion} />
                    )}
                    {aiAnalysis.radiografia_inicial.split('\n\n').map((p, i) => (
                      <p key={i} className="text-white/70 text-[15px] font-light leading-[1.8]">{renderConceptBold(p)}</p>
                    ))}
                  </div>
                </motion.div>
              )}

              {/* ═══ SEPARADOR PARTE 2 — TU RELACIÓN DESDE 11 PERSPECTIVAS ═══ */}
              <div className="text-center my-10 py-6 border-t border-b border-white/5">
                <p className="text-violet-400/50 text-xs font-bold uppercase tracking-[0.25em] mb-1">Parte 2</p>
                <p className="text-white/40 text-sm font-light">Ahora, tu relación analizada desde 11 corrientes psicológicas</p>
              </div>

              {/* ═══ 1. ANÁLISIS POR ENFOQUE PSICOLÓGICO (11 corrientes) ═══ */}
              {aiAnalysis.lecturas_por_enfoque && (() => {
                return (
                <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
                  {/* ── SECCIÓN PANORÁMICA: Tu relación en una mirada ── */}
                  {aiAnalysis.dimensiones && (
                    <div className="space-y-6 mb-10">
                      <div className="text-center py-6">
                        <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-gradient-to-br from-violet-500/20 to-indigo-500/15 border border-violet-500/25 mb-4 shadow-lg shadow-violet-500/10">
                          <Eye className="w-7 h-7 text-violet-400/80" />
                        </div>
                        <h2 className="text-2xl lg:text-3xl font-light text-transparent bg-clip-text bg-gradient-to-r from-violet-300 to-indigo-300 tracking-wide mb-2">Tu relación analizada desde 11 perspectivas</h2>
                        <p className="text-white/55 text-sm font-light mt-2 max-w-lg mx-auto">Cada sección explora una dimensión distinta de tu relación a través de los ojos de un psicólogo experto en amor y vínculos.</p>
                      </div>

                      {/* Radar Chart — perfil global */}
                      <RadarChart dimensiones={aiAnalysis.dimensiones} />
                    </div>
                  )}

                  {/* ════════════════════════════════════════════════
                      11 AUTORES INDIVIDUALES — cada uno con su gráfica única
                  ════════════════════════════════════════════════ */}

                  {/* ── 1. JOHN GOTTMAN — Regulación del conflicto ── */}
                  {aiAnalysis.lecturas_por_enfoque?.gottman && (() => {
                    const data = aiAnalysis.lecturas_por_enfoque.gottman
                    const jinetes = data.jinetes || { critica: 50, desprecio: 30, actitud_defensiva: 55, evasion: 45 }
                    const reparacion = data.capacidad_reparacion ?? 40
                    const jineteLabels = [
                      { key: 'critica', label: 'Crítica', color: '#60a5fa', icon: '⚔️' },
                      { key: 'desprecio', label: 'Desprecio', color: '#818cf8', icon: '😤' },
                      { key: 'actitud_defensiva', label: 'Actitud defensiva', color: '#a78bfa', icon: '🛡️' },
                      { key: 'evasion', label: 'Evasión', color: '#6366f1', icon: '🚶' }
                    ]
                    const detalle = data.jinetes_detalle || []
                    return (
                      <div className="space-y-6">
                        <div className="text-center py-6">
                          <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-gradient-to-br from-blue-500/20 to-indigo-500/15 border border-blue-500/25 mb-4 shadow-lg shadow-blue-500/10">
                            <Shield className="w-7 h-7 text-blue-400/80" />
                          </div>
                          <p className="text-blue-300/60 text-[10px] font-bold uppercase tracking-[0.3em] mb-2">Regulación del conflicto</p>
                          <h2 className="text-2xl lg:text-3xl font-light text-transparent bg-clip-text bg-gradient-to-r from-blue-300 to-indigo-300 tracking-wide">Los 4 jinetes de tu relación</h2>
                        <p className="text-white/45 text-xs font-light mt-2">John Gottman</p>
                          <p className="text-white/55 text-sm font-light mt-2 max-w-lg mx-auto">¿Cómo manejan los desacuerdos? Los patrones de conflicto que aparecen una y otra vez revelan la salud del vínculo.</p>
                        </div>

                        {/* Side by side: Radar + Bars */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          {/* LEFT — Radar chart (5 axes: 4 jinetes + reparacion) */}
                          <div className="p-4 rounded-2xl border border-blue-500/10 bg-white/[0.02]">
                            <p className="text-center text-white/50 text-[10px] font-bold uppercase tracking-[0.2em] mb-3">Perfil de conflicto</p>
                            <svg viewBox="0 0 360 360" className="w-full max-w-sm mx-auto">
                              {(() => {
                                const radarItems = [
                                  { label: 'Crítica', val: jinetes.critica, color: '#60a5fa' },
                                  { label: 'Desprecio', val: jinetes.desprecio, color: '#818cf8' },
                                  { label: 'Defensiva', val: jinetes.actitud_defensiva, color: '#a78bfa' },
                                  { label: 'Evasión', val: jinetes.evasion, color: '#6366f1' },
                                  { label: 'Reparación', val: reparacion, color: '#10b981' }
                                ]
                                const rn = radarItems.length, rcx = 180, rcy = 175, rR = 110
                                const rPt = (i, v) => {
                                  const a = (Math.PI * 2 * i) / rn - Math.PI / 2
                                  return [rcx + Math.cos(a) * (v / 100) * rR, rcy + Math.sin(a) * (v / 100) * rR]
                                }
                                const poly = radarItems.map((d, i) => rPt(i, d.val).join(',')).join(' ')
                                return (
                                  <>
                                    {[25, 50, 75, 100].map(lv => {
                                      const pts = Array.from({ length: rn }, (_, i) => rPt(i, lv).join(',')).join(' ')
                                      return <polygon key={lv} points={pts} fill="none" stroke="rgba(255,255,255,0.06)" strokeWidth="0.8" />
                                    })}
                                    {radarItems.map((_, i) => {
                                      const [ex, ey] = rPt(i, 100)
                                      return <line key={i} x1={rcx} y1={rcy} x2={ex} y2={ey} stroke="rgba(255,255,255,0.06)" strokeWidth="0.8" />
                                    })}
                                    <polygon points={poly} fill="rgba(99,102,241,0.15)" stroke="rgba(99,102,241,0.6)" strokeWidth="2" />
                                    {radarItems.map((d, i) => {
                                      const [px, py] = rPt(i, d.val)
                                      const [lx, ly] = rPt(i, 125)
                                      return (
                                        <g key={i}>
                                          <circle cx={px} cy={py} r={5} fill={d.color} fillOpacity={0.8} />
                                          <text x={lx} y={ly + 1} textAnchor="middle" dominantBaseline="central" fill={d.color} fontSize="13" fontWeight="500" fillOpacity={0.9}>{d.label}</text>
                                          <text x={px} y={py - 11} textAnchor="middle" fill="rgba(255,255,255,0.8)" fontSize="12" fontWeight="700">{d.val}</text>
                                        </g>
                                      )
                                    })}
                                  </>
                                )
                              })()}
                            </svg>
                          </div>

                          {/* RIGHT — Horizontal bars */}
                          <div className="p-4 rounded-2xl border border-blue-500/10 bg-white/[0.02]">
                            <p className="text-center text-white/50 text-[10px] font-bold uppercase tracking-[0.2em] mb-3">Intensidad por jinete</p>
                            <div className="space-y-4 mt-4">
                              {jineteLabels.map((j) => {
                                const val = jinetes[j.key] ?? 0
                                return (
                                  <div key={j.key}>
                                    <div className="flex justify-between mb-1">
                                      <span className="text-white/65 text-xs font-medium">{j.icon} {j.label}</span>
                                      <span className="text-xs font-bold" style={{ color: j.color }}>{val}%</span>
                                    </div>
                                    <div className="h-2.5 rounded-full bg-white/[0.06] overflow-hidden">
                                      <div className="h-full rounded-full" style={{ width: `${val}%`, backgroundColor: j.color, opacity: 0.55 }} />
                                    </div>
                                  </div>
                                )
                              })}
                              {/* Reparacion bar (green) */}
                              <div>
                                <div className="flex justify-between mb-1">
                                  <span className="text-white/65 text-xs font-medium">💚 Reparación</span>
                                  <span className="text-xs font-bold text-emerald-400">{reparacion}%</span>
                                </div>
                                <div className="h-2.5 rounded-full bg-white/[0.06] overflow-hidden">
                                  <div className="h-full rounded-full bg-emerald-500" style={{ width: `${reparacion}%`, opacity: 0.55 }} />
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>

                        {/* Jinete detail cards */}
                        {detalle.length > 0 && (
                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                            {detalle.map((d, i) => {
                              const j = jineteLabels[i] || jineteLabels[0]
                              return (
                                <div key={i} className="p-4 rounded-xl border border-white/[0.06] bg-white/[0.02]">
                                  <div className="flex items-center gap-2 mb-2">
                                    <span className="text-sm">{j.icon}</span>
                                    <span className="text-white/80 text-xs font-semibold">{j.label}</span>
                                  </div>
                                  {d.como_aparece && <p className="text-white/55 text-[12px] font-light leading-relaxed mb-1"><strong className="text-white/70">Cómo aparece:</strong> {d.como_aparece}</p>}
                                  {d.impacto && <p className="text-white/55 text-[12px] font-light leading-relaxed"><strong className="text-white/70">Impacto:</strong> {d.impacto}</p>}
                                </div>
                              )
                            })}
                          </div>
                        )}

                        {/* Mini-lectura: patron, zona riesgo, recurso */}
                        {(data.patron_dominante || data.zona_riesgo || data.recurso_disponible) && (
                          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                            {data.patron_dominante && (
                              <div className="p-3 rounded-xl border border-blue-500/10 bg-blue-500/[0.03] text-center">
                                <p className="text-blue-300/60 text-[9px] font-bold uppercase tracking-wider mb-1">Patrón dominante</p>
                                <p className="text-white/70 text-xs font-light">{data.patron_dominante}</p>
                              </div>
                            )}
                            {data.zona_riesgo && (
                              <div className="p-3 rounded-xl border border-red-500/10 bg-red-500/[0.03] text-center">
                                <p className="text-red-300/60 text-[9px] font-bold uppercase tracking-wider mb-1">Zona de riesgo</p>
                                <p className="text-white/70 text-xs font-light">{data.zona_riesgo}</p>
                              </div>
                            )}
                            {data.recurso_disponible && (
                              <div className="p-3 rounded-xl border border-emerald-500/10 bg-emerald-500/[0.03] text-center">
                                <p className="text-emerald-300/60 text-[9px] font-bold uppercase tracking-wider mb-1">Recurso disponible</p>
                                <p className="text-white/70 text-xs font-light">{data.recurso_disponible}</p>
                              </div>
                            )}
                          </div>
                        )}

                        <div className="p-6 rounded-2xl border border-blue-500/10 bg-gradient-to-br from-blue-500/[0.03] to-transparent">
                          <p className="text-blue-300/50 text-[10px] font-bold uppercase tracking-[0.2em] mb-4">Interpretación</p>
                          {data.interpretacion && data.interpretacion.split('\n\n').map((p, i) => (
                            <p key={i} className="text-white/70 text-[14px] font-light leading-[1.85] mb-2">{renderConceptBold(p)}</p>
                          ))}
                        </div>
                      </div>
                    )
                  })()}

                  {/* ── 2. ROBERT STERNBERG — La geometría de tu amor ── */}
                  {aiAnalysis.lecturas_por_enfoque?.sternberg && (() => {
                    const data = aiAnalysis.lecturas_por_enfoque.sternberg
                    return (
                      <div className="space-y-6">
                        <div className="text-center py-6">
                          <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-gradient-to-br from-violet-500/20 to-purple-500/15 border border-violet-500/25 mb-4 shadow-lg shadow-violet-500/10">
                            <Star className="w-7 h-7 text-violet-400/80" />
                          </div>
                          <p className="text-violet-300/60 text-[10px] font-bold uppercase tracking-[0.3em] mb-2">La geometría del amor</p>
                          <h2 className="text-2xl lg:text-3xl font-light text-transparent bg-clip-text bg-gradient-to-r from-violet-300 to-purple-300 tracking-wide">Intimidad, pasión y compromiso</h2>
                          <p className="text-white/45 text-xs font-light mt-2">Robert Sternberg</p>
                          <p className="text-white/55 text-sm font-light mt-2 max-w-lg mx-auto">El triángulo amoroso refleja la proporción entre los tres pilares de toda relación profunda.</p>
                        </div>
                        <SternbergTriangleChart data={data} />
                        <div className="p-6 rounded-2xl border border-violet-500/10 bg-gradient-to-br from-violet-500/[0.03] to-transparent">
                          <p className="text-violet-300/50 text-[10px] font-bold uppercase tracking-[0.2em] mb-4">Interpretación</p>
                          {data.interpretacion && data.interpretacion.split('\n\n').map((p, i) => (
                            <p key={i} className="text-white/70 text-[14px] font-light leading-[1.85] mb-2">{renderConceptBold(p)}</p>
                          ))}
                        </div>
                      </div>
                    )
                  })()}

                  {/* ── 3. AMIR LEVINE — Tu estilo de apego ── */}
                  {aiAnalysis.lecturas_por_enfoque?.levine && (() => {
                    const data = aiAnalysis.lecturas_por_enfoque.levine
                    return (
                      <div className="space-y-6">
                        <div className="text-center py-6">
                          <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-gradient-to-br from-amber-500/20 to-yellow-500/15 border border-amber-500/25 mb-4 shadow-lg shadow-amber-500/10">
                            <Anchor className="w-7 h-7 text-amber-400/80" />
                          </div>
                          <p className="text-amber-300/60 text-[10px] font-bold uppercase tracking-[0.3em] mb-2">Identidad emocional</p>
                          <h2 className="text-2xl lg:text-3xl font-light text-transparent bg-clip-text bg-gradient-to-r from-amber-300 to-yellow-300 tracking-wide">Tu estilo de apego</h2>
                          <p className="text-white/45 text-xs font-light mt-2">Amir Levine{data.estilo_apego ? ` · Estilo detectado: ${data.estilo_apego}` : ''}</p>
                          <p className="text-white/55 text-sm font-light mt-2 max-w-lg mx-auto">¿Qué tipo de pareja eres? Tu forma de vincularte y cuánta cercanía toleras.</p>
                        </div>
                        <PolarMiniChart data={data} />
                        <div className="p-6 rounded-2xl border border-amber-500/10 bg-gradient-to-br from-amber-500/[0.03] to-transparent">
                          <p className="text-amber-300/50 text-[10px] font-bold uppercase tracking-[0.2em] mb-4">Interpretación</p>
                          {data.interpretacion && data.interpretacion.split('\n\n').map((p, i) => (
                            <p key={i} className="text-white/70 text-[14px] font-light leading-[1.85] mb-2">{renderConceptBold(p)}</p>
                          ))}
                        </div>
                      </div>
                    )
                  })()}

                  {/* ── 4. SUE JOHNSON — Ciclos emocionales ── */}
                  {aiAnalysis.lecturas_por_enfoque?.sue_johnson && (() => {
                    const data = aiAnalysis.lecturas_por_enfoque.sue_johnson
                    return (
                      <div className="space-y-6">
                        <div className="text-center py-6">
                          <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-gradient-to-br from-rose-500/20 to-pink-500/15 border border-rose-500/25 mb-4 shadow-lg shadow-rose-500/10">
                            <Heart className="w-7 h-7 text-rose-400/80" />
                          </div>
                          <p className="text-rose-300/60 text-[10px] font-bold uppercase tracking-[0.3em] mb-2">Ciclos emocionales</p>
                          <h2 className="text-2xl lg:text-3xl font-light text-transparent bg-clip-text bg-gradient-to-r from-rose-300 to-pink-300 tracking-wide">El baile emocional de tu relación</h2>
                          <p className="text-white/45 text-xs font-light mt-2">Sue Johnson</p>
                          <p className="text-white/55 text-sm font-light mt-2 max-w-lg mx-auto">El ciclo perseguidor-distanciador: cómo se activan las alarmas emocionales y se perpetúan los patrones de desconexión.</p>
                        </div>
                        <JohnsonCycleChart data={data} />
                        <div className="p-6 rounded-2xl border border-rose-500/10 bg-gradient-to-br from-rose-500/[0.03] to-transparent">
                          <p className="text-rose-300/50 text-[10px] font-bold uppercase tracking-[0.2em] mb-4">Interpretación</p>
                          {data.interpretacion && data.interpretacion.split('\n\n').map((p, i) => (
                            <p key={i} className="text-white/70 text-[14px] font-light leading-[1.85] mb-2">{renderConceptBold(p)}</p>
                          ))}
                        </div>
                      </div>
                    )
                  })()}

                  {/* ── 5. ESTHER PEREL — Erotismo y deseo ── */}
                  {aiAnalysis.lecturas_por_enfoque?.perel && (() => {
                    const data = aiAnalysis.lecturas_por_enfoque.perel
                    return (
                      <div className="space-y-6">
                        <div className="text-center py-6">
                          <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-gradient-to-br from-pink-500/20 to-rose-500/15 border border-pink-500/25 mb-4 shadow-lg shadow-pink-500/10">
                            <Flame className="w-7 h-7 text-pink-400/80" />
                          </div>
                          <p className="text-pink-300/60 text-[10px] font-bold uppercase tracking-[0.3em] mb-2">Vida erótica</p>
                          <h2 className="text-2xl lg:text-3xl font-light text-transparent bg-clip-text bg-gradient-to-r from-pink-300 to-rose-300 tracking-wide">Erotismo y deseo</h2>
                          <p className="text-white/45 text-xs font-light mt-2">Esther Perel</p>
                          <p className="text-white/55 text-sm font-light mt-2 max-w-lg mx-auto">La tensión entre seguridad y aventura. El deseo necesita misterio, novedad y autonomía para sobrevivir.</p>
                        </div>
                        {aiAnalysis.energia_vinculo && <LollipopMiniChart data={aiAnalysis.energia_vinculo} />}
                        <div className="p-6 rounded-2xl border border-pink-500/10 bg-gradient-to-br from-pink-500/[0.03] to-transparent">
                          <p className="text-pink-300/50 text-[10px] font-bold uppercase tracking-[0.2em] mb-4">Interpretación</p>
                          {data.interpretacion && data.interpretacion.split('\n\n').map((p, i) => (
                            <p key={i} className="text-white/70 text-[14px] font-light leading-[1.85] mb-2">{renderConceptBold(p)}</p>
                          ))}
                        </div>
                      </div>
                    )
                  })()}

                  {/* ── 6. FREUD & LACAN — El inconsciente relacional ── */}
                  {aiAnalysis.lecturas_por_enfoque?.freud_lacan && (() => {
                    const data = aiAnalysis.lecturas_por_enfoque.freud_lacan
                    return (
                      <div className="space-y-6">
                        <div className="text-center py-6">
                          <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-gradient-to-br from-purple-500/20 to-fuchsia-500/15 border border-purple-500/25 mb-4 shadow-lg shadow-purple-500/10">
                            <Brain className="w-7 h-7 text-purple-400/80" />
                          </div>
                          <p className="text-purple-300/60 text-[10px] font-bold uppercase tracking-[0.3em] mb-2">Inconsciente relacional</p>
                          <h2 className="text-2xl lg:text-3xl font-light text-transparent bg-clip-text bg-gradient-to-r from-purple-300 to-fuchsia-300 tracking-wide">Lo que no ves, te elige</h2>
                          <p className="text-white/45 text-xs font-light mt-2">Sigmund Freud & Jacques Lacan</p>
                          <p className="text-white/55 text-sm font-light mt-2 max-w-lg mx-auto">Debajo de la superficie: herida infantil, pulsiones repetitivas y la búsqueda inconsciente del otro.</p>
                        </div>
                        <IcebergChart data={data} />
                        <div className="p-6 rounded-2xl border border-purple-500/10 bg-gradient-to-br from-purple-500/[0.03] to-transparent">
                          <p className="text-purple-300/50 text-[10px] font-bold uppercase tracking-[0.2em] mb-4">Interpretación</p>
                          {data.interpretacion_freud && (
                            <div className="pl-4 border-l-2 border-purple-500/20 space-y-2 mb-4">
                              <p className="text-purple-300/60 text-[10px] font-medium uppercase tracking-wider">Lectura freudiana</p>
                              {data.interpretacion_freud.split('\n\n').map((p, i) => (
                                <p key={i} className="text-white/70 text-[14px] font-light leading-[1.85]">{renderConceptBold(p)}</p>
                              ))}
                            </div>
                          )}
                          {data.interpretacion_lacan && (
                            <div className="pl-4 border-l-2 border-indigo-500/20 space-y-2 mb-4">
                              <p className="text-indigo-300/60 text-[10px] font-medium uppercase tracking-wider">Lectura lacaniana</p>
                              {data.interpretacion_lacan.split('\n\n').map((p, i) => (
                                <p key={i} className="text-white/70 text-[14px] font-light leading-[1.85]">{renderConceptBold(p)}</p>
                              ))}
                            </div>
                          )}
                          {data.interpretacion && !data.interpretacion_freud && data.interpretacion.split('\n\n').map((p, i) => (
                            <p key={i} className="text-white/70 text-[14px] font-light leading-[1.85] mb-2">{renderConceptBold(p)}</p>
                          ))}
                        </div>
                      </div>
                    )
                  })()}

                  {/* ── 7. HARVILLE HENDRIX — La elección inconsciente ── */}
                  {aiAnalysis.lecturas_por_enfoque?.hendrix && (() => {
                    const data = aiAnalysis.lecturas_por_enfoque.hendrix
                    return (
                      <div className="space-y-6">
                        <div className="text-center py-6">
                          <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-gradient-to-br from-orange-500/20 to-amber-500/15 border border-orange-500/25 mb-4 shadow-lg shadow-orange-500/10">
                            <Repeat className="w-7 h-7 text-orange-400/80" />
                          </div>
                          <p className="text-orange-300/60 text-[10px] font-bold uppercase tracking-[0.3em] mb-2">La elección inconsciente</p>
                          <h2 className="text-2xl lg:text-3xl font-light text-transparent bg-clip-text bg-gradient-to-r from-orange-300 to-amber-300 tracking-wide">¿Por qué elegiste a tu pareja?</h2>
                          <p className="text-white/45 text-xs font-light mt-2">Harville Hendrix</p>
                          <p className="text-white/55 text-sm font-light mt-2 max-w-lg mx-auto">La persona que elegimos no es casualidad. Nuestra psique busca reparar heridas de la infancia a través del Imago.</p>
                        </div>
                        <HendrixImagoChart data={data} />
                        <div className="p-6 rounded-2xl border border-orange-500/10 bg-gradient-to-br from-orange-500/[0.03] to-transparent">
                          <p className="text-orange-300/50 text-[10px] font-bold uppercase tracking-[0.2em] mb-4">Interpretación</p>
                          {data.interpretacion && data.interpretacion.split('\n\n').map((p, i) => (
                            <p key={i} className="text-white/70 text-[14px] font-light leading-[1.85] mb-2">{renderConceptBold(p)}</p>
                          ))}
                        </div>
                      </div>
                    )
                  })()}

                  {/* ── 8. DAVID SCHNARCH — Diferenciación del self ── */}
                  {aiAnalysis.lecturas_por_enfoque?.schnarch && (() => {
                    const data = aiAnalysis.lecturas_por_enfoque.schnarch
                    return (
                      <div className="space-y-6">
                        <div className="text-center py-6">
                          <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-gradient-to-br from-emerald-500/20 to-teal-500/15 border border-emerald-500/25 mb-4 shadow-lg shadow-emerald-500/10">
                            <Compass className="w-7 h-7 text-emerald-400/80" />
                          </div>
                          <p className="text-emerald-300/60 text-[10px] font-bold uppercase tracking-[0.3em] mb-2">Diferenciación del self</p>
                          <h2 className="text-2xl lg:text-3xl font-light text-transparent bg-clip-text bg-gradient-to-r from-emerald-300 to-teal-300 tracking-wide">¿Te pierdes en la relación?</h2>
                          <p className="text-white/45 text-xs font-light mt-2">David Schnarch</p>
                          <p className="text-white/55 text-sm font-light mt-2 max-w-lg mx-auto">La madurez emocional se mide por tu capacidad de mantener tu identidad sin fusionarte ni distanciarte.</p>
                        </div>
                        <SchnarchThermometerChart data={data} />
                        <div className="p-6 rounded-2xl border border-emerald-500/10 bg-gradient-to-br from-emerald-500/[0.03] to-transparent">
                          <p className="text-emerald-300/50 text-[10px] font-bold uppercase tracking-[0.2em] mb-4">Interpretación</p>
                          {data.interpretacion && data.interpretacion.split('\n\n').map((p, i) => (
                            <p key={i} className="text-white/70 text-[14px] font-light leading-[1.85] mb-2">{renderConceptBold(p)}</p>
                          ))}
                        </div>
                      </div>
                    )
                  })()}

                  {/* ── 9. STAN TATKIN — Sistema nervioso de la pareja ── */}
                  {aiAnalysis.lecturas_por_enfoque?.tatkin && (() => {
                    const data = aiAnalysis.lecturas_por_enfoque.tatkin
                    return (
                      <div className="space-y-6">
                        <div className="text-center py-6">
                          <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-gradient-to-br from-teal-500/20 to-cyan-500/15 border border-teal-500/25 mb-4 shadow-lg shadow-teal-500/10">
                            <Activity className="w-7 h-7 text-teal-400/80" />
                          </div>
                          <p className="text-teal-300/60 text-[10px] font-bold uppercase tracking-[0.3em] mb-2">Sistema nervioso</p>
                          <h2 className="text-2xl lg:text-3xl font-light text-transparent bg-clip-text bg-gradient-to-r from-teal-300 to-cyan-300 tracking-wide">Tu regulación en pareja</h2>
                          <p className="text-white/45 text-xs font-light mt-2">Stan Tatkin</p>
                          <p className="text-white/55 text-sm font-light mt-2 max-w-lg mx-auto">Cómo tu sistema nervioso responde al estrés relacional: ¿te hiperactivás, te desconectás o te regulás con tu pareja?</p>
                        </div>
                        <TatkinSpeedometerChart data={data} />
                        <div className="p-6 rounded-2xl border border-teal-500/10 bg-gradient-to-br from-teal-500/[0.03] to-transparent">
                          <p className="text-teal-300/50 text-[10px] font-bold uppercase tracking-[0.2em] mb-4">Interpretación</p>
                          {data.interpretacion && data.interpretacion.split('\n\n').map((p, i) => (
                            <p key={i} className="text-white/70 text-[14px] font-light leading-[1.85] mb-2">{renderConceptBold(p)}</p>
                          ))}
                        </div>
                      </div>
                    )
                  })()}

                  {/* ── 10. GARY CHAPMAN — Lenguaje emocional ── */}
                  {aiAnalysis.lecturas_por_enfoque?.chapman && (() => {
                    const data = aiAnalysis.lecturas_por_enfoque.chapman
                    return (
                      <div className="space-y-6">
                        <div className="text-center py-6">
                          <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-gradient-to-br from-red-500/20 to-orange-500/15 border border-red-500/25 mb-4 shadow-lg shadow-red-500/10">
                            <Gift className="w-7 h-7 text-red-400/80" />
                          </div>
                          <p className="text-red-300/60 text-[10px] font-bold uppercase tracking-[0.3em] mb-2">Lenguaje emocional</p>
                          <h2 className="text-2xl lg:text-3xl font-light text-transparent bg-clip-text bg-gradient-to-r from-red-300 to-orange-300 tracking-wide">Cómo das y recibes amor</h2>
                          <p className="text-white/45 text-xs font-light mt-2">Gary Chapman</p>
                          <p className="text-white/55 text-sm font-light mt-2 max-w-lg mx-auto">Los 5 lenguajes del amor: descubre cuál es el tuyo, cuál es el de tu pareja y por qué no siempre se entienden.</p>
                        </div>
                        <ChapmanArcsChart data={data} />
                        {(data.lenguaje_usuario || data.lenguaje_pareja) && (
                          <div className="grid grid-cols-2 gap-3">
                            {data.lenguaje_usuario && (
                              <div className="px-4 py-3 rounded-xl border border-red-500/10 bg-red-500/[0.04]">
                                <p className="text-red-300/60 text-[10px] font-medium uppercase tracking-wider mb-1">Tu lenguaje</p>
                                <p className="text-white/70 text-sm font-light">{data.lenguaje_usuario}</p>
                              </div>
                            )}
                            {data.lenguaje_pareja && (
                              <div className="px-4 py-3 rounded-xl border border-red-500/10 bg-red-500/[0.04]">
                                <p className="text-red-300/60 text-[10px] font-medium uppercase tracking-wider mb-1">Su lenguaje</p>
                                <p className="text-white/70 text-sm font-light">{data.lenguaje_pareja}</p>
                              </div>
                            )}
                          </div>
                        )}
                        <div className="p-6 rounded-2xl border border-red-500/10 bg-gradient-to-br from-red-500/[0.03] to-transparent">
                          <p className="text-red-300/50 text-[10px] font-bold uppercase tracking-[0.2em] mb-4">Interpretación</p>
                          {data.interpretacion && data.interpretacion.split('\n\n').map((p, i) => (
                            <p key={i} className="text-white/70 text-[14px] font-light leading-[1.85] mb-2">{renderConceptBold(p)}</p>
                          ))}
                        </div>
                      </div>
                    )
                  })()}

                  {/* ── 11. TERRY REAL — Poder relacional ── */}
                  {aiAnalysis.lecturas_por_enfoque?.real && (() => {
                    const data = aiAnalysis.lecturas_por_enfoque.real
                    return (
                      <div className="space-y-6">
                        <div className="text-center py-6">
                          <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-gradient-to-br from-cyan-500/20 to-sky-500/15 border border-cyan-500/25 mb-4 shadow-lg shadow-cyan-500/10">
                            <Scale className="w-7 h-7 text-cyan-400/80" />
                          </div>
                          <p className="text-cyan-300/60 text-[10px] font-bold uppercase tracking-[0.3em] mb-2">Poder relacional</p>
                          <h2 className="text-2xl lg:text-3xl font-light text-transparent bg-clip-text bg-gradient-to-r from-cyan-300 to-sky-300 tracking-wide">El equilibrio de fuerzas</h2>
                          <p className="text-white/45 text-xs font-light mt-2">Terry Real</p>
                          <p className="text-white/55 text-sm font-light mt-2 max-w-lg mx-auto">La danza entre grandiosidad y vergüenza. ¿Quién tiene más poder en la relación y cómo se negocia?</p>
                        </div>
                        <RealBalanceChart data={data} />
                        <div className="p-6 rounded-2xl border border-cyan-500/10 bg-gradient-to-br from-cyan-500/[0.03] to-transparent">
                          <p className="text-cyan-300/50 text-[10px] font-bold uppercase tracking-[0.2em] mb-4">Interpretación</p>
                          {data.interpretacion && data.interpretacion.split('\n\n').map((p, i) => (
                            <p key={i} className="text-white/70 text-[14px] font-light leading-[1.85] mb-2">{renderConceptBold(p)}</p>
                          ))}
                        </div>
                      </div>
                    )
                  })()}

                </motion.div>
                )
              })()}

              {/* ═══ 4. DIRECCIÓN PROBABLE — Premium Gauges ═══ */}
              {aiAnalysis.direccion_probable && (
                <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
                  <div className="relative text-center py-8 mb-6">
                    <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-cyan-500/25 to-transparent" />
                    <div className="inline-flex items-center justify-center w-10 h-10 rounded-xl bg-gradient-to-br from-cyan-500/15 to-blue-500/10 border border-cyan-500/20 mb-3">
                      <TrendingUp className="w-5 h-5 text-cyan-400/60" />
                    </div>
                    <p className="text-cyan-300/40 text-[10px] font-bold uppercase tracking-[0.3em] mb-1">Proyección</p>
                    <h2 className="text-lg font-light text-transparent bg-clip-text bg-gradient-to-r from-cyan-300 to-blue-300">Dirección Probable del Vínculo</h2>
                  </div>
                  <div className="p-6 rounded-2xl border border-white/8 bg-white/[0.02]">
                    {/* Explanation */}
                    <p className="text-white/60 text-xs font-light text-center mb-6 max-w-lg mx-auto">
                      Estos indicadores proyectan la trayectoria de tu vínculo basándose en los patrones actuales detectados en tu narrativa. No son un destino fijo — representan tendencias que pueden transformarse con trabajo emocional.
                    </p>
                    {/* Gauges row */}
                    <div className="grid grid-cols-3 gap-6 mb-6">
                      <GaugeChart value={aiAnalysis.direccion_probable.estabilidad_futura} label="Estabilidad futura" />
                      <GaugeChart value={aiAnalysis.direccion_probable.riesgo_desgaste} label="Riesgo de desgaste" inverted />
                      <GaugeChart value={aiAnalysis.direccion_probable.potencial_reconexion} label="Potencial de reconexión" />
                    </div>
                    {/* Detailed interpretation cards */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-6 border-t border-white/5">
                      {[
                        { val: aiAnalysis.direccion_probable.estabilidad_futura ?? 0, label: 'Estabilidad futura', icon: Shield, color: 'emerald',
                          subtitle: 'Mide la solidez estructural del vínculo: consistencia emocional, resolución de conflictos y seguridad compartida.',
                          text: val => val >= 60 ? 'El vínculo tiene bases sólidas para sostenerse en el tiempo. Los patrones de comunicación y la inversión emocional mutua sugieren un camino estable.' : val >= 40 ? 'Hay elementos de estabilidad pero también zonas frágiles. El equilibrio actual puede sostenerse si ambos trabajan las áreas de tensión detectadas.' : 'La estabilidad del vínculo está comprometida. Los patrones actuales indican que sin intervención activa, el desgaste podría profundizarse.' },
                        { val: aiAnalysis.direccion_probable.riesgo_desgaste ?? 0, label: 'Riesgo de desgaste', icon: AlertTriangle, color: 'red',
                          subtitle: 'Evalúa la acumulación de resentimiento, distancia emocional y conflictos no resueltos que erosionan el vínculo.',
                          text: val => val >= 60 ? 'Se detectan señales importantes de desgaste emocional acumulado. Los conflictos no reparados y la distancia emocional están dejando huella en la relación.' : val >= 40 ? 'Existe un desgaste moderado. Hay temas pendientes que conviene abordar antes de que se cristalicen como patrones permanentes.' : 'El nivel de desgaste es bajo, lo cual indica que la relación mantiene su vitalidad emocional activa.' },
                        { val: aiAnalysis.direccion_probable.potencial_reconexion ?? 0, label: 'Potencial de reconexión', icon: Heart, color: 'violet',
                          subtitle: 'Indica la capacidad latente de la pareja para reencontrarse emocionalmente y reconstruir la intimidad.',
                          text: val => val >= 60 ? 'Hay un potencial significativo para reconectar y profundizar el vínculo. La disposición emocional y los recursos internos están presentes.' : val >= 40 ? 'La reconexión es posible pero requerirá intención consciente y esfuerzo de ambos. Hay apertura pero también resistencias que trabajar.' : 'El potencial de reconexión es bajo en este momento. Algo fundamental en la dinámica necesita transformarse primero.' }
                      ].map(({ val, label, icon: ItemIcon, color, subtitle, text }) => (
                        <div key={label} className="p-4 rounded-xl border border-white/5 bg-white/[0.01] space-y-2">
                          <div className="flex items-center gap-2 mb-1">
                            <ItemIcon className={`w-4 h-4 text-${color}-400/50`} strokeWidth={1.5} />
                            <span className={`text-${color}-300/70 text-xs font-medium`}>{label}</span>
                          </div>
                          <p className="text-white/55 text-[10px] font-light leading-snug">{subtitle}</p>
                          <p className="text-white/55 text-[13px] font-light leading-relaxed">{text(val)}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                </motion.div>
              )}

              {/* ═══ 5. FORTALEZAS Y RIESGOS — Side by side ═══ */}
              {(aiAnalysis.fortalezas?.length > 0 || aiAnalysis.riesgos?.length > 0) && (
                <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
                  <div className="relative text-center py-8 mb-6">
                    <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-emerald-500/20 to-transparent" />
                    <div className="flex items-center justify-center gap-3 mb-3">
                      <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-emerald-500/15 to-green-500/10 border border-emerald-500/20 flex items-center justify-center">
                        <Shield className="w-5 h-5 text-emerald-400/60" />
                      </div>
                    </div>
                    <p className="text-emerald-300/40 text-[10px] font-bold uppercase tracking-[0.3em] mb-1">Diagnóstico</p>
                    <h2 className="text-lg font-light text-transparent bg-clip-text bg-gradient-to-r from-emerald-300 to-cyan-300">Fortalezas y Señales de Riesgo</h2>
                  </div>
                  <div className="space-y-6">
                    {/* Visual balance bar */}
                    <div className="p-5 rounded-2xl border border-white/8 bg-white/[0.02]">
                      <p className="text-white/60 text-[10px] font-medium uppercase tracking-wider text-center mb-4">Balance general del vínculo</p>
                      <div className="flex items-center gap-3">
                        <span className="text-emerald-400/70 text-xs font-medium w-20 text-right">Fortalezas</span>
                        <div className="flex-1 h-4 bg-white/[0.04] rounded-full overflow-hidden flex">
                          <motion.div initial={{ width: 0 }} whileInView={{ width: `${Math.round(((aiAnalysis.fortalezas?.length || 0) / ((aiAnalysis.fortalezas?.length || 0) + (aiAnalysis.riesgos?.length || 0) || 1)) * 100)}%` }}
                            viewport={{ once: true }} transition={{ duration: 1 }}
                            className="h-full bg-gradient-to-r from-emerald-500/60 to-emerald-400/40 rounded-l-full" />
                          <motion.div initial={{ width: 0 }} whileInView={{ width: `${Math.round(((aiAnalysis.riesgos?.length || 0) / ((aiAnalysis.fortalezas?.length || 0) + (aiAnalysis.riesgos?.length || 0) || 1)) * 100)}%` }}
                            viewport={{ once: true }} transition={{ duration: 1 }}
                            className="h-full bg-gradient-to-r from-red-400/40 to-red-500/60 rounded-r-full" />
                        </div>
                        <span className="text-red-400/70 text-xs font-medium w-20">Riesgos</span>
                      </div>
                      <div className="flex justify-between mt-2 px-24">
                        <span className="text-emerald-400/50 text-[11px]">{aiAnalysis.fortalezas?.length || 0}</span>
                        <span className="text-red-400/50 text-[11px]">{aiAnalysis.riesgos?.length || 0}</span>
                      </div>
                    </div>

                    {/* Cards grid */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      {/* Fortalezas — left */}
                      <div className="space-y-3">
                        <p className="text-emerald-300/50 text-[10px] font-medium uppercase tracking-wider flex items-center gap-2">
                          <CheckCircle className="w-3.5 h-3.5" /> Fortalezas detectadas
                        </p>
                        {(aiAnalysis.fortalezas || []).map((f, i) => (
                          <div key={i} className="p-4 rounded-xl border border-emerald-500/10 bg-emerald-500/[0.02] flex items-start gap-3">
                            <div className="w-7 h-7 rounded-lg bg-emerald-500/10 border border-emerald-500/15 flex items-center justify-center flex-shrink-0 mt-0.5">
                              <CheckCircle className="w-3.5 h-3.5 text-emerald-400/60" strokeWidth={1.5} />
                            </div>
                            <p className="text-white/70 text-[14px] font-light leading-relaxed">{renderConceptBold(f)}</p>
                          </div>
                        ))}
                      </div>
                      {/* Riesgos — right */}
                      <div className="space-y-3">
                        <p className="text-red-300/50 text-[10px] font-medium uppercase tracking-wider flex items-center gap-2">
                          <AlertTriangle className="w-3.5 h-3.5" /> Señales de riesgo
                        </p>
                        {(aiAnalysis.riesgos || []).map((r, i) => (
                          <div key={i} className="p-4 rounded-xl border border-red-500/10 bg-red-500/[0.02] flex items-start gap-3">
                            <div className="w-7 h-7 rounded-lg bg-red-500/10 border border-red-500/15 flex items-center justify-center flex-shrink-0 mt-0.5">
                              <AlertTriangle className="w-3.5 h-3.5 text-red-400/60" strokeWidth={1.5} />
                            </div>
                            <p className="text-white/70 text-[14px] font-light leading-relaxed">{renderConceptBold(r)}</p>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </motion.div>
              )}

              {/* ═══ 6. TU SIGUIENTE PASO — CTA DINÁMICO ═══ */}
              <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
                className="p-6 lg:p-8 rounded-2xl border border-violet-500/15 bg-gradient-to-br from-violet-500/[0.04] via-fuchsia-500/[0.02] to-transparent relative overflow-hidden">
                <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-violet-500/30 via-fuchsia-500/20 to-violet-500/30" />
                <div className="text-center mb-6">
                  <div className="inline-flex items-center justify-center w-12 h-12 rounded-2xl bg-gradient-to-br from-violet-500/20 to-fuchsia-500/15 border border-violet-500/25 mb-4">
                    <Sparkles className="w-6 h-6 text-violet-400/70" />
                  </div>
                  <p className="text-violet-300/40 text-[10px] font-bold uppercase tracking-[0.3em] mb-2">Recomendación final</p>
                  <h2 className="text-lg font-light text-white/80 mb-2">Tu siguiente paso</h2>
                  <p className="text-white/60 text-sm font-light max-w-lg mx-auto">
                    {aiAnalysis.temas_para_consulta?.length > 0
                      ? 'Basándonos en todo lo que compartiste y los patrones detectados en tu narrativa, estos son los temas que mayor impacto transformador tendrían si los trabajas en sesión.'
                      : 'Estos son los patrones, raíces y dinámicas que exploraríamos en sesión para transformar tu vínculo y tu forma de relacionarte.'}
                  </p>
                </div>

                {/* Intro motivational text */}
                <div className="p-5 rounded-xl border border-violet-500/10 bg-violet-500/[0.03] mb-6">
                  <p className="text-white/55 text-sm font-light leading-relaxed text-center">
                    Este reporte es un mapa — no un diagnóstico que te condena. Cada patrón detectado es una puerta que se puede abrir con el acompañamiento adecuado. Lo importante no es dónde estás, sino la dirección que elijas tomar a partir de ahora.
                  </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
                  {aiAnalysis.temas_para_consulta?.length > 0
                    ? aiAnalysis.temas_para_consulta.map((tema, i) => {
                        const icons = [Eye, Anchor, Heart, Target, Compass, Brain, Activity, Sparkles]
                        const colors = ['violet', 'cyan', 'fuchsia', 'amber', 'emerald', 'rose', 'sky', 'orange']
                        const TemaIcon = icons[i % icons.length]
                        const color = colors[i % colors.length]
                        return (
                          <div key={i} className={`p-5 rounded-xl border border-${color}-500/10 bg-${color}-500/[0.02] flex items-start gap-4`}>
                            <div className={`w-10 h-10 rounded-xl bg-${color}-500/10 border border-${color}-500/15 flex items-center justify-center flex-shrink-0`}>
                              <TemaIcon className={`w-5 h-5 text-${color}-400/60`} strokeWidth={1.5} />
                            </div>
                            <div className="flex-1">
                              <p className={`text-${color}-300/40 text-[9px] font-medium uppercase tracking-wider mb-1`}>Tema {i + 1}</p>
                              <p className="text-white/70 text-sm font-light leading-relaxed">{renderConceptBold(tema)}</p>
                            </div>
                          </div>
                        )
                      })
                    : [
                        { icon: Eye, label: 'Patrones inconscientes', desc: 'Identificar y desactivar los ciclos repetitivos que operan sin que te des cuenta.' },
                        { icon: Anchor, label: 'Raíces familiares', desc: 'Explorar cómo tu experiencia de amor temprana moldeó tu forma de amar hoy.' },
                        { icon: Heart, label: 'Reconexión emocional', desc: 'Reconstruir la intimidad emocional y la presencia en el vínculo.' },
                        { icon: Target, label: 'Comunicación efectiva', desc: 'Transformar los conflictos en oportunidades de crecimiento.' },
                        { icon: Compass, label: 'Diferenciación del self', desc: 'Fortalecer tu autonomía emocional sin perder la conexión con el otro.' },
                        { icon: Brain, label: 'Regulación emocional', desc: 'Aprender a gestionar tus emociones en momentos de conflicto relacional.' }
                      ].map(({ icon: Icon, label, desc }) => (
                        <div key={label} className="p-5 rounded-xl border border-white/8 bg-white/[0.02] flex items-start gap-4">
                          <div className="w-10 h-10 rounded-xl bg-violet-500/10 border border-violet-500/15 flex items-center justify-center flex-shrink-0">
                            <Icon className="w-5 h-5 text-violet-400/60" strokeWidth={1.5} />
                          </div>
                          <div>
                            <h3 className="text-white/75 text-sm font-medium mb-1.5">{label}</h3>
                            <p className="text-white/50 text-[13px] font-light leading-relaxed">{desc}</p>
                          </div>
                        </div>
                      ))
                  }
                </div>

                {/* Técnicas terapéuticas recomendadas */}
                {aiAnalysis.tecnicas_recomendadas?.length > 0 && (
                  <div className="mb-6">
                    <p className="text-violet-300/50 text-[10px] font-bold uppercase tracking-[0.2em] mb-3 flex items-center gap-2">
                      <Activity className="w-3.5 h-3.5" /> Técnicas terapéuticas sugeridas
                    </p>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      {aiAnalysis.tecnicas_recomendadas.map((tec, i) => (
                        <div key={i} className="p-4 rounded-xl border border-violet-500/10 bg-violet-500/[0.02]">
                          <div className="flex items-center gap-3 mb-2">
                            <div className="w-2 h-2 rounded-full bg-violet-400/50 flex-shrink-0" />
                            <p className="text-white/75 text-sm font-medium">{typeof tec === 'string' ? tec : tec.nombre}</p>
                          </div>
                          {typeof tec === 'object' && tec.descripcion && (
                            <p className="text-white/45 text-[12px] font-light leading-relaxed pl-5">{tec.descripcion}</p>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Libros recomendados */}
                {aiAnalysis.libros_recomendados?.length > 0 && (
                  <div className="mb-8">
                    <p className="text-fuchsia-300/50 text-[10px] font-bold uppercase tracking-[0.2em] mb-3 flex items-center gap-2">
                      📚 Lecturas recomendadas
                    </p>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      {aiAnalysis.libros_recomendados.map((libro, i) => {
                        const nivelColors = { introductorio: 'emerald', intermedio: 'amber', avanzado: 'rose' }
                        const nivelLabel = typeof libro === 'object' && libro.nivel
                        const nColor = nivelColors[nivelLabel] || 'violet'
                        return (
                          <div key={i} className="p-4 rounded-xl border border-fuchsia-500/10 bg-fuchsia-500/[0.02]">
                            <div className="flex items-start justify-between gap-2">
                              <p className="text-white/75 text-sm font-medium">{typeof libro === 'string' ? libro : libro.titulo}</p>
                              {nivelLabel && (
                                <span className={`text-${nColor}-400/70 text-[9px] font-bold uppercase tracking-wider bg-${nColor}-500/10 px-2 py-0.5 rounded-full border border-${nColor}-500/15 flex-shrink-0 whitespace-nowrap`}>
                                  {nivelLabel}
                                </span>
                              )}
                            </div>
                            {typeof libro === 'object' && libro.autor && <p className="text-fuchsia-300/50 text-xs font-light mt-1">{libro.autor}</p>}
                            {typeof libro === 'object' && libro.razon && <p className="text-white/45 text-[12px] font-light mt-2 leading-relaxed">{libro.razon}</p>}
                          </div>
                        )
                      })}
                    </div>
                  </div>
                )}
                {/* ═══ CTA TERAPIA PREMIUM ═══ */}
                <div className="mt-6 mb-2">
                  <div className="text-center mb-6">
                    <p className="text-violet-400/50 text-[10px] font-bold uppercase tracking-[0.3em] mb-2">Da el siguiente paso</p>
                    <p className="text-white/50 text-sm font-light">Tu radiografía detectó patrones que se pueden transformar — con guía profesional.</p>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                    {/* Terapia Individual */}
                    <div className="rounded-2xl border border-white/10 bg-zinc-950/60 overflow-hidden">
                      <div className="py-4 px-6 bg-gradient-to-br from-amber-400 to-orange-500 min-h-[80px] flex flex-col justify-center">
                        <div className="flex items-center gap-2 mb-1">
                          <Users className="w-4 h-4 text-zinc-900/80" />
                          <p className="text-zinc-900 text-xs uppercase tracking-[0.15em] font-bold">Terapia Individual</p>
                        </div>
                        <p className="text-zinc-900/80 text-sm font-semibold leading-snug">
                          {aiAnalysis.cta_terapia_individual?.titular || 'Trabaja tus patrones uno a uno'}
                        </p>
                      </div>
                      <div className="p-6 pt-5 space-y-4">
                        <p className="text-white/55 text-[13px] font-light leading-relaxed">
                          {aiAnalysis.cta_terapia_individual?.descripcion || 'Sesión enfocada en los patrones detectados en tu radiografía para que puedas transformar tu forma de vincularte.'}
                        </p>
                        <ul className="space-y-2">
                          {(aiAnalysis.cta_terapia_individual?.puntos || [
                            'Explorar los patrones detectados en tu narrativa',
                            'Trabajar las raíces emocionales de tus dinámicas',
                            'Construir nuevas formas de vincularte',
                            'Sesión personalizada basada en tu radiografía'
                          ]).map((item, i) => (
                            <li key={i} className="flex items-start gap-2 text-white/50 text-[13px] font-light">
                              <Check className="w-3.5 h-3.5 text-emerald-400/60 flex-shrink-0 mt-0.5" strokeWidth={2} />
                              {item}
                            </li>
                          ))}
                        </ul>
                        <div className="flex items-baseline gap-2">
                          <p className="text-2xl font-light text-white">$700 <span className="text-base text-white/35">MXN</span></p>
                        </div>
                        <motion.a
                          href={`https://wa.me/527228720520?text=${encodeURIComponent('Hola, acabo de hacer mi Radiografía de Pareja y me gustaría agendar una sesión de terapia individual para trabajar los patrones que detectó el análisis.')}`}
                          target="_blank" rel="noopener noreferrer"
                          whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}
                          className="flex items-center justify-center gap-2 w-full py-3.5 rounded-xl bg-gradient-to-r from-amber-400 to-orange-500 text-zinc-900 font-semibold text-sm hover:from-amber-300 hover:to-orange-400 transition-all shadow-lg shadow-amber-600/20">
                          <MessageCircle className="w-4 h-4" /> Agendar por WhatsApp
                        </motion.a>
                      </div>
                    </div>
                    {/* Terapia de Pareja — Highlighted */}
                    <div className="rounded-2xl border border-violet-500/25 bg-gradient-to-br from-violet-500/[0.04] to-fuchsia-500/[0.02] overflow-hidden relative">
                      <div className="absolute top-3 right-3 z-10">
                        <span className="text-[9px] px-2.5 py-1 rounded-full bg-white/15 text-white/80 font-semibold uppercase tracking-wider backdrop-blur-sm">Recomendado</span>
                      </div>
                      <div className="py-4 px-6 bg-gradient-to-br from-violet-600 to-fuchsia-600 min-h-[80px] flex flex-col justify-center">
                        <div className="flex items-center gap-2 mb-1">
                          <Heart className="w-4 h-4 text-white/80" />
                          <p className="text-white text-xs uppercase tracking-[0.15em] font-bold">Terapia de Pareja</p>
                        </div>
                        <p className="text-white/90 text-sm font-semibold leading-snug">
                          {aiAnalysis.cta_terapia_pareja?.titular || 'Transformen su dinámica juntos'}
                        </p>
                      </div>
                      <div className="p-6 pt-5 space-y-4">
                        <p className="text-white/55 text-[13px] font-light leading-relaxed">
                          {aiAnalysis.cta_terapia_pareja?.descripcion || 'Sesión para los dos, enfocada en las dinámicas detectadas en la radiografía para reconectar desde un lugar seguro.'}
                        </p>
                        <ul className="space-y-2">
                          {(aiAnalysis.cta_terapia_pareja?.puntos || [
                            'Trabajar las dinámicas de pareja detectadas',
                            'Romper ciclos de conflicto que se repiten',
                            'Reconectar emocionalmente con herramientas concretas',
                            'Sesión guiada con base en ambas perspectivas'
                          ]).map((item, i) => (
                            <li key={i} className="flex items-start gap-2 text-white/50 text-[13px] font-light">
                              <Check className="w-3.5 h-3.5 text-emerald-400/60 flex-shrink-0 mt-0.5" strokeWidth={2} />
                              {item}
                            </li>
                          ))}
                        </ul>
                        <div className="flex items-baseline gap-2">
                          <p className="text-2xl font-light text-white">$1,250 <span className="text-base text-white/35">MXN</span></p>
                        </div>
                        <motion.a
                          href={`https://wa.me/527228720520?text=${encodeURIComponent('Hola, acabo de hacer mi Radiografía de Pareja y me gustaría agendar una sesión de terapia de pareja para trabajar las dinámicas que detectó el análisis.')}`}
                          target="_blank" rel="noopener noreferrer"
                          whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}
                          className="flex items-center justify-center gap-2 w-full py-3.5 rounded-xl bg-gradient-to-r from-violet-600 to-fuchsia-600 text-white font-semibold text-sm hover:from-violet-500 hover:to-fuchsia-500 transition-all shadow-lg shadow-violet-600/20">
                          <MessageCircle className="w-4 h-4" /> Agendar por WhatsApp
                        </motion.a>
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>
              </>)}

              {/* ═══════════════════════════════════════════════════════════════
                  SECCIÓN: RADIOGRAFÍA CRUZADA (Los Dos)
                  Solo se muestra cuando hay crossAnalysis disponible
              ═══════════════════════════════════════════════════════════════ */}
              {resultTab === 'cruzado' && crossAnalysis && (
                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-10">

                  {/* Separator */}
                  <div className="text-center my-10 py-8 border-t border-b border-emerald-500/10">
                    <p className="text-emerald-400/50 text-xs font-bold uppercase tracking-[0.25em] mb-1">Radiografía Cruzada</p>
                    <p className="text-white/40 text-sm font-light">La relación vista desde las dos perspectivas</p>
                  </div>

                  {/* Apertura */}
                  {crossAnalysis.apertura && (
                    <div className="p-6 lg:p-8 rounded-2xl border border-emerald-500/15 bg-gradient-to-br from-emerald-500/[0.04] via-teal-500/[0.03] to-transparent">
                      <div className="text-center mb-6">
                        <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-gradient-to-br from-emerald-500/20 to-teal-500/15 border border-emerald-500/25 mb-4">
                          <Users className="w-7 h-7 text-emerald-400/80" />
                        </div>
                        <h2 className="text-2xl lg:text-3xl font-light text-transparent bg-clip-text bg-gradient-to-r from-emerald-300 to-teal-300 tracking-wide">Análisis Cruzado</h2>
                      </div>
                      {crossAnalysis.apertura.split('\n\n').map((p, i) => (
                        <p key={i} className="text-white/70 text-[15px] font-light leading-[1.8] mb-3">{renderConceptBold(p)}</p>
                      ))}
                    </div>
                  )}

                  {/* Resumen cruzado */}
                  {crossAnalysis.resumen_cruzado && (
                    <div className="p-6 rounded-2xl border border-teal-500/15 bg-teal-500/[0.03]">
                      <p className="text-teal-300/60 text-[10px] font-bold uppercase tracking-[0.3em] mb-4">Resumen cruzado</p>
                      {crossAnalysis.resumen_cruzado.split('\n\n').map((p, i) => (
                        <p key={i} className="text-white/70 text-[15px] font-light leading-[1.8] mb-3">{renderConceptBold(p)}</p>
                      ))}
                    </div>
                  )}

                  {/* Dimensiones cruzadas — side-by-side bar chart */}
                  {crossAnalysis.dimensiones_cruzadas && (() => {
                    const dims = crossAnalysis.dimensiones_cruzadas
                    const ind = crossAnalysis._individual || {}
                    const name1 = ind.p1?.nombre || 'Participante 1'
                    const name2 = ind.p2?.nombre || 'Participante 2'
                    const dimKeys = Object.keys(dims)
                    return (
                      <div className="p-6 lg:p-8 rounded-2xl border border-emerald-500/15 bg-white/[0.02]">
                        <div className="text-center mb-6">
                          <p className="text-emerald-300/60 text-[10px] font-bold uppercase tracking-[0.3em] mb-2">Dimensiones cruzadas</p>
                          <h3 className="text-xl font-light text-white/80">Cómo se ven el uno al otro</h3>
                          <div className="flex justify-center gap-6 mt-3">
                            <span className="flex items-center gap-2 text-xs text-emerald-300/70"><span className="w-3 h-3 rounded-full bg-emerald-500/60" />{name1}</span>
                            <span className="flex items-center gap-2 text-xs text-sky-300/70"><span className="w-3 h-3 rounded-full bg-sky-500/60" />{name2}</span>
                          </div>
                        </div>
                        <div className="space-y-4">
                          {dimKeys.map(dimKey => {
                            const d = dims[dimKey]
                            const v1 = typeof d.p1 === 'number' ? d.p1 : parseInt(d.p1) || 50
                            const v2 = typeof d.p2 === 'number' ? d.p2 : parseInt(d.p2) || 50
                            const label = DIMENSION_LABELS[dimKey] || dimKey.replace(/_/g, ' ')
                            return (
                              <div key={dimKey} className="group">
                                <div className="flex justify-between mb-1">
                                  <span className="text-white/60 text-xs font-medium capitalize">{label}</span>
                                  <span className="text-white/40 text-[10px]">{v1} / {v2}</span>
                                </div>
                                <div className="flex gap-1">
                                  <div className="flex-1 h-3 rounded-full bg-white/[0.06] overflow-hidden">
                                    <div className="h-full rounded-full bg-gradient-to-r from-emerald-600 to-emerald-400" style={{ width: `${v1}%`, opacity: 0.7 }} />
                                  </div>
                                  <div className="flex-1 h-3 rounded-full bg-white/[0.06] overflow-hidden">
                                    <div className="h-full rounded-full bg-gradient-to-r from-sky-600 to-sky-400" style={{ width: `${v2}%`, opacity: 0.7 }} />
                                  </div>
                                </div>
                                {d.interpretacion && <p className="text-white/40 text-[11px] font-light mt-1 leading-relaxed">{d.interpretacion}</p>}
                              </div>
                            )
                          })}
                        </div>
                      </div>
                    )
                  })()}

                  {/* Puntos ciegos */}
                  {crossAnalysis.puntos_ciegos && (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {crossAnalysis.puntos_ciegos.p1_no_ve && (
                        <div className="p-5 rounded-2xl border border-amber-500/15 bg-amber-500/[0.03]">
                          <div className="flex items-center gap-2 mb-3">
                            <Eye className="w-5 h-5 text-amber-400/70" />
                            <p className="text-amber-300/70 text-xs font-bold uppercase tracking-wider">Lo que no ve</p>
                          </div>
                          {crossAnalysis.puntos_ciegos.p1_no_ve.split('\n\n').map((p, i) => (
                            <p key={i} className="text-white/65 text-[13px] font-light leading-[1.8] mb-2">{renderConceptBold(p)}</p>
                          ))}
                        </div>
                      )}
                      {crossAnalysis.puntos_ciegos.p2_no_ve && (
                        <div className="p-5 rounded-2xl border border-amber-500/15 bg-amber-500/[0.03]">
                          <div className="flex items-center gap-2 mb-3">
                            <Eye className="w-5 h-5 text-amber-400/70" />
                            <p className="text-amber-300/70 text-xs font-bold uppercase tracking-wider">Lo que no ve</p>
                          </div>
                          {crossAnalysis.puntos_ciegos.p2_no_ve.split('\n\n').map((p, i) => (
                            <p key={i} className="text-white/65 text-[13px] font-light leading-[1.8] mb-2">{renderConceptBold(p)}</p>
                          ))}
                        </div>
                      )}
                    </div>
                  )}

                  {/* Dinámica real */}
                  {crossAnalysis.dinamica_real && (
                    <div className="p-6 rounded-2xl border border-fuchsia-500/15 bg-fuchsia-500/[0.03]">
                      <div className="flex items-center gap-2 mb-4">
                        <Zap className="w-5 h-5 text-fuchsia-400/70" />
                        <p className="text-fuchsia-300/60 text-[10px] font-bold uppercase tracking-[0.3em]">La dinámica real de la pareja</p>
                      </div>
                      {crossAnalysis.dinamica_real.split('\n\n').map((p, i) => (
                        <p key={i} className="text-white/70 text-[15px] font-light leading-[1.8] mb-3">{renderConceptBold(p)}</p>
                      ))}
                    </div>
                  )}

                  {/* Convergencias y Divergencias */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {crossAnalysis.convergencias?.length > 0 && (
                      <div className="p-5 rounded-2xl border border-emerald-500/15 bg-emerald-500/[0.03]">
                        <p className="text-emerald-300/60 text-[10px] font-bold uppercase tracking-[0.3em] mb-3 flex items-center gap-2">
                          <CheckCircle className="w-4 h-4" /> Convergencias
                        </p>
                        <ul className="space-y-2">
                          {crossAnalysis.convergencias.map((item, i) => (
                            <li key={i} className="text-white/65 text-[13px] font-light leading-relaxed flex gap-2">
                              <span className="text-emerald-400/60 mt-0.5">•</span>
                              <span>{item}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}
                    {crossAnalysis.divergencias?.length > 0 && (
                      <div className="p-5 rounded-2xl border border-rose-500/15 bg-rose-500/[0.03]">
                        <p className="text-rose-300/60 text-[10px] font-bold uppercase tracking-[0.3em] mb-3 flex items-center gap-2">
                          <AlertTriangle className="w-4 h-4" /> Divergencias
                        </p>
                        <ul className="space-y-2">
                          {crossAnalysis.divergencias.map((item, i) => (
                            <li key={i} className="text-white/65 text-[13px] font-light leading-relaxed flex gap-2">
                              <span className="text-rose-400/60 mt-0.5">•</span>
                              <span>{item}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}
                  </div>

                  {/* Lecturas cruzadas (5 enfoques) */}
                  {crossAnalysis.lecturas_cruzadas && (() => {
                    const lc = crossAnalysis.lecturas_cruzadas
                    const sections = [
                      { key: 'gottman', title: 'Regulación del conflicto', subtitle: 'Gottman cruzado', icon: Shield, gradient: 'from-blue-500 to-indigo-500', border: 'border-blue-500/15', accent: '#60a5fa' },
                      { key: 'apego', title: 'Estilos de apego cruzados', subtitle: 'Apego interaccional', icon: Anchor, gradient: 'from-purple-500 to-fuchsia-500', border: 'border-purple-500/15', accent: '#c084fc' },
                      { key: 'perel', title: 'El deseo desde ambas ventanas', subtitle: 'Esther Perel cruzado', icon: Flame, gradient: 'from-orange-500 to-red-500', border: 'border-orange-500/15', accent: '#fb923c' },
                      { key: 'comunicacion', title: 'Lenguajes de amor cruzados', subtitle: 'Comunicación', icon: MessageCircle, gradient: 'from-teal-500 to-emerald-500', border: 'border-teal-500/15', accent: '#2dd4bf' },
                      { key: 'poder', title: 'Dinámica de poder real', subtitle: 'Equilibrio de poder', icon: Scale, gradient: 'from-amber-500 to-yellow-500', border: 'border-amber-500/15', accent: '#fbbf24' },
                    ]
                    return (
                      <div className="space-y-6">
                        <div className="text-center py-4">
                          <p className="text-emerald-400/50 text-xs font-bold uppercase tracking-[0.25em] mb-1">5 Lecturas Cruzadas</p>
                          <p className="text-white/40 text-sm font-light">Cada corriente psicológica — ahora vista desde las dos perspectivas</p>
                        </div>
                        {sections.map(({ key, title, subtitle, icon: SIcon, gradient, border, accent }) => {
                          const text = lc[key]
                          if (!text) return null
                          return (
                            <div key={key} className={`rounded-2xl overflow-hidden border ${border} bg-white/[0.02]`}>
                              <div className="text-center py-6 px-5 relative">
                                <div className="absolute top-0 left-0 right-0 h-[2px]" style={{ background: `linear-gradient(to right, transparent, ${accent}60, transparent)` }} />
                                <div className={`inline-flex items-center justify-center w-12 h-12 rounded-xl bg-gradient-to-br from-white/10 to-white/5 border border-white/10 mb-3`}>
                                  <SIcon className="w-6 h-6 text-white/70" strokeWidth={1.5} />
                                </div>
                                <p className="text-[10px] font-bold uppercase tracking-[0.3em] mb-1" style={{ color: `${accent}99` }}>{subtitle}</p>
                                <h3 className={`text-lg font-light text-transparent bg-clip-text bg-gradient-to-r ${gradient} tracking-wide`}>{title}</h3>
                              </div>
                              <div className="px-6 pb-6 space-y-3">
                                {text.split('\n\n').map((p, i) => (
                                  <p key={i} className="text-white/70 text-[14px] font-light leading-[1.85]">{renderConceptBold(p)}</p>
                                ))}
                              </div>
                            </div>
                          )
                        })}
                      </div>
                    )
                  })()}

                  {/* Mensaje para ambos */}
                  {crossAnalysis.mensaje_para_ambos && (
                    <div className="p-6 lg:p-8 rounded-2xl border border-emerald-500/20 bg-gradient-to-br from-emerald-500/[0.06] via-teal-500/[0.04] to-transparent">
                      <div className="text-center mb-6">
                        <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-gradient-to-br from-emerald-500/20 to-teal-500/15 border border-emerald-500/25 mb-4">
                          <Heart className="w-7 h-7 text-emerald-400/80" />
                        </div>
                        <h3 className="text-xl font-light text-transparent bg-clip-text bg-gradient-to-r from-emerald-300 to-teal-300">Mensaje para ambos</h3>
                      </div>
                      {crossAnalysis.mensaje_para_ambos.split('\n\n').map((p, i) => (
                        <p key={i} className="text-white/75 text-[15px] font-light leading-[1.8] mb-3 text-center">{renderConceptBold(p)}</p>
                      ))}
                    </div>
                  )}

                  {/* Pronóstico relacional */}
                  {crossAnalysis.pronostico_relacional && (() => {
                    const pr = crossAnalysis.pronostico_relacional
                    const potencial = typeof pr.potencial === 'number' ? pr.potencial : parseInt(pr.potencial) || 50
                    const riesgo = typeof pr.riesgo === 'number' ? pr.riesgo : parseInt(pr.riesgo) || 50
                    return (
                      <div className="p-6 rounded-2xl border border-violet-500/15 bg-violet-500/[0.03]">
                        <p className="text-violet-300/60 text-[10px] font-bold uppercase tracking-[0.3em] mb-4 text-center">Pronóstico relacional</p>
                        <div className="grid grid-cols-2 gap-6 mb-4">
                          <div className="text-center">
                            <p className="text-emerald-400/70 text-xs uppercase tracking-wider mb-2">Potencial</p>
                            <div className="relative w-20 h-20 mx-auto">
                              <svg viewBox="0 0 100 100" className="w-full h-full">
                                <circle cx="50" cy="50" r="42" fill="none" stroke="rgba(255,255,255,0.06)" strokeWidth="6" />
                                <circle cx="50" cy="50" r="42" fill="none" stroke="rgba(16,185,129,0.6)" strokeWidth="6"
                                  strokeDasharray={`${potencial * 2.64} 264`} strokeDashoffset="66" strokeLinecap="round" transform="rotate(-90 50 50)" />
                              </svg>
                              <span className="absolute inset-0 flex items-center justify-center text-emerald-300 text-lg font-bold">{potencial}</span>
                            </div>
                          </div>
                          <div className="text-center">
                            <p className="text-rose-400/70 text-xs uppercase tracking-wider mb-2">Riesgo</p>
                            <div className="relative w-20 h-20 mx-auto">
                              <svg viewBox="0 0 100 100" className="w-full h-full">
                                <circle cx="50" cy="50" r="42" fill="none" stroke="rgba(255,255,255,0.06)" strokeWidth="6" />
                                <circle cx="50" cy="50" r="42" fill="none" stroke="rgba(244,63,94,0.6)" strokeWidth="6"
                                  strokeDasharray={`${riesgo * 2.64} 264`} strokeDashoffset="66" strokeLinecap="round" transform="rotate(-90 50 50)" />
                              </svg>
                              <span className="absolute inset-0 flex items-center justify-center text-rose-300 text-lg font-bold">{riesgo}</span>
                            </div>
                          </div>
                        </div>
                        {pr.direccion && <p className="text-white/60 text-sm font-light text-center leading-relaxed">{pr.direccion}</p>}
                      </div>
                    )
                  })()}

                  {/* ═══ CTA TERAPIA PREMIUM (Cruzado) ═══ */}
                  <div className="mt-6 mb-2">
                    <div className="text-center mb-6">
                      <p className="text-emerald-400/50 text-[10px] font-bold uppercase tracking-[0.3em] mb-2">Da el siguiente paso — juntos</p>
                      <p className="text-white/50 text-sm font-light">La radiografía cruzada reveló dinámicas que se pueden transformar — con guía profesional.</p>
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                      {/* Terapia Individual */}
                      <div className="rounded-2xl border border-white/10 bg-zinc-950/60 overflow-hidden">
                        <div className="py-4 px-6 bg-gradient-to-br from-amber-400 to-orange-500 min-h-[80px] flex flex-col justify-center">
                          <div className="flex items-center gap-2 mb-1">
                            <Users className="w-4 h-4 text-zinc-900/80" />
                            <p className="text-zinc-900 text-xs uppercase tracking-[0.15em] font-bold">Terapia Individual</p>
                          </div>
                          <p className="text-zinc-900/80 text-sm font-semibold leading-snug">
                            {aiAnalysis.cta_terapia_individual?.titular || 'Trabaja tus patrones uno a uno'}
                          </p>
                        </div>
                        <div className="p-6 pt-5 space-y-4">
                          <p className="text-white/55 text-[13px] font-light leading-relaxed">
                            {aiAnalysis.cta_terapia_individual?.descripcion || 'Sesión enfocada en los patrones detectados en tu radiografía para que puedas transformar tu forma de vincularte.'}
                          </p>
                          <ul className="space-y-2">
                            {(aiAnalysis.cta_terapia_individual?.puntos || [
                              'Explorar los patrones detectados en tu narrativa',
                              'Trabajar las raíces emocionales de tus dinámicas',
                              'Construir nuevas formas de vincularte',
                              'Sesión personalizada basada en tu radiografía'
                            ]).map((item, i) => (
                              <li key={i} className="flex items-start gap-2 text-white/50 text-[13px] font-light">
                                <Check className="w-3.5 h-3.5 text-emerald-400/60 flex-shrink-0 mt-0.5" strokeWidth={2} />
                                {item}
                              </li>
                            ))}
                          </ul>
                          <div className="flex items-baseline gap-2">
                            <p className="text-2xl font-light text-white">$700 <span className="text-base text-white/35">MXN</span></p>
                          </div>
                          <motion.a
                            href={`https://wa.me/527228720520?text=${encodeURIComponent('Hola, acabo de hacer mi Radiografía de Pareja y me gustaría agendar una sesión de terapia individual para trabajar los patrones que detectó el análisis.')}`}
                            target="_blank" rel="noopener noreferrer"
                            whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}
                            className="flex items-center justify-center gap-2 w-full py-3.5 rounded-xl bg-gradient-to-r from-amber-400 to-orange-500 text-zinc-900 font-semibold text-sm hover:from-amber-300 hover:to-orange-400 transition-all shadow-lg shadow-amber-600/20">
                            <MessageCircle className="w-4 h-4" /> Agendar por WhatsApp
                          </motion.a>
                        </div>
                      </div>
                      {/* Terapia de Pareja — Highlighted */}
                      <div className="rounded-2xl border border-violet-500/25 bg-gradient-to-br from-violet-500/[0.04] to-fuchsia-500/[0.02] overflow-hidden relative">
                        <div className="absolute top-3 right-3 z-10">
                          <span className="text-[9px] px-2.5 py-1 rounded-full bg-white/15 text-white/80 font-semibold uppercase tracking-wider backdrop-blur-sm">Recomendado</span>
                        </div>
                        <div className="py-4 px-6 bg-gradient-to-br from-violet-600 to-fuchsia-600 min-h-[80px] flex flex-col justify-center">
                          <div className="flex items-center gap-2 mb-1">
                            <Heart className="w-4 h-4 text-white/80" />
                            <p className="text-white text-xs uppercase tracking-[0.15em] font-bold">Terapia de Pareja</p>
                          </div>
                          <p className="text-white/90 text-sm font-semibold leading-snug">
                            {aiAnalysis.cta_terapia_pareja?.titular || 'Transformen su dinámica juntos'}
                          </p>
                        </div>
                        <div className="p-6 pt-5 space-y-4">
                          <p className="text-white/55 text-[13px] font-light leading-relaxed">
                            {aiAnalysis.cta_terapia_pareja?.descripcion || 'Sesión para los dos, enfocada en las dinámicas detectadas en la radiografía para reconectar desde un lugar seguro.'}
                          </p>
                          <ul className="space-y-2">
                            {(aiAnalysis.cta_terapia_pareja?.puntos || [
                              'Trabajar las dinámicas de pareja detectadas',
                              'Romper ciclos de conflicto que se repiten',
                              'Reconectar emocionalmente con herramientas concretas',
                              'Sesión guiada con base en ambas perspectivas'
                            ]).map((item, i) => (
                              <li key={i} className="flex items-start gap-2 text-white/50 text-[13px] font-light">
                                <Check className="w-3.5 h-3.5 text-emerald-400/60 flex-shrink-0 mt-0.5" strokeWidth={2} />
                                {item}
                              </li>
                            ))}
                          </ul>
                          <div className="flex items-baseline gap-2">
                            <p className="text-2xl font-light text-white">$1,250 <span className="text-base text-white/35">MXN</span></p>
                          </div>
                          <motion.a
                            href={`https://wa.me/527228720520?text=${encodeURIComponent('Hola, acabo de hacer mi Radiografía de Pareja y me gustaría agendar una sesión de terapia de pareja para trabajar las dinámicas que detectó el análisis.')}`}
                            target="_blank" rel="noopener noreferrer"
                            whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}
                            className="flex items-center justify-center gap-2 w-full py-3.5 rounded-xl bg-gradient-to-r from-violet-600 to-fuchsia-600 text-white font-semibold text-sm hover:from-violet-500 hover:to-fuchsia-500 transition-all shadow-lg shadow-violet-600/20">
                            <MessageCircle className="w-4 h-4" /> Agendar por WhatsApp
                          </motion.a>
                        </div>
                      </div>
                    </div>
                  </div>

                </motion.div>
              )}

              {/* Back */}
              <div className="text-center pt-4">
                <button onClick={() => navigate('/tienda')}
                  className="text-white/50 text-xs hover:text-white/50 transition-colors underline underline-offset-4">
                  Volver a la tienda
                </button>
              </div>

            </div>
          </motion.div>
        )}

      </AnimatePresence>
    </div>
  )
}

export default RadiografiaPremiumPage
