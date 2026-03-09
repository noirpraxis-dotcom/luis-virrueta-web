# Guía de Setup: Sistema Completo — Stripe + Firebase + Resend

## Arquitectura del sistema

```
Usuario paga en Stripe → URL única con {CHECKOUT_SESSION_ID}
        ↓
  Página de gracias (verifica pago vía backend, detecta producto)
        ↓
  Recoge email(s): 1 (Individual) o 2 (Pareja)
        ↓
  Backend genera tokens → Envía emails bonitos vía Resend
        ↓
  Usuario abre enlace del email → Valida token → Inicia test
        ↓
  Progreso se guarda en Firestore (cada pregunta)
        ↓
  Si cierra → Puede continuar desde el email (botón "Continuar")
        ↓
  DeepSeek termina análisis → Backend envía PDF automáticamente por email
        ↓
  Datos se borran après 3 días
```

---

## ✅ Ya funciona (sin configuración adicional)
- Checkout con 3 tiers: **Guía gratuita ($0)**, Individual ($349), Pareja ($549)
- Consulta psicológica ($1,199): CTA al final de resultados
- Código LUISPRO: Acceso completo gratuito
- Demo mode: 5 preguntas gratis
- 45 preguntas en 8 fases (incluye familia de origen + intimidad)
- Audio Charlotte (ElevenLabs): Q1-Q50 pregenerados
- PDF descargable en el navegador
- Página de gracias dinámica (detecta producto automáticamente)
- Captura de 1 o 2 emails según plan
- Progreso se guarda en Firestore en cada pregunta
- Auto-envío del PDF al completar el análisis

---

## ⚠️ Requiere configuración (3 servicios)

### 1. Firebase (Auth + Firestore)

**Qué necesitas**: Las 6 claves del proyecto de Firebase

