# ====================================
# LUXMANIA TREND MONITOR PRO
# Instalación y Ejecución
# ====================================

Write-Host "🚀 Instalando Trend Monitor Pro..." -ForegroundColor Cyan
Write-Host ""

# Verificar Python
Write-Host "Verificando Python..." -ForegroundColor Yellow
$pythonVersion = python --version 2>&1
if ($LASTEXITCODE -eq 0) {
    Write-Host "✅ Python instalado: $pythonVersion" -ForegroundColor Green
} else {
    Write-Host "❌ Python no encontrado. Instálalo desde: https://www.python.org/downloads/" -ForegroundColor Red
    exit 1
}

# Instalar dependencias
Write-Host ""
Write-Host "📦 Instalando dependencias..." -ForegroundColor Yellow
pip install requests --quiet

Write-Host ""
Write-Host "✅ Instalación completada!" -ForegroundColor Green
Write-Host ""
Write-Host "=====================================" -ForegroundColor Cyan
Write-Host "  CÓMO USAR EL TREND MONITOR" -ForegroundColor White
Write-Host "=====================================" -ForegroundColor Cyan
Write-Host ""
Write-Host "Ejecutar manualmente:" -ForegroundColor Yellow
Write-Host "  python trend-monitor.py" -ForegroundColor White
Write-Host ""
Write-Host "Programar ejecución semanal:" -ForegroundColor Yellow
Write-Host "  1. Abre 'Programador de tareas' (Windows)" -ForegroundColor White
Write-Host "  2. Crear tarea básica" -ForegroundColor White
Write-Host "  3. Programa: Semanal (lunes 9am)" -ForegroundColor White
Write-Host "  4. Acción: python.exe" -ForegroundColor White
Write-Host "  5. Argumentos: trend-monitor.py" -ForegroundColor White
Write-Host "  6. Iniciar en: $PWD" -ForegroundColor White
Write-Host ""
Write-Host "=====================================" -ForegroundColor Cyan
Write-Host ""

# Preguntar si ejecutar ahora
$ejecutar = Read-Host "¿Ejecutar el monitor ahora? (S/N)"
if ($ejecutar -eq "S" -or $ejecutar -eq "s") {
    Write-Host ""
    Write-Host "🔍 Ejecutando Trend Monitor..." -ForegroundColor Cyan
    python trend-monitor.py
}
