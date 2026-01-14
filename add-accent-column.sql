-- Agregar columna accent a la tabla blog_articles
-- Ejecuta este SQL en Supabase SQL Editor

ALTER TABLE blog_articles ADD COLUMN IF NOT EXISTS accent TEXT;

-- Actualizar artículos existentes con gradientes a su accent correspondiente
UPDATE blog_articles 
SET accent = 'from-purple-500 to-fuchsia-500'
WHERE accent IS NULL;
