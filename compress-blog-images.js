import sharp from 'sharp';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const inputDir = path.join(__dirname, 'public', 'IMAGENES BLOG');
const outputDir = path.join(__dirname, 'public', 'blog-compressed');

// Crear directorio de salida si no existe
if (!fs.existsSync(outputDir)) {
  fs.mkdirSync(outputDir, { recursive: true });
}

// Mapeo de nombres originales a nombres finales
const imageMapping = {
  'cliente es heroe.jpg': 'cliente-heroe.webp',
  'persuación.jpg': 'persuasion.webp',
  'presuacion.jpg': 'presuasion.webp',
  'paralisis de elección.jpg': 'paralisis-eleccion.webp',
  'que ia contratar.jpg': 'blog-11-que-ia-contratar.webp',
  'la inteligencia no acumula.jpg': 'blog-12-inteligencia-no-acumula.webp',
  'cerebro decide antes de que tu.jpg': 'blog-13-cerebro-decide-antes.webp',
  'no busca informacion.jpg': 'blog-14-no-busca-informacion.webp',
  'cloudflare.jpg': 'blog-15-cloudflare.webp',
  'mapa mental.jpg': 'blog-16-mapa-ias-2025.webp'
};

async function compressImages() {
  try {
    console.log('🖼️  Comprimiendo imágenes del blog...\n');
    
    let totalOriginalSize = 0;
    let totalCompressedSize = 0;
    
    // Procesar imágenes nuevas
    for (const [originalName, compressedName] of Object.entries(imageMapping)) {
      const inputPath = path.join(inputDir, originalName);
      const outputPath = path.join(outputDir, compressedName);
      
      if (!fs.existsSync(inputPath)) {
        console.log(`⚠️  Archivo no encontrado: ${originalName}`);
        continue;
      }
      
      const originalStats = fs.statSync(inputPath);
      totalOriginalSize += originalStats.size;
      
      // Comprimir con Sharp
      await sharp(inputPath)
        .resize(1920, 1080, { 
          fit: 'cover',
          position: 'center'
        })
        .webp({ 
          quality: 85,
          effort: 6 
        })
        .toFile(outputPath);
      
      const compressedStats = fs.statSync(outputPath);
      totalCompressedSize += compressedStats.size;
      
      const reduction = ((1 - compressedStats.size / originalStats.size) * 100).toFixed(1);
      
      console.log(`✅ ${originalName}`);
      console.log(`   → ${compressedName}`);
      console.log(`   📉 ${(originalStats.size / 1024).toFixed(0)}KB → ${(compressedStats.size / 1024).toFixed(0)}KB (reducción: ${reduction}%)\n`);
    }
    
    // También copiar/comprimir las existentes 1.jpg a 6.jpg
    console.log('📸 Procesando imágenes existentes (1.jpg - 6.jpg)...\n');
    
    for (let i = 1; i <= 6; i++) {
      const inputPath = path.join(inputDir, `${i}.jpg`);
      const outputPath = path.join(outputDir, `blog-${i}.webp`);
      
      if (!fs.existsSync(inputPath)) continue;
      
      const originalStats = fs.statSync(inputPath);
      totalOriginalSize += originalStats.size;
      
      await sharp(inputPath)
        .resize(1920, 1080, { 
          fit: 'cover',
          position: 'center'
        })
        .webp({ 
          quality: 85,
          effort: 6 
        })
        .toFile(outputPath);
      
      const compressedStats = fs.statSync(outputPath);
      totalCompressedSize += compressedStats.size;
      
      const reduction = ((1 - compressedStats.size / originalStats.size) * 100).toFixed(1);
      
      console.log(`✅ ${i}.jpg → blog-${i}.webp`);
      console.log(`   📉 ${(originalStats.size / 1024).toFixed(0)}KB → ${(compressedStats.size / 1024).toFixed(0)}KB (reducción: ${reduction}%)\n`);
    }
    
    const totalReduction = ((1 - totalCompressedSize / totalOriginalSize) * 100).toFixed(1);
    
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log(`✨ COMPRESIÓN COMPLETADA`);
    console.log(`📊 Tamaño original: ${(totalOriginalSize / 1024 / 1024).toFixed(2)} MB`);
    console.log(`📊 Tamaño comprimido: ${(totalCompressedSize / 1024 / 1024).toFixed(2)} MB`);
    console.log(`🎯 Reducción total: ${totalReduction}%`);
    console.log(`📁 Imágenes guardadas en: ${outputDir}`);
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    
  } catch (error) {
    console.error('❌ Error al comprimir imágenes:', error);
  }
}

compressImages();
