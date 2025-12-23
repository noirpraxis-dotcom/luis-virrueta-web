# Comprimir videos eliminando audio (muteados)
# Para máximo performance en web

Write-Host "`n🎬 OPTIMIZACIÓN DE VIDEOS SIN AUDIO" -ForegroundColor Cyan
Write-Host "=" * 50 -ForegroundColor DarkGray

# Configurar PATH para ffmpeg
$env:Path = [System.Environment]::GetEnvironmentVariable('Path','Machine') + ';' + [System.Environment]::GetEnvironmentVariable('Path','User')

# Verificar ffmpeg
if (-not (Get-Command ffmpeg -ErrorAction SilentlyContinue)) {
    Write-Host "❌ FFmpeg no encontrado" -ForegroundColor Red
    exit 1
}

# Directorio de trabajo
$publicDir = "c:\Users\PC\Desktop\APLICACIONES\luis virrueta\página web zuzana\public"
Set-Location $publicDir

# Encontrar todos los videos MP4 mayores a 1.5 MB
$videos = Get-ChildItem -Path . -Filter "*.mp4" -File | Where-Object { $_.Length -gt 1.5MB } | Sort-Object Length -Descending

Write-Host "`n📊 Videos a optimizar: $($videos.Count)" -ForegroundColor Yellow
Write-Host ""

$totalBefore = 0
$totalAfter = 0
$count = 0

foreach ($video in $videos) {
    $count++
    $sizeBefore = [math]::Round($video.Length / 1MB, 2)
    $totalBefore += $sizeBefore
    
    Write-Host "[$count/$($videos.Count)] $($video.Name)" -ForegroundColor White
    Write-Host "  📏 Tamaño actual: $sizeBefore MB" -ForegroundColor Gray
    
    $tempFile = "$($video.BaseName)_optimized.mp4"
    
    # Comprimir: CRF 32, 1080px, SIN AUDIO
    $output = ffmpeg -i $video.Name -c:v libx264 -crf 32 -preset fast -vf "scale='min(1080,iw)':-2" -an -movflags +faststart $tempFile -y 2>&1
    
    if (Test-Path $tempFile) {
        $sizeAfter = [math]::Round((Get-Item $tempFile).Length / 1MB, 2)
        $reduction = [math]::Round((($sizeBefore - $sizeAfter) / $sizeBefore) * 100, 1)
        
        if ($sizeAfter -lt $sizeBefore) {
            # Reemplazar original
            Move-Item $tempFile $video.Name -Force
            $totalAfter += $sizeAfter
            Write-Host "  ✅ Optimizado: $sizeAfter MB (-$reduction%)" -ForegroundColor Green
        } else {
            # No mejoró, mantener original
            Remove-Item $tempFile -Force
            $totalAfter += $sizeBefore
            Write-Host "  ⚠️  Sin mejora, mantener original" -ForegroundColor Yellow
        }
    } else {
        Write-Host "  ❌ Error al comprimir" -ForegroundColor Red
        $totalAfter += $sizeBefore
    }
    
    Write-Host ""
}

# Resumen
Write-Host "=" * 50 -ForegroundColor DarkGray
Write-Host "`n📊 RESUMEN" -ForegroundColor Cyan
Write-Host "  Videos procesados: $count" -ForegroundColor White
Write-Host "  Tamaño antes: $([math]::Round($totalBefore, 2)) MB" -ForegroundColor Yellow
Write-Host "  Tamaño después: $([math]::Round($totalAfter, 2)) MB" -ForegroundColor Green
Write-Host "  Ahorro total: $([math]::Round($totalBefore - $totalAfter, 2)) MB" -ForegroundColor Magenta
Write-Host "  Reducción: $([math]::Round((($totalBefore - $totalAfter) / $totalBefore) * 100, 1))%" -ForegroundColor Cyan
Write-Host ""
