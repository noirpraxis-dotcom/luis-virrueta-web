#!/usr/bin/env python3
"""
Mueve el artículo 21 ES al lugar correcto dentro de es:
"""

def fix_article_21():
    file_path = r'src\data\blogArticlesContent.js'
    
    with open(file_path, 'r', encoding='utf-8') as f:
        lines = f.readlines()
    
    # Encontrar el artículo 21 ES que está fuera (línea ~7364)
    article_start = None
    article_end = None
    
    for i in range(len(lines)):
        if i > 7360 and "'trend-vs-keyword-gap-contenido-viral-no-construye-crecimiento':" in lines[i]:
            article_start = i
            print(f"📍 Artículo 21 ES encontrado en línea {i+1}")
            break
    
    if not article_start:
        print("❌ No se encontró el artículo 21 ES fuera del objeto")
        return False
    
    # Encontrar el final del artículo (buscar el cierre con relatedArticles y }\n})
    for i in range(article_start, len(lines)):
        if 'relatedArticles:' in lines[i]:
            # Buscar el cierre después de relatedArticles
            for j in range(i, min(i+10, len(lines))):
                if lines[j].strip() == '}':
                    article_end = j + 1  # Incluir la línea del cierre
                    print(f"📍 Artículo termina en línea {j+1}")
                    break
            break
    
    if not article_end:
        print("❌ No se encontró el final del artículo")
        return False
    
    # Extraer el artículo completo
    article_lines = lines[article_start:article_end]
    print(f"📦 Artículo extraído: {len(article_lines)} líneas")
    
    # Eliminar el artículo de su posición incorrecta
    del lines[article_start:article_end]
    print(f"✂️  Artículo eliminado de posición incorrecta")
    
    # Encontrar dónde insertar en es: (antes del cierre de es:, línea ~3449)
    es_close_line = None
    for i in range(3440, 3460):
        if i < len(lines) and lines[i].strip() == '},':
            # Verificar que la siguiente línea es vacía o el inicio de en:
            if i+1 < len(lines) and ('en:' in lines[i+1] or lines[i+1].strip() == ''):
                es_close_line = i
                print(f"📍 Cierre de es: encontrado en línea {i+1}")
                break
    
    if not es_close_line:
        print("❌ No se encontró el cierre de es:")
        return False
    
    # Insertar el artículo antes del cierre de es:
    # Agregar línea vacía antes
    lines.insert(es_close_line, '\n')
    # Insertar artículo
    for line in reversed(article_lines):
        lines.insert(es_close_line, line)
    
    print(f"✅ Artículo insertado antes del cierre de es: (línea {es_close_line+1})")
    
    # Guardar archivo
    with open(file_path, 'w', encoding='utf-8') as f:
        f.writelines(lines)
    
    print("✅ Archivo guardado correctamente")
    print(f"📊 Total de líneas: {len(lines)}")
    
    return True

if __name__ == '__main__':
    fix_article_21()
