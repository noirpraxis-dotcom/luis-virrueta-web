-- Agregar columnas icon y related_slugs a blog_articles
ALTER TABLE blog_articles ADD COLUMN IF NOT EXISTS icon TEXT DEFAULT 'crown';
ALTER TABLE blog_articles ADD COLUMN IF NOT EXISTS related_slugs TEXT[] DEFAULT '{}';

-- Comentarios para documentación
COMMENT ON COLUMN blog_articles.icon IS 'Ícono para las secciones del artículo (crown, brain, moon, etc)';
COMMENT ON COLUMN blog_articles.related_slugs IS 'Array de slugs de artículos relacionados seleccionados manualmente';
