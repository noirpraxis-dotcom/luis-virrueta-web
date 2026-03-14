# Flujo Asíncrono de Email — Radiografía de Pareja Premium

## Resumen
Cuando el usuario complete su radiografía, se le enviará el reporte completo por correo electrónico. Esto permite:
1. Que el usuario tenga una copia permanente del reporte
2. Para el paquete "Los Dos", enviar automáticamente el reporte cruzado cuando ambos participantes completen
3. Manejar casos donde el análisis IA tome más tiempo del esperado

---

## Arquitectura Propuesta

### Endpoints del Backend (Express.js en Railway)

#### `POST /api/radiografia/send-report`
Envía el reporte al correo del usuario.

**Request:**
```json
{
  "email": "usuario@ejemplo.com",
  "nombre": "Sofía",
  "nombrePareja": "Mateo",
  "packageType": "solo",
  "analysisData": { ... },
  "profileData": { ... }
}
```

**Proceso:**
1. Generar PDF del reporte (server-side con puppeteer o jsPDF)
2. Almacenar reporte en Supabase Storage (o Firebase Storage)
3. Enviar email con Resend incluyendo:
   - Enlace al reporte online (con token temporal, 30 días de vigencia)
   - PDF adjunto
4. Responder con `{ success: true, reportUrl: "..." }`

#### `POST /api/radiografia/notify-partner` (solo paquete "Los Dos")
Envía notificación al segundo participante.

**Request:**
```json
{
  "emailPareja": "mateo@ejemplo.com",
  "nombreUsuario": "Sofía",
  "sessionId": "abc123"
}
```

**Proceso:**
1. Enviar email a la pareja con enlace único para completar su parte
2. El enlace incluye un `sessionId` que vincula ambos reportes
3. Cuando ambos completen → generar reporte cruzado automáticamente

---

### Flujo para cada paquete

#### Individual / Pareja Solo
```
Usuario completa 40 preguntas
  → Análisis IA (4 llamadas paralelas)
  → Mostrar resultados en pantalla
  → [Botón] "Enviar a mi correo" → POST /api/radiografia/send-report
  → Email con PDF + enlace temporal
```

#### Pareja Los Dos
```
Usuario A completa 40 preguntas
  → Análisis IA individual A
  → Mostrar resultados A en pantalla
  → POST /api/radiografia/send-report (reporte individual A)
  → POST /api/radiografia/notify-partner (email a B con enlace)

Usuario B completa 40 preguntas (vía enlace)
  → Análisis IA individual B
  → Mostrar resultados B en pantalla
  → POST /api/radiografia/send-report (reporte individual B)

Servidor detecta que ambos completaron:
  → Generar reporte cruzado (nueva llamada DeepSeek con datos de A + B)
  → POST /api/radiografia/send-report (reporte cruzado a ambos)
```

---

### Modelo de datos (Firestore)

```
radiografias/{sessionId}
  ├── packageType: "losdos"
  ├── createdAt: timestamp
  ├── participantA: {
  │     email, nombre, edad,
  │     responses: {...},
  │     analysisData: {...},
  │     completedAt: timestamp
  │   }
  ├── participantB: {
  │     email, nombre, edad,
  │     responses: {...},
  │     analysisData: {...},
  │     completedAt: timestamp
  │   }
  └── crossedReport: {
        analysisData: {...},
        generatedAt: timestamp,
        sentAt: timestamp
      }
```

---

### Estado actual
- ✅ Email del usuario ya se recolecta en la pantalla de perfil
- ✅ Email de la pareja ya se recolecta (campo `emailPareja`)
- ✅ Botón "Enviar a mi correo" ya existe en la UI (placeholder)
- ⬜ Backend endpoint no implementado aún
- ⬜ Resend no configurado para envío de reportes
- ⬜ Generación de PDF server-side no implementada
- ⬜ Flujo "Los Dos" con sessionId no implementado

### Próximos pasos
1. Configurar Resend en el backend con template HTML del reporte
2. Implementar `POST /api/radiografia/send-report`
3. Implementar lógica de sessionId para paquete Los Dos
4. Agregar feedback visual al botón "Enviar a mi correo" (loading, success, error)
