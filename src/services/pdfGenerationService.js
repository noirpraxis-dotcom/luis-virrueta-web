import jsPDF from 'jspdf'
import html2canvas from 'html2canvas'

const BG_COLOR = [15, 15, 26]  // #0f0f1a
const PAGE_W = 210  // A4 mm
const PAGE_H = 297
const MARGIN = 15
const CONTENT_W = PAGE_W - MARGIN * 2
const HEADER_H = 12
const FOOTER_H = 10
const USABLE_H = PAGE_H - MARGIN - HEADER_H - MARGIN - FOOTER_H

/**
 * Generate a professional dark-background PDF from the results DOM.
 * Uses html2canvas to capture sections individually, then lays them
 * into a jsPDF document with smart page breaks.
 */
export async function generateRadiografiaPDF(resultsElement, profileData, { crossAnalysis } = {}) {
  const pdf = new jsPDF({ orientation: 'portrait', unit: 'mm', format: 'a4' })

  const nombre = profileData?.nombre || 'Participante'
  const pareja = profileData?.nombrePareja || ''
  const fecha = profileData?.fecha || new Date().toLocaleDateString('es-MX')

  // ── Helper: draw page background + header + footer ──
  let pageNum = 0
  const drawPageChrome = () => {
    pageNum++
    // Dark background
    pdf.setFillColor(...BG_COLOR)
    pdf.rect(0, 0, PAGE_W, PAGE_H, 'F')

    // Header line
    pdf.setDrawColor(139, 92, 246, 40) // violet
    pdf.setLineWidth(0.3)
    pdf.line(MARGIN, MARGIN + HEADER_H - 2, PAGE_W - MARGIN, MARGIN + HEADER_H - 2)
    pdf.setFontSize(7)
    pdf.setTextColor(255, 255, 255, 100)
    pdf.text('Radiografía de Pareja Premium', MARGIN, MARGIN + 4)
    pdf.text(fecha, PAGE_W - MARGIN, MARGIN + 4, { align: 'right' })

    // Footer
    pdf.setDrawColor(255, 255, 255, 20)
    pdf.setLineWidth(0.2)
    const footerY = PAGE_H - MARGIN - FOOTER_H + 2
    pdf.line(MARGIN, footerY, PAGE_W - MARGIN, footerY)
    pdf.setFontSize(7)
    pdf.setTextColor(255, 255, 255, 80)
    pdf.text('luisvirrueta.com', MARGIN, footerY + 5)
    pdf.text(`${pageNum}`, PAGE_W - MARGIN, footerY + 5, { align: 'right' })
  }

  // ── Capture a DOM element as image ──
  const captureElement = async (el) => {
    const canvas = await html2canvas(el, {
      backgroundColor: '#0f0f1a',
      scale: 2,
      useCORS: true,
      logging: false,
      // Remove animations
      onclone: (doc) => {
        doc.querySelectorAll('[style]').forEach(e => {
          e.style.removeProperty('opacity')
          e.style.removeProperty('transform')
        })
      }
    })
    return canvas
  }

  // ── Get all top-level sections from the results container ──
  const sections = resultsElement.querySelectorAll(':scope > div, :scope > section')
  if (!sections.length) {
    // Fallback: capture the entire element
    const canvas = await captureElement(resultsElement)
    drawPageChrome()
    const imgData = canvas.toDataURL('image/jpeg', 0.92)
    const imgW = CONTENT_W
    const imgH = (canvas.height / canvas.width) * imgW
    let yOffset = 0
    const startY = MARGIN + HEADER_H

    while (yOffset < imgH) {
      if (yOffset > 0) { pdf.addPage(); drawPageChrome() }
      const sliceH = Math.min(USABLE_H, imgH - yOffset)
      pdf.addImage(imgData, 'JPEG', MARGIN, startY, imgW, imgH, undefined, 'FAST', 0)
      // Clip by setting the page viewport
      yOffset += USABLE_H
    }

    return pdf
  }

  // ── Process sections with smart page breaks ──
  let currentY = 0 // tracks position on current page (relative to content start)
  let pageStarted = false

  const ensurePage = () => {
    if (!pageStarted) {
      drawPageChrome()
      currentY = 0
      pageStarted = true
    }
  }

  const contentStartY = () => MARGIN + HEADER_H

  for (const section of sections) {
    // Skip buttons and interactive elements
    if (section.tagName === 'BUTTON' || section.querySelector(':scope > button:only-child')) continue
    if (section.offsetHeight < 5) continue

    const canvas = await captureElement(section)
    const imgData = canvas.toDataURL('image/jpeg', 0.92)
    const imgW = CONTENT_W
    const imgH = (canvas.height / canvas.width) * imgW

    // If section fits on current page, add it
    if (pageStarted && currentY + imgH <= USABLE_H) {
      pdf.addImage(imgData, 'JPEG', MARGIN, contentStartY() + currentY, imgW, imgH)
      currentY += imgH + 3 // 3mm gap between sections
      continue
    }

    // If section is taller than one page, slice it across pages
    if (imgH > USABLE_H) {
      // Start on new page if we've used more than 30% of current
      if (pageStarted && currentY > USABLE_H * 0.3) {
        pdf.addPage()
        pageStarted = false
      }
      ensurePage()

      // Create a temporary canvas to slice
      const srcCanvas = canvas
      let srcY = 0
      const pxPerMm = canvas.width / imgW

      while (srcY < canvas.height) {
        if (srcY > 0) {
          pdf.addPage()
          drawPageChrome()
          currentY = 0
        }

        const sliceHPx = Math.min(USABLE_H * pxPerMm, canvas.height - srcY)
        const sliceHMm = sliceHPx / pxPerMm

        // Create slice canvas
        const sliceCanvas = document.createElement('canvas')
        sliceCanvas.width = srcCanvas.width
        sliceCanvas.height = Math.ceil(sliceHPx)
        const ctx = sliceCanvas.getContext('2d')
        ctx.fillStyle = '#0f0f1a'
        ctx.fillRect(0, 0, sliceCanvas.width, sliceCanvas.height)
        ctx.drawImage(srcCanvas, 0, srcY, srcCanvas.width, sliceHPx, 0, 0, srcCanvas.width, sliceHPx)

        pdf.addImage(sliceCanvas.toDataURL('image/jpeg', 0.92), 'JPEG', MARGIN, contentStartY(), imgW, sliceHMm)
        currentY = sliceHMm + 3
        srcY += sliceHPx
      }
      continue
    }

    // Section doesn't fit on current page — start new page
    if (pageStarted) {
      pdf.addPage()
      pageStarted = false
    }
    ensurePage()
    pdf.addImage(imgData, 'JPEG', MARGIN, contentStartY(), imgW, imgH)
    currentY = imgH + 3
  }

  return pdf
}

/**
 * Generate and download the PDF.
 */
export async function downloadRadiografiaPDF(resultsElement, profileData, options = {}) {
  const pdf = await generateRadiografiaPDF(resultsElement, profileData, options)
  const nombre = (profileData?.nombre || 'reporte').toLowerCase().replace(/\s+/g, '-')
  pdf.save(`radiografia-${nombre}.pdf`)
  return pdf
}
