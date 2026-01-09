import { useState, useRef, useEffect, useLayoutEffect } from 'react'
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
export default function RichTextEditor({
  initialContent = [],
  onChange,
  showAddBlockButton = true,
  mode = 'blocks'
}) {
  const [blocks, setBlocks] = useState(initialContent)
  const [selectedBlockId, setSelectedBlockId] = useState(null)
  const [showFormatMenu, setShowFormatMenu] = useState(false)
  const [showFloatingToolbar, setShowFloatingToolbar] = useState(false)
  const [toolbarPosition, setToolbarPosition] = useState({ top: 0, left: 0 })
  const [selectedText, setSelectedText] = useState({ start: 0, end: 0, blockId: null, text: '' })
  const pasteAreaRef = useRef(null)
  const editorRootRef = useRef(null)
  const docEditorRef = useRef(null)
  const docSeededRef = useRef(false)
  const docInputTimeoutRef = useRef(null)

  // History for undo/redo across blocks operations
  const historyRef = useRef({ stack: [initialContent], index: 0 })
  const lastHistoryPushRef = useRef({ at: 0, key: '' })

  const pushHistory = (nextBlocks, { coalesceKey = '' } = {}) => {
    const state = historyRef.current
    const now = Date.now()

    // Coalesce rapid typing edits into the latest history snapshot
    if (coalesceKey) {
      const prev = lastHistoryPushRef.current
      const withinWindow = now - prev.at < 800
      const sameKey = prev.key === coalesceKey
      if (withinWindow && sameKey && state.stack.length) {
        state.stack[state.index] = nextBlocks
        lastHistoryPushRef.current = { at: now, key: coalesceKey }
        return
      }
    }

    const stack = state.stack.slice(0, state.index + 1)
    stack.push(nextBlocks)
    state.stack = stack
    state.index = stack.length - 1
    lastHistoryPushRef.current = { at: now, key: coalesceKey || '' }
  }

  const setBlocksWithHistory = (nextBlocks, options) => {
    setBlocks(nextBlocks)
    pushHistory(nextBlocks, options)
  }

  // Cuando los bloques cambian, notificar al padre
  useEffect(() => {
    onChange?.(blocks)
  }, [blocks, onChange])

  // Keep history in sync if parent provides different initialContent later
  useEffect(() => {
    historyRef.current = { stack: [initialContent], index: 0 }
    setBlocks(initialContent)
  }, [initialContent])

  // Undo/Redo (Ctrl/Cmd+Z / Ctrl+Y / Ctrl+Shift+Z)
  const handleKeyDownCapture = (e) => {
    // In document mode, let the browser handle native undo/redo inside the editor
    if (mode === 'document' && docEditorRef.current && docEditorRef.current.contains(e.target)) return

    const isMac = navigator.platform.toLowerCase().includes('mac')
    const isMod = isMac ? e.metaKey : e.ctrlKey

    if (!isMod) return

    const key = e.key.toLowerCase()
    const isUndo = key === 'z' && !e.shiftKey
    const isRedo = key === 'y' || (key === 'z' && e.shiftKey)

    if (!isUndo && !isRedo) return

    // Only if the event is inside this editor
    if (editorRootRef.current && !editorRootRef.current.contains(e.target)) return

    e.preventDefault()

    const state = historyRef.current
    if (isUndo) {
      if (state.index <= 0) return
      state.index -= 1
      setBlocks(state.stack[state.index] || [])
      return
    }

    if (isRedo) {
      if (state.index >= state.stack.length - 1) return
      state.index += 1
      setBlocks(state.stack[state.index] || [])
    }
  }

  const updateSelectionFromTextarea = (blockId, textareaEl) => {
    if (!textareaEl) return
    const start = textareaEl.selectionStart ?? 0
    const end = textareaEl.selectionEnd ?? 0
    const content = textareaEl.value ?? ''
    const text = start !== end ? content.slice(start, end) : ''

    setSelectedText({ start, end, blockId, text })

    if (text && text.trim()) {
      const rect = textareaEl.getBoundingClientRect()
      setToolbarPosition({
        top: rect.top + window.scrollY - 56,
        left: rect.left + rect.width / 2
      })
      setShowFloatingToolbar(true)
    } else {
      setShowFloatingToolbar(false)
    }
  }

  const isSelectionInsideDocEditor = (selection) => {
    if (!selection || selection.rangeCount === 0) return false
    const node = selection.anchorNode
    if (!node) return false
    const host = docEditorRef.current
    if (!host) return false
    return host.contains(node)
  }

  useEffect(() => {
    if (mode !== 'document') return

    let timeoutId = null

    const onSelectionChange = () => {
      // Debounce para evitar problemas de rendimiento
      if (timeoutId) clearTimeout(timeoutId)
      
      timeoutId = setTimeout(() => {
        const selection = window.getSelection()
        if (!isSelectionInsideDocEditor(selection)) {
          setShowFloatingToolbar(false)
          return
        }

        const text = selection?.toString() || ''
        if (!text.trim() || text.length < 1) {
          setShowFloatingToolbar(false)
          return
        }

        try {
          const range = selection.getRangeAt(0)
          const rect = range.getBoundingClientRect()

          setSelectedText({ start: 0, end: 0, blockId: 'document', text })
          setToolbarPosition({
            top: rect.top + window.scrollY - 60,
            left: rect.left + rect.width / 2
          })
          setShowFloatingToolbar(true)
        } catch (e) {
          // Si hay error en getBoundingClientRect, ignorar
          console.warn('Error getting selection rect:', e)
          setShowFloatingToolbar(false)
        }
      }, 100) // Pequeño delay para estabilidad
    }

    document.addEventListener('selectionchange', onSelectionChange)
    return () => {
      document.removeEventListener('selectionchange', onSelectionChange)
      if (timeoutId) clearTimeout(timeoutId)
    }
  }, [mode])

  /**
   * Detecta automáticamente el tipo de contenido al pegar
   */
  const handlePaste = (e) => {
    e.preventDefault()
    const text = e.clipboardData.getData('text/plain')
    
    if (!text.trim()) return

    // Parsear el texto pegado en bloques
    const parsedBlocks = parseTextToBlocks(text)
    
    // Agregar bloques al final (con historial)
    const next = [...blocks, ...parsedBlocks]
    setBlocksWithHistory(next)
  }

  const blocksToHtml = (blocksToRender) => {
    const esc = (s) => String(s || '')
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')

    const inline = (s) => {
      const t = esc(s)
        .replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>')
        .replace(/\*(.+?)\*/g, '<em>$1</em>')
      return t.replace(/\n/g, '<br/>')
    }

    const html = []
    let sectionCounter = 0

    const push = (h) => html.push(h)
    const listItems = []
    const flushList = () => {
      if (!listItems.length) return
      push(`<ul class="my-8 space-y-4">${listItems.join('')}</ul>`)
      listItems.length = 0
    }

    for (const b of blocksToRender || []) {
      const type = b?.type
      const content = String(b?.content || '').trim()
      if (!content && type !== 'questions') continue

      if (type === 'list') {
        listItems.push(`<li class="flex gap-4 items-start"><span class="mt-2.5 h-2.5 w-2.5 rounded-full bg-gradient-to-br from-purple-400 to-fuchsia-500 flex-shrink-0 shadow-lg shadow-purple-500/50"></span><div class="text-white/80 text-lg leading-relaxed">${inline(content)}</div></li>`)
        continue
      }

      flushList()

      if (type === 'heading') {
        sectionCounter++
        const level = b?.level || 'h2'
        const sectionNum = String(sectionCounter).padStart(2, '0')
        
        // Estilo con caja y número de sección como en el artículo final
        push(
          `<div class="mb-12 mt-16 relative bg-gradient-to-br from-white/5 to-white/[0.02] backdrop-blur-sm border border-white/10 rounded-2xl p-8 overflow-hidden" data-section="${sectionCounter}">` +
          `<div class="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-purple-500 via-fuchsia-500 to-purple-500"></div>` +
          `<div class="inline-flex items-center gap-2 mb-4 px-4 py-1.5 bg-purple-500/10 border border-purple-500/30 rounded-full">` +
          `<span class="text-xs font-mono text-purple-300 tracking-wider">SECCIÓN ${sectionNum}</span>` +
          `</div>` +
          `<h2 class="text-3xl lg:text-4xl font-light text-white leading-tight">${inline(content)}</h2>` +
          `</div>`
        )
        continue
      }

      if (type === 'highlight') {
        // Cita destacada con autor
        const hasAuthor = content.includes('—') || content.includes('–')
        if (hasAuthor) {
          const parts = content.split(/[—–]/)
          const quote = parts[0]?.trim() || content
          const author = parts[1]?.trim() || ''
          
          push(
            `<div class="my-16 relative bg-gradient-to-br from-purple-500/15 via-fuchsia-500/10 to-purple-500/15 backdrop-blur-xl border-2 border-purple-500/30 rounded-3xl p-10 lg:p-12 overflow-hidden shadow-2xl shadow-purple-500/20">` +
            `<div class="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-purple-500/20 to-fuchsia-500/20 rounded-bl-full"></div>` +
            `<div class="absolute bottom-0 left-0 w-32 h-32 bg-gradient-to-tr from-fuchsia-500/20 to-purple-500/20 rounded-tr-full"></div>` +
            `<div class="absolute top-8 left-8 text-6xl text-purple-400/30 font-serif leading-none">"</div>` +
            `<blockquote class="relative text-2xl lg:text-3xl text-white font-light italic leading-relaxed mb-6 pl-8">${inline(quote)}</blockquote>` +
            `<div class="h-px bg-gradient-to-r from-transparent via-purple-400/30 to-transparent mb-4"></div>` +
            `<cite class="block text-sm text-purple-300/80 not-italic font-normal tracking-wide">— ${inline(author)}</cite>` +
            `</div>`
          )
        } else {
          push(`<div class="my-10 rounded-3xl border-2 border-purple-500/30 bg-gradient-to-br from-purple-500/15 via-fuchsia-500/10 to-purple-500/15 p-10 shadow-2xl shadow-purple-500/20"><p class="text-xl md:text-2xl text-white font-light italic leading-relaxed tracking-wide">${inline(content)}</p></div>`)
        }
        continue
      }

      if (type === 'questions') {
        const title = String(b?.title || '❓ Preguntas psicoanalíticas').trim() || '❓ Preguntas psicoanalíticas'
        const items = String(b?.content || '')
          .split('\n')
          .map((l) => String(l || '').trim())
          .filter(Boolean)

        const li = items
          .map((q) => `<li class="flex gap-4 items-start text-white/85"><span class="mt-2.5 h-2.5 w-2.5 rounded-full bg-gradient-to-br from-fuchsia-400 to-purple-500 flex-shrink-0 shadow-lg shadow-fuchsia-500/50"></span><div class="text-lg leading-relaxed">${inline(q)}</div></li>`)
          .join('')

        push(
          `<section data-rte-type="questions" class="my-12 rounded-3xl border-2 border-purple-500/30 bg-gradient-to-br from-purple-500/15 via-fuchsia-500/15 to-purple-500/15 p-10 shadow-2xl shadow-purple-500/20">` +
          `<h3 class="text-2xl md:text-3xl font-bold bg-gradient-to-r from-purple-300 via-fuchsia-300 to-purple-300 bg-clip-text text-transparent mb-6" data-rte-role="questions-title">${inline(title)}</h3>` +
          `<ul class="space-y-4" data-rte-role="questions-items">${li}</ul>` +
          `</section>`
        )
        continue
      }

      // paragraph
      push(`<p class="my-6 text-lg md:text-xl text-white/75 leading-relaxed tracking-wide">${inline(content)}</p>`)
    }

    flushList()
    return html.join('') || `<p class="text-white/40 text-xl italic">Escribe aquí o pega tu contenido…</p>`
  }

  const htmlToBlocks = (rootEl) => {
    if (!rootEl) return []
    const next = []

    const pushParagraph = (text) => {
      const t = String(text || '').replace(/\s+$/g, '').trim()
      if (!t) return
      next.push({ id: `block-${Date.now()}-${next.length}`, type: 'paragraph', content: t })
    }

    const children = Array.from(rootEl.children || [])
    for (const el of children) {
      const tag = el.tagName?.toLowerCase?.() || ''

      // Detectar sección con número (div con data-section)
      if (tag === 'div' && el.hasAttribute('data-section')) {
        const h2El = el.querySelector('h2')
        const t = String(h2El?.textContent || '').trim()
        if (t) next.push({ id: `block-${Date.now()}-${next.length}`, type: 'heading', level: 'h2', content: t })
        continue
      }

      // Detectar blockquote complejo (cita con autor)
      if (tag === 'div' && el.querySelector('blockquote')) {
        const quoteEl = el.querySelector('blockquote')
        const citeEl = el.querySelector('cite')
        let content = String(quoteEl?.textContent || '').trim()
        if (citeEl) {
          const author = String(citeEl.textContent || '').replace(/^[—–]\s*/, '').trim()
          content = content + '\n' + author
        }
        if (content) next.push({ id: `block-${Date.now()}-${next.length}`, type: 'highlight', content })
        continue
      }

      if (tag === 'h1' || tag === 'h2' || tag === 'h3') {
        const t = String(el.textContent || '').trim()
        if (t) next.push({ id: `block-${Date.now()}-${next.length}`, type: 'heading', level: tag === 'h1' ? 'h1' : tag === 'h2' ? 'h2' : 'h3', content: t })
        continue
      }

      if (tag === 'p') {
        pushParagraph(el.textContent)
        continue
      }

      if (tag === 'blockquote') {
        const t = String(el.textContent || '').trim()
        if (t) next.push({ id: `block-${Date.now()}-${next.length}`, type: 'highlight', content: t })
        continue
      }

      if (tag === 'ul' || tag === 'ol') {
        const lis = Array.from(el.querySelectorAll('li'))
        lis.forEach((li) => {
          const t = String(li.textContent || '').trim()
          if (t) next.push({ id: `block-${Date.now()}-${next.length}`, type: 'list', content: t })
        })
        continue
      }

      if (tag === 'section' && el.getAttribute('data-rte-type') === 'questions') {
        const titleEl = el.querySelector('[data-rte-role="questions-title"]')
        const title = String(titleEl?.textContent || 'Preguntas incómodas').trim() || 'Preguntas incómodas'
        const liEls = Array.from(el.querySelectorAll('li'))
        const items = liEls.map((li) => String(li.textContent || '').trim()).filter(Boolean)
        if (items.length) {
          next.push({
            id: `block-${Date.now()}-${next.length}`,
            type: 'questions',
            title,
            content: items.join('\n')
          })
        }
        continue
      }

      // fallback
      pushParagraph(el.textContent)
    }

    return next
  }

  const syncBlocksFromDocDom = (coalesceKey) => {
    const root = docEditorRef.current
    if (!root) return
    const parsed = htmlToBlocks(root)
    setBlocksWithHistory(parsed, { coalesceKey })
  }

  const isDocEditorFocused = () => {
    const host = docEditorRef.current
    if (!host) return false
    const active = document.activeElement
    return active ? host.contains(active) || active === host : false
  }

  // Seed / update document editor HTML without clobbering the caret while typing.
  useEffect(() => {
    if (mode !== 'document') {
      docSeededRef.current = false
      return
    }
    const host = docEditorRef.current
    if (!host) return

    const nextHtml = blocksToHtml(blocks)

    // Primera vez: seed inicial
    if (!docSeededRef.current) {
      host.innerHTML = nextHtml
      docSeededRef.current = true
      return
    }

    // NO actualizar el HTML si el usuario está escribiendo
    // El DOM del contentEditable es la fuente de verdad mientras edita
    // Solo actualizar si viene de fuera (ej: cambiar de artículo)
    const isFocused = isDocEditorFocused()
    if (!isFocused) {
      host.innerHTML = nextHtml
    }
    // Si está enfocado, NO tocar el HTML para evitar perder el cursor
  }, [mode, blocks])

  const handleDocInput = () => {
    // Limpiar timeout anterior
    if (docInputTimeoutRef.current) {
      clearTimeout(docInputTimeoutRef.current)
    }
    
    // Sincronizar con debounce para ver cambios en tiempo real sin loops
    docInputTimeoutRef.current = setTimeout(() => {
      syncBlocksFromDocDom('doc:typing')
    }, 500)
  }

  const handleDocPaste = () => {
    setTimeout(() => syncBlocksFromDocDom('doc:paste'), 0)
  }
  
  // Sincronizar bloques cuando pierde el foco (para guardar cambios)
  const handleDocBlur = () => {
    syncBlocksFromDocDom('doc:blur')
  }

  /**
   * Parser inteligente que detecta títulos, listas, párrafos, etc.
   */
  const parseTextToBlocks = (text) => {
    const lines = text.split('\n').map(l => l.replace(/\s+$/g, '')).filter(line => line.trim())
    const newBlocks = []

    const makeId = (index) => `block-${Date.now()}-${index}`

    const normalizeHeading = (s) => s.replace(/^#+\s+/, '').trim()

    const isMarkdownHeading = (s) => /^#{1,6}\s+/.test(s)
    const markdownHeadingLevel = (s) => {
      const m = s.match(/^(#{1,6})\s+/)
      const n = m ? m[1].length : 2
      if (n <= 1) return 'h1'
      if (n === 2) return 'h2'
      return 'h3'
    }

    const isNumberedHeading = (s) => /^(\d+|[IVXLCM]+)\.(\s+|$)/i.test(s)
    const stripNumberedHeadingPrefix = (s) => s.replace(/^(\d+|[IVXLCM]+)\.(\s+|$)/i, '').trim()

    const isListLine = (s) => /^([-*•]|\d+[\.)])\s+/.test(s)
    const stripListPrefix = (s) => s.replace(/^([-*•]|\d+[\.)])\s+/, '').trim()

    const isQuoteHighlight = (s) => /^".*"$/.test(s) || /^“.*”$/.test(s) || /^\*\*.*\*\*$/.test(s)

    const looksLikeHeadingByHeuristic = (s) => {
      // Short-ish, starts with capital or opening punctuation, not ending with '.', and not a list
      if (s.length >= 120) return false
      if (!/^[A-ZÁÉÍÓÚÑ¿¡]/.test(s)) return false
      if (s.endsWith('.')) return false
      if (isListLine(s)) return false
      return true
    }

    for (let index = 0; index < lines.length; index += 1) {
      const line = lines[index]
      const trimmed = line.trim()

      // Questions fenced block:
      // [[QUESTIONS:Title]]
      // question line 1
      // question line 2
      // [[/QUESTIONS]]
      const qOpen = trimmed.match(/^\[\[QUESTIONS(?::(.+))?\]\]$/i)
      if (qOpen) {
        const title = String(qOpen[1] || 'Preguntas incómodas').trim() || 'Preguntas incómodas'
        const bodyLines = []
        let j = index + 1
        for (; j < lines.length; j += 1) {
          const t = String(lines[j] || '').trim()
          if (/^\[\[\/QUESTIONS\]\]$/i.test(t)) break
          if (t) bodyLines.push(t)
        }

        if (bodyLines.length) {
          const cleaned = bodyLines
            .map((l) => l.replace(/^([-*•]|\d+[\.)])\s+/, '').trim())
            .filter(Boolean)

          newBlocks.push({
            id: makeId(index),
            type: 'questions',
            title,
            content: cleaned.join('\n')
          })
        }

        index = j // skip to closing
        continue
      }

      // Markdown headings from GPT (e.g., ## Title)
      if (isMarkdownHeading(trimmed)) {
        newBlocks.push({
          id: makeId(index),
          type: 'heading',
          level: markdownHeadingLevel(trimmed),
          content: normalizeHeading(trimmed)
        })
        return
      }

      // Numbered / roman headings like "I. Título" / "1. Título"
      if (isNumberedHeading(trimmed) && trimmed.length < 140) {
        const content = stripNumberedHeadingPrefix(trimmed)
        if (content) {
          newBlocks.push({
            id: makeId(index),
            type: 'heading',
            level: 'h2',
            content
          })
          return
        }
      }
      
      // Detectar títulos (líneas cortas, primera letra mayúscula, sin punto final)
      if (looksLikeHeadingByHeuristic(trimmed)) {
        
        // Determinar nivel de título por contexto
        const level = index === 0 ? 'h1' : 
                     trimmed.length < 50 ? 'h2' : 'h3'
        
        newBlocks.push({
          id: makeId(index),
          type: 'heading',
          level,
          content: trimmed
        })
      }
      // Detectar listas
      else if (isListLine(trimmed) || /^¿/.test(trimmed)) {
        newBlocks.push({
          id: makeId(index),
          type: 'list',
          content: /^¿/.test(trimmed) ? trimmed : stripListPrefix(trimmed)
        })
      }
      // Detectar highlights (texto entre asteriscos o comillas)
      else if (isQuoteHighlight(trimmed)) {
        newBlocks.push({
          id: makeId(index),
          type: 'highlight',
          content: trimmed.replace(/^\*\*|\*\*$|^"|"$|^“|”$/g, '')
        })
      }
      // Párrafo normal
      else {
        newBlocks.push({
          id: makeId(index),
          type: 'paragraph',
          content: trimmed
        })
      }

    }

    return newBlocks
  }

  /**
   * Agregar nuevo bloque vacío
   */
  const addBlock = (type = 'paragraph') => {
    const newBlock = {
      id: `block-${Date.now()}`,
      type,
      content: '',
      ...(type === 'questions' ? { title: 'Preguntas incómodas' } : null)
    }
    
    if (selectedBlockId) {
      // Insertar después del bloque seleccionado
      const index = blocks.findIndex(b => b.id === selectedBlockId)
      const newBlocks = [...blocks]
      newBlocks.splice(index + 1, 0, newBlock)
      setBlocksWithHistory(newBlocks)
    } else {
      setBlocksWithHistory([...blocks, newBlock])
    }

    setSelectedBlockId(newBlock.id)
  }

  /**
   * Actualizar contenido de un bloque
   */
  const updateBlock = (id, updates) => {
    const next = blocks.map(block =>
      block.id === id ? { ...block, ...updates } : block
    )
    const isTyping = Object.prototype.hasOwnProperty.call(updates || {}, 'content')
    setBlocksWithHistory(next, isTyping ? { coalesceKey: `edit:${id}` } : undefined)
  }

  /**
   * Eliminar bloque
   */
  const deleteBlock = (id) => {
    setBlocksWithHistory(blocks.filter(block => block.id !== id))
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
    setBlocksWithHistory(newBlocks)
  }

  const applyInlineWrap = (content, start, end, wrapper) => {
    const before = content.slice(0, start)
    const middle = content.slice(start, end)
    const after = content.slice(end)
    return before + wrapper + middle + wrapper + after
  }

  const splitBlockBySelection = (block, start, end, middleBlock) => {
    const content = String(block.content || '')
    const before = content.slice(0, start).trim()
    const middle = content.slice(start, end).trim()
    const after = content.slice(end).trim()
    const out = []

    if (before) out.push({ ...block, id: `block-${Date.now()}-a`, type: 'paragraph', content: before })
    if (middle) out.push({ ...middleBlock, id: `block-${Date.now()}-m`, content: middle })
    if (after) out.push({ ...block, id: `block-${Date.now()}-b`, type: 'paragraph', content: after })

    return out
  }

  const applyFormat = (action) => {
    const { blockId, start, end, text } = selectedText
    if (!blockId || start === end || !text) {
      setShowFloatingToolbar(false)
      return
    }

    if (mode === 'document' && selectedText.blockId === 'document') {
      const selection = window.getSelection()
      if (!isSelectionInsideDocEditor(selection)) {
        setShowFloatingToolbar(false)
        return
      }
      if (!selection || selection.rangeCount === 0) return
      const range = selection.getRangeAt(0)
      const text = selection.toString()

      if (action === 'bold') {
        document.execCommand?.('bold')
        syncBlocksFromDocDom('doc:format')
        setShowFloatingToolbar(false)
        return
      }

      if (action === 'italic') {
        document.execCommand?.('italic')
        syncBlocksFromDocDom('doc:format')
        setShowFloatingToolbar(false)
        return
      }

      const insertBlockElement = (el) => {
        range.deleteContents()
        range.insertNode(el)
        // Move caret after inserted element
        selection.removeAllRanges()
        const afterRange = document.createRange()
        afterRange.setStartAfter(el)
        afterRange.collapse(true)
        selection.addRange(afterRange)
      }

      if (action === 'heading') {
        // Contar las secciones actuales para auto-numerar
        const currentSections = docEditorRef.current?.querySelectorAll('[data-section]').length || 0
        const nextNum = currentSections + 1
        const sectionNum = String(nextNum).padStart(2, '0')
        
        const wrapper = document.createElement('div')
        wrapper.setAttribute('data-section', nextNum)
        wrapper.className = 'mb-12 mt-16 relative bg-gradient-to-br from-white/5 to-white/[0.02] backdrop-blur-sm border border-white/10 rounded-2xl p-8 overflow-hidden'
        
        const topBar = document.createElement('div')
        topBar.className = 'absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-purple-500 via-fuchsia-500 to-purple-500'
        
        const badge = document.createElement('div')
        badge.className = 'inline-flex items-center gap-2 mb-4 px-4 py-1.5 bg-purple-500/10 border border-purple-500/30 rounded-full'
        const badgeText = document.createElement('span')
        badgeText.className = 'text-xs font-mono text-purple-300 tracking-wider'
        badgeText.textContent = `SECCIÓN ${sectionNum}`
        badge.appendChild(badgeText)
        
        const h2 = document.createElement('h2')
        h2.className = 'text-3xl lg:text-4xl font-light text-white leading-tight'
        h2.textContent = text.replace(/\s+/g, ' ').trim()
        
        wrapper.appendChild(topBar)
        wrapper.appendChild(badge)
        wrapper.appendChild(h2)
        
        insertBlockElement(wrapper)
        syncBlocksFromDocDom('doc:format')
        setShowFloatingToolbar(false)
        return
      }

      if (action === 'highlight') {
        // Detectar si tiene autor (líneas múltiples donde la última es el autor)
        const lines = text.split('\n').map(l => l.trim()).filter(Boolean)
        const hasAuthor = lines.length > 1 && lines[lines.length - 1].length < 50
        
        const wrapper = document.createElement('div')
        wrapper.className = 'my-16 relative bg-gradient-to-br from-purple-500/15 via-fuchsia-500/10 to-purple-500/15 backdrop-blur-xl border-2 border-purple-500/30 rounded-3xl p-10 lg:p-12 overflow-hidden shadow-2xl shadow-purple-500/20'
        
        // Decoraciones
        const cornerA = document.createElement('div')
        cornerA.className = 'absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-purple-500/20 to-fuchsia-500/20 rounded-bl-full'
        const cornerB = document.createElement('div')
        cornerB.className = 'absolute bottom-0 left-0 w-32 h-32 bg-gradient-to-tr from-fuchsia-500/20 to-purple-500/20 rounded-tr-full'
        const quoteIcon = document.createElement('div')
        quoteIcon.className = 'absolute top-8 left-8 text-6xl text-purple-400/30 font-serif leading-none'
        quoteIcon.textContent = '"'
        
        const blockquote = document.createElement('blockquote')
        blockquote.className = 'relative text-2xl lg:text-3xl text-white font-light italic leading-relaxed mb-6 pl-8'
        blockquote.textContent = hasAuthor ? lines.slice(0, -1).join(' ') : text.trim()
        
        wrapper.appendChild(cornerA)
        wrapper.appendChild(cornerB)
        wrapper.appendChild(quoteIcon)
        wrapper.appendChild(blockquote)
        
        if (hasAuthor) {
          const divider = document.createElement('div')
          divider.className = 'h-px bg-gradient-to-r from-transparent via-purple-400/30 to-transparent mb-4'
          const cite = document.createElement('cite')
          cite.className = 'block text-sm text-purple-300/80 not-italic font-normal tracking-wide'
          cite.textContent = '— ' + lines[lines.length - 1]
          wrapper.appendChild(divider)
          wrapper.appendChild(cite)
        }
        
        insertBlockElement(wrapper)
        syncBlocksFromDocDom('doc:format')
        setShowFloatingToolbar(false)
        return
      }

      if (action === 'questions') {
        const section = document.createElement('section')
        section.setAttribute('data-rte-type', 'questions')
        section.className = 'my-12 rounded-3xl border-2 border-purple-500/30 bg-gradient-to-br from-purple-500/15 via-fuchsia-500/15 to-purple-500/15 p-10 shadow-2xl shadow-purple-500/20'

        const title = document.createElement('h3')
        title.setAttribute('data-rte-role', 'questions-title')
        title.className = 'text-2xl md:text-3xl font-bold bg-gradient-to-r from-purple-300 via-fuchsia-300 to-purple-300 bg-clip-text text-transparent mb-6'
        title.textContent = '❓ Preguntas psicoanalíticas'

        const ul = document.createElement('ul')
        ul.setAttribute('data-rte-role', 'questions-items')
        ul.className = 'space-y-4'

        String(text || '')
          .split('\n')
          .map((l) => String(l || '').trim())
          .filter(Boolean)
          .forEach((q) => {
            const li = document.createElement('li')
            li.className = 'flex gap-4 items-start text-white/85'
            const dot = document.createElement('span')
            dot.className = 'mt-2.5 h-2.5 w-2.5 rounded-full bg-gradient-to-br from-fuchsia-400 to-purple-500 flex-shrink-0 shadow-lg shadow-fuchsia-500/50'
            const div = document.createElement('div')
            div.className = 'text-lg leading-relaxed'
            div.textContent = q
            li.appendChild(dot)
            li.appendChild(div)
            ul.appendChild(li)
          })

        section.appendChild(title)
        section.appendChild(ul)
        insertBlockElement(section)
        syncBlocksFromDocDom('doc:format')
        setShowFloatingToolbar(false)
        return
      }

      setShowFloatingToolbar(false)
      return
    }

    const index = blocks.findIndex(b => b.id === blockId)
    if (index === -1) return
    const block = blocks[index]
    const content = String(block.content || '')

    // Heading / Highlight should look like the final blog: split into blocks
    if (action === 'heading') {
      const replacement = splitBlockBySelection(block, start, end, { type: 'heading', level: 'h2' })
      const next = [...blocks.slice(0, index), ...replacement, ...blocks.slice(index + 1)]
      setBlocksWithHistory(next)
      setShowFloatingToolbar(false)
      return
    }

    if (action === 'highlight') {
      const replacement = splitBlockBySelection(block, start, end, { type: 'highlight' })
      const next = [...blocks.slice(0, index), ...replacement, ...blocks.slice(index + 1)]
      setBlocksWithHistory(next)
      setShowFloatingToolbar(false)
      return
    }

    if (action === 'questions') {
      const replacement = splitBlockBySelection(block, start, end, { type: 'questions', title: 'Preguntas incómodas' })
      const next = [...blocks.slice(0, index), ...replacement, ...blocks.slice(index + 1)]
      setBlocksWithHistory(next)
      setShowFloatingToolbar(false)
      return
    }

    // Inline markers (will be rendered in the final blog once we add markdown parsing)
    if (action === 'bold') {
      const nextContent = applyInlineWrap(content, start, end, '**')
      updateBlock(blockId, { content: nextContent })
      setShowFloatingToolbar(false)
      return
    }

    if (action === 'italic') {
      const nextContent = applyInlineWrap(content, start, end, '*')
      updateBlock(blockId, { content: nextContent })
      setShowFloatingToolbar(false)
      return
    }

    // Link is intentionally a no-op (no extra UI)
    setShowFloatingToolbar(false)
  }

  return (
    <div ref={editorRootRef} className="space-y-4" onKeyDownCapture={handleKeyDownCapture}>
      {/* Barra Flotante de Formateo (tipo Medium) */}
      <AnimatePresence>
        {showFloatingToolbar && (
          <FloatingFormatToolbar
            position={toolbarPosition}
            onClose={() => setShowFloatingToolbar(false)}
            onFormat={applyFormat}
          />
        )}
      </AnimatePresence>

      {/* Área de pegado inicial */}
      {mode !== 'document' && blocks.length === 0 && (
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
      {mode !== 'document' && blocks.length > 0 && (
        <div className="rounded-2xl border border-white/10 bg-white/[0.03] backdrop-blur-sm shadow-2xl overflow-hidden">
          <div className="p-2 md:p-3">
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
                  onSelectionChange={(textareaEl) => updateSelectionFromTextarea(block.id, textareaEl)}
                  canMoveUp={index > 0}
                  canMoveDown={index < blocks.length - 1}
                />
              ))}
            </AnimatePresence>
          </div>
        </div>
      )}

      {/* Botón para agregar más bloques */}
      {mode !== 'document' && showAddBlockButton && blocks.length > 0 && (
        <BlockTypeSelector onSelect={addBlock} />
      )}

      {/* Modo documento (selección continua) */}
      {mode === 'document' && (
        <div className="rounded-3xl border-2 border-purple-500/20 bg-gradient-to-br from-gray-900/80 via-black/80 to-gray-900/80 backdrop-blur-xl shadow-2xl shadow-purple-500/10 overflow-hidden">
          <div className="p-8 md:p-12">
            <div className="mb-6 flex items-center gap-3 pb-6 border-b border-purple-500/20">
              <Eye className="w-5 h-5 text-purple-400" />
              <span className="text-purple-300 font-medium">Vista Previa en Vivo</span>
              <span className="text-gray-500 text-sm">- Se ve exactamente como el artículo final</span>
            </div>
            <div
              ref={docEditorRef}
              contentEditable
              suppressContentEditableWarning
              onInput={handleDocInput}
              onPaste={handleDocPaste}
              onBlur={handleDocBlur}
              className="min-h-[500px] outline-none text-white selection:bg-purple-500/40 selection:text-white focus:ring-0 max-w-4xl mx-auto"
              style={{
                caretColor: '#a78bfa'
              }}
            />
            <div className="mt-8 pt-6 border-t border-purple-500/20 flex items-start gap-3 text-sm text-gray-400">
              <Sparkles className="w-4 h-4 text-purple-400 mt-0.5 flex-shrink-0" />
              <div>
                <p className="mb-2"><strong className="text-purple-300">Tip:</strong> Selecciona texto para usar la barra de formato flotante</p>
                <p className="text-xs text-gray-500">• Usa **texto** para negrita • Usa *texto* para cursiva • Los títulos y listas se detectan automáticamente</p>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

function AutoGrowTextarea({ value, onChange, className, style, inputRef, ...props }) {
  const textareaRef = useRef(null)

  const resize = () => {
    const el = textareaRef.current
    if (!el) return
    el.style.height = '0px'
    el.style.height = el.scrollHeight + 'px'
  }

  useLayoutEffect(() => {
    resize()
  }, [value])

  return (
    <textarea
      ref={(node) => {
        textareaRef.current = node
        if (typeof inputRef === 'function') inputRef(node)
        else if (inputRef) inputRef.current = node
      }}
      value={value}
      onChange={onChange}
      rows={1}
      onInput={resize}
      className={className}
      style={{ overflow: 'hidden', ...style }}
      {...props}
    />
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
  onSelectionChange,
  canMoveUp,
  canMoveDown 
}) {
  const [showToolbar, setShowToolbar] = useState(false)
  const textareaElRef = useRef(null)

  const handleContentChange = (e) => {
    onUpdate({ content: e.target.value })
  }

  const changeType = (newType) => {
    onUpdate({ type: newType })
    setShowToolbar(false)
  }

  // Estilos según tipo de bloque
  const getInputClasses = () => {
    const base = "w-full bg-transparent text-white placeholder-gray-500 focus:outline-none resize-none border-0 shadow-none outline-none ring-0 focus:ring-0 overflow-hidden"
    
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
      case 'questions':
        return `${base} text-gray-300 leading-relaxed pl-6`
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
      case 'questions':
        return AlertCircle
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
      className={`group relative px-4 py-3 transition-all cursor-text rounded-xl ${
        isSelected
          ? 'bg-purple-500/10 ring-1 ring-purple-500/30'
          : 'bg-transparent hover:bg-white/[0.03]'
      }`}
    >
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
      <AutoGrowTextarea
        value={block.content}
        onChange={handleContentChange}
        inputRef={textareaElRef}
        placeholder={
          block.type === 'heading' ? 'Escribe un título...' :
          block.type === 'highlight' ? 'Texto destacado...' :
          block.type === 'questions' ? 'Escribe una pregunta por línea...' :
          'Escribe aquí...'
        }
        className={getInputClasses()}
        onMouseUp={() => onSelectionChange?.(textareaElRef.current)}
        onKeyUp={() => onSelectionChange?.(textareaElRef.current)}
        onFocus={() => {
          onSelect?.()
          onSelectionChange?.(textareaElRef.current)
        }}
      />

      {/* Prefijo para listas */}
      {(block.type === 'list' || block.type === 'questions') && (
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
    { type: 'questions', icon: AlertCircle, label: 'Preguntas' },
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

/**
 * Barra Flotante de Formateo (tipo Medium)
 * Aparece al seleccionar texto
 */
function FloatingFormatToolbar({ position, onClose, onFormat }) {
  const formatOptions = [
    { icon: Bold, label: 'Negrita', action: 'bold' },
    { icon: Italic, label: 'Cursiva', action: 'italic' },
    { icon: Heading2, label: 'Título', action: 'heading' },
    { icon: Sparkles, label: 'Destacar', action: 'highlight' },
    { icon: AlertCircle, label: 'Preguntas', action: 'questions' },
    { icon: LinkIcon, label: 'Enlace', action: 'link' },
  ]

  return (
    <motion.div
      initial={{ opacity: 0, y: -10, scale: 0.9 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, y: -10, scale: 0.9 }}
      transition={{ duration: 0.2 }}
      style={{
        position: 'fixed',
        top: `${position.top}px`,
        left: `${position.left}px`,
        transform: 'translateX(-50%)',
        zIndex: 9999
      }}
      className="bg-gray-900 border border-gray-700 rounded-xl shadow-2xl overflow-hidden"
    >
      <div className="flex items-center gap-1 p-2">
        {formatOptions.map(({ icon: Icon, label, action }) => (
          <button
            key={action}
            onClick={() => onFormat?.(action)}
            title={label}
            className="p-2.5 rounded-lg hover:bg-white/10 text-gray-300 hover:text-white transition-all group"
          >
            <Icon className="w-4 h-4" />
          </button>
        ))}
      </div>
    </motion.div>
  )
}
