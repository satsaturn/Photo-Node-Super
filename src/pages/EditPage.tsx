import { useState, useRef, useEffect, useCallback } from 'react'
import SectionDropdown from '../components/ui/SectionDropdown'
import Slider from '../components/ui/Slider'
import FilmStrip from '../components/filmstrip/FilmStrip'

export default function EditPage() {
  const [exposure, setExposure] = useState(0)
  const [contrast, setContrast] = useState(0)
  const [highlights, setHighlights] = useState(0)
  const [shadows, setShadows] = useState(0)
  const [whites, setWhites] = useState(0)
  const [blacks, setBlacks] = useState(0)
  const [columnWidth, setColumnWidth] = useState(320)
  const [histogramHeight, setHistogramHeight] = useState(150)

  const editListRef = useRef<HTMLDivElement>(null)
  const editTrackRef = useRef<HTMLDivElement>(null)
  const editThumbRef = useRef<HTMLDivElement>(null)
  const [editScrollHover, setEditScrollHover] = useState(false)
  const [isDraggingEditThumb, setIsDraggingEditThumb] = useState(false)

  useEffect(() => {
    const container = editListRef.current
    const thumb = editThumbRef.current
    const track = editTrackRef.current
    if (!container || !thumb || !track) return

    const update = () => {
      const overflow = container.scrollHeight > container.clientHeight
      if (!overflow) {
        thumb.style.height = '0px'
        track.style.opacity = '0'
        track.style.pointerEvents = 'none'
        return
      }
      track.style.opacity = ''
      track.style.pointerEvents = ''

      const ratio = container.clientHeight / container.scrollHeight
      const th = Math.max(20, ratio * track.clientHeight)
      const maxScroll = container.scrollHeight - container.clientHeight
      const pct = maxScroll > 0 ? container.scrollTop / maxScroll : 0
      const maxTop = track.clientHeight - th

      thumb.style.height = `${th}px`
      thumb.style.transform = `translateY(${pct * maxTop}px)`
    }

    update()
    container.addEventListener('scroll', update)
    window.addEventListener('resize', update)
    const resizeObserver = new ResizeObserver(update)
    resizeObserver.observe(container)
    const mutationObserver = new MutationObserver(update)
    mutationObserver.observe(container, { childList: true, subtree: true, attributes: false })
    return () => {
      container.removeEventListener('scroll', update)
      window.removeEventListener('resize', update)
      resizeObserver.disconnect()
      mutationObserver.disconnect()
    }
  }, [])

  const colDragRef = useRef<{ startX: number; startWidth: number } | null>(null)
  const histDragRef = useRef<{ startY: number; startHeight: number; mode: 'bottom' | 'top' } | null>(null)

  const startColResize = useCallback((e: React.MouseEvent) => {
    e.preventDefault()
    colDragRef.current = { startX: e.clientX, startWidth: columnWidth }
    document.body.style.userSelect = 'none'
  }, [columnWidth])

  const startHistBottomResize = useCallback((e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    histDragRef.current = { startY: e.clientY, startHeight: histogramHeight, mode: 'bottom' }
    document.body.style.userSelect = 'none'
  }, [histogramHeight])

  const startHistTopResize = useCallback((e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    histDragRef.current = { startY: e.clientY, startHeight: histogramHeight, mode: 'top' }
    document.body.style.userSelect = 'none'
  }, [histogramHeight])

  useEffect(() => {
    const onMouseMove = (e: MouseEvent) => {
      if (colDragRef.current) {
        const dx = e.clientX - colDragRef.current.startX
        const newW = Math.max(240, Math.min(640, colDragRef.current.startWidth - dx))
        setColumnWidth(newW)
        return
      }

      if (histDragRef.current) {
        const dy = e.clientY - histDragRef.current.startY
        if (histDragRef.current.mode === 'bottom') {
          setHistogramHeight(Math.max(130, Math.min(360, histDragRef.current.startHeight + dy)))
        } else {
          setHistogramHeight(Math.max(130, Math.min(360, histDragRef.current.startHeight + dy)))
        }
        return
      }
    }

    const onMouseUp = () => {
      if (colDragRef.current || histDragRef.current) {
        document.body.style.userSelect = ''
      }
      colDragRef.current = null
      histDragRef.current = null
    }

    window.addEventListener('mousemove', onMouseMove)
    window.addEventListener('mouseup', onMouseUp)
    return () => {
      window.removeEventListener('mousemove', onMouseMove)
      window.removeEventListener('mouseup', onMouseUp)
    }
  }, [])

  const iconClass = 'flex items-center justify-center p-1.5 text-hdr-text hover:text-white transition-colors'

  return (
    <div className="flex-1 relative overflow-hidden has-grain bg-canvas">
      {/* Canvas */}
      <div className="absolute inset-0" />

      {/* Toolbar */}
      <div className="absolute top-3 left-3 z-[3]">
        <div className="flex items-center rounded-full bg-hdr-pill p-1">
          <div className="flex items-center gap-1.5 px-3 py-1.5 text-sm font-medium text-hdr-text select-none">
            Fit
            <span className="w-2 h-2 border-r-2 border-b-2 border-hdr-text rotate-45 translate-y-[-1px] opacity-70" />
          </div>
          <div className="w-px h-5 bg-hdr-divider mx-1" />
          <button className={iconClass} title="Recenter image">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="12" cy="12" r="9" />
              <path d="M12 3v6M12 15v6M3 12h6M15 12h6" />
              <circle cx="12" cy="12" r="1.5" fill="currentColor" stroke="none" />
            </svg>
          </button>
          <div className="w-px h-5 bg-hdr-divider mx-1" />
          <button className={iconClass} title="Fullscreen">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M3 8V4a1 1 0 011-1h4M21 8V4a1 1 0 00-1-1h-4M3 16v4a1 1 0 001 1h4M21 16v4a1 1 0 01-1 1h-4" />
            </svg>
          </button>
        </div>
      </div>

      {/* Right column */}
      <div className="absolute top-0 right-0 bottom-0 z-[2]" style={{ width: `${columnWidth}px` }}>
        <div className="resize-w" style={{ left: '7px' }} onMouseDown={startColResize} />
        <div className="flex flex-col gap-3 p-3 h-full">
          {/* Histogram card */}
          <div
            className="flex-shrink-0 rounded-xl bg-panel flex flex-col relative group p-3 gap-3"
            style={{ height: `${histogramHeight}px` }}
          >
            <div className="shrink-0 flex items-center bg-panel-section rounded-full px-3 py-1.5 self-start">
              <span className="text-[10px] text-panel-text-3 uppercase tracking-[0.10em] font-semibold">Histogram</span>
            </div>
            <div className="flex-1 bg-[#1a1a1f] rounded-lg min-h-[60px]" />
            <div className="resize-h" onMouseDown={startHistBottomResize} />
          </div>

          {/* Edit panel card */}
          <div className="flex-1 min-h-0 rounded-xl bg-panel flex flex-col group">
            <div className="relative resize-h-top shrink-0" onMouseDown={startHistTopResize} />

            <div className="shrink-0 flex items-center bg-panel-section rounded-full p-0.5 mx-3 mb-2">
              <button className="flex-1 rounded-full py-1.5 text-[11px] font-medium uppercase tracking-[0.08em] bg-accent text-white">
                Global
              </button>
              <button className="flex-1 rounded-full py-1.5 text-[11px] font-medium uppercase tracking-[0.08em] text-panel-text-3 cursor-not-allowed" disabled title="Coming in a future version">
                Mask
              </button>
              <button className="flex-1 rounded-full py-1.5 text-[11px] font-medium uppercase tracking-[0.08em] text-panel-text-3 cursor-not-allowed" disabled title="Coming in a future version">
                Crop
              </button>
            </div>

            <div className="flex-1 min-h-0 relative">
              <div
                ref={editListRef}
                className="absolute inset-0 scroll-container"
              >
              <div className="px-3 pb-3 space-y-2">
              <SectionDropdown label="Lens Correction" disabled />
              <SectionDropdown label="Basic" defaultOpen>
                <Slider label="Exposure" value={exposure} onChange={setExposure} min={-4} max={4} decimalPlaces={2} formatValue={(v) => `${v > 0 ? '+' : ''}${v.toFixed(2)}`} ticks={[-4, 0, 4]} />
                <Slider label="Contrast" value={contrast} onChange={setContrast} />
                <Slider label="Highlights" value={highlights} onChange={setHighlights} />
                <Slider label="Shadows" value={shadows} onChange={setShadows} />
                <Slider label="Whites" value={whites} onChange={setWhites} />
                <Slider label="Blacks" value={blacks} onChange={setBlacks} />
              </SectionDropdown>
              <SectionDropdown label="Colour">
                <div className="text-xs text-panel-text-2 py-2 text-center">Temperature, Tint, Saturation, Vibrance…</div>
              </SectionDropdown>
              <SectionDropdown label="HSL / Mix">
                <div className="text-xs text-panel-text-2 py-2 text-center">8-colour hue / sat / luminance</div>
              </SectionDropdown>
              <SectionDropdown label="Tone Curve">
                <div className="text-xs text-panel-text-2 py-2 text-center">RGB + per-channel curves</div>
              </SectionDropdown>
              <SectionDropdown label="Detail">
                <div className="text-xs text-panel-text-2 py-2 text-center">Sharpening, Noise Reduction…</div>
              </SectionDropdown>
              <SectionDropdown
                label="Custom Edits"
                defaultOpen
                actions={
                  <button className="w-5.5 h-5.5 flex items-center justify-center text-panel-text-3 hover:text-panel-text hover:bg-white/10 rounded-full text-sm leading-none" title="Add custom edit">
                    +
                  </button>
                }
              >
                <div className="bg-panel border border-panel-border rounded-lg overflow-hidden">
                  <div className="flex items-center gap-2 px-2 py-2 bg-panel-section text-xs font-semibold text-panel-text">
                    <label className="relative w-7 h-4 cursor-pointer">
                      <input type="checkbox" defaultChecked className="sr-only" />
                      <span className="absolute inset-0 rounded-full bg-accent">
                        <span className="absolute top-0.5 right-0.5 w-3 h-3 rounded-full bg-white" />
                      </span>
                    </label>
                    <span className="text-panel-text-3 cursor-grab text-xs tracking-[-1px] px-0.5 select-none" title="Drag to reorder">⋮⋮</span>
                    <span className="flex-1">My Edits</span>
                    <button className="w-5.5 h-5.5 flex items-center justify-center text-panel-text-3 hover:text-panel-text hover:bg-white/10 rounded-full text-xs" title="Open in node editor">✎</button>
                  </div>
                  <div className="p-3 text-xs text-panel-text-3 italic text-center">UI node controls appear here</div>
                </div>
              </SectionDropdown>
              </div>
              </div>
              <div
                ref={editTrackRef}
                className="absolute right-0.5 top-3 bottom-3 w-2 rounded-full cursor-pointer z-10"
                onMouseEnter={() => setEditScrollHover(true)}
                onMouseLeave={() => { if (!isDraggingEditThumb) setEditScrollHover(false) }}
                onMouseDown={(e) => {
                  const container = editListRef.current
                  const track = editTrackRef.current
                  if (!container || !track) return
                  const rect = track.getBoundingClientRect()
                  const pct = (e.clientY - rect.top) / rect.height
                  container.scrollTop = pct * (container.scrollHeight - container.clientHeight)
                }}
              >
                <div
                  ref={editThumbRef}
                  className="w-full rounded-full cursor-grab active:cursor-grabbing scroll-thumb"
                  style={{
                    height: 0,
                    background: editScrollHover || isDraggingEditThumb ? 'var(--accent)' : 'var(--panel-text-2)',
                    opacity: editScrollHover || isDraggingEditThumb ? 1 : 0.85,
                  }}
                  onMouseDown={(e) => {
                    e.stopPropagation()
                    setIsDraggingEditThumb(true)
                    const container = editListRef.current
                    const track = editTrackRef.current
                    if (!container || !track) return
                    const startY = e.clientY
                    const startScroll = container.scrollTop
                    const onMove = (e2: MouseEvent) => {
                      e2.preventDefault()
                      const deltaY = e2.clientY - startY
                      container.scrollTop = startScroll + deltaY * (container.scrollHeight / track.clientHeight)
                    }
                    const onUp = () => {
                      setIsDraggingEditThumb(false)
                      setEditScrollHover(false)
                      window.removeEventListener('mousemove', onMove)
                      window.removeEventListener('mouseup', onUp)
                      document.body.style.userSelect = ''
                    }
                    document.body.style.userSelect = 'none'
                    window.addEventListener('mousemove', onMove)
                    window.addEventListener('mouseup', onUp)
                  }}
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Filmstrip */}
      <div className="absolute bottom-3 left-3 z-[2]" style={{ right: `${columnWidth}px` }}>
        <div className="filmstrip-resize-w" onMouseDown={startColResize} />
        <FilmStrip />
      </div>
    </div>
  )
}
