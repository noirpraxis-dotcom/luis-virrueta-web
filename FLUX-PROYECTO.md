# FLUX — Documentación Completa del Proyecto luisvirrueta.com

> **Propósito**: Este documento contiene TODA la información necesaria para continuar el desarrollo del proyecto en un chat nuevo. Copia y pega las secciones relevantes como contexto.

---

## 1. Identidad del Proyecto

| Campo | Valor |
|-------|-------|
| **Nombre** | `zuzana-web` |
| **Dominio** | `https://luisvirrueta.com` |
| **Firebase Project** | `diagnostico-emocional-7b8f7` |
| **Cloudflare Worker** | `radiografia-worker` → `https://radiografia-worker.noirpraxis.workers.dev` |
| **Cloudflare Pages** | `luis-virrueta-web` |
| **Admin email** | `luis.virrueta.contacto@gmail.com` |
| **Workspace** | `c:\Users\PC\Desktop\APLICACIONES\luis virrueta\página web zuzana\` |

---

## 2. Tech Stack

| Capa | Tecnología |
|------|-----------|
| **Frontend** | React 18 + Vite 5 |
| **Estilos** | Tailwind CSS 3 |
| **Routing** | react-router-dom v7 |
| **Animaciones** | Framer Motion, GSAP, Lenis (smooth scroll) |
| **3D** | Three.js |
| **Charts** | Recharts, Nivo (Sankey), D3 |
| **PDF** | @react-pdf/renderer, jsPDF, html2canvas |
| **Iconos** | Lucide React |
| **SEO** | react-helmet-async |
| **Auth** | Firebase Auth (Google + Email/Password + Magic Links) |
| **Base de datos** | Firestore (principal), Supabase (blog prerender) |
| **Backend** | Cloudflare Worker (monolito ~2100+ líneas, `cloudflare-worker/index.js`) |
| **Storage** | Cloudflare R2 (buckets: `luisvirrueta-audio`, `luisvirrueta-media`) |
| **Pagos** | Stripe (Checkout Sessions + Webhooks) |
| **Email** | Resend (transaccional, from: `hola@luisvirrueta.com`) |
| **IA** | DeepSeek API (análisis psicológico) |
| **TTS** | ElevenLabs API (audio de diagnósticos) |
| **KV** | Cloudflare KV (`PURCHASES` namespace — tokens, análisis, promos) |

---

## 3. Comandos de Build y Deploy

```powershell
# Desarrollo local
npm run dev          # Vite dev server en puerto 3000

# Build producción (incluye prerender de blog para OG tags)
npm run build        # vite build && node scripts/prerender-blog.mjs

# Deploy frontend (Cloudflare Pages)
cd "página web zuzana"
npx vite build
npx wrangler pages deploy dist --project-name=luis-virrueta-web --commit-dirty=true

# Deploy Worker (solo el worker)
cd cloudflare-worker
npx wrangler deploy

