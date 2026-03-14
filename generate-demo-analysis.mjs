/**
 * Genera un análisis demo para ventas llamando a DeepSeek con un perfil clásico (Sofía y Mateo).
 * Ejecutar: node generate-demo-analysis.mjs
 * Resultado: src/data/cachedDemoAnalysis.js
 */
import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'

const __dirname = path.dirname(fileURLToPath(import.meta.url))

// ── Leer API key del .env ──
const envPath = path.join(__dirname, '.env')
const envContent = fs.readFileSync(envPath, 'utf-8')
const apiKeyMatch = envContent.match(/VITE_DEEPSEEK_API_KEY=(.+)/)
if (!apiKeyMatch) { console.error('No se encontró VITE_DEEPSEEK_API_KEY en .env'); process.exit(1) }
const API_KEY = apiKeyMatch[1].trim()

// ── Extraer SYSTEM_PROMPT del servicio ──
const servicePath = path.join(__dirname, 'src/services/radiografiaPremiumService.js')
const serviceContent = fs.readFileSync(servicePath, 'utf-8')
// Find opening backtick after "const SYSTEM_PROMPT = " and closing backtick before "function buildPrompt"
const startMarker = "const SYSTEM_PROMPT = `"
const startIdx = serviceContent.indexOf(startMarker)
if (startIdx === -1) { console.error('No se encontró inicio de SYSTEM_PROMPT'); process.exit(1) }
const contentStart = startIdx + startMarker.length
// Find the closing backtick of SYSTEM_PROMPT — search backwards from "function buildPrompt"
const buildPromptIdx = serviceContent.indexOf('function buildPrompt')
if (buildPromptIdx === -1) { console.error('No se encontró function buildPrompt'); process.exit(1) }
// Search backwards for backtick
let endIdx = buildPromptIdx
while (endIdx > 0 && serviceContent[endIdx] !== '`') endIdx--
if (endIdx <= contentStart) { console.error('No se encontró cierre de backtick'); process.exit(1) }
const SYSTEM_PROMPT = serviceContent.substring(contentStart, endIdx)
console.log(`   SYSTEM_PROMPT extraído: ${SYSTEM_PROMPT.length} caracteres`)

// ── Perfil demo: Sofía (31) y Mateo (34), 6 años juntos ──
const PROFILE = { nombre: 'Sofía', edad: '31', nombrePareja: 'Mateo', edadPareja: '34' }

