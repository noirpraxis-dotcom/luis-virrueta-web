-- ============================================
-- SCHEMA PARA SISTEMA CMS DE BLOG
-- Ejecuta este SQL en Supabase SQL Editor
-- ============================================

-- 1. CREAR TABLA DE ARTÍCULOS
CREATE TABLE IF NOT EXISTS blog_articles (
  -- Identificadores
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  slug TEXT UNIQUE NOT NULL,
  
  -- Contenido principal
  title TEXT NOT NULL,
  subtitle TEXT,
  excerpt TEXT NOT NULL,
  content JSONB NOT NULL DEFAULT '[]',
  
  -- Metadatos
  author TEXT DEFAULT 'Luis Virrueta',
  category TEXT DEFAULT 'philosophy',
  tags TEXT[] DEFAULT '{}',
  read_time TEXT DEFAULT '15 min',
  language TEXT DEFAULT 'es' CHECK (language IN ('es', 'en')),
  
  -- Imagen
  image_url TEXT,
  
  -- Estado de publicación
  is_published BOOLEAN DEFAULT false,
  published_at TIMESTAMPTZ,
  
  -- Timestamps
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  
  -- Metadata adicional
  views INTEGER DEFAULT 0,
  rating DECIMAL(2,1) DEFAULT 0.0
);

-- 2. CREAR ÍNDICES PARA MEJORAR PERFORMANCE
CREATE INDEX IF NOT EXISTS idx_blog_articles_slug ON blog_articles(slug);
CREATE INDEX IF NOT EXISTS idx_blog_articles_published ON blog_articles(is_published, published_at DESC);
CREATE INDEX IF NOT EXISTS idx_blog_articles_language ON blog_articles(language);
CREATE INDEX IF NOT EXISTS idx_blog_articles_category ON blog_articles(category);
CREATE INDEX IF NOT EXISTS idx_blog_articles_tags ON blog_articles USING GIN(tags);
CREATE INDEX IF NOT EXISTS idx_blog_articles_created ON blog_articles(created_at DESC);

-- 3. FUNCIÓN PARA ACTUALIZAR updated_at AUTOMÁTICAMENTE
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- 4. TRIGGER PARA ACTUALIZAR updated_at
DROP TRIGGER IF EXISTS update_blog_articles_updated_at ON blog_articles;
CREATE TRIGGER update_blog_articles_updated_at
    BEFORE UPDATE ON blog_articles
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- 5. FUNCIÓN PARA GENERAR SLUG AUTOMÁTICAMENTE
CREATE OR REPLACE FUNCTION generate_slug(title TEXT)
RETURNS TEXT AS $$
BEGIN
    RETURN LOWER(
        REGEXP_REPLACE(
            REGEXP_REPLACE(
                TRANSLATE(
                    title,
                    'áéíóúñÁÉÍÓÚÑàèìòùÀÈÌÒÙäëïöüÄËÏÖÜ',
                    'aeiounAEIOUNaeiouAEIOUaeiouAEIOU'
                ),
                '[^a-z0-9\s-]', '', 'g'
            ),
            '\s+', '-', 'g'
        )
    );
END;
$$ LANGUAGE plpgsql;

-- 6. TRIGGER PARA GENERAR SLUG SI NO EXISTE
CREATE OR REPLACE FUNCTION ensure_slug()
RETURNS TRIGGER AS $$
BEGIN
    IF NEW.slug IS NULL OR NEW.slug = '' THEN
        NEW.slug = generate_slug(NEW.title);
    END IF;
    
    -- Si el slug ya existe, agregar timestamp
    IF EXISTS (SELECT 1 FROM blog_articles WHERE slug = NEW.slug AND id != NEW.id) THEN
        NEW.slug = NEW.slug || '-' || EXTRACT(EPOCH FROM NOW())::TEXT;
    END IF;
    
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS ensure_slug_trigger ON blog_articles;
CREATE TRIGGER ensure_slug_trigger
    BEFORE INSERT OR UPDATE ON blog_articles
    FOR EACH ROW
    EXECUTE FUNCTION ensure_slug();

