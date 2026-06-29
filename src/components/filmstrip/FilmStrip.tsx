import { useEffect, useRef, useState, useCallback } from 'react'
import { useFilmstripStore } from '../../stores/filmstrip-store'
import FilmStripItem from './FilmStripItem'

export default function FilmStrip() {
  const { photos, activePhotoId, selectPhoto, height, setHeight } = useFilmstripStore()
  const containerRef = useRef<HTMLDivElement>(null)
  const trackRef = useRef<HTMLDivElement>(null)
  const thumbRef = useRef<HTMLDivElement>(null)
  const [isDragging, setIsDragging] = useState(false)
  const [isDraggingThumb, setIsDraggingThumb] = useState(false)
  const dragRef = useRef({ startHeight: 0, startY: 0, startScrollLeft: 0, startMouseX: 0 })

  useEffect(() => {
    if (activePhotoId && containerRef.current) {
      const activeItem = containerRef.current.querySelector(`[data-id="${activePhotoId}"]`)
      if (activeItem) {
        activeItem.scrollIntoView({ behavior: 'auto', block: 'nearest', inline: 'center' })
      }
    }
  }, [activePhotoId, height])

  const updateScrollbar = useCallback(() => {
    if (!containerRef.current || !thumbRef.current || !trackRef.current) return
    const container = containerRef.current
    const track = trackRef.current
    const thumb = thumbRef.current
    
    const scrollRatio = container.clientWidth / container.scrollWidth
    const thumbWidth = Math.max(40, scrollRatio * track.clientWidth)
    
    const maxScroll = container.scrollWidth - container.clientWidth
    const scrollPercent = maxScroll > 0 ? container.scrollLeft / maxScroll : 0
    
    const maxThumbLeft = track.clientWidth - thumbWidth
    
    thumb.style.width = `${thumbWidth}px`
    thumb.style.left = `${scrollPercent * maxThumbLeft}px`
  }, [])

  useEffect(() => {
    updateScrollbar()
    window.addEventListener('resize', updateScrollbar)
    return () => window.removeEventListener('resize', updateScrollbar)
  }, [updateScrollbar, height])

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (isDragging) {
        e.preventDefault()
        const deltaY = dragRef.current.startY - e.clientY
        const newHeight = Math.max(74, Math.min(200, dragRef.current.startHeight + deltaY))
        setHeight(newHeight)
      } else if (isDraggingThumb && containerRef.current && trackRef.current && thumbRef.current) {
        const track = trackRef.current
        const thumb = thumbRef.current
        const deltaX = e.clientX - dragRef.current.startMouseX
        
        const scrollRatio = containerRef.current.scrollWidth / track.clientWidth
        containerRef.current.scrollLeft = dragRef.current.startScrollLeft + deltaX * scrollRatio
      }
    }

    const handleMouseUp = () => {
      setIsDragging(false)
      setIsDraggingThumb(false)
      document.body.style.userSelect = ''
    }

    if (isDragging || isDraggingThumb) {
      document.body.style.userSelect = 'none'
      window.addEventListener('mousemove', handleMouseMove)
      window.addEventListener('mouseup', handleMouseUp)
    }

    return () => {
      window.removeEventListener('mousemove', handleMouseMove)
      window.removeEventListener('mouseup', handleMouseUp)
    }
  }, [isDragging, isDraggingThumb, setHeight])

  return (
    <div className="bg-panel rounded-xl p-2 mx-4 mb-4 relative" style={{ height: `${height}px` }}>
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
        onScroll={updateScrollbar}
      >
        <div className="flex items-center gap-2 h-full pb-6">
          {photos.map((photo) => (
            <div key={photo.id} data-id={photo.id} className="shrink-0 h-full flex items-center">
              <FilmStripItem
                photo={photo}
                isActive={photo.id === activePhotoId}
                onClick={() => selectPhoto(photo.id)}
              />
            </div>
          ))}
        </div>
      </div>

      {/* Custom Scrollbar */}
      <div ref={trackRef} className="filmstrip-scrollbar-track">
        <div
          ref={thumbRef}
          className="filmstrip-scrollbar-thumb absolute"
          onMouseDown={(e) => {
            e.stopPropagation()
            dragRef.current = { 
                ...dragRef.current, 
                startScrollLeft: containerRef.current?.scrollLeft || 0, 
                startMouseX: e.clientX 
            }
            setIsDraggingThumb(true)
          }}
        />
      </div>
    </div>
  )
}
