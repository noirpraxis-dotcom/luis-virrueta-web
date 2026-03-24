# INSTRUCCIONES — Radiografía de Pareja (zuzana-web)

> **Documento de referencia completo.** Cuando inicies un nuevo chat, indica: _"Lee INSTRUCCIONES.md"_ para tener todo el contexto del proyecto.

---

## 1. ARQUITECTURA GENERAL

```
luisvirrueta.com (Cloudflare Pages)
   ├── Vite + React 18  SPA
   ├── Firebase Auth (Google + Email/Password)
   ├── Cloud Firestore (users, purchases, partner_invites)
   ├── Supabase (blog data — secundario)
   └── Cloudflare Worker "radiografia-worker"
           ├── Stripe  (pagos: checkout, webhooks)
           ├── Resend  (emails transaccionales)
           ├── DeepSeek (análisis IA)
           ├── ElevenLabs (TTS narración)
           ├── KV "PURCHASES" (tokens, análisis, perfiles)
           └── R2 (audio: luisvirrueta-audio, media: luisvirrueta-media)
```

| Capa | Herramienta | Detalle |
|------|------------|---------|
| Frontend | Vite + React 18 + TailwindCSS | SPA con code-splitting, dev en `localhost:3000` |
| Hosting | Cloudflare Pages | Proyecto: `luis-virrueta-web`, dominio: `luisvirrueta.com` |
| Auth | Firebase Auth | Google popup (localhost) / redirect (prod), Email+Password, verificación con código de 6 dígitos propio (NO el built-in de Firebase) |
| Base de datos | Cloud Firestore | Proyecto: `diagnostico-emocional-7b8f7` |
| Backend API | Cloudflare Worker | `radiografia-worker` en `https://radiografia-worker.noirpraxis.workers.dev` |
| Pagos | Stripe Live | 3 productos en MXN |
| Email | Resend | Desde `hola@luisvirrueta.com` |
| IA | DeepSeek | Generación de análisis relacional |
| Voz | ElevenLabs | 4 voces en español (Valentina, Santiago, Adrián, Camila) |
| PDF | @react-pdf/renderer + html2canvas | Sistema híbrido: React PDF para layout + html2canvas para capturar gráficas SVG/canvas |
| Gráficas | Recharts, Nivo, D3 | Radar, barras, gauges, mindmap, network |

---

## 2. VARIABLES DE ENTORNO (.env)

```env
# ─── Supabase (residual, no borrar, lo usa el sistema de blog) ───
VITE_SUPABASE_URL=https://...
VITE_SUPABASE_ANON_KEY=eyJ...

# ─── Admin Panel ───
VITE_ADMIN_USERNAME=admin
VITE_ADMIN_PASSWORD=Zuzana2026!
VITE_ADMIN_SECRET=lv-admin-2025-radiografia-secret

# ─── Stripe (LIVE) ───
VITE_STRIPE_PUBLISHABLE_KEY=pk_live_51ShTqgGpKMTmfzJm...

# ─── Worker Backend ───
VITE_API_BASE_URL=https://radiografia-worker.noirpraxis.workers.dev

# ─── Firebase ───
VITE_FIREBASE_API_KEY=AIzaSyBHSpJqiyT1ueEHQ1AftBPBMjobHm0HRYU
VITE_FIREBASE_AUTH_DOMAIN=luisvirrueta.com
VITE_FIREBASE_PROJECT_ID=diagnostico-emocional-7b8f7
VITE_FIREBASE_STORAGE_BUCKET=diagnostico-emocional-7b8f7.firebasestorage.app
VITE_FIREBASE_MESSAGING_SENDER_ID=944980834033
VITE_FIREBASE_APP_ID=1:944980834033:web:a31705b7335137b8c15b50
VITE_FIREBASE_MEASUREMENT_ID=G-074BDDKY49
```

