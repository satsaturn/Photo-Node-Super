import { useCallback, useEffect, useRef } from 'react'
import { useFilmstripStore } from '../stores/filmstrip-store'
import { useLayoutStore } from '../stores/layout-store'
import FilmstripFrame from './FilmstripFrame'

export default function Filmstrip() {
  const photos = useFilmstripStore((s) => s.photos)
  const activePhotoId = useFilmstripStore((s) => s.activePhotoId)
  const height = useFilmstripStore((s) => s.height)
  const selectPhoto = useFilmstripStore((s) => s.selectPhoto)
  const setHeight = useFilmstripStore((s) => s.setHeight)
  const setColumnWidth = useLayoutStore((s) => s.setColumnWidth)

  const heightDragRef = useRef<{
    startY: number
    startH: number
  } | null>(null)

  const widthDragRef = useRef<{
    startX: number
    startColumnWidth: number
  } | null>(null)

  const onHeightMove = useCallback((e: MouseEvent) => {
    if (!heightDragRef.current) return
    const dy = e.clientY - heightDragRef.current.startY
    setHeight(heightDragRef.current.startH - dy)
  }, [setHeight])

  const onWidthMove = useCallback((e: MouseEvent) => {
    if (!widthDragRef.current) return
    const dx = e.clientX - widthDragRef.current.startX
    setColumnWidth(widthDragRef.current.startColumnWidth - dx)
  }, [setColumnWidth])

  const onHeightUp = useCallback(() => {
    heightDragRef.current = null
    document.removeEventListener('mousemove', onHeightMove)
    document.removeEventListener('mouseup', onHeightUp)
    document.body.style.userSelect = ''
    document.body.style.cursor = ''
  }, [onHeightMove])

  const onWidthUp = useCallback(() => {
    widthDragRef.current = null
    document.removeEventListener('mousemove', onWidthMove)
    document.removeEventListener('mouseup', onWidthUp)
    document.body.style.userSelect = ''
    document.body.style.cursor = ''
  }, [onWidthMove])

  const onHeightHandleDown = useCallback((e: React.MouseEvent) => {
    e.preventDefault()
    heightDragRef.current = { startY: e.clientY, startH: height }
    document.body.style.userSelect = 'none'
    document.body.style.cursor = 'ns-resize'
    document.addEventListener('mousemove', onHeightMove)
    document.addEventListener('mouseup', onHeightUp)
  }, [height, onHeightMove, onHeightUp])

  const onWidthHandleDown = useCallback((e: React.MouseEvent) => {
    e.preventDefault()
    const startColumnWidth = useLayoutStore.getState().columnWidth
    widthDragRef.current = { startX: e.clientX, startColumnWidth }
    document.body.style.userSelect = 'none'
    document.body.style.cursor = 'ew-resize'
    document.addEventListener('mousemove', onWidthMove)
    document.addEventListener('mouseup', onWidthUp)
  }, [onWidthMove, onWidthUp])

  useEffect(() => {
    return () => {
      document.removeEventListener('mousemove', onHeightMove)
      document.removeEventListener('mouseup', onHeightUp)
      document.removeEventListener('mousemove', onWidthMove)
      document.removeEventListener('mouseup', onWidthUp)
    }
  }, [onHeightMove, onHeightUp, onWidthMove, onWidthUp])

  const frameH = Math.max(48, height - 26)
  const frameW = Math.round(frameH * 1.5)

  return (
    <div
      className="w-full bg-[rgba(var(--panel-rgb),var(--panel-opacity,0.85))] rounded-xl overflow-visible relative"
      style={{ height }}
    >
      <div
        className="absolute left-0 right-0 top-0 h-2.5 cursor-ns-resize z-[3]"
        onMouseDown={onHeightHandleDown}
      />

      <div className="filmstrip-scroll w-full h-full flex items-center gap-2 px-2.5 pt-2.5 overflow-x-scroll overflow-y-hidden rounded-xl">
        {photos.map((p) => (
          <FilmstripFrame
            key={p.id}
            src={p.thumbnail}
            name={p.name}
            active={p.id === activePhotoId}
            width={frameW}
            height={frameH}
            onClick={() => selectPhoto(p.id)}
          />
        ))}
      </div>

      <div
        className="absolute right-0 top-0 bottom-0 w-2.5 cursor-ew-resize z-[3]"
        onMouseDown={onWidthHandleDown}
      />
    </div>
  )
}
