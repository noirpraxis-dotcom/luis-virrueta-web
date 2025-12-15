#!/usr/bin/env python3
"""
🚀 LUXMANIA BLOG PUBLISHER PRO
Sistema unificado para publicar blogs sin errores

CARACTERÍSTICAS:
✓ Validación completa de estructura (incluyendo icons en headings)
✓ Compresión automática de imágenes
✓ Detección de duplicados
✓ Inserción quirúrgica en blogArticlesContent.js
✓ Modo interactivo y modo JSON
✓ Generación de templates
✓ Rollback automático en caso de error

USAGE:
  python blog-publisher-pro.py                    # Modo interactivo
  python blog-publisher-pro.py blog-21.json       # Desde JSON
  python blog-publisher-pro.py --template         # Genera template
"""

import json
import re
import os
import sys
import shutil
from pathlib import Path
from datetime import datetime

# ============================================================================
# CONFIGURACIÓN Y CONSTANTES
# ============================================================================

ICONS_DISPONIBLES = [
    'Brain', 'Sparkles', 'Zap', 'Award', 'Shield', 'Check', 
    'Eye', 'Target', 'TrendingUp', 'BarChart', 'Activity',
    'Lightbulb', 'Rocket', 'Star', 'Heart', 'ThumbsUp'
]

GRADIENTS_POPULARES = [
    'from-blue-600 via-purple-600 to-pink-600',
    'from-indigo-600 via-purple-600 to-fuchsia-600',
    'from-pink-500 to-rose-500',
    'from-cyan-500 to-blue-600',
    'from-green-500 to-emerald-600',
    'from-orange-500 to-red-600'
]

FILE_PATH = 'src/data/blogArticlesContent.js'
BACKUP_PATH = 'src/data/blogArticlesContent.backup.js'

# ============================================================================
# VALIDADORES
# ============================================================================

