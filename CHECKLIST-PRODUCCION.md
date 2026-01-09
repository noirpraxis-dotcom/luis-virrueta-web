# ✅ CHECKLIST DE PRODUCCIÓN - BLOG CMS

## 📋 RESUMEN
Tu página web funciona con:
- **Frontend:** GitHub → Cloudflare Pages
- **Backend/Base de datos:** Supabase
- **CMS/Admin:** Integrado en la página (ruta `/blog` botón Admin)

---

## 🔐 PASO 1: CONFIGURAR SUPABASE

### 1.1 Verificar que las tablas existan

1. Ve a https://supabase.com
2. Abre tu proyecto
3. Ve a **SQL Editor** (menú lateral izquierdo)
4. Verifica que la tabla `blog_articles` existe ejecutando:
   ```sql
   SELECT * FROM blog_articles LIMIT 5;
   ```
5. Si la tabla NO existe, copia TODO el contenido del archivo `supabase-schema.sql` y pégalo en el SQL Editor y ejecuta.

### 1.2 Verificar Row Level Security (RLS)

Ejecuta en SQL Editor:
```sql
-- Verificar que RLS está habilitado
SELECT tablename, rowsecurity 
FROM pg_tables 
WHERE schemaname = 'public' AND tablename = 'blog_articles';
```

Debe mostrar `rowsecurity = true`. Si no, ejecuta:
```sql
ALTER TABLE blog_articles ENABLE ROW LEVEL SECURITY;
```

### 1.3 Verificar políticas de seguridad

Ejecuta:
```sql
SELECT * FROM pg_policies WHERE tablename = 'blog_articles';
```

Deberías ver 4 políticas:
- ✅ "Artículos publicados son públicos" (SELECT)
- ✅ "Admin puede leer todo" (SELECT, authenticated)
- ✅ "Admin puede insertar" (INSERT, authenticated)
- ✅ "Admin puede actualizar" (UPDATE, authenticated)
- ✅ "Admin puede borrar" (DELETE, authenticated)

Si faltan, ejecuta TODO el `supabase-schema.sql` de nuevo.

### 1.4 Crear bucket de Storage para imágenes

1. En Supabase, ve a **Storage** (menú lateral)
2. Click en **New bucket**
3. Nombre: `blog-images`
4. **Public bucket:** ✅ ACTIVO (MUY IMPORTANTE)
5. Click **Create bucket**

### 1.5 Configurar políticas de Storage

1. En Storage, click en el bucket `blog-images`
2. Ve a **Policies** (pestaña)
3. Click **New Policy**
4. Crea estas 2 políticas:

**Política 1: Lectura pública**
- Target roles: `public`
- Policy name: `Public read access`
- Allowed operation: `SELECT`
- Policy definition: `true` (o deja el default)

**Política 2: Escritura para autenticados**
- Target roles: `authenticated`
- Policy name: `Authenticated can upload`
- Allowed operations: `INSERT`, `UPDATE`, `DELETE`
- Policy definition: `true`

### 1.6 Crear tu usuario administrador

1. Ve a **Authentication** → **Users** en Supabase
2. Click **Add user** → **Create new user**
3. Email: tu email (ej: `luis@tudominio.com`)
4. Password: una contraseña segura (guárdala)
5. ✅ **Confirmar email automáticamente**
6. Click **Create user**

⚠️ **MUY IMPORTANTE:** 
- Ve a **Authentication** → **Providers** → **Email**
- **Desactiva "Enable email signups"** para que solo tú puedas entrar
- Solo se puede registrar manualmente desde el panel

---

## 🌐 PASO 2: CONFIGURAR CLOUDFLARE

### 2.1 Variables de entorno en Cloudflare Pages

1. Ve a tu dashboard de Cloudflare: https://dash.cloudflare.com
2. Ve a **Workers & Pages** → Tu sitio
3. Ve a **Settings** → **Environment variables**
4. Agrega estas variables (tanto para Production como Preview):

```
VITE_SUPABASE_URL = https://tu-proyecto.supabase.co
VITE_SUPABASE_ANON_KEY = tu_anon_key_aqui
```

Para obtener estos valores:
1. Ve a tu proyecto Supabase
2. Click en **Settings** (⚙️) → **API**
3. Copia:
   - **Project URL** → `VITE_SUPABASE_URL`
   - **anon public** key → `VITE_SUPABASE_ANON_KEY`

### 2.2 Verificar configuración del build en Cloudflare

En Cloudflare Pages → Settings → Builds:

**Build command:**
```bash
npm run build
```

**Build output directory:**
```
dist
```

**Root directory:**
```
página web zuzana
```
(o como se llame tu carpeta en el repo)

**Node version:**
```
18
```
(o superior)

### 2.3 Forzar un nuevo deploy

1. Ve a **Deployments** en Cloudflare Pages
2. Click en los tres puntos del último deployment
3. Click **Retry deployment**
4. Espera a que termine (verás el status en tiempo real)

---

## 🧪 PASO 3: PROBAR EN PRODUCCIÓN

### 3.1 Probar acceso público (sin login)

1. Ve a tu página: `https://tudominio.com/blog`
2. Deberías ver el blog (sin artículos aún, eso es normal)
3. Verifica que NO aparezcan errores en la consola (F12)

