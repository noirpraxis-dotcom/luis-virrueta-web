/**
 * Utilidades para compresión de imágenes en el cliente
 * Optimiza imágenes antes de subirlas a Supabase
 */

/**
 * Comprime una imagen manteniendo calidad aceptable
 * @param {File} file - Archivo de imagen a comprimir
 * @param {Object} options - Opciones de compresión
 * @returns {Promise<File>} - Archivo comprimido
 */
export async function compressImage(file, options = {}) {
  const {
    maxWidth = 1200,
    maxHeight = 800,
    quality = 0.70,
    type = 'image/webp',
    targetSizeKB = 100
  } = options

  return new Promise((resolve, reject) => {
    const reader = new FileReader()
    
    reader.onload = (e) => {
      const img = new Image()
      
      img.onload = () => {
        // Calcular nuevas dimensiones manteniendo aspect ratio
        let { width, height } = img
        
        if (width > maxWidth) {
          height = (height * maxWidth) / width
          width = maxWidth
        }
        
        if (height > maxHeight) {
          width = (width * maxHeight) / height
          height = maxHeight
        }

        // Crear canvas y dibujar imagen redimensionada
        const canvas = document.createElement('canvas')
        canvas.width = width
        canvas.height = height
        
        const ctx = canvas.getContext('2d')
        ctx.imageSmoothingEnabled = true
        ctx.imageSmoothingQuality = 'high'
        ctx.drawImage(img, 0, 0, width, height)

        // Función recursiva para comprimir hasta alcanzar el tamaño objetivo
        const compressToTarget = (currentQuality) => {
          canvas.toBlob(
            (blob) => {
              if (!blob) {
                reject(new Error('Error al comprimir imagen'))
                return
              }

              const sizeKB = blob.size / 1024

              // Si ya está por debajo del objetivo, o la calidad es muy baja, terminar
              if (sizeKB <= targetSizeKB || currentQuality <= 0.3) {
                const compressedFile = new File(
                  [blob],
                  file.name.replace(/\.[^/.]+$/, '.webp'),
                  { type, lastModified: Date.now() }
                )

                // Log de compresión
                console.log('📸 Compresión:', {
                  original: `${(file.size / 1024).toFixed(2)} KB`,
                  compressed: `${sizeKB.toFixed(2)} KB`,
                  reduction: `${(((file.size - blob.size) / file.size) * 100).toFixed(1)}%`,
                  quality: `${(currentQuality * 100).toFixed(0)}%`
                })

                resolve(compressedFile)
              } else {
                // Reducir calidad y reintentar
                compressToTarget(currentQuality - 0.05)
              }
            },
            type,
            currentQuality
          )
        }

        // Iniciar compresión con la calidad especificada
        compressToTarget(quality)
      }

      img.onerror = () => reject(new Error('Error al cargar imagen'))
      img.src = e.target.result
    }

    reader.onerror = () => reject(new Error('Error al leer archivo'))
    reader.readAsDataURL(file)
  })
}

/**
 * Valida si el archivo es una imagen válida
 */
export function isValidImage(file) {
  const validTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp', 'image/gif']
  const maxSize = 10 * 1024 * 1024 // 10MB

  if (!validTypes.includes(file.type)) {
    return { valid: false, error: 'Formato no válido. Use JPG, PNG, WEBP o GIF' }
  }

  if (file.size > maxSize) {
    return { valid: false, error: 'La imagen no debe superar 10MB' }
  }

  return { valid: true }
}

/**
 * Genera un preview URL de la imagen
 */
export function getImagePreview(file) {
  return URL.createObjectURL(file)
}

/**
 * Libera memoria del preview URL
 */
export function revokeImagePreview(url) {
  URL.revokeObjectURL(url)
}
