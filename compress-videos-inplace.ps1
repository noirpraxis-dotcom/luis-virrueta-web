# Script para comprimir videos EN SU LUGAR (mismos nombres y rutas)
# Mantiene las rutas actuales - NO cambia referencias en el código

Write-Host "`n🎬 COMPRESIÓN DE VIDEOS (IN-PLACE)" -ForegroundColor Cyan
Write-Host "=" * 60 -ForegroundColor Gray

$publicPath = ".\public"
$tempFolder = ".\public\temp_compression"

# Crear carpeta temporal
New-Item -ItemType Directory -Force -Path $tempFolder | Out-Null

# Todos los videos en public/ (excepto carpetas ya comprimidas)
$videos = Get-ChildItem -Path $publicPath -Filter "*.mp4" -File

if ($videos.Count -eq 0) {
    Write-Host "`n⚠️  No se encontraron videos .mp4 en public/" -ForegroundColor Yellow
    exit
}

Write-Host "`n📊 Videos encontrados: $($videos.Count)" -ForegroundColor Green
Write-Host "-" * 60

$totalOriginal = 0
$totalCompressed = 0
$processedCount = 0
$skippedCount = 0

foreach ($video in $videos) {
    $originalSize = [math]::Round($video.Length / 1MB, 2)
    $totalOriginal += $originalSize
    
    Write-Host "`n📹 $($video.Name)" -ForegroundColor Cyan
    Write-Host "   Tamaño actual: $originalSize MB" -ForegroundColor White
    
    # Archivo temporal comprimido
    $tempOutput = Join-Path $tempFolder $video.Name
    
    # Comprimir con FFmpeg
    # H.265 (HEVC), CRF 28, audio AAC 128k, resolución máxima 1920x1080
    Write-Host "   Comprimiendo..." -ForegroundColor Yellow
    
    & ffmpeg -i $video.FullName -c:v libx265 -crf 28 -preset medium -vf "scale='min(1920,iw)':'min(1080,ih)':force_original_aspect_ratio=decrease" -c:a aac -b:a 128k -movflags +faststart -y $tempOutput 2>&1 | Out-Null
    
    if ($LASTEXITCODE -eq 0 -and (Test-Path $tempOutput)) {
        $compressedFile = Get-Item $tempOutput
        $compressedSize = [math]::Round($compressedFile.Length / 1MB, 2)
        $savings = [math]::Round((($originalSize - $compressedSize) / $originalSize) * 100, 1)
        
        if ($compressedSize -lt $originalSize) {
            # Reemplazar el archivo original con el comprimido
            Remove-Item $video.FullName -Force
            Move-Item $tempOutput $video.FullName -Force
            
            $totalCompressed += $compressedSize
            $processedCount++
            
            Write-Host "   ✅ Comprimido: $compressedSize MB (ahorro: $savings%)" -ForegroundColor Green
        } else {
            # El archivo comprimido es más grande (raro pero posible)
            Remove-Item $tempOutput -Force
            $totalCompressed += $originalSize
            $skippedCount++
            Write-Host "   ⚠️  Saltado (compresión no redujo tamaño)" -ForegroundColor Yellow
        }
    } else {
        $totalCompressed += $originalSize
        $skippedCount++
        Write-Host "   ❌ Error en compresión" -ForegroundColor Red
    }
}

# Limpiar carpeta temporal
Remove-Item -Path $tempFolder -Recurse -Force -ErrorAction SilentlyContinue

# Resumen final
Write-Host "`n" + ("=" * 60) -ForegroundColor Gray
Write-Host "📊 RESUMEN DE COMPRESIÓN" -ForegroundColor Cyan
Write-Host ("=" * 60) -ForegroundColor Gray

Write-Host "`nVideos procesados:    $processedCount / $($videos.Count)" -ForegroundColor Green
if ($skippedCount -gt 0) {
    Write-Host "Videos saltados:      $skippedCount" -ForegroundColor Yellow
}

Write-Host "`nTamaño original:      $([math]::Round($totalOriginal, 2)) MB" -ForegroundColor White
Write-Host "Tamaño final:         $([math]::Round($totalCompressed, 2)) MB" -ForegroundColor Green
$totalSavings = $totalOriginal - $totalCompressed
$percentSavings = [math]::Round(($totalSavings / $totalOriginal) * 100, 1)
Write-Host "Ahorro total:         $([math]::Round($totalSavings, 2)) MB ($percentSavings%)" -ForegroundColor Cyan

Write-Host "`n✅ COMPRESIÓN COMPLETADA" -ForegroundColor Green
Write-Host "   Los videos mantienen sus nombres y rutas originales" -ForegroundColor Gray
Write-Host "   No es necesario modificar el código" -ForegroundColor Gray
Write-Host "`n"
