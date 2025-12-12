# 🚀 CONFIGURACIÓN GOOGLE ANALYTICS 4 - PASO A PASO
**Para: LUXMANIA (lux-mania.com)**
**Fecha:** 12 Diciembre 2025
**Mercado:** Europa (CEOs que hablan inglés)

---

## 🎯 PASO 1: CREAR CUENTA DE GOOGLE ANALYTICS 4

### 1.1 Ir a Google Analytics
Abre en tu navegador: **https://analytics.google.com**

### 1.2 Crear Cuenta
Click en **"Comenzar a medir"** o **"Crear"**

**Configuración de Cuenta:**
```
Nombre de cuenta: LUXMANIA
País/región: República Checa (Czechia)
☑️ Compartir datos de Analytics (marcar las que quieras)
```
Click **"Siguiente"**

---

### 1.3 Crear Propiedad

**Configuración de Propiedad:**
```
Nombre de la propiedad: lux-mania.com
Zona horaria: (GMT+1) Praga / Europa Central
Moneda: EUR (Euro) ← IMPORTANTE para clientes europeos
```

**Opciones avanzadas:**
Si te pregunta por "Universal Analytics", ignóralo. Solo necesitas GA4.

Click **"Siguiente"**

---

### 1.4 Información Empresarial

**Datos de tu negocio:**
```
Sector: Marketing y publicidad / Servicios profesionales
Tamaño de la empresa: Pequeña (1-10 empleados)

Objetivos (marca los que quieras):
☑️ Generar clientes potenciales
☑️ Aumentar el conocimiento de marca
☑️ Examinar el comportamiento de los usuarios
```

Click **"Crear"**

---

### 1.5 Aceptar Términos

- ☑️ Acepta los términos de servicio de Google Analytics
- País: **República Checa**
- ☑️ Acepta el Contrato de procesamiento de datos del RGPD (importante para Europa)

Click **"Acepto"**

---

## 📊 PASO 2: CONFIGURAR FLUJO DE DATOS WEB

### 2.1 Seleccionar Plataforma
Te preguntará qué tipo de datos quieres recopilar:
- Selecciona: **"Web"** (icono de globe 🌐)

### 2.2 Configurar Flujo de Datos Web

**Datos del sitio web:**
```
URL del sitio web: https://lux-mania.com
Nombre del flujo: LUXMANIA Website (o "Producción")
```

**Medición mejorada (Enhanced Measurement):**
☑️ **Dejar TODAS activadas** (por defecto vienen activadas):
- Vistas de página ✅
- Scroll profundo ✅
- Clics salientes ✅
- Búsqueda en el sitio ✅
- Interacciones con videos ✅
- Descargas de archivos ✅

Click **"Crear flujo"**

---

## 🔑 PASO 3: COPIAR TU ID DE MEDICIÓN

Una vez creado el flujo, verás una pantalla con:

### **TU ID DE MEDICIÓN** (aparece arriba, grande):
```
G-XXXXXXXXX (ejemplo: G-K9L2M7P3Q5)
```

**🚨 COPIA ESTE ID COMPLETO** - Lo necesitarás en el siguiente paso.

---

## 💻 PASO 4: YO ACTUALIZO TU INDEX.HTML

Una vez que me des tu ID (ejemplo: `G-K9L2M7P3Q5`), yo actualizaré automáticamente tu `index.html` en las 2 líneas que lo necesitan.

**No necesitas hacer nada más aquí, solo dame el ID.**

---

## ✅ PASO 5: CONFIGURACIONES ADICIONALES RECOMENDADAS

### 5.1 Google Signals (Publicidad Personalizada)

En el panel de GA4:
1. Ve a **"Administrador"** (⚙️ abajo izquierda)
2. Click en **"Recopilación de datos"**
3. **Activar Google Signals** (para remarketing y audiencias)
4. Click **"Continuar"** → **"Activar"**

**¿Para qué sirve?**
- Datos demográficos (edad, género, intereses)
- Remarketing en Google Ads
- Cross-device tracking

---

### 5.2 Datos Demográficos

