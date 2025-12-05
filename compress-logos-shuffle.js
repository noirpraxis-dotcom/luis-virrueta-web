import sharp from 'sharp';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const inputDir = path.join(__dirname, 'public', 'LOGOS CARRUSEL');
const outputDir = path.join(__dirname, 'public', 'logos-compressed');

// Crear carpeta de salida si no existe
if (!fs.existsSync(outputDir)) {
  fs.mkdirSync(outputDir, { recursive: true });
}

async function compressLogos() {
  try {
    const files = fs.readdirSync(inputDir);
    
    // Filtrar solo imágenes
    const imageFiles = files.filter(file => 
      /\.(png|jpg|jpeg|webp)$/i.test(file)
    );
    
    console.log(`📁 Encontrados ${imageFiles.length} logos`);
    
    // Mezclar aleatoriamente los logos
    const shuffledFiles = imageFiles.sort(() => Math.random() - 0.5);
    
    let originalSize = 0;
    let compressedSize = 0;
    
    for (let i = 0; i < shuffledFiles.length; i++) {
      const fileName = shuffledFiles[i];
      const inputPath = path.join(inputDir, fileName);
      const outputPath = path.join(outputDir, `logo-${i + 1}.webp`);
      
      // Tamaño original
      const stats = fs.statSync(inputPath);
      originalSize += stats.size;
      
      // Comprimir y convertir a WebP
      await sharp(inputPath)
        .resize(1200, 1200, {
          fit: 'inside',
          withoutEnlargement: true
        })
        .webp({
          quality: 85,
          effort: 6
        })
        .toFile(outputPath);
      
      // Tamaño comprimido
      const compressedStats = fs.statSync(outputPath);
      compressedSize += compressedStats.size;
      
      const reduction = ((1 - compressedStats.size / stats.size) * 100).toFixed(1);
      const sizeKB = (compressedStats.size / 1024).toFixed(1);
      
      console.log(`✅ ${i + 1}/${shuffledFiles.length}: ${fileName} → logo-${i + 1}.webp (${sizeKB} KB, -${reduction}%)`);
    }
    
    const totalReduction = ((1 - compressedSize / originalSize) * 100).toFixed(1);
    
    console.log(`\n📊 Resumen:`);
    console.log(`   Original: ${(originalSize / 1024 / 1024).toFixed(2)} MB`);
    console.log(`   Comprimido: ${(compressedSize / 1024 / 1024).toFixed(2)} MB`);
    console.log(`   Reducción total: ${totalReduction}%`);
    console.log(`\n✨ ¡${shuffledFiles.length} logos comprimidos y mezclados exitosamente!`);
    
  } catch (error) {
    console.error('❌ Error:', error);
  }
}

compressLogos();
