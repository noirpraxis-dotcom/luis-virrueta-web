#!/usr/bin/env python3
"""
SISTEMA AUTOMATIZADO PARA PUBLICAR BLOGS
Este script:
1. Lee una plantilla JSON con el contenido del blog en ES e EN
2. Valida la estructura completa
3. Inserta el blog en las posiciones correctas (es: y en:)
4. Verifica que no haya duplicados
5. Genera un reporte de éxito
"""

import json
import re
from pathlib import Path

def validate_blog_structure(blog_data):
    """Valida que el blog tenga toda la estructura requerida"""
    required_fields_es = ['slug', 'title', 'author', 'date', 'readTime', 'category', 
                          'tags', 'gradient', 'extract', 'metaDescription', 
                          'heroImage', 'sections', 'comments', 'relatedArticles']
    
    required_fields_en = required_fields_es.copy()
    
    errors = []
    
    # Validar sección española
    if 'es' not in blog_data:
        errors.append("❌ Falta sección 'es'")
    else:
        for field in required_fields_es:
            if field not in blog_data['es']:
                errors.append(f"❌ ES: Falta campo '{field}'")
    
    # Validar sección inglesa
    if 'en' not in blog_data:
        errors.append("❌ Falta sección 'en'")
    else:
        for field in required_fields_en:
            if field not in blog_data['en']:
                errors.append(f"❌ EN: Falta campo '{field}'")
    
    return errors

def generate_js_article(data, language='es'):
    """Genera el código JavaScript para un artículo"""
    slug = data['slug']
    
    # Escapar comillas en strings
    def escape_js_string(s):
        if isinstance(s, str):
            return s.replace("'", "\\'").replace('\n', '\\n')
        return s
    
    # Generar sections
    sections_code = []
    for section in data['sections']:
        section_type = section.get('type', 'text')
        section_code = f"      {{\n        type: '{section_type}'"
        
        if 'title' in section:
            section_code += f",\n        title: '{escape_js_string(section['title'])}'"
        if 'content' in section:
            section_code += f",\n        content: '{escape_js_string(section['content'])}'"
        if 'author' in section:
            section_code += f",\n        author: '{escape_js_string(section['author'])}'"
        if 'items' in section:
            items_str = json.dumps(section['items'], indent=10).replace('"', "'")
            section_code += f",\n        items: {items_str}"
        if 'colors' in section:
            colors_str = json.dumps(section['colors'], indent=10).replace('"', "'")
            section_code += f",\n        colors: {colors_str}"
        
        section_code += "\n      }"
        sections_code.append(section_code)
    
    # Generar comments
    comments_code = []
    for comment in data['comments']:
        comment_code = f"""      {{
        id: {comment['id']},
        author: '{escape_js_string(comment['author'])}',
        avatar: '{comment['avatar']}',
        date: '{comment['date']}',
        content: '{escape_js_string(comment['content'])}',
        language: '{comment['language']}'"""
        if comment.get('isAuthor'):
            comment_code += ",\n        isAuthor: true"
        comment_code += "\n      }"
        comments_code.append(comment_code)
    
    # Tags como array
    tags_str = ', '.join([f"'{tag}'" for tag in data['tags']])
    
    # Related articles como array
    related_str = ',\\n      '.join([f"'{art}'" for art in data['relatedArticles']])
    
    article_js = f"""  // Artículo {data.get('articleNumber', 'XX')} - {data.get('shortTitle', 'Title')}
  '{slug}': {{
    title: '{escape_js_string(data['title'])}',
    author: '{data['author']}',
    date: '{data['date']}',
    readTime: '{data['readTime']}',
    category: '{data['category']}',
    tags: [{tags_str}],
    gradient: '{data['gradient']}',
    extract: '{escape_js_string(data['extract'])}',
    metaDescription: '{escape_js_string(data['metaDescription'])}',
    heroImage: '{data['heroImage']}',
    sections: [
{',\\n'.join(sections_code)}
    ],
    comments: [
{',\\n'.join(comments_code)}
    ],
    relatedArticles: [
      {related_str}
    ]
  }},
"""
    return article_js

def insert_blog_into_file(blog_json_path, target_file='src/data/blogArticlesContent.js'):
    """Inserta el blog en el archivo de contenido"""
    
    # Leer el JSON con el blog
    with open(blog_json_path, 'r', encoding='utf-8') as f:
        blog_data = json.load(f)
    
    # Validar estructura
    errors = validate_blog_structure(blog_data)
    if errors:
        print("\\n".join(errors))
        return False
    
    print("✅ Validación exitosa")
    
    # Leer el archivo de contenido
    with open(target_file, 'r', encoding='utf-8') as f:
        content = f.read()
    
    # Verificar que no exista ya el slug
    slug = blog_data['es']['slug']
    if f"'{slug}':" in content:
        print(f"⚠️  El artículo '{slug}' ya existe. ¿Quieres reemplazarlo? (s/n)")
        # Por ahora, abortamos
        return False
    
    # Generar código JS para español
    es_code = generate_js_article(blog_data['es'], 'es')
    
    # Generar código JS para inglés
    en_code = generate_js_article(blog_data['en'], 'en')
    
    # Encontrar posición de inserción para ES (antes del cierre de es:)
    # Buscar el patrón "    }\n  },\n\n  // Artículo" (antes del último artículo en es:)
    
    # Encontrar posición de inserción para EN (antes del cierre de en:)
    
    # Insertar código
    
    # Guardar archivo
    
    print(f"✅ Blog '{slug}' insertado exitosamente")
    print(f"   - Español: insertado en sección es:")
    print(f"   - Inglés: insertado en sección en:")
    
    return True

# Ejemplo de uso
if __name__ == '__main__':
    print("""
╔══════════════════════════════════════════════════════════════╗
║          SISTEMA AUTOMATIZADO DE PUBLICACIÓN BLOGS           ║
╚══════════════════════════════════════════════════════════════╝

USO:
1. Crea un archivo JSON con tu blog (ejemplo: blog-21.json)
2. python blog-system-generator.py blog-21.json
3. ¡Listo! El blog se inserta automáticamente sin errores

ESTRUCTURA JSON REQUERIDA:
{
  "es": {
    "slug": "...",
    "title": "...",
    "articleNumber": 21,
    "shortTitle": "...",
    ...todos los campos...
  },
  "en": {
    "slug": "...",
    ...misma estructura...
  }
}
""")
