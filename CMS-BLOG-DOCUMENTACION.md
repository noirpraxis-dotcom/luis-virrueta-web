# 📝 CMS de Blog - Sistema de Gestión de Contenido

## 🎯 Descripción General

Este sistema te permite crear y editar artículos de blog directamente desde tu página web, sin necesidad de tocar código. Funciona perfectamente en móvil y escritorio.

## ✨ Características Principales

### 1. **Modo Administrador**
- Login protegido con usuario y contraseña
- Botón flotante "+" para crear nuevos artículos
- Solo visible cuando estás autenticado
- Sesión guardada por 24 horas

### 2. **Editor Inteligente**
- **Pega contenido de GPT**: El editor detecta automáticamente:
  - Títulos (H1, H2, H3)
  - Párrafos normales
  - Listas con viñetas
  - Texto destacado (highlights)
- **Edición manual**: Selecciona cualquier bloque y cámbialo de tipo
- **Toolbar flotante**: Aparece al seleccionar texto

### 3. **Subida de Imágenes**
- Drag & drop o click para subir
- Compresión automática a WebP
- Optimización inteligente (máx 1920x1080)
- Reducción de tamaño automática

### 4. **100% Responsive**
- Funciona perfecto en móvil
- Touch-friendly
- Diseño adaptativo

## 🚀 Cómo Usar

### Paso 1: Configurar Supabase