**Secretos del Worker** (se configuran con `wrangler secret put`):
- `STRIPE_SECRET_KEY` — clave secreta Stripe Live
- `STRIPE_TEST_SECRET_KEY` — clave secreta Stripe Test
- `STRIPE_WEBHOOK_SECRET` — secreto del webhook
- `RESEND_API_KEY` — `re_MsVsVJG9_4ka58sy6xqEDVmoSJuzCCWJz`
- `DEEPSEEK_API_KEY` — clave de DeepSeek para análisis IA
- `ELEVENLABS_API_KEY` — clave de ElevenLabs para TTS
- `PROMO_CODES_JSON` — (opcional) códigos promocionales custom

---

## 3. FIREBASE — CONFIGURACIÓN

| Campo | Valor |
|-------|-------|
| Proyecto | `diagnostico-emocional-7b8f7` |
| API Key | `AIzaSyBHSpJqiyT1ueEHQ1AftBPBMjobHm0HRYU` |
| Auth Domain | `luisvirrueta.com` (dominio custom) |
| Providers activos | Google, Email/Password |
| Admin Email | `luis.virrueta.contacto@gmail.com` |
| Inicialización | `src/config/firebase.js` — try/catch con fallback graceful |
| Exports | `auth`, `db`, `analytics`, `app` |

### Colecciones Firestore

| Colección | Descripción |
|-----------|-------------|
| `users/{uid}` | Perfil de usuario: displayName, email, role, provider, emailVerified, createdAt, testMode |
| `users/{uid}/purchases/{purchaseId}` | Compras del usuario (subcollection) |
| `partner_invites/{email}` | Invitaciones de pareja, keyed por email en minúscula |

### Esquema de Purchase

```js
{
  product,            // 'radiografia-pareja'
  packageType,        // 'descubre' | 'solo' | 'losdos'
  stripeSessionId,
  status,             // 'pending' → 'paid' → 'in-progress' → 'analyzing' → 'completed'
  partnerEmail,
  partnerName,
  partnerUid,
  pairId,
  voiceSelection,     // { narratorVoice: 'valentina'|'santiago'|etc }
  profileData,        // datos del perfil del usuario
  currentQuestion,    // progreso del cuestionario
  responses,          // respuestas del cuestionario
  analysis,           // resultado del análisis IA
  crossAnalysis,      // análisis cruzado (si aplica)
  createdAt,
  completedAt
}
```

---

## 4. CLOUDFLARE WORKER — ENDPOINTS API

**URL Base:** `https://radiografia-worker.noirpraxis.workers.dev`
**Cuenta:** `noirpraxis@gmail.com` | **Account ID:** `17217d2faeb85ab2d1ccceb513ada899`

### Rutas principales

| Método | Ruta | Propósito |
|--------|------|-----------|
| POST | `/api/create-radiografia-checkout` | Crear sesión Stripe Checkout |
| POST | `/api/verify-payment` | Verificar pago, devolver token |
| POST | `/api/validate-radiografia-promo` | Validar código promo |
| POST | `/api/send-access-email` | Email de acceso |
| POST | `/api/save-analysis` | Guardar análisis en KV |
| POST | `/api/send-analysis-email` | Email "resultados listos" |
| GET  | `/api/get-analysis?token=` | Recuperar análisis por token |
| POST | `/api/send-partner-invite` | Enviar invitación de pareja |
| POST | `/api/check-cross-status` | Verificar si ambos terminaron |
| POST | `/api/mark-partner-done` | Marcar pareja como completada |
| POST | `/api/save-cross-analysis` | Guardar análisis cruzado |
| POST | `/api/send-cross-analysis-email` | Email de análisis cruzado |
| GET  | `/api/get-cross-analysis?pairId=&token=` | Recuperar análisis cruzado |
| POST | `/api/send-verification-code` | Código verificación 6 dígitos |
| POST | `/api/verify-code` | Verificar código de 6 dígitos |
| POST | `/api/send-backup-email` | Backup cuestionario a admin |
| POST | `/api/save-profile` | Guardar perfil en KV |
| GET  | `/api/get-profile?token=` | Obtener perfil por token |
| POST | `/api/create-custom-checkout` | Admin: checkout con precio custom |
| POST | `/api/create-promo-code` | Admin: crear código promo |
| POST | `/api/list-promo-codes` | Admin: listar promos |
| POST | `/api/delete-promo-code` | Admin: eliminar promo |
| POST | `/api/delete-auth-user` | Admin: eliminar usuario Firebase Auth |
| POST | `/api/send-results-email` | Email con resultados PDF |
| POST | `/webhook` | Stripe webhook |
| GET  | `/audio/*` | Servir archivos de audio desde R2 |

