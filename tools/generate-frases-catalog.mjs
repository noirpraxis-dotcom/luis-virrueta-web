import fs from 'node:fs';

const SOURCE_FILE = 'src/pages/FraseDelDiaPage.jsx';
const OUT_FILE = 'FRASES-DEL-DIA-CATALOGO.md';

const src = fs.readFileSync(SOURCE_FILE, 'utf8');

const phraseRe = /\{\s*id:\s*'([^']+)'[\s\S]*?quote:\s*'((?:\\'|[^'])*)'[\s\S]*?author:\s*'((?:\\'|[^'])*)'[\s\S]*?meaning:\s*'([\s\S]*?)'[\s\S]*?questions:\s*\[([\s\S]*?)\]\s*\}/g;
const questionRe = /'((?:\\'|[^'])*)'/g;

function unescapeSingleQuotes(s) {
  return s.replace(/\\'/g, "'");
}

const phrases = [];
let match;
while ((match = phraseRe.exec(src))) {
  const id = match[1];
  const quote = unescapeSingleQuotes(match[2]).trim();
  const author = unescapeSingleQuotes(match[3]).trim();
  const meaning = unescapeSingleQuotes(match[4]).trim();

  const questionsRaw = match[5];
  const questions = [];
  let q;
  while ((q = questionRe.exec(questionsRaw))) {
    questions.push(unescapeSingleQuotes(q[1]).trim());
  }

  phrases.push({ id, quote, author, meaning, questions });
}

phrases.sort((a, b) => Number(a.id) - Number(b.id));

const total = phrases.length;
if (total === 0) {
  console.error('No phrases parsed. Check regex parsing.');
  process.exit(1);
}

const authorCounts = new Map();
for (const p of phrases) {
  authorCounts.set(p.author, (authorCounts.get(p.author) ?? 0) + 1);
}

const authorsSorted = [...authorCounts.entries()].sort((a, b) => {
  if (b[1] !== a[1]) return b[1] - a[1];
  return a[0].localeCompare(b[0], 'es');
});

function pluralFrase(n) {
  return n === 1 ? 'frase' : 'frases';
}

const lines = [];
lines.push('# 📖 Catálogo Completo: "1 frase × día"');
lines.push('');
lines.push('## Sistema de Rotación Automática');
lines.push('');
lines.push('- **Cambio diario:** Medianoche (00:00 hrs) hora de México');
lines.push(`- **Total de frases:** ${total} frases filosóficas, psicológicas y espirituales`);
lines.push(`- **Ciclo completo:** ${total} días (aproximadamente ${Math.round(total / 30)} meses)`);
lines.push('- **Inicio del ciclo:** 23 de diciembre de 2025 = Frase #001');
lines.push('- **Sin repetición de autores consecutivos:** Algoritmo garantiza diversidad día a día');
lines.push('');
lines.push('---');
lines.push('');
lines.push('## Distribución por Autores');
lines.push('');
for (const [author, count] of authorsSorted) {
  lines.push(`- **${author}**: ${count} ${pluralFrase(count)}`);
}
lines.push('');
lines.push('---');
lines.push('');
lines.push(`## 📝 Catálogo de las ${total} Frases`);
lines.push('');

for (const p of phrases) {
  const num = p.id.padStart(3, '0');
  lines.push(`### Frase #${num}: ${p.author}`);
  lines.push('');
  lines.push(`> "${p.quote}"`);
  lines.push('');
  lines.push('**Significado:**');
  lines.push('');
  lines.push(p.meaning);
  lines.push('');
  lines.push('**Preguntas para reflexionar:**');
  lines.push('');

  const qs = p.questions.length ? p.questions : ['¿Qué te está mostrando esta frase hoy?', '¿Qué acción concreta puedes tomar?'];
  for (let i = 0; i < qs.length; i++) {
    lines.push(`${i + 1}. ${qs[i]}`);
  }

  lines.push('');
  lines.push('---');
  lines.push('');
}

fs.writeFileSync(OUT_FILE, lines.join('\n'), 'utf8');
console.log(`Wrote ${OUT_FILE} with ${total} phrases.`);