En "Recopilación de datos":
1. Scroll hasta **"Informa sobre características de los usuarios"**
2. ☑️ Activar
3. Guardar

**Te dará info de:**
- Edad de visitantes
- Género
- Intereses (tecnología, negocios, etc.)
- Ubicación geográfica

---

### 5.3 Eventos Personalizados (LO CONFIGURAREMOS DESPUÉS)

Una vez tengas datos (1-2 días), configuraremos:
- Clics en WhatsApp button
- Clics en "Ver servicios"
- Tiempo en artículo >3 minutos
- Scroll al 80% del artículo
- Envío de formulario de contacto

**Por ahora no toques esto.** Primero que funcione el tracking básico.

---

## 🔍 PASO 6: VERIFICAR QUE FUNCIONA (DESPUÉS DEL DEPLOY)

### Opción 1: Real-Time Report (INMEDIATO)

1. En GA4, ve a **"Informes"** (📊 menú izquierdo)
2. Click en **"Tiempo real"**
3. Abre tu sitio `lux-mania.com` en otra pestaña
4. **Deberías ver "1 usuario activo en este momento"** en el dashboard

**Si lo ves:** ✅ ¡Funciona!
**Si no lo ves:** Revisa que el ID esté bien en el index.html

---

### Opción 2: Google Tag Assistant (Extensión Chrome)

1. Instala la extensión: **Google Tag Assistant (Legacy)** o **Tag Assistant Companion**
2. Abre tu sitio lux-mania.com
3. Click en la extensión
4. Debería mostrar: **"Google Analytics: GA4 - G-XXXXXXXX"** en verde

---

### Opción 3: DevTools Console

1. Abre tu sitio lux-mania.com
2. Presiona **F12** (abrir DevTools)
3. Ve a la pestaña **"Console"**
4. Escribe: `window.dataLayer`
5. Deberías ver un array con eventos:
```javascript
[
  ['js', Date],
  ['config', 'G-XXXXXXXX', {...}],
  ...
]
```

Si ves esto: ✅ Analytics está funcionando

---

## 📈 PASO 7: PRIMEROS DATOS (24-48 HORAS)

### ¿Cuándo veré datos?

**Inmediato (0-5 minutos):**
- ✅ Informes en tiempo real

**Misma hora (~30 minutos):**
- ✅ Primeros eventos procesados

**24 horas:**
- ✅ Informes estándar completos
- ✅ Páginas más vistas
- ✅ Fuentes de tráfico
- ✅ Datos demográficos (si activaste Google Signals)

**48-72 horas:**
- ✅ Datos de búsqueda de Google (Search Console)
- ✅ Métricas de engagement completas

---

## 🎯 QUÉ MÉTRICAS REVISAR DIARIAMENTE

### Dashboard Diario (5 minutos cada mañana):

1. **Usuarios activos (últimas 24h)**
   - Panel: "Informes" → "Instantánea"
   - Meta semana 1: 50+ usuarios/día

2. **Páginas más vistas**
   - Panel: "Informes" → "Engagement" → "Páginas y pantallas"
   - Identifica qué artículos atraen más

3. **Fuentes de tráfico**
   - Panel: "Informes" → "Adquisición" → "Resumen de adquisición"
   - Monitorea: Orgánico (Google), Directo, Social, Referido

4. **Países de origen**
   - Panel: "Informes" → "Demografía" → "Resumen demográfico"
   - ¿Están llegando europeos?

5. **Eventos importantes**
   - Panel: "Informes" → "Engagement" → "Eventos"
   - Clicks, scrolls, tiempo en página

---

## 📊 ANÁLISIS SEMANAL (LO HAREMOS JUNTOS)

### Cada viernes revisaremos:

1. **Crecimiento:**
   - Usuarios semana actual vs semana anterior
   - % de crecimiento

2. **Contenido ganador:**
   - Top 5 artículos con más tráfico
   - Tiempo promedio en página
   - Tasa de rebote

3. **Keywords que están funcionando:**
   - Conectaremos con Google Search Console
   - Veremos qué búsquedas te encuentran

4. **Optimizaciones:**
   - Artículos a mejorar
   - Nuevos temas a escribir
   - Páginas con alta tasa de rebote