### Worker — Recursos vinculados (wrangler.toml)

| Tipo | Binding | Recurso |
|------|---------|---------|
| KV | `PURCHASES` | ID: `9f5ee5a5f0fc49ecaecf7e06763afd80` |
| R2 | `AUDIO_BUCKET` | `luisvirrueta-audio` |
| R2 | `MEDIA_BUCKET` | `luisvirrueta-media` |

### Stripe — Precios

| Paquete | Precio MXN | Price ID env var |
|---------|-----------|------------------|
| Descubre | $499 | `PRICE_DESCUBRE` / `PRICE_DESCUBRE_TEST` |
| Solo | $499 | `PRICE_SOLO` / `PRICE_SOLO_TEST` |
| Los Dos | $999 | `PRICE_LOSDOS` / `PRICE_LOSDOS_TEST` |

**Consultas (checkout custom):**
- Individual: $700 MXN
- Pareja: $1,250 MXN

### Códigos promo integrados

| Código | Efecto |
|--------|--------|
| `LANZAMIENTO50` | 50% descuento |
| `BETA100` | Acceso gratuito |
| `MENTELIBRE` | $200 off consulta individual → $500 |
| `DOSPUERTAS` | $250 off consulta pareja → $1,000 |

---

## 5. STRIPE — CONFIGURACIÓN

| Campo | Valor |
|-------|-------|
| Publishable Key (LIVE) | `pk_live_51ShTqgGpKMTmfzJm...` (en `.env`) |
| Secret Key (LIVE) | Worker secret `STRIPE_SECRET_KEY` |
| Webhook Secret | Worker secret `STRIPE_WEBHOOK_SECRET` |
| Moneda | MXN |
| Webhook endpoint | `https://radiografia-worker.noirpraxis.workers.dev/webhook` |
| Return URL | `https://luisvirrueta.com/tienda/diagnostico-relacional` |
| Radiografia URL | `https://luisvirrueta.com/tienda/radiografia-premium` |

---

## 6. SISTEMA DE PDF — Híbrido

### Cómo funciona

1. **html2canvas** captura las gráficas del DOM (SVG/Canvas) como imágenes PNG base64
2. **@react-pdf/renderer** genera el PDF con layout profesional, insertando esas imágenes

### Archivos clave

| Archivo | Función |
|---------|---------|
| `src/services/pdfReactService.jsx` | Generador principal. ~940 líneas. `generateReactPDF(analysis, profileData, crossAnalysis, chartImages)` |
| `src/services/pdfGenerationService.js` | Captura de gráficas. `captureChartImages(resultsElement)` → `{ [label]: dataUrl }` |

### Flujo de generación

```
RadiografiaPremiumPage.generatePDF()
  → captureChartImages(resultsRef.current)  // html2canvas captura data-pdf-page elements
  → generateReactPDF(analysis, profileData, crossAnalysis, chartImages)  // React PDF
  → blob → download
```

### Marcadores DOM (`data-pdf-page`)

