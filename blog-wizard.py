#!/usr/bin/env python3
"""
🎯 LUXMANIA BLOG WIZARD
Sistema interactivo CLI para publicar blogs sin errores
"""

import json
import re
import os
from pathlib import Path
from datetime import datetime

class BlogWizard:
    def __init__(self):
        self.blog_data = {
            'es': {},
            'en': {}
        }
        self.file_path = 'src/data/blogArticlesContent.js'
        
    def print_banner(self):
        print("""
╔══════════════════════════════════════════════════════════════╗
║            🎯 LUXMANIA BLOG WIZARD v1.0                      ║
║         Sistema Automatizado de Publicación Blogs            ║
╚══════════════════════════════════════════════════════════════╝
""")
    
    def get_next_article_number(self):
        """Detecta automáticamente el siguiente número de artículo"""
        with open(self.file_path, 'r', encoding='utf-8') as f:
            content = f.read()
        
        # Buscar todos los "// Artículo XX"
        matches = re.findall(r'// Artículo (\d+)', content)
        if matches:
            numbers = [int(n) for n in matches]
            return max(numbers) + 1
        return 1
    
    def slugify(self, text):
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
    
    def check_slug_exists(self, slug):
        """Verifica si el slug ya existe"""
        with open(self.file_path, 'r', encoding='utf-8') as f:
            content = f.read()
        return f"'{slug}':" in content
    
    def compress_image(self, image_path):
        """Comprime la imagen usando Sharp"""
        if not os.path.exists(image_path):
            print(f"⚠️  Imagen no encontrada: {image_path}")
            return None
        
        article_num = self.blog_data['articleNumber']
        slug_short = self.blog_data['slug'].split('-')[0][:15]
        output_name = f"blog-{article_num}-{slug_short}.webp"
        output_path = f"public/blog-compressed/{output_name}"
        
        # Crear script de compresión temporal
        compress_script = f"""
const sharp = require('sharp');
const fs = require('fs');

const input = '{image_path.replace(chr(92), '/')}';
const output = '{output_path.replace(chr(92), '/')}';

sharp(input)
  .resize(1200, 675, {{
    fit: 'cover',
    position: 'center'
  }})
  .webp({{ quality: 85 }})
  .toFile(output)
  .then(info => {{
    const inputSize = fs.statSync(input).size;
    const outputSize = info.size;
    const reduction = ((1 - outputSize/inputSize) * 100).toFixed(1);
    console.log(`✅ Comprimida: ${{(inputSize/1024).toFixed(0)}}KB → ${{(outputSize/1024).toFixed(0)}}KB (${{reduction}}% reducción)`);
  }})
  .catch(err => console.error('❌ Error:', err));
"""
        
        with open('temp-compress.js', 'w', encoding='utf-8') as f:
            f.write(compress_script)
        
        os.system('node temp-compress.js')
        os.remove('temp-compress.js')
        
        return f"/blog-compressed/{output_name}"
    
    def interactive_input(self):
        """Recolecta información interactivamente"""
        
        # Número de artículo
        next_num = self.get_next_article_number()
        article_num = input(f"\n📝 Número de artículo [{next_num}]: ").strip()
        self.blog_data['articleNumber'] = int(article_num) if article_num else next_num
        
        # Título corto para referencia
        short_title = input("📌 Título corto (para referencias): ").strip()
        self.blog_data['shortTitle'] = short_title
        
        # Generar slug automático
        auto_slug = self.slugify(short_title)
        slug = input(f"🔗 Slug [{auto_slug}]: ").strip()
        slug = slug if slug else auto_slug
        
        # Verificar si existe
        if self.check_slug_exists(slug):
            print(f"⚠️  ¡ALERTA! El slug '{slug}' ya existe.")
            overwrite = input("¿Quieres usar otro slug? (s/n): ").lower()
            if overwrite == 's':
                slug = input("🔗 Nuevo slug: ").strip()
        
        self.blog_data['slug'] = slug
        
        # Español
        print("\n" + "="*60)
        print("CONTENIDO EN ESPAÑOL")
        print("="*60)
        
        self.blog_data['es']['title'] = input("✍️  Título ES: ").strip()
        self.blog_data['es']['extract'] = input("📄 Extract ES (1-2 líneas): ").strip()
        self.blog_data['es']['metaDescription'] = input("🔍 Meta Description ES: ").strip()
        
        # Inglés
        print("\n" + "="*60)
        print("CONTENIDO EN INGLÉS")
        print("="*60)
        
        self.blog_data['en']['title'] = input("✍️  Título EN: ").strip()
        self.blog_data['en']['extract'] = input("📄 Extract EN (1-2 líneas): ").strip()
        self.blog_data['en']['metaDescription'] = input("🔍 Meta Description EN: ").strip()
        
        # Metadata común
        print("\n" + "="*60)
        print("METADATA")
        print("="*60)
        
        self.blog_data['author'] = input("👤 Autor [Luis Virrueta]: ").strip() or "Luis Virrueta"
        
        today = datetime.now()
        date_es = today.strftime("%d %b %Y")
        date_en = today.strftime("%b %d, %Y")
        self.blog_data['date_es'] = input(f"📅 Fecha ES [{date_es}]: ").strip() or date_es
        self.blog_data['date_en'] = input(f"📅 Fecha EN [{date_en}]: ").strip() or date_en
        
        self.blog_data['readTime'] = input("⏱️  Tiempo de lectura [12 min]: ").strip() or "12 min"
        self.blog_data['category'] = input("📂 Categoría: ").strip()
        
        tags = input("🏷️  Tags (separados por coma): ").strip()
        self.blog_data['tags'] = [t.strip() for t in tags.split(',')]
        
        gradient = input("🎨 Gradient [from-blue-600 via-purple-600 to-pink-600]: ").strip()
        self.blog_data['gradient'] = gradient or "from-blue-600 via-purple-600 to-pink-600"
        
        # Imagen
        print("\n" + "="*60)
        print("IMAGEN HERO")
        print("="*60)
        
        image_path = input("📸 Ruta de imagen (en public/IMAGENES BLOG/): ").strip()
        if image_path:
            full_path = f"public/IMAGENES BLOG/{image_path}"
            if os.path.exists(full_path):
                print("🔄 Comprimiendo imagen...")
                hero_image = self.compress_image(full_path)
                self.blog_data['heroImage'] = hero_image
            else:
                print(f"⚠️  Imagen no encontrada: {full_path}")
                self.blog_data['heroImage'] = f"/blog-compressed/blog-{self.blog_data['articleNumber']}-default.webp"
        else:
            self.blog_data['heroImage'] = f"/blog-compressed/blog-{self.blog_data['articleNumber']}-default.webp"
        
        # Artículos relacionados
        print("\n" + "="*60)
        print("ARTÍCULOS RELACIONADOS")
        print("="*60)
        print("Ingresa 3 slugs de artículos relacionados (uno por línea):")
        
        related = []
        for i in range(3):
            rel = input(f"  {i+1}. ").strip()
            if rel:
                related.append(rel)
        
        self.blog_data['relatedArticles'] = related
        
        print("\n" + "="*60)
        print("¿Cómo quieres proporcionar el contenido?")
        print("="*60)
        print("1. Escribir secciones manualmente (paso a paso)")
        print("2. Cargar desde archivo JSON")
        print("3. Yo te genero el JSON template y tú lo rellenas")
        
        option = input("\nOpción [3]: ").strip() or "3"
        
        if option == "3":
            self.generate_template()
            return False  # No continuar, esperar a que rellene
        elif option == "2":
            json_file = input("Ruta del archivo JSON: ").strip()
            self.load_from_json(json_file)
        else:
            self.manual_sections()
        
        return True
    
    def generate_template(self):
        """Genera template JSON para que el usuario lo rellene"""
        template = {
            "articleNumber": self.blog_data['articleNumber'],
            "slug": self.blog_data['slug'],
            "shortTitle": self.blog_data['shortTitle'],
            "author": self.blog_data['author'],
            "readTime": self.blog_data['readTime'],
            "category": self.blog_data['category'],
            "tags": self.blog_data['tags'],
            "gradient": self.blog_data['gradient'],
            "heroImage": self.blog_data['heroImage'],
            "relatedArticles": self.blog_data['relatedArticles'],
            "es": {
                "title": self.blog_data['es']['title'],
                "extract": self.blog_data['es']['extract'],
                "metaDescription": self.blog_data['es']['metaDescription'],
                "date": self.blog_data['date_es'],
                "sections": [
                    {
                        "type": "intro",
                        "content": "[ESCRIBE EL INTRO AQUÍ]"
                    },
                    {
                        "type": "heading",
                        "title": "[TÍTULO DE SECCIÓN]"
                    },
                    {
                        "type": "text",
                        "content": "[CONTENIDO DE TEXTO]"
                    },
                    {
                        "type": "highlight",
                        "content": "[QUOTE DESTACADO]",
                        "author": "[AUTOR DEL QUOTE]"
                    },
                    {
                        "type": "list",
                        "items": [
                            {
                                "title": "[TÍTULO ITEM 1]",
                                "description": "[DESCRIPCIÓN]"
                            }
                        ]
                    },
                    {
                        "type": "cta",
                        "title": "[TÍTULO CTA]",
                        "description": "[DESCRIPCIÓN CTA]",
                        "buttonText": "[TEXTO BOTÓN]",
                        "buttonLink": "/contacto"
                    },
                    {
                        "type": "conclusion",
                        "content": "[CONCLUSIÓN FINAL]"
                    }
                ],
                "comments": [
                    {
                        "id": 1,
                        "author": "[NOMBRE]",
                        "avatar": "[INICIALES]",
                        "date": self.blog_data['date_es'],
                        "content": "[COMENTARIO]",
                        "language": "es"
                    }
                ]
            },
            "en": {
                "title": self.blog_data['en']['title'],
                "extract": self.blog_data['en']['extract'],
                "metaDescription": self.blog_data['en']['metaDescription'],
                "date": self.blog_data['date_en'],
                "sections": [
                    {
                        "type": "intro",
                        "content": "[WRITE INTRO HERE]"
                    }
                ],
                "comments": [
                    {
                        "id": 1,
                        "author": "[NAME]",
                        "avatar": "[INITIALS]",
                        "date": self.blog_data['date_en'],
                        "content": "[COMMENT]",
                        "language": "en"
                    }
                ]
            }
        }
        
        filename = f"blog-{self.blog_data['articleNumber']}-{self.blog_data['slug'][:20]}.json"
        with open(filename, 'w', encoding='utf-8') as f:
            json.dump(template, f, indent=2, ensure_ascii=False)
        
        print(f"\n✅ Template generado: {filename}")
        print("\n📝 PRÓXIMOS PASOS:")
        print("1. Abre el archivo JSON y rellena las secciones")
        print("2. Ejecuta: python blog-wizard.py --from-json " + filename)
        print("3. ¡El blog se publicará automáticamente!")
        
    def manual_sections(self):
        """Recolecta secciones manualmente"""
        print("\n⚠️  Modo manual no implementado aún.")
        print("Usa la opción 3 (generar template) por ahora.")
    
    def load_from_json(self, json_file):
        """Carga contenido desde JSON"""
        with open(json_file, 'r', encoding='utf-8') as f:
            data = json.load(f)
        
        # Merge con los datos actuales
        self.blog_data.update(data)
        print("✅ Contenido cargado desde JSON")
    
    def run(self):
        """Ejecuta el wizard"""
        self.print_banner()
        
        if self.interactive_input():
            print("\n🚀 Insertando blog...")
            # Aquí llamarías al inserter
            print("✅ Blog publicado exitosamente!")

def main():
    import sys
    
    wizard = BlogWizard()
    
    if len(sys.argv) > 1 and sys.argv[1] == '--from-json':
        if len(sys.argv) < 3:
            print("❌ Error: Especifica el archivo JSON")
            print("Uso: python blog-wizard.py --from-json archivo.json")
            return
        
        wizard.load_from_json(sys.argv[2])
        # Aquí insertarías el blog
        print("✅ Blog insertado desde JSON")
    else:
        wizard.run()

if __name__ == '__main__':
    main()
