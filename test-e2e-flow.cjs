#!/usr/bin/env node
/**
 * TEST E2E — 3 paquetes completos con llamada REAL a DeepSeek y emails reales
 * 
 * Uso:  node test-e2e-flow.cjs tu@email.com
 * 
 * Test 1: DESCUBRE (solteros)     → crea token, responde 40Q, IA real, guarda, email
 * Test 2: SOLO    (individual)    → crea token, responde 40Q, IA real, guarda, email
 * Test 3: LOS DOS (pareja)        → crea 2 tokens pareados, ambos responden, IA real ×2,
 *                                    cross-analysis real, guarda, email cruzado
 */

const fs = require('fs')
const path = require('path')

// ── Config ──
const WORKER_URL = 'https://radiografia-worker.noirpraxis.workers.dev'

// Read DeepSeek key from .env
const envPath = path.join(__dirname, '.env')
const envContent = fs.readFileSync(envPath, 'utf-8')
const deepseekMatch = envContent.match(/VITE_DEEPSEEK_API_KEY=(.+)/)
const DEEPSEEK_API_KEY = deepseekMatch ? deepseekMatch[1].trim() : ''
if (!DEEPSEEK_API_KEY) { console.error('❌ No se encontró VITE_DEEPSEEK_API_KEY en .env'); process.exit(1) }

const DEEPSEEK_URL = 'https://api.deepseek.com/chat/completions'

const TEST_EMAIL = process.argv[2]
if (!TEST_EMAIL || !TEST_EMAIL.includes('@')) {
  console.error('❌ Uso: node test-e2e-flow.cjs tu@email.com')
  process.exit(1)
}

// ── Question IDs ──
const Q_IDS = Array.from({ length: 40 }, (_, i) => `Q${i + 1}`)

// ═══════════════════════════════════════════════════════════════
// SIMULATED RESPONSES — 3 personas distintas
// ═══════════════════════════════════════════════════════════════

// Persona 1: LUCÍA — soltera, 28 años (DESCUBRE)
const LUCIA_RESPONSES = {
  Q1: 'Tengo 28 años, trabajo como diseñadora gráfica freelance. Estoy en un momento de mucha introspección porque terminé una relación de 3 años hace 6 meses y estoy tratando de entender qué pasó.',
  Q2: 'Mi relación más importante fue con Diego, duramos 3 años. Fue muy intenso al principio, como una montaña rusa emocional. Antes de él tuve una relación de año y medio con Andrés que fue más tranquila pero me aburría. Y al principio de la universidad tuve algo con Roberto que duró poco pero me marcó mucho porque fue mi primer amor real.',
  Q3: 'Ahorita estoy soltera y la verdad me siento un poco confundida. Por un lado disfruto mi independencia y poder hacer mis cosas sin rendir cuentas, pero por otro lado extraño esa conexión profunda. Me da miedo volver a repetir lo mismo.',
  Q4: 'Con Diego la convivencia era complicada. Yo soy muy independiente y necesito mi espacio, pero él interpretaba eso como que no lo quería. Entonces yo cedía y luego me sentía asfixiada. Con Andrés era diferente, era más cómodo pero yo sentía que hacía falta algo, como chispa.',
  Q5: 'He aprendido que tiendo a elegir personas emocionalmente no disponibles. Diego era súper carismático pero cuando yo necesitaba contención él se iba, literal y emocionalmente. Creo que he crecido en conocerme pero todavía repito ciertos patrones.',
  Q6: 'Me atrae mucho la inteligencia y el humor. Si alguien me hace reír y puede tener conversaciones profundas, ya me ganó. También me atrae cierta intensidad emocional, aunque ahora entiendo que eso a veces es bandera roja. Con Diego fue su creatividad y su forma de ver el mundo lo que me atrapó.',
  Q7: 'Yo demuestro amor con actos de servicio y tiempo de calidad. Cocino para la persona, le preparo cosas, me acuerdo de sus gustos. Pero necesito que me lo demuestren con palabras y con presencia. Necesito que me digan cosas bonitas y que estén ahí cuando los necesito.',
  Q8: 'El momento más significativo fue cuando Diego y yo viajamos a Oaxaca juntos, fue una semana perfecta donde sentí que realmente nos conectamos. Pero también el momento en que descubrí que me había mentido sobre algo importante, ahí algo se rompió que nunca pudimos reparar.',
  Q9: 'Con Diego yo imaginaba un futuro juntos, vivir juntos, viajar, construir algo. Pero con el tiempo me di cuenta de que yo estaba imaginando un futuro con alguien que no existía realmente, sino con la versión idealizada que tenía de él.',
  Q10: 'Diego representaba para mí la posibilidad de ser libre y salvaje y a la vez tener a alguien. Como que necesitaba que alguien me dijera que estaba bien ser yo mientras me sostenía. Andrés representaba seguridad pero me faltaba pasión.',
  Q11: 'Mis papás tienen una relación distante. Mi mamá es muy fuerte e independiente y mi papá siempre fue más pasivo. Nunca los vi pelear abiertamente pero tampoco los vi demostrarse mucho cariño. Como que cada uno vivía en su mundo dentro de la misma casa.',
  Q12: 'Aprendí que el amor es aguantar, que no se habla de las cosas, que ser fuerte es no necesitar al otro. Mi mamá siempre decía que no necesitaba a nadie y yo crecí creyendo que pedir ayuda era debilidad. Creo que eso me ha costado mucho en mis relaciones.',
  Q13: 'Me reconozco en la independencia extrema de mi mamá. Cuando alguien se acerca mucho yo automáticamente tomo distancia. Diego me lo decía, que yo era como un gato que se acercaba cuando quería pero si él intentaba ser cariñoso, yo me cerraba.',
  Q14: 'Con Andrés aprendí que la estabilidad sin pasión me frustra. Con Roberto aprendí lo que se siente el primer amor y lo destructivo que puede ser la dependencia emocional. Con Diego aprendí que puedo repetir los mismos errores aunque jure que ya cambié.',
  Q15: 'Me cuesta mucho mantener mi individualidad estando en pareja. Con Diego terminaba haciendo todo lo que él quería y perdía mis rutinas, mis amigos, mi tiempo. Después reaccionaba y me alejaba completamente. No encontraba un punto medio.',
  Q16: 'Cada quien por su lado, definitivamente. Cuando había crisis con Diego yo me encerraba y él también. Nunca sentí que pudiéramos ser equipo en los momentos difíciles. Yo me volvía autosuficiente y él se iba con sus amigos.',
  Q17: 'Los conflictos con Diego empezaban casi siempre porque yo sentía que no me escuchaba. Le decía algo importante y él se distraía o minimizaba. Entonces yo acumulaba resentimiento hasta que explotaba por algo tonto.',
  Q18: 'Primero siento frustración, como un nudo en el estómago. Luego intento calmarme y ser racional, pero si la otra persona no responde, empiezo a alzar la voz. Al final me retiro y me encierro. A veces no hablo en días.',
  Q19: 'Diego se ponía defensivo inmediatamente. Todo lo que yo decía lo tomaba como ataque personal. Luego se victimizaba y yo terminaba disculpándome aunque fuera él quien hizo algo mal. Con Andrés era diferente, él escuchaba pero no hacía nada para cambiar.',
  Q20: 'Después de discutir, pasaban días de silencio. Luego uno de los dos cedía, generalmente yo, y actuábamos como si nada hubiera pasado. Nunca resolvíamos el tema de fondo, solo lo tapábamos.',
  Q21: 'Me atrae mucho la intensidad en los ojos, alguien que te mira con profundidad. También la voz grave y las manos grandes. La confianza me atrae mucho, alguien que sabe quién es. Pero también me ha atraído esa vulnerabilidad escondida, cuando notas que alguien fuerte tiene una parte frágil.',
  Q22: 'Los momentos de mayor conexión emocional han sido conversaciones nocturnas donde bajan las defensas. Esas noches donde hablas de tus miedos y sientes que el otro realmente te escucha. Con Diego tuvimos momentos así al principio pero después desaparecieron.',
  Q23: 'La intimidad física con Diego era muy apasionada al inicio pero después se volvió mecánica. Yo necesito intimidad emocional para disfrutar la física y cuando eso se perdió, hacer el amor se sintió vacío. Es algo que me cuesta expresar.',
  Q24: 'Al principio con Diego era un incendio. No podíamos estar sin tocarnos. Pero al año ya era algo esporádico y rutinario. Yo intentaba hablar de eso pero él lo tomaba como que no lo deseaba. El deseo para mí tiene que ver mucho con sentirme segura emocionalmente.',
  Q25: 'Me siento conectada cuando hay cocina juntos, cuando hay risas, cuando la conversación fluye sin esfuerzo. También cuando hay vulnerabilidad, cuando alguien me dice que me necesita sin drama.',
  Q26: 'Me desconecto cuando siento que la otra persona está en su mundo. Cuando estoy hablando y noto que revisa el celular. Cuando me minimizan o me dicen que exagero. La indiferencia me mata más que el conflicto.',
  Q27: 'Con Diego las decisiones las tomaba él y yo me adaptaba. Al principio me parecía que era decisión, pero después me di cuenta de que yo simplemente no expresaba lo que quería. Creo que me da miedo imponer mis opiniones.',
  Q28: 'Diego tenía mucho más poder emocional. Él decidía cuándo nos veíamos, qué hacíamos, incluso mi estado de ánimo dependía del suyo. Yo me daba cuenta pero no podía cambiarlo. Con Andrés era al revés, yo tenía el control y eso me aburría.',
  Q29: 'Creo que Diego buscaba alguien que lo admirara y no lo retara. Yo cumplía la función de audiencia de su vida. Andrés buscaba estabilidad y alguien que lo cuidara, yo era como su mamá sustituta.',
  Q30: 'Necesito que me vean como soy, no como quieren que sea. Necesito libertad pero también compromiso. Necesito conversaciones profundas y risas tontas. Necesito que no me digan que exagero cuando algo me duele.',
  Q31: 'Hoy las relaciones significan mucho en mi vida pero ya no quiero que SEAN mi vida. Quiero encontrar a alguien que sume a lo que ya soy, no alguien que me complete porque eso ya me di cuenta de que no funciona.',
  Q32: 'Me imagino estando con alguien con quien pueda crecer, viajar, tener un perro, quizás hijos. Alguien que tenga su vida propia pero que elija estar conmigo. No quiero una relación perfecta, quiero una honesta.',
  Q33: 'Me he sentido amada cuando Diego me preparó una cena sorpresa con todas mis comidas favoritas. Me faltaba la constancia, los gestos cotidianos. Una sorpresa no compensa semanas de indiferencia.',
  Q34: 'Me preocupa repetir los mismos patrones. Me preocupa atraer siempre personas emocionalmente no disponibles. Me preocupa que mi necesidad de independencia sabotee algo bueno.',
  Q35: 'Me ayuda hablar con mi mejor amiga, escribir en mi diario y la terapia. También la creatividad, cuando dibujo o diseño canalizo mucho de lo que siento. El tiempo sola me ha ayudado a entenderme.',
  Q36: 'Con Diego al principio todo era novedad y sorpresa. Después cayó en rutina rápido porque él no era de planear cosas ni de hacer esfuerzo. La rutina me aburre pero también le temo a la intensidad extrema.',
  Q37: 'Busco alguien emocionalmente disponible, que sea capaz de tener conversaciones profundas, que tenga pasión por algo, que me haga reír y que no me tenga miedo cuando muestro mis emociones.',
  Q38: 'He descubierto que soy más dependiente emocionalmente de lo que creía. También que tiendo a racionalizar todo para no sentir. Y que necesito aprender a pedir lo que necesito sin sentir culpa.',
  Q39: 'Mi forma de amar es intensa cuando me entrego pero también puedo ser muy fría cuando me siento herida. Creo que tengo una dualidad entre querer fusionarme y querer huir.',
  Q40: 'Creo que lo más importante es que quiero romper el ciclo. No quiero seguir eligiendo personas que me hacen sentir que tengo que ganarme su amor. Quiero sentir que merezco amor sin tener que esforzarme tanto.'
}