Cada elemento con atributo `data-pdf-page="nombre"` se captura como imagen:
- `chart-mindmap`, `chart-network` — gráficas principales
- `radar-global` — radar de 12 dimensiones
- `psych-{author}` — 11 lecturas de autor (johnson, hendrix, gottman, etc.)
- `card-{autoanalisis}` — 11 tarjetas de autoanálisis
- `direccion` — gauges de dirección probable
- `rapport` — gráfica de rapport
- `fortalezas` — gráfica de fortalezas/riesgos
- `cruzado-radar` — radar del análisis cruzado

### Mapeo de claves Lectura ↔ Chart

`LECTURA_CHART_KEY` en `pdfReactService.jsx` maneja discrepancias:
```
sue_johnson       → psych-johnson
harville_hendrix  → psych-hendrix
john_gottman      → psych-gottman
esther_perel      → psych-perel
stan_tatkin        → psych-tatkin
helen_fisher      → psych-fisher
david_schnarch    → psych-schnarch
terry_real        → psych-real
brene_brown       → psych-brown
freud_lacan       → psych-freud-lacan
jung              → psych-jung
```

### Páginas del PDF

1. Portada (logo + datos)
2. Resumen + Diagnóstico emocional
3. MindMap radial (imagen)
4. Grafo de conexiones (imagen)
5. 12 Dimensiones + Radar
6. Dirección probable (gauges)
7. Rapport
8. Cada tarjeta de autoanálisis (1 por página, ~11 páginas)
9. Cada lectura de autor (1 por página, ~11 páginas, texto COMPLETO sin truncar)
10. Síntesis final
11. Fortalezas y riesgos
12. Técnicas recomendadas
13. Libros sugeridos
14. Temas para consulta
15. Análisis cruzado (si existe)
16. CTA final

---

## 7. SISTEMA DE VOZ (ElevenLabs)

### Voces disponibles

| Nombre | ID ElevenLabs | Género |
|--------|--------------|--------|
| Valentina | (configurado en worker) | Femenino |
| Santiago | (configurado en worker) | Masculino |
| Adrián | (configurado en worker) | Masculino |
| Camila | (configurado en worker) | Femenino |

### Selección y persistencia

- El usuario elige voz en el cuestionario → se guarda en `voiceSelection` del purchase
- Audio narrado se guarda en R2 bucket `luisvirrueta-audio`
- La voz seleccionada persiste entre sesiones vía Firestore

---

## 8. SISTEMA DE ADMIN

### Acceso

- **Email admin:** `luis.virrueta.contacto@gmail.com` (hardcoded en `AuthContext.jsx`)
- **Panel:** Se renderiza dentro de `PerfilPage.jsx` cuando `isAdmin === true`
- **Componente:** `AdminDashboard`
- **Admin secret:** `VITE_ADMIN_SECRET` para endpoints protegidos

### Funcionalidades admin

- Ver todos los usuarios y sus compras (realtime)
- Regalar productos (`giftProduct`)
- Eliminar productos (`removeProduct`) y usuarios (`deleteUserAdmin`)
- Modo prueba por usuario (`setUserTestMode`)
- Crear checkout con precio personalizado (`createCustomCheckout`)
- CRUD de códigos promo
- Admin se oculta de la lista de clientes

---

## 9. FLUJO DE PAREJA (partner_invites)

### Flujo completo

1. **Comprador** adquiere paquete "Los Dos" → ingresa email de pareja
2. Se crea doc en `partner_invites/{email}` con: `buyerUid`, `purchaseId`, `buyerEmail`, `buyerName`, `product`, `packageType`, `pairId`, `claimed: false`
3. Se envía email a la pareja vía `/api/send-partner-invite` con link: `https://luisvirrueta.com/registro?email={email}&invite=true&package=losdos&product=radiografia-pareja`
4. **Pareja** abre el link → `RegistroPage.jsx` detecta params `?invite=true`
5. Pareja se registra/loguea → `findPurchaseByPartnerEmail(email)` encuentra la invitación
6. Se ejecuta: `claimPartnerInvite(email)`, `linkPartnerToPurchase(buyerUid, purchaseId, partnerUid)`, `createPartnerPurchase(partnerUid, ...)` (sin pago)
7. Pareja completa su cuestionario independientemente
8. Al completar ambos → análisis cruzado disponible

