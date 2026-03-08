// Script para pre-generar los 42 audios de las preguntas del diagnóstico relacional
// Usa ElevenLabs API con voz Bella (multilingual v2)
// Se ejecuta UNA VEZ y los MP3 se guardan como archivos estáticos

const fs = require('fs')
const path = require('path')

const API_KEY = 'sk_77f6a31d112e8138e7d05a41f45466a6e72f556097aba8a7'
const VOICE_ID = 'EXAVITQu4vr4xnSDxMaL' // Bella - soft, warm female
const MODEL = 'eleven_multilingual_v2'
const OUTPUT_DIR = path.join(__dirname, 'public', 'audio', 'diagnostico')

const QUESTIONS = [
  { id: 'Q1', text: 'Me describiría a mí mismo o misma como alguien que...' },
  { id: 'Q2', text: 'Las personas que me conocen suelen decir que yo...' },
  { id: 'Q3', text: 'Yo describiría a mi pareja como...' },
  { id: 'Q4', text: 'Las personas suelen pensar de mi pareja que...' },
  { id: 'Q5', text: 'Me junté con mi pareja porque...' },
  { id: 'Q6', text: 'Con el tiempo me he dado cuenta de que mi pareja...' },
  { id: 'Q7', text: 'Algo de mi pareja que influye mucho en cómo me siento es que...' },
  { id: 'Q8', text: 'Estar con mi pareja me hace sentir...' },
  { id: 'Q9', text: 'Cuando pienso en mi pareja, lo primero que siento es...' },
  { id: 'Q10', text: 'Lo que más valoro de mi relación es...' },
  { id: 'Q11', text: 'Lo que más me cuesta aceptar de mi pareja es...' },
  { id: 'Q12', text: 'Desde que estoy con mi pareja he descubierto que yo...' },
  { id: 'Q13', text: 'Sin mi pareja, yo sería...' },
  { id: 'Q14', text: 'Lo que me llevaría a separarme de mi pareja sería...' },
  { id: 'Q15', text: 'Cuando estamos bien juntos, yo me siento...' },
  { id: 'Q16', text: 'Cuando estamos bien juntos, yo soy...' },
  { id: 'Q17', text: 'Cuando mi pareja se aleja emocionalmente, yo...' },
  { id: 'Q18', text: 'Cuando mi pareja busca acercarse más a mí, yo tiendo a...' },
  { id: 'Q19', text: 'Lo que más miedo me da dentro de esta relación es...' },
  { id: 'Q20', text: 'Para sentirme realmente amado o amada en esta relación necesito...' },
  { id: 'Q21', text: 'El amor debería ser... pero en mi relación es...' },
  { id: 'Q22', text: 'Lo que más nos une como pareja es...' },
  { id: 'Q23', text: 'Lo que más nos separa como pareja es...' },
  { id: 'Q24', text: 'Si alguien observara nuestra relación desde fuera diría que...' },
  { id: 'Q25', text: 'Si nuestra relación fuera una historia, ahora estaría en la parte donde...' },
  { id: 'Q26', text: 'Si tuviera que explicar por qué mi pareja y yo seguimos juntos, diría que...' },
  { id: 'Q27', text: 'Cuando discutimos, normalmente termino sintiéndome...' },
  { id: 'Q28', text: 'Después de una discusión yo suelo...' },
  { id: 'Q29', text: 'Cuando mi pareja se enoja conmigo, mi primera reacción suele ser...' },
  { id: 'Q30', text: 'Cuando aparece un problema entre nosotros, yo tiendo a...' },
  { id: 'Q31', text: 'Algo que suele pasar entre nosotros cuando las cosas se ponen difíciles es que...' },
  { id: 'Q32', text: 'Cuando nuestra relación empieza a sentirse distante, normalmente es después de que...' },
  { id: 'Q33', text: 'Lo que más me molesta de mi pareja es...' },
  { id: 'Q34', text: 'Lo que más admiro de mi pareja es...' },
  { id: 'Q35', text: 'Lo que nunca le he dicho a mi pareja es...' },
  { id: 'Q36', text: 'Hay partes de mí que mi pareja todavía no conoce, como por ejemplo...' },
  { id: 'Q37', text: 'Si pudiera cambiar una sola cosa de nosotros, sería...' },
  { id: 'Q38', text: 'Lo que más extraño de nosotros es...' },
  { id: 'Q39', text: 'Si esta relación terminara mañana, lo que más me dolería sería...' },
  { id: 'Q40', text: 'Si hay algo que siento que se repite una y otra vez entre nosotros es...' },
  { id: 'Q41', text: 'Cuando nuestra relación está en su mejor momento es porque...' },
  { id: 'Q42', text: 'Si esta relación cambiara profundamente mañana, lo primero que sentiría sería...' }
]

async function generateAudio(question) {
  const outPath = path.join(OUTPUT_DIR, `${question.id}.mp3`)
  
  // Skip if already generated
  if (fs.existsSync(outPath)) {
    const stat = fs.statSync(outPath)
    if (stat.size > 1000) {
      console.log(`✓ ${question.id} ya existe (${stat.size} bytes)`)
      return true
    }
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
        voice_settings: { stability: 0.55, similarity_boost: 0.75, style: 0.3 }
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
  console.log(`Generando ${QUESTIONS.length} audios...`)
  console.log(`Directorio: ${OUTPUT_DIR}\n`)

  let success = 0
  let failed = 0

  for (let i = 0; i < QUESTIONS.length; i++) {
    const ok = await generateAudio(QUESTIONS[i])
    if (ok) success++
    else failed++
    
    // Delay between calls to avoid rate limiting
    if (i < QUESTIONS.length - 1) {
      await new Promise(resolve => setTimeout(resolve, 1200))
    }
  }

  console.log(`\n--- Resultado ---`)
  console.log(`Generados: ${success}`)
  console.log(`Fallidos: ${failed}`)
}

main()
