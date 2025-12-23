import fs from 'node:fs';

const FILE = 'src/pages/FraseDelDiaPage.jsx';

const src = fs.readFileSync(FILE, 'utf8');

const re = /\{\s*id:\s*'([^']+)'[\s\S]*?quote:\s*'((?:\\'|[^'])*)'[\s\S]*?author:\s*'((?:\\'|[^'])*)'[\s\S]*?meaning:\s*'([\s\S]*?)'[\s\S]*?questions:\s*\[([\s\S]*?)\]\s*\}/g;

const items = [];
let match;
while ((match = re.exec(src))) {
  items.push({
    id: match[1],
    quote: match[2].replace(/\\'/g, "'"),
    author: match[3].replace(/\\'/g, "'"),
    meaning: match[4].replace(/\\'/g, "'"),
    questionsRaw: match[5],
  });
}

const quotes = items.map((x) => x.quote.trim());
const authors = items.map((x) => x.author.trim());

let consecutiveSameAuthor = 0;
for (let i = 1; i < authors.length; i++) {
  if (authors[i] === authors[i - 1]) consecutiveSameAuthor++;
}

const firstIndexByQuote = new Map();
const duplicateQuotes = [];
for (let i = 0; i < quotes.length; i++) {
  const q = quotes[i];
  if (firstIndexByQuote.has(q)) {
    duplicateQuotes.push({ quote: q, first: firstIndexByQuote.get(q), second: i });
  } else {
    firstIndexByQuote.set(q, i);
  }
}

console.log(JSON.stringify({
  file: FILE,
  count: items.length,
  consecutiveSameAuthor,
  duplicateQuotesCount: duplicateQuotes.length,
  duplicateQuotes: duplicateQuotes.slice(0, 20),
}, null, 2));
