/**
 * Generate all premium radiografia audio files using ElevenLabs TTS.
 * 
 * Usage: node scripts/generate-premium-audio.mjs
 * 
 * Generates: public/audio/premium/{voiceName}/{Q1..Q40}.mp3 + preview.mp3
 * 4 voices × (40 questions + 1 preview) = 164 audio files
 */

import { writeFile, mkdir } from 'fs/promises'
import { existsSync } from 'fs'
import { join } from 'path'

const API_KEY = process.env.ELEVENLABS_API_KEY || process.argv[2]
if (!API_KEY) {
  console.error('❌ Provide ELEVENLABS_API_KEY env var or pass as argument')
  process.exit(1)
}

const VOICES = [
  { id: 'EXAVITQu4vr4xnSDxMaL', name: 'valentina' },
  { id: 'JBFqnCBsd6RMkjVDRZzb', name: 'santiago' },
  { id: 'onwK4e9ZLuTAKqWW03F9', name: 'adrian' },
  { id: 'FGY2WhTYpPnrIDTdsKH5', name: 'camila' }
]

const DISPLAY_NAMES = {
  valentina: 'Valentina',
  santiago: 'Santiago',
  adrian: 'Adrián',
  camila: 'Camila'
}

const QUESTIONS = [
  { id: 'Q1', text: 'Para empezar, cuéntame un poco sobre tu vida actualmente y en qué momento te encuentras hoy.' },
  { id: 'Q2', text: 'Cuéntame la historia de tu relación desde el principio hasta hoy, como si estuvieras resumiendo el camino que han recorrido juntos.' },
  { id: 'Q3', text: 'Pensando en el presente, cuéntame cómo describirías tu relación actualmente y cómo sientes que están las cosas entre ustedes en este momento.' },
  { id: 'Q4', text: 'Háblame de cómo es la vida cotidiana entre ustedes y cómo suelen relacionarse en el día a día.' },
  { id: 'Q5', text: 'Cuando miras todo lo que han vivido juntos hasta ahora, cuéntame qué sientes que han construido o desarrollado como pareja a lo largo del tiempo.' },
  { id: 'Q6', text: 'Regresando al inicio de la relación, cuéntame qué fue lo que más te llamó la atención de tu pareja cuando empezaron a conocerse.' },
  { id: 'Q7', text: 'Cuéntame cómo se demuestran cariño o amor entre ustedes en el día a día, y cómo te gusta a ti que te lo demuestren.' },
  { id: 'Q8', text: 'Mirando la historia de la relación, cuéntame qué momentos o etapas recuerdas como especialmente importantes o significativas en el camino que han recorrido juntos.' },
  { id: 'Q9', text: 'Cuando la relación estaba comenzando, cuéntame cómo imaginabas que podría ser el futuro entre ustedes o hacia dónde sentías que podía ir la relación.' },
  { id: 'Q10', text: 'Pensando en lo que sentías por tu pareja en ese momento, cuéntame qué representaba esa persona para ti o qué sentías que encontrabas en esa relación.' },
  { id: 'Q11', text: 'Ahora me gustaría que me cuentes un poco sobre el ambiente en el que creciste y cómo era la relación entre las personas que te criaron o las figuras importantes de tu infancia.' },
  { id: 'Q12', text: 'Pensando en lo que viste o viviste mientras crecías, cuéntame qué ideas o creencias sobre el amor y las relaciones sientes que aprendiste en tu familia o en las relaciones que observabas a tu alrededor.' },
  { id: 'Q13', text: 'Hoy que estás en una relación, cuéntame si hay algo de la forma en que se relacionaban las personas de tu familia que sientas que de alguna manera también aparece en tu forma de relacionarte con tu pareja.' },
  { id: 'Q14', text: 'Antes de esta relación, cuéntame cómo fueron tus relaciones importantes anteriores y qué cosas sientes que aprendiste de ellas.' },
  { id: 'Q15', text: 'Dentro de tu relación, cuéntame qué tanto sientes que puedes ser tú mismo o tú misma sin perder tu identidad o tus propios espacios.' },
  { id: 'Q16', text: 'Cuéntame si sienten que funcionan como equipo cuando las cosas se ponen difíciles, o si cada uno tiende a manejar las cosas por su lado.' },
  { id: 'Q17', text: 'En tu relación actual, cuéntame cómo suelen empezar los desacuerdos o discusiones cuando aparecen.' },
  { id: 'Q18', text: 'Cuando aparece un conflicto o una discusión en la relación, cuéntame cómo reaccionas tú normalmente en ese momento.' },
  { id: 'Q19', text: 'Cuando hay un desacuerdo o una discusión entre ustedes, cuéntame cómo suele reaccionar tu pareja.' },
  { id: 'Q20', text: 'Pensando en los conflictos que han tenido, cuéntame qué suele pasar después de una discusión o desacuerdo entre ustedes.' },
  { id: 'Q21', text: 'Cuéntame qué cosas de tu pareja siguen despertando atracción o deseo en ti hoy en día.' },
  { id: 'Q22', text: 'Cuéntame cómo describirías la cercanía emocional que existe entre ustedes actualmente.' },
  { id: 'Q23', text: 'Háblame de cómo se vive actualmente la intimidad física o sexual entre ustedes en la relación.' },
  { id: 'Q24', text: 'Pensando en el tiempo que llevan juntos, cuéntame cómo ha cambiado el deseo o la atracción entre ustedes desde el inicio de la relación hasta hoy.' },
  { id: 'Q25', text: 'Cuéntame qué cosas o situaciones suelen hacer que se sientan más cercanos o conectados dentro de la relación.' },
  { id: 'Q26', text: 'Cuéntame si hay momentos o situaciones en los que sientes más distancia entre ustedes dentro de la relación.' },
  { id: 'Q27', text: 'Cuando tienen que tomar decisiones importantes dentro de la relación, cuéntame cómo suelen manejar esas situaciones entre ustedes.' },
  { id: 'Q28', text: 'Cuéntame si dentro de la relación sientes que hay un equilibrio en el poder y la influencia entre ustedes, o si alguno de los dos suele tener más peso.' },
  { id: 'Q29', text: 'Pensando en tu pareja, cuéntame qué crees que es importante para ella dentro de la relación o qué cosas parece esperar de ti.' },
  { id: 'Q30', text: 'Ahora piensa en lo que tú esperas dentro de la relación y cuéntame qué cosas son importantes para ti.' },
  { id: 'Q31', text: 'Pensando en todo lo que han vivido juntos, cuéntame qué significa hoy esta relación para ti dentro de tu vida.' },
  { id: 'Q32', text: 'Cuando piensas en el futuro, cuéntame cómo imaginas o visualizas la relación entre ustedes con el paso del tiempo.' },
  { id: 'Q33', text: 'Cuéntame qué cosas concretas hace tu pareja que te hacen sentir amado o amada o seguro o segura, y cuáles sientes que te faltan.' },
  { id: 'Q34', text: 'Cuéntame si hay cosas dentro de la relación que a veces te generan dudas, preocupación o incertidumbre.' },
  { id: 'Q35', text: 'Pensando en los momentos difíciles que han vivido como pareja, cuéntame cómo han logrado atravesarlos o qué suele ayudar a que la relación continúe después de esos momentos.' },
  { id: 'Q36', text: 'Cuéntame si sienten que la relación tiene momentos de novedad o sorpresa, o si se ha vuelto más predecible y rutinaria.' },
  { id: 'Q37', text: 'Si tuvieras que decir qué está buscando cada uno dentro de esta relación, cuéntame qué crees que busca tu pareja y qué crees que estás buscando tú.' },
  { id: 'Q38', text: 'Pensando en todo lo que has contado hasta ahora, cuéntame qué crees que esta relación ha despertado o revelado en ti como persona.' },
  { id: 'Q39', text: 'Si tuvieras que explicar qué hace única o particular tu relación con esta persona, cuéntame cómo la describirías.' },
  { id: 'Q40', text: 'Para terminar, cuéntame si hay algo importante sobre tu relación o sobre lo que estás viviendo en ella que sientas que todavía no has mencionado y que te gustaría compartir.' }
]

