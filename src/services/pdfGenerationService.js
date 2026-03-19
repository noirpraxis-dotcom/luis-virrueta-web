import jsPDF from 'jspdf'
import html2canvas from 'html2canvas'

/* ═══════════════════════════════════════════════════════════════════
   PDF Generation Service — data-pdf-page marker-based capture
   Each element with [data-pdf-page] is captured as an independent
   canvas and placed on its own PDF page. This gives perfect control
   over page layout with no content cut across sections.
═══════════════════════════════════════════════════════════════════ */

const PAGE_W = 210
const PAGE_H = 297
const MARGIN = 10
const CONTENT_W = PAGE_W - MARGIN * 2
const HEADER_H = 9
const FOOTER_H = 7
const CONTENT_TOP = MARGIN + HEADER_H + 2
const USABLE_H = PAGE_H - CONTENT_TOP - MARGIN - FOOTER_H

const CLONE_WIDTH_PX = 900
const BG_HEX = '#0f0f1a'
const CAPTURE_SCALE = 2

const VIOLET = [139, 92, 246]
const BG = [15, 15, 26]
const WHITE50 = [130, 130, 155]
const WHITE30 = [80, 80, 100]
const BORDER = [40, 40, 65]

/* ── Page chrome ── */
function drawPageChrome(pdf, pageNum, totalPages, fechaStr) {
  pdf.setFillColor(...BG)
  pdf.rect(0, 0, PAGE_W, PAGE_H, 'F')
  pdf.setFillColor(...VIOLET)
  pdf.rect(0, 0, PAGE_W, 1.2, 'F')
  pdf.setFontSize(6.5)
  pdf.setTextColor(...WHITE50)
  pdf.text('Radiografía de Pareja Premium', MARGIN, MARGIN + 4)
  pdf.text(fechaStr, PAGE_W - MARGIN, MARGIN + 4, { align: 'right' })
  pdf.setDrawColor(...BORDER)
  pdf.setLineWidth(0.2)
  pdf.line(MARGIN, MARGIN + 6, PAGE_W - MARGIN, MARGIN + 6)
  const fy = PAGE_H - MARGIN - FOOTER_H + 1
  pdf.line(MARGIN, fy, PAGE_W - MARGIN, fy)
  pdf.setFontSize(6.5)
  pdf.setTextColor(...WHITE30)
  pdf.text('luisvirrueta.com', MARGIN, fy + 4)
  pdf.text(`${pageNum} / ${totalPages}`, PAGE_W - MARGIN, fy + 4, { align: 'right' })
}

/* ── Fix bg-clip-text: html2canvas renders it as colored rectangles ── */
function fixBgClipText(root) {
  root.querySelectorAll('*').forEach(el => {
    const cs = window.getComputedStyle(el)
    if (cs.webkitBackgroundClip === 'text' || cs.backgroundClip === 'text') {
      const bg = cs.backgroundImage || ''
      let color = '#c4b5fd'
      if (bg.includes('fuchsia')) color = '#f0abfc'
      else if (bg.includes('pink') || bg.includes('rose')) color = '#f9a8d4'
      else if (bg.includes('emerald') || bg.includes('teal') || bg.includes('green')) color = '#6ee7b7'
      else if (bg.includes('blue') || bg.includes('indigo')) color = '#93c5fd'
      else if (bg.includes('amber') || bg.includes('yellow') || bg.includes('orange')) color = '#fcd34d'
      else if (bg.includes('cyan') || bg.includes('sky')) color = '#67e8f9'
      else if (bg.includes('red')) color = '#fca5a5'
      else if (bg.includes('purple')) color = '#d8b4fe'
      el.style.setProperty('-webkit-background-clip', 'unset', 'important')
      el.style.setProperty('background-clip', 'unset', 'important')
      el.style.setProperty('-webkit-text-fill-color', 'unset', 'important')
      el.style.setProperty('color', color, 'important')
      el.style.setProperty('background-image', 'none', 'important')
    }
  })
}

