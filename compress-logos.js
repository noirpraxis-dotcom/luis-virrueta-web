import sharp from 'sharp'
import { readdir } from 'fs/promises'
import path from 'path'
import { fileURLToPath } from 'url'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

const inputDir = path.join(__dirname, 'public', 'LOGOS CARRUSEL')
const outputDir = path.join(__dirname, 'public', 'logos-compressed')

async function compressLogos() {
  try {
    // Crear carpeta de salida si no existe
    const fs = await import('fs')
    if (!fs.existsSync(outputDir)) {
      fs.mkdirSync(outputDir, { recursive: true })
    }

    // Leer todos los archivos
    const files = await readdir(inputDir)
    const imageFiles = files
      .filter(file => /\.(png|jpg|jpeg)$/i.test(file))
      .sort() // Ordenar alfabéticamente

    console.log(`📦 Comprimiendo ${imageFiles.length} imágenes (ordenadas alfabéticamente)...\n`)

    let totalOriginal = 0
    let totalCompressed = 0

    // Procesar cada imagen
    for (let i = 0; i < imageFiles.length; i++) {
      const file = imageFiles[i]
      const inputPath = path.join(inputDir, file)
      const outputPath = path.join(outputDir, `logo-${i + 1}.webp`)

      // Obtener tamaño original
      const stats = fs.statSync(inputPath)
      const originalSize = stats.size
      totalOriginal += originalSize

      // Comprimir y convertir a WebP
      await sharp(inputPath)
        .resize(800, 800, { // Max 800x800, mantiene aspect ratio
          fit: 'inside',
          withoutEnlargement: true
        })
        .webp({ 
          quality: 85, // 85% de calidad (excelente balance)
          effort: 6    // Máximo esfuerzo de compresión
        })
        .toFile(outputPath)

      // Obtener tamaño comprimido
      const compressedStats = fs.statSync(outputPath)
      const compressedSize = compressedStats.size
      totalCompressed += compressedSize

      const reduction = ((originalSize - compressedSize) / originalSize * 100).toFixed(1)
      
      console.log(`✅ ${file}`)
      console.log(`   Original: ${(originalSize / 1024).toFixed(1)} KB`)
      console.log(`   Comprimido: ${(compressedSize / 1024).toFixed(1)} KB`)
      console.log(`   Reducción: ${reduction}%\n`)
    }

    console.log('═══════════════════════════════════════')
    console.log(`📊 RESUMEN:`)
    console.log(`   Total original: ${(totalOriginal / 1024).toFixed(1)} KB`)
    console.log(`   Total comprimido: ${(totalCompressed / 1024).toFixed(1)} KB`)
    console.log(`   Reducción total: ${((totalOriginal - totalCompressed) / totalOriginal * 100).toFixed(1)}%`)
    console.log(`   Promedio por imagen: ${(totalCompressed / imageFiles.length / 1024).toFixed(1)} KB`)
    console.log('═══════════════════════════════════════')
    console.log(`\n✨ Imágenes comprimidas guardadas en: public/logos-compressed/`)

  } catch (error) {
    console.error('❌ Error:', error.message)
  }
}

compressLogos()