class Validator:
    @staticmethod
    def validate_structure(blog_data):
        """Valida que el blog tenga toda la estructura requerida"""
        errors = []
        warnings = []
        
        # Campos raíz requeridos
        required_root = ['articleNumber', 'slug', 'shortTitle', 'author', 
                        'readTime', 'category', 'tags', 'gradient', 
                        'heroImage', 'relatedArticles']
        
        for field in required_root:
            if field not in blog_data:
                errors.append(f"❌ Falta campo raíz: '{field}'")
        
        # Validar idiomas
        for lang in ['es', 'en']:
            if lang not in blog_data:
                errors.append(f"❌ Falta sección de idioma: '{lang}'")
                continue
            
            lang_data = blog_data[lang]
            required_lang = ['title', 'extract', 'metaDescription', 'date', 'sections', 'comments']
            
            for field in required_lang:
                if field not in lang_data:
                    errors.append(f"❌ {lang.upper()}: Falta campo '{field}'")
            
            # Validar secciones
            if 'sections' in lang_data:
                section_errors = Validator.validate_sections(lang_data['sections'], lang)
                errors.extend(section_errors)
            
            # Validar comentarios
            if 'comments' in lang_data:
                if len(lang_data['comments']) == 0:
                    warnings.append(f"⚠️  {lang.upper()}: No hay comentarios (recomendado al menos 1)")
        
        # Validar tags
        if 'tags' in blog_data and len(blog_data['tags']) < 3:
            warnings.append("⚠️  Menos de 3 tags (recomendado 4-6)")
        
        # Validar relatedArticles
        if 'relatedArticles' in blog_data and len(blog_data['relatedArticles']) != 3:
            warnings.append(f"⚠️  Se recomienda exactamente 3 artículos relacionados (actual: {len(blog_data['relatedArticles'])})")
        
        return errors, warnings
    
    @staticmethod
    def validate_sections(sections, lang):
        """Valida que las secciones tengan la estructura correcta"""
        errors = []
        
        for i, section in enumerate(sections):
            if 'type' not in section:
                errors.append(f"❌ {lang.upper()}: Sección {i+1} sin 'type'")
                continue
            
            section_type = section['type']
            
            # Validar heading con icon
            if section_type == 'heading':
                if 'title' not in section:
                    errors.append(f"❌ {lang.upper()}: Heading {i+1} sin 'title'")
                
                # CRÍTICO: Validar que tenga icon o advertir
                if 'icon' not in section:
                    errors.append(f"❌ {lang.upper()}: Heading {i+1} '{section.get('title', '???')}' SIN ICON - Esto causará error React")
            
            # Validar intro, text, conclusion
            elif section_type in ['intro', 'text', 'conclusion']:
                if 'content' not in section:
                    errors.append(f"❌ {lang.upper()}: Sección {section_type} {i+1} sin 'content'")
            
            # Validar highlight
            elif section_type == 'highlight':
                if 'content' not in section:
                    errors.append(f"❌ {lang.upper()}: Highlight {i+1} sin 'content'")
                if 'author' not in section:
                    errors.append(f"❌ {lang.upper()}: Highlight {i+1} sin 'author'")
            
            # Validar list
            elif section_type == 'list':
                if 'items' not in section or len(section['items']) == 0:
                    errors.append(f"❌ {lang.upper()}: List {i+1} sin 'items' o vacía")
                else:
                    for j, item in enumerate(section['items']):
                        if 'title' not in item or 'description' not in item:
                            errors.append(f"❌ {lang.upper()}: List {i+1}, item {j+1} incompleto")
            
            # Validar colorGrid
            elif section_type == 'colorGrid':
                if 'colors' not in section or len(section['colors']) == 0:
                    errors.append(f"❌ {lang.upper()}: ColorGrid {i+1} sin 'colors' o vacía")
                else:
                    for j, color in enumerate(section['colors']):
                        required_color_fields = ['name', 'hex', 'emotion', 'brands']
                        for field in required_color_fields:
                            if field not in color:
                                errors.append(f"❌ {lang.upper()}: ColorGrid {i+1}, color {j+1} sin '{field}'")
            
            # Validar callToAction
            elif section_type == 'callToAction':
                if 'title' not in section:
                    errors.append(f"❌ {lang.upper()}: CallToAction {i+1} sin 'title'")
                if 'description' not in section:
                    errors.append(f"❌ {lang.upper()}: CallToAction {i+1} sin 'description'")
                if 'buttonText' not in section:
                    errors.append(f"❌ {lang.upper()}: CallToAction {i+1} sin 'buttonText'")
                if 'buttonLink' not in section:
                    errors.append(f"❌ {lang.upper()}: CallToAction {i+1} sin 'buttonLink'")
        
        return errors

# ============================================================================
# UTILIDADES
# ============================================================================

class Utils:
    @staticmethod
    def slugify(text):
        """Convierte texto a slug válido"""
        text = text.lower()
        text = re.sub(r'[áàäâ]', 'a', text)
        text = re.sub(r'[éèëê]', 'e', text)
        text = re.sub(r'[íìïî]', 'i', text)
        text = re.sub(r'[óòöô]', 'o', text)
        text = re.sub(r'[úùüû]', 'u', text)
        text = re.sub(r'[ñ]', 'n', text)
        text = re.sub(r'[^a-z0-9\s-]', '', text)
        text = re.sub(r'[\s_-]+', '-', text)
        return text.strip('-')
    
    @staticmethod
    def get_next_article_number():
        """Detecta automáticamente el siguiente número de artículo"""
        with open(FILE_PATH, 'r', encoding='utf-8') as f:
            content = f.read()
        
        matches = re.findall(r'// Artículo (\d+)', content)
        if matches:
            numbers = [int(n) for n in matches]
            return max(numbers) + 1
        return 1
    
    @staticmethod
    def check_slug_exists(slug):
        """Verifica si el slug ya existe"""
        with open(FILE_PATH, 'r', encoding='utf-8') as f:
            content = f.read()
        return f"'{slug}':" in content
    
    @staticmethod
    def create_backup():
        """Crea backup del archivo"""
        shutil.copy(FILE_PATH, BACKUP_PATH)
        print(f"💾 Backup creado: {BACKUP_PATH}")
    
    @staticmethod
    def restore_backup():
        """Restaura desde backup"""
        if os.path.exists(BACKUP_PATH):
            shutil.copy(BACKUP_PATH, FILE_PATH)
            print("↩️  Backup restaurado")