// ── 40 respuestas demo para una relación clásica ──
const DEMO = {
  Q1: 'Me llamo Sofía, tengo 31 años, soy maestra de primaria. Llevo 6 años con Mateo, nos casamos hace 2. Estoy en un punto donde quiero sentir que mi relación vuelve a tener chispa, porque la rutina nos ha absorbido un poco.',
  Q2: 'Nos conocimos en la universidad, en un grupo de estudio. Mateo era el callado del grupo y a mí me llamó la atención su tranquilidad. Empezamos siendo amigos y después de un año de amistad se animó a invitarme a salir. Fue muy romántico al principio.',
  Q3: 'La relación está estable pero un poco plana. No tenemos grandes peleas pero tampoco grandes emociones. Es como que entramos en piloto automático. Los dos trabajamos mucho y cuando llegamos a casa estamos cansados.',
  Q4: 'En el día a día cada uno tiene su rutina. Él llega del trabajo y se pone a ver videos o jugar videojuegos. Yo corrijo tareas o preparo clases. Cenamos juntos pero a veces en silencio viendo el celular. Los fines de semana a veces salimos, a veces no.',
  Q5: 'Hemos construido una casa linda, estabilidad económica. También hemos aprendido a respetarnos mucho. Me siento orgullosa de que somos un buen equipo en lo práctico.',
  Q6: 'Me enamoré de su calma. Yo soy una persona muy intensa y emocional, y él me equilibraba. También me gustaba que era responsable y confiable. Con él sentía seguridad.',
  Q7: 'Yo demuestro amor haciéndole comida rica, organizando la casa, planeando salidas. Soy muy de actos de servicio. Mateo es más de presencia física, le gusta estar cerca aunque no hablemos. A mí me gustaría que me dijera más cosas bonitas, que fuera más expresivo con palabras. A veces siento que lo tengo que adivinar todo.',
  Q8: 'Nuestro primer aniversario fue increíble, hizo una cena sorpresa. Cuando nos fuimos a vivir juntos fue un momento muy lindo. La boda fue hermosa. Y hubo un momento difícil cuando perdí un embarazo hace un año, eso nos pegó fuerte a los dos.',
  Q9: 'Al inicio veía una familia grande, viajes, muchas aventuras juntos. Veía a Mateo como mi compañero de por vida con el que iba a crecer constantemente.',
  Q10: 'Mateo representaba estabilidad para mí. Vengo de una familia donde todo era caos emocional y él era como mi ancla. Me hacía sentir segura y en paz.',
  Q11: 'Mis papás se divorciaron cuando tenía 10. Mi mamá era muy dramática, todo era un escándalo. Mi papá era ausente, se fue y casi no lo veía. Mi mamá rehizo su vida con otro señor que era buena persona pero distante.',
  Q12: 'Aprendí que las relaciones son frágiles, que la gente se puede ir. Mi mamá siempre decía que los hombres te abandonan. También aprendí a ser independiente demasiado joven, a no depender de nadie.',
  Q13: 'Sí, me doy cuenta de que a veces pruebo a Mateo para ver si se va a quedar. Hago cosas como alejarme un poco para ver si me busca. Es como que necesito confirmación constante de que no se va a ir.',
  Q14: 'Antes de Mateo tuve una relación de 2 años con un chico muy apasionado pero inestable. Era intenso, emocional, habían muchas peleas pero también muchos momentos increíbles. Terminó mal, él me fue infiel.',
  Q15: 'Siento que puedo ser bastante yo misma, pero hay una parte de mí que la tengo guardada. Me gusta el arte, la pintura, y cuando éramos novios pintaba mucho. Ya casi no lo hago. No es que Mateo me lo prohíba, pero siento que no le interesa esa parte de mí y como que la fui dejando.',
  Q16: 'Cuando las cosas se ponen tensas, Mateo se cierra completamente. Se queda callado, como una pared. Yo intento hablar y él se va a otra habitación. Eso me desespera muchísimo. Cuando está realmente mal, yo sí estoy ahí para él, pero me cuesta que él esté para mí emocionalmente.',
  Q17: 'Las discusiones empiezan porque yo siento que no me presta atención. Le digo algo y me responde con monosílabos. Entonces yo insisto más y él se cierra más. Es un círculo vicioso.',
  Q18: 'Yo tiendo a subir el volumen. Me frustro, le digo que no me escucha, que no le importo. A veces digo cosas que no siento en el calor del momento.',
  Q19: 'Mateo se calla, se retrae. A veces sale de la habitación sin decir nada. Eso me hace sentir invisible. Después de un rato vuelve como si nada y yo todavía estoy molesta.',
  Q20: 'Lo que suele pasar es que después de unas horas yo ya me calmé y soy la que va a buscarlo. Le digo perdón por gritarte y él dice no te preocupes y ya. Pero nunca hablamos del tema real.',
  Q21: 'Me sigue pareciendo muy atractivo, especialmente cuando lo veo de buen humor o cuando se arregla para salir. Pero lo que más me atrae es cuando comparte algo vulnerable, como sus miedos o algo importante del trabajo.',
  Q22: 'Los momentos de mayor conexión son cuando viajamos solos, cuando cocinamos juntos los domingos, o cuando de repente nos quedamos platicando hasta tarde como antes.',
  Q23: 'La intimidad física ha bajado bastante. Antes era varias veces por semana, ahora es cada dos o tres semanas. Ya no es tan espontánea, a veces se siente como un trámite.',
  Q24: 'Al inicio el deseo era muy alto, constante. Ahora siento que yo tengo más deseo que él y eso me hace sentir insegura. Me pregunto si ya no le atraigo.',
  Q25: 'Viajar juntos nos reconecta totalmente. También cuando hacemos algo nuevo, como probar un restaurante o ir a un evento. La novedad nos acerca.',
  Q26: 'La distancia aparece en la rutina diaria. Cuando los dos estamos cansados y cada uno en su pantalla. O cuando intentamos hablar de algo importante y él se cierra.',
  Q27: 'Las decisiones grandes las platicamos pero siento que yo soy la que siempre tiene que iniciar la conversación. Si no lo empujo, él se quedaría sin decidir nada.',
  Q28: 'Siento que yo llevo el peso emocional de la relación. Yo soy la que organiza, la que recuerda citas, la que inicia planes. A veces me siento como su mamá coordinando todo. Me gustaría que él tomara más iniciativa, que me sorprendiera.',
  Q29: 'Creo que para Mateo es importante sentirse en paz, sin drama. Él necesita su espacio, su tiempo solo. Y creo que necesita sentir que lo admiro y que confío en él.',
  Q30: 'Para mí lo más importante es sentirme valorada, que sepa que me esfuerzo. Necesito palabras de afirmación, que me diga que le gusto, que soy buena esposa. Y necesito más aventura, salir de la rutina.',
  Q31: 'La relación es central en mi vida. Es mi base. Pero a veces siento que le estoy dando todo y recibiendo migajas emocionales.',
  Q32: 'Si logramos mejorar la comunicación, creo que podemos ser una pareja increíble. Me gustaría tener hijos pronto, tener una familia. Pero necesito sentirme más conectada emocionalmente antes.',
  Q33: 'Me siento amada cuando Mateo me abraza espontáneamente, o cuando me dedica tiempo real sin celular. Me gustaría que me dijera más seguido que me quiere, que le gusta estar conmigo. Antes me dejaba notas en la lonchera y ya no lo hace.',
  Q34: 'A veces me pregunto si esto es todo lo que hay. Si así se siente después de 6 años. Me da miedo que nos estemos conformando.',
  Q35: 'Lo que nos ha mantenido es el respeto, la confianza y que los dos estamos comprometidos con estar juntos. Nunca nos hemos faltado al respeto de formas graves.',
  Q36: 'La rutina nos ha comido. Todo es predecible. Sé exactamente qué va a hacer Mateo cada día y él sabe lo mismo de mí. Extraño la emoción de no saber qué iba a pasar. Hemos intentado noches de cita pero siempre terminamos en el mismo restaurante.',
  Q37: 'Creo que los dos buscamos compañerismo y estabilidad. Pero yo además busco pasión y conexión emocional profunda. Y a veces siento que eso no está.',
  Q38: 'He descubierto que tengo mucho miedo al abandono. Viene de la partida de mi papá. También que soy más dependiente emocionalmente de lo que quisiera admitir.',
  Q39: 'Lo que hace única nuestra relación es la confianza absoluta que tenemos. Mateo es la persona más honesta que conozco. Y hay un cariño muy genuino, muy real, que no es de película pero es sólido.',
  Q40: 'Creo que esta radiografía es justo lo que necesitamos. Quiero entender qué nos está pasando para poder actuar antes de que la distancia crezca más.'
}