1. **Crea un proyecto en Supabase** (si no lo tienes):
   - Ve a [https://supabase.com](https://supabase.com)
   - Crea una cuenta gratuita
   - Crea un nuevo proyecto

2. **Crea la tabla de artículos**:
   Ve al SQL Editor en Supabase y ejecuta:

```sql
-- Tabla para artículos del blog
CREATE TABLE blog_articles (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  subtitle TEXT,
  slug TEXT UNIQUE NOT NULL,
  excerpt TEXT NOT NULL,
  author TEXT DEFAULT 'Luis Virrueta',
  category TEXT DEFAULT 'philosophy',
  tags TEXT[] DEFAULT '{}',
  read_time TEXT DEFAULT '15 min',
  language TEXT DEFAULT 'es',
  image_url TEXT,
  content JSONB NOT NULL DEFAULT '[]',
  is_published BOOLEAN DEFAULT false,
  published_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Índices para mejorar búsquedas
CREATE INDEX idx_blog_articles_slug ON blog_articles(slug);
CREATE INDEX idx_blog_articles_published ON blog_articles(is_published, published_at DESC);
CREATE INDEX idx_blog_articles_language ON blog_articles(language);
CREATE INDEX idx_blog_articles_category ON blog_articles(category);

-- Habilitar Row Level Security (RLS)
ALTER TABLE blog_articles ENABLE ROW LEVEL SECURITY;

-- Política: Todos pueden leer artículos publicados
CREATE POLICY "Artículos publicados son públicos"
ON blog_articles FOR SELECT
USING (is_published = true);

-- Política: Solo admins autenticados pueden crear/editar
-- (Por ahora, permitimos todas las operaciones para el desarrollo)
CREATE POLICY "Permitir todas las operaciones"
ON blog_articles FOR ALL
USING (true)
WITH CHECK (true);
```

3. **Crea el Storage para imágenes**:
   - Ve a Storage en Supabase
   - Crea un bucket llamado `blog-images`
   - Hazlo público (Public bucket)

4. **Obtén tus credenciales**:
   - Ve a Settings > API
   - Copia tu `Project URL` y `anon public key`

5. **Configura las variables de entorno**:
   Crea un archivo `.env` en la raíz del proyecto:

```env
VITE_SUPABASE_URL=https://tu-proyecto.supabase.co
VITE_SUPABASE_ANON_KEY=tu-clave-publica-aqui
VITE_ADMIN_USERNAME=admin
VITE_ADMIN_PASSWORD=TuContraseñaSegura123!
```

⚠️ **IMPORTANTE**: Agrega `.env` a tu `.gitignore` para no subir las credenciales

### Paso 2: Acceder al Sistema

1. **Ir a la página de Blog**:
   ```
   https://tu-sitio.com/blog
   ```

2. **Iniciar sesión como admin**:
   - Verás un pequeño candado 🔒 en la esquina inferior derecha
   - Click en el candado
   - Ingresa usuario y contraseña
   - Usuario por defecto: `admin`
   - Contraseña: la que definiste en `.env`

3. **Una vez autenticado**:
   - Aparecerá un botón flotante "+" (morado/fucsia)
   - Aparecerá un botón de logout

### Paso 3: Crear un Artículo

#### Opción A: Pegar contenido de GPT

1. **Click en el botón "+"**
2. **Sube la imagen principal** (arrastra o click)
3. **Completa los metadatos**:
   - Título *
   - Subtítulo (opcional)
   - Extracto/Descripción *
   - Autor
   - Categoría
   - Tags (separados por comas)
   - Tiempo de lectura
   - Idioma

4. **Pega tu contenido de GPT** en el área de texto grande
5. El editor detectará automáticamente:
   ```
   Título Principal          → H1
   Subtítulo                 → H2
   Sección                   → H3
   - Lista con guión         → Lista
   **Texto entre asteriscos** → Highlight
   Texto normal              → Párrafo
   ```

6. **Click en "Publicar"** o "Guardar Borrador"

#### Opción B: Escribir manualmente

1. **Click en el botón "+"**
2. **Sube imagen y completa metadatos**
3. **Usa el botón "+ Agregar Bloque"** para crear bloques manualmente:
   - Párrafo
   - Título
   - Destacado
   - Lista

4. **Edita cada bloque**:
   - Click en el bloque para seleccionarlo
   - Aparece un toolbar con opciones:
     - ↑ Mover arriba
     - ↓ Mover abajo
     - 🔄 Cambiar tipo
     - ✨ Convertir a destacado
     - 🗑️ Eliminar

### Paso 4: Editar un Artículo

Por ahora los artículos se guardan en Supabase. Para editar:
1. Necesitarás implementar la carga desde Supabase (próxima actualización)
2. O editar directamente en la base de datos de Supabase

## 📱 Uso desde Móvil

1. Abre tu página en el navegador móvil
2. Inicia sesión con el botón del candado
3. Todo funciona igual que en escritorio
4. La subida de imágenes funciona desde la galería o cámara

## 🎨 Tipos de Bloques Disponibles

### 1. Título (H1/H2/H3)
```
Para artículos importantes, conceptos clave
Tamaño grande, negrita automática
```

### 2. Párrafo
```
Texto normal para el cuerpo del artículo
Admite líneas múltiples
Formato estándar
```

### 3. Destacado (Highlight)
```
Para citas, frases importantes o conclusiones
Fondo morado claro
Texto más grande
```

### 4. Lista
```
• Viñetas automáticas
• Para enumerar conceptos
• Formato limpio
```

## 🔧 Personalización

### Cambiar credenciales de admin

Edita el archivo `.env`:
```env
VITE_ADMIN_USERNAME=tu-usuario
VITE_ADMIN_PASSWORD=tu-contraseña-segura
```

### Agregar más tipos de bloques

Edita `RichTextEditor.jsx` y agrega:
```javascript
{ type: 'quote', icon: Quote, label: 'Cita' }
```

### Cambiar límites de compresión

Edita `imageCompression.js`:
```javascript
maxWidth: 1920,  // Cambiar ancho máximo
maxHeight: 1080, // Cambiar alto máximo
quality: 0.85    // Calidad (0-1)
```

## 🐛 Solución de Problemas

### "Error al guardar artículo"
- ✅ Verifica que Supabase esté configurado
- ✅ Revisa que las variables `.env` estén correctas
- ✅ Confirma que la tabla `blog_articles` existe

### "Error al subir imagen"
- ✅ Verifica que el bucket `blog-images` exista
- ✅ Confirma que sea público
- ✅ Revisa el tamaño (máx 10MB)

### "No aparece el botón +"
- ✅ Asegúrate de haber iniciado sesión
- ✅ Revisa la consola del navegador por errores
- ✅ Verifica que estés en la página `/blog`

### La imagen no se comprime
- ✅ Usa formatos JPG, PNG, WEBP o GIF
- ✅ Tamaño máximo: 10MB antes de comprimir
- ✅ Revisa la consola para mensajes de compresión

## 📊 Estructura de Datos

### Artículo en Supabase:
```javascript
{
  id: "uuid",
  title: "Título del artículo",
  subtitle: "Subtítulo opcional",
  slug: "titulo-del-articulo",
  excerpt: "Descripción breve...",
  author: "Luis Virrueta",
  category: "philosophy",
  tags: ["filosofía", "mente"],
  read_time: "15 min",
  language: "es",
  image_url: "https://...",
  content: [
    { id: "block-1", type: "heading", level: "h1", content: "Título" },
    { id: "block-2", type: "paragraph", content: "Texto..." },
    { id: "block-3", type: "highlight", content: "Destacado" }
  ],
  is_published: true,
  published_at: "2026-01-03T...",
  created_at: "2026-01-03T...",
  updated_at: "2026-01-03T..."
}
```

## 🔐 Seguridad

- **Login local**: Credenciales en variables de entorno
- **Sesión temporal**: 24 horas de duración
- **Supabase RLS**: Políticas de seguridad configurables
- **Imágenes públicas**: Las imágenes son públicas en el storage

## 🚀 Próximas Mejoras

- [ ] Lista de artículos en el panel admin
- [ ] Editar artículos existentes desde la UI
- [ ] Previsualización antes de publicar
- [ ] Más tipos de bloques (citas, código, videos)
- [ ] Búsqueda y filtros en el admin
- [ ] Analytics de artículos

## 💡 Tips y Trucos

### Workflow recomendado:
1. **Genera contenido con GPT** en formato estructurado
2. **Copia y pega** todo de una vez
3. **Revisa** que los títulos estén bien detectados
4. **Ajusta** bloques individuales si es necesario
5. **Sube la imagen** (se comprime automáticamente)
6. **Publica** o guarda como borrador

### Para mejores resultados con GPT:
Pídele que estructure el contenido así:
```
Título Principal

Subtítulo o introducción breve.

Sección 1

Primer párrafo de la sección...

**Punto importante destacado**

Otro párrafo...

Sección 2

Contenido de la segunda sección...
```

## 📞 Soporte

Si tienes problemas o preguntas:
1. Revisa esta documentación
2. Busca en la consola del navegador (F12)
3. Verifica los logs de Supabase
4. Contacta al desarrollador

---

**Desarrollado con ❤️ para Ainimation**
*Sistema CMS personalizado - Enero 2026*
