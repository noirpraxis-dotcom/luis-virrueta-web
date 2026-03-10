// Script para generar los 44 audios con voz MASCULINA (Daniel — deep, warm male)
// Usa ElevenLabs API con eleven_multilingual_v2
// Se ejecuta UNA VEZ y los MP3 se guardan como archivos estáticos en public/audio/diagnostico/male/

const fs = require('fs')
const path = require('path')

const API_KEY = 'sk_77f6a31d112e8138e7d05a41f45466a6e72f556097aba8a7'
const VOICE_ID = 'onwK4e9ZLuTAKqWW03F9' // Daniel — deep, warm male voice
const MODEL = 'eleven_multilingual_v2'
const OUTPUT_DIR = path.join(__dirname, 'public', 'audio', 'diagnostico', 'male')

const QUESTIONS = [
  { id: 'Q0', text: 'Antes de empezar, cuéntame: ¿cómo te llamas, cuántos años tienes, cuánto tiempo llevan juntos como pareja, y en una frase, cómo describirías tu relación hoy?' },
  { id: 'Q1', text: '¿Cómo comenzó tu relación? Cuéntame cómo se conocieron y cómo fueron esos primeros momentos importantes.' },
  { id: 'Q2', text: 'Si tuvieras que contar la historia de tu relación como una película o un relato corto, ¿cómo sería? ¿En qué parte de la historia están ahora?' },
  { id: 'Q3', text: 'Mirando hacia atrás desde el inicio hasta hoy, ¿qué momentos consideras los puntos clave que cambiaron la relación — para bien o para mal?' },
  { id: 'Q4', text: 'Piensa en un momento reciente en el que hayas sentido admiración o respeto por tu pareja. Describe qué ocurrió y por qué ese momento fue significativo para ti.' },
  { id: 'Q5', text: 'De todas las cualidades de tu pareja, ¿cuáles valoras más profundamente? No lo que hace, sino cómo es como persona. Cuéntame por qué esas cualidades son importantes para ti.' },
  { id: 'Q6', text: '¿En qué momentos o situaciones sientes que te sientes especialmente orgulloso u orgullosa de tu pareja? Describe alguno.' },
  { id: 'Q7', text: 'Cuando sientes que tu pareja está distante o menos conectada contigo — ya sea porque está ocupada, fría o simplemente no responde como esperas — ¿qué emociones aparecen dentro de ti y qué es lo primero que sueles hacer?' },
  { id: 'Q8', text: 'Cuando tú necesitas cercanía emocional — sentirte acompañado, escuchado o contenido — ¿cómo sueles buscarla dentro de la relación? ¿La pides directamente o haces algo para que suceda?' },
  { id: 'Q9', text: 'Si la relación terminara por completo, ¿qué es lo que más sentirías que pierdes? No hablo de cosas prácticas, sino emocionalmente — ¿qué se iría contigo?' },
  { id: 'Q10', text: 'Describe un momento reciente en el que hayas sentido una conexión emocional profunda con tu pareja. ¿Qué estaban haciendo y cómo se sintió por dentro?' },
  { id: 'Q11', text: '¿Qué tipo de situaciones o momentos hacen que te sientas emocionalmente más cerca de tu pareja? No lo general — piensa en algo específico que haya pasado.' },
  { id: 'Q12', text: '¿Hay momentos en los que te sientes emocionalmente solo o sola dentro de la relación, aunque tu pareja esté ahí presente? Cuéntame cómo es eso para ti.' },
  { id: 'Q13', text: 'Describe cómo suele comenzar una discusión entre ustedes. ¿Quién dice qué primero, cómo escala, y cuál es el patrón que se repite?' },
  { id: 'Q14', text: '¿Qué ocurre normalmente durante esas discusiones? ¿Cómo reaccionas tú, cómo reacciona tu pareja, y cómo suele terminar la cosa?' },
  { id: 'Q15', text: 'Después de un conflicto fuerte, ¿cómo se reconstruye la relación entre ustedes? ¿Quién da el primer paso, cuánto tardan, y cómo se siente ese proceso de reconexión?' },
  { id: 'Q16', text: '¿Qué partes de ti siente tu pareja que realmente conoce bien? Y por otro lado, ¿hay cosas importantes de ti que tu pareja no sabe o no entiende del todo?' },
  { id: 'Q17', text: '¿Qué partes de tu mundo emocional te cuesta compartir con tu pareja? ¿Hay temas, sentimientos o pensamientos que prefieres no mostrar?' },
  { id: 'Q18', text: 'Describe un momento en el que te hayas sentido profundamente comprendido o comprendida por tu pareja. ¿Qué pasó y qué significó eso para ti?' },
  { id: 'Q19', text: '¿Qué fue lo que inicialmente despertó tu atracción hacia tu pareja? No solo lo físico — ¿qué te enganchó emocionalmente de esa persona?' },
  { id: 'Q20', text: '¿Cómo describirías hoy el deseo y la atracción entre ustedes? ¿Ha cambiado desde el inicio de la relación? ¿En qué sentido?' },
  { id: 'Q21', text: '¿Qué cosas ayudan — o ayudarían — a mantener viva la chispa, el deseo y la atracción en la relación? ¿Qué falta o qué les funciona?' },
  { id: 'Q22', text: 'Si miras tu historia amorosa pasada — relaciones anteriores o incluso la forma en que creciste — ¿ves patrones que se repiten también en esta relación?' },
  { id: 'Q23', text: '¿Hay algo que se repite una y otra vez en los conflictos de tu relación? Un tema, una reacción, una dinámica que siempre vuelve, aunque cambien las circunstancias.' },
  { id: 'Q24', text: 'En los momentos más difíciles de la relación, ¿qué rol sientes que sueles ocupar? ¿Eres quien busca solucionar, quien se retira, quien explota, quien calla, quien cuida al otro?' },
  { id: 'Q25', text: '¿Qué aspectos de tu identidad personal — quién eres tú como individuo — sientes que es importante mantener dentro de la relación, aunque a tu pareja no siempre le guste o lo entienda?' },
  { id: 'Q26', text: '¿En qué momentos sientes que necesitas más espacio personal dentro de la relación? ¿Cómo reacciona tu pareja cuando pides ese espacio o cuando te alejas un poco?' },
  { id: 'Q27', text: '¿Qué tan fácil o difícil es para ti mantener tu propia independencia emocional dentro de la relación? Es decir, estar bien contigo mismo o misma sin que eso dependa de cómo esté tu pareja.' },
  { id: 'Q28', text: '¿Qué cosas concretas hace tu pareja que te hacen sentir amado, valorado o cuidado? Piensa en acciones específicas — no conceptos generales.' },
  { id: 'Q29', text: '¿Cómo sueles tú expresar cariño o amor hacia tu pareja? ¿De qué formas le demuestras que te importa en el día a día?' },
  { id: 'Q30', text: 'Cuando uno de los dos está emocionalmente alterado — enojado, ansioso, triste — ¿cómo suele reaccionar el otro? ¿Se acerca para calmar, se aleja, intenta resolver, se engancha en la emoción?' },
  { id: 'Q31', text: '¿Qué cosas ayudan a que la relación vuelva a sentirse estable y segura después de un momento difícil o una crisis emocional entre ustedes?' },
  { id: 'Q32', text: 'Si piensas en tu relación en tres dimensiones — la pasión física, la cercanía emocional y el compromiso a largo plazo — ¿cuál de las tres sientes que está más viva hoy y cuál sientes que se ha ido apagando?' },
  { id: 'Q33', text: '¿Cuál de estas tres dimensiones — pasión, cercanía emocional o compromiso — sientes que tu pareja vive de forma distinta a ti? ¿En cuál están más desalineados?' },
  { id: 'Q34', text: '¿Qué sensaciones físicas notas cuando estás cerca de tu pareja? ¿Calma, excitación, tensión, indiferencia, algo más? ¿Han cambiado esas sensaciones con el tiempo?' },
  { id: 'Q35', text: '¿Hay momentos en los que sientes una necesidad casi física de estar con tu pareja — como una urgencia de cercanía, de tocarla, de estar juntos — o eso ya no te pasa como antes?' },
  { id: 'Q36', text: 'Cuando no sabes dónde está tu pareja, no te contesta el teléfono o tarda mucho en responder, ¿qué es lo primero que sientes y qué haces? Sé honesto o honesta.' },
  { id: 'Q37', text: 'Cuando tu pareja quiere más cercanía, más tiempo juntos o más contacto emocional del que tú necesitas en ese momento, ¿cómo reaccionas por dentro y qué haces?' },
  { id: 'Q38', text: 'Si tuvieras que ponerle una calificación del 1 al 10 a qué tan satisfecho o satisfecha te sientes hoy con tu relación, ¿cuál sería? Y sobre todo: ¿por qué esa cifra y no una más alta?' },
  { id: 'Q39', text: '¿Qué esfuerzos activos haces tú para cuidar la relación en el día a día? Y honestamente, ¿sientes que tu pareja hace lo mismo o hay un desequilibrio?' },
  { id: 'Q40', text: '¿Cómo imaginas tu relación dentro de cinco años si todo sigue como está ahora? ¿Y cómo la imaginas si las cosas mejoraran?' },
  { id: 'Q41', text: '¿Qué cambios concretos — no ideales, sino reales y posibles — ayudarían a que la relación se fortalezca entre ustedes?' },
  { id: 'Q42', text: '¿Qué aspectos de la relación sientes que necesitan más cuidado y atención hacia el futuro? ¿Qué no quieres que se pierda?' },
  { id: 'Q43', text: '¿Hay algo importante sobre tu relación, sobre ti o sobre tu pareja que no te haya preguntado y que sientas que debería saber? Lo que sea.' }
]