/* ── Prepare cloned element: strip interactivity, fix animations & SVGs ── */
function prepareClone(el) {
  el.querySelectorAll('button, [role="button"], input, select, textarea, [data-no-pdf], a[download]')
    .forEach(n => n.remove())

  // Reveal elements hidden on-screen but meant for PDF only
  el.querySelectorAll('[data-pdf-only]').forEach(n => {
    n.classList.remove('hidden')
    n.style.display = ''
    n.style.visibility = 'visible'
  })

  // Reveal all tab panels (individual + cruzado) regardless of active tab
  el.querySelectorAll('[data-pdf-tab]').forEach(n => {
    n.classList.remove('hidden')
    n.style.display = ''
    n.style.visibility = 'visible'
  })

  el.querySelectorAll('*').forEach(n => {
    n.style.transition = 'none'
    n.style.animation = 'none'
    n.style.animationDelay = '0s'
    n.style.opacity = '1'
    n.style.transform = 'none'
    n.style.visibility = 'visible'
    const ov = window.getComputedStyle(n).overflow
    if (ov === 'hidden' || ov === 'auto' || ov === 'scroll') n.style.overflow = 'visible'
  })

  el.querySelectorAll('svg').forEach(svg => {
    const w = svg.getAttribute('width')
    const h = svg.getAttribute('height')
    if (w && parseInt(w) <= 0) svg.setAttribute('width', '400')
    if (h && parseInt(h) <= 0) svg.setAttribute('height', '300')
    if (!svg.getAttribute('viewBox') && svg.getAttribute('width') && svg.getAttribute('height'))
      svg.setAttribute('viewBox', `0 0 ${svg.getAttribute('width')} ${svg.getAttribute('height')}`)
    // Force SVGs to center within their containers
    svg.style.display = 'block'
    svg.style.margin = '0 auto'
  })
  el.querySelectorAll('.recharts-wrapper, .recharts-surface').forEach(n => {
    if (!n.style.width || parseInt(n.style.width) <= 0) n.style.width = '400px'
    if (!n.style.height || parseInt(n.style.height) <= 0) n.style.height = '300px'
  })

  fixBgClipText(el)
}

/* ── Capture a prepared element as canvas ── */
async function capture(el) {
  return html2canvas(el, {
    backgroundColor: BG_HEX,
    scale: CAPTURE_SCALE,
    useCORS: true,
    allowTaint: true,
    logging: false,
    width: CLONE_WIDTH_PX,
    windowWidth: CLONE_WIDTH_PX,
    scrollX: 0,
    scrollY: 0,
    onclone: (doc) => {
      doc.querySelectorAll('*').forEach(e => {
        e.style.opacity = '1'
        e.style.transform = 'none'
        e.style.transition = 'none'
        e.style.animation = 'none'
      })
    }
  })
}

/* ── Render one canvas onto one or more PDF pages ── */
function renderCanvasToPDF(pdf, canvas, currentPage, totalPages, fechaStr) {
  const mmPerPx = CONTENT_W / canvas.width
  const totalMm = canvas.height * mmPerPx
  let pagesUsed = 0
  let offsetPx = 0

  while (offsetPx < canvas.height) {
    if (pagesUsed > 0) pdf.addPage()
    pagesUsed++

    const remainPx = canvas.height - offsetPx
    const remainMm = remainPx * mmPerPx
    const sliceMm = Math.min(remainMm, USABLE_H)
    const slicePx = Math.ceil(sliceMm / mmPerPx)

    drawPageChrome(pdf, currentPage + pagesUsed - 1, totalPages, fechaStr)

    const sc = document.createElement('canvas')
    sc.width = canvas.width
    sc.height = slicePx
    const ctx = sc.getContext('2d')
    ctx.fillStyle = BG_HEX
    ctx.fillRect(0, 0, sc.width, sc.height)
    ctx.drawImage(canvas, 0, offsetPx, canvas.width, slicePx, 0, 0, canvas.width, slicePx)

    // Center vertically on page if content is shorter than USABLE_H
    const yOffset = pagesUsed === 1 && sliceMm < USABLE_H * 0.85
      ? CONTENT_TOP + (USABLE_H - sliceMm) / 2
      : CONTENT_TOP

    pdf.addImage(sc.toDataURL('image/jpeg', 0.93), 'JPEG', MARGIN, yOffset, CONTENT_W, sliceMm)
    offsetPx += slicePx
  }

  return pagesUsed
}