### 3.2 Probar login de admin

1. En `/blog`, click en el botón **Admin** (esquina superior derecha)
2. Ingresa tu email y contraseña (la que creaste en Supabase)
3. Deberías poder entrar

**Si no funciona el login:**
- Abre la consola del navegador (F12)
- Ve a la pestaña **Network**
- Intenta hacer login de nuevo
- Busca errores en las peticiones a Supabase

### 3.3 Probar crear un artículo de prueba

1. Una vez logueado, click en **+ Nuevo Artículo**
2. Rellena los campos básicos:
   - Título: "Artículo de prueba"
   - Subtítulo: "Esto es una prueba"
   - Extracto: "Verificando que todo funcione"
   - Categoría: "philosophy"
3. Agrega un bloque de texto en el contenido
4. ✅ Marca "Publicado"
5. Click **Guardar**

### 3.4 Verificar que se guardó en Supabase

1. Ve a Supabase → **Table Editor** → `blog_articles`
2. Deberías ver tu artículo de prueba
3. Si está ahí, ¡TODO FUNCIONA! 🎉

### 3.5 Verificar que aparece en la página

1. Cierra sesión (logout)
2. Ve a `/blog`
3. Deberías ver tu artículo de prueba
4. Click en él para ver la página del artículo

---

## 📱 PASO 4: ACCESO DESDE MÓVIL

Una vez que todo funcione en producción:

1. Desde tu teléfono, abre el navegador
2. Ve a `https://tudominio.com/blog`
3. Click en **Admin**
4. Ingresa tu email y contraseña
5. ¡Listo! Ya puedes crear/editar artículos desde tu teléfono

---

## 🔍 SOLUCIÓN DE PROBLEMAS COMUNES

### ❌ "No puedo hacer login"

**Solución:**
1. Verifica que las variables de entorno estén en Cloudflare
2. Verifica que el usuario existe en Supabase Authentication
3. Verifica que las políticas RLS estén configuradas
4. Intenta hacer login desde local primero para descartar problemas de Supabase

### ❌ "Login funciona pero no puedo crear artículos"

**Solución:**
1. Verifica las políticas de INSERT/UPDATE/DELETE en `blog_articles`
2. En Supabase SQL Editor ejecuta:
   ```sql
   SELECT * FROM pg_policies WHERE tablename = 'blog_articles';
   ```
3. Deberían estar las 4 políticas del Paso 1.3

### ❌ "No puedo subir imágenes"

**Solución:**
1. Verifica que el bucket `blog-images` existe
2. Verifica que el bucket es **público**
3. Verifica que las políticas de storage estén configuradas (Paso 1.5)

### ❌ "En local funciona pero en producción no"

**Solución:**
1. Verifica que las variables de entorno estén en Cloudflare (Paso 2.1)
2. Haz un nuevo deploy en Cloudflare (Paso 2.3)
3. Limpia la caché de Cloudflare:
   - Dashboard → Caching → Configuration
   - Click "Purge Everything"

### ❌ "Los artículos no aparecen en el blog"

**Solución:**
1. Verifica que el artículo esté marcado como `is_published = true` en Supabase
2. Verifica que la política "Artículos publicados son públicos" esté activa
3. Refresca la página con Ctrl+F5 (limpia caché del navegador)

---

## 📝 ARCHIVO .env LOCAL (SOLO PARA TU PC)

Crea un archivo `.env` en la raíz del proyecto (si no existe):

```env
VITE_SUPABASE_URL=https://tu-proyecto.supabase.co
VITE_SUPABASE_ANON_KEY=tu_anon_key_aqui
```

⚠️ **IMPORTANTE:** Este archivo NO se sube a GitHub (ya está en .gitignore)

---

## ✅ CHECKLIST RÁPIDO

- [ ] Tabla `blog_articles` creada en Supabase
- [ ] RLS habilitado en la tabla
- [ ] 4 políticas de seguridad configuradas
- [ ] Bucket `blog-images` creado (público)
- [ ] 2 políticas de storage configuradas
- [ ] Usuario admin creado en Supabase Auth
- [ ] Email signups desactivado en Supabase
- [ ] Variables de entorno agregadas en Cloudflare
- [ ] Nuevo deploy realizado en Cloudflare
- [ ] Login funciona en producción
- [ ] Puedo crear/editar artículos en producción
- [ ] Puedo subir imágenes
- [ ] Los artículos publicados aparecen en el blog
- [ ] Funciona desde móvil

---

## 🎯 RESUMEN FINAL

Tu sistema está diseñado para funcionar así:

1. **Escribes artículos:** Desde cualquier lugar, entrando a `tudominio.com/blog` → Admin
2. **Se guardan en Supabase:** Base de datos en la nube
3. **Aparecen en la web:** Automáticamente, sin necesidad de hacer deploy
4. **Las imágenes se suben a Supabase Storage:** También en la nube

**No necesitas tocar código para agregar artículos** ✨

---

## 📞 SOPORTE

Si algo no funciona:
1. Revisa los errores en la consola del navegador (F12)
2. Revisa los logs de Cloudflare Pages (Deployments → tu deploy → Logs)
3. Revisa los logs de Supabase (Logs → API)
