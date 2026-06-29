import { useThemeStore, accentSwatches } from '../../stores/theme-store'
import type { ThemeMode } from '../../stores/theme-store'
import Section from '../ui/Section'
import Pill from '../ui/Pill'
import PillButton from '../ui/PillButton'
import Toggle from '../ui/Toggle'
import Slider from '../ui/Slider'

const modes: { id: ThemeMode; label: string }[] = [
  { id: 'white', label: 'White' },
  { id: 'light', label: 'Light' },
  { id: 'dark', label: 'Dark' },
  { id: 'black', label: 'Black' },
]

export default function ThemeSettings() {
  const mode = useThemeStore((s) => s.mode)
  const accent = useThemeStore((s) => s.accent)
  const highContrast = useThemeStore((s) => s.highContrast)
  const panelOpacity = useThemeStore((s) => s.panelOpacity)
  const grainStrength = useThemeStore((s) => s.grainStrength)
  const setMode = useThemeStore((s) => s.setMode)
  const setAccent = useThemeStore((s) => s.setAccent)
  const setHighContrast = useThemeStore((s) => s.setHighContrast)
  const setPanelOpacity = useThemeStore((s) => s.setPanelOpacity)
  const setGrainStrength = useThemeStore((s) => s.setGrainStrength)

  return (
    <div className="flex flex-col gap-4">
      <Section label="Theme">
        <div className="flex justify-center">
          <Pill className="w-fit">
            {modes.map((m) => (
              <PillButton
                key={m.id}
                active={mode === m.id}
                onClick={() => setMode(m.id)}
              >
                {m.label}
              </PillButton>
            ))}
          </Pill>
        </div>
      </Section>

      <Section label="Accent colour">
        <div className="flex justify-center gap-2.5 items-center">
          {accentSwatches.map((swatch) => (
            <button
              key={swatch}
              onClick={() => setAccent(swatch)}
              className="w-10 h-10 flex items-center justify-center"
              aria-label={`Accent ${swatch}`}
              title={swatch}
            >
              <div
                className={`rounded-full transition-all hover:scale-110 ${accent === swatch ? 'w-9 h-9' : 'w-7 h-7'}`}
                style={{ background: swatch }}
              />
            </button>
          ))}
        </div>
      </Section>

      <Section label="Display">
        <div className="flex flex-col gap-3">
          <Toggle
            checked={highContrast}
            onChange={setHighContrast}
            label="High contrast mode"
          />
          <Slider
            label="Panel opacity"
            value={panelOpacity}
            onChange={setPanelOpacity}
          />
          <Slider
            label="Grain strength"
            value={grainStrength}
            onChange={setGrainStrength}
          />
        </div>
      </Section>
    </div>
  )
}
