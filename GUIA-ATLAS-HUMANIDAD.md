# 📚 SISTEMA DE GESTIÓN - ATLAS DE LA HUMANIDAD

## 🎯 OBJETIVO

Este sistema te permite agregar fácilmente nuevas imágenes y textos al **Atlas de la Humanidad** sin tocar el código React complejo. Todo se gestiona desde un archivo de datos centralizado.

---

## 📁 ARCHIVOS IMPORTANTES

```
página web zuzana/
├── public/
│   └── atlas de la humanidad/          ← Coloca aquí las imágenes
│       ├── partida sin ensayo.png
│       ├── como no electrocutarse.jpg
│       └── [tus nuevas imágenes]
├── src/
│   └── data/
│       └── atlasData.js                ← Edita aquí para agregar contenido
└── compress-atlas-images.ps1           ← Script de compresión automática
```

---

## 🚀 CÓMO AGREGAR UNA NUEVA IMAGEN AL ATLAS

### **PASO 1: Preparar la imagen**

1. **Formato recomendado:**
   - **Tipo:** JPG, PNG o WebP
   - **Tamaño:** Hasta 5MB (el script la comprimirá)
   - **Dimensiones:** Mínimo 1200px de ancho
   - **Calidad:** Alta (el script optimizará)

2. **Nombrar archivo:**
   ```
   Formato: numero-titulo-corto.jpg
   Ejemplos:
   - 003-soledad.jpg
   - 004-amor-liquido.png
   - 005-espejo-roto.jpg
   ```

3. **Colocar en carpeta:**
   - Ruta: `public/atlas de la humanidad/`
   - Arrastra tu imagen ahí

---

### **PASO 2: Comprimir la imagen**

1. **Abrir PowerShell** en la carpeta del proyecto

2. **Ejecutar el script:**
   ```powershell
   .\compress-atlas-images.ps1
   ```

3. **Resultado:**
   ```
   🖼️  COMPRESOR DE IMÁGENES - ATLAS DE LA HUMANIDAD
   ================================================

   📁 Encontradas 1 imágenes

   🖼️  Procesando: 003-soledad.jpg
      ✅ Comprimido: public\atlas de la humanidad\003-soledad.jpg
      📊 Original: 3247.52 KB
      📊 Comprimido: 487.23 KB
      📊 Reducción: 85.00%
   
   ================================================
   ✅ Comprimidas: 1 imágenes
   ⏭️  Omitidas: 0 imágenes
   ================================================
   ```

**⚠️ NOTA:** Si ImageMagick no está instalado, el script copiará la imagen sin comprimir pero te avisará cómo instalarlo.

---

### **PASO 3: Agregar datos en atlasData.js**

1. **Abrir archivo:**
   ```
   src/data/atlasData.js
   ```

2. **Buscar el template** (está al final del archivo con comentarios)

3. **Copiar el template:**
   ```javascript
   {
     id: '003', // Siguiente número
     title: 'Título de tu imagen',
     description: 'Escribe aquí tu descripción profunda...',
     image: '/atlas de la humanidad/003-nombre-archivo.jpg',
     color: '#XXXXXX', // Color representativo
     icon: Eye // Ícono de Lucide React
   },
   ```

4. **Llenar tus datos:**
   ```javascript
   {
     id: '003',
     title: 'La soledad elegida',
     description: 'La soledad no es ausencia de otros, sino presencia de uno mismo. En esta imagen vemos a alguien que eligió estar solo, no por rechazo al mundo, sino por necesidad de escucharse. Lacan diría que es el momento donde el sujeto se enfrenta al vacío constitutivo: ese punto donde el Otro no puede responder por ti. La soledad elegida no es huida, es pausa. Un respiro antes de volver a la demanda incesante de ser alguien para otros.',
     image: '/atlas de la humanidad/003-soledad.jpg',
     color: '#1E293B', // Azul oscuro
     icon: Moon
   },
   ```

5. **Guardar el archivo** (Ctrl + S)

---

### **PASO 4: Ver los cambios**

1. **Si el servidor está corriendo:**
   - Los cambios se reflejan automáticamente (Hot Reload)
   - Recarga la página de Atlas

2. **Si no está corriendo:**
   ```bash
   npm run dev
   ```

3. **Ver resultado:**
   - Ve a: `http://localhost:3000/atlas-humanidad`
   - Usa las flechas para navegar
   - Tu nueva imagen aparecerá al final

---

## 🎨 GUÍA DE ÍCONOS DISPONIBLES

Los íconos vienen de **Lucide React**. Estos son los más apropiados para el Atlas:

| Ícono | Cuándo usarlo | Ejemplo |
|-------|---------------|---------|
| `Compass` | Decisiones, direcciones, búsqueda | "Partida sin ensayo" |
| `Sparkles` | Transformación, revelación | "Cómo no electrocutarse" |
| `Eye` | Observación, consciencia, mirada | Vigilancia, autoobservación |
| `Heart` | Amor, afecto, vínculos | Relaciones, emociones |
| `Brain` | Pensamiento, razón, mente | Cognición, análisis |
| `Wind` | Movimiento, cambio, fluidez | Transformación |
| `Flame` | Pasión, intensidad, deseo | Pulsión, energía |
| `Moon` | Inconsciente, noche, soledad | Introspección |
| `Sun` | Consciencia, claridad, día | Iluminación |
| `Star` | Ideal, aspiración, guía | Objetivos, valores |

**Para agregar más íconos:**

1. Ve a: https://lucide.dev/icons
2. Busca el ícono que quieras
3. Agrégalo al import en `atlasData.js`:
   ```javascript
   import { Compass, Sparkles, Eye, TuNuevoIcono } from 'lucide-react'
   ```

---

## 🎨 GUÍA DE COLORES

El color debe ser representativo de la imagen. Usa un picker de colores:

**Herramientas:**
- **Online:** https://imagecolorpicker.com/
  - Sube tu imagen
  - Haz clic en el color dominante
  - Copia el código HEX (#XXXXXX)

- **VS Code:** Extensión "Color Picker"

**Consejos:**
- Elige el color más emocional de la imagen
- Si hay varios, elige el que represente el concepto
- Evita colores muy claros (dificulta legibilidad)

**Ejemplos:**
```javascript
color: '#4A5568'  // Gris azulado - Incertidumbre
color: '#7C3AED'  // Púrpura - Tensión
color: '#1E293B'  // Azul oscuro - Soledad
color: '#DC2626'  // Rojo - Pasión/dolor
color: '#059669'  // Verde - Calma/naturaleza
color: '#F59E0B'  // Naranja - Calidez
```

---

## ✍️ GUÍA PARA ESCRIBIR DESCRIPCIONES

### **Estructura recomendada:**

1. **Observación** (1-2 líneas)
   - Describe qué se ve en la imagen

2. **Interpretación** (3-5 líneas)
   - Conecta con concepto psicológico/filosófico
   - Menciona autor si es relevante (Lacan, Freud, Žižek, etc.)

3. **Cierre** (1-2 líneas)
   - Frase contundente que sintetice

### **Ejemplo bien hecho:**

```javascript
description: 'La imagen muestra a alguien frente a un espejo roto. Los fragmentos reflejan versiones distintas, ninguna completa. Psíquicamente, esto representa la identidad fragmentada: Lacan lo llamaría el estadio del espejo ya no como unificación, sino como constatación de que nunca hubo unidad real. Cada fragmento es una máscara social, un yo para cada situación. El sujeto no es uno: es muchos intentando parecerse.',
```

### **Longitud ideal:**
- Mínimo: 150 palabras
- Óptimo: 200-300 palabras
- Máximo: 400 palabras

---

## 🔧 SOLUCIÓN DE PROBLEMAS

### **Problema 1: La imagen no aparece**

**Causa:** Ruta incorrecta

**Solución:**
```javascript
// ❌ MAL
image: 'atlas de la humanidad/imagen.jpg'
image: 'public/atlas de la humanidad/imagen.jpg'

// ✅ BIEN
image: '/atlas de la humanidad/imagen.jpg'
```

---

### **Problema 2: Imagen muy pesada (carga lenta)**

**Causa:** No se comprimió o falló la compresión

**Solución:**
1. Verificar que ImageMagick esté instalado:
   ```powershell
   magick -version
   ```
2. Si no está, instalar:
   ```powershell
   winget install ImageMagick.ImageMagick
   ```
3. Volver a ejecutar:
   ```powershell
   .\compress-atlas-images.ps1
   ```

---

### **Problema 3: Ícono no aparece**

**Causa:** Ícono no importado

**Solución:**
1. Abrir `src/data/atlasData.js`
2. Verificar que el ícono esté en el import:
   ```javascript
   import { Compass, Sparkles, Eye, TuIcono } from 'lucide-react'
   ```
3. Si no está, agregarlo

---

### **Problema 4: Error de sintaxis**

**Causa:** Falta coma, llave o comilla

**Solución:**
1. Revisar que cada entrada tenga:
   - Coma al final (excepto la última)
   - Comillas en textos
   - Llaves correctamente cerradas

```javascript
// ❌ MAL (falta coma)
{
  id: '003',
  title: 'Título'
  description: 'Texto'
}

// ✅ BIEN
{
  id: '003',
  title: 'Título',
  description: 'Texto'
},
```

---

## 📊 ESTADÍSTICAS Y ORDEN

### **Numeración:**

- Usa números secuenciales de 3 dígitos
- Empieza en '001', '002', '003'...
- Si borras uno, no reutilices el número
- Salta al siguiente disponible

### **Orden en el carrusel:**

Las imágenes aparecen en el orden que están en el array. Para reordenar:

1. Corta una entrada completa (desde `{` hasta `},`)
2. Pégala en la posición deseada
3. NO cambies los IDs
4. Mantén las comas correctamente

---

## 🎯 CHECKLIST ANTES DE PUBLICAR

- [ ] Imagen colocada en `public/atlas de la humanidad/`
- [ ] Imagen comprimida con script
- [ ] Datos completos en `atlasData.js`:
  - [ ] ID único
  - [ ] Título claro (max 40 caracteres)
  - [ ] Descripción profunda (200-300 palabras)
  - [ ] Ruta de imagen correcta (empieza con `/`)
  - [ ] Color representativo (#XXXXXX)
  - [ ] Ícono importado y apropiado
- [ ] Sin errores de sintaxis (comas, llaves)
- [ ] Testeado localmente (`npm run dev`)
- [ ] Navegación funciona (flechas izq/der)
- [ ] Compartir funciona (botones de share)

---

## 🚀 PUBLICAR CAMBIOS

Una vez que todo funciona localmente:

```bash
git add .
git commit -m "feat: agregar nueva imagen al Atlas - [Título]"
git push
```

Los cambios se desplegarán automáticamente.

---

## 📚 RECURSOS ADICIONALES

### **Inspiración para conceptos:**

- **Libros:**
  - "El Estadio del Espejo" - Jacques Lacan
  - "La Insoportable Levedad del Ser" - Milan Kundera
  - "Modernidad Líquida" - Zygmunt Bauman

- **Temas sugeridos:**
  - Espejo roto (identidad fragmentada)
  - Máscara social (falso self)
  - Puerta cerrada (resistencia)
  - Sombra en la pared (proyección)
  - Hilo rojo (vínculo invisible)
  - Jaula abierta (libertad que asusta)
  - Escalera infinita (repetición)

### **Banco de imágenes libres:**

- Unsplash.com
- Pexels.com
- Pixabay.com

**⚠️ IMPORTANTE:** Verifica la licencia antes de usar.

---

## 🎁 EJEMPLO COMPLETO

### **De principio a fin:**

1. **Descargo imagen:** "man-looking-mirror.jpg" de Unsplash
2. **Renombro:** "004-espejo-identidad.jpg"
3. **Coloco en:** `public/atlas de la humanidad/`
4. **Ejecuto:**
   ```bash
   .\compress-atlas-images.ps1
   ```
5. **Abro:** `src/data/atlasData.js`
6. **Agrego al final del array:**
   ```javascript
   {
     id: '004',
     title: 'El espejo que no miente',
     description: 'Un hombre observa su reflejo, pero no se reconoce. La mirada es de extrañamiento, como si viera a un desconocido. Jacques Lacan señalaba que el estadio del espejo es una ilusión necesaria: el niño se ve entero cuando en realidad está fragmentado. En la adultez, esa ilusión persiste. Nos vemos como "alguien", pero ese alguien es una construcción frágil que puede derrumbarse con una pregunta: ¿Quién eres cuando nadie te mira? El espejo no miente; somos nosotros quienes nos mentimos al mirarlo.',
     image: '/atlas de la humanidad/004-espejo-identidad.jpg',
     color: '#334155',
     icon: Eye
   },
   ```
7. **Guardo** (Ctrl + S)
8. **Verifico** en `localhost:3000/atlas-humanidad`
9. **Publico:**
   ```bash
   git add .
   git commit -m "feat: agregar 'El espejo que no miente' al Atlas"
   git push
   ```

---

## 💬 PREGUNTAS FRECUENTES

**P: ¿Cuántas imágenes puedo agregar?**
R: Ilimitadas. El carrusel se adapta automáticamente.

**P: ¿Puedo usar videos?**
R: No por ahora. Solo imágenes estáticas.

**P: ¿Puedo editar una entrada existente?**
R: Sí, solo modifica los datos en `atlasData.js` y guarda.

**P: ¿Puedo cambiar el orden?**
R: Sí, reordena las entradas en el array (mantén la sintaxis correcta).

**P: ¿Qué pasa si borro una imagen accidentalmente?**
R: Quítala también de `atlasData.js` o habrá un error 404.

---

## 📞 SOPORTE

Si algo no funciona:

1. Revisa la consola del navegador (F12)
2. Busca errores en rojo
3. Verifica la sintaxis en `atlasData.js`
4. Asegúrate de que la imagen existe en la ruta correcta

---

*Última actualización: 25 Diciembre 2025*
*Versión: 1.0*