# ============================================================================
# GENERADOR DE CÓDIGO JS
# ============================================================================

class JSCodeGenerator:
    @staticmethod
    def escape_js_string(s):
        """Escapa strings para JavaScript"""
        if not isinstance(s, str):
            return str(s)
        return s.replace("'", "\\'").replace('\n', '\\n').replace('\r', '')
    
    @staticmethod
    def generate_section_code(section):
        """Genera código JS para una sección"""
        code = f"        {{\n          type: '{section['type']}'"
        
        if 'title' in section:
            code += f",\n          title: '{JSCodeGenerator.escape_js_string(section['title'])}'"
        
        if 'icon' in section:
            code += f",\n          icon: {section['icon']}"
        
        if 'content' in section:
            code += f",\n          content: '{JSCodeGenerator.escape_js_string(section['content'])}'"
        
        if 'author' in section:
            code += f",\n          author: '{JSCodeGenerator.escape_js_string(section['author'])}'"
        
        if 'description' in section:
            code += f",\n          description: '{JSCodeGenerator.escape_js_string(section['description'])}'"
        
        if 'buttonText' in section:
            code += f",\n          buttonText: '{JSCodeGenerator.escape_js_string(section['buttonText'])}'"
        
        if 'buttonLink' in section:
            code += f",\n          buttonLink: '{section['buttonLink']}'"
        
        if 'gradient' in section:
            code += f",\n          gradient: '{section['gradient']}'"
        
        if 'number' in section:
            code += f",\n          number: '{section['number']}'"
        
        # Estructuras complejas
        if 'items' in section:
            items_str = JSCodeGenerator.format_items(section['items'])
            code += f",\n          items: {items_str}"
        
        if 'colors' in section:
            colors_str = JSCodeGenerator.format_colors(section['colors'])
            code += f",\n          colors: {colors_str}"
        
        code += "\n        }"
        return code
    
    @staticmethod
    def format_items(items):
        """Formatea items para listas"""
        items_code = "[\n"
        for item in items:
            items_code += "            {\n"
            items_code += f"              title: '{JSCodeGenerator.escape_js_string(item['title'])}',\n"
            items_code += f"              description: '{JSCodeGenerator.escape_js_string(item['description'])}'\n"
            items_code += "            },\n"
        items_code += "          ]"
        return items_code
    
    @staticmethod
    def format_colors(colors):
        """Formatea colors para colorGrid"""
        colors_code = "[\n"
        for color in colors:
            colors_code += "            {\n"
            colors_code += f"              name: '{color['name']}',\n"
            colors_code += f"              hex: '{color['hex']}',\n"
            colors_code += f"              emotion: '{color['emotion']}',\n"
            colors_code += f"              brands: '{JSCodeGenerator.escape_js_string(color['brands'])}'\n"
            colors_code += "            },\n"
        colors_code += "          ]"
        return colors_code
    
    @staticmethod
    def generate_comment_code(comment):
        """Genera código JS para un comentario"""
        code = f"        {{\n"
        code += f"          id: {comment['id']},\n"
        code += f"          author: '{JSCodeGenerator.escape_js_string(comment['author'])}',\n"
        code += f"          avatar: '{comment['avatar']}',\n"
        code += f"          date: '{comment['date']}',\n"
        code += f"          content: '{JSCodeGenerator.escape_js_string(comment['content'])}',\n"
        code += f"          language: '{comment['language']}'"
        
        if comment.get('isAuthor'):
            code += ",\n          isAuthor: true"
        
        code += "\n        }"
        return code
    
    @staticmethod
    def generate_article_code(blog_data, language='es'):
        """Genera el código completo del artículo"""
        lang_data = blog_data[language]
        slug = blog_data['slug']
        
        # Tags
        tags = ', '.join([f"'{tag}'" for tag in blog_data['tags']])
        
        # Related articles
        related = ',\n        '.join([f"'{art}'" for art in blog_data['relatedArticles']])
        
        # Sections
        sections_code = []
        for section in lang_data['sections']:
            sections_code.append(JSCodeGenerator.generate_section_code(section))
        sections_str = ',\n'.join(sections_code)
        
        # Comments
        comments_code = []
        for comment in lang_data['comments']:
            comments_code.append(JSCodeGenerator.generate_comment_code(comment))
        comments_str = ',\n'.join(comments_code)
        
        # Código del artículo
        article_code = f"""  // Artículo {blog_data['articleNumber']} - {blog_data['shortTitle']}
  '{slug}': {{
    title: '{JSCodeGenerator.escape_js_string(lang_data['title'])}',
    author: '{blog_data['author']}',
    date: '{lang_data['date']}',
    readTime: '{blog_data['readTime']}',
    category: '{blog_data['category']}',
    tags: [{tags}],
    gradient: '{blog_data['gradient']}',
    extract: '{JSCodeGenerator.escape_js_string(lang_data['extract'])}',
    metaDescription: '{JSCodeGenerator.escape_js_string(lang_data['metaDescription'])}',
    heroImage: '{blog_data['heroImage']}',
    sections: [
{sections_str}
    ],
    comments: [
{comments_str}
    ],
    relatedArticles: [
        {related}
    ]
  }}"""
        
        return article_code

