// TEST 3 only: LOS DOS (Valentina + Tomás) — full pair flow + cross-analysis
const fs = require('fs'), path = require('path')
const WORKER_URL = 'https://radiografia-worker.noirpraxis.workers.dev'
const envContent = fs.readFileSync(path.join(__dirname, '.env'), 'utf-8')
const DEEPSEEK_API_KEY = envContent.match(/VITE_DEEPSEEK_API_KEY=(.+)/)[1].trim()
const DEEPSEEK_URL = 'https://api.deepseek.com/chat/completions'
const EMAIL = 'psicologiadelacreencia@gmail.com'
const svcContent = fs.readFileSync(path.join(__dirname, 'src/services/radiografiaPremiumService.js'), 'utf-8')
function ex(name) { const m = svcContent.match(new RegExp(`const ${name} = \`([\\s\\S]*?)\``, 'm')); return m ? m[1] : null }
const SP = ex('SYSTEM_PROMPT'), P1 = ex('PART1_INSTRUCTION'), P2 = ex('PART2_INSTRUCTION'), P3 = ex('PART3_INSTRUCTION'), P4 = ex('PART4_INSTRUCTION'), CI = ex('CROSS_INSTRUCTION')

async function wp(ep, body) {
  const r = await fetch(`${WORKER_URL}${ep}`, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(body) })
  const d = await r.json().catch(() => ({}))
  if (!r.ok) throw new Error(`Worker ${ep} ${r.status}: ${JSON.stringify(d)}`)
  return d
}
async function wg(ep) {
  const r = await fetch(`${WORKER_URL}${ep}`)
  const d = await r.json().catch(() => ({}))
  if (!r.ok) throw new Error(`GET ${ep} ${r.status}`)
  return d
}

