# 🗑️ LIMPIAR CACHÉ CLOUDFLARE

Write-Host "`n🔥 INSTRUCCIONES PARA LIMPIAR CACHÉ CLOUDFLARE" -ForegroundColor Cyan
Write-Host "=" * 60 -ForegroundColor DarkGray

Write-Host "`n⚠️  PROBLEMA DETECTADO:" -ForegroundColor Yellow
Write-Host "  • robots.txt error persiste (caché antiguo)" -ForegroundColor White
Write-Host "  • Videos optimizados no se reflejan en Lighthouse" -ForegroundColor White  
Write-Host "  • Performance bajando por caché desactualizado" -ForegroundColor White

Write-Host "`n📋 PASOS A SEGUIR:" -ForegroundColor Cyan

Write-Host "`n1️⃣  Ir a Cloudflare Dashboard" -ForegroundColor Green
Write-Host "   https://dash.cloudflare.com" -ForegroundColor Gray

Write-Host "`n2️⃣  Seleccionar tu sitio: luisvirrueta.com" -ForegroundColor Green

Write-Host "`n3️⃣  Ir a: Caching → Configuration" -ForegroundColor Green

Write-Host "`n4️⃣  Click en 'Purge Everything'" -ForegroundColor Green
Write-Host "   O específicamente purgar:" -ForegroundColor Gray
Write-Host "   • https://luisvirrueta.com/robots.txt" -ForegroundColor White
Write-Host "   • https://luisvirrueta.com/header%20psicologia.mp4" -ForegroundColor White
Write-Host "   • https://luisvirrueta.com/assets/*.js" -ForegroundColor White
Write-Host "   • https://luisvirrueta.com/assets/*.css" -ForegroundColor White

Write-Host "`n5️⃣  Confirmar purga" -ForegroundColor Green

Write-Host "`n✅ RESULTADO ESPERADO:" -ForegroundColor Cyan
Write-Host "  • robots.txt error desaparecerá" -ForegroundColor White
Write-Host "  • Videos optimizados se cargarán" -ForegroundColor White
Write-Host "  • Performance mejorará 68% → 75%+" -ForegroundColor Green

Write-Host "`n⏱️  Tiempo estimado: 2-5 minutos" -ForegroundColor Yellow

Write-Host "`n" + ("=" * 60) -ForegroundColor DarkGray
Write-Host "`n💡 TIP: Después de purgar, espera 2-3 minutos" -ForegroundColor Magenta
Write-Host "   antes de volver a ejecutar Lighthouse" -ForegroundColor Gray
Write-Host ""
