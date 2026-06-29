import { useCallback, useRef, useMemo } from 'react'

type SliderProps = {
  label: string
  value: number
  onChange: (value: number) => void
  min?: number
  max?: number
  decimalPlaces?: number
  className?: string
  formatValue?: (v: number) => string
  gradient?: string
  ticks?: number[]
}

export default function Slider({
  label,
  value,
  onChange,
  min = 0,
  max = 100,
  decimalPlaces = 0,
  className = '',
  formatValue = (v) => `${v.toFixed(decimalPlaces)}%`,
  gradient,
  ticks,
}: SliderProps) {
  const trackRef = useRef<HTMLDivElement>(null)

  const pct = useMemo(
    () => ((value - min) / (max - min)) * 100,
    [value, min, max]
  )

  const clamp = (v: number) => Math.max(min, Math.min(max, v))

  const valueFromPct = useCallback(
    (p: number) => {
      const f = Math.pow(10, decimalPlaces)
      return clamp(Math.round((min + (p / 100) * (max - min)) * f) / f)
    },
    [clamp, min, max, decimalPlaces]
  )

  const setFromEvent = useCallback(
    (clientX: number) => {
      const track = trackRef.current
      if (!track) return
      const rect = track.getBoundingClientRect()
      const p = ((clientX - rect.left) / rect.width) * 100
      onChange(valueFromPct(p))
    },
    [onChange, valueFromPct]
  )

  const onMouseDown = useCallback(
    (e: React.MouseEvent) => {
      e.preventDefault()
      setFromEvent(e.clientX)
      const onMove = (e2: MouseEvent) => {
        e2.preventDefault()
        setFromEvent(e2.clientX)
      }
      const onUp = () => {
        document.body.style.userSelect = ''
        window.removeEventListener('mousemove', onMove)
        window.removeEventListener('mouseup', onUp)
      }
      document.body.style.userSelect = 'none'
      window.addEventListener('mousemove', onMove)
      window.addEventListener('mouseup', onUp)
    },
    [setFromEvent]
  )

  return (
    <div className={`grid grid-cols-[1fr_auto] items-start gap-2 mb-2 select-none ${className}`}>
      <span className="text-[11px] text-panel-text-2">{label}</span>
      <span className="text-[10px] text-panel-text-3 tabular-nums text-right">
        {formatValue(value)}
      </span>
      <div
        ref={trackRef}
        className="h-[24px] flex flex-col cursor-pointer col-span-2 group p-1"
        onMouseDown={onMouseDown}
      >
        {ticks && (
          <div className="relative w-full h-[10px]">
            {ticks.map((t, i) => {
              const tp = ((t - min) / (max - min)) * 100
              return (
                <div
                  key={i}
                  className="absolute bottom-0 w-px h-[6px] bg-panel-text-3"
                  style={{ left: `${tp}%` }}
                />
              )
            })}
          </div>
        )}
        <div className="relative w-full h-[8px] rounded-sm mt-auto"
          style={{ background: gradient || 'var(--track-bg)' }}
        >
          <div
            className="absolute top-1/2 -translate-y-1/2 w-[12px] h-[12px] rounded-full bg-accent -translate-x-1/2 shadow-[0_0_0_1px_rgba(110,168,255,0.25)] pointer-events-none"
            style={{ left: `${pct}%` }}
          />
        </div>
      </div>
    </div>
  )
}