// Persona 2: MARCOS — 34 años, con pareja Laura, 5 años juntos (SOLO)
const MARCOS_RESPONSES = {
  Q1: 'Tengo 34 años, soy ingeniero en una empresa de tecnología. Llevo 5 años con Laura y vivimos juntos hace 2. Estamos en un momento complicado porque ella quiere casarse y yo tengo muchas dudas.',
  Q2: 'Conocí a Laura en una fiesta de amigos en común. Me llamó la atención su risa y su energía. Al principio fue muy casual pero después de unos meses empezamos algo más serio. Los primeros 2 años fueron increíbles, viajamos mucho, nos divertíamos. Desde que vivimos juntos las cosas cambiaron.',
  Q3: 'La relación ahorita la siento estancada. Hay una tensión constante por el tema de casarnos. Ella siente que yo no me comprometo y yo siento que ella me presiona. En lo cotidiano estamos bien pero hay un elefante en la habitación.',
  Q4: 'Nuestro día a día es bastante rutinario. Trabajamos los dos, llegamos cansados, cenamos, vemos algo en la tele y dormimos. Los fines de semana intentamos hacer algo diferente pero muchas veces terminamos cada quien en su celular.',
  Q5: 'Hemos construido una vida juntos que funciona. Tenemos un departamento bonito, un gato, un grupo de amigos en común. Hemos viajado a muchos lugares. Pero a veces siento que lo que hemos construido se parece más a una sociedad que a una historia de amor.',
  Q6: 'Lo que me atrajo de Laura fue su alegría, su energía positiva. Ella tiene una capacidad de ver el lado bueno de todo que a mí me cuesta mucho. Me hacía sentir que la vida era más ligera y divertida.',
  Q7: 'Yo demuestro amor haciendo cosas prácticas, arreglando cosas en la casa, planeando viajes, resolviendo problemas. Laura necesita que le diga que la quiero y yo no soy así, me cuesta mucho expresar emociones con palabras. Ella me lo reclama constantemente.',
  Q8: 'El viaje a Europa que hicimos fue nuestra mejor etapa. 3 semanas donde todo era perfecto. Otro momento importante fue cuando ella enfermó y yo la cuidé durante semanas, ahí sentí que de verdad la amaba. Pero también el momento en que empezamos a vivir juntos y las peleas diarias por tonterías.',
  Q9: 'Al principio no pensaba mucho en el futuro, disfrutaba el presente. Cuando las cosas se pusieron más serias, empecé a imaginar una vida juntos pero siempre con cierta cautela. No soy de comprometerme fácil.',
  Q10: 'Laura representaba para mí la alegría que yo no tengo naturalmente. Yo soy muy analítico y cerebral, y ella me sacaba de mi cabeza. Me hacía sentir que podía ser más espontáneo y vivir sin tanto control.',
  Q11: 'Mis padres se divorciaron cuando yo tenía 10 años. Fue un divorcio horrible con gritos, portazos, abogados. Después de eso viví con mi mamá que estaba siempre amargada y hablaba pestes de mi papá. Mi papá se volvió a casar y a veces sentía que me había cambiado por su nueva familia.',
  Q12: 'Aprendí que el matrimonio es una trampa, que la gente cambia cuando se compromete, que los hombres abandonan y las mujeres sufren. Sé que suena extremo pero son las creencias que absorbí sin darme cuenta.',
  Q13: 'Me doy cuenta de que mi miedo al compromiso viene directamente de haber visto cómo el matrimonio destruyó a mi familia. Cada vez que Laura habla de boda, algo en mí se cierra automáticamente. Es como si mi cuerpo dijera peligro.',
  Q14: 'Antes de Laura tuve una relación de 3 años con Sofía que terminó porque ella me fue infiel. Antes de eso, relaciones cortas donde yo siempre encontraba excusas para no formalizar. Creo que hay un patrón claro.',
  Q15: 'Me cuesta mantener mi individualidad porque Laura tiende a querer hacer todo juntos. Yo necesito tiempo solo para pensar, jugar videojuegos, leer. Cuando no lo tengo me siento atrapado. Pero cuando lo pido, ella siente que no la quiero.',
  Q16: 'Cuando las cosas se ponen difíciles, yo analizo y Laura siente. Es como si habláramos idiomas diferentes. Yo quiero resolver el problema lógicamente y ella quiere que la abrace y le diga que todo estará bien. No soy bueno en eso.',
  Q17: 'Las discusiones empiezan generalmente porque ella siente que no estoy presente emocionalmente. Me dice que estoy ausente, que no la escucho, que parezco robot. Y la verdad a veces tiene razón.',
  Q18: 'Cuando hay conflicto, me quedo en silencio. Analizo, proceso internamente. No grito ni exploto, pero tampoco hablo. Laura dice que mi silencio es peor que un grito porque la hace sentir invisible.',
  Q19: 'Laura llora, se frustra, sube la voz. Después se calma y quiere hablar. Yo prefiero esperar días y ella lo vive como abandono emocional. Es un ciclo que repetimos una y otra vez.',
  Q20: 'Después de una discusión pueden pasar uno o dos días donde cada quien está en lo suyo. Luego yo hago algo práctico como cocinar su comida favorita y así sin hablar mucho volvemos a la normalidad. Pero nunca hablamos del tema real.',
  Q21: 'Laura sigue siendo muy atractiva para mí. Su sonrisa, su cuerpo, su energía. Pero lo que más me genera deseo es cuando está apasionada por algo, hablando de un proyecto o cuando se ríe genuinamente. Eso me enamora.',
  Q22: 'La cercanía emocional la siento en momentos puntuales, no es constante. Cuando viajamos, cuando estamos con amigos, cuando cocinamos juntos. Pero en el día a día siento que nos hemos convertido en roommates que se quieren.',
  Q23: 'La intimidad física ha bajado mucho. Al principio era muy frecuente y apasionada. Ahora es como una vez a la semana por rutina. Ella ha mencionado que se siente rechazada porque yo casi nunca inicio. No es que no quiera, es que estoy cansado y atrapado en mi cabeza.',
  Q24: 'El deseo bajó gradualmente desde que vivimos juntos. La cotidianidad le quitó misterio. Ya no hay esa anticipación de vernos. Es como si la familiaridad hubiera matado parte de la chispa.',
  Q25: 'Nos sentimos más conectados cuando hacemos algo nuevo juntos. Un restaurante diferente, un viaje corto, una actividad que no hayamos hecho. La novedad nos reconecta. También cuando ella me cuenta algo vulnerable.',
  Q26: 'La distancia aparece en la rutina. Cuando llevamos muchos días haciendo lo mismo, cada quien se sumerge en su pantalla y la conexión desaparece. También cuando discutimos por el tema del matrimonio.',
  Q27: 'Yo tiendo a tomar las decisiones prácticas y ella las sociales. En general funciona pero a veces siento que ella quisiera más participación mía en decisiones emocionales y yo quisiera más participación suya en las prácticas.',
  Q28: 'Creo que hay un desbalance. Laura tiene más poder emocional porque ella es la que define el termómetro de la relación. Si ella está bien, estamos bien. Si ella está molesta, todo se cae. Yo me adapto a su estado emocional sin darme cuenta.',
  Q29: 'Laura espera compromiso, seguridad, que yo verbalice mis sentimientos y que avancemos hacia algo más formal. Creo que también espera que yo sea más presente y menos cerebral.',
  Q30: 'Necesito tranquilidad, espacio personal, que no me presionen. Necesito que la relación sea un refugio no un campo de batalla. Necesito que me acepten como soy sin intentar cambiarme todo el tiempo.',
  Q31: 'Esta relación es lo más importante de mi vida aunque no siempre lo demuestre. Laura es mi persona favorita. Pero el miedo al siguiente paso me paraliza y sé que eso la está lastimando.',
  Q32: 'No puedo visualizar claramente el futuro y eso me angustia. Se supone que debería querer casarme después de 5 años pero la sola idea me genera ansiedad. Me imagino bien con ella pero no me imagino en una boda.',
  Q33: 'Me siento amado cuando Laura me prepara café por las mañanas, cuando me defiende frente a otros, cuando acepta mis silencios sin presionarme. Me falta que entienda que mi forma de amar es diferente, no inferior.',
  Q34: 'Me preocupa que estoy saboteando la mejor relación que he tenido por miedos que no me pertenecen a mí sino a la historia de mis padres. Me preocupa perder a Laura por no poder dar un paso que tal vez no es tan terrible.',
  Q35: 'Lo que nos ha sostenido es el cariño genuino que nos tenemos y que, cuando dejamos de lado la presión, somos un gran equipo. También la atracción y el humor. Podemos reírnos de casi todo.',
  Q36: 'La rutina nos ha ganado. Los primeros años eran pura novedad y ahora todo es predecible. Yo encuentro cierta comodidad en la rutina pero reconozco que Laura necesita más emoción.',
  Q37: 'Laura busca un compañero de vida comprometido que le dé seguridad emocional y un futuro claro. Yo busco una compañera que me acepte como soy, que me dé espacio pero que esté ahí cuando la necesito.',
  Q38: 'Esta relación ha despertado en mí la consciencia de mis miedos más profundos. Nunca antes me había enfrentado a mi incapacidad de comprometerme. Laura me ha mostrado partes de mí que yo prefería ignorar.',
  Q39: 'Nuestra relación es única porque somos muy complementarios. Yo soy cerebro y ella es corazón. Juntos somos un ser humano completo, pero por separado tenemos cada uno su gran carencia.',
  Q40: 'Lo que más me importa decir es que sí la amo. Lo que no puedo decir con la misma certeza es que no tengo miedo. Y creo que eso es lo que más la lastima, porque ella merece a alguien que no dude.'
}

