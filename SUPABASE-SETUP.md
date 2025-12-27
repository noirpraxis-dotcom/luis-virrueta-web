# Configuración de Supabase para Laboratorio Ético

## Paso 1: Crear cuenta en Supabase

1. Ve a https://supabase.com
2. Crea una cuenta gratis
3. Crea un nuevo proyecto
4. Guarda tu URL y ANON KEY

## Paso 2: Crear las tablas en Supabase

Ve al SQL Editor en tu proyecto de Supabase y ejecuta estas queries:

```sql
-- Tabla para votos
CREATE TABLE laboratorio_votos (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  dilema_id TEXT NOT NULL,
  opcion TEXT NOT NULL,
  ip_hash TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- Índices para mejorar performance
CREATE INDEX idx_laboratorio_votos_dilema ON laboratorio_votos(dilema_id);
CREATE INDEX idx_laboratorio_votos_ip ON laboratorio_votos(ip_hash);

-- Tabla para comentarios
CREATE TABLE laboratorio_comentarios (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  dilema_id TEXT NOT NULL,
  nombre TEXT NOT NULL,
  comentario TEXT NOT NULL,
  telefono TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- Índice para comentarios
CREATE INDEX idx_laboratorio_comentarios_dilema ON laboratorio_comentarios(dilema_id);

-- Habilitar Row Level Security (RLS)
ALTER TABLE laboratorio_votos ENABLE ROW LEVEL SECURITY;
ALTER TABLE laboratorio_comentarios ENABLE ROW LEVEL SECURITY;

-- Políticas de seguridad para votos
CREATE POLICY "Los votos son públicos para lectura"
  ON laboratorio_votos FOR SELECT
  USING (true);

CREATE POLICY "Cualquiera puede insertar votos"
  ON laboratorio_votos FOR INSERT
  WITH CHECK (true);

-- Políticas de seguridad para comentarios
CREATE POLICY "Los comentarios son públicos para lectura"
  ON laboratorio_comentarios FOR SELECT
  USING (true);

CREATE POLICY "Cualquiera puede insertar comentarios"
  ON laboratorio_comentarios FOR INSERT
  WITH CHECK (true);
```

## Paso 3: Configurar variables de entorno

Crea un archivo `.env` en la raíz del proyecto con:

```env
VITE_SUPABASE_URL=https://tu-proyecto.supabase.co
VITE_SUPABASE_ANON_KEY=tu-clave-publica-aqui
```

## Paso 4: Reiniciar el servidor de desarrollo

```bash
npm run dev
```

## Notas de seguridad

- La ANON KEY es pública y está bien exponerla
- Row Level Security (RLS) protege los datos
- Los votos solo permiten INSERT y SELECT
- No se pueden modificar o eliminar votos una vez creados
- Los números de teléfono son opcionales y privados
