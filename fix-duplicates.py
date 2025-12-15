#!/usr/bin/env python3
"""
Script para eliminar artículos duplicados en blogArticlesContent.js
"""

# Leer el archivo
with open('src/data/blogArticlesContent.js', 'r', encoding='utf-8') as f:
    lines = f.readlines()

print(f"📄 Total de líneas: {len(lines)}")

# Buscar las líneas donde aparece el slug
slug_pattern = "'trend-vs-keyword-gap-contenido-viral-no-construye-crecimiento':"
matches = []
for i, line in enumerate(lines, 1):
    if slug_pattern in line:
        matches.append(i)
        print(f"✓ Encontrado en línea {i}: {line.strip()[:80]}")

print(f"\n📊 Total de coincidencias: {len(matches)}")

# El duplicado #1 está entre líneas 7297-7749
# El correcto #2 está en línea 7750
# El duplicado #3 está en línea 7851

# Estrategia: Eliminar líneas 7297-7749 (duplicado #1)
if len(matches) >= 2:
    start_line = matches[0] - 1  # 7296 (0-indexed)
    end_line = matches[1] - 1    # 7749 (0-indexed)
    
    print(f"\n🗑️  Eliminando duplicado #1: líneas {start_line+1} a {end_line}")
    
    # Crear lista nueva sin las líneas duplicadas
    new_lines = lines[:start_line] + lines[end_line:]
    
    print(f"📝 Nuevas líneas totales: {len(new_lines)} (eliminadas: {len(lines) - len(new_lines)})")
    
    # Guardar el archivo
    with open('src/data/blogArticlesContent.js', 'w', encoding='utf-8') as f:
        f.writelines(new_lines)
    
    print("\n✅ ¡Archivo arreglado!")
else:
    print("\n❌ No se encontraron suficientes duplicados")