// Persona 3A: VALENTINA — 30 años, pareja de TOMÁS, paquete LOS DOS
const VALENTINA_RESPONSES = {
  Q1: 'Tengo 30 años, soy maestra de yoga y llevo 4 años con Tomás. Estamos en un momento donde necesitamos reconectarnos porque sentimos que nos hemos alejado emocionalmente aunque vivimos juntos.',
  Q2: 'Nos conocimos en una clase de cocina, yo estaba ahí por hobbie y él por impresionar a una amiga, lo cual es gracioso. Empezamos a platicar y hubo una conexión inmediata. Los primeros dos años fueron maravillosos, llenos de aventura y pasión.',
  Q3: 'Actualmente siento que estamos en modo automático. Nos queremos pero hay una distancia invisible. Es como si cada uno estuviera en su burbuja y solo convivimos en lo práctico. Extraño la conexión profunda.',
  Q4: 'El día a día es funcional pero sin alma. Él trabaja mucho y yo tengo mis clases. Nos cruzamos en la mañana con prisas y en la noche estamos cansados. Los fines de semana intentamos pero muchas veces nos quedamos en el sillón scrolleando por separado.',
  Q5: 'Hemos construido una vida bonita junta. Una casa, rutinas, un perrito. Pero siento que lo que construimos es un armazón sin suficiente contenido emocional adentro. Quiero más profundidad.',
  Q6: 'Me atrajo su tranquilidad, su forma de estar en calma cuando todo es caos. Yo soy más emocional y él es tierra firme. Eso me hacía sentir segura. También su mirada y sus manos.',
  Q7: 'Yo demuestro amor con contacto físico y palabras de afirmación. Le digo que lo quiero, lo abrazo, le mando notitas. Él demuestra amor resolviendo cosas, arreglando el carro, pagando cuentas. Son formas diferentes y a veces no se sienten como amor.',
  Q8: 'Nuestro primer viaje juntos a la playa fue mágico. Otro momento importante fue cuando perdí a mi abuela y él estuvo ahí en silencio sosteniéndome. Pero también cuando discutimos fuerte por primera vez y me di cuenta que no sabíamos manejar el conflicto.',
  Q9: 'Yo me imaginaba una vida juntos llena de viajes, risas, quizás hijos. Sentía que con él podía ser yo misma y construir algo hermoso. Esa ilusión sigue ahí pero se siente más lejana.',
  Q10: 'Tomás representaba para mí la estabilidad emocional que yo no tenía. Yo crecí en una casa caótica y él era como un ancla. Me hacía sentir que el mundo podía ser un lugar seguro.',
  Q11: 'Mis papás peleaban mucho. Gritos, portazos, silencios de semanas. Mi mamá era muy emotiva y mi papá muy frío. Yo era la que intentaba mediar entre ellos desde chiquita.',
  Q12: 'Aprendí que el amor duele, que hay que sacrificarte por los demás, que las emociones son peligrosas si no las controlas. Que alguien tiene que ser el adulto responsable.',
  Q13: 'Me reconozco en el rol de mediadora. Siempre quiero que todo esté bien, que no haya conflicto. Con Tomás me trago muchas cosas para no pelear y después me siento vacía por dentro.',
  Q14: 'Antes de Tomás tuve dos relaciones cortas y una de dos años con Gabriel que fue muy tóxica. Gabriel era muy celoso y controlador. Cuando lo dejé juré que nunca más permitiría eso y busqué a alguien completamente opuesto.',
  Q15: 'He perdido partes de mí en esta relación. Dejé de ir a eventos de yoga, de ver amigas. No porque él me lo pida sino porque me adapté a su ritmo más sedentario. Necesito reconectar con quien soy yo fuera de la pareja.',
  Q16: 'No funcionamos como equipo en las crisis. Él se cierra y yo me ansiedad. Es como si cada problema nos mandara a esquinas opuestas. Yo lo busco para hablar y él necesita tiempo solo.',
  Q17: 'Los conflictos empiezan porque yo necesito hablar de algo emocional y él minimiza. Me dice que todo está bien cuando claramente no lo está. Eso me desespera porque siento que mis emociones no importan.',
  Q18: 'Cuando hay conflicto me vuelvo más emocional de lo que quisiera. Lloro, hablo rápido, intento explicar lo que siento pero me enredo. Después me retiro sintiéndome tonta por haber mostrado tanto.',
  Q19: 'Tomás se cierra como una ostra. Se queda callado, mira su celular, o se va a otra habitación. Es como si el conflicto lo paralizara. Después actúa como si nada hubiera pasado.',
  Q20: 'Después de un conflicto hay un silencio incómodo que puede durar un día o dos. Luego él hace algo bonito como traerme flores o cocinar y yo lo interpreto como su forma de pedir perdón aunque nunca lo verbalice.',
  Q21: 'Me sigue atrayendo mucho de Tomás. Su olor, su forma de caminar segura, cuando se concentra en algo y está en su zona. Me gusta cuando me abraza fuerte después de un largo día.',
  Q22: 'La cercanía emocional la siento en los momentos de calma, cuando estamos acostados y nos contamos cosas del día. Pero esos momentos son cada vez más escasos. Muchas veces siento que vivo con un extraño amable.',
  Q23: 'La intimidad física se ha reducido mucho. Antes era espontánea y ahora es planeada o inexistente. Me da pena iniciar porque he sentido rechazo un par de veces y eso me marcó. No sé si él me desea todavía.',
  Q24: 'El deseo era intenso al principio. Ahora está adormecido. No muerto, pienso, pero dormido. Creo que si reconectamos emocionalmente, el deseo podría revivir.',
  Q25: 'Me siento cercana cuando cocinamos juntos, cuando paseamos al perro y conversamos, cuando me mira a los ojos sin necesidad de hablar. La presencia plena me conecta.',
  Q26: 'La distancia aparece cuando cada uno está en su celular, cuando él trabaja hasta tarde sin avisarme, cuando le cuento algo importante y me da respuestas monosilábicas.',
  Q27: 'Las decisiones grandes las intentamos tomar juntos pero a veces siento que él ya decidió por dentro y solo busca mi aprobación. Me gustaría que genuinamente escuchara mi opinión antes de decidir.',
  Q28: 'Siento que Tomás tiene más poder porque él es el que menos necesita emocionalmente. El que menos necesita, más poder tiene en la relación. Yo soy la que busca conexión y eso me pone en posición vulnerable.',
  Q29: 'Creo que Tomás necesita tranquilidad, rutina, que no haya drama. Valora que yo sea cariñosa pero creo que a veces siente que le pido demasiado emocionalmente.',
  Q30: 'Necesito presencia emocional. Necesito que esté AQUÍ, no solo físicamente sino emocionalmente. Necesito conversaciones profundas, abrazos largos, que me pregunte cómo me siento sin que yo tenga que pedirlo.',
  Q31: 'Esta relación significa mi hogar emocional. A pesar de todo, Tomás es donde quiero estar. Pero necesito que sea un hogar cálido, no solo un techo.',
  Q32: 'Me imagino casada con Tomás, con hijos, viajando juntos. Pero para llegar ahí necesitamos reconstruir la conexión emocional. Si no, imagino que nos iríamos apagando lentamente.',
  Q33: 'Me he sentido amada cuando Tomás me cuida estando enferma, cuando me defiende frente a otros, cuando me mira como lo hacía al principio. Me falta que me lo diga con palabras y con más frecuencia.',
  Q34: 'Me preocupa que estemos juntos por costumbre y no por elección real. Me preocupa que la distancia emocional se vuelva permanente. Me preocupa estar perdiendo los mejores años de mi vida en una relación tibia.',
  Q35: 'Lo que nos ha sostenido es un afecto genuino debajo de todo. Cuando logramos conectar, es hermoso. El humor también nos ha salvado muchas veces. Y la voluntad de seguir intentando.',
  Q36: 'Se ha vuelto muy rutinaria. Extraño la espontaneidad del principio. Él parece cómodo con la rutina y yo me siento atrapada en ella. Necesito más novedad para sentirme viva.',
  Q37: 'Él busca estabilidad y paz. Yo busco conexión profunda y pasión. No son cosas contrarias pero requieren esfuerzo para coexistir. Creo que ambos buscamos sentirnos vistos y valorados.',
  Q38: 'He descubierto que tengo mucho miedo al abandono emocional, más que al físico. Esta relación ha provocado que mis heridas de la infancia salgan a la superficie de formas que no esperaba.',
  Q39: 'Nuestra relación es única porque genuinamente nos queremos y nos admiramos. El fundamento está ahí. Lo que necesitamos es recordar cómo acceder a él.',
  Q40: 'Quiero que Tomás sepa que no lo quiero perfecto, lo quiero presente. Y que si hacemos este cuestionario juntos es porque creo que vale la pena pelear por nosotros.'
}