/* ── Main: generate PDF using data-pdf-page markers ── */
export async function generateRadiografiaPDF(resultsElement, profileData) {
  const fechaStr = new Date().toLocaleDateString('es-MX', {
    year: 'numeric', month: 'long', day: 'numeric'
  })

  // 1. Clone the entire results section off-screen
  // Use top:-20000px (not left:-9999px) so SVG x-coordinates align with viewport origin
  const container = document.createElement('div')
  container.style.cssText = `
    position: fixed; top: -20000px; left: 0;
    width: ${CLONE_WIDTH_PX}px; background: ${BG_HEX}; color: white;
    overflow: visible; z-index: -1;
  `
  document.body.appendChild(container)

  const masterClone = resultsElement.cloneNode(true)
  masterClone.style.cssText = `width:${CLONE_WIDTH_PX}px;max-width:${CLONE_WIDTH_PX}px;overflow:visible;padding:0;margin:0;`
  container.appendChild(masterClone)

  // Prepare the full clone (fix animations, SVGs, bg-clip-text)
  prepareClone(masterClone)

  // Wait for layout to settle
  await new Promise(r => setTimeout(r, 200))

  // 2. Find all marked page sections (in DOM order)
  const pageNodes = Array.from(masterClone.querySelectorAll('[data-pdf-page]'))
  console.log('[PDF] Found', pageNodes.length, 'page sections:', pageNodes.map(n => n.getAttribute('data-pdf-page')))

  // 3. Capture each marked section individually
  const captures = []
  for (let i = 0; i < pageNodes.length; i++) {
    const node = pageNodes[i]
    const label = node.getAttribute('data-pdf-page')

    // Combine header + chart-mindmap on the same page (both are short)
    if (label === 'header' && i + 1 < pageNodes.length && pageNodes[i + 1].getAttribute('data-pdf-page') === 'chart-mindmap') {
      const wrapper = document.createElement('div')
      wrapper.style.cssText = `
        width: ${CLONE_WIDTH_PX}px; background: ${BG_HEX};
        overflow: visible; padding: 28px 32px; box-sizing: border-box;
        display: flex; flex-direction: column; align-items: center;
      `
      const headerClone = node.cloneNode(true)
      headerClone.removeAttribute('data-pdf-page')
      headerClone.style.cssText = 'margin: 0 0 24px 0; width: 100%;'
      const chartClone = pageNodes[i + 1].cloneNode(true)
      chartClone.removeAttribute('data-pdf-page')
      chartClone.style.cssText = 'margin: 0; width: 100%;'
      wrapper.appendChild(headerClone)
      wrapper.appendChild(chartClone)
      container.innerHTML = ''
      container.appendChild(wrapper)
      prepareClone(wrapper)
      await new Promise(r => setTimeout(r, 40))
      try {
        const canvas = await capture(wrapper)
        if (canvas.height > 10) {
          captures.push({ label: 'header-mindmap', canvas })
          console.log(`[PDF] Captured "header-mindmap" (combined): ${canvas.width}×${canvas.height}px`)
        }
      } catch (err) {
        console.warn('[PDF] Failed to capture header-mindmap:', err)
      }
      i++ // skip chart-mindmap
      continue
    }

    // Build isolated wrapper for clean capture
    const wrapper = document.createElement('div')
    wrapper.style.cssText = `
      width: ${CLONE_WIDTH_PX}px; background: ${BG_HEX};
      overflow: visible; padding: 28px 32px; box-sizing: border-box;
      display: flex; flex-direction: column; align-items: center; justify-content: center;
    `
    const nodeClone = node.cloneNode(true)
    nodeClone.style.cssText = `margin: 0; width: 100%; max-width: ${CLONE_WIDTH_PX - 64}px;`
    nodeClone.removeAttribute('data-pdf-page')
    wrapper.appendChild(nodeClone)

    container.innerHTML = ''
    container.appendChild(wrapper)
    prepareClone(wrapper)
    await new Promise(r => setTimeout(r, 30))

    try {
      const canvas = await capture(wrapper)
      if (canvas.height > 10) {
        captures.push({ label, canvas })
        console.log(`[PDF] Captured "${label}": ${canvas.width}×${canvas.height}px`)
      }
    } catch (err) {
      console.warn(`[PDF] Failed to capture "${label}":`, err)
    }
  }

  // 4. Count total pages
  let totalPages = 0
  for (const { canvas } of captures) {
    const mmPerPx = CONTENT_W / canvas.width
    totalPages += Math.max(1, Math.ceil((canvas.height * mmPerPx) / USABLE_H))
  }
  console.log('[PDF] Total pages:', totalPages)

  // 5. Build PDF
  const pdf = new jsPDF({ orientation: 'portrait', unit: 'mm', format: 'a4' })
  let currentPage = 1

  for (let i = 0; i < captures.length; i++) {
    if (i > 0) pdf.addPage()
    const pages = renderCanvasToPDF(pdf, captures[i].canvas, currentPage, totalPages, fechaStr)
    currentPage += pages
  }

  document.body.removeChild(container)
  console.log('[PDF] Done.')
  return pdf
}