// ── Construir prompt igual que en la app ──
function buildPrompt() {
  let prompt = '## RESPUESTAS DEL CUESTIONARIO NARRATIVO — RADIOGRAFÍA DE PAREJA PREMIUM\n\n'
  prompt += `### DATOS DEL USUARIO\n`
  prompt += `- Nombre: ${PROFILE.nombre}\n`
  prompt += `- Edad: ${PROFILE.edad}\n`
  prompt += `- Nombre de pareja: ${PROFILE.nombrePareja}\n`
  prompt += `- Edad de pareja: ${PROFILE.edadPareja}\n`
  prompt += `\n(USA EL NOMBRE DEL USUARIO EN EL REPORTE para generar cercanía y rapport.)\n\n`
  prompt += '(Cada respuesta fue dada verbalmente — la persona habló con libertad, sin filtro escrito.)\n\n'

  // Agregar respuestas
  for (let i = 1; i <= 40; i++) {
    const qId = `Q${i}`
    prompt += `**${qId}.**\n→ "${DEMO[qId]}"\n\n`
  }

  prompt += `\nRealiza el análisis psicológico completo siguiendo las 6 fases del sistema.
Devuelve el resultado en el formato JSON exacto especificado en tus instrucciones del sistema.\n`

  return prompt
}

