// ─── EMAIL HTML TEMPLATES ──────────────────────────────────────
// Beautiful, responsive email templates for Resend

/**
 * Access email — sent after purchase with link to start the test
 */
export function accessEmailHtml({ accessUrl, continueUrl, personLabel, type }) {
  const isPareja = type === 'pareja'
  return `<!DOCTYPE html>
<html lang="es">
<head><meta charset="UTF-8"><meta name="viewport" content="width=device-width,initial-scale=1"></head>
<body style="margin:0;padding:0;background:#0a0a0a;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,sans-serif;">
<table width="100%" cellpadding="0" cellspacing="0" style="background:#0a0a0a;padding:40px 20px;">
<tr><td align="center">
<table width="560" cellpadding="0" cellspacing="0" style="background:#111;border-radius:16px;border:1px solid rgba(255,255,255,0.06);overflow:hidden;">

  <!-- Header gradient bar -->
  <tr><td style="height:3px;background:linear-gradient(90deg,#8b5cf6,#d946ef,#ec4899);"></td></tr>

  <!-- Logo area -->
  <tr><td style="padding:40px 40px 20px;text-align:center;">
    <div style="width:64px;height:64px;margin:0 auto 16px;border-radius:50%;background:linear-gradient(135deg,rgba(139,92,246,0.2),rgba(217,70,239,0.15));border:1px solid rgba(139,92,246,0.25);display:flex;align-items:center;justify-content:center;">
      <span style="font-size:28px;">💜</span>
    </div>
    <h1 style="margin:0;color:#fff;font-size:24px;font-weight:300;letter-spacing:-0.01em;">
      Termómetro Inconsciente de Pareja
    </h1>
    ${personLabel ? `<p style="margin:8px 0 0;color:rgba(139,92,246,0.7);font-size:14px;font-weight:400;">${personLabel}</p>` : ''}
  </td></tr>

  <!-- Main content -->
  <tr><td style="padding:0 40px 30px;">
    <p style="color:rgba(255,255,255,0.6);font-size:16px;font-weight:300;line-height:1.7;margin:0 0 20px;">
      ¡Gracias por tu compra! Tu acceso al diagnóstico psicológico de pareja está listo.
      ${isPareja ? ' Cada persona toma el test por separado — este enlace es solo para ti.' : ''}
    </p>

    <!-- Info cards -->
    <table width="100%" cellpadding="0" cellspacing="0" style="margin-bottom:24px;">
      <tr><td style="padding:14px 16px;background:rgba(255,255,255,0.03);border-radius:12px;border:1px solid rgba(255,255,255,0.06);margin-bottom:8px;">
        <p style="margin:0;color:rgba(255,255,255,0.7);font-size:14px;font-weight:400;">⏱ <strong style="color:rgba(255,255,255,0.85);">Reserva ~30 minutos</strong></p>
        <p style="margin:4px 0 0;color:rgba(255,255,255,0.35);font-size:13px;font-weight:300;">Busca un lugar tranquilo y sin interrupciones. Usa audífonos si puedes.</p>
      </td></tr>
    </table>
    <table width="100%" cellpadding="0" cellspacing="0" style="margin-bottom:24px;">
      <tr><td style="padding:14px 16px;background:rgba(255,255,255,0.03);border-radius:12px;border:1px solid rgba(255,255,255,0.06);">
        <p style="margin:0;color:rgba(255,255,255,0.7);font-size:14px;font-weight:400;">🎙 <strong style="color:rgba(255,255,255,0.85);">Hablarás por micrófono</strong></p>
        <p style="margin:4px 0 0;color:rgba(255,255,255,0.35);font-size:13px;font-weight:300;">Vas a escuchar preguntas y responder hablando. No hay respuestas correctas — solo tu honestidad.</p>
      </td></tr>
    </table>
    <table width="100%" cellpadding="0" cellspacing="0" style="margin-bottom:24px;">
      <tr><td style="padding:14px 16px;background:rgba(139,92,246,0.05);border-radius:12px;border:1px solid rgba(139,92,246,0.15);">
        <p style="margin:0;color:rgba(255,255,255,0.7);font-size:14px;font-weight:400;">📋 <strong style="color:rgba(255,255,255,0.85);">Tus datos se guardan 3 días</strong></p>
        <p style="margin:4px 0 0;color:rgba(255,255,255,0.35);font-size:13px;font-weight:300;">Si cierras el navegador, puedes continuar después con el botón de abajo. Al final, descarga tu PDF.</p>
      </td></tr>
    </table>

    <!-- CTA: Start test -->
    <table width="100%" cellpadding="0" cellspacing="0" style="margin-bottom:12px;">
      <tr><td align="center">
        <a href="${accessUrl}" style="display:inline-block;padding:18px 40px;background:linear-gradient(135deg,#7c3aed,#c026d3);color:#fff;text-decoration:none;border-radius:12px;font-size:16px;font-weight:400;letter-spacing:0.01em;">
          Da clic solo cuando estés listo(a) →
        </a>
      </td></tr>
    </table>
    <p style="text-align:center;color:rgba(255,255,255,0.2);font-size:12px;margin:0 0 24px;">
      Da clic cuando tengas tiempo disponible. El test dura ~30 minutos.
    </p>

    <!-- Divider -->
    <hr style="border:none;border-top:1px solid rgba(255,255,255,0.06);margin:24px 0;">

    <!-- Continue button -->
    <p style="color:rgba(255,255,255,0.35);font-size:13px;font-weight:300;margin:0 0 12px;">
      ¿Se te cerró el navegador? No te preocupes:
    </p>
    <table width="100%" cellpadding="0" cellspacing="0">
      <tr><td align="center">
        <a href="${continueUrl}" style="display:inline-block;padding:14px 32px;background:rgba(255,255,255,0.05);border:1px solid rgba(255,255,255,0.1);color:rgba(255,255,255,0.6);text-decoration:none;border-radius:10px;font-size:14px;font-weight:300;">
          🔄 Continuar donde me quedé
        </a>
      </td></tr>
    </table>
  </td></tr>

  <!-- Footer -->
  <tr><td style="padding:24px 40px;border-top:1px solid rgba(255,255,255,0.04);text-align:center;">
    <p style="margin:0;color:rgba(255,255,255,0.2);font-size:12px;font-weight:300;">
      Luis Virrueta · Psicólogo clínico · luisvirrueta.com
    </p>
    <p style="margin:6px 0 0;color:rgba(255,255,255,0.12);font-size:11px;font-weight:300;">
      Este enlace es personal e intransferible. Expira en 3 días.
    </p>
  </td></tr>

</table>
</td></tr>
</table>
</body>
</html>`
}

