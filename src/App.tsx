import { useCallback, useEffect, useRef, useState } from 'react'
import ThemeProvider from './components/ThemeProvider'
import Header from './components/header/Header'
import Filmstrip from './components/Filmstrip'
import SettingsDialog from './components/settings/SettingsDialog'
import Card from './components/ui/Card'
import Section from './components/ui/Section'
import SectionDropdown from './components/ui/SectionDropdown'
import Slider from './components/ui/Slider'
import { useLayoutStore } from './stores/layout-store'

const GAP = 12
const COLUMN_RIGHT = GAP
const COLUMN_TOP = GAP
const COLUMN_BOTTOM = GAP

export default function App() {
  const [exposure, setExposure] = useState(0)
  const [temp, setTemp] = useState(0)
  const [tint, setTint] = useState(0)

  const columnWidth = useLayoutStore((s) => s.columnWidth)
  const setColumnWidth = useLayoutStore((s) => s.setColumnWidth)

  const widthDragRef = useRef<{
    startX: number
    startColumnWidth: number
  } | null>(null)

  const onMove = useCallback((e: MouseEvent) => {
    if (!widthDragRef.current) return
    const dx = e.clientX - widthDragRef.current.startX
    setColumnWidth(widthDragRef.current.startColumnWidth - dx)
  }, [setColumnWidth])

  const onUp = useCallback(() => {
    widthDragRef.current = null
    document.removeEventListener('mousemove', onMove)
    document.removeEventListener('mouseup', onUp)
    document.body.style.userSelect = ''
    document.body.style.cursor = ''
  }, [onMove])

  const onHandleDown = useCallback((e: React.MouseEvent) => {
    e.preventDefault()
    const startColumnWidth = useLayoutStore.getState().columnWidth
    widthDragRef.current = { startX: e.clientX, startColumnWidth }
    document.body.style.userSelect = 'none'
    document.body.style.cursor = 'ew-resize'
    document.addEventListener('mousemove', onMove)
    document.addEventListener('mouseup', onUp)
  }, [onMove, onUp])

  useEffect(() => {
    return () => {
      document.removeEventListener('mousemove', onMove)
      document.removeEventListener('mouseup', onUp)
    }
  }, [onMove, onUp])

  return (
    <ThemeProvider>
      <div className="relative w-screen h-screen overflow-hidden bg-[var(--bg)]">
        <div className="absolute inset-0 z-0" />
        <Header />
        <div
          className="absolute z-2 flex flex-col gap-1"
          style={{ top: COLUMN_TOP, right: COLUMN_RIGHT, bottom: COLUMN_BOTTOM, width: columnWidth }}
        >
          <div
            className="absolute left-0 top-0 bottom-0 w-2.5 cursor-ew-resize z-[3]"
            onMouseDown={onHandleDown}
          />
          <Card className="flex flex-col p-2 flex-shrink-0">
            <Section label="Histogram">
              <div className="h-24 bg-[#1a1a1f] rounded-lg" />
            </Section>
          </Card>
          <Card className="flex flex-col gap-2 p-2 flex-1 min-h-0 overflow-y-auto">
            <SectionDropdown label="Basic" defaultOpen>
              <Slider label="Exposure" value={exposure} onChange={setExposure} min={-4} max={4} decimalPlaces={2} formatValue={(v) => `${v > 0 ? '+' : ''}${v.toFixed(2)}`} ticks={[-4, 0, 4]} />
              <Slider label="Temperature" value={temp} onChange={setTemp} decimalPlaces={0} formatValue={(v) => `${v > 0 ? '+' : ''}${v}`} gradient="linear-gradient(to right, #3b82f6, #a8c8ff, #ffffff, #ffe08a, #f59e0b)" />
              <Slider label="Tint" value={tint} onChange={setTint} decimalPlaces={0} formatValue={(v) => `${v > 0 ? '+' : ''}${v}`} gradient="linear-gradient(to right, #22c55e, #a7f3d0, #ffffff, #f0abfc, #d946ef)" />
            </SectionDropdown>
            <SectionDropdown label="Colour">
              <div className="text-xs text-panel-text-2 py-2 text-center">Temperature, Tint, Saturation…</div>
            </SectionDropdown>
            <SectionDropdown label="Lens Correction" disabled />
          </Card>
        </div>
        <div
          className="absolute bottom-3 left-3 z-2"
          style={{ right: columnWidth + GAP * 2 }}
        >
          <Filmstrip />
        </div>
        <SettingsDialog />
      </div>
    </ThemeProvider>
  )
}