/* ── Public entry ── */
export async function downloadRadiografiaPDF(resultsElement, profileData, options = {}) {
  const pdf = await generateRadiografiaPDF(resultsElement, profileData)
  const nombre = (profileData?.nombre || 'reporte').toLowerCase().replace(/\s+/g, '-')
  pdf.save(`radiografia-${nombre}.pdf`)
  return pdf
}

/* ═══════════════════════════════════════════════════════════════════
   Chart Image Capture — captures chart DOM elements as base64 images
   for embedding in @react-pdf/renderer PDFs.
═══════════════════════════════════════════════════════════════════ */
export async function captureChartImages(resultsElement) {
  const images = {}
  const CHART_SCALE = 1.5  // 1.5× is sharp enough for PDF while being ~44% fewer pixels than 2×
  const BATCH_SIZE = 3     // Process N captures in parallel; avoids overwhelming the browser

  // ── 1. Clone master once and prepare it ──────────────────────
  const masterContainer = document.createElement('div')
  masterContainer.style.cssText = `
    position: fixed; top: -20000px; left: 0;
    width: ${CLONE_WIDTH_PX}px; background: ${BG_HEX}; color: white;
    overflow: visible; z-index: -1;
  `
  document.body.appendChild(masterContainer)

  const masterClone = resultsElement.cloneNode(true)
  masterClone.style.cssText = `width:${CLONE_WIDTH_PX}px;max-width:${CLONE_WIDTH_PX}px;overflow:visible;padding:0;margin:0;`
  masterContainer.appendChild(masterClone)
  prepareClone(masterClone)

  // ── 2. Build individual containers for every node (no shared container mutation) ──
  const pageNodes = Array.from(masterClone.querySelectorAll('[data-pdf-page]'))
  const WRAPPER_CSS = `
    width: ${CLONE_WIDTH_PX}px; background: ${BG_HEX};
    overflow: visible; padding: 28px 32px; box-sizing: border-box;
    display: flex; flex-direction: column; align-items: center; justify-content: center;
  `
  const captureItems = pageNodes.map(node => {
    const label = node.getAttribute('data-pdf-page')
    const nodeContainer = document.createElement('div')
    nodeContainer.style.cssText = `
      position: fixed; top: -20000px; left: 0;
      width: ${CLONE_WIDTH_PX}px; background: ${BG_HEX};
      overflow: visible; z-index: -1;
    `
    const wrapper = document.createElement('div')
    wrapper.style.cssText = WRAPPER_CSS
    const nodeClone = node.cloneNode(true)
    nodeClone.style.cssText = `margin: 0; width: 100%; max-width: ${CLONE_WIDTH_PX - 64}px;`
    nodeClone.removeAttribute('data-pdf-page')
    wrapper.appendChild(nodeClone)
    nodeContainer.appendChild(wrapper)
    document.body.appendChild(nodeContainer)
    prepareClone(wrapper)
    return { label, nodeContainer, wrapper }
  })

  // ── 3. Single wait for all layouts to settle ──────────────────
  await new Promise(r => setTimeout(r, 200))

  // ── 4. Capture in parallel batches ────────────────────────────
  for (let i = 0; i < captureItems.length; i += BATCH_SIZE) {
    const batch = captureItems.slice(i, i + BATCH_SIZE)
    const results = await Promise.all(
      batch.map(({ label, wrapper }) =>
        html2canvas(wrapper, {
          backgroundColor: BG_HEX,
          scale: CHART_SCALE,
          useCORS: true,
          allowTaint: true,
          logging: false,
          width: CLONE_WIDTH_PX,
          windowWidth: CLONE_WIDTH_PX,
          scrollX: 0,
          scrollY: 0,
          onclone: (doc) => {
            doc.querySelectorAll('*').forEach(e => {
              e.style.opacity = '1'
              e.style.transform = 'none'
              e.style.transition = 'none'
              e.style.animation = 'none'
            })
          }
        })
          .then(canvas => ({ label, canvas }))
          .catch(err => { console.warn(`[ChartCapture] Failed "${label}":`, err); return null })
      )
    )
    for (const result of results) {
      if (result && result.canvas.height > 10) {
        // JPEG is ~5–10× smaller than PNG and encodes much faster
        images[result.label] = result.canvas.toDataURL('image/jpeg', 0.88)
      }
    }
  }

  // ── 5. Clean up ───────────────────────────────────────────────
  captureItems.forEach(({ nodeContainer }) => document.body.removeChild(nodeContainer))
  document.body.removeChild(masterContainer)
  console.log('[ChartCapture] Captured', Object.keys(images).length, 'charts:', Object.keys(images))
  return images
}
