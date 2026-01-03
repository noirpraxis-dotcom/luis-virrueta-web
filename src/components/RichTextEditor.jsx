import { useState, useRef, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  Type, Heading1, Heading2, Heading3, Bold, Italic, 
  List, ListOrdered, Quote, Sparkles, AlertCircle,
  Image as ImageIcon, Plus, Trash2, MoveUp, MoveDown,
  Eye, Code, Link as LinkIcon
} from 'lucide-react'

/**
 * RichTextEditor con detección automática de contenido de GPT
 * Permite pegar texto y automáticamente detecta títulos, párrafos, listas, etc.
 */
export default function RichTextEditor({ initialContent = [], onChange }) {
  const [blocks, setBlocks] = useState(initialContent)
  const [selectedBlockId, setSelectedBlockId] = useState(null)
  const [showFormatMenu, setShowFormatMenu] = useState(false)
  const pasteAreaRef = useRef(null)

  // Cuando los bloques cambian, notificar al padre
  useEffect(() => {
    onChange?.(blocks)
  }, [blocks])

  /**
   * Detecta automáticamente el tipo de contenido al pegar
   */
  const handlePaste = (e) => {
    e.preventDefault()
    const text = e.clipboardData.getData('text/plain')
    
    if (!text.trim()) return

    // Parsear el texto pegado en bloques
    const parsedBlocks = parseTextToBlocks(text)
    
    // Agregar bloques al final
    setBlocks([...blocks, ...parsedBlocks])
  }

  /**
   * Parser inteligente que detecta títulos, listas, párrafos, etc.
   */
  const parseTextToBlocks = (text) => {
    const lines = text.split('\n').filter(line => line.trim())
    const newBlocks = []

    lines.forEach((line, index) => {
      const trimmed = line.trim()
      
      // Detectar títulos (líneas cortas, primera letra mayúscula, sin punto final)
      if (trimmed.length < 100 && 
          /^[A-ZÁÉÍÓÚÑ¿¡]/.test(trimmed) && 
          !trimmed.endsWith('.') &&
          !trimmed.startsWith('-') &&
          !trimmed.startsWith('*') &&
          !trimmed.startsWith('•')) {
        
        // Determinar nivel de título por contexto
        const level = index === 0 ? 'h1' : 
                     trimmed.length < 50 ? 'h2' : 'h3'
        
        newBlocks.push({
          id: `block-${Date.now()}-${index}`,
          type: 'heading',
          level,
          content: trimmed
        })
      }
      // Detectar listas
      else if (/^[-*•]\s/.test(trimmed)) {
        newBlocks.push({
          id: `block-${Date.now()}-${index}`,
          type: 'list',
          content: trimmed.replace(/^[-*•]\s/, '')
        })
      }
      // Detectar highlights (texto entre asteriscos o comillas)
      else if (/^\*\*.*\*\*$/.test(trimmed) || /^".*"$/.test(trimmed)) {
        newBlocks.push({
          id: `block-${Date.now()}-${index}`,
          type: 'highlight',
          content: trimmed.replace(/^\*\*|\*\*$|^"|"$/g, '')
        })
      }
      // Párrafo normal
      else {
        newBlocks.push({
          id: `block-${Date.now()}-${index}`,
          type: 'paragraph',
          content: trimmed
        })
      }
    })

    return newBlocks
  }

  /**
   * Agregar nuevo bloque vacío
   */
  const addBlock = (type = 'paragraph') => {
    const newBlock = {
      id: `block-${Date.now()}`,
      type,
      content: ''
    }
    
    if (selectedBlockId) {
      // Insertar después del bloque seleccionado
      const index = blocks.findIndex(b => b.id === selectedBlockId)
      const newBlocks = [...blocks]
      newBlocks.splice(index + 1, 0, newBlock)
      setBlocks(newBlocks)
    } else {
      setBlocks([...blocks, newBlock])
    }

    setSelectedBlockId(newBlock.id)
  }

  /**
   * Actualizar contenido de un bloque
   */
  const updateBlock = (id, updates) => {
    setBlocks(blocks.map(block => 
      block.id === id ? { ...block, ...updates } : block
    ))
  }

  /**
   * Eliminar bloque
   */
  const deleteBlock = (id) => {
    setBlocks(blocks.filter(block => block.id !== id))
  }

  /**
   * Mover bloque arriba/abajo
   */
  const moveBlock = (id, direction) => {
    const index = blocks.findIndex(b => b.id === id)
    if (index === -1) return

    const newIndex = direction === 'up' ? index - 1 : index + 1
    if (newIndex < 0 || newIndex >= blocks.length) return

    const newBlocks = [...blocks]
    const [moved] = newBlocks.splice(index, 1)
    newBlocks.splice(newIndex, 0, moved)
    setBlocks(newBlocks)
  }

  return (
    <div className="space-y-4">
      {/* Área de pegado inicial */}
      {blocks.length === 0 && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="relative"
        >
          <textarea
            ref={pasteAreaRef}
            onPaste={handlePaste}
            placeholder="📋 Pega aquí tu contenido de GPT o escribe directamente...

El editor detectará automáticamente:
• Títulos y subtítulos
• Párrafos
• Listas
• Texto destacado

También puedes usar el botón + para agregar bloques específicos."
            className="w-full min-h-[300px] p-6 bg-white/5 border-2 border-dashed border-purple-500/30 rounded-xl text-gray-300 placeholder-gray-500 focus:outline-none focus:border-purple-500 focus:ring-2 focus:ring-purple-500/20 transition-all resize-none"
          />
          
          <div className="mt-4 flex items-center gap-3">
            <button
              onClick={() => addBlock('paragraph')}
              className="flex items-center gap-2 px-4 py-2 bg-purple-500/10 hover:bg-purple-500/20 border border-purple-500/30 text-purple-300 rounded-lg transition-all"
            >
              <Plus className="w-4 h-4" />
              Agregar Bloque Manualmente
            </button>
            
            <span className="text-gray-500 text-sm">o pega tu contenido arriba</span>
          </div>
        </motion.div>
      )}

      {/* Bloques de contenido */}
      <AnimatePresence>
        {blocks.map((block, index) => (
          <BlockEditor
            key={block.id}
            block={block}
            isSelected={selectedBlockId === block.id}
            onSelect={() => setSelectedBlockId(block.id)}
            onUpdate={(updates) => updateBlock(block.id, updates)}
            onDelete={() => deleteBlock(block.id)}
            onMoveUp={() => moveBlock(block.id, 'up')}
            onMoveDown={() => moveBlock(block.id, 'down')}
            canMoveUp={index > 0}
            canMoveDown={index < blocks.length - 1}
          />
        ))}
      </AnimatePresence>

      {/* Botón para agregar más bloques */}
      {blocks.length > 0 && (
        <BlockTypeSelector onSelect={addBlock} />
      )}
    </div>
  )
}