// Persona 3B: TOMÁS — 32 años, pareja de VALENTINA (segunda persona para LOS DOS)
const TOMAS_RESPONSES = {
  Q1: 'Tengo 32 años, trabajo en finanzas. Llevo 4 años con Valentina y vivimos juntos desde hace un año y medio. Ella insistió en hacer esto y la verdad no sé muy bien qué esperar.',
  Q2: 'Nos conocimos en una clase de cocina. Ella era muy expresiva y sonriente y me llamó la atención. Empezamos a salir y todo fluyó muy natural. El inicio fue muy bonito, lleno de planes y aventuras.',
  Q3: 'En este momento la relación la siento funcional pero algo desconectada. Sé que Val siente que me he alejado emocionalmente y tiene razón, pero no sé cómo cambiarlo. No es intencional.',
  Q4: 'Nuestra rutina es trabajar, cenar, dormir. Yo llego cansado del trabajo y a veces me cuesta estar presente. Val necesita más de mí emocionalmente y yo no siempre puedo dárselo. Los fines de semana intento pero no siempre lo logro.',
  Q5: 'Hemos construido una vida bonita. Un hogar que me gusta, un perro que adoro. Valentina ha sido una compañera increíble. Pero sé que últimamente no he sido el mejor compañero para ella.',
  Q6: 'Me atrajo su energía, su pasión por la vida. Yo soy más tranquilo y ella me hacía sentir vivo. Su sonrisa y su forma de ver el mundo me encantaban. Todavía lo hacen.',
  Q7: 'Yo demuestro amor haciendo cosas: arreglando la casa, cuidando las finanzas, resolviendo problemas prácticos. No soy bueno con las palabras y reconozco que Val necesita más de eso. Ella es muy expresiva con palabras y contacto físico.',
  Q8: 'Nuestro primer viaje juntos a la playa fue el momento más feliz. Cuando perdió a su abuela y yo la acompañé, sentí que realmente podía ser su apoyo. Pero la primera pelea fuerte me asustó porque yo no sé manejar emociones intensas.',
  Q9: 'Imaginaba un futuro tranquilo y feliz con ella. Una casa, quizás hijos. No me planteaba mucho los detalles, simplemente sentía que estaba con la persona correcta.',
  Q10: 'Val representaba para mí la vida que yo quería tener pero no sabía cómo crear. Ella tiene una capacidad de sentir y expresar que yo no tengo y eso me complementa.',
  Q11: 'Mi familia era estable pero fría. Mis padres siguen juntos pero nunca muestran afecto. Todo se hacía por obligación y sentido del deber. Las emociones estaban prohibidas. Mi papá nunca lloró ni dijo te quiero.',
  Q12: 'Aprendí que ser hombre es ser fuerte, que las emociones son debilidad, que hay que resolver todo con la cabeza. Que el amor se demuestra trabajando y proveyendo, no con palabras o abrazos.',
  Q13: 'Me reconozco en la frialdad de mi papá y eso me asusta. Cuando Val me pide más expresión emocional, algo se bloquea en mí. Es como si no tuviera el vocabulario para hablar de sentimientos.',
  Q14: 'Antes de Val tuve una relación de 2 años con Andrea que terminó porque ella decía que yo era un témpano de hielo emocionalmente. Fue doloroso escucharlo y creo que no lo procesé. Las relaciones anteriores eran casuales.',
  Q15: 'Necesito mucho espacio personal y tiempo solo para recargar. Val es más social y emocional y a veces su intensidad me abruma. No es que no la quiera, es que necesito procesar todo internamente antes de poder hablar.',
  Q16: 'No soy bueno en equipo emocional. Cuando algo está mal yo me cierro y trato de procesarlo solo. Val quiere hablar inmediatamente y eso me genera más presión. Es un ciclo que no sé romper.',
  Q17: 'Los conflictos empiezan porque ella siente que no estoy presente emocionalmente. Y tiene razón, a veces me desconecto sin darme cuenta. Pero cuando me lo reclama, me paralizo.',
  Q18: 'Me quedo callado. Me cierro completamente. Sé que eso la frustra más pero es mi reacción automática. Necesito tiempo para procesar y ella necesita respuesta inmediata. Es incompatible.',
  Q19: 'Val se pone emotiva, llora, habla mucho. Yo sé que está sufriendo pero en ese momento no sé qué hacer. Me siento incompetente emocionalmente y eso me avergüenza.',
  Q20: 'Después de un conflicto intento compensar con gestos prácticos. Le traigo algo, cocino su comida favorita. Es mi forma de decir lo siento sin usar palabras. Sé que no es suficiente.',
  Q21: 'Val sigue siendo muy atractiva para mí. Su cuerpo, su sonrisa, la forma en que se mueve cuando da clases de yoga. Pero el deseo se ha dormido un poco por la rutina y porque siento que hay mucha presión emocional.',
  Q22: 'La cercanía emocional la siento cuando estamos tranquilos, sin presión. Al pasear al perro, al cocinar juntos. Cuando no hay expectativa de que yo diga algo profundo, paradójicamente es cuando más me abro.',
  Q23: 'La intimidad física ha disminuido y sé que eso afecta a Val. No es falta de deseo sino que siento que hay una carga emocional en todo. Como si cada vez que tenemos intimidad debiera ser una reconexión épica.',
  Q24: 'El deseo fue muy intenso al principio. Ahora está menos presente pero cuando reconectamos genuinamente, vuelve con fuerza. Creo que el deseo para mí necesita que las cosas estén bien emocionalmente primero.',
  Q25: 'Me siento conectado cuando hacemos algo fun juntos sin presión. Cuando cocinamos, cuando paseamos, cuando viajamos. Las experiencias compartidas nos acercan más que las conversaciones profundas.',
  Q26: 'La distancia aparece cuando Val quiere hablar de sentimientos y yo no puedo. Cuando ella llora y yo no sé cómo reaccionar. Cuando siento que no soy suficiente emocionalmente para lo que ella necesita.',
  Q27: 'Tiendo a tomar decisiones rápidas y prácticas. A veces no consulto a Val como debería. Me ha costado aprender que las decisiones en pareja se toman juntos, no solo informando.',
  Q28: 'Creo que Val tiene más peso emocional en la relación. Sus emociones marcan el ritmo. Pero yo tengo más poder en decisiones prácticas. No es un equilibrio saludable, creo.',
  Q29: 'Val necesita presencia emocional, palabras, que yo la vea y le diga que la amo más seguido. Necesita que yo participe activamente en la relación, no que solo esté ahí.',
  Q30: 'Necesito paciencia, espacio para procesar, que no se interprete mi silencio como desamor. Necesito sentir que soy suficiente tal como soy aunque esté trabajando en mejorar.',
  Q31: 'Val es la persona más importante en mi vida. Esta relación me ha enseñado más sobre mí mismo que cualquier otra cosa. No quiero perderla por mi incapacidad de expresar lo que siento.',
  Q32: 'Quiero un futuro con Val. Casarnos, tener hijos, envejecer juntos. Lo quiero de verdad. Solo necesito encontrar la forma de que las palabras salgan de mi boca y no se queden en mi cabeza.',
  Q33: 'Me siento amado cuando Val me acepta en mis silencios, cuando me mira con amor a pesar de mis limitaciones emocionales, cuando me abraza sin esperar nada a cambio. Me falta sentir que soy suficiente.',
  Q34: 'Me preocupa perderla por no poder darle lo que necesita emocionalmente. Me preocupa ser como mi padre, un buen proveedor pero emocionalmente ausente. No quiero repetir eso.',
  Q35: 'Lo que nos ha sostenido es que genuinamente nos queremos. Cuando los demás se van y estamos solos, hay algo tibio y real entre nosotros. Ella es mi persona segura.',
  Q36: 'Yo me siento cómodo con la rutina pero entiendo que Val la encuentra asfixiante. Necesito hacer más esfuerzo por crear novedad y sorpresa. No es mi naturaleza pero puedo aprenderlo.',
  Q37: 'Val busca conexión profunda y ser vista emocionalmente. Yo busco paz y aceptación. Creo que ambos buscamos lo mismo de formas diferentes: sentirnos amados por quien realmente somos.',
  Q38: 'Esta relación me ha revelado que tengo mucho trabajo emocional por hacer. Que mi frialdad no es fortaleza sino miedo. Que puedo y debo aprender a ser más expresivo.',
  Q39: 'Lo que hace única nuestra relación es que nos elegimos cada día a pesar de nuestras diferencias. Ella es fuego y yo soy agua. Juntos podemos crear vapor o apagarnos. Depende de nosotros.',
  Q40: 'Quiero que Val sepa que aunque no lo diga suficiente, ella es lo mejor que me ha pasado. Y que este cuestionario es mi forma de demostrar que quiero intentar.'
}

