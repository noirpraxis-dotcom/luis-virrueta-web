import sharp from 'sharp'
import { readdirSync, statSync, existsSync, mkdirSync } from 'fs'
import { join, basename, dirname } from 'path'

const publicDir = './public'
const quality = 85
const skipDirs = ['blog-compressed', 'logos-compressed', 'muestras-compressed', 'videos']

let totalOriginalSize = 0
let totalCompressedSize = 0
let filesProcessed = 0

async function compressImage(filePath) {
  try {
    const ext = filePath.toLowerCase()
    const relativePath = filePath.replace(publicDir + '/', '')
    
    // Skip already compressed files
    if (filePath.includes('-compressed')) {
      return
    }
    
    const stats = statSync(filePath)
    const originalSize = stats.size / 1024 / 1024 // MB
    
    let outputPath
    let compressed
    
    if (ext.endsWith('.jpg') || ext.endsWith('.jpeg')) {
      outputPath = filePath.replace(/\.(jpg|jpeg)$/i, '-compressed.webp')
      compressed = await sharp(filePath)
        .webp({ quality, effort: 6 })
        .toBuffer()
    } else if (ext.endsWith('.png')) {
      outputPath = filePath.replace('.png', '-compressed.webp')
      compressed = await sharp(filePath)
        .webp({ quality, effort: 6 })
        .toBuffer()
    } else {
      return
    }
    
    // Ensure output directory exists
    const outputDir = dirname(outputPath)
    if (!existsSync(outputDir)) {
      mkdirSync(outputDir, { recursive: true })
    }
    
    // Write compressed file
    await sharp(compressed).toFile(outputPath)
    
    const compressedStats = statSync(outputPath)
    const compressedSize = compressedStats.size / 1024 / 1024 // MB
    const savings = ((originalSize - compressedSize) / originalSize * 100).toFixed(1)
    
    totalOriginalSize += originalSize
    totalCompressedSize += compressedSize
    filesProcessed++
    
    console.log(`✅ ${basename(filePath)}`)
    console.log(`   Original: ${originalSize.toFixed(2)} MB → Compressed: ${compressedSize.toFixed(2)} MB`)
    console.log(`   Savings: ${savings}% | Output: ${basename(outputPath)}`)
    console.log('')
    
  } catch (error) {
    console.error(`❌ Error processing ${filePath}:`, error.message)
  }
}

async function processDirectory(dir) {
  const files = readdirSync(dir)
  
  for (const file of files) {
    const fullPath = join(dir, file)
    const stat = statSync(fullPath)
    
    if (stat.isDirectory()) {
      // Skip certain directories
      if (skipDirs.some(skipDir => fullPath.includes(skipDir))) {
        continue
      }
      await processDirectory(fullPath)
    } else if (file.match(/\.(jpg|jpeg|png)$/i) && !file.includes('-compressed')) {
      await compressImage(fullPath)
    }
  }
}

console.log('🖼️  Starting image compression...\n')
console.log('Converting to WebP format for maximum efficiency\n')
console.log('─'.repeat(60))
console.log('')

await processDirectory(publicDir)

console.log('─'.repeat(60))
console.log('\n📊 COMPRESSION SUMMARY:')
console.log(`Files processed: ${filesProcessed}`)
console.log(`Total original size: ${totalOriginalSize.toFixed(2)} MB`)
console.log(`Total compressed size: ${totalCompressedSize.toFixed(2)} MB`)
console.log(`Total savings: ${((totalOriginalSize - totalCompressedSize) / totalOriginalSize * 100).toFixed(1)}%`)
console.log(`Space saved: ${(totalOriginalSize - totalCompressedSize).toFixed(2)} MB`)
console.log('\n✅ Compression complete!')
