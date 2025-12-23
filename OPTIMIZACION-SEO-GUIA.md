# 🚀 OPTIMIZACIÓN Y SEO - LUIS VIRRUETA WEB

## 📊 Google Analytics 4 - Configuración

### Paso 1: Crear cuenta de Google Analytics
1. Ve a https://analytics.google.com/
2. Click en "Empezar a medir"
3. Nombre de cuenta: "Luis Virrueta Web"
4. Nombre de propiedad: "Luis Virrueta - Sitio Principal"
5. Zona horaria: México (America/Mexico_City)
6. Moneda: MXN

### Paso 2: Obtener Measurement ID
1. En tu propiedad, ve a "Administración" > "Flujos de datos"
2. Click en "Agregar flujo" > "Web"
3. URL del sitio web: `https://luisvirrueta.com`
4. Nombre del flujo: "Luis Virrueta Production"
5. Copia el **MEASUREMENT ID** (formato: G-XXXXXXXXXX)

### Paso 3: Configurar en el proyecto
1. Agrega a `.env.local`:
```bash
VITE_GA_MEASUREMENT_ID=G-XXXXXXXXXX
```

2. Agrega en **Cloudflare Pages** > Environment Variables (Production):
- Variable: `VITE_GA_MEASUREMENT_ID`
- Value: `G-XXXXXXXXXX`

### Paso 4: Verificar funcionamiento
1. Ve a Google Analytics > Informes > Tiempo real
2. Abre tu sitio en otra pestaña
3. Deberías ver tu visita en "Usuarios en tiempo real"

---

## 🎬 Compresión de Videos

### Videos actuales que necesitan compresión:
- `HERO HOME.mp4` (hero principal)
- `video portada.mp4`
- `sobre mi vid.mp4`
- `hero servicios.mp4`
- `Frases.mp4`
- Todos los videos en `/public/*.mp4`

### Comando para comprimir videos (FFmpeg):
```bash
# Instalar FFmpeg (Windows con Chocolatey)
choco install ffmpeg

# Comprimir un video a H.265 (HEVC) - Mejor compresión
ffmpeg -i "input.mp4" -c:v libx265 -crf 28 -preset medium -c:a aac -b:a 128k "output-compressed.mp4"

# Comprimir todos los videos de la carpeta public
$videos = Get-ChildItem "public/*.mp4"
foreach ($video in $videos) {
    $output = $video.FullName -replace '.mp4', '-compressed.mp4'
    ffmpeg -i $video.FullName -c:v libx265 -crf 28 -preset medium -c:a aac -b:a 128k $output
}
```

### Parámetros explicados:
- `-crf 28`: Calidad (0-51, menor = mejor calidad, 28 = balance)
- `-preset medium`: Velocidad de encoding (ultrafast, fast, medium, slow)
- `libx265`: Codec H.265 (50% más eficiente que H.264)

---

## 🖼️ Optimización de Imágenes

### Imágenes que necesitan optimización:
- `/public/luxmania perfil.png` → ELIMINAR (ya no se usa)
- `/public/portada.jpg`, `/public/portada 2.jpg`
- Todas las imágenes en `/public/*.{jpg,png}`

### Script de compresión de imágenes:
```bash
# Instalar sharp (ya incluido en package.json)
npm install sharp

# Crear script compress-images.js
```

Archivo `compress-images.js`:
```javascript
import sharp from 'sharp'
import { readdirSync, statSync } from 'fs'
import { join } from 'path'

const publicDir = './public'
const quality = 85

async function compressImage(filePath) {
  const ext = filePath.toLowerCase()
  
  if (ext.endsWith('.jpg') || ext.endsWith('.jpeg')) {
    await sharp(filePath)
      .jpeg({ quality, mozjpeg: true })
      .toFile(filePath.replace(/\.(jpg|jpeg)$/, '-compressed.jpg'))
    console.log(`✅ Compressed: ${filePath}`)
  } else if (ext.endsWith('.png')) {
    await sharp(filePath)
      .png({ quality, compressionLevel: 9 })
      .toFile(filePath.replace('.png', '-compressed.png'))
    console.log(`✅ Compressed: ${filePath}`)
  }
}

async function processDirectory(dir) {
  const files = readdirSync(dir)
  
  for (const file of files) {
    const fullPath = join(dir, file)
    const stat = statSync(fullPath)
    
    if (stat.isDirectory()) {
      await processDirectory(fullPath)
    } else if (file.match(/\.(jpg|jpeg|png)$/i) && !file.includes('-compressed')) {
      await compressImage(fullPath)
    }
  }
}

processDirectory(publicDir)
```

Ejecutar:
```bash
node compress-images.js
```

---

## 📁 Organización de Videos

### Nueva estructura recomendada:
```
public/
├── videos/
│   ├── heroes/
│   │   ├── home-hero.mp4
│   │   ├── servicios-hero.mp4
│   │   ├── sobre-mi-hero.mp4
│   │   └── frases-hero.mp4
│   ├── sections/
│   │   ├── metodo-fases.mp4
│   │   └── servicios-overview.mp4
│   └── backgrounds/
│       └── cerebro-home.mp4
├── images/
│   ├── profiles/
│   ├── services/
│   └── blog/
```

---

## 🔍 SEO Profundo - Checklist

### ✅ Completado:
- [x] Google Analytics 4 integrado
- [x] Meta tags para Frase del Día
- [x] Open Graph tags
- [x] Twitter Cards
- [x] Structured Data (JSON-LD)
- [x] Canonical URLs

### ⏳ Pendiente:
- [ ] Sitemap.xml actualizado con /frase-del-dia
- [ ] robots.txt optimizado
- [ ] Preload de videos críticos
- [ ] Lazy loading de imágenes
- [ ] Compresión de videos
- [ ] Optimización de imágenes
- [ ] Eliminar archivos no usados (luxmania perfil.png)

---

## 🗑️ Archivos a Eliminar

### Referencias a LUXMANIA:
```bash
# Eliminar archivos markdown de LUXMANIA
Remove-Item "AUDITORIA-COMPLETA-DICIEMBRE-2025.md"
Remove-Item "ESTRATEGIA-ANALISIS-Y-MEJORA-CONTINUA.md"
Remove-Item "ESTRATEGIA-SEO-COMPLETA.md"

# Eliminar imagen no usada
Remove-Item "public/luxmania perfil.png"
Remove-Item "public/luxmania rosa.mp4"
Remove-Item "public/LUXMANIA HOME.mp4"
```

---

## 🚀 Próximos pasos

1. **Configurar Google Analytics** (5 min)
2. **Comprimir videos** (30-60 min dependiendo de cantidad)
3. **Optimizar imágenes** (15 min con script automatizado)
4. **Reorganizar estructura de carpetas** (10 min)
5. **Actualizar imports en código** (15 min)
6. **Eliminar archivos no usados** (5 min)
7. **Testing de rendimiento** (Google PageSpeed Insights)

**Tiempo total estimado:** 1.5 - 2 horas

---

## 📈 Mejoras de Rendimiento Esperadas

- **Videos:** 50-70% reducción de tamaño (H.265)
- **Imágenes:** 30-50% reducción de tamaño
- **PageSpeed Score:** +15-25 puntos
- **Tiempo de carga:** -40-60%
- **Core Web Vitals:** Todos en verde ✅
