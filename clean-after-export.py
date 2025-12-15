#!/usr/bin/env python3
"""
Elimina todo el código después de 'export default blogArticlesContent'
"""

def clean_after_export():
    file_path = r'src\data\blogArticlesContent.js'
    
    with open(file_path, 'r', encoding='utf-8') as f:
        content = f.read()
    
    # Buscar 'export default blogArticlesContent'
    export_line = 'export default blogArticlesContent'
    index = content.find(export_line)
    
    if index == -1:
        print("❌ No se encontró la línea de export")
        return False
    
    # Cortar justo después del export + newline
    clean_content = content[:index + len(export_line) + 1]
    
    # Guardar
    with open(file_path, 'w', encoding='utf-8') as f:
        f.write(clean_content)
    
    bytes_removed = len(content) - len(clean_content)
    print(f"✅ Archivo limpiado exitosamente")
    print(f"📝 Se eliminaron {bytes_removed} caracteres de basura después del export")
    return True

if __name__ == '__main__':
    clean_after_export()