-- 7. HABILITAR ROW LEVEL SECURITY (RLS)
ALTER TABLE blog_articles ENABLE ROW LEVEL SECURITY;

-- 8. POLÍTICAS DE SEGURIDAD

-- Política: Cualquiera puede leer artículos publicados
DROP POLICY IF EXISTS "Artículos publicados son públicos" ON blog_articles;
CREATE POLICY "Artículos publicados son públicos"
ON blog_articles FOR SELECT
USING (is_published = true);

-- Política: Permitir todas las operaciones para desarrollo
-- ⚠️ IMPORTANTE: En producción, reemplaza esto con autenticación real
DROP POLICY IF EXISTS "Permitir todas las operaciones" ON blog_articles;
CREATE POLICY "Permitir todas las operaciones"
ON blog_articles FOR ALL
USING (true)
WITH CHECK (true);

-- 9. CREAR STORAGE BUCKET PARA IMÁGENES
-- Nota: Esto debe hacerse desde la UI de Supabase Storage
-- Ve a Storage > Crear nuevo bucket > Nombre: "blog-images" > Público: Sí

-- 10. FUNCIÓN PARA BUSCAR ARTÍCULOS
CREATE OR REPLACE FUNCTION search_blog_articles(
    search_query TEXT,
    search_language TEXT DEFAULT NULL,
    only_published BOOLEAN DEFAULT true
)
RETURNS TABLE (
    id UUID,
    title TEXT,
    subtitle TEXT,
    excerpt TEXT,
    author TEXT,
    category TEXT,
    tags TEXT[],
    slug TEXT,
    image_url TEXT,
    published_at TIMESTAMPTZ,
    rating DECIMAL
) AS $$
BEGIN
    RETURN QUERY
    SELECT
        a.id,
        a.title,
        a.subtitle,
        a.excerpt,
        a.author,
        a.category,
        a.tags,
        a.slug,
        a.image_url,
        a.published_at,
        a.rating
    FROM blog_articles a
    WHERE
        (NOT only_published OR a.is_published = true)
        AND (search_language IS NULL OR a.language = search_language)
        AND (
            a.title ILIKE '%' || search_query || '%'
            OR a.subtitle ILIKE '%' || search_query || '%'
            OR a.excerpt ILIKE '%' || search_query || '%'
            OR search_query = ANY(a.tags)
        )
    ORDER BY a.published_at DESC;
END;
$$ LANGUAGE plpgsql;

-- 11. FUNCIÓN PARA OBTENER ARTÍCULOS RELACIONADOS
CREATE OR REPLACE FUNCTION get_related_articles(
    article_id UUID,
    max_results INTEGER DEFAULT 3
)
RETURNS TABLE (
    id UUID,
    title TEXT,
    excerpt TEXT,
    slug TEXT,
    image_url TEXT,
    category TEXT
) AS $$
BEGIN
    RETURN QUERY
    WITH current_article AS (
        SELECT category, tags
        FROM blog_articles
        WHERE blog_articles.id = article_id
    )
    SELECT
        a.id,
        a.title,
        a.excerpt,
        a.slug,
        a.image_url,
        a.category
    FROM blog_articles a, current_article ca
    WHERE
        a.id != article_id
        AND a.is_published = true
        AND (
            a.category = ca.category
            OR a.tags && ca.tags  -- Tags en común
        )
    ORDER BY
        CASE WHEN a.category = ca.category THEN 2 ELSE 0 END +
        CASE WHEN a.tags && ca.tags THEN 1 ELSE 0 END DESC,
        a.published_at DESC
    LIMIT max_results;
END;
$$ LANGUAGE plpgsql;

-- 12. VISTA PARA ESTADÍSTICAS DE BLOG
CREATE OR REPLACE VIEW blog_statistics AS
SELECT
    COUNT(*) as total_articles,
    COUNT(*) FILTER (WHERE is_published = true) as published_articles,
    COUNT(*) FILTER (WHERE is_published = false) as draft_articles,
    COUNT(*) FILTER (WHERE language = 'es') as spanish_articles,
    COUNT(*) FILTER (WHERE language = 'en') as english_articles,
    AVG(views) as avg_views,
    SUM(views) as total_views,
    AVG(rating) as avg_rating
