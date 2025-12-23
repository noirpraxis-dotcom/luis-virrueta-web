# Script para comprimir imágenes EN SU LUGAR (mismos nombres, cambia extensión a .webp)
# Mantiene estructura - Crea versiones WebP

Write-Host "`n🖼️  COMPRESIÓN DE IMÁGENES A WEBP" -ForegroundColor Cyan
Write-Host "=" * 60 -ForegroundColor Gray

# Verificar si Sharp está instalado
$sharpExists = Test-Path ".\node_modules\sharp"
if (-not $sharpExists) {
    Write-Host "`n⚠️  Instalando Sharp..." -ForegroundColor Yellow
    npm install sharp --save-dev | Out-Null
}

# Script Node.js para comprimir con Sharp
$compressScript = @"
const sharp = require('sharp');
const fs = require('fs');
const path = require('path');

async function compressImages() {
    const publicPath = './public';
    const extensions = ['.jpg', '.jpeg', '.png'];
    let totalOriginal = 0;
    let totalCompressed = 0;
    let processedCount = 0;
    let skippedCount = 0;
    
    function getAllImages(dir, fileList = []) {
        const files = fs.readdirSync(dir);
        
        files.forEach(file => {
            const filePath = path.join(dir, file);
            const stat = fs.statSync(filePath);
            
            if (stat.isDirectory()) {
                // Saltar carpetas ya comprimidas
                if (!file.includes('-compressed') && !file.includes('blog-compressed')) {
                    getAllImages(filePath, fileList);
                }
            } else {
                const ext = path.extname(file).toLowerCase();
                if (extensions.includes(ext)) {
                    fileList.push(filePath);
                }
            }
        });
        
        return fileList;
    }
    
    const images = getAllImages(publicPath);
    console.log('\\n📊 Imágenes encontradas: ' + images.length);
    console.log('-'.repeat(60));
    
    for (const imagePath of images) {
        const fileName = path.basename(imagePath);
        const dir = path.dirname(imagePath);
        const nameWithoutExt = path.parse(fileName).name;
        const outputPath = path.join(dir, nameWithoutExt + '.webp');
        
        // Saltar si ya existe la versión WebP
        if (fs.existsSync(outputPath)) {
            skippedCount++;
            continue;
        }
        
        try {
            const stats = fs.statSync(imagePath);
            const originalSize = (stats.size / (1024 * 1024)).toFixed(2);
            totalOriginal += parseFloat(originalSize);
            
            console.log('\n🖼️  ' + fileName);
            console.log('   Tamaño actual: ' + originalSize + ' MB');
            console.log('   Convirtiendo a WebP...');
            
            // Comprimir a WebP con calidad 85
            await sharp(imagePath)
                .webp({ quality: 85 })
                .toFile(outputPath);
            
            const compressedStats = fs.statSync(outputPath);
            const compressedSize = (compressedStats.size / (1024 * 1024)).toFixed(2);
            totalCompressed += parseFloat(compressedSize);
            
            const savings = (((originalSize - compressedSize) / originalSize) * 100).toFixed(1);
            processedCount++;
            
            console.log('   ✅ WebP creado: ' + compressedSize + ' MB (ahorro: ' + savings + '%)');
            
        } catch (error) {
            console.log('   ❌ Error: ' + error.message);
            skippedCount++;
        }
    }
    
    // Resumen
    console.log('\n' + '='.repeat(60));
    console.log('📊 RESUMEN DE COMPRESIÓN');
    console.log('='.repeat(60));
    console.log('\nImágenes procesadas:  ' + processedCount + ' / ' + images.length);
    if (skippedCount > 0) {
        console.log('Imágenes saltadas:    ' + skippedCount);
    }
    console.log('\nTamaño original:      ' + totalOriginal.toFixed(2) + ' MB');
    console.log('Tamaño WebP:          ' + totalCompressed.toFixed(2) + ' MB');
    const totalSavings = totalOriginal - totalCompressed;
    const percentSavings = ((totalSavings / totalOriginal) * 100).toFixed(1);
    console.log('Ahorro total:         ' + totalSavings.toFixed(2) + ' MB (' + percentSavings + '%)');
    console.log('\n✅ COMPRESIÓN COMPLETADA');
    console.log('   Se crearon versiones WebP junto a los originales');
    console.log('   Los archivos originales se mantienen intactos\n');
}

compressImages().catch(console.error);
"@

# Guardar script temporal
$compressScript | Out-File -FilePath ".\compress-images-temp.cjs" -Encoding UTF8

# Ejecutar compresión
node ".\compress-images-temp.cjs"

# Limpiar script temporal
Remove-Item ".\compress-images-temp.cjs" -Force -ErrorAction SilentlyContinue

Write-Host "`n"
