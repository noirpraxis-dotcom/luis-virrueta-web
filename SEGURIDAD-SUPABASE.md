# 🔐 ACCIÓN REQUERIDA: Cambiar Credenciales de Supabase

## ⚠️ IMPORTANTE

Durante la configuración compartiste credenciales en el chat. **Debes cambiarlas ahora** por seguridad.

---

## 1️⃣ Cambiar Contraseña de Admin

1. Ve a: `https://supabase.com/dashboard/project/fnfsozymwmqzjiwcrwib/auth/users`

2. Busca tu usuario: `noirpraxis@gmail.com`

3. Click en los 3 puntos (⋮) → **"Reset Password"**

4. Supabase te enviará un email a `noirpraxis@gmail.com`

5. Click en el link del email y elige una **contraseña nueva y segura**

6. **Actualiza `.env`:**
   ```env
   SUPABASE_ADMIN_PASSWORD=TU_NUEVA_CONTRASEÑA_AQUI
   ```

---

## 2️⃣ Rotar Secret Key

1. Ve a: `https://supabase.com/dashboard/project/fnfsozymwmqzjiwcrwib/settings/api`

2. En la sección **"Project API keys"**, busca **"service_role key (secret)"**

3. Click en el icono de **"Reset service_role key"**

4. Confirma la acción

5. **Copia la nueva secret key** (empieza con `eyJ...`)

6. **NO necesitas actualizar `.env`** porque el secret key NO se usa en tu proyecto actual
   - Solo se usa la **publishable key** (anon) que no cambió

---

## 3️⃣ Verificar `.env` Final

Tu `.env` debe tener solo esto (con tu nueva contraseña):

```env
VITE_SUPABASE_URL=https://fnfsozymwmqzjiwcrwib.supabase.co
VITE_SUPABASE_ANON_KEY=sb_publishable_0RaqljpBA-4emXBBMafKzw_FHDgJjl_

# Admin Supabase Auth (solo local; no compartir)
SUPABASE_ADMIN_EMAIL=noirpraxis@gmail.com
SUPABASE_ADMIN_PASSWORD=TU_NUEVA_CONTRASEÑA_AQUI
```

---

## ✅ Estado Actual de Seguridad

- ✅ **RLS habilitado** en tabla `blog_articles`
- ✅ **Políticas estrictas:**
  - Público: solo lectura de artículos publicados y no futuros
  - Admin autenticado: lectura total + escritura
- ✅ **Storage bucket `blog-images`:**
  - Público: solo lectura (SELECT)
  - Admin autenticado: escritura completa (INSERT/UPDATE/DELETE)
- ✅ **`.env` protegido** con `git update-index --skip-worktree`
- ⚠️ **PENDIENTE:** Cambiar contraseña + rotar secret key

---

## 📝 Notas

- La **publishable key (anon)** es segura para compartir - está en el código del frontend
- La **secret key** NUNCA debe estar en código del frontend - solo en backend/scripts
- Tu proyecto actual solo usa **Supabase Auth (email/password)** con RLS, no usa secret keys

---

**Fecha de creación:** 4 de Enero, 2026
