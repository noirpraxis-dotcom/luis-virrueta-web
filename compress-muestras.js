import sharp from 'sharp';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const inputDir = path.join(__dirname, 'public', 'carrusel muestras');
const outputDir = path.join(__dirname, 'public', 'muestras-compressed');

// Crear directorio de salida si no existe
if (!fs.existsSync(outputDir)) {
  fs.mkdirSync(outputDir, { recursive: true });
}

async function compressImages() {
  try {
    const files = fs.readdirSync(inputDir);
    
    // Filtrar solo imágenes y ordenar alfabéticamente
    const imageFiles = files
      .filter(file => /\.(png|jpg|jpeg)$/i.test(file))
      .sort();

    console.log(`📁 Encontradas ${imageFiles.length} imágenes en carrusel muestras`);
    
    let totalOriginalSize = 0;
    let totalCompressedSize = 0;
    
    // Procesar cada imagen
    for (let i = 0; i < imageFiles.length; i++) {
      const file = imageFiles[i];
      const inputPath = path.join(inputDir, file);
      const outputPath = path.join(outputDir, `muestra-${i + 1}.webp`);
      
      const originalStats = fs.statSync(inputPath);
      totalOriginalSize += originalStats.size;
      
      // Comprimir con Sharp
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
      
      const compressedStats = fs.statSync(outputPath);
      totalCompressedSize += compressedStats.size;
      
      const reduction = ((1 - compressedStats.size / originalStats.size) * 100).toFixed(1);
      
      console.log(`✅ ${i + 1}/${imageFiles.length}: ${file} → muestra-${i + 1}.webp (${(compressedStats.size / 1024).toFixed(1)} KB, -${reduction}%)`);
    }
    
    const totalReduction = ((1 - totalCompressedSize / totalOriginalSize) * 100).toFixed(1);
    
    console.log('\n📊 Resumen:');
    console.log(`   Original: ${(totalOriginalSize / 1024 / 1024).toFixed(2)} MB`);
    console.log(`   Comprimido: ${(totalCompressedSize / 1024 / 1024).toFixed(2)} MB`);
    console.log(`   Reducción total: ${totalReduction}%`);
    console.log(`\n✨ ¡${imageFiles.length} muestras comprimidas exitosamente!`);
    
  } catch (error) {
    console.error('❌ Error durante la compresión:', error);
    process.exit(1);
  }
}

compressImages();