FROM blog_articles;

-- 13. INSERTAR CATEGORÍAS VÁLIDAS (opcional)
-- Puedes crear una tabla separada para categorías si lo prefieres
CREATE TABLE IF NOT EXISTS blog_categories (
    id TEXT PRIMARY KEY,
    name_es TEXT NOT NULL,
    name_en TEXT NOT NULL,
    description TEXT,
    icon TEXT,
    color TEXT
);

INSERT INTO blog_categories (id, name_es, name_en, icon, color) VALUES
    ('philosophy', 'Filosofía', 'Philosophy', 'Eye', 'purple'),
    ('psychology', 'Psicología', 'Psychology', 'Brain', 'blue'),
    ('psychoanalysis', 'Psicoanálisis', 'Psychoanalysis', 'Sparkles', 'fuchsia'),
    ('spirituality', 'Espiritualidad', 'Spirituality', 'Zap', 'indigo'),
    ('consciousness', 'Consciencia', 'Consciousness', 'TrendingUp', 'cyan'),
    ('ethics', 'Ética', 'Ethics', 'Shield', 'green')
ON CONFLICT (id) DO NOTHING;

-- ============================================
-- VERIFICACIÓN
-- ============================================

-- Verificar que todo se creó correctamente
SELECT
    'Tabla blog_articles' as objeto,
    CASE WHEN EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'blog_articles') 
        THEN '✅ Creada' 
        ELSE '❌ No existe' 
    END as estado
UNION ALL
SELECT
    'Storage bucket blog-images' as objeto,
    '⚠️ Verificar manualmente en Storage' as estado
UNION ALL
SELECT
    'RLS habilitado' as objeto,
    CASE WHEN EXISTS (
        SELECT 1 FROM pg_tables 
        WHERE tablename = 'blog_articles' 
        AND rowsecurity = true
    ) 
        THEN '✅ Habilitado' 
        ELSE '❌ No habilitado' 
    END as estado;

-- ============================================
-- DATOS DE PRUEBA (OPCIONAL)
-- ============================================

-- Insertar un artículo de ejemplo
INSERT INTO blog_articles (
    title,
    subtitle,
    excerpt,
    content,
    author,
    category,
    tags,
    language,
    is_published,
    published_at
) VALUES (
    'Artículo de Prueba',
    'Este es un artículo de ejemplo para probar el CMS',
    'Un artículo de prueba para verificar que el sistema funciona correctamente.',
    '[
        {"id": "block-1", "type": "heading", "level": "h1", "content": "Bienvenido al CMS"},
        {"id": "block-2", "type": "paragraph", "content": "Este es un artículo de prueba para verificar que todo funciona correctamente."},
        {"id": "block-3", "type": "highlight", "content": "El sistema está listo para usar!"}
    ]'::jsonb,
    'Luis Virrueta',
    'philosophy',
    ARRAY['test', 'ejemplo', 'cms'],
    'es',
    true,
    NOW()
) ON CONFLICT (slug) DO NOTHING;

-- ============================================
-- NOTAS IMPORTANTES
-- ============================================

/*
1. Este schema está listo para producción pero con políticas permisivas
2. En producción, deberías:
   - Implementar autenticación real con Supabase Auth
   - Restringir políticas RLS a usuarios autenticados
   - Agregar validaciones adicionales
   
3. El bucket de Storage "blog-images" debe crearse manualmente:
   - Ve a Storage en Supabase
   - Click en "New bucket"
   - Nombre: "blog-images"
   - Public: Yes
   
4. Para usar el CMS, asegúrate de:
   - Configurar las variables de entorno VITE_SUPABASE_URL y VITE_SUPABASE_ANON_KEY
   - Tener las credenciales de admin en VITE_ADMIN_USERNAME y VITE_ADMIN_PASSWORD
*/