### Profile gate bypass

La pareja NO necesita seleccionar paquete en PerfilPage — se le lleva directo al cuestionario.

---

## 10. FLUJO DE COMPRA

### Secuencia

1. Usuario selecciona paquete en `PerfilPage`
2. `pendingPurchaseRef` (useRef) almacena datos de la compra temporal
3. Se crea sesión Stripe → redirect a Stripe Checkout
4. Webhook confirma pago → Worker procesa
5. Al regresar, `PerfilPage` detecta `?session_id=` en URL
6. Verifica pago con `/api/verify-payment`
7. Crea documento purchase en Firestore
8. Backup en `sessionStorage` para recovery

### Recovery

Si el usuario pierde la sesión después del pago:
- `PerfilPage` intenta recuperar de `sessionStorage`
- Busca `session_id` en URL params
- Re-verifica con Stripe si es necesario

---

## 11. ALMACENAMIENTO LOCAL (localStorage)

### Namespacing

Todas las claves de localStorage se prefijan con `firestorePurchaseId` para evitar colisiones entre múltiples compras:

```
{purchaseId}_voiceSelection
{purchaseId}_currentQuestion
{purchaseId}_responses
{purchaseId}_profileData
```

---

## 12. ARCHIVOS CLAVE DEL PROYECTO

```
src/
├── config/
│   └── firebase.js                      # Inicialización Firebase
├── context/
│   └── AuthContext.jsx                   # Auth provider, ADMIN_EMAIL, login/signup/logout
├── pages/
│   ├── PerfilPage.jsx                    # Dashboard usuario + Admin panel (~5400 líneas)
│   ├── RadiografiaPremiumPage.jsx        # Resultados premium + PDF (~5400 líneas)
│   ├── DiagnosticoRelacionalPage.jsx     # Cuestionario 44 preguntas + análisis
│   └── RegistroPage.jsx                  # Login/registro + flujo partner invite
├── services/
│   ├── firestoreService.js              # 22 funciones Firestore (CRUD users, purchases, partners, admin)
│   ├── emailApiService.js               # 19 funciones → endpoints del Worker
│   ├── pdfReactService.jsx              # PDF React (~940 líneas, con imágenes de gráficas)
│   └── pdfGenerationService.js          # captureChartImages() + legacy jsPDF
cloudflare-worker/
├── index.js                              # Worker completo (todas las rutas API)
├── wrangler.toml                         # Config: KV, R2, price IDs
└── deploy.ps1                            # Script de deploy
```

---

## 13. BUILD & DEPLOY

### Frontend (Cloudflare Pages)

```powershell
# Desarrollo local
npm run dev                # → localhost:3000

# Build
npm run build              # → vite build && node scripts/prerender-blog.mjs

# Deploy (automático vía Cloudflare Pages conectado a git)
# O manual:
npx wrangler pages deploy dist --project-name luis-virrueta-web
```

### Worker

```powershell
cd cloudflare-worker

# Deploy
npx wrangler deploy
# o
.\deploy.ps1

# Configurar secreto
npx wrangler secret put NOMBRE_DEL_SECRETO

# Logs en tiempo real
npx wrangler tail
```

### Vite Config importante

- Build target: `es2015`
- Manual chunks: `react-vendor`, `framer-motion`, `lucide`
- Chunk size limit: 500 KB
- Dev proxy: `/api` y `/webhook` → Worker URL
- Sin sourcemaps en producción

---

## 14. DEPENDENCIAS PRINCIPALES