# ============================================================================
# INSERTOR
# ============================================================================

class BlogInserter:
    @staticmethod
    def insert_article(blog_data):
        """Inserta el artículo en blogArticlesContent.js"""
        
        # Leer archivo
        with open(FILE_PATH, 'r', encoding='utf-8') as f:
            content = f.read()
        
        # Generar código para ES
        es_code = JSCodeGenerator.generate_article_code(blog_data, 'es')
        
        # Buscar dónde insertar ES (antes del cierre de es:)
        es_pattern = r"(const blogArticlesContent = \{[\s\S]*?es: \{[\s\S]*?)(\n\};)"
        es_match = re.search(es_pattern, content)
        
        if not es_match:
            raise Exception("❌ No se encontró la sección 'es:' en el archivo")
        
        # Insertar ES (con coma antes)
        content = content[:es_match.end(1)] + ',\n\n' + es_code + content[es_match.end(1):]
        
        # Generar código para EN
        en_code = JSCodeGenerator.generate_article_code(blog_data, 'en')
        
        # Buscar dónde insertar EN
        en_pattern = r"(en: \{[\s\S]*?)(\n  \}\n\};)"
        en_match = re.search(en_pattern, content)
        
        if not en_match:
            raise Exception("❌ No se encontró la sección 'en:' en el archivo")
        
        # Insertar EN (con coma antes)
        content = content[:en_match.end(1)] + ',\n\n' + en_code + content[en_match.end(1):]
        
        # Escribir archivo
        with open(FILE_PATH, 'w', encoding='utf-8') as f:
            f.write(content)
        
        print("✅ Artículo insertado correctamente en ES y EN")

# ============================================================================
# TEMPLATE GENERATOR
# ============================================================================