/**
 * Editor individual de cada bloque
 */
function BlockEditor({ 
  block, 
  isSelected, 
  onSelect, 
  onUpdate, 
  onDelete, 
  onMoveUp, 
  onMoveDown,
  canMoveUp,
  canMoveDown 
}) {
  const [showToolbar, setShowToolbar] = useState(false)

  const handleContentChange = (e) => {
    onUpdate({ content: e.target.value })
  }

  const changeType = (newType) => {
    onUpdate({ type: newType })
    setShowToolbar(false)
  }

  // Estilos según tipo de bloque
  const getInputClasses = () => {
    const base = "w-full bg-transparent text-white placeholder-gray-500 focus:outline-none resize-none"
    
    switch (block.type) {
      case 'heading':
        const size = block.level === 'h1' ? 'text-4xl font-bold' :
                     block.level === 'h2' ? 'text-3xl font-semibold' :
                     'text-2xl font-medium'
        return `${base} ${size}`
      case 'highlight':
        return `${base} text-lg font-medium text-purple-300`
      case 'list':
        return `${base} text-gray-300 pl-6`
      default:
        return `${base} text-gray-300 leading-relaxed`
    }
  }

  const getIcon = () => {
    switch (block.type) {
      case 'heading':
        return block.level === 'h1' ? Heading1 :
               block.level === 'h2' ? Heading2 : Heading3
      case 'highlight':
        return Sparkles
      case 'list':
        return List
      default:
        return Type
    }
  }

  const Icon = getIcon()

  return (
    <motion.div
      layout
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: 20 }}
      onClick={onSelect}
      className={`group relative p-4 rounded-xl border transition-all cursor-pointer ${
        isSelected 
          ? 'bg-purple-500/5 border-purple-500/50 ring-2 ring-purple-500/20' 
          : 'bg-white/5 border-gray-800 hover:border-gray-700'
      }`}
    >
      {/* Indicador de tipo */}
      <div className="absolute -left-3 top-4 opacity-0 group-hover:opacity-100 transition-opacity">
        <div className="w-6 h-6 rounded-full bg-purple-500/20 border border-purple-500/50 flex items-center justify-center">
          <Icon className="w-3 h-3 text-purple-400" />
        </div>
      </div>

      {/* Toolbar */}
      <AnimatePresence>
        {isSelected && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="absolute -top-3 right-4 flex items-center gap-1 bg-gray-900 border border-gray-700 rounded-lg p-1 shadow-xl z-10"
          >
            <ToolbarButton onClick={() => onMoveUp()} disabled={!canMoveUp} icon={MoveUp} />
            <ToolbarButton onClick={() => onMoveDown()} disabled={!canMoveDown} icon={MoveDown} />
            <div className="w-px h-6 bg-gray-700 mx-1" />
            <ToolbarButton 
              onClick={() => changeType(block.type === 'heading' ? 'paragraph' : 'heading')} 
              icon={block.type === 'heading' ? Type : Heading2} 
            />
            <ToolbarButton 
              onClick={() => changeType(block.type === 'highlight' ? 'paragraph' : 'highlight')} 
              icon={Sparkles}
              active={block.type === 'highlight'}
            />
            <div className="w-px h-6 bg-gray-700 mx-1" />
            <ToolbarButton onClick={onDelete} icon={Trash2} danger />
          </motion.div>
        )}
      </AnimatePresence>

      {/* Contenido editable */}
      <textarea
        value={block.content}
        onChange={handleContentChange}
        placeholder={
          block.type === 'heading' ? 'Escribe un título...' :
          block.type === 'highlight' ? 'Texto destacado...' :
          'Escribe aquí...'
        }
        className={getInputClasses()}
        rows={1}
        onInput={(e) => {
          e.target.style.height = 'auto'
          e.target.style.height = e.target.scrollHeight + 'px'
        }}
      />

      {/* Prefijo para listas */}
      {block.type === 'list' && (
        <div className="absolute left-4 top-5 text-purple-400">•</div>
      )}
    </motion.div>
  )
}

