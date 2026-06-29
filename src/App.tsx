import { useState } from 'react'
import ThemeProvider from './components/ThemeProvider'
import Header from './components/header/Header'
import SettingsDialog from './components/settings/SettingsDialog'
import Card from './components/ui/Card'
import Section from './components/ui/Section'
import SectionDropdown from './components/ui/SectionDropdown'
import Slider from './components/ui/Slider'

export default function App() {
  const [exposure, setExposure] = useState(0)
  const [temp, setTemp] = useState(0)
  const [tint, setTint] = useState(0)

  return (
    <ThemeProvider>
      <div className="w-screen h-screen flex flex-col">
        <Header />
        <div className="flex-1 flex items-center justify-center gap-4 p-4">
          <Card className="w-80 flex flex-col gap-2 p-2">
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

          <Card className="w-80 flex flex-col p-2">
            <Section label="Histogram">
              <div className="h-24 bg-[#1a1a1f] rounded-lg" />
            </Section>
          </Card>
        </div>
      </div>
      <SettingsDialog />
    </ThemeProvider>
  )
}
