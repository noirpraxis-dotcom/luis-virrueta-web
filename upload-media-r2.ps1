# Upload media files to R2 bucket luisvirrueta-media
# Structure: headers/ | blog/ | products/ | misc/
# Run from: página web zuzana/

$bucket = "luisvirrueta-media"
$publicDir = "public"

# ── HEADER VIDEOS ──────────────────────────────────────────────
$headerVideos = @(
    @{ local = "$publicDir/header psicologia.mp4";    key = "headers/header-psicologia.mp4" }
    @{ local = "$publicDir/hero Sobre mi.mp4";        key = "headers/hero-sobre-mi.mp4" }
    @{ local = "$publicDir/hero servicios.mp4";       key = "headers/hero-servicios.mp4" }
    @{ local = "$publicDir/sobre mi vid.mp4";         key = "headers/sobre-mi-vid.mp4" }
    @{ local = "$publicDir/contacto-luis.mp4";        key = "headers/contacto-luis.mp4" }
    @{ local = "$publicDir/ajedrez video.mp4";        key = "headers/ajedrez-video.mp4" }
    @{ local = "$publicDir/Frases.mp4";               key = "headers/frases.mp4" }
    @{ local = "$publicDir/metodologia fases.mp4";    key = "headers/metodologia-fases.mp4" }
    @{ local = "$publicDir/tiempo metodo.mp4";        key = "headers/tiempo-metodo.mp4" }
    @{ local = "$publicDir/servicios videos.mp4";     key = "headers/servicios-videos.mp4" }
    @{ local = "$publicDir/carrito-compra.mp4";       key = "headers/carrito-compra.mp4" }
    @{ local = "$publicDir/dilema.mp4";               key = "headers/dilema.mp4" }
)

# ── BLOG IMAGES ────────────────────────────────────────────────
$blogImages = @()
if (Test-Path "$publicDir/IMAGENES BLOG") {
    Get-ChildItem "$publicDir/IMAGENES BLOG" -File | ForEach-Object {
        $safeName = $_.Name -replace ' ', '-' -replace '[^a-zA-Z0-9_\-\.]', ''
        $blogImages += @{ local = $_.FullName; key = "blog/$safeName" }
    }
}
if (Test-Path "$publicDir/blog-compressed") {
    Get-ChildItem "$publicDir/blog-compressed" -File | ForEach-Object {
        $safeName = $_.Name -replace ' ', '-' -replace '[^a-zA-Z0-9_\-\.]', ''
        $blogImages += @{ local = $_.FullName; key = "blog/$safeName" }
    }
}

# ── PRODUCT IMAGES & VIDEOS ───────────────────────────────────
$productFiles = @()

# Radiografia de pareja
if (Test-Path "$publicDir/productos/radar de pareja/videos") {
    Get-ChildItem "$publicDir/productos/radar de pareja/videos" -File | ForEach-Object {
        $safeName = $_.Name -replace ' ', '-' -replace '[^a-zA-Z0-9_\-\.]', ''
        $productFiles += @{ local = $_.FullName; key = "products/radiografia/$safeName" }
    }
}
if (Test-Path "$publicDir/productos/radar de pareja/imagenes 12 psicologos") {
    Get-ChildItem "$publicDir/productos/radar de pareja/imagenes 12 psicologos" -File | ForEach-Object {
        $safeName = $_.Name -replace ' ', '-' -replace '[^a-zA-Z0-9_\-\.]', ''
        $productFiles += @{ local = $_.FullName; key = "products/radiografia/$safeName" }
    }
}

