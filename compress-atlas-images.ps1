# Script para comprimir automáticamente imágenes del Atlas de la Humanidad
# Autor: Luis Virrueta
# Fecha: 25 Diciembre 2025

<#
.SYNOPSIS
    Comprime automáticamente imágenes nuevas del Atlas de la Humanidad

.DESCRIPTION
    Este script:
    1. Busca imágenes nuevas en "public/atlas de la humanidad/"
    2. Las comprime usando ImageMagick (si está instalado) o copia sin comprimir
    3. Mantiene calidad visual pero reduce tamaño de archivo
    4. Genera reporte de compresión

.EXAMPLE
    .\compress-atlas-images.ps1
    
.NOTES
    Requiere ImageMagick para comprimir (opcional)
    Instalar: winget install ImageMagick.ImageMagick
#>

# Configuración
$sourcePath = "public\atlas de la humanidad"
$tempPath = "public\atlas de la humanidad\temp"
$quality = 85 # Calidad JPEG (1-100, 85 es buen balance)
$maxWidth = 1920 # Ancho máximo en píxeles

# Colores para output
$colors = @{
    Success = "Green"
    Info = "Cyan"
    Warning = "Yellow"
    Error = "Red"
}

function Write-ColorOutput {
    param(
        [string]$Message,
        [string]$Type = "Info"
    )
    Write-Host $Message -ForegroundColor $colors[$Type]
}

function Test-ImageMagick {
    try {
        $null = magick -version 2>&1
        return $true
    } catch {
        return $false
    }
}

function Compress-Image {
    param(
        [string]$InputPath,
        [string]$OutputPath
    )
    
    $hasImageMagick = Test-ImageMagick
    
    if (-not $hasImageMagick) {
        Write-ColorOutput "⚠️  ImageMagick no está instalado. Copiando archivo sin comprimir..." "Warning"
        Write-ColorOutput "💡 Para comprimir, instala ImageMagick: winget install ImageMagick.ImageMagick" "Info"
        Copy-Item -Path $InputPath -Destination $OutputPath -Force
        return $false
    }
    
    try {
        # Obtener extensión original
        $extension = [System.IO.Path]::GetExtension($InputPath).ToLower()
        
        # Comando de compresión
        if ($extension -eq ".png") {
            # PNG: Convertir a WebP o mantener PNG con compresión
            $webpPath = $OutputPath -replace '\.png$', '.webp'
            magick "$InputPath" -resize "${maxWidth}x>" -quality $quality "$webpPath"
            Write-ColorOutput "✅ Comprimido a WebP: $webpPath" "Success"
        } else {
            # JPG/JPEG: Optimizar
            magick "$InputPath" -resize "${maxWidth}x>" -quality $quality -strip "$OutputPath"
            Write-ColorOutput "✅ Comprimido: $OutputPath" "Success"
        }
        
        # Comparar tamaños
        $originalSize = (Get-Item $InputPath).Length
        $compressedSize = (Get-Item $OutputPath).Length
        $reduction = [math]::Round((1 - ($compressedSize / $originalSize)) * 100, 2)
        
        Write-ColorOutput "   📊 Original: $([math]::Round($originalSize/1KB, 2)) KB" "Info"
        Write-ColorOutput "   📊 Comprimido: $([math]::Round($compressedSize/1KB, 2)) KB" "Info"
        Write-ColorOutput "   📊 Reducción: $reduction%" "Success"
        
        return $true
    } catch {
        Write-ColorOutput "❌ Error al comprimir: $_" "Error"
        return $false
    }
}

# Inicio del script
Write-ColorOutput "`n🖼️  COMPRESOR DE IMÁGENES - ATLAS DE LA HUMANIDAD" "Info"
Write-ColorOutput "================================================`n" "Info"

# Verificar que existe el directorio
if (-not (Test-Path $sourcePath)) {
    Write-ColorOutput "❌ No se encuentra el directorio: $sourcePath" "Error"
    exit 1
}

# Crear directorio temporal si no existe
if (-not (Test-Path $tempPath)) {
    New-Item -ItemType Directory -Path $tempPath -Force | Out-Null
}

# Buscar imágenes
$images = Get-ChildItem -Path $sourcePath -Include *.jpg,*.jpeg,*.png,*.webp -File | 
    Where-Object { $_.DirectoryName -notmatch 'temp' }

if ($images.Count -eq 0) {
    Write-ColorOutput "ℹ️  No se encontraron imágenes para comprimir" "Info"
    exit 0
}

Write-ColorOutput "📁 Encontradas $($images.Count) imágenes`n" "Info"

# Procesar cada imagen
$compressed = 0
$skipped = 0

foreach ($image in $images) {
    Write-ColorOutput "`n🖼️  Procesando: $($image.Name)" "Info"
    
    $outputPath = Join-Path $sourcePath $image.Name
    
    # Si la imagen ya está optimizada (menos de 500KB), skip
    if ($image.Length -lt 500KB) {
        Write-ColorOutput "   ⏭️  Ya está optimizada (< 500KB), omitiendo..." "Warning"
        $skipped++
        continue
    }
    
    $result = Compress-Image -InputPath $image.FullName -OutputPath $outputPath
    
    if ($result) {
        $compressed++
    } else {
        $skipped++
    }
}

# Limpiar directorio temporal
if (Test-Path $tempPath) {
    Remove-Item -Path $tempPath -Recurse -Force -ErrorAction SilentlyContinue
}

# Resumen
Write-ColorOutput "`n================================================" "Info"
Write-ColorOutput "✅ Comprimidas: $compressed imágenes" "Success"
Write-ColorOutput "⏭️  Omitidas: $skipped imágenes" "Warning"
Write-ColorOutput "================================================`n" "Info"

# Instrucciones finales
Write-ColorOutput "📝 SIGUIENTE PASO:" "Info"
Write-ColorOutput "1. Abre src/data/atlasData.js" "Info"
Write-ColorOutput "2. Copia el template al final" "Info"
Write-ColorOutput "3. Llena los datos de tu nueva imagen" "Info"
Write-ColorOutput "4. Guarda y recarga la página`n" "Info"

Write-ColorOutput "🎨 La imagen ya está lista para usar en el Atlas!`n" "Success"