// ═══════════════════════════════════════════════════════════════
// HELPERS
// ═══════════════════════════════════════════════════════════════

async function workerPost(endpoint, body) {
  const res = await fetch(`${WORKER_URL}${endpoint}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body)
  })
  const data = await res.json().catch(() => ({}))
  if (!res.ok) throw new Error(`Worker ${endpoint} error ${res.status}: ${JSON.stringify(data)}`)
  return data
}

async function workerGet(endpoint) {
  const res = await fetch(`${WORKER_URL}${endpoint}`)
  const data = await res.json().catch(() => ({}))
  if (!res.ok) throw new Error(`Worker GET ${endpoint} error ${res.status}: ${JSON.stringify(data)}`)
  return data
}

// Read SYSTEM_PROMPT + PART instructions from service file
const svcPath = path.join(__dirname, 'src', 'services', 'radiografiaPremiumService.js')
const svcContent = fs.readFileSync(svcPath, 'utf-8')

function extractConst(name) {
  // Extract template-literal style consts
  const regex = new RegExp(`const ${name} = \`([\\s\\S]*?)\``, 'm')
  const match = svcContent.match(regex)
  if (match) return match[1]
  // Try single-quote string
  const regex2 = new RegExp(`const ${name} = '([\\s\\S]*?)'`, 'm')
  const match2 = svcContent.match(regex2)
  return match2 ? match2[1] : null
}