// Extra static audio files per voice (beyond questions + preview)
const EXTRA_AUDIO = [
  { id: 'sound-test', textFn: (name) => `¿Me escuchas bien? Si puedes oírme con claridad, estamos listos para comenzar.` },
  { id: 'welcome', textFn: (name) => `Te damos la bienvenida. Antes de iniciar, necesito conocer un par de datos tuyos muy rápidos. Escríbelos en los campos que aparecen a continuación y podremos comenzar.` },
  { id: 'spotlight-1', textFn: (name) => `Aquí verás la pregunta. Se lee en voz alta automáticamente. Solo relájate y escucha.` },
  { id: 'spotlight-2', textFn: (name) => `Si te faltó algo, aquí tienes ideas para enriquecer tu respuesta.` },
  { id: 'spotlight-3', textFn: (name) => `El micrófono se activa automáticamente. Habla con libertad. Cuando termines, toca Siguiente.` }
]

const OUTPUT_DIR = join(process.cwd(), 'public', 'audio', 'premium')

const VOICE_SETTINGS = {
  stability: 0.35,
  similarity_boost: 0.85,
  style: 0.3,
  use_speaker_boost: true
}

async function generateAudio(voiceId, text) {
  const res = await fetch(`https://api.elevenlabs.io/v1/text-to-speech/${voiceId}`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'xi-api-key': API_KEY
    },
    body: JSON.stringify({
      text,
      model_id: 'eleven_multilingual_v2',
      voice_settings: VOICE_SETTINGS
    })
  })
  if (!res.ok) {
    const errText = await res.text()
    throw new Error(`ElevenLabs API error ${res.status}: ${errText}`)
  }
  return Buffer.from(await res.arrayBuffer())
}