# Consulta pareja
if (Test-Path "$publicDir/productos/consulta pareja") {
    # Video
    if (Test-Path "$publicDir/productos/consulta pareja/VIDEO AMOR.mp4") {
        $productFiles += @{ local = "$publicDir/productos/consulta pareja/VIDEO AMOR.mp4"; key = "products/consulta-pareja/video-amor.mp4" }
    }
    # Carpeta conexion
    $conexionPath = Join-Path $publicDir "productos\consulta pareja" | Get-ChildItem -Directory | Where-Object { $_.Name -match "CONEXI" } | Select-Object -First 1
    if ($conexionPath) {
        Get-ChildItem $conexionPath.FullName -File | ForEach-Object {
            $safeName = $_.Name -replace ' ', '-' -replace '[^a-zA-Z0-9_\-\.]', ''
            $productFiles += @{ local = $_.FullName; key = "products/consulta-pareja/conexion/$safeName" }
        }
    }
    # imagenes pareja
    if (Test-Path "$publicDir/productos/consulta pareja/imagenes pareja") {
        Get-ChildItem "$publicDir/productos/consulta pareja/imagenes pareja" -File | ForEach-Object {
            $safeName = $_.Name -replace ' ', '-' -replace '[^a-zA-Z0-9_\-\.]', ''
            $productFiles += @{ local = $_.FullName; key = "products/consulta-pareja/imagenes-pareja/$safeName" }
        }
    }
    # TRAUMA Y PATRONES
    if (Test-Path "$publicDir/productos/consulta pareja/TRAUMA Y PATRONES") {
        Get-ChildItem "$publicDir/productos/consulta pareja/TRAUMA Y PATRONES" -File | ForEach-Object {
            $safeName = $_.Name -replace ' ', '-' -replace '[^a-zA-Z0-9_\-\.]', ''
            $productFiles += @{ local = $_.FullName; key = "products/consulta-pareja/trauma-patrones/$safeName" }
        }
    }
}

# Consulta individual
if (Test-Path "$publicDir/productos/consulta individual") {
    if (Test-Path "$publicDir/productos/consulta individual/imagenes consulta") {
        Get-ChildItem "$publicDir/productos/consulta individual/imagenes consulta" -File | ForEach-Object {
            $safeName = $_.Name -replace ' ', '-' -replace '[^a-zA-Z0-9_\-\.]', ''
            $productFiles += @{ local = $_.FullName; key = "products/consulta-individual/imagenes-consulta/$safeName" }
        }
    }
    if (Test-Path "$publicDir/productos/consulta individual/imagenes traumas e inconsciente") {
        Get-ChildItem "$publicDir/productos/consulta individual/imagenes traumas e inconsciente" -File | ForEach-Object {
            $safeName = $_.Name -replace ' ', '-' -replace '[^a-zA-Z0-9_\-\.]', ''
            $productFiles += @{ local = $_.FullName; key = "products/consulta-individual/traumas-inconsciente/$safeName" }
        }
    }
}

# TEST PAREJA (landing page images)
if (Test-Path "$publicDir/TEST PAREJA") {
    Get-ChildItem "$publicDir/TEST PAREJA" -File | ForEach-Object {
        $safeName = $_.Name -replace ' ', '-' -replace '[^a-zA-Z0-9_\-\.]', ''
        $productFiles += @{ local = $_.FullName; key = "products/test-pareja/$safeName" }
    }
}

# ── UPLOAD ALL ─────────────────────────────────────────────────
$allFiles = $headerVideos + $blogImages + $productFiles
$total = $allFiles.Count
$i = 0
$errors = @()

Write-Host "=== Subiendo $total archivos a R2 bucket: $bucket ===" -ForegroundColor Cyan

foreach ($f in $allFiles) {
    $i++
    $localPath = $f.local
    $r2Key = $f.key
    
    if (-not (Test-Path $localPath)) {
        Write-Host "  [$i/$total] SKIP (no existe): $localPath" -ForegroundColor Yellow
        continue
    }
    
    $sizeMB = [math]::Round((Get-Item $localPath).Length / 1MB, 1)
    Write-Host "  [$i/$total] $r2Key ($sizeMB MB)..." -ForegroundColor Gray -NoNewline
    
    try {
        $output = npx wrangler r2 object put "$bucket/$r2Key" --file="$localPath" --remote 2>&1
        if ($LASTEXITCODE -eq 0) {
            Write-Host " OK" -ForegroundColor Green
        } else {
            Write-Host " ERROR" -ForegroundColor Red
            $errors += "$r2Key : $output"
        }
    } catch {
        Write-Host " ERROR: $_" -ForegroundColor Red
        $errors += "$r2Key : $_"
    }
}

Write-Host ""
Write-Host "=== Subida completa: $($total - $errors.Count)/$total exitosos ===" -ForegroundColor Cyan
if ($errors.Count -gt 0) {
    Write-Host "Errores:" -ForegroundColor Red
    $errors | ForEach-Object { Write-Host "  $_" -ForegroundColor Red }
}
