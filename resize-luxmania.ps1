# Resize luxmania perfil.webp to 400x400 for better performance
# Current: 1500x1500 (492 KiB) -> Target: 400x400 (~30 KiB)

Write-Host "`n🖼️  REDIMENSIONANDO LUXMANIA PERFIL" -ForegroundColor Cyan
Write-Host "============================================`n" -ForegroundColor Cyan

# Check if Sharp is installed
$sharpInstalled = npm list sharp 2>$null | Select-String "sharp@"

if (-not $sharpInstalled) {
    Write-Host "📦 Instalando Sharp..." -ForegroundColor Yellow
    npm install --save-dev sharp --silent
}

# Create resize script
$resizeScript = @'
const sharp = require('sharp');
const fs = require('fs');
const path = require('path');

const inputFile = 'public/luxmania perfil.webp';
const outputFile = 'public/luxmania perfil-optimized.webp';

console.log('📏 Redimensionando luxmania perfil.webp...');

const originalSize = fs.statSync(inputFile).size;
console.log(`   Original: ${(originalSize / 1024).toFixed(2)} KiB`);

sharp(inputFile)
    .resize(400, 400, {
        fit: 'cover',
        position: 'center'
    })
    .webp({ quality: 90 })
    .toFile(outputFile)
    .then(info => {
        const newSize = info.size;
        const savings = ((originalSize - newSize) / originalSize * 100).toFixed(1);
        console.log(`   Nuevo: ${(newSize / 1024).toFixed(2)} KiB`);
        console.log(`   ✅ Ahorro: ${savings}%`);
        
        // Replace original with optimized
        fs.unlinkSync(inputFile);
        fs.renameSync(outputFile, inputFile);
        console.log(`\n✅ luxmania perfil.webp optimizado: 1500x1500 -> 400x400`);
    })
    .catch(err => {
        console.error('❌ Error:', err.message);
        process.exit(1);
    });
'@

# Save script
$resizeScript | Out-File -FilePath "resize-luxmania-temp.cjs" -Encoding utf8 -NoNewline

# Run script
node resize-luxmania-temp.cjs

# Cleanup
Remove-Item "resize-luxmania-temp.cjs" -ErrorAction SilentlyContinue

Write-Host "`n============================================" -ForegroundColor Green
Write-Host "✅ OPTIMIZACIÓN COMPLETADA" -ForegroundColor Green
