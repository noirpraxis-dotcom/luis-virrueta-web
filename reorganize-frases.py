#!/usr/bin/env python3
"""
Script para reorganizar las 150 frases del sistema "Frase del Día"
evitando que aparezcan autores consecutivos.
"""

import re
import json

# Leer el archivo
with open('src/pages/FraseDelDiaPage.jsx', 'r', encoding='utf-8') as f:
    content = f.read()

# Extraer el array PHRASES
match = re.search(r'const PHRASES = \[(.*?)\n\]\n\nconst pickPhraseByDateKey', content, re.DOTALL)
if not match:
    print("❌ No se pudo encontrar el array PHRASES")
    exit(1)

phrases_str = match.group(1)

# Parsear las frases (regex más robusto)
phrases = []
pattern = r'\{[^}]*id:\s*[\'"](\d+)[\'"].*?quote:\s*[\'"]([^\'"]*?)[\'"],\s*author:\s*[\'"]([^\'"]+)[\'"]'

for m in re.finditer(pattern, phrases_str, re.DOTALL):
    # Extraer el bloque completo de la frase
    start = m.start()
    # Buscar el cierre del objeto
    depth = 0
    i = start
    while i < len(phrases_str):
        if phrases_str[i] == '{':
            depth += 1
        elif phrases_str[i] == '}':
            depth -= 1
            if depth == 0:
                break
        i += 1
    
    if depth == 0:
        phrase_block = phrases_str[start:i+1]
        phrases.append({
            'id': m.group(1),
            'author': m.group(3),
            'block': phrase_block
        })

print(f"✓ Extraídas {len(phrases)} frases")

# Contar frases por autor
author_count = {}
for p in phrases:
    author_count[p['author']] = author_count.get(p['author'], 0) + 1

print("\n📊 Frases por autor:")
for author, count in sorted(author_count.items(), key=lambda x: -x[1]):
    print(f"   {count:2d}x {author}")

# Reorganizar evitando autores consecutivos
# Usar algoritmo greedy: siempre elegir el autor más frecuente que no sea el anterior
reorganized = []
remaining = phrases.copy()
last_author = None

while remaining:
    # Filtrar frases que no sean del último autor
    candidates = [p for p in remaining if p['author'] != last_author]
    
    if not candidates:
        # Si no hay candidatos (muy raro), tomar cualquiera
        candidates = remaining
        print(f"⚠️  No se pudo evitar repetición en posición {len(reorganized) + 1}")
    
    # Contar autores en candidatos
    candidate_authors = {}
    for c in candidates:
        candidate_authors[c['author']] = candidate_authors.get(c['author'], 0) + 1
    
    # Elegir el autor más frecuente entre los candidatos
    best_author = max(candidate_authors.keys(), key=lambda a: candidate_authors[a])
    
    # Tomar la primera frase de ese autor
    chosen = next(p for p in candidates if p['author'] == best_author)
    
    reorganized.append(chosen)
    remaining.remove(chosen)
    last_author = chosen['author']

print(f"\n✓ Reorganización completa: {len(reorganized)} frases")

# Verificar que no hay autores consecutivos
consecutive_errors = 0
for i in range(1, len(reorganized)):
    if reorganized[i]['author'] == reorganized[i-1]['author']:
        consecutive_errors += 1
        print(f"⚠️  Repetición en #{i+1}: {reorganized[i]['author']}")

if consecutive_errors == 0:
    print("✓ No hay autores consecutivos")
else:
    print(f"❌ Se encontraron {consecutive_errors} repeticiones consecutivas")

# Generar el nuevo array en JavaScript
new_array = "const PHRASES = [\n"
for i, p in enumerate(reorganized):
    # Renumerar los IDs
    block = p['block']
    # Reemplazar el ID
    block = re.sub(r"id:\s*['\"](\d+)['\"]", f"id: '{str(i+1).zfill(3)}'", block)
    new_array += "  " + block
    if i < len(reorganized) - 1:
        new_array += ",\n"
    else:
        new_array += "\n"
new_array += "]"

# Guardar el nuevo array
with open('temp_reorganized_phrases.txt', 'w', encoding='utf-8') as f:
    f.write(new_array)

print(f"\n✓ Nuevo array guardado en temp_reorganized_phrases.txt")
print(f"\n🔍 Primeras 10 frases en el nuevo orden:")
for i in range(min(10, len(reorganized))):
    print(f"   #{i+1:03d}: {reorganized[i]['author']}")