/**
 * Botón de toolbar
 */
function ToolbarButton({ icon: Icon, onClick, disabled, active, danger }) {
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className={`p-2 rounded transition-all disabled:opacity-30 disabled:cursor-not-allowed ${
        danger 
          ? 'hover:bg-red-500/20 text-red-400' 
          : active
          ? 'bg-purple-500/20 text-purple-400'
          : 'hover:bg-white/10 text-gray-400'
      }`}
    >
      <Icon className="w-4 h-4" />
    </button>
  )
}

/**
 * Selector de tipo de bloque
 */
function BlockTypeSelector({ onSelect }) {
  const [isOpen, setIsOpen] = useState(false)

  const blockTypes = [
    { type: 'paragraph', icon: Type, label: 'Párrafo' },
    { type: 'heading', icon: Heading2, label: 'Título' },
    { type: 'highlight', icon: Sparkles, label: 'Destacado' },
    { type: 'list', icon: List, label: 'Lista' },
  ]

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 px-4 py-3 bg-purple-500/10 hover:bg-purple-500/20 border border-purple-500/30 text-purple-300 rounded-xl transition-all w-full justify-center font-medium"
      >
        <Plus className="w-5 h-5" />
        Agregar Bloque
      </button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="absolute bottom-full left-0 right-0 mb-2 bg-gray-900 border border-gray-700 rounded-xl p-2 shadow-2xl z-20"
          >
            <div className="grid grid-cols-2 gap-2">
              {blockTypes.map(({ type, icon: Icon, label }) => (
                <button
                  key={type}
                  onClick={() => {
                    onSelect(type)
                    setIsOpen(false)
                  }}
                  className="flex items-center gap-3 p-3 hover:bg-white/10 rounded-lg transition-all text-left"
                >
                  <Icon className="w-5 h-5 text-purple-400" />
                  <span className="text-sm text-white">{label}</span>
                </button>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
