#!/usr/bin/env python3
"""
Genera el documento Markdown completo con las 150 frases del sistema.
"""

import re

# Leer el archivo
with open('src/pages/FraseDelDiaPage.jsx', 'r', encoding='utf-8') as f:
    content = f.read()

# Extraer el array PHRASES
match = re.search(r'const PHRASES = \[(.*?)\n\]', content, re.DOTALL)
if not match:
    print('❌ Error: No se pudo extraer el array PHRASES')
    exit(1)

phrases_str = match.group(1)

# Parsear todas las frases
phrases = []
# Buscar cada objeto de frase
obj_pattern = r'\{[^}]+id:\s*[\'"](\d+)[\'"][^}]+\}'
for obj_match in re.finditer(obj_pattern, phrases_str, re.DOTALL):
    obj_str = obj_match.group(0)
    
    # Extraer campos
    id_match = re.search(r'id:\s*[\'"](\d+)[\'"]', obj_str)
    quote_match = re.search(r'quote:\s*[\'"]([^\'"]*)[\'"]', obj_str, re.DOTALL)
    author_match = re.search(r'author:\s*[\'"]([^\'"]+)[\'"]', obj_str)
    meaning_match = re.search(r'meaning:\s*[\'"]([^\'"]*)[\'"]', obj_str, re.DOTALL)
    questions_match = re.search(r'questions:\s*\[(.*?)\]', obj_str, re.DOTALL)
    
    if all([id_match, quote_match, author_match, meaning_match, questions_match]):
        # Extraer preguntas
        questions_raw = questions_match.group(1)
        questions = re.findall(r'[\'"]([^\'"]+)[\'"]', questions_raw)
        
        phrases.append({
            'id': id_match.group(1),
            'quote': quote_match.group(1),
            'author': author_match.group(1),
            'meaning': meaning_match.group(1),
            'questions': questions
        })

print(f'✓ Extraídas {len(phrases)} frases')

# Generar el documento Markdown
doc = '''# 📖 Catálogo Completo: "1 frase × día"

## Sistema de Rotación Automática

- **Cambio diario:** Medianoche (00:00 hrs) hora de México
- **Total de frases:** 150 frases filosóficas, psicológicas y espirituales
- **Ciclo completo:** 150 días (aproximadamente 5 meses)
- **Inicio del ciclo:** 23 de diciembre de 2025 = Frase #001
- **Sin repetición de autores consecutivos:** Algoritmo garantiza diversidad día a día

---

## Distribución por Autores

'''

# Contar autores
author_count = {}
for p in phrases:
    author_count[p['author']] = author_count.get(p['author'], 0) + 1

# Ordenar por cantidad descendente
for author, count in sorted(author_count.items(), key=lambda x: (-x[1], x[0])):
    doc += f'- **{author}**: {count} frase' + ('s' if count > 1 else '') + '\n'

doc += '\n---\n\n## 📝 Catálogo de las 150 Frases\n\n'

# Añadir cada frase
for p in phrases:
    doc += f'### Frase #{p["id"]}: {p["author"]}\n\n'
    doc += f'> "{p["quote"]}"\n\n'
    doc += f'**Significado:**\n\n{p["meaning"]}\n\n'
    doc += f'**Preguntas para reflexionar:**\n\n'
    for j, q in enumerate(p['questions'], 1):
        doc += f'{j}. {q}\n'
    doc += '\n---\n\n'

# Guardar el documento
with open('FRASES-DEL-DIA-CATALOGO.md', 'w', encoding='utf-8') as f:
    f.write(doc)

print(f'\n✅ Documento generado: FRASES-DEL-DIA-CATALOGO.md')
print(f'✅ Total: {len(phrases)} frases completas')
print(f'✅ Total autores únicos: {len(author_count)}')
