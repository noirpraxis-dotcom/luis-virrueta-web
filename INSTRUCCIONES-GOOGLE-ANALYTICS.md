# 📊 INSTRUCCIONES: GOOGLE ANALYTICS 4 SETUP

## ⚠️ ACCIÓN REQUERIDA

El código de Google Analytics 4 ya está instalado en `index.html`, pero **necesitas tu ID real de Google Analytics**.

---

## 🔧 PASO 1: Crear Cuenta Google Analytics

1. Ve a https://analytics.google.com
2. Haz clic en "Comenzar a medir"
3. Crea una cuenta:
   - **Nombre de cuenta:** LUXMANIA
   - **País:** México
   - **Moneda:** Peso mexicano (MXN)
4. Crea una propiedad:
   - **Nombre de la propiedad:** luxmania.com
   - **Zona horaria:** (GMT-6) Ciudad de México
   - **Moneda:** MXN
5. Configura el flujo de datos:
   - Selecciona **Web**
   - **URL del sitio web:** `https://luxmania.com`
   - **Nombre del flujo:** LUXMANIA Website
6. **COPIA TU ID DE MEDICIÓN:** Aparecerá como `G-XXXXXXXXXX`

---

## 🔧 PASO 2: Reemplazar en index.html

Abre `index.html` y busca estas 2 líneas:

```html
<script async src="https://www.googletagmanager.com/gtag/js?id=G-XXXXXXXXXX"></script>
```

```javascript
gtag('config', 'G-XXXXXXXXXX', {
```

**Reemplaza `G-XXXXXXXXXX` con tu ID real.**

Ejemplo:
```html
<script async src="https://www.googletagmanager.com/gtag/js?id=G-ABC123DEF4"></script>
```

```javascript
gtag('config', 'G-ABC123DEF4', {
```

---

## ✅ PASO 3: Verificar que Funciona

1. Deploy tu sitio a Netlify
2. Abre tu sitio en navegador
3. Abre **DevTools** (F12)
4. Ve a la pestaña **Console**
5. Busca mensajes de Google Analytics (deben aparecer sin errores)

**Verificación en Google Analytics:**
1. Ve a https://analytics.google.com
2. Click en "Informes" > "Tiempo real"
3. Abre tu sitio en otra pestaña
4. Deberías ver **1 usuario activo** en el dashboard de Tiempo Real

---

## 🚀 PASO 4: Google Search Console

Una vez que tengas tu sitio en Netlify:

1. Ve a https://search.google.com/search-console
2. Click "Agregar propiedad"
3. Selecciona **Prefijo de URL**
4. Ingresa: `https://luxmania.com`
5. **Verificación:** Elige método "Etiqueta HTML"
   - Te darán un código como: `<meta name="google-site-verification" content="ABC123..." />`
   - Agrégalo al `<head>` de `index.html` (antes del cierre `</head>`)
6. Click "Verificar"
7. Una vez verificado:
   - Click en "Sitemaps" (menú izquierdo)
   - Agregar nuevo sitemap: `https://luxmania.com/sitemap.xml`
   - Click "Enviar"

---

## 🔥 PASO 5: Request Indexing (CRÍTICO)

Para que Google indexe tus artículos de blog **rápido**:

1. En Google Search Console, ve a **Inspección de URLs**
2. Pega cada URL importante:
   ```
   https://luxmania.com/blog/cliente-heroe-storybrand-framework
   https://luxmania.com/blog/pre-suasion-cialdini-branding
   https://luxmania.com/blog/seis-armas-persuasion-cialdini
   https://luxmania.com/blog/paralisis-eleccion-simplifica-oferta
   ```
3. Click **"Solicitar indexación"** en cada una
4. Google las indexará en 24-48 horas

---

## 📈 QUÉ MÉTRICAS REVISAR

### Google Analytics (cada semana):
- **Usuarios activos** (cuánta gente visita)
- **Sesiones por página** (qué páginas son populares)
- **Tiempo de permanencia** (cuánto tiempo leen)
- **Tasa de rebote** (cuántos se van sin hacer nada)
- **Conversiones** (si configuraste eventos de contacto)

### Google Search Console (cada semana):
- **Impresiones** (cuántas veces apareces en Google)
- **Clics** (cuánta gente hace click)
- **CTR** (% de clicks cuando apareces)
- **Posición promedio** (dónde apareces en resultados)
- **Queries** (qué keywords te encuentran)

---

## ⚡ QUICK WINS INMEDIATOS

### Día 1: Deploy
```bash
npm run build
# Sube todo el contenido de /dist a Netlify
```

### Día 2: Google Setup
- Crear Google Analytics 4
- Reemplazar ID en index.html
- Re-deploy

### Día 3: Search Console
- Verificar propiedad
- Enviar sitemap.xml
- Request indexing de artículos

### Semana 2: Monitoreo
- Revisar Google Analytics (tráfico)
- Revisar Search Console (keywords)
- Ajustar meta descriptions si CTR es bajo

---

## 🚨 TROUBLESHOOTING

**"No veo datos en Google Analytics":**
- Verifica que reemplazaste el ID
- Abre DevTools y busca errores en Console
- Espera 24 horas (puede tardar)

**"Google Search Console no muestra mi sitio":**
- Verifica que el meta tag de verificación está en index.html
- Asegúrate que está entre `<head>` y `</head>`
- Re-deploy después de agregar el tag

**"Mis artículos no aparecen en Google":**
- Request indexing en Search Console
- Espera 48-72 horas
- Comparte en redes sociales para señales sociales

---

## 📊 EJEMPLO DE META TAG DE VERIFICACIÓN

Cuando Google Search Console te dé el código, agrégalo así en `index.html`:

```html
<head>
  <meta charset="UTF-8" />
  <link rel="icon" type="image/svg+xml" href="/favicon.svg" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  
  <!-- Google Search Console Verification -->
  <meta name="google-site-verification" content="TU_CODIGO_AQUI" />
  
  <!-- resto del head -->
</head>
```

---

## ✅ CHECKLIST FINAL

- [ ] Google Analytics 4 creado
- [ ] ID reemplazado en index.html (2 lugares)
- [ ] Sitio deployado a Netlify
- [ ] Google Analytics verificado (Tiempo Real)
- [ ] Google Search Console configurado
- [ ] Propiedad verificada en Search Console
- [ ] sitemap.xml enviado
- [ ] Request indexing de 4 artículos principales
- [ ] Meta tag de verificación agregado

---

**¿Dudas?** Revisa esta documentación paso a paso. Google tarda 24-48h en mostrar datos iniciales, no te preocupes si no ves nada inmediatamente.
