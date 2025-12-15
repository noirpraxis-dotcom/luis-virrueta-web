#!/usr/bin/env python3
"""
Limpia completamente la estructura corrupta del blogArticlesContent.js
Elimina todo el código después de los closing braces de es: y en:
"""

import re

def fix_complete_structure():
    file_path = r'src\data\blogArticlesContent.js'
    
    with open(file_path, 'r', encoding='utf-8') as f:
        content = f.read()
    
    # Buscar el final del objeto blogArticlesContent
    # Debe terminar con:
    #   ]
    # }
    # }
    # 
    # export default blogArticlesContent
    
    # Encontrar la última aparición de los related articles del artículo 21
    pattern = r"(  relatedArticles: \[\s+'tu-cerebro-no-busca-informacion-busca-sorpresa-minima-andy-clark',\s+'experimento-libet-no-decides-tus-decisiones-ya-estan-tomadas',\s+'neuroplasticidad-tu-cerebro-cambia-cada-vez-que-ves-una-marca'\s+\]\s+}\s+})"
    
    match = re.search(pattern, content)
    if match:
        # Cortar justo después del último related articles
        end_pos = match.end()
        clean_content = content[:end_pos]
        
        # Agregar el cierre correcto
        clean_content += "\n}\n\nexport default blogArticlesContent\n"
        
        # Guardar
        with open(file_path, 'w', encoding='utf-8') as f:
            f.write(clean_content)
        
        lines_removed = content[end_pos:].count('\n')
        print(f"✅ Estructura limpiada exitosamente")
        print(f"📝 Se eliminaron {lines_removed} líneas de código corrupto")
        return True
    else:
        print("❌ No se encontró el patrón esperado")
        return False

if __name__ == '__main__':
    fix_complete_structure()
