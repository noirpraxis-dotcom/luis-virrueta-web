# Supabase “Full” (Auth + RLS + Migración) — Paso a paso

Fecha: 2026-01-03

## 0) Respuesta rápida: ¿Ya está todo migrado?
No necesariamente.

En tu proyecto ya está **el código listo** para:
- Guardar/editar artículos en Supabase (desde el admin).
- Leer artículos desde Supabase (y si no existe, caer a contenido legacy).
- Migrar automáticamente los artículos legacy hacia Supabase.

Pero la migración **solo queda “hecha”** cuando:
1) Ejecutas el SQL de `supabase-schema.sql` en el SQL Editor de Supabase.
2) Creas el usuario admin en Supabase Auth (email/password).
3) Pones las variables en tu `.env`.
4) Corres el script `node migrate-blogs-to-supabase.js` (sin `--dry-run`).

---

## 1) Qué ya está hecho en el repo (tú ya lo tienes)
- **Login de admin con Supabase Auth** (ya no usa `admin_session` local).
- **RLS más estricto** escrito en `supabase-schema.sql`:
  - Público: solo puede leer artículos publicados y no-futuros.
  - Escritura: solo `authenticated`.
- **Blog listado**: mezcla artículos hardcodeados + Supabase por idioma.
- **Blog detalle**: intenta Supabase primero por `(slug, language)`.
- **Script de migración**:
  - `--dry-run` detecta cuántos artículos existen en `src/data/blogArticlesContent.js`.

Dato útil: el `--dry-run` ya detecta **42 blogs**.

---

## 2) Lo único que NO puedo hacer yo (porque es en tu dashboard de Supabase)
Esto lo tienes que hacer tú en Supabase:

### 2.1 Ejecutar el SQL
1) Abre tu proyecto en Supabase.
2) Ve a **SQL Editor** → **New query**.
3) Copia y pega TODO el archivo `supabase-schema.sql`.
4) Ejecuta (Run).

### 2.2 Crear el usuario admin
1) Ve a **Authentication → Users**.
2) Crea un usuario (email/password) que será el admin.
3) Recomendado: desactiva **email signups** para que nadie pueda registrarse.

---

## 3) Configurar `.env` (local)
En la raíz del proyecto (`página web zuzana`) asegúrate de tener:

- `VITE_SUPABASE_URL=...`
- `VITE_SUPABASE_ANON_KEY=...`
- `SUPABASE_ADMIN_EMAIL=el_email_que_creaste@...`
- `SUPABASE_ADMIN_PASSWORD=la_password_que_creaste`

Notas:
- `VITE_*` se usa para el frontend.
- `SUPABASE_ADMIN_*` solo lo usa el script de migración (local) para iniciar sesión y poder escribir con RLS.

---

## 4) Validar ANTES de migrar (recomendado)
### 4.1 Ver cuántos blogs va a migrar
Desde PowerShell en `página web zuzana`:

- `node .\migrate-blogs-to-supabase.js --dry-run`

Debe terminar con algo como:
- `Total: 42 blogs`

---

## 5) Ejecutar migración (la parte que “mueve todo”)
Con `.env` ya completo:

- `node .\migrate-blogs-to-supabase.js`

Qué esperar:
- Los duplicados se **saltan** por `(slug, language)`.
- Al final imprime resumen: exitosos / omitidos / errores.

---

## 6) Verificación rápida en la web
1) Levanta el proyecto: `npm run dev`
2) Abre: `http://localhost:3000/blog`
3) Revisa:
   - Deben seguir saliendo los hardcodeados.
   - Además deben aparecer los migrados desde Supabase.
4) Abre un artículo por slug migrado y confirma que carga.

---

## 7) Si algo falla: diagnóstico típico
- Error 401/permission: no corriste el SQL de RLS o no estás logueado como usuario Auth.
- Error “no existe tabla”: no ejecutaste `supabase-schema.sql`.
- Error “Faltan credenciales”: te faltan `SUPABASE_ADMIN_EMAIL/PASSWORD` en `.env`.

---

## 8) Nota sobre “usuario admin” viejo
Las credenciales tipo `admin / Zuzana2026!` eran del modo antiguo (local). Ahora el login es **email/password de Supabase Auth**.

---

Si me confirmas: “ya corrí el SQL” + “ya creé el usuario admin” + “ya puse .env”, yo puedo correr por ti:
- `node migrate-blogs-to-supabase.js` (migración real)
- y validar con una consulta de conteo desde el script.
