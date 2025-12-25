import { Compass, Sparkles, Eye, Heart, Brain, Wind, Flame, Moon, Sun, Star } from 'lucide-react'

/**
 * ATLAS DE LA HUMANIDAD - SISTEMA DE GESTIÓN DE CONTENIDO
 * 
 * INSTRUCCIONES PARA AGREGAR NUEVAS IMÁGENES:
 * 
 * 1. Coloca la imagen en: public/atlas de la humanidad/
 * 2. Nombre sugerido: numero-titulo-corto.jpg (ejemplo: 003-soledad.jpg)
 * 3. Copia el template de abajo y llena los datos
 * 4. El script compress-atlas-images.ps1 la comprimirá automáticamente
 * 
 * ESTRUCTURA DE CADA ENTRADA:
 * {
 *   id: 'XXX' - Número secuencial de 3 dígitos (001, 002, 003...)
 *   title: 'Título Corto' - Máximo 40 caracteres
 *   description: 'Descripción larga' - Explicación profunda del concepto (200-400 palabras)
 *   image: '/atlas de la humanidad/nombre-archivo.jpg' - Ruta relativa desde public/
 *   color: '#XXXXXX' - Color hex principal de la imagen
 *   icon: IconoLucide - Ícono que representa el concepto (importar arriba)
 * }
 */

export const ATLAS_IMAGES = [
  {
    id: '001',
    title: 'Partida sin ensayo',
    description: 'Como en el ajedrez, la vida parece regirse por reglas: estudiar, elegir, avanzar, ganar o perder. Sin embargo, el sujeto no ve el tablero completo. La venda representa lo real: ese punto donde el sentido falla y no hay garantía. Milan Kundera lo intuía al decir que la vida es un ensayo para una obra que nunca ocurre. Aquí, cada decisión es definitiva precisamente porque no puede probarse antes. El error no es elegir mal, sino creer que alguna vez se elige con certeza.',
    image: '/atlas de la humanidad/partida sin ensayo.png',
    color: '#4A5568', // gris azulado
    icon: Compass
  },
  {
    id: '002',
    title: 'Cómo no electrocutarse',
    description: 'En la imagen se observa a alguien en un estado de extrema cautela: el cuerpo inmóvil, la respiración contenida, la atención puesta en no cometer un solo error. No porque algo esté ocurriendo, sino porque podría ocurrir. Psíquicamente, esta escena representa a quienes viven en relaciones donde saben que el otro puede estallar en cualquier momento. Cada palabra, cada gesto, cada silencio se mide para no "activar" algo. El vínculo deja de ser encuentro y se convierte en supervivencia emocional.',
    image: '/atlas de la humanidad/como no electrocutarse.jpg',
    color: '#7C3AED', // púrpura eléctrico
    icon: Sparkles
  }
  
  // 📝 TEMPLATE PARA NUEVA ENTRADA:
  // Copia desde aquí 👇
  /*
  {
    id: '003', // Siguiente número
    title: 'Título de tu imagen',
    description: 'Escribe aquí tu descripción profunda. Puede ser de varias líneas. Explica el concepto psicológico, filosófico o psicoanalítico detrás de la imagen. Conecta con teorías de Lacan, Freud, Žižek o conceptos propios. Hazlo denso pero accesible.',
    image: '/atlas de la humanidad/003-nombre-archivo.jpg',
    color: '#XXXXXX', // Usa un color representativo de la imagen
    icon: Eye // Cambia por: Compass, Sparkles, Eye, Heart, Brain, Wind, Flame, Moon, Sun, Star
  },
  */
  // Copia hasta aquí 👆
  // Y pega debajo de este comentario para agregar nuevas entradas
]

// Íconos disponibles:
// Compass, Sparkles, Eye, Heart, Brain, Wind, Flame, Moon, Sun, Star
// Si necesitas más, agrégalos en el import de arriba

export default ATLAS_IMAGES
