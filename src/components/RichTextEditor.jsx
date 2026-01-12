import { useState, useRef, useEffect, useLayoutEffect, useCallback } from 'react'
import { createPortal } from 'react-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  Type, Heading1, Heading2, Heading3, Bold, Italic, 
  List, ListOrdered, Quote, Sparkles, AlertCircle,
  Image as ImageIcon, Plus, Trash2, MoveUp, MoveDown,
  Eye, Code, Link as LinkIcon
} from 'lucide-react'
import { getAccentPreset } from '../utils/accentPresets'

/**
 * RichTextEditor con detección automática de contenido de GPT
 * Permite pegar texto y automáticamente detecta títulos, párrafos, listas, etc.
 */
export default function RichTextEditor({
  initialContent = [],
  onChange,
  showAddBlockButton = true,
  mode = 'blocks',
  accent = 'purple',
  documentVariant = 'editor',
  sectionIcon = 'crown'
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
  const docSelectionRangeRef = useRef(null)
  const toolbarInteractingRef = useRef(false)
  const toolbarInteractTimeoutRef = useRef(null)

  const DOC_PLACEHOLDER_TEXT = 'Escribe aquí o pega tu contenido…'
  const QUESTIONS_MARKER_CLASS = 'marker:text-emerald-400'

  const SECTION_ICON_PATHS = {
    crown: [
      'M3 6l3 6 6-9 6 9 3-6v14H3z',
      'M3 20h18'
    ],
    moon: [
      'M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z'
    ],
    sparkles: [
      'M12 2l1.7 5.8L19.5 9l-5.8 1.7L12 16.5l-1.7-5.8L4.5 9l5.8-1.7L12 2z',
      'M4 14l.8 2.7L7.5 17.5l-2.7.8L4 21l-.8-2.7L.5 17.5l2.7-.8L4 14z'
    ],
    diamond: [
      'M12 2l7 10-7 10-7-10z'
    ],
    star: [
      'M12 2l3 7 7 .6-5.3 4.6 1.7 7.2L12 17.8 5.6 21.4l1.7-7.2L2 9.6 9 9z'
    ],
    bookmark: [
      'M6 2h12v20l-6-4-6 4z'
    ]
  }

  const normalizeSectionIconKey = (raw) => {
    const t = String(raw || '').trim()
    const migrate = {
      // previous emoji/symbol variants
      '👑': 'crown',
      '♛': 'crown',
      '⚜': 'crown',
      '⚜️': 'crown',
      '☾': 'moon',
      '✦': 'star',
      '✧': 'sparkles',
      '⟡': 'sparkles',
      '❖': 'diamond',
      '⬦': 'diamond',
      '⬥': 'diamond'
    }

    const key = migrate[t] || t
    return Object.prototype.hasOwnProperty.call(SECTION_ICON_PATHS, key) ? key : 'crown'
  }

  const createSectionIconSvgEl = (iconKey) => {
    const key = normalizeSectionIconKey(iconKey)
    const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg')
    svg.setAttribute('viewBox', '0 0 24 24')
    svg.setAttribute('fill', 'none')
    svg.setAttribute('stroke', 'currentColor')
    svg.setAttribute('stroke-width', '2')
    svg.setAttribute('stroke-linecap', 'round')
    svg.setAttribute('stroke-linejoin', 'round')
    svg.setAttribute('width', '16')
    svg.setAttribute('height', '16')
    ;(SECTION_ICON_PATHS[key] || SECTION_ICON_PATHS.crown).forEach((d) => {
      const path = document.createElementNS('http://www.w3.org/2000/svg', 'path')
      path.setAttribute('d', d)
      svg.appendChild(path)
    })
    return svg
  }

  const sectionIconHtml = (key, escAttr) => {
    const k = normalizeSectionIconKey(key)
    const paths = SECTION_ICON_PATHS[k] || SECTION_ICON_PATHS.crown
    return (
      `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" ` +
      `stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" ` +
      `width="16" height="16" aria-hidden="true">` +
      paths.map((d) => `<path d="${escAttr(d)}"></path>`).join('') +
      `</svg>`
    )
  }

  const accentPreset = getAccentPreset(accent)

  const updateToolbarFromDocSelection = (selection) => {
    if (mode !== 'document') return
    const sel = selection || window.getSelection?.()
    if (!sel || sel.rangeCount === 0) {
      setShowFloatingToolbar(false)
      return
    }

    if (!isSelectionInsideDocEditor(sel)) {
      setShowFloatingToolbar(false)
      return
    }

    const text = sel.toString?.() || ''
    if (!text || text.trim().length < 1) {
      setShowFloatingToolbar(false)
      return
    }

    try {
      const range = sel.getRangeAt(0)
      // Save selection for toolbar actions (clicking toolbar can collapse the selection)
      docSelectionRangeRef.current = range.cloneRange()
      let rect = range.getBoundingClientRect()

      // Some browsers return a 0x0 rect for multi-line selections; fallback to first client rect
      if ((!rect || (!rect.width && !rect.height)) && range.getClientRects) {
        const rects = range.getClientRects()
        if (rects && rects.length) rect = rects[0]
      }

      if (!rect) {
        setShowFloatingToolbar(false)
        return
      }

      // Toolbar is rendered via portal + position:fixed => use viewport coordinates
      const margin = 12
      let top = rect.top - 60
      if (top < margin) top = rect.bottom + 14
      let left = rect.left + rect.width / 2
      left = Math.max(margin, Math.min(left, window.innerWidth - margin))

      setSelectedText({ start: 0, end: 0, blockId: 'document', text })
      setToolbarPosition({ top, left })
      setShowFloatingToolbar(true)
    } catch {
      setShowFloatingToolbar(false)
    }
  }

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

  // Undo function
  const undo = useCallback(() => {
    const state = historyRef.current
    if (state.index <= 0) return
    state.index -= 1
    const prevBlocks = state.stack[state.index] || []
    setBlocks(prevBlocks)
    // Actualizar el HTML en modo document
    if (mode === 'document' && docEditorRef.current) {
      docEditorRef.current.innerHTML = blocksToHtml(prevBlocks)
    }
  }, [mode, blocksToHtml])

  // Redo function
  const redo = useCallback(() => {
    const state = historyRef.current
    if (state.index >= state.stack.length - 1) return
    state.index += 1
    const nextBlocks = state.stack[state.index] || []
    setBlocks(nextBlocks)
    // Actualizar el HTML en modo document
    if (mode === 'document' && docEditorRef.current) {
      docEditorRef.current.innerHTML = blocksToHtml(nextBlocks)
    }
  }, [mode, blocksToHtml])

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
    const isMac = navigator.platform.toLowerCase().includes('mac')
    const isMod = isMac ? e.metaKey : e.ctrlKey
    if (!isMod) return

    const key = String(e.key || '').toLowerCase()
    const isUndo = key === 'z' && !e.shiftKey
    const isRedo = key === 'y' || (key === 'z' && e.shiftKey)
    if (!isUndo && !isRedo) return

    // Document mode: use our blocks history so Ctrl+Z also undoes structural conversions
    // (sections/highlights/questions/subsections), not only typed text.
    if (mode === 'document') {
      const host = docEditorRef.current
      if (!host) return

      const sel = window.getSelection?.()
      const selectionInside = (() => {
        try {
          if (!sel || sel.rangeCount === 0) return false
          const range = sel.getRangeAt(0)
          const common = range?.commonAncestorContainer || null
          return (
            (common && host.contains(common)) ||
            (sel.anchorNode && host.contains(sel.anchorNode)) ||
            (sel.focusNode && host.contains(sel.focusNode))
          )
        } catch {
          return false
        }
      })()

      const active = document.activeElement
      const focusedInside = !!(active && (host === active || host.contains(active)))

      // Only handle if user is in this editor context
      if (!selectionInside && !focusedInside) return

      e.preventDefault()

      // Cancel any pending debounced sync
      if (docInputTimeoutRef.current) {
        clearTimeout(docInputTimeoutRef.current)
        docInputTimeoutRef.current = null
      }

      const state = historyRef.current
      if (isUndo) {
        if (state.index <= 0) return
        state.index -= 1
      } else {
        if (state.index >= state.stack.length - 1) return
        state.index += 1
      }

      const snapshot = state.stack[state.index] || []
      setBlocks(snapshot)
      host.innerHTML = blocksToHtml(snapshot)
      docSeededRef.current = true
      applyAccentClassesInPlace(host)
      return
    }

    // En modo blocks: si el usuario está escribiendo en un input/textarea,
    // dejar el undo/redo nativo del navegador.
    const targetTag = String(e?.target?.tagName || '').toLowerCase()
    if (targetTag === 'textarea' || targetTag === 'input') {
      return
    }

    // Only if the event is inside this editor
    if (editorRootRef.current && !editorRootRef.current.contains(e.target)) return

    e.preventDefault()

    const state = historyRef.current
    if (isUndo) {
      if (state.index <= 0) return
      state.index -= 1
      const prevBlocks = state.stack[state.index] || []
      setBlocks(prevBlocks)
      // Actualizar el HTML en modo document
      if (mode === 'document' && docEditorRef.current) {
        docEditorRef.current.innerHTML = blocksToHtml(prevBlocks)
      }
      return
    }

    if (isRedo) {
      if (state.index >= state.stack.length - 1) return
      state.index += 1
      const nextBlocks = state.stack[state.index] || []
      setBlocks(nextBlocks)
      // Actualizar el HTML en modo document
      if (mode === 'document' && docEditorRef.current) {
        docEditorRef.current.innerHTML = blocksToHtml(nextBlocks)
      }
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
        top: rect.top - 56,
        left: rect.left + rect.width / 2
      })
      setShowFloatingToolbar(true)
    } else {
      setShowFloatingToolbar(false)
    }
  }

  const isSelectionInsideDocEditor = (selection) => {
    if (!selection || selection.rangeCount === 0) return false
    const host = docEditorRef.current
    if (!host) return false

    const anchor = selection.anchorNode
    const focus = selection.focusNode

    let common = null
    try {
      const range = selection.getRangeAt(0)
      common = range?.commonAncestorContainer || null
    } catch {
      common = null
    }

    const anyContains = (node) => {
      if (!node) return false
      return host.contains(node)
    }

    return anyContains(common) || anyContains(anchor) || anyContains(focus)
  }

  useEffect(() => {
    if (mode !== 'document') return

    let timeoutId = null

    const onSelectionChange = () => {
      // Debounce para evitar problemas de rendimiento
      if (timeoutId) clearTimeout(timeoutId)
      
      timeoutId = setTimeout(() => {
        if (toolbarInteractingRef.current) return
        updateToolbarFromDocSelection(window.getSelection())
      }, 50) // Reducido a 50ms para respuesta más rápida
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

  function blocksToHtml(blocksToRender) {
    const esc = (s) => String(s || '')
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')

    const escAttr = (s) => String(s || '')
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#39;')

    const inline = (s) => {
      const t = esc(s)
        .replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>')
        .replace(/\*(.+?)\*/g, '<em>$1</em>')

      // Markdown-style links: [text](url)
      const withLinks = t.replace(/\[([^\]]+?)\]\(([^\s)]+)\)/g, (_m, label, href) => {
        const safeHref = escAttr(href)
        return `<a href="${safeHref}" target="_blank" rel="noopener noreferrer" class="underline underline-offset-4">${label}</a>`
      })

      return withLinks.replace(/\n/g, '<br/>')
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
        listItems.push(
          `<li class="flex gap-4 items-start">` +
          `<span class="mt-2.5 h-2.5 w-2.5 rounded-full bg-gradient-to-br ${accentPreset.questionsDot} flex-shrink-0 shadow-lg shadow-black/30"></span>` +
          `<div class="text-white/80 text-lg leading-relaxed">${inline(content)}</div>` +
          `</li>`
        )
        continue
      }

      flushList()

      if (type === 'heading') {
        sectionCounter++
        const level = b?.level || 'h2'
        const sectionNum = String(sectionCounter).padStart(2, '0')
        const iconKey = normalizeSectionIconKey(b?.icon || sectionIcon)
        const tocIdAttr = mode === 'document' && documentVariant === 'article'
          ? ` id="section-${sectionCounter - 1}"`
          : ''
        
        // Estilo con caja y número de sección como en el artículo final
        push(
          `<div${tocIdAttr} class="mb-12 mt-16 relative bg-gradient-to-br from-white/5 to-white/[0.02] backdrop-blur-sm border border-white/10 rounded-2xl p-8 overflow-hidden" data-section="${sectionCounter}" data-rte-type="heading">` +
          `<div data-rte-role="section-topbar" contenteditable="false" class="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r ${accentPreset.headingTopBar}"></div>` +
          `<div data-rte-role="section-badge" contenteditable="false" class="inline-flex items-center gap-2 mb-4 px-4 py-1.5 ${accentPreset.badgeBg} border ${accentPreset.badgeBorder} rounded-full">` +
          `<span data-rte-role="section-icon" data-icon="${escAttr(iconKey)}" contenteditable="false" class="inline-flex items-center justify-center text-white/80">${sectionIconHtml(iconKey, escAttr)}</span>` +
          `<span data-rte-role="section-badge-text" contenteditable="false" class="text-xs font-mono ${accentPreset.badgeText} tracking-wider">SECCIÓN ${sectionNum}</span>` +
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
            `<div data-rte-type="highlight" class="my-16 relative bg-gradient-to-br ${accentPreset.highlightBg} backdrop-blur-xl border-2 ${accentPreset.highlightBorder} rounded-3xl p-10 lg:p-12 overflow-hidden shadow-2xl shadow-black/30">` +
            `<div class="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br ${accentPreset.highlightCornerA} rounded-bl-full"></div>` +
            `<div class="absolute bottom-0 left-0 w-32 h-32 bg-gradient-to-tr ${accentPreset.highlightCornerB} rounded-tr-full"></div>` +
            `<div class="absolute top-8 left-8 text-6xl ${accentPreset.highlightQuote} font-serif leading-none">"</div>` +
            `<blockquote class="relative text-2xl lg:text-3xl text-white font-light italic leading-relaxed mb-6 pl-8">${inline(quote)}</blockquote>` +
            `<div class="h-px bg-gradient-to-r from-transparent ${accentPreset.highlightDivider} to-transparent mb-4"></div>` +
            `<cite class="block text-sm ${accentPreset.highlightCite}/80 not-italic font-normal tracking-wide">— ${inline(author)}</cite>` +
            `</div>`
          )
        } else {
          push(
            `<div class="my-10 rounded-3xl border-2 ${accentPreset.highlightBorder} bg-gradient-to-br ${accentPreset.highlightBg} p-10 shadow-2xl shadow-black/30">` +
            `<p class="text-xl md:text-2xl text-white font-light italic leading-relaxed tracking-wide">${inline(content)}</p>` +
            `</div>`
          )
        }
        continue
      }

      if (type === 'title') {
        push(
          `<h1 data-rte-role="title" class="my-8 text-4xl md:text-5xl font-light text-white leading-tight">${inline(content)}</h1>`
        )
        continue
      }

      if (type === 'subtitle') {
        push(
          `<h2 data-rte-role="subtitle" class="my-6 text-xl md:text-2xl font-light text-white/70 leading-relaxed">${inline(content)}</h2>`
        )
        continue
      }

      if (type === 'questions') {
        const titleRaw = String(b?.title || 'Preguntas').trim() || 'Preguntas'
        let title = titleRaw.replace(/^❓\s*/, '').trim() || 'Preguntas'
        if (/^preguntas\s+(que\s+incomodan|incómodas)$/i.test(title)) title = 'Preguntas'
        const items = String(b?.content || '')
          .split('\n')
          .map((l) => String(l || '').trim())
          .filter(Boolean)

        const li = items
          .map((q) => `<li class="text-lg leading-relaxed text-white/85">${inline(q)}</li>`)
          .join('')

        push(
          `<section data-rte-type="questions" class="my-12 rounded-3xl border-2 ${accentPreset.questionsBorder} bg-gradient-to-br ${accentPreset.questionsBg} p-10 shadow-2xl shadow-black/30">` +
          `<div class="flex items-center gap-3 mb-6" data-rte-role="questions-header">` +
          `<span data-rte-role="questions-icon-box" class="inline-flex items-center justify-center w-9 h-9 rounded-xl bg-gradient-to-br ${accentPreset.questionsIconBg} border ${accentPreset.questionsIconBorder}">` +
          `<span data-rte-role="questions-icon" class="${accentPreset.questionsIcon} text-lg font-bold leading-none">?</span>` +
          `</span>` +
          `<h3 class="text-2xl md:text-3xl font-bold bg-gradient-to-r ${accentPreset.questionsTitle} bg-clip-text text-transparent" data-rte-role="questions-title">${inline(title)}</h3>` +
          `</div>` +
          `<ul class="space-y-3 pl-6 list-disc ${QUESTIONS_MARKER_CLASS}" data-rte-role="questions-items">${li}</ul>` +
          `</section>`
        )
        continue
      }

      if (type === 'reflection') {
        push(
          `<div data-rte-type="reflection" class="my-12 relative">` +
          `<div data-rte-role="reflection-bar" class="absolute -left-4 top-0 w-1 h-full bg-gradient-to-b ${accentPreset.quoteBar} rounded-full"></div>` +
          `<div class="pl-8 pr-4 py-1">` +
          `<p class="text-xl lg:text-2xl text-white/90 leading-relaxed font-light italic relative">` +
          `<span class="absolute -left-2 -top-1 text-5xl ${accentPreset.quoteMark} font-serif">"</span>` +
          `${inline(content)}` +
          `<span class="absolute -bottom-6 right-0 text-5xl ${accentPreset.quoteMark} font-serif">"</span>` +
          `</p>` +
          `</div>` +
          `</div>`
        )
        continue
      }

      if (type === 'subsection') {
        const number = String(b?.number || '01')
        const title = String(b?.title || 'Subtítulo')
        push(
          `<div data-rte-type="subsection" class="mb-8 relative bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-6 overflow-hidden group hover:border-white/30 transition-all">` +
          `<div data-rte-role="subsection-orb" class="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-purple-500/20 to-fuchsia-500/20 opacity-20 rounded-full blur-2xl group-hover:opacity-30 transition-opacity"></div>` +
          `<div class="relative z-10">` +
          `<div class="flex items-start gap-4 mb-4">` +
          `<span data-rte-role="subsection-number" class="text-6xl font-bold bg-gradient-to-br from-purple-500 to-fuchsia-500 bg-clip-text text-transparent opacity-50">${number}</span>` +
          `<div class="flex-1 pt-2">` +
          `<h3 class="text-2xl font-bold text-white mb-3">${inline(title)}</h3>` +
          `<p class="text-base text-white/70 leading-relaxed">${inline(content)}</p>` +
          `</div>` +
          `</div>` +
          `</div>` +
          `</div>`
        )
        continue
      }

      // paragraph
      push(`<p class="my-6 text-lg md:text-xl text-white/75 leading-relaxed tracking-wide">${inline(content)}</p>`)
    }

    flushList()
    return (
      html.join('') ||
      `<p data-rte-placeholder="1" class="text-white/40 text-xl italic">${DOC_PLACEHOLDER_TEXT}</p>`
    )
  }

  const htmlToBlocks = (rootEl) => {
    if (!rootEl) return []
    const next = []

    const extractInlineMarkedText = (node) => {
      if (!node) return ''

      // Text
      if (node.nodeType === 3) return String(node.nodeValue || '')

      // Element
      if (node.nodeType === 1) {
        const tag = String(node.tagName || '').toLowerCase()
        if (tag === 'br') return '\n'

        if (tag === 'a') {
          const inner = Array.from(node.childNodes || []).map(extractInlineMarkedText).join('')
          const href = String(node.getAttribute?.('href') || '')
          if (!href) return inner
          return `[${inner}](${href})`
        }

        const inner = Array.from(node.childNodes || []).map(extractInlineMarkedText).join('')
        if (!inner) return ''

        if (tag === 'strong' || tag === 'b') return `**${inner}**`
        if (tag === 'em' || tag === 'i') return `*${inner}*`

        return inner
      }

      return ''
    }

    const normalizeInlineText = (raw) => {
      const t = String(raw || '').replace(/\u00A0/g, ' ')
      return t.replace(/\s+$/g, '').trim()
    }

    const pushParagraph = (text) => {
      const t = normalizeInlineText(text)
      if (!t) return
      next.push({ id: `block-${Date.now()}-${next.length}`, type: 'paragraph', content: t })
    }

    const pushParagraphFromEl = (el) => {
      if (!el) return
      const t = normalizeInlineText(extractInlineMarkedText(el))
      if (!t) return
      next.push({ id: `block-${Date.now()}-${next.length}`, type: 'paragraph', content: t })
    }

    const children = Array.from(rootEl.children || [])
    for (const el of children) {
      const tag = el.tagName?.toLowerCase?.() || ''

      // Ignore placeholder
      if (tag === 'p' && el.getAttribute('data-rte-placeholder') === '1') {
        continue
      }

      // Heurística: si pegan el artículo "final" (sin data-rte-type), detectar un bloque de preguntas
      // por su título y lista interna.
      if ((tag === 'section' || tag === 'div') && !el.getAttribute('data-rte-type')) {
        const headingEl = el.querySelector('h2, h3, h4')
        const titleGuess = String(headingEl?.textContent || '').trim()
        const hasQuestionsWord = /preguntas/i.test(titleGuess)
        const liEls = Array.from(el.querySelectorAll('ul li'))
        const items = liEls.map((li) => String(li.textContent || '').trim()).filter(Boolean)
        if (hasQuestionsWord && items.length) {
          let cleanedTitle = titleGuess.replace(/^\??\s*/, '').trim() || 'Preguntas'
          if (/^preguntas\s+(que\s+incomodan|incómodas)$/i.test(cleanedTitle)) cleanedTitle = 'Preguntas'
          next.push({
            id: `block-${Date.now()}-${next.length}`,
            type: 'questions',
            title: cleanedTitle,
            content: items.join('\n')
          })
          continue
        }
      }

      // Detectar sección con número (div con data-section)
      if (tag === 'div' && el.hasAttribute('data-section')) {
        const h2El = el.querySelector('h2')
        const t = String(h2El?.textContent || '').trim()
        const iconEl = el.querySelector('[data-rte-role="section-icon"]')
        const iconRaw = String(iconEl?.getAttribute?.('data-icon') || iconEl?.textContent || '').trim()
        const iconKey = normalizeSectionIconKey(iconRaw || sectionIcon)
        if (t) {
          next.push({
            id: `block-${Date.now()}-${next.length}`,
            type: 'heading',
            level: 'h2',
            content: t,
            icon: iconKey || undefined
          })
        }
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

      if (tag === 'h1' && el.getAttribute('data-rte-role') === 'title') {
        const t = normalizeInlineText(extractInlineMarkedText(el))
        if (t) next.push({ id: `block-${Date.now()}-${next.length}`, type: 'title', content: t })
        continue
      }

      if (tag === 'h2' && el.getAttribute('data-rte-role') === 'subtitle') {
        const t = normalizeInlineText(extractInlineMarkedText(el))
        if (t) next.push({ id: `block-${Date.now()}-${next.length}`, type: 'subtitle', content: t })
        continue
      }

      if (tag === 'h1' || tag === 'h2' || tag === 'h3') {
        const t = normalizeInlineText(extractInlineMarkedText(el))
        if (t) next.push({ id: `block-${Date.now()}-${next.length}`, type: 'heading', level: tag === 'h1' ? 'h1' : tag === 'h2' ? 'h2' : 'h3', content: t })
        continue
      }

      if (tag === 'p') {
        pushParagraphFromEl(el)
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
          const t = normalizeInlineText(extractInlineMarkedText(li))
          if (t) next.push({ id: `block-${Date.now()}-${next.length}`, type: 'list', content: t })
        })
        continue
      }

      if (tag === 'section' && el.getAttribute('data-rte-type') === 'questions') {
        const titleEl = el.querySelector('[data-rte-role="questions-title"]')
        let title = String(titleEl?.textContent || 'Preguntas').trim() || 'Preguntas'
        if (/^preguntas\s+(que\s+incomodan|incómodas)$/i.test(title)) title = 'Preguntas'
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

      if (tag === 'div' && el.getAttribute('data-rte-type') === 'reflection') {
        const p = el.querySelector('p')
        const t = normalizeInlineText(extractInlineMarkedText(p))
        if (t) next.push({ id: `block-${Date.now()}-${next.length}`, type: 'reflection', content: t })
        continue
      }

      if (tag === 'div' && el.getAttribute('data-rte-type') === 'subsection') {
        const numberEl = el.querySelector('[data-rte-role="subsection-number"]')
        const number = String(numberEl?.textContent || '01').trim()
        const h3El = el.querySelector('h3')
        const title = String(h3El?.textContent || '').trim()
        const p = el.querySelector('p')
        const content = normalizeInlineText(extractInlineMarkedText(p))
        if (title || content) {
          next.push({ 
            id: `block-${Date.now()}-${next.length}`, 
            type: 'subsection', 
            number,
            title,
            content 
          })
        }
        continue
      }

      // fallback
      pushParagraphFromEl(el)
    }

    return next
  }

  const cleanupDocDom = (root) => {
    if (!root) return

    const isNodeEmpty = (node) => {
      if (!node) return true
      if (node.querySelector?.('img')) return false
      const text = String(node.textContent || '').replace(/\u00A0/g, ' ').trim()
      if (text) return false
      const html = String(node.innerHTML || '')
        .replace(/<br\s*\/?>/gi, '')
        .replace(/&nbsp;/gi, '')
        .replace(/<span[^>]*>\s*<\/span>/gi, '')
        .replace(/\s+/g, '')
      return html.length === 0
    }

    // Remove placeholder if there is any real content besides it.
    const placeholder = root.querySelector?.('[data-rte-placeholder="1"]')
    if (placeholder) {
      const otherEls = Array.from(root.children || []).filter((c) => c !== placeholder)
      const hasOtherContent = otherEls.some((c) => !isNodeEmpty(c))
      if (hasOtherContent) placeholder.remove()
    }

    // Remove empty wrappers (sections/questions/highlights/paragraphs)
    Array.from(root.children || []).forEach((child) => {
      const tag = child.tagName?.toLowerCase?.() || ''

      if (tag === 'div' && child.hasAttribute('data-section')) {
        const h2 = child.querySelector('h2')
        const t = String(h2?.textContent || '').replace(/\u00A0/g, ' ').trim()
        if (!t) child.remove()
        return
      }

      if (tag === 'section' && child.getAttribute('data-rte-type') === 'questions') {
        const items = Array.from(child.querySelectorAll('li'))
          .map((li) => String(li.textContent || '').trim())
          .filter(Boolean)
        const title = String(child.querySelector('[data-rte-role="questions-title"]')?.textContent || '').trim()
        if (!title && items.length === 0) child.remove()
        return
      }

      if (tag === 'div' && child.querySelector('blockquote')) {
        const q = String(child.querySelector('blockquote')?.textContent || '').trim()
        if (!q) child.remove()
        return
      }

      if (isNodeEmpty(child)) child.remove()
    })

    // Renumber SECCIÓN blocks after deletions.
    const sections = Array.from(root.querySelectorAll('div[data-section]'))
    sections.forEach((section, idx) => {
      const n = idx + 1
      section.setAttribute('data-section', String(n))
      if (/^section-\d+$/.test(String(section.id || ''))) {
        section.id = `section-${n - 1}`
      }

      const topBar =
        section.querySelector('[data-rte-role="section-topbar"]') ||
        section.querySelector('div.absolute.top-0.left-0.right-0.h-1')
      if (topBar) {
        topBar.setAttribute('data-rte-role', 'section-topbar')
        topBar.setAttribute('contenteditable', 'false')
      }

      const badge =
        section.querySelector('[data-rte-role="section-badge"]') ||
        section.querySelector('div.inline-flex.items-center')
      if (badge) {
        badge.setAttribute('data-rte-role', 'section-badge')
        badge.setAttribute('contenteditable', 'false')

        // Remove stray text nodes (e.g., when user types inside the badge)
        Array.from(badge.childNodes || []).forEach((node) => {
          if (node && node.nodeType === 3) {
            const t = String(node.nodeValue || '')
            if (t.trim()) {
              try { node.remove?.() } catch { try { badge.removeChild(node) } catch { /* ignore */ } }
            }
          }
        })

        // Ensure exactly one badge text span
        let badgeText =
          badge.querySelector('[data-rte-role="section-badge-text"]') ||
          badge.querySelector('span.text-xs') ||
          badge.querySelector('span')
        if (!badgeText) {
          badgeText = document.createElement('span')
          badge.appendChild(badgeText)
        }
        badgeText.setAttribute('data-rte-role', 'section-badge-text')
        badgeText.setAttribute('contenteditable', 'false')
        badgeText.textContent = `SECCIÓN ${String(n).padStart(2, '0')}`

        Array.from(badge.querySelectorAll('[data-rte-role="section-badge-text"]') || []).forEach((el, i) => {
          if (i === 0) return
          try { el.remove?.() } catch { try { badge.removeChild(el) } catch { /* ignore */ } }
        })

        // Ensure icon span exists and is SVG-only
        const defaultKey = normalizeSectionIconKey(sectionIcon)
        let iconSpan = badge.querySelector('[data-rte-role="section-icon"]')
        if (!iconSpan) {
          iconSpan = document.createElement('span')
          badge.insertBefore(iconSpan, badgeText)
        }
        iconSpan.setAttribute('data-rte-role', 'section-icon')
        iconSpan.setAttribute('contenteditable', 'false')
        iconSpan.className = iconSpan.className || 'inline-flex items-center justify-center text-white/80'

        const existingKey = normalizeSectionIconKey(
          iconSpan.getAttribute('data-icon') || iconSpan.textContent || defaultKey
        )
        iconSpan.setAttribute('data-icon', existingKey)

        // Clear any text/children and re-add svg
        try {
          iconSpan.textContent = ''
          while (iconSpan.firstChild) iconSpan.removeChild(iconSpan.firstChild)
          iconSpan.appendChild(createSectionIconSvgEl(existingKey))
        } catch {
          // ignore
        }
      }
    })
  }

  const syncBlocksFromDocDom = (coalesceKey) => {
    const root = docEditorRef.current
    if (!root) return
    cleanupDocDom(root)
    const parsed = htmlToBlocks(root)
    setBlocksWithHistory(parsed, { coalesceKey })
  }

  const isDocEditorFocused = () => {
    const host = docEditorRef.current
    if (!host) return false
    const active = document.activeElement
    return active ? host.contains(active) || active === host : false
  }

  const applyAccentClassesInPlace = (root) => {
    if (!root) return

    // Headings (section wrappers)
    Array.from(root.querySelectorAll('div[data-section]')).forEach((section) => {
      const topBar = section.querySelector('[data-rte-role="section-topbar"]') || section.querySelector('div.absolute.top-0.left-0.right-0.h-1')
      if (topBar) {
        topBar.setAttribute('data-rte-role', 'section-topbar')
        topBar.setAttribute('contenteditable', 'false')
        topBar.className = `absolute top-0 left-0 right-0 h-1 bg-gradient-to-r ${accentPreset.headingTopBar}`
      }

      const badge = section.querySelector('[data-rte-role="section-badge"]') || section.querySelector('div.inline-flex.items-center')
      if (badge) {
        badge.setAttribute('data-rte-role', 'section-badge')
        badge.setAttribute('contenteditable', 'false')
        badge.className = `inline-flex items-center gap-2 mb-4 px-4 py-1.5 ${accentPreset.badgeBg} border ${accentPreset.badgeBorder} rounded-full`
      }

      const badgeText = section.querySelector('[data-rte-role="section-badge-text"]') || badge?.querySelector('span')
      if (badgeText) {
        badgeText.setAttribute('data-rte-role', 'section-badge-text')
        badgeText.setAttribute('contenteditable', 'false')
        badgeText.className = `text-xs font-mono ${accentPreset.badgeText} tracking-wider`
      }

      const iconSpan = section.querySelector('[data-rte-role="section-icon"]')
      if (iconSpan) {
        iconSpan.setAttribute('data-rte-role', 'section-icon')
        iconSpan.setAttribute('contenteditable', 'false')
      }
    })

    // Questions blocks
    Array.from(root.querySelectorAll('[data-rte-type="questions"]')).forEach((qSection) => {
      qSection.className = `my-12 rounded-3xl border-2 ${accentPreset.questionsBorder} bg-gradient-to-br ${accentPreset.questionsBg} p-10 shadow-2xl shadow-black/30`
      const title = qSection.querySelector('[data-rte-role="questions-title"]')
      if (title) title.className = `text-2xl md:text-3xl font-bold bg-gradient-to-r ${accentPreset.questionsTitle} bg-clip-text text-transparent`
      const iconBox = qSection.querySelector('[data-rte-role="questions-icon-box"]')
      if (iconBox) iconBox.className = `inline-flex items-center justify-center w-9 h-9 rounded-xl bg-gradient-to-br ${accentPreset.questionsIconBg} border ${accentPreset.questionsIconBorder}`
      const icon = qSection.querySelector('[data-rte-role="questions-icon"]')
      if (icon) icon.className = `${accentPreset.questionsIcon} text-lg font-bold leading-none`
      const ul = qSection.querySelector('[data-rte-role="questions-items"]')
      if (ul) ul.className = `space-y-3 pl-6 list-disc ${QUESTIONS_MARKER_CLASS}`
    })

    // Highlight blocks (only tagged ones)
    Array.from(root.querySelectorAll('[data-rte-type="highlight"]')).forEach((wrapper) => {
      wrapper.className = `my-16 relative bg-gradient-to-br ${accentPreset.highlightBg} backdrop-blur-xl border-2 ${accentPreset.highlightBorder} rounded-3xl p-10 lg:p-12 overflow-hidden shadow-2xl shadow-black/30`
      const cornerA = wrapper.querySelector('[data-rte-role="highlight-corner-a"]')
      if (cornerA) cornerA.className = `absolute top-0 right-0 w-32 h-32 bg-gradient-to-br ${accentPreset.highlightCornerA} rounded-bl-full`
      const cornerB = wrapper.querySelector('[data-rte-role="highlight-corner-b"]')
      if (cornerB) cornerB.className = `absolute bottom-0 left-0 w-32 h-32 bg-gradient-to-tr ${accentPreset.highlightCornerB} rounded-tr-full`
      const quoteIcon = wrapper.querySelector('[data-rte-role="highlight-quote"]')
      if (quoteIcon) quoteIcon.className = `absolute top-8 left-8 text-6xl ${accentPreset.highlightQuote} font-serif leading-none`
      const divider = wrapper.querySelector('[data-rte-role="highlight-divider"]')
      if (divider) divider.className = `h-px bg-gradient-to-r from-transparent ${accentPreset.highlightDivider} to-transparent mb-4`
      const cite = wrapper.querySelector('[data-rte-role="highlight-cite"]')
      if (cite) cite.className = `block text-sm ${accentPreset.highlightCite}/80 not-italic font-normal tracking-wide`
    })
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
      return
    }

    // Si está enfocado, NO tocar el HTML para evitar perder el cursor.
    // Pero sí actualizar clases dependientes del tema.
    applyAccentClassesInPlace(host)
  }, [mode, blocks, accent])

  const handleDocInput = () => {
    const host = docEditorRef.current
    if (host) {
      const placeholderEl = host.querySelector?.('[data-rte-placeholder="1"]')
      if (placeholderEl) {
        host.innerHTML = ''
      }
    }

    // Limpiar timeout anterior
    if (docInputTimeoutRef.current) {
      clearTimeout(docInputTimeoutRef.current)
    }
    
    // Sincronizar con debounce para ver cambios en tiempo real sin loops
    docInputTimeoutRef.current = setTimeout(() => {
      syncBlocksFromDocDom('doc:typing')
    }, 500)
  }

  const handleDocBeforeInput = (e) => {
    const t = e?.inputType
    if (t !== 'historyUndo' && t !== 'historyRedo') return
    setTimeout(() => syncBlocksFromDocDom(`doc:${t}`), 0)
  }

  const handleDocFocus = () => {
    const host = docEditorRef.current
    if (!host) return
    const placeholderEl = host.querySelector?.('[data-rte-placeholder="1"]')
    if (placeholderEl) {
      host.innerHTML = ''
    }
  }

  const handleDocPaste = () => {
    const host = docEditorRef.current
    if (host) {
      const placeholderEl = host.querySelector?.('[data-rte-placeholder="1"]')
      if (placeholderEl) {
        host.innerHTML = ''
      }
    }
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
        let title = String(qOpen[1] || 'Preguntas').trim() || 'Preguntas'
        if (/^preguntas\s+(que\s+incomodan|incómodas)$/i.test(title)) title = 'Preguntas'
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
      ...(type === 'questions' ? { title: 'Preguntas' } : null)
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
    if (mode === 'document' && selectedText.blockId === 'document') {
      const host = docEditorRef.current
      const selection = window.getSelection()
      const savedRange = docSelectionRangeRef.current

      const canUseSaved =
        host &&
        savedRange &&
        savedRange.commonAncestorContainer &&
        host.contains(savedRange.commonAncestorContainer)

      // Prefer the saved range because toolbar clicks often collapse the live selection.
      const range = canUseSaved
        ? savedRange
        : (selection && selection.rangeCount > 0 ? selection.getRangeAt(0) : null)

      if (!range) {
        setShowFloatingToolbar(false)
        return
      }

      // Restore selection inside the editor before applying commands/inserts
      try {
        if (selection) {
          selection.removeAllRanges()
          selection.addRange(range)
        }
      } catch {
        // ignore
      }

      // Guard: selection must be inside doc editor
      if (!isSelectionInsideDocEditor(window.getSelection())) {
        setShowFloatingToolbar(false)
        return
      }

      const text = range.toString?.() || window.getSelection()?.toString?.() || ''
      if (!text || !text.trim()) {
        setShowFloatingToolbar(false)
        return
      }

      const insertBlockElement = (el) => {
        range.deleteContents()
        range.insertNode(el)
        // Move caret after inserted element
        const sel = window.getSelection()
        if (sel) {
          sel.removeAllRanges()
          const afterRange = document.createRange()
          afterRange.setStartAfter(el)
          afterRange.collapse(true)
          sel.addRange(afterRange)
          docSelectionRangeRef.current = afterRange.cloneRange()
        }

        try {
          host?.focus?.({ preventScroll: true })
        } catch {
          // ignore
        }
      }

      const replaceSelectionWithTopLevelBlock = (el, coalesceKey) => {
        if (!host) {
          insertBlockElement(el)
          return
        }

        let topLevelNodes = []
        try {
          topLevelNodes = Array.from(host.childNodes || []).filter((n) => {
            try {
              return range.intersectsNode(n)
            } catch {
              return false
            }
          })
        } catch {
          topLevelNodes = []
        }

        if (!topLevelNodes.length) {
          insertBlockElement(el)
          cleanupDocDom(host)
          if (coalesceKey) syncBlocksFromDocDom(coalesceKey)
          return
        }

        const first = topLevelNodes[0]
        try {
          host.insertBefore(el, first)
        } catch {
          host.appendChild(el)
        }

        topLevelNodes.forEach((n) => {
          try {
            n.remove?.()
          } catch {
            try {
              host.removeChild(n)
            } catch {
              // ignore
            }
          }
        })

        const sel = window.getSelection()
        if (sel) {
          sel.removeAllRanges()
          const after = document.createRange()
          after.setStartAfter(el)
          after.collapse(true)
          sel.addRange(after)
          docSelectionRangeRef.current = after.cloneRange()
        }

        try {
          host.focus?.({ preventScroll: true })
        } catch {
          // ignore
        }

        cleanupDocDom(host)
        if (coalesceKey) syncBlocksFromDocDom(coalesceKey)
      }

      if (action === 'title' || action === 'subtitle') {
        const role = action === 'title' ? 'title' : 'subtitle'
        const tag = action === 'title' ? 'h1' : 'h2'
        const cleaned = String(text || '').replace(/\s+/g, ' ').trim()
        if (!cleaned) {
          setShowFloatingToolbar(false)
          return
        }

        // Enforce only one title/subtitle in the document
        try {
          host?.querySelectorAll?.(`[data-rte-role="${role}"]`)?.forEach?.((node) => {
            const p = document.createElement('p')
            p.className = 'my-6 text-lg md:text-xl text-white/75 leading-relaxed tracking-wide'
            p.innerHTML = node.innerHTML
            node.replaceWith(p)
          })
        } catch {
          // ignore
        }

        const h = document.createElement(tag)
        h.setAttribute('data-rte-role', role)
        h.className =
          role === 'title'
            ? 'my-8 text-4xl md:text-5xl font-light text-white leading-tight'
            : 'my-6 text-xl md:text-2xl font-light text-white/70 leading-relaxed'
        h.textContent = cleaned

        replaceSelectionWithTopLevelBlock(h, `doc:${role}`)
        setShowFloatingToolbar(false)
        return
      }

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

      if (action === 'link') {
        const href = window.prompt('URL del enlace (https://...)')
        const cleaned = String(href || '').trim()
        if (!cleaned) {
          setShowFloatingToolbar(false)
          return
        }

        document.execCommand?.('createLink', false, cleaned)
        syncBlocksFromDocDom('doc:format')
        setShowFloatingToolbar(false)
        return
      }

      if (action === 'delete') {
        // "Eliminar" = quitar el formato del contenedor, dejando el texto normal.
        const deletableTypes = new Set(['heading', 'highlight', 'questions', 'reflection', 'subsection'])

        const isDeletableTopLevel = (n) => {
          if (!n || n.nodeType !== 1) return false
          const el = n
          const rteType = String(el.getAttribute?.('data-rte-type') || '')
          const rteRole = String(el.getAttribute?.('data-rte-role') || '')
          if (el.hasAttribute?.('data-section')) return true
          if (deletableTypes.has(rteType)) return true
          if (rteRole === 'title' || rteRole === 'subtitle') return true
          return false
        }

        const stripQuotes = (s) => {
          const t = String(s || '').trim()
          if ((t.startsWith('"') && t.endsWith('"')) || (t.startsWith('“') && t.endsWith('”'))) {
            return t.slice(1, -1).trim()
          }
          return t
        }

        const makeParagraph = () => {
          const p = document.createElement('p')
          p.className = 'my-6 text-lg md:text-xl text-white/75 leading-relaxed tracking-wide'
          return p
        }

        const paragraphFromLines = (lines) => {
          const p = makeParagraph()
          const cleaned = (lines || []).map((l) => String(l || '').trim()).filter(Boolean)
          cleaned.forEach((line, idx) => {
            if (idx) p.appendChild(document.createElement('br'))
            p.appendChild(document.createTextNode(line))
          })
          return p
        }

        const unwrapNode = (node) => {
          const el = node
          const rteType = String(el.getAttribute?.('data-rte-type') || '')
          const rteRole = String(el.getAttribute?.('data-rte-role') || '')

          // Title/subtitle
          if (rteRole === 'title' || rteRole === 'subtitle') {
            const p = makeParagraph()
            p.textContent = String(el.textContent || '').trim()
            el.replaceWith(p)
            return
          }

          // Section heading wrapper
          if (el.hasAttribute?.('data-section')) {
            const h2 = el.querySelector('h2')
            const p = makeParagraph()
            p.textContent = String(h2?.textContent || el.textContent || '').trim()
            el.replaceWith(p)
            return
          }

          if (rteType === 'highlight') {
            const quote = stripQuotes(String(el.querySelector('blockquote')?.textContent || '').trim())
            const cite = String(el.querySelector('cite')?.textContent || '').replace(/^[—–]\s*/, '').trim()
            const lines = []
            if (quote) lines.push(quote)
            if (cite) lines.push(`— ${cite}`)
            el.replaceWith(paragraphFromLines(lines.length ? lines : [String(el.textContent || '').trim()]))
            return
          }

          if (rteType === 'questions') {
            const title = String(el.querySelector('[data-rte-role="questions-title"]')?.textContent || '').trim()
            const items = Array.from(el.querySelectorAll('li')).map((li) => String(li.textContent || '').trim()).filter(Boolean)
            const lines = []
            if (title) lines.push(title)
            items.forEach((q) => lines.push(`- ${q}`))
            el.replaceWith(paragraphFromLines(lines.length ? lines : [String(el.textContent || '').trim()]))
            return
          }

          if (rteType === 'reflection') {
            const pEl = el.querySelector('p')
            const text = stripQuotes(String(pEl?.textContent || el.textContent || '').trim())
            const p = makeParagraph()
            p.textContent = text
            el.replaceWith(p)
            return
          }

          if (rteType === 'subsection') {
            const n = String(el.querySelector('[data-rte-role="subsection-number"]')?.textContent || '').trim()
            const title = String(el.querySelector('h3')?.textContent || '').trim()
            const body = String(el.querySelector('p')?.textContent || '').trim()
            const lines = []
            const header = [n, title].filter(Boolean).join(' ')
            if (header) lines.push(header)
            if (body) lines.push(body)
            el.replaceWith(paragraphFromLines(lines.length ? lines : [String(el.textContent || '').trim()]))
            return
          }
        }

        let topLevelNodes = []
        try {
          topLevelNodes = Array.from(host?.childNodes || []).filter((n) => {
            try {
              return range.intersectsNode(n)
            } catch {
              return false
            }
          })
        } catch {
          topLevelNodes = []
        }

        const targets = topLevelNodes.filter(isDeletableTopLevel)
        if (!targets.length) {
          setShowFloatingToolbar(false)
          return
        }

        targets.forEach((n) => {
          try {
            unwrapNode(n)
          } catch {
            // ignore
          }
        })

        cleanupDocDom(host)
        syncBlocksFromDocDom('doc:unformat')
        setShowFloatingToolbar(false)
        return
      }

      if (action === 'heading') {
        // Contar las secciones actuales para auto-numerar
        const currentSections = docEditorRef.current?.querySelectorAll('[data-section]').length || 0
        const nextNum = currentSections + 1
        const sectionNum = String(nextNum).padStart(2, '0')
        
        const wrapper = document.createElement('div')
        wrapper.setAttribute('data-section', nextNum)
        wrapper.setAttribute('data-rte-type', 'heading')
        wrapper.className = 'mb-12 mt-16 relative bg-gradient-to-br from-white/5 to-white/[0.02] backdrop-blur-sm border border-white/10 rounded-2xl p-8 overflow-hidden'
        
        const topBar = document.createElement('div')
        topBar.setAttribute('data-rte-role', 'section-topbar')
        topBar.setAttribute('contenteditable', 'false')
        topBar.className = `absolute top-0 left-0 right-0 h-1 bg-gradient-to-r ${accentPreset.headingTopBar}`
        
        const badge = document.createElement('div')
        badge.setAttribute('data-rte-role', 'section-badge')
        badge.setAttribute('contenteditable', 'false')
        badge.className = `inline-flex items-center gap-2 mb-4 px-4 py-1.5 ${accentPreset.badgeBg} border ${accentPreset.badgeBorder} rounded-full`

        const iconKey = normalizeSectionIconKey(sectionIcon)
        const iconSpan = document.createElement('span')
        iconSpan.setAttribute('data-rte-role', 'section-icon')
        iconSpan.setAttribute('data-icon', iconKey)
        iconSpan.setAttribute('contenteditable', 'false')
        iconSpan.className = 'inline-flex items-center justify-center text-white/80'
        try {
          iconSpan.appendChild(createSectionIconSvgEl(iconKey))
        } catch {
          // ignore
        }
        badge.appendChild(iconSpan)

        const badgeText = document.createElement('span')
        badgeText.setAttribute('data-rte-role', 'section-badge-text')
        badgeText.setAttribute('contenteditable', 'false')
        badgeText.className = `text-xs font-mono ${accentPreset.badgeText} tracking-wider`
        badgeText.textContent = `SECCIÓN ${sectionNum}`
        badge.appendChild(badgeText)
        
        const h2 = document.createElement('h2')
        h2.className = 'text-3xl lg:text-4xl font-light text-white leading-tight'
        h2.textContent = text.replace(/\s+/g, ' ').trim()
        
        wrapper.appendChild(topBar)
        wrapper.appendChild(badge)
        wrapper.appendChild(h2)
        
        replaceSelectionWithTopLevelBlock(wrapper, 'doc:format')
        setShowFloatingToolbar(false)
        return
      }

      if (action === 'highlight') {
        // Detectar si tiene autor (líneas múltiples donde la última es el autor)
        const lines = text.split('\n').map(l => l.trim()).filter(Boolean)
        const hasAuthor = lines.length > 1 && lines[lines.length - 1].length < 50
        
        const wrapper = document.createElement('div')
        wrapper.setAttribute('data-rte-type', 'highlight')
        wrapper.className = `my-16 relative bg-gradient-to-br ${accentPreset.highlightBg} backdrop-blur-xl border-2 ${accentPreset.highlightBorder} rounded-3xl p-10 lg:p-12 overflow-hidden shadow-2xl shadow-black/30`
        
        // Decoraciones
        const cornerA = document.createElement('div')
        cornerA.setAttribute('data-rte-role', 'highlight-corner-a')
        cornerA.className = `absolute top-0 right-0 w-32 h-32 bg-gradient-to-br ${accentPreset.highlightCornerA} rounded-bl-full`
        const cornerB = document.createElement('div')
        cornerB.setAttribute('data-rte-role', 'highlight-corner-b')
        cornerB.className = `absolute bottom-0 left-0 w-32 h-32 bg-gradient-to-tr ${accentPreset.highlightCornerB} rounded-tr-full`
        const quoteIcon = document.createElement('div')
        quoteIcon.setAttribute('data-rte-role', 'highlight-quote')
        quoteIcon.className = `absolute top-8 left-8 text-6xl ${accentPreset.highlightQuote} font-serif leading-none`
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
          divider.setAttribute('data-rte-role', 'highlight-divider')
          divider.className = `h-px bg-gradient-to-r from-transparent ${accentPreset.highlightDivider} to-transparent mb-4`
          const cite = document.createElement('cite')
          cite.setAttribute('data-rte-role', 'highlight-cite')
          cite.className = `block text-sm ${accentPreset.highlightCite}/80 not-italic font-normal tracking-wide`
          cite.textContent = '— ' + lines[lines.length - 1]
          wrapper.appendChild(divider)
          wrapper.appendChild(cite)
        }
        
        replaceSelectionWithTopLevelBlock(wrapper, 'doc:format')
        setShowFloatingToolbar(false)
        return
      }

      if (action === 'questions') {
        const section = document.createElement('section')
        section.setAttribute('data-rte-type', 'questions')
        section.className = `my-12 rounded-3xl border-2 ${accentPreset.questionsBorder} bg-gradient-to-br ${accentPreset.questionsBg} p-10 shadow-2xl shadow-black/30`

        const header = document.createElement('div')
        header.setAttribute('data-rte-role', 'questions-header')
        header.className = 'flex items-center gap-3 mb-6'

        const iconBox = document.createElement('span')
        iconBox.setAttribute('data-rte-role', 'questions-icon-box')
        iconBox.className = `inline-flex items-center justify-center w-9 h-9 rounded-xl bg-gradient-to-br ${accentPreset.questionsIconBg} border ${accentPreset.questionsIconBorder}`
        const icon = document.createElement('span')
        icon.setAttribute('data-rte-role', 'questions-icon')
        icon.className = `${accentPreset.questionsIcon} text-lg font-bold leading-none`
        icon.textContent = '?'
        iconBox.appendChild(icon)

        const title = document.createElement('h3')
        title.setAttribute('data-rte-role', 'questions-title')
        title.className = `text-2xl md:text-3xl font-bold bg-gradient-to-r ${accentPreset.questionsTitle} bg-clip-text text-transparent`
        title.textContent = 'Preguntas'

        header.appendChild(iconBox)
        header.appendChild(title)

        const ul = document.createElement('ul')
        ul.setAttribute('data-rte-role', 'questions-items')
        ul.className = `space-y-3 pl-6 list-disc ${QUESTIONS_MARKER_CLASS}`

        String(text || '')
          .split('\n')
          .map((l) => String(l || '').trim())
          .filter(Boolean)
          .forEach((q) => {
            const li = document.createElement('li')
            li.className = 'text-lg leading-relaxed text-white/85'
            li.textContent = q
            ul.appendChild(li)
          })

        section.appendChild(header)
        section.appendChild(ul)
        replaceSelectionWithTopLevelBlock(section, 'doc:format')
        setShowFloatingToolbar(false)
        return
      }

      if (action === 'reflection') {
        const wrapper = document.createElement('div')
        wrapper.setAttribute('data-rte-type', 'reflection')
        wrapper.className = 'my-12 relative'
        
        const leftBar = document.createElement('div')
        leftBar.setAttribute('data-rte-role', 'reflection-bar')
        leftBar.className = `absolute -left-4 top-0 w-1 h-full bg-gradient-to-b ${accentPreset.quoteBar} rounded-full`
        
        const content = document.createElement('div')
        content.className = 'pl-8 pr-4 py-1'
        
        const p = document.createElement('p')
        p.className = 'text-xl lg:text-2xl text-white/90 leading-relaxed font-light italic relative'
        p.textContent = text.trim()
        
        const openQuote = document.createElement('span')
        openQuote.className = `absolute -left-2 -top-1 text-5xl ${accentPreset.quoteMark} font-serif`
        openQuote.textContent = '"'
        
        const closeQuote = document.createElement('span')
        closeQuote.className = `absolute -bottom-6 right-0 text-5xl ${accentPreset.quoteMark} font-serif`
        closeQuote.textContent = '"'
        
        p.appendChild(openQuote)
        p.appendChild(document.createTextNode(text.trim()))
        p.appendChild(closeQuote)
        
        content.appendChild(p)
        wrapper.appendChild(leftBar)
        wrapper.appendChild(content)
        
        replaceSelectionWithTopLevelBlock(wrapper, 'doc:format')
        setShowFloatingToolbar(false)
        return
      }

      if (action === 'subsection') {
        const lines = text.split('\n').map(l => l.trim()).filter(Boolean)
        const title = lines[0] || 'Subtítulo'
        const content = lines.slice(1).join(' ') || text.trim()
        
        const wrapper = document.createElement('div')
        wrapper.setAttribute('data-rte-type', 'subsection')
        wrapper.className = 'mb-8 relative bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-6 overflow-hidden group hover:border-white/30 transition-all'
        
        const orb = document.createElement('div')
        orb.setAttribute('data-rte-role', 'subsection-orb')
        orb.className = 'absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-purple-500/20 to-fuchsia-500/20 opacity-20 rounded-full blur-2xl group-hover:opacity-30 transition-opacity'
        
        const innerContainer = document.createElement('div')
        innerContainer.className = 'relative z-10'
        
        const flexContainer = document.createElement('div')
        flexContainer.className = 'flex items-start gap-4 mb-4'
        
        const number = document.createElement('span')
        number.setAttribute('data-rte-role', 'subsection-number')
        number.className = 'text-6xl font-bold bg-gradient-to-br from-purple-500 to-fuchsia-500 bg-clip-text text-transparent opacity-50'
        number.contentEditable = 'true'
        number.textContent = '01'
        
        const textContainer = document.createElement('div')
        textContainer.className = 'flex-1 pt-2'
        
        const h3 = document.createElement('h3')
        h3.className = 'text-2xl font-bold text-white mb-3'
        h3.contentEditable = 'true'
        h3.textContent = title
        
        const p = document.createElement('p')
        p.className = 'text-base text-white/70 leading-relaxed'
        p.contentEditable = 'true'
        p.textContent = content
        
        textContainer.appendChild(h3)
        textContainer.appendChild(p)
        flexContainer.appendChild(number)
        flexContainer.appendChild(textContainer)
        innerContainer.appendChild(flexContainer)
        wrapper.appendChild(orb)
        wrapper.appendChild(innerContainer)
        
        replaceSelectionWithTopLevelBlock(wrapper, 'doc:format')
        setShowFloatingToolbar(false)
        return
      }

      setShowFloatingToolbar(false)
      return
    }

    const { blockId, start, end, text } = selectedText
    if (!blockId || start === end || !text) {
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
      const replacement = splitBlockBySelection(block, start, end, { type: 'questions', title: 'Preguntas' })
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
    if (action === 'link') {
      const href = window.prompt('URL del enlace (https://...)')
      const cleaned = String(href || '').trim()
      if (!cleaned) {
        setShowFloatingToolbar(false)
        return
      }

      const before = content.slice(0, start)
      const middle = content.slice(start, end)
      const after = content.slice(end)
      const nextContent = `${before}[${middle}](${cleaned})${after}`
      updateBlock(blockId, { content: nextContent })
      setShowFloatingToolbar(false)
      return
    }

    if (action === 'delete') {
      const makePlain = () => {
        const t = String(block.content || '').trim()
        if (block.type === 'questions') {
          const title = String(block.title || '').trim()
          const items = String(block.content || '')
            .split('\n')
            .map((l) => String(l || '').trim())
            .filter(Boolean)
          const lines = []
          if (title) lines.push(title)
          items.forEach((q) => lines.push(`- ${q}`))
          return lines.join('\n')
        }
        if (block.type === 'subsection') {
          const n = String(block.number || '').trim()
          const title = String(block.title || '').trim()
          const header = [n, title].filter(Boolean).join(' ')
          return [header, t].filter(Boolean).join('\n')
        }
        return t
      }

      updateBlock(blockId, { type: 'paragraph', content: makePlain() })
      setShowFloatingToolbar(false)
      return
    }

    setShowFloatingToolbar(false)
  }

  return (
    <div ref={editorRootRef} className="space-y-4" onKeyDownCapture={handleKeyDownCapture}>
      {/* Barra Flotante de Formateo (tipo Medium) - portal para evitar bugs con transform/modales */}
      {typeof document !== 'undefined' &&
        createPortal(
          <AnimatePresence>
            {showFloatingToolbar && (
              <FloatingFormatToolbar
                position={toolbarPosition}
                onClose={() => setShowFloatingToolbar(false)}
                onFormat={applyFormat}
                  onInteract={() => {
                    toolbarInteractingRef.current = true
                    try {
                      docEditorRef.current?.focus?.({ preventScroll: true })
                    } catch {
                      // ignore
                    }
                    if (toolbarInteractTimeoutRef.current) {
                      window.clearTimeout(toolbarInteractTimeoutRef.current)
                    }
                    toolbarInteractTimeoutRef.current = window.setTimeout(() => {
                      toolbarInteractingRef.current = false
                    }, 800)
                  }}
              />
            )}
          </AnimatePresence>,
          document.body
        )}

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
            <div className="mb-6 flex items-center justify-between pb-6 border-b border-purple-500/20">
              <div className="flex items-center gap-3">
                <Eye className="w-5 h-5 text-purple-400" />
                <span className="text-purple-300 font-medium">Vista Previa en Vivo</span>
                <span className="text-gray-500 text-sm hidden md:inline">- Se ve exactamente como el artículo final</span>
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={undo}
                  disabled={historyRef.current.index <= 0}
                  title="Deshacer (Ctrl+Z)"
                  className="p-2 rounded-lg hover:bg-white/10 text-gray-400 hover:text-white transition-all disabled:opacity-30 disabled:cursor-not-allowed"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h10a8 8 0 018 8v2M3 10l6 6m-6-6l6-6" />
                  </svg>
                </button>
                <button
                  onClick={redo}
                  disabled={historyRef.current.index >= historyRef.current.stack.length - 1}
                  title="Rehacer (Ctrl+Y)"
                  className="p-2 rounded-lg hover:bg-white/10 text-gray-400 hover:text-white transition-all disabled:opacity-30 disabled:cursor-not-allowed"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 10h-10a8 8 0 00-8 8v2m18-10l-6 6m6-6l-6-6" />
                  </svg>
                </button>
              </div>
            </div>
            <div
              ref={docEditorRef}
              contentEditable
              suppressContentEditableWarning
              onInput={handleDocInput}
              onBeforeInput={handleDocBeforeInput}
              onPaste={handleDocPaste}
              onBlur={handleDocBlur}
              onFocus={handleDocFocus}
              onMouseUp={() => updateToolbarFromDocSelection(window.getSelection())}
              onKeyUp={() => updateToolbarFromDocSelection(window.getSelection())}
              onTouchEnd={() => updateToolbarFromDocSelection(window.getSelection())}
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
function FloatingFormatToolbar({ position, onClose, onFormat, onInteract }) {
  const [showBlockMenu, setShowBlockMenu] = useState(false)

  const formatOptions = [
    { icon: Bold, label: 'Negrita', action: 'bold' },
    { icon: Italic, label: 'Cursiva', action: 'italic' },
    { icon: Heading2, label: 'Sección', action: 'heading' },
    { icon: Type, label: 'Tarjeta', action: 'subsection' },
    { icon: LinkIcon, label: 'Enlace', action: 'link' },
    { icon: Trash2, label: 'Quitar formato', action: 'delete' },
  ]

  return (
    <motion.div
      onMouseDownCapture={() => onInteract?.()}
      onTouchStart={() => onInteract?.()}
      initial={{ opacity: 0, y: -10, scale: 0.9 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, y: -10, scale: 0.9 }}
      transition={{ duration: 0.2 }}
      style={{
        position: 'fixed',
        top: `${position.top}px`,
        left: `${position.left}px`,
        transform: 'translateX(-50%)',
        zIndex: 99999  // Aumentado para asegurar que esté visible
      }}
      className="bg-gray-900 border-2 border-purple-500 rounded-xl shadow-2xl shadow-purple-500/50 overflow-visible"
    >
      <div className="flex items-center gap-1 p-2">
        <div className="relative">
          <button
            onMouseDown={(e) => e.preventDefault()}
            onClick={() => setShowBlockMenu((v) => !v)}
            title="Destacar / Reflexión / Preguntas"
            className="p-2.5 rounded-lg hover:bg-white/10 text-gray-300 hover:text-white transition-all group"
          >
            <Sparkles className="w-4 h-4" />
          </button>

          {showBlockMenu && (
            <div
              onMouseDown={(e) => e.preventDefault()}
              className="absolute left-0 top-full mt-2 w-48 rounded-lg border border-white/10 bg-gray-900 shadow-2xl overflow-hidden"
              style={{ zIndex: 100000 }}
            >
              <button
                onMouseDown={(e) => e.preventDefault()}
                onClick={() => {
                  setShowBlockMenu(false)
                  onFormat?.('highlight')
                }}
                className="w-full px-3 py-2 text-left text-sm text-white/90 hover:bg-white/10 flex items-center gap-2"
              >
                <Sparkles className="w-4 h-4 text-purple-300" />
                Destacar
              </button>
              <button
                onMouseDown={(e) => e.preventDefault()}
                onClick={() => {
                  setShowBlockMenu(false)
                  onFormat?.('reflection')
                }}
                className="w-full px-3 py-2 text-left text-sm text-white/90 hover:bg-white/10 flex items-center gap-2"
              >
                <Quote className="w-4 h-4 text-purple-300" />
                Reflexión
              </button>
              <button
                onMouseDown={(e) => e.preventDefault()}
                onClick={() => {
                  setShowBlockMenu(false)
                  onFormat?.('questions')
                }}
                className="w-full px-3 py-2 text-left text-sm text-white/90 hover:bg-white/10 flex items-center gap-2"
              >
                <AlertCircle className="w-4 h-4 text-purple-300" />
                Preguntas
              </button>
            </div>
          )}
        </div>

        {formatOptions.map(({ icon: Icon, label, action }) => (
          <button
            key={action}
            onMouseDown={(e) => e.preventDefault()}
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
