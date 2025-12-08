import fs from 'fs';
import path from 'path';
import { execSync } from 'child_process';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const inputFile = path.join(__dirname, 'public', 'HEADER ARQUETIPOS.mp4');
const outputFile = path.join(__dirname, 'public', 'header-arquetipos-compressed.mp4');

console.log('🎬 Comprimiendo video HEADER ARQUETIPOS.mp4...\n');

try {
  // Comprimir con ffmpeg - calidad alta pero tamaño reducido
  execSync(
    `ffmpeg -i "${inputFile}" -c:v libx264 -crf 28 -preset slow -c:a aac -b:a 128k "${outputFile}"`,
    { stdio: 'inherit' }
  );
  
  const inputStats = fs.statSync(inputFile);
  const outputStats = fs.statSync(outputFile);
  const reduction = ((1 - outputStats.size / inputStats.size) * 100).toFixed(1);
  
  console.log('\n✅ Compresión completada!');
  console.log(`📦 Tamaño original: ${(inputStats.size / 1024 / 1024).toFixed(2)} MB`);
  console.log(`📦 Tamaño comprimido: ${(outputStats.size / 1024 / 1024).toFixed(2)} MB`);
  console.log(`📉 Reducción: ${reduction}%`);
} catch (error) {
  console.error('❌ Error al comprimir:', error.message);
}
