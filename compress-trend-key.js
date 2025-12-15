import sharp from 'sharp';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const inputPath = path.join(__dirname, 'public/IMAGENES BLOG/trend y key.jpg');
const outputPath = path.join(__dirname, 'public/blog-compressed/blog-21-trend-keyword-gap.webp');

console.log('🖼️  Comprimiendo trend y key.jpg...\n');

sharp(inputPath)
  .webp({ quality: 85 })
  .toFile(outputPath)
  .then(info => {
    const originalSize = fs.statSync(inputPath).size;
    const compressedSize = info.size;
    const reduction = ((originalSize - compressedSize) / originalSize * 100).toFixed(1);
    
    console.log(`✅ trend y key.jpg → blog-21-trend-keyword-gap.webp`);
    console.log(`📉 ${(originalSize / 1024).toFixed(0)}KB → ${(compressedSize / 1024).toFixed(0)}KB (reducción: ${reduction}%)`);
    console.log(`\n✨ ¡Imagen optimizada con éxito!`);
  })
  .catch(err => {
    console.error('❌ Error:', err);
  });
