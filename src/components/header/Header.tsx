import { useState } from 'react'
import { useSettingsStore } from '../../stores/settings-store'
import Pill from '../ui/Pill'
import PillButton from '../ui/PillButton'

type ModuleId = 'library' | 'edit' | 'nodes' | 'lens'

const modules: { id: ModuleId; label: string; disabled?: boolean }[] = [
  { id: 'library', label: 'Library' },
  { id: 'edit', label: 'Edit' },
  { id: 'nodes', label: 'Nodes' },
  { id: 'lens', label: 'Lens', disabled: true },
]

export default function Header() {
  const [activeModule, setActiveModule] = useState<ModuleId>('library')
  const toggleSettings = useSettingsStore((s) => s.toggle)

  return (
    <header className="fixed top-3 left-3 z-[3] flex items-center gap-3 select-none">
      <Pill>
        {modules.map((m) => (
          <PillButton
            key={m.id}
            active={activeModule === m.id}
            disabled={m.disabled}
            onClick={() => setActiveModule(m.id)}
            title={m.disabled ? 'Coming in a future version' : m.label}
          >
            {m.label}
          </PillButton>
        ))}
      </Pill>

      <Pill>
        <PillButton
          icon
          onClick={toggleSettings}
          aria-label="Settings"
          title="Settings"
        >
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="12" cy="12" r="3" />
            <path d="M19.4 15a1.65 1.65 0 00.33 1.82l.06.06a2 2 0 01-2.83 2.83l-.06-.06a1.65 1.65 0 00-1.82-.33 1.65 1.65 0 00-1 1.51V21a2 2 0 01-4 0v-.09a1.65 1.65 0 00-1-1.51 1.65 1.65 0 00-1.82.33l-.06.06a2 2 0 01-2.83-2.83l.06-.06a1.65 1.65 0 00.33-1.82 1.65 1.65 0 00-1.51-1H3a2 2 0 010-4h.09a1.65 1.65 0 001.51-1 1.65 1.65 0 00-.33-1.82l-.06-.06a2 2 0 012.83-2.83l.06.06a1.65 1.65 0 001.82.33h.01a1.65 1.65 0 001-1.51V3a2 2 0 014 0v.09a1.65 1.65 0 001 1.51 1.65 1.65 0 001.82-.33l.06-.06a2 2 0 012.83 2.83l-.06.06a1.65 1.65 0 00-.33 1.82v.01a1.65 1.65 0 001.51 1H21a2 2 0 010 4h-.09a1.65 1.65 0 00-1.51 1z" />
          </svg>
        </PillButton>
      </Pill>
    </header>
  )
}
