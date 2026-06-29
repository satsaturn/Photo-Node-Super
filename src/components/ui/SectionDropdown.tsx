import { useState } from 'react'

type SectionDropdownProps = {
  label: string
  defaultOpen?: boolean
  disabled?: boolean
  children?: React.ReactNode
  className?: string
  actions?: React.ReactNode
}

export default function SectionDropdown({
  label,
  defaultOpen = false,
  disabled = false,
  children,
  className = '',
  actions,
}: SectionDropdownProps) {
  const [open, setOpen] = useState(defaultOpen && !disabled)

  return (
    <div
      className={`bg-[rgba(var(--panel-rgb),var(--panel-opacity,0.85))] border border-panel-border rounded-xl overflow-hidden mb-2 ${className}`}
    >
      <div
        onClick={() => {
          if (!disabled) setOpen(!open)
        }}
        className={`flex items-center gap-2 px-2 py-2 text-xs font-semibold select-none bg-panel-section ${
          disabled
            ? 'text-panel-text-3 cursor-default'
            : 'text-panel-text cursor-pointer'
        }`}
      >
        <span className="w-3.5 text-center text-panel-text-3 text-[9px]">
          {open ? '▾' : '▸'}
        </span>
        <span className="flex-1">{label}</span>
        {actions}
      </div>

      {open && children && (
        <div className="p-2">
          {children}
        </div>
      )}
    </div>
  )
}
