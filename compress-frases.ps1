# Script para comprimir la imagen frases.png

$inputImage = "public/frases.png"
$outputImage = "public/frases-og.png"

# Verificar si existe el archivo de entrada
if (-not (Test-Path $inputImage)) {
    Write-Host "Error: No se encontró $inputImage" -ForegroundColor Red
    exit 1
}

# Intentar usar ImageMagick si está instalado
$magick = Get-Command magick -ErrorAction SilentlyContinue

if ($magick) {
    Write-Host "Usando ImageMagick para comprimir..." -ForegroundColor Cyan
    magick $inputImage -resize 1200x630^ -gravity center -extent 1200x630 -quality 85 -strip $outputImage
} else {
    # Si no hay ImageMagick, copiar con un aviso
    Write-Host "ImageMagick no está instalado. Copiando imagen original..." -ForegroundColor Yellow
    Copy-Item $inputImage $outputImage -Force
}

# Mostrar tamaños
$inputSize = (Get-Item $inputImage).Length
$outputSize = (Get-Item $outputImage).Length

Write-Host "`nImagen original: $([math]::Round($inputSize / 1KB, 2)) KB" -ForegroundColor White
Write-Host "Imagen optimizada: $([math]::Round($outputSize / 1KB, 2)) KB" -ForegroundColor Green

if ($outputSize -lt $inputSize) {
    $savings = [math]::Round((($inputSize - $outputSize) / $inputSize) * 100, 2)
    Write-Host "Reducción: $savings%" -ForegroundColor Green
}