// ── Llamar a DeepSeek ──
async function callDeepSeek() {
  console.log('🚀 Llamando a DeepSeek API para generar demo de Sofía y Mateo...')
  console.log(`   Perfil: ${PROFILE.nombre} (${PROFILE.edad}) y ${PROFILE.nombrePareja} (${PROFILE.edadPareja})`)
  console.log('   Esto puede tomar 60-120 segundos...\n')

  const startTime = Date.now()
  const userPrompt = buildPrompt()
  console.log(`   Prompt construido: ${userPrompt.length} caracteres`)
  console.log(`   System prompt: ${SYSTEM_PROMPT.length} caracteres`)

  let response
  try {
    const controller = new AbortController()
    const timeout = setTimeout(() => controller.abort(), 300000) // 5 min timeout
    response = await fetch('https://api.deepseek.com/chat/completions', {
      method: 'POST',
      signal: controller.signal,
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${API_KEY}`
      },
      body: JSON.stringify({
        model: 'deepseek-chat',
        messages: [
          { role: 'system', content: SYSTEM_PROMPT },
          { role: 'user', content: userPrompt }
        ],
        temperature: 0.7,
        max_tokens: 8192,
        response_format: { type: 'json_object' }
      })
    })
    clearTimeout(timeout)
  } catch (fetchErr) {
    console.error('❌ Error en fetch:', fetchErr.message)
    throw fetchErr
  }

  console.log(`   HTTP Status: ${response.status} ${response.statusText}`)

  const responseText = await response.text()
  console.log(`   Response text length: ${responseText.length} chars`)

  if (!response.ok) {
    console.error(`❌ API error body: ${responseText.substring(0, 500)}`)
    throw new Error(`API error ${response.status}: ${responseText}`)
  }

  let data
  try {
    data = JSON.parse(responseText)
  } catch (jsonErr) {
    console.error('❌ Error parsing response JSON:', jsonErr.message)
    console.error('   First 500 chars:', responseText.substring(0, 500))
    throw jsonErr
  }

  const elapsed = ((Date.now() - startTime) / 1000).toFixed(1)
  const usage = data.usage

  console.log(`✅ Respuesta recibida en ${elapsed}s`)
  if (usage) {
    console.log(`   Tokens: prompt=${usage.prompt_tokens}, completion=${usage.completion_tokens}, total=${usage.total_tokens}`)
    const cost = (usage.prompt_tokens * 0.14 / 1e6) + (usage.completion_tokens * 0.28 / 1e6)
    console.log(`   Costo estimado: $${cost.toFixed(4)} USD`)
  }

  const content = data.choices?.[0]?.message?.content
  if (!content) {
    console.error('❌ Respuesta vacía. Data:', JSON.stringify(data).substring(0, 500))
    throw new Error('Respuesta vacía')
  }

  console.log(`   Content length: ${content.length} chars`)
  
  let parsed
  try {
    parsed = JSON.parse(content)
  } catch (parseErr) {
    console.error('❌ Error parsing content JSON:', parseErr.message)
    console.error('   First 500 chars:', content.substring(0, 500))
    throw parseErr
  }

  return parsed
}

// ── Main ──
async function main() {
  try {
    const analysis = await callDeepSeek()

    // Validar campos esenciales
    if (!analysis.autoanalisis_usuario) console.warn('⚠️  Falta autoanalisis_usuario')
    if (!analysis.lecturas_por_enfoque) console.warn('⚠️  Falta lecturas_por_enfoque')

    // Guardar como módulo JS
    const outputPath = path.join(__dirname, 'src/data/cachedDemoAnalysis.js')
    const jsContent = `// Análisis demo generado por DeepSeek para Sofía (31) y Mateo (34)
// Generado el ${new Date().toISOString().split('T')[0]}
// Este análisis se usa para el botón "Demo" en herramientas de desarrollo

export const CACHED_DEMO_ANALYSIS = ${JSON.stringify(analysis, null, 2)}
`
    fs.writeFileSync(outputPath, jsContent, 'utf-8')
    console.log(`\n💾 Guardado en: ${outputPath}`)
    console.log(`   Tamaño: ${(Buffer.byteLength(jsContent) / 1024).toFixed(1)} KB`)
    console.log('\n✅ Demo listo. Importa con:')
    console.log("   import { CACHED_DEMO_ANALYSIS } from '../data/cachedDemoAnalysis'")

  } catch (err) {
    console.error('\n❌ Error:', err.message)
    process.exit(1)
  }
}

main()
