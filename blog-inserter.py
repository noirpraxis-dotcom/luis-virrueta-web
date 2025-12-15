#!/usr/bin/env python3
"""
📦 BLOG INSERTER
Motor que inserta blogs en blogArticlesContent.js de forma quirúrgica
"""

import json
import re
from pathlib import Path

class BlogInserter:
    def __init__(self, file_path='src/data/blogArticlesContent.js'):
        self.file_path = file_path
        
    def escape_js_string(self, s):
        """Escapa strings para JavaScript"""
        if not isinstance(s, str):
            return str(s)
        return s.replace("'", "\\'").replace('\n', '\\n').replace('\r', '')
    
    def generate_section_code(self, section):
        """Genera código JS para una sección"""
        code = f"        {{\n          type: '{section['type']}'"
        
        if 'title' in section:
            code += f",\n          title: '{self.escape_js_string(section['title'])}'"
        if 'content' in section:
            code += f",\n          content: '{self.escape_js_string(section['content'])}'"
        if 'author' in section:
            code += f",\n          author: '{self.escape_js_string(section['author'])}'"
        if 'description' in section:
            code += f",\n          description: '{self.escape_js_string(section['description'])}'"
        if 'buttonText' in section:
            code += f",\n          buttonText: '{self.escape_js_string(section['buttonText'])}'"
        if 'buttonLink' in section:
            code += f",\n          buttonLink: '{section['buttonLink']}'"
        
        # Estructuras complejas
        if 'items' in section:
            items_str = self.format_items(section['items'])
            code += f",\n          items: {items_str}"
        
        if 'colors' in section:
            colors_str = self.format_colors(section['colors'])
            code += f",\n          colors: {colors_str}"
        
        code += "\n        }"
        return code
    
    def format_items(self, items):
        """Formatea items para listas"""
        items_code = "[\n"
        for item in items:
            items_code += "            {\n"
            items_code += f"              title: '{self.escape_js_string(item['title'])}',\n"
            items_code += f"              description: '{self.escape_js_string(item['description'])}'\n"
            items_code += "            },\n"
        items_code += "          ]"
        return items_code
    
    def format_colors(self, colors):
        """Formatea colors para colorGrid"""
        colors_code = "[\n"
        for color in colors:
            colors_code += "            {\n"
            colors_code += f"              name: '{color['name']}',\n"
            colors_code += f"              hex: '{color['hex']}',\n"
            colors_code += f"              emotion: '{color['emotion']}',\n"
            colors_code += f"              brands: '{self.escape_js_string(color['brands'])}'\n"
            colors_code += "            },\n"
        colors_code += "          ]"
        return colors_code
    
    def generate_comment_code(self, comment):
        """Genera código JS para un comentario"""
        code = f"        {{\n"
        code += f"          id: {comment['id']},\n"
        code += f"          author: '{self.escape_js_string(comment['author'])}',\n"
        code += f"          avatar: '{comment['avatar']}',\n"
        code += f"          date: '{comment['date']}',\n"
        code += f"          content: '{self.escape_js_string(comment['content'])}',\n"
        code += f"          language: '{comment['language']}'"
        
        if comment.get('isAuthor'):
            code += ",\n          isAuthor: true"
        
        code += "\n        }"
        return code
    
    def generate_article_code(self, blog_data, language='es'):
        """Genera el código completo del artículo"""
        lang_data = blog_data[language]
        
        # Tags
        tags = ', '.join([f"'{tag}'" for tag in blog_data['tags']])
        
        # Related articles
        related = ',\n        '.join([f"'{art}'" for art in blog_data['relatedArticles']])
        
        # Sections
        sections = []
        for section in lang_data['sections']:
            sections.append(self.generate_section_code(section))
        sections_code = ',\n'.join(sections)
        
        # Comments
        comments = []
        for comment in lang_data['comments']:
            comments.append(self.generate_comment_code(comment))
        comments_code = ',\n'.join(comments)
        
        # Artículo completo
        article = f"""
    // Artículo {blog_data['articleNumber']} - {blog_data['shortTitle']}
    '{blog_data['slug']}': {{
      title: '{self.escape_js_string(lang_data['title'])}',
      author: '{blog_data['author']}',
      date: '{lang_data['date']}',
      readTime: '{blog_data['readTime']}',
      category: '{blog_data['category']}',
      tags: [{tags}],
      gradient: '{blog_data['gradient']}',
      extract: '{self.escape_js_string(lang_data['extract'])}',
      metaDescription: '{self.escape_js_string(lang_data['metaDescription'])}',
      heroImage: '{blog_data['heroImage']}',
      sections: [
{sections_code}
      ],
      comments: [
{comments_code}
      ],
      relatedArticles: [
        {related}
      ]
    }},
"""
        return article
    
    def find_insertion_point(self, content, language='es'):
        """Encuentra dónde insertar el artículo"""
        if language == 'es':
            # Buscar el último artículo en es: antes del cierre
            # Patrón: "    }\n  },\n\n  // Artículo" o final de es:
            pattern = r"(\n    }\n  },)\n\n  (/\* Artículo|\n  en: \{)"
            match = re.search(pattern, content)
            if match:
                return match.start(1) + len(match.group(1))
        else:
            # Buscar el final de en: antes del cierre
            pattern = r"(\n        ]\n      }\n    }\n  },)\n\n}"
            match = re.search(pattern, content)
            if match:
                return match.start(1) + len(match.group(1))
        
        return None
    
    def insert_blog(self, blog_json_path):
        """Inserta el blog en el archivo"""
        
        # Cargar blog data
        with open(blog_json_path, 'r', encoding='utf-8') as f:
            blog_data = json.load(f)
        
        print(f"📝 Insertando blog: {blog_data['slug']}")
        
        # Leer archivo actual
        with open(self.file_path, 'r', encoding='utf-8') as f:
            content = f.read()
        
        # Verificar si ya existe
        if f"'{blog_data['slug']}':" in content:
            print(f"⚠️  El artículo ya existe. Abortando...")
            return False
        
        # Generar código para ES
        print("  ✓ Generando versión español...")
        es_code = self.generate_article_code(blog_data, 'es')
        
        # Generar código para EN
        print("  ✓ Generando versión inglés...")
        en_code = self.generate_article_code(blog_data, 'en')
        
        # Encontrar puntos de inserción
        print("  ✓ Encontrando puntos de inserción...")
        
        # Insertar ES (más simple: buscar "  }," que cierra es: y agregar antes)
        # Buscar líneas con estructura específica
        lines = content.split('\n')
        es_insert_line = None
        en_insert_line = None
        
        # Buscar cierre de es: (línea que tiene solo "  },")
        for i in range(len(lines)-1, 0, -1):
            if lines[i].strip() == '},' and i > 3450 and es_insert_line is None:
                # Verificar si es el cierre de es: (siguiente línea debe ser inicio de nuevo objeto)
                if i + 2 < len(lines) and '// Artículo' in lines[i+2]:
                    es_insert_line = i
                    break
        
        # Si no encontramos, buscar de otra forma
        if es_insert_line is None:
            for i in range(len(lines)):
                if lines[i].strip() == 'en: {':
                    es_insert_line = i - 2  # Dos líneas antes del inicio de en:
                    break
        
        if es_insert_line:
            # Insertar artículo ES
            lines.insert(es_insert_line + 1, '\n' + es_code.rstrip())
            print(f"  ✓ Español insertado en línea {es_insert_line + 1}")
        else:
            print("  ❌ No se encontró punto de inserción para ES")
            return False
        
        # Buscar cierre de en:
        for i in range(len(lines)-1, 0, -1):
            if lines[i].strip() == '},':
                # Verificar si después viene el cierre final
                if i + 2 < len(lines) and lines[i+2].strip() == '}':
                    en_insert_line = i
                    break
        
        if en_insert_line:
            # Insertar artículo EN
            lines.insert(en_insert_line + 1, '\n' + en_code.rstrip())
            print(f"  ✓ Inglés insertado en línea {en_insert_line + 1}")
        else:
            print("  ❌ No se encontró punto de inserción para EN")
            return False
        
        # Guardar archivo
        new_content = '\n'.join(lines)
        
        # Hacer backup
        backup_path = self.file_path + '.backup'
        with open(backup_path, 'w', encoding='utf-8') as f:
            f.write(content)
        print(f"  ✓ Backup creado: {backup_path}")
        
        # Guardar nuevo archivo
        with open(self.file_path, 'w', encoding='utf-8') as f:
            f.write(new_content)
        
        print("\n✅ Blog insertado exitosamente!")
        print(f"📊 Español: {len(blog_data['es']['sections'])} secciones, {len(blog_data['es']['comments'])} comentarios")
        print(f"📊 Inglés: {len(blog_data['en']['sections'])} secciones, {len(blog_data['en']['comments'])} comentarios")
        print(f"🔗 URL: /blog/{blog_data['slug']}")
        
        return True

def main():
    import sys
    
    if len(sys.argv) < 2:
        print("Uso: python blog-inserter.py <archivo.json>")
        return
    
    inserter = BlogInserter()
    inserter.insert_blog(sys.argv[1])

if __name__ == '__main__':
    main()