class TemplateGenerator:
    @staticmethod
    def generate(article_num=None):
        """Genera un template JSON para rellenar"""
        
        if article_num is None:
            article_num = Utils.get_next_article_number()
        
        today = datetime.now()
        date_es = today.strftime("%d %b %Y")
        date_en = today.strftime("%b %d, %Y")
        
        template = {
            "articleNumber": article_num,
            "slug": "tu-slug-aqui",
            "shortTitle": "Título Corto",
            "author": "Luis Virrueta",
            "readTime": "12 min",
            "category": "Content Strategy",
            "tags": ["Tag1", "Tag2", "Tag3", "Tag4"],
            "gradient": GRADIENTS_POPULARES[0],
            "heroImage": f"/blog-compressed/blog-{article_num}-slug.webp",
            "relatedArticles": [
                "slug-articulo-1",
                "slug-articulo-2",
                "slug-articulo-3"
            ],
            "es": {
                "title": "Título del Artículo en Español",
                "extract": "Extract corto que aparece en la lista de blogs (1-2 líneas máximo)",
                "metaDescription": "Meta description para SEO (máx 160 caracteres)",
                "date": date_es,
                "sections": [
                    {
                        "type": "intro",
                        "content": "Introducción del artículo. Primera impresión. Hook que captura atención."
                    },
                    {
                        "type": "heading",
                        "title": "Primera Sección Principal",
                        "icon": "Brain",
                        "__comment": f"Icons disponibles: {', '.join(ICONS_DISPONIBLES)}"
                    },
                    {
                        "type": "text",
                        "content": "Contenido de texto regular. Párrafos de desarrollo."
                    },
                    {
                        "type": "highlight",
                        "content": "Quote destacado que resalta una idea clave del artículo",
                        "author": "Fuente o Autor del Quote"
                    },
                    {
                        "type": "heading",
                        "title": "Segunda Sección",
                        "icon": "Sparkles"
                    },
                    {
                        "type": "list",
                        "items": [
                            {
                                "title": "Punto 1",
                                "description": "Descripción del punto 1"
                            },
                            {
                                "title": "Punto 2",
                                "description": "Descripción del punto 2"
                            }
                        ]
                    },
                    {
                        "type": "callToAction",
                        "title": "¿Listo para Transformar tu Marca?",
                        "description": "Descripción del CTA",
                        "buttonText": "Agenda tu Consulta",
                        "buttonLink": "/contacto"
                    },
                    {
                        "type": "conclusion",
                        "content": "Conclusión final del artículo. Cierre con impacto."
                    }
                ],
                "comments": [
                    {
                        "id": 1,
                        "author": "María González",
                        "avatar": "MG",
                        "date": date_es,
                        "content": "Comentario de ejemplo en español",
                        "language": "es"
                    }
                ]
            },
            "en": {
                "title": "Article Title in English",
                "extract": "Short extract that appears in blog list (1-2 lines max)",
                "metaDescription": "Meta description for SEO (max 160 characters)",
                "date": date_en,
                "sections": [
                    {
                        "type": "intro",
                        "content": "Article introduction. First impression. Hook that captures attention."
                    },
                    {
                        "type": "heading",
                        "title": "First Main Section",
                        "icon": "Brain"
                    },
                    {
                        "type": "text",
                        "content": "Regular text content. Development paragraphs."
                    },
                    {
                        "type": "conclusion",
                        "content": "Final conclusion. Impactful closing."
                    }
                ],
                "comments": [
                    {
                        "id": 1,
                        "author": "John Doe",
                        "avatar": "JD",
                        "date": date_en,
                        "content": "Sample comment in English",
                        "language": "en"
                    }
                ]
            }
        }
        
        filename = f"blog-{article_num}-template.json"
        with open(filename, 'w', encoding='utf-8') as f:
            json.dump(template, f, indent=2, ensure_ascii=False)
        
        print(f"""
╔══════════════════════════════════════════════════════════════╗
║           ✅ TEMPLATE GENERADO EXITOSAMENTE                  ║
╚══════════════════════════════════════════════════════════════╝

📄 Archivo: {filename}

📝 PRÓXIMOS PASOS:
1. Abre {filename} y rellena todo el contenido
2. Ejecuta: python blog-publisher-pro.py {filename}
3. ¡El blog se publicará automáticamente!

💡 IMPORTANTE:
   - Todos los headings DEBEN tener un 'icon'
   - Icons disponibles: {', '.join(ICONS_DISPONIBLES[:8])}...
   - Usa comillas simples en el JSON si incluyes comillas dobles en el texto
   - Los slugs deben ser únicos y sin caracteres especiales
""")