/**
 * Results email — sent automatically when analysis completes, with PDF attached
 */
export function resultsEmailHtml({ productType }) {
  return `<!DOCTYPE html>
<html lang="es">
<head><meta charset="UTF-8"><meta name="viewport" content="width=device-width,initial-scale=1"></head>
<body style="margin:0;padding:0;background:#0a0a0a;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,sans-serif;">
<table width="100%" cellpadding="0" cellspacing="0" style="background:#0a0a0a;padding:40px 20px;">
<tr><td align="center">
<table width="560" cellpadding="0" cellspacing="0" style="background:#111;border-radius:16px;border:1px solid rgba(255,255,255,0.06);overflow:hidden;">

  <!-- Header gradient bar -->
  <tr><td style="height:3px;background:linear-gradient(90deg,#10b981,#8b5cf6,#d946ef);"></td></tr>

  <!-- Logo area -->
  <tr><td style="padding:40px 40px 20px;text-align:center;">
    <div style="width:64px;height:64px;margin:0 auto 16px;border-radius:50%;background:linear-gradient(135deg,rgba(16,185,129,0.2),rgba(139,92,246,0.15));border:1px solid rgba(16,185,129,0.25);display:flex;align-items:center;justify-content:center;">
      <span style="font-size:28px;">🔬</span>
    </div>
    <h1 style="margin:0;color:#fff;font-size:24px;font-weight:300;">
      Tu Diagnóstico Relacional está listo
    </h1>
  </td></tr>

  <!-- Main content -->
  <tr><td style="padding:0 40px 30px;">
    <p style="color:rgba(255,255,255,0.6);font-size:16px;font-weight:300;line-height:1.7;margin:0 0 20px;">
      Hemos analizado tus 45 respuestas a través de 8 fases psicológicas. Encontrarás tu reporte completo en el PDF adjunto a este correo.
    </p>

    <!-- What's included -->
    <table width="100%" cellpadding="0" cellspacing="0" style="margin-bottom:24px;">
      <tr><td style="padding:16px;background:rgba(139,92,246,0.05);border-radius:12px;border:1px solid rgba(139,92,246,0.15);">
        <p style="margin:0 0 10px;color:rgba(255,255,255,0.7);font-size:14px;font-weight:500;">📄 Tu PDF incluye:</p>
        <p style="margin:0;color:rgba(255,255,255,0.4);font-size:13px;font-weight:300;line-height:1.8;">
          ✦ Tipo de relación detectado<br>
          ✦ Radar emocional y perfil completo<br>
          ✦ Patrones de apego y mecanismos de defensa<br>
          ✦ Ciclos relacionales dominantes<br>
          ✦ Sensibilidades emocionales activadas<br>
          ✦ Observación clave y recomendación profesional
        </p>
      </td></tr>
    </table>

    <!-- Reminder -->
    <table width="100%" cellpadding="0" cellspacing="0" style="margin-bottom:24px;">
      <tr><td style="padding:14px 16px;background:rgba(245,158,11,0.05);border-radius:12px;border:1px solid rgba(245,158,11,0.15);">
        <p style="margin:0;color:rgba(255,255,255,0.7);font-size:14px;font-weight:400;">⚠️ <strong style="color:rgba(255,255,255,0.85);">Descarga tu PDF</strong></p>
        <p style="margin:4px 0 0;color:rgba(255,255,255,0.35);font-size:13px;font-weight:300;">Tus datos en línea se borran automáticamente en 3 días. Guarda este correo y descarga el PDF adjunto.</p>
      </td></tr>
    </table>

    <!-- Divider -->
    <hr style="border:none;border-top:1px solid rgba(255,255,255,0.06);margin:24px 0;">

    <!-- Consultation CTA -->
    <p style="color:rgba(255,255,255,0.5);font-size:15px;font-weight:300;margin:0 0 16px;text-align:center;">
      ¿Te gustaría profundizar en estos resultados?
    </p>
    <table width="100%" cellpadding="0" cellspacing="0" style="margin-bottom:12px;">
      <tr><td align="center">
        <a href="https://buy.stripe.com/9B64gz4UXeYigbdfyx9AA05" style="display:inline-block;padding:16px 36px;background:linear-gradient(135deg,#7c3aed,#c026d3);color:#fff;text-decoration:none;border-radius:12px;font-size:15px;font-weight:400;">
          Agendar sesión con Luis Virrueta — $1,199 MXN
        </a>
      </td></tr>
    </table>
    <p style="text-align:center;color:rgba(255,255,255,0.2);font-size:12px;margin:0;">
      Sesión de 60 min para interpretar tu diagnóstico a profundidad
    </p>
  </td></tr>

  <!-- Footer -->
  <tr><td style="padding:24px 40px;border-top:1px solid rgba(255,255,255,0.04);text-align:center;">
    <p style="margin:0;color:rgba(255,255,255,0.2);font-size:12px;font-weight:300;">
      Luis Virrueta · Psicólogo clínico · luisvirrueta.com
    </p>
    <p style="margin:6px 0 0;color:rgba(255,255,255,0.12);font-size:11px;font-weight:300;">
      Este diagnóstico es orientativo y no sustituye una evaluación presencial.
    </p>
  </td></tr>

</table>
</td></tr>
</table>
</body>
</html>`
}