**Pasos**:
1. Ve a [Firebase Console](https://console.firebase.google.com)
2. Crea un proyecto (o usa uno existente)
3. Ve a **Project Settings → General → Your apps → Add web app**
4. Copia las 6 claves y crea el archivo `.env`:

```env
VITE_FIREBASE_API_KEY=AIzaSy...
VITE_FIREBASE_AUTH_DOMAIN=tu-proyecto.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=tu-proyecto
VITE_FIREBASE_STORAGE_BUCKET=tu-proyecto.appspot.com
VITE_FIREBASE_MESSAGING_SENDER_ID=000000000000
VITE_FIREBASE_APP_ID=1:000000000000:web:xxxxxxxxxxxxxxxxxx
```

5. En Firebase Console, habilita **Firestore Database** (modo producción)
6. Reglas de Firestore (mínimas para empezar):
```
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /purchases/{doc} { allow read, write: if true; }
    match /progress/{doc} { allow read, write: if true; }
    match /results/{doc} { allow read, write: if true; }
    match /access_tokens/{doc} { allow read, write: if true; }
  }
}
```
> ⚠️ Para producción: restringir con auth rules

### 2. Stripe (Verificación de pagos)

**Qué necesitas**: Secret Key (`sk_test_...` o `sk_live_...`)

**Pasos**:
1. Ve a [Stripe Dashboard → Developers → API Keys](https://dashboard.stripe.com/apikeys)
2. Copia la **Secret key**
3. Configura las URLs de retorno en TODOS los Payment Links:
   - Success URL: `https://TU-DOMINIO.com/tienda/diagnostico-relacional?session_id={CHECKOUT_SESSION_ID}`
   - ⚡ Es la MISMA URL para todos — el backend detecta el producto automáticamente
4. En el archivo `functions/.env`:
```env
STRIPE_SECRET_KEY=sk_test_...
```

### 3. Resend (Emails bonitos)

**Qué necesitas**: API Key (`re_...`)

**Pasos**:
1. Crea cuenta en [Resend](https://resend.com) (gratis: 3,000 emails/mes)
2. Ve a **API Keys** → Create API Key
3. Verifica tu dominio para enviar con tu dirección
4. En `functions/.env`:
```env
RESEND_API_KEY=re_...
```
5. En `functions/index.js`, cambia `test@tudominio.com` por tu email verificado

---

## Desplegar el backend (functions/)

El directorio `functions/` contiene un servidor Express con 3 endpoints:

| Endpoint | Función |
|----------|---------|
| `POST /api/verify-payment` | Verifica sesión de Stripe y detecta producto |
| `POST /api/send-access-email` | Envía emails con enlace de acceso al test |
| `POST /api/send-results-email` | Envía PDF de resultados por email |

### Opción A: Desplegar en Railway/Render (más simple)
```bash
cd functions
npm install
# Crear .env con las 3 claves
node index.js
```
URL resultante: `https://tu-app.railway.app`

### Opción B: Cloudflare Workers
Adaptar a formato Worker (más complejo pero integra con tu Cloudflare actual)

### Opción C: Firebase Cloud Functions
Cambiar a formato Firebase Functions y desplegar con `firebase deploy`

**Una vez desplegado**, agrega la URL al `.env` del frontend:
```env
VITE_API_BASE_URL=https://tu-api.tudominio.com
```

---

## Flujo completo paso a paso

### 1. Landing → Checkout
- Usuario ve 3 planes: Guía gratuita, Individual, Pareja
- Elige uno y va al checkout o a Stripe

### 2. Pago → Retorno dinámico
- Stripe redirige a: `/tienda/diagnostico-relacional?session_id=cs_xxx`
- El frontend llama a `/api/verify-payment` con el session_id
- El backend consulta a Stripe qué producto se compró
- La pantalla de gracias muestra el producto correcto

### 3. Captura de emails
- Individual: 1 email
- Pareja: 2 emails (uno para cada persona)
- Se generan tokens únicos para cada persona
- Emails se envían vía Resend con enlace personalizado

### 4. Email recibido
Cada email incluye:
- Botón principal: "Da clic solo cuando estés listo(a)"
- Info: duración, micrófono, privacidad
- Aviso: datos se guardan 3 días
- Botón secundario: "Continuar donde me quedé"

### 5. Test con progreso guardado
- Cada pregunta se guarda en Firestore automáticamente
- Si el navegador se cierra, puede volver desde el email
- El enlace "Continuar" restaura exactamente donde se quedó

### 6. Resultados + PDF automático
- DeepSeek analiza las 45 respuestas
- Al completar, el PDF se genera y se envía automáticamente al email
- Los resultados se guardan en Firestore (3 días)
- El usuario puede descargar el PDF manualmente también

### 7. CTA Consulta
- Al final de resultados, CTA para agendar sesión ($1,199)
- También aparece en el email de resultados

---

## Links y constantes actuales

| Concepto | Valor |
|----------|-------|
| Stripe Individual | `https://buy.stripe.com/28EfZh73503o5wzaed9AA03` |
| Stripe Pareja | `https://buy.stripe.com/4gMfZh2MP5nIe35fyx9AA04` |
| Stripe Consulta | `https://buy.stripe.com/9B64gz4UXeYigbdfyx9AA05` |
| Código gratis | `LUISPRO` |
| Demo gratuita | 5 preguntas |
| Retención datos | 3 días |
| Total preguntas | 45 en 8 fases |
| Voz audio | Charlotte (ElevenLabs) |
| WhatsApp | +52 722 872 0520 |

---

## Checklist antes de lanzar

- [ ] Crear proyecto en Firebase y obtener las 6 claves
- [ ] Crear `.env` con `VITE_FIREBASE_*` y `VITE_API_BASE_URL`
- [ ] Habilitar Firestore en Firebase Console
- [ ] Obtener Stripe Secret Key y agregarla en `functions/.env`
- [ ] Crear cuenta en Resend y verificar dominio
- [ ] Agregar Resend API Key en `functions/.env`
- [ ] Desplegar `functions/` en Railway, Render, o equivalente
- [ ] Configurar Success URL en los 3 Stripe Payment Links: `?session_id={CHECKOUT_SESSION_ID}`
- [ ] Cambiar `test@tudominio.com` por email real en templates
- [ ] Probar flujo completo: Landing → Stripe → Gracias → Email → Test → Resultados → PDF en correo
- [ ] Hacer deploy de frontend a producción