async function generateAudio(question) {
  const outPath = path.join(OUTPUT_DIR, `${question.id}.mp3`)
  
  if (fs.existsSync(outPath)) {
    console.log(`⏭ ${question.id} ya existe, saltando`)
    return true
  }

  try {
    const r = await fetch(`https://api.elevenlabs.io/v1/text-to-speech/${VOICE_ID}`, {
      method: 'POST',
      headers: {
        'xi-api-key': API_KEY,
        'Content-Type': 'application/json',
        'Accept': 'audio/mpeg'
      },
      body: JSON.stringify({
        text: question.text,
        model_id: MODEL,
        voice_settings: { stability: 0.80, similarity_boost: 0.80, style: 0.08 }
      })
    })

    if (!r.ok) {
      const err = await r.text()
      console.error(`✗ ${question.id} - Status ${r.status}: ${err.substring(0, 200)}`)
      return false
    }

    const buf = Buffer.from(await r.arrayBuffer())
    fs.writeFileSync(outPath, buf)
    console.log(`✓ ${question.id} generado (${buf.length} bytes)`)
    return true
  } catch (e) {
    console.error(`✗ ${question.id} - Error: ${e.message}`)
    return false
  }
}

async function main() {
  if (!fs.existsSync(OUTPUT_DIR)) {
    fs.mkdirSync(OUTPUT_DIR, { recursive: true })
  }

  console.log(`Generando ${QUESTIONS.length} audios con voz masculina (Daniel)...`)
  console.log(`Directorio: ${OUTPUT_DIR}\n`)

  let success = 0
  let failed = 0

  for (let i = 0; i < QUESTIONS.length; i++) {
    const ok = await generateAudio(QUESTIONS[i])
    if (ok) success++
    else failed++
    
    if (i < QUESTIONS.length - 1) {
      await new Promise(resolve => setTimeout(resolve, 1200))
    }
  }

  console.log(`\n--- Resultado ---`)
  console.log(`Generados: ${success}`)
  console.log(`Fallidos: ${failed}`)
}

main()
