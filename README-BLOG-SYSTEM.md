# 🎯 LUXMANIA BLOG SYSTEM

Sistema automatizado para publicar blogs sin errores, duplicados ni problemas de estructura.

## 🚀 Inicio Rápido

### Método 1: Wizard Interactivo (RECOMENDADO)

```bash
python blog-wizard.py
```

El wizard te preguntará paso a paso:
1. **Número de artículo** (detectado automáticamente)
2. **Títulos** en ES y EN
3. **Extracts** y meta descriptions
4. **Metadata** (autor, fecha, categoría, tags)
5. **Imagen** (se comprime automáticamente)
6. **Artículos relacionados**

Al final, genera un archivo JSON template que rellenas con el contenido completo.

### Método 2: Desde JSON Directo

Si ya tienes el contenido en JSON:

```bash
python blog-inserter.py blog-22-nombre.json
```

## 📁 Estructura JSON

```json
{
  "articleNumber": 22,
  "slug": "nombre-del-articulo",
  "shortTitle": "Título Corto",
  "author": "Luis Virrueta",
  "readTime": "12 min",
  "category": "Branding Strategy",
  "tags": ["Tag1", "Tag2", "Tag3"],
  "gradient": "from-blue-600 via-purple-600 to-pink-600",
  "heroImage": "/blog-compressed/blog-22-nombre.webp",
  "relatedArticles": [
    "slug-articulo-1",
    "slug-articulo-2",
    "slug-articulo-3"
  ],
  "es": {
    "title": "Título en Español",
    "extract": "Extract corto para la tarjeta del blog",
    "metaDescription": "Meta description para SEO",
    "date": "15 Dic 2025",
    "sections": [
      {
        "type": "intro",
        "content": "Texto de introducción..."
      },
      {
        "type": "heading",
        "title": "Título de Sección"
      },
      {
        "type": "text",
        "content": "Párrafo de texto..."
      },
      {
        "type": "highlight",
        "content": "Quote destacado",
        "author": "Autor del quote"
      },
      {
        "type": "list",
        "items": [
          {
            "title": "Item 1",
            "description": "Descripción del item"
          }
        ]
      },
      {
        "type": "colorGrid",
        "colors": [
          {
            "name": "Color 1",
            "hex": "#3B82F6",
            "emotion": "Emoción",
            "brands": "Descripción"
          }
        ]
      },
      {
        "type": "cta",
        "title": "Título del CTA",
        "description": "Descripción",
        "buttonText": "Texto Botón",
        "buttonLink": "/contacto"
      },
      {
        "type": "conclusion",
        "content": "Conclusión final del artículo..."
      }
    ],
    "comments": [
      {
        "id": 1,
        "author": "Nombre Apellido",
        "avatar": "NA",
        "date": "15 Dic 2025",
        "content": "Comentario...",
        "language": "es"
      },
      {
        "id": 2,
        "author": "Luis Virrueta",
        "avatar": "LV",
        "date": "15 Dic 2025",
        "content": "Respuesta del autor...",
        "language": "es",
        "isAuthor": true
      }
    ]
  },
  "en": {
    "title": "Title in English",
    "extract": "Short extract for blog card",
    "metaDescription": "Meta description for SEO",
    "date": "Dec 15, 2025",
    "sections": [
      // Same structure as ES
    ],
    "comments": [
      // Same structure as ES but in English
    ]
  }
}
```

## 🎨 Tipos de Secciones Disponibles

### 1. **intro** - Introducción
```json
{
  "type": "intro",
  "content": "Texto de introducción que abre el artículo"
}
```

### 2. **heading** - Encabezado de sección
```json
{
  "type": "heading",
  "title": "Título de la Sección"
}
```

### 3. **text** - Párrafo de texto
```json
{
  "type": "text",
  "content": "Texto normal del artículo"
}
```

### 4. **highlight** - Quote destacado
```json
{
  "type": "highlight",
  "content": "Frase importante destacada",
  "author": "Autor o fuente"
}
```

### 5. **list** - Lista de items
```json
{
  "type": "list",
  "items": [
    {
      "title": "Título del Item",
      "description": "Descripción detallada"
    }
  ]
}
```

### 6. **colorGrid** - Grid de colores
```json
{
  "type": "colorGrid",
  "colors": [
    {
      "name": "Nombre del Color",
      "hex": "#3B82F6",
      "emotion": "Emoción asociada",
      "brands": "Descripción o marcas que lo usan"
    }
  ]
}
```