async function callPart(bp, pi, name) {
  for (let a = 1; a <= 2; a++) {
    try {
      const c = new AbortController()
      const t = setTimeout(() => c.abort(), 300000)
      const r = await fetch(DEEPSEEK_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${DEEPSEEK_API_KEY}` },
        signal: c.signal,
        body: JSON.stringify({ model: 'deepseek-chat', messages: [{ role: 'system', content: SP }, { role: 'user', content: bp + '\n\n' + pi }], temperature: 0.7, max_tokens: 8192, response_format: { type: 'json_object' } })
      })
      clearTimeout(t)
      if (!r.ok) { console.error(`  ❌ [${name}] HTTP ${r.status}`); if (a < 2) { await new Promise(r => setTimeout(r, 5000)); continue }; return null }
      const d = await r.json()
      const p = JSON.parse(d.choices[0].message.content)
      console.log(`  ✅ [${name}] ${(JSON.stringify(p).length / 1024).toFixed(0)} KB`)
      return p
    } catch (e) { console.error(`  ❌ [${name}] ${e.message}`); if (a < 2) { await new Promise(r => setTimeout(r, 5000)); continue }; return null }
  }
  return null
}

async function analyze(responses, profile, pkgType) {
  let prompt = '## RESPUESTAS CUESTIONARIO\n\n'
  if (pkgType === 'losdos') prompt += '### TIPO: PAREJA LOS DOS (reporte individual)\n\n'
  if (profile.nombre) prompt += `### DATOS\n- Nombre: ${profile.nombre}\n- Edad: ${profile.edad}\n\n`
  for (let i = 1; i <= 40; i++) prompt += `**Q${i}.**\n→ "${responses['Q' + i] || ''}"\n\n`
  console.log(`  📤 Prompt: ${(prompt.length / 1024).toFixed(1)} KB`)
  console.log(`  🚀 4 llamadas paralelas...`)
  const t0 = Date.now()
  const [p1, p2, p3, p4] = await Promise.all([callPart(prompt, P1, 'Auto'), callPart(prompt, P2, 'LecA'), callPart(prompt, P3, 'LecB'), callPart(prompt, P4, 'Graf')])
  console.log(`  ⏱️ ${((Date.now() - t0) / 1000).toFixed(0)}s`)
  if (!p1?.autoanalisis_usuario) { console.error('  ❌ Part1 failed'); return null }
  const m = { ...(p1 || {}), ...(p2 ? { analisis_profundo: p2.analisis_profundo, lectura_psicoanalitica: p2.lectura_psicoanalitica } : {}), ...(p3 ? { dinamica_conflicto: p3.dinamica_conflicto, energia_vinculo: p3.energia_vinculo, direccion_probable: p3.direccion_probable, fortalezas: p3.fortalezas, riesgos: p3.riesgos, tabla_diagnostica: p3.tabla_diagnostica, sintesis_final: p3.sintesis_final } : {}), ...(p4 ? { temas_para_consulta: p4.temas_para_consulta, tecnicas_recomendadas: p4.tecnicas_recomendadas, libros_recomendados: p4.libros_recomendados, graficas_autoanalisis: p4.graficas_autoanalisis } : {}), lecturas_por_enfoque: { ...(p2?.lecturas_por_enfoque || {}), ...(p3?.lecturas_por_enfoque || {}) } }
  console.log(`  ✅ Merged: ${(JSON.stringify(m).length / 1024).toFixed(0)} KB`)
  return m
}

const VRESP = { Q1: 'Tengo 30 años, soy maestra de yoga y llevo 4 años con Tomás. Estamos en un momento donde necesitamos reconectarnos porque sentimos que nos hemos alejado emocionalmente aunque vivimos juntos.', Q2: 'Nos conocimos en una clase de cocina, yo estaba ahí por hobbie y él por impresionar a una amiga. Empezamos a platicar y hubo una conexión inmediata. Los primeros dos años fueron maravillosos.', Q3: 'Siento que estamos en modo automático. Nos queremos pero hay una distancia invisible. Es como si cada uno estuviera en su burbuja.', Q4: 'El día a día es funcional pero sin alma. Él trabaja mucho y yo tengo mis clases. Nos cruzamos en la mañana con prisas y en la noche estamos cansados.', Q5: 'Hemos construido una vida bonita juntos. Una casa, rutinas, un perrito. Pero siento que lo que construimos es un armazón sin suficiente contenido emocional adentro.', Q6: 'Me atrajo su tranquilidad, su forma de estar en calma cuando todo es caos. Yo soy más emocional y él es tierra firme.', Q7: 'Yo demuestro amor con contacto físico y palabras de afirmación. Le digo que lo quiero, lo abrazo. Él demuestra amor resolviendo cosas, arreglando el carro, pagando cuentas.', Q8: 'Nuestro primer viaje juntos a la playa fue mágico. También cuando perdí a mi abuela y él estuvo ahí en silencio sosteniéndome.', Q9: 'Me imaginaba una vida juntos llena de viajes, risas, quizás hijos. Sentía que con él podía ser yo misma.', Q10: 'Tomás representaba para mí la estabilidad emocional que yo no tenía. Yo crecí en una casa caótica y él era como un ancla.', Q11: 'Mis papás peleaban mucho. Gritos, portazos, silencios de semanas. Mi mamá era muy emotiva y mi papá muy frío.', Q12: 'Aprendí que el amor duele, que hay que sacrificarte por los demás, que las emociones son peligrosas si no las controlas.', Q13: 'Me reconozco en el rol de mediadora. Con Tomás me trago muchas cosas para no pelear y después me siento vacía por dentro.', Q14: 'Antes de Tomás tuve dos relaciones cortas y una de dos años con Gabriel que fue muy tóxica. Gabriel era muy celoso y controlador.', Q15: 'He perdido partes de mí en esta relación. Dejé de ir a eventos de yoga, de ver amigas. No porque él me lo pida sino porque me adapté a su ritmo.', Q16: 'No funcionamos como equipo en las crisis. Él se cierra y yo me ansiedad.', Q17: 'Los conflictos empiezan porque necesito hablar de algo emocional y él minimiza.', Q18: 'Cuando hay conflicto me vuelvo más emocional de lo que quisiera. Lloro, hablo rápido, intento explicar lo que siento pero me enredo.', Q19: 'Tomás se cierra como una ostra. Se queda callado, mira su celular, o se va a otra habitación.', Q20: 'Después hay silencio incómodo que puede durar un día o dos. Luego él hace algo bonito como traerme flores.', Q21: 'Me sigue atrayendo mucho de Tomás. Su olor, su forma de caminar segura, cuando se concentra en algo.', Q22: 'La cercanía emocional la siento en los momentos de calma, cuando estamos acostados y nos contamos cosas del día.', Q23: 'La intimidad física se ha reducido mucho. Me da pena iniciar porque he sentido rechazo un par de veces.', Q24: 'El deseo está adormecido. No muerto, pero dormido.', Q25: 'Me siento cercana cuando cocinamos juntos, cuando paseamos al perro.', Q26: 'La distancia aparece cuando cada uno está en su celular, cuando él trabaja hasta tarde.', Q27: 'Las decisiones grandes las intentamos tomar juntos pero a veces siento que él ya decidió.', Q28: 'Siento que Tomás tiene más poder porque él es el que menos necesita emocionalmente.', Q29: 'Tomás necesita tranquilidad, rutina, que no haya drama.', Q30: 'Necesito presencia emocional. Que esté AQUÍ, no solo físicamente sino emocionalmente.', Q31: 'Esta relación significa mi hogar emocional. A pesar de todo, Tomás es donde quiero estar.', Q32: 'Me imagino casada con Tomás, con hijos. Pero necesitamos reconstruir la conexión emocional.', Q33: 'Me he sentido amada cuando Tomás me cuida estando enferma, cuando me defiende.', Q34: 'Me preocupa que estemos juntos por costumbre y no por elección real.', Q35: 'Lo que nos ha sostenido es un afecto genuino debajo de todo.', Q36: 'Se ha vuelto muy rutinaria. Extraño la espontaneidad.', Q37: 'Él busca estabilidad y paz. Yo busco conexión profunda y pasión.', Q38: 'Tengo mucho miedo al abandono emocional, más que al físico.', Q39: 'Genuinamente nos queremos y nos admiramos. El fundamento está ahí.', Q40: 'Quiero que Tomás sepa que no lo quiero perfecto, lo quiero presente.' }
const TRESP = { Q1: 'Tengo 32 años, trabajo en finanzas. Llevo 4 años con Valentina y vivimos juntos hace un año y medio.', Q2: 'Nos conocimos en una clase de cocina. Ella era muy expresiva y sonriente y me llamó la atención.', Q3: 'La relación la siento funcional pero algo desconectada. Sé que Val siente que me he alejado emocionalmente y tiene razón.', Q4: 'Nuestra rutina es trabajar, cenar, dormir. Yo llego cansado del trabajo y a veces me cuesta estar presente.', Q5: 'Hemos construido una vida bonita. Un hogar que me gusta, un perro que adoro.', Q6: 'Me atrajo su energía, su pasión por la vida. Yo soy más tranquilo y ella me hacía sentir vivo.', Q7: 'Yo demuestro amor haciendo cosas: arreglando la casa, cuidando las finanzas. No soy bueno con las palabras.', Q8: 'Nuestro primer viaje juntos a la playa fue el momento más feliz. Cuando perdió a su abuela sentí que realmente podía ser su apoyo.', Q9: 'Imaginaba un futuro tranquilo y feliz con ella. Una casa, quizás hijos.', Q10: 'Val representaba para mí la vida que yo quería tener pero no sabía cómo crear.', Q11: 'Mi familia era estable pero fría. Mis padres siguen juntos pero nunca muestran afecto.', Q12: 'Aprendí que ser hombre es ser fuerte, que las emociones son debilidad.', Q13: 'Me reconozco en la frialdad de mi papá y eso me asusta.', Q14: 'Con Andrea también me decían témpano de hielo emocionalmente. Fue doloroso escucharlo.', Q15: 'Necesito mucho espacio personal y tiempo solo para recargar.', Q16: 'No soy bueno en equipo emocional. Cuando algo está mal yo me cierro.', Q17: 'Los conflictos empiezan porque ella siente que no estoy presente emocionalmente.', Q18: 'Me quedo callado. Me cierro completamente. Sé que eso la frustra más.', Q19: 'Val se pone emotiva, llora, habla mucho. Yo sé que está sufriendo pero no sé qué hacer.', Q20: 'Intento compensar con gestos prácticos. Le traigo algo, cocino su comida favorita.', Q21: 'Val sigue siendo muy atractiva para mí. Su cuerpo, su sonrisa.', Q22: 'La cercanía emocional la siento cuando estamos tranquilos, sin presión.', Q23: 'La intimidad física ha disminuido y sé que eso afecta a Val.', Q24: 'El deseo fue muy intenso al principio. Ahora está menos presente.', Q25: 'Me siento conectado cuando hacemos algo fun juntos sin presión.', Q26: 'La distancia aparece cuando Val quiere hablar de sentimientos y yo no puedo.', Q27: 'Tiendo a tomar decisiones rápidas y prácticas. A veces no consulto a Val.', Q28: 'Val tiene más peso emocional en la relación. Sus emociones marcan el ritmo.', Q29: 'Val necesita presencia emocional, palabras, que yo la vea.', Q30: 'Necesito paciencia, espacio para procesar, que no se interprete mi silencio como desamor.', Q31: 'Val es la persona más importante en mi vida.', Q32: 'Quiero un futuro con Val. Casarnos, tener hijos, envejecer juntos.', Q33: 'Me siento amado cuando Val me acepta en mis silencios.', Q34: 'Me preocupa perderla por no poder darle lo que necesita emocionalmente.', Q35: 'Lo que nos ha sostenido es que genuinamente nos queremos.', Q36: 'Yo me siento cómodo con la rutina pero entiendo que Val la encuentra asfixiante.', Q37: 'Val busca conexión profunda y ser vista emocionalmente. Yo busco paz y aceptación.', Q38: 'Esta relación me ha revelado que tengo mucho trabajo emocional por hacer.', Q39: 'Lo que hace única nuestra relación es que nos elegimos cada día. Ella es fuego y yo soy agua.', Q40: 'Quiero que Val sepa que aunque no lo diga suficiente, ella es lo mejor que me ha pasado.' }

async function main() {
  console.log('\n🔬 TEST 3: LOS DOS — Valentina y Tomás\n')
  console.log('📌 Paso 1: Crear tokens pareados...')
  const pid = 'test_losdos_' + Date.now()
  const r1 = await wp('/api/send-access-email', { purchaseId: pid, type: 'losdos', emails: [EMAIL], tokens: [] })
  const bt = r1.tokens[0]
  console.log(`  ✅ Valentina: ${bt}`)
  const r2 = await wp('/api/send-access-email', { purchaseId: pid, type: 'losdos', emails: [EMAIL], tokens: [], buyerToken: bt, buyerEmail: EMAIL })
  const pt = r2.tokens[0]
  console.log(`  ✅ Tomás: ${pt}`)

  console.log('\n📌 Paso 2a: Análisis Valentina...')
  const aV = await analyze(VRESP, { nombre: 'Valentina', edad: '30' }, 'losdos')
  if (!aV) { console.error('FAIL Valentina'); process.exit(1) }
  await wp('/api/save-analysis', { token: bt, analysis: aV })
  await wp('/api/mark-partner-done', { token: bt })
  await wp('/api/send-analysis-email', { token: bt, type: 'losdos', emails: [EMAIL] })
  console.log('  ✅ Valentina: guardado, marcado, email enviado')

  console.log('\n📌 Paso 2b: Análisis Tomás...')
  const aT = await analyze(TRESP, { nombre: 'Tomás', edad: '32' }, 'losdos')
  if (!aT) { console.error('FAIL Tomás'); process.exit(1) }
  await wp('/api/save-analysis', { token: pt, analysis: aT })
  await wp('/api/mark-partner-done', { token: pt })
  await wp('/api/send-analysis-email', { token: pt, type: 'losdos', emails: [EMAIL] })
  console.log('  ✅ Tomás: guardado, marcado, email enviado')

  console.log('\n📌 Paso 3: Check cross status...')
  const cs = await wp('/api/check-cross-status', { token: pt })
  console.log(`  paired=${cs.paired} bothDone=${cs.bothDone} pairId=${cs.pairId}`)

  if (cs.bothDone && cs.otherAnalysis) {
    console.log('\n📌 Paso 4: Cross-analysis IA...')
    let cp = `## RADIOGRAFÍA CRUZADA\n\n### VALENTINA\nDimensiones: ${JSON.stringify(aV.dimensiones)}\nResumen: ${aV.resumen_relacion || ''}\nFortalezas: ${JSON.stringify(aV.fortalezas || [])}\nRiesgos: ${JSON.stringify(aV.riesgos || [])}\n\n### TOMÁS\nDimensiones: ${JSON.stringify(aT.dimensiones)}\nResumen: ${aT.resumen_relacion || ''}\nFortalezas: ${JSON.stringify(aT.fortalezas || [])}\nRiesgos: ${JSON.stringify(aT.riesgos || [])}`
    console.log(`  📤 Cross prompt: ${(cp.length / 1024).toFixed(1)} KB`)
    const cross = await callPart(cp, CI, 'Cross')
    if (cross) {
      console.log(`  ✅ Cross: ${(JSON.stringify(cross).length / 1024).toFixed(0)} KB`)
      await wp('/api/save-cross-analysis', { token: pt, pairId: cs.pairId, analysis: cross })
      await wp('/api/send-cross-analysis-email', { pairId: cs.pairId, token: pt })
      console.log('  ✅ Cross guardado y emails enviados')
      const cr = await wg(`/api/get-cross-analysis?pairId=${cs.pairId}&token=${pt}`)
      console.log(`  ✅ Retrievable: ${cr.ok ? 'OK' : 'FAIL'}`)
      console.log(`\n  🔗 URL Val: https://luisvirrueta.com/radiografia-premium?token=${bt}&type=losdos&view=results&cross=${cs.pairId}`)
      console.log(`  🔗 URL Tom: https://luisvirrueta.com/radiografia-premium?token=${pt}&type=losdos&view=results&cross=${cs.pairId}`)
      console.log('\n🎉 TEST 3: PASS')
    } else { console.log('TEST 3: PARTIAL — cross failed') }
  } else { console.log('TEST 3: PARTIAL — cross status mismatch') }
}
main().catch(e => { console.error('Fatal:', e); process.exit(1) })