| Paquete | Uso |
|---------|-----|
| `react` + `react-dom` 18 | Framework UI |
| `react-router-dom` 7 | Routing SPA |
| `firebase` 12 | Auth + Firestore |
| `@react-pdf/renderer` 4 | Generación PDF React |
| `jspdf` + `html2canvas` | Captura DOM → imagen (legacy + charts) |
| `tailwindcss` | Estilos utility-first |
| `framer-motion` | Animaciones |
| `recharts` / `@nivo/*` / `d3` | Gráficas y visualizaciones |
| `lucide-react` | Iconos |
| `three` + `gsap` | 3D + animaciones scroll |
| `swiper` | Carruseles |
| `react-helmet-async` | SEO meta tags |
| `sharp` | Compresión de imágenes (build) |

---

## 15. CUESTIONARIO

- **44 preguntas** organizadas en **18 bloques**
- Definidas inline en `DiagnosticoRelacionalPage.jsx` como array `QUESTIONS[]`
- Progreso se guarda en Firestore vía `saveTestProgress()`
- Respuestas se guardan en localStorage (prefijado por purchaseId) como backup
- Al completar → se envía a DeepSeek para análisis → resultado en `analysis`

---

## 16. 12 DIMENSIONES EVALUADAS

1. Comunicación emocional
2. Gestión de conflictos
3. Intimidad y conexión
4. Confianza y seguridad
5. Autonomía vs. fusión
6. Roles y expectativas
7. Sexualidad y deseo
8. Proyectos compartidos
9. Familia de origen
10. Resiliencia de pareja
11. Valores y espiritualidad
12. Crecimiento personal

---

## 17. PROBLEMAS COMUNES Y SOLUCIONES

### "Firebase init failed (API key may be invalid)"
- La API key SÍ es válida (probada vía Identity Toolkit API)
- Causa probable: cache del navegador o restricciones de referrer en Google Cloud Console
- Solución: limpiar cache, verificar dominios autorizados en Firebase Console

### PDF no incluye gráficas
- Verificar que los elementos del DOM tienen `data-pdf-page="nombre"` correcto
- Verificar que `captureChartImages()` se ejecuta ANTES de `generateReactPDF()`
- Las gráficas deben estar visibles en el DOM al momento de captura

### "Cannot read properties of null (reading 'app')"
- Firebase no inicializó correctamente
- Verificar que todas las `VITE_FIREBASE_*` variables están en `.env`
- El código tiene try/catch — si falla, `auth`/`db` serán null

### Worker no responde
- Verificar deploy: `cd cloudflare-worker && npx wrangler deploy`
- Verificar secretos: `npx wrangler secret list`
- Verificar logs: `npx wrangler tail`

### Emails no llegan
- Verificar DNS de `luisvirrueta.com` para Resend (SPF, DKIM, DMARC)
- Verificar que `RESEND_API_KEY` está configurado como secreto del Worker
- From address: `hola@luisvirrueta.com`

---

## 18. NOTAS IMPORTANTES

1. **NO usar Supabase** para la Radiografía — se usa Firebase Auth + Firestore. Supabase solo se usa para el blog.
2. **La verificación de email** usa un sistema custom de código de 6 dígitos (NO el sistema built-in de Firebase).
3. **El admin** se identifica por email exacto `luis.virrueta.contacto@gmail.com` en `AuthContext.jsx`.
4. **Los Price IDs de Stripe** (LIVE y TEST) están en `wrangler.toml`, NO en el .env del frontend.
5. **DeepSeek y ElevenLabs API keys** están como secretos del Worker, NO en el .env del frontend.
6. **El PDF** usa un sistema híbrido: React PDF para texto + html2canvas para capturar gráficas como imágenes.
7. **localStorage** está namespaciado por `firestorePurchaseId` para soportar múltiples compras.
8. **El flujo de pareja** crea documentos en `partner_invites/{email}` (top-level collection) con la información necesaria para vincular al partner cuando se registre.
9. **El análisis cruzado** se genera cuando ambos terminan su cuestionario — se verifica con `/api/check-cross-status`.
10. **Cloudflare Pages** está configurado para deploy automático desde git. El Worker se deploya manualmente con `wrangler deploy`.

---

_Última actualización: Junio 2025_
