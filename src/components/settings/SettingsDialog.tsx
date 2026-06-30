import { useSettingsStore } from '../../stores/settings-store'
import type { CategoryId } from '../../stores/settings-store'
import Dialog from '../ui/Dialog'
import Section from '../ui/Section'
import ThemeSettings from './ThemeSettings'

type NavItem = {
  id: CategoryId
  label: string
  disabled?: boolean
}

const navItems: NavItem[] = [
  { id: 'themes', label: 'Themes' },
  { id: 'storage', label: 'Storage', disabled: true },
  { id: 'performance', label: 'Performance', disabled: true },
  { id: 'keys', label: 'Keyboard shortcuts', disabled: true },
  { id: 'display', label: 'EXIF / Metadata', disabled: true },
  { id: 'workspace', label: 'Workspace', disabled: true },
]

export default function SettingsDialog() {
  const isOpen = useSettingsStore((s) => s.isOpen)
  const activeCategory = useSettingsStore((s) => s.activeCategory)
  const close = useSettingsStore((s) => s.close)
  const setActiveCategory = useSettingsStore((s) => s.setActiveCategory)

  return (
    <Dialog isOpen={isOpen} onClose={close} title="Settings" hideHeader>
      <div className="flex gap-5">
        <Section label="Settings" className="shrink-0">
          <div className="flex flex-col gap-0.5">
            {navItems.map((item) => {
              const active = activeCategory === item.id
              return (
                <button
                  key={item.id}
                  disabled={item.disabled}
                  onClick={() => {
                    if (!item.disabled) setActiveCategory(item.id)
                  }}
                  className={`rounded-lg px-3 py-1.5 text-sm text-left transition-colors ${
                    item.disabled
                      ? 'text-panel-text-3 cursor-default'
                      : active
                        ? 'bg-accent text-white font-medium'
                        : 'text-panel-text hover:bg-panel-hover'
                  }`}
                >
                  {item.label}
                </button>
              )
            })}
          </div>
        </Section>

        <div className="flex-1 min-w-0">
          {activeCategory === 'themes' && <ThemeSettings />}
          {activeCategory !== 'themes' && (
            <div className="flex items-center justify-center h-full min-h-[200px]">
              <p className="text-sm text-panel-text-3">Coming in a future version</p>
            </div>
          )}
        </div>
      </div>
    </Dialog>
  )
}
