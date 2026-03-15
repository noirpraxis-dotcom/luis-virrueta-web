// Script para generar audios de las preguntas variante "descubre" de Radiografía Premium
// Genera {questionId}_descubre.mp3 para cada voz × cada pregunta con variante descubre
// Se ejecuta UNA VEZ — requiere ELEVENLABS_API_KEY en env o .env

const fs = require('fs')
const path = require('path')

// ── ElevenLabs config ──
const API_KEY = process.env.ELEVENLABS_API_KEY || 'sk_2d7abb8cb42ffe853dbdff695349b7d1fb7d1c919aef03a9'
const MODEL = 'eleven_multilingual_v2'

const VOICES = {
  valentina: 'EXAVITQu4vr4xnSDxMaL',
  santiago: 'JBFqnCBsd6RMkjVDRZzb',
  adrian: 'onwK4e9ZLuTAKqWW03F9',
  camila: 'FGY2WhTYpPnrIDTdsKH5'
}

const OUTPUT_BASE = path.join(__dirname, 'public', 'audio', 'premium')

// ── Questions with descubre variants (extracted from RadiografiaPremiumPage.jsx) ──
const DESCUBRE_QUESTIONS = [
  { id: 'Q2', text: 'Cuéntame sobre tus relaciones pasadas más significativas, como si estuvieras resumiendo tu historia sentimental hasta hoy.' },
  { id: 'Q3', text: 'Pensando en tu vida sentimental hasta hoy, cuéntame cómo describirías tu situación actual y cómo te sientes respecto a las relaciones.' },
  { id: 'Q4', text: 'Cuando has estado en pareja, cuéntame cómo ha sido tu forma de convivir en el día a día con esa persona.' },
  { id: 'Q5', text: 'Mirando tus experiencias sentimentales en conjunto, cuéntame qué sientes que has construido o aprendido sobre ti mismo a lo largo del tiempo.' },
  { id: 'Q6', text: 'Pensando en las personas que te han atraído, cuéntame qué suele llamarte la atención al inicio de conocer a alguien.' },
  { id: 'Q7', text: 'Cuéntame cómo sueles demostrar cariño o amor en una relación, y cómo te gusta que te lo demuestren a ti.' },
  { id: 'Q8', text: 'Mirando tu historia sentimental, cuéntame qué momentos o etapas recuerdas como especialmente importantes o significativos.' },
  { id: 'Q9', text: 'Cuando empezabas una relación, cuéntame cómo solías imaginar el futuro con esa persona o qué esperabas que pasara.' },
  { id: 'Q10', text: 'Pensando en las personas que han sido importantes para ti, cuéntame qué solías encontrar en esos vínculos o qué representaban para ti.' },
  { id: 'Q13', text: 'Pensando en lo que observaste y viviste mientras crecías, cuéntame si ves reflejos de esas dinámicas en tu propia forma de relacionarte hoy.' },
  { id: 'Q15', text: 'Cuéntame qué tanto sientes que puedes ser tú mismo/a dentro de una relación, si sueles mantener tu individualidad o tiendes a adaptarte.' },
  { id: 'Q16', text: 'Cuéntame cómo sueles manejar los momentos difíciles cuando estás en pareja, si trabajas en equipo o cada quien por su lado.' },
  { id: 'Q17', text: 'Cuando ha habido conflictos en tus relaciones, cuéntame cómo suelen empezar o por qué tipo de temas aparecen los desacuerdos.' },
  { id: 'Q19', text: 'Cuéntame cómo suelen reaccionar tus parejas cuando hay un desacuerdo o una tensión. Qué patrones has notado en ellos.' },
  { id: 'Q20', text: 'Después de un conflicto fuerte, cuéntame cómo solías reconciliarte o cómo se reconstruía la dinámica entre ustedes.' },
  { id: 'Q21', text: 'Pensando en las personas que te han atraído, cuéntame qué características o cualidades encendían tu atracción o deseo.' },
  { id: 'Q22', text: 'Cuéntame cómo sueles sentir la conexión emocional en una relación, en qué momentos sientes que realmente conectas con alguien.' },
  { id: 'Q23', text: 'Cuéntame cómo ha sido tu experiencia con la intimidad física en tus relaciones, si ha sido algo natural o si a veces ha sido complicado.' },
  { id: 'Q24', text: 'Cuéntame cómo ha evolucionado el deseo en tus relaciones pasadas, si se mantenía, cambiaba o se apagaba con el tiempo.' },
  { id: 'Q25', text: 'Cuéntame qué ambientes, momentos o situaciones te han hecho sentir más conectado/a o más cercano/a emocionalmente a alguien.' },
  { id: 'Q26', text: 'Cuéntame qué cosas suelen generar distancia emocional para ti, qué te aleja o te hace sentir desconectado/a de la otra persona.' },
  { id: 'Q27', text: 'Cuéntame cómo sueles tomar decisiones importantes cuando estás en pareja, si las tomas en conjunto o si hay dinámicas de quién decide más.' },
  { id: 'Q28', text: 'Cuéntame si has notado dinámicas de poder en tus relaciones pasadas, si había equilibrio o si alguien tenía más peso emocional.' },
  { id: 'Q29', text: 'Si tuvieras que describir qué buscaban tus parejas en ti, cuéntame qué crees que encontraban o qué rol sentías que cumplías para ellos.' },
  { id: 'Q30', text: 'Cuéntame qué es lo que necesitas y esperas de una relación, qué cosas son realmente importantes para ti.' },
  { id: 'Q31', text: 'Pensando en todas tus experiencias sentimentales, cuéntame qué significan hoy las relaciones de pareja dentro de tu vida.' },
  { id: 'Q32', text: 'Cuando piensas en el futuro, cuéntame cómo imaginas o visualizas tu vida sentimental con el paso del tiempo.' },
  { id: 'Q33', text: 'Cuéntame qué cosas concretas te han hecho sentir amado/a o seguro/a en tus relaciones, y qué has sentido que te faltaba.' },
  { id: 'Q34', text: 'Cuéntame si hay cosas de tu vida sentimental que a veces te generan dudas, preocupación o incertidumbre.' },
  { id: 'Q35', text: 'Pensando en los momentos difíciles que has vivido en tus relaciones, cuéntame cómo los has atravesado o qué suele ayudarte a seguir adelante.' },
  { id: 'Q36', text: 'Cuéntame cómo has vivido el balance entre novedad y rutina en tus relaciones pasadas.' },
  { id: 'Q37', text: 'Si tuvieras que decir qué estás buscando realmente en una relación, cuéntame qué crees que necesitas y qué tipo de persona crees que buscas.' },
  { id: 'Q39', text: 'Si tuvieras que explicar qué hace única tu forma de relacionarte, cuéntame cómo la describirías.' },
]

