# Zuzana Web

Página web elegante y minimalista con React + Vite + Tailwind CSS + Framer Motion

## 🚀 Características

- ✨ Diseño Mobile First y totalmente Responsive
- 🎨 Header negro elegante con efectos hover (Desktop)
- 🔘 Toggle Button circular en esquina inferior derecha (Móvil/Tablet)
- 📱 Menú fullscreen elegante para móviles
- 🎬 Background con imagen (preparado para video)
- 🎭 Animaciones fluidas con Framer Motion
- ⚡ Ultra rápido con Vite

## 📦 Instalación

```bash
npm install
```

## 🏃‍♂️ Desarrollo

```bash
npm run dev
```

Abre http://localhost:3000 en tu navegador.

Para ver en tu móvil en la misma red WiFi:
1. Busca tu IP local (ipconfig en Windows)
2. Abre http://TU_IP:3000 en tu móvil

## 🏗️ Build

```bash
npm run build
```

## 📝 Personalización

### Agregar tus elementos del menú

Edita `src/App.jsx` en la línea donde dice `menuItems`:

```javascript
const menuItems = [
  { name: 'Inicio', href: '#home' },
  { 
    name: 'Servicios', 
    href: '#services',
    subItems: [
      { name: 'Subservicio 1', href: '#sub1' },
      { name: 'Subservicio 2', href: '#sub2' }
    ]
  },
  // ... más items
]
```

### Reemplazar imagen con video

1. Coloca tu video en la carpeta `public/` con el nombre `video.mp4`
2. En `src/components/VideoBackground.jsx` cambia `setIsVideo(false)` a `setIsVideo(true)`

### Ajustar colores y fuentes

Edita `tailwind.config.js` para personalizar colores y fuentes.

## 🎨 Breakpoints Responsive

- **Mobile**: < 768px (Toggle button visible)
- **Tablet (iPad)**: 768px - 1023px (Toggle button visible)
- **Desktop**: ≥ 1024px (Header horizontal visible)
