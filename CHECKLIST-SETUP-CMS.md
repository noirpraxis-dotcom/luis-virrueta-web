# ✅ Checklist de Configuración del CMS

## 📋 Antes de Empezar

- [ ] Tengo cuenta en Supabase (https://supabase.com)
- [ ] Tengo el proyecto de React ejecutándose localmente
- [ ] Tengo Node.js instalado

## 🗄️ Paso 1: Configurar Supabase (15 min)

### Crear Proyecto
- [ ] Ir a https://supabase.com
- [ ] Click en "New Project"
- [ ] Nombre: `zuzana-blog`
- [ ] Database Password: (guárdala)
- [ ] Region: más cercana a ti
- [ ] Click "Create new project"
- [ ] Esperar ~2 minutos a que se cree

### Ejecutar SQL
- [ ] Ir a "SQL Editor" en el menú lateral
- [ ] Click en "+ New query"
- [ ] Abrir archivo `supabase-schema.sql`
- [ ] Copiar **TODO** el contenido
- [ ] Pegar en Supabase SQL Editor
- [ ] Click "Run" o Ctrl+Enter
- [ ] Ver mensaje de éxito ✅

### Verificar Tabla
- [ ] Ir a "Table Editor"
- [ ] Ver tabla `blog_articles` en la lista
- [ ] Click en la tabla
- [ ] Debe tener estas columnas:
  - [ ] id
  - [ ] title
  - [ ] subtitle
  - [ ] slug
  - [ ] excerpt
  - [ ] content
  - [ ] author
  - [ ] category
  - [ ] tags
  - [ ] image_url
  - [ ] is_published
  - [ ] created_at
  - [ ] updated_at

### Crear Storage para Imágenes
- [ ] Ir a "Storage" en el menú lateral
- [ ] Click "+ New bucket"
- [ ] Name: `blog-images`
- [ ] Public bucket: ✅ **ACTIVAR**
- [ ] Click "Create bucket"
- [ ] Verificar que aparece en la lista

### Obtener Credenciales
- [ ] Ir a "Settings" (⚙️ icono)
- [ ] Click en "API"
- [ ] En "Project URL": **Copiar**
  ```
  Ejemplo: https://abcdefgh.supabase.co
  ```
- [ ] En "Project API keys" > "anon public": **Copiar**
  ```
  Ejemplo: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
  ```

## 🔑 Paso 2: Configurar Variables de Entorno (2 min)

- [ ] Ir a la carpeta raíz del proyecto
- [ ] Crear archivo `.env` (si no existe)
- [ ] Pegar esto (reemplazando con tus valores):

```env
VITE_SUPABASE_URL=https://tu-proyecto-aqui.supabase.co
VITE_SUPABASE_ANON_KEY=tu-clave-publica-aqui
VITE_ADMIN_USERNAME=admin
VITE_ADMIN_PASSWORD=TuContraseñaSegura123!
```

- [ ] Guardar archivo `.env`
- [ ] Verificar que `.env` esté en `.gitignore`

### Verificar .gitignore
- [ ] Abrir archivo `.gitignore`
- [ ] Verificar que contenga:
  ```
  .env
  .env.local
  .env.*.local
  ```
- [ ] Si no está, agregarlo
- [ ] Guardar

## 🚀 Paso 3: Instalar y Probar (5 min)

### Instalar Dependencias
```bash
npm install
```

- [ ] Ejecutar comando
- [ ] Esperar a que termine
- [ ] No debe haber errores

### Iniciar en Desarrollo
```bash
npm run dev
```

- [ ] Ejecutar comando
- [ ] Debe abrir navegador automáticamente
- [ ] O abrir manualmente: http://localhost:5173

### Probar Login
- [ ] Ir a la página `/blog`
- [ ] Buscar botón 🔒 en esquina inferior derecha
- [ ] Click en el botón
- [ ] Debe abrir modal de login
- [ ] Ingresar:
  - Usuario: `admin`
  - Contraseña: la que pusiste en `.env`
- [ ] Click "Iniciar Sesión"
- [ ] Debe cerrar modal
- [ ] Debe aparecer botón "+" morado

### Probar Editor
- [ ] Click en botón "+" morado
- [ ] Debe abrir editor completo
- [ ] Verificar que se vea bien

### Probar Subida de Imagen
- [ ] Click en área de imagen
- [ ] Seleccionar una imagen
- [ ] Debe verse preview
- [ ] En consola debe aparecer info de compresión
  ```
  📸 Compresión: original: X MB, compressed: Y MB, reduction: Z%
  ```

### Probar Pegado de Contenido
- [ ] Copiar este texto:
  ```
  Mi Primer Artículo

  Este es el contenido de prueba.

  Primera Sección

  Aquí va el primer párrafo de contenido.

  **Este es un punto importante**

  Y aquí continúa más contenido.

  - Punto uno
  - Punto dos
  - Punto tres
  ```
- [ ] Pegar en el área de texto del editor
- [ ] Debe detectar automáticamente:
  - "Mi Primer Artículo" → Título (H1)
  - "Primera Sección" → Subtítulo (H2)
  - Párrafos normales
  - "Este es un punto importante" → Highlight
  - Lista con viñetas

### Probar Guardado
- [ ] Completar todos los campos obligatorios (*):
  - Título
  - Extracto
- [ ] Click "Guardar Borrador"
- [ ] Debe mostrar mensaje "✅ Artículo guardado"
- [ ] Ir a Supabase > Table Editor > blog_articles
- [ ] Debe aparecer el artículo nuevo

### Probar Publicación
- [ ] Click en botón "+" nuevamente
- [ ] Crear otro artículo de prueba
- [ ] Completar campos
- [ ] Click "Publicar"
- [ ] Debe mostrar "✅ Artículo publicado"
- [ ] Verificar en Supabase que `is_published = true`

## ✅ Verificación Final

### Checklist de Funcionalidad
- [ ] Login funciona
- [ ] Botón "+" aparece después de login
- [ ] Editor se abre
- [ ] Subida de imágenes funciona
- [ ] Compresión de imágenes funciona
- [ ] Detección automática funciona al pegar
- [ ] Bloques se pueden editar
- [ ] Bloques se pueden mover
- [ ] Bloques se pueden eliminar
- [ ] Guardar borrador funciona
- [ ] Publicar funciona
- [ ] Artículos aparecen en Supabase
- [ ] Logout funciona

### En Supabase
- [ ] Tabla `blog_articles` existe
- [ ] Storage bucket `blog-images` existe
- [ ] Bucket es público
- [ ] Artículos de prueba guardados

### En Código
- [ ] Archivo `.env` creado
- [ ] `.env` en `.gitignore`
- [ ] No hay errores en consola
- [ ] Sistema responde rápido

## 🎉 ¡Listo!

Si todos los checkboxes están marcados, el sistema está **100% funcional**.

## 🐛 Problemas Comunes

### "Cannot read properties of undefined"
```bash
# Solución:
1. Verificar que .env esté en la raíz
2. Reiniciar servidor (Ctrl+C y npm run dev)
3. Verificar valores en .env
```

### "relation 'blog_articles' does not exist"
```bash
# Solución:
1. Ir a Supabase SQL Editor
2. Re-ejecutar supabase-schema.sql
3. Verificar que no haya errores
```

### "Error uploading image"
```bash
# Solución:
1. Verificar bucket 'blog-images' existe
2. Verificar que sea público
3. Revisar políticas de Storage en Supabase
```

### Botón "+" no aparece
```bash
# Solución:
1. Hacer logout y login nuevamente
2. Verificar localStorage en DevTools
3. Buscar 'admin_session'
4. Verificar que credenciales sean correctas
```

## 📞 ¿Necesitas Ayuda?

Si algo no funciona:
1. Revisa este checklist completo
2. Abre la consola del navegador (F12)
3. Busca mensajes de error en rojo
4. Verifica la pestaña "Network" para errores de API
5. Revisa los logs de Supabase

## 📚 Documentación Adicional

- `README-CMS.md` - Resumen ejecutivo
- `CMS-BLOG-DOCUMENTACION.md` - Documentación completa
- `supabase-schema.sql` - Schema de base de datos
- `.env.example` - Ejemplo de configuración

---

**¡Todo listo para crear contenido!** 🚀
