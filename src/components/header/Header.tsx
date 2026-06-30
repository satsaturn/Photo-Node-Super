import { useSettingsStore } from '../../stores/settings-store'
import Pill from '../ui/Pill'
import PillButton from '../ui/PillButton'
import { GearIcon } from '../ui/icons'

export type ModuleId = 'library' | 'edit' | 'nodes' | 'lens'

const modules: { id: ModuleId; label: string; disabled?: boolean }[] = [
  { id: 'library', label: 'Library' },
  { id: 'edit', label: 'Edit' },
  { id: 'nodes', label: 'Nodes' },
  { id: 'lens', label: 'Lens', disabled: true },
]

type HeaderProps = {
  activeModule: ModuleId
  onModuleChange: (id: ModuleId) => void
}

export default function Header({ activeModule, onModuleChange }: HeaderProps) {
  const toggleSettings = useSettingsStore((s) => s.toggle)

  return (
    <header className="fixed top-3 left-3 z-[3] flex items-center gap-3 select-none">
      <Pill>
        {modules.map((m) => (
          <PillButton
            key={m.id}
            active={activeModule === m.id}
            disabled={m.disabled}
            onClick={() => onModuleChange(m.id)}
            title={m.disabled ? 'Coming in a future version' : m.label}
          >
            {m.label}
          </PillButton>
        ))}
      </Pill>

      <Pill>
        <PillButton
          variant="icon"
          onClick={toggleSettings}
          aria-label="Settings"
          title="Settings"
        >
          <GearIcon />
        </PillButton>
      </Pill>
    </header>
  )
}