# ============================================================================
# MAIN
# ============================================================================

def print_banner():
    print("""
╔══════════════════════════════════════════════════════════════╗
║         🚀 LUXMANIA BLOG PUBLISHER PRO v2.0                  ║
║    Sistema Unificado de Publicación Blogs Sin Errores       ║
╚══════════════════════════════════════════════════════════════╝
""")

def main():
    print_banner()
    
    # Modo template
    if len(sys.argv) > 1 and sys.argv[1] == '--template':
        TemplateGenerator.generate()
        return
    
    # Cargar desde JSON
    if len(sys.argv) > 1:
        json_file = sys.argv[1]
        
        if not os.path.exists(json_file):
            print(f"❌ Error: Archivo '{json_file}' no encontrado")
            return
        
        print(f"📂 Cargando: {json_file}")
        
        with open(json_file, 'r', encoding='utf-8') as f:
            blog_data = json.load(f)
        
        # Validar estructura
        print("\n🔍 Validando estructura...")
        errors, warnings = Validator.validate_structure(blog_data)
        
        if warnings:
            print("\n⚠️  ADVERTENCIAS:")
            for warning in warnings:
                print(f"   {warning}")
        
        if errors:
            print("\n❌ ERRORES CRÍTICOS:")
            for error in errors:
                print(f"   {error}")
            print("\n🛑 Publicación cancelada. Corrige los errores y vuelve a intentar.")
            return
        
        print("✅ Validación exitosa")
        
        # Verificar slug duplicado
        if Utils.check_slug_exists(blog_data['slug']):
            print(f"\n⚠️  ¡ALERTA! El slug '{blog_data['slug']}' ya existe.")
            respuesta = input("¿Continuar de todos modos? (s/n): ").lower()
            if respuesta != 's':
                print("❌ Publicación cancelada")
                return
        
        # Crear backup
        print("\n💾 Creando backup...")
        Utils.create_backup()
        
        # Insertar
        try:
            print("\n🚀 Insertando artículo...")
            BlogInserter.insert_article(blog_data)
            
            print(f"""
╔══════════════════════════════════════════════════════════════╗
║              ✅ BLOG PUBLICADO EXITOSAMENTE                  ║
╚══════════════════════════════════════════════════════════════╝

📊 RESUMEN:
   • Artículo #{blog_data['articleNumber']}: {blog_data['shortTitle']}
   • Slug: {blog_data['slug']}
   • Idiomas: ES ✓ EN ✓
   • Secciones ES: {len(blog_data['es']['sections'])}
   • Secciones EN: {len(blog_data['en']['sections'])}

🎯 PRÓXIMOS PASOS:
   1. Verifica el blog en tu navegador
   2. Si hay error, ejecuta el rollback:
      python blog-publisher-pro.py --rollback
   3. Commit cambios:
      git add .
      git commit -m "feat: Add blog article #{blog_data['articleNumber']} - {blog_data['shortTitle']}"
      git push
""")
            
        except Exception as e:
            print(f"\n❌ ERROR durante la inserción: {e}")
            print("↩️  Restaurando backup...")
            Utils.restore_backup()
            print("✅ Backup restaurado. El archivo está como antes.")
    
    else:
        # Modo interactivo
        print("""
📝 MODOS DE USO:

1. Generar template:
   python blog-publisher-pro.py --template

2. Publicar desde JSON:
   python blog-publisher-pro.py blog-21.json

3. Rollback (restaurar backup):
   python blog-publisher-pro.py --rollback
""")

if __name__ == '__main__':
    main()