const SYSTEM_PROMPT = extractConst('SYSTEM_PROMPT')
const PART1_INSTRUCTION = extractConst('PART1_INSTRUCTION')
const PART2_INSTRUCTION = extractConst('PART2_INSTRUCTION')
const PART3_INSTRUCTION = extractConst('PART3_INSTRUCTION')
const PART4_INSTRUCTION = extractConst('PART4_INSTRUCTION')
const CROSS_INSTRUCTION = extractConst('CROSS_INSTRUCTION')

if (!SYSTEM_PROMPT) { console.error('❌ No se pudo extraer SYSTEM_PROMPT de radiografiaPremiumService.js'); process.exit(1) }

// Build prompt exactly as frontend does
function buildPrompt(responses, questions, profileData, packageType) {
  let prompt = '## RESPUESTAS DEL CUESTIONARIO NARRATIVO — RADIOGRAFÍA DE PAREJA PREMIUM\n\n'
  if (packageType === 'descubre') {
    prompt += `### TIPO DE PAQUETE: INDIVIDUAL (Descifra tu forma de amar)\nEl usuario NO necesariamente tiene pareja actual. El enfoque principal es su PATRÓN DE AMOR.\n\n`
  } else if (packageType === 'losdos') {
    prompt += `### TIPO DE PAQUETE: PAREJA — LOS DOS (Reporte individual)\nEste es el reporte INDIVIDUAL de este participante dentro del paquete Los Dos.\n\n`
  }
  if (profileData?.nombre) {
    prompt += `### DATOS DEL USUARIO\n- Nombre: ${profileData.nombre}\n`
    if (profileData.edad) prompt += `- Edad: ${profileData.edad}\n`
    prompt += `\n(USA EL NOMBRE DEL USUARIO EN EL REPORTE para generar cercanía y rapport.)\n\n`
  }
  prompt += '(Cada respuesta fue dada verbalmente.)\n\n'
  // Group by block (simplified — just list all in order)
  for (const q of questions) {
    prompt += `**${q.id}. "${q.mainQuestion}"**\n`
    if (q.examples?.length) prompt += `Puntos clave: ${q.examples.join(' | ')}\n`
    const answer = responses[q.id] || ''
    prompt += answer ? `→ "${answer}"\n\n` : `→ (no respondió)\n\n`
  }
  prompt += `\nRealiza el análisis psicológico completo.\n`
  return prompt
}

// Simplified question list for prompt building
const QUESTIONS_SIMPLE = Q_IDS.map(id => ({
  id,
  block: 'Bloque',
  mainQuestion: `Pregunta ${id}`,
  examples: []
}))