async function generateAudio(voiceName, voiceId, question) {
  const outputDir = path.join(OUTPUT_BASE, voiceName)
  if (!fs.existsSync(outputDir)) fs.mkdirSync(outputDir, { recursive: true })

  const outputFile = path.join(outputDir, `${question.id}_descubre.mp3`)
  if (fs.existsSync(outputFile)) {
    console.log(`  ✓ ${voiceName}/${question.id}_descubre.mp3 (ya existe)`)
    return
  }

  const res = await fetch(`https://api.elevenlabs.io/v1/text-to-speech/${voiceId}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', 'xi-api-key': API_KEY },
    body: JSON.stringify({
      text: question.text,
      model_id: MODEL,
      voice_settings: { stability: 0.35, similarity_boost: 0.85, style: 0.3, use_speaker_boost: true }
    })
  })

  if (!res.ok) {
    const err = await res.text()
    console.error(`  ✗ ${voiceName}/${question.id}_descubre.mp3 ERROR: ${res.status} ${err}`)
    return
  }

  const buffer = Buffer.from(await res.arrayBuffer())
  fs.writeFileSync(outputFile, buffer)
  console.log(`  ✓ ${voiceName}/${question.id}_descubre.mp3 (${(buffer.length / 1024).toFixed(0)} KB)`)
}

async function main() {
  console.log(`\n🎙️  Generando ${DESCUBRE_QUESTIONS.length} audios descubre × ${Object.keys(VOICES).length} voces`)
  console.log(`   = ${DESCUBRE_QUESTIONS.length * Object.keys(VOICES).length} archivos MP3\n`)

  for (const [voiceName, voiceId] of Object.entries(VOICES)) {
    console.log(`\n── ${voiceName} (${voiceId}) ──`)
    for (const q of DESCUBRE_QUESTIONS) {
      await generateAudio(voiceName, voiceId, q)
      // Rate limit: 150ms between calls
      await new Promise(r => setTimeout(r, 150))
    }
  }

  console.log('\n✅ Generación de audios descubre completada\n')
}

main().catch(console.error)