---

## 🔥 OPTIMIZACIONES AVANZADAS (SEMANA 2-3)

### Una vez tengas datos suficientes:

1. **Audiencias personalizadas:**
   - Usuarios que leen >3 artículos
   - Visitantes de páginas de servicios
   - Usuarios con >5 min de sesión

2. **Embudos de conversión:**
   - Home → Blog → Servicios → Contacto
   - ¿Dónde se pierden usuarios?

3. **A/B Testing (futuro):**
   - Títulos de artículos
   - CTAs
   - Imágenes hero

---

## 🇪🇺 CONFIGURACIÓN ESPECÍFICA PARA EUROPA

### Cumplimiento RGPD:

**En GA4 ya está:**
- ✅ IP Anonymization (automático en GA4)
- ✅ Data Processing Agreement aceptado
- ✅ Almacenamiento en servidores de Google en Europa

**En tu sitio (ya tienes):**
- ✅ Cookie Banner funcionando
- ✅ Privacy Policy
- ✅ Cookie Policy

**IMPORTANTE:** Tu Cookie Banner debe permitir que usuarios **rechacen** Analytics. Si rechazan, GA4 no debería cargar. Esto lo revisaremos después.

---

## 🎯 ESTRATEGIA DE CONTENIDO BASADA EN DATOS

### Ciclo de mejora continua:

```
DÍA 1-3: Recopilar datos base
↓
DÍA 4-7: Identificar patrones
↓
SEMANA 2: Primera optimización
↓
SEMANA 3: Medir resultados
↓
SEMANA 4: Escalar lo que funciona
```

### Decisiones basadas en datos:

**Si un artículo tiene alto tráfico pero bajo tiempo:**
→ Mejorar introducción, agregar más visual

**Si un artículo tiene bajo tráfico pero alto engagement:**
→ Mejorar SEO del título, agregar keywords

**Si una keyword trae tráfico pero alta tasa de rebote:**
→ El contenido no cumple expectativa, reescribir

---

## 🚨 PROBLEMAS COMUNES Y SOLUCIONES

### "No veo datos en Tiempo Real"

**Causas:**
1. ❌ ID mal copiado → Verifica el ID en index.html
2. ❌ Ad blocker activado → Desactívalo en tu sitio
3. ❌ Sitio no deployado → Asegúrate de hacer `npm run build` y deploy

### "Los datos aparecen con retraso"

**Normal:** Los informes estándar se procesan cada 24-48h.
**Solución:** Usa "Tiempo real" para verificación inmediata.

### "No veo datos demográficos"

**Causa:** Google Signals no activado o pocos datos aún.
**Solución:** Activa Google Signals (ver Paso 5.1) y espera 3-7 días.

---

## ✅ CHECKLIST FINAL

Antes de cerrar esta guía, asegúrate de:

- [ ] ✅ Cuenta GA4 creada con **Europa (Czechia)** como país
- [ ] ✅ Propiedad creada con **EUR** como moneda
- [ ] ✅ Flujo de datos web configurado
- [ ] ✅ ID de medición copiado (G-XXXXXXXXX)
- [ ] ✅ Yo actualicé tu index.html con el ID real
- [ ] ✅ Google Signals activado (datos demográficos)
- [ ] ✅ Deploy realizado a Netlify
- [ ] ✅ Verificado en Tiempo Real (ves "1 usuario activo")

---

## 🎉 ¡LISTO PARA ANALIZAR!

Una vez completado todo:
- 📊 **Revisa tu dashboard cada mañana** (5 minutos)
- 📈 **Enviame capturas del dashboard** cuando quieras análisis
- 🚀 **Cada viernes analizamos juntos** la semana completa
- 💡 **Optimizamos contenido** basado en datos reales

**Desde el día 1 estaremos viendo:**
- ¿Quién visita tu sitio?
- ¿De dónde vienen?
- ¿Qué leen?
- ¿Cuánto tiempo se quedan?

Y basado en eso, **mejoramos constantemente**.

---

**¿Listo para configurar?** Dame tu ID de Google Analytics cuando lo tengas y continúo actualizando todo.