# Deploy Worker completo (crea productos Stripe + secrets + deploy)
cd cloudflare-worker
.\deploy.ps1
```

---

## 4. Variables de Entorno

### Frontend (`.env` — prefijo `VITE_`)

| Variable | Propósito |
|----------|---------|
| `VITE_FIREBASE_API_KEY` | Firebase Web API key |
| `VITE_FIREBASE_AUTH_DOMAIN` | Firebase Auth domain |
| `VITE_FIREBASE_PROJECT_ID` | `diagnostico-emocional-7b8f7` |
| `VITE_FIREBASE_STORAGE_BUCKET` | Firebase Storage bucket |
| `VITE_FIREBASE_MESSAGING_SENDER_ID` | FCM Sender ID |
| `VITE_FIREBASE_APP_ID` | Firebase App ID |
| `VITE_FIREBASE_MEASUREMENT_ID` | Google Analytics |
| `VITE_API_BASE_URL` | URL del Worker |
| `VITE_ADMIN_SECRET` | Secret para endpoints admin del Worker |
| `VITE_SUPABASE_URL` | Supabase URL (blog) |
| `VITE_SUPABASE_ANON_KEY` | Supabase anon key |

### Worker Secrets (`wrangler secret put`)

| Secret | Propósito |
|--------|---------|
| `STRIPE_SECRET_KEY` | Stripe live (`sk_live_...`) |
| `STRIPE_TEST_SECRET_KEY` | Stripe test (`sk_test_...`) |
| `STRIPE_WEBHOOK_SECRET` | Stripe webhook (`whsec_...`) |
| `RESEND_API_KEY` | Resend email (`re_...`) |
| `DEEPSEEK_API_KEY` | DeepSeek Chat API |
| `ELEVENLABS_API_KEY` | ElevenLabs TTS |
| `FIREBASE_SA_EMAIL` | Firebase service account email |
| `FIREBASE_SA_KEY` | Firebase service account private key (PEM) |
| `ADMIN_SECRET` | Admin endpoints secret |

### Worker Vars (`wrangler.toml`)

| Variable | Propósito |
|----------|---------|
| `PRICE_DESCUBRE` / `PRICE_SOLO` / `PRICE_LOSDOS` | Stripe Price IDs (live) |
| `PRICE_DESCUBRE_TEST` / `PRICE_SOLO_TEST` / `PRICE_LOSDOS_TEST` | Stripe Price IDs (test) |

---

## 5. Estructura del Proyecto

```
página web zuzana/
├── src/
│   ├── App.jsx                    # Routes + providers
│   ├── main.jsx                   # Entry point
│   ├── components/                # ~41 componentes reutilizables
│   │   ├── Header.jsx             # Header con split button Herramientas|Tienda
│   │   ├── MobileMenu.jsx         # Menú hamburguesa móvil
│   │   ├── ToolsMenu.jsx          # Dropdown de Herramientas (Blog, Frase, Lab, Atlas)
│   │   ├── AdminBlogEditor.jsx    # Editor de blog CMS (modal)
│   │   ├── RichTextEditor.jsx     # Editor WYSIWYG para contenido de blog
│   │   ├── ReadingProgressBar.jsx # Barra de progreso de lectura (Lenis)
│   │   ├── SEOHead.jsx            # Meta tags OG/Twitter via react-helmet
│   │   └── ...
│   ├── pages/                     # ~42 páginas (lazy-loaded)
│   │   ├── BlogPage.jsx           # Listado de blog + dashed card para nuevo
│   │   ├── BlogArticlePage.jsx    # Artículo individual (~3700+ líneas)
│   │   ├── RadiografiaPremiumPage.jsx  # Cuestionario premium 40 preguntas
│   │   └── ...
│   ├── context/
│   │   ├── AuthContext.jsx        # Firebase Auth + admin detection
│   │   └── LanguageContext.jsx    # i18n
│   ├── config/
│   │   ├── firebase.js            # Firebase init
│   │   └── media.js               # R2 CDN base URL
│   ├── services/
│   │   ├── radiografiaPremiumService.js  # Análisis DeepSeek (40Q, 12 dims, 11 teorías)
│   │   ├── diagnosticRelacionalService.js
│   │   ├── emailApiService.js
│   │   └── ...
│   ├── lib/
│   │   └── supabase.js            # Blog CMS + uploadBlogImage (PUT a R2)
│   ├── utils/
│   │   ├── imageCompression.js    # Compresión de imágenes para upload
│   │   └── ...
│   ├── data/
│   │   ├── blogArticlesContent.js # Artículos legacy (hardcoded)
│   │   └── ...
│   └── translations/
│       └── es.json                # Traducciones español
├── cloudflare-worker/
│   ├── index.js                   # Worker monolito (~2100+ líneas)
│   ├── wrangler.toml              # Config Worker + R2 + KV bindings
│   └── deploy.ps1                 # Script deploy completo
├── functions/                     # Cloudflare Pages Functions
│   ├── blog/[[slug]].js           # OG meta injection para crawlers sociales
│   └── __/auth/[[path]].js        # Proxy Firebase Auth a dominio custom
├── scripts/
│   └── prerender-blog.mjs         # Genera HTML estático con OG tags por artículo
├── dist/                          # Build output (Pages deploy from here)
├── .env                           # Variables de entorno frontend
├── package.json
├── vite.config.js
└── tailwind.config.js
```

---

## 6. Endpoints del Worker (API)

### Media/Audio
| Método | Ruta | Descripción |
|--------|------|-------------|
| GET | `/audio/*` | Servir audio desde R2 (`luisvirrueta-audio`) |
| GET | `/media/*` | Servir media desde R2 (`luisvirrueta-media`) |
| PUT/POST | `/api/media-upload?folder=X&filename=Y` | Subir archivo a R2 (header `X-Admin-Secret`) |
| POST | `/api/media-list` | Listar archivos en R2 |
| POST | `/api/media-delete` | Eliminar archivo de R2 |

### Blog
| Método | Ruta | Descripción |
|--------|------|-------------|
| GET | `/api/blog-meta?slug=X` | Metadata de artículo para OG tags |

### Pagos (Stripe)
| Método | Ruta | Descripción |
|--------|------|-------------|
| POST | `/api/create-radiografia-checkout` | Crear checkout Radiografía |
| POST | `/api/create-custom-checkout` | Crear checkout custom |
| POST | `/api/create-consulta-checkout` | Crear checkout Consulta |
| POST | `/api/verify-payment` | Verificar sesión Stripe, retornar token |
| POST | `/webhook` | Webhook de Stripe |

### Promos
| Método | Ruta | Descripción |
|--------|------|-------------|
| POST | `/api/validate-radiografia-promo` | Validar código promo Radiografía |
| POST | `/api/validate-consulta-promo` | Validar código promo Consulta |
| POST | `/api/create-promo-code` | Admin: crear promo |
| POST | `/api/list-promo-codes` | Admin: listar promos |
| POST | `/api/delete-promo-code` | Admin: eliminar promo |

### Análisis IA
| Método | Ruta | Descripción |
|--------|------|-------------|
| GET | `/api/get-analysis` | Obtener análisis por token |
| GET | `/api/get-cross-analysis` | Obtener análisis cruzado por pairId |
| POST | `/api/deepseek-proxy` | Proxy a DeepSeek Chat API |
| POST | `/api/generate-analysis` | Generar análisis server-side |
| POST | `/api/retry-analysis` | Reintentar análisis fallido |
| POST | `/api/admin-generate` | Admin: generar análisis |
| POST | `/api/admin-cross-analysis` | Admin: generar análisis cruzado |
| POST | `/api/save-analysis` | Guardar análisis en KV |
| POST | `/api/check-cross-status` | Verificar si ambos partners terminaron |
| POST | `/api/mark-partner-done` | Marcar partner como completado |
| POST | `/api/save-cross-analysis` | Guardar análisis cruzado |

### Email (Resend)
| Método | Ruta | Descripción |
|--------|------|-------------|
| POST | `/api/send-access-email` | Email de acceso |
| POST | `/api/send-analysis-email` | Email "resultados listos" |
| POST | `/api/send-backup-email` | Email de respaldo |
| POST | `/api/send-partner-invite` | Invitación a partner ("losdos") |
| POST | `/api/send-verification-code` | Código de verificación email |
| POST | `/api/verify-code` | Verificar código email |
| POST | `/api/send-cross-analysis-email` | Email análisis cruzado listo |
| POST | `/api/send-results-email` | Email con PDF de resultados |
| POST | `/api/notify-consulta-purchase` | Notificación compra consulta |

### Perfil/Usuario
| Método | Ruta | Descripción |
|--------|------|-------------|
| GET | `/api/get-profile` | Obtener perfil usuario |
| POST | `/api/save-profile` | Guardar perfil |
| POST | `/api/delete-auth-user` | Admin: eliminar usuario Firebase |

### TTS
| Método | Ruta | Descripción |
|--------|------|-------------|
| POST | `/api/tts-proxy` | Proxy a ElevenLabs TTS |

---

## 7. Colecciones Firestore

| Colección | Propósito |
|-----------|---------|
| `users/{uid}` | Perfil usuario (displayName, email, role, provider, createdAt) |
| `users/{uid}/purchases/{purchaseId}` | Compras (product, status, responses, analysis, crossAnalysis, partnerRef) |
| `blog_articles` | Artículos blog CMS (title, content, published_at, is_published, slug, language) |
| `partner_invites/{email}` | Invitaciones partner para flujo "losdos" |
| `laboratorio_votos` | Votos del Laboratorio Ético |
| `laboratorio_comentarios` | Comentarios del Laboratorio Ético |

---

## 8. Mapa de Rutas

| Ruta | Componente | Descripción |
|------|-----------|-------------|
| `/` | HomePage | Landing con video |
| `/about` | PhilosophyPage | Manifiesto |
| `/sobre-mi` | AboutPage | Sobre Luis Virrueta |
| `/metodo` | MetodoPage | El Método Aión |
| `/metodo/fases` | FasesPage | Fases del método |
| `/servicios` | ServiciosPage | Servicios |
| `/servicios/identidad-marca` | IdentidadMarcaPage | Identidad de marca |
| `/servicios/apps-premium` | AppsPremiumPage | Apps premium |
| `/servicios/contenido-digital` | ContenidoDigitalPage | Contenido digital |
| `/servicios/avatares-ia` | AvataresIAPage | Avatares IA |
| `/servicios/consultoria-psicologica` | ConsultoriaPsicologicaPage | Consultoría psicológica |
| `/servicios/consulta-pareja` | ConsultaParejaPage | Consulta pareja |
| `/blog` | BlogPage | Listado blog + card nuevo (admin) |
| `/blog/:slug` | BlogArticlePage | Artículo individual (editable por admin) |
| `/tienda` | StorePage | Tienda |
| `/tienda/diagnostico-relacional` | DiagnosticoRelacionalPage | Landing Radiografía + checkout |
| `/tienda/radiografia-premium` | RadiografiaPremiumPage | Cuestionario premium 40 preguntas |
| `/tienda/8` | ConsultaProductPage (individual) | Consulta individual |
| `/tienda/9` | ConsultaProductPage (pareja) | Consulta pareja |
| `/tienda/consulta-gracias` | ConsultaGraciasPage | Gracias consulta |
| `/contacto` | ContactoPage | Contacto |
| `/inversion` | InversionPage | Pricing premium |
| `/perfil` | PerfilPage | Perfil usuario |
| `/registro` | RegistroPage | Registro |
| `/frase-del-dia` | FraseDelDiaPage | Frase del día |
| `/atlas-humanidad` | AtlasHumanidadPage | Atlas de la Humanidad |
| `/laboratorio-etico` | LaboratorioEticoPage | Laboratorio Ético |
| `/politica-privacidad` | PrivacyPolicyPage | Política de privacidad |
| `/terminos-condiciones` | TermsConditionsPage | Términos |
| `/politica-cookies` | CookiePolicyPage | Cookies |

---

## 9. Productos y Precios (Stripe, MXN)

### Radiografía de Pareja
| Producto | Precio | Stripe Price ID (live) |
|----------|--------|----------------------|
| Descubre (individual) | $499 MXN | `price_1TAx9DGpKMTmfzJmpkCihX2H` |
| Solo (pareja, un lado) | $499 MXN | `price_1TAx9DGpKMTmfzJmA3AaPICo` |
| Los Dos (pareja, ambos) | $999 MXN | `price_1TAx9EGpKMTmfzJmo8Z6WY4q` |

### Consultas
| Producto | Precio |
|----------|--------|
| Consulta Individual (60 min) | $700 MXN |
| Consulta de Pareja (90 min) | $1,250 MXN |

### Códigos Promo Built-in
- `LANZAMIENTO50` — 50% descuento
- `BETA100` — Acceso gratuito
- `MENTELIBRE` — $200 off consulta individual
- `DOSPUERTAS` — $250 off consulta pareja

---

## 10. Arquitectura Clave

### Blog CMS
- **Híbrido**: Artículos legacy hardcoded en `blogArticlesContent.js` + artículos CMS en Firestore `blog_articles`
- **Editor**: `AdminBlogEditor.jsx` (modal), `BlogArticlePage.jsx` (inline con `isEditMode`)
- **RichTextEditor**: Editor WYSIWYG basado en contentEditable con bloques tipados (title, subtitle, paragraph, heading, image, section, questions, whatsapp, etc.)
- **Imágenes blog**: Se suben a R2 via `PUT /api/media-upload?folder=blog&filename=X` con body raw y header `X-Admin-Secret`
- **Función**: `uploadBlogImage(file)` en `src/lib/supabase.js`

### Radiografía de Pareja (Producto Principal)
1. Usuario compra vía Stripe Checkout
2. Webhook crea registro en `users/{uid}/purchases`
3. Usuario responde 40 preguntas narrativas
4. Frontend envía respuestas a Worker (`/api/generate-analysis`)
5. Worker llama DeepSeek API, genera análisis (12 dimensiones, 11 teorías)
6. Análisis guardado en KV + Firestore
7. **Flujo "losdos"**: Comprador invita a partner → partner responde → cuando ambos terminan → se genera análisis cruzado automáticamente via `ctx.waitUntil` + Firestore `onSnapshot`

### Auth
- Firebase Auth con Google (popup localhost, redirect producción), Email/Password, Magic Links
- Verificación de email custom: Worker envía código via Resend, frontend lo verifica
- Admin detección: email === `luis.virrueta.contacto@gmail.com`
- Pages Function proxy para dominio custom (`/__/auth/`)

### Media CDN
- Todo servido desde R2 via Worker (`/media/*` y `/audio/*`)
- Base URL definida en `src/config/media.js`
- Carpetas R2: `headers/`, `blog/`, `products/` (media), carpetas varias (audio)

### Smooth Scroll
- Lenis (`@studio-freight/lenis`) en `SmoothScroll.jsx`
- Expuesto como `window.__lenis`
- `ReadingProgressBar.jsx` usa `window.__lenis.scroll` con retry logic

---

## 11. Detección de Admin (Frontend)

```jsx
// AuthContext.jsx
const ADMIN_EMAIL = 'luis.virrueta.contacto@gmail.com'
setIsAdmin(firebaseUser.email === ADMIN_EMAIL)
```

El admin puede:
- Ver/crear/editar artículos de blog
- Acceder al dashboard admin
- Regenerar análisis
- Gestionar códigos promo
- Eliminar usuarios

---

## 12. Vite Config Highlights

- **Dev proxy**: `/api` y `/webhook` → `https://radiografia-worker.noirpraxis.workers.dev`
- **Manual chunks**: `react-vendor`, `framer-motion`, `lucide`
- **Build target**: `es2015`, sin sourcemaps
- **Puerto dev**: 3000

---

## 13. Tailwind Theme

| Token | Valor | Uso |
|-------|-------|-----|
| Font `display` | Playfair Display | Headings |
| Font `sans`/`body` | Outfit | Body text |
| Font `mono` | Space Grotesk | Monospace |
| `luxmania.black` | `#0A0A0A` | Background principal |
| `luxmania.blue` | `#0066FF` | CTAs, tech accent |
| `luxmania.gold` | `#D4AF37` | Premium accent |

---

## 14. Notas de Desarrollo Recientes

### Fixes Aplicados (Sesión Actual)
1. **AdminBlogEditor**: `contentEditable` → `<input>` para título/subtítulo
2. **uploadBlogImage**: Corregido endpoint (`PUT /api/media-upload?folder=blog&filename=X` con body raw)
3. **BlogPage**: Botones flotantes admin removidos, card punteada para nuevo artículo
4. **Header desktop**: Split button Herramientas|Tienda (removido `overflow-hidden` que cortaba dropdown)
5. **Header móvil**: `ToolsMenu` removido del header (solo aparece en menú hamburguesa)
6. **MobileMenu**: Herramientas + Tienda movidos arriba de nav items
7. **ReadingProgressBar**: Lenis retry logic con `window.__lenis.scroll`
8. **OG tags**: Worker endpoint `GET /api/blog-meta`, Pages Function `functions/blog/[[slug]].js`
9. **BlogArticlePage title/subtitle**: Fix de espacios — `toSentenceCase` removido de `onChange`, aplicado solo en `onBlur`
10. **Imagen hero nuevo artículo**: Sin fallback `portada.webp` para slug "nuevo", placeholder visual

### Archivos Modificados Frecuentemente
- `cloudflare-worker/index.js` — Backend completo
- `src/pages/BlogArticlePage.jsx` — Artículo blog (~3700+ líneas)
- `src/components/Header.jsx` — Header con nav
- `src/components/AdminBlogEditor.jsx` — Editor blog modal
- `src/lib/supabase.js` — Funciones blog + upload
- `src/components/RichTextEditor.jsx` — Editor WYSIWYG

---

## 15. Para Iniciar un Chat Nuevo

Copia este bloque al inicio del nuevo chat:

```
Estoy trabajando en el proyecto luisvirrueta.com.
Workspace: c:\Users\PC\Desktop\APLICACIONES\luis virrueta\página web zuzana\

Stack: React 18 + Vite 5 + Tailwind 3 + Firebase Auth/Firestore + 
Cloudflare Worker (backend) + R2 (media) + Stripe (pagos) + Resend (email) + DeepSeek (IA)

Deploy frontend: npx vite build && npx wrangler pages deploy dist --project-name=luis-virrueta-web --commit-dirty=true
Deploy worker: cd cloudflare-worker && npx wrangler deploy

Worker URL: https://radiografia-worker.noirpraxis.workers.dev
Admin email: luis.virrueta.contacto@gmail.com

El archivo FLUX-PROYECTO.md tiene toda la documentación detallada.
Lee ese archivo primero para obtener contexto completo.
```
