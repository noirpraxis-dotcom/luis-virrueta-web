import fs from 'node:fs/promises'

const filePath = 'src/pages/BlogArticlePage.jsx'
let content = await fs.readFile(filePath, 'utf8')

// Fix 1: Reduce reflection padding from pl-8 to pl-6
content = content.replace(
  /<div className="pl-8 pr-0 py-1">/g,
  '<div className="pl-6 pr-0 py-1">'
)

// Fix 2: Adjust quote mark position from -left-2 to -left-1
content = content.replace(
  /absolute -left-2 -top-1 text-5xl/g,
  'absolute -left-1 -top-1 text-5xl'
)

await fs.writeFile(filePath, content, 'utf8')
console.log('✅ Fixed reflection alignment')
