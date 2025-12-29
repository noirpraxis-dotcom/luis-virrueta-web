# Script para encontrar archivos media no usados
$publicFolder = "public"
$srcFolder = "src"

# Obtener todos los archivos de media
$mediaFiles = Get-ChildItem -Path $publicFolder -Include "*.mp4","*.webp","*.jpg","*.png","*.gif" -Recurse -File

# Leer todo el contenido de los archivos JSX/JS
$allCode = Get-ChildItem -Path $srcFolder -Include "*.jsx","*.js" -Recurse -File | ForEach-Object { Get-Content $_.FullName -Raw } | Out-String

$unusedFiles = @()

foreach ($file in $mediaFiles) {
    $fileName = $file.Name
    $relativePath = $file.FullName.Replace((Get-Item $publicFolder).FullName, "").Replace("\", "/")
    
    # Buscar el nombre del archivo o su ruta relativa en el código
    if (-not ($allCode -like "*$fileName*")) {
        $unusedFiles += [PSCustomObject]@{
            Name = $fileName
            Path = $relativePath
            Size = [math]::Round($file.Length / 1MB, 2)
        }
    }
}

Write-Host "`n===== ARCHIVOS MEDIA NO USADOS =====" -ForegroundColor Yellow
Write-Host "Total encontrados: $($unusedFiles.Count)`n" -ForegroundColor Cyan

$unusedFiles | Sort-Object Size -Descending | ForEach-Object {
    Write-Host "$($_.Name)" -ForegroundColor Red
    Write-Host "  Ruta: $($_.Path)" -ForegroundColor Gray
    Write-Host "  Tamaño: $($_.Size) MB`n" -ForegroundColor Gray
}

$totalSize = ($unusedFiles | Measure-Object -Property Size -Sum).Sum
Write-Host "`nEspacio total a liberar: $([math]::Round($totalSize, 2)) MB" -ForegroundColor Green