// Rate limit: ~2 req/s for free tier, be conservative
function sleep(ms) { return new Promise(r => setTimeout(r, ms)) }

async function main() {
  console.log('🎙️  Generating premium audio files...')
  console.log(`   ${VOICES.length} voices × ${QUESTIONS.length + 1} texts = ${VOICES.length * (QUESTIONS.length + 1)} files\n`)

  let generated = 0
  let skipped = 0

  for (const voice of VOICES) {
    const voiceDir = join(OUTPUT_DIR, voice.name)
    await mkdir(voiceDir, { recursive: true })

    const displayName = DISPLAY_NAMES[voice.name]

    // Preview audio
    const previewPath = join(voiceDir, 'preview.mp3')
    if (existsSync(previewPath)) {
      console.log(`  ⏭️  ${voice.name}/preview.mp3 (exists)`)
      skipped++
    } else {
      const previewText = `Hola, soy ${displayName} y te acompañaré durante toda tu radiografía. Escucharás cada pregunta en mi voz.`
      try {
        console.log(`  🔊 ${voice.name}/preview.mp3 ...`)
        const buf = await generateAudio(voice.id, previewText)
        await writeFile(previewPath, buf)
        generated++
        await sleep(1500)
      } catch (err) {
        console.error(`  ❌ ${voice.name}/preview.mp3: ${err.message}`)
      }
    }

    // Question audios
    for (const q of QUESTIONS) {
      const filePath = join(voiceDir, `${q.id}.mp3`)
      if (existsSync(filePath)) {
        console.log(`  ⏭️  ${voice.name}/${q.id}.mp3 (exists)`)
        skipped++
        continue
      }
      try {
        console.log(`  🔊 ${voice.name}/${q.id}.mp3 ...`)
        const buf = await generateAudio(voice.id, q.text)
        await writeFile(filePath, buf)
        generated++
        await sleep(1500)
      } catch (err) {
        console.error(`  ❌ ${voice.name}/${q.id}.mp3: ${err.message}`)
        // If rate limited, wait longer and retry once
        if (err.message.includes('429') || err.message.includes('rate')) {
          console.log('  ⏳ Rate limited, waiting 30s...')
          await sleep(30000)
          try {
            const buf = await generateAudio(voice.id, q.text)
            await writeFile(filePath, buf)
            generated++
          } catch (retryErr) {
            console.error(`  ❌ Retry failed: ${retryErr.message}`)
          }
        }
      }
    }

    // Extra static audio files
    for (const extra of EXTRA_AUDIO) {
      const filePath = join(voiceDir, `${extra.id}.mp3`)
      if (existsSync(filePath)) {
        console.log(`  ⏭️  ${voice.name}/${extra.id}.mp3 (exists)`)
        skipped++
        continue
      }
      try {
        const text = extra.textFn(displayName)
        console.log(`  🔊 ${voice.name}/${extra.id}.mp3 ...`)
        const buf = await generateAudio(voice.id, text)
        await writeFile(filePath, buf)
        generated++
        await sleep(1500)
      } catch (err) {
        console.error(`  ❌ ${voice.name}/${extra.id}.mp3: ${err.message}`)
        if (err.message.includes('429') || err.message.includes('rate')) {
          console.log('  ⏳ Rate limited, waiting 30s...')
          await sleep(30000)
          try {
            const buf = await generateAudio(voice.id, extra.textFn(displayName))
            await writeFile(filePath, buf)
            generated++
          } catch (retryErr) {
            console.error(`  ❌ Retry failed: ${retryErr.message}`)
          }
        }
      }
    }

    console.log(`  ✅ ${voice.name} done\n`)
  }

  console.log(`\n🏁 Complete: ${generated} generated, ${skipped} skipped (already existed)`)
  console.log(`   Files saved to: public/audio/premium/`)
}

main()
