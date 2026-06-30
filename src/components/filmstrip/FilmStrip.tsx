import { useEffect, useRef, useState } from 'react'
import { useFilmstripStore } from '../../stores/filmstrip-store'
import FilmStripItem from './FilmStripItem'

export default function FilmStrip() {
  const { photos, activePhotoId, selectPhoto, height, setHeight } = useFilmstripStore()
  const containerRef = useRef<HTMLDivElement>(null)
  const trackRef = useRef<HTMLDivElement>(null)
  const thumbRef = useRef<HTMLDivElement>(null)
  const [isDragging, setIsDragging] = useState(false)
  const [isDraggingScroll, setIsDraggingScroll] = useState(false)
  const [scrollHover, setScrollHover] = useState(false)
  const [isDraggingThumb, setIsDraggingThumb] = useState(false)

  const dragRef = useRef<{ startY: number; startHeight: number; startX: number | null; startScrollLeft: number; hasMoved: boolean }>({
    startY: 0, startHeight: 0, startX: null, startScrollLeft: 0, hasMoved: false,
  })

  useEffect(() => {
    if (activePhotoId && containerRef.current) {
      const activeItem = containerRef.current.querySelector(`[data-id="${activePhotoId}"]`)
      if (activeItem) {
        activeItem.scrollIntoView({ behavior: 'auto', block: 'nearest', inline: 'center' })
      }
    }
  }, [activePhotoId, height])

  useEffect(() => {
    const container = containerRef.current
    const thumb = thumbRef.current
    const track = trackRef.current
    if (!container || !thumb || !track) return

    const update = () => {
      const ratio = container.clientWidth / container.scrollWidth
      if (ratio >= 1) { thumb.style.width = '0px'; return }

      const tw = Math.max(40, ratio * track.clientWidth)
      const maxScroll = container.scrollWidth - container.clientWidth
      const pct = maxScroll > 0 ? container.scrollLeft / maxScroll : 0
      const maxLeft = track.clientWidth - tw

      thumb.style.width = `${tw}px`
      thumb.style.transform = `translateX(${pct * maxLeft}px)`
    }

    update()
    container.addEventListener('scroll', update)
    window.addEventListener('resize', update)
    return () => {
      container.removeEventListener('scroll', update)
      window.removeEventListener('resize', update)
    }
  }, [])

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (isDragging) {
        e.preventDefault()
        const deltaY = dragRef.current.startY - e.clientY
        const newHeight = Math.max(74, Math.min(200, dragRef.current.startHeight + deltaY))
        setHeight(newHeight)
        return
      }

      if (dragRef.current.startX === null || !containerRef.current) return

      if (!dragRef.current.hasMoved && Math.abs(e.clientX - dragRef.current.startX) > 10) {
        setIsDraggingScroll(true)
        dragRef.current.hasMoved = true
        document.body.style.userSelect = 'none'
      }

      if (dragRef.current.hasMoved) {
        const deltaX = e.clientX - dragRef.current.startX
        containerRef.current.scrollLeft = dragRef.current.startScrollLeft - deltaX
      }
    }

    const handleMouseUp = (e: MouseEvent) => {
      setIsDragging(false)
      setIsDraggingScroll(false)

      if (dragRef.current.startX !== null && !dragRef.current.hasMoved) {
        const target = e.target as HTMLElement
        const button = target.closest('button')
        if (button) {
          const id = button.getAttribute('data-photo-id')
          if (id) selectPhoto(id)
        }
      }

      dragRef.current.startX = null
      dragRef.current.hasMoved = false
      document.body.style.userSelect = ''
    }

    window.addEventListener('mousemove', handleMouseMove)
    window.addEventListener('mouseup', handleMouseUp)

    return () => {
      window.removeEventListener('mousemove', handleMouseMove)
      window.removeEventListener('mouseup', handleMouseUp)
    }
  }, [isDragging, setHeight, selectPhoto])

  return (
    <div
      className="bg-panel rounded-xl p-2 mx-4 mb-4 relative"
      style={{ height: `${height}px` }}
    >
      {/* Grab Handle */}
      <div
        className="absolute -top-3 left-1/2 -translate-x-1/2 w-12 h-6 cursor-ns-resize flex items-center justify-center group z-20"
        onMouseDown={(e) => {
          e.stopPropagation()
          dragRef.current = { ...dragRef.current, startHeight: height, startY: e.clientY }
          setIsDragging(true)
        }}
      >
        <div className="w-8 h-1 bg-panel-text-3 rounded-full group-hover:bg-accent transition-colors" />
      </div>

      {/* Container */}
      <div
        ref={containerRef}
        className="overflow-x-auto filmstrip-container h-full rounded-lg"
        onMouseDown={(e) => {
          dragRef.current.startX = e.clientX
          dragRef.current.startScrollLeft = containerRef.current?.scrollLeft || 0
          dragRef.current.hasMoved = false
        }}
      >
        <div className={`flex items-center gap-2 h-full pb-3 ${isDraggingScroll ? 'pointer-events-none' : ''}`}>
          {photos.map((photo) => (
            <div key={photo.id} data-id={photo.id} className="shrink-0 h-full flex items-center">
              <FilmStripItem photo={photo} isActive={photo.id === activePhotoId} />
            </div>
          ))}
        </div>
      </div>

      {/* Scrollbar */}
      <div
        ref={trackRef}
        className="absolute bottom-1.5 left-3 right-3 h-2 rounded-full cursor-pointer"
        onMouseEnter={() => setScrollHover(true)}
        onMouseLeave={() => { if (!isDraggingThumb) setScrollHover(false) }}
        onMouseDown={(e) => {
          const container = containerRef.current
          const track = trackRef.current
          if (!container || !track) return
          const rect = track.getBoundingClientRect()
          const pct = (e.clientX - rect.left) / rect.width
          container.scrollLeft = pct * (container.scrollWidth - container.clientWidth)
        }}
      >
        <div
          ref={thumbRef}
          className="h-full rounded-full cursor-grab active:cursor-grabbing"
          style={{
            width: 0,
            background: scrollHover || isDraggingThumb ? 'var(--accent)' : 'var(--panel-text-2)',
            opacity: scrollHover || isDraggingThumb ? 1 : 0.85,
          }}
          onMouseDown={(e) => {
            e.stopPropagation()
            setIsDraggingThumb(true)
            const container = containerRef.current
            const track = trackRef.current
            if (!container || !track) return
            const startX = e.clientX
            const startScroll = container.scrollLeft
            const onMove = (e2: MouseEvent) => {
              e2.preventDefault()
              const deltaX = e2.clientX - startX
              container.scrollLeft = startScroll + deltaX * (container.scrollWidth / track.clientWidth)
            }
            const onUp = () => {
              setIsDraggingThumb(false)
              setScrollHover(false)
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
  )
}
