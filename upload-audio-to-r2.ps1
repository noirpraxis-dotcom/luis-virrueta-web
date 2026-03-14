# upload-audio-to-r2.ps1
# ──────────────────────────────────────────────────────────────
# Sube todos los archivos de public/audio/ al bucket R2
# "luisvirrueta-audio" y los guarda bajo la misma ruta relativa.
#
# Uso:
#   cd "página web zuzana"
#   .\upload-audio-to-r2.ps1
#
# Pre-requisitos:
#   - npx wrangler autenticado (wrangler login)
#   - R2 activado en el dashboard de Cloudflare
#   - Bucket creado: npx wrangler r2 bucket create luisvirrueta-audio
# ──────────────────────────────────────────────────────────────

$bucket  = "luisvirrueta-audio"
$baseDir = Join-Path $PSScriptRoot "public"
$audioDir = Join-Path $baseDir "audio"

if (-not (Test-Path $audioDir)) {
    Write-Error "No se encontró la carpeta: $audioDir"
    exit 1
}

$files = Get-ChildItem $audioDir -Recurse -File
$total = $files.Count
$index = 0

Write-Host "Subiendo $total archivos al bucket '$bucket'..." -ForegroundColor Cyan

foreach ($file in $files) {
    $index++
    # Ruta relativa desde public/  →  "audio/diagnostico/q1.mp3"
    $key = $file.FullName.Substring($baseDir.Length + 1).Replace('\', '/')

    Write-Host "[$index/$total] $key" -ForegroundColor Gray

    npx wrangler r2 object put "$bucket/$key" `
        --file $file.FullName `
        --content-type "audio/mpeg" 2>&1 | Out-Null

    if ($LASTEXITCODE -ne 0) {
        Write-Warning "Error al subir: $key"
    }
}

Write-Host ""
Write-Host "¡Listo! $total archivos subidos a R2." -ForegroundColor Green
Write-Host ""
Write-Host "Próximo paso: elimina los audios del repo para acelerar deploys:" -ForegroundColor Yellow
Write-Host "  git rm -r --cached public/audio/" -ForegroundColor White
Write-Host "  git add -A" -ForegroundColor White
Write-Host "  git commit -m 'chore: remove audio from git (now served from R2)'" -ForegroundColor White
Write-Host "  git push origin main" -ForegroundColor White