### 7. **statsGrid** - Grid de estadísticas
```json
{
  "type": "statsGrid",
  "stats": [
    {
      "metric": "90%",
      "label": "Descripción de la métrica",
      "source": "Fuente del dato"
    }
  ]
}
```

### 8. **cta** - Call to Action
```json
{
  "type": "cta",
  "title": "LUXMANIA: Título del CTA",
  "description": "Descripción de tu servicio",
  "buttonText": "Texto del Botón",
  "buttonLink": "/contacto"
}
```

### 9. **conclusion** - Conclusión final
```json
{
  "type": "conclusion",
  "content": "Texto de conclusión que cierra el artículo"
}
```

## 🖼️ Compresión de Imágenes

El sistema comprime automáticamente las imágenes:

1. Coloca tu imagen en `public/IMAGENES BLOG/`
2. El wizard la detecta y comprime a WebP (85% calidad)
3. Se guarda en `public/blog-compressed/`
4. Se reduce típicamente 70-80% el tamaño

## ✅ Validaciones Automáticas

El sistema verifica:

- ✅ Que no exista el slug (evita duplicados)
- ✅ Estructura correcta ES e EN
- ✅ Todos los campos requeridos presentes
- ✅ Sintaxis JavaScript válida
- ✅ Comillas escapadas correctamente
- ✅ Inserción en posiciones correctas

## 📝 Comentarios

Recomendaciones para comentarios:

- **12 comentarios totales** (6 ES + 6 EN)
- **Mezcla idiomas** para audiencia internacional
- **Incluye respuestas del autor** (isAuthor: true)
- **Avatares con iniciales** del nombre
- **Fechas consistentes** con el artículo

Ejemplo de mezcla:
```
1. Español - Usuario
2. Inglés - Usuario
3. Español - Usuario
4. Inglés - Usuario
5. Español - Usuario (pregunta)
6. Español - Luis Virrueta (respuesta)
7. Inglés - Usuario
8. Inglés - Usuario (pregunta)
9. Inglés - Luis Virrueta (respuesta)
10. Español - Usuario
11. Inglés - Usuario
12. Español - Luis Virrueta (respuesta final)
```

## 🔄 Workflow Recomendado

### Para el Humano (Zuzana):
1. Decide el tema del blog
2. Ejecuta `python blog-wizard.py`
3. Responde las preguntas del wizard
4. Recibe el archivo `blog-XX-template.json`
5. Rellena el contenido en español e inglés
6. Ejecuta `python blog-inserter.py blog-XX-template.json`
7. ¡Listo! Blog publicado sin errores

### Para la IA (Copilot):
1. Recibe el tema del blog
2. Genera el contenido completo (ES + EN)
3. Crea el archivo JSON con toda la estructura
4. Ejecuta el inserter
5. Verifica que no haya errores
6. Confirma URLs y funcionalidad

## 🛡️ Backup Automático

Cada vez que insertas un blog, se crea:
```
src/data/blogArticlesContent.js.backup
```

Si algo sale mal, puedes restaurar:
```bash
cp src/data/blogArticlesContent.js.backup src/data/blogArticlesContent.js
```

## 📊 Ejemplo Completo

Ver: `blog-21-trend-keyword-gap.json` (artículo ya publicado)

Este archivo muestra la estructura completa con:
- 16 min de lectura
- 9 secciones (intro, headings, text, highlights, lists, colorGrid, cta, conclusion)
- 12 comentarios mixtos ES/EN
- Extract presente
- Versión EN completa

## 🐛 Troubleshooting

### Error: "Slug ya existe"
- Cambia el slug a uno único
- Verifica que no haya duplicados en el archivo

### Error: "No se encontró punto de inserción"
- Verifica que `blogArticlesContent.js` tenga las secciones `es:` y `en:`
- Restaura desde backup si es necesario

### Imagen no se comprime
- Verifica que Sharp esté instalado: `npm install sharp`
- Verifica la ruta de la imagen
- Comprime manualmente con: `node compress-nombre.js`

## 💡 Tips

1. **Slugs descriptivos**: Usa slugs largos y SEO-friendly
2. **Extracts concisos**: 1-2 líneas máximo para la tarjeta
3. **Tags relevantes**: 4-6 tags por artículo
4. **Comentarios realistas**: Nombres variados, no todos genéricos
5. **Gradientes consistentes**: Usa paletas acordes a la categoría

## 🎯 Próximas Mejoras

- [ ] Validación de links internos
- [ ] Preview del blog antes de insertar
- [ ] Generación automática de OG images
- [ ] Integración con AI para generar contenido
- [ ] Dashboard para gestionar todos los blogs