// Call DeepSeek — one part
async function callDeepSeekPart(basePrompt, partInstruction, partName, maxTokens = 8192) {
  const maxRetries = 2
  for (let attempt = 1; attempt <= maxRetries; attempt++) {
    try {
      const controller = new AbortController()
      const timeout = setTimeout(() => controller.abort(), 300000)
      const res = await fetch(DEEPSEEK_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${DEEPSEEK_API_KEY}` },
        signal: controller.signal,
        body: JSON.stringify({
          model: 'deepseek-chat',
          messages: [
            { role: 'system', content: SYSTEM_PROMPT },
            { role: 'user', content: basePrompt + '\n\n' + partInstruction }
          ],
          temperature: 0.7,
          max_tokens: maxTokens,
          response_format: { type: 'json_object' }
        })
      })
      clearTimeout(timeout)
      if (!res.ok) {
        const err = await res.text()
        console.error(`  ❌ [${partName}] HTTP ${res.status} (intento ${attempt}): ${err.slice(0, 200)}`)
        if (attempt < maxRetries) { await new Promise(r => setTimeout(r, 5000)); continue }
        return null
      }
      const data = await res.json()
      const content = data.choices?.[0]?.message?.content
      if (!content) { console.error(`  ❌ [${partName}] respuesta vacía`); return null }
      const parsed = JSON.parse(content)
      console.log(`  ✅ [${partName}] completado (${(JSON.stringify(parsed).length / 1024).toFixed(0)} KB)`)
      return parsed
    } catch (e) {
      console.error(`  ❌ [${partName}] error: ${e.message}`)
      if (attempt < maxRetries) { await new Promise(r => setTimeout(r, 5000)); continue }
      return null
    }
  }
  return null
}

// Full 4-part parallel analysis
async function runFullAnalysis(responses, profileData, packageType) {
  const basePrompt = buildPrompt(responses, QUESTIONS_SIMPLE, profileData, packageType)
  console.log(`  📤 Prompt: ${(basePrompt.length / 1024).toFixed(1)} KB`)
  console.log(`  🚀 Lanzando 4 llamadas paralelas a DeepSeek...`)
  const t0 = Date.now()
  const [p1, p2, p3, p4] = await Promise.all([
    callDeepSeekPart(basePrompt, PART1_INSTRUCTION, 'Autoanálisis'),
    callDeepSeekPart(basePrompt, PART2_INSTRUCTION, 'Lecturas A'),
    callDeepSeekPart(basePrompt, PART3_INSTRUCTION, 'Lecturas B'),
    callDeepSeekPart(basePrompt, PART4_INSTRUCTION, 'Gráficas'),
  ])
  const elapsed = ((Date.now() - t0) / 1000).toFixed(1)
  console.log(`  ⏱️ 4 llamadas completadas en ${elapsed}s`)

  if (!p1?.autoanalisis_usuario) {
    console.error('  ❌ Part1 (autoanálisis) falló — análisis incompleto')
    return null
  }

  // Merge
  const merged = {
    ...(p1 || {}),
    ...(p2 ? { analisis_profundo: p2.analisis_profundo, lectura_psicoanalitica: p2.lectura_psicoanalitica } : {}),
    ...(p3 ? { dinamica_conflicto: p3.dinamica_conflicto, energia_vinculo: p3.energia_vinculo, direccion_probable: p3.direccion_probable, fortalezas: p3.fortalezas, riesgos: p3.riesgos, tabla_diagnostica: p3.tabla_diagnostica, sintesis_final: p3.sintesis_final } : {}),
    ...(p4 ? { temas_para_consulta: p4.temas_para_consulta, tecnicas_recomendadas: p4.tecnicas_recomendadas, libros_recomendados: p4.libros_recomendados, graficas_autoanalisis: p4.graficas_autoanalisis } : {}),
    lecturas_por_enfoque: { ...(p2?.lecturas_por_enfoque || {}), ...(p3?.lecturas_por_enfoque || {}) },
  }
  if (merged.dimensiones) {
    for (const k of Object.keys(merged.dimensiones)) merged.dimensiones[k] = Math.max(0, Math.min(100, Number(merged.dimensiones[k]) || 50))
  }
  const totalKB = (JSON.stringify(merged).length / 1024).toFixed(0)
  console.log(`  ✅ Análisis fusionado: ${totalKB} KB total`)

  // Validate sections
  const sections = ['autoanalisis_usuario', 'dimensiones', 'lecturas_por_enfoque', 'graficas_autoanalisis']
  for (const s of sections) {
    console.log(`    ${merged[s] ? '✅' : '❌'} ${s}`)
  }
  if (merged.lecturas_por_enfoque) {
    const authors = Object.keys(merged.lecturas_por_enfoque)
    console.log(`    📚 ${authors.length}/11 autores: ${authors.join(', ')}`)
  }

  return merged
}

// Cross-analysis for losdos
async function runCrossAnalysis(analysis1, analysis2, profile1, profile2) {
  const name1 = profile1?.nombre || 'Participante 1'
  const name2 = profile2?.nombre || 'Participante 2'
  let prompt = `## RADIOGRAFÍA CRUZADA — ${name1} y ${name2}\n\n`
  prompt += `Tienes ante ti los análisis INDIVIDUALES de dos personas que están en la MISMA relación.\n`
  prompt += `Tu tarea: cruzar ambas perspectivas para revelar la dinámica REAL de la pareja.\n\n`
  prompt += `### ANÁLISIS INDIVIDUAL DE ${name1.toUpperCase()}\n`
  prompt += `**Dimensiones:** ${JSON.stringify(analysis1.dimensiones || {})}\n`
  prompt += `**Diagnóstico:** ${JSON.stringify(analysis1.diagnostico || {})}\n`
  prompt += `**Resumen:** ${analysis1.resumen_relacion || ''}\n`
  prompt += `**Fortalezas:** ${JSON.stringify(analysis1.fortalezas || [])}\n`
  prompt += `**Riesgos:** ${JSON.stringify(analysis1.riesgos || [])}\n\n`
  if (analysis1.autoanalisis_usuario) {
    prompt += `**Autoanálisis:**\n`
    for (const [k, v] of Object.entries(analysis1.autoanalisis_usuario)) {
      if (typeof v === 'string') prompt += `- ${k}: ${v.slice(0, 400)}...\n`
    }
    prompt += '\n'
  }
  prompt += `### ANÁLISIS INDIVIDUAL DE ${name2.toUpperCase()}\n`
  prompt += `**Dimensiones:** ${JSON.stringify(analysis2.dimensiones || {})}\n`
  prompt += `**Diagnóstico:** ${JSON.stringify(analysis2.diagnostico || {})}\n`
  prompt += `**Resumen:** ${analysis2.resumen_relacion || ''}\n`
  prompt += `**Fortalezas:** ${JSON.stringify(analysis2.fortalezas || [])}\n`
  prompt += `**Riesgos:** ${JSON.stringify(analysis2.riesgos || [])}\n\n`
  if (analysis2.autoanalisis_usuario) {
    prompt += `**Autoanálisis:**\n`
    for (const [k, v] of Object.entries(analysis2.autoanalisis_usuario)) {
      if (typeof v === 'string') prompt += `- ${k}: ${v.slice(0, 400)}...\n`
    }
    prompt += '\n'
  }

  console.log(`  📤 Cross prompt: ${(prompt.length / 1024).toFixed(1)} KB`)
  console.log(`  🚀 Llamando DeepSeek para análisis cruzado...`)
  const t0 = Date.now()
  const result = await callDeepSeekPart(prompt, CROSS_INSTRUCTION, 'Cross-Analysis', 8192)
  console.log(`  ⏱️ Cross-analysis: ${((Date.now() - t0) / 1000).toFixed(1)}s`)

  if (result) {
    result._individual = {
      p1: { nombre: name1, dimensiones: analysis1.dimensiones },
      p2: { nombre: name2, dimensiones: analysis2.dimensiones },
    }
  }
  return result
}

function hr() { console.log('\n' + '═'.repeat(70) + '\n') }

// ═══════════════════════════════════════════════════════════════
// MAIN — Run 3 tests sequentially
// ═══════════════════════════════════════════════════════════════

async function main() {
  console.log(`\n🧪 TEST E2E — RADIOGRAFÍA DE PAREJA`)
  console.log(`📧 Email de prueba: ${TEST_EMAIL}`)
  console.log(`🤖 DeepSeek key: ${DEEPSEEK_API_KEY.slice(0, 8)}...`)
  console.log(`🌐 Worker: ${WORKER_URL}`)

  const results = { test1: null, test2: null, test3: null }

  // ═══════════════════════════════════════════════════════════════
  // TEST 1: DESCUBRE (solteros) — Lucía
  // ═══════════════════════════════════════════════════════════════
  hr()
  console.log('🔬 TEST 1: DESCUBRE (Solteros) — Lucía, 28 años')
  console.log('─'.repeat(50))

  try {
    // Step 1: Create token via Worker (simulates post-purchase flow)
    console.log('\n📌 Paso 1: Crear token de acceso...')
    const purchaseId = `test_descubre_${Date.now()}`
    const accessResult = await workerPost('/api/send-access-email', {
      purchaseId,
      type: 'descubre',
      emails: [TEST_EMAIL],
      tokens: []
    })
    const token1 = accessResult.tokens?.[0]
    console.log(`  ✅ Token creado: ${token1}`)
    console.log(`  📧 Email de acceso enviado a ${TEST_EMAIL}`)

    // Step 2: Run AI analysis
    console.log('\n📌 Paso 2: Análisis IA (DeepSeek, 4 llamadas paralelas)...')
    const profile1 = { nombre: 'Lucía', edad: '28' }
    const analysis1 = await runFullAnalysis(LUCIA_RESPONSES, profile1, 'descubre')

    if (!analysis1) {
      console.error('  ❌ Análisis falló — abortando test 1')
      results.test1 = { status: 'FAIL', error: 'AI analysis failed' }
    } else {
      // Step 3: Save to KV
      console.log('\n📌 Paso 3: Guardar análisis en Worker KV...')
      await workerPost('/api/save-analysis', { token: token1, analysis: analysis1 })
      console.log('  ✅ Análisis guardado')

      // Step 4: Send analysis-ready email
      console.log('\n📌 Paso 4: Enviar email "análisis listo"...')
      await workerPost('/api/send-analysis-email', { token: token1, type: 'descubre', emails: [TEST_EMAIL] })
      console.log('  ✅ Email de resultados enviado')

      // Step 5: Verify retrieval
      console.log('\n📌 Paso 5: Verificar que el análisis se puede recuperar...')
      const retrieved = await workerGet(`/api/get-analysis?token=${token1}`)
      console.log(`  ✅ Análisis recuperado OK (${(JSON.stringify(retrieved.analysis).length / 1024).toFixed(0)} KB)`)
      console.log(`  🔗 URL: https://luisvirrueta.com/radiografia-premium?token=${token1}&type=descubre&view=results`)

      results.test1 = { status: 'PASS', token: token1, analysisSize: JSON.stringify(analysis1).length }
    }
  } catch (e) {
    console.error(`  ❌ Test 1 error: ${e.message}`)
    results.test1 = { status: 'FAIL', error: e.message }
  }

  // ═══════════════════════════════════════════════════════════════
  // TEST 2: SOLO (individual con pareja) — Marcos
  // ═══════════════════════════════════════════════════════════════
  hr()
  console.log('🔬 TEST 2: SOLO (Individual con pareja) — Marcos, 34 años')
  console.log('─'.repeat(50))

  try {
    console.log('\n📌 Paso 1: Crear token de acceso...')
    const purchaseId = `test_solo_${Date.now()}`
    const accessResult = await workerPost('/api/send-access-email', {
      purchaseId,
      type: 'solo',
      emails: [TEST_EMAIL],
      tokens: []
    })
    const token2 = accessResult.tokens?.[0]
    console.log(`  ✅ Token creado: ${token2}`)
    console.log(`  📧 Email de acceso enviado`)

    console.log('\n📌 Paso 2: Análisis IA...')
    const profile2 = { nombre: 'Marcos', edad: '34', nombrePareja: 'Laura', edadPareja: '31' }
    const analysis2 = await runFullAnalysis(MARCOS_RESPONSES, profile2, 'solo')

    if (!analysis2) {
      results.test2 = { status: 'FAIL', error: 'AI analysis failed' }
    } else {
      console.log('\n📌 Paso 3: Guardar análisis...')
      await workerPost('/api/save-analysis', { token: token2, analysis: analysis2 })
      console.log('  ✅ Guardado')

      console.log('\n📌 Paso 4: Enviar email de resultados...')
      await workerPost('/api/send-analysis-email', { token: token2, type: 'solo', emails: [TEST_EMAIL] })
      console.log('  ✅ Email enviado')

      console.log('\n📌 Paso 5: Verificar recuperación...')
      const retrieved = await workerGet(`/api/get-analysis?token=${token2}`)
      console.log(`  ✅ OK (${(JSON.stringify(retrieved.analysis).length / 1024).toFixed(0)} KB)`)
      console.log(`  🔗 URL: https://luisvirrueta.com/radiografia-premium?token=${token2}&type=solo&view=results`)

      results.test2 = { status: 'PASS', token: token2, analysisSize: JSON.stringify(analysis2).length }
    }
  } catch (e) {
    console.error(`  ❌ Test 2 error: ${e.message}`)
    results.test2 = { status: 'FAIL', error: e.message }
  }

  // ═══════════════════════════════════════════════════════════════
  // TEST 3: LOS DOS (ambos) — Valentina + Tomás
  // ═══════════════════════════════════════════════════════════════
  hr()
  console.log('🔬 TEST 3: LOS DOS (Ambos) — Valentina y Tomás')
  console.log('─'.repeat(50))

  try {
    // Step 1: Create paired tokens
    console.log('\n📌 Paso 1: Crear token del comprador (Valentina)...')
    const purchaseId3 = `test_losdos_${Date.now()}`
    const buyerAccess = await workerPost('/api/send-access-email', {
      purchaseId: purchaseId3,
      type: 'losdos',
      emails: [TEST_EMAIL],
      tokens: []
    })
    const buyerToken = buyerAccess.tokens?.[0]
    console.log(`  ✅ Token Valentina: ${buyerToken}`)

    console.log('\n📌 Paso 1b: Crear token de pareja (Tomás) + vincular par...')
    const partnerAccess = await workerPost('/api/send-access-email', {
      purchaseId: purchaseId3,
      type: 'losdos',
      emails: [TEST_EMAIL],
      tokens: [],
      buyerToken,
      buyerEmail: TEST_EMAIL
    })
    const partnerToken = partnerAccess.tokens?.[0]
    console.log(`  ✅ Token Tomás: ${partnerToken}`)
    console.log(`  📧 Emails de acceso enviados`)

    // Step 2a: Analysis for Valentina
    console.log('\n📌 Paso 2a: Análisis IA — Valentina...')
    const profileVal = { nombre: 'Valentina', edad: '30', nombrePareja: 'Tomás', edadPareja: '32' }
    const analysisVal = await runFullAnalysis(VALENTINA_RESPONSES, profileVal, 'losdos')

    if (!analysisVal) {
      results.test3 = { status: 'FAIL', error: 'Valentina AI failed' }
    } else {
      console.log('\n📌 Paso 2a-save: Guardar análisis Valentina + marcar como terminado...')
      await workerPost('/api/save-analysis', { token: buyerToken, analysis: analysisVal })
      await workerPost('/api/mark-partner-done', { token: buyerToken })
      await workerPost('/api/send-analysis-email', { token: buyerToken, type: 'losdos', emails: [TEST_EMAIL] })
      console.log('  ✅ Valentina: guardado, marcado, email enviado')

      // Check cross status (should say other not done)
      const status1 = await workerPost('/api/check-cross-status', { token: buyerToken })
      console.log(`  📊 Cross status: paired=${status1.paired}, bothDone=${status1.bothDone}`)

      // Step 2b: Analysis for Tomás
      console.log('\n📌 Paso 2b: Análisis IA — Tomás...')
      const profileTom = { nombre: 'Tomás', edad: '32', nombrePareja: 'Valentina', edadPareja: '30' }
      const analysisTom = await runFullAnalysis(TOMAS_RESPONSES, profileTom, 'losdos')

      if (!analysisTom) {
        results.test3 = { status: 'PARTIAL', error: 'Tomás AI failed' }
      } else {
        console.log('\n📌 Paso 2b-save: Guardar análisis Tomás + marcar como terminado...')
        await workerPost('/api/save-analysis', { token: partnerToken, analysis: analysisTom })
        await workerPost('/api/mark-partner-done', { token: partnerToken })
        await workerPost('/api/send-analysis-email', { token: partnerToken, type: 'losdos', emails: [TEST_EMAIL] })
        console.log('  ✅ Tomás: guardado, marcado, email enviado')

        // Check cross status (should say both done now)
        const status2 = await workerPost('/api/check-cross-status', { token: partnerToken })
        console.log(`  📊 Cross status: paired=${status2.paired}, bothDone=${status2.bothDone}, pairId=${status2.pairId}`)

        if (status2.bothDone && status2.otherAnalysis) {
          // Step 3: Cross-analysis
          console.log('\n📌 Paso 3: ANÁLISIS CRUZADO (ambos terminaron)...')
          const crossResult = await runCrossAnalysis(analysisTom, status2.otherAnalysis, profileTom, profileVal)

          if (crossResult && status2.pairId) {
            console.log(`  ✅ Cross-analysis completado (${(JSON.stringify(crossResult).length / 1024).toFixed(0)} KB)`)

            // Validate cross-analysis sections
            const crossSections = ['apertura', 'resumen_cruzado', 'dimensiones_cruzadas', 'puntos_ciegos',
              'dinamica_real', 'convergencias', 'divergencias', 'lecturas_cruzadas', 'mensaje_para_ambos', 'pronostico_relacional']
            for (const s of crossSections) {
              console.log(`    ${crossResult[s] ? '✅' : '❌'} ${s}`)
            }

            console.log('\n📌 Paso 4: Guardar análisis cruzado + enviar email...')
            await workerPost('/api/save-cross-analysis', { token: partnerToken, pairId: status2.pairId, analysis: crossResult })
            await workerPost('/api/send-cross-analysis-email', { pairId: status2.pairId, token: partnerToken })
            console.log('  ✅ Análisis cruzado guardado y emails cruzados enviados')

            // Verify cross retrieval
            const crossRetrieved = await workerGet(`/api/get-cross-analysis?pairId=${status2.pairId}&token=${partnerToken}`)
            console.log(`  ✅ Cross retrievable: ${crossRetrieved.ok ? 'OK' : 'FAIL'}`)

            console.log(`\n  🔗 URL Valentina: https://luisvirrueta.com/radiografia-premium?token=${buyerToken}&type=losdos&view=results&cross=${status2.pairId}`)
            console.log(`  🔗 URL Tomás:     https://luisvirrueta.com/radiografia-premium?token=${partnerToken}&type=losdos&view=results&cross=${status2.pairId}`)

            results.test3 = { status: 'PASS', buyerToken, partnerToken, pairId: status2.pairId, crossSize: JSON.stringify(crossResult).length }
          } else {
            console.error('  ❌ Cross-analysis falló')
            results.test3 = { status: 'PARTIAL', error: 'Cross-analysis generation failed' }
          }
        } else {
          console.error('  ❌ Cross status indica que no ambos terminaron')
          results.test3 = { status: 'PARTIAL', error: 'Cross status mismatch' }
        }
      }
    }
  } catch (e) {
    console.error(`  ❌ Test 3 error: ${e.message}`)
    results.test3 = { status: 'FAIL', error: e.message }
  }

  // ═══════════════════════════════════════════════════════════════
  // RESUMEN FINAL
  // ═══════════════════════════════════════════════════════════════
  hr()
  console.log('📊 RESUMEN FINAL')
  console.log('─'.repeat(50))
  console.log(`  Test 1 (Descubre):  ${results.test1?.status || 'NOT RUN'} ${results.test1?.error ? '— ' + results.test1.error : ''}`)
  console.log(`  Test 2 (Solo):      ${results.test2?.status || 'NOT RUN'} ${results.test2?.error ? '— ' + results.test2.error : ''}`)
  console.log(`  Test 3 (Los Dos):   ${results.test3?.status || 'NOT RUN'} ${results.test3?.error ? '— ' + results.test3.error : ''}`)
  console.log()
  const allPass = ['test1', 'test2', 'test3'].every(k => results[k]?.status === 'PASS')
  console.log(allPass ? '🎉 TODOS LOS TESTS PASARON' : '⚠️ ALGUNOS TESTS TIENEN PROBLEMAS')
  console.log()
  console.log(`📧 Revisa tu correo ${TEST_EMAIL} — deberían llegar:`)
  console.log('   • 3 emails de "acceso al cuestionario" (1 por paquete)')
  console.log('   • 3 emails de "análisis listo" (con link a resultados)')
  console.log('   • 1 email de "análisis cruzado listo" (losdos)')
  console.log()
}

main().catch(e => { console.error('Fatal:', e); process.exit(1) })
